import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import * as _a from "./b";
// @Filename: d.ts
import { a } from "./c";
// @Filename: a.ts
export var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
export { _a as a };
new a.A(); // Error
