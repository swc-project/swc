//// [typeofClass2.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var C = /*#__PURE__*/ function() {
    "use strict";
    function C(x) {
        _class_call_check(this, C);
    }
    C.foo = function foo(x) {};
    C.bar = function bar(x) {};
    return C;
}();
var D = /*#__PURE__*/ function(C) {
    "use strict";
    _inherits(D, C);
    function D() {
        _class_call_check(this, D);
        return _call_super(this, D, arguments);
    }
    var _proto = D.prototype;
    _proto.foo = function foo() {};
    D.baz = function baz(x) {};
    return D;
}(C);
var d;
var r1;
var r2;
