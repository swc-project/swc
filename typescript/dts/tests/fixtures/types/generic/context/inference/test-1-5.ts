type Box<T> = { value: T };

declare function box<V>(x: V): Box<V>;
