import * as swcHelpers from "@swc/helpers";
import regeneratorRuntime from "regenerator-runtime";
var _marked = regeneratorRuntime.mark(g);
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
function g() {
    return regeneratorRuntime.wrap(function g$(_ctx) {
        while(1)switch(_ctx.prev = _ctx.next){
            case 0:
                _ctx.next = 2;
                return;
            case 2:
                _ctx.next = 4;
                return new Bar;
            case 4:
            case "end":
                return _ctx.stop();
        }
    }, _marked);
}
