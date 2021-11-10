"use strict";
var _regeneratorRuntime = _interopRequireDefault(require("regenerator-runtime"));
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
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
_asyncToGenerator(_regeneratorRuntime.default.mark(function _callee() {
    var sleep, result;
    return _regeneratorRuntime.default.wrap(function _callee$(_ctx) {
        while(1)switch(_ctx.prev = _ctx.next){
            case 0:
                sleep = function() {
                    return new Promise(function(resolve) {
                        return setTimeout(function() {
                            return resolve(undefined);
                        }, 500);
                    });
                };
                _ctx.next = 3;
                return sleep();
            case 3:
                _ctx.t0 = _ctx.sent;
                if (_ctx.t0) {
                    _ctx.next = 6;
                    break;
                }
                _ctx.t0 = 'fallback';
            case 6:
                result = _ctx.t0;
                console.log(result);
            case 8:
            case "end":
                return _ctx.stop();
        }
    }, _callee);
}))();
