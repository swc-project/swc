function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _asyncToGenerator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
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
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
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
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
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
f(_asyncToGenerator(regeneratorRuntime.mark(function _callee() {
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
