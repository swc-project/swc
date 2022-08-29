//// [asyncFunctionDeclaration15_es5.ts]
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
function fn1() {
    return _fn1.apply(this, arguments);
}
function _fn1() {
    _fn1 = _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            return [
                2
            ];
        });
    } // valid: Promise<void>
    );
    return _fn1.apply(this, arguments);
}
function fn2() {
    return _fn2.apply(this, arguments);
}
function _fn2() {
    _fn2 = _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            return [
                2
            ];
        });
    } // error
    );
    return _fn2.apply(this, arguments);
}
function fn3() {
    return _fn3.apply(this, arguments);
}
function _fn3() {
    _fn3 = _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            return [
                2
            ];
        });
    } // error
    );
    return _fn3.apply(this, arguments);
}
function fn4() {
    return _fn4.apply(this, arguments);
}
function _fn4() {
    _fn4 = _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            return [
                2
            ];
        });
    } // error
    );
    return _fn4.apply(this, arguments);
}
function fn5() {
    return _fn5.apply(this, arguments);
}
function _fn5() {
    _fn5 = _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            return [
                2
            ];
        });
    } // error
    );
    return _fn5.apply(this, arguments);
}
function fn6() {
    return _fn6.apply(this, arguments);
}
function _fn6() {
    _fn6 = _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            return [
                2
            ];
        });
    } // error
    );
    return _fn6.apply(this, arguments);
}
function fn7() {
    return _fn7.apply(this, arguments);
}
function _fn7() {
    _fn7 = _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            return [
                2
            ];
        });
    } // valid: Promise<void>
    );
    return _fn7.apply(this, arguments);
}
function fn8() {
    return _fn8.apply(this, arguments);
}
function _fn8() {
    _fn8 = _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            return [
                2,
                1
            ];
        });
    } // valid: Promise<number>
    );
    return _fn8.apply(this, arguments);
}
function fn9() {
    return _fn9.apply(this, arguments);
}
function _fn9() {
    _fn9 = _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            return [
                2,
                null
            ];
        });
    } // valid: Promise<any>
    );
    return _fn9.apply(this, arguments);
}
function fn10() {
    return _fn10.apply(this, arguments);
}
function _fn10() {
    _fn10 = _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            return [
                2,
                undefined
            ];
        });
    } // valid: Promise<any>
    );
    return _fn10.apply(this, arguments);
}
function fn11() {
    return _fn11.apply(this, arguments);
}
function _fn11() {
    _fn11 = _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            return [
                2,
                a
            ];
        });
    } // valid: Promise<any>
    );
    return _fn11.apply(this, arguments);
}
function fn12() {
    return _fn12.apply(this, arguments);
}
function _fn12() {
    _fn12 = _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            return [
                2,
                obj
            ];
        });
    } // valid: Promise<{ then: string; }>
    );
    return _fn12.apply(this, arguments);
}
function fn13() {
    return _fn13.apply(this, arguments);
}
function _fn13() {
    _fn13 = _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            return [
                2,
                thenable
            ];
        });
    } // error
    );
    return _fn13.apply(this, arguments);
}
function fn14() {
    return _fn14.apply(this, arguments);
}
function _fn14() {
    _fn14 = _async_to_generator(function() {
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
    } // valid: Promise<void>
    );
    return _fn14.apply(this, arguments);
}
function fn15() {
    return _fn15.apply(this, arguments);
}
function _fn15() {
    _fn15 = _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        null
                    ];
                case 1:
                    _state.sent();
                    return [
                        2
                    ];
            }
        });
    } // valid: Promise<void>
    );
    return _fn15.apply(this, arguments);
}
function fn16() {
    return _fn16.apply(this, arguments);
}
function _fn16() {
    _fn16 = _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        undefined
                    ];
                case 1:
                    _state.sent();
                    return [
                        2
                    ];
            }
        });
    } // valid: Promise<void>
    );
    return _fn16.apply(this, arguments);
}
function fn17() {
    return _fn17.apply(this, arguments);
}
function _fn17() {
    _fn17 = _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        a
                    ];
                case 1:
                    _state.sent();
                    return [
                        2
                    ];
            }
        });
    } // valid: Promise<void>
    );
    return _fn17.apply(this, arguments);
}
function fn18() {
    return _fn18.apply(this, arguments);
}
function _fn18() {
    _fn18 = _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        obj
                    ];
                case 1:
                    _state.sent();
                    return [
                        2
                    ];
            }
        });
    } // valid: Promise<void>
    );
    return _fn18.apply(this, arguments);
}
function fn19() {
    return _fn19.apply(this, arguments);
}
function _fn19() {
    _fn19 = _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        thenable
                    ];
                case 1:
                    _state.sent();
                    return [
                        2
                    ];
            }
        });
    } // error
    );
    return _fn19.apply(this, arguments);
}
