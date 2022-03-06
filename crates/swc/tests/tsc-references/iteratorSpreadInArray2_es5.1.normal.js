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
var _iterator1 = Symbol.iterator;
var NumberIterator = /*#__PURE__*/ function() {
    "use strict";
    function NumberIterator() {
        swcHelpers.classCallCheck(this, NumberIterator);
    }
    swcHelpers.createClass(NumberIterator, [
        {
            key: "next",
            value: function next() {
                return {
                    value: 0,
                    done: false
                };
            }
        },
        {
            key: _iterator1,
            value: function value() {
                return this;
            }
        }
    ]);
    return NumberIterator;
}();
var array = swcHelpers.toConsumableArray(new NumberIterator).concat(swcHelpers.toConsumableArray(new SymbolIterator));
