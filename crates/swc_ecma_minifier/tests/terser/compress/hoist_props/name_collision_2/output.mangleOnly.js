var a = {
    p: 1,
    "+": function(a) {
        return a;
    },
    "-": function(a) {
        return a + 1;
    }
}, b = 2, c = 3;
console.log(a.p === a.p, a["+"](4), a["-"](5), b, c);
