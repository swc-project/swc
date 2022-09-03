//// [parserCastVersusArrowFunction1.ts]
var v = function() {
    return 1;
}, v = a, v = function(a1) {
    return 1;
}, v = function(a1, b1) {
    return 1;
}, v = function() {
    return arguments.length > 0 && void 0 !== arguments[0] && arguments[0], arguments.length > 1 && void 0 !== arguments[1] && arguments[1], 1;
}, v = a, v = (a, b), v = (a = 1, b = 2);
