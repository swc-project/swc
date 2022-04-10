import * as swcHelpers from "@swc/helpers";
import regeneratorRuntime from "regenerator-runtime";
var C = function() {
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    return C.prototype.method = function() {
        var other = function() {}, _this = this, _arguments = arguments;
        swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function(_ctx) {
                for(;;)switch(_ctx.prev = _ctx.next){
                    case 0:
                        return _ctx.next = 2, other.apply(_this, _arguments);
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
