import _sliced_to_array from "@swc/helpers/lib/_sliced_to_array.js";
import _to_array from "@swc/helpers/lib/_to_array.js";
// @target:es6
var f1 = function() {};
var f2 = function(x, y) {};
var f3 = function(x, y) {
    for(var _len = arguments.length, rest = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++){
        rest[_key - 2] = arguments[_key];
    }
};
var f4 = function(x, y) {
    var z = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 10;
};
function foo(func) {}
foo(function() {
    return true;
});
foo(function() {
    return false;
});
// Binding patterns in arrow functions
var p1 = function(param) {
    var _param = _sliced_to_array(param, 1), a = _param[0];
};
var p2 = function(param) {
    var _param = _to_array(param), a = _param.slice(0);
};
var p3 = function(param) {
    var _param = _sliced_to_array(param, 2), a = _param[1];
};
var p4 = function(param) {
    var _param = _to_array(param), a = _param.slice(1);
};
var p5 = function(param) {
    var _param = _sliced_to_array(param, 1), tmp = _param[0], a = tmp === void 0 ? 1 : tmp;
};
var p6 = function(param) {
    var a = param.a;
};
var p7 = function(param) {
    var b = param.a.b;
};
var p8 = function(param) {
    var _a = param.a, a = _a === void 0 ? 1 : _a;
};
var p9 = function(param) {
    var tmp = param.a, ref = tmp === void 0 ? {
        b: 1
    } : tmp, _b = ref.b, b = _b === void 0 ? 1 : _b;
};
var p10 = function(param) {
    var _param = _sliced_to_array(param, 1), ref = _param[0], value = ref.value, done = ref.done;
};
