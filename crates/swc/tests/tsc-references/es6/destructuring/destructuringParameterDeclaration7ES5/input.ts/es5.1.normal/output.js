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
function foo(param, param1) {
    var param = param !== null ? param : _throw(new TypeError("Cannot destructure undefined")), foo = param1.foo, bar = param1.bar;
}
function baz(param, param2) {
    var _param = _slicedToArray(param, 0), foo = param2.foo, bar = param2.bar;
}
function one(param, param3) {
    var _param = _slicedToArray(param, 0), param3 = param3 !== null ? param3 : _throw(new TypeError("Cannot destructure undefined"));
}
function two(param, param4) {
    var _param = _slicedToArray(param, 0), _param1 = _slicedToArray(param4, 3), a = _param1[0], b = _param1[1], c = _param1[2];
}
