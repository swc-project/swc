//// [templateStringWithCommentsInArrowFunction.ts]
var a = 1;
var f1 = function() {
    return "".concat(// a
    a, "a");
};
var f2 = function() {
    return "".concat(// a
    a);
};
