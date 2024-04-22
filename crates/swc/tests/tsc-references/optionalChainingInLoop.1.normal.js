//// [optionalChainingInLoop.ts]
// https://github.com/microsoft/TypeScript/issues/40643
var list = [];
var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
try {
    var _loop = function() {
        var comp = _step.value;
        comp.sp.y = comp.sp.r.find(function(k) {
            return k.c == (comp.xp ? '1' : '0');
        });
        var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
        try {
            for(var _iterator = comp.c[Symbol.iterator](), _step1; !(_iteratorNormalCompletion = (_step1 = _iterator.next()).done); _iteratorNormalCompletion = true){
                var item = _step1.value;
                var _item_t;
                item.v = !!((_item_t = item.t) === null || _item_t === void 0 ? void 0 : _item_t.length);
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
    };
    for(var _iterator = list[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true)_loop();
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
