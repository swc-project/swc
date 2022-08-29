(function(t) {
    "use strict";
    var r = (function() {
        try {
            if (t.URLSearchParams && new t.URLSearchParams("foo=bar").get("foo") === "bar") {
                return t.URLSearchParams;
            }
        } catch (r) {}
        return null;
    })(), n = r && new r({
        a: 1
    }).toString() === "a=1", e = r && new r("s=%2B").get("s") === "+", i = "__URLSearchParams__", o = r ? (function() {
        var t = new r();
        t.append("s", " &");
        return t.toString() === "s=+%26";
    })() : true, a = u.prototype, f = !!(t.Symbol && t.Symbol.iterator);
    if (r && n && e && o) {
        return;
    }
    function u(t) {
        t = t || "";
        if (t instanceof URLSearchParams || t instanceof u) {
            t = t.toString();
        }
        this[i] = y(t);
    }
    a.append = function(t, r) {
        S(this[i], t, r);
    };
    a["delete"] = function(t) {
        delete this[i][t];
    };
    a.get = function(t) {
        var r = this[i];
        return this.has(t) ? r[t][0] : null;
    };
    a.getAll = function(t) {
        var r = this[i];
        return this.has(t) ? r[t].slice(0) : [];
    };
    a.has = function(t) {
        return d(this[i], t);
    };
    a.set = function t(r, n) {
        this[i][r] = [
            "" + n
        ];
    };
    a.toString = function() {
        var t = this[i], r = [], n, e, o, a;
        for(e in t){
            o = p(e);
            for(n = 0, a = t[e]; n < a.length; n++){
                r.push(o + "=" + p(a[n]));
            }
        }
        return r.join("&");
    };
    var s = !e;
    var c = !s && r && !n && t.Proxy;
    var h;
    if (c) {
        h = new Proxy(r, {
            construct: function(t, r) {
                return new t(new u(r[0]).toString());
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
    l.forEach = l.forEach || function(t, r) {
        var n = y(this.toString());
        Object.getOwnPropertyNames(n).forEach(function(e) {
            n[e].forEach(function(n) {
                t.call(r, n, e, this);
            }, this);
        }, this);
    };
    l.sort = l.sort || function() {
        var t = y(this.toString()), r = [], n, e, i;
        for(n in t){
            r.push(n);
        }
        r.sort();
        for(e = 0; e < r.length; e++){
            this["delete"](r[e]);
        }
        for(e = 0; e < r.length; e++){
            var o = r[e], a = t[o];
            for(i = 0; i < a.length; i++){
                this.append(o, a[i]);
            }
        }
    };
    l.keys = l.keys || function() {
        var t = [];
        this.forEach(function(r, n) {
            t.push(n);
        });
        return g(t);
    };
    l.values = l.values || function() {
        var t = [];
        this.forEach(function(r) {
            t.push(r);
        });
        return g(t);
    };
    l.entries = l.entries || function() {
        var t = [];
        this.forEach(function(r, n) {
            t.push([
                n,
                r
            ]);
        });
        return g(t);
    };
    if (f) {
        l[t.Symbol.iterator] = l[t.Symbol.iterator] || l.entries;
    }
    function p(t) {
        var r = {
            "!": "%21",
            "'": "%27",
            "(": "%28",
            ")": "%29",
            "~": "%7E",
            "%20": "+",
            "%00": "\x00"
        };
        return encodeURIComponent(t).replace(/[!'\(\)~]|%20|%00/g, function(t) {
            return r[t];
        });
    }
    function v(t) {
        return t.replace(/[ +]/g, "%20").replace(/(%[a-f0-9]{2})+/gi, function(t) {
            return decodeURIComponent(t);
        });
    }
    function g(r) {
        var n = {
            next: function() {
                var t = r.shift();
                return {
                    done: t === undefined,
                    value: t
                };
            }
        };
        if (f) {
            n[t.Symbol.iterator] = function() {
                return n;
            };
        }
        return n;
    }
    function y(t) {
        var r = {};
        if (typeof t === "object") {
            if ($(t)) {
                for(var n = 0; n < t.length; n++){
                    var e = t[n];
                    if ($(e) && e.length === 2) {
                        S(r, e[0], e[1]);
                    } else {
                        throw new TypeError("Failed to construct 'URLSearchParams': Sequence initializer must only contain pair elements");
                    }
                }
            } else {
                for(var i in t){
                    if (t.hasOwnProperty(i)) {
                        S(r, i, t[i]);
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
                    S(r, v(f.slice(0, u)), v(f.slice(u + 1)));
                } else {
                    if (f) {
                        S(r, v(f), "");
                    }
                }
            }
        }
        return r;
    }
    function S(t, r, n) {
        var e = typeof n === "string" ? n : n !== null && n !== undefined && typeof n.toString === "function" ? n.toString() : JSON.stringify(n);
        if (d(t, r)) {
            t[r].push(e);
        } else {
            t[r] = [
                e
            ];
        }
    }
    function $(t) {
        return (!!t && "[object Array]" === Object.prototype.toString.call(t));
    }
    function d(t, r) {
        return Object.prototype.hasOwnProperty.call(t, r);
    }
})(typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : this);
