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
            key: 64,
            get: function() {
                return new Foo;
            }
        },
        {
            key: 64,
            set: function(p) {}
        }
    ]), C;
}();
