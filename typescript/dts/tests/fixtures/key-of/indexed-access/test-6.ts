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

class Component<PropType> {
    props: PropType;

    getProperty<K extends keyof PropType>(key: K) {
        return this.props[key];
    }

    setProperty<K extends keyof PropType>(key: K, value: PropType[K]) {
        this.props[key] = value;
    }
}

function f20(component: Component<Shape>) {
    let name = component.getProperty("name");  // string
    let widthOrHeight = component.getProperty(cond ? "width" : "height");  // number
    let nameOrVisible = component.getProperty(cond ? "name" : "visible");  // string | boolean
    component.setProperty("name", "rectangle");
    component.setProperty(cond ? "width" : "height", 10);
    component.setProperty(cond ? "name" : "visible", true);  // Technically not safe
}

function pluck<T, K extends keyof T>(array: T[], key: K) {
    return array.map(x => x[key]);
}

function f30(shapes: Shape[]) {
    let names = pluck(shapes, "name");    // string[]
    let widths = pluck(shapes, "width");  // number[]
    let nameOrVisibles = pluck(shapes, cond ? "name" : "visible");  // (string | boolean)[]
}

function f31<K extends keyof Shape>(key: K) {
    const shape: Shape = {name: "foo", width: 5, height: 10, visible: true};
    return shape[key];  // Shape[K]
}

function f32<K extends "width" | "height">(key: K) {
    const shape: Shape = {name: "foo", width: 5, height: 10, visible: true};
    return shape[key];  // Shape[K]
}

function f33<S extends Shape, K extends keyof S>(shape: S, key: K) {
    let name = getProperty(shape, "name");
    let prop = getProperty(shape, key);
    return prop;
}

function f34(ts: TaggedShape) {
    let tag1 = f33(ts, "tag");
    let tag2 = getProperty(ts, "tag");
}

class C {
    public x: string;
    protected y: string;
    private z: string;
}

// Indexed access expressions have always permitted access to private and protected members.
// For consistency we also permit such access in indexed access types.
function f40(c: C) {
    type X = C["x"];
    type Y = C["y"];
    type Z = C["z"];
    let x: X = c["x"];
    let y: Y = c["y"];
    let z: Z = c["z"];
}

function f50<T>(k: keyof T, s: string) {
    const x1 = s as keyof T;
    const x2 = k as string;
}

function f51<T, K extends keyof T>(k: K, s: string) {
    const x1 = s as keyof T;
    const x2 = k as string;
}

function f52<T>(obj: { [x: string]: boolean }, k: Exclude<keyof T, symbol>, s: string, n: number) {
    const x1 = obj[s];
    const x2 = obj[n];
    const x3 = obj[k];
}

function f53<T, K extends Exclude<keyof T, symbol>>(obj: { [x: string]: boolean }, k: K, s: string, n: number) {
    const x1 = obj[s];
    const x2 = obj[n];
    const x3 = obj[k];
}

function f54<T>(obj: T, key: keyof T) {
    for (let s in obj[key]) {
    }
    const b = "foo" in obj[key];
}

function f55<T, K extends keyof T>(obj: T, key: K) {
    for (let s in obj[key]) {
    }
    const b = "foo" in obj[key];
}

function f60<T>(source: T, target: T) {
    for (let k in source) {
        target[k] = source[k];
    }
}

function f70(func: <T, U>(k1: keyof (T | U), k2: keyof (T & U)) => void) {
    func<{ a: any, b: any }, { a: any, c: any }>('a', 'a');
    func<{ a: any, b: any }, { a: any, c: any }>('a', 'b');
    func<{ a: any, b: any }, { a: any, c: any }>('a', 'c');
}

function f71(func: <T, U>(x: T, y: U) => Partial<T & U>) {
    let x = func({a: 1, b: "hello"}, {c: true});
    x.a;  // number | undefined
    x.b;  // string | undefined
    x.c;  // boolean | undefined
}

function f72(func: <T, U, K extends keyof T | keyof U>(x: T, y: U, k: K) => (T & U)[K]) {
    let a = func({a: 1, b: "hello"}, {c: true}, 'a');  // number
    let b = func({a: 1, b: "hello"}, {c: true}, 'b');  // string
    let c = func({a: 1, b: "hello"}, {c: true}, 'c');  // boolean
}

function f73(func: <T, U, K extends keyof (T & U)>(x: T, y: U, k: K) => (T & U)[K]) {
    let a = func({a: 1, b: "hello"}, {c: true}, 'a');  // number
    let b = func({a: 1, b: "hello"}, {c: true}, 'b');  // string
    let c = func({a: 1, b: "hello"}, {c: true}, 'c');  // boolean
}

function f74(func: <T, U, K extends keyof (T | U)>(x: T, y: U, k: K) => (T | U)[K]) {
    let a = func({a: 1, b: "hello"}, {a: 2, b: true}, 'a');  // number
    let b = func({a: 1, b: "hello"}, {a: 2, b: true}, 'b');  // string | boolean
}

function f80<T extends { a: { x: any } }>(obj: T) {
    let a1 = obj.a;  // { x: any }
    let a2 = obj['a'];  // { x: any }
    let a3 = obj['a'] as T['a'];  // T["a"]
    let x1 = obj.a.x;  // any
    let x2 = obj['a']['x'];  // any
    let x3 = obj['a']['x'] as T['a']['x'];  // T["a"]["x"]
}

function f81<T extends { a: { x: any } }>(obj: T) {
    return obj['a']['x'] as T['a']['x'];
}

function f82() {
    let x1 = f81({a: {x: "hello"}});  // string
    let x2 = f81({a: {x: 42}});  // number
}

function f83<T extends { [x: string]: { x: any } }, K extends keyof T>(obj: T, key: K) {
    return obj[key]['x'] as T[K]['x'];
}

function f84() {
    let x1 = f83({foo: {x: "hello"}}, "foo");  // string
    let x2 = f83({bar: {x: 42}}, "bar");  // number
}

class C1 {
    x: number;

    get<K extends keyof this>(key: K) {
        return this[key];
    }

    set<K extends keyof this>(key: K, value: this[K]) {
        this[key] = value;
    }

    foo() {
        let x1 = this.x;  // number
        let x2 = this["x"];  // number
        let x3 = this.get("x");  // this["x"]
        let x4 = getProperty(this, "x"); // this["x"]
        this.x = 42;
        this["x"] = 42;
        this.set("x", 42);
        setProperty(this, "x", 42);
    }
}

type S2 = {
    a: string;
    b: string;
};

function f90<T extends S2, K extends keyof S2>(x1: S2[keyof S2], x2: T[keyof S2], x3: S2[K]) {
    x1 = x2;
    x1 = x3;
    x2 = x1;
    x2 = x3;
    x3 = x1;
    x3 = x2;
    x1.length;
    x2.length;
    x3.length;
}

function f91<T, K extends keyof T>(x: T, y: T[keyof T], z: T[K]) {
    let a: {};
    a = x;
    a = y;
    a = z;
}

function f92<T, K extends keyof T>(x: T, y: T[keyof T], z: T[K]) {
    let a: {} | null | undefined;
    a = x;
    a = y;
    a = z;
}
