for(var _i = 0, _iter = [
    "hello"
]; _i < _iter.length; _i++)_iter[_i];
var _iteratorNormalCompletion = !0, _didIteratorError = !1, _iteratorError = void 0;
try {
    for(var _step, _iterator = "hello"[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = !0)_step.value;
} catch (err) {
    _didIteratorError = !0, _iteratorError = err;
} finally{
    try {
        _iteratorNormalCompletion || null == _iterator.return || _iterator.return();
    } finally{
        if (_didIteratorError) throw _iteratorError;
    }
}
