var _define_property = require("@swc/helpers/_/_define_property");
var _extends = require("@swc/helpers/_/_extends");
var _object_destructuring_empty = require("@swc/helpers/_/_object_destructuring_empty");
var _sliced_to_array = require("@swc/helpers/_/_sliced_to_array");
var _to_array = require("@swc/helpers/_/_to_array");
alert(a);
console.log(a);
function f1() {
    alert(a);
}
obj[a];
"".concat(a);
[
    a
];
var x = a + "";
var e = _define_property._({}, a, "");
var a = {};
// ----
function f2() {
    alert(b);
    var b = {};
}
// ----
console.log(a1);
var _ref = {}, a1 = _ref.a1, a2 = _ref.a2;
console.log(a2);
// ----
console.log(a3);
var _ref1 = {}, _ref_a3 = _ref1.a3, a3 = _ref_a3 === void 0 ? "a" : _ref_a3;
// ----
console.log(a4);
var _ref2 = {}, a4 = _ref2.n.a4;
// ----
console.log(a5);
var _ref3 = {}, ref = _object_destructuring_empty._(_ref3), a5 = _extends._({}, _ref3);
// ----
console.log(a6);
var _ref4 = _sliced_to_array._({}, 1), a6 = _ref4[0];
// ----
console.log(a7);
var _ref5 = _to_array._({}), _ = _ref5[0], a7 = _ref5.slice(1);
function b1(a) {
    alert(a);
}
