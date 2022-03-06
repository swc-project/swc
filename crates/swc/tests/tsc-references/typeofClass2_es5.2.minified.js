import * as swcHelpers from "@swc/helpers";
var C = function() {
    "use strict";
    function C(x) {
        swcHelpers.classCallCheck(this, C);
    }
    return swcHelpers.createClass(C, null, [
        {
            key: "foo",
            value: function(x) {}
        },
        {
            key: "bar",
            value: function(x) {}
        }
    ]), C;
}(), D = function(C) {
    "use strict";
    swcHelpers.inherits(D, C);
    var _super = swcHelpers.createSuper(D);
    function D() {
        return swcHelpers.classCallCheck(this, D), _super.apply(this, arguments);
    }
    return swcHelpers.createClass(D, [
        {
            key: "foo",
            value: function() {}
        }
    ], [
        {
            key: "baz",
            value: function(x) {}
        }
    ]), D;
}(C);
