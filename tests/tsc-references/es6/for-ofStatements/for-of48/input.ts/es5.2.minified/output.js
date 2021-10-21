var E;
(E = E1 || (E1 = {
}))[E.x = 0] = "x";
var _iteratorNormalCompletion = !0, _didIteratorError = !1, _iteratorError = void 0;
try {
    for(var E1, ref, ref1, _step, _iterator = [
        {
            x: "",
            y: !0
        }
    ][Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = !0)(ref = _step.value).x, ref1 = ref.y, void 0 === ref1;
} catch (err) {
    _didIteratorError = !0, _iteratorError = err;
} finally{
    try {
        _iteratorNormalCompletion || null == _iterator.return || _iterator.return();
    } finally{
        if (_didIteratorError) throw _iteratorError;
    }
}
