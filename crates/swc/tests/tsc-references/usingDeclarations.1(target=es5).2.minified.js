//// [usingDeclarations.1.ts]
import "@swc/helpers/_/_assert_this_initialized";
import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _await_async_generator } from "@swc/helpers/_/_await_async_generator";
import "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import "@swc/helpers/_/_inherits";
import { _ as _wrap_async_generator } from "@swc/helpers/_/_wrap_async_generator";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
import { _ as _ts_add_disposable_resource } from "@swc/helpers/_/_ts_add_disposable_resource";
import { _ as _ts_dispose_resources } from "@swc/helpers/_/_ts_dispose_resources";
var env = {
    stack: [],
    error: void 0,
    hasError: !1
};
try {
    var N, C1, __ = new WeakMap();
    _ts_add_disposable_resource(env, _define_property({}, Symbol.dispose, function() {}), !1);
    var C1 = (C1 = /*#__PURE__*/ function() {
        function C1() {
            _class_call_check(this, C1), this.a = function() {
                var env = {
                    stack: [],
                    error: void 0,
                    hasError: !1
                };
                try {
                    _ts_add_disposable_resource(env, _define_property({}, Symbol.dispose, function() {}), !1);
                } catch (e) {
                    env.error = e, env.hasError = !0;
                } finally{
                    _ts_dispose_resources(env);
                }
            };
            var env = {
                stack: [],
                error: void 0,
                hasError: !1
            };
            try {
                _ts_add_disposable_resource(env, _define_property({}, Symbol.dispose, function() {}), !1);
            } catch (e) {
                env.error = e, env.hasError = !0;
            } finally{
                _ts_dispose_resources(env);
            }
        }
        var _proto = C1.prototype;
        return _proto.m = function() {
            var env = {
                stack: [],
                error: void 0,
                hasError: !1
            };
            try {
                _ts_add_disposable_resource(env, _define_property({}, Symbol.dispose, function() {}), !1);
            } catch (e) {
                env.error = e, env.hasError = !0;
            } finally{
                _ts_dispose_resources(env);
            }
        }, _proto.am = function() {
            return _async_to_generator(function() {
                var env, e;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            env = {
                                stack: [],
                                error: void 0,
                                hasError: !1
                            }, _state.label = 1;
                        case 1:
                            return _state.trys.push([
                                1,
                                3,
                                4,
                                5
                            ]), _ts_add_disposable_resource(env, _define_property({}, Symbol.dispose, function() {}), !1), [
                                4,
                                null
                            ];
                        case 2:
                            return _state.sent(), [
                                3,
                                5
                            ];
                        case 3:
                            return e = _state.sent(), env.error = e, env.hasError = !0, [
                                3,
                                5
                            ];
                        case 4:
                            return _ts_dispose_resources(env), [
                                7
                            ];
                        case 5:
                            return [
                                2
                            ];
                    }
                });
            })();
        }, _proto.g = function() {
            var env, e;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        env = {
                            stack: [],
                            error: void 0,
                            hasError: !1
                        }, _state.label = 1;
                    case 1:
                        return _state.trys.push([
                            1,
                            3,
                            4,
                            5
                        ]), _ts_add_disposable_resource(env, _define_property({}, Symbol.dispose, function() {}), !1), [
                            4
                        ];
                    case 2:
                        return _state.sent(), [
                            3,
                            5
                        ];
                    case 3:
                        return e = _state.sent(), env.error = e, env.hasError = !0, [
                            3,
                            5
                        ];
                    case 4:
                        return _ts_dispose_resources(env), [
                            7
                        ];
                    case 5:
                        return [
                            2
                        ];
                }
            });
        }, _proto.ag = function() {
            return _wrap_async_generator(function() {
                var env, e;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            env = {
                                stack: [],
                                error: void 0,
                                hasError: !1
                            }, _state.label = 1;
                        case 1:
                            return _state.trys.push([
                                1,
                                4,
                                5,
                                6
                            ]), _ts_add_disposable_resource(env, _define_property({}, Symbol.dispose, function() {}), !1), [
                                4
                            ];
                        case 2:
                            return _state.sent(), [
                                4,
                                _await_async_generator(null)
                            ];
                        case 3:
                            return _state.sent(), [
                                3,
                                6
                            ];
                        case 4:
                            return e = _state.sent(), env.error = e, env.hasError = !0, [
                                3,
                                6
                            ];
                        case 5:
                            return _ts_dispose_resources(env), [
                                7
                            ];
                        case 6:
                            return [
                                2
                            ];
                    }
                });
            })();
        }, _create_class(C1, [
            {
                key: "x",
                get: function() {
                    var env = {
                        stack: [],
                        error: void 0,
                        hasError: !1
                    };
                    try {
                        return _ts_add_disposable_resource(env, _define_property({}, Symbol.dispose, function() {}), !1), 0;
                    } catch (e) {
                        env.error = e, env.hasError = !0;
                    } finally{
                        _ts_dispose_resources(env);
                    }
                },
                set: function(v) {
                    var env = {
                        stack: [],
                        error: void 0,
                        hasError: !1
                    };
                    try {
                        _ts_add_disposable_resource(env, _define_property({}, Symbol.dispose, function() {}), !1);
                    } catch (e) {
                        env.error = e, env.hasError = !0;
                    } finally{
                        _ts_dispose_resources(env);
                    }
                }
            }
        ]), C1;
    }(), __.set(C1, {
        writable: !0,
        value: function() {
            var env = {
                stack: [],
                error: void 0,
                hasError: !1
            };
            try {
                _ts_add_disposable_resource(env, _define_property({}, Symbol.dispose, function() {}), !1);
            } catch (e) {
                env.error = e, env.hasError = !0;
            } finally{
                _ts_dispose_resources(env);
            }
        }()
    }), C1), env1 = (N || (N = {}), {
        stack: [],
        error: void 0,
        hasError: !1
    });
    try {
        _ts_add_disposable_resource(env1, _define_property({}, Symbol.dispose, function() {}), !1);
    } catch (e) {
        env1.error = e, env1.hasError = !0;
    } finally{
        _ts_dispose_resources(env1);
    }
    var env11 = {
        stack: [],
        error: void 0,
        hasError: !1
    };
    try {
        _ts_add_disposable_resource(env11, _define_property({}, Symbol.dispose, function() {}), !1);
    } catch (e) {
        env11.error = e, env11.hasError = !0;
    } finally{
        _ts_dispose_resources(env11);
    }
    switch(Math.random()){
        case 0:
            var env2 = {
                stack: [],
                error: void 0,
                hasError: !1
            };
            try {
                _ts_add_disposable_resource(env2, _define_property({}, Symbol.dispose, function() {}), !1);
                break;
            } catch (e) {
                env2.error = e, env2.hasError = !0;
            } finally{
                _ts_dispose_resources(env2);
            }
        case 1:
            var env3 = {
                stack: [],
                error: void 0,
                hasError: !1
            };
            try {
                _ts_add_disposable_resource(env3, _define_property({}, Symbol.dispose, function() {}), !1);
            } catch (e) {
                env3.error = e, env3.hasError = !0;
            } finally{
                _ts_dispose_resources(env3);
            }
    }
    var env4 = {
        stack: [],
        error: void 0,
        hasError: !1
    };
    try {
        _ts_add_disposable_resource(env4, _define_property({}, Symbol.dispose, function() {}), !1);
    } catch (e) {
        env4.error = e, env4.hasError = !0;
    } finally{
        _ts_dispose_resources(env4);
    }
    try {
        var env5 = {
            stack: [],
            error: void 0,
            hasError: !1
        };
        try {
            _ts_add_disposable_resource(env5, _define_property({}, Symbol.dispose, function() {}), !1);
        } catch (e) {
            env5.error = e, env5.hasError = !0;
        } finally{
            _ts_dispose_resources(env5);
        }
    } catch (unused) {
        var env6 = {
            stack: [],
            error: void 0,
            hasError: !1
        };
        try {
            _ts_add_disposable_resource(env6, _define_property({}, Symbol.dispose, function() {}), !1);
        } catch (e) {
            env6.error = e, env6.hasError = !0;
        } finally{
            _ts_dispose_resources(env6);
        }
    } finally{
        var env7 = {
            stack: [],
            error: void 0,
            hasError: !1
        };
        try {
            _ts_add_disposable_resource(env7, _define_property({}, Symbol.dispose, function() {}), !1);
        } catch (e) {
            env7.error = e, env7.hasError = !0;
        } finally{
            _ts_dispose_resources(env7);
        }
    }
    var env8 = {
        stack: [],
        error: void 0,
        hasError: !1
    };
    try {
        _ts_add_disposable_resource(env8, _define_property({}, Symbol.dispose, function() {}), !1);
    } catch (e) {
        env8.error = e, env8.hasError = !0;
    } finally{
        _ts_dispose_resources(env8);
    }
    for(;;){
        var env10 = {
            stack: [],
            error: void 0,
            hasError: !1
        };
        try {
            _ts_add_disposable_resource(env10, _define_property({}, Symbol.dispose, function() {}), !1);
            break;
        } catch (e) {
            env10.error = e, env10.hasError = !0;
        } finally{
            _ts_dispose_resources(env10);
        }
    }
    for(;;){
        var env111 = {
            stack: [],
            error: void 0,
            hasError: !1
        };
        try {
            _ts_add_disposable_resource(env111, _define_property({}, Symbol.dispose, function() {}), !1);
            break;
        } catch (e) {
            env111.error = e, env111.hasError = !0;
        } finally{
            _ts_dispose_resources(env111);
        }
    }
    for(;;){
        var env12 = {
            stack: [],
            error: void 0,
            hasError: !1
        };
        try {
            _ts_add_disposable_resource(env12, _define_property({}, Symbol.dispose, function() {}), !1);
            break;
        } catch (e) {
            env12.error = e, env12.hasError = !0;
        } finally{
            _ts_dispose_resources(env12);
        }
    }
    for(var x in {}){
        var env13 = {
            stack: [],
            error: void 0,
            hasError: !1
        };
        try {
            _ts_add_disposable_resource(env13, _define_property({}, Symbol.dispose, function() {}), !1);
        } catch (e) {
            env13.error = e, env13.hasError = !0;
        } finally{
            _ts_dispose_resources(env13);
        }
    }
    for(var _i = 0, _iter = []; _i < _iter.length; _i++){
        _iter[_i];
        var env14 = {
            stack: [],
            error: void 0,
            hasError: !1
        };
        try {
            _ts_add_disposable_resource(env14, _define_property({}, Symbol.dispose, function() {}), !1);
        } catch (e) {
            env14.error = e, env14.hasError = !0;
        } finally{
            _ts_dispose_resources(env14);
        }
    }
} catch (e) {
    env.error = e, env.hasError = !0;
} finally{
    _ts_dispose_resources(env);
}
