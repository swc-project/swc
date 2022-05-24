import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
// @Filename: /d.ts
import { D } from "./c";
// @Filename: /a.ts
var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
export { B as C } from "./a";
new D();
var d = {};
