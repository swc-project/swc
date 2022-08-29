//// [classAbstractSingleLineDecl.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
abstract;
var B = function B() {
    "use strict";
    _class_call_check(this, B);
};
abstract;
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
new function A() {
    "use strict";
    _class_call_check(this, A);
}, new B, new C;
