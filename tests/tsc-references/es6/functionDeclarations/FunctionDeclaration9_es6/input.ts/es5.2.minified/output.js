import regeneratorRuntime from "regenerator-runtime";
function _defineProperty(obj, key, value) {
    return key in obj ? Object.defineProperty(obj, key, {
        value: value,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : obj[key] = value, obj;
}
var _marked = regeneratorRuntime.mark(foo);
function foo() {
    var v;
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
                _ctx.t0 = foo, v = _defineProperty({
                }, (yield), _ctx.t0);
            case 2:
            case "end":
                return _ctx.stop();
        }
    }, _marked);
}
