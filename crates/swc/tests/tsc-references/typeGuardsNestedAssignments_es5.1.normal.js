import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _instanceof from "@swc/helpers/lib/_instanceof.js";
// @strictNullChecks: true
var Foo = function Foo() {
    "use strict";
    _class_call_check(this, Foo);
};
function f1() {
    var foo;
    if ((foo = getFooOrNull()) !== null) {
        foo; // Foo
    }
}
function f2() {
    var foo1;
    var foo2;
    if ((foo1 = getFooOrNull(), foo2 = foo1) !== null) {
        foo1; // Foo | null
        foo2; // Foo
    }
}
function f3() {
    var obj;
    if (_instanceof(obj = getFooOrNull(), Foo)) {
        obj;
    }
}
function f4() {
    var x;
    if (typeof (x = getStringOrNumberOrNull()) === "number") {
        x;
    }
}
// Repro from #8851
var re = /./g;
var match;
while((match = re.exec("xxx")) != null){
    var length = match[1].length + match[2].length;
}
