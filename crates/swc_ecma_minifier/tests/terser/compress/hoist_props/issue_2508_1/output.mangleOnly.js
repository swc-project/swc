var o = {
    a: [1],
    f: function (o) {
        console.log(o);
    },
};
o.f(o.a);
