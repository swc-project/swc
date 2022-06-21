var a = {
    p: function a(b) {
        return 10 * b;
    },
    x: 1,
    y: 2
};
console.log(a.p.name, a.p === a.p, a.p(a.x), a.p(a.y));
