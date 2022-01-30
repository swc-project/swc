import * as swcHelpers1 from "@swc/helpers";
import regeneratorRuntime from "regenerator-runtime";
function foo() {
    return _foo.apply(this, arguments);
}
function _foo() {
    _foo = swcHelpers1.asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _foo.apply(this, arguments);
}
var swcHelpers = 1;
