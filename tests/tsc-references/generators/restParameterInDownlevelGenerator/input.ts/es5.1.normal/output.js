import regeneratorRuntime from "regenerator-runtime";
var _marked = regeneratorRuntime.mark(mergeStringLists);
// @target: es5
// @lib: es2015
// @downlevelIteration: true
// @noEmitHelpers: true
// https://github.com/Microsoft/TypeScript/issues/30653
function mergeStringLists() {
    for(var _len = arguments.length, strings = new Array(_len), _key = 0; _key < _len; _key++){
        strings[_key] = arguments[_key];
    }
    var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, str;
    return regeneratorRuntime.wrap(function mergeStringLists$(_ctx) {
        while(1)switch(_ctx.prev = _ctx.next){
            case 0:
                _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                _ctx.prev = 1;
                for(_iterator = strings[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                    str = _step.value;
                    ;
                }
                _ctx.next = 9;
                break;
            case 5:
                _ctx.prev = 5;
                _ctx.t0 = _ctx["catch"](1);
                _didIteratorError = true;
                _iteratorError = _ctx.t0;
            case 9:
                _ctx.prev = 9;
                _ctx.prev = 10;
                if (!_iteratorNormalCompletion && _iterator.return != null) {
                    _iterator.return();
                }
            case 12:
                _ctx.prev = 12;
                if (!_didIteratorError) {
                    _ctx.next = 15;
                    break;
                }
                throw _iteratorError;
            case 15:
                return _ctx.finish(12);
            case 16:
                return _ctx.finish(9);
            case 17:
            case "end":
                return _ctx.stop();
        }
    }, _marked, null, [
        [
            10,
            ,
            12,
            16
        ],
        [
            1,
            5,
            9,
            17
        ]
    ]);
}
