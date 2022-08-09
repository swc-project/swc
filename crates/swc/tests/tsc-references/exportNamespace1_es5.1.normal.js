// @Filename: a.ts
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
export var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
// @Filename: b.ts
export { };
// @Filename: c.ts
export * from "./b";
// @Filename: d.ts
import { A } from "./c";
new A(); // Error
