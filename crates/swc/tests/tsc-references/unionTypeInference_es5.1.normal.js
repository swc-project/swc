// @strict: true
// @target: esnext
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
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
    _fun = _async_to_generator(function(deepPromised) {
        var deepPromisedWithIndexer, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, value, awaitedValue, err;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    deepPromisedWithIndexer = deepPromised;
                    _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        7,
                        8,
                        9
                    ]);
                    _iterator = Object.values(deepPromisedWithIndexer)[Symbol.iterator]();
                    _state.label = 2;
                case 2:
                    if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done)) return [
                        3,
                        6
                    ];
                    value = _step.value;
                    return [
                        4,
                        value
                    ];
                case 3:
                    awaitedValue = _state.sent();
                    if (!awaitedValue) return [
                        3,
                        5
                    ];
                    return [
                        4,
                        fun(awaitedValue)
                    ];
                case 4:
                    _state.sent();
                    _state.label = 5;
                case 5:
                    _iteratorNormalCompletion = true;
                    return [
                        3,
                        2
                    ];
                case 6:
                    return [
                        3,
                        9
                    ];
                case 7:
                    err = _state.sent();
                    _didIteratorError = true;
                    _iteratorError = err;
                    return [
                        3,
                        9
                    ];
                case 8:
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                    return [
                        7
                    ];
                case 9:
                    return [
                        2
                    ];
            }
        });
    });
    return _fun.apply(this, arguments);
}
baz(xx);
export { };
