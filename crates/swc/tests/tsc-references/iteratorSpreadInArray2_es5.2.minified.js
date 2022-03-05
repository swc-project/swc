import * as swcHelpers from "@swc/helpers";
var _iterator = Symbol.iterator, SymbolIterator = function() {
    "use strict";
    function SymbolIterator() {
        swcHelpers.classCallCheck(this, SymbolIterator);
    }
    return swcHelpers.createClass(SymbolIterator, [
        {
            key: "next",
            value: function() {
                return {
                    value: Symbol(),
                    done: !1
                };
            }
        },
        {
            key: _iterator,
            value: function() {
                return this;
            }
        }
    ]), SymbolIterator;
}(), _iterator1 = Symbol.iterator, NumberIterator = function() {
    "use strict";
    function NumberIterator() {
        swcHelpers.classCallCheck(this, NumberIterator);
    }
    return swcHelpers.createClass(NumberIterator, [
        {
            key: "next",
            value: function() {
                return {
                    value: 0,
                    done: !1
                };
            }
        },
        {
            key: _iterator1,
            value: function() {
                return this;
            }
        }
    ]), NumberIterator;
}();
swcHelpers.toConsumableArray(new NumberIterator).concat(swcHelpers.toConsumableArray(new SymbolIterator));
