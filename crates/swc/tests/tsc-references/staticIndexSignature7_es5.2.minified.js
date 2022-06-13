import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var X = function() {
    "use strict";
    _class_call_check(this, X);
};
X.x = 12;
var Y = function() {
    "use strict";
    function Y() {
        _class_call_check(this, Y);
    }
    return Y.foo = function() {}, Y;
}();
