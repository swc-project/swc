var o = {
        p: 1,
        "+": function (x) {
            return x;
        },
        "-": function (x) {
            return x + 1;
        },
    },
    o__$0 = 2,
    o__$1 = 3;
console.log(o.p === o.p, o["+"](4), o["-"](5));
