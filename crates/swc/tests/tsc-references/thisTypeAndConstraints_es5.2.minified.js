import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var A = function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
    }
    return A.prototype.self = function() {
        return this;
    }, A;
}(), B = function() {
    "use strict";
    function B() {
        _class_call_check(this, B);
    }
    var _proto = B.prototype;
    return _proto.foo = function(x) {
        x = x.self();
    }, _proto.bar = function(x) {
        x = x.self();
    }, B;
}();
