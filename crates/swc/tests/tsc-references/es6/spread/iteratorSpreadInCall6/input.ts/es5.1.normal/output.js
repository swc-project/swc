function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
        for(var i = 0, arr2 = new Array(arr.length); i < arr.length; i++){
            arr2[i] = arr[i];
        }
        return arr2;
    }
}
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}
function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
}
function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}
//@target: ES6
function foo() {
    for(var _len = arguments.length, s = new Array(_len), _key = 0; _key < _len; _key++){
        s[_key] = arguments[_key];
    }
}
var tmp = Symbol.iterator;
var SymbolIterator = /*#__PURE__*/ function() {
    "use strict";
    function SymbolIterator() {
        _classCallCheck(this, SymbolIterator);
    }
    _createClass(SymbolIterator, [
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
            key: tmp,
            value: function value() {
                return this;
            }
        }
    ]);
    return SymbolIterator;
}();
var tmp1 = Symbol.iterator;
var _StringIterator = /*#__PURE__*/ function() {
    "use strict";
    function _StringIterator() {
        _classCallCheck(this, _StringIterator);
    }
    _createClass(_StringIterator, [
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
            key: tmp1,
            value: function value() {
                return this;
            }
        }
    ]);
    return _StringIterator;
}();
foo.apply(void 0, _toConsumableArray(new SymbolIterator).concat(_toConsumableArray(new _StringIterator)));
