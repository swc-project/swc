// @target: es6
import regeneratorRuntime from "regenerator-runtime";
var _marked = regeneratorRuntime.mark(foo);
function foo() {
    return regeneratorRuntime.wrap(function foo$(_ctx) {
        while(1)switch(_ctx.prev = _ctx.next){
            case 0:
                return _ctx.delegateYield(foo, "t0", 1);
            case 1:
            case "end":
                return _ctx.stop();
        }
    }, _marked);
}
