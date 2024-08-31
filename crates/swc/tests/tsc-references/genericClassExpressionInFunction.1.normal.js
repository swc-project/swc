//// [genericClassExpressionInFunction.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
function B1() {
    // class expression can use T
    return /*#__PURE__*/ function(A) {
        "use strict";
        _inherits(_class, A);
        function _class() {
            _class_call_check(this, _class);
            return _call_super(this, _class, arguments);
        }
        return _class;
    }(A);
}
var B2 = function B2() {
    "use strict";
    _class_call_check(this, B2);
    this.anon = /*#__PURE__*/ function(A) {
        _inherits(_class, A);
        function _class() {
            _class_call_check(this, _class);
            return _call_super(this, _class, arguments);
        }
        return _class;
    }(A);
};
function B3() {
    return /*#__PURE__*/ function(A) {
        "use strict";
        _inherits(Inner, A);
        function Inner() {
            _class_call_check(this, Inner);
            return _call_super(this, Inner, arguments);
        }
        return Inner;
    }(A);
}
// extends can call B
var K = /*#__PURE__*/ function(_B1) {
    "use strict";
    _inherits(K, _B1);
    function K() {
        _class_call_check(this, K);
        return _call_super(this, K, arguments);
    }
    return K;
}(B1());
var C = /*#__PURE__*/ function(_anon) {
    "use strict";
    _inherits(C, _anon);
    function C() {
        _class_call_check(this, C);
        return _call_super(this, C, arguments);
    }
    return C;
}(new B2().anon);
var b3Number = B3();
var S = /*#__PURE__*/ function(b3Number) {
    "use strict";
    _inherits(S, b3Number);
    function S() {
        _class_call_check(this, S);
        return _call_super(this, S, arguments);
    }
    return S;
}(b3Number);
var c = new C();
var k = new K();
var s = new S();
c.genericVar = 12;
k.genericVar = 12;
s.genericVar = 12;
