//// [typesWithSpecializedConstructSignatures.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var a, C = function C(x) {
    return _class_call_check(this, C), x;
};
new C("a"), new C("hi"), new a("bye"), new a("hm");
