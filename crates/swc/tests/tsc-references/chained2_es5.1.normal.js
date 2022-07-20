// @Filename: /a.ts
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
export { A };
// @Filename: /c.ts
import * as types from "./b";
export { types as default };
// @Filename: /d.ts
import types from "./c";
new types.A();
new types.B();
var a = {};
var b = {};
