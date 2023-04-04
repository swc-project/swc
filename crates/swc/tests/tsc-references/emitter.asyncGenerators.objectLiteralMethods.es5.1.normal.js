//// [O1.ts]
import { _ as _wrap_async_generator } from "@swc/helpers/_/_wrap_async_generator";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
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
//// [O2.ts]
import { _ as _wrap_async_generator } from "@swc/helpers/_/_wrap_async_generator";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
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
//// [O3.ts]
import { _ as _wrap_async_generator } from "@swc/helpers/_/_wrap_async_generator";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
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
//// [O4.ts]
import { _ as _async_generator_delegate } from "@swc/helpers/_/_async_generator_delegate";
import { _ as _async_iterator } from "@swc/helpers/_/_async_iterator";
import { _ as _await_async_generator } from "@swc/helpers/_/_await_async_generator";
import { _ as _wrap_async_generator } from "@swc/helpers/_/_wrap_async_generator";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
import { _ as _ts_values } from "@swc/helpers/_/_ts_values";
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
//// [O5.ts]
import { _ as _async_generator_delegate } from "@swc/helpers/_/_async_generator_delegate";
import { _ as _async_iterator } from "@swc/helpers/_/_async_iterator";
import { _ as _await_async_generator } from "@swc/helpers/_/_await_async_generator";
import { _ as _wrap_async_generator } from "@swc/helpers/_/_wrap_async_generator";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
import { _ as _ts_values } from "@swc/helpers/_/_ts_values";
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
//// [O6.ts]
import { _ as _await_async_generator } from "@swc/helpers/_/_await_async_generator";
import { _ as _wrap_async_generator } from "@swc/helpers/_/_wrap_async_generator";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
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
//// [O7.ts]
import { _ as _wrap_async_generator } from "@swc/helpers/_/_wrap_async_generator";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
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
