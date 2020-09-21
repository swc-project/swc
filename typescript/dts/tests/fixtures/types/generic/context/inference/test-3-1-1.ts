type Box<T> = { value: T };

const arrayMap = <T, N>(f: (x: T) => N) => (a: T[]) => a.map(f);

const f20: (a: string[]) => number[] = arrayMap(x => x.length);
