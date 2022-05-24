import _async_iterator from "@swc/helpers/lib/_async_iterator.js";
import _async_to_generator from "@swc/helpers/lib/_async_to_generator.js";
import _wrap_async_generator from "@swc/helpers/lib/_wrap_async_generator.js";
import regeneratorRuntime from "regenerator-runtime";
function lol() {
    return _lol.apply(this, arguments);
}
function _lol() {
    _lol = _wrap_async_generator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    _ctx.next = 2;
                    return 1;
                case 2:
                    _ctx.next = 4;
                    return 2;
                case 4:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _lol.apply(this, arguments);
}
function main() {
    return _main.apply(this, arguments);
}
function _main() {
    _main = _async_to_generator(regeneratorRuntime.mark(function _callee() {
        var _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, x;
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    _iteratorAbruptCompletion = false, _didIteratorError = false;
                    _ctx.prev = 1;
                    _iterator = _async_iterator(lol());
                case 3:
                    _ctx.next = 5;
                    return _iterator.next();
                case 5:
                    if (!(_iteratorAbruptCompletion = !(_step = _ctx.sent).done)) {
                        _ctx.next = 10;
                        break;
                    }
                    {
                        _value = _step.value;
                        x = _value;
                        console.log(x);
                    }
                case 7:
                    _iteratorAbruptCompletion = false;
                    _ctx.next = 3;
                    break;
                case 10:
                    _ctx.next = 16;
                    break;
                case 12:
                    _ctx.prev = 12;
                    _ctx.t0 = _ctx["catch"](1);
                    _didIteratorError = true;
                    _iteratorError = _ctx.t0;
                case 16:
                    _ctx.prev = 16;
                    _ctx.prev = 17;
                    if (!(_iteratorAbruptCompletion && _iterator.return != null)) {
                        _ctx.next = 21;
                        break;
                    }
                    _ctx.next = 21;
                    return _iterator.return();
                case 21:
                    _ctx.prev = 21;
                    if (!_didIteratorError) {
                        _ctx.next = 24;
                        break;
                    }
                    throw _iteratorError;
                case 24:
                    return _ctx.finish(21);
                case 25:
                    return _ctx.finish(16);
                case 26:
                case "end":
                    return _ctx.stop();
            }
        }, _callee, null, [
            [
                1,
                12,
                16,
                26
            ],
            [
                17,
                ,
                21,
                25
            ]
        ]);
    }));
    return _main.apply(this, arguments);
}
main();
