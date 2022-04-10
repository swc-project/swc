import * as swcHelpers from "@swc/helpers";
var Foo = function() {
    function Foo() {
        swcHelpers.classCallCheck(this, Foo);
    }
    var _proto = Foo.prototype;
    return _proto.bar = function() {
        this.hasData() && this.data.toLocaleLowerCase();
    }, _proto.hasData = function() {
        return !0;
    }, Foo;
}();
