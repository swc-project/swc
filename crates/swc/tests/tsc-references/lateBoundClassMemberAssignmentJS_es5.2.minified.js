import * as swcHelpers from "@swc/helpers";
var _sym = Symbol("_sym");
export var MyClass = function() {
    "use strict";
    function MyClass() {
        swcHelpers.classCallCheck(this, MyClass), this[_sym] = "ok";
    }
    return MyClass.prototype.method = function() {
        this[_sym] = "yep", this[_sym];
    }, MyClass;
}();
