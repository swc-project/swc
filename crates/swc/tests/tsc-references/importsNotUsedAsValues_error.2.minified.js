//// [importsNotUsedAsValues_error.ts]
//// [/a.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var C, _default = function _default() {
    _class_call_check(this, _default);
};
export var A = function A() {
    _class_call_check(this, A);
};
var C1 = ((C = {})[C.One = 0] = "One", C[C.Two = 1] = "Two", C);
export { C1 as C };
export { _default as default };
//// [/b.ts]
console.log(void 0, void 0);
export { };
//// [/c.ts]
console.log(void 0, void 0);
export { };
//// [/d.ts]
import { A } from './a';
console.log(A, void 0);
//// [/e.ts]
export { };
//// [/f.ts]
import { C } from './a';
C.One, console.log(C.Two, C.Two);
//// [/g.ts]
console.log(void 0, void 0);
export { };
//// [/h.ts]
import "@swc/helpers/_/_class_call_check";
//// [/i.ts]
console.log({});
export { };
//// [/j.ts]
export { };
//// [/k.ts]
export { };
//// [/l.ts]
K.One;
export { };
//// [/j.ts]
