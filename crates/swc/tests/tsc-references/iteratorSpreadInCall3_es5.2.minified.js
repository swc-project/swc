function _arrayLikeToArray(arr, len) {
    (null == len || len > arr.length) && (len = arr.length);
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
var _iterator = Symbol.iterator, SymbolIterator = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function SymbolIterator() {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, SymbolIterator);
    }
    return Constructor = SymbolIterator, protoProps = [
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
    ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), SymbolIterator;
}();
(function() {
    for(var _len = arguments.length, s = new Array(_len), _key = 0; _key < _len; _key++)s[_key] = arguments[_key];
}).apply(void 0, function(arr) {
    return (function(arr) {
        if (Array.isArray(arr)) return _arrayLikeToArray(arr);
    })(arr) || (function(iter) {
        if ("undefined" != typeof Symbol && null != iter[Symbol.iterator] || null != iter["@@iterator"]) return Array.from(iter);
    })(arr) || (function(o, minLen) {
        if (o) {
            if ("string" == typeof o) return _arrayLikeToArray(o, minLen);
            var n = Object.prototype.toString.call(o).slice(8, -1);
            if ("Object" === n && o.constructor && (n = o.constructor.name), "Map" === n || "Set" === n) return Array.from(n);
            if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
        }
    })(arr) || (function() {
        throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    })();
}(new SymbolIterator));
