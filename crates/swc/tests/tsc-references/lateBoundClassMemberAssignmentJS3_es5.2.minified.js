import * as swcHelpers from "@swc/helpers";
var _sym = Symbol("_sym");
export var MyClass = function() {
    function MyClass() {
        swcHelpers.classCallCheck(this, MyClass);
        var self = this;
        self[_sym] = "ok";
    }
    return MyClass.prototype.method = function() {
        var self = this;
        self[_sym] = "yep", self[_sym];
    }, MyClass;
}();
