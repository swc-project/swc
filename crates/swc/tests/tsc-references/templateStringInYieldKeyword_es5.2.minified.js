import regeneratorRuntime from "regenerator-runtime";
var _marked = regeneratorRuntime.mark(gen);
function gen() {
    var x;
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
                return _ctx.next = 2, "abc".concat(x, "def");
            case 2:
                x = _ctx.sent;
            case 3:
            case "end":
                return _ctx.stop();
        }
    }, _marked);
}
