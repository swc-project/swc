type Box<T> = { value: T };

declare function compose<A, B, C>(f: (a: A) => B, g: (b: B) => C): (a: A) => C;

declare function list<T>(a: T): T[];

declare function box<V>(x: V): Box<V>;

const f11: <T>(x: T) => Box<T[]> = compose(list, box);
