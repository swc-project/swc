type Box<T> = { value: T };

declare function wrap<A, B>(f: (a: A) => B): (a: A) => B;
