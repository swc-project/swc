import * as swcHelpers from "@swc/helpers";
var Base = function Base(c) {
    "use strict";
    swcHelpers.classCallCheck(this, Base);
};
var D = /*#__PURE__*/ function(Base) {
    "use strict";
    swcHelpers.inherits(D, Base);
    var _super = swcHelpers.createSuper(D);
    function D() {
        swcHelpers.classCallCheck(this, D);
        var _this;
        _this = _super.call(this, i);
        var s = {
            t: _this._t
        };
        var i = Factory.create(s);
        return _this;
    }
    return D;
}(Base);
