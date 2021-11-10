// @allowJs: true
// @checkJs: true
// @target: es5
// @outDir: ./out
// @declaration: true
// @filename: index.js

// Pretty much all of this should be an error, (since interfaces are forbidden in js),
// but we should be able to synthesize declarations from the symbols regardless

export interface A {}

export interface B {
    cat: string;
}

export interface C<T, U> {
    field: T & U;
    optionalField?: T;
    readonly readonlyField: T & U;
    readonly readonlyOptionalField?: U;
    (): number;
    (x: T): U;
    <Q>(x: Q): T & Q;

    new (): string;
    new (x: T): U;
    new <Q>(x: Q): T & Q;

    method<Q = number>(): number;
    method<Q>(a: T & Q): Q & number;
    method(a?: number): number;
    method(...args: any[]): number;

    optMethod?(): number;
}

interface G {}

export { G };

interface HH {}

export { HH as H };

export interface I {}
export { I as II };

export { J as JJ };
export interface J {}

export interface K extends I,J {
    x: string;
}

export interface L extends K {
    y: string;
}

export interface M<T> {
    field: T;
}

export interface N<U> extends M<U> {
    other: U;
}

export interface O {
    [idx: string]: string;
}

export interface P extends O {}

export interface Q extends O {
    [idx: string]: "ok";
}

export interface R extends O {
    [idx: number]: "ok";
}

export interface S extends O {
    [idx: string]: "ok";
    [idx: number]: never;
}

export interface T {
    [idx: number]: string;
}

export interface U extends T {}


export interface V extends T {
    [idx: string]: string;
}

export interface W extends T {
    [idx: number]: "ok";
}

export interface X extends T {
    [idx: string]: string;
    [idx: number]: "ok";
}

export interface Y {
    [idx: string]: {x: number};
    [idx: number]: {x: number, y: number};
}

export interface Z extends Y {}

export interface AA extends Y {
    [idx: string]: {x: number, y: number};
}

export interface BB extends Y {
    [idx: number]: {x: 0, y: 0};
}

export interface CC extends Y {
    [idx: string]: {x: number, y: number};
    [idx: number]: {x: 0, y: 0};
}
