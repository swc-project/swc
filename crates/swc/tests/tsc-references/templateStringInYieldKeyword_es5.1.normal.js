// @target: es6
import regeneratorRuntime from "regenerator-runtime";
var _marked = /*#__PURE__*/ regeneratorRuntime.mark(gen);
function gen() {
    var x;
    return regeneratorRuntime.wrap(function gen$(_ctx) {
        while(1)switch(_ctx.prev = _ctx.next){
            case 0:
                _ctx.next = 2;
                return "abc".concat(x, "def");
            case 2:
                x = _ctx.sent;
            case 3:
            case "end":
                return _ctx.stop();
        }
    }, _marked);
}
