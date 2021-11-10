wrap(list), wrap(function(x) {
    return [
        x
    ];
}), compose(function(a) {
    return list(a);
}, function(b) {
    return box(b);
}), compose(list, box), compose(function(a) {
    return unbox(a);
}, function(b) {
    return unlist(b);
}), compose(unbox, unlist);
var arrayMap = function(f) {
    return function(a) {
        return a.map(f);
    };
}, arrayFilter = function(f) {
    return function(a) {
        return a.filter(f);
    };
};
arrayMap(function(x) {
    return x.length;
}), arrayMap(function(x) {
    return [
        x
    ];
}), arrayMap(identity), arrayMap(function(value) {
    return {
        value: value
    };
}), arrayFilter(function(x) {
    return x.length > 10;
}), arrayFilter(function(x) {
    return x.value > 10;
}), flip(zip);
