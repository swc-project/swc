//// [emitDefaultParametersFunctionExpression.ts]
var lambda1 = function() {
    var y = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "hello";
};
var lambda2 = function(x) {
    var y = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "hello";
};
var lambda3 = function(x) {
    var y = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "hello";
    for(var _len = arguments.length, rest = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++){
        rest[_key - 2] = arguments[_key];
    }
};
var lambda4 = function() {
    var y = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "hello";
    for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        rest[_key - 1] = arguments[_key];
    }
};
var x = function x() {
    var str = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "hello";
    for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        rest[_key - 1] = arguments[_key];
    }
};
var y = function() {
    var num = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 10, boo = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
    for(var _len = arguments.length, rest = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++){
        rest[_key - 2] = arguments[_key];
    }
}();
var z = function(num) {
    var boo = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
    for(var _len = arguments.length, rest = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++){
        rest[_key - 2] = arguments[_key];
    }
}(10);
