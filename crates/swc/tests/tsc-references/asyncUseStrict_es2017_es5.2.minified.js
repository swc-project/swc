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
function _func() {
    var fn;
    return (_func = (fn = regeneratorRuntime.mark(function _callee() {
        var b;
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    "use strict";
                    return _ctx.next = 3, p;
                case 3:
                    if (_ctx.t0 = _ctx.sent, _ctx.t0) {
                        _ctx.next = 6;
                        break;
                    }
                    _ctx.t0 = a;
                case 6:
                    b = _ctx.t0;
                case 7:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }), function() {
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
    })).apply(this, arguments);
}
