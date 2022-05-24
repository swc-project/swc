import _async_to_generator from "@swc/helpers/lib/_async_to_generator.js";
import regeneratorRuntime from "regenerator-runtime";
var x = new Promise(function(resolve, reject) {
    resolve({});
});
export default x;
_async_to_generator(regeneratorRuntime.mark(function _callee() {
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
