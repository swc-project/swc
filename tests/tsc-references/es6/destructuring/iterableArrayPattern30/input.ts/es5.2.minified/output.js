function _slicedToArray(arr, i) {
    return (function(arr) {
        if (Array.isArray(arr)) return arr;
    })(arr) || (function(arr, i) {
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
    })(arr, i) || (function() {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
    })();
}
var ref = _slicedToArray(new Map([
    [
        "",
        !0
    ],
    [
        "hello",
        !0
    ]
]), 2), ref1 = _slicedToArray(ref[0], 2), k1 = ref1[0], v1 = ref1[1], ref2 = _slicedToArray(ref[1], 2);
ref2[0], ref2[1];
