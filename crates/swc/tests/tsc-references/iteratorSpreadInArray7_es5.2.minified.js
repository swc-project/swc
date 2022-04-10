import * as swcHelpers from "@swc/helpers";
var array, _iterator = Symbol.iterator, SymbolIterator = function() {
    function SymbolIterator() {
        swcHelpers.classCallCheck(this, SymbolIterator);
    }
    var _proto = SymbolIterator.prototype;
    return _proto.next = function() {
        return {
            value: Symbol(),
            done: !1
        };
    }, _proto[_iterator] = function() {
        return this;
    }, SymbolIterator;
}();
array.concat(swcHelpers.toConsumableArray(new SymbolIterator));
