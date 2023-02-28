//// [verbatimModuleSyntaxNoElisionESM.ts]
//// [/a.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
export var a = 0;
export var AClass = function AClass() {
    "use strict";
    _class_call_check(this, AClass);
};
//// [/b.ts]
import { A } from "./a";
export { A as A2 } from "./a";
export { A };
//// [/c.ts]
export { };
//// [/main4.ts]
export default 1;
//// [/main5.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
export { C as default };
//// [/main6.ts]
export { };
//// [/main7.ts]
export { };
