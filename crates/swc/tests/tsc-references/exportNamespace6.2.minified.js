//// [/a.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
export var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
export var B = function B() {
    "use strict";
    _class_call_check(this, B);
};
//// [/b.ts]
export { };
//// [/c.ts]
export * from "./b";
//// [/d.ts]
import { A, B } from "./c";
new A(), new B();
