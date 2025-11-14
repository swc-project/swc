//// [asyncFunctionDeclarationParameterEvaluation.ts]
import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
// https://github.com/microsoft/TypeScript/issues/40410
function f1(_0) {
    return _async_to_generator(function*(x, y = z) {}).apply(this, arguments);
}
function f2(_0) {
    return _async_to_generator(function*({ [z]: x }) {}).apply(this, arguments);
}
function f3() {
    return _async_to_generator(function*(x = z) {
        return ()=>_async_to_generator(function*() {
                return arguments;
            }).apply(this, arguments);
    }).apply(this, arguments);
}
function f4() {
    return _async_to_generator(function*(x = z) {
        return ()=>_async_to_generator(function*() {
                return ()=>_async_to_generator(function*() {
                        return arguments;
                    }).apply(this, arguments);
            }).apply(this, arguments);
    }).apply(this, arguments);
}
function f5() {
    return _async_to_generator(function*(x = z, ...args) {}).apply(this, arguments);
}
function f6() {
    return _async_to_generator(function*(x = z, ...args) {
        return ()=>_async_to_generator(function*() {
                return arguments;
            }).apply(this, arguments);
    }).apply(this, arguments);
}
function f7() {
    return _async_to_generator(function*(x = z, ...args) {
        return ()=>_async_to_generator(function*() {
                return ()=>_async_to_generator(function*() {
                        return arguments;
                    }).apply(this, arguments);
            }).apply(this, arguments);
    }).apply(this, arguments);
}
function f8() {
    return _async_to_generator(function*() {
        return (x = z)=>_async_to_generator(function*() {
                return arguments;
            }).apply(this, arguments);
    }).apply(this, arguments);
}
function f9() {
    return _async_to_generator(function*() {
        return (x = z)=>_async_to_generator(function*() {
                return ()=>_async_to_generator(function*() {
                        return arguments;
                    }).apply(this, arguments);
            }).apply(this, arguments);
    }).apply(this, arguments);
}
function f10() {
    return _async_to_generator(function*(x = z) {
        return ()=>_async_to_generator(function*() {
                return function() {
                    return _async_to_generator(function*() {
                        return ()=>_async_to_generator(function*() {
                                return arguments;
                            }).apply(this, arguments);
                    }).apply(this, arguments);
                };
            })();
    }).apply(this, arguments);
}
function f11() {
    return (x = z)=>_async_to_generator(function*() {
            return arguments;
        }).apply(this, arguments);
}
function f12() {
    return (x = z)=>_async_to_generator(function*() {
            return ()=>_async_to_generator(function*() {
                    return arguments;
                }).apply(this, arguments);
        }).apply(this, arguments);
}
function f() {
    const a1 = (x, y = z)=>_async_to_generator(function*() {})();
    const a2 = ({ [z]: x })=>_async_to_generator(function*() {})();
    const a3 = (x = z)=>_async_to_generator(function*() {
            return ()=>_async_to_generator(function*() {
                    return arguments;
                }).apply(this, arguments);
        }).apply(this, arguments);
    const a4 = (x = z)=>_async_to_generator(function*() {
            return ()=>_async_to_generator(function*() {
                    return ()=>_async_to_generator(function*() {
                            return arguments;
                        }).apply(this, arguments);
                }).apply(this, arguments);
        }).apply(this, arguments);
    const a5 = (x = z, ...args)=>_async_to_generator(function*() {})();
    const a6 = (x = z, ...args)=>_async_to_generator(function*() {
            return ()=>_async_to_generator(function*() {
                    return arguments;
                }).apply(this, arguments);
        }).apply(this, arguments);
    const a7 = (x = z, ...args)=>_async_to_generator(function*() {
            return ()=>_async_to_generator(function*() {
                    return ()=>_async_to_generator(function*() {
                            return arguments;
                        }).apply(this, arguments);
                }).apply(this, arguments);
        }).apply(this, arguments);
    const a8 = ()=>_async_to_generator(function*() {
            return (x = z)=>_async_to_generator(function*() {
                    return arguments;
                }).apply(this, arguments);
        }).apply(this, arguments);
    const a9 = ()=>_async_to_generator(function*() {
            return (x = z)=>_async_to_generator(function*() {
                    return ()=>_async_to_generator(function*() {
                            return arguments;
                        }).apply(this, arguments);
                }).apply(this, arguments);
        }).apply(this, arguments);
    const a10 = (x = z)=>_async_to_generator(function*() {
            return ()=>_async_to_generator(function*() {
                    return function() {
                        return _async_to_generator(function*() {
                            return ()=>_async_to_generator(function*() {
                                    return arguments;
                                }).apply(this, arguments);
                        }).apply(this, arguments);
                    };
                })();
        })();
}
