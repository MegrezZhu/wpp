import { createWriteStream } from 'fs-extra';
import { BaseProvider, IWallpaper } from '../core/Base';
import { ax } from '../lib/axios';

export class BingProvider extends BaseProvider {
  public constructor (interval: number) {
    super('Bing', interval);
  }

  public async provide (): Promise<IWallpaper[]> {
    const { data } = await ax.get('https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=500');
    const { images }: { images: Array<{ urlbase: string }> } = data;
    const urls = images.map(o => o.urlbase);

    // download images
    const wpps = await Promise.all(
      urls.map(async (url: string): Promise<IWallpaper> => {
        const res = await ax.get(`${url}_1920x1080.jpg`, {
          baseURL: 'https://www.bing.com/',
          responseType: 'stream'
        });

        const date = new Date();
        const wpp: IWallpaper = { path: this.genTempFilepath(date), date };

        const fileStream = createWriteStream(wpp.path);
        res.data.pipe(fileStream);

        return new Promise<IWallpaper>((resolve, reject) => {
          fileStream.on('finish', () => resolve(wpp));
          fileStream.on('error', reject);
        });
      })
    );

    return wpps;
  }
}
