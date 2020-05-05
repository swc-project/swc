type Box<T> = { value: T };

const arrayFilter = <T>(f: (x: T) => boolean) => (a: T[]) => a.filter(f);

const f31: <T extends Box<number>>(a: T[]) => T[] = arrayFilter(x => x.value > 10);
