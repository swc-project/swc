//// [restParameterInDownlevelGenerator.ts]
// https://github.com/Microsoft/TypeScript/issues/30653
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
function mergeStringLists() {
    var _len, strings, _key, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, str;
    var _arguments = arguments;
    return _ts_generator(this, function(_state) {
        for(_len = _arguments.length, strings = new Array(_len), _key = 0; _key < _len; _key++){
            strings[_key] = _arguments[_key];
        }
        _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
        try {
            for(_iterator = strings[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                str = _step.value;
                ;
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
        return [
            2
        ];
    });
}
