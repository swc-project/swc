import * as swcHelpers from "@swc/helpers";
var _iterator = Symbol.iterator, SymbolIterator = function() {
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
(function(s) {
    return s[0];
}).apply(void 0, swcHelpers.toConsumableArray(new SymbolIterator));
