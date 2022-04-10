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
}(), _iterator1 = Symbol.iterator, _StringIterator = function() {
    function _StringIterator() {
        swcHelpers.classCallCheck(this, _StringIterator);
    }
    var _proto = _StringIterator.prototype;
    return _proto.next = function() {
        return {
            value: "",
            done: !1
        };
    }, _proto[_iterator1] = function() {
        return this;
    }, _StringIterator;
}();
(function() {
    for(var _len = arguments.length, s = new Array(_len), _key = 0; _key < _len; _key++)s[_key] = arguments[_key];
    return s[0];
}).apply(void 0, swcHelpers.toConsumableArray(new SymbolIterator).concat(swcHelpers.toConsumableArray(new _StringIterator)));
