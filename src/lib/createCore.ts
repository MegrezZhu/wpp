import Core from '../core/Core';
import { providers } from '../sources';
import { loadSetting } from './tools';

export async function createCore (): Promise<Core> {
  await loadSetting();

  const core = new Core();

  for (const provider of Object.values(providers)) {
    // TODO: regist providers according to settings
    core.registProvider(provider);
  }

  return core;
}
