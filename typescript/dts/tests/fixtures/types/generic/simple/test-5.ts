declare function list<T>(a: T): T[];

const f00: <A>(x: A) => A[] = list;
