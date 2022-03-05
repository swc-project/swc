import * as swcHelpers from "@swc/helpers";
var A1 = function() {
    "use strict";
    function A1() {
        swcHelpers.classCallCheck(this, A1);
    }
    return swcHelpers.createClass(A1, [
        {
            key: "fn",
            value: function(a) {
                return null;
            }
        }
    ]), A1;
}(), B1 = function() {
    "use strict";
    function B1() {
        swcHelpers.classCallCheck(this, B1);
    }
    return swcHelpers.createClass(B1, [
        {
            key: "fn",
            value: function(b) {
                return null;
            }
        }
    ]), B1;
}(), Base = function() {
    "use strict";
    function Base() {
        swcHelpers.classCallCheck(this, Base);
    }
    return swcHelpers.createClass(Base, [
        {
            key: "fn",
            value: function(b) {
                return null;
            }
        }
    ]), Base;
}(), A2 = function(Base) {
    "use strict";
    swcHelpers.inherits(A2, Base);
    var _super = swcHelpers.createSuper(A2);
    function A2() {
        return swcHelpers.classCallCheck(this, A2), _super.apply(this, arguments);
    }
    return A2;
}(Base), B2 = function(Base) {
    "use strict";
    swcHelpers.inherits(B2, Base);
    var _super = swcHelpers.createSuper(B2);
    function B2() {
        return swcHelpers.classCallCheck(this, B2), _super.apply(this, arguments);
    }
    return B2;
}(Base);
