import * as swcHelpers from "@swc/helpers";
import regeneratorRuntime from "regenerator-runtime";
var _marked = regeneratorRuntime.mark(g), Foo = function() {
    "use strict";
    swcHelpers.classCallCheck(this, Foo);
}, Bar = function(Foo1) {
    "use strict";
    swcHelpers.inherits(Bar, Foo1);
    var _super = swcHelpers.createSuper(Bar);
    function Bar() {
        return swcHelpers.classCallCheck(this, Bar), _super.apply(this, arguments);
    }
    return Bar;
}(Foo);
function g() {
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
                _ctx.next = 2;
                return;
            case 2:
                return _ctx.delegateYield([
                    new Bar
                ], "t0", 3);
            case 3:
            case "end":
                return _ctx.stop();
        }
    }, _marked);
}
