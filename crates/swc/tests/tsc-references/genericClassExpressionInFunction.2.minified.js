//// [genericClassExpressionInFunction.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
var A = function A() {
    _class_call_check(this, A);
}, K = function(_B1) {
    _inherits(K, _B1);
    var _super = _create_super(K);
    function K() {
        return _class_call_check(this, K), _super.apply(this, arguments);
    }
    return K;
}(function(A) {
    _inherits(_class, A);
    var _super = _create_super(_class);
    function _class() {
        return _class_call_check(this, _class), _super.apply(this, arguments);
    }
    return _class;
}(A)), C = function(_anon) {
    _inherits(C, _anon);
    var _super = _create_super(C);
    function C() {
        return _class_call_check(this, C), _super.apply(this, arguments);
    }
    return C;
}(new function B2() {
    _class_call_check(this, B2), this.anon = function(A) {
        _inherits(_class, A);
        var _super = _create_super(_class);
        function _class() {
            return _class_call_check(this, _class), _super.apply(this, arguments);
        }
        return _class;
    }(A);
}().anon), S = function(b3Number) {
    _inherits(S, b3Number);
    var _super = _create_super(S);
    function S() {
        return _class_call_check(this, S), _super.apply(this, arguments);
    }
    return S;
}(function(A) {
    _inherits(Inner, A);
    var _super = _create_super(Inner);
    function Inner() {
        return _class_call_check(this, Inner), _super.apply(this, arguments);
    }
    return Inner;
}(A)), c = new C(), k = new K(), s = new S();
c.genericVar = 12, k.genericVar = 12, s.genericVar = 12;
