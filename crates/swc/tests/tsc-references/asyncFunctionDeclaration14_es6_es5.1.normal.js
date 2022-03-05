import * as swcHelpers from "@swc/helpers";
import regeneratorRuntime from "regenerator-runtime";
function foo() {
    return _foo.apply(this, arguments);
}
function _foo() {
    _foo = // @target: ES6
    // @noEmitHelpers: true
    swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    return _ctx.abrupt("return");
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _foo.apply(this, arguments);
}
