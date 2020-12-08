var regeneratorRuntime = require("regenerator-runtime");
var _marked = regeneratorRuntime.mark(foo);
function foo() {
    var val;
    return regeneratorRuntime.wrap(function foo$(_ctx) {
        while(1)switch(_ctx.prev = _ctx.next){
            case 0:
                if (!true) {
                    _ctx.next = 4;
                    break;
                }
                _ctx.t0 = 1;
                _ctx.next = 7;
                break;
            case 4:
                _ctx.next = 6;
                return 0;
            case 6:
                _ctx.t0 = _ctx.sent;
            case 7:
                val = _ctx.t0;
                console.log({
                    val: val
                });
            case 9:
            case "end":
                return _ctx.stop();
        }
    }, _marked);
}
var v = foo();
console.log(v.next());
