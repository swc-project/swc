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
}(), ref = function(arr, i) {
    return (function(arr) {
        if (Array.isArray(arr)) return arr;
    })(arr) || (function(arr, i) {
        var _s, _e, _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"];
        if (null != _i) {
            var _arr = [], _n = !0, _d = !1;
            try {
                for(_i = _i.call(arr); !(_n = (_s = _i.next()).done) && (_arr.push(_s.value), !i || _arr.length !== i); _n = !0);
            } catch (err) {
                _d = !0, _e = err;
            } finally{
                try {
                    _n || null == _i.return || _i.return();
                } finally{
                    if (_d) throw _e;
                }
            }
            return _arr;
        }
    })(arr, i) || (function(o, minLen) {
        if (o) {
            if ("string" == typeof o) return _arrayLikeToArray(o, minLen);
            var n = Object.prototype.toString.call(o).slice(8, -1);
            if ("Object" === n && o.constructor && (n = o.constructor.name), "Map" === n || "Set" === n) return Array.from(n);
            if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
        }
    })(arr, i) || (function() {
        throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    })();
}(new SymbolIterator, 2);
ref[0], ref[1];
