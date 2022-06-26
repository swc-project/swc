import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
var SymbolIterator = function() {
    "use strict";
    function SymbolIterator() {
        _class_call_check(this, SymbolIterator);
    }
    return SymbolIterator.prototype[Symbol.iterator] = function() {
        return this;
    }, SymbolIterator;
}();
_to_consumable_array(new SymbolIterator);
