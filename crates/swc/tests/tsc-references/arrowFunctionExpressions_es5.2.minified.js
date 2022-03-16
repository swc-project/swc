import * as swcHelpers from "@swc/helpers";
var MyClass = function() {
    "use strict";
    function MyClass() {
        var _this = this;
        swcHelpers.classCallCheck(this, MyClass), this.m = function(n) {
            return n + 1;
        }, this.p = function(n) {
            return n && _this;
        };
    }
    return MyClass.prototype.fn = function() {}, MyClass;
}();
(function() {
    return 0;
})().toExponential();
