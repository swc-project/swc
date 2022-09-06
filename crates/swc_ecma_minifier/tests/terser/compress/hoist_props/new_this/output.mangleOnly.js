var b = {
    a: 1,
    b: 2,
    f: function (b) {
        this.b = b;
    },
};
console.log(new b.f(b.a).b, b.b);
