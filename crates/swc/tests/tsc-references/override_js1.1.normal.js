//// [a.js]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var B = /*#__PURE__*/ function() {
    "use strict";
    function B() {
        _class_call_check(this, B);
    }
    var _proto = B.prototype;
    _proto.foo = function foo(v) {};
    _proto.fooo = function fooo(v) {};
    return B;
}();
var D = /*#__PURE__*/ function(B) {
    "use strict";
    _inherits(D, B);
    function D() {
        _class_call_check(this, D);
        return _call_super(this, D, arguments);
    }
    var _proto = D.prototype;
    _proto.foo = function foo(v) {};
    /** @override */ _proto.fooo = function fooo(v) {};
    /** @override */ _proto.bar = function bar(v) {};
    return D;
}(B);
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    _proto.foo = function foo() {};
    /** @override */ _proto.fooo = function fooo(v) {};
    /** @override */ _proto.bar = function bar(v) {};
    return C;
}();
