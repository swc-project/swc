import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import regeneratorRuntime from "regenerator-runtime";
export function foo() {
    return "foo";
}
export function backup() {
    return "backup";
}
function _compute() {
    return (_compute = _async_to_generator(regeneratorRuntime.mark(function _callee(promise) {
        var j;
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    return _ctx.next = 2, promise;
                case 2:
                    if (j = _ctx.sent) {
                        _ctx.next = 8;
                        break;
                    }
                    return _ctx.next = 6, import("./1");
                case 6:
                    return j = _ctx.sent, _ctx.abrupt("return", j.backup());
                case 8:
                    return _ctx.abrupt("return", j.foo());
                case 9:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }))).apply(this, arguments);
}
!function(promise) {
    return _compute.apply(this, arguments);
}(import("./0"));
