import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
import regeneratorRuntime from "regenerator-runtime";
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
