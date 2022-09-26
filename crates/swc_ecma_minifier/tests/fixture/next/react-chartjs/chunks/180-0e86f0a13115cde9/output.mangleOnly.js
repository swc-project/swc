(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
    [
        180
    ],
    {
        9008: (function(t, n, e) {
            t.exports = e(5443);
        }),
        5376: (function(t, n, e) {
            "use strict";
            e.d(n, {
                "kL": function() {
                    return p;
                }
            });
            var r = e(7294);
            var o = e(6775);
            const i = 'label';
            function c(t, n) {
                if (typeof t === 'function') {
                    t(n);
                } else if (t) {
                    t.current = n;
                }
            }
            function s(t, n) {
                Object.assign(t.options, n);
            }
            function u(t, n) {
                t.labels = n;
            }
            function f(t, n) {
                let e = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : i;
                const r = [];
                t.datasets = n.map((n)=>{
                    const o = t.datasets.find((t)=>t[e] === n[e]);
                    if (!o || !n.data || r.includes(o)) {
                        return {
                            ...n
                        };
                    }
                    r.push(o);
                    Object.assign(o, n);
                    return o;
                });
            }
            function a(t) {
                let n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : i;
                const e = {
                    labels: [],
                    datasets: []
                };
                u(e, t.labels);
                f(e, t.datasets, n);
                return e;
            }
            function l(t, n) {
                return t.getElementsAtEventForMode(n.nativeEvent, 'dataset', {
                    intersect: true
                }, false);
            }
            function h(t, n) {
                return t.getElementsAtEventForMode(n.nativeEvent, 'nearest', {
                    intersect: true
                }, false);
            }
            function d(t, n) {
                return t.getElementsAtEventForMode(n.nativeEvent, 'index', {
                    intersect: true
                }, false);
            }
            function g(t, n) {
                let { height: e = 150 , width: i = 300 , redraw: l = false , datasetIdKey: h , type: d , data: g , options: p , plugins: b = [] , fallbackContent: y , updateMode: x , ...m } = t;
                const w = (0, r.useRef)(null);
                const M = (0, r.useRef)();
                const v = ()=>{
                    if (!w.current) return;
                    M.current = new o.kL(w.current, {
                        type: d,
                        data: a(g, h),
                        options: p && {
                            ...p
                        },
                        plugins: b
                    });
                    c(n, M.current);
                };
                const k = ()=>{
                    c(n, null);
                    if (M.current) {
                        M.current.destroy();
                        M.current = null;
                    }
                };
                (0, r.useEffect)(()=>{
                    if (!l && M.current && p) {
                        s(M.current, p);
                    }
                }, [
                    l,
                    p
                ]);
                (0, r.useEffect)(()=>{
                    if (!l && M.current) {
                        u(M.current.config.data, g.labels);
                    }
                }, [
                    l,
                    g.labels
                ]);
                (0, r.useEffect)(()=>{
                    if (!l && M.current && g.datasets) {
                        f(M.current.config.data, g.datasets, h);
                    }
                }, [
                    l,
                    g.datasets
                ]);
                (0, r.useEffect)(()=>{
                    if (!M.current) return;
                    if (l) {
                        k();
                        setTimeout(v);
                    } else {
                        M.current.update(x);
                    }
                }, [
                    l,
                    p,
                    g.labels,
                    g.datasets,
                    x
                ]);
                (0, r.useEffect)(()=>{
                    if (!M.current) return;
                    k();
                    setTimeout(v);
                }, [
                    d
                ]);
                (0, r.useEffect)(()=>{
                    v();
                    return ()=>k();
                }, []);
                return (r.createElement("canvas", Object.assign({
                    ref: w,
                    role: "img",
                    height: e,
                    width: i
                }, m), y));
            }
            const p = (0, r.forwardRef)(g);
            function b(t, n) {
                Chart$1.register(n);
                return (forwardRef((n, e)=>React.createElement(p, Object.assign({}, n, {
                        ref: e,
                        type: t
                    }))));
            }
            const y = (null && (b('line', LineController)));
            const x = (null && (b('bar', BarController)));
            const m = (null && (b('radar', RadarController)));
            const w = (null && (b('doughnut', DoughnutController)));
            const M = (null && (b('polarArea', PolarAreaController)));
            const v = (null && (b('bubble', BubbleController)));
            const k = (null && (b('pie', PieController)));
            const O = (null && (b('scatter', ScatterController)));
        }),
        9217: (function(t, n, e) {
            "use strict";
            var r = e(6775);
            r.kL.register(...r.zX);
            var o = ((null && (Chart)));
        }),
        2454: (function(t, n, e) {
            "use strict";
            e.d(n, {
                "$": function() {
                    return nO;
                },
                "A": function() {
                    return X;
                },
                "B": function() {
                    return f;
                },
                "C": function() {
                    return d;
                },
                "D": function() {
                    return nX;
                },
                "E": function() {
                    return te;
                },
                "F": function() {
                    return V;
                },
                "G": function() {
                    return nx;
                },
                "H": function() {
                    return W;
                },
                "I": function() {
                    return tr;
                },
                "J": function() {
                    return nw;
                },
                "K": function() {
                    return nL;
                },
                "L": function() {
                    return n_;
                },
                "M": function() {
                    return nC;
                },
                "N": function() {
                    return nT;
                },
                "O": function() {
                    return nH;
                },
                "P": function() {
                    return j;
                },
                "Q": function() {
                    return g;
                },
                "R": function() {
                    return ty;
                },
                "S": function() {
                    return tx;
                },
                "T": function() {
                    return I;
                },
                "U": function() {
                    return nl;
                },
                "V": function() {
                    return m;
                },
                "W": function() {
                    return P;
                },
                "X": function() {
                    return ew;
                },
                "Y": function() {
                    return ts;
                },
                "Z": function() {
                    return tc;
                },
                "_": function() {
                    return th;
                },
                "a": function() {
                    return n$;
                },
                "a0": function() {
                    return U;
                },
                "a1": function() {
                    return ek;
                },
                "a2": function() {
                    return eh;
                },
                "a3": function() {
                    return eT;
                },
                "a4": function() {
                    return tp;
                },
                "a5": function() {
                    return e_;
                },
                "a6": function() {
                    return el;
                },
                "a7": function() {
                    return nh;
                },
                "a8": function() {
                    return C;
                },
                "a9": function() {
                    return nz;
                },
                "aA": function() {
                    return eF;
                },
                "aB": function() {
                    return eY;
                },
                "aC": function() {
                    return tm;
                },
                "aD": function() {
                    return eW;
                },
                "aE": function() {
                    return nk;
                },
                "aF": function() {
                    return r;
                },
                "aG": function() {
                    return J;
                },
                "aH": function() {
                    return Z;
                },
                "aI": function() {
                    return $;
                },
                "aJ": function() {
                    return z;
                },
                "aK": function() {
                    return q;
                },
                "aL": function() {
                    return K;
                },
                "aM": function() {
                    return nm;
                },
                "aN": function() {
                    return tu;
                },
                "aO": function() {
                    return ti;
                },
                "aa": function() {
                    return nq;
                },
                "ab": function() {
                    return nZ;
                },
                "ac": function() {
                    return w;
                },
                "ad": function() {
                    return o;
                },
                "ae": function() {
                    return tb;
                },
                "af": function() {
                    return eO;
                },
                "ag": function() {
                    return nM;
                },
                "ah": function() {
                    return S;
                },
                "ai": function() {
                    return p;
                },
                "aj": function() {
                    return E;
                },
                "ak": function() {
                    return to;
                },
                "al": function() {
                    return nW;
                },
                "am": function() {
                    return ea;
                },
                "an": function() {
                    return eq;
                },
                "ao": function() {
                    return e$;
                },
                "ap": function() {
                    return eR;
                },
                "aq": function() {
                    return eC;
                },
                "ar": function() {
                    return eP;
                },
                "as": function() {
                    return nP;
                },
                "at": function() {
                    return nR;
                },
                "au": function() {
                    return nv;
                },
                "av": function() {
                    return nj;
                },
                "aw": function() {
                    return nB;
                },
                "ax": function() {
                    return nN;
                },
                "ay": function() {
                    return eH;
                },
                "az": function() {
                    return tt;
                },
                "b": function() {
                    return c;
                },
                "c": function() {
                    return nf;
                },
                "d": function() {
                    return nb;
                },
                "e": function() {
                    return t_;
                },
                "f": function() {
                    return O;
                },
                "g": function() {
                    return u;
                },
                "h": function() {
                    return nD;
                },
                "i": function() {
                    return s;
                },
                "j": function() {
                    return R;
                },
                "k": function() {
                    return i;
                },
                "l": function() {
                    return ta;
                },
                "m": function() {
                    return l;
                },
                "n": function() {
                    return h;
                },
                "o": function() {
                    return ej;
                },
                "p": function() {
                    return tn;
                },
                "q": function() {
                    return tw;
                },
                "r": function() {
                    return tg;
                },
                "s": function() {
                    return H;
                },
                "t": function() {
                    return Q;
                },
                "u": function() {
                    return tl;
                },
                "v": function() {
                    return a;
                },
                "w": function() {
                    return tM;
                },
                "x": function() {
                    return D;
                },
                "y": function() {
                    return et;
                },
                "z": function() {
                    return L;
                }
            });
            function r() {}
            const o = (function() {
                let t = 0;
                return function() {
                    return t++;
                };
            }());
            function i(t) {
                return t === null || typeof t === 'undefined';
            }
            function c(t) {
                if (Array.isArray && Array.isArray(t)) {
                    return true;
                }
                const n = Object.prototype.toString.call(t);
                if (n.slice(0, 7) === '[object' && n.slice(-6) === 'Array]') {
                    return true;
                }
                return false;
            }
            function s(t) {
                return t !== null && Object.prototype.toString.call(t) === '[object Object]';
            }
            const u = (t)=>(typeof t === 'number' || t instanceof Number) && isFinite(+t);
            function f(t, n) {
                return u(t) ? t : n;
            }
            function a(t, n) {
                return typeof t === 'undefined' ? n : t;
            }
            const l = (t, n)=>typeof t === 'string' && t.endsWith('%') ? parseFloat(t) / 100 : t / n;
            const h = (t, n)=>typeof t === 'string' && t.endsWith('%') ? parseFloat(t) / 100 * n : +t;
            function d(t, n, e) {
                if (t && typeof t.call === 'function') {
                    return t.apply(e, n);
                }
            }
            function g(t, n, e, r) {
                let o, i, u;
                if (c(t)) {
                    i = t.length;
                    if (r) {
                        for(o = i - 1; o >= 0; o--){
                            n.call(e, t[o], o);
                        }
                    } else {
                        for(o = 0; o < i; o++){
                            n.call(e, t[o], o);
                        }
                    }
                } else if (s(t)) {
                    u = Object.keys(t);
                    i = u.length;
                    for(o = 0; o < i; o++){
                        n.call(e, t[u[o]], u[o]);
                    }
                }
            }
            function p(t, n) {
                let e, r, o, i;
                if (!t || !n || t.length !== n.length) {
                    return false;
                }
                for(e = 0, r = t.length; e < r; ++e){
                    o = t[e];
                    i = n[e];
                    if (o.datasetIndex !== i.datasetIndex || o.index !== i.index) {
                        return false;
                    }
                }
                return true;
            }
            function b(t) {
                if (c(t)) {
                    return t.map(b);
                }
                if (s(t)) {
                    const n = Object.create(null);
                    const e = Object.keys(t);
                    const r = e.length;
                    let o = 0;
                    for(; o < r; ++o){
                        n[e[o]] = b(t[e[o]]);
                    }
                    return n;
                }
                return t;
            }
            function y(t) {
                return [
                    '__proto__',
                    'prototype',
                    'constructor'
                ].indexOf(t) === -1;
            }
            function x(t, n, e, r) {
                if (!y(t)) {
                    return;
                }
                const o = n[t];
                const i = e[t];
                if (s(o) && s(i)) {
                    m(o, i, r);
                } else {
                    n[t] = b(i);
                }
            }
            function m(t, n, e) {
                const r = c(n) ? n : [
                    n
                ];
                const o = r.length;
                if (!s(t)) {
                    return t;
                }
                e = e || {};
                const i = e.merger || x;
                for(let u = 0; u < o; ++u){
                    n = r[u];
                    if (!s(n)) {
                        continue;
                    }
                    const f = Object.keys(n);
                    for(let a = 0, l = f.length; a < l; ++a){
                        i(f[a], t, n, e);
                    }
                }
                return t;
            }
            function w(t, n) {
                return m(t, n, {
                    merger: M
                });
            }
            function M(t, n, e) {
                if (!y(t)) {
                    return;
                }
                const r = n[t];
                const o = e[t];
                if (s(r) && s(o)) {
                    w(r, o);
                } else if (!Object.prototype.hasOwnProperty.call(n, t)) {
                    n[t] = b(o);
                }
            }
            function v(t, n, e, r) {
                if (n !== undefined) {
                    console.warn(t + ': "' + e + '" is deprecated. Please use "' + r + '" instead');
                }
            }
            const k = {
                '': (t)=>t,
                x: (t)=>t.x,
                y: (t)=>t.y
            };
            function O(t, n) {
                const e = k[n] || (k[n] = _(n));
                return e(t);
            }
            function _(t) {
                const n = T(t);
                return (t)=>{
                    for (const e of n){
                        if (e === '') {
                            break;
                        }
                        t = t && t[e];
                    }
                    return t;
                };
            }
            function T(t) {
                const n = t.split('.');
                const e = [];
                let r = '';
                for (const o of n){
                    r += o;
                    if (r.endsWith('\\')) {
                        r = r.slice(0, -1) + '.';
                    } else {
                        e.push(r);
                        r = '';
                    }
                }
                return e;
            }
            function P(t) {
                return t.charAt(0).toUpperCase() + t.slice(1);
            }
            const R = (t)=>typeof t !== 'undefined';
            const C = (t)=>typeof t === 'function';
            const S = (t, n)=>{
                if (t.size !== n.size) {
                    return false;
                }
                for (const e of t){
                    if (!n.has(e)) {
                        return false;
                    }
                }
                return true;
            };
            function E(t) {
                return t.type === 'mouseup' || t.type === 'click' || t.type === 'contextmenu';
            }
            const j = Math.PI;
            const I = 2 * j;
            const A = I + j;
            const F = Number.POSITIVE_INFINITY;
            const Y = j / 180;
            const W = j / 2;
            const B = j / 4;
            const N = j * 2 / 3;
            const L = Math.log10;
            const H = Math.sign;
            function $(t) {
                const n = Math.round(t);
                t = q(t, n, t / 1000) ? n : t;
                const e = Math.pow(10, Math.floor(L(t)));
                const r = t / e;
                const o = r <= 1 ? 1 : r <= 2 ? 2 : r <= 5 ? 5 : 10;
                return o * e;
            }
            function X(t) {
                const n = [];
                const e = Math.sqrt(t);
                let r;
                for(r = 1; r < e; r++){
                    if (t % r === 0) {
                        n.push(r);
                        n.push(t / r);
                    }
                }
                if (e === (e | 0)) {
                    n.push(e);
                }
                n.sort((t, n)=>t - n).pop();
                return n;
            }
            function D(t) {
                return !isNaN(parseFloat(t)) && isFinite(t);
            }
            function q(t, n, e) {
                return Math.abs(t - n) < e;
            }
            function z(t, n) {
                const e = Math.round(t);
                return ((e - n) <= t) && ((e + n) >= t);
            }
            function Z(t, n, e) {
                let r, o, i;
                for(r = 0, o = t.length; r < o; r++){
                    i = t[r][e];
                    if (!isNaN(i)) {
                        n.min = Math.min(n.min, i);
                        n.max = Math.max(n.max, i);
                    }
                }
            }
            function Q(t) {
                return t * (j / 180);
            }
            function V(t) {
                return t * (180 / j);
            }
            function K(t) {
                if (!u(t)) {
                    return;
                }
                let n = 1;
                let e = 0;
                while(Math.round(t * n) / n !== t){
                    n *= 10;
                    e++;
                }
                return e;
            }
            function U(t, n) {
                const e = n.x - t.x;
                const r = n.y - t.y;
                const o = Math.sqrt(e * e + r * r);
                let i = Math.atan2(r, e);
                if (i < (-0.5 * j)) {
                    i += I;
                }
                return {
                    angle: i,
                    distance: o
                };
            }
            function J(t, n) {
                return Math.sqrt(Math.pow(n.x - t.x, 2) + Math.pow(n.y - t.y, 2));
            }
            function G(t, n) {
                return (t - n + A) % I - j;
            }
            function tt(t) {
                return (t % I + I) % I;
            }
            function tn(t, n, e, r) {
                const o = tt(t);
                const i = tt(n);
                const c = tt(e);
                const s = tt(i - o);
                const u = tt(c - o);
                const f = tt(o - i);
                const a = tt(o - c);
                return o === i || o === c || (r && i === c) || (s > u && f < a);
            }
            function te(t, n, e) {
                return Math.max(n, Math.min(e, t));
            }
            function tr(t) {
                return te(t, -32768, 32767);
            }
            function to(t, n, e, r = 1e-6) {
                return t >= Math.min(n, e) - r && t <= Math.max(n, e) + r;
            }
            function ti(t, n, e) {
                e = e || ((e)=>t[e] < n);
                let r = t.length - 1;
                let o = 0;
                let i;
                while(r - o > 1){
                    i = (o + r) >> 1;
                    if (e(i)) {
                        o = i;
                    } else {
                        r = i;
                    }
                }
                return {
                    lo: o,
                    hi: r
                };
            }
            const tc = (t, n, e, r)=>ti(t, e, r ? (r)=>t[r][n] <= e : (r)=>t[r][n] < e);
            const ts = (t, n, e)=>ti(t, e, (r)=>t[r][n] >= e);
            function tu(t, n, e) {
                let r = 0;
                let o = t.length;
                while(r < o && t[r] < n){
                    r++;
                }
                while(o > r && t[o - 1] > e){
                    o--;
                }
                return r > 0 || o < t.length ? t.slice(r, o) : t;
            }
            const tf = [
                'push',
                'pop',
                'shift',
                'splice',
                'unshift'
            ];
            function ta(t, n) {
                if (t._chartjs) {
                    t._chartjs.listeners.push(n);
                    return;
                }
                Object.defineProperty(t, '_chartjs', {
                    configurable: true,
                    enumerable: false,
                    value: {
                        listeners: [
                            n
                        ]
                    }
                });
                tf.forEach((n)=>{
                    const e = '_onData' + P(n);
                    const r = t[n];
                    Object.defineProperty(t, n, {
                        configurable: true,
                        enumerable: false,
                        value (...n) {
                            const o = r.apply(this, n);
                            t._chartjs.listeners.forEach((t)=>{
                                if (typeof t[e] === 'function') {
                                    t[e](...n);
                                }
                            });
                            return o;
                        }
                    });
                });
            }
            function tl(t, n) {
                const e = t._chartjs;
                if (!e) {
                    return;
                }
                const r = e.listeners;
                const o = r.indexOf(n);
                if (o !== -1) {
                    r.splice(o, 1);
                }
                if (r.length > 0) {
                    return;
                }
                tf.forEach((n)=>{
                    delete t[n];
                });
                delete t._chartjs;
            }
            function th(t) {
                const n = new Set();
                let e, r;
                for(e = 0, r = t.length; e < r; ++e){
                    n.add(t[e]);
                }
                if (n.size === r) {
                    return t;
                }
                return Array.from(n);
            }
            function td(t, n, e) {
                return n + ' ' + t + 'px ' + e;
            }
            const tg = (function() {
                if (typeof window === 'undefined') {
                    return function(t) {
                        return t();
                    };
                }
                return window.requestAnimationFrame;
            }());
            function tp(t, n, e) {
                const r = e || ((t)=>Array.prototype.slice.call(t));
                let o = false;
                let i = [];
                return function(...e) {
                    i = r(e);
                    if (!o) {
                        o = true;
                        tg.call(window, ()=>{
                            o = false;
                            t.apply(n, i);
                        });
                    }
                };
            }
            function tb(t, n) {
                let e;
                return function(...r) {
                    if (n) {
                        clearTimeout(e);
                        e = setTimeout(t, n, r);
                    } else {
                        t.apply(this, r);
                    }
                    return n;
                };
            }
            const ty = (t)=>t === 'start' ? 'left' : t === 'end' ? 'right' : 'center';
            const tx = (t, n, e)=>t === 'start' ? n : t === 'end' ? e : (n + e) / 2;
            const tm = (t, n, e, r)=>{
                const o = r ? 'left' : 'right';
                return t === o ? e : t === 'center' ? (n + e) / 2 : n;
            };
            function tw(t, n, e) {
                const r = n.length;
                let o = 0;
                let i = r;
                if (t._sorted) {
                    const { iScale: c , _parsed: s  } = t;
                    const u = c.axis;
                    const { min: f , max: a , minDefined: l , maxDefined: h  } = c.getUserBounds();
                    if (l) {
                        o = te(Math.min(tc(s, c.axis, f).lo, e ? r : tc(n, u, c.getPixelForValue(f)).lo), 0, r - 1);
                    }
                    if (h) {
                        i = te(Math.max(tc(s, c.axis, a, true).hi + 1, e ? 0 : tc(n, u, c.getPixelForValue(a), true).hi + 1), o, r) - o;
                    } else {
                        i = r - o;
                    }
                }
                return {
                    start: o,
                    count: i
                };
            }
            function tM(t) {
                const { xScale: n , yScale: e , _scaleRanges: r  } = t;
                const o = {
                    xmin: n.min,
                    xmax: n.max,
                    ymin: e.min,
                    ymax: e.max
                };
                if (!r) {
                    t._scaleRanges = o;
                    return true;
                }
                const i = r.xmin !== n.min || r.xmax !== n.max || r.ymin !== e.min || r.ymax !== e.max;
                Object.assign(r, o);
                return i;
            }
            const tv = (t)=>t === 0 || t === 1;
            const tk = (t, n, e)=>-(Math.pow(2, 10 * (t -= 1)) * Math.sin((t - n) * I / e));
            const tO = (t, n, e)=>Math.pow(2, -10 * t) * Math.sin((t - n) * I / e) + 1;
            const t_ = {
                linear: (t)=>t,
                easeInQuad: (t)=>t * t,
                easeOutQuad: (t)=>-t * (t - 2),
                easeInOutQuad: (t)=>((t /= 0.5) < 1) ? 0.5 * t * t : -0.5 * ((--t) * (t - 2) - 1),
                easeInCubic: (t)=>t * t * t,
                easeOutCubic: (t)=>(t -= 1) * t * t + 1,
                easeInOutCubic: (t)=>((t /= 0.5) < 1) ? 0.5 * t * t * t : 0.5 * ((t -= 2) * t * t + 2),
                easeInQuart: (t)=>t * t * t * t,
                easeOutQuart: (t)=>-((t -= 1) * t * t * t - 1),
                easeInOutQuart: (t)=>((t /= 0.5) < 1) ? 0.5 * t * t * t * t : -0.5 * ((t -= 2) * t * t * t - 2),
                easeInQuint: (t)=>t * t * t * t * t,
                easeOutQuint: (t)=>(t -= 1) * t * t * t * t + 1,
                easeInOutQuint: (t)=>((t /= 0.5) < 1) ? 0.5 * t * t * t * t * t : 0.5 * ((t -= 2) * t * t * t * t + 2),
                easeInSine: (t)=>-Math.cos(t * W) + 1,
                easeOutSine: (t)=>Math.sin(t * W),
                easeInOutSine: (t)=>-0.5 * (Math.cos(j * t) - 1),
                easeInExpo: (t)=>(t === 0) ? 0 : Math.pow(2, 10 * (t - 1)),
                easeOutExpo: (t)=>(t === 1) ? 1 : -Math.pow(2, -10 * t) + 1,
                easeInOutExpo: (t)=>tv(t) ? t : t < 0.5 ? 0.5 * Math.pow(2, 10 * (t * 2 - 1)) : 0.5 * (-Math.pow(2, -10 * (t * 2 - 1)) + 2),
                easeInCirc: (t)=>(t >= 1) ? t : -(Math.sqrt(1 - t * t) - 1),
                easeOutCirc: (t)=>Math.sqrt(1 - (t -= 1) * t),
                easeInOutCirc: (t)=>((t /= 0.5) < 1) ? -0.5 * (Math.sqrt(1 - t * t) - 1) : 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1),
                easeInElastic: (t)=>tv(t) ? t : tk(t, 0.075, 0.3),
                easeOutElastic: (t)=>tv(t) ? t : tO(t, 0.075, 0.3),
                easeInOutElastic (t) {
                    const n = 0.1125;
                    const e = 0.45;
                    return tv(t) ? t : t < 0.5 ? 0.5 * tk(t * 2, n, e) : 0.5 + 0.5 * tO(t * 2 - 1, n, e);
                },
                easeInBack (t) {
                    const n = 1.70158;
                    return t * t * ((n + 1) * t - n);
                },
                easeOutBack (t) {
                    const n = 1.70158;
                    return (t -= 1) * t * ((n + 1) * t + n) + 1;
                },
                easeInOutBack (t) {
                    let n = 1.70158;
                    if ((t /= 0.5) < 1) {
                        return 0.5 * (t * t * (((n *= (1.525)) + 1) * t - n));
                    }
                    return 0.5 * ((t -= 2) * t * (((n *= (1.525)) + 1) * t + n) + 2);
                },
                easeInBounce: (t)=>1 - t_.easeOutBounce(1 - t),
                easeOutBounce (t) {
                    const n = 7.5625;
                    const e = 2.75;
                    if (t < (1 / e)) {
                        return n * t * t;
                    }
                    if (t < (2 / e)) {
                        return n * (t -= (1.5 / e)) * t + 0.75;
                    }
                    if (t < (2.5 / e)) {
                        return n * (t -= (2.25 / e)) * t + 0.9375;
                    }
                    return n * (t -= (2.625 / e)) * t + 0.984375;
                },
                easeInOutBounce: (t)=>(t < 0.5) ? t_.easeInBounce(t * 2) * 0.5 : t_.easeOutBounce(t * 2 - 1) * 0.5 + 0.5
            };
            function tT(t) {
                return t + 0.5 | 0;
            }
            const tP = (t, n, e)=>Math.max(Math.min(t, e), n);
            function tR(t) {
                return tP(tT(t * 2.55), 0, 255);
            }
            function tC(t) {
                return tP(tT(t * 255), 0, 255);
            }
            function tS(t) {
                return tP(tT(t / 2.55) / 100, 0, 1);
            }
            function tE(t) {
                return tP(tT(t * 100), 0, 100);
            }
            const tj = {
                0: 0,
                1: 1,
                2: 2,
                3: 3,
                4: 4,
                5: 5,
                6: 6,
                7: 7,
                8: 8,
                9: 9,
                A: 10,
                B: 11,
                C: 12,
                D: 13,
                E: 14,
                F: 15,
                a: 10,
                b: 11,
                c: 12,
                d: 13,
                e: 14,
                f: 15
            };
            const tI = [
                ...'0123456789ABCDEF'
            ];
            const tA = (t)=>tI[t & 0xF];
            const tF = (t)=>tI[(t & 0xF0) >> 4] + tI[t & 0xF];
            const tY = (t)=>((t & 0xF0) >> 4) === (t & 0xF);
            const tW = (t)=>tY(t.r) && tY(t.g) && tY(t.b) && tY(t.a);
            function tB(t) {
                var n = t.length;
                var e;
                if (t[0] === '#') {
                    if (n === 4 || n === 5) {
                        e = {
                            r: 255 & tj[t[1]] * 17,
                            g: 255 & tj[t[2]] * 17,
                            b: 255 & tj[t[3]] * 17,
                            a: n === 5 ? tj[t[4]] * 17 : 255
                        };
                    } else if (n === 7 || n === 9) {
                        e = {
                            r: tj[t[1]] << 4 | tj[t[2]],
                            g: tj[t[3]] << 4 | tj[t[4]],
                            b: tj[t[5]] << 4 | tj[t[6]],
                            a: n === 9 ? (tj[t[7]] << 4 | tj[t[8]]) : 255
                        };
                    }
                }
                return e;
            }
            const tN = (t, n)=>t < 255 ? n(t) : '';
            function tL(t) {
                var n = tW(t) ? tA : tF;
                return t ? '#' + n(t.r) + n(t.g) + n(t.b) + tN(t.a, n) : undefined;
            }
            const tH = /^(hsla?|hwb|hsv)\(\s*([-+.e\d]+)(?:deg)?[\s,]+([-+.e\d]+)%[\s,]+([-+.e\d]+)%(?:[\s,]+([-+.e\d]+)(%)?)?\s*\)$/;
            function t$(t, n, e) {
                const r = n * Math.min(e, 1 - e);
                const o = (n, o = (n + t / 30) % 12)=>e - r * Math.max(Math.min(o - 3, 9 - o, 1), -1);
                return [
                    o(0),
                    o(8),
                    o(4)
                ];
            }
            function tX(t, n, e) {
                const r = (r, o = (r + t / 60) % 6)=>e - e * n * Math.max(Math.min(o, 4 - o, 1), 0);
                return [
                    r(5),
                    r(3),
                    r(1)
                ];
            }
            function tD(t, n, e) {
                const r = t$(t, 1, 0.5);
                let o;
                if (n + e > 1) {
                    o = 1 / (n + e);
                    n *= o;
                    e *= o;
                }
                for(o = 0; o < 3; o++){
                    r[o] *= 1 - n - e;
                    r[o] += n;
                }
                return r;
            }
            function tq(t, n, e, r, o) {
                if (t === o) {
                    return ((n - e) / r) + (n < e ? 6 : 0);
                }
                if (n === o) {
                    return (e - t) / r + 2;
                }
                return (t - n) / r + 4;
            }
            function tz(t) {
                const n = 255;
                const e = t.r / n;
                const r = t.g / n;
                const o = t.b / n;
                const i = Math.max(e, r, o);
                const c = Math.min(e, r, o);
                const s = (i + c) / 2;
                let u, f, a;
                if (i !== c) {
                    a = i - c;
                    f = s > 0.5 ? a / (2 - i - c) : a / (i + c);
                    u = tq(e, r, o, a, i);
                    u = u * 60 + 0.5;
                }
                return [
                    u | 0,
                    f || 0,
                    s
                ];
            }
            function tZ(t, n, e, r) {
                return (Array.isArray(n) ? t(n[0], n[1], n[2]) : t(n, e, r)).map(tC);
            }
            function tQ(t, n, e) {
                return tZ(t$, t, n, e);
            }
            function tV(t, n, e) {
                return tZ(tD, t, n, e);
            }
            function tK(t, n, e) {
                return tZ(tX, t, n, e);
            }
            function tU(t) {
                return (t % 360 + 360) % 360;
            }
            function tJ(t) {
                const n = tH.exec(t);
                let e = 255;
                let r;
                if (!n) {
                    return;
                }
                if (n[5] !== r) {
                    e = n[6] ? tR(+n[5]) : tC(+n[5]);
                }
                const o = tU(+n[2]);
                const i = +n[3] / 100;
                const c = +n[4] / 100;
                if (n[1] === 'hwb') {
                    r = tV(o, i, c);
                } else if (n[1] === 'hsv') {
                    r = tK(o, i, c);
                } else {
                    r = tQ(o, i, c);
                }
                return {
                    r: r[0],
                    g: r[1],
                    b: r[2],
                    a: e
                };
            }
            function tG(t, n) {
                var e = tz(t);
                e[0] = tU(e[0] + n);
                e = tQ(e);
                t.r = e[0];
                t.g = e[1];
                t.b = e[2];
            }
            function t0(t) {
                if (!t) {
                    return;
                }
                const n = tz(t);
                const e = n[0];
                const r = tE(n[1]);
                const o = tE(n[2]);
                return t.a < 255 ? `hsla(${e}, ${r}%, ${o}%, ${tS(t.a)})` : `hsl(${e}, ${r}%, ${o}%)`;
            }
            const t1 = {
                x: 'dark',
                Z: 'light',
                Y: 're',
                X: 'blu',
                W: 'gr',
                V: 'medium',
                U: 'slate',
                A: 'ee',
                T: 'ol',
                S: 'or',
                B: 'ra',
                C: 'lateg',
                D: 'ights',
                R: 'in',
                Q: 'turquois',
                E: 'hi',
                P: 'ro',
                O: 'al',
                N: 'le',
                M: 'de',
                L: 'yello',
                F: 'en',
                K: 'ch',
                G: 'arks',
                H: 'ea',
                I: 'ightg',
                J: 'wh'
            };
            const t5 = {
                OiceXe: 'f0f8ff',
                antiquewEte: 'faebd7',
                aqua: 'ffff',
                aquamarRe: '7fffd4',
                azuY: 'f0ffff',
                beige: 'f5f5dc',
                bisque: 'ffe4c4',
                black: '0',
                blanKedOmond: 'ffebcd',
                Xe: 'ff',
                XeviTet: '8a2be2',
                bPwn: 'a52a2a',
                burlywood: 'deb887',
                caMtXe: '5f9ea0',
                KartYuse: '7fff00',
                KocTate: 'd2691e',
                cSO: 'ff7f50',
                cSnflowerXe: '6495ed',
                cSnsilk: 'fff8dc',
                crimson: 'dc143c',
                cyan: 'ffff',
                xXe: '8b',
                xcyan: '8b8b',
                xgTMnPd: 'b8860b',
                xWay: 'a9a9a9',
                xgYF: '6400',
                xgYy: 'a9a9a9',
                xkhaki: 'bdb76b',
                xmagFta: '8b008b',
                xTivegYF: '556b2f',
                xSange: 'ff8c00',
                xScEd: '9932cc',
                xYd: '8b0000',
                xsOmon: 'e9967a',
                xsHgYF: '8fbc8f',
                xUXe: '483d8b',
                xUWay: '2f4f4f',
                xUgYy: '2f4f4f',
                xQe: 'ced1',
                xviTet: '9400d3',
                dAppRk: 'ff1493',
                dApskyXe: 'bfff',
                dimWay: '696969',
                dimgYy: '696969',
                dodgerXe: '1e90ff',
                fiYbrick: 'b22222',
                flSOwEte: 'fffaf0',
                foYstWAn: '228b22',
                fuKsia: 'ff00ff',
                gaRsbSo: 'dcdcdc',
                ghostwEte: 'f8f8ff',
                gTd: 'ffd700',
                gTMnPd: 'daa520',
                Way: '808080',
                gYF: '8000',
                gYFLw: 'adff2f',
                gYy: '808080',
                honeyMw: 'f0fff0',
                hotpRk: 'ff69b4',
                RdianYd: 'cd5c5c',
                Rdigo: '4b0082',
                ivSy: 'fffff0',
                khaki: 'f0e68c',
                lavFMr: 'e6e6fa',
                lavFMrXsh: 'fff0f5',
                lawngYF: '7cfc00',
                NmoncEffon: 'fffacd',
                ZXe: 'add8e6',
                ZcSO: 'f08080',
                Zcyan: 'e0ffff',
                ZgTMnPdLw: 'fafad2',
                ZWay: 'd3d3d3',
                ZgYF: '90ee90',
                ZgYy: 'd3d3d3',
                ZpRk: 'ffb6c1',
                ZsOmon: 'ffa07a',
                ZsHgYF: '20b2aa',
                ZskyXe: '87cefa',
                ZUWay: '778899',
                ZUgYy: '778899',
                ZstAlXe: 'b0c4de',
                ZLw: 'ffffe0',
                lime: 'ff00',
                limegYF: '32cd32',
                lRF: 'faf0e6',
                magFta: 'ff00ff',
                maPon: '800000',
                VaquamarRe: '66cdaa',
                VXe: 'cd',
                VScEd: 'ba55d3',
                VpurpN: '9370db',
                VsHgYF: '3cb371',
                VUXe: '7b68ee',
                VsprRggYF: 'fa9a',
                VQe: '48d1cc',
                VviTetYd: 'c71585',
                midnightXe: '191970',
                mRtcYam: 'f5fffa',
                mistyPse: 'ffe4e1',
                moccasR: 'ffe4b5',
                navajowEte: 'ffdead',
                navy: '80',
                Tdlace: 'fdf5e6',
                Tive: '808000',
                TivedBb: '6b8e23',
                Sange: 'ffa500',
                SangeYd: 'ff4500',
                ScEd: 'da70d6',
                pOegTMnPd: 'eee8aa',
                pOegYF: '98fb98',
                pOeQe: 'afeeee',
                pOeviTetYd: 'db7093',
                papayawEp: 'ffefd5',
                pHKpuff: 'ffdab9',
                peru: 'cd853f',
                pRk: 'ffc0cb',
                plum: 'dda0dd',
                powMrXe: 'b0e0e6',
                purpN: '800080',
                YbeccapurpN: '663399',
                Yd: 'ff0000',
                Psybrown: 'bc8f8f',
                PyOXe: '4169e1',
                saddNbPwn: '8b4513',
                sOmon: 'fa8072',
                sandybPwn: 'f4a460',
                sHgYF: '2e8b57',
                sHshell: 'fff5ee',
                siFna: 'a0522d',
                silver: 'c0c0c0',
                skyXe: '87ceeb',
                UXe: '6a5acd',
                UWay: '708090',
                UgYy: '708090',
                snow: 'fffafa',
                sprRggYF: 'ff7f',
                stAlXe: '4682b4',
                tan: 'd2b48c',
                teO: '8080',
                tEstN: 'd8bfd8',
                tomato: 'ff6347',
                Qe: '40e0d0',
                viTet: 'ee82ee',
                JHt: 'f5deb3',
                wEte: 'ffffff',
                wEtesmoke: 'f5f5f5',
                Lw: 'ffff00',
                LwgYF: '9acd32'
            };
            function t2() {
                const t = {};
                const n = Object.keys(t5);
                const e = Object.keys(t1);
                let r, o, i, c, s;
                for(r = 0; r < n.length; r++){
                    c = s = n[r];
                    for(o = 0; o < e.length; o++){
                        i = e[o];
                        s = s.replace(i, t1[i]);
                    }
                    i = parseInt(t5[c], 16);
                    t[s] = [
                        i >> 16 & 0xFF,
                        i >> 8 & 0xFF,
                        i & 0xFF
                    ];
                }
                return t;
            }
            let t8;
            function t3(t) {
                if (!t8) {
                    t8 = t2();
                    t8.transparent = [
                        0,
                        0,
                        0,
                        0
                    ];
                }
                const n = t8[t.toLowerCase()];
                return n && {
                    r: n[0],
                    g: n[1],
                    b: n[2],
                    a: n.length === 4 ? n[3] : 255
                };
            }
            const t4 = /^rgba?\(\s*([-+.\d]+)(%)?[\s,]+([-+.e\d]+)(%)?[\s,]+([-+.e\d]+)(%)?(?:[\s,/]+([-+.e\d]+)(%)?)?\s*\)$/;
            function t6(t) {
                const n = t4.exec(t);
                let e = 255;
                let r, o, i;
                if (!n) {
                    return;
                }
                if (n[7] !== r) {
                    const c = +n[7];
                    e = n[8] ? tR(c) : tP(c * 255, 0, 255);
                }
                r = +n[1];
                o = +n[3];
                i = +n[5];
                r = 255 & (n[2] ? tR(r) : tP(r, 0, 255));
                o = 255 & (n[4] ? tR(o) : tP(o, 0, 255));
                i = 255 & (n[6] ? tR(i) : tP(i, 0, 255));
                return {
                    r: r,
                    g: o,
                    b: i,
                    a: e
                };
            }
            function t7(t) {
                return t && (t.a < 255 ? `rgba(${t.r}, ${t.g}, ${t.b}, ${tS(t.a)})` : `rgb(${t.r}, ${t.g}, ${t.b})`);
            }
            const t9 = (t)=>t <= 0.0031308 ? t * 12.92 : Math.pow(t, 1.0 / 2.4) * 1.055 - 0.055;
            const nt = (t)=>t <= 0.04045 ? t / 12.92 : Math.pow((t + 0.055) / 1.055, 2.4);
            function nn(t, n, e) {
                const r = nt(tS(t.r));
                const o = nt(tS(t.g));
                const i = nt(tS(t.b));
                return {
                    r: tC(t9(r + e * (nt(tS(n.r)) - r))),
                    g: tC(t9(o + e * (nt(tS(n.g)) - o))),
                    b: tC(t9(i + e * (nt(tS(n.b)) - i))),
                    a: t.a + e * (n.a - t.a)
                };
            }
            function ne(t, n, e) {
                if (t) {
                    let r = tz(t);
                    r[n] = Math.max(0, Math.min(r[n] + r[n] * e, n === 0 ? 360 : 1));
                    r = tQ(r);
                    t.r = r[0];
                    t.g = r[1];
                    t.b = r[2];
                }
            }
            function nr(t, n) {
                return t ? Object.assign(n || {}, t) : t;
            }
            function no(t) {
                var n = {
                    r: 0,
                    g: 0,
                    b: 0,
                    a: 255
                };
                if (Array.isArray(t)) {
                    if (t.length >= 3) {
                        n = {
                            r: t[0],
                            g: t[1],
                            b: t[2],
                            a: 255
                        };
                        if (t.length > 3) {
                            n.a = tC(t[3]);
                        }
                    }
                } else {
                    n = nr(t, {
                        r: 0,
                        g: 0,
                        b: 0,
                        a: 1
                    });
                    n.a = tC(n.a);
                }
                return n;
            }
            function ni(t) {
                if (t.charAt(0) === 'r') {
                    return t6(t);
                }
                return tJ(t);
            }
            class nc {
                constructor(t){
                    if (t instanceof nc) {
                        return t;
                    }
                    const n = typeof t;
                    let e;
                    if (n === 'object') {
                        e = no(t);
                    } else if (n === 'string') {
                        e = tB(t) || t3(t) || ni(t);
                    }
                    this._rgb = e;
                    this._valid = !!e;
                }
                get valid() {
                    return this._valid;
                }
                get rgb() {
                    var t = nr(this._rgb);
                    if (t) {
                        t.a = tS(t.a);
                    }
                    return t;
                }
                set rgb(t) {
                    this._rgb = no(t);
                }
                rgbString() {
                    return this._valid ? t7(this._rgb) : undefined;
                }
                hexString() {
                    return this._valid ? tL(this._rgb) : undefined;
                }
                hslString() {
                    return this._valid ? t0(this._rgb) : undefined;
                }
                mix(t, n) {
                    if (t) {
                        const e = this.rgb;
                        const r = t.rgb;
                        let o;
                        const i = n === o ? 0.5 : n;
                        const c = 2 * i - 1;
                        const s = e.a - r.a;
                        const u = ((c * s === -1 ? c : (c + s) / (1 + c * s)) + 1) / 2.0;
                        o = 1 - u;
                        e.r = 0xFF & u * e.r + o * r.r + 0.5;
                        e.g = 0xFF & u * e.g + o * r.g + 0.5;
                        e.b = 0xFF & u * e.b + o * r.b + 0.5;
                        e.a = i * e.a + (1 - i) * r.a;
                        this.rgb = e;
                    }
                    return this;
                }
                interpolate(t, n) {
                    if (t) {
                        this._rgb = nn(this._rgb, t._rgb, n);
                    }
                    return this;
                }
                clone() {
                    return new nc(this.rgb);
                }
                alpha(t) {
                    this._rgb.a = tC(t);
                    return this;
                }
                clearer(t) {
                    const n = this._rgb;
                    n.a *= 1 - t;
                    return this;
                }
                greyscale() {
                    const t = this._rgb;
                    const n = tT(t.r * 0.3 + t.g * 0.59 + t.b * 0.11);
                    t.r = t.g = t.b = n;
                    return this;
                }
                opaquer(t) {
                    const n = this._rgb;
                    n.a *= 1 + t;
                    return this;
                }
                negate() {
                    const t = this._rgb;
                    t.r = 255 - t.r;
                    t.g = 255 - t.g;
                    t.b = 255 - t.b;
                    return this;
                }
                lighten(t) {
                    ne(this._rgb, 2, t);
                    return this;
                }
                darken(t) {
                    ne(this._rgb, 2, -t);
                    return this;
                }
                saturate(t) {
                    ne(this._rgb, 1, t);
                    return this;
                }
                desaturate(t) {
                    ne(this._rgb, 1, -t);
                    return this;
                }
                rotate(t) {
                    tG(this._rgb, t);
                    return this;
                }
            }
            function ns(t) {
                return new nc(t);
            }
            function nu(t) {
                if (t && typeof t === 'object') {
                    const n = t.toString();
                    return n === '[object CanvasPattern]' || n === '[object CanvasGradient]';
                }
                return false;
            }
            function nf(t) {
                return nu(t) ? t : ns(t);
            }
            function na(t) {
                return nu(t) ? t : ns(t).saturate(0.5).darken(0.1).hexString();
            }
            const nl = Object.create(null);
            const nh = Object.create(null);
            function nd(t, n) {
                if (!n) {
                    return t;
                }
                const e = n.split('.');
                for(let r = 0, o = e.length; r < o; ++r){
                    const i = e[r];
                    t = t[i] || (t[i] = Object.create(null));
                }
                return t;
            }
            function ng(t, n, e) {
                if (typeof n === 'string') {
                    return m(nd(t, n), e);
                }
                return m(nd(t, ''), n);
            }
            class np {
                constructor(t){
                    this.animation = undefined;
                    this.backgroundColor = 'rgba(0,0,0,0.1)';
                    this.borderColor = 'rgba(0,0,0,0.1)';
                    this.color = '#666';
                    this.datasets = {};
                    this.devicePixelRatio = (t)=>t.chart.platform.getDevicePixelRatio();
                    this.elements = {};
                    this.events = [
                        'mousemove',
                        'mouseout',
                        'click',
                        'touchstart',
                        'touchmove'
                    ];
                    this.font = {
                        family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                        size: 12,
                        style: 'normal',
                        lineHeight: 1.2,
                        weight: null
                    };
                    this.hover = {};
                    this.hoverBackgroundColor = (t, n)=>na(n.backgroundColor);
                    this.hoverBorderColor = (t, n)=>na(n.borderColor);
                    this.hoverColor = (t, n)=>na(n.color);
                    this.indexAxis = 'x';
                    this.interaction = {
                        mode: 'nearest',
                        intersect: true,
                        includeInvisible: false
                    };
                    this.maintainAspectRatio = true;
                    this.onHover = null;
                    this.onClick = null;
                    this.parsing = true;
                    this.plugins = {};
                    this.responsive = true;
                    this.scale = undefined;
                    this.scales = {};
                    this.showLine = true;
                    this.drawActiveElementsOnTop = true;
                    this.describe(t);
                }
                set(t, n) {
                    return ng(this, t, n);
                }
                get(t) {
                    return nd(this, t);
                }
                describe(t, n) {
                    return ng(nh, t, n);
                }
                override(t, n) {
                    return ng(nl, t, n);
                }
                route(t, n, e, r) {
                    const o = nd(this, t);
                    const i = nd(this, e);
                    const c = '_' + n;
                    Object.defineProperties(o, {
                        [c]: {
                            value: o[n],
                            writable: true
                        },
                        [n]: {
                            enumerable: true,
                            get () {
                                const t = this[c];
                                const n = i[r];
                                if (s(t)) {
                                    return Object.assign({}, n, t);
                                }
                                return a(t, n);
                            },
                            set (t) {
                                this[c] = t;
                            }
                        }
                    });
                }
            }
            var nb = new np({
                _scriptable: (t)=>!t.startsWith('on'),
                _indexable: (t)=>t !== 'events',
                hover: {
                    _fallback: 'interaction'
                },
                interaction: {
                    _scriptable: false,
                    _indexable: false
                }
            });
            function ny(t) {
                if (!t || i(t.size) || i(t.family)) {
                    return null;
                }
                return (t.style ? t.style + ' ' : '') + (t.weight ? t.weight + ' ' : '') + t.size + 'px ' + t.family;
            }
            function nx(t, n, e, r, o) {
                let i = n[o];
                if (!i) {
                    i = n[o] = t.measureText(o).width;
                    e.push(o);
                }
                if (i > r) {
                    r = i;
                }
                return r;
            }
            function nm(t, n, e, r) {
                r = r || {};
                let o = r.data = r.data || {};
                let i = r.garbageCollect = r.garbageCollect || [];
                if (r.font !== n) {
                    o = r.data = {};
                    i = r.garbageCollect = [];
                    r.font = n;
                }
                t.save();
                t.font = n;
                let s = 0;
                const u = e.length;
                let f, a, l, h, d;
                for(f = 0; f < u; f++){
                    h = e[f];
                    if (h !== undefined && h !== null && c(h) !== true) {
                        s = nx(t, o, i, s, h);
                    } else if (c(h)) {
                        for(a = 0, l = h.length; a < l; a++){
                            d = h[a];
                            if (d !== undefined && d !== null && !c(d)) {
                                s = nx(t, o, i, s, d);
                            }
                        }
                    }
                }
                t.restore();
                const g = i.length / 2;
                if (g > e.length) {
                    for(f = 0; f < g; f++){
                        delete o[i[f]];
                    }
                    i.splice(0, g);
                }
                return s;
            }
            function nw(t, n, e) {
                const r = t.currentDevicePixelRatio;
                const o = e !== 0 ? Math.max(e / 2, 0.5) : 0;
                return Math.round((n - o) * r) / r + o;
            }
            function nM(t, n) {
                n = n || t.getContext('2d');
                n.save();
                n.resetTransform();
                n.clearRect(0, 0, t.width, t.height);
                n.restore();
            }
            function nv(t, n, e, r) {
                nk(t, n, e, r, null);
            }
            function nk(t, n, e, r, o) {
                let i, c, s, u, f, a;
                const l = n.pointStyle;
                const h = n.rotation;
                const d = n.radius;
                let g = (h || 0) * Y;
                if (l && typeof l === 'object') {
                    i = l.toString();
                    if (i === '[object HTMLImageElement]' || i === '[object HTMLCanvasElement]') {
                        t.save();
                        t.translate(e, r);
                        t.rotate(g);
                        t.drawImage(l, -l.width / 2, -l.height / 2, l.width, l.height);
                        t.restore();
                        return;
                    }
                }
                if (isNaN(d) || d <= 0) {
                    return;
                }
                t.beginPath();
                switch(l){
                    default:
                        if (o) {
                            t.ellipse(e, r, o / 2, d, 0, 0, I);
                        } else {
                            t.arc(e, r, d, 0, I);
                        }
                        t.closePath();
                        break;
                    case 'triangle':
                        t.moveTo(e + Math.sin(g) * d, r - Math.cos(g) * d);
                        g += N;
                        t.lineTo(e + Math.sin(g) * d, r - Math.cos(g) * d);
                        g += N;
                        t.lineTo(e + Math.sin(g) * d, r - Math.cos(g) * d);
                        t.closePath();
                        break;
                    case 'rectRounded':
                        f = d * 0.516;
                        u = d - f;
                        c = Math.cos(g + B) * u;
                        s = Math.sin(g + B) * u;
                        t.arc(e - c, r - s, f, g - j, g - W);
                        t.arc(e + s, r - c, f, g - W, g);
                        t.arc(e + c, r + s, f, g, g + W);
                        t.arc(e - s, r + c, f, g + W, g + j);
                        t.closePath();
                        break;
                    case 'rect':
                        if (!h) {
                            u = Math.SQRT1_2 * d;
                            a = o ? o / 2 : u;
                            t.rect(e - a, r - u, 2 * a, 2 * u);
                            break;
                        }
                        g += B;
                    case 'rectRot':
                        c = Math.cos(g) * d;
                        s = Math.sin(g) * d;
                        t.moveTo(e - c, r - s);
                        t.lineTo(e + s, r - c);
                        t.lineTo(e + c, r + s);
                        t.lineTo(e - s, r + c);
                        t.closePath();
                        break;
                    case 'crossRot':
                        g += B;
                    case 'cross':
                        c = Math.cos(g) * d;
                        s = Math.sin(g) * d;
                        t.moveTo(e - c, r - s);
                        t.lineTo(e + c, r + s);
                        t.moveTo(e + s, r - c);
                        t.lineTo(e - s, r + c);
                        break;
                    case 'star':
                        c = Math.cos(g) * d;
                        s = Math.sin(g) * d;
                        t.moveTo(e - c, r - s);
                        t.lineTo(e + c, r + s);
                        t.moveTo(e + s, r - c);
                        t.lineTo(e - s, r + c);
                        g += B;
                        c = Math.cos(g) * d;
                        s = Math.sin(g) * d;
                        t.moveTo(e - c, r - s);
                        t.lineTo(e + c, r + s);
                        t.moveTo(e + s, r - c);
                        t.lineTo(e - s, r + c);
                        break;
                    case 'line':
                        c = o ? o / 2 : Math.cos(g) * d;
                        s = Math.sin(g) * d;
                        t.moveTo(e - c, r - s);
                        t.lineTo(e + c, r + s);
                        break;
                    case 'dash':
                        t.moveTo(e, r);
                        t.lineTo(e + Math.cos(g) * d, r + Math.sin(g) * d);
                        break;
                }
                t.fill();
                if (n.borderWidth > 0) {
                    t.stroke();
                }
            }
            function nO(t, n, e) {
                e = e || 0.5;
                return !n || (t && t.x > n.left - e && t.x < n.right + e && t.y > n.top - e && t.y < n.bottom + e);
            }
            function n_(t, n) {
                t.save();
                t.beginPath();
                t.rect(n.left, n.top, n.right - n.left, n.bottom - n.top);
                t.clip();
            }
            function nT(t) {
                t.restore();
            }
            function nP(t, n, e, r, o) {
                if (!n) {
                    return t.lineTo(e.x, e.y);
                }
                if (o === 'middle') {
                    const i = (n.x + e.x) / 2.0;
                    t.lineTo(i, n.y);
                    t.lineTo(i, e.y);
                } else if (o === 'after' !== !!r) {
                    t.lineTo(n.x, e.y);
                } else {
                    t.lineTo(e.x, n.y);
                }
                t.lineTo(e.x, e.y);
            }
            function nR(t, n, e, r) {
                if (!n) {
                    return t.lineTo(e.x, e.y);
                }
                t.bezierCurveTo(r ? n.cp1x : n.cp2x, r ? n.cp1y : n.cp2y, r ? e.cp2x : e.cp1x, r ? e.cp2y : e.cp1y, e.x, e.y);
            }
            function nC(t, n, e, r, o, s = {}) {
                const u = c(n) ? n : [
                    n
                ];
                const f = s.strokeWidth > 0 && s.strokeColor !== '';
                let a, l;
                t.save();
                t.font = o.string;
                nS(t, s);
                for(a = 0; a < u.length; ++a){
                    l = u[a];
                    if (f) {
                        if (s.strokeColor) {
                            t.strokeStyle = s.strokeColor;
                        }
                        if (!i(s.strokeWidth)) {
                            t.lineWidth = s.strokeWidth;
                        }
                        t.strokeText(l, e, r, s.maxWidth);
                    }
                    t.fillText(l, e, r, s.maxWidth);
                    nE(t, e, r, l, s);
                    r += o.lineHeight;
                }
                t.restore();
            }
            function nS(t, n) {
                if (n.translation) {
                    t.translate(n.translation[0], n.translation[1]);
                }
                if (!i(n.rotation)) {
                    t.rotate(n.rotation);
                }
                if (n.color) {
                    t.fillStyle = n.color;
                }
                if (n.textAlign) {
                    t.textAlign = n.textAlign;
                }
                if (n.textBaseline) {
                    t.textBaseline = n.textBaseline;
                }
            }
            function nE(t, n, e, r, o) {
                if (o.strikethrough || o.underline) {
                    const i = t.measureText(r);
                    const c = n - i.actualBoundingBoxLeft;
                    const s = n + i.actualBoundingBoxRight;
                    const u = e - i.actualBoundingBoxAscent;
                    const f = e + i.actualBoundingBoxDescent;
                    const a = o.strikethrough ? (u + f) / 2 : f;
                    t.strokeStyle = t.fillStyle;
                    t.beginPath();
                    t.lineWidth = o.decorationWidth || 2;
                    t.moveTo(c, a);
                    t.lineTo(s, a);
                    t.stroke();
                }
            }
            function nj(t, n) {
                const { x: e , y: r , w: o , h: i , radius: c  } = n;
                t.arc(e + c.topLeft, r + c.topLeft, c.topLeft, -W, j, true);
                t.lineTo(e, r + i - c.bottomLeft);
                t.arc(e + c.bottomLeft, r + i - c.bottomLeft, c.bottomLeft, j, W, true);
                t.lineTo(e + o - c.bottomRight, r + i);
                t.arc(e + o - c.bottomRight, r + i - c.bottomRight, c.bottomRight, W, 0, true);
                t.lineTo(e + o, r + c.topRight);
                t.arc(e + o - c.topRight, r + c.topRight, c.topRight, 0, -W, true);
                t.lineTo(e + c.topLeft, r);
            }
            const nI = new RegExp(/^(normal|(\d+(?:\.\d+)?)(px|em|%)?)$/);
            const nA = new RegExp(/^(normal|italic|initial|inherit|unset|(oblique( -?[0-9]?[0-9]deg)?))$/);
            function nF(t, n) {
                const e = ('' + t).match(nI);
                if (!e || e[1] === 'normal') {
                    return n * 1.2;
                }
                t = +e[2];
                switch(e[3]){
                    case 'px':
                        return t;
                    case '%':
                        t /= 100;
                        break;
                }
                return n * t;
            }
            const nY = (t)=>+t || 0;
            function nW(t, n) {
                const e = {};
                const r = s(n);
                const o = r ? Object.keys(n) : n;
                const i = s(t) ? r ? (e)=>a(t[e], t[n[e]]) : (n)=>t[n] : ()=>t;
                for (const c of o){
                    e[c] = nY(i(c));
                }
                return e;
            }
            function nB(t) {
                return nW(t, {
                    top: 'y',
                    right: 'x',
                    bottom: 'y',
                    left: 'x'
                });
            }
            function nN(t) {
                return nW(t, [
                    'topLeft',
                    'topRight',
                    'bottomLeft',
                    'bottomRight'
                ]);
            }
            function nL(t) {
                const n = nB(t);
                n.width = n.left + n.right;
                n.height = n.top + n.bottom;
                return n;
            }
            function nH(t, n) {
                t = t || {};
                n = n || nb.font;
                let e = a(t.size, n.size);
                if (typeof e === 'string') {
                    e = parseInt(e, 10);
                }
                let r = a(t.style, n.style);
                if (r && !('' + r).match(nA)) {
                    console.warn('Invalid font style specified: "' + r + '"');
                    r = '';
                }
                const o = {
                    family: a(t.family, n.family),
                    lineHeight: nF(a(t.lineHeight, n.lineHeight), e),
                    size: e,
                    style: r,
                    weight: a(t.weight, n.weight),
                    string: ''
                };
                o.string = ny(o);
                return o;
            }
            function n$(t, n, e, r) {
                let o = true;
                let i, s, u;
                for(i = 0, s = t.length; i < s; ++i){
                    u = t[i];
                    if (u === undefined) {
                        continue;
                    }
                    if (n !== undefined && typeof u === 'function') {
                        u = u(n);
                        o = false;
                    }
                    if (e !== undefined && c(u)) {
                        u = u[e % u.length];
                        o = false;
                    }
                    if (u !== undefined) {
                        if (r && !o) {
                            r.cacheable = false;
                        }
                        return u;
                    }
                }
            }
            function nX(t, n, e) {
                const { min: r , max: o  } = t;
                const i = h(n, (o - r) / 2);
                const c = (t, n)=>e && t === 0 ? 0 : t + n;
                return {
                    min: c(r, -Math.abs(i)),
                    max: c(o, i)
                };
            }
            function nD(t, n) {
                return Object.assign(Object.create(t), n);
            }
            function nq(t, n = [
                ''
            ], e = t, r, o = ()=>t[0]) {
                if (!R(r)) {
                    r = n6('_fallback', t);
                }
                const i = {
                    [Symbol.toStringTag]: 'Object',
                    _cacheable: true,
                    _scopes: t,
                    _rootScopes: e,
                    _fallback: r,
                    _getTarget: o,
                    override: (o)=>nq([
                            o,
                            ...t
                        ], n, e, r)
                };
                return new Proxy(i, {
                    deleteProperty (n, e) {
                        delete n[e];
                        delete n._keys;
                        delete t[0][e];
                        return true;
                    },
                    get (e, r) {
                        return nK(e, r, ()=>n4(r, n, t, e));
                    },
                    getOwnPropertyDescriptor (t, n) {
                        return Reflect.getOwnPropertyDescriptor(t._scopes[0], n);
                    },
                    getPrototypeOf () {
                        return Reflect.getPrototypeOf(t[0]);
                    },
                    has (t, n) {
                        return n7(t).includes(n);
                    },
                    ownKeys (t) {
                        return n7(t);
                    },
                    set (t, n, e) {
                        const r = t._storage || (t._storage = o());
                        t[n] = r[n] = e;
                        delete t._keys;
                        return true;
                    }
                });
            }
            function nz(t, n, e, r) {
                const o = {
                    _cacheable: false,
                    _proxy: t,
                    _context: n,
                    _subProxy: e,
                    _stack: new Set(),
                    _descriptors: nZ(t, r),
                    setContext: (n)=>nz(t, n, e, r),
                    override: (o)=>nz(t.override(o), n, e, r)
                };
                return new Proxy(o, {
                    deleteProperty (n, e) {
                        delete n[e];
                        delete t[e];
                        return true;
                    },
                    get (t, n, e) {
                        return nK(t, n, ()=>nU(t, n, e));
                    },
                    getOwnPropertyDescriptor (n, e) {
                        return n._descriptors.allKeys ? Reflect.has(t, e) ? {
                            enumerable: true,
                            configurable: true
                        } : undefined : Reflect.getOwnPropertyDescriptor(t, e);
                    },
                    getPrototypeOf () {
                        return Reflect.getPrototypeOf(t);
                    },
                    has (n, e) {
                        return Reflect.has(t, e);
                    },
                    ownKeys () {
                        return Reflect.ownKeys(t);
                    },
                    set (n, e, r) {
                        t[e] = r;
                        delete n[e];
                        return true;
                    }
                });
            }
            function nZ(t, n = {
                scriptable: true,
                indexable: true
            }) {
                const { _scriptable: e = n.scriptable , _indexable: r = n.indexable , _allKeys: o = n.allKeys  } = t;
                return {
                    allKeys: o,
                    scriptable: e,
                    indexable: r,
                    isScriptable: C(e) ? e : ()=>e,
                    isIndexable: C(r) ? r : ()=>r
                };
            }
            const nQ = (t, n)=>t ? t + P(n) : n;
            const nV = (t, n)=>s(n) && t !== 'adapters' && (Object.getPrototypeOf(n) === null || n.constructor === Object);
            function nK(t, n, e) {
                if (Object.prototype.hasOwnProperty.call(t, n)) {
                    return t[n];
                }
                const r = e();
                t[n] = r;
                return r;
            }
            function nU(t, n, e) {
                const { _proxy: r , _context: o , _subProxy: i , _descriptors: s  } = t;
                let u = r[n];
                if (C(u) && s.isScriptable(n)) {
                    u = nJ(n, u, t, e);
                }
                if (c(u) && u.length) {
                    u = nG(n, u, t, s.isIndexable);
                }
                if (nV(n, u)) {
                    u = nz(u, o, i && i[n], s);
                }
                return u;
            }
            function nJ(t, n, e, r) {
                const { _proxy: o , _context: i , _subProxy: c , _stack: s  } = e;
                if (s.has(t)) {
                    throw new Error('Recursion detected: ' + Array.from(s).join('->') + '->' + t);
                }
                s.add(t);
                n = n(i, c || r);
                s.delete(t);
                if (nV(t, n)) {
                    n = n2(o._scopes, o, t, n);
                }
                return n;
            }
            function nG(t, n, e, r) {
                const { _proxy: o , _context: i , _subProxy: c , _descriptors: u  } = e;
                if (R(i.index) && r(t)) {
                    n = n[i.index % n.length];
                } else if (s(n[0])) {
                    const f = n;
                    const a = o._scopes.filter((t)=>t !== f);
                    n = [];
                    for (const l of f){
                        const h = n2(a, o, t, l);
                        n.push(nz(h, i, c && c[t], u));
                    }
                }
                return n;
            }
            function n0(t, n, e) {
                return C(t) ? t(n, e) : t;
            }
            const n1 = (t, n)=>t === true ? n : typeof t === 'string' ? O(n, t) : undefined;
            function n5(t, n, e, r, o) {
                for (const i of n){
                    const c = n1(e, i);
                    if (c) {
                        t.add(c);
                        const s = n0(c._fallback, e, o);
                        if (R(s) && s !== e && s !== r) {
                            return s;
                        }
                    } else if (c === false && R(r) && e !== r) {
                        return null;
                    }
                }
                return false;
            }
            function n2(t, n, e, r) {
                const o = n._rootScopes;
                const i = n0(n._fallback, e, r);
                const c = [
                    ...t,
                    ...o
                ];
                const s = new Set();
                s.add(r);
                let u = n8(s, c, e, i || e, r);
                if (u === null) {
                    return false;
                }
                if (R(i) && i !== e) {
                    u = n8(s, c, i, u, r);
                    if (u === null) {
                        return false;
                    }
                }
                return nq(Array.from(s), [
                    ''
                ], o, i, ()=>n3(n, e, r));
            }
            function n8(t, n, e, r, o) {
                while(e){
                    e = n5(t, n, e, r, o);
                }
                return e;
            }
            function n3(t, n, e) {
                const r = t._getTarget();
                if (!(n in r)) {
                    r[n] = {};
                }
                const o = r[n];
                if (c(o) && s(e)) {
                    return e;
                }
                return o;
            }
            function n4(t, n, e, r) {
                let o;
                for (const i of n){
                    o = n6(nQ(i, t), e);
                    if (R(o)) {
                        return nV(t, o) ? n2(e, r, t, o) : o;
                    }
                }
            }
            function n6(t, n) {
                for (const e of n){
                    if (!e) {
                        continue;
                    }
                    const r = e[t];
                    if (R(r)) {
                        return r;
                    }
                }
            }
            function n7(t) {
                let n = t._keys;
                if (!n) {
                    n = t._keys = n9(t._scopes);
                }
                return n;
            }
            function n9(t) {
                const n = new Set();
                for (const e of t){
                    for (const r of Object.keys(e).filter((t)=>!t.startsWith('_'))){
                        n.add(r);
                    }
                }
                return Array.from(n);
            }
            function et(t, n, e, r) {
                const { iScale: o  } = t;
                const { key: i = 'r'  } = this._parsing;
                const c = new Array(r);
                let s, u, f, a;
                for(s = 0, u = r; s < u; ++s){
                    f = s + e;
                    a = n[f];
                    c[s] = {
                        r: o.parse(O(a, i), f)
                    };
                }
                return c;
            }
            const en = Number.EPSILON || 1e-14;
            const ee = (t, n)=>n < t.length && !t[n].skip && t[n];
            const er = (t)=>t === 'x' ? 'y' : 'x';
            function eo(t, n, e, r) {
                const o = t.skip ? n : t;
                const i = n;
                const c = e.skip ? n : e;
                const s = J(i, o);
                const u = J(c, i);
                let f = s / (s + u);
                let a = u / (s + u);
                f = isNaN(f) ? 0 : f;
                a = isNaN(a) ? 0 : a;
                const l = r * f;
                const h = r * a;
                return {
                    previous: {
                        x: i.x - l * (c.x - o.x),
                        y: i.y - l * (c.y - o.y)
                    },
                    next: {
                        x: i.x + h * (c.x - o.x),
                        y: i.y + h * (c.y - o.y)
                    }
                };
            }
            function ei(t, n, e) {
                const r = t.length;
                let o, i, c, s, u;
                let f = ee(t, 0);
                for(let a = 0; a < r - 1; ++a){
                    u = f;
                    f = ee(t, a + 1);
                    if (!u || !f) {
                        continue;
                    }
                    if (q(n[a], 0, en)) {
                        e[a] = e[a + 1] = 0;
                        continue;
                    }
                    o = e[a] / n[a];
                    i = e[a + 1] / n[a];
                    s = Math.pow(o, 2) + Math.pow(i, 2);
                    if (s <= 9) {
                        continue;
                    }
                    c = 3 / Math.sqrt(s);
                    e[a] = o * c * n[a];
                    e[a + 1] = i * c * n[a];
                }
            }
            function ec(t, n, e = 'x') {
                const r = er(e);
                const o = t.length;
                let i, c, s;
                let u = ee(t, 0);
                for(let f = 0; f < o; ++f){
                    c = s;
                    s = u;
                    u = ee(t, f + 1);
                    if (!s) {
                        continue;
                    }
                    const a = s[e];
                    const l = s[r];
                    if (c) {
                        i = (a - c[e]) / 3;
                        s[`cp1${e}`] = a - i;
                        s[`cp1${r}`] = l - i * n[f];
                    }
                    if (u) {
                        i = (u[e] - a) / 3;
                        s[`cp2${e}`] = a + i;
                        s[`cp2${r}`] = l + i * n[f];
                    }
                }
            }
            function es(t, n = 'x') {
                const e = er(n);
                const r = t.length;
                const o = Array(r).fill(0);
                const i = Array(r);
                let c, s, u;
                let f = ee(t, 0);
                for(c = 0; c < r; ++c){
                    s = u;
                    u = f;
                    f = ee(t, c + 1);
                    if (!u) {
                        continue;
                    }
                    if (f) {
                        const a = f[n] - u[n];
                        o[c] = a !== 0 ? (f[e] - u[e]) / a : 0;
                    }
                    i[c] = !s ? o[c] : !f ? o[c - 1] : (H(o[c - 1]) !== H(o[c])) ? 0 : (o[c - 1] + o[c]) / 2;
                }
                ei(t, o, i);
                ec(t, i, n);
            }
            function eu(t, n, e) {
                return Math.max(Math.min(t, e), n);
            }
            function ef(t, n) {
                let e, r, o, i, c;
                let s = nO(t[0], n);
                for(e = 0, r = t.length; e < r; ++e){
                    c = i;
                    i = s;
                    s = e < r - 1 && nO(t[e + 1], n);
                    if (!i) {
                        continue;
                    }
                    o = t[e];
                    if (c) {
                        o.cp1x = eu(o.cp1x, n.left, n.right);
                        o.cp1y = eu(o.cp1y, n.top, n.bottom);
                    }
                    if (s) {
                        o.cp2x = eu(o.cp2x, n.left, n.right);
                        o.cp2y = eu(o.cp2y, n.top, n.bottom);
                    }
                }
            }
            function ea(t, n, e, r, o) {
                let i, c, s, u;
                if (n.spanGaps) {
                    t = t.filter((t)=>!t.skip);
                }
                if (n.cubicInterpolationMode === 'monotone') {
                    es(t, o);
                } else {
                    let f = r ? t[t.length - 1] : t[0];
                    for(i = 0, c = t.length; i < c; ++i){
                        s = t[i];
                        u = eo(f, s, t[Math.min(i + 1, c - (r ? 0 : 1)) % c], n.tension);
                        s.cp1x = u.previous.x;
                        s.cp1y = u.previous.y;
                        s.cp2x = u.next.x;
                        s.cp2y = u.next.y;
                        f = s;
                    }
                }
                if (n.capBezierPoints) {
                    ef(t, e);
                }
            }
            function el() {
                return typeof window !== 'undefined' && typeof document !== 'undefined';
            }
            function eh(t) {
                let n = t.parentNode;
                if (n && n.toString() === '[object ShadowRoot]') {
                    n = n.host;
                }
                return n;
            }
            function ed(t, n, e) {
                let r;
                if (typeof t === 'string') {
                    r = parseInt(t, 10);
                    if (t.indexOf('%') !== -1) {
                        r = r / 100 * n.parentNode[e];
                    }
                } else {
                    r = t;
                }
                return r;
            }
            const eg = (t)=>window.getComputedStyle(t, null);
            function ep(t, n) {
                return eg(t).getPropertyValue(n);
            }
            const eb = [
                'top',
                'right',
                'bottom',
                'left'
            ];
            function ey(t, n, e) {
                const r = {};
                e = e ? '-' + e : '';
                for(let o = 0; o < 4; o++){
                    const i = eb[o];
                    r[i] = parseFloat(t[n + '-' + i + e]) || 0;
                }
                r.width = r.left + r.right;
                r.height = r.top + r.bottom;
                return r;
            }
            const ex = (t, n, e)=>(t > 0 || n > 0) && (!e || !e.shadowRoot);
            function em(t, n) {
                const e = t.touches;
                const r = e && e.length ? e[0] : t;
                const { offsetX: o , offsetY: i  } = r;
                let c = false;
                let s, u;
                if (ex(o, i, t.target)) {
                    s = o;
                    u = i;
                } else {
                    const f = n.getBoundingClientRect();
                    s = r.clientX - f.left;
                    u = r.clientY - f.top;
                    c = true;
                }
                return {
                    x: s,
                    y: u,
                    box: c
                };
            }
            function ew(t, n) {
                if ('native' in t) {
                    return t;
                }
                const { canvas: e , currentDevicePixelRatio: r  } = n;
                const o = eg(e);
                const i = o.boxSizing === 'border-box';
                const c = ey(o, 'padding');
                const s = ey(o, 'border', 'width');
                const { x: u , y: f , box: a  } = em(t, e);
                const l = c.left + (a && s.left);
                const h = c.top + (a && s.top);
                let { width: d , height: g  } = n;
                if (i) {
                    d -= c.width + s.width;
                    g -= c.height + s.height;
                }
                return {
                    x: Math.round((u - l) / d * e.width / r),
                    y: Math.round((f - h) / g * e.height / r)
                };
            }
            function eM(t, n, e) {
                let r, o;
                if (n === undefined || e === undefined) {
                    const i = eh(t);
                    if (!i) {
                        n = t.clientWidth;
                        e = t.clientHeight;
                    } else {
                        const c = i.getBoundingClientRect();
                        const s = eg(i);
                        const u = ey(s, 'border', 'width');
                        const f = ey(s, 'padding');
                        n = c.width - f.width - u.width;
                        e = c.height - f.height - u.height;
                        r = ed(s.maxWidth, i, 'clientWidth');
                        o = ed(s.maxHeight, i, 'clientHeight');
                    }
                }
                return {
                    width: n,
                    height: e,
                    maxWidth: r || F,
                    maxHeight: o || F
                };
            }
            const ev = (t)=>Math.round(t * 10) / 10;
            function ek(t, n, e, r) {
                const o = eg(t);
                const i = ey(o, 'margin');
                const c = ed(o.maxWidth, t, 'clientWidth') || F;
                const s = ed(o.maxHeight, t, 'clientHeight') || F;
                const u = eM(t, n, e);
                let { width: f , height: a  } = u;
                if (o.boxSizing === 'content-box') {
                    const l = ey(o, 'border', 'width');
                    const h = ey(o, 'padding');
                    f -= h.width + l.width;
                    a -= h.height + l.height;
                }
                f = Math.max(0, f - i.width);
                a = Math.max(0, r ? Math.floor(f / r) : a - i.height);
                f = ev(Math.min(f, c, u.maxWidth));
                a = ev(Math.min(a, s, u.maxHeight));
                if (f && !a) {
                    a = ev(f / 2);
                }
                return {
                    width: f,
                    height: a
                };
            }
            function eO(t, n, e) {
                const r = n || 1;
                const o = Math.floor(t.height * r);
                const i = Math.floor(t.width * r);
                t.height = o / r;
                t.width = i / r;
                const c = t.canvas;
                if (c.style && (e || (!c.style.height && !c.style.width))) {
                    c.style.height = `${t.height}px`;
                    c.style.width = `${t.width}px`;
                }
                if (t.currentDevicePixelRatio !== r || c.height !== o || c.width !== i) {
                    t.currentDevicePixelRatio = r;
                    c.height = o;
                    c.width = i;
                    t.ctx.setTransform(r, 0, 0, r, 0, 0);
                    return true;
                }
                return false;
            }
            const e_ = (function() {
                let t = false;
                try {
                    const n = {
                        get passive () {
                            t = true;
                            return false;
                        }
                    };
                    window.addEventListener('test', null, n);
                    window.removeEventListener('test', null, n);
                } catch (e) {}
                return t;
            }());
            function eT(t, n) {
                const e = ep(t, n);
                const r = e && e.match(/^(\d+)(\.\d+)?px$/);
                return r ? +r[1] : undefined;
            }
            function eP(t, n, e, r) {
                return {
                    x: t.x + e * (n.x - t.x),
                    y: t.y + e * (n.y - t.y)
                };
            }
            function eR(t, n, e, r) {
                return {
                    x: t.x + e * (n.x - t.x),
                    y: r === 'middle' ? e < 0.5 ? t.y : n.y : r === 'after' ? e < 1 ? t.y : n.y : e > 0 ? n.y : t.y
                };
            }
            function eC(t, n, e, r) {
                const o = {
                    x: t.cp2x,
                    y: t.cp2y
                };
                const i = {
                    x: n.cp1x,
                    y: n.cp1y
                };
                const c = eP(t, o, e);
                const s = eP(o, i, e);
                const u = eP(i, n, e);
                const f = eP(c, s, e);
                const a = eP(s, u, e);
                return eP(f, a, e);
            }
            const eS = new Map();
            function eE(t, n) {
                n = n || {};
                const e = t + JSON.stringify(n);
                let r = eS.get(e);
                if (!r) {
                    r = new Intl.NumberFormat(t, n);
                    eS.set(e, r);
                }
                return r;
            }
            function ej(t, n, e) {
                return eE(n, e).format(t);
            }
            const eI = function(t, n) {
                return {
                    x (e) {
                        return t + t + n - e;
                    },
                    setWidth (t) {
                        n = t;
                    },
                    textAlign (t) {
                        if (t === 'center') {
                            return t;
                        }
                        return t === 'right' ? 'left' : 'right';
                    },
                    xPlus (t, n) {
                        return t - n;
                    },
                    leftForLtr (t, n) {
                        return t - n;
                    }
                };
            };
            const eA = function() {
                return {
                    x (t) {
                        return t;
                    },
                    setWidth (t) {},
                    textAlign (t) {
                        return t;
                    },
                    xPlus (t, n) {
                        return t + n;
                    },
                    leftForLtr (t, n) {
                        return t;
                    }
                };
            };
            function eF(t, n, e) {
                return t ? eI(n, e) : eA();
            }
            function eY(t, n) {
                let e, r;
                if (n === 'ltr' || n === 'rtl') {
                    e = t.canvas.style;
                    r = [
                        e.getPropertyValue('direction'),
                        e.getPropertyPriority('direction')
                    ];
                    e.setProperty('direction', n, 'important');
                    t.prevTextDirection = r;
                }
            }
            function eW(t, n) {
                if (n !== undefined) {
                    delete t.prevTextDirection;
                    t.canvas.style.setProperty('direction', n[0], n[1]);
                }
            }
            function eB(t) {
                if (t === 'angle') {
                    return {
                        between: tn,
                        compare: G,
                        normalize: tt
                    };
                }
                return {
                    between: to,
                    compare: (t, n)=>t - n,
                    normalize: (t)=>t
                };
            }
            function eN({ start: t , end: n , count: e , loop: r , style: o  }) {
                return {
                    start: t % e,
                    end: n % e,
                    loop: r && (n - t + 1) % e === 0,
                    style: o
                };
            }
            function eL(t, n, e) {
                const { property: r , start: o , end: i  } = e;
                const { between: c , normalize: s  } = eB(r);
                const u = n.length;
                let { start: f , end: a , loop: l  } = t;
                let h, d;
                if (l) {
                    f += u;
                    a += u;
                    for(h = 0, d = u; h < d; ++h){
                        if (!c(s(n[f % u][r]), o, i)) {
                            break;
                        }
                        f--;
                        a--;
                    }
                    f %= u;
                    a %= u;
                }
                if (a < f) {
                    a += u;
                }
                return {
                    start: f,
                    end: a,
                    loop: l,
                    style: t.style
                };
            }
            function eH(t, n, e) {
                if (!e) {
                    return [
                        t
                    ];
                }
                const { property: r , start: o , end: i  } = e;
                const c = n.length;
                const { compare: s , between: u , normalize: f  } = eB(r);
                const { start: a , end: l , loop: h , style: d  } = eL(t, n, e);
                const g = [];
                let p = false;
                let b = null;
                let y, x, m;
                const w = ()=>u(o, m, y) && s(o, m) !== 0;
                const M = ()=>s(i, y) === 0 || u(i, m, y);
                const v = ()=>p || w();
                const k = ()=>!p || M();
                for(let O = a, _ = a; O <= l; ++O){
                    x = n[O % c];
                    if (x.skip) {
                        continue;
                    }
                    y = f(x[r]);
                    if (y === m) {
                        continue;
                    }
                    p = u(y, o, i);
                    if (b === null && v()) {
                        b = s(y, o) === 0 ? O : _;
                    }
                    if (b !== null && k()) {
                        g.push(eN({
                            start: b,
                            end: O,
                            loop: h,
                            count: c,
                            style: d
                        }));
                        b = null;
                    }
                    _ = O;
                    m = y;
                }
                if (b !== null) {
                    g.push(eN({
                        start: b,
                        end: l,
                        loop: h,
                        count: c,
                        style: d
                    }));
                }
                return g;
            }
            function e$(t, n) {
                const e = [];
                const r = t.segments;
                for(let o = 0; o < r.length; o++){
                    const i = eH(r[o], t.points, n);
                    if (i.length) {
                        e.push(...i);
                    }
                }
                return e;
            }
            function eX(t, n, e, r) {
                let o = 0;
                let i = n - 1;
                if (e && !r) {
                    while(o < n && !t[o].skip){
                        o++;
                    }
                }
                while(o < n && t[o].skip){
                    o++;
                }
                o %= n;
                if (e) {
                    i += o;
                }
                while(i > o && t[i % n].skip){
                    i--;
                }
                i %= n;
                return {
                    start: o,
                    end: i
                };
            }
            function eD(t, n, e, r) {
                const o = t.length;
                const i = [];
                let c = n;
                let s = t[n];
                let u;
                for(u = n + 1; u <= e; ++u){
                    const f = t[u % o];
                    if (f.skip || f.stop) {
                        if (!s.skip) {
                            r = false;
                            i.push({
                                start: n % o,
                                end: (u - 1) % o,
                                loop: r
                            });
                            n = c = f.stop ? u : null;
                        }
                    } else {
                        c = u;
                        if (s.skip) {
                            n = u;
                        }
                    }
                    s = f;
                }
                if (c !== null) {
                    i.push({
                        start: n % o,
                        end: c % o,
                        loop: r
                    });
                }
                return i;
            }
            function eq(t, n) {
                const e = t.points;
                const r = t.options.spanGaps;
                const o = e.length;
                if (!o) {
                    return [];
                }
                const i = !!t._loop;
                const { start: c , end: s  } = eX(e, o, i, r);
                if (r === true) {
                    return ez(t, [
                        {
                            start: c,
                            end: s,
                            loop: i
                        }
                    ], e, n);
                }
                const u = s < c ? s + o : s;
                const f = !!t._fullLoop && c === 0 && s === o - 1;
                return ez(t, eD(e, c, u, f), e, n);
            }
            function ez(t, n, e, r) {
                if (!r || !r.setContext || !e) {
                    return n;
                }
                return eZ(t, n, e, r);
            }
            function eZ(t, n, e, r) {
                const o = t._chart.getContext();
                const i = eQ(t.options);
                const { _datasetIndex: c , options: { spanGaps: s  }  } = t;
                const u = e.length;
                const f = [];
                let a = i;
                let l = n[0].start;
                let h = l;
                function d(t, n, r, o) {
                    const i = s ? -1 : 1;
                    if (t === n) {
                        return;
                    }
                    t += u;
                    while(e[t % u].skip){
                        t -= i;
                    }
                    while(e[n % u].skip){
                        n += i;
                    }
                    if (t % u !== n % u) {
                        f.push({
                            start: t % u,
                            end: n % u,
                            loop: r,
                            style: o
                        });
                        a = o;
                        l = n % u;
                    }
                }
                for (const g of n){
                    l = s ? l : g.start;
                    let p = e[l % u];
                    let b;
                    for(h = l + 1; h <= g.end; h++){
                        const y = e[h % u];
                        b = eQ(r.setContext(nD(o, {
                            type: 'segment',
                            p0: p,
                            p1: y,
                            p0DataIndex: (h - 1) % u,
                            p1DataIndex: h % u,
                            datasetIndex: c
                        })));
                        if (eV(b, a)) {
                            d(l, h - 1, g.loop, a);
                        }
                        p = y;
                        a = b;
                    }
                    if (l < h - 1) {
                        d(l, h - 1, g.loop, a);
                    }
                }
                return f;
            }
            function eQ(t) {
                return {
                    backgroundColor: t.backgroundColor,
                    borderCapStyle: t.borderCapStyle,
                    borderDash: t.borderDash,
                    borderDashOffset: t.borderDashOffset,
                    borderJoinStyle: t.borderJoinStyle,
                    borderWidth: t.borderWidth,
                    borderColor: t.borderColor
                };
            }
            function eV(t, n) {
                return n && JSON.stringify(t) !== JSON.stringify(n);
            }
        })
    }
]);
