//// [awaitUnion_es5.ts]
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
function f() {
    return _f.apply(this, arguments);
}
function _f() {
    return (_f = _async_to_generator(function() {
        var await_a, await_b, await_c, await_d, await_e;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        a
                    ];
                case 1:
                    return await_a = _state.sent(), [
                        4,
                        b
                    ];
                case 2:
                    return await_b = _state.sent(), [
                        4,
                        c
                    ];
                case 3:
                    return await_c = _state.sent(), [
                        4,
                        d
                    ];
                case 4:
                    return await_d = _state.sent(), [
                        4,
                        e
                    ];
                case 5:
                    return await_e = _state.sent(), [
                        2
                    ];
            }
        });
    })).apply(this, arguments);
}
