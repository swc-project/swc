import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var C = function C() {
    "use strict";
    _class_call_check(this, C);
}, D = function D() {
    "use strict";
    _class_call_check(this, D);
}, unionTuple = [
    new C(),
    "foo"
], unionTuple1 = [
    new C(),
    "foo"
], unionTuple2 = [
    new C(),
    "foo",
    new D()
];
unionTuple = unionTuple1, unionTuple = unionTuple2, unionTuple2 = unionTuple;
