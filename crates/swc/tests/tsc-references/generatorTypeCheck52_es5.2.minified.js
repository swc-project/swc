import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import regeneratorRuntime from "regenerator-runtime";
var _marked = regeneratorRuntime.mark(function() {
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
                return _ctx.next = 2, new Foo;
            case 2:
                return _ctx.next = 4, new Baz;
            case 4:
            case "end":
                return _ctx.stop();
        }
    }, _marked);
}), Foo = function() {
    "use strict";
    _class_call_check(this, Foo);
}, Baz = function() {
    "use strict";
    _class_call_check(this, Baz);
};
