import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _construct from "@swc/helpers/src/_construct.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
var Foo = function() {
    "use strict";
    for(var _len = arguments.length, s = Array(_len), _key = 0; _key < _len; _key++)s[_key] = arguments[_key];
    _class_call_check(this, Foo);
}, SymbolIterator = function() {
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
}(), _StringIterator = function() {
    "use strict";
    function _StringIterator() {
        _class_call_check(this, _StringIterator);
    }
    var _proto = _StringIterator.prototype;
    return _proto.next = function() {
        return {
            value: "",
            done: !1
        };
    }, _proto[Symbol.iterator] = function() {
        return this;
    }, _StringIterator;
}();
_construct(Foo, _to_consumable_array(new SymbolIterator).concat(_to_consumable_array(_to_consumable_array(new _StringIterator))));
