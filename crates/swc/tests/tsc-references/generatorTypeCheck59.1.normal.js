//// [generatorTypeCheck59.ts]
import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
function* g() {
    class C {
        m() {}
    }
    _ts_decorate([
        (yield "")
    ], C.prototype, "m", null);
    ;
}
