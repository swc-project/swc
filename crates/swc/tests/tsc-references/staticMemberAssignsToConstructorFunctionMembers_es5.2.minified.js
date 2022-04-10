import * as swcHelpers from "@swc/helpers";
var C = function() {
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    return C.foo = function() {
        C.foo = function() {};
    }, C.bar = function(x1) {
        return C.bar = function() {}, C.bar = function(x) {
            return x;
        }, C.bar = function(x) {
            return 1;
        }, 1;
    }, C;
}();
