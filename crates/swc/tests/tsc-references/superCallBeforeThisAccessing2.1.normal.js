//// [superCallBeforeThisAccessing2.ts]
import { _ as _assert_this_initialized } from "@swc/helpers/_/_assert_this_initialized";
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var Base = function Base(c) {
    "use strict";
    _class_call_check(this, Base);
};
var D = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(D, Base);
    function D() {
        _class_call_check(this, D);
        var _this;
        return _this = _call_super(this, D, [
            function() {
                _assert_this_initialized(_this)._t;
            }
        ]); // no error. only check when this is directly accessing in constructor
    }
    return D;
}(Base);
