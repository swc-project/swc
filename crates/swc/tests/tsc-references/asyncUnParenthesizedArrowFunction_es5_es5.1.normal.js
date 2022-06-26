import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import regeneratorRuntime from "regenerator-runtime";
var x = function() {
    var _ref = _async_to_generator(regeneratorRuntime.mark(function _callee(i) {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    _ctx.next = 2;
                    return someOtherFunction(i);
                case 2:
                    return _ctx.abrupt("return", _ctx.sent);
                case 3:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return function x(i) {
        return _ref.apply(this, arguments);
    };
}();
var x1 = function() {
    var _ref = _async_to_generator(regeneratorRuntime.mark(function _callee(i) {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    _ctx.next = 2;
                    return someOtherFunction(i);
                case 2:
                    return _ctx.abrupt("return", _ctx.sent);
                case 3:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return function x1(i) {
        return _ref.apply(this, arguments);
    };
}();
