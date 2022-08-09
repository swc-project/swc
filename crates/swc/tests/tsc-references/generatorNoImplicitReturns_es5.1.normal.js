// @target: esnext 
// @noImplicitReturns: true 
// @strictNullChecks: false 
import regeneratorRuntime from "regenerator-runtime";
var _marked = regeneratorRuntime.mark(testGenerator);
function testGenerator() {
    return regeneratorRuntime.wrap(function testGenerator$(_ctx) {
        while(1)switch(_ctx.prev = _ctx.next){
            case 0:
                if (!(Math.random() > 0.5)) {
                    _ctx.next = 2;
                    break;
                }
                return _ctx.abrupt("return");
            case 2:
                _ctx.next = 4;
                return "hello";
            case 4:
            case "end":
                return _ctx.stop();
        }
    }, _marked);
}
