import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
import regeneratorRuntime from "regenerator-runtime";
var _marked = regeneratorRuntime.mark(g);
//@target: ES6
var Foo = function Foo() {
    "use strict";
    _class_call_check(this, Foo);
};
var Bar = /*#__PURE__*/ function(Foo) {
    "use strict";
    _inherits(Bar, Foo);
    var _super = _create_super(Bar);
    function Bar() {
        _class_call_check(this, Bar);
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
                return _ctx.delegateYield(new Bar, "t0", 3);
            case 3:
            case "end":
                return _ctx.stop();
        }
    }, _marked);
}
