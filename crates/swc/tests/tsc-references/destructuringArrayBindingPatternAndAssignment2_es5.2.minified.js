function _arrayLikeToArray(arr, len) {
    (null == len || len > arr.length) && (len = arr.length);
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _slicedToArray(arr, i) {
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
    })(arr, i) || _unsupportedIterableToArray(arr, i) || (function() {
        throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    })();
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
var ref = [], a0 = _slicedToArray(ref[0], 1)[0], ref1 = _slicedToArray(ref[1], 1), ref2 = _slicedToArray(ref1[0], 1);
ref2[0];
var _undefined = _slicedToArray(void 0, 2), ref3 = _slicedToArray(_undefined[0], 1), a2 = ref3[0], ref4 = _slicedToArray(_undefined[1], 1), ref5 = _slicedToArray(ref4[0], 1);
ref5[0];
var ref6 = _slicedToArray([
    1,
    2,
    3
], 3);
ref6[0], ref6[1], ref6[2];
var temp = [
    1,
    2,
    3
], ref7 = _slicedToArray(_toConsumableArray(temp), 2);
ref7[0], ref7[1];
var ref8 = _slicedToArray(_toConsumableArray(temp), 2);
ref8[0], ref8[1];
var ref9 = _slicedToArray({
    2: !0
}, 3);
ref9[0], ref9[1], ref9[2];
