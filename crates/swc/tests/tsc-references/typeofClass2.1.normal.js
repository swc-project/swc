//// [typeofClass2.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
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
    var _super = _create_super(D);
    function D() {
        _class_call_check(this, D);
        return _super.apply(this, arguments);
    }
    var _proto = D.prototype;
    _proto.foo = function foo() {};
    D.baz = function baz(x) {};
    return D;
}(C);
var d;
var r1;
var r2;
