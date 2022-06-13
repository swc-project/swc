import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
import regeneratorRuntime from "regenerator-runtime";
var _marked = regeneratorRuntime.mark(function() {
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
                _ctx.next = 2;
                return;
            case 2:
                return _ctx.delegateYield([
                    new Foo
                ], "t0", 3);
            case 3:
                return _ctx.next = 5, new Bar;
            case 5:
                return _ctx.next = 7, new Baz;
            case 7:
                return _ctx.delegateYield([
                    new Bar
                ], "t1", 8);
            case 8:
                return _ctx.delegateYield([
                    new Baz
                ], "t2", 9);
            case 9:
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
