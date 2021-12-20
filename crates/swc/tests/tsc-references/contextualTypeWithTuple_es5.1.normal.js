function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
// no error
var numStrTuple = [
    5,
    "hello"
];
var numStrTuple2 = [
    5,
    "foo",
    true
];
var numStrBoolTuple = [
    5,
    "foo",
    true
];
var objNumTuple = [
    {
        a: "world"
    },
    5
];
var strTupleTuple = [
    "bar",
    [
        5,
        {
            x: 1,
            y: 1
        }
    ]
];
var C = function C() {
    "use strict";
    _classCallCheck(this, C);
};
var D = function D() {
    "use strict";
    _classCallCheck(this, D);
};
var unionTuple = [
    new C(),
    "foo"
];
var unionTuple1 = [
    new C(),
    "foo"
];
var unionTuple2 = [
    new C(),
    "foo",
    new D()
];
var unionTuple3 = [
    10,
    "foo"
];
numStrTuple = numStrTuple2;
numStrTuple = numStrBoolTuple;
// error
objNumTuple = [
    {
    },
    5
];
numStrBoolTuple = numStrTuple;
var strStrTuple = [
    "foo",
    "bar",
    5
];
unionTuple = unionTuple1;
unionTuple = unionTuple2;
unionTuple2 = unionTuple;
numStrTuple = unionTuple3;
