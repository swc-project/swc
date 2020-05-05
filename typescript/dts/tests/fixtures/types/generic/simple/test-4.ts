declare function wrap<A, B>(f: (a: A) => B): (a: A) => B;

const f03: <A>(x: A) => A[] = wrap(x => [x]);
