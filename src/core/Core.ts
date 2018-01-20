import { emptyDir, ensureDir, ensureFile, readJSON, writeJSON } from 'fs-extra';
import { paths } from '../config';
import logger from '../lib/logger';
import { BaseProvider, IWallpaper } from './Base';

interface IHistory {
  lastUpdate: Date;
  hashSet: Set<string>;
}

export default class Core {
  private history: IHistory;

  public registProvider (...providers: BaseProvider[]) {
    for (const provider of providers) {
      provider.run();

      provider.on(BaseProvider.NewWallpapers, this.onNewWallpaper.bind(this));
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

    this.history = await this.loadHistory();
  }

  private async loadHistory (): Promise<IHistory> {
    const json = await readJSON(paths.history, { throws: false });
    return {
      lastUpdate: new Date(json && json.lastUpdate || 0),
      hashSet: new Set(json && json.lastUpdate || [])
    };
  }

  private async storeHistory (): Promise<void> {
    await writeJSON(
      paths.history,
      {
        lastUpdate: this.history.lastUpdate.valueOf(),
        hashSet: [...this.history.hashSet.values()]
      },
      {
        spaces: 2
      }
    );
  }

  private async onNewWallpaper (wallpapers: IWallpaper[]) {
    logger.debug(`${wallpapers.length} wallpapers emitted`);
  }
}
