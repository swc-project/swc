console.log((function(a) {
    var b, c, d, e, f;
    e = a.trim().split(" ");
    f = [];
    for(c = 0, d = e.length; c < d; c++){
        b = e[c];
        f.push(b.toLowerCase());
    }
    return f;
})("test"));
