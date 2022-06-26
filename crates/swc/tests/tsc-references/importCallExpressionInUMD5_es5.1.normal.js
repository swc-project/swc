import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import regeneratorRuntime from "regenerator-runtime";
// @module: umd
// @target: es2015
// @filename: 0.ts
export function foo() {
    return "foo";
}
function func() {
    return _func.apply(this, arguments);
}
function _func() {
    _func = // @filename: 1.ts
    // https://github.com/microsoft/TypeScript/issues/36780
    _async_to_generator(regeneratorRuntime.mark(function _callee() {
        var packageName, packageJson;
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    packageName = ".";
                    _ctx.next = 3;
                    return import(packageName + "/package.json");
                case 3:
                    packageJson = _ctx.sent;
                case 4:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _func.apply(this, arguments);
}
