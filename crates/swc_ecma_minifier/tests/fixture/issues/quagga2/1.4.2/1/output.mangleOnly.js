(function a(b, c) {
    if (typeof exports === "object" && typeof module === "object") module.exports = c();
    else if (typeof define === "function" && define.amd) define([], c);
    else if (typeof exports === "object") exports["Quagga"] = c();
    else b["Quagga"] = c();
})(window, function() {
    return (function(a) {
        var b = {};
        function c(d) {
            if (b[d]) {
                return b[d].exports;
            }
            var e = (b[d] = {
                i: d,
                l: false,
                exports: {}
            });
            a[d].call(e.exports, e, e.exports, c);
            e.l = true;
            return e.exports;
        }
        c.m = a;
        c.c = b;
        c.d = function(a, b, d) {
            if (!c.o(a, b)) {
                Object.defineProperty(a, b, {
                    enumerable: true,
                    get: d
                });
            }
        };
        c.r = function(a) {
            if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
                Object.defineProperty(a, Symbol.toStringTag, {
                    value: "Module"
                });
            }
            Object.defineProperty(a, "__esModule", {
                value: true
            });
        };
        c.t = function(a, b) {
            if (b & 1) a = c(a);
            if (b & 8) return a;
            if (b & 4 && typeof a === "object" && a && a.__esModule) return a;
            var d = Object.create(null);
            c.r(d);
            Object.defineProperty(d, "default", {
                enumerable: true,
                value: a
            });
            if (b & 2 && typeof a != "string") for(var e in a)c.d(d, e, function(b) {
                return a[b];
            }.bind(null, e));
            return d;
        };
        c.n = function(a) {
            var b = a && a.__esModule ? function b() {
                return a["default"];
            } : function b() {
                return a;
            };
            c.d(b, "a", b);
            return b;
        };
        c.o = function(a, b) {
            return Object.prototype.hasOwnProperty.call(a, b);
        };
        c.p = "/";
        return c((c.s = 89));
    })([
        function(a, b) {
            function c(a, b, c) {
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
            a.exports = c;
            (a.exports["default"] = a.exports), (a.exports.__esModule = true);
        },
        function(a, b) {
            function c(a) {
                if (a === void 0) {
                    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                }
                return a;
            }
            a.exports = c;
            (a.exports["default"] = a.exports), (a.exports.__esModule = true);
        },
        function(a, b) {
            function c(b) {
                a.exports = c = Object.setPrototypeOf ? Object.getPrototypeOf : function a(b) {
                    return b.__proto__ || Object.getPrototypeOf(b);
                };
                (a.exports["default"] = a.exports), (a.exports.__esModule = true);
                return c(b);
            }
            a.exports = c;
            (a.exports["default"] = a.exports), (a.exports.__esModule = true);
        },
        function(a, b) {
            function c(a, b) {
                if (!(a instanceof b)) {
                    throw new TypeError("Cannot call a class as a function");
                }
            }
            a.exports = c;
            (a.exports["default"] = a.exports), (a.exports.__esModule = true);
        },
        function(a, b) {
            function c(a, b) {
                for(var c = 0; c < b.length; c++){
                    var d = b[c];
                    d.enumerable = d.enumerable || false;
                    d.configurable = true;
                    if ("value" in d) d.writable = true;
                    Object.defineProperty(a, d.key, d);
                }
            }
            function d(a, b, d) {
                if (b) c(a.prototype, b);
                if (d) c(a, d);
                return a;
            }
            a.exports = d;
            (a.exports["default"] = a.exports), (a.exports.__esModule = true);
        },
        function(a, b, c) {
            var d = c(19)["default"];
            var e = c(1);
            function f(a, b) {
                if (b && (d(b) === "object" || typeof b === "function")) {
                    return b;
                } else if (b !== void 0) {
                    throw new TypeError("Derived constructors may only return object or undefined");
                }
                return e(a);
            }
            a.exports = f;
            (a.exports["default"] = a.exports), (a.exports.__esModule = true);
        },
        function(a, b, c) {
            var d = c(41);
            function e(a, b) {
                if (typeof b !== "function" && b !== null) {
                    throw new TypeError("Super expression must either be null or a function");
                }
                a.prototype = Object.create(b && b.prototype, {
                    constructor: {
                        value: a,
                        writable: true,
                        configurable: true
                    }
                });
                if (b) d(a, b);
            }
            a.exports = e;
            (a.exports["default"] = a.exports), (a.exports.__esModule = true);
        },
        function(a, b, c) {
            a.exports = {
                EPSILON: c(62),
                create: c(63),
                clone: c(156),
                fromValues: c(157),
                copy: c(158),
                set: c(159),
                equals: c(160),
                exactEquals: c(161),
                add: c(162),
                subtract: c(64),
                sub: c(163),
                multiply: c(65),
                mul: c(164),
                divide: c(66),
                div: c(165),
                inverse: c(166),
                min: c(167),
                max: c(168),
                rotate: c(169),
                floor: c(170),
                ceil: c(171),
                round: c(172),
                scale: c(173),
                scaleAndAdd: c(174),
                distance: c(67),
                dist: c(175),
                squaredDistance: c(68),
                sqrDist: c(176),
                length: c(69),
                len: c(177),
                squaredLength: c(70),
                sqrLen: c(178),
                negate: c(179),
                normalize: c(180),
                dot: c(181),
                cross: c(182),
                lerp: c(183),
                random: c(184),
                transformMat2: c(185),
                transformMat2d: c(186),
                transformMat3: c(187),
                transformMat4: c(188),
                forEach: c(189),
                limit: c(190)
            };
        },
        function(a, b, c) {
            "use strict";
            c.d(b, "h", function() {
                return k;
            });
            c.d(b, "i", function() {
                return r;
            });
            c.d(b, "b", function() {
                return t;
            });
            c.d(b, "j", function() {
                return C;
            });
            c.d(b, "e", function() {
                return F;
            });
            c.d(b, "c", function() {
                return G;
            });
            c.d(b, "f", function() {
                return I;
            });
            c.d(b, "g", function() {
                return J;
            });
            c.d(b, "a", function() {
                return M;
            });
            c.d(b, "d", function() {
                return P;
            });
            var d = c(7);
            var e = c(84);
            var f = {
                clone: d["clone"],
                dot: d["dot"]
            };
            var g = {
                create: function a(b, c) {
                    var d = [];
                    var e = {
                        rad: 0,
                        vec: f.clone([
                            0,
                            0
                        ])
                    };
                    var g = {};
                    function h(a) {
                        g[a.id] = a;
                        d.push(a);
                    }
                    function i() {
                        var a;
                        var b = 0;
                        for(a = 0; a < d.length; a++){
                            b += d[a].rad;
                        }
                        e.rad = b / d.length;
                        e.vec = f.clone([
                            Math.cos(e.rad),
                            Math.sin(e.rad), 
                        ]);
                    }
                    function j() {
                        h(b);
                        i();
                    }
                    j();
                    return {
                        add: function a(b) {
                            if (!g[b.id]) {
                                h(b);
                                i();
                            }
                        },
                        fits: function a(b) {
                            var d = Math.abs(f.dot(b.point.vec, e.vec));
                            if (d > c) {
                                return true;
                            }
                            return false;
                        },
                        getPoints: function a() {
                            return d;
                        },
                        getCenter: function a() {
                            return e;
                        }
                    };
                },
                createPoint: function a(b, c, d) {
                    return {
                        rad: b[d],
                        point: b,
                        id: c
                    };
                }
            };
            var h = c(10);
            var i = {
                clone: d["clone"]
            };
            var j = {
                clone: e["clone"]
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
            function l(a, b) {
                var c = a.data;
                var d = a.size.x;
                var e = a.size.y;
                var f = b.data;
                var g = 0;
                var h = 0;
                var i = 0;
                var j = 0;
                var k = 0;
                var l;
                var m;
                i = d;
                g = 0;
                for(m = 1; m < e; m++){
                    g += c[h];
                    f[i] += g;
                    h += d;
                    i += d;
                }
                h = 0;
                i = 1;
                g = 0;
                for(l = 1; l < d; l++){
                    g += c[h];
                    f[i] += g;
                    h++;
                    i++;
                }
                for(m = 1; m < e; m++){
                    h = m * d + 1;
                    i = (m - 1) * d + 1;
                    j = m * d;
                    k = (m - 1) * d;
                    for(l = 1; l < d; l++){
                        f[h] += c[h] + f[i] + f[j] - f[k];
                        h++;
                        i++;
                        j++;
                        k++;
                    }
                }
            }
            function m(a, b) {
                var c = a.data;
                var d = a.size.x;
                var e = a.size.y;
                var f = b.data;
                var g = 0;
                for(var h = 0; h < d; h++){
                    g += c[h];
                    f[h] = g;
                }
                for(var i = 1; i < e; i++){
                    g = 0;
                    for(var j = 0; j < d; j++){
                        g += c[i * d + j];
                        f[i * d + j] = g + f[(i - 1) * d + j];
                    }
                }
            }
            function n(a, b, c) {
                if (!c) {
                    c = a;
                }
                var d = a.data;
                var e = d.length;
                var f = c.data;
                while(e--){
                    f[e] = d[e] < b ? 1 : 0;
                }
            }
            function o(a, b) {
                if (!b) {
                    b = 8;
                }
                var c = a.data;
                var d = c.length;
                var e = 8 - b;
                var f = 1 << b;
                var g = new Int32Array(f);
                while(d--){
                    g[c[d] >> e]++;
                }
                return g;
            }
            function p(a) {
                var b;
                var c = a.length;
                var d = a[0];
                var e = a[1];
                var f;
                for(b = 1; b < c - 1; b++){
                    f = a[b + 1];
                    a[b - 1] = (e * 2 - d - f) & 255;
                    d = e;
                    e = f;
                }
                return a;
            }
            function q(a) {
                var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 8;
                var c;
                var d = 8 - b;
                function e(a, b) {
                    var d = 0;
                    for(var e = a; e <= b; e++){
                        d += c[e];
                    }
                    return d;
                }
                function f(a, b) {
                    var d = 0;
                    for(var e = a; e <= b; e++){
                        d += e * c[e];
                    }
                    return d;
                }
                function g() {
                    var d = [
                        0
                    ];
                    var g;
                    var i;
                    var j;
                    var k;
                    var l;
                    var m;
                    var n = (1 << b) - 1;
                    c = o(a, b);
                    for(var p = 1; p < n; p++){
                        g = e(0, p);
                        i = e(p + 1, n);
                        j = g * i;
                        if (j === 0) {
                            j = 1;
                        }
                        k = f(0, p) * i;
                        l = f(p + 1, n) * g;
                        m = k - l;
                        d[p] = (m * m) / j;
                    }
                    return h["a"].maxIndex(d);
                }
                var i = g();
                return i << d;
            }
            function r(a, b) {
                var c = q(a);
                n(a, c, b);
                return c;
            }
            function s(a, b, c) {
                m(a, b);
                if (!c) {
                    c = a;
                }
                var d = a.data;
                var e = c.data;
                var f = a.size.x;
                var g = a.size.y;
                var h = b.data;
                var i = 0;
                var j;
                var k;
                var l = 3;
                var n;
                var o;
                var p;
                var q;
                var r;
                var s = (l * 2 + 1) * (l * 2 + 1);
                for(j = 0; j <= l; j++){
                    for(k = 0; k < f; k++){
                        e[j * f + k] = 0;
                        e[(g - 1 - j) * f + k] = 0;
                    }
                }
                for(j = l; j < g - l; j++){
                    for(k = 0; k <= l; k++){
                        e[j * f + k] = 0;
                        e[j * f + (f - 1 - k)] = 0;
                    }
                }
                for(j = l + 1; j < g - l - 1; j++){
                    for(k = l + 1; k < f - l; k++){
                        n = h[(j - l - 1) * f + (k - l - 1)];
                        o = h[(j - l - 1) * f + (k + l)];
                        p = h[(j + l) * f + (k - l - 1)];
                        q = h[(j + l) * f + (k + l)];
                        i = q - p - o + n;
                        r = i / s;
                        e[j * f + k] = d[j * f + k] > r + 5 ? 0 : 1;
                    }
                }
            }
            function t(a, b, c) {
                var d;
                var e;
                var f;
                var h;
                var i = [];
                if (!c) {
                    c = "rad";
                }
                function j(a) {
                    var b = false;
                    for(e = 0; e < i.length; e++){
                        f = i[e];
                        if (f.fits(a)) {
                            f.add(a);
                            b = true;
                        }
                    }
                    return b;
                }
                for(d = 0; d < a.length; d++){
                    h = g.createPoint(a[d], d, c);
                    if (!j(h)) {
                        i.push(g.create(h, b));
                    }
                }
                return i;
            }
            var u = {
                trace: function a(b, c) {
                    var d;
                    var e = 10;
                    var f = [];
                    var g = [];
                    var h = 0;
                    var i = 0;
                    function a(a, d) {
                        var e;
                        var f;
                        var g;
                        var h = 1;
                        var i = Math.abs(c[1] / 10);
                        var j = false;
                        function k(a, b) {
                            if (a.x > b.x - h && a.x < b.x + h && a.y > b.y - i && a.y < b.y + i) {
                                return true;
                            }
                            return false;
                        }
                        var l = b[a];
                        if (d) {
                            g = {
                                x: l.x + c[0],
                                y: l.y + c[1]
                            };
                        } else {
                            g = {
                                x: l.x - c[0],
                                y: l.y - c[1]
                            };
                        }
                        f = d ? a + 1 : a - 1;
                        e = b[f];
                        while(e && (j = k(e, g)) !== true && Math.abs(e.y - l.y) < c[1]){
                            f = d ? f + 1 : f - 1;
                            e = b[f];
                        }
                        return j ? f : null;
                    }
                    for(d = 0; d < e; d++){
                        h = Math.floor(Math.random() * b.length);
                        f = [];
                        i = h;
                        f.push(b[i]);
                        while((i = a(i, true)) !== null){
                            f.push(b[i]);
                        }
                        if (h > 0) {
                            i = h;
                            while((i = a(i, false)) !== null){
                                f.push(b[i]);
                            }
                        }
                        if (f.length > g.length) {
                            g = f;
                        }
                    }
                    return g;
                }
            };
            var v = 1;
            var w = 2;
            function x(a, b) {
                var c;
                var d;
                var e = a.data;
                var f = b.data;
                var g = a.size.y;
                var h = a.size.x;
                var i;
                var j;
                var k;
                var l;
                var m;
                for(c = 1; c < g - 1; c++){
                    for(d = 1; d < h - 1; d++){
                        j = c - 1;
                        k = c + 1;
                        l = d - 1;
                        m = d + 1;
                        i = e[j * h + l] + e[j * h + m] + e[c * h + d] + e[k * h + l] + e[k * h + m];
                        f[c * h + d] = i > 0 ? 1 : 0;
                    }
                }
            }
            function y(a, b) {
                var c;
                var d;
                var e = a.data;
                var f = b.data;
                var g = a.size.y;
                var h = a.size.x;
                var i;
                var j;
                var k;
                var l;
                var m;
                for(c = 1; c < g - 1; c++){
                    for(d = 1; d < h - 1; d++){
                        j = c - 1;
                        k = c + 1;
                        l = d - 1;
                        m = d + 1;
                        i = e[j * h + l] + e[j * h + m] + e[c * h + d] + e[k * h + l] + e[k * h + m];
                        f[c * h + d] = i === 5 ? 1 : 0;
                    }
                }
            }
            function z(a, b, c) {
                if (!c) {
                    c = a;
                }
                var d = a.data.length;
                var e = a.data;
                var f = b.data;
                var g = c.data;
                while(d--){
                    g[d] = e[d] - f[d];
                }
            }
            function A(a, b, c) {
                if (!c) {
                    c = a;
                }
                var d = a.data.length;
                var e = a.data;
                var f = b.data;
                var g = c.data;
                while(d--){
                    g[d] = e[d] || f[d];
                }
            }
            function B(a) {
                var b = a.data.length;
                var c = a.data;
                var d = 0;
                while(b--){
                    d += c[b];
                }
                return d;
            }
            function C(a, b, c) {
                var d;
                var e = 0;
                var f = 0;
                var g = [];
                var h;
                var i;
                var j;
                for(d = 0; d < b; d++){
                    g[d] = {
                        score: 0,
                        item: null
                    };
                }
                for(d = 0; d < a.length; d++){
                    h = c.apply(this, [
                        a[d]
                    ]);
                    if (h > f) {
                        i = g[e];
                        i.score = h;
                        i.item = a[d];
                        f = Number.MAX_VALUE;
                        for(j = 0; j < b; j++){
                            if (g[j].score < f) {
                                f = g[j].score;
                                e = j;
                            }
                        }
                    }
                }
                return g;
            }
            function D(a, b, c, d) {
                c.drawImage(a, b, 0, a.width, a.height);
                var e = c.getImageData(b, 0, a.width, a.height).data;
                G(e, d);
            }
            function E(a, b, c, d) {
                var e = a.getImageData(c.x, c.y, b.x, b.y).data;
                G(e, d);
            }
            function F(a, b, c) {
                var d = 0;
                var e = b.x;
                var f = Math.floor(a.length / 4);
                var g = b.x / 2;
                var h = 0;
                var i = b.x;
                var j;
                while(e < f){
                    for(j = 0; j < g; j++){
                        c[h] = (0.299 * a[d * 4 + 0] + 0.587 * a[d * 4 + 1] + 0.114 * a[d * 4 + 2] + (0.299 * a[(d + 1) * 4 + 0] + 0.587 * a[(d + 1) * 4 + 1] + 0.114 * a[(d + 1) * 4 + 2]) + (0.299 * a[e * 4 + 0] + 0.587 * a[e * 4 + 1] + 0.114 * a[e * 4 + 2]) + (0.299 * a[(e + 1) * 4 + 0] + 0.587 * a[(e + 1) * 4 + 1] + 0.114 * a[(e + 1) * 4 + 2])) / 4;
                        h++;
                        d += 2;
                        e += 2;
                    }
                    d += i;
                    e += i;
                }
            }
            function G(a, b, c) {
                var d = (a.length / 4) | 0;
                var e = c && c.singleChannel === true;
                if (e) {
                    for(var f = 0; f < d; f++){
                        b[f] = a[f * 4 + 0];
                    }
                } else {
                    for(var g = 0; g < d; g++){
                        b[g] = 0.299 * a[g * 4 + 0] + 0.587 * a[g * 4 + 1] + 0.114 * a[g * 4 + 2];
                    }
                }
            }
            function H(a, b) {
                var c = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : document && document.createElement("canvas");
                var d = new Image();
                d.callback = b;
                d.onload = function() {
                    c.width = this.width;
                    c.height = this.height;
                    var a = c.getContext("2d");
                    a.drawImage(this, 0, 0);
                    var b = new Uint8Array(this.width * this.height);
                    a.drawImage(this, 0, 0);
                    var d = a.getImageData(0, 0, this.width, this.height), e = d.data;
                    G(e, b);
                    this.callback(b, {
                        x: this.width,
                        y: this.height
                    }, this);
                };
                d.src = a;
            }
            function I(a, b) {
                var c = a.data;
                var d = a.size.x;
                var e = b.data;
                var f = 0;
                var g = d;
                var h = c.length;
                var i = d / 2;
                var j = 0;
                while(g < h){
                    for(var k = 0; k < i; k++){
                        e[j] = Math.floor((c[f] + c[f + 1] + c[g] + c[g + 1]) / 4);
                        j++;
                        f += 2;
                        g += 2;
                    }
                    f += d;
                    g += d;
                }
            }
            function J(a) {
                var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [
                    0,
                    0,
                    0
                ];
                var c = a[0];
                var d = a[1];
                var e = a[2];
                var f = e * d;
                var g = f * (1 - Math.abs(((c / 60) % 2) - 1));
                var h = e - f;
                var i = 0;
                var j = 0;
                var k = 0;
                if (c < 60) {
                    i = f;
                    j = g;
                } else if (c < 120) {
                    i = g;
                    j = f;
                } else if (c < 180) {
                    j = f;
                    k = g;
                } else if (c < 240) {
                    j = g;
                    k = f;
                } else if (c < 300) {
                    i = g;
                    k = f;
                } else if (c < 360) {
                    i = f;
                    k = g;
                }
                b[0] = ((i + h) * 255) | 0;
                b[1] = ((j + h) * 255) | 0;
                b[2] = ((k + h) * 255) | 0;
                return b;
            }
            function K(a) {
                var b = [];
                var c = [];
                for(var d = 1; d < Math.sqrt(a) + 1; d++){
                    if (a % d === 0) {
                        c.push(d);
                        if (d !== a / d) {
                            b.unshift(Math.floor(a / d));
                        }
                    }
                }
                return c.concat(b);
            }
            function L(a, b) {
                var c = 0;
                var d = 0;
                var e = [];
                while(c < a.length && d < b.length){
                    if (a[c] === b[d]) {
                        e.push(a[c]);
                        c++;
                        d++;
                    } else if (a[c] > b[d]) {
                        d++;
                    } else {
                        c++;
                    }
                }
                return e;
            }
            function M(a, b) {
                var c = K(b.x);
                var d = K(b.y);
                var e = Math.max(b.x, b.y);
                var f = L(c, d);
                var g = [
                    8,
                    10,
                    15,
                    20,
                    32,
                    60,
                    80
                ];
                var h = {
                    "x-small": 5,
                    small: 4,
                    medium: 3,
                    large: 2,
                    "x-large": 1
                };
                var i = h[a] || h.medium;
                var j = g[i];
                var k = Math.floor(e / j);
                var l;
                function m(a) {
                    var b = 0;
                    var c = a[Math.floor(a.length / 2)];
                    while(b < a.length - 1 && a[b] < k){
                        b++;
                    }
                    if (b > 0) {
                        if (Math.abs(a[b] - k) > Math.abs(a[b - 1] - k)) {
                            c = a[b - 1];
                        } else {
                            c = a[b];
                        }
                    }
                    if (k / c < g[i + 1] / g[i] && k / c > g[i - 1] / g[i]) {
                        return {
                            x: c,
                            y: c
                        };
                    }
                    return null;
                }
                l = m(f);
                if (!l) {
                    l = m(K(e));
                    if (!l) {
                        l = m(K(k * j));
                    }
                }
                return l;
            }
            function N(a) {
                var b = {
                    value: parseFloat(a),
                    unit: a.indexOf("%") === a.length - 1 ? "%" : "%"
                };
                return b;
            }
            var O = {
                top: function a(b, c) {
                    return b.unit === "%" ? Math.floor(c.height * (b.value / 100)) : null;
                },
                right: function a(b, c) {
                    return b.unit === "%" ? Math.floor(c.width - c.width * (b.value / 100)) : null;
                },
                bottom: function a(b, c) {
                    return b.unit === "%" ? Math.floor(c.height - c.height * (b.value / 100)) : null;
                },
                left: function a(b, c) {
                    return b.unit === "%" ? Math.floor(c.width * (b.value / 100)) : null;
                }
            };
            function P(a, b, c) {
                var d = {
                    width: a,
                    height: b
                };
                var e = Object.keys(c).reduce(function(a, b) {
                    var e = c[b];
                    var f = N(e);
                    var g = O[b](f, d);
                    a[b] = g;
                    return a;
                }, {});
                return {
                    sx: e.left,
                    sy: e.top,
                    sw: e.right - e.left,
                    sh: e.bottom - e.top
                };
            }
        },
        function(a, b, c) {
            "use strict";
            b["a"] = {
                drawRect: function a(b, c, d, e) {
                    d.strokeStyle = e.color;
                    d.fillStyle = e.color;
                    d.lineWidth = e.lineWidth || 1;
                    d.beginPath();
                    d.strokeRect(b.x, b.y, c.x, c.y);
                },
                drawPath: function a(b, c, d, e) {
                    d.strokeStyle = e.color;
                    d.fillStyle = e.color;
                    d.lineWidth = e.lineWidth;
                    d.beginPath();
                    d.moveTo(b[0][c.x], b[0][c.y]);
                    for(var f = 1; f < b.length; f++){
                        d.lineTo(b[f][c.x], b[f][c.y]);
                    }
                    d.closePath();
                    d.stroke();
                },
                drawImage: function a(b, c, d) {
                    var e = d.getImageData(0, 0, c.x, c.y);
                    var f = e.data;
                    var g = f.length;
                    var h = b.length;
                    if (g / h !== 4) {
                        return false;
                    }
                    while(h--){
                        var i = b[h];
                        f[--g] = 255;
                        f[--g] = i;
                        f[--g] = i;
                        f[--g] = i;
                    }
                    d.putImageData(e, 0, 0);
                    return true;
                }
            };
        },
        function(a, b, c) {
            "use strict";
            b["a"] = {
                init: function a(b, c) {
                    var d = b.length;
                    while(d--){
                        b[d] = c;
                    }
                },
                shuffle: function a(b) {
                    var c = b.length - 1;
                    for(c; c >= 0; c--){
                        var d = Math.floor(Math.random() * c);
                        var e = b[c];
                        b[c] = b[d];
                        b[d] = e;
                    }
                    return b;
                },
                toPointList: function a(b) {
                    var c = b.reduce(function(a, b) {
                        var c = "[".concat(b.join(","), "]");
                        a.push(c);
                        return a;
                    }, []);
                    return "[".concat(c.join(",\r\n"), "]");
                },
                threshold: function a(b, c, d) {
                    var e = b.reduce(function(a, e) {
                        if (d.apply(b, [
                            e
                        ]) >= c) {
                            a.push(e);
                        }
                        return a;
                    }, []);
                    return e;
                },
                maxIndex: function a(b) {
                    var c = 0;
                    for(var d = 0; d < b.length; d++){
                        if (b[d] > b[c]) {
                            c = d;
                        }
                    }
                    return c;
                },
                max: function a(b) {
                    var a = 0;
                    for(var c = 0; c < b.length; c++){
                        if (b[c] > a) {
                            a = b[c];
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
        function(a, b, c) {
            "use strict";
            var d = c(83);
            var e = c.n(d);
            var f = c(3);
            var g = c.n(f);
            var h = c(4);
            var i = c.n(h);
            var j = c(0);
            var k = c.n(j);
            var l = c(7);
            var m = c.n(l);
            var n = c(8);
            var o = c(10);
            var p = {
                clone: l["clone"]
            };
            function q(a) {
                if (a < 0) {
                    throw new Error("expected positive number, received ".concat(a));
                }
            }
            var r = (function() {
                function a(b, c) {
                    var d = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Uint8Array;
                    var e = arguments.length > 3 ? arguments[3] : undefined;
                    g()(this, a);
                    k()(this, "data", void 0);
                    k()(this, "size", void 0);
                    k()(this, "indexMapping", void 0);
                    if (!c) {
                        this.data = new d(b.x * b.y);
                        if (e) {
                            o["a"].init(this.data, 0);
                        }
                    } else {
                        this.data = c;
                    }
                    this.size = b;
                }
                i()(a, [
                    {
                        key: "inImageWithBorder",
                        value: function a(b) {
                            var c = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
                            q(c);
                            return (b.x >= 0 && b.y >= 0 && b.x < this.size.x + c * 2 && b.y < this.size.y + c * 2);
                        }
                    },
                    {
                        key: "subImageAsCopy",
                        value: function a(b, c) {
                            q(c.x);
                            q(c.y);
                            var d = b.size, e = d.x, f = d.y;
                            for(var g = 0; g < e; g++){
                                for(var h = 0; h < f; h++){
                                    b.data[h * e + g] = this.data[(c.y + h) * this.size.x + c.x + g];
                                }
                            }
                            return b;
                        }
                    },
                    {
                        key: "get",
                        value: function a(b, c) {
                            return this.data[c * this.size.x + b];
                        }
                    },
                    {
                        key: "getSafe",
                        value: function a(b, c) {
                            if (!this.indexMapping) {
                                this.indexMapping = {
                                    x: [],
                                    y: []
                                };
                                for(var d = 0; d < this.size.x; d++){
                                    this.indexMapping.x[d] = d;
                                    this.indexMapping.x[d + this.size.x] = d;
                                }
                                for(var e = 0; e < this.size.y; e++){
                                    this.indexMapping.y[e] = e;
                                    this.indexMapping.y[e + this.size.y] = e;
                                }
                            }
                            return this.data[this.indexMapping.y[c + this.size.y] * this.size.x + this.indexMapping.x[b + this.size.x]];
                        }
                    },
                    {
                        key: "set",
                        value: function a(b, c, d) {
                            this.data[c * this.size.x + b] = d;
                            delete this.indexMapping;
                            return this;
                        }
                    },
                    {
                        key: "zeroBorder",
                        value: function a() {
                            var b = this.size, c = b.x, d = b.y;
                            for(var e = 0; e < c; e++){
                                this.data[e] = this.data[(d - 1) * c + e] = 0;
                            }
                            for(var f = 1; f < d - 1; f++){
                                this.data[f * c] = this.data[f * c + (c - 1)] = 0;
                            }
                            delete this.indexMapping;
                            return this;
                        }
                    },
                    {
                        key: "moments",
                        value: function a(b) {
                            var c = this.data;
                            var d;
                            var e;
                            var f = this.size.y;
                            var g = this.size.x;
                            var h;
                            var i;
                            var j = [];
                            var k;
                            var l;
                            var m;
                            var n;
                            var o;
                            var q;
                            var r;
                            var s;
                            var t = [];
                            var u = Math.PI;
                            var v = u / 4;
                            if (b <= 0) {
                                return t;
                            }
                            for(k = 0; k < b; k++){
                                j[k] = {
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
                            for(e = 0; e < f; e++){
                                i = e * e;
                                for(d = 0; d < g; d++){
                                    h = c[e * g + d];
                                    if (h > 0) {
                                        l = j[h - 1];
                                        l.m00 += 1;
                                        l.m01 += e;
                                        l.m10 += d;
                                        l.m11 += d * e;
                                        l.m02 += i;
                                        l.m20 += d * d;
                                    }
                                }
                            }
                            for(k = 0; k < b; k++){
                                l = j[k];
                                if (!isNaN(l.m00) && l.m00 !== 0) {
                                    q = l.m10 / l.m00;
                                    r = l.m01 / l.m00;
                                    m = l.m11 / l.m00 - q * r;
                                    n = l.m02 / l.m00 - r * r;
                                    o = l.m20 / l.m00 - q * q;
                                    s = (n - o) / (2 * m);
                                    s = 0.5 * Math.atan(s) + (m >= 0 ? v : -v) + u;
                                    l.theta = (((s * 180) / u + 90) % 180) - 90;
                                    if (l.theta < 0) {
                                        l.theta += 180;
                                    }
                                    l.rad = s > u ? s - u : s;
                                    l.vec = p.clone([
                                        Math.cos(s),
                                        Math.sin(s), 
                                    ]);
                                    t.push(l);
                                }
                            }
                            return t;
                        }
                    },
                    {
                        key: "getAsRGBA",
                        value: function a() {
                            var b = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1.0;
                            var c = new Uint8ClampedArray(4 * this.size.x * this.size.y);
                            for(var d = 0; d < this.size.y; d++){
                                for(var e = 0; e < this.size.x; e++){
                                    var f = d * this.size.x + e;
                                    var g = this.get(e, d) * b;
                                    c[f * 4 + 0] = g;
                                    c[f * 4 + 1] = g;
                                    c[f * 4 + 2] = g;
                                    c[f * 4 + 3] = 255;
                                }
                            }
                            return c;
                        }
                    },
                    {
                        key: "show",
                        value: function a(b) {
                            var c = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1.0;
                            var d = b.getContext("2d");
                            if (!d) {
                                throw new Error("Unable to get canvas context");
                            }
                            var e = d.getImageData(0, 0, b.width, b.height);
                            var f = this.getAsRGBA(c);
                            b.width = this.size.x;
                            b.height = this.size.y;
                            var g = new ImageData(f, e.width, e.height);
                            d.putImageData(g, 0, 0);
                        }
                    },
                    {
                        key: "overlay",
                        value: function a(b, c, d) {
                            var f = c < 0 || c > 360 ? 360 : c;
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
                            var i = [
                                255,
                                255,
                                255
                            ];
                            var j = [
                                0,
                                0,
                                0
                            ];
                            var k = [];
                            var l = b.getContext("2d");
                            if (!l) {
                                throw new Error("Unable to get canvas context");
                            }
                            var m = l.getImageData(d.x, d.y, this.size.x, this.size.y);
                            var o = m.data;
                            var p = this.data.length;
                            while(p--){
                                g[0] = this.data[p] * f;
                                k = g[0] <= 0 ? i : g[0] >= 360 ? j : Object(n["g"])(g, h);
                                var q = p * 4;
                                var r = k;
                                var s = e()(r, 3);
                                o[q] = s[0];
                                o[q + 1] = s[1];
                                o[q + 2] = s[2];
                                o[q + 3] = 255;
                            }
                            l.putImageData(m, d.x, d.y);
                        }
                    }, 
                ]);
                return a;
            })();
            b["a"] = r;
        },
        function(a, b, c) {
            a.exports = c(228);
        },
        function(a, b, c) {
            var d = c(227);
            function e(b, c, f) {
                if (typeof Reflect !== "undefined" && Reflect.get) {
                    a.exports = e = Reflect.get;
                    (a.exports["default"] = a.exports), (a.exports.__esModule = true);
                } else {
                    a.exports = e = function a(b, c, e) {
                        var f = d(b, c);
                        if (!f) return;
                        var g = Object.getOwnPropertyDescriptor(f, c);
                        if (g.get) {
                            return g.get.call(e);
                        }
                        return g.value;
                    };
                    (a.exports["default"] = a.exports), (a.exports.__esModule = true);
                }
                return e(b, c, f || b);
            }
            a.exports = e;
            (a.exports["default"] = a.exports), (a.exports.__esModule = true);
        },
        function(a, b) {
            function c(a) {
                var b = typeof a;
                return (a != null && (b == "object" || b == "function"));
            }
            a.exports = c;
        },
        function(a, b) {
            var c = Array.isArray;
            a.exports = c;
        },
        function(a, b, c) {
            var d = c(90), e = c(145);
            var f = e(function(a, b, c) {
                d(a, b, c);
            });
            a.exports = f;
        },
        function(a, b, c) {
            var d = c(45);
            var e = typeof self == "object" && self && self.Object === Object && self;
            var f = d || e || Function("return this")();
            a.exports = f;
        },
        function(a, b) {
            function c(a) {
                return a != null && typeof a == "object";
            }
            a.exports = c;
        },
        function(a, b) {
            function c(b) {
                "@babel/helpers - typeof";
                if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
                    a.exports = c = function a(b) {
                        return typeof b;
                    };
                    (a.exports["default"] = a.exports), (a.exports.__esModule = true);
                } else {
                    a.exports = c = function a(b) {
                        return b && typeof Symbol === "function" && b.constructor === Symbol && b !== Symbol.prototype ? "symbol" : typeof b;
                    };
                    (a.exports["default"] = a.exports), (a.exports.__esModule = true);
                }
                return c(b);
            }
            a.exports = c;
            (a.exports["default"] = a.exports), (a.exports.__esModule = true);
        },
        function(a, b) {
            function c(a, b, c, d, e, f, g) {
                try {
                    var h = a[f](g);
                    var i = h.value;
                } catch (j) {
                    c(j);
                    return;
                }
                if (h.done) {
                    b(i);
                } else {
                    Promise.resolve(i).then(d, e);
                }
            }
            function d(a) {
                return function() {
                    var b = this, d = arguments;
                    return new Promise(function(e, f) {
                        var g = a.apply(b, d);
                        function h(a) {
                            c(g, e, f, h, i, "next", a);
                        }
                        function i(a) {
                            c(g, e, f, h, i, "throw", a);
                        }
                        h(undefined);
                    });
                };
            }
            a.exports = d;
            (a.exports["default"] = a.exports), (a.exports.__esModule = true);
        },
        function(a, b, c) {
            "use strict";
            var d = {
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
                create: function a(b, c) {
                    var d = b.data;
                    var e = c.data;
                    var f = this.searchDirections;
                    var g = b.size.x;
                    var h;
                    function i(a, b, c, i) {
                        var j;
                        var k;
                        var l;
                        for(j = 0; j < 7; j++){
                            k = a.cy + f[a.dir][0];
                            l = a.cx + f[a.dir][1];
                            h = k * g + l;
                            if (d[h] === b && (e[h] === 0 || e[h] === c)) {
                                e[h] = c;
                                a.cy = k;
                                a.cx = l;
                                return true;
                            }
                            if (e[h] === 0) {
                                e[h] = i;
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
                    function k(a, b, c, d, e) {
                        var f = null;
                        var g;
                        var h;
                        var k;
                        var l = {
                            cx: b,
                            cy: a,
                            dir: 0
                        };
                        if (i(l, d, c, e)) {
                            f = j(b, a, l.dir);
                            g = f;
                            k = l.dir;
                            h = j(l.cx, l.cy, 0);
                            h.prev = g;
                            g.next = h;
                            h.next = null;
                            g = h;
                            do {
                                l.dir = (l.dir + 6) % 8;
                                i(l, d, c, e);
                                if (k !== l.dir) {
                                    g.dir = l.dir;
                                    h = j(l.cx, l.cy, 0);
                                    h.prev = g;
                                    g.next = h;
                                    h.next = null;
                                    g = h;
                                } else {
                                    g.dir = k;
                                    g.x = l.cx;
                                    g.y = l.cy;
                                }
                                k = l.dir;
                            }while (l.cx !== b || l.cy !== a)
                            f.prev = g.prev;
                            g.prev.next = f;
                        }
                        return f;
                    }
                    return {
                        trace: function a(b, c, d, e) {
                            return i(b, c, d, e);
                        },
                        contourTracing: function a(b, c, d, e, f) {
                            return k(b, c, d, e, f);
                        }
                    };
                }
            };
            b["a"] = d;
        },
        function(a, b, c) {
            var d = c(27), e = c(103), f = c(104);
            var g = "[object Null]", h = "[object Undefined]";
            var i = d ? d.toStringTag : undefined;
            function j(a) {
                if (a == null) {
                    return a === undefined ? h : g;
                }
                return i && i in Object(a) ? e(a) : f(a);
            }
            a.exports = j;
        },
        function(a, b, c) {
            "use strict";
            (function(a) {
                var d = c(7);
                var e = c.n(d);
                var f = c(34);
                var g = c.n(f);
                var h = c(11);
                var i = c(8);
                var j = c(10);
                var k = c(9);
                var l = c(87);
                var m = c(21);
                var n = c(88);
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
                    var b = new ArrayBuffer(64 * 1024);
                    r = new h["a"](x, new Uint8Array(b, 0, x.x * x.y));
                    q = new h["a"](x, new Uint8Array(b, x.x * x.y * 3, x.x * x.y), undefined, true);
                    B = Object(n["a"])(typeof window !== "undefined" ? window : typeof self !== "undefined" ? self : a, {
                        size: x.x
                    }, b);
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
                function E(a) {
                    var b;
                    var c;
                    var e;
                    var g;
                    var h;
                    var i = w.size.x;
                    var j = w.size.y;
                    var l = -w.size.x;
                    var m = -w.size.y;
                    var n;
                    var p;
                    b = 0;
                    for(c = 0; c < a.length; c++){
                        g = a[c];
                        b += g.rad;
                        if (true && o.debug.showPatches) {
                            k["a"].drawRect(g.pos, r.size, y.ctx.binary, {
                                color: "red"
                            });
                        }
                    }
                    b /= a.length;
                    b = (((b * 180) / Math.PI + 90) % 180) - 90;
                    if (b < 0) {
                        b += 180;
                    }
                    b = ((180 - b) * Math.PI) / 180;
                    h = f["copy"](f["create"](), [
                        Math.cos(b),
                        Math.sin(b),
                        -Math.sin(b),
                        Math.cos(b), 
                    ]);
                    for(c = 0; c < a.length; c++){
                        g = a[c];
                        for(e = 0; e < 4; e++){
                            d["transformMat2"](g.box[e], g.box[e], h);
                        }
                        if (true && o.debug.boxFromPatches.showTransformed) {
                            k["a"].drawPath(g.box, {
                                x: 0,
                                y: 1
                            }, y.ctx.binary, {
                                color: "#99ff00",
                                lineWidth: 2
                            });
                        }
                    }
                    for(c = 0; c < a.length; c++){
                        g = a[c];
                        for(e = 0; e < 4; e++){
                            if (g.box[e][0] < i) {
                                i = g.box[e][0];
                            }
                            if (g.box[e][0] > l) {
                                l = g.box[e][0];
                            }
                            if (g.box[e][1] < j) {
                                j = g.box[e][1];
                            }
                            if (g.box[e][1] > m) {
                                m = g.box[e][1];
                            }
                        }
                    }
                    n = [
                        [
                            i,
                            j
                        ],
                        [
                            l,
                            j
                        ],
                        [
                            l,
                            m
                        ],
                        [
                            i,
                            m
                        ], 
                    ];
                    if (true && o.debug.boxFromPatches.showTransformedBox) {
                        k["a"].drawPath(n, {
                            x: 0,
                            y: 1
                        }, y.ctx.binary, {
                            color: "#ff0000",
                            lineWidth: 2
                        });
                    }
                    p = o.halfSample ? 2 : 1;
                    h = f["invert"](h, h);
                    for(e = 0; e < 4; e++){
                        d["transformMat2"](n[e], n[e], h);
                    }
                    if (true && o.debug.boxFromPatches.showBB) {
                        k["a"].drawPath(n, {
                            x: 0,
                            y: 1
                        }, y.ctx.binary, {
                            color: "#ff0000",
                            lineWidth: 2
                        });
                    }
                    for(e = 0; e < 4; e++){
                        d["scale"](n[e], n[e], p);
                    }
                    return n;
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
                    var c;
                    var d;
                    var e;
                    var f = [];
                    var g;
                    var h;
                    var i;
                    for(a = 0; a < z.x; a++){
                        for(b = 0; b < z.y; b++){
                            c = r.size.x * a;
                            d = r.size.y * b;
                            K(c, d);
                            q.zeroBorder();
                            j["a"].init(s.data, 0);
                            g = l["a"].create(q, s);
                            h = g.rasterize(0);
                            if (true && o.debug.showLabels) {
                                s.overlay(y.dom.binary, Math.floor(360 / h.count), {
                                    x: c,
                                    y: d
                                });
                            }
                            e = s.moments(h.count);
                            f = f.concat(L(e, [
                                a,
                                b
                            ], c, d));
                        }
                    }
                    if (true && o.debug.showFoundPatches) {
                        for(a = 0; a < f.length; a++){
                            i = f[a];
                            k["a"].drawRect(i.pos, r.size, y.ctx.binary, {
                                color: "#99ff00",
                                lineWidth: 2
                            });
                        }
                    }
                    return f;
                }
                function H(a) {
                    var b;
                    var c;
                    var d = [];
                    var e = [];
                    for(b = 0; b < a; b++){
                        d.push(0);
                    }
                    c = u.data.length;
                    while(c--){
                        if (u.data[c] > 0) {
                            d[u.data[c] - 1]++;
                        }
                    }
                    d = d.map(function(a, b) {
                        return {
                            val: a,
                            label: b + 1
                        };
                    });
                    d.sort(function(a, b) {
                        return b.val - a.val;
                    });
                    e = d.filter(function(a) {
                        return a.val >= 5;
                    });
                    return e;
                }
                function I(a, b) {
                    var c;
                    var d;
                    var e;
                    var f = [];
                    var g;
                    var h;
                    var j = [];
                    var l = [
                        0,
                        1,
                        1
                    ];
                    var m = [
                        0,
                        0,
                        0
                    ];
                    for(c = 0; c < a.length; c++){
                        e = u.data.length;
                        f.length = 0;
                        while(e--){
                            if (u.data[e] === a[c].label) {
                                g = v.data[e];
                                f.push(g);
                            }
                        }
                        h = E(f);
                        if (h) {
                            j.push(h);
                            if (true && o.debug.showRemainingPatchLabels) {
                                for(d = 0; d < f.length; d++){
                                    g = f[d];
                                    l[0] = (a[c].label / (b + 1)) * 360;
                                    Object(i["g"])(l, m);
                                    k["a"].drawRect(g.pos, r.size, y.ctx.binary, {
                                        color: "rgb(".concat(m.join(","), ")"),
                                        lineWidth: 2
                                    });
                                }
                            }
                        }
                    }
                    return j;
                }
                function J(a) {
                    var b = Object(i["b"])(a, 0.9);
                    var c = Object(i["j"])(b, 1, function(a) {
                        return a.getPoints().length;
                    });
                    var d = [];
                    var e = [];
                    if (c.length === 1) {
                        d = c[0].item.getPoints();
                        for(var f = 0; f < d.length; f++){
                            e.push(d[f].point);
                        }
                    }
                    return e;
                }
                function K(a, b) {
                    w.subImageAsCopy(r, Object(i["h"])(a, b));
                    B.skeletonize();
                    if (true && o.debug.showSkeleton) {
                        q.overlay(y.dom.binary, 360, Object(i["h"])(a, b));
                    }
                }
                function L(a, b, c, e) {
                    var f;
                    var g;
                    var h = [];
                    var i;
                    var j;
                    var k = [];
                    var l = Math.ceil(x.x / 3);
                    if (a.length >= 2) {
                        for(f = 0; f < a.length; f++){
                            if (a[f].m00 > l) {
                                h.push(a[f]);
                            }
                        }
                        if (h.length >= 2) {
                            i = J(h);
                            g = 0;
                            for(f = 0; f < i.length; f++){
                                g += i[f].rad;
                            }
                            if (i.length > 1 && i.length >= (h.length / 4) * 3 && i.length > a.length / 4) {
                                g /= i.length;
                                j = {
                                    index: b[1] * z.x + b[0],
                                    pos: {
                                        x: c,
                                        y: e
                                    },
                                    box: [
                                        d["clone"]([
                                            c,
                                            e
                                        ]),
                                        d["clone"]([
                                            c + r.size.x,
                                            e
                                        ]),
                                        d["clone"]([
                                            c + r.size.x,
                                            e + r.size.y, 
                                        ]),
                                        d["clone"]([
                                            c,
                                            e + r.size.y
                                        ]), 
                                    ],
                                    moments: i,
                                    rad: g,
                                    vec: d["clone"]([
                                        Math.cos(g),
                                        Math.sin(g)
                                    ])
                                };
                                k.push(j);
                            }
                        }
                    }
                    return k;
                }
                function M(a) {
                    var b = 0;
                    var c = 0.95;
                    var e = 0;
                    var f;
                    var g;
                    var h = [
                        0,
                        1,
                        1
                    ];
                    var l = [
                        0,
                        0,
                        0
                    ];
                    function n() {
                        var a;
                        for(a = 0; a < u.data.length; a++){
                            if (u.data[a] === 0 && t.data[a] === 1) {
                                return a;
                            }
                        }
                        return u.length;
                    }
                    function p(a) {
                        var e;
                        var f;
                        var g;
                        var h;
                        var i;
                        var j = {
                            x: a % u.size.x,
                            y: (a / u.size.x) | 0
                        };
                        var k;
                        if (a < u.data.length) {
                            g = v.data[a];
                            u.data[a] = b;
                            for(i = 0; i < m["a"].searchDirections.length; i++){
                                f = j.y + m["a"].searchDirections[i][0];
                                e = j.x + m["a"].searchDirections[i][1];
                                h = f * u.size.x + e;
                                if (t.data[h] === 0) {
                                    u.data[h] = Number.MAX_VALUE;
                                    continue;
                                }
                                if (u.data[h] === 0) {
                                    k = Math.abs(d["dot"](v.data[h].vec, g.vec));
                                    if (k > c) {
                                        p(h);
                                    }
                                }
                            }
                        }
                    }
                    j["a"].init(t.data, 0);
                    j["a"].init(u.data, 0);
                    j["a"].init(v.data, null);
                    for(f = 0; f < a.length; f++){
                        g = a[f];
                        v.data[g.index] = g;
                        t.data[g.index] = 1;
                    }
                    t.zeroBorder();
                    while((e = n()) < u.data.length){
                        b++;
                        p(e);
                    }
                    if (true && o.debug.showPatchLabels) {
                        for(f = 0; f < u.data.length; f++){
                            if (u.data[f] > 0 && u.data[f] <= b) {
                                g = v.data[f];
                                h[0] = (u.data[f] / (b + 1)) * 360;
                                Object(i["g"])(h, l);
                                k["a"].drawRect(g.pos, r.size, y.ctx.binary, {
                                    color: "rgb(".concat(l.join(","), ")"),
                                    lineWidth: 2
                                });
                            }
                        }
                    }
                    return b;
                }
                b["a"] = {
                    init: function a(b, c) {
                        o = c;
                        A = b;
                        C();
                        D();
                    },
                    locate: function a() {
                        if (o.halfSample) {
                            Object(i["f"])(A, p);
                        }
                        F();
                        var b = G();
                        if (b.length < z.x * z.y * 0.05) {
                            return null;
                        }
                        var c = M(b);
                        if (c < 1) {
                            return null;
                        }
                        var d = H(c);
                        if (d.length === 0) {
                            return null;
                        }
                        var e = I(d, c);
                        return e;
                    },
                    checkImageConstraints: function a(b, c) {
                        var d;
                        var e = b.getWidth();
                        var f = b.getHeight();
                        var g = c.halfSample ? 0.5 : 1;
                        var h;
                        if (b.getConfig().area) {
                            h = Object(i["d"])(e, f, b.getConfig().area);
                            b.setTopRight({
                                x: h.sx,
                                y: h.sy
                            });
                            b.setCanvasSize({
                                x: e,
                                y: f
                            });
                            e = h.sw;
                            f = h.sh;
                        }
                        var j = {
                            x: Math.floor(e * g),
                            y: Math.floor(f * g)
                        };
                        d = Object(i["a"])(c.patchSize, j);
                        if (true) {
                            console.log("Patch-Size: ".concat(JSON.stringify(d)));
                        }
                        b.setWidth(Math.floor(Math.floor(j.x / d.x) * (1 / g) * d.x));
                        b.setHeight(Math.floor(Math.floor(j.y / d.y) * (1 / g) * d.y));
                        if (b.getWidth() % d.x === 0 && b.getHeight() % d.y === 0) {
                            return true;
                        }
                        throw new Error("Image dimensions do not comply with the current settings: Width (".concat(e, " )and height (").concat(f, ") must a multiple of ").concat(d.x));
                    }
                };
            }.call(this, c(46)));
        },
        function(a, b, c) {
            var d = c(92), e = c(93), f = c(94), g = c(95), h = c(96);
            function i(a) {
                var b = -1, c = a == null ? 0 : a.length;
                this.clear();
                while(++b < c){
                    var d = a[b];
                    this.set(d[0], d[1]);
                }
            }
            i.prototype.clear = d;
            i.prototype["delete"] = e;
            i.prototype.get = f;
            i.prototype.has = g;
            i.prototype.set = h;
            a.exports = i;
        },
        function(a, b, c) {
            var d = c(26);
            function e(a, b) {
                var c = a.length;
                while(c--){
                    if (d(a[c][0], b)) {
                        return c;
                    }
                }
                return -1;
            }
            a.exports = e;
        },
        function(a, b) {
            function c(a, b) {
                return (a === b || (a !== a && b !== b));
            }
            a.exports = c;
        },
        function(a, b, c) {
            var d = c(17);
            var e = d.Symbol;
            a.exports = e;
        },
        function(a, b, c) {
            var d = c(35);
            var e = d(Object, "create");
            a.exports = e;
        },
        function(a, b, c) {
            var d = c(117);
            function e(a, b) {
                var c = a.__data__;
                return d(b) ? c[typeof b == "string" ? "string" : "hash"] : c.map;
            }
            a.exports = e;
        },
        function(a, b, c) {
            var d = c(132), e = c(18);
            var f = Object.prototype;
            var g = f.hasOwnProperty;
            var h = f.propertyIsEnumerable;
            var i = d((function() {
                return arguments;
            })()) ? d : function(a) {
                return (e(a) && g.call(a, "callee") && !h.call(a, "callee"));
            };
            a.exports = i;
        },
        function(a, b) {
            var c = 9007199254740991;
            var d = /^(?:0|[1-9]\d*)$/;
            function e(a, b) {
                var e = typeof a;
                b = b == null ? c : b;
                return (!!b && (e == "number" || (e != "symbol" && d.test(a))) && a > -1 && a % 1 == 0 && a < b);
            }
            a.exports = e;
        },
        function(a, b, c) {
            var d = c(15), e = c(232), f = c(233), g = c(236);
            function h(a, b) {
                if (d(a)) {
                    return a;
                }
                return e(a, b) ? [
                    a
                ] : f(g(a));
            }
            a.exports = h;
        },
        function(a, b, c) {
            var d = c(224);
            var e = c(225);
            var f = c(60);
            var g = c(226);
            function h(a) {
                return (d(a) || e(a) || f(a) || g());
            }
            a.exports = h;
            (a.exports["default"] = a.exports), (a.exports.__esModule = true);
        },
        function(a, b, c) {
            a.exports = {
                determinant: c(251),
                transpose: c(252),
                multiply: c(253),
                identity: c(254),
                adjoint: c(255),
                rotate: c(256),
                invert: c(257),
                create: c(258),
                scale: c(259),
                copy: c(260),
                frob: c(261),
                ldu: c(262)
            };
        },
        function(a, b, c) {
            var d = c(102), e = c(108);
            function f(a, b) {
                var c = e(a, b);
                return d(c) ? c : undefined;
            }
            a.exports = f;
        },
        function(a, b, c) {
            var d = c(22), e = c(14);
            var f = "[object AsyncFunction]", g = "[object Function]", h = "[object GeneratorFunction]", i = "[object Proxy]";
            function j(a) {
                if (!e(a)) {
                    return false;
                }
                var b = d(a);
                return (b == g || b == h || b == f || b == i);
            }
            a.exports = j;
        },
        function(a, b, c) {
            var d = c(49);
            function e(a, b, c) {
                if (b == "__proto__" && d) {
                    d(a, b, {
                        configurable: true,
                        enumerable: true,
                        value: c,
                        writable: true
                    });
                } else {
                    a[b] = c;
                }
            }
            a.exports = e;
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
        function(a, b, c) {
            var d = c(36), e = c(40);
            function f(a) {
                return (a != null && e(a.length) && !d(a));
            }
            a.exports = f;
        },
        function(a, b) {
            var c = 9007199254740991;
            function d(a) {
                return (typeof a == "number" && a > -1 && a % 1 == 0 && a <= c);
            }
            a.exports = d;
        },
        function(a, b) {
            function c(b, d) {
                a.exports = c = Object.setPrototypeOf || function a(b, c) {
                    b.__proto__ = c;
                    return b;
                };
                (a.exports["default"] = a.exports), (a.exports.__esModule = true);
                return c(b, d);
            }
            a.exports = c;
            (a.exports["default"] = a.exports), (a.exports.__esModule = true);
        },
        function(a, b, c) {
            var d = c(22), e = c(18);
            var f = "[object Symbol]";
            function g(a) {
                return (typeof a == "symbol" || (e(a) && d(a) == f));
            }
            a.exports = g;
        },
        function(a, b, c) {
            var d = c(42);
            var e = 1 / 0;
            function f(a) {
                if (typeof a == "string" || d(a)) {
                    return a;
                }
                var b = a + "";
                return b == "0" && 1 / a == -e ? "-0" : b;
            }
            a.exports = f;
        },
        function(a, b, c) {
            var d = c(35), e = c(17);
            var f = d(e, "Map");
            a.exports = f;
        },
        function(a, b, c) {
            (function(b) {
                var c = typeof b == "object" && b && b.Object === Object && b;
                a.exports = c;
            }.call(this, c(46)));
        },
        function(a, b) {
            var c;
            c = (function() {
                return this;
            })();
            try {
                c = c || new Function("return this")();
            } catch (d) {
                if (typeof window === "object") c = window;
            }
            a.exports = c;
        },
        function(a, b, c) {
            var d = c(109), e = c(116), f = c(118), g = c(119), h = c(120);
            function i(a) {
                var b = -1, c = a == null ? 0 : a.length;
                this.clear();
                while(++b < c){
                    var d = a[b];
                    this.set(d[0], d[1]);
                }
            }
            i.prototype.clear = d;
            i.prototype["delete"] = e;
            i.prototype.get = f;
            i.prototype.has = g;
            i.prototype.set = h;
            a.exports = i;
        },
        function(a, b, c) {
            var d = c(37), e = c(26);
            function f(a, b, c) {
                if ((c !== undefined && !e(a[b], c)) || (c === undefined && !(b in a))) {
                    d(a, b, c);
                }
            }
            a.exports = f;
        },
        function(a, b, c) {
            var d = c(35);
            var e = (function() {
                try {
                    var a = d(Object, "defineProperty");
                    a({}, "", {});
                    return a;
                } catch (b) {}
            })();
            a.exports = e;
        },
        function(a, b, c) {
            var d = c(131);
            var e = d(Object.getPrototypeOf, Object);
            a.exports = e;
        },
        function(a, b) {
            var c = Object.prototype;
            function d(a) {
                var b = a && a.constructor, d = (typeof b == "function" && b.prototype) || c;
                return a === d;
            }
            a.exports = d;
        },
        function(a, b, c) {
            (function(a) {
                var d = c(17), e = c(134);
                var f = true && b && !b.nodeType && b;
                var g = f && typeof a == "object" && a && !a.nodeType && a;
                var h = g && g.exports === f;
                var i = h ? d.Buffer : undefined;
                var j = i ? i.isBuffer : undefined;
                var k = j || e;
                a.exports = k;
            }.call(this, c(38)(a)));
        },
        function(a, b, c) {
            var d = c(136), e = c(137), f = c(138);
            var g = f && f.isTypedArray;
            var h = g ? e(g) : d;
            a.exports = h;
        },
        function(a, b) {
            function c(a, b) {
                if (b === "constructor" && typeof a[b] === "function") {
                    return;
                }
                if (b == "__proto__") {
                    return;
                }
                return a[b];
            }
            a.exports = c;
        },
        function(a, b, c) {
            var d = c(37), e = c(26);
            var f = Object.prototype;
            var g = f.hasOwnProperty;
            function h(a, b, c) {
                var f = a[b];
                if (!(g.call(a, b) && e(f, c)) || (c === undefined && !(b in a))) {
                    d(a, b, c);
                }
            }
            a.exports = h;
        },
        function(a, b, c) {
            var d = c(141), e = c(143), f = c(39);
            function g(a) {
                return f(a) ? d(a, true) : e(a);
            }
            a.exports = g;
        },
        function(a, b) {
            function c(a) {
                return a;
            }
            a.exports = c;
        },
        function(a, b, c) {
            var d = c(147);
            var e = Math.max;
            function f(a, b, c) {
                b = e(b === undefined ? a.length - 1 : b, 0);
                return function() {
                    var f = arguments, g = -1, h = e(f.length - b, 0), i = Array(h);
                    while(++g < h){
                        i[g] = f[b + g];
                    }
                    g = -1;
                    var j = Array(b + 1);
                    while(++g < b){
                        j[g] = f[g];
                    }
                    j[b] = c(i);
                    return d(a, this, j);
                };
            }
            a.exports = f;
        },
        function(a, b, c) {
            var d = c(148), e = c(150);
            var f = e(d);
            a.exports = f;
        },
        function(a, b, c) {
            var d = c(61);
            function e(a, b) {
                if (!a) return;
                if (typeof a === "string") return d(a, b);
                var c = Object.prototype.toString.call(a).slice(8, -1);
                if (c === "Object" && a.constructor) c = a.constructor.name;
                if (c === "Map" || c === "Set") return Array.from(a);
                if (c === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(c)) return d(a, b);
            }
            a.exports = e;
            (a.exports["default"] = a.exports), (a.exports.__esModule = true);
        },
        function(a, b) {
            function c(a, b) {
                if (b == null || b > a.length) b = a.length;
                for(var c = 0, d = new Array(b); c < b; c++){
                    d[c] = a[c];
                }
                return d;
            }
            a.exports = c;
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
            function c(a, b, c) {
                var d = new Float32Array(3);
                d[0] = a;
                d[1] = b;
                d[2] = c;
                return d;
            }
        },
        function(a, b) {
            a.exports = c;
            function c(a, b) {
                var c = b[0], d = b[1], e = b[2];
                var f = c * c + d * d + e * e;
                if (f > 0) {
                    f = 1 / Math.sqrt(f);
                    a[0] = b[0] * f;
                    a[1] = b[1] * f;
                    a[2] = b[2] * f;
                }
                return a;
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
        function(a, b, c) {
            var d = c(153);
            var e = c(154);
            var f = c(60);
            var g = c(155);
            function h(a, b) {
                return (d(a) || e(a, b) || f(a, b) || g());
            }
            a.exports = h;
            (a.exports["default"] = a.exports), (a.exports.__esModule = true);
        },
        function(a, b, c) {
            a.exports = {
                EPSILON: c(71),
                create: c(72),
                clone: c(191),
                angle: c(192),
                fromValues: c(73),
                copy: c(193),
                set: c(194),
                equals: c(195),
                exactEquals: c(196),
                add: c(197),
                subtract: c(76),
                sub: c(198),
                multiply: c(77),
                mul: c(199),
                divide: c(78),
                div: c(200),
                min: c(201),
                max: c(202),
                floor: c(203),
                ceil: c(204),
                round: c(205),
                scale: c(206),
                scaleAndAdd: c(207),
                distance: c(79),
                dist: c(208),
                squaredDistance: c(80),
                sqrDist: c(209),
                length: c(81),
                len: c(210),
                squaredLength: c(82),
                sqrLen: c(211),
                negate: c(212),
                inverse: c(213),
                normalize: c(74),
                dot: c(75),
                cross: c(214),
                lerp: c(215),
                random: c(216),
                transformMat4: c(217),
                transformMat3: c(218),
                transformQuat: c(219),
                rotateX: c(220),
                rotateY: c(221),
                rotateZ: c(222),
                forEach: c(223)
            };
        },
        function(a, b, c) {
            var d = c(229), e = c(243);
            var f = e(function(a, b) {
                return a == null ? {} : d(a, b);
            });
            a.exports = f;
        },
        function(a, b, c) {
            var d = c(2);
            var e = c(41);
            var f = c(248);
            var g = c(249);
            function h(b) {
                var c = typeof Map === "function" ? new Map() : undefined;
                a.exports = h = function a(b) {
                    if (b === null || !f(b)) return b;
                    if (typeof b !== "function") {
                        throw new TypeError("Super expression must either be null or a function");
                    }
                    if (typeof c !== "undefined") {
                        if (c.has(b)) return c.get(b);
                        c.set(b, h);
                    }
                    function h() {
                        return g(b, arguments, d(this).constructor);
                    }
                    h.prototype = Object.create(b.prototype, {
                        constructor: {
                            value: h,
                            enumerable: false,
                            writable: true,
                            configurable: true
                        }
                    });
                    return e(h, b);
                };
                (a.exports["default"] = a.exports), (a.exports.__esModule = true);
                return h(b);
            }
            a.exports = h;
            (a.exports["default"] = a.exports), (a.exports.__esModule = true);
        },
        function(a, b, c) {
            "use strict";
            var d = c(21);
            var e = {
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
                create: function a(b, c) {
                    var f = b.data;
                    var g = c.data;
                    var h = b.size.x;
                    var i = b.size.y;
                    var j = d["a"].create(b, c);
                    return {
                        rasterize: function a(b) {
                            var c;
                            var d;
                            var k;
                            var l;
                            var m;
                            var n;
                            var o = [];
                            var p;
                            var q;
                            var r;
                            var s;
                            var t;
                            var u = 0;
                            var v;
                            for(v = 0; v < 400; v++){
                                o[v] = 0;
                            }
                            o[0] = f[0];
                            r = null;
                            for(n = 1; n < i - 1; n++){
                                l = 0;
                                d = o[0];
                                for(m = 1; m < h - 1; m++){
                                    t = n * h + m;
                                    if (g[t] === 0) {
                                        c = f[t];
                                        if (c !== d) {
                                            if (l === 0) {
                                                k = u + 1;
                                                o[k] = c;
                                                d = c;
                                                p = j.contourTracing(n, m, k, c, e.DIR.OUTSIDE_EDGE);
                                                if (p !== null) {
                                                    u++;
                                                    l = k;
                                                    q = e.createContour2D();
                                                    q.dir = e.CONTOUR_DIR.CW_DIR;
                                                    q.index = l;
                                                    q.firstVertex = p;
                                                    q.nextpeer = r;
                                                    q.insideContours = null;
                                                    if (r !== null) {
                                                        r.prevpeer = q;
                                                    }
                                                    r = q;
                                                }
                                            } else {
                                                p = j.contourTracing(n, m, e.DIR.INSIDE_EDGE, c, l);
                                                if (p !== null) {
                                                    q = e.createContour2D();
                                                    q.firstVertex = p;
                                                    q.insideContours = null;
                                                    if (b === 0) {
                                                        q.dir = e.CONTOUR_DIR.CCW_DIR;
                                                    } else {
                                                        q.dir = e.CONTOUR_DIR.CW_DIR;
                                                    }
                                                    q.index = b;
                                                    s = r;
                                                    while(s !== null && s.index !== l){
                                                        s = s.nextpeer;
                                                    }
                                                    if (s !== null) {
                                                        q.nextpeer = s.insideContours;
                                                        if (s.insideContours !== null) {
                                                            s.insideContours.prevpeer = q;
                                                        }
                                                        s.insideContours = q;
                                                    }
                                                }
                                            }
                                        } else {
                                            g[t] = l;
                                        }
                                    } else if (g[t] === e.DIR.OUTSIDE_EDGE || g[t] === e.DIR.INSIDE_EDGE) {
                                        l = 0;
                                        if (g[t] === e.DIR.INSIDE_EDGE) {
                                            d = f[t];
                                        } else {
                                            d = o[0];
                                        }
                                    } else {
                                        l = g[t];
                                        d = o[l];
                                    }
                                }
                            }
                            s = r;
                            while(s !== null){
                                s.index = b;
                                s = s.nextpeer;
                            }
                            return {
                                cc: r,
                                count: u
                            };
                        },
                        debug: {
                            drawContour: function a(b, c) {
                                var d = b.getContext("2d");
                                var f = c;
                                var g;
                                var h;
                                var i;
                                d.strokeStyle = "red";
                                d.fillStyle = "red";
                                d.lineWidth = 1;
                                if (f !== null) {
                                    g = f.insideContours;
                                } else {
                                    g = null;
                                }
                                while(f !== null){
                                    if (g !== null) {
                                        h = g;
                                        g = g.nextpeer;
                                    } else {
                                        h = f;
                                        f = f.nextpeer;
                                        if (f !== null) {
                                            g = f.insideContours;
                                        } else {
                                            g = null;
                                        }
                                    }
                                    switch(h.dir){
                                        case e.CONTOUR_DIR.CW_DIR:
                                            d.strokeStyle = "red";
                                            break;
                                        case e.CONTOUR_DIR.CCW_DIR:
                                            d.strokeStyle = "blue";
                                            break;
                                        case e.CONTOUR_DIR.UNKNOWN_DIR:
                                            d.strokeStyle = "green";
                                            break;
                                    }
                                    i = h.firstVertex;
                                    d.beginPath();
                                    d.moveTo(i.x, i.y);
                                    do {
                                        i = i.next;
                                        d.lineTo(i.x, i.y);
                                    }while (i !== h.firstVertex)
                                    d.stroke();
                                }
                            }
                        }
                    };
                }
            };
            b["a"] = e;
        },
        function(a, b, c) {
            "use strict";
            function d(a, b, c) {
                "use asm";
                var d = new a.Uint8Array(c);
                var e = b.size | 0;
                var f = a.Math.imul;
                function g(a, b) {
                    a |= 0;
                    b |= 0;
                    var c = 0;
                    var f = 0;
                    var g = 0;
                    var h = 0;
                    var i = 0;
                    var j = 0;
                    var k = 0;
                    var l = 0;
                    for(c = 1; (c | 0) < ((e - 1) | 0); c = (c + 1) | 0){
                        l = (l + e) | 0;
                        for(f = 1; (f | 0) < ((e - 1) | 0); f = (f + 1) | 0){
                            h = (l - e) | 0;
                            i = (l + e) | 0;
                            j = (f - 1) | 0;
                            k = (f + 1) | 0;
                            g = ((d[(a + h + j) | 0] | 0) + (d[(a + h + k) | 0] | 0) + (d[(a + l + f) | 0] | 0) + (d[(a + i + j) | 0] | 0) + (d[(a + i + k) | 0] | 0)) | 0;
                            if ((g | 0) == (5 | 0)) {
                                d[(b + l + f) | 0] = 1;
                            } else {
                                d[(b + l + f) | 0] = 0;
                            }
                        }
                    }
                }
                function h(a, b, c) {
                    a |= 0;
                    b |= 0;
                    c |= 0;
                    var g = 0;
                    g = f(e, e) | 0;
                    while((g | 0) > 0){
                        g = (g - 1) | 0;
                        d[(c + g) | 0] = ((d[(a + g) | 0] | 0) - (d[(b + g) | 0] | 0)) | 0;
                    }
                }
                function i(a, b, c) {
                    a |= 0;
                    b |= 0;
                    c |= 0;
                    var g = 0;
                    g = f(e, e) | 0;
                    while((g | 0) > 0){
                        g = (g - 1) | 0;
                        d[(c + g) | 0] = d[(a + g) | 0] | 0 | (d[(b + g) | 0] | 0) | 0;
                    }
                }
                function j(a) {
                    a |= 0;
                    var b = 0;
                    var c = 0;
                    c = f(e, e) | 0;
                    while((c | 0) > 0){
                        c = (c - 1) | 0;
                        b = ((b | 0) + (d[(a + c) | 0] | 0)) | 0;
                    }
                    return b | 0;
                }
                function k(a, b) {
                    a |= 0;
                    b |= 0;
                    var c = 0;
                    c = f(e, e) | 0;
                    while((c | 0) > 0){
                        c = (c - 1) | 0;
                        d[(a + c) | 0] = b;
                    }
                }
                function l(a, b) {
                    a |= 0;
                    b |= 0;
                    var c = 0;
                    var f = 0;
                    var g = 0;
                    var h = 0;
                    var i = 0;
                    var j = 0;
                    var k = 0;
                    var l = 0;
                    for(c = 1; (c | 0) < ((e - 1) | 0); c = (c + 1) | 0){
                        l = (l + e) | 0;
                        for(f = 1; (f | 0) < ((e - 1) | 0); f = (f + 1) | 0){
                            h = (l - e) | 0;
                            i = (l + e) | 0;
                            j = (f - 1) | 0;
                            k = (f + 1) | 0;
                            g = ((d[(a + h + j) | 0] | 0) + (d[(a + h + k) | 0] | 0) + (d[(a + l + f) | 0] | 0) + (d[(a + i + j) | 0] | 0) + (d[(a + i + k) | 0] | 0)) | 0;
                            if ((g | 0) > (0 | 0)) {
                                d[(b + l + f) | 0] = 1;
                            } else {
                                d[(b + l + f) | 0] = 0;
                            }
                        }
                    }
                }
                function m(a, b) {
                    a |= 0;
                    b |= 0;
                    var c = 0;
                    c = f(e, e) | 0;
                    while((c | 0) > 0){
                        c = (c - 1) | 0;
                        d[(b + c) | 0] = d[(a + c) | 0] | 0;
                    }
                }
                function n(a) {
                    a |= 0;
                    var b = 0;
                    var c = 0;
                    for(b = 0; (b | 0) < ((e - 1) | 0); b = (b + 1) | 0){
                        d[(a + b) | 0] = 0;
                        d[(a + c) | 0] = 0;
                        c = (c + e - 1) | 0;
                        d[(a + c) | 0] = 0;
                        c = (c + 1) | 0;
                    }
                    for(b = 0; (b | 0) < (e | 0); b = (b + 1) | 0){
                        d[(a + c) | 0] = 0;
                        c = (c + 1) | 0;
                    }
                }
                function o() {
                    var a = 0;
                    var b = 0;
                    var c = 0;
                    var d = 0;
                    var o = 0;
                    var p = 0;
                    b = f(e, e) | 0;
                    c = (b + b) | 0;
                    d = (c + b) | 0;
                    k(d, 0);
                    n(a);
                    do {
                        g(a, b);
                        l(b, c);
                        h(a, c, c);
                        i(d, c, d);
                        m(b, a);
                        o = j(a) | 0;
                        p = ((o | 0) == 0) | 0;
                    }while (!p)
                }
                return {
                    skeletonize: o
                };
            }
            b["a"] = d;
        },
        function(a, b, c) {
            a.exports = c(263);
        },
        function(a, b, c) {
            var d = c(91), e = c(48), f = c(121), g = c(123), h = c(14), i = c(56), j = c(54);
            function k(a, b, c, l, m) {
                if (a === b) {
                    return;
                }
                f(b, function(f, i) {
                    m || (m = new d());
                    if (h(f)) {
                        g(a, b, i, c, k, l, m);
                    } else {
                        var n = l ? l(j(a, i), f, i + "", a, b, m) : undefined;
                        if (n === undefined) {
                            n = f;
                        }
                        e(a, i, n);
                    }
                }, i);
            }
            a.exports = k;
        },
        function(a, b, c) {
            var d = c(24), e = c(97), f = c(98), g = c(99), h = c(100), i = c(101);
            function j(a) {
                var b = (this.__data__ = new d(a));
                this.size = b.size;
            }
            j.prototype.clear = e;
            j.prototype["delete"] = f;
            j.prototype.get = g;
            j.prototype.has = h;
            j.prototype.set = i;
            a.exports = j;
        },
        function(a, b) {
            function c() {
                this.__data__ = [];
                this.size = 0;
            }
            a.exports = c;
        },
        function(a, b, c) {
            var d = c(25);
            var e = Array.prototype;
            var f = e.splice;
            function g(a) {
                var b = this.__data__, c = d(b, a);
                if (c < 0) {
                    return false;
                }
                var e = b.length - 1;
                if (c == e) {
                    b.pop();
                } else {
                    f.call(b, c, 1);
                }
                --this.size;
                return true;
            }
            a.exports = g;
        },
        function(a, b, c) {
            var d = c(25);
            function e(a) {
                var b = this.__data__, c = d(b, a);
                return c < 0 ? undefined : b[c][1];
            }
            a.exports = e;
        },
        function(a, b, c) {
            var d = c(25);
            function e(a) {
                return d(this.__data__, a) > -1;
            }
            a.exports = e;
        },
        function(a, b, c) {
            var d = c(25);
            function e(a, b) {
                var c = this.__data__, e = d(c, a);
                if (e < 0) {
                    ++this.size;
                    c.push([
                        a,
                        b
                    ]);
                } else {
                    c[e][1] = b;
                }
                return this;
            }
            a.exports = e;
        },
        function(a, b, c) {
            var d = c(24);
            function e() {
                this.__data__ = new d();
                this.size = 0;
            }
            a.exports = e;
        },
        function(a, b) {
            function c(a) {
                var b = this.__data__, c = b["delete"](a);
                this.size = b.size;
                return c;
            }
            a.exports = c;
        },
        function(a, b) {
            function c(a) {
                return this.__data__.get(a);
            }
            a.exports = c;
        },
        function(a, b) {
            function c(a) {
                return this.__data__.has(a);
            }
            a.exports = c;
        },
        function(a, b, c) {
            var d = c(24), e = c(44), f = c(47);
            var g = 200;
            function h(a, b) {
                var c = this.__data__;
                if (c instanceof d) {
                    var h = c.__data__;
                    if (!e || h.length < g - 1) {
                        h.push([
                            a,
                            b
                        ]);
                        this.size = ++c.size;
                        return this;
                    }
                    c = this.__data__ = new f(h);
                }
                c.set(a, b);
                this.size = c.size;
                return this;
            }
            a.exports = h;
        },
        function(a, b, c) {
            var d = c(36), e = c(105), f = c(14), g = c(107);
            var h = /[\\^$.*+?()[\]{}|]/g;
            var i = /^\[object .+?Constructor\]$/;
            var j = Function.prototype, k = Object.prototype;
            var l = j.toString;
            var m = k.hasOwnProperty;
            var n = RegExp("^" + l.call(m).replace(h, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
            function o(a) {
                if (!f(a) || e(a)) {
                    return false;
                }
                var b = d(a) ? n : i;
                return b.test(g(a));
            }
            a.exports = o;
        },
        function(a, b, c) {
            var d = c(27);
            var e = Object.prototype;
            var f = e.hasOwnProperty;
            var g = e.toString;
            var h = d ? d.toStringTag : undefined;
            function i(a) {
                var b = f.call(a, h), c = a[h];
                try {
                    a[h] = undefined;
                    var d = true;
                } catch (e) {}
                var i = g.call(a);
                if (d) {
                    if (b) {
                        a[h] = c;
                    } else {
                        delete a[h];
                    }
                }
                return i;
            }
            a.exports = i;
        },
        function(a, b) {
            var c = Object.prototype;
            var d = c.toString;
            function e(a) {
                return d.call(a);
            }
            a.exports = e;
        },
        function(a, b, c) {
            var d = c(106);
            var e = (function() {
                var a = /[^.]+$/.exec((d && d.keys && d.keys.IE_PROTO) || "");
                return a ? "Symbol(src)_1." + a : "";
            })();
            function f(a) {
                return !!e && e in a;
            }
            a.exports = f;
        },
        function(a, b, c) {
            var d = c(17);
            var e = d["__core-js_shared__"];
            a.exports = e;
        },
        function(a, b) {
            var c = Function.prototype;
            var d = c.toString;
            function e(a) {
                if (a != null) {
                    try {
                        return d.call(a);
                    } catch (b) {}
                    try {
                        return a + "";
                    } catch (c) {}
                }
                return "";
            }
            a.exports = e;
        },
        function(a, b) {
            function c(a, b) {
                return a == null ? undefined : a[b];
            }
            a.exports = c;
        },
        function(a, b, c) {
            var d = c(110), e = c(24), f = c(44);
            function g() {
                this.size = 0;
                this.__data__ = {
                    hash: new d(),
                    map: new (f || e)(),
                    string: new d()
                };
            }
            a.exports = g;
        },
        function(a, b, c) {
            var d = c(111), e = c(112), f = c(113), g = c(114), h = c(115);
            function i(a) {
                var b = -1, c = a == null ? 0 : a.length;
                this.clear();
                while(++b < c){
                    var d = a[b];
                    this.set(d[0], d[1]);
                }
            }
            i.prototype.clear = d;
            i.prototype["delete"] = e;
            i.prototype.get = f;
            i.prototype.has = g;
            i.prototype.set = h;
            a.exports = i;
        },
        function(a, b, c) {
            var d = c(28);
            function e() {
                this.__data__ = d ? d(null) : {};
                this.size = 0;
            }
            a.exports = e;
        },
        function(a, b) {
            function c(a) {
                var b = this.has(a) && delete this.__data__[a];
                this.size -= b ? 1 : 0;
                return b;
            }
            a.exports = c;
        },
        function(a, b, c) {
            var d = c(28);
            var e = "__lodash_hash_undefined__";
            var f = Object.prototype;
            var g = f.hasOwnProperty;
            function h(a) {
                var b = this.__data__;
                if (d) {
                    var c = b[a];
                    return c === e ? undefined : c;
                }
                return g.call(b, a) ? b[a] : undefined;
            }
            a.exports = h;
        },
        function(a, b, c) {
            var d = c(28);
            var e = Object.prototype;
            var f = e.hasOwnProperty;
            function g(a) {
                var b = this.__data__;
                return d ? b[a] !== undefined : f.call(b, a);
            }
            a.exports = g;
        },
        function(a, b, c) {
            var d = c(28);
            var e = "__lodash_hash_undefined__";
            function f(a, b) {
                var c = this.__data__;
                this.size += this.has(a) ? 0 : 1;
                c[a] = d && b === undefined ? e : b;
                return this;
            }
            a.exports = f;
        },
        function(a, b, c) {
            var d = c(29);
            function e(a) {
                var b = d(this, a)["delete"](a);
                this.size -= b ? 1 : 0;
                return b;
            }
            a.exports = e;
        },
        function(a, b) {
            function c(a) {
                var b = typeof a;
                return b == "string" || b == "number" || b == "symbol" || b == "boolean" ? a !== "__proto__" : a === null;
            }
            a.exports = c;
        },
        function(a, b, c) {
            var d = c(29);
            function e(a) {
                return d(this, a).get(a);
            }
            a.exports = e;
        },
        function(a, b, c) {
            var d = c(29);
            function e(a) {
                return d(this, a).has(a);
            }
            a.exports = e;
        },
        function(a, b, c) {
            var d = c(29);
            function e(a, b) {
                var c = d(this, a), e = c.size;
                c.set(a, b);
                this.size += c.size == e ? 0 : 1;
                return this;
            }
            a.exports = e;
        },
        function(a, b, c) {
            var d = c(122);
            var e = d();
            a.exports = e;
        },
        function(a, b) {
            function c(a) {
                return function(b, c, d) {
                    var e = -1, f = Object(b), g = d(b), h = g.length;
                    while(h--){
                        var i = g[a ? h : ++e];
                        if (c(f[i], i, f) === false) {
                            break;
                        }
                    }
                    return b;
                };
            }
            a.exports = c;
        },
        function(a, b, c) {
            var d = c(48), e = c(124), f = c(125), g = c(128), h = c(129), i = c(30), j = c(15), k = c(133), l = c(52), m = c(36), n = c(14), o = c(135), p = c(53), q = c(54), r = c(139);
            function s(a, b, c, s, t, u, v) {
                var w = q(a, c), x = q(b, c), y = v.get(x);
                if (y) {
                    d(a, c, y);
                    return;
                }
                var z = u ? u(w, x, c + "", a, b, v) : undefined;
                var A = z === undefined;
                if (A) {
                    var B = j(x), C = !B && l(x), D = !B && !C && p(x);
                    z = x;
                    if (B || C || D) {
                        if (j(w)) {
                            z = w;
                        } else if (k(w)) {
                            z = g(w);
                        } else if (C) {
                            A = false;
                            z = e(x, true);
                        } else if (D) {
                            A = false;
                            z = f(x, true);
                        } else {
                            z = [];
                        }
                    } else if (o(x) || i(x)) {
                        z = w;
                        if (i(w)) {
                            z = r(w);
                        } else if (!n(w) || m(w)) {
                            z = h(x);
                        }
                    } else {
                        A = false;
                    }
                }
                if (A) {
                    v.set(x, z);
                    t(z, x, s, u, v);
                    v["delete"](x);
                }
                d(a, c, z);
            }
            a.exports = s;
        },
        function(a, b, c) {
            (function(a) {
                var d = c(17);
                var e = true && b && !b.nodeType && b;
                var f = e && typeof a == "object" && a && !a.nodeType && a;
                var g = f && f.exports === e;
                var h = g ? d.Buffer : undefined, i = h ? h.allocUnsafe : undefined;
                function j(a, b) {
                    if (b) {
                        return a.slice();
                    }
                    var c = a.length, d = i ? i(c) : new a.constructor(c);
                    a.copy(d);
                    return d;
                }
                a.exports = j;
            }.call(this, c(38)(a)));
        },
        function(a, b, c) {
            var d = c(126);
            function e(a, b) {
                var c = b ? d(a.buffer) : a.buffer;
                return new a.constructor(c, a.byteOffset, a.length);
            }
            a.exports = e;
        },
        function(a, b, c) {
            var d = c(127);
            function e(a) {
                var b = new a.constructor(a.byteLength);
                new d(b).set(new d(a));
                return b;
            }
            a.exports = e;
        },
        function(a, b, c) {
            var d = c(17);
            var e = d.Uint8Array;
            a.exports = e;
        },
        function(a, b) {
            function c(a, b) {
                var c = -1, d = a.length;
                b || (b = Array(d));
                while(++c < d){
                    b[c] = a[c];
                }
                return b;
            }
            a.exports = c;
        },
        function(a, b, c) {
            var d = c(130), e = c(50), f = c(51);
            function g(a) {
                return typeof a.constructor == "function" && !f(a) ? d(e(a)) : {};
            }
            a.exports = g;
        },
        function(a, b, c) {
            var d = c(14);
            var e = Object.create;
            var f = (function() {
                function a() {}
                return function(b) {
                    if (!d(b)) {
                        return {};
                    }
                    if (e) {
                        return e(b);
                    }
                    a.prototype = b;
                    var c = new a();
                    a.prototype = undefined;
                    return c;
                };
            })();
            a.exports = f;
        },
        function(a, b) {
            function c(a, b) {
                return function(c) {
                    return a(b(c));
                };
            }
            a.exports = c;
        },
        function(a, b, c) {
            var d = c(22), e = c(18);
            var f = "[object Arguments]";
            function g(a) {
                return e(a) && d(a) == f;
            }
            a.exports = g;
        },
        function(a, b, c) {
            var d = c(39), e = c(18);
            function f(a) {
                return e(a) && d(a);
            }
            a.exports = f;
        },
        function(a, b) {
            function c() {
                return false;
            }
            a.exports = c;
        },
        function(a, b, c) {
            var d = c(22), e = c(50), f = c(18);
            var g = "[object Object]";
            var h = Function.prototype, i = Object.prototype;
            var j = h.toString;
            var k = i.hasOwnProperty;
            var l = j.call(Object);
            function m(a) {
                if (!f(a) || d(a) != g) {
                    return false;
                }
                var b = e(a);
                if (b === null) {
                    return true;
                }
                var c = k.call(b, "constructor") && b.constructor;
                return (typeof c == "function" && c instanceof c && j.call(c) == l);
            }
            a.exports = m;
        },
        function(a, b, c) {
            var d = c(22), e = c(40), f = c(18);
            var g = "[object Arguments]", h = "[object Array]", i = "[object Boolean]", j = "[object Date]", k = "[object Error]", l = "[object Function]", m = "[object Map]", n = "[object Number]", o = "[object Object]", p = "[object RegExp]", q = "[object Set]", r = "[object String]", s = "[object WeakMap]";
            var t = "[object ArrayBuffer]", u = "[object DataView]", v = "[object Float32Array]", w = "[object Float64Array]", x = "[object Int8Array]", y = "[object Int16Array]", z = "[object Int32Array]", A = "[object Uint8Array]", B = "[object Uint8ClampedArray]", C = "[object Uint16Array]", D = "[object Uint32Array]";
            var E = {};
            E[v] = E[w] = E[x] = E[y] = E[z] = E[A] = E[B] = E[C] = E[D] = true;
            E[g] = E[h] = E[t] = E[i] = E[u] = E[j] = E[k] = E[l] = E[m] = E[n] = E[o] = E[p] = E[q] = E[r] = E[s] = false;
            function F(a) {
                return (f(a) && e(a.length) && !!E[d(a)]);
            }
            a.exports = F;
        },
        function(a, b) {
            function c(a) {
                return function(b) {
                    return a(b);
                };
            }
            a.exports = c;
        },
        function(a, b, c) {
            (function(a) {
                var d = c(45);
                var e = true && b && !b.nodeType && b;
                var f = e && typeof a == "object" && a && !a.nodeType && a;
                var g = f && f.exports === e;
                var h = g && d.process;
                var i = (function() {
                    try {
                        var a = f && f.require && f.require("util").types;
                        if (a) {
                            return a;
                        }
                        return (h && h.binding && h.binding("util"));
                    } catch (b) {}
                })();
                a.exports = i;
            }.call(this, c(38)(a)));
        },
        function(a, b, c) {
            var d = c(140), e = c(56);
            function f(a) {
                return d(a, e(a));
            }
            a.exports = f;
        },
        function(a, b, c) {
            var d = c(55), e = c(37);
            function f(a, b, c, f) {
                var g = !c;
                c || (c = {});
                var h = -1, i = b.length;
                while(++h < i){
                    var j = b[h];
                    var k = f ? f(c[j], a[j], j, c, a) : undefined;
                    if (k === undefined) {
                        k = a[j];
                    }
                    if (g) {
                        e(c, j, k);
                    } else {
                        d(c, j, k);
                    }
                }
                return c;
            }
            a.exports = f;
        },
        function(a, b, c) {
            var d = c(142), e = c(30), f = c(15), g = c(52), h = c(31), i = c(53);
            var j = Object.prototype;
            var k = j.hasOwnProperty;
            function l(a, b) {
                var c = f(a), j = !c && e(a), l = !c && !j && g(a), m = !c && !j && !l && i(a), n = c || j || l || m, o = n ? d(a.length, String) : [], p = o.length;
                for(var q in a){
                    if ((b || k.call(a, q)) && !(n && (q == "length" || (l && (q == "offset" || q == "parent")) || (m && (q == "buffer" || q == "byteLength" || q == "byteOffset")) || h(q, p)))) {
                        o.push(q);
                    }
                }
                return o;
            }
            a.exports = l;
        },
        function(a, b) {
            function c(a, b) {
                var c = -1, d = Array(a);
                while(++c < a){
                    d[c] = b(c);
                }
                return d;
            }
            a.exports = c;
        },
        function(a, b, c) {
            var d = c(14), e = c(51), f = c(144);
            var g = Object.prototype;
            var h = g.hasOwnProperty;
            function i(a) {
                if (!d(a)) {
                    return f(a);
                }
                var b = e(a), c = [];
                for(var g in a){
                    if (!(g == "constructor" && (b || !h.call(a, g)))) {
                        c.push(g);
                    }
                }
                return c;
            }
            a.exports = i;
        },
        function(a, b) {
            function c(a) {
                var b = [];
                if (a != null) {
                    for(var c in Object(a)){
                        b.push(c);
                    }
                }
                return b;
            }
            a.exports = c;
        },
        function(a, b, c) {
            var d = c(146), e = c(151);
            function f(a) {
                return d(function(b, c) {
                    var d = -1, f = c.length, g = f > 1 ? c[f - 1] : undefined, h = f > 2 ? c[2] : undefined;
                    g = a.length > 3 && typeof g == "function" ? (f--, g) : undefined;
                    if (h && e(c[0], c[1], h)) {
                        g = f < 3 ? undefined : g;
                        f = 1;
                    }
                    b = Object(b);
                    while(++d < f){
                        var i = c[d];
                        if (i) {
                            a(b, i, d, g);
                        }
                    }
                    return b;
                });
            }
            a.exports = f;
        },
        function(a, b, c) {
            var d = c(57), e = c(58), f = c(59);
            function g(a, b) {
                return f(e(a, b, d), a + "");
            }
            a.exports = g;
        },
        function(a, b) {
            function c(a, b, c) {
                switch(c.length){
                    case 0:
                        return a.call(b);
                    case 1:
                        return a.call(b, c[0]);
                    case 2:
                        return a.call(b, c[0], c[1]);
                    case 3:
                        return a.call(b, c[0], c[1], c[2]);
                }
                return a.apply(b, c);
            }
            a.exports = c;
        },
        function(a, b, c) {
            var d = c(149), e = c(49), f = c(57);
            var g = !e ? f : function(a, b) {
                return e(a, "toString", {
                    configurable: true,
                    enumerable: false,
                    value: d(b),
                    writable: true
                });
            };
            a.exports = g;
        },
        function(a, b) {
            function c(a) {
                return function() {
                    return a;
                };
            }
            a.exports = c;
        },
        function(a, b) {
            var c = 800, d = 16;
            var e = Date.now;
            function f(a) {
                var b = 0, f = 0;
                return function() {
                    var g = e(), h = d - (g - f);
                    f = g;
                    if (h > 0) {
                        if (++b >= c) {
                            return arguments[0];
                        }
                    } else {
                        b = 0;
                    }
                    return a.apply(undefined, arguments);
                };
            }
            a.exports = f;
        },
        function(a, b, c) {
            var d = c(26), e = c(39), f = c(31), g = c(14);
            function h(a, b, c) {
                if (!g(c)) {
                    return false;
                }
                var h = typeof b;
                if (h == "number" ? e(c) && f(b, c.length) : h == "string" && b in c) {
                    return d(c[b], a);
                }
                return false;
            }
            a.exports = h;
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
                    var c = (a >>> 16) & 0xffff;
                    var d = a & 0xffff;
                    var e = (b >>> 16) & 0xffff;
                    var f = b & 0xffff;
                    return ((d * f + (((c * f + d * e) << 16) >>> 0)) | 0);
                };
            }
            if (typeof Object.assign !== "function") {
                Object.assign = function(a) {
                    "use strict";
                    if (a === null) {
                        throw new TypeError("Cannot convert undefined or null to object");
                    }
                    var b = Object(a);
                    for(var c = 1; c < arguments.length; c++){
                        var d = arguments[c];
                        if (d !== null) {
                            for(var e in d){
                                if (Object.prototype.hasOwnProperty.call(d, e)) {
                                    b[e] = d[e];
                                }
                            }
                        }
                    }
                    return b;
                };
            }
        },
        function(a, b) {
            function c(a) {
                if (Array.isArray(a)) return a;
            }
            a.exports = c;
            (a.exports["default"] = a.exports), (a.exports.__esModule = true);
        },
        function(a, b) {
            function c(a, b) {
                var c = a == null ? null : (typeof Symbol !== "undefined" && a[Symbol.iterator]) || a["@@iterator"];
                if (c == null) return;
                var d = [];
                var e = true;
                var f = false;
                var g, h;
                try {
                    for(c = c.call(a); !(e = (g = c.next()).done); e = true){
                        d.push(g.value);
                        if (b && d.length === b) break;
                    }
                } catch (i) {
                    f = true;
                    h = i;
                } finally{
                    try {
                        if (!e && c["return"] != null) c["return"]();
                    } finally{
                        if (f) throw h;
                    }
                }
                return d;
            }
            a.exports = c;
            (a.exports["default"] = a.exports), (a.exports.__esModule = true);
        },
        function(a, b) {
            function c() {
                throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
            }
            a.exports = c;
            (a.exports["default"] = a.exports), (a.exports.__esModule = true);
        },
        function(a, b) {
            a.exports = c;
            function c(a) {
                var b = new Float32Array(2);
                b[0] = a[0];
                b[1] = a[1];
                return b;
            }
        },
        function(a, b) {
            a.exports = c;
            function c(a, b) {
                var c = new Float32Array(2);
                c[0] = a;
                c[1] = b;
                return c;
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
        function(a, b, c) {
            a.exports = e;
            var d = c(62);
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
        function(a, b, c) {
            a.exports = c(64);
        },
        function(a, b, c) {
            a.exports = c(65);
        },
        function(a, b, c) {
            a.exports = c(66);
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
        function(a, b, c) {
            a.exports = c(67);
        },
        function(a, b, c) {
            a.exports = c(68);
        },
        function(a, b, c) {
            a.exports = c(69);
        },
        function(a, b, c) {
            a.exports = c(70);
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
            function c(a, b) {
                var c = b[0], d = b[1];
                var e = c * c + d * d;
                if (e > 0) {
                    e = 1 / Math.sqrt(e);
                    a[0] = b[0] * e;
                    a[1] = b[1] * e;
                }
                return a;
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
            function c(a, b) {
                b = b || 1.0;
                var c = Math.random() * 2.0 * Math.PI;
                a[0] = Math.cos(c) * b;
                a[1] = Math.sin(c) * b;
                return a;
            }
        },
        function(a, b) {
            a.exports = c;
            function c(a, b, c) {
                var d = b[0], e = b[1];
                a[0] = c[0] * d + c[2] * e;
                a[1] = c[1] * d + c[3] * e;
                return a;
            }
        },
        function(a, b) {
            a.exports = c;
            function c(a, b, c) {
                var d = b[0], e = b[1];
                a[0] = c[0] * d + c[2] * e + c[4];
                a[1] = c[1] * d + c[3] * e + c[5];
                return a;
            }
        },
        function(a, b) {
            a.exports = c;
            function c(a, b, c) {
                var d = b[0], e = b[1];
                a[0] = c[0] * d + c[3] * e + c[6];
                a[1] = c[1] * d + c[4] * e + c[7];
                return a;
            }
        },
        function(a, b) {
            a.exports = c;
            function c(a, b, c) {
                var d = b[0], e = b[1];
                a[0] = c[0] * d + c[4] * e + c[12];
                a[1] = c[1] * d + c[5] * e + c[13];
                return a;
            }
        },
        function(a, b, c) {
            a.exports = e;
            var d = c(63)();
            function e(a, b, c, e, f, g) {
                var h, i;
                if (!b) {
                    b = 2;
                }
                if (!c) {
                    c = 0;
                }
                if (e) {
                    i = Math.min(e * b + c, a.length);
                } else {
                    i = a.length;
                }
                for(h = c; h < i; h += b){
                    d[0] = a[h];
                    d[1] = a[h + 1];
                    f(d, d, g);
                    a[h] = d[0];
                    a[h + 1] = d[1];
                }
                return a;
            }
        },
        function(a, b) {
            a.exports = c;
            function c(a, b, c) {
                var d = b[0] * b[0] + b[1] * b[1];
                if (d > c * c) {
                    var e = Math.sqrt(d);
                    a[0] = (b[0] / e) * c;
                    a[1] = (b[1] / e) * c;
                } else {
                    a[0] = b[0];
                    a[1] = b[1];
                }
                return a;
            }
        },
        function(a, b) {
            a.exports = c;
            function c(a) {
                var b = new Float32Array(3);
                b[0] = a[0];
                b[1] = a[1];
                b[2] = a[2];
                return b;
            }
        },
        function(a, b, c) {
            a.exports = g;
            var d = c(73);
            var e = c(74);
            var f = c(75);
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
        function(a, b, c) {
            a.exports = e;
            var d = c(71);
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
        function(a, b, c) {
            a.exports = c(76);
        },
        function(a, b, c) {
            a.exports = c(77);
        },
        function(a, b, c) {
            a.exports = c(78);
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
        function(a, b, c) {
            a.exports = c(79);
        },
        function(a, b, c) {
            a.exports = c(80);
        },
        function(a, b, c) {
            a.exports = c(81);
        },
        function(a, b, c) {
            a.exports = c(82);
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
                var c = Math.random() * 2.0 * Math.PI;
                var d = Math.random() * 2.0 - 1.0;
                var e = Math.sqrt(1.0 - d * d) * b;
                a[0] = Math.cos(c) * e;
                a[1] = Math.sin(c) * e;
                a[2] = d * b;
                return a;
            }
        },
        function(a, b) {
            a.exports = c;
            function c(a, b, c) {
                var d = b[0], e = b[1], f = b[2], g = c[3] * d + c[7] * e + c[11] * f + c[15];
                g = g || 1.0;
                a[0] = (c[0] * d + c[4] * e + c[8] * f + c[12]) / g;
                a[1] = (c[1] * d + c[5] * e + c[9] * f + c[13]) / g;
                a[2] = (c[2] * d + c[6] * e + c[10] * f + c[14]) / g;
                return a;
            }
        },
        function(a, b) {
            a.exports = c;
            function c(a, b, c) {
                var d = b[0], e = b[1], f = b[2];
                a[0] = d * c[0] + e * c[3] + f * c[6];
                a[1] = d * c[1] + e * c[4] + f * c[7];
                a[2] = d * c[2] + e * c[5] + f * c[8];
                return a;
            }
        },
        function(a, b) {
            a.exports = c;
            function c(a, b, c) {
                var d = b[0], e = b[1], f = b[2], g = c[0], h = c[1], i = c[2], j = c[3], k = j * d + h * f - i * e, l = j * e + i * d - g * f, m = j * f + g * e - h * d, n = -g * d - h * e - i * f;
                a[0] = k * j + n * -g + l * -i - m * -h;
                a[1] = l * j + n * -h + m * -g - k * -i;
                a[2] = m * j + n * -i + k * -h - l * -g;
                return a;
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
        function(a, b, c) {
            a.exports = e;
            var d = c(72)();
            function e(a, b, c, e, f, g) {
                var h, i;
                if (!b) {
                    b = 3;
                }
                if (!c) {
                    c = 0;
                }
                if (e) {
                    i = Math.min(e * b + c, a.length);
                } else {
                    i = a.length;
                }
                for(h = c; h < i; h += b){
                    d[0] = a[h];
                    d[1] = a[h + 1];
                    d[2] = a[h + 2];
                    f(d, d, g);
                    a[h] = d[0];
                    a[h + 1] = d[1];
                    a[h + 2] = d[2];
                }
                return a;
            }
        },
        function(a, b, c) {
            var d = c(61);
            function e(a) {
                if (Array.isArray(a)) return d(a);
            }
            a.exports = e;
            (a.exports["default"] = a.exports), (a.exports.__esModule = true);
        },
        function(a, b) {
            function c(a) {
                if ((typeof Symbol !== "undefined" && a[Symbol.iterator] != null) || a["@@iterator"] != null) return Array.from(a);
            }
            a.exports = c;
            (a.exports["default"] = a.exports), (a.exports.__esModule = true);
        },
        function(a, b) {
            function c() {
                throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
            }
            a.exports = c;
            (a.exports["default"] = a.exports), (a.exports.__esModule = true);
        },
        function(a, b, c) {
            var d = c(2);
            function e(a, b) {
                while(!Object.prototype.hasOwnProperty.call(a, b)){
                    a = d(a);
                    if (a === null) break;
                }
                return a;
            }
            a.exports = e;
            (a.exports["default"] = a.exports), (a.exports.__esModule = true);
        },
        function(a, b, c) {
            var d = (function(a) {
                "use strict";
                var b = Object.prototype;
                var c = b.hasOwnProperty;
                var d;
                var e = typeof Symbol === "function" ? Symbol : {};
                var f = e.iterator || "@@iterator";
                var g = e.asyncIterator || "@@asyncIterator";
                var h = e.toStringTag || "@@toStringTag";
                function i(a, b, c, d) {
                    var e = b && b.prototype instanceof p ? b : p;
                    var f = Object.create(e.prototype);
                    var g = new C(d || []);
                    f._invoke = y(a, c, g);
                    return f;
                }
                a.wrap = i;
                function j(a, b, c) {
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
                var k = "suspendedStart";
                var l = "suspendedYield";
                var m = "executing";
                var n = "completed";
                var o = {};
                function p() {}
                function q() {}
                function r() {}
                var s = {};
                s[f] = function() {
                    return this;
                };
                var t = Object.getPrototypeOf;
                var u = t && t(t(D([])));
                if (u && u !== b && c.call(u, f)) {
                    s = u;
                }
                var v = (r.prototype = p.prototype = Object.create(s));
                q.prototype = v.constructor = r;
                r.constructor = q;
                r[h] = q.displayName = "GeneratorFunction";
                function w(a) {
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
                a.isGeneratorFunction = function(a) {
                    var b = typeof a === "function" && a.constructor;
                    return b ? b === q || (b.displayName || b.name) === "GeneratorFunction" : false;
                };
                a.mark = function(a) {
                    if (Object.setPrototypeOf) {
                        Object.setPrototypeOf(a, r);
                    } else {
                        a.__proto__ = r;
                        if (!(h in a)) {
                            a[h] = "GeneratorFunction";
                        }
                    }
                    a.prototype = Object.create(v);
                    return a;
                };
                a.awrap = function(a) {
                    return {
                        __await: a
                    };
                };
                function x(a, b) {
                    function d(e, f, g, h) {
                        var i = j(a[e], a, f);
                        if (i.type === "throw") {
                            h(i.arg);
                        } else {
                            var k = i.arg;
                            var l = k.value;
                            if (l && typeof l === "object" && c.call(l, "__await")) {
                                return b.resolve(l.__await).then(function(a) {
                                    d("next", a, g, h);
                                }, function(a) {
                                    d("throw", a, g, h);
                                });
                            }
                            return b.resolve(l).then(function(a) {
                                k.value = a;
                                g(k);
                            }, function(a) {
                                return d("throw", a, g, h);
                            });
                        }
                    }
                    var e;
                    function f(a, c) {
                        function f() {
                            return new b(function(b, e) {
                                d(a, c, b, e);
                            });
                        }
                        return (e = e ? e.then(f, f) : f());
                    }
                    this._invoke = f;
                }
                w(x.prototype);
                x.prototype[g] = function() {
                    return this;
                };
                a.AsyncIterator = x;
                a.async = function(b, c, d, e, f) {
                    if (f === void 0) f = Promise;
                    var g = new x(i(b, c, d, e), f);
                    return a.isGeneratorFunction(c) ? g : g.next().then(function(a) {
                        return a.done ? a.value : g.next();
                    });
                };
                function y(a, b, c) {
                    var d = k;
                    return function e(f, g) {
                        if (d === m) {
                            throw new Error("Generator is already running");
                        }
                        if (d === n) {
                            if (f === "throw") {
                                throw g;
                            }
                            return E();
                        }
                        c.method = f;
                        c.arg = g;
                        while(true){
                            var h = c.delegate;
                            if (h) {
                                var i = z(h, c);
                                if (i) {
                                    if (i === o) continue;
                                    return i;
                                }
                            }
                            if (c.method === "next") {
                                c.sent = c._sent = c.arg;
                            } else if (c.method === "throw") {
                                if (d === k) {
                                    d = n;
                                    throw c.arg;
                                }
                                c.dispatchException(c.arg);
                            } else if (c.method === "return") {
                                c.abrupt("return", c.arg);
                            }
                            d = m;
                            var p = j(a, b, c);
                            if (p.type === "normal") {
                                d = c.done ? n : l;
                                if (p.arg === o) {
                                    continue;
                                }
                                return {
                                    value: p.arg,
                                    done: c.done
                                };
                            } else if (p.type === "throw") {
                                d = n;
                                c.method = "throw";
                                c.arg = p.arg;
                            }
                        }
                    };
                }
                function z(a, b) {
                    var c = a.iterator[b.method];
                    if (c === d) {
                        b.delegate = null;
                        if (b.method === "throw") {
                            if (a.iterator["return"]) {
                                b.method = "return";
                                b.arg = d;
                                z(a, b);
                                if (b.method === "throw") {
                                    return o;
                                }
                            }
                            b.method = "throw";
                            b.arg = new TypeError("The iterator does not provide a 'throw' method");
                        }
                        return o;
                    }
                    var e = j(c, a.iterator, b.arg);
                    if (e.type === "throw") {
                        b.method = "throw";
                        b.arg = e.arg;
                        b.delegate = null;
                        return o;
                    }
                    var f = e.arg;
                    if (!f) {
                        b.method = "throw";
                        b.arg = new TypeError("iterator result is not an object");
                        b.delegate = null;
                        return o;
                    }
                    if (f.done) {
                        b[a.resultName] = f.value;
                        b.next = a.nextLoc;
                        if (b.method !== "return") {
                            b.method = "next";
                            b.arg = d;
                        }
                    } else {
                        return f;
                    }
                    b.delegate = null;
                    return o;
                }
                w(v);
                v[h] = "Generator";
                v[f] = function() {
                    return this;
                };
                v.toString = function() {
                    return "[object Generator]";
                };
                function A(a) {
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
                function B(a) {
                    var b = a.completion || {};
                    b.type = "normal";
                    delete b.arg;
                    a.completion = b;
                }
                function C(a) {
                    this.tryEntries = [
                        {
                            tryLoc: "root"
                        }, 
                    ];
                    a.forEach(A, this);
                    this.reset(true);
                }
                a.keys = function(a) {
                    var b = [];
                    for(var c in a){
                        b.push(c);
                    }
                    b.reverse();
                    return function c() {
                        while(b.length){
                            var d = b.pop();
                            if (d in a) {
                                c.value = d;
                                c.done = false;
                                return c;
                            }
                        }
                        c.done = true;
                        return c;
                    };
                };
                function D(a) {
                    if (a) {
                        var b = a[f];
                        if (b) {
                            return b.call(a);
                        }
                        if (typeof a.next === "function") {
                            return a;
                        }
                        if (!isNaN(a.length)) {
                            var e = -1, g = function b() {
                                while(++e < a.length){
                                    if (c.call(a, e)) {
                                        b.value = a[e];
                                        b.done = false;
                                        return b;
                                    }
                                }
                                b.value = d;
                                b.done = true;
                                return b;
                            };
                            return (g.next = g);
                        }
                    }
                    return {
                        next: E
                    };
                }
                a.values = D;
                function E() {
                    return {
                        value: d,
                        done: true
                    };
                }
                C.prototype = {
                    constructor: C,
                    reset: function(a) {
                        this.prev = 0;
                        this.next = 0;
                        this.sent = this._sent = d;
                        this.done = false;
                        this.delegate = null;
                        this.method = "next";
                        this.arg = d;
                        this.tryEntries.forEach(B);
                        if (!a) {
                            for(var b in this){
                                if (b.charAt(0) === "t" && c.call(this, b) && !isNaN(+b.slice(1))) {
                                    this[b] = d;
                                }
                            }
                        }
                    },
                    stop: function() {
                        this.done = true;
                        var a = this.tryEntries[0];
                        var b = a.completion;
                        if (b.type === "throw") {
                            throw b.arg;
                        }
                        return this.rval;
                    },
                    dispatchException: function(a) {
                        if (this.done) {
                            throw a;
                        }
                        var b = this;
                        function e(c, e) {
                            h.type = "throw";
                            h.arg = a;
                            b.next = c;
                            if (e) {
                                b.method = "next";
                                b.arg = d;
                            }
                            return !!e;
                        }
                        for(var f = this.tryEntries.length - 1; f >= 0; --f){
                            var g = this.tryEntries[f];
                            var h = g.completion;
                            if (g.tryLoc === "root") {
                                return e("end");
                            }
                            if (g.tryLoc <= this.prev) {
                                var i = c.call(g, "catchLoc");
                                var j = c.call(g, "finallyLoc");
                                if (i && j) {
                                    if (this.prev < g.catchLoc) {
                                        return e(g.catchLoc, true);
                                    } else if (this.prev < g.finallyLoc) {
                                        return e(g.finallyLoc);
                                    }
                                } else if (i) {
                                    if (this.prev < g.catchLoc) {
                                        return e(g.catchLoc, true);
                                    }
                                } else if (j) {
                                    if (this.prev < g.finallyLoc) {
                                        return e(g.finallyLoc);
                                    }
                                } else {
                                    throw new Error("try statement without catch or finally");
                                }
                            }
                        }
                    },
                    abrupt: function(a, b) {
                        for(var d = this.tryEntries.length - 1; d >= 0; --d){
                            var e = this.tryEntries[d];
                            if (e.tryLoc <= this.prev && c.call(e, "finallyLoc") && this.prev < e.finallyLoc) {
                                var f = e;
                                break;
                            }
                        }
                        if (f && (a === "break" || a === "continue") && f.tryLoc <= b && b <= f.finallyLoc) {
                            f = null;
                        }
                        var g = f ? f.completion : {};
                        g.type = a;
                        g.arg = b;
                        if (f) {
                            this.method = "next";
                            this.next = f.finallyLoc;
                            return o;
                        }
                        return this.complete(g);
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
                        return o;
                    },
                    finish: function(a) {
                        for(var b = this.tryEntries.length - 1; b >= 0; --b){
                            var c = this.tryEntries[b];
                            if (c.finallyLoc === a) {
                                this.complete(c.completion, c.afterLoc);
                                B(c);
                                return o;
                            }
                        }
                    },
                    catch: function(a) {
                        for(var b = this.tryEntries.length - 1; b >= 0; --b){
                            var c = this.tryEntries[b];
                            if (c.tryLoc === a) {
                                var d = c.completion;
                                if (d.type === "throw") {
                                    var e = d.arg;
                                    B(c);
                                }
                                return e;
                            }
                        }
                        throw new Error("illegal catch attempt");
                    },
                    delegateYield: function(a, b, c) {
                        this.delegate = {
                            iterator: D(a),
                            resultName: b,
                            nextLoc: c
                        };
                        if (this.method === "next") {
                            this.arg = d;
                        }
                        return o;
                    }
                };
                return a;
            })(true ? a.exports : undefined);
            try {
                regeneratorRuntime = d;
            } catch (e) {
                Function("r", "regeneratorRuntime = r")(d);
            }
        },
        function(a, b, c) {
            var d = c(230), e = c(240);
            function f(a, b) {
                return d(a, b, function(b, c) {
                    return e(a, c);
                });
            }
            a.exports = f;
        },
        function(a, b, c) {
            var d = c(231), e = c(239), f = c(32);
            function g(a, b, c) {
                var g = -1, h = b.length, i = {};
                while(++g < h){
                    var j = b[g], k = d(a, j);
                    if (c(k, j)) {
                        e(i, f(j, a), k);
                    }
                }
                return i;
            }
            a.exports = g;
        },
        function(a, b, c) {
            var d = c(32), e = c(43);
            function f(a, b) {
                b = d(b, a);
                var c = 0, f = b.length;
                while(a != null && c < f){
                    a = a[e(b[c++])];
                }
                return c && c == f ? a : undefined;
            }
            a.exports = f;
        },
        function(a, b, c) {
            var d = c(15), e = c(42);
            var f = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, g = /^\w*$/;
            function h(a, b) {
                if (d(a)) {
                    return false;
                }
                var c = typeof a;
                if (c == "number" || c == "symbol" || c == "boolean" || a == null || e(a)) {
                    return true;
                }
                return (g.test(a) || !f.test(a) || (b != null && a in Object(b)));
            }
            a.exports = h;
        },
        function(a, b, c) {
            var d = c(234);
            var e = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
            var f = /\\(\\)?/g;
            var g = d(function(a) {
                var b = [];
                if (a.charCodeAt(0) === 46) {
                    b.push("");
                }
                a.replace(e, function(a, c, d, e) {
                    b.push(d ? e.replace(f, "$1") : c || a);
                });
                return b;
            });
            a.exports = g;
        },
        function(a, b, c) {
            var d = c(235);
            var e = 500;
            function f(a) {
                var b = d(a, function(a) {
                    if (c.size === e) {
                        c.clear();
                    }
                    return a;
                });
                var c = b.cache;
                return b;
            }
            a.exports = f;
        },
        function(a, b, c) {
            var d = c(47);
            var e = "Expected a function";
            function f(a, b) {
                if (typeof a != "function" || (b != null && typeof b != "function")) {
                    throw new TypeError(e);
                }
                var c = function() {
                    var d = arguments, e = b ? b.apply(this, d) : d[0], f = c.cache;
                    if (f.has(e)) {
                        return f.get(e);
                    }
                    var g = a.apply(this, d);
                    c.cache = f.set(e, g) || f;
                    return g;
                };
                c.cache = new (f.Cache || d)();
                return c;
            }
            f.Cache = d;
            a.exports = f;
        },
        function(a, b, c) {
            var d = c(237);
            function e(a) {
                return a == null ? "" : d(a);
            }
            a.exports = e;
        },
        function(a, b, c) {
            var d = c(27), e = c(238), f = c(15), g = c(42);
            var h = 1 / 0;
            var i = d ? d.prototype : undefined, j = i ? i.toString : undefined;
            function k(a) {
                if (typeof a == "string") {
                    return a;
                }
                if (f(a)) {
                    return e(a, k) + "";
                }
                if (g(a)) {
                    return j ? j.call(a) : "";
                }
                var b = a + "";
                return b == "0" && 1 / a == -h ? "-0" : b;
            }
            a.exports = k;
        },
        function(a, b) {
            function c(a, b) {
                var c = -1, d = a == null ? 0 : a.length, e = Array(d);
                while(++c < d){
                    e[c] = b(a[c], c, a);
                }
                return e;
            }
            a.exports = c;
        },
        function(a, b, c) {
            var d = c(55), e = c(32), f = c(31), g = c(14), h = c(43);
            function i(a, b, c, i) {
                if (!g(a)) {
                    return a;
                }
                b = e(b, a);
                var j = -1, k = b.length, l = k - 1, m = a;
                while(m != null && ++j < k){
                    var n = h(b[j]), o = c;
                    if (n === "__proto__" || n === "constructor" || n === "prototype") {
                        return a;
                    }
                    if (j != l) {
                        var p = m[n];
                        o = i ? i(p, n, m) : undefined;
                        if (o === undefined) {
                            o = g(p) ? p : f(b[j + 1]) ? [] : {};
                        }
                    }
                    d(m, n, o);
                    m = m[n];
                }
                return a;
            }
            a.exports = i;
        },
        function(a, b, c) {
            var d = c(241), e = c(242);
            function f(a, b) {
                return a != null && e(a, b, d);
            }
            a.exports = f;
        },
        function(a, b) {
            function c(a, b) {
                return a != null && b in Object(a);
            }
            a.exports = c;
        },
        function(a, b, c) {
            var d = c(32), e = c(30), f = c(15), g = c(31), h = c(40), i = c(43);
            function j(a, b, c) {
                b = d(b, a);
                var j = -1, k = b.length, l = false;
                while(++j < k){
                    var m = i(b[j]);
                    if (!(l = a != null && c(a, m))) {
                        break;
                    }
                    a = a[m];
                }
                if (l || ++j != k) {
                    return l;
                }
                k = a == null ? 0 : a.length;
                return (!!k && h(k) && g(m, k) && (f(a) || e(a)));
            }
            a.exports = j;
        },
        function(a, b, c) {
            var d = c(244), e = c(58), f = c(59);
            function g(a) {
                return f(e(a, undefined, d), a + "");
            }
            a.exports = g;
        },
        function(a, b, c) {
            var d = c(245);
            function e(a) {
                var b = a == null ? 0 : a.length;
                return b ? d(a, 1) : [];
            }
            a.exports = e;
        },
        function(a, b, c) {
            var d = c(246), e = c(247);
            function f(a, b, c, g, h) {
                var i = -1, j = a.length;
                c || (c = e);
                h || (h = []);
                while(++i < j){
                    var k = a[i];
                    if (b > 0 && c(k)) {
                        if (b > 1) {
                            f(k, b - 1, c, g, h);
                        } else {
                            d(h, k);
                        }
                    } else if (!g) {
                        h[h.length] = k;
                    }
                }
                return h;
            }
            a.exports = f;
        },
        function(a, b) {
            function c(a, b) {
                var c = -1, d = b.length, e = a.length;
                while(++c < d){
                    a[e + c] = b[c];
                }
                return a;
            }
            a.exports = c;
        },
        function(a, b, c) {
            var d = c(27), e = c(30), f = c(15);
            var g = d ? d.isConcatSpreadable : undefined;
            function h(a) {
                return (f(a) || e(a) || !!(g && a && a[g]));
            }
            a.exports = h;
        },
        function(a, b) {
            function c(a) {
                return (Function.toString.call(a).indexOf("[native code]") !== -1);
            }
            a.exports = c;
            (a.exports["default"] = a.exports), (a.exports.__esModule = true);
        },
        function(a, b, c) {
            var d = c(41);
            var e = c(250);
            function f(b, c, g) {
                if (e()) {
                    a.exports = f = Reflect.construct;
                    (a.exports["default"] = a.exports), (a.exports.__esModule = true);
                } else {
                    a.exports = f = function a(b, c, e) {
                        var f = [
                            null
                        ];
                        f.push.apply(f, c);
                        var g = Function.bind.apply(b, f);
                        var h = new g();
                        if (e) d(h, e.prototype);
                        return h;
                    };
                    (a.exports["default"] = a.exports), (a.exports.__esModule = true);
                }
                return f.apply(null, arguments);
            }
            a.exports = f;
            (a.exports["default"] = a.exports), (a.exports.__esModule = true);
        },
        function(a, b) {
            function c() {
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
            a.exports = c;
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
            function c(a, b, c) {
                var d = b[0], e = b[1], f = b[2], g = b[3];
                var h = Math.sin(c);
                var i = Math.cos(c);
                a[0] = d * i + f * h;
                a[1] = e * i + g * h;
                a[2] = d * -h + f * i;
                a[3] = e * -h + g * i;
                return a;
            }
        },
        function(a, b) {
            a.exports = c;
            function c(a, b) {
                var c = b[0];
                var d = b[1];
                var e = b[2];
                var f = b[3];
                var g = c * f - e * d;
                if (!g) return null;
                g = 1.0 / g;
                a[0] = f * g;
                a[1] = -d * g;
                a[2] = -e * g;
                a[3] = c * g;
                return a;
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
                var d = b[0], e = b[1], f = b[2], g = b[3];
                var h = c[0], i = c[1];
                a[0] = d * h;
                a[1] = e * h;
                a[2] = f * i;
                a[3] = g * i;
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
            function c(a, b, c, d) {
                a[2] = d[2] / d[0];
                c[0] = d[0];
                c[1] = d[1];
                c[3] = d[3] - a[2] * c[1];
                return [
                    a,
                    b,
                    c
                ];
            }
        },
        function(a, b, c) {
            "use strict";
            c.r(b);
            c.d(b, "BarcodeDecoder", function() {
                return bo;
            });
            c.d(b, "Readers", function() {
                return d;
            });
            c.d(b, "CameraAccess", function() {
                return bO;
            });
            c.d(b, "ImageDebug", function() {
                return n["a"];
            });
            c.d(b, "ImageWrapper", function() {
                return j["a"];
            });
            c.d(b, "ResultCollector", function() {
                return bR;
            });
            var d = {};
            c.r(d);
            c.d(d, "BarcodeReader", function() {
                return F;
            });
            c.d(d, "TwoOfFiveReader", function() {
                return a8;
            });
            c.d(d, "NewCodabarReader", function() {
                return av;
            });
            c.d(d, "Code128Reader", function() {
                return J;
            });
            c.d(d, "Code32Reader", function() {
                return bm;
            });
            c.d(d, "Code39Reader", function() {
                return ae;
            });
            c.d(d, "Code39VINReader", function() {
                return al;
            });
            c.d(d, "Code93Reader", function() {
                return bg;
            });
            c.d(d, "EAN2Reader", function() {
                return aH;
            });
            c.d(d, "EAN5Reader", function() {
                return aO;
            });
            c.d(d, "EAN8Reader", function() {
                return aD;
            });
            c.d(d, "EANReader", function() {
                return W;
            });
            c.d(d, "I2of5Reader", function() {
                return a$;
            });
            c.d(d, "UPCEReader", function() {
                return aU;
            });
            c.d(d, "UPCReader", function() {
                return az;
            });
            var e = c(19);
            var f = c.n(e);
            var g = c(16);
            var h = c.n(g);
            var i = c(152);
            var j = c(11);
            var k = {};
            var l = {
                DIR: {
                    UP: 1,
                    DOWN: -1
                }
            };
            k.getBarcodeLine = function(a, b, c) {
                var d = b.x | 0;
                var e = b.y | 0;
                var f = c.x | 0;
                var g = c.y | 0;
                var h = Math.abs(g - e) > Math.abs(f - d);
                var i;
                var j;
                var k;
                var l;
                var m = [];
                var n = a.data;
                var o = a.size.x;
                var p;
                var q = 255;
                var r = 0;
                function s(a, b) {
                    p = n[b * o + a];
                    q = p < q ? p : q;
                    r = p > r ? p : r;
                    m.push(p);
                }
                if (h) {
                    k = d;
                    d = e;
                    e = k;
                    k = f;
                    f = g;
                    g = k;
                }
                if (d > f) {
                    k = d;
                    d = f;
                    f = k;
                    k = e;
                    e = g;
                    g = k;
                }
                var t = f - d;
                var u = Math.abs(g - e);
                i = (t / 2) | 0;
                j = e;
                var v = e < g ? 1 : -1;
                for(l = d; l < f; l++){
                    if (h) {
                        s(j, l);
                    } else {
                        s(l, j);
                    }
                    i -= u;
                    if (i < 0) {
                        j += v;
                        i += t;
                    }
                }
                return {
                    line: m,
                    min: q,
                    max: r
                };
            };
            k.toBinaryLine = function(a) {
                var b = a.min;
                var c = a.max;
                var d = a.line;
                var e;
                var f;
                var g = b + (c - b) / 2;
                var h = [];
                var i;
                var j;
                var k = (c - b) / 12;
                var m = -k;
                var n;
                var o;
                i = d[0] > g ? l.DIR.UP : l.DIR.DOWN;
                h.push({
                    pos: 0,
                    val: d[0]
                });
                for(n = 0; n < d.length - 2; n++){
                    e = d[n + 1] - d[n];
                    f = d[n + 2] - d[n + 1];
                    if (e + f < m && d[n + 1] < g * 1.5) {
                        j = l.DIR.DOWN;
                    } else if (e + f > k && d[n + 1] > g * 0.5) {
                        j = l.DIR.UP;
                    } else {
                        j = i;
                    }
                    if (i !== j) {
                        h.push({
                            pos: n,
                            val: d[n]
                        });
                        i = j;
                    }
                }
                h.push({
                    pos: d.length,
                    val: d[d.length - 1]
                });
                for(o = h[0].pos; o < h[1].pos; o++){
                    d[o] = d[o] > g ? 0 : 1;
                }
                for(n = 1; n < h.length - 1; n++){
                    if (h[n + 1].val > h[n].val) {
                        k = (h[n].val + ((h[n + 1].val - h[n].val) / 3) * 2) | 0;
                    } else {
                        k = (h[n + 1].val + (h[n].val - h[n + 1].val) / 3) | 0;
                    }
                    for(o = h[n].pos; o < h[n + 1].pos; o++){
                        d[o] = d[o] > k ? 0 : 1;
                    }
                }
                return {
                    line: d,
                    threshold: k
                };
            };
            k.debug = {
                printFrequency: function a(b, c) {
                    var d;
                    var e = c.getContext("2d");
                    c.width = b.length;
                    c.height = 256;
                    e.beginPath();
                    e.strokeStyle = "blue";
                    for(d = 0; d < b.length; d++){
                        e.moveTo(d, 255);
                        e.lineTo(d, 255 - b[d]);
                    }
                    e.stroke();
                    e.closePath();
                },
                printPattern: function a(b, c) {
                    var d = c.getContext("2d");
                    var e;
                    c.width = b.length;
                    d.fillColor = "black";
                    for(e = 0; e < b.length; e++){
                        if (b[e] === 1) {
                            d.fillRect(e, 0, 1, 100);
                        }
                    }
                }
            };
            var m = k;
            var n = c(9);
            var o = c(3);
            var p = c.n(o);
            var q = c(4);
            var r = c.n(q);
            var s = c(1);
            var t = c.n(s);
            var u = c(6);
            var v = c.n(u);
            var w = c(5);
            var x = c.n(w);
            var y = c(2);
            var z = c.n(y);
            var A = c(0);
            var B = c.n(A);
            var C = c(10);
            var D;
            (function(a) {
                a[(a["Forward"] = 1)] = "Forward";
                a[(a["Reverse"] = -1)] = "Reverse";
            })(D || (D = {}));
            var E = (function() {
                function a(b, c) {
                    p()(this, a);
                    B()(this, "_row", []);
                    B()(this, "config", {});
                    B()(this, "supplements", []);
                    B()(this, "SINGLE_CODE_ERROR", 0);
                    B()(this, "FORMAT", "unknown");
                    B()(this, "CONFIG_KEYS", {});
                    this._row = [];
                    this.config = b || {};
                    if (c) {
                        this.supplements = c;
                    }
                    return this;
                }
                r()(a, [
                    {
                        key: "_nextUnset",
                        value: function a(b) {
                            var c = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
                            for(var d = c; d < b.length; d++){
                                if (!b[d]) return d;
                            }
                            return b.length;
                        }
                    },
                    {
                        key: "_matchPattern",
                        value: function a(b, c, d) {
                            var e = 0;
                            var f = 0;
                            var g = 0;
                            var h = 0;
                            var i = 0;
                            var j = 0;
                            var k = 0;
                            d = d || this.SINGLE_CODE_ERROR || 1;
                            for(var l = 0; l < b.length; l++){
                                g += b[l];
                                h += c[l];
                            }
                            if (g < h) {
                                return Number.MAX_VALUE;
                            }
                            i = g / h;
                            d *= i;
                            for(var m = 0; m < b.length; m++){
                                j = b[m];
                                k = c[m] * i;
                                f = Math.abs(j - k) / k;
                                if (f > d) {
                                    return Number.MAX_VALUE;
                                }
                                e += f;
                            }
                            return e / h;
                        }
                    },
                    {
                        key: "_nextSet",
                        value: function a(b) {
                            var c = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
                            for(var d = c; d < b.length; d++){
                                if (b[d]) return d;
                            }
                            return b.length;
                        }
                    },
                    {
                        key: "_correctBars",
                        value: function a(b, c, d) {
                            var e = d.length;
                            var f = 0;
                            while(e--){
                                f = b[d[e]] * (1 - (1 - c) / 2);
                                if (f > 1) {
                                    b[d[e]] = f;
                                }
                            }
                        }
                    },
                    {
                        key: "decodePattern",
                        value: function a(b) {
                            this._row = b;
                            var c = this.decode();
                            if (c === null) {
                                this._row.reverse();
                                c = this.decode();
                                if (c) {
                                    c.direction = D.Reverse;
                                    c.start = this._row.length - c.start;
                                    c.end = this._row.length - c.end;
                                }
                            } else {
                                c.direction = D.Forward;
                            }
                            if (c) {
                                c.format = this.FORMAT;
                            }
                            return c;
                        }
                    },
                    {
                        key: "_matchRange",
                        value: function a(b, c, d) {
                            var e;
                            b = b < 0 ? 0 : b;
                            for(e = b; e < c; e++){
                                if (this._row[e] !== d) {
                                    return false;
                                }
                            }
                            return true;
                        }
                    },
                    {
                        key: "_fillCounters",
                        value: function a() {
                            var b = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._nextUnset(this._row);
                            var c = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this._row.length;
                            var d = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
                            var e = [];
                            var f = 0;
                            e[f] = 0;
                            for(var g = b; g < c; g++){
                                if (this._row[g] ^ (d ? 1 : 0)) {
                                    e[f]++;
                                } else {
                                    f++;
                                    e[f] = 1;
                                    d = !d;
                                }
                            }
                            return e;
                        }
                    },
                    {
                        key: "_toCounters",
                        value: function a(b, c) {
                            var d = c.length;
                            var e = this._row.length;
                            var f = !this._row[b];
                            var g = 0;
                            C["a"].init(c, 0);
                            for(var h = b; h < e; h++){
                                if (this._row[h] ^ (f ? 1 : 0)) {
                                    c[g]++;
                                } else {
                                    g++;
                                    if (g === d) {
                                        break;
                                    } else {
                                        c[g] = 1;
                                        f = !f;
                                    }
                                }
                            }
                            return c;
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
            var F = E;
            function G(a) {
                var b = H();
                return function c() {
                    var d = z()(a), e;
                    if (b) {
                        var f = z()(this).constructor;
                        e = Reflect.construct(d, arguments, f);
                    } else {
                        e = d.apply(this, arguments);
                    }
                    return x()(this, e);
                };
            }
            function H() {
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
            var I = (function(a) {
                v()(c, a);
                var b = G(c);
                function c() {
                    var a;
                    p()(this, c);
                    for(var d = arguments.length, e = new Array(d), f = 0; f < d; f++){
                        e[f] = arguments[f];
                    }
                    a = b.call.apply(b, [
                        this
                    ].concat(e));
                    B()(t()(a), "CODE_SHIFT", 98);
                    B()(t()(a), "CODE_C", 99);
                    B()(t()(a), "CODE_B", 100);
                    B()(t()(a), "CODE_A", 101);
                    B()(t()(a), "START_CODE_A", 103);
                    B()(t()(a), "START_CODE_B", 104);
                    B()(t()(a), "START_CODE_C", 105);
                    B()(t()(a), "STOP_CODE", 106);
                    B()(t()(a), "CODE_PATTERN", [
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
                    B()(t()(a), "SINGLE_CODE_ERROR", 0.64);
                    B()(t()(a), "AVG_CODE_ERROR", 0.3);
                    B()(t()(a), "FORMAT", "code_128");
                    B()(t()(a), "MODULE_INDICES", {
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
                    return a;
                }
                r()(c, [
                    {
                        key: "_decodeCode",
                        value: function a(b, c) {
                            var d = {
                                error: Number.MAX_VALUE,
                                code: -1,
                                start: b,
                                end: b,
                                correction: {
                                    bar: 1,
                                    space: 1
                                }
                            };
                            var e = [
                                0,
                                0,
                                0,
                                0,
                                0,
                                0
                            ];
                            var f = b;
                            var g = !this._row[f];
                            var h = 0;
                            for(var i = f; i < this._row.length; i++){
                                if (this._row[i] ^ (g ? 1 : 0)) {
                                    e[h]++;
                                } else {
                                    if (h === e.length - 1) {
                                        if (c) {
                                            this._correct(e, c);
                                        }
                                        for(var j = 0; j < this.CODE_PATTERN.length; j++){
                                            var k = this._matchPattern(e, this.CODE_PATTERN[j]);
                                            if (k < d.error) {
                                                d.code = j;
                                                d.error = k;
                                            }
                                        }
                                        d.end = i;
                                        if (d.code === -1 || d.error > this.AVG_CODE_ERROR) {
                                            return null;
                                        }
                                        if (this.CODE_PATTERN[d.code]) {
                                            d.correction.bar = this.calculateCorrection(this.CODE_PATTERN[d.code], e, this.MODULE_INDICES.bar);
                                            d.correction.space = this.calculateCorrection(this.CODE_PATTERN[d.code], e, this.MODULE_INDICES.space);
                                        }
                                        return d;
                                    } else {
                                        h++;
                                    }
                                    e[h] = 1;
                                    g = !g;
                                }
                            }
                            return null;
                        }
                    },
                    {
                        key: "_correct",
                        value: function a(b, c) {
                            this._correctBars(b, c.bar, this.MODULE_INDICES.bar);
                            this._correctBars(b, c.space, this.MODULE_INDICES.space);
                        }
                    },
                    {
                        key: "_findStart",
                        value: function a() {
                            var b = [
                                0,
                                0,
                                0,
                                0,
                                0,
                                0
                            ];
                            var c = this._nextSet(this._row);
                            var d = {
                                error: Number.MAX_VALUE,
                                code: -1,
                                start: 0,
                                end: 0,
                                correction: {
                                    bar: 1,
                                    space: 1
                                }
                            };
                            var e = false;
                            var f = 0;
                            for(var g = c; g < this._row.length; g++){
                                if (this._row[g] ^ (e ? 1 : 0)) {
                                    b[f]++;
                                } else {
                                    if (f === b.length - 1) {
                                        var h = b.reduce(function(a, b) {
                                            return a + b;
                                        }, 0);
                                        for(var i = this.START_CODE_A; i <= this.START_CODE_C; i++){
                                            var j = this._matchPattern(b, this.CODE_PATTERN[i]);
                                            if (j < d.error) {
                                                d.code = i;
                                                d.error = j;
                                            }
                                        }
                                        if (d.error < this.AVG_CODE_ERROR) {
                                            d.start = g - h;
                                            d.end = g;
                                            d.correction.bar = this.calculateCorrection(this.CODE_PATTERN[d.code], b, this.MODULE_INDICES.bar);
                                            d.correction.space = this.calculateCorrection(this.CODE_PATTERN[d.code], b, this.MODULE_INDICES.space);
                                            return d;
                                        }
                                        for(var k = 0; k < 4; k++){
                                            b[k] = b[k + 2];
                                        }
                                        b[4] = 0;
                                        b[5] = 0;
                                        f--;
                                    } else {
                                        f++;
                                    }
                                    b[f] = 1;
                                    e = !e;
                                }
                            }
                            return null;
                        }
                    },
                    {
                        key: "decode",
                        value: function a(b, c) {
                            var d = this;
                            var e = this._findStart();
                            if (e === null) {
                                return null;
                            }
                            var f = {
                                code: e.code,
                                start: e.start,
                                end: e.end,
                                correction: {
                                    bar: e.correction.bar,
                                    space: e.correction.space
                                }
                            };
                            var g = [];
                            g.push(f);
                            var h = f.code;
                            var i = (function(a) {
                                switch(a){
                                    case d.START_CODE_A:
                                        return d.CODE_A;
                                    case d.START_CODE_B:
                                        return d.CODE_B;
                                    case d.START_CODE_C:
                                        return d.CODE_C;
                                    default:
                                        return null;
                                }
                            })(f.code);
                            var j = false;
                            var k = false;
                            var l = k;
                            var m = true;
                            var n = 0;
                            var o = [];
                            var p = [];
                            while(!j){
                                l = k;
                                k = false;
                                f = this._decodeCode(f.end, f.correction);
                                if (f !== null) {
                                    if (f.code !== this.STOP_CODE) {
                                        m = true;
                                    }
                                    if (f.code !== this.STOP_CODE) {
                                        o.push(f.code);
                                        n++;
                                        h += n * f.code;
                                    }
                                    g.push(f);
                                    switch(i){
                                        case this.CODE_A:
                                            if (f.code < 64) {
                                                p.push(String.fromCharCode(32 + f.code));
                                            } else if (f.code < 96) {
                                                p.push(String.fromCharCode(f.code - 64));
                                            } else {
                                                if (f.code !== this.STOP_CODE) {
                                                    m = false;
                                                }
                                                switch(f.code){
                                                    case this.CODE_SHIFT:
                                                        k = true;
                                                        i = this.CODE_B;
                                                        break;
                                                    case this.CODE_B:
                                                        i = this.CODE_B;
                                                        break;
                                                    case this.CODE_C:
                                                        i = this.CODE_C;
                                                        break;
                                                    case this.STOP_CODE:
                                                        j = true;
                                                        break;
                                                }
                                            }
                                            break;
                                        case this.CODE_B:
                                            if (f.code < 96) {
                                                p.push(String.fromCharCode(32 + f.code));
                                            } else {
                                                if (f.code !== this.STOP_CODE) {
                                                    m = false;
                                                }
                                                switch(f.code){
                                                    case this.CODE_SHIFT:
                                                        k = true;
                                                        i = this.CODE_A;
                                                        break;
                                                    case this.CODE_A:
                                                        i = this.CODE_A;
                                                        break;
                                                    case this.CODE_C:
                                                        i = this.CODE_C;
                                                        break;
                                                    case this.STOP_CODE:
                                                        j = true;
                                                        break;
                                                }
                                            }
                                            break;
                                        case this.CODE_C:
                                            if (f.code < 100) {
                                                p.push(f.code < 10 ? "0" + f.code : f.code);
                                            } else {
                                                if (f.code !== this.STOP_CODE) {
                                                    m = false;
                                                }
                                                switch(f.code){
                                                    case this.CODE_A:
                                                        i = this.CODE_A;
                                                        break;
                                                    case this.CODE_B:
                                                        i = this.CODE_B;
                                                        break;
                                                    case this.STOP_CODE:
                                                        j = true;
                                                        break;
                                                }
                                            }
                                            break;
                                    }
                                } else {
                                    j = true;
                                }
                                if (l) {
                                    i = i === this.CODE_A ? this.CODE_B : this.CODE_A;
                                }
                            }
                            if (f === null) {
                                return null;
                            }
                            f.end = this._nextUnset(this._row, f.end);
                            if (!this._verifyTrailingWhitespace(f)) {
                                return null;
                            }
                            h -= n * o[o.length - 1];
                            if (h % 103 !== o[o.length - 1]) {
                                return null;
                            }
                            if (!p.length) {
                                return null;
                            }
                            if (m) {
                                p.splice(p.length - 1, 1);
                            }
                            return {
                                code: p.join(""),
                                start: e.start,
                                end: f.end,
                                codeset: i,
                                startInfo: e,
                                decodedCodes: g,
                                endInfo: f,
                                format: this.FORMAT
                            };
                        }
                    },
                    {
                        key: "_verifyTrailingWhitespace",
                        value: function a(b) {
                            var c = this, d;
                            d = b.end + (b.end - b.start) / 2;
                            if (d < c._row.length) {
                                if (c._matchRange(b.end, d, 0)) {
                                    return b;
                                }
                            }
                            return null;
                        }
                    },
                    {
                        key: "calculateCorrection",
                        value: function a(b, c, d) {
                            var e = d.length, f = 0, g = 0;
                            while(e--){
                                g += b[d[e]];
                                f += c[d[e]];
                            }
                            return g / f;
                        }
                    }, 
                ]);
                return c;
            })(F);
            var J = I;
            function K(a, b) {
                var c = Object.keys(a);
                if (Object.getOwnPropertySymbols) {
                    var d = Object.getOwnPropertySymbols(a);
                    if (b) {
                        d = d.filter(function(b) {
                            return Object.getOwnPropertyDescriptor(a, b).enumerable;
                        });
                    }
                    c.push.apply(c, d);
                }
                return c;
            }
            function L(a) {
                for(var b = 1; b < arguments.length; b++){
                    var c = arguments[b] != null ? arguments[b] : {};
                    if (b % 2) {
                        K(Object(c), true).forEach(function(b) {
                            B()(a, b, c[b]);
                        });
                    } else if (Object.getOwnPropertyDescriptors) {
                        Object.defineProperties(a, Object.getOwnPropertyDescriptors(c));
                    } else {
                        K(Object(c)).forEach(function(b) {
                            Object.defineProperty(a, b, Object.getOwnPropertyDescriptor(c, b));
                        });
                    }
                }
                return a;
            }
            function M(a) {
                var b = N();
                return function c() {
                    var d = z()(a), e;
                    if (b) {
                        var f = z()(this).constructor;
                        e = Reflect.construct(d, arguments, f);
                    } else {
                        e = d.apply(this, arguments);
                    }
                    return x()(this, e);
                };
            }
            function N() {
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
            var O = 10;
            var P = [
                1,
                1,
                1
            ];
            var Q = [
                1,
                1,
                1,
                1,
                1
            ];
            var R = [
                1,
                1,
                2
            ];
            var S = [
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
            var T = [
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
            var U = 0.48;
            var V = (function(a) {
                v()(c, a);
                var b = M(c);
                function c(a, d) {
                    var e;
                    p()(this, c);
                    e = b.call(this, h()({
                        supplements: []
                    }, a), d);
                    B()(t()(e), "FORMAT", "ean_13");
                    B()(t()(e), "SINGLE_CODE_ERROR", 0.7);
                    B()(t()(e), "STOP_PATTERN", [
                        1,
                        1,
                        1
                    ]);
                    return e;
                }
                r()(c, [
                    {
                        key: "_findPattern",
                        value: function a(b, c, d, e) {
                            var f = new Array(b.length).fill(0);
                            var g = {
                                error: Number.MAX_VALUE,
                                start: 0,
                                end: 0
                            };
                            var h = U;
                            var i = 0;
                            if (!c) {
                                c = this._nextSet(this._row);
                            }
                            var j = false;
                            for(var k = c; k < this._row.length; k++){
                                if (this._row[k] ^ (d ? 1 : 0)) {
                                    f[i] += 1;
                                } else {
                                    if (i === f.length - 1) {
                                        var l = this._matchPattern(f, b);
                                        if (l < h && g.error && l < g.error) {
                                            j = true;
                                            g.error = l;
                                            g.start = k - f.reduce(function(a, b) {
                                                return a + b;
                                            }, 0);
                                            g.end = k;
                                            return g;
                                        }
                                        if (e) {
                                            for(var m = 0; m < f.length - 2; m++){
                                                f[m] = f[m + 2];
                                            }
                                            f[f.length - 2] = 0;
                                            f[f.length - 1] = 0;
                                            i--;
                                        }
                                    } else {
                                        i++;
                                    }
                                    f[i] = 1;
                                    d = !d;
                                }
                            }
                            if (j) {} else {}
                            return j ? g : null;
                        }
                    },
                    {
                        key: "_decodeCode",
                        value: function a(b, c) {
                            var d = [
                                0,
                                0,
                                0,
                                0
                            ];
                            var e = b;
                            var f = {
                                error: Number.MAX_VALUE,
                                code: -1,
                                start: b,
                                end: b
                            };
                            var g = U;
                            var h = !this._row[e];
                            var i = 0;
                            if (!c) {
                                c = S.length;
                            }
                            var j = false;
                            for(var k = e; k < this._row.length; k++){
                                if (this._row[k] ^ (h ? 1 : 0)) {
                                    d[i]++;
                                } else {
                                    if (i === d.length - 1) {
                                        for(var l = 0; l < c; l++){
                                            var m = this._matchPattern(d, S[l]);
                                            f.end = k;
                                            if (m < f.error) {
                                                f.code = l;
                                                f.error = m;
                                            }
                                        }
                                        if (f.error > g) {
                                            return null;
                                        }
                                        return f;
                                    } else {
                                        i++;
                                    }
                                    d[i] = 1;
                                    h = !h;
                                }
                            }
                            return j ? f : null;
                        }
                    },
                    {
                        key: "_findStart",
                        value: function a() {
                            var b = this._nextSet(this._row);
                            var c = null;
                            while(!c){
                                c = this._findPattern(P, b, false, true);
                                if (!c) {
                                    return null;
                                }
                                var d = c.start - (c.end - c.start);
                                if (d >= 0) {
                                    if (this._matchRange(d, c.start, 0)) {
                                        return c;
                                    }
                                }
                                b = c.end;
                                c = null;
                            }
                            return null;
                        }
                    },
                    {
                        key: "_calculateFirstDigit",
                        value: function a(b) {
                            for(var c = 0; c < T.length; c++){
                                if (b === T[c]) {
                                    return c;
                                }
                            }
                            return null;
                        }
                    },
                    {
                        key: "_decodePayload",
                        value: function a(b, c, d) {
                            var e = L({}, b);
                            var f = 0x0;
                            for(var g = 0; g < 6; g++){
                                e = this._decodeCode(e.end);
                                if (!e) {
                                    return null;
                                }
                                if (e.code >= O) {
                                    e.code -= O;
                                    f |= 1 << (5 - g);
                                } else {
                                    f |= 0 << (5 - g);
                                }
                                c.push(e.code);
                                d.push(e);
                            }
                            var h = this._calculateFirstDigit(f);
                            if (h === null) {
                                return null;
                            }
                            c.unshift(h);
                            var i = this._findPattern(Q, e.end, true, false);
                            if (i === null || !i.end) {
                                return null;
                            }
                            d.push(i);
                            for(var j = 0; j < 6; j++){
                                i = this._decodeCode(i.end, O);
                                if (!i) {
                                    return null;
                                }
                                d.push(i);
                                c.push(i.code);
                            }
                            return i;
                        }
                    },
                    {
                        key: "_verifyTrailingWhitespace",
                        value: function a(b) {
                            var c = b.end + (b.end - b.start);
                            if (c < this._row.length) {
                                if (this._matchRange(b.end, c, 0)) {
                                    return b;
                                }
                            }
                            return null;
                        }
                    },
                    {
                        key: "_findEnd",
                        value: function a(b, c) {
                            var d = this._findPattern(this.STOP_PATTERN, b, c, false);
                            return d !== null ? this._verifyTrailingWhitespace(d) : null;
                        }
                    },
                    {
                        key: "_checksum",
                        value: function a(b) {
                            var c = 0;
                            for(var d = b.length - 2; d >= 0; d -= 2){
                                c += b[d];
                            }
                            c *= 3;
                            for(var e = b.length - 1; e >= 0; e -= 2){
                                c += b[e];
                            }
                            return c % 10 === 0;
                        }
                    },
                    {
                        key: "_decodeExtensions",
                        value: function a(b) {
                            var c = this._nextSet(this._row, b);
                            var d = this._findPattern(R, c, false, false);
                            if (d === null) {
                                return null;
                            }
                            for(var e = 0; e < this.supplements.length; e++){
                                try {
                                    var f = this.supplements[e].decode(this._row, d.end);
                                    if (f !== null) {
                                        return {
                                            code: f.code,
                                            start: c,
                                            startInfo: d,
                                            end: f.end,
                                            decodedCodes: f.decodedCodes,
                                            format: this.supplements[e].FORMAT
                                        };
                                    }
                                } catch (g) {
                                    console.error("* decodeExtensions error in ", this.supplements[e], ": ", g);
                                }
                            }
                            return null;
                        }
                    },
                    {
                        key: "decode",
                        value: function a(b, c) {
                            var d = new Array();
                            var e = new Array();
                            var f = {};
                            var g = this._findStart();
                            if (!g) {
                                return null;
                            }
                            var h = {
                                start: g.start,
                                end: g.end
                            };
                            e.push(h);
                            h = this._decodePayload(h, d, e);
                            if (!h) {
                                return null;
                            }
                            h = this._findEnd(h.end, false);
                            if (!h) {
                                return null;
                            }
                            e.push(h);
                            if (!this._checksum(d)) {
                                return null;
                            }
                            if (this.supplements.length > 0) {
                                var i = this._decodeExtensions(h.end);
                                if (!i) {
                                    return null;
                                }
                                if (!i.decodedCodes) {
                                    return null;
                                }
                                var j = i.decodedCodes[i.decodedCodes.length - 1];
                                var k = {
                                    start: j.start + (((j.end - j.start) / 2) | 0),
                                    end: j.end
                                };
                                if (!this._verifyTrailingWhitespace(k)) {
                                    return null;
                                }
                                f = {
                                    supplement: i,
                                    code: d.join("") + i.code
                                };
                            }
                            return L(L({
                                code: d.join(""),
                                start: g.start,
                                end: h.end,
                                startInfo: g,
                                decodedCodes: e
                            }, f), {}, {
                                format: this.FORMAT
                            });
                        }
                    }, 
                ]);
                return c;
            })(F);
            var W = V;
            var X = c(33);
            var Y = c.n(X);
            function Z(a) {
                var b = $();
                return function c() {
                    var d = z()(a), e;
                    if (b) {
                        var f = z()(this).constructor;
                        e = Reflect.construct(d, arguments, f);
                    } else {
                        e = d.apply(this, arguments);
                    }
                    return x()(this, e);
                };
            }
            function $() {
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
            var _ = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. *$/+%";
            var aa = new Uint16Array(Y()(_).map(function(a) {
                return a.charCodeAt(0);
            }));
            var ab = new Uint16Array([
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
            var ac = 0x094;
            var ad = (function(a) {
                v()(c, a);
                var b = Z(c);
                function c() {
                    var a;
                    p()(this, c);
                    for(var d = arguments.length, e = new Array(d), f = 0; f < d; f++){
                        e[f] = arguments[f];
                    }
                    a = b.call.apply(b, [
                        this
                    ].concat(e));
                    B()(t()(a), "FORMAT", "code_39");
                    return a;
                }
                r()(c, [
                    {
                        key: "_findStart",
                        value: function a() {
                            var b = this._nextSet(this._row);
                            var c = b;
                            var d = new Uint16Array([
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
                            var e = 0;
                            var f = false;
                            for(var g = b; g < this._row.length; g++){
                                if (this._row[g] ^ (f ? 1 : 0)) {
                                    d[e]++;
                                } else {
                                    if (e === d.length - 1) {
                                        if (this._toPattern(d) === ac) {
                                            var h = Math.floor(Math.max(0, c - (g - c) / 4));
                                            if (this._matchRange(h, c, 0)) {
                                                return {
                                                    start: c,
                                                    end: g
                                                };
                                            }
                                        }
                                        c += d[0] + d[1];
                                        for(var i = 0; i < 7; i++){
                                            d[i] = d[i + 2];
                                        }
                                        d[7] = 0;
                                        d[8] = 0;
                                        e--;
                                    } else {
                                        e++;
                                    }
                                    d[e] = 1;
                                    f = !f;
                                }
                            }
                            return null;
                        }
                    },
                    {
                        key: "_toPattern",
                        value: function a(b) {
                            var c = b.length;
                            var d = 0;
                            var e = c;
                            var f = 0;
                            while(e > 3){
                                d = this._findNextWidth(b, d);
                                e = 0;
                                var g = 0;
                                for(var h = 0; h < c; h++){
                                    if (b[h] > d) {
                                        g |= 1 << (c - 1 - h);
                                        e++;
                                        f += b[h];
                                    }
                                }
                                if (e === 3) {
                                    for(var i = 0; i < c && e > 0; i++){
                                        if (b[i] > d) {
                                            e--;
                                            if (b[i] * 2 >= f) {
                                                return -1;
                                            }
                                        }
                                    }
                                    return g;
                                }
                            }
                            return -1;
                        }
                    },
                    {
                        key: "_findNextWidth",
                        value: function a(b, c) {
                            var d = Number.MAX_VALUE;
                            for(var e = 0; e < b.length; e++){
                                if (b[e] < d && b[e] > c) {
                                    d = b[e];
                                }
                            }
                            return d;
                        }
                    },
                    {
                        key: "_patternToChar",
                        value: function a(b) {
                            for(var c = 0; c < ab.length; c++){
                                if (ab[c] === b) {
                                    return String.fromCharCode(aa[c]);
                                }
                            }
                            return null;
                        }
                    },
                    {
                        key: "_verifyTrailingWhitespace",
                        value: function a(b, c, d) {
                            var e = C["a"].sum(d);
                            var f = c - b - e;
                            if (f * 3 >= e) {
                                return true;
                            }
                            return false;
                        }
                    },
                    {
                        key: "decode",
                        value: function a(b, c) {
                            var d = new Uint16Array([
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
                            var e = [];
                            c = this._findStart();
                            if (!c) {
                                return null;
                            }
                            var f = this._nextSet(this._row, c.end);
                            var g;
                            var h;
                            do {
                                d = this._toCounters(f, d);
                                var i = this._toPattern(d);
                                if (i < 0) {
                                    return null;
                                }
                                g = this._patternToChar(i);
                                if (g === null) {
                                    return null;
                                }
                                e.push(g);
                                h = f;
                                f += C["a"].sum(d);
                                f = this._nextSet(this._row, f);
                            }while (g !== "*")
                            e.pop();
                            if (!e.length) {
                                return null;
                            }
                            if (!this._verifyTrailingWhitespace(h, f, d)) {
                                return null;
                            }
                            return {
                                code: e.join(""),
                                start: c.start,
                                end: f,
                                startInfo: c,
                                decodedCodes: e,
                                format: this.FORMAT
                            };
                        }
                    }, 
                ]);
                return c;
            })(F);
            var ae = ad;
            var af = c(13);
            var ag = c.n(af);
            function ah(a) {
                var b = ai();
                return function c() {
                    var d = z()(a), e;
                    if (b) {
                        var f = z()(this).constructor;
                        e = Reflect.construct(d, arguments, f);
                    } else {
                        e = d.apply(this, arguments);
                    }
                    return x()(this, e);
                };
            }
            function ai() {
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
            var aj = {
                IOQ: /[IOQ]/g,
                AZ09: /[A-Z0-9]{17}/
            };
            var ak = (function(a) {
                v()(c, a);
                var b = ah(c);
                function c() {
                    var a;
                    p()(this, c);
                    for(var d = arguments.length, e = new Array(d), f = 0; f < d; f++){
                        e[f] = arguments[f];
                    }
                    a = b.call.apply(b, [
                        this
                    ].concat(e));
                    B()(t()(a), "FORMAT", "code_39_vin");
                    return a;
                }
                r()(c, [
                    {
                        key: "_checkChecksum",
                        value: function a(b) {
                            return !!b;
                        }
                    },
                    {
                        key: "decode",
                        value: function a(b, d) {
                            var e = ag()(z()(c.prototype), "decode", this).call(this, b, d);
                            if (!e) {
                                return null;
                            }
                            var f = e.code;
                            if (!f) {
                                return null;
                            }
                            f = f.replace(aj.IOQ, "");
                            if (!f.match(aj.AZ09)) {
                                if (true) {
                                    console.log("Failed AZ09 pattern code:", f);
                                }
                                return null;
                            }
                            if (!this._checkChecksum(f)) {
                                return null;
                            }
                            e.code = f;
                            return e;
                        }
                    }, 
                ]);
                return c;
            })(ae);
            var al = ak;
            function am(a) {
                var b = an();
                return function c() {
                    var d = z()(a), e;
                    if (b) {
                        var f = z()(this).constructor;
                        e = Reflect.construct(d, arguments, f);
                    } else {
                        e = d.apply(this, arguments);
                    }
                    return x()(this, e);
                };
            }
            function an() {
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
            var ao = [
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
            var ap = [
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
            var aq = [
                0x01a,
                0x029,
                0x00b,
                0x00e
            ];
            var ar = 4;
            var as = 2.0;
            var at = 1.5;
            var au = (function(a) {
                v()(c, a);
                var b = am(c);
                function c() {
                    var a;
                    p()(this, c);
                    for(var d = arguments.length, e = new Array(d), f = 0; f < d; f++){
                        e[f] = arguments[f];
                    }
                    a = b.call.apply(b, [
                        this
                    ].concat(e));
                    B()(t()(a), "_counters", []);
                    B()(t()(a), "FORMAT", "codabar");
                    return a;
                }
                r()(c, [
                    {
                        key: "_computeAlternatingThreshold",
                        value: function a(b, c) {
                            var d = Number.MAX_VALUE;
                            var e = 0;
                            var f = 0;
                            for(var g = b; g < c; g += 2){
                                f = this._counters[g];
                                if (f > e) {
                                    e = f;
                                }
                                if (f < d) {
                                    d = f;
                                }
                            }
                            return ((d + e) / 2.0) | 0;
                        }
                    },
                    {
                        key: "_toPattern",
                        value: function a(b) {
                            var c = 7;
                            var d = b + c;
                            if (d > this._counters.length) {
                                return -1;
                            }
                            var e = this._computeAlternatingThreshold(b, d);
                            var f = this._computeAlternatingThreshold(b + 1, d);
                            var g = 1 << (c - 1);
                            var h = 0;
                            var i = 0;
                            for(var j = 0; j < c; j++){
                                h = (j & 1) === 0 ? e : f;
                                if (this._counters[b + j] > h) {
                                    i |= g;
                                }
                                g >>= 1;
                            }
                            return i;
                        }
                    },
                    {
                        key: "_isStartEnd",
                        value: function a(b) {
                            for(var c = 0; c < aq.length; c++){
                                if (aq[c] === b) {
                                    return true;
                                }
                            }
                            return false;
                        }
                    },
                    {
                        key: "_sumCounters",
                        value: function a(b, c) {
                            var d = 0;
                            for(var e = b; e < c; e++){
                                d += this._counters[e];
                            }
                            return d;
                        }
                    },
                    {
                        key: "_findStart",
                        value: function a() {
                            var b = this._nextUnset(this._row);
                            var c = b;
                            for(var d = 1; d < this._counters.length; d++){
                                var e = this._toPattern(d);
                                if (e !== -1 && this._isStartEnd(e)) {
                                    b += this._sumCounters(0, d);
                                    c = b + this._sumCounters(d, d + 8);
                                    return {
                                        start: b,
                                        end: c,
                                        startCounter: d,
                                        endCounter: d + 8
                                    };
                                }
                            }
                            return null;
                        }
                    },
                    {
                        key: "_patternToChar",
                        value: function a(b) {
                            for(var c = 0; c < ap.length; c++){
                                if (ap[c] === b) {
                                    return String.fromCharCode(ao[c]);
                                }
                            }
                            return null;
                        }
                    },
                    {
                        key: "_calculatePatternLength",
                        value: function a(b) {
                            var c = 0;
                            for(var d = b; d < b + 7; d++){
                                c += this._counters[d];
                            }
                            return c;
                        }
                    },
                    {
                        key: "_verifyWhitespace",
                        value: function a(b, c) {
                            if (b - 1 <= 0 || this._counters[b - 1] >= this._calculatePatternLength(b) / 2.0) {
                                if (c + 8 >= this._counters.length || this._counters[c + 7] >= this._calculatePatternLength(c) / 2.0) {
                                    return true;
                                }
                            }
                            return false;
                        }
                    },
                    {
                        key: "_charToPattern",
                        value: function a(b) {
                            var c = b.charCodeAt(0);
                            for(var d = 0; d < ao.length; d++){
                                if (ao[d] === c) {
                                    return ap[d];
                                }
                            }
                            return 0x0;
                        }
                    },
                    {
                        key: "_thresholdResultPattern",
                        value: function a(b, c) {
                            var d = {
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
                            var e = c;
                            var f;
                            for(var g = 0; g < b.length; g++){
                                f = this._charToPattern(b[g]);
                                for(var h = 6; h >= 0; h--){
                                    var i = (h & 1) === 2 ? d.bar : d.space;
                                    var j = (f & 1) === 1 ? i.wide : i.narrow;
                                    j.size += this._counters[e + h];
                                    j.counts++;
                                    f >>= 1;
                                }
                                e += 8;
                            }
                            [
                                "space",
                                "bar"
                            ].forEach(function(a) {
                                var b = d[a];
                                b.wide.min = Math.floor((b.narrow.size / b.narrow.counts + b.wide.size / b.wide.counts) / 2);
                                b.narrow.max = Math.ceil(b.wide.min);
                                b.wide.max = Math.ceil((b.wide.size * as + at) / b.wide.counts);
                            });
                            return d;
                        }
                    },
                    {
                        key: "_validateResult",
                        value: function a(b, c) {
                            var d = this._thresholdResultPattern(b, c);
                            var e = c;
                            var f;
                            for(var g = 0; g < b.length; g++){
                                f = this._charToPattern(b[g]);
                                for(var h = 6; h >= 0; h--){
                                    var i = (h & 1) === 0 ? d.bar : d.space;
                                    var j = (f & 1) === 1 ? i.wide : i.narrow;
                                    var k = this._counters[e + h];
                                    if (k < j.min || k > j.max) {
                                        return false;
                                    }
                                    f >>= 1;
                                }
                                e += 8;
                            }
                            return true;
                        }
                    },
                    {
                        key: "decode",
                        value: function a(b, c) {
                            this._counters = this._fillCounters();
                            c = this._findStart();
                            if (!c) {
                                return null;
                            }
                            var d = c.startCounter;
                            var e = [];
                            var f;
                            do {
                                f = this._toPattern(d);
                                if (f < 0) {
                                    return null;
                                }
                                var g = this._patternToChar(f);
                                if (g === null) {
                                    return null;
                                }
                                e.push(g);
                                d += 8;
                                if (e.length > 1 && this._isStartEnd(f)) {
                                    break;
                                }
                            }while (d < this._counters.length)
                            if (e.length - 2 < ar || !this._isStartEnd(f)) {
                                return null;
                            }
                            if (!this._verifyWhitespace(c.startCounter, d - 8)) {
                                return null;
                            }
                            if (!this._validateResult(e, c.startCounter)) {
                                return null;
                            }
                            d = d > this._counters.length ? this._counters.length : d;
                            var h = c.start + this._sumCounters(c.startCounter, d - 8);
                            return {
                                code: e.join(""),
                                start: c.start,
                                end: h,
                                startInfo: c,
                                decodedCodes: e,
                                format: this.FORMAT
                            };
                        }
                    }, 
                ]);
                return c;
            })(F);
            var av = au;
            function aw(a) {
                var b = ax();
                return function c() {
                    var d = z()(a), e;
                    if (b) {
                        var f = z()(this).constructor;
                        e = Reflect.construct(d, arguments, f);
                    } else {
                        e = d.apply(this, arguments);
                    }
                    return x()(this, e);
                };
            }
            function ax() {
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
            var ay = (function(a) {
                v()(c, a);
                var b = aw(c);
                function c() {
                    var a;
                    p()(this, c);
                    for(var d = arguments.length, e = new Array(d), f = 0; f < d; f++){
                        e[f] = arguments[f];
                    }
                    a = b.call.apply(b, [
                        this
                    ].concat(e));
                    B()(t()(a), "FORMAT", "upc_a");
                    return a;
                }
                r()(c, [
                    {
                        key: "decode",
                        value: function a(b, c) {
                            var d = W.prototype.decode.call(this);
                            if (d && d.code && d.code.length === 13 && d.code.charAt(0) === "0") {
                                d.code = d.code.substring(1);
                                return d;
                            }
                            return null;
                        }
                    }, 
                ]);
                return c;
            })(W);
            var az = ay;
            function aA(a) {
                var b = aB();
                return function c() {
                    var d = z()(a), e;
                    if (b) {
                        var f = z()(this).constructor;
                        e = Reflect.construct(d, arguments, f);
                    } else {
                        e = d.apply(this, arguments);
                    }
                    return x()(this, e);
                };
            }
            function aB() {
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
            var aC = (function(a) {
                v()(c, a);
                var b = aA(c);
                function c() {
                    var a;
                    p()(this, c);
                    for(var d = arguments.length, e = new Array(d), f = 0; f < d; f++){
                        e[f] = arguments[f];
                    }
                    a = b.call.apply(b, [
                        this
                    ].concat(e));
                    B()(t()(a), "FORMAT", "ean_8");
                    return a;
                }
                r()(c, [
                    {
                        key: "_decodePayload",
                        value: function a(b, c, d) {
                            var e = b;
                            for(var f = 0; f < 4; f++){
                                e = this._decodeCode(e.end, O);
                                if (!e) {
                                    return null;
                                }
                                c.push(e.code);
                                d.push(e);
                            }
                            e = this._findPattern(Q, e.end, true, false);
                            if (e === null) {
                                return null;
                            }
                            d.push(e);
                            for(var g = 0; g < 4; g++){
                                e = this._decodeCode(e.end, O);
                                if (!e) {
                                    return null;
                                }
                                d.push(e);
                                c.push(e.code);
                            }
                            return e;
                        }
                    }, 
                ]);
                return c;
            })(W);
            var aD = aC;
            function aE(a) {
                var b = aF();
                return function c() {
                    var d = z()(a), e;
                    if (b) {
                        var f = z()(this).constructor;
                        e = Reflect.construct(d, arguments, f);
                    } else {
                        e = d.apply(this, arguments);
                    }
                    return x()(this, e);
                };
            }
            function aF() {
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
            var aG = (function(a) {
                v()(c, a);
                var b = aE(c);
                function c() {
                    var a;
                    p()(this, c);
                    for(var d = arguments.length, e = new Array(d), f = 0; f < d; f++){
                        e[f] = arguments[f];
                    }
                    a = b.call.apply(b, [
                        this
                    ].concat(e));
                    B()(t()(a), "FORMAT", "ean_2");
                    return a;
                }
                r()(c, [
                    {
                        key: "decode",
                        value: function a(b, c) {
                            if (b) {
                                this._row = b;
                            }
                            var d = 0;
                            var e = c;
                            var f = this._row.length;
                            var g = [];
                            var h = [];
                            var i = null;
                            if (e === undefined) {
                                return null;
                            }
                            for(var j = 0; j < 2 && e < f; j++){
                                i = this._decodeCode(e);
                                if (!i) {
                                    return null;
                                }
                                h.push(i);
                                g.push(i.code % 10);
                                if (i.code >= O) {
                                    d |= 1 << (1 - j);
                                }
                                if (j !== 1) {
                                    e = this._nextSet(this._row, i.end);
                                    e = this._nextUnset(this._row, e);
                                }
                            }
                            if (g.length !== 2 || parseInt(g.join("")) % 4 !== d) {
                                return null;
                            }
                            var k = this._findStart();
                            return {
                                code: g.join(""),
                                decodedCodes: h,
                                end: i.end,
                                format: this.FORMAT,
                                startInfo: k,
                                start: k.start
                            };
                        }
                    }, 
                ]);
                return c;
            })(W);
            var aH = aG;
            function aI(a) {
                var b = aJ();
                return function c() {
                    var d = z()(a), e;
                    if (b) {
                        var f = z()(this).constructor;
                        e = Reflect.construct(d, arguments, f);
                    } else {
                        e = d.apply(this, arguments);
                    }
                    return x()(this, e);
                };
            }
            function aJ() {
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
            var aK = [
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
            function aL(a) {
                for(var b = 0; b < 10; b++){
                    if (a === aK[b]) {
                        return b;
                    }
                }
                return null;
            }
            function aM(a) {
                var b = a.length;
                var c = 0;
                for(var d = b - 2; d >= 0; d -= 2){
                    c += a[d];
                }
                c *= 3;
                for(var e = b - 1; e >= 0; e -= 2){
                    c += a[e];
                }
                c *= 3;
                return c % 10;
            }
            var aN = (function(a) {
                v()(c, a);
                var b = aI(c);
                function c() {
                    var a;
                    p()(this, c);
                    for(var d = arguments.length, e = new Array(d), f = 0; f < d; f++){
                        e[f] = arguments[f];
                    }
                    a = b.call.apply(b, [
                        this
                    ].concat(e));
                    B()(t()(a), "FORMAT", "ean_5");
                    return a;
                }
                r()(c, [
                    {
                        key: "decode",
                        value: function a(b, c) {
                            if (c === undefined) {
                                return null;
                            }
                            if (b) {
                                this._row = b;
                            }
                            var d = 0;
                            var e = c;
                            var f = this._row.length;
                            var g = null;
                            var h = [];
                            var i = [];
                            for(var j = 0; j < 5 && e < f; j++){
                                g = this._decodeCode(e);
                                if (!g) {
                                    return null;
                                }
                                i.push(g);
                                h.push(g.code % 10);
                                if (g.code >= O) {
                                    d |= 1 << (4 - j);
                                }
                                if (j !== 4) {
                                    e = this._nextSet(this._row, g.end);
                                    e = this._nextUnset(this._row, e);
                                }
                            }
                            if (h.length !== 5) {
                                return null;
                            }
                            if (aM(h) !== aL(d)) {
                                return null;
                            }
                            var k = this._findStart();
                            return {
                                code: h.join(""),
                                decodedCodes: i,
                                end: g.end,
                                format: this.FORMAT,
                                startInfo: k,
                                start: k.start
                            };
                        }
                    }, 
                ]);
                return c;
            })(W);
            var aO = aN;
            function aP(a, b) {
                var c = Object.keys(a);
                if (Object.getOwnPropertySymbols) {
                    var d = Object.getOwnPropertySymbols(a);
                    if (b) {
                        d = d.filter(function(b) {
                            return Object.getOwnPropertyDescriptor(a, b).enumerable;
                        });
                    }
                    c.push.apply(c, d);
                }
                return c;
            }
            function aQ(a) {
                for(var b = 1; b < arguments.length; b++){
                    var c = arguments[b] != null ? arguments[b] : {};
                    if (b % 2) {
                        aP(Object(c), true).forEach(function(b) {
                            B()(a, b, c[b]);
                        });
                    } else if (Object.getOwnPropertyDescriptors) {
                        Object.defineProperties(a, Object.getOwnPropertyDescriptors(c));
                    } else {
                        aP(Object(c)).forEach(function(b) {
                            Object.defineProperty(a, b, Object.getOwnPropertyDescriptor(c, b));
                        });
                    }
                }
                return a;
            }
            function aR(a) {
                var b = aS();
                return function c() {
                    var d = z()(a), e;
                    if (b) {
                        var f = z()(this).constructor;
                        e = Reflect.construct(d, arguments, f);
                    } else {
                        e = d.apply(this, arguments);
                    }
                    return x()(this, e);
                };
            }
            function aS() {
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
            var aT = (function(a) {
                v()(c, a);
                var b = aR(c);
                function c() {
                    var a;
                    p()(this, c);
                    for(var d = arguments.length, e = new Array(d), f = 0; f < d; f++){
                        e[f] = arguments[f];
                    }
                    a = b.call.apply(b, [
                        this
                    ].concat(e));
                    B()(t()(a), "CODE_FREQUENCY", [
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
                    B()(t()(a), "STOP_PATTERN", [
                        (1 / 6) * 7,
                        (1 / 6) * 7,
                        (1 / 6) * 7,
                        (1 / 6) * 7,
                        (1 / 6) * 7,
                        (1 / 6) * 7, 
                    ]);
                    B()(t()(a), "FORMAT", "upc_e");
                    return a;
                }
                r()(c, [
                    {
                        key: "_decodePayload",
                        value: function a(b, c, d) {
                            var e = aQ({}, b);
                            var f = 0x0;
                            for(var g = 0; g < 6; g++){
                                e = this._decodeCode(e.end);
                                if (!e) {
                                    return null;
                                }
                                if (e.code >= O) {
                                    e.code = e.code - O;
                                    f |= 1 << (5 - g);
                                }
                                c.push(e.code);
                                d.push(e);
                            }
                            if (!this._determineParity(f, c)) {
                                return null;
                            }
                            return e;
                        }
                    },
                    {
                        key: "_determineParity",
                        value: function a(b, c) {
                            for(var d = 0; d < this.CODE_FREQUENCY.length; d++){
                                for(var e = 0; e < this.CODE_FREQUENCY[d].length; e++){
                                    if (b === this.CODE_FREQUENCY[d][e]) {
                                        c.unshift(d);
                                        c.push(e);
                                        return true;
                                    }
                                }
                            }
                            return false;
                        }
                    },
                    {
                        key: "_convertToUPCA",
                        value: function a(b) {
                            var c = [
                                b[0]
                            ];
                            var d = b[b.length - 2];
                            if (d <= 2) {
                                c = c.concat(b.slice(1, 3)).concat([
                                    d,
                                    0,
                                    0,
                                    0,
                                    0
                                ]).concat(b.slice(3, 6));
                            } else if (d === 3) {
                                c = c.concat(b.slice(1, 4)).concat([
                                    0,
                                    0,
                                    0,
                                    0,
                                    0
                                ]).concat(b.slice(4, 6));
                            } else if (d === 4) {
                                c = c.concat(b.slice(1, 5)).concat([
                                    0,
                                    0,
                                    0,
                                    0,
                                    0,
                                    b[5]
                                ]);
                            } else {
                                c = c.concat(b.slice(1, 6)).concat([
                                    0,
                                    0,
                                    0,
                                    0,
                                    d
                                ]);
                            }
                            c.push(b[b.length - 1]);
                            return c;
                        }
                    },
                    {
                        key: "_checksum",
                        value: function a(b) {
                            return ag()(z()(c.prototype), "_checksum", this).call(this, this._convertToUPCA(b));
                        }
                    },
                    {
                        key: "_findEnd",
                        value: function a(b, d) {
                            return ag()(z()(c.prototype), "_findEnd", this).call(this, b, true);
                        }
                    },
                    {
                        key: "_verifyTrailingWhitespace",
                        value: function a(b) {
                            var c = b.end + (b.end - b.start) / 2;
                            if (c < this._row.length) {
                                if (this._matchRange(b.end, c, 0)) {
                                    return b;
                                }
                            }
                            return null;
                        }
                    }, 
                ]);
                return c;
            })(W);
            var aU = aT;
            function aV(a) {
                var b = aW();
                return function c() {
                    var d = z()(a), e;
                    if (b) {
                        var f = z()(this).constructor;
                        e = Reflect.construct(d, arguments, f);
                    } else {
                        e = d.apply(this, arguments);
                    }
                    return x()(this, e);
                };
            }
            function aW() {
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
            var aX = 1;
            var aY = 3;
            var aZ = (function(a) {
                v()(c, a);
                var b = aV(c);
                function c(a) {
                    var d;
                    p()(this, c);
                    d = b.call(this, h()({
                        normalizeBarSpaceWidth: false
                    }, a));
                    B()(t()(d), "barSpaceRatio", [
                        1,
                        1
                    ]);
                    B()(t()(d), "SINGLE_CODE_ERROR", 0.78);
                    B()(t()(d), "AVG_CODE_ERROR", 0.38);
                    B()(t()(d), "START_PATTERN", [
                        aX,
                        aX,
                        aX,
                        aX
                    ]);
                    B()(t()(d), "STOP_PATTERN", [
                        aX,
                        aX,
                        aY
                    ]);
                    B()(t()(d), "CODE_PATTERN", [
                        [
                            aX,
                            aX,
                            aY,
                            aY,
                            aX
                        ],
                        [
                            aY,
                            aX,
                            aX,
                            aX,
                            aY
                        ],
                        [
                            aX,
                            aY,
                            aX,
                            aX,
                            aY
                        ],
                        [
                            aY,
                            aY,
                            aX,
                            aX,
                            aX
                        ],
                        [
                            aX,
                            aX,
                            aY,
                            aX,
                            aY
                        ],
                        [
                            aY,
                            aX,
                            aY,
                            aX,
                            aX
                        ],
                        [
                            aX,
                            aY,
                            aY,
                            aX,
                            aX
                        ],
                        [
                            aX,
                            aX,
                            aX,
                            aY,
                            aY
                        ],
                        [
                            aY,
                            aX,
                            aX,
                            aY,
                            aX
                        ],
                        [
                            aX,
                            aY,
                            aX,
                            aY,
                            aX
                        ], 
                    ]);
                    B()(t()(d), "MAX_CORRECTION_FACTOR", 5);
                    B()(t()(d), "FORMAT", "i2of5");
                    if (a.normalizeBarSpaceWidth) {
                        d.SINGLE_CODE_ERROR = 0.38;
                        d.AVG_CODE_ERROR = 0.09;
                    }
                    d.config = a;
                    return x()(d, t()(d));
                }
                r()(c, [
                    {
                        key: "_matchPattern",
                        value: function a(b, d) {
                            if (this.config.normalizeBarSpaceWidth) {
                                var e = [
                                    0,
                                    0
                                ];
                                var f = [
                                    0,
                                    0
                                ];
                                var g = [
                                    0,
                                    0
                                ];
                                var h = this.MAX_CORRECTION_FACTOR;
                                var i = 1 / h;
                                for(var j = 0; j < b.length; j++){
                                    e[j % 2] += b[j];
                                    f[j % 2] += d[j];
                                }
                                g[0] = f[0] / e[0];
                                g[1] = f[1] / e[1];
                                g[0] = Math.max(Math.min(g[0], h), i);
                                g[1] = Math.max(Math.min(g[1], h), i);
                                this.barSpaceRatio = g;
                                for(var k = 0; k < b.length; k++){
                                    b[k] *= this.barSpaceRatio[k % 2];
                                }
                            }
                            return ag()(z()(c.prototype), "_matchPattern", this).call(this, b, d);
                        }
                    },
                    {
                        key: "_findPattern",
                        value: function a(b, c) {
                            var d = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
                            var e = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
                            var f = new Array(b.length).fill(0);
                            var g = 0;
                            var h = {
                                error: Number.MAX_VALUE,
                                start: 0,
                                end: 0
                            };
                            var i = this.AVG_CODE_ERROR;
                            d = d || false;
                            e = e || false;
                            if (!c) {
                                c = this._nextSet(this._row);
                            }
                            for(var j = c; j < this._row.length; j++){
                                if (this._row[j] ^ (d ? 1 : 0)) {
                                    f[g]++;
                                } else {
                                    if (g === f.length - 1) {
                                        var k = f.reduce(function(a, b) {
                                            return a + b;
                                        }, 0);
                                        var l = this._matchPattern(f, b);
                                        if (l < i) {
                                            h.error = l;
                                            h.start = j - k;
                                            h.end = j;
                                            return h;
                                        }
                                        if (e) {
                                            for(var m = 0; m < f.length - 2; m++){
                                                f[m] = f[m + 2];
                                            }
                                            f[f.length - 2] = 0;
                                            f[f.length - 1] = 0;
                                            g--;
                                        } else {
                                            return null;
                                        }
                                    } else {
                                        g++;
                                    }
                                    f[g] = 1;
                                    d = !d;
                                }
                            }
                            return null;
                        }
                    },
                    {
                        key: "_findStart",
                        value: function a() {
                            var b = 0;
                            var c = this._nextSet(this._row);
                            var d = null;
                            var e = 1;
                            while(!d){
                                d = this._findPattern(this.START_PATTERN, c, false, true);
                                if (!d) {
                                    return null;
                                }
                                e = Math.floor((d.end - d.start) / 4);
                                b = d.start - e * 10;
                                if (b >= 0) {
                                    if (this._matchRange(b, d.start, 0)) {
                                        return d;
                                    }
                                }
                                c = d.end;
                                d = null;
                            }
                            return null;
                        }
                    },
                    {
                        key: "_verifyTrailingWhitespace",
                        value: function a(b) {
                            var c = b.end + (b.end - b.start) / 2;
                            if (c < this._row.length) {
                                if (this._matchRange(b.end, c, 0)) {
                                    return b;
                                }
                            }
                            return null;
                        }
                    },
                    {
                        key: "_findEnd",
                        value: function a() {
                            this._row.reverse();
                            var b = this._findPattern(this.STOP_PATTERN);
                            this._row.reverse();
                            if (b === null) {
                                return null;
                            }
                            var c = b.start;
                            b.start = this._row.length - b.end;
                            b.end = this._row.length - c;
                            return b !== null ? this._verifyTrailingWhitespace(b) : null;
                        }
                    },
                    {
                        key: "_decodePair",
                        value: function a(b) {
                            var c = [];
                            for(var d = 0; d < b.length; d++){
                                var e = this._decodeCode(b[d]);
                                if (!e) {
                                    return null;
                                }
                                c.push(e);
                            }
                            return c;
                        }
                    },
                    {
                        key: "_decodeCode",
                        value: function a(b) {
                            var c = this.AVG_CODE_ERROR;
                            var d = {
                                error: Number.MAX_VALUE,
                                code: -1,
                                start: 0,
                                end: 0
                            };
                            for(var e = 0; e < this.CODE_PATTERN.length; e++){
                                var f = this._matchPattern(b, this.CODE_PATTERN[e]);
                                if (f < d.error) {
                                    d.code = e;
                                    d.error = f;
                                }
                            }
                            if (d.error < c) {
                                return d;
                            }
                            return null;
                        }
                    },
                    {
                        key: "_decodePayload",
                        value: function a(b, c, d) {
                            var e = 0;
                            var f = b.length;
                            var g = [
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
                            var h = null;
                            while(e < f){
                                for(var i = 0; i < 5; i++){
                                    g[0][i] = b[e] * this.barSpaceRatio[0];
                                    g[1][i] = b[e + 1] * this.barSpaceRatio[1];
                                    e += 2;
                                }
                                h = this._decodePair(g);
                                if (!h) {
                                    return null;
                                }
                                for(var j = 0; j < h.length; j++){
                                    c.push(h[j].code + "");
                                    d.push(h[j]);
                                }
                            }
                            return h;
                        }
                    },
                    {
                        key: "_verifyCounterLength",
                        value: function a(b) {
                            return b.length % 10 === 0;
                        }
                    },
                    {
                        key: "decode",
                        value: function a(b, c) {
                            var d = new Array();
                            var e = new Array();
                            var f = this._findStart();
                            if (!f) {
                                return null;
                            }
                            e.push(f);
                            var g = this._findEnd();
                            if (!g) {
                                return null;
                            }
                            var h = this._fillCounters(f.end, g.start, false);
                            if (!this._verifyCounterLength(h)) {
                                return null;
                            }
                            var i = this._decodePayload(h, d, e);
                            if (!i) {
                                return null;
                            }
                            if (d.length % 2 !== 0 || d.length < 6) {
                                return null;
                            }
                            e.push(g);
                            return {
                                code: d.join(""),
                                start: f.start,
                                end: g.end,
                                startInfo: f,
                                decodedCodes: e,
                                format: this.FORMAT
                            };
                        }
                    }, 
                ]);
                return c;
            })(F);
            var a$ = aZ;
            function a_(a) {
                var b = a0();
                return function c() {
                    var d = z()(a), e;
                    if (b) {
                        var f = z()(this).constructor;
                        e = Reflect.construct(d, arguments, f);
                    } else {
                        e = d.apply(this, arguments);
                    }
                    return x()(this, e);
                };
            }
            function a0() {
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
            var a1 = 1;
            var a2 = 3;
            var a3 = [
                a2,
                a1,
                a2,
                a1,
                a1,
                a1, 
            ];
            var a4 = [
                a2,
                a1,
                a1,
                a1,
                a2, 
            ];
            var a5 = [
                [
                    a1,
                    a1,
                    a2,
                    a2,
                    a1, 
                ],
                [
                    a2,
                    a1,
                    a1,
                    a1,
                    a2, 
                ],
                [
                    a1,
                    a2,
                    a1,
                    a1,
                    a2, 
                ],
                [
                    a2,
                    a2,
                    a1,
                    a1,
                    a1, 
                ],
                [
                    a1,
                    a1,
                    a2,
                    a1,
                    a2, 
                ],
                [
                    a2,
                    a1,
                    a2,
                    a1,
                    a1, 
                ],
                [
                    a1,
                    a2,
                    a2,
                    a1,
                    a1, 
                ],
                [
                    a1,
                    a1,
                    a1,
                    a2,
                    a2, 
                ],
                [
                    a2,
                    a1,
                    a1,
                    a2,
                    a1, 
                ],
                [
                    a1,
                    a2,
                    a1,
                    a2,
                    a1, 
                ], 
            ];
            var a6 = a3.reduce(function(a, b) {
                return a + b;
            }, 0);
            var a7 = (function(a) {
                v()(c, a);
                var b = a_(c);
                function c() {
                    var a;
                    p()(this, c);
                    for(var d = arguments.length, e = new Array(d), f = 0; f < d; f++){
                        e[f] = arguments[f];
                    }
                    a = b.call.apply(b, [
                        this
                    ].concat(e));
                    B()(t()(a), "barSpaceRatio", [
                        1,
                        1
                    ]);
                    B()(t()(a), "FORMAT", "2of5");
                    B()(t()(a), "SINGLE_CODE_ERROR", 0.78);
                    B()(t()(a), "AVG_CODE_ERROR", 0.3);
                    return a;
                }
                r()(c, [
                    {
                        key: "_findPattern",
                        value: function a(b, c) {
                            var d = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
                            var e = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
                            var f = [];
                            var g = 0;
                            var h = {
                                error: Number.MAX_VALUE,
                                code: -1,
                                start: 0,
                                end: 0
                            };
                            var i = 0;
                            var j = 0;
                            var k = this.AVG_CODE_ERROR;
                            if (!c) {
                                c = this._nextSet(this._row);
                            }
                            for(var l = 0; l < b.length; l++){
                                f[l] = 0;
                            }
                            for(var m = c; m < this._row.length; m++){
                                if (this._row[m] ^ (d ? 1 : 0)) {
                                    f[g]++;
                                } else {
                                    if (g === f.length - 1) {
                                        i = 0;
                                        for(var n = 0; n < f.length; n++){
                                            i += f[n];
                                        }
                                        j = this._matchPattern(f, b);
                                        if (j < k) {
                                            h.error = j;
                                            h.start = m - i;
                                            h.end = m;
                                            return h;
                                        }
                                        if (e) {
                                            for(var o = 0; o < f.length - 2; o++){
                                                f[o] = f[o + 2];
                                            }
                                            f[f.length - 2] = 0;
                                            f[f.length - 1] = 0;
                                            g--;
                                        } else {
                                            return null;
                                        }
                                    } else {
                                        g++;
                                    }
                                    f[g] = 1;
                                    d = !d;
                                }
                            }
                            return null;
                        }
                    },
                    {
                        key: "_findStart",
                        value: function a() {
                            var b = null;
                            var c = this._nextSet(this._row);
                            var d = 1;
                            var e = 0;
                            while(!b){
                                b = this._findPattern(a3, c, false, true);
                                if (!b) {
                                    return null;
                                }
                                d = Math.floor((b.end - b.start) / a6);
                                e = b.start - d * 5;
                                if (e >= 0) {
                                    if (this._matchRange(e, b.start, 0)) {
                                        return b;
                                    }
                                }
                                c = b.end;
                                b = null;
                            }
                            return b;
                        }
                    },
                    {
                        key: "_verifyTrailingWhitespace",
                        value: function a(b) {
                            var c = b.end + (b.end - b.start) / 2;
                            if (c < this._row.length) {
                                if (this._matchRange(b.end, c, 0)) {
                                    return b;
                                }
                            }
                            return null;
                        }
                    },
                    {
                        key: "_findEnd",
                        value: function a() {
                            this._row.reverse();
                            var b = this._nextSet(this._row);
                            var c = this._findPattern(a4, b, false, true);
                            this._row.reverse();
                            if (c === null) {
                                return null;
                            }
                            var d = c.start;
                            c.start = this._row.length - c.end;
                            c.end = this._row.length - d;
                            return c !== null ? this._verifyTrailingWhitespace(c) : null;
                        }
                    },
                    {
                        key: "_verifyCounterLength",
                        value: function a(b) {
                            return b.length % 10 === 0;
                        }
                    },
                    {
                        key: "_decodeCode",
                        value: function a(b) {
                            var c = this.AVG_CODE_ERROR;
                            var d = {
                                error: Number.MAX_VALUE,
                                code: -1,
                                start: 0,
                                end: 0
                            };
                            for(var e = 0; e < a5.length; e++){
                                var f = this._matchPattern(b, a5[e]);
                                if (f < d.error) {
                                    d.code = e;
                                    d.error = f;
                                }
                            }
                            if (d.error < c) {
                                return d;
                            }
                            return null;
                        }
                    },
                    {
                        key: "_decodePayload",
                        value: function a(b, c, d) {
                            var e = 0;
                            var f = b.length;
                            var g = [
                                0,
                                0,
                                0,
                                0,
                                0
                            ];
                            var h = null;
                            while(e < f){
                                for(var i = 0; i < 5; i++){
                                    g[i] = b[e] * this.barSpaceRatio[0];
                                    e += 2;
                                }
                                h = this._decodeCode(g);
                                if (!h) {
                                    return null;
                                }
                                c.push("".concat(h.code));
                                d.push(h);
                            }
                            return h;
                        }
                    },
                    {
                        key: "decode",
                        value: function a(b, c) {
                            var d = this._findStart();
                            if (!d) {
                                return null;
                            }
                            var e = this._findEnd();
                            if (!e) {
                                return null;
                            }
                            var f = this._fillCounters(d.end, e.start, false);
                            if (!this._verifyCounterLength(f)) {
                                return null;
                            }
                            var g = [];
                            g.push(d);
                            var h = [];
                            var i = this._decodePayload(f, h, g);
                            if (!i) {
                                return null;
                            }
                            if (h.length < 5) {
                                return null;
                            }
                            g.push(e);
                            return {
                                code: h.join(""),
                                start: d.start,
                                end: e.end,
                                startInfo: d,
                                decodedCodes: g,
                                format: this.FORMAT
                            };
                        }
                    }, 
                ]);
                return c;
            })(F);
            var a8 = a7;
            function a9(a) {
                var b = ba();
                return function c() {
                    var d = z()(a), e;
                    if (b) {
                        var f = z()(this).constructor;
                        e = Reflect.construct(d, arguments, f);
                    } else {
                        e = d.apply(this, arguments);
                    }
                    return x()(this, e);
                };
            }
            function ba() {
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
            var bb = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. $/+%abcd*";
            var bc = new Uint16Array(Y()(bb).map(function(a) {
                return a.charCodeAt(0);
            }));
            var bd = new Uint16Array([
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
            var be = 0x15e;
            var bf = (function(a) {
                v()(c, a);
                var b = a9(c);
                function c() {
                    var a;
                    p()(this, c);
                    for(var d = arguments.length, e = new Array(d), f = 0; f < d; f++){
                        e[f] = arguments[f];
                    }
                    a = b.call.apply(b, [
                        this
                    ].concat(e));
                    B()(t()(a), "FORMAT", "code_93");
                    return a;
                }
                r()(c, [
                    {
                        key: "_patternToChar",
                        value: function a(b) {
                            for(var c = 0; c < bd.length; c++){
                                if (bd[c] === b) {
                                    return String.fromCharCode(bc[c]);
                                }
                            }
                            return null;
                        }
                    },
                    {
                        key: "_toPattern",
                        value: function a(b) {
                            var c = b.length;
                            var d = b.reduce(function(a, b) {
                                return a + b;
                            }, 0);
                            var e = 0;
                            for(var f = 0; f < c; f++){
                                var g = Math.round((b[f] * 9) / d);
                                if (g < 1 || g > 4) {
                                    return -1;
                                }
                                if ((f & 1) === 0) {
                                    for(var h = 0; h < g; h++){
                                        e = (e << 1) | 1;
                                    }
                                } else {
                                    e <<= g;
                                }
                            }
                            return e;
                        }
                    },
                    {
                        key: "_findStart",
                        value: function a() {
                            var b = this._nextSet(this._row);
                            var c = b;
                            var d = new Uint16Array([
                                0,
                                0,
                                0,
                                0,
                                0,
                                0, 
                            ]);
                            var e = 0;
                            var f = false;
                            for(var g = b; g < this._row.length; g++){
                                if (this._row[g] ^ (f ? 1 : 0)) {
                                    d[e]++;
                                } else {
                                    if (e === d.length - 1) {
                                        if (this._toPattern(d) === be) {
                                            var h = Math.floor(Math.max(0, c - (g - c) / 4));
                                            if (this._matchRange(h, c, 0)) {
                                                return {
                                                    start: c,
                                                    end: g
                                                };
                                            }
                                        }
                                        c += d[0] + d[1];
                                        for(var i = 0; i < 4; i++){
                                            d[i] = d[i + 2];
                                        }
                                        d[4] = 0;
                                        d[5] = 0;
                                        e--;
                                    } else {
                                        e++;
                                    }
                                    d[e] = 1;
                                    f = !f;
                                }
                            }
                            return null;
                        }
                    },
                    {
                        key: "_verifyEnd",
                        value: function a(b, c) {
                            if (b === c || !this._row[c]) {
                                return false;
                            }
                            return true;
                        }
                    },
                    {
                        key: "_decodeExtended",
                        value: function a(b) {
                            var c = b.length;
                            var d = [];
                            for(var e = 0; e < c; e++){
                                var f = b[e];
                                if (f >= "a" && f <= "d") {
                                    if (e > c - 2) {
                                        return null;
                                    }
                                    var g = b[++e];
                                    var h = g.charCodeAt(0);
                                    var i = void 0;
                                    switch(f){
                                        case "a":
                                            if (g >= "A" && g <= "Z") {
                                                i = String.fromCharCode(h - 64);
                                            } else {
                                                return null;
                                            }
                                            break;
                                        case "b":
                                            if (g >= "A" && g <= "E") {
                                                i = String.fromCharCode(h - 38);
                                            } else if (g >= "F" && g <= "J") {
                                                i = String.fromCharCode(h - 11);
                                            } else if (g >= "K" && g <= "O") {
                                                i = String.fromCharCode(h + 16);
                                            } else if (g >= "P" && g <= "S") {
                                                i = String.fromCharCode(h + 43);
                                            } else if (g >= "T" && g <= "Z") {
                                                i = String.fromCharCode(127);
                                            } else {
                                                return null;
                                            }
                                            break;
                                        case "c":
                                            if (g >= "A" && g <= "O") {
                                                i = String.fromCharCode(h - 32);
                                            } else if (g === "Z") {
                                                i = ":";
                                            } else {
                                                return null;
                                            }
                                            break;
                                        case "d":
                                            if (g >= "A" && g <= "Z") {
                                                i = String.fromCharCode(h + 32);
                                            } else {
                                                return null;
                                            }
                                            break;
                                        default:
                                            console.warn("* code_93_reader _decodeExtended hit default case, this may be an error", i);
                                            return null;
                                    }
                                    d.push(i);
                                } else {
                                    d.push(f);
                                }
                            }
                            return d;
                        }
                    },
                    {
                        key: "_matchCheckChar",
                        value: function a(b, c, d) {
                            var e = b.slice(0, c);
                            var f = e.length;
                            var g = e.reduce(function(a, b, c) {
                                var e = ((c * -1 + (f - 1)) % d) + 1;
                                var g = bc.indexOf(b.charCodeAt(0));
                                return a + e * g;
                            }, 0);
                            var h = bc[g % 47];
                            return (h === b[c].charCodeAt(0));
                        }
                    },
                    {
                        key: "_verifyChecksums",
                        value: function a(b) {
                            return (this._matchCheckChar(b, b.length - 2, 20) && this._matchCheckChar(b, b.length - 1, 15));
                        }
                    },
                    {
                        key: "decode",
                        value: function a(b, c) {
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
                            var e = [];
                            var f = this._nextSet(this._row, c.end);
                            var g;
                            var h;
                            do {
                                d = this._toCounters(f, d);
                                var i = this._toPattern(d);
                                if (i < 0) {
                                    return null;
                                }
                                h = this._patternToChar(i);
                                if (h === null) {
                                    return null;
                                }
                                e.push(h);
                                g = f;
                                f += C["a"].sum(d);
                                f = this._nextSet(this._row, f);
                            }while (h !== "*")
                            e.pop();
                            if (!e.length) {
                                return null;
                            }
                            if (!this._verifyEnd(g, f)) {
                                return null;
                            }
                            if (!this._verifyChecksums(e)) {
                                return null;
                            }
                            e = e.slice(0, e.length - 2);
                            if ((e = this._decodeExtended(e)) === null) {
                                return null;
                            }
                            return {
                                code: e.join(""),
                                start: c.start,
                                end: f,
                                startInfo: c,
                                decodedCodes: e,
                                format: this.FORMAT
                            };
                        }
                    }, 
                ]);
                return c;
            })(F);
            var bg = bf;
            function bh(a) {
                var b = bi();
                return function c() {
                    var d = z()(a), e;
                    if (b) {
                        var f = z()(this).constructor;
                        e = Reflect.construct(d, arguments, f);
                    } else {
                        e = d.apply(this, arguments);
                    }
                    return x()(this, e);
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
            var bj = {
                AEIO: /[AEIO]/g,
                AZ09: /[A-Z0-9]/
            };
            var bk = "0123456789BCDFGHJKLMNPQRSTUVWXYZ";
            var bl = (function(a) {
                v()(c, a);
                var b = bh(c);
                function c() {
                    var a;
                    p()(this, c);
                    for(var d = arguments.length, e = new Array(d), f = 0; f < d; f++){
                        e[f] = arguments[f];
                    }
                    a = b.call.apply(b, [
                        this
                    ].concat(e));
                    B()(t()(a), "FORMAT", "code_32_reader");
                    return a;
                }
                r()(c, [
                    {
                        key: "_decodeCode32",
                        value: function a(b) {
                            if (/[^0-9BCDFGHJKLMNPQRSTUVWXYZ]/.test(b)) {
                                return null;
                            }
                            var c = 0;
                            for(var d = 0; d < b.length; d++){
                                c = c * 32 + bk.indexOf(b[d]);
                            }
                            var e = "" + c;
                            if (e.length < 9) {
                                e = ("000000000" + e).slice(-9);
                            }
                            return "A" + e;
                        }
                    },
                    {
                        key: "_checkChecksum",
                        value: function a(b) {
                            return !!b;
                        }
                    },
                    {
                        key: "decode",
                        value: function a(b, d) {
                            var e = ag()(z()(c.prototype), "decode", this).call(this, b, d);
                            if (!e) {
                                return null;
                            }
                            var f = e.code;
                            if (!f) {
                                return null;
                            }
                            f = f.replace(bj.AEIO, "");
                            if (!this._checkChecksum(f)) {
                                return null;
                            }
                            var g = this._decodeCode32(f);
                            if (!g) {
                                return null;
                            }
                            e.code = g;
                            return e;
                        }
                    }, 
                ]);
                return c;
            })(ae);
            var bm = bl;
            var bn = {
                code_128_reader: J,
                ean_reader: W,
                ean_5_reader: aO,
                ean_2_reader: aH,
                ean_8_reader: aD,
                code_39_reader: ae,
                code_39_vin_reader: al,
                codabar_reader: av,
                upc_reader: az,
                upc_e_reader: aU,
                i2of5_reader: a$,
                "2of5_reader": a8,
                code_93_reader: bg,
                code_32_reader: bm
            };
            var bo = {
                registerReader: function a(b, c) {
                    bn[b] = c;
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
                    g();
                    h();
                    i();
                    function g() {
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
                    function h() {
                        b.readers.forEach(function(a) {
                            var b;
                            var c = {};
                            var d = [];
                            if (f()(a) === "object") {
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
                                    return new bn[a]();
                                });
                            }
                            try {
                                var g = new bn[b](c, d);
                                e.push(g);
                            } catch (h) {
                                console.error("* Error constructing reader ", b, h);
                                throw h;
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
                    function i() {
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
                    function j(a, b, d) {
                        function e(c) {
                            var d = {
                                y: c * Math.sin(b),
                                x: c * Math.cos(b)
                            };
                            a[0].y -= d.y;
                            a[0].x -= d.x;
                            a[1].y += d.y;
                            a[1].x += d.x;
                        }
                        e(d);
                        while(d > 1 && (!c.inImageWithBorder(a[0]) || !c.inImageWithBorder(a[1]))){
                            d -= Math.ceil(d / 2);
                            e(-d);
                        }
                        return a;
                    }
                    function k(a) {
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
                    function l(a) {
                        var f = null;
                        var g;
                        var h = m.getBarcodeLine(c, a[0], a[1]);
                        if (true && b.debug.showFrequency) {
                            n["a"].drawPath(a, {
                                x: "x",
                                y: "y"
                            }, d.ctx.overlay, {
                                color: "red",
                                lineWidth: 3
                            });
                            m.debug.printFrequency(h.line, d.dom.frequency);
                        }
                        m.toBinaryLine(h);
                        if (true && b.debug.showPattern) {
                            m.debug.printPattern(h.line, d.dom.pattern);
                        }
                        for(g = 0; g < e.length && f === null; g++){
                            f = e[g].decodePattern(h.line);
                        }
                        if (f === null) {
                            return null;
                        }
                        return {
                            codeResult: f,
                            barcodeLine: h
                        };
                    }
                    function o(a, b, c) {
                        var d = Math.sqrt(Math.pow(a[1][0] - a[0][0], 2) + Math.pow(a[1][1] - a[0][1], 2));
                        var e;
                        var f = 16;
                        var g = null;
                        var h;
                        var i;
                        var j = Math.sin(c);
                        var k = Math.cos(c);
                        for(e = 1; e < f && g === null; e++){
                            h = (d / f) * e * (e % 2 === 0 ? -1 : 1);
                            i = {
                                y: h * j,
                                x: h * k
                            };
                            b[0].y += i.x;
                            b[0].x -= i.y;
                            b[1].y += i.x;
                            b[1].x -= i.y;
                            g = l(b);
                        }
                        return g;
                    }
                    function p(a) {
                        return Math.sqrt(Math.pow(Math.abs(a[1].y - a[0].y), 2) + Math.pow(Math.abs(a[1].x - a[0].x), 2));
                    }
                    function q(a) {
                        var b = null;
                        for(var c = 0; c < e.length && b === null; c++){
                            b = e[c].decodeImage ? e[c].decodeImage(a) : null;
                        }
                        return b;
                    }
                    function r(a) {
                        var c;
                        var e = d.ctx.overlay;
                        var f;
                        if (true) {
                            if (b.debug.drawBoundingBox && e) {
                                n["a"].drawPath(a, {
                                    x: 0,
                                    y: 1
                                }, e, {
                                    color: "blue",
                                    lineWidth: 2
                                });
                            }
                        }
                        c = k(a);
                        var g = p(c);
                        var h = Math.atan2(c[1].y - c[0].y, c[1].x - c[0].x);
                        c = j(c, h, Math.floor(g * 0.1));
                        if (c === null) {
                            return null;
                        }
                        f = l(c);
                        if (f === null) {
                            f = o(a, c, h);
                        }
                        if (f === null) {
                            return null;
                        }
                        if (true && f && b.debug.drawScanline && e) {
                            n["a"].drawPath(c, {
                                x: "x",
                                y: "y"
                            }, e, {
                                color: "red",
                                lineWidth: 3
                            });
                        }
                        return {
                            codeResult: f.codeResult,
                            line: c,
                            angle: h,
                            pattern: f.barcodeLine.line,
                            threshold: f.barcodeLine.threshold
                        };
                    }
                    return {
                        decodeFromBoundingBox: function a(b) {
                            return r(b);
                        },
                        decodeFromBoundingBoxes: function a(c) {
                            var d;
                            var e;
                            var f = [];
                            var g = b.multiple;
                            for(d = 0; d < c.length; d++){
                                var h = c[d];
                                e = r(h) || {};
                                e.box = h;
                                if (g) {
                                    f.push(e);
                                } else if (e.codeResult) {
                                    return e;
                                }
                            }
                            if (g) {
                                return {
                                    barcodes: f
                                };
                            }
                        },
                        decodeFromImage: function a(b) {
                            var c = q(b);
                            return c;
                        },
                        registerReader: function a(b, c) {
                            if (bn[b]) {
                                throw new Error("cannot register existing reader", b);
                            }
                            bn[b] = c;
                        },
                        setReaders: function a(c) {
                            b.readers = c;
                            e.length = 0;
                            h();
                        }
                    };
                }
            };
            var bp = (function a() {
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
                function f(a, b, d) {
                    var e;
                    if (typeof b === "function") {
                        e = {
                            callback: b,
                            async: d
                        };
                    } else {
                        e = b;
                        if (!e.callback) {
                            throw new Error("Callback was not specified on options");
                        }
                    }
                    c(a).subscribers.push(e);
                }
                return {
                    subscribe: function a(b, c, d) {
                        return f(b, c, d);
                    },
                    publish: function a(b, d) {
                        var f = c(b);
                        var g = f.subscribers;
                        g.filter(function(a) {
                            return !!a.once;
                        }).forEach(function(a) {
                            e(a, d);
                        });
                        f.subscribers = g.filter(function(a) {
                            return !a.once;
                        });
                        f.subscribers.forEach(function(a) {
                            e(a, d);
                        });
                    },
                    once: function a(b, c) {
                        var d = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
                        f(b, {
                            callback: c,
                            async: d,
                            once: true
                        });
                    },
                    unsubscribe: function a(b, e) {
                        if (b) {
                            var f = c(b);
                            if (f && e) {
                                f.subscribers = f.subscribers.filter(function(a) {
                                    return (a.callback !== e);
                                });
                            } else {
                                f.subscribers = [];
                            }
                        } else {
                            d();
                        }
                    }
                };
            })();
            var bq = c(20);
            var br = c.n(bq);
            var bs = c(12);
            var bt = c.n(bs);
            var bu = c(85);
            var bv = c.n(bu);
            var bw = c(86);
            var bx = c.n(bw);
            function by(a) {
                var b = bz();
                return function c() {
                    var d = z()(a), e;
                    if (b) {
                        var f = z()(this).constructor;
                        e = Reflect.construct(d, arguments, f);
                    } else {
                        e = d.apply(this, arguments);
                    }
                    return x()(this, e);
                };
            }
            function bz() {
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
            var bA = (function(a) {
                v()(c, a);
                var b = by(c);
                function c(a, d) {
                    var e;
                    p()(this, c);
                    e = b.call(this, a);
                    B()(t()(e), "code", void 0);
                    e.code = d;
                    Object.setPrototypeOf(t()(e), c.prototype);
                    return e;
                }
                return c;
            })(bx()(Error));
            var bB = "This may mean that the user has declined camera access, or the browser does not support media APIs. If you are running in iOS, you must use Safari.";
            function bC() {
                try {
                    return navigator.mediaDevices.enumerateDevices();
                } catch (a) {
                    var b = new bA("enumerateDevices is not defined. ".concat(bB), -1);
                    return Promise.reject(b);
                }
            }
            function bD(a) {
                try {
                    return navigator.mediaDevices.getUserMedia(a);
                } catch (b) {
                    var c = new bA("getUserMedia is not defined. ".concat(bB), -1);
                    return Promise.reject(c);
                }
            }
            var bE;
            function bF(a) {
                return new Promise(function(b, c) {
                    var d = 10;
                    function e() {
                        if (d > 0) {
                            if (a.videoWidth > 10 && a.videoHeight > 10) {
                                if (true) {
                                    console.log("* dev: checkVideo found ".concat(a.videoWidth, "px x ").concat(a.videoHeight, "px"));
                                }
                                b();
                            } else {
                                window.setTimeout(e, 500);
                            }
                        } else {
                            c(new bA("Unable to play video stream. Is webcam working?", -1));
                        }
                        d--;
                    }
                    e();
                });
            }
            function bG(a, b) {
                return bH.apply(this, arguments);
            }
            function bH() {
                bH = br()(bt.a.mark(function a(b, c) {
                    var d;
                    return bt.a.wrap(function a(e) {
                        while(1){
                            switch((e.prev = e.next)){
                                case 0:
                                    e.next = 2;
                                    return bD(c);
                                case 2:
                                    d = e.sent;
                                    bE = d;
                                    if (!b) {
                                        e.next = 11;
                                        break;
                                    }
                                    b.setAttribute("autoplay", "true");
                                    b.setAttribute("muted", "true");
                                    b.setAttribute("playsinline", "true");
                                    b.srcObject = d;
                                    b.addEventListener("loadedmetadata", function() {
                                        b.play();
                                    });
                                    return e.abrupt("return", bF(b));
                                case 11:
                                    return e.abrupt("return", Promise.resolve());
                                case 12:
                                case "end":
                                    return e.stop();
                            }
                        }
                    }, a);
                }));
                return bH.apply(this, arguments);
            }
            function bI(a) {
                var b = bv()(a, [
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
            function bJ() {
                var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var b = bI(a);
                if (b && b.deviceId && b.facingMode) {
                    delete b.facingMode;
                }
                return Promise.resolve({
                    audio: false,
                    video: b
                });
            }
            function bK() {
                return bL.apply(this, arguments);
            }
            function bL() {
                bL = br()(bt.a.mark(function a() {
                    var b;
                    return bt.a.wrap(function a(c) {
                        while(1){
                            switch((c.prev = c.next)){
                                case 0:
                                    c.next = 2;
                                    return bC();
                                case 2:
                                    b = c.sent;
                                    return c.abrupt("return", b.filter(function(a) {
                                        return (a.kind === "videoinput");
                                    }));
                                case 4:
                                case "end":
                                    return c.stop();
                            }
                        }
                    }, a);
                }));
                return bL.apply(this, arguments);
            }
            function bM() {
                if (!bE) {
                    return null;
                }
                var a = bE.getVideoTracks();
                return a && a !== null && a !== void 0 && a.length ? a[0] : null;
            }
            var bN = {
                requestedVideoElement: null,
                request: function a(b, c) {
                    return br()(bt.a.mark(function a() {
                        var d;
                        return bt.a.wrap(function a(e) {
                            while(1){
                                switch((e.prev = e.next)){
                                    case 0:
                                        bN.requestedVideoElement = b;
                                        e.next = 3;
                                        return bJ(c);
                                    case 3:
                                        d = e.sent;
                                        return e.abrupt("return", bG(b, d));
                                    case 5:
                                    case "end":
                                        return e.stop();
                                }
                            }
                        }, a);
                    }))();
                },
                release: function a() {
                    var b = bE && bE.getVideoTracks();
                    if (bN.requestedVideoElement !== null) {
                        bN.requestedVideoElement.pause();
                    }
                    return new Promise(function(a) {
                        setTimeout(function() {
                            if (b && b.length) {
                                b[0].stop();
                            }
                            bE = null;
                            bN.requestedVideoElement = null;
                            a();
                        }, 0);
                    });
                },
                enumerateVideoDevices: bK,
                getActiveStreamLabel: function a() {
                    var b = bM();
                    return b ? b.label : "";
                },
                getActiveTrack: bM
            };
            var bO = bN;
            function bP(a, b) {
                return (b && b.some(function(b) {
                    var c = Object.keys(b);
                    return c.every(function(c) {
                        return b[c] === a[c];
                    });
                }));
            }
            function bQ(a, b) {
                return typeof b === "function" ? b(a) : true;
            }
            var bR = {
                create: function a(b) {
                    var c;
                    var d = document.createElement("canvas");
                    var e = d.getContext("2d");
                    var f = [];
                    var g = (c = b.capacity) !== null && c !== void 0 ? c : 20;
                    var h = b.capture === true;
                    function i(a) {
                        return (!!g && a && !bP(a, b.blacklist) && bQ(a, b.filter));
                    }
                    return {
                        addResult: function a(b, c, j) {
                            var k = {};
                            if (i(j)) {
                                g--;
                                k.codeResult = j;
                                if (h) {
                                    d.width = c.x;
                                    d.height = c.y;
                                    n["a"].drawImage(b, c, e);
                                    k.frame = d.toDataURL();
                                }
                                f.push(k);
                            }
                        },
                        getResults: function a() {
                            return f;
                        }
                    };
                }
            };
            var bS = {
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
            var bT = bS;
            var bU = {
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
            var bV = bU;
            var bW = {
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
            var bX = bW;
            var bY = true ? bT : undefined;
            var bZ = bY;
            var b$ = c(7);
            var b_ = function a() {
                p()(this, a);
                B()(this, "config", void 0);
                B()(this, "inputStream", void 0);
                B()(this, "framegrabber", void 0);
                B()(this, "inputImageWrapper", void 0);
                B()(this, "stopped", false);
                B()(this, "boxSize", void 0);
                B()(this, "resultCollector", void 0);
                B()(this, "decoder", void 0);
                B()(this, "workerPool", []);
                B()(this, "onUIThread", true);
                B()(this, "canvasContainer", new b1());
            };
            var b0 = function a() {
                p()(this, a);
                B()(this, "image", void 0);
                B()(this, "overlay", void 0);
            };
            var b1 = function a() {
                p()(this, a);
                B()(this, "ctx", void 0);
                B()(this, "dom", void 0);
                this.ctx = new b0();
                this.dom = new b0();
            };
            var b2 = c(23);
            function b3(a, b, c) {
                var d = b || new j["a"]({
                    x: a.getWidth(),
                    y: a.getHeight(),
                    type: "XYSize"
                });
                if (true) {
                    console.log("image wrapper size ".concat(d.size));
                }
                var e = [
                    Object(b$["clone"])([
                        0,
                        0
                    ]),
                    Object(b$["clone"])([
                        0,
                        d.size.y
                    ]),
                    Object(b$["clone"])([
                        d.size.x,
                        d.size.y, 
                    ]),
                    Object(b$["clone"])([
                        d.size.x,
                        0
                    ]), 
                ];
                b2["a"].init(d, c);
                return {
                    inputImageWrapper: d,
                    boxSize: e
                };
            }
            function b4(a) {
                if (typeof document === "undefined") {
                    return null;
                }
                if (a instanceof HTMLElement && a.nodeName && a.nodeType === 1) {
                    return a;
                }
                var b = typeof a === "string" ? a : "#interactive.viewport";
                return document.querySelector(b);
            }
            function b5(a, b) {
                var c = document.querySelector(a);
                if (!c) {
                    c = document.createElement("canvas");
                    c.className = b;
                }
                return c;
            }
            function b6(a, b) {
                var c = b5(a, b);
                var d = c.getContext("2d");
                return {
                    canvas: c,
                    context: d
                };
            }
            function b7(a) {
                if (typeof document !== "undefined") {
                    var b = b6("canvas.imgBuffer", "imgBuffer");
                    var c = b6("canvas.drawingBuffer", "drawingBuffer");
                    b.canvas.width = c.canvas.width = a.x;
                    b.canvas.height = c.canvas.height = a.y;
                    return {
                        dom: {
                            image: b.canvas,
                            overlay: c.canvas
                        },
                        ctx: {
                            image: b.context,
                            overlay: c.context
                        }
                    };
                }
                return null;
            }
            function b8(a) {
                var b, c, d, e;
                var f = b4(a === null || a === void 0 ? void 0 : (b = a.config) === null || b === void 0 ? void 0 : (c = b.inputStream) === null || c === void 0 ? void 0 : c.target);
                var g = a === null || a === void 0 ? void 0 : (d = a.config) === null || d === void 0 ? void 0 : (e = d.inputStream) === null || e === void 0 ? void 0 : e.type;
                if (!g) return null;
                var h = b7(a.inputStream.getCanvasSize());
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
                var i = h.dom;
                if (typeof document !== "undefined") {
                    if (f) {
                        if (g === "ImageStream" && !f.contains(i.image)) {
                            f.appendChild(i.image);
                        }
                        if (!f.contains(i.overlay)) {
                            f.appendChild(i.overlay);
                        }
                    }
                }
                return h;
            }
            var b9 = {
                0x0112: "orientation"
            };
            var ca = Object.keys(b9).map(function(a) {
                return b9[a];
            });
            function cb(a) {
                var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ca;
                if (/^blob:/i.test(a)) {
                    return ce(a).then(cd).then(function(a) {
                        return cf(a, b);
                    });
                }
                return Promise.resolve(null);
            }
            function cc(a) {
                var b = a.replace(/^data:([^;]+);base64,/gim, "");
                var c = atob(b);
                var d = c.length;
                var e = new ArrayBuffer(d);
                var f = new Uint8Array(e);
                for(var g = 0; g < d; g++){
                    f[g] = c.charCodeAt(g);
                }
                return e;
            }
            function cd(a) {
                return new Promise(function(b) {
                    var c = new FileReader();
                    c.onload = function(a) {
                        return b(a.target.result);
                    };
                    c.readAsArrayBuffer(a);
                });
            }
            function ce(a) {
                return new Promise(function(b, c) {
                    var d = new XMLHttpRequest();
                    d.open("GET", a, true);
                    d.responseType = "blob";
                    d.onreadystatechange = function() {
                        if (d.readyState === XMLHttpRequest.DONE && (d.status === 200 || d.status === 0)) {
                            b(this.response);
                        }
                    };
                    d.onerror = c;
                    d.send();
                });
            }
            function cf(a) {
                var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ca;
                var c = new DataView(a);
                var d = a.byteLength;
                var e = b.reduce(function(a, b) {
                    var c = Object.keys(b9).filter(function(a) {
                        return b9[a] === b;
                    })[0];
                    if (c) {
                        a[c] = b;
                    }
                    return a;
                }, {});
                var f = 2;
                var g;
                if (c.getUint8(0) !== 0xff || c.getUint8(1) !== 0xd8) {
                    return false;
                }
                while(f < d){
                    if (c.getUint8(f) !== 0xff) {
                        return false;
                    }
                    g = c.getUint8(f + 1);
                    if (g === 0xe1) {
                        return cg(c, f + 4, e);
                    }
                    f += 2 + c.getUint16(f + 2);
                }
                return false;
            }
            function cg(a, b, c) {
                if (cj(a, b, 4) !== "Exif") {
                    return false;
                }
                var d = b + 6;
                var e;
                if (a.getUint16(d) === 0x4949) {
                    e = false;
                } else if (a.getUint16(d) === 0x4d4d) {
                    e = true;
                } else {
                    return false;
                }
                if (a.getUint16(d + 2, !e) !== 0x002a) {
                    return false;
                }
                var f = a.getUint32(d + 4, !e);
                if (f < 0x00000008) {
                    return false;
                }
                var g = ch(a, d, d + f, c, e);
                return g;
            }
            function ch(a, b, c, d, e) {
                var f = a.getUint16(c, !e);
                var g = {};
                for(var h = 0; h < f; h++){
                    var i = c + h * 12 + 2;
                    var j = d[a.getUint16(i, !e)];
                    if (j) {
                        g[j] = ci(a, i, b, c, e);
                    }
                }
                return g;
            }
            function ci(a, b, c, d, e) {
                var f = a.getUint16(b + 2, !e);
                var g = a.getUint32(b + 4, !e);
                switch(f){
                    case 3:
                        if (g === 1) {
                            return a.getUint16(b + 8, !e);
                        }
                }
                return null;
            }
            function cj(a, b, c) {
                var d = "";
                for(var e = b; e < b + c; e++){
                    d += String.fromCharCode(a.getUint8(e));
                }
                return d;
            }
            var ck = {};
            ck.load = function(a, b, c, d, e) {
                var f = new Array(d);
                var g = new Array(f.length);
                var h;
                var i;
                var j;
                if (e === false) {
                    f[0] = a;
                } else {
                    for(h = 0; h < f.length; h++){
                        j = c + h;
                        f[h] = "".concat(a, "image-").concat("00".concat(j).slice(-3), ".jpg");
                    }
                }
                g.notLoaded = [];
                g.addImage = function(a) {
                    g.notLoaded.push(a);
                };
                g.loaded = function(c) {
                    var d = g.notLoaded;
                    for(var h = 0; h < d.length; h++){
                        if (d[h] === c) {
                            d.splice(h, 1);
                            for(var i = 0; i < f.length; i++){
                                var j = f[i].substr(f[i].lastIndexOf("/"));
                                if (c.src.lastIndexOf(j) !== -1) {
                                    g[i] = {
                                        img: c
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
                        if (e === false) {
                            cb(a, [
                                "orientation"
                            ]).then(function(a) {
                                g[0].tags = a;
                                b(g);
                            })["catch"](function(a) {
                                console.log(a);
                                b(g);
                            });
                        } else {
                            b(g);
                        }
                    }
                };
                for(h = 0; h < f.length; h++){
                    i = new Image();
                    g.addImage(i);
                    cl(i, g);
                    i.src = f[h];
                }
            };
            function cl(a, b) {
                a.onload = function() {
                    b.loaded(this);
                };
            }
            var cm = ck;
            var cn = {
                createVideoStream: function a(b) {
                    var c = null;
                    var d = [
                        "canrecord",
                        "ended"
                    ];
                    var e = {};
                    var f;
                    var g;
                    var h = {
                        x: 0,
                        y: 0,
                        type: "Point"
                    };
                    var i = {
                        x: 0,
                        y: 0,
                        type: "XYSize"
                    };
                    function j() {
                        var a, d;
                        var e = b.videoWidth;
                        var h = b.videoHeight;
                        f = (a = c) !== null && a !== void 0 && a.size ? e / h > 1 ? c.size : Math.floor((e / h) * c.size) : e;
                        g = (d = c) !== null && d !== void 0 && d.size ? e / h > 1 ? Math.floor((h / e) * c.size) : c.size : h;
                        i.x = f;
                        i.y = g;
                    }
                    var k = {
                        getRealWidth: function a() {
                            return b.videoWidth;
                        },
                        getRealHeight: function a() {
                            return b.videoHeight;
                        },
                        getWidth: function a() {
                            return f;
                        },
                        getHeight: function a() {
                            return g;
                        },
                        setWidth: function a(b) {
                            f = b;
                        },
                        setHeight: function a(b) {
                            g = b;
                        },
                        setInputStream: function a(b) {
                            c = b;
                            this.setAttribute("src", typeof b.src !== "undefined" ? b.src : "");
                        },
                        ended: function a() {
                            return b.ended;
                        },
                        getConfig: function a() {
                            return c;
                        },
                        setAttribute: function a(c, d) {
                            if (b) {
                                b.setAttribute(c, d);
                            }
                        },
                        pause: function a() {
                            b.pause();
                        },
                        play: function a() {
                            b.play();
                        },
                        setCurrentTime: function a(b) {
                            var d;
                            if (((d = c) === null || d === void 0 ? void 0 : d.type) !== "LiveStream") {
                                this.setAttribute("currentTime", b.toString());
                            }
                        },
                        addEventListener: function a(c, f, g) {
                            if (d.indexOf(c) !== -1) {
                                if (!e[c]) {
                                    e[c] = [];
                                }
                                e[c].push(f);
                            } else {
                                b.addEventListener(c, f, g);
                            }
                        },
                        clearEventHandlers: function a() {
                            d.forEach(function(a) {
                                var c = e[a];
                                if (c && c.length > 0) {
                                    c.forEach(function(c) {
                                        b.removeEventListener(a, c);
                                    });
                                }
                            });
                        },
                        trigger: function a(b, c) {
                            var d;
                            var f = e[b];
                            if (b === "canrecord") {
                                j();
                            }
                            if (f && f.length > 0) {
                                for(d = 0; d < f.length; d++){
                                    f[d].apply(k, c);
                                }
                            }
                        },
                        setTopRight: function a(b) {
                            h.x = b.x;
                            h.y = b.y;
                        },
                        getTopRight: function a() {
                            return h;
                        },
                        setCanvasSize: function a(b) {
                            i.x = b.x;
                            i.y = b.y;
                        },
                        getCanvasSize: function a() {
                            return i;
                        },
                        getFrame: function a() {
                            return b;
                        }
                    };
                    return k;
                },
                createLiveStream: function a(b) {
                    if (b) {
                        b.setAttribute("autoplay", "true");
                    }
                    var c = cn.createVideoStream(b);
                    c.ended = function a() {
                        return false;
                    };
                    return c;
                },
                createImageStream: function a() {
                    var b = null;
                    var c = 0;
                    var d = 0;
                    var e = 0;
                    var f = true;
                    var g = false;
                    var h = null;
                    var i = 0;
                    var j = 1;
                    var k = null;
                    var l = false;
                    var m;
                    var n;
                    var o = [
                        "canrecord",
                        "ended"
                    ];
                    var p = {};
                    var q = {
                        x: 0,
                        y: 0,
                        type: "Point"
                    };
                    var r = {
                        x: 0,
                        y: 0,
                        type: "XYSize"
                    };
                    function s() {
                        var a;
                        g = false;
                        cm.load(k, function(a) {
                            var f, i;
                            h = a;
                            if (a[0].tags && a[0].tags.orientation) {
                                switch(a[0].tags.orientation){
                                    case 6:
                                    case 8:
                                        c = a[0].img.height;
                                        d = a[0].img.width;
                                        break;
                                    default:
                                        c = a[0].img.width;
                                        d = a[0].img.height;
                                }
                            } else {
                                c = a[0].img.width;
                                d = a[0].img.height;
                            }
                            m = (f = b) !== null && f !== void 0 && f.size ? c / d > 1 ? b.size : Math.floor((c / d) * b.size) : c;
                            n = (i = b) !== null && i !== void 0 && i.size ? c / d > 1 ? Math.floor((d / c) * b.size) : b.size : d;
                            r.x = m;
                            r.y = n;
                            g = true;
                            e = 0;
                            setTimeout(function() {
                                t("canrecord", []);
                            }, 0);
                        }, j, i, (a = b) === null || a === void 0 ? void 0 : a.sequence);
                    }
                    function t(a, b) {
                        var c;
                        var d = p[a];
                        if (d && d.length > 0) {
                            for(c = 0; c < d.length; c++){
                                d[c].apply(u, b);
                            }
                        }
                    }
                    var u = {
                        trigger: t,
                        getWidth: function a() {
                            return m;
                        },
                        getHeight: function a() {
                            return n;
                        },
                        setWidth: function a(b) {
                            m = b;
                        },
                        setHeight: function a(b) {
                            n = b;
                        },
                        getRealWidth: function a() {
                            return c;
                        },
                        getRealHeight: function a() {
                            return d;
                        },
                        setInputStream: function a(c) {
                            b = c;
                            if (c.sequence === false) {
                                k = c.src;
                                i = 1;
                            } else {
                                k = c.src;
                                i = c.length;
                            }
                            s();
                        },
                        ended: function a() {
                            return l;
                        },
                        setAttribute: function a() {},
                        getConfig: function a() {
                            return b;
                        },
                        pause: function a() {
                            f = true;
                        },
                        play: function a() {
                            f = false;
                        },
                        setCurrentTime: function a(b) {
                            e = b;
                        },
                        addEventListener: function a(b, c) {
                            if (o.indexOf(b) !== -1) {
                                if (!p[b]) {
                                    p[b] = [];
                                }
                                p[b].push(c);
                            }
                        },
                        clearEventHandlers: function a() {
                            Object.keys(p).forEach(function(a) {
                                return delete p[a];
                            });
                        },
                        setTopRight: function a(b) {
                            q.x = b.x;
                            q.y = b.y;
                        },
                        getTopRight: function a() {
                            return q;
                        },
                        setCanvasSize: function a(b) {
                            r.x = b.x;
                            r.y = b.y;
                        },
                        getCanvasSize: function a() {
                            return r;
                        },
                        getFrame: function a() {
                            var b;
                            if (!g) {
                                return null;
                            }
                            if (!f) {
                                var c;
                                b = (c = h) === null || c === void 0 ? void 0 : c[e];
                                if (e < i - 1) {
                                    e++;
                                } else {
                                    setTimeout(function() {
                                        l = true;
                                        t("ended", []);
                                    }, 0);
                                }
                            }
                            return b;
                        }
                    };
                    return u;
                }
            };
            var co = cn;
            var cp = c(8);
            var cq = Math.PI / 180;
            function cr(a, b) {
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
            var cs = {};
            cs.create = function(a, b) {
                var c = {};
                var d = a.getConfig();
                var e = Object(cp["h"])(a.getRealWidth(), a.getRealHeight());
                var f = a.getCanvasSize();
                var g = Object(cp["h"])(a.getWidth(), a.getHeight());
                var h = a.getTopRight();
                var i = h.x;
                var j = h.y;
                var k;
                var l = null;
                var m = null;
                k = b || document.createElement("canvas");
                k.width = f.x;
                k.height = f.y;
                l = k.getContext("2d");
                m = new Uint8Array(g.x * g.y);
                if (true) {
                    console.log("FrameGrabber", JSON.stringify({
                        size: g,
                        topRight: h,
                        videoSize: e,
                        canvasSize: f
                    }));
                }
                c.attachData = function(a) {
                    m = a;
                };
                c.getData = function() {
                    return m;
                };
                c.grab = function() {
                    var b = d.halfSample;
                    var c = a.getFrame();
                    var e = c;
                    var h = 0;
                    var n;
                    if (e) {
                        cr(k, f);
                        if (d.type === "ImageStream") {
                            e = c.img;
                            if (c.tags && c.tags.orientation) {
                                switch(c.tags.orientation){
                                    case 6:
                                        h = 90 * cq;
                                        break;
                                    case 8:
                                        h = -90 * cq;
                                        break;
                                }
                            }
                        }
                        if (h !== 0) {
                            l.translate(f.x / 2, f.y / 2);
                            l.rotate(h);
                            l.drawImage(e, -f.y / 2, -f.x / 2, f.y, f.x);
                            l.rotate(-h);
                            l.translate(-f.x / 2, -f.y / 2);
                        } else {
                            l.drawImage(e, 0, 0, f.x, f.y);
                        }
                        n = l.getImageData(i, j, g.x, g.y).data;
                        if (b) {
                            Object(cp["e"])(n, g, m);
                        } else {
                            Object(cp["c"])(n, m, d);
                        }
                        return true;
                    }
                    return false;
                };
                c.getSize = function() {
                    return g;
                };
                return c;
            };
            var ct = cs;
            function cu(a, b) {
                var c = Object.keys(a);
                if (Object.getOwnPropertySymbols) {
                    var d = Object.getOwnPropertySymbols(a);
                    if (b) {
                        d = d.filter(function(b) {
                            return Object.getOwnPropertyDescriptor(a, b).enumerable;
                        });
                    }
                    c.push.apply(c, d);
                }
                return c;
            }
            function cv(a) {
                for(var b = 1; b < arguments.length; b++){
                    var c = arguments[b] != null ? arguments[b] : {};
                    if (b % 2) {
                        cu(Object(c), true).forEach(function(b) {
                            B()(a, b, c[b]);
                        });
                    } else if (Object.getOwnPropertyDescriptors) {
                        Object.defineProperties(a, Object.getOwnPropertyDescriptors(c));
                    } else {
                        cu(Object(c)).forEach(function(b) {
                            Object.defineProperty(a, b, Object.getOwnPropertyDescriptor(c, b));
                        });
                    }
                }
                return a;
            }
            var cw = [];
            function cx(a) {
                var b;
                if (cw.length) {
                    b = cw.filter(function(a) {
                        return !a.busy;
                    })[0];
                    if (b) {
                        a.attachData(b.imageData);
                        if (a.grab()) {
                            b.busy = true;
                            b.worker.postMessage({
                                cmd: "process",
                                imageData: b.imageData
                            }, [
                                b.imageData.buffer
                            ]);
                        }
                        return true;
                    } else {
                        return false;
                    }
                }
                return null;
            }
            function cy(a) {
                return cv(cv({}, a), {}, {
                    inputStream: cv(cv({}, a.inputStream), {}, {
                        target: null
                    })
                });
            }
            function cz(a) {
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
            function cA() {
                var a, b;
                if (typeof __factorySource__ !== "undefined") {
                    b = __factorySource__;
                }
                a = new Blob([
                    "(" + cz.toString() + ")(" + b + ");", 
                ], {
                    type: "text/javascript"
                });
                return window.URL.createObjectURL(a);
            }
            function cB(a, b, c) {
                var d = cA();
                var e = new Worker(d);
                var f = {
                    worker: e,
                    imageData: new Uint8Array(b.getWidth() * b.getHeight()),
                    busy: true
                };
                f.worker.onmessage = function(a) {
                    if (a.data.event === "initialized") {
                        URL.revokeObjectURL(d);
                        f.busy = false;
                        f.imageData = new Uint8Array(a.data.imageData);
                        if (true) {
                            console.log("Worker initialized");
                        }
                        c(f);
                    } else if (a.data.event === "processed") {
                        f.imageData = new Uint8Array(a.data.imageData);
                        f.busy = false;
                    } else if (a.data.event === "error") {
                        if (true) {
                            console.log("Worker error: " + a.data.message);
                        }
                    }
                };
                f.worker.postMessage({
                    cmd: "init",
                    size: {
                        x: b.getWidth(),
                        y: b.getHeight()
                    },
                    imageData: f.imageData,
                    config: cy(a)
                }, [
                    f.imageData.buffer
                ]);
            }
            function cC(a, b, c, d) {
                var e = a - cw.length;
                if (e === 0 && d) {
                    d();
                } else if (e < 0) {
                    var f = cw.slice(e);
                    f.forEach(function(a) {
                        a.worker.terminate();
                        if (true) {
                            console.log("Worker terminated!");
                        }
                    });
                    cw = cw.slice(0, e);
                    if (d) {
                        d();
                    }
                } else {
                    var g = function b(c) {
                        cw.push(c);
                        if (cw.length >= a && d) {
                            d();
                        }
                    };
                    if (b) {
                        for(var h = 0; h < e; h++){
                            cB(b, c, g);
                        }
                    }
                }
            }
            function cD(a) {
                cw.forEach(function(b) {
                    return b.worker.postMessage({
                        cmd: "setReaders",
                        readers: a
                    });
                });
            }
            function cE(a, b) {
                cw.forEach(function(c) {
                    return c.worker.postMessage({
                        cmd: "registerReader",
                        name: a,
                        reader: b
                    });
                });
            }
            function cF() {
                var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "LiveStream";
                var b = arguments.length > 1 ? arguments[1] : undefined;
                var c = arguments.length > 2 ? arguments[2] : undefined;
                switch(a){
                    case "VideoStream":
                        {
                            var d = document.createElement("video");
                            return {
                                video: d,
                                inputStream: c.createVideoStream(d)
                            };
                        }
                    case "ImageStream":
                        return {
                            inputStream: c.createImageStream()
                        };
                    case "LiveStream":
                        {
                            var e = null;
                            if (b) {
                                e = b.querySelector("video");
                                if (!e) {
                                    e = document.createElement("video");
                                    b.appendChild(e);
                                }
                            }
                            return {
                                video: e,
                                inputStream: c.createLiveStream(e)
                            };
                        }
                    default:
                        console.error("* setupInputStream invalid type ".concat(a));
                        return {
                            video: null,
                            inputStream: null
                        };
                }
            }
            function cG(a, b, c) {
                var d = a.length;
                while(d--){
                    a[d][0] += b;
                    a[d][1] += c;
                }
            }
            function cH(a, b, c) {
                a[0].x += b;
                a[0].y += c;
                a[1].x += b;
                a[1].y += c;
            }
            var cI = (function() {
                function a() {
                    var b = this;
                    p()(this, a);
                    B()(this, "context", new b_());
                    B()(this, "canRecord", function(a) {
                        var c;
                        if (!b.context.config) {
                            return;
                        }
                        b2["a"].checkImageConstraints(b.context.inputStream, (c = b.context.config) === null || c === void 0 ? void 0 : c.locator);
                        b.initCanvas();
                        b.context.framegrabber = ct.create(b.context.inputStream, b.context.canvasContainer.dom.image);
                        if (b.context.config.numOfWorkers === undefined) {
                            b.context.config.numOfWorkers = 0;
                        }
                        cC(b.context.config.numOfWorkers, b.context.config, b.context.inputStream, function() {
                            var c;
                            if (((c = b.context.config) === null || c === void 0 ? void 0 : c.numOfWorkers) === 0) {
                                b.initializeData();
                            }
                            b.ready(a);
                        });
                    });
                    B()(this, "update", function() {
                        if (b.context.onUIThread) {
                            var a = cx(b.context.framegrabber);
                            if (!a) {
                                var c;
                                b.context.framegrabber.attachData((c = b.context.inputImageWrapper) === null || c === void 0 ? void 0 : c.data);
                                if (b.context.framegrabber.grab()) {
                                    if (!a) {
                                        b.locateAndDecode();
                                    }
                                }
                            }
                        } else {
                            var d;
                            b.context.framegrabber.attachData((d = b.context.inputImageWrapper) === null || d === void 0 ? void 0 : d.data);
                            b.context.framegrabber.grab();
                            b.locateAndDecode();
                        }
                    });
                }
                r()(a, [
                    {
                        key: "initBuffers",
                        value: function a(b) {
                            if (!this.context.config) {
                                return;
                            }
                            var c = b3(this.context.inputStream, b, this.context.config.locator), d = c.inputImageWrapper, e = c.boxSize;
                            this.context.inputImageWrapper = d;
                            this.context.boxSize = e;
                        }
                    },
                    {
                        key: "initializeData",
                        value: function a(b) {
                            if (!this.context.config) {
                                return;
                            }
                            this.initBuffers(b);
                            this.context.decoder = bo.create(this.context.config.decoder, this.context.inputImageWrapper);
                        }
                    },
                    {
                        key: "getViewPort",
                        value: function a() {
                            if (!this.context.config || !this.context.config.inputStream) {
                                return null;
                            }
                            var b = this.context.config.inputStream.target;
                            return b4(b);
                        }
                    },
                    {
                        key: "ready",
                        value: function a(b) {
                            this.context.inputStream.play();
                            b();
                        }
                    },
                    {
                        key: "initCanvas",
                        value: function a() {
                            var b = b8(this.context);
                            if (!b) {
                                return;
                            }
                            var c = b.ctx, d = b.dom;
                            this.context.canvasContainer.dom.image = d.image;
                            this.context.canvasContainer.dom.overlay = d.overlay;
                            this.context.canvasContainer.ctx.image = c.image;
                            this.context.canvasContainer.ctx.overlay = c.overlay;
                        }
                    },
                    {
                        key: "initInputStream",
                        value: function a(b) {
                            if (!this.context.config || !this.context.config.inputStream) {
                                return;
                            }
                            var c = this.context.config.inputStream, d = c.type, e = c.constraints;
                            var f = cF(d, this.getViewPort(), co), g = f.video, h = f.inputStream;
                            if (d === "LiveStream" && g) {
                                bO.request(g, e).then(function() {
                                    return h.trigger("canrecord");
                                })["catch"](function(a) {
                                    return b(a);
                                });
                            }
                            h.setAttribute("preload", "auto");
                            h.setInputStream(this.context.config.inputStream);
                            h.addEventListener("canrecord", this.canRecord.bind(undefined, b));
                            this.context.inputStream = h;
                        }
                    },
                    {
                        key: "getBoundingBoxes",
                        value: function a() {
                            var b;
                            return (b = this.context.config) !== null && b !== void 0 && b.locate ? b2["a"].locate() : [
                                [
                                    Object(b$["clone"])(this.context.boxSize[0]),
                                    Object(b$["clone"])(this.context.boxSize[1]),
                                    Object(b$["clone"])(this.context.boxSize[2]),
                                    Object(b$["clone"])(this.context.boxSize[3]), 
                                ], 
                            ];
                        }
                    },
                    {
                        key: "transformResult",
                        value: function a(b) {
                            var c = this;
                            var d = this.context.inputStream.getTopRight();
                            var e = d.x;
                            var f = d.y;
                            if (e === 0 && f === 0) {
                                return;
                            }
                            if (b.barcodes) {
                                b.barcodes.forEach(function(a) {
                                    return c.transformResult(a);
                                });
                            }
                            if (b.line && b.line.length === 2) {
                                cH(b.line, e, f);
                            }
                            if (b.box) {
                                cG(b.box, e, f);
                            }
                            if (b.boxes && b.boxes.length > 0) {
                                for(var g = 0; g < b.boxes.length; g++){
                                    cG(b.boxes[g], e, f);
                                }
                            }
                        }
                    },
                    {
                        key: "addResult",
                        value: function a(b, c) {
                            var d = this;
                            if (!c || !this.context.resultCollector) {
                                return;
                            }
                            if (b.barcodes) {
                                b.barcodes.filter(function(a) {
                                    return a.codeResult;
                                }).forEach(function(a) {
                                    return d.addResult(a, c);
                                });
                            } else if (b.codeResult) {
                                this.context.resultCollector.addResult(c, this.context.inputStream.getCanvasSize(), b.codeResult);
                            }
                        }
                    },
                    {
                        key: "hasCodeResult",
                        value: function a(b) {
                            return !!(b && (b.barcodes ? b.barcodes.some(function(a) {
                                return a.codeResult;
                            }) : b.codeResult));
                        }
                    },
                    {
                        key: "publishResult",
                        value: function a() {
                            var b = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
                            var c = arguments.length > 1 ? arguments[1] : undefined;
                            var d = b;
                            if (b && this.context.onUIThread) {
                                this.transformResult(b);
                                this.addResult(b, c);
                                d = b.barcodes || b;
                            }
                            bp.publish("processed", d);
                            if (this.hasCodeResult(b)) {
                                bp.publish("detected", d);
                            }
                        }
                    },
                    {
                        key: "locateAndDecode",
                        value: function a() {
                            var b = this.getBoundingBoxes();
                            if (b) {
                                var c;
                                var d = this.context.decoder.decodeFromBoundingBoxes(b) || {};
                                d.boxes = b;
                                this.publishResult(d, (c = this.context.inputImageWrapper) === null || c === void 0 ? void 0 : c.data);
                            } else {
                                var e = this.context.decoder.decodeFromImage(this.context.inputImageWrapper);
                                if (e) {
                                    var f;
                                    this.publishResult(e, (f = this.context.inputImageWrapper) === null || f === void 0 ? void 0 : f.data);
                                } else {
                                    this.publishResult();
                                }
                            }
                        }
                    },
                    {
                        key: "startContinuousUpdate",
                        value: function a() {
                            var b, c = this;
                            var d = null;
                            var e = 1000 / (((b = this.context.config) === null || b === void 0 ? void 0 : b.frequency) || 60);
                            this.context.stopped = false;
                            var f = this.context;
                            var g = function a(b) {
                                d = d || b;
                                if (!f.stopped) {
                                    if (b >= d) {
                                        d += e;
                                        c.update();
                                    }
                                    window.requestAnimationFrame(a);
                                }
                            };
                            g(performance.now());
                        }
                    },
                    {
                        key: "start",
                        value: function a() {
                            var b, c;
                            if (this.context.onUIThread && ((b = this.context.config) === null || b === void 0 ? void 0 : (c = b.inputStream) === null || c === void 0 ? void 0 : c.type) === "LiveStream") {
                                this.startContinuousUpdate();
                            } else {
                                this.update();
                            }
                        }
                    },
                    {
                        key: "stop",
                        value: (function() {
                            var a = br()(bt.a.mark(function a() {
                                var b;
                                return bt.a.wrap(function a(c) {
                                    while(1){
                                        switch((c.prev = c.next)){
                                            case 0:
                                                this.context.stopped = true;
                                                cC(0);
                                                if (!((b = this.context.config) !== null && b !== void 0 && b.inputStream && this.context.config.inputStream.type === "LiveStream")) {
                                                    c.next = 6;
                                                    break;
                                                }
                                                c.next = 5;
                                                return bO.release();
                                            case 5:
                                                this.context.inputStream.clearEventHandlers();
                                            case 6:
                                            case "end":
                                                return c.stop();
                                        }
                                    }
                                }, a, this);
                            }));
                            function b() {
                                return a.apply(this, arguments);
                            }
                            return b;
                        })()
                    },
                    {
                        key: "setReaders",
                        value: function a(b) {
                            if (this.context.decoder) {
                                this.context.decoder.setReaders(b);
                            }
                            cD(b);
                        }
                    },
                    {
                        key: "registerReader",
                        value: function a(b, c) {
                            bo.registerReader(b, c);
                            if (this.context.decoder) {
                                this.context.decoder.registerReader(b, c);
                            }
                            cE(b, c);
                        }
                    }, 
                ]);
                return a;
            })();
            var cJ = new cI();
            var cK = cJ.context;
            var cL = {
                init: function a(b, c, d) {
                    var e = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : cJ;
                    var f;
                    if (!c) {
                        f = new Promise(function(a, b) {
                            c = function c(d) {
                                d ? b(d) : a();
                            };
                        });
                    }
                    e.context.config = h()({}, bZ, b);
                    if (e.context.config.numOfWorkers > 0) {
                        e.context.config.numOfWorkers = 0;
                    }
                    if (d) {
                        e.context.onUIThread = false;
                        e.initializeData(d);
                        if (c) {
                            c();
                        }
                    } else {
                        e.initInputStream(c);
                    }
                    return f;
                },
                start: function a() {
                    return cJ.start();
                },
                stop: function a() {
                    return cJ.stop();
                },
                pause: function a() {
                    cK.stopped = true;
                },
                onDetected: function a(b) {
                    if (!b || (typeof b !== "function" && (f()(b) !== "object" || !b.callback))) {
                        console.trace("* warning: Quagga.onDetected called with invalid callback, ignoring");
                        return;
                    }
                    bp.subscribe("detected", b);
                },
                offDetected: function a(b) {
                    bp.unsubscribe("detected", b);
                },
                onProcessed: function a(b) {
                    if (!b || (typeof b !== "function" && (f()(b) !== "object" || !b.callback))) {
                        console.trace("* warning: Quagga.onProcessed called with invalid callback, ignoring");
                        return;
                    }
                    bp.subscribe("processed", b);
                },
                offProcessed: function a(b) {
                    bp.unsubscribe("processed", b);
                },
                setReaders: function a(b) {
                    if (!b) {
                        console.trace("* warning: Quagga.setReaders called with no readers, ignoring");
                        return;
                    }
                    cJ.setReaders(b);
                },
                registerReader: function a(b, c) {
                    if (!b) {
                        console.trace("* warning: Quagga.registerReader called with no name, ignoring");
                        return;
                    }
                    if (!c) {
                        console.trace("* warning: Quagga.registerReader called with no reader, ignoring");
                        return;
                    }
                    cJ.registerReader(b, c);
                },
                registerResultCollector: function a(b) {
                    if (b && typeof b.addResult === "function") {
                        cK.resultCollector = b;
                    }
                },
                get canvas () {
                    return cK.canvasContainer;
                },
                decodeSingle: function a(b, c) {
                    var d = this;
                    var e = new cI();
                    b = h()({
                        inputStream: {
                            type: "ImageStream",
                            sequence: false,
                            size: 800,
                            src: b.src
                        },
                        numOfWorkers: true && b.debug ? 0 : 1,
                        locator: {
                            halfSample: false
                        }
                    }, b);
                    if (b.numOfWorkers > 0) {
                        b.numOfWorkers = 0;
                    }
                    if (b.numOfWorkers > 0 && (typeof Blob === "undefined" || typeof Worker === "undefined")) {
                        console.warn("* no Worker and/or Blob support - forcing numOfWorkers to 0");
                        b.numOfWorkers = 0;
                    }
                    return new Promise(function(a, f) {
                        try {
                            d.init(b, function() {
                                bp.once("processed", function(b) {
                                    e.stop();
                                    if (c) {
                                        c.call(null, b);
                                    }
                                    a(b);
                                }, true);
                                e.start();
                            }, null, e);
                        } catch (g) {
                            f(g);
                        }
                    });
                },
                get default () {
                    return cL;
                },
                Readers: d,
                CameraAccess: bO,
                ImageDebug: n["a"],
                ImageWrapper: j["a"],
                ResultCollector: bR
            };
            var cM = (b["default"] = cL);
        }
    ])["default"];
});
