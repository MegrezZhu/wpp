import * as assert from 'assert';
import { emptyDir, ensureDir, ensureFile, move, readJSON, unlink, writeJSON } from 'fs-extra';
import { basename, resolve } from 'path';
import { paths } from '../config';
import logger from '../lib/logger';
import { filter, sha1 } from '../lib/tools';
import { BaseProvider, IWallpaper } from './Base';

import './globalErrorHandling';

interface IHistory {
  hashSet: Set<string>;
}

interface ISetting {
  dest: string;
}

export default class Core {
  private providers: BaseProvider[] = [];

  public run () {
    for (const provider of this.providers) {
      provider.run();
    }
  }

  public async runOnce (): Promise<void> {
    await Promise.all(this.providers.map(provider => provider.runOnce()));
  }

  public registProvider (...providers: BaseProvider[]) {
    for (const provider of providers) {
      this.providers.push(provider);
      provider.on(BaseProvider.NewWallpapers, wallpapers => {
        this.onNewWallpaper(wallpapers, provider.name);
      });
    }
  }

  public async init (): Promise<void> {
    await Promise.all([
      ensureDir(paths.home),
      ensureDir(paths.logs),
      emptyDir(paths.temp),
      ensureFile(paths.history),
      ensureFile(paths.settings)
    ]);
  }

  private async loadHistory (): Promise<IHistory> {
    const json = await readJSON(paths.history, { throws: false });
    return {
      hashSet: new Set(json && json.hashSet || [])
    };
  }

  private async storeHistory (history: IHistory): Promise<void> {
    await writeJSON(
      paths.history,
      { hashSet: [...history.hashSet.values()] },
      { spaces: 2 }
    );
  }

  private async loadSetting (): Promise<ISetting> {
    const json = await readJSON(paths.settings, { throws: false });
    return json || {};
  }

  private async onNewWallpaper (wallpapers: IWallpaper[], providerName: string) {
    const setting = await this.loadSetting();
    const history = await this.loadHistory();

    const newWallpaper = await filter(wallpapers, async wallpaper => {
      // check duplicated
      const hash = await sha1(wallpaper.path);
      if (history.hashSet.has(hash)) {
        return false;
      }
      history.hashSet.add(hash);
      return true;
    });

    // move to dest
    assert(setting.dest, 'destination path not specified yet.');
    await Promise.all(newWallpaper.map(wallpaper => move(wallpaper.path, resolve(setting.dest, basename(wallpaper.path)))));

    // remove duplicate wallpapers
    await Promise.all(wallpapers.map(wpp => unlink(wpp.path)));

    // history writeback
    await this.storeHistory(history);

    logger.info(`${providerName} - ${newWallpaper.length} new wallpaper(s).`);
  }
}
