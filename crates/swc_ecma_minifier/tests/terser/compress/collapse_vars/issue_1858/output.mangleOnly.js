console.log((function(b) {
    var a = {}, c = (a.b = b);
    return a.b + c;
})(1));
