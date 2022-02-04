import regeneratorRuntime from "regenerator-runtime";
var _marked = regeneratorRuntime.mark(function() {
    var x;
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
                return _ctx.t0 = "abc", _ctx.next = 3, 10;
            case 3:
                _ctx.t1 = _ctx.sent, x = _ctx.t0.concat.call(_ctx.t0, _ctx.t1, "def");
            case 5:
            case "end":
                return _ctx.stop();
        }
    }, _marked);
});
