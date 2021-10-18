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
var _iteratorNormalCompletion = !0, _didIteratorError = !1, _iteratorError = void 0;
try {
    for(var _step, _iterator = [
        []
    ][Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = !0){
        var _value = _slicedToArray(_step.value, 2);
        _value[0], _value[1];
    }
} catch (err) {
    _didIteratorError = !0, _iteratorError = err;
} finally{
    try {
        _iteratorNormalCompletion || null == _iterator.return || _iterator.return();
    } finally{
        if (_didIteratorError) throw _iteratorError;
    }
}
