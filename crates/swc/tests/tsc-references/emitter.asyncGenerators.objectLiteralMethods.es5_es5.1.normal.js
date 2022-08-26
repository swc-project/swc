// @target: es5
// @lib: esnext
// @filename: O1.ts
import _wrap_async_generator from "@swc/helpers/src/_wrap_async_generator.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
var o1 = {
    f: function f() {
        return _wrap_async_generator(function() {
            return _ts_generator(this, function(_state) {
                return [
                    2
                ];
            });
        })();
    }
};
// @filename: O2.ts
import _wrap_async_generator from "@swc/helpers/src/_wrap_async_generator.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
var o2 = {
    f: function f() {
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
};
// @filename: O3.ts
import _wrap_async_generator from "@swc/helpers/src/_wrap_async_generator.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
var o3 = {
    f: function f() {
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
};
// @filename: O4.ts
import _async_generator_delegate from "@swc/helpers/src/_async_generator_delegate.mjs";
import _async_iterator from "@swc/helpers/src/_async_iterator.mjs";
import _await_async_generator from "@swc/helpers/src/_await_async_generator.mjs";
import _wrap_async_generator from "@swc/helpers/src/_wrap_async_generator.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
import _ts_values from "@swc/helpers/src/_ts_values.mjs";
var o4 = {
    f: function f() {
        return _wrap_async_generator(function() {
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
        })();
    }
};
// @filename: O5.ts
import _async_generator_delegate from "@swc/helpers/src/_async_generator_delegate.mjs";
import _async_iterator from "@swc/helpers/src/_async_iterator.mjs";
import _await_async_generator from "@swc/helpers/src/_await_async_generator.mjs";
import _wrap_async_generator from "@swc/helpers/src/_wrap_async_generator.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
import _ts_values from "@swc/helpers/src/_ts_values.mjs";
var o5 = {
    f: function f() {
        return _wrap_async_generator(function() {
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
        })();
    }
};
// @filename: O6.ts
import _await_async_generator from "@swc/helpers/src/_await_async_generator.mjs";
import _wrap_async_generator from "@swc/helpers/src/_wrap_async_generator.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
var o6 = {
    f: function f() {
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
};
// @filename: O7.ts
import _wrap_async_generator from "@swc/helpers/src/_wrap_async_generator.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
var o7 = {
    f: function f() {
        return _wrap_async_generator(function() {
            return _ts_generator(this, function(_state) {
                return [
                    2,
                    1
                ];
            });
        })();
    }
};
