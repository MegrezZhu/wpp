import idGen = require('crypto-random-string');
import { EventEmitter } from 'events';
import moment = require('moment');
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

  protected readonly name: string;
  protected readonly interval: number;

  private tempWallpapers: IWallpaper[] = [];

  protected constructor (name: string, interval: number) {
    super();

    this.name = name;
    this.interval = interval;
  }

  public abstract async provide (): Promise<IWallpaper[]>;

  public async run (): Promise<never> {
    while (true) {
      try {
        const res = await this.provide();
        // TODO: check: all files are placed in temp dir
        this.emit(BaseProvider.NewWallpapers, res);
      } finally {
        await timeout(this.interval);
      }
    }
  }

  public async clearTempFiles (): Promise<void> {
    try {
      // TODO:
    } catch (err) {
      logger.error(err);
    }
  }

  protected genFilename (date: Date): string {
    const dateStr = moment(date).format('YYYY-MM-DD');
    return `${dateStr}_${idGen(16)}.jpg`;
  }
}
