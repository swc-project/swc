var n = {
        p: 1,
        "+": function (n) {
            return n;
        },
        "-": function (n) {
            return n + 1;
        },
    },
    o = 2,
    r = 3;
console.log(n.p === n.p, n["+"](4), n["-"](5));
