import regeneratorRuntime from "regenerator-runtime";
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg), value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    info.done ? resolve(value) : Promise.resolve(value).then(_next, _throw);
}
function _defineProperty(obj, key, value) {
    return key in obj ? Object.defineProperty(obj, key, {
        value: value,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : obj[key] = value, obj;
}
var A = function() {
    "use strict";
    !function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }(this, A);
    var _this = this;
    this.b = (function(fn) {
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
                _next(void 0);
            });
        };
    })(regeneratorRuntime.mark(function _callee() {
        var _len, args, _key, obj, _args = arguments;
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    for(_len = _args.length, args = new Array(_len), _key = 0; _key < _len; _key++)args[_key] = _args[_key];
                    return _ctx.next = 3, Promise.resolve();
                case 3:
                    obj = _defineProperty({
                    }, "a", function() {
                        return _this;
                    });
                case 4:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }).bind(this)).bind(this);
};
