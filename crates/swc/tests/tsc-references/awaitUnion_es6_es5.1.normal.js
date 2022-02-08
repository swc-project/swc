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
function f() {
    return _f.apply(this, arguments);
}
function _f() {
    _f = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var await_a, await_b, await_c, await_d, await_e;
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    _ctx.next = 2;
                    return a;
                case 2:
                    await_a = _ctx.sent;
                    _ctx.next = 5;
                    return b;
                case 5:
                    await_b = _ctx.sent;
                    _ctx.next = 8;
                    return c;
                case 8:
                    await_c = _ctx.sent;
                    _ctx.next = 11;
                    return d;
                case 11:
                    await_d = _ctx.sent;
                    _ctx.next = 14;
                    return e;
                case 14:
                    await_e = _ctx.sent;
                case 15:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _f.apply(this, arguments);
}
