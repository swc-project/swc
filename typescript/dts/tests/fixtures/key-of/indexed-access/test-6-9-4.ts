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

class Component<PropType> {
    props: PropType;

    getProperty<K extends keyof PropType>(key: K) {
        return this.props[key];
    }

    setProperty<K extends keyof PropType>(key: K, value: PropType[K]) {
        this.props[key] = value;
    }
}

function pluck<T, K extends keyof T>(array: T[], key: K) {
    return array.map(x => x[key]);
}


class C {
    public x: string;
    protected y: string;
    private z: string;
}

function f70(func: <T, U>(k1: keyof (T | U), k2: keyof (T & U)) => void) {
    func<{ a: any, b: any }, { a: any, c: any }>('a', 'a');
    func<{ a: any, b: any }, { a: any, c: any }>('a', 'b');
    func<{ a: any, b: any }, { a: any, c: any }>('a', 'c');
}

function f71(func: <T, U>(x: T, y: U) => Partial<T & U>) {
    let x = func({ a: 1, b: "hello" }, { c: true });
    x.a;  // number | undefined
    x.b;  // string | undefined
    x.c;  // boolean | undefined
}

function f72(func: <T, U, K extends keyof T | keyof U>(x: T, y: U, k: K) => (T & U)[K]) {
    let a = func({ a: 1, b: "hello" }, { c: true }, 'a');  // number
    let b = func({ a: 1, b: "hello" }, { c: true }, 'b');  // string
    let c = func({ a: 1, b: "hello" }, { c: true }, 'c');  // boolean
}

function f73(func: <T, U, K extends keyof (T & U) >(x: T, y: U, k: K) => (T & U)[K]) {
    let a = func({ a: 1, b: "hello" }, { c: true }, 'a');  // number
    let b = func({ a: 1, b: "hello" }, { c: true }, 'b');  // string
    let c = func({ a: 1, b: "hello" }, { c: true }, 'c');  // boolean
}

function f74(func: <T, U, K extends keyof (T | U) >(x: T, y: U, k: K) => (T | U)[K]) {
    let a = func({ a: 1, b: "hello" }, { a: 2, b: true }, 'a');  // number
    let b = func({ a: 1, b: "hello" }, { a: 2, b: true }, 'b');  // string | boolean
}
