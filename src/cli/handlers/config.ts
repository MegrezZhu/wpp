import { pathExists, readJSON, writeJSON, ensureFile } from 'fs-extra';
import inq = require('inquirer');
import { resolve } from 'path';
import { mkdir } from 'shelljs';
import { paths } from '../../config';
import { initDirs } from '../../lib/tools';

export default async function () {
  await initDirs();
  await ensureFile(paths.settings);
  const setting = await readJSON(paths.settings, { throws: false }) || {};

  // prompting target folder
  while (true) {
    let { targetDir } = await inq.prompt({
      name: 'targetDir',
      message: 'target folder to which wallpapers are copied:',
      default: () => setting.targetDir || process.cwd()
    });
    targetDir = resolve(process.cwd(), targetDir);

    if (await pathExists(targetDir)) {
      setting.dest = targetDir;
      break;
    } else {
      const { confirm } = await inq.prompt({
        name: 'confirm',
        type: 'confirm',
        message: () => `Path "${targetDir}" does not exist, do you want to create it?`,
        default: true
      });
      if (confirm) {
        await mkdir(targetDir);
        setting.dest = targetDir;
        break;
      }
    }
  }

  // writeback
  await writeJSON(paths.settings, setting, { spaces: 2 });
}
