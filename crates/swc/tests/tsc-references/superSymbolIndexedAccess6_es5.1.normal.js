import * as swcHelpers from "@swc/helpers";
//@target: ES5
var symbol;
var _symbol = symbol;
var Foo = /*#__PURE__*/ function() {
    "use strict";
    function Foo() {
        swcHelpers.classCallCheck(this, Foo);
    }
    swcHelpers.createClass(Foo, null, [
        {
            key: _symbol,
            value: function value() {
                return 0;
            }
        }
    ]);
    return Foo;
}();
var _symbol1 = symbol;
var Bar = /*#__PURE__*/ function(Foo) {
    "use strict";
    swcHelpers.inherits(Bar, Foo);
    var _super = swcHelpers.createSuper(Bar);
    function Bar() {
        swcHelpers.classCallCheck(this, Bar);
        return _super.apply(this, arguments);
    }
    swcHelpers.createClass(Bar, null, [
        {
            key: _symbol1,
            value: function value() {
                return swcHelpers.get(swcHelpers.getPrototypeOf(Bar), symbol, this).call(this);
            }
        }
    ]);
    return Bar;
}(Foo);
