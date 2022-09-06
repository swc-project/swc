var c = 0,
    t = 0;
var e = {
    get c() {
        c++;
        return 42;
    },
    set c(c) {
        t++;
    },
    d: function () {
        this.c++;
        if (this.c) console.log(c, t);
    },
};
e.d();
