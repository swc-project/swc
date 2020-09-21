type Box<T> = { value: T };

const arrayMap = <T, U>(f: (x: T) => U) => (a: T[]) => a.map(f);

const f20: (a: string[]) => number[] = arrayMap(x => x.length);
