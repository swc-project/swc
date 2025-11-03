var p = {
    p: function p(_p) {
        return 10 * _p;
    },
    x: 1,
    y: 2
};
console.log(p.p.name, p.p === p.p, p.p(p.x), p.p(p.y));
