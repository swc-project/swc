import * as swcHelpers from "@swc/helpers";
var B = function() {
    "use strict";
    function B() {
        swcHelpers.classCallCheck(this, B);
    }
    return swcHelpers.createClass(B, [
        {
            key: "baz",
            value: function(a) {
                arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
            }
        }
    ]), B;
}(), C = function(B) {
    "use strict";
    swcHelpers.inherits(C, B);
    var _super = swcHelpers.createSuper(C);
    function C() {
        return swcHelpers.classCallCheck(this, C), _super.apply(this, arguments);
    }
    return swcHelpers.createClass(C, [
        {
            key: "foo",
            value: function() {}
        },
        {
            key: "baz",
            value: function(a, y) {
                swcHelpers.get(swcHelpers.getPrototypeOf(C.prototype), "baz", this).call(this, a, y);
            }
        }
    ]), C;
}(B), D = function(C) {
    "use strict";
    swcHelpers.inherits(D, C);
    var _super = swcHelpers.createSuper(D);
    function D() {
        return swcHelpers.classCallCheck(this, D), _super.call(this);
    }
    return swcHelpers.createClass(D, [
        {
            key: "foo",
            value: function() {
                swcHelpers.get(swcHelpers.getPrototypeOf(D.prototype), "foo", this).call(this);
            }
        },
        {
            key: "baz",
            value: function() {
                swcHelpers.get(swcHelpers.getPrototypeOf(D.prototype), "baz", this).call(this, "hello", 10);
            }
        }
    ]), D;
}(C);
