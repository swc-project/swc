import regeneratorRuntime from "regenerator-runtime";
var _marked = regeneratorRuntime.mark(f);
function f() {
    var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step;
    return regeneratorRuntime.wrap(function f$(_ctx) {
        while(1)switch(_ctx.prev = _ctx.next){
            case 0:
                _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                _ctx.prev = 1;
                _loop = function(_iterator, _step) {
                    var i = _step.value;
                    setTimeout(function() {
                        return console.log(i);
                    }, 100);
                };
                for(_iterator = [
                    1,
                    2,
                    3
                ][Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true)_loop(_iterator, _step);
                _ctx.next = 10;
                break;
            case 6:
                _ctx.prev = 6;
                _ctx.t0 = _ctx["catch"](1);
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
            1,
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
