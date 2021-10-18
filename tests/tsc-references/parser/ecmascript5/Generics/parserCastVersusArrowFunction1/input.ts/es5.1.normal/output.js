var v = function() {
    return 1;
};
var v = a;
var v = function(a) {
    return 1;
};
var v = function(a, b) {
    return 1;
};
var v = function(param, param1) {
    var a = param === void 0 ? 1 : param, b = param1 === void 0 ? 2 : param1;
    return 1;
};
var v = a;
var v = (a, b);
var v = (a = 1, b = 2);
