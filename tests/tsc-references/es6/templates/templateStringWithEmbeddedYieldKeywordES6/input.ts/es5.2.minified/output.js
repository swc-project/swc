import regeneratorRuntime from "regenerator-runtime";
var _marked = regeneratorRuntime.mark(function() {
    var x;
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
                return _ctx.next = 2, 10;
            case 2:
                x = "abc".concat.call("abc", _ctx.sent, "def");
            case 3:
            case "end":
                return _ctx.stop();
        }
    }, _marked);
});
