import * as swcHelpers from "@swc/helpers";
var Foo = function() {
    swcHelpers.classCallCheck(this, Foo);
}, Foo2 = function() {
    swcHelpers.classCallCheck(this, Foo2);
}, C = function() {
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    return C[""] = function() {
        return new Foo;
    }, C;
}();
