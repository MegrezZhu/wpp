import { BaseProvider, Wallpaper } from './Base';

export default class Processor {
  public registProvider (...providers: BaseProvider[]) {
    for (const provider of providers) {
      // TODO:
    }
  }

  public async update (...images: Wallpaper[]): Promise<number> {
    for (const image of images) {
    }
    return 0;
  }
}
