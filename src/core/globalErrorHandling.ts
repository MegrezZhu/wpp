import 'source-map-support/register';

import logger from '../lib/logger';

const isDev = process.env.NODE_ENV !== 'production';

process.on('uncaughtException', (err: any) => {
  logger.error(isDev ? err : err.message);
});

process.on('unhandledRejection', (err, p) => {
  logger.error(isDev ? err : err.message);
});
