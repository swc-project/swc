console.log((function(r) {
    var t, o, e, n, i;
    n = r.trim().split(" ");
    i = [];
    for(o = 0, e = n.length; o < e; o++){
        t = n[o];
        i.push(t.toLowerCase());
    }
    return i;
})("test"));
