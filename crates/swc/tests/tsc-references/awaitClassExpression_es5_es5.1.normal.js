import * as swcHelpers from "@swc/helpers";
import regeneratorRuntime from "regenerator-runtime";
function func() {
    return _func.apply(this, arguments);
}
function _func() {
    _func = swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var D;
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    _ctx.t0 = /*#__PURE__*/ function(_superClass) {
                        "use strict";
                        swcHelpers.inherits(D, _superClass);
                        var _super = swcHelpers.createSuper(D);
                        function D() {
                            swcHelpers.classCallCheck(this, D);
                            return _super.apply(this, arguments);
                        }
                        return D;
                    };
                    _ctx.next = 3;
                    return p;
                case 3:
                    _ctx.t1 = _ctx.sent;
                    D = (0, _ctx.t0)(_ctx.t1);
                case 5:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _func.apply(this, arguments);
}
