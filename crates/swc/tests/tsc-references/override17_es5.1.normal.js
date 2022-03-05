import * as swcHelpers from "@swc/helpers";
var A = // @noImplicitOverride: true
// @useDefineForClassFields: true
// @target: es2015,esnext
/*#__PURE__*/ function() {
    "use strict";
    function A() {
        swcHelpers.classCallCheck(this, A);
    }
    swcHelpers.createClass(A, [
        {
            key: "m1",
            value: function m1() {
                return 0;
            }
        },
        {
            key: "m2",
            value: function m2() {
                return 0;
            }
        },
        {
            key: "m3",
            value: function m3() {}
        }
    ]);
    return A;
}();
var B = /*#__PURE__*/ function(A) {
    "use strict";
    swcHelpers.inherits(B, A);
    var _super = swcHelpers.createSuper(B);
    function B() {
        swcHelpers.classCallCheck(this, B);
        return _super.apply(this, arguments);
    }
    swcHelpers.createClass(B, [
        {
            key: "m1",
            value: function m1() {
                return 10;
            }
        },
        {
            key: "m2",
            value: function m2() {
                return 30;
            }
        },
        {
            key: "m3",
            value: function m3() {}
        }
    ]);
    return B;
}(A);
