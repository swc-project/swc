import * as swcHelpers from "@swc/helpers";
//@target: ES6
var symbol = Symbol.for('myThing');
var _symbol = symbol;
var Bar = /*#__PURE__*/ function() {
    "use strict";
    function Bar() {
        swcHelpers.classCallCheck(this, Bar);
    }
    swcHelpers.createClass(Bar, [
        {
            key: _symbol,
            value: function value() {
                return swcHelpers.get(swcHelpers.getPrototypeOf(Bar.prototype), symbol, this).call(this);
            }
        }
    ]);
    return Bar;
}();
