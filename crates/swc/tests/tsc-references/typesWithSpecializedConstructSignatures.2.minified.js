//// [typesWithSpecializedConstructSignatures.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
var i, a, C = function C(x) {
    return _class_call_check(this, C), x;
};
new C('a'), a = i = a, new C('hi'), new i('bye'), new a('hm');
