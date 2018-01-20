import { resolve } from 'path';

const home = resolve(process.env.USERPROFILE, '.wpp');

export const paths = {
  home,
  logs: resolve(home, 'logs'),
  temp: resolve(home, 'temp'),
  daemon: resolve(home, 'daemon'),
  settings: resolve(home, 'settings.json'),
  history: resolve(home, 'history.json'),
  pjson: resolve(__dirname, '../package.json')
};
