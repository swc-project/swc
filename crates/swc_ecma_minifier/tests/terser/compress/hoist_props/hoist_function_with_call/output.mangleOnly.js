var p = {
    p: function p(p) {
        return 10 * p;
    },
    x: 1,
    y: 2
};
console.log(p.p.name, p.p === p.p, p.p(p.x), p.p(p.y));
