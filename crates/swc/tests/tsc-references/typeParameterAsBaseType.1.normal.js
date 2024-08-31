//// [typeParameterAsBaseType.ts]
// type parameters cannot be used as base types
// these are all errors
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var C = /*#__PURE__*/ function(T1) {
    "use strict";
    _inherits(C, T1);
    function C() {
        _class_call_check(this, C);
        return _call_super(this, C, arguments);
    }
    return C;
}(T);
var C2 = /*#__PURE__*/ function(U1) {
    "use strict";
    _inherits(C2, U1);
    function C2() {
        _class_call_check(this, C2);
        return _call_super(this, C2, arguments);
    }
    return C2;
}(U);
