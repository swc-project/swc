(function c(b, a) {
    if (typeof exports === "object" && typeof module === "object") module.exports = a();
    else if (typeof define === "function" && define.amd) define([], a);
    else if (typeof exports === "object") exports["Quagga"] = a();
    else b["Quagga"] = a();
})(window, function() {
    return (function(b) {
        var c = {};
        function a(d) {
            if (c[d]) {
                return c[d].exports;
            }
            var e = (c[d] = {
                i: d,
                l: false,
                exports: {}
            });
            b[d].call(e.exports, e, e.exports, a);
            e.l = true;
            return e.exports;
        }
        a.m = b;
        a.c = c;
        a.d = function(b, c, d) {
            if (!a.o(b, c)) {
                Object.defineProperty(b, c, {
                    enumerable: true,
                    get: d
                });
            }
        };
        a.r = function(a) {
            if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
                Object.defineProperty(a, Symbol.toStringTag, {
                    value: "Module"
                });
            }
            Object.defineProperty(a, "__esModule", {
                value: true
            });
        };
        a.t = function(b, c) {
            if (c & 1) b = a(b);
            if (c & 8) return b;
            if (c & 4 && typeof b === "object" && b && b.__esModule) return b;
            var d = Object.create(null);
            a.r(d);
            Object.defineProperty(d, "default", {
                enumerable: true,
                value: b
            });
            if (c & 2 && typeof b != "string") for(var e in b)a.d(d, e, function(a) {
                return b[a];
            }.bind(null, e));
            return d;
        };
        a.n = function(c) {
            var b = c && c.__esModule ? function a() {
                return c["default"];
            } : function a() {
                return c;
            };
            a.d(b, "a", b);
            return b;
        };
        a.o = function(a, b) {
            return Object.prototype.hasOwnProperty.call(a, b);
        };
        a.p = "/";
        return a((a.s = 89));
    })([
        function(a, c) {
            function b(a, b, c) {
                if (b in a) {
                    Object.defineProperty(a, b, {
                        value: c,
                        enumerable: true,
                        configurable: true,
                        writable: true
                    });
                } else {
                    a[b] = c;
                }
                return a;
            }
            a.exports = b;
            (a.exports["default"] = a.exports), (a.exports.__esModule = true);
        },
        function(a, c) {
            function b(a) {
                if (a === void 0) {
                    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                }
                return a;
            }
            a.exports = b;
            (a.exports["default"] = a.exports), (a.exports.__esModule = true);
        },
        function(a, c) {
            function b(c) {
                a.exports = b = Object.setPrototypeOf ? Object.getPrototypeOf : function b(a) {
                    return a.__proto__ || Object.getPrototypeOf(a);
                };
                (a.exports["default"] = a.exports), (a.exports.__esModule = true);
                return b(c);
            }
            a.exports = b;
            (a.exports["default"] = a.exports), (a.exports.__esModule = true);
        },
        function(a, c) {
            function b(a, b) {
                if (!(a instanceof b)) {
                    throw new TypeError("Cannot call a class as a function");
                }
            }
            a.exports = b;
            (a.exports["default"] = a.exports), (a.exports.__esModule = true);
        },
        function(a, c) {
            function d(d, c) {
                for(var b = 0; b < c.length; b++){
                    var a = c[b];
                    a.enumerable = a.enumerable || false;
                    a.configurable = true;
                    if ("value" in a) a.writable = true;
                    Object.defineProperty(d, a.key, a);
                }
            }
            function b(a, b, c) {
                if (b) d(a.prototype, b);
                if (c) d(a, c);
                return a;
            }
            a.exports = b;
            (a.exports["default"] = a.exports), (a.exports.__esModule = true);
        },
        function(a, d, b) {
            var e = b(19)["default"];
            var f = b(1);
            function c(b, a) {
                if (a && (e(a) === "object" || typeof a === "function")) {
                    return a;
                } else if (a !== void 0) {
                    throw new TypeError("Derived constructors may only return object or undefined");
                }
                return f(b);
            }
            a.exports = c;
            (a.exports["default"] = a.exports), (a.exports.__esModule = true);
        },
        function(a, d, b) {
            var e = b(41);
            function c(b, a) {
                if (typeof a !== "function" && a !== null) {
                    throw new TypeError("Super expression must either be null or a function");
                }
                b.prototype = Object.create(a && a.prototype, {
                    constructor: {
                        value: b,
                        writable: true,
                        configurable: true
                    }
                });
                if (a) e(b, a);
            }
            a.exports = c;
            (a.exports["default"] = a.exports), (a.exports.__esModule = true);
        },
        function(b, c, a) {
            b.exports = {
                EPSILON: a(62),
                create: a(63),
                clone: a(156),
                fromValues: a(157),
                copy: a(158),
                set: a(159),
                equals: a(160),
                exactEquals: a(161),
                add: a(162),
                subtract: a(64),
                sub: a(163),
                multiply: a(65),
                mul: a(164),
                divide: a(66),
                div: a(165),
                inverse: a(166),
                min: a(167),
                max: a(168),
                rotate: a(169),
                floor: a(170),
                ceil: a(171),
                round: a(172),
                scale: a(173),
                scaleAndAdd: a(174),
                distance: a(67),
                dist: a(175),
                squaredDistance: a(68),
                sqrDist: a(176),
                length: a(69),
                len: a(177),
                squaredLength: a(70),
                sqrLen: a(178),
                negate: a(179),
                normalize: a(180),
                dot: a(181),
                cross: a(182),
                lerp: a(183),
                random: a(184),
                transformMat2: a(185),
                transformMat2d: a(186),
                transformMat3: a(187),
                transformMat4: a(188),
                forEach: a(189),
                limit: a(190)
            };
        },
        function(e, b, a) {
            "use strict";
            a.d(b, "h", function() {
                return k;
            });
            a.d(b, "i", function() {
                return r;
            });
            a.d(b, "b", function() {
                return t;
            });
            a.d(b, "j", function() {
                return C;
            });
            a.d(b, "e", function() {
                return F;
            });
            a.d(b, "c", function() {
                return G;
            });
            a.d(b, "f", function() {
                return I;
            });
            a.d(b, "g", function() {
                return J;
            });
            a.d(b, "a", function() {
                return M;
            });
            a.d(b, "d", function() {
                return P;
            });
            var c = a(7);
            var d = a(84);
            var f = {
                clone: c["clone"],
                dot: c["dot"]
            };
            var g = {
                create: function b(c, d) {
                    var e = [];
                    var g = {
                        rad: 0,
                        vec: f.clone([
                            0,
                            0
                        ])
                    };
                    var h = {};
                    function i(a) {
                        h[a.id] = a;
                        e.push(a);
                    }
                    function j() {
                        var a;
                        var b = 0;
                        for(a = 0; a < e.length; a++){
                            b += e[a].rad;
                        }
                        g.rad = b / e.length;
                        g.vec = f.clone([
                            Math.cos(g.rad),
                            Math.sin(g.rad), 
                        ]);
                    }
                    function a() {
                        i(c);
                        j();
                    }
                    a();
                    return {
                        add: function b(a) {
                            if (!h[a.id]) {
                                i(a);
                                j();
                            }
                        },
                        fits: function c(a) {
                            var b = Math.abs(f.dot(a.point.vec, g.vec));
                            if (b > d) {
                                return true;
                            }
                            return false;
                        },
                        getPoints: function a() {
                            return e;
                        },
                        getCenter: function a() {
                            return g;
                        }
                    };
                },
                createPoint: function d(a, b, c) {
                    return {
                        rad: a[c],
                        point: a,
                        id: b
                    };
                }
            };
            var h = a(10);
            var i = {
                clone: c["clone"]
            };
            var j = {
                clone: d["clone"]
            };
            function k(a, b) {
                var c = {
                    x: a,
                    y: b,
                    toVec2: function a() {
                        return i.clone([
                            this.x,
                            this.y
                        ]);
                    },
                    toVec3: function a() {
                        return j.clone([
                            this.x,
                            this.y,
                            1
                        ]);
                    },
                    round: function a() {
                        this.x = this.x > 0.0 ? Math.floor(this.x + 0.5) : Math.floor(this.x - 0.5);
                        this.y = this.y > 0.0 ? Math.floor(this.y + 0.5) : Math.floor(this.y - 0.5);
                        return this;
                    }
                };
                return c;
            }
            function l(h, m) {
                var i = h.data;
                var b = h.size.x;
                var l = h.size.y;
                var e = m.data;
                var f = 0;
                var c = 0;
                var d = 0;
                var j = 0;
                var k = 0;
                var g;
                var a;
                d = b;
                f = 0;
                for(a = 1; a < l; a++){
                    f += i[c];
                    e[d] += f;
                    c += b;
                    d += b;
                }
                c = 0;
                d = 1;
                f = 0;
                for(g = 1; g < b; g++){
                    f += i[c];
                    e[d] += f;
                    c++;
                    d++;
                }
                for(a = 1; a < l; a++){
                    c = a * b + 1;
                    d = (a - 1) * b + 1;
                    j = a * b;
                    k = (a - 1) * b;
                    for(g = 1; g < b; g++){
                        e[c] += i[c] + e[d] + e[j] - e[k];
                        c++;
                        d++;
                        j++;
                        k++;
                    }
                }
            }
            function m(f, i) {
                var h = f.data;
                var a = f.size.x;
                var j = f.size.y;
                var g = i.data;
                var b = 0;
                for(var e = 0; e < a; e++){
                    b += h[e];
                    g[e] = b;
                }
                for(var c = 1; c < j; c++){
                    b = 0;
                    for(var d = 0; d < a; d++){
                        b += h[c * a + d];
                        g[c * a + d] = b + g[(c - 1) * a + d];
                    }
                }
            }
            function n(c, e, a) {
                if (!a) {
                    a = c;
                }
                var d = c.data;
                var b = d.length;
                var f = a.data;
                while(b--){
                    f[b] = d[b] < e ? 1 : 0;
                }
            }
            function o(e, a) {
                if (!a) {
                    a = 8;
                }
                var b = e.data;
                var c = b.length;
                var f = 8 - a;
                var g = 1 << a;
                var d = new Int32Array(g);
                while(c--){
                    d[b[c] >> f]++;
                }
                return d;
            }
            function p(a) {
                var b;
                var f = a.length;
                var e = a[0];
                var c = a[1];
                var d;
                for(b = 1; b < f - 1; b++){
                    d = a[b + 1];
                    a[b - 1] = (c * 2 - e - d) & 255;
                    e = c;
                    c = d;
                }
                return a;
            }
            function q(e) {
                var a = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 8;
                var f;
                var b = 8 - a;
                function g(c, d) {
                    var b = 0;
                    for(var a = c; a <= d; a++){
                        b += f[a];
                    }
                    return b;
                }
                function i(c, d) {
                    var b = 0;
                    for(var a = c; a <= d; a++){
                        b += a * f[a];
                    }
                    return b;
                }
                function c() {
                    var m = [
                        0
                    ];
                    var d;
                    var j;
                    var c;
                    var n;
                    var p;
                    var k;
                    var l = (1 << a) - 1;
                    f = o(e, a);
                    for(var b = 1; b < l; b++){
                        d = g(0, b);
                        j = g(b + 1, l);
                        c = d * j;
                        if (c === 0) {
                            c = 1;
                        }
                        n = i(0, b) * j;
                        p = i(b + 1, l) * d;
                        k = n - p;
                        m[b] = (k * k) / c;
                    }
                    return h["a"].maxIndex(m);
                }
                var d = c();
                return d << b;
            }
            function r(a, c) {
                var b = q(a);
                n(a, b, c);
                return b;
            }
            function s(e, j, h) {
                m(e, j);
                if (!h) {
                    h = e;
                }
                var r = e.data;
                var f = h.data;
                var d = e.size.x;
                var i = e.size.y;
                var g = j.data;
                var k = 0;
                var a;
                var b;
                var c = 3;
                var l;
                var n;
                var o;
                var p;
                var q;
                var s = (c * 2 + 1) * (c * 2 + 1);
                for(a = 0; a <= c; a++){
                    for(b = 0; b < d; b++){
                        f[a * d + b] = 0;
                        f[(i - 1 - a) * d + b] = 0;
                    }
                }
                for(a = c; a < i - c; a++){
                    for(b = 0; b <= c; b++){
                        f[a * d + b] = 0;
                        f[a * d + (d - 1 - b)] = 0;
                    }
                }
                for(a = c + 1; a < i - c - 1; a++){
                    for(b = c + 1; b < d - c; b++){
                        l = g[(a - c - 1) * d + (b - c - 1)];
                        n = g[(a - c - 1) * d + (b + c)];
                        o = g[(a + c) * d + (b - c - 1)];
                        p = g[(a + c) * d + (b + c)];
                        k = p - o - n + l;
                        q = k / s;
                        f[a * d + b] = r[a * d + b] > q + 5 ? 0 : 1;
                    }
                }
            }
            function t(d, f, b) {
                var a;
                var i;
                var j;
                var c;
                var e = [];
                if (!b) {
                    b = "rad";
                }
                function h(a) {
                    var b = false;
                    for(i = 0; i < e.length; i++){
                        j = e[i];
                        if (j.fits(a)) {
                            j.add(a);
                            b = true;
                        }
                    }
                    return b;
                }
                for(a = 0; a < d.length; a++){
                    c = g.createPoint(d[a], a, b);
                    if (!h(c)) {
                        e.push(g.create(c, f));
                    }
                }
                return e;
            }
            var u = {
                trace: function e(c, i) {
                    var f;
                    var h = 10;
                    var b = [];
                    var g = [];
                    var d = 0;
                    var a = 0;
                    function e(e, f) {
                        var b;
                        var a;
                        var g;
                        var k = 1;
                        var l = Math.abs(i[1] / 10);
                        var h = false;
                        function j(a, b) {
                            if (a.x > b.x - k && a.x < b.x + k && a.y > b.y - l && a.y < b.y + l) {
                                return true;
                            }
                            return false;
                        }
                        var d = c[e];
                        if (f) {
                            g = {
                                x: d.x + i[0],
                                y: d.y + i[1]
                            };
                        } else {
                            g = {
                                x: d.x - i[0],
                                y: d.y - i[1]
                            };
                        }
                        a = f ? e + 1 : e - 1;
                        b = c[a];
                        while(b && (h = j(b, g)) !== true && Math.abs(b.y - d.y) < i[1]){
                            a = f ? a + 1 : a - 1;
                            b = c[a];
                        }
                        return h ? a : null;
                    }
                    for(f = 0; f < h; f++){
                        d = Math.floor(Math.random() * c.length);
                        b = [];
                        a = d;
                        b.push(c[a]);
                        while((a = e(a, true)) !== null){
                            b.push(c[a]);
                        }
                        if (d > 0) {
                            a = d;
                            while((a = e(a, false)) !== null){
                                b.push(c[a]);
                            }
                        }
                        if (b.length > g.length) {
                            g = b;
                        }
                    }
                    return g;
                }
            };
            var v = 1;
            var w = 2;
            function x(e, k) {
                var a;
                var b;
                var d = e.data;
                var l = k.data;
                var m = e.size.y;
                var c = e.size.x;
                var j;
                var f;
                var g;
                var h;
                var i;
                for(a = 1; a < m - 1; a++){
                    for(b = 1; b < c - 1; b++){
                        f = a - 1;
                        g = a + 1;
                        h = b - 1;
                        i = b + 1;
                        j = d[f * c + h] + d[f * c + i] + d[a * c + b] + d[g * c + h] + d[g * c + i];
                        l[a * c + b] = j > 0 ? 1 : 0;
                    }
                }
            }
            function y(e, k) {
                var a;
                var b;
                var d = e.data;
                var l = k.data;
                var m = e.size.y;
                var c = e.size.x;
                var j;
                var f;
                var g;
                var h;
                var i;
                for(a = 1; a < m - 1; a++){
                    for(b = 1; b < c - 1; b++){
                        f = a - 1;
                        g = a + 1;
                        h = b - 1;
                        i = b + 1;
                        j = d[f * c + h] + d[f * c + i] + d[a * c + b] + d[g * c + h] + d[g * c + i];
                        l[a * c + b] = j === 5 ? 1 : 0;
                    }
                }
            }
            function z(b, d, c) {
                if (!c) {
                    c = b;
                }
                var a = b.data.length;
                var e = b.data;
                var f = d.data;
                var g = c.data;
                while(a--){
                    g[a] = e[a] - f[a];
                }
            }
            function A(b, d, c) {
                if (!c) {
                    c = b;
                }
                var a = b.data.length;
                var e = b.data;
                var f = d.data;
                var g = c.data;
                while(a--){
                    g[a] = e[a] || f[a];
                }
            }
            function B(a) {
                var b = a.data.length;
                var d = a.data;
                var c = 0;
                while(b--){
                    c += d[b];
                }
                return c;
            }
            function C(e, h, j) {
                var a;
                var i = 0;
                var d = 0;
                var c = [];
                var f;
                var g;
                var b;
                for(a = 0; a < h; a++){
                    c[a] = {
                        score: 0,
                        item: null
                    };
                }
                for(a = 0; a < e.length; a++){
                    f = j.apply(this, [
                        e[a]
                    ]);
                    if (f > d) {
                        g = c[i];
                        g.score = f;
                        g.item = e[a];
                        d = Number.MAX_VALUE;
                        for(b = 0; b < h; b++){
                            if (c[b].score < d) {
                                d = c[b].score;
                                i = b;
                            }
                        }
                    }
                }
                return c;
            }
            function D(a, b, c, d) {
                c.drawImage(a, b, 0, a.width, a.height);
                var e = c.getImageData(b, 0, a.width, a.height).data;
                G(e, d);
            }
            function E(c, a, b, d) {
                var e = c.getImageData(b.x, b.y, a.x, a.y).data;
                G(e, d);
            }
            function F(a, d, h) {
                var c = 0;
                var b = d.x;
                var i = Math.floor(a.length / 4);
                var j = d.x / 2;
                var f = 0;
                var g = d.x;
                var e;
                while(b < i){
                    for(e = 0; e < j; e++){
                        h[f] = (0.299 * a[c * 4 + 0] + 0.587 * a[c * 4 + 1] + 0.114 * a[c * 4 + 2] + (0.299 * a[(c + 1) * 4 + 0] + 0.587 * a[(c + 1) * 4 + 1] + 0.114 * a[(c + 1) * 4 + 2]) + (0.299 * a[b * 4 + 0] + 0.587 * a[b * 4 + 1] + 0.114 * a[b * 4 + 2]) + (0.299 * a[(b + 1) * 4 + 0] + 0.587 * a[(b + 1) * 4 + 1] + 0.114 * a[(b + 1) * 4 + 2])) / 4;
                        f++;
                        c += 2;
                        b += 2;
                    }
                    c += g;
                    b += g;
                }
            }
            function G(b, d, e) {
                var f = (b.length / 4) | 0;
                var g = e && e.singleChannel === true;
                if (g) {
                    for(var c = 0; c < f; c++){
                        d[c] = b[c * 4 + 0];
                    }
                } else {
                    for(var a = 0; a < f; a++){
                        d[a] = 0.299 * b[a * 4 + 0] + 0.587 * b[a * 4 + 1] + 0.114 * b[a * 4 + 2];
                    }
                }
            }
            function H(b, c) {
                var d = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : document && document.createElement("canvas");
                var a = new Image();
                a.callback = c;
                a.onload = function() {
                    d.width = this.width;
                    d.height = this.height;
                    var a = d.getContext("2d");
                    a.drawImage(this, 0, 0);
                    var b = new Uint8Array(this.width * this.height);
                    a.drawImage(this, 0, 0);
                    var c = a.getImageData(0, 0, this.width, this.height), e = c.data;
                    G(e, b);
                    this.callback(b, {
                        x: this.width,
                        y: this.height
                    }, this);
                };
                a.src = b;
            }
            function I(e, h) {
                var a = e.data;
                var c = e.size.x;
                var i = h.data;
                var d = 0;
                var b = c;
                var j = a.length;
                var k = c / 2;
                var f = 0;
                while(b < j){
                    for(var g = 0; g < k; g++){
                        i[f] = Math.floor((a[d] + a[d + 1] + a[b] + a[b + 1]) / 4);
                        f++;
                        d += 2;
                        b += 2;
                    }
                    d += c;
                    b += c;
                }
            }
            function J(h) {
                var g = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [
                    0,
                    0,
                    0
                ];
                var b = h[0];
                var k = h[1];
                var j = h[2];
                var a = j * k;
                var c = a * (1 - Math.abs(((b / 60) % 2) - 1));
                var i = j - a;
                var d = 0;
                var e = 0;
                var f = 0;
                if (b < 60) {
                    d = a;
                    e = c;
                } else if (b < 120) {
                    d = c;
                    e = a;
                } else if (b < 180) {
                    e = a;
                    f = c;
                } else if (b < 240) {
                    e = c;
                    f = a;
                } else if (b < 300) {
                    d = c;
                    f = a;
                } else if (b < 360) {
                    d = a;
                    f = c;
                }
                g[0] = ((d + i) * 255) | 0;
                g[1] = ((e + i) * 255) | 0;
                g[2] = ((f + i) * 255) | 0;
                return g;
            }
            function K(b) {
                var c = [];
                var d = [];
                for(var a = 1; a < Math.sqrt(b) + 1; a++){
                    if (b % a === 0) {
                        d.push(a);
                        if (a !== b / a) {
                            c.unshift(Math.floor(b / a));
                        }
                    }
                }
                return d.concat(c);
            }
            function L(c, d) {
                var a = 0;
                var b = 0;
                var e = [];
                while(a < c.length && b < d.length){
                    if (c[a] === d[b]) {
                        e.push(c[a]);
                        a++;
                        b++;
                    } else if (c[a] > d[b]) {
                        b++;
                    } else {
                        a++;
                    }
                }
                return e;
            }
            function M(g, b) {
                var h = K(b.x);
                var i = K(b.y);
                var d = Math.max(b.x, b.y);
                var j = L(h, i);
                var k = [
                    8,
                    10,
                    15,
                    20,
                    32,
                    60,
                    80
                ];
                var e = {
                    "x-small": 5,
                    small: 4,
                    medium: 3,
                    large: 2,
                    "x-large": 1
                };
                var l = e[g] || e.medium;
                var f = k[l];
                var m = Math.floor(d / f);
                var a;
                function c(a) {
                    var b = 0;
                    var c = a[Math.floor(a.length / 2)];
                    while(b < a.length - 1 && a[b] < m){
                        b++;
                    }
                    if (b > 0) {
                        if (Math.abs(a[b] - m) > Math.abs(a[b - 1] - m)) {
                            c = a[b - 1];
                        } else {
                            c = a[b];
                        }
                    }
                    if (m / c < k[l + 1] / k[l] && m / c > k[l - 1] / k[l]) {
                        return {
                            x: c,
                            y: c
                        };
                    }
                    return null;
                }
                a = c(j);
                if (!a) {
                    a = c(K(d));
                    if (!a) {
                        a = c(K(m * f));
                    }
                }
                return a;
            }
            function N(a) {
                var b = {
                    value: parseFloat(a),
                    unit: a.indexOf("%") === a.length - 1 ? "%" : "%"
                };
                return b;
            }
            var O = {
                top: function c(a, b) {
                    return a.unit === "%" ? Math.floor(b.height * (a.value / 100)) : null;
                },
                right: function c(a, b) {
                    return a.unit === "%" ? Math.floor(b.width - b.width * (a.value / 100)) : null;
                },
                bottom: function c(a, b) {
                    return a.unit === "%" ? Math.floor(b.height - b.height * (a.value / 100)) : null;
                },
                left: function c(a, b) {
                    return a.unit === "%" ? Math.floor(b.width * (a.value / 100)) : null;
                }
            };
            function P(b, c, d) {
                var e = {
                    width: b,
                    height: c
                };
                var a = Object.keys(d).reduce(function(b, a) {
                    var c = d[a];
                    var f = N(c);
                    var g = O[a](f, e);
                    b[a] = g;
                    return b;
                }, {});
                return {
                    sx: a.left,
                    sy: a.top,
                    sw: a.right - a.left,
                    sh: a.bottom - a.top
                };
            }
        },
        function(b, a, c) {
            "use strict";
            a["a"] = {
                drawRect: function e(c, d, a, b) {
                    a.strokeStyle = b.color;
                    a.fillStyle = b.color;
                    a.lineWidth = b.lineWidth || 1;
                    a.beginPath();
                    a.strokeRect(c.x, c.y, d.x, d.y);
                },
                drawPath: function f(b, c, a, e) {
                    a.strokeStyle = e.color;
                    a.fillStyle = e.color;
                    a.lineWidth = e.lineWidth;
                    a.beginPath();
                    a.moveTo(b[0][c.x], b[0][c.y]);
                    for(var d = 1; d < b.length; d++){
                        a.lineTo(b[d][c.x], b[d][c.y]);
                    }
                    a.closePath();
                    a.stroke();
                },
                drawImage: function i(e, f, g) {
                    var h = g.getImageData(0, 0, f.x, f.y);
                    var a = h.data;
                    var b = a.length;
                    var c = e.length;
                    if (b / c !== 4) {
                        return false;
                    }
                    while(c--){
                        var d = e[c];
                        a[--b] = 255;
                        a[--b] = d;
                        a[--b] = d;
                        a[--b] = d;
                    }
                    g.putImageData(h, 0, 0);
                    return true;
                }
            };
        },
        function(b, a, c) {
            "use strict";
            a["a"] = {
                init: function d(a, c) {
                    var b = a.length;
                    while(b--){
                        a[b] = c;
                    }
                },
                shuffle: function e(a) {
                    var b = a.length - 1;
                    for(b; b >= 0; b--){
                        var c = Math.floor(Math.random() * b);
                        var d = a[b];
                        a[b] = a[c];
                        a[c] = d;
                    }
                    return a;
                },
                toPointList: function c(a) {
                    var b = a.reduce(function(a, b) {
                        var c = "[".concat(b.join(","), "]");
                        a.push(c);
                        return a;
                    }, []);
                    return "[".concat(b.join(",\r\n"), "]");
                },
                threshold: function c(a, d, e) {
                    var b = a.reduce(function(b, c) {
                        if (e.apply(a, [
                            c
                        ]) >= d) {
                            b.push(c);
                        }
                        return b;
                    }, []);
                    return b;
                },
                maxIndex: function d(b) {
                    var c = 0;
                    for(var a = 0; a < b.length; a++){
                        if (b[a] > b[c]) {
                            c = a;
                        }
                    }
                    return c;
                },
                max: function a(c) {
                    var a = 0;
                    for(var b = 0; b < c.length; b++){
                        if (c[b] > a) {
                            a = c[b];
                        }
                    }
                    return a;
                },
                sum: function a(b) {
                    var c = b.length;
                    var a = 0;
                    while(c--){
                        a += b[c];
                    }
                    return a;
                }
            };
        },
        function(i, c, a) {
            "use strict";
            var d = a(83);
            var j = a.n(d);
            var e = a(3);
            var k = a.n(e);
            var f = a(4);
            var l = a.n(f);
            var g = a(0);
            var m = a.n(g);
            var b = a(7);
            var n = a.n(b);
            var o = a(8);
            var p = a(10);
            var q = {
                clone: b["clone"]
            };
            function r(a) {
                if (a < 0) {
                    throw new Error("expected positive number, received ".concat(a));
                }
            }
            var h = (function() {
                function a(b, c) {
                    var d = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Uint8Array;
                    var e = arguments.length > 3 ? arguments[3] : undefined;
                    k()(this, a);
                    m()(this, "data", void 0);
                    m()(this, "size", void 0);
                    m()(this, "indexMapping", void 0);
                    if (!c) {
                        this.data = new d(b.x * b.y);
                        if (e) {
                            p["a"].init(this.data, 0);
                        }
                    } else {
                        this.data = c;
                    }
                    this.size = b;
                }
                l()(a, [
                    {
                        key: "inImageWithBorder",
                        value: function c(a) {
                            var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
                            r(b);
                            return (a.x >= 0 && a.y >= 0 && a.x < this.size.x + b * 2 && a.y < this.size.y + b * 2);
                        }
                    },
                    {
                        key: "subImageAsCopy",
                        value: function h(d, a) {
                            r(a.x);
                            r(a.y);
                            var e = d.size, f = e.x, g = e.y;
                            for(var b = 0; b < f; b++){
                                for(var c = 0; c < g; c++){
                                    d.data[c * f + b] = this.data[(a.y + c) * this.size.x + a.x + b];
                                }
                            }
                            return d;
                        }
                    },
                    {
                        key: "get",
                        value: function c(a, b) {
                            return this.data[b * this.size.x + a];
                        }
                    },
                    {
                        key: "getSafe",
                        value: function e(c, d) {
                            if (!this.indexMapping) {
                                this.indexMapping = {
                                    x: [],
                                    y: []
                                };
                                for(var a = 0; a < this.size.x; a++){
                                    this.indexMapping.x[a] = a;
                                    this.indexMapping.x[a + this.size.x] = a;
                                }
                                for(var b = 0; b < this.size.y; b++){
                                    this.indexMapping.y[b] = b;
                                    this.indexMapping.y[b + this.size.y] = b;
                                }
                            }
                            return this.data[this.indexMapping.y[d + this.size.y] * this.size.x + this.indexMapping.x[c + this.size.x]];
                        }
                    },
                    {
                        key: "set",
                        value: function d(a, b, c) {
                            this.data[b * this.size.x + a] = c;
                            delete this.indexMapping;
                            return this;
                        }
                    },
                    {
                        key: "zeroBorder",
                        value: function f() {
                            var d = this.size, a = d.x, e = d.y;
                            for(var b = 0; b < a; b++){
                                this.data[b] = this.data[(e - 1) * a + b] = 0;
                            }
                            for(var c = 1; c < e - 1; c++){
                                this.data[c * a] = this.data[c * a + (a - 1)] = 0;
                            }
                            delete this.indexMapping;
                            return this;
                        }
                    },
                    {
                        key: "moments",
                        value: function v(i) {
                            var t = this.data;
                            var c;
                            var d;
                            var u = this.size.y;
                            var n = this.size.x;
                            var j;
                            var o;
                            var k = [];
                            var e;
                            var a;
                            var l;
                            var p;
                            var r;
                            var g;
                            var h;
                            var b;
                            var m = [];
                            var f = Math.PI;
                            var s = f / 4;
                            if (i <= 0) {
                                return m;
                            }
                            for(e = 0; e < i; e++){
                                k[e] = {
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
                            for(d = 0; d < u; d++){
                                o = d * d;
                                for(c = 0; c < n; c++){
                                    j = t[d * n + c];
                                    if (j > 0) {
                                        a = k[j - 1];
                                        a.m00 += 1;
                                        a.m01 += d;
                                        a.m10 += c;
                                        a.m11 += c * d;
                                        a.m02 += o;
                                        a.m20 += c * c;
                                    }
                                }
                            }
                            for(e = 0; e < i; e++){
                                a = k[e];
                                if (!isNaN(a.m00) && a.m00 !== 0) {
                                    g = a.m10 / a.m00;
                                    h = a.m01 / a.m00;
                                    l = a.m11 / a.m00 - g * h;
                                    p = a.m02 / a.m00 - h * h;
                                    r = a.m20 / a.m00 - g * g;
                                    b = (p - r) / (2 * l);
                                    b = 0.5 * Math.atan(b) + (l >= 0 ? s : -s) + f;
                                    a.theta = (((b * 180) / f + 90) % 180) - 90;
                                    if (a.theta < 0) {
                                        a.theta += 180;
                                    }
                                    a.rad = b > f ? b - f : b;
                                    a.vec = q.clone([
                                        Math.cos(b),
                                        Math.sin(b), 
                                    ]);
                                    m.push(a);
                                }
                            }
                            return m;
                        }
                    },
                    {
                        key: "getAsRGBA",
                        value: function g() {
                            var f = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1.0;
                            var a = new Uint8ClampedArray(4 * this.size.x * this.size.y);
                            for(var b = 0; b < this.size.y; b++){
                                for(var c = 0; c < this.size.x; c++){
                                    var d = b * this.size.x + c;
                                    var e = this.get(c, b) * f;
                                    a[d * 4 + 0] = e;
                                    a[d * 4 + 1] = e;
                                    a[d * 4 + 2] = e;
                                    a[d * 4 + 3] = 255;
                                }
                            }
                            return a;
                        }
                    },
                    {
                        key: "show",
                        value: function g(a) {
                            var d = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1.0;
                            var b = a.getContext("2d");
                            if (!b) {
                                throw new Error("Unable to get canvas context");
                            }
                            var c = b.getImageData(0, 0, a.width, a.height);
                            var e = this.getAsRGBA(d);
                            a.width = this.size.x;
                            a.height = this.size.y;
                            var f = new ImageData(e, c.width, c.height);
                            b.putImageData(f, 0, 0);
                        }
                    },
                    {
                        key: "overlay",
                        value: function s(l, e, a) {
                            var m = e < 0 || e > 360 ? 360 : e;
                            var b = [
                                0,
                                1,
                                1
                            ];
                            var n = [
                                0,
                                0,
                                0
                            ];
                            var p = [
                                255,
                                255,
                                255
                            ];
                            var q = [
                                0,
                                0,
                                0
                            ];
                            var i = [];
                            var f = l.getContext("2d");
                            if (!f) {
                                throw new Error("Unable to get canvas context");
                            }
                            var k = f.getImageData(a.x, a.y, this.size.x, this.size.y);
                            var c = k.data;
                            var g = this.data.length;
                            while(g--){
                                b[0] = this.data[g] * m;
                                i = b[0] <= 0 ? p : b[0] >= 360 ? q : Object(o["g"])(b, n);
                                var d = g * 4;
                                var r = i;
                                var h = j()(r, 3);
                                c[d] = h[0];
                                c[d + 1] = h[1];
                                c[d + 2] = h[2];
                                c[d + 3] = 255;
                            }
                            f.putImageData(k, a.x, a.y);
                        }
                    }, 
                ]);
                return a;
            })();
            c["a"] = h;
        },
        function(a, c, b) {
            a.exports = b(228);
        },
        function(a, d, b) {
            var e = b(227);
            function c(b, d, f) {
                if (typeof Reflect !== "undefined" && Reflect.get) {
                    a.exports = c = Reflect.get;
                    (a.exports["default"] = a.exports), (a.exports.__esModule = true);
                } else {
                    a.exports = c = function g(d, b, f) {
                        var c = e(d, b);
                        if (!c) return;
                        var a = Object.getOwnPropertyDescriptor(c, b);
                        if (a.get) {
                            return a.get.call(f);
                        }
                        return a.value;
                    };
                    (a.exports["default"] = a.exports), (a.exports.__esModule = true);
                }
                return c(b, d, f || b);
            }
            a.exports = c;
            (a.exports["default"] = a.exports), (a.exports.__esModule = true);
        },
        function(a, c) {
            function b(a) {
                var b = typeof a;
                return (a != null && (b == "object" || b == "function"));
            }
            a.exports = b;
        },
        function(a, c) {
            var b = Array.isArray;
            a.exports = b;
        },
        function(b, e, a) {
            var f = a(90), c = a(145);
            var d = c(function(a, b, c) {
                f(a, b, c);
            });
            b.exports = d;
        },
        function(a, f, b) {
            var c = b(45);
            var d = typeof self == "object" && self && self.Object === Object && self;
            var e = c || d || Function("return this")();
            a.exports = e;
        },
        function(a, c) {
            function b(a) {
                return a != null && typeof a == "object";
            }
            a.exports = b;
        },
        function(a, c) {
            function b(c) {
                "@babel/helpers - typeof";
                if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
                    a.exports = b = function b(a) {
                        return typeof a;
                    };
                    (a.exports["default"] = a.exports), (a.exports.__esModule = true);
                } else {
                    a.exports = b = function b(a) {
                        return a && typeof Symbol === "function" && a.constructor === Symbol && a !== Symbol.prototype ? "symbol" : typeof a;
                    };
                    (a.exports["default"] = a.exports), (a.exports.__esModule = true);
                }
                return b(c);
            }
            a.exports = b;
            (a.exports["default"] = a.exports), (a.exports.__esModule = true);
        },
        function(a, c) {
            function d(c, d, e, f, g, h, i) {
                try {
                    var a = c[h](i);
                    var b = a.value;
                } catch (j) {
                    e(j);
                    return;
                }
                if (a.done) {
                    d(b);
                } else {
                    Promise.resolve(b).then(f, g);
                }
            }
            function b(a) {
                return function() {
                    var b = this, c = arguments;
                    return new Promise(function(f, g) {
                        var h = a.apply(b, c);
                        function e(a) {
                            d(h, f, g, e, i, "next", a);
                        }
                        function i(a) {
                            d(h, f, g, e, i, "throw", a);
                        }
                        e(undefined);
                    });
                };
            }
            a.exports = b;
            (a.exports["default"] = a.exports), (a.exports.__esModule = true);
        },
        function(c, a, d) {
            "use strict";
            var b = {
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
                create: function c(a, b) {
                    var d = a.data;
                    var e = b.data;
                    var f = this.searchDirections;
                    var g = a.size.x;
                    var h;
                    function i(a, k, j, l) {
                        var b;
                        var c;
                        var i;
                        for(b = 0; b < 7; b++){
                            c = a.cy + f[a.dir][0];
                            i = a.cx + f[a.dir][1];
                            h = c * g + i;
                            if (d[h] === k && (e[h] === 0 || e[h] === j)) {
                                e[h] = j;
                                a.cy = c;
                                a.cx = i;
                                return true;
                            }
                            if (e[h] === 0) {
                                e[h] = l;
                            }
                            a.dir = (a.dir + 1) % 8;
                        }
                        return false;
                    }
                    function j(a, b, c) {
                        return {
                            dir: c,
                            x: a,
                            y: b,
                            next: null,
                            prev: null
                        };
                    }
                    function k(f, g, h, k, l) {
                        var d = null;
                        var b;
                        var c;
                        var e;
                        var a = {
                            cx: g,
                            cy: f,
                            dir: 0
                        };
                        if (i(a, k, h, l)) {
                            d = j(g, f, a.dir);
                            b = d;
                            e = a.dir;
                            c = j(a.cx, a.cy, 0);
                            c.prev = b;
                            b.next = c;
                            c.next = null;
                            b = c;
                            do {
                                a.dir = (a.dir + 6) % 8;
                                i(a, k, h, l);
                                if (e !== a.dir) {
                                    b.dir = a.dir;
                                    c = j(a.cx, a.cy, 0);
                                    c.prev = b;
                                    b.next = c;
                                    c.next = null;
                                    b = c;
                                } else {
                                    b.dir = e;
                                    b.x = a.cx;
                                    b.y = a.cy;
                                }
                                e = a.dir;
                            }while (a.cx !== g || a.cy !== f)
                            d.prev = b.prev;
                            b.prev.next = d;
                        }
                        return d;
                    }
                    return {
                        trace: function e(a, b, c, d) {
                            return i(a, b, c, d);
                        },
                        contourTracing: function f(a, b, c, d, e) {
                            return k(a, b, c, d, e);
                        }
                    };
                }
            };
            a["a"] = b;
        },
        function(c, e, a) {
            var b = a(27), f = a(103), g = a(104);
            var h = "[object Null]", i = "[object Undefined]";
            var j = b ? b.toStringTag : undefined;
            function d(a) {
                if (a == null) {
                    return a === undefined ? i : h;
                }
                return j && j in Object(a) ? f(a) : g(a);
            }
            c.exports = d;
        },
        function(b, c, a) {
            "use strict";
            (function(e) {
                var b = a(7);
                var f = a.n(b);
                var d = a(34);
                var g = a.n(d);
                var h = a(11);
                var i = a(8);
                var j = a(10);
                var k = a(9);
                var l = a(87);
                var m = a(21);
                var n = a(88);
                var o;
                var p;
                var q;
                var r;
                var s;
                var t;
                var u;
                var v;
                var w;
                var x;
                var y = {
                    ctx: {
                        binary: null
                    },
                    dom: {
                        binary: null
                    }
                };
                var z = {
                    x: 0,
                    y: 0
                };
                var A;
                var B;
                function C() {
                    if (o.halfSample) {
                        p = new h["a"]({
                            x: (A.size.x / 2) | 0,
                            y: (A.size.y / 2) | 0
                        });
                    } else {
                        p = A;
                    }
                    x = Object(i["a"])(o.patchSize, p.size);
                    z.x = (p.size.x / x.x) | 0;
                    z.y = (p.size.y / x.y) | 0;
                    w = new h["a"](p.size, undefined, Uint8Array, false);
                    s = new h["a"](x, undefined, Array, true);
                    var a = new ArrayBuffer(64 * 1024);
                    r = new h["a"](x, new Uint8Array(a, 0, x.x * x.y));
                    q = new h["a"](x, new Uint8Array(a, x.x * x.y * 3, x.x * x.y), undefined, true);
                    B = Object(n["a"])(typeof window !== "undefined" ? window : typeof self !== "undefined" ? self : e, {
                        size: x.x
                    }, a);
                    v = new h["a"]({
                        x: (p.size.x / r.size.x) | 0,
                        y: (p.size.y / r.size.y) | 0
                    }, undefined, Array, true);
                    t = new h["a"](v.size, undefined, undefined, true);
                    u = new h["a"](v.size, undefined, Int32Array, true);
                }
                function D() {
                    if (o.useWorker || typeof document === "undefined") {
                        return;
                    }
                    y.dom.binary = document.createElement("canvas");
                    y.dom.binary.className = "binaryBuffer";
                    if (true && o.debug.showCanvas === true) {
                        document.querySelector("#debug").appendChild(y.dom.binary);
                    }
                    y.ctx.binary = y.dom.binary.getContext("2d");
                    y.dom.binary.width = w.size.x;
                    y.dom.binary.height = w.size.y;
                }
                function E(h) {
                    var e;
                    var f;
                    var a;
                    var c;
                    var i;
                    var j = w.size.x;
                    var l = w.size.y;
                    var m = -w.size.x;
                    var n = -w.size.y;
                    var g;
                    var p;
                    e = 0;
                    for(f = 0; f < h.length; f++){
                        c = h[f];
                        e += c.rad;
                        if (true && o.debug.showPatches) {
                            k["a"].drawRect(c.pos, r.size, y.ctx.binary, {
                                color: "red"
                            });
                        }
                    }
                    e /= h.length;
                    e = (((e * 180) / Math.PI + 90) % 180) - 90;
                    if (e < 0) {
                        e += 180;
                    }
                    e = ((180 - e) * Math.PI) / 180;
                    i = d["copy"](d["create"](), [
                        Math.cos(e),
                        Math.sin(e),
                        -Math.sin(e),
                        Math.cos(e), 
                    ]);
                    for(f = 0; f < h.length; f++){
                        c = h[f];
                        for(a = 0; a < 4; a++){
                            b["transformMat2"](c.box[a], c.box[a], i);
                        }
                        if (true && o.debug.boxFromPatches.showTransformed) {
                            k["a"].drawPath(c.box, {
                                x: 0,
                                y: 1
                            }, y.ctx.binary, {
                                color: "#99ff00",
                                lineWidth: 2
                            });
                        }
                    }
                    for(f = 0; f < h.length; f++){
                        c = h[f];
                        for(a = 0; a < 4; a++){
                            if (c.box[a][0] < j) {
                                j = c.box[a][0];
                            }
                            if (c.box[a][0] > m) {
                                m = c.box[a][0];
                            }
                            if (c.box[a][1] < l) {
                                l = c.box[a][1];
                            }
                            if (c.box[a][1] > n) {
                                n = c.box[a][1];
                            }
                        }
                    }
                    g = [
                        [
                            j,
                            l
                        ],
                        [
                            m,
                            l
                        ],
                        [
                            m,
                            n
                        ],
                        [
                            j,
                            n
                        ], 
                    ];
                    if (true && o.debug.boxFromPatches.showTransformedBox) {
                        k["a"].drawPath(g, {
                            x: 0,
                            y: 1
                        }, y.ctx.binary, {
                            color: "#ff0000",
                            lineWidth: 2
                        });
                    }
                    p = o.halfSample ? 2 : 1;
                    i = d["invert"](i, i);
                    for(a = 0; a < 4; a++){
                        b["transformMat2"](g[a], g[a], i);
                    }
                    if (true && o.debug.boxFromPatches.showBB) {
                        k["a"].drawPath(g, {
                            x: 0,
                            y: 1
                        }, y.ctx.binary, {
                            color: "#ff0000",
                            lineWidth: 2
                        });
                    }
                    for(a = 0; a < 4; a++){
                        b["scale"](g[a], g[a], p);
                    }
                    return g;
                }
                function F() {
                    Object(i["i"])(p, w);
                    w.zeroBorder();
                    if (true && o.debug.showCanvas) {
                        w.show(y.dom.binary, 255);
                    }
                }
                function G() {
                    var a;
                    var b;
                    var d;
                    var e;
                    var g;
                    var c = [];
                    var h;
                    var f;
                    var i;
                    for(a = 0; a < z.x; a++){
                        for(b = 0; b < z.y; b++){
                            d = r.size.x * a;
                            e = r.size.y * b;
                            K(d, e);
                            q.zeroBorder();
                            j["a"].init(s.data, 0);
                            h = l["a"].create(q, s);
                            f = h.rasterize(0);
                            if (true && o.debug.showLabels) {
                                s.overlay(y.dom.binary, Math.floor(360 / f.count), {
                                    x: d,
                                    y: e
                                });
                            }
                            g = s.moments(f.count);
                            c = c.concat(L(g, [
                                a,
                                b
                            ], d, e));
                        }
                    }
                    if (true && o.debug.showFoundPatches) {
                        for(a = 0; a < c.length; a++){
                            i = c[a];
                            k["a"].drawRect(i.pos, r.size, y.ctx.binary, {
                                color: "#99ff00",
                                lineWidth: 2
                            });
                        }
                    }
                    return c;
                }
                function H(e) {
                    var c;
                    var b;
                    var a = [];
                    var d = [];
                    for(c = 0; c < e; c++){
                        a.push(0);
                    }
                    b = u.data.length;
                    while(b--){
                        if (u.data[b] > 0) {
                            a[u.data[b] - 1]++;
                        }
                    }
                    a = a.map(function(a, b) {
                        return {
                            val: a,
                            label: b + 1
                        };
                    });
                    a.sort(function(a, b) {
                        return b.val - a.val;
                    });
                    d = a.filter(function(a) {
                        return a.val >= 5;
                    });
                    return d;
                }
                function I(f, m) {
                    var a;
                    var c;
                    var d;
                    var b = [];
                    var e;
                    var g;
                    var h = [];
                    var j = [
                        0,
                        1,
                        1
                    ];
                    var l = [
                        0,
                        0,
                        0
                    ];
                    for(a = 0; a < f.length; a++){
                        d = u.data.length;
                        b.length = 0;
                        while(d--){
                            if (u.data[d] === f[a].label) {
                                e = v.data[d];
                                b.push(e);
                            }
                        }
                        g = E(b);
                        if (g) {
                            h.push(g);
                            if (true && o.debug.showRemainingPatchLabels) {
                                for(c = 0; c < b.length; c++){
                                    e = b[c];
                                    j[0] = (f[a].label / (m + 1)) * 360;
                                    Object(i["g"])(j, l);
                                    k["a"].drawRect(e.pos, r.size, y.ctx.binary, {
                                        color: "rgb(".concat(l.join(","), ")"),
                                        lineWidth: 2
                                    });
                                }
                            }
                        }
                    }
                    return h;
                }
                function J(e) {
                    var f = Object(i["b"])(e, 0.9);
                    var c = Object(i["j"])(f, 1, function(a) {
                        return a.getPoints().length;
                    });
                    var a = [];
                    var d = [];
                    if (c.length === 1) {
                        a = c[0].item.getPoints();
                        for(var b = 0; b < a.length; b++){
                            d.push(a[b].point);
                        }
                    }
                    return d;
                }
                function K(a, b) {
                    w.subImageAsCopy(r, Object(i["h"])(a, b));
                    B.skeletonize();
                    if (true && o.debug.showSkeleton) {
                        q.overlay(y.dom.binary, 360, Object(i["h"])(a, b));
                    }
                }
                function L(e, i, f, g) {
                    var a;
                    var d;
                    var h = [];
                    var c;
                    var j;
                    var k = [];
                    var l = Math.ceil(x.x / 3);
                    if (e.length >= 2) {
                        for(a = 0; a < e.length; a++){
                            if (e[a].m00 > l) {
                                h.push(e[a]);
                            }
                        }
                        if (h.length >= 2) {
                            c = J(h);
                            d = 0;
                            for(a = 0; a < c.length; a++){
                                d += c[a].rad;
                            }
                            if (c.length > 1 && c.length >= (h.length / 4) * 3 && c.length > e.length / 4) {
                                d /= c.length;
                                j = {
                                    index: i[1] * z.x + i[0],
                                    pos: {
                                        x: f,
                                        y: g
                                    },
                                    box: [
                                        b["clone"]([
                                            f,
                                            g
                                        ]),
                                        b["clone"]([
                                            f + r.size.x,
                                            g
                                        ]),
                                        b["clone"]([
                                            f + r.size.x,
                                            g + r.size.y, 
                                        ]),
                                        b["clone"]([
                                            f,
                                            g + r.size.y
                                        ]), 
                                    ],
                                    moments: c,
                                    rad: d,
                                    vec: b["clone"]([
                                        Math.cos(d),
                                        Math.sin(d)
                                    ])
                                };
                                k.push(j);
                            }
                        }
                    }
                    return k;
                }
                function M(e) {
                    var d = 0;
                    var p = 0.95;
                    var f = 0;
                    var a;
                    var c;
                    var g = [
                        0,
                        1,
                        1
                    ];
                    var h = [
                        0,
                        0,
                        0
                    ];
                    function l() {
                        var a;
                        for(a = 0; a < u.data.length; a++){
                            if (u.data[a] === 0 && t.data[a] === 1) {
                                return a;
                            }
                        }
                        return u.length;
                    }
                    function n(c) {
                        var f;
                        var g;
                        var h;
                        var a;
                        var e;
                        var i = {
                            x: c % u.size.x,
                            y: (c / u.size.x) | 0
                        };
                        var j;
                        if (c < u.data.length) {
                            h = v.data[c];
                            u.data[c] = d;
                            for(e = 0; e < m["a"].searchDirections.length; e++){
                                g = i.y + m["a"].searchDirections[e][0];
                                f = i.x + m["a"].searchDirections[e][1];
                                a = g * u.size.x + f;
                                if (t.data[a] === 0) {
                                    u.data[a] = Number.MAX_VALUE;
                                    continue;
                                }
                                if (u.data[a] === 0) {
                                    j = Math.abs(b["dot"](v.data[a].vec, h.vec));
                                    if (j > p) {
                                        n(a);
                                    }
                                }
                            }
                        }
                    }
                    j["a"].init(t.data, 0);
                    j["a"].init(u.data, 0);
                    j["a"].init(v.data, null);
                    for(a = 0; a < e.length; a++){
                        c = e[a];
                        v.data[c.index] = c;
                        t.data[c.index] = 1;
                    }
                    t.zeroBorder();
                    while((f = l()) < u.data.length){
                        d++;
                        n(f);
                    }
                    if (true && o.debug.showPatchLabels) {
                        for(a = 0; a < u.data.length; a++){
                            if (u.data[a] > 0 && u.data[a] <= d) {
                                c = v.data[a];
                                g[0] = (u.data[a] / (d + 1)) * 360;
                                Object(i["g"])(g, h);
                                k["a"].drawRect(c.pos, r.size, y.ctx.binary, {
                                    color: "rgb(".concat(h.join(","), ")"),
                                    lineWidth: 2
                                });
                            }
                        }
                    }
                    return d;
                }
                c["a"] = {
                    init: function c(a, b) {
                        o = b;
                        A = a;
                        C();
                        D();
                    },
                    locate: function e() {
                        if (o.halfSample) {
                            Object(i["f"])(A, p);
                        }
                        F();
                        var b = G();
                        if (b.length < z.x * z.y * 0.05) {
                            return null;
                        }
                        var a = M(b);
                        if (a < 1) {
                            return null;
                        }
                        var c = H(a);
                        if (c.length === 0) {
                            return null;
                        }
                        var d = I(c, a);
                        return d;
                    },
                    checkImageConstraints: function j(a, h) {
                        var b;
                        var c = a.getWidth();
                        var d = a.getHeight();
                        var f = h.halfSample ? 0.5 : 1;
                        var e;
                        if (a.getConfig().area) {
                            e = Object(i["d"])(c, d, a.getConfig().area);
                            a.setTopRight({
                                x: e.sx,
                                y: e.sy
                            });
                            a.setCanvasSize({
                                x: c,
                                y: d
                            });
                            c = e.sw;
                            d = e.sh;
                        }
                        var g = {
                            x: Math.floor(c * f),
                            y: Math.floor(d * f)
                        };
                        b = Object(i["a"])(h.patchSize, g);
                        if (true) {
                            console.log("Patch-Size: ".concat(JSON.stringify(b)));
                        }
                        a.setWidth(Math.floor(Math.floor(g.x / b.x) * (1 / f) * b.x));
                        a.setHeight(Math.floor(Math.floor(g.y / b.y) * (1 / f) * b.y));
                        if (a.getWidth() % b.x === 0 && a.getHeight() % b.y === 0) {
                            return true;
                        }
                        throw new Error("Image dimensions do not comply with the current settings: Width (".concat(c, " )and height (").concat(d, ") must a multiple of ").concat(b.x));
                    }
                };
            }.call(this, a(46)));
        },
        function(c, i, b) {
            var d = b(92), e = b(93), f = b(94), g = b(95), h = b(96);
            function a(a) {
                var b = -1, d = a == null ? 0 : a.length;
                this.clear();
                while(++b < d){
                    var c = a[b];
                    this.set(c[0], c[1]);
                }
            }
            a.prototype.clear = d;
            a.prototype["delete"] = e;
            a.prototype.get = f;
            a.prototype.has = g;
            a.prototype.set = h;
            c.exports = a;
        },
        function(a, d, b) {
            var e = b(26);
            function c(b, c) {
                var a = b.length;
                while(a--){
                    if (e(b[a][0], c)) {
                        return a;
                    }
                }
                return -1;
            }
            a.exports = c;
        },
        function(a, c) {
            function b(a, b) {
                return (a === b || (a !== a && b !== b));
            }
            a.exports = b;
        },
        function(a, e, b) {
            var c = b(17);
            var d = c.Symbol;
            a.exports = d;
        },
        function(a, e, b) {
            var c = b(35);
            var d = c(Object, "create");
            a.exports = d;
        },
        function(a, d, b) {
            var e = b(117);
            function c(c, a) {
                var b = c.__data__;
                return e(a) ? b[typeof a == "string" ? "string" : "hash"] : b.map;
            }
            a.exports = c;
        },
        function(d, f, a) {
            var b = a(132), g = a(18);
            var c = Object.prototype;
            var h = c.hasOwnProperty;
            var i = c.propertyIsEnumerable;
            var e = b((function() {
                return arguments;
            })()) ? b : function(a) {
                return (g(a) && h.call(a, "callee") && !i.call(a, "callee"));
            };
            d.exports = e;
        },
        function(a, c) {
            var d = 9007199254740991;
            var e = /^(?:0|[1-9]\d*)$/;
            function b(a, b) {
                var c = typeof a;
                b = b == null ? d : b;
                return (!!b && (c == "number" || (c != "symbol" && e.test(a))) && a > -1 && a % 1 == 0 && a < b);
            }
            a.exports = b;
        },
        function(b, d, a) {
            var e = a(15), f = a(232), g = a(233), h = a(236);
            function c(a, b) {
                if (e(a)) {
                    return a;
                }
                return f(a, b) ? [
                    a
                ] : g(h(a));
            }
            b.exports = c;
        },
        function(a, d, b) {
            var e = b(224);
            var f = b(225);
            var g = b(60);
            var h = b(226);
            function c(a) {
                return (e(a) || f(a) || g(a) || h());
            }
            a.exports = c;
            (a.exports["default"] = a.exports), (a.exports.__esModule = true);
        },
        function(b, c, a) {
            b.exports = {
                determinant: a(251),
                transpose: a(252),
                multiply: a(253),
                identity: a(254),
                adjoint: a(255),
                rotate: a(256),
                invert: a(257),
                create: a(258),
                scale: a(259),
                copy: a(260),
                frob: a(261),
                ldu: a(262)
            };
        },
        function(b, d, a) {
            var e = a(102), f = a(108);
            function c(b, c) {
                var a = f(b, c);
                return e(a) ? a : undefined;
            }
            b.exports = c;
        },
        function(b, d, a) {
            var e = a(22), f = a(14);
            var g = "[object AsyncFunction]", h = "[object Function]", i = "[object GeneratorFunction]", j = "[object Proxy]";
            function c(b) {
                if (!f(b)) {
                    return false;
                }
                var a = e(b);
                return (a == h || a == i || a == g || a == j);
            }
            b.exports = c;
        },
        function(a, d, b) {
            var e = b(49);
            function c(b, a, c) {
                if (a == "__proto__" && e) {
                    e(b, a, {
                        configurable: true,
                        enumerable: true,
                        value: c,
                        writable: true
                    });
                } else {
                    b[a] = c;
                }
            }
            a.exports = c;
        },
        function(a, b) {
            a.exports = function(a) {
                if (!a.webpackPolyfill) {
                    a.deprecate = function() {};
                    a.paths = [];
                    if (!a.children) a.children = [];
                    Object.defineProperty(a, "loaded", {
                        enumerable: true,
                        get: function() {
                            return a.l;
                        }
                    });
                    Object.defineProperty(a, "id", {
                        enumerable: true,
                        get: function() {
                            return a.i;
                        }
                    });
                    a.webpackPolyfill = 1;
                }
                return a;
            };
        },
        function(b, d, a) {
            var e = a(36), f = a(40);
            function c(a) {
                return (a != null && f(a.length) && !e(a));
            }
            b.exports = c;
        },
        function(a, c) {
            var d = 9007199254740991;
            function b(a) {
                return (typeof a == "number" && a > -1 && a % 1 == 0 && a <= d);
            }
            a.exports = b;
        },
        function(a, c) {
            function b(c, d) {
                a.exports = b = Object.setPrototypeOf || function c(a, b) {
                    a.__proto__ = b;
                    return a;
                };
                (a.exports["default"] = a.exports), (a.exports.__esModule = true);
                return b(c, d);
            }
            a.exports = b;
            (a.exports["default"] = a.exports), (a.exports.__esModule = true);
        },
        function(b, d, a) {
            var e = a(22), f = a(18);
            var g = "[object Symbol]";
            function c(a) {
                return (typeof a == "symbol" || (f(a) && e(a) == g));
            }
            b.exports = c;
        },
        function(a, d, b) {
            var e = b(42);
            var f = 1 / 0;
            function c(a) {
                if (typeof a == "string" || e(a)) {
                    return a;
                }
                var b = a + "";
                return b == "0" && 1 / a == -f ? "-0" : b;
            }
            a.exports = c;
        },
        function(b, f, a) {
            var c = a(35), d = a(17);
            var e = c(d, "Map");
            b.exports = e;
        },
        function(b, c, a) {
            (function(a) {
                var c = typeof a == "object" && a && a.Object === Object && a;
                b.exports = c;
            }.call(this, a(46)));
        },
        function(b, c) {
            var a;
            a = (function() {
                return this;
            })();
            try {
                a = a || new Function("return this")();
            } catch (d) {
                if (typeof window === "object") a = window;
            }
            b.exports = a;
        },
        function(c, i, b) {
            var d = b(109), e = b(116), f = b(118), g = b(119), h = b(120);
            function a(a) {
                var b = -1, d = a == null ? 0 : a.length;
                this.clear();
                while(++b < d){
                    var c = a[b];
                    this.set(c[0], c[1]);
                }
            }
            a.prototype.clear = d;
            a.prototype["delete"] = e;
            a.prototype.get = f;
            a.prototype.has = g;
            a.prototype.set = h;
            c.exports = a;
        },
        function(b, d, a) {
            var e = a(37), f = a(26);
            function c(b, c, a) {
                if ((a !== undefined && !f(b[c], a)) || (a === undefined && !(c in b))) {
                    e(b, c, a);
                }
            }
            b.exports = c;
        },
        function(a, d, b) {
            var e = b(35);
            var c = (function() {
                try {
                    var a = e(Object, "defineProperty");
                    a({}, "", {});
                    return a;
                } catch (b) {}
            })();
            a.exports = c;
        },
        function(a, e, b) {
            var c = b(131);
            var d = c(Object.getPrototypeOf, Object);
            a.exports = d;
        },
        function(a, c) {
            var d = Object.prototype;
            function b(a) {
                var b = a && a.constructor, c = (typeof b == "function" && b.prototype) || d;
                return a === c;
            }
            a.exports = b;
        },
        function(a, c, b) {
            (function(a) {
                var g = b(17), h = b(134);
                var d = true && c && !c.nodeType && c;
                var e = d && typeof a == "object" && a && !a.nodeType && a;
                var i = e && e.exports === d;
                var f = i ? g.Buffer : undefined;
                var j = f ? f.isBuffer : undefined;
                var k = j || h;
                a.exports = k;
            }.call(this, b(38)(a)));
        },
        function(d, h, a) {
            var e = a(136), f = a(137), b = a(138);
            var c = b && b.isTypedArray;
            var g = c ? f(c) : e;
            d.exports = g;
        },
        function(a, c) {
            function b(b, a) {
                if (a === "constructor" && typeof b[a] === "function") {
                    return;
                }
                if (a == "__proto__") {
                    return;
                }
                return b[a];
            }
            a.exports = b;
        },
        function(b, e, a) {
            var f = a(37), g = a(26);
            var c = Object.prototype;
            var h = c.hasOwnProperty;
            function d(a, b, c) {
                var d = a[b];
                if (!(h.call(a, b) && g(d, c)) || (c === undefined && !(b in a))) {
                    f(a, b, c);
                }
            }
            b.exports = d;
        },
        function(b, d, a) {
            var e = a(141), f = a(143), g = a(39);
            function c(a) {
                return g(a) ? e(a, true) : f(a);
            }
            b.exports = c;
        },
        function(a, c) {
            function b(a) {
                return a;
            }
            a.exports = b;
        },
        function(a, d, b) {
            var e = b(147);
            var f = Math.max;
            function c(b, a, c) {
                a = f(a === undefined ? b.length - 1 : a, 0);
                return function() {
                    var g = arguments, d = -1, i = f(g.length - a, 0), j = Array(i);
                    while(++d < i){
                        j[d] = g[a + d];
                    }
                    d = -1;
                    var h = Array(a + 1);
                    while(++d < a){
                        h[d] = g[d];
                    }
                    h[a] = c(j);
                    return e(b, this, h);
                };
            }
            a.exports = c;
        },
        function(b, f, a) {
            var c = a(148), d = a(150);
            var e = d(c);
            b.exports = e;
        },
        function(a, d, b) {
            var e = b(61);
            function c(a, c) {
                if (!a) return;
                if (typeof a === "string") return e(a, c);
                var b = Object.prototype.toString.call(a).slice(8, -1);
                if (b === "Object" && a.constructor) b = a.constructor.name;
                if (b === "Map" || b === "Set") return Array.from(a);
                if (b === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(b)) return e(a, c);
            }
            a.exports = c;
            (a.exports["default"] = a.exports), (a.exports.__esModule = true);
        },
        function(a, c) {
            function b(c, a) {
                if (a == null || a > c.length) a = c.length;
                for(var b = 0, d = new Array(a); b < a; b++){
                    d[b] = c[b];
                }
                return d;
            }
            a.exports = b;
            (a.exports["default"] = a.exports), (a.exports.__esModule = true);
        },
        function(a, b) {
            a.exports = 0.000001;
        },
        function(a, b) {
            a.exports = c;
            function c() {
                var a = new Float32Array(2);
                a[0] = 0;
                a[1] = 0;
                return a;
            }
        },
        function(a, b) {
            a.exports = c;
            function c(a, b, c) {
                a[0] = b[0] - c[0];
                a[1] = b[1] - c[1];
                return a;
            }
        },
        function(a, b) {
            a.exports = c;
            function c(a, b, c) {
                a[0] = b[0] * c[0];
                a[1] = b[1] * c[1];
                return a;
            }
        },
        function(a, b) {
            a.exports = c;
            function c(a, b, c) {
                a[0] = b[0] / c[0];
                a[1] = b[1] / c[1];
                return a;
            }
        },
        function(a, b) {
            a.exports = c;
            function c(a, b) {
                var c = b[0] - a[0], d = b[1] - a[1];
                return Math.sqrt(c * c + d * d);
            }
        },
        function(a, b) {
            a.exports = c;
            function c(a, b) {
                var c = b[0] - a[0], d = b[1] - a[1];
                return c * c + d * d;
            }
        },
        function(a, b) {
            a.exports = c;
            function c(a) {
                var b = a[0], c = a[1];
                return Math.sqrt(b * b + c * c);
            }
        },
        function(a, b) {
            a.exports = c;
            function c(a) {
                var b = a[0], c = a[1];
                return b * b + c * c;
            }
        },
        function(a, b) {
            a.exports = 0.000001;
        },
        function(a, b) {
            a.exports = c;
            function c() {
                var a = new Float32Array(3);
                a[0] = 0;
                a[1] = 0;
                a[2] = 0;
                return a;
            }
        },
        function(a, b) {
            a.exports = c;
            function c(b, c, d) {
                var a = new Float32Array(3);
                a[0] = b;
                a[1] = c;
                a[2] = d;
                return a;
            }
        },
        function(a, b) {
            a.exports = c;
            function c(c, a) {
                var d = a[0], e = a[1], f = a[2];
                var b = d * d + e * e + f * f;
                if (b > 0) {
                    b = 1 / Math.sqrt(b);
                    c[0] = a[0] * b;
                    c[1] = a[1] * b;
                    c[2] = a[2] * b;
                }
                return c;
            }
        },
        function(a, b) {
            a.exports = c;
            function c(a, b) {
                return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
            }
        },
        function(a, b) {
            a.exports = c;
            function c(a, b, c) {
                a[0] = b[0] - c[0];
                a[1] = b[1] - c[1];
                a[2] = b[2] - c[2];
                return a;
            }
        },
        function(a, b) {
            a.exports = c;
            function c(a, b, c) {
                a[0] = b[0] * c[0];
                a[1] = b[1] * c[1];
                a[2] = b[2] * c[2];
                return a;
            }
        },
        function(a, b) {
            a.exports = c;
            function c(a, b, c) {
                a[0] = b[0] / c[0];
                a[1] = b[1] / c[1];
                a[2] = b[2] / c[2];
                return a;
            }
        },
        function(a, b) {
            a.exports = c;
            function c(a, b) {
                var c = b[0] - a[0], d = b[1] - a[1], e = b[2] - a[2];
                return Math.sqrt(c * c + d * d + e * e);
            }
        },
        function(a, b) {
            a.exports = c;
            function c(a, b) {
                var c = b[0] - a[0], d = b[1] - a[1], e = b[2] - a[2];
                return c * c + d * d + e * e;
            }
        },
        function(a, b) {
            a.exports = c;
            function c(a) {
                var b = a[0], c = a[1], d = a[2];
                return Math.sqrt(b * b + c * c + d * d);
            }
        },
        function(a, b) {
            a.exports = c;
            function c(a) {
                var b = a[0], c = a[1], d = a[2];
                return b * b + c * c + d * d;
            }
        },
        function(a, d, b) {
            var e = b(153);
            var f = b(154);
            var g = b(60);
            var h = b(155);
            function c(a, b) {
                return (e(a) || f(a, b) || g(a, b) || h());
            }
            a.exports = c;
            (a.exports["default"] = a.exports), (a.exports.__esModule = true);
        },
        function(b, c, a) {
            b.exports = {
                EPSILON: a(71),
                create: a(72),
                clone: a(191),
                angle: a(192),
                fromValues: a(73),
                copy: a(193),
                set: a(194),
                equals: a(195),
                exactEquals: a(196),
                add: a(197),
                subtract: a(76),
                sub: a(198),
                multiply: a(77),
                mul: a(199),
                divide: a(78),
                div: a(200),
                min: a(201),
                max: a(202),
                floor: a(203),
                ceil: a(204),
                round: a(205),
                scale: a(206),
                scaleAndAdd: a(207),
                distance: a(79),
                dist: a(208),
                squaredDistance: a(80),
                sqrDist: a(209),
                length: a(81),
                len: a(210),
                squaredLength: a(82),
                sqrLen: a(211),
                negate: a(212),
                inverse: a(213),
                normalize: a(74),
                dot: a(75),
                cross: a(214),
                lerp: a(215),
                random: a(216),
                transformMat4: a(217),
                transformMat3: a(218),
                transformQuat: a(219),
                rotateX: a(220),
                rotateY: a(221),
                rotateZ: a(222),
                forEach: a(223)
            };
        },
        function(b, e, a) {
            var f = a(229), c = a(243);
            var d = c(function(a, b) {
                return a == null ? {} : f(a, b);
            });
            b.exports = d;
        },
        function(a, d, b) {
            var e = b(2);
            var f = b(41);
            var g = b(248);
            var h = b(249);
            function c(b) {
                var d = typeof Map === "function" ? new Map() : undefined;
                a.exports = c = function c(a) {
                    if (a === null || !g(a)) return a;
                    if (typeof a !== "function") {
                        throw new TypeError("Super expression must either be null or a function");
                    }
                    if (typeof d !== "undefined") {
                        if (d.has(a)) return d.get(a);
                        d.set(a, b);
                    }
                    function b() {
                        return h(a, arguments, e(this).constructor);
                    }
                    b.prototype = Object.create(a.prototype, {
                        constructor: {
                            value: b,
                            enumerable: false,
                            writable: true,
                            configurable: true
                        }
                    });
                    return f(b, a);
                };
                (a.exports["default"] = a.exports), (a.exports.__esModule = true);
                return c(b);
            }
            a.exports = c;
            (a.exports["default"] = a.exports), (a.exports.__esModule = true);
        },
        function(d, a, b) {
            "use strict";
            var e = b(21);
            var c = {
                createContour2D: function a() {
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
                create: function d(a, b) {
                    var f = a.data;
                    var g = b.data;
                    var h = a.size.x;
                    var i = a.size.y;
                    var j = e["a"].create(a, b);
                    return {
                        rasterize: function v(t) {
                            var l;
                            var m;
                            var r;
                            var d;
                            var n;
                            var o;
                            var p = [];
                            var q;
                            var a;
                            var k;
                            var b;
                            var e;
                            var u = 0;
                            var s;
                            for(s = 0; s < 400; s++){
                                p[s] = 0;
                            }
                            p[0] = f[0];
                            k = null;
                            for(o = 1; o < i - 1; o++){
                                d = 0;
                                m = p[0];
                                for(n = 1; n < h - 1; n++){
                                    e = o * h + n;
                                    if (g[e] === 0) {
                                        l = f[e];
                                        if (l !== m) {
                                            if (d === 0) {
                                                r = u + 1;
                                                p[r] = l;
                                                m = l;
                                                q = j.contourTracing(o, n, r, l, c.DIR.OUTSIDE_EDGE);
                                                if (q !== null) {
                                                    u++;
                                                    d = r;
                                                    a = c.createContour2D();
                                                    a.dir = c.CONTOUR_DIR.CW_DIR;
                                                    a.index = d;
                                                    a.firstVertex = q;
                                                    a.nextpeer = k;
                                                    a.insideContours = null;
                                                    if (k !== null) {
                                                        k.prevpeer = a;
                                                    }
                                                    k = a;
                                                }
                                            } else {
                                                q = j.contourTracing(o, n, c.DIR.INSIDE_EDGE, l, d);
                                                if (q !== null) {
                                                    a = c.createContour2D();
                                                    a.firstVertex = q;
                                                    a.insideContours = null;
                                                    if (t === 0) {
                                                        a.dir = c.CONTOUR_DIR.CCW_DIR;
                                                    } else {
                                                        a.dir = c.CONTOUR_DIR.CW_DIR;
                                                    }
                                                    a.index = t;
                                                    b = k;
                                                    while(b !== null && b.index !== d){
                                                        b = b.nextpeer;
                                                    }
                                                    if (b !== null) {
                                                        a.nextpeer = b.insideContours;
                                                        if (b.insideContours !== null) {
                                                            b.insideContours.prevpeer = a;
                                                        }
                                                        b.insideContours = a;
                                                    }
                                                }
                                            }
                                        } else {
                                            g[e] = d;
                                        }
                                    } else if (g[e] === c.DIR.OUTSIDE_EDGE || g[e] === c.DIR.INSIDE_EDGE) {
                                        d = 0;
                                        if (g[e] === c.DIR.INSIDE_EDGE) {
                                            m = f[e];
                                        } else {
                                            m = p[0];
                                        }
                                    } else {
                                        d = g[e];
                                        m = p[d];
                                    }
                                }
                            }
                            b = k;
                            while(b !== null){
                                b.index = t;
                                b = b.nextpeer;
                            }
                            return {
                                cc: k,
                                count: u
                            };
                        },
                        debug: {
                            drawContour: function i(g, h) {
                                var a = g.getContext("2d");
                                var b = h;
                                var d;
                                var f;
                                var e;
                                a.strokeStyle = "red";
                                a.fillStyle = "red";
                                a.lineWidth = 1;
                                if (b !== null) {
                                    d = b.insideContours;
                                } else {
                                    d = null;
                                }
                                while(b !== null){
                                    if (d !== null) {
                                        f = d;
                                        d = d.nextpeer;
                                    } else {
                                        f = b;
                                        b = b.nextpeer;
                                        if (b !== null) {
                                            d = b.insideContours;
                                        } else {
                                            d = null;
                                        }
                                    }
                                    switch(f.dir){
                                        case c.CONTOUR_DIR.CW_DIR:
                                            a.strokeStyle = "red";
                                            break;
                                        case c.CONTOUR_DIR.CCW_DIR:
                                            a.strokeStyle = "blue";
                                            break;
                                        case c.CONTOUR_DIR.UNKNOWN_DIR:
                                            a.strokeStyle = "green";
                                            break;
                                    }
                                    e = f.firstVertex;
                                    a.beginPath();
                                    a.moveTo(e.x, e.y);
                                    do {
                                        e = e.next;
                                        a.lineTo(e.x, e.y);
                                    }while (e !== f.firstVertex)
                                    a.stroke();
                                }
                            }
                        }
                    };
                }
            };
            a["a"] = c;
        },
        function(c, a, d) {
            "use strict";
            function b(a, b, c) {
                "use asm";
                var e = new a.Uint8Array(c);
                var f = b.size | 0;
                var g = a.Math.imul;
                function h(c, g) {
                    c |= 0;
                    g |= 0;
                    var d = 0;
                    var a = 0;
                    var l = 0;
                    var h = 0;
                    var i = 0;
                    var j = 0;
                    var k = 0;
                    var b = 0;
                    for(d = 1; (d | 0) < ((f - 1) | 0); d = (d + 1) | 0){
                        b = (b + f) | 0;
                        for(a = 1; (a | 0) < ((f - 1) | 0); a = (a + 1) | 0){
                            h = (b - f) | 0;
                            i = (b + f) | 0;
                            j = (a - 1) | 0;
                            k = (a + 1) | 0;
                            l = ((e[(c + h + j) | 0] | 0) + (e[(c + h + k) | 0] | 0) + (e[(c + b + a) | 0] | 0) + (e[(c + i + j) | 0] | 0) + (e[(c + i + k) | 0] | 0)) | 0;
                            if ((l | 0) == (5 | 0)) {
                                e[(g + b + a) | 0] = 1;
                            } else {
                                e[(g + b + a) | 0] = 0;
                            }
                        }
                    }
                }
                function i(b, c, d) {
                    b |= 0;
                    c |= 0;
                    d |= 0;
                    var a = 0;
                    a = g(f, f) | 0;
                    while((a | 0) > 0){
                        a = (a - 1) | 0;
                        e[(d + a) | 0] = ((e[(b + a) | 0] | 0) - (e[(c + a) | 0] | 0)) | 0;
                    }
                }
                function j(b, c, d) {
                    b |= 0;
                    c |= 0;
                    d |= 0;
                    var a = 0;
                    a = g(f, f) | 0;
                    while((a | 0) > 0){
                        a = (a - 1) | 0;
                        e[(d + a) | 0] = e[(b + a) | 0] | 0 | (e[(c + a) | 0] | 0) | 0;
                    }
                }
                function k(c) {
                    c |= 0;
                    var b = 0;
                    var a = 0;
                    a = g(f, f) | 0;
                    while((a | 0) > 0){
                        a = (a - 1) | 0;
                        b = ((b | 0) + (e[(c + a) | 0] | 0)) | 0;
                    }
                    return b | 0;
                }
                function l(b, c) {
                    b |= 0;
                    c |= 0;
                    var a = 0;
                    a = g(f, f) | 0;
                    while((a | 0) > 0){
                        a = (a - 1) | 0;
                        e[(b + a) | 0] = c;
                    }
                }
                function m(c, g) {
                    c |= 0;
                    g |= 0;
                    var d = 0;
                    var a = 0;
                    var l = 0;
                    var h = 0;
                    var i = 0;
                    var j = 0;
                    var k = 0;
                    var b = 0;
                    for(d = 1; (d | 0) < ((f - 1) | 0); d = (d + 1) | 0){
                        b = (b + f) | 0;
                        for(a = 1; (a | 0) < ((f - 1) | 0); a = (a + 1) | 0){
                            h = (b - f) | 0;
                            i = (b + f) | 0;
                            j = (a - 1) | 0;
                            k = (a + 1) | 0;
                            l = ((e[(c + h + j) | 0] | 0) + (e[(c + h + k) | 0] | 0) + (e[(c + b + a) | 0] | 0) + (e[(c + i + j) | 0] | 0) + (e[(c + i + k) | 0] | 0)) | 0;
                            if ((l | 0) > (0 | 0)) {
                                e[(g + b + a) | 0] = 1;
                            } else {
                                e[(g + b + a) | 0] = 0;
                            }
                        }
                    }
                }
                function n(b, c) {
                    b |= 0;
                    c |= 0;
                    var a = 0;
                    a = g(f, f) | 0;
                    while((a | 0) > 0){
                        a = (a - 1) | 0;
                        e[(c + a) | 0] = e[(b + a) | 0] | 0;
                    }
                }
                function o(c) {
                    c |= 0;
                    var a = 0;
                    var b = 0;
                    for(a = 0; (a | 0) < ((f - 1) | 0); a = (a + 1) | 0){
                        e[(c + a) | 0] = 0;
                        e[(c + b) | 0] = 0;
                        b = (b + f - 1) | 0;
                        e[(c + b) | 0] = 0;
                        b = (b + 1) | 0;
                    }
                    for(a = 0; (a | 0) < (f | 0); a = (a + 1) | 0){
                        e[(c + b) | 0] = 0;
                        b = (b + 1) | 0;
                    }
                }
                function d() {
                    var c = 0;
                    var a = 0;
                    var b = 0;
                    var d = 0;
                    var e = 0;
                    var p = 0;
                    a = g(f, f) | 0;
                    b = (a + a) | 0;
                    d = (b + a) | 0;
                    l(d, 0);
                    o(c);
                    do {
                        h(c, a);
                        m(a, b);
                        i(c, b, b);
                        j(d, b, d);
                        n(a, c);
                        e = k(c) | 0;
                        p = ((e | 0) == 0) | 0;
                    }while (!p)
                }
                return {
                    skeletonize: d
                };
            }
            a["a"] = b;
        },
        function(a, c, b) {
            a.exports = b(263);
        },
        function(b, d, a) {
            var e = a(91), f = a(48), g = a(121), h = a(123), i = a(14), j = a(56), k = a(54);
            function c(b, a, d, l, m) {
                if (b === a) {
                    return;
                }
                g(a, function(j, g) {
                    m || (m = new e());
                    if (i(j)) {
                        h(b, a, g, d, c, l, m);
                    } else {
                        var n = l ? l(k(b, g), j, g + "", b, a, m) : undefined;
                        if (n === undefined) {
                            n = j;
                        }
                        f(b, g, n);
                    }
                }, j);
            }
            b.exports = c;
        },
        function(c, i, a) {
            var j = a(24), d = a(97), e = a(98), f = a(99), g = a(100), h = a(101);
            function b(a) {
                var b = (this.__data__ = new j(a));
                this.size = b.size;
            }
            b.prototype.clear = d;
            b.prototype["delete"] = e;
            b.prototype.get = f;
            b.prototype.has = g;
            b.prototype.set = h;
            c.exports = b;
        },
        function(a, c) {
            function b() {
                this.__data__ = [];
                this.size = 0;
            }
            a.exports = b;
        },
        function(a, e, b) {
            var f = b(25);
            var c = Array.prototype;
            var g = c.splice;
            function d(c) {
                var a = this.__data__, b = f(a, c);
                if (b < 0) {
                    return false;
                }
                var d = a.length - 1;
                if (b == d) {
                    a.pop();
                } else {
                    g.call(a, b, 1);
                }
                --this.size;
                return true;
            }
            a.exports = d;
        },
        function(a, d, b) {
            var e = b(25);
            function c(c) {
                var a = this.__data__, b = e(a, c);
                return b < 0 ? undefined : a[b][1];
            }
            a.exports = c;
        },
        function(a, d, b) {
            var e = b(25);
            function c(a) {
                return e(this.__data__, a) > -1;
            }
            a.exports = c;
        },
        function(a, d, b) {
            var e = b(25);
            function c(b, c) {
                var a = this.__data__, d = e(a, b);
                if (d < 0) {
                    ++this.size;
                    a.push([
                        b,
                        c
                    ]);
                } else {
                    a[d][1] = c;
                }
                return this;
            }
            a.exports = c;
        },
        function(a, d, b) {
            var e = b(24);
            function c() {
                this.__data__ = new e();
                this.size = 0;
            }
            a.exports = c;
        },
        function(a, c) {
            function b(b) {
                var a = this.__data__, c = a["delete"](b);
                this.size = a.size;
                return c;
            }
            a.exports = b;
        },
        function(a, c) {
            function b(a) {
                return this.__data__.get(a);
            }
            a.exports = b;
        },
        function(a, c) {
            function b(a) {
                return this.__data__.has(a);
            }
            a.exports = b;
        },
        function(b, d, a) {
            var e = a(24), f = a(44), g = a(47);
            var h = 200;
            function c(c, d) {
                var a = this.__data__;
                if (a instanceof e) {
                    var b = a.__data__;
                    if (!f || b.length < h - 1) {
                        b.push([
                            c,
                            d
                        ]);
                        this.size = ++a.size;
                        return this;
                    }
                    a = this.__data__ = new g(b);
                }
                a.set(c, d);
                this.size = a.size;
                return this;
            }
            b.exports = c;
        },
        function(b, i, a) {
            var j = a(36), k = a(105), l = a(14), m = a(107);
            var c = /[\\^$.*+?()[\]{}|]/g;
            var n = /^\[object .+?Constructor\]$/;
            var d = Function.prototype, e = Object.prototype;
            var f = d.toString;
            var g = e.hasOwnProperty;
            var o = RegExp("^" + f.call(g).replace(c, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
            function h(a) {
                if (!l(a) || k(a)) {
                    return false;
                }
                var b = j(a) ? o : n;
                return b.test(m(a));
            }
            b.exports = h;
        },
        function(c, f, d) {
            var a = d(27);
            var b = Object.prototype;
            var g = b.hasOwnProperty;
            var h = b.toString;
            var i = a ? a.toStringTag : undefined;
            function e(a) {
                var b = g.call(a, i), c = a[i];
                try {
                    a[i] = undefined;
                    var d = true;
                } catch (f) {}
                var e = h.call(a);
                if (d) {
                    if (b) {
                        a[i] = c;
                    } else {
                        delete a[i];
                    }
                }
                return e;
            }
            c.exports = e;
        },
        function(a, d) {
            var b = Object.prototype;
            var e = b.toString;
            function c(a) {
                return e.call(a);
            }
            a.exports = c;
        },
        function(a, d, b) {
            var e = b(106);
            var f = (function() {
                var a = /[^.]+$/.exec((e && e.keys && e.keys.IE_PROTO) || "");
                return a ? "Symbol(src)_1." + a : "";
            })();
            function c(a) {
                return !!f && f in a;
            }
            a.exports = c;
        },
        function(a, e, b) {
            var c = b(17);
            var d = c["__core-js_shared__"];
            a.exports = d;
        },
        function(a, d) {
            var b = Function.prototype;
            var e = b.toString;
            function c(a) {
                if (a != null) {
                    try {
                        return e.call(a);
                    } catch (b) {}
                    try {
                        return a + "";
                    } catch (c) {}
                }
                return "";
            }
            a.exports = c;
        },
        function(a, c) {
            function b(a, b) {
                return a == null ? undefined : a[b];
            }
            a.exports = b;
        },
        function(b, d, a) {
            var e = a(110), f = a(24), g = a(44);
            function c() {
                this.size = 0;
                this.__data__ = {
                    hash: new e(),
                    map: new (g || f)(),
                    string: new e()
                };
            }
            b.exports = c;
        },
        function(c, i, b) {
            var d = b(111), e = b(112), f = b(113), g = b(114), h = b(115);
            function a(a) {
                var b = -1, d = a == null ? 0 : a.length;
                this.clear();
                while(++b < d){
                    var c = a[b];
                    this.set(c[0], c[1]);
                }
            }
            a.prototype.clear = d;
            a.prototype["delete"] = e;
            a.prototype.get = f;
            a.prototype.has = g;
            a.prototype.set = h;
            c.exports = a;
        },
        function(a, d, b) {
            var e = b(28);
            function c() {
                this.__data__ = e ? e(null) : {};
                this.size = 0;
            }
            a.exports = c;
        },
        function(a, c) {
            function b(a) {
                var b = this.has(a) && delete this.__data__[a];
                this.size -= b ? 1 : 0;
                return b;
            }
            a.exports = b;
        },
        function(a, e, b) {
            var f = b(28);
            var g = "__lodash_hash_undefined__";
            var c = Object.prototype;
            var h = c.hasOwnProperty;
            function d(a) {
                var b = this.__data__;
                if (f) {
                    var c = b[a];
                    return c === g ? undefined : c;
                }
                return h.call(b, a) ? b[a] : undefined;
            }
            a.exports = d;
        },
        function(a, e, b) {
            var f = b(28);
            var c = Object.prototype;
            var g = c.hasOwnProperty;
            function d(a) {
                var b = this.__data__;
                return f ? b[a] !== undefined : g.call(b, a);
            }
            a.exports = d;
        },
        function(a, d, b) {
            var e = b(28);
            var f = "__lodash_hash_undefined__";
            function c(a, b) {
                var c = this.__data__;
                this.size += this.has(a) ? 0 : 1;
                c[a] = e && b === undefined ? f : b;
                return this;
            }
            a.exports = c;
        },
        function(a, d, b) {
            var e = b(29);
            function c(a) {
                var b = e(this, a)["delete"](a);
                this.size -= b ? 1 : 0;
                return b;
            }
            a.exports = c;
        },
        function(a, c) {
            function b(b) {
                var a = typeof b;
                return a == "string" || a == "number" || a == "symbol" || a == "boolean" ? b !== "__proto__" : b === null;
            }
            a.exports = b;
        },
        function(a, d, b) {
            var e = b(29);
            function c(a) {
                return e(this, a).get(a);
            }
            a.exports = c;
        },
        function(a, d, b) {
            var e = b(29);
            function c(a) {
                return e(this, a).has(a);
            }
            a.exports = c;
        },
        function(a, d, b) {
            var e = b(29);
            function c(b, c) {
                var a = e(this, b), d = a.size;
                a.set(b, c);
                this.size += a.size == d ? 0 : 1;
                return this;
            }
            a.exports = c;
        },
        function(a, e, b) {
            var c = b(122);
            var d = c();
            a.exports = d;
        },
        function(a, c) {
            function b(a) {
                return function(b, g, h) {
                    var i = -1, c = Object(b), d = h(b), e = d.length;
                    while(e--){
                        var f = d[a ? e : ++i];
                        if (g(c[f], f, c) === false) {
                            break;
                        }
                    }
                    return b;
                };
            }
            a.exports = b;
        },
        function(b, d, a) {
            var e = a(48), f = a(124), g = a(125), h = a(128), i = a(129), j = a(30), k = a(15), l = a(133), m = a(52), n = a(36), o = a(14), p = a(135), q = a(53), r = a(54), s = a(139);
            function c(v, z, d, C, D, w, t) {
                var c = r(v, d), a = r(z, d), A = t.get(a);
                if (A) {
                    e(v, d, A);
                    return;
                }
                var b = w ? w(c, a, d + "", v, z, t) : undefined;
                var u = b === undefined;
                if (u) {
                    var x = k(a), y = !x && m(a), B = !x && !y && q(a);
                    b = a;
                    if (x || y || B) {
                        if (k(c)) {
                            b = c;
                        } else if (l(c)) {
                            b = h(c);
                        } else if (y) {
                            u = false;
                            b = f(a, true);
                        } else if (B) {
                            u = false;
                            b = g(a, true);
                        } else {
                            b = [];
                        }
                    } else if (p(a) || j(a)) {
                        b = c;
                        if (j(c)) {
                            b = s(c);
                        } else if (!o(c) || n(c)) {
                            b = i(a);
                        }
                    } else {
                        u = false;
                    }
                }
                if (u) {
                    t.set(a, b);
                    D(b, a, C, w, t);
                    t["delete"](a);
                }
                e(v, d, b);
            }
            b.exports = c;
        },
        function(a, c, b) {
            (function(a) {
                var g = b(17);
                var d = true && c && !c.nodeType && c;
                var e = d && typeof a == "object" && a && !a.nodeType && a;
                var h = e && e.exports === d;
                var f = h ? g.Buffer : undefined, j = f ? f.allocUnsafe : undefined;
                function i(a, d) {
                    if (d) {
                        return a.slice();
                    }
                    var b = a.length, c = j ? j(b) : new a.constructor(b);
                    a.copy(c);
                    return c;
                }
                a.exports = i;
            }.call(this, b(38)(a)));
        },
        function(a, d, b) {
            var e = b(126);
            function c(a, b) {
                var c = b ? e(a.buffer) : a.buffer;
                return new a.constructor(c, a.byteOffset, a.length);
            }
            a.exports = c;
        },
        function(a, d, b) {
            var e = b(127);
            function c(a) {
                var b = new a.constructor(a.byteLength);
                new e(b).set(new e(a));
                return b;
            }
            a.exports = c;
        },
        function(a, e, b) {
            var c = b(17);
            var d = c.Uint8Array;
            a.exports = d;
        },
        function(a, c) {
            function b(c, a) {
                var b = -1, d = c.length;
                a || (a = Array(d));
                while(++b < d){
                    a[b] = c[b];
                }
                return a;
            }
            a.exports = b;
        },
        function(b, d, a) {
            var e = a(130), f = a(50), g = a(51);
            function c(a) {
                return typeof a.constructor == "function" && !g(a) ? e(f(a)) : {};
            }
            b.exports = c;
        },
        function(a, d, b) {
            var e = b(14);
            var f = Object.create;
            var c = (function() {
                function a() {}
                return function(b) {
                    if (!e(b)) {
                        return {};
                    }
                    if (f) {
                        return f(b);
                    }
                    a.prototype = b;
                    var c = new a();
                    a.prototype = undefined;
                    return c;
                };
            })();
            a.exports = c;
        },
        function(a, c) {
            function b(a, b) {
                return function(c) {
                    return a(b(c));
                };
            }
            a.exports = b;
        },
        function(b, d, a) {
            var e = a(22), f = a(18);
            var g = "[object Arguments]";
            function c(a) {
                return f(a) && e(a) == g;
            }
            b.exports = c;
        },
        function(b, d, a) {
            var e = a(39), f = a(18);
            function c(a) {
                return f(a) && e(a);
            }
            b.exports = c;
        },
        function(a, c) {
            function b() {
                return false;
            }
            a.exports = b;
        },
        function(b, g, a) {
            var h = a(22), i = a(50), j = a(18);
            var k = "[object Object]";
            var c = Function.prototype, d = Object.prototype;
            var e = c.toString;
            var l = d.hasOwnProperty;
            var m = e.call(Object);
            function f(b) {
                if (!j(b) || h(b) != k) {
                    return false;
                }
                var c = i(b);
                if (c === null) {
                    return true;
                }
                var a = l.call(c, "constructor") && c.constructor;
                return (typeof a == "function" && a instanceof a && e.call(a) == m);
            }
            b.exports = f;
        },
        function(c, C, b) {
            var D = b(22), E = b(40), F = b(18);
            var d = "[object Arguments]", e = "[object Array]", f = "[object Boolean]", g = "[object Date]", h = "[object Error]", i = "[object Function]", j = "[object Map]", k = "[object Number]", l = "[object Object]", m = "[object RegExp]", n = "[object Set]", o = "[object String]", p = "[object WeakMap]";
            var q = "[object ArrayBuffer]", r = "[object DataView]", s = "[object Float32Array]", t = "[object Float64Array]", u = "[object Int8Array]", v = "[object Int16Array]", w = "[object Int32Array]", x = "[object Uint8Array]", y = "[object Uint8ClampedArray]", z = "[object Uint16Array]", A = "[object Uint32Array]";
            var a = {};
            a[s] = a[t] = a[u] = a[v] = a[w] = a[x] = a[y] = a[z] = a[A] = true;
            a[d] = a[e] = a[q] = a[f] = a[r] = a[g] = a[h] = a[i] = a[j] = a[k] = a[l] = a[m] = a[n] = a[o] = a[p] = false;
            function B(b) {
                return (F(b) && E(b.length) && !!a[D(b)]);
            }
            c.exports = B;
        },
        function(a, c) {
            function b(a) {
                return function(b) {
                    return a(b);
                };
            }
            a.exports = b;
        },
        function(a, c, b) {
            (function(a) {
                var f = b(45);
                var d = true && c && !c.nodeType && c;
                var e = d && typeof a == "object" && a && !a.nodeType && a;
                var g = e && e.exports === d;
                var i = g && f.process;
                var h = (function() {
                    try {
                        var a = e && e.require && e.require("util").types;
                        if (a) {
                            return a;
                        }
                        return (i && i.binding && i.binding("util"));
                    } catch (b) {}
                })();
                a.exports = h;
            }.call(this, b(38)(a)));
        },
        function(b, d, a) {
            var e = a(140), f = a(56);
            function c(a) {
                return e(a, f(a));
            }
            b.exports = c;
        },
        function(b, d, a) {
            var e = a(55), f = a(37);
            function c(d, g, a, h) {
                var j = !a;
                a || (a = {});
                var i = -1, k = g.length;
                while(++i < k){
                    var b = g[i];
                    var c = h ? h(a[b], d[b], b, a, d) : undefined;
                    if (c === undefined) {
                        c = d[b];
                    }
                    if (j) {
                        f(a, b, c);
                    } else {
                        e(a, b, c);
                    }
                }
                return a;
            }
            b.exports = c;
        },
        function(b, e, a) {
            var f = a(142), g = a(30), h = a(15), i = a(52), j = a(31), k = a(53);
            var c = Object.prototype;
            var l = c.hasOwnProperty;
            function d(b, p) {
                var c = h(b), d = !c && g(b), e = !c && !d && i(b), n = !c && !d && !e && k(b), o = c || d || e || n, m = o ? f(b.length, String) : [], q = m.length;
                for(var a in b){
                    if ((p || l.call(b, a)) && !(o && (a == "length" || (e && (a == "offset" || a == "parent")) || (n && (a == "buffer" || a == "byteLength" || a == "byteOffset")) || j(a, q)))) {
                        m.push(a);
                    }
                }
                return m;
            }
            b.exports = d;
        },
        function(a, c) {
            function b(b, d) {
                var a = -1, c = Array(b);
                while(++a < b){
                    c[a] = d(a);
                }
                return c;
            }
            a.exports = b;
        },
        function(b, e, a) {
            var f = a(14), g = a(51), h = a(144);
            var c = Object.prototype;
            var i = c.hasOwnProperty;
            function d(a) {
                if (!f(a)) {
                    return h(a);
                }
                var d = g(a), c = [];
                for(var b in a){
                    if (!(b == "constructor" && (d || !i.call(a, b)))) {
                        c.push(b);
                    }
                }
                return c;
            }
            b.exports = d;
        },
        function(a, c) {
            function b(a) {
                var b = [];
                if (a != null) {
                    for(var c in Object(a)){
                        b.push(c);
                    }
                }
                return b;
            }
            a.exports = b;
        },
        function(b, d, a) {
            var e = a(146), f = a(151);
            function c(a) {
                return e(function(e, c) {
                    var g = -1, b = c.length, d = b > 1 ? c[b - 1] : undefined, h = b > 2 ? c[2] : undefined;
                    d = a.length > 3 && typeof d == "function" ? (b--, d) : undefined;
                    if (h && f(c[0], c[1], h)) {
                        d = b < 3 ? undefined : d;
                        b = 1;
                    }
                    e = Object(e);
                    while(++g < b){
                        var i = c[g];
                        if (i) {
                            a(e, i, g, d);
                        }
                    }
                    return e;
                });
            }
            b.exports = c;
        },
        function(b, d, a) {
            var e = a(57), f = a(58), g = a(59);
            function c(a, b) {
                return g(f(a, b, e), a + "");
            }
            b.exports = c;
        },
        function(a, c) {
            function b(b, c, a) {
                switch(a.length){
                    case 0:
                        return b.call(c);
                    case 1:
                        return b.call(c, a[0]);
                    case 2:
                        return b.call(c, a[0], a[1]);
                    case 3:
                        return b.call(c, a[0], a[1], a[2]);
                }
                return b.apply(c, a);
            }
            a.exports = b;
        },
        function(b, f, a) {
            var g = a(149), c = a(49), d = a(57);
            var e = !c ? d : function(a, b) {
                return c(a, "toString", {
                    configurable: true,
                    enumerable: false,
                    value: g(b),
                    writable: true
                });
            };
            b.exports = e;
        },
        function(a, c) {
            function b(a) {
                return function() {
                    return a;
                };
            }
            a.exports = b;
        },
        function(a, c) {
            var d = 800, e = 16;
            var f = Date.now;
            function b(a) {
                var b = 0, c = 0;
                return function() {
                    var g = f(), h = e - (g - c);
                    c = g;
                    if (h > 0) {
                        if (++b >= d) {
                            return arguments[0];
                        }
                    } else {
                        b = 0;
                    }
                    return a.apply(undefined, arguments);
                };
            }
            a.exports = b;
        },
        function(b, d, a) {
            var e = a(26), f = a(39), g = a(31), h = a(14);
            function c(d, b, a) {
                if (!h(a)) {
                    return false;
                }
                var c = typeof b;
                if (c == "number" ? f(a) && g(b, a.length) : c == "string" && b in a) {
                    return e(a[b], d);
                }
                return false;
            }
            b.exports = c;
        },
        function(a, b) {
            if (typeof window !== "undefined") {
                if (!window.requestAnimationFrame) {
                    window.requestAnimationFrame = (function() {
                        return (window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(a) {
                            window.setTimeout(a, 1000 / 60);
                        });
                    })();
                }
            }
            if (typeof Math.imul !== "function") {
                Math.imul = function(a, b) {
                    var e = (a >>> 16) & 0xffff;
                    var c = a & 0xffff;
                    var f = (b >>> 16) & 0xffff;
                    var d = b & 0xffff;
                    return ((c * d + (((e * d + c * f) << 16) >>> 0)) | 0);
                };
            }
            if (typeof Object.assign !== "function") {
                Object.assign = function(d) {
                    "use strict";
                    if (d === null) {
                        throw new TypeError("Cannot convert undefined or null to object");
                    }
                    var e = Object(d);
                    for(var b = 1; b < arguments.length; b++){
                        var a = arguments[b];
                        if (a !== null) {
                            for(var c in a){
                                if (Object.prototype.hasOwnProperty.call(a, c)) {
                                    e[c] = a[c];
                                }
                            }
                        }
                    }
                    return e;
                };
            }
        },
        function(a, c) {
            function b(a) {
                if (Array.isArray(a)) return a;
            }
            a.exports = b;
            (a.exports["default"] = a.exports), (a.exports.__esModule = true);
        },
        function(a, c) {
            function b(b, e) {
                var a = b == null ? null : (typeof Symbol !== "undefined" && b[Symbol.iterator]) || b["@@iterator"];
                if (a == null) return;
                var c = [];
                var d = true;
                var f = false;
                var g, h;
                try {
                    for(a = a.call(b); !(d = (g = a.next()).done); d = true){
                        c.push(g.value);
                        if (e && c.length === e) break;
                    }
                } catch (i) {
                    f = true;
                    h = i;
                } finally{
                    try {
                        if (!d && a["return"] != null) a["return"]();
                    } finally{
                        if (f) throw h;
                    }
                }
                return c;
            }
            a.exports = b;
            (a.exports["default"] = a.exports), (a.exports.__esModule = true);
        },
        function(a, c) {
            function b() {
                throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
            }
            a.exports = b;
            (a.exports["default"] = a.exports), (a.exports.__esModule = true);
        },
        function(a, b) {
            a.exports = c;
            function c(b) {
                var a = new Float32Array(2);
                a[0] = b[0];
                a[1] = b[1];
                return a;
            }
        },
        function(a, b) {
            a.exports = c;
            function c(b, c) {
                var a = new Float32Array(2);
                a[0] = b;
                a[1] = c;
                return a;
            }
        },
        function(a, b) {
            a.exports = c;
            function c(a, b) {
                a[0] = b[0];
                a[1] = b[1];
                return a;
            }
        },
        function(a, b) {
            a.exports = c;
            function c(a, b, c) {
                a[0] = b;
                a[1] = c;
                return a;
            }
        },
        function(a, c, b) {
            a.exports = e;
            var d = b(62);
            function e(a, b) {
                var c = a[0];
                var e = a[1];
                var f = b[0];
                var g = b[1];
                return (Math.abs(c - f) <= d * Math.max(1.0, Math.abs(c), Math.abs(f)) && Math.abs(e - g) <= d * Math.max(1.0, Math.abs(e), Math.abs(g)));
            }
        },
        function(a, b) {
            a.exports = c;
            function c(a, b) {
                return a[0] === b[0] && a[1] === b[1];
            }
        },
        function(a, b) {
            a.exports = c;
            function c(a, b, c) {
                a[0] = b[0] + c[0];
                a[1] = b[1] + c[1];
                return a;
            }
        },
        function(a, c, b) {
            a.exports = b(64);
        },
        function(a, c, b) {
            a.exports = b(65);
        },
        function(a, c, b) {
            a.exports = b(66);
        },
        function(a, b) {
            a.exports = c;
            function c(a, b) {
                a[0] = 1.0 / b[0];
                a[1] = 1.0 / b[1];
                return a;
            }
        },
        function(a, b) {
            a.exports = c;
            function c(a, b, c) {
                a[0] = Math.min(b[0], c[0]);
                a[1] = Math.min(b[1], c[1]);
                return a;
            }
        },
        function(a, b) {
            a.exports = c;
            function c(a, b, c) {
                a[0] = Math.max(b[0], c[0]);
                a[1] = Math.max(b[1], c[1]);
                return a;
            }
        },
        function(a, b) {
            a.exports = c;
            function c(a, b, c) {
                var d = Math.cos(c), e = Math.sin(c);
                var f = b[0], g = b[1];
                a[0] = f * d - g * e;
                a[1] = f * e + g * d;
                return a;
            }
        },
        function(a, b) {
            a.exports = c;
            function c(a, b) {
                a[0] = Math.floor(b[0]);
                a[1] = Math.floor(b[1]);
                return a;
            }
        },
        function(a, b) {
            a.exports = c;
            function c(a, b) {
                a[0] = Math.ceil(b[0]);
                a[1] = Math.ceil(b[1]);
                return a;
            }
        },
        function(a, b) {
            a.exports = c;
            function c(a, b) {
                a[0] = Math.round(b[0]);
                a[1] = Math.round(b[1]);
                return a;
            }
        },
        function(a, b) {
            a.exports = c;
            function c(a, b, c) {
                a[0] = b[0] * c;
                a[1] = b[1] * c;
                return a;
            }
        },
        function(a, b) {
            a.exports = c;
            function c(a, b, c, d) {
                a[0] = b[0] + c[0] * d;
                a[1] = b[1] + c[1] * d;
                return a;
            }
        },
        function(a, c, b) {
            a.exports = b(67);
        },
        function(a, c, b) {
            a.exports = b(68);
        },
        function(a, c, b) {
            a.exports = b(69);
        },
        function(a, c, b) {
            a.exports = b(70);
        },
        function(a, b) {
            a.exports = c;
            function c(a, b) {
                a[0] = -b[0];
                a[1] = -b[1];
                return a;
            }
        },
        function(a, b) {
            a.exports = c;
            function c(c, b) {
                var d = b[0], e = b[1];
                var a = d * d + e * e;
                if (a > 0) {
                    a = 1 / Math.sqrt(a);
                    c[0] = b[0] * a;
                    c[1] = b[1] * a;
                }
                return c;
            }
        },
        function(a, b) {
            a.exports = c;
            function c(a, b) {
                return a[0] * b[0] + a[1] * b[1];
            }
        },
        function(a, b) {
            a.exports = c;
            function c(a, b, c) {
                var d = b[0] * c[1] - b[1] * c[0];
                a[0] = a[1] = 0;
                a[2] = d;
                return a;
            }
        },
        function(a, b) {
            a.exports = c;
            function c(a, b, c, d) {
                var e = b[0], f = b[1];
                a[0] = e + d * (c[0] - e);
                a[1] = f + d * (c[1] - f);
                return a;
            }
        },
        function(a, b) {
            a.exports = c;
            function c(b, a) {
                a = a || 1.0;
                var c = Math.random() * 2.0 * Math.PI;
                b[0] = Math.cos(c) * a;
                b[1] = Math.sin(c) * a;
                return b;
            }
        },
        function(a, b) {
            a.exports = c;
            function c(b, c, a) {
                var d = c[0], e = c[1];
                b[0] = a[0] * d + a[2] * e;
                b[1] = a[1] * d + a[3] * e;
                return b;
            }
        },
        function(a, b) {
            a.exports = c;
            function c(b, c, a) {
                var d = c[0], e = c[1];
                b[0] = a[0] * d + a[2] * e + a[4];
                b[1] = a[1] * d + a[3] * e + a[5];
                return b;
            }
        },
        function(a, b) {
            a.exports = c;
            function c(b, c, a) {
                var d = c[0], e = c[1];
                b[0] = a[0] * d + a[3] * e + a[6];
                b[1] = a[1] * d + a[4] * e + a[7];
                return b;
            }
        },
        function(a, b) {
            a.exports = c;
            function c(b, c, a) {
                var d = c[0], e = c[1];
                b[0] = a[0] * d + a[4] * e + a[12];
                b[1] = a[1] * d + a[5] * e + a[13];
                return b;
            }
        },
        function(a, c, b) {
            a.exports = e;
            var d = b(63)();
            function e(a, c, e, g, h, i) {
                var b, f;
                if (!c) {
                    c = 2;
                }
                if (!e) {
                    e = 0;
                }
                if (g) {
                    f = Math.min(g * c + e, a.length);
                } else {
                    f = a.length;
                }
                for(b = e; b < f; b += c){
                    d[0] = a[b];
                    d[1] = a[b + 1];
                    h(d, d, i);
                    a[b] = d[0];
                    a[b + 1] = d[1];
                }
                return a;
            }
        },
        function(a, b) {
            a.exports = c;
            function c(b, a, c) {
                var d = a[0] * a[0] + a[1] * a[1];
                if (d > c * c) {
                    var e = Math.sqrt(d);
                    b[0] = (a[0] / e) * c;
                    b[1] = (a[1] / e) * c;
                } else {
                    b[0] = a[0];
                    b[1] = a[1];
                }
                return b;
            }
        },
        function(a, b) {
            a.exports = c;
            function c(b) {
                var a = new Float32Array(3);
                a[0] = b[0];
                a[1] = b[1];
                a[2] = b[2];
                return a;
            }
        },
        function(b, c, a) {
            b.exports = g;
            var d = a(73);
            var e = a(74);
            var f = a(75);
            function g(a, b) {
                var c = d(a[0], a[1], a[2]);
                var g = d(b[0], b[1], b[2]);
                e(c, c);
                e(g, g);
                var h = f(c, g);
                if (h > 1.0) {
                    return 0;
                } else {
                    return Math.acos(h);
                }
            }
        },
        function(a, b) {
            a.exports = c;
            function c(a, b) {
                a[0] = b[0];
                a[1] = b[1];
                a[2] = b[2];
                return a;
            }
        },
        function(a, b) {
            a.exports = c;
            function c(a, b, c, d) {
                a[0] = b;
                a[1] = c;
                a[2] = d;
                return a;
            }
        },
        function(a, c, b) {
            a.exports = e;
            var d = b(71);
            function e(a, b) {
                var c = a[0];
                var e = a[1];
                var f = a[2];
                var g = b[0];
                var h = b[1];
                var i = b[2];
                return (Math.abs(c - g) <= d * Math.max(1.0, Math.abs(c), Math.abs(g)) && Math.abs(e - h) <= d * Math.max(1.0, Math.abs(e), Math.abs(h)) && Math.abs(f - i) <= d * Math.max(1.0, Math.abs(f), Math.abs(i)));
            }
        },
        function(a, b) {
            a.exports = c;
            function c(a, b) {
                return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
            }
        },
        function(a, b) {
            a.exports = c;
            function c(a, b, c) {
                a[0] = b[0] + c[0];
                a[1] = b[1] + c[1];
                a[2] = b[2] + c[2];
                return a;
            }
        },
        function(a, c, b) {
            a.exports = b(76);
        },
        function(a, c, b) {
            a.exports = b(77);
        },
        function(a, c, b) {
            a.exports = b(78);
        },
        function(a, b) {
            a.exports = c;
            function c(a, b, c) {
                a[0] = Math.min(b[0], c[0]);
                a[1] = Math.min(b[1], c[1]);
                a[2] = Math.min(b[2], c[2]);
                return a;
            }
        },
        function(a, b) {
            a.exports = c;
            function c(a, b, c) {
                a[0] = Math.max(b[0], c[0]);
                a[1] = Math.max(b[1], c[1]);
                a[2] = Math.max(b[2], c[2]);
                return a;
            }
        },
        function(a, b) {
            a.exports = c;
            function c(a, b) {
                a[0] = Math.floor(b[0]);
                a[1] = Math.floor(b[1]);
                a[2] = Math.floor(b[2]);
                return a;
            }
        },
        function(a, b) {
            a.exports = c;
            function c(a, b) {
                a[0] = Math.ceil(b[0]);
                a[1] = Math.ceil(b[1]);
                a[2] = Math.ceil(b[2]);
                return a;
            }
        },
        function(a, b) {
            a.exports = c;
            function c(a, b) {
                a[0] = Math.round(b[0]);
                a[1] = Math.round(b[1]);
                a[2] = Math.round(b[2]);
                return a;
            }
        },
        function(a, b) {
            a.exports = c;
            function c(a, b, c) {
                a[0] = b[0] * c;
                a[1] = b[1] * c;
                a[2] = b[2] * c;
                return a;
            }
        },
        function(a, b) {
            a.exports = c;
            function c(a, b, c, d) {
                a[0] = b[0] + c[0] * d;
                a[1] = b[1] + c[1] * d;
                a[2] = b[2] + c[2] * d;
                return a;
            }
        },
        function(a, c, b) {
            a.exports = b(79);
        },
        function(a, c, b) {
            a.exports = b(80);
        },
        function(a, c, b) {
            a.exports = b(81);
        },
        function(a, c, b) {
            a.exports = b(82);
        },
        function(a, b) {
            a.exports = c;
            function c(a, b) {
                a[0] = -b[0];
                a[1] = -b[1];
                a[2] = -b[2];
                return a;
            }
        },
        function(a, b) {
            a.exports = c;
            function c(a, b) {
                a[0] = 1.0 / b[0];
                a[1] = 1.0 / b[1];
                a[2] = 1.0 / b[2];
                return a;
            }
        },
        function(a, b) {
            a.exports = c;
            function c(a, b, c) {
                var d = b[0], e = b[1], f = b[2], g = c[0], h = c[1], i = c[2];
                a[0] = e * i - f * h;
                a[1] = f * g - d * i;
                a[2] = d * h - e * g;
                return a;
            }
        },
        function(a, b) {
            a.exports = c;
            function c(a, b, c, d) {
                var e = b[0], f = b[1], g = b[2];
                a[0] = e + d * (c[0] - e);
                a[1] = f + d * (c[1] - f);
                a[2] = g + d * (c[2] - g);
                return a;
            }
        },
        function(a, b) {
            a.exports = c;
            function c(a, b) {
                b = b || 1.0;
                var d = Math.random() * 2.0 * Math.PI;
                var c = Math.random() * 2.0 - 1.0;
                var e = Math.sqrt(1.0 - c * c) * b;
                a[0] = Math.cos(d) * e;
                a[1] = Math.sin(d) * e;
                a[2] = c * b;
                return a;
            }
        },
        function(a, b) {
            a.exports = c;
            function c(c, g, a) {
                var d = g[0], e = g[1], f = g[2], b = a[3] * d + a[7] * e + a[11] * f + a[15];
                b = b || 1.0;
                c[0] = (a[0] * d + a[4] * e + a[8] * f + a[12]) / b;
                c[1] = (a[1] * d + a[5] * e + a[9] * f + a[13]) / b;
                c[2] = (a[2] * d + a[6] * e + a[10] * f + a[14]) / b;
                return c;
            }
        },
        function(a, b) {
            a.exports = c;
            function c(b, c, a) {
                var d = c[0], e = c[1], f = c[2];
                b[0] = d * a[0] + e * a[3] + f * a[6];
                b[1] = d * a[1] + e * a[4] + f * a[7];
                b[2] = d * a[2] + e * a[5] + f * a[8];
                return b;
            }
        },
        function(a, b) {
            a.exports = c;
            function c(e, j, f) {
                var g = j[0], h = j[1], i = j[2], a = f[0], b = f[1], c = f[2], d = f[3], k = d * g + b * i - c * h, l = d * h + c * g - a * i, m = d * i + a * h - b * g, n = -a * g - b * h - c * i;
                e[0] = k * d + n * -a + l * -c - m * -b;
                e[1] = l * d + n * -b + m * -a - k * -c;
                e[2] = m * d + n * -c + k * -b - l * -a;
                return e;
            }
        },
        function(a, b) {
            a.exports = c;
            function c(a, b, c, d) {
                var e = c[1];
                var f = c[2];
                var g = b[1] - e;
                var h = b[2] - f;
                var i = Math.sin(d);
                var j = Math.cos(d);
                a[0] = b[0];
                a[1] = e + g * j - h * i;
                a[2] = f + g * i + h * j;
                return a;
            }
        },
        function(a, b) {
            a.exports = c;
            function c(a, b, c, d) {
                var e = c[0];
                var f = c[2];
                var g = b[0] - e;
                var h = b[2] - f;
                var i = Math.sin(d);
                var j = Math.cos(d);
                a[0] = e + h * i + g * j;
                a[1] = b[1];
                a[2] = f + h * j - g * i;
                return a;
            }
        },
        function(a, b) {
            a.exports = c;
            function c(a, b, c, d) {
                var e = c[0];
                var f = c[1];
                var g = b[0] - e;
                var h = b[1] - f;
                var i = Math.sin(d);
                var j = Math.cos(d);
                a[0] = e + g * j - h * i;
                a[1] = f + g * i + h * j;
                a[2] = b[2];
                return a;
            }
        },
        function(a, c, b) {
            a.exports = e;
            var d = b(72)();
            function e(a, c, e, g, h, i) {
                var b, f;
                if (!c) {
                    c = 3;
                }
                if (!e) {
                    e = 0;
                }
                if (g) {
                    f = Math.min(g * c + e, a.length);
                } else {
                    f = a.length;
                }
                for(b = e; b < f; b += c){
                    d[0] = a[b];
                    d[1] = a[b + 1];
                    d[2] = a[b + 2];
                    h(d, d, i);
                    a[b] = d[0];
                    a[b + 1] = d[1];
                    a[b + 2] = d[2];
                }
                return a;
            }
        },
        function(a, d, b) {
            var e = b(61);
            function c(a) {
                if (Array.isArray(a)) return e(a);
            }
            a.exports = c;
            (a.exports["default"] = a.exports), (a.exports.__esModule = true);
        },
        function(a, c) {
            function b(a) {
                if ((typeof Symbol !== "undefined" && a[Symbol.iterator] != null) || a["@@iterator"] != null) return Array.from(a);
            }
            a.exports = b;
            (a.exports["default"] = a.exports), (a.exports.__esModule = true);
        },
        function(a, c) {
            function b() {
                throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
            }
            a.exports = b;
            (a.exports["default"] = a.exports), (a.exports.__esModule = true);
        },
        function(a, d, b) {
            var e = b(2);
            function c(a, b) {
                while(!Object.prototype.hasOwnProperty.call(a, b)){
                    a = e(a);
                    if (a === null) break;
                }
                return a;
            }
            a.exports = c;
            (a.exports["default"] = a.exports), (a.exports.__esModule = true);
        },
        function(b, c, d) {
            var a = (function(a) {
                "use strict";
                var k = Object.prototype;
                var o = k.hasOwnProperty;
                var t;
                var e = typeof Symbol === "function" ? Symbol : {};
                var f = e.iterator || "@@iterator";
                var p = e.asyncIterator || "@@asyncIterator";
                var l = e.toStringTag || "@@toStringTag";
                function q(c, a, d, e) {
                    var f = a && a.prototype instanceof r ? a : r;
                    var b = Object.create(f.prototype);
                    var g = new n(e || []);
                    b._invoke = A(c, d, g);
                    return b;
                }
                a.wrap = q;
                function u(a, b, c) {
                    try {
                        return {
                            type: "normal",
                            arg: a.call(b, c)
                        };
                    } catch (d) {
                        return {
                            type: "throw",
                            arg: d
                        };
                    }
                }
                var v = "suspendedStart";
                var w = "suspendedYield";
                var x = "executing";
                var y = "completed";
                var z = {};
                function r() {}
                function g() {}
                function c() {}
                var h = {};
                h[f] = function() {
                    return this;
                };
                var i = Object.getPrototypeOf;
                var d = i && i(i(s([])));
                if (d && d !== k && o.call(d, f)) {
                    h = d;
                }
                var b = (c.prototype = r.prototype = Object.create(h));
                g.prototype = b.constructor = c;
                c.constructor = g;
                c[l] = g.displayName = "GeneratorFunction";
                function m(a) {
                    [
                        "next",
                        "throw",
                        "return"
                    ].forEach(function(b) {
                        a[b] = function(a) {
                            return this._invoke(b, a);
                        };
                    });
                }
                a.isGeneratorFunction = function(b) {
                    var a = typeof b === "function" && b.constructor;
                    return a ? a === g || (a.displayName || a.name) === "GeneratorFunction" : false;
                };
                a.mark = function(a) {
                    if (Object.setPrototypeOf) {
                        Object.setPrototypeOf(a, c);
                    } else {
                        a.__proto__ = c;
                        if (!(l in a)) {
                            a[l] = "GeneratorFunction";
                        }
                    }
                    a.prototype = Object.create(b);
                    return a;
                };
                a.awrap = function(a) {
                    return {
                        __await: a
                    };
                };
                function j(b, c) {
                    function d(f, g, j, h) {
                        var e = u(b[f], b, g);
                        if (e.type === "throw") {
                            h(e.arg);
                        } else {
                            var i = e.arg;
                            var a = i.value;
                            if (a && typeof a === "object" && o.call(a, "__await")) {
                                return c.resolve(a.__await).then(function(a) {
                                    d("next", a, j, h);
                                }, function(a) {
                                    d("throw", a, j, h);
                                });
                            }
                            return c.resolve(a).then(function(a) {
                                i.value = a;
                                j(i);
                            }, function(a) {
                                return d("throw", a, j, h);
                            });
                        }
                    }
                    var e;
                    function a(b, f) {
                        function a() {
                            return new c(function(a, c) {
                                d(b, f, a, c);
                            });
                        }
                        return (e = e ? e.then(a, a) : a());
                    }
                    this._invoke = a;
                }
                m(j.prototype);
                j.prototype[p] = function() {
                    return this;
                };
                a.AsyncIterator = j;
                a.async = function(e, c, f, g, b) {
                    if (b === void 0) b = Promise;
                    var d = new j(q(e, c, f, g), b);
                    return a.isGeneratorFunction(c) ? d : d.next().then(function(a) {
                        return a.done ? a.value : d.next();
                    });
                };
                function A(a, b, c) {
                    var d = v;
                    return function j(g, h) {
                        if (d === x) {
                            throw new Error("Generator is already running");
                        }
                        if (d === y) {
                            if (g === "throw") {
                                throw h;
                            }
                            return E();
                        }
                        c.method = g;
                        c.arg = h;
                        while(true){
                            var i = c.delegate;
                            if (i) {
                                var f = B(i, c);
                                if (f) {
                                    if (f === z) continue;
                                    return f;
                                }
                            }
                            if (c.method === "next") {
                                c.sent = c._sent = c.arg;
                            } else if (c.method === "throw") {
                                if (d === v) {
                                    d = y;
                                    throw c.arg;
                                }
                                c.dispatchException(c.arg);
                            } else if (c.method === "return") {
                                c.abrupt("return", c.arg);
                            }
                            d = x;
                            var e = u(a, b, c);
                            if (e.type === "normal") {
                                d = c.done ? y : w;
                                if (e.arg === z) {
                                    continue;
                                }
                                return {
                                    value: e.arg,
                                    done: c.done
                                };
                            } else if (e.type === "throw") {
                                d = y;
                                c.method = "throw";
                                c.arg = e.arg;
                            }
                        }
                    };
                }
                function B(b, a) {
                    var e = b.iterator[a.method];
                    if (e === t) {
                        a.delegate = null;
                        if (a.method === "throw") {
                            if (b.iterator["return"]) {
                                a.method = "return";
                                a.arg = t;
                                B(b, a);
                                if (a.method === "throw") {
                                    return z;
                                }
                            }
                            a.method = "throw";
                            a.arg = new TypeError("The iterator does not provide a 'throw' method");
                        }
                        return z;
                    }
                    var d = u(e, b.iterator, a.arg);
                    if (d.type === "throw") {
                        a.method = "throw";
                        a.arg = d.arg;
                        a.delegate = null;
                        return z;
                    }
                    var c = d.arg;
                    if (!c) {
                        a.method = "throw";
                        a.arg = new TypeError("iterator result is not an object");
                        a.delegate = null;
                        return z;
                    }
                    if (c.done) {
                        a[b.resultName] = c.value;
                        a.next = b.nextLoc;
                        if (a.method !== "return") {
                            a.method = "next";
                            a.arg = t;
                        }
                    } else {
                        return c;
                    }
                    a.delegate = null;
                    return z;
                }
                m(b);
                b[l] = "Generator";
                b[f] = function() {
                    return this;
                };
                b.toString = function() {
                    return "[object Generator]";
                };
                function C(a) {
                    var b = {
                        tryLoc: a[0]
                    };
                    if (1 in a) {
                        b.catchLoc = a[1];
                    }
                    if (2 in a) {
                        b.finallyLoc = a[2];
                        b.afterLoc = a[3];
                    }
                    this.tryEntries.push(b);
                }
                function D(b) {
                    var a = b.completion || {};
                    a.type = "normal";
                    delete a.arg;
                    b.completion = a;
                }
                function n(a) {
                    this.tryEntries = [
                        {
                            tryLoc: "root"
                        }, 
                    ];
                    a.forEach(C, this);
                    this.reset(true);
                }
                a.keys = function(b) {
                    var a = [];
                    for(var c in b){
                        a.push(c);
                    }
                    a.reverse();
                    return function c() {
                        while(a.length){
                            var d = a.pop();
                            if (d in b) {
                                c.value = d;
                                c.done = false;
                                return c;
                            }
                        }
                        c.done = true;
                        return c;
                    };
                };
                function s(a) {
                    if (a) {
                        var b = a[f];
                        if (b) {
                            return b.call(a);
                        }
                        if (typeof a.next === "function") {
                            return a;
                        }
                        if (!isNaN(a.length)) {
                            var d = -1, c = function b() {
                                while(++d < a.length){
                                    if (o.call(a, d)) {
                                        b.value = a[d];
                                        b.done = false;
                                        return b;
                                    }
                                }
                                b.value = t;
                                b.done = true;
                                return b;
                            };
                            return (c.next = c);
                        }
                    }
                    return {
                        next: E
                    };
                }
                a.values = s;
                function E() {
                    return {
                        value: t,
                        done: true
                    };
                }
                n.prototype = {
                    constructor: n,
                    reset: function(b) {
                        this.prev = 0;
                        this.next = 0;
                        this.sent = this._sent = t;
                        this.done = false;
                        this.delegate = null;
                        this.method = "next";
                        this.arg = t;
                        this.tryEntries.forEach(D);
                        if (!b) {
                            for(var a in this){
                                if (a.charAt(0) === "t" && o.call(this, a) && !isNaN(+a.slice(1))) {
                                    this[a] = t;
                                }
                            }
                        }
                    },
                    stop: function() {
                        this.done = true;
                        var b = this.tryEntries[0];
                        var a = b.completion;
                        if (a.type === "throw") {
                            throw a.arg;
                        }
                        return this.rval;
                    },
                    dispatchException: function(f) {
                        if (this.done) {
                            throw f;
                        }
                        var g = this;
                        function b(b, a) {
                            h.type = "throw";
                            h.arg = f;
                            g.next = b;
                            if (a) {
                                g.method = "next";
                                g.arg = t;
                            }
                            return !!a;
                        }
                        for(var c = this.tryEntries.length - 1; c >= 0; --c){
                            var a = this.tryEntries[c];
                            var h = a.completion;
                            if (a.tryLoc === "root") {
                                return b("end");
                            }
                            if (a.tryLoc <= this.prev) {
                                var d = o.call(a, "catchLoc");
                                var e = o.call(a, "finallyLoc");
                                if (d && e) {
                                    if (this.prev < a.catchLoc) {
                                        return b(a.catchLoc, true);
                                    } else if (this.prev < a.finallyLoc) {
                                        return b(a.finallyLoc);
                                    }
                                } else if (d) {
                                    if (this.prev < a.catchLoc) {
                                        return b(a.catchLoc, true);
                                    }
                                } else if (e) {
                                    if (this.prev < a.finallyLoc) {
                                        return b(a.finallyLoc);
                                    }
                                } else {
                                    throw new Error("try statement without catch or finally");
                                }
                            }
                        }
                    },
                    abrupt: function(c, d) {
                        for(var e = this.tryEntries.length - 1; e >= 0; --e){
                            var b = this.tryEntries[e];
                            if (b.tryLoc <= this.prev && o.call(b, "finallyLoc") && this.prev < b.finallyLoc) {
                                var a = b;
                                break;
                            }
                        }
                        if (a && (c === "break" || c === "continue") && a.tryLoc <= d && d <= a.finallyLoc) {
                            a = null;
                        }
                        var f = a ? a.completion : {};
                        f.type = c;
                        f.arg = d;
                        if (a) {
                            this.method = "next";
                            this.next = a.finallyLoc;
                            return z;
                        }
                        return this.complete(f);
                    },
                    complete: function(a, b) {
                        if (a.type === "throw") {
                            throw a.arg;
                        }
                        if (a.type === "break" || a.type === "continue") {
                            this.next = a.arg;
                        } else if (a.type === "return") {
                            this.rval = this.arg = a.arg;
                            this.method = "return";
                            this.next = "end";
                        } else if (a.type === "normal" && b) {
                            this.next = b;
                        }
                        return z;
                    },
                    finish: function(c) {
                        for(var b = this.tryEntries.length - 1; b >= 0; --b){
                            var a = this.tryEntries[b];
                            if (a.finallyLoc === c) {
                                this.complete(a.completion, a.afterLoc);
                                D(a);
                                return z;
                            }
                        }
                    },
                    catch: function(d) {
                        for(var a = this.tryEntries.length - 1; a >= 0; --a){
                            var b = this.tryEntries[a];
                            if (b.tryLoc === d) {
                                var c = b.completion;
                                if (c.type === "throw") {
                                    var e = c.arg;
                                    D(b);
                                }
                                return e;
                            }
                        }
                        throw new Error("illegal catch attempt");
                    },
                    delegateYield: function(a, b, c) {
                        this.delegate = {
                            iterator: s(a),
                            resultName: b,
                            nextLoc: c
                        };
                        if (this.method === "next") {
                            this.arg = t;
                        }
                        return z;
                    }
                };
                return a;
            })(true ? b.exports : undefined);
            try {
                regeneratorRuntime = a;
            } catch (e) {
                Function("r", "regeneratorRuntime = r")(a);
            }
        },
        function(b, d, a) {
            var e = a(230), f = a(240);
            function c(a, b) {
                return e(a, b, function(c, b) {
                    return f(a, b);
                });
            }
            b.exports = c;
        },
        function(b, d, a) {
            var e = a(231), f = a(239), g = a(32);
            function c(b, c, j) {
                var d = -1, k = c.length, h = {};
                while(++d < k){
                    var a = c[d], i = e(b, a);
                    if (j(i, a)) {
                        f(h, g(a, b), i);
                    }
                }
                return h;
            }
            b.exports = c;
        },
        function(b, d, a) {
            var e = a(32), f = a(43);
            function c(a, b) {
                b = e(b, a);
                var c = 0, d = b.length;
                while(a != null && c < d){
                    a = a[f(b[c++])];
                }
                return c && c == d ? a : undefined;
            }
            b.exports = c;
        },
        function(b, d, a) {
            var e = a(15), f = a(42);
            var g = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, h = /^\w*$/;
            function c(a, c) {
                if (e(a)) {
                    return false;
                }
                var b = typeof a;
                if (b == "number" || b == "symbol" || b == "boolean" || a == null || f(a)) {
                    return true;
                }
                return (h.test(a) || !g.test(a) || (c != null && a in Object(c)));
            }
            b.exports = c;
        },
        function(a, e, b) {
            var c = b(234);
            var f = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
            var g = /\\(\\)?/g;
            var d = c(function(a) {
                var b = [];
                if (a.charCodeAt(0) === 46) {
                    b.push("");
                }
                a.replace(f, function(a, c, d, e) {
                    b.push(d ? e.replace(g, "$1") : c || a);
                });
                return b;
            });
            a.exports = d;
        },
        function(a, d, b) {
            var e = b(235);
            var f = 500;
            function c(b) {
                var a = e(b, function(a) {
                    if (c.size === f) {
                        c.clear();
                    }
                    return a;
                });
                var c = a.cache;
                return a;
            }
            a.exports = c;
        },
        function(b, e, c) {
            var d = c(47);
            var f = "Expected a function";
            function a(e, b) {
                if (typeof e != "function" || (b != null && typeof b != "function")) {
                    throw new TypeError(f);
                }
                var c = function() {
                    var d = arguments, f = b ? b.apply(this, d) : d[0], a = c.cache;
                    if (a.has(f)) {
                        return a.get(f);
                    }
                    var g = e.apply(this, d);
                    c.cache = a.set(f, g) || a;
                    return g;
                };
                c.cache = new (a.Cache || d)();
                return c;
            }
            a.Cache = d;
            b.exports = a;
        },
        function(a, d, b) {
            var e = b(237);
            function c(a) {
                return a == null ? "" : e(a);
            }
            a.exports = c;
        },
        function(d, f, a) {
            var b = a(27), g = a(238), h = a(15), i = a(42);
            var j = 1 / 0;
            var c = b ? b.prototype : undefined, k = c ? c.toString : undefined;
            function e(a) {
                if (typeof a == "string") {
                    return a;
                }
                if (h(a)) {
                    return g(a, e) + "";
                }
                if (i(a)) {
                    return k ? k.call(a) : "";
                }
                var b = a + "";
                return b == "0" && 1 / a == -j ? "-0" : b;
            }
            d.exports = e;
        },
        function(a, c) {
            function b(a, e) {
                var b = -1, c = a == null ? 0 : a.length, d = Array(c);
                while(++b < c){
                    d[b] = e(a[b], b, a);
                }
                return d;
            }
            a.exports = b;
        },
        function(b, d, a) {
            var e = a(55), f = a(32), g = a(31), h = a(14), i = a(43);
            function c(b, d, o, m) {
                if (!h(b)) {
                    return b;
                }
                d = f(d, b);
                var j = -1, n = d.length, p = n - 1, c = b;
                while(c != null && ++j < n){
                    var a = i(d[j]), k = o;
                    if (a === "__proto__" || a === "constructor" || a === "prototype") {
                        return b;
                    }
                    if (j != p) {
                        var l = c[a];
                        k = m ? m(l, a, c) : undefined;
                        if (k === undefined) {
                            k = h(l) ? l : g(d[j + 1]) ? [] : {};
                        }
                    }
                    e(c, a, k);
                    c = c[a];
                }
                return b;
            }
            b.exports = c;
        },
        function(b, d, a) {
            var e = a(241), f = a(242);
            function c(a, b) {
                return a != null && f(a, b, e);
            }
            b.exports = c;
        },
        function(a, c) {
            function b(a, b) {
                return a != null && b in Object(a);
            }
            a.exports = b;
        },
        function(b, d, a) {
            var e = a(32), f = a(30), g = a(15), h = a(31), i = a(40), j = a(43);
            function c(a, c, m) {
                c = e(c, a);
                var d = -1, b = c.length, k = false;
                while(++d < b){
                    var l = j(c[d]);
                    if (!(k = a != null && m(a, l))) {
                        break;
                    }
                    a = a[l];
                }
                if (k || ++d != b) {
                    return k;
                }
                b = a == null ? 0 : a.length;
                return (!!b && i(b) && h(l, b) && (g(a) || f(a)));
            }
            b.exports = c;
        },
        function(b, d, a) {
            var e = a(244), f = a(58), g = a(59);
            function c(a) {
                return g(f(a, undefined, e), a + "");
            }
            b.exports = c;
        },
        function(a, d, b) {
            var e = b(245);
            function c(a) {
                var b = a == null ? 0 : a.length;
                return b ? e(a, 1) : [];
            }
            a.exports = c;
        },
        function(b, d, a) {
            var e = a(246), f = a(247);
            function c(h, g, b, i, a) {
                var j = -1, k = h.length;
                b || (b = f);
                a || (a = []);
                while(++j < k){
                    var d = h[j];
                    if (g > 0 && b(d)) {
                        if (g > 1) {
                            c(d, g - 1, b, i, a);
                        } else {
                            e(a, d);
                        }
                    } else if (!i) {
                        a[a.length] = d;
                    }
                }
                return a;
            }
            b.exports = c;
        },
        function(a, c) {
            function b(a, c) {
                var b = -1, d = c.length, e = a.length;
                while(++b < d){
                    a[e + b] = c[b];
                }
                return a;
            }
            a.exports = b;
        },
        function(c, e, a) {
            var b = a(27), f = a(30), g = a(15);
            var h = b ? b.isConcatSpreadable : undefined;
            function d(a) {
                return (g(a) || f(a) || !!(h && a && a[h]));
            }
            c.exports = d;
        },
        function(a, c) {
            function b(a) {
                return (Function.toString.call(a).indexOf("[native code]") !== -1);
            }
            a.exports = b;
            (a.exports["default"] = a.exports), (a.exports.__esModule = true);
        },
        function(a, d, b) {
            var e = b(41);
            var f = b(250);
            function c(b, d, g) {
                if (f()) {
                    a.exports = c = Reflect.construct;
                    (a.exports["default"] = a.exports), (a.exports.__esModule = true);
                } else {
                    a.exports = c = function h(d, f, b) {
                        var a = [
                            null
                        ];
                        a.push.apply(a, f);
                        var g = Function.bind.apply(d, a);
                        var c = new g();
                        if (b) e(c, b.prototype);
                        return c;
                    };
                    (a.exports["default"] = a.exports), (a.exports.__esModule = true);
                }
                return c.apply(null, arguments);
            }
            a.exports = c;
            (a.exports["default"] = a.exports), (a.exports.__esModule = true);
        },
        function(a, c) {
            function b() {
                if (typeof Reflect === "undefined" || !Reflect.construct) return false;
                if (Reflect.construct.sham) return false;
                if (typeof Proxy === "function") return true;
                try {
                    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
                    return true;
                } catch (a) {
                    return false;
                }
            }
            a.exports = b;
            (a.exports["default"] = a.exports), (a.exports.__esModule = true);
        },
        function(a, b) {
            a.exports = c;
            function c(a) {
                return a[0] * a[3] - a[2] * a[1];
            }
        },
        function(a, b) {
            a.exports = c;
            function c(a, b) {
                if (a === b) {
                    var c = b[1];
                    a[1] = b[2];
                    a[2] = c;
                } else {
                    a[0] = b[0];
                    a[1] = b[2];
                    a[2] = b[1];
                    a[3] = b[3];
                }
                return a;
            }
        },
        function(a, b) {
            a.exports = c;
            function c(a, b, c) {
                var d = b[0], e = b[1], f = b[2], g = b[3];
                var h = c[0], i = c[1], j = c[2], k = c[3];
                a[0] = d * h + f * i;
                a[1] = e * h + g * i;
                a[2] = d * j + f * k;
                a[3] = e * j + g * k;
                return a;
            }
        },
        function(a, b) {
            a.exports = c;
            function c(a) {
                a[0] = 1;
                a[1] = 0;
                a[2] = 0;
                a[3] = 1;
                return a;
            }
        },
        function(a, b) {
            a.exports = c;
            function c(a, b) {
                var c = b[0];
                a[0] = b[3];
                a[1] = -b[1];
                a[2] = -b[2];
                a[3] = c;
                return a;
            }
        },
        function(a, b) {
            a.exports = c;
            function c(a, b, e) {
                var f = b[0], g = b[1], h = b[2], i = b[3];
                var c = Math.sin(e);
                var d = Math.cos(e);
                a[0] = f * d + h * c;
                a[1] = g * d + i * c;
                a[2] = f * -c + h * d;
                a[3] = g * -c + i * d;
                return a;
            }
        },
        function(a, b) {
            a.exports = c;
            function c(b, c) {
                var d = c[0];
                var e = c[1];
                var f = c[2];
                var g = c[3];
                var a = d * g - f * e;
                if (!a) return null;
                a = 1.0 / a;
                b[0] = g * a;
                b[1] = -e * a;
                b[2] = -f * a;
                b[3] = d * a;
                return b;
            }
        },
        function(a, b) {
            a.exports = c;
            function c() {
                var a = new Float32Array(4);
                a[0] = 1;
                a[1] = 0;
                a[2] = 0;
                a[3] = 1;
                return a;
            }
        },
        function(a, b) {
            a.exports = c;
            function c(a, b, c) {
                var f = b[0], g = b[1], h = b[2], i = b[3];
                var d = c[0], e = c[1];
                a[0] = f * d;
                a[1] = g * d;
                a[2] = h * e;
                a[3] = i * e;
                return a;
            }
        },
        function(a, b) {
            a.exports = c;
            function c(a, b) {
                a[0] = b[0];
                a[1] = b[1];
                a[2] = b[2];
                a[3] = b[3];
                return a;
            }
        },
        function(a, b) {
            a.exports = c;
            function c(a) {
                return Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2));
            }
        },
        function(a, b) {
            a.exports = c;
            function c(c, d, a, b) {
                c[2] = b[2] / b[0];
                a[0] = b[0];
                a[1] = b[1];
                a[3] = b[3] - c[2] * a[1];
                return [
                    c,
                    d,
                    a
                ];
            }
        },
        function(ax, e, a) {
            "use strict";
            a.r(e);
            a.d(e, "BarcodeDecoder", function() {
                return bL;
            });
            a.d(e, "Readers", function() {
                return d;
            });
            a.d(e, "CameraAccess", function() {
                return al;
            });
            a.d(e, "ImageDebug", function() {
                return r["a"];
            });
            a.d(e, "ImageWrapper", function() {
                return q["a"];
            });
            a.d(e, "ResultCollector", function() {
                return am;
            });
            var d = {};
            a.r(d);
            a.d(d, "BarcodeReader", function() {
                return f;
            });
            a.d(d, "TwoOfFiveReader", function() {
                return Z;
            });
            a.d(d, "NewCodabarReader", function() {
                return K;
            });
            a.d(d, "Code128Reader", function() {
                return B;
            });
            a.d(d, "Code32Reader", function() {
                return ac;
            });
            a.d(d, "Code39Reader", function() {
                return i;
            });
            a.d(d, "Code39VINReader", function() {
                return I;
            });
            a.d(d, "Code93Reader", function() {
                return aa;
            });
            a.d(d, "EAN2Reader", function() {
                return Q;
            });
            a.d(d, "EAN5Reader", function() {
                return S;
            });
            a.d(d, "EAN8Reader", function() {
                return O;
            });
            a.d(d, "EANReader", function() {
                return g;
            });
            a.d(d, "I2of5Reader", function() {
                return W;
            });
            a.d(d, "UPCEReader", function() {
                return U;
            });
            a.d(d, "UPCReader", function() {
                return M;
            });
            var o = a(19);
            var ay = a.n(o);
            var p = a(16);
            var az = a.n(p);
            var aA = a(152);
            var q = a(11);
            var h = {};
            var aB = {
                DIR: {
                    UP: 1,
                    DOWN: -1
                }
            };
            h.getBarcodeLine = function(i, j, k) {
                var a = j.x | 0;
                var b = j.y | 0;
                var c = k.x | 0;
                var e = k.y | 0;
                var l = Math.abs(e - b) > Math.abs(c - a);
                var g;
                var h;
                var d;
                var f;
                var o = [];
                var t = i.data;
                var u = i.size.x;
                var v;
                var p = 255;
                var q = 0;
                function m(a, b) {
                    v = t[b * u + a];
                    p = v < p ? v : p;
                    q = v > q ? v : q;
                    o.push(v);
                }
                if (l) {
                    d = a;
                    a = b;
                    b = d;
                    d = c;
                    c = e;
                    e = d;
                }
                if (a > c) {
                    d = a;
                    a = c;
                    c = d;
                    d = b;
                    b = e;
                    e = d;
                }
                var n = c - a;
                var r = Math.abs(e - b);
                g = (n / 2) | 0;
                h = b;
                var s = b < e ? 1 : -1;
                for(f = a; f < c; f++){
                    if (l) {
                        m(h, f);
                    } else {
                        m(f, h);
                    }
                    g -= r;
                    if (g < 0) {
                        h += s;
                        g += n;
                    }
                }
                return {
                    line: o,
                    min: p,
                    max: q
                };
            };
            h.toBinaryLine = function(i) {
                var j = i.min;
                var m = i.max;
                var b = i.line;
                var k;
                var l;
                var g = j + (m - j) / 2;
                var c = [];
                var h;
                var f;
                var e = (m - j) / 12;
                var n = -e;
                var a;
                var d;
                h = b[0] > g ? aB.DIR.UP : aB.DIR.DOWN;
                c.push({
                    pos: 0,
                    val: b[0]
                });
                for(a = 0; a < b.length - 2; a++){
                    k = b[a + 1] - b[a];
                    l = b[a + 2] - b[a + 1];
                    if (k + l < n && b[a + 1] < g * 1.5) {
                        f = aB.DIR.DOWN;
                    } else if (k + l > e && b[a + 1] > g * 0.5) {
                        f = aB.DIR.UP;
                    } else {
                        f = h;
                    }
                    if (h !== f) {
                        c.push({
                            pos: a,
                            val: b[a]
                        });
                        h = f;
                    }
                }
                c.push({
                    pos: b.length,
                    val: b[b.length - 1]
                });
                for(d = c[0].pos; d < c[1].pos; d++){
                    b[d] = b[d] > g ? 0 : 1;
                }
                for(a = 1; a < c.length - 1; a++){
                    if (c[a + 1].val > c[a].val) {
                        e = (c[a].val + ((c[a + 1].val - c[a].val) / 3) * 2) | 0;
                    } else {
                        e = (c[a + 1].val + (c[a].val - c[a + 1].val) / 3) | 0;
                    }
                    for(d = c[a].pos; d < c[a + 1].pos; d++){
                        b[d] = b[d] > e ? 0 : 1;
                    }
                }
                return {
                    line: b,
                    threshold: e
                };
            };
            h.debug = {
                printFrequency: function e(c, d) {
                    var a;
                    var b = d.getContext("2d");
                    d.width = c.length;
                    d.height = 256;
                    b.beginPath();
                    b.strokeStyle = "blue";
                    for(a = 0; a < c.length; a++){
                        b.moveTo(a, 255);
                        b.lineTo(a, 255 - c[a]);
                    }
                    b.stroke();
                    b.closePath();
                },
                printPattern: function e(b, c) {
                    var d = c.getContext("2d");
                    var a;
                    c.width = b.length;
                    d.fillColor = "black";
                    for(a = 0; a < b.length; a++){
                        if (b[a] === 1) {
                            d.fillRect(a, 0, 1, 100);
                        }
                    }
                }
            };
            var aC = h;
            var r = a(9);
            var s = a(3);
            var aD = a.n(s);
            var t = a(4);
            var aE = a.n(t);
            var u = a(1);
            var aF = a.n(u);
            var v = a(6);
            var aG = a.n(v);
            var w = a(5);
            var aH = a.n(w);
            var x = a(2);
            var aI = a.n(x);
            var y = a(0);
            var aJ = a.n(y);
            var aK = a(10);
            var j;
            (function(a) {
                a[(a["Forward"] = 1)] = "Forward";
                a[(a["Reverse"] = -1)] = "Reverse";
            })(j || (j = {}));
            var z = (function() {
                function a(c, b) {
                    aD()(this, a);
                    aJ()(this, "_row", []);
                    aJ()(this, "config", {});
                    aJ()(this, "supplements", []);
                    aJ()(this, "SINGLE_CODE_ERROR", 0);
                    aJ()(this, "FORMAT", "unknown");
                    aJ()(this, "CONFIG_KEYS", {});
                    this._row = [];
                    this.config = c || {};
                    if (b) {
                        this.supplements = b;
                    }
                    return this;
                }
                aE()(a, [
                    {
                        key: "_nextUnset",
                        value: function d(b) {
                            var c = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
                            for(var a = c; a < b.length; a++){
                                if (!b[a]) return a;
                            }
                            return b.length;
                        }
                    },
                    {
                        key: "_matchPattern",
                        value: function m(a, j, b) {
                            var k = 0;
                            var f = 0;
                            var g = 0;
                            var c = 0;
                            var h = 0;
                            var l = 0;
                            var i = 0;
                            b = b || this.SINGLE_CODE_ERROR || 1;
                            for(var d = 0; d < a.length; d++){
                                g += a[d];
                                c += j[d];
                            }
                            if (g < c) {
                                return Number.MAX_VALUE;
                            }
                            h = g / c;
                            b *= h;
                            for(var e = 0; e < a.length; e++){
                                l = a[e];
                                i = j[e] * h;
                                f = Math.abs(l - i) / i;
                                if (f > b) {
                                    return Number.MAX_VALUE;
                                }
                                k += f;
                            }
                            return k / c;
                        }
                    },
                    {
                        key: "_nextSet",
                        value: function d(b) {
                            var c = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
                            for(var a = c; a < b.length; a++){
                                if (b[a]) return a;
                            }
                            return b.length;
                        }
                    },
                    {
                        key: "_correctBars",
                        value: function f(d, e, a) {
                            var b = a.length;
                            var c = 0;
                            while(b--){
                                c = d[a[b]] * (1 - (1 - e) / 2);
                                if (c > 1) {
                                    d[a[b]] = c;
                                }
                            }
                        }
                    },
                    {
                        key: "decodePattern",
                        value: function c(b) {
                            this._row = b;
                            var a = this.decode();
                            if (a === null) {
                                this._row.reverse();
                                a = this.decode();
                                if (a) {
                                    a.direction = j.Reverse;
                                    a.start = this._row.length - a.start;
                                    a.end = this._row.length - a.end;
                                }
                            } else {
                                a.direction = j.Forward;
                            }
                            if (a) {
                                a.format = this.FORMAT;
                            }
                            return a;
                        }
                    },
                    {
                        key: "_matchRange",
                        value: function e(a, c, d) {
                            var b;
                            a = a < 0 ? 0 : a;
                            for(b = a; b < c; b++){
                                if (this._row[b] !== d) {
                                    return false;
                                }
                            }
                            return true;
                        }
                    },
                    {
                        key: "_fillCounters",
                        value: function g() {
                            var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._nextUnset(this._row);
                            var f = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this._row.length;
                            var c = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
                            var a = [];
                            var b = 0;
                            a[b] = 0;
                            for(var d = e; d < f; d++){
                                if (this._row[d] ^ (c ? 1 : 0)) {
                                    a[b]++;
                                } else {
                                    b++;
                                    a[b] = 1;
                                    c = !c;
                                }
                            }
                            return a;
                        }
                    },
                    {
                        key: "_toCounters",
                        value: function h(e, a) {
                            var f = a.length;
                            var g = this._row.length;
                            var c = !this._row[e];
                            var b = 0;
                            aK["a"].init(a, 0);
                            for(var d = e; d < g; d++){
                                if (this._row[d] ^ (c ? 1 : 0)) {
                                    a[b]++;
                                } else {
                                    b++;
                                    if (b === f) {
                                        break;
                                    } else {
                                        a[b] = 1;
                                        c = !c;
                                    }
                                }
                            }
                            return a;
                        }
                    }, 
                ], [
                    {
                        key: "Exception",
                        get: function a() {
                            return {
                                StartNotFoundException: "Start-Info was not found!",
                                CodeNotFoundException: "Code could not be found!",
                                PatternNotFoundException: "Pattern could not be found!"
                            };
                        }
                    }, 
                ]);
                return a;
            })();
            var f = z;
            function aL(a) {
                var b = aM();
                return function f() {
                    var d = aI()(a), c;
                    if (b) {
                        var e = aI()(this).constructor;
                        c = Reflect.construct(d, arguments, e);
                    } else {
                        c = d.apply(this, arguments);
                    }
                    return aH()(this, c);
                };
            }
            function aM() {
                if (typeof Reflect === "undefined" || !Reflect.construct) return false;
                if (Reflect.construct.sham) return false;
                if (typeof Proxy === "function") return true;
                try {
                    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
                    return true;
                } catch (a) {
                    return false;
                }
            }
            var A = (function(b) {
                aG()(a, b);
                var c = aL(a);
                function a() {
                    var b;
                    aD()(this, a);
                    for(var e = arguments.length, f = new Array(e), d = 0; d < e; d++){
                        f[d] = arguments[d];
                    }
                    b = c.call.apply(c, [
                        this
                    ].concat(f));
                    aJ()(aF()(b), "CODE_SHIFT", 98);
                    aJ()(aF()(b), "CODE_C", 99);
                    aJ()(aF()(b), "CODE_B", 100);
                    aJ()(aF()(b), "CODE_A", 101);
                    aJ()(aF()(b), "START_CODE_A", 103);
                    aJ()(aF()(b), "START_CODE_B", 104);
                    aJ()(aF()(b), "START_CODE_C", 105);
                    aJ()(aF()(b), "STOP_CODE", 106);
                    aJ()(aF()(b), "CODE_PATTERN", [
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
                    aJ()(aF()(b), "SINGLE_CODE_ERROR", 0.64);
                    aJ()(aF()(b), "AVG_CODE_ERROR", 0.3);
                    aJ()(aF()(b), "FORMAT", "code_128");
                    aJ()(aF()(b), "MODULE_INDICES", {
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
                    return b;
                }
                aE()(a, [
                    {
                        key: "_decodeCode",
                        value: function k(f, h) {
                            var a = {
                                error: Number.MAX_VALUE,
                                code: -1,
                                start: f,
                                end: f,
                                correction: {
                                    bar: 1,
                                    space: 1
                                }
                            };
                            var b = [
                                0,
                                0,
                                0,
                                0,
                                0,
                                0
                            ];
                            var i = f;
                            var g = !this._row[i];
                            var c = 0;
                            for(var d = i; d < this._row.length; d++){
                                if (this._row[d] ^ (g ? 1 : 0)) {
                                    b[c]++;
                                } else {
                                    if (c === b.length - 1) {
                                        if (h) {
                                            this._correct(b, h);
                                        }
                                        for(var e = 0; e < this.CODE_PATTERN.length; e++){
                                            var j = this._matchPattern(b, this.CODE_PATTERN[e]);
                                            if (j < a.error) {
                                                a.code = e;
                                                a.error = j;
                                            }
                                        }
                                        a.end = d;
                                        if (a.code === -1 || a.error > this.AVG_CODE_ERROR) {
                                            return null;
                                        }
                                        if (this.CODE_PATTERN[a.code]) {
                                            a.correction.bar = this.calculateCorrection(this.CODE_PATTERN[a.code], b, this.MODULE_INDICES.bar);
                                            a.correction.space = this.calculateCorrection(this.CODE_PATTERN[a.code], b, this.MODULE_INDICES.space);
                                        }
                                        return a;
                                    } else {
                                        c++;
                                    }
                                    b[c] = 1;
                                    g = !g;
                                }
                            }
                            return null;
                        }
                    },
                    {
                        key: "_correct",
                        value: function c(a, b) {
                            this._correctBars(a, b.bar, this.MODULE_INDICES.bar);
                            this._correctBars(a, b.space, this.MODULE_INDICES.space);
                        }
                    },
                    {
                        key: "_findStart",
                        value: function k() {
                            var a = [
                                0,
                                0,
                                0,
                                0,
                                0,
                                0
                            ];
                            var i = this._nextSet(this._row);
                            var b = {
                                error: Number.MAX_VALUE,
                                code: -1,
                                start: 0,
                                end: 0,
                                correction: {
                                    bar: 1,
                                    space: 1
                                }
                            };
                            var g = false;
                            var c = 0;
                            for(var d = i; d < this._row.length; d++){
                                if (this._row[d] ^ (g ? 1 : 0)) {
                                    a[c]++;
                                } else {
                                    if (c === a.length - 1) {
                                        var j = a.reduce(function(a, b) {
                                            return a + b;
                                        }, 0);
                                        for(var e = this.START_CODE_A; e <= this.START_CODE_C; e++){
                                            var h = this._matchPattern(a, this.CODE_PATTERN[e]);
                                            if (h < b.error) {
                                                b.code = e;
                                                b.error = h;
                                            }
                                        }
                                        if (b.error < this.AVG_CODE_ERROR) {
                                            b.start = d - j;
                                            b.end = d;
                                            b.correction.bar = this.calculateCorrection(this.CODE_PATTERN[b.code], a, this.MODULE_INDICES.bar);
                                            b.correction.space = this.calculateCorrection(this.CODE_PATTERN[b.code], a, this.MODULE_INDICES.space);
                                            return b;
                                        }
                                        for(var f = 0; f < 4; f++){
                                            a[f] = a[f + 2];
                                        }
                                        a[4] = 0;
                                        a[5] = 0;
                                        c--;
                                    } else {
                                        c++;
                                    }
                                    a[c] = 1;
                                    g = !g;
                                }
                            }
                            return null;
                        }
                    },
                    {
                        key: "decode",
                        value: function m(n, o) {
                            var p = this;
                            var c = this._findStart();
                            if (c === null) {
                                return null;
                            }
                            var a = {
                                code: c.code,
                                start: c.start,
                                end: c.end,
                                correction: {
                                    bar: c.correction.bar,
                                    space: c.correction.space
                                }
                            };
                            var i = [];
                            i.push(a);
                            var j = a.code;
                            var b = (function(a) {
                                switch(a){
                                    case p.START_CODE_A:
                                        return p.CODE_A;
                                    case p.START_CODE_B:
                                        return p.CODE_B;
                                    case p.START_CODE_C:
                                        return p.CODE_C;
                                    default:
                                        return null;
                                }
                            })(a.code);
                            var e = false;
                            var f = false;
                            var l = f;
                            var g = true;
                            var k = 0;
                            var h = [];
                            var d = [];
                            while(!e){
                                l = f;
                                f = false;
                                a = this._decodeCode(a.end, a.correction);
                                if (a !== null) {
                                    if (a.code !== this.STOP_CODE) {
                                        g = true;
                                    }
                                    if (a.code !== this.STOP_CODE) {
                                        h.push(a.code);
                                        k++;
                                        j += k * a.code;
                                    }
                                    i.push(a);
                                    switch(b){
                                        case this.CODE_A:
                                            if (a.code < 64) {
                                                d.push(String.fromCharCode(32 + a.code));
                                            } else if (a.code < 96) {
                                                d.push(String.fromCharCode(a.code - 64));
                                            } else {
                                                if (a.code !== this.STOP_CODE) {
                                                    g = false;
                                                }
                                                switch(a.code){
                                                    case this.CODE_SHIFT:
                                                        f = true;
                                                        b = this.CODE_B;
                                                        break;
                                                    case this.CODE_B:
                                                        b = this.CODE_B;
                                                        break;
                                                    case this.CODE_C:
                                                        b = this.CODE_C;
                                                        break;
                                                    case this.STOP_CODE:
                                                        e = true;
                                                        break;
                                                }
                                            }
                                            break;
                                        case this.CODE_B:
                                            if (a.code < 96) {
                                                d.push(String.fromCharCode(32 + a.code));
                                            } else {
                                                if (a.code !== this.STOP_CODE) {
                                                    g = false;
                                                }
                                                switch(a.code){
                                                    case this.CODE_SHIFT:
                                                        f = true;
                                                        b = this.CODE_A;
                                                        break;
                                                    case this.CODE_A:
                                                        b = this.CODE_A;
                                                        break;
                                                    case this.CODE_C:
                                                        b = this.CODE_C;
                                                        break;
                                                    case this.STOP_CODE:
                                                        e = true;
                                                        break;
                                                }
                                            }
                                            break;
                                        case this.CODE_C:
                                            if (a.code < 100) {
                                                d.push(a.code < 10 ? "0" + a.code : a.code);
                                            } else {
                                                if (a.code !== this.STOP_CODE) {
                                                    g = false;
                                                }
                                                switch(a.code){
                                                    case this.CODE_A:
                                                        b = this.CODE_A;
                                                        break;
                                                    case this.CODE_B:
                                                        b = this.CODE_B;
                                                        break;
                                                    case this.STOP_CODE:
                                                        e = true;
                                                        break;
                                                }
                                            }
                                            break;
                                    }
                                } else {
                                    e = true;
                                }
                                if (l) {
                                    b = b === this.CODE_A ? this.CODE_B : this.CODE_A;
                                }
                            }
                            if (a === null) {
                                return null;
                            }
                            a.end = this._nextUnset(this._row, a.end);
                            if (!this._verifyTrailingWhitespace(a)) {
                                return null;
                            }
                            j -= k * h[h.length - 1];
                            if (j % 103 !== h[h.length - 1]) {
                                return null;
                            }
                            if (!d.length) {
                                return null;
                            }
                            if (g) {
                                d.splice(d.length - 1, 1);
                            }
                            return {
                                code: d.join(""),
                                start: c.start,
                                end: a.end,
                                codeset: b,
                                startInfo: c,
                                decodedCodes: i,
                                endInfo: a,
                                format: this.FORMAT
                            };
                        }
                    },
                    {
                        key: "_verifyTrailingWhitespace",
                        value: function d(a) {
                            var c = this, b;
                            b = a.end + (a.end - a.start) / 2;
                            if (b < c._row.length) {
                                if (c._matchRange(a.end, b, 0)) {
                                    return a;
                                }
                            }
                            return null;
                        }
                    },
                    {
                        key: "calculateCorrection",
                        value: function g(e, f, a) {
                            var b = a.length, c = 0, d = 0;
                            while(b--){
                                d += e[a[b]];
                                c += f[a[b]];
                            }
                            return d / c;
                        }
                    }, 
                ]);
                return a;
            })(f);
            var B = A;
            function aN(c, d) {
                var a = Object.keys(c);
                if (Object.getOwnPropertySymbols) {
                    var b = Object.getOwnPropertySymbols(c);
                    if (d) {
                        b = b.filter(function(a) {
                            return Object.getOwnPropertyDescriptor(c, a).enumerable;
                        });
                    }
                    a.push.apply(a, b);
                }
                return a;
            }
            function aO(c) {
                for(var a = 1; a < arguments.length; a++){
                    var b = arguments[a] != null ? arguments[a] : {};
                    if (a % 2) {
                        aN(Object(b), true).forEach(function(a) {
                            aJ()(c, a, b[a]);
                        });
                    } else if (Object.getOwnPropertyDescriptors) {
                        Object.defineProperties(c, Object.getOwnPropertyDescriptors(b));
                    } else {
                        aN(Object(b)).forEach(function(a) {
                            Object.defineProperty(c, a, Object.getOwnPropertyDescriptor(b, a));
                        });
                    }
                }
                return c;
            }
            function aP(a) {
                var b = aQ();
                return function f() {
                    var d = aI()(a), c;
                    if (b) {
                        var e = aI()(this).constructor;
                        c = Reflect.construct(d, arguments, e);
                    } else {
                        c = d.apply(this, arguments);
                    }
                    return aH()(this, c);
                };
            }
            function aQ() {
                if (typeof Reflect === "undefined" || !Reflect.construct) return false;
                if (Reflect.construct.sham) return false;
                if (typeof Proxy === "function") return true;
                try {
                    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
                    return true;
                } catch (a) {
                    return false;
                }
            }
            var aR = 10;
            var aS = [
                1,
                1,
                1
            ];
            var aT = [
                1,
                1,
                1,
                1,
                1
            ];
            var aU = [
                1,
                1,
                2
            ];
            var aV = [
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
            var aW = [
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
            var aX = 0.48;
            var C = (function(b) {
                aG()(a, b);
                var c = aP(a);
                function a(d, e) {
                    var b;
                    aD()(this, a);
                    b = c.call(this, az()({
                        supplements: []
                    }, d), e);
                    aJ()(aF()(b), "FORMAT", "ean_13");
                    aJ()(aF()(b), "SINGLE_CODE_ERROR", 0.7);
                    aJ()(aF()(b), "STOP_PATTERN", [
                        1,
                        1,
                        1
                    ]);
                    return b;
                }
                aE()(a, [
                    {
                        key: "_findPattern",
                        value: function m(j, f, g, k) {
                            var a = new Array(j.length).fill(0);
                            var b = {
                                error: Number.MAX_VALUE,
                                start: 0,
                                end: 0
                            };
                            var l = aX;
                            var c = 0;
                            if (!f) {
                                f = this._nextSet(this._row);
                            }
                            var h = false;
                            for(var d = f; d < this._row.length; d++){
                                if (this._row[d] ^ (g ? 1 : 0)) {
                                    a[c] += 1;
                                } else {
                                    if (c === a.length - 1) {
                                        var i = this._matchPattern(a, j);
                                        if (i < l && b.error && i < b.error) {
                                            h = true;
                                            b.error = i;
                                            b.start = d - a.reduce(function(a, b) {
                                                return a + b;
                                            }, 0);
                                            b.end = d;
                                            return b;
                                        }
                                        if (k) {
                                            for(var e = 0; e < a.length - 2; e++){
                                                a[e] = a[e + 2];
                                            }
                                            a[a.length - 2] = 0;
                                            a[a.length - 1] = 0;
                                            c--;
                                        }
                                    } else {
                                        c++;
                                    }
                                    a[c] = 1;
                                    g = !g;
                                }
                            }
                            if (h) {} else {}
                            return h ? b : null;
                        }
                    },
                    {
                        key: "_decodeCode",
                        value: function m(f, g) {
                            var b = [
                                0,
                                0,
                                0,
                                0
                            ];
                            var i = f;
                            var a = {
                                error: Number.MAX_VALUE,
                                code: -1,
                                start: f,
                                end: f
                            };
                            var k = aX;
                            var h = !this._row[i];
                            var c = 0;
                            if (!g) {
                                g = aV.length;
                            }
                            var l = false;
                            for(var d = i; d < this._row.length; d++){
                                if (this._row[d] ^ (h ? 1 : 0)) {
                                    b[c]++;
                                } else {
                                    if (c === b.length - 1) {
                                        for(var e = 0; e < g; e++){
                                            var j = this._matchPattern(b, aV[e]);
                                            a.end = d;
                                            if (j < a.error) {
                                                a.code = e;
                                                a.error = j;
                                            }
                                        }
                                        if (a.error > k) {
                                            return null;
                                        }
                                        return a;
                                    } else {
                                        c++;
                                    }
                                    b[c] = 1;
                                    h = !h;
                                }
                            }
                            return l ? a : null;
                        }
                    },
                    {
                        key: "_findStart",
                        value: function d() {
                            var b = this._nextSet(this._row);
                            var a = null;
                            while(!a){
                                a = this._findPattern(aS, b, false, true);
                                if (!a) {
                                    return null;
                                }
                                var c = a.start - (a.end - a.start);
                                if (c >= 0) {
                                    if (this._matchRange(c, a.start, 0)) {
                                        return a;
                                    }
                                }
                                b = a.end;
                                a = null;
                            }
                            return null;
                        }
                    },
                    {
                        key: "_calculateFirstDigit",
                        value: function c(b) {
                            for(var a = 0; a < aW.length; a++){
                                if (b === aW[a]) {
                                    return a;
                                }
                            }
                            return null;
                        }
                    },
                    {
                        key: "_decodePayload",
                        value: function j(i, d, e) {
                            var b = aO({}, i);
                            var f = 0x0;
                            for(var c = 0; c < 6; c++){
                                b = this._decodeCode(b.end);
                                if (!b) {
                                    return null;
                                }
                                if (b.code >= aR) {
                                    b.code -= aR;
                                    f |= 1 << (5 - c);
                                } else {
                                    f |= 0 << (5 - c);
                                }
                                d.push(b.code);
                                e.push(b);
                            }
                            var g = this._calculateFirstDigit(f);
                            if (g === null) {
                                return null;
                            }
                            d.unshift(g);
                            var a = this._findPattern(aT, b.end, true, false);
                            if (a === null || !a.end) {
                                return null;
                            }
                            e.push(a);
                            for(var h = 0; h < 6; h++){
                                a = this._decodeCode(a.end, aR);
                                if (!a) {
                                    return null;
                                }
                                e.push(a);
                                d.push(a.code);
                            }
                            return a;
                        }
                    },
                    {
                        key: "_verifyTrailingWhitespace",
                        value: function c(a) {
                            var b = a.end + (a.end - a.start);
                            if (b < this._row.length) {
                                if (this._matchRange(a.end, b, 0)) {
                                    return a;
                                }
                            }
                            return null;
                        }
                    },
                    {
                        key: "_findEnd",
                        value: function d(b, c) {
                            var a = this._findPattern(this.STOP_PATTERN, b, c, false);
                            return a !== null ? this._verifyTrailingWhitespace(a) : null;
                        }
                    },
                    {
                        key: "_checksum",
                        value: function e(a) {
                            var b = 0;
                            for(var c = a.length - 2; c >= 0; c -= 2){
                                b += a[c];
                            }
                            b *= 3;
                            for(var d = a.length - 1; d >= 0; d -= 2){
                                b += a[d];
                            }
                            return b % 10 === 0;
                        }
                    },
                    {
                        key: "_decodeExtensions",
                        value: function g(e) {
                            var d = this._nextSet(this._row, e);
                            var c = this._findPattern(aU, d, false, false);
                            if (c === null) {
                                return null;
                            }
                            for(var a = 0; a < this.supplements.length; a++){
                                try {
                                    var b = this.supplements[a].decode(this._row, c.end);
                                    if (b !== null) {
                                        return {
                                            code: b.code,
                                            start: d,
                                            startInfo: c,
                                            end: b.end,
                                            decodedCodes: b.decodedCodes,
                                            format: this.supplements[a].FORMAT
                                        };
                                    }
                                } catch (f) {
                                    console.error("* decodeExtensions error in ", this.supplements[a], ": ", f);
                                }
                            }
                            return null;
                        }
                    },
                    {
                        key: "decode",
                        value: function i(j, k) {
                            var d = new Array();
                            var e = new Array();
                            var g = {};
                            var c = this._findStart();
                            if (!c) {
                                return null;
                            }
                            var a = {
                                start: c.start,
                                end: c.end
                            };
                            e.push(a);
                            a = this._decodePayload(a, d, e);
                            if (!a) {
                                return null;
                            }
                            a = this._findEnd(a.end, false);
                            if (!a) {
                                return null;
                            }
                            e.push(a);
                            if (!this._checksum(d)) {
                                return null;
                            }
                            if (this.supplements.length > 0) {
                                var b = this._decodeExtensions(a.end);
                                if (!b) {
                                    return null;
                                }
                                if (!b.decodedCodes) {
                                    return null;
                                }
                                var f = b.decodedCodes[b.decodedCodes.length - 1];
                                var h = {
                                    start: f.start + (((f.end - f.start) / 2) | 0),
                                    end: f.end
                                };
                                if (!this._verifyTrailingWhitespace(h)) {
                                    return null;
                                }
                                g = {
                                    supplement: b,
                                    code: d.join("") + b.code
                                };
                            }
                            return aO(aO({
                                code: d.join(""),
                                start: c.start,
                                end: a.end,
                                startInfo: c,
                                decodedCodes: e
                            }, g), {}, {
                                format: this.FORMAT
                            });
                        }
                    }, 
                ]);
                return a;
            })(f);
            var g = C;
            var D = a(33);
            var k = a.n(D);
            function aY(a) {
                var b = aZ();
                return function f() {
                    var d = aI()(a), c;
                    if (b) {
                        var e = aI()(this).constructor;
                        c = Reflect.construct(d, arguments, e);
                    } else {
                        c = d.apply(this, arguments);
                    }
                    return aH()(this, c);
                };
            }
            function aZ() {
                if (typeof Reflect === "undefined" || !Reflect.construct) return false;
                if (Reflect.construct.sham) return false;
                if (typeof Proxy === "function") return true;
                try {
                    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
                    return true;
                } catch (a) {
                    return false;
                }
            }
            var E = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. *$/+%";
            var a$ = new Uint16Array(k()(E).map(function(a) {
                return a.charCodeAt(0);
            }));
            var a_ = new Uint16Array([
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
            var a0 = 0x094;
            var F = (function(b) {
                aG()(a, b);
                var c = aY(a);
                function a() {
                    var d;
                    aD()(this, a);
                    for(var e = arguments.length, f = new Array(e), b = 0; b < e; b++){
                        f[b] = arguments[b];
                    }
                    d = c.call.apply(c, [
                        this
                    ].concat(f));
                    aJ()(aF()(d), "FORMAT", "code_39");
                    return d;
                }
                aE()(a, [
                    {
                        key: "_findStart",
                        value: function i() {
                            var g = this._nextSet(this._row);
                            var b = g;
                            var a = new Uint16Array([
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
                            var c = 0;
                            var f = false;
                            for(var d = g; d < this._row.length; d++){
                                if (this._row[d] ^ (f ? 1 : 0)) {
                                    a[c]++;
                                } else {
                                    if (c === a.length - 1) {
                                        if (this._toPattern(a) === a0) {
                                            var h = Math.floor(Math.max(0, b - (d - b) / 4));
                                            if (this._matchRange(h, b, 0)) {
                                                return {
                                                    start: b,
                                                    end: d
                                                };
                                            }
                                        }
                                        b += a[0] + a[1];
                                        for(var e = 0; e < 7; e++){
                                            a[e] = a[e + 2];
                                        }
                                        a[7] = 0;
                                        a[8] = 0;
                                        c--;
                                    } else {
                                        c++;
                                    }
                                    a[c] = 1;
                                    f = !f;
                                }
                            }
                            return null;
                        }
                    },
                    {
                        key: "_toPattern",
                        value: function i(a) {
                            var d = a.length;
                            var e = 0;
                            var b = d;
                            var g = 0;
                            while(b > 3){
                                e = this._findNextWidth(a, e);
                                b = 0;
                                var h = 0;
                                for(var c = 0; c < d; c++){
                                    if (a[c] > e) {
                                        h |= 1 << (d - 1 - c);
                                        b++;
                                        g += a[c];
                                    }
                                }
                                if (b === 3) {
                                    for(var f = 0; f < d && b > 0; f++){
                                        if (a[f] > e) {
                                            b--;
                                            if (a[f] * 2 >= g) {
                                                return -1;
                                            }
                                        }
                                    }
                                    return h;
                                }
                            }
                            return -1;
                        }
                    },
                    {
                        key: "_findNextWidth",
                        value: function e(b, d) {
                            var c = Number.MAX_VALUE;
                            for(var a = 0; a < b.length; a++){
                                if (b[a] < c && b[a] > d) {
                                    c = b[a];
                                }
                            }
                            return c;
                        }
                    },
                    {
                        key: "_patternToChar",
                        value: function c(b) {
                            for(var a = 0; a < a_.length; a++){
                                if (a_[a] === b) {
                                    return String.fromCharCode(a$[a]);
                                }
                            }
                            return null;
                        }
                    },
                    {
                        key: "_verifyTrailingWhitespace",
                        value: function f(b, c, d) {
                            var a = aK["a"].sum(d);
                            var e = c - b - a;
                            if (e * 3 >= a) {
                                return true;
                            }
                            return false;
                        }
                    },
                    {
                        key: "decode",
                        value: function h(i, b) {
                            var c = new Uint16Array([
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
                            var d = [];
                            b = this._findStart();
                            if (!b) {
                                return null;
                            }
                            var a = this._nextSet(this._row, b.end);
                            var e;
                            var f;
                            do {
                                c = this._toCounters(a, c);
                                var g = this._toPattern(c);
                                if (g < 0) {
                                    return null;
                                }
                                e = this._patternToChar(g);
                                if (e === null) {
                                    return null;
                                }
                                d.push(e);
                                f = a;
                                a += aK["a"].sum(c);
                                a = this._nextSet(this._row, a);
                            }while (e !== "*")
                            d.pop();
                            if (!d.length) {
                                return null;
                            }
                            if (!this._verifyTrailingWhitespace(f, a, c)) {
                                return null;
                            }
                            return {
                                code: d.join(""),
                                start: b.start,
                                end: a,
                                startInfo: b,
                                decodedCodes: d,
                                format: this.FORMAT
                            };
                        }
                    }, 
                ]);
                return a;
            })(f);
            var i = F;
            var G = a(13);
            var a1 = a.n(G);
            function a2(a) {
                var b = a3();
                return function f() {
                    var d = aI()(a), c;
                    if (b) {
                        var e = aI()(this).constructor;
                        c = Reflect.construct(d, arguments, e);
                    } else {
                        c = d.apply(this, arguments);
                    }
                    return aH()(this, c);
                };
            }
            function a3() {
                if (typeof Reflect === "undefined" || !Reflect.construct) return false;
                if (Reflect.construct.sham) return false;
                if (typeof Proxy === "function") return true;
                try {
                    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
                    return true;
                } catch (a) {
                    return false;
                }
            }
            var a4 = {
                IOQ: /[IOQ]/g,
                AZ09: /[A-Z0-9]{17}/
            };
            var H = (function(b) {
                aG()(a, b);
                var c = a2(a);
                function a() {
                    var d;
                    aD()(this, a);
                    for(var e = arguments.length, f = new Array(e), b = 0; b < e; b++){
                        f[b] = arguments[b];
                    }
                    d = c.call.apply(c, [
                        this
                    ].concat(f));
                    aJ()(aF()(d), "FORMAT", "code_39_vin");
                    return d;
                }
                aE()(a, [
                    {
                        key: "_checkChecksum",
                        value: function b(a) {
                            return !!a;
                        }
                    },
                    {
                        key: "decode",
                        value: function f(d, e) {
                            var c = a1()(aI()(a.prototype), "decode", this).call(this, d, e);
                            if (!c) {
                                return null;
                            }
                            var b = c.code;
                            if (!b) {
                                return null;
                            }
                            b = b.replace(a4.IOQ, "");
                            if (!b.match(a4.AZ09)) {
                                if (true) {
                                    console.log("Failed AZ09 pattern code:", b);
                                }
                                return null;
                            }
                            if (!this._checkChecksum(b)) {
                                return null;
                            }
                            c.code = b;
                            return c;
                        }
                    }, 
                ]);
                return a;
            })(i);
            var I = H;
            function a5(a) {
                var b = a6();
                return function f() {
                    var d = aI()(a), c;
                    if (b) {
                        var e = aI()(this).constructor;
                        c = Reflect.construct(d, arguments, e);
                    } else {
                        c = d.apply(this, arguments);
                    }
                    return aH()(this, c);
                };
            }
            function a6() {
                if (typeof Reflect === "undefined" || !Reflect.construct) return false;
                if (Reflect.construct.sham) return false;
                if (typeof Proxy === "function") return true;
                try {
                    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
                    return true;
                } catch (a) {
                    return false;
                }
            }
            var a7 = [
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
            var a8 = [
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
            var a9 = [
                0x01a,
                0x029,
                0x00b,
                0x00e
            ];
            var ba = 4;
            var bb = 2.0;
            var bc = 1.5;
            var J = (function(b) {
                aG()(a, b);
                var c = a5(a);
                function a() {
                    var b;
                    aD()(this, a);
                    for(var e = arguments.length, f = new Array(e), d = 0; d < e; d++){
                        f[d] = arguments[d];
                    }
                    b = c.call.apply(c, [
                        this
                    ].concat(f));
                    aJ()(aF()(b), "_counters", []);
                    aJ()(aF()(b), "FORMAT", "codabar");
                    return b;
                }
                aE()(a, [
                    {
                        key: "_computeAlternatingThreshold",
                        value: function g(e, f) {
                            var b = Number.MAX_VALUE;
                            var c = 0;
                            var a = 0;
                            for(var d = e; d < f; d += 2){
                                a = this._counters[d];
                                if (a > c) {
                                    c = a;
                                }
                                if (a < b) {
                                    b = a;
                                }
                            }
                            return ((b + c) / 2.0) | 0;
                        }
                    },
                    {
                        key: "_toPattern",
                        value: function j(a) {
                            var c = 7;
                            var d = a + c;
                            if (d > this._counters.length) {
                                return -1;
                            }
                            var h = this._computeAlternatingThreshold(a, d);
                            var i = this._computeAlternatingThreshold(a + 1, d);
                            var e = 1 << (c - 1);
                            var f = 0;
                            var g = 0;
                            for(var b = 0; b < c; b++){
                                f = (b & 1) === 0 ? h : i;
                                if (this._counters[a + b] > f) {
                                    g |= e;
                                }
                                e >>= 1;
                            }
                            return g;
                        }
                    },
                    {
                        key: "_isStartEnd",
                        value: function c(b) {
                            for(var a = 0; a < a9.length; a++){
                                if (a9[a] === b) {
                                    return true;
                                }
                            }
                            return false;
                        }
                    },
                    {
                        key: "_sumCounters",
                        value: function e(c, d) {
                            var b = 0;
                            for(var a = c; a < d; a++){
                                b += this._counters[a];
                            }
                            return b;
                        }
                    },
                    {
                        key: "_findStart",
                        value: function e() {
                            var b = this._nextUnset(this._row);
                            var c = b;
                            for(var a = 1; a < this._counters.length; a++){
                                var d = this._toPattern(a);
                                if (d !== -1 && this._isStartEnd(d)) {
                                    b += this._sumCounters(0, a);
                                    c = b + this._sumCounters(a, a + 8);
                                    return {
                                        start: b,
                                        end: c,
                                        startCounter: a,
                                        endCounter: a + 8
                                    };
                                }
                            }
                            return null;
                        }
                    },
                    {
                        key: "_patternToChar",
                        value: function c(b) {
                            for(var a = 0; a < a8.length; a++){
                                if (a8[a] === b) {
                                    return String.fromCharCode(a7[a]);
                                }
                            }
                            return null;
                        }
                    },
                    {
                        key: "_calculatePatternLength",
                        value: function d(b) {
                            var c = 0;
                            for(var a = b; a < b + 7; a++){
                                c += this._counters[a];
                            }
                            return c;
                        }
                    },
                    {
                        key: "_verifyWhitespace",
                        value: function c(a, b) {
                            if (a - 1 <= 0 || this._counters[a - 1] >= this._calculatePatternLength(a) / 2.0) {
                                if (b + 8 >= this._counters.length || this._counters[b + 7] >= this._calculatePatternLength(b) / 2.0) {
                                    return true;
                                }
                            }
                            return false;
                        }
                    },
                    {
                        key: "_charToPattern",
                        value: function d(b) {
                            var c = b.charCodeAt(0);
                            for(var a = 0; a < a7.length; a++){
                                if (a7[a] === c) {
                                    return a8[a];
                                }
                            }
                            return 0x0;
                        }
                    },
                    {
                        key: "_thresholdResultPattern",
                        value: function j(e, i) {
                            var b = {
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
                            var f = i;
                            var c;
                            for(var d = 0; d < e.length; d++){
                                c = this._charToPattern(e[d]);
                                for(var a = 6; a >= 0; a--){
                                    var g = (a & 1) === 2 ? b.bar : b.space;
                                    var h = (c & 1) === 1 ? g.wide : g.narrow;
                                    h.size += this._counters[f + a];
                                    h.counts++;
                                    c >>= 1;
                                }
                                f += 8;
                            }
                            [
                                "space",
                                "bar"
                            ].forEach(function(c) {
                                var a = b[c];
                                a.wide.min = Math.floor((a.narrow.size / a.narrow.counts + a.wide.size / a.wide.counts) / 2);
                                a.narrow.max = Math.ceil(a.wide.min);
                                a.wide.max = Math.ceil((a.wide.size * bb + bc) / a.wide.counts);
                            });
                            return b;
                        }
                    },
                    {
                        key: "_validateResult",
                        value: function k(b, e) {
                            var f = this._thresholdResultPattern(b, e);
                            var g = e;
                            var c;
                            for(var d = 0; d < b.length; d++){
                                c = this._charToPattern(b[d]);
                                for(var a = 6; a >= 0; a--){
                                    var h = (a & 1) === 0 ? f.bar : f.space;
                                    var i = (c & 1) === 1 ? h.wide : h.narrow;
                                    var j = this._counters[g + a];
                                    if (j < i.min || j > i.max) {
                                        return false;
                                    }
                                    c >>= 1;
                                }
                                g += 8;
                            }
                            return true;
                        }
                    },
                    {
                        key: "decode",
                        value: function g(h, a) {
                            this._counters = this._fillCounters();
                            a = this._findStart();
                            if (!a) {
                                return null;
                            }
                            var b = a.startCounter;
                            var c = [];
                            var d;
                            do {
                                d = this._toPattern(b);
                                if (d < 0) {
                                    return null;
                                }
                                var e = this._patternToChar(d);
                                if (e === null) {
                                    return null;
                                }
                                c.push(e);
                                b += 8;
                                if (c.length > 1 && this._isStartEnd(d)) {
                                    break;
                                }
                            }while (b < this._counters.length)
                            if (c.length - 2 < ba || !this._isStartEnd(d)) {
                                return null;
                            }
                            if (!this._verifyWhitespace(a.startCounter, b - 8)) {
                                return null;
                            }
                            if (!this._validateResult(c, a.startCounter)) {
                                return null;
                            }
                            b = b > this._counters.length ? this._counters.length : b;
                            var f = a.start + this._sumCounters(a.startCounter, b - 8);
                            return {
                                code: c.join(""),
                                start: a.start,
                                end: f,
                                startInfo: a,
                                decodedCodes: c,
                                format: this.FORMAT
                            };
                        }
                    }, 
                ]);
                return a;
            })(f);
            var K = J;
            function bd(a) {
                var b = be();
                return function f() {
                    var d = aI()(a), c;
                    if (b) {
                        var e = aI()(this).constructor;
                        c = Reflect.construct(d, arguments, e);
                    } else {
                        c = d.apply(this, arguments);
                    }
                    return aH()(this, c);
                };
            }
            function be() {
                if (typeof Reflect === "undefined" || !Reflect.construct) return false;
                if (Reflect.construct.sham) return false;
                if (typeof Proxy === "function") return true;
                try {
                    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
                    return true;
                } catch (a) {
                    return false;
                }
            }
            var L = (function(b) {
                aG()(a, b);
                var c = bd(a);
                function a() {
                    var d;
                    aD()(this, a);
                    for(var e = arguments.length, f = new Array(e), b = 0; b < e; b++){
                        f[b] = arguments[b];
                    }
                    d = c.call.apply(c, [
                        this
                    ].concat(f));
                    aJ()(aF()(d), "FORMAT", "upc_a");
                    return d;
                }
                aE()(a, [
                    {
                        key: "decode",
                        value: function b(c, d) {
                            var a = g.prototype.decode.call(this);
                            if (a && a.code && a.code.length === 13 && a.code.charAt(0) === "0") {
                                a.code = a.code.substring(1);
                                return a;
                            }
                            return null;
                        }
                    }, 
                ]);
                return a;
            })(g);
            var M = L;
            function bf(a) {
                var b = bg();
                return function f() {
                    var d = aI()(a), c;
                    if (b) {
                        var e = aI()(this).constructor;
                        c = Reflect.construct(d, arguments, e);
                    } else {
                        c = d.apply(this, arguments);
                    }
                    return aH()(this, c);
                };
            }
            function bg() {
                if (typeof Reflect === "undefined" || !Reflect.construct) return false;
                if (Reflect.construct.sham) return false;
                if (typeof Proxy === "function") return true;
                try {
                    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
                    return true;
                } catch (a) {
                    return false;
                }
            }
            var N = (function(b) {
                aG()(a, b);
                var c = bf(a);
                function a() {
                    var d;
                    aD()(this, a);
                    for(var e = arguments.length, f = new Array(e), b = 0; b < e; b++){
                        f[b] = arguments[b];
                    }
                    d = c.call.apply(c, [
                        this
                    ].concat(f));
                    aJ()(aF()(d), "FORMAT", "ean_8");
                    return d;
                }
                aE()(a, [
                    {
                        key: "_decodePayload",
                        value: function g(f, c, b) {
                            var a = f;
                            for(var d = 0; d < 4; d++){
                                a = this._decodeCode(a.end, aR);
                                if (!a) {
                                    return null;
                                }
                                c.push(a.code);
                                b.push(a);
                            }
                            a = this._findPattern(aT, a.end, true, false);
                            if (a === null) {
                                return null;
                            }
                            b.push(a);
                            for(var e = 0; e < 4; e++){
                                a = this._decodeCode(a.end, aR);
                                if (!a) {
                                    return null;
                                }
                                b.push(a);
                                c.push(a.code);
                            }
                            return a;
                        }
                    }, 
                ]);
                return a;
            })(g);
            var O = N;
            function bh(a) {
                var b = bi();
                return function f() {
                    var d = aI()(a), c;
                    if (b) {
                        var e = aI()(this).constructor;
                        c = Reflect.construct(d, arguments, e);
                    } else {
                        c = d.apply(this, arguments);
                    }
                    return aH()(this, c);
                };
            }
            function bi() {
                if (typeof Reflect === "undefined" || !Reflect.construct) return false;
                if (Reflect.construct.sham) return false;
                if (typeof Proxy === "function") return true;
                try {
                    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
                    return true;
                } catch (a) {
                    return false;
                }
            }
            var P = (function(b) {
                aG()(a, b);
                var c = bh(a);
                function a() {
                    var d;
                    aD()(this, a);
                    for(var e = arguments.length, f = new Array(e), b = 0; b < e; b++){
                        f[b] = arguments[b];
                    }
                    d = c.call.apply(c, [
                        this
                    ].concat(f));
                    aJ()(aF()(d), "FORMAT", "ean_2");
                    return d;
                }
                aE()(a, [
                    {
                        key: "decode",
                        value: function k(e, i) {
                            if (e) {
                                this._row = e;
                            }
                            var f = 0;
                            var b = i;
                            var j = this._row.length;
                            var c = [];
                            var g = [];
                            var a = null;
                            if (b === undefined) {
                                return null;
                            }
                            for(var d = 0; d < 2 && b < j; d++){
                                a = this._decodeCode(b);
                                if (!a) {
                                    return null;
                                }
                                g.push(a);
                                c.push(a.code % 10);
                                if (a.code >= aR) {
                                    f |= 1 << (1 - d);
                                }
                                if (d !== 1) {
                                    b = this._nextSet(this._row, a.end);
                                    b = this._nextUnset(this._row, b);
                                }
                            }
                            if (c.length !== 2 || parseInt(c.join("")) % 4 !== f) {
                                return null;
                            }
                            var h = this._findStart();
                            return {
                                code: c.join(""),
                                decodedCodes: g,
                                end: a.end,
                                format: this.FORMAT,
                                startInfo: h,
                                start: h.start
                            };
                        }
                    }, 
                ]);
                return a;
            })(g);
            var Q = P;
            function bj(a) {
                var b = bk();
                return function f() {
                    var d = aI()(a), c;
                    if (b) {
                        var e = aI()(this).constructor;
                        c = Reflect.construct(d, arguments, e);
                    } else {
                        c = d.apply(this, arguments);
                    }
                    return aH()(this, c);
                };
            }
            function bk() {
                if (typeof Reflect === "undefined" || !Reflect.construct) return false;
                if (Reflect.construct.sham) return false;
                if (typeof Proxy === "function") return true;
                try {
                    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
                    return true;
                } catch (a) {
                    return false;
                }
            }
            var bl = [
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
            function bm(b) {
                for(var a = 0; a < 10; a++){
                    if (b === bl[a]) {
                        return a;
                    }
                }
                return null;
            }
            function bn(b) {
                var e = b.length;
                var a = 0;
                for(var c = e - 2; c >= 0; c -= 2){
                    a += b[c];
                }
                a *= 3;
                for(var d = e - 1; d >= 0; d -= 2){
                    a += b[d];
                }
                a *= 3;
                return a % 10;
            }
            var R = (function(b) {
                aG()(a, b);
                var c = bj(a);
                function a() {
                    var d;
                    aD()(this, a);
                    for(var e = arguments.length, f = new Array(e), b = 0; b < e; b++){
                        f[b] = arguments[b];
                    }
                    d = c.call.apply(c, [
                        this
                    ].concat(f));
                    aJ()(aF()(d), "FORMAT", "ean_5");
                    return d;
                }
                aE()(a, [
                    {
                        key: "decode",
                        value: function k(e, f) {
                            if (f === undefined) {
                                return null;
                            }
                            if (e) {
                                this._row = e;
                            }
                            var g = 0;
                            var b = f;
                            var j = this._row.length;
                            var a = null;
                            var c = [];
                            var h = [];
                            for(var d = 0; d < 5 && b < j; d++){
                                a = this._decodeCode(b);
                                if (!a) {
                                    return null;
                                }
                                h.push(a);
                                c.push(a.code % 10);
                                if (a.code >= aR) {
                                    g |= 1 << (4 - d);
                                }
                                if (d !== 4) {
                                    b = this._nextSet(this._row, a.end);
                                    b = this._nextUnset(this._row, b);
                                }
                            }
                            if (c.length !== 5) {
                                return null;
                            }
                            if (bn(c) !== bm(g)) {
                                return null;
                            }
                            var i = this._findStart();
                            return {
                                code: c.join(""),
                                decodedCodes: h,
                                end: a.end,
                                format: this.FORMAT,
                                startInfo: i,
                                start: i.start
                            };
                        }
                    }, 
                ]);
                return a;
            })(g);
            var S = R;
            function bo(c, d) {
                var a = Object.keys(c);
                if (Object.getOwnPropertySymbols) {
                    var b = Object.getOwnPropertySymbols(c);
                    if (d) {
                        b = b.filter(function(a) {
                            return Object.getOwnPropertyDescriptor(c, a).enumerable;
                        });
                    }
                    a.push.apply(a, b);
                }
                return a;
            }
            function bp(c) {
                for(var a = 1; a < arguments.length; a++){
                    var b = arguments[a] != null ? arguments[a] : {};
                    if (a % 2) {
                        bo(Object(b), true).forEach(function(a) {
                            aJ()(c, a, b[a]);
                        });
                    } else if (Object.getOwnPropertyDescriptors) {
                        Object.defineProperties(c, Object.getOwnPropertyDescriptors(b));
                    } else {
                        bo(Object(b)).forEach(function(a) {
                            Object.defineProperty(c, a, Object.getOwnPropertyDescriptor(b, a));
                        });
                    }
                }
                return c;
            }
            function bq(a) {
                var b = br();
                return function f() {
                    var d = aI()(a), c;
                    if (b) {
                        var e = aI()(this).constructor;
                        c = Reflect.construct(d, arguments, e);
                    } else {
                        c = d.apply(this, arguments);
                    }
                    return aH()(this, c);
                };
            }
            function br() {
                if (typeof Reflect === "undefined" || !Reflect.construct) return false;
                if (Reflect.construct.sham) return false;
                if (typeof Proxy === "function") return true;
                try {
                    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
                    return true;
                } catch (a) {
                    return false;
                }
            }
            var T = (function(b) {
                aG()(a, b);
                var c = bq(a);
                function a() {
                    var b;
                    aD()(this, a);
                    for(var e = arguments.length, f = new Array(e), d = 0; d < e; d++){
                        f[d] = arguments[d];
                    }
                    b = c.call.apply(c, [
                        this
                    ].concat(f));
                    aJ()(aF()(b), "CODE_FREQUENCY", [
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
                    aJ()(aF()(b), "STOP_PATTERN", [
                        (1 / 6) * 7,
                        (1 / 6) * 7,
                        (1 / 6) * 7,
                        (1 / 6) * 7,
                        (1 / 6) * 7,
                        (1 / 6) * 7, 
                    ]);
                    aJ()(aF()(b), "FORMAT", "upc_e");
                    return b;
                }
                aE()(a, [
                    {
                        key: "_decodePayload",
                        value: function g(e, c, f) {
                            var a = bp({}, e);
                            var d = 0x0;
                            for(var b = 0; b < 6; b++){
                                a = this._decodeCode(a.end);
                                if (!a) {
                                    return null;
                                }
                                if (a.code >= aR) {
                                    a.code = a.code - aR;
                                    d |= 1 << (5 - b);
                                }
                                c.push(a.code);
                                f.push(a);
                            }
                            if (!this._determineParity(d, c)) {
                                return null;
                            }
                            return a;
                        }
                    },
                    {
                        key: "_determineParity",
                        value: function e(d, c) {
                            for(var a = 0; a < this.CODE_FREQUENCY.length; a++){
                                for(var b = 0; b < this.CODE_FREQUENCY[a].length; b++){
                                    if (d === this.CODE_FREQUENCY[a][b]) {
                                        c.unshift(a);
                                        c.push(b);
                                        return true;
                                    }
                                }
                            }
                            return false;
                        }
                    },
                    {
                        key: "_convertToUPCA",
                        value: function d(a) {
                            var b = [
                                a[0]
                            ];
                            var c = a[a.length - 2];
                            if (c <= 2) {
                                b = b.concat(a.slice(1, 3)).concat([
                                    c,
                                    0,
                                    0,
                                    0,
                                    0
                                ]).concat(a.slice(3, 6));
                            } else if (c === 3) {
                                b = b.concat(a.slice(1, 4)).concat([
                                    0,
                                    0,
                                    0,
                                    0,
                                    0
                                ]).concat(a.slice(4, 6));
                            } else if (c === 4) {
                                b = b.concat(a.slice(1, 5)).concat([
                                    0,
                                    0,
                                    0,
                                    0,
                                    0,
                                    a[5]
                                ]);
                            } else {
                                b = b.concat(a.slice(1, 6)).concat([
                                    0,
                                    0,
                                    0,
                                    0,
                                    c
                                ]);
                            }
                            b.push(a[a.length - 1]);
                            return b;
                        }
                    },
                    {
                        key: "_checksum",
                        value: function c(b) {
                            return a1()(aI()(a.prototype), "_checksum", this).call(this, this._convertToUPCA(b));
                        }
                    },
                    {
                        key: "_findEnd",
                        value: function c(b, d) {
                            return a1()(aI()(a.prototype), "_findEnd", this).call(this, b, true);
                        }
                    },
                    {
                        key: "_verifyTrailingWhitespace",
                        value: function c(a) {
                            var b = a.end + (a.end - a.start) / 2;
                            if (b < this._row.length) {
                                if (this._matchRange(a.end, b, 0)) {
                                    return a;
                                }
                            }
                            return null;
                        }
                    }, 
                ]);
                return a;
            })(g);
            var U = T;
            function bs(a) {
                var b = bt();
                return function f() {
                    var d = aI()(a), c;
                    if (b) {
                        var e = aI()(this).constructor;
                        c = Reflect.construct(d, arguments, e);
                    } else {
                        c = d.apply(this, arguments);
                    }
                    return aH()(this, c);
                };
            }
            function bt() {
                if (typeof Reflect === "undefined" || !Reflect.construct) return false;
                if (Reflect.construct.sham) return false;
                if (typeof Proxy === "function") return true;
                try {
                    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
                    return true;
                } catch (a) {
                    return false;
                }
            }
            var bu = 1;
            var bv = 3;
            var V = (function(b) {
                aG()(a, b);
                var c = bs(a);
                function a(d) {
                    var b;
                    aD()(this, a);
                    b = c.call(this, az()({
                        normalizeBarSpaceWidth: false
                    }, d));
                    aJ()(aF()(b), "barSpaceRatio", [
                        1,
                        1
                    ]);
                    aJ()(aF()(b), "SINGLE_CODE_ERROR", 0.78);
                    aJ()(aF()(b), "AVG_CODE_ERROR", 0.38);
                    aJ()(aF()(b), "START_PATTERN", [
                        bu,
                        bu,
                        bu,
                        bu
                    ]);
                    aJ()(aF()(b), "STOP_PATTERN", [
                        bu,
                        bu,
                        bv
                    ]);
                    aJ()(aF()(b), "CODE_PATTERN", [
                        [
                            bu,
                            bu,
                            bv,
                            bv,
                            bu
                        ],
                        [
                            bv,
                            bu,
                            bu,
                            bu,
                            bv
                        ],
                        [
                            bu,
                            bv,
                            bu,
                            bu,
                            bv
                        ],
                        [
                            bv,
                            bv,
                            bu,
                            bu,
                            bu
                        ],
                        [
                            bu,
                            bu,
                            bv,
                            bu,
                            bv
                        ],
                        [
                            bv,
                            bu,
                            bv,
                            bu,
                            bu
                        ],
                        [
                            bu,
                            bv,
                            bv,
                            bu,
                            bu
                        ],
                        [
                            bu,
                            bu,
                            bu,
                            bv,
                            bv
                        ],
                        [
                            bv,
                            bu,
                            bu,
                            bv,
                            bu
                        ],
                        [
                            bu,
                            bv,
                            bu,
                            bv,
                            bu
                        ], 
                    ]);
                    aJ()(aF()(b), "MAX_CORRECTION_FACTOR", 5);
                    aJ()(aF()(b), "FORMAT", "i2of5");
                    if (d.normalizeBarSpaceWidth) {
                        b.SINGLE_CODE_ERROR = 0.38;
                        b.AVG_CODE_ERROR = 0.09;
                    }
                    b.config = d;
                    return aH()(b, aF()(b));
                }
                aE()(a, [
                    {
                        key: "_matchPattern",
                        value: function k(d, i) {
                            if (this.config.normalizeBarSpaceWidth) {
                                var f = [
                                    0,
                                    0
                                ];
                                var g = [
                                    0,
                                    0
                                ];
                                var b = [
                                    0,
                                    0
                                ];
                                var h = this.MAX_CORRECTION_FACTOR;
                                var j = 1 / h;
                                for(var c = 0; c < d.length; c++){
                                    f[c % 2] += d[c];
                                    g[c % 2] += i[c];
                                }
                                b[0] = g[0] / f[0];
                                b[1] = g[1] / f[1];
                                b[0] = Math.max(Math.min(b[0], h), j);
                                b[1] = Math.max(Math.min(b[1], h), j);
                                this.barSpaceRatio = b;
                                for(var e = 0; e < d.length; e++){
                                    d[e] *= this.barSpaceRatio[e % 2];
                                }
                            }
                            return a1()(aI()(a.prototype), "_matchPattern", this).call(this, d, i);
                        }
                    },
                    {
                        key: "_findPattern",
                        value: function m(i, g) {
                            var b = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
                            var h = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
                            var a = new Array(i.length).fill(0);
                            var c = 0;
                            var e = {
                                error: Number.MAX_VALUE,
                                start: 0,
                                end: 0
                            };
                            var k = this.AVG_CODE_ERROR;
                            b = b || false;
                            h = h || false;
                            if (!g) {
                                g = this._nextSet(this._row);
                            }
                            for(var d = g; d < this._row.length; d++){
                                if (this._row[d] ^ (b ? 1 : 0)) {
                                    a[c]++;
                                } else {
                                    if (c === a.length - 1) {
                                        var l = a.reduce(function(a, b) {
                                            return a + b;
                                        }, 0);
                                        var j = this._matchPattern(a, i);
                                        if (j < k) {
                                            e.error = j;
                                            e.start = d - l;
                                            e.end = d;
                                            return e;
                                        }
                                        if (h) {
                                            for(var f = 0; f < a.length - 2; f++){
                                                a[f] = a[f + 2];
                                            }
                                            a[a.length - 2] = 0;
                                            a[a.length - 1] = 0;
                                            c--;
                                        } else {
                                            return null;
                                        }
                                    } else {
                                        c++;
                                    }
                                    a[c] = 1;
                                    b = !b;
                                }
                            }
                            return null;
                        }
                    },
                    {
                        key: "_findStart",
                        value: function e() {
                            var b = 0;
                            var c = this._nextSet(this._row);
                            var a = null;
                            var d = 1;
                            while(!a){
                                a = this._findPattern(this.START_PATTERN, c, false, true);
                                if (!a) {
                                    return null;
                                }
                                d = Math.floor((a.end - a.start) / 4);
                                b = a.start - d * 10;
                                if (b >= 0) {
                                    if (this._matchRange(b, a.start, 0)) {
                                        return a;
                                    }
                                }
                                c = a.end;
                                a = null;
                            }
                            return null;
                        }
                    },
                    {
                        key: "_verifyTrailingWhitespace",
                        value: function c(a) {
                            var b = a.end + (a.end - a.start) / 2;
                            if (b < this._row.length) {
                                if (this._matchRange(a.end, b, 0)) {
                                    return a;
                                }
                            }
                            return null;
                        }
                    },
                    {
                        key: "_findEnd",
                        value: function c() {
                            this._row.reverse();
                            var a = this._findPattern(this.STOP_PATTERN);
                            this._row.reverse();
                            if (a === null) {
                                return null;
                            }
                            var b = a.start;
                            a.start = this._row.length - a.end;
                            a.end = this._row.length - b;
                            return a !== null ? this._verifyTrailingWhitespace(a) : null;
                        }
                    },
                    {
                        key: "_decodePair",
                        value: function e(b) {
                            var c = [];
                            for(var a = 0; a < b.length; a++){
                                var d = this._decodeCode(b[a]);
                                if (!d) {
                                    return null;
                                }
                                c.push(d);
                            }
                            return c;
                        }
                    },
                    {
                        key: "_decodeCode",
                        value: function f(d) {
                            var e = this.AVG_CODE_ERROR;
                            var a = {
                                error: Number.MAX_VALUE,
                                code: -1,
                                start: 0,
                                end: 0
                            };
                            for(var b = 0; b < this.CODE_PATTERN.length; b++){
                                var c = this._matchPattern(d, this.CODE_PATTERN[b]);
                                if (c < a.error) {
                                    a.code = b;
                                    a.error = c;
                                }
                            }
                            if (a.error < e) {
                                return a;
                            }
                            return null;
                        }
                    },
                    {
                        key: "_decodePayload",
                        value: function j(e, g, h) {
                            var b = 0;
                            var i = e.length;
                            var f = [
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
                            var a = null;
                            while(b < i){
                                for(var c = 0; c < 5; c++){
                                    f[0][c] = e[b] * this.barSpaceRatio[0];
                                    f[1][c] = e[b + 1] * this.barSpaceRatio[1];
                                    b += 2;
                                }
                                a = this._decodePair(f);
                                if (!a) {
                                    return null;
                                }
                                for(var d = 0; d < a.length; d++){
                                    g.push(a[d].code + "");
                                    h.push(a[d]);
                                }
                            }
                            return a;
                        }
                    },
                    {
                        key: "_verifyCounterLength",
                        value: function b(a) {
                            return a.length % 10 === 0;
                        }
                    },
                    {
                        key: "decode",
                        value: function g(h, i) {
                            var b = new Array();
                            var c = new Array();
                            var a = this._findStart();
                            if (!a) {
                                return null;
                            }
                            c.push(a);
                            var d = this._findEnd();
                            if (!d) {
                                return null;
                            }
                            var e = this._fillCounters(a.end, d.start, false);
                            if (!this._verifyCounterLength(e)) {
                                return null;
                            }
                            var f = this._decodePayload(e, b, c);
                            if (!f) {
                                return null;
                            }
                            if (b.length % 2 !== 0 || b.length < 6) {
                                return null;
                            }
                            c.push(d);
                            return {
                                code: b.join(""),
                                start: a.start,
                                end: d.end,
                                startInfo: a,
                                decodedCodes: c,
                                format: this.FORMAT
                            };
                        }
                    }, 
                ]);
                return a;
            })(f);
            var W = V;
            function bw(a) {
                var b = bx();
                return function f() {
                    var d = aI()(a), c;
                    if (b) {
                        var e = aI()(this).constructor;
                        c = Reflect.construct(d, arguments, e);
                    } else {
                        c = d.apply(this, arguments);
                    }
                    return aH()(this, c);
                };
            }
            function bx() {
                if (typeof Reflect === "undefined" || !Reflect.construct) return false;
                if (Reflect.construct.sham) return false;
                if (typeof Proxy === "function") return true;
                try {
                    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
                    return true;
                } catch (a) {
                    return false;
                }
            }
            var b = 1;
            var c = 3;
            var X = [
                c,
                b,
                c,
                b,
                b,
                b, 
            ];
            var by = [
                c,
                b,
                b,
                b,
                c, 
            ];
            var bz = [
                [
                    b,
                    b,
                    c,
                    c,
                    b, 
                ],
                [
                    c,
                    b,
                    b,
                    b,
                    c, 
                ],
                [
                    b,
                    c,
                    b,
                    b,
                    c, 
                ],
                [
                    c,
                    c,
                    b,
                    b,
                    b, 
                ],
                [
                    b,
                    b,
                    c,
                    b,
                    c, 
                ],
                [
                    c,
                    b,
                    c,
                    b,
                    b, 
                ],
                [
                    b,
                    c,
                    c,
                    b,
                    b, 
                ],
                [
                    b,
                    b,
                    b,
                    c,
                    c, 
                ],
                [
                    c,
                    b,
                    b,
                    c,
                    b, 
                ],
                [
                    b,
                    c,
                    b,
                    c,
                    b, 
                ], 
            ];
            var bA = X.reduce(function(a, b) {
                return a + b;
            }, 0);
            var Y = (function(b) {
                aG()(a, b);
                var c = bw(a);
                function a() {
                    var b;
                    aD()(this, a);
                    for(var e = arguments.length, f = new Array(e), d = 0; d < e; d++){
                        f[d] = arguments[d];
                    }
                    b = c.call.apply(c, [
                        this
                    ].concat(f));
                    aJ()(aF()(b), "barSpaceRatio", [
                        1,
                        1
                    ]);
                    aJ()(aF()(b), "FORMAT", "2of5");
                    aJ()(aF()(b), "SINGLE_CODE_ERROR", 0.78);
                    aJ()(aF()(b), "AVG_CODE_ERROR", 0.3);
                    return b;
                }
                aE()(a, [
                    {
                        key: "_findPattern",
                        value: function o(l, f) {
                            var g = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
                            var m = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
                            var a = [];
                            var b = 0;
                            var d = {
                                error: Number.MAX_VALUE,
                                code: -1,
                                start: 0,
                                end: 0
                            };
                            var h = 0;
                            var i = 0;
                            var n = this.AVG_CODE_ERROR;
                            if (!f) {
                                f = this._nextSet(this._row);
                            }
                            for(var j = 0; j < l.length; j++){
                                a[j] = 0;
                            }
                            for(var c = f; c < this._row.length; c++){
                                if (this._row[c] ^ (g ? 1 : 0)) {
                                    a[b]++;
                                } else {
                                    if (b === a.length - 1) {
                                        h = 0;
                                        for(var k = 0; k < a.length; k++){
                                            h += a[k];
                                        }
                                        i = this._matchPattern(a, l);
                                        if (i < n) {
                                            d.error = i;
                                            d.start = c - h;
                                            d.end = c;
                                            return d;
                                        }
                                        if (m) {
                                            for(var e = 0; e < a.length - 2; e++){
                                                a[e] = a[e + 2];
                                            }
                                            a[a.length - 2] = 0;
                                            a[a.length - 1] = 0;
                                            b--;
                                        } else {
                                            return null;
                                        }
                                    } else {
                                        b++;
                                    }
                                    a[b] = 1;
                                    g = !g;
                                }
                            }
                            return null;
                        }
                    },
                    {
                        key: "_findStart",
                        value: function e() {
                            var a = null;
                            var c = this._nextSet(this._row);
                            var d = 1;
                            var b = 0;
                            while(!a){
                                a = this._findPattern(X, c, false, true);
                                if (!a) {
                                    return null;
                                }
                                d = Math.floor((a.end - a.start) / bA);
                                b = a.start - d * 5;
                                if (b >= 0) {
                                    if (this._matchRange(b, a.start, 0)) {
                                        return a;
                                    }
                                }
                                c = a.end;
                                a = null;
                            }
                            return a;
                        }
                    },
                    {
                        key: "_verifyTrailingWhitespace",
                        value: function c(a) {
                            var b = a.end + (a.end - a.start) / 2;
                            if (b < this._row.length) {
                                if (this._matchRange(a.end, b, 0)) {
                                    return a;
                                }
                            }
                            return null;
                        }
                    },
                    {
                        key: "_findEnd",
                        value: function d() {
                            this._row.reverse();
                            var b = this._nextSet(this._row);
                            var a = this._findPattern(by, b, false, true);
                            this._row.reverse();
                            if (a === null) {
                                return null;
                            }
                            var c = a.start;
                            a.start = this._row.length - a.end;
                            a.end = this._row.length - c;
                            return a !== null ? this._verifyTrailingWhitespace(a) : null;
                        }
                    },
                    {
                        key: "_verifyCounterLength",
                        value: function b(a) {
                            return a.length % 10 === 0;
                        }
                    },
                    {
                        key: "_decodeCode",
                        value: function f(d) {
                            var e = this.AVG_CODE_ERROR;
                            var a = {
                                error: Number.MAX_VALUE,
                                code: -1,
                                start: 0,
                                end: 0
                            };
                            for(var b = 0; b < bz.length; b++){
                                var c = this._matchPattern(d, bz[b]);
                                if (c < a.error) {
                                    a.code = b;
                                    a.error = c;
                                }
                            }
                            if (a.error < e) {
                                return a;
                            }
                            return null;
                        }
                    },
                    {
                        key: "_decodePayload",
                        value: function i(d, f, g) {
                            var b = 0;
                            var h = d.length;
                            var e = [
                                0,
                                0,
                                0,
                                0,
                                0
                            ];
                            var a = null;
                            while(b < h){
                                for(var c = 0; c < 5; c++){
                                    e[c] = d[b] * this.barSpaceRatio[0];
                                    b += 2;
                                }
                                a = this._decodeCode(e);
                                if (!a) {
                                    return null;
                                }
                                f.push("".concat(a.code));
                                g.push(a);
                            }
                            return a;
                        }
                    },
                    {
                        key: "decode",
                        value: function g(h, i) {
                            var a = this._findStart();
                            if (!a) {
                                return null;
                            }
                            var b = this._findEnd();
                            if (!b) {
                                return null;
                            }
                            var e = this._fillCounters(a.end, b.start, false);
                            if (!this._verifyCounterLength(e)) {
                                return null;
                            }
                            var c = [];
                            c.push(a);
                            var d = [];
                            var f = this._decodePayload(e, d, c);
                            if (!f) {
                                return null;
                            }
                            if (d.length < 5) {
                                return null;
                            }
                            c.push(b);
                            return {
                                code: d.join(""),
                                start: a.start,
                                end: b.end,
                                startInfo: a,
                                decodedCodes: c,
                                format: this.FORMAT
                            };
                        }
                    }, 
                ]);
                return a;
            })(f);
            var Z = Y;
            function bB(a) {
                var b = bC();
                return function f() {
                    var d = aI()(a), c;
                    if (b) {
                        var e = aI()(this).constructor;
                        c = Reflect.construct(d, arguments, e);
                    } else {
                        c = d.apply(this, arguments);
                    }
                    return aH()(this, c);
                };
            }
            function bC() {
                if (typeof Reflect === "undefined" || !Reflect.construct) return false;
                if (Reflect.construct.sham) return false;
                if (typeof Proxy === "function") return true;
                try {
                    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
                    return true;
                } catch (a) {
                    return false;
                }
            }
            var $ = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. $/+%abcd*";
            var bD = new Uint16Array(k()($).map(function(a) {
                return a.charCodeAt(0);
            }));
            var bE = new Uint16Array([
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
            var bF = 0x15e;
            var _ = (function(b) {
                aG()(a, b);
                var c = bB(a);
                function a() {
                    var d;
                    aD()(this, a);
                    for(var e = arguments.length, f = new Array(e), b = 0; b < e; b++){
                        f[b] = arguments[b];
                    }
                    d = c.call.apply(c, [
                        this
                    ].concat(f));
                    aJ()(aF()(d), "FORMAT", "code_93");
                    return d;
                }
                aE()(a, [
                    {
                        key: "_patternToChar",
                        value: function c(b) {
                            for(var a = 0; a < bE.length; a++){
                                if (bE[a] === b) {
                                    return String.fromCharCode(bD[a]);
                                }
                            }
                            return null;
                        }
                    },
                    {
                        key: "_toPattern",
                        value: function h(d) {
                            var f = d.length;
                            var g = d.reduce(function(a, b) {
                                return a + b;
                            }, 0);
                            var a = 0;
                            for(var b = 0; b < f; b++){
                                var c = Math.round((d[b] * 9) / g);
                                if (c < 1 || c > 4) {
                                    return -1;
                                }
                                if ((b & 1) === 0) {
                                    for(var e = 0; e < c; e++){
                                        a = (a << 1) | 1;
                                    }
                                } else {
                                    a <<= c;
                                }
                            }
                            return a;
                        }
                    },
                    {
                        key: "_findStart",
                        value: function i() {
                            var g = this._nextSet(this._row);
                            var b = g;
                            var a = new Uint16Array([
                                0,
                                0,
                                0,
                                0,
                                0,
                                0, 
                            ]);
                            var c = 0;
                            var f = false;
                            for(var d = g; d < this._row.length; d++){
                                if (this._row[d] ^ (f ? 1 : 0)) {
                                    a[c]++;
                                } else {
                                    if (c === a.length - 1) {
                                        if (this._toPattern(a) === bF) {
                                            var h = Math.floor(Math.max(0, b - (d - b) / 4));
                                            if (this._matchRange(h, b, 0)) {
                                                return {
                                                    start: b,
                                                    end: d
                                                };
                                            }
                                        }
                                        b += a[0] + a[1];
                                        for(var e = 0; e < 4; e++){
                                            a[e] = a[e + 2];
                                        }
                                        a[4] = 0;
                                        a[5] = 0;
                                        c--;
                                    } else {
                                        c++;
                                    }
                                    a[c] = 1;
                                    f = !f;
                                }
                            }
                            return null;
                        }
                    },
                    {
                        key: "_verifyEnd",
                        value: function c(b, a) {
                            if (b === a || !this._row[a]) {
                                return false;
                            }
                            return true;
                        }
                    },
                    {
                        key: "_decodeExtended",
                        value: function i(f) {
                            var h = f.length;
                            var g = [];
                            for(var d = 0; d < h; d++){
                                var e = f[d];
                                if (e >= "a" && e <= "d") {
                                    if (d > h - 2) {
                                        return null;
                                    }
                                    var a = f[++d];
                                    var c = a.charCodeAt(0);
                                    var b = void 0;
                                    switch(e){
                                        case "a":
                                            if (a >= "A" && a <= "Z") {
                                                b = String.fromCharCode(c - 64);
                                            } else {
                                                return null;
                                            }
                                            break;
                                        case "b":
                                            if (a >= "A" && a <= "E") {
                                                b = String.fromCharCode(c - 38);
                                            } else if (a >= "F" && a <= "J") {
                                                b = String.fromCharCode(c - 11);
                                            } else if (a >= "K" && a <= "O") {
                                                b = String.fromCharCode(c + 16);
                                            } else if (a >= "P" && a <= "S") {
                                                b = String.fromCharCode(c + 43);
                                            } else if (a >= "T" && a <= "Z") {
                                                b = String.fromCharCode(127);
                                            } else {
                                                return null;
                                            }
                                            break;
                                        case "c":
                                            if (a >= "A" && a <= "O") {
                                                b = String.fromCharCode(c - 32);
                                            } else if (a === "Z") {
                                                b = ":";
                                            } else {
                                                return null;
                                            }
                                            break;
                                        case "d":
                                            if (a >= "A" && a <= "Z") {
                                                b = String.fromCharCode(c + 32);
                                            } else {
                                                return null;
                                            }
                                            break;
                                        default:
                                            console.warn("* code_93_reader _decodeExtended hit default case, this may be an error", b);
                                            return null;
                                    }
                                    g.push(b);
                                } else {
                                    g.push(e);
                                }
                            }
                            return g;
                        }
                    },
                    {
                        key: "_matchCheckChar",
                        value: function f(a, b, g) {
                            var c = a.slice(0, b);
                            var h = c.length;
                            var d = c.reduce(function(a, b, c) {
                                var d = ((c * -1 + (h - 1)) % g) + 1;
                                var e = bD.indexOf(b.charCodeAt(0));
                                return a + d * e;
                            }, 0);
                            var e = bD[d % 47];
                            return (e === a[b].charCodeAt(0));
                        }
                    },
                    {
                        key: "_verifyChecksums",
                        value: function b(a) {
                            return (this._matchCheckChar(a, a.length - 2, 20) && this._matchCheckChar(a, a.length - 1, 15));
                        }
                    },
                    {
                        key: "decode",
                        value: function h(i, c) {
                            c = this._findStart();
                            if (!c) {
                                return null;
                            }
                            var d = new Uint16Array([
                                0,
                                0,
                                0,
                                0,
                                0,
                                0, 
                            ]);
                            var a = [];
                            var b = this._nextSet(this._row, c.end);
                            var f;
                            var e;
                            do {
                                d = this._toCounters(b, d);
                                var g = this._toPattern(d);
                                if (g < 0) {
                                    return null;
                                }
                                e = this._patternToChar(g);
                                if (e === null) {
                                    return null;
                                }
                                a.push(e);
                                f = b;
                                b += aK["a"].sum(d);
                                b = this._nextSet(this._row, b);
                            }while (e !== "*")
                            a.pop();
                            if (!a.length) {
                                return null;
                            }
                            if (!this._verifyEnd(f, b)) {
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
                                start: c.start,
                                end: b,
                                startInfo: c,
                                decodedCodes: a,
                                format: this.FORMAT
                            };
                        }
                    }, 
                ]);
                return a;
            })(f);
            var aa = _;
            function bG(a) {
                var b = bH();
                return function f() {
                    var d = aI()(a), c;
                    if (b) {
                        var e = aI()(this).constructor;
                        c = Reflect.construct(d, arguments, e);
                    } else {
                        c = d.apply(this, arguments);
                    }
                    return aH()(this, c);
                };
            }
            function bH() {
                if (typeof Reflect === "undefined" || !Reflect.construct) return false;
                if (Reflect.construct.sham) return false;
                if (typeof Proxy === "function") return true;
                try {
                    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
                    return true;
                } catch (a) {
                    return false;
                }
            }
            var bI = {
                AEIO: /[AEIO]/g,
                AZ09: /[A-Z0-9]/
            };
            var bJ = "0123456789BCDFGHJKLMNPQRSTUVWXYZ";
            var ab = (function(b) {
                aG()(a, b);
                var c = bG(a);
                function a() {
                    var d;
                    aD()(this, a);
                    for(var e = arguments.length, f = new Array(e), b = 0; b < e; b++){
                        f[b] = arguments[b];
                    }
                    d = c.call.apply(c, [
                        this
                    ].concat(f));
                    aJ()(aF()(d), "FORMAT", "code_32_reader");
                    return d;
                }
                aE()(a, [
                    {
                        key: "_decodeCode32",
                        value: function e(b) {
                            if (/[^0-9BCDFGHJKLMNPQRSTUVWXYZ]/.test(b)) {
                                return null;
                            }
                            var c = 0;
                            for(var d = 0; d < b.length; d++){
                                c = c * 32 + bJ.indexOf(b[d]);
                            }
                            var a = "" + c;
                            if (a.length < 9) {
                                a = ("000000000" + a).slice(-9);
                            }
                            return "A" + a;
                        }
                    },
                    {
                        key: "_checkChecksum",
                        value: function b(a) {
                            return !!a;
                        }
                    },
                    {
                        key: "decode",
                        value: function g(e, f) {
                            var c = a1()(aI()(a.prototype), "decode", this).call(this, e, f);
                            if (!c) {
                                return null;
                            }
                            var b = c.code;
                            if (!b) {
                                return null;
                            }
                            b = b.replace(bI.AEIO, "");
                            if (!this._checkChecksum(b)) {
                                return null;
                            }
                            var d = this._decodeCode32(b);
                            if (!d) {
                                return null;
                            }
                            c.code = d;
                            return c;
                        }
                    }, 
                ]);
                return a;
            })(i);
            var ac = ab;
            var bK = {
                code_128_reader: B,
                ean_reader: g,
                ean_5_reader: S,
                ean_2_reader: Q,
                ean_8_reader: O,
                code_39_reader: i,
                code_39_vin_reader: I,
                codabar_reader: K,
                upc_reader: M,
                upc_e_reader: U,
                i2of5_reader: W,
                "2of5_reader": Z,
                code_93_reader: aa,
                code_32_reader: ac
            };
            var bL = {
                registerReader: function c(a, b) {
                    bK[a] = b;
                },
                create: function a(b, c) {
                    var d = {
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
                    var e = [];
                    f();
                    g();
                    h();
                    function f() {
                        if (true && typeof document !== "undefined") {
                            var a = document.querySelector("#debug.detection");
                            d.dom.frequency = document.querySelector("canvas.frequency");
                            if (!d.dom.frequency) {
                                d.dom.frequency = document.createElement("canvas");
                                d.dom.frequency.className = "frequency";
                                if (a) {
                                    a.appendChild(d.dom.frequency);
                                }
                            }
                            d.ctx.frequency = d.dom.frequency.getContext("2d");
                            d.dom.pattern = document.querySelector("canvas.patternBuffer");
                            if (!d.dom.pattern) {
                                d.dom.pattern = document.createElement("canvas");
                                d.dom.pattern.className = "patternBuffer";
                                if (a) {
                                    a.appendChild(d.dom.pattern);
                                }
                            }
                            d.ctx.pattern = d.dom.pattern.getContext("2d");
                            d.dom.overlay = document.querySelector("canvas.drawingBuffer");
                            if (d.dom.overlay) {
                                d.ctx.overlay = d.dom.overlay.getContext("2d");
                            }
                        }
                    }
                    function g() {
                        b.readers.forEach(function(a) {
                            var b;
                            var c = {};
                            var d = [];
                            if (ay()(a) === "object") {
                                b = a.format;
                                c = a.config;
                            } else if (typeof a === "string") {
                                b = a;
                            }
                            if (true) {
                                console.log("Before registering reader: ", b);
                            }
                            if (c.supplements) {
                                d = c.supplements.map(function(a) {
                                    return new bK[a]();
                                });
                            }
                            try {
                                var g = new bK[b](c, d);
                                e.push(g);
                            } catch (f) {
                                console.error("* Error constructing reader ", b, f);
                                throw f;
                            }
                        });
                        if (true) {
                            console.log("Registered Readers: ".concat(e.map(function(a) {
                                return JSON.stringify({
                                    format: a.FORMAT,
                                    config: a.config
                                });
                            }).join(", ")));
                        }
                    }
                    function h() {
                        if (true && typeof document !== "undefined") {
                            var a;
                            var c = [
                                {
                                    node: d.dom.frequency,
                                    prop: b.debug.showFrequency
                                },
                                {
                                    node: d.dom.pattern,
                                    prop: b.debug.showPattern
                                }, 
                            ];
                            for(a = 0; a < c.length; a++){
                                if (c[a].prop === true) {
                                    c[a].node.style.display = "block";
                                } else {
                                    c[a].node.style.display = "none";
                                }
                            }
                        }
                    }
                    function i(b, e, a) {
                        function d(c) {
                            var a = {
                                y: c * Math.sin(e),
                                x: c * Math.cos(e)
                            };
                            b[0].y -= a.y;
                            b[0].x -= a.x;
                            b[1].y += a.y;
                            b[1].x += a.x;
                        }
                        d(a);
                        while(a > 1 && (!c.inImageWithBorder(b[0]) || !c.inImageWithBorder(b[1]))){
                            a -= Math.ceil(a / 2);
                            d(-a);
                        }
                        return b;
                    }
                    function j(a) {
                        return [
                            {
                                x: (a[1][0] - a[0][0]) / 2 + a[0][0],
                                y: (a[1][1] - a[0][1]) / 2 + a[0][1]
                            },
                            {
                                x: (a[3][0] - a[2][0]) / 2 + a[2][0],
                                y: (a[3][1] - a[2][1]) / 2 + a[2][1]
                            }, 
                        ];
                    }
                    function k(h) {
                        var f = null;
                        var g;
                        var a = aC.getBarcodeLine(c, h[0], h[1]);
                        if (true && b.debug.showFrequency) {
                            r["a"].drawPath(h, {
                                x: "x",
                                y: "y"
                            }, d.ctx.overlay, {
                                color: "red",
                                lineWidth: 3
                            });
                            aC.debug.printFrequency(a.line, d.dom.frequency);
                        }
                        aC.toBinaryLine(a);
                        if (true && b.debug.showPattern) {
                            aC.debug.printPattern(a.line, d.dom.pattern);
                        }
                        for(g = 0; g < e.length && f === null; g++){
                            f = e[g].decodePattern(a.line);
                        }
                        if (f === null) {
                            return null;
                        }
                        return {
                            codeResult: f,
                            barcodeLine: a
                        };
                    }
                    function l(d, a, g) {
                        var i = Math.sqrt(Math.pow(d[1][0] - d[0][0], 2) + Math.pow(d[1][1] - d[0][1], 2));
                        var b;
                        var h = 16;
                        var e = null;
                        var f;
                        var c;
                        var j = Math.sin(g);
                        var l = Math.cos(g);
                        for(b = 1; b < h && e === null; b++){
                            f = (i / h) * b * (b % 2 === 0 ? -1 : 1);
                            c = {
                                y: f * j,
                                x: f * l
                            };
                            a[0].y += c.x;
                            a[0].x -= c.y;
                            a[1].y += c.x;
                            a[1].x -= c.y;
                            e = k(a);
                        }
                        return e;
                    }
                    function m(a) {
                        return Math.sqrt(Math.pow(Math.abs(a[1].y - a[0].y), 2) + Math.pow(Math.abs(a[1].x - a[0].x), 2));
                    }
                    function n(c) {
                        var b = null;
                        for(var a = 0; a < e.length && b === null; a++){
                            b = e[a].decodeImage ? e[a].decodeImage(c) : null;
                        }
                        return b;
                    }
                    function o(f) {
                        var a;
                        var e = d.ctx.overlay;
                        var c;
                        if (true) {
                            if (b.debug.drawBoundingBox && e) {
                                r["a"].drawPath(f, {
                                    x: 0,
                                    y: 1
                                }, e, {
                                    color: "blue",
                                    lineWidth: 2
                                });
                            }
                        }
                        a = j(f);
                        var h = m(a);
                        var g = Math.atan2(a[1].y - a[0].y, a[1].x - a[0].x);
                        a = i(a, g, Math.floor(h * 0.1));
                        if (a === null) {
                            return null;
                        }
                        c = k(a);
                        if (c === null) {
                            c = l(f, a, g);
                        }
                        if (c === null) {
                            return null;
                        }
                        if (true && c && b.debug.drawScanline && e) {
                            r["a"].drawPath(a, {
                                x: "x",
                                y: "y"
                            }, e, {
                                color: "red",
                                lineWidth: 3
                            });
                        }
                        return {
                            codeResult: c.codeResult,
                            line: a,
                            angle: g,
                            pattern: c.barcodeLine.line,
                            threshold: c.barcodeLine.threshold
                        };
                    }
                    return {
                        decodeFromBoundingBox: function b(a) {
                            return o(a);
                        },
                        decodeFromBoundingBoxes: function h(d) {
                            var c;
                            var a;
                            var e = [];
                            var f = b.multiple;
                            for(c = 0; c < d.length; c++){
                                var g = d[c];
                                a = o(g) || {};
                                a.box = g;
                                if (f) {
                                    e.push(a);
                                } else if (a.codeResult) {
                                    return a;
                                }
                            }
                            if (f) {
                                return {
                                    barcodes: e
                                };
                            }
                        },
                        decodeFromImage: function c(a) {
                            var b = n(a);
                            return b;
                        },
                        registerReader: function c(a, b) {
                            if (bK[a]) {
                                throw new Error("cannot register existing reader", a);
                            }
                            bK[a] = b;
                        },
                        setReaders: function c(a) {
                            b.readers = a;
                            e.length = 0;
                            g();
                        }
                    };
                }
            };
            var bM = (function a() {
                var b = {};
                function c(a) {
                    if (!b[a]) {
                        b[a] = {
                            subscribers: []
                        };
                    }
                    return b[a];
                }
                function d() {
                    b = {};
                }
                function e(a, b) {
                    if (a.async) {
                        setTimeout(function() {
                            a.callback(b);
                        }, 4);
                    } else {
                        a.callback(b);
                    }
                }
                function f(d, b, e) {
                    var a;
                    if (typeof b === "function") {
                        a = {
                            callback: b,
                            async: e
                        };
                    } else {
                        a = b;
                        if (!a.callback) {
                            throw new Error("Callback was not specified on options");
                        }
                    }
                    c(d).subscribers.push(a);
                }
                return {
                    subscribe: function d(a, b, c) {
                        return f(a, b, c);
                    },
                    publish: function f(d, g) {
                        var a = c(d);
                        var b = a.subscribers;
                        b.filter(function(a) {
                            return !!a.once;
                        }).forEach(function(a) {
                            e(a, g);
                        });
                        a.subscribers = b.filter(function(a) {
                            return !a.once;
                        });
                        a.subscribers.forEach(function(a) {
                            e(a, g);
                        });
                    },
                    once: function d(a, b) {
                        var c = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
                        f(a, {
                            callback: b,
                            async: c,
                            once: true
                        });
                    },
                    unsubscribe: function f(b, e) {
                        if (b) {
                            var a = c(b);
                            if (a && e) {
                                a.subscribers = a.subscribers.filter(function(a) {
                                    return (a.callback !== e);
                                });
                            } else {
                                a.subscribers = [];
                            }
                        } else {
                            d();
                        }
                    }
                };
            })();
            var ad = a(20);
            var bN = a.n(ad);
            var ae = a(12);
            var bO = a.n(ae);
            var af = a(85);
            var bP = a.n(af);
            var ag = a(86);
            var ah = a.n(ag);
            function bQ(a) {
                var b = bR();
                return function f() {
                    var d = aI()(a), c;
                    if (b) {
                        var e = aI()(this).constructor;
                        c = Reflect.construct(d, arguments, e);
                    } else {
                        c = d.apply(this, arguments);
                    }
                    return aH()(this, c);
                };
            }
            function bR() {
                if (typeof Reflect === "undefined" || !Reflect.construct) return false;
                if (Reflect.construct.sham) return false;
                if (typeof Proxy === "function") return true;
                try {
                    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
                    return true;
                } catch (a) {
                    return false;
                }
            }
            var bS = (function(a) {
                aG()(b, a);
                var c = bQ(b);
                function b(d, e) {
                    var a;
                    aD()(this, b);
                    a = c.call(this, d);
                    aJ()(aF()(a), "code", void 0);
                    a.code = e;
                    Object.setPrototypeOf(aF()(a), b.prototype);
                    return a;
                }
                return b;
            })(ah()(Error));
            var bT = "This may mean that the user has declined camera access, or the browser does not support media APIs. If you are running in iOS, you must use Safari.";
            function bU() {
                try {
                    return navigator.mediaDevices.enumerateDevices();
                } catch (b) {
                    var a = new bS("enumerateDevices is not defined. ".concat(bT), -1);
                    return Promise.reject(a);
                }
            }
            function bV(a) {
                try {
                    return navigator.mediaDevices.getUserMedia(a);
                } catch (c) {
                    var b = new bS("getUserMedia is not defined. ".concat(bT), -1);
                    return Promise.reject(b);
                }
            }
            var bW;
            function bX(a) {
                return new Promise(function(c, d) {
                    var e = 10;
                    function b() {
                        if (e > 0) {
                            if (a.videoWidth > 10 && a.videoHeight > 10) {
                                if (true) {
                                    console.log("* dev: checkVideo found ".concat(a.videoWidth, "px x ").concat(a.videoHeight, "px"));
                                }
                                c();
                            } else {
                                window.setTimeout(b, 500);
                            }
                        } else {
                            d(new bS("Unable to play video stream. Is webcam working?", -1));
                        }
                        e--;
                    }
                    b();
                });
            }
            function bY(a, b) {
                return bZ.apply(this, arguments);
            }
            function bZ() {
                bZ = bN()(bO.a.mark(function a(b, c) {
                    var d;
                    return bO.a.wrap(function e(a) {
                        while(1){
                            switch((a.prev = a.next)){
                                case 0:
                                    a.next = 2;
                                    return bV(c);
                                case 2:
                                    d = a.sent;
                                    bW = d;
                                    if (!b) {
                                        a.next = 11;
                                        break;
                                    }
                                    b.setAttribute("autoplay", "true");
                                    b.setAttribute("muted", "true");
                                    b.setAttribute("playsinline", "true");
                                    b.srcObject = d;
                                    b.addEventListener("loadedmetadata", function() {
                                        b.play();
                                    });
                                    return a.abrupt("return", bX(b));
                                case 11:
                                    return a.abrupt("return", Promise.resolve());
                                case 12:
                                case "end":
                                    return a.stop();
                            }
                        }
                    }, a);
                }));
                return bZ.apply(this, arguments);
            }
            function b$(a) {
                var b = bP()(a, [
                    "width",
                    "height",
                    "facingMode",
                    "aspectRatio",
                    "deviceId", 
                ]);
                if (typeof a.minAspectRatio !== "undefined" && a.minAspectRatio > 0) {
                    b.aspectRatio = a.minAspectRatio;
                    console.log("WARNING: Constraint 'minAspectRatio' is deprecated; Use 'aspectRatio' instead");
                }
                if (typeof a.facing !== "undefined") {
                    b.facingMode = a.facing;
                    console.log("WARNING: Constraint 'facing' is deprecated. Use 'facingMode' instead'");
                }
                return b;
            }
            function b_() {
                var b = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var a = b$(b);
                if (a && a.deviceId && a.facingMode) {
                    delete a.facingMode;
                }
                return Promise.resolve({
                    audio: false,
                    video: a
                });
            }
            function ai() {
                return b0.apply(this, arguments);
            }
            function b0() {
                b0 = bN()(bO.a.mark(function a() {
                    var b;
                    return bO.a.wrap(function c(a) {
                        while(1){
                            switch((a.prev = a.next)){
                                case 0:
                                    a.next = 2;
                                    return bU();
                                case 2:
                                    b = a.sent;
                                    return a.abrupt("return", b.filter(function(a) {
                                        return (a.kind === "videoinput");
                                    }));
                                case 4:
                                case "end":
                                    return a.stop();
                            }
                        }
                    }, a);
                }));
                return b0.apply(this, arguments);
            }
            function aj() {
                if (!bW) {
                    return null;
                }
                var a = bW.getVideoTracks();
                return a && a !== null && a !== void 0 && a.length ? a[0] : null;
            }
            var ak = {
                requestedVideoElement: null,
                request: function a(b, c) {
                    return bN()(bO.a.mark(function a() {
                        var d;
                        return bO.a.wrap(function e(a) {
                            while(1){
                                switch((a.prev = a.next)){
                                    case 0:
                                        ak.requestedVideoElement = b;
                                        a.next = 3;
                                        return b_(c);
                                    case 3:
                                        d = a.sent;
                                        return a.abrupt("return", bY(b, d));
                                    case 5:
                                    case "end":
                                        return a.stop();
                                }
                            }
                        }, a);
                    }))();
                },
                release: function a() {
                    var b = bW && bW.getVideoTracks();
                    if (ak.requestedVideoElement !== null) {
                        ak.requestedVideoElement.pause();
                    }
                    return new Promise(function(a) {
                        setTimeout(function() {
                            if (b && b.length) {
                                b[0].stop();
                            }
                            bW = null;
                            ak.requestedVideoElement = null;
                            a();
                        }, 0);
                    });
                },
                enumerateVideoDevices: ai,
                getActiveStreamLabel: function b() {
                    var a = aj();
                    return a ? a.label : "";
                },
                getActiveTrack: aj
            };
            var al = ak;
            function b1(b, a) {
                return (a && a.some(function(a) {
                    var c = Object.keys(a);
                    return c.every(function(c) {
                        return a[c] === b[c];
                    });
                }));
            }
            function b2(b, a) {
                return typeof a === "function" ? a(b) : true;
            }
            var am = {
                create: function d(b) {
                    var a;
                    var c = document.createElement("canvas");
                    var e = c.getContext("2d");
                    var f = [];
                    var g = (a = b.capacity) !== null && a !== void 0 ? a : 20;
                    var h = b.capture === true;
                    function i(a) {
                        return (!!g && a && !b1(a, b.blacklist) && b2(a, b.filter));
                    }
                    return {
                        addResult: function k(j, a, d) {
                            var b = {};
                            if (i(d)) {
                                g--;
                                b.codeResult = d;
                                if (h) {
                                    c.width = a.x;
                                    c.height = a.y;
                                    r["a"].drawImage(j, a, e);
                                    b.frame = c.toDataURL();
                                }
                                f.push(b);
                            }
                        },
                        getResults: function a() {
                            return f;
                        }
                    };
                }
            };
            var an = {
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
            var ao = an;
            var ap = {
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
            var b3 = ap;
            var aq = {
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
            var b4 = aq;
            var ar = true ? ao : undefined;
            var b5 = ar;
            var b6 = a(7);
            var b7 = function a() {
                aD()(this, a);
                aJ()(this, "config", void 0);
                aJ()(this, "inputStream", void 0);
                aJ()(this, "framegrabber", void 0);
                aJ()(this, "inputImageWrapper", void 0);
                aJ()(this, "stopped", false);
                aJ()(this, "boxSize", void 0);
                aJ()(this, "resultCollector", void 0);
                aJ()(this, "decoder", void 0);
                aJ()(this, "workerPool", []);
                aJ()(this, "onUIThread", true);
                aJ()(this, "canvasContainer", new b9());
            };
            var b8 = function a() {
                aD()(this, a);
                aJ()(this, "image", void 0);
                aJ()(this, "overlay", void 0);
            };
            var b9 = function a() {
                aD()(this, a);
                aJ()(this, "ctx", void 0);
                aJ()(this, "dom", void 0);
                this.ctx = new b8();
                this.dom = new b8();
            };
            var ca = a(23);
            function cb(b, c, d) {
                var a = c || new q["a"]({
                    x: b.getWidth(),
                    y: b.getHeight(),
                    type: "XYSize"
                });
                if (true) {
                    console.log("image wrapper size ".concat(a.size));
                }
                var e = [
                    Object(b6["clone"])([
                        0,
                        0
                    ]),
                    Object(b6["clone"])([
                        0,
                        a.size.y
                    ]),
                    Object(b6["clone"])([
                        a.size.x,
                        a.size.y, 
                    ]),
                    Object(b6["clone"])([
                        a.size.x,
                        0
                    ]), 
                ];
                ca["a"].init(a, d);
                return {
                    inputImageWrapper: a,
                    boxSize: e
                };
            }
            function cc(a) {
                if (typeof document === "undefined") {
                    return null;
                }
                if (a instanceof HTMLElement && a.nodeName && a.nodeType === 1) {
                    return a;
                }
                var b = typeof a === "string" ? a : "#interactive.viewport";
                return document.querySelector(b);
            }
            function cd(b, c) {
                var a = document.querySelector(b);
                if (!a) {
                    a = document.createElement("canvas");
                    a.className = c;
                }
                return a;
            }
            function ce(b, c) {
                var a = cd(b, c);
                var d = a.getContext("2d");
                return {
                    canvas: a,
                    context: d
                };
            }
            function cf(c) {
                if (typeof document !== "undefined") {
                    var a = ce("canvas.imgBuffer", "imgBuffer");
                    var b = ce("canvas.drawingBuffer", "drawingBuffer");
                    a.canvas.width = b.canvas.width = c.x;
                    a.canvas.height = b.canvas.height = c.y;
                    return {
                        dom: {
                            image: a.canvas,
                            overlay: b.canvas
                        },
                        ctx: {
                            image: a.context,
                            overlay: b.context
                        }
                    };
                }
                return null;
            }
            function cg(a) {
                var d, e, f, g;
                var b = cc(a === null || a === void 0 ? void 0 : (d = a.config) === null || d === void 0 ? void 0 : (e = d.inputStream) === null || e === void 0 ? void 0 : e.target);
                var i = a === null || a === void 0 ? void 0 : (f = a.config) === null || f === void 0 ? void 0 : (g = f.inputStream) === null || g === void 0 ? void 0 : g.type;
                if (!i) return null;
                var h = cf(a.inputStream.getCanvasSize());
                if (!h) return {
                    dom: {
                        image: null,
                        overlay: null
                    },
                    ctx: {
                        image: null,
                        overlay: null
                    }
                };
                var c = h.dom;
                if (typeof document !== "undefined") {
                    if (b) {
                        if (i === "ImageStream" && !b.contains(c.image)) {
                            b.appendChild(c.image);
                        }
                        if (!b.contains(c.overlay)) {
                            b.appendChild(c.overlay);
                        }
                    }
                }
                return h;
            }
            var as = {
                0x0112: "orientation"
            };
            var ch = Object.keys(as).map(function(a) {
                return as[a];
            });
            function ci(a) {
                var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ch;
                if (/^blob:/i.test(a)) {
                    return cl(a).then(ck).then(function(a) {
                        return cm(a, b);
                    });
                }
                return Promise.resolve(null);
            }
            function cj(e) {
                var f = e.replace(/^data:([^;]+);base64,/gim, "");
                var b = atob(f);
                var c = b.length;
                var d = new ArrayBuffer(c);
                var g = new Uint8Array(d);
                for(var a = 0; a < c; a++){
                    g[a] = b.charCodeAt(a);
                }
                return d;
            }
            function ck(a) {
                return new Promise(function(c) {
                    var b = new FileReader();
                    b.onload = function(a) {
                        return c(a.target.result);
                    };
                    b.readAsArrayBuffer(a);
                });
            }
            function cl(a) {
                return new Promise(function(d, c) {
                    var b = new XMLHttpRequest();
                    b.open("GET", a, true);
                    b.responseType = "blob";
                    b.onreadystatechange = function() {
                        if (b.readyState === XMLHttpRequest.DONE && (b.status === 200 || b.status === 0)) {
                            d(this.response);
                        }
                    };
                    b.onerror = c;
                    b.send();
                });
            }
            function cm(c) {
                var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ch;
                var a = new DataView(c);
                var f = c.byteLength;
                var g = e.reduce(function(a, c) {
                    var b = Object.keys(as).filter(function(a) {
                        return as[a] === c;
                    })[0];
                    if (b) {
                        a[b] = c;
                    }
                    return a;
                }, {});
                var b = 2;
                var d;
                if (a.getUint8(0) !== 0xff || a.getUint8(1) !== 0xd8) {
                    return false;
                }
                while(b < f){
                    if (a.getUint8(b) !== 0xff) {
                        return false;
                    }
                    d = a.getUint8(b + 1);
                    if (d === 0xe1) {
                        return cn(a, b + 4, g);
                    }
                    b += 2 + a.getUint16(b + 2);
                }
                return false;
            }
            function cn(a, d, f) {
                if (cq(a, d, 4) !== "Exif") {
                    return false;
                }
                var b = d + 6;
                var c;
                if (a.getUint16(b) === 0x4949) {
                    c = false;
                } else if (a.getUint16(b) === 0x4d4d) {
                    c = true;
                } else {
                    return false;
                }
                if (a.getUint16(b + 2, !c) !== 0x002a) {
                    return false;
                }
                var e = a.getUint32(b + 4, !c);
                if (e < 0x00000008) {
                    return false;
                }
                var g = co(a, b, b + e, f, c);
                return g;
            }
            function co(a, h, b, i, c) {
                var j = a.getUint16(b, !c);
                var e = {};
                for(var d = 0; d < j; d++){
                    var f = b + d * 12 + 2;
                    var g = i[a.getUint16(f, !c)];
                    if (g) {
                        e[g] = cp(a, f, h, b, c);
                    }
                }
                return e;
            }
            function cp(a, b, f, g, c) {
                var d = a.getUint16(b + 2, !c);
                var e = a.getUint32(b + 4, !c);
                switch(d){
                    case 3:
                        if (e === 1) {
                            return a.getUint16(b + 8, !c);
                        }
                }
                return null;
            }
            function cq(d, b, e) {
                var c = "";
                for(var a = b; a < b + e; a++){
                    c += String.fromCharCode(d.getUint8(a));
                }
                return c;
            }
            var l = {};
            l.load = function(e, j, g, h, i) {
                var b = new Array(h);
                var c = new Array(b.length);
                var a;
                var d;
                var f;
                if (i === false) {
                    b[0] = e;
                } else {
                    for(a = 0; a < b.length; a++){
                        f = g + a;
                        b[a] = "".concat(e, "image-").concat("00".concat(f).slice(-3), ".jpg");
                    }
                }
                c.notLoaded = [];
                c.addImage = function(a) {
                    c.notLoaded.push(a);
                };
                c.loaded = function(g) {
                    var d = c.notLoaded;
                    for(var f = 0; f < d.length; f++){
                        if (d[f] === g) {
                            d.splice(f, 1);
                            for(var a = 0; a < b.length; a++){
                                var h = b[a].substr(b[a].lastIndexOf("/"));
                                if (g.src.lastIndexOf(h) !== -1) {
                                    c[a] = {
                                        img: g
                                    };
                                    break;
                                }
                            }
                            break;
                        }
                    }
                    if (d.length === 0) {
                        if (true) {
                            console.log("Images loaded");
                        }
                        if (i === false) {
                            ci(e, [
                                "orientation"
                            ]).then(function(a) {
                                c[0].tags = a;
                                j(c);
                            })["catch"](function(a) {
                                console.log(a);
                                j(c);
                            });
                        } else {
                            j(c);
                        }
                    }
                };
                for(a = 0; a < b.length; a++){
                    d = new Image();
                    c.addImage(d);
                    cr(d, c);
                    d.src = b[a];
                }
            };
            function cr(a, b) {
                a.onload = function() {
                    b.loaded(this);
                };
            }
            var cs = l;
            var at = {
                createVideoStream: function b(c) {
                    var d = null;
                    var e = [
                        "canrecord",
                        "ended"
                    ];
                    var f = {};
                    var g;
                    var h;
                    var i = {
                        x: 0,
                        y: 0,
                        type: "Point"
                    };
                    var j = {
                        x: 0,
                        y: 0,
                        type: "XYSize"
                    };
                    function k() {
                        var e, f;
                        var a = c.videoWidth;
                        var b = c.videoHeight;
                        g = (e = d) !== null && e !== void 0 && e.size ? a / b > 1 ? d.size : Math.floor((a / b) * d.size) : a;
                        h = (f = d) !== null && f !== void 0 && f.size ? a / b > 1 ? Math.floor((b / a) * d.size) : d.size : b;
                        j.x = g;
                        j.y = h;
                    }
                    var a = {
                        getRealWidth: function a() {
                            return c.videoWidth;
                        },
                        getRealHeight: function a() {
                            return c.videoHeight;
                        },
                        getWidth: function a() {
                            return g;
                        },
                        getHeight: function a() {
                            return h;
                        },
                        setWidth: function b(a) {
                            g = a;
                        },
                        setHeight: function b(a) {
                            h = a;
                        },
                        setInputStream: function b(a) {
                            d = a;
                            this.setAttribute("src", typeof a.src !== "undefined" ? a.src : "");
                        },
                        ended: function a() {
                            return c.ended;
                        },
                        getConfig: function a() {
                            return d;
                        },
                        setAttribute: function d(a, b) {
                            if (c) {
                                c.setAttribute(a, b);
                            }
                        },
                        pause: function a() {
                            c.pause();
                        },
                        play: function a() {
                            c.play();
                        },
                        setCurrentTime: function c(b) {
                            var a;
                            if (((a = d) === null || a === void 0 ? void 0 : a.type) !== "LiveStream") {
                                this.setAttribute("currentTime", b.toString());
                            }
                        },
                        addEventListener: function g(a, b, d) {
                            if (e.indexOf(a) !== -1) {
                                if (!f[a]) {
                                    f[a] = [];
                                }
                                f[a].push(b);
                            } else {
                                c.addEventListener(a, b, d);
                            }
                        },
                        clearEventHandlers: function a() {
                            e.forEach(function(b) {
                                var a = f[b];
                                if (a && a.length > 0) {
                                    a.forEach(function(a) {
                                        c.removeEventListener(b, a);
                                    });
                                }
                            });
                        },
                        trigger: function g(d, e) {
                            var b;
                            var c = f[d];
                            if (d === "canrecord") {
                                k();
                            }
                            if (c && c.length > 0) {
                                for(b = 0; b < c.length; b++){
                                    c[b].apply(a, e);
                                }
                            }
                        },
                        setTopRight: function b(a) {
                            i.x = a.x;
                            i.y = a.y;
                        },
                        getTopRight: function a() {
                            return i;
                        },
                        setCanvasSize: function b(a) {
                            j.x = a.x;
                            j.y = a.y;
                        },
                        getCanvasSize: function a() {
                            return j;
                        },
                        getFrame: function a() {
                            return c;
                        }
                    };
                    return a;
                },
                createLiveStream: function c(a) {
                    if (a) {
                        a.setAttribute("autoplay", "true");
                    }
                    var b = at.createVideoStream(a);
                    b.ended = function a() {
                        return false;
                    };
                    return b;
                },
                createImageStream: function c() {
                    var d = null;
                    var e = 0;
                    var f = 0;
                    var g = 0;
                    var h = true;
                    var i = false;
                    var j = null;
                    var k = 0;
                    var l = 1;
                    var m = null;
                    var n = false;
                    var o;
                    var p;
                    var q = [
                        "canrecord",
                        "ended"
                    ];
                    var r = {};
                    var s = {
                        x: 0,
                        y: 0,
                        type: "Point"
                    };
                    var t = {
                        x: 0,
                        y: 0,
                        type: "XYSize"
                    };
                    function u() {
                        var b;
                        i = false;
                        cs.load(m, function(b) {
                            var c, h;
                            j = b;
                            if (b[0].tags && b[0].tags.orientation) {
                                switch(b[0].tags.orientation){
                                    case 6:
                                    case 8:
                                        e = b[0].img.height;
                                        f = b[0].img.width;
                                        break;
                                    default:
                                        e = b[0].img.width;
                                        f = b[0].img.height;
                                }
                            } else {
                                e = b[0].img.width;
                                f = b[0].img.height;
                            }
                            o = (c = d) !== null && c !== void 0 && c.size ? e / f > 1 ? d.size : Math.floor((e / f) * d.size) : e;
                            p = (h = d) !== null && h !== void 0 && h.size ? e / f > 1 ? Math.floor((f / e) * d.size) : d.size : f;
                            t.x = o;
                            t.y = p;
                            i = true;
                            g = 0;
                            setTimeout(function() {
                                a("canrecord", []);
                            }, 0);
                        }, l, k, (b = d) === null || b === void 0 ? void 0 : b.sequence);
                    }
                    function a(d, e) {
                        var a;
                        var c = r[d];
                        if (c && c.length > 0) {
                            for(a = 0; a < c.length; a++){
                                c[a].apply(b, e);
                            }
                        }
                    }
                    var b = {
                        trigger: a,
                        getWidth: function a() {
                            return o;
                        },
                        getHeight: function a() {
                            return p;
                        },
                        setWidth: function b(a) {
                            o = a;
                        },
                        setHeight: function b(a) {
                            p = a;
                        },
                        getRealWidth: function a() {
                            return e;
                        },
                        getRealHeight: function a() {
                            return f;
                        },
                        setInputStream: function b(a) {
                            d = a;
                            if (a.sequence === false) {
                                m = a.src;
                                k = 1;
                            } else {
                                m = a.src;
                                k = a.length;
                            }
                            u();
                        },
                        ended: function a() {
                            return n;
                        },
                        setAttribute: function a() {},
                        getConfig: function a() {
                            return d;
                        },
                        pause: function a() {
                            h = true;
                        },
                        play: function a() {
                            h = false;
                        },
                        setCurrentTime: function b(a) {
                            g = a;
                        },
                        addEventListener: function c(a, b) {
                            if (q.indexOf(a) !== -1) {
                                if (!r[a]) {
                                    r[a] = [];
                                }
                                r[a].push(b);
                            }
                        },
                        clearEventHandlers: function a() {
                            Object.keys(r).forEach(function(a) {
                                return delete r[a];
                            });
                        },
                        setTopRight: function b(a) {
                            s.x = a.x;
                            s.y = a.y;
                        },
                        getTopRight: function a() {
                            return s;
                        },
                        setCanvasSize: function b(a) {
                            t.x = a.x;
                            t.y = a.y;
                        },
                        getCanvasSize: function a() {
                            return t;
                        },
                        getFrame: function d() {
                            var c;
                            if (!i) {
                                return null;
                            }
                            if (!h) {
                                var b;
                                c = (b = j) === null || b === void 0 ? void 0 : b[g];
                                if (g < k - 1) {
                                    g++;
                                } else {
                                    setTimeout(function() {
                                        n = true;
                                        a("ended", []);
                                    }, 0);
                                }
                            }
                            return c;
                        }
                    };
                    return b;
                }
            };
            var ct = at;
            var cu = a(8);
            var cv = Math.PI / 180;
            function cw(a, b) {
                if (a.width !== b.x) {
                    if (true) {
                        console.log("WARNING: canvas-size needs to be adjusted");
                    }
                    a.width = b.x;
                }
                if (a.height !== b.y) {
                    if (true) {
                        console.log("WARNING: canvas-size needs to be adjusted");
                    }
                    a.height = b.y;
                }
            }
            var m = {};
            m.create = function(a, g) {
                var b = {};
                var k = a.getConfig();
                var h = Object(cu["h"])(a.getRealWidth(), a.getRealHeight());
                var d = a.getCanvasSize();
                var e = Object(cu["h"])(a.getWidth(), a.getHeight());
                var f = a.getTopRight();
                var l = f.x;
                var m = f.y;
                var c;
                var i = null;
                var j = null;
                c = g || document.createElement("canvas");
                c.width = d.x;
                c.height = d.y;
                i = c.getContext("2d");
                j = new Uint8Array(e.x * e.y);
                if (true) {
                    console.log("FrameGrabber", JSON.stringify({
                        size: e,
                        topRight: f,
                        videoSize: h,
                        canvasSize: d
                    }));
                }
                b.attachData = function(a) {
                    j = a;
                };
                b.getData = function() {
                    return j;
                };
                b.grab = function() {
                    var n = k.halfSample;
                    var b = a.getFrame();
                    var g = b;
                    var f = 0;
                    var h;
                    if (g) {
                        cw(c, d);
                        if (k.type === "ImageStream") {
                            g = b.img;
                            if (b.tags && b.tags.orientation) {
                                switch(b.tags.orientation){
                                    case 6:
                                        f = 90 * cv;
                                        break;
                                    case 8:
                                        f = -90 * cv;
                                        break;
                                }
                            }
                        }
                        if (f !== 0) {
                            i.translate(d.x / 2, d.y / 2);
                            i.rotate(f);
                            i.drawImage(g, -d.y / 2, -d.x / 2, d.y, d.x);
                            i.rotate(-f);
                            i.translate(-d.x / 2, -d.y / 2);
                        } else {
                            i.drawImage(g, 0, 0, d.x, d.y);
                        }
                        h = i.getImageData(l, m, e.x, e.y).data;
                        if (n) {
                            Object(cu["e"])(h, e, j);
                        } else {
                            Object(cu["c"])(h, j, k);
                        }
                        return true;
                    }
                    return false;
                };
                b.getSize = function() {
                    return e;
                };
                return b;
            };
            var cx = m;
            function cy(c, d) {
                var a = Object.keys(c);
                if (Object.getOwnPropertySymbols) {
                    var b = Object.getOwnPropertySymbols(c);
                    if (d) {
                        b = b.filter(function(a) {
                            return Object.getOwnPropertyDescriptor(c, a).enumerable;
                        });
                    }
                    a.push.apply(a, b);
                }
                return a;
            }
            function cz(c) {
                for(var a = 1; a < arguments.length; a++){
                    var b = arguments[a] != null ? arguments[a] : {};
                    if (a % 2) {
                        cy(Object(b), true).forEach(function(a) {
                            aJ()(c, a, b[a]);
                        });
                    } else if (Object.getOwnPropertyDescriptors) {
                        Object.defineProperties(c, Object.getOwnPropertyDescriptors(b));
                    } else {
                        cy(Object(b)).forEach(function(a) {
                            Object.defineProperty(c, a, Object.getOwnPropertyDescriptor(b, a));
                        });
                    }
                }
                return c;
            }
            var cA = [];
            function cB(b) {
                var a;
                if (cA.length) {
                    a = cA.filter(function(a) {
                        return !a.busy;
                    })[0];
                    if (a) {
                        b.attachData(a.imageData);
                        if (b.grab()) {
                            a.busy = true;
                            a.worker.postMessage({
                                cmd: "process",
                                imageData: a.imageData
                            }, [
                                a.imageData.buffer
                            ]);
                        }
                        return true;
                    } else {
                        return false;
                    }
                }
                return null;
            }
            function cC(a) {
                return cz(cz({}, a), {}, {
                    inputStream: cz(cz({}, a.inputStream), {}, {
                        target: null
                    })
                });
            }
            function cD(a) {
                if (a) {
                    var b = a()["default"];
                    if (!b) {
                        self.postMessage({
                            event: "error",
                            message: "Quagga could not be created"
                        });
                        return;
                    }
                }
                var c;
                function d(a) {
                    self.postMessage({
                        event: "processed",
                        imageData: c.data,
                        result: a
                    }, [
                        c.data.buffer
                    ]);
                }
                function e() {
                    self.postMessage({
                        event: "initialized",
                        imageData: c.data
                    }, [
                        c.data.buffer
                    ]);
                }
                self.onmessage = function(a) {
                    if (a.data.cmd === "init") {
                        var f = a.data.config;
                        f.numOfWorkers = 0;
                        c = new b.ImageWrapper({
                            x: a.data.size.x,
                            y: a.data.size.y
                        }, new Uint8Array(a.data.imageData));
                        b.init(f, e, c);
                        b.onProcessed(d);
                    } else if (a.data.cmd === "process") {
                        c.data = new Uint8Array(a.data.imageData);
                        b.start();
                    } else if (a.data.cmd === "setReaders") {
                        b.setReaders(a.data.readers);
                    } else if (a.data.cmd === "registerReader") {
                        b.registerReader(a.data.name, a.data.reader);
                    }
                };
            }
            function cE() {
                var a, b;
                if (typeof __factorySource__ !== "undefined") {
                    b = __factorySource__;
                }
                a = new Blob([
                    "(" + cD.toString() + ")(" + b + ");", 
                ], {
                    type: "text/javascript"
                });
                return window.URL.createObjectURL(a);
            }
            function cF(c, a, f) {
                var d = cE();
                var e = new Worker(d);
                var b = {
                    worker: e,
                    imageData: new Uint8Array(a.getWidth() * a.getHeight()),
                    busy: true
                };
                b.worker.onmessage = function(a) {
                    if (a.data.event === "initialized") {
                        URL.revokeObjectURL(d);
                        b.busy = false;
                        b.imageData = new Uint8Array(a.data.imageData);
                        if (true) {
                            console.log("Worker initialized");
                        }
                        f(b);
                    } else if (a.data.event === "processed") {
                        b.imageData = new Uint8Array(a.data.imageData);
                        b.busy = false;
                    } else if (a.data.event === "error") {
                        if (true) {
                            console.log("Worker error: " + a.data.message);
                        }
                    }
                };
                b.worker.postMessage({
                    cmd: "init",
                    size: {
                        x: a.getWidth(),
                        y: a.getHeight()
                    },
                    imageData: b.imageData,
                    config: cC(c)
                }, [
                    b.imageData.buffer
                ]);
            }
            function cG(e, c, f, b) {
                var a = e - cA.length;
                if (a === 0 && b) {
                    b();
                } else if (a < 0) {
                    var g = cA.slice(a);
                    g.forEach(function(a) {
                        a.worker.terminate();
                        if (true) {
                            console.log("Worker terminated!");
                        }
                    });
                    cA = cA.slice(0, a);
                    if (b) {
                        b();
                    }
                } else {
                    var h = function c(a) {
                        cA.push(a);
                        if (cA.length >= e && b) {
                            b();
                        }
                    };
                    if (c) {
                        for(var d = 0; d < a; d++){
                            cF(c, f, h);
                        }
                    }
                }
            }
            function cH(a) {
                cA.forEach(function(b) {
                    return b.worker.postMessage({
                        cmd: "setReaders",
                        readers: a
                    });
                });
            }
            function cI(a, b) {
                cA.forEach(function(c) {
                    return c.worker.postMessage({
                        cmd: "registerReader",
                        name: a,
                        reader: b
                    });
                });
            }
            function cJ() {
                var d = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "LiveStream";
                var b = arguments.length > 1 ? arguments[1] : undefined;
                var c = arguments.length > 2 ? arguments[2] : undefined;
                switch(d){
                    case "VideoStream":
                        {
                            var e = document.createElement("video");
                            return {
                                video: e,
                                inputStream: c.createVideoStream(e)
                            };
                        }
                    case "ImageStream":
                        return {
                            inputStream: c.createImageStream()
                        };
                    case "LiveStream":
                        {
                            var a = null;
                            if (b) {
                                a = b.querySelector("video");
                                if (!a) {
                                    a = document.createElement("video");
                                    b.appendChild(a);
                                }
                            }
                            return {
                                video: a,
                                inputStream: c.createLiveStream(a)
                            };
                        }
                    default:
                        console.error("* setupInputStream invalid type ".concat(d));
                        return {
                            video: null,
                            inputStream: null
                        };
                }
            }
            function cK(a, c, d) {
                var b = a.length;
                while(b--){
                    a[b][0] += c;
                    a[b][1] += d;
                }
            }
            function cL(a, b, c) {
                a[0].x += b;
                a[0].y += c;
                a[1].x += b;
                a[1].y += c;
            }
            var au = (function() {
                function a() {
                    var b = this;
                    aD()(this, a);
                    aJ()(this, "context", new b7());
                    aJ()(this, "canRecord", function(c) {
                        var a;
                        if (!b.context.config) {
                            return;
                        }
                        ca["a"].checkImageConstraints(b.context.inputStream, (a = b.context.config) === null || a === void 0 ? void 0 : a.locator);
                        b.initCanvas();
                        b.context.framegrabber = cx.create(b.context.inputStream, b.context.canvasContainer.dom.image);
                        if (b.context.config.numOfWorkers === undefined) {
                            b.context.config.numOfWorkers = 0;
                        }
                        cG(b.context.config.numOfWorkers, b.context.config, b.context.inputStream, function() {
                            var a;
                            if (((a = b.context.config) === null || a === void 0 ? void 0 : a.numOfWorkers) === 0) {
                                b.initializeData();
                            }
                            b.ready(c);
                        });
                    });
                    aJ()(this, "update", function() {
                        if (b.context.onUIThread) {
                            var d = cB(b.context.framegrabber);
                            if (!d) {
                                var a;
                                b.context.framegrabber.attachData((a = b.context.inputImageWrapper) === null || a === void 0 ? void 0 : a.data);
                                if (b.context.framegrabber.grab()) {
                                    if (!d) {
                                        b.locateAndDecode();
                                    }
                                }
                            }
                        } else {
                            var c;
                            b.context.framegrabber.attachData((c = b.context.inputImageWrapper) === null || c === void 0 ? void 0 : c.data);
                            b.context.framegrabber.grab();
                            b.locateAndDecode();
                        }
                    });
                }
                aE()(a, [
                    {
                        key: "initBuffers",
                        value: function e(b) {
                            if (!this.context.config) {
                                return;
                            }
                            var a = cb(this.context.inputStream, b, this.context.config.locator), c = a.inputImageWrapper, d = a.boxSize;
                            this.context.inputImageWrapper = c;
                            this.context.boxSize = d;
                        }
                    },
                    {
                        key: "initializeData",
                        value: function b(a) {
                            if (!this.context.config) {
                                return;
                            }
                            this.initBuffers(a);
                            this.context.decoder = bL.create(this.context.config.decoder, this.context.inputImageWrapper);
                        }
                    },
                    {
                        key: "getViewPort",
                        value: function b() {
                            if (!this.context.config || !this.context.config.inputStream) {
                                return null;
                            }
                            var a = this.context.config.inputStream.target;
                            return cc(a);
                        }
                    },
                    {
                        key: "ready",
                        value: function b(a) {
                            this.context.inputStream.play();
                            a();
                        }
                    },
                    {
                        key: "initCanvas",
                        value: function d() {
                            var a = cg(this.context);
                            if (!a) {
                                return;
                            }
                            var b = a.ctx, c = a.dom;
                            this.context.canvasContainer.dom.image = c.image;
                            this.context.canvasContainer.dom.overlay = c.overlay;
                            this.context.canvasContainer.ctx.image = b.image;
                            this.context.canvasContainer.ctx.overlay = b.overlay;
                        }
                    },
                    {
                        key: "initInputStream",
                        value: function h(f) {
                            if (!this.context.config || !this.context.config.inputStream) {
                                return;
                            }
                            var b = this.context.config.inputStream, c = b.type, g = b.constraints;
                            var d = cJ(c, this.getViewPort(), ct), e = d.video, a = d.inputStream;
                            if (c === "LiveStream" && e) {
                                al.request(e, g).then(function() {
                                    return a.trigger("canrecord");
                                })["catch"](function(a) {
                                    return f(a);
                                });
                            }
                            a.setAttribute("preload", "auto");
                            a.setInputStream(this.context.config.inputStream);
                            a.addEventListener("canrecord", this.canRecord.bind(undefined, f));
                            this.context.inputStream = a;
                        }
                    },
                    {
                        key: "getBoundingBoxes",
                        value: function b() {
                            var a;
                            return (a = this.context.config) !== null && a !== void 0 && a.locate ? ca["a"].locate() : [
                                [
                                    Object(b6["clone"])(this.context.boxSize[0]),
                                    Object(b6["clone"])(this.context.boxSize[1]),
                                    Object(b6["clone"])(this.context.boxSize[2]),
                                    Object(b6["clone"])(this.context.boxSize[3]), 
                                ], 
                            ];
                        }
                    },
                    {
                        key: "transformResult",
                        value: function f(a) {
                            var g = this;
                            var e = this.context.inputStream.getTopRight();
                            var b = e.x;
                            var c = e.y;
                            if (b === 0 && c === 0) {
                                return;
                            }
                            if (a.barcodes) {
                                a.barcodes.forEach(function(a) {
                                    return g.transformResult(a);
                                });
                            }
                            if (a.line && a.line.length === 2) {
                                cL(a.line, b, c);
                            }
                            if (a.box) {
                                cK(a.box, b, c);
                            }
                            if (a.boxes && a.boxes.length > 0) {
                                for(var d = 0; d < a.boxes.length; d++){
                                    cK(a.boxes[d], b, c);
                                }
                            }
                        }
                    },
                    {
                        key: "addResult",
                        value: function c(a, b) {
                            var d = this;
                            if (!b || !this.context.resultCollector) {
                                return;
                            }
                            if (a.barcodes) {
                                a.barcodes.filter(function(a) {
                                    return a.codeResult;
                                }).forEach(function(a) {
                                    return d.addResult(a, b);
                                });
                            } else if (a.codeResult) {
                                this.context.resultCollector.addResult(b, this.context.inputStream.getCanvasSize(), a.codeResult);
                            }
                        }
                    },
                    {
                        key: "hasCodeResult",
                        value: function b(a) {
                            return !!(a && (a.barcodes ? a.barcodes.some(function(a) {
                                return a.codeResult;
                            }) : a.codeResult));
                        }
                    },
                    {
                        key: "publishResult",
                        value: function d() {
                            var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
                            var c = arguments.length > 1 ? arguments[1] : undefined;
                            var b = a;
                            if (a && this.context.onUIThread) {
                                this.transformResult(a);
                                this.addResult(a, c);
                                b = a.barcodes || a;
                            }
                            bM.publish("processed", b);
                            if (this.hasCodeResult(a)) {
                                bM.publish("detected", b);
                            }
                        }
                    },
                    {
                        key: "locateAndDecode",
                        value: function f() {
                            var a = this.getBoundingBoxes();
                            if (a) {
                                var b;
                                var d = this.context.decoder.decodeFromBoundingBoxes(a) || {};
                                d.boxes = a;
                                this.publishResult(d, (b = this.context.inputImageWrapper) === null || b === void 0 ? void 0 : b.data);
                            } else {
                                var e = this.context.decoder.decodeFromImage(this.context.inputImageWrapper);
                                if (e) {
                                    var c;
                                    this.publishResult(e, (c = this.context.inputImageWrapper) === null || c === void 0 ? void 0 : c.data);
                                } else {
                                    this.publishResult();
                                }
                            }
                        }
                    },
                    {
                        key: "startContinuousUpdate",
                        value: function c() {
                            var a, d = this;
                            var e = null;
                            var f = 1000 / (((a = this.context.config) === null || a === void 0 ? void 0 : a.frequency) || 60);
                            this.context.stopped = false;
                            var g = this.context;
                            var b = function b(a) {
                                e = e || a;
                                if (!g.stopped) {
                                    if (a >= e) {
                                        e += f;
                                        d.update();
                                    }
                                    window.requestAnimationFrame(b);
                                }
                            };
                            b(performance.now());
                        }
                    },
                    {
                        key: "start",
                        value: function c() {
                            var a, b;
                            if (this.context.onUIThread && ((a = this.context.config) === null || a === void 0 ? void 0 : (b = a.inputStream) === null || b === void 0 ? void 0 : b.type) === "LiveStream") {
                                this.startContinuousUpdate();
                            } else {
                                this.update();
                            }
                        }
                    },
                    {
                        key: "stop",
                        value: (function() {
                            var b = bN()(bO.a.mark(function a() {
                                var b;
                                return bO.a.wrap(function c(a) {
                                    while(1){
                                        switch((a.prev = a.next)){
                                            case 0:
                                                this.context.stopped = true;
                                                cG(0);
                                                if (!((b = this.context.config) !== null && b !== void 0 && b.inputStream && this.context.config.inputStream.type === "LiveStream")) {
                                                    a.next = 6;
                                                    break;
                                                }
                                                a.next = 5;
                                                return al.release();
                                            case 5:
                                                this.context.inputStream.clearEventHandlers();
                                            case 6:
                                            case "end":
                                                return a.stop();
                                        }
                                    }
                                }, a, this);
                            }));
                            function a() {
                                return b.apply(this, arguments);
                            }
                            return a;
                        })()
                    },
                    {
                        key: "setReaders",
                        value: function b(a) {
                            if (this.context.decoder) {
                                this.context.decoder.setReaders(a);
                            }
                            cH(a);
                        }
                    },
                    {
                        key: "registerReader",
                        value: function c(a, b) {
                            bL.registerReader(a, b);
                            if (this.context.decoder) {
                                this.context.decoder.registerReader(a, b);
                            }
                            cI(a, b);
                        }
                    }, 
                ]);
                return a;
            })();
            var av = new au();
            var aw = av.context;
            var n = {
                init: function f(e, b, c) {
                    var a = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : av;
                    var d;
                    if (!b) {
                        d = new Promise(function(a, c) {
                            b = function d(b) {
                                b ? c(b) : a();
                            };
                        });
                    }
                    a.context.config = az()({}, b5, e);
                    if (a.context.config.numOfWorkers > 0) {
                        a.context.config.numOfWorkers = 0;
                    }
                    if (c) {
                        a.context.onUIThread = false;
                        a.initializeData(c);
                        if (b) {
                            b();
                        }
                    } else {
                        a.initInputStream(b);
                    }
                    return d;
                },
                start: function a() {
                    return av.start();
                },
                stop: function a() {
                    return av.stop();
                },
                pause: function a() {
                    aw.stopped = true;
                },
                onDetected: function b(a) {
                    if (!a || (typeof a !== "function" && (ay()(a) !== "object" || !a.callback))) {
                        console.trace("* warning: Quagga.onDetected called with invalid callback, ignoring");
                        return;
                    }
                    bM.subscribe("detected", a);
                },
                offDetected: function b(a) {
                    bM.unsubscribe("detected", a);
                },
                onProcessed: function b(a) {
                    if (!a || (typeof a !== "function" && (ay()(a) !== "object" || !a.callback))) {
                        console.trace("* warning: Quagga.onProcessed called with invalid callback, ignoring");
                        return;
                    }
                    bM.subscribe("processed", a);
                },
                offProcessed: function b(a) {
                    bM.unsubscribe("processed", a);
                },
                setReaders: function b(a) {
                    if (!a) {
                        console.trace("* warning: Quagga.setReaders called with no readers, ignoring");
                        return;
                    }
                    av.setReaders(a);
                },
                registerReader: function c(a, b) {
                    if (!a) {
                        console.trace("* warning: Quagga.registerReader called with no name, ignoring");
                        return;
                    }
                    if (!b) {
                        console.trace("* warning: Quagga.registerReader called with no reader, ignoring");
                        return;
                    }
                    av.registerReader(a, b);
                },
                registerResultCollector: function b(a) {
                    if (a && typeof a.addResult === "function") {
                        aw.resultCollector = a;
                    }
                },
                get canvas () {
                    return aw.canvasContainer;
                },
                decodeSingle: function b(a, c) {
                    var d = this;
                    var e = new au();
                    a = az()({
                        inputStream: {
                            type: "ImageStream",
                            sequence: false,
                            size: 800,
                            src: a.src
                        },
                        numOfWorkers: true && a.debug ? 0 : 1,
                        locator: {
                            halfSample: false
                        }
                    }, a);
                    if (a.numOfWorkers > 0) {
                        a.numOfWorkers = 0;
                    }
                    if (a.numOfWorkers > 0 && (typeof Blob === "undefined" || typeof Worker === "undefined")) {
                        console.warn("* no Worker and/or Blob support - forcing numOfWorkers to 0");
                        a.numOfWorkers = 0;
                    }
                    return new Promise(function(g, b) {
                        try {
                            d.init(a, function() {
                                bM.once("processed", function(a) {
                                    e.stop();
                                    if (c) {
                                        c.call(null, a);
                                    }
                                    g(a);
                                }, true);
                                e.start();
                            }, null, e);
                        } catch (f) {
                            b(f);
                        }
                    });
                },
                get default () {
                    return n;
                },
                Readers: d,
                CameraAccess: al,
                ImageDebug: r["a"],
                ImageWrapper: q["a"],
                ResultCollector: am
            };
            var cM = (e["default"] = n);
        }
    ])["default"];
});
