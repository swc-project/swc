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
"world";
var tmp = {
    b11: "world"
};
(void 0 === tmp ? {
    b11: "string"
} : tmp).b11;
var arr, ref = [
    void 0,
    void 0,
    void 0
], tmp1 = ref[0], tmp2 = ref[1], tmp3 = ref[2], ref1 = _slicedToArray([
    1,
    "string"
].concat(function(arr) {
    if (Array.isArray(arr)) {
        for(var i = 0, arr2 = new Array(arr.length); i < arr.length; i++)arr2[i] = arr[i];
        return arr2;
    }
}(arr = [
    !0,
    !1,
    !0
]) || function(iter) {
    if (Symbol.iterator in Object(iter) || "[object Arguments]" === Object.prototype.toString.call(iter)) return Array.from(iter);
}(arr) || function() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
}()), 2);
ref1[0], ref1[1], void 0 === tmp4;
var _e1 = _slicedToArray([
    1,
    2,
    {
        b1: 4,
        b4: 0
    }
], 3), e1 = _e1[0], e2 = _e1[1], tmp4 = _e1[2], _f = _slicedToArray([
    1,
    2,
    {
        f3: 4,
        f5: 0
    }
], 3), f1 = _f[0], f2 = _f[1], ref2 = _f[2];
ref2.f3, ref2.f5, void 0 === _g1;
var _g1 = [
    1,
    2
];
