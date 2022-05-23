var o = {
    a: [o],
    f: function (x) {
        console.log(x);
    },
};
o.f(o.a);
