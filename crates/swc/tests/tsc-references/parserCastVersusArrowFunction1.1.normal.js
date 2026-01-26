//// [parserCastVersusArrowFunction1.ts]
var v = function v() {
    return 1;
};
var v = a;
var v = function v(a1) {
    return 1;
};
var v = function v(a1, b1) {
    return 1;
};
var v = function v() {
    var _$a = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1, _$b = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 2;
    return 1;
};
var v = a;
var v = (a, b);
var v = (a = 1, b = 2);
