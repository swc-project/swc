import * as swcHelpers from "@swc/helpers";
var _isConcatSpreadable = Symbol.isConcatSpreadable;
var Foo = //@target: ES6
/*#__PURE__*/ function() {
    "use strict";
    function Foo() {
        swcHelpers.classCallCheck(this, Foo);
    }
    swcHelpers.createClass(Foo, [
        {
            key: _isConcatSpreadable,
            value: function value() {
                return 0;
            }
        }
    ]);
    return Foo;
}();
var _isConcatSpreadable1 = Symbol.isConcatSpreadable;
var Bar = /*#__PURE__*/ function(Foo) {
    "use strict";
    swcHelpers.inherits(Bar, Foo);
    var _super = swcHelpers.createSuper(Bar);
    function Bar() {
        swcHelpers.classCallCheck(this, Bar);
        return _super.apply(this, arguments);
    }
    swcHelpers.createClass(Bar, [
        {
            key: _isConcatSpreadable1,
            value: function value() {
                return swcHelpers.get(swcHelpers.getPrototypeOf(Bar.prototype), Symbol.isConcatSpreadable, this).call(this);
            }
        }
    ]);
    return Bar;
}(Foo);
