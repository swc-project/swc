import * as swcHelpers from "@swc/helpers";
var D = function() {
    "use strict";
    function D() {
        swcHelpers.classCallCheck(this, D);
    }
    var _proto = D.prototype;
    return _proto.foo = function() {}, _proto.computedName1 = function() {}, _proto.computedName2 = function(a) {}, _proto.computedName3 = function(a) {
        return 1;
    }, _proto.bar = function() {
        return this._bar;
    }, _proto.baz = function(a, x) {
        return "HELLO";
    }, D.computedname4 = function() {}, D.computedname5 = function(a) {}, D.computedname6 = function(a) {
        return !0;
    }, D.staticMethod = function() {
        return 3;
    }, D.foo = function(a) {}, D.bar = function(a) {
        return 1;
    }, D;
}();
