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
// @module: commonjs
// @target: esnext
// @filename: 0.ts
export function foo() {
    return "foo";
}
// @filename: 1.ts
export function backup() {
    return "backup";
}
function compute(promise) {
    return _compute.apply(this, arguments);
}
function _compute() {
    _compute = // @filename: 2.ts
    _asyncToGenerator(regeneratorRuntime.mark(function _callee(promise) {
        var j;
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    _ctx.next = 2;
                    return promise;
                case 2:
                    j = _ctx.sent;
                    if (j) {
                        _ctx.next = 8;
                        break;
                    }
                    _ctx.next = 6;
                    return import("./1");
                case 6:
                    j = _ctx.sent;
                    return _ctx.abrupt("return", j.backup());
                case 8:
                    return _ctx.abrupt("return", j.foo());
                case 9:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _compute.apply(this, arguments);
}
compute(import("./0"));
