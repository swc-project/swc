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
                _ctx.t0 = _defineProperty, _ctx.t1 = {
                }, _ctx.next = 4;
                return;
            case 4:
                _ctx.t2 = _ctx.sent, _ctx.t3 = foo, v = (0, _ctx.t0)(_ctx.t1, _ctx.t2, _ctx.t3);
            case 7:
            case "end":
                return _ctx.stop();
        }
    }, _marked);
}
