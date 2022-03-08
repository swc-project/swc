import * as swcHelpers from "@swc/helpers";
var symbol = Symbol.for("myThing"), _symbol = symbol, Bar = function() {
    "use strict";
    function Bar() {
        swcHelpers.classCallCheck(this, Bar);
    }
    return Bar.prototype[_symbol] = function() {
        return swcHelpers.get(swcHelpers.getPrototypeOf(Bar.prototype), symbol, this).call(this);
    }, Bar;
}();
