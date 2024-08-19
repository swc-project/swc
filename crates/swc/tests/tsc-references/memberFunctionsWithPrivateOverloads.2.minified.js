//// [memberFunctionsWithPrivateOverloads.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var c, d, C = /*#__PURE__*/ function() {
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    return _proto.foo = function(x, y) {}, _proto.bar = function(x, y) {}, C.foo = function(x, y) {}, C.bar = function(x, y) {}, C;
}(), D = /*#__PURE__*/ function() {
    function D() {
        _class_call_check(this, D);
    }
    var _proto = D.prototype;
    return _proto.foo = function(x, y) {}, _proto.bar = function(x, y) {}, D.foo = function(x, y) {}, D.bar = function(x, y) {}, D;
}();
c.foo(1), d.foo(2), C.foo(1), D.bar('');
