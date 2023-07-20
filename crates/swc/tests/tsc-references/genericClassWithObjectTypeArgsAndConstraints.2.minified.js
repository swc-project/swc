//// [genericClassWithObjectTypeArgsAndConstraints.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var Class, Interface, X = function X() {
    _class_call_check(this, X);
};
!function(Class) {
    var g, g2, c1 = new X(), d1 = new X();
    g.foo(c1, d1), g.foo(c1, c1), g2.foo2(c1, d1), g2.foo2(c1, c1);
}(Class || (Class = {})), function(Interface) {
    var g, g2, c1 = new X(), d1 = new X();
    g.foo(c1, d1), g.foo(c1, c1), g2.foo2(c1, d1), g2.foo2(c1, c1);
}(Interface || (Interface = {}));
