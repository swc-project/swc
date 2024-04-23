//// [contextuallyTypedIifeStrict.ts]
!function() {
    arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
}(12), function() {
    arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
}(), function() {
    for(var _len = arguments.length, numbers = Array(_len), _key = 0; _key < _len; _key++)numbers[_key] = arguments[_key];
    numbers.every(function(n) {
        return n > 0;
    });
}(5, 6, 7), function() {
    for(var _len = arguments.length, mixed = Array(_len), _key = 0; _key < _len; _key++)mixed[_key] = arguments[_key];
    mixed.every(function(n) {
        return !!n;
    });
}(5, 'oops', 'oh no'), function() {
    for(var _len = arguments.length, noNumbers = Array(_len), _key = 0; _key < _len; _key++)noNumbers[_key] = arguments[_key];
    noNumbers.some(function(n) {
        return n > 0;
    });
}(), function(first) {
    for(var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++)rest[_key - 1] = arguments[_key];
    first || rest.map(function(n) {
        return n > 0;
    });
}(8, 9, 10), function() {
    var _ref = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {
        r: 18
    };
    _ref.r;
}({
    r: 19
}), function() {
    var _ref = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {
        u: 23
    };
    _ref.u;
}(), function(o) {
    o.a(11);
}({
    a: function(n) {
        return n;
    }
});
