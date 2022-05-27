var a = {
    a: 1,
    b: 2,
    f: function(a) {
        this.b = a;
    }
};
console.log(new a.f(a.a).b, a.b);
