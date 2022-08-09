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
    })() : true, f = u.prototype, a = !!(t.Symbol && t.Symbol.iterator);
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
    f.append = function(t, n) {
        S(this[i], t, n);
    };
    f["delete"] = function(t) {
        delete this[i][t];
    };
    f.get = function(t) {
        var n = this[i];
        return this.has(t) ? n[t][0] : null;
    };
    f.getAll = function(t) {
        var n = this[i];
        return this.has(t) ? n[t].slice(0) : [];
    };
    f.has = function(t) {
        return w(this[i], t);
    };
    f.set = function t(n, r) {
        this[i][n] = [
            "" + r
        ];
    };
    f.toString = function() {
        var t = this[i], n = [], r, e, o, f;
        for(e in t){
            o = p(e);
            for(r = 0, f = t[e]; r < f.length; r++){
                n.push(o + "=" + p(f[r]));
            }
        }
        return n.join("&");
    };
    var s = !e;
    var c = !s && n && !r && t.Proxy;
    var h;
    if (c) {
        h = new Proxy(n, {
            construct: function(t, n) {
                return new t(new u(n[0]).toString());
            }
        });
        h.toString = Function.prototype.toString.bind(u);
    } else {
        h = u;
    }
    Object.defineProperty(t, "URLSearchParams", {
        value: h
    });
    var l = t.URLSearchParams.prototype;
    l.polyfill = true;
    l.forEach = l.forEach || function(t, n) {
        var r = y(this.toString());
        Object.getOwnPropertyNames(r).forEach(function(e) {
            r[e].forEach(function(r) {
                t.call(n, r, e, this);
            }, this);
        }, this);
    };
    l.sort = l.sort || function() {
        var t = y(this.toString()), n = [], r, e, i;
        for(r in t){
            n.push(r);
        }
        n.sort();
        for(e = 0; e < n.length; e++){
            this["delete"](n[e]);
        }
        for(e = 0; e < n.length; e++){
            var o = n[e], f = t[o];
            for(i = 0; i < f.length; i++){
                this.append(o, f[i]);
            }
        }
    };
    l.keys = l.keys || function() {
        var t = [];
        this.forEach(function(n, r) {
            t.push(r);
        });
        return g(t);
    };
    l.values = l.values || function() {
        var t = [];
        this.forEach(function(n) {
            t.push(n);
        });
        return g(t);
    };
    l.entries = l.entries || function() {
        var t = [];
        this.forEach(function(n, r) {
            t.push([
                r,
                n
            ]);
        });
        return g(t);
    };
    if (a) {
        l[t.Symbol.iterator] = l[t.Symbol.iterator] || l.entries;
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
    function v(t) {
        return t.replace(/[ +]/g, "%20").replace(/(%[a-f0-9]{2})+/gi, function(t) {
            return decodeURIComponent(t);
        });
    }
    function g(n) {
        var r = {
            next: function() {
                var t = n.shift();
                return {
                    done: t === undefined,
                    value: t
                };
            }
        };
        if (a) {
            r[t.Symbol.iterator] = function() {
                return r;
            };
        }
        return r;
    }
    function y(t) {
        var n = {};
        if (typeof t === "object") {
            if ($(t)) {
                for(var r = 0; r < t.length; r++){
                    var e = t[r];
                    if ($(e) && e.length === 2) {
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
            for(var f = 0; f < o.length; f++){
                var a = o[f], u = a.indexOf("=");
                if (-1 < u) {
                    S(n, v(a.slice(0, u)), v(a.slice(u + 1)));
                } else {
                    if (a) {
                        S(n, v(a), "");
                    }
                }
            }
        }
        return n;
    }
    function S(t, n, r) {
        var e = typeof r === "string" ? r : r !== null && r !== undefined && typeof r.toString === "function" ? r.toString() : JSON.stringify(r);
        if (w(t, n)) {
            t[n].push(e);
        } else {
            t[n] = [
                e
            ];
        }
    }
    function $(t) {
        return (!!t && "[object Array]" === Object.prototype.toString.call(t));
    }
    function w(t, n) {
        return Object.prototype.hasOwnProperty.call(t, n);
    }
})(typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : this);
