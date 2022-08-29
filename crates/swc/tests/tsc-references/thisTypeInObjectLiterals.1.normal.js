//// [thisTypeInObjectLiterals.ts]
var o = {
    d: "bar",
    m: function m() {
        return this.d.length;
    },
    f: function f() {
        return this.d.length;
    }
};
var mutuallyRecursive = {
    a: 100,
    start: function start() {
        return this.passthrough(this.a);
    },
    passthrough: function passthrough(n) {
        return this.sub1(n);
    },
    sub1: function sub1(n) {
        if (n > 0) {
            return this.passthrough(n - 1);
        }
        return n;
    }
};
var i = mutuallyRecursive.start();
var impl = mutuallyRecursive;
