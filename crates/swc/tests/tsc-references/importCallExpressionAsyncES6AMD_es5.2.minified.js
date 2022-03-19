import * as swcHelpers from "@swc/helpers";
import regeneratorRuntime from "regenerator-runtime";
export function fn() {
    return _fn.apply(this, arguments);
}
function _fn() {
    return (_fn = swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var req;
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    return _ctx.next = 2, import('./test');
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
        swcHelpers.classCallCheck(this, cl1);
    }
    return cl1.prototype.m = function() {
        return swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee() {
            var req;
            return regeneratorRuntime.wrap(function(_ctx) {
                for(;;)switch(_ctx.prev = _ctx.next){
                    case 0:
                        return _ctx.next = 2, import('./test');
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
    m: swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var req;
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    return _ctx.next = 2, import('./test');
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
    swcHelpers.classCallCheck(this, cl2), this.p = {
        m: swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee() {
            var req;
            return regeneratorRuntime.wrap(function(_ctx) {
                for(;;)switch(_ctx.prev = _ctx.next){
                    case 0:
                        return _ctx.next = 2, import('./test');
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
    var _ref = swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var req;
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    return _ctx.next = 2, import('./test');
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
