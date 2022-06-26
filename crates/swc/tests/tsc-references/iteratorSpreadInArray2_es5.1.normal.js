import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
//@target: ES6
var SymbolIterator = /*#__PURE__*/ function() {
    "use strict";
    function SymbolIterator() {
        _class_call_check(this, SymbolIterator);
    }
    var _proto = SymbolIterator.prototype;
    _proto.next = function next() {
        return {
            value: Symbol(),
            done: false
        };
    };
    _proto[Symbol.iterator] = function() {
        return this;
    };
    return SymbolIterator;
}();
var NumberIterator = /*#__PURE__*/ function() {
    "use strict";
    function NumberIterator() {
        _class_call_check(this, NumberIterator);
    }
    var _proto = NumberIterator.prototype;
    _proto.next = function next() {
        return {
            value: 0,
            done: false
        };
    };
    _proto[Symbol.iterator] = function() {
        return this;
    };
    return NumberIterator;
}();
var array = _to_consumable_array(new NumberIterator).concat(_to_consumable_array(new SymbolIterator));
