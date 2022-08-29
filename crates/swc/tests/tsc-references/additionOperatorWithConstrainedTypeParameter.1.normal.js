//// [additionOperatorWithConstrainedTypeParameter.ts]
// test for #17069
function sum(n, v, k) {
    n = n + v[k];
    n += v[k]; // += should work the same way
}
function realSum(n, vs, k) {
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = vs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var v = _step.value;
            n = n + v[k];
            n += v[k];
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
            }
        } finally{
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
}
