import * as swcHelpers from "@swc/helpers";
import regeneratorRuntime from "regenerator-runtime";
//@target: ES6
var Foo = function Foo() {
    "use strict";
    swcHelpers.classCallCheck(this, Foo);
};
var Bar = /*#__PURE__*/ function(Foo) {
    "use strict";
    swcHelpers.inherits(Bar, Foo);
    var _super = swcHelpers.createSuper(Bar);
    function Bar() {
        swcHelpers.classCallCheck(this, Bar);
        return _super.apply(this, arguments);
    }
    return Bar;
}(Foo);
var Baz = function Baz() {
    "use strict";
    swcHelpers.classCallCheck(this, Baz);
};
var g3 = regeneratorRuntime.mark(function g3() {
    return regeneratorRuntime.wrap(function g3$(_ctx) {
        while(1)switch(_ctx.prev = _ctx.next){
            case 0:
                _ctx.next = 2;
                return;
            case 2:
                _ctx.next = 4;
                return new Bar;
            case 4:
                _ctx.next = 6;
                return new Baz;
            case 6:
                return _ctx.delegateYield([
                    new Bar
                ], "t0", 7);
            case 7:
                return _ctx.delegateYield([
                    new Baz
                ], "t1", 8);
            case 8:
            case "end":
                return _ctx.stop();
        }
    }, g3);
});
