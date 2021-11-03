import regeneratorRuntime from "regenerator-runtime";
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
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
var A = function A() {
    "use strict";
    _classCallCheck(this, A);
    var _this = this;
    // @target: es5
    // @lib: esnext, dom
    // @downlevelIteration: true
    // https://github.com/Microsoft/TypeScript/issues/24722
    this.b = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var _len, args, _key, obj, _args = arguments;
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    for(_len = _args.length, args = new Array(_len), _key = 0; _key < _len; _key++){
                        args[_key] = _args[_key];
                    }
                    _ctx.next = 3;
                    return Promise.resolve();
                case 3:
                    obj = _defineProperty({
                    }, "a", function() {
                        return _this;
                    }); // computed property name after `await` triggers case
                case 4:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }).bind(this)).bind(this);
};
