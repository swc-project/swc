import * as swcHelpers from "@swc/helpers";
import regeneratorRuntime from "regenerator-runtime";
var C1 = function() {
    function C1() {
        swcHelpers.classCallCheck(this, C1);
    }
    return C1.prototype.f = function() {
        return swcHelpers.wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function(_ctx) {
                for(;;)switch(_ctx.prev = _ctx.next){
                    case 0:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee);
        }))();
    }, C1;
}(), C2 = function() {
    function C2() {
        swcHelpers.classCallCheck(this, C2);
    }
    return C2.prototype.f = function() {
        return swcHelpers.wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
            var x;
            return regeneratorRuntime.wrap(function(_ctx) {
                for(;;)switch(_ctx.prev = _ctx.next){
                    case 0:
                        _ctx.next = 2;
                        return;
                    case 2:
                        x = _ctx.sent;
                    case 3:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee);
        }))();
    }, C2;
}(), C3 = function() {
    function C3() {
        swcHelpers.classCallCheck(this, C3);
    }
    return C3.prototype.f = function() {
        return swcHelpers.wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
            var x;
            return regeneratorRuntime.wrap(function(_ctx) {
                for(;;)switch(_ctx.prev = _ctx.next){
                    case 0:
                        return _ctx.next = 2, 1;
                    case 2:
                        x = _ctx.sent;
                    case 3:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee);
        }))();
    }, C3;
}(), C4 = function() {
    function C4() {
        swcHelpers.classCallCheck(this, C4);
    }
    return C4.prototype.f = function() {
        return swcHelpers.wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
            var x;
            return regeneratorRuntime.wrap(function(_ctx) {
                for(;;)switch(_ctx.prev = _ctx.next){
                    case 0:
                        return _ctx.delegateYield([
                            1
                        ], "t0", 1);
                    case 1:
                        x = _ctx.t0;
                    case 2:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee);
        }))();
    }, C4;
}(), C5 = function() {
    function C5() {
        swcHelpers.classCallCheck(this, C5);
    }
    return C5.prototype.f = function() {
        return swcHelpers.wrapAsyncGenerator(regeneratorRuntime.mark(function _callee1() {
            var x;
            return regeneratorRuntime.wrap(function(_ctx1) {
                for(;;)switch(_ctx1.prev = _ctx1.next){
                    case 0:
                        return _ctx1.delegateYield(swcHelpers.wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
                            return regeneratorRuntime.wrap(function(_ctx) {
                                for(;;)switch(_ctx.prev = _ctx.next){
                                    case 0:
                                        return _ctx.next = 2, 1;
                                    case 2:
                                    case "end":
                                        return _ctx.stop();
                                }
                            }, _callee);
                        }))(), "t0", 1);
                    case 1:
                        x = _ctx1.t0;
                    case 2:
                    case "end":
                        return _ctx1.stop();
                }
            }, _callee1);
        }))();
    }, C5;
}(), C6 = function() {
    function C6() {
        swcHelpers.classCallCheck(this, C6);
    }
    return C6.prototype.f = function() {
        return swcHelpers.wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
            var x;
            return regeneratorRuntime.wrap(function(_ctx) {
                for(;;)switch(_ctx.prev = _ctx.next){
                    case 0:
                        return _ctx.next = 2, swcHelpers.awaitAsyncGenerator(1);
                    case 2:
                        x = _ctx.sent;
                    case 3:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee);
        }))();
    }, C6;
}(), C7 = function() {
    function C7() {
        swcHelpers.classCallCheck(this, C7);
    }
    return C7.prototype.f = function() {
        return swcHelpers.wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function(_ctx) {
                for(;;)switch(_ctx.prev = _ctx.next){
                    case 0:
                        return _ctx.abrupt("return", 1);
                    case 1:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee);
        }))();
    }, C7;
}(), C8 = function() {
    function C8() {
        swcHelpers.classCallCheck(this, C8);
    }
    var _proto = C8.prototype;
    return _proto.g = function() {}, _proto.f = function() {
        var _this = this;
        return swcHelpers.wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function(_ctx) {
                for(;;)switch(_ctx.prev = _ctx.next){
                    case 0:
                        _this.g();
                    case 1:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee);
        }))();
    }, C8;
}(), B9 = function() {
    function B9() {
        swcHelpers.classCallCheck(this, B9);
    }
    return B9.prototype.g = function() {}, B9;
}(), C9 = function(B9) {
    swcHelpers.inherits(C9, B9);
    var _super = swcHelpers.createSuper(C9);
    function C9() {
        return swcHelpers.classCallCheck(this, C9), _super.apply(this, arguments);
    }
    return C9.prototype.f = function() {
        var _this = this, _this1 = this;
        return swcHelpers.wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function(_ctx) {
                for(;;)switch(_ctx.prev = _ctx.next){
                    case 0:
                        swcHelpers.get(swcHelpers.getPrototypeOf(C9.prototype), "g", _this).call(_this1);
                    case 1:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee);
        }))();
    }, C9;
}(B9);
