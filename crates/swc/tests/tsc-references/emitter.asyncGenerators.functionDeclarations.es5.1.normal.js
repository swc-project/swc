//// [F1.ts]
import { _ as _wrap_async_generator } from "@swc/helpers/_/_wrap_async_generator";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
function f1() {
    return _wrap_async_generator(function() {
        return _ts_generator(this, function(_state) {
            return [
                2
            ];
        });
    })();
}
//// [F2.ts]
import { _ as _wrap_async_generator } from "@swc/helpers/_/_wrap_async_generator";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
function f2() {
    return _wrap_async_generator(function() {
        var x;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4
                    ];
                case 1:
                    x = _state.sent();
                    return [
                        2
                    ];
            }
        });
    })();
}
//// [F3.ts]
import { _ as _wrap_async_generator } from "@swc/helpers/_/_wrap_async_generator";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
function f3() {
    return _wrap_async_generator(function() {
        var x;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        1
                    ];
                case 1:
                    x = _state.sent();
                    return [
                        2
                    ];
            }
        });
    })();
}
//// [F4.ts]
import { _ as _async_generator_delegate } from "@swc/helpers/_/_async_generator_delegate";
import { _ as _async_iterator } from "@swc/helpers/_/_async_iterator";
import { _ as _wrap_async_generator } from "@swc/helpers/_/_wrap_async_generator";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
import { _ as _ts_values } from "@swc/helpers/_/_ts_values";
function f4() {
    return _wrap_async_generator(function() {
        var x;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        5,
                        _ts_values(_async_generator_delegate(_async_iterator([
                            1
                        ])))
                    ];
                case 1:
                    x = _state.sent();
                    return [
                        2
                    ];
            }
        });
    })();
}
//// [F5.ts]
import { _ as _async_generator_delegate } from "@swc/helpers/_/_async_generator_delegate";
import { _ as _async_iterator } from "@swc/helpers/_/_async_iterator";
import { _ as _wrap_async_generator } from "@swc/helpers/_/_wrap_async_generator";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
import { _ as _ts_values } from "@swc/helpers/_/_ts_values";
function f5() {
    return _wrap_async_generator(function() {
        var x;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        5,
                        _ts_values(_async_generator_delegate(_async_iterator(function() {
                            return _wrap_async_generator(function() {
                                return _ts_generator(this, function(_state) {
                                    switch(_state.label){
                                        case 0:
                                            return [
                                                4,
                                                1
                                            ];
                                        case 1:
                                            _state.sent();
                                            return [
                                                2
                                            ];
                                    }
                                });
                            })();
                        }())))
                    ];
                case 1:
                    x = _state.sent();
                    return [
                        2
                    ];
            }
        });
    })();
}
//// [F6.ts]
import { _ as _await_async_generator } from "@swc/helpers/_/_await_async_generator";
import { _ as _wrap_async_generator } from "@swc/helpers/_/_wrap_async_generator";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
function f6() {
    return _wrap_async_generator(function() {
        var x;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        _await_async_generator(1)
                    ];
                case 1:
                    x = _state.sent();
                    return [
                        2
                    ];
            }
        });
    })();
}
//// [F7.ts]
import { _ as _wrap_async_generator } from "@swc/helpers/_/_wrap_async_generator";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
function f7() {
    return _wrap_async_generator(function() {
        return _ts_generator(this, function(_state) {
            return [
                2,
                1
            ];
        });
    })();
}
