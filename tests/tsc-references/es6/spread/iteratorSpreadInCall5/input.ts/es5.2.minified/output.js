function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
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
function _toConsumableArray(arr) {
    return (function(arr) {
        if (Array.isArray(arr)) {
            for(var i = 0, arr2 = new Array(arr.length); i < arr.length; i++)arr2[i] = arr[i];
            return arr2;
        }
    })(arr) || (function(iter) {
        if (Symbol.iterator in Object(iter) || "[object Arguments]" === Object.prototype.toString.call(iter)) return Array.from(iter);
    })(arr) || (function() {
        throw new TypeError("Invalid attempt to spread non-iterable instance");
    })();
}
var tmp = Symbol.iterator, SymbolIterator = function() {
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
            key: tmp,
            value: function() {
                return this;
            }
        }
    ]), SymbolIterator;
}(), tmp1 = Symbol.iterator, _StringIterator = function() {
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
            key: tmp1,
            value: function() {
                return this;
            }
        }
    ]), _StringIterator;
}();
(function() {
    for(var _len = arguments.length, s = new Array(_len), _key = 0; _key < _len; _key++)s[_key] = arguments[_key];
}).apply(void 0, _toConsumableArray(new SymbolIterator).concat(_toConsumableArray(new _StringIterator)));
