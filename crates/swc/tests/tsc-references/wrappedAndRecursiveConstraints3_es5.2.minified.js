import * as swcHelpers from "@swc/helpers";
var C = function() {
    "use strict";
    function C(x) {
        swcHelpers.classCallCheck(this, C);
    }
    return C.prototype.foo = function(x1) {
        return function(x) {
            return x;
        };
    }, C;
}();
new C({
    length: 2
}).foo({
    length: 3,
    charAt: function(x) {}
})("");
