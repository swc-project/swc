//// [genericClassExpressionInFunction.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var A = function A() {
    _class_call_check(this, A);
}, K = /*#__PURE__*/ function(_B1) {
    function K() {
        return _class_call_check(this, K), _call_super(this, K, arguments);
    }
    return _inherits(K, _B1), K;
}(/*#__PURE__*/ function(A) {
    function _class() {
        return _class_call_check(this, _class), _call_super(this, _class, arguments);
    }
    return _inherits(_class, A), _class;
}(A)), C = /*#__PURE__*/ function(_anon) {
    function C() {
        return _class_call_check(this, C), _call_super(this, C, arguments);
    }
    return _inherits(C, _anon), C;
}(new function B2() {
    _class_call_check(this, B2), this.anon = /*#__PURE__*/ function(A) {
        function _class() {
            return _class_call_check(this, _class), _call_super(this, _class, arguments);
        }
        return _inherits(_class, A), _class;
    }(A);
}().anon), S = /*#__PURE__*/ function(b3Number) {
    function S() {
        return _class_call_check(this, S), _call_super(this, S, arguments);
    }
    return _inherits(S, b3Number), S;
}(/*#__PURE__*/ function(A) {
    function Inner() {
        return _class_call_check(this, Inner), _call_super(this, Inner, arguments);
    }
    return _inherits(Inner, A), Inner;
}(A)), c = new C(), k = new K(), s = new S();
c.genericVar = 12, k.genericVar = 12, s.genericVar = 12;
