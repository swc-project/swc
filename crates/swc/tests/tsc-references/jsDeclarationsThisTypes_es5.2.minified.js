import * as swcHelpers from "@swc/helpers";
export var A = function() {
    "use strict";
    function A() {
        swcHelpers.classCallCheck(this, A);
    }
    return swcHelpers.createClass(A, [
        {
            key: "method",
            value: function() {
                return this;
            }
        }
    ]), A;
}();
var Base = function(A) {
    "use strict";
    swcHelpers.inherits(Base, A);
    var _super = swcHelpers.createSuper(Base);
    function Base() {
        return swcHelpers.classCallCheck(this, Base), _super.apply(this, arguments);
    }
    return swcHelpers.createClass(Base, [
        {
            key: "verify",
            value: function() {}
        }
    ]), Base;
}(A);
export { Base as default };
