import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import regeneratorRuntime from "regenerator-runtime";
export function fn() {
    return _fn.apply(this, arguments);
}
function _fn() {
    return (_fn = _async_to_generator(regeneratorRuntime.mark(function _callee() {
        var req;
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    return _ctx.next = 2, import("./test");
                case 2:
                    req = _ctx.sent;
                case 3:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }))).apply(this, arguments);
}
export var cl1 = function() {
    "use strict";
    function cl1() {
        _class_call_check(this, cl1);
    }
    return cl1.prototype.m = function() {
        return _async_to_generator(regeneratorRuntime.mark(function _callee() {
            var req;
            return regeneratorRuntime.wrap(function(_ctx) {
                for(;;)switch(_ctx.prev = _ctx.next){
                    case 0:
                        return _ctx.next = 2, import("./test");
                    case 2:
                        req = _ctx.sent;
                    case 3:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee);
        }))();
    }, cl1;
}();
export var obj = {
    m: _async_to_generator(regeneratorRuntime.mark(function _callee() {
        var req;
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    return _ctx.next = 2, import("./test");
                case 2:
                    req = _ctx.sent;
                case 3:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }))
};
export var cl2 = function() {
    "use strict";
    _class_call_check(this, cl2), this.p = {
        m: _async_to_generator(regeneratorRuntime.mark(function _callee() {
            var req;
            return regeneratorRuntime.wrap(function(_ctx) {
                for(;;)switch(_ctx.prev = _ctx.next){
                    case 0:
                        return _ctx.next = 2, import("./test");
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
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    return _ctx.next = 2, import("./test");
                case 2:
                    req = _ctx.sent;
                case 3:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return function() {
        return _ref.apply(this, arguments);
    };
}();
