import * as swcHelpers from "@swc/helpers";
var A = function() {
    "use strict";
    function A() {
        swcHelpers.classCallCheck(this, A);
    }
    return swcHelpers.createClass(A, [
        {
            key: "m1",
            value: function() {
                return 0;
            }
        },
        {
            key: "m2",
            value: function() {
                return 0;
            }
        },
        {
            key: "m3",
            value: function() {}
        }
    ]), A;
}(), B = function(A) {
    "use strict";
    swcHelpers.inherits(B, A);
    var _super = swcHelpers.createSuper(B);
    function B() {
        return swcHelpers.classCallCheck(this, B), _super.apply(this, arguments);
    }
    return swcHelpers.createClass(B, [
        {
            key: "m1",
            value: function() {
                return 10;
            }
        },
        {
            key: "m2",
            value: function() {
                return 30;
            }
        },
        {
            key: "m3",
            value: function() {}
        }
    ]), B;
}(A);
