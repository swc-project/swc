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
function _unsupportedIterableToArray(o, minLen) {
    if (o) {
        if ("string" == typeof o) return _arrayLikeToArray(o, minLen);
        var n = Object.prototype.toString.call(o).slice(8, -1);
        if ("Object" === n && o.constructor && (n = o.constructor.name), "Map" === n || "Set" === n) return Array.from(n);
        if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
    }
}
var map = new Map([
    [
        "",
        !0
    ]
]), _iteratorNormalCompletion = !0, _didIteratorError = !1, _iteratorError = void 0;
try {
    for(var ref, _step, _iterator = map[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = !0)(ref = _slicedToArray(_step.value, 2))[0], ref[1];
} catch (err) {
    _didIteratorError = !0, _iteratorError = err;
} finally{
    try {
        _iteratorNormalCompletion || null == _iterator.return || _iterator.return();
    } finally{
        if (_didIteratorError) throw _iteratorError;
    }
}
