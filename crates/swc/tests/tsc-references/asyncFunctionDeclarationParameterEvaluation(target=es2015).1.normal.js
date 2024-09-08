//// [asyncFunctionDeclarationParameterEvaluation.ts]
// https://github.com/microsoft/TypeScript/issues/40410
import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
function f1(x) {
    return _f1.apply(this, arguments);
}
function _f1() {
    _f1 = _async_to_generator(function*(x, y = z) {});
    return _f1.apply(this, arguments);
}
function f2(_) {
    return _f2.apply(this, arguments);
}
function _f2() {
    _f2 = _async_to_generator(function*({ [z]: x }) {});
    return _f2.apply(this, arguments);
}
function f3() {
    return _f3.apply(this, arguments);
}
function _f3() {
    _f3 = _async_to_generator(function*(x = z) {
        var _arguments = arguments;
        return /*#__PURE__*/ _async_to_generator(function*() {
            return _arguments;
        });
    });
    return _f3.apply(this, arguments);
}
function f4() {
    return _f4.apply(this, arguments);
}
function _f4() {
    _f4 = _async_to_generator(function*(x = z) {
        var _arguments = arguments;
        return /*#__PURE__*/ _async_to_generator(function*() {
            /*#__PURE__*/ return /*#__PURE__*/ _async_to_generator(function*() {
                return _arguments;
            });
        });
    });
    return _f4.apply(this, arguments);
}
function f5() {
    return _f5.apply(this, arguments);
}
function _f5() {
    _f5 = _async_to_generator(function*(x = z, ...args) {});
    return _f5.apply(this, arguments);
}
function f6() {
    return _f6.apply(this, arguments);
}
function _f6() {
    _f6 = _async_to_generator(function*(x = z, ...args) {
        var _arguments = arguments;
        return /*#__PURE__*/ _async_to_generator(function*() {
            return _arguments;
        });
    });
    return _f6.apply(this, arguments);
}
function f7() {
    return _f7.apply(this, arguments);
}
function _f7() {
    _f7 = _async_to_generator(function*(x = z, ...args) {
        var _arguments = arguments;
        return /*#__PURE__*/ _async_to_generator(function*() {
            /*#__PURE__*/ return /*#__PURE__*/ _async_to_generator(function*() {
                return _arguments;
            });
        });
    });
    return _f7.apply(this, arguments);
}
function f8() {
    return _f8.apply(this, arguments);
}
function _f8() {
    _f8 = _async_to_generator(function*() {
        var _arguments = arguments;
        return /*#__PURE__*/ _async_to_generator(function*(x = z) {
            return _arguments;
        });
    });
    return _f8.apply(this, arguments);
}
function f9() {
    return _f9.apply(this, arguments);
}
function _f9() {
    _f9 = _async_to_generator(function*() {
        var _arguments = arguments;
        return /*#__PURE__*/ _async_to_generator(function*(x = z) {
            /*#__PURE__*/ return /*#__PURE__*/ _async_to_generator(function*() {
                return _arguments;
            });
        });
    });
    return _f9.apply(this, arguments);
}
function f10() {
    return _f10.apply(this, arguments);
}
function _f10() {
    _f10 = _async_to_generator(function*(x = z) {
        return /*#__PURE__*/ _async_to_generator(function*() {
            /*#__PURE__*/ return /*#__PURE__*/ _async_to_generator(function*() {
                var _arguments = arguments;
                return /*#__PURE__*/ _async_to_generator(function*() {
                    return _arguments;
                });
            });
        });
    });
    return _f10.apply(this, arguments);
}
function f11() {
    var _arguments = arguments;
    return /*#__PURE__*/ _async_to_generator(function*(x = z) {
        return _arguments;
    });
}
function f12() {
    var _arguments = arguments;
    return /*#__PURE__*/ _async_to_generator(function*(x = z) {
        /*#__PURE__*/ return /*#__PURE__*/ _async_to_generator(function*() {
            return _arguments;
        });
    });
}
function f() {
    const a1 = /*#__PURE__*/ function() {
        var _ref = _async_to_generator(function*(x, y = z) {});
        return function a1(x) {
            return _ref.apply(this, arguments);
        };
    }();
    const a2 = /*#__PURE__*/ function() {
        var _ref = _async_to_generator(function*({ [z]: x }) {});
        return function a2(_) {
            return _ref.apply(this, arguments);
        };
    }();
    var _arguments = arguments;
    const a3 = /*#__PURE__*/ function() {
        var _ref = _async_to_generator(function*(x = z) {
            return /*#__PURE__*/ _async_to_generator(function*() {
                return _arguments;
            });
        });
        return function a3() {
            return _ref.apply(this, arguments);
        };
    }();
    var _arguments1 = arguments;
    const a4 = /*#__PURE__*/ function() {
        var _ref = _async_to_generator(function*(x = z) {
            return /*#__PURE__*/ _async_to_generator(function*() {
                /*#__PURE__*/ return /*#__PURE__*/ _async_to_generator(function*() {
                    return _arguments1;
                });
            });
        });
        return function a4() {
            return _ref.apply(this, arguments);
        };
    }();
    const a5 = /*#__PURE__*/ function() {
        var _ref = _async_to_generator(function*(x = z, ...args) {});
        return function a5() {
            return _ref.apply(this, arguments);
        };
    }();
    var _arguments2 = arguments;
    const a6 = /*#__PURE__*/ function() {
        var _ref = _async_to_generator(function*(x = z, ...args) {
            return /*#__PURE__*/ _async_to_generator(function*() {
                return _arguments2;
            });
        });
        return function a6() {
            return _ref.apply(this, arguments);
        };
    }();
    var _arguments3 = arguments;
    const a7 = /*#__PURE__*/ function() {
        var _ref = _async_to_generator(function*(x = z, ...args) {
            return /*#__PURE__*/ _async_to_generator(function*() {
                /*#__PURE__*/ return /*#__PURE__*/ _async_to_generator(function*() {
                    return _arguments3;
                });
            });
        });
        return function a7() {
            return _ref.apply(this, arguments);
        };
    }();
    var _arguments4 = arguments;
    const a8 = /*#__PURE__*/ function() {
        var _ref = _async_to_generator(function*() {
            return /*#__PURE__*/ _async_to_generator(function*(x = z) {
                return _arguments4;
            });
        });
        return function a8() {
            return _ref.apply(this, arguments);
        };
    }();
    var _arguments5 = arguments;
    const a9 = /*#__PURE__*/ function() {
        var _ref = _async_to_generator(function*() {
            return /*#__PURE__*/ _async_to_generator(function*(x = z) {
                /*#__PURE__*/ return /*#__PURE__*/ _async_to_generator(function*() {
                    return _arguments5;
                });
            });
        });
        return function a9() {
            return _ref.apply(this, arguments);
        };
    }();
    const a10 = /*#__PURE__*/ function() {
        var _ref = _async_to_generator(function*(x = z) {
            return /*#__PURE__*/ _async_to_generator(function*() {
                /*#__PURE__*/ return /*#__PURE__*/ _async_to_generator(function*() {
                    var _arguments = arguments;
                    return /*#__PURE__*/ _async_to_generator(function*() {
                        return _arguments;
                    });
                });
            });
        });
        return function a10() {
            return _ref.apply(this, arguments);
        };
    }();
}
