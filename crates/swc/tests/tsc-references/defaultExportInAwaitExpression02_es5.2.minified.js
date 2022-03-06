import * as swcHelpers from "@swc/helpers";
import regeneratorRuntime from "regenerator-runtime";
var x = new Promise(function(resolve, reject) {
    resolve({});
});
export default x;
swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee() {
    var value;
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
                return _ctx.next = 2, x;
            case 2:
                value = _ctx.sent;
            case 3:
            case "end":
                return _ctx.stop();
        }
    }, _callee);
}))();
