// @target: ES6
import regeneratorRuntime from "regenerator-runtime";
var _marked = regeneratorRuntime.mark(gen);
function gen() {
    var x;
    return regeneratorRuntime.wrap(function gen$(_ctx) {
        while(1)switch(_ctx.prev = _ctx.next){
            case 0:
                _ctx.t0 = "abc";
                _ctx.next = 3;
                return 10;
            case 3:
                _ctx.t1 = _ctx.sent;
                x = _ctx.t0.concat.call(_ctx.t0, _ctx.t1, "def");
            case 5:
            case "end":
                return _ctx.stop();
        }
    }, _marked);
}
