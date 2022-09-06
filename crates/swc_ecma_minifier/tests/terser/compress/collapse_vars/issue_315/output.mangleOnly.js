console.log(
    (function (t) {
        var o, e, r, n, s;
        n = t.trim().split(" ");
        s = [];
        for (e = 0, r = n.length; e < r; e++) {
            o = n[e];
            s.push(o.toLowerCase());
        }
        return s;
    })("test")
);
