type Box<T> = { value: T };

declare function box<V>(x: V): Box<V>;

const f11: <T>(x: T) => Box<T> = box;
