/**
 * just for fun :)
 */

class TimeMultiplier {
  constructor (protected mult = 1) { }

  public get Millisecond (): number {
    return this.mult * 1;
  }

  public get Second (): number {
    return this.Millisecond * 1000;
  }

  public get Minute (): number {
    return this.Second * 60;
  }

  public get Hour (): number {
    return this.Minute * 60;
  }

  public get Day (): number {
    return this.Hour * 24;
  }

  public get Week (): number {
    return this.Day * 7;
  }
}

class Every extends TimeMultiplier {
  public Every (mult = 1) {
    this.mult = mult;
  }

  public get Two (): TimeMultiplier {
    return new TimeMultiplier(this.mult * 2);
  }

  public get Five (): TimeMultiplier {
    return new TimeMultiplier(this.mult * 5);
  }

  public get Ten (): TimeMultiplier {
    return new TimeMultiplier(this.mult * 10);
  }

  public get Twenty (): TimeMultiplier {
    return new TimeMultiplier(this.mult * 20);
  }

  public get Thirty (): TimeMultiplier {
    return new TimeMultiplier(this.mult * 30);
  }

  public get Half (): TimeMultiplier {
    return new Every(this.mult * 0.5);
  }
}

export default new Every();
