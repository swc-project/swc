// @strict: true
// @declaration: true

declare function f1<T>(cb: <S>(x: S) => T): T;

let x3 = f3(x => x);  // Array<any>

