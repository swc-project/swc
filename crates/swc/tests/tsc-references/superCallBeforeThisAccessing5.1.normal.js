//// [superCallBeforeThisAccessing5.ts]
import { _ as _assert_this_initialized } from "@swc/helpers/_/_assert_this_initialized";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _possible_constructor_return } from "@swc/helpers/_/_possible_constructor_return";
var D = /*#__PURE__*/ function(_superClass) {
    "use strict";
    _inherits(D, _superClass);
    function D() {
        _class_call_check(this, D);
        var _this;
        _assert_this_initialized(_this)._t; // No error
        return _possible_constructor_return(_this);
    }
    return D;
}(null);
