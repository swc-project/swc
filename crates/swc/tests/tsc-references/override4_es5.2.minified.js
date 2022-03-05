import * as swcHelpers from "@swc/helpers";
var B = function() {
    "use strict";
    function B() {
        swcHelpers.classCallCheck(this, B), this.p1 = 1, this.p2 = 1;
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
        var _this;
        return swcHelpers.classCallCheck(this, D), _this = _super.apply(this, arguments), _this.p1 = 2, _this.p2 = 3, _this;
    }
    return swcHelpers.createClass(D, [
        {
            key: "foo",
            value: function(v) {}
        },
        {
            key: "fooo",
            value: function(v) {}
        }
    ]), D;
}(B), DD = function(B) {
    "use strict";
    swcHelpers.inherits(DD, B);
    var _super = swcHelpers.createSuper(DD);
    function DD() {
        return swcHelpers.classCallCheck(this, DD), _super.apply(this, arguments);
    }
    return DD;
}(B);
