//// [superCallBeforeThisAccessing8.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _possible_constructor_return } from "@swc/helpers/_/_possible_constructor_return";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
var Base = function Base(c) {
    "use strict";
    _class_call_check(this, Base);
};
var D = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(D, Base);
    var _super = _create_super(D);
    function D() {
        _class_call_check(this, D);
        var _this;
        var x = {
            k: _this = _super.call(this, undefined),
            j: _this._t
        };
        return _possible_constructor_return(_this);
    }
    return D;
}(Base);
