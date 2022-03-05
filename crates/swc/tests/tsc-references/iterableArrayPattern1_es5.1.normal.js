import * as swcHelpers from "@swc/helpers";
var _iterator = Symbol.iterator;
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
        },
        {
            key: _iterator,
            value: function value() {
                return this;
            }
        }
    ]);
    return SymbolIterator;
}();
var ref = swcHelpers.slicedToArray(new SymbolIterator, 2), a = ref[0], b = ref[1];
