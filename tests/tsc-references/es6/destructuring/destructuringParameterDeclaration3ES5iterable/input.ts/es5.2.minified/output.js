function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
}
function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || "[object Arguments]" === Object.prototype.toString.call(iter)) return Array.from(iter);
}
function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
}
function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || (function(arr, i) {
        var _arr = [], _n = !0, _d = !1, _e = void 0;
        try {
            for(var _s, _i = arr[Symbol.iterator](); !(_n = (_s = _i.next()).done) && (_arr.push(_s.value), !i || _arr.length !== i); _n = !0);
        } catch (err) {
            _d = !0, _e = err;
        } finally{
            try {
                _n || null == _i.return || _i.return();
            } finally{
                if (_d) throw _e;
            }
        }
        return _arr;
    })(arr, i) || _nonIterableRest();
}
function _toArray(arr) {
    return _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest();
}
function _toConsumableArray(arr) {
    return (function(arr) {
        if (Array.isArray(arr)) {
            for(var i = 0, arr2 = new Array(arr.length); i < arr.length; i++)arr2[i] = arr[i];
            return arr2;
        }
    })(arr) || _iterableToArray(arr) || (function() {
        throw new TypeError("Invalid attempt to spread non-iterable instance");
    })();
}
function a10(param) {
    var _param = _toArray(param), a = _param[0], b = _param[1], ref = _slicedToArray(_param[2], 1), ref1 = _slicedToArray(ref[0], 1);
    ref1[0], _param.slice(3);
}
var E, E1, E2, E11, array = [
    1,
    2,
    3
];
function foo() {
    for(var _len = arguments.length, a = new Array(_len), _key = 0; _key < _len; _key++)a[_key] = arguments[_key];
}
function foo1() {
    for(var _len = arguments.length, a = new Array(_len), _key = 0; _key < _len; _key++)a[_key] = arguments[_key];
}
!function() {
    for(var _len = arguments.length, a = new Array(_len), _key = 0; _key < _len; _key++)a[_key] = arguments[_key];
}(_toConsumableArray(array)), (function() {
    for(var _len = arguments.length, x = new Array(_len), _key = 0; _key < _len; _key++)x[_key] = arguments[_key];
}).apply(void 0, _toConsumableArray(array)), (function(param) {
    var _param = _slicedToArray(param, 3), a = _param[0], b = _param[1], ref = _slicedToArray(_param[2], 1), ref2 = _slicedToArray(ref[0], 1);
    ref2[0];
})([
    1,
    2,
    [
        [
            "string"
        ]
    ],
    !1,
    !0
]), a10([
    1,
    2,
    [
        [
            "string"
        ]
    ],
    !1,
    !0
]), a10([
    1,
    2,
    3,
    !1,
    !0
]), a10([
    1,
    2
]), (function(param) {
    var _param = _toArray(param);
    _param[0], _param[1], _param[2], _param.slice(3);
})([
    1,
    2
]), foo("hello", 1, 2), foo("hello", "world"), (E = E2 || (E2 = {
}))[E.a = 0] = "a", E[E.b = 1] = "b", (E1 = E11 || (E11 = {
}))[E1.a = 0] = "a", E1[E1.b = 1] = "b", foo1(1, 2, 3, E2.a), foo1(1, 2, 3, E11.a, E2.b);
