const arrayMap = <A, B>(f: (x: A) => B) => (a: A[]) => a.map(f);

const f20: (a: string[]) => number[] = arrayMap(x => x.length);
