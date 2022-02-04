({
    a: 100,
    start () {
        return this.passthrough(this.a);
    },
    passthrough (n) {
        return this.sub1(n);
    },
    sub1 (n) {
        return n > 0 ? this.passthrough(n - 1) : n;
    }
}).start();
