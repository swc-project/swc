import * as swcHelpers from "@swc/helpers";
import regeneratorRuntime from "regenerator-runtime";
module.exports = 42, module.exports = swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee() {
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
}));
