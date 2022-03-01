function _arrayLikeToArray(arr, len) {
    (null == len || len > arr.length) && (len = arr.length);
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _construct(Parent, args, Class) {
    return (_construct = !function() {
        if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
        if (Reflect.construct.sham) return !1;
        if ("function" == typeof Proxy) return !0;
        try {
            return Date.prototype.toString.call(Reflect.construct(Date, [], function() {})), !0;
        } catch (e) {
            return !1;
        }
    }() ? function _construct(Parent, args, Class) {
        var a = [
            null
        ];
        a.push.apply(a, args);
        var Constructor = Function.bind.apply(Parent, a), instance = new Constructor();
        return Class && _setPrototypeOf(instance, Class.prototype), instance;
    } : Reflect.construct).apply(null, arguments);
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    return protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), Constructor;
}
function _setPrototypeOf(o, p) {
    return _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        return o.__proto__ = p, o;
    }, _setPrototypeOf(o, p);
}
function _toConsumableArray(arr) {
    return (function(arr) {
        if (Array.isArray(arr)) return _arrayLikeToArray(arr);
    })(arr) || (function(iter) {
        if ("undefined" != typeof Symbol && null != iter[Symbol.iterator] || null != iter["@@iterator"]) return Array.from(iter);
    })(arr) || _unsupportedIterableToArray(arr) || (function() {
        throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    })();
}
function _unsupportedIterableToArray(o, minLen) {
    if (o) {
        if ("string" == typeof o) return _arrayLikeToArray(o, minLen);
        var n = Object.prototype.toString.call(o).slice(8, -1);
        if ("Object" === n && o.constructor && (n = o.constructor.name), "Map" === n || "Set" === n) return Array.from(n);
        if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
    }
}
var Foo = function() {
    "use strict";
    for(var _len = arguments.length, s = new Array(_len), _key = 0; _key < _len; _key++)s[_key] = arguments[_key];
    _classCallCheck(this, Foo);
}, _iterator = Symbol.iterator, SymbolIterator = function() {
    "use strict";
    function SymbolIterator() {
        _classCallCheck(this, SymbolIterator);
    }
    return _createClass(SymbolIterator, [
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
        _classCallCheck(this, _StringIterator);
    }
    return _createClass(_StringIterator, [
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
_construct(Foo, _toConsumableArray(_toConsumableArray(new SymbolIterator).concat(_toConsumableArray(_toConsumableArray(new _StringIterator)))));
