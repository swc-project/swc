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
function func() {
    return _func.apply(this, arguments);
}
function _func() {
    _func = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var b;
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    before();
                    _ctx.t0 = fn;
                    _ctx.t1 = a;
                    _ctx.next = 5;
                    return p;
                case 5:
                    _ctx.t2 = _ctx.sent;
                    _ctx.t3 = a;
                    b = (0, _ctx.t0)(_ctx.t1, _ctx.t2, _ctx.t3);
                    after();
                case 9:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _func.apply(this, arguments);
}
