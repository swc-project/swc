// @strict: true
// @declaration: true

declare function f1<T>(cb: <S>(x: S) => T): T;

let x1 = f1(x => x);  // {}

