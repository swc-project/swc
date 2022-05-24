import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var ref, ref1, /*a1*/ ref2, /*b1*/ ref3;
// @target: es2015, esnext
var Foo = /*#__PURE__*/ function() {
    "use strict";
    function Foo() {
        _class_call_check(this, Foo);
    }
    var _proto = Foo.prototype;
    _proto.m = function m() {};
    return Foo;
}();
var foo = new Foo();
(ref = foo.m) === null || ref === void 0 ? void 0 : ref();
(ref1 = foo.m) === null || ref1 === void 0 ? void 0 : ref1();
(ref2 = (/*a2*/ foo.m)) === null || ref2 === void 0 ? void 0 : ref2();
(ref3 = (foo.m /*b3*/ )) === null || ref3 === void 0 ? void 0 : ref3();
