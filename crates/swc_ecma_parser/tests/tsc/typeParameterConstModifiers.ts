// @strict: true

declare function f1<const T>(x: T): T;

const x11 = f1('a');
const x12 = f1(['a', ['b', 'c']]);
const x13 = f1({ a: 1, b: "c", d: ["e", 2, true, { f: "g" }] });

declare function f2<const T, U>(x: T | undefined): T;

const x21 = f2('a');
const x22 = f2(['a', ['b', 'c']]);
const x23 = f2({ a: 1, b: "c", d: ["e", 2, true, { f: "g" }] });

declare function f3<const T>(x: T): T[];

const x31 = f3("hello");
const x32 = f3("hello");

declare function f4<const T>(obj: [T, T]): T;

const x41 = f4([[1, 'x'], [2, 'y']]);
const x42 = f4([{ a: 1, b: 'x' }, { a: 2, b: 'y' }]);

declare function f5<const T>(obj: { x: T, y: T }): T;

const x51 = f5({ x: [1, 'x'], y: [2, 'y'] });
const x52 = f5({ x: { a: 1, b: 'x' }, y: { a: 2, b: 'y' } });

declare function f6<const T extends readonly unknown[]>(...args: T): T;

const x61 = f6(1, 'b', { a: 1, b: 'x' });

class C1<const T> {
    constructor(x: T) {}
    foo<const U>(x: U) { return x; }
}

const c71 = new C1({ a: 1, b: "c", d: ["e", 2, true, { f: "g" }] });
const c72 = c71.foo(['a', ['b', 'c']]);

const fx1 = <const T>(x: T) => x;
const fx2 = <const T,>(x: T) => x;

interface I1<const T> { x: T }  // Error

interface I2 {
    f<const T>(x: T): T;
}

type T1<const T> = T;  // Error

type T2 = <const T>(x: T) => T;
type T3 = { <const T>(x: T): T };
type T4 = new <const T>(x: T) => T;
type T5 = { new <const T>(x: T): T };

// Corrected repro from #51745

type Obj = { a: { b: { c: "123" } } };

type GetPath<T, P> =
    P extends readonly [] ? T :
    P extends readonly [infer A extends keyof T, ...infer Rest] ? GetPath<T[A], Rest> :
    never;

function set<T, const P extends readonly string[]>(obj: T, path: P, value: GetPath<T, P>) {}

declare let obj: Obj;
declare let value: "123";

set(obj, ['a', 'b', 'c'], value);
