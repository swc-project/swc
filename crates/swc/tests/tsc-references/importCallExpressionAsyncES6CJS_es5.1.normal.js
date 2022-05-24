import _async_to_generator from "@swc/helpers/lib/_async_to_generator.js";
import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import regeneratorRuntime from "regenerator-runtime";
// @module: commonjs
// @target: es6
// @filename: test.ts
export function fn() {
    return _fn.apply(this, arguments);
}
function _fn() {
    _fn = _async_to_generator(regeneratorRuntime.mark(function _callee() {
        var req;
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    _ctx.next = 2;
                    return import("./test") // ONE
                    ;
                case 2:
                    req = _ctx.sent;
                case 3:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _fn.apply(this, arguments);
}
export var cl1 = /*#__PURE__*/ function() {
    "use strict";
    function cl1() {
        _class_call_check(this, cl1);
    }
    var _proto = cl1.prototype;
    _proto.m = function m() {
        return _async_to_generator(regeneratorRuntime.mark(function _callee() {
            var req;
            return regeneratorRuntime.wrap(function _callee$(_ctx) {
                while(1)switch(_ctx.prev = _ctx.next){
                    case 0:
                        _ctx.next = 2;
                        return import("./test") // TWO
                        ;
                    case 2:
                        req = _ctx.sent;
                    case 3:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee);
        }))();
    };
    return cl1;
}();
export var obj = {
    m: _async_to_generator(regeneratorRuntime.mark(function _callee() {
        var req;
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    _ctx.next = 2;
                    return import("./test") // THREE
                    ;
                case 2:
                    req = _ctx.sent;
                case 3:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }))
};
export var cl2 = function cl2() {
    "use strict";
    _class_call_check(this, cl2);
    this.p = {
        m: _async_to_generator(regeneratorRuntime.mark(function _callee() {
            var req;
            return regeneratorRuntime.wrap(function _callee$(_ctx) {
                while(1)switch(_ctx.prev = _ctx.next){
                    case 0:
                        _ctx.next = 2;
                        return import("./test") // FOUR
                        ;
                    case 2:
                        req = _ctx.sent;
                    case 3:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee);
        }))
    };
};
export var l = function() {
    var _ref = _async_to_generator(regeneratorRuntime.mark(function _callee() {
        var req;
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    _ctx.next = 2;
                    return import("./test") // FIVE
                    ;
                case 2:
                    req = _ctx.sent;
                case 3:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return function l() {
        return _ref.apply(this, arguments);
    };
}();
