import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
import regeneratorRuntime from "regenerator-runtime";
var _marked = regeneratorRuntime.mark(g);
//@target: ES6
function g() {
    var x;
    return regeneratorRuntime.wrap(function g$(_ctx) {
        while(1)switch(_ctx.prev = _ctx.next){
            case 0:
                _ctx.t0 = /*#__PURE__*/ function(_superClass) {
                    "use strict";
                    _inherits(C, _superClass);
                    var _super = _create_super(C);
                    function C() {
                        _class_call_check(this, C);
                        return _super.apply(this, arguments);
                    }
                    return C;
                };
                _ctx.next = 3;
                return;
            case 3:
                _ctx.t1 = _ctx.sent;
                x = (0, _ctx.t0)(_ctx.t1);
            case 5:
            case "end":
                return _ctx.stop();
        }
    }, _marked);
}
