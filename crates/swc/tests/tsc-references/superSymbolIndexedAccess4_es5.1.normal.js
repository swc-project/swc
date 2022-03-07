import * as swcHelpers from "@swc/helpers";
//@target: ES6
var symbol = Symbol.for('myThing');
var _symbol = symbol;
var Bar = /*#__PURE__*/ function() {
    "use strict";
    function Bar() {
        swcHelpers.classCallCheck(this, Bar);
    }
    var _proto = Bar.prototype;
    _proto[_symbol] = function() {
        return swcHelpers.get(swcHelpers.getPrototypeOf(Bar.prototype), symbol, this).call(this);
    };
    return Bar;
}();
