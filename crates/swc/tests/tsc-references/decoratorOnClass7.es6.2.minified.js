//// [decoratorOnClass7.es6.ts]
var _C;
import _ts_decorate from "@swc/helpers/src/_ts_decorate.mjs";
let C = ((_C = class {
    static x() {
        return C.y;
    }
}).y = 1, _C);
C = _ts_decorate([
    dec
], C), new C();
export { C as default };
