// @noImplicitAny: true
// @noImplicitThis: true
var o = {
    d: "bar",
    m: function() {
        return this.d.length;
    },
    f: function f() {
        return this.d.length;
    }
};
var mutuallyRecursive = {
    a: 100,
    start: function() {
        return this.passthrough(this.a);
    },
    passthrough: function(n) {
        return this.sub1(n);
    },
    sub1: function(n) {
        if (n > 0) {
            return this.passthrough(n - 1);
        }
        return n;
    }
};
var i = mutuallyRecursive.start();
var impl = mutuallyRecursive;
