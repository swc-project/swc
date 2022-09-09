var o = {
    a: { b: o },
    f: function (o) {
        console.log(o);
    },
};
o.f(o.a);
