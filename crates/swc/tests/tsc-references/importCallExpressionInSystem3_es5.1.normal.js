import _async_to_generator from "@swc/helpers/lib/_async_to_generator.js";
import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
import regeneratorRuntime from "regenerator-runtime";
// @module: system
// @target: esnext
// @filename: 0.ts
export var B = /*#__PURE__*/ function() {
    "use strict";
    function B() {
        _class_call_check(this, B);
    }
    var _proto = B.prototype;
    _proto.print = function print() {
        return "I am B";
    };
    return B;
}();
function foo() {
    return _foo.apply(this, arguments);
}
function _foo() {
    _foo = // @filename: 2.ts
    _async_to_generator(regeneratorRuntime.mark(function _callee() {
        var C, c;
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    _ctx.t0 = function(_B) {
                        "use strict";
                        _inherits(C, _B);
                        var _super = _create_super(C);
                        function C() {
                            _class_call_check(this, C);
                            return _super.apply(this, arguments);
                        }
                        return C;
                    };
                    _ctx.next = 3;
                    return import("./0");
                case 3:
                    _ctx.t1 = _ctx.sent.B;
                    C = /*#__PURE__*/ (0, _ctx.t0)(_ctx.t1);
                    c = new C();
                    c.print();
                case 7:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _foo.apply(this, arguments);
}
foo();
