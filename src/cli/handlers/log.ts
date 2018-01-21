import { exists } from 'fs-extra';
import moment = require('moment');
import { resolve } from 'path';
import { exec } from 'shelljs';
import { promisify } from 'util';
import { paths } from '../../config';

export default async function () {
  const logPath = resolve(paths.logs, `${moment.utc().format('YYYY-MM-DD')}.log`);
  if (await promisify(exists)(logPath)) {
    exec(`more ${logPath}`);
  }
}
