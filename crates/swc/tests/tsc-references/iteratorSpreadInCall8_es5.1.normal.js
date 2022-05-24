import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _construct from "@swc/helpers/lib/_construct.js";
import _to_consumable_array from "@swc/helpers/lib/_to_consumable_array.js";
//@target: ES6
var Foo = function Foo() {
    "use strict";
    for(var _len = arguments.length, s = new Array(_len), _key = 0; _key < _len; _key++){
        s[_key] = arguments[_key];
    }
    _class_call_check(this, Foo);
};
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
var _iterator1 = Symbol.iterator;
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
    _proto[_iterator1] = function() {
        return this;
    };
    return _StringIterator;
}();
_construct(Foo, _to_consumable_array(new SymbolIterator).concat(_to_consumable_array(new _StringIterator)));
