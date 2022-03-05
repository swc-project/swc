import * as swcHelpers from "@swc/helpers";
var B = function() {
    "use strict";
    function B() {
        swcHelpers.classCallCheck(this, B);
    }
    return swcHelpers.createClass(B, [
        {
            key: "foo",
            value: function(v) {}
        },
        {
            key: "fooo",
            value: function(v) {}
        }
    ]), B;
}(), D = function(B) {
    "use strict";
    swcHelpers.inherits(D, B);
    var _super = swcHelpers.createSuper(D);
    function D() {
        return swcHelpers.classCallCheck(this, D), _super.apply(this, arguments);
    }
    return swcHelpers.createClass(D, [
        {
            key: "foo",
            value: function(v) {}
        },
        {
            key: "fooo",
            value: function(v) {}
        },
        {
            key: "bar",
            value: function(v) {}
        }
    ]), D;
}(B), C = function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    return swcHelpers.createClass(C, [
        {
            key: "foo",
            value: function() {}
        },
        {
            key: "fooo",
            value: function(v) {}
        },
        {
            key: "bar",
            value: function(v) {}
        }
    ]), C;
}();
