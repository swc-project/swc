import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var B = function(foo, bar) {
    "use strict";
    _class_call_check(this, B), this.foo = foo, this.bar = bar, this.baz = 1;
}, D = function(B1) {
    "use strict";
    _inherits(D, B1);
    var _super = _create_super(D);
    function D(foo, baz) {
        var _this;
        return _class_call_check(this, D), (_this = _super.call(this, foo, 42)).foo = foo, _this.baz = baz, _this.bar = 1, _this;
    }
    return D;
}(B);
