// @module: commonjs
// @Filename: foo_0.ts
export class C1 {
    constructor(){
        this.m1 = 42;
    }
}
C1.s1 = true;
// @Filename: foo_1.ts
const foo = require("./foo_0");
if (foo.C1.s1) {
// Should cause runtime import
}
export { };
