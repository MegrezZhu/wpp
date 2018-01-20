import { copy, readdir, stat } from 'fs-extra';
import sizeOf = require('image-size');
import { resolve } from 'path';
import { promisify } from 'util';
import { BaseProvider, IWallpaper } from '../core/Base';
import { filter } from '../lib/tools';

export class LocalDirProvider extends BaseProvider {
  public constructor (private dirPath: string, interval: number, name?: string) {
    super(name || 'LocalDirProvider', interval);
  }

  public async provide (): Promise<IWallpaper[]> {
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
      const newPath = resolve(BaseProvider.TempDir, this.genFilename(wallpaper.date));
      await copy(wallpaper.path, newPath);
      wallpaper.path = newPath;
      return wallpaper;
    }));
  }
}
