// @noImplicitAny: true
// @noImplicitThis: true
let o = {
    d: "bar",
    m () {
        return this.d.length;
    },
    f: function() {
        return this.d.length;
    }
};
let mutuallyRecursive = {
    a: 100,
    start () {
        return this.passthrough(this.a);
    },
    passthrough (n) {
        return this.sub1(n);
    },
    sub1 (n) {
        if (n > 0) {
            return this.passthrough(n - 1);
        }
        return n;
    }
};
var i = mutuallyRecursive.start();
var impl = mutuallyRecursive;
