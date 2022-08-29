//// [superCallBeforeThisAccessing3.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
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
        var x = function() {
            _this._t;
        };
        x(); // no error; we only check super is called before this when the container is a constructor
        _this._t; // error
        _this = _super.call(this, undefined);
        return _this;
    }
    return D;
}(Base);
