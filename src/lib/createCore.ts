import Core from '../core/Core';
import { LocalDirProvider } from '../sources/localDir';
import Every from './Every';
import { loadSetting } from './tools';

export function createCore (): Core {
  const setting = loadSetting();

  const core = new Core();

  // TODO: regist providers according to settings

  return core;
}
