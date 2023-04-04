//// [typeParameterAsBaseType.ts]
// type parameters cannot be used as base types
// these are all errors
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
var C = /*#__PURE__*/ function(T1) {
    "use strict";
    _inherits(C, T1);
    var _super = _create_super(C);
    function C() {
        _class_call_check(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(T);
var C2 = /*#__PURE__*/ function(U1) {
    "use strict";
    _inherits(C2, U1);
    var _super = _create_super(C2);
    function C2() {
        _class_call_check(this, C2);
        return _super.apply(this, arguments);
    }
    return C2;
}(U);
