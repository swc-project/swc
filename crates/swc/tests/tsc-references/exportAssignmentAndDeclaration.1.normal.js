//// [foo_0.ts]
define([
    "require",
    "@swc/helpers/_/_class_call_check"
], function(require, _class_call_check) {
    "use strict";
    var E1 = /*#__PURE__*/ function(E1) {
        E1[E1["A"] = 0] = "A";
        E1[E1["B"] = 1] = "B";
        E1[E1["C"] = 2] = "C";
        return E1;
    }({});
    var C1 = function C1() {
        "use strict";
        _class_call_check._(this, C1);
    };
    return C1;
});
