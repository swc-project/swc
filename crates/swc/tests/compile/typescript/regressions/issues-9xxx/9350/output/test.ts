import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
function registerHook(key) {
    return (...args)=>console.log(args);
}
export default function design(base) {
    const Design = "test name conflict";
    var Design1;
    return Design1 = class Design1 extends base {
        copy() {
            console.log("copy");
        }
        render() {
            super.render();
            console.log("design render");
        }
    }, _ts_decorate([
        registerHook("beforeRender"),
        registerHook("afterRender")
    ], Design1.prototype, "render", null), Design1;
}
