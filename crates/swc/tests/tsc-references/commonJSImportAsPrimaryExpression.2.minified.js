//// [foo_0.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "C1", {
    enumerable: !0,
    get: function() {
        return C1;
    }
});
var _class_call_check = require("@swc/helpers/_/_class_call_check"), __ = new WeakMap(), C1 = function C1() {
    _class_call_check._(this, C1), this.m1 = 42;
};
__.set(C1, {
    writable: !0,
    value: C1.s1 = !0
});
//// [foo_1.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
}), require("./foo_0").C1.s1;
