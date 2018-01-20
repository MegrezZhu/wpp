import * as assert from 'assert';
import { createHash } from 'crypto';
import { emptyDir, ensureDir, ensureFile, readFile, readJSON, writeJSON } from 'fs-extra';
import { paths } from '../config';

export async function filter<T> (items: T[], pred: (item: T) => Promise<boolean> | boolean) {
  const res: T[] = [];
  await Promise.all(items.map(async item => {
    if (await pred(item)) {
      res.push(item);
    }
  }));
  return res;
}

export async function timeout (time: number) {
  return new Promise(resolve => {
    setTimeout(resolve, time);
  }) as Promise<void>;
}

export async function sha1 (filepath: string) {
  const gen = createHash('sha1');
  gen.update(await readFile(filepath));
  return gen.digest('hex');
}

interface IHistory {
  hashSet: Set<string>;
}

interface ISetting {
  dest: string;
}

export async function loadHistory (): Promise<IHistory> {
  const json = await readJSON(paths.history, { throws: false });
  // TODO: re-calculate hashes if hashSet is empty
  return {
    hashSet: new Set(json && json.hashSet || [])
  };
}

export async function storeHistory (history: IHistory): Promise<void> {
  await writeJSON(
    paths.history,
    { hashSet: [...history.hashSet.values()] },
    { spaces: 2 }
  );
}

export async function loadSetting (): Promise<ISetting> {
  const json = await readJSON(paths.settings, { throws: false }) || {};
  assert(json.dest, 'warn: settings not detected, complete configuration first');
  return json;
}

export async function storeSetting (setting: ISetting): Promise<void> {
  await writeJSON(paths.settings, setting, { spaces: 2 });
}

export async function initDirs (): Promise<void> {
  await Promise.all([
    ensureDir(paths.home),
    ensureDir(paths.logs),
    emptyDir(paths.temp),
    ensureFile(paths.history),
    ensureFile(paths.settings)
  ]);
}
