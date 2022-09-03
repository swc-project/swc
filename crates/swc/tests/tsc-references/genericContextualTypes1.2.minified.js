//// [genericContextualTypes1.ts]
var f00 = list, f01 = function(x) {
    return [
        x
    ];
}, f02 = wrap(list), f03 = wrap(function(x) {
    return [
        x
    ];
}), f10 = compose(function(a) {
    return list(a);
}, function(b) {
    return box(b);
}), f11 = compose(list, box), f12 = compose(function(a) {
    return unbox(a);
}, function(b) {
    return unlist(b);
}), f13 = compose(unbox, unlist), arrayMap = function(f) {
    return function(a) {
        return a.map(f);
    };
}, arrayFilter = function(f) {
    return function(a) {
        return a.filter(f);
    };
}, f20 = arrayMap(function(x) {
    return x.length;
}), f21 = arrayMap(function(x) {
    return [
        x
    ];
}), f22 = arrayMap(identity), f23 = arrayMap(function(value) {
    return {
        value: value
    };
}), f30 = arrayFilter(function(x) {
    return x.length > 10;
}), f31 = arrayFilter(function(x) {
    return x.value > 10;
}), f40 = flip(zip), fn = function(a) {
    return a;
};
