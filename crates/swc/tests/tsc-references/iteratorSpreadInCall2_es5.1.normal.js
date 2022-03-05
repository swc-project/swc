import * as swcHelpers from "@swc/helpers";
//@target: ES6
function foo(s) {}
var _iterator = Symbol.iterator;
var SymbolIterator = /*#__PURE__*/ function() {
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
foo.apply(void 0, swcHelpers.toConsumableArray(new SymbolIterator));
