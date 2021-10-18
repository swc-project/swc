function _toConsumableArray(arr) {
    return (function(arr) {
        if (Array.isArray(arr)) {
            for(var i = 0, arr2 = new Array(arr.length); i < arr.length; i++)arr2[i] = arr[i];
            return arr2;
        }
    })(arr) || (function(iter) {
        if (Symbol.iterator in Object(iter) || "[object Arguments]" === Object.prototype.toString.call(iter)) return Array.from(iter);
    })(arr) || (function() {
        throw new TypeError("Invalid attempt to spread non-iterable instance");
    })();
}
function f0(a, b) {
    f0(a, b), f1(a, b), f2(a, b);
}
function f1() {
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
    f0.apply(void 0, _toConsumableArray(args)), f1("abc", "def"), f1.apply(void 0, [
        "abc"
    ].concat(_toConsumableArray(args))), f1.apply(void 0, _toConsumableArray(args));
}
function f2() {
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
    f0.apply(void 0, _toConsumableArray(args)), f1("abc", "def"), f1.apply(void 0, [
        "abc"
    ].concat(_toConsumableArray(args))), f1.apply(void 0, _toConsumableArray(args)), f2("abc", "def"), f2.apply(void 0, [
        "abc"
    ].concat(_toConsumableArray(args))), f2.apply(void 0, _toConsumableArray(args));
}
