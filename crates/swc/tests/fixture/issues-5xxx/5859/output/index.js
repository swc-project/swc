import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _await_async_generator from "@swc/helpers/src/_await_async_generator.mjs";
import _wrap_async_generator from "@swc/helpers/src/_wrap_async_generator.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
var result = [];
function foo() {
    return _foo.apply(this, arguments);
}
function _foo() {
    _foo = _wrap_async_generator(function() {
        var input, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _, _tmp, _1, _tmp1, err;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    input = [
                        "hello",
                        "swc"
                    ];
                    _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        7,
                        8,
                        9
                    ]);
                    _iterator = input[Symbol.iterator]();
                    _state.label = 2;
                case 2:
                    if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done)) return [
                        3,
                        6
                    ];
                    i = _step.value;
                    result.push({
                        x: x
                    });
                    _ = result.push;
                    _tmp = {};
                    return [
                        4,
                        _await_async_generator(i)
                    ];
                case 3:
                    _.apply(result, [
                        (_tmp.y = _state.sent(), _tmp)
                    ]);
                    _1 = result.push;
                    _tmp1 = {
                        a: 1
                    };
                    return [
                        4,
                        i
                    ];
                case 4:
                    _1.apply(result, [
                        (_tmp1.b = _state.sent(), _tmp1)
                    ]);
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
    return _foo.apply(this, arguments);
}
var iter = foo();
function main() {
    return _main.apply(this, arguments);
}
function _main() {
    _main = _async_to_generator(function() {
        var state, x1;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        iter.next()
                    ];
                case 1:
                    x1 = _state.sent();
                    _state.label = 2;
                case 2:
                    if (!!x1.done) return [
                        3,
                        5
                    ];
                    state = "[".concat(x1.value, "]");
                    _state.label = 3;
                case 3:
                    return [
                        4,
                        iter.next(state)
                    ];
                case 4:
                    x1 = _state.sent();
                    return [
                        3,
                        2
                    ];
                case 5:
                    console.log(result);
                    return [
                        2
                    ];
            }
        });
    });
    return _main.apply(this, arguments);
}
main();
