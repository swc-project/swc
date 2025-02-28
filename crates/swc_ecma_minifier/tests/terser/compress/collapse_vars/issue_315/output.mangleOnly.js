console.log((function(o) {
    var r, n, s, e, t;
    e = o.trim().split(" ");
    t = [];
    for(n = 0, s = e.length; n < s; n++){
        r = e[n];
        t.push(r.toLowerCase());
    }
    return t;
})("test"));
