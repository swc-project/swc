//// [generatorTypeCheck61.ts]
import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
function* g() {
    class C {
    }
    C = _ts_decorate([
        (yield 0)
    ], C);
    ;
}
