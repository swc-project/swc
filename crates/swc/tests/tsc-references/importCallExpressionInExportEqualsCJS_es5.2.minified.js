var fn;
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg), value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    info.done ? resolve(value) : Promise.resolve(value).then(_next, _throw);
}
import regeneratorRuntime from "regenerator-runtime";
module.exports = 42, fn = regeneratorRuntime.mark(function _callee() {
    var something;
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
                return _ctx.next = 2, import("./something");
            case 2:
                something = _ctx.sent;
            case 3:
            case "end":
                return _ctx.stop();
        }
    }, _callee);
}), module.exports = function() {
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
