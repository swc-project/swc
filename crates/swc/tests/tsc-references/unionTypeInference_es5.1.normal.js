import _async_to_generator from "@swc/helpers/lib/_async_to_generator.js";
import regeneratorRuntime from "regenerator-runtime";
var a1 = f1(1, 2); // 1 | 2
var a2 = f1(1, "hello"); // 1
var a3 = f1(1, sn); // number
var a4 = f1(undefined, "abc"); // undefined
var a5 = f1("foo", "bar"); // "foo"
var a6 = f1(true, false); // boolean
var a7 = f1("hello", 1); // Error
var b1 = f2([
    "string",
    true
]); // boolean
var c1 = f3(5); // 5
var c2 = f3(sn); // number
var c3 = f3(true); // true
var c4 = f3(b); // true
var c5 = f3("abc"); // never
var d1 = f4("abc");
var d2 = f4(s);
var d3 = f4(42); // Error
function qux(p1, p2) {
    p1 = p2;
}
foo(x);
var y = bar(1, 2);
// Repro from #32752
var containsPromises = Symbol();
function fun(deepPromised) {
    return _fun.apply(this, arguments);
}
function _fun() {
    _fun = _async_to_generator(regeneratorRuntime.mark(function _callee(deepPromised) {
        var deepPromisedWithIndexer, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, value, awaitedValue;
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    deepPromisedWithIndexer = deepPromised;
                    _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    _ctx.prev = 2;
                    _iterator = Object.values(deepPromisedWithIndexer)[Symbol.iterator]();
                case 4:
                    if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                        _ctx.next = 15;
                        break;
                    }
                    value = _step.value;
                    _ctx.next = 8;
                    return value;
                case 8:
                    awaitedValue = _ctx.sent;
                    if (!awaitedValue) {
                        _ctx.next = 12;
                        break;
                    }
                    _ctx.next = 12;
                    return fun(awaitedValue);
                case 12:
                    _iteratorNormalCompletion = true;
                    _ctx.next = 4;
                    break;
                case 15:
                    _ctx.next = 21;
                    break;
                case 17:
                    _ctx.prev = 17;
                    _ctx.t0 = _ctx["catch"](2);
                    _didIteratorError = true;
                    _iteratorError = _ctx.t0;
                case 21:
                    _ctx.prev = 21;
                    _ctx.prev = 22;
                    if (!_iteratorNormalCompletion && _iterator.return != null) {
                        _iterator.return();
                    }
                case 24:
                    _ctx.prev = 24;
                    if (!_didIteratorError) {
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
    }));
    return _fun.apply(this, arguments);
}
baz(xx);
// @strict: true
// @target: esnext
export { };
