import { resolve } from 'path';

const home = resolve(process.env.USERPROFILE, '.wpp');

export const paths = {
  logs: resolve(home, 'logs'),
  history: resolve(home, 'history.json')
};
