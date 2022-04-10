import * as swcHelpers from "@swc/helpers";
var _isConcatSpreadable = Symbol.isConcatSpreadable, Foo = function() {
    function Foo() {
        swcHelpers.classCallCheck(this, Foo);
    }
    return Foo.prototype[_isConcatSpreadable] = function() {
        return 0;
    }, Foo;
}(), _isConcatSpreadable1 = Symbol.isConcatSpreadable, Bar = function(Foo) {
    swcHelpers.inherits(Bar, Foo);
    var _super = swcHelpers.createSuper(Bar);
    function Bar() {
        return swcHelpers.classCallCheck(this, Bar), _super.apply(this, arguments);
    }
    return Bar.prototype[_isConcatSpreadable1] = function() {
        return swcHelpers.get(swcHelpers.getPrototypeOf(Bar.prototype), Symbol.isConcatSpreadable, this).call(this);
    }, Bar;
}(Foo);
