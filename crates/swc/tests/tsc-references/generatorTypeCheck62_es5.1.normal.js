// @module: commonjs
// @target: es6
// @noImplicitAny: true
import regeneratorRuntime from "regenerator-runtime";
export function strategy(stratName, gen) {
    return regeneratorRuntime.mark(function _callee(state) {
        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, next;
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    _ctx.prev = 1;
                    _iterator = gen(state)[Symbol.iterator]();
                case 3:
                    if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                        _ctx.next = 11;
                        break;
                    }
                    next = _step.value;
                    if (next) {
                        next.lastStrategyApplied = stratName;
                    }
                    _ctx.next = 8;
                    return next;
                case 8:
                    _iteratorNormalCompletion = true;
                    _ctx.next = 3;
                    break;
                case 11:
                    _ctx.next = 17;
                    break;
                case 13:
                    _ctx.prev = 13;
                    _ctx.t0 = _ctx["catch"](1);
                    _didIteratorError = true;
                    _iteratorError = _ctx.t0;
                case 17:
                    _ctx.prev = 17;
                    _ctx.prev = 18;
                    if (!_iteratorNormalCompletion && _iterator.return != null) {
                        _iterator.return();
                    }
                case 20:
                    _ctx.prev = 20;
                    if (!_didIteratorError) {
                        _ctx.next = 23;
                        break;
                    }
                    throw _iteratorError;
                case 23:
                    return _ctx.finish(20);
                case 24:
                    return _ctx.finish(17);
                case 25:
                case "end":
                    return _ctx.stop();
            }
        }, _callee, null, [
            [
                1,
                13,
                17,
                25
            ],
            [
                18,
                ,
                20,
                24
            ]
        ]);
    });
}
export var Nothing1 = strategy("Nothing", regeneratorRuntime.mark(function _callee(state) {
    return regeneratorRuntime.wrap(function _callee$(_ctx) {
        while(1)switch(_ctx.prev = _ctx.next){
            case 0:
                return _ctx.abrupt("return", state);
            case 1:
            case "end":
                return _ctx.stop();
        }
    }, _callee);
}));
export var Nothing2 = strategy("Nothing", regeneratorRuntime.mark(function _callee(state) {
    return regeneratorRuntime.wrap(function _callee$(_ctx) {
        while(1)switch(_ctx.prev = _ctx.next){
            case 0:
                _ctx.next = 2;
                return state;
            case 2:
            case "end":
                return _ctx.stop();
        }
    }, _callee);
}));
export var Nothing3 = strategy("Nothing", regeneratorRuntime.mark(function _callee(state) {
    return regeneratorRuntime.wrap(function _callee$(_ctx) {
        while(1)switch(_ctx.prev = _ctx.next){
            case 0:
                _ctx.next = 2;
                return;
            case 2:
                return _ctx.abrupt("return", state);
            case 3:
            case "end":
                return _ctx.stop();
        }
    }, _callee);
}));
