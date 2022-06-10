console.log((function(f) {
    var d, a, e, b, c;
    b = f.trim().split(" ");
    c = [];
    for(a = 0, e = b.length; a < e; a++){
        d = b[a];
        c.push(d.toLowerCase());
    }
    return c;
})("test"));
