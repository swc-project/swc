//// [awaitUsingDeclarations.1.ts]
import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _await_async_generator } from "@swc/helpers/_/_await_async_generator";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _wrap_async_generator } from "@swc/helpers/_/_wrap_async_generator";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
import { _ as _ts_add_disposable_resource } from "@swc/helpers/_/_ts_add_disposable_resource";
import { _ as _ts_dispose_resources } from "@swc/helpers/_/_ts_dispose_resources";
var env = {
    stack: [],
    error: void 0,
    hasError: false
};
try {
    var af = function af() {
        return _af.apply(this, arguments);
    };
    var ag = function ag() {
        return _ag.apply(this, arguments);
    };
    var d1 = _ts_add_disposable_resource(env, _define_property({}, Symbol.asyncDispose, function() {
        return _async_to_generator(function() {
            return _ts_generator(this, function(_state) {
                return [
                    2
                ];
            });
        })();
    }), true);
    function _af() {
        _af = _async_to_generator(function() {
            var env, d3, e, result;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        env = {
                            stack: [],
                            error: void 0,
                            hasError: false
                        };
                        _state.label = 1;
                    case 1:
                        _state.trys.push([
                            1,
                            3,
                            4,
                            7
                        ]);
                        d3 = _ts_add_disposable_resource(env, _define_property({}, Symbol.asyncDispose, function() {
                            return _async_to_generator(function() {
                                return _ts_generator(this, function(_state) {
                                    return [
                                        2
                                    ];
                                });
                            })();
                        }), true);
                        return [
                            4,
                            null
                        ];
                    case 2:
                        _state.sent();
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
                        return [
                            2
                        ];
                }
            });
        });
        return _af.apply(this, arguments);
    }
    function _ag() {
        _ag = _wrap_async_generator(function() {
            var env, d5, e, result;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        env = {
                            stack: [],
                            error: void 0,
                            hasError: false
                        };
                        _state.label = 1;
                    case 1:
                        _state.trys.push([
                            1,
                            4,
                            5,
                            8
                        ]);
                        d5 = _ts_add_disposable_resource(env, _define_property({}, Symbol.asyncDispose, function() {
                            return _async_to_generator(function() {
                                return _ts_generator(this, function(_state) {
                                    return [
                                        2
                                    ];
                                });
                            })();
                        }), true);
                        return [
                            4
                        ];
                    case 2:
                        _state.sent();
                        return [
                            4,
                            _await_async_generator(null)
                        ];
                    case 3:
                        _state.sent();
                        return [
                            3,
                            8
                        ];
                    case 4:
                        e = _state.sent();
                        env.error = e;
                        env.hasError = true;
                        return [
                            3,
                            8
                        ];
                    case 5:
                        result = _ts_dispose_resources(env);
                        if (!result) return [
                            3,
                            7
                        ];
                        return [
                            4,
                            _await_async_generator(result)
                        ];
                    case 6:
                        _state.sent();
                        _state.label = 7;
                    case 7:
                        return [
                            7
                        ];
                    case 8:
                        return [
                            2
                        ];
                }
            });
        });
        return _ag.apply(this, arguments);
    }
    var a = /*#__PURE__*/ function() {
        var _ref = _async_to_generator(function() {
            var env, d6, e, result;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        env = {
                            stack: [],
                            error: void 0,
                            hasError: false
                        };
                        _state.label = 1;
                    case 1:
                        _state.trys.push([
                            1,
                            2,
                            3,
                            6
                        ]);
                        d6 = _ts_add_disposable_resource(env, _define_property({}, Symbol.asyncDispose, function() {
                            return _async_to_generator(function() {
                                return _ts_generator(this, function(_state) {
                                    return [
                                        2
                                    ];
                                });
                            })();
                        }), true);
                        return [
                            3,
                            6
                        ];
                    case 2:
                        e = _state.sent();
                        env.error = e;
                        env.hasError = true;
                        return [
                            3,
                            6
                        ];
                    case 3:
                        result = _ts_dispose_resources(env);
                        if (!result) return [
                            3,
                            5
                        ];
                        return [
                            4,
                            result
                        ];
                    case 4:
                        _state.sent();
                        _state.label = 5;
                    case 5:
                        return [
                            7
                        ];
                    case 6:
                        return [
                            2
                        ];
                }
            });
        });
        return function a() {
            return _ref.apply(this, arguments);
        };
    }();
    var C1 = /*#__PURE__*/ function() {
        "use strict";
        function C1() {
            _class_call_check(this, C1);
            this.a = /*#__PURE__*/ _async_to_generator(function() {
                var env, d7, e, result;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            env = {
                                stack: [],
                                error: void 0,
                                hasError: false
                            };
                            _state.label = 1;
                        case 1:
                            _state.trys.push([
                                1,
                                2,
                                3,
                                6
                            ]);
                            d7 = _ts_add_disposable_resource(env, _define_property({}, Symbol.asyncDispose, function() {
                                return _async_to_generator(function() {
                                    return _ts_generator(this, function(_state) {
                                        return [
                                            2
                                        ];
                                    });
                                })();
                            }), true);
                            return [
                                3,
                                6
                            ];
                        case 2:
                            e = _state.sent();
                            env.error = e;
                            env.hasError = true;
                            return [
                                3,
                                6
                            ];
                        case 3:
                            result = _ts_dispose_resources(env);
                            if (!result) return [
                                3,
                                5
                            ];
                            return [
                                4,
                                result
                            ];
                        case 4:
                            _state.sent();
                            _state.label = 5;
                        case 5:
                            return [
                                7
                            ];
                        case 6:
                            return [
                                2
                            ];
                    }
                });
            });
        }
        var _proto = C1.prototype;
        _proto.am = function am() {
            return _async_to_generator(function() {
                var env, d13, e, result;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            env = {
                                stack: [],
                                error: void 0,
                                hasError: false
                            };
                            _state.label = 1;
                        case 1:
                            _state.trys.push([
                                1,
                                3,
                                4,
                                7
                            ]);
                            d13 = _ts_add_disposable_resource(env, _define_property({}, Symbol.asyncDispose, function() {
                                return _async_to_generator(function() {
                                    return _ts_generator(this, function(_state) {
                                        return [
                                            2
                                        ];
                                    });
                                })();
                            }), true);
                            return [
                                4,
                                null
                            ];
                        case 2:
                            _state.sent();
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
                            return [
                                2
                            ];
                    }
                });
            })();
        };
        _proto.ag = function ag() {
            return _wrap_async_generator(function() {
                var env, d15, e, result;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            env = {
                                stack: [],
                                error: void 0,
                                hasError: false
                            };
                            _state.label = 1;
                        case 1:
                            _state.trys.push([
                                1,
                                4,
                                5,
                                8
                            ]);
                            d15 = _ts_add_disposable_resource(env, _define_property({}, Symbol.asyncDispose, function() {
                                return _async_to_generator(function() {
                                    return _ts_generator(this, function(_state) {
                                        return [
                                            2
                                        ];
                                    });
                                })();
                            }), true);
                            return [
                                4
                            ];
                        case 2:
                            _state.sent();
                            return [
                                4,
                                _await_async_generator(null)
                            ];
                        case 3:
                            _state.sent();
                            return [
                                3,
                                8
                            ];
                        case 4:
                            e = _state.sent();
                            env.error = e;
                            env.hasError = true;
                            return [
                                3,
                                8
                            ];
                        case 5:
                            result = _ts_dispose_resources(env);
                            if (!result) return [
                                3,
                                7
                            ];
                            return [
                                4,
                                _await_async_generator(result)
                            ];
                        case 6:
                            _state.sent();
                            _state.label = 7;
                        case 7:
                            return [
                                7
                            ];
                        case 8:
                            return [
                                2
                            ];
                    }
                });
            })();
        };
        return C1;
    }();
    {
        var env1 = {
            stack: [],
            error: void 0,
            hasError: false
        };
        try {
            var d19 = _ts_add_disposable_resource(env1, _define_property({}, Symbol.asyncDispose, function() {
                return _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
                        return [
                            2
                        ];
                    });
                })();
            }), true);
        } catch (e) {
            env1.error = e;
            env1.hasError = true;
        } finally{
            var result = _ts_dispose_resources(env1);
            if (result) await result;
        }
    }
    switch(Math.random()){
        case 0:
            var env2 = {
                stack: [],
                error: void 0,
                hasError: false
            };
            try {
                var d20 = _ts_add_disposable_resource(env2, _define_property({}, Symbol.asyncDispose, function() {
                    return _async_to_generator(function() {
                        return _ts_generator(this, function(_state) {
                            return [
                                2
                            ];
                        });
                    })();
                }), true);
                break;
            } catch (e) {
                env2.error = e;
                env2.hasError = true;
            } finally{
                var result1 = _ts_dispose_resources(env2);
                if (result1) await result1;
            }
        case 1:
            var env3 = {
                stack: [],
                error: void 0,
                hasError: false
            };
            try {
                var d21 = _ts_add_disposable_resource(env3, _define_property({}, Symbol.asyncDispose, function() {
                    return _async_to_generator(function() {
                        return _ts_generator(this, function(_state) {
                            return [
                                2
                            ];
                        });
                    })();
                }), true);
                break;
            } catch (e) {
                env3.error = e;
                env3.hasError = true;
            } finally{
                var result2 = _ts_dispose_resources(env3);
                if (result2) await result2;
            }
    }
    if (true) switch(0){
        case 0:
            var env4 = {
                stack: [],
                error: void 0,
                hasError: false
            };
            try {
                var d22 = _ts_add_disposable_resource(env4, _define_property({}, Symbol.asyncDispose, function() {
                    return _async_to_generator(function() {
                        return _ts_generator(this, function(_state) {
                            return [
                                2
                            ];
                        });
                    })();
                }), true);
                break;
            } catch (e) {
                env4.error = e;
                env4.hasError = true;
            } finally{
                var result3 = _ts_dispose_resources(env4);
                if (result3) await result3;
            }
    }
    try {
        var env5 = {
            stack: [],
            error: void 0,
            hasError: false
        };
        try {
            var d23 = _ts_add_disposable_resource(env5, _define_property({}, Symbol.asyncDispose, function() {
                return _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
                        return [
                            2
                        ];
                    });
                })();
            }), true);
        } catch (e) {
            env5.error = e;
            env5.hasError = true;
        } finally{
            var result4 = _ts_dispose_resources(env5);
            if (result4) await result4;
        }
    } catch (e) {
        var env6 = {
            stack: [],
            error: void 0,
            hasError: false
        };
        try {
            var d24 = _ts_add_disposable_resource(env6, _define_property({}, Symbol.asyncDispose, function() {
                return _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
                        return [
                            2
                        ];
                    });
                })();
            }), true);
        } catch (e) {
            env6.error = e;
            env6.hasError = true;
        } finally{
            var result5 = _ts_dispose_resources(env6);
            if (result5) await result5;
        }
    } finally{
        var env7 = {
            stack: [],
            error: void 0,
            hasError: false
        };
        try {
            var d25 = _ts_add_disposable_resource(env7, _define_property({}, Symbol.asyncDispose, function() {
                return _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
                        return [
                            2
                        ];
                    });
                })();
            }), true);
        } catch (e) {
            env7.error = e;
            env7.hasError = true;
        } finally{
            var result6 = _ts_dispose_resources(env7);
            if (result6) await result6;
        }
    }
    if (true) {
        var env8 = {
            stack: [],
            error: void 0,
            hasError: false
        };
        try {
            var d26 = _ts_add_disposable_resource(env8, _define_property({}, Symbol.asyncDispose, function() {
                return _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
                        return [
                            2
                        ];
                    });
                })();
            }), true);
        } catch (e) {
            env8.error = e;
            env8.hasError = true;
        } finally{
            var result7 = _ts_dispose_resources(env8);
            if (result7) await result7;
        }
    } else {
        var env9 = {
            stack: [],
            error: void 0,
            hasError: false
        };
        try {
            var d27 = _ts_add_disposable_resource(env9, _define_property({}, Symbol.asyncDispose, function() {
                return _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
                        return [
                            2
                        ];
                    });
                })();
            }), true);
        } catch (e) {
            env9.error = e;
            env9.hasError = true;
        } finally{
            var result8 = _ts_dispose_resources(env9);
            if (result8) await result8;
        }
    }
    while(true){
        var env10 = {
            stack: [],
            error: void 0,
            hasError: false
        };
        try {
            var d28 = _ts_add_disposable_resource(env10, _define_property({}, Symbol.asyncDispose, function() {
                return _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
                        return [
                            2
                        ];
                    });
                })();
            }), true);
            break;
        } catch (e) {
            env10.error = e;
            env10.hasError = true;
        } finally{
            var result9 = _ts_dispose_resources(env10);
            if (result9) await result9;
        }
    }
    do {
        var env11 = {
            stack: [],
            error: void 0,
            hasError: false
        };
        try {
            var d29 = _ts_add_disposable_resource(env11, _define_property({}, Symbol.asyncDispose, function() {
                return _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
                        return [
                            2
                        ];
                    });
                })();
            }), true);
            break;
        } catch (e) {
            env11.error = e;
            env11.hasError = true;
        } finally{
            var result10 = _ts_dispose_resources(env11);
            if (result10) await result10;
        }
    }while (true);
    for(;;){
        var env12 = {
            stack: [],
            error: void 0,
            hasError: false
        };
        try {
            var d30 = _ts_add_disposable_resource(env12, _define_property({}, Symbol.asyncDispose, function() {
                return _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
                        return [
                            2
                        ];
                    });
                })();
            }), true);
            break;
        } catch (e) {
            env12.error = e;
            env12.hasError = true;
        } finally{
            var result11 = _ts_dispose_resources(env12);
            if (result11) await result11;
        }
    }
    for(var x in {}){
        var env13 = {
            stack: [],
            error: void 0,
            hasError: false
        };
        try {
            var d31 = _ts_add_disposable_resource(env13, _define_property({}, Symbol.asyncDispose, function() {
                return _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
                        return [
                            2
                        ];
                    });
                })();
            }), true);
        } catch (e) {
            env13.error = e;
            env13.hasError = true;
        } finally{
            var result12 = _ts_dispose_resources(env13);
            if (result12) await result12;
        }
    }
    for(var _i = 0, _iter = []; _i < _iter.length; _i++){
        var x1 = _iter[_i];
        var env14 = {
            stack: [],
            error: void 0,
            hasError: false
        };
        try {
            var d32 = _ts_add_disposable_resource(env14, _define_property({}, Symbol.asyncDispose, function() {
                return _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
                        return [
                            2
                        ];
                    });
                })();
            }), true);
        } catch (e) {
            env14.error = e;
            env14.hasError = true;
        } finally{
            var result13 = _ts_dispose_resources(env14);
            if (result13) await result13;
        }
    }
} catch (e) {
    env.error = e;
    env.hasError = true;
} finally{
    var result14 = _ts_dispose_resources(env);
    if (result14) await result14;
}
export { };
