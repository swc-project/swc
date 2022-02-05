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
export function foo() {
    return "foo";
}
export function backup() {
    return "backup";
}
function _compute() {
    var fn;
    return (_compute = (fn = regeneratorRuntime.mark(function _callee(promise) {
        var j;
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    return _ctx.next = 2, promise;
                case 2:
                    if (j = _ctx.sent) {
                        _ctx.next = 8;
                        break;
                    }
                    return _ctx.next = 6, import("./1");
                case 6:
                    return j = _ctx.sent, _ctx.abrupt("return", j.backup());
                case 8:
                    return _ctx.abrupt("return", j.foo());
                case 9:
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
!function(promise) {
    return _compute.apply(this, arguments);
}(import("./0"));
