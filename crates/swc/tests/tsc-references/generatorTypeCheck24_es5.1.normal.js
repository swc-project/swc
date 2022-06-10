import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
import regeneratorRuntime from "regenerator-runtime";
var _marked = regeneratorRuntime.mark(g3);
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
var Baz = function Baz() {
    "use strict";
    _class_call_check(this, Baz);
};
function g3() {
    return regeneratorRuntime.wrap(function g3$(_ctx) {
        while(1)switch(_ctx.prev = _ctx.next){
            case 0:
                _ctx.next = 2;
                return;
            case 2:
                return _ctx.delegateYield([
                    new Foo
                ], "t0", 3);
            case 3:
                _ctx.next = 5;
                return new Bar;
            case 5:
                _ctx.next = 7;
                return new Baz;
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
}
