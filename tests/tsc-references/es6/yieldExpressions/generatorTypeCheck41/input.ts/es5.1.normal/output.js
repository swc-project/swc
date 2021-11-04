import regeneratorRuntime from "regenerator-runtime";
function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
var _marked = regeneratorRuntime.mark(g);
//@target: ES6
function g() {
    var x;
    return regeneratorRuntime.wrap(function g$(_ctx) {
        while(1)switch(_ctx.prev = _ctx.next){
            case 0:
                _ctx.t0 = _defineProperty;
                _ctx.t1 = {
                };
                _ctx.next = 4;
                return 0;
            case 4:
                _ctx.t2 = _ctx.sent;
                x = (0, _ctx.t0)(_ctx.t1, _ctx.t2, 0);
            case 6:
            case "end":
                return _ctx.stop();
        }
    }, _marked);
}
