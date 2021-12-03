import regeneratorRuntime from "regenerator-runtime";
regeneratorRuntime.mark(function foo() {
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
            case "end":
                return _ctx.stop();
        }
    }, foo);
});
