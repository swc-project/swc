var o = {
    a: { b: 2 },
    f: function (o) {
        console.log(o);
    },
};
o.f(o.a);
