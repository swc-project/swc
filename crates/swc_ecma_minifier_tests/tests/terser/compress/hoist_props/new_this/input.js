var o = {
    a: 1,
    b: 2,
    f: function (a) {
        this.b = a;
    },
};
console.log(new o.f(o.a).b, o.b);
