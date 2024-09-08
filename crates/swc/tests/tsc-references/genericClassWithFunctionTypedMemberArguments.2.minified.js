//// [genericClassWithFunctionTypedMemberArguments.ts]
var ImmediatelyFix, WithCandidates, c, c2, c1, c21;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
ImmediatelyFix || (ImmediatelyFix = {}), (c = new (/*#__PURE__*/ function() {
    function C() {
        _class_call_check(this, C);
    }
    return C.prototype.foo = function(x) {
        return x(null);
    }, C;
}())()).foo(function(x) {
    return '';
}), c.foo(function(x) {
    return '';
}), c.foo(function(x) {
    return '';
}), (c2 = new (/*#__PURE__*/ function() {
    function C2() {
        _class_call_check(this, C2);
    }
    return C2.prototype.foo = function(x) {
        return x(null);
    }, C2;
}())()).foo(function(x) {
    return 1;
}), c2.foo(function(x) {
    return 1;
}), WithCandidates || (WithCandidates = {}), c1.foo2(1, function(a) {
    return '';
}), c1.foo2(1, function(a) {
    return '';
}), c1.foo2('', function(a) {
    return 1;
}), c21.foo3(1, function(a) {
    return '';
}, ''), c21.foo3(1, function(a) {
    return '';
}, '');
