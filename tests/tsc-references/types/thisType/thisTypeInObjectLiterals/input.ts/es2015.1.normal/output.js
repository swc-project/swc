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
    sub1 (n1) {
        if (n1 > 0) {
            return this.passthrough(n1 - 1);
        }
        return n1;
    }
};
var i = mutuallyRecursive.start();
var impl = mutuallyRecursive;
