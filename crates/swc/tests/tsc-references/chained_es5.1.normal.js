// @Filename: /a.ts
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
export { };
// @Filename: /b.ts
export { B as C } from "./a";
// @Filename: /c.ts
export { };
// @Filename: /d.ts
import { D } from "./c";
new D();
var d = {};
