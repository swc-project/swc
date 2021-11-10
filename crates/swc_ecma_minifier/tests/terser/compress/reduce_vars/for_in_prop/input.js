var a = {
    foo: function () {
        for (this.b in [1, 2]);
    },
};
a.foo();
console.log(a.b);
