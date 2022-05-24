import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
import regeneratorRuntime from "regenerator-runtime";
var _marked = regeneratorRuntime.mark(function() {
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
                _ctx.next = 2;
                return;
            case 2:
                return _ctx.next = 4, new Foo;
            case 4:
                return _ctx.next = 6, new Bar;
            case 6:
                return _ctx.next = 8, new Baz;
            case 8:
                return _ctx.delegateYield([
                    new Bar
                ], "t0", 9);
            case 9:
                return _ctx.delegateYield([
                    new Baz
                ], "t1", 10);
            case 10:
            case "end":
                return _ctx.stop();
        }
    }, _marked);
}), Foo = function() {
    "use strict";
    _class_call_check(this, Foo);
}, Bar = function(Foo1) {
    "use strict";
    _inherits(Bar, Foo1);
    var _super = _create_super(Bar);
    function Bar() {
        return _class_call_check(this, Bar), _super.apply(this, arguments);
    }
    return Bar;
}(Foo), Baz = function() {
    "use strict";
    _class_call_check(this, Baz);
};
