import * as swcHelpers from "@swc/helpers";
var B = // @declaration: true
// @noImplicitOverride: true
/*#__PURE__*/ function() {
    "use strict";
    function B() {
        swcHelpers.classCallCheck(this, B);
        this.p1 = 1;
        this.p2 = 1;
    }
    swcHelpers.createClass(B, [
        {
            key: "foo",
            value: function foo(v) {}
        },
        {
            key: "fooo",
            value: function fooo(v) {}
        }
    ]);
    return B;
}();
var D = /*#__PURE__*/ function(B) {
    "use strict";
    swcHelpers.inherits(D, B);
    var _super = swcHelpers.createSuper(D);
    function D() {
        swcHelpers.classCallCheck(this, D);
        var _this;
        _this = _super.apply(this, arguments);
        _this.p1 = 2;
        _this.p2 = 3;
        return _this;
    }
    swcHelpers.createClass(D, [
        {
            key: "foo",
            value: function foo(v) {}
        },
        {
            key: "fooo",
            value: function fooo(v) {}
        }
    ]);
    return D;
}(B);
var DD = /*#__PURE__*/ function(B) {
    "use strict";
    swcHelpers.inherits(DD, B);
    var _super = swcHelpers.createSuper(DD);
    function DD() {
        swcHelpers.classCallCheck(this, DD);
        return _super.apply(this, arguments);
    }
    return DD;
}(B);
