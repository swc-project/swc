//// [foo_0.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var E1, target = exports, all = {
    get C1 () {
        return C1;
    },
    get E1 () {
        return E11;
    },
    get M1 () {
        return M1;
    }
};
for(var name in all)Object.defineProperty(target, name, {
    enumerable: !0,
    get: Object.getOwnPropertyDescriptor(all, name).get
});
var M1, _class_call_check = require("@swc/helpers/_/_class_call_check"), C1 = function C1() {
    _class_call_check._(this, C1), this.m1 = 42;
};
C1.s1 = !0, M1 || (M1 = {});
var E11 = ((E1 = {})[E1.A = 0] = "A", E1[E1.B = 1] = "B", E1[E1.C = 2] = "C", E1);
//// [foo_1.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
}), require("./foo_0").M1;
