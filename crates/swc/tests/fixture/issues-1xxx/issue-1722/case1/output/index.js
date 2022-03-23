import * as swcHelpers from "@swc/helpers";
import regeneratorRuntime from "regenerator-runtime";
(function() {
    var _main = swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    console.log(1);
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    function main() {
        return _main.apply(this, arguments);
    }
    return main;
})()();
