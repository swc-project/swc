// @target: es5
// @lib: es2015
// @downlevelIteration: true
// @noEmitHelpers: true
// https://github.com/Microsoft/TypeScript/issues/30653
import regeneratorRuntime from "regenerator-runtime";
var _marked = /*#__PURE__*/ regeneratorRuntime.mark(mergeStringLists);
function mergeStringLists() {
    var _len, strings, _key, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, str, _args = arguments;
    return regeneratorRuntime.wrap(function mergeStringLists$(_ctx) {
        while(1)switch(_ctx.prev = _ctx.next){
            case 0:
                for(_len = _args.length, strings = new Array(_len), _key = 0; _key < _len; _key++){
                    strings[_key] = _args[_key];
                }
                _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                _ctx.prev = 2;
                for(_iterator = strings[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                    str = _step.value;
                    ;
                }
                _ctx.next = 10;
                break;
            case 6:
                _ctx.prev = 6;
                _ctx.t0 = _ctx["catch"](2);
                _didIteratorError = true;
                _iteratorError = _ctx.t0;
            case 10:
                _ctx.prev = 10;
                _ctx.prev = 11;
                if (!_iteratorNormalCompletion && _iterator.return != null) {
                    _iterator.return();
                }
            case 13:
                _ctx.prev = 13;
                if (!_didIteratorError) {
                    _ctx.next = 16;
                    break;
                }
                throw _iteratorError;
            case 16:
                return _ctx.finish(13);
            case 17:
                return _ctx.finish(10);
            case 18:
            case "end":
                return _ctx.stop();
        }
    }, _marked, null, [
        [
            2,
            6,
            10,
            18
        ],
        [
            11,
            ,
            13,
            17
        ]
    ]);
}
