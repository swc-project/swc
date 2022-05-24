import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var C = function() {
    "use strict";
    function C(x) {
        _class_call_check(this, C);
    }
    return C.prototype.foo = function(x1) {
        return function(x) {
            return x;
        };
    }, C;
}();
new C({
    length: 2
}).foo("")({
    length: 3,
    charAt: function(x) {}
});
