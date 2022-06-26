import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C), this.a = "", this.b = "", this.d = function() {
            return "";
        };
    }
    return C.prototype.c = function() {
        return "";
    }, C.f = function() {
        return "";
    }, C;
}();
C.g = function() {
    return "";
};
var D = function(C1) {
    "use strict";
    _inherits(D, C1);
    var _super = _create_super(D);
    function D() {
        return _class_call_check(this, D), _super.apply(this, arguments);
    }
    return D.prototype.method = function() {
        var d = new D();
        d.x, d.a, d.b, d.c(), d.d(), C.e, C.f(), C.g();
    }, D;
}(C);
