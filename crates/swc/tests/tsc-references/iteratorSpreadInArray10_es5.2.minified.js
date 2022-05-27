import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _to_consumable_array from "@swc/helpers/lib/_to_consumable_array.js";
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
