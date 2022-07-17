// @strict: true
// @declaration: true
var f00 = list;
var f01 = function(x) {
    return [
        x
    ];
};
var f02 = wrap(list);
var f03 = wrap(function(x) {
    return [
        x
    ];
});
var f10 = compose(function(a) {
    return list(a);
}, function(b) {
    return box(b);
});
var f11 = compose(list, box);
var f12 = compose(function(a) {
    return unbox(a);
}, function(b) {
    return unlist(b);
});
var f13 = compose(unbox, unlist);
var arrayMap = function(f) {
    return function(a) {
        return a.map(f);
    };
};
var arrayFilter = function(f) {
    return function(a) {
        return a.filter(f);
    };
};
var f20 = arrayMap(function(x) {
    return x.length;
});
var f21 = arrayMap(function(x) {
    return [
        x
    ];
});
var f22 = arrayMap(identity);
var f23 = arrayMap(function(value) {
    return {
        value: value
    };
});
var f30 = arrayFilter(function(x) {
    return x.length > 10;
});
var f31 = arrayFilter(function(x) {
    return x.value > 10;
});
var f40 = flip(zip);
var fn = function(a) {
    return a;
};
