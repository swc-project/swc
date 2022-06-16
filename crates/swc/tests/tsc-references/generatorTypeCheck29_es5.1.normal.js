import regeneratorRuntime from "regenerator-runtime";
var _marked = regeneratorRuntime.mark(g2);
//@target: ES6
function g2() {
    return regeneratorRuntime.wrap(function g2$(_ctx) {
        while(1)switch(_ctx.prev = _ctx.next){
            case 0:
                _ctx.next = 2;
                return regeneratorRuntime.mark(function _callee() {
                    return regeneratorRuntime.wrap(function _callee$(_ctx) {
                        while(1)switch(_ctx.prev = _ctx.next){
                            case 0:
                                _ctx.next = 2;
                                return function(x) {
                                    return x.length;
                                };
                            case 2:
                            case "end":
                                return _ctx.stop();
                        }
                    }, _callee);
                })();
            case 2:
            case "end":
                return _ctx.stop();
        }
    }, _marked);
}
