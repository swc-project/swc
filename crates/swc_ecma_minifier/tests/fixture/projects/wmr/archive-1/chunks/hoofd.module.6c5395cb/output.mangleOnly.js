import { D as a, F as b, y as c, b as d } from "../index.f66dda46.js";
var e = typeof document === "undefined";
var f = "M";
var g = "T";
var h = "L";
var i = "P";
var j = "S";
var k = function a(b, c) {
    return c ? c.replace(/%s/g, b || "") : b;
};
var l = function a(b) {
    var c = document.head.querySelectorAll(b.charset ? "meta[" + b.keyword + "]" : "meta[" + b.keyword + '="' + b[b.keyword] + '"]');
    if (c[0]) {
        if (b.charset) {
            c[0].setAttribute(b.keyword, b.charset);
        } else {
            c[0].setAttribute("content", b.content);
        }
    } else {
        var d = document.createElement("meta");
        if (b.charset) {
            d.setAttribute(b.keyword, b.charset);
        } else {
            d.setAttribute(b.keyword, b[b.keyword]);
            d.setAttribute("content", b.content);
        }
        document.head.appendChild(d);
    }
};
var m = function a() {
    var b;
    var c = [];
    var d = [];
    var h = [];
    var m = [];
    var n = [];
    var o = 0;
    var p = 0;
    var q = 0;
    var r = (function() {
        var a;
        return function() {
            clearTimeout(a);
            a = setTimeout(function() {
                a = null;
                var b = new Set();
                document.title = k(h[0], m[0]);
                n.forEach(function(a) {
                    if (!b.has(a.charset ? a.keyword : a[a.keyword])) {
                        b.add(a.charset ? a.keyword : a[a.keyword]);
                        l(a);
                    }
                });
                o = p = q = 0;
            }, 1000 / 60);
        };
    })();
    return {
        _setLang: function a(c) {
            b = c;
        },
        _addToQueue: function a(b, k) {
            if (!e) r();
            if (b === j) {
                d.push(k);
            } else if (b === g) {
                h.splice(o++, 0, k);
            } else if (b === i) {
                m.splice(p++, 0, k);
            } else if (b === f) {
                n.splice(q++, 0, k);
            } else {
                c.push(k);
            }
        },
        _removeFromQueue: function a(b, c) {
            if (b === g || b === i) {
                var d = b === i ? m : h;
                var e = d.indexOf(c);
                d.splice(e, 1);
                if (e === 0) document.title = k(h[0] || "", m[0]);
            } else {
                var f = n[n.indexOf(c)];
                if (f) {
                    n.splice(n.indexOf(c), 1);
                    var j = n.find(function(a) {
                        return (a.keyword === f.keyword && (a.charset || a[a.keyword] === f[a.keyword]));
                    });
                    if (j) {
                        l(j);
                    } else {
                        var o = document.head.querySelectorAll(f.charset ? "meta[" + f.keyword + "]" : "meta[" + f.keyword + '="' + f[f.keyword] + '"]');
                        document.head.removeChild(o[0]);
                    }
                }
            }
        },
        _change: function a(b, c, d) {
            if (b === g || b === i) {
                var e = b === i ? m : h;
                e[e.indexOf(c)] = d;
                if (e.indexOf(d) === 0) {
                    document.title = k(e[e.indexOf(d)], m[0]);
                }
            } else {
                l((n[n.indexOf(c)] = d));
            }
        },
        _reset: undefined,
        toStatic: function a() {
            var e = k(h[h.length - 1], m[m.length - 1]);
            var f = new Set();
            var g = [].concat(c);
            var i = [].concat(d);
            n.reverse();
            var j = [].concat(n).filter(function(a) {
                if (!f.has(a.charset ? a.keyword : a[a.keyword])) {
                    f.add(a.charset ? a.keyword : a[a.keyword]);
                    return true;
                }
            });
            h = [];
            m = [];
            n = [];
            c = [];
            d = [];
            o = p = q = 0;
            return {
                lang: b,
                title: e,
                links: g,
                scripts: i,
                metas: j.map(function(a) {
                    var b;
                    return a.keyword === "charset" ? {
                        charset: a[a.keyword]
                    } : ((b = {}), (b[a.keyword] = a[a.keyword]), (b.content = a.content), b);
                })
            };
        }
    };
};
var n = m();
var o = a(n);
var p = function a(d) {
    var f = b(o);
    if (e) {
        f._setLang(d);
    }
    c(function() {
        document.getElementsByTagName("html")[0].setAttribute("lang", d);
    }, [
        d
    ]);
};
var q = function a(f) {
    var g = b(o);
    var i = d(false);
    var j = d();
    var k = d();
    if (e && !i.current) {
        g._addToQueue(h, f);
    }
    c(function() {
        if (i.current) {
            Object.keys(f).forEach(function(a) {
                j.current.setAttribute(a, f[a]);
            });
        }
    }, [
        f.href,
        f.media,
        f.as,
        f.rel,
        f.crossorigin,
        f.type,
        f.hreflang, 
    ]);
    c(function() {
        i.current = true;
        var a = document.querySelectorAll('link[rel="' + f.rel + '"]');
        a.forEach(function(a) {
            var b = true;
            Object.keys(f).forEach(function(c) {
                if (a.getAttribute(c) !== f[c]) {
                    b = false;
                }
            });
            if (b) {
                j.current = a;
            }
        });
        if (j.current) {
            k.current = Object.keys(f).reduce(function(a, b) {
                a[b] = j.current.getAttribute(b);
                return a;
            }, {});
        } else {
            j.current = document.createElement("link");
            Object.keys(f).forEach(function(a) {
                j.current.setAttribute(a, f[a]);
            });
            document.head.appendChild(j.current);
        }
        return function() {
            i.current = false;
            if (k.current) {
                Object.keys(k.current).forEach(function(a) {
                    j.current.setAttribute(a, k.current[a]);
                });
            } else {
                document.head.removeChild(j.current);
            }
        };
    }, []);
};
function r(a) {
    return a.charset ? "charset" : a.name ? "name" : a.property ? "property" : "http-equiv";
}
var s = function a(g) {
    var h = b(o);
    var i = d(false);
    var j = d();
    var k = d({
        keyword: (j.current = r(g)),
        name: g.name,
        charset: g.charset,
        "http-equiv": g.httpEquiv,
        property: g.property,
        content: g.content
    });
    if (e && !i.current) {
        h._addToQueue(f, k.current);
    }
    c(function() {
        if (i.current) {
            h._change(f, k.current, (k.current = {
                keyword: j.current,
                name: g.name,
                charset: g.charset,
                "http-equiv": g.httpEquiv,
                property: g.property,
                content: g.content
            }));
        }
    }, [
        g.content
    ]);
    c(function() {
        h._addToQueue(f, k.current);
        i.current = true;
        return function() {
            i.current = false;
            h._removeFromQueue(f, k.current);
        };
    }, []);
};
var t = function a(f, h) {
    var j = b(o);
    var k = d(false);
    var l = d();
    if (e && !k.current) {
        j._addToQueue(h ? i : g, f);
    }
    c(function() {
        if (k.current) {
            j._change(h ? i : g, l.current, (l.current = f));
        }
    }, [
        f,
        h
    ]);
    c(function() {
        k.current = true;
        j._addToQueue(h ? i : g, (l.current = f));
        return function() {
            k.current = false;
            j._removeFromQueue(h ? i : g, l.current);
        };
    }, [
        h
    ]);
};
var u = function a(b) {
    t(b, true);
};
var v = n.toStatic;
export { u as a, t as b, s as c, q as d, v as t, p as u };
