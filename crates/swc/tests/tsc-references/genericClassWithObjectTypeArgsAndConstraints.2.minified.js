//// [genericClassWithObjectTypeArgsAndConstraints.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var c1, d1, c11, d11, Class, Interface, X = function X() {
    _class_call_check(this, X);
};
Class || (Class = {}), c1 = new X(), d1 = new X(), (void 0).foo(c1, d1), (void 0).foo(c1, c1), (void 0).foo2(c1, d1), (void 0).foo2(c1, c1), Interface || (Interface = {}), c11 = new X(), d11 = new X(), (void 0).foo(c11, d11), (void 0).foo(c11, c11), (void 0).foo2(c11, d11), (void 0).foo2(c11, c11);
