import * as swcHelpers from "@swc/helpers";
//@target: ES6
function foo() {
    for(var _len = arguments.length, s = new Array(_len), _key = 0; _key < _len; _key++){
        s[_key] = arguments[_key];
    }
}
var _iterator = Symbol.iterator;
var SymbolIterator = /*#__PURE__*/ function() {
    "use strict";
    function SymbolIterator() {
        swcHelpers.classCallCheck(this, SymbolIterator);
    }
    swcHelpers.createClass(SymbolIterator, [
        {
            key: "next",
            value: function next() {
                return {
                    value: Symbol(),
                    done: false
                };
            }
        },
        {
            key: _iterator,
            value: function value() {
                return this;
            }
        }
    ]);
    return SymbolIterator;
}();
var _iterator1 = Symbol.iterator;
var _StringIterator = /*#__PURE__*/ function() {
    "use strict";
    function _StringIterator() {
        swcHelpers.classCallCheck(this, _StringIterator);
    }
    swcHelpers.createClass(_StringIterator, [
        {
            key: "next",
            value: function next() {
                return {
                    value: "",
                    done: false
                };
            }
        },
        {
            key: _iterator1,
            value: function value() {
                return this;
            }
        }
    ]);
    return _StringIterator;
}();
foo.apply(void 0, swcHelpers.toConsumableArray(new SymbolIterator).concat(swcHelpers.toConsumableArray(new _StringIterator)));
