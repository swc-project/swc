import _async_to_generator from "@swc/helpers/lib/_async_to_generator.js";
import regeneratorRuntime from "regenerator-runtime";
function func() {
    return _func.apply(this, arguments);
}
function _func() {
    _func = _async_to_generator(regeneratorRuntime.mark(function _callee() {
        var b;
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    before();
                    _ctx.next = 3;
                    return p;
                case 3:
                    _ctx.t0 = _ctx.sent;
                    if (_ctx.t0) {
                        _ctx.next = 6;
                        break;
                    }
                    _ctx.t0 = a;
                case 6:
                    b = _ctx.t0;
                    after();
                case 8:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _func.apply(this, arguments);
}
