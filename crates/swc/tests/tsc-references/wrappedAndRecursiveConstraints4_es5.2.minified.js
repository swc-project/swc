import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var C = function() {
    "use strict";
    function C(x) {
        _class_call_check(this, C);
    }
    return C.prototype.foo = function(x) {
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
