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
}();
(function(s1) {
    for(var _len = arguments.length, s = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++)s[_key - 1] = arguments[_key];
}).apply(void 0, swcHelpers.toConsumableArray(new SymbolIterator));
