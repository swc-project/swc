// @strictNullChecks: true
// @declaration: true

type Proxy<T> = {
    get(): T;
    set(value: T): void;
}

type Proxify<T> = {
    [P in keyof T]: Proxy<T[P]>;
}

interface Shape {
    name: string;
    width: number;
}

declare const p: Proxify<Shape>
let name = p.name.get();
p.width.set(42);
