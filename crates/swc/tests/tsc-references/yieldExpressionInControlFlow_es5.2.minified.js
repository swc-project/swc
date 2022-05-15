import regeneratorRuntime from "regenerator-runtime";
var _marked = regeneratorRuntime.mark(g), _marked1 = regeneratorRuntime.mark(f);
function f() {
    var o;
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
            case 1:
                return _ctx.next = 4, o;
            case 4:
                o = _ctx.sent, _ctx.next = 1;
                break;
            case 7:
            case "end":
                return _ctx.stop();
        }
    }, _marked1);
}
function g() {
    var o;
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
                o = [];
            case 1:
                return _ctx.delegateYield(o, "t0", 3);
            case 3:
                o = _ctx.t0, _ctx.next = 1;
                break;
            case 6:
            case "end":
                return _ctx.stop();
        }
    }, _marked);
}
