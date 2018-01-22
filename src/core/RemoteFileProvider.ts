import { createWriteStream } from 'fs-extra';
import { BaseProvider, IProviderConfig, IWallpaper } from '../core/Base';
import { ax } from '../lib/axios';

type URLGenerator = () => Promise<string[]> | string[];

export interface IRemoteProviderConfig extends IProviderConfig {
  baseURL: string;
  genURL: URLGenerator;
}

export class RemoteFileProvider extends BaseProvider {
  private genURL: URLGenerator;
  private baseURL: string;

  public constructor (config: IRemoteProviderConfig) {
    super(config);

    this.baseURL = config.baseURL;
    this.genURL = config.genURL;
  }

  public async provide (): Promise<IWallpaper[]> {
    const urls = await this.genURL();

    // download images
    const wpps = await Promise.all(
      urls.map(async (url: string): Promise<IWallpaper> => {
        const res = await ax.get(url, {
          baseURL: this.baseURL,
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
