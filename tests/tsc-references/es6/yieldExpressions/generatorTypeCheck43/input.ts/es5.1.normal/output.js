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
                _ctx.t0 = regeneratorRuntime.mark(function _callee() {
                    return regeneratorRuntime.wrap(function _callee$(_ctx) {
                        while(1)switch(_ctx.prev = _ctx.next){
                            case 0:
                            case "end":
                                return _ctx.stop();
                        }
                    }, _callee);
                });
                x = _defineProperty({
                }, (yield 0), _ctx.t0);
            case 2:
            case "end":
                return _ctx.stop();
        }
    }, _marked);
}
