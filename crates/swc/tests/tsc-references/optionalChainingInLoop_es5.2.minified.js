var list = [], _iteratorNormalCompletion = !0, _didIteratorError = !1, _iteratorError = void 0;
try {
    for(var _step, _loop = function(_iterator, _step) {
        var comp = _step.value;
        comp.sp.y = comp.sp.r.find(function(k) {
            return k.c == (comp.xp ? "1" : "0");
        });
        var _iteratorNormalCompletion = !0, _didIteratorError = !1, _iteratorError = void 0;
        try {
            for(var _step1, _iterator1 = comp.c[Symbol.iterator](); !(_iteratorNormalCompletion = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion = !0){
                var ref, item = _step1.value;
                item.v = !!(null === (ref = item.t) || void 0 === ref ? void 0 : ref.length);
            }
        } catch (err) {
            _didIteratorError = !0, _iteratorError = err;
        } finally{
            try {
                _iteratorNormalCompletion || null == _iterator1.return || _iterator1.return();
            } finally{
                if (_didIteratorError) throw _iteratorError;
            }
        }
    }, _iterator = list[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = !0)_loop(_iterator, _step);
} catch (err) {
    _didIteratorError = !0, _iteratorError = err;
} finally{
    try {
        _iteratorNormalCompletion || null == _iterator.return || _iterator.return();
    } finally{
        if (_didIteratorError) throw _iteratorError;
    }
}
