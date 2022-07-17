// @noEmit: true
// @allowJs: true
// @checkJs: true
// @noImplicitAny: true
// @lib: esnext
// @Filename: bug25149.js
import regeneratorRuntime from "regenerator-runtime";
var _marked = regeneratorRuntime.mark(g);
var _marked1 = regeneratorRuntime.mark(f);
function f() {
    var o;
    return regeneratorRuntime.wrap(function f$(_ctx) {
        while(1)switch(_ctx.prev = _ctx.next){
            case 0:
                ;
            case 1:
                if (!true) {
                    _ctx.next = 7;
                    break;
                }
                _ctx.next = 4;
                return o;
            case 4:
                o = _ctx.sent;
                _ctx.next = 1;
                break;
            case 7:
            case "end":
                return _ctx.stop();
        }
    }, _marked1);
}
// @Filename: alsoFails.ts
// fails in Typescript too
function g() {
    var o;
    return regeneratorRuntime.wrap(function g$(_ctx) {
        while(1)switch(_ctx.prev = _ctx.next){
            case 0:
                o = [];
            case 1:
                if (!true) {
                    _ctx.next = 6;
                    break;
                }
                return _ctx.delegateYield(o, "t0", 3);
            case 3:
                o = _ctx.t0;
                _ctx.next = 1;
                break;
            case 6:
            case "end":
                return _ctx.stop();
        }
    }, _marked);
}
