import * as swcHelpers from "@swc/helpers";
import regeneratorRuntime from "regenerator-runtime";
// @target: ES5
// @lib: es5,es2015.promise
// @noEmitHelpers: true
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    var _proto = C.prototype;
    _proto.method = function method() {
        var other = function other() {};
        function fn() {
            return _fn.apply(this, arguments);
        }
        function _fn() {
            _fn = swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                var _args = arguments;
                return regeneratorRuntime.wrap(function _callee$(_ctx) {
                    while(1)switch(_ctx.prev = _ctx.next){
                        case 0:
                            _ctx.next = 2;
                            return other.apply(this, _args);
                        case 2:
                        case "end":
                            return _ctx.stop();
                    }
                }, _callee, this);
            }));
            return _fn.apply(this, arguments);
        }
    };
    return C;
}();
