import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import regeneratorRuntime from "regenerator-runtime";
// @allowJs: true
// @checkJs: true
// @noEmit: true
// @target: es2017
// @filename: file.js
// Error (good)
/** @type {function(): string} */ var a = function() {
    return 0;
};
// Error (good)
/** @type {function(): string} */ var b = function() {
    var _ref = _async_to_generator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    return _ctx.abrupt("return", 0);
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return function b() {
        return _ref.apply(this, arguments);
    };
}();
// No error (bad)
/** @type {function(): string} */ var c = function() {
    var _ref = _async_to_generator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    return _ctx.abrupt("return", 0);
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return function c() {
        return _ref.apply(this, arguments);
    };
}();
/** @type {function(function(): string): void} */ var f = function(p) {};
// Error (good)
f(_async_to_generator(regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_ctx) {
        while(1)switch(_ctx.prev = _ctx.next){
            case 0:
                return _ctx.abrupt("return", 0);
            case 1:
            case "end":
                return _ctx.stop();
        }
    }, _callee);
})));
