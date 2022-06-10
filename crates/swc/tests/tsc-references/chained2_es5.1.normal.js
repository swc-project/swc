import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
// @Filename: /c.ts
import * as types from "./b";
// @Filename: /d.ts
import types from "./c";
// @Filename: /a.ts
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
