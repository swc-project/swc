import * as swcHelpers from "@swc/helpers";
var SymbolIterator = function() {
    function SymbolIterator() {
        swcHelpers.classCallCheck(this, SymbolIterator);
    }
    return SymbolIterator.prototype.next = function() {
        return {
            value: Symbol(),
            done: !1
        };
    }, SymbolIterator;
}();
swcHelpers.toConsumableArray(new SymbolIterator);
