//// [thisTypeInObjectLiterals.ts]
({
    a: 100,
    start: function() {
        return this.passthrough(this.a);
    },
    passthrough: function(n) {
        return this.sub1(n);
    },
    sub1: function(n) {
        return n > 0 ? this.passthrough(n - 1) : n;
    }
}).start();
