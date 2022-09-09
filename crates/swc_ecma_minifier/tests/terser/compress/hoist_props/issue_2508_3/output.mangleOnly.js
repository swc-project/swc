var o = {
    a: [o],
    f: function (o) {
        console.log(o);
    },
};
o.f(o.a);
