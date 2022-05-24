import _async_to_generator from "@swc/helpers/lib/_async_to_generator.js";
import regeneratorRuntime from "regenerator-runtime";
// @module: commonjs
// @target: esnext
// @filename: 0.ts
export function foo() {
    return "foo";
}
// @filename: 1.ts
export function backup() {
    return "backup";
}
function compute(promise) {
    return _compute.apply(this, arguments);
}
function _compute() {
    _compute = // @filename: 2.ts
    _async_to_generator(regeneratorRuntime.mark(function _callee(promise) {
        var j;
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    _ctx.next = 2;
                    return promise;
                case 2:
                    j = _ctx.sent;
                    if (j) {
                        _ctx.next = 8;
                        break;
                    }
                    _ctx.next = 6;
                    return import("./1");
                case 6:
                    j = _ctx.sent;
                    return _ctx.abrupt("return", j.backup());
                case 8:
                    return _ctx.abrupt("return", j.foo());
                case 9:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _compute.apply(this, arguments);
}
compute(import("./0"));
