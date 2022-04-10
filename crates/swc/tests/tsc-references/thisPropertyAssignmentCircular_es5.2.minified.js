import * as swcHelpers from "@swc/helpers";
export var Foo = function() {
    function Foo() {
        swcHelpers.classCallCheck(this, Foo), this.foo = "Hello";
    }
    var _proto = Foo.prototype;
    return _proto.slicey = function() {
        this.foo = this.foo.slice();
    }, _proto.m = function() {
        this.foo;
    }, Foo;
}();
