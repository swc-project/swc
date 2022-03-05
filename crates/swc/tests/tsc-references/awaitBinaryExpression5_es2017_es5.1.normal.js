import * as swcHelpers from "@swc/helpers";
import regeneratorRuntime from "regenerator-runtime";
function func() {
    return _func.apply(this, arguments);
}
function _func() {
    _func = swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var o;
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    before();
                    ;
                    _ctx.next = 4;
                    return p;
                case 4:
                    o.a = _ctx.sent;
                    after();
                case 6:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _func.apply(this, arguments);
}
