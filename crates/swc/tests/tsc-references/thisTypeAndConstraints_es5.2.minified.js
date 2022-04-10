import * as swcHelpers from "@swc/helpers";
var A = function() {
    function A() {
        swcHelpers.classCallCheck(this, A);
    }
    return A.prototype.self = function() {
        return this;
    }, A;
}(), B = function() {
    function B() {
        swcHelpers.classCallCheck(this, B);
    }
    var _proto = B.prototype;
    return _proto.foo = function(x) {
        x = x.self();
    }, _proto.bar = function(x) {
        x = x.self();
    }, B;
}();
