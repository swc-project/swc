// @module: amd
// @Filename: foo_0.ts
export class C1 {
    constructor(){
        this.m1 = 42;
    }
}
C1.s1 = true;
// @Filename: foo_1.ts
const c1 = require('./foo_0'); // Makes this an external module
var answer = 42; // No exports
export { };
// @Filename: foo_2.ts
const foo = require("./foo_1");
var x = foo; // Cause a runtime dependency
export { };
