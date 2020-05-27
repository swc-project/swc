// @strict: true
// @declaration: true

declare function f2<T>(cb: <S extends number>(x: S) => T): T;

let x2 = f2(x => x);  // number
