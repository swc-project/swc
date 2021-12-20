function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
var numStrBoolTuple = [
    5,
    "foo",
    !0
], C = function() {
    "use strict";
    _classCallCheck(this, C);
}, D = function() {
    "use strict";
    _classCallCheck(this, D);
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
numStrBoolTuple = numStrBoolTuple, unionTuple2 = unionTuple2;
