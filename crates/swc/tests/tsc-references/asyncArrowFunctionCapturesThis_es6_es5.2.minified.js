import * as swcHelpers from "@swc/helpers";
import regeneratorRuntime from "regenerator-runtime";
var C = function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    return C.prototype.method = function() {
        var _this = this;
        swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function(_ctx) {
                for(;;)switch(_ctx.prev = _ctx.next){
                    case 0:
                        return _ctx.next = 2, _this;
                    case 2:
                        return _ctx.abrupt("return", _ctx.sent);
                    case 3:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee);
        }));
    }, C;
}();
