import * as swcHelpers from "@swc/helpers";
import regeneratorRuntime from "regenerator-runtime";
function fn() {
    return _fn.apply(this, arguments);
}
function _fn() {
    _fn = swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var key;
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    for(key in {});
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _fn.apply(this, arguments);
}
