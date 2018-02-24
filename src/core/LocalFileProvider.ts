import { copy, pathExists, readdir, stat } from 'fs-extra';
import sizeOf = require('image-size');
import { resolve } from 'path';
import { promisify } from 'util';
import { BaseProvider, IProviderConfig, IWallpaper } from '../core/Base';
import logger from '../lib/logger';
import { filter } from '../lib/tools';

export interface ILocalProviderConfig extends IProviderConfig {
  dirPath: string;
}

export class LocalFileProvider extends BaseProvider {
  private dirPath: string;

  public constructor (config: ILocalProviderConfig) {
    super(config);

    this.dirPath = config.dirPath;
  }

  public async provide (): Promise<IWallpaper[]> {
    if (!await pathExists(this.dirPath)) {
      logger.warn(`${this.name} - path not exists.`);
      return [];
    }

    // FIXME: whatif there is a subdir?
    const files = (await readdir(this.dirPath)).map(file => {
      return {
        path: resolve(this.dirPath, file)
      } as IWallpaper;
    });

    const images = await filter(files, async file => {
      try {
        const { height, width } = await (promisify(sizeOf) as any)(file.path);
        return height && width && width >= 1920; // is image
      } catch (err) {
        // unsupported file type
        return false;
      }
    });

    return await Promise.all(images.map(async wallpaper => {
      const state = await stat(wallpaper.path);
      wallpaper.date = state.mtime;
      const newPath = this.genTempFilepath(wallpaper.date);
      await copy(wallpaper.path, newPath);
      wallpaper.path = newPath;
      return wallpaper;
    }));
  }
}
