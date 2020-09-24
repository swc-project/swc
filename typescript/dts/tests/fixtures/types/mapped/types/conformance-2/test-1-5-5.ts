// @strictNullChecks: true
// @declaration: true

type Proxy<T> = {
    get(): T;
    set(value: T): void;
}

type Proxify<T> = {
    [P in keyof T]: Proxy<T[P]>;
}

declare function proxify<T>(obj: T): Proxify<T>;

interface Point {
    x: number;
    y: number;
}

interface Shape {
    name: string;
    width: number;
    height: number;
    location: Point;
}

declare var shape: Shape;
const p = proxify(shape);
let name = p.name.get();
p.width.set(42);
