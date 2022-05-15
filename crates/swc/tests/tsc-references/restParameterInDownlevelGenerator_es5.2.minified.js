import regeneratorRuntime from "regenerator-runtime";
var _marked = regeneratorRuntime.mark(mergeStringLists);
function mergeStringLists() {
    var _len, strings, _key, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, str, _args = arguments;
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
                for(_len = _args.length, strings = new Array(_len), _key = 0; _key < _len; _key++)strings[_key] = _args[_key];
                for(_iteratorNormalCompletion = !0, _didIteratorError = !1, _iteratorError = void 0, _ctx.prev = 2, _iterator = strings[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = !0)str = _step.value;
                _ctx.next = 10;
                break;
            case 6:
                _ctx.prev = 6, _ctx.t0 = _ctx.catch(2), _didIteratorError = !0, _iteratorError = _ctx.t0;
            case 10:
                _ctx.prev = 10, _ctx.prev = 11, _iteratorNormalCompletion || null == _iterator.return || _iterator.return();
            case 13:
                if (_ctx.prev = 13, !_didIteratorError) {
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
