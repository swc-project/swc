type Box<T> = { value: T };

declare function wrap<A, B>(f: (a: A) => B): (a: A) => B;

declare function compose<A, B, C>(f: (a: A) => B, g: (b: B) => C): (a: A) => C;

declare function list<T>(a: T): T[];

declare function unlist<T>(a: T[]): T;

declare function box<V>(x: V): Box<V>;

declare function unbox<W>(x: Box<W>): W;

declare function map<T, U>(a: T[], f: (x: T) => U): U[];

declare function identity<T>(x: T): T;

declare function zip<A, B>(a: A, b: B): [A, B];

declare function flip<X, Y, Z>(f: (x: X, y: Y) => Z): (y: Y, x: X) => Z;

const f10: <T>(x: T) => Box<T[]> = compose(a => list(a), b => box(b));
