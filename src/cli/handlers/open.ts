import { exec } from 'shelljs';
import { loadSetting } from '../../lib/tools';

export default async function () {
  const setting = await loadSetting();
  exec(`start ${setting.dest}`);
}
