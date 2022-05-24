import _async_to_generator from "@swc/helpers/lib/_async_to_generator.js";
import regeneratorRuntime from "regenerator-runtime";
function fun(deepPromised) {
    return _fun.apply(this, arguments);
}
function _fun() {
    return (_fun = _async_to_generator(regeneratorRuntime.mark(function _callee(deepPromised) {
        var deepPromisedWithIndexer, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, value, awaitedValue;
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    deepPromisedWithIndexer = deepPromised, _iteratorNormalCompletion = !0, _didIteratorError = !1, _iteratorError = void 0, _ctx.prev = 2, _iterator = Object.values(deepPromisedWithIndexer)[Symbol.iterator]();
                case 4:
                    if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                        _ctx.next = 15;
                        break;
                    }
                    return value = _step.value, _ctx.next = 8, value;
                case 8:
                    if (!(awaitedValue = _ctx.sent)) {
                        _ctx.next = 12;
                        break;
                    }
                    return _ctx.next = 12, fun(awaitedValue);
                case 12:
                    _iteratorNormalCompletion = !0, _ctx.next = 4;
                    break;
                case 15:
                    _ctx.next = 21;
                    break;
                case 17:
                    _ctx.prev = 17, _ctx.t0 = _ctx.catch(2), _didIteratorError = !0, _iteratorError = _ctx.t0;
                case 21:
                    _ctx.prev = 21, _ctx.prev = 22, _iteratorNormalCompletion || null == _iterator.return || _iterator.return();
                case 24:
                    if (_ctx.prev = 24, !_didIteratorError) {
                        _ctx.next = 27;
                        break;
                    }
                    throw _iteratorError;
                case 27:
                    return _ctx.finish(24);
                case 28:
                    return _ctx.finish(21);
                case 29:
                case "end":
                    return _ctx.stop();
            }
        }, _callee, null, [
            [
                2,
                17,
                21,
                29
            ],
            [
                22,
                ,
                24,
                28
            ]
        ]);
    }))).apply(this, arguments);
}
f1(1, 2), f1(1, "hello"), f1(1, sn), f1(void 0, "abc"), f1("foo", "bar"), f1(!0, !1), f1("hello", 1), f2([
    "string",
    !0
]), f3(5), f3(sn), f3(!0), f3(b), f3("abc"), f4("abc"), f4(s), f4(42), foo(x), bar(1, 2), Symbol(), baz(xx);
