import { D as e, F as r, y as t, b as n } from "../index.f66dda46.js";
var c = typeof document === "undefined";
var u = "M";
var a = "T";
var o = "L";
var i = "P";
var f = "S";
var d = function e(r, t) {
    return t ? t.replace(/%s/g, r || "") : r;
};
var s = function e(r) {
    var t = document.head.querySelectorAll(r.charset ? "meta[" + r.keyword + "]" : "meta[" + r.keyword + '="' + r[r.keyword] + '"]');
    if (t[0]) {
        if (r.charset) {
            t[0].setAttribute(r.keyword, r.charset);
        } else {
            t[0].setAttribute("content", r.content);
        }
    } else {
        var n = document.createElement("meta");
        if (r.charset) {
            n.setAttribute(r.keyword, r.charset);
        } else {
            n.setAttribute(r.keyword, r[r.keyword]);
            n.setAttribute("content", r.content);
        }
        document.head.appendChild(n);
    }
};
var v = function e() {
    var r;
    var t = [];
    var n = [];
    var o = [];
    var v = [];
    var l = [];
    var h = 0;
    var m = 0;
    var y = 0;
    var k = (function() {
        var e;
        return function() {
            clearTimeout(e);
            e = setTimeout(function() {
                e = null;
                var r = new Set();
                document.title = d(o[0], v[0]);
                l.forEach(function(e) {
                    if (!r.has(e.charset ? e.keyword : e[e.keyword])) {
                        r.add(e.charset ? e.keyword : e[e.keyword]);
                        s(e);
                    }
                });
                h = m = y = 0;
            }, 1000 / 60);
        };
    })();
    return {
        _setLang: function e(t) {
            r = t;
        },
        _addToQueue: function e(r, d) {
            if (!c) k();
            if (r === f) {
                n.push(d);
            } else if (r === a) {
                o.splice(h++, 0, d);
            } else if (r === i) {
                v.splice(m++, 0, d);
            } else if (r === u) {
                l.splice(y++, 0, d);
            } else {
                t.push(d);
            }
        },
        _removeFromQueue: function e(r, t) {
            if (r === a || r === i) {
                var n = r === i ? v : o;
                var c = n.indexOf(t);
                n.splice(c, 1);
                if (c === 0) document.title = d(o[0] || "", v[0]);
            } else {
                var u = l[l.indexOf(t)];
                if (u) {
                    l.splice(l.indexOf(t), 1);
                    var f = l.find(function(e) {
                        return (e.keyword === u.keyword && (e.charset || e[e.keyword] === u[e.keyword]));
                    });
                    if (f) {
                        s(f);
                    } else {
                        var h = document.head.querySelectorAll(u.charset ? "meta[" + u.keyword + "]" : "meta[" + u.keyword + '="' + u[u.keyword] + '"]');
                        document.head.removeChild(h[0]);
                    }
                }
            }
        },
        _change: function e(r, t, n) {
            if (r === a || r === i) {
                var c = r === i ? v : o;
                c[c.indexOf(t)] = n;
                if (c.indexOf(n) === 0) {
                    document.title = d(c[c.indexOf(n)], v[0]);
                }
            } else {
                s((l[l.indexOf(t)] = n));
            }
        },
        _reset: undefined,
        toStatic: function e() {
            var c = d(o[o.length - 1], v[v.length - 1]);
            var u = new Set();
            var a = [].concat(t);
            var i = [].concat(n);
            l.reverse();
            var f = [].concat(l).filter(function(e) {
                if (!u.has(e.charset ? e.keyword : e[e.keyword])) {
                    u.add(e.charset ? e.keyword : e[e.keyword]);
                    return true;
                }
            });
            o = [];
            v = [];
            l = [];
            t = [];
            n = [];
            h = m = y = 0;
            return {
                lang: r,
                title: c,
                links: a,
                scripts: i,
                metas: f.map(function(e) {
                    var r;
                    return e.keyword === "charset" ? {
                        charset: e[e.keyword]
                    } : ((r = {}), (r[e.keyword] = e[e.keyword]), (r.content = e.content), r);
                })
            };
        }
    };
};
var l = v();
var h = e(l);
var m = function e(n) {
    var u = r(h);
    if (c) {
        u._setLang(n);
    }
    t(function() {
        document.getElementsByTagName("html")[0].setAttribute("lang", n);
    }, [
        n
    ]);
};
var y = function e(u) {
    var a = r(h);
    var i = n(false);
    var f = n();
    var d = n();
    if (c && !i.current) {
        a._addToQueue(o, u);
    }
    t(function() {
        if (i.current) {
            Object.keys(u).forEach(function(e) {
                f.current.setAttribute(e, u[e]);
            });
        }
    }, [
        u.href,
        u.media,
        u.as,
        u.rel,
        u.crossorigin,
        u.type,
        u.hreflang, 
    ]);
    t(function() {
        i.current = true;
        var e = document.querySelectorAll('link[rel="' + u.rel + '"]');
        e.forEach(function(e) {
            var r = true;
            Object.keys(u).forEach(function(t) {
                if (e.getAttribute(t) !== u[t]) {
                    r = false;
                }
            });
            if (r) {
                f.current = e;
            }
        });
        if (f.current) {
            d.current = Object.keys(u).reduce(function(e, r) {
                e[r] = f.current.getAttribute(r);
                return e;
            }, {});
        } else {
            f.current = document.createElement("link");
            Object.keys(u).forEach(function(e) {
                f.current.setAttribute(e, u[e]);
            });
            document.head.appendChild(f.current);
        }
        return function() {
            i.current = false;
            if (d.current) {
                Object.keys(d.current).forEach(function(e) {
                    f.current.setAttribute(e, d.current[e]);
                });
            } else {
                document.head.removeChild(f.current);
            }
        };
    }, []);
};
function k(e) {
    return e.charset ? "charset" : e.name ? "name" : e.property ? "property" : "http-equiv";
}
var p = function e(a) {
    var o = r(h);
    var i = n(false);
    var f = n();
    var d = n({
        keyword: (f.current = k(a)),
        name: a.name,
        charset: a.charset,
        "http-equiv": a.httpEquiv,
        property: a.property,
        content: a.content
    });
    if (c && !i.current) {
        o._addToQueue(u, d.current);
    }
    t(function() {
        if (i.current) {
            o._change(u, d.current, (d.current = {
                keyword: f.current,
                name: a.name,
                charset: a.charset,
                "http-equiv": a.httpEquiv,
                property: a.property,
                content: a.content
            }));
        }
    }, [
        a.content
    ]);
    t(function() {
        o._addToQueue(u, d.current);
        i.current = true;
        return function() {
            i.current = false;
            o._removeFromQueue(u, d.current);
        };
    }, []);
};
var w = function e(u, o) {
    var f = r(h);
    var d = n(false);
    var s = n();
    if (c && !d.current) {
        f._addToQueue(o ? i : a, u);
    }
    t(function() {
        if (d.current) {
            f._change(o ? i : a, s.current, (s.current = u));
        }
    }, [
        u,
        o
    ]);
    t(function() {
        d.current = true;
        f._addToQueue(o ? i : a, (s.current = u));
        return function() {
            d.current = false;
            f._removeFromQueue(o ? i : a, s.current);
        };
    }, [
        o
    ]);
};
var b = function e(r) {
    w(r, true);
};
var g = l.toStatic;
export { b as a, w as b, p as c, y as d, g as t, m as u };
