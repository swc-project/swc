import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _create_class from "@swc/helpers/lib/_create_class.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var C = /*#__PURE__*/ function() {
    "use strict";
    function C(a, b) {
        _class_call_check(this, C);
        this.a = a;
        this.b = b;
    }
    C.fn = function fn() {
        return this;
    };
    _create_class(C, null, [
        {
            key: "x",
            get: function get() {
                return 1;
            },
            set: function set(v) {}
        }
    ]);
    return C;
}();
var r = C.fn();
var r2 = r.x;
var r3 = r.foo;
var D = /*#__PURE__*/ function(C) {
    "use strict";
    _inherits(D, C);
    var _super = _create_super(D);
    function D() {
        _class_call_check(this, D);
        return _super.apply(this, arguments);
    }
    return D;
}(C);
var r = D.fn();
var r2 = r.x;
var r3 = r.foo;
