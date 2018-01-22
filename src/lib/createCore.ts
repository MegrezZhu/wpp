import Core from '../core/Core';
import { providers } from '../sources';
import { loadSetting } from './tools';

export function createCore (): Core {
  const setting = loadSetting();

  const core = new Core();

  for (const [name, provider] of Object.entries(providers)) {
    // TODO: regist providers according to settings
    core.registProvider(provider);
  }

  return core;
}
