import * as swcHelpers from "@swc/helpers";
var _isConcatSpreadable = Symbol.isConcatSpreadable, Foo = function() {
    "use strict";
    function Foo() {
        swcHelpers.classCallCheck(this, Foo);
    }
    return swcHelpers.createClass(Foo, [
        {
            key: _isConcatSpreadable,
            value: function() {
                return 0;
            }
        }
    ]), Foo;
}(), _isConcatSpreadable1 = Symbol.isConcatSpreadable, Bar = function(Foo) {
    "use strict";
    swcHelpers.inherits(Bar, Foo);
    var _super = swcHelpers.createSuper(Bar);
    function Bar() {
        return swcHelpers.classCallCheck(this, Bar), _super.apply(this, arguments);
    }
    return swcHelpers.createClass(Bar, [
        {
            key: _isConcatSpreadable1,
            value: function() {
                return swcHelpers.get(swcHelpers.getPrototypeOf(Bar.prototype), Symbol.isConcatSpreadable, this).call(this);
            }
        }
    ]), Bar;
}(Foo);
