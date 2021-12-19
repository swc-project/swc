import regeneratorRuntime from "regenerator-runtime";
// @target: es6
var v = {
    foo: regeneratorRuntime.mark(function foo1() {
        return regeneratorRuntime.wrap(function foo$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    _ctx.next = 2;
                    return foo;
                case 2:
                case "end":
                    return _ctx.stop();
            }
        }, foo1);
    })
};
