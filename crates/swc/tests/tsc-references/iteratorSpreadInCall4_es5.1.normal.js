import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _to_consumable_array from "@swc/helpers/lib/_to_consumable_array.js";
//@target: ES6
function foo(s1) {
    for(var _len = arguments.length, s = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        s[_key - 1] = arguments[_key];
    }
}
var _iterator = Symbol.iterator;
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
foo.apply(void 0, _to_consumable_array(new SymbolIterator));
