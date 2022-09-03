//// [emitRestParametersFunctionExpression.ts]
var funcExp = function() {
    for(var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++)rest[_key] = arguments[_key];
}, funcExp1 = function(X) {
    for(var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++)rest[_key - 1] = arguments[_key];
}, funcExp2 = function() {
    for(var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++)rest[_key] = arguments[_key];
}, funcExp3 = function() {
    for(var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++)rest[_key] = arguments[_key];
}();
