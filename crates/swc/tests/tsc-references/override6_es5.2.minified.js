import * as swcHelpers from "@swc/helpers";
var B = function(foo, bar) {
    swcHelpers.classCallCheck(this, B), this.foo = foo, this.bar = bar, this.baz = 1;
}, D = function(B1) {
    swcHelpers.inherits(D, B1);
    var _super = swcHelpers.createSuper(D);
    function D(foo, baz) {
        var _this;
        return swcHelpers.classCallCheck(this, D), (_this = _super.call(this, foo, 42)).foo = foo, _this.baz = baz, _this.bar = 1, _this;
    }
    return D;
}(B);
