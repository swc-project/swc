declare function wrap<A, B>(f: (a: A) => B): (a: A) => B;

declare function list<T>(a: T): T[];

const f02: <C>(x: C) => C[] = wrap(list);
