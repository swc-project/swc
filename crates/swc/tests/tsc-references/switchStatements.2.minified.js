//// [switchStatements.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _type_of } from "@swc/helpers/_/_type_of";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
(M || (M = {})).fn = function(x) {
    return "";
}, void 0 === x || _type_of(x), void 0 === M || _type_of(M), M.fn(1);
// basic assignable check, rest covered in tests for 'assignment compatibility'
var M, x, C = function C() {
    _class_call_check(this, C);
}, D = function(C) {
    _inherits(D, C);
    var _super = _create_super(D);
    function D() {
        return _class_call_check(this, D), _super.apply(this, arguments);
    }
    return D;
}(C);
switch(new C()){
    case new D():
    case {
        id: 12,
        name: ""
    }:
    case new C():
}
