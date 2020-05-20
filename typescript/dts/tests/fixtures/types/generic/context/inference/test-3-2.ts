type Box<T> = { value: T };

const arrayMap = <T, U>(f: (x: T) => U) => (a: T[]) => a.map(f);

const f21: <A>(a: A[]) => A[][] = arrayMap(x => [x]);
