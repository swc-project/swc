// @target:es6
var lambda1 = function(param) {
    var y = param === void 0 ? "hello" : param;
};
var lambda2 = function(x, param) {
    var y = param === void 0 ? "hello" : param;
};
var lambda3 = function(x, param) {
    var y = param === void 0 ? "hello" : param;
    for(var _len = arguments.length, rest = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++){
        rest[_key - 2] = arguments[_key];
    }
};
var lambda4 = function(param) {
    var y = param === void 0 ? "hello" : param;
    for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        rest[_key - 1] = arguments[_key];
    }
};
var x = function x(param) {
    var str = param === void 0 ? "hello" : param;
    for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        rest[_key - 1] = arguments[_key];
    }
};
var y = function(param, param1) {
    var num = param === void 0 ? 10 : param, boo = param1 === void 0 ? false : param1;
    for(var _len = arguments.length, rest = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++){
        rest[_key - 2] = arguments[_key];
    }
}();
var z = function(num, param) {
    var boo = param === void 0 ? false : param;
    for(var _len = arguments.length, rest = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++){
        rest[_key - 2] = arguments[_key];
    }
}(10);
