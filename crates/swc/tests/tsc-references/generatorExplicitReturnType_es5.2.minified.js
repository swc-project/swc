import regeneratorRuntime from "regenerator-runtime";
var _marked = regeneratorRuntime.mark(g4), _marked1 = regeneratorRuntime.mark(g3), _marked2 = regeneratorRuntime.mark(g2), _marked3 = regeneratorRuntime.mark(g1);
function g1() {
    var x;
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
                _ctx.next = 2;
                return;
            case 2:
                return _ctx.next = 4, "a";
            case 4:
                return _ctx.next = 6, 1;
            case 6:
                return x = _ctx.sent, _ctx.abrupt("return", 10);
            case 8:
            case "end":
                return _ctx.stop();
        }
    }, _marked3);
}
function g2() {
    var x;
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
                return _ctx.next = 2, 1;
            case 2:
                return x = _ctx.sent, _ctx.abrupt("return", !0);
            case 4:
            case "end":
                return _ctx.stop();
        }
    }, _marked2);
}
function g3() {
    var x;
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
                return _ctx.delegateYield(generator, "t0", 1);
            case 1:
                return x = _ctx.t0, _ctx.abrupt("return", !0);
            case 3:
            case "end":
                return _ctx.stop();
        }
    }, _marked1);
}
function g4() {
    var x;
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
                return _ctx.delegateYield(generator, "t0", 1);
            case 1:
                return x = _ctx.t0, _ctx.abrupt("return", !0);
            case 3:
            case "end":
                return _ctx.stop();
        }
    }, _marked);
}
