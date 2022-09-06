(function(t) {
    "use strict";
    var n = (function() {
        try {
            if (t.URLSearchParams && new t.URLSearchParams("foo=bar").get("foo") === "bar") {
                return t.URLSearchParams;
            }
        } catch (n) {}
        return null;
    })(), r = n && new n({
        a: 1
    }).toString() === "a=1", e = n && new n("s=%2B").get("s") === "+", i = "__URLSearchParams__", o = n ? (function() {
        var t = new n();
        t.append("s", " &");
        return t.toString() === "s=+%26";
    })() : true, a = u.prototype, f = !!(t.Symbol && t.Symbol.iterator);
    if (n && r && e && o) {
        return;
    }
    function u(t) {
        t = t || "";
        if (t instanceof URLSearchParams || t instanceof u) {
            t = t.toString();
        }
        this[i] = y(t);
    }
    a.append = function(t, n) {
        S(this[i], t, n);
    };
    a["delete"] = function(t) {
        delete this[i][t];
    };
    a.get = function(t) {
        var n = this[i];
        return this.has(t) ? n[t][0] : null;
    };
    a.getAll = function(t) {
        var n = this[i];
        return this.has(t) ? n[t].slice(0) : [];
    };
    a.has = function(t) {
        return m(this[i], t);
    };
    a.set = function t(n, r) {
        this[i][n] = [
            "" + r
        ];
    };
    a.toString = function() {
        var t = this[i], n = [], r, e, o, a;
        for(e in t){
            o = p(e);
            for(r = 0, a = t[e]; r < a.length; r++){
                n.push(o + "=" + p(a[r]));
            }
        }
        return n.join("&");
    };
    var c = !e;
    var s = !c && n && !r && t.Proxy;
    var l;
    if (s) {
        l = new Proxy(n, {
            construct: function(t, n) {
                return new t(new u(n[0]).toString());
            }
        });
        l.toString = Function.prototype.toString.bind(u);
    } else {
        l = u;
    }
    Object.defineProperty(t, "URLSearchParams", {
        value: l
    });
    var h = t.URLSearchParams.prototype;
    h.polyfill = true;
    h.forEach = h.forEach || function(t, n) {
        var r = y(this.toString());
        Object.getOwnPropertyNames(r).forEach(function(e) {
            r[e].forEach(function(r) {
                t.call(n, r, e, this);
            }, this);
        }, this);
    };
    h.sort = h.sort || function() {
        var t = y(this.toString()), n = [], r, e, i;
        for(r in t){
            n.push(r);
        }
        n.sort();
        for(e = 0; e < n.length; e++){
            this["delete"](n[e]);
        }
        for(e = 0; e < n.length; e++){
            var o = n[e], a = t[o];
            for(i = 0; i < a.length; i++){
                this.append(o, a[i]);
            }
        }
    };
    h.keys = h.keys || function() {
        var t = [];
        this.forEach(function(n, r) {
            t.push(r);
        });
        return v(t);
    };
    h.values = h.values || function() {
        var t = [];
        this.forEach(function(n) {
            t.push(n);
        });
        return v(t);
    };
    h.entries = h.entries || function() {
        var t = [];
        this.forEach(function(n, r) {
            t.push([
                r,
                n
            ]);
        });
        return v(t);
    };
    if (f) {
        h[t.Symbol.iterator] = h[t.Symbol.iterator] || h.entries;
    }
    function p(t) {
        var n = {
            "!": "%21",
            "'": "%27",
            "(": "%28",
            ")": "%29",
            "~": "%7E",
            "%20": "+",
            "%00": "\x00"
        };
        return encodeURIComponent(t).replace(/[!'\(\)~]|%20|%00/g, function(t) {
            return n[t];
        });
    }
    function g(t) {
        return t.replace(/[ +]/g, "%20").replace(/(%[a-f0-9]{2})+/gi, function(t) {
            return decodeURIComponent(t);
        });
    }
    function v(n) {
        var r = {
            next: function() {
                var t = n.shift();
                return {
                    done: t === undefined,
                    value: t
                };
            }
        };
        if (f) {
            r[t.Symbol.iterator] = function() {
                return r;
            };
        }
        return r;
    }
    function y(t) {
        var n = {};
        if (typeof t === "object") {
            if (d(t)) {
                for(var r = 0; r < t.length; r++){
                    var e = t[r];
                    if (d(e) && e.length === 2) {
                        S(n, e[0], e[1]);
                    } else {
                        throw new TypeError("Failed to construct 'URLSearchParams': Sequence initializer must only contain pair elements");
                    }
                }
            } else {
                for(var i in t){
                    if (t.hasOwnProperty(i)) {
                        S(n, i, t[i]);
                    }
                }
            }
        } else {
            if (t.indexOf("?") === 0) {
                t = t.slice(1);
            }
            var o = t.split("&");
            for(var a = 0; a < o.length; a++){
                var f = o[a], u = f.indexOf("=");
                if (-1 < u) {
                    S(n, g(f.slice(0, u)), g(f.slice(u + 1)));
                } else {
                    if (f) {
                        S(n, g(f), "");
                    }
                }
            }
        }
        return n;
    }
    function S(t, n, r) {
        var e = typeof r === "string" ? r : r !== null && r !== undefined && typeof r.toString === "function" ? r.toString() : JSON.stringify(r);
        if (m(t, n)) {
            t[n].push(e);
        } else {
            t[n] = [
                e
            ];
        }
    }
    function d(t) {
        return (!!t && "[object Array]" === Object.prototype.toString.call(t));
    }
    function m(t, n) {
        return Object.prototype.hasOwnProperty.call(t, n);
    }
})(typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : this);
