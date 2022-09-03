//// [restParameterInDownlevelGenerator.ts]
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
function mergeStringLists() {
    var _len, strings, _key, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, str, _arguments = arguments;
    return _ts_generator(this, function(_state) {
        for(strings = Array(_len = _arguments.length), _key = 0; _key < _len; _key++)strings[_key] = _arguments[_key];
        _iteratorNormalCompletion = !0, _didIteratorError = !1, _iteratorError = void 0;
        try {
            for(_iterator = strings[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = !0)str = _step.value;
        } catch (err) {
            _didIteratorError = !0, _iteratorError = err;
        } finally{
            try {
                _iteratorNormalCompletion || null == _iterator.return || _iterator.return();
            } finally{
                if (_didIteratorError) throw _iteratorError;
            }
        }
        return [
            2
        ];
    });
}
