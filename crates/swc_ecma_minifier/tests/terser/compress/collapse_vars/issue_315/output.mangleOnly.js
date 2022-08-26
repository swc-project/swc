console.log((function(t) {
    var r, e, o, n, s;
    n = t.trim().split(" ");
    s = [];
    for(e = 0, o = n.length; e < o; e++){
        r = n[e];
        s.push(r.toLowerCase());
    }
    return s;
})("test"));
