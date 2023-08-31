//// [verbatimModuleSyntaxNoElisionESM.ts]
//// [/a.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
export var a = 0;
export var AClass = function AClass() {
    _class_call_check(this, AClass);
};
//// [/b.ts]
import { A } from "./a";
export { A as A2 } from "./a";
export { A };
//// [/c.ts]
export { };
//// [/main4.ts]
export default 1; // ok
//// [/main5.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var C = function C() {
    _class_call_check(this, C);
} // ok
;
export { C as default };
//// [/main6.ts]
export { };
 // error
//// [/main7.ts]
export { };
 // error
