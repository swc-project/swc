//// [verbatimModuleSyntaxNoElisionESM.ts]
//// [/a.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
export var a = 0;
export var AClass = function AClass() {
    "use strict";
    _class_call_check(this, AClass);
};
//// [/b.ts]
import { a, A, AClass } from "./a";
import { A as AType2 } from "./a";
export { A };
export { A as A2 } from "./a";
export { A as A4 } from "./a";
//// [/c.ts]
import { AClass } from "./b";
//// [/main4.ts]
export default 1; // ok
//// [/main5.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var C = function C() {
    "use strict";
    _class_call_check(this, C);
} // ok
;
export { C as default };
//// [/main6.ts]
export default I; // error
//// [/main7.ts]
export default C; // error
