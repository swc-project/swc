(function t(r, e) {
    if (typeof exports === "object" && typeof module === "object") module.exports = e();
    else if (typeof define === "function" && define.amd) define([], e);
    else if (typeof exports === "object") exports["Quagga"] = e();
    else r["Quagga"] = e();
})(window, function() {
    return (function(t) {
        var r = {};
        function e(n) {
            if (r[n]) {
                return r[n].exports;
            }
            var a = (r[n] = {
                i: n,
                l: false,
                exports: {}
            });
            t[n].call(a.exports, a, a.exports, e);
            a.l = true;
            return a.exports;
        }
        e.m = t;
        e.c = r;
        e.d = function(t, r, n) {
            if (!e.o(t, r)) {
                Object.defineProperty(t, r, {
                    enumerable: true,
                    get: n
                });
            }
        };
        e.r = function(t) {
            if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
                Object.defineProperty(t, Symbol.toStringTag, {
                    value: "Module"
                });
            }
            Object.defineProperty(t, "__esModule", {
                value: true
            });
        };
        e.t = function(t, r) {
            if (r & 1) t = e(t);
            if (r & 8) return t;
            if (r & 4 && typeof t === "object" && t && t.__esModule) return t;
            var n = Object.create(null);
            e.r(n);
            Object.defineProperty(n, "default", {
                enumerable: true,
                value: t
            });
            if (r & 2 && typeof t != "string") for(var a in t)e.d(n, a, function(r) {
                return t[r];
            }.bind(null, a));
            return n;
        };
        e.n = function(t) {
            var r = t && t.__esModule ? function r() {
                return t["default"];
            } : function r() {
                return t;
            };
            e.d(r, "a", r);
            return r;
        };
        e.o = function(t, r) {
            return Object.prototype.hasOwnProperty.call(t, r);
        };
        e.p = "/";
        return e((e.s = 89));
    })([
        function(t, r) {
            function e(t, r, e) {
                if (r in t) {
                    Object.defineProperty(t, r, {
                        value: e,
                        enumerable: true,
                        configurable: true,
                        writable: true
                    });
                } else {
                    t[r] = e;
                }
                return t;
            }
            t.exports = e;
            (t.exports["default"] = t.exports), (t.exports.__esModule = true);
        },
        function(t, r) {
            function e(t) {
                if (t === void 0) {
                    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                }
                return t;
            }
            t.exports = e;
            (t.exports["default"] = t.exports), (t.exports.__esModule = true);
        },
        function(t, r) {
            function e(r) {
                t.exports = e = Object.setPrototypeOf ? Object.getPrototypeOf : function t(r) {
                    return r.__proto__ || Object.getPrototypeOf(r);
                };
                (t.exports["default"] = t.exports), (t.exports.__esModule = true);
                return e(r);
            }
            t.exports = e;
            (t.exports["default"] = t.exports), (t.exports.__esModule = true);
        },
        function(t, r) {
            function e(t, r) {
                if (!(t instanceof r)) {
                    throw new TypeError("Cannot call a class as a function");
                }
            }
            t.exports = e;
            (t.exports["default"] = t.exports), (t.exports.__esModule = true);
        },
        function(t, r) {
            function e(t, r) {
                for(var e = 0; e < r.length; e++){
                    var n = r[e];
                    n.enumerable = n.enumerable || false;
                    n.configurable = true;
                    if ("value" in n) n.writable = true;
                    Object.defineProperty(t, n.key, n);
                }
            }
            function n(t, r, n) {
                if (r) e(t.prototype, r);
                if (n) e(t, n);
                return t;
            }
            t.exports = n;
            (t.exports["default"] = t.exports), (t.exports.__esModule = true);
        },
        function(t, r, e) {
            var n = e(19)["default"];
            var a = e(1);
            function o(t, r) {
                if (r && (n(r) === "object" || typeof r === "function")) {
                    return r;
                } else if (r !== void 0) {
                    throw new TypeError("Derived constructors may only return object or undefined");
                }
                return a(t);
            }
            t.exports = o;
            (t.exports["default"] = t.exports), (t.exports.__esModule = true);
        },
        function(t, r, e) {
            var n = e(41);
            function a(t, r) {
                if (typeof r !== "function" && r !== null) {
                    throw new TypeError("Super expression must either be null or a function");
                }
                t.prototype = Object.create(r && r.prototype, {
                    constructor: {
                        value: t,
                        writable: true,
                        configurable: true
                    }
                });
                if (r) n(t, r);
            }
            t.exports = a;
            (t.exports["default"] = t.exports), (t.exports.__esModule = true);
        },
        function(t, r, e) {
            t.exports = {
                EPSILON: e(62),
                create: e(63),
                clone: e(156),
                fromValues: e(157),
                copy: e(158),
                set: e(159),
                equals: e(160),
                exactEquals: e(161),
                add: e(162),
                subtract: e(64),
                sub: e(163),
                multiply: e(65),
                mul: e(164),
                divide: e(66),
                div: e(165),
                inverse: e(166),
                min: e(167),
                max: e(168),
                rotate: e(169),
                floor: e(170),
                ceil: e(171),
                round: e(172),
                scale: e(173),
                scaleAndAdd: e(174),
                distance: e(67),
                dist: e(175),
                squaredDistance: e(68),
                sqrDist: e(176),
                length: e(69),
                len: e(177),
                squaredLength: e(70),
                sqrLen: e(178),
                negate: e(179),
                normalize: e(180),
                dot: e(181),
                cross: e(182),
                lerp: e(183),
                random: e(184),
                transformMat2: e(185),
                transformMat2d: e(186),
                transformMat3: e(187),
                transformMat4: e(188),
                forEach: e(189),
                limit: e(190)
            };
        },
        function(t, r, e) {
            "use strict";
            e.d(r, "h", function() {
                return f;
            });
            e.d(r, "i", function() {
                return p;
            });
            e.d(r, "b", function() {
                return g;
            });
            e.d(r, "j", function() {
                return S;
            });
            e.d(r, "e", function() {
                return D;
            });
            e.d(r, "c", function() {
                return P;
            });
            e.d(r, "f", function() {
                return I;
            });
            e.d(r, "g", function() {
                return z;
            });
            e.d(r, "a", function() {
                return W;
            });
            e.d(r, "d", function() {
                return j;
            });
            var n = e(7);
            var a = e(84);
            var o = {
                clone: n["clone"],
                dot: n["dot"]
            };
            var i = {
                create: function t(r, e) {
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
                    function s() {
                        var t;
                        var r = 0;
                        for(t = 0; t < n.length; t++){
                            r += n[t].rad;
                        }
                        a.rad = r / n.length;
                        a.vec = o.clone([
                            Math.cos(a.rad),
                            Math.sin(a.rad), 
                        ]);
                    }
                    function c() {
                        u(r);
                        s();
                    }
                    c();
                    return {
                        add: function t(r) {
                            if (!i[r.id]) {
                                u(r);
                                s();
                            }
                        },
                        fits: function t(r) {
                            var n = Math.abs(o.dot(r.point.vec, a.vec));
                            if (n > e) {
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
                createPoint: function t(r, e, n) {
                    return {
                        rad: r[n],
                        point: r,
                        id: e
                    };
                }
            };
            var u = e(10);
            var s = {
                clone: n["clone"]
            };
            var c = {
                clone: a["clone"]
            };
            function f(t, r) {
                var e = {
                    x: t,
                    y: r,
                    toVec2: function t() {
                        return s.clone([
                            this.x,
                            this.y
                        ]);
                    },
                    toVec3: function t() {
                        return c.clone([
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
                return e;
            }
            function l(t, r) {
                var e = t.data;
                var n = t.size.x;
                var a = t.size.y;
                var o = r.data;
                var i = 0;
                var u = 0;
                var s = 0;
                var c = 0;
                var f = 0;
                var l;
                var v;
                s = n;
                i = 0;
                for(v = 1; v < a; v++){
                    i += e[u];
                    o[s] += i;
                    u += n;
                    s += n;
                }
                u = 0;
                s = 1;
                i = 0;
                for(l = 1; l < n; l++){
                    i += e[u];
                    o[s] += i;
                    u++;
                    s++;
                }
                for(v = 1; v < a; v++){
                    u = v * n + 1;
                    s = (v - 1) * n + 1;
                    c = v * n;
                    f = (v - 1) * n;
                    for(l = 1; l < n; l++){
                        o[u] += e[u] + o[s] + o[c] - o[f];
                        u++;
                        s++;
                        c++;
                        f++;
                    }
                }
            }
            function v(t, r) {
                var e = t.data;
                var n = t.size.x;
                var a = t.size.y;
                var o = r.data;
                var i = 0;
                for(var u = 0; u < n; u++){
                    i += e[u];
                    o[u] = i;
                }
                for(var s = 1; s < a; s++){
                    i = 0;
                    for(var c = 0; c < n; c++){
                        i += e[s * n + c];
                        o[s * n + c] = i + o[(s - 1) * n + c];
                    }
                }
            }
            function h(t, r, e) {
                if (!e) {
                    e = t;
                }
                var n = t.data;
                var a = n.length;
                var o = e.data;
                while(a--){
                    o[a] = n[a] < r ? 1 : 0;
                }
            }
            function d(t, r) {
                if (!r) {
                    r = 8;
                }
                var e = t.data;
                var n = e.length;
                var a = 8 - r;
                var o = 1 << r;
                var i = new Int32Array(o);
                while(n--){
                    i[e[n] >> a]++;
                }
                return i;
            }
            function $(t) {
                var r;
                var e = t.length;
                var n = t[0];
                var a = t[1];
                var o;
                for(r = 1; r < e - 1; r++){
                    o = t[r + 1];
                    t[r - 1] = (a * 2 - n - o) & 255;
                    n = a;
                    a = o;
                }
                return t;
            }
            function _(t) {
                var r = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 8;
                var e;
                var n = 8 - r;
                function a(t, r) {
                    var n = 0;
                    for(var a = t; a <= r; a++){
                        n += e[a];
                    }
                    return n;
                }
                function o(t, r) {
                    var n = 0;
                    for(var a = t; a <= r; a++){
                        n += a * e[a];
                    }
                    return n;
                }
                function i() {
                    var n = [
                        0
                    ];
                    var i;
                    var s;
                    var c;
                    var f;
                    var l;
                    var v;
                    var h = (1 << r) - 1;
                    e = d(t, r);
                    for(var $ = 1; $ < h; $++){
                        i = a(0, $);
                        s = a($ + 1, h);
                        c = i * s;
                        if (c === 0) {
                            c = 1;
                        }
                        f = o(0, $) * s;
                        l = o($ + 1, h) * i;
                        v = f - l;
                        n[$] = (v * v) / c;
                    }
                    return u["a"].maxIndex(n);
                }
                var s = i();
                return s << n;
            }
            function p(t, r) {
                var e = _(t);
                h(t, e, r);
                return e;
            }
            function x(t, r, e) {
                v(t, r);
                if (!e) {
                    e = t;
                }
                var n = t.data;
                var a = e.data;
                var o = t.size.x;
                var i = t.size.y;
                var u = r.data;
                var s = 0;
                var c;
                var f;
                var l = 3;
                var h;
                var d;
                var $;
                var _;
                var p;
                var x = (l * 2 + 1) * (l * 2 + 1);
                for(c = 0; c <= l; c++){
                    for(f = 0; f < o; f++){
                        a[c * o + f] = 0;
                        a[(i - 1 - c) * o + f] = 0;
                    }
                }
                for(c = l; c < i - l; c++){
                    for(f = 0; f <= l; f++){
                        a[c * o + f] = 0;
                        a[c * o + (o - 1 - f)] = 0;
                    }
                }
                for(c = l + 1; c < i - l - 1; c++){
                    for(f = l + 1; f < o - l; f++){
                        h = u[(c - l - 1) * o + (f - l - 1)];
                        d = u[(c - l - 1) * o + (f + l)];
                        $ = u[(c + l) * o + (f - l - 1)];
                        _ = u[(c + l) * o + (f + l)];
                        s = _ - $ - d + h;
                        p = s / x;
                        a[c * o + f] = n[c * o + f] > p + 5 ? 0 : 1;
                    }
                }
            }
            function g(t, r, e) {
                var n;
                var a;
                var o;
                var u;
                var s = [];
                if (!e) {
                    e = "rad";
                }
                function c(t) {
                    var r = false;
                    for(a = 0; a < s.length; a++){
                        o = s[a];
                        if (o.fits(t)) {
                            o.add(t);
                            r = true;
                        }
                    }
                    return r;
                }
                for(n = 0; n < t.length; n++){
                    u = i.createPoint(t[n], n, e);
                    if (!c(u)) {
                        s.push(i.create(u, r));
                    }
                }
                return s;
            }
            var y = {
                trace: function t(r, e) {
                    var n;
                    var a = 10;
                    var o = [];
                    var i = [];
                    var u = 0;
                    var s = 0;
                    function t(t, n) {
                        var a;
                        var o;
                        var i;
                        var u = 1;
                        var s = Math.abs(e[1] / 10);
                        var c = false;
                        function f(t, r) {
                            if (t.x > r.x - u && t.x < r.x + u && t.y > r.y - s && t.y < r.y + s) {
                                return true;
                            }
                            return false;
                        }
                        var l = r[t];
                        if (n) {
                            i = {
                                x: l.x + e[0],
                                y: l.y + e[1]
                            };
                        } else {
                            i = {
                                x: l.x - e[0],
                                y: l.y - e[1]
                            };
                        }
                        o = n ? t + 1 : t - 1;
                        a = r[o];
                        while(a && (c = f(a, i)) !== true && Math.abs(a.y - l.y) < e[1]){
                            o = n ? o + 1 : o - 1;
                            a = r[o];
                        }
                        return c ? o : null;
                    }
                    for(n = 0; n < a; n++){
                        u = Math.floor(Math.random() * r.length);
                        o = [];
                        s = u;
                        o.push(r[s]);
                        while((s = t(s, true)) !== null){
                            o.push(r[s]);
                        }
                        if (u > 0) {
                            s = u;
                            while((s = t(s, false)) !== null){
                                o.push(r[s]);
                            }
                        }
                        if (o.length > i.length) {
                            i = o;
                        }
                    }
                    return i;
                }
            };
            var m = 1;
            var w = 2;
            function b(t, r) {
                var e;
                var n;
                var a = t.data;
                var o = r.data;
                var i = t.size.y;
                var u = t.size.x;
                var s;
                var c;
                var f;
                var l;
                var v;
                for(e = 1; e < i - 1; e++){
                    for(n = 1; n < u - 1; n++){
                        c = e - 1;
                        f = e + 1;
                        l = n - 1;
                        v = n + 1;
                        s = a[c * u + l] + a[c * u + v] + a[e * u + n] + a[f * u + l] + a[f * u + v];
                        o[e * u + n] = s > 0 ? 1 : 0;
                    }
                }
            }
            function C(t, r) {
                var e;
                var n;
                var a = t.data;
                var o = r.data;
                var i = t.size.y;
                var u = t.size.x;
                var s;
                var c;
                var f;
                var l;
                var v;
                for(e = 1; e < i - 1; e++){
                    for(n = 1; n < u - 1; n++){
                        c = e - 1;
                        f = e + 1;
                        l = n - 1;
                        v = n + 1;
                        s = a[c * u + l] + a[c * u + v] + a[e * u + n] + a[f * u + l] + a[f * u + v];
                        o[e * u + n] = s === 5 ? 1 : 0;
                    }
                }
            }
            function R(t, r, e) {
                if (!e) {
                    e = t;
                }
                var n = t.data.length;
                var a = t.data;
                var o = r.data;
                var i = e.data;
                while(n--){
                    i[n] = a[n] - o[n];
                }
            }
            function E(t, r, e) {
                if (!e) {
                    e = t;
                }
                var n = t.data.length;
                var a = t.data;
                var o = r.data;
                var i = e.data;
                while(n--){
                    i[n] = a[n] || o[n];
                }
            }
            function O(t) {
                var r = t.data.length;
                var e = t.data;
                var n = 0;
                while(r--){
                    n += e[r];
                }
                return n;
            }
            function S(t, r, e) {
                var n;
                var a = 0;
                var o = 0;
                var i = [];
                var u;
                var s;
                var c;
                for(n = 0; n < r; n++){
                    i[n] = {
                        score: 0,
                        item: null
                    };
                }
                for(n = 0; n < t.length; n++){
                    u = e.apply(this, [
                        t[n]
                    ]);
                    if (u > o) {
                        s = i[a];
                        s.score = u;
                        s.item = t[n];
                        o = Number.MAX_VALUE;
                        for(c = 0; c < r; c++){
                            if (i[c].score < o) {
                                o = i[c].score;
                                a = c;
                            }
                        }
                    }
                }
                return i;
            }
            function k(t, r, e, n) {
                e.drawImage(t, r, 0, t.width, t.height);
                var a = e.getImageData(r, 0, t.width, t.height).data;
                P(a, n);
            }
            function A(t, r, e, n) {
                var a = t.getImageData(e.x, e.y, r.x, r.y).data;
                P(a, n);
            }
            function D(t, r, e) {
                var n = 0;
                var a = r.x;
                var o = Math.floor(t.length / 4);
                var i = r.x / 2;
                var u = 0;
                var s = r.x;
                var c;
                while(a < o){
                    for(c = 0; c < i; c++){
                        e[u] = (0.299 * t[n * 4 + 0] + 0.587 * t[n * 4 + 1] + 0.114 * t[n * 4 + 2] + (0.299 * t[(n + 1) * 4 + 0] + 0.587 * t[(n + 1) * 4 + 1] + 0.114 * t[(n + 1) * 4 + 2]) + (0.299 * t[a * 4 + 0] + 0.587 * t[a * 4 + 1] + 0.114 * t[a * 4 + 2]) + (0.299 * t[(a + 1) * 4 + 0] + 0.587 * t[(a + 1) * 4 + 1] + 0.114 * t[(a + 1) * 4 + 2])) / 4;
                        u++;
                        n += 2;
                        a += 2;
                    }
                    n += s;
                    a += s;
                }
            }
            function P(t, r, e) {
                var n = (t.length / 4) | 0;
                var a = e && e.singleChannel === true;
                if (a) {
                    for(var o = 0; o < n; o++){
                        r[o] = t[o * 4 + 0];
                    }
                } else {
                    for(var i = 0; i < n; i++){
                        r[i] = 0.299 * t[i * 4 + 0] + 0.587 * t[i * 4 + 1] + 0.114 * t[i * 4 + 2];
                    }
                }
            }
            function T(t, r) {
                var e = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : document && document.createElement("canvas");
                var n = new Image();
                n.callback = r;
                n.onload = function() {
                    e.width = this.width;
                    e.height = this.height;
                    var t = e.getContext("2d");
                    t.drawImage(this, 0, 0);
                    var r = new Uint8Array(this.width * this.height);
                    t.drawImage(this, 0, 0);
                    var n = t.getImageData(0, 0, this.width, this.height), a = n.data;
                    P(a, r);
                    this.callback(r, {
                        x: this.width,
                        y: this.height
                    }, this);
                };
                n.src = t;
            }
            function I(t, r) {
                var e = t.data;
                var n = t.size.x;
                var a = r.data;
                var o = 0;
                var i = n;
                var u = e.length;
                var s = n / 2;
                var c = 0;
                while(i < u){
                    for(var f = 0; f < s; f++){
                        a[c] = Math.floor((e[o] + e[o + 1] + e[i] + e[i + 1]) / 4);
                        c++;
                        o += 2;
                        i += 2;
                    }
                    o += n;
                    i += n;
                }
            }
            function z(t) {
                var r = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [
                    0,
                    0,
                    0
                ];
                var e = t[0];
                var n = t[1];
                var a = t[2];
                var o = a * n;
                var i = o * (1 - Math.abs(((e / 60) % 2) - 1));
                var u = a - o;
                var s = 0;
                var c = 0;
                var f = 0;
                if (e < 60) {
                    s = o;
                    c = i;
                } else if (e < 120) {
                    s = i;
                    c = o;
                } else if (e < 180) {
                    c = o;
                    f = i;
                } else if (e < 240) {
                    c = i;
                    f = o;
                } else if (e < 300) {
                    s = i;
                    f = o;
                } else if (e < 360) {
                    s = o;
                    f = i;
                }
                r[0] = ((s + u) * 255) | 0;
                r[1] = ((c + u) * 255) | 0;
                r[2] = ((f + u) * 255) | 0;
                return r;
            }
            function M(t) {
                var r = [];
                var e = [];
                for(var n = 1; n < Math.sqrt(t) + 1; n++){
                    if (t % n === 0) {
                        e.push(n);
                        if (n !== t / n) {
                            r.unshift(Math.floor(t / n));
                        }
                    }
                }
                return e.concat(r);
            }
            function L(t, r) {
                var e = 0;
                var n = 0;
                var a = [];
                while(e < t.length && n < r.length){
                    if (t[e] === r[n]) {
                        a.push(t[e]);
                        e++;
                        n++;
                    } else if (t[e] > r[n]) {
                        n++;
                    } else {
                        e++;
                    }
                }
                return a;
            }
            function W(t, r) {
                var e = M(r.x);
                var n = M(r.y);
                var a = Math.max(r.x, r.y);
                var o = L(e, n);
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
                var s = u[t] || u.medium;
                var c = i[s];
                var f = Math.floor(a / c);
                var l;
                function v(t) {
                    var r = 0;
                    var e = t[Math.floor(t.length / 2)];
                    while(r < t.length - 1 && t[r] < f){
                        r++;
                    }
                    if (r > 0) {
                        if (Math.abs(t[r] - f) > Math.abs(t[r - 1] - f)) {
                            e = t[r - 1];
                        } else {
                            e = t[r];
                        }
                    }
                    if (f / e < i[s + 1] / i[s] && f / e > i[s - 1] / i[s]) {
                        return {
                            x: e,
                            y: e
                        };
                    }
                    return null;
                }
                l = v(o);
                if (!l) {
                    l = v(M(a));
                    if (!l) {
                        l = v(M(f * c));
                    }
                }
                return l;
            }
            function U(t) {
                var r = {
                    value: parseFloat(t),
                    unit: t.indexOf("%") === t.length - 1 ? "%" : "%"
                };
                return r;
            }
            var N = {
                top: function t(r, e) {
                    return r.unit === "%" ? Math.floor(e.height * (r.value / 100)) : null;
                },
                right: function t(r, e) {
                    return r.unit === "%" ? Math.floor(e.width - e.width * (r.value / 100)) : null;
                },
                bottom: function t(r, e) {
                    return r.unit === "%" ? Math.floor(e.height - e.height * (r.value / 100)) : null;
                },
                left: function t(r, e) {
                    return r.unit === "%" ? Math.floor(e.width * (r.value / 100)) : null;
                }
            };
            function j(t, r, e) {
                var n = {
                    width: t,
                    height: r
                };
                var a = Object.keys(e).reduce(function(t, r) {
                    var a = e[r];
                    var o = U(a);
                    var i = N[r](o, n);
                    t[r] = i;
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
        function(t, r, e) {
            "use strict";
            r["a"] = {
                drawRect: function t(r, e, n, a) {
                    n.strokeStyle = a.color;
                    n.fillStyle = a.color;
                    n.lineWidth = a.lineWidth || 1;
                    n.beginPath();
                    n.strokeRect(r.x, r.y, e.x, e.y);
                },
                drawPath: function t(r, e, n, a) {
                    n.strokeStyle = a.color;
                    n.fillStyle = a.color;
                    n.lineWidth = a.lineWidth;
                    n.beginPath();
                    n.moveTo(r[0][e.x], r[0][e.y]);
                    for(var o = 1; o < r.length; o++){
                        n.lineTo(r[o][e.x], r[o][e.y]);
                    }
                    n.closePath();
                    n.stroke();
                },
                drawImage: function t(r, e, n) {
                    var a = n.getImageData(0, 0, e.x, e.y);
                    var o = a.data;
                    var i = o.length;
                    var u = r.length;
                    if (i / u !== 4) {
                        return false;
                    }
                    while(u--){
                        var s = r[u];
                        o[--i] = 255;
                        o[--i] = s;
                        o[--i] = s;
                        o[--i] = s;
                    }
                    n.putImageData(a, 0, 0);
                    return true;
                }
            };
        },
        function(t, r, e) {
            "use strict";
            r["a"] = {
                init: function t(r, e) {
                    var n = r.length;
                    while(n--){
                        r[n] = e;
                    }
                },
                shuffle: function t(r) {
                    var e = r.length - 1;
                    for(e; e >= 0; e--){
                        var n = Math.floor(Math.random() * e);
                        var a = r[e];
                        r[e] = r[n];
                        r[n] = a;
                    }
                    return r;
                },
                toPointList: function t(r) {
                    var e = r.reduce(function(t, r) {
                        var e = "[".concat(r.join(","), "]");
                        t.push(e);
                        return t;
                    }, []);
                    return "[".concat(e.join(",\r\n"), "]");
                },
                threshold: function t(r, e, n) {
                    var a = r.reduce(function(t, a) {
                        if (n.apply(r, [
                            a
                        ]) >= e) {
                            t.push(a);
                        }
                        return t;
                    }, []);
                    return a;
                },
                maxIndex: function t(r) {
                    var e = 0;
                    for(var n = 0; n < r.length; n++){
                        if (r[n] > r[e]) {
                            e = n;
                        }
                    }
                    return e;
                },
                max: function t(r) {
                    var t = 0;
                    for(var e = 0; e < r.length; e++){
                        if (r[e] > t) {
                            t = r[e];
                        }
                    }
                    return t;
                },
                sum: function t(r) {
                    var e = r.length;
                    var t = 0;
                    while(e--){
                        t += r[e];
                    }
                    return t;
                }
            };
        },
        function(t, r, e) {
            "use strict";
            var n = e(83);
            var a = e.n(n);
            var o = e(3);
            var i = e.n(o);
            var u = e(4);
            var s = e.n(u);
            var c = e(0);
            var f = e.n(c);
            var l = e(7);
            var v = e.n(l);
            var h = e(8);
            var d = e(10);
            var $ = {
                clone: l["clone"]
            };
            function _(t) {
                if (t < 0) {
                    throw new Error("expected positive number, received ".concat(t));
                }
            }
            var p = (function() {
                function t(r, e) {
                    var n = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Uint8Array;
                    var a = arguments.length > 3 ? arguments[3] : undefined;
                    i()(this, t);
                    f()(this, "data", void 0);
                    f()(this, "size", void 0);
                    f()(this, "indexMapping", void 0);
                    if (!e) {
                        this.data = new n(r.x * r.y);
                        if (a) {
                            d["a"].init(this.data, 0);
                        }
                    } else {
                        this.data = e;
                    }
                    this.size = r;
                }
                s()(t, [
                    {
                        key: "inImageWithBorder",
                        value: function t(r) {
                            var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
                            _(e);
                            return (r.x >= 0 && r.y >= 0 && r.x < this.size.x + e * 2 && r.y < this.size.y + e * 2);
                        }
                    },
                    {
                        key: "subImageAsCopy",
                        value: function t(r, e) {
                            _(e.x);
                            _(e.y);
                            var n = r.size, a = n.x, o = n.y;
                            for(var i = 0; i < a; i++){
                                for(var u = 0; u < o; u++){
                                    r.data[u * a + i] = this.data[(e.y + u) * this.size.x + e.x + i];
                                }
                            }
                            return r;
                        }
                    },
                    {
                        key: "get",
                        value: function t(r, e) {
                            return this.data[e * this.size.x + r];
                        }
                    },
                    {
                        key: "getSafe",
                        value: function t(r, e) {
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
                            return this.data[this.indexMapping.y[e + this.size.y] * this.size.x + this.indexMapping.x[r + this.size.x]];
                        }
                    },
                    {
                        key: "set",
                        value: function t(r, e, n) {
                            this.data[e * this.size.x + r] = n;
                            delete this.indexMapping;
                            return this;
                        }
                    },
                    {
                        key: "zeroBorder",
                        value: function t() {
                            var r = this.size, e = r.x, n = r.y;
                            for(var a = 0; a < e; a++){
                                this.data[a] = this.data[(n - 1) * e + a] = 0;
                            }
                            for(var o = 1; o < n - 1; o++){
                                this.data[o * e] = this.data[o * e + (e - 1)] = 0;
                            }
                            delete this.indexMapping;
                            return this;
                        }
                    },
                    {
                        key: "moments",
                        value: function t(r) {
                            var e = this.data;
                            var n;
                            var a;
                            var o = this.size.y;
                            var i = this.size.x;
                            var u;
                            var s;
                            var c = [];
                            var f;
                            var l;
                            var v;
                            var h;
                            var d;
                            var _;
                            var p;
                            var x;
                            var g = [];
                            var y = Math.PI;
                            var m = y / 4;
                            if (r <= 0) {
                                return g;
                            }
                            for(f = 0; f < r; f++){
                                c[f] = {
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
                                s = a * a;
                                for(n = 0; n < i; n++){
                                    u = e[a * i + n];
                                    if (u > 0) {
                                        l = c[u - 1];
                                        l.m00 += 1;
                                        l.m01 += a;
                                        l.m10 += n;
                                        l.m11 += n * a;
                                        l.m02 += s;
                                        l.m20 += n * n;
                                    }
                                }
                            }
                            for(f = 0; f < r; f++){
                                l = c[f];
                                if (!isNaN(l.m00) && l.m00 !== 0) {
                                    _ = l.m10 / l.m00;
                                    p = l.m01 / l.m00;
                                    v = l.m11 / l.m00 - _ * p;
                                    h = l.m02 / l.m00 - p * p;
                                    d = l.m20 / l.m00 - _ * _;
                                    x = (h - d) / (2 * v);
                                    x = 0.5 * Math.atan(x) + (v >= 0 ? m : -m) + y;
                                    l.theta = (((x * 180) / y + 90) % 180) - 90;
                                    if (l.theta < 0) {
                                        l.theta += 180;
                                    }
                                    l.rad = x > y ? x - y : x;
                                    l.vec = $.clone([
                                        Math.cos(x),
                                        Math.sin(x), 
                                    ]);
                                    g.push(l);
                                }
                            }
                            return g;
                        }
                    },
                    {
                        key: "getAsRGBA",
                        value: function t() {
                            var r = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1.0;
                            var e = new Uint8ClampedArray(4 * this.size.x * this.size.y);
                            for(var n = 0; n < this.size.y; n++){
                                for(var a = 0; a < this.size.x; a++){
                                    var o = n * this.size.x + a;
                                    var i = this.get(a, n) * r;
                                    e[o * 4 + 0] = i;
                                    e[o * 4 + 1] = i;
                                    e[o * 4 + 2] = i;
                                    e[o * 4 + 3] = 255;
                                }
                            }
                            return e;
                        }
                    },
                    {
                        key: "show",
                        value: function t(r) {
                            var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1.0;
                            var n = r.getContext("2d");
                            if (!n) {
                                throw new Error("Unable to get canvas context");
                            }
                            var a = n.getImageData(0, 0, r.width, r.height);
                            var o = this.getAsRGBA(e);
                            r.width = this.size.x;
                            r.height = this.size.y;
                            var i = new ImageData(o, a.width, a.height);
                            n.putImageData(i, 0, 0);
                        }
                    },
                    {
                        key: "overlay",
                        value: function t(r, e, n) {
                            var o = e < 0 || e > 360 ? 360 : e;
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
                            var s = [
                                255,
                                255,
                                255
                            ];
                            var c = [
                                0,
                                0,
                                0
                            ];
                            var f = [];
                            var l = r.getContext("2d");
                            if (!l) {
                                throw new Error("Unable to get canvas context");
                            }
                            var v = l.getImageData(n.x, n.y, this.size.x, this.size.y);
                            var d = v.data;
                            var $ = this.data.length;
                            while($--){
                                i[0] = this.data[$] * o;
                                f = i[0] <= 0 ? s : i[0] >= 360 ? c : Object(h["g"])(i, u);
                                var _ = $ * 4;
                                var p = f;
                                var x = a()(p, 3);
                                d[_] = x[0];
                                d[_ + 1] = x[1];
                                d[_ + 2] = x[2];
                                d[_ + 3] = 255;
                            }
                            l.putImageData(v, n.x, n.y);
                        }
                    }, 
                ]);
                return t;
            })();
            r["a"] = p;
        },
        function(t, r, e) {
            t.exports = e(228);
        },
        function(t, r, e) {
            var n = e(227);
            function a(r, e, o) {
                if (typeof Reflect !== "undefined" && Reflect.get) {
                    t.exports = a = Reflect.get;
                    (t.exports["default"] = t.exports), (t.exports.__esModule = true);
                } else {
                    t.exports = a = function t(r, e, a) {
                        var o = n(r, e);
                        if (!o) return;
                        var i = Object.getOwnPropertyDescriptor(o, e);
                        if (i.get) {
                            return i.get.call(a);
                        }
                        return i.value;
                    };
                    (t.exports["default"] = t.exports), (t.exports.__esModule = true);
                }
                return a(r, e, o || r);
            }
            t.exports = a;
            (t.exports["default"] = t.exports), (t.exports.__esModule = true);
        },
        function(t, r) {
            function e(t) {
                var r = typeof t;
                return (t != null && (r == "object" || r == "function"));
            }
            t.exports = e;
        },
        function(t, r) {
            var e = Array.isArray;
            t.exports = e;
        },
        function(t, r, e) {
            var n = e(90), a = e(145);
            var o = a(function(t, r, e) {
                n(t, r, e);
            });
            t.exports = o;
        },
        function(t, r, e) {
            var n = e(45);
            var a = typeof self == "object" && self && self.Object === Object && self;
            var o = n || a || Function("return this")();
            t.exports = o;
        },
        function(t, r) {
            function e(t) {
                return t != null && typeof t == "object";
            }
            t.exports = e;
        },
        function(t, r) {
            function e(r) {
                "@babel/helpers - typeof";
                if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
                    t.exports = e = function t(r) {
                        return typeof r;
                    };
                    (t.exports["default"] = t.exports), (t.exports.__esModule = true);
                } else {
                    t.exports = e = function t(r) {
                        return r && typeof Symbol === "function" && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r;
                    };
                    (t.exports["default"] = t.exports), (t.exports.__esModule = true);
                }
                return e(r);
            }
            t.exports = e;
            (t.exports["default"] = t.exports), (t.exports.__esModule = true);
        },
        function(t, r) {
            function e(t, r, e, n, a, o, i) {
                try {
                    var u = t[o](i);
                    var s = u.value;
                } catch (c) {
                    e(c);
                    return;
                }
                if (u.done) {
                    r(s);
                } else {
                    Promise.resolve(s).then(n, a);
                }
            }
            function n(t) {
                return function() {
                    var r = this, n = arguments;
                    return new Promise(function(a, o) {
                        var i = t.apply(r, n);
                        function u(t) {
                            e(i, a, o, u, s, "next", t);
                        }
                        function s(t) {
                            e(i, a, o, u, s, "throw", t);
                        }
                        u(undefined);
                    });
                };
            }
            t.exports = n;
            (t.exports["default"] = t.exports), (t.exports.__esModule = true);
        },
        function(t, r, e) {
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
                create: function t(r, e) {
                    var n = r.data;
                    var a = e.data;
                    var o = this.searchDirections;
                    var i = r.size.x;
                    var u;
                    function s(t, r, e, s) {
                        var c;
                        var f;
                        var l;
                        for(c = 0; c < 7; c++){
                            f = t.cy + o[t.dir][0];
                            l = t.cx + o[t.dir][1];
                            u = f * i + l;
                            if (n[u] === r && (a[u] === 0 || a[u] === e)) {
                                a[u] = e;
                                t.cy = f;
                                t.cx = l;
                                return true;
                            }
                            if (a[u] === 0) {
                                a[u] = s;
                            }
                            t.dir = (t.dir + 1) % 8;
                        }
                        return false;
                    }
                    function c(t, r, e) {
                        return {
                            dir: e,
                            x: t,
                            y: r,
                            next: null,
                            prev: null
                        };
                    }
                    function f(t, r, e, n, a) {
                        var o = null;
                        var i;
                        var u;
                        var f;
                        var l = {
                            cx: r,
                            cy: t,
                            dir: 0
                        };
                        if (s(l, n, e, a)) {
                            o = c(r, t, l.dir);
                            i = o;
                            f = l.dir;
                            u = c(l.cx, l.cy, 0);
                            u.prev = i;
                            i.next = u;
                            u.next = null;
                            i = u;
                            do {
                                l.dir = (l.dir + 6) % 8;
                                s(l, n, e, a);
                                if (f !== l.dir) {
                                    i.dir = l.dir;
                                    u = c(l.cx, l.cy, 0);
                                    u.prev = i;
                                    i.next = u;
                                    u.next = null;
                                    i = u;
                                } else {
                                    i.dir = f;
                                    i.x = l.cx;
                                    i.y = l.cy;
                                }
                                f = l.dir;
                            }while (l.cx !== r || l.cy !== t)
                            o.prev = i.prev;
                            i.prev.next = o;
                        }
                        return o;
                    }
                    return {
                        trace: function t(r, e, n, a) {
                            return s(r, e, n, a);
                        },
                        contourTracing: function t(r, e, n, a, o) {
                            return f(r, e, n, a, o);
                        }
                    };
                }
            };
            r["a"] = n;
        },
        function(t, r, e) {
            var n = e(27), a = e(103), o = e(104);
            var i = "[object Null]", u = "[object Undefined]";
            var s = n ? n.toStringTag : undefined;
            function c(t) {
                if (t == null) {
                    return t === undefined ? u : i;
                }
                return s && s in Object(t) ? a(t) : o(t);
            }
            t.exports = c;
        },
        function(t, r, e) {
            "use strict";
            (function(t) {
                var n = e(7);
                var a = e.n(n);
                var o = e(34);
                var i = e.n(o);
                var u = e(11);
                var s = e(8);
                var c = e(10);
                var f = e(9);
                var l = e(87);
                var v = e(21);
                var h = e(88);
                var d;
                var $;
                var _;
                var p;
                var x;
                var g;
                var y;
                var m;
                var w;
                var b;
                var C = {
                    ctx: {
                        binary: null
                    },
                    dom: {
                        binary: null
                    }
                };
                var R = {
                    x: 0,
                    y: 0
                };
                var E;
                var O;
                function S() {
                    if (d.halfSample) {
                        $ = new u["a"]({
                            x: (E.size.x / 2) | 0,
                            y: (E.size.y / 2) | 0
                        });
                    } else {
                        $ = E;
                    }
                    b = Object(s["a"])(d.patchSize, $.size);
                    R.x = ($.size.x / b.x) | 0;
                    R.y = ($.size.y / b.y) | 0;
                    w = new u["a"]($.size, undefined, Uint8Array, false);
                    x = new u["a"](b, undefined, Array, true);
                    var r = new ArrayBuffer(64 * 1024);
                    p = new u["a"](b, new Uint8Array(r, 0, b.x * b.y));
                    _ = new u["a"](b, new Uint8Array(r, b.x * b.y * 3, b.x * b.y), undefined, true);
                    O = Object(h["a"])(typeof window !== "undefined" ? window : typeof self !== "undefined" ? self : t, {
                        size: b.x
                    }, r);
                    m = new u["a"]({
                        x: ($.size.x / p.size.x) | 0,
                        y: ($.size.y / p.size.y) | 0
                    }, undefined, Array, true);
                    g = new u["a"](m.size, undefined, undefined, true);
                    y = new u["a"](m.size, undefined, Int32Array, true);
                }
                function k() {
                    if (d.useWorker || typeof document === "undefined") {
                        return;
                    }
                    C.dom.binary = document.createElement("canvas");
                    C.dom.binary.className = "binaryBuffer";
                    if (true && d.debug.showCanvas === true) {
                        document.querySelector("#debug").appendChild(C.dom.binary);
                    }
                    C.ctx.binary = C.dom.binary.getContext("2d");
                    C.dom.binary.width = w.size.x;
                    C.dom.binary.height = w.size.y;
                }
                function A(t) {
                    var r;
                    var e;
                    var a;
                    var i;
                    var u;
                    var s = w.size.x;
                    var c = w.size.y;
                    var l = -w.size.x;
                    var v = -w.size.y;
                    var h;
                    var $;
                    r = 0;
                    for(e = 0; e < t.length; e++){
                        i = t[e];
                        r += i.rad;
                        if (true && d.debug.showPatches) {
                            f["a"].drawRect(i.pos, p.size, C.ctx.binary, {
                                color: "red"
                            });
                        }
                    }
                    r /= t.length;
                    r = (((r * 180) / Math.PI + 90) % 180) - 90;
                    if (r < 0) {
                        r += 180;
                    }
                    r = ((180 - r) * Math.PI) / 180;
                    u = o["copy"](o["create"](), [
                        Math.cos(r),
                        Math.sin(r),
                        -Math.sin(r),
                        Math.cos(r), 
                    ]);
                    for(e = 0; e < t.length; e++){
                        i = t[e];
                        for(a = 0; a < 4; a++){
                            n["transformMat2"](i.box[a], i.box[a], u);
                        }
                        if (true && d.debug.boxFromPatches.showTransformed) {
                            f["a"].drawPath(i.box, {
                                x: 0,
                                y: 1
                            }, C.ctx.binary, {
                                color: "#99ff00",
                                lineWidth: 2
                            });
                        }
                    }
                    for(e = 0; e < t.length; e++){
                        i = t[e];
                        for(a = 0; a < 4; a++){
                            if (i.box[a][0] < s) {
                                s = i.box[a][0];
                            }
                            if (i.box[a][0] > l) {
                                l = i.box[a][0];
                            }
                            if (i.box[a][1] < c) {
                                c = i.box[a][1];
                            }
                            if (i.box[a][1] > v) {
                                v = i.box[a][1];
                            }
                        }
                    }
                    h = [
                        [
                            s,
                            c
                        ],
                        [
                            l,
                            c
                        ],
                        [
                            l,
                            v
                        ],
                        [
                            s,
                            v
                        ], 
                    ];
                    if (true && d.debug.boxFromPatches.showTransformedBox) {
                        f["a"].drawPath(h, {
                            x: 0,
                            y: 1
                        }, C.ctx.binary, {
                            color: "#ff0000",
                            lineWidth: 2
                        });
                    }
                    $ = d.halfSample ? 2 : 1;
                    u = o["invert"](u, u);
                    for(a = 0; a < 4; a++){
                        n["transformMat2"](h[a], h[a], u);
                    }
                    if (true && d.debug.boxFromPatches.showBB) {
                        f["a"].drawPath(h, {
                            x: 0,
                            y: 1
                        }, C.ctx.binary, {
                            color: "#ff0000",
                            lineWidth: 2
                        });
                    }
                    for(a = 0; a < 4; a++){
                        n["scale"](h[a], h[a], $);
                    }
                    return h;
                }
                function D() {
                    Object(s["i"])($, w);
                    w.zeroBorder();
                    if (true && d.debug.showCanvas) {
                        w.show(C.dom.binary, 255);
                    }
                }
                function P() {
                    var t;
                    var r;
                    var e;
                    var n;
                    var a;
                    var o = [];
                    var i;
                    var u;
                    var s;
                    for(t = 0; t < R.x; t++){
                        for(r = 0; r < R.y; r++){
                            e = p.size.x * t;
                            n = p.size.y * r;
                            M(e, n);
                            _.zeroBorder();
                            c["a"].init(x.data, 0);
                            i = l["a"].create(_, x);
                            u = i.rasterize(0);
                            if (true && d.debug.showLabels) {
                                x.overlay(C.dom.binary, Math.floor(360 / u.count), {
                                    x: e,
                                    y: n
                                });
                            }
                            a = x.moments(u.count);
                            o = o.concat(L(a, [
                                t,
                                r
                            ], e, n));
                        }
                    }
                    if (true && d.debug.showFoundPatches) {
                        for(t = 0; t < o.length; t++){
                            s = o[t];
                            f["a"].drawRect(s.pos, p.size, C.ctx.binary, {
                                color: "#99ff00",
                                lineWidth: 2
                            });
                        }
                    }
                    return o;
                }
                function T(t) {
                    var r;
                    var e;
                    var n = [];
                    var a = [];
                    for(r = 0; r < t; r++){
                        n.push(0);
                    }
                    e = y.data.length;
                    while(e--){
                        if (y.data[e] > 0) {
                            n[y.data[e] - 1]++;
                        }
                    }
                    n = n.map(function(t, r) {
                        return {
                            val: t,
                            label: r + 1
                        };
                    });
                    n.sort(function(t, r) {
                        return r.val - t.val;
                    });
                    a = n.filter(function(t) {
                        return t.val >= 5;
                    });
                    return a;
                }
                function I(t, r) {
                    var e;
                    var n;
                    var a;
                    var o = [];
                    var i;
                    var u;
                    var c = [];
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
                    for(e = 0; e < t.length; e++){
                        a = y.data.length;
                        o.length = 0;
                        while(a--){
                            if (y.data[a] === t[e].label) {
                                i = m.data[a];
                                o.push(i);
                            }
                        }
                        u = A(o);
                        if (u) {
                            c.push(u);
                            if (true && d.debug.showRemainingPatchLabels) {
                                for(n = 0; n < o.length; n++){
                                    i = o[n];
                                    l[0] = (t[e].label / (r + 1)) * 360;
                                    Object(s["g"])(l, v);
                                    f["a"].drawRect(i.pos, p.size, C.ctx.binary, {
                                        color: "rgb(".concat(v.join(","), ")"),
                                        lineWidth: 2
                                    });
                                }
                            }
                        }
                    }
                    return c;
                }
                function z(t) {
                    var r = Object(s["b"])(t, 0.9);
                    var e = Object(s["j"])(r, 1, function(t) {
                        return t.getPoints().length;
                    });
                    var n = [];
                    var a = [];
                    if (e.length === 1) {
                        n = e[0].item.getPoints();
                        for(var o = 0; o < n.length; o++){
                            a.push(n[o].point);
                        }
                    }
                    return a;
                }
                function M(t, r) {
                    w.subImageAsCopy(p, Object(s["h"])(t, r));
                    O.skeletonize();
                    if (true && d.debug.showSkeleton) {
                        _.overlay(C.dom.binary, 360, Object(s["h"])(t, r));
                    }
                }
                function L(t, r, e, a) {
                    var o;
                    var i;
                    var u = [];
                    var s;
                    var c;
                    var f = [];
                    var l = Math.ceil(b.x / 3);
                    if (t.length >= 2) {
                        for(o = 0; o < t.length; o++){
                            if (t[o].m00 > l) {
                                u.push(t[o]);
                            }
                        }
                        if (u.length >= 2) {
                            s = z(u);
                            i = 0;
                            for(o = 0; o < s.length; o++){
                                i += s[o].rad;
                            }
                            if (s.length > 1 && s.length >= (u.length / 4) * 3 && s.length > t.length / 4) {
                                i /= s.length;
                                c = {
                                    index: r[1] * R.x + r[0],
                                    pos: {
                                        x: e,
                                        y: a
                                    },
                                    box: [
                                        n["clone"]([
                                            e,
                                            a
                                        ]),
                                        n["clone"]([
                                            e + p.size.x,
                                            a
                                        ]),
                                        n["clone"]([
                                            e + p.size.x,
                                            a + p.size.y, 
                                        ]),
                                        n["clone"]([
                                            e,
                                            a + p.size.y
                                        ]), 
                                    ],
                                    moments: s,
                                    rad: i,
                                    vec: n["clone"]([
                                        Math.cos(i),
                                        Math.sin(i)
                                    ])
                                };
                                f.push(c);
                            }
                        }
                    }
                    return f;
                }
                function W(t) {
                    var r = 0;
                    var e = 0.95;
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
                        for(t = 0; t < y.data.length; t++){
                            if (y.data[t] === 0 && g.data[t] === 1) {
                                return t;
                            }
                        }
                        return y.length;
                    }
                    function $(t) {
                        var a;
                        var o;
                        var i;
                        var u;
                        var s;
                        var c = {
                            x: t % y.size.x,
                            y: (t / y.size.x) | 0
                        };
                        var f;
                        if (t < y.data.length) {
                            i = m.data[t];
                            y.data[t] = r;
                            for(s = 0; s < v["a"].searchDirections.length; s++){
                                o = c.y + v["a"].searchDirections[s][0];
                                a = c.x + v["a"].searchDirections[s][1];
                                u = o * y.size.x + a;
                                if (g.data[u] === 0) {
                                    y.data[u] = Number.MAX_VALUE;
                                    continue;
                                }
                                if (y.data[u] === 0) {
                                    f = Math.abs(n["dot"](m.data[u].vec, i.vec));
                                    if (f > e) {
                                        $(u);
                                    }
                                }
                            }
                        }
                    }
                    c["a"].init(g.data, 0);
                    c["a"].init(y.data, 0);
                    c["a"].init(m.data, null);
                    for(o = 0; o < t.length; o++){
                        i = t[o];
                        m.data[i.index] = i;
                        g.data[i.index] = 1;
                    }
                    g.zeroBorder();
                    while((a = h()) < y.data.length){
                        r++;
                        $(a);
                    }
                    if (true && d.debug.showPatchLabels) {
                        for(o = 0; o < y.data.length; o++){
                            if (y.data[o] > 0 && y.data[o] <= r) {
                                i = m.data[o];
                                u[0] = (y.data[o] / (r + 1)) * 360;
                                Object(s["g"])(u, l);
                                f["a"].drawRect(i.pos, p.size, C.ctx.binary, {
                                    color: "rgb(".concat(l.join(","), ")"),
                                    lineWidth: 2
                                });
                            }
                        }
                    }
                    return r;
                }
                r["a"] = {
                    init: function t(r, e) {
                        d = e;
                        E = r;
                        S();
                        k();
                    },
                    locate: function t() {
                        if (d.halfSample) {
                            Object(s["f"])(E, $);
                        }
                        D();
                        var r = P();
                        if (r.length < R.x * R.y * 0.05) {
                            return null;
                        }
                        var e = W(r);
                        if (e < 1) {
                            return null;
                        }
                        var n = T(e);
                        if (n.length === 0) {
                            return null;
                        }
                        var a = I(n, e);
                        return a;
                    },
                    checkImageConstraints: function t(r, e) {
                        var n;
                        var a = r.getWidth();
                        var o = r.getHeight();
                        var i = e.halfSample ? 0.5 : 1;
                        var u;
                        if (r.getConfig().area) {
                            u = Object(s["d"])(a, o, r.getConfig().area);
                            r.setTopRight({
                                x: u.sx,
                                y: u.sy
                            });
                            r.setCanvasSize({
                                x: a,
                                y: o
                            });
                            a = u.sw;
                            o = u.sh;
                        }
                        var c = {
                            x: Math.floor(a * i),
                            y: Math.floor(o * i)
                        };
                        n = Object(s["a"])(e.patchSize, c);
                        if (true) {
                            console.log("Patch-Size: ".concat(JSON.stringify(n)));
                        }
                        r.setWidth(Math.floor(Math.floor(c.x / n.x) * (1 / i) * n.x));
                        r.setHeight(Math.floor(Math.floor(c.y / n.y) * (1 / i) * n.y));
                        if (r.getWidth() % n.x === 0 && r.getHeight() % n.y === 0) {
                            return true;
                        }
                        throw new Error("Image dimensions do not comply with the current settings: Width (".concat(a, " )and height (").concat(o, ") must a multiple of ").concat(n.x));
                    }
                };
            }.call(this, e(46)));
        },
        function(t, r, e) {
            var n = e(92), a = e(93), o = e(94), i = e(95), u = e(96);
            function s(t) {
                var r = -1, e = t == null ? 0 : t.length;
                this.clear();
                while(++r < e){
                    var n = t[r];
                    this.set(n[0], n[1]);
                }
            }
            s.prototype.clear = n;
            s.prototype["delete"] = a;
            s.prototype.get = o;
            s.prototype.has = i;
            s.prototype.set = u;
            t.exports = s;
        },
        function(t, r, e) {
            var n = e(26);
            function a(t, r) {
                var e = t.length;
                while(e--){
                    if (n(t[e][0], r)) {
                        return e;
                    }
                }
                return -1;
            }
            t.exports = a;
        },
        function(t, r) {
            function e(t, r) {
                return (t === r || (t !== t && r !== r));
            }
            t.exports = e;
        },
        function(t, r, e) {
            var n = e(17);
            var a = n.Symbol;
            t.exports = a;
        },
        function(t, r, e) {
            var n = e(35);
            var a = n(Object, "create");
            t.exports = a;
        },
        function(t, r, e) {
            var n = e(117);
            function a(t, r) {
                var e = t.__data__;
                return n(r) ? e[typeof r == "string" ? "string" : "hash"] : e.map;
            }
            t.exports = a;
        },
        function(t, r, e) {
            var n = e(132), a = e(18);
            var o = Object.prototype;
            var i = o.hasOwnProperty;
            var u = o.propertyIsEnumerable;
            var s = n((function() {
                return arguments;
            })()) ? n : function(t) {
                return (a(t) && i.call(t, "callee") && !u.call(t, "callee"));
            };
            t.exports = s;
        },
        function(t, r) {
            var e = 9007199254740991;
            var n = /^(?:0|[1-9]\d*)$/;
            function a(t, r) {
                var a = typeof t;
                r = r == null ? e : r;
                return (!!r && (a == "number" || (a != "symbol" && n.test(t))) && t > -1 && t % 1 == 0 && t < r);
            }
            t.exports = a;
        },
        function(t, r, e) {
            var n = e(15), a = e(232), o = e(233), i = e(236);
            function u(t, r) {
                if (n(t)) {
                    return t;
                }
                return a(t, r) ? [
                    t
                ] : o(i(t));
            }
            t.exports = u;
        },
        function(t, r, e) {
            var n = e(224);
            var a = e(225);
            var o = e(60);
            var i = e(226);
            function u(t) {
                return (n(t) || a(t) || o(t) || i());
            }
            t.exports = u;
            (t.exports["default"] = t.exports), (t.exports.__esModule = true);
        },
        function(t, r, e) {
            t.exports = {
                determinant: e(251),
                transpose: e(252),
                multiply: e(253),
                identity: e(254),
                adjoint: e(255),
                rotate: e(256),
                invert: e(257),
                create: e(258),
                scale: e(259),
                copy: e(260),
                frob: e(261),
                ldu: e(262)
            };
        },
        function(t, r, e) {
            var n = e(102), a = e(108);
            function o(t, r) {
                var e = a(t, r);
                return n(e) ? e : undefined;
            }
            t.exports = o;
        },
        function(t, r, e) {
            var n = e(22), a = e(14);
            var o = "[object AsyncFunction]", i = "[object Function]", u = "[object GeneratorFunction]", s = "[object Proxy]";
            function c(t) {
                if (!a(t)) {
                    return false;
                }
                var r = n(t);
                return (r == i || r == u || r == o || r == s);
            }
            t.exports = c;
        },
        function(t, r, e) {
            var n = e(49);
            function a(t, r, e) {
                if (r == "__proto__" && n) {
                    n(t, r, {
                        configurable: true,
                        enumerable: true,
                        value: e,
                        writable: true
                    });
                } else {
                    t[r] = e;
                }
            }
            t.exports = a;
        },
        function(t, r) {
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
        function(t, r, e) {
            var n = e(36), a = e(40);
            function o(t) {
                return (t != null && a(t.length) && !n(t));
            }
            t.exports = o;
        },
        function(t, r) {
            var e = 9007199254740991;
            function n(t) {
                return (typeof t == "number" && t > -1 && t % 1 == 0 && t <= e);
            }
            t.exports = n;
        },
        function(t, r) {
            function e(r, n) {
                t.exports = e = Object.setPrototypeOf || function t(r, e) {
                    r.__proto__ = e;
                    return r;
                };
                (t.exports["default"] = t.exports), (t.exports.__esModule = true);
                return e(r, n);
            }
            t.exports = e;
            (t.exports["default"] = t.exports), (t.exports.__esModule = true);
        },
        function(t, r, e) {
            var n = e(22), a = e(18);
            var o = "[object Symbol]";
            function i(t) {
                return (typeof t == "symbol" || (a(t) && n(t) == o));
            }
            t.exports = i;
        },
        function(t, r, e) {
            var n = e(42);
            var a = 1 / 0;
            function o(t) {
                if (typeof t == "string" || n(t)) {
                    return t;
                }
                var r = t + "";
                return r == "0" && 1 / t == -a ? "-0" : r;
            }
            t.exports = o;
        },
        function(t, r, e) {
            var n = e(35), a = e(17);
            var o = n(a, "Map");
            t.exports = o;
        },
        function(t, r, e) {
            (function(r) {
                var e = typeof r == "object" && r && r.Object === Object && r;
                t.exports = e;
            }.call(this, e(46)));
        },
        function(t, r) {
            var e;
            e = (function() {
                return this;
            })();
            try {
                e = e || new Function("return this")();
            } catch (n) {
                if (typeof window === "object") e = window;
            }
            t.exports = e;
        },
        function(t, r, e) {
            var n = e(109), a = e(116), o = e(118), i = e(119), u = e(120);
            function s(t) {
                var r = -1, e = t == null ? 0 : t.length;
                this.clear();
                while(++r < e){
                    var n = t[r];
                    this.set(n[0], n[1]);
                }
            }
            s.prototype.clear = n;
            s.prototype["delete"] = a;
            s.prototype.get = o;
            s.prototype.has = i;
            s.prototype.set = u;
            t.exports = s;
        },
        function(t, r, e) {
            var n = e(37), a = e(26);
            function o(t, r, e) {
                if ((e !== undefined && !a(t[r], e)) || (e === undefined && !(r in t))) {
                    n(t, r, e);
                }
            }
            t.exports = o;
        },
        function(t, r, e) {
            var n = e(35);
            var a = (function() {
                try {
                    var t = n(Object, "defineProperty");
                    t({}, "", {});
                    return t;
                } catch (r) {}
            })();
            t.exports = a;
        },
        function(t, r, e) {
            var n = e(131);
            var a = n(Object.getPrototypeOf, Object);
            t.exports = a;
        },
        function(t, r) {
            var e = Object.prototype;
            function n(t) {
                var r = t && t.constructor, n = (typeof r == "function" && r.prototype) || e;
                return t === n;
            }
            t.exports = n;
        },
        function(t, r, e) {
            (function(t) {
                var n = e(17), a = e(134);
                var o = true && r && !r.nodeType && r;
                var i = o && typeof t == "object" && t && !t.nodeType && t;
                var u = i && i.exports === o;
                var s = u ? n.Buffer : undefined;
                var c = s ? s.isBuffer : undefined;
                var f = c || a;
                t.exports = f;
            }.call(this, e(38)(t)));
        },
        function(t, r, e) {
            var n = e(136), a = e(137), o = e(138);
            var i = o && o.isTypedArray;
            var u = i ? a(i) : n;
            t.exports = u;
        },
        function(t, r) {
            function e(t, r) {
                if (r === "constructor" && typeof t[r] === "function") {
                    return;
                }
                if (r == "__proto__") {
                    return;
                }
                return t[r];
            }
            t.exports = e;
        },
        function(t, r, e) {
            var n = e(37), a = e(26);
            var o = Object.prototype;
            var i = o.hasOwnProperty;
            function u(t, r, e) {
                var o = t[r];
                if (!(i.call(t, r) && a(o, e)) || (e === undefined && !(r in t))) {
                    n(t, r, e);
                }
            }
            t.exports = u;
        },
        function(t, r, e) {
            var n = e(141), a = e(143), o = e(39);
            function i(t) {
                return o(t) ? n(t, true) : a(t);
            }
            t.exports = i;
        },
        function(t, r) {
            function e(t) {
                return t;
            }
            t.exports = e;
        },
        function(t, r, e) {
            var n = e(147);
            var a = Math.max;
            function o(t, r, e) {
                r = a(r === undefined ? t.length - 1 : r, 0);
                return function() {
                    var o = arguments, i = -1, u = a(o.length - r, 0), s = Array(u);
                    while(++i < u){
                        s[i] = o[r + i];
                    }
                    i = -1;
                    var c = Array(r + 1);
                    while(++i < r){
                        c[i] = o[i];
                    }
                    c[r] = e(s);
                    return n(t, this, c);
                };
            }
            t.exports = o;
        },
        function(t, r, e) {
            var n = e(148), a = e(150);
            var o = a(n);
            t.exports = o;
        },
        function(t, r, e) {
            var n = e(61);
            function a(t, r) {
                if (!t) return;
                if (typeof t === "string") return n(t, r);
                var e = Object.prototype.toString.call(t).slice(8, -1);
                if (e === "Object" && t.constructor) e = t.constructor.name;
                if (e === "Map" || e === "Set") return Array.from(t);
                if (e === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e)) return n(t, r);
            }
            t.exports = a;
            (t.exports["default"] = t.exports), (t.exports.__esModule = true);
        },
        function(t, r) {
            function e(t, r) {
                if (r == null || r > t.length) r = t.length;
                for(var e = 0, n = new Array(r); e < r; e++){
                    n[e] = t[e];
                }
                return n;
            }
            t.exports = e;
            (t.exports["default"] = t.exports), (t.exports.__esModule = true);
        },
        function(t, r) {
            t.exports = 0.000001;
        },
        function(t, r) {
            t.exports = e;
            function e() {
                var t = new Float32Array(2);
                t[0] = 0;
                t[1] = 0;
                return t;
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t, r, e) {
                t[0] = r[0] - e[0];
                t[1] = r[1] - e[1];
                return t;
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t, r, e) {
                t[0] = r[0] * e[0];
                t[1] = r[1] * e[1];
                return t;
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t, r, e) {
                t[0] = r[0] / e[0];
                t[1] = r[1] / e[1];
                return t;
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t, r) {
                var e = r[0] - t[0], n = r[1] - t[1];
                return Math.sqrt(e * e + n * n);
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t, r) {
                var e = r[0] - t[0], n = r[1] - t[1];
                return e * e + n * n;
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t) {
                var r = t[0], e = t[1];
                return Math.sqrt(r * r + e * e);
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t) {
                var r = t[0], e = t[1];
                return r * r + e * e;
            }
        },
        function(t, r) {
            t.exports = 0.000001;
        },
        function(t, r) {
            t.exports = e;
            function e() {
                var t = new Float32Array(3);
                t[0] = 0;
                t[1] = 0;
                t[2] = 0;
                return t;
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t, r, e) {
                var n = new Float32Array(3);
                n[0] = t;
                n[1] = r;
                n[2] = e;
                return n;
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t, r) {
                var e = r[0], n = r[1], a = r[2];
                var o = e * e + n * n + a * a;
                if (o > 0) {
                    o = 1 / Math.sqrt(o);
                    t[0] = r[0] * o;
                    t[1] = r[1] * o;
                    t[2] = r[2] * o;
                }
                return t;
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t, r) {
                return t[0] * r[0] + t[1] * r[1] + t[2] * r[2];
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t, r, e) {
                t[0] = r[0] - e[0];
                t[1] = r[1] - e[1];
                t[2] = r[2] - e[2];
                return t;
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t, r, e) {
                t[0] = r[0] * e[0];
                t[1] = r[1] * e[1];
                t[2] = r[2] * e[2];
                return t;
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t, r, e) {
                t[0] = r[0] / e[0];
                t[1] = r[1] / e[1];
                t[2] = r[2] / e[2];
                return t;
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t, r) {
                var e = r[0] - t[0], n = r[1] - t[1], a = r[2] - t[2];
                return Math.sqrt(e * e + n * n + a * a);
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t, r) {
                var e = r[0] - t[0], n = r[1] - t[1], a = r[2] - t[2];
                return e * e + n * n + a * a;
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t) {
                var r = t[0], e = t[1], n = t[2];
                return Math.sqrt(r * r + e * e + n * n);
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t) {
                var r = t[0], e = t[1], n = t[2];
                return r * r + e * e + n * n;
            }
        },
        function(t, r, e) {
            var n = e(153);
            var a = e(154);
            var o = e(60);
            var i = e(155);
            function u(t, r) {
                return (n(t) || a(t, r) || o(t, r) || i());
            }
            t.exports = u;
            (t.exports["default"] = t.exports), (t.exports.__esModule = true);
        },
        function(t, r, e) {
            t.exports = {
                EPSILON: e(71),
                create: e(72),
                clone: e(191),
                angle: e(192),
                fromValues: e(73),
                copy: e(193),
                set: e(194),
                equals: e(195),
                exactEquals: e(196),
                add: e(197),
                subtract: e(76),
                sub: e(198),
                multiply: e(77),
                mul: e(199),
                divide: e(78),
                div: e(200),
                min: e(201),
                max: e(202),
                floor: e(203),
                ceil: e(204),
                round: e(205),
                scale: e(206),
                scaleAndAdd: e(207),
                distance: e(79),
                dist: e(208),
                squaredDistance: e(80),
                sqrDist: e(209),
                length: e(81),
                len: e(210),
                squaredLength: e(82),
                sqrLen: e(211),
                negate: e(212),
                inverse: e(213),
                normalize: e(74),
                dot: e(75),
                cross: e(214),
                lerp: e(215),
                random: e(216),
                transformMat4: e(217),
                transformMat3: e(218),
                transformQuat: e(219),
                rotateX: e(220),
                rotateY: e(221),
                rotateZ: e(222),
                forEach: e(223)
            };
        },
        function(t, r, e) {
            var n = e(229), a = e(243);
            var o = a(function(t, r) {
                return t == null ? {} : n(t, r);
            });
            t.exports = o;
        },
        function(t, r, e) {
            var n = e(2);
            var a = e(41);
            var o = e(248);
            var i = e(249);
            function u(r) {
                var e = typeof Map === "function" ? new Map() : undefined;
                t.exports = u = function t(r) {
                    if (r === null || !o(r)) return r;
                    if (typeof r !== "function") {
                        throw new TypeError("Super expression must either be null or a function");
                    }
                    if (typeof e !== "undefined") {
                        if (e.has(r)) return e.get(r);
                        e.set(r, u);
                    }
                    function u() {
                        return i(r, arguments, n(this).constructor);
                    }
                    u.prototype = Object.create(r.prototype, {
                        constructor: {
                            value: u,
                            enumerable: false,
                            writable: true,
                            configurable: true
                        }
                    });
                    return a(u, r);
                };
                (t.exports["default"] = t.exports), (t.exports.__esModule = true);
                return u(r);
            }
            t.exports = u;
            (t.exports["default"] = t.exports), (t.exports.__esModule = true);
        },
        function(t, r, e) {
            "use strict";
            var n = e(21);
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
                create: function t(r, e) {
                    var o = r.data;
                    var i = e.data;
                    var u = r.size.x;
                    var s = r.size.y;
                    var c = n["a"].create(r, e);
                    return {
                        rasterize: function t(r) {
                            var e;
                            var n;
                            var f;
                            var l;
                            var v;
                            var h;
                            var d = [];
                            var $;
                            var _;
                            var p;
                            var x;
                            var g;
                            var y = 0;
                            var m;
                            for(m = 0; m < 400; m++){
                                d[m] = 0;
                            }
                            d[0] = o[0];
                            p = null;
                            for(h = 1; h < s - 1; h++){
                                l = 0;
                                n = d[0];
                                for(v = 1; v < u - 1; v++){
                                    g = h * u + v;
                                    if (i[g] === 0) {
                                        e = o[g];
                                        if (e !== n) {
                                            if (l === 0) {
                                                f = y + 1;
                                                d[f] = e;
                                                n = e;
                                                $ = c.contourTracing(h, v, f, e, a.DIR.OUTSIDE_EDGE);
                                                if ($ !== null) {
                                                    y++;
                                                    l = f;
                                                    _ = a.createContour2D();
                                                    _.dir = a.CONTOUR_DIR.CW_DIR;
                                                    _.index = l;
                                                    _.firstVertex = $;
                                                    _.nextpeer = p;
                                                    _.insideContours = null;
                                                    if (p !== null) {
                                                        p.prevpeer = _;
                                                    }
                                                    p = _;
                                                }
                                            } else {
                                                $ = c.contourTracing(h, v, a.DIR.INSIDE_EDGE, e, l);
                                                if ($ !== null) {
                                                    _ = a.createContour2D();
                                                    _.firstVertex = $;
                                                    _.insideContours = null;
                                                    if (r === 0) {
                                                        _.dir = a.CONTOUR_DIR.CCW_DIR;
                                                    } else {
                                                        _.dir = a.CONTOUR_DIR.CW_DIR;
                                                    }
                                                    _.index = r;
                                                    x = p;
                                                    while(x !== null && x.index !== l){
                                                        x = x.nextpeer;
                                                    }
                                                    if (x !== null) {
                                                        _.nextpeer = x.insideContours;
                                                        if (x.insideContours !== null) {
                                                            x.insideContours.prevpeer = _;
                                                        }
                                                        x.insideContours = _;
                                                    }
                                                }
                                            }
                                        } else {
                                            i[g] = l;
                                        }
                                    } else if (i[g] === a.DIR.OUTSIDE_EDGE || i[g] === a.DIR.INSIDE_EDGE) {
                                        l = 0;
                                        if (i[g] === a.DIR.INSIDE_EDGE) {
                                            n = o[g];
                                        } else {
                                            n = d[0];
                                        }
                                    } else {
                                        l = i[g];
                                        n = d[l];
                                    }
                                }
                            }
                            x = p;
                            while(x !== null){
                                x.index = r;
                                x = x.nextpeer;
                            }
                            return {
                                cc: p,
                                count: y
                            };
                        },
                        debug: {
                            drawContour: function t(r, e) {
                                var n = r.getContext("2d");
                                var o = e;
                                var i;
                                var u;
                                var s;
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
                                    s = u.firstVertex;
                                    n.beginPath();
                                    n.moveTo(s.x, s.y);
                                    do {
                                        s = s.next;
                                        n.lineTo(s.x, s.y);
                                    }while (s !== u.firstVertex)
                                    n.stroke();
                                }
                            }
                        }
                    };
                }
            };
            r["a"] = a;
        },
        function(t, r, e) {
            "use strict";
            function n(t, r, e) {
                "use asm";
                var n = new t.Uint8Array(e);
                var a = r.size | 0;
                var o = t.Math.imul;
                function i(t, r) {
                    t |= 0;
                    r |= 0;
                    var e = 0;
                    var o = 0;
                    var i = 0;
                    var u = 0;
                    var s = 0;
                    var c = 0;
                    var f = 0;
                    var l = 0;
                    for(e = 1; (e | 0) < ((a - 1) | 0); e = (e + 1) | 0){
                        l = (l + a) | 0;
                        for(o = 1; (o | 0) < ((a - 1) | 0); o = (o + 1) | 0){
                            u = (l - a) | 0;
                            s = (l + a) | 0;
                            c = (o - 1) | 0;
                            f = (o + 1) | 0;
                            i = ((n[(t + u + c) | 0] | 0) + (n[(t + u + f) | 0] | 0) + (n[(t + l + o) | 0] | 0) + (n[(t + s + c) | 0] | 0) + (n[(t + s + f) | 0] | 0)) | 0;
                            if ((i | 0) == (5 | 0)) {
                                n[(r + l + o) | 0] = 1;
                            } else {
                                n[(r + l + o) | 0] = 0;
                            }
                        }
                    }
                }
                function u(t, r, e) {
                    t |= 0;
                    r |= 0;
                    e |= 0;
                    var i = 0;
                    i = o(a, a) | 0;
                    while((i | 0) > 0){
                        i = (i - 1) | 0;
                        n[(e + i) | 0] = ((n[(t + i) | 0] | 0) - (n[(r + i) | 0] | 0)) | 0;
                    }
                }
                function s(t, r, e) {
                    t |= 0;
                    r |= 0;
                    e |= 0;
                    var i = 0;
                    i = o(a, a) | 0;
                    while((i | 0) > 0){
                        i = (i - 1) | 0;
                        n[(e + i) | 0] = n[(t + i) | 0] | 0 | (n[(r + i) | 0] | 0) | 0;
                    }
                }
                function c(t) {
                    t |= 0;
                    var r = 0;
                    var e = 0;
                    e = o(a, a) | 0;
                    while((e | 0) > 0){
                        e = (e - 1) | 0;
                        r = ((r | 0) + (n[(t + e) | 0] | 0)) | 0;
                    }
                    return r | 0;
                }
                function f(t, r) {
                    t |= 0;
                    r |= 0;
                    var e = 0;
                    e = o(a, a) | 0;
                    while((e | 0) > 0){
                        e = (e - 1) | 0;
                        n[(t + e) | 0] = r;
                    }
                }
                function l(t, r) {
                    t |= 0;
                    r |= 0;
                    var e = 0;
                    var o = 0;
                    var i = 0;
                    var u = 0;
                    var s = 0;
                    var c = 0;
                    var f = 0;
                    var l = 0;
                    for(e = 1; (e | 0) < ((a - 1) | 0); e = (e + 1) | 0){
                        l = (l + a) | 0;
                        for(o = 1; (o | 0) < ((a - 1) | 0); o = (o + 1) | 0){
                            u = (l - a) | 0;
                            s = (l + a) | 0;
                            c = (o - 1) | 0;
                            f = (o + 1) | 0;
                            i = ((n[(t + u + c) | 0] | 0) + (n[(t + u + f) | 0] | 0) + (n[(t + l + o) | 0] | 0) + (n[(t + s + c) | 0] | 0) + (n[(t + s + f) | 0] | 0)) | 0;
                            if ((i | 0) > (0 | 0)) {
                                n[(r + l + o) | 0] = 1;
                            } else {
                                n[(r + l + o) | 0] = 0;
                            }
                        }
                    }
                }
                function v(t, r) {
                    t |= 0;
                    r |= 0;
                    var e = 0;
                    e = o(a, a) | 0;
                    while((e | 0) > 0){
                        e = (e - 1) | 0;
                        n[(r + e) | 0] = n[(t + e) | 0] | 0;
                    }
                }
                function h(t) {
                    t |= 0;
                    var r = 0;
                    var e = 0;
                    for(r = 0; (r | 0) < ((a - 1) | 0); r = (r + 1) | 0){
                        n[(t + r) | 0] = 0;
                        n[(t + e) | 0] = 0;
                        e = (e + a - 1) | 0;
                        n[(t + e) | 0] = 0;
                        e = (e + 1) | 0;
                    }
                    for(r = 0; (r | 0) < (a | 0); r = (r + 1) | 0){
                        n[(t + e) | 0] = 0;
                        e = (e + 1) | 0;
                    }
                }
                function d() {
                    var t = 0;
                    var r = 0;
                    var e = 0;
                    var n = 0;
                    var d = 0;
                    var $ = 0;
                    r = o(a, a) | 0;
                    e = (r + r) | 0;
                    n = (e + r) | 0;
                    f(n, 0);
                    h(t);
                    do {
                        i(t, r);
                        l(r, e);
                        u(t, e, e);
                        s(n, e, n);
                        v(r, t);
                        d = c(t) | 0;
                        $ = ((d | 0) == 0) | 0;
                    }while (!$)
                }
                return {
                    skeletonize: d
                };
            }
            r["a"] = n;
        },
        function(t, r, e) {
            t.exports = e(263);
        },
        function(t, r, e) {
            var n = e(91), a = e(48), o = e(121), i = e(123), u = e(14), s = e(56), c = e(54);
            function f(t, r, e, l, v) {
                if (t === r) {
                    return;
                }
                o(r, function(o, s) {
                    v || (v = new n());
                    if (u(o)) {
                        i(t, r, s, e, f, l, v);
                    } else {
                        var h = l ? l(c(t, s), o, s + "", t, r, v) : undefined;
                        if (h === undefined) {
                            h = o;
                        }
                        a(t, s, h);
                    }
                }, s);
            }
            t.exports = f;
        },
        function(t, r, e) {
            var n = e(24), a = e(97), o = e(98), i = e(99), u = e(100), s = e(101);
            function c(t) {
                var r = (this.__data__ = new n(t));
                this.size = r.size;
            }
            c.prototype.clear = a;
            c.prototype["delete"] = o;
            c.prototype.get = i;
            c.prototype.has = u;
            c.prototype.set = s;
            t.exports = c;
        },
        function(t, r) {
            function e() {
                this.__data__ = [];
                this.size = 0;
            }
            t.exports = e;
        },
        function(t, r, e) {
            var n = e(25);
            var a = Array.prototype;
            var o = a.splice;
            function i(t) {
                var r = this.__data__, e = n(r, t);
                if (e < 0) {
                    return false;
                }
                var a = r.length - 1;
                if (e == a) {
                    r.pop();
                } else {
                    o.call(r, e, 1);
                }
                --this.size;
                return true;
            }
            t.exports = i;
        },
        function(t, r, e) {
            var n = e(25);
            function a(t) {
                var r = this.__data__, e = n(r, t);
                return e < 0 ? undefined : r[e][1];
            }
            t.exports = a;
        },
        function(t, r, e) {
            var n = e(25);
            function a(t) {
                return n(this.__data__, t) > -1;
            }
            t.exports = a;
        },
        function(t, r, e) {
            var n = e(25);
            function a(t, r) {
                var e = this.__data__, a = n(e, t);
                if (a < 0) {
                    ++this.size;
                    e.push([
                        t,
                        r
                    ]);
                } else {
                    e[a][1] = r;
                }
                return this;
            }
            t.exports = a;
        },
        function(t, r, e) {
            var n = e(24);
            function a() {
                this.__data__ = new n();
                this.size = 0;
            }
            t.exports = a;
        },
        function(t, r) {
            function e(t) {
                var r = this.__data__, e = r["delete"](t);
                this.size = r.size;
                return e;
            }
            t.exports = e;
        },
        function(t, r) {
            function e(t) {
                return this.__data__.get(t);
            }
            t.exports = e;
        },
        function(t, r) {
            function e(t) {
                return this.__data__.has(t);
            }
            t.exports = e;
        },
        function(t, r, e) {
            var n = e(24), a = e(44), o = e(47);
            var i = 200;
            function u(t, r) {
                var e = this.__data__;
                if (e instanceof n) {
                    var u = e.__data__;
                    if (!a || u.length < i - 1) {
                        u.push([
                            t,
                            r
                        ]);
                        this.size = ++e.size;
                        return this;
                    }
                    e = this.__data__ = new o(u);
                }
                e.set(t, r);
                this.size = e.size;
                return this;
            }
            t.exports = u;
        },
        function(t, r, e) {
            var n = e(36), a = e(105), o = e(14), i = e(107);
            var u = /[\\^$.*+?()[\]{}|]/g;
            var s = /^\[object .+?Constructor\]$/;
            var c = Function.prototype, f = Object.prototype;
            var l = c.toString;
            var v = f.hasOwnProperty;
            var h = RegExp("^" + l.call(v).replace(u, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
            function d(t) {
                if (!o(t) || a(t)) {
                    return false;
                }
                var r = n(t) ? h : s;
                return r.test(i(t));
            }
            t.exports = d;
        },
        function(t, r, e) {
            var n = e(27);
            var a = Object.prototype;
            var o = a.hasOwnProperty;
            var i = a.toString;
            var u = n ? n.toStringTag : undefined;
            function s(t) {
                var r = o.call(t, u), e = t[u];
                try {
                    t[u] = undefined;
                    var n = true;
                } catch (a) {}
                var s = i.call(t);
                if (n) {
                    if (r) {
                        t[u] = e;
                    } else {
                        delete t[u];
                    }
                }
                return s;
            }
            t.exports = s;
        },
        function(t, r) {
            var e = Object.prototype;
            var n = e.toString;
            function a(t) {
                return n.call(t);
            }
            t.exports = a;
        },
        function(t, r, e) {
            var n = e(106);
            var a = (function() {
                var t = /[^.]+$/.exec((n && n.keys && n.keys.IE_PROTO) || "");
                return t ? "Symbol(src)_1." + t : "";
            })();
            function o(t) {
                return !!a && a in t;
            }
            t.exports = o;
        },
        function(t, r, e) {
            var n = e(17);
            var a = n["__core-js_shared__"];
            t.exports = a;
        },
        function(t, r) {
            var e = Function.prototype;
            var n = e.toString;
            function a(t) {
                if (t != null) {
                    try {
                        return n.call(t);
                    } catch (r) {}
                    try {
                        return t + "";
                    } catch (e) {}
                }
                return "";
            }
            t.exports = a;
        },
        function(t, r) {
            function e(t, r) {
                return t == null ? undefined : t[r];
            }
            t.exports = e;
        },
        function(t, r, e) {
            var n = e(110), a = e(24), o = e(44);
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
        function(t, r, e) {
            var n = e(111), a = e(112), o = e(113), i = e(114), u = e(115);
            function s(t) {
                var r = -1, e = t == null ? 0 : t.length;
                this.clear();
                while(++r < e){
                    var n = t[r];
                    this.set(n[0], n[1]);
                }
            }
            s.prototype.clear = n;
            s.prototype["delete"] = a;
            s.prototype.get = o;
            s.prototype.has = i;
            s.prototype.set = u;
            t.exports = s;
        },
        function(t, r, e) {
            var n = e(28);
            function a() {
                this.__data__ = n ? n(null) : {};
                this.size = 0;
            }
            t.exports = a;
        },
        function(t, r) {
            function e(t) {
                var r = this.has(t) && delete this.__data__[t];
                this.size -= r ? 1 : 0;
                return r;
            }
            t.exports = e;
        },
        function(t, r, e) {
            var n = e(28);
            var a = "__lodash_hash_undefined__";
            var o = Object.prototype;
            var i = o.hasOwnProperty;
            function u(t) {
                var r = this.__data__;
                if (n) {
                    var e = r[t];
                    return e === a ? undefined : e;
                }
                return i.call(r, t) ? r[t] : undefined;
            }
            t.exports = u;
        },
        function(t, r, e) {
            var n = e(28);
            var a = Object.prototype;
            var o = a.hasOwnProperty;
            function i(t) {
                var r = this.__data__;
                return n ? r[t] !== undefined : o.call(r, t);
            }
            t.exports = i;
        },
        function(t, r, e) {
            var n = e(28);
            var a = "__lodash_hash_undefined__";
            function o(t, r) {
                var e = this.__data__;
                this.size += this.has(t) ? 0 : 1;
                e[t] = n && r === undefined ? a : r;
                return this;
            }
            t.exports = o;
        },
        function(t, r, e) {
            var n = e(29);
            function a(t) {
                var r = n(this, t)["delete"](t);
                this.size -= r ? 1 : 0;
                return r;
            }
            t.exports = a;
        },
        function(t, r) {
            function e(t) {
                var r = typeof t;
                return r == "string" || r == "number" || r == "symbol" || r == "boolean" ? t !== "__proto__" : t === null;
            }
            t.exports = e;
        },
        function(t, r, e) {
            var n = e(29);
            function a(t) {
                return n(this, t).get(t);
            }
            t.exports = a;
        },
        function(t, r, e) {
            var n = e(29);
            function a(t) {
                return n(this, t).has(t);
            }
            t.exports = a;
        },
        function(t, r, e) {
            var n = e(29);
            function a(t, r) {
                var e = n(this, t), a = e.size;
                e.set(t, r);
                this.size += e.size == a ? 0 : 1;
                return this;
            }
            t.exports = a;
        },
        function(t, r, e) {
            var n = e(122);
            var a = n();
            t.exports = a;
        },
        function(t, r) {
            function e(t) {
                return function(r, e, n) {
                    var a = -1, o = Object(r), i = n(r), u = i.length;
                    while(u--){
                        var s = i[t ? u : ++a];
                        if (e(o[s], s, o) === false) {
                            break;
                        }
                    }
                    return r;
                };
            }
            t.exports = e;
        },
        function(t, r, e) {
            var n = e(48), a = e(124), o = e(125), i = e(128), u = e(129), s = e(30), c = e(15), f = e(133), l = e(52), v = e(36), h = e(14), d = e(135), $ = e(53), _ = e(54), p = e(139);
            function x(t, r, e, x, g, y, m) {
                var w = _(t, e), b = _(r, e), C = m.get(b);
                if (C) {
                    n(t, e, C);
                    return;
                }
                var R = y ? y(w, b, e + "", t, r, m) : undefined;
                var E = R === undefined;
                if (E) {
                    var O = c(b), S = !O && l(b), k = !O && !S && $(b);
                    R = b;
                    if (O || S || k) {
                        if (c(w)) {
                            R = w;
                        } else if (f(w)) {
                            R = i(w);
                        } else if (S) {
                            E = false;
                            R = a(b, true);
                        } else if (k) {
                            E = false;
                            R = o(b, true);
                        } else {
                            R = [];
                        }
                    } else if (d(b) || s(b)) {
                        R = w;
                        if (s(w)) {
                            R = p(w);
                        } else if (!h(w) || v(w)) {
                            R = u(b);
                        }
                    } else {
                        E = false;
                    }
                }
                if (E) {
                    m.set(b, R);
                    g(R, b, x, y, m);
                    m["delete"](b);
                }
                n(t, e, R);
            }
            t.exports = x;
        },
        function(t, r, e) {
            (function(t) {
                var n = e(17);
                var a = true && r && !r.nodeType && r;
                var o = a && typeof t == "object" && t && !t.nodeType && t;
                var i = o && o.exports === a;
                var u = i ? n.Buffer : undefined, s = u ? u.allocUnsafe : undefined;
                function c(t, r) {
                    if (r) {
                        return t.slice();
                    }
                    var e = t.length, n = s ? s(e) : new t.constructor(e);
                    t.copy(n);
                    return n;
                }
                t.exports = c;
            }.call(this, e(38)(t)));
        },
        function(t, r, e) {
            var n = e(126);
            function a(t, r) {
                var e = r ? n(t.buffer) : t.buffer;
                return new t.constructor(e, t.byteOffset, t.length);
            }
            t.exports = a;
        },
        function(t, r, e) {
            var n = e(127);
            function a(t) {
                var r = new t.constructor(t.byteLength);
                new n(r).set(new n(t));
                return r;
            }
            t.exports = a;
        },
        function(t, r, e) {
            var n = e(17);
            var a = n.Uint8Array;
            t.exports = a;
        },
        function(t, r) {
            function e(t, r) {
                var e = -1, n = t.length;
                r || (r = Array(n));
                while(++e < n){
                    r[e] = t[e];
                }
                return r;
            }
            t.exports = e;
        },
        function(t, r, e) {
            var n = e(130), a = e(50), o = e(51);
            function i(t) {
                return typeof t.constructor == "function" && !o(t) ? n(a(t)) : {};
            }
            t.exports = i;
        },
        function(t, r, e) {
            var n = e(14);
            var a = Object.create;
            var o = (function() {
                function t() {}
                return function(r) {
                    if (!n(r)) {
                        return {};
                    }
                    if (a) {
                        return a(r);
                    }
                    t.prototype = r;
                    var e = new t();
                    t.prototype = undefined;
                    return e;
                };
            })();
            t.exports = o;
        },
        function(t, r) {
            function e(t, r) {
                return function(e) {
                    return t(r(e));
                };
            }
            t.exports = e;
        },
        function(t, r, e) {
            var n = e(22), a = e(18);
            var o = "[object Arguments]";
            function i(t) {
                return a(t) && n(t) == o;
            }
            t.exports = i;
        },
        function(t, r, e) {
            var n = e(39), a = e(18);
            function o(t) {
                return a(t) && n(t);
            }
            t.exports = o;
        },
        function(t, r) {
            function e() {
                return false;
            }
            t.exports = e;
        },
        function(t, r, e) {
            var n = e(22), a = e(50), o = e(18);
            var i = "[object Object]";
            var u = Function.prototype, s = Object.prototype;
            var c = u.toString;
            var f = s.hasOwnProperty;
            var l = c.call(Object);
            function v(t) {
                if (!o(t) || n(t) != i) {
                    return false;
                }
                var r = a(t);
                if (r === null) {
                    return true;
                }
                var e = f.call(r, "constructor") && r.constructor;
                return (typeof e == "function" && e instanceof e && c.call(e) == l);
            }
            t.exports = v;
        },
        function(t, r, e) {
            var n = e(22), a = e(40), o = e(18);
            var i = "[object Arguments]", u = "[object Array]", s = "[object Boolean]", c = "[object Date]", f = "[object Error]", l = "[object Function]", v = "[object Map]", h = "[object Number]", d = "[object Object]", $ = "[object RegExp]", _ = "[object Set]", p = "[object String]", x = "[object WeakMap]";
            var g = "[object ArrayBuffer]", y = "[object DataView]", m = "[object Float32Array]", w = "[object Float64Array]", b = "[object Int8Array]", C = "[object Int16Array]", R = "[object Int32Array]", E = "[object Uint8Array]", O = "[object Uint8ClampedArray]", S = "[object Uint16Array]", k = "[object Uint32Array]";
            var A = {};
            A[m] = A[w] = A[b] = A[C] = A[R] = A[E] = A[O] = A[S] = A[k] = true;
            A[i] = A[u] = A[g] = A[s] = A[y] = A[c] = A[f] = A[l] = A[v] = A[h] = A[d] = A[$] = A[_] = A[p] = A[x] = false;
            function D(t) {
                return (o(t) && a(t.length) && !!A[n(t)]);
            }
            t.exports = D;
        },
        function(t, r) {
            function e(t) {
                return function(r) {
                    return t(r);
                };
            }
            t.exports = e;
        },
        function(t, r, e) {
            (function(t) {
                var n = e(45);
                var a = true && r && !r.nodeType && r;
                var o = a && typeof t == "object" && t && !t.nodeType && t;
                var i = o && o.exports === a;
                var u = i && n.process;
                var s = (function() {
                    try {
                        var t = o && o.require && o.require("util").types;
                        if (t) {
                            return t;
                        }
                        return (u && u.binding && u.binding("util"));
                    } catch (r) {}
                })();
                t.exports = s;
            }.call(this, e(38)(t)));
        },
        function(t, r, e) {
            var n = e(140), a = e(56);
            function o(t) {
                return n(t, a(t));
            }
            t.exports = o;
        },
        function(t, r, e) {
            var n = e(55), a = e(37);
            function o(t, r, e, o) {
                var i = !e;
                e || (e = {});
                var u = -1, s = r.length;
                while(++u < s){
                    var c = r[u];
                    var f = o ? o(e[c], t[c], c, e, t) : undefined;
                    if (f === undefined) {
                        f = t[c];
                    }
                    if (i) {
                        a(e, c, f);
                    } else {
                        n(e, c, f);
                    }
                }
                return e;
            }
            t.exports = o;
        },
        function(t, r, e) {
            var n = e(142), a = e(30), o = e(15), i = e(52), u = e(31), s = e(53);
            var c = Object.prototype;
            var f = c.hasOwnProperty;
            function l(t, r) {
                var e = o(t), c = !e && a(t), l = !e && !c && i(t), v = !e && !c && !l && s(t), h = e || c || l || v, d = h ? n(t.length, String) : [], $ = d.length;
                for(var _ in t){
                    if ((r || f.call(t, _)) && !(h && (_ == "length" || (l && (_ == "offset" || _ == "parent")) || (v && (_ == "buffer" || _ == "byteLength" || _ == "byteOffset")) || u(_, $)))) {
                        d.push(_);
                    }
                }
                return d;
            }
            t.exports = l;
        },
        function(t, r) {
            function e(t, r) {
                var e = -1, n = Array(t);
                while(++e < t){
                    n[e] = r(e);
                }
                return n;
            }
            t.exports = e;
        },
        function(t, r, e) {
            var n = e(14), a = e(51), o = e(144);
            var i = Object.prototype;
            var u = i.hasOwnProperty;
            function s(t) {
                if (!n(t)) {
                    return o(t);
                }
                var r = a(t), e = [];
                for(var i in t){
                    if (!(i == "constructor" && (r || !u.call(t, i)))) {
                        e.push(i);
                    }
                }
                return e;
            }
            t.exports = s;
        },
        function(t, r) {
            function e(t) {
                var r = [];
                if (t != null) {
                    for(var e in Object(t)){
                        r.push(e);
                    }
                }
                return r;
            }
            t.exports = e;
        },
        function(t, r, e) {
            var n = e(146), a = e(151);
            function o(t) {
                return n(function(r, e) {
                    var n = -1, o = e.length, i = o > 1 ? e[o - 1] : undefined, u = o > 2 ? e[2] : undefined;
                    i = t.length > 3 && typeof i == "function" ? (o--, i) : undefined;
                    if (u && a(e[0], e[1], u)) {
                        i = o < 3 ? undefined : i;
                        o = 1;
                    }
                    r = Object(r);
                    while(++n < o){
                        var s = e[n];
                        if (s) {
                            t(r, s, n, i);
                        }
                    }
                    return r;
                });
            }
            t.exports = o;
        },
        function(t, r, e) {
            var n = e(57), a = e(58), o = e(59);
            function i(t, r) {
                return o(a(t, r, n), t + "");
            }
            t.exports = i;
        },
        function(t, r) {
            function e(t, r, e) {
                switch(e.length){
                    case 0:
                        return t.call(r);
                    case 1:
                        return t.call(r, e[0]);
                    case 2:
                        return t.call(r, e[0], e[1]);
                    case 3:
                        return t.call(r, e[0], e[1], e[2]);
                }
                return t.apply(r, e);
            }
            t.exports = e;
        },
        function(t, r, e) {
            var n = e(149), a = e(49), o = e(57);
            var i = !a ? o : function(t, r) {
                return a(t, "toString", {
                    configurable: true,
                    enumerable: false,
                    value: n(r),
                    writable: true
                });
            };
            t.exports = i;
        },
        function(t, r) {
            function e(t) {
                return function() {
                    return t;
                };
            }
            t.exports = e;
        },
        function(t, r) {
            var e = 800, n = 16;
            var a = Date.now;
            function o(t) {
                var r = 0, o = 0;
                return function() {
                    var i = a(), u = n - (i - o);
                    o = i;
                    if (u > 0) {
                        if (++r >= e) {
                            return arguments[0];
                        }
                    } else {
                        r = 0;
                    }
                    return t.apply(undefined, arguments);
                };
            }
            t.exports = o;
        },
        function(t, r, e) {
            var n = e(26), a = e(39), o = e(31), i = e(14);
            function u(t, r, e) {
                if (!i(e)) {
                    return false;
                }
                var u = typeof r;
                if (u == "number" ? a(e) && o(r, e.length) : u == "string" && r in e) {
                    return n(e[r], t);
                }
                return false;
            }
            t.exports = u;
        },
        function(t, r) {
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
                Math.imul = function(t, r) {
                    var e = (t >>> 16) & 0xffff;
                    var n = t & 0xffff;
                    var a = (r >>> 16) & 0xffff;
                    var o = r & 0xffff;
                    return ((n * o + (((e * o + n * a) << 16) >>> 0)) | 0);
                };
            }
            if (typeof Object.assign !== "function") {
                Object.assign = function(t) {
                    "use strict";
                    if (t === null) {
                        throw new TypeError("Cannot convert undefined or null to object");
                    }
                    var r = Object(t);
                    for(var e = 1; e < arguments.length; e++){
                        var n = arguments[e];
                        if (n !== null) {
                            for(var a in n){
                                if (Object.prototype.hasOwnProperty.call(n, a)) {
                                    r[a] = n[a];
                                }
                            }
                        }
                    }
                    return r;
                };
            }
        },
        function(t, r) {
            function e(t) {
                if (Array.isArray(t)) return t;
            }
            t.exports = e;
            (t.exports["default"] = t.exports), (t.exports.__esModule = true);
        },
        function(t, r) {
            function e(t, r) {
                var e = t == null ? null : (typeof Symbol !== "undefined" && t[Symbol.iterator]) || t["@@iterator"];
                if (e == null) return;
                var n = [];
                var a = true;
                var o = false;
                var i, u;
                try {
                    for(e = e.call(t); !(a = (i = e.next()).done); a = true){
                        n.push(i.value);
                        if (r && n.length === r) break;
                    }
                } catch (s) {
                    o = true;
                    u = s;
                } finally{
                    try {
                        if (!a && e["return"] != null) e["return"]();
                    } finally{
                        if (o) throw u;
                    }
                }
                return n;
            }
            t.exports = e;
            (t.exports["default"] = t.exports), (t.exports.__esModule = true);
        },
        function(t, r) {
            function e() {
                throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
            }
            t.exports = e;
            (t.exports["default"] = t.exports), (t.exports.__esModule = true);
        },
        function(t, r) {
            t.exports = e;
            function e(t) {
                var r = new Float32Array(2);
                r[0] = t[0];
                r[1] = t[1];
                return r;
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t, r) {
                var e = new Float32Array(2);
                e[0] = t;
                e[1] = r;
                return e;
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t, r) {
                t[0] = r[0];
                t[1] = r[1];
                return t;
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t, r, e) {
                t[0] = r;
                t[1] = e;
                return t;
            }
        },
        function(t, r, e) {
            t.exports = a;
            var n = e(62);
            function a(t, r) {
                var e = t[0];
                var a = t[1];
                var o = r[0];
                var i = r[1];
                return (Math.abs(e - o) <= n * Math.max(1.0, Math.abs(e), Math.abs(o)) && Math.abs(a - i) <= n * Math.max(1.0, Math.abs(a), Math.abs(i)));
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t, r) {
                return t[0] === r[0] && t[1] === r[1];
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t, r, e) {
                t[0] = r[0] + e[0];
                t[1] = r[1] + e[1];
                return t;
            }
        },
        function(t, r, e) {
            t.exports = e(64);
        },
        function(t, r, e) {
            t.exports = e(65);
        },
        function(t, r, e) {
            t.exports = e(66);
        },
        function(t, r) {
            t.exports = e;
            function e(t, r) {
                t[0] = 1.0 / r[0];
                t[1] = 1.0 / r[1];
                return t;
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t, r, e) {
                t[0] = Math.min(r[0], e[0]);
                t[1] = Math.min(r[1], e[1]);
                return t;
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t, r, e) {
                t[0] = Math.max(r[0], e[0]);
                t[1] = Math.max(r[1], e[1]);
                return t;
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t, r, e) {
                var n = Math.cos(e), a = Math.sin(e);
                var o = r[0], i = r[1];
                t[0] = o * n - i * a;
                t[1] = o * a + i * n;
                return t;
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t, r) {
                t[0] = Math.floor(r[0]);
                t[1] = Math.floor(r[1]);
                return t;
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t, r) {
                t[0] = Math.ceil(r[0]);
                t[1] = Math.ceil(r[1]);
                return t;
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t, r) {
                t[0] = Math.round(r[0]);
                t[1] = Math.round(r[1]);
                return t;
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t, r, e) {
                t[0] = r[0] * e;
                t[1] = r[1] * e;
                return t;
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t, r, e, n) {
                t[0] = r[0] + e[0] * n;
                t[1] = r[1] + e[1] * n;
                return t;
            }
        },
        function(t, r, e) {
            t.exports = e(67);
        },
        function(t, r, e) {
            t.exports = e(68);
        },
        function(t, r, e) {
            t.exports = e(69);
        },
        function(t, r, e) {
            t.exports = e(70);
        },
        function(t, r) {
            t.exports = e;
            function e(t, r) {
                t[0] = -r[0];
                t[1] = -r[1];
                return t;
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t, r) {
                var e = r[0], n = r[1];
                var a = e * e + n * n;
                if (a > 0) {
                    a = 1 / Math.sqrt(a);
                    t[0] = r[0] * a;
                    t[1] = r[1] * a;
                }
                return t;
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t, r) {
                return t[0] * r[0] + t[1] * r[1];
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t, r, e) {
                var n = r[0] * e[1] - r[1] * e[0];
                t[0] = t[1] = 0;
                t[2] = n;
                return t;
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t, r, e, n) {
                var a = r[0], o = r[1];
                t[0] = a + n * (e[0] - a);
                t[1] = o + n * (e[1] - o);
                return t;
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t, r) {
                r = r || 1.0;
                var e = Math.random() * 2.0 * Math.PI;
                t[0] = Math.cos(e) * r;
                t[1] = Math.sin(e) * r;
                return t;
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t, r, e) {
                var n = r[0], a = r[1];
                t[0] = e[0] * n + e[2] * a;
                t[1] = e[1] * n + e[3] * a;
                return t;
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t, r, e) {
                var n = r[0], a = r[1];
                t[0] = e[0] * n + e[2] * a + e[4];
                t[1] = e[1] * n + e[3] * a + e[5];
                return t;
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t, r, e) {
                var n = r[0], a = r[1];
                t[0] = e[0] * n + e[3] * a + e[6];
                t[1] = e[1] * n + e[4] * a + e[7];
                return t;
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t, r, e) {
                var n = r[0], a = r[1];
                t[0] = e[0] * n + e[4] * a + e[12];
                t[1] = e[1] * n + e[5] * a + e[13];
                return t;
            }
        },
        function(t, r, e) {
            t.exports = a;
            var n = e(63)();
            function a(t, r, e, a, o, i) {
                var u, s;
                if (!r) {
                    r = 2;
                }
                if (!e) {
                    e = 0;
                }
                if (a) {
                    s = Math.min(a * r + e, t.length);
                } else {
                    s = t.length;
                }
                for(u = e; u < s; u += r){
                    n[0] = t[u];
                    n[1] = t[u + 1];
                    o(n, n, i);
                    t[u] = n[0];
                    t[u + 1] = n[1];
                }
                return t;
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t, r, e) {
                var n = r[0] * r[0] + r[1] * r[1];
                if (n > e * e) {
                    var a = Math.sqrt(n);
                    t[0] = (r[0] / a) * e;
                    t[1] = (r[1] / a) * e;
                } else {
                    t[0] = r[0];
                    t[1] = r[1];
                }
                return t;
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t) {
                var r = new Float32Array(3);
                r[0] = t[0];
                r[1] = t[1];
                r[2] = t[2];
                return r;
            }
        },
        function(t, r, e) {
            t.exports = i;
            var n = e(73);
            var a = e(74);
            var o = e(75);
            function i(t, r) {
                var e = n(t[0], t[1], t[2]);
                var i = n(r[0], r[1], r[2]);
                a(e, e);
                a(i, i);
                var u = o(e, i);
                if (u > 1.0) {
                    return 0;
                } else {
                    return Math.acos(u);
                }
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t, r) {
                t[0] = r[0];
                t[1] = r[1];
                t[2] = r[2];
                return t;
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t, r, e, n) {
                t[0] = r;
                t[1] = e;
                t[2] = n;
                return t;
            }
        },
        function(t, r, e) {
            t.exports = a;
            var n = e(71);
            function a(t, r) {
                var e = t[0];
                var a = t[1];
                var o = t[2];
                var i = r[0];
                var u = r[1];
                var s = r[2];
                return (Math.abs(e - i) <= n * Math.max(1.0, Math.abs(e), Math.abs(i)) && Math.abs(a - u) <= n * Math.max(1.0, Math.abs(a), Math.abs(u)) && Math.abs(o - s) <= n * Math.max(1.0, Math.abs(o), Math.abs(s)));
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t, r) {
                return t[0] === r[0] && t[1] === r[1] && t[2] === r[2];
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t, r, e) {
                t[0] = r[0] + e[0];
                t[1] = r[1] + e[1];
                t[2] = r[2] + e[2];
                return t;
            }
        },
        function(t, r, e) {
            t.exports = e(76);
        },
        function(t, r, e) {
            t.exports = e(77);
        },
        function(t, r, e) {
            t.exports = e(78);
        },
        function(t, r) {
            t.exports = e;
            function e(t, r, e) {
                t[0] = Math.min(r[0], e[0]);
                t[1] = Math.min(r[1], e[1]);
                t[2] = Math.min(r[2], e[2]);
                return t;
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t, r, e) {
                t[0] = Math.max(r[0], e[0]);
                t[1] = Math.max(r[1], e[1]);
                t[2] = Math.max(r[2], e[2]);
                return t;
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t, r) {
                t[0] = Math.floor(r[0]);
                t[1] = Math.floor(r[1]);
                t[2] = Math.floor(r[2]);
                return t;
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t, r) {
                t[0] = Math.ceil(r[0]);
                t[1] = Math.ceil(r[1]);
                t[2] = Math.ceil(r[2]);
                return t;
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t, r) {
                t[0] = Math.round(r[0]);
                t[1] = Math.round(r[1]);
                t[2] = Math.round(r[2]);
                return t;
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t, r, e) {
                t[0] = r[0] * e;
                t[1] = r[1] * e;
                t[2] = r[2] * e;
                return t;
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t, r, e, n) {
                t[0] = r[0] + e[0] * n;
                t[1] = r[1] + e[1] * n;
                t[2] = r[2] + e[2] * n;
                return t;
            }
        },
        function(t, r, e) {
            t.exports = e(79);
        },
        function(t, r, e) {
            t.exports = e(80);
        },
        function(t, r, e) {
            t.exports = e(81);
        },
        function(t, r, e) {
            t.exports = e(82);
        },
        function(t, r) {
            t.exports = e;
            function e(t, r) {
                t[0] = -r[0];
                t[1] = -r[1];
                t[2] = -r[2];
                return t;
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t, r) {
                t[0] = 1.0 / r[0];
                t[1] = 1.0 / r[1];
                t[2] = 1.0 / r[2];
                return t;
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t, r, e) {
                var n = r[0], a = r[1], o = r[2], i = e[0], u = e[1], s = e[2];
                t[0] = a * s - o * u;
                t[1] = o * i - n * s;
                t[2] = n * u - a * i;
                return t;
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t, r, e, n) {
                var a = r[0], o = r[1], i = r[2];
                t[0] = a + n * (e[0] - a);
                t[1] = o + n * (e[1] - o);
                t[2] = i + n * (e[2] - i);
                return t;
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t, r) {
                r = r || 1.0;
                var e = Math.random() * 2.0 * Math.PI;
                var n = Math.random() * 2.0 - 1.0;
                var a = Math.sqrt(1.0 - n * n) * r;
                t[0] = Math.cos(e) * a;
                t[1] = Math.sin(e) * a;
                t[2] = n * r;
                return t;
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t, r, e) {
                var n = r[0], a = r[1], o = r[2], i = e[3] * n + e[7] * a + e[11] * o + e[15];
                i = i || 1.0;
                t[0] = (e[0] * n + e[4] * a + e[8] * o + e[12]) / i;
                t[1] = (e[1] * n + e[5] * a + e[9] * o + e[13]) / i;
                t[2] = (e[2] * n + e[6] * a + e[10] * o + e[14]) / i;
                return t;
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t, r, e) {
                var n = r[0], a = r[1], o = r[2];
                t[0] = n * e[0] + a * e[3] + o * e[6];
                t[1] = n * e[1] + a * e[4] + o * e[7];
                t[2] = n * e[2] + a * e[5] + o * e[8];
                return t;
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t, r, e) {
                var n = r[0], a = r[1], o = r[2], i = e[0], u = e[1], s = e[2], c = e[3], f = c * n + u * o - s * a, l = c * a + s * n - i * o, v = c * o + i * a - u * n, h = -i * n - u * a - s * o;
                t[0] = f * c + h * -i + l * -s - v * -u;
                t[1] = l * c + h * -u + v * -i - f * -s;
                t[2] = v * c + h * -s + f * -u - l * -i;
                return t;
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t, r, e, n) {
                var a = e[1];
                var o = e[2];
                var i = r[1] - a;
                var u = r[2] - o;
                var s = Math.sin(n);
                var c = Math.cos(n);
                t[0] = r[0];
                t[1] = a + i * c - u * s;
                t[2] = o + i * s + u * c;
                return t;
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t, r, e, n) {
                var a = e[0];
                var o = e[2];
                var i = r[0] - a;
                var u = r[2] - o;
                var s = Math.sin(n);
                var c = Math.cos(n);
                t[0] = a + u * s + i * c;
                t[1] = r[1];
                t[2] = o + u * c - i * s;
                return t;
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t, r, e, n) {
                var a = e[0];
                var o = e[1];
                var i = r[0] - a;
                var u = r[1] - o;
                var s = Math.sin(n);
                var c = Math.cos(n);
                t[0] = a + i * c - u * s;
                t[1] = o + i * s + u * c;
                t[2] = r[2];
                return t;
            }
        },
        function(t, r, e) {
            t.exports = a;
            var n = e(72)();
            function a(t, r, e, a, o, i) {
                var u, s;
                if (!r) {
                    r = 3;
                }
                if (!e) {
                    e = 0;
                }
                if (a) {
                    s = Math.min(a * r + e, t.length);
                } else {
                    s = t.length;
                }
                for(u = e; u < s; u += r){
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
        function(t, r, e) {
            var n = e(61);
            function a(t) {
                if (Array.isArray(t)) return n(t);
            }
            t.exports = a;
            (t.exports["default"] = t.exports), (t.exports.__esModule = true);
        },
        function(t, r) {
            function e(t) {
                if ((typeof Symbol !== "undefined" && t[Symbol.iterator] != null) || t["@@iterator"] != null) return Array.from(t);
            }
            t.exports = e;
            (t.exports["default"] = t.exports), (t.exports.__esModule = true);
        },
        function(t, r) {
            function e() {
                throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
            }
            t.exports = e;
            (t.exports["default"] = t.exports), (t.exports.__esModule = true);
        },
        function(t, r, e) {
            var n = e(2);
            function a(t, r) {
                while(!Object.prototype.hasOwnProperty.call(t, r)){
                    t = n(t);
                    if (t === null) break;
                }
                return t;
            }
            t.exports = a;
            (t.exports["default"] = t.exports), (t.exports.__esModule = true);
        },
        function(t, r, e) {
            var n = (function(t) {
                "use strict";
                var r = Object.prototype;
                var e = r.hasOwnProperty;
                var n;
                var a = typeof Symbol === "function" ? Symbol : {};
                var o = a.iterator || "@@iterator";
                var i = a.asyncIterator || "@@asyncIterator";
                var u = a.toStringTag || "@@toStringTag";
                function s(t, r, e, n) {
                    var a = r && r.prototype instanceof $ ? r : $;
                    var o = Object.create(a.prototype);
                    var i = new S(n || []);
                    o._invoke = C(t, e, i);
                    return o;
                }
                t.wrap = s;
                function c(t, r, e) {
                    try {
                        return {
                            type: "normal",
                            arg: t.call(r, e)
                        };
                    } catch (n) {
                        return {
                            type: "throw",
                            arg: n
                        };
                    }
                }
                var f = "suspendedStart";
                var l = "suspendedYield";
                var v = "executing";
                var h = "completed";
                var d = {};
                function $() {}
                function _() {}
                function p() {}
                var x = {};
                x[o] = function() {
                    return this;
                };
                var g = Object.getPrototypeOf;
                var y = g && g(g(k([])));
                if (y && y !== r && e.call(y, o)) {
                    x = y;
                }
                var m = (p.prototype = $.prototype = Object.create(x));
                _.prototype = m.constructor = p;
                p.constructor = _;
                p[u] = _.displayName = "GeneratorFunction";
                function w(t) {
                    [
                        "next",
                        "throw",
                        "return"
                    ].forEach(function(r) {
                        t[r] = function(t) {
                            return this._invoke(r, t);
                        };
                    });
                }
                t.isGeneratorFunction = function(t) {
                    var r = typeof t === "function" && t.constructor;
                    return r ? r === _ || (r.displayName || r.name) === "GeneratorFunction" : false;
                };
                t.mark = function(t) {
                    if (Object.setPrototypeOf) {
                        Object.setPrototypeOf(t, p);
                    } else {
                        t.__proto__ = p;
                        if (!(u in t)) {
                            t[u] = "GeneratorFunction";
                        }
                    }
                    t.prototype = Object.create(m);
                    return t;
                };
                t.awrap = function(t) {
                    return {
                        __await: t
                    };
                };
                function b(t, r) {
                    function n(a, o, i, u) {
                        var s = c(t[a], t, o);
                        if (s.type === "throw") {
                            u(s.arg);
                        } else {
                            var f = s.arg;
                            var l = f.value;
                            if (l && typeof l === "object" && e.call(l, "__await")) {
                                return r.resolve(l.__await).then(function(t) {
                                    n("next", t, i, u);
                                }, function(t) {
                                    n("throw", t, i, u);
                                });
                            }
                            return r.resolve(l).then(function(t) {
                                f.value = t;
                                i(f);
                            }, function(t) {
                                return n("throw", t, i, u);
                            });
                        }
                    }
                    var a;
                    function o(t, e) {
                        function o() {
                            return new r(function(r, a) {
                                n(t, e, r, a);
                            });
                        }
                        return (a = a ? a.then(o, o) : o());
                    }
                    this._invoke = o;
                }
                w(b.prototype);
                b.prototype[i] = function() {
                    return this;
                };
                t.AsyncIterator = b;
                t.async = function(r, e, n, a, o) {
                    if (o === void 0) o = Promise;
                    var i = new b(s(r, e, n, a), o);
                    return t.isGeneratorFunction(e) ? i : i.next().then(function(t) {
                        return t.done ? t.value : i.next();
                    });
                };
                function C(t, r, e) {
                    var n = f;
                    return function a(o, i) {
                        if (n === v) {
                            throw new Error("Generator is already running");
                        }
                        if (n === h) {
                            if (o === "throw") {
                                throw i;
                            }
                            return A();
                        }
                        e.method = o;
                        e.arg = i;
                        while(true){
                            var u = e.delegate;
                            if (u) {
                                var s = R(u, e);
                                if (s) {
                                    if (s === d) continue;
                                    return s;
                                }
                            }
                            if (e.method === "next") {
                                e.sent = e._sent = e.arg;
                            } else if (e.method === "throw") {
                                if (n === f) {
                                    n = h;
                                    throw e.arg;
                                }
                                e.dispatchException(e.arg);
                            } else if (e.method === "return") {
                                e.abrupt("return", e.arg);
                            }
                            n = v;
                            var $ = c(t, r, e);
                            if ($.type === "normal") {
                                n = e.done ? h : l;
                                if ($.arg === d) {
                                    continue;
                                }
                                return {
                                    value: $.arg,
                                    done: e.done
                                };
                            } else if ($.type === "throw") {
                                n = h;
                                e.method = "throw";
                                e.arg = $.arg;
                            }
                        }
                    };
                }
                function R(t, r) {
                    var e = t.iterator[r.method];
                    if (e === n) {
                        r.delegate = null;
                        if (r.method === "throw") {
                            if (t.iterator["return"]) {
                                r.method = "return";
                                r.arg = n;
                                R(t, r);
                                if (r.method === "throw") {
                                    return d;
                                }
                            }
                            r.method = "throw";
                            r.arg = new TypeError("The iterator does not provide a 'throw' method");
                        }
                        return d;
                    }
                    var a = c(e, t.iterator, r.arg);
                    if (a.type === "throw") {
                        r.method = "throw";
                        r.arg = a.arg;
                        r.delegate = null;
                        return d;
                    }
                    var o = a.arg;
                    if (!o) {
                        r.method = "throw";
                        r.arg = new TypeError("iterator result is not an object");
                        r.delegate = null;
                        return d;
                    }
                    if (o.done) {
                        r[t.resultName] = o.value;
                        r.next = t.nextLoc;
                        if (r.method !== "return") {
                            r.method = "next";
                            r.arg = n;
                        }
                    } else {
                        return o;
                    }
                    r.delegate = null;
                    return d;
                }
                w(m);
                m[u] = "Generator";
                m[o] = function() {
                    return this;
                };
                m.toString = function() {
                    return "[object Generator]";
                };
                function E(t) {
                    var r = {
                        tryLoc: t[0]
                    };
                    if (1 in t) {
                        r.catchLoc = t[1];
                    }
                    if (2 in t) {
                        r.finallyLoc = t[2];
                        r.afterLoc = t[3];
                    }
                    this.tryEntries.push(r);
                }
                function O(t) {
                    var r = t.completion || {};
                    r.type = "normal";
                    delete r.arg;
                    t.completion = r;
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
                    var r = [];
                    for(var e in t){
                        r.push(e);
                    }
                    r.reverse();
                    return function e() {
                        while(r.length){
                            var n = r.pop();
                            if (n in t) {
                                e.value = n;
                                e.done = false;
                                return e;
                            }
                        }
                        e.done = true;
                        return e;
                    };
                };
                function k(t) {
                    if (t) {
                        var r = t[o];
                        if (r) {
                            return r.call(t);
                        }
                        if (typeof t.next === "function") {
                            return t;
                        }
                        if (!isNaN(t.length)) {
                            var a = -1, i = function r() {
                                while(++a < t.length){
                                    if (e.call(t, a)) {
                                        r.value = t[a];
                                        r.done = false;
                                        return r;
                                    }
                                }
                                r.value = n;
                                r.done = true;
                                return r;
                            };
                            return (i.next = i);
                        }
                    }
                    return {
                        next: A
                    };
                }
                t.values = k;
                function A() {
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
                        this.tryEntries.forEach(O);
                        if (!t) {
                            for(var r in this){
                                if (r.charAt(0) === "t" && e.call(this, r) && !isNaN(+r.slice(1))) {
                                    this[r] = n;
                                }
                            }
                        }
                    },
                    stop: function() {
                        this.done = true;
                        var t = this.tryEntries[0];
                        var r = t.completion;
                        if (r.type === "throw") {
                            throw r.arg;
                        }
                        return this.rval;
                    },
                    dispatchException: function(t) {
                        if (this.done) {
                            throw t;
                        }
                        var r = this;
                        function a(e, a) {
                            u.type = "throw";
                            u.arg = t;
                            r.next = e;
                            if (a) {
                                r.method = "next";
                                r.arg = n;
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
                                var s = e.call(i, "catchLoc");
                                var c = e.call(i, "finallyLoc");
                                if (s && c) {
                                    if (this.prev < i.catchLoc) {
                                        return a(i.catchLoc, true);
                                    } else if (this.prev < i.finallyLoc) {
                                        return a(i.finallyLoc);
                                    }
                                } else if (s) {
                                    if (this.prev < i.catchLoc) {
                                        return a(i.catchLoc, true);
                                    }
                                } else if (c) {
                                    if (this.prev < i.finallyLoc) {
                                        return a(i.finallyLoc);
                                    }
                                } else {
                                    throw new Error("try statement without catch or finally");
                                }
                            }
                        }
                    },
                    abrupt: function(t, r) {
                        for(var n = this.tryEntries.length - 1; n >= 0; --n){
                            var a = this.tryEntries[n];
                            if (a.tryLoc <= this.prev && e.call(a, "finallyLoc") && this.prev < a.finallyLoc) {
                                var o = a;
                                break;
                            }
                        }
                        if (o && (t === "break" || t === "continue") && o.tryLoc <= r && r <= o.finallyLoc) {
                            o = null;
                        }
                        var i = o ? o.completion : {};
                        i.type = t;
                        i.arg = r;
                        if (o) {
                            this.method = "next";
                            this.next = o.finallyLoc;
                            return d;
                        }
                        return this.complete(i);
                    },
                    complete: function(t, r) {
                        if (t.type === "throw") {
                            throw t.arg;
                        }
                        if (t.type === "break" || t.type === "continue") {
                            this.next = t.arg;
                        } else if (t.type === "return") {
                            this.rval = this.arg = t.arg;
                            this.method = "return";
                            this.next = "end";
                        } else if (t.type === "normal" && r) {
                            this.next = r;
                        }
                        return d;
                    },
                    finish: function(t) {
                        for(var r = this.tryEntries.length - 1; r >= 0; --r){
                            var e = this.tryEntries[r];
                            if (e.finallyLoc === t) {
                                this.complete(e.completion, e.afterLoc);
                                O(e);
                                return d;
                            }
                        }
                    },
                    catch: function(t) {
                        for(var r = this.tryEntries.length - 1; r >= 0; --r){
                            var e = this.tryEntries[r];
                            if (e.tryLoc === t) {
                                var n = e.completion;
                                if (n.type === "throw") {
                                    var a = n.arg;
                                    O(e);
                                }
                                return a;
                            }
                        }
                        throw new Error("illegal catch attempt");
                    },
                    delegateYield: function(t, r, e) {
                        this.delegate = {
                            iterator: k(t),
                            resultName: r,
                            nextLoc: e
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
        function(t, r, e) {
            var n = e(230), a = e(240);
            function o(t, r) {
                return n(t, r, function(r, e) {
                    return a(t, e);
                });
            }
            t.exports = o;
        },
        function(t, r, e) {
            var n = e(231), a = e(239), o = e(32);
            function i(t, r, e) {
                var i = -1, u = r.length, s = {};
                while(++i < u){
                    var c = r[i], f = n(t, c);
                    if (e(f, c)) {
                        a(s, o(c, t), f);
                    }
                }
                return s;
            }
            t.exports = i;
        },
        function(t, r, e) {
            var n = e(32), a = e(43);
            function o(t, r) {
                r = n(r, t);
                var e = 0, o = r.length;
                while(t != null && e < o){
                    t = t[a(r[e++])];
                }
                return e && e == o ? t : undefined;
            }
            t.exports = o;
        },
        function(t, r, e) {
            var n = e(15), a = e(42);
            var o = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, i = /^\w*$/;
            function u(t, r) {
                if (n(t)) {
                    return false;
                }
                var e = typeof t;
                if (e == "number" || e == "symbol" || e == "boolean" || t == null || a(t)) {
                    return true;
                }
                return (i.test(t) || !o.test(t) || (r != null && t in Object(r)));
            }
            t.exports = u;
        },
        function(t, r, e) {
            var n = e(234);
            var a = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
            var o = /\\(\\)?/g;
            var i = n(function(t) {
                var r = [];
                if (t.charCodeAt(0) === 46) {
                    r.push("");
                }
                t.replace(a, function(t, e, n, a) {
                    r.push(n ? a.replace(o, "$1") : e || t);
                });
                return r;
            });
            t.exports = i;
        },
        function(t, r, e) {
            var n = e(235);
            var a = 500;
            function o(t) {
                var r = n(t, function(t) {
                    if (e.size === a) {
                        e.clear();
                    }
                    return t;
                });
                var e = r.cache;
                return r;
            }
            t.exports = o;
        },
        function(t, r, e) {
            var n = e(47);
            var a = "Expected a function";
            function o(t, r) {
                if (typeof t != "function" || (r != null && typeof r != "function")) {
                    throw new TypeError(a);
                }
                var e = function() {
                    var n = arguments, a = r ? r.apply(this, n) : n[0], o = e.cache;
                    if (o.has(a)) {
                        return o.get(a);
                    }
                    var i = t.apply(this, n);
                    e.cache = o.set(a, i) || o;
                    return i;
                };
                e.cache = new (o.Cache || n)();
                return e;
            }
            o.Cache = n;
            t.exports = o;
        },
        function(t, r, e) {
            var n = e(237);
            function a(t) {
                return t == null ? "" : n(t);
            }
            t.exports = a;
        },
        function(t, r, e) {
            var n = e(27), a = e(238), o = e(15), i = e(42);
            var u = 1 / 0;
            var s = n ? n.prototype : undefined, c = s ? s.toString : undefined;
            function f(t) {
                if (typeof t == "string") {
                    return t;
                }
                if (o(t)) {
                    return a(t, f) + "";
                }
                if (i(t)) {
                    return c ? c.call(t) : "";
                }
                var r = t + "";
                return r == "0" && 1 / t == -u ? "-0" : r;
            }
            t.exports = f;
        },
        function(t, r) {
            function e(t, r) {
                var e = -1, n = t == null ? 0 : t.length, a = Array(n);
                while(++e < n){
                    a[e] = r(t[e], e, t);
                }
                return a;
            }
            t.exports = e;
        },
        function(t, r, e) {
            var n = e(55), a = e(32), o = e(31), i = e(14), u = e(43);
            function s(t, r, e, s) {
                if (!i(t)) {
                    return t;
                }
                r = a(r, t);
                var c = -1, f = r.length, l = f - 1, v = t;
                while(v != null && ++c < f){
                    var h = u(r[c]), d = e;
                    if (h === "__proto__" || h === "constructor" || h === "prototype") {
                        return t;
                    }
                    if (c != l) {
                        var $ = v[h];
                        d = s ? s($, h, v) : undefined;
                        if (d === undefined) {
                            d = i($) ? $ : o(r[c + 1]) ? [] : {};
                        }
                    }
                    n(v, h, d);
                    v = v[h];
                }
                return t;
            }
            t.exports = s;
        },
        function(t, r, e) {
            var n = e(241), a = e(242);
            function o(t, r) {
                return t != null && a(t, r, n);
            }
            t.exports = o;
        },
        function(t, r) {
            function e(t, r) {
                return t != null && r in Object(t);
            }
            t.exports = e;
        },
        function(t, r, e) {
            var n = e(32), a = e(30), o = e(15), i = e(31), u = e(40), s = e(43);
            function c(t, r, e) {
                r = n(r, t);
                var c = -1, f = r.length, l = false;
                while(++c < f){
                    var v = s(r[c]);
                    if (!(l = t != null && e(t, v))) {
                        break;
                    }
                    t = t[v];
                }
                if (l || ++c != f) {
                    return l;
                }
                f = t == null ? 0 : t.length;
                return (!!f && u(f) && i(v, f) && (o(t) || a(t)));
            }
            t.exports = c;
        },
        function(t, r, e) {
            var n = e(244), a = e(58), o = e(59);
            function i(t) {
                return o(a(t, undefined, n), t + "");
            }
            t.exports = i;
        },
        function(t, r, e) {
            var n = e(245);
            function a(t) {
                var r = t == null ? 0 : t.length;
                return r ? n(t, 1) : [];
            }
            t.exports = a;
        },
        function(t, r, e) {
            var n = e(246), a = e(247);
            function o(t, r, e, i, u) {
                var s = -1, c = t.length;
                e || (e = a);
                u || (u = []);
                while(++s < c){
                    var f = t[s];
                    if (r > 0 && e(f)) {
                        if (r > 1) {
                            o(f, r - 1, e, i, u);
                        } else {
                            n(u, f);
                        }
                    } else if (!i) {
                        u[u.length] = f;
                    }
                }
                return u;
            }
            t.exports = o;
        },
        function(t, r) {
            function e(t, r) {
                var e = -1, n = r.length, a = t.length;
                while(++e < n){
                    t[a + e] = r[e];
                }
                return t;
            }
            t.exports = e;
        },
        function(t, r, e) {
            var n = e(27), a = e(30), o = e(15);
            var i = n ? n.isConcatSpreadable : undefined;
            function u(t) {
                return (o(t) || a(t) || !!(i && t && t[i]));
            }
            t.exports = u;
        },
        function(t, r) {
            function e(t) {
                return (Function.toString.call(t).indexOf("[native code]") !== -1);
            }
            t.exports = e;
            (t.exports["default"] = t.exports), (t.exports.__esModule = true);
        },
        function(t, r, e) {
            var n = e(41);
            var a = e(250);
            function o(r, e, i) {
                if (a()) {
                    t.exports = o = Reflect.construct;
                    (t.exports["default"] = t.exports), (t.exports.__esModule = true);
                } else {
                    t.exports = o = function t(r, e, a) {
                        var o = [
                            null
                        ];
                        o.push.apply(o, e);
                        var i = Function.bind.apply(r, o);
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
        function(t, r) {
            function e() {
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
            t.exports = e;
            (t.exports["default"] = t.exports), (t.exports.__esModule = true);
        },
        function(t, r) {
            t.exports = e;
            function e(t) {
                return t[0] * t[3] - t[2] * t[1];
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t, r) {
                if (t === r) {
                    var e = r[1];
                    t[1] = r[2];
                    t[2] = e;
                } else {
                    t[0] = r[0];
                    t[1] = r[2];
                    t[2] = r[1];
                    t[3] = r[3];
                }
                return t;
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t, r, e) {
                var n = r[0], a = r[1], o = r[2], i = r[3];
                var u = e[0], s = e[1], c = e[2], f = e[3];
                t[0] = n * u + o * s;
                t[1] = a * u + i * s;
                t[2] = n * c + o * f;
                t[3] = a * c + i * f;
                return t;
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t) {
                t[0] = 1;
                t[1] = 0;
                t[2] = 0;
                t[3] = 1;
                return t;
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t, r) {
                var e = r[0];
                t[0] = r[3];
                t[1] = -r[1];
                t[2] = -r[2];
                t[3] = e;
                return t;
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t, r, e) {
                var n = r[0], a = r[1], o = r[2], i = r[3];
                var u = Math.sin(e);
                var s = Math.cos(e);
                t[0] = n * s + o * u;
                t[1] = a * s + i * u;
                t[2] = n * -u + o * s;
                t[3] = a * -u + i * s;
                return t;
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t, r) {
                var e = r[0];
                var n = r[1];
                var a = r[2];
                var o = r[3];
                var i = e * o - a * n;
                if (!i) return null;
                i = 1.0 / i;
                t[0] = o * i;
                t[1] = -n * i;
                t[2] = -a * i;
                t[3] = e * i;
                return t;
            }
        },
        function(t, r) {
            t.exports = e;
            function e() {
                var t = new Float32Array(4);
                t[0] = 1;
                t[1] = 0;
                t[2] = 0;
                t[3] = 1;
                return t;
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t, r, e) {
                var n = r[0], a = r[1], o = r[2], i = r[3];
                var u = e[0], s = e[1];
                t[0] = n * u;
                t[1] = a * u;
                t[2] = o * s;
                t[3] = i * s;
                return t;
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t, r) {
                t[0] = r[0];
                t[1] = r[1];
                t[2] = r[2];
                t[3] = r[3];
                return t;
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t) {
                return Math.sqrt(Math.pow(t[0], 2) + Math.pow(t[1], 2) + Math.pow(t[2], 2) + Math.pow(t[3], 2));
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t, r, e, n) {
                t[2] = n[2] / n[0];
                e[0] = n[0];
                e[1] = n[1];
                e[3] = n[3] - t[2] * e[1];
                return [
                    t,
                    r,
                    e
                ];
            }
        },
        function(t, r, e) {
            "use strict";
            e.r(r);
            e.d(r, "BarcodeDecoder", function() {
                return rd;
            });
            e.d(r, "Readers", function() {
                return n;
            });
            e.d(r, "CameraAccess", function() {
                return rz;
            });
            e.d(r, "ImageDebug", function() {
                return h["a"];
            });
            e.d(r, "ImageWrapper", function() {
                return c["a"];
            });
            e.d(r, "ResultCollector", function() {
                return r7;
            });
            var n = {};
            e.r(n);
            e.d(n, "BarcodeReader", function() {
                return D;
            });
            e.d(n, "TwoOfFiveReader", function() {
                return tK;
            });
            e.d(n, "NewCodabarReader", function() {
                return t0;
            });
            e.d(n, "Code128Reader", function() {
                return z;
            });
            e.d(n, "Code32Reader", function() {
                return rv;
            });
            e.d(n, "Code39Reader", function() {
                return ta;
            });
            e.d(n, "Code39VINReader", function() {
                return tl;
            });
            e.d(n, "Code93Reader", function() {
                return ri;
            });
            e.d(n, "EAN2Reader", function() {
                return tk;
            });
            e.d(n, "EAN5Reader", function() {
                return tz;
            });
            e.d(n, "EAN8Reader", function() {
                return tE;
            });
            e.d(n, "EANReader", function() {
                return X;
            });
            e.d(n, "I2of5Reader", function() {
                return tB;
            });
            e.d(n, "UPCEReader", function() {
                return t5;
            });
            e.d(n, "UPCReader", function() {
                return tb;
            });
            var a = e(19);
            var o = e.n(a);
            var i = e(16);
            var u = e.n(i);
            var s = e(152);
            var c = e(11);
            var f = {};
            var l = {
                DIR: {
                    UP: 1,
                    DOWN: -1
                }
            };
            f.getBarcodeLine = function(t, r, e) {
                var n = r.x | 0;
                var a = r.y | 0;
                var o = e.x | 0;
                var i = e.y | 0;
                var u = Math.abs(i - a) > Math.abs(o - n);
                var s;
                var c;
                var f;
                var l;
                var v = [];
                var h = t.data;
                var d = t.size.x;
                var $;
                var _ = 255;
                var p = 0;
                function x(t, r) {
                    $ = h[r * d + t];
                    _ = $ < _ ? $ : _;
                    p = $ > p ? $ : p;
                    v.push($);
                }
                if (u) {
                    f = n;
                    n = a;
                    a = f;
                    f = o;
                    o = i;
                    i = f;
                }
                if (n > o) {
                    f = n;
                    n = o;
                    o = f;
                    f = a;
                    a = i;
                    i = f;
                }
                var g = o - n;
                var y = Math.abs(i - a);
                s = (g / 2) | 0;
                c = a;
                var m = a < i ? 1 : -1;
                for(l = n; l < o; l++){
                    if (u) {
                        x(c, l);
                    } else {
                        x(l, c);
                    }
                    s -= y;
                    if (s < 0) {
                        c += m;
                        s += g;
                    }
                }
                return {
                    line: v,
                    min: _,
                    max: p
                };
            };
            f.toBinaryLine = function(t) {
                var r = t.min;
                var e = t.max;
                var n = t.line;
                var a;
                var o;
                var i = r + (e - r) / 2;
                var u = [];
                var s;
                var c;
                var f = (e - r) / 12;
                var v = -f;
                var h;
                var d;
                s = n[0] > i ? l.DIR.UP : l.DIR.DOWN;
                u.push({
                    pos: 0,
                    val: n[0]
                });
                for(h = 0; h < n.length - 2; h++){
                    a = n[h + 1] - n[h];
                    o = n[h + 2] - n[h + 1];
                    if (a + o < v && n[h + 1] < i * 1.5) {
                        c = l.DIR.DOWN;
                    } else if (a + o > f && n[h + 1] > i * 0.5) {
                        c = l.DIR.UP;
                    } else {
                        c = s;
                    }
                    if (s !== c) {
                        u.push({
                            pos: h,
                            val: n[h]
                        });
                        s = c;
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
                        f = (u[h].val + ((u[h + 1].val - u[h].val) / 3) * 2) | 0;
                    } else {
                        f = (u[h + 1].val + (u[h].val - u[h + 1].val) / 3) | 0;
                    }
                    for(d = u[h].pos; d < u[h + 1].pos; d++){
                        n[d] = n[d] > f ? 0 : 1;
                    }
                }
                return {
                    line: n,
                    threshold: f
                };
            };
            f.debug = {
                printFrequency: function t(r, e) {
                    var n;
                    var a = e.getContext("2d");
                    e.width = r.length;
                    e.height = 256;
                    a.beginPath();
                    a.strokeStyle = "blue";
                    for(n = 0; n < r.length; n++){
                        a.moveTo(n, 255);
                        a.lineTo(n, 255 - r[n]);
                    }
                    a.stroke();
                    a.closePath();
                },
                printPattern: function t(r, e) {
                    var n = e.getContext("2d");
                    var a;
                    e.width = r.length;
                    n.fillColor = "black";
                    for(a = 0; a < r.length; a++){
                        if (r[a] === 1) {
                            n.fillRect(a, 0, 1, 100);
                        }
                    }
                }
            };
            var v = f;
            var h = e(9);
            var d = e(3);
            var $ = e.n(d);
            var _ = e(4);
            var p = e.n(_);
            var x = e(1);
            var g = e.n(x);
            var y = e(6);
            var m = e.n(y);
            var w = e(5);
            var b = e.n(w);
            var C = e(2);
            var R = e.n(C);
            var E = e(0);
            var O = e.n(E);
            var S = e(10);
            var k;
            (function(t) {
                t[(t["Forward"] = 1)] = "Forward";
                t[(t["Reverse"] = -1)] = "Reverse";
            })(k || (k = {}));
            var A = (function() {
                function t(r, e) {
                    $()(this, t);
                    O()(this, "_row", []);
                    O()(this, "config", {});
                    O()(this, "supplements", []);
                    O()(this, "SINGLE_CODE_ERROR", 0);
                    O()(this, "FORMAT", "unknown");
                    O()(this, "CONFIG_KEYS", {});
                    this._row = [];
                    this.config = r || {};
                    if (e) {
                        this.supplements = e;
                    }
                    return this;
                }
                p()(t, [
                    {
                        key: "_nextUnset",
                        value: function t(r) {
                            var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
                            for(var n = e; n < r.length; n++){
                                if (!r[n]) return n;
                            }
                            return r.length;
                        }
                    },
                    {
                        key: "_matchPattern",
                        value: function t(r, e, n) {
                            var a = 0;
                            var o = 0;
                            var i = 0;
                            var u = 0;
                            var s = 0;
                            var c = 0;
                            var f = 0;
                            n = n || this.SINGLE_CODE_ERROR || 1;
                            for(var l = 0; l < r.length; l++){
                                i += r[l];
                                u += e[l];
                            }
                            if (i < u) {
                                return Number.MAX_VALUE;
                            }
                            s = i / u;
                            n *= s;
                            for(var v = 0; v < r.length; v++){
                                c = r[v];
                                f = e[v] * s;
                                o = Math.abs(c - f) / f;
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
                        value: function t(r) {
                            var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
                            for(var n = e; n < r.length; n++){
                                if (r[n]) return n;
                            }
                            return r.length;
                        }
                    },
                    {
                        key: "_correctBars",
                        value: function t(r, e, n) {
                            var a = n.length;
                            var o = 0;
                            while(a--){
                                o = r[n[a]] * (1 - (1 - e) / 2);
                                if (o > 1) {
                                    r[n[a]] = o;
                                }
                            }
                        }
                    },
                    {
                        key: "decodePattern",
                        value: function t(r) {
                            this._row = r;
                            var e = this.decode();
                            if (e === null) {
                                this._row.reverse();
                                e = this.decode();
                                if (e) {
                                    e.direction = k.Reverse;
                                    e.start = this._row.length - e.start;
                                    e.end = this._row.length - e.end;
                                }
                            } else {
                                e.direction = k.Forward;
                            }
                            if (e) {
                                e.format = this.FORMAT;
                            }
                            return e;
                        }
                    },
                    {
                        key: "_matchRange",
                        value: function t(r, e, n) {
                            var a;
                            r = r < 0 ? 0 : r;
                            for(a = r; a < e; a++){
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
                            var r = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._nextUnset(this._row);
                            var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this._row.length;
                            var n = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
                            var a = [];
                            var o = 0;
                            a[o] = 0;
                            for(var i = r; i < e; i++){
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
                        value: function t(r, e) {
                            var n = e.length;
                            var a = this._row.length;
                            var o = !this._row[r];
                            var i = 0;
                            S["a"].init(e, 0);
                            for(var u = r; u < a; u++){
                                if (this._row[u] ^ (o ? 1 : 0)) {
                                    e[i]++;
                                } else {
                                    i++;
                                    if (i === n) {
                                        break;
                                    } else {
                                        e[i] = 1;
                                        o = !o;
                                    }
                                }
                            }
                            return e;
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
            var D = A;
            function P(t) {
                var r = T();
                return function e() {
                    var n = R()(t), a;
                    if (r) {
                        var o = R()(this).constructor;
                        a = Reflect.construct(n, arguments, o);
                    } else {
                        a = n.apply(this, arguments);
                    }
                    return b()(this, a);
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
            var I = (function(t) {
                m()(e, t);
                var r = P(e);
                function e() {
                    var t;
                    $()(this, e);
                    for(var n = arguments.length, a = new Array(n), o = 0; o < n; o++){
                        a[o] = arguments[o];
                    }
                    t = r.call.apply(r, [
                        this
                    ].concat(a));
                    O()(g()(t), "CODE_SHIFT", 98);
                    O()(g()(t), "CODE_C", 99);
                    O()(g()(t), "CODE_B", 100);
                    O()(g()(t), "CODE_A", 101);
                    O()(g()(t), "START_CODE_A", 103);
                    O()(g()(t), "START_CODE_B", 104);
                    O()(g()(t), "START_CODE_C", 105);
                    O()(g()(t), "STOP_CODE", 106);
                    O()(g()(t), "CODE_PATTERN", [
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
                    O()(g()(t), "SINGLE_CODE_ERROR", 0.64);
                    O()(g()(t), "AVG_CODE_ERROR", 0.3);
                    O()(g()(t), "FORMAT", "code_128");
                    O()(g()(t), "MODULE_INDICES", {
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
                p()(e, [
                    {
                        key: "_decodeCode",
                        value: function t(r, e) {
                            var n = {
                                error: Number.MAX_VALUE,
                                code: -1,
                                start: r,
                                end: r,
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
                            var o = r;
                            var i = !this._row[o];
                            var u = 0;
                            for(var s = o; s < this._row.length; s++){
                                if (this._row[s] ^ (i ? 1 : 0)) {
                                    a[u]++;
                                } else {
                                    if (u === a.length - 1) {
                                        if (e) {
                                            this._correct(a, e);
                                        }
                                        for(var c = 0; c < this.CODE_PATTERN.length; c++){
                                            var f = this._matchPattern(a, this.CODE_PATTERN[c]);
                                            if (f < n.error) {
                                                n.code = c;
                                                n.error = f;
                                            }
                                        }
                                        n.end = s;
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
                        value: function t(r, e) {
                            this._correctBars(r, e.bar, this.MODULE_INDICES.bar);
                            this._correctBars(r, e.space, this.MODULE_INDICES.space);
                        }
                    },
                    {
                        key: "_findStart",
                        value: function t() {
                            var r = [
                                0,
                                0,
                                0,
                                0,
                                0,
                                0
                            ];
                            var e = this._nextSet(this._row);
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
                            for(var i = e; i < this._row.length; i++){
                                if (this._row[i] ^ (a ? 1 : 0)) {
                                    r[o]++;
                                } else {
                                    if (o === r.length - 1) {
                                        var u = r.reduce(function(t, r) {
                                            return t + r;
                                        }, 0);
                                        for(var s = this.START_CODE_A; s <= this.START_CODE_C; s++){
                                            var c = this._matchPattern(r, this.CODE_PATTERN[s]);
                                            if (c < n.error) {
                                                n.code = s;
                                                n.error = c;
                                            }
                                        }
                                        if (n.error < this.AVG_CODE_ERROR) {
                                            n.start = i - u;
                                            n.end = i;
                                            n.correction.bar = this.calculateCorrection(this.CODE_PATTERN[n.code], r, this.MODULE_INDICES.bar);
                                            n.correction.space = this.calculateCorrection(this.CODE_PATTERN[n.code], r, this.MODULE_INDICES.space);
                                            return n;
                                        }
                                        for(var f = 0; f < 4; f++){
                                            r[f] = r[f + 2];
                                        }
                                        r[4] = 0;
                                        r[5] = 0;
                                        o--;
                                    } else {
                                        o++;
                                    }
                                    r[o] = 1;
                                    a = !a;
                                }
                            }
                            return null;
                        }
                    },
                    {
                        key: "decode",
                        value: function t(r, e) {
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
                            var s = (function(t) {
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
                            var c = false;
                            var f = false;
                            var l = f;
                            var v = true;
                            var h = 0;
                            var d = [];
                            var $ = [];
                            while(!c){
                                l = f;
                                f = false;
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
                                    switch(s){
                                        case this.CODE_A:
                                            if (o.code < 64) {
                                                $.push(String.fromCharCode(32 + o.code));
                                            } else if (o.code < 96) {
                                                $.push(String.fromCharCode(o.code - 64));
                                            } else {
                                                if (o.code !== this.STOP_CODE) {
                                                    v = false;
                                                }
                                                switch(o.code){
                                                    case this.CODE_SHIFT:
                                                        f = true;
                                                        s = this.CODE_B;
                                                        break;
                                                    case this.CODE_B:
                                                        s = this.CODE_B;
                                                        break;
                                                    case this.CODE_C:
                                                        s = this.CODE_C;
                                                        break;
                                                    case this.STOP_CODE:
                                                        c = true;
                                                        break;
                                                }
                                            }
                                            break;
                                        case this.CODE_B:
                                            if (o.code < 96) {
                                                $.push(String.fromCharCode(32 + o.code));
                                            } else {
                                                if (o.code !== this.STOP_CODE) {
                                                    v = false;
                                                }
                                                switch(o.code){
                                                    case this.CODE_SHIFT:
                                                        f = true;
                                                        s = this.CODE_A;
                                                        break;
                                                    case this.CODE_A:
                                                        s = this.CODE_A;
                                                        break;
                                                    case this.CODE_C:
                                                        s = this.CODE_C;
                                                        break;
                                                    case this.STOP_CODE:
                                                        c = true;
                                                        break;
                                                }
                                            }
                                            break;
                                        case this.CODE_C:
                                            if (o.code < 100) {
                                                $.push(o.code < 10 ? "0" + o.code : o.code);
                                            } else {
                                                if (o.code !== this.STOP_CODE) {
                                                    v = false;
                                                }
                                                switch(o.code){
                                                    case this.CODE_A:
                                                        s = this.CODE_A;
                                                        break;
                                                    case this.CODE_B:
                                                        s = this.CODE_B;
                                                        break;
                                                    case this.STOP_CODE:
                                                        c = true;
                                                        break;
                                                }
                                            }
                                            break;
                                    }
                                } else {
                                    c = true;
                                }
                                if (l) {
                                    s = s === this.CODE_A ? this.CODE_B : this.CODE_A;
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
                            if (!$.length) {
                                return null;
                            }
                            if (v) {
                                $.splice($.length - 1, 1);
                            }
                            return {
                                code: $.join(""),
                                start: a.start,
                                end: o.end,
                                codeset: s,
                                startInfo: a,
                                decodedCodes: i,
                                endInfo: o,
                                format: this.FORMAT
                            };
                        }
                    },
                    {
                        key: "_verifyTrailingWhitespace",
                        value: function t(r) {
                            var e = this, n;
                            n = r.end + (r.end - r.start) / 2;
                            if (n < e._row.length) {
                                if (e._matchRange(r.end, n, 0)) {
                                    return r;
                                }
                            }
                            return null;
                        }
                    },
                    {
                        key: "calculateCorrection",
                        value: function t(r, e, n) {
                            var a = n.length, o = 0, i = 0;
                            while(a--){
                                i += r[n[a]];
                                o += e[n[a]];
                            }
                            return i / o;
                        }
                    }, 
                ]);
                return e;
            })(D);
            var z = I;
            function M(t, r) {
                var e = Object.keys(t);
                if (Object.getOwnPropertySymbols) {
                    var n = Object.getOwnPropertySymbols(t);
                    if (r) {
                        n = n.filter(function(r) {
                            return Object.getOwnPropertyDescriptor(t, r).enumerable;
                        });
                    }
                    e.push.apply(e, n);
                }
                return e;
            }
            function L(t) {
                for(var r = 1; r < arguments.length; r++){
                    var e = arguments[r] != null ? arguments[r] : {};
                    if (r % 2) {
                        M(Object(e), true).forEach(function(r) {
                            O()(t, r, e[r]);
                        });
                    } else if (Object.getOwnPropertyDescriptors) {
                        Object.defineProperties(t, Object.getOwnPropertyDescriptors(e));
                    } else {
                        M(Object(e)).forEach(function(r) {
                            Object.defineProperty(t, r, Object.getOwnPropertyDescriptor(e, r));
                        });
                    }
                }
                return t;
            }
            function W(t) {
                var r = U();
                return function e() {
                    var n = R()(t), a;
                    if (r) {
                        var o = R()(this).constructor;
                        a = Reflect.construct(n, arguments, o);
                    } else {
                        a = n.apply(this, arguments);
                    }
                    return b()(this, a);
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
            var N = 10;
            var j = [
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
            var B = [
                1,
                1,
                2
            ];
            var q = [
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
            var V = [
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
            var G = 0.48;
            var H = (function(t) {
                m()(e, t);
                var r = W(e);
                function e(t, n) {
                    var a;
                    $()(this, e);
                    a = r.call(this, u()({
                        supplements: []
                    }, t), n);
                    O()(g()(a), "FORMAT", "ean_13");
                    O()(g()(a), "SINGLE_CODE_ERROR", 0.7);
                    O()(g()(a), "STOP_PATTERN", [
                        1,
                        1,
                        1
                    ]);
                    return a;
                }
                p()(e, [
                    {
                        key: "_findPattern",
                        value: function t(r, e, n, a) {
                            var o = new Array(r.length).fill(0);
                            var i = {
                                error: Number.MAX_VALUE,
                                start: 0,
                                end: 0
                            };
                            var u = G;
                            var s = 0;
                            if (!e) {
                                e = this._nextSet(this._row);
                            }
                            var c = false;
                            for(var f = e; f < this._row.length; f++){
                                if (this._row[f] ^ (n ? 1 : 0)) {
                                    o[s] += 1;
                                } else {
                                    if (s === o.length - 1) {
                                        var l = this._matchPattern(o, r);
                                        if (l < u && i.error && l < i.error) {
                                            c = true;
                                            i.error = l;
                                            i.start = f - o.reduce(function(t, r) {
                                                return t + r;
                                            }, 0);
                                            i.end = f;
                                            return i;
                                        }
                                        if (a) {
                                            for(var v = 0; v < o.length - 2; v++){
                                                o[v] = o[v + 2];
                                            }
                                            o[o.length - 2] = 0;
                                            o[o.length - 1] = 0;
                                            s--;
                                        }
                                    } else {
                                        s++;
                                    }
                                    o[s] = 1;
                                    n = !n;
                                }
                            }
                            if (c) {} else {}
                            return c ? i : null;
                        }
                    },
                    {
                        key: "_decodeCode",
                        value: function t(r, e) {
                            var n = [
                                0,
                                0,
                                0,
                                0
                            ];
                            var a = r;
                            var o = {
                                error: Number.MAX_VALUE,
                                code: -1,
                                start: r,
                                end: r
                            };
                            var i = G;
                            var u = !this._row[a];
                            var s = 0;
                            if (!e) {
                                e = q.length;
                            }
                            var c = false;
                            for(var f = a; f < this._row.length; f++){
                                if (this._row[f] ^ (u ? 1 : 0)) {
                                    n[s]++;
                                } else {
                                    if (s === n.length - 1) {
                                        for(var l = 0; l < e; l++){
                                            var v = this._matchPattern(n, q[l]);
                                            o.end = f;
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
                                        s++;
                                    }
                                    n[s] = 1;
                                    u = !u;
                                }
                            }
                            return c ? o : null;
                        }
                    },
                    {
                        key: "_findStart",
                        value: function t() {
                            var r = this._nextSet(this._row);
                            var e = null;
                            while(!e){
                                e = this._findPattern(j, r, false, true);
                                if (!e) {
                                    return null;
                                }
                                var n = e.start - (e.end - e.start);
                                if (n >= 0) {
                                    if (this._matchRange(n, e.start, 0)) {
                                        return e;
                                    }
                                }
                                r = e.end;
                                e = null;
                            }
                            return null;
                        }
                    },
                    {
                        key: "_calculateFirstDigit",
                        value: function t(r) {
                            for(var e = 0; e < V.length; e++){
                                if (r === V[e]) {
                                    return e;
                                }
                            }
                            return null;
                        }
                    },
                    {
                        key: "_decodePayload",
                        value: function t(r, e, n) {
                            var a = L({}, r);
                            var o = 0x0;
                            for(var i = 0; i < 6; i++){
                                a = this._decodeCode(a.end);
                                if (!a) {
                                    return null;
                                }
                                if (a.code >= N) {
                                    a.code -= N;
                                    o |= 1 << (5 - i);
                                } else {
                                    o |= 0 << (5 - i);
                                }
                                e.push(a.code);
                                n.push(a);
                            }
                            var u = this._calculateFirstDigit(o);
                            if (u === null) {
                                return null;
                            }
                            e.unshift(u);
                            var s = this._findPattern(F, a.end, true, false);
                            if (s === null || !s.end) {
                                return null;
                            }
                            n.push(s);
                            for(var c = 0; c < 6; c++){
                                s = this._decodeCode(s.end, N);
                                if (!s) {
                                    return null;
                                }
                                n.push(s);
                                e.push(s.code);
                            }
                            return s;
                        }
                    },
                    {
                        key: "_verifyTrailingWhitespace",
                        value: function t(r) {
                            var e = r.end + (r.end - r.start);
                            if (e < this._row.length) {
                                if (this._matchRange(r.end, e, 0)) {
                                    return r;
                                }
                            }
                            return null;
                        }
                    },
                    {
                        key: "_findEnd",
                        value: function t(r, e) {
                            var n = this._findPattern(this.STOP_PATTERN, r, e, false);
                            return n !== null ? this._verifyTrailingWhitespace(n) : null;
                        }
                    },
                    {
                        key: "_checksum",
                        value: function t(r) {
                            var e = 0;
                            for(var n = r.length - 2; n >= 0; n -= 2){
                                e += r[n];
                            }
                            e *= 3;
                            for(var a = r.length - 1; a >= 0; a -= 2){
                                e += r[a];
                            }
                            return e % 10 === 0;
                        }
                    },
                    {
                        key: "_decodeExtensions",
                        value: function t(r) {
                            var e = this._nextSet(this._row, r);
                            var n = this._findPattern(B, e, false, false);
                            if (n === null) {
                                return null;
                            }
                            for(var a = 0; a < this.supplements.length; a++){
                                try {
                                    var o = this.supplements[a].decode(this._row, n.end);
                                    if (o !== null) {
                                        return {
                                            code: o.code,
                                            start: e,
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
                        value: function t(r, e) {
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
                                var s = this._decodeExtensions(u.end);
                                if (!s) {
                                    return null;
                                }
                                if (!s.decodedCodes) {
                                    return null;
                                }
                                var c = s.decodedCodes[s.decodedCodes.length - 1];
                                var f = {
                                    start: c.start + (((c.end - c.start) / 2) | 0),
                                    end: c.end
                                };
                                if (!this._verifyTrailingWhitespace(f)) {
                                    return null;
                                }
                                o = {
                                    supplement: s,
                                    code: n.join("") + s.code
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
                return e;
            })(D);
            var X = H;
            var Q = e(33);
            var Y = e.n(Q);
            function Z(t) {
                var r = K();
                return function e() {
                    var n = R()(t), a;
                    if (r) {
                        var o = R()(this).constructor;
                        a = Reflect.construct(n, arguments, o);
                    } else {
                        a = n.apply(this, arguments);
                    }
                    return b()(this, a);
                };
            }
            function K() {
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
            var J = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. *$/+%";
            var tt = new Uint16Array(Y()(J).map(function(t) {
                return t.charCodeAt(0);
            }));
            var tr = new Uint16Array([
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
            var te = 0x094;
            var tn = (function(t) {
                m()(e, t);
                var r = Z(e);
                function e() {
                    var t;
                    $()(this, e);
                    for(var n = arguments.length, a = new Array(n), o = 0; o < n; o++){
                        a[o] = arguments[o];
                    }
                    t = r.call.apply(r, [
                        this
                    ].concat(a));
                    O()(g()(t), "FORMAT", "code_39");
                    return t;
                }
                p()(e, [
                    {
                        key: "_findStart",
                        value: function t() {
                            var r = this._nextSet(this._row);
                            var e = r;
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
                            for(var i = r; i < this._row.length; i++){
                                if (this._row[i] ^ (o ? 1 : 0)) {
                                    n[a]++;
                                } else {
                                    if (a === n.length - 1) {
                                        if (this._toPattern(n) === te) {
                                            var u = Math.floor(Math.max(0, e - (i - e) / 4));
                                            if (this._matchRange(u, e, 0)) {
                                                return {
                                                    start: e,
                                                    end: i
                                                };
                                            }
                                        }
                                        e += n[0] + n[1];
                                        for(var s = 0; s < 7; s++){
                                            n[s] = n[s + 2];
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
                        value: function t(r) {
                            var e = r.length;
                            var n = 0;
                            var a = e;
                            var o = 0;
                            while(a > 3){
                                n = this._findNextWidth(r, n);
                                a = 0;
                                var i = 0;
                                for(var u = 0; u < e; u++){
                                    if (r[u] > n) {
                                        i |= 1 << (e - 1 - u);
                                        a++;
                                        o += r[u];
                                    }
                                }
                                if (a === 3) {
                                    for(var s = 0; s < e && a > 0; s++){
                                        if (r[s] > n) {
                                            a--;
                                            if (r[s] * 2 >= o) {
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
                        value: function t(r, e) {
                            var n = Number.MAX_VALUE;
                            for(var a = 0; a < r.length; a++){
                                if (r[a] < n && r[a] > e) {
                                    n = r[a];
                                }
                            }
                            return n;
                        }
                    },
                    {
                        key: "_patternToChar",
                        value: function t(r) {
                            for(var e = 0; e < tr.length; e++){
                                if (tr[e] === r) {
                                    return String.fromCharCode(tt[e]);
                                }
                            }
                            return null;
                        }
                    },
                    {
                        key: "_verifyTrailingWhitespace",
                        value: function t(r, e, n) {
                            var a = S["a"].sum(n);
                            var o = e - r - a;
                            if (o * 3 >= a) {
                                return true;
                            }
                            return false;
                        }
                    },
                    {
                        key: "decode",
                        value: function t(r, e) {
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
                            e = this._findStart();
                            if (!e) {
                                return null;
                            }
                            var o = this._nextSet(this._row, e.end);
                            var i;
                            var u;
                            do {
                                n = this._toCounters(o, n);
                                var s = this._toPattern(n);
                                if (s < 0) {
                                    return null;
                                }
                                i = this._patternToChar(s);
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
                                start: e.start,
                                end: o,
                                startInfo: e,
                                decodedCodes: a,
                                format: this.FORMAT
                            };
                        }
                    }, 
                ]);
                return e;
            })(D);
            var ta = tn;
            var to = e(13);
            var ti = e.n(to);
            function tu(t) {
                var r = ts();
                return function e() {
                    var n = R()(t), a;
                    if (r) {
                        var o = R()(this).constructor;
                        a = Reflect.construct(n, arguments, o);
                    } else {
                        a = n.apply(this, arguments);
                    }
                    return b()(this, a);
                };
            }
            function ts() {
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
            var tc = {
                IOQ: /[IOQ]/g,
                AZ09: /[A-Z0-9]{17}/
            };
            var tf = (function(t) {
                m()(e, t);
                var r = tu(e);
                function e() {
                    var t;
                    $()(this, e);
                    for(var n = arguments.length, a = new Array(n), o = 0; o < n; o++){
                        a[o] = arguments[o];
                    }
                    t = r.call.apply(r, [
                        this
                    ].concat(a));
                    O()(g()(t), "FORMAT", "code_39_vin");
                    return t;
                }
                p()(e, [
                    {
                        key: "_checkChecksum",
                        value: function t(r) {
                            return !!r;
                        }
                    },
                    {
                        key: "decode",
                        value: function t(r, n) {
                            var a = ti()(R()(e.prototype), "decode", this).call(this, r, n);
                            if (!a) {
                                return null;
                            }
                            var o = a.code;
                            if (!o) {
                                return null;
                            }
                            o = o.replace(tc.IOQ, "");
                            if (!o.match(tc.AZ09)) {
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
                return e;
            })(ta);
            var tl = tf;
            function tv(t) {
                var r = th();
                return function e() {
                    var n = R()(t), a;
                    if (r) {
                        var o = R()(this).constructor;
                        a = Reflect.construct(n, arguments, o);
                    } else {
                        a = n.apply(this, arguments);
                    }
                    return b()(this, a);
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
            var t$ = [
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
            var t_ = [
                0x01a,
                0x029,
                0x00b,
                0x00e
            ];
            var tp = 4;
            var tx = 2.0;
            var tg = 1.5;
            var ty = (function(t) {
                m()(e, t);
                var r = tv(e);
                function e() {
                    var t;
                    $()(this, e);
                    for(var n = arguments.length, a = new Array(n), o = 0; o < n; o++){
                        a[o] = arguments[o];
                    }
                    t = r.call.apply(r, [
                        this
                    ].concat(a));
                    O()(g()(t), "_counters", []);
                    O()(g()(t), "FORMAT", "codabar");
                    return t;
                }
                p()(e, [
                    {
                        key: "_computeAlternatingThreshold",
                        value: function t(r, e) {
                            var n = Number.MAX_VALUE;
                            var a = 0;
                            var o = 0;
                            for(var i = r; i < e; i += 2){
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
                        value: function t(r) {
                            var e = 7;
                            var n = r + e;
                            if (n > this._counters.length) {
                                return -1;
                            }
                            var a = this._computeAlternatingThreshold(r, n);
                            var o = this._computeAlternatingThreshold(r + 1, n);
                            var i = 1 << (e - 1);
                            var u = 0;
                            var s = 0;
                            for(var c = 0; c < e; c++){
                                u = (c & 1) === 0 ? a : o;
                                if (this._counters[r + c] > u) {
                                    s |= i;
                                }
                                i >>= 1;
                            }
                            return s;
                        }
                    },
                    {
                        key: "_isStartEnd",
                        value: function t(r) {
                            for(var e = 0; e < t_.length; e++){
                                if (t_[e] === r) {
                                    return true;
                                }
                            }
                            return false;
                        }
                    },
                    {
                        key: "_sumCounters",
                        value: function t(r, e) {
                            var n = 0;
                            for(var a = r; a < e; a++){
                                n += this._counters[a];
                            }
                            return n;
                        }
                    },
                    {
                        key: "_findStart",
                        value: function t() {
                            var r = this._nextUnset(this._row);
                            var e = r;
                            for(var n = 1; n < this._counters.length; n++){
                                var a = this._toPattern(n);
                                if (a !== -1 && this._isStartEnd(a)) {
                                    r += this._sumCounters(0, n);
                                    e = r + this._sumCounters(n, n + 8);
                                    return {
                                        start: r,
                                        end: e,
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
                        value: function t(r) {
                            for(var e = 0; e < t$.length; e++){
                                if (t$[e] === r) {
                                    return String.fromCharCode(td[e]);
                                }
                            }
                            return null;
                        }
                    },
                    {
                        key: "_calculatePatternLength",
                        value: function t(r) {
                            var e = 0;
                            for(var n = r; n < r + 7; n++){
                                e += this._counters[n];
                            }
                            return e;
                        }
                    },
                    {
                        key: "_verifyWhitespace",
                        value: function t(r, e) {
                            if (r - 1 <= 0 || this._counters[r - 1] >= this._calculatePatternLength(r) / 2.0) {
                                if (e + 8 >= this._counters.length || this._counters[e + 7] >= this._calculatePatternLength(e) / 2.0) {
                                    return true;
                                }
                            }
                            return false;
                        }
                    },
                    {
                        key: "_charToPattern",
                        value: function t(r) {
                            var e = r.charCodeAt(0);
                            for(var n = 0; n < td.length; n++){
                                if (td[n] === e) {
                                    return t$[n];
                                }
                            }
                            return 0x0;
                        }
                    },
                    {
                        key: "_thresholdResultPattern",
                        value: function t(r, e) {
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
                            var a = e;
                            var o;
                            for(var i = 0; i < r.length; i++){
                                o = this._charToPattern(r[i]);
                                for(var u = 6; u >= 0; u--){
                                    var s = (u & 1) === 2 ? n.bar : n.space;
                                    var c = (o & 1) === 1 ? s.wide : s.narrow;
                                    c.size += this._counters[a + u];
                                    c.counts++;
                                    o >>= 1;
                                }
                                a += 8;
                            }
                            [
                                "space",
                                "bar"
                            ].forEach(function(t) {
                                var r = n[t];
                                r.wide.min = Math.floor((r.narrow.size / r.narrow.counts + r.wide.size / r.wide.counts) / 2);
                                r.narrow.max = Math.ceil(r.wide.min);
                                r.wide.max = Math.ceil((r.wide.size * tx + tg) / r.wide.counts);
                            });
                            return n;
                        }
                    },
                    {
                        key: "_validateResult",
                        value: function t(r, e) {
                            var n = this._thresholdResultPattern(r, e);
                            var a = e;
                            var o;
                            for(var i = 0; i < r.length; i++){
                                o = this._charToPattern(r[i]);
                                for(var u = 6; u >= 0; u--){
                                    var s = (u & 1) === 0 ? n.bar : n.space;
                                    var c = (o & 1) === 1 ? s.wide : s.narrow;
                                    var f = this._counters[a + u];
                                    if (f < c.min || f > c.max) {
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
                        value: function t(r, e) {
                            this._counters = this._fillCounters();
                            e = this._findStart();
                            if (!e) {
                                return null;
                            }
                            var n = e.startCounter;
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
                            if (a.length - 2 < tp || !this._isStartEnd(o)) {
                                return null;
                            }
                            if (!this._verifyWhitespace(e.startCounter, n - 8)) {
                                return null;
                            }
                            if (!this._validateResult(a, e.startCounter)) {
                                return null;
                            }
                            n = n > this._counters.length ? this._counters.length : n;
                            var u = e.start + this._sumCounters(e.startCounter, n - 8);
                            return {
                                code: a.join(""),
                                start: e.start,
                                end: u,
                                startInfo: e,
                                decodedCodes: a,
                                format: this.FORMAT
                            };
                        }
                    }, 
                ]);
                return e;
            })(D);
            var t0 = ty;
            function t8(t) {
                var r = tm();
                return function e() {
                    var n = R()(t), a;
                    if (r) {
                        var o = R()(this).constructor;
                        a = Reflect.construct(n, arguments, o);
                    } else {
                        a = n.apply(this, arguments);
                    }
                    return b()(this, a);
                };
            }
            function tm() {
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
            var tw = (function(t) {
                m()(e, t);
                var r = t8(e);
                function e() {
                    var t;
                    $()(this, e);
                    for(var n = arguments.length, a = new Array(n), o = 0; o < n; o++){
                        a[o] = arguments[o];
                    }
                    t = r.call.apply(r, [
                        this
                    ].concat(a));
                    O()(g()(t), "FORMAT", "upc_a");
                    return t;
                }
                p()(e, [
                    {
                        key: "decode",
                        value: function t(r, e) {
                            var n = X.prototype.decode.call(this);
                            if (n && n.code && n.code.length === 13 && n.code.charAt(0) === "0") {
                                n.code = n.code.substring(1);
                                return n;
                            }
                            return null;
                        }
                    }, 
                ]);
                return e;
            })(X);
            var tb = tw;
            function t1(t) {
                var r = tC();
                return function e() {
                    var n = R()(t), a;
                    if (r) {
                        var o = R()(this).constructor;
                        a = Reflect.construct(n, arguments, o);
                    } else {
                        a = n.apply(this, arguments);
                    }
                    return b()(this, a);
                };
            }
            function tC() {
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
                m()(e, t);
                var r = t1(e);
                function e() {
                    var t;
                    $()(this, e);
                    for(var n = arguments.length, a = new Array(n), o = 0; o < n; o++){
                        a[o] = arguments[o];
                    }
                    t = r.call.apply(r, [
                        this
                    ].concat(a));
                    O()(g()(t), "FORMAT", "ean_8");
                    return t;
                }
                p()(e, [
                    {
                        key: "_decodePayload",
                        value: function t(r, e, n) {
                            var a = r;
                            for(var o = 0; o < 4; o++){
                                a = this._decodeCode(a.end, N);
                                if (!a) {
                                    return null;
                                }
                                e.push(a.code);
                                n.push(a);
                            }
                            a = this._findPattern(F, a.end, true, false);
                            if (a === null) {
                                return null;
                            }
                            n.push(a);
                            for(var i = 0; i < 4; i++){
                                a = this._decodeCode(a.end, N);
                                if (!a) {
                                    return null;
                                }
                                n.push(a);
                                e.push(a.code);
                            }
                            return a;
                        }
                    }, 
                ]);
                return e;
            })(X);
            var tE = tR;
            function t2(t) {
                var r = tO();
                return function e() {
                    var n = R()(t), a;
                    if (r) {
                        var o = R()(this).constructor;
                        a = Reflect.construct(n, arguments, o);
                    } else {
                        a = n.apply(this, arguments);
                    }
                    return b()(this, a);
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
            var tS = (function(t) {
                m()(e, t);
                var r = t2(e);
                function e() {
                    var t;
                    $()(this, e);
                    for(var n = arguments.length, a = new Array(n), o = 0; o < n; o++){
                        a[o] = arguments[o];
                    }
                    t = r.call.apply(r, [
                        this
                    ].concat(a));
                    O()(g()(t), "FORMAT", "ean_2");
                    return t;
                }
                p()(e, [
                    {
                        key: "decode",
                        value: function t(r, e) {
                            if (r) {
                                this._row = r;
                            }
                            var n = 0;
                            var a = e;
                            var o = this._row.length;
                            var i = [];
                            var u = [];
                            var s = null;
                            if (a === undefined) {
                                return null;
                            }
                            for(var c = 0; c < 2 && a < o; c++){
                                s = this._decodeCode(a);
                                if (!s) {
                                    return null;
                                }
                                u.push(s);
                                i.push(s.code % 10);
                                if (s.code >= N) {
                                    n |= 1 << (1 - c);
                                }
                                if (c !== 1) {
                                    a = this._nextSet(this._row, s.end);
                                    a = this._nextUnset(this._row, a);
                                }
                            }
                            if (i.length !== 2 || parseInt(i.join("")) % 4 !== n) {
                                return null;
                            }
                            var f = this._findStart();
                            return {
                                code: i.join(""),
                                decodedCodes: u,
                                end: s.end,
                                format: this.FORMAT,
                                startInfo: f,
                                start: f.start
                            };
                        }
                    }, 
                ]);
                return e;
            })(X);
            var tk = tS;
            function tA(t) {
                var r = tD();
                return function e() {
                    var n = R()(t), a;
                    if (r) {
                        var o = R()(this).constructor;
                        a = Reflect.construct(n, arguments, o);
                    } else {
                        a = n.apply(this, arguments);
                    }
                    return b()(this, a);
                };
            }
            function tD() {
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
            var tP = [
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
            function t3(t) {
                for(var r = 0; r < 10; r++){
                    if (t === tP[r]) {
                        return r;
                    }
                }
                return null;
            }
            function tT(t) {
                var r = t.length;
                var e = 0;
                for(var n = r - 2; n >= 0; n -= 2){
                    e += t[n];
                }
                e *= 3;
                for(var a = r - 1; a >= 0; a -= 2){
                    e += t[a];
                }
                e *= 3;
                return e % 10;
            }
            var tI = (function(t) {
                m()(e, t);
                var r = tA(e);
                function e() {
                    var t;
                    $()(this, e);
                    for(var n = arguments.length, a = new Array(n), o = 0; o < n; o++){
                        a[o] = arguments[o];
                    }
                    t = r.call.apply(r, [
                        this
                    ].concat(a));
                    O()(g()(t), "FORMAT", "ean_5");
                    return t;
                }
                p()(e, [
                    {
                        key: "decode",
                        value: function t(r, e) {
                            if (e === undefined) {
                                return null;
                            }
                            if (r) {
                                this._row = r;
                            }
                            var n = 0;
                            var a = e;
                            var o = this._row.length;
                            var i = null;
                            var u = [];
                            var s = [];
                            for(var c = 0; c < 5 && a < o; c++){
                                i = this._decodeCode(a);
                                if (!i) {
                                    return null;
                                }
                                s.push(i);
                                u.push(i.code % 10);
                                if (i.code >= N) {
                                    n |= 1 << (4 - c);
                                }
                                if (c !== 4) {
                                    a = this._nextSet(this._row, i.end);
                                    a = this._nextUnset(this._row, a);
                                }
                            }
                            if (u.length !== 5) {
                                return null;
                            }
                            if (tT(u) !== t3(n)) {
                                return null;
                            }
                            var f = this._findStart();
                            return {
                                code: u.join(""),
                                decodedCodes: s,
                                end: i.end,
                                format: this.FORMAT,
                                startInfo: f,
                                start: f.start
                            };
                        }
                    }, 
                ]);
                return e;
            })(X);
            var tz = tI;
            function t4(t, r) {
                var e = Object.keys(t);
                if (Object.getOwnPropertySymbols) {
                    var n = Object.getOwnPropertySymbols(t);
                    if (r) {
                        n = n.filter(function(r) {
                            return Object.getOwnPropertyDescriptor(t, r).enumerable;
                        });
                    }
                    e.push.apply(e, n);
                }
                return e;
            }
            function t6(t) {
                for(var r = 1; r < arguments.length; r++){
                    var e = arguments[r] != null ? arguments[r] : {};
                    if (r % 2) {
                        t4(Object(e), true).forEach(function(r) {
                            O()(t, r, e[r]);
                        });
                    } else if (Object.getOwnPropertyDescriptors) {
                        Object.defineProperties(t, Object.getOwnPropertyDescriptors(e));
                    } else {
                        t4(Object(e)).forEach(function(r) {
                            Object.defineProperty(t, r, Object.getOwnPropertyDescriptor(e, r));
                        });
                    }
                }
                return t;
            }
            function t7(t) {
                var r = tM();
                return function e() {
                    var n = R()(t), a;
                    if (r) {
                        var o = R()(this).constructor;
                        a = Reflect.construct(n, arguments, o);
                    } else {
                        a = n.apply(this, arguments);
                    }
                    return b()(this, a);
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
            var tL = (function(t) {
                m()(e, t);
                var r = t7(e);
                function e() {
                    var t;
                    $()(this, e);
                    for(var n = arguments.length, a = new Array(n), o = 0; o < n; o++){
                        a[o] = arguments[o];
                    }
                    t = r.call.apply(r, [
                        this
                    ].concat(a));
                    O()(g()(t), "CODE_FREQUENCY", [
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
                    O()(g()(t), "STOP_PATTERN", [
                        (1 / 6) * 7,
                        (1 / 6) * 7,
                        (1 / 6) * 7,
                        (1 / 6) * 7,
                        (1 / 6) * 7,
                        (1 / 6) * 7, 
                    ]);
                    O()(g()(t), "FORMAT", "upc_e");
                    return t;
                }
                p()(e, [
                    {
                        key: "_decodePayload",
                        value: function t(r, e, n) {
                            var a = t6({}, r);
                            var o = 0x0;
                            for(var i = 0; i < 6; i++){
                                a = this._decodeCode(a.end);
                                if (!a) {
                                    return null;
                                }
                                if (a.code >= N) {
                                    a.code = a.code - N;
                                    o |= 1 << (5 - i);
                                }
                                e.push(a.code);
                                n.push(a);
                            }
                            if (!this._determineParity(o, e)) {
                                return null;
                            }
                            return a;
                        }
                    },
                    {
                        key: "_determineParity",
                        value: function t(r, e) {
                            for(var n = 0; n < this.CODE_FREQUENCY.length; n++){
                                for(var a = 0; a < this.CODE_FREQUENCY[n].length; a++){
                                    if (r === this.CODE_FREQUENCY[n][a]) {
                                        e.unshift(n);
                                        e.push(a);
                                        return true;
                                    }
                                }
                            }
                            return false;
                        }
                    },
                    {
                        key: "_convertToUPCA",
                        value: function t(r) {
                            var e = [
                                r[0]
                            ];
                            var n = r[r.length - 2];
                            if (n <= 2) {
                                e = e.concat(r.slice(1, 3)).concat([
                                    n,
                                    0,
                                    0,
                                    0,
                                    0
                                ]).concat(r.slice(3, 6));
                            } else if (n === 3) {
                                e = e.concat(r.slice(1, 4)).concat([
                                    0,
                                    0,
                                    0,
                                    0,
                                    0
                                ]).concat(r.slice(4, 6));
                            } else if (n === 4) {
                                e = e.concat(r.slice(1, 5)).concat([
                                    0,
                                    0,
                                    0,
                                    0,
                                    0,
                                    r[5]
                                ]);
                            } else {
                                e = e.concat(r.slice(1, 6)).concat([
                                    0,
                                    0,
                                    0,
                                    0,
                                    n
                                ]);
                            }
                            e.push(r[r.length - 1]);
                            return e;
                        }
                    },
                    {
                        key: "_checksum",
                        value: function t(r) {
                            return ti()(R()(e.prototype), "_checksum", this).call(this, this._convertToUPCA(r));
                        }
                    },
                    {
                        key: "_findEnd",
                        value: function t(r, n) {
                            return ti()(R()(e.prototype), "_findEnd", this).call(this, r, true);
                        }
                    },
                    {
                        key: "_verifyTrailingWhitespace",
                        value: function t(r) {
                            var e = r.end + (r.end - r.start) / 2;
                            if (e < this._row.length) {
                                if (this._matchRange(r.end, e, 0)) {
                                    return r;
                                }
                            }
                            return null;
                        }
                    }, 
                ]);
                return e;
            })(X);
            var t5 = tL;
            function tW(t) {
                var r = tU();
                return function e() {
                    var n = R()(t), a;
                    if (r) {
                        var o = R()(this).constructor;
                        a = Reflect.construct(n, arguments, o);
                    } else {
                        a = n.apply(this, arguments);
                    }
                    return b()(this, a);
                };
            }
            function tU() {
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
            var tN = 1;
            var tj = 3;
            var tF = (function(t) {
                m()(e, t);
                var r = tW(e);
                function e(t) {
                    var n;
                    $()(this, e);
                    n = r.call(this, u()({
                        normalizeBarSpaceWidth: false
                    }, t));
                    O()(g()(n), "barSpaceRatio", [
                        1,
                        1
                    ]);
                    O()(g()(n), "SINGLE_CODE_ERROR", 0.78);
                    O()(g()(n), "AVG_CODE_ERROR", 0.38);
                    O()(g()(n), "START_PATTERN", [
                        tN,
                        tN,
                        tN,
                        tN
                    ]);
                    O()(g()(n), "STOP_PATTERN", [
                        tN,
                        tN,
                        tj
                    ]);
                    O()(g()(n), "CODE_PATTERN", [
                        [
                            tN,
                            tN,
                            tj,
                            tj,
                            tN
                        ],
                        [
                            tj,
                            tN,
                            tN,
                            tN,
                            tj
                        ],
                        [
                            tN,
                            tj,
                            tN,
                            tN,
                            tj
                        ],
                        [
                            tj,
                            tj,
                            tN,
                            tN,
                            tN
                        ],
                        [
                            tN,
                            tN,
                            tj,
                            tN,
                            tj
                        ],
                        [
                            tj,
                            tN,
                            tj,
                            tN,
                            tN
                        ],
                        [
                            tN,
                            tj,
                            tj,
                            tN,
                            tN
                        ],
                        [
                            tN,
                            tN,
                            tN,
                            tj,
                            tj
                        ],
                        [
                            tj,
                            tN,
                            tN,
                            tj,
                            tN
                        ],
                        [
                            tN,
                            tj,
                            tN,
                            tj,
                            tN
                        ], 
                    ]);
                    O()(g()(n), "MAX_CORRECTION_FACTOR", 5);
                    O()(g()(n), "FORMAT", "i2of5");
                    if (t.normalizeBarSpaceWidth) {
                        n.SINGLE_CODE_ERROR = 0.38;
                        n.AVG_CODE_ERROR = 0.09;
                    }
                    n.config = t;
                    return b()(n, g()(n));
                }
                p()(e, [
                    {
                        key: "_matchPattern",
                        value: function t(r, n) {
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
                                var s = 1 / u;
                                for(var c = 0; c < r.length; c++){
                                    a[c % 2] += r[c];
                                    o[c % 2] += n[c];
                                }
                                i[0] = o[0] / a[0];
                                i[1] = o[1] / a[1];
                                i[0] = Math.max(Math.min(i[0], u), s);
                                i[1] = Math.max(Math.min(i[1], u), s);
                                this.barSpaceRatio = i;
                                for(var f = 0; f < r.length; f++){
                                    r[f] *= this.barSpaceRatio[f % 2];
                                }
                            }
                            return ti()(R()(e.prototype), "_matchPattern", this).call(this, r, n);
                        }
                    },
                    {
                        key: "_findPattern",
                        value: function t(r, e) {
                            var n = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
                            var a = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
                            var o = new Array(r.length).fill(0);
                            var i = 0;
                            var u = {
                                error: Number.MAX_VALUE,
                                start: 0,
                                end: 0
                            };
                            var s = this.AVG_CODE_ERROR;
                            n = n || false;
                            a = a || false;
                            if (!e) {
                                e = this._nextSet(this._row);
                            }
                            for(var c = e; c < this._row.length; c++){
                                if (this._row[c] ^ (n ? 1 : 0)) {
                                    o[i]++;
                                } else {
                                    if (i === o.length - 1) {
                                        var f = o.reduce(function(t, r) {
                                            return t + r;
                                        }, 0);
                                        var l = this._matchPattern(o, r);
                                        if (l < s) {
                                            u.error = l;
                                            u.start = c - f;
                                            u.end = c;
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
                            var r = 0;
                            var e = this._nextSet(this._row);
                            var n = null;
                            var a = 1;
                            while(!n){
                                n = this._findPattern(this.START_PATTERN, e, false, true);
                                if (!n) {
                                    return null;
                                }
                                a = Math.floor((n.end - n.start) / 4);
                                r = n.start - a * 10;
                                if (r >= 0) {
                                    if (this._matchRange(r, n.start, 0)) {
                                        return n;
                                    }
                                }
                                e = n.end;
                                n = null;
                            }
                            return null;
                        }
                    },
                    {
                        key: "_verifyTrailingWhitespace",
                        value: function t(r) {
                            var e = r.end + (r.end - r.start) / 2;
                            if (e < this._row.length) {
                                if (this._matchRange(r.end, e, 0)) {
                                    return r;
                                }
                            }
                            return null;
                        }
                    },
                    {
                        key: "_findEnd",
                        value: function t() {
                            this._row.reverse();
                            var r = this._findPattern(this.STOP_PATTERN);
                            this._row.reverse();
                            if (r === null) {
                                return null;
                            }
                            var e = r.start;
                            r.start = this._row.length - r.end;
                            r.end = this._row.length - e;
                            return r !== null ? this._verifyTrailingWhitespace(r) : null;
                        }
                    },
                    {
                        key: "_decodePair",
                        value: function t(r) {
                            var e = [];
                            for(var n = 0; n < r.length; n++){
                                var a = this._decodeCode(r[n]);
                                if (!a) {
                                    return null;
                                }
                                e.push(a);
                            }
                            return e;
                        }
                    },
                    {
                        key: "_decodeCode",
                        value: function t(r) {
                            var e = this.AVG_CODE_ERROR;
                            var n = {
                                error: Number.MAX_VALUE,
                                code: -1,
                                start: 0,
                                end: 0
                            };
                            for(var a = 0; a < this.CODE_PATTERN.length; a++){
                                var o = this._matchPattern(r, this.CODE_PATTERN[a]);
                                if (o < n.error) {
                                    n.code = a;
                                    n.error = o;
                                }
                            }
                            if (n.error < e) {
                                return n;
                            }
                            return null;
                        }
                    },
                    {
                        key: "_decodePayload",
                        value: function t(r, e, n) {
                            var a = 0;
                            var o = r.length;
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
                                for(var s = 0; s < 5; s++){
                                    i[0][s] = r[a] * this.barSpaceRatio[0];
                                    i[1][s] = r[a + 1] * this.barSpaceRatio[1];
                                    a += 2;
                                }
                                u = this._decodePair(i);
                                if (!u) {
                                    return null;
                                }
                                for(var c = 0; c < u.length; c++){
                                    e.push(u[c].code + "");
                                    n.push(u[c]);
                                }
                            }
                            return u;
                        }
                    },
                    {
                        key: "_verifyCounterLength",
                        value: function t(r) {
                            return r.length % 10 === 0;
                        }
                    },
                    {
                        key: "decode",
                        value: function t(r, e) {
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
                            var s = this._decodePayload(u, n, a);
                            if (!s) {
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
                return e;
            })(D);
            var tB = tF;
            function tq(t) {
                var r = tV();
                return function e() {
                    var n = R()(t), a;
                    if (r) {
                        var o = R()(this).constructor;
                        a = Reflect.construct(n, arguments, o);
                    } else {
                        a = n.apply(this, arguments);
                    }
                    return b()(this, a);
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
            var tG = 1;
            var tH = 3;
            var tX = [
                tH,
                tG,
                tH,
                tG,
                tG,
                tG, 
            ];
            var tQ = [
                tH,
                tG,
                tG,
                tG,
                tH, 
            ];
            var tY = [
                [
                    tG,
                    tG,
                    tH,
                    tH,
                    tG, 
                ],
                [
                    tH,
                    tG,
                    tG,
                    tG,
                    tH, 
                ],
                [
                    tG,
                    tH,
                    tG,
                    tG,
                    tH, 
                ],
                [
                    tH,
                    tH,
                    tG,
                    tG,
                    tG, 
                ],
                [
                    tG,
                    tG,
                    tH,
                    tG,
                    tH, 
                ],
                [
                    tH,
                    tG,
                    tH,
                    tG,
                    tG, 
                ],
                [
                    tG,
                    tH,
                    tH,
                    tG,
                    tG, 
                ],
                [
                    tG,
                    tG,
                    tG,
                    tH,
                    tH, 
                ],
                [
                    tH,
                    tG,
                    tG,
                    tH,
                    tG, 
                ],
                [
                    tG,
                    tH,
                    tG,
                    tH,
                    tG, 
                ], 
            ];
            var tZ = tX.reduce(function(t, r) {
                return t + r;
            }, 0);
            var t9 = (function(t) {
                m()(e, t);
                var r = tq(e);
                function e() {
                    var t;
                    $()(this, e);
                    for(var n = arguments.length, a = new Array(n), o = 0; o < n; o++){
                        a[o] = arguments[o];
                    }
                    t = r.call.apply(r, [
                        this
                    ].concat(a));
                    O()(g()(t), "barSpaceRatio", [
                        1,
                        1
                    ]);
                    O()(g()(t), "FORMAT", "2of5");
                    O()(g()(t), "SINGLE_CODE_ERROR", 0.78);
                    O()(g()(t), "AVG_CODE_ERROR", 0.3);
                    return t;
                }
                p()(e, [
                    {
                        key: "_findPattern",
                        value: function t(r, e) {
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
                            var s = 0;
                            var c = 0;
                            var f = this.AVG_CODE_ERROR;
                            if (!e) {
                                e = this._nextSet(this._row);
                            }
                            for(var l = 0; l < r.length; l++){
                                o[l] = 0;
                            }
                            for(var v = e; v < this._row.length; v++){
                                if (this._row[v] ^ (n ? 1 : 0)) {
                                    o[i]++;
                                } else {
                                    if (i === o.length - 1) {
                                        s = 0;
                                        for(var h = 0; h < o.length; h++){
                                            s += o[h];
                                        }
                                        c = this._matchPattern(o, r);
                                        if (c < f) {
                                            u.error = c;
                                            u.start = v - s;
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
                            var r = null;
                            var e = this._nextSet(this._row);
                            var n = 1;
                            var a = 0;
                            while(!r){
                                r = this._findPattern(tX, e, false, true);
                                if (!r) {
                                    return null;
                                }
                                n = Math.floor((r.end - r.start) / tZ);
                                a = r.start - n * 5;
                                if (a >= 0) {
                                    if (this._matchRange(a, r.start, 0)) {
                                        return r;
                                    }
                                }
                                e = r.end;
                                r = null;
                            }
                            return r;
                        }
                    },
                    {
                        key: "_verifyTrailingWhitespace",
                        value: function t(r) {
                            var e = r.end + (r.end - r.start) / 2;
                            if (e < this._row.length) {
                                if (this._matchRange(r.end, e, 0)) {
                                    return r;
                                }
                            }
                            return null;
                        }
                    },
                    {
                        key: "_findEnd",
                        value: function t() {
                            this._row.reverse();
                            var r = this._nextSet(this._row);
                            var e = this._findPattern(tQ, r, false, true);
                            this._row.reverse();
                            if (e === null) {
                                return null;
                            }
                            var n = e.start;
                            e.start = this._row.length - e.end;
                            e.end = this._row.length - n;
                            return e !== null ? this._verifyTrailingWhitespace(e) : null;
                        }
                    },
                    {
                        key: "_verifyCounterLength",
                        value: function t(r) {
                            return r.length % 10 === 0;
                        }
                    },
                    {
                        key: "_decodeCode",
                        value: function t(r) {
                            var e = this.AVG_CODE_ERROR;
                            var n = {
                                error: Number.MAX_VALUE,
                                code: -1,
                                start: 0,
                                end: 0
                            };
                            for(var a = 0; a < tY.length; a++){
                                var o = this._matchPattern(r, tY[a]);
                                if (o < n.error) {
                                    n.code = a;
                                    n.error = o;
                                }
                            }
                            if (n.error < e) {
                                return n;
                            }
                            return null;
                        }
                    },
                    {
                        key: "_decodePayload",
                        value: function t(r, e, n) {
                            var a = 0;
                            var o = r.length;
                            var i = [
                                0,
                                0,
                                0,
                                0,
                                0
                            ];
                            var u = null;
                            while(a < o){
                                for(var s = 0; s < 5; s++){
                                    i[s] = r[a] * this.barSpaceRatio[0];
                                    a += 2;
                                }
                                u = this._decodeCode(i);
                                if (!u) {
                                    return null;
                                }
                                e.push("".concat(u.code));
                                n.push(u);
                            }
                            return u;
                        }
                    },
                    {
                        key: "decode",
                        value: function t(r, e) {
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
                            var s = this._decodePayload(o, u, i);
                            if (!s) {
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
                return e;
            })(D);
            var tK = t9;
            function tJ(t) {
                var r = rt();
                return function e() {
                    var n = R()(t), a;
                    if (r) {
                        var o = R()(this).constructor;
                        a = Reflect.construct(n, arguments, o);
                    } else {
                        a = n.apply(this, arguments);
                    }
                    return b()(this, a);
                };
            }
            function rt() {
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
            var rr = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. $/+%abcd*";
            var re = new Uint16Array(Y()(rr).map(function(t) {
                return t.charCodeAt(0);
            }));
            var rn = new Uint16Array([
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
            var ra = 0x15e;
            var ro = (function(t) {
                m()(e, t);
                var r = tJ(e);
                function e() {
                    var t;
                    $()(this, e);
                    for(var n = arguments.length, a = new Array(n), o = 0; o < n; o++){
                        a[o] = arguments[o];
                    }
                    t = r.call.apply(r, [
                        this
                    ].concat(a));
                    O()(g()(t), "FORMAT", "code_93");
                    return t;
                }
                p()(e, [
                    {
                        key: "_patternToChar",
                        value: function t(r) {
                            for(var e = 0; e < rn.length; e++){
                                if (rn[e] === r) {
                                    return String.fromCharCode(re[e]);
                                }
                            }
                            return null;
                        }
                    },
                    {
                        key: "_toPattern",
                        value: function t(r) {
                            var e = r.length;
                            var n = r.reduce(function(t, r) {
                                return t + r;
                            }, 0);
                            var a = 0;
                            for(var o = 0; o < e; o++){
                                var i = Math.round((r[o] * 9) / n);
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
                            var r = this._nextSet(this._row);
                            var e = r;
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
                            for(var i = r; i < this._row.length; i++){
                                if (this._row[i] ^ (o ? 1 : 0)) {
                                    n[a]++;
                                } else {
                                    if (a === n.length - 1) {
                                        if (this._toPattern(n) === ra) {
                                            var u = Math.floor(Math.max(0, e - (i - e) / 4));
                                            if (this._matchRange(u, e, 0)) {
                                                return {
                                                    start: e,
                                                    end: i
                                                };
                                            }
                                        }
                                        e += n[0] + n[1];
                                        for(var s = 0; s < 4; s++){
                                            n[s] = n[s + 2];
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
                        value: function t(r, e) {
                            if (r === e || !this._row[e]) {
                                return false;
                            }
                            return true;
                        }
                    },
                    {
                        key: "_decodeExtended",
                        value: function t(r) {
                            var e = r.length;
                            var n = [];
                            for(var a = 0; a < e; a++){
                                var o = r[a];
                                if (o >= "a" && o <= "d") {
                                    if (a > e - 2) {
                                        return null;
                                    }
                                    var i = r[++a];
                                    var u = i.charCodeAt(0);
                                    var s = void 0;
                                    switch(o){
                                        case "a":
                                            if (i >= "A" && i <= "Z") {
                                                s = String.fromCharCode(u - 64);
                                            } else {
                                                return null;
                                            }
                                            break;
                                        case "b":
                                            if (i >= "A" && i <= "E") {
                                                s = String.fromCharCode(u - 38);
                                            } else if (i >= "F" && i <= "J") {
                                                s = String.fromCharCode(u - 11);
                                            } else if (i >= "K" && i <= "O") {
                                                s = String.fromCharCode(u + 16);
                                            } else if (i >= "P" && i <= "S") {
                                                s = String.fromCharCode(u + 43);
                                            } else if (i >= "T" && i <= "Z") {
                                                s = String.fromCharCode(127);
                                            } else {
                                                return null;
                                            }
                                            break;
                                        case "c":
                                            if (i >= "A" && i <= "O") {
                                                s = String.fromCharCode(u - 32);
                                            } else if (i === "Z") {
                                                s = ":";
                                            } else {
                                                return null;
                                            }
                                            break;
                                        case "d":
                                            if (i >= "A" && i <= "Z") {
                                                s = String.fromCharCode(u + 32);
                                            } else {
                                                return null;
                                            }
                                            break;
                                        default:
                                            console.warn("* code_93_reader _decodeExtended hit default case, this may be an error", s);
                                            return null;
                                    }
                                    n.push(s);
                                } else {
                                    n.push(o);
                                }
                            }
                            return n;
                        }
                    },
                    {
                        key: "_matchCheckChar",
                        value: function t(r, e, n) {
                            var a = r.slice(0, e);
                            var o = a.length;
                            var i = a.reduce(function(t, r, e) {
                                var a = ((e * -1 + (o - 1)) % n) + 1;
                                var i = re.indexOf(r.charCodeAt(0));
                                return t + a * i;
                            }, 0);
                            var u = re[i % 47];
                            return (u === r[e].charCodeAt(0));
                        }
                    },
                    {
                        key: "_verifyChecksums",
                        value: function t(r) {
                            return (this._matchCheckChar(r, r.length - 2, 20) && this._matchCheckChar(r, r.length - 1, 15));
                        }
                    },
                    {
                        key: "decode",
                        value: function t(r, e) {
                            e = this._findStart();
                            if (!e) {
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
                            var o = this._nextSet(this._row, e.end);
                            var i;
                            var u;
                            do {
                                n = this._toCounters(o, n);
                                var s = this._toPattern(n);
                                if (s < 0) {
                                    return null;
                                }
                                u = this._patternToChar(s);
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
                                start: e.start,
                                end: o,
                                startInfo: e,
                                decodedCodes: a,
                                format: this.FORMAT
                            };
                        }
                    }, 
                ]);
                return e;
            })(D);
            var ri = ro;
            function ru(t) {
                var r = rs();
                return function e() {
                    var n = R()(t), a;
                    if (r) {
                        var o = R()(this).constructor;
                        a = Reflect.construct(n, arguments, o);
                    } else {
                        a = n.apply(this, arguments);
                    }
                    return b()(this, a);
                };
            }
            function rs() {
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
            var rc = {
                AEIO: /[AEIO]/g,
                AZ09: /[A-Z0-9]/
            };
            var rf = "0123456789BCDFGHJKLMNPQRSTUVWXYZ";
            var rl = (function(t) {
                m()(e, t);
                var r = ru(e);
                function e() {
                    var t;
                    $()(this, e);
                    for(var n = arguments.length, a = new Array(n), o = 0; o < n; o++){
                        a[o] = arguments[o];
                    }
                    t = r.call.apply(r, [
                        this
                    ].concat(a));
                    O()(g()(t), "FORMAT", "code_32_reader");
                    return t;
                }
                p()(e, [
                    {
                        key: "_decodeCode32",
                        value: function t(r) {
                            if (/[^0-9BCDFGHJKLMNPQRSTUVWXYZ]/.test(r)) {
                                return null;
                            }
                            var e = 0;
                            for(var n = 0; n < r.length; n++){
                                e = e * 32 + rf.indexOf(r[n]);
                            }
                            var a = "" + e;
                            if (a.length < 9) {
                                a = ("000000000" + a).slice(-9);
                            }
                            return "A" + a;
                        }
                    },
                    {
                        key: "_checkChecksum",
                        value: function t(r) {
                            return !!r;
                        }
                    },
                    {
                        key: "decode",
                        value: function t(r, n) {
                            var a = ti()(R()(e.prototype), "decode", this).call(this, r, n);
                            if (!a) {
                                return null;
                            }
                            var o = a.code;
                            if (!o) {
                                return null;
                            }
                            o = o.replace(rc.AEIO, "");
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
                return e;
            })(ta);
            var rv = rl;
            var rh = {
                code_128_reader: z,
                ean_reader: X,
                ean_5_reader: tz,
                ean_2_reader: tk,
                ean_8_reader: tE,
                code_39_reader: ta,
                code_39_vin_reader: tl,
                codabar_reader: t0,
                upc_reader: tb,
                upc_e_reader: t5,
                i2of5_reader: tB,
                "2of5_reader": tK,
                code_93_reader: ri,
                code_32_reader: rv
            };
            var rd = {
                registerReader: function t(r, e) {
                    rh[r] = e;
                },
                create: function t(r, e) {
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
                    s();
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
                        r.readers.forEach(function(t) {
                            var r;
                            var e = {};
                            var n = [];
                            if (o()(t) === "object") {
                                r = t.format;
                                e = t.config;
                            } else if (typeof t === "string") {
                                r = t;
                            }
                            if (true) {
                                console.log("Before registering reader: ", r);
                            }
                            if (e.supplements) {
                                n = e.supplements.map(function(t) {
                                    return new rh[t]();
                                });
                            }
                            try {
                                var i = new rh[r](e, n);
                                a.push(i);
                            } catch (u) {
                                console.error("* Error constructing reader ", r, u);
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
                    function s() {
                        if (true && typeof document !== "undefined") {
                            var t;
                            var e = [
                                {
                                    node: n.dom.frequency,
                                    prop: r.debug.showFrequency
                                },
                                {
                                    node: n.dom.pattern,
                                    prop: r.debug.showPattern
                                }, 
                            ];
                            for(t = 0; t < e.length; t++){
                                if (e[t].prop === true) {
                                    e[t].node.style.display = "block";
                                } else {
                                    e[t].node.style.display = "none";
                                }
                            }
                        }
                    }
                    function c(t, r, n) {
                        function a(e) {
                            var n = {
                                y: e * Math.sin(r),
                                x: e * Math.cos(r)
                            };
                            t[0].y -= n.y;
                            t[0].x -= n.x;
                            t[1].y += n.y;
                            t[1].x += n.x;
                        }
                        a(n);
                        while(n > 1 && (!e.inImageWithBorder(t[0]) || !e.inImageWithBorder(t[1]))){
                            n -= Math.ceil(n / 2);
                            a(-n);
                        }
                        return t;
                    }
                    function f(t) {
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
                        var u = v.getBarcodeLine(e, t[0], t[1]);
                        if (true && r.debug.showFrequency) {
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
                        if (true && r.debug.showPattern) {
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
                    function d(t, r, e) {
                        var n = Math.sqrt(Math.pow(t[1][0] - t[0][0], 2) + Math.pow(t[1][1] - t[0][1], 2));
                        var a;
                        var o = 16;
                        var i = null;
                        var u;
                        var s;
                        var c = Math.sin(e);
                        var f = Math.cos(e);
                        for(a = 1; a < o && i === null; a++){
                            u = (n / o) * a * (a % 2 === 0 ? -1 : 1);
                            s = {
                                y: u * c,
                                x: u * f
                            };
                            r[0].y += s.x;
                            r[0].x -= s.y;
                            r[1].y += s.x;
                            r[1].x -= s.y;
                            i = l(r);
                        }
                        return i;
                    }
                    function $(t) {
                        return Math.sqrt(Math.pow(Math.abs(t[1].y - t[0].y), 2) + Math.pow(Math.abs(t[1].x - t[0].x), 2));
                    }
                    function _(t) {
                        var r = null;
                        for(var e = 0; e < a.length && r === null; e++){
                            r = a[e].decodeImage ? a[e].decodeImage(t) : null;
                        }
                        return r;
                    }
                    function p(t) {
                        var e;
                        var a = n.ctx.overlay;
                        var o;
                        if (true) {
                            if (r.debug.drawBoundingBox && a) {
                                h["a"].drawPath(t, {
                                    x: 0,
                                    y: 1
                                }, a, {
                                    color: "blue",
                                    lineWidth: 2
                                });
                            }
                        }
                        e = f(t);
                        var i = $(e);
                        var u = Math.atan2(e[1].y - e[0].y, e[1].x - e[0].x);
                        e = c(e, u, Math.floor(i * 0.1));
                        if (e === null) {
                            return null;
                        }
                        o = l(e);
                        if (o === null) {
                            o = d(t, e, u);
                        }
                        if (o === null) {
                            return null;
                        }
                        if (true && o && r.debug.drawScanline && a) {
                            h["a"].drawPath(e, {
                                x: "x",
                                y: "y"
                            }, a, {
                                color: "red",
                                lineWidth: 3
                            });
                        }
                        return {
                            codeResult: o.codeResult,
                            line: e,
                            angle: u,
                            pattern: o.barcodeLine.line,
                            threshold: o.barcodeLine.threshold
                        };
                    }
                    return {
                        decodeFromBoundingBox: function t(r) {
                            return p(r);
                        },
                        decodeFromBoundingBoxes: function t(e) {
                            var n;
                            var a;
                            var o = [];
                            var i = r.multiple;
                            for(n = 0; n < e.length; n++){
                                var u = e[n];
                                a = p(u) || {};
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
                        decodeFromImage: function t(r) {
                            var e = _(r);
                            return e;
                        },
                        registerReader: function t(r, e) {
                            if (rh[r]) {
                                throw new Error("cannot register existing reader", r);
                            }
                            rh[r] = e;
                        },
                        setReaders: function t(e) {
                            r.readers = e;
                            a.length = 0;
                            u();
                        }
                    };
                }
            };
            var r$ = (function t() {
                var r = {};
                function e(t) {
                    if (!r[t]) {
                        r[t] = {
                            subscribers: []
                        };
                    }
                    return r[t];
                }
                function n() {
                    r = {};
                }
                function a(t, r) {
                    if (t.async) {
                        setTimeout(function() {
                            t.callback(r);
                        }, 4);
                    } else {
                        t.callback(r);
                    }
                }
                function o(t, r, n) {
                    var a;
                    if (typeof r === "function") {
                        a = {
                            callback: r,
                            async: n
                        };
                    } else {
                        a = r;
                        if (!a.callback) {
                            throw new Error("Callback was not specified on options");
                        }
                    }
                    e(t).subscribers.push(a);
                }
                return {
                    subscribe: function t(r, e, n) {
                        return o(r, e, n);
                    },
                    publish: function t(r, n) {
                        var o = e(r);
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
                    once: function t(r, e) {
                        var n = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
                        o(r, {
                            callback: e,
                            async: n,
                            once: true
                        });
                    },
                    unsubscribe: function t(r, a) {
                        if (r) {
                            var o = e(r);
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
            var r_ = e(20);
            var rp = e.n(r_);
            var rx = e(12);
            var rg = e.n(rx);
            var ry = e(85);
            var r0 = e.n(ry);
            var r8 = e(86);
            var rm = e.n(r8);
            function rw(t) {
                var r = rb();
                return function e() {
                    var n = R()(t), a;
                    if (r) {
                        var o = R()(this).constructor;
                        a = Reflect.construct(n, arguments, o);
                    } else {
                        a = n.apply(this, arguments);
                    }
                    return b()(this, a);
                };
            }
            function rb() {
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
            var r1 = (function(t) {
                m()(e, t);
                var r = rw(e);
                function e(t, n) {
                    var a;
                    $()(this, e);
                    a = r.call(this, t);
                    O()(g()(a), "code", void 0);
                    a.code = n;
                    Object.setPrototypeOf(g()(a), e.prototype);
                    return a;
                }
                return e;
            })(rm()(Error));
            var rC = "This may mean that the user has declined camera access, or the browser does not support media APIs. If you are running in iOS, you must use Safari.";
            function rR() {
                try {
                    return navigator.mediaDevices.enumerateDevices();
                } catch (t) {
                    var r = new r1("enumerateDevices is not defined. ".concat(rC), -1);
                    return Promise.reject(r);
                }
            }
            function rE(t) {
                try {
                    return navigator.mediaDevices.getUserMedia(t);
                } catch (r) {
                    var e = new r1("getUserMedia is not defined. ".concat(rC), -1);
                    return Promise.reject(e);
                }
            }
            var r2;
            function rO(t) {
                return new Promise(function(r, e) {
                    var n = 10;
                    function a() {
                        if (n > 0) {
                            if (t.videoWidth > 10 && t.videoHeight > 10) {
                                if (true) {
                                    console.log("* dev: checkVideo found ".concat(t.videoWidth, "px x ").concat(t.videoHeight, "px"));
                                }
                                r();
                            } else {
                                window.setTimeout(a, 500);
                            }
                        } else {
                            e(new r1("Unable to play video stream. Is webcam working?", -1));
                        }
                        n--;
                    }
                    a();
                });
            }
            function rS(t, r) {
                return rk.apply(this, arguments);
            }
            function rk() {
                rk = rp()(rg.a.mark(function t(r, e) {
                    var n;
                    return rg.a.wrap(function t(a) {
                        while(1){
                            switch((a.prev = a.next)){
                                case 0:
                                    a.next = 2;
                                    return rE(e);
                                case 2:
                                    n = a.sent;
                                    r2 = n;
                                    if (!r) {
                                        a.next = 11;
                                        break;
                                    }
                                    r.setAttribute("autoplay", "true");
                                    r.setAttribute("muted", "true");
                                    r.setAttribute("playsinline", "true");
                                    r.srcObject = n;
                                    r.addEventListener("loadedmetadata", function() {
                                        r.play();
                                    });
                                    return a.abrupt("return", rO(r));
                                case 11:
                                    return a.abrupt("return", Promise.resolve());
                                case 12:
                                case "end":
                                    return a.stop();
                            }
                        }
                    }, t);
                }));
                return rk.apply(this, arguments);
            }
            function rA(t) {
                var r = r0()(t, [
                    "width",
                    "height",
                    "facingMode",
                    "aspectRatio",
                    "deviceId", 
                ]);
                if (typeof t.minAspectRatio !== "undefined" && t.minAspectRatio > 0) {
                    r.aspectRatio = t.minAspectRatio;
                    console.log("WARNING: Constraint 'minAspectRatio' is deprecated; Use 'aspectRatio' instead");
                }
                if (typeof t.facing !== "undefined") {
                    r.facingMode = t.facing;
                    console.log("WARNING: Constraint 'facing' is deprecated. Use 'facingMode' instead'");
                }
                return r;
            }
            function rD() {
                var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var r = rA(t);
                if (r && r.deviceId && r.facingMode) {
                    delete r.facingMode;
                }
                return Promise.resolve({
                    audio: false,
                    video: r
                });
            }
            function rP() {
                return r3.apply(this, arguments);
            }
            function r3() {
                r3 = rp()(rg.a.mark(function t() {
                    var r;
                    return rg.a.wrap(function t(e) {
                        while(1){
                            switch((e.prev = e.next)){
                                case 0:
                                    e.next = 2;
                                    return rR();
                                case 2:
                                    r = e.sent;
                                    return e.abrupt("return", r.filter(function(t) {
                                        return (t.kind === "videoinput");
                                    }));
                                case 4:
                                case "end":
                                    return e.stop();
                            }
                        }
                    }, t);
                }));
                return r3.apply(this, arguments);
            }
            function rT() {
                if (!r2) {
                    return null;
                }
                var t = r2.getVideoTracks();
                return t && t !== null && t !== void 0 && t.length ? t[0] : null;
            }
            var rI = {
                requestedVideoElement: null,
                request: function t(r, e) {
                    return rp()(rg.a.mark(function t() {
                        var n;
                        return rg.a.wrap(function t(a) {
                            while(1){
                                switch((a.prev = a.next)){
                                    case 0:
                                        rI.requestedVideoElement = r;
                                        a.next = 3;
                                        return rD(e);
                                    case 3:
                                        n = a.sent;
                                        return a.abrupt("return", rS(r, n));
                                    case 5:
                                    case "end":
                                        return a.stop();
                                }
                            }
                        }, t);
                    }))();
                },
                release: function t() {
                    var r = r2 && r2.getVideoTracks();
                    if (rI.requestedVideoElement !== null) {
                        rI.requestedVideoElement.pause();
                    }
                    return new Promise(function(t) {
                        setTimeout(function() {
                            if (r && r.length) {
                                r[0].stop();
                            }
                            r2 = null;
                            rI.requestedVideoElement = null;
                            t();
                        }, 0);
                    });
                },
                enumerateVideoDevices: rP,
                getActiveStreamLabel: function t() {
                    var r = rT();
                    return r ? r.label : "";
                },
                getActiveTrack: rT
            };
            var rz = rI;
            function r4(t, r) {
                return (r && r.some(function(r) {
                    var e = Object.keys(r);
                    return e.every(function(e) {
                        return r[e] === t[e];
                    });
                }));
            }
            function r6(t, r) {
                return typeof r === "function" ? r(t) : true;
            }
            var r7 = {
                create: function t(r) {
                    var e;
                    var n = document.createElement("canvas");
                    var a = n.getContext("2d");
                    var o = [];
                    var i = (e = r.capacity) !== null && e !== void 0 ? e : 20;
                    var u = r.capture === true;
                    function s(t) {
                        return (!!i && t && !r4(t, r.blacklist) && r6(t, r.filter));
                    }
                    return {
                        addResult: function t(r, e, c) {
                            var f = {};
                            if (s(c)) {
                                i--;
                                f.codeResult = c;
                                if (u) {
                                    n.width = e.x;
                                    n.height = e.y;
                                    h["a"].drawImage(r, e, a);
                                    f.frame = n.toDataURL();
                                }
                                o.push(f);
                            }
                        },
                        getResults: function t() {
                            return o;
                        }
                    };
                }
            };
            var rM = {
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
            var rL = rM;
            var r5 = {
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
            var rW = r5;
            var rU = {
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
            var rN = rU;
            var rj = true ? rL : undefined;
            var rF = rj;
            var rB = e(7);
            var rq = function t() {
                $()(this, t);
                O()(this, "config", void 0);
                O()(this, "inputStream", void 0);
                O()(this, "framegrabber", void 0);
                O()(this, "inputImageWrapper", void 0);
                O()(this, "stopped", false);
                O()(this, "boxSize", void 0);
                O()(this, "resultCollector", void 0);
                O()(this, "decoder", void 0);
                O()(this, "workerPool", []);
                O()(this, "onUIThread", true);
                O()(this, "canvasContainer", new rG());
            };
            var rV = function t() {
                $()(this, t);
                O()(this, "image", void 0);
                O()(this, "overlay", void 0);
            };
            var rG = function t() {
                $()(this, t);
                O()(this, "ctx", void 0);
                O()(this, "dom", void 0);
                this.ctx = new rV();
                this.dom = new rV();
            };
            var rH = e(23);
            function rX(t, r, e) {
                var n = r || new c["a"]({
                    x: t.getWidth(),
                    y: t.getHeight(),
                    type: "XYSize"
                });
                if (true) {
                    console.log("image wrapper size ".concat(n.size));
                }
                var a = [
                    Object(rB["clone"])([
                        0,
                        0
                    ]),
                    Object(rB["clone"])([
                        0,
                        n.size.y
                    ]),
                    Object(rB["clone"])([
                        n.size.x,
                        n.size.y, 
                    ]),
                    Object(rB["clone"])([
                        n.size.x,
                        0
                    ]), 
                ];
                rH["a"].init(n, e);
                return {
                    inputImageWrapper: n,
                    boxSize: a
                };
            }
            function rQ(t) {
                if (typeof document === "undefined") {
                    return null;
                }
                if (t instanceof HTMLElement && t.nodeName && t.nodeType === 1) {
                    return t;
                }
                var r = typeof t === "string" ? t : "#interactive.viewport";
                return document.querySelector(r);
            }
            function rY(t, r) {
                var e = document.querySelector(t);
                if (!e) {
                    e = document.createElement("canvas");
                    e.className = r;
                }
                return e;
            }
            function rZ(t, r) {
                var e = rY(t, r);
                var n = e.getContext("2d");
                return {
                    canvas: e,
                    context: n
                };
            }
            function r9(t) {
                if (typeof document !== "undefined") {
                    var r = rZ("canvas.imgBuffer", "imgBuffer");
                    var e = rZ("canvas.drawingBuffer", "drawingBuffer");
                    r.canvas.width = e.canvas.width = t.x;
                    r.canvas.height = e.canvas.height = t.y;
                    return {
                        dom: {
                            image: r.canvas,
                            overlay: e.canvas
                        },
                        ctx: {
                            image: r.context,
                            overlay: e.context
                        }
                    };
                }
                return null;
            }
            function rK(t) {
                var r, e, n, a;
                var o = rQ(t === null || t === void 0 ? void 0 : (r = t.config) === null || r === void 0 ? void 0 : (e = r.inputStream) === null || e === void 0 ? void 0 : e.target);
                var i = t === null || t === void 0 ? void 0 : (n = t.config) === null || n === void 0 ? void 0 : (a = n.inputStream) === null || a === void 0 ? void 0 : a.type;
                if (!i) return null;
                var u = r9(t.inputStream.getCanvasSize());
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
                var s = u.dom;
                if (typeof document !== "undefined") {
                    if (o) {
                        if (i === "ImageStream" && !o.contains(s.image)) {
                            o.appendChild(s.image);
                        }
                        if (!o.contains(s.overlay)) {
                            o.appendChild(s.overlay);
                        }
                    }
                }
                return u;
            }
            var rJ = {
                0x0112: "orientation"
            };
            var et = Object.keys(rJ).map(function(t) {
                return rJ[t];
            });
            function er(t) {
                var r = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : et;
                if (/^blob:/i.test(t)) {
                    return ea(t).then(en).then(function(t) {
                        return eo(t, r);
                    });
                }
                return Promise.resolve(null);
            }
            function ee(t) {
                var r = t.replace(/^data:([^;]+);base64,/gim, "");
                var e = atob(r);
                var n = e.length;
                var a = new ArrayBuffer(n);
                var o = new Uint8Array(a);
                for(var i = 0; i < n; i++){
                    o[i] = e.charCodeAt(i);
                }
                return a;
            }
            function en(t) {
                return new Promise(function(r) {
                    var e = new FileReader();
                    e.onload = function(t) {
                        return r(t.target.result);
                    };
                    e.readAsArrayBuffer(t);
                });
            }
            function ea(t) {
                return new Promise(function(r, e) {
                    var n = new XMLHttpRequest();
                    n.open("GET", t, true);
                    n.responseType = "blob";
                    n.onreadystatechange = function() {
                        if (n.readyState === XMLHttpRequest.DONE && (n.status === 200 || n.status === 0)) {
                            r(this.response);
                        }
                    };
                    n.onerror = e;
                    n.send();
                });
            }
            function eo(t) {
                var r = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : et;
                var e = new DataView(t);
                var n = t.byteLength;
                var a = r.reduce(function(t, r) {
                    var e = Object.keys(rJ).filter(function(t) {
                        return rJ[t] === r;
                    })[0];
                    if (e) {
                        t[e] = r;
                    }
                    return t;
                }, {});
                var o = 2;
                var i;
                if (e.getUint8(0) !== 0xff || e.getUint8(1) !== 0xd8) {
                    return false;
                }
                while(o < n){
                    if (e.getUint8(o) !== 0xff) {
                        return false;
                    }
                    i = e.getUint8(o + 1);
                    if (i === 0xe1) {
                        return ei(e, o + 4, a);
                    }
                    o += 2 + e.getUint16(o + 2);
                }
                return false;
            }
            function ei(t, r, e) {
                if (ec(t, r, 4) !== "Exif") {
                    return false;
                }
                var n = r + 6;
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
                var i = eu(t, n, n + o, e, a);
                return i;
            }
            function eu(t, r, e, n, a) {
                var o = t.getUint16(e, !a);
                var i = {};
                for(var u = 0; u < o; u++){
                    var s = e + u * 12 + 2;
                    var c = n[t.getUint16(s, !a)];
                    if (c) {
                        i[c] = es(t, s, r, e, a);
                    }
                }
                return i;
            }
            function es(t, r, e, n, a) {
                var o = t.getUint16(r + 2, !a);
                var i = t.getUint32(r + 4, !a);
                switch(o){
                    case 3:
                        if (i === 1) {
                            return t.getUint16(r + 8, !a);
                        }
                }
                return null;
            }
            function ec(t, r, e) {
                var n = "";
                for(var a = r; a < r + e; a++){
                    n += String.fromCharCode(t.getUint8(a));
                }
                return n;
            }
            var ef = {};
            ef.load = function(t, r, e, n, a) {
                var o = new Array(n);
                var i = new Array(o.length);
                var u;
                var s;
                var c;
                if (a === false) {
                    o[0] = t;
                } else {
                    for(u = 0; u < o.length; u++){
                        c = e + u;
                        o[u] = "".concat(t, "image-").concat("00".concat(c).slice(-3), ".jpg");
                    }
                }
                i.notLoaded = [];
                i.addImage = function(t) {
                    i.notLoaded.push(t);
                };
                i.loaded = function(e) {
                    var n = i.notLoaded;
                    for(var u = 0; u < n.length; u++){
                        if (n[u] === e) {
                            n.splice(u, 1);
                            for(var s = 0; s < o.length; s++){
                                var c = o[s].substr(o[s].lastIndexOf("/"));
                                if (e.src.lastIndexOf(c) !== -1) {
                                    i[s] = {
                                        img: e
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
                            er(t, [
                                "orientation"
                            ]).then(function(t) {
                                i[0].tags = t;
                                r(i);
                            })["catch"](function(t) {
                                console.log(t);
                                r(i);
                            });
                        } else {
                            r(i);
                        }
                    }
                };
                for(u = 0; u < o.length; u++){
                    s = new Image();
                    i.addImage(s);
                    el(s, i);
                    s.src = o[u];
                }
            };
            function el(t, r) {
                t.onload = function() {
                    r.loaded(this);
                };
            }
            var ev = ef;
            var eh = {
                createVideoStream: function t(r) {
                    var e = null;
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
                    var s = {
                        x: 0,
                        y: 0,
                        type: "XYSize"
                    };
                    function c() {
                        var t, n;
                        var a = r.videoWidth;
                        var u = r.videoHeight;
                        o = (t = e) !== null && t !== void 0 && t.size ? a / u > 1 ? e.size : Math.floor((a / u) * e.size) : a;
                        i = (n = e) !== null && n !== void 0 && n.size ? a / u > 1 ? Math.floor((u / a) * e.size) : e.size : u;
                        s.x = o;
                        s.y = i;
                    }
                    var f = {
                        getRealWidth: function t() {
                            return r.videoWidth;
                        },
                        getRealHeight: function t() {
                            return r.videoHeight;
                        },
                        getWidth: function t() {
                            return o;
                        },
                        getHeight: function t() {
                            return i;
                        },
                        setWidth: function t(r) {
                            o = r;
                        },
                        setHeight: function t(r) {
                            i = r;
                        },
                        setInputStream: function t(r) {
                            e = r;
                            this.setAttribute("src", typeof r.src !== "undefined" ? r.src : "");
                        },
                        ended: function t() {
                            return r.ended;
                        },
                        getConfig: function t() {
                            return e;
                        },
                        setAttribute: function t(e, n) {
                            if (r) {
                                r.setAttribute(e, n);
                            }
                        },
                        pause: function t() {
                            r.pause();
                        },
                        play: function t() {
                            r.play();
                        },
                        setCurrentTime: function t(r) {
                            var n;
                            if (((n = e) === null || n === void 0 ? void 0 : n.type) !== "LiveStream") {
                                this.setAttribute("currentTime", r.toString());
                            }
                        },
                        addEventListener: function t(e, o, i) {
                            if (n.indexOf(e) !== -1) {
                                if (!a[e]) {
                                    a[e] = [];
                                }
                                a[e].push(o);
                            } else {
                                r.addEventListener(e, o, i);
                            }
                        },
                        clearEventHandlers: function t() {
                            n.forEach(function(t) {
                                var e = a[t];
                                if (e && e.length > 0) {
                                    e.forEach(function(e) {
                                        r.removeEventListener(t, e);
                                    });
                                }
                            });
                        },
                        trigger: function t(r, e) {
                            var n;
                            var o = a[r];
                            if (r === "canrecord") {
                                c();
                            }
                            if (o && o.length > 0) {
                                for(n = 0; n < o.length; n++){
                                    o[n].apply(f, e);
                                }
                            }
                        },
                        setTopRight: function t(r) {
                            u.x = r.x;
                            u.y = r.y;
                        },
                        getTopRight: function t() {
                            return u;
                        },
                        setCanvasSize: function t(r) {
                            s.x = r.x;
                            s.y = r.y;
                        },
                        getCanvasSize: function t() {
                            return s;
                        },
                        getFrame: function t() {
                            return r;
                        }
                    };
                    return f;
                },
                createLiveStream: function t(r) {
                    if (r) {
                        r.setAttribute("autoplay", "true");
                    }
                    var e = eh.createVideoStream(r);
                    e.ended = function t() {
                        return false;
                    };
                    return e;
                },
                createImageStream: function t() {
                    var r = null;
                    var e = 0;
                    var n = 0;
                    var a = 0;
                    var o = true;
                    var i = false;
                    var u = null;
                    var s = 0;
                    var c = 1;
                    var f = null;
                    var l = false;
                    var v;
                    var h;
                    var d = [
                        "canrecord",
                        "ended"
                    ];
                    var $ = {};
                    var _ = {
                        x: 0,
                        y: 0,
                        type: "Point"
                    };
                    var p = {
                        x: 0,
                        y: 0,
                        type: "XYSize"
                    };
                    function x() {
                        var t;
                        i = false;
                        ev.load(f, function(t) {
                            var o, s;
                            u = t;
                            if (t[0].tags && t[0].tags.orientation) {
                                switch(t[0].tags.orientation){
                                    case 6:
                                    case 8:
                                        e = t[0].img.height;
                                        n = t[0].img.width;
                                        break;
                                    default:
                                        e = t[0].img.width;
                                        n = t[0].img.height;
                                }
                            } else {
                                e = t[0].img.width;
                                n = t[0].img.height;
                            }
                            v = (o = r) !== null && o !== void 0 && o.size ? e / n > 1 ? r.size : Math.floor((e / n) * r.size) : e;
                            h = (s = r) !== null && s !== void 0 && s.size ? e / n > 1 ? Math.floor((n / e) * r.size) : r.size : n;
                            p.x = v;
                            p.y = h;
                            i = true;
                            a = 0;
                            setTimeout(function() {
                                g("canrecord", []);
                            }, 0);
                        }, c, s, (t = r) === null || t === void 0 ? void 0 : t.sequence);
                    }
                    function g(t, r) {
                        var e;
                        var n = $[t];
                        if (n && n.length > 0) {
                            for(e = 0; e < n.length; e++){
                                n[e].apply(y, r);
                            }
                        }
                    }
                    var y = {
                        trigger: g,
                        getWidth: function t() {
                            return v;
                        },
                        getHeight: function t() {
                            return h;
                        },
                        setWidth: function t(r) {
                            v = r;
                        },
                        setHeight: function t(r) {
                            h = r;
                        },
                        getRealWidth: function t() {
                            return e;
                        },
                        getRealHeight: function t() {
                            return n;
                        },
                        setInputStream: function t(e) {
                            r = e;
                            if (e.sequence === false) {
                                f = e.src;
                                s = 1;
                            } else {
                                f = e.src;
                                s = e.length;
                            }
                            x();
                        },
                        ended: function t() {
                            return l;
                        },
                        setAttribute: function t() {},
                        getConfig: function t() {
                            return r;
                        },
                        pause: function t() {
                            o = true;
                        },
                        play: function t() {
                            o = false;
                        },
                        setCurrentTime: function t(r) {
                            a = r;
                        },
                        addEventListener: function t(r, e) {
                            if (d.indexOf(r) !== -1) {
                                if (!$[r]) {
                                    $[r] = [];
                                }
                                $[r].push(e);
                            }
                        },
                        clearEventHandlers: function t() {
                            Object.keys($).forEach(function(t) {
                                return delete $[t];
                            });
                        },
                        setTopRight: function t(r) {
                            _.x = r.x;
                            _.y = r.y;
                        },
                        getTopRight: function t() {
                            return _;
                        },
                        setCanvasSize: function t(r) {
                            p.x = r.x;
                            p.y = r.y;
                        },
                        getCanvasSize: function t() {
                            return p;
                        },
                        getFrame: function t() {
                            var r;
                            if (!i) {
                                return null;
                            }
                            if (!o) {
                                var e;
                                r = (e = u) === null || e === void 0 ? void 0 : e[a];
                                if (a < s - 1) {
                                    a++;
                                } else {
                                    setTimeout(function() {
                                        l = true;
                                        g("ended", []);
                                    }, 0);
                                }
                            }
                            return r;
                        }
                    };
                    return y;
                }
            };
            var ed = eh;
            var e$ = e(8);
            var e_ = Math.PI / 180;
            function ep(t, r) {
                if (t.width !== r.x) {
                    if (true) {
                        console.log("WARNING: canvas-size needs to be adjusted");
                    }
                    t.width = r.x;
                }
                if (t.height !== r.y) {
                    if (true) {
                        console.log("WARNING: canvas-size needs to be adjusted");
                    }
                    t.height = r.y;
                }
            }
            var ex = {};
            ex.create = function(t, r) {
                var e = {};
                var n = t.getConfig();
                var a = Object(e$["h"])(t.getRealWidth(), t.getRealHeight());
                var o = t.getCanvasSize();
                var i = Object(e$["h"])(t.getWidth(), t.getHeight());
                var u = t.getTopRight();
                var s = u.x;
                var c = u.y;
                var f;
                var l = null;
                var v = null;
                f = r || document.createElement("canvas");
                f.width = o.x;
                f.height = o.y;
                l = f.getContext("2d");
                v = new Uint8Array(i.x * i.y);
                if (true) {
                    console.log("FrameGrabber", JSON.stringify({
                        size: i,
                        topRight: u,
                        videoSize: a,
                        canvasSize: o
                    }));
                }
                e.attachData = function(t) {
                    v = t;
                };
                e.getData = function() {
                    return v;
                };
                e.grab = function() {
                    var r = n.halfSample;
                    var e = t.getFrame();
                    var a = e;
                    var u = 0;
                    var h;
                    if (a) {
                        ep(f, o);
                        if (n.type === "ImageStream") {
                            a = e.img;
                            if (e.tags && e.tags.orientation) {
                                switch(e.tags.orientation){
                                    case 6:
                                        u = 90 * e_;
                                        break;
                                    case 8:
                                        u = -90 * e_;
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
                        h = l.getImageData(s, c, i.x, i.y).data;
                        if (r) {
                            Object(e$["e"])(h, i, v);
                        } else {
                            Object(e$["c"])(h, v, n);
                        }
                        return true;
                    }
                    return false;
                };
                e.getSize = function() {
                    return i;
                };
                return e;
            };
            var eg = ex;
            function ey(t, r) {
                var e = Object.keys(t);
                if (Object.getOwnPropertySymbols) {
                    var n = Object.getOwnPropertySymbols(t);
                    if (r) {
                        n = n.filter(function(r) {
                            return Object.getOwnPropertyDescriptor(t, r).enumerable;
                        });
                    }
                    e.push.apply(e, n);
                }
                return e;
            }
            function e0(t) {
                for(var r = 1; r < arguments.length; r++){
                    var e = arguments[r] != null ? arguments[r] : {};
                    if (r % 2) {
                        ey(Object(e), true).forEach(function(r) {
                            O()(t, r, e[r]);
                        });
                    } else if (Object.getOwnPropertyDescriptors) {
                        Object.defineProperties(t, Object.getOwnPropertyDescriptors(e));
                    } else {
                        ey(Object(e)).forEach(function(r) {
                            Object.defineProperty(t, r, Object.getOwnPropertyDescriptor(e, r));
                        });
                    }
                }
                return t;
            }
            var e8 = [];
            function em(t) {
                var r;
                if (e8.length) {
                    r = e8.filter(function(t) {
                        return !t.busy;
                    })[0];
                    if (r) {
                        t.attachData(r.imageData);
                        if (t.grab()) {
                            r.busy = true;
                            r.worker.postMessage({
                                cmd: "process",
                                imageData: r.imageData
                            }, [
                                r.imageData.buffer
                            ]);
                        }
                        return true;
                    } else {
                        return false;
                    }
                }
                return null;
            }
            function ew(t) {
                return e0(e0({}, t), {}, {
                    inputStream: e0(e0({}, t.inputStream), {}, {
                        target: null
                    })
                });
            }
            function eb(t) {
                if (t) {
                    var r = t()["default"];
                    if (!r) {
                        self.postMessage({
                            event: "error",
                            message: "Quagga could not be created"
                        });
                        return;
                    }
                }
                var e;
                function n(t) {
                    self.postMessage({
                        event: "processed",
                        imageData: e.data,
                        result: t
                    }, [
                        e.data.buffer
                    ]);
                }
                function a() {
                    self.postMessage({
                        event: "initialized",
                        imageData: e.data
                    }, [
                        e.data.buffer
                    ]);
                }
                self.onmessage = function(t) {
                    if (t.data.cmd === "init") {
                        var o = t.data.config;
                        o.numOfWorkers = 0;
                        e = new r.ImageWrapper({
                            x: t.data.size.x,
                            y: t.data.size.y
                        }, new Uint8Array(t.data.imageData));
                        r.init(o, a, e);
                        r.onProcessed(n);
                    } else if (t.data.cmd === "process") {
                        e.data = new Uint8Array(t.data.imageData);
                        r.start();
                    } else if (t.data.cmd === "setReaders") {
                        r.setReaders(t.data.readers);
                    } else if (t.data.cmd === "registerReader") {
                        r.registerReader(t.data.name, t.data.reader);
                    }
                };
            }
            function e1() {
                var t, r;
                if (typeof __factorySource__ !== "undefined") {
                    r = __factorySource__;
                }
                t = new Blob([
                    "(" + eb.toString() + ")(" + r + ");", 
                ], {
                    type: "text/javascript"
                });
                return window.URL.createObjectURL(t);
            }
            function eC(t, r, e) {
                var n = e1();
                var a = new Worker(n);
                var o = {
                    worker: a,
                    imageData: new Uint8Array(r.getWidth() * r.getHeight()),
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
                        e(o);
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
                        x: r.getWidth(),
                        y: r.getHeight()
                    },
                    imageData: o.imageData,
                    config: ew(t)
                }, [
                    o.imageData.buffer
                ]);
            }
            function eR(t, r, e, n) {
                var a = t - e8.length;
                if (a === 0 && n) {
                    n();
                } else if (a < 0) {
                    var o = e8.slice(a);
                    o.forEach(function(t) {
                        t.worker.terminate();
                        if (true) {
                            console.log("Worker terminated!");
                        }
                    });
                    e8 = e8.slice(0, a);
                    if (n) {
                        n();
                    }
                } else {
                    var i = function r(e) {
                        e8.push(e);
                        if (e8.length >= t && n) {
                            n();
                        }
                    };
                    if (r) {
                        for(var u = 0; u < a; u++){
                            eC(r, e, i);
                        }
                    }
                }
            }
            function eE(t) {
                e8.forEach(function(r) {
                    return r.worker.postMessage({
                        cmd: "setReaders",
                        readers: t
                    });
                });
            }
            function e2(t, r) {
                e8.forEach(function(e) {
                    return e.worker.postMessage({
                        cmd: "registerReader",
                        name: t,
                        reader: r
                    });
                });
            }
            function eO() {
                var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "LiveStream";
                var r = arguments.length > 1 ? arguments[1] : undefined;
                var e = arguments.length > 2 ? arguments[2] : undefined;
                switch(t){
                    case "VideoStream":
                        {
                            var n = document.createElement("video");
                            return {
                                video: n,
                                inputStream: e.createVideoStream(n)
                            };
                        }
                    case "ImageStream":
                        return {
                            inputStream: e.createImageStream()
                        };
                    case "LiveStream":
                        {
                            var a = null;
                            if (r) {
                                a = r.querySelector("video");
                                if (!a) {
                                    a = document.createElement("video");
                                    r.appendChild(a);
                                }
                            }
                            return {
                                video: a,
                                inputStream: e.createLiveStream(a)
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
            function eS(t, r, e) {
                var n = t.length;
                while(n--){
                    t[n][0] += r;
                    t[n][1] += e;
                }
            }
            function ek(t, r, e) {
                t[0].x += r;
                t[0].y += e;
                t[1].x += r;
                t[1].y += e;
            }
            var eA = (function() {
                function t() {
                    var r = this;
                    $()(this, t);
                    O()(this, "context", new rq());
                    O()(this, "canRecord", function(t) {
                        var e;
                        if (!r.context.config) {
                            return;
                        }
                        rH["a"].checkImageConstraints(r.context.inputStream, (e = r.context.config) === null || e === void 0 ? void 0 : e.locator);
                        r.initCanvas();
                        r.context.framegrabber = eg.create(r.context.inputStream, r.context.canvasContainer.dom.image);
                        if (r.context.config.numOfWorkers === undefined) {
                            r.context.config.numOfWorkers = 0;
                        }
                        eR(r.context.config.numOfWorkers, r.context.config, r.context.inputStream, function() {
                            var e;
                            if (((e = r.context.config) === null || e === void 0 ? void 0 : e.numOfWorkers) === 0) {
                                r.initializeData();
                            }
                            r.ready(t);
                        });
                    });
                    O()(this, "update", function() {
                        if (r.context.onUIThread) {
                            var t = em(r.context.framegrabber);
                            if (!t) {
                                var e;
                                r.context.framegrabber.attachData((e = r.context.inputImageWrapper) === null || e === void 0 ? void 0 : e.data);
                                if (r.context.framegrabber.grab()) {
                                    if (!t) {
                                        r.locateAndDecode();
                                    }
                                }
                            }
                        } else {
                            var n;
                            r.context.framegrabber.attachData((n = r.context.inputImageWrapper) === null || n === void 0 ? void 0 : n.data);
                            r.context.framegrabber.grab();
                            r.locateAndDecode();
                        }
                    });
                }
                p()(t, [
                    {
                        key: "initBuffers",
                        value: function t(r) {
                            if (!this.context.config) {
                                return;
                            }
                            var e = rX(this.context.inputStream, r, this.context.config.locator), n = e.inputImageWrapper, a = e.boxSize;
                            this.context.inputImageWrapper = n;
                            this.context.boxSize = a;
                        }
                    },
                    {
                        key: "initializeData",
                        value: function t(r) {
                            if (!this.context.config) {
                                return;
                            }
                            this.initBuffers(r);
                            this.context.decoder = rd.create(this.context.config.decoder, this.context.inputImageWrapper);
                        }
                    },
                    {
                        key: "getViewPort",
                        value: function t() {
                            if (!this.context.config || !this.context.config.inputStream) {
                                return null;
                            }
                            var r = this.context.config.inputStream.target;
                            return rQ(r);
                        }
                    },
                    {
                        key: "ready",
                        value: function t(r) {
                            this.context.inputStream.play();
                            r();
                        }
                    },
                    {
                        key: "initCanvas",
                        value: function t() {
                            var r = rK(this.context);
                            if (!r) {
                                return;
                            }
                            var e = r.ctx, n = r.dom;
                            this.context.canvasContainer.dom.image = n.image;
                            this.context.canvasContainer.dom.overlay = n.overlay;
                            this.context.canvasContainer.ctx.image = e.image;
                            this.context.canvasContainer.ctx.overlay = e.overlay;
                        }
                    },
                    {
                        key: "initInputStream",
                        value: function t(r) {
                            if (!this.context.config || !this.context.config.inputStream) {
                                return;
                            }
                            var e = this.context.config.inputStream, n = e.type, a = e.constraints;
                            var o = eO(n, this.getViewPort(), ed), i = o.video, u = o.inputStream;
                            if (n === "LiveStream" && i) {
                                rz.request(i, a).then(function() {
                                    return u.trigger("canrecord");
                                })["catch"](function(t) {
                                    return r(t);
                                });
                            }
                            u.setAttribute("preload", "auto");
                            u.setInputStream(this.context.config.inputStream);
                            u.addEventListener("canrecord", this.canRecord.bind(undefined, r));
                            this.context.inputStream = u;
                        }
                    },
                    {
                        key: "getBoundingBoxes",
                        value: function t() {
                            var r;
                            return (r = this.context.config) !== null && r !== void 0 && r.locate ? rH["a"].locate() : [
                                [
                                    Object(rB["clone"])(this.context.boxSize[0]),
                                    Object(rB["clone"])(this.context.boxSize[1]),
                                    Object(rB["clone"])(this.context.boxSize[2]),
                                    Object(rB["clone"])(this.context.boxSize[3]), 
                                ], 
                            ];
                        }
                    },
                    {
                        key: "transformResult",
                        value: function t(r) {
                            var e = this;
                            var n = this.context.inputStream.getTopRight();
                            var a = n.x;
                            var o = n.y;
                            if (a === 0 && o === 0) {
                                return;
                            }
                            if (r.barcodes) {
                                r.barcodes.forEach(function(t) {
                                    return e.transformResult(t);
                                });
                            }
                            if (r.line && r.line.length === 2) {
                                ek(r.line, a, o);
                            }
                            if (r.box) {
                                eS(r.box, a, o);
                            }
                            if (r.boxes && r.boxes.length > 0) {
                                for(var i = 0; i < r.boxes.length; i++){
                                    eS(r.boxes[i], a, o);
                                }
                            }
                        }
                    },
                    {
                        key: "addResult",
                        value: function t(r, e) {
                            var n = this;
                            if (!e || !this.context.resultCollector) {
                                return;
                            }
                            if (r.barcodes) {
                                r.barcodes.filter(function(t) {
                                    return t.codeResult;
                                }).forEach(function(t) {
                                    return n.addResult(t, e);
                                });
                            } else if (r.codeResult) {
                                this.context.resultCollector.addResult(e, this.context.inputStream.getCanvasSize(), r.codeResult);
                            }
                        }
                    },
                    {
                        key: "hasCodeResult",
                        value: function t(r) {
                            return !!(r && (r.barcodes ? r.barcodes.some(function(t) {
                                return t.codeResult;
                            }) : r.codeResult));
                        }
                    },
                    {
                        key: "publishResult",
                        value: function t() {
                            var r = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
                            var e = arguments.length > 1 ? arguments[1] : undefined;
                            var n = r;
                            if (r && this.context.onUIThread) {
                                this.transformResult(r);
                                this.addResult(r, e);
                                n = r.barcodes || r;
                            }
                            r$.publish("processed", n);
                            if (this.hasCodeResult(r)) {
                                r$.publish("detected", n);
                            }
                        }
                    },
                    {
                        key: "locateAndDecode",
                        value: function t() {
                            var r = this.getBoundingBoxes();
                            if (r) {
                                var e;
                                var n = this.context.decoder.decodeFromBoundingBoxes(r) || {};
                                n.boxes = r;
                                this.publishResult(n, (e = this.context.inputImageWrapper) === null || e === void 0 ? void 0 : e.data);
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
                            var r, e = this;
                            var n = null;
                            var a = 1000 / (((r = this.context.config) === null || r === void 0 ? void 0 : r.frequency) || 60);
                            this.context.stopped = false;
                            var o = this.context;
                            var i = function t(r) {
                                n = n || r;
                                if (!o.stopped) {
                                    if (r >= n) {
                                        n += a;
                                        e.update();
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
                            var r, e;
                            if (this.context.onUIThread && ((r = this.context.config) === null || r === void 0 ? void 0 : (e = r.inputStream) === null || e === void 0 ? void 0 : e.type) === "LiveStream") {
                                this.startContinuousUpdate();
                            } else {
                                this.update();
                            }
                        }
                    },
                    {
                        key: "stop",
                        value: (function() {
                            var t = rp()(rg.a.mark(function t() {
                                var r;
                                return rg.a.wrap(function t(e) {
                                    while(1){
                                        switch((e.prev = e.next)){
                                            case 0:
                                                this.context.stopped = true;
                                                eR(0);
                                                if (!((r = this.context.config) !== null && r !== void 0 && r.inputStream && this.context.config.inputStream.type === "LiveStream")) {
                                                    e.next = 6;
                                                    break;
                                                }
                                                e.next = 5;
                                                return rz.release();
                                            case 5:
                                                this.context.inputStream.clearEventHandlers();
                                            case 6:
                                            case "end":
                                                return e.stop();
                                        }
                                    }
                                }, t, this);
                            }));
                            function r() {
                                return t.apply(this, arguments);
                            }
                            return r;
                        })()
                    },
                    {
                        key: "setReaders",
                        value: function t(r) {
                            if (this.context.decoder) {
                                this.context.decoder.setReaders(r);
                            }
                            eE(r);
                        }
                    },
                    {
                        key: "registerReader",
                        value: function t(r, e) {
                            rd.registerReader(r, e);
                            if (this.context.decoder) {
                                this.context.decoder.registerReader(r, e);
                            }
                            e2(r, e);
                        }
                    }, 
                ]);
                return t;
            })();
            var eD = new eA();
            var eP = eD.context;
            var e3 = {
                init: function t(r, e, n) {
                    var a = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : eD;
                    var o;
                    if (!e) {
                        o = new Promise(function(t, r) {
                            e = function e(n) {
                                n ? r(n) : t();
                            };
                        });
                    }
                    a.context.config = u()({}, rF, r);
                    if (a.context.config.numOfWorkers > 0) {
                        a.context.config.numOfWorkers = 0;
                    }
                    if (n) {
                        a.context.onUIThread = false;
                        a.initializeData(n);
                        if (e) {
                            e();
                        }
                    } else {
                        a.initInputStream(e);
                    }
                    return o;
                },
                start: function t() {
                    return eD.start();
                },
                stop: function t() {
                    return eD.stop();
                },
                pause: function t() {
                    eP.stopped = true;
                },
                onDetected: function t(r) {
                    if (!r || (typeof r !== "function" && (o()(r) !== "object" || !r.callback))) {
                        console.trace("* warning: Quagga.onDetected called with invalid callback, ignoring");
                        return;
                    }
                    r$.subscribe("detected", r);
                },
                offDetected: function t(r) {
                    r$.unsubscribe("detected", r);
                },
                onProcessed: function t(r) {
                    if (!r || (typeof r !== "function" && (o()(r) !== "object" || !r.callback))) {
                        console.trace("* warning: Quagga.onProcessed called with invalid callback, ignoring");
                        return;
                    }
                    r$.subscribe("processed", r);
                },
                offProcessed: function t(r) {
                    r$.unsubscribe("processed", r);
                },
                setReaders: function t(r) {
                    if (!r) {
                        console.trace("* warning: Quagga.setReaders called with no readers, ignoring");
                        return;
                    }
                    eD.setReaders(r);
                },
                registerReader: function t(r, e) {
                    if (!r) {
                        console.trace("* warning: Quagga.registerReader called with no name, ignoring");
                        return;
                    }
                    if (!e) {
                        console.trace("* warning: Quagga.registerReader called with no reader, ignoring");
                        return;
                    }
                    eD.registerReader(r, e);
                },
                registerResultCollector: function t(r) {
                    if (r && typeof r.addResult === "function") {
                        eP.resultCollector = r;
                    }
                },
                get canvas () {
                    return eP.canvasContainer;
                },
                decodeSingle: function t(r, e) {
                    var n = this;
                    var a = new eA();
                    r = u()({
                        inputStream: {
                            type: "ImageStream",
                            sequence: false,
                            size: 800,
                            src: r.src
                        },
                        numOfWorkers: true && r.debug ? 0 : 1,
                        locator: {
                            halfSample: false
                        }
                    }, r);
                    if (r.numOfWorkers > 0) {
                        r.numOfWorkers = 0;
                    }
                    if (r.numOfWorkers > 0 && (typeof Blob === "undefined" || typeof Worker === "undefined")) {
                        console.warn("* no Worker and/or Blob support - forcing numOfWorkers to 0");
                        r.numOfWorkers = 0;
                    }
                    return new Promise(function(t, o) {
                        try {
                            n.init(r, function() {
                                r$.once("processed", function(r) {
                                    a.stop();
                                    if (e) {
                                        e.call(null, r);
                                    }
                                    t(r);
                                }, true);
                                a.start();
                            }, null, a);
                        } catch (i) {
                            o(i);
                        }
                    });
                },
                get default () {
                    return e3;
                },
                Readers: n,
                CameraAccess: rz,
                ImageDebug: h["a"],
                ImageWrapper: c["a"],
                ResultCollector: r7
            };
            var eT = (r["default"] = e3);
        }
    ])["default"];
});
