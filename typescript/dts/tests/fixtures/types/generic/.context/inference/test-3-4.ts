type Box<T> = { value: T };

const arrayMap = <T, U>(f: (x: T) => U) => (a: T[]) => a.map(f);

const f23: <A>(a: A[]) => Box<A>[] = arrayMap(value => ({value}));
