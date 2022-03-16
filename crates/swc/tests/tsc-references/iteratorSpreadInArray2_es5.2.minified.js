import * as swcHelpers from "@swc/helpers";
var _iterator = Symbol.iterator, SymbolIterator = function() {
    "use strict";
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
}(), _iterator1 = Symbol.iterator, NumberIterator = function() {
    "use strict";
    function NumberIterator() {
        swcHelpers.classCallCheck(this, NumberIterator);
    }
    var _proto = NumberIterator.prototype;
    return _proto.next = function() {
        return {
            value: 0,
            done: !1
        };
    }, _proto[_iterator1] = function() {
        return this;
    }, NumberIterator;
}();
swcHelpers.toConsumableArray(new NumberIterator).concat(swcHelpers.toConsumableArray(new SymbolIterator));
