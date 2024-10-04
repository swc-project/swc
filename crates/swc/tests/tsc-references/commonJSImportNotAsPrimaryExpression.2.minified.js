//// [foo_0.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
}), function(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: !0,
        get: all[name]
    });
}(exports, {
    C1: function() {
        return C1;
    },
    E1: function() {
        return E11;
    }
});
var E1, _class_call_check = require("@swc/helpers/_/_class_call_check"), C1 = function C1() {
    _class_call_check._(this, C1), this.m1 = 42;
};
C1.s1 = !0;
var E11 = ((E1 = {})[E1.A = 0] = "A", E1[E1.B = 1] = "B", E1[E1.C = 2] = "C", E1);
//// [foo_1.ts]
