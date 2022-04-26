import * as swcHelpers from "@swc/helpers";
import regeneratorRuntime from "regenerator-runtime";
function foo() {
    return _foo.apply(this, arguments);
}
function _foo() {
    _foo = swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var tmp, ref, ref;
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    tmp = baz.bar, ref = tmp === void 0 ? {} : tmp, ref = ref !== null ? ref : swcHelpers._throw(new TypeError("Cannot destructure undefined"));
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _foo.apply(this, arguments);
}
