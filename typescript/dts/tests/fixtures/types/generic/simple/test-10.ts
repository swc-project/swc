type Box<T> = { value: T };

declare function compose<A, B, C>(f: (a: A) => B, g: (b: B) => C): (a: A) => C;

declare function unlist<T>(a: T[]): T;

declare function unbox<W>(x: Box<W>): W;


const f13: <T>(x: Box<T[]>) => T = compose(unbox, unlist);
