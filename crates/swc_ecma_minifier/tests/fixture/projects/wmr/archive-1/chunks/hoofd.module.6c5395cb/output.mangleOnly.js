import { D as e, F as r, y as t, b as n } from "../index.f66dda46.js";
var a = typeof document === "undefined";
var u = "M";
var c = "T";
var o = "L";
var i = "P";
var f = "S";
var s = function e(r, t) {
    return t ? t.replace(/%s/g, r || "") : r;
};
var d = function e(r) {
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
    var y = 0;
    var k = 0;
    var p = (function() {
        var e;
        return function() {
            clearTimeout(e);
            e = setTimeout(function() {
                e = null;
                var r = new Set();
                document.title = s(o[0], v[0]);
                l.forEach(function(e) {
                    if (!r.has(e.charset ? e.keyword : e[e.keyword])) {
                        r.add(e.charset ? e.keyword : e[e.keyword]);
                        d(e);
                    }
                });
                h = y = k = 0;
            }, 1000 / 60);
        };
    })();
    return {
        _setLang: function e(t) {
            r = t;
        },
        _addToQueue: function e(r, s) {
            if (!a) p();
            if (r === f) {
                n.push(s);
            } else if (r === c) {
                o.splice(h++, 0, s);
            } else if (r === i) {
                v.splice(y++, 0, s);
            } else if (r === u) {
                l.splice(k++, 0, s);
            } else {
                t.push(s);
            }
        },
        _removeFromQueue: function e(r, t) {
            if (r === c || r === i) {
                var n = r === i ? v : o;
                var a = n.indexOf(t);
                n.splice(a, 1);
                if (a === 0) document.title = s(o[0] || "", v[0]);
            } else {
                var u = l[l.indexOf(t)];
                if (u) {
                    l.splice(l.indexOf(t), 1);
                    var f = l.find(function(e) {
                        return (e.keyword === u.keyword && (e.charset || e[e.keyword] === u[e.keyword]));
                    });
                    if (f) {
                        d(f);
                    } else {
                        var h = document.head.querySelectorAll(u.charset ? "meta[" + u.keyword + "]" : "meta[" + u.keyword + '="' + u[u.keyword] + '"]');
                        document.head.removeChild(h[0]);
                    }
                }
            }
        },
        _change: function e(r, t, n) {
            if (r === c || r === i) {
                var a = r === i ? v : o;
                a[a.indexOf(t)] = n;
                if (a.indexOf(n) === 0) {
                    document.title = s(a[a.indexOf(n)], v[0]);
                }
            } else {
                d((l[l.indexOf(t)] = n));
            }
        },
        _reset: undefined,
        toStatic: function e() {
            var a = s(o[o.length - 1], v[v.length - 1]);
            var u = new Set();
            var c = [].concat(t);
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
            h = y = k = 0;
            return {
                lang: r,
                title: a,
                links: c,
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
var y = function e(n) {
    var u = r(h);
    if (a) {
        u._setLang(n);
    }
    t(function() {
        document.getElementsByTagName("html")[0].setAttribute("lang", n);
    }, [
        n
    ]);
};
var k = function e(u) {
    var c = r(h);
    var i = n(false);
    var f = n();
    var s = n();
    if (a && !i.current) {
        c._addToQueue(o, u);
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
            s.current = Object.keys(u).reduce(function(e, r) {
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
            if (s.current) {
                Object.keys(s.current).forEach(function(e) {
                    f.current.setAttribute(e, s.current[e]);
                });
            } else {
                document.head.removeChild(f.current);
            }
        };
    }, []);
};
function p(e) {
    return e.charset ? "charset" : e.name ? "name" : e.property ? "property" : "http-equiv";
}
var w = function e(c) {
    var o = r(h);
    var i = n(false);
    var f = n();
    var s = n({
        keyword: (f.current = p(c)),
        name: c.name,
        charset: c.charset,
        "http-equiv": c.httpEquiv,
        property: c.property,
        content: c.content
    });
    if (a && !i.current) {
        o._addToQueue(u, s.current);
    }
    t(function() {
        if (i.current) {
            o._change(u, s.current, (s.current = {
                keyword: f.current,
                name: c.name,
                charset: c.charset,
                "http-equiv": c.httpEquiv,
                property: c.property,
                content: c.content
            }));
        }
    }, [
        c.content
    ]);
    t(function() {
        o._addToQueue(u, s.current);
        i.current = true;
        return function() {
            i.current = false;
            o._removeFromQueue(u, s.current);
        };
    }, []);
};
var $ = function e(u, o) {
    var f = r(h);
    var s = n(false);
    var d = n();
    if (a && !s.current) {
        f._addToQueue(o ? i : c, u);
    }
    t(function() {
        if (s.current) {
            f._change(o ? i : c, d.current, (d.current = u));
        }
    }, [
        u,
        o
    ]);
    t(function() {
        s.current = true;
        f._addToQueue(o ? i : c, (d.current = u));
        return function() {
            s.current = false;
            f._removeFromQueue(o ? i : c, d.current);
        };
    }, [
        o
    ]);
};
var m = function e(r) {
    $(r, true);
};
var g = l.toStatic;
export { m as a, $ as b, w as c, k as d, g as t, y as u };
