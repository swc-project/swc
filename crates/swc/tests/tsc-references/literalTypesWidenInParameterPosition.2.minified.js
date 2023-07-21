//// [literalTypesWidenInParameterPosition.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
new function D() {
    var widen = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 2;
    _class_call_check(this, D), this.widen = widen, this.noWiden = 1, this.noWiden = 5, this.widen = 6;
}(7);
