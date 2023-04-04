//// [classAbstractSingleLineDecl.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
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
new A;
new B;
new C;
