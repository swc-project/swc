import * as swcHelpers from "@swc/helpers";
var MyClass = function() {
    "use strict";
    function MyClass() {
        swcHelpers.classCallCheck(this, MyClass);
    }
    return swcHelpers.createClass(MyClass, [
        {
            key: "fn",
            value: function() {
                this.t;
            }
        }
    ]), MyClass;
}();
