import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
function registerHook(key) {
    return (...args)=>console.log(args);
}
export default function design(base) {
    var Design;
    return Design = class Design extends base {
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
    ], Design.prototype, "render", null), Design;
}
