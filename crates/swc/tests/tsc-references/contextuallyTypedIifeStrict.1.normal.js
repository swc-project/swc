//// [contextuallyTypedIifeStrict.ts]
// arrow
(function(jake) {})("build");
// function expression
(function(cats) {})("lol");
// Lots of Irritating Superfluous Parentheses
(function(x) {})("!");
(function(y) {})("-");
// multiple arguments
(function(a, b, c) {})("foo", 101, false);
// default parameters
(function() {
    var m = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 10;
    return m + 1;
})(12);
(function() {
    var n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 10;
    return n + 1;
})();
// optional parameters
(function(j) {
    return j + 1;
})(12);
(function(k) {
    return k + 1;
})();
(function(l, o) {
    return l + o;
})(12);
// rest parameters
(function() {
    for(var _len = arguments.length, numbers = new Array(_len), _key = 0; _key < _len; _key++){
        numbers[_key] = arguments[_key];
    }
    return numbers.every(function(n) {
        return n > 0;
    });
})(5, 6, 7);
(function() {
    for(var _len = arguments.length, mixed = new Array(_len), _key = 0; _key < _len; _key++){
        mixed[_key] = arguments[_key];
    }
    return mixed.every(function(n) {
        return !!n;
    });
})(5, 'oops', 'oh no');
(function() {
    for(var _len = arguments.length, noNumbers = new Array(_len), _key = 0; _key < _len; _key++){
        noNumbers[_key] = arguments[_key];
    }
    return noNumbers.some(function(n) {
        return n > 0;
    });
})();
(function(first) {
    for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        rest[_key - 1] = arguments[_key];
    }
    return first ? [] : rest.map(function(n) {
        return n > 0;
    });
})(8, 9, 10);
// destructuring parameters (with defaults too!)
(function(param) {
    var q = param.q;
    return q;
})({
    q: 13
});
(function(param) {
    var _param_p = param.p, p = _param_p === void 0 ? 14 : _param_p;
    return p;
})({
    p: 15
});
(function() {
    var _ref = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {
        r: 18
    }, _ref_r = _ref.r, r = _ref_r === void 0 ? 17 : _ref_r;
    return r;
})({
    r: 19
});
(function() {
    var _ref = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {
        u: 23
    }, _ref_u = _ref.u, u = _ref_u === void 0 ? 22 : _ref_u;
    return u;
})();
// contextually typed parameters.
var twelve = function(f) {
    return f(12);
}(function(i) {
    return i;
});
var eleven = function(o) {
    return o.a(11);
}({
    a: function a(n) {
        return n;
    }
});
// missing arguments
(function(x, undefined) {
    return x;
})(42);
(function(x, y, z) {
    return 42;
})();
