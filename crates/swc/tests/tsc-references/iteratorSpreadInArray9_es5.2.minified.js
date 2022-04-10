import * as swcHelpers from "@swc/helpers";
var _iterator = Symbol.iterator, SymbolIterator = function() {
    function SymbolIterator() {
        swcHelpers.classCallCheck(this, SymbolIterator);
    }
    var _proto = SymbolIterator.prototype;
    return _proto.next = function() {
        return {
            value: Symbol()
        };
    }, _proto[_iterator] = function() {
        return this;
    }, SymbolIterator;
}();
swcHelpers.toConsumableArray(new SymbolIterator);
