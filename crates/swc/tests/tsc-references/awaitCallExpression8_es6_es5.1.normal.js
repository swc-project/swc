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
                    _ctx.next = 3;
                    return po;
                case 3:
                    b = _ctx.sent.fn(a, a, a);
                    after();
                case 5:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _func.apply(this, arguments);
}
