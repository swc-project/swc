import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _create_class from "@swc/helpers/lib/_create_class.js";
var c, C = function() {
    "use strict";
    function C(x) {
        _class_call_check(this, C), this.x = this, this.x, this.y, this.z, this.foo();
    }
    return C.prototype.foo = function() {
        return this;
    }, _create_class(C, [
        {
            key: "y",
            get: function() {
                return this;
            }
        }
    ]), C;
}(), r = c.x;
c.x.x.x;
var r2 = c.y, r3 = c.foo();
[
    r,
    r2,
    r3
].forEach(function(x) {
    x.foo, x.x, x.y;
});
