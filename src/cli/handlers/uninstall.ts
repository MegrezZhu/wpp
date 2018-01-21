import { paths } from '../../config';
import { service } from '../../service/index';

export default async function () {
  service._directory = paths.home;
  service.uninstall();
}
