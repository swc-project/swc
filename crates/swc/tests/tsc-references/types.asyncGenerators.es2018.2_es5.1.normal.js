import _async_generator_delegate from "@swc/helpers/src/_async_generator_delegate.mjs";
import _async_iterator from "@swc/helpers/src/_async_iterator.mjs";
import _await_async_generator from "@swc/helpers/src/_await_async_generator.mjs";
import _wrap_async_generator from "@swc/helpers/src/_wrap_async_generator.mjs";
import regeneratorRuntime from "regenerator-runtime";
function inferReturnType1() {
    return _inferReturnType1.apply(this, arguments);
}
function _inferReturnType1() {
    _inferReturnType1 = // @target: es2018
    // @lib: esnext
    // @noEmit: true
    _wrap_async_generator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    return _ctx.delegateYield(_async_generator_delegate(_async_iterator({}), _await_async_generator), "t0", 1);
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _inferReturnType1.apply(this, arguments);
}
function inferReturnType2() {
    return _inferReturnType2.apply(this, arguments);
}
function _inferReturnType2() {
    _inferReturnType2 = _wrap_async_generator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    return _ctx.delegateYield(_async_generator_delegate(_async_iterator(inferReturnType2()), _await_async_generator), "t0", 1);
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _inferReturnType2.apply(this, arguments);
}
function inferReturnType3() {
    return _inferReturnType3.apply(this, arguments);
}
function _inferReturnType3() {
    _inferReturnType3 = _wrap_async_generator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    return _ctx.delegateYield(_async_generator_delegate(_async_iterator(Promise.resolve([
                        1,
                        2
                    ])), _await_async_generator), "t0", 1);
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _inferReturnType3.apply(this, arguments);
}
var assignability1 = function() {
    var _ref = _wrap_async_generator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    _ctx.next = 2;
                    return "a";
                case 2:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return function assignability1() {
        return _ref.apply(this, arguments);
    };
}();
var assignability2 = function() {
    var _ref = _wrap_async_generator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    return _ctx.delegateYield(_async_generator_delegate(_async_iterator([
                        "a",
                        "b"
                    ]), _await_async_generator), "t0", 1);
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return function assignability2() {
        return _ref.apply(this, arguments);
    };
}();
var assignability3 = function() {
    var _ref = _wrap_async_generator(regeneratorRuntime.mark(function _callee1() {
        return regeneratorRuntime.wrap(function _callee$(_ctx1) {
            while(1)switch(_ctx1.prev = _ctx1.next){
                case 0:
                    return _ctx1.delegateYield(_async_generator_delegate(_async_iterator(_wrap_async_generator(regeneratorRuntime.mark(function _callee() {
                        return regeneratorRuntime.wrap(function _callee$(_ctx) {
                            while(1)switch(_ctx.prev = _ctx.next){
                                case 0:
                                    _ctx.next = 2;
                                    return "a";
                                case 2:
                                case "end":
                                    return _ctx.stop();
                            }
                        }, _callee);
                    }))()), _await_async_generator), "t0", 1);
                case 1:
                case "end":
                    return _ctx1.stop();
            }
        }, _callee1);
    }));
    return function assignability3() {
        return _ref.apply(this, arguments);
    };
}();
var assignability4 = function() {
    var _ref = _wrap_async_generator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    _ctx.next = 2;
                    return "a";
                case 2:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return function assignability4() {
        return _ref.apply(this, arguments);
    };
}();
var assignability5 = function() {
    var _ref = _wrap_async_generator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    return _ctx.delegateYield(_async_generator_delegate(_async_iterator([
                        "a",
                        "b"
                    ]), _await_async_generator), "t0", 1);
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return function assignability5() {
        return _ref.apply(this, arguments);
    };
}();
var assignability6 = function() {
    var _ref = _wrap_async_generator(regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee$(_ctx2) {
            while(1)switch(_ctx2.prev = _ctx2.next){
                case 0:
                    return _ctx2.delegateYield(_async_generator_delegate(_async_iterator(_wrap_async_generator(regeneratorRuntime.mark(function _callee() {
                        return regeneratorRuntime.wrap(function _callee$(_ctx) {
                            while(1)switch(_ctx.prev = _ctx.next){
                                case 0:
                                    _ctx.next = 2;
                                    return "a";
                                case 2:
                                case "end":
                                    return _ctx.stop();
                            }
                        }, _callee);
                    }))()), _await_async_generator), "t0", 1);
                case 1:
                case "end":
                    return _ctx2.stop();
            }
        }, _callee2);
    }));
    return function assignability6() {
        return _ref.apply(this, arguments);
    };
}();
var assignability7 = function() {
    var _ref = _wrap_async_generator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    _ctx.next = 2;
                    return "a";
                case 2:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return function assignability7() {
        return _ref.apply(this, arguments);
    };
}();
var assignability8 = function() {
    var _ref = _wrap_async_generator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    return _ctx.delegateYield(_async_generator_delegate(_async_iterator([
                        "a",
                        "b"
                    ]), _await_async_generator), "t0", 1);
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return function assignability8() {
        return _ref.apply(this, arguments);
    };
}();
var assignability9 = function() {
    var _ref = _wrap_async_generator(regeneratorRuntime.mark(function _callee3() {
        return regeneratorRuntime.wrap(function _callee$(_ctx3) {
            while(1)switch(_ctx3.prev = _ctx3.next){
                case 0:
                    return _ctx3.delegateYield(_async_generator_delegate(_async_iterator(_wrap_async_generator(regeneratorRuntime.mark(function _callee() {
                        return regeneratorRuntime.wrap(function _callee$(_ctx) {
                            while(1)switch(_ctx.prev = _ctx.next){
                                case 0:
                                    _ctx.next = 2;
                                    return "a";
                                case 2:
                                case "end":
                                    return _ctx.stop();
                            }
                        }, _callee);
                    }))()), _await_async_generator), "t0", 1);
                case 1:
                case "end":
                    return _ctx3.stop();
            }
        }, _callee3);
    }));
    return function assignability9() {
        return _ref.apply(this, arguments);
    };
}();
function explicitReturnType1() {
    return _explicitReturnType1.apply(this, arguments);
}
function _explicitReturnType1() {
    _explicitReturnType1 = _wrap_async_generator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    _ctx.next = 2;
                    return "a";
                case 2:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _explicitReturnType1.apply(this, arguments);
}
function explicitReturnType2() {
    return _explicitReturnType2.apply(this, arguments);
}
function _explicitReturnType2() {
    _explicitReturnType2 = _wrap_async_generator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    return _ctx.delegateYield(_async_generator_delegate(_async_iterator([
                        "a",
                        "b"
                    ]), _await_async_generator), "t0", 1);
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _explicitReturnType2.apply(this, arguments);
}
function explicitReturnType3() {
    return _explicitReturnType3.apply(this, arguments);
}
function _explicitReturnType3() {
    _explicitReturnType3 = _wrap_async_generator(regeneratorRuntime.mark(function _callee4() {
        return regeneratorRuntime.wrap(function _callee$(_ctx4) {
            while(1)switch(_ctx4.prev = _ctx4.next){
                case 0:
                    return _ctx4.delegateYield(_async_generator_delegate(_async_iterator(_wrap_async_generator(regeneratorRuntime.mark(function _callee() {
                        return regeneratorRuntime.wrap(function _callee$(_ctx) {
                            while(1)switch(_ctx.prev = _ctx.next){
                                case 0:
                                    _ctx.next = 2;
                                    return "a";
                                case 2:
                                case "end":
                                    return _ctx.stop();
                            }
                        }, _callee);
                    }))()), _await_async_generator), "t0", 1);
                case 1:
                case "end":
                    return _ctx4.stop();
            }
        }, _callee4);
    }));
    return _explicitReturnType3.apply(this, arguments);
}
function explicitReturnType4() {
    return _explicitReturnType4.apply(this, arguments);
}
function _explicitReturnType4() {
    _explicitReturnType4 = _wrap_async_generator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    _ctx.next = 2;
                    return "a";
                case 2:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _explicitReturnType4.apply(this, arguments);
}
function explicitReturnType5() {
    return _explicitReturnType5.apply(this, arguments);
}
function _explicitReturnType5() {
    _explicitReturnType5 = _wrap_async_generator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    return _ctx.delegateYield(_async_generator_delegate(_async_iterator([
                        "a",
                        "b"
                    ]), _await_async_generator), "t0", 1);
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _explicitReturnType5.apply(this, arguments);
}
function explicitReturnType6() {
    return _explicitReturnType6.apply(this, arguments);
}
function _explicitReturnType6() {
    _explicitReturnType6 = _wrap_async_generator(regeneratorRuntime.mark(function _callee5() {
        return regeneratorRuntime.wrap(function _callee$(_ctx5) {
            while(1)switch(_ctx5.prev = _ctx5.next){
                case 0:
                    return _ctx5.delegateYield(_async_generator_delegate(_async_iterator(_wrap_async_generator(regeneratorRuntime.mark(function _callee() {
                        return regeneratorRuntime.wrap(function _callee$(_ctx) {
                            while(1)switch(_ctx.prev = _ctx.next){
                                case 0:
                                    _ctx.next = 2;
                                    return "a";
                                case 2:
                                case "end":
                                    return _ctx.stop();
                            }
                        }, _callee);
                    }))()), _await_async_generator), "t0", 1);
                case 1:
                case "end":
                    return _ctx5.stop();
            }
        }, _callee5);
    }));
    return _explicitReturnType6.apply(this, arguments);
}
function explicitReturnType7() {
    return _explicitReturnType7.apply(this, arguments);
}
function _explicitReturnType7() {
    _explicitReturnType7 = _wrap_async_generator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    _ctx.next = 2;
                    return "a";
                case 2:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _explicitReturnType7.apply(this, arguments);
}
function explicitReturnType8() {
    return _explicitReturnType8.apply(this, arguments);
}
function _explicitReturnType8() {
    _explicitReturnType8 = _wrap_async_generator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    return _ctx.delegateYield(_async_generator_delegate(_async_iterator([
                        "a",
                        "b"
                    ]), _await_async_generator), "t0", 1);
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _explicitReturnType8.apply(this, arguments);
}
function explicitReturnType9() {
    return _explicitReturnType9.apply(this, arguments);
}
function _explicitReturnType9() {
    _explicitReturnType9 = _wrap_async_generator(regeneratorRuntime.mark(function _callee6() {
        return regeneratorRuntime.wrap(function _callee$(_ctx6) {
            while(1)switch(_ctx6.prev = _ctx6.next){
                case 0:
                    return _ctx6.delegateYield(_async_generator_delegate(_async_iterator(_wrap_async_generator(regeneratorRuntime.mark(function _callee() {
                        return regeneratorRuntime.wrap(function _callee$(_ctx) {
                            while(1)switch(_ctx.prev = _ctx.next){
                                case 0:
                                    _ctx.next = 2;
                                    return "a";
                                case 2:
                                case "end":
                                    return _ctx.stop();
                            }
                        }, _callee);
                    }))()), _await_async_generator), "t0", 1);
                case 1:
                case "end":
                    return _ctx6.stop();
            }
        }, _callee6);
    }));
    return _explicitReturnType9.apply(this, arguments);
}
function explicitReturnType10() {
    return _explicitReturnType10.apply(this, arguments);
}
function _explicitReturnType10() {
    _explicitReturnType10 = _wrap_async_generator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    _ctx.next = 2;
                    return 1;
                case 2:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _explicitReturnType10.apply(this, arguments);
}
function explicitReturnType11() {
    return _explicitReturnType11.apply(this, arguments);
}
function _explicitReturnType11() {
    _explicitReturnType11 = _wrap_async_generator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    _ctx.next = 2;
                    return 1;
                case 2:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _explicitReturnType11.apply(this, arguments);
}
function explicitReturnType12() {
    return _explicitReturnType12.apply(this, arguments);
}
function _explicitReturnType12() {
    _explicitReturnType12 = _wrap_async_generator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    _ctx.next = 2;
                    return 1;
                case 2:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _explicitReturnType12.apply(this, arguments);
}
function yieldStar() {
    return _yieldStar.apply(this, arguments);
}
function _yieldStar() {
    _yieldStar = _wrap_async_generator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    return _ctx.delegateYield(_async_generator_delegate(_async_iterator({}), _await_async_generator), "t0", 1);
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _yieldStar.apply(this, arguments);
}
