//// [decoratorOnClassMethod15.ts]
import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
import { _ as _ts_metadata } from "@swc/helpers/_/_ts_metadata";
class Foo {
    foo() {
        return 0;
    }
    constructor(){
        this.prop = 1;
    }
}
_ts_decorate([
    decorator,
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], Foo.prototype, "foo", null);
