import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
var SymbolIterator = function() {
    "use strict";
    function SymbolIterator() {
        _class_call_check(this, SymbolIterator);
    }
    var _proto = SymbolIterator.prototype;
    return _proto.next = function() {
        return {
            value: Symbol(),
            done: !1
        };
    }, _proto[Symbol.iterator] = function() {
        return this;
    }, SymbolIterator;
}(), ref = _sliced_to_array(new SymbolIterator, 2);
ref[0], ref[1];
