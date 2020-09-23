// @strictNullChecks: true
// @declaration: true

class Shape {
    name: string;
    width: number;
    height: number;
    visible: boolean;
}

class TaggedShape extends Shape {
    tag: string;
}

class Item {
    name: string;
    price: number;
}

class Options {
    visible: "yes" | "no";
}

type Dictionary<T> = { [x: string]: T };
type NumericallyIndexed<T> = { [x: number]: T };

const enum E { A, B, C }

type KeyOf<T> = keyof T;

type NAME = "name";
type WIDTH_OR_HEIGHT = "width" | "height";

type Q40 = (Shape | Options)["visible"];  // boolean | "yes" | "no"
type Q41 = (Shape & Options)["visible"];  // true & "yes" | true & "no" | false & "yes" | false & "no"

type Q50 = Dictionary<Shape>["howdy"];  // Shape
type Q51 = Dictionary<Shape>[123];  // Shape
type Q52 = Dictionary<Shape>[E.B];  // Shape

declare let cond: boolean;

function getProperty<T, K extends keyof T>(obj: T, key: K) {
    return obj[key];
}

function setProperty<T, K extends keyof T>(obj: T, key: K, value: T[K]) {
    obj[key] = value;
}

function f10(shape: Shape) {
    let name = getProperty(shape, "name");  // string
    let widthOrHeight = getProperty(shape, cond ? "width" : "height");  // number
    let nameOrVisible = getProperty(shape, cond ? "name" : "visible");  // string | boolean
    setProperty(shape, "name", "rectangle");
    setProperty(shape, cond ? "width" : "height", 10);
    setProperty(shape, cond ? "name" : "visible", true);  // Technically not safe
}

function f11(a: Shape[]) {
    let len = getProperty(a, "length");  // number
    setProperty(a, "length", len);
}

function f12(t: [Shape, boolean]) {
    let len = getProperty(t, "length");
    let s2 = getProperty(t, "0");  // Shape
    let b2 = getProperty(t, "1");  // boolean
}

function f13(foo: any, bar: any) {
    let x = getProperty(foo, "x");  // any
    let y = getProperty(foo, "100");  // any
    let z = getProperty(foo, bar);  // any
}

