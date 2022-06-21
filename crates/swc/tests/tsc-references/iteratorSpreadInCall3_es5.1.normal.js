import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
//@target: ES6
function foo() {
    for(var _len = arguments.length, s = new Array(_len), _key = 0; _key < _len; _key++){
        s[_key] = arguments[_key];
    }
}
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
foo.apply(void 0, _to_consumable_array(new SymbolIterator));
