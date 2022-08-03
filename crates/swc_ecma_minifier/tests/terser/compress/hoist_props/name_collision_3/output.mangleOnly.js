var n = {
    p: 1,
    "+": function(n) {
        return n;
    },
    "-": function(n) {
        return n + 1;
    }
}, r = 2, t = 3;
console.log(n.p === n.p, n["+"](4), n["-"](5));
