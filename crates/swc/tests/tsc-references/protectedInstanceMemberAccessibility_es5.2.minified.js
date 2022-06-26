import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
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
