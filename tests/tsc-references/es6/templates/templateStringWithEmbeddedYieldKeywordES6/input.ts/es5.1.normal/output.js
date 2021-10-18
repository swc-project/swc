import regeneratorRuntime from "regenerator-runtime";
var _marked = regeneratorRuntime.mark(gen);
// @target: ES6
function gen() {
    var x;
    return regeneratorRuntime.wrap(function gen$(_ctx) {
        while(1)switch(_ctx.prev = _ctx.next){
            case 0:
                _ctx.next = 2;
                return 10;
            case 2:
                x = "abc".concat.call("abc", _ctx.sent, "def");
            case 3:
            case "end":
                return _ctx.stop();
        }
    }, _marked);
}
