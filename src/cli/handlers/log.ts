import { pathExists } from 'fs-extra';
import moment = require('moment');
import { resolve } from 'path';
import { exec } from 'shelljs';
import { paths } from '../../config';

export default async function () {
  const logPath = resolve(paths.logs, `${moment.utc().format('YYYY-MM-DD')}.log`);
  if (await pathExists(logPath)) {
    exec(`more ${logPath}`);
  }
}
