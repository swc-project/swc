import * as swcHelpers from "@swc/helpers";
var B = function B(foo, bar) {
    "use strict";
    swcHelpers.classCallCheck(this, B);
    this.foo = foo;
    this.bar = bar;
    this.baz = 1;
};
var D = /*#__PURE__*/ function(B) {
    "use strict";
    swcHelpers.inherits(D, B);
    var _super = swcHelpers.createSuper(D);
    function D(foo, baz) {
        swcHelpers.classCallCheck(this, D);
        var _this;
        _this = _super.call(this, foo, 42);
        _this.foo = foo;
        _this.baz = baz;
        _this.bar = 1;
        return _this;
    }
    return D;
}(B);
