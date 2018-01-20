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
