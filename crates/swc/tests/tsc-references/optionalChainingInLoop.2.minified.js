//// [optionalChainingInLoop.ts]
var _iteratorNormalCompletion = !0, _didIteratorError = !1, _iteratorError = void 0;
try {
    for(var _step, _iterator = [][Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = !0)!function() {
        var comp = _step.value;
        comp.sp.y = comp.sp.r.find(function(k) {
            return k.c == (comp.xp ? '1' : '0');
        });
        var _iteratorNormalCompletion = !0, _didIteratorError = !1, _iteratorError = void 0;
        try {
            for(var _step1, _iterator = comp.c[Symbol.iterator](); !(_iteratorNormalCompletion = (_step1 = _iterator.next()).done); _iteratorNormalCompletion = !0){
                var _item_t, item = _step1.value;
                item.v = !!(null === (_item_t = item.t) || void 0 === _item_t ? void 0 : _item_t.length);
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
    }();
} catch (err) {
    _didIteratorError = !0, _iteratorError = err;
} finally{
    try {
        _iteratorNormalCompletion || null == _iterator.return || _iterator.return();
    } finally{
        if (_didIteratorError) throw _iteratorError;
    }
}
