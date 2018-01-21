import { loadSetting } from '../../lib/tools';
import { service } from '../../service/index';

export default async function () {
  await loadSetting(); // check setting availability
  service.install();
}
