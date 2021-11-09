function _slicedToArray(arr, i) {
    return (function(arr) {
        if (Array.isArray(arr)) return arr;
    })(arr) || (function(arr, i) {
        var _arr = [], _n = !0, _d = !1, _e = void 0;
        try {
            for(var _s, _i = arr[Symbol.iterator](); !(_n = (_s = _i.next()).done) && (_arr.push(_s.value), !i || _arr.length !== i); _n = !0);
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
    })(arr, i) || (function() {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
    })();
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
