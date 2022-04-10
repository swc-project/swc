import * as swcHelpers from "@swc/helpers";
export var B = function() {
    function B() {
        swcHelpers.classCallCheck(this, B);
    }
    return B.prototype.print = function() {
        return "I am B";
    }, B;
}();
!function(x) {
    x.then(function(value) {
        new value.B().print();
    });
}(import("./0"));
