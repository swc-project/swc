import { D as f, F as n, y as o, b as p } from "../index.f66dda46.js";
var q = typeof document === "undefined";
var r = "M";
var s = "T";
var v = "L";
var w = "P";
var x = "S";
var y = function g(e, f) {
    return f ? f.replace(/%s/g, e || "") : e;
};
var z = function h(e) {
    var g = document.head.querySelectorAll(e.charset ? "meta[" + e.keyword + "]" : "meta[" + e.keyword + '="' + e[e.keyword] + '"]');
    if (g[0]) {
        if (e.charset) {
            g[0].setAttribute(e.keyword, e.charset);
        } else {
            g[0].setAttribute("content", e.content);
        }
    } else {
        var f = document.createElement("meta");
        if (e.charset) {
            f.setAttribute(e.keyword, e.charset);
        } else {
            f.setAttribute(e.keyword, e[e.keyword]);
            f.setAttribute("content", e.content);
        }
        document.head.appendChild(f);
    }
};
var g = function e() {
    var f;
    var g = [];
    var h = [];
    var i = [];
    var j = [];
    var k = [];
    var l = 0;
    var m = 0;
    var n = 0;
    var o = (function() {
        var e;
        return function() {
            clearTimeout(e);
            e = setTimeout(function() {
                e = null;
                var f = new Set();
                document.title = y(i[0], j[0]);
                k.forEach(function(e) {
                    if (!f.has(e.charset ? e.keyword : e[e.keyword])) {
                        f.add(e.charset ? e.keyword : e[e.keyword]);
                        z(e);
                    }
                });
                l = m = n = 0;
            }, 1000 / 60);
        };
    })();
    return {
        _setLang: function g(e) {
            f = e;
        },
        _addToQueue: function p(f, e) {
            if (!q) o();
            if (f === x) {
                h.push(e);
            } else if (f === s) {
                i.splice(l++, 0, e);
            } else if (f === w) {
                j.splice(m++, 0, e);
            } else if (f === r) {
                k.splice(n++, 0, e);
            } else {
                g.push(e);
            }
        },
        _removeFromQueue: function o(f, g) {
            if (f === s || f === w) {
                var h = f === w ? j : i;
                var l = h.indexOf(g);
                h.splice(l, 1);
                if (l === 0) document.title = y(i[0] || "", j[0]);
            } else {
                var e = k[k.indexOf(g)];
                if (e) {
                    k.splice(k.indexOf(g), 1);
                    var m = k.find(function(f) {
                        return (f.keyword === e.keyword && (f.charset || f[f.keyword] === e[f.keyword]));
                    });
                    if (m) {
                        z(m);
                    } else {
                        var n = document.head.querySelectorAll(e.charset ? "meta[" + e.keyword + "]" : "meta[" + e.keyword + '="' + e[e.keyword] + '"]');
                        document.head.removeChild(n[0]);
                    }
                }
            }
        },
        _change: function l(g, h, f) {
            if (g === s || g === w) {
                var e = g === w ? j : i;
                e[e.indexOf(h)] = f;
                if (e.indexOf(f) === 0) {
                    document.title = y(e[e.indexOf(f)], j[0]);
                }
            } else {
                z((k[k.indexOf(h)] = f));
            }
        },
        _reset: undefined,
        toStatic: function r() {
            var e = y(i[i.length - 1], j[j.length - 1]);
            var s = new Set();
            var o = [].concat(g);
            var p = [].concat(h);
            k.reverse();
            var q = [].concat(k).filter(function(e) {
                if (!s.has(e.charset ? e.keyword : e[e.keyword])) {
                    s.add(e.charset ? e.keyword : e[e.keyword]);
                    return true;
                }
            });
            i = [];
            j = [];
            k = [];
            g = [];
            h = [];
            l = m = n = 0;
            return {
                lang: f,
                title: e,
                links: o,
                scripts: p,
                metas: q.map(function(e) {
                    var f;
                    return e.keyword === "charset" ? {
                        charset: e[e.keyword]
                    } : ((f = {}), (f[e.keyword] = e[e.keyword]), (f.content = e.content), f);
                })
            };
        }
    };
};
var e = g();
var A = f(e);
var h = function g(e) {
    var f = n(A);
    if (q) {
        f._setLang(e);
    }
    o(function() {
        document.getElementsByTagName("html")[0].setAttribute("lang", e);
    }, [
        e
    ]);
};
var i = function h(e) {
    var f = n(A);
    var g = p(false);
    var i = p();
    var j = p();
    if (q && !g.current) {
        f._addToQueue(v, e);
    }
    o(function() {
        if (g.current) {
            Object.keys(e).forEach(function(f) {
                i.current.setAttribute(f, e[f]);
            });
        }
    }, [
        e.href,
        e.media,
        e.as,
        e.rel,
        e.crossorigin,
        e.type,
        e.hreflang, 
    ]);
    o(function() {
        g.current = true;
        var f = document.querySelectorAll('link[rel="' + e.rel + '"]');
        f.forEach(function(f) {
            var g = true;
            Object.keys(e).forEach(function(h) {
                if (f.getAttribute(h) !== e[h]) {
                    g = false;
                }
            });
            if (g) {
                i.current = f;
            }
        });
        if (i.current) {
            j.current = Object.keys(e).reduce(function(e, f) {
                e[f] = i.current.getAttribute(f);
                return e;
            }, {});
        } else {
            i.current = document.createElement("link");
            Object.keys(e).forEach(function(f) {
                i.current.setAttribute(f, e[f]);
            });
            document.head.appendChild(i.current);
        }
        return function() {
            g.current = false;
            if (j.current) {
                Object.keys(j.current).forEach(function(e) {
                    i.current.setAttribute(e, j.current[e]);
                });
            } else {
                document.head.removeChild(i.current);
            }
        };
    }, []);
};
function B(e) {
    return e.charset ? "charset" : e.name ? "name" : e.property ? "property" : "http-equiv";
}
var j = function j(e) {
    var f = n(A);
    var g = p(false);
    var h = p();
    var i = p({
        keyword: (h.current = B(e)),
        name: e.name,
        charset: e.charset,
        "http-equiv": e.httpEquiv,
        property: e.property,
        content: e.content
    });
    if (q && !g.current) {
        f._addToQueue(r, i.current);
    }
    o(function() {
        if (g.current) {
            f._change(r, i.current, (i.current = {
                keyword: h.current,
                name: e.name,
                charset: e.charset,
                "http-equiv": e.httpEquiv,
                property: e.property,
                content: e.content
            }));
        }
    }, [
        e.content
    ]);
    o(function() {
        f._addToQueue(r, i.current);
        g.current = true;
        return function() {
            g.current = false;
            f._removeFromQueue(r, i.current);
        };
    }, []);
};
var k = function i(f, e) {
    var g = n(A);
    var h = p(false);
    var j = p();
    if (q && !h.current) {
        g._addToQueue(e ? w : s, f);
    }
    o(function() {
        if (h.current) {
            g._change(e ? w : s, j.current, (j.current = f));
        }
    }, [
        f,
        e
    ]);
    o(function() {
        h.current = true;
        g._addToQueue(e ? w : s, (j.current = f));
        return function() {
            h.current = false;
            g._removeFromQueue(e ? w : s, j.current);
        };
    }, [
        e
    ]);
};
var l = function f(e) {
    k(e, true);
};
var m = e.toStatic;
export { l as a, k as b, j as c, i as d, m as t, h as u };
