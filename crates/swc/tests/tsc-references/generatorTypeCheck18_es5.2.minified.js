function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
import regeneratorRuntime from "regenerator-runtime";
var _marked = regeneratorRuntime.mark(function() {
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
                _ctx.next = 2;
                return;
            case 2:
                return _ctx.next = 4, new Baz;
            case 4:
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
