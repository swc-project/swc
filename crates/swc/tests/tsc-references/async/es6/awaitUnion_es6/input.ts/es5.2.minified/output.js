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
function _f() {
    return (_f = (function(fn) {
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
        var await_a, await_b, await_c, await_d, await_e;
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    return _ctx.next = 2, a;
                case 2:
                    return await_a = _ctx.sent, _ctx.next = 5, b;
                case 5:
                    return await_b = _ctx.sent, _ctx.next = 8, c;
                case 8:
                    return await_c = _ctx.sent, _ctx.next = 11, d;
                case 11:
                    return await_d = _ctx.sent, _ctx.next = 14, e;
                case 14:
                    await_e = _ctx.sent;
                case 15:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }))).apply(this, arguments);
}
