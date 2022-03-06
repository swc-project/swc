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
var NumberIterator = /*#__PURE__*/ function() {
    "use strict";
    function NumberIterator() {
        swcHelpers.classCallCheck(this, NumberIterator);
    }
    var _proto = NumberIterator.prototype;
    _proto.next = function next() {
        return {
            value: 0,
            done: false
        };
    };
    _proto[_iterator1] = function() {
        return this;
    };
    return NumberIterator;
}();
var array = swcHelpers.toConsumableArray(new NumberIterator).concat(swcHelpers.toConsumableArray(new SymbolIterator));
