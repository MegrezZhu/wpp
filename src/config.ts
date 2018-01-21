import { resolve } from 'path';

const home = resolve(process.env.USERPROFILE, '.wpp');

export const paths = {
  home,
  dist: resolve(__dirname, '../dist'),
  logs: resolve(home, 'logs'),
  temp: resolve(home, 'temp'),
  settings: resolve(home, 'settings.json'),
  history: resolve(home, 'history.json'),
  pjson: resolve(__dirname, '../package.json')
};
