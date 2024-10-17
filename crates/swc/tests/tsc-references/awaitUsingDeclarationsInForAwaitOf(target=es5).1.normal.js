//// [awaitUsingDeclarationsInForAwaitOf.ts]
import { _ as _async_iterator } from "@swc/helpers/_/_async_iterator";
import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
import { _ as _ts_add_disposable_resource } from "@swc/helpers/_/_ts_add_disposable_resource";
import { _ as _ts_dispose_resources } from "@swc/helpers/_/_ts_dispose_resources";
function main() {
    return _main.apply(this, arguments);
}
function _main() {
    _main = _async_to_generator(function() {
        var _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, _, env, d1, e, result, err;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _iteratorAbruptCompletion = false, _didIteratorError = false;
                    _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        11,
                        12,
                        17
                    ]);
                    _iterator = _async_iterator([
                        _define_property({}, Symbol.asyncDispose, function() {
                            return _async_to_generator(function() {
                                return _ts_generator(this, function(_state) {
                                    return [
                                        2
                                    ];
                                });
                            })();
                        }),
                        _define_property({}, Symbol.dispose, function() {}),
                        null,
                        undefined
                    ]);
                    _state.label = 2;
                case 2:
                    return [
                        4,
                        _iterator.next()
                    ];
                case 3:
                    if (!(_iteratorAbruptCompletion = !(_step = _state.sent()).done)) return [
                        3,
                        10
                    ];
                    _value = _step.value;
                    _ = _value;
                    env = {
                        stack: [],
                        error: void 0,
                        hasError: false
                    };
                    _state.label = 4;
                case 4:
                    _state.trys.push([
                        4,
                        5,
                        6,
                        9
                    ]);
                    d1 = _ts_add_disposable_resource(env, _, true);
                    {}
                    return [
                        3,
                        9
                    ];
                case 5:
                    e = _state.sent();
                    env.error = e;
                    env.hasError = true;
                    return [
                        3,
                        9
                    ];
                case 6:
                    result = _ts_dispose_resources(env);
                    if (!result) return [
                        3,
                        8
                    ];
                    return [
                        4,
                        result
                    ];
                case 7:
                    _state.sent();
                    _state.label = 8;
                case 8:
                    return [
                        7
                    ];
                case 9:
                    _iteratorAbruptCompletion = false;
                    return [
                        3,
                        2
                    ];
                case 10:
                    return [
                        3,
                        17
                    ];
                case 11:
                    err = _state.sent();
                    _didIteratorError = true;
                    _iteratorError = err;
                    return [
                        3,
                        17
                    ];
                case 12:
                    _state.trys.push([
                        12,
                        ,
                        15,
                        16
                    ]);
                    if (!(_iteratorAbruptCompletion && _iterator.return != null)) return [
                        3,
                        14
                    ];
                    return [
                        4,
                        _iterator.return()
                    ];
                case 13:
                    _state.sent();
                    _state.label = 14;
                case 14:
                    return [
                        3,
                        16
                    ];
                case 15:
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                    return [
                        7
                    ];
                case 16:
                    return [
                        7
                    ];
                case 17:
                    return [
                        2
                    ];
            }
        });
    });
    return _main.apply(this, arguments);
}
