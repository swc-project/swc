var g = function(...a) {
    return function(k, v) {
        return a[k](v);
    };
}(1);
console.log(g("push", 2), g("push", 3));
