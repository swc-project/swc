import regeneratorRuntime from "regenerator-runtime";
var _marked = regeneratorRuntime.mark(function() {
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
                return _ctx.next = 2, function(x) {
                    return x.length;
                };
            case 2:
                return _ctx.delegateYield([
                    function(x) {
                        return x.length;
                    }
                ], "t0", 3);
            case 3:
                return _ctx.abrupt("return", function(x) {
                    return x.length;
                });
            case 4:
            case "end":
                return _ctx.stop();
        }
    }, _marked);
});
