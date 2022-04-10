import * as swcHelpers from "@swc/helpers";
var Foo = function() {
    swcHelpers.classCallCheck(this, Foo);
}, Foo2 = function() {
    swcHelpers.classCallCheck(this, Foo2);
}, C = function() {
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    return swcHelpers.createClass(C, [
        {
            key: "get1",
            get: function() {
                return new Foo;
            }
        },
        {
            key: "set1",
            set: function(p) {}
        }
    ]), C;
}();
