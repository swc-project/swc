//// [constructSignaturesWithOverloadsThatDifferOnlyByReturnType.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
// Error for construct signature overloads to differ only by return type
var C = function C(x) {
    "use strict";
    _class_call_check(this, C);
};
var C2 = function C2(x, y) {
    "use strict";
    _class_call_check(this, C2);
};
var a;
var b;
