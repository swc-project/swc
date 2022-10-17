var h = D((q, C) => {
    "use strict";

    var g = {
        resolve: function () {
            for (var e = "", r = !1, i, l = arguments.length - 1; l >= -1 && !r; l--) {
                var s;
                l >= 0 ? s = arguments[l] : (i === void 0 && (i = __process$.cwd()), s = i), c(s), s.length !== 0 && (e = s + "/" + e, r = s.charCodeAt(0) === 47)
            }
            return e = b(e, !r), r ? e.length > 0 ? "/" + e : "/" : e.length > 0 ? e : "."
        },
        normalize: function (e) {
            if (c(e), e.length === 0) return ".";
            var r = e.charCodeAt(0) === 47,
                i = e.charCodeAt(e.length - 1) === 47;
            return e = b(e, !r), e.length === 0 && !r && (e = "."), e.length > 0 && i && (e += "/"), r ? "/" + e : e
        },
        isAbsolute: function (e) {
            return c(e), e.length > 0 && e.charCodeAt(0) === 47
        },
        join: function () {
            if (arguments.length === 0) return ".";
            for (var e, r = 0; r < arguments.length; ++r) {
                var i = arguments[r];
                c(i), i.length > 0 && (e === void 0 ? e = i : e += "/" + i)
            }
            return e === void 0 ? "." : g.normalize(e)
        },
        relative: function (e, r) {
            if (c(e), c(r), e === r || (e = g.resolve(e), r = g.resolve(r), e === r)) return "";
            for (var i = 1; i < e.length && e.charCodeAt(i) === 47; ++i);
            for (var l = e.length, s = l - i, n = 1; n < r.length && r.charCodeAt(n) === 47; ++n);
            for (var t = r.length, a = t - n, v = s < a ? s : a, u = -1, o = 0; o <= v; ++o) {
                if (o === v) {
                    if (a > v) {
                        if (r.charCodeAt(n + o) === 47) return r.slice(n + o + 1);
                        if (o === 0) return r.slice(n + o)
                    } else s > v && (e.charCodeAt(i + o) === 47 ? u = o : o === 0 && (u = 0));
                    break
                }
                var A = e.charCodeAt(i + o),
                    k = r.charCodeAt(n + o);
                if (A !== k) break;
                A === 47 && (u = o)
            }
            var d = "";
            for (o = i + u + 1; o <= l; ++o)(o === l || e.charCodeAt(o) === 47) && (d.length === 0 ? d += ".." : d += "/..");
            return d.length > 0 ? d + r.slice(n + u) : (n += u, r.charCodeAt(n) === 47 && ++n, r.slice(n))
        },
        _makeLong: function (e) {
            return e
        },
        dirname: function (e) {
            if (c(e), e.length === 0) return ".";
            for (var r = e.charCodeAt(0), i = r === 47, l = -1, s = !0, n = e.length - 1; n >= 1; --n)
                if (r = e.charCodeAt(n), r === 47) {
                    if (!s) {
                        l = n;
                        break
                    }
                } else s = !1;
            return l === -1 ? i ? "/" : "." : i && l === 1 ? "//" : e.slice(0, l)
        },
        basename: function (e, r) {
            if (r !== void 0 && typeof r != "string") throw new TypeError('"ext" argument must be a string');
            c(e);
            var i = 0,
                l = -1,
                s = !0,
                n;
            if (r !== void 0 && r.length > 0 && r.length <= e.length) {
                if (r.length === e.length && r === e) return "";
                var t = r.length - 1,
                    a = -1;
                for (n = e.length - 1; n >= 0; --n) {
                    var v = e.charCodeAt(n);
                    if (v === 47) {
                        if (!s) {
                            i = n + 1;
                            break
                        }
                    } else a === -1 && (s = !1, a = n + 1), t >= 0 && (v === r.charCodeAt(t) ? --t == -1 && (l = n) : (t = -1, l = a))
                }
                return i === l ? l = a : l === -1 && (l = e.length), e.slice(i, l)
            } else {
                for (n = e.length - 1; n >= 0; --n)
                    if (e.charCodeAt(n) === 47) {
                        if (!s) {
                            i = n + 1;
                            break
                        }
                    } else l === -1 && (s = !1, l = n + 1);
                return l === -1 ? "" : e.slice(i, l)
            }
        },
        extname: function (e) {
            c(e);
            for (var r = -1, i = 0, l = -1, s = !0, n = 0, t = e.length - 1; t >= 0; --t) {
                var a = e.charCodeAt(t);
                if (a === 47) {
                    if (!s) {
                        i = t + 1;
                        break
                    }
                    continue
                }
                l === -1 && (s = !1, l = t + 1), a === 46 ? r === -1 ? r = t : n !== 1 && (n = 1) : r !== -1 && (n = -1)
            }
            return r === -1 || l === -1 || n === 0 || n === 1 && r === l - 1 && r === i + 1 ? "" : e.slice(r, l)
        },
        format: function (e) {
            if (e === null || typeof e != "object") throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof e);
            return _("/", e)
        },
        parse: function (e) {
            c(e);
            var r = {
                root: "",
                dir: "",
                base: "",
                ext: "",
                name: ""
            };
            if (e.length === 0) return r;
            var i = e.charCodeAt(0),
                l = i === 47,
                s;
            l ? (r.root = "/", s = 1) : s = 0;
            for (var n = -1, t = 0, a = -1, v = !0, u = e.length - 1, o = 0; u >= s; --u) {
                if (i = e.charCodeAt(u), i === 47) {
                    if (!v) {
                        t = u + 1;
                        break
                    }
                    continue
                }
                a === -1 && (v = !1, a = u + 1), i === 46 ? n === -1 ? n = u : o !== 1 && (o = 1) : n !== -1 && (o = -1)
            }
            return n === -1 || a === -1 || o === 0 || o === 1 && n === a - 1 && n === t + 1 ? a !== -1 && (t === 0 && l ? r.base = r.name = e.slice(1, a) : r.base = r.name = e.slice(t, a)) : (t === 0 && l ? (r.name = e.slice(1, n), r.base = e.slice(1, a)) : (r.name = e.slice(t, n), r.base = e.slice(t, a)), r.ext = e.slice(n, a)), t > 0 ? r.dir = e.slice(0, t - 1) : l && (r.dir = "/"), r
        },
        sep: "/",
        delimiter: ":",
        win32: null,
        posix: null
    };
    g.posix = g;
    C.exports = g
});
var E = R(h());
var export_default = E.default;
export {
    export_default as
        default
};