import * as swcHelpers from "@swc/helpers";
var Foo = function() {
    "use strict";
    for(var _len = arguments.length, s = new Array(_len), _key = 0; _key < _len; _key++)s[_key] = arguments[_key];
    swcHelpers.classCallCheck(this, Foo);
}, _iterator = Symbol.iterator, SymbolIterator = function() {
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
}(), _iterator1 = Symbol.iterator, _StringIterator = function() {
    "use strict";
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
swcHelpers.construct(Foo, swcHelpers.toConsumableArray(swcHelpers.toConsumableArray(new SymbolIterator).concat(swcHelpers.toConsumableArray(swcHelpers.toConsumableArray(new _StringIterator)))));
