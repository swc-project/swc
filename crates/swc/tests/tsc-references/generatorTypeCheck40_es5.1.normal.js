import * as swcHelpers from "@swc/helpers";
import regeneratorRuntime from "regenerator-runtime";
var _marked = regeneratorRuntime.mark(g);
//@target: ES6
function g() {
    var C;
    return regeneratorRuntime.wrap(function g$(_ctx) {
        while(1)switch(_ctx.prev = _ctx.next){
            case 0:
                _ctx.t0 = function(_superClass) {
                    "use strict";
                    swcHelpers.inherits(C, _superClass);
                    var _super = swcHelpers.createSuper(C);
                    function C() {
                        swcHelpers.classCallCheck(this, C);
                        return _super.apply(this, arguments);
                    }
                    return C;
                };
                _ctx.next = 3;
                return 0;
            case 3:
                _ctx.t1 = _ctx.sent;
                C = /*#__PURE__*/ (0, _ctx.t0)(_ctx.t1);
            case 5:
            case "end":
                return _ctx.stop();
        }
    }, _marked);
}
