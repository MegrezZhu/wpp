import { resolve } from 'path';
import winston = require('winston');
import 'winston-daily-rotate-file';
import { paths } from '../config';

const isDev = process.env.NODE_ENV !== 'production';

function formatter (options: { message?: string; level: string; meta?: any }) {
  const now = new Date();
  const timestamp = `[${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}]`;
  const format = `${timestamp} ${options.level.toUpperCase()}: ${options.message ? options.message : ''} ${options.meta && Object.keys(options.meta).length ? 'META: ' + JSON.stringify(options.meta) : ''}`;
  return format;
}

const transports = [
  new winston.transports.File({
    name: 'error-log',
    filename: resolve(paths.logs, './error.log'),
    level: 'error',
    json: false,
    formatter
  }),
  new winston.transports.DailyRotateFile({
    filename: resolve(paths.logs, './log'),
    datePattern: 'yyyy-MM-dd.',
    prepend: true,
    level: 'info',
    json: false,
    formatter
  })
];

if (isDev) {
  transports.push(new winston.transports.Console());
}

const logger = new winston.Logger({
  level: isDev ? 'debug' : 'info',
  transports
});

export default logger;
