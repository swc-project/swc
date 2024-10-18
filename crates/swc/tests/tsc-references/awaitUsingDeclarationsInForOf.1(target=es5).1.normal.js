//// [awaitUsingDeclarationsInForOf.1.ts]
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
        var _i, _iter, _, env, d1, e, result;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _i = 0, _iter = [
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
                    ];
                    _state.label = 1;
                case 1:
                    if (!(_i < _iter.length)) return [
                        3,
                        8
                    ];
                    _ = _iter[_i];
                    env = {
                        stack: [],
                        error: void 0,
                        hasError: false
                    };
                    _state.label = 2;
                case 2:
                    _state.trys.push([
                        2,
                        3,
                        4,
                        7
                    ]);
                    d1 = _ts_add_disposable_resource(env, _, true);
                    {}
                    return [
                        3,
                        7
                    ];
                case 3:
                    e = _state.sent();
                    env.error = e;
                    env.hasError = true;
                    return [
                        3,
                        7
                    ];
                case 4:
                    result = _ts_dispose_resources(env);
                    if (!result) return [
                        3,
                        6
                    ];
                    return [
                        4,
                        result
                    ];
                case 5:
                    _state.sent();
                    _state.label = 6;
                case 6:
                    return [
                        7
                    ];
                case 7:
                    _i++;
                    return [
                        3,
                        1
                    ];
                case 8:
                    return [
                        2
                    ];
            }
        });
    });
    return _main.apply(this, arguments);
}
