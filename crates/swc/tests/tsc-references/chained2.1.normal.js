//// [/a.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
export { };
//// [/b.ts]
import A from './a';
export { A };
//// [/c.ts]
import * as types from './b';
export { types as default };
//// [/d.ts]
import types from './c';
new types.A();
new types.B();
var a = {};
var b = {};
