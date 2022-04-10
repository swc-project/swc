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
        }
    ]), C;
}(), D = function(C) {
    swcHelpers.inherits(D, C);
    var _super = swcHelpers.createSuper(D);
    function D() {
        return swcHelpers.classCallCheck(this, D), _super.apply(this, arguments);
    }
    return swcHelpers.createClass(D, [
        {
            key: "set1",
            set: function(p) {}
        }
    ]), D;
}(C);
