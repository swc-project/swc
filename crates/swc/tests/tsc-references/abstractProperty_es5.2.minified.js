import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _create_class from "@swc/helpers/lib/_create_class.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var A = function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
    }
    return A.prototype.foo = function() {
        console.log(this.x);
    }, A;
}(), B = function(A) {
    "use strict";
    _inherits(B, A);
    var _super = _create_super(B);
    function B() {
        var _this;
        return _class_call_check(this, B), _this = _super.apply(this, arguments), _this.x = "B.x", _this;
    }
    return B;
}(A), C = function(A) {
    "use strict";
    _inherits(C, A);
    var _super = _create_super(C);
    function C() {
        return _class_call_check(this, C), _super.apply(this, arguments);
    }
    return _create_class(C, [
        {
            key: "x",
            get: function() {
                return "C.x";
            }
        }
    ]), C;
}(A);
