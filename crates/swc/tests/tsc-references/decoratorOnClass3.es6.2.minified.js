//// [decoratorOnClass3.es6.ts]
import _ts_decorate from "@swc/helpers/src/_ts_decorate.mjs";
let C = class {
};
C = _ts_decorate([
    dec
], C);
let c = new C();
export { C as default };
