// @target: esnext
// @strictNullChecks: true
// @noImplicitReturns: true
// @noImplicitAny: true
import regeneratorRuntime from "regenerator-runtime";
var _marked = regeneratorRuntime.mark(g4);
var _marked1 = regeneratorRuntime.mark(g3);
var _marked2 = regeneratorRuntime.mark(g2);
var _marked3 = regeneratorRuntime.mark(g1);
function g1() {
    var x;
    return regeneratorRuntime.wrap(function g1$(_ctx) {
        while(1)switch(_ctx.prev = _ctx.next){
            case 0:
                _ctx.next = 2;
                return;
            case 2:
                _ctx.next = 4;
                return "a";
            case 4:
                _ctx.next = 6;
                return 1;
            case 6:
                x = _ctx.sent;
                return _ctx.abrupt("return", 10);
            case 8:
            case "end":
                return _ctx.stop();
        }
    }, _marked3);
}
function g2() {
    var x;
    return regeneratorRuntime.wrap(function g2$(_ctx) {
        while(1)switch(_ctx.prev = _ctx.next){
            case 0:
                _ctx.next = 2;
                return 1;
            case 2:
                x = _ctx.sent;
                return _ctx.abrupt("return", true);
            case 4:
            case "end":
                return _ctx.stop();
        }
    }, _marked2);
}
function g3() {
    var x;
    return regeneratorRuntime.wrap(function g3$(_ctx) {
        while(1)switch(_ctx.prev = _ctx.next){
            case 0:
                return _ctx.delegateYield(generator, "t0", 1);
            case 1:
                x = _ctx.t0;
                return _ctx.abrupt("return", true);
            case 3:
            case "end":
                return _ctx.stop();
        }
    }, _marked1);
}
function g4() {
    var x;
    return regeneratorRuntime.wrap(function g4$(_ctx) {
        while(1)switch(_ctx.prev = _ctx.next){
            case 0:
                return _ctx.delegateYield(generator, "t0", 1);
            case 1:
                x = _ctx.t0;
                return _ctx.abrupt("return", true);
            case 3:
            case "end":
                return _ctx.stop();
        }
    }, _marked);
}
