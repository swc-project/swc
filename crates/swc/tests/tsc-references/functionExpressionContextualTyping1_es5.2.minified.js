import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
!function(E) {
    E[E.red = 0] = "red", E[E.blue = 1] = "blue";
}(E || (E = {}));
var E, Class = function() {
    "use strict";
    function Class() {
        _class_call_check(this, Class);
    }
    return Class.prototype.foo = function() {}, Class;
}(), C = function() {
    "use strict";
    _class_call_check(this, C);
};
