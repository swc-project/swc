//// [foo_0.ts]
define([
    "require",
    "@swc/helpers/src/_class_call_check.mjs"
], function(require, _class_call_check) {
    "use strict";
    var E1, E11;
    return _class_call_check = _class_call_check.default, (E1 = E11 || (E11 = {}))[E1.A = 0] = "A", E1[E1.B = 1] = "B", E1[E1.C = 2] = "C", function C1() {
        "use strict";
        _class_call_check(this, C1);
    };
});
