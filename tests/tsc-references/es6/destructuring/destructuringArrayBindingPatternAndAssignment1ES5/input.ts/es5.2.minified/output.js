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
var _undefined = _slicedToArray(void 0, 2);
_undefined[0], _undefined[1], void 0 !== tmp, void 0 === tmp1;
var _undefined1 = _slicedToArray(void 0, 2), tmp = _undefined1[0], tmp1 = _undefined1[1];
function foo() {
    return [
        1,
        2,
        3
    ];
}
var ref = _slicedToArray(foo(), 2);
ref[0], ref[1], (_arrayWithHoles(arr = foo()) || _iterableToArray(arr) || _nonIterableRest()).slice(0);
var arr, arr, ref1 = _slicedToArray(function(arr) {
    if (Array.isArray(arr)) {
        for(var i = 0, arr2 = new Array(arr.length); i < arr.length; i++)arr2[i] = arr[i];
        return arr2;
    }
}(arr = [
    1,
    2,
    3
]) || _iterableToArray(arr) || function() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
}(), 2);
ref1[0], ref1[1];
