import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var anyCtor, anyCtor1, nestedCtor, C0 = function() {
    "use strict";
    _class_call_check(this, C0);
}, C1 = function(n, s) {
    "use strict";
    _class_call_check(this, C1);
}, T = function(n) {
    "use strict";
    _class_call_check(this, T);
};
new C0, new T, new anyCtor, new anyCtor1(void 0);
var nested = new new new nestedCtor()()();
new nested(), new nested();
