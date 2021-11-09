import regeneratorRuntime from "regenerator-runtime";
// @target: es6
var v = {
    foo: regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    _ctx.next = 2;
                    return foo;
                case 2:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    })
};
