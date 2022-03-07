import * as swcHelpers from "@swc/helpers";
import regeneratorRuntime from "regenerator-runtime";
export var B = function() {
    "use strict";
    function B() {
        swcHelpers.classCallCheck(this, B);
    }
    return B.prototype.print = function() {
        return "I am B";
    }, B;
}();
function _foo() {
    return (_foo = swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var C, c;
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    return _ctx.t0 = function(_B) {
                        "use strict";
                        swcHelpers.inherits(C, _B);
                        var _super = swcHelpers.createSuper(C);
                        function C() {
                            return swcHelpers.classCallCheck(this, C), _super.apply(this, arguments);
                        }
                        return C;
                    }, _ctx.next = 3, import("./0");
                case 3:
                    _ctx.t1 = _ctx.sent.B, (c = new (C = (0, _ctx.t0)(_ctx.t1))()).print();
                case 7:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }))).apply(this, arguments);
}
!function() {
    return _foo.apply(this, arguments);
}();
