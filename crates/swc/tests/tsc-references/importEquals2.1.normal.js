//// [importEquals2.ts]
//// [/a.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
export { };
//// [/b.ts]
import * as a from './a';
//// [/c.ts]
new a.A(); // Error
export { };
