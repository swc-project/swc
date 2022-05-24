import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _to_array from "@swc/helpers/lib/_to_array.js";
var _iterator = Symbol.iterator;
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
    _proto[_iterator] = function() {
        return this;
    };
    return SymbolIterator;
}();
var ref = _to_array(new SymbolIterator), a = ref[0], b = ref.slice(1);
