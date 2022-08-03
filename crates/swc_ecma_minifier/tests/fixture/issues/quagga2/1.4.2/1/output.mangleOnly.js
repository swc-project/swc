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
            function i(t, r) {
                if (r && (n(r) === "object" || typeof r === "function")) {
                    return r;
                } else if (r !== void 0) {
                    throw new TypeError("Derived constructors may only return object or undefined");
                }
                return a(t);
            }
            t.exports = i;
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
                return c;
            });
            e.d(r, "i", function() {
                return d;
            });
            e.d(r, "b", function() {
                return g;
            });
            e.d(r, "j", function() {
                return S;
            });
            e.d(r, "e", function() {
                return P;
            });
            e.d(r, "c", function() {
                return z;
            });
            e.d(r, "f", function() {
                return I;
            });
            e.d(r, "g", function() {
                return T;
            });
            e.d(r, "a", function() {
                return W;
            });
            e.d(r, "d", function() {
                return N;
            });
            var n = e(7);
            var a = e(84);
            var i = {
                clone: n["clone"],
                dot: n["dot"]
            };
            var o = {
                create: function t(r, e) {
                    var n = [];
                    var a = {
                        rad: 0,
                        vec: i.clone([
                            0,
                            0
                        ])
                    };
                    var o = {};
                    function u(t) {
                        o[t.id] = t;
                        n.push(t);
                    }
                    function s() {
                        var t;
                        var r = 0;
                        for(t = 0; t < n.length; t++){
                            r += n[t].rad;
                        }
                        a.rad = r / n.length;
                        a.vec = i.clone([
                            Math.cos(a.rad),
                            Math.sin(a.rad), 
                        ]);
                    }
                    function f() {
                        u(r);
                        s();
                    }
                    f();
                    return {
                        add: function t(r) {
                            if (!o[r.id]) {
                                u(r);
                                s();
                            }
                        },
                        fits: function t(r) {
                            var n = Math.abs(i.dot(r.point.vec, a.vec));
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
            var f = {
                clone: a["clone"]
            };
            function c(t, r) {
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
                return e;
            }
            function l(t, r) {
                var e = t.data;
                var n = t.size.x;
                var a = t.size.y;
                var i = r.data;
                var o = 0;
                var u = 0;
                var s = 0;
                var f = 0;
                var c = 0;
                var l;
                var v;
                s = n;
                o = 0;
                for(v = 1; v < a; v++){
                    o += e[u];
                    i[s] += o;
                    u += n;
                    s += n;
                }
                u = 0;
                s = 1;
                o = 0;
                for(l = 1; l < n; l++){
                    o += e[u];
                    i[s] += o;
                    u++;
                    s++;
                }
                for(v = 1; v < a; v++){
                    u = v * n + 1;
                    s = (v - 1) * n + 1;
                    f = v * n;
                    c = (v - 1) * n;
                    for(l = 1; l < n; l++){
                        i[u] += e[u] + i[s] + i[f] - i[c];
                        u++;
                        s++;
                        f++;
                        c++;
                    }
                }
            }
            function v(t, r) {
                var e = t.data;
                var n = t.size.x;
                var a = t.size.y;
                var i = r.data;
                var o = 0;
                for(var u = 0; u < n; u++){
                    o += e[u];
                    i[u] = o;
                }
                for(var s = 1; s < a; s++){
                    o = 0;
                    for(var f = 0; f < n; f++){
                        o += e[s * n + f];
                        i[s * n + f] = o + i[(s - 1) * n + f];
                    }
                }
            }
            function $(t, r, e) {
                if (!e) {
                    e = t;
                }
                var n = t.data;
                var a = n.length;
                var i = e.data;
                while(a--){
                    i[a] = n[a] < r ? 1 : 0;
                }
            }
            function h(t, r) {
                if (!r) {
                    r = 8;
                }
                var e = t.data;
                var n = e.length;
                var a = 8 - r;
                var i = 1 << r;
                var o = new Int32Array(i);
                while(n--){
                    o[e[n] >> a]++;
                }
                return o;
            }
            function _(t) {
                var r;
                var e = t.length;
                var n = t[0];
                var a = t[1];
                var i;
                for(r = 1; r < e - 1; r++){
                    i = t[r + 1];
                    t[r - 1] = (a * 2 - n - i) & 255;
                    n = a;
                    a = i;
                }
                return t;
            }
            function p(t) {
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
                function i(t, r) {
                    var n = 0;
                    for(var a = t; a <= r; a++){
                        n += a * e[a];
                    }
                    return n;
                }
                function o() {
                    var n = [
                        0
                    ];
                    var o;
                    var s;
                    var f;
                    var c;
                    var l;
                    var v;
                    var $ = (1 << r) - 1;
                    e = h(t, r);
                    for(var _ = 1; _ < $; _++){
                        o = a(0, _);
                        s = a(_ + 1, $);
                        f = o * s;
                        if (f === 0) {
                            f = 1;
                        }
                        c = i(0, _) * s;
                        l = i(_ + 1, $) * o;
                        v = c - l;
                        n[_] = (v * v) / f;
                    }
                    return u["a"].maxIndex(n);
                }
                var s = o();
                return s << n;
            }
            function d(t, r) {
                var e = p(t);
                $(t, e, r);
                return e;
            }
            function x(t, r, e) {
                v(t, r);
                if (!e) {
                    e = t;
                }
                var n = t.data;
                var a = e.data;
                var i = t.size.x;
                var o = t.size.y;
                var u = r.data;
                var s = 0;
                var f;
                var c;
                var l = 3;
                var $;
                var h;
                var _;
                var p;
                var d;
                var x = (l * 2 + 1) * (l * 2 + 1);
                for(f = 0; f <= l; f++){
                    for(c = 0; c < i; c++){
                        a[f * i + c] = 0;
                        a[(o - 1 - f) * i + c] = 0;
                    }
                }
                for(f = l; f < o - l; f++){
                    for(c = 0; c <= l; c++){
                        a[f * i + c] = 0;
                        a[f * i + (i - 1 - c)] = 0;
                    }
                }
                for(f = l + 1; f < o - l - 1; f++){
                    for(c = l + 1; c < i - l; c++){
                        $ = u[(f - l - 1) * i + (c - l - 1)];
                        h = u[(f - l - 1) * i + (c + l)];
                        _ = u[(f + l) * i + (c - l - 1)];
                        p = u[(f + l) * i + (c + l)];
                        s = p - _ - h + $;
                        d = s / x;
                        a[f * i + c] = n[f * i + c] > d + 5 ? 0 : 1;
                    }
                }
            }
            function g(t, r, e) {
                var n;
                var a;
                var i;
                var u;
                var s = [];
                if (!e) {
                    e = "rad";
                }
                function f(t) {
                    var r = false;
                    for(a = 0; a < s.length; a++){
                        i = s[a];
                        if (i.fits(t)) {
                            i.add(t);
                            r = true;
                        }
                    }
                    return r;
                }
                for(n = 0; n < t.length; n++){
                    u = o.createPoint(t[n], n, e);
                    if (!f(u)) {
                        s.push(o.create(u, r));
                    }
                }
                return s;
            }
            var y = {
                trace: function t(r, e) {
                    var n;
                    var a = 10;
                    var i = [];
                    var o = [];
                    var u = 0;
                    var s = 0;
                    function t(t, n) {
                        var a;
                        var i;
                        var o;
                        var u = 1;
                        var s = Math.abs(e[1] / 10);
                        var f = false;
                        function c(t, r) {
                            if (t.x > r.x - u && t.x < r.x + u && t.y > r.y - s && t.y < r.y + s) {
                                return true;
                            }
                            return false;
                        }
                        var l = r[t];
                        if (n) {
                            o = {
                                x: l.x + e[0],
                                y: l.y + e[1]
                            };
                        } else {
                            o = {
                                x: l.x - e[0],
                                y: l.y - e[1]
                            };
                        }
                        i = n ? t + 1 : t - 1;
                        a = r[i];
                        while(a && (f = c(a, o)) !== true && Math.abs(a.y - l.y) < e[1]){
                            i = n ? i + 1 : i - 1;
                            a = r[i];
                        }
                        return f ? i : null;
                    }
                    for(n = 0; n < a; n++){
                        u = Math.floor(Math.random() * r.length);
                        i = [];
                        s = u;
                        i.push(r[s]);
                        while((s = t(s, true)) !== null){
                            i.push(r[s]);
                        }
                        if (u > 0) {
                            s = u;
                            while((s = t(s, false)) !== null){
                                i.push(r[s]);
                            }
                        }
                        if (i.length > o.length) {
                            o = i;
                        }
                    }
                    return o;
                }
            };
            var m = 1;
            var w = 2;
            function b(t, r) {
                var e;
                var n;
                var a = t.data;
                var i = r.data;
                var o = t.size.y;
                var u = t.size.x;
                var s;
                var f;
                var c;
                var l;
                var v;
                for(e = 1; e < o - 1; e++){
                    for(n = 1; n < u - 1; n++){
                        f = e - 1;
                        c = e + 1;
                        l = n - 1;
                        v = n + 1;
                        s = a[f * u + l] + a[f * u + v] + a[e * u + n] + a[c * u + l] + a[c * u + v];
                        i[e * u + n] = s > 0 ? 1 : 0;
                    }
                }
            }
            function C(t, r) {
                var e;
                var n;
                var a = t.data;
                var i = r.data;
                var o = t.size.y;
                var u = t.size.x;
                var s;
                var f;
                var c;
                var l;
                var v;
                for(e = 1; e < o - 1; e++){
                    for(n = 1; n < u - 1; n++){
                        f = e - 1;
                        c = e + 1;
                        l = n - 1;
                        v = n + 1;
                        s = a[f * u + l] + a[f * u + v] + a[e * u + n] + a[c * u + l] + a[c * u + v];
                        i[e * u + n] = s === 5 ? 1 : 0;
                    }
                }
            }
            function k(t, r, e) {
                if (!e) {
                    e = t;
                }
                var n = t.data.length;
                var a = t.data;
                var i = r.data;
                var o = e.data;
                while(n--){
                    o[n] = a[n] - i[n];
                }
            }
            function E(t, r, e) {
                if (!e) {
                    e = t;
                }
                var n = t.data.length;
                var a = t.data;
                var i = r.data;
                var o = e.data;
                while(n--){
                    o[n] = a[n] || i[n];
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
                var i = 0;
                var o = [];
                var u;
                var s;
                var f;
                for(n = 0; n < r; n++){
                    o[n] = {
                        score: 0,
                        item: null
                    };
                }
                for(n = 0; n < t.length; n++){
                    u = e.apply(this, [
                        t[n]
                    ]);
                    if (u > i) {
                        s = o[a];
                        s.score = u;
                        s.item = t[n];
                        i = Number.MAX_VALUE;
                        for(f = 0; f < r; f++){
                            if (o[f].score < i) {
                                i = o[f].score;
                                a = f;
                            }
                        }
                    }
                }
                return o;
            }
            function R(t, r, e, n) {
                e.drawImage(t, r, 0, t.width, t.height);
                var a = e.getImageData(r, 0, t.width, t.height).data;
                z(a, n);
            }
            function D(t, r, e, n) {
                var a = t.getImageData(e.x, e.y, r.x, r.y).data;
                z(a, n);
            }
            function P(t, r, e) {
                var n = 0;
                var a = r.x;
                var i = Math.floor(t.length / 4);
                var o = r.x / 2;
                var u = 0;
                var s = r.x;
                var f;
                while(a < i){
                    for(f = 0; f < o; f++){
                        e[u] = (0.299 * t[n * 4 + 0] + 0.587 * t[n * 4 + 1] + 0.114 * t[n * 4 + 2] + (0.299 * t[(n + 1) * 4 + 0] + 0.587 * t[(n + 1) * 4 + 1] + 0.114 * t[(n + 1) * 4 + 2]) + (0.299 * t[a * 4 + 0] + 0.587 * t[a * 4 + 1] + 0.114 * t[a * 4 + 2]) + (0.299 * t[(a + 1) * 4 + 0] + 0.587 * t[(a + 1) * 4 + 1] + 0.114 * t[(a + 1) * 4 + 2])) / 4;
                        u++;
                        n += 2;
                        a += 2;
                    }
                    n += s;
                    a += s;
                }
            }
            function z(t, r, e) {
                var n = (t.length / 4) | 0;
                var a = e && e.singleChannel === true;
                if (a) {
                    for(var i = 0; i < n; i++){
                        r[i] = t[i * 4 + 0];
                    }
                } else {
                    for(var o = 0; o < n; o++){
                        r[o] = 0.299 * t[o * 4 + 0] + 0.587 * t[o * 4 + 1] + 0.114 * t[o * 4 + 2];
                    }
                }
            }
            function A(t, r) {
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
                    z(a, r);
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
                var i = 0;
                var o = n;
                var u = e.length;
                var s = n / 2;
                var f = 0;
                while(o < u){
                    for(var c = 0; c < s; c++){
                        a[f] = Math.floor((e[i] + e[i + 1] + e[o] + e[o + 1]) / 4);
                        f++;
                        i += 2;
                        o += 2;
                    }
                    i += n;
                    o += n;
                }
            }
            function T(t) {
                var r = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [
                    0,
                    0,
                    0
                ];
                var e = t[0];
                var n = t[1];
                var a = t[2];
                var i = a * n;
                var o = i * (1 - Math.abs(((e / 60) % 2) - 1));
                var u = a - i;
                var s = 0;
                var f = 0;
                var c = 0;
                if (e < 60) {
                    s = i;
                    f = o;
                } else if (e < 120) {
                    s = o;
                    f = i;
                } else if (e < 180) {
                    f = i;
                    c = o;
                } else if (e < 240) {
                    f = o;
                    c = i;
                } else if (e < 300) {
                    s = o;
                    c = i;
                } else if (e < 360) {
                    s = i;
                    c = o;
                }
                r[0] = ((s + u) * 255) | 0;
                r[1] = ((f + u) * 255) | 0;
                r[2] = ((c + u) * 255) | 0;
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
                var i = L(e, n);
                var o = [
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
                var f = o[s];
                var c = Math.floor(a / f);
                var l;
                function v(t) {
                    var r = 0;
                    var e = t[Math.floor(t.length / 2)];
                    while(r < t.length - 1 && t[r] < c){
                        r++;
                    }
                    if (r > 0) {
                        if (Math.abs(t[r] - c) > Math.abs(t[r - 1] - c)) {
                            e = t[r - 1];
                        } else {
                            e = t[r];
                        }
                    }
                    if (c / e < o[s + 1] / o[s] && c / e > o[s - 1] / o[s]) {
                        return {
                            x: e,
                            y: e
                        };
                    }
                    return null;
                }
                l = v(i);
                if (!l) {
                    l = v(M(a));
                    if (!l) {
                        l = v(M(c * f));
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
            var q = {
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
            function N(t, r, e) {
                var n = {
                    width: t,
                    height: r
                };
                var a = Object.keys(e).reduce(function(t, r) {
                    var a = e[r];
                    var i = U(a);
                    var o = q[r](i, n);
                    t[r] = o;
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
                    for(var i = 1; i < r.length; i++){
                        n.lineTo(r[i][e.x], r[i][e.y]);
                    }
                    n.closePath();
                    n.stroke();
                },
                drawImage: function t(r, e, n) {
                    var a = n.getImageData(0, 0, e.x, e.y);
                    var i = a.data;
                    var o = i.length;
                    var u = r.length;
                    if (o / u !== 4) {
                        return false;
                    }
                    while(u--){
                        var s = r[u];
                        i[--o] = 255;
                        i[--o] = s;
                        i[--o] = s;
                        i[--o] = s;
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
            var i = e(3);
            var o = e.n(i);
            var u = e(4);
            var s = e.n(u);
            var f = e(0);
            var c = e.n(f);
            var l = e(7);
            var v = e.n(l);
            var $ = e(8);
            var h = e(10);
            var _ = {
                clone: l["clone"]
            };
            function p(t) {
                if (t < 0) {
                    throw new Error("expected positive number, received ".concat(t));
                }
            }
            var d = (function() {
                function t(r, e) {
                    var n = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Uint8Array;
                    var a = arguments.length > 3 ? arguments[3] : undefined;
                    o()(this, t);
                    c()(this, "data", void 0);
                    c()(this, "size", void 0);
                    c()(this, "indexMapping", void 0);
                    if (!e) {
                        this.data = new n(r.x * r.y);
                        if (a) {
                            h["a"].init(this.data, 0);
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
                            p(e);
                            return (r.x >= 0 && r.y >= 0 && r.x < this.size.x + e * 2 && r.y < this.size.y + e * 2);
                        }
                    },
                    {
                        key: "subImageAsCopy",
                        value: function t(r, e) {
                            p(e.x);
                            p(e.y);
                            var n = r.size, a = n.x, i = n.y;
                            for(var o = 0; o < a; o++){
                                for(var u = 0; u < i; u++){
                                    r.data[u * a + o] = this.data[(e.y + u) * this.size.x + e.x + o];
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
                            for(var i = 1; i < n - 1; i++){
                                this.data[i * e] = this.data[i * e + (e - 1)] = 0;
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
                            var i = this.size.y;
                            var o = this.size.x;
                            var u;
                            var s;
                            var f = [];
                            var c;
                            var l;
                            var v;
                            var $;
                            var h;
                            var p;
                            var d;
                            var x;
                            var g = [];
                            var y = Math.PI;
                            var m = y / 4;
                            if (r <= 0) {
                                return g;
                            }
                            for(c = 0; c < r; c++){
                                f[c] = {
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
                            for(a = 0; a < i; a++){
                                s = a * a;
                                for(n = 0; n < o; n++){
                                    u = e[a * o + n];
                                    if (u > 0) {
                                        l = f[u - 1];
                                        l.m00 += 1;
                                        l.m01 += a;
                                        l.m10 += n;
                                        l.m11 += n * a;
                                        l.m02 += s;
                                        l.m20 += n * n;
                                    }
                                }
                            }
                            for(c = 0; c < r; c++){
                                l = f[c];
                                if (!isNaN(l.m00) && l.m00 !== 0) {
                                    p = l.m10 / l.m00;
                                    d = l.m01 / l.m00;
                                    v = l.m11 / l.m00 - p * d;
                                    $ = l.m02 / l.m00 - d * d;
                                    h = l.m20 / l.m00 - p * p;
                                    x = ($ - h) / (2 * v);
                                    x = 0.5 * Math.atan(x) + (v >= 0 ? m : -m) + y;
                                    l.theta = (((x * 180) / y + 90) % 180) - 90;
                                    if (l.theta < 0) {
                                        l.theta += 180;
                                    }
                                    l.rad = x > y ? x - y : x;
                                    l.vec = _.clone([
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
                                    var i = n * this.size.x + a;
                                    var o = this.get(a, n) * r;
                                    e[i * 4 + 0] = o;
                                    e[i * 4 + 1] = o;
                                    e[i * 4 + 2] = o;
                                    e[i * 4 + 3] = 255;
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
                            var i = this.getAsRGBA(e);
                            r.width = this.size.x;
                            r.height = this.size.y;
                            var o = new ImageData(i, a.width, a.height);
                            n.putImageData(o, 0, 0);
                        }
                    },
                    {
                        key: "overlay",
                        value: function t(r, e, n) {
                            var i = e < 0 || e > 360 ? 360 : e;
                            var o = [
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
                            var f = [
                                0,
                                0,
                                0
                            ];
                            var c = [];
                            var l = r.getContext("2d");
                            if (!l) {
                                throw new Error("Unable to get canvas context");
                            }
                            var v = l.getImageData(n.x, n.y, this.size.x, this.size.y);
                            var h = v.data;
                            var _ = this.data.length;
                            while(_--){
                                o[0] = this.data[_] * i;
                                c = o[0] <= 0 ? s : o[0] >= 360 ? f : Object($["g"])(o, u);
                                var p = _ * 4;
                                var d = c;
                                var x = a()(d, 3);
                                h[p] = x[0];
                                h[p + 1] = x[1];
                                h[p + 2] = x[2];
                                h[p + 3] = 255;
                            }
                            l.putImageData(v, n.x, n.y);
                        }
                    }, 
                ]);
                return t;
            })();
            r["a"] = d;
        },
        function(t, r, e) {
            t.exports = e(228);
        },
        function(t, r, e) {
            var n = e(227);
            function a(r, e, i) {
                if (typeof Reflect !== "undefined" && Reflect.get) {
                    t.exports = a = Reflect.get;
                    (t.exports["default"] = t.exports), (t.exports.__esModule = true);
                } else {
                    t.exports = a = function t(r, e, a) {
                        var i = n(r, e);
                        if (!i) return;
                        var o = Object.getOwnPropertyDescriptor(i, e);
                        if (o.get) {
                            return o.get.call(a);
                        }
                        return o.value;
                    };
                    (t.exports["default"] = t.exports), (t.exports.__esModule = true);
                }
                return a(r, e, i || r);
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
            var i = a(function(t, r, e) {
                n(t, r, e);
            });
            t.exports = i;
        },
        function(t, r, e) {
            var n = e(45);
            var a = typeof self == "object" && self && self.Object === Object && self;
            var i = n || a || Function("return this")();
            t.exports = i;
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
            function e(t, r, e, n, a, i, o) {
                try {
                    var u = t[i](o);
                    var s = u.value;
                } catch (f) {
                    e(f);
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
                    return new Promise(function(a, i) {
                        var o = t.apply(r, n);
                        function u(t) {
                            e(o, a, i, u, s, "next", t);
                        }
                        function s(t) {
                            e(o, a, i, u, s, "throw", t);
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
                    var i = this.searchDirections;
                    var o = r.size.x;
                    var u;
                    function s(t, r, e, s) {
                        var f;
                        var c;
                        var l;
                        for(f = 0; f < 7; f++){
                            c = t.cy + i[t.dir][0];
                            l = t.cx + i[t.dir][1];
                            u = c * o + l;
                            if (n[u] === r && (a[u] === 0 || a[u] === e)) {
                                a[u] = e;
                                t.cy = c;
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
                    function f(t, r, e) {
                        return {
                            dir: e,
                            x: t,
                            y: r,
                            next: null,
                            prev: null
                        };
                    }
                    function c(t, r, e, n, a) {
                        var i = null;
                        var o;
                        var u;
                        var c;
                        var l = {
                            cx: r,
                            cy: t,
                            dir: 0
                        };
                        if (s(l, n, e, a)) {
                            i = f(r, t, l.dir);
                            o = i;
                            c = l.dir;
                            u = f(l.cx, l.cy, 0);
                            u.prev = o;
                            o.next = u;
                            u.next = null;
                            o = u;
                            do {
                                l.dir = (l.dir + 6) % 8;
                                s(l, n, e, a);
                                if (c !== l.dir) {
                                    o.dir = l.dir;
                                    u = f(l.cx, l.cy, 0);
                                    u.prev = o;
                                    o.next = u;
                                    u.next = null;
                                    o = u;
                                } else {
                                    o.dir = c;
                                    o.x = l.cx;
                                    o.y = l.cy;
                                }
                                c = l.dir;
                            }while (l.cx !== r || l.cy !== t)
                            i.prev = o.prev;
                            o.prev.next = i;
                        }
                        return i;
                    }
                    return {
                        trace: function t(r, e, n, a) {
                            return s(r, e, n, a);
                        },
                        contourTracing: function t(r, e, n, a, i) {
                            return c(r, e, n, a, i);
                        }
                    };
                }
            };
            r["a"] = n;
        },
        function(t, r, e) {
            var n = e(27), a = e(103), i = e(104);
            var o = "[object Null]", u = "[object Undefined]";
            var s = n ? n.toStringTag : undefined;
            function f(t) {
                if (t == null) {
                    return t === undefined ? u : o;
                }
                return s && s in Object(t) ? a(t) : i(t);
            }
            t.exports = f;
        },
        function(t, r, e) {
            "use strict";
            (function(t) {
                var n = e(7);
                var a = e.n(n);
                var i = e(34);
                var o = e.n(i);
                var u = e(11);
                var s = e(8);
                var f = e(10);
                var c = e(9);
                var l = e(87);
                var v = e(21);
                var $ = e(88);
                var h;
                var _;
                var p;
                var d;
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
                var k = {
                    x: 0,
                    y: 0
                };
                var E;
                var O;
                function S() {
                    if (h.halfSample) {
                        _ = new u["a"]({
                            x: (E.size.x / 2) | 0,
                            y: (E.size.y / 2) | 0
                        });
                    } else {
                        _ = E;
                    }
                    b = Object(s["a"])(h.patchSize, _.size);
                    k.x = (_.size.x / b.x) | 0;
                    k.y = (_.size.y / b.y) | 0;
                    w = new u["a"](_.size, undefined, Uint8Array, false);
                    x = new u["a"](b, undefined, Array, true);
                    var r = new ArrayBuffer(64 * 1024);
                    d = new u["a"](b, new Uint8Array(r, 0, b.x * b.y));
                    p = new u["a"](b, new Uint8Array(r, b.x * b.y * 3, b.x * b.y), undefined, true);
                    O = Object($["a"])(typeof window !== "undefined" ? window : typeof self !== "undefined" ? self : t, {
                        size: b.x
                    }, r);
                    m = new u["a"]({
                        x: (_.size.x / d.size.x) | 0,
                        y: (_.size.y / d.size.y) | 0
                    }, undefined, Array, true);
                    g = new u["a"](m.size, undefined, undefined, true);
                    y = new u["a"](m.size, undefined, Int32Array, true);
                }
                function R() {
                    if (h.useWorker || typeof document === "undefined") {
                        return;
                    }
                    C.dom.binary = document.createElement("canvas");
                    C.dom.binary.className = "binaryBuffer";
                    if (true && h.debug.showCanvas === true) {
                        document.querySelector("#debug").appendChild(C.dom.binary);
                    }
                    C.ctx.binary = C.dom.binary.getContext("2d");
                    C.dom.binary.width = w.size.x;
                    C.dom.binary.height = w.size.y;
                }
                function D(t) {
                    var r;
                    var e;
                    var a;
                    var o;
                    var u;
                    var s = w.size.x;
                    var f = w.size.y;
                    var l = -w.size.x;
                    var v = -w.size.y;
                    var $;
                    var _;
                    r = 0;
                    for(e = 0; e < t.length; e++){
                        o = t[e];
                        r += o.rad;
                        if (true && h.debug.showPatches) {
                            c["a"].drawRect(o.pos, d.size, C.ctx.binary, {
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
                    u = i["copy"](i["create"](), [
                        Math.cos(r),
                        Math.sin(r),
                        -Math.sin(r),
                        Math.cos(r), 
                    ]);
                    for(e = 0; e < t.length; e++){
                        o = t[e];
                        for(a = 0; a < 4; a++){
                            n["transformMat2"](o.box[a], o.box[a], u);
                        }
                        if (true && h.debug.boxFromPatches.showTransformed) {
                            c["a"].drawPath(o.box, {
                                x: 0,
                                y: 1
                            }, C.ctx.binary, {
                                color: "#99ff00",
                                lineWidth: 2
                            });
                        }
                    }
                    for(e = 0; e < t.length; e++){
                        o = t[e];
                        for(a = 0; a < 4; a++){
                            if (o.box[a][0] < s) {
                                s = o.box[a][0];
                            }
                            if (o.box[a][0] > l) {
                                l = o.box[a][0];
                            }
                            if (o.box[a][1] < f) {
                                f = o.box[a][1];
                            }
                            if (o.box[a][1] > v) {
                                v = o.box[a][1];
                            }
                        }
                    }
                    $ = [
                        [
                            s,
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
                            s,
                            v
                        ], 
                    ];
                    if (true && h.debug.boxFromPatches.showTransformedBox) {
                        c["a"].drawPath($, {
                            x: 0,
                            y: 1
                        }, C.ctx.binary, {
                            color: "#ff0000",
                            lineWidth: 2
                        });
                    }
                    _ = h.halfSample ? 2 : 1;
                    u = i["invert"](u, u);
                    for(a = 0; a < 4; a++){
                        n["transformMat2"]($[a], $[a], u);
                    }
                    if (true && h.debug.boxFromPatches.showBB) {
                        c["a"].drawPath($, {
                            x: 0,
                            y: 1
                        }, C.ctx.binary, {
                            color: "#ff0000",
                            lineWidth: 2
                        });
                    }
                    for(a = 0; a < 4; a++){
                        n["scale"]($[a], $[a], _);
                    }
                    return $;
                }
                function P() {
                    Object(s["i"])(_, w);
                    w.zeroBorder();
                    if (true && h.debug.showCanvas) {
                        w.show(C.dom.binary, 255);
                    }
                }
                function z() {
                    var t;
                    var r;
                    var e;
                    var n;
                    var a;
                    var i = [];
                    var o;
                    var u;
                    var s;
                    for(t = 0; t < k.x; t++){
                        for(r = 0; r < k.y; r++){
                            e = d.size.x * t;
                            n = d.size.y * r;
                            M(e, n);
                            p.zeroBorder();
                            f["a"].init(x.data, 0);
                            o = l["a"].create(p, x);
                            u = o.rasterize(0);
                            if (true && h.debug.showLabels) {
                                x.overlay(C.dom.binary, Math.floor(360 / u.count), {
                                    x: e,
                                    y: n
                                });
                            }
                            a = x.moments(u.count);
                            i = i.concat(L(a, [
                                t,
                                r
                            ], e, n));
                        }
                    }
                    if (true && h.debug.showFoundPatches) {
                        for(t = 0; t < i.length; t++){
                            s = i[t];
                            c["a"].drawRect(s.pos, d.size, C.ctx.binary, {
                                color: "#99ff00",
                                lineWidth: 2
                            });
                        }
                    }
                    return i;
                }
                function A(t) {
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
                    var i = [];
                    var o;
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
                    for(e = 0; e < t.length; e++){
                        a = y.data.length;
                        i.length = 0;
                        while(a--){
                            if (y.data[a] === t[e].label) {
                                o = m.data[a];
                                i.push(o);
                            }
                        }
                        u = D(i);
                        if (u) {
                            f.push(u);
                            if (true && h.debug.showRemainingPatchLabels) {
                                for(n = 0; n < i.length; n++){
                                    o = i[n];
                                    l[0] = (t[e].label / (r + 1)) * 360;
                                    Object(s["g"])(l, v);
                                    c["a"].drawRect(o.pos, d.size, C.ctx.binary, {
                                        color: "rgb(".concat(v.join(","), ")"),
                                        lineWidth: 2
                                    });
                                }
                            }
                        }
                    }
                    return f;
                }
                function T(t) {
                    var r = Object(s["b"])(t, 0.9);
                    var e = Object(s["j"])(r, 1, function(t) {
                        return t.getPoints().length;
                    });
                    var n = [];
                    var a = [];
                    if (e.length === 1) {
                        n = e[0].item.getPoints();
                        for(var i = 0; i < n.length; i++){
                            a.push(n[i].point);
                        }
                    }
                    return a;
                }
                function M(t, r) {
                    w.subImageAsCopy(d, Object(s["h"])(t, r));
                    O.skeletonize();
                    if (true && h.debug.showSkeleton) {
                        p.overlay(C.dom.binary, 360, Object(s["h"])(t, r));
                    }
                }
                function L(t, r, e, a) {
                    var i;
                    var o;
                    var u = [];
                    var s;
                    var f;
                    var c = [];
                    var l = Math.ceil(b.x / 3);
                    if (t.length >= 2) {
                        for(i = 0; i < t.length; i++){
                            if (t[i].m00 > l) {
                                u.push(t[i]);
                            }
                        }
                        if (u.length >= 2) {
                            s = T(u);
                            o = 0;
                            for(i = 0; i < s.length; i++){
                                o += s[i].rad;
                            }
                            if (s.length > 1 && s.length >= (u.length / 4) * 3 && s.length > t.length / 4) {
                                o /= s.length;
                                f = {
                                    index: r[1] * k.x + r[0],
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
                                            e + d.size.x,
                                            a
                                        ]),
                                        n["clone"]([
                                            e + d.size.x,
                                            a + d.size.y, 
                                        ]),
                                        n["clone"]([
                                            e,
                                            a + d.size.y
                                        ]), 
                                    ],
                                    moments: s,
                                    rad: o,
                                    vec: n["clone"]([
                                        Math.cos(o),
                                        Math.sin(o)
                                    ])
                                };
                                c.push(f);
                            }
                        }
                    }
                    return c;
                }
                function W(t) {
                    var r = 0;
                    var e = 0.95;
                    var a = 0;
                    var i;
                    var o;
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
                    function $() {
                        var t;
                        for(t = 0; t < y.data.length; t++){
                            if (y.data[t] === 0 && g.data[t] === 1) {
                                return t;
                            }
                        }
                        return y.length;
                    }
                    function _(t) {
                        var a;
                        var i;
                        var o;
                        var u;
                        var s;
                        var f = {
                            x: t % y.size.x,
                            y: (t / y.size.x) | 0
                        };
                        var c;
                        if (t < y.data.length) {
                            o = m.data[t];
                            y.data[t] = r;
                            for(s = 0; s < v["a"].searchDirections.length; s++){
                                i = f.y + v["a"].searchDirections[s][0];
                                a = f.x + v["a"].searchDirections[s][1];
                                u = i * y.size.x + a;
                                if (g.data[u] === 0) {
                                    y.data[u] = Number.MAX_VALUE;
                                    continue;
                                }
                                if (y.data[u] === 0) {
                                    c = Math.abs(n["dot"](m.data[u].vec, o.vec));
                                    if (c > e) {
                                        _(u);
                                    }
                                }
                            }
                        }
                    }
                    f["a"].init(g.data, 0);
                    f["a"].init(y.data, 0);
                    f["a"].init(m.data, null);
                    for(i = 0; i < t.length; i++){
                        o = t[i];
                        m.data[o.index] = o;
                        g.data[o.index] = 1;
                    }
                    g.zeroBorder();
                    while((a = $()) < y.data.length){
                        r++;
                        _(a);
                    }
                    if (true && h.debug.showPatchLabels) {
                        for(i = 0; i < y.data.length; i++){
                            if (y.data[i] > 0 && y.data[i] <= r) {
                                o = m.data[i];
                                u[0] = (y.data[i] / (r + 1)) * 360;
                                Object(s["g"])(u, l);
                                c["a"].drawRect(o.pos, d.size, C.ctx.binary, {
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
                        h = e;
                        E = r;
                        S();
                        R();
                    },
                    locate: function t() {
                        if (h.halfSample) {
                            Object(s["f"])(E, _);
                        }
                        P();
                        var r = z();
                        if (r.length < k.x * k.y * 0.05) {
                            return null;
                        }
                        var e = W(r);
                        if (e < 1) {
                            return null;
                        }
                        var n = A(e);
                        if (n.length === 0) {
                            return null;
                        }
                        var a = I(n, e);
                        return a;
                    },
                    checkImageConstraints: function t(r, e) {
                        var n;
                        var a = r.getWidth();
                        var i = r.getHeight();
                        var o = e.halfSample ? 0.5 : 1;
                        var u;
                        if (r.getConfig().area) {
                            u = Object(s["d"])(a, i, r.getConfig().area);
                            r.setTopRight({
                                x: u.sx,
                                y: u.sy
                            });
                            r.setCanvasSize({
                                x: a,
                                y: i
                            });
                            a = u.sw;
                            i = u.sh;
                        }
                        var f = {
                            x: Math.floor(a * o),
                            y: Math.floor(i * o)
                        };
                        n = Object(s["a"])(e.patchSize, f);
                        if (true) {
                            console.log("Patch-Size: ".concat(JSON.stringify(n)));
                        }
                        r.setWidth(Math.floor(Math.floor(f.x / n.x) * (1 / o) * n.x));
                        r.setHeight(Math.floor(Math.floor(f.y / n.y) * (1 / o) * n.y));
                        if (r.getWidth() % n.x === 0 && r.getHeight() % n.y === 0) {
                            return true;
                        }
                        throw new Error("Image dimensions do not comply with the current settings: Width (".concat(a, " )and height (").concat(i, ") must a multiple of ").concat(n.x));
                    }
                };
            }.call(this, e(46)));
        },
        function(t, r, e) {
            var n = e(92), a = e(93), i = e(94), o = e(95), u = e(96);
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
            s.prototype.get = i;
            s.prototype.has = o;
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
            var i = Object.prototype;
            var o = i.hasOwnProperty;
            var u = i.propertyIsEnumerable;
            var s = n((function() {
                return arguments;
            })()) ? n : function(t) {
                return (a(t) && o.call(t, "callee") && !u.call(t, "callee"));
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
            var n = e(15), a = e(232), i = e(233), o = e(236);
            function u(t, r) {
                if (n(t)) {
                    return t;
                }
                return a(t, r) ? [
                    t
                ] : i(o(t));
            }
            t.exports = u;
        },
        function(t, r, e) {
            var n = e(224);
            var a = e(225);
            var i = e(60);
            var o = e(226);
            function u(t) {
                return (n(t) || a(t) || i(t) || o());
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
            function i(t, r) {
                var e = a(t, r);
                return n(e) ? e : undefined;
            }
            t.exports = i;
        },
        function(t, r, e) {
            var n = e(22), a = e(14);
            var i = "[object AsyncFunction]", o = "[object Function]", u = "[object GeneratorFunction]", s = "[object Proxy]";
            function f(t) {
                if (!a(t)) {
                    return false;
                }
                var r = n(t);
                return (r == o || r == u || r == i || r == s);
            }
            t.exports = f;
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
            function i(t) {
                return (t != null && a(t.length) && !n(t));
            }
            t.exports = i;
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
            var i = "[object Symbol]";
            function o(t) {
                return (typeof t == "symbol" || (a(t) && n(t) == i));
            }
            t.exports = o;
        },
        function(t, r, e) {
            var n = e(42);
            var a = 1 / 0;
            function i(t) {
                if (typeof t == "string" || n(t)) {
                    return t;
                }
                var r = t + "";
                return r == "0" && 1 / t == -a ? "-0" : r;
            }
            t.exports = i;
        },
        function(t, r, e) {
            var n = e(35), a = e(17);
            var i = n(a, "Map");
            t.exports = i;
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
            var n = e(109), a = e(116), i = e(118), o = e(119), u = e(120);
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
            s.prototype.get = i;
            s.prototype.has = o;
            s.prototype.set = u;
            t.exports = s;
        },
        function(t, r, e) {
            var n = e(37), a = e(26);
            function i(t, r, e) {
                if ((e !== undefined && !a(t[r], e)) || (e === undefined && !(r in t))) {
                    n(t, r, e);
                }
            }
            t.exports = i;
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
                var i = true && r && !r.nodeType && r;
                var o = i && typeof t == "object" && t && !t.nodeType && t;
                var u = o && o.exports === i;
                var s = u ? n.Buffer : undefined;
                var f = s ? s.isBuffer : undefined;
                var c = f || a;
                t.exports = c;
            }.call(this, e(38)(t)));
        },
        function(t, r, e) {
            var n = e(136), a = e(137), i = e(138);
            var o = i && i.isTypedArray;
            var u = o ? a(o) : n;
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
            var i = Object.prototype;
            var o = i.hasOwnProperty;
            function u(t, r, e) {
                var i = t[r];
                if (!(o.call(t, r) && a(i, e)) || (e === undefined && !(r in t))) {
                    n(t, r, e);
                }
            }
            t.exports = u;
        },
        function(t, r, e) {
            var n = e(141), a = e(143), i = e(39);
            function o(t) {
                return i(t) ? n(t, true) : a(t);
            }
            t.exports = o;
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
            function i(t, r, e) {
                r = a(r === undefined ? t.length - 1 : r, 0);
                return function() {
                    var i = arguments, o = -1, u = a(i.length - r, 0), s = Array(u);
                    while(++o < u){
                        s[o] = i[r + o];
                    }
                    o = -1;
                    var f = Array(r + 1);
                    while(++o < r){
                        f[o] = i[o];
                    }
                    f[r] = e(s);
                    return n(t, this, f);
                };
            }
            t.exports = i;
        },
        function(t, r, e) {
            var n = e(148), a = e(150);
            var i = a(n);
            t.exports = i;
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
                var i = e * e + n * n + a * a;
                if (i > 0) {
                    i = 1 / Math.sqrt(i);
                    t[0] = r[0] * i;
                    t[1] = r[1] * i;
                    t[2] = r[2] * i;
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
            var i = e(60);
            var o = e(155);
            function u(t, r) {
                return (n(t) || a(t, r) || i(t, r) || o());
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
            var i = a(function(t, r) {
                return t == null ? {} : n(t, r);
            });
            t.exports = i;
        },
        function(t, r, e) {
            var n = e(2);
            var a = e(41);
            var i = e(248);
            var o = e(249);
            function u(r) {
                var e = typeof Map === "function" ? new Map() : undefined;
                t.exports = u = function t(r) {
                    if (r === null || !i(r)) return r;
                    if (typeof r !== "function") {
                        throw new TypeError("Super expression must either be null or a function");
                    }
                    if (typeof e !== "undefined") {
                        if (e.has(r)) return e.get(r);
                        e.set(r, u);
                    }
                    function u() {
                        return o(r, arguments, n(this).constructor);
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
                    var i = r.data;
                    var o = e.data;
                    var u = r.size.x;
                    var s = r.size.y;
                    var f = n["a"].create(r, e);
                    return {
                        rasterize: function t(r) {
                            var e;
                            var n;
                            var c;
                            var l;
                            var v;
                            var $;
                            var h = [];
                            var _;
                            var p;
                            var d;
                            var x;
                            var g;
                            var y = 0;
                            var m;
                            for(m = 0; m < 400; m++){
                                h[m] = 0;
                            }
                            h[0] = i[0];
                            d = null;
                            for($ = 1; $ < s - 1; $++){
                                l = 0;
                                n = h[0];
                                for(v = 1; v < u - 1; v++){
                                    g = $ * u + v;
                                    if (o[g] === 0) {
                                        e = i[g];
                                        if (e !== n) {
                                            if (l === 0) {
                                                c = y + 1;
                                                h[c] = e;
                                                n = e;
                                                _ = f.contourTracing($, v, c, e, a.DIR.OUTSIDE_EDGE);
                                                if (_ !== null) {
                                                    y++;
                                                    l = c;
                                                    p = a.createContour2D();
                                                    p.dir = a.CONTOUR_DIR.CW_DIR;
                                                    p.index = l;
                                                    p.firstVertex = _;
                                                    p.nextpeer = d;
                                                    p.insideContours = null;
                                                    if (d !== null) {
                                                        d.prevpeer = p;
                                                    }
                                                    d = p;
                                                }
                                            } else {
                                                _ = f.contourTracing($, v, a.DIR.INSIDE_EDGE, e, l);
                                                if (_ !== null) {
                                                    p = a.createContour2D();
                                                    p.firstVertex = _;
                                                    p.insideContours = null;
                                                    if (r === 0) {
                                                        p.dir = a.CONTOUR_DIR.CCW_DIR;
                                                    } else {
                                                        p.dir = a.CONTOUR_DIR.CW_DIR;
                                                    }
                                                    p.index = r;
                                                    x = d;
                                                    while(x !== null && x.index !== l){
                                                        x = x.nextpeer;
                                                    }
                                                    if (x !== null) {
                                                        p.nextpeer = x.insideContours;
                                                        if (x.insideContours !== null) {
                                                            x.insideContours.prevpeer = p;
                                                        }
                                                        x.insideContours = p;
                                                    }
                                                }
                                            }
                                        } else {
                                            o[g] = l;
                                        }
                                    } else if (o[g] === a.DIR.OUTSIDE_EDGE || o[g] === a.DIR.INSIDE_EDGE) {
                                        l = 0;
                                        if (o[g] === a.DIR.INSIDE_EDGE) {
                                            n = i[g];
                                        } else {
                                            n = h[0];
                                        }
                                    } else {
                                        l = o[g];
                                        n = h[l];
                                    }
                                }
                            }
                            x = d;
                            while(x !== null){
                                x.index = r;
                                x = x.nextpeer;
                            }
                            return {
                                cc: d,
                                count: y
                            };
                        },
                        debug: {
                            drawContour: function t(r, e) {
                                var n = r.getContext("2d");
                                var i = e;
                                var o;
                                var u;
                                var s;
                                n.strokeStyle = "red";
                                n.fillStyle = "red";
                                n.lineWidth = 1;
                                if (i !== null) {
                                    o = i.insideContours;
                                } else {
                                    o = null;
                                }
                                while(i !== null){
                                    if (o !== null) {
                                        u = o;
                                        o = o.nextpeer;
                                    } else {
                                        u = i;
                                        i = i.nextpeer;
                                        if (i !== null) {
                                            o = i.insideContours;
                                        } else {
                                            o = null;
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
                var i = t.Math.imul;
                function o(t, r) {
                    t |= 0;
                    r |= 0;
                    var e = 0;
                    var i = 0;
                    var o = 0;
                    var u = 0;
                    var s = 0;
                    var f = 0;
                    var c = 0;
                    var l = 0;
                    for(e = 1; (e | 0) < ((a - 1) | 0); e = (e + 1) | 0){
                        l = (l + a) | 0;
                        for(i = 1; (i | 0) < ((a - 1) | 0); i = (i + 1) | 0){
                            u = (l - a) | 0;
                            s = (l + a) | 0;
                            f = (i - 1) | 0;
                            c = (i + 1) | 0;
                            o = ((n[(t + u + f) | 0] | 0) + (n[(t + u + c) | 0] | 0) + (n[(t + l + i) | 0] | 0) + (n[(t + s + f) | 0] | 0) + (n[(t + s + c) | 0] | 0)) | 0;
                            if ((o | 0) == (5 | 0)) {
                                n[(r + l + i) | 0] = 1;
                            } else {
                                n[(r + l + i) | 0] = 0;
                            }
                        }
                    }
                }
                function u(t, r, e) {
                    t |= 0;
                    r |= 0;
                    e |= 0;
                    var o = 0;
                    o = i(a, a) | 0;
                    while((o | 0) > 0){
                        o = (o - 1) | 0;
                        n[(e + o) | 0] = ((n[(t + o) | 0] | 0) - (n[(r + o) | 0] | 0)) | 0;
                    }
                }
                function s(t, r, e) {
                    t |= 0;
                    r |= 0;
                    e |= 0;
                    var o = 0;
                    o = i(a, a) | 0;
                    while((o | 0) > 0){
                        o = (o - 1) | 0;
                        n[(e + o) | 0] = n[(t + o) | 0] | 0 | (n[(r + o) | 0] | 0) | 0;
                    }
                }
                function f(t) {
                    t |= 0;
                    var r = 0;
                    var e = 0;
                    e = i(a, a) | 0;
                    while((e | 0) > 0){
                        e = (e - 1) | 0;
                        r = ((r | 0) + (n[(t + e) | 0] | 0)) | 0;
                    }
                    return r | 0;
                }
                function c(t, r) {
                    t |= 0;
                    r |= 0;
                    var e = 0;
                    e = i(a, a) | 0;
                    while((e | 0) > 0){
                        e = (e - 1) | 0;
                        n[(t + e) | 0] = r;
                    }
                }
                function l(t, r) {
                    t |= 0;
                    r |= 0;
                    var e = 0;
                    var i = 0;
                    var o = 0;
                    var u = 0;
                    var s = 0;
                    var f = 0;
                    var c = 0;
                    var l = 0;
                    for(e = 1; (e | 0) < ((a - 1) | 0); e = (e + 1) | 0){
                        l = (l + a) | 0;
                        for(i = 1; (i | 0) < ((a - 1) | 0); i = (i + 1) | 0){
                            u = (l - a) | 0;
                            s = (l + a) | 0;
                            f = (i - 1) | 0;
                            c = (i + 1) | 0;
                            o = ((n[(t + u + f) | 0] | 0) + (n[(t + u + c) | 0] | 0) + (n[(t + l + i) | 0] | 0) + (n[(t + s + f) | 0] | 0) + (n[(t + s + c) | 0] | 0)) | 0;
                            if ((o | 0) > (0 | 0)) {
                                n[(r + l + i) | 0] = 1;
                            } else {
                                n[(r + l + i) | 0] = 0;
                            }
                        }
                    }
                }
                function v(t, r) {
                    t |= 0;
                    r |= 0;
                    var e = 0;
                    e = i(a, a) | 0;
                    while((e | 0) > 0){
                        e = (e - 1) | 0;
                        n[(r + e) | 0] = n[(t + e) | 0] | 0;
                    }
                }
                function $(t) {
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
                function h() {
                    var t = 0;
                    var r = 0;
                    var e = 0;
                    var n = 0;
                    var h = 0;
                    var _ = 0;
                    r = i(a, a) | 0;
                    e = (r + r) | 0;
                    n = (e + r) | 0;
                    c(n, 0);
                    $(t);
                    do {
                        o(t, r);
                        l(r, e);
                        u(t, e, e);
                        s(n, e, n);
                        v(r, t);
                        h = f(t) | 0;
                        _ = ((h | 0) == 0) | 0;
                    }while (!_)
                }
                return {
                    skeletonize: h
                };
            }
            r["a"] = n;
        },
        function(t, r, e) {
            t.exports = e(263);
        },
        function(t, r, e) {
            var n = e(91), a = e(48), i = e(121), o = e(123), u = e(14), s = e(56), f = e(54);
            function c(t, r, e, l, v) {
                if (t === r) {
                    return;
                }
                i(r, function(i, s) {
                    v || (v = new n());
                    if (u(i)) {
                        o(t, r, s, e, c, l, v);
                    } else {
                        var $ = l ? l(f(t, s), i, s + "", t, r, v) : undefined;
                        if ($ === undefined) {
                            $ = i;
                        }
                        a(t, s, $);
                    }
                }, s);
            }
            t.exports = c;
        },
        function(t, r, e) {
            var n = e(24), a = e(97), i = e(98), o = e(99), u = e(100), s = e(101);
            function f(t) {
                var r = (this.__data__ = new n(t));
                this.size = r.size;
            }
            f.prototype.clear = a;
            f.prototype["delete"] = i;
            f.prototype.get = o;
            f.prototype.has = u;
            f.prototype.set = s;
            t.exports = f;
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
            var i = a.splice;
            function o(t) {
                var r = this.__data__, e = n(r, t);
                if (e < 0) {
                    return false;
                }
                var a = r.length - 1;
                if (e == a) {
                    r.pop();
                } else {
                    i.call(r, e, 1);
                }
                --this.size;
                return true;
            }
            t.exports = o;
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
            var n = e(24), a = e(44), i = e(47);
            var o = 200;
            function u(t, r) {
                var e = this.__data__;
                if (e instanceof n) {
                    var u = e.__data__;
                    if (!a || u.length < o - 1) {
                        u.push([
                            t,
                            r
                        ]);
                        this.size = ++e.size;
                        return this;
                    }
                    e = this.__data__ = new i(u);
                }
                e.set(t, r);
                this.size = e.size;
                return this;
            }
            t.exports = u;
        },
        function(t, r, e) {
            var n = e(36), a = e(105), i = e(14), o = e(107);
            var u = /[\\^$.*+?()[\]{}|]/g;
            var s = /^\[object .+?Constructor\]$/;
            var f = Function.prototype, c = Object.prototype;
            var l = f.toString;
            var v = c.hasOwnProperty;
            var $ = RegExp("^" + l.call(v).replace(u, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
            function h(t) {
                if (!i(t) || a(t)) {
                    return false;
                }
                var r = n(t) ? $ : s;
                return r.test(o(t));
            }
            t.exports = h;
        },
        function(t, r, e) {
            var n = e(27);
            var a = Object.prototype;
            var i = a.hasOwnProperty;
            var o = a.toString;
            var u = n ? n.toStringTag : undefined;
            function s(t) {
                var r = i.call(t, u), e = t[u];
                try {
                    t[u] = undefined;
                    var n = true;
                } catch (a) {}
                var s = o.call(t);
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
            function i(t) {
                return !!a && a in t;
            }
            t.exports = i;
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
            var n = e(110), a = e(24), i = e(44);
            function o() {
                this.size = 0;
                this.__data__ = {
                    hash: new n(),
                    map: new (i || a)(),
                    string: new n()
                };
            }
            t.exports = o;
        },
        function(t, r, e) {
            var n = e(111), a = e(112), i = e(113), o = e(114), u = e(115);
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
            s.prototype.get = i;
            s.prototype.has = o;
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
            var i = Object.prototype;
            var o = i.hasOwnProperty;
            function u(t) {
                var r = this.__data__;
                if (n) {
                    var e = r[t];
                    return e === a ? undefined : e;
                }
                return o.call(r, t) ? r[t] : undefined;
            }
            t.exports = u;
        },
        function(t, r, e) {
            var n = e(28);
            var a = Object.prototype;
            var i = a.hasOwnProperty;
            function o(t) {
                var r = this.__data__;
                return n ? r[t] !== undefined : i.call(r, t);
            }
            t.exports = o;
        },
        function(t, r, e) {
            var n = e(28);
            var a = "__lodash_hash_undefined__";
            function i(t, r) {
                var e = this.__data__;
                this.size += this.has(t) ? 0 : 1;
                e[t] = n && r === undefined ? a : r;
                return this;
            }
            t.exports = i;
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
                    var a = -1, i = Object(r), o = n(r), u = o.length;
                    while(u--){
                        var s = o[t ? u : ++a];
                        if (e(i[s], s, i) === false) {
                            break;
                        }
                    }
                    return r;
                };
            }
            t.exports = e;
        },
        function(t, r, e) {
            var n = e(48), a = e(124), i = e(125), o = e(128), u = e(129), s = e(30), f = e(15), c = e(133), l = e(52), v = e(36), $ = e(14), h = e(135), _ = e(53), p = e(54), d = e(139);
            function x(t, r, e, x, g, y, m) {
                var w = p(t, e), b = p(r, e), C = m.get(b);
                if (C) {
                    n(t, e, C);
                    return;
                }
                var k = y ? y(w, b, e + "", t, r, m) : undefined;
                var E = k === undefined;
                if (E) {
                    var O = f(b), S = !O && l(b), R = !O && !S && _(b);
                    k = b;
                    if (O || S || R) {
                        if (f(w)) {
                            k = w;
                        } else if (c(w)) {
                            k = o(w);
                        } else if (S) {
                            E = false;
                            k = a(b, true);
                        } else if (R) {
                            E = false;
                            k = i(b, true);
                        } else {
                            k = [];
                        }
                    } else if (h(b) || s(b)) {
                        k = w;
                        if (s(w)) {
                            k = d(w);
                        } else if (!$(w) || v(w)) {
                            k = u(b);
                        }
                    } else {
                        E = false;
                    }
                }
                if (E) {
                    m.set(b, k);
                    g(k, b, x, y, m);
                    m["delete"](b);
                }
                n(t, e, k);
            }
            t.exports = x;
        },
        function(t, r, e) {
            (function(t) {
                var n = e(17);
                var a = true && r && !r.nodeType && r;
                var i = a && typeof t == "object" && t && !t.nodeType && t;
                var o = i && i.exports === a;
                var u = o ? n.Buffer : undefined, s = u ? u.allocUnsafe : undefined;
                function f(t, r) {
                    if (r) {
                        return t.slice();
                    }
                    var e = t.length, n = s ? s(e) : new t.constructor(e);
                    t.copy(n);
                    return n;
                }
                t.exports = f;
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
            var n = e(130), a = e(50), i = e(51);
            function o(t) {
                return typeof t.constructor == "function" && !i(t) ? n(a(t)) : {};
            }
            t.exports = o;
        },
        function(t, r, e) {
            var n = e(14);
            var a = Object.create;
            var i = (function() {
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
            t.exports = i;
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
            var i = "[object Arguments]";
            function o(t) {
                return a(t) && n(t) == i;
            }
            t.exports = o;
        },
        function(t, r, e) {
            var n = e(39), a = e(18);
            function i(t) {
                return a(t) && n(t);
            }
            t.exports = i;
        },
        function(t, r) {
            function e() {
                return false;
            }
            t.exports = e;
        },
        function(t, r, e) {
            var n = e(22), a = e(50), i = e(18);
            var o = "[object Object]";
            var u = Function.prototype, s = Object.prototype;
            var f = u.toString;
            var c = s.hasOwnProperty;
            var l = f.call(Object);
            function v(t) {
                if (!i(t) || n(t) != o) {
                    return false;
                }
                var r = a(t);
                if (r === null) {
                    return true;
                }
                var e = c.call(r, "constructor") && r.constructor;
                return (typeof e == "function" && e instanceof e && f.call(e) == l);
            }
            t.exports = v;
        },
        function(t, r, e) {
            var n = e(22), a = e(40), i = e(18);
            var o = "[object Arguments]", u = "[object Array]", s = "[object Boolean]", f = "[object Date]", c = "[object Error]", l = "[object Function]", v = "[object Map]", $ = "[object Number]", h = "[object Object]", _ = "[object RegExp]", p = "[object Set]", d = "[object String]", x = "[object WeakMap]";
            var g = "[object ArrayBuffer]", y = "[object DataView]", m = "[object Float32Array]", w = "[object Float64Array]", b = "[object Int8Array]", C = "[object Int16Array]", k = "[object Int32Array]", E = "[object Uint8Array]", O = "[object Uint8ClampedArray]", S = "[object Uint16Array]", R = "[object Uint32Array]";
            var D = {};
            D[m] = D[w] = D[b] = D[C] = D[k] = D[E] = D[O] = D[S] = D[R] = true;
            D[o] = D[u] = D[g] = D[s] = D[y] = D[f] = D[c] = D[l] = D[v] = D[$] = D[h] = D[_] = D[p] = D[d] = D[x] = false;
            function P(t) {
                return (i(t) && a(t.length) && !!D[n(t)]);
            }
            t.exports = P;
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
                var i = a && typeof t == "object" && t && !t.nodeType && t;
                var o = i && i.exports === a;
                var u = o && n.process;
                var s = (function() {
                    try {
                        var t = i && i.require && i.require("util").types;
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
            function i(t) {
                return n(t, a(t));
            }
            t.exports = i;
        },
        function(t, r, e) {
            var n = e(55), a = e(37);
            function i(t, r, e, i) {
                var o = !e;
                e || (e = {});
                var u = -1, s = r.length;
                while(++u < s){
                    var f = r[u];
                    var c = i ? i(e[f], t[f], f, e, t) : undefined;
                    if (c === undefined) {
                        c = t[f];
                    }
                    if (o) {
                        a(e, f, c);
                    } else {
                        n(e, f, c);
                    }
                }
                return e;
            }
            t.exports = i;
        },
        function(t, r, e) {
            var n = e(142), a = e(30), i = e(15), o = e(52), u = e(31), s = e(53);
            var f = Object.prototype;
            var c = f.hasOwnProperty;
            function l(t, r) {
                var e = i(t), f = !e && a(t), l = !e && !f && o(t), v = !e && !f && !l && s(t), $ = e || f || l || v, h = $ ? n(t.length, String) : [], _ = h.length;
                for(var p in t){
                    if ((r || c.call(t, p)) && !($ && (p == "length" || (l && (p == "offset" || p == "parent")) || (v && (p == "buffer" || p == "byteLength" || p == "byteOffset")) || u(p, _)))) {
                        h.push(p);
                    }
                }
                return h;
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
            var n = e(14), a = e(51), i = e(144);
            var o = Object.prototype;
            var u = o.hasOwnProperty;
            function s(t) {
                if (!n(t)) {
                    return i(t);
                }
                var r = a(t), e = [];
                for(var o in t){
                    if (!(o == "constructor" && (r || !u.call(t, o)))) {
                        e.push(o);
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
            function i(t) {
                return n(function(r, e) {
                    var n = -1, i = e.length, o = i > 1 ? e[i - 1] : undefined, u = i > 2 ? e[2] : undefined;
                    o = t.length > 3 && typeof o == "function" ? (i--, o) : undefined;
                    if (u && a(e[0], e[1], u)) {
                        o = i < 3 ? undefined : o;
                        i = 1;
                    }
                    r = Object(r);
                    while(++n < i){
                        var s = e[n];
                        if (s) {
                            t(r, s, n, o);
                        }
                    }
                    return r;
                });
            }
            t.exports = i;
        },
        function(t, r, e) {
            var n = e(57), a = e(58), i = e(59);
            function o(t, r) {
                return i(a(t, r, n), t + "");
            }
            t.exports = o;
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
            var n = e(149), a = e(49), i = e(57);
            var o = !a ? i : function(t, r) {
                return a(t, "toString", {
                    configurable: true,
                    enumerable: false,
                    value: n(r),
                    writable: true
                });
            };
            t.exports = o;
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
            function i(t) {
                var r = 0, i = 0;
                return function() {
                    var o = a(), u = n - (o - i);
                    i = o;
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
            t.exports = i;
        },
        function(t, r, e) {
            var n = e(26), a = e(39), i = e(31), o = e(14);
            function u(t, r, e) {
                if (!o(e)) {
                    return false;
                }
                var u = typeof r;
                if (u == "number" ? a(e) && i(r, e.length) : u == "string" && r in e) {
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
                    var i = r & 0xffff;
                    return ((n * i + (((e * i + n * a) << 16) >>> 0)) | 0);
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
                var i = false;
                var o, u;
                try {
                    for(e = e.call(t); !(a = (o = e.next()).done); a = true){
                        n.push(o.value);
                        if (r && n.length === r) break;
                    }
                } catch (s) {
                    i = true;
                    u = s;
                } finally{
                    try {
                        if (!a && e["return"] != null) e["return"]();
                    } finally{
                        if (i) throw u;
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
                var i = r[0];
                var o = r[1];
                return (Math.abs(e - i) <= n * Math.max(1.0, Math.abs(e), Math.abs(i)) && Math.abs(a - o) <= n * Math.max(1.0, Math.abs(a), Math.abs(o)));
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
                var i = r[0], o = r[1];
                t[0] = i * n - o * a;
                t[1] = i * a + o * n;
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
                var a = r[0], i = r[1];
                t[0] = a + n * (e[0] - a);
                t[1] = i + n * (e[1] - i);
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
            function a(t, r, e, a, i, o) {
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
                    i(n, n, o);
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
            t.exports = o;
            var n = e(73);
            var a = e(74);
            var i = e(75);
            function o(t, r) {
                var e = n(t[0], t[1], t[2]);
                var o = n(r[0], r[1], r[2]);
                a(e, e);
                a(o, o);
                var u = i(e, o);
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
                var i = t[2];
                var o = r[0];
                var u = r[1];
                var s = r[2];
                return (Math.abs(e - o) <= n * Math.max(1.0, Math.abs(e), Math.abs(o)) && Math.abs(a - u) <= n * Math.max(1.0, Math.abs(a), Math.abs(u)) && Math.abs(i - s) <= n * Math.max(1.0, Math.abs(i), Math.abs(s)));
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
                var n = r[0], a = r[1], i = r[2], o = e[0], u = e[1], s = e[2];
                t[0] = a * s - i * u;
                t[1] = i * o - n * s;
                t[2] = n * u - a * o;
                return t;
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t, r, e, n) {
                var a = r[0], i = r[1], o = r[2];
                t[0] = a + n * (e[0] - a);
                t[1] = i + n * (e[1] - i);
                t[2] = o + n * (e[2] - o);
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
                var n = r[0], a = r[1], i = r[2], o = e[3] * n + e[7] * a + e[11] * i + e[15];
                o = o || 1.0;
                t[0] = (e[0] * n + e[4] * a + e[8] * i + e[12]) / o;
                t[1] = (e[1] * n + e[5] * a + e[9] * i + e[13]) / o;
                t[2] = (e[2] * n + e[6] * a + e[10] * i + e[14]) / o;
                return t;
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t, r, e) {
                var n = r[0], a = r[1], i = r[2];
                t[0] = n * e[0] + a * e[3] + i * e[6];
                t[1] = n * e[1] + a * e[4] + i * e[7];
                t[2] = n * e[2] + a * e[5] + i * e[8];
                return t;
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t, r, e) {
                var n = r[0], a = r[1], i = r[2], o = e[0], u = e[1], s = e[2], f = e[3], c = f * n + u * i - s * a, l = f * a + s * n - o * i, v = f * i + o * a - u * n, $ = -o * n - u * a - s * i;
                t[0] = c * f + $ * -o + l * -s - v * -u;
                t[1] = l * f + $ * -u + v * -o - c * -s;
                t[2] = v * f + $ * -s + c * -u - l * -o;
                return t;
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t, r, e, n) {
                var a = e[1];
                var i = e[2];
                var o = r[1] - a;
                var u = r[2] - i;
                var s = Math.sin(n);
                var f = Math.cos(n);
                t[0] = r[0];
                t[1] = a + o * f - u * s;
                t[2] = i + o * s + u * f;
                return t;
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t, r, e, n) {
                var a = e[0];
                var i = e[2];
                var o = r[0] - a;
                var u = r[2] - i;
                var s = Math.sin(n);
                var f = Math.cos(n);
                t[0] = a + u * s + o * f;
                t[1] = r[1];
                t[2] = i + u * f - o * s;
                return t;
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t, r, e, n) {
                var a = e[0];
                var i = e[1];
                var o = r[0] - a;
                var u = r[1] - i;
                var s = Math.sin(n);
                var f = Math.cos(n);
                t[0] = a + o * f - u * s;
                t[1] = i + o * s + u * f;
                t[2] = r[2];
                return t;
            }
        },
        function(t, r, e) {
            t.exports = a;
            var n = e(72)();
            function a(t, r, e, a, i, o) {
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
                    i(n, n, o);
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
                var i = a.iterator || "@@iterator";
                var o = a.asyncIterator || "@@asyncIterator";
                var u = a.toStringTag || "@@toStringTag";
                function s(t, r, e, n) {
                    var a = r && r.prototype instanceof _ ? r : _;
                    var i = Object.create(a.prototype);
                    var o = new S(n || []);
                    i._invoke = C(t, e, o);
                    return i;
                }
                t.wrap = s;
                function f(t, r, e) {
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
                var c = "suspendedStart";
                var l = "suspendedYield";
                var v = "executing";
                var $ = "completed";
                var h = {};
                function _() {}
                function p() {}
                function d() {}
                var x = {};
                x[i] = function() {
                    return this;
                };
                var g = Object.getPrototypeOf;
                var y = g && g(g(R([])));
                if (y && y !== r && e.call(y, i)) {
                    x = y;
                }
                var m = (d.prototype = _.prototype = Object.create(x));
                p.prototype = m.constructor = d;
                d.constructor = p;
                d[u] = p.displayName = "GeneratorFunction";
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
                    return r ? r === p || (r.displayName || r.name) === "GeneratorFunction" : false;
                };
                t.mark = function(t) {
                    if (Object.setPrototypeOf) {
                        Object.setPrototypeOf(t, d);
                    } else {
                        t.__proto__ = d;
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
                    function n(a, i, o, u) {
                        var s = f(t[a], t, i);
                        if (s.type === "throw") {
                            u(s.arg);
                        } else {
                            var c = s.arg;
                            var l = c.value;
                            if (l && typeof l === "object" && e.call(l, "__await")) {
                                return r.resolve(l.__await).then(function(t) {
                                    n("next", t, o, u);
                                }, function(t) {
                                    n("throw", t, o, u);
                                });
                            }
                            return r.resolve(l).then(function(t) {
                                c.value = t;
                                o(c);
                            }, function(t) {
                                return n("throw", t, o, u);
                            });
                        }
                    }
                    var a;
                    function i(t, e) {
                        function i() {
                            return new r(function(r, a) {
                                n(t, e, r, a);
                            });
                        }
                        return (a = a ? a.then(i, i) : i());
                    }
                    this._invoke = i;
                }
                w(b.prototype);
                b.prototype[o] = function() {
                    return this;
                };
                t.AsyncIterator = b;
                t.async = function(r, e, n, a, i) {
                    if (i === void 0) i = Promise;
                    var o = new b(s(r, e, n, a), i);
                    return t.isGeneratorFunction(e) ? o : o.next().then(function(t) {
                        return t.done ? t.value : o.next();
                    });
                };
                function C(t, r, e) {
                    var n = c;
                    return function a(i, o) {
                        if (n === v) {
                            throw new Error("Generator is already running");
                        }
                        if (n === $) {
                            if (i === "throw") {
                                throw o;
                            }
                            return D();
                        }
                        e.method = i;
                        e.arg = o;
                        while(true){
                            var u = e.delegate;
                            if (u) {
                                var s = k(u, e);
                                if (s) {
                                    if (s === h) continue;
                                    return s;
                                }
                            }
                            if (e.method === "next") {
                                e.sent = e._sent = e.arg;
                            } else if (e.method === "throw") {
                                if (n === c) {
                                    n = $;
                                    throw e.arg;
                                }
                                e.dispatchException(e.arg);
                            } else if (e.method === "return") {
                                e.abrupt("return", e.arg);
                            }
                            n = v;
                            var _ = f(t, r, e);
                            if (_.type === "normal") {
                                n = e.done ? $ : l;
                                if (_.arg === h) {
                                    continue;
                                }
                                return {
                                    value: _.arg,
                                    done: e.done
                                };
                            } else if (_.type === "throw") {
                                n = $;
                                e.method = "throw";
                                e.arg = _.arg;
                            }
                        }
                    };
                }
                function k(t, r) {
                    var e = t.iterator[r.method];
                    if (e === n) {
                        r.delegate = null;
                        if (r.method === "throw") {
                            if (t.iterator["return"]) {
                                r.method = "return";
                                r.arg = n;
                                k(t, r);
                                if (r.method === "throw") {
                                    return h;
                                }
                            }
                            r.method = "throw";
                            r.arg = new TypeError("The iterator does not provide a 'throw' method");
                        }
                        return h;
                    }
                    var a = f(e, t.iterator, r.arg);
                    if (a.type === "throw") {
                        r.method = "throw";
                        r.arg = a.arg;
                        r.delegate = null;
                        return h;
                    }
                    var i = a.arg;
                    if (!i) {
                        r.method = "throw";
                        r.arg = new TypeError("iterator result is not an object");
                        r.delegate = null;
                        return h;
                    }
                    if (i.done) {
                        r[t.resultName] = i.value;
                        r.next = t.nextLoc;
                        if (r.method !== "return") {
                            r.method = "next";
                            r.arg = n;
                        }
                    } else {
                        return i;
                    }
                    r.delegate = null;
                    return h;
                }
                w(m);
                m[u] = "Generator";
                m[i] = function() {
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
                function R(t) {
                    if (t) {
                        var r = t[i];
                        if (r) {
                            return r.call(t);
                        }
                        if (typeof t.next === "function") {
                            return t;
                        }
                        if (!isNaN(t.length)) {
                            var a = -1, o = function r() {
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
                            return (o.next = o);
                        }
                    }
                    return {
                        next: D
                    };
                }
                t.values = R;
                function D() {
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
                        for(var i = this.tryEntries.length - 1; i >= 0; --i){
                            var o = this.tryEntries[i];
                            var u = o.completion;
                            if (o.tryLoc === "root") {
                                return a("end");
                            }
                            if (o.tryLoc <= this.prev) {
                                var s = e.call(o, "catchLoc");
                                var f = e.call(o, "finallyLoc");
                                if (s && f) {
                                    if (this.prev < o.catchLoc) {
                                        return a(o.catchLoc, true);
                                    } else if (this.prev < o.finallyLoc) {
                                        return a(o.finallyLoc);
                                    }
                                } else if (s) {
                                    if (this.prev < o.catchLoc) {
                                        return a(o.catchLoc, true);
                                    }
                                } else if (f) {
                                    if (this.prev < o.finallyLoc) {
                                        return a(o.finallyLoc);
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
                                var i = a;
                                break;
                            }
                        }
                        if (i && (t === "break" || t === "continue") && i.tryLoc <= r && r <= i.finallyLoc) {
                            i = null;
                        }
                        var o = i ? i.completion : {};
                        o.type = t;
                        o.arg = r;
                        if (i) {
                            this.method = "next";
                            this.next = i.finallyLoc;
                            return h;
                        }
                        return this.complete(o);
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
                        return h;
                    },
                    finish: function(t) {
                        for(var r = this.tryEntries.length - 1; r >= 0; --r){
                            var e = this.tryEntries[r];
                            if (e.finallyLoc === t) {
                                this.complete(e.completion, e.afterLoc);
                                O(e);
                                return h;
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
                            iterator: R(t),
                            resultName: r,
                            nextLoc: e
                        };
                        if (this.method === "next") {
                            this.arg = n;
                        }
                        return h;
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
            function i(t, r) {
                return n(t, r, function(r, e) {
                    return a(t, e);
                });
            }
            t.exports = i;
        },
        function(t, r, e) {
            var n = e(231), a = e(239), i = e(32);
            function o(t, r, e) {
                var o = -1, u = r.length, s = {};
                while(++o < u){
                    var f = r[o], c = n(t, f);
                    if (e(c, f)) {
                        a(s, i(f, t), c);
                    }
                }
                return s;
            }
            t.exports = o;
        },
        function(t, r, e) {
            var n = e(32), a = e(43);
            function i(t, r) {
                r = n(r, t);
                var e = 0, i = r.length;
                while(t != null && e < i){
                    t = t[a(r[e++])];
                }
                return e && e == i ? t : undefined;
            }
            t.exports = i;
        },
        function(t, r, e) {
            var n = e(15), a = e(42);
            var i = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, o = /^\w*$/;
            function u(t, r) {
                if (n(t)) {
                    return false;
                }
                var e = typeof t;
                if (e == "number" || e == "symbol" || e == "boolean" || t == null || a(t)) {
                    return true;
                }
                return (o.test(t) || !i.test(t) || (r != null && t in Object(r)));
            }
            t.exports = u;
        },
        function(t, r, e) {
            var n = e(234);
            var a = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
            var i = /\\(\\)?/g;
            var o = n(function(t) {
                var r = [];
                if (t.charCodeAt(0) === 46) {
                    r.push("");
                }
                t.replace(a, function(t, e, n, a) {
                    r.push(n ? a.replace(i, "$1") : e || t);
                });
                return r;
            });
            t.exports = o;
        },
        function(t, r, e) {
            var n = e(235);
            var a = 500;
            function i(t) {
                var r = n(t, function(t) {
                    if (e.size === a) {
                        e.clear();
                    }
                    return t;
                });
                var e = r.cache;
                return r;
            }
            t.exports = i;
        },
        function(t, r, e) {
            var n = e(47);
            var a = "Expected a function";
            function i(t, r) {
                if (typeof t != "function" || (r != null && typeof r != "function")) {
                    throw new TypeError(a);
                }
                var e = function() {
                    var n = arguments, a = r ? r.apply(this, n) : n[0], i = e.cache;
                    if (i.has(a)) {
                        return i.get(a);
                    }
                    var o = t.apply(this, n);
                    e.cache = i.set(a, o) || i;
                    return o;
                };
                e.cache = new (i.Cache || n)();
                return e;
            }
            i.Cache = n;
            t.exports = i;
        },
        function(t, r, e) {
            var n = e(237);
            function a(t) {
                return t == null ? "" : n(t);
            }
            t.exports = a;
        },
        function(t, r, e) {
            var n = e(27), a = e(238), i = e(15), o = e(42);
            var u = 1 / 0;
            var s = n ? n.prototype : undefined, f = s ? s.toString : undefined;
            function c(t) {
                if (typeof t == "string") {
                    return t;
                }
                if (i(t)) {
                    return a(t, c) + "";
                }
                if (o(t)) {
                    return f ? f.call(t) : "";
                }
                var r = t + "";
                return r == "0" && 1 / t == -u ? "-0" : r;
            }
            t.exports = c;
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
            var n = e(55), a = e(32), i = e(31), o = e(14), u = e(43);
            function s(t, r, e, s) {
                if (!o(t)) {
                    return t;
                }
                r = a(r, t);
                var f = -1, c = r.length, l = c - 1, v = t;
                while(v != null && ++f < c){
                    var $ = u(r[f]), h = e;
                    if ($ === "__proto__" || $ === "constructor" || $ === "prototype") {
                        return t;
                    }
                    if (f != l) {
                        var _ = v[$];
                        h = s ? s(_, $, v) : undefined;
                        if (h === undefined) {
                            h = o(_) ? _ : i(r[f + 1]) ? [] : {};
                        }
                    }
                    n(v, $, h);
                    v = v[$];
                }
                return t;
            }
            t.exports = s;
        },
        function(t, r, e) {
            var n = e(241), a = e(242);
            function i(t, r) {
                return t != null && a(t, r, n);
            }
            t.exports = i;
        },
        function(t, r) {
            function e(t, r) {
                return t != null && r in Object(t);
            }
            t.exports = e;
        },
        function(t, r, e) {
            var n = e(32), a = e(30), i = e(15), o = e(31), u = e(40), s = e(43);
            function f(t, r, e) {
                r = n(r, t);
                var f = -1, c = r.length, l = false;
                while(++f < c){
                    var v = s(r[f]);
                    if (!(l = t != null && e(t, v))) {
                        break;
                    }
                    t = t[v];
                }
                if (l || ++f != c) {
                    return l;
                }
                c = t == null ? 0 : t.length;
                return (!!c && u(c) && o(v, c) && (i(t) || a(t)));
            }
            t.exports = f;
        },
        function(t, r, e) {
            var n = e(244), a = e(58), i = e(59);
            function o(t) {
                return i(a(t, undefined, n), t + "");
            }
            t.exports = o;
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
            function i(t, r, e, o, u) {
                var s = -1, f = t.length;
                e || (e = a);
                u || (u = []);
                while(++s < f){
                    var c = t[s];
                    if (r > 0 && e(c)) {
                        if (r > 1) {
                            i(c, r - 1, e, o, u);
                        } else {
                            n(u, c);
                        }
                    } else if (!o) {
                        u[u.length] = c;
                    }
                }
                return u;
            }
            t.exports = i;
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
            var n = e(27), a = e(30), i = e(15);
            var o = n ? n.isConcatSpreadable : undefined;
            function u(t) {
                return (i(t) || a(t) || !!(o && t && t[o]));
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
            function i(r, e, o) {
                if (a()) {
                    t.exports = i = Reflect.construct;
                    (t.exports["default"] = t.exports), (t.exports.__esModule = true);
                } else {
                    t.exports = i = function t(r, e, a) {
                        var i = [
                            null
                        ];
                        i.push.apply(i, e);
                        var o = Function.bind.apply(r, i);
                        var u = new o();
                        if (a) n(u, a.prototype);
                        return u;
                    };
                    (t.exports["default"] = t.exports), (t.exports.__esModule = true);
                }
                return i.apply(null, arguments);
            }
            t.exports = i;
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
                var n = r[0], a = r[1], i = r[2], o = r[3];
                var u = e[0], s = e[1], f = e[2], c = e[3];
                t[0] = n * u + i * s;
                t[1] = a * u + o * s;
                t[2] = n * f + i * c;
                t[3] = a * f + o * c;
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
                var n = r[0], a = r[1], i = r[2], o = r[3];
                var u = Math.sin(e);
                var s = Math.cos(e);
                t[0] = n * s + i * u;
                t[1] = a * s + o * u;
                t[2] = n * -u + i * s;
                t[3] = a * -u + o * s;
                return t;
            }
        },
        function(t, r) {
            t.exports = e;
            function e(t, r) {
                var e = r[0];
                var n = r[1];
                var a = r[2];
                var i = r[3];
                var o = e * i - a * n;
                if (!o) return null;
                o = 1.0 / o;
                t[0] = i * o;
                t[1] = -n * o;
                t[2] = -a * o;
                t[3] = e * o;
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
                var n = r[0], a = r[1], i = r[2], o = r[3];
                var u = e[0], s = e[1];
                t[0] = n * u;
                t[1] = a * u;
                t[2] = i * s;
                t[3] = o * s;
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
                return rh;
            });
            e.d(r, "Readers", function() {
                return n;
            });
            e.d(r, "CameraAccess", function() {
                return rA;
            });
            e.d(r, "ImageDebug", function() {
                return $["a"];
            });
            e.d(r, "ImageWrapper", function() {
                return f["a"];
            });
            e.d(r, "ResultCollector", function() {
                return r7;
            });
            var n = {};
            e.r(n);
            e.d(n, "BarcodeReader", function() {
                return P;
            });
            e.d(n, "TwoOfFiveReader", function() {
                return tK;
            });
            e.d(n, "NewCodabarReader", function() {
                return t0;
            });
            e.d(n, "Code128Reader", function() {
                return T;
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
                return ro;
            });
            e.d(n, "EAN2Reader", function() {
                return t3;
            });
            e.d(n, "EAN5Reader", function() {
                return tA;
            });
            e.d(n, "EAN8Reader", function() {
                return tk;
            });
            e.d(n, "EANReader", function() {
                return G;
            });
            e.d(n, "I2of5Reader", function() {
                return tB;
            });
            e.d(n, "UPCEReader", function() {
                return tL;
            });
            e.d(n, "UPCReader", function() {
                return tb;
            });
            var a = e(19);
            var i = e.n(a);
            var o = e(16);
            var u = e.n(o);
            var s = e(152);
            var f = e(11);
            var c = {};
            var l = {
                DIR: {
                    UP: 1,
                    DOWN: -1
                }
            };
            c.getBarcodeLine = function(t, r, e) {
                var n = r.x | 0;
                var a = r.y | 0;
                var i = e.x | 0;
                var o = e.y | 0;
                var u = Math.abs(o - a) > Math.abs(i - n);
                var s;
                var f;
                var c;
                var l;
                var v = [];
                var $ = t.data;
                var h = t.size.x;
                var _;
                var p = 255;
                var d = 0;
                function x(t, r) {
                    _ = $[r * h + t];
                    p = _ < p ? _ : p;
                    d = _ > d ? _ : d;
                    v.push(_);
                }
                if (u) {
                    c = n;
                    n = a;
                    a = c;
                    c = i;
                    i = o;
                    o = c;
                }
                if (n > i) {
                    c = n;
                    n = i;
                    i = c;
                    c = a;
                    a = o;
                    o = c;
                }
                var g = i - n;
                var y = Math.abs(o - a);
                s = (g / 2) | 0;
                f = a;
                var m = a < o ? 1 : -1;
                for(l = n; l < i; l++){
                    if (u) {
                        x(f, l);
                    } else {
                        x(l, f);
                    }
                    s -= y;
                    if (s < 0) {
                        f += m;
                        s += g;
                    }
                }
                return {
                    line: v,
                    min: p,
                    max: d
                };
            };
            c.toBinaryLine = function(t) {
                var r = t.min;
                var e = t.max;
                var n = t.line;
                var a;
                var i;
                var o = r + (e - r) / 2;
                var u = [];
                var s;
                var f;
                var c = (e - r) / 12;
                var v = -c;
                var $;
                var h;
                s = n[0] > o ? l.DIR.UP : l.DIR.DOWN;
                u.push({
                    pos: 0,
                    val: n[0]
                });
                for($ = 0; $ < n.length - 2; $++){
                    a = n[$ + 1] - n[$];
                    i = n[$ + 2] - n[$ + 1];
                    if (a + i < v && n[$ + 1] < o * 1.5) {
                        f = l.DIR.DOWN;
                    } else if (a + i > c && n[$ + 1] > o * 0.5) {
                        f = l.DIR.UP;
                    } else {
                        f = s;
                    }
                    if (s !== f) {
                        u.push({
                            pos: $,
                            val: n[$]
                        });
                        s = f;
                    }
                }
                u.push({
                    pos: n.length,
                    val: n[n.length - 1]
                });
                for(h = u[0].pos; h < u[1].pos; h++){
                    n[h] = n[h] > o ? 0 : 1;
                }
                for($ = 1; $ < u.length - 1; $++){
                    if (u[$ + 1].val > u[$].val) {
                        c = (u[$].val + ((u[$ + 1].val - u[$].val) / 3) * 2) | 0;
                    } else {
                        c = (u[$ + 1].val + (u[$].val - u[$ + 1].val) / 3) | 0;
                    }
                    for(h = u[$].pos; h < u[$ + 1].pos; h++){
                        n[h] = n[h] > c ? 0 : 1;
                    }
                }
                return {
                    line: n,
                    threshold: c
                };
            };
            c.debug = {
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
            var v = c;
            var $ = e(9);
            var h = e(3);
            var _ = e.n(h);
            var p = e(4);
            var d = e.n(p);
            var x = e(1);
            var g = e.n(x);
            var y = e(6);
            var m = e.n(y);
            var w = e(5);
            var b = e.n(w);
            var C = e(2);
            var k = e.n(C);
            var E = e(0);
            var O = e.n(E);
            var S = e(10);
            var R;
            (function(t) {
                t[(t["Forward"] = 1)] = "Forward";
                t[(t["Reverse"] = -1)] = "Reverse";
            })(R || (R = {}));
            var D = (function() {
                function t(r, e) {
                    _()(this, t);
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
                d()(t, [
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
                            var i = 0;
                            var o = 0;
                            var u = 0;
                            var s = 0;
                            var f = 0;
                            var c = 0;
                            n = n || this.SINGLE_CODE_ERROR || 1;
                            for(var l = 0; l < r.length; l++){
                                o += r[l];
                                u += e[l];
                            }
                            if (o < u) {
                                return Number.MAX_VALUE;
                            }
                            s = o / u;
                            n *= s;
                            for(var v = 0; v < r.length; v++){
                                f = r[v];
                                c = e[v] * s;
                                i = Math.abs(f - c) / c;
                                if (i > n) {
                                    return Number.MAX_VALUE;
                                }
                                a += i;
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
                            var i = 0;
                            while(a--){
                                i = r[n[a]] * (1 - (1 - e) / 2);
                                if (i > 1) {
                                    r[n[a]] = i;
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
                                    e.direction = R.Reverse;
                                    e.start = this._row.length - e.start;
                                    e.end = this._row.length - e.end;
                                }
                            } else {
                                e.direction = R.Forward;
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
                            var i = 0;
                            a[i] = 0;
                            for(var o = r; o < e; o++){
                                if (this._row[o] ^ (n ? 1 : 0)) {
                                    a[i]++;
                                } else {
                                    i++;
                                    a[i] = 1;
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
                            var i = !this._row[r];
                            var o = 0;
                            S["a"].init(e, 0);
                            for(var u = r; u < a; u++){
                                if (this._row[u] ^ (i ? 1 : 0)) {
                                    e[o]++;
                                } else {
                                    o++;
                                    if (o === n) {
                                        break;
                                    } else {
                                        e[o] = 1;
                                        i = !i;
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
            var P = D;
            function z(t) {
                var r = A();
                return function e() {
                    var n = k()(t), a;
                    if (r) {
                        var i = k()(this).constructor;
                        a = Reflect.construct(n, arguments, i);
                    } else {
                        a = n.apply(this, arguments);
                    }
                    return b()(this, a);
                };
            }
            function A() {
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
                var r = z(e);
                function e() {
                    var t;
                    _()(this, e);
                    for(var n = arguments.length, a = new Array(n), i = 0; i < n; i++){
                        a[i] = arguments[i];
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
                d()(e, [
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
                            var i = r;
                            var o = !this._row[i];
                            var u = 0;
                            for(var s = i; s < this._row.length; s++){
                                if (this._row[s] ^ (o ? 1 : 0)) {
                                    a[u]++;
                                } else {
                                    if (u === a.length - 1) {
                                        if (e) {
                                            this._correct(a, e);
                                        }
                                        for(var f = 0; f < this.CODE_PATTERN.length; f++){
                                            var c = this._matchPattern(a, this.CODE_PATTERN[f]);
                                            if (c < n.error) {
                                                n.code = f;
                                                n.error = c;
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
                                    o = !o;
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
                            var i = 0;
                            for(var o = e; o < this._row.length; o++){
                                if (this._row[o] ^ (a ? 1 : 0)) {
                                    r[i]++;
                                } else {
                                    if (i === r.length - 1) {
                                        var u = r.reduce(function(t, r) {
                                            return t + r;
                                        }, 0);
                                        for(var s = this.START_CODE_A; s <= this.START_CODE_C; s++){
                                            var f = this._matchPattern(r, this.CODE_PATTERN[s]);
                                            if (f < n.error) {
                                                n.code = s;
                                                n.error = f;
                                            }
                                        }
                                        if (n.error < this.AVG_CODE_ERROR) {
                                            n.start = o - u;
                                            n.end = o;
                                            n.correction.bar = this.calculateCorrection(this.CODE_PATTERN[n.code], r, this.MODULE_INDICES.bar);
                                            n.correction.space = this.calculateCorrection(this.CODE_PATTERN[n.code], r, this.MODULE_INDICES.space);
                                            return n;
                                        }
                                        for(var c = 0; c < 4; c++){
                                            r[c] = r[c + 2];
                                        }
                                        r[4] = 0;
                                        r[5] = 0;
                                        i--;
                                    } else {
                                        i++;
                                    }
                                    r[i] = 1;
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
                            var i = {
                                code: a.code,
                                start: a.start,
                                end: a.end,
                                correction: {
                                    bar: a.correction.bar,
                                    space: a.correction.space
                                }
                            };
                            var o = [];
                            o.push(i);
                            var u = i.code;
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
                            })(i.code);
                            var f = false;
                            var c = false;
                            var l = c;
                            var v = true;
                            var $ = 0;
                            var h = [];
                            var _ = [];
                            while(!f){
                                l = c;
                                c = false;
                                i = this._decodeCode(i.end, i.correction);
                                if (i !== null) {
                                    if (i.code !== this.STOP_CODE) {
                                        v = true;
                                    }
                                    if (i.code !== this.STOP_CODE) {
                                        h.push(i.code);
                                        $++;
                                        u += $ * i.code;
                                    }
                                    o.push(i);
                                    switch(s){
                                        case this.CODE_A:
                                            if (i.code < 64) {
                                                _.push(String.fromCharCode(32 + i.code));
                                            } else if (i.code < 96) {
                                                _.push(String.fromCharCode(i.code - 64));
                                            } else {
                                                if (i.code !== this.STOP_CODE) {
                                                    v = false;
                                                }
                                                switch(i.code){
                                                    case this.CODE_SHIFT:
                                                        c = true;
                                                        s = this.CODE_B;
                                                        break;
                                                    case this.CODE_B:
                                                        s = this.CODE_B;
                                                        break;
                                                    case this.CODE_C:
                                                        s = this.CODE_C;
                                                        break;
                                                    case this.STOP_CODE:
                                                        f = true;
                                                        break;
                                                }
                                            }
                                            break;
                                        case this.CODE_B:
                                            if (i.code < 96) {
                                                _.push(String.fromCharCode(32 + i.code));
                                            } else {
                                                if (i.code !== this.STOP_CODE) {
                                                    v = false;
                                                }
                                                switch(i.code){
                                                    case this.CODE_SHIFT:
                                                        c = true;
                                                        s = this.CODE_A;
                                                        break;
                                                    case this.CODE_A:
                                                        s = this.CODE_A;
                                                        break;
                                                    case this.CODE_C:
                                                        s = this.CODE_C;
                                                        break;
                                                    case this.STOP_CODE:
                                                        f = true;
                                                        break;
                                                }
                                            }
                                            break;
                                        case this.CODE_C:
                                            if (i.code < 100) {
                                                _.push(i.code < 10 ? "0" + i.code : i.code);
                                            } else {
                                                if (i.code !== this.STOP_CODE) {
                                                    v = false;
                                                }
                                                switch(i.code){
                                                    case this.CODE_A:
                                                        s = this.CODE_A;
                                                        break;
                                                    case this.CODE_B:
                                                        s = this.CODE_B;
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
                                    s = s === this.CODE_A ? this.CODE_B : this.CODE_A;
                                }
                            }
                            if (i === null) {
                                return null;
                            }
                            i.end = this._nextUnset(this._row, i.end);
                            if (!this._verifyTrailingWhitespace(i)) {
                                return null;
                            }
                            u -= $ * h[h.length - 1];
                            if (u % 103 !== h[h.length - 1]) {
                                return null;
                            }
                            if (!_.length) {
                                return null;
                            }
                            if (v) {
                                _.splice(_.length - 1, 1);
                            }
                            return {
                                code: _.join(""),
                                start: a.start,
                                end: i.end,
                                codeset: s,
                                startInfo: a,
                                decodedCodes: o,
                                endInfo: i,
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
                            var a = n.length, i = 0, o = 0;
                            while(a--){
                                o += r[n[a]];
                                i += e[n[a]];
                            }
                            return o / i;
                        }
                    }, 
                ]);
                return e;
            })(P);
            var T = I;
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
                    var n = k()(t), a;
                    if (r) {
                        var i = k()(this).constructor;
                        a = Reflect.construct(n, arguments, i);
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
            var q = 10;
            var N = [
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
            var j = [
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
                m()(e, t);
                var r = W(e);
                function e(t, n) {
                    var a;
                    _()(this, e);
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
                d()(e, [
                    {
                        key: "_findPattern",
                        value: function t(r, e, n, a) {
                            var i = new Array(r.length).fill(0);
                            var o = {
                                error: Number.MAX_VALUE,
                                start: 0,
                                end: 0
                            };
                            var u = H;
                            var s = 0;
                            if (!e) {
                                e = this._nextSet(this._row);
                            }
                            var f = false;
                            for(var c = e; c < this._row.length; c++){
                                if (this._row[c] ^ (n ? 1 : 0)) {
                                    i[s] += 1;
                                } else {
                                    if (s === i.length - 1) {
                                        var l = this._matchPattern(i, r);
                                        if (l < u && o.error && l < o.error) {
                                            f = true;
                                            o.error = l;
                                            o.start = c - i.reduce(function(t, r) {
                                                return t + r;
                                            }, 0);
                                            o.end = c;
                                            return o;
                                        }
                                        if (a) {
                                            for(var v = 0; v < i.length - 2; v++){
                                                i[v] = i[v + 2];
                                            }
                                            i[i.length - 2] = 0;
                                            i[i.length - 1] = 0;
                                            s--;
                                        }
                                    } else {
                                        s++;
                                    }
                                    i[s] = 1;
                                    n = !n;
                                }
                            }
                            if (f) {} else {}
                            return f ? o : null;
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
                            var i = {
                                error: Number.MAX_VALUE,
                                code: -1,
                                start: r,
                                end: r
                            };
                            var o = H;
                            var u = !this._row[a];
                            var s = 0;
                            if (!e) {
                                e = V.length;
                            }
                            var f = false;
                            for(var c = a; c < this._row.length; c++){
                                if (this._row[c] ^ (u ? 1 : 0)) {
                                    n[s]++;
                                } else {
                                    if (s === n.length - 1) {
                                        for(var l = 0; l < e; l++){
                                            var v = this._matchPattern(n, V[l]);
                                            i.end = c;
                                            if (v < i.error) {
                                                i.code = l;
                                                i.error = v;
                                            }
                                        }
                                        if (i.error > o) {
                                            return null;
                                        }
                                        return i;
                                    } else {
                                        s++;
                                    }
                                    n[s] = 1;
                                    u = !u;
                                }
                            }
                            return f ? i : null;
                        }
                    },
                    {
                        key: "_findStart",
                        value: function t() {
                            var r = this._nextSet(this._row);
                            var e = null;
                            while(!e){
                                e = this._findPattern(N, r, false, true);
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
                            for(var e = 0; e < j.length; e++){
                                if (r === j[e]) {
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
                            var i = 0x0;
                            for(var o = 0; o < 6; o++){
                                a = this._decodeCode(a.end);
                                if (!a) {
                                    return null;
                                }
                                if (a.code >= q) {
                                    a.code -= q;
                                    i |= 1 << (5 - o);
                                } else {
                                    i |= 0 << (5 - o);
                                }
                                e.push(a.code);
                                n.push(a);
                            }
                            var u = this._calculateFirstDigit(i);
                            if (u === null) {
                                return null;
                            }
                            e.unshift(u);
                            var s = this._findPattern(F, a.end, true, false);
                            if (s === null || !s.end) {
                                return null;
                            }
                            n.push(s);
                            for(var f = 0; f < 6; f++){
                                s = this._decodeCode(s.end, q);
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
                                    var i = this.supplements[a].decode(this._row, n.end);
                                    if (i !== null) {
                                        return {
                                            code: i.code,
                                            start: e,
                                            startInfo: n,
                                            end: i.end,
                                            decodedCodes: i.decodedCodes,
                                            format: this.supplements[a].FORMAT
                                        };
                                    }
                                } catch (o) {
                                    console.error("* decodeExtensions error in ", this.supplements[a], ": ", o);
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
                            var i = {};
                            var o = this._findStart();
                            if (!o) {
                                return null;
                            }
                            var u = {
                                start: o.start,
                                end: o.end
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
                                var f = s.decodedCodes[s.decodedCodes.length - 1];
                                var c = {
                                    start: f.start + (((f.end - f.start) / 2) | 0),
                                    end: f.end
                                };
                                if (!this._verifyTrailingWhitespace(c)) {
                                    return null;
                                }
                                i = {
                                    supplement: s,
                                    code: n.join("") + s.code
                                };
                            }
                            return L(L({
                                code: n.join(""),
                                start: o.start,
                                end: u.end,
                                startInfo: o,
                                decodedCodes: a
                            }, i), {}, {
                                format: this.FORMAT
                            });
                        }
                    }, 
                ]);
                return e;
            })(P);
            var G = X;
            var Q = e(33);
            var Z = e.n(Q);
            function Y(t) {
                var r = K();
                return function e() {
                    var n = k()(t), a;
                    if (r) {
                        var i = k()(this).constructor;
                        a = Reflect.construct(n, arguments, i);
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
            var tt = new Uint16Array(Z()(J).map(function(t) {
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
                var r = Y(e);
                function e() {
                    var t;
                    _()(this, e);
                    for(var n = arguments.length, a = new Array(n), i = 0; i < n; i++){
                        a[i] = arguments[i];
                    }
                    t = r.call.apply(r, [
                        this
                    ].concat(a));
                    O()(g()(t), "FORMAT", "code_39");
                    return t;
                }
                d()(e, [
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
                            var i = false;
                            for(var o = r; o < this._row.length; o++){
                                if (this._row[o] ^ (i ? 1 : 0)) {
                                    n[a]++;
                                } else {
                                    if (a === n.length - 1) {
                                        if (this._toPattern(n) === te) {
                                            var u = Math.floor(Math.max(0, e - (o - e) / 4));
                                            if (this._matchRange(u, e, 0)) {
                                                return {
                                                    start: e,
                                                    end: o
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
                                    i = !i;
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
                            var i = 0;
                            while(a > 3){
                                n = this._findNextWidth(r, n);
                                a = 0;
                                var o = 0;
                                for(var u = 0; u < e; u++){
                                    if (r[u] > n) {
                                        o |= 1 << (e - 1 - u);
                                        a++;
                                        i += r[u];
                                    }
                                }
                                if (a === 3) {
                                    for(var s = 0; s < e && a > 0; s++){
                                        if (r[s] > n) {
                                            a--;
                                            if (r[s] * 2 >= i) {
                                                return -1;
                                            }
                                        }
                                    }
                                    return o;
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
                            var i = e - r - a;
                            if (i * 3 >= a) {
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
                            var i = this._nextSet(this._row, e.end);
                            var o;
                            var u;
                            do {
                                n = this._toCounters(i, n);
                                var s = this._toPattern(n);
                                if (s < 0) {
                                    return null;
                                }
                                o = this._patternToChar(s);
                                if (o === null) {
                                    return null;
                                }
                                a.push(o);
                                u = i;
                                i += S["a"].sum(n);
                                i = this._nextSet(this._row, i);
                            }while (o !== "*")
                            a.pop();
                            if (!a.length) {
                                return null;
                            }
                            if (!this._verifyTrailingWhitespace(u, i, n)) {
                                return null;
                            }
                            return {
                                code: a.join(""),
                                start: e.start,
                                end: i,
                                startInfo: e,
                                decodedCodes: a,
                                format: this.FORMAT
                            };
                        }
                    }, 
                ]);
                return e;
            })(P);
            var ta = tn;
            var ti = e(13);
            var to = e.n(ti);
            function tu(t) {
                var r = ts();
                return function e() {
                    var n = k()(t), a;
                    if (r) {
                        var i = k()(this).constructor;
                        a = Reflect.construct(n, arguments, i);
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
            var tf = {
                IOQ: /[IOQ]/g,
                AZ09: /[A-Z0-9]{17}/
            };
            var tc = (function(t) {
                m()(e, t);
                var r = tu(e);
                function e() {
                    var t;
                    _()(this, e);
                    for(var n = arguments.length, a = new Array(n), i = 0; i < n; i++){
                        a[i] = arguments[i];
                    }
                    t = r.call.apply(r, [
                        this
                    ].concat(a));
                    O()(g()(t), "FORMAT", "code_39_vin");
                    return t;
                }
                d()(e, [
                    {
                        key: "_checkChecksum",
                        value: function t(r) {
                            return !!r;
                        }
                    },
                    {
                        key: "decode",
                        value: function t(r, n) {
                            var a = to()(k()(e.prototype), "decode", this).call(this, r, n);
                            if (!a) {
                                return null;
                            }
                            var i = a.code;
                            if (!i) {
                                return null;
                            }
                            i = i.replace(tf.IOQ, "");
                            if (!i.match(tf.AZ09)) {
                                if (true) {
                                    console.log("Failed AZ09 pattern code:", i);
                                }
                                return null;
                            }
                            if (!this._checkChecksum(i)) {
                                return null;
                            }
                            a.code = i;
                            return a;
                        }
                    }, 
                ]);
                return e;
            })(ta);
            var tl = tc;
            function tv(t) {
                var r = t$();
                return function e() {
                    var n = k()(t), a;
                    if (r) {
                        var i = k()(this).constructor;
                        a = Reflect.construct(n, arguments, i);
                    } else {
                        a = n.apply(this, arguments);
                    }
                    return b()(this, a);
                };
            }
            function t$() {
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
            var th = [
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
            var t_ = [
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
            var tp = [
                0x01a,
                0x029,
                0x00b,
                0x00e
            ];
            var td = 4;
            var tx = 2.0;
            var tg = 1.5;
            var ty = (function(t) {
                m()(e, t);
                var r = tv(e);
                function e() {
                    var t;
                    _()(this, e);
                    for(var n = arguments.length, a = new Array(n), i = 0; i < n; i++){
                        a[i] = arguments[i];
                    }
                    t = r.call.apply(r, [
                        this
                    ].concat(a));
                    O()(g()(t), "_counters", []);
                    O()(g()(t), "FORMAT", "codabar");
                    return t;
                }
                d()(e, [
                    {
                        key: "_computeAlternatingThreshold",
                        value: function t(r, e) {
                            var n = Number.MAX_VALUE;
                            var a = 0;
                            var i = 0;
                            for(var o = r; o < e; o += 2){
                                i = this._counters[o];
                                if (i > a) {
                                    a = i;
                                }
                                if (i < n) {
                                    n = i;
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
                            var i = this._computeAlternatingThreshold(r + 1, n);
                            var o = 1 << (e - 1);
                            var u = 0;
                            var s = 0;
                            for(var f = 0; f < e; f++){
                                u = (f & 1) === 0 ? a : i;
                                if (this._counters[r + f] > u) {
                                    s |= o;
                                }
                                o >>= 1;
                            }
                            return s;
                        }
                    },
                    {
                        key: "_isStartEnd",
                        value: function t(r) {
                            for(var e = 0; e < tp.length; e++){
                                if (tp[e] === r) {
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
                            for(var e = 0; e < t_.length; e++){
                                if (t_[e] === r) {
                                    return String.fromCharCode(th[e]);
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
                            for(var n = 0; n < th.length; n++){
                                if (th[n] === e) {
                                    return t_[n];
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
                            var i;
                            for(var o = 0; o < r.length; o++){
                                i = this._charToPattern(r[o]);
                                for(var u = 6; u >= 0; u--){
                                    var s = (u & 1) === 2 ? n.bar : n.space;
                                    var f = (i & 1) === 1 ? s.wide : s.narrow;
                                    f.size += this._counters[a + u];
                                    f.counts++;
                                    i >>= 1;
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
                            var i;
                            for(var o = 0; o < r.length; o++){
                                i = this._charToPattern(r[o]);
                                for(var u = 6; u >= 0; u--){
                                    var s = (u & 1) === 0 ? n.bar : n.space;
                                    var f = (i & 1) === 1 ? s.wide : s.narrow;
                                    var c = this._counters[a + u];
                                    if (c < f.min || c > f.max) {
                                        return false;
                                    }
                                    i >>= 1;
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
                            var i;
                            do {
                                i = this._toPattern(n);
                                if (i < 0) {
                                    return null;
                                }
                                var o = this._patternToChar(i);
                                if (o === null) {
                                    return null;
                                }
                                a.push(o);
                                n += 8;
                                if (a.length > 1 && this._isStartEnd(i)) {
                                    break;
                                }
                            }while (n < this._counters.length)
                            if (a.length - 2 < td || !this._isStartEnd(i)) {
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
            })(P);
            var t0 = ty;
            function tm(t) {
                var r = t8();
                return function e() {
                    var n = k()(t), a;
                    if (r) {
                        var i = k()(this).constructor;
                        a = Reflect.construct(n, arguments, i);
                    } else {
                        a = n.apply(this, arguments);
                    }
                    return b()(this, a);
                };
            }
            function t8() {
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
                var r = tm(e);
                function e() {
                    var t;
                    _()(this, e);
                    for(var n = arguments.length, a = new Array(n), i = 0; i < n; i++){
                        a[i] = arguments[i];
                    }
                    t = r.call.apply(r, [
                        this
                    ].concat(a));
                    O()(g()(t), "FORMAT", "upc_a");
                    return t;
                }
                d()(e, [
                    {
                        key: "decode",
                        value: function t(r, e) {
                            var n = G.prototype.decode.call(this);
                            if (n && n.code && n.code.length === 13 && n.code.charAt(0) === "0") {
                                n.code = n.code.substring(1);
                                return n;
                            }
                            return null;
                        }
                    }, 
                ]);
                return e;
            })(G);
            var tb = tw;
            function t1(t) {
                var r = t2();
                return function e() {
                    var n = k()(t), a;
                    if (r) {
                        var i = k()(this).constructor;
                        a = Reflect.construct(n, arguments, i);
                    } else {
                        a = n.apply(this, arguments);
                    }
                    return b()(this, a);
                };
            }
            function t2() {
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
            var tC = (function(t) {
                m()(e, t);
                var r = t1(e);
                function e() {
                    var t;
                    _()(this, e);
                    for(var n = arguments.length, a = new Array(n), i = 0; i < n; i++){
                        a[i] = arguments[i];
                    }
                    t = r.call.apply(r, [
                        this
                    ].concat(a));
                    O()(g()(t), "FORMAT", "ean_8");
                    return t;
                }
                d()(e, [
                    {
                        key: "_decodePayload",
                        value: function t(r, e, n) {
                            var a = r;
                            for(var i = 0; i < 4; i++){
                                a = this._decodeCode(a.end, q);
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
                            for(var o = 0; o < 4; o++){
                                a = this._decodeCode(a.end, q);
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
            })(G);
            var tk = tC;
            function tE(t) {
                var r = tO();
                return function e() {
                    var n = k()(t), a;
                    if (r) {
                        var i = k()(this).constructor;
                        a = Reflect.construct(n, arguments, i);
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
                var r = tE(e);
                function e() {
                    var t;
                    _()(this, e);
                    for(var n = arguments.length, a = new Array(n), i = 0; i < n; i++){
                        a[i] = arguments[i];
                    }
                    t = r.call.apply(r, [
                        this
                    ].concat(a));
                    O()(g()(t), "FORMAT", "ean_2");
                    return t;
                }
                d()(e, [
                    {
                        key: "decode",
                        value: function t(r, e) {
                            if (r) {
                                this._row = r;
                            }
                            var n = 0;
                            var a = e;
                            var i = this._row.length;
                            var o = [];
                            var u = [];
                            var s = null;
                            if (a === undefined) {
                                return null;
                            }
                            for(var f = 0; f < 2 && a < i; f++){
                                s = this._decodeCode(a);
                                if (!s) {
                                    return null;
                                }
                                u.push(s);
                                o.push(s.code % 10);
                                if (s.code >= q) {
                                    n |= 1 << (1 - f);
                                }
                                if (f !== 1) {
                                    a = this._nextSet(this._row, s.end);
                                    a = this._nextUnset(this._row, a);
                                }
                            }
                            if (o.length !== 2 || parseInt(o.join("")) % 4 !== n) {
                                return null;
                            }
                            var c = this._findStart();
                            return {
                                code: o.join(""),
                                decodedCodes: u,
                                end: s.end,
                                format: this.FORMAT,
                                startInfo: c,
                                start: c.start
                            };
                        }
                    }, 
                ]);
                return e;
            })(G);
            var t3 = tS;
            function tR(t) {
                var r = tD();
                return function e() {
                    var n = k()(t), a;
                    if (r) {
                        var i = k()(this).constructor;
                        a = Reflect.construct(n, arguments, i);
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
            var t4 = [
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
            function tP(t) {
                for(var r = 0; r < 10; r++){
                    if (t === t4[r]) {
                        return r;
                    }
                }
                return null;
            }
            function tz(t) {
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
            var t6 = (function(t) {
                m()(e, t);
                var r = tR(e);
                function e() {
                    var t;
                    _()(this, e);
                    for(var n = arguments.length, a = new Array(n), i = 0; i < n; i++){
                        a[i] = arguments[i];
                    }
                    t = r.call.apply(r, [
                        this
                    ].concat(a));
                    O()(g()(t), "FORMAT", "ean_5");
                    return t;
                }
                d()(e, [
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
                            var i = this._row.length;
                            var o = null;
                            var u = [];
                            var s = [];
                            for(var f = 0; f < 5 && a < i; f++){
                                o = this._decodeCode(a);
                                if (!o) {
                                    return null;
                                }
                                s.push(o);
                                u.push(o.code % 10);
                                if (o.code >= q) {
                                    n |= 1 << (4 - f);
                                }
                                if (f !== 4) {
                                    a = this._nextSet(this._row, o.end);
                                    a = this._nextUnset(this._row, a);
                                }
                            }
                            if (u.length !== 5) {
                                return null;
                            }
                            if (tz(u) !== tP(n)) {
                                return null;
                            }
                            var c = this._findStart();
                            return {
                                code: u.join(""),
                                decodedCodes: s,
                                end: o.end,
                                format: this.FORMAT,
                                startInfo: c,
                                start: c.start
                            };
                        }
                    }, 
                ]);
                return e;
            })(G);
            var tA = t6;
            function tI(t, r) {
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
            function tT(t) {
                for(var r = 1; r < arguments.length; r++){
                    var e = arguments[r] != null ? arguments[r] : {};
                    if (r % 2) {
                        tI(Object(e), true).forEach(function(r) {
                            O()(t, r, e[r]);
                        });
                    } else if (Object.getOwnPropertyDescriptors) {
                        Object.defineProperties(t, Object.getOwnPropertyDescriptors(e));
                    } else {
                        tI(Object(e)).forEach(function(r) {
                            Object.defineProperty(t, r, Object.getOwnPropertyDescriptor(e, r));
                        });
                    }
                }
                return t;
            }
            function t7(t) {
                var r = t5();
                return function e() {
                    var n = k()(t), a;
                    if (r) {
                        var i = k()(this).constructor;
                        a = Reflect.construct(n, arguments, i);
                    } else {
                        a = n.apply(this, arguments);
                    }
                    return b()(this, a);
                };
            }
            function t5() {
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
            var tM = (function(t) {
                m()(e, t);
                var r = t7(e);
                function e() {
                    var t;
                    _()(this, e);
                    for(var n = arguments.length, a = new Array(n), i = 0; i < n; i++){
                        a[i] = arguments[i];
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
                d()(e, [
                    {
                        key: "_decodePayload",
                        value: function t(r, e, n) {
                            var a = tT({}, r);
                            var i = 0x0;
                            for(var o = 0; o < 6; o++){
                                a = this._decodeCode(a.end);
                                if (!a) {
                                    return null;
                                }
                                if (a.code >= q) {
                                    a.code = a.code - q;
                                    i |= 1 << (5 - o);
                                }
                                e.push(a.code);
                                n.push(a);
                            }
                            if (!this._determineParity(i, e)) {
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
                            return to()(k()(e.prototype), "_checksum", this).call(this, this._convertToUPCA(r));
                        }
                    },
                    {
                        key: "_findEnd",
                        value: function t(r, n) {
                            return to()(k()(e.prototype), "_findEnd", this).call(this, r, true);
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
            })(G);
            var tL = tM;
            function tW(t) {
                var r = tU();
                return function e() {
                    var n = k()(t), a;
                    if (r) {
                        var i = k()(this).constructor;
                        a = Reflect.construct(n, arguments, i);
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
            var tq = 1;
            var tN = 3;
            var tF = (function(t) {
                m()(e, t);
                var r = tW(e);
                function e(t) {
                    var n;
                    _()(this, e);
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
                        tq,
                        tq,
                        tq,
                        tq
                    ]);
                    O()(g()(n), "STOP_PATTERN", [
                        tq,
                        tq,
                        tN
                    ]);
                    O()(g()(n), "CODE_PATTERN", [
                        [
                            tq,
                            tq,
                            tN,
                            tN,
                            tq
                        ],
                        [
                            tN,
                            tq,
                            tq,
                            tq,
                            tN
                        ],
                        [
                            tq,
                            tN,
                            tq,
                            tq,
                            tN
                        ],
                        [
                            tN,
                            tN,
                            tq,
                            tq,
                            tq
                        ],
                        [
                            tq,
                            tq,
                            tN,
                            tq,
                            tN
                        ],
                        [
                            tN,
                            tq,
                            tN,
                            tq,
                            tq
                        ],
                        [
                            tq,
                            tN,
                            tN,
                            tq,
                            tq
                        ],
                        [
                            tq,
                            tq,
                            tq,
                            tN,
                            tN
                        ],
                        [
                            tN,
                            tq,
                            tq,
                            tN,
                            tq
                        ],
                        [
                            tq,
                            tN,
                            tq,
                            tN,
                            tq
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
                d()(e, [
                    {
                        key: "_matchPattern",
                        value: function t(r, n) {
                            if (this.config.normalizeBarSpaceWidth) {
                                var a = [
                                    0,
                                    0
                                ];
                                var i = [
                                    0,
                                    0
                                ];
                                var o = [
                                    0,
                                    0
                                ];
                                var u = this.MAX_CORRECTION_FACTOR;
                                var s = 1 / u;
                                for(var f = 0; f < r.length; f++){
                                    a[f % 2] += r[f];
                                    i[f % 2] += n[f];
                                }
                                o[0] = i[0] / a[0];
                                o[1] = i[1] / a[1];
                                o[0] = Math.max(Math.min(o[0], u), s);
                                o[1] = Math.max(Math.min(o[1], u), s);
                                this.barSpaceRatio = o;
                                for(var c = 0; c < r.length; c++){
                                    r[c] *= this.barSpaceRatio[c % 2];
                                }
                            }
                            return to()(k()(e.prototype), "_matchPattern", this).call(this, r, n);
                        }
                    },
                    {
                        key: "_findPattern",
                        value: function t(r, e) {
                            var n = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
                            var a = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
                            var i = new Array(r.length).fill(0);
                            var o = 0;
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
                            for(var f = e; f < this._row.length; f++){
                                if (this._row[f] ^ (n ? 1 : 0)) {
                                    i[o]++;
                                } else {
                                    if (o === i.length - 1) {
                                        var c = i.reduce(function(t, r) {
                                            return t + r;
                                        }, 0);
                                        var l = this._matchPattern(i, r);
                                        if (l < s) {
                                            u.error = l;
                                            u.start = f - c;
                                            u.end = f;
                                            return u;
                                        }
                                        if (a) {
                                            for(var v = 0; v < i.length - 2; v++){
                                                i[v] = i[v + 2];
                                            }
                                            i[i.length - 2] = 0;
                                            i[i.length - 1] = 0;
                                            o--;
                                        } else {
                                            return null;
                                        }
                                    } else {
                                        o++;
                                    }
                                    i[o] = 1;
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
                                var i = this._matchPattern(r, this.CODE_PATTERN[a]);
                                if (i < n.error) {
                                    n.code = a;
                                    n.error = i;
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
                            var i = r.length;
                            var o = [
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
                            while(a < i){
                                for(var s = 0; s < 5; s++){
                                    o[0][s] = r[a] * this.barSpaceRatio[0];
                                    o[1][s] = r[a + 1] * this.barSpaceRatio[1];
                                    a += 2;
                                }
                                u = this._decodePair(o);
                                if (!u) {
                                    return null;
                                }
                                for(var f = 0; f < u.length; f++){
                                    e.push(u[f].code + "");
                                    n.push(u[f]);
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
                            var i = this._findStart();
                            if (!i) {
                                return null;
                            }
                            a.push(i);
                            var o = this._findEnd();
                            if (!o) {
                                return null;
                            }
                            var u = this._fillCounters(i.end, o.start, false);
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
                            a.push(o);
                            return {
                                code: n.join(""),
                                start: i.start,
                                end: o.end,
                                startInfo: i,
                                decodedCodes: a,
                                format: this.FORMAT
                            };
                        }
                    }, 
                ]);
                return e;
            })(P);
            var tB = tF;
            function tV(t) {
                var r = tj();
                return function e() {
                    var n = k()(t), a;
                    if (r) {
                        var i = k()(this).constructor;
                        a = Reflect.construct(n, arguments, i);
                    } else {
                        a = n.apply(this, arguments);
                    }
                    return b()(this, a);
                };
            }
            function tj() {
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
            var tH = 1;
            var tX = 3;
            var tG = [
                tX,
                tH,
                tX,
                tH,
                tH,
                tH, 
            ];
            var tQ = [
                tX,
                tH,
                tH,
                tH,
                tX, 
            ];
            var tZ = [
                [
                    tH,
                    tH,
                    tX,
                    tX,
                    tH, 
                ],
                [
                    tX,
                    tH,
                    tH,
                    tH,
                    tX, 
                ],
                [
                    tH,
                    tX,
                    tH,
                    tH,
                    tX, 
                ],
                [
                    tX,
                    tX,
                    tH,
                    tH,
                    tH, 
                ],
                [
                    tH,
                    tH,
                    tX,
                    tH,
                    tX, 
                ],
                [
                    tX,
                    tH,
                    tX,
                    tH,
                    tH, 
                ],
                [
                    tH,
                    tX,
                    tX,
                    tH,
                    tH, 
                ],
                [
                    tH,
                    tH,
                    tH,
                    tX,
                    tX, 
                ],
                [
                    tX,
                    tH,
                    tH,
                    tX,
                    tH, 
                ],
                [
                    tH,
                    tX,
                    tH,
                    tX,
                    tH, 
                ], 
            ];
            var t9 = tG.reduce(function(t, r) {
                return t + r;
            }, 0);
            var tY = (function(t) {
                m()(e, t);
                var r = tV(e);
                function e() {
                    var t;
                    _()(this, e);
                    for(var n = arguments.length, a = new Array(n), i = 0; i < n; i++){
                        a[i] = arguments[i];
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
                d()(e, [
                    {
                        key: "_findPattern",
                        value: function t(r, e) {
                            var n = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
                            var a = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
                            var i = [];
                            var o = 0;
                            var u = {
                                error: Number.MAX_VALUE,
                                code: -1,
                                start: 0,
                                end: 0
                            };
                            var s = 0;
                            var f = 0;
                            var c = this.AVG_CODE_ERROR;
                            if (!e) {
                                e = this._nextSet(this._row);
                            }
                            for(var l = 0; l < r.length; l++){
                                i[l] = 0;
                            }
                            for(var v = e; v < this._row.length; v++){
                                if (this._row[v] ^ (n ? 1 : 0)) {
                                    i[o]++;
                                } else {
                                    if (o === i.length - 1) {
                                        s = 0;
                                        for(var $ = 0; $ < i.length; $++){
                                            s += i[$];
                                        }
                                        f = this._matchPattern(i, r);
                                        if (f < c) {
                                            u.error = f;
                                            u.start = v - s;
                                            u.end = v;
                                            return u;
                                        }
                                        if (a) {
                                            for(var h = 0; h < i.length - 2; h++){
                                                i[h] = i[h + 2];
                                            }
                                            i[i.length - 2] = 0;
                                            i[i.length - 1] = 0;
                                            o--;
                                        } else {
                                            return null;
                                        }
                                    } else {
                                        o++;
                                    }
                                    i[o] = 1;
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
                                r = this._findPattern(tG, e, false, true);
                                if (!r) {
                                    return null;
                                }
                                n = Math.floor((r.end - r.start) / t9);
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
                            for(var a = 0; a < tZ.length; a++){
                                var i = this._matchPattern(r, tZ[a]);
                                if (i < n.error) {
                                    n.code = a;
                                    n.error = i;
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
                            var i = r.length;
                            var o = [
                                0,
                                0,
                                0,
                                0,
                                0
                            ];
                            var u = null;
                            while(a < i){
                                for(var s = 0; s < 5; s++){
                                    o[s] = r[a] * this.barSpaceRatio[0];
                                    a += 2;
                                }
                                u = this._decodeCode(o);
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
                            var i = this._fillCounters(n.end, a.start, false);
                            if (!this._verifyCounterLength(i)) {
                                return null;
                            }
                            var o = [];
                            o.push(n);
                            var u = [];
                            var s = this._decodePayload(i, u, o);
                            if (!s) {
                                return null;
                            }
                            if (u.length < 5) {
                                return null;
                            }
                            o.push(a);
                            return {
                                code: u.join(""),
                                start: n.start,
                                end: a.end,
                                startInfo: n,
                                decodedCodes: o,
                                format: this.FORMAT
                            };
                        }
                    }, 
                ]);
                return e;
            })(P);
            var tK = tY;
            function tJ(t) {
                var r = rt();
                return function e() {
                    var n = k()(t), a;
                    if (r) {
                        var i = k()(this).constructor;
                        a = Reflect.construct(n, arguments, i);
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
            var re = new Uint16Array(Z()(rr).map(function(t) {
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
            var ri = (function(t) {
                m()(e, t);
                var r = tJ(e);
                function e() {
                    var t;
                    _()(this, e);
                    for(var n = arguments.length, a = new Array(n), i = 0; i < n; i++){
                        a[i] = arguments[i];
                    }
                    t = r.call.apply(r, [
                        this
                    ].concat(a));
                    O()(g()(t), "FORMAT", "code_93");
                    return t;
                }
                d()(e, [
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
                            for(var i = 0; i < e; i++){
                                var o = Math.round((r[i] * 9) / n);
                                if (o < 1 || o > 4) {
                                    return -1;
                                }
                                if ((i & 1) === 0) {
                                    for(var u = 0; u < o; u++){
                                        a = (a << 1) | 1;
                                    }
                                } else {
                                    a <<= o;
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
                            var i = false;
                            for(var o = r; o < this._row.length; o++){
                                if (this._row[o] ^ (i ? 1 : 0)) {
                                    n[a]++;
                                } else {
                                    if (a === n.length - 1) {
                                        if (this._toPattern(n) === ra) {
                                            var u = Math.floor(Math.max(0, e - (o - e) / 4));
                                            if (this._matchRange(u, e, 0)) {
                                                return {
                                                    start: e,
                                                    end: o
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
                                    i = !i;
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
                                var i = r[a];
                                if (i >= "a" && i <= "d") {
                                    if (a > e - 2) {
                                        return null;
                                    }
                                    var o = r[++a];
                                    var u = o.charCodeAt(0);
                                    var s = void 0;
                                    switch(i){
                                        case "a":
                                            if (o >= "A" && o <= "Z") {
                                                s = String.fromCharCode(u - 64);
                                            } else {
                                                return null;
                                            }
                                            break;
                                        case "b":
                                            if (o >= "A" && o <= "E") {
                                                s = String.fromCharCode(u - 38);
                                            } else if (o >= "F" && o <= "J") {
                                                s = String.fromCharCode(u - 11);
                                            } else if (o >= "K" && o <= "O") {
                                                s = String.fromCharCode(u + 16);
                                            } else if (o >= "P" && o <= "S") {
                                                s = String.fromCharCode(u + 43);
                                            } else if (o >= "T" && o <= "Z") {
                                                s = String.fromCharCode(127);
                                            } else {
                                                return null;
                                            }
                                            break;
                                        case "c":
                                            if (o >= "A" && o <= "O") {
                                                s = String.fromCharCode(u - 32);
                                            } else if (o === "Z") {
                                                s = ":";
                                            } else {
                                                return null;
                                            }
                                            break;
                                        case "d":
                                            if (o >= "A" && o <= "Z") {
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
                                    n.push(i);
                                }
                            }
                            return n;
                        }
                    },
                    {
                        key: "_matchCheckChar",
                        value: function t(r, e, n) {
                            var a = r.slice(0, e);
                            var i = a.length;
                            var o = a.reduce(function(t, r, e) {
                                var a = ((e * -1 + (i - 1)) % n) + 1;
                                var o = re.indexOf(r.charCodeAt(0));
                                return t + a * o;
                            }, 0);
                            var u = re[o % 47];
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
                            var i = this._nextSet(this._row, e.end);
                            var o;
                            var u;
                            do {
                                n = this._toCounters(i, n);
                                var s = this._toPattern(n);
                                if (s < 0) {
                                    return null;
                                }
                                u = this._patternToChar(s);
                                if (u === null) {
                                    return null;
                                }
                                a.push(u);
                                o = i;
                                i += S["a"].sum(n);
                                i = this._nextSet(this._row, i);
                            }while (u !== "*")
                            a.pop();
                            if (!a.length) {
                                return null;
                            }
                            if (!this._verifyEnd(o, i)) {
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
                                end: i,
                                startInfo: e,
                                decodedCodes: a,
                                format: this.FORMAT
                            };
                        }
                    }, 
                ]);
                return e;
            })(P);
            var ro = ri;
            function ru(t) {
                var r = rs();
                return function e() {
                    var n = k()(t), a;
                    if (r) {
                        var i = k()(this).constructor;
                        a = Reflect.construct(n, arguments, i);
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
            var rf = {
                AEIO: /[AEIO]/g,
                AZ09: /[A-Z0-9]/
            };
            var rc = "0123456789BCDFGHJKLMNPQRSTUVWXYZ";
            var rl = (function(t) {
                m()(e, t);
                var r = ru(e);
                function e() {
                    var t;
                    _()(this, e);
                    for(var n = arguments.length, a = new Array(n), i = 0; i < n; i++){
                        a[i] = arguments[i];
                    }
                    t = r.call.apply(r, [
                        this
                    ].concat(a));
                    O()(g()(t), "FORMAT", "code_32_reader");
                    return t;
                }
                d()(e, [
                    {
                        key: "_decodeCode32",
                        value: function t(r) {
                            if (/[^0-9BCDFGHJKLMNPQRSTUVWXYZ]/.test(r)) {
                                return null;
                            }
                            var e = 0;
                            for(var n = 0; n < r.length; n++){
                                e = e * 32 + rc.indexOf(r[n]);
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
                            var a = to()(k()(e.prototype), "decode", this).call(this, r, n);
                            if (!a) {
                                return null;
                            }
                            var i = a.code;
                            if (!i) {
                                return null;
                            }
                            i = i.replace(rf.AEIO, "");
                            if (!this._checkChecksum(i)) {
                                return null;
                            }
                            var o = this._decodeCode32(i);
                            if (!o) {
                                return null;
                            }
                            a.code = o;
                            return a;
                        }
                    }, 
                ]);
                return e;
            })(ta);
            var rv = rl;
            var r$ = {
                code_128_reader: T,
                ean_reader: G,
                ean_5_reader: tA,
                ean_2_reader: t3,
                ean_8_reader: tk,
                code_39_reader: ta,
                code_39_vin_reader: tl,
                codabar_reader: t0,
                upc_reader: tb,
                upc_e_reader: tL,
                i2of5_reader: tB,
                "2of5_reader": tK,
                code_93_reader: ro,
                code_32_reader: rv
            };
            var rh = {
                registerReader: function t(r, e) {
                    r$[r] = e;
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
                    o();
                    u();
                    s();
                    function o() {
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
                            if (i()(t) === "object") {
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
                                    return new r$[t]();
                                });
                            }
                            try {
                                var o = new r$[r](e, n);
                                a.push(o);
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
                    function f(t, r, n) {
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
                    function c(t) {
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
                        var i = null;
                        var o;
                        var u = v.getBarcodeLine(e, t[0], t[1]);
                        if (true && r.debug.showFrequency) {
                            $["a"].drawPath(t, {
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
                        for(o = 0; o < a.length && i === null; o++){
                            i = a[o].decodePattern(u.line);
                        }
                        if (i === null) {
                            return null;
                        }
                        return {
                            codeResult: i,
                            barcodeLine: u
                        };
                    }
                    function h(t, r, e) {
                        var n = Math.sqrt(Math.pow(t[1][0] - t[0][0], 2) + Math.pow(t[1][1] - t[0][1], 2));
                        var a;
                        var i = 16;
                        var o = null;
                        var u;
                        var s;
                        var f = Math.sin(e);
                        var c = Math.cos(e);
                        for(a = 1; a < i && o === null; a++){
                            u = (n / i) * a * (a % 2 === 0 ? -1 : 1);
                            s = {
                                y: u * f,
                                x: u * c
                            };
                            r[0].y += s.x;
                            r[0].x -= s.y;
                            r[1].y += s.x;
                            r[1].x -= s.y;
                            o = l(r);
                        }
                        return o;
                    }
                    function _(t) {
                        return Math.sqrt(Math.pow(Math.abs(t[1].y - t[0].y), 2) + Math.pow(Math.abs(t[1].x - t[0].x), 2));
                    }
                    function p(t) {
                        var r = null;
                        for(var e = 0; e < a.length && r === null; e++){
                            r = a[e].decodeImage ? a[e].decodeImage(t) : null;
                        }
                        return r;
                    }
                    function d(t) {
                        var e;
                        var a = n.ctx.overlay;
                        var i;
                        if (true) {
                            if (r.debug.drawBoundingBox && a) {
                                $["a"].drawPath(t, {
                                    x: 0,
                                    y: 1
                                }, a, {
                                    color: "blue",
                                    lineWidth: 2
                                });
                            }
                        }
                        e = c(t);
                        var o = _(e);
                        var u = Math.atan2(e[1].y - e[0].y, e[1].x - e[0].x);
                        e = f(e, u, Math.floor(o * 0.1));
                        if (e === null) {
                            return null;
                        }
                        i = l(e);
                        if (i === null) {
                            i = h(t, e, u);
                        }
                        if (i === null) {
                            return null;
                        }
                        if (true && i && r.debug.drawScanline && a) {
                            $["a"].drawPath(e, {
                                x: "x",
                                y: "y"
                            }, a, {
                                color: "red",
                                lineWidth: 3
                            });
                        }
                        return {
                            codeResult: i.codeResult,
                            line: e,
                            angle: u,
                            pattern: i.barcodeLine.line,
                            threshold: i.barcodeLine.threshold
                        };
                    }
                    return {
                        decodeFromBoundingBox: function t(r) {
                            return d(r);
                        },
                        decodeFromBoundingBoxes: function t(e) {
                            var n;
                            var a;
                            var i = [];
                            var o = r.multiple;
                            for(n = 0; n < e.length; n++){
                                var u = e[n];
                                a = d(u) || {};
                                a.box = u;
                                if (o) {
                                    i.push(a);
                                } else if (a.codeResult) {
                                    return a;
                                }
                            }
                            if (o) {
                                return {
                                    barcodes: i
                                };
                            }
                        },
                        decodeFromImage: function t(r) {
                            var e = p(r);
                            return e;
                        },
                        registerReader: function t(r, e) {
                            if (r$[r]) {
                                throw new Error("cannot register existing reader", r);
                            }
                            r$[r] = e;
                        },
                        setReaders: function t(e) {
                            r.readers = e;
                            a.length = 0;
                            u();
                        }
                    };
                }
            };
            var r_ = (function t() {
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
                function i(t, r, n) {
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
                        return i(r, e, n);
                    },
                    publish: function t(r, n) {
                        var i = e(r);
                        var o = i.subscribers;
                        o.filter(function(t) {
                            return !!t.once;
                        }).forEach(function(t) {
                            a(t, n);
                        });
                        i.subscribers = o.filter(function(t) {
                            return !t.once;
                        });
                        i.subscribers.forEach(function(t) {
                            a(t, n);
                        });
                    },
                    once: function t(r, e) {
                        var n = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
                        i(r, {
                            callback: e,
                            async: n,
                            once: true
                        });
                    },
                    unsubscribe: function t(r, a) {
                        if (r) {
                            var i = e(r);
                            if (i && a) {
                                i.subscribers = i.subscribers.filter(function(t) {
                                    return (t.callback !== a);
                                });
                            } else {
                                i.subscribers = [];
                            }
                        } else {
                            n();
                        }
                    }
                };
            })();
            var rp = e(20);
            var rd = e.n(rp);
            var rx = e(12);
            var rg = e.n(rx);
            var ry = e(85);
            var r0 = e.n(ry);
            var rm = e(86);
            var r8 = e.n(rm);
            function rw(t) {
                var r = rb();
                return function e() {
                    var n = k()(t), a;
                    if (r) {
                        var i = k()(this).constructor;
                        a = Reflect.construct(n, arguments, i);
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
                    _()(this, e);
                    a = r.call(this, t);
                    O()(g()(a), "code", void 0);
                    a.code = n;
                    Object.setPrototypeOf(g()(a), e.prototype);
                    return a;
                }
                return e;
            })(r8()(Error));
            var r2 = "This may mean that the user has declined camera access, or the browser does not support media APIs. If you are running in iOS, you must use Safari.";
            function rC() {
                try {
                    return navigator.mediaDevices.enumerateDevices();
                } catch (t) {
                    var r = new r1("enumerateDevices is not defined. ".concat(r2), -1);
                    return Promise.reject(r);
                }
            }
            function rk(t) {
                try {
                    return navigator.mediaDevices.getUserMedia(t);
                } catch (r) {
                    var e = new r1("getUserMedia is not defined. ".concat(r2), -1);
                    return Promise.reject(e);
                }
            }
            var rE;
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
                return r3.apply(this, arguments);
            }
            function r3() {
                r3 = rd()(rg.a.mark(function t(r, e) {
                    var n;
                    return rg.a.wrap(function t(a) {
                        while(1){
                            switch((a.prev = a.next)){
                                case 0:
                                    a.next = 2;
                                    return rk(e);
                                case 2:
                                    n = a.sent;
                                    rE = n;
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
                return r3.apply(this, arguments);
            }
            function rR(t) {
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
                var r = rR(t);
                if (r && r.deviceId && r.facingMode) {
                    delete r.facingMode;
                }
                return Promise.resolve({
                    audio: false,
                    video: r
                });
            }
            function r4() {
                return rP.apply(this, arguments);
            }
            function rP() {
                rP = rd()(rg.a.mark(function t() {
                    var r;
                    return rg.a.wrap(function t(e) {
                        while(1){
                            switch((e.prev = e.next)){
                                case 0:
                                    e.next = 2;
                                    return rC();
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
                return rP.apply(this, arguments);
            }
            function rz() {
                if (!rE) {
                    return null;
                }
                var t = rE.getVideoTracks();
                return t && t !== null && t !== void 0 && t.length ? t[0] : null;
            }
            var r6 = {
                requestedVideoElement: null,
                request: function t(r, e) {
                    return rd()(rg.a.mark(function t() {
                        var n;
                        return rg.a.wrap(function t(a) {
                            while(1){
                                switch((a.prev = a.next)){
                                    case 0:
                                        r6.requestedVideoElement = r;
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
                    var r = rE && rE.getVideoTracks();
                    if (r6.requestedVideoElement !== null) {
                        r6.requestedVideoElement.pause();
                    }
                    return new Promise(function(t) {
                        setTimeout(function() {
                            if (r && r.length) {
                                r[0].stop();
                            }
                            rE = null;
                            r6.requestedVideoElement = null;
                            t();
                        }, 0);
                    });
                },
                enumerateVideoDevices: r4,
                getActiveStreamLabel: function t() {
                    var r = rz();
                    return r ? r.label : "";
                },
                getActiveTrack: rz
            };
            var rA = r6;
            function rI(t, r) {
                return (r && r.some(function(r) {
                    var e = Object.keys(r);
                    return e.every(function(e) {
                        return r[e] === t[e];
                    });
                }));
            }
            function rT(t, r) {
                return typeof r === "function" ? r(t) : true;
            }
            var r7 = {
                create: function t(r) {
                    var e;
                    var n = document.createElement("canvas");
                    var a = n.getContext("2d");
                    var i = [];
                    var o = (e = r.capacity) !== null && e !== void 0 ? e : 20;
                    var u = r.capture === true;
                    function s(t) {
                        return (!!o && t && !rI(t, r.blacklist) && rT(t, r.filter));
                    }
                    return {
                        addResult: function t(r, e, f) {
                            var c = {};
                            if (s(f)) {
                                o--;
                                c.codeResult = f;
                                if (u) {
                                    n.width = e.x;
                                    n.height = e.y;
                                    $["a"].drawImage(r, e, a);
                                    c.frame = n.toDataURL();
                                }
                                i.push(c);
                            }
                        },
                        getResults: function t() {
                            return i;
                        }
                    };
                }
            };
            var r5 = {
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
            var rM = r5;
            var rL = {
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
            var rW = rL;
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
            var rq = rU;
            var rN = true ? rM : undefined;
            var rF = rN;
            var rB = e(7);
            var rV = function t() {
                _()(this, t);
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
                O()(this, "canvasContainer", new rH());
            };
            var rj = function t() {
                _()(this, t);
                O()(this, "image", void 0);
                O()(this, "overlay", void 0);
            };
            var rH = function t() {
                _()(this, t);
                O()(this, "ctx", void 0);
                O()(this, "dom", void 0);
                this.ctx = new rj();
                this.dom = new rj();
            };
            var rX = e(23);
            function rG(t, r, e) {
                var n = r || new f["a"]({
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
                rX["a"].init(n, e);
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
            function rZ(t, r) {
                var e = document.querySelector(t);
                if (!e) {
                    e = document.createElement("canvas");
                    e.className = r;
                }
                return e;
            }
            function r9(t, r) {
                var e = rZ(t, r);
                var n = e.getContext("2d");
                return {
                    canvas: e,
                    context: n
                };
            }
            function rY(t) {
                if (typeof document !== "undefined") {
                    var r = r9("canvas.imgBuffer", "imgBuffer");
                    var e = r9("canvas.drawingBuffer", "drawingBuffer");
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
                var i = rQ(t === null || t === void 0 ? void 0 : (r = t.config) === null || r === void 0 ? void 0 : (e = r.inputStream) === null || e === void 0 ? void 0 : e.target);
                var o = t === null || t === void 0 ? void 0 : (n = t.config) === null || n === void 0 ? void 0 : (a = n.inputStream) === null || a === void 0 ? void 0 : a.type;
                if (!o) return null;
                var u = rY(t.inputStream.getCanvasSize());
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
                    if (i) {
                        if (o === "ImageStream" && !i.contains(s.image)) {
                            i.appendChild(s.image);
                        }
                        if (!i.contains(s.overlay)) {
                            i.appendChild(s.overlay);
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
                        return ei(t, r);
                    });
                }
                return Promise.resolve(null);
            }
            function ee(t) {
                var r = t.replace(/^data:([^;]+);base64,/gim, "");
                var e = atob(r);
                var n = e.length;
                var a = new ArrayBuffer(n);
                var i = new Uint8Array(a);
                for(var o = 0; o < n; o++){
                    i[o] = e.charCodeAt(o);
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
            function ei(t) {
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
                var i = 2;
                var o;
                if (e.getUint8(0) !== 0xff || e.getUint8(1) !== 0xd8) {
                    return false;
                }
                while(i < n){
                    if (e.getUint8(i) !== 0xff) {
                        return false;
                    }
                    o = e.getUint8(i + 1);
                    if (o === 0xe1) {
                        return eo(e, i + 4, a);
                    }
                    i += 2 + e.getUint16(i + 2);
                }
                return false;
            }
            function eo(t, r, e) {
                if (ef(t, r, 4) !== "Exif") {
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
                var i = t.getUint32(n + 4, !a);
                if (i < 0x00000008) {
                    return false;
                }
                var o = eu(t, n, n + i, e, a);
                return o;
            }
            function eu(t, r, e, n, a) {
                var i = t.getUint16(e, !a);
                var o = {};
                for(var u = 0; u < i; u++){
                    var s = e + u * 12 + 2;
                    var f = n[t.getUint16(s, !a)];
                    if (f) {
                        o[f] = es(t, s, r, e, a);
                    }
                }
                return o;
            }
            function es(t, r, e, n, a) {
                var i = t.getUint16(r + 2, !a);
                var o = t.getUint32(r + 4, !a);
                switch(i){
                    case 3:
                        if (o === 1) {
                            return t.getUint16(r + 8, !a);
                        }
                }
                return null;
            }
            function ef(t, r, e) {
                var n = "";
                for(var a = r; a < r + e; a++){
                    n += String.fromCharCode(t.getUint8(a));
                }
                return n;
            }
            var ec = {};
            ec.load = function(t, r, e, n, a) {
                var i = new Array(n);
                var o = new Array(i.length);
                var u;
                var s;
                var f;
                if (a === false) {
                    i[0] = t;
                } else {
                    for(u = 0; u < i.length; u++){
                        f = e + u;
                        i[u] = "".concat(t, "image-").concat("00".concat(f).slice(-3), ".jpg");
                    }
                }
                o.notLoaded = [];
                o.addImage = function(t) {
                    o.notLoaded.push(t);
                };
                o.loaded = function(e) {
                    var n = o.notLoaded;
                    for(var u = 0; u < n.length; u++){
                        if (n[u] === e) {
                            n.splice(u, 1);
                            for(var s = 0; s < i.length; s++){
                                var f = i[s].substr(i[s].lastIndexOf("/"));
                                if (e.src.lastIndexOf(f) !== -1) {
                                    o[s] = {
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
                                o[0].tags = t;
                                r(o);
                            })["catch"](function(t) {
                                console.log(t);
                                r(o);
                            });
                        } else {
                            r(o);
                        }
                    }
                };
                for(u = 0; u < i.length; u++){
                    s = new Image();
                    o.addImage(s);
                    el(s, o);
                    s.src = i[u];
                }
            };
            function el(t, r) {
                t.onload = function() {
                    r.loaded(this);
                };
            }
            var ev = ec;
            var e$ = {
                createVideoStream: function t(r) {
                    var e = null;
                    var n = [
                        "canrecord",
                        "ended"
                    ];
                    var a = {};
                    var i;
                    var o;
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
                    function f() {
                        var t, n;
                        var a = r.videoWidth;
                        var u = r.videoHeight;
                        i = (t = e) !== null && t !== void 0 && t.size ? a / u > 1 ? e.size : Math.floor((a / u) * e.size) : a;
                        o = (n = e) !== null && n !== void 0 && n.size ? a / u > 1 ? Math.floor((u / a) * e.size) : e.size : u;
                        s.x = i;
                        s.y = o;
                    }
                    var c = {
                        getRealWidth: function t() {
                            return r.videoWidth;
                        },
                        getRealHeight: function t() {
                            return r.videoHeight;
                        },
                        getWidth: function t() {
                            return i;
                        },
                        getHeight: function t() {
                            return o;
                        },
                        setWidth: function t(r) {
                            i = r;
                        },
                        setHeight: function t(r) {
                            o = r;
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
                        addEventListener: function t(e, i, o) {
                            if (n.indexOf(e) !== -1) {
                                if (!a[e]) {
                                    a[e] = [];
                                }
                                a[e].push(i);
                            } else {
                                r.addEventListener(e, i, o);
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
                            var i = a[r];
                            if (r === "canrecord") {
                                f();
                            }
                            if (i && i.length > 0) {
                                for(n = 0; n < i.length; n++){
                                    i[n].apply(c, e);
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
                    return c;
                },
                createLiveStream: function t(r) {
                    if (r) {
                        r.setAttribute("autoplay", "true");
                    }
                    var e = e$.createVideoStream(r);
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
                    var i = true;
                    var o = false;
                    var u = null;
                    var s = 0;
                    var f = 1;
                    var c = null;
                    var l = false;
                    var v;
                    var $;
                    var h = [
                        "canrecord",
                        "ended"
                    ];
                    var _ = {};
                    var p = {
                        x: 0,
                        y: 0,
                        type: "Point"
                    };
                    var d = {
                        x: 0,
                        y: 0,
                        type: "XYSize"
                    };
                    function x() {
                        var t;
                        o = false;
                        ev.load(c, function(t) {
                            var i, s;
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
                            v = (i = r) !== null && i !== void 0 && i.size ? e / n > 1 ? r.size : Math.floor((e / n) * r.size) : e;
                            $ = (s = r) !== null && s !== void 0 && s.size ? e / n > 1 ? Math.floor((n / e) * r.size) : r.size : n;
                            d.x = v;
                            d.y = $;
                            o = true;
                            a = 0;
                            setTimeout(function() {
                                g("canrecord", []);
                            }, 0);
                        }, f, s, (t = r) === null || t === void 0 ? void 0 : t.sequence);
                    }
                    function g(t, r) {
                        var e;
                        var n = _[t];
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
                            return $;
                        },
                        setWidth: function t(r) {
                            v = r;
                        },
                        setHeight: function t(r) {
                            $ = r;
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
                                c = e.src;
                                s = 1;
                            } else {
                                c = e.src;
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
                            i = true;
                        },
                        play: function t() {
                            i = false;
                        },
                        setCurrentTime: function t(r) {
                            a = r;
                        },
                        addEventListener: function t(r, e) {
                            if (h.indexOf(r) !== -1) {
                                if (!_[r]) {
                                    _[r] = [];
                                }
                                _[r].push(e);
                            }
                        },
                        clearEventHandlers: function t() {
                            Object.keys(_).forEach(function(t) {
                                return delete _[t];
                            });
                        },
                        setTopRight: function t(r) {
                            p.x = r.x;
                            p.y = r.y;
                        },
                        getTopRight: function t() {
                            return p;
                        },
                        setCanvasSize: function t(r) {
                            d.x = r.x;
                            d.y = r.y;
                        },
                        getCanvasSize: function t() {
                            return d;
                        },
                        getFrame: function t() {
                            var r;
                            if (!o) {
                                return null;
                            }
                            if (!i) {
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
            var eh = e$;
            var e_ = e(8);
            var ep = Math.PI / 180;
            function ed(t, r) {
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
                var a = Object(e_["h"])(t.getRealWidth(), t.getRealHeight());
                var i = t.getCanvasSize();
                var o = Object(e_["h"])(t.getWidth(), t.getHeight());
                var u = t.getTopRight();
                var s = u.x;
                var f = u.y;
                var c;
                var l = null;
                var v = null;
                c = r || document.createElement("canvas");
                c.width = i.x;
                c.height = i.y;
                l = c.getContext("2d");
                v = new Uint8Array(o.x * o.y);
                if (true) {
                    console.log("FrameGrabber", JSON.stringify({
                        size: o,
                        topRight: u,
                        videoSize: a,
                        canvasSize: i
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
                    var $;
                    if (a) {
                        ed(c, i);
                        if (n.type === "ImageStream") {
                            a = e.img;
                            if (e.tags && e.tags.orientation) {
                                switch(e.tags.orientation){
                                    case 6:
                                        u = 90 * ep;
                                        break;
                                    case 8:
                                        u = -90 * ep;
                                        break;
                                }
                            }
                        }
                        if (u !== 0) {
                            l.translate(i.x / 2, i.y / 2);
                            l.rotate(u);
                            l.drawImage(a, -i.y / 2, -i.x / 2, i.y, i.x);
                            l.rotate(-u);
                            l.translate(-i.x / 2, -i.y / 2);
                        } else {
                            l.drawImage(a, 0, 0, i.x, i.y);
                        }
                        $ = l.getImageData(s, f, o.x, o.y).data;
                        if (r) {
                            Object(e_["e"])($, o, v);
                        } else {
                            Object(e_["c"])($, v, n);
                        }
                        return true;
                    }
                    return false;
                };
                e.getSize = function() {
                    return o;
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
            var em = [];
            function e8(t) {
                var r;
                if (em.length) {
                    r = em.filter(function(t) {
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
                        var i = t.data.config;
                        i.numOfWorkers = 0;
                        e = new r.ImageWrapper({
                            x: t.data.size.x,
                            y: t.data.size.y
                        }, new Uint8Array(t.data.imageData));
                        r.init(i, a, e);
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
            function e2(t, r, e) {
                var n = e1();
                var a = new Worker(n);
                var i = {
                    worker: a,
                    imageData: new Uint8Array(r.getWidth() * r.getHeight()),
                    busy: true
                };
                i.worker.onmessage = function(t) {
                    if (t.data.event === "initialized") {
                        URL.revokeObjectURL(n);
                        i.busy = false;
                        i.imageData = new Uint8Array(t.data.imageData);
                        if (true) {
                            console.log("Worker initialized");
                        }
                        e(i);
                    } else if (t.data.event === "processed") {
                        i.imageData = new Uint8Array(t.data.imageData);
                        i.busy = false;
                    } else if (t.data.event === "error") {
                        if (true) {
                            console.log("Worker error: " + t.data.message);
                        }
                    }
                };
                i.worker.postMessage({
                    cmd: "init",
                    size: {
                        x: r.getWidth(),
                        y: r.getHeight()
                    },
                    imageData: i.imageData,
                    config: ew(t)
                }, [
                    i.imageData.buffer
                ]);
            }
            function eC(t, r, e, n) {
                var a = t - em.length;
                if (a === 0 && n) {
                    n();
                } else if (a < 0) {
                    var i = em.slice(a);
                    i.forEach(function(t) {
                        t.worker.terminate();
                        if (true) {
                            console.log("Worker terminated!");
                        }
                    });
                    em = em.slice(0, a);
                    if (n) {
                        n();
                    }
                } else {
                    var o = function r(e) {
                        em.push(e);
                        if (em.length >= t && n) {
                            n();
                        }
                    };
                    if (r) {
                        for(var u = 0; u < a; u++){
                            e2(r, e, o);
                        }
                    }
                }
            }
            function ek(t) {
                em.forEach(function(r) {
                    return r.worker.postMessage({
                        cmd: "setReaders",
                        readers: t
                    });
                });
            }
            function eE(t, r) {
                em.forEach(function(e) {
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
            function e3(t, r, e) {
                t[0].x += r;
                t[0].y += e;
                t[1].x += r;
                t[1].y += e;
            }
            var eR = (function() {
                function t() {
                    var r = this;
                    _()(this, t);
                    O()(this, "context", new rV());
                    O()(this, "canRecord", function(t) {
                        var e;
                        if (!r.context.config) {
                            return;
                        }
                        rX["a"].checkImageConstraints(r.context.inputStream, (e = r.context.config) === null || e === void 0 ? void 0 : e.locator);
                        r.initCanvas();
                        r.context.framegrabber = eg.create(r.context.inputStream, r.context.canvasContainer.dom.image);
                        if (r.context.config.numOfWorkers === undefined) {
                            r.context.config.numOfWorkers = 0;
                        }
                        eC(r.context.config.numOfWorkers, r.context.config, r.context.inputStream, function() {
                            var e;
                            if (((e = r.context.config) === null || e === void 0 ? void 0 : e.numOfWorkers) === 0) {
                                r.initializeData();
                            }
                            r.ready(t);
                        });
                    });
                    O()(this, "update", function() {
                        if (r.context.onUIThread) {
                            var t = e8(r.context.framegrabber);
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
                d()(t, [
                    {
                        key: "initBuffers",
                        value: function t(r) {
                            if (!this.context.config) {
                                return;
                            }
                            var e = rG(this.context.inputStream, r, this.context.config.locator), n = e.inputImageWrapper, a = e.boxSize;
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
                            this.context.decoder = rh.create(this.context.config.decoder, this.context.inputImageWrapper);
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
                            var i = eO(n, this.getViewPort(), eh), o = i.video, u = i.inputStream;
                            if (n === "LiveStream" && o) {
                                rA.request(o, a).then(function() {
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
                            return (r = this.context.config) !== null && r !== void 0 && r.locate ? rX["a"].locate() : [
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
                            var i = n.y;
                            if (a === 0 && i === 0) {
                                return;
                            }
                            if (r.barcodes) {
                                r.barcodes.forEach(function(t) {
                                    return e.transformResult(t);
                                });
                            }
                            if (r.line && r.line.length === 2) {
                                e3(r.line, a, i);
                            }
                            if (r.box) {
                                eS(r.box, a, i);
                            }
                            if (r.boxes && r.boxes.length > 0) {
                                for(var o = 0; o < r.boxes.length; o++){
                                    eS(r.boxes[o], a, i);
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
                            r_.publish("processed", n);
                            if (this.hasCodeResult(r)) {
                                r_.publish("detected", n);
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
                                    var i;
                                    this.publishResult(a, (i = this.context.inputImageWrapper) === null || i === void 0 ? void 0 : i.data);
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
                            var i = this.context;
                            var o = function t(r) {
                                n = n || r;
                                if (!i.stopped) {
                                    if (r >= n) {
                                        n += a;
                                        e.update();
                                    }
                                    window.requestAnimationFrame(t);
                                }
                            };
                            o(performance.now());
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
                            var t = rd()(rg.a.mark(function t() {
                                var r;
                                return rg.a.wrap(function t(e) {
                                    while(1){
                                        switch((e.prev = e.next)){
                                            case 0:
                                                this.context.stopped = true;
                                                eC(0);
                                                if (!((r = this.context.config) !== null && r !== void 0 && r.inputStream && this.context.config.inputStream.type === "LiveStream")) {
                                                    e.next = 6;
                                                    break;
                                                }
                                                e.next = 5;
                                                return rA.release();
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
                            ek(r);
                        }
                    },
                    {
                        key: "registerReader",
                        value: function t(r, e) {
                            rh.registerReader(r, e);
                            if (this.context.decoder) {
                                this.context.decoder.registerReader(r, e);
                            }
                            eE(r, e);
                        }
                    }, 
                ]);
                return t;
            })();
            var eD = new eR();
            var e4 = eD.context;
            var eP = {
                init: function t(r, e, n) {
                    var a = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : eD;
                    var i;
                    if (!e) {
                        i = new Promise(function(t, r) {
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
                    return i;
                },
                start: function t() {
                    return eD.start();
                },
                stop: function t() {
                    return eD.stop();
                },
                pause: function t() {
                    e4.stopped = true;
                },
                onDetected: function t(r) {
                    if (!r || (typeof r !== "function" && (i()(r) !== "object" || !r.callback))) {
                        console.trace("* warning: Quagga.onDetected called with invalid callback, ignoring");
                        return;
                    }
                    r_.subscribe("detected", r);
                },
                offDetected: function t(r) {
                    r_.unsubscribe("detected", r);
                },
                onProcessed: function t(r) {
                    if (!r || (typeof r !== "function" && (i()(r) !== "object" || !r.callback))) {
                        console.trace("* warning: Quagga.onProcessed called with invalid callback, ignoring");
                        return;
                    }
                    r_.subscribe("processed", r);
                },
                offProcessed: function t(r) {
                    r_.unsubscribe("processed", r);
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
                        e4.resultCollector = r;
                    }
                },
                get canvas () {
                    return e4.canvasContainer;
                },
                decodeSingle: function t(r, e) {
                    var n = this;
                    var a = new eR();
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
                    return new Promise(function(t, i) {
                        try {
                            n.init(r, function() {
                                r_.once("processed", function(r) {
                                    a.stop();
                                    if (e) {
                                        e.call(null, r);
                                    }
                                    t(r);
                                }, true);
                                a.start();
                            }, null, a);
                        } catch (o) {
                            i(o);
                        }
                    });
                },
                get default () {
                    return eP;
                },
                Readers: n,
                CameraAccess: rA,
                ImageDebug: $["a"],
                ImageWrapper: f["a"],
                ResultCollector: r7
            };
            var ez = (r["default"] = eP);
        }
    ])["default"];
});
