//// [superCallBeforeThisAccessing8.ts]
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
        var x = {
            k: _this = _call_super(this, D, [
                undefined
            ]),
            j: _this._t
        };
        return _this;
    }
    return D;
}(Base);
