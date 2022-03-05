import * as swcHelpers from "@swc/helpers";
var Bar = function() {
    "use strict";
    function Bar(d) {
        var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 10;
        swcHelpers.classCallCheck(this, Bar), this.d = d, this.e = e, this.c = 2;
    }
    return swcHelpers.createClass(Bar, [
        {
            key: "f",
            value: function() {
                return 1;
            }
        },
        {
            key: "h",
            value: function() {
                return 2;
            }
        }
    ]), Bar;
}(), Base = function() {
    "use strict";
    swcHelpers.classCallCheck(this, Base);
}, Derived = function(Base1) {
    "use strict";
    swcHelpers.inherits(Derived, Base1);
    var _super = swcHelpers.createSuper(Derived);
    function Derived() {
        var _this;
        return swcHelpers.classCallCheck(this, Derived), _this = _super.apply(this, arguments), _this.a = 1, _this;
    }
    return swcHelpers.createClass(Derived, [
        {
            key: "f",
            value: function() {
                return 1;
            }
        }
    ]), Derived;
}(Base);
