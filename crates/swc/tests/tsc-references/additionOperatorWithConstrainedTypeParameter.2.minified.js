//// [additionOperatorWithConstrainedTypeParameter.ts]
function sum(n, v, k) {
    n += v[k], n += v[k];
}
function realSum(n, vs, k) {
    var _iteratorNormalCompletion = !0, _didIteratorError = !1, _iteratorError = void 0;
    try {
        for(var _step, _iterator = vs[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = !0){
            var v = _step.value;
            n += v[k], n += v[k];
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
}
