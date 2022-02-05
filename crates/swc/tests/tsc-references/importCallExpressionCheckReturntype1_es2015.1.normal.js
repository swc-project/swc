// @module: commonjs
// @target: es6
// @noImplicitAny: true
// @filename: anotherModule.ts
export class D {
}
// @filename: defaultPath.ts
export class C {
}
let p1 = import("./defaultPath");
let p2 = import("./defaultPath");
let p3 = import("./defaultPath");
