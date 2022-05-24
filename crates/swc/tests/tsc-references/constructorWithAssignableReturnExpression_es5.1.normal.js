import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
// a class constructor may return an expression, it must be assignable to the class instance type to be valid
var C = function C() {
    "use strict";
    _class_call_check(this, C);
    return 1;
};
var D = function D() {
    "use strict";
    _class_call_check(this, D);
    return 1; // error
};
var E = function E() {
    "use strict";
    _class_call_check(this, E);
    return {
        x: 1
    };
};
var F = function F() {
    "use strict";
    _class_call_check(this, F);
    return {
        x: 1
    }; // error
};
var G = function G() {
    "use strict";
    _class_call_check(this, G);
    return {
        x: null
    };
};
