import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var C = function() {
    "use strict";
    _class_call_check(this, C);
};
C.foo = C;
var C2 = function() {
    "use strict";
    _class_call_check(this, C2);
};
C2.foo = C2;
