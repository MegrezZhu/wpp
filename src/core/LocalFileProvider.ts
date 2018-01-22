import { copy, readdir, stat } from 'fs-extra';
import sizeOf = require('image-size');
import { resolve } from 'path';
import { promisify } from 'util';
import { BaseProvider, IProviderConfig, IWallpaper } from '../core/Base';
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
    // FIXME: whatif there is a subdir?
    const files = (await readdir(this.dirPath)).map(file => {
      return {
        path: resolve(this.dirPath, file)
      } as IWallpaper;
    });

    const images = await filter(files, async file => {
      const { height, width } = await (promisify(sizeOf) as any)(file.path);
      return height && width; // is image
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
