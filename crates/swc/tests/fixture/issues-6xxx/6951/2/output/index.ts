import _ts_decorate from "@swc/helpers/src/_ts_decorate.mjs";
class A {
    a = true;
    b = false;
    static c = 1;
    constructor(){}
}
_ts_decorate([
    observable
], A.prototype, "a", void 0);
_ts_decorate([
    foo
], A, "c", void 0);
