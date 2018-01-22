import nodeWin = require('node-windows');
import { resolve } from 'path';
import { paths } from '../config';
import logger from '../lib/logger';

const serviceConfig = {
  name: 'wpp',
  description: 'wpp wallpaper providing service',
  script: resolve(paths.dist, 'service/runner.js'),
  env: [
    { name: 'USERPROFILE', value: process.env.USERPROFILE },
    { name: 'localappdata', value: process.env.localappdata },
    { name: 'NODE_ENV', value: 'production' }
  ]
};

// Create a new service object
export const service = new nodeWin.Service(serviceConfig);
service._directory = paths.home;

// Listen for the "install" event, which indicates the
// process is available as a service.
service.on('install', () => {
  logger.info('service installed');
  service.start();
  logger.info('service started');
});

// Listen for the "uninstall" event so we know when it's done.
service.on('uninstall', () => {
  logger.info('Uninstall complete.');
  // logger.info('The service exists: ', service.exists ? 'yes' : 'no');
});
