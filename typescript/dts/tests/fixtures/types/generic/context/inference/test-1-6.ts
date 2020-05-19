type Box<T> = { value: T };

declare function unbox<W>(x: Box<W>): W;
