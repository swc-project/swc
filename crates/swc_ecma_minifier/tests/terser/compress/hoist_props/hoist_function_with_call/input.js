var o = {
    p: function Foo(value) {
        return 10 * value;
    },
    x: 1,
    y: 2,
};
console.log(o.p.name, o.p === o.p, o.p(o.x), o.p(o.y));
