//// [genericClassWithObjectTypeArgsAndConstraints.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var g, g2, c1, d1, g1, g21, c11, d11, Class, Interface, X = function X() {
    _class_call_check(this, X);
};
Class || (Class = {}), c1 = new X(), d1 = new X(), g.foo(c1, d1), g.foo(c1, c1), g2.foo2(c1, d1), g2.foo2(c1, c1), Interface || (Interface = {}), c11 = new X(), d11 = new X(), g1.foo(c11, d11), g1.foo(c11, c11), g21.foo2(c11, d11), g21.foo2(c11, c11);
