console.log((function(n) {
    var r = {}, b = (r.b = n);
    return r.b + b;
})(1));
