// @module: esnext, es2015, commonjs, amd, system, umd
// @filename: 0.ts
// @declaration: true
// @esModuleInterop: true
import * as _default from './0';
// @filename: 11.ts
import * as ns from './0';
// @filename: 2.ts
import foo from './1';
import foo1 from './11';
export const a = 1;
export const b = 2;
export { _default as default };
export default ns;
foo.a;
foo1.a;
foo.b;
foo1.b;
