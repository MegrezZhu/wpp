import * as assert from 'assert';
import { move, remove } from 'fs-extra';
import { basename, resolve } from 'path';
import logger from '../lib/logger';
import { filter, loadHistory, loadSetting, sha1, storeHistory } from '../lib/tools';
import { BaseProvider, IWallpaper } from './Base';

import './globalErrorHandling';

export default class Core {
  private providers: BaseProvider[] = [];

  public run () {
    for (const provider of this.providers) {
      provider.run();
    }
    logger.info(`wpp started.`);
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

  private async onNewWallpaper (wallpapers: IWallpaper[], providerName: string) {
    const setting = await loadSetting();
    const history = await loadHistory();

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
    await Promise.all(wallpapers.map(wpp => remove(wpp.path)));

    // history writeback
    await storeHistory(history);

    logger.info(`${providerName} - ${newWallpaper.length} new wallpaper(s).`);
  }
}
