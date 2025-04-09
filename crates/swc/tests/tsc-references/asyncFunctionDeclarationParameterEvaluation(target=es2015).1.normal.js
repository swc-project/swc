//// [asyncFunctionDeclarationParameterEvaluation.ts]
// https://github.com/microsoft/TypeScript/issues/40410
import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
function f1(_0) {
    return /*#__PURE__*/ _async_to_generator(function*(x, y = z) {}).apply(this, arguments);
}
function f2(_0) {
    return /*#__PURE__*/ _async_to_generator(function*({ [z]: x }) {}).apply(this, arguments);
}
function f3() {
    return /*#__PURE__*/ _async_to_generator(function*(x = z) {
        return ()=>/*#__PURE__*/ _async_to_generator(function*() {
                return arguments;
            }).apply(this, arguments);
    }).apply(this, arguments);
}
function f4() {
    return /*#__PURE__*/ _async_to_generator(function*(x = z) {
        return ()=>/*#__PURE__*/ _async_to_generator(function*() {
                return ()=>/*#__PURE__*/ _async_to_generator(function*() {
                        return arguments;
                    }).apply(this, arguments);
            }).apply(this, arguments);
    }).apply(this, arguments);
}
function f5() {
    return /*#__PURE__*/ _async_to_generator(function*(x = z, ...args) {}).apply(this, arguments);
}
function f6() {
    return /*#__PURE__*/ _async_to_generator(function*(x = z, ...args) {
        return ()=>/*#__PURE__*/ _async_to_generator(function*() {
                return arguments;
            }).apply(this, arguments);
    }).apply(this, arguments);
}
function f7() {
    return /*#__PURE__*/ _async_to_generator(function*(x = z, ...args) {
        return ()=>/*#__PURE__*/ _async_to_generator(function*() {
                return ()=>/*#__PURE__*/ _async_to_generator(function*() {
                        return arguments;
                    }).apply(this, arguments);
            }).apply(this, arguments);
    }).apply(this, arguments);
}
function f8() {
    return /*#__PURE__*/ _async_to_generator(function*() {
        return (x = z)=>/*#__PURE__*/ _async_to_generator(function*() {
                return arguments;
            }).apply(this, arguments);
    }).apply(this, arguments);
}
function f9() {
    return /*#__PURE__*/ _async_to_generator(function*() {
        return (x = z)=>/*#__PURE__*/ _async_to_generator(function*() {
                return ()=>/*#__PURE__*/ _async_to_generator(function*() {
                        return arguments;
                    }).apply(this, arguments);
            }).apply(this, arguments);
    }).apply(this, arguments);
}
function f10() {
    return /*#__PURE__*/ _async_to_generator(function*(x = z) {
        return ()=>/*#__PURE__*/ _async_to_generator(function*() {
                return function() {
                    return /*#__PURE__*/ _async_to_generator(function*() {
                        return ()=>/*#__PURE__*/ _async_to_generator(function*() {
                                return arguments;
                            }).apply(this, arguments);
                    }).apply(this, arguments);
                };
            })();
    }).apply(this, arguments);
}
function f11() {
    return (x = z)=>/*#__PURE__*/ _async_to_generator(function*() {
            return arguments;
        }).apply(this, arguments);
}
function f12() {
    return (x = z)=>/*#__PURE__*/ _async_to_generator(function*() {
            return ()=>/*#__PURE__*/ _async_to_generator(function*() {
                    return arguments;
                }).apply(this, arguments);
        }).apply(this, arguments);
}
function f() {
    const a1 = (x, y = z)=>/*#__PURE__*/ _async_to_generator(function*() {})();
    const a2 = ({ [z]: x })=>/*#__PURE__*/ _async_to_generator(function*() {})();
    const a3 = (x = z)=>/*#__PURE__*/ _async_to_generator(function*() {
            return ()=>/*#__PURE__*/ _async_to_generator(function*() {
                    return arguments;
                }).apply(this, arguments);
        }).apply(this, arguments);
    const a4 = (x = z)=>/*#__PURE__*/ _async_to_generator(function*() {
            return ()=>/*#__PURE__*/ _async_to_generator(function*() {
                    return ()=>/*#__PURE__*/ _async_to_generator(function*() {
                            return arguments;
                        }).apply(this, arguments);
                }).apply(this, arguments);
        }).apply(this, arguments);
    const a5 = (x = z, ...args)=>/*#__PURE__*/ _async_to_generator(function*() {})();
    const a6 = (x = z, ...args)=>/*#__PURE__*/ _async_to_generator(function*() {
            return ()=>/*#__PURE__*/ _async_to_generator(function*() {
                    return arguments;
                }).apply(this, arguments);
        }).apply(this, arguments);
    const a7 = (x = z, ...args)=>/*#__PURE__*/ _async_to_generator(function*() {
            return ()=>/*#__PURE__*/ _async_to_generator(function*() {
                    return ()=>/*#__PURE__*/ _async_to_generator(function*() {
                            return arguments;
                        }).apply(this, arguments);
                }).apply(this, arguments);
        }).apply(this, arguments);
    const a8 = ()=>/*#__PURE__*/ _async_to_generator(function*() {
            return (x = z)=>/*#__PURE__*/ _async_to_generator(function*() {
                    return arguments;
                }).apply(this, arguments);
        }).apply(this, arguments);
    const a9 = ()=>/*#__PURE__*/ _async_to_generator(function*() {
            return (x = z)=>/*#__PURE__*/ _async_to_generator(function*() {
                    return ()=>/*#__PURE__*/ _async_to_generator(function*() {
                            return arguments;
                        }).apply(this, arguments);
                }).apply(this, arguments);
        }).apply(this, arguments);
    const a10 = (x = z)=>/*#__PURE__*/ _async_to_generator(function*() {
            return ()=>/*#__PURE__*/ _async_to_generator(function*() {
                    return function() {
                        return /*#__PURE__*/ _async_to_generator(function*() {
                            return ()=>/*#__PURE__*/ _async_to_generator(function*() {
                                    return arguments;
                                }).apply(this, arguments);
                        }).apply(this, arguments);
                    };
                })();
        })();
}
