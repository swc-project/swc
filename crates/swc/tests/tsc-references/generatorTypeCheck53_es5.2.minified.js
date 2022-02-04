import regeneratorRuntime from "regenerator-runtime";
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
var _marked = regeneratorRuntime.mark(function() {
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
                return _ctx.next = 2, new Foo;
            case 2:
                return _ctx.delegateYield([
                    new Baz
                ], "t0", 3);
            case 3:
            case "end":
                return _ctx.stop();
        }
    }, _marked);
}), Foo = function() {
    "use strict";
    _classCallCheck(this, Foo);
}, Baz = function() {
    "use strict";
    _classCallCheck(this, Baz);
};
