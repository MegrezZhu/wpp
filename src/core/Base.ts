import idGen = require('crypto-random-string');
import { EventEmitter } from 'events';
import moment = require('moment');
import { resolve } from 'path';
import { paths } from '../config';
import logger from '../lib/logger';
import { timeout } from '../lib/tools';

export interface IWallpaper {
  path: string;
  date: Date;
}

export abstract class BaseProvider extends EventEmitter {
  public static readonly NewWallpapers = 'NewWallpapers';
  public static readonly TempDir = paths.temp;

  public readonly name: string;
  protected readonly interval: number;

  protected constructor (name: string, interval: number) {
    super();

    this.name = name;
    this.interval = interval;
  }

  public abstract async provide (): Promise<IWallpaper[]>;

  public async run (): Promise<never> {
    while (true) {
      try {
        await this.runOnce();
      } finally {
        await timeout(this.interval);
      }
    }
  }

  public async runOnce (): Promise<void> {
    try {
      const res = await this.provide();
      if (!this.pathCheck(res)) {
        logger.warn('all provided files should be placed in temp dir.');
      }
      this.emit(BaseProvider.NewWallpapers, res);
    } catch (err) {
      logger.warn(`${this.name} - ${err.message}`);
    }
  }

  protected genFilename (date: Date): string {
    const dateStr = moment(date).format('YYYY-MM-DD');
    return `${dateStr}_${idGen(16)}.jpg`;
  }

  protected genTempFilepath (date: Date = new Date()): string {
    return resolve(BaseProvider.TempDir, this.genFilename(date));
  }

  private pathCheck (wpps: IWallpaper[]): boolean {
    return wpps.every(wpp => resolve(wpp.path, '..') === BaseProvider.TempDir);
  }
}
