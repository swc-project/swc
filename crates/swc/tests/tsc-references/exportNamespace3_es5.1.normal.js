// @Filename: a.ts
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
export var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
// @Filename: b.ts
export { };
// @Filename: c.ts
import * as _a from "./b";
export { _a as a };
// @Filename: d.ts
import { a } from "./c";
new a.A(); // Error
