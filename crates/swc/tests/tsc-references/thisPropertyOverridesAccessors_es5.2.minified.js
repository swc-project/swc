import * as swcHelpers from "@swc/helpers";
var Foo = function() {
    function Foo() {
        swcHelpers.classCallCheck(this, Foo);
    }
    return swcHelpers.createClass(Foo, [
        {
            key: "p",
            get: function() {
                return 1;
            },
            set: function(value) {}
        }
    ]), Foo;
}(), Bar = function(Foo) {
    swcHelpers.inherits(Bar, Foo);
    var _super = swcHelpers.createSuper(Bar);
    function Bar() {
        var _this;
        return swcHelpers.classCallCheck(this, Bar), (_this = _super.call(this)).p = 2, _this;
    }
    return Bar;
}(Foo);
