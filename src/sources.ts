import { BaseProvider } from './core/Base';
import { LocalFileProvider } from './core/LocalFileProvider';
import { RemoteFileProvider } from './core/RemoteFileProvider';
import { ax } from './lib/axios';
import Every from './lib/Every';

interface IProviders {
  [name: string]: BaseProvider;
}

export const providers: IProviders = {
  Bing: new RemoteFileProvider({
    name: 'Bing',
    interval: Every.Half.Hour,
    baseURL: 'https://www.bing.com/',
    genURL: async (): Promise<string[]> => {
      const { data } = await ax.get('https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=500');
      const { images }: { images: Array<{ urlbase: string }> } = data;
      return images.map(o => `${o.urlbase}_1920x1080.jpg`);
    }
  }),

  Unsplash: new RemoteFileProvider({
    name: 'Unsplash',
    interval: Every.Half.Day,
    baseURL: '',
    genURL: (): string[] => {
      return ['https://source.unsplash.com/1920x1080?wallpaper'];
    }
  })
};
