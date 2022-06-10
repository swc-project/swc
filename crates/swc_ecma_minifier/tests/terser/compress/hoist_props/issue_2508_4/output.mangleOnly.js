var a = {
    a: {
        b: a
    },
    f: function(a) {
        console.log(a);
    }
};
a.f(a.a);
