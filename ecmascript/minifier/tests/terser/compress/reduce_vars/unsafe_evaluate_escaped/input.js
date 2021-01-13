console.log(function() {
    var o = {
        p: 1
    };
    console.log(o, o.p);
    return o.p;
}());
console.log(function() {
    var o = {
        p: 2
    };
    console.log(o.p, o);
    return o.p;
}());
console.log(function() {
    var o = {
        p: 3
    }, a = [
        o
    ];
    console.log(a[0].p++);
    return o.p;
}());
