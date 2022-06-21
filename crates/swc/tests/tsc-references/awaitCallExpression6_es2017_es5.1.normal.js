import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
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
                    _ctx.t0 = o;
                    _ctx.next = 4;
                    return p;
                case 4:
                    _ctx.t1 = _ctx.sent;
                    _ctx.t2 = a;
                    _ctx.t3 = a;
                    b = _ctx.t0.fn.call(_ctx.t0, _ctx.t1, _ctx.t2, _ctx.t3);
                    after();
                case 9:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _func.apply(this, arguments);
}
