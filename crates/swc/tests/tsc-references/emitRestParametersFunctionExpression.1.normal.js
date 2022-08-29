//// [emitRestParametersFunctionExpression.ts]
var funcExp = function() {
    for(var _len = arguments.length, rest = new Array(_len), _key = 0; _key < _len; _key++){
        rest[_key] = arguments[_key];
    }
};
var funcExp1 = function(X) {
    for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        rest[_key - 1] = arguments[_key];
    }
};
var funcExp2 = function funcExp2() {
    for(var _len = arguments.length, rest = new Array(_len), _key = 0; _key < _len; _key++){
        rest[_key] = arguments[_key];
    }
};
var funcExp3 = function() {
    for(var _len = arguments.length, rest = new Array(_len), _key = 0; _key < _len; _key++){
        rest[_key] = arguments[_key];
    }
}();
