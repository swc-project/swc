function e(e, n) {
    if (!(e instanceof n)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function n(e, n) {
    for(var t = 0; t < n.length; t++){
        var r = n[t];
        r.enumerable = r.enumerable || false;
        r.configurable = true;
        if ("value" in r) r.writable = true;
        Object.defineProperty(e, r.key, r);
    }
}
function t(e, t, r) {
    if (t) n(e.prototype, t);
    if (r) n(e, r);
    return e;
}
function r(e, n, t) {
    if (n in e) {
        Object.defineProperty(e, n, {
            value: t,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        e[n] = t;
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
        t(n, [
            {
                key: "it",
                value: function e() {
                    this.bb = new n.MyA();
                }
            }, 
        ]);
        return n;
    })();
    r(n, "MyA", i);
    return n;
})();
