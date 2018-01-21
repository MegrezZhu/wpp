import { remove } from 'fs-extra';
import { paths } from '../../config';

export default async function () {
  await Promise.all([
    remove(paths.settings),
    remove(paths.history)
  ]);
}
