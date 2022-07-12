// @module: esnext, es2015, commonjs, amd, system, umd
// @filename: 0.ts
// @declaration: true
// @esModuleInterop: true
import * as _ns from './0';
// @filename: 2.ts
import * as foo from './1';
export const a = 1;
export const b = 2;
export { _ns as ns };
ns.a;
ns.b;
let ns = {
    a: 1,
    b: 2
};
ns.a;
ns.b;
foo.ns.a;
foo.ns.b;
