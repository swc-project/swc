var p = {
    p: function p(n) {
        return 10 * n;
    },
    x: 1,
    y: 2,
};
console.log(p.p.name, p.p === p.p, p.p(p.x), p.p(p.y));
