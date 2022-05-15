import regeneratorRuntime from "regenerator-runtime";
var _marked = regeneratorRuntime.mark(foo);
function foo() {
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
                _ctx.next = 2;
                return;
            case 2:
            case "end":
                return _ctx.stop();
        }
    }, _marked);
}
