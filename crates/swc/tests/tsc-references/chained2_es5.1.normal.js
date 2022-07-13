// @Filename: /a.ts
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
// @Filename: /c.ts
import * as types from "./b";
// @Filename: /d.ts
import types from "./c";
var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
export { A };
export { types as default };
new types.A();
new types.B();
var a = {};
var b = {};
