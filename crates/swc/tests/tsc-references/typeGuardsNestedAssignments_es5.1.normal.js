function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}
var Foo = function Foo() {
    "use strict";
    _classCallCheck(this, Foo);
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
