(function(a) {
    "use strict";
    var b = (function() {
        try {
            if (a.URLSearchParams && new a.URLSearchParams("foo=bar").get("foo") === "bar") {
                return a.URLSearchParams;
            }
        } catch (b) {}
        return null;
    })(), c = b && new b({
        a: 1
    }).toString() === "a=1", d = b && new b("s=%2B").get("s") === "+", e = "__URLSearchParams__", f = b ? (function() {
        var a = new b();
        a.append("s", " &");
        return a.toString() === "s=+%26";
    })() : true, g = i.prototype, h = !!(a.Symbol && a.Symbol.iterator);
    if (b && c && d && f) {
        return;
    }
    function i(a) {
        a = a || "";
        if (a instanceof URLSearchParams || a instanceof i) {
            a = a.toString();
        }
        this[e] = q(a);
    }
    g.append = function(a, b) {
        r(this[e], a, b);
    };
    g["delete"] = function(a) {
        delete this[e][a];
    };
    g.get = function(a) {
        var b = this[e];
        return this.has(a) ? b[a][0] : null;
    };
    g.getAll = function(a) {
        var b = this[e];
        return this.has(a) ? b[a].slice(0) : [];
    };
    g.has = function(a) {
        return t(this[e], a);
    };
    g.set = function a(b, c) {
        this[e][b] = [
            "" + c
        ];
    };
    g.toString = function() {
        var a = this[e], b = [], c, d, f, g;
        for(d in a){
            f = n(d);
            for(c = 0, g = a[d]; c < g.length; c++){
                b.push(f + "=" + n(g[c]));
            }
        }
        return b.join("&");
    };
    var j = !d;
    var k = !j && b && !c && a.Proxy;
    var l;
    if (k) {
        l = new Proxy(b, {
            construct: function(a, b) {
                return new a(new i(b[0]).toString());
            }
        });
        l.toString = Function.prototype.toString.bind(i);
    } else {
        l = i;
    }
    Object.defineProperty(a, "URLSearchParams", {
        value: l
    });
    var m = a.URLSearchParams.prototype;
    m.polyfill = true;
    m.forEach = m.forEach || function(a, b) {
        var c = q(this.toString());
        Object.getOwnPropertyNames(c).forEach(function(d) {
            c[d].forEach(function(c) {
                a.call(b, c, d, this);
            }, this);
        }, this);
    };
    m.sort = m.sort || function() {
        var a = q(this.toString()), b = [], c, d, e;
        for(c in a){
            b.push(c);
        }
        b.sort();
        for(d = 0; d < b.length; d++){
            this["delete"](b[d]);
        }
        for(d = 0; d < b.length; d++){
            var f = b[d], g = a[f];
            for(e = 0; e < g.length; e++){
                this.append(f, g[e]);
            }
        }
    };
    m.keys = m.keys || function() {
        var a = [];
        this.forEach(function(b, c) {
            a.push(c);
        });
        return p(a);
    };
    m.values = m.values || function() {
        var a = [];
        this.forEach(function(b) {
            a.push(b);
        });
        return p(a);
    };
    m.entries = m.entries || function() {
        var a = [];
        this.forEach(function(b, c) {
            a.push([
                c,
                b
            ]);
        });
        return p(a);
    };
    if (h) {
        m[a.Symbol.iterator] = m[a.Symbol.iterator] || m.entries;
    }
    function n(a) {
        var b = {
            "!": "%21",
            "'": "%27",
            "(": "%28",
            ")": "%29",
            "~": "%7E",
            "%20": "+",
            "%00": "\x00"
        };
        return encodeURIComponent(a).replace(/[!'\(\)~]|%20|%00/g, function(a) {
            return b[a];
        });
    }
    function o(a) {
        return a.replace(/[ +]/g, "%20").replace(/(%[a-f0-9]{2})+/gi, function(a) {
            return decodeURIComponent(a);
        });
    }
    function p(b) {
        var c = {
            next: function() {
                var a = b.shift();
                return {
                    done: a === undefined,
                    value: a
                };
            }
        };
        if (h) {
            c[a.Symbol.iterator] = function() {
                return c;
            };
        }
        return c;
    }
    function q(a) {
        var b = {};
        if (typeof a === "object") {
            if (s(a)) {
                for(var c = 0; c < a.length; c++){
                    var d = a[c];
                    if (s(d) && d.length === 2) {
                        r(b, d[0], d[1]);
                    } else {
                        throw new TypeError("Failed to construct 'URLSearchParams': Sequence initializer must only contain pair elements");
                    }
                }
            } else {
                for(var e in a){
                    if (a.hasOwnProperty(e)) {
                        r(b, e, a[e]);
                    }
                }
            }
        } else {
            if (a.indexOf("?") === 0) {
                a = a.slice(1);
            }
            var f = a.split("&");
            for(var g = 0; g < f.length; g++){
                var h = f[g], i = h.indexOf("=");
                if (-1 < i) {
                    r(b, o(h.slice(0, i)), o(h.slice(i + 1)));
                } else {
                    if (h) {
                        r(b, o(h), "");
                    }
                }
            }
        }
        return b;
    }
    function r(a, b, c) {
        var d = typeof c === "string" ? c : c !== null && c !== undefined && typeof c.toString === "function" ? c.toString() : JSON.stringify(c);
        if (t(a, b)) {
            a[b].push(d);
        } else {
            a[b] = [
                d
            ];
        }
    }
    function s(a) {
        return (!!a && "[object Array]" === Object.prototype.toString.call(a));
    }
    function t(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b);
    }
})(typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : this);
