import * as swcHelpers from "@swc/helpers";
var MyClass = function() {
    "use strict";
    function MyClass() {
        swcHelpers.classCallCheck(this, MyClass);
    }
    return MyClass.prototype.fn = function() {
        this.t;
    }, MyClass;
}();
