import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
function B1() {
    // class expression can use T
    return /*#__PURE__*/ function(A) {
        "use strict";
        _inherits(_class, A);
        var _super = _create_super(_class);
        function _class() {
            _class_call_check(this, _class);
            return _super.apply(this, arguments);
        }
        return _class;
    }(A);
}
var B2 = function B2() {
    "use strict";
    _class_call_check(this, B2);
    this.anon = /*#__PURE__*/ function(A) {
        _inherits(_class, A);
        var _super = _create_super(_class);
        function _class() {
            _class_call_check(this, _class);
            return _super.apply(this, arguments);
        }
        return _class;
    }(A);
};
function B3() {
    return /*#__PURE__*/ function(A) {
        "use strict";
        _inherits(Inner, A);
        var _super = _create_super(Inner);
        function Inner() {
            _class_call_check(this, Inner);
            return _super.apply(this, arguments);
        }
        return Inner;
    }(A);
}
// extends can call B
var K = /*#__PURE__*/ function(_superClass) {
    "use strict";
    _inherits(K, _superClass);
    var _super = _create_super(K);
    function K() {
        _class_call_check(this, K);
        return _super.apply(this, arguments);
    }
    return K;
}(B1());
var C = /*#__PURE__*/ function(_superClass) {
    "use strict";
    _inherits(C, _superClass);
    var _super = _create_super(C);
    function C() {
        _class_call_check(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(new B2().anon);
var b3Number = B3();
var S = /*#__PURE__*/ function(b3Number1) {
    "use strict";
    _inherits(S, b3Number1);
    var _super = _create_super(S);
    function S() {
        _class_call_check(this, S);
        return _super.apply(this, arguments);
    }
    return S;
}(b3Number);
var c = new C();
var k = new K();
var s = new S();
c.genericVar = 12;
k.genericVar = 12;
s.genericVar = 12;
