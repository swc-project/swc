//// [templateStringWithCommentsInArrowFunction.ts]
var a = 1;
var f1 = function f1() {
    return "".concat(// a
    a, "a");
};
var f2 = function f2() {
    return "".concat(// a
    a);
};
