//// [numericIndexerConstrainsPropertyDeclarations2.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var A = /*#__PURE__*/ function() {
    function A() {
        _class_call_check(this, A);
    }
    return A.prototype.foo = function() {
        return '';
    }, A;
}(), B = /*#__PURE__*/ function(A) {
    function B() {
        return _class_call_check(this, B), _call_super(this, B, arguments);
    }
    return _inherits(B, A), B.prototype.bar = function() {
        return '';
    }, B;
}(A);
new A(), new B(), new B();
