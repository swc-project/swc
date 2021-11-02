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
try {
    throw [
        0,
        1
    ];
} catch (param) {
    var _param = _slicedToArray(param, 2);
    _param[0], _param[1];
}
try {
    throw {
        a: 0,
        b: 1
    };
} catch (param1) {
}
try {
    throw [
        {
            x: [
                0
            ],
            z: 1
        }
    ];
} catch (param2) {
    var ref = _slicedToArray(param2, 1)[0];
    _slicedToArray(ref.x, 1)[0], ref.z;
}
try {
} catch (param3) {
    _slicedToArray(param3, 1)[0];
}
