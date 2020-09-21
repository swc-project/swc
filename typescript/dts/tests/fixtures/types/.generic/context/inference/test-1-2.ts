type Box<T> = { value: T };

declare function compose<A, B, C>(f: (a: A) => B, g: (b: B) => C): (a: A) => C;
