({
    a: 100,
    start () {
        return this.passthrough(this.a);
    },
    passthrough (n) {
        return this.sub1(n);
    },
    sub1 (n1) {
        return n1 > 0 ? this.passthrough(n1 - 1) : n1;
    }
}).start();
