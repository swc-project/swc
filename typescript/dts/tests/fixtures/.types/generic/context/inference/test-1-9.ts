type Box<T> = { value: T };

declare function zip<A, B>(a: A, b: B): [A, B];