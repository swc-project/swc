function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
        for(var i = 0, arr2 = new Array(arr.length); i < arr.length; i++){
            arr2[i] = arr[i];
        }
        return arr2;
    }
}
function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}
function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
}
function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}
// @strict: true
// @declaration: true
function f0(a, b) {
    f0(a, b);
    f1(a, b);
    f2(a, b);
}
function f1() {
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
        args[_key] = arguments[_key];
    }
    f0.apply(void 0, _toConsumableArray(args)); // Error
    f1('abc', 'def');
    f1.apply(void 0, [
        'abc'
    ].concat(_toConsumableArray(args)));
    f1.apply(void 0, _toConsumableArray(args));
}
function f2() {
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
        args[_key] = arguments[_key];
    }
    f0.apply(void 0, _toConsumableArray(args));
    f1('abc', 'def');
    f1.apply(void 0, [
        'abc'
    ].concat(_toConsumableArray(args)));
    f1.apply(void 0, _toConsumableArray(args));
    f2('abc', 'def');
    f2.apply(void 0, [
        'abc'
    ].concat(_toConsumableArray(args))); // Error
    f2.apply(void 0, _toConsumableArray(args));
}
function f4() {
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
        args[_key] = arguments[_key];
    }
    args[0] = 'abc'; // Error
}
