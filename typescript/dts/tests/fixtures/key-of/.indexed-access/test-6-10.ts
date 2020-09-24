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
