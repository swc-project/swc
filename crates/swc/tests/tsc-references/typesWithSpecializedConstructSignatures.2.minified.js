//// [typesWithSpecializedConstructSignatures.ts]
import "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import "@swc/helpers/_/_inherits";
var i, a, C = function C(x) {
    return _class_call_check(this, C), x;
};
new C('a'), a = i = a, new C('hi'), new i('bye'), new a('hm');
