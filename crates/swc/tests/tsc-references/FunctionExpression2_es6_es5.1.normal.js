// @target: es6
import regeneratorRuntime from "regenerator-runtime";
var v = regeneratorRuntime.mark(function foo() {
    return regeneratorRuntime.wrap(function foo$(_ctx) {
        while(1)switch(_ctx.prev = _ctx.next){
            case 0:
            case "end":
                return _ctx.stop();
        }
    }, foo);
});
