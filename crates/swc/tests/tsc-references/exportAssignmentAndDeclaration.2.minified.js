//// [foo_0.ts]
define([
    "require",
    "@swc/helpers/_/_class_call_check"
], function(require, _class_call_check) {
    var E1, E11;
    return (E1 = E11 || (E11 = {}))[E1.A = 0] = "A", E1[E1.B = 1] = "B", E1[E1.C = 2] = "C", function C1() {
        _class_call_check._(this, C1);
    };
});
