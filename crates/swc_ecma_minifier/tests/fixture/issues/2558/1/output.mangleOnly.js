(function(c) {
    "use strict";
    var b = (function() {
        try {
            if (c.URLSearchParams && new c.URLSearchParams("foo=bar").get("foo") === "bar") {
                return c.URLSearchParams;
            }
        } catch (a) {}
        return null;
    })(), f = b && new b({
        a: 1
    }).toString() === "a=1", g = b && new b("s=%2B").get("s") === "+", m = "__URLSearchParams__", i = b ? (function() {
        var a = new b();
        a.append("s", " &");
        return a.toString() === "s=+%26";
    })() : true, d = h.prototype, j = !!(c.Symbol && c.Symbol.iterator);
    if (b && f && g && i) {
        return;
    }
    function h(a) {
        a = a || "";
        if (a instanceof URLSearchParams || a instanceof h) {
            a = a.toString();
        }
        this[m] = q(a);
    }
    d.append = function(a, b) {
        r(this[m], a, b);
    };
    d["delete"] = function(a) {
        delete this[m][a];
    };
    d.get = function(a) {
        var b = this[m];
        return this.has(a) ? b[a][0] : null;
    };
    d.getAll = function(a) {
        var b = this[m];
        return this.has(a) ? b[a].slice(0) : [];
    };
    d.has = function(a) {
        return t(this[m], a);
    };
    d.set = function c(a, b) {
        this[m][a] = [
            "" + b
        ];
    };
    d.toString = function() {
        var d = this[m], e = [], a, b, f, c;
        for(b in d){
            f = n(b);
            for(a = 0, c = d[b]; a < c.length; a++){
                e.push(f + "=" + n(c[a]));
            }
        }
        return e.join("&");
    };
    var k = !g;
    var l = !k && b && !f && c.Proxy;
    var e;
    if (l) {
        e = new Proxy(b, {
            construct: function(a, b) {
                return new a(new h(b[0]).toString());
            }
        });
        e.toString = Function.prototype.toString.bind(h);
    } else {
        e = h;
    }
    Object.defineProperty(c, "URLSearchParams", {
        value: e
    });
    var a = c.URLSearchParams.prototype;
    a.polyfill = true;
    a.forEach = a.forEach || function(b, c) {
        var a = q(this.toString());
        Object.getOwnPropertyNames(a).forEach(function(d) {
            a[d].forEach(function(a) {
                b.call(c, a, d, this);
            }, this);
        }, this);
    };
    a.sort = a.sort || function() {
        var d = q(this.toString()), b = [], e, a, c;
        for(e in d){
            b.push(e);
        }
        b.sort();
        for(a = 0; a < b.length; a++){
            this["delete"](b[a]);
        }
        for(a = 0; a < b.length; a++){
            var f = b[a], g = d[f];
            for(c = 0; c < g.length; c++){
                this.append(f, g[c]);
            }
        }
    };
    a.keys = a.keys || function() {
        var a = [];
        this.forEach(function(c, b) {
            a.push(b);
        });
        return p(a);
    };
    a.values = a.values || function() {
        var a = [];
        this.forEach(function(b) {
            a.push(b);
        });
        return p(a);
    };
    a.entries = a.entries || function() {
        var a = [];
        this.forEach(function(b, c) {
            a.push([
                c,
                b
            ]);
        });
        return p(a);
    };
    if (j) {
        a[c.Symbol.iterator] = a[c.Symbol.iterator] || a.entries;
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
        var a = {
            next: function() {
                var a = b.shift();
                return {
                    done: a === undefined,
                    value: a
                };
            }
        };
        if (j) {
            a[c.Symbol.iterator] = function() {
                return a;
            };
        }
        return a;
    }
    function q(a) {
        var b = {};
        if (typeof a === "object") {
            if (s(a)) {
                for(var e = 0; e < a.length; e++){
                    var d = a[e];
                    if (s(d) && d.length === 2) {
                        r(b, d[0], d[1]);
                    } else {
                        throw new TypeError("Failed to construct 'URLSearchParams': Sequence initializer must only contain pair elements");
                    }
                }
            } else {
                for(var f in a){
                    if (a.hasOwnProperty(f)) {
                        r(b, f, a[f]);
                    }
                }
            }
        } else {
            if (a.indexOf("?") === 0) {
                a = a.slice(1);
            }
            var i = a.split("&");
            for(var g = 0; g < i.length; g++){
                var c = i[g], h = c.indexOf("=");
                if (-1 < h) {
                    r(b, o(c.slice(0, h)), o(c.slice(h + 1)));
                } else {
                    if (c) {
                        r(b, o(c), "");
                    }
                }
            }
        }
        return b;
    }
    function r(b, c, a) {
        var d = typeof a === "string" ? a : a !== null && a !== undefined && typeof a.toString === "function" ? a.toString() : JSON.stringify(a);
        if (t(b, c)) {
            b[c].push(d);
        } else {
            b[c] = [
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
