import * as swcHelpers from "@swc/helpers";
var _sym = "my-fake-sym";
export var MyClass = function() {
    "use strict";
    function MyClass() {
        swcHelpers.classCallCheck(this, MyClass), this[_sym] = "ok";
    }
    return swcHelpers.createClass(MyClass, [
        {
            key: "method",
            value: function() {
                this[_sym] = "yep", this[_sym];
            }
        }
    ]), MyClass;
}();
