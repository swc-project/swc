import regeneratorRuntime from "regenerator-runtime";
regeneratorRuntime.mark(function foo1() {
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
                return _ctx.next = 2, foo;
            case 2:
            case "end":
                return _ctx.stop();
        }
    }, foo1);
});
