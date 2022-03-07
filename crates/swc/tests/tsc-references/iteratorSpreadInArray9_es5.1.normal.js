import * as swcHelpers from "@swc/helpers";
var _iterator = Symbol.iterator;
var SymbolIterator = //@target: ES6
/*#__PURE__*/ function() {
    "use strict";
    function SymbolIterator() {
        swcHelpers.classCallCheck(this, SymbolIterator);
    }
    var _proto = SymbolIterator.prototype;
    _proto.next = function next() {
        return {
            value: Symbol()
        };
    };
    _proto[_iterator] = function() {
        return this;
    };
    return SymbolIterator;
}();
var array = swcHelpers.toConsumableArray(new SymbolIterator);
