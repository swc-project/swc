import * as swcHelpers from "@swc/helpers";
var Base = function Base() {
    "use strict";
    swcHelpers.classCallCheck(this, Base);
};
var Derived = /*#__PURE__*/ function(Base1) {
    "use strict";
    swcHelpers.inherits(Derived, Base1);
    var _super = swcHelpers.createSuper(Derived);
    function Derived() {
        swcHelpers.classCallCheck(this, Derived);
        var _this;
        _this = _super.apply(this, arguments);
        _this.bing = function() {
            return Base.foo;
        } // error
        ;
        return _this;
    }
    return Derived;
}(Base);
Derived.bar = Base.foo // error
;
