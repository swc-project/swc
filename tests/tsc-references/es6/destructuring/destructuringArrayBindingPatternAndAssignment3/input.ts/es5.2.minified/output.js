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
var ref = [
    1
];
ref[0], ref[1];
var ref1 = [
    1
];
ref1[0], ref1[1], ref1[2];
var ref2 = [
    1
];
ref2[0], ref2[1], ref2[2], ref2[3], (function(param) {
    var _param = _slicedToArray(param, 2);
    _param[0], _param[1];
})([
    1
]), (function(param) {
    var _param = _slicedToArray(param, 3);
    _param[0], _param[1], _param[2];
})([
    1
]), (function(param) {
    var _param = _slicedToArray(param, 4);
    _param[0], _param[1], _param[2], _param[3];
})([
    1
]);
