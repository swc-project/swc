var o = {
    a: { b: o },
    f: function (x) {
        console.log(x);
    },
};
o.f(o.a);
