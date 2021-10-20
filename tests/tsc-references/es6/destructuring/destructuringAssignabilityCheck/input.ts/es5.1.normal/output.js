function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
}
function _iterableToArrayLimit(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;
    try {
        for(var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
}
function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}
function _throw(e) {
    throw e;
}
// @strict: true
var ref = _slicedToArray({
}, 0); // should be error
var undefined1 = undefined1 !== null ? undefined1 : _throw(new TypeError("Cannot destructure undefined")); // error correctly
(function(param) {
    var _param = _slicedToArray(param, 0);
    return 0;
})({
}); // should be error
(function(param) {
    var param = param !== null ? param : _throw(new TypeError("Cannot destructure undefined"));
    return 0;
})(undefined1); // should be error
function foo(param) {
    var param = param !== null ? param : _throw(new TypeError("Cannot destructure undefined"));
    return 0;
}
function bar(param) {
    var _param = _slicedToArray(param, 0);
    return 0;
}
var ref1 = 1, ref1 = ref1 !== null ? ref1 : _throw(new TypeError("Cannot destructure undefined"));
var ref2 = _slicedToArray({
}, 0);
