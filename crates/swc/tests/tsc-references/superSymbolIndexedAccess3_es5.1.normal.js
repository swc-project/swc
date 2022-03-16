import * as swcHelpers from "@swc/helpers";
//@target: ES6
var symbol = Symbol.for('myThing');
var _symbol = symbol;
var Foo = /*#__PURE__*/ function() {
    "use strict";
    function Foo() {
        swcHelpers.classCallCheck(this, Foo);
    }
    var _proto = Foo.prototype;
    _proto[_symbol] = function() {
        return 0;
    };
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
    var _proto = Bar.prototype;
    _proto[_symbol1] = function() {
        return swcHelpers.get(swcHelpers.getPrototypeOf(Bar.prototype), Bar, this).call(this);
    };
    return Bar;
}(Foo);
