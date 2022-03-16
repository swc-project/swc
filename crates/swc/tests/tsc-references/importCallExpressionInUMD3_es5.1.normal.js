import * as swcHelpers from "@swc/helpers";
import regeneratorRuntime from "regenerator-runtime";
// @module: umd
// @target: esnext
// @filename: 0.ts
export var B = /*#__PURE__*/ function() {
    "use strict";
    function B() {
        swcHelpers.classCallCheck(this, B);
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
    swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var C, c;
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    _ctx.t0 = function(_B) {
                        "use strict";
                        swcHelpers.inherits(C, _B);
                        var _super = swcHelpers.createSuper(C);
                        function C() {
                            swcHelpers.classCallCheck(this, C);
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
