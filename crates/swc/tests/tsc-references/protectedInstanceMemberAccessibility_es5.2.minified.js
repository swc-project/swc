import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _get from "@swc/helpers/lib/_get.js";
import _get_prototype_of from "@swc/helpers/lib/_get_prototype_of.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var A = function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
    }
    return A.prototype.f = function() {
        return "hello";
    }, A;
}(), B = function(A) {
    "use strict";
    _inherits(B, A);
    var _super = _create_super(B);
    function B() {
        return _class_call_check(this, B), _super.apply(this, arguments);
    }
    return B.prototype.g = function() {
        var a, b, c;
        this.x, this.f(), this.y, this.z, _get(_get_prototype_of(B.prototype), "x", this), _get(_get_prototype_of(B.prototype), "f", this).call(this), _get(_get_prototype_of(B.prototype), "y", this), _get(_get_prototype_of(B.prototype), "z", this), a.x, a.f(), a.y, a.z, b.x, b.f(), b.y, b.z, c.x, c.f(), c.y, c.z;
    }, B;
}(A), C = function(A) {
    "use strict";
    _inherits(C, A);
    var _super = _create_super(C);
    function C() {
        return _class_call_check(this, C), _super.apply(this, arguments);
    }
    return C;
}(A);
