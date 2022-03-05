import * as swcHelpers from "@swc/helpers";
var symbol, _symbol = symbol, Foo = function() {
    "use strict";
    function Foo() {
        swcHelpers.classCallCheck(this, Foo);
    }
    return swcHelpers.createClass(Foo, null, [
        {
            key: _symbol,
            value: function() {
                return 0;
            }
        }
    ]), Foo;
}(), _symbol1 = symbol, Bar = function(Foo) {
    "use strict";
    swcHelpers.inherits(Bar, Foo);
    var _super = swcHelpers.createSuper(Bar);
    function Bar() {
        return swcHelpers.classCallCheck(this, Bar), _super.apply(this, arguments);
    }
    return swcHelpers.createClass(Bar, null, [
        {
            key: _symbol1,
            value: function() {
                return swcHelpers.get(swcHelpers.getPrototypeOf(Bar), symbol, this).call(this);
            }
        }
    ]), Bar;
}(Foo);
