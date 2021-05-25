var a = 0,
    b = 0;
var foo = {
    get c() {
        return a++, 42;
    },
    set c(c) {
        b++;
    },
    d: function () {
        if ((this.c++, this.c)) console.log(a, b);
    },
};
foo.d();
