function foo(param) {
    var arr, i, _x = (i = 2, function(arr) {
        if (Array.isArray(arr)) return arr;
    }(arr = param.x) || function(arr, i) {
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
    }(arr, i) || function() {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }()), a = _x[0], b = _x[1], _y = param.y;
    _y.c, _y.d, _y.e;
}
function baz(x) {
}
foo({
    x: [
        "string",
        1
    ],
    y: {
        c: !0,
        d: "world",
        e: 3
    }
}), foo({
    x: [
        "string",
        1
    ],
    y: {
        c: !0,
        d: "world",
        e: 3
    }
});
var arr, array = [
    "string",
    1,
    !0
];
baz([
    "string",
    1,
    !0
]), baz([
    "string",
    1,
    !0
]), baz(array), baz([
    "string",
    1,
    !0
].concat(function(arr) {
    if (Array.isArray(arr)) {
        for(var i = 0, arr2 = new Array(arr.length); i < arr.length; i++)arr2[i] = arr[i];
        return arr2;
    }
}(arr = array) || function(iter) {
    if (Symbol.iterator in Object(iter) || "[object Arguments]" === Object.prototype.toString.call(iter)) return Array.from(iter);
}(arr) || function() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
}())), foo({
    x: [
        "string",
        1
    ],
    y: {
        c: !0,
        d: "world",
        e: 3
    }
});
