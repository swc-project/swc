import * as swcHelpers from "@swc/helpers";
import regeneratorRuntime from "regenerator-runtime";
function lol() {
    return _lol.apply(this, arguments);
}
function _lol() {
    _lol = swcHelpers.wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    _ctx.next = 2;
                    return 1;
                case 2:
                    _ctx.next = 4;
                    return 2;
                case 4:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _lol.apply(this, arguments);
}
