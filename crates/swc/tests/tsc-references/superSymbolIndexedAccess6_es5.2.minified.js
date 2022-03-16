import * as swcHelpers from "@swc/helpers";
var symbol, _symbol = symbol, Foo = function() {
    "use strict";
    function Foo() {
        swcHelpers.classCallCheck(this, Foo);
    }
    return Foo[_symbol] = function() {
        return 0;
    }, Foo;
}(), _symbol1 = symbol, Bar = function(Foo) {
    "use strict";
    swcHelpers.inherits(Bar, Foo);
    var _super = swcHelpers.createSuper(Bar);
    function Bar() {
        return swcHelpers.classCallCheck(this, Bar), _super.apply(this, arguments);
    }
    return Bar[_symbol1] = function() {
        return swcHelpers.get(swcHelpers.getPrototypeOf(Bar), symbol, this).call(this);
    }, Bar;
}(Foo);
