// @target: ES6
// @module: umd
// @filename: a.ts
var x = new Promise(function(resolve, reject) {
    resolve({});
});
export default x;
// @filename: b.ts
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import regeneratorRuntime from "regenerator-runtime";
import x from "./a";
_async_to_generator(regeneratorRuntime.mark(function _callee() {
    var value;
    return regeneratorRuntime.wrap(function _callee$(_ctx) {
        while(1)switch(_ctx.prev = _ctx.next){
            case 0:
                _ctx.next = 2;
                return x;
            case 2:
                value = _ctx.sent;
            case 3:
            case "end":
                return _ctx.stop();
        }
    }, _callee);
}))();
