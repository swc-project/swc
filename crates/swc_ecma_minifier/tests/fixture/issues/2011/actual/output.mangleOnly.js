function a(a, b) {
    if (!(a instanceof b)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function b(d, c) {
    for(var b = 0; b < c.length; b++){
        var a = c[b];
        a.enumerable = a.enumerable || false;
        a.configurable = true;
        if ("value" in a) a.writable = true;
        Object.defineProperty(d, a.key, a);
    }
}
function c(a, c, d) {
    if (c) b(a.prototype, c);
    if (d) b(a, d);
    return a;
}
function d(a, b, c) {
    if (b in a) {
        Object.defineProperty(a, b, {
            value: c,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        a[b] = c;
    }
    return a;
}
var e = function b() {
    "use strict";
    a(this, b);
};
module.exports = (function() {
    var b = (function() {
        "use strict";
        function b() {
            a(this, b);
        }
        c(b, [
            {
                key: "it",
                value: function a() {
                    this.bb = new b.MyA();
                }
            }, 
        ]);
        return b;
    })();
    d(b, "MyA", e);
    return b;
})();
