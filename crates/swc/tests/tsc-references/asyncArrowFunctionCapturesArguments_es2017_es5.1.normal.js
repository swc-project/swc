import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import regeneratorRuntime from "regenerator-runtime";
// @target: es2017
// @noEmitHelpers: true
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    _proto.method = function method() {
        var other = function other() {};
        var _this = this, _arguments = arguments;
        var fn = function() {
            var _ref = _async_to_generator(regeneratorRuntime.mark(function _callee() {
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
