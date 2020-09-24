declare class Shape {
    name: string;
    width: number;
    height: number;
    visible: boolean;
}
declare class TaggedShape extends Shape {
    tag: string;
}
declare class Item {
    name: string;
    price: number;
}
declare class Options {
    visible: "yes" | "no";
}
declare type Dictionary<T> = {
    [x: string]: T;
};
declare type NumericallyIndexed<T> = {
    [x: number]: T;
};
declare const enum E {
    A = 0,
    B = 1,
    C = 2
}
declare type KeyOf<T> = keyof T;
declare type NAME = "name";
declare type WIDTH_OR_HEIGHT = "width" | "height";
declare let cond: boolean;
declare function getProperty<T, K extends keyof T>(obj: T, key: K): T[K];
declare function setProperty<T, K extends keyof T>(obj: T, key: K, value: T[K]): void;

declare var shape: Shape;

let name = getProperty(shape, "name");  // string
let widthOrHeight = getProperty(shape, cond ? "width" : "height");  // number
let nameOrVisible = getProperty(shape, cond ? "name" : "visible");  // string | boolean
setProperty(shape, "name", "rectangle");
setProperty(shape, cond ? "width" : "height", 10);
setProperty(shape, cond ? "name" : "visible", true);  // Technically not safe
