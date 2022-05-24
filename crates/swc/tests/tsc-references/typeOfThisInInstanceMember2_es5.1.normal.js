import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _create_class from "@swc/helpers/lib/_create_class.js";
var C = /*#__PURE__*/ function() {
    "use strict";
    function C(x) {
        _class_call_check(this, C);
        this.x = this;
        var t = this;
        t.x;
        t.y;
        t.z;
        var r = t.foo();
    }
    var _proto = C.prototype;
    _proto.foo = function foo() {
        return this;
    };
    _create_class(C, [
        {
            key: "y",
            get: function get() {
                return this;
            }
        }
    ]);
    return C;
}();
var c;
// all ok
var r = c.x;
var ra = c.x.x.x;
var r2 = c.y;
var r3 = c.foo();
var r4 = c.z;
var rs = [
    r,
    r2,
    r3
];
rs.forEach(function(x) {
    x.foo;
    x.x;
    x.y;
    x.z;
});
