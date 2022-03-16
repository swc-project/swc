import regeneratorRuntime from "regenerator-runtime";
foo("", regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
                return _ctx.next = 2, function(x) {
                    return x.length;
                };
            case 2:
            case "end":
                return _ctx.stop();
        }
    }, _callee);
}), function(p) {});
