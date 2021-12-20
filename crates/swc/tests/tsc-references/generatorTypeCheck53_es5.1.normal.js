import regeneratorRuntime from "regenerator-runtime";
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
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
                return _ctx.delegateYield([
                    new Baz
                ], "t0", 3);
            case 3:
            case "end":
                return _ctx.stop();
        }
    }, _marked);
}
