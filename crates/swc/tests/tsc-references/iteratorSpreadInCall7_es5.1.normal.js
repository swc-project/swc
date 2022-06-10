import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _to_consumable_array from "@swc/helpers/lib/_to_consumable_array.js";
//@target: ES6
function foo() {
    for(var _len = arguments.length, s = new Array(_len), _key = 0; _key < _len; _key++){
        s[_key] = arguments[_key];
    }
    return s[0];
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
var _StringIterator = /*#__PURE__*/ function() {
    "use strict";
    function _StringIterator() {
        _class_call_check(this, _StringIterator);
    }
    var _proto = _StringIterator.prototype;
    _proto.next = function next() {
        return {
            value: "",
            done: false
        };
    };
    _proto[Symbol.iterator] = function() {
        return this;
    };
    return _StringIterator;
}();
foo.apply(void 0, _to_consumable_array(new SymbolIterator).concat(_to_consumable_array(new _StringIterator)));
