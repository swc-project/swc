//// [thisTypeInObjectLiterals.ts]
var o = {
    d: "bar",
    m: function() {
        return this.d.length;
    },
    f: function() {
        return this.d.length;
    }
}, mutuallyRecursive = {
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
}, i = mutuallyRecursive.start(), impl = mutuallyRecursive;
