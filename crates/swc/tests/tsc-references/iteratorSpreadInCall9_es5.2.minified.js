import * as swcHelpers from "@swc/helpers";
var Foo = function() {
    "use strict";
    for(var _len = arguments.length, s = new Array(_len), _key = 0; _key < _len; _key++)s[_key] = arguments[_key];
    swcHelpers.classCallCheck(this, Foo);
}, _iterator = Symbol.iterator, SymbolIterator = function() {
    "use strict";
    function SymbolIterator() {
        swcHelpers.classCallCheck(this, SymbolIterator);
    }
    return swcHelpers.createClass(SymbolIterator, [
        {
            key: "next",
            value: function() {
                return {
                    value: Symbol(),
                    done: !1
                };
            }
        },
        {
            key: _iterator,
            value: function() {
                return this;
            }
        }
    ]), SymbolIterator;
}(), _iterator1 = Symbol.iterator, _StringIterator = function() {
    "use strict";
    function _StringIterator() {
        swcHelpers.classCallCheck(this, _StringIterator);
    }
    return swcHelpers.createClass(_StringIterator, [
        {
            key: "next",
            value: function() {
                return {
                    value: "",
                    done: !1
                };
            }
        },
        {
            key: _iterator1,
            value: function() {
                return this;
            }
        }
    ]), _StringIterator;
}();
swcHelpers.construct(Foo, swcHelpers.toConsumableArray(new SymbolIterator).concat(swcHelpers.toConsumableArray(swcHelpers.toConsumableArray(new _StringIterator))));
