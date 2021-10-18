import regeneratorRuntime from "regenerator-runtime";
var _marked = regeneratorRuntime.mark(function() {
    for(var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, str, _len = arguments.length, strings = new Array(_len), _key = 0; _key < _len; _key++)strings[_key] = arguments[_key];
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
                for(_iteratorNormalCompletion = !0, _didIteratorError = !1, _iteratorError = void 0, _ctx.prev = 1, _iterator = strings[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = !0)str = _step.value;
                _ctx.next = 9;
                break;
            case 5:
                _ctx.prev = 5, _ctx.t0 = _ctx.catch(1), _didIteratorError = !0, _iteratorError = _ctx.t0;
            case 9:
                _ctx.prev = 9, _ctx.prev = 10, _iteratorNormalCompletion || null == _iterator.return || _iterator.return();
            case 12:
                if (_ctx.prev = 12, !_didIteratorError) {
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
});
