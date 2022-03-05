import * as swcHelpers from "@swc/helpers";
var SymbolIterator = //@target: ES6
/*#__PURE__*/ function() {
    "use strict";
    function SymbolIterator() {
        swcHelpers.classCallCheck(this, SymbolIterator);
    }
    swcHelpers.createClass(SymbolIterator, [
        {
            key: "next",
            value: function next() {
                return {
                    value: Symbol(),
                    done: false
                };
            }
        }
    ]);
    return SymbolIterator;
}();
var array = swcHelpers.toConsumableArray(new SymbolIterator);
