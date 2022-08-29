//// [F1.ts]
import _wrap_async_generator from "@swc/helpers/src/_wrap_async_generator.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
function f1() {
    return _f1.apply(this, arguments);
}
function _f1() {
    _f1 = _wrap_async_generator(function() {
        return _ts_generator(this, function(_state) {
            return [
                2
            ];
        });
    });
    return _f1.apply(this, arguments);
}
//// [F2.ts]
import _wrap_async_generator from "@swc/helpers/src/_wrap_async_generator.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
function f2() {
    return _f2.apply(this, arguments);
}
function _f2() {
    _f2 = _wrap_async_generator(function() {
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
    });
    return _f2.apply(this, arguments);
}
//// [F3.ts]
import _wrap_async_generator from "@swc/helpers/src/_wrap_async_generator.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
function f3() {
    return _f3.apply(this, arguments);
}
function _f3() {
    _f3 = _wrap_async_generator(function() {
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
    });
    return _f3.apply(this, arguments);
}
//// [F4.ts]
import _async_generator_delegate from "@swc/helpers/src/_async_generator_delegate.mjs";
import _async_iterator from "@swc/helpers/src/_async_iterator.mjs";
import _await_async_generator from "@swc/helpers/src/_await_async_generator.mjs";
import _wrap_async_generator from "@swc/helpers/src/_wrap_async_generator.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
import _ts_values from "@swc/helpers/src/_ts_values.mjs";
function f4() {
    return _f4.apply(this, arguments);
}
function _f4() {
    _f4 = _wrap_async_generator(function() {
        var x;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        5,
                        _ts_values(_async_generator_delegate(_async_iterator([
                            1
                        ]), _await_async_generator))
                    ];
                case 1:
                    x = _state.sent();
                    return [
                        2
                    ];
            }
        });
    });
    return _f4.apply(this, arguments);
}
//// [F5.ts]
import _async_generator_delegate from "@swc/helpers/src/_async_generator_delegate.mjs";
import _async_iterator from "@swc/helpers/src/_async_iterator.mjs";
import _await_async_generator from "@swc/helpers/src/_await_async_generator.mjs";
import _wrap_async_generator from "@swc/helpers/src/_wrap_async_generator.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
import _ts_values from "@swc/helpers/src/_ts_values.mjs";
function f5() {
    return _f5.apply(this, arguments);
}
function _f5() {
    _f5 = _wrap_async_generator(function() {
        var x;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        5,
                        _ts_values(_async_generator_delegate(_async_iterator(_wrap_async_generator(function() {
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
                        })()), _await_async_generator))
                    ];
                case 1:
                    x = _state.sent();
                    return [
                        2
                    ];
            }
        });
    });
    return _f5.apply(this, arguments);
}
//// [F6.ts]
import _await_async_generator from "@swc/helpers/src/_await_async_generator.mjs";
import _wrap_async_generator from "@swc/helpers/src/_wrap_async_generator.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
function f6() {
    return _f6.apply(this, arguments);
}
function _f6() {
    _f6 = _wrap_async_generator(function() {
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
    });
    return _f6.apply(this, arguments);
}
//// [F7.ts]
import _wrap_async_generator from "@swc/helpers/src/_wrap_async_generator.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
function f7() {
    return _f7.apply(this, arguments);
}
function _f7() {
    _f7 = _wrap_async_generator(function() {
        return _ts_generator(this, function(_state) {
            return [
                2,
                1
            ];
        });
    });
    return _f7.apply(this, arguments);
}
