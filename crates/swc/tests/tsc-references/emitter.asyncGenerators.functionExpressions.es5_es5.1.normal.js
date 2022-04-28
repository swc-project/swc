import * as swcHelpers from "@swc/helpers";
import regeneratorRuntime from "regenerator-runtime";
// @target: es5
// @lib: esnext
// @filename: F1.ts
var f1 = function() {
    var _ref = swcHelpers.wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return function f1() {
        return _ref.apply(this, arguments);
    };
}();
// @filename: F2.ts
var f2 = function() {
    var _ref = swcHelpers.wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
        var x;
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
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
    }));
    return function f2() {
        return _ref.apply(this, arguments);
    };
}();
// @filename: F3.ts
var f3 = function() {
    var _ref = swcHelpers.wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
        var x;
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    _ctx.next = 2;
                    return 1;
                case 2:
                    x = _ctx.sent;
                case 3:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return function f3() {
        return _ref.apply(this, arguments);
    };
}();
// @filename: F4.ts
var f4 = function() {
    var _ref = swcHelpers.wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
        var x;
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    return _ctx.delegateYield(swcHelpers.asyncGeneratorDelegate(swcHelpers.asyncIterator([
                        1
                    ]), swcHelpers.awaitAsyncGenerator), "t0", 1);
                case 1:
                    x = _ctx.t0;
                case 2:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return function f4() {
        return _ref.apply(this, arguments);
    };
}();
// @filename: F5.ts
var f5 = function() {
    var _ref = swcHelpers.wrapAsyncGenerator(regeneratorRuntime.mark(function _callee1() {
        var x;
        return regeneratorRuntime.wrap(function _callee$(_ctx1) {
            while(1)switch(_ctx1.prev = _ctx1.next){
                case 0:
                    return _ctx1.delegateYield(swcHelpers.asyncGeneratorDelegate(swcHelpers.asyncIterator(swcHelpers.wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
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
                    }))()), swcHelpers.awaitAsyncGenerator), "t0", 1);
                case 1:
                    x = _ctx1.t0;
                case 2:
                case "end":
                    return _ctx1.stop();
            }
        }, _callee1);
    }));
    return function f5() {
        return _ref.apply(this, arguments);
    };
}();
// @filename: F6.ts
var f6 = function() {
    var _ref = swcHelpers.wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
        var x;
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    _ctx.next = 2;
                    return swcHelpers.awaitAsyncGenerator(1);
                case 2:
                    x = _ctx.sent;
                case 3:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return function f6() {
        return _ref.apply(this, arguments);
    };
}();
// @filename: F7.ts
var f7 = function() {
    var _ref = swcHelpers.wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    return _ctx.abrupt("return", 1);
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return function f7() {
        return _ref.apply(this, arguments);
    };
}();
