//// [classStaticBlockUseBeforeDef3.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
new WeakMap(), new WeakMap(), new WeakMap();
var __3 = new WeakMap(), __21 = new WeakMap(), __31 = new WeakMap(), u = "FOO", CFA = /*#__PURE__*/ function() {
    function CFA() {
        _class_call_check(this, CFA);
    }
    return CFA.doSomething = function() {}, CFA;
}();
__3.set(CFA, {
    writable: !0,
    value: void (u = "BAR")
}), __21.set(CFA, {
    writable: !0,
    value: CFA.t = 1
}), __31.set(CFA, {
    writable: !0,
    value: u
});
