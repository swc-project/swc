// @strict: true
// @declaration: true

declare let f1: (...x: [number, string, boolean]) => void;
declare let f2: (x0: number, x1: string, x2: boolean) => void;

f1 = f2;
f2 = f1;

declare const t3: [number, string, boolean];
declare const t2: [string, boolean];
declare const t1: [boolean];
declare const t0: [];

declare const ns: [number, string];
declare const sn: [string, number];

f1(42, "hello", true);
f1(t3[0], t3[1], t3[2]);
f1(...t3);
f1(42, ...t2);
f1(42, "hello", ...t1);
f1(42, "hello", true, ...t0);
f1(ns[0], ns[1], true);
f1(...ns, true);  // Error, tuple spread only expanded when last

f2(42, "hello", true);
f2(t3[0], t3[1], t3[2]);
f2(...t3);
f2(42, ...t2);
f2(42, "hello", ...t1);
f2(42, "hello", true, ...t0);
f2(ns[0], ns[1], true);
f2(...ns, true);  // Error, tuple spread only expanded when last

declare function f10<T extends unknown[]>(...args: T): T;

const x10 = f10(42, "hello", true);  // [number, string, boolean]
const x11 = f10(42, "hello");  // [number, string]
const x12 = f10(42);  // [number]
const x13 = f10();  // []
const x14 = f10(...t3);  // [number, string, boolean]
const x15 = f10(42, ...t2);  // [number, string, boolean]
const x16 = f10(42, "hello", ...t1);  // [number, string, boolean]
const x17 = f10(42, "hello", true, ...t0);  // [number, string, boolean]
const x18 = f10(...ns, true);  // (string | number | boolean)[]

function g10<U extends string[], V extends [number, number]>(u: U, v: V) {
    let x1 = f10(...u);  // U
    let x2 = f10(...v);  // V
    let x3 = f10(1, ...u);  // [number, ...string[]]
    let x4 = f10(...u, ...v);  // (string | number)[]
}

declare function f11<T extends (string | number | boolean)[]>(...args: T): T;

const z10 = f11(42, "hello", true);  // [42, "hello", true]
const z11 = f11(42, "hello");  // [42, "hello"]
const z12 = f11(42);  // [42]
const z13 = f11();  // []
const z14 = f11(...t3);  // [number, string, boolean]
const z15 = f11(42, ...t2);  // [42, string, boolean]
const z16 = f11(42, "hello", ...t1);  // [42, "hello", boolean]
const z17 = f11(42, "hello", true, ...t0);  // [42, "hello", true]
const z18 = f11(...ns, true);  // (string | number | true)[]

function g11<U extends string[], V extends [number, number]>(u: U, v: V) {
    let x1 = f11(...u);  // U
    let x2 = f11(...v);  // V
    let x3 = f11(1, ...u);  // [1, ...string[]]
    let x4 = f11(...u, ...v);  // (string | number)[]
}

function call<T extends unknown[], U>(f: (...args: T) => U, ...args: T) {
    return f(...args);
}

function callr<T extends unknown[], U>(args: T, f: (...args: T) => U) {
    return f(...args);
}

declare function f15(a: string, b: number): string | number;
declare function f16<A, B>(a: A, b: B): A | B;

let x20 = call((x, y) => x + y, 10, 20);  // number
let x21 = call((x, y) => x + y, 10, "hello");  // string
let x22 = call(f15, "hello", 42);  // string | number
let x23 = call(f16, "hello", 42);  // unknown
let x24 = call<[string, number], string | number>(f16, "hello", 42);  // string | number

let x30 = callr(sn, (x, y) => x + y);  // string
let x31 = callr(sn, f15);  // string | number
let x32 = callr(sn, f16);  // string | number

function bind<T, U extends unknown[], V>(f: (x: T, ...rest: U) => V, x: T) {
    return (...rest: U) => f(x, ...rest);
}

declare const f20: (x: number, y: string, z: boolean) => string[];

const f21 = bind(f20, 42);  // (y: string, z: boolean) => string[]
const f22 = bind(f21, "hello");  // (z: boolean) => string[]
const f23 = bind(f22, true);  // () => string[]

f20(42, "hello", true);
f21("hello", true);
f22(true);
f23();

declare const g20: (x: number, y?: string, z?: boolean) => string[];

const g21 = bind(g20, 42);  // (y: string, z: boolean) => string[]
const g22 = bind(g21, "hello");  // (z: boolean) => string[]
const g23 = bind(g22, true);  // () => string[]

g20(42, "hello", true);
g20(42, "hello");
g20(42);
g21("hello", true);
g21("hello");
g21();
g22(true);
g22();
g23();

declare function f30<T, U extends ((x: T) => any)[]>(x: T, ...args: U): U;

const c30 = f30(42, x => "" + x, x => x + 1);  // [(x: number) => string, (x: number) => number]

type T01 = Parameters<(x: number, y: string, z: boolean) => void>;
type T02 = Parameters<(...args: [number, string, boolean]) => void>;
type T03 = ConstructorParameters<new (x: number, y: string, z: boolean) => void>;
type T04 = ConstructorParameters<new (...args: [number, string, boolean]) => void>;
type T05<T> = Parameters<(...args: T[]) => void>;
type T06<T> = ConstructorParameters<new (...args: []) => void>;
type T07<T extends any[]> = Parameters<(...args: T) => void>;
type T08<T extends any[]> = ConstructorParameters<new (...args: T) => void>;
type T09 = Parameters<Function>;

type Record1 = {
  move: [number, 'left' | 'right'];
  jump: [number, 'up' | 'down'];
  stop: string;
  done: [];
}

type EventType<T> = {
  emit<K extends keyof T = keyof T>(e: K, ...payload: T[K] extends any[] ? T[K] : [T[K]]): void; 
}

declare var events: EventType<Record1>;
events.emit('move', 10, 'left');
events.emit('jump', 20, 'up');
events.emit('stop', 'Bye!');
events.emit('done');

// Repro from #25871

declare var ff1: (... args: any[]) => void;

declare var ff2: () => void;
declare var ff3: (...args: []) => void;
declare var ff4: (a: never) => void;

ff1 = ff2;
ff1 = ff3;
ff1 = ff4;  // Error
