import * as swcHelpers from "@swc/helpers";
import regeneratorRuntime from "regenerator-runtime";
var C = // @target: ES6
// @noEmitHelpers: true
/*#__PURE__*/ function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    var _proto = C.prototype;
    _proto.method = function method() {
        var other = function other() {};
        var _this = this, _arguments = arguments;
        var fn = function() {
            var _ref = swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                return regeneratorRuntime.wrap(function _callee$(_ctx) {
                    while(1)switch(_ctx.prev = _ctx.next){
                        case 0:
                            _ctx.next = 2;
                            return other.apply(_this, _arguments);
                        case 2:
                            return _ctx.abrupt("return", _ctx.sent);
                        case 3:
                        case "end":
                            return _ctx.stop();
                    }
                }, _callee);
            }));
            return function fn() {
                return _ref.apply(this, arguments);
            };
        }();
    };
    return C;
}();
