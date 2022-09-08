(function t(e, r) {
    if (typeof exports === "object" && typeof module === "object") module.exports = r();
    else if (typeof define === "function" && define.amd) define([], r);
    else if (typeof exports === "object") exports["Quagga"] = r();
    else e["Quagga"] = r();
})(window, function() {
    return (function(t) {
        var e = {};
        function r(n) {
            if (e[n]) {
                return e[n].exports;
            }
            var a = (e[n] = {
                i: n,
                l: false,
                exports: {}
            });
            t[n].call(a.exports, a, a.exports, r);
            a.l = true;
            return a.exports;
        }
        r.m = t;
        r.c = e;
        r.d = function(t, e, n) {
            if (!r.o(t, e)) {
                Object.defineProperty(t, e, {
                    enumerable: true,
                    get: n
                });
            }
        };
        r.r = function(t) {
            if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
                Object.defineProperty(t, Symbol.toStringTag, {
                    value: "Module"
                });
            }
            Object.defineProperty(t, "__esModule", {
                value: true
            });
        };
        r.t = function(t, e) {
            if (e & 1) t = r(t);
            if (e & 8) return t;
            if (e & 4 && typeof t === "object" && t && t.__esModule) return t;
            var n = Object.create(null);
            r.r(n);
            Object.defineProperty(n, "default", {
                enumerable: true,
                value: t
            });
            if (e & 2 && typeof t != "string") for(var a in t)r.d(n, a, function(e) {
                return t[e];
            }.bind(null, a));
            return n;
        };
        r.n = function(t) {
            var e = t && t.__esModule ? function e() {
                return t["default"];
            } : function e() {
                return t;
            };
            r.d(e, "a", e);
            return e;
        };
        r.o = function(t, e) {
            return Object.prototype.hasOwnProperty.call(t, e);
        };
        r.p = "/";
        return r((r.s = 89));
    })([
        function(t, e) {
            function r(t, e, r) {
                if (e in t) {
                    Object.defineProperty(t, e, {
                        value: r,
                        enumerable: true,
                        configurable: true,
                        writable: true
                    });
                } else {
                    t[e] = r;
                }
                return t;
            }
            t.exports = r;
            (t.exports["default"] = t.exports), (t.exports.__esModule = true);
        },
        function(t, e) {
            function r(t) {
                if (t === void 0) {
                    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                }
                return t;
            }
            t.exports = r;
            (t.exports["default"] = t.exports), (t.exports.__esModule = true);
        },
        function(t, e) {
            function r(e) {
                t.exports = r = Object.setPrototypeOf ? Object.getPrototypeOf : function t(e) {
                    return e.__proto__ || Object.getPrototypeOf(e);
                };
                (t.exports["default"] = t.exports), (t.exports.__esModule = true);
                return r(e);
            }
            t.exports = r;
            (t.exports["default"] = t.exports), (t.exports.__esModule = true);
        },
        function(t, e) {
            function r(t, e) {
                if (!(t instanceof e)) {
                    throw new TypeError("Cannot call a class as a function");
                }
            }
            t.exports = r;
            (t.exports["default"] = t.exports), (t.exports.__esModule = true);
        },
        function(t, e) {
            function r(t, e) {
                for(var r = 0; r < e.length; r++){
                    var n = e[r];
                    n.enumerable = n.enumerable || false;
                    n.configurable = true;
                    if ("value" in n) n.writable = true;
                    Object.defineProperty(t, n.key, n);
                }
            }
            function n(t, e, n) {
                if (e) r(t.prototype, e);
                if (n) r(t, n);
                return t;
            }
            t.exports = n;
            (t.exports["default"] = t.exports), (t.exports.__esModule = true);
        },
        function(t, e, r) {
            var n = r(19)["default"];
            var a = r(1);
            function o(t, e) {
                if (e && (n(e) === "object" || typeof e === "function")) {
                    return e;
                } else if (e !== void 0) {
                    throw new TypeError("Derived constructors may only return object or undefined");
                }
                return a(t);
            }
            t.exports = o;
            (t.exports["default"] = t.exports), (t.exports.__esModule = true);
        },
        function(t, e, r) {
            var n = r(41);
            function a(t, e) {
                if (typeof e !== "function" && e !== null) {
                    throw new TypeError("Super expression must either be null or a function");
                }
                t.prototype = Object.create(e && e.prototype, {
                    constructor: {
                        value: t,
                        writable: true,
                        configurable: true
                    }
                });
                if (e) n(t, e);
            }
            t.exports = a;
            (t.exports["default"] = t.exports), (t.exports.__esModule = true);
        },
        function(t, e, r) {
            t.exports = {
                EPSILON: r(62),
                create: r(63),
                clone: r(156),
                fromValues: r(157),
                copy: r(158),
                set: r(159),
                equals: r(160),
                exactEquals: r(161),
                add: r(162),
                subtract: r(64),
                sub: r(163),
                multiply: r(65),
                mul: r(164),
                divide: r(66),
                div: r(165),
                inverse: r(166),
                min: r(167),
                max: r(168),
                rotate: r(169),
                floor: r(170),
                ceil: r(171),
                round: r(172),
                scale: r(173),
                scaleAndAdd: r(174),
                distance: r(67),
                dist: r(175),
                squaredDistance: r(68),
                sqrDist: r(176),
                length: r(69),
                len: r(177),
                squaredLength: r(70),
                sqrLen: r(178),
                negate: r(179),
                normalize: r(180),
                dot: r(181),
                cross: r(182),
                lerp: r(183),
                random: r(184),
                transformMat2: r(185),
                transformMat2d: r(186),
                transformMat3: r(187),
                transformMat4: r(188),
                forEach: r(189),
                limit: r(190)
            };
        },
        function(t, e, r) {
            "use strict";
            r.d(e, "h", function() {
                return s;
            });
            r.d(e, "i", function() {
                return y;
            });
            r.d(e, "b", function() {
                return m;
            });
            r.d(e, "j", function() {
                return S;
            });
            r.d(e, "e", function() {
                return P;
            });
            r.d(e, "c", function() {
                return D;
            });
            r.d(e, "f", function() {
                return j;
            });
            r.d(e, "g", function() {
                return I;
            });
            r.d(e, "a", function() {
                return N;
            });
            r.d(e, "d", function() {
                return B;
            });
            var n = r(7);
            var a = r(84);
            var o = {
                clone: n["clone"],
                dot: n["dot"]
            };
            var i = {
                create: function t(e, r) {
                    var n = [];
                    var a = {
                        rad: 0,
                        vec: o.clone([
                            0,
                            0
                        ])
                    };
                    var i = {};
                    function u(t) {
                        i[t.id] = t;
                        n.push(t);
                    }
                    function c() {
                        var t;
                        var e = 0;
                        for(t = 0; t < n.length; t++){
                            e += n[t].rad;
                        }
                        a.rad = e / n.length;
                        a.vec = o.clone([
                            Math.cos(a.rad),
                            Math.sin(a.rad), 
                        ]);
                    }
                    function f() {
                        u(e);
                        c();
                    }
                    f();
                    return {
                        add: function t(e) {
                            if (!i[e.id]) {
                                u(e);
                                c();
                            }
                        },
                        fits: function t(e) {
                            var n = Math.abs(o.dot(e.point.vec, a.vec));
                            if (n > r) {
                                return true;
                            }
                            return false;
                        },
                        getPoints: function t() {
                            return n;
                        },
                        getCenter: function t() {
                            return a;
                        }
                    };
                },
                createPoint: function t(e, r, n) {
                    return {
                        rad: e[n],
                        point: e,
                        id: r
                    };
                }
            };
            var u = r(10);
            var c = {
                clone: n["clone"]
            };
            var f = {
                clone: a["clone"]
            };
            function s(t, e) {
                var r = {
                    x: t,
                    y: e,
                    toVec2: function t() {
                        return c.clone([
                            this.x,
                            this.y
                        ]);
                    },
                    toVec3: function t() {
                        return f.clone([
                            this.x,
                            this.y,
                            1
                        ]);
                    },
                    round: function t() {
                        this.x = this.x > 0.0 ? Math.floor(this.x + 0.5) : Math.floor(this.x - 0.5);
                        this.y = this.y > 0.0 ? Math.floor(this.y + 0.5) : Math.floor(this.y - 0.5);
                        return this;
                    }
                };
                return r;
            }
            function l(t, e) {
                var r = t.data;
                var n = t.size.x;
                var a = t.size.y;
                var o = e.data;
                var i = 0;
                var u = 0;
                var c = 0;
                var f = 0;
                var s = 0;
                var l;
                var v;
                c = n;
                i = 0;
                for(v = 1; v < a; v++){
                    i += r[u];
                    o[c] += i;
                    u += n;
                    c += n;
                }
                u = 0;
                c = 1;
                i = 0;
                for(l = 1; l < n; l++){
                    i += r[u];
                    o[c] += i;
                    u++;
                    c++;
                }
                for(v = 1; v < a; v++){
                    u = v * n + 1;
                    c = (v - 1) * n + 1;
                    f = v * n;
                    s = (v - 1) * n;
                    for(l = 1; l < n; l++){
                        o[u] += r[u] + o[c] + o[f] - o[s];
                        u++;
                        c++;
                        f++;
                        s++;
                    }
                }
            }
            function v(t, e) {
                var r = t.data;
                var n = t.size.x;
                var a = t.size.y;
                var o = e.data;
                var i = 0;
                for(var u = 0; u < n; u++){
                    i += r[u];
                    o[u] = i;
                }
                for(var c = 1; c < a; c++){
                    i = 0;
                    for(var f = 0; f < n; f++){
                        i += r[c * n + f];
                        o[c * n + f] = i + o[(c - 1) * n + f];
                    }
                }
            }
            function h(t, e, r) {
                if (!r) {
                    r = t;
                }
                var n = t.data;
                var a = n.length;
                var o = r.data;
                while(a--){
                    o[a] = n[a] < e ? 1 : 0;
                }
            }
            function d(t, e) {
                if (!e) {
                    e = 8;
                }
                var r = t.data;
                var n = r.length;
                var a = 8 - e;
                var o = 1 << e;
                var i = new Int32Array(o);
                while(n--){
                    i[r[n] >> a]++;
                }
                return i;
            }
            function p(t) {
                var e;
                var r = t.length;
                var n = t[0];
                var a = t[1];
                var o;
                for(e = 1; e < r - 1; e++){
                    o = t[e + 1];
                    t[e - 1] = (a * 2 - n - o) & 255;
                    n = a;
                    a = o;
                }
                return t;
            }
            function g(t) {
                var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 8;
                var r;
                var n = 8 - e;
                function a(t, e) {
                    var n = 0;
                    for(var a = t; a <= e; a++){
                        n += r[a];
                    }
                    return n;
                }
                function o(t, e) {
                    var n = 0;
                    for(var a = t; a <= e; a++){
                        n += a * r[a];
                    }
                    return n;
                }
                function i() {
                    var n = [
                        0
                    ];
                    var i;
                    var c;
                    var f;
                    var s;
                    var l;
                    var v;
                    var h = (1 << e) - 1;
                    r = d(t, e);
                    for(var p = 1; p < h; p++){
                        i = a(0, p);
                        c = a(p + 1, h);
                        f = i * c;
                        if (f === 0) {
                            f = 1;
                        }
                        s = o(0, p) * c;
                        l = o(p + 1, h) * i;
                        v = s - l;
                        n[p] = (v * v) / f;
                    }
                    return u["a"].maxIndex(n);
                }
                var c = i();
                return c << n;
            }
            function y(t, e) {
                var r = g(t);
                h(t, r, e);
                return r;
            }
            function x(t, e, r) {
                v(t, e);
                if (!r) {
                    r = t;
                }
                var n = t.data;
                var a = r.data;
                var o = t.size.x;
                var i = t.size.y;
                var u = e.data;
                var c = 0;
                var f;
                var s;
                var l = 3;
                var h;
                var d;
                var p;
                var g;
                var y;
                var x = (l * 2 + 1) * (l * 2 + 1);
                for(f = 0; f <= l; f++){
                    for(s = 0; s < o; s++){
                        a[f * o + s] = 0;
                        a[(i - 1 - f) * o + s] = 0;
                    }
                }
                for(f = l; f < i - l; f++){
                    for(s = 0; s <= l; s++){
                        a[f * o + s] = 0;
                        a[f * o + (o - 1 - s)] = 0;
                    }
                }
                for(f = l + 1; f < i - l - 1; f++){
                    for(s = l + 1; s < o - l; s++){
                        h = u[(f - l - 1) * o + (s - l - 1)];
                        d = u[(f - l - 1) * o + (s + l)];
                        p = u[(f + l) * o + (s - l - 1)];
                        g = u[(f + l) * o + (s + l)];
                        c = g - p - d + h;
                        y = c / x;
                        a[f * o + s] = n[f * o + s] > y + 5 ? 0 : 1;
                    }
                }
            }
            function m(t, e, r) {
                var n;
                var a;
                var o;
                var u;
                var c = [];
                if (!r) {
                    r = "rad";
                }
                function f(t) {
                    var e = false;
                    for(a = 0; a < c.length; a++){
                        o = c[a];
                        if (o.fits(t)) {
                            o.add(t);
                            e = true;
                        }
                    }
                    return e;
                }
                for(n = 0; n < t.length; n++){
                    u = i.createPoint(t[n], n, r);
                    if (!f(u)) {
                        c.push(i.create(u, e));
                    }
                }
                return c;
            }
            var _ = {
                trace: function t(e, r) {
                    var n;
                    var a = 10;
                    var o = [];
                    var i = [];
                    var u = 0;
                    var c = 0;
                    function t(t, n) {
                        var a;
                        var o;
                        var i;
                        var u = 1;
                        var c = Math.abs(r[1] / 10);
                        var f = false;
                        function s(t, e) {
                            if (t.x > e.x - u && t.x < e.x + u && t.y > e.y - c && t.y < e.y + c) {
                                return true;
                            }
                            return false;
                        }
                        var l = e[t];
                        if (n) {
                            i = {
                                x: l.x + r[0],
                                y: l.y + r[1]
                            };
                        } else {
                            i = {
                                x: l.x - r[0],
                                y: l.y - r[1]
                            };
                        }
                        o = n ? t + 1 : t - 1;
                        a = e[o];
                        while(a && (f = s(a, i)) !== true && Math.abs(a.y - l.y) < r[1]){
                            o = n ? o + 1 : o - 1;
                            a = e[o];
                        }
                        return f ? o : null;
                    }
                    for(n = 0; n < a; n++){
                        u = Math.floor(Math.random() * e.length);
                        o = [];
                        c = u;
                        o.push(e[c]);
                        while((c = t(c, true)) !== null){
                            o.push(e[c]);
                        }
                        if (u > 0) {
                            c = u;
                            while((c = t(c, false)) !== null){
                                o.push(e[c]);
                            }
                        }
                        if (o.length > i.length) {
                            i = o;
                        }
                    }
                    return i;
                }
            };
            var b = 1;
            var w = 2;
            function O(t, e) {
                var r;
                var n;
                var a = t.data;
                var o = e.data;
                var i = t.size.y;
                var u = t.size.x;
                var c;
                var f;
                var s;
                var l;
                var v;
                for(r = 1; r < i - 1; r++){
                    for(n = 1; n < u - 1; n++){
                        f = r - 1;
                        s = r + 1;
                        l = n - 1;
                        v = n + 1;
                        c = a[f * u + l] + a[f * u + v] + a[r * u + n] + a[s * u + l] + a[s * u + v];
                        o[r * u + n] = c > 0 ? 1 : 0;
                    }
                }
            }
            function R(t, e) {
                var r;
                var n;
                var a = t.data;
                var o = e.data;
                var i = t.size.y;
                var u = t.size.x;
                var c;
                var f;
                var s;
                var l;
                var v;
                for(r = 1; r < i - 1; r++){
                    for(n = 1; n < u - 1; n++){
                        f = r - 1;
                        s = r + 1;
                        l = n - 1;
                        v = n + 1;
                        c = a[f * u + l] + a[f * u + v] + a[r * u + n] + a[s * u + l] + a[s * u + v];
                        o[r * u + n] = c === 5 ? 1 : 0;
                    }
                }
            }
            function C(t, e, r) {
                if (!r) {
                    r = t;
                }
                var n = t.data.length;
                var a = t.data;
                var o = e.data;
                var i = r.data;
                while(n--){
                    i[n] = a[n] - o[n];
                }
            }
            function E(t, e, r) {
                if (!r) {
                    r = t;
                }
                var n = t.data.length;
                var a = t.data;
                var o = e.data;
                var i = r.data;
                while(n--){
                    i[n] = a[n] || o[n];
                }
            }
            function M(t) {
                var e = t.data.length;
                var r = t.data;
                var n = 0;
                while(e--){
                    n += r[e];
                }
                return n;
            }
            function S(t, e, r) {
                var n;
                var a = 0;
                var o = 0;
                var i = [];
                var u;
                var c;
                var f;
                for(n = 0; n < e; n++){
                    i[n] = {
                        score: 0,
                        item: null
                    };
                }
                for(n = 0; n < t.length; n++){
                    u = r.apply(this, [
                        t[n]
                    ]);
                    if (u > o) {
                        c = i[a];
                        c.score = u;
                        c.item = t[n];
                        o = Number.MAX_VALUE;
                        for(f = 0; f < e; f++){
                            if (i[f].score < o) {
                                o = i[f].score;
                                a = f;
                            }
                        }
                    }
                }
                return i;
            }
            function A(t, e, r, n) {
                r.drawImage(t, e, 0, t.width, t.height);
                var a = r.getImageData(e, 0, t.width, t.height).data;
                D(a, n);
            }
            function k(t, e, r, n) {
                var a = t.getImageData(r.x, r.y, e.x, e.y).data;
                D(a, n);
            }
            function P(t, e, r) {
                var n = 0;
                var a = e.x;
                var o = Math.floor(t.length / 4);
                var i = e.x / 2;
                var u = 0;
                var c = e.x;
                var f;
                while(a < o){
                    for(f = 0; f < i; f++){
                        r[u] = (0.299 * t[n * 4 + 0] + 0.587 * t[n * 4 + 1] + 0.114 * t[n * 4 + 2] + (0.299 * t[(n + 1) * 4 + 0] + 0.587 * t[(n + 1) * 4 + 1] + 0.114 * t[(n + 1) * 4 + 2]) + (0.299 * t[a * 4 + 0] + 0.587 * t[a * 4 + 1] + 0.114 * t[a * 4 + 2]) + (0.299 * t[(a + 1) * 4 + 0] + 0.587 * t[(a + 1) * 4 + 1] + 0.114 * t[(a + 1) * 4 + 2])) / 4;
                        u++;
                        n += 2;
                        a += 2;
                    }
                    n += c;
                    a += c;
                }
            }
            function D(t, e, r) {
                var n = (t.length / 4) | 0;
                var a = r && r.singleChannel === true;
                if (a) {
                    for(var o = 0; o < n; o++){
                        e[o] = t[o * 4 + 0];
                    }
                } else {
                    for(var i = 0; i < n; i++){
                        e[i] = 0.299 * t[i * 4 + 0] + 0.587 * t[i * 4 + 1] + 0.114 * t[i * 4 + 2];
                    }
                }
            }
            function T(t, e) {
                var r = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : document && document.createElement("canvas");
                var n = new Image();
                n.callback = e;
                n.onload = function() {
                    r.width = this.width;
                    r.height = this.height;
                    var t = r.getContext("2d");
                    t.drawImage(this, 0, 0);
                    var e = new Uint8Array(this.width * this.height);
                    t.drawImage(this, 0, 0);
                    var n = t.getImageData(0, 0, this.width, this.height), a = n.data;
                    D(a, e);
                    this.callback(e, {
                        x: this.width,
                        y: this.height
                    }, this);
                };
                n.src = t;
            }
            function j(t, e) {
                var r = t.data;
                var n = t.size.x;
                var a = e.data;
                var o = 0;
                var i = n;
                var u = r.length;
                var c = n / 2;
                var f = 0;
                while(i < u){
                    for(var s = 0; s < c; s++){
                        a[f] = Math.floor((r[o] + r[o + 1] + r[i] + r[i + 1]) / 4);
                        f++;
                        o += 2;
                        i += 2;
                    }
                    o += n;
                    i += n;
                }
            }
            function I(t) {
                var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [
                    0,
                    0,
                    0
                ];
                var r = t[0];
                var n = t[1];
                var a = t[2];
                var o = a * n;
                var i = o * (1 - Math.abs(((r / 60) % 2) - 1));
                var u = a - o;
                var c = 0;
                var f = 0;
                var s = 0;
                if (r < 60) {
                    c = o;
                    f = i;
                } else if (r < 120) {
                    c = i;
                    f = o;
                } else if (r < 180) {
                    f = o;
                    s = i;
                } else if (r < 240) {
                    f = i;
                    s = o;
                } else if (r < 300) {
                    c = i;
                    s = o;
                } else if (r < 360) {
                    c = o;
                    s = i;
                }
                e[0] = ((c + u) * 255) | 0;
                e[1] = ((f + u) * 255) | 0;
                e[2] = ((s + u) * 255) | 0;
                return e;
            }
            function z(t) {
                var e = [];
                var r = [];
                for(var n = 1; n < Math.sqrt(t) + 1; n++){
                    if (t % n === 0) {
                        r.push(n);
                        if (n !== t / n) {
                            e.unshift(Math.floor(t / n));
                        }
                    }
                }
                return r.concat(e);
            }
            function L(t, e) {
                var r = 0;
                var n = 0;
                var a = [];
                while(r < t.length && n < e.length){
                    if (t[r] === e[n]) {
                        a.push(t[r]);
                        r++;
                        n++;
                    } else if (t[r] > e[n]) {
                        n++;
                    } else {
                        r++;
                    }
                }
                return a;
            }
            function N(t, e) {
                var r = z(e.x);
                var n = z(e.y);
                var a = Math.max(e.x, e.y);
                var o = L(r, n);
                var i = [
                    8,
                    10,
                    15,
                    20,
                    32,
                    60,
                    80
                ];
                var u = {
                    "x-small": 5,
                    small: 4,
                    medium: 3,
                    large: 2,
                    "x-large": 1
                };
                var c = u[t] || u.medium;
                var f = i[c];
                var s = Math.floor(a / f);
                var l;
                function v(t) {
                    var e = 0;
                    var r = t[Math.floor(t.length / 2)];
                    while(e < t.length - 1 && t[e] < s){
                        e++;
                    }
                    if (e > 0) {
                        if (Math.abs(t[e] - s) > Math.abs(t[e - 1] - s)) {
                            r = t[e - 1];
                        } else {
                            r = t[e];
                        }
                    }
                    if (s / r < i[c + 1] / i[c] && s / r > i[c - 1] / i[c]) {
                        return {
                            x: r,
                            y: r
                        };
                    }
                    return null;
                }
                l = v(o);
                if (!l) {
                    l = v(z(a));
                    if (!l) {
                        l = v(z(s * f));
                    }
                }
                return l;
            }
            function U(t) {
                var e = {
                    value: parseFloat(t),
                    unit: t.indexOf("%") === t.length - 1 ? "%" : "%"
                };
                return e;
            }
            var W = {
                top: function t(e, r) {
                    return e.unit === "%" ? Math.floor(r.height * (e.value / 100)) : null;
                },
                right: function t(e, r) {
                    return e.unit === "%" ? Math.floor(r.width - r.width * (e.value / 100)) : null;
                },
                bottom: function t(e, r) {
                    return e.unit === "%" ? Math.floor(r.height - r.height * (e.value / 100)) : null;
                },
                left: function t(e, r) {
                    return e.unit === "%" ? Math.floor(r.width * (e.value / 100)) : null;
                }
            };
            function B(t, e, r) {
                var n = {
                    width: t,
                    height: e
                };
                var a = Object.keys(r).reduce(function(t, e) {
                    var a = r[e];
                    var o = U(a);
                    var i = W[e](o, n);
                    t[e] = i;
                    return t;
                }, {});
                return {
                    sx: a.left,
                    sy: a.top,
                    sw: a.right - a.left,
                    sh: a.bottom - a.top
                };
            }
        },
        function(t, e, r) {
            "use strict";
            e["a"] = {
                drawRect: function t(e, r, n, a) {
                    n.strokeStyle = a.color;
                    n.fillStyle = a.color;
                    n.lineWidth = a.lineWidth || 1;
                    n.beginPath();
                    n.strokeRect(e.x, e.y, r.x, r.y);
                },
                drawPath: function t(e, r, n, a) {
                    n.strokeStyle = a.color;
                    n.fillStyle = a.color;
                    n.lineWidth = a.lineWidth;
                    n.beginPath();
                    n.moveTo(e[0][r.x], e[0][r.y]);
                    for(var o = 1; o < e.length; o++){
                        n.lineTo(e[o][r.x], e[o][r.y]);
                    }
                    n.closePath();
                    n.stroke();
                },
                drawImage: function t(e, r, n) {
                    var a = n.getImageData(0, 0, r.x, r.y);
                    var o = a.data;
                    var i = o.length;
                    var u = e.length;
                    if (i / u !== 4) {
                        return false;
                    }
                    while(u--){
                        var c = e[u];
                        o[--i] = 255;
                        o[--i] = c;
                        o[--i] = c;
                        o[--i] = c;
                    }
                    n.putImageData(a, 0, 0);
                    return true;
                }
            };
        },
        function(t, e, r) {
            "use strict";
            e["a"] = {
                init: function t(e, r) {
                    var n = e.length;
                    while(n--){
                        e[n] = r;
                    }
                },
                shuffle: function t(e) {
                    var r = e.length - 1;
                    for(r; r >= 0; r--){
                        var n = Math.floor(Math.random() * r);
                        var a = e[r];
                        e[r] = e[n];
                        e[n] = a;
                    }
                    return e;
                },
                toPointList: function t(e) {
                    var r = e.reduce(function(t, e) {
                        var r = "[".concat(e.join(","), "]");
                        t.push(r);
                        return t;
                    }, []);
                    return "[".concat(r.join(",\r\n"), "]");
                },
                threshold: function t(e, r, n) {
                    var a = e.reduce(function(t, a) {
                        if (n.apply(e, [
                            a
                        ]) >= r) {
                            t.push(a);
                        }
                        return t;
                    }, []);
                    return a;
                },
                maxIndex: function t(e) {
                    var r = 0;
                    for(var n = 0; n < e.length; n++){
                        if (e[n] > e[r]) {
                            r = n;
                        }
                    }
                    return r;
                },
                max: function t(e) {
                    var t = 0;
                    for(var r = 0; r < e.length; r++){
                        if (e[r] > t) {
                            t = e[r];
                        }
                    }
                    return t;
                },
                sum: function t(e) {
                    var r = e.length;
                    var t = 0;
                    while(r--){
                        t += e[r];
                    }
                    return t;
                }
            };
        },
        function(t, e, r) {
            "use strict";
            var n = r(83);
            var a = r.n(n);
            var o = r(3);
            var i = r.n(o);
            var u = r(4);
            var c = r.n(u);
            var f = r(0);
            var s = r.n(f);
            var l = r(7);
            var v = r.n(l);
            var h = r(8);
            var d = r(10);
            var p = {
                clone: l["clone"]
            };
            function g(t) {
                if (t < 0) {
                    throw new Error("expected positive number, received ".concat(t));
                }
            }
            var y = (function() {
                function t(e, r) {
                    var n = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Uint8Array;
                    var a = arguments.length > 3 ? arguments[3] : undefined;
                    i()(this, t);
                    s()(this, "data", void 0);
                    s()(this, "size", void 0);
                    s()(this, "indexMapping", void 0);
                    if (!r) {
                        this.data = new n(e.x * e.y);
                        if (a) {
                            d["a"].init(this.data, 0);
                        }
                    } else {
                        this.data = r;
                    }
                    this.size = e;
                }
                c()(t, [
                    {
                        key: "inImageWithBorder",
                        value: function t(e) {
                            var r = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
                            g(r);
                            return (e.x >= 0 && e.y >= 0 && e.x < this.size.x + r * 2 && e.y < this.size.y + r * 2);
                        }
                    },
                    {
                        key: "subImageAsCopy",
                        value: function t(e, r) {
                            g(r.x);
                            g(r.y);
                            var n = e.size, a = n.x, o = n.y;
                            for(var i = 0; i < a; i++){
                                for(var u = 0; u < o; u++){
                                    e.data[u * a + i] = this.data[(r.y + u) * this.size.x + r.x + i];
                                }
                            }
                            return e;
                        }
                    },
                    {
                        key: "get",
                        value: function t(e, r) {
                            return this.data[r * this.size.x + e];
                        }
                    },
                    {
                        key: "getSafe",
                        value: function t(e, r) {
                            if (!this.indexMapping) {
                                this.indexMapping = {
                                    x: [],
                                    y: []
                                };
                                for(var n = 0; n < this.size.x; n++){
                                    this.indexMapping.x[n] = n;
                                    this.indexMapping.x[n + this.size.x] = n;
                                }
                                for(var a = 0; a < this.size.y; a++){
                                    this.indexMapping.y[a] = a;
                                    this.indexMapping.y[a + this.size.y] = a;
                                }
                            }
                            return this.data[this.indexMapping.y[r + this.size.y] * this.size.x + this.indexMapping.x[e + this.size.x]];
                        }
                    },
                    {
                        key: "set",
                        value: function t(e, r, n) {
                            this.data[r * this.size.x + e] = n;
                            delete this.indexMapping;
                            return this;
                        }
                    },
                    {
                        key: "zeroBorder",
                        value: function t() {
                            var e = this.size, r = e.x, n = e.y;
                            for(var a = 0; a < r; a++){
                                this.data[a] = this.data[(n - 1) * r + a] = 0;
                            }
                            for(var o = 1; o < n - 1; o++){
                                this.data[o * r] = this.data[o * r + (r - 1)] = 0;
                            }
                            delete this.indexMapping;
                            return this;
                        }
                    },
                    {
                        key: "moments",
                        value: function t(e) {
                            var r = this.data;
                            var n;
                            var a;
                            var o = this.size.y;
                            var i = this.size.x;
                            var u;
                            var c;
                            var f = [];
                            var s;
                            var l;
                            var v;
                            var h;
                            var d;
                            var g;
                            var y;
                            var x;
                            var m = [];
                            var _ = Math.PI;
                            var b = _ / 4;
                            if (e <= 0) {
                                return m;
                            }
                            for(s = 0; s < e; s++){
                                f[s] = {
                                    m00: 0,
                                    m01: 0,
                                    m10: 0,
                                    m11: 0,
                                    m02: 0,
                                    m20: 0,
                                    theta: 0,
                                    rad: 0
                                };
                            }
                            for(a = 0; a < o; a++){
                                c = a * a;
                                for(n = 0; n < i; n++){
                                    u = r[a * i + n];
                                    if (u > 0) {
                                        l = f[u - 1];
                                        l.m00 += 1;
                                        l.m01 += a;
                                        l.m10 += n;
                                        l.m11 += n * a;
                                        l.m02 += c;
                                        l.m20 += n * n;
                                    }
                                }
                            }
                            for(s = 0; s < e; s++){
                                l = f[s];
                                if (!isNaN(l.m00) && l.m00 !== 0) {
                                    g = l.m10 / l.m00;
                                    y = l.m01 / l.m00;
                                    v = l.m11 / l.m00 - g * y;
                                    h = l.m02 / l.m00 - y * y;
                                    d = l.m20 / l.m00 - g * g;
                                    x = (h - d) / (2 * v);
                                    x = 0.5 * Math.atan(x) + (v >= 0 ? b : -b) + _;
                                    l.theta = (((x * 180) / _ + 90) % 180) - 90;
                                    if (l.theta < 0) {
                                        l.theta += 180;
                                    }
                                    l.rad = x > _ ? x - _ : x;
                                    l.vec = p.clone([
                                        Math.cos(x),
                                        Math.sin(x), 
                                    ]);
                                    m.push(l);
                                }
                            }
                            return m;
                        }
                    },
                    {
                        key: "getAsRGBA",
                        value: function t() {
                            var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1.0;
                            var r = new Uint8ClampedArray(4 * this.size.x * this.size.y);
                            for(var n = 0; n < this.size.y; n++){
                                for(var a = 0; a < this.size.x; a++){
                                    var o = n * this.size.x + a;
                                    var i = this.get(a, n) * e;
                                    r[o * 4 + 0] = i;
                                    r[o * 4 + 1] = i;
                                    r[o * 4 + 2] = i;
                                    r[o * 4 + 3] = 255;
                                }
                            }
                            return r;
                        }
                    },
                    {
                        key: "show",
                        value: function t(e) {
                            var r = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1.0;
                            var n = e.getContext("2d");
                            if (!n) {
                                throw new Error("Unable to get canvas context");
                            }
                            var a = n.getImageData(0, 0, e.width, e.height);
                            var o = this.getAsRGBA(r);
                            e.width = this.size.x;
                            e.height = this.size.y;
                            var i = new ImageData(o, a.width, a.height);
                            n.putImageData(i, 0, 0);
                        }
                    },
                    {
                        key: "overlay",
                        value: function t(e, r, n) {
                            var o = r < 0 || r > 360 ? 360 : r;
                            var i = [
                                0,
                                1,
                                1
                            ];
                            var u = [
                                0,
                                0,
                                0
                            ];
                            var c = [
                                255,
                                255,
                                255
                            ];
                            var f = [
                                0,
                                0,
                                0
                            ];
                            var s = [];
                            var l = e.getContext("2d");
                            if (!l) {
                                throw new Error("Unable to get canvas context");
                            }
                            var v = l.getImageData(n.x, n.y, this.size.x, this.size.y);
                            var d = v.data;
                            var p = this.data.length;
                            while(p--){
                                i[0] = this.data[p] * o;
                                s = i[0] <= 0 ? c : i[0] >= 360 ? f : Object(h["g"])(i, u);
                                var g = p * 4;
                                var y = s;
                                var x = a()(y, 3);
                                d[g] = x[0];
                                d[g + 1] = x[1];
                                d[g + 2] = x[2];
                                d[g + 3] = 255;
                            }
                            l.putImageData(v, n.x, n.y);
                        }
                    }, 
                ]);
                return t;
            })();
            e["a"] = y;
        },
        function(t, e, r) {
            t.exports = r(228);
        },
        function(t, e, r) {
            var n = r(227);
            function a(e, r, o) {
                if (typeof Reflect !== "undefined" && Reflect.get) {
                    t.exports = a = Reflect.get;
                    (t.exports["default"] = t.exports), (t.exports.__esModule = true);
                } else {
                    t.exports = a = function t(e, r, a) {
                        var o = n(e, r);
                        if (!o) return;
                        var i = Object.getOwnPropertyDescriptor(o, r);
                        if (i.get) {
                            return i.get.call(a);
                        }
                        return i.value;
                    };
                    (t.exports["default"] = t.exports), (t.exports.__esModule = true);
                }
                return a(e, r, o || e);
            }
            t.exports = a;
            (t.exports["default"] = t.exports), (t.exports.__esModule = true);
        },
        function(t, e) {
            function r(t) {
                var e = typeof t;
                return (t != null && (e == "object" || e == "function"));
            }
            t.exports = r;
        },
        function(t, e) {
            var r = Array.isArray;
            t.exports = r;
        },
        function(t, e, r) {
            var n = r(90), a = r(145);
            var o = a(function(t, e, r) {
                n(t, e, r);
            });
            t.exports = o;
        },
        function(t, e, r) {
            var n = r(45);
            var a = typeof self == "object" && self && self.Object === Object && self;
            var o = n || a || Function("return this")();
            t.exports = o;
        },
        function(t, e) {
            function r(t) {
                return t != null && typeof t == "object";
            }
            t.exports = r;
        },
        function(t, e) {
            function r(e) {
                "@babel/helpers - typeof";
                if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
                    t.exports = r = function t(e) {
                        return typeof e;
                    };
                    (t.exports["default"] = t.exports), (t.exports.__esModule = true);
                } else {
                    t.exports = r = function t(e) {
                        return e && typeof Symbol === "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
                    };
                    (t.exports["default"] = t.exports), (t.exports.__esModule = true);
                }
                return r(e);
            }
            t.exports = r;
            (t.exports["default"] = t.exports), (t.exports.__esModule = true);
        },
        function(t, e) {
            function r(t, e, r, n, a, o, i) {
                try {
                    var u = t[o](i);
                    var c = u.value;
                } catch (f) {
                    r(f);
                    return;
                }
                if (u.done) {
                    e(c);
                } else {
                    Promise.resolve(c).then(n, a);
                }
            }
            function n(t) {
                return function() {
                    var e = this, n = arguments;
                    return new Promise(function(a, o) {
                        var i = t.apply(e, n);
                        function u(t) {
                            r(i, a, o, u, c, "next", t);
                        }
                        function c(t) {
                            r(i, a, o, u, c, "throw", t);
                        }
                        u(undefined);
                    });
                };
            }
            t.exports = n;
            (t.exports["default"] = t.exports), (t.exports.__esModule = true);
        },
        function(t, e, r) {
            "use strict";
            var n = {
                searchDirections: [
                    [
                        0,
                        1
                    ],
                    [
                        1,
                        1
                    ],
                    [
                        1,
                        0
                    ],
                    [
                        1,
                        -1
                    ],
                    [
                        0,
                        -1
                    ],
                    [
                        -1,
                        -1
                    ],
                    [
                        -1,
                        0
                    ],
                    [
                        -1,
                        1
                    ], 
                ],
                create: function t(e, r) {
                    var n = e.data;
                    var a = r.data;
                    var o = this.searchDirections;
                    var i = e.size.x;
                    var u;
                    function c(t, e, r, c) {
                        var f;
                        var s;
                        var l;
                        for(f = 0; f < 7; f++){
                            s = t.cy + o[t.dir][0];
                            l = t.cx + o[t.dir][1];
                            u = s * i + l;
                            if (n[u] === e && (a[u] === 0 || a[u] === r)) {
                                a[u] = r;
                                t.cy = s;
                                t.cx = l;
                                return true;
                            }
                            if (a[u] === 0) {
                                a[u] = c;
                            }
                            t.dir = (t.dir + 1) % 8;
                        }
                        return false;
                    }
                    function f(t, e, r) {
                        return {
                            dir: r,
                            x: t,
                            y: e,
                            next: null,
                            prev: null
                        };
                    }
                    function s(t, e, r, n, a) {
                        var o = null;
                        var i;
                        var u;
                        var s;
                        var l = {
                            cx: e,
                            cy: t,
                            dir: 0
                        };
                        if (c(l, n, r, a)) {
                            o = f(e, t, l.dir);
                            i = o;
                            s = l.dir;
                            u = f(l.cx, l.cy, 0);
                            u.prev = i;
                            i.next = u;
                            u.next = null;
                            i = u;
                            do {
                                l.dir = (l.dir + 6) % 8;
                                c(l, n, r, a);
                                if (s !== l.dir) {
                                    i.dir = l.dir;
                                    u = f(l.cx, l.cy, 0);
                                    u.prev = i;
                                    i.next = u;
                                    u.next = null;
                                    i = u;
                                } else {
                                    i.dir = s;
                                    i.x = l.cx;
                                    i.y = l.cy;
                                }
                                s = l.dir;
                            }while (l.cx !== e || l.cy !== t)
                            o.prev = i.prev;
                            i.prev.next = o;
                        }
                        return o;
                    }
                    return {
                        trace: function t(e, r, n, a) {
                            return c(e, r, n, a);
                        },
                        contourTracing: function t(e, r, n, a, o) {
                            return s(e, r, n, a, o);
                        }
                    };
                }
            };
            e["a"] = n;
        },
        function(t, e, r) {
            var n = r(27), a = r(103), o = r(104);
            var i = "[object Null]", u = "[object Undefined]";
            var c = n ? n.toStringTag : undefined;
            function f(t) {
                if (t == null) {
                    return t === undefined ? u : i;
                }
                return c && c in Object(t) ? a(t) : o(t);
            }
            t.exports = f;
        },
        function(t, e, r) {
            "use strict";
            (function(t) {
                var n = r(7);
                var a = r.n(n);
                var o = r(34);
                var i = r.n(o);
                var u = r(11);
                var c = r(8);
                var f = r(10);
                var s = r(9);
                var l = r(87);
                var v = r(21);
                var h = r(88);
                var d;
                var p;
                var g;
                var y;
                var x;
                var m;
                var _;
                var b;
                var w;
                var O;
                var R = {
                    ctx: {
                        binary: null
                    },
                    dom: {
                        binary: null
                    }
                };
                var C = {
                    x: 0,
                    y: 0
                };
                var E;
                var M;
                function S() {
                    if (d.halfSample) {
                        p = new u["a"]({
                            x: (E.size.x / 2) | 0,
                            y: (E.size.y / 2) | 0
                        });
                    } else {
                        p = E;
                    }
                    O = Object(c["a"])(d.patchSize, p.size);
                    C.x = (p.size.x / O.x) | 0;
                    C.y = (p.size.y / O.y) | 0;
                    w = new u["a"](p.size, undefined, Uint8Array, false);
                    x = new u["a"](O, undefined, Array, true);
                    var e = new ArrayBuffer(64 * 1024);
                    y = new u["a"](O, new Uint8Array(e, 0, O.x * O.y));
                    g = new u["a"](O, new Uint8Array(e, O.x * O.y * 3, O.x * O.y), undefined, true);
                    M = Object(h["a"])(typeof window !== "undefined" ? window : typeof self !== "undefined" ? self : t, {
                        size: O.x
                    }, e);
                    b = new u["a"]({
                        x: (p.size.x / y.size.x) | 0,
                        y: (p.size.y / y.size.y) | 0
                    }, undefined, Array, true);
                    m = new u["a"](b.size, undefined, undefined, true);
                    _ = new u["a"](b.size, undefined, Int32Array, true);
                }
                function A() {
                    if (d.useWorker || typeof document === "undefined") {
                        return;
                    }
                    R.dom.binary = document.createElement("canvas");
                    R.dom.binary.className = "binaryBuffer";
                    if (true && d.debug.showCanvas === true) {
                        document.querySelector("#debug").appendChild(R.dom.binary);
                    }
                    R.ctx.binary = R.dom.binary.getContext("2d");
                    R.dom.binary.width = w.size.x;
                    R.dom.binary.height = w.size.y;
                }
                function k(t) {
                    var e;
                    var r;
                    var a;
                    var i;
                    var u;
                    var c = w.size.x;
                    var f = w.size.y;
                    var l = -w.size.x;
                    var v = -w.size.y;
                    var h;
                    var p;
                    e = 0;
                    for(r = 0; r < t.length; r++){
                        i = t[r];
                        e += i.rad;
                        if (true && d.debug.showPatches) {
                            s["a"].drawRect(i.pos, y.size, R.ctx.binary, {
                                color: "red"
                            });
                        }
                    }
                    e /= t.length;
                    e = (((e * 180) / Math.PI + 90) % 180) - 90;
                    if (e < 0) {
                        e += 180;
                    }
                    e = ((180 - e) * Math.PI) / 180;
                    u = o["copy"](o["create"](), [
                        Math.cos(e),
                        Math.sin(e),
                        -Math.sin(e),
                        Math.cos(e), 
                    ]);
                    for(r = 0; r < t.length; r++){
                        i = t[r];
                        for(a = 0; a < 4; a++){
                            n["transformMat2"](i.box[a], i.box[a], u);
                        }
                        if (true && d.debug.boxFromPatches.showTransformed) {
                            s["a"].drawPath(i.box, {
                                x: 0,
                                y: 1
                            }, R.ctx.binary, {
                                color: "#99ff00",
                                lineWidth: 2
                            });
                        }
                    }
                    for(r = 0; r < t.length; r++){
                        i = t[r];
                        for(a = 0; a < 4; a++){
                            if (i.box[a][0] < c) {
                                c = i.box[a][0];
                            }
                            if (i.box[a][0] > l) {
                                l = i.box[a][0];
                            }
                            if (i.box[a][1] < f) {
                                f = i.box[a][1];
                            }
                            if (i.box[a][1] > v) {
                                v = i.box[a][1];
                            }
                        }
                    }
                    h = [
                        [
                            c,
                            f
                        ],
                        [
                            l,
                            f
                        ],
                        [
                            l,
                            v
                        ],
                        [
                            c,
                            v
                        ], 
                    ];
                    if (true && d.debug.boxFromPatches.showTransformedBox) {
                        s["a"].drawPath(h, {
                            x: 0,
                            y: 1
                        }, R.ctx.binary, {
                            color: "#ff0000",
                            lineWidth: 2
                        });
                    }
                    p = d.halfSample ? 2 : 1;
                    u = o["invert"](u, u);
                    for(a = 0; a < 4; a++){
                        n["transformMat2"](h[a], h[a], u);
                    }
                    if (true && d.debug.boxFromPatches.showBB) {
                        s["a"].drawPath(h, {
                            x: 0,
                            y: 1
                        }, R.ctx.binary, {
                            color: "#ff0000",
                            lineWidth: 2
                        });
                    }
                    for(a = 0; a < 4; a++){
                        n["scale"](h[a], h[a], p);
                    }
                    return h;
                }
                function P() {
                    Object(c["i"])(p, w);
                    w.zeroBorder();
                    if (true && d.debug.showCanvas) {
                        w.show(R.dom.binary, 255);
                    }
                }
                function D() {
                    var t;
                    var e;
                    var r;
                    var n;
                    var a;
                    var o = [];
                    var i;
                    var u;
                    var c;
                    for(t = 0; t < C.x; t++){
                        for(e = 0; e < C.y; e++){
                            r = y.size.x * t;
                            n = y.size.y * e;
                            z(r, n);
                            g.zeroBorder();
                            f["a"].init(x.data, 0);
                            i = l["a"].create(g, x);
                            u = i.rasterize(0);
                            if (true && d.debug.showLabels) {
                                x.overlay(R.dom.binary, Math.floor(360 / u.count), {
                                    x: r,
                                    y: n
                                });
                            }
                            a = x.moments(u.count);
                            o = o.concat(L(a, [
                                t,
                                e
                            ], r, n));
                        }
                    }
                    if (true && d.debug.showFoundPatches) {
                        for(t = 0; t < o.length; t++){
                            c = o[t];
                            s["a"].drawRect(c.pos, y.size, R.ctx.binary, {
                                color: "#99ff00",
                                lineWidth: 2
                            });
                        }
                    }
                    return o;
                }
                function T(t) {
                    var e;
                    var r;
                    var n = [];
                    var a = [];
                    for(e = 0; e < t; e++){
                        n.push(0);
                    }
                    r = _.data.length;
                    while(r--){
                        if (_.data[r] > 0) {
                            n[_.data[r] - 1]++;
                        }
                    }
                    n = n.map(function(t, e) {
                        return {
                            val: t,
                            label: e + 1
                        };
                    });
                    n.sort(function(t, e) {
                        return e.val - t.val;
                    });
                    a = n.filter(function(t) {
                        return t.val >= 5;
                    });
                    return a;
                }
                function j(t, e) {
                    var r;
                    var n;
                    var a;
                    var o = [];
                    var i;
                    var u;
                    var f = [];
                    var l = [
                        0,
                        1,
                        1
                    ];
                    var v = [
                        0,
                        0,
                        0
                    ];
                    for(r = 0; r < t.length; r++){
                        a = _.data.length;
                        o.length = 0;
                        while(a--){
                            if (_.data[a] === t[r].label) {
                                i = b.data[a];
                                o.push(i);
                            }
                        }
                        u = k(o);
                        if (u) {
                            f.push(u);
                            if (true && d.debug.showRemainingPatchLabels) {
                                for(n = 0; n < o.length; n++){
                                    i = o[n];
                                    l[0] = (t[r].label / (e + 1)) * 360;
                                    Object(c["g"])(l, v);
                                    s["a"].drawRect(i.pos, y.size, R.ctx.binary, {
                                        color: "rgb(".concat(v.join(","), ")"),
                                        lineWidth: 2
                                    });
                                }
                            }
                        }
                    }
                    return f;
                }
                function I(t) {
                    var e = Object(c["b"])(t, 0.9);
                    var r = Object(c["j"])(e, 1, function(t) {
                        return t.getPoints().length;
                    });
                    var n = [];
                    var a = [];
                    if (r.length === 1) {
                        n = r[0].item.getPoints();
                        for(var o = 0; o < n.length; o++){
                            a.push(n[o].point);
                        }
                    }
                    return a;
                }
                function z(t, e) {
                    w.subImageAsCopy(y, Object(c["h"])(t, e));
                    M.skeletonize();
                    if (true && d.debug.showSkeleton) {
                        g.overlay(R.dom.binary, 360, Object(c["h"])(t, e));
                    }
                }
                function L(t, e, r, a) {
                    var o;
                    var i;
                    var u = [];
                    var c;
                    var f;
                    var s = [];
                    var l = Math.ceil(O.x / 3);
                    if (t.length >= 2) {
                        for(o = 0; o < t.length; o++){
                            if (t[o].m00 > l) {
                                u.push(t[o]);
                            }
                        }
                        if (u.length >= 2) {
                            c = I(u);
                            i = 0;
                            for(o = 0; o < c.length; o++){
                                i += c[o].rad;
                            }
                            if (c.length > 1 && c.length >= (u.length / 4) * 3 && c.length > t.length / 4) {
                                i /= c.length;
                                f = {
                                    index: e[1] * C.x + e[0],
                                    pos: {
                                        x: r,
                                        y: a
                                    },
                                    box: [
                                        n["clone"]([
                                            r,
                                            a
                                        ]),
                                        n["clone"]([
                                            r + y.size.x,
                                            a
                                        ]),
                                        n["clone"]([
                                            r + y.size.x,
                                            a + y.size.y, 
                                        ]),
                                        n["clone"]([
                                            r,
                                            a + y.size.y
                                        ]), 
                                    ],
                                    moments: c,
                                    rad: i,
                                    vec: n["clone"]([
                                        Math.cos(i),
                                        Math.sin(i)
                                    ])
                                };
                                s.push(f);
                            }
                        }
                    }
                    return s;
                }
                function N(t) {
                    var e = 0;
                    var r = 0.95;
                    var a = 0;
                    var o;
                    var i;
                    var u = [
                        0,
                        1,
                        1
                    ];
                    var l = [
                        0,
                        0,
                        0
                    ];
                    function h() {
                        var t;
                        for(t = 0; t < _.data.length; t++){
                            if (_.data[t] === 0 && m.data[t] === 1) {
                                return t;
                            }
                        }
                        return _.length;
                    }
                    function p(t) {
                        var a;
                        var o;
                        var i;
                        var u;
                        var c;
                        var f = {
                            x: t % _.size.x,
                            y: (t / _.size.x) | 0
                        };
                        var s;
                        if (t < _.data.length) {
                            i = b.data[t];
                            _.data[t] = e;
                            for(c = 0; c < v["a"].searchDirections.length; c++){
                                o = f.y + v["a"].searchDirections[c][0];
                                a = f.x + v["a"].searchDirections[c][1];
                                u = o * _.size.x + a;
                                if (m.data[u] === 0) {
                                    _.data[u] = Number.MAX_VALUE;
                                    continue;
                                }
                                if (_.data[u] === 0) {
                                    s = Math.abs(n["dot"](b.data[u].vec, i.vec));
                                    if (s > r) {
                                        p(u);
                                    }
                                }
                            }
                        }
                    }
                    f["a"].init(m.data, 0);
                    f["a"].init(_.data, 0);
                    f["a"].init(b.data, null);
                    for(o = 0; o < t.length; o++){
                        i = t[o];
                        b.data[i.index] = i;
                        m.data[i.index] = 1;
                    }
                    m.zeroBorder();
                    while((a = h()) < _.data.length){
                        e++;
                        p(a);
                    }
                    if (true && d.debug.showPatchLabels) {
                        for(o = 0; o < _.data.length; o++){
                            if (_.data[o] > 0 && _.data[o] <= e) {
                                i = b.data[o];
                                u[0] = (_.data[o] / (e + 1)) * 360;
                                Object(c["g"])(u, l);
                                s["a"].drawRect(i.pos, y.size, R.ctx.binary, {
                                    color: "rgb(".concat(l.join(","), ")"),
                                    lineWidth: 2
                                });
                            }
                        }
                    }
                    return e;
                }
                e["a"] = {
                    init: function t(e, r) {
                        d = r;
                        E = e;
                        S();
                        A();
                    },
                    locate: function t() {
                        if (d.halfSample) {
                            Object(c["f"])(E, p);
                        }
                        P();
                        var e = D();
                        if (e.length < C.x * C.y * 0.05) {
                            return null;
                        }
                        var r = N(e);
                        if (r < 1) {
                            return null;
                        }
                        var n = T(r);
                        if (n.length === 0) {
                            return null;
                        }
                        var a = j(n, r);
                        return a;
                    },
                    checkImageConstraints: function t(e, r) {
                        var n;
                        var a = e.getWidth();
                        var o = e.getHeight();
                        var i = r.halfSample ? 0.5 : 1;
                        var u;
                        if (e.getConfig().area) {
                            u = Object(c["d"])(a, o, e.getConfig().area);
                            e.setTopRight({
                                x: u.sx,
                                y: u.sy
                            });
                            e.setCanvasSize({
                                x: a,
                                y: o
                            });
                            a = u.sw;
                            o = u.sh;
                        }
                        var f = {
                            x: Math.floor(a * i),
                            y: Math.floor(o * i)
                        };
                        n = Object(c["a"])(r.patchSize, f);
                        if (true) {
                            console.log("Patch-Size: ".concat(JSON.stringify(n)));
                        }
                        e.setWidth(Math.floor(Math.floor(f.x / n.x) * (1 / i) * n.x));
                        e.setHeight(Math.floor(Math.floor(f.y / n.y) * (1 / i) * n.y));
                        if (e.getWidth() % n.x === 0 && e.getHeight() % n.y === 0) {
                            return true;
                        }
                        throw new Error("Image dimensions do not comply with the current settings: Width (".concat(a, " )and height (").concat(o, ") must a multiple of ").concat(n.x));
                    }
                };
            }.call(this, r(46)));
        },
        function(t, e, r) {
            var n = r(92), a = r(93), o = r(94), i = r(95), u = r(96);
            function c(t) {
                var e = -1, r = t == null ? 0 : t.length;
                this.clear();
                while(++e < r){
                    var n = t[e];
                    this.set(n[0], n[1]);
                }
            }
            c.prototype.clear = n;
            c.prototype["delete"] = a;
            c.prototype.get = o;
            c.prototype.has = i;
            c.prototype.set = u;
            t.exports = c;
        },
        function(t, e, r) {
            var n = r(26);
            function a(t, e) {
                var r = t.length;
                while(r--){
                    if (n(t[r][0], e)) {
                        return r;
                    }
                }
                return -1;
            }
            t.exports = a;
        },
        function(t, e) {
            function r(t, e) {
                return (t === e || (t !== t && e !== e));
            }
            t.exports = r;
        },
        function(t, e, r) {
            var n = r(17);
            var a = n.Symbol;
            t.exports = a;
        },
        function(t, e, r) {
            var n = r(35);
            var a = n(Object, "create");
            t.exports = a;
        },
        function(t, e, r) {
            var n = r(117);
            function a(t, e) {
                var r = t.__data__;
                return n(e) ? r[typeof e == "string" ? "string" : "hash"] : r.map;
            }
            t.exports = a;
        },
        function(t, e, r) {
            var n = r(132), a = r(18);
            var o = Object.prototype;
            var i = o.hasOwnProperty;
            var u = o.propertyIsEnumerable;
            var c = n((function() {
                return arguments;
            })()) ? n : function(t) {
                return (a(t) && i.call(t, "callee") && !u.call(t, "callee"));
            };
            t.exports = c;
        },
        function(t, e) {
            var r = 9007199254740991;
            var n = /^(?:0|[1-9]\d*)$/;
            function a(t, e) {
                var a = typeof t;
                e = e == null ? r : e;
                return (!!e && (a == "number" || (a != "symbol" && n.test(t))) && t > -1 && t % 1 == 0 && t < e);
            }
            t.exports = a;
        },
        function(t, e, r) {
            var n = r(15), a = r(232), o = r(233), i = r(236);
            function u(t, e) {
                if (n(t)) {
                    return t;
                }
                return a(t, e) ? [
                    t
                ] : o(i(t));
            }
            t.exports = u;
        },
        function(t, e, r) {
            var n = r(224);
            var a = r(225);
            var o = r(60);
            var i = r(226);
            function u(t) {
                return (n(t) || a(t) || o(t) || i());
            }
            t.exports = u;
            (t.exports["default"] = t.exports), (t.exports.__esModule = true);
        },
        function(t, e, r) {
            t.exports = {
                determinant: r(251),
                transpose: r(252),
                multiply: r(253),
                identity: r(254),
                adjoint: r(255),
                rotate: r(256),
                invert: r(257),
                create: r(258),
                scale: r(259),
                copy: r(260),
                frob: r(261),
                ldu: r(262)
            };
        },
        function(t, e, r) {
            var n = r(102), a = r(108);
            function o(t, e) {
                var r = a(t, e);
                return n(r) ? r : undefined;
            }
            t.exports = o;
        },
        function(t, e, r) {
            var n = r(22), a = r(14);
            var o = "[object AsyncFunction]", i = "[object Function]", u = "[object GeneratorFunction]", c = "[object Proxy]";
            function f(t) {
                if (!a(t)) {
                    return false;
                }
                var e = n(t);
                return (e == i || e == u || e == o || e == c);
            }
            t.exports = f;
        },
        function(t, e, r) {
            var n = r(49);
            function a(t, e, r) {
                if (e == "__proto__" && n) {
                    n(t, e, {
                        configurable: true,
                        enumerable: true,
                        value: r,
                        writable: true
                    });
                } else {
                    t[e] = r;
                }
            }
            t.exports = a;
        },
        function(t, e) {
            t.exports = function(t) {
                if (!t.webpackPolyfill) {
                    t.deprecate = function() {};
                    t.paths = [];
                    if (!t.children) t.children = [];
                    Object.defineProperty(t, "loaded", {
                        enumerable: true,
                        get: function() {
                            return t.l;
                        }
                    });
                    Object.defineProperty(t, "id", {
                        enumerable: true,
                        get: function() {
                            return t.i;
                        }
                    });
                    t.webpackPolyfill = 1;
                }
                return t;
            };
        },
        function(t, e, r) {
            var n = r(36), a = r(40);
            function o(t) {
                return (t != null && a(t.length) && !n(t));
            }
            t.exports = o;
        },
        function(t, e) {
            var r = 9007199254740991;
            function n(t) {
                return (typeof t == "number" && t > -1 && t % 1 == 0 && t <= r);
            }
            t.exports = n;
        },
        function(t, e) {
            function r(e, n) {
                t.exports = r = Object.setPrototypeOf || function t(e, r) {
                    e.__proto__ = r;
                    return e;
                };
                (t.exports["default"] = t.exports), (t.exports.__esModule = true);
                return r(e, n);
            }
            t.exports = r;
            (t.exports["default"] = t.exports), (t.exports.__esModule = true);
        },
        function(t, e, r) {
            var n = r(22), a = r(18);
            var o = "[object Symbol]";
            function i(t) {
                return (typeof t == "symbol" || (a(t) && n(t) == o));
            }
            t.exports = i;
        },
        function(t, e, r) {
            var n = r(42);
            var a = 1 / 0;
            function o(t) {
                if (typeof t == "string" || n(t)) {
                    return t;
                }
                var e = t + "";
                return e == "0" && 1 / t == -a ? "-0" : e;
            }
            t.exports = o;
        },
        function(t, e, r) {
            var n = r(35), a = r(17);
            var o = n(a, "Map");
            t.exports = o;
        },
        function(t, e, r) {
            (function(e) {
                var r = typeof e == "object" && e && e.Object === Object && e;
                t.exports = r;
            }.call(this, r(46)));
        },
        function(t, e) {
            var r;
            r = (function() {
                return this;
            })();
            try {
                r = r || new Function("return this")();
            } catch (n) {
                if (typeof window === "object") r = window;
            }
            t.exports = r;
        },
        function(t, e, r) {
            var n = r(109), a = r(116), o = r(118), i = r(119), u = r(120);
            function c(t) {
                var e = -1, r = t == null ? 0 : t.length;
                this.clear();
                while(++e < r){
                    var n = t[e];
                    this.set(n[0], n[1]);
                }
            }
            c.prototype.clear = n;
            c.prototype["delete"] = a;
            c.prototype.get = o;
            c.prototype.has = i;
            c.prototype.set = u;
            t.exports = c;
        },
        function(t, e, r) {
            var n = r(37), a = r(26);
            function o(t, e, r) {
                if ((r !== undefined && !a(t[e], r)) || (r === undefined && !(e in t))) {
                    n(t, e, r);
                }
            }
            t.exports = o;
        },
        function(t, e, r) {
            var n = r(35);
            var a = (function() {
                try {
                    var t = n(Object, "defineProperty");
                    t({}, "", {});
                    return t;
                } catch (e) {}
            })();
            t.exports = a;
        },
        function(t, e, r) {
            var n = r(131);
            var a = n(Object.getPrototypeOf, Object);
            t.exports = a;
        },
        function(t, e) {
            var r = Object.prototype;
            function n(t) {
                var e = t && t.constructor, n = (typeof e == "function" && e.prototype) || r;
                return t === n;
            }
            t.exports = n;
        },
        function(t, e, r) {
            (function(t) {
                var n = r(17), a = r(134);
                var o = true && e && !e.nodeType && e;
                var i = o && typeof t == "object" && t && !t.nodeType && t;
                var u = i && i.exports === o;
                var c = u ? n.Buffer : undefined;
                var f = c ? c.isBuffer : undefined;
                var s = f || a;
                t.exports = s;
            }.call(this, r(38)(t)));
        },
        function(t, e, r) {
            var n = r(136), a = r(137), o = r(138);
            var i = o && o.isTypedArray;
            var u = i ? a(i) : n;
            t.exports = u;
        },
        function(t, e) {
            function r(t, e) {
                if (e === "constructor" && typeof t[e] === "function") {
                    return;
                }
                if (e == "__proto__") {
                    return;
                }
                return t[e];
            }
            t.exports = r;
        },
        function(t, e, r) {
            var n = r(37), a = r(26);
            var o = Object.prototype;
            var i = o.hasOwnProperty;
            function u(t, e, r) {
                var o = t[e];
                if (!(i.call(t, e) && a(o, r)) || (r === undefined && !(e in t))) {
                    n(t, e, r);
                }
            }
            t.exports = u;
        },
        function(t, e, r) {
            var n = r(141), a = r(143), o = r(39);
            function i(t) {
                return o(t) ? n(t, true) : a(t);
            }
            t.exports = i;
        },
        function(t, e) {
            function r(t) {
                return t;
            }
            t.exports = r;
        },
        function(t, e, r) {
            var n = r(147);
            var a = Math.max;
            function o(t, e, r) {
                e = a(e === undefined ? t.length - 1 : e, 0);
                return function() {
                    var o = arguments, i = -1, u = a(o.length - e, 0), c = Array(u);
                    while(++i < u){
                        c[i] = o[e + i];
                    }
                    i = -1;
                    var f = Array(e + 1);
                    while(++i < e){
                        f[i] = o[i];
                    }
                    f[e] = r(c);
                    return n(t, this, f);
                };
            }
            t.exports = o;
        },
        function(t, e, r) {
            var n = r(148), a = r(150);
            var o = a(n);
            t.exports = o;
        },
        function(t, e, r) {
            var n = r(61);
            function a(t, e) {
                if (!t) return;
                if (typeof t === "string") return n(t, e);
                var r = Object.prototype.toString.call(t).slice(8, -1);
                if (r === "Object" && t.constructor) r = t.constructor.name;
                if (r === "Map" || r === "Set") return Array.from(t);
                if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return n(t, e);
            }
            t.exports = a;
            (t.exports["default"] = t.exports), (t.exports.__esModule = true);
        },
        function(t, e) {
            function r(t, e) {
                if (e == null || e > t.length) e = t.length;
                for(var r = 0, n = new Array(e); r < e; r++){
                    n[r] = t[r];
                }
                return n;
            }
            t.exports = r;
            (t.exports["default"] = t.exports), (t.exports.__esModule = true);
        },
        function(t, e) {
            t.exports = 0.000001;
        },
        function(t, e) {
            t.exports = r;
            function r() {
                var t = new Float32Array(2);
                t[0] = 0;
                t[1] = 0;
                return t;
            }
        },
        function(t, e) {
            t.exports = r;
            function r(t, e, r) {
                t[0] = e[0] - r[0];
                t[1] = e[1] - r[1];
                return t;
            }
        },
        function(t, e) {
            t.exports = r;
            function r(t, e, r) {
                t[0] = e[0] * r[0];
                t[1] = e[1] * r[1];
                return t;
            }
        },
        function(t, e) {
            t.exports = r;
            function r(t, e, r) {
                t[0] = e[0] / r[0];
                t[1] = e[1] / r[1];
                return t;
            }
        },
        function(t, e) {
            t.exports = r;
            function r(t, e) {
                var r = e[0] - t[0], n = e[1] - t[1];
                return Math.sqrt(r * r + n * n);
            }
        },
        function(t, e) {
            t.exports = r;
            function r(t, e) {
                var r = e[0] - t[0], n = e[1] - t[1];
                return r * r + n * n;
            }
        },
        function(t, e) {
            t.exports = r;
            function r(t) {
                var e = t[0], r = t[1];
                return Math.sqrt(e * e + r * r);
            }
        },
        function(t, e) {
            t.exports = r;
            function r(t) {
                var e = t[0], r = t[1];
                return e * e + r * r;
            }
        },
        function(t, e) {
            t.exports = 0.000001;
        },
        function(t, e) {
            t.exports = r;
            function r() {
                var t = new Float32Array(3);
                t[0] = 0;
                t[1] = 0;
                t[2] = 0;
                return t;
            }
        },
        function(t, e) {
            t.exports = r;
            function r(t, e, r) {
                var n = new Float32Array(3);
                n[0] = t;
                n[1] = e;
                n[2] = r;
                return n;
            }
        },
        function(t, e) {
            t.exports = r;
            function r(t, e) {
                var r = e[0], n = e[1], a = e[2];
                var o = r * r + n * n + a * a;
                if (o > 0) {
                    o = 1 / Math.sqrt(o);
                    t[0] = e[0] * o;
                    t[1] = e[1] * o;
                    t[2] = e[2] * o;
                }
                return t;
            }
        },
        function(t, e) {
            t.exports = r;
            function r(t, e) {
                return t[0] * e[0] + t[1] * e[1] + t[2] * e[2];
            }
        },
        function(t, e) {
            t.exports = r;
            function r(t, e, r) {
                t[0] = e[0] - r[0];
                t[1] = e[1] - r[1];
                t[2] = e[2] - r[2];
                return t;
            }
        },
        function(t, e) {
            t.exports = r;
            function r(t, e, r) {
                t[0] = e[0] * r[0];
                t[1] = e[1] * r[1];
                t[2] = e[2] * r[2];
                return t;
            }
        },
        function(t, e) {
            t.exports = r;
            function r(t, e, r) {
                t[0] = e[0] / r[0];
                t[1] = e[1] / r[1];
                t[2] = e[2] / r[2];
                return t;
            }
        },
        function(t, e) {
            t.exports = r;
            function r(t, e) {
                var r = e[0] - t[0], n = e[1] - t[1], a = e[2] - t[2];
                return Math.sqrt(r * r + n * n + a * a);
            }
        },
        function(t, e) {
            t.exports = r;
            function r(t, e) {
                var r = e[0] - t[0], n = e[1] - t[1], a = e[2] - t[2];
                return r * r + n * n + a * a;
            }
        },
        function(t, e) {
            t.exports = r;
            function r(t) {
                var e = t[0], r = t[1], n = t[2];
                return Math.sqrt(e * e + r * r + n * n);
            }
        },
        function(t, e) {
            t.exports = r;
            function r(t) {
                var e = t[0], r = t[1], n = t[2];
                return e * e + r * r + n * n;
            }
        },
        function(t, e, r) {
            var n = r(153);
            var a = r(154);
            var o = r(60);
            var i = r(155);
            function u(t, e) {
                return (n(t) || a(t, e) || o(t, e) || i());
            }
            t.exports = u;
            (t.exports["default"] = t.exports), (t.exports.__esModule = true);
        },
        function(t, e, r) {
            t.exports = {
                EPSILON: r(71),
                create: r(72),
                clone: r(191),
                angle: r(192),
                fromValues: r(73),
                copy: r(193),
                set: r(194),
                equals: r(195),
                exactEquals: r(196),
                add: r(197),
                subtract: r(76),
                sub: r(198),
                multiply: r(77),
                mul: r(199),
                divide: r(78),
                div: r(200),
                min: r(201),
                max: r(202),
                floor: r(203),
                ceil: r(204),
                round: r(205),
                scale: r(206),
                scaleAndAdd: r(207),
                distance: r(79),
                dist: r(208),
                squaredDistance: r(80),
                sqrDist: r(209),
                length: r(81),
                len: r(210),
                squaredLength: r(82),
                sqrLen: r(211),
                negate: r(212),
                inverse: r(213),
                normalize: r(74),
                dot: r(75),
                cross: r(214),
                lerp: r(215),
                random: r(216),
                transformMat4: r(217),
                transformMat3: r(218),
                transformQuat: r(219),
                rotateX: r(220),
                rotateY: r(221),
                rotateZ: r(222),
                forEach: r(223)
            };
        },
        function(t, e, r) {
            var n = r(229), a = r(243);
            var o = a(function(t, e) {
                return t == null ? {} : n(t, e);
            });
            t.exports = o;
        },
        function(t, e, r) {
            var n = r(2);
            var a = r(41);
            var o = r(248);
            var i = r(249);
            function u(e) {
                var r = typeof Map === "function" ? new Map() : undefined;
                t.exports = u = function t(e) {
                    if (e === null || !o(e)) return e;
                    if (typeof e !== "function") {
                        throw new TypeError("Super expression must either be null or a function");
                    }
                    if (typeof r !== "undefined") {
                        if (r.has(e)) return r.get(e);
                        r.set(e, u);
                    }
                    function u() {
                        return i(e, arguments, n(this).constructor);
                    }
                    u.prototype = Object.create(e.prototype, {
                        constructor: {
                            value: u,
                            enumerable: false,
                            writable: true,
                            configurable: true
                        }
                    });
                    return a(u, e);
                };
                (t.exports["default"] = t.exports), (t.exports.__esModule = true);
                return u(e);
            }
            t.exports = u;
            (t.exports["default"] = t.exports), (t.exports.__esModule = true);
        },
        function(t, e, r) {
            "use strict";
            var n = r(21);
            var a = {
                createContour2D: function t() {
                    return {
                        dir: null,
                        index: null,
                        firstVertex: null,
                        insideContours: null,
                        nextpeer: null,
                        prevpeer: null
                    };
                },
                CONTOUR_DIR: {
                    CW_DIR: 0,
                    CCW_DIR: 1,
                    UNKNOWN_DIR: 2
                },
                DIR: {
                    OUTSIDE_EDGE: -32767,
                    INSIDE_EDGE: -32766
                },
                create: function t(e, r) {
                    var o = e.data;
                    var i = r.data;
                    var u = e.size.x;
                    var c = e.size.y;
                    var f = n["a"].create(e, r);
                    return {
                        rasterize: function t(e) {
                            var r;
                            var n;
                            var s;
                            var l;
                            var v;
                            var h;
                            var d = [];
                            var p;
                            var g;
                            var y;
                            var x;
                            var m;
                            var _ = 0;
                            var b;
                            for(b = 0; b < 400; b++){
                                d[b] = 0;
                            }
                            d[0] = o[0];
                            y = null;
                            for(h = 1; h < c - 1; h++){
                                l = 0;
                                n = d[0];
                                for(v = 1; v < u - 1; v++){
                                    m = h * u + v;
                                    if (i[m] === 0) {
                                        r = o[m];
                                        if (r !== n) {
                                            if (l === 0) {
                                                s = _ + 1;
                                                d[s] = r;
                                                n = r;
                                                p = f.contourTracing(h, v, s, r, a.DIR.OUTSIDE_EDGE);
                                                if (p !== null) {
                                                    _++;
                                                    l = s;
                                                    g = a.createContour2D();
                                                    g.dir = a.CONTOUR_DIR.CW_DIR;
                                                    g.index = l;
                                                    g.firstVertex = p;
                                                    g.nextpeer = y;
                                                    g.insideContours = null;
                                                    if (y !== null) {
                                                        y.prevpeer = g;
                                                    }
                                                    y = g;
                                                }
                                            } else {
                                                p = f.contourTracing(h, v, a.DIR.INSIDE_EDGE, r, l);
                                                if (p !== null) {
                                                    g = a.createContour2D();
                                                    g.firstVertex = p;
                                                    g.insideContours = null;
                                                    if (e === 0) {
                                                        g.dir = a.CONTOUR_DIR.CCW_DIR;
                                                    } else {
                                                        g.dir = a.CONTOUR_DIR.CW_DIR;
                                                    }
                                                    g.index = e;
                                                    x = y;
                                                    while(x !== null && x.index !== l){
                                                        x = x.nextpeer;
                                                    }
                                                    if (x !== null) {
                                                        g.nextpeer = x.insideContours;
                                                        if (x.insideContours !== null) {
                                                            x.insideContours.prevpeer = g;
                                                        }
                                                        x.insideContours = g;
                                                    }
                                                }
                                            }
                                        } else {
                                            i[m] = l;
                                        }
                                    } else if (i[m] === a.DIR.OUTSIDE_EDGE || i[m] === a.DIR.INSIDE_EDGE) {
                                        l = 0;
                                        if (i[m] === a.DIR.INSIDE_EDGE) {
                                            n = o[m];
                                        } else {
                                            n = d[0];
                                        }
                                    } else {
                                        l = i[m];
                                        n = d[l];
                                    }
                                }
                            }
                            x = y;
                            while(x !== null){
                                x.index = e;
                                x = x.nextpeer;
                            }
                            return {
                                cc: y,
                                count: _
                            };
                        },
                        debug: {
                            drawContour: function t(e, r) {
                                var n = e.getContext("2d");
                                var o = r;
                                var i;
                                var u;
                                var c;
                                n.strokeStyle = "red";
                                n.fillStyle = "red";
                                n.lineWidth = 1;
                                if (o !== null) {
                                    i = o.insideContours;
                                } else {
                                    i = null;
                                }
                                while(o !== null){
                                    if (i !== null) {
                                        u = i;
                                        i = i.nextpeer;
                                    } else {
                                        u = o;
                                        o = o.nextpeer;
                                        if (o !== null) {
                                            i = o.insideContours;
                                        } else {
                                            i = null;
                                        }
                                    }
                                    switch(u.dir){
                                        case a.CONTOUR_DIR.CW_DIR:
                                            n.strokeStyle = "red";
                                            break;
                                        case a.CONTOUR_DIR.CCW_DIR:
                                            n.strokeStyle = "blue";
                                            break;
                                        case a.CONTOUR_DIR.UNKNOWN_DIR:
                                            n.strokeStyle = "green";
                                            break;
                                    }
                                    c = u.firstVertex;
                                    n.beginPath();
                                    n.moveTo(c.x, c.y);
                                    do {
                                        c = c.next;
                                        n.lineTo(c.x, c.y);
                                    }while (c !== u.firstVertex)
                                    n.stroke();
                                }
                            }
                        }
                    };
                }
            };
            e["a"] = a;
        },
        function(t, e, r) {
            "use strict";
            function n(t, e, r) {
                "use asm";
                var n = new t.Uint8Array(r);
                var a = e.size | 0;
                var o = t.Math.imul;
                function i(t, e) {
                    t |= 0;
                    e |= 0;
                    var r = 0;
                    var o = 0;
                    var i = 0;
                    var u = 0;
                    var c = 0;
                    var f = 0;
                    var s = 0;
                    var l = 0;
                    for(r = 1; (r | 0) < ((a - 1) | 0); r = (r + 1) | 0){
                        l = (l + a) | 0;
                        for(o = 1; (o | 0) < ((a - 1) | 0); o = (o + 1) | 0){
                            u = (l - a) | 0;
                            c = (l + a) | 0;
                            f = (o - 1) | 0;
                            s = (o + 1) | 0;
                            i = ((n[(t + u + f) | 0] | 0) + (n[(t + u + s) | 0] | 0) + (n[(t + l + o) | 0] | 0) + (n[(t + c + f) | 0] | 0) + (n[(t + c + s) | 0] | 0)) | 0;
                            if ((i | 0) == (5 | 0)) {
                                n[(e + l + o) | 0] = 1;
                            } else {
                                n[(e + l + o) | 0] = 0;
                            }
                        }
                    }
                }
                function u(t, e, r) {
                    t |= 0;
                    e |= 0;
                    r |= 0;
                    var i = 0;
                    i = o(a, a) | 0;
                    while((i | 0) > 0){
                        i = (i - 1) | 0;
                        n[(r + i) | 0] = ((n[(t + i) | 0] | 0) - (n[(e + i) | 0] | 0)) | 0;
                    }
                }
                function c(t, e, r) {
                    t |= 0;
                    e |= 0;
                    r |= 0;
                    var i = 0;
                    i = o(a, a) | 0;
                    while((i | 0) > 0){
                        i = (i - 1) | 0;
                        n[(r + i) | 0] = n[(t + i) | 0] | 0 | (n[(e + i) | 0] | 0) | 0;
                    }
                }
                function f(t) {
                    t |= 0;
                    var e = 0;
                    var r = 0;
                    r = o(a, a) | 0;
                    while((r | 0) > 0){
                        r = (r - 1) | 0;
                        e = ((e | 0) + (n[(t + r) | 0] | 0)) | 0;
                    }
                    return e | 0;
                }
                function s(t, e) {
                    t |= 0;
                    e |= 0;
                    var r = 0;
                    r = o(a, a) | 0;
                    while((r | 0) > 0){
                        r = (r - 1) | 0;
                        n[(t + r) | 0] = e;
                    }
                }
                function l(t, e) {
                    t |= 0;
                    e |= 0;
                    var r = 0;
                    var o = 0;
                    var i = 0;
                    var u = 0;
                    var c = 0;
                    var f = 0;
                    var s = 0;
                    var l = 0;
                    for(r = 1; (r | 0) < ((a - 1) | 0); r = (r + 1) | 0){
                        l = (l + a) | 0;
                        for(o = 1; (o | 0) < ((a - 1) | 0); o = (o + 1) | 0){
                            u = (l - a) | 0;
                            c = (l + a) | 0;
                            f = (o - 1) | 0;
                            s = (o + 1) | 0;
                            i = ((n[(t + u + f) | 0] | 0) + (n[(t + u + s) | 0] | 0) + (n[(t + l + o) | 0] | 0) + (n[(t + c + f) | 0] | 0) + (n[(t + c + s) | 0] | 0)) | 0;
                            if ((i | 0) > (0 | 0)) {
                                n[(e + l + o) | 0] = 1;
                            } else {
                                n[(e + l + o) | 0] = 0;
                            }
                        }
                    }
                }
                function v(t, e) {
                    t |= 0;
                    e |= 0;
                    var r = 0;
                    r = o(a, a) | 0;
                    while((r | 0) > 0){
                        r = (r - 1) | 0;
                        n[(e + r) | 0] = n[(t + r) | 0] | 0;
                    }
                }
                function h(t) {
                    t |= 0;
                    var e = 0;
                    var r = 0;
                    for(e = 0; (e | 0) < ((a - 1) | 0); e = (e + 1) | 0){
                        n[(t + e) | 0] = 0;
                        n[(t + r) | 0] = 0;
                        r = (r + a - 1) | 0;
                        n[(t + r) | 0] = 0;
                        r = (r + 1) | 0;
                    }
                    for(e = 0; (e | 0) < (a | 0); e = (e + 1) | 0){
                        n[(t + r) | 0] = 0;
                        r = (r + 1) | 0;
                    }
                }
                function d() {
                    var t = 0;
                    var e = 0;
                    var r = 0;
                    var n = 0;
                    var d = 0;
                    var p = 0;
                    e = o(a, a) | 0;
                    r = (e + e) | 0;
                    n = (r + e) | 0;
                    s(n, 0);
                    h(t);
                    do {
                        i(t, e);
                        l(e, r);
                        u(t, r, r);
                        c(n, r, n);
                        v(e, t);
                        d = f(t) | 0;
                        p = ((d | 0) == 0) | 0;
                    }while (!p)
                }
                return {
                    skeletonize: d
                };
            }
            e["a"] = n;
        },
        function(t, e, r) {
            t.exports = r(263);
        },
        function(t, e, r) {
            var n = r(91), a = r(48), o = r(121), i = r(123), u = r(14), c = r(56), f = r(54);
            function s(t, e, r, l, v) {
                if (t === e) {
                    return;
                }
                o(e, function(o, c) {
                    v || (v = new n());
                    if (u(o)) {
                        i(t, e, c, r, s, l, v);
                    } else {
                        var h = l ? l(f(t, c), o, c + "", t, e, v) : undefined;
                        if (h === undefined) {
                            h = o;
                        }
                        a(t, c, h);
                    }
                }, c);
            }
            t.exports = s;
        },
        function(t, e, r) {
            var n = r(24), a = r(97), o = r(98), i = r(99), u = r(100), c = r(101);
            function f(t) {
                var e = (this.__data__ = new n(t));
                this.size = e.size;
            }
            f.prototype.clear = a;
            f.prototype["delete"] = o;
            f.prototype.get = i;
            f.prototype.has = u;
            f.prototype.set = c;
            t.exports = f;
        },
        function(t, e) {
            function r() {
                this.__data__ = [];
                this.size = 0;
            }
            t.exports = r;
        },
        function(t, e, r) {
            var n = r(25);
            var a = Array.prototype;
            var o = a.splice;
            function i(t) {
                var e = this.__data__, r = n(e, t);
                if (r < 0) {
                    return false;
                }
                var a = e.length - 1;
                if (r == a) {
                    e.pop();
                } else {
                    o.call(e, r, 1);
                }
                --this.size;
                return true;
            }
            t.exports = i;
        },
        function(t, e, r) {
            var n = r(25);
            function a(t) {
                var e = this.__data__, r = n(e, t);
                return r < 0 ? undefined : e[r][1];
            }
            t.exports = a;
        },
        function(t, e, r) {
            var n = r(25);
            function a(t) {
                return n(this.__data__, t) > -1;
            }
            t.exports = a;
        },
        function(t, e, r) {
            var n = r(25);
            function a(t, e) {
                var r = this.__data__, a = n(r, t);
                if (a < 0) {
                    ++this.size;
                    r.push([
                        t,
                        e
                    ]);
                } else {
                    r[a][1] = e;
                }
                return this;
            }
            t.exports = a;
        },
        function(t, e, r) {
            var n = r(24);
            function a() {
                this.__data__ = new n();
                this.size = 0;
            }
            t.exports = a;
        },
        function(t, e) {
            function r(t) {
                var e = this.__data__, r = e["delete"](t);
                this.size = e.size;
                return r;
            }
            t.exports = r;
        },
        function(t, e) {
            function r(t) {
                return this.__data__.get(t);
            }
            t.exports = r;
        },
        function(t, e) {
            function r(t) {
                return this.__data__.has(t);
            }
            t.exports = r;
        },
        function(t, e, r) {
            var n = r(24), a = r(44), o = r(47);
            var i = 200;
            function u(t, e) {
                var r = this.__data__;
                if (r instanceof n) {
                    var u = r.__data__;
                    if (!a || u.length < i - 1) {
                        u.push([
                            t,
                            e
                        ]);
                        this.size = ++r.size;
                        return this;
                    }
                    r = this.__data__ = new o(u);
                }
                r.set(t, e);
                this.size = r.size;
                return this;
            }
            t.exports = u;
        },
        function(t, e, r) {
            var n = r(36), a = r(105), o = r(14), i = r(107);
            var u = /[\\^$.*+?()[\]{}|]/g;
            var c = /^\[object .+?Constructor\]$/;
            var f = Function.prototype, s = Object.prototype;
            var l = f.toString;
            var v = s.hasOwnProperty;
            var h = RegExp("^" + l.call(v).replace(u, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
            function d(t) {
                if (!o(t) || a(t)) {
                    return false;
                }
                var e = n(t) ? h : c;
                return e.test(i(t));
            }
            t.exports = d;
        },
        function(t, e, r) {
            var n = r(27);
            var a = Object.prototype;
            var o = a.hasOwnProperty;
            var i = a.toString;
            var u = n ? n.toStringTag : undefined;
            function c(t) {
                var e = o.call(t, u), r = t[u];
                try {
                    t[u] = undefined;
                    var n = true;
                } catch (a) {}
                var c = i.call(t);
                if (n) {
                    if (e) {
                        t[u] = r;
                    } else {
                        delete t[u];
                    }
                }
                return c;
            }
            t.exports = c;
        },
        function(t, e) {
            var r = Object.prototype;
            var n = r.toString;
            function a(t) {
                return n.call(t);
            }
            t.exports = a;
        },
        function(t, e, r) {
            var n = r(106);
            var a = (function() {
                var t = /[^.]+$/.exec((n && n.keys && n.keys.IE_PROTO) || "");
                return t ? "Symbol(src)_1." + t : "";
            })();
            function o(t) {
                return !!a && a in t;
            }
            t.exports = o;
        },
        function(t, e, r) {
            var n = r(17);
            var a = n["__core-js_shared__"];
            t.exports = a;
        },
        function(t, e) {
            var r = Function.prototype;
            var n = r.toString;
            function a(t) {
                if (t != null) {
                    try {
                        return n.call(t);
                    } catch (e) {}
                    try {
                        return t + "";
                    } catch (r) {}
                }
                return "";
            }
            t.exports = a;
        },
        function(t, e) {
            function r(t, e) {
                return t == null ? undefined : t[e];
            }
            t.exports = r;
        },
        function(t, e, r) {
            var n = r(110), a = r(24), o = r(44);
            function i() {
                this.size = 0;
                this.__data__ = {
                    hash: new n(),
                    map: new (o || a)(),
                    string: new n()
                };
            }
            t.exports = i;
        },
        function(t, e, r) {
            var n = r(111), a = r(112), o = r(113), i = r(114), u = r(115);
            function c(t) {
                var e = -1, r = t == null ? 0 : t.length;
                this.clear();
                while(++e < r){
                    var n = t[e];
                    this.set(n[0], n[1]);
                }
            }
            c.prototype.clear = n;
            c.prototype["delete"] = a;
            c.prototype.get = o;
            c.prototype.has = i;
            c.prototype.set = u;
            t.exports = c;
        },
        function(t, e, r) {
            var n = r(28);
            function a() {
                this.__data__ = n ? n(null) : {};
                this.size = 0;
            }
            t.exports = a;
        },
        function(t, e) {
            function r(t) {
                var e = this.has(t) && delete this.__data__[t];
                this.size -= e ? 1 : 0;
                return e;
            }
            t.exports = r;
        },
        function(t, e, r) {
            var n = r(28);
            var a = "__lodash_hash_undefined__";
            var o = Object.prototype;
            var i = o.hasOwnProperty;
            function u(t) {
                var e = this.__data__;
                if (n) {
                    var r = e[t];
                    return r === a ? undefined : r;
                }
                return i.call(e, t) ? e[t] : undefined;
            }
            t.exports = u;
        },
        function(t, e, r) {
            var n = r(28);
            var a = Object.prototype;
            var o = a.hasOwnProperty;
            function i(t) {
                var e = this.__data__;
                return n ? e[t] !== undefined : o.call(e, t);
            }
            t.exports = i;
        },
        function(t, e, r) {
            var n = r(28);
            var a = "__lodash_hash_undefined__";
            function o(t, e) {
                var r = this.__data__;
                this.size += this.has(t) ? 0 : 1;
                r[t] = n && e === undefined ? a : e;
                return this;
            }
            t.exports = o;
        },
        function(t, e, r) {
            var n = r(29);
            function a(t) {
                var e = n(this, t)["delete"](t);
                this.size -= e ? 1 : 0;
                return e;
            }
            t.exports = a;
        },
        function(t, e) {
            function r(t) {
                var e = typeof t;
                return e == "string" || e == "number" || e == "symbol" || e == "boolean" ? t !== "__proto__" : t === null;
            }
            t.exports = r;
        },
        function(t, e, r) {
            var n = r(29);
            function a(t) {
                return n(this, t).get(t);
            }
            t.exports = a;
        },
        function(t, e, r) {
            var n = r(29);
            function a(t) {
                return n(this, t).has(t);
            }
            t.exports = a;
        },
        function(t, e, r) {
            var n = r(29);
            function a(t, e) {
                var r = n(this, t), a = r.size;
                r.set(t, e);
                this.size += r.size == a ? 0 : 1;
                return this;
            }
            t.exports = a;
        },
        function(t, e, r) {
            var n = r(122);
            var a = n();
            t.exports = a;
        },
        function(t, e) {
            function r(t) {
                return function(e, r, n) {
                    var a = -1, o = Object(e), i = n(e), u = i.length;
                    while(u--){
                        var c = i[t ? u : ++a];
                        if (r(o[c], c, o) === false) {
                            break;
                        }
                    }
                    return e;
                };
            }
            t.exports = r;
        },
        function(t, e, r) {
            var n = r(48), a = r(124), o = r(125), i = r(128), u = r(129), c = r(30), f = r(15), s = r(133), l = r(52), v = r(36), h = r(14), d = r(135), p = r(53), g = r(54), y = r(139);
            function x(t, e, r, x, m, _, b) {
                var w = g(t, r), O = g(e, r), R = b.get(O);
                if (R) {
                    n(t, r, R);
                    return;
                }
                var C = _ ? _(w, O, r + "", t, e, b) : undefined;
                var E = C === undefined;
                if (E) {
                    var M = f(O), S = !M && l(O), A = !M && !S && p(O);
                    C = O;
                    if (M || S || A) {
                        if (f(w)) {
                            C = w;
                        } else if (s(w)) {
                            C = i(w);
                        } else if (S) {
                            E = false;
                            C = a(O, true);
                        } else if (A) {
                            E = false;
                            C = o(O, true);
                        } else {
                            C = [];
                        }
                    } else if (d(O) || c(O)) {
                        C = w;
                        if (c(w)) {
                            C = y(w);
                        } else if (!h(w) || v(w)) {
                            C = u(O);
                        }
                    } else {
                        E = false;
                    }
                }
                if (E) {
                    b.set(O, C);
                    m(C, O, x, _, b);
                    b["delete"](O);
                }
                n(t, r, C);
            }
            t.exports = x;
        },
        function(t, e, r) {
            (function(t) {
                var n = r(17);
                var a = true && e && !e.nodeType && e;
                var o = a && typeof t == "object" && t && !t.nodeType && t;
                var i = o && o.exports === a;
                var u = i ? n.Buffer : undefined, c = u ? u.allocUnsafe : undefined;
                function f(t, e) {
                    if (e) {
                        return t.slice();
                    }
                    var r = t.length, n = c ? c(r) : new t.constructor(r);
                    t.copy(n);
                    return n;
                }
                t.exports = f;
            }.call(this, r(38)(t)));
        },
        function(t, e, r) {
            var n = r(126);
            function a(t, e) {
                var r = e ? n(t.buffer) : t.buffer;
                return new t.constructor(r, t.byteOffset, t.length);
            }
            t.exports = a;
        },
        function(t, e, r) {
            var n = r(127);
            function a(t) {
                var e = new t.constructor(t.byteLength);
                new n(e).set(new n(t));
                return e;
            }
            t.exports = a;
        },
        function(t, e, r) {
            var n = r(17);
            var a = n.Uint8Array;
            t.exports = a;
        },
        function(t, e) {
            function r(t, e) {
                var r = -1, n = t.length;
                e || (e = Array(n));
                while(++r < n){
                    e[r] = t[r];
                }
                return e;
            }
            t.exports = r;
        },
        function(t, e, r) {
            var n = r(130), a = r(50), o = r(51);
            function i(t) {
                return typeof t.constructor == "function" && !o(t) ? n(a(t)) : {};
            }
            t.exports = i;
        },
        function(t, e, r) {
            var n = r(14);
            var a = Object.create;
            var o = (function() {
                function t() {}
                return function(e) {
                    if (!n(e)) {
                        return {};
                    }
                    if (a) {
                        return a(e);
                    }
                    t.prototype = e;
                    var r = new t();
                    t.prototype = undefined;
                    return r;
                };
            })();
            t.exports = o;
        },
        function(t, e) {
            function r(t, e) {
                return function(r) {
                    return t(e(r));
                };
            }
            t.exports = r;
        },
        function(t, e, r) {
            var n = r(22), a = r(18);
            var o = "[object Arguments]";
            function i(t) {
                return a(t) && n(t) == o;
            }
            t.exports = i;
        },
        function(t, e, r) {
            var n = r(39), a = r(18);
            function o(t) {
                return a(t) && n(t);
            }
            t.exports = o;
        },
        function(t, e) {
            function r() {
                return false;
            }
            t.exports = r;
        },
        function(t, e, r) {
            var n = r(22), a = r(50), o = r(18);
            var i = "[object Object]";
            var u = Function.prototype, c = Object.prototype;
            var f = u.toString;
            var s = c.hasOwnProperty;
            var l = f.call(Object);
            function v(t) {
                if (!o(t) || n(t) != i) {
                    return false;
                }
                var e = a(t);
                if (e === null) {
                    return true;
                }
                var r = s.call(e, "constructor") && e.constructor;
                return (typeof r == "function" && r instanceof r && f.call(r) == l);
            }
            t.exports = v;
        },
        function(t, e, r) {
            var n = r(22), a = r(40), o = r(18);
            var i = "[object Arguments]", u = "[object Array]", c = "[object Boolean]", f = "[object Date]", s = "[object Error]", l = "[object Function]", v = "[object Map]", h = "[object Number]", d = "[object Object]", p = "[object RegExp]", g = "[object Set]", y = "[object String]", x = "[object WeakMap]";
            var m = "[object ArrayBuffer]", _ = "[object DataView]", b = "[object Float32Array]", w = "[object Float64Array]", O = "[object Int8Array]", R = "[object Int16Array]", C = "[object Int32Array]", E = "[object Uint8Array]", M = "[object Uint8ClampedArray]", S = "[object Uint16Array]", A = "[object Uint32Array]";
            var k = {};
            k[b] = k[w] = k[O] = k[R] = k[C] = k[E] = k[M] = k[S] = k[A] = true;
            k[i] = k[u] = k[m] = k[c] = k[_] = k[f] = k[s] = k[l] = k[v] = k[h] = k[d] = k[p] = k[g] = k[y] = k[x] = false;
            function P(t) {
                return (o(t) && a(t.length) && !!k[n(t)]);
            }
            t.exports = P;
        },
        function(t, e) {
            function r(t) {
                return function(e) {
                    return t(e);
                };
            }
            t.exports = r;
        },
        function(t, e, r) {
            (function(t) {
                var n = r(45);
                var a = true && e && !e.nodeType && e;
                var o = a && typeof t == "object" && t && !t.nodeType && t;
                var i = o && o.exports === a;
                var u = i && n.process;
                var c = (function() {
                    try {
                        var t = o && o.require && o.require("util").types;
                        if (t) {
                            return t;
                        }
                        return (u && u.binding && u.binding("util"));
                    } catch (e) {}
                })();
                t.exports = c;
            }.call(this, r(38)(t)));
        },
        function(t, e, r) {
            var n = r(140), a = r(56);
            function o(t) {
                return n(t, a(t));
            }
            t.exports = o;
        },
        function(t, e, r) {
            var n = r(55), a = r(37);
            function o(t, e, r, o) {
                var i = !r;
                r || (r = {});
                var u = -1, c = e.length;
                while(++u < c){
                    var f = e[u];
                    var s = o ? o(r[f], t[f], f, r, t) : undefined;
                    if (s === undefined) {
                        s = t[f];
                    }
                    if (i) {
                        a(r, f, s);
                    } else {
                        n(r, f, s);
                    }
                }
                return r;
            }
            t.exports = o;
        },
        function(t, e, r) {
            var n = r(142), a = r(30), o = r(15), i = r(52), u = r(31), c = r(53);
            var f = Object.prototype;
            var s = f.hasOwnProperty;
            function l(t, e) {
                var r = o(t), f = !r && a(t), l = !r && !f && i(t), v = !r && !f && !l && c(t), h = r || f || l || v, d = h ? n(t.length, String) : [], p = d.length;
                for(var g in t){
                    if ((e || s.call(t, g)) && !(h && (g == "length" || (l && (g == "offset" || g == "parent")) || (v && (g == "buffer" || g == "byteLength" || g == "byteOffset")) || u(g, p)))) {
                        d.push(g);
                    }
                }
                return d;
            }
            t.exports = l;
        },
        function(t, e) {
            function r(t, e) {
                var r = -1, n = Array(t);
                while(++r < t){
                    n[r] = e(r);
                }
                return n;
            }
            t.exports = r;
        },
        function(t, e, r) {
            var n = r(14), a = r(51), o = r(144);
            var i = Object.prototype;
            var u = i.hasOwnProperty;
            function c(t) {
                if (!n(t)) {
                    return o(t);
                }
                var e = a(t), r = [];
                for(var i in t){
                    if (!(i == "constructor" && (e || !u.call(t, i)))) {
                        r.push(i);
                    }
                }
                return r;
            }
            t.exports = c;
        },
        function(t, e) {
            function r(t) {
                var e = [];
                if (t != null) {
                    for(var r in Object(t)){
                        e.push(r);
                    }
                }
                return e;
            }
            t.exports = r;
        },
        function(t, e, r) {
            var n = r(146), a = r(151);
            function o(t) {
                return n(function(e, r) {
                    var n = -1, o = r.length, i = o > 1 ? r[o - 1] : undefined, u = o > 2 ? r[2] : undefined;
                    i = t.length > 3 && typeof i == "function" ? (o--, i) : undefined;
                    if (u && a(r[0], r[1], u)) {
                        i = o < 3 ? undefined : i;
                        o = 1;
                    }
                    e = Object(e);
                    while(++n < o){
                        var c = r[n];
                        if (c) {
                            t(e, c, n, i);
                        }
                    }
                    return e;
                });
            }
            t.exports = o;
        },
        function(t, e, r) {
            var n = r(57), a = r(58), o = r(59);
            function i(t, e) {
                return o(a(t, e, n), t + "");
            }
            t.exports = i;
        },
        function(t, e) {
            function r(t, e, r) {
                switch(r.length){
                    case 0:
                        return t.call(e);
                    case 1:
                        return t.call(e, r[0]);
                    case 2:
                        return t.call(e, r[0], r[1]);
                    case 3:
                        return t.call(e, r[0], r[1], r[2]);
                }
                return t.apply(e, r);
            }
            t.exports = r;
        },
        function(t, e, r) {
            var n = r(149), a = r(49), o = r(57);
            var i = !a ? o : function(t, e) {
                return a(t, "toString", {
                    configurable: true,
                    enumerable: false,
                    value: n(e),
                    writable: true
                });
            };
            t.exports = i;
        },
        function(t, e) {
            function r(t) {
                return function() {
                    return t;
                };
            }
            t.exports = r;
        },
        function(t, e) {
            var r = 800, n = 16;
            var a = Date.now;
            function o(t) {
                var e = 0, o = 0;
                return function() {
                    var i = a(), u = n - (i - o);
                    o = i;
                    if (u > 0) {
                        if (++e >= r) {
                            return arguments[0];
                        }
                    } else {
                        e = 0;
                    }
                    return t.apply(undefined, arguments);
                };
            }
            t.exports = o;
        },
        function(t, e, r) {
            var n = r(26), a = r(39), o = r(31), i = r(14);
            function u(t, e, r) {
                if (!i(r)) {
                    return false;
                }
                var u = typeof e;
                if (u == "number" ? a(r) && o(e, r.length) : u == "string" && e in r) {
                    return n(r[e], t);
                }
                return false;
            }
            t.exports = u;
        },
        function(t, e) {
            if (typeof window !== "undefined") {
                if (!window.requestAnimationFrame) {
                    window.requestAnimationFrame = (function() {
                        return (window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(t) {
                            window.setTimeout(t, 1000 / 60);
                        });
                    })();
                }
            }
            if (typeof Math.imul !== "function") {
                Math.imul = function(t, e) {
                    var r = (t >>> 16) & 0xffff;
                    var n = t & 0xffff;
                    var a = (e >>> 16) & 0xffff;
                    var o = e & 0xffff;
                    return ((n * o + (((r * o + n * a) << 16) >>> 0)) | 0);
                };
            }
            if (typeof Object.assign !== "function") {
                Object.assign = function(t) {
                    "use strict";
                    if (t === null) {
                        throw new TypeError("Cannot convert undefined or null to object");
                    }
                    var e = Object(t);
                    for(var r = 1; r < arguments.length; r++){
                        var n = arguments[r];
                        if (n !== null) {
                            for(var a in n){
                                if (Object.prototype.hasOwnProperty.call(n, a)) {
                                    e[a] = n[a];
                                }
                            }
                        }
                    }
                    return e;
                };
            }
        },
        function(t, e) {
            function r(t) {
                if (Array.isArray(t)) return t;
            }
            t.exports = r;
            (t.exports["default"] = t.exports), (t.exports.__esModule = true);
        },
        function(t, e) {
            function r(t, e) {
                var r = t == null ? null : (typeof Symbol !== "undefined" && t[Symbol.iterator]) || t["@@iterator"];
                if (r == null) return;
                var n = [];
                var a = true;
                var o = false;
                var i, u;
                try {
                    for(r = r.call(t); !(a = (i = r.next()).done); a = true){
                        n.push(i.value);
                        if (e && n.length === e) break;
                    }
                } catch (c) {
                    o = true;
                    u = c;
                } finally{
                    try {
                        if (!a && r["return"] != null) r["return"]();
                    } finally{
                        if (o) throw u;
                    }
                }
                return n;
            }
            t.exports = r;
            (t.exports["default"] = t.exports), (t.exports.__esModule = true);
        },
        function(t, e) {
            function r() {
                throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
            }
            t.exports = r;
            (t.exports["default"] = t.exports), (t.exports.__esModule = true);
        },
        function(t, e) {
            t.exports = r;
            function r(t) {
                var e = new Float32Array(2);
                e[0] = t[0];
                e[1] = t[1];
                return e;
            }
        },
        function(t, e) {
            t.exports = r;
            function r(t, e) {
                var r = new Float32Array(2);
                r[0] = t;
                r[1] = e;
                return r;
            }
        },
        function(t, e) {
            t.exports = r;
            function r(t, e) {
                t[0] = e[0];
                t[1] = e[1];
                return t;
            }
        },
        function(t, e) {
            t.exports = r;
            function r(t, e, r) {
                t[0] = e;
                t[1] = r;
                return t;
            }
        },
        function(t, e, r) {
            t.exports = a;
            var n = r(62);
            function a(t, e) {
                var r = t[0];
                var a = t[1];
                var o = e[0];
                var i = e[1];
                return (Math.abs(r - o) <= n * Math.max(1.0, Math.abs(r), Math.abs(o)) && Math.abs(a - i) <= n * Math.max(1.0, Math.abs(a), Math.abs(i)));
            }
        },
        function(t, e) {
            t.exports = r;
            function r(t, e) {
                return t[0] === e[0] && t[1] === e[1];
            }
        },
        function(t, e) {
            t.exports = r;
            function r(t, e, r) {
                t[0] = e[0] + r[0];
                t[1] = e[1] + r[1];
                return t;
            }
        },
        function(t, e, r) {
            t.exports = r(64);
        },
        function(t, e, r) {
            t.exports = r(65);
        },
        function(t, e, r) {
            t.exports = r(66);
        },
        function(t, e) {
            t.exports = r;
            function r(t, e) {
                t[0] = 1.0 / e[0];
                t[1] = 1.0 / e[1];
                return t;
            }
        },
        function(t, e) {
            t.exports = r;
            function r(t, e, r) {
                t[0] = Math.min(e[0], r[0]);
                t[1] = Math.min(e[1], r[1]);
                return t;
            }
        },
        function(t, e) {
            t.exports = r;
            function r(t, e, r) {
                t[0] = Math.max(e[0], r[0]);
                t[1] = Math.max(e[1], r[1]);
                return t;
            }
        },
        function(t, e) {
            t.exports = r;
            function r(t, e, r) {
                var n = Math.cos(r), a = Math.sin(r);
                var o = e[0], i = e[1];
                t[0] = o * n - i * a;
                t[1] = o * a + i * n;
                return t;
            }
        },
        function(t, e) {
            t.exports = r;
            function r(t, e) {
                t[0] = Math.floor(e[0]);
                t[1] = Math.floor(e[1]);
                return t;
            }
        },
        function(t, e) {
            t.exports = r;
            function r(t, e) {
                t[0] = Math.ceil(e[0]);
                t[1] = Math.ceil(e[1]);
                return t;
            }
        },
        function(t, e) {
            t.exports = r;
            function r(t, e) {
                t[0] = Math.round(e[0]);
                t[1] = Math.round(e[1]);
                return t;
            }
        },
        function(t, e) {
            t.exports = r;
            function r(t, e, r) {
                t[0] = e[0] * r;
                t[1] = e[1] * r;
                return t;
            }
        },
        function(t, e) {
            t.exports = r;
            function r(t, e, r, n) {
                t[0] = e[0] + r[0] * n;
                t[1] = e[1] + r[1] * n;
                return t;
            }
        },
        function(t, e, r) {
            t.exports = r(67);
        },
        function(t, e, r) {
            t.exports = r(68);
        },
        function(t, e, r) {
            t.exports = r(69);
        },
        function(t, e, r) {
            t.exports = r(70);
        },
        function(t, e) {
            t.exports = r;
            function r(t, e) {
                t[0] = -e[0];
                t[1] = -e[1];
                return t;
            }
        },
        function(t, e) {
            t.exports = r;
            function r(t, e) {
                var r = e[0], n = e[1];
                var a = r * r + n * n;
                if (a > 0) {
                    a = 1 / Math.sqrt(a);
                    t[0] = e[0] * a;
                    t[1] = e[1] * a;
                }
                return t;
            }
        },
        function(t, e) {
            t.exports = r;
            function r(t, e) {
                return t[0] * e[0] + t[1] * e[1];
            }
        },
        function(t, e) {
            t.exports = r;
            function r(t, e, r) {
                var n = e[0] * r[1] - e[1] * r[0];
                t[0] = t[1] = 0;
                t[2] = n;
                return t;
            }
        },
        function(t, e) {
            t.exports = r;
            function r(t, e, r, n) {
                var a = e[0], o = e[1];
                t[0] = a + n * (r[0] - a);
                t[1] = o + n * (r[1] - o);
                return t;
            }
        },
        function(t, e) {
            t.exports = r;
            function r(t, e) {
                e = e || 1.0;
                var r = Math.random() * 2.0 * Math.PI;
                t[0] = Math.cos(r) * e;
                t[1] = Math.sin(r) * e;
                return t;
            }
        },
        function(t, e) {
            t.exports = r;
            function r(t, e, r) {
                var n = e[0], a = e[1];
                t[0] = r[0] * n + r[2] * a;
                t[1] = r[1] * n + r[3] * a;
                return t;
            }
        },
        function(t, e) {
            t.exports = r;
            function r(t, e, r) {
                var n = e[0], a = e[1];
                t[0] = r[0] * n + r[2] * a + r[4];
                t[1] = r[1] * n + r[3] * a + r[5];
                return t;
            }
        },
        function(t, e) {
            t.exports = r;
            function r(t, e, r) {
                var n = e[0], a = e[1];
                t[0] = r[0] * n + r[3] * a + r[6];
                t[1] = r[1] * n + r[4] * a + r[7];
                return t;
            }
        },
        function(t, e) {
            t.exports = r;
            function r(t, e, r) {
                var n = e[0], a = e[1];
                t[0] = r[0] * n + r[4] * a + r[12];
                t[1] = r[1] * n + r[5] * a + r[13];
                return t;
            }
        },
        function(t, e, r) {
            t.exports = a;
            var n = r(63)();
            function a(t, e, r, a, o, i) {
                var u, c;
                if (!e) {
                    e = 2;
                }
                if (!r) {
                    r = 0;
                }
                if (a) {
                    c = Math.min(a * e + r, t.length);
                } else {
                    c = t.length;
                }
                for(u = r; u < c; u += e){
                    n[0] = t[u];
                    n[1] = t[u + 1];
                    o(n, n, i);
                    t[u] = n[0];
                    t[u + 1] = n[1];
                }
                return t;
            }
        },
        function(t, e) {
            t.exports = r;
            function r(t, e, r) {
                var n = e[0] * e[0] + e[1] * e[1];
                if (n > r * r) {
                    var a = Math.sqrt(n);
                    t[0] = (e[0] / a) * r;
                    t[1] = (e[1] / a) * r;
                } else {
                    t[0] = e[0];
                    t[1] = e[1];
                }
                return t;
            }
        },
        function(t, e) {
            t.exports = r;
            function r(t) {
                var e = new Float32Array(3);
                e[0] = t[0];
                e[1] = t[1];
                e[2] = t[2];
                return e;
            }
        },
        function(t, e, r) {
            t.exports = i;
            var n = r(73);
            var a = r(74);
            var o = r(75);
            function i(t, e) {
                var r = n(t[0], t[1], t[2]);
                var i = n(e[0], e[1], e[2]);
                a(r, r);
                a(i, i);
                var u = o(r, i);
                if (u > 1.0) {
                    return 0;
                } else {
                    return Math.acos(u);
                }
            }
        },
        function(t, e) {
            t.exports = r;
            function r(t, e) {
                t[0] = e[0];
                t[1] = e[1];
                t[2] = e[2];
                return t;
            }
        },
        function(t, e) {
            t.exports = r;
            function r(t, e, r, n) {
                t[0] = e;
                t[1] = r;
                t[2] = n;
                return t;
            }
        },
        function(t, e, r) {
            t.exports = a;
            var n = r(71);
            function a(t, e) {
                var r = t[0];
                var a = t[1];
                var o = t[2];
                var i = e[0];
                var u = e[1];
                var c = e[2];
                return (Math.abs(r - i) <= n * Math.max(1.0, Math.abs(r), Math.abs(i)) && Math.abs(a - u) <= n * Math.max(1.0, Math.abs(a), Math.abs(u)) && Math.abs(o - c) <= n * Math.max(1.0, Math.abs(o), Math.abs(c)));
            }
        },
        function(t, e) {
            t.exports = r;
            function r(t, e) {
                return t[0] === e[0] && t[1] === e[1] && t[2] === e[2];
            }
        },
        function(t, e) {
            t.exports = r;
            function r(t, e, r) {
                t[0] = e[0] + r[0];
                t[1] = e[1] + r[1];
                t[2] = e[2] + r[2];
                return t;
            }
        },
        function(t, e, r) {
            t.exports = r(76);
        },
        function(t, e, r) {
            t.exports = r(77);
        },
        function(t, e, r) {
            t.exports = r(78);
        },
        function(t, e) {
            t.exports = r;
            function r(t, e, r) {
                t[0] = Math.min(e[0], r[0]);
                t[1] = Math.min(e[1], r[1]);
                t[2] = Math.min(e[2], r[2]);
                return t;
            }
        },
        function(t, e) {
            t.exports = r;
            function r(t, e, r) {
                t[0] = Math.max(e[0], r[0]);
                t[1] = Math.max(e[1], r[1]);
                t[2] = Math.max(e[2], r[2]);
                return t;
            }
        },
        function(t, e) {
            t.exports = r;
            function r(t, e) {
                t[0] = Math.floor(e[0]);
                t[1] = Math.floor(e[1]);
                t[2] = Math.floor(e[2]);
                return t;
            }
        },
        function(t, e) {
            t.exports = r;
            function r(t, e) {
                t[0] = Math.ceil(e[0]);
                t[1] = Math.ceil(e[1]);
                t[2] = Math.ceil(e[2]);
                return t;
            }
        },
        function(t, e) {
            t.exports = r;
            function r(t, e) {
                t[0] = Math.round(e[0]);
                t[1] = Math.round(e[1]);
                t[2] = Math.round(e[2]);
                return t;
            }
        },
        function(t, e) {
            t.exports = r;
            function r(t, e, r) {
                t[0] = e[0] * r;
                t[1] = e[1] * r;
                t[2] = e[2] * r;
                return t;
            }
        },
        function(t, e) {
            t.exports = r;
            function r(t, e, r, n) {
                t[0] = e[0] + r[0] * n;
                t[1] = e[1] + r[1] * n;
                t[2] = e[2] + r[2] * n;
                return t;
            }
        },
        function(t, e, r) {
            t.exports = r(79);
        },
        function(t, e, r) {
            t.exports = r(80);
        },
        function(t, e, r) {
            t.exports = r(81);
        },
        function(t, e, r) {
            t.exports = r(82);
        },
        function(t, e) {
            t.exports = r;
            function r(t, e) {
                t[0] = -e[0];
                t[1] = -e[1];
                t[2] = -e[2];
                return t;
            }
        },
        function(t, e) {
            t.exports = r;
            function r(t, e) {
                t[0] = 1.0 / e[0];
                t[1] = 1.0 / e[1];
                t[2] = 1.0 / e[2];
                return t;
            }
        },
        function(t, e) {
            t.exports = r;
            function r(t, e, r) {
                var n = e[0], a = e[1], o = e[2], i = r[0], u = r[1], c = r[2];
                t[0] = a * c - o * u;
                t[1] = o * i - n * c;
                t[2] = n * u - a * i;
                return t;
            }
        },
        function(t, e) {
            t.exports = r;
            function r(t, e, r, n) {
                var a = e[0], o = e[1], i = e[2];
                t[0] = a + n * (r[0] - a);
                t[1] = o + n * (r[1] - o);
                t[2] = i + n * (r[2] - i);
                return t;
            }
        },
        function(t, e) {
            t.exports = r;
            function r(t, e) {
                e = e || 1.0;
                var r = Math.random() * 2.0 * Math.PI;
                var n = Math.random() * 2.0 - 1.0;
                var a = Math.sqrt(1.0 - n * n) * e;
                t[0] = Math.cos(r) * a;
                t[1] = Math.sin(r) * a;
                t[2] = n * e;
                return t;
            }
        },
        function(t, e) {
            t.exports = r;
            function r(t, e, r) {
                var n = e[0], a = e[1], o = e[2], i = r[3] * n + r[7] * a + r[11] * o + r[15];
                i = i || 1.0;
                t[0] = (r[0] * n + r[4] * a + r[8] * o + r[12]) / i;
                t[1] = (r[1] * n + r[5] * a + r[9] * o + r[13]) / i;
                t[2] = (r[2] * n + r[6] * a + r[10] * o + r[14]) / i;
                return t;
            }
        },
        function(t, e) {
            t.exports = r;
            function r(t, e, r) {
                var n = e[0], a = e[1], o = e[2];
                t[0] = n * r[0] + a * r[3] + o * r[6];
                t[1] = n * r[1] + a * r[4] + o * r[7];
                t[2] = n * r[2] + a * r[5] + o * r[8];
                return t;
            }
        },
        function(t, e) {
            t.exports = r;
            function r(t, e, r) {
                var n = e[0], a = e[1], o = e[2], i = r[0], u = r[1], c = r[2], f = r[3], s = f * n + u * o - c * a, l = f * a + c * n - i * o, v = f * o + i * a - u * n, h = -i * n - u * a - c * o;
                t[0] = s * f + h * -i + l * -c - v * -u;
                t[1] = l * f + h * -u + v * -i - s * -c;
                t[2] = v * f + h * -c + s * -u - l * -i;
                return t;
            }
        },
        function(t, e) {
            t.exports = r;
            function r(t, e, r, n) {
                var a = r[1];
                var o = r[2];
                var i = e[1] - a;
                var u = e[2] - o;
                var c = Math.sin(n);
                var f = Math.cos(n);
                t[0] = e[0];
                t[1] = a + i * f - u * c;
                t[2] = o + i * c + u * f;
                return t;
            }
        },
        function(t, e) {
            t.exports = r;
            function r(t, e, r, n) {
                var a = r[0];
                var o = r[2];
                var i = e[0] - a;
                var u = e[2] - o;
                var c = Math.sin(n);
                var f = Math.cos(n);
                t[0] = a + u * c + i * f;
                t[1] = e[1];
                t[2] = o + u * f - i * c;
                return t;
            }
        },
        function(t, e) {
            t.exports = r;
            function r(t, e, r, n) {
                var a = r[0];
                var o = r[1];
                var i = e[0] - a;
                var u = e[1] - o;
                var c = Math.sin(n);
                var f = Math.cos(n);
                t[0] = a + i * f - u * c;
                t[1] = o + i * c + u * f;
                t[2] = e[2];
                return t;
            }
        },
        function(t, e, r) {
            t.exports = a;
            var n = r(72)();
            function a(t, e, r, a, o, i) {
                var u, c;
                if (!e) {
                    e = 3;
                }
                if (!r) {
                    r = 0;
                }
                if (a) {
                    c = Math.min(a * e + r, t.length);
                } else {
                    c = t.length;
                }
                for(u = r; u < c; u += e){
                    n[0] = t[u];
                    n[1] = t[u + 1];
                    n[2] = t[u + 2];
                    o(n, n, i);
                    t[u] = n[0];
                    t[u + 1] = n[1];
                    t[u + 2] = n[2];
                }
                return t;
            }
        },
        function(t, e, r) {
            var n = r(61);
            function a(t) {
                if (Array.isArray(t)) return n(t);
            }
            t.exports = a;
            (t.exports["default"] = t.exports), (t.exports.__esModule = true);
        },
        function(t, e) {
            function r(t) {
                if ((typeof Symbol !== "undefined" && t[Symbol.iterator] != null) || t["@@iterator"] != null) return Array.from(t);
            }
            t.exports = r;
            (t.exports["default"] = t.exports), (t.exports.__esModule = true);
        },
        function(t, e) {
            function r() {
                throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
            }
            t.exports = r;
            (t.exports["default"] = t.exports), (t.exports.__esModule = true);
        },
        function(t, e, r) {
            var n = r(2);
            function a(t, e) {
                while(!Object.prototype.hasOwnProperty.call(t, e)){
                    t = n(t);
                    if (t === null) break;
                }
                return t;
            }
            t.exports = a;
            (t.exports["default"] = t.exports), (t.exports.__esModule = true);
        },
        function(t, e, r) {
            var n = (function(t) {
                "use strict";
                var e = Object.prototype;
                var r = e.hasOwnProperty;
                var n;
                var a = typeof Symbol === "function" ? Symbol : {};
                var o = a.iterator || "@@iterator";
                var i = a.asyncIterator || "@@asyncIterator";
                var u = a.toStringTag || "@@toStringTag";
                function c(t, e, r, n) {
                    var a = e && e.prototype instanceof p ? e : p;
                    var o = Object.create(a.prototype);
                    var i = new S(n || []);
                    o._invoke = R(t, r, i);
                    return o;
                }
                t.wrap = c;
                function f(t, e, r) {
                    try {
                        return {
                            type: "normal",
                            arg: t.call(e, r)
                        };
                    } catch (n) {
                        return {
                            type: "throw",
                            arg: n
                        };
                    }
                }
                var s = "suspendedStart";
                var l = "suspendedYield";
                var v = "executing";
                var h = "completed";
                var d = {};
                function p() {}
                function g() {}
                function y() {}
                var x = {};
                x[o] = function() {
                    return this;
                };
                var m = Object.getPrototypeOf;
                var _ = m && m(m(A([])));
                if (_ && _ !== e && r.call(_, o)) {
                    x = _;
                }
                var b = (y.prototype = p.prototype = Object.create(x));
                g.prototype = b.constructor = y;
                y.constructor = g;
                y[u] = g.displayName = "GeneratorFunction";
                function w(t) {
                    [
                        "next",
                        "throw",
                        "return"
                    ].forEach(function(e) {
                        t[e] = function(t) {
                            return this._invoke(e, t);
                        };
                    });
                }
                t.isGeneratorFunction = function(t) {
                    var e = typeof t === "function" && t.constructor;
                    return e ? e === g || (e.displayName || e.name) === "GeneratorFunction" : false;
                };
                t.mark = function(t) {
                    if (Object.setPrototypeOf) {
                        Object.setPrototypeOf(t, y);
                    } else {
                        t.__proto__ = y;
                        if (!(u in t)) {
                            t[u] = "GeneratorFunction";
                        }
                    }
                    t.prototype = Object.create(b);
                    return t;
                };
                t.awrap = function(t) {
                    return {
                        __await: t
                    };
                };
                function O(t, e) {
                    function n(a, o, i, u) {
                        var c = f(t[a], t, o);
                        if (c.type === "throw") {
                            u(c.arg);
                        } else {
                            var s = c.arg;
                            var l = s.value;
                            if (l && typeof l === "object" && r.call(l, "__await")) {
                                return e.resolve(l.__await).then(function(t) {
                                    n("next", t, i, u);
                                }, function(t) {
                                    n("throw", t, i, u);
                                });
                            }
                            return e.resolve(l).then(function(t) {
                                s.value = t;
                                i(s);
                            }, function(t) {
                                return n("throw", t, i, u);
                            });
                        }
                    }
                    var a;
                    function o(t, r) {
                        function o() {
                            return new e(function(e, a) {
                                n(t, r, e, a);
                            });
                        }
                        return (a = a ? a.then(o, o) : o());
                    }
                    this._invoke = o;
                }
                w(O.prototype);
                O.prototype[i] = function() {
                    return this;
                };
                t.AsyncIterator = O;
                t.async = function(e, r, n, a, o) {
                    if (o === void 0) o = Promise;
                    var i = new O(c(e, r, n, a), o);
                    return t.isGeneratorFunction(r) ? i : i.next().then(function(t) {
                        return t.done ? t.value : i.next();
                    });
                };
                function R(t, e, r) {
                    var n = s;
                    return function a(o, i) {
                        if (n === v) {
                            throw new Error("Generator is already running");
                        }
                        if (n === h) {
                            if (o === "throw") {
                                throw i;
                            }
                            return k();
                        }
                        r.method = o;
                        r.arg = i;
                        while(true){
                            var u = r.delegate;
                            if (u) {
                                var c = C(u, r);
                                if (c) {
                                    if (c === d) continue;
                                    return c;
                                }
                            }
                            if (r.method === "next") {
                                r.sent = r._sent = r.arg;
                            } else if (r.method === "throw") {
                                if (n === s) {
                                    n = h;
                                    throw r.arg;
                                }
                                r.dispatchException(r.arg);
                            } else if (r.method === "return") {
                                r.abrupt("return", r.arg);
                            }
                            n = v;
                            var p = f(t, e, r);
                            if (p.type === "normal") {
                                n = r.done ? h : l;
                                if (p.arg === d) {
                                    continue;
                                }
                                return {
                                    value: p.arg,
                                    done: r.done
                                };
                            } else if (p.type === "throw") {
                                n = h;
                                r.method = "throw";
                                r.arg = p.arg;
                            }
                        }
                    };
                }
                function C(t, e) {
                    var r = t.iterator[e.method];
                    if (r === n) {
                        e.delegate = null;
                        if (e.method === "throw") {
                            if (t.iterator["return"]) {
                                e.method = "return";
                                e.arg = n;
                                C(t, e);
                                if (e.method === "throw") {
                                    return d;
                                }
                            }
                            e.method = "throw";
                            e.arg = new TypeError("The iterator does not provide a 'throw' method");
                        }
                        return d;
                    }
                    var a = f(r, t.iterator, e.arg);
                    if (a.type === "throw") {
                        e.method = "throw";
                        e.arg = a.arg;
                        e.delegate = null;
                        return d;
                    }
                    var o = a.arg;
                    if (!o) {
                        e.method = "throw";
                        e.arg = new TypeError("iterator result is not an object");
                        e.delegate = null;
                        return d;
                    }
                    if (o.done) {
                        e[t.resultName] = o.value;
                        e.next = t.nextLoc;
                        if (e.method !== "return") {
                            e.method = "next";
                            e.arg = n;
                        }
                    } else {
                        return o;
                    }
                    e.delegate = null;
                    return d;
                }
                w(b);
                b[u] = "Generator";
                b[o] = function() {
                    return this;
                };
                b.toString = function() {
                    return "[object Generator]";
                };
                function E(t) {
                    var e = {
                        tryLoc: t[0]
                    };
                    if (1 in t) {
                        e.catchLoc = t[1];
                    }
                    if (2 in t) {
                        e.finallyLoc = t[2];
                        e.afterLoc = t[3];
                    }
                    this.tryEntries.push(e);
                }
                function M(t) {
                    var e = t.completion || {};
                    e.type = "normal";
                    delete e.arg;
                    t.completion = e;
                }
                function S(t) {
                    this.tryEntries = [
                        {
                            tryLoc: "root"
                        }, 
                    ];
                    t.forEach(E, this);
                    this.reset(true);
                }
                t.keys = function(t) {
                    var e = [];
                    for(var r in t){
                        e.push(r);
                    }
                    e.reverse();
                    return function r() {
                        while(e.length){
                            var n = e.pop();
                            if (n in t) {
                                r.value = n;
                                r.done = false;
                                return r;
                            }
                        }
                        r.done = true;
                        return r;
                    };
                };
                function A(t) {
                    if (t) {
                        var e = t[o];
                        if (e) {
                            return e.call(t);
                        }
                        if (typeof t.next === "function") {
                            return t;
                        }
                        if (!isNaN(t.length)) {
                            var a = -1, i = function e() {
                                while(++a < t.length){
                                    if (r.call(t, a)) {
                                        e.value = t[a];
                                        e.done = false;
                                        return e;
                                    }
                                }
                                e.value = n;
                                e.done = true;
                                return e;
                            };
                            return (i.next = i);
                        }
                    }
                    return {
                        next: k
                    };
                }
                t.values = A;
                function k() {
                    return {
                        value: n,
                        done: true
                    };
                }
                S.prototype = {
                    constructor: S,
                    reset: function(t) {
                        this.prev = 0;
                        this.next = 0;
                        this.sent = this._sent = n;
                        this.done = false;
                        this.delegate = null;
                        this.method = "next";
                        this.arg = n;
                        this.tryEntries.forEach(M);
                        if (!t) {
                            for(var e in this){
                                if (e.charAt(0) === "t" && r.call(this, e) && !isNaN(+e.slice(1))) {
                                    this[e] = n;
                                }
                            }
                        }
                    },
                    stop: function() {
                        this.done = true;
                        var t = this.tryEntries[0];
                        var e = t.completion;
                        if (e.type === "throw") {
                            throw e.arg;
                        }
                        return this.rval;
                    },
                    dispatchException: function(t) {
                        if (this.done) {
                            throw t;
                        }
                        var e = this;
                        function a(r, a) {
                            u.type = "throw";
                            u.arg = t;
                            e.next = r;
                            if (a) {
                                e.method = "next";
                                e.arg = n;
                            }
                            return !!a;
                        }
                        for(var o = this.tryEntries.length - 1; o >= 0; --o){
                            var i = this.tryEntries[o];
                            var u = i.completion;
                            if (i.tryLoc === "root") {
                                return a("end");
                            }
                            if (i.tryLoc <= this.prev) {
                                var c = r.call(i, "catchLoc");
                                var f = r.call(i, "finallyLoc");
                                if (c && f) {
                                    if (this.prev < i.catchLoc) {
                                        return a(i.catchLoc, true);
                                    } else if (this.prev < i.finallyLoc) {
                                        return a(i.finallyLoc);
                                    }
                                } else if (c) {
                                    if (this.prev < i.catchLoc) {
                                        return a(i.catchLoc, true);
                                    }
                                } else if (f) {
                                    if (this.prev < i.finallyLoc) {
                                        return a(i.finallyLoc);
                                    }
                                } else {
                                    throw new Error("try statement without catch or finally");
                                }
                            }
                        }
                    },
                    abrupt: function(t, e) {
                        for(var n = this.tryEntries.length - 1; n >= 0; --n){
                            var a = this.tryEntries[n];
                            if (a.tryLoc <= this.prev && r.call(a, "finallyLoc") && this.prev < a.finallyLoc) {
                                var o = a;
                                break;
                            }
                        }
                        if (o && (t === "break" || t === "continue") && o.tryLoc <= e && e <= o.finallyLoc) {
                            o = null;
                        }
                        var i = o ? o.completion : {};
                        i.type = t;
                        i.arg = e;
                        if (o) {
                            this.method = "next";
                            this.next = o.finallyLoc;
                            return d;
                        }
                        return this.complete(i);
                    },
                    complete: function(t, e) {
                        if (t.type === "throw") {
                            throw t.arg;
                        }
                        if (t.type === "break" || t.type === "continue") {
                            this.next = t.arg;
                        } else if (t.type === "return") {
                            this.rval = this.arg = t.arg;
                            this.method = "return";
                            this.next = "end";
                        } else if (t.type === "normal" && e) {
                            this.next = e;
                        }
                        return d;
                    },
                    finish: function(t) {
                        for(var e = this.tryEntries.length - 1; e >= 0; --e){
                            var r = this.tryEntries[e];
                            if (r.finallyLoc === t) {
                                this.complete(r.completion, r.afterLoc);
                                M(r);
                                return d;
                            }
                        }
                    },
                    catch: function(t) {
                        for(var e = this.tryEntries.length - 1; e >= 0; --e){
                            var r = this.tryEntries[e];
                            if (r.tryLoc === t) {
                                var n = r.completion;
                                if (n.type === "throw") {
                                    var a = n.arg;
                                    M(r);
                                }
                                return a;
                            }
                        }
                        throw new Error("illegal catch attempt");
                    },
                    delegateYield: function(t, e, r) {
                        this.delegate = {
                            iterator: A(t),
                            resultName: e,
                            nextLoc: r
                        };
                        if (this.method === "next") {
                            this.arg = n;
                        }
                        return d;
                    }
                };
                return t;
            })(true ? t.exports : undefined);
            try {
                regeneratorRuntime = n;
            } catch (a) {
                Function("r", "regeneratorRuntime = r")(n);
            }
        },
        function(t, e, r) {
            var n = r(230), a = r(240);
            function o(t, e) {
                return n(t, e, function(e, r) {
                    return a(t, r);
                });
            }
            t.exports = o;
        },
        function(t, e, r) {
            var n = r(231), a = r(239), o = r(32);
            function i(t, e, r) {
                var i = -1, u = e.length, c = {};
                while(++i < u){
                    var f = e[i], s = n(t, f);
                    if (r(s, f)) {
                        a(c, o(f, t), s);
                    }
                }
                return c;
            }
            t.exports = i;
        },
        function(t, e, r) {
            var n = r(32), a = r(43);
            function o(t, e) {
                e = n(e, t);
                var r = 0, o = e.length;
                while(t != null && r < o){
                    t = t[a(e[r++])];
                }
                return r && r == o ? t : undefined;
            }
            t.exports = o;
        },
        function(t, e, r) {
            var n = r(15), a = r(42);
            var o = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, i = /^\w*$/;
            function u(t, e) {
                if (n(t)) {
                    return false;
                }
                var r = typeof t;
                if (r == "number" || r == "symbol" || r == "boolean" || t == null || a(t)) {
                    return true;
                }
                return (i.test(t) || !o.test(t) || (e != null && t in Object(e)));
            }
            t.exports = u;
        },
        function(t, e, r) {
            var n = r(234);
            var a = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
            var o = /\\(\\)?/g;
            var i = n(function(t) {
                var e = [];
                if (t.charCodeAt(0) === 46) {
                    e.push("");
                }
                t.replace(a, function(t, r, n, a) {
                    e.push(n ? a.replace(o, "$1") : r || t);
                });
                return e;
            });
            t.exports = i;
        },
        function(t, e, r) {
            var n = r(235);
            var a = 500;
            function o(t) {
                var e = n(t, function(t) {
                    if (r.size === a) {
                        r.clear();
                    }
                    return t;
                });
                var r = e.cache;
                return e;
            }
            t.exports = o;
        },
        function(t, e, r) {
            var n = r(47);
            var a = "Expected a function";
            function o(t, e) {
                if (typeof t != "function" || (e != null && typeof e != "function")) {
                    throw new TypeError(a);
                }
                var r = function() {
                    var n = arguments, a = e ? e.apply(this, n) : n[0], o = r.cache;
                    if (o.has(a)) {
                        return o.get(a);
                    }
                    var i = t.apply(this, n);
                    r.cache = o.set(a, i) || o;
                    return i;
                };
                r.cache = new (o.Cache || n)();
                return r;
            }
            o.Cache = n;
            t.exports = o;
        },
        function(t, e, r) {
            var n = r(237);
            function a(t) {
                return t == null ? "" : n(t);
            }
            t.exports = a;
        },
        function(t, e, r) {
            var n = r(27), a = r(238), o = r(15), i = r(42);
            var u = 1 / 0;
            var c = n ? n.prototype : undefined, f = c ? c.toString : undefined;
            function s(t) {
                if (typeof t == "string") {
                    return t;
                }
                if (o(t)) {
                    return a(t, s) + "";
                }
                if (i(t)) {
                    return f ? f.call(t) : "";
                }
                var e = t + "";
                return e == "0" && 1 / t == -u ? "-0" : e;
            }
            t.exports = s;
        },
        function(t, e) {
            function r(t, e) {
                var r = -1, n = t == null ? 0 : t.length, a = Array(n);
                while(++r < n){
                    a[r] = e(t[r], r, t);
                }
                return a;
            }
            t.exports = r;
        },
        function(t, e, r) {
            var n = r(55), a = r(32), o = r(31), i = r(14), u = r(43);
            function c(t, e, r, c) {
                if (!i(t)) {
                    return t;
                }
                e = a(e, t);
                var f = -1, s = e.length, l = s - 1, v = t;
                while(v != null && ++f < s){
                    var h = u(e[f]), d = r;
                    if (h === "__proto__" || h === "constructor" || h === "prototype") {
                        return t;
                    }
                    if (f != l) {
                        var p = v[h];
                        d = c ? c(p, h, v) : undefined;
                        if (d === undefined) {
                            d = i(p) ? p : o(e[f + 1]) ? [] : {};
                        }
                    }
                    n(v, h, d);
                    v = v[h];
                }
                return t;
            }
            t.exports = c;
        },
        function(t, e, r) {
            var n = r(241), a = r(242);
            function o(t, e) {
                return t != null && a(t, e, n);
            }
            t.exports = o;
        },
        function(t, e) {
            function r(t, e) {
                return t != null && e in Object(t);
            }
            t.exports = r;
        },
        function(t, e, r) {
            var n = r(32), a = r(30), o = r(15), i = r(31), u = r(40), c = r(43);
            function f(t, e, r) {
                e = n(e, t);
                var f = -1, s = e.length, l = false;
                while(++f < s){
                    var v = c(e[f]);
                    if (!(l = t != null && r(t, v))) {
                        break;
                    }
                    t = t[v];
                }
                if (l || ++f != s) {
                    return l;
                }
                s = t == null ? 0 : t.length;
                return (!!s && u(s) && i(v, s) && (o(t) || a(t)));
            }
            t.exports = f;
        },
        function(t, e, r) {
            var n = r(244), a = r(58), o = r(59);
            function i(t) {
                return o(a(t, undefined, n), t + "");
            }
            t.exports = i;
        },
        function(t, e, r) {
            var n = r(245);
            function a(t) {
                var e = t == null ? 0 : t.length;
                return e ? n(t, 1) : [];
            }
            t.exports = a;
        },
        function(t, e, r) {
            var n = r(246), a = r(247);
            function o(t, e, r, i, u) {
                var c = -1, f = t.length;
                r || (r = a);
                u || (u = []);
                while(++c < f){
                    var s = t[c];
                    if (e > 0 && r(s)) {
                        if (e > 1) {
                            o(s, e - 1, r, i, u);
                        } else {
                            n(u, s);
                        }
                    } else if (!i) {
                        u[u.length] = s;
                    }
                }
                return u;
            }
            t.exports = o;
        },
        function(t, e) {
            function r(t, e) {
                var r = -1, n = e.length, a = t.length;
                while(++r < n){
                    t[a + r] = e[r];
                }
                return t;
            }
            t.exports = r;
        },
        function(t, e, r) {
            var n = r(27), a = r(30), o = r(15);
            var i = n ? n.isConcatSpreadable : undefined;
            function u(t) {
                return (o(t) || a(t) || !!(i && t && t[i]));
            }
            t.exports = u;
        },
        function(t, e) {
            function r(t) {
                return (Function.toString.call(t).indexOf("[native code]") !== -1);
            }
            t.exports = r;
            (t.exports["default"] = t.exports), (t.exports.__esModule = true);
        },
        function(t, e, r) {
            var n = r(41);
            var a = r(250);
            function o(e, r, i) {
                if (a()) {
                    t.exports = o = Reflect.construct;
                    (t.exports["default"] = t.exports), (t.exports.__esModule = true);
                } else {
                    t.exports = o = function t(e, r, a) {
                        var o = [
                            null
                        ];
                        o.push.apply(o, r);
                        var i = Function.bind.apply(e, o);
                        var u = new i();
                        if (a) n(u, a.prototype);
                        return u;
                    };
                    (t.exports["default"] = t.exports), (t.exports.__esModule = true);
                }
                return o.apply(null, arguments);
            }
            t.exports = o;
            (t.exports["default"] = t.exports), (t.exports.__esModule = true);
        },
        function(t, e) {
            function r() {
                if (typeof Reflect === "undefined" || !Reflect.construct) return false;
                if (Reflect.construct.sham) return false;
                if (typeof Proxy === "function") return true;
                try {
                    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
                    return true;
                } catch (t) {
                    return false;
                }
            }
            t.exports = r;
            (t.exports["default"] = t.exports), (t.exports.__esModule = true);
        },
        function(t, e) {
            t.exports = r;
            function r(t) {
                return t[0] * t[3] - t[2] * t[1];
            }
        },
        function(t, e) {
            t.exports = r;
            function r(t, e) {
                if (t === e) {
                    var r = e[1];
                    t[1] = e[2];
                    t[2] = r;
                } else {
                    t[0] = e[0];
                    t[1] = e[2];
                    t[2] = e[1];
                    t[3] = e[3];
                }
                return t;
            }
        },
        function(t, e) {
            t.exports = r;
            function r(t, e, r) {
                var n = e[0], a = e[1], o = e[2], i = e[3];
                var u = r[0], c = r[1], f = r[2], s = r[3];
                t[0] = n * u + o * c;
                t[1] = a * u + i * c;
                t[2] = n * f + o * s;
                t[3] = a * f + i * s;
                return t;
            }
        },
        function(t, e) {
            t.exports = r;
            function r(t) {
                t[0] = 1;
                t[1] = 0;
                t[2] = 0;
                t[3] = 1;
                return t;
            }
        },
        function(t, e) {
            t.exports = r;
            function r(t, e) {
                var r = e[0];
                t[0] = e[3];
                t[1] = -e[1];
                t[2] = -e[2];
                t[3] = r;
                return t;
            }
        },
        function(t, e) {
            t.exports = r;
            function r(t, e, r) {
                var n = e[0], a = e[1], o = e[2], i = e[3];
                var u = Math.sin(r);
                var c = Math.cos(r);
                t[0] = n * c + o * u;
                t[1] = a * c + i * u;
                t[2] = n * -u + o * c;
                t[3] = a * -u + i * c;
                return t;
            }
        },
        function(t, e) {
            t.exports = r;
            function r(t, e) {
                var r = e[0];
                var n = e[1];
                var a = e[2];
                var o = e[3];
                var i = r * o - a * n;
                if (!i) return null;
                i = 1.0 / i;
                t[0] = o * i;
                t[1] = -n * i;
                t[2] = -a * i;
                t[3] = r * i;
                return t;
            }
        },
        function(t, e) {
            t.exports = r;
            function r() {
                var t = new Float32Array(4);
                t[0] = 1;
                t[1] = 0;
                t[2] = 0;
                t[3] = 1;
                return t;
            }
        },
        function(t, e) {
            t.exports = r;
            function r(t, e, r) {
                var n = e[0], a = e[1], o = e[2], i = e[3];
                var u = r[0], c = r[1];
                t[0] = n * u;
                t[1] = a * u;
                t[2] = o * c;
                t[3] = i * c;
                return t;
            }
        },
        function(t, e) {
            t.exports = r;
            function r(t, e) {
                t[0] = e[0];
                t[1] = e[1];
                t[2] = e[2];
                t[3] = e[3];
                return t;
            }
        },
        function(t, e) {
            t.exports = r;
            function r(t) {
                return Math.sqrt(Math.pow(t[0], 2) + Math.pow(t[1], 2) + Math.pow(t[2], 2) + Math.pow(t[3], 2));
            }
        },
        function(t, e) {
            t.exports = r;
            function r(t, e, r, n) {
                t[2] = n[2] / n[0];
                r[0] = n[0];
                r[1] = n[1];
                r[3] = n[3] - t[2] * r[1];
                return [
                    t,
                    e,
                    r
                ];
            }
        },
        function(t, e, r) {
            "use strict";
            r.r(e);
            r.d(e, "BarcodeDecoder", function() {
                return ed;
            });
            r.d(e, "Readers", function() {
                return n;
            });
            r.d(e, "CameraAccess", function() {
                return eW;
            });
            r.d(e, "ImageDebug", function() {
                return h["a"];
            });
            r.d(e, "ImageWrapper", function() {
                return f["a"];
            });
            r.d(e, "ResultCollector", function() {
                return eq;
            });
            var n = {};
            r.r(n);
            r.d(n, "BarcodeReader", function() {
                return P;
            });
            r.d(n, "TwoOfFiveReader", function() {
                return t9;
            });
            r.d(n, "NewCodabarReader", function() {
                return tb;
            });
            r.d(n, "Code128Reader", function() {
                return I;
            });
            r.d(n, "Code32Reader", function() {
                return ev;
            });
            r.d(n, "Code39Reader", function() {
                return ta;
            });
            r.d(n, "Code39VINReader", function() {
                return tl;
            });
            r.d(n, "Code93Reader", function() {
                return ei;
            });
            r.d(n, "EAN2Reader", function() {
                return tT;
            });
            r.d(n, "EAN5Reader", function() {
                return tW;
            });
            r.d(n, "EAN8Reader", function() {
                return tA;
            });
            r.d(n, "EANReader", function() {
                return Q;
            });
            r.d(n, "I2of5Reader", function() {
                return tJ;
            });
            r.d(n, "UPCEReader", function() {
                return tH;
            });
            r.d(n, "UPCReader", function() {
                return tC;
            });
            var a = r(19);
            var o = r.n(a);
            var i = r(16);
            var u = r.n(i);
            var c = r(152);
            var f = r(11);
            var s = {};
            var l = {
                DIR: {
                    UP: 1,
                    DOWN: -1
                }
            };
            s.getBarcodeLine = function(t, e, r) {
                var n = e.x | 0;
                var a = e.y | 0;
                var o = r.x | 0;
                var i = r.y | 0;
                var u = Math.abs(i - a) > Math.abs(o - n);
                var c;
                var f;
                var s;
                var l;
                var v = [];
                var h = t.data;
                var d = t.size.x;
                var p;
                var g = 255;
                var y = 0;
                function x(t, e) {
                    p = h[e * d + t];
                    g = p < g ? p : g;
                    y = p > y ? p : y;
                    v.push(p);
                }
                if (u) {
                    s = n;
                    n = a;
                    a = s;
                    s = o;
                    o = i;
                    i = s;
                }
                if (n > o) {
                    s = n;
                    n = o;
                    o = s;
                    s = a;
                    a = i;
                    i = s;
                }
                var m = o - n;
                var _ = Math.abs(i - a);
                c = (m / 2) | 0;
                f = a;
                var b = a < i ? 1 : -1;
                for(l = n; l < o; l++){
                    if (u) {
                        x(f, l);
                    } else {
                        x(l, f);
                    }
                    c -= _;
                    if (c < 0) {
                        f += b;
                        c += m;
                    }
                }
                return {
                    line: v,
                    min: g,
                    max: y
                };
            };
            s.toBinaryLine = function(t) {
                var e = t.min;
                var r = t.max;
                var n = t.line;
                var a;
                var o;
                var i = e + (r - e) / 2;
                var u = [];
                var c;
                var f;
                var s = (r - e) / 12;
                var v = -s;
                var h;
                var d;
                c = n[0] > i ? l.DIR.UP : l.DIR.DOWN;
                u.push({
                    pos: 0,
                    val: n[0]
                });
                for(h = 0; h < n.length - 2; h++){
                    a = n[h + 1] - n[h];
                    o = n[h + 2] - n[h + 1];
                    if (a + o < v && n[h + 1] < i * 1.5) {
                        f = l.DIR.DOWN;
                    } else if (a + o > s && n[h + 1] > i * 0.5) {
                        f = l.DIR.UP;
                    } else {
                        f = c;
                    }
                    if (c !== f) {
                        u.push({
                            pos: h,
                            val: n[h]
                        });
                        c = f;
                    }
                }
                u.push({
                    pos: n.length,
                    val: n[n.length - 1]
                });
                for(d = u[0].pos; d < u[1].pos; d++){
                    n[d] = n[d] > i ? 0 : 1;
                }
                for(h = 1; h < u.length - 1; h++){
                    if (u[h + 1].val > u[h].val) {
                        s = (u[h].val + ((u[h + 1].val - u[h].val) / 3) * 2) | 0;
                    } else {
                        s = (u[h + 1].val + (u[h].val - u[h + 1].val) / 3) | 0;
                    }
                    for(d = u[h].pos; d < u[h + 1].pos; d++){
                        n[d] = n[d] > s ? 0 : 1;
                    }
                }
                return {
                    line: n,
                    threshold: s
                };
            };
            s.debug = {
                printFrequency: function t(e, r) {
                    var n;
                    var a = r.getContext("2d");
                    r.width = e.length;
                    r.height = 256;
                    a.beginPath();
                    a.strokeStyle = "blue";
                    for(n = 0; n < e.length; n++){
                        a.moveTo(n, 255);
                        a.lineTo(n, 255 - e[n]);
                    }
                    a.stroke();
                    a.closePath();
                },
                printPattern: function t(e, r) {
                    var n = r.getContext("2d");
                    var a;
                    r.width = e.length;
                    n.fillColor = "black";
                    for(a = 0; a < e.length; a++){
                        if (e[a] === 1) {
                            n.fillRect(a, 0, 1, 100);
                        }
                    }
                }
            };
            var v = s;
            var h = r(9);
            var d = r(3);
            var p = r.n(d);
            var g = r(4);
            var y = r.n(g);
            var x = r(1);
            var m = r.n(x);
            var _ = r(6);
            var b = r.n(_);
            var w = r(5);
            var O = r.n(w);
            var R = r(2);
            var C = r.n(R);
            var E = r(0);
            var M = r.n(E);
            var S = r(10);
            var A;
            (function(t) {
                t[(t["Forward"] = 1)] = "Forward";
                t[(t["Reverse"] = -1)] = "Reverse";
            })(A || (A = {}));
            var k = (function() {
                function t(e, r) {
                    p()(this, t);
                    M()(this, "_row", []);
                    M()(this, "config", {});
                    M()(this, "supplements", []);
                    M()(this, "SINGLE_CODE_ERROR", 0);
                    M()(this, "FORMAT", "unknown");
                    M()(this, "CONFIG_KEYS", {});
                    this._row = [];
                    this.config = e || {};
                    if (r) {
                        this.supplements = r;
                    }
                    return this;
                }
                y()(t, [
                    {
                        key: "_nextUnset",
                        value: function t(e) {
                            var r = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
                            for(var n = r; n < e.length; n++){
                                if (!e[n]) return n;
                            }
                            return e.length;
                        }
                    },
                    {
                        key: "_matchPattern",
                        value: function t(e, r, n) {
                            var a = 0;
                            var o = 0;
                            var i = 0;
                            var u = 0;
                            var c = 0;
                            var f = 0;
                            var s = 0;
                            n = n || this.SINGLE_CODE_ERROR || 1;
                            for(var l = 0; l < e.length; l++){
                                i += e[l];
                                u += r[l];
                            }
                            if (i < u) {
                                return Number.MAX_VALUE;
                            }
                            c = i / u;
                            n *= c;
                            for(var v = 0; v < e.length; v++){
                                f = e[v];
                                s = r[v] * c;
                                o = Math.abs(f - s) / s;
                                if (o > n) {
                                    return Number.MAX_VALUE;
                                }
                                a += o;
                            }
                            return a / u;
                        }
                    },
                    {
                        key: "_nextSet",
                        value: function t(e) {
                            var r = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
                            for(var n = r; n < e.length; n++){
                                if (e[n]) return n;
                            }
                            return e.length;
                        }
                    },
                    {
                        key: "_correctBars",
                        value: function t(e, r, n) {
                            var a = n.length;
                            var o = 0;
                            while(a--){
                                o = e[n[a]] * (1 - (1 - r) / 2);
                                if (o > 1) {
                                    e[n[a]] = o;
                                }
                            }
                        }
                    },
                    {
                        key: "decodePattern",
                        value: function t(e) {
                            this._row = e;
                            var r = this.decode();
                            if (r === null) {
                                this._row.reverse();
                                r = this.decode();
                                if (r) {
                                    r.direction = A.Reverse;
                                    r.start = this._row.length - r.start;
                                    r.end = this._row.length - r.end;
                                }
                            } else {
                                r.direction = A.Forward;
                            }
                            if (r) {
                                r.format = this.FORMAT;
                            }
                            return r;
                        }
                    },
                    {
                        key: "_matchRange",
                        value: function t(e, r, n) {
                            var a;
                            e = e < 0 ? 0 : e;
                            for(a = e; a < r; a++){
                                if (this._row[a] !== n) {
                                    return false;
                                }
                            }
                            return true;
                        }
                    },
                    {
                        key: "_fillCounters",
                        value: function t() {
                            var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._nextUnset(this._row);
                            var r = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this._row.length;
                            var n = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
                            var a = [];
                            var o = 0;
                            a[o] = 0;
                            for(var i = e; i < r; i++){
                                if (this._row[i] ^ (n ? 1 : 0)) {
                                    a[o]++;
                                } else {
                                    o++;
                                    a[o] = 1;
                                    n = !n;
                                }
                            }
                            return a;
                        }
                    },
                    {
                        key: "_toCounters",
                        value: function t(e, r) {
                            var n = r.length;
                            var a = this._row.length;
                            var o = !this._row[e];
                            var i = 0;
                            S["a"].init(r, 0);
                            for(var u = e; u < a; u++){
                                if (this._row[u] ^ (o ? 1 : 0)) {
                                    r[i]++;
                                } else {
                                    i++;
                                    if (i === n) {
                                        break;
                                    } else {
                                        r[i] = 1;
                                        o = !o;
                                    }
                                }
                            }
                            return r;
                        }
                    }, 
                ], [
                    {
                        key: "Exception",
                        get: function t() {
                            return {
                                StartNotFoundException: "Start-Info was not found!",
                                CodeNotFoundException: "Code could not be found!",
                                PatternNotFoundException: "Pattern could not be found!"
                            };
                        }
                    }, 
                ]);
                return t;
            })();
            var P = k;
            function D(t) {
                var e = T();
                return function r() {
                    var n = C()(t), a;
                    if (e) {
                        var o = C()(this).constructor;
                        a = Reflect.construct(n, arguments, o);
                    } else {
                        a = n.apply(this, arguments);
                    }
                    return O()(this, a);
                };
            }
            function T() {
                if (typeof Reflect === "undefined" || !Reflect.construct) return false;
                if (Reflect.construct.sham) return false;
                if (typeof Proxy === "function") return true;
                try {
                    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
                    return true;
                } catch (t) {
                    return false;
                }
            }
            var j = (function(t) {
                b()(r, t);
                var e = D(r);
                function r() {
                    var t;
                    p()(this, r);
                    for(var n = arguments.length, a = new Array(n), o = 0; o < n; o++){
                        a[o] = arguments[o];
                    }
                    t = e.call.apply(e, [
                        this
                    ].concat(a));
                    M()(m()(t), "CODE_SHIFT", 98);
                    M()(m()(t), "CODE_C", 99);
                    M()(m()(t), "CODE_B", 100);
                    M()(m()(t), "CODE_A", 101);
                    M()(m()(t), "START_CODE_A", 103);
                    M()(m()(t), "START_CODE_B", 104);
                    M()(m()(t), "START_CODE_C", 105);
                    M()(m()(t), "STOP_CODE", 106);
                    M()(m()(t), "CODE_PATTERN", [
                        [
                            2,
                            1,
                            2,
                            2,
                            2,
                            2
                        ],
                        [
                            2,
                            2,
                            2,
                            1,
                            2,
                            2
                        ],
                        [
                            2,
                            2,
                            2,
                            2,
                            2,
                            1
                        ],
                        [
                            1,
                            2,
                            1,
                            2,
                            2,
                            3
                        ],
                        [
                            1,
                            2,
                            1,
                            3,
                            2,
                            2
                        ],
                        [
                            1,
                            3,
                            1,
                            2,
                            2,
                            2
                        ],
                        [
                            1,
                            2,
                            2,
                            2,
                            1,
                            3
                        ],
                        [
                            1,
                            2,
                            2,
                            3,
                            1,
                            2
                        ],
                        [
                            1,
                            3,
                            2,
                            2,
                            1,
                            2
                        ],
                        [
                            2,
                            2,
                            1,
                            2,
                            1,
                            3
                        ],
                        [
                            2,
                            2,
                            1,
                            3,
                            1,
                            2
                        ],
                        [
                            2,
                            3,
                            1,
                            2,
                            1,
                            2
                        ],
                        [
                            1,
                            1,
                            2,
                            2,
                            3,
                            2
                        ],
                        [
                            1,
                            2,
                            2,
                            1,
                            3,
                            2
                        ],
                        [
                            1,
                            2,
                            2,
                            2,
                            3,
                            1
                        ],
                        [
                            1,
                            1,
                            3,
                            2,
                            2,
                            2
                        ],
                        [
                            1,
                            2,
                            3,
                            1,
                            2,
                            2
                        ],
                        [
                            1,
                            2,
                            3,
                            2,
                            2,
                            1
                        ],
                        [
                            2,
                            2,
                            3,
                            2,
                            1,
                            1
                        ],
                        [
                            2,
                            2,
                            1,
                            1,
                            3,
                            2
                        ],
                        [
                            2,
                            2,
                            1,
                            2,
                            3,
                            1
                        ],
                        [
                            2,
                            1,
                            3,
                            2,
                            1,
                            2
                        ],
                        [
                            2,
                            2,
                            3,
                            1,
                            1,
                            2
                        ],
                        [
                            3,
                            1,
                            2,
                            1,
                            3,
                            1
                        ],
                        [
                            3,
                            1,
                            1,
                            2,
                            2,
                            2
                        ],
                        [
                            3,
                            2,
                            1,
                            1,
                            2,
                            2
                        ],
                        [
                            3,
                            2,
                            1,
                            2,
                            2,
                            1
                        ],
                        [
                            3,
                            1,
                            2,
                            2,
                            1,
                            2
                        ],
                        [
                            3,
                            2,
                            2,
                            1,
                            1,
                            2
                        ],
                        [
                            3,
                            2,
                            2,
                            2,
                            1,
                            1
                        ],
                        [
                            2,
                            1,
                            2,
                            1,
                            2,
                            3
                        ],
                        [
                            2,
                            1,
                            2,
                            3,
                            2,
                            1
                        ],
                        [
                            2,
                            3,
                            2,
                            1,
                            2,
                            1
                        ],
                        [
                            1,
                            1,
                            1,
                            3,
                            2,
                            3
                        ],
                        [
                            1,
                            3,
                            1,
                            1,
                            2,
                            3
                        ],
                        [
                            1,
                            3,
                            1,
                            3,
                            2,
                            1
                        ],
                        [
                            1,
                            1,
                            2,
                            3,
                            1,
                            3
                        ],
                        [
                            1,
                            3,
                            2,
                            1,
                            1,
                            3
                        ],
                        [
                            1,
                            3,
                            2,
                            3,
                            1,
                            1
                        ],
                        [
                            2,
                            1,
                            1,
                            3,
                            1,
                            3
                        ],
                        [
                            2,
                            3,
                            1,
                            1,
                            1,
                            3
                        ],
                        [
                            2,
                            3,
                            1,
                            3,
                            1,
                            1
                        ],
                        [
                            1,
                            1,
                            2,
                            1,
                            3,
                            3
                        ],
                        [
                            1,
                            1,
                            2,
                            3,
                            3,
                            1
                        ],
                        [
                            1,
                            3,
                            2,
                            1,
                            3,
                            1
                        ],
                        [
                            1,
                            1,
                            3,
                            1,
                            2,
                            3
                        ],
                        [
                            1,
                            1,
                            3,
                            3,
                            2,
                            1
                        ],
                        [
                            1,
                            3,
                            3,
                            1,
                            2,
                            1
                        ],
                        [
                            3,
                            1,
                            3,
                            1,
                            2,
                            1
                        ],
                        [
                            2,
                            1,
                            1,
                            3,
                            3,
                            1
                        ],
                        [
                            2,
                            3,
                            1,
                            1,
                            3,
                            1
                        ],
                        [
                            2,
                            1,
                            3,
                            1,
                            1,
                            3
                        ],
                        [
                            2,
                            1,
                            3,
                            3,
                            1,
                            1
                        ],
                        [
                            2,
                            1,
                            3,
                            1,
                            3,
                            1
                        ],
                        [
                            3,
                            1,
                            1,
                            1,
                            2,
                            3
                        ],
                        [
                            3,
                            1,
                            1,
                            3,
                            2,
                            1
                        ],
                        [
                            3,
                            3,
                            1,
                            1,
                            2,
                            1
                        ],
                        [
                            3,
                            1,
                            2,
                            1,
                            1,
                            3
                        ],
                        [
                            3,
                            1,
                            2,
                            3,
                            1,
                            1
                        ],
                        [
                            3,
                            3,
                            2,
                            1,
                            1,
                            1
                        ],
                        [
                            3,
                            1,
                            4,
                            1,
                            1,
                            1
                        ],
                        [
                            2,
                            2,
                            1,
                            4,
                            1,
                            1
                        ],
                        [
                            4,
                            3,
                            1,
                            1,
                            1,
                            1
                        ],
                        [
                            1,
                            1,
                            1,
                            2,
                            2,
                            4
                        ],
                        [
                            1,
                            1,
                            1,
                            4,
                            2,
                            2
                        ],
                        [
                            1,
                            2,
                            1,
                            1,
                            2,
                            4
                        ],
                        [
                            1,
                            2,
                            1,
                            4,
                            2,
                            1
                        ],
                        [
                            1,
                            4,
                            1,
                            1,
                            2,
                            2
                        ],
                        [
                            1,
                            4,
                            1,
                            2,
                            2,
                            1
                        ],
                        [
                            1,
                            1,
                            2,
                            2,
                            1,
                            4
                        ],
                        [
                            1,
                            1,
                            2,
                            4,
                            1,
                            2
                        ],
                        [
                            1,
                            2,
                            2,
                            1,
                            1,
                            4
                        ],
                        [
                            1,
                            2,
                            2,
                            4,
                            1,
                            1
                        ],
                        [
                            1,
                            4,
                            2,
                            1,
                            1,
                            2
                        ],
                        [
                            1,
                            4,
                            2,
                            2,
                            1,
                            1
                        ],
                        [
                            2,
                            4,
                            1,
                            2,
                            1,
                            1
                        ],
                        [
                            2,
                            2,
                            1,
                            1,
                            1,
                            4
                        ],
                        [
                            4,
                            1,
                            3,
                            1,
                            1,
                            1
                        ],
                        [
                            2,
                            4,
                            1,
                            1,
                            1,
                            2
                        ],
                        [
                            1,
                            3,
                            4,
                            1,
                            1,
                            1
                        ],
                        [
                            1,
                            1,
                            1,
                            2,
                            4,
                            2
                        ],
                        [
                            1,
                            2,
                            1,
                            1,
                            4,
                            2
                        ],
                        [
                            1,
                            2,
                            1,
                            2,
                            4,
                            1
                        ],
                        [
                            1,
                            1,
                            4,
                            2,
                            1,
                            2
                        ],
                        [
                            1,
                            2,
                            4,
                            1,
                            1,
                            2
                        ],
                        [
                            1,
                            2,
                            4,
                            2,
                            1,
                            1
                        ],
                        [
                            4,
                            1,
                            1,
                            2,
                            1,
                            2
                        ],
                        [
                            4,
                            2,
                            1,
                            1,
                            1,
                            2
                        ],
                        [
                            4,
                            2,
                            1,
                            2,
                            1,
                            1
                        ],
                        [
                            2,
                            1,
                            2,
                            1,
                            4,
                            1
                        ],
                        [
                            2,
                            1,
                            4,
                            1,
                            2,
                            1
                        ],
                        [
                            4,
                            1,
                            2,
                            1,
                            2,
                            1
                        ],
                        [
                            1,
                            1,
                            1,
                            1,
                            4,
                            3
                        ],
                        [
                            1,
                            1,
                            1,
                            3,
                            4,
                            1
                        ],
                        [
                            1,
                            3,
                            1,
                            1,
                            4,
                            1
                        ],
                        [
                            1,
                            1,
                            4,
                            1,
                            1,
                            3
                        ],
                        [
                            1,
                            1,
                            4,
                            3,
                            1,
                            1
                        ],
                        [
                            4,
                            1,
                            1,
                            1,
                            1,
                            3
                        ],
                        [
                            4,
                            1,
                            1,
                            3,
                            1,
                            1
                        ],
                        [
                            1,
                            1,
                            3,
                            1,
                            4,
                            1
                        ],
                        [
                            1,
                            1,
                            4,
                            1,
                            3,
                            1
                        ],
                        [
                            3,
                            1,
                            1,
                            1,
                            4,
                            1
                        ],
                        [
                            4,
                            1,
                            1,
                            1,
                            3,
                            1
                        ],
                        [
                            2,
                            1,
                            1,
                            4,
                            1,
                            2
                        ],
                        [
                            2,
                            1,
                            1,
                            2,
                            1,
                            4
                        ],
                        [
                            2,
                            1,
                            1,
                            2,
                            3,
                            2
                        ],
                        [
                            2,
                            3,
                            3,
                            1,
                            1,
                            1,
                            2
                        ], 
                    ]);
                    M()(m()(t), "SINGLE_CODE_ERROR", 0.64);
                    M()(m()(t), "AVG_CODE_ERROR", 0.3);
                    M()(m()(t), "FORMAT", "code_128");
                    M()(m()(t), "MODULE_INDICES", {
                        bar: [
                            0,
                            2,
                            4
                        ],
                        space: [
                            1,
                            3,
                            5
                        ]
                    });
                    return t;
                }
                y()(r, [
                    {
                        key: "_decodeCode",
                        value: function t(e, r) {
                            var n = {
                                error: Number.MAX_VALUE,
                                code: -1,
                                start: e,
                                end: e,
                                correction: {
                                    bar: 1,
                                    space: 1
                                }
                            };
                            var a = [
                                0,
                                0,
                                0,
                                0,
                                0,
                                0
                            ];
                            var o = e;
                            var i = !this._row[o];
                            var u = 0;
                            for(var c = o; c < this._row.length; c++){
                                if (this._row[c] ^ (i ? 1 : 0)) {
                                    a[u]++;
                                } else {
                                    if (u === a.length - 1) {
                                        if (r) {
                                            this._correct(a, r);
                                        }
                                        for(var f = 0; f < this.CODE_PATTERN.length; f++){
                                            var s = this._matchPattern(a, this.CODE_PATTERN[f]);
                                            if (s < n.error) {
                                                n.code = f;
                                                n.error = s;
                                            }
                                        }
                                        n.end = c;
                                        if (n.code === -1 || n.error > this.AVG_CODE_ERROR) {
                                            return null;
                                        }
                                        if (this.CODE_PATTERN[n.code]) {
                                            n.correction.bar = this.calculateCorrection(this.CODE_PATTERN[n.code], a, this.MODULE_INDICES.bar);
                                            n.correction.space = this.calculateCorrection(this.CODE_PATTERN[n.code], a, this.MODULE_INDICES.space);
                                        }
                                        return n;
                                    } else {
                                        u++;
                                    }
                                    a[u] = 1;
                                    i = !i;
                                }
                            }
                            return null;
                        }
                    },
                    {
                        key: "_correct",
                        value: function t(e, r) {
                            this._correctBars(e, r.bar, this.MODULE_INDICES.bar);
                            this._correctBars(e, r.space, this.MODULE_INDICES.space);
                        }
                    },
                    {
                        key: "_findStart",
                        value: function t() {
                            var e = [
                                0,
                                0,
                                0,
                                0,
                                0,
                                0
                            ];
                            var r = this._nextSet(this._row);
                            var n = {
                                error: Number.MAX_VALUE,
                                code: -1,
                                start: 0,
                                end: 0,
                                correction: {
                                    bar: 1,
                                    space: 1
                                }
                            };
                            var a = false;
                            var o = 0;
                            for(var i = r; i < this._row.length; i++){
                                if (this._row[i] ^ (a ? 1 : 0)) {
                                    e[o]++;
                                } else {
                                    if (o === e.length - 1) {
                                        var u = e.reduce(function(t, e) {
                                            return t + e;
                                        }, 0);
                                        for(var c = this.START_CODE_A; c <= this.START_CODE_C; c++){
                                            var f = this._matchPattern(e, this.CODE_PATTERN[c]);
                                            if (f < n.error) {
                                                n.code = c;
                                                n.error = f;
                                            }
                                        }
                                        if (n.error < this.AVG_CODE_ERROR) {
                                            n.start = i - u;
                                            n.end = i;
                                            n.correction.bar = this.calculateCorrection(this.CODE_PATTERN[n.code], e, this.MODULE_INDICES.bar);
                                            n.correction.space = this.calculateCorrection(this.CODE_PATTERN[n.code], e, this.MODULE_INDICES.space);
                                            return n;
                                        }
                                        for(var s = 0; s < 4; s++){
                                            e[s] = e[s + 2];
                                        }
                                        e[4] = 0;
                                        e[5] = 0;
                                        o--;
                                    } else {
                                        o++;
                                    }
                                    e[o] = 1;
                                    a = !a;
                                }
                            }
                            return null;
                        }
                    },
                    {
                        key: "decode",
                        value: function t(e, r) {
                            var n = this;
                            var a = this._findStart();
                            if (a === null) {
                                return null;
                            }
                            var o = {
                                code: a.code,
                                start: a.start,
                                end: a.end,
                                correction: {
                                    bar: a.correction.bar,
                                    space: a.correction.space
                                }
                            };
                            var i = [];
                            i.push(o);
                            var u = o.code;
                            var c = (function(t) {
                                switch(t){
                                    case n.START_CODE_A:
                                        return n.CODE_A;
                                    case n.START_CODE_B:
                                        return n.CODE_B;
                                    case n.START_CODE_C:
                                        return n.CODE_C;
                                    default:
                                        return null;
                                }
                            })(o.code);
                            var f = false;
                            var s = false;
                            var l = s;
                            var v = true;
                            var h = 0;
                            var d = [];
                            var p = [];
                            while(!f){
                                l = s;
                                s = false;
                                o = this._decodeCode(o.end, o.correction);
                                if (o !== null) {
                                    if (o.code !== this.STOP_CODE) {
                                        v = true;
                                    }
                                    if (o.code !== this.STOP_CODE) {
                                        d.push(o.code);
                                        h++;
                                        u += h * o.code;
                                    }
                                    i.push(o);
                                    switch(c){
                                        case this.CODE_A:
                                            if (o.code < 64) {
                                                p.push(String.fromCharCode(32 + o.code));
                                            } else if (o.code < 96) {
                                                p.push(String.fromCharCode(o.code - 64));
                                            } else {
                                                if (o.code !== this.STOP_CODE) {
                                                    v = false;
                                                }
                                                switch(o.code){
                                                    case this.CODE_SHIFT:
                                                        s = true;
                                                        c = this.CODE_B;
                                                        break;
                                                    case this.CODE_B:
                                                        c = this.CODE_B;
                                                        break;
                                                    case this.CODE_C:
                                                        c = this.CODE_C;
                                                        break;
                                                    case this.STOP_CODE:
                                                        f = true;
                                                        break;
                                                }
                                            }
                                            break;
                                        case this.CODE_B:
                                            if (o.code < 96) {
                                                p.push(String.fromCharCode(32 + o.code));
                                            } else {
                                                if (o.code !== this.STOP_CODE) {
                                                    v = false;
                                                }
                                                switch(o.code){
                                                    case this.CODE_SHIFT:
                                                        s = true;
                                                        c = this.CODE_A;
                                                        break;
                                                    case this.CODE_A:
                                                        c = this.CODE_A;
                                                        break;
                                                    case this.CODE_C:
                                                        c = this.CODE_C;
                                                        break;
                                                    case this.STOP_CODE:
                                                        f = true;
                                                        break;
                                                }
                                            }
                                            break;
                                        case this.CODE_C:
                                            if (o.code < 100) {
                                                p.push(o.code < 10 ? "0" + o.code : o.code);
                                            } else {
                                                if (o.code !== this.STOP_CODE) {
                                                    v = false;
                                                }
                                                switch(o.code){
                                                    case this.CODE_A:
                                                        c = this.CODE_A;
                                                        break;
                                                    case this.CODE_B:
                                                        c = this.CODE_B;
                                                        break;
                                                    case this.STOP_CODE:
                                                        f = true;
                                                        break;
                                                }
                                            }
                                            break;
                                    }
                                } else {
                                    f = true;
                                }
                                if (l) {
                                    c = c === this.CODE_A ? this.CODE_B : this.CODE_A;
                                }
                            }
                            if (o === null) {
                                return null;
                            }
                            o.end = this._nextUnset(this._row, o.end);
                            if (!this._verifyTrailingWhitespace(o)) {
                                return null;
                            }
                            u -= h * d[d.length - 1];
                            if (u % 103 !== d[d.length - 1]) {
                                return null;
                            }
                            if (!p.length) {
                                return null;
                            }
                            if (v) {
                                p.splice(p.length - 1, 1);
                            }
                            return {
                                code: p.join(""),
                                start: a.start,
                                end: o.end,
                                codeset: c,
                                startInfo: a,
                                decodedCodes: i,
                                endInfo: o,
                                format: this.FORMAT
                            };
                        }
                    },
                    {
                        key: "_verifyTrailingWhitespace",
                        value: function t(e) {
                            var r = this, n;
                            n = e.end + (e.end - e.start) / 2;
                            if (n < r._row.length) {
                                if (r._matchRange(e.end, n, 0)) {
                                    return e;
                                }
                            }
                            return null;
                        }
                    },
                    {
                        key: "calculateCorrection",
                        value: function t(e, r, n) {
                            var a = n.length, o = 0, i = 0;
                            while(a--){
                                i += e[n[a]];
                                o += r[n[a]];
                            }
                            return i / o;
                        }
                    }, 
                ]);
                return r;
            })(P);
            var I = j;
            function z(t, e) {
                var r = Object.keys(t);
                if (Object.getOwnPropertySymbols) {
                    var n = Object.getOwnPropertySymbols(t);
                    if (e) {
                        n = n.filter(function(e) {
                            return Object.getOwnPropertyDescriptor(t, e).enumerable;
                        });
                    }
                    r.push.apply(r, n);
                }
                return r;
            }
            function L(t) {
                for(var e = 1; e < arguments.length; e++){
                    var r = arguments[e] != null ? arguments[e] : {};
                    if (e % 2) {
                        z(Object(r), true).forEach(function(e) {
                            M()(t, e, r[e]);
                        });
                    } else if (Object.getOwnPropertyDescriptors) {
                        Object.defineProperties(t, Object.getOwnPropertyDescriptors(r));
                    } else {
                        z(Object(r)).forEach(function(e) {
                            Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(r, e));
                        });
                    }
                }
                return t;
            }
            function N(t) {
                var e = U();
                return function r() {
                    var n = C()(t), a;
                    if (e) {
                        var o = C()(this).constructor;
                        a = Reflect.construct(n, arguments, o);
                    } else {
                        a = n.apply(this, arguments);
                    }
                    return O()(this, a);
                };
            }
            function U() {
                if (typeof Reflect === "undefined" || !Reflect.construct) return false;
                if (Reflect.construct.sham) return false;
                if (typeof Proxy === "function") return true;
                try {
                    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
                    return true;
                } catch (t) {
                    return false;
                }
            }
            var W = 10;
            var B = [
                1,
                1,
                1
            ];
            var F = [
                1,
                1,
                1,
                1,
                1
            ];
            var q = [
                1,
                1,
                2
            ];
            var V = [
                [
                    3,
                    2,
                    1,
                    1
                ],
                [
                    2,
                    2,
                    2,
                    1
                ],
                [
                    2,
                    1,
                    2,
                    2
                ],
                [
                    1,
                    4,
                    1,
                    1
                ],
                [
                    1,
                    1,
                    3,
                    2
                ],
                [
                    1,
                    2,
                    3,
                    1
                ],
                [
                    1,
                    1,
                    1,
                    4
                ],
                [
                    1,
                    3,
                    1,
                    2
                ],
                [
                    1,
                    2,
                    1,
                    3
                ],
                [
                    3,
                    1,
                    1,
                    2
                ],
                [
                    1,
                    1,
                    2,
                    3
                ],
                [
                    1,
                    2,
                    2,
                    2
                ],
                [
                    2,
                    2,
                    1,
                    2
                ],
                [
                    1,
                    1,
                    4,
                    1
                ],
                [
                    2,
                    3,
                    1,
                    1
                ],
                [
                    1,
                    3,
                    2,
                    1
                ],
                [
                    4,
                    1,
                    1,
                    1
                ],
                [
                    2,
                    1,
                    3,
                    1
                ],
                [
                    3,
                    1,
                    2,
                    1
                ],
                [
                    2,
                    1,
                    1,
                    3
                ], 
            ];
            var G = [
                0,
                11,
                13,
                14,
                19,
                25,
                28,
                21,
                22,
                26
            ];
            var H = 0.48;
            var X = (function(t) {
                b()(r, t);
                var e = N(r);
                function r(t, n) {
                    var a;
                    p()(this, r);
                    a = e.call(this, u()({
                        supplements: []
                    }, t), n);
                    M()(m()(a), "FORMAT", "ean_13");
                    M()(m()(a), "SINGLE_CODE_ERROR", 0.7);
                    M()(m()(a), "STOP_PATTERN", [
                        1,
                        1,
                        1
                    ]);
                    return a;
                }
                y()(r, [
                    {
                        key: "_findPattern",
                        value: function t(e, r, n, a) {
                            var o = new Array(e.length).fill(0);
                            var i = {
                                error: Number.MAX_VALUE,
                                start: 0,
                                end: 0
                            };
                            var u = H;
                            var c = 0;
                            if (!r) {
                                r = this._nextSet(this._row);
                            }
                            var f = false;
                            for(var s = r; s < this._row.length; s++){
                                if (this._row[s] ^ (n ? 1 : 0)) {
                                    o[c] += 1;
                                } else {
                                    if (c === o.length - 1) {
                                        var l = this._matchPattern(o, e);
                                        if (l < u && i.error && l < i.error) {
                                            f = true;
                                            i.error = l;
                                            i.start = s - o.reduce(function(t, e) {
                                                return t + e;
                                            }, 0);
                                            i.end = s;
                                            return i;
                                        }
                                        if (a) {
                                            for(var v = 0; v < o.length - 2; v++){
                                                o[v] = o[v + 2];
                                            }
                                            o[o.length - 2] = 0;
                                            o[o.length - 1] = 0;
                                            c--;
                                        }
                                    } else {
                                        c++;
                                    }
                                    o[c] = 1;
                                    n = !n;
                                }
                            }
                            if (f) {} else {}
                            return f ? i : null;
                        }
                    },
                    {
                        key: "_decodeCode",
                        value: function t(e, r) {
                            var n = [
                                0,
                                0,
                                0,
                                0
                            ];
                            var a = e;
                            var o = {
                                error: Number.MAX_VALUE,
                                code: -1,
                                start: e,
                                end: e
                            };
                            var i = H;
                            var u = !this._row[a];
                            var c = 0;
                            if (!r) {
                                r = V.length;
                            }
                            var f = false;
                            for(var s = a; s < this._row.length; s++){
                                if (this._row[s] ^ (u ? 1 : 0)) {
                                    n[c]++;
                                } else {
                                    if (c === n.length - 1) {
                                        for(var l = 0; l < r; l++){
                                            var v = this._matchPattern(n, V[l]);
                                            o.end = s;
                                            if (v < o.error) {
                                                o.code = l;
                                                o.error = v;
                                            }
                                        }
                                        if (o.error > i) {
                                            return null;
                                        }
                                        return o;
                                    } else {
                                        c++;
                                    }
                                    n[c] = 1;
                                    u = !u;
                                }
                            }
                            return f ? o : null;
                        }
                    },
                    {
                        key: "_findStart",
                        value: function t() {
                            var e = this._nextSet(this._row);
                            var r = null;
                            while(!r){
                                r = this._findPattern(B, e, false, true);
                                if (!r) {
                                    return null;
                                }
                                var n = r.start - (r.end - r.start);
                                if (n >= 0) {
                                    if (this._matchRange(n, r.start, 0)) {
                                        return r;
                                    }
                                }
                                e = r.end;
                                r = null;
                            }
                            return null;
                        }
                    },
                    {
                        key: "_calculateFirstDigit",
                        value: function t(e) {
                            for(var r = 0; r < G.length; r++){
                                if (e === G[r]) {
                                    return r;
                                }
                            }
                            return null;
                        }
                    },
                    {
                        key: "_decodePayload",
                        value: function t(e, r, n) {
                            var a = L({}, e);
                            var o = 0x0;
                            for(var i = 0; i < 6; i++){
                                a = this._decodeCode(a.end);
                                if (!a) {
                                    return null;
                                }
                                if (a.code >= W) {
                                    a.code -= W;
                                    o |= 1 << (5 - i);
                                } else {
                                    o |= 0 << (5 - i);
                                }
                                r.push(a.code);
                                n.push(a);
                            }
                            var u = this._calculateFirstDigit(o);
                            if (u === null) {
                                return null;
                            }
                            r.unshift(u);
                            var c = this._findPattern(F, a.end, true, false);
                            if (c === null || !c.end) {
                                return null;
                            }
                            n.push(c);
                            for(var f = 0; f < 6; f++){
                                c = this._decodeCode(c.end, W);
                                if (!c) {
                                    return null;
                                }
                                n.push(c);
                                r.push(c.code);
                            }
                            return c;
                        }
                    },
                    {
                        key: "_verifyTrailingWhitespace",
                        value: function t(e) {
                            var r = e.end + (e.end - e.start);
                            if (r < this._row.length) {
                                if (this._matchRange(e.end, r, 0)) {
                                    return e;
                                }
                            }
                            return null;
                        }
                    },
                    {
                        key: "_findEnd",
                        value: function t(e, r) {
                            var n = this._findPattern(this.STOP_PATTERN, e, r, false);
                            return n !== null ? this._verifyTrailingWhitespace(n) : null;
                        }
                    },
                    {
                        key: "_checksum",
                        value: function t(e) {
                            var r = 0;
                            for(var n = e.length - 2; n >= 0; n -= 2){
                                r += e[n];
                            }
                            r *= 3;
                            for(var a = e.length - 1; a >= 0; a -= 2){
                                r += e[a];
                            }
                            return r % 10 === 0;
                        }
                    },
                    {
                        key: "_decodeExtensions",
                        value: function t(e) {
                            var r = this._nextSet(this._row, e);
                            var n = this._findPattern(q, r, false, false);
                            if (n === null) {
                                return null;
                            }
                            for(var a = 0; a < this.supplements.length; a++){
                                try {
                                    var o = this.supplements[a].decode(this._row, n.end);
                                    if (o !== null) {
                                        return {
                                            code: o.code,
                                            start: r,
                                            startInfo: n,
                                            end: o.end,
                                            decodedCodes: o.decodedCodes,
                                            format: this.supplements[a].FORMAT
                                        };
                                    }
                                } catch (i) {
                                    console.error("* decodeExtensions error in ", this.supplements[a], ": ", i);
                                }
                            }
                            return null;
                        }
                    },
                    {
                        key: "decode",
                        value: function t(e, r) {
                            var n = new Array();
                            var a = new Array();
                            var o = {};
                            var i = this._findStart();
                            if (!i) {
                                return null;
                            }
                            var u = {
                                start: i.start,
                                end: i.end
                            };
                            a.push(u);
                            u = this._decodePayload(u, n, a);
                            if (!u) {
                                return null;
                            }
                            u = this._findEnd(u.end, false);
                            if (!u) {
                                return null;
                            }
                            a.push(u);
                            if (!this._checksum(n)) {
                                return null;
                            }
                            if (this.supplements.length > 0) {
                                var c = this._decodeExtensions(u.end);
                                if (!c) {
                                    return null;
                                }
                                if (!c.decodedCodes) {
                                    return null;
                                }
                                var f = c.decodedCodes[c.decodedCodes.length - 1];
                                var s = {
                                    start: f.start + (((f.end - f.start) / 2) | 0),
                                    end: f.end
                                };
                                if (!this._verifyTrailingWhitespace(s)) {
                                    return null;
                                }
                                o = {
                                    supplement: c,
                                    code: n.join("") + c.code
                                };
                            }
                            return L(L({
                                code: n.join(""),
                                start: i.start,
                                end: u.end,
                                startInfo: i,
                                decodedCodes: a
                            }, o), {}, {
                                format: this.FORMAT
                            });
                        }
                    }, 
                ]);
                return r;
            })(P);
            var Q = X;
            var Y = r(33);
            var Z = r.n(Y);
            function $(t) {
                var e = J();
                return function r() {
                    var n = C()(t), a;
                    if (e) {
                        var o = C()(this).constructor;
                        a = Reflect.construct(n, arguments, o);
                    } else {
                        a = n.apply(this, arguments);
                    }
                    return O()(this, a);
                };
            }
            function J() {
                if (typeof Reflect === "undefined" || !Reflect.construct) return false;
                if (Reflect.construct.sham) return false;
                if (typeof Proxy === "function") return true;
                try {
                    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
                    return true;
                } catch (t) {
                    return false;
                }
            }
            var K = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. *$/+%";
            var tt = new Uint16Array(Z()(K).map(function(t) {
                return t.charCodeAt(0);
            }));
            var te = new Uint16Array([
                0x034,
                0x121,
                0x061,
                0x160,
                0x031,
                0x130,
                0x070,
                0x025,
                0x124,
                0x064,
                0x109,
                0x049,
                0x148,
                0x019,
                0x118,
                0x058,
                0x00d,
                0x10c,
                0x04c,
                0x01c,
                0x103,
                0x043,
                0x142,
                0x013,
                0x112,
                0x052,
                0x007,
                0x106,
                0x046,
                0x016,
                0x181,
                0x0c1,
                0x1c0,
                0x091,
                0x190,
                0x0d0,
                0x085,
                0x184,
                0x0c4,
                0x094,
                0x0a8,
                0x0a2,
                0x08a,
                0x02a, 
            ]);
            var tr = 0x094;
            var tn = (function(t) {
                b()(r, t);
                var e = $(r);
                function r() {
                    var t;
                    p()(this, r);
                    for(var n = arguments.length, a = new Array(n), o = 0; o < n; o++){
                        a[o] = arguments[o];
                    }
                    t = e.call.apply(e, [
                        this
                    ].concat(a));
                    M()(m()(t), "FORMAT", "code_39");
                    return t;
                }
                y()(r, [
                    {
                        key: "_findStart",
                        value: function t() {
                            var e = this._nextSet(this._row);
                            var r = e;
                            var n = new Uint16Array([
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0, 
                            ]);
                            var a = 0;
                            var o = false;
                            for(var i = e; i < this._row.length; i++){
                                if (this._row[i] ^ (o ? 1 : 0)) {
                                    n[a]++;
                                } else {
                                    if (a === n.length - 1) {
                                        if (this._toPattern(n) === tr) {
                                            var u = Math.floor(Math.max(0, r - (i - r) / 4));
                                            if (this._matchRange(u, r, 0)) {
                                                return {
                                                    start: r,
                                                    end: i
                                                };
                                            }
                                        }
                                        r += n[0] + n[1];
                                        for(var c = 0; c < 7; c++){
                                            n[c] = n[c + 2];
                                        }
                                        n[7] = 0;
                                        n[8] = 0;
                                        a--;
                                    } else {
                                        a++;
                                    }
                                    n[a] = 1;
                                    o = !o;
                                }
                            }
                            return null;
                        }
                    },
                    {
                        key: "_toPattern",
                        value: function t(e) {
                            var r = e.length;
                            var n = 0;
                            var a = r;
                            var o = 0;
                            while(a > 3){
                                n = this._findNextWidth(e, n);
                                a = 0;
                                var i = 0;
                                for(var u = 0; u < r; u++){
                                    if (e[u] > n) {
                                        i |= 1 << (r - 1 - u);
                                        a++;
                                        o += e[u];
                                    }
                                }
                                if (a === 3) {
                                    for(var c = 0; c < r && a > 0; c++){
                                        if (e[c] > n) {
                                            a--;
                                            if (e[c] * 2 >= o) {
                                                return -1;
                                            }
                                        }
                                    }
                                    return i;
                                }
                            }
                            return -1;
                        }
                    },
                    {
                        key: "_findNextWidth",
                        value: function t(e, r) {
                            var n = Number.MAX_VALUE;
                            for(var a = 0; a < e.length; a++){
                                if (e[a] < n && e[a] > r) {
                                    n = e[a];
                                }
                            }
                            return n;
                        }
                    },
                    {
                        key: "_patternToChar",
                        value: function t(e) {
                            for(var r = 0; r < te.length; r++){
                                if (te[r] === e) {
                                    return String.fromCharCode(tt[r]);
                                }
                            }
                            return null;
                        }
                    },
                    {
                        key: "_verifyTrailingWhitespace",
                        value: function t(e, r, n) {
                            var a = S["a"].sum(n);
                            var o = r - e - a;
                            if (o * 3 >= a) {
                                return true;
                            }
                            return false;
                        }
                    },
                    {
                        key: "decode",
                        value: function t(e, r) {
                            var n = new Uint16Array([
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0, 
                            ]);
                            var a = [];
                            r = this._findStart();
                            if (!r) {
                                return null;
                            }
                            var o = this._nextSet(this._row, r.end);
                            var i;
                            var u;
                            do {
                                n = this._toCounters(o, n);
                                var c = this._toPattern(n);
                                if (c < 0) {
                                    return null;
                                }
                                i = this._patternToChar(c);
                                if (i === null) {
                                    return null;
                                }
                                a.push(i);
                                u = o;
                                o += S["a"].sum(n);
                                o = this._nextSet(this._row, o);
                            }while (i !== "*")
                            a.pop();
                            if (!a.length) {
                                return null;
                            }
                            if (!this._verifyTrailingWhitespace(u, o, n)) {
                                return null;
                            }
                            return {
                                code: a.join(""),
                                start: r.start,
                                end: o,
                                startInfo: r,
                                decodedCodes: a,
                                format: this.FORMAT
                            };
                        }
                    }, 
                ]);
                return r;
            })(P);
            var ta = tn;
            var to = r(13);
            var ti = r.n(to);
            function tu(t) {
                var e = tc();
                return function r() {
                    var n = C()(t), a;
                    if (e) {
                        var o = C()(this).constructor;
                        a = Reflect.construct(n, arguments, o);
                    } else {
                        a = n.apply(this, arguments);
                    }
                    return O()(this, a);
                };
            }
            function tc() {
                if (typeof Reflect === "undefined" || !Reflect.construct) return false;
                if (Reflect.construct.sham) return false;
                if (typeof Proxy === "function") return true;
                try {
                    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
                    return true;
                } catch (t) {
                    return false;
                }
            }
            var tf = {
                IOQ: /[IOQ]/g,
                AZ09: /[A-Z0-9]{17}/
            };
            var ts = (function(t) {
                b()(r, t);
                var e = tu(r);
                function r() {
                    var t;
                    p()(this, r);
                    for(var n = arguments.length, a = new Array(n), o = 0; o < n; o++){
                        a[o] = arguments[o];
                    }
                    t = e.call.apply(e, [
                        this
                    ].concat(a));
                    M()(m()(t), "FORMAT", "code_39_vin");
                    return t;
                }
                y()(r, [
                    {
                        key: "_checkChecksum",
                        value: function t(e) {
                            return !!e;
                        }
                    },
                    {
                        key: "decode",
                        value: function t(e, n) {
                            var a = ti()(C()(r.prototype), "decode", this).call(this, e, n);
                            if (!a) {
                                return null;
                            }
                            var o = a.code;
                            if (!o) {
                                return null;
                            }
                            o = o.replace(tf.IOQ, "");
                            if (!o.match(tf.AZ09)) {
                                if (true) {
                                    console.log("Failed AZ09 pattern code:", o);
                                }
                                return null;
                            }
                            if (!this._checkChecksum(o)) {
                                return null;
                            }
                            a.code = o;
                            return a;
                        }
                    }, 
                ]);
                return r;
            })(ta);
            var tl = ts;
            function tv(t) {
                var e = th();
                return function r() {
                    var n = C()(t), a;
                    if (e) {
                        var o = C()(this).constructor;
                        a = Reflect.construct(n, arguments, o);
                    } else {
                        a = n.apply(this, arguments);
                    }
                    return O()(this, a);
                };
            }
            function th() {
                if (typeof Reflect === "undefined" || !Reflect.construct) return false;
                if (Reflect.construct.sham) return false;
                if (typeof Proxy === "function") return true;
                try {
                    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
                    return true;
                } catch (t) {
                    return false;
                }
            }
            var td = [
                48,
                49,
                50,
                51,
                52,
                53,
                54,
                55,
                56,
                57,
                45,
                36,
                58,
                47,
                46,
                43,
                65,
                66,
                67,
                68, 
            ];
            var tp = [
                0x003,
                0x006,
                0x009,
                0x060,
                0x012,
                0x042,
                0x021,
                0x024,
                0x030,
                0x048,
                0x00c,
                0x018,
                0x045,
                0x051,
                0x054,
                0x015,
                0x01a,
                0x029,
                0x00b,
                0x00e, 
            ];
            var tg = [
                0x01a,
                0x029,
                0x00b,
                0x00e
            ];
            var ty = 4;
            var tx = 2.0;
            var tm = 1.5;
            var t_ = (function(t) {
                b()(r, t);
                var e = tv(r);
                function r() {
                    var t;
                    p()(this, r);
                    for(var n = arguments.length, a = new Array(n), o = 0; o < n; o++){
                        a[o] = arguments[o];
                    }
                    t = e.call.apply(e, [
                        this
                    ].concat(a));
                    M()(m()(t), "_counters", []);
                    M()(m()(t), "FORMAT", "codabar");
                    return t;
                }
                y()(r, [
                    {
                        key: "_computeAlternatingThreshold",
                        value: function t(e, r) {
                            var n = Number.MAX_VALUE;
                            var a = 0;
                            var o = 0;
                            for(var i = e; i < r; i += 2){
                                o = this._counters[i];
                                if (o > a) {
                                    a = o;
                                }
                                if (o < n) {
                                    n = o;
                                }
                            }
                            return ((n + a) / 2.0) | 0;
                        }
                    },
                    {
                        key: "_toPattern",
                        value: function t(e) {
                            var r = 7;
                            var n = e + r;
                            if (n > this._counters.length) {
                                return -1;
                            }
                            var a = this._computeAlternatingThreshold(e, n);
                            var o = this._computeAlternatingThreshold(e + 1, n);
                            var i = 1 << (r - 1);
                            var u = 0;
                            var c = 0;
                            for(var f = 0; f < r; f++){
                                u = (f & 1) === 0 ? a : o;
                                if (this._counters[e + f] > u) {
                                    c |= i;
                                }
                                i >>= 1;
                            }
                            return c;
                        }
                    },
                    {
                        key: "_isStartEnd",
                        value: function t(e) {
                            for(var r = 0; r < tg.length; r++){
                                if (tg[r] === e) {
                                    return true;
                                }
                            }
                            return false;
                        }
                    },
                    {
                        key: "_sumCounters",
                        value: function t(e, r) {
                            var n = 0;
                            for(var a = e; a < r; a++){
                                n += this._counters[a];
                            }
                            return n;
                        }
                    },
                    {
                        key: "_findStart",
                        value: function t() {
                            var e = this._nextUnset(this._row);
                            var r = e;
                            for(var n = 1; n < this._counters.length; n++){
                                var a = this._toPattern(n);
                                if (a !== -1 && this._isStartEnd(a)) {
                                    e += this._sumCounters(0, n);
                                    r = e + this._sumCounters(n, n + 8);
                                    return {
                                        start: e,
                                        end: r,
                                        startCounter: n,
                                        endCounter: n + 8
                                    };
                                }
                            }
                            return null;
                        }
                    },
                    {
                        key: "_patternToChar",
                        value: function t(e) {
                            for(var r = 0; r < tp.length; r++){
                                if (tp[r] === e) {
                                    return String.fromCharCode(td[r]);
                                }
                            }
                            return null;
                        }
                    },
                    {
                        key: "_calculatePatternLength",
                        value: function t(e) {
                            var r = 0;
                            for(var n = e; n < e + 7; n++){
                                r += this._counters[n];
                            }
                            return r;
                        }
                    },
                    {
                        key: "_verifyWhitespace",
                        value: function t(e, r) {
                            if (e - 1 <= 0 || this._counters[e - 1] >= this._calculatePatternLength(e) / 2.0) {
                                if (r + 8 >= this._counters.length || this._counters[r + 7] >= this._calculatePatternLength(r) / 2.0) {
                                    return true;
                                }
                            }
                            return false;
                        }
                    },
                    {
                        key: "_charToPattern",
                        value: function t(e) {
                            var r = e.charCodeAt(0);
                            for(var n = 0; n < td.length; n++){
                                if (td[n] === r) {
                                    return tp[n];
                                }
                            }
                            return 0x0;
                        }
                    },
                    {
                        key: "_thresholdResultPattern",
                        value: function t(e, r) {
                            var n = {
                                space: {
                                    narrow: {
                                        size: 0,
                                        counts: 0,
                                        min: 0,
                                        max: Number.MAX_VALUE
                                    },
                                    wide: {
                                        size: 0,
                                        counts: 0,
                                        min: 0,
                                        max: Number.MAX_VALUE
                                    }
                                },
                                bar: {
                                    narrow: {
                                        size: 0,
                                        counts: 0,
                                        min: 0,
                                        max: Number.MAX_VALUE
                                    },
                                    wide: {
                                        size: 0,
                                        counts: 0,
                                        min: 0,
                                        max: Number.MAX_VALUE
                                    }
                                }
                            };
                            var a = r;
                            var o;
                            for(var i = 0; i < e.length; i++){
                                o = this._charToPattern(e[i]);
                                for(var u = 6; u >= 0; u--){
                                    var c = (u & 1) === 2 ? n.bar : n.space;
                                    var f = (o & 1) === 1 ? c.wide : c.narrow;
                                    f.size += this._counters[a + u];
                                    f.counts++;
                                    o >>= 1;
                                }
                                a += 8;
                            }
                            [
                                "space",
                                "bar"
                            ].forEach(function(t) {
                                var e = n[t];
                                e.wide.min = Math.floor((e.narrow.size / e.narrow.counts + e.wide.size / e.wide.counts) / 2);
                                e.narrow.max = Math.ceil(e.wide.min);
                                e.wide.max = Math.ceil((e.wide.size * tx + tm) / e.wide.counts);
                            });
                            return n;
                        }
                    },
                    {
                        key: "_validateResult",
                        value: function t(e, r) {
                            var n = this._thresholdResultPattern(e, r);
                            var a = r;
                            var o;
                            for(var i = 0; i < e.length; i++){
                                o = this._charToPattern(e[i]);
                                for(var u = 6; u >= 0; u--){
                                    var c = (u & 1) === 0 ? n.bar : n.space;
                                    var f = (o & 1) === 1 ? c.wide : c.narrow;
                                    var s = this._counters[a + u];
                                    if (s < f.min || s > f.max) {
                                        return false;
                                    }
                                    o >>= 1;
                                }
                                a += 8;
                            }
                            return true;
                        }
                    },
                    {
                        key: "decode",
                        value: function t(e, r) {
                            this._counters = this._fillCounters();
                            r = this._findStart();
                            if (!r) {
                                return null;
                            }
                            var n = r.startCounter;
                            var a = [];
                            var o;
                            do {
                                o = this._toPattern(n);
                                if (o < 0) {
                                    return null;
                                }
                                var i = this._patternToChar(o);
                                if (i === null) {
                                    return null;
                                }
                                a.push(i);
                                n += 8;
                                if (a.length > 1 && this._isStartEnd(o)) {
                                    break;
                                }
                            }while (n < this._counters.length)
                            if (a.length - 2 < ty || !this._isStartEnd(o)) {
                                return null;
                            }
                            if (!this._verifyWhitespace(r.startCounter, n - 8)) {
                                return null;
                            }
                            if (!this._validateResult(a, r.startCounter)) {
                                return null;
                            }
                            n = n > this._counters.length ? this._counters.length : n;
                            var u = r.start + this._sumCounters(r.startCounter, n - 8);
                            return {
                                code: a.join(""),
                                start: r.start,
                                end: u,
                                startInfo: r,
                                decodedCodes: a,
                                format: this.FORMAT
                            };
                        }
                    }, 
                ]);
                return r;
            })(P);
            var tb = t_;
            function tw(t) {
                var e = tO();
                return function r() {
                    var n = C()(t), a;
                    if (e) {
                        var o = C()(this).constructor;
                        a = Reflect.construct(n, arguments, o);
                    } else {
                        a = n.apply(this, arguments);
                    }
                    return O()(this, a);
                };
            }
            function tO() {
                if (typeof Reflect === "undefined" || !Reflect.construct) return false;
                if (Reflect.construct.sham) return false;
                if (typeof Proxy === "function") return true;
                try {
                    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
                    return true;
                } catch (t) {
                    return false;
                }
            }
            var tR = (function(t) {
                b()(r, t);
                var e = tw(r);
                function r() {
                    var t;
                    p()(this, r);
                    for(var n = arguments.length, a = new Array(n), o = 0; o < n; o++){
                        a[o] = arguments[o];
                    }
                    t = e.call.apply(e, [
                        this
                    ].concat(a));
                    M()(m()(t), "FORMAT", "upc_a");
                    return t;
                }
                y()(r, [
                    {
                        key: "decode",
                        value: function t(e, r) {
                            var n = Q.prototype.decode.call(this);
                            if (n && n.code && n.code.length === 13 && n.code.charAt(0) === "0") {
                                n.code = n.code.substring(1);
                                return n;
                            }
                            return null;
                        }
                    }, 
                ]);
                return r;
            })(Q);
            var tC = tR;
            function tE(t) {
                var e = tM();
                return function r() {
                    var n = C()(t), a;
                    if (e) {
                        var o = C()(this).constructor;
                        a = Reflect.construct(n, arguments, o);
                    } else {
                        a = n.apply(this, arguments);
                    }
                    return O()(this, a);
                };
            }
            function tM() {
                if (typeof Reflect === "undefined" || !Reflect.construct) return false;
                if (Reflect.construct.sham) return false;
                if (typeof Proxy === "function") return true;
                try {
                    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
                    return true;
                } catch (t) {
                    return false;
                }
            }
            var tS = (function(t) {
                b()(r, t);
                var e = tE(r);
                function r() {
                    var t;
                    p()(this, r);
                    for(var n = arguments.length, a = new Array(n), o = 0; o < n; o++){
                        a[o] = arguments[o];
                    }
                    t = e.call.apply(e, [
                        this
                    ].concat(a));
                    M()(m()(t), "FORMAT", "ean_8");
                    return t;
                }
                y()(r, [
                    {
                        key: "_decodePayload",
                        value: function t(e, r, n) {
                            var a = e;
                            for(var o = 0; o < 4; o++){
                                a = this._decodeCode(a.end, W);
                                if (!a) {
                                    return null;
                                }
                                r.push(a.code);
                                n.push(a);
                            }
                            a = this._findPattern(F, a.end, true, false);
                            if (a === null) {
                                return null;
                            }
                            n.push(a);
                            for(var i = 0; i < 4; i++){
                                a = this._decodeCode(a.end, W);
                                if (!a) {
                                    return null;
                                }
                                n.push(a);
                                r.push(a.code);
                            }
                            return a;
                        }
                    }, 
                ]);
                return r;
            })(Q);
            var tA = tS;
            function tk(t) {
                var e = tP();
                return function r() {
                    var n = C()(t), a;
                    if (e) {
                        var o = C()(this).constructor;
                        a = Reflect.construct(n, arguments, o);
                    } else {
                        a = n.apply(this, arguments);
                    }
                    return O()(this, a);
                };
            }
            function tP() {
                if (typeof Reflect === "undefined" || !Reflect.construct) return false;
                if (Reflect.construct.sham) return false;
                if (typeof Proxy === "function") return true;
                try {
                    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
                    return true;
                } catch (t) {
                    return false;
                }
            }
            var tD = (function(t) {
                b()(r, t);
                var e = tk(r);
                function r() {
                    var t;
                    p()(this, r);
                    for(var n = arguments.length, a = new Array(n), o = 0; o < n; o++){
                        a[o] = arguments[o];
                    }
                    t = e.call.apply(e, [
                        this
                    ].concat(a));
                    M()(m()(t), "FORMAT", "ean_2");
                    return t;
                }
                y()(r, [
                    {
                        key: "decode",
                        value: function t(e, r) {
                            if (e) {
                                this._row = e;
                            }
                            var n = 0;
                            var a = r;
                            var o = this._row.length;
                            var i = [];
                            var u = [];
                            var c = null;
                            if (a === undefined) {
                                return null;
                            }
                            for(var f = 0; f < 2 && a < o; f++){
                                c = this._decodeCode(a);
                                if (!c) {
                                    return null;
                                }
                                u.push(c);
                                i.push(c.code % 10);
                                if (c.code >= W) {
                                    n |= 1 << (1 - f);
                                }
                                if (f !== 1) {
                                    a = this._nextSet(this._row, c.end);
                                    a = this._nextUnset(this._row, a);
                                }
                            }
                            if (i.length !== 2 || parseInt(i.join("")) % 4 !== n) {
                                return null;
                            }
                            var s = this._findStart();
                            return {
                                code: i.join(""),
                                decodedCodes: u,
                                end: c.end,
                                format: this.FORMAT,
                                startInfo: s,
                                start: s.start
                            };
                        }
                    }, 
                ]);
                return r;
            })(Q);
            var tT = tD;
            function tj(t) {
                var e = tI();
                return function r() {
                    var n = C()(t), a;
                    if (e) {
                        var o = C()(this).constructor;
                        a = Reflect.construct(n, arguments, o);
                    } else {
                        a = n.apply(this, arguments);
                    }
                    return O()(this, a);
                };
            }
            function tI() {
                if (typeof Reflect === "undefined" || !Reflect.construct) return false;
                if (Reflect.construct.sham) return false;
                if (typeof Proxy === "function") return true;
                try {
                    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
                    return true;
                } catch (t) {
                    return false;
                }
            }
            var tz = [
                24,
                20,
                18,
                17,
                12,
                6,
                3,
                10,
                9,
                5, 
            ];
            function tL(t) {
                for(var e = 0; e < 10; e++){
                    if (t === tz[e]) {
                        return e;
                    }
                }
                return null;
            }
            function tN(t) {
                var e = t.length;
                var r = 0;
                for(var n = e - 2; n >= 0; n -= 2){
                    r += t[n];
                }
                r *= 3;
                for(var a = e - 1; a >= 0; a -= 2){
                    r += t[a];
                }
                r *= 3;
                return r % 10;
            }
            var tU = (function(t) {
                b()(r, t);
                var e = tj(r);
                function r() {
                    var t;
                    p()(this, r);
                    for(var n = arguments.length, a = new Array(n), o = 0; o < n; o++){
                        a[o] = arguments[o];
                    }
                    t = e.call.apply(e, [
                        this
                    ].concat(a));
                    M()(m()(t), "FORMAT", "ean_5");
                    return t;
                }
                y()(r, [
                    {
                        key: "decode",
                        value: function t(e, r) {
                            if (r === undefined) {
                                return null;
                            }
                            if (e) {
                                this._row = e;
                            }
                            var n = 0;
                            var a = r;
                            var o = this._row.length;
                            var i = null;
                            var u = [];
                            var c = [];
                            for(var f = 0; f < 5 && a < o; f++){
                                i = this._decodeCode(a);
                                if (!i) {
                                    return null;
                                }
                                c.push(i);
                                u.push(i.code % 10);
                                if (i.code >= W) {
                                    n |= 1 << (4 - f);
                                }
                                if (f !== 4) {
                                    a = this._nextSet(this._row, i.end);
                                    a = this._nextUnset(this._row, a);
                                }
                            }
                            if (u.length !== 5) {
                                return null;
                            }
                            if (tN(u) !== tL(n)) {
                                return null;
                            }
                            var s = this._findStart();
                            return {
                                code: u.join(""),
                                decodedCodes: c,
                                end: i.end,
                                format: this.FORMAT,
                                startInfo: s,
                                start: s.start
                            };
                        }
                    }, 
                ]);
                return r;
            })(Q);
            var tW = tU;
            function tB(t, e) {
                var r = Object.keys(t);
                if (Object.getOwnPropertySymbols) {
                    var n = Object.getOwnPropertySymbols(t);
                    if (e) {
                        n = n.filter(function(e) {
                            return Object.getOwnPropertyDescriptor(t, e).enumerable;
                        });
                    }
                    r.push.apply(r, n);
                }
                return r;
            }
            function tF(t) {
                for(var e = 1; e < arguments.length; e++){
                    var r = arguments[e] != null ? arguments[e] : {};
                    if (e % 2) {
                        tB(Object(r), true).forEach(function(e) {
                            M()(t, e, r[e]);
                        });
                    } else if (Object.getOwnPropertyDescriptors) {
                        Object.defineProperties(t, Object.getOwnPropertyDescriptors(r));
                    } else {
                        tB(Object(r)).forEach(function(e) {
                            Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(r, e));
                        });
                    }
                }
                return t;
            }
            function tq(t) {
                var e = tV();
                return function r() {
                    var n = C()(t), a;
                    if (e) {
                        var o = C()(this).constructor;
                        a = Reflect.construct(n, arguments, o);
                    } else {
                        a = n.apply(this, arguments);
                    }
                    return O()(this, a);
                };
            }
            function tV() {
                if (typeof Reflect === "undefined" || !Reflect.construct) return false;
                if (Reflect.construct.sham) return false;
                if (typeof Proxy === "function") return true;
                try {
                    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
                    return true;
                } catch (t) {
                    return false;
                }
            }
            var tG = (function(t) {
                b()(r, t);
                var e = tq(r);
                function r() {
                    var t;
                    p()(this, r);
                    for(var n = arguments.length, a = new Array(n), o = 0; o < n; o++){
                        a[o] = arguments[o];
                    }
                    t = e.call.apply(e, [
                        this
                    ].concat(a));
                    M()(m()(t), "CODE_FREQUENCY", [
                        [
                            56,
                            52,
                            50,
                            49,
                            44,
                            38,
                            35,
                            42,
                            41,
                            37
                        ],
                        [
                            7,
                            11,
                            13,
                            14,
                            19,
                            25,
                            28,
                            21,
                            22,
                            26
                        ], 
                    ]);
                    M()(m()(t), "STOP_PATTERN", [
                        (1 / 6) * 7,
                        (1 / 6) * 7,
                        (1 / 6) * 7,
                        (1 / 6) * 7,
                        (1 / 6) * 7,
                        (1 / 6) * 7, 
                    ]);
                    M()(m()(t), "FORMAT", "upc_e");
                    return t;
                }
                y()(r, [
                    {
                        key: "_decodePayload",
                        value: function t(e, r, n) {
                            var a = tF({}, e);
                            var o = 0x0;
                            for(var i = 0; i < 6; i++){
                                a = this._decodeCode(a.end);
                                if (!a) {
                                    return null;
                                }
                                if (a.code >= W) {
                                    a.code = a.code - W;
                                    o |= 1 << (5 - i);
                                }
                                r.push(a.code);
                                n.push(a);
                            }
                            if (!this._determineParity(o, r)) {
                                return null;
                            }
                            return a;
                        }
                    },
                    {
                        key: "_determineParity",
                        value: function t(e, r) {
                            for(var n = 0; n < this.CODE_FREQUENCY.length; n++){
                                for(var a = 0; a < this.CODE_FREQUENCY[n].length; a++){
                                    if (e === this.CODE_FREQUENCY[n][a]) {
                                        r.unshift(n);
                                        r.push(a);
                                        return true;
                                    }
                                }
                            }
                            return false;
                        }
                    },
                    {
                        key: "_convertToUPCA",
                        value: function t(e) {
                            var r = [
                                e[0]
                            ];
                            var n = e[e.length - 2];
                            if (n <= 2) {
                                r = r.concat(e.slice(1, 3)).concat([
                                    n,
                                    0,
                                    0,
                                    0,
                                    0
                                ]).concat(e.slice(3, 6));
                            } else if (n === 3) {
                                r = r.concat(e.slice(1, 4)).concat([
                                    0,
                                    0,
                                    0,
                                    0,
                                    0
                                ]).concat(e.slice(4, 6));
                            } else if (n === 4) {
                                r = r.concat(e.slice(1, 5)).concat([
                                    0,
                                    0,
                                    0,
                                    0,
                                    0,
                                    e[5]
                                ]);
                            } else {
                                r = r.concat(e.slice(1, 6)).concat([
                                    0,
                                    0,
                                    0,
                                    0,
                                    n
                                ]);
                            }
                            r.push(e[e.length - 1]);
                            return r;
                        }
                    },
                    {
                        key: "_checksum",
                        value: function t(e) {
                            return ti()(C()(r.prototype), "_checksum", this).call(this, this._convertToUPCA(e));
                        }
                    },
                    {
                        key: "_findEnd",
                        value: function t(e, n) {
                            return ti()(C()(r.prototype), "_findEnd", this).call(this, e, true);
                        }
                    },
                    {
                        key: "_verifyTrailingWhitespace",
                        value: function t(e) {
                            var r = e.end + (e.end - e.start) / 2;
                            if (r < this._row.length) {
                                if (this._matchRange(e.end, r, 0)) {
                                    return e;
                                }
                            }
                            return null;
                        }
                    }, 
                ]);
                return r;
            })(Q);
            var tH = tG;
            function tX(t) {
                var e = tQ();
                return function r() {
                    var n = C()(t), a;
                    if (e) {
                        var o = C()(this).constructor;
                        a = Reflect.construct(n, arguments, o);
                    } else {
                        a = n.apply(this, arguments);
                    }
                    return O()(this, a);
                };
            }
            function tQ() {
                if (typeof Reflect === "undefined" || !Reflect.construct) return false;
                if (Reflect.construct.sham) return false;
                if (typeof Proxy === "function") return true;
                try {
                    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
                    return true;
                } catch (t) {
                    return false;
                }
            }
            var tY = 1;
            var tZ = 3;
            var t$ = (function(t) {
                b()(r, t);
                var e = tX(r);
                function r(t) {
                    var n;
                    p()(this, r);
                    n = e.call(this, u()({
                        normalizeBarSpaceWidth: false
                    }, t));
                    M()(m()(n), "barSpaceRatio", [
                        1,
                        1
                    ]);
                    M()(m()(n), "SINGLE_CODE_ERROR", 0.78);
                    M()(m()(n), "AVG_CODE_ERROR", 0.38);
                    M()(m()(n), "START_PATTERN", [
                        tY,
                        tY,
                        tY,
                        tY
                    ]);
                    M()(m()(n), "STOP_PATTERN", [
                        tY,
                        tY,
                        tZ
                    ]);
                    M()(m()(n), "CODE_PATTERN", [
                        [
                            tY,
                            tY,
                            tZ,
                            tZ,
                            tY
                        ],
                        [
                            tZ,
                            tY,
                            tY,
                            tY,
                            tZ
                        ],
                        [
                            tY,
                            tZ,
                            tY,
                            tY,
                            tZ
                        ],
                        [
                            tZ,
                            tZ,
                            tY,
                            tY,
                            tY
                        ],
                        [
                            tY,
                            tY,
                            tZ,
                            tY,
                            tZ
                        ],
                        [
                            tZ,
                            tY,
                            tZ,
                            tY,
                            tY
                        ],
                        [
                            tY,
                            tZ,
                            tZ,
                            tY,
                            tY
                        ],
                        [
                            tY,
                            tY,
                            tY,
                            tZ,
                            tZ
                        ],
                        [
                            tZ,
                            tY,
                            tY,
                            tZ,
                            tY
                        ],
                        [
                            tY,
                            tZ,
                            tY,
                            tZ,
                            tY
                        ], 
                    ]);
                    M()(m()(n), "MAX_CORRECTION_FACTOR", 5);
                    M()(m()(n), "FORMAT", "i2of5");
                    if (t.normalizeBarSpaceWidth) {
                        n.SINGLE_CODE_ERROR = 0.38;
                        n.AVG_CODE_ERROR = 0.09;
                    }
                    n.config = t;
                    return O()(n, m()(n));
                }
                y()(r, [
                    {
                        key: "_matchPattern",
                        value: function t(e, n) {
                            if (this.config.normalizeBarSpaceWidth) {
                                var a = [
                                    0,
                                    0
                                ];
                                var o = [
                                    0,
                                    0
                                ];
                                var i = [
                                    0,
                                    0
                                ];
                                var u = this.MAX_CORRECTION_FACTOR;
                                var c = 1 / u;
                                for(var f = 0; f < e.length; f++){
                                    a[f % 2] += e[f];
                                    o[f % 2] += n[f];
                                }
                                i[0] = o[0] / a[0];
                                i[1] = o[1] / a[1];
                                i[0] = Math.max(Math.min(i[0], u), c);
                                i[1] = Math.max(Math.min(i[1], u), c);
                                this.barSpaceRatio = i;
                                for(var s = 0; s < e.length; s++){
                                    e[s] *= this.barSpaceRatio[s % 2];
                                }
                            }
                            return ti()(C()(r.prototype), "_matchPattern", this).call(this, e, n);
                        }
                    },
                    {
                        key: "_findPattern",
                        value: function t(e, r) {
                            var n = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
                            var a = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
                            var o = new Array(e.length).fill(0);
                            var i = 0;
                            var u = {
                                error: Number.MAX_VALUE,
                                start: 0,
                                end: 0
                            };
                            var c = this.AVG_CODE_ERROR;
                            n = n || false;
                            a = a || false;
                            if (!r) {
                                r = this._nextSet(this._row);
                            }
                            for(var f = r; f < this._row.length; f++){
                                if (this._row[f] ^ (n ? 1 : 0)) {
                                    o[i]++;
                                } else {
                                    if (i === o.length - 1) {
                                        var s = o.reduce(function(t, e) {
                                            return t + e;
                                        }, 0);
                                        var l = this._matchPattern(o, e);
                                        if (l < c) {
                                            u.error = l;
                                            u.start = f - s;
                                            u.end = f;
                                            return u;
                                        }
                                        if (a) {
                                            for(var v = 0; v < o.length - 2; v++){
                                                o[v] = o[v + 2];
                                            }
                                            o[o.length - 2] = 0;
                                            o[o.length - 1] = 0;
                                            i--;
                                        } else {
                                            return null;
                                        }
                                    } else {
                                        i++;
                                    }
                                    o[i] = 1;
                                    n = !n;
                                }
                            }
                            return null;
                        }
                    },
                    {
                        key: "_findStart",
                        value: function t() {
                            var e = 0;
                            var r = this._nextSet(this._row);
                            var n = null;
                            var a = 1;
                            while(!n){
                                n = this._findPattern(this.START_PATTERN, r, false, true);
                                if (!n) {
                                    return null;
                                }
                                a = Math.floor((n.end - n.start) / 4);
                                e = n.start - a * 10;
                                if (e >= 0) {
                                    if (this._matchRange(e, n.start, 0)) {
                                        return n;
                                    }
                                }
                                r = n.end;
                                n = null;
                            }
                            return null;
                        }
                    },
                    {
                        key: "_verifyTrailingWhitespace",
                        value: function t(e) {
                            var r = e.end + (e.end - e.start) / 2;
                            if (r < this._row.length) {
                                if (this._matchRange(e.end, r, 0)) {
                                    return e;
                                }
                            }
                            return null;
                        }
                    },
                    {
                        key: "_findEnd",
                        value: function t() {
                            this._row.reverse();
                            var e = this._findPattern(this.STOP_PATTERN);
                            this._row.reverse();
                            if (e === null) {
                                return null;
                            }
                            var r = e.start;
                            e.start = this._row.length - e.end;
                            e.end = this._row.length - r;
                            return e !== null ? this._verifyTrailingWhitespace(e) : null;
                        }
                    },
                    {
                        key: "_decodePair",
                        value: function t(e) {
                            var r = [];
                            for(var n = 0; n < e.length; n++){
                                var a = this._decodeCode(e[n]);
                                if (!a) {
                                    return null;
                                }
                                r.push(a);
                            }
                            return r;
                        }
                    },
                    {
                        key: "_decodeCode",
                        value: function t(e) {
                            var r = this.AVG_CODE_ERROR;
                            var n = {
                                error: Number.MAX_VALUE,
                                code: -1,
                                start: 0,
                                end: 0
                            };
                            for(var a = 0; a < this.CODE_PATTERN.length; a++){
                                var o = this._matchPattern(e, this.CODE_PATTERN[a]);
                                if (o < n.error) {
                                    n.code = a;
                                    n.error = o;
                                }
                            }
                            if (n.error < r) {
                                return n;
                            }
                            return null;
                        }
                    },
                    {
                        key: "_decodePayload",
                        value: function t(e, r, n) {
                            var a = 0;
                            var o = e.length;
                            var i = [
                                [
                                    0,
                                    0,
                                    0,
                                    0,
                                    0
                                ],
                                [
                                    0,
                                    0,
                                    0,
                                    0,
                                    0
                                ], 
                            ];
                            var u = null;
                            while(a < o){
                                for(var c = 0; c < 5; c++){
                                    i[0][c] = e[a] * this.barSpaceRatio[0];
                                    i[1][c] = e[a + 1] * this.barSpaceRatio[1];
                                    a += 2;
                                }
                                u = this._decodePair(i);
                                if (!u) {
                                    return null;
                                }
                                for(var f = 0; f < u.length; f++){
                                    r.push(u[f].code + "");
                                    n.push(u[f]);
                                }
                            }
                            return u;
                        }
                    },
                    {
                        key: "_verifyCounterLength",
                        value: function t(e) {
                            return e.length % 10 === 0;
                        }
                    },
                    {
                        key: "decode",
                        value: function t(e, r) {
                            var n = new Array();
                            var a = new Array();
                            var o = this._findStart();
                            if (!o) {
                                return null;
                            }
                            a.push(o);
                            var i = this._findEnd();
                            if (!i) {
                                return null;
                            }
                            var u = this._fillCounters(o.end, i.start, false);
                            if (!this._verifyCounterLength(u)) {
                                return null;
                            }
                            var c = this._decodePayload(u, n, a);
                            if (!c) {
                                return null;
                            }
                            if (n.length % 2 !== 0 || n.length < 6) {
                                return null;
                            }
                            a.push(i);
                            return {
                                code: n.join(""),
                                start: o.start,
                                end: i.end,
                                startInfo: o,
                                decodedCodes: a,
                                format: this.FORMAT
                            };
                        }
                    }, 
                ]);
                return r;
            })(P);
            var tJ = t$;
            function tK(t) {
                var e = t0();
                return function r() {
                    var n = C()(t), a;
                    if (e) {
                        var o = C()(this).constructor;
                        a = Reflect.construct(n, arguments, o);
                    } else {
                        a = n.apply(this, arguments);
                    }
                    return O()(this, a);
                };
            }
            function t0() {
                if (typeof Reflect === "undefined" || !Reflect.construct) return false;
                if (Reflect.construct.sham) return false;
                if (typeof Proxy === "function") return true;
                try {
                    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
                    return true;
                } catch (t) {
                    return false;
                }
            }
            var t1 = 1;
            var t2 = 3;
            var t3 = [
                t2,
                t1,
                t2,
                t1,
                t1,
                t1, 
            ];
            var t4 = [
                t2,
                t1,
                t1,
                t1,
                t2, 
            ];
            var t5 = [
                [
                    t1,
                    t1,
                    t2,
                    t2,
                    t1, 
                ],
                [
                    t2,
                    t1,
                    t1,
                    t1,
                    t2, 
                ],
                [
                    t1,
                    t2,
                    t1,
                    t1,
                    t2, 
                ],
                [
                    t2,
                    t2,
                    t1,
                    t1,
                    t1, 
                ],
                [
                    t1,
                    t1,
                    t2,
                    t1,
                    t2, 
                ],
                [
                    t2,
                    t1,
                    t2,
                    t1,
                    t1, 
                ],
                [
                    t1,
                    t2,
                    t2,
                    t1,
                    t1, 
                ],
                [
                    t1,
                    t1,
                    t1,
                    t2,
                    t2, 
                ],
                [
                    t2,
                    t1,
                    t1,
                    t2,
                    t1, 
                ],
                [
                    t1,
                    t2,
                    t1,
                    t2,
                    t1, 
                ], 
            ];
            var t6 = t3.reduce(function(t, e) {
                return t + e;
            }, 0);
            var t8 = (function(t) {
                b()(r, t);
                var e = tK(r);
                function r() {
                    var t;
                    p()(this, r);
                    for(var n = arguments.length, a = new Array(n), o = 0; o < n; o++){
                        a[o] = arguments[o];
                    }
                    t = e.call.apply(e, [
                        this
                    ].concat(a));
                    M()(m()(t), "barSpaceRatio", [
                        1,
                        1
                    ]);
                    M()(m()(t), "FORMAT", "2of5");
                    M()(m()(t), "SINGLE_CODE_ERROR", 0.78);
                    M()(m()(t), "AVG_CODE_ERROR", 0.3);
                    return t;
                }
                y()(r, [
                    {
                        key: "_findPattern",
                        value: function t(e, r) {
                            var n = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
                            var a = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
                            var o = [];
                            var i = 0;
                            var u = {
                                error: Number.MAX_VALUE,
                                code: -1,
                                start: 0,
                                end: 0
                            };
                            var c = 0;
                            var f = 0;
                            var s = this.AVG_CODE_ERROR;
                            if (!r) {
                                r = this._nextSet(this._row);
                            }
                            for(var l = 0; l < e.length; l++){
                                o[l] = 0;
                            }
                            for(var v = r; v < this._row.length; v++){
                                if (this._row[v] ^ (n ? 1 : 0)) {
                                    o[i]++;
                                } else {
                                    if (i === o.length - 1) {
                                        c = 0;
                                        for(var h = 0; h < o.length; h++){
                                            c += o[h];
                                        }
                                        f = this._matchPattern(o, e);
                                        if (f < s) {
                                            u.error = f;
                                            u.start = v - c;
                                            u.end = v;
                                            return u;
                                        }
                                        if (a) {
                                            for(var d = 0; d < o.length - 2; d++){
                                                o[d] = o[d + 2];
                                            }
                                            o[o.length - 2] = 0;
                                            o[o.length - 1] = 0;
                                            i--;
                                        } else {
                                            return null;
                                        }
                                    } else {
                                        i++;
                                    }
                                    o[i] = 1;
                                    n = !n;
                                }
                            }
                            return null;
                        }
                    },
                    {
                        key: "_findStart",
                        value: function t() {
                            var e = null;
                            var r = this._nextSet(this._row);
                            var n = 1;
                            var a = 0;
                            while(!e){
                                e = this._findPattern(t3, r, false, true);
                                if (!e) {
                                    return null;
                                }
                                n = Math.floor((e.end - e.start) / t6);
                                a = e.start - n * 5;
                                if (a >= 0) {
                                    if (this._matchRange(a, e.start, 0)) {
                                        return e;
                                    }
                                }
                                r = e.end;
                                e = null;
                            }
                            return e;
                        }
                    },
                    {
                        key: "_verifyTrailingWhitespace",
                        value: function t(e) {
                            var r = e.end + (e.end - e.start) / 2;
                            if (r < this._row.length) {
                                if (this._matchRange(e.end, r, 0)) {
                                    return e;
                                }
                            }
                            return null;
                        }
                    },
                    {
                        key: "_findEnd",
                        value: function t() {
                            this._row.reverse();
                            var e = this._nextSet(this._row);
                            var r = this._findPattern(t4, e, false, true);
                            this._row.reverse();
                            if (r === null) {
                                return null;
                            }
                            var n = r.start;
                            r.start = this._row.length - r.end;
                            r.end = this._row.length - n;
                            return r !== null ? this._verifyTrailingWhitespace(r) : null;
                        }
                    },
                    {
                        key: "_verifyCounterLength",
                        value: function t(e) {
                            return e.length % 10 === 0;
                        }
                    },
                    {
                        key: "_decodeCode",
                        value: function t(e) {
                            var r = this.AVG_CODE_ERROR;
                            var n = {
                                error: Number.MAX_VALUE,
                                code: -1,
                                start: 0,
                                end: 0
                            };
                            for(var a = 0; a < t5.length; a++){
                                var o = this._matchPattern(e, t5[a]);
                                if (o < n.error) {
                                    n.code = a;
                                    n.error = o;
                                }
                            }
                            if (n.error < r) {
                                return n;
                            }
                            return null;
                        }
                    },
                    {
                        key: "_decodePayload",
                        value: function t(e, r, n) {
                            var a = 0;
                            var o = e.length;
                            var i = [
                                0,
                                0,
                                0,
                                0,
                                0
                            ];
                            var u = null;
                            while(a < o){
                                for(var c = 0; c < 5; c++){
                                    i[c] = e[a] * this.barSpaceRatio[0];
                                    a += 2;
                                }
                                u = this._decodeCode(i);
                                if (!u) {
                                    return null;
                                }
                                r.push("".concat(u.code));
                                n.push(u);
                            }
                            return u;
                        }
                    },
                    {
                        key: "decode",
                        value: function t(e, r) {
                            var n = this._findStart();
                            if (!n) {
                                return null;
                            }
                            var a = this._findEnd();
                            if (!a) {
                                return null;
                            }
                            var o = this._fillCounters(n.end, a.start, false);
                            if (!this._verifyCounterLength(o)) {
                                return null;
                            }
                            var i = [];
                            i.push(n);
                            var u = [];
                            var c = this._decodePayload(o, u, i);
                            if (!c) {
                                return null;
                            }
                            if (u.length < 5) {
                                return null;
                            }
                            i.push(a);
                            return {
                                code: u.join(""),
                                start: n.start,
                                end: a.end,
                                startInfo: n,
                                decodedCodes: i,
                                format: this.FORMAT
                            };
                        }
                    }, 
                ]);
                return r;
            })(P);
            var t9 = t8;
            function t7(t) {
                var e = et();
                return function r() {
                    var n = C()(t), a;
                    if (e) {
                        var o = C()(this).constructor;
                        a = Reflect.construct(n, arguments, o);
                    } else {
                        a = n.apply(this, arguments);
                    }
                    return O()(this, a);
                };
            }
            function et() {
                if (typeof Reflect === "undefined" || !Reflect.construct) return false;
                if (Reflect.construct.sham) return false;
                if (typeof Proxy === "function") return true;
                try {
                    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
                    return true;
                } catch (t) {
                    return false;
                }
            }
            var ee = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. $/+%abcd*";
            var er = new Uint16Array(Z()(ee).map(function(t) {
                return t.charCodeAt(0);
            }));
            var en = new Uint16Array([
                0x114,
                0x148,
                0x144,
                0x142,
                0x128,
                0x124,
                0x122,
                0x150,
                0x112,
                0x10a,
                0x1a8,
                0x1a4,
                0x1a2,
                0x194,
                0x192,
                0x18a,
                0x168,
                0x164,
                0x162,
                0x134,
                0x11a,
                0x158,
                0x14c,
                0x146,
                0x12c,
                0x116,
                0x1b4,
                0x1b2,
                0x1ac,
                0x1a6,
                0x196,
                0x19a,
                0x16c,
                0x166,
                0x136,
                0x13a,
                0x12e,
                0x1d4,
                0x1d2,
                0x1ca,
                0x16e,
                0x176,
                0x1ae,
                0x126,
                0x1da,
                0x1d6,
                0x132,
                0x15e, 
            ]);
            var ea = 0x15e;
            var eo = (function(t) {
                b()(r, t);
                var e = t7(r);
                function r() {
                    var t;
                    p()(this, r);
                    for(var n = arguments.length, a = new Array(n), o = 0; o < n; o++){
                        a[o] = arguments[o];
                    }
                    t = e.call.apply(e, [
                        this
                    ].concat(a));
                    M()(m()(t), "FORMAT", "code_93");
                    return t;
                }
                y()(r, [
                    {
                        key: "_patternToChar",
                        value: function t(e) {
                            for(var r = 0; r < en.length; r++){
                                if (en[r] === e) {
                                    return String.fromCharCode(er[r]);
                                }
                            }
                            return null;
                        }
                    },
                    {
                        key: "_toPattern",
                        value: function t(e) {
                            var r = e.length;
                            var n = e.reduce(function(t, e) {
                                return t + e;
                            }, 0);
                            var a = 0;
                            for(var o = 0; o < r; o++){
                                var i = Math.round((e[o] * 9) / n);
                                if (i < 1 || i > 4) {
                                    return -1;
                                }
                                if ((o & 1) === 0) {
                                    for(var u = 0; u < i; u++){
                                        a = (a << 1) | 1;
                                    }
                                } else {
                                    a <<= i;
                                }
                            }
                            return a;
                        }
                    },
                    {
                        key: "_findStart",
                        value: function t() {
                            var e = this._nextSet(this._row);
                            var r = e;
                            var n = new Uint16Array([
                                0,
                                0,
                                0,
                                0,
                                0,
                                0, 
                            ]);
                            var a = 0;
                            var o = false;
                            for(var i = e; i < this._row.length; i++){
                                if (this._row[i] ^ (o ? 1 : 0)) {
                                    n[a]++;
                                } else {
                                    if (a === n.length - 1) {
                                        if (this._toPattern(n) === ea) {
                                            var u = Math.floor(Math.max(0, r - (i - r) / 4));
                                            if (this._matchRange(u, r, 0)) {
                                                return {
                                                    start: r,
                                                    end: i
                                                };
                                            }
                                        }
                                        r += n[0] + n[1];
                                        for(var c = 0; c < 4; c++){
                                            n[c] = n[c + 2];
                                        }
                                        n[4] = 0;
                                        n[5] = 0;
                                        a--;
                                    } else {
                                        a++;
                                    }
                                    n[a] = 1;
                                    o = !o;
                                }
                            }
                            return null;
                        }
                    },
                    {
                        key: "_verifyEnd",
                        value: function t(e, r) {
                            if (e === r || !this._row[r]) {
                                return false;
                            }
                            return true;
                        }
                    },
                    {
                        key: "_decodeExtended",
                        value: function t(e) {
                            var r = e.length;
                            var n = [];
                            for(var a = 0; a < r; a++){
                                var o = e[a];
                                if (o >= "a" && o <= "d") {
                                    if (a > r - 2) {
                                        return null;
                                    }
                                    var i = e[++a];
                                    var u = i.charCodeAt(0);
                                    var c = void 0;
                                    switch(o){
                                        case "a":
                                            if (i >= "A" && i <= "Z") {
                                                c = String.fromCharCode(u - 64);
                                            } else {
                                                return null;
                                            }
                                            break;
                                        case "b":
                                            if (i >= "A" && i <= "E") {
                                                c = String.fromCharCode(u - 38);
                                            } else if (i >= "F" && i <= "J") {
                                                c = String.fromCharCode(u - 11);
                                            } else if (i >= "K" && i <= "O") {
                                                c = String.fromCharCode(u + 16);
                                            } else if (i >= "P" && i <= "S") {
                                                c = String.fromCharCode(u + 43);
                                            } else if (i >= "T" && i <= "Z") {
                                                c = String.fromCharCode(127);
                                            } else {
                                                return null;
                                            }
                                            break;
                                        case "c":
                                            if (i >= "A" && i <= "O") {
                                                c = String.fromCharCode(u - 32);
                                            } else if (i === "Z") {
                                                c = ":";
                                            } else {
                                                return null;
                                            }
                                            break;
                                        case "d":
                                            if (i >= "A" && i <= "Z") {
                                                c = String.fromCharCode(u + 32);
                                            } else {
                                                return null;
                                            }
                                            break;
                                        default:
                                            console.warn("* code_93_reader _decodeExtended hit default case, this may be an error", c);
                                            return null;
                                    }
                                    n.push(c);
                                } else {
                                    n.push(o);
                                }
                            }
                            return n;
                        }
                    },
                    {
                        key: "_matchCheckChar",
                        value: function t(e, r, n) {
                            var a = e.slice(0, r);
                            var o = a.length;
                            var i = a.reduce(function(t, e, r) {
                                var a = ((r * -1 + (o - 1)) % n) + 1;
                                var i = er.indexOf(e.charCodeAt(0));
                                return t + a * i;
                            }, 0);
                            var u = er[i % 47];
                            return (u === e[r].charCodeAt(0));
                        }
                    },
                    {
                        key: "_verifyChecksums",
                        value: function t(e) {
                            return (this._matchCheckChar(e, e.length - 2, 20) && this._matchCheckChar(e, e.length - 1, 15));
                        }
                    },
                    {
                        key: "decode",
                        value: function t(e, r) {
                            r = this._findStart();
                            if (!r) {
                                return null;
                            }
                            var n = new Uint16Array([
                                0,
                                0,
                                0,
                                0,
                                0,
                                0, 
                            ]);
                            var a = [];
                            var o = this._nextSet(this._row, r.end);
                            var i;
                            var u;
                            do {
                                n = this._toCounters(o, n);
                                var c = this._toPattern(n);
                                if (c < 0) {
                                    return null;
                                }
                                u = this._patternToChar(c);
                                if (u === null) {
                                    return null;
                                }
                                a.push(u);
                                i = o;
                                o += S["a"].sum(n);
                                o = this._nextSet(this._row, o);
                            }while (u !== "*")
                            a.pop();
                            if (!a.length) {
                                return null;
                            }
                            if (!this._verifyEnd(i, o)) {
                                return null;
                            }
                            if (!this._verifyChecksums(a)) {
                                return null;
                            }
                            a = a.slice(0, a.length - 2);
                            if ((a = this._decodeExtended(a)) === null) {
                                return null;
                            }
                            return {
                                code: a.join(""),
                                start: r.start,
                                end: o,
                                startInfo: r,
                                decodedCodes: a,
                                format: this.FORMAT
                            };
                        }
                    }, 
                ]);
                return r;
            })(P);
            var ei = eo;
            function eu(t) {
                var e = ec();
                return function r() {
                    var n = C()(t), a;
                    if (e) {
                        var o = C()(this).constructor;
                        a = Reflect.construct(n, arguments, o);
                    } else {
                        a = n.apply(this, arguments);
                    }
                    return O()(this, a);
                };
            }
            function ec() {
                if (typeof Reflect === "undefined" || !Reflect.construct) return false;
                if (Reflect.construct.sham) return false;
                if (typeof Proxy === "function") return true;
                try {
                    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
                    return true;
                } catch (t) {
                    return false;
                }
            }
            var ef = {
                AEIO: /[AEIO]/g,
                AZ09: /[A-Z0-9]/
            };
            var es = "0123456789BCDFGHJKLMNPQRSTUVWXYZ";
            var el = (function(t) {
                b()(r, t);
                var e = eu(r);
                function r() {
                    var t;
                    p()(this, r);
                    for(var n = arguments.length, a = new Array(n), o = 0; o < n; o++){
                        a[o] = arguments[o];
                    }
                    t = e.call.apply(e, [
                        this
                    ].concat(a));
                    M()(m()(t), "FORMAT", "code_32_reader");
                    return t;
                }
                y()(r, [
                    {
                        key: "_decodeCode32",
                        value: function t(e) {
                            if (/[^0-9BCDFGHJKLMNPQRSTUVWXYZ]/.test(e)) {
                                return null;
                            }
                            var r = 0;
                            for(var n = 0; n < e.length; n++){
                                r = r * 32 + es.indexOf(e[n]);
                            }
                            var a = "" + r;
                            if (a.length < 9) {
                                a = ("000000000" + a).slice(-9);
                            }
                            return "A" + a;
                        }
                    },
                    {
                        key: "_checkChecksum",
                        value: function t(e) {
                            return !!e;
                        }
                    },
                    {
                        key: "decode",
                        value: function t(e, n) {
                            var a = ti()(C()(r.prototype), "decode", this).call(this, e, n);
                            if (!a) {
                                return null;
                            }
                            var o = a.code;
                            if (!o) {
                                return null;
                            }
                            o = o.replace(ef.AEIO, "");
                            if (!this._checkChecksum(o)) {
                                return null;
                            }
                            var i = this._decodeCode32(o);
                            if (!i) {
                                return null;
                            }
                            a.code = i;
                            return a;
                        }
                    }, 
                ]);
                return r;
            })(ta);
            var ev = el;
            var eh = {
                code_128_reader: I,
                ean_reader: Q,
                ean_5_reader: tW,
                ean_2_reader: tT,
                ean_8_reader: tA,
                code_39_reader: ta,
                code_39_vin_reader: tl,
                codabar_reader: tb,
                upc_reader: tC,
                upc_e_reader: tH,
                i2of5_reader: tJ,
                "2of5_reader": t9,
                code_93_reader: ei,
                code_32_reader: ev
            };
            var ed = {
                registerReader: function t(e, r) {
                    eh[e] = r;
                },
                create: function t(e, r) {
                    var n = {
                        ctx: {
                            frequency: null,
                            pattern: null,
                            overlay: null
                        },
                        dom: {
                            frequency: null,
                            pattern: null,
                            overlay: null
                        }
                    };
                    var a = [];
                    i();
                    u();
                    c();
                    function i() {
                        if (true && typeof document !== "undefined") {
                            var t = document.querySelector("#debug.detection");
                            n.dom.frequency = document.querySelector("canvas.frequency");
                            if (!n.dom.frequency) {
                                n.dom.frequency = document.createElement("canvas");
                                n.dom.frequency.className = "frequency";
                                if (t) {
                                    t.appendChild(n.dom.frequency);
                                }
                            }
                            n.ctx.frequency = n.dom.frequency.getContext("2d");
                            n.dom.pattern = document.querySelector("canvas.patternBuffer");
                            if (!n.dom.pattern) {
                                n.dom.pattern = document.createElement("canvas");
                                n.dom.pattern.className = "patternBuffer";
                                if (t) {
                                    t.appendChild(n.dom.pattern);
                                }
                            }
                            n.ctx.pattern = n.dom.pattern.getContext("2d");
                            n.dom.overlay = document.querySelector("canvas.drawingBuffer");
                            if (n.dom.overlay) {
                                n.ctx.overlay = n.dom.overlay.getContext("2d");
                            }
                        }
                    }
                    function u() {
                        e.readers.forEach(function(t) {
                            var e;
                            var r = {};
                            var n = [];
                            if (o()(t) === "object") {
                                e = t.format;
                                r = t.config;
                            } else if (typeof t === "string") {
                                e = t;
                            }
                            if (true) {
                                console.log("Before registering reader: ", e);
                            }
                            if (r.supplements) {
                                n = r.supplements.map(function(t) {
                                    return new eh[t]();
                                });
                            }
                            try {
                                var i = new eh[e](r, n);
                                a.push(i);
                            } catch (u) {
                                console.error("* Error constructing reader ", e, u);
                                throw u;
                            }
                        });
                        if (true) {
                            console.log("Registered Readers: ".concat(a.map(function(t) {
                                return JSON.stringify({
                                    format: t.FORMAT,
                                    config: t.config
                                });
                            }).join(", ")));
                        }
                    }
                    function c() {
                        if (true && typeof document !== "undefined") {
                            var t;
                            var r = [
                                {
                                    node: n.dom.frequency,
                                    prop: e.debug.showFrequency
                                },
                                {
                                    node: n.dom.pattern,
                                    prop: e.debug.showPattern
                                }, 
                            ];
                            for(t = 0; t < r.length; t++){
                                if (r[t].prop === true) {
                                    r[t].node.style.display = "block";
                                } else {
                                    r[t].node.style.display = "none";
                                }
                            }
                        }
                    }
                    function f(t, e, n) {
                        function a(r) {
                            var n = {
                                y: r * Math.sin(e),
                                x: r * Math.cos(e)
                            };
                            t[0].y -= n.y;
                            t[0].x -= n.x;
                            t[1].y += n.y;
                            t[1].x += n.x;
                        }
                        a(n);
                        while(n > 1 && (!r.inImageWithBorder(t[0]) || !r.inImageWithBorder(t[1]))){
                            n -= Math.ceil(n / 2);
                            a(-n);
                        }
                        return t;
                    }
                    function s(t) {
                        return [
                            {
                                x: (t[1][0] - t[0][0]) / 2 + t[0][0],
                                y: (t[1][1] - t[0][1]) / 2 + t[0][1]
                            },
                            {
                                x: (t[3][0] - t[2][0]) / 2 + t[2][0],
                                y: (t[3][1] - t[2][1]) / 2 + t[2][1]
                            }, 
                        ];
                    }
                    function l(t) {
                        var o = null;
                        var i;
                        var u = v.getBarcodeLine(r, t[0], t[1]);
                        if (true && e.debug.showFrequency) {
                            h["a"].drawPath(t, {
                                x: "x",
                                y: "y"
                            }, n.ctx.overlay, {
                                color: "red",
                                lineWidth: 3
                            });
                            v.debug.printFrequency(u.line, n.dom.frequency);
                        }
                        v.toBinaryLine(u);
                        if (true && e.debug.showPattern) {
                            v.debug.printPattern(u.line, n.dom.pattern);
                        }
                        for(i = 0; i < a.length && o === null; i++){
                            o = a[i].decodePattern(u.line);
                        }
                        if (o === null) {
                            return null;
                        }
                        return {
                            codeResult: o,
                            barcodeLine: u
                        };
                    }
                    function d(t, e, r) {
                        var n = Math.sqrt(Math.pow(t[1][0] - t[0][0], 2) + Math.pow(t[1][1] - t[0][1], 2));
                        var a;
                        var o = 16;
                        var i = null;
                        var u;
                        var c;
                        var f = Math.sin(r);
                        var s = Math.cos(r);
                        for(a = 1; a < o && i === null; a++){
                            u = (n / o) * a * (a % 2 === 0 ? -1 : 1);
                            c = {
                                y: u * f,
                                x: u * s
                            };
                            e[0].y += c.x;
                            e[0].x -= c.y;
                            e[1].y += c.x;
                            e[1].x -= c.y;
                            i = l(e);
                        }
                        return i;
                    }
                    function p(t) {
                        return Math.sqrt(Math.pow(Math.abs(t[1].y - t[0].y), 2) + Math.pow(Math.abs(t[1].x - t[0].x), 2));
                    }
                    function g(t) {
                        var e = null;
                        for(var r = 0; r < a.length && e === null; r++){
                            e = a[r].decodeImage ? a[r].decodeImage(t) : null;
                        }
                        return e;
                    }
                    function y(t) {
                        var r;
                        var a = n.ctx.overlay;
                        var o;
                        if (true) {
                            if (e.debug.drawBoundingBox && a) {
                                h["a"].drawPath(t, {
                                    x: 0,
                                    y: 1
                                }, a, {
                                    color: "blue",
                                    lineWidth: 2
                                });
                            }
                        }
                        r = s(t);
                        var i = p(r);
                        var u = Math.atan2(r[1].y - r[0].y, r[1].x - r[0].x);
                        r = f(r, u, Math.floor(i * 0.1));
                        if (r === null) {
                            return null;
                        }
                        o = l(r);
                        if (o === null) {
                            o = d(t, r, u);
                        }
                        if (o === null) {
                            return null;
                        }
                        if (true && o && e.debug.drawScanline && a) {
                            h["a"].drawPath(r, {
                                x: "x",
                                y: "y"
                            }, a, {
                                color: "red",
                                lineWidth: 3
                            });
                        }
                        return {
                            codeResult: o.codeResult,
                            line: r,
                            angle: u,
                            pattern: o.barcodeLine.line,
                            threshold: o.barcodeLine.threshold
                        };
                    }
                    return {
                        decodeFromBoundingBox: function t(e) {
                            return y(e);
                        },
                        decodeFromBoundingBoxes: function t(r) {
                            var n;
                            var a;
                            var o = [];
                            var i = e.multiple;
                            for(n = 0; n < r.length; n++){
                                var u = r[n];
                                a = y(u) || {};
                                a.box = u;
                                if (i) {
                                    o.push(a);
                                } else if (a.codeResult) {
                                    return a;
                                }
                            }
                            if (i) {
                                return {
                                    barcodes: o
                                };
                            }
                        },
                        decodeFromImage: function t(e) {
                            var r = g(e);
                            return r;
                        },
                        registerReader: function t(e, r) {
                            if (eh[e]) {
                                throw new Error("cannot register existing reader", e);
                            }
                            eh[e] = r;
                        },
                        setReaders: function t(r) {
                            e.readers = r;
                            a.length = 0;
                            u();
                        }
                    };
                }
            };
            var ep = (function t() {
                var e = {};
                function r(t) {
                    if (!e[t]) {
                        e[t] = {
                            subscribers: []
                        };
                    }
                    return e[t];
                }
                function n() {
                    e = {};
                }
                function a(t, e) {
                    if (t.async) {
                        setTimeout(function() {
                            t.callback(e);
                        }, 4);
                    } else {
                        t.callback(e);
                    }
                }
                function o(t, e, n) {
                    var a;
                    if (typeof e === "function") {
                        a = {
                            callback: e,
                            async: n
                        };
                    } else {
                        a = e;
                        if (!a.callback) {
                            throw new Error("Callback was not specified on options");
                        }
                    }
                    r(t).subscribers.push(a);
                }
                return {
                    subscribe: function t(e, r, n) {
                        return o(e, r, n);
                    },
                    publish: function t(e, n) {
                        var o = r(e);
                        var i = o.subscribers;
                        i.filter(function(t) {
                            return !!t.once;
                        }).forEach(function(t) {
                            a(t, n);
                        });
                        o.subscribers = i.filter(function(t) {
                            return !t.once;
                        });
                        o.subscribers.forEach(function(t) {
                            a(t, n);
                        });
                    },
                    once: function t(e, r) {
                        var n = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
                        o(e, {
                            callback: r,
                            async: n,
                            once: true
                        });
                    },
                    unsubscribe: function t(e, a) {
                        if (e) {
                            var o = r(e);
                            if (o && a) {
                                o.subscribers = o.subscribers.filter(function(t) {
                                    return (t.callback !== a);
                                });
                            } else {
                                o.subscribers = [];
                            }
                        } else {
                            n();
                        }
                    }
                };
            })();
            var eg = r(20);
            var ey = r.n(eg);
            var ex = r(12);
            var em = r.n(ex);
            var e_ = r(85);
            var eb = r.n(e_);
            var ew = r(86);
            var eO = r.n(ew);
            function eR(t) {
                var e = eC();
                return function r() {
                    var n = C()(t), a;
                    if (e) {
                        var o = C()(this).constructor;
                        a = Reflect.construct(n, arguments, o);
                    } else {
                        a = n.apply(this, arguments);
                    }
                    return O()(this, a);
                };
            }
            function eC() {
                if (typeof Reflect === "undefined" || !Reflect.construct) return false;
                if (Reflect.construct.sham) return false;
                if (typeof Proxy === "function") return true;
                try {
                    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
                    return true;
                } catch (t) {
                    return false;
                }
            }
            var eE = (function(t) {
                b()(r, t);
                var e = eR(r);
                function r(t, n) {
                    var a;
                    p()(this, r);
                    a = e.call(this, t);
                    M()(m()(a), "code", void 0);
                    a.code = n;
                    Object.setPrototypeOf(m()(a), r.prototype);
                    return a;
                }
                return r;
            })(eO()(Error));
            var eM = "This may mean that the user has declined camera access, or the browser does not support media APIs. If you are running in iOS, you must use Safari.";
            function eS() {
                try {
                    return navigator.mediaDevices.enumerateDevices();
                } catch (e) {
                    var t = new eE("enumerateDevices is not defined. ".concat(eM), -1);
                    return Promise.reject(t);
                }
            }
            function eA(t) {
                try {
                    return navigator.mediaDevices.getUserMedia(t);
                } catch (r) {
                    var e = new eE("getUserMedia is not defined. ".concat(eM), -1);
                    return Promise.reject(e);
                }
            }
            var ek;
            function eP(t) {
                return new Promise(function(e, r) {
                    var n = 10;
                    function a() {
                        if (n > 0) {
                            if (t.videoWidth > 10 && t.videoHeight > 10) {
                                if (true) {
                                    console.log("* dev: checkVideo found ".concat(t.videoWidth, "px x ").concat(t.videoHeight, "px"));
                                }
                                e();
                            } else {
                                window.setTimeout(a, 500);
                            }
                        } else {
                            r(new eE("Unable to play video stream. Is webcam working?", -1));
                        }
                        n--;
                    }
                    a();
                });
            }
            function eD(t, e) {
                return eT.apply(this, arguments);
            }
            function eT() {
                eT = ey()(em.a.mark(function t(e, r) {
                    var n;
                    return em.a.wrap(function t(a) {
                        while(1){
                            switch((a.prev = a.next)){
                                case 0:
                                    a.next = 2;
                                    return eA(r);
                                case 2:
                                    n = a.sent;
                                    ek = n;
                                    if (!e) {
                                        a.next = 11;
                                        break;
                                    }
                                    e.setAttribute("autoplay", "true");
                                    e.setAttribute("muted", "true");
                                    e.setAttribute("playsinline", "true");
                                    e.srcObject = n;
                                    e.addEventListener("loadedmetadata", function() {
                                        e.play();
                                    });
                                    return a.abrupt("return", eP(e));
                                case 11:
                                    return a.abrupt("return", Promise.resolve());
                                case 12:
                                case "end":
                                    return a.stop();
                            }
                        }
                    }, t);
                }));
                return eT.apply(this, arguments);
            }
            function ej(t) {
                var e = eb()(t, [
                    "width",
                    "height",
                    "facingMode",
                    "aspectRatio",
                    "deviceId", 
                ]);
                if (typeof t.minAspectRatio !== "undefined" && t.minAspectRatio > 0) {
                    e.aspectRatio = t.minAspectRatio;
                    console.log("WARNING: Constraint 'minAspectRatio' is deprecated; Use 'aspectRatio' instead");
                }
                if (typeof t.facing !== "undefined") {
                    e.facingMode = t.facing;
                    console.log("WARNING: Constraint 'facing' is deprecated. Use 'facingMode' instead'");
                }
                return e;
            }
            function eI() {
                var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var e = ej(t);
                if (e && e.deviceId && e.facingMode) {
                    delete e.facingMode;
                }
                return Promise.resolve({
                    audio: false,
                    video: e
                });
            }
            function ez() {
                return eL.apply(this, arguments);
            }
            function eL() {
                eL = ey()(em.a.mark(function t() {
                    var e;
                    return em.a.wrap(function t(r) {
                        while(1){
                            switch((r.prev = r.next)){
                                case 0:
                                    r.next = 2;
                                    return eS();
                                case 2:
                                    e = r.sent;
                                    return r.abrupt("return", e.filter(function(t) {
                                        return (t.kind === "videoinput");
                                    }));
                                case 4:
                                case "end":
                                    return r.stop();
                            }
                        }
                    }, t);
                }));
                return eL.apply(this, arguments);
            }
            function eN() {
                if (!ek) {
                    return null;
                }
                var t = ek.getVideoTracks();
                return t && t !== null && t !== void 0 && t.length ? t[0] : null;
            }
            var eU = {
                requestedVideoElement: null,
                request: function t(e, r) {
                    return ey()(em.a.mark(function t() {
                        var n;
                        return em.a.wrap(function t(a) {
                            while(1){
                                switch((a.prev = a.next)){
                                    case 0:
                                        eU.requestedVideoElement = e;
                                        a.next = 3;
                                        return eI(r);
                                    case 3:
                                        n = a.sent;
                                        return a.abrupt("return", eD(e, n));
                                    case 5:
                                    case "end":
                                        return a.stop();
                                }
                            }
                        }, t);
                    }))();
                },
                release: function t() {
                    var e = ek && ek.getVideoTracks();
                    if (eU.requestedVideoElement !== null) {
                        eU.requestedVideoElement.pause();
                    }
                    return new Promise(function(t) {
                        setTimeout(function() {
                            if (e && e.length) {
                                e[0].stop();
                            }
                            ek = null;
                            eU.requestedVideoElement = null;
                            t();
                        }, 0);
                    });
                },
                enumerateVideoDevices: ez,
                getActiveStreamLabel: function t() {
                    var e = eN();
                    return e ? e.label : "";
                },
                getActiveTrack: eN
            };
            var eW = eU;
            function eB(t, e) {
                return (e && e.some(function(e) {
                    var r = Object.keys(e);
                    return r.every(function(r) {
                        return e[r] === t[r];
                    });
                }));
            }
            function eF(t, e) {
                return typeof e === "function" ? e(t) : true;
            }
            var eq = {
                create: function t(e) {
                    var r;
                    var n = document.createElement("canvas");
                    var a = n.getContext("2d");
                    var o = [];
                    var i = (r = e.capacity) !== null && r !== void 0 ? r : 20;
                    var u = e.capture === true;
                    function c(t) {
                        return (!!i && t && !eB(t, e.blacklist) && eF(t, e.filter));
                    }
                    return {
                        addResult: function t(e, r, f) {
                            var s = {};
                            if (c(f)) {
                                i--;
                                s.codeResult = f;
                                if (u) {
                                    n.width = r.x;
                                    n.height = r.y;
                                    h["a"].drawImage(e, r, a);
                                    s.frame = n.toDataURL();
                                }
                                o.push(s);
                            }
                        },
                        getResults: function t() {
                            return o;
                        }
                    };
                }
            };
            var eV = {
                inputStream: {
                    name: "Live",
                    type: "LiveStream",
                    constraints: {
                        width: 640,
                        height: 480,
                        facingMode: "environment"
                    },
                    area: {
                        top: "0%",
                        right: "0%",
                        left: "0%",
                        bottom: "0%"
                    },
                    singleChannel: false
                },
                locate: true,
                numOfWorkers: 0,
                decoder: {
                    readers: [
                        "code_128_reader"
                    ],
                    debug: {
                        drawBoundingBox: false,
                        showFrequency: false,
                        drawScanline: false,
                        showPattern: false
                    }
                },
                locator: {
                    halfSample: true,
                    patchSize: "medium",
                    debug: {
                        showCanvas: false,
                        showPatches: false,
                        showFoundPatches: false,
                        showSkeleton: false,
                        showLabels: false,
                        showPatchLabels: false,
                        showRemainingPatchLabels: false,
                        boxFromPatches: {
                            showTransformed: false,
                            showTransformedBox: false,
                            showBB: false
                        }
                    }
                }
            };
            var eG = eV;
            var eH = {
                inputStream: {
                    type: "ImageStream",
                    sequence: false,
                    size: 800,
                    area: {
                        top: "0%",
                        right: "0%",
                        left: "0%",
                        bottom: "0%"
                    },
                    singleChannel: false
                },
                locate: true,
                numOfWorkers: 0,
                decoder: {
                    readers: [
                        "code_128_reader"
                    ]
                },
                locator: {
                    halfSample: true,
                    patchSize: "medium"
                }
            };
            var eX = eH;
            var eQ = {
                inputStream: {
                    name: "Live",
                    type: "LiveStream",
                    constraints: {
                        width: 640,
                        height: 480,
                        facingMode: "environment"
                    },
                    area: {
                        top: "0%",
                        right: "0%",
                        left: "0%",
                        bottom: "0%"
                    },
                    singleChannel: false
                },
                locate: true,
                numOfWorkers: 4,
                decoder: {
                    readers: [
                        "code_128_reader"
                    ]
                },
                locator: {
                    halfSample: true,
                    patchSize: "medium"
                }
            };
            var eY = eQ;
            var eZ = true ? eG : undefined;
            var e$ = eZ;
            var eJ = r(7);
            var eK = function t() {
                p()(this, t);
                M()(this, "config", void 0);
                M()(this, "inputStream", void 0);
                M()(this, "framegrabber", void 0);
                M()(this, "inputImageWrapper", void 0);
                M()(this, "stopped", false);
                M()(this, "boxSize", void 0);
                M()(this, "resultCollector", void 0);
                M()(this, "decoder", void 0);
                M()(this, "workerPool", []);
                M()(this, "onUIThread", true);
                M()(this, "canvasContainer", new e1());
            };
            var e0 = function t() {
                p()(this, t);
                M()(this, "image", void 0);
                M()(this, "overlay", void 0);
            };
            var e1 = function t() {
                p()(this, t);
                M()(this, "ctx", void 0);
                M()(this, "dom", void 0);
                this.ctx = new e0();
                this.dom = new e0();
            };
            var e2 = r(23);
            function e3(t, e, r) {
                var n = e || new f["a"]({
                    x: t.getWidth(),
                    y: t.getHeight(),
                    type: "XYSize"
                });
                if (true) {
                    console.log("image wrapper size ".concat(n.size));
                }
                var a = [
                    Object(eJ["clone"])([
                        0,
                        0
                    ]),
                    Object(eJ["clone"])([
                        0,
                        n.size.y
                    ]),
                    Object(eJ["clone"])([
                        n.size.x,
                        n.size.y, 
                    ]),
                    Object(eJ["clone"])([
                        n.size.x,
                        0
                    ]), 
                ];
                e2["a"].init(n, r);
                return {
                    inputImageWrapper: n,
                    boxSize: a
                };
            }
            function e4(t) {
                if (typeof document === "undefined") {
                    return null;
                }
                if (t instanceof HTMLElement && t.nodeName && t.nodeType === 1) {
                    return t;
                }
                var e = typeof t === "string" ? t : "#interactive.viewport";
                return document.querySelector(e);
            }
            function e5(t, e) {
                var r = document.querySelector(t);
                if (!r) {
                    r = document.createElement("canvas");
                    r.className = e;
                }
                return r;
            }
            function e6(t, e) {
                var r = e5(t, e);
                var n = r.getContext("2d");
                return {
                    canvas: r,
                    context: n
                };
            }
            function e8(t) {
                if (typeof document !== "undefined") {
                    var e = e6("canvas.imgBuffer", "imgBuffer");
                    var r = e6("canvas.drawingBuffer", "drawingBuffer");
                    e.canvas.width = r.canvas.width = t.x;
                    e.canvas.height = r.canvas.height = t.y;
                    return {
                        dom: {
                            image: e.canvas,
                            overlay: r.canvas
                        },
                        ctx: {
                            image: e.context,
                            overlay: r.context
                        }
                    };
                }
                return null;
            }
            function e9(t) {
                var e, r, n, a;
                var o = e4(t === null || t === void 0 ? void 0 : (e = t.config) === null || e === void 0 ? void 0 : (r = e.inputStream) === null || r === void 0 ? void 0 : r.target);
                var i = t === null || t === void 0 ? void 0 : (n = t.config) === null || n === void 0 ? void 0 : (a = n.inputStream) === null || a === void 0 ? void 0 : a.type;
                if (!i) return null;
                var u = e8(t.inputStream.getCanvasSize());
                if (!u) return {
                    dom: {
                        image: null,
                        overlay: null
                    },
                    ctx: {
                        image: null,
                        overlay: null
                    }
                };
                var c = u.dom;
                if (typeof document !== "undefined") {
                    if (o) {
                        if (i === "ImageStream" && !o.contains(c.image)) {
                            o.appendChild(c.image);
                        }
                        if (!o.contains(c.overlay)) {
                            o.appendChild(c.overlay);
                        }
                    }
                }
                return u;
            }
            var e7 = {
                0x0112: "orientation"
            };
            var rt = Object.keys(e7).map(function(t) {
                return e7[t];
            });
            function re(t) {
                var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : rt;
                if (/^blob:/i.test(t)) {
                    return ra(t).then(rn).then(function(t) {
                        return ro(t, e);
                    });
                }
                return Promise.resolve(null);
            }
            function rr(t) {
                var e = t.replace(/^data:([^;]+);base64,/gim, "");
                var r = atob(e);
                var n = r.length;
                var a = new ArrayBuffer(n);
                var o = new Uint8Array(a);
                for(var i = 0; i < n; i++){
                    o[i] = r.charCodeAt(i);
                }
                return a;
            }
            function rn(t) {
                return new Promise(function(e) {
                    var r = new FileReader();
                    r.onload = function(t) {
                        return e(t.target.result);
                    };
                    r.readAsArrayBuffer(t);
                });
            }
            function ra(t) {
                return new Promise(function(e, r) {
                    var n = new XMLHttpRequest();
                    n.open("GET", t, true);
                    n.responseType = "blob";
                    n.onreadystatechange = function() {
                        if (n.readyState === XMLHttpRequest.DONE && (n.status === 200 || n.status === 0)) {
                            e(this.response);
                        }
                    };
                    n.onerror = r;
                    n.send();
                });
            }
            function ro(t) {
                var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : rt;
                var r = new DataView(t);
                var n = t.byteLength;
                var a = e.reduce(function(t, e) {
                    var r = Object.keys(e7).filter(function(t) {
                        return e7[t] === e;
                    })[0];
                    if (r) {
                        t[r] = e;
                    }
                    return t;
                }, {});
                var o = 2;
                var i;
                if (r.getUint8(0) !== 0xff || r.getUint8(1) !== 0xd8) {
                    return false;
                }
                while(o < n){
                    if (r.getUint8(o) !== 0xff) {
                        return false;
                    }
                    i = r.getUint8(o + 1);
                    if (i === 0xe1) {
                        return ri(r, o + 4, a);
                    }
                    o += 2 + r.getUint16(o + 2);
                }
                return false;
            }
            function ri(t, e, r) {
                if (rf(t, e, 4) !== "Exif") {
                    return false;
                }
                var n = e + 6;
                var a;
                if (t.getUint16(n) === 0x4949) {
                    a = false;
                } else if (t.getUint16(n) === 0x4d4d) {
                    a = true;
                } else {
                    return false;
                }
                if (t.getUint16(n + 2, !a) !== 0x002a) {
                    return false;
                }
                var o = t.getUint32(n + 4, !a);
                if (o < 0x00000008) {
                    return false;
                }
                var i = ru(t, n, n + o, r, a);
                return i;
            }
            function ru(t, e, r, n, a) {
                var o = t.getUint16(r, !a);
                var i = {};
                for(var u = 0; u < o; u++){
                    var c = r + u * 12 + 2;
                    var f = n[t.getUint16(c, !a)];
                    if (f) {
                        i[f] = rc(t, c, e, r, a);
                    }
                }
                return i;
            }
            function rc(t, e, r, n, a) {
                var o = t.getUint16(e + 2, !a);
                var i = t.getUint32(e + 4, !a);
                switch(o){
                    case 3:
                        if (i === 1) {
                            return t.getUint16(e + 8, !a);
                        }
                }
                return null;
            }
            function rf(t, e, r) {
                var n = "";
                for(var a = e; a < e + r; a++){
                    n += String.fromCharCode(t.getUint8(a));
                }
                return n;
            }
            var rs = {};
            rs.load = function(t, e, r, n, a) {
                var o = new Array(n);
                var i = new Array(o.length);
                var u;
                var c;
                var f;
                if (a === false) {
                    o[0] = t;
                } else {
                    for(u = 0; u < o.length; u++){
                        f = r + u;
                        o[u] = "".concat(t, "image-").concat("00".concat(f).slice(-3), ".jpg");
                    }
                }
                i.notLoaded = [];
                i.addImage = function(t) {
                    i.notLoaded.push(t);
                };
                i.loaded = function(r) {
                    var n = i.notLoaded;
                    for(var u = 0; u < n.length; u++){
                        if (n[u] === r) {
                            n.splice(u, 1);
                            for(var c = 0; c < o.length; c++){
                                var f = o[c].substr(o[c].lastIndexOf("/"));
                                if (r.src.lastIndexOf(f) !== -1) {
                                    i[c] = {
                                        img: r
                                    };
                                    break;
                                }
                            }
                            break;
                        }
                    }
                    if (n.length === 0) {
                        if (true) {
                            console.log("Images loaded");
                        }
                        if (a === false) {
                            re(t, [
                                "orientation"
                            ]).then(function(t) {
                                i[0].tags = t;
                                e(i);
                            })["catch"](function(t) {
                                console.log(t);
                                e(i);
                            });
                        } else {
                            e(i);
                        }
                    }
                };
                for(u = 0; u < o.length; u++){
                    c = new Image();
                    i.addImage(c);
                    rl(c, i);
                    c.src = o[u];
                }
            };
            function rl(t, e) {
                t.onload = function() {
                    e.loaded(this);
                };
            }
            var rv = rs;
            var rh = {
                createVideoStream: function t(e) {
                    var r = null;
                    var n = [
                        "canrecord",
                        "ended"
                    ];
                    var a = {};
                    var o;
                    var i;
                    var u = {
                        x: 0,
                        y: 0,
                        type: "Point"
                    };
                    var c = {
                        x: 0,
                        y: 0,
                        type: "XYSize"
                    };
                    function f() {
                        var t, n;
                        var a = e.videoWidth;
                        var u = e.videoHeight;
                        o = (t = r) !== null && t !== void 0 && t.size ? a / u > 1 ? r.size : Math.floor((a / u) * r.size) : a;
                        i = (n = r) !== null && n !== void 0 && n.size ? a / u > 1 ? Math.floor((u / a) * r.size) : r.size : u;
                        c.x = o;
                        c.y = i;
                    }
                    var s = {
                        getRealWidth: function t() {
                            return e.videoWidth;
                        },
                        getRealHeight: function t() {
                            return e.videoHeight;
                        },
                        getWidth: function t() {
                            return o;
                        },
                        getHeight: function t() {
                            return i;
                        },
                        setWidth: function t(e) {
                            o = e;
                        },
                        setHeight: function t(e) {
                            i = e;
                        },
                        setInputStream: function t(e) {
                            r = e;
                            this.setAttribute("src", typeof e.src !== "undefined" ? e.src : "");
                        },
                        ended: function t() {
                            return e.ended;
                        },
                        getConfig: function t() {
                            return r;
                        },
                        setAttribute: function t(r, n) {
                            if (e) {
                                e.setAttribute(r, n);
                            }
                        },
                        pause: function t() {
                            e.pause();
                        },
                        play: function t() {
                            e.play();
                        },
                        setCurrentTime: function t(e) {
                            var n;
                            if (((n = r) === null || n === void 0 ? void 0 : n.type) !== "LiveStream") {
                                this.setAttribute("currentTime", e.toString());
                            }
                        },
                        addEventListener: function t(r, o, i) {
                            if (n.indexOf(r) !== -1) {
                                if (!a[r]) {
                                    a[r] = [];
                                }
                                a[r].push(o);
                            } else {
                                e.addEventListener(r, o, i);
                            }
                        },
                        clearEventHandlers: function t() {
                            n.forEach(function(t) {
                                var r = a[t];
                                if (r && r.length > 0) {
                                    r.forEach(function(r) {
                                        e.removeEventListener(t, r);
                                    });
                                }
                            });
                        },
                        trigger: function t(e, r) {
                            var n;
                            var o = a[e];
                            if (e === "canrecord") {
                                f();
                            }
                            if (o && o.length > 0) {
                                for(n = 0; n < o.length; n++){
                                    o[n].apply(s, r);
                                }
                            }
                        },
                        setTopRight: function t(e) {
                            u.x = e.x;
                            u.y = e.y;
                        },
                        getTopRight: function t() {
                            return u;
                        },
                        setCanvasSize: function t(e) {
                            c.x = e.x;
                            c.y = e.y;
                        },
                        getCanvasSize: function t() {
                            return c;
                        },
                        getFrame: function t() {
                            return e;
                        }
                    };
                    return s;
                },
                createLiveStream: function t(e) {
                    if (e) {
                        e.setAttribute("autoplay", "true");
                    }
                    var r = rh.createVideoStream(e);
                    r.ended = function t() {
                        return false;
                    };
                    return r;
                },
                createImageStream: function t() {
                    var e = null;
                    var r = 0;
                    var n = 0;
                    var a = 0;
                    var o = true;
                    var i = false;
                    var u = null;
                    var c = 0;
                    var f = 1;
                    var s = null;
                    var l = false;
                    var v;
                    var h;
                    var d = [
                        "canrecord",
                        "ended"
                    ];
                    var p = {};
                    var g = {
                        x: 0,
                        y: 0,
                        type: "Point"
                    };
                    var y = {
                        x: 0,
                        y: 0,
                        type: "XYSize"
                    };
                    function x() {
                        var t;
                        i = false;
                        rv.load(s, function(t) {
                            var o, c;
                            u = t;
                            if (t[0].tags && t[0].tags.orientation) {
                                switch(t[0].tags.orientation){
                                    case 6:
                                    case 8:
                                        r = t[0].img.height;
                                        n = t[0].img.width;
                                        break;
                                    default:
                                        r = t[0].img.width;
                                        n = t[0].img.height;
                                }
                            } else {
                                r = t[0].img.width;
                                n = t[0].img.height;
                            }
                            v = (o = e) !== null && o !== void 0 && o.size ? r / n > 1 ? e.size : Math.floor((r / n) * e.size) : r;
                            h = (c = e) !== null && c !== void 0 && c.size ? r / n > 1 ? Math.floor((n / r) * e.size) : e.size : n;
                            y.x = v;
                            y.y = h;
                            i = true;
                            a = 0;
                            setTimeout(function() {
                                m("canrecord", []);
                            }, 0);
                        }, f, c, (t = e) === null || t === void 0 ? void 0 : t.sequence);
                    }
                    function m(t, e) {
                        var r;
                        var n = p[t];
                        if (n && n.length > 0) {
                            for(r = 0; r < n.length; r++){
                                n[r].apply(_, e);
                            }
                        }
                    }
                    var _ = {
                        trigger: m,
                        getWidth: function t() {
                            return v;
                        },
                        getHeight: function t() {
                            return h;
                        },
                        setWidth: function t(e) {
                            v = e;
                        },
                        setHeight: function t(e) {
                            h = e;
                        },
                        getRealWidth: function t() {
                            return r;
                        },
                        getRealHeight: function t() {
                            return n;
                        },
                        setInputStream: function t(r) {
                            e = r;
                            if (r.sequence === false) {
                                s = r.src;
                                c = 1;
                            } else {
                                s = r.src;
                                c = r.length;
                            }
                            x();
                        },
                        ended: function t() {
                            return l;
                        },
                        setAttribute: function t() {},
                        getConfig: function t() {
                            return e;
                        },
                        pause: function t() {
                            o = true;
                        },
                        play: function t() {
                            o = false;
                        },
                        setCurrentTime: function t(e) {
                            a = e;
                        },
                        addEventListener: function t(e, r) {
                            if (d.indexOf(e) !== -1) {
                                if (!p[e]) {
                                    p[e] = [];
                                }
                                p[e].push(r);
                            }
                        },
                        clearEventHandlers: function t() {
                            Object.keys(p).forEach(function(t) {
                                return delete p[t];
                            });
                        },
                        setTopRight: function t(e) {
                            g.x = e.x;
                            g.y = e.y;
                        },
                        getTopRight: function t() {
                            return g;
                        },
                        setCanvasSize: function t(e) {
                            y.x = e.x;
                            y.y = e.y;
                        },
                        getCanvasSize: function t() {
                            return y;
                        },
                        getFrame: function t() {
                            var e;
                            if (!i) {
                                return null;
                            }
                            if (!o) {
                                var r;
                                e = (r = u) === null || r === void 0 ? void 0 : r[a];
                                if (a < c - 1) {
                                    a++;
                                } else {
                                    setTimeout(function() {
                                        l = true;
                                        m("ended", []);
                                    }, 0);
                                }
                            }
                            return e;
                        }
                    };
                    return _;
                }
            };
            var rd = rh;
            var rp = r(8);
            var rg = Math.PI / 180;
            function ry(t, e) {
                if (t.width !== e.x) {
                    if (true) {
                        console.log("WARNING: canvas-size needs to be adjusted");
                    }
                    t.width = e.x;
                }
                if (t.height !== e.y) {
                    if (true) {
                        console.log("WARNING: canvas-size needs to be adjusted");
                    }
                    t.height = e.y;
                }
            }
            var rx = {};
            rx.create = function(t, e) {
                var r = {};
                var n = t.getConfig();
                var a = Object(rp["h"])(t.getRealWidth(), t.getRealHeight());
                var o = t.getCanvasSize();
                var i = Object(rp["h"])(t.getWidth(), t.getHeight());
                var u = t.getTopRight();
                var c = u.x;
                var f = u.y;
                var s;
                var l = null;
                var v = null;
                s = e || document.createElement("canvas");
                s.width = o.x;
                s.height = o.y;
                l = s.getContext("2d");
                v = new Uint8Array(i.x * i.y);
                if (true) {
                    console.log("FrameGrabber", JSON.stringify({
                        size: i,
                        topRight: u,
                        videoSize: a,
                        canvasSize: o
                    }));
                }
                r.attachData = function(t) {
                    v = t;
                };
                r.getData = function() {
                    return v;
                };
                r.grab = function() {
                    var e = n.halfSample;
                    var r = t.getFrame();
                    var a = r;
                    var u = 0;
                    var h;
                    if (a) {
                        ry(s, o);
                        if (n.type === "ImageStream") {
                            a = r.img;
                            if (r.tags && r.tags.orientation) {
                                switch(r.tags.orientation){
                                    case 6:
                                        u = 90 * rg;
                                        break;
                                    case 8:
                                        u = -90 * rg;
                                        break;
                                }
                            }
                        }
                        if (u !== 0) {
                            l.translate(o.x / 2, o.y / 2);
                            l.rotate(u);
                            l.drawImage(a, -o.y / 2, -o.x / 2, o.y, o.x);
                            l.rotate(-u);
                            l.translate(-o.x / 2, -o.y / 2);
                        } else {
                            l.drawImage(a, 0, 0, o.x, o.y);
                        }
                        h = l.getImageData(c, f, i.x, i.y).data;
                        if (e) {
                            Object(rp["e"])(h, i, v);
                        } else {
                            Object(rp["c"])(h, v, n);
                        }
                        return true;
                    }
                    return false;
                };
                r.getSize = function() {
                    return i;
                };
                return r;
            };
            var rm = rx;
            function r_(t, e) {
                var r = Object.keys(t);
                if (Object.getOwnPropertySymbols) {
                    var n = Object.getOwnPropertySymbols(t);
                    if (e) {
                        n = n.filter(function(e) {
                            return Object.getOwnPropertyDescriptor(t, e).enumerable;
                        });
                    }
                    r.push.apply(r, n);
                }
                return r;
            }
            function rb(t) {
                for(var e = 1; e < arguments.length; e++){
                    var r = arguments[e] != null ? arguments[e] : {};
                    if (e % 2) {
                        r_(Object(r), true).forEach(function(e) {
                            M()(t, e, r[e]);
                        });
                    } else if (Object.getOwnPropertyDescriptors) {
                        Object.defineProperties(t, Object.getOwnPropertyDescriptors(r));
                    } else {
                        r_(Object(r)).forEach(function(e) {
                            Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(r, e));
                        });
                    }
                }
                return t;
            }
            var rw = [];
            function rO(t) {
                var e;
                if (rw.length) {
                    e = rw.filter(function(t) {
                        return !t.busy;
                    })[0];
                    if (e) {
                        t.attachData(e.imageData);
                        if (t.grab()) {
                            e.busy = true;
                            e.worker.postMessage({
                                cmd: "process",
                                imageData: e.imageData
                            }, [
                                e.imageData.buffer
                            ]);
                        }
                        return true;
                    } else {
                        return false;
                    }
                }
                return null;
            }
            function rR(t) {
                return rb(rb({}, t), {}, {
                    inputStream: rb(rb({}, t.inputStream), {}, {
                        target: null
                    })
                });
            }
            function rC(t) {
                if (t) {
                    var e = t()["default"];
                    if (!e) {
                        self.postMessage({
                            event: "error",
                            message: "Quagga could not be created"
                        });
                        return;
                    }
                }
                var r;
                function n(t) {
                    self.postMessage({
                        event: "processed",
                        imageData: r.data,
                        result: t
                    }, [
                        r.data.buffer
                    ]);
                }
                function a() {
                    self.postMessage({
                        event: "initialized",
                        imageData: r.data
                    }, [
                        r.data.buffer
                    ]);
                }
                self.onmessage = function(t) {
                    if (t.data.cmd === "init") {
                        var o = t.data.config;
                        o.numOfWorkers = 0;
                        r = new e.ImageWrapper({
                            x: t.data.size.x,
                            y: t.data.size.y
                        }, new Uint8Array(t.data.imageData));
                        e.init(o, a, r);
                        e.onProcessed(n);
                    } else if (t.data.cmd === "process") {
                        r.data = new Uint8Array(t.data.imageData);
                        e.start();
                    } else if (t.data.cmd === "setReaders") {
                        e.setReaders(t.data.readers);
                    } else if (t.data.cmd === "registerReader") {
                        e.registerReader(t.data.name, t.data.reader);
                    }
                };
            }
            function rE() {
                var t, e;
                if (typeof __factorySource__ !== "undefined") {
                    e = __factorySource__;
                }
                t = new Blob([
                    "(" + rC.toString() + ")(" + e + ");", 
                ], {
                    type: "text/javascript"
                });
                return window.URL.createObjectURL(t);
            }
            function rM(t, e, r) {
                var n = rE();
                var a = new Worker(n);
                var o = {
                    worker: a,
                    imageData: new Uint8Array(e.getWidth() * e.getHeight()),
                    busy: true
                };
                o.worker.onmessage = function(t) {
                    if (t.data.event === "initialized") {
                        URL.revokeObjectURL(n);
                        o.busy = false;
                        o.imageData = new Uint8Array(t.data.imageData);
                        if (true) {
                            console.log("Worker initialized");
                        }
                        r(o);
                    } else if (t.data.event === "processed") {
                        o.imageData = new Uint8Array(t.data.imageData);
                        o.busy = false;
                    } else if (t.data.event === "error") {
                        if (true) {
                            console.log("Worker error: " + t.data.message);
                        }
                    }
                };
                o.worker.postMessage({
                    cmd: "init",
                    size: {
                        x: e.getWidth(),
                        y: e.getHeight()
                    },
                    imageData: o.imageData,
                    config: rR(t)
                }, [
                    o.imageData.buffer
                ]);
            }
            function rS(t, e, r, n) {
                var a = t - rw.length;
                if (a === 0 && n) {
                    n();
                } else if (a < 0) {
                    var o = rw.slice(a);
                    o.forEach(function(t) {
                        t.worker.terminate();
                        if (true) {
                            console.log("Worker terminated!");
                        }
                    });
                    rw = rw.slice(0, a);
                    if (n) {
                        n();
                    }
                } else {
                    var i = function e(r) {
                        rw.push(r);
                        if (rw.length >= t && n) {
                            n();
                        }
                    };
                    if (e) {
                        for(var u = 0; u < a; u++){
                            rM(e, r, i);
                        }
                    }
                }
            }
            function rA(t) {
                rw.forEach(function(e) {
                    return e.worker.postMessage({
                        cmd: "setReaders",
                        readers: t
                    });
                });
            }
            function rk(t, e) {
                rw.forEach(function(r) {
                    return r.worker.postMessage({
                        cmd: "registerReader",
                        name: t,
                        reader: e
                    });
                });
            }
            function rP() {
                var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "LiveStream";
                var e = arguments.length > 1 ? arguments[1] : undefined;
                var r = arguments.length > 2 ? arguments[2] : undefined;
                switch(t){
                    case "VideoStream":
                        {
                            var n = document.createElement("video");
                            return {
                                video: n,
                                inputStream: r.createVideoStream(n)
                            };
                        }
                    case "ImageStream":
                        return {
                            inputStream: r.createImageStream()
                        };
                    case "LiveStream":
                        {
                            var a = null;
                            if (e) {
                                a = e.querySelector("video");
                                if (!a) {
                                    a = document.createElement("video");
                                    e.appendChild(a);
                                }
                            }
                            return {
                                video: a,
                                inputStream: r.createLiveStream(a)
                            };
                        }
                    default:
                        console.error("* setupInputStream invalid type ".concat(t));
                        return {
                            video: null,
                            inputStream: null
                        };
                }
            }
            function rD(t, e, r) {
                var n = t.length;
                while(n--){
                    t[n][0] += e;
                    t[n][1] += r;
                }
            }
            function rT(t, e, r) {
                t[0].x += e;
                t[0].y += r;
                t[1].x += e;
                t[1].y += r;
            }
            var rj = (function() {
                function t() {
                    var e = this;
                    p()(this, t);
                    M()(this, "context", new eK());
                    M()(this, "canRecord", function(t) {
                        var r;
                        if (!e.context.config) {
                            return;
                        }
                        e2["a"].checkImageConstraints(e.context.inputStream, (r = e.context.config) === null || r === void 0 ? void 0 : r.locator);
                        e.initCanvas();
                        e.context.framegrabber = rm.create(e.context.inputStream, e.context.canvasContainer.dom.image);
                        if (e.context.config.numOfWorkers === undefined) {
                            e.context.config.numOfWorkers = 0;
                        }
                        rS(e.context.config.numOfWorkers, e.context.config, e.context.inputStream, function() {
                            var r;
                            if (((r = e.context.config) === null || r === void 0 ? void 0 : r.numOfWorkers) === 0) {
                                e.initializeData();
                            }
                            e.ready(t);
                        });
                    });
                    M()(this, "update", function() {
                        if (e.context.onUIThread) {
                            var t = rO(e.context.framegrabber);
                            if (!t) {
                                var r;
                                e.context.framegrabber.attachData((r = e.context.inputImageWrapper) === null || r === void 0 ? void 0 : r.data);
                                if (e.context.framegrabber.grab()) {
                                    if (!t) {
                                        e.locateAndDecode();
                                    }
                                }
                            }
                        } else {
                            var n;
                            e.context.framegrabber.attachData((n = e.context.inputImageWrapper) === null || n === void 0 ? void 0 : n.data);
                            e.context.framegrabber.grab();
                            e.locateAndDecode();
                        }
                    });
                }
                y()(t, [
                    {
                        key: "initBuffers",
                        value: function t(e) {
                            if (!this.context.config) {
                                return;
                            }
                            var r = e3(this.context.inputStream, e, this.context.config.locator), n = r.inputImageWrapper, a = r.boxSize;
                            this.context.inputImageWrapper = n;
                            this.context.boxSize = a;
                        }
                    },
                    {
                        key: "initializeData",
                        value: function t(e) {
                            if (!this.context.config) {
                                return;
                            }
                            this.initBuffers(e);
                            this.context.decoder = ed.create(this.context.config.decoder, this.context.inputImageWrapper);
                        }
                    },
                    {
                        key: "getViewPort",
                        value: function t() {
                            if (!this.context.config || !this.context.config.inputStream) {
                                return null;
                            }
                            var e = this.context.config.inputStream.target;
                            return e4(e);
                        }
                    },
                    {
                        key: "ready",
                        value: function t(e) {
                            this.context.inputStream.play();
                            e();
                        }
                    },
                    {
                        key: "initCanvas",
                        value: function t() {
                            var e = e9(this.context);
                            if (!e) {
                                return;
                            }
                            var r = e.ctx, n = e.dom;
                            this.context.canvasContainer.dom.image = n.image;
                            this.context.canvasContainer.dom.overlay = n.overlay;
                            this.context.canvasContainer.ctx.image = r.image;
                            this.context.canvasContainer.ctx.overlay = r.overlay;
                        }
                    },
                    {
                        key: "initInputStream",
                        value: function t(e) {
                            if (!this.context.config || !this.context.config.inputStream) {
                                return;
                            }
                            var r = this.context.config.inputStream, n = r.type, a = r.constraints;
                            var o = rP(n, this.getViewPort(), rd), i = o.video, u = o.inputStream;
                            if (n === "LiveStream" && i) {
                                eW.request(i, a).then(function() {
                                    return u.trigger("canrecord");
                                })["catch"](function(t) {
                                    return e(t);
                                });
                            }
                            u.setAttribute("preload", "auto");
                            u.setInputStream(this.context.config.inputStream);
                            u.addEventListener("canrecord", this.canRecord.bind(undefined, e));
                            this.context.inputStream = u;
                        }
                    },
                    {
                        key: "getBoundingBoxes",
                        value: function t() {
                            var e;
                            return (e = this.context.config) !== null && e !== void 0 && e.locate ? e2["a"].locate() : [
                                [
                                    Object(eJ["clone"])(this.context.boxSize[0]),
                                    Object(eJ["clone"])(this.context.boxSize[1]),
                                    Object(eJ["clone"])(this.context.boxSize[2]),
                                    Object(eJ["clone"])(this.context.boxSize[3]), 
                                ], 
                            ];
                        }
                    },
                    {
                        key: "transformResult",
                        value: function t(e) {
                            var r = this;
                            var n = this.context.inputStream.getTopRight();
                            var a = n.x;
                            var o = n.y;
                            if (a === 0 && o === 0) {
                                return;
                            }
                            if (e.barcodes) {
                                e.barcodes.forEach(function(t) {
                                    return r.transformResult(t);
                                });
                            }
                            if (e.line && e.line.length === 2) {
                                rT(e.line, a, o);
                            }
                            if (e.box) {
                                rD(e.box, a, o);
                            }
                            if (e.boxes && e.boxes.length > 0) {
                                for(var i = 0; i < e.boxes.length; i++){
                                    rD(e.boxes[i], a, o);
                                }
                            }
                        }
                    },
                    {
                        key: "addResult",
                        value: function t(e, r) {
                            var n = this;
                            if (!r || !this.context.resultCollector) {
                                return;
                            }
                            if (e.barcodes) {
                                e.barcodes.filter(function(t) {
                                    return t.codeResult;
                                }).forEach(function(t) {
                                    return n.addResult(t, r);
                                });
                            } else if (e.codeResult) {
                                this.context.resultCollector.addResult(r, this.context.inputStream.getCanvasSize(), e.codeResult);
                            }
                        }
                    },
                    {
                        key: "hasCodeResult",
                        value: function t(e) {
                            return !!(e && (e.barcodes ? e.barcodes.some(function(t) {
                                return t.codeResult;
                            }) : e.codeResult));
                        }
                    },
                    {
                        key: "publishResult",
                        value: function t() {
                            var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
                            var r = arguments.length > 1 ? arguments[1] : undefined;
                            var n = e;
                            if (e && this.context.onUIThread) {
                                this.transformResult(e);
                                this.addResult(e, r);
                                n = e.barcodes || e;
                            }
                            ep.publish("processed", n);
                            if (this.hasCodeResult(e)) {
                                ep.publish("detected", n);
                            }
                        }
                    },
                    {
                        key: "locateAndDecode",
                        value: function t() {
                            var e = this.getBoundingBoxes();
                            if (e) {
                                var r;
                                var n = this.context.decoder.decodeFromBoundingBoxes(e) || {};
                                n.boxes = e;
                                this.publishResult(n, (r = this.context.inputImageWrapper) === null || r === void 0 ? void 0 : r.data);
                            } else {
                                var a = this.context.decoder.decodeFromImage(this.context.inputImageWrapper);
                                if (a) {
                                    var o;
                                    this.publishResult(a, (o = this.context.inputImageWrapper) === null || o === void 0 ? void 0 : o.data);
                                } else {
                                    this.publishResult();
                                }
                            }
                        }
                    },
                    {
                        key: "startContinuousUpdate",
                        value: function t() {
                            var e, r = this;
                            var n = null;
                            var a = 1000 / (((e = this.context.config) === null || e === void 0 ? void 0 : e.frequency) || 60);
                            this.context.stopped = false;
                            var o = this.context;
                            var i = function t(e) {
                                n = n || e;
                                if (!o.stopped) {
                                    if (e >= n) {
                                        n += a;
                                        r.update();
                                    }
                                    window.requestAnimationFrame(t);
                                }
                            };
                            i(performance.now());
                        }
                    },
                    {
                        key: "start",
                        value: function t() {
                            var e, r;
                            if (this.context.onUIThread && ((e = this.context.config) === null || e === void 0 ? void 0 : (r = e.inputStream) === null || r === void 0 ? void 0 : r.type) === "LiveStream") {
                                this.startContinuousUpdate();
                            } else {
                                this.update();
                            }
                        }
                    },
                    {
                        key: "stop",
                        value: (function() {
                            var t = ey()(em.a.mark(function t() {
                                var e;
                                return em.a.wrap(function t(r) {
                                    while(1){
                                        switch((r.prev = r.next)){
                                            case 0:
                                                this.context.stopped = true;
                                                rS(0);
                                                if (!((e = this.context.config) !== null && e !== void 0 && e.inputStream && this.context.config.inputStream.type === "LiveStream")) {
                                                    r.next = 6;
                                                    break;
                                                }
                                                r.next = 5;
                                                return eW.release();
                                            case 5:
                                                this.context.inputStream.clearEventHandlers();
                                            case 6:
                                            case "end":
                                                return r.stop();
                                        }
                                    }
                                }, t, this);
                            }));
                            function e() {
                                return t.apply(this, arguments);
                            }
                            return e;
                        })()
                    },
                    {
                        key: "setReaders",
                        value: function t(e) {
                            if (this.context.decoder) {
                                this.context.decoder.setReaders(e);
                            }
                            rA(e);
                        }
                    },
                    {
                        key: "registerReader",
                        value: function t(e, r) {
                            ed.registerReader(e, r);
                            if (this.context.decoder) {
                                this.context.decoder.registerReader(e, r);
                            }
                            rk(e, r);
                        }
                    }, 
                ]);
                return t;
            })();
            var rI = new rj();
            var rz = rI.context;
            var rL = {
                init: function t(e, r, n) {
                    var a = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : rI;
                    var o;
                    if (!r) {
                        o = new Promise(function(t, e) {
                            r = function r(n) {
                                n ? e(n) : t();
                            };
                        });
                    }
                    a.context.config = u()({}, e$, e);
                    if (a.context.config.numOfWorkers > 0) {
                        a.context.config.numOfWorkers = 0;
                    }
                    if (n) {
                        a.context.onUIThread = false;
                        a.initializeData(n);
                        if (r) {
                            r();
                        }
                    } else {
                        a.initInputStream(r);
                    }
                    return o;
                },
                start: function t() {
                    return rI.start();
                },
                stop: function t() {
                    return rI.stop();
                },
                pause: function t() {
                    rz.stopped = true;
                },
                onDetected: function t(e) {
                    if (!e || (typeof e !== "function" && (o()(e) !== "object" || !e.callback))) {
                        console.trace("* warning: Quagga.onDetected called with invalid callback, ignoring");
                        return;
                    }
                    ep.subscribe("detected", e);
                },
                offDetected: function t(e) {
                    ep.unsubscribe("detected", e);
                },
                onProcessed: function t(e) {
                    if (!e || (typeof e !== "function" && (o()(e) !== "object" || !e.callback))) {
                        console.trace("* warning: Quagga.onProcessed called with invalid callback, ignoring");
                        return;
                    }
                    ep.subscribe("processed", e);
                },
                offProcessed: function t(e) {
                    ep.unsubscribe("processed", e);
                },
                setReaders: function t(e) {
                    if (!e) {
                        console.trace("* warning: Quagga.setReaders called with no readers, ignoring");
                        return;
                    }
                    rI.setReaders(e);
                },
                registerReader: function t(e, r) {
                    if (!e) {
                        console.trace("* warning: Quagga.registerReader called with no name, ignoring");
                        return;
                    }
                    if (!r) {
                        console.trace("* warning: Quagga.registerReader called with no reader, ignoring");
                        return;
                    }
                    rI.registerReader(e, r);
                },
                registerResultCollector: function t(e) {
                    if (e && typeof e.addResult === "function") {
                        rz.resultCollector = e;
                    }
                },
                get canvas () {
                    return rz.canvasContainer;
                },
                decodeSingle: function t(e, r) {
                    var n = this;
                    var a = new rj();
                    e = u()({
                        inputStream: {
                            type: "ImageStream",
                            sequence: false,
                            size: 800,
                            src: e.src
                        },
                        numOfWorkers: true && e.debug ? 0 : 1,
                        locator: {
                            halfSample: false
                        }
                    }, e);
                    if (e.numOfWorkers > 0) {
                        e.numOfWorkers = 0;
                    }
                    if (e.numOfWorkers > 0 && (typeof Blob === "undefined" || typeof Worker === "undefined")) {
                        console.warn("* no Worker and/or Blob support - forcing numOfWorkers to 0");
                        e.numOfWorkers = 0;
                    }
                    return new Promise(function(t, o) {
                        try {
                            n.init(e, function() {
                                ep.once("processed", function(e) {
                                    a.stop();
                                    if (r) {
                                        r.call(null, e);
                                    }
                                    t(e);
                                }, true);
                                a.start();
                            }, null, a);
                        } catch (i) {
                            o(i);
                        }
                    });
                },
                get default () {
                    return rL;
                },
                Readers: n,
                CameraAccess: eW,
                ImageDebug: h["a"],
                ImageWrapper: f["a"],
                ResultCollector: eq
            };
            var rN = (e["default"] = rL);
        }
    ])["default"];
});
