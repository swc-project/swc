function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
import regeneratorRuntime from "regenerator-runtime";
var _marked = regeneratorRuntime.mark(g);
var Foo = function Foo() {
    "use strict";
    _classCallCheck(this, Foo);
};
var Baz = function Baz() {
    "use strict";
    _classCallCheck(this, Baz);
};
function g() {
    return regeneratorRuntime.wrap(function g$(_ctx) {
        while(1)switch(_ctx.prev = _ctx.next){
            case 0:
                _ctx.next = 2;
                return new Foo;
            case 2:
                _ctx.next = 4;
                return new Baz;
            case 4:
            case "end":
                return _ctx.stop();
        }
    }, _marked);
}
