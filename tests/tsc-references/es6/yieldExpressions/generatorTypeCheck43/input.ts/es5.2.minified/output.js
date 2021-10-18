import regeneratorRuntime from "regenerator-runtime";
function _defineProperty(obj, key, value) {
    return key in obj ? Object.defineProperty(obj, key, {
        value: value,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : obj[key] = value, obj;
}
var _marked = regeneratorRuntime.mark(function() {
    var x;
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
                _ctx.t0 = regeneratorRuntime.mark(function _callee() {
                    return regeneratorRuntime.wrap(function(_ctx) {
                        for(;;)switch(_ctx.prev = _ctx.next){
                            case 0:
                            case "end":
                                return _ctx.stop();
                        }
                    }, _callee);
                }), x = _defineProperty({
                }, (yield 0), _ctx.t0);
            case 2:
            case "end":
                return _ctx.stop();
        }
    }, _marked);
});
