function a(a, b) {
    if (!(a instanceof b)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function b(a, b) {
    for(var c = 0; c < b.length; c++){
        var d = b[c];
        d.enumerable = d.enumerable || false;
        d.configurable = true;
        if ("value" in d) d.writable = true;
        Object.defineProperty(a, d.key, d);
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
