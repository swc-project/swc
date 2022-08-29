//// [decoratorOnClass5.es6.ts]
import _ts_decorate from "@swc/helpers/src/_ts_decorate.mjs";
var _C;
let C = (_C = class C1 {
    static x() {
        return C.y;
    }
}, _C.y = 1, _C);
C = _ts_decorate([
    dec
], C);
let c = new C();
