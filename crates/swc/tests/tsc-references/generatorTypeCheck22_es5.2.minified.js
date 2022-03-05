import * as swcHelpers from "@swc/helpers";
import regeneratorRuntime from "regenerator-runtime";
var _marked = regeneratorRuntime.mark(function() {
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
                _ctx.next = 2;
                return;
            case 2:
                return _ctx.next = 4, new Bar;
            case 4:
                return _ctx.next = 6, new Baz;
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
    }, _marked);
}), Foo = function() {
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
}(Foo), Baz = function() {
    "use strict";
    swcHelpers.classCallCheck(this, Baz);
};
