//@target: ES6
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
var SymbolIterator = /*#__PURE__*/ function() {
    "use strict";
    function SymbolIterator() {
        _class_call_check(this, SymbolIterator);
    }
    var _proto = SymbolIterator.prototype;
    _proto.next = function next() {
        return {
            value: Symbol()
        };
    };
    _proto[Symbol.iterator] = function() {
        return this;
    };
    return SymbolIterator;
}();
var array = _to_consumable_array(new SymbolIterator);
