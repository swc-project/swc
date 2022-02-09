function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg), value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    info.done ? resolve(value) : Promise.resolve(value).then(_next, _throw);
}
function _asyncToGenerator(fn1) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn1.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(void 0);
        });
    };
}
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
import regeneratorRuntime from "regenerator-runtime";
export function fn() {
    return _fn.apply(this, arguments);
}
function _fn() {
    return (_fn = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
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
    var Constructor, protoProps, staticProps;
    function cl1() {
        _classCallCheck(this, cl1);
    }
    return Constructor = cl1, protoProps = [
        {
            key: "m",
            value: function() {
                return _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
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
            }
        }
    ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), cl1;
}();
export var obj = {
    m: _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
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
    _classCallCheck(this, cl2), this.p = {
        m: _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
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
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
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
