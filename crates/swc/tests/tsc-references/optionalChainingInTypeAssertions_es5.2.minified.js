import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var ref, ref1, ref2, ref3, foo = new (function() {
    "use strict";
    function Foo() {
        _class_call_check(this, Foo);
    }
    return Foo.prototype.m = function() {}, Foo;
}())();
null === (ref = foo.m) || void 0 === ref || ref(), null === (ref1 = foo.m) || void 0 === ref1 || ref1(), null === (ref2 = foo.m) || void 0 === ref2 || ref2(), null === (ref3 = foo.m) || void 0 === ref3 || ref3(), (null == foo ? void 0 : foo.m).length, (null == foo ? void 0 : foo.m).length, (null == foo ? void 0 : foo.m).length, (null == foo ? void 0 : foo.m).length;
