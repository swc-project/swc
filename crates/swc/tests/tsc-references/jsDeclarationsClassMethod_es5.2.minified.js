import * as swcHelpers from "@swc/helpers";
function C1() {
    this.prop = function(x, y) {
        return x + y;
    };
}
C1.prototype.method = function(x, y) {
    return x + y;
}, C1.staticProp = function(x, y) {
    return x + y;
};
var C2 = function() {
    "use strict";
    function C2() {
        swcHelpers.classCallCheck(this, C2);
    }
    return C2.prototype.method1 = function(x, y) {
        return x + y;
    }, C2;
}();
C2.prototype.method2 = function(x, y) {
    return x + y;
}, C2.staticProp = function(x, y) {
    return x + y;
};
