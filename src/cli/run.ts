#!/usr/bin/env node

import '../core/globalErrorHandling';

import program = require('commander');
import { readJSONSync } from 'fs-extra';
import { paths } from '../config';

import * as handlers from './handlers';

program
  .usage('[options] [command]')
  .version(readJSONSync(paths.pjson).version);

program
  .command('config')
  .description('start configuration')
  .action(handlers.config);

program
  .command('update')
  .description('check and update wallpapers')
  .action(handlers.update);

program
  .command('run')
  .description('continuously run')
  .action(handlers.run);

program
  .command('install')
  .description('install wpp as a windows service')
  .action(handlers.install);

program
  .command('uninstall')
  .description('uninstall wpp service')
  .action(handlers.uninstall);

program
  .command('open')
  .description('open destination directory')
  .action(handlers.open);

program
  .command('log')
  .description('list today\'s logs')
  .action(handlers.log);

program
  .command('clear')
  .description('clear history and settings')
  .action(handlers.clear);

program.parse(process.argv);
