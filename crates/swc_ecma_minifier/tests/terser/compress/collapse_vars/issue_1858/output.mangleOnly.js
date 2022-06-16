console.log((function(a) {
    var b = {}, c = (b.b = a);
    return b.b + c;
})(1));
