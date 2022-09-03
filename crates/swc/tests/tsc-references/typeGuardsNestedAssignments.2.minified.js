//// [typeGuardsNestedAssignments.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _instanceof from "@swc/helpers/src/_instanceof.mjs";
var match, Foo = function Foo() {
    "use strict";
    _class_call_check(this, Foo);
};
function f1() {
    getFooOrNull();
}
function f2() {
    getFooOrNull();
}
function f3() {
    _instanceof(getFooOrNull(), Foo);
}
function f4() {
    getStringOrNumberOrNull();
}
for(var re = /./g; null != (match = re.exec("xxx"));)var length = match[1].length + match[2].length;
