//// [a.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
var _this = this, B = function() {
    function B() {
        _class_call_check(this, B), this.n = 1;
    }
    return B.prototype.foo = function() {}, B;
}();
(function(B) {
    _inherits(C, B);
    var _super = _create_super(C);
    function C() {
        return _class_call_check(this, C), _super.apply(this, arguments);
    }
    return C;
})(B).prototype.foo = function() {}, function(B) {
    _inherits(D, B);
    var _super = _create_super(D);
    function D() {
        return _class_call_check(this, D), _super.apply(this, arguments);
    }
    return D;
}(B).prototype.foo = function() {
    _this.n = "not checked, so no error";
};
var Module = function Module() {
    _class_call_check(this, Module);
};
Module.prototype.identifier = void 0, Module.prototype.size = null;
