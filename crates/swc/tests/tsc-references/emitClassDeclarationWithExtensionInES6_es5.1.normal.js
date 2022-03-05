import * as swcHelpers from "@swc/helpers";
var B = // @target: es6
/*#__PURE__*/ function() {
    "use strict";
    function B() {
        swcHelpers.classCallCheck(this, B);
    }
    swcHelpers.createClass(B, [
        {
            key: "baz",
            value: function baz(a) {
                var y = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 10;
            }
        }
    ]);
    return B;
}();
var C = /*#__PURE__*/ function(B) {
    "use strict";
    swcHelpers.inherits(C, B);
    var _super = swcHelpers.createSuper(C);
    function C() {
        swcHelpers.classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    swcHelpers.createClass(C, [
        {
            key: "foo",
            value: function foo() {}
        },
        {
            key: "baz",
            value: function baz(a, y) {
                swcHelpers.get(swcHelpers.getPrototypeOf(C.prototype), "baz", this).call(this, a, y);
            }
        }
    ]);
    return C;
}(B);
var D = /*#__PURE__*/ function(C) {
    "use strict";
    swcHelpers.inherits(D, C);
    var _super = swcHelpers.createSuper(D);
    function D() {
        swcHelpers.classCallCheck(this, D);
        return _super.call(this);
    }
    swcHelpers.createClass(D, [
        {
            key: "foo",
            value: function foo() {
                swcHelpers.get(swcHelpers.getPrototypeOf(D.prototype), "foo", this).call(this);
            }
        },
        {
            key: "baz",
            value: function baz() {
                swcHelpers.get(swcHelpers.getPrototypeOf(D.prototype), "baz", this).call(this, "hello", 10);
            }
        }
    ]);
    return D;
}(C);
