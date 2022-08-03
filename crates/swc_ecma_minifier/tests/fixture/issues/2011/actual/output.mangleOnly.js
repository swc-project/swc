function e(e, n) {
    if (!(e instanceof n)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function n(e, n) {
    for(var r = 0; r < n.length; r++){
        var t = n[r];
        t.enumerable = t.enumerable || false;
        t.configurable = true;
        if ("value" in t) t.writable = true;
        Object.defineProperty(e, t.key, t);
    }
}
function r(e, r, t) {
    if (r) n(e.prototype, r);
    if (t) n(e, t);
    return e;
}
function t(e, n, r) {
    if (n in e) {
        Object.defineProperty(e, n, {
            value: r,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        e[n] = r;
    }
    return e;
}
var i = function n() {
    "use strict";
    e(this, n);
};
module.exports = (function() {
    var n = (function() {
        "use strict";
        function n() {
            e(this, n);
        }
        r(n, [
            {
                key: "it",
                value: function e() {
                    this.bb = new n.MyA();
                }
            }, 
        ]);
        return n;
    })();
    t(n, "MyA", i);
    return n;
})();
