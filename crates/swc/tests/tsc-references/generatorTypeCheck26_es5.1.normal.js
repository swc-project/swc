//@target: ES6
import regeneratorRuntime from "regenerator-runtime";
var _marked = /*#__PURE__*/ regeneratorRuntime.mark(g);
function g() {
    return regeneratorRuntime.wrap(function g$(_ctx) {
        while(1)switch(_ctx.prev = _ctx.next){
            case 0:
                _ctx.next = 2;
                return function(x) {
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
}
