import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
// @Filename: /b.ts
import * as types from "./a";
// @Filename: /a.ts
var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
types.A;
var A = types.A;
