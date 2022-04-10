import * as swcHelpers from "@swc/helpers";
var _sym = "my-fake-sym";
export var MyClass = function() {
    function MyClass() {
        swcHelpers.classCallCheck(this, MyClass), this[_sym] = "ok";
    }
    return MyClass.prototype.method = function() {
        this[_sym] = "yep", this[_sym];
    }, MyClass;
}();
