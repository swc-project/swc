import regeneratorRuntime from "regenerator-runtime";
var _marked = regeneratorRuntime.mark(foo);
// @target: es6
function foo() {
    return regeneratorRuntime.wrap(function foo$(_ctx) {
        while(1)switch(_ctx.prev = _ctx.next){
            case 0:
                _ctx.next = 2;
                return;
            case 2:
                _ctx.next = 4;
                return;
            case 4:
            case "end":
                return _ctx.stop();
        }
    }, _marked);
}
