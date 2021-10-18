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
var _marked = regeneratorRuntime.mark(foo);
// @target: es6
function foo() {
    var v;
    return regeneratorRuntime.wrap(function foo$(_ctx) {
        while(1)switch(_ctx.prev = _ctx.next){
            case 0:
                v = _defineProperty({
                }, (yield), foo);
            case 1:
            case "end":
                return _ctx.stop();
        }
    }, _marked);
}
