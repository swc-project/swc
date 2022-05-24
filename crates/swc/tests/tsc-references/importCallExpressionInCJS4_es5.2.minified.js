import _async_to_generator from "@swc/helpers/lib/_async_to_generator.js";
import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
import regeneratorRuntime from "regenerator-runtime";
export var B = function() {
    "use strict";
    function B() {
        _class_call_check(this, B);
    }
    return B.prototype.print = function() {
        return "I am B";
    }, B;
}();
function _foo() {
    return (_foo = _async_to_generator(regeneratorRuntime.mark(function _callee() {
        var C, c;
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    return _ctx.t0 = function(_B) {
                        "use strict";
                        _inherits(C, _B);
                        var _super = _create_super(C);
                        function C() {
                            return _class_call_check(this, C), _super.apply(this, arguments);
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
