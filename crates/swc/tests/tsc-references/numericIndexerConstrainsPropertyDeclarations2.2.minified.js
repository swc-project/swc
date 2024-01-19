//// [numericIndexerConstrainsPropertyDeclarations2.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
var A = function() {
    function A() {
        _class_call_check(this, A);
    }
    var _proto = A.prototype;
    return _proto.foo = function() {
        return "";
    }, A;
}(), B = function(A) {
    _inherits(B, A);
    var _super = _create_super(B);
    function B() {
        return _class_call_check(this, B), _super.apply(this, arguments);
    }
    var _proto = B.prototype;
    return _proto.bar = function() {
        return "";
    }, B;
}(A);
new A(), new B(), new B();
