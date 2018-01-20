import 'source-map-support/register';

import logger from '../lib/logger';

const isDev = process.env.NODE_ENV !== 'production';

process.on('uncaughtException', (err: any) => {
  logger.error(err);
  if (isDev) {
    console.error(err);
  }
});

process.on('unhandledRejection', (err, p) => {
  logger.error(err);
  if (isDev) {
    console.error(err);
  }
});
