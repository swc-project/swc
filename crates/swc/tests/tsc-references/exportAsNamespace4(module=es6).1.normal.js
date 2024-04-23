//// [0.ts]
export var a = 1;
export var b = 2;
//// [1.ts]
import * as _default from './0';
export { _default as default };
//// [11.ts]
import * as ns from './0';
export default ns;
//// [2.ts]
import foo from './1';
import foo1 from './11';
foo.a;
foo1.a;
foo.b;
foo1.b;
