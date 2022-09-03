//// [checkJsdocTypeTag1.ts]
//// [0.js]
var S = "hello world", n = 10, anyT = 2;
anyT = "hello";
var anyT1 = 2;
anyT1 = "hi";
var x = function(a) {
    return a + 1;
};
x(1);
var y = function(a) {
    return a + 1;
};
y(1);
var x1 = function(a) {
    return a + 1;
};
x1(0);
var x2 = function(a) {
    return a + 1;
};
x2(0);
var props = {}, props = {};
