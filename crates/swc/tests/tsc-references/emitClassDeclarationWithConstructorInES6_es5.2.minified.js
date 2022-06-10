import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var A = function() {
    "use strict";
    function A(x) {
        _class_call_check(this, A);
    }
    return A.prototype.foo = function() {}, A;
}(), B = function() {
    "use strict";
    function B(x) {
        arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
        for(var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++)args[_key - 2] = arguments[_key];
        _class_call_check(this, B), this.x = "hello", this.y = 10;
    }
    return B.prototype.baz = function(z, v) {
        return this._bar;
    }, B;
}();
