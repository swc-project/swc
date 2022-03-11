import * as swcHelpers from "@swc/helpers";
//@target: ES6
var Foo = function Foo() {
    "use strict";
    for(var _len = arguments.length, s = new Array(_len), _key = 0; _key < _len; _key++){
        s[_key] = arguments[_key];
    }
    swcHelpers.classCallCheck(this, Foo);
};
var _iterator = Symbol.iterator;
var SymbolIterator = /*#__PURE__*/ function() {
    "use strict";
    function SymbolIterator() {
        swcHelpers.classCallCheck(this, SymbolIterator);
    }
    var _proto = SymbolIterator.prototype;
    _proto.next = function next() {
        return {
            value: Symbol(),
            done: false
        };
    };
    _proto[_iterator] = function() {
        return this;
    };
    return SymbolIterator;
}();
var _iterator1 = Symbol.iterator;
var _StringIterator = /*#__PURE__*/ function() {
    "use strict";
    function _StringIterator() {
        swcHelpers.classCallCheck(this, _StringIterator);
    }
    var _proto = _StringIterator.prototype;
    _proto.next = function next() {
        return {
            value: "",
            done: false
        };
    };
    _proto[_iterator1] = function() {
        return this;
    };
    return _StringIterator;
}();
swcHelpers.construct(Foo, swcHelpers.toConsumableArray(new SymbolIterator).concat(swcHelpers.toConsumableArray(swcHelpers.toConsumableArray(new _StringIterator))));
