import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
function foo(x) {}
foo({}), foo({});
var C = function(x) {
    "use strict";
    _class_call_check(this, C), this.x = x;
};
function foo2(x) {}
new C({}), foo2({}), foo2({});
var C2 = function(x) {
    "use strict";
    _class_call_check(this, C2), this.x = x;
};
new C2({});
