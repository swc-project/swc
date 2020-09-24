// @strictNullChecks: true
// @declaration: true

type Proxy<T> = {
    get(): T;
    set(value: T): void;
}

type Proxify<T> = {
    [P in keyof T]: Proxy<T[P]>;
}

const p = proxify(shape);
let name = p.name.get();
p.width.set(42);
