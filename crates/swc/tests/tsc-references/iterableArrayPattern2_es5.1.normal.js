//@target: ES6
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _to_array from "@swc/helpers/src/_to_array.mjs";
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
var ref = _to_array(new SymbolIterator), a = ref[0], b = ref.slice(1);
