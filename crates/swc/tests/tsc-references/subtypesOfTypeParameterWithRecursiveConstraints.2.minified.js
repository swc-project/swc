//// [subtypesOfTypeParameterWithRecursiveConstraints.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var M1, M2, Foo = function Foo() {
    "use strict";
    _class_call_check(this, Foo);
};
function f(t, u, v) {
    new Foo(), new Foo(), new Foo(), new Foo(), new Foo(), new Foo(), new Foo(), new Foo(), new Foo();
}
M1 || (M1 = {}), M2 || (M2 = {});
