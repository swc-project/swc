//// [override6.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var B = function B(foo, bar) {
    "use strict";
    _class_call_check(this, B);
    this.foo = foo;
    this.bar = bar;
    this.baz = 1;
};
var D = /*#__PURE__*/ function(B) {
    "use strict";
    _inherits(D, B);
    function D(foo, baz) {
        _class_call_check(this, D);
        var _this;
        _this = _call_super(this, D, [
            foo,
            42
        ]), _this.foo = foo, _this.baz = baz, _this.bar = 1;
        return _this;
    }
    return D;
}(B);
