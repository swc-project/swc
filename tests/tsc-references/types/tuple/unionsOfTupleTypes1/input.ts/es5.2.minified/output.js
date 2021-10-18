var arr, i, _ex = (i = 2, function(arr) {
    if (Array.isArray(arr)) return arr;
}(arr = [
    "hi"
]) || function(arr, i) {
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
}(arr, i) || function() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
}());
_ex[0], _ex[1];
