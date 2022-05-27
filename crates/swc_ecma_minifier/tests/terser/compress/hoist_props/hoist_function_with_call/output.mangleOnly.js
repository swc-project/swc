var a = {
    p: function b(a) {
        return 10 * a;
    },
    x: 1,
    y: 2
};
console.log(a.p.name, a.p === a.p, a.p(a.x), a.p(a.y));
