"use strict";
(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
    [
        757
    ],
    {
        6775: (function(t, e, s) {
            s.d(e, {
                "kL": function() {
                    return e2;
                },
                "zX": function() {
                    return nl;
                }
            });
            var i = s(2454);
            class n {
                constructor(){
                    this._request = null;
                    this._charts = new Map();
                    this._running = false;
                    this._lastDate = undefined;
                }
                _notify(t, e, s, i) {
                    const n = e.listeners[i];
                    const o = e.duration;
                    n.forEach((i)=>i({
                            chart: t,
                            initial: e.initial,
                            numSteps: o,
                            currentStep: Math.min(s - e.start, o)
                        }));
                }
                _refresh() {
                    if (this._request) {
                        return;
                    }
                    this._running = true;
                    this._request = i.r.call(window, ()=>{
                        this._update();
                        this._request = null;
                        if (this._running) {
                            this._refresh();
                        }
                    });
                }
                _update(t = Date.now()) {
                    let e = 0;
                    this._charts.forEach((s, i)=>{
                        if (!s.running || !s.items.length) {
                            return;
                        }
                        const n = s.items;
                        let o = n.length - 1;
                        let a = false;
                        let r;
                        for(; o >= 0; --o){
                            r = n[o];
                            if (r._active) {
                                if (r._total > s.duration) {
                                    s.duration = r._total;
                                }
                                r.tick(t);
                                a = true;
                            } else {
                                n[o] = n[n.length - 1];
                                n.pop();
                            }
                        }
                        if (a) {
                            i.draw();
                            this._notify(i, s, t, 'progress');
                        }
                        if (!n.length) {
                            s.running = false;
                            this._notify(i, s, t, 'complete');
                            s.initial = false;
                        }
                        e += n.length;
                    });
                    this._lastDate = t;
                    if (e === 0) {
                        this._running = false;
                    }
                }
                _getAnims(t) {
                    const e = this._charts;
                    let s = e.get(t);
                    if (!s) {
                        s = {
                            running: false,
                            initial: true,
                            items: [],
                            listeners: {
                                complete: [],
                                progress: []
                            }
                        };
                        e.set(t, s);
                    }
                    return s;
                }
                listen(t, e, s) {
                    this._getAnims(t).listeners[e].push(s);
                }
                add(t, e) {
                    if (!e || !e.length) {
                        return;
                    }
                    this._getAnims(t).items.push(...e);
                }
                has(t) {
                    return this._getAnims(t).items.length > 0;
                }
                start(t) {
                    const e = this._charts.get(t);
                    if (!e) {
                        return;
                    }
                    e.running = true;
                    e.start = Date.now();
                    e.duration = e.items.reduce((t, e)=>Math.max(t, e._duration), 0);
                    this._refresh();
                }
                running(t) {
                    if (!this._running) {
                        return false;
                    }
                    const e = this._charts.get(t);
                    if (!e || !e.running || !e.items.length) {
                        return false;
                    }
                    return true;
                }
                stop(t) {
                    const e = this._charts.get(t);
                    if (!e || !e.items.length) {
                        return;
                    }
                    const s = e.items;
                    let i = s.length - 1;
                    for(; i >= 0; --i){
                        s[i].cancel();
                    }
                    e.items = [];
                    this._notify(t, e, Date.now(), 'complete');
                }
                remove(t) {
                    return this._charts.delete(t);
                }
            }
            var o = new n();
            const a = 'transparent';
            const r = {
                boolean (t, e, s) {
                    return s > 0.5 ? e : t;
                },
                color (t, e, s) {
                    const n = (0, i.c)(t || a);
                    const o = n.valid && (0, i.c)(e || a);
                    return o && o.valid ? o.mix(n, s).hexString() : e;
                },
                number (t, e, s) {
                    return t + (e - t) * s;
                }
            };
            class l {
                constructor(t, e, s, n){
                    const o = e[s];
                    n = (0, i.a)([
                        t.to,
                        n,
                        o,
                        t.from
                    ]);
                    const a = (0, i.a)([
                        t.from,
                        o,
                        n
                    ]);
                    this._active = true;
                    this._fn = t.fn || r[t.type || typeof a];
                    this._easing = i.e[t.easing] || i.e.linear;
                    this._start = Math.floor(Date.now() + (t.delay || 0));
                    this._duration = this._total = Math.floor(t.duration);
                    this._loop = !!t.loop;
                    this._target = e;
                    this._prop = s;
                    this._from = a;
                    this._to = n;
                    this._promises = undefined;
                }
                active() {
                    return this._active;
                }
                update(t, e, s) {
                    if (this._active) {
                        this._notify(false);
                        const n = this._target[this._prop];
                        const o = s - this._start;
                        const a = this._duration - o;
                        this._start = s;
                        this._duration = Math.floor(Math.max(a, t.duration));
                        this._total += o;
                        this._loop = !!t.loop;
                        this._to = (0, i.a)([
                            t.to,
                            e,
                            n,
                            t.from
                        ]);
                        this._from = (0, i.a)([
                            t.from,
                            n,
                            e
                        ]);
                    }
                }
                cancel() {
                    if (this._active) {
                        this.tick(Date.now());
                        this._active = false;
                        this._notify(false);
                    }
                }
                tick(t) {
                    const e = t - this._start;
                    const s = this._duration;
                    const i = this._prop;
                    const n = this._from;
                    const o = this._loop;
                    const a = this._to;
                    let r;
                    this._active = n !== a && (o || (e < s));
                    if (!this._active) {
                        this._target[i] = a;
                        this._notify(true);
                        return;
                    }
                    if (e < 0) {
                        this._target[i] = n;
                        return;
                    }
                    r = (e / s) % 2;
                    r = o && r > 1 ? 2 - r : r;
                    r = this._easing(Math.min(1, Math.max(0, r)));
                    this._target[i] = this._fn(n, a, r);
                }
                wait() {
                    const t = this._promises || (this._promises = []);
                    return new Promise((e, s)=>{
                        t.push({
                            res: e,
                            rej: s
                        });
                    });
                }
                _notify(t) {
                    const e = t ? 'res' : 'rej';
                    const s = this._promises || [];
                    for(let i = 0; i < s.length; i++){
                        s[i][e]();
                    }
                }
            }
            const c = [
                'x',
                'y',
                'borderWidth',
                'radius',
                'tension'
            ];
            const h = [
                'color',
                'borderColor',
                'backgroundColor'
            ];
            i.d.set('animation', {
                delay: undefined,
                duration: 1000,
                easing: 'easeOutQuart',
                fn: undefined,
                from: undefined,
                loop: undefined,
                to: undefined,
                type: undefined
            });
            const d = Object.keys(i.d.animation);
            i.d.describe('animation', {
                _fallback: false,
                _indexable: false,
                _scriptable: (t)=>t !== 'onProgress' && t !== 'onComplete' && t !== 'fn'
            });
            i.d.set('animations', {
                colors: {
                    type: 'color',
                    properties: h
                },
                numbers: {
                    type: 'number',
                    properties: c
                }
            });
            i.d.describe('animations', {
                _fallback: 'animation'
            });
            i.d.set('transitions', {
                active: {
                    animation: {
                        duration: 400
                    }
                },
                resize: {
                    animation: {
                        duration: 0
                    }
                },
                show: {
                    animations: {
                        colors: {
                            from: 'transparent'
                        },
                        visible: {
                            type: 'boolean',
                            duration: 0
                        }
                    }
                },
                hide: {
                    animations: {
                        colors: {
                            to: 'transparent'
                        },
                        visible: {
                            type: 'boolean',
                            easing: 'linear',
                            fn: (t)=>t | 0
                        }
                    }
                }
            });
            class f {
                constructor(t, e){
                    this._chart = t;
                    this._properties = new Map();
                    this.configure(e);
                }
                configure(t) {
                    if (!(0, i.i)(t)) {
                        return;
                    }
                    const e = this._properties;
                    Object.getOwnPropertyNames(t).forEach((s)=>{
                        const n = t[s];
                        if (!(0, i.i)(n)) {
                            return;
                        }
                        const o = {};
                        for (const a of d){
                            o[a] = n[a];
                        }
                        ((0, i.b)(n.properties) && n.properties || [
                            s
                        ]).forEach((t)=>{
                            if (t === s || !e.has(t)) {
                                e.set(t, o);
                            }
                        });
                    });
                }
                _animateOptions(t, e) {
                    const s = e.options;
                    const i = g(t, s);
                    if (!i) {
                        return [];
                    }
                    const n = this._createAnimations(i, s);
                    if (s.$shared) {
                        u(t.options.$animations, s).then(()=>{
                            t.options = s;
                        }, ()=>{});
                    }
                    return n;
                }
                _createAnimations(t, e) {
                    const s = this._properties;
                    const i = [];
                    const n = t.$animations || (t.$animations = {});
                    const o = Object.keys(e);
                    const a = Date.now();
                    let r;
                    for(r = o.length - 1; r >= 0; --r){
                        const c = o[r];
                        if (c.charAt(0) === '$') {
                            continue;
                        }
                        if (c === 'options') {
                            i.push(...this._animateOptions(t, e));
                            continue;
                        }
                        const h = e[c];
                        let d = n[c];
                        const f = s.get(c);
                        if (d) {
                            if (f && d.active()) {
                                d.update(f, h, a);
                                continue;
                            } else {
                                d.cancel();
                            }
                        }
                        if (!f || !f.duration) {
                            t[c] = h;
                            continue;
                        }
                        n[c] = d = new l(f, t, c, h);
                        i.push(d);
                    }
                    return i;
                }
                update(t, e) {
                    if (this._properties.size === 0) {
                        Object.assign(t, e);
                        return;
                    }
                    const s = this._createAnimations(t, e);
                    if (s.length) {
                        o.add(this._chart, s);
                        return true;
                    }
                }
            }
            function u(t, e) {
                const s = [];
                const i = Object.keys(e);
                for(let n = 0; n < i.length; n++){
                    const o = t[i[n]];
                    if (o && o.active()) {
                        s.push(o.wait());
                    }
                }
                return Promise.all(s);
            }
            function g(t, e) {
                if (!e) {
                    return;
                }
                let s = t.options;
                if (!s) {
                    t.options = e;
                    return;
                }
                if (s.$shared) {
                    t.options = s = Object.assign({}, s, {
                        $shared: false,
                        $animations: {}
                    });
                }
                return s;
            }
            function p(t, e) {
                const s = t && t.options || {};
                const i = s.reverse;
                const n = s.min === undefined ? e : 0;
                const o = s.max === undefined ? e : 0;
                return {
                    start: i ? o : n,
                    end: i ? n : o
                };
            }
            function m(t, e, s) {
                if (s === false) {
                    return false;
                }
                const i = p(t, s);
                const n = p(e, s);
                return {
                    top: n.end,
                    right: i.end,
                    bottom: n.start,
                    left: i.start
                };
            }
            function b(t) {
                let e, s, n, o;
                if ((0, i.i)(t)) {
                    e = t.top;
                    s = t.right;
                    n = t.bottom;
                    o = t.left;
                } else {
                    e = s = n = o = t;
                }
                return {
                    top: e,
                    right: s,
                    bottom: n,
                    left: o,
                    disabled: t === false
                };
            }
            function x(t, e) {
                const s = [];
                const i = t._getSortedDatasetMetas(e);
                let n, o;
                for(n = 0, o = i.length; n < o; ++n){
                    s.push(i[n].index);
                }
                return s;
            }
            function _(t, e, s, n = {}) {
                const o = t.keys;
                const a = n.mode === 'single';
                let r, l, c, h;
                if (e === null) {
                    return;
                }
                for(r = 0, l = o.length; r < l; ++r){
                    c = +o[r];
                    if (c === s) {
                        if (n.all) {
                            continue;
                        }
                        break;
                    }
                    h = t.values[c];
                    if ((0, i.g)(h) && (a || (e === 0 || (0, i.s)(e) === (0, i.s)(h)))) {
                        e += h;
                    }
                }
                return e;
            }
            function y(t) {
                const e = Object.keys(t);
                const s = new Array(e.length);
                let i, n, o;
                for(i = 0, n = e.length; i < n; ++i){
                    o = e[i];
                    s[i] = {
                        x: o,
                        y: t[o]
                    };
                }
                return s;
            }
            function v(t, e) {
                const s = t && t.options.stacked;
                return s || (s === undefined && e.stack !== undefined);
            }
            function M(t, e, s) {
                return `${t.id}.${e.id}.${s.stack || s.type}`;
            }
            function k(t) {
                const { min: e , max: s , minDefined: i , maxDefined: n  } = t.getUserBounds();
                return {
                    min: i ? e : Number.NEGATIVE_INFINITY,
                    max: n ? s : Number.POSITIVE_INFINITY
                };
            }
            function w(t, e, s) {
                const i = t[e] || (t[e] = {});
                return i[s] || (i[s] = {});
            }
            function S(t, e, s, i) {
                for (const n of e.getMatchingVisibleMetas(i).reverse()){
                    const o = t[n.index];
                    if ((s && o > 0) || (!s && o < 0)) {
                        return n.index;
                    }
                }
                return null;
            }
            function P(t, e) {
                const { chart: s , _cachedMeta: i  } = t;
                const n = s._stacks || (s._stacks = {});
                const { iScale: o , vScale: a , index: r  } = i;
                const l = o.axis;
                const c = a.axis;
                const h = M(o, a, i);
                const d = e.length;
                let f;
                for(let u = 0; u < d; ++u){
                    const g = e[u];
                    const { [l]: p , [c]: m  } = g;
                    const b = g._stacks || (g._stacks = {});
                    f = b[c] = w(n, h, p);
                    f[r] = m;
                    f._top = S(f, a, true, i.type);
                    f._bottom = S(f, a, false, i.type);
                }
            }
            function D(t, e) {
                const s = t.scales;
                return Object.keys(s).filter((t)=>s[t].axis === e).shift();
            }
            function C(t, e) {
                return (0, i.h)(t, {
                    active: false,
                    dataset: undefined,
                    datasetIndex: e,
                    index: e,
                    mode: 'default',
                    type: 'dataset'
                });
            }
            function O(t, e, s) {
                return (0, i.h)(t, {
                    active: false,
                    dataIndex: e,
                    parsed: undefined,
                    raw: undefined,
                    element: s,
                    index: e,
                    mode: 'default',
                    type: 'data'
                });
            }
            function L(t, e) {
                const s = t.controller.index;
                const i = t.vScale && t.vScale.axis;
                if (!i) {
                    return;
                }
                e = e || t._parsed;
                for (const n of e){
                    const o = n._stacks;
                    if (!o || o[i] === undefined || o[i][s] === undefined) {
                        return;
                    }
                    delete o[i][s];
                }
            }
            const E = (t)=>t === 'reset' || t === 'none';
            const A = (t, e)=>e ? t : Object.assign({}, t);
            const T = (t, e, s)=>t && !e.hidden && e._stacked && {
                    keys: x(s, true),
                    values: null
                };
            class z {
                constructor(t, e){
                    this.chart = t;
                    this._ctx = t.ctx;
                    this.index = e;
                    this._cachedDataOpts = {};
                    this._cachedMeta = this.getMeta();
                    this._type = this._cachedMeta.type;
                    this.options = undefined;
                    this._parsing = false;
                    this._data = undefined;
                    this._objectData = undefined;
                    this._sharedOptions = undefined;
                    this._drawStart = undefined;
                    this._drawCount = undefined;
                    this.enableOptionSharing = false;
                    this.supportsDecimation = false;
                    this.$context = undefined;
                    this._syncList = [];
                    this.initialize();
                }
                initialize() {
                    const t = this._cachedMeta;
                    this.configure();
                    this.linkScales();
                    t._stacked = v(t.vScale, t);
                    this.addElements();
                }
                updateIndex(t) {
                    if (this.index !== t) {
                        L(this._cachedMeta);
                    }
                    this.index = t;
                }
                linkScales() {
                    const t = this.chart;
                    const e = this._cachedMeta;
                    const s = this.getDataset();
                    const n = (t, e, s, i)=>t === 'x' ? e : t === 'r' ? i : s;
                    const o = e.xAxisID = (0, i.v)(s.xAxisID, D(t, 'x'));
                    const a = e.yAxisID = (0, i.v)(s.yAxisID, D(t, 'y'));
                    const r = e.rAxisID = (0, i.v)(s.rAxisID, D(t, 'r'));
                    const l = e.indexAxis;
                    const c = e.iAxisID = n(l, o, a, r);
                    const h = e.vAxisID = n(l, a, o, r);
                    e.xScale = this.getScaleForId(o);
                    e.yScale = this.getScaleForId(a);
                    e.rScale = this.getScaleForId(r);
                    e.iScale = this.getScaleForId(c);
                    e.vScale = this.getScaleForId(h);
                }
                getDataset() {
                    return this.chart.data.datasets[this.index];
                }
                getMeta() {
                    return this.chart.getDatasetMeta(this.index);
                }
                getScaleForId(t) {
                    return this.chart.scales[t];
                }
                _getOtherScale(t) {
                    const e = this._cachedMeta;
                    return t === e.iScale ? e.vScale : e.iScale;
                }
                reset() {
                    this._update('reset');
                }
                _destroy() {
                    const t = this._cachedMeta;
                    if (this._data) {
                        (0, i.u)(this._data, this);
                    }
                    if (t._stacked) {
                        L(t);
                    }
                }
                _dataCheck() {
                    const t = this.getDataset();
                    const e = t.data || (t.data = []);
                    const s = this._data;
                    if ((0, i.i)(e)) {
                        this._data = y(e);
                    } else if (s !== e) {
                        if (s) {
                            (0, i.u)(s, this);
                            const n = this._cachedMeta;
                            L(n);
                            n._parsed = [];
                        }
                        if (e && Object.isExtensible(e)) {
                            (0, i.l)(e, this);
                        }
                        this._syncList = [];
                        this._data = e;
                    }
                }
                addElements() {
                    const t = this._cachedMeta;
                    this._dataCheck();
                    if (this.datasetElementType) {
                        t.dataset = new this.datasetElementType();
                    }
                }
                buildOrUpdateElements(t) {
                    const e = this._cachedMeta;
                    const s = this.getDataset();
                    let i = false;
                    this._dataCheck();
                    const n = e._stacked;
                    e._stacked = v(e.vScale, e);
                    if (e.stack !== s.stack) {
                        i = true;
                        L(e);
                        e.stack = s.stack;
                    }
                    this._resyncElements(t);
                    if (i || n !== e._stacked) {
                        P(this, e._parsed);
                    }
                }
                configure() {
                    const t = this.chart.config;
                    const e = t.datasetScopeKeys(this._type);
                    const s = t.getOptionScopes(this.getDataset(), e, true);
                    this.options = t.createResolver(s, this.getContext());
                    this._parsing = this.options.parsing;
                    this._cachedDataOpts = {};
                }
                parse(t, e) {
                    const { _cachedMeta: s , _data: n  } = this;
                    const { iScale: o , _stacked: a  } = s;
                    const r = o.axis;
                    let l = t === 0 && e === n.length ? true : s._sorted;
                    let c = t > 0 && s._parsed[t - 1];
                    let h, d, f;
                    if (this._parsing === false) {
                        s._parsed = n;
                        s._sorted = true;
                        f = n;
                    } else {
                        if ((0, i.b)(n[t])) {
                            f = this.parseArrayData(s, n, t, e);
                        } else if ((0, i.i)(n[t])) {
                            f = this.parseObjectData(s, n, t, e);
                        } else {
                            f = this.parsePrimitiveData(s, n, t, e);
                        }
                        const u = ()=>d[r] === null || (c && d[r] < c[r]);
                        for(h = 0; h < e; ++h){
                            s._parsed[h + t] = d = f[h];
                            if (l) {
                                if (u()) {
                                    l = false;
                                }
                                c = d;
                            }
                        }
                        s._sorted = l;
                    }
                    if (a) {
                        P(this, f);
                    }
                }
                parsePrimitiveData(t, e, s, i) {
                    const { iScale: n , vScale: o  } = t;
                    const a = n.axis;
                    const r = o.axis;
                    const l = n.getLabels();
                    const c = n === o;
                    const h = new Array(i);
                    let d, f, u;
                    for(d = 0, f = i; d < f; ++d){
                        u = d + s;
                        h[d] = {
                            [a]: c || n.parse(l[u], u),
                            [r]: o.parse(e[u], u)
                        };
                    }
                    return h;
                }
                parseArrayData(t, e, s, i) {
                    const { xScale: n , yScale: o  } = t;
                    const a = new Array(i);
                    let r, l, c, h;
                    for(r = 0, l = i; r < l; ++r){
                        c = r + s;
                        h = e[c];
                        a[r] = {
                            x: n.parse(h[0], c),
                            y: o.parse(h[1], c)
                        };
                    }
                    return a;
                }
                parseObjectData(t, e, s, n) {
                    const { xScale: o , yScale: a  } = t;
                    const { xAxisKey: r = 'x' , yAxisKey: l = 'y'  } = this._parsing;
                    const c = new Array(n);
                    let h, d, f, u;
                    for(h = 0, d = n; h < d; ++h){
                        f = h + s;
                        u = e[f];
                        c[h] = {
                            x: o.parse((0, i.f)(u, r), f),
                            y: a.parse((0, i.f)(u, l), f)
                        };
                    }
                    return c;
                }
                getParsed(t) {
                    return this._cachedMeta._parsed[t];
                }
                getDataElement(t) {
                    return this._cachedMeta.data[t];
                }
                applyStack(t, e, s) {
                    const i = this.chart;
                    const n = this._cachedMeta;
                    const o = e[t.axis];
                    const a = {
                        keys: x(i, true),
                        values: e._stacks[t.axis]
                    };
                    return _(a, o, n.index, {
                        mode: s
                    });
                }
                updateRangeFromParsed(t, e, s, i) {
                    const n = s[e.axis];
                    let o = n === null ? NaN : n;
                    const a = i && s._stacks[e.axis];
                    if (i && a) {
                        i.values = a;
                        o = _(i, n, this._cachedMeta.index);
                    }
                    t.min = Math.min(t.min, o);
                    t.max = Math.max(t.max, o);
                }
                getMinMax(t, e) {
                    const s = this._cachedMeta;
                    const n = s._parsed;
                    const o = s._sorted && t === s.iScale;
                    const a = n.length;
                    const r = this._getOtherScale(t);
                    const l = T(e, s, this.chart);
                    const c = {
                        min: Number.POSITIVE_INFINITY,
                        max: Number.NEGATIVE_INFINITY
                    };
                    const { min: h , max: d  } = k(r);
                    let f, u;
                    function g() {
                        u = n[f];
                        const e = u[r.axis];
                        return !(0, i.g)(u[t.axis]) || h > e || d < e;
                    }
                    for(f = 0; f < a; ++f){
                        if (g()) {
                            continue;
                        }
                        this.updateRangeFromParsed(c, t, u, l);
                        if (o) {
                            break;
                        }
                    }
                    if (o) {
                        for(f = a - 1; f >= 0; --f){
                            if (g()) {
                                continue;
                            }
                            this.updateRangeFromParsed(c, t, u, l);
                            break;
                        }
                    }
                    return c;
                }
                getAllParsedValues(t) {
                    const e = this._cachedMeta._parsed;
                    const s = [];
                    let n, o, a;
                    for(n = 0, o = e.length; n < o; ++n){
                        a = e[n][t.axis];
                        if ((0, i.g)(a)) {
                            s.push(a);
                        }
                    }
                    return s;
                }
                getMaxOverflow() {
                    return false;
                }
                getLabelAndValue(t) {
                    const e = this._cachedMeta;
                    const s = e.iScale;
                    const i = e.vScale;
                    const n = this.getParsed(t);
                    return {
                        label: s ? '' + s.getLabelForValue(n[s.axis]) : '',
                        value: i ? '' + i.getLabelForValue(n[i.axis]) : ''
                    };
                }
                _update(t) {
                    const e = this._cachedMeta;
                    this.update(t || 'default');
                    e._clip = b((0, i.v)(this.options.clip, m(e.xScale, e.yScale, this.getMaxOverflow())));
                }
                update(t) {}
                draw() {
                    const t = this._ctx;
                    const e = this.chart;
                    const s = this._cachedMeta;
                    const i = s.data || [];
                    const n = e.chartArea;
                    const o = [];
                    const a = this._drawStart || 0;
                    const r = this._drawCount || (i.length - a);
                    const l = this.options.drawActiveElementsOnTop;
                    let c;
                    if (s.dataset) {
                        s.dataset.draw(t, n, a, r);
                    }
                    for(c = a; c < a + r; ++c){
                        const h = i[c];
                        if (h.hidden) {
                            continue;
                        }
                        if (h.active && l) {
                            o.push(h);
                        } else {
                            h.draw(t, n);
                        }
                    }
                    for(c = 0; c < o.length; ++c){
                        o[c].draw(t, n);
                    }
                }
                getStyle(t, e) {
                    const s = e ? 'active' : 'default';
                    return t === undefined && this._cachedMeta.dataset ? this.resolveDatasetElementOptions(s) : this.resolveDataElementOptions(t || 0, s);
                }
                getContext(t, e, s) {
                    const i = this.getDataset();
                    let n;
                    if (t >= 0 && t < this._cachedMeta.data.length) {
                        const o = this._cachedMeta.data[t];
                        n = o.$context || (o.$context = O(this.getContext(), t, o));
                        n.parsed = this.getParsed(t);
                        n.raw = i.data[t];
                        n.index = n.dataIndex = t;
                    } else {
                        n = this.$context || (this.$context = C(this.chart.getContext(), this.index));
                        n.dataset = i;
                        n.index = n.datasetIndex = this.index;
                    }
                    n.active = !!e;
                    n.mode = s;
                    return n;
                }
                resolveDatasetElementOptions(t) {
                    return this._resolveElementOptions(this.datasetElementType.id, t);
                }
                resolveDataElementOptions(t, e) {
                    return this._resolveElementOptions(this.dataElementType.id, e, t);
                }
                _resolveElementOptions(t, e = 'default', s) {
                    const n = e === 'active';
                    const o = this._cachedDataOpts;
                    const a = t + '-' + e;
                    const r = o[a];
                    const l = this.enableOptionSharing && (0, i.j)(s);
                    if (r) {
                        return A(r, l);
                    }
                    const c = this.chart.config;
                    const h = c.datasetElementScopeKeys(this._type, t);
                    const d = n ? [
                        `${t}Hover`,
                        'hover',
                        t,
                        ''
                    ] : [
                        t,
                        ''
                    ];
                    const f = c.getOptionScopes(this.getDataset(), h);
                    const u = Object.keys(i.d.elements[t]);
                    const g = ()=>this.getContext(s, n);
                    const p = c.resolveNamedOptions(f, u, g, d);
                    if (p.$shared) {
                        p.$shared = l;
                        o[a] = Object.freeze(A(p, l));
                    }
                    return p;
                }
                _resolveAnimations(t, e, s) {
                    const i = this.chart;
                    const n = this._cachedDataOpts;
                    const o = `animation-${e}`;
                    const a = n[o];
                    if (a) {
                        return a;
                    }
                    let r;
                    if (i.options.animation !== false) {
                        const l = this.chart.config;
                        const c = l.datasetAnimationScopeKeys(this._type, e);
                        const h = l.getOptionScopes(this.getDataset(), c);
                        r = l.createResolver(h, this.getContext(t, s, e));
                    }
                    const d = new f(i, r && r.animations);
                    if (r && r._cacheable) {
                        n[o] = Object.freeze(d);
                    }
                    return d;
                }
                getSharedOptions(t) {
                    if (!t.$shared) {
                        return;
                    }
                    return this._sharedOptions || (this._sharedOptions = Object.assign({}, t));
                }
                includeOptions(t, e) {
                    return !e || E(t) || this.chart._animationsDisabled;
                }
                _getSharedOptions(t, e) {
                    const s = this.resolveDataElementOptions(t, e);
                    const i = this._sharedOptions;
                    const n = this.getSharedOptions(s);
                    const o = this.includeOptions(e, n) || (n !== i);
                    this.updateSharedOptions(n, e, s);
                    return {
                        sharedOptions: n,
                        includeOptions: o
                    };
                }
                updateElement(t, e, s, i) {
                    if (E(i)) {
                        Object.assign(t, s);
                    } else {
                        this._resolveAnimations(e, i).update(t, s);
                    }
                }
                updateSharedOptions(t, e, s) {
                    if (t && !E(e)) {
                        this._resolveAnimations(undefined, e).update(t, s);
                    }
                }
                _setStyle(t, e, s, i) {
                    t.active = i;
                    const n = this.getStyle(e, i);
                    this._resolveAnimations(e, s, i).update(t, {
                        options: (!i && this.getSharedOptions(n)) || n
                    });
                }
                removeHoverStyle(t, e, s) {
                    this._setStyle(t, s, 'active', false);
                }
                setHoverStyle(t, e, s) {
                    this._setStyle(t, s, 'active', true);
                }
                _removeDatasetHoverStyle() {
                    const t = this._cachedMeta.dataset;
                    if (t) {
                        this._setStyle(t, undefined, 'active', false);
                    }
                }
                _setDatasetHoverStyle() {
                    const t = this._cachedMeta.dataset;
                    if (t) {
                        this._setStyle(t, undefined, 'active', true);
                    }
                }
                _resyncElements(t) {
                    const e = this._data;
                    const s = this._cachedMeta.data;
                    for (const [i, n, o] of this._syncList){
                        this[i](n, o);
                    }
                    this._syncList = [];
                    const a = s.length;
                    const r = e.length;
                    const l = Math.min(r, a);
                    if (l) {
                        this.parse(0, l);
                    }
                    if (r > a) {
                        this._insertElements(a, r - a, t);
                    } else if (r < a) {
                        this._removeElements(r, a - r);
                    }
                }
                _insertElements(t, e, s = true) {
                    const i = this._cachedMeta;
                    const n = i.data;
                    const o = t + e;
                    let a;
                    const r = (t)=>{
                        t.length += e;
                        for(a = t.length - 1; a >= o; a--){
                            t[a] = t[a - e];
                        }
                    };
                    r(n);
                    for(a = t; a < o; ++a){
                        n[a] = new this.dataElementType();
                    }
                    if (this._parsing) {
                        r(i._parsed);
                    }
                    this.parse(t, e);
                    if (s) {
                        this.updateElements(n, t, e, 'reset');
                    }
                }
                updateElements(t, e, s, i) {}
                _removeElements(t, e) {
                    const s = this._cachedMeta;
                    if (this._parsing) {
                        const i = s._parsed.splice(t, e);
                        if (s._stacked) {
                            L(s, i);
                        }
                    }
                    s.data.splice(t, e);
                }
                _sync(t) {
                    if (this._parsing) {
                        this._syncList.push(t);
                    } else {
                        const [e, s, i] = t;
                        this[e](s, i);
                    }
                    this.chart._dataChanges.push([
                        this.index,
                        ...t
                    ]);
                }
                _onDataPush() {
                    const t = arguments.length;
                    this._sync([
                        '_insertElements',
                        this.getDataset().data.length - t,
                        t
                    ]);
                }
                _onDataPop() {
                    this._sync([
                        '_removeElements',
                        this._cachedMeta.data.length - 1,
                        1
                    ]);
                }
                _onDataShift() {
                    this._sync([
                        '_removeElements',
                        0,
                        1
                    ]);
                }
                _onDataSplice(t, e) {
                    if (e) {
                        this._sync([
                            '_removeElements',
                            t,
                            e
                        ]);
                    }
                    const s = arguments.length - 2;
                    if (s) {
                        this._sync([
                            '_insertElements',
                            t,
                            s
                        ]);
                    }
                }
                _onDataUnshift() {
                    this._sync([
                        '_insertElements',
                        0,
                        arguments.length
                    ]);
                }
            }
            z.defaults = {};
            z.prototype.datasetElementType = null;
            z.prototype.dataElementType = null;
            function R(t, e) {
                if (!t._cache.$bar) {
                    const s = t.getMatchingVisibleMetas(e);
                    let n = [];
                    for(let o = 0, a = s.length; o < a; o++){
                        n = n.concat(s[o].controller.getAllParsedValues(t));
                    }
                    t._cache.$bar = (0, i._)(n.sort((t, e)=>t - e));
                }
                return t._cache.$bar;
            }
            function F(t) {
                const e = t.iScale;
                const s = R(e, t.type);
                let n = e._length;
                let o, a, r, l;
                const c = ()=>{
                    if (r === 32767 || r === -32768) {
                        return;
                    }
                    if ((0, i.j)(l)) {
                        n = Math.min(n, Math.abs(r - l) || n);
                    }
                    l = r;
                };
                for(o = 0, a = s.length; o < a; ++o){
                    r = e.getPixelForValue(s[o]);
                    c();
                }
                l = undefined;
                for(o = 0, a = e.ticks.length; o < a; ++o){
                    r = e.getPixelForTick(o);
                    c();
                }
                return n;
            }
            function I(t, e, s, n) {
                const o = s.barThickness;
                let a, r;
                if ((0, i.k)(o)) {
                    a = e.min * s.categoryPercentage;
                    r = s.barPercentage;
                } else {
                    a = o * n;
                    r = 1;
                }
                return {
                    chunk: a / n,
                    ratio: r,
                    start: e.pixels[t] - (a / 2)
                };
            }
            function V(t, e, s, i) {
                const n = e.pixels;
                const o = n[t];
                let a = t > 0 ? n[t - 1] : null;
                let r = t < n.length - 1 ? n[t + 1] : null;
                const l = s.categoryPercentage;
                if (a === null) {
                    a = o - (r === null ? e.end - e.start : r - o);
                }
                if (r === null) {
                    r = o + o - a;
                }
                const c = o - (o - Math.min(a, r)) / 2 * l;
                const h = Math.abs(r - a) / 2 * l;
                return {
                    chunk: h / i,
                    ratio: s.barPercentage,
                    start: c
                };
            }
            function B(t, e, s, i) {
                const n = s.parse(t[0], i);
                const o = s.parse(t[1], i);
                const a = Math.min(n, o);
                const r = Math.max(n, o);
                let l = a;
                let c = r;
                if (Math.abs(a) > Math.abs(r)) {
                    l = r;
                    c = a;
                }
                e[s.axis] = c;
                e._custom = {
                    barStart: l,
                    barEnd: c,
                    start: n,
                    end: o,
                    min: a,
                    max: r
                };
            }
            function N(t, e, s, n) {
                if ((0, i.b)(t)) {
                    B(t, e, s, n);
                } else {
                    e[s.axis] = s.parse(t, n);
                }
                return e;
            }
            function H(t, e, s, i) {
                const n = t.iScale;
                const o = t.vScale;
                const a = n.getLabels();
                const r = n === o;
                const l = [];
                let c, h, d, f;
                for(c = s, h = s + i; c < h; ++c){
                    f = e[c];
                    d = {};
                    d[n.axis] = r || n.parse(a[c], c);
                    l.push(N(f, d, o, c));
                }
                return l;
            }
            function W(t) {
                return t && t.barStart !== undefined && t.barEnd !== undefined;
            }
            function j(t, e, s) {
                if (t !== 0) {
                    return (0, i.s)(t);
                }
                return (e.isHorizontal() ? 1 : -1) * (e.min >= s ? 1 : -1);
            }
            function $(t) {
                let e, s, i, n, o;
                if (t.horizontal) {
                    e = t.base > t.x;
                    s = 'left';
                    i = 'right';
                } else {
                    e = t.base < t.y;
                    s = 'bottom';
                    i = 'top';
                }
                if (e) {
                    n = 'end';
                    o = 'start';
                } else {
                    n = 'start';
                    o = 'end';
                }
                return {
                    start: s,
                    end: i,
                    reverse: e,
                    top: n,
                    bottom: o
                };
            }
            function U(t, e, s, i) {
                let n = e.borderSkipped;
                const o = {};
                if (!n) {
                    t.borderSkipped = o;
                    return;
                }
                if (n === true) {
                    t.borderSkipped = {
                        top: true,
                        right: true,
                        bottom: true,
                        left: true
                    };
                    return;
                }
                const { start: a , end: r , reverse: l , top: c , bottom: h  } = $(t);
                if (n === 'middle' && s) {
                    t.enableBorderRadius = true;
                    if ((s._top || 0) === i) {
                        n = c;
                    } else if ((s._bottom || 0) === i) {
                        n = h;
                    } else {
                        o[Y(h, a, r, l)] = true;
                        n = c;
                    }
                }
                o[Y(n, a, r, l)] = true;
                t.borderSkipped = o;
            }
            function Y(t, e, s, i) {
                if (i) {
                    t = K(t, e, s);
                    t = Q(t, s, e);
                } else {
                    t = Q(t, e, s);
                }
                return t;
            }
            function K(t, e, s) {
                return t === e ? s : t === s ? e : t;
            }
            function Q(t, e, s) {
                return t === 'start' ? e : t === 'end' ? s : t;
            }
            function X(t, { inflateAmount: e  }, s) {
                t.inflateAmount = e === 'auto' ? s === 1 ? 0.33 : 0 : e;
            }
            class G extends z {
                parsePrimitiveData(t, e, s, i) {
                    return H(t, e, s, i);
                }
                parseArrayData(t, e, s, i) {
                    return H(t, e, s, i);
                }
                parseObjectData(t, e, s, n) {
                    const { iScale: o , vScale: a  } = t;
                    const { xAxisKey: r = 'x' , yAxisKey: l = 'y'  } = this._parsing;
                    const c = o.axis === 'x' ? r : l;
                    const h = a.axis === 'x' ? r : l;
                    const d = [];
                    let f, u, g, p;
                    for(f = s, u = s + n; f < u; ++f){
                        p = e[f];
                        g = {};
                        g[o.axis] = o.parse((0, i.f)(p, c), f);
                        d.push(N((0, i.f)(p, h), g, a, f));
                    }
                    return d;
                }
                updateRangeFromParsed(t, e, s, i) {
                    super.updateRangeFromParsed(t, e, s, i);
                    const n = s._custom;
                    if (n && e === this._cachedMeta.vScale) {
                        t.min = Math.min(t.min, n.min);
                        t.max = Math.max(t.max, n.max);
                    }
                }
                getMaxOverflow() {
                    return 0;
                }
                getLabelAndValue(t) {
                    const e = this._cachedMeta;
                    const { iScale: s , vScale: i  } = e;
                    const n = this.getParsed(t);
                    const o = n._custom;
                    const a = W(o) ? '[' + o.start + ', ' + o.end + ']' : '' + i.getLabelForValue(n[i.axis]);
                    return {
                        label: '' + s.getLabelForValue(n[s.axis]),
                        value: a
                    };
                }
                initialize() {
                    this.enableOptionSharing = true;
                    super.initialize();
                    const t = this._cachedMeta;
                    t.stack = this.getDataset().stack;
                }
                update(t) {
                    const e = this._cachedMeta;
                    this.updateElements(e.data, 0, e.data.length, t);
                }
                updateElements(t, e, s, n) {
                    const o = n === 'reset';
                    const { index: a , _cachedMeta: { vScale: r  }  } = this;
                    const l = r.getBasePixel();
                    const c = r.isHorizontal();
                    const h = this._getRuler();
                    const { sharedOptions: d , includeOptions: f  } = this._getSharedOptions(e, n);
                    for(let u = e; u < e + s; u++){
                        const g = this.getParsed(u);
                        const p = o || (0, i.k)(g[r.axis]) ? {
                            base: l,
                            head: l
                        } : this._calculateBarValuePixels(u);
                        const m = this._calculateBarIndexPixels(u, h);
                        const b = (g._stacks || {})[r.axis];
                        const x = {
                            horizontal: c,
                            base: p.base,
                            enableBorderRadius: !b || W(g._custom) || (a === b._top || a === b._bottom),
                            x: c ? p.head : m.center,
                            y: c ? m.center : p.head,
                            height: c ? m.size : Math.abs(p.size),
                            width: c ? Math.abs(p.size) : m.size
                        };
                        if (f) {
                            x.options = d || this.resolveDataElementOptions(u, t[u].active ? 'active' : n);
                        }
                        const _ = x.options || t[u].options;
                        U(x, _, b, a);
                        X(x, _, h.ratio);
                        this.updateElement(t[u], u, x, n);
                    }
                }
                _getStacks(t, e) {
                    const { iScale: s  } = this._cachedMeta;
                    const n = s.getMatchingVisibleMetas(this._type).filter((t)=>t.controller.options.grouped);
                    const o = s.options.stacked;
                    const a = [];
                    const r = (t)=>{
                        const s = t.controller.getParsed(e);
                        const n = s && s[t.vScale.axis];
                        if ((0, i.k)(n) || isNaN(n)) {
                            return true;
                        }
                    };
                    for (const l of n){
                        if (e !== undefined && r(l)) {
                            continue;
                        }
                        if (o === false || a.indexOf(l.stack) === -1 || (o === undefined && l.stack === undefined)) {
                            a.push(l.stack);
                        }
                        if (l.index === t) {
                            break;
                        }
                    }
                    if (!a.length) {
                        a.push(undefined);
                    }
                    return a;
                }
                _getStackCount(t) {
                    return this._getStacks(undefined, t).length;
                }
                _getStackIndex(t, e, s) {
                    const i = this._getStacks(t, s);
                    const n = (e !== undefined) ? i.indexOf(e) : -1;
                    return (n === -1) ? i.length - 1 : n;
                }
                _getRuler() {
                    const t = this.options;
                    const e = this._cachedMeta;
                    const s = e.iScale;
                    const i = [];
                    let n, o;
                    for(n = 0, o = e.data.length; n < o; ++n){
                        i.push(s.getPixelForValue(this.getParsed(n)[s.axis], n));
                    }
                    const a = t.barThickness;
                    const r = a || F(e);
                    return {
                        min: r,
                        pixels: i,
                        start: s._startPixel,
                        end: s._endPixel,
                        stackCount: this._getStackCount(),
                        scale: s,
                        grouped: t.grouped,
                        ratio: a ? 1 : t.categoryPercentage * t.barPercentage
                    };
                }
                _calculateBarValuePixels(t) {
                    const { _cachedMeta: { vScale: e , _stacked: s  } , options: { base: n , minBarLength: o  }  } = this;
                    const a = n || 0;
                    const r = this.getParsed(t);
                    const l = r._custom;
                    const c = W(l);
                    let h = r[e.axis];
                    let d = 0;
                    let f = s ? this.applyStack(e, r, s) : h;
                    let u, g;
                    if (f !== h) {
                        d = f - h;
                        f = h;
                    }
                    if (c) {
                        h = l.barStart;
                        f = l.barEnd - l.barStart;
                        if (h !== 0 && (0, i.s)(h) !== (0, i.s)(l.barEnd)) {
                            d = 0;
                        }
                        d += h;
                    }
                    const p = !(0, i.k)(n) && !c ? n : d;
                    let m = e.getPixelForValue(p);
                    if (this.chart.getDataVisibility(t)) {
                        u = e.getPixelForValue(d + f);
                    } else {
                        u = m;
                    }
                    g = u - m;
                    if (Math.abs(g) < o) {
                        g = j(g, e, a) * o;
                        if (h === a) {
                            m -= g / 2;
                        }
                        const b = e.getPixelForDecimal(0);
                        const x = e.getPixelForDecimal(1);
                        const _ = Math.min(b, x);
                        const y = Math.max(b, x);
                        m = Math.max(Math.min(m, y), _);
                        u = m + g;
                    }
                    if (m === e.getPixelForValue(a)) {
                        const v = (0, i.s)(g) * e.getLineWidthForValue(a) / 2;
                        m += v;
                        g -= v;
                    }
                    return {
                        size: g,
                        base: m,
                        head: u,
                        center: u + g / 2
                    };
                }
                _calculateBarIndexPixels(t, e) {
                    const s = e.scale;
                    const n = this.options;
                    const o = n.skipNull;
                    const a = (0, i.v)(n.maxBarThickness, Infinity);
                    let r, l;
                    if (e.grouped) {
                        const c = o ? this._getStackCount(t) : e.stackCount;
                        const h = n.barThickness === 'flex' ? V(t, e, n, c) : I(t, e, n, c);
                        const d = this._getStackIndex(this.index, this._cachedMeta.stack, o ? t : undefined);
                        r = h.start + (h.chunk * d) + (h.chunk / 2);
                        l = Math.min(a, h.chunk * h.ratio);
                    } else {
                        r = s.getPixelForValue(this.getParsed(t)[s.axis], t);
                        l = Math.min(a, e.min * e.ratio);
                    }
                    return {
                        base: r - l / 2,
                        head: r + l / 2,
                        center: r,
                        size: l
                    };
                }
                draw() {
                    const t = this._cachedMeta;
                    const e = t.vScale;
                    const s = t.data;
                    const i = s.length;
                    let n = 0;
                    for(; n < i; ++n){
                        if (this.getParsed(n)[e.axis] !== null) {
                            s[n].draw(this._ctx);
                        }
                    }
                }
            }
            G.id = 'bar';
            G.defaults = {
                datasetElementType: false,
                dataElementType: 'bar',
                categoryPercentage: 0.8,
                barPercentage: 0.9,
                grouped: true,
                animations: {
                    numbers: {
                        type: 'number',
                        properties: [
                            'x',
                            'y',
                            'base',
                            'width',
                            'height'
                        ]
                    }
                }
            };
            G.overrides = {
                scales: {
                    _index_: {
                        type: 'category',
                        offset: true,
                        grid: {
                            offset: true
                        }
                    },
                    _value_: {
                        type: 'linear',
                        beginAtZero: true
                    }
                }
            };
            class q extends z {
                initialize() {
                    this.enableOptionSharing = true;
                    super.initialize();
                }
                parsePrimitiveData(t, e, s, i) {
                    const n = super.parsePrimitiveData(t, e, s, i);
                    for(let o = 0; o < n.length; o++){
                        n[o]._custom = this.resolveDataElementOptions(o + s).radius;
                    }
                    return n;
                }
                parseArrayData(t, e, s, n) {
                    const o = super.parseArrayData(t, e, s, n);
                    for(let a = 0; a < o.length; a++){
                        const r = e[s + a];
                        o[a]._custom = (0, i.v)(r[2], this.resolveDataElementOptions(a + s).radius);
                    }
                    return o;
                }
                parseObjectData(t, e, s, n) {
                    const o = super.parseObjectData(t, e, s, n);
                    for(let a = 0; a < o.length; a++){
                        const r = e[s + a];
                        o[a]._custom = (0, i.v)(r && r.r && +r.r, this.resolveDataElementOptions(a + s).radius);
                    }
                    return o;
                }
                getMaxOverflow() {
                    const t = this._cachedMeta.data;
                    let e = 0;
                    for(let s = t.length - 1; s >= 0; --s){
                        e = Math.max(e, t[s].size(this.resolveDataElementOptions(s)) / 2);
                    }
                    return e > 0 && e;
                }
                getLabelAndValue(t) {
                    const e = this._cachedMeta;
                    const { xScale: s , yScale: i  } = e;
                    const n = this.getParsed(t);
                    const o = s.getLabelForValue(n.x);
                    const a = i.getLabelForValue(n.y);
                    const r = n._custom;
                    return {
                        label: e.label,
                        value: '(' + o + ', ' + a + (r ? ', ' + r : '') + ')'
                    };
                }
                update(t) {
                    const e = this._cachedMeta.data;
                    this.updateElements(e, 0, e.length, t);
                }
                updateElements(t, e, s, i) {
                    const n = i === 'reset';
                    const { iScale: o , vScale: a  } = this._cachedMeta;
                    const { sharedOptions: r , includeOptions: l  } = this._getSharedOptions(e, i);
                    const c = o.axis;
                    const h = a.axis;
                    for(let d = e; d < e + s; d++){
                        const f = t[d];
                        const u = !n && this.getParsed(d);
                        const g = {};
                        const p = g[c] = n ? o.getPixelForDecimal(0.5) : o.getPixelForValue(u[c]);
                        const m = g[h] = n ? a.getBasePixel() : a.getPixelForValue(u[h]);
                        g.skip = isNaN(p) || isNaN(m);
                        if (l) {
                            g.options = r || this.resolveDataElementOptions(d, f.active ? 'active' : i);
                            if (n) {
                                g.options.radius = 0;
                            }
                        }
                        this.updateElement(f, d, g, i);
                    }
                }
                resolveDataElementOptions(t, e) {
                    const s = this.getParsed(t);
                    let n = super.resolveDataElementOptions(t, e);
                    if (n.$shared) {
                        n = Object.assign({}, n, {
                            $shared: false
                        });
                    }
                    const o = n.radius;
                    if (e !== 'active') {
                        n.radius = 0;
                    }
                    n.radius += (0, i.v)(s && s._custom, o);
                    return n;
                }
            }
            q.id = 'bubble';
            q.defaults = {
                datasetElementType: false,
                dataElementType: 'point',
                animations: {
                    numbers: {
                        type: 'number',
                        properties: [
                            'x',
                            'y',
                            'borderWidth',
                            'radius'
                        ]
                    }
                }
            };
            q.overrides = {
                scales: {
                    x: {
                        type: 'linear'
                    },
                    y: {
                        type: 'linear'
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            title () {
                                return '';
                            }
                        }
                    }
                }
            };
            function J(t, e, s) {
                let n = 1;
                let o = 1;
                let a = 0;
                let r = 0;
                if (e < i.T) {
                    const l = t;
                    const c = l + e;
                    const h = Math.cos(l);
                    const d = Math.sin(l);
                    const f = Math.cos(c);
                    const u = Math.sin(c);
                    const g = (t, e, n)=>(0, i.p)(t, l, c, true) ? 1 : Math.max(e, e * s, n, n * s);
                    const p = (t, e, n)=>(0, i.p)(t, l, c, true) ? -1 : Math.min(e, e * s, n, n * s);
                    const m = g(0, h, f);
                    const b = g(i.H, d, u);
                    const x = p(i.P, h, f);
                    const _ = p(i.P + i.H, d, u);
                    n = (m - x) / 2;
                    o = (b - _) / 2;
                    a = -(m + x) / 2;
                    r = -(b + _) / 2;
                }
                return {
                    ratioX: n,
                    ratioY: o,
                    offsetX: a,
                    offsetY: r
                };
            }
            class Z extends z {
                constructor(t, e){
                    super(t, e);
                    this.enableOptionSharing = true;
                    this.innerRadius = undefined;
                    this.outerRadius = undefined;
                    this.offsetX = undefined;
                    this.offsetY = undefined;
                }
                linkScales() {}
                parse(t, e) {
                    const s = this.getDataset().data;
                    const n = this._cachedMeta;
                    if (this._parsing === false) {
                        n._parsed = s;
                    } else {
                        let o = (t)=>+s[t];
                        if ((0, i.i)(s[t])) {
                            const { key: a = 'value'  } = this._parsing;
                            o = (t)=>+(0, i.f)(s[t], a);
                        }
                        let r, l;
                        for(r = t, l = t + e; r < l; ++r){
                            n._parsed[r] = o(r);
                        }
                    }
                }
                _getRotation() {
                    return (0, i.t)(this.options.rotation - 90);
                }
                _getCircumference() {
                    return (0, i.t)(this.options.circumference);
                }
                _getRotationExtents() {
                    let t = i.T;
                    let e = -i.T;
                    for(let s = 0; s < this.chart.data.datasets.length; ++s){
                        if (this.chart.isDatasetVisible(s)) {
                            const n = this.chart.getDatasetMeta(s).controller;
                            const o = n._getRotation();
                            const a = n._getCircumference();
                            t = Math.min(t, o);
                            e = Math.max(e, o + a);
                        }
                    }
                    return {
                        rotation: t,
                        circumference: e - t
                    };
                }
                update(t) {
                    const e = this.chart;
                    const { chartArea: s  } = e;
                    const n = this._cachedMeta;
                    const o = n.data;
                    const a = this.getMaxBorderWidth() + this.getMaxOffset(o) + this.options.spacing;
                    const r = Math.max((Math.min(s.width, s.height) - a) / 2, 0);
                    const l = Math.min((0, i.m)(this.options.cutout, r), 1);
                    const c = this._getRingWeight(this.index);
                    const { circumference: h , rotation: d  } = this._getRotationExtents();
                    const { ratioX: f , ratioY: u , offsetX: g , offsetY: p  } = J(d, h, l);
                    const m = (s.width - a) / f;
                    const b = (s.height - a) / u;
                    const x = Math.max(Math.min(m, b) / 2, 0);
                    const _ = (0, i.n)(this.options.radius, x);
                    const y = Math.max(_ * l, 0);
                    const v = (_ - y) / this._getVisibleDatasetWeightTotal();
                    this.offsetX = g * _;
                    this.offsetY = p * _;
                    n.total = this.calculateTotal();
                    this.outerRadius = _ - v * this._getRingWeightOffset(this.index);
                    this.innerRadius = Math.max(this.outerRadius - v * c, 0);
                    this.updateElements(o, 0, o.length, t);
                }
                _circumference(t, e) {
                    const s = this.options;
                    const n = this._cachedMeta;
                    const o = this._getCircumference();
                    if ((e && s.animation.animateRotate) || !this.chart.getDataVisibility(t) || n._parsed[t] === null || n.data[t].hidden) {
                        return 0;
                    }
                    return this.calculateCircumference(n._parsed[t] * o / i.T);
                }
                updateElements(t, e, s, i) {
                    const n = i === 'reset';
                    const o = this.chart;
                    const a = o.chartArea;
                    const r = o.options;
                    const l = r.animation;
                    const c = (a.left + a.right) / 2;
                    const h = (a.top + a.bottom) / 2;
                    const d = n && l.animateScale;
                    const f = d ? 0 : this.innerRadius;
                    const u = d ? 0 : this.outerRadius;
                    const { sharedOptions: g , includeOptions: p  } = this._getSharedOptions(e, i);
                    let m = this._getRotation();
                    let b;
                    for(b = 0; b < e; ++b){
                        m += this._circumference(b, n);
                    }
                    for(b = e; b < e + s; ++b){
                        const x = this._circumference(b, n);
                        const _ = t[b];
                        const y = {
                            x: c + this.offsetX,
                            y: h + this.offsetY,
                            startAngle: m,
                            endAngle: m + x,
                            circumference: x,
                            outerRadius: u,
                            innerRadius: f
                        };
                        if (p) {
                            y.options = g || this.resolveDataElementOptions(b, _.active ? 'active' : i);
                        }
                        m += x;
                        this.updateElement(_, b, y, i);
                    }
                }
                calculateTotal() {
                    const t = this._cachedMeta;
                    const e = t.data;
                    let s = 0;
                    let i;
                    for(i = 0; i < e.length; i++){
                        const n = t._parsed[i];
                        if (n !== null && !isNaN(n) && this.chart.getDataVisibility(i) && !e[i].hidden) {
                            s += Math.abs(n);
                        }
                    }
                    return s;
                }
                calculateCircumference(t) {
                    const e = this._cachedMeta.total;
                    if (e > 0 && !isNaN(t)) {
                        return i.T * (Math.abs(t) / e);
                    }
                    return 0;
                }
                getLabelAndValue(t) {
                    const e = this._cachedMeta;
                    const s = this.chart;
                    const n = s.data.labels || [];
                    const o = (0, i.o)(e._parsed[t], s.options.locale);
                    return {
                        label: n[t] || '',
                        value: o
                    };
                }
                getMaxBorderWidth(t) {
                    let e = 0;
                    const s = this.chart;
                    let i, n, o, a, r;
                    if (!t) {
                        for(i = 0, n = s.data.datasets.length; i < n; ++i){
                            if (s.isDatasetVisible(i)) {
                                o = s.getDatasetMeta(i);
                                t = o.data;
                                a = o.controller;
                                break;
                            }
                        }
                    }
                    if (!t) {
                        return 0;
                    }
                    for(i = 0, n = t.length; i < n; ++i){
                        r = a.resolveDataElementOptions(i);
                        if (r.borderAlign !== 'inner') {
                            e = Math.max(e, r.borderWidth || 0, r.hoverBorderWidth || 0);
                        }
                    }
                    return e;
                }
                getMaxOffset(t) {
                    let e = 0;
                    for(let s = 0, i = t.length; s < i; ++s){
                        const n = this.resolveDataElementOptions(s);
                        e = Math.max(e, n.offset || 0, n.hoverOffset || 0);
                    }
                    return e;
                }
                _getRingWeightOffset(t) {
                    let e = 0;
                    for(let s = 0; s < t; ++s){
                        if (this.chart.isDatasetVisible(s)) {
                            e += this._getRingWeight(s);
                        }
                    }
                    return e;
                }
                _getRingWeight(t) {
                    return Math.max((0, i.v)(this.chart.data.datasets[t].weight, 1), 0);
                }
                _getVisibleDatasetWeightTotal() {
                    return this._getRingWeightOffset(this.chart.data.datasets.length) || 1;
                }
            }
            Z.id = 'doughnut';
            Z.defaults = {
                datasetElementType: false,
                dataElementType: 'arc',
                animation: {
                    animateRotate: true,
                    animateScale: false
                },
                animations: {
                    numbers: {
                        type: 'number',
                        properties: [
                            'circumference',
                            'endAngle',
                            'innerRadius',
                            'outerRadius',
                            'startAngle',
                            'x',
                            'y',
                            'offset',
                            'borderWidth',
                            'spacing'
                        ]
                    }
                },
                cutout: '50%',
                rotation: 0,
                circumference: 360,
                radius: '100%',
                spacing: 0,
                indexAxis: 'r'
            };
            Z.descriptors = {
                _scriptable: (t)=>t !== 'spacing',
                _indexable: (t)=>t !== 'spacing'
            };
            Z.overrides = {
                aspectRatio: 1,
                plugins: {
                    legend: {
                        labels: {
                            generateLabels (t) {
                                const e = t.data;
                                if (e.labels.length && e.datasets.length) {
                                    const { labels: { pointStyle: s  }  } = t.legend.options;
                                    return e.labels.map((e, i)=>{
                                        const n = t.getDatasetMeta(0);
                                        const o = n.controller.getStyle(i);
                                        return {
                                            text: e,
                                            fillStyle: o.backgroundColor,
                                            strokeStyle: o.borderColor,
                                            lineWidth: o.borderWidth,
                                            pointStyle: s,
                                            hidden: !t.getDataVisibility(i),
                                            index: i
                                        };
                                    });
                                }
                                return [];
                            }
                        },
                        onClick (t, e, s) {
                            s.chart.toggleDataVisibility(e.index);
                            s.chart.update();
                        }
                    },
                    tooltip: {
                        callbacks: {
                            title () {
                                return '';
                            },
                            label (t) {
                                let e = t.label;
                                const s = ': ' + t.formattedValue;
                                if ((0, i.b)(e)) {
                                    e = e.slice();
                                    e[0] += s;
                                } else {
                                    e += s;
                                }
                                return e;
                            }
                        }
                    }
                }
            };
            class tt extends z {
                initialize() {
                    this.enableOptionSharing = true;
                    this.supportsDecimation = true;
                    super.initialize();
                }
                update(t) {
                    const e = this._cachedMeta;
                    const { dataset: s , data: n = [] , _dataset: o  } = e;
                    const a = this.chart._animationsDisabled;
                    let { start: r , count: l  } = (0, i.q)(e, n, a);
                    this._drawStart = r;
                    this._drawCount = l;
                    if ((0, i.w)(e)) {
                        r = 0;
                        l = n.length;
                    }
                    s._chart = this.chart;
                    s._datasetIndex = this.index;
                    s._decimated = !!o._decimated;
                    s.points = n;
                    const c = this.resolveDatasetElementOptions(t);
                    if (!this.options.showLine) {
                        c.borderWidth = 0;
                    }
                    c.segment = this.options.segment;
                    this.updateElement(s, undefined, {
                        animated: !a,
                        options: c
                    }, t);
                    this.updateElements(n, r, l, t);
                }
                updateElements(t, e, s, n) {
                    const o = n === 'reset';
                    const { iScale: a , vScale: r , _stacked: l , _dataset: c  } = this._cachedMeta;
                    const { sharedOptions: h , includeOptions: d  } = this._getSharedOptions(e, n);
                    const f = a.axis;
                    const u = r.axis;
                    const { spanGaps: g , segment: p  } = this.options;
                    const m = (0, i.x)(g) ? g : Number.POSITIVE_INFINITY;
                    const b = this.chart._animationsDisabled || o || n === 'none';
                    let x = e > 0 && this.getParsed(e - 1);
                    for(let _ = e; _ < e + s; ++_){
                        const y = t[_];
                        const v = this.getParsed(_);
                        const M = b ? y : {};
                        const k = (0, i.k)(v[u]);
                        const w = M[f] = a.getPixelForValue(v[f], _);
                        const S = M[u] = o || k ? r.getBasePixel() : r.getPixelForValue(l ? this.applyStack(r, v, l) : v[u], _);
                        M.skip = isNaN(w) || isNaN(S) || k;
                        M.stop = _ > 0 && (Math.abs(v[f] - x[f])) > m;
                        if (p) {
                            M.parsed = v;
                            M.raw = c.data[_];
                        }
                        if (d) {
                            M.options = h || this.resolveDataElementOptions(_, y.active ? 'active' : n);
                        }
                        if (!b) {
                            this.updateElement(y, _, M, n);
                        }
                        x = v;
                    }
                }
                getMaxOverflow() {
                    const t = this._cachedMeta;
                    const e = t.dataset;
                    const s = e.options && e.options.borderWidth || 0;
                    const i = t.data || [];
                    if (!i.length) {
                        return s;
                    }
                    const n = i[0].size(this.resolveDataElementOptions(0));
                    const o = i[i.length - 1].size(this.resolveDataElementOptions(i.length - 1));
                    return Math.max(s, n, o) / 2;
                }
                draw() {
                    const t = this._cachedMeta;
                    t.dataset.updateControlPoints(this.chart.chartArea, t.iScale.axis);
                    super.draw();
                }
            }
            tt.id = 'line';
            tt.defaults = {
                datasetElementType: 'line',
                dataElementType: 'point',
                showLine: true,
                spanGaps: false
            };
            tt.overrides = {
                scales: {
                    _index_: {
                        type: 'category'
                    },
                    _value_: {
                        type: 'linear'
                    }
                }
            };
            class te extends z {
                constructor(t, e){
                    super(t, e);
                    this.innerRadius = undefined;
                    this.outerRadius = undefined;
                }
                getLabelAndValue(t) {
                    const e = this._cachedMeta;
                    const s = this.chart;
                    const n = s.data.labels || [];
                    const o = (0, i.o)(e._parsed[t].r, s.options.locale);
                    return {
                        label: n[t] || '',
                        value: o
                    };
                }
                parseObjectData(t, e, s, n) {
                    return i.y.bind(this)(t, e, s, n);
                }
                update(t) {
                    const e = this._cachedMeta.data;
                    this._updateRadius();
                    this.updateElements(e, 0, e.length, t);
                }
                getMinMax() {
                    const t = this._cachedMeta;
                    const e = {
                        min: Number.POSITIVE_INFINITY,
                        max: Number.NEGATIVE_INFINITY
                    };
                    t.data.forEach((t, s)=>{
                        const i = this.getParsed(s).r;
                        if (!isNaN(i) && this.chart.getDataVisibility(s)) {
                            if (i < e.min) {
                                e.min = i;
                            }
                            if (i > e.max) {
                                e.max = i;
                            }
                        }
                    });
                    return e;
                }
                _updateRadius() {
                    const t = this.chart;
                    const e = t.chartArea;
                    const s = t.options;
                    const i = Math.min(e.right - e.left, e.bottom - e.top);
                    const n = Math.max(i / 2, 0);
                    const o = Math.max(s.cutoutPercentage ? (n / 100) * (s.cutoutPercentage) : 1, 0);
                    const a = (n - o) / t.getVisibleDatasetCount();
                    this.outerRadius = n - (a * this.index);
                    this.innerRadius = this.outerRadius - a;
                }
                updateElements(t, e, s, n) {
                    const o = n === 'reset';
                    const a = this.chart;
                    const r = a.options;
                    const l = r.animation;
                    const c = this._cachedMeta.rScale;
                    const h = c.xCenter;
                    const d = c.yCenter;
                    const f = c.getIndexAngle(0) - 0.5 * i.P;
                    let u = f;
                    let g;
                    const p = 360 / this.countVisibleElements();
                    for(g = 0; g < e; ++g){
                        u += this._computeAngle(g, n, p);
                    }
                    for(g = e; g < e + s; g++){
                        const m = t[g];
                        let b = u;
                        let x = u + this._computeAngle(g, n, p);
                        let _ = a.getDataVisibility(g) ? c.getDistanceFromCenterForValue(this.getParsed(g).r) : 0;
                        u = x;
                        if (o) {
                            if (l.animateScale) {
                                _ = 0;
                            }
                            if (l.animateRotate) {
                                b = x = f;
                            }
                        }
                        const y = {
                            x: h,
                            y: d,
                            innerRadius: 0,
                            outerRadius: _,
                            startAngle: b,
                            endAngle: x,
                            options: this.resolveDataElementOptions(g, m.active ? 'active' : n)
                        };
                        this.updateElement(m, g, y, n);
                    }
                }
                countVisibleElements() {
                    const t = this._cachedMeta;
                    let e = 0;
                    t.data.forEach((t, s)=>{
                        if (!isNaN(this.getParsed(s).r) && this.chart.getDataVisibility(s)) {
                            e++;
                        }
                    });
                    return e;
                }
                _computeAngle(t, e, s) {
                    return this.chart.getDataVisibility(t) ? (0, i.t)(this.resolveDataElementOptions(t, e).angle || s) : 0;
                }
            }
            te.id = 'polarArea';
            te.defaults = {
                dataElementType: 'arc',
                animation: {
                    animateRotate: true,
                    animateScale: true
                },
                animations: {
                    numbers: {
                        type: 'number',
                        properties: [
                            'x',
                            'y',
                            'startAngle',
                            'endAngle',
                            'innerRadius',
                            'outerRadius'
                        ]
                    }
                },
                indexAxis: 'r',
                startAngle: 0
            };
            te.overrides = {
                aspectRatio: 1,
                plugins: {
                    legend: {
                        labels: {
                            generateLabels (t) {
                                const e = t.data;
                                if (e.labels.length && e.datasets.length) {
                                    const { labels: { pointStyle: s  }  } = t.legend.options;
                                    return e.labels.map((e, i)=>{
                                        const n = t.getDatasetMeta(0);
                                        const o = n.controller.getStyle(i);
                                        return {
                                            text: e,
                                            fillStyle: o.backgroundColor,
                                            strokeStyle: o.borderColor,
                                            lineWidth: o.borderWidth,
                                            pointStyle: s,
                                            hidden: !t.getDataVisibility(i),
                                            index: i
                                        };
                                    });
                                }
                                return [];
                            }
                        },
                        onClick (t, e, s) {
                            s.chart.toggleDataVisibility(e.index);
                            s.chart.update();
                        }
                    },
                    tooltip: {
                        callbacks: {
                            title () {
                                return '';
                            },
                            label (t) {
                                return t.chart.data.labels[t.dataIndex] + ': ' + t.formattedValue;
                            }
                        }
                    }
                },
                scales: {
                    r: {
                        type: 'radialLinear',
                        angleLines: {
                            display: false
                        },
                        beginAtZero: true,
                        grid: {
                            circular: true
                        },
                        pointLabels: {
                            display: false
                        },
                        startAngle: 0
                    }
                }
            };
            class ts extends Z {
            }
            ts.id = 'pie';
            ts.defaults = {
                cutout: 0,
                rotation: 0,
                circumference: 360,
                radius: '100%'
            };
            class ti extends z {
                getLabelAndValue(t) {
                    const e = this._cachedMeta.vScale;
                    const s = this.getParsed(t);
                    return {
                        label: e.getLabels()[t],
                        value: '' + e.getLabelForValue(s[e.axis])
                    };
                }
                parseObjectData(t, e, s, n) {
                    return i.y.bind(this)(t, e, s, n);
                }
                update(t) {
                    const e = this._cachedMeta;
                    const s = e.dataset;
                    const i = e.data || [];
                    const n = e.iScale.getLabels();
                    s.points = i;
                    if (t !== 'resize') {
                        const o = this.resolveDatasetElementOptions(t);
                        if (!this.options.showLine) {
                            o.borderWidth = 0;
                        }
                        const a = {
                            _loop: true,
                            _fullLoop: n.length === i.length,
                            options: o
                        };
                        this.updateElement(s, undefined, a, t);
                    }
                    this.updateElements(i, 0, i.length, t);
                }
                updateElements(t, e, s, i) {
                    const n = this._cachedMeta.rScale;
                    const o = i === 'reset';
                    for(let a = e; a < e + s; a++){
                        const r = t[a];
                        const l = this.resolveDataElementOptions(a, r.active ? 'active' : i);
                        const c = n.getPointPositionForValue(a, this.getParsed(a).r);
                        const h = o ? n.xCenter : c.x;
                        const d = o ? n.yCenter : c.y;
                        const f = {
                            x: h,
                            y: d,
                            angle: c.angle,
                            skip: isNaN(h) || isNaN(d),
                            options: l
                        };
                        this.updateElement(r, a, f, i);
                    }
                }
            }
            ti.id = 'radar';
            ti.defaults = {
                datasetElementType: 'line',
                dataElementType: 'point',
                indexAxis: 'r',
                showLine: true,
                elements: {
                    line: {
                        fill: 'start'
                    }
                }
            };
            ti.overrides = {
                aspectRatio: 1,
                scales: {
                    r: {
                        type: 'radialLinear'
                    }
                }
            };
            class tn {
                constructor(){
                    this.x = undefined;
                    this.y = undefined;
                    this.active = false;
                    this.options = undefined;
                    this.$animations = undefined;
                }
                tooltipPosition(t) {
                    const { x: e , y: s  } = this.getProps([
                        'x',
                        'y'
                    ], t);
                    return {
                        x: e,
                        y: s
                    };
                }
                hasValue() {
                    return (0, i.x)(this.x) && (0, i.x)(this.y);
                }
                getProps(t, e) {
                    const s = this.$animations;
                    if (!e || !s) {
                        return this;
                    }
                    const i = {};
                    t.forEach((t)=>{
                        i[t] = s[t] && s[t].active() ? s[t]._to : this[t];
                    });
                    return i;
                }
            }
            tn.defaults = {};
            tn.defaultRoutes = undefined;
            const to = {
                values (t) {
                    return (0, i.b)(t) ? t : '' + t;
                },
                numeric (t, e, s) {
                    if (t === 0) {
                        return '0';
                    }
                    const n = this.chart.options.locale;
                    let o;
                    let a = t;
                    if (s.length > 1) {
                        const r = Math.max(Math.abs(s[0].value), Math.abs(s[s.length - 1].value));
                        if (r < 1e-4 || r > 1e+15) {
                            o = 'scientific';
                        }
                        a = ta(t, s);
                    }
                    const l = (0, i.z)(Math.abs(a));
                    const c = Math.max(Math.min(-1 * Math.floor(l), 20), 0);
                    const h = {
                        notation: o,
                        minimumFractionDigits: c,
                        maximumFractionDigits: c
                    };
                    Object.assign(h, this.options.ticks.format);
                    return (0, i.o)(t, n, h);
                },
                logarithmic (t, e, s) {
                    if (t === 0) {
                        return '0';
                    }
                    const n = t / (Math.pow(10, Math.floor((0, i.z)(t))));
                    if (n === 1 || n === 2 || n === 5) {
                        return to.numeric.call(this, t, e, s);
                    }
                    return '';
                }
            };
            function ta(t, e) {
                let s = e.length > 3 ? e[2].value - e[1].value : e[1].value - e[0].value;
                if (Math.abs(s) >= 1 && t !== Math.floor(t)) {
                    s = t - Math.floor(t);
                }
                return s;
            }
            var tr = {
                formatters: to
            };
            i.d.set('scale', {
                display: true,
                offset: false,
                reverse: false,
                beginAtZero: false,
                bounds: 'ticks',
                grace: 0,
                grid: {
                    display: true,
                    lineWidth: 1,
                    drawBorder: true,
                    drawOnChartArea: true,
                    drawTicks: true,
                    tickLength: 8,
                    tickWidth: (t, e)=>e.lineWidth,
                    tickColor: (t, e)=>e.color,
                    offset: false,
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderWidth: 1
                },
                title: {
                    display: false,
                    text: '',
                    padding: {
                        top: 4,
                        bottom: 4
                    }
                },
                ticks: {
                    minRotation: 0,
                    maxRotation: 50,
                    mirror: false,
                    textStrokeWidth: 0,
                    textStrokeColor: '',
                    padding: 3,
                    display: true,
                    autoSkip: true,
                    autoSkipPadding: 3,
                    labelOffset: 0,
                    callback: tr.formatters.values,
                    minor: {},
                    major: {},
                    align: 'center',
                    crossAlign: 'near',
                    showLabelBackdrop: false,
                    backdropColor: 'rgba(255, 255, 255, 0.75)',
                    backdropPadding: 2
                }
            });
            i.d.route('scale.ticks', 'color', '', 'color');
            i.d.route('scale.grid', 'color', '', 'borderColor');
            i.d.route('scale.grid', 'borderColor', '', 'borderColor');
            i.d.route('scale.title', 'color', '', 'color');
            i.d.describe('scale', {
                _fallback: false,
                _scriptable: (t)=>!t.startsWith('before') && !t.startsWith('after') && t !== 'callback' && t !== 'parser',
                _indexable: (t)=>t !== 'borderDash' && t !== 'tickBorderDash'
            });
            i.d.describe('scales', {
                _fallback: 'scale'
            });
            i.d.describe('scale.ticks', {
                _scriptable: (t)=>t !== 'backdropPadding' && t !== 'callback',
                _indexable: (t)=>t !== 'backdropPadding'
            });
            function tl(t, e) {
                const s = t.options.ticks;
                const n = s.maxTicksLimit || tc(t);
                const o = s.major.enabled ? td(e) : [];
                const a = o.length;
                const r = o[0];
                const l = o[a - 1];
                const c = [];
                if (a > n) {
                    tf(e, c, o, a / n);
                    return c;
                }
                const h = th(o, e, n);
                if (a > 0) {
                    let d, f;
                    const u = a > 1 ? Math.round((l - r) / (a - 1)) : null;
                    tu(e, c, h, (0, i.k)(u) ? 0 : r - u, r);
                    for(d = 0, f = a - 1; d < f; d++){
                        tu(e, c, h, o[d], o[d + 1]);
                    }
                    tu(e, c, h, l, (0, i.k)(u) ? e.length : l + u);
                    return c;
                }
                tu(e, c, h);
                return c;
            }
            function tc(t) {
                const e = t.options.offset;
                const s = t._tickSize();
                const i = t._length / s + (e ? 0 : 1);
                const n = t._maxLength / s;
                return Math.floor(Math.min(i, n));
            }
            function th(t, e, s) {
                const n = tg(t);
                const o = e.length / s;
                if (!n) {
                    return Math.max(o, 1);
                }
                const a = (0, i.A)(n);
                for(let r = 0, l = a.length - 1; r < l; r++){
                    const c = a[r];
                    if (c > o) {
                        return c;
                    }
                }
                return Math.max(o, 1);
            }
            function td(t) {
                const e = [];
                let s, i;
                for(s = 0, i = t.length; s < i; s++){
                    if (t[s].major) {
                        e.push(s);
                    }
                }
                return e;
            }
            function tf(t, e, s, i) {
                let n = 0;
                let o = s[0];
                let a;
                i = Math.ceil(i);
                for(a = 0; a < t.length; a++){
                    if (a === o) {
                        e.push(t[a]);
                        n++;
                        o = s[n * i];
                    }
                }
            }
            function tu(t, e, s, n, o) {
                const a = (0, i.v)(n, 0);
                const r = Math.min((0, i.v)(o, t.length), t.length);
                let l = 0;
                let c, h, d;
                s = Math.ceil(s);
                if (o) {
                    c = o - n;
                    s = c / Math.floor(c / s);
                }
                d = a;
                while(d < 0){
                    l++;
                    d = Math.round(a + l * s);
                }
                for(h = Math.max(a, 0); h < r; h++){
                    if (h === d) {
                        e.push(t[h]);
                        l++;
                        d = Math.round(a + l * s);
                    }
                }
            }
            function tg(t) {
                const e = t.length;
                let s, i;
                if (e < 2) {
                    return false;
                }
                for(i = t[0], s = 1; s < e; ++s){
                    if (t[s] - t[s - 1] !== i) {
                        return false;
                    }
                }
                return i;
            }
            const tp = (t)=>t === 'left' ? 'right' : t === 'right' ? 'left' : t;
            const tm = (t, e, s)=>e === 'top' || e === 'left' ? t[e] + s : t[e] - s;
            function tb(t, e) {
                const s = [];
                const i = t.length / e;
                const n = t.length;
                let o = 0;
                for(; o < n; o += i){
                    s.push(t[Math.floor(o)]);
                }
                return s;
            }
            function tx(t, e, s) {
                const i = t.ticks.length;
                const n = Math.min(e, i - 1);
                const o = t._startPixel;
                const a = t._endPixel;
                const r = 1e-6;
                let l = t.getPixelForTick(n);
                let c;
                if (s) {
                    if (i === 1) {
                        c = Math.max(l - o, a - l);
                    } else if (e === 0) {
                        c = (t.getPixelForTick(1) - l) / 2;
                    } else {
                        c = (l - t.getPixelForTick(n - 1)) / 2;
                    }
                    l += n < e ? c : -c;
                    if (l < o - r || l > a + r) {
                        return;
                    }
                }
                return l;
            }
            function t_(t, e) {
                (0, i.Q)(t, (t)=>{
                    const s = t.gc;
                    const i = s.length / 2;
                    let n;
                    if (i > e) {
                        for(n = 0; n < i; ++n){
                            delete t.data[s[n]];
                        }
                        s.splice(0, i);
                    }
                });
            }
            function ty(t) {
                return t.drawTicks ? t.tickLength : 0;
            }
            function tv(t, e) {
                if (!t.display) {
                    return 0;
                }
                const s = (0, i.O)(t.font, e);
                const n = (0, i.K)(t.padding);
                const o = (0, i.b)(t.text) ? t.text.length : 1;
                return (o * s.lineHeight) + n.height;
            }
            function tM(t, e) {
                return (0, i.h)(t, {
                    scale: e,
                    type: 'scale'
                });
            }
            function tk(t, e, s) {
                return (0, i.h)(t, {
                    tick: s,
                    index: e,
                    type: 'tick'
                });
            }
            function tw(t, e, s) {
                let n = (0, i.R)(t);
                if ((s && e !== 'right') || (!s && e === 'right')) {
                    n = tp(n);
                }
                return n;
            }
            function tS(t, e, s, n) {
                const { top: o , left: a , bottom: r , right: l , chart: c  } = t;
                const { chartArea: h , scales: d  } = c;
                let f = 0;
                let u, g, p;
                const m = r - o;
                const b = l - a;
                if (t.isHorizontal()) {
                    g = (0, i.S)(n, a, l);
                    if ((0, i.i)(s)) {
                        const x = Object.keys(s)[0];
                        const _ = s[x];
                        p = d[x].getPixelForValue(_) + m - e;
                    } else if (s === 'center') {
                        p = (h.bottom + h.top) / 2 + m - e;
                    } else {
                        p = tm(t, s, e);
                    }
                    u = l - a;
                } else {
                    if ((0, i.i)(s)) {
                        const y = Object.keys(s)[0];
                        const v = s[y];
                        g = d[y].getPixelForValue(v) - b + e;
                    } else if (s === 'center') {
                        g = (h.left + h.right) / 2 - b + e;
                    } else {
                        g = tm(t, s, e);
                    }
                    p = (0, i.S)(n, r, o);
                    f = s === 'left' ? -i.H : i.H;
                }
                return {
                    titleX: g,
                    titleY: p,
                    maxWidth: u,
                    rotation: f
                };
            }
            class tP extends tn {
                constructor(t){
                    super();
                    this.id = t.id;
                    this.type = t.type;
                    this.options = undefined;
                    this.ctx = t.ctx;
                    this.chart = t.chart;
                    this.top = undefined;
                    this.bottom = undefined;
                    this.left = undefined;
                    this.right = undefined;
                    this.width = undefined;
                    this.height = undefined;
                    this._margins = {
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0
                    };
                    this.maxWidth = undefined;
                    this.maxHeight = undefined;
                    this.paddingTop = undefined;
                    this.paddingBottom = undefined;
                    this.paddingLeft = undefined;
                    this.paddingRight = undefined;
                    this.axis = undefined;
                    this.labelRotation = undefined;
                    this.min = undefined;
                    this.max = undefined;
                    this._range = undefined;
                    this.ticks = [];
                    this._gridLineItems = null;
                    this._labelItems = null;
                    this._labelSizes = null;
                    this._length = 0;
                    this._maxLength = 0;
                    this._longestTextCache = {};
                    this._startPixel = undefined;
                    this._endPixel = undefined;
                    this._reversePixels = false;
                    this._userMax = undefined;
                    this._userMin = undefined;
                    this._suggestedMax = undefined;
                    this._suggestedMin = undefined;
                    this._ticksLength = 0;
                    this._borderValue = 0;
                    this._cache = {};
                    this._dataLimitsCached = false;
                    this.$context = undefined;
                }
                init(t) {
                    this.options = t.setContext(this.getContext());
                    this.axis = t.axis;
                    this._userMin = this.parse(t.min);
                    this._userMax = this.parse(t.max);
                    this._suggestedMin = this.parse(t.suggestedMin);
                    this._suggestedMax = this.parse(t.suggestedMax);
                }
                parse(t, e) {
                    return t;
                }
                getUserBounds() {
                    let { _userMin: t , _userMax: e , _suggestedMin: s , _suggestedMax: n  } = this;
                    t = (0, i.B)(t, Number.POSITIVE_INFINITY);
                    e = (0, i.B)(e, Number.NEGATIVE_INFINITY);
                    s = (0, i.B)(s, Number.POSITIVE_INFINITY);
                    n = (0, i.B)(n, Number.NEGATIVE_INFINITY);
                    return {
                        min: (0, i.B)(t, s),
                        max: (0, i.B)(e, n),
                        minDefined: (0, i.g)(t),
                        maxDefined: (0, i.g)(e)
                    };
                }
                getMinMax(t) {
                    let { min: e , max: s , minDefined: n , maxDefined: o  } = this.getUserBounds();
                    let a;
                    if (n && o) {
                        return {
                            min: e,
                            max: s
                        };
                    }
                    const r = this.getMatchingVisibleMetas();
                    for(let l = 0, c = r.length; l < c; ++l){
                        a = r[l].controller.getMinMax(this, t);
                        if (!n) {
                            e = Math.min(e, a.min);
                        }
                        if (!o) {
                            s = Math.max(s, a.max);
                        }
                    }
                    e = o && e > s ? s : e;
                    s = n && e > s ? e : s;
                    return {
                        min: (0, i.B)(e, (0, i.B)(s, e)),
                        max: (0, i.B)(s, (0, i.B)(e, s))
                    };
                }
                getPadding() {
                    return {
                        left: this.paddingLeft || 0,
                        top: this.paddingTop || 0,
                        right: this.paddingRight || 0,
                        bottom: this.paddingBottom || 0
                    };
                }
                getTicks() {
                    return this.ticks;
                }
                getLabels() {
                    const t = this.chart.data;
                    return this.options.labels || (this.isHorizontal() ? t.xLabels : t.yLabels) || t.labels || [];
                }
                beforeLayout() {
                    this._cache = {};
                    this._dataLimitsCached = false;
                }
                beforeUpdate() {
                    (0, i.C)(this.options.beforeUpdate, [
                        this
                    ]);
                }
                update(t, e, s) {
                    const { beginAtZero: n , grace: o , ticks: a  } = this.options;
                    const r = a.sampleSize;
                    this.beforeUpdate();
                    this.maxWidth = t;
                    this.maxHeight = e;
                    this._margins = s = Object.assign({
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0
                    }, s);
                    this.ticks = null;
                    this._labelSizes = null;
                    this._gridLineItems = null;
                    this._labelItems = null;
                    this.beforeSetDimensions();
                    this.setDimensions();
                    this.afterSetDimensions();
                    this._maxLength = this.isHorizontal() ? this.width + s.left + s.right : this.height + s.top + s.bottom;
                    if (!this._dataLimitsCached) {
                        this.beforeDataLimits();
                        this.determineDataLimits();
                        this.afterDataLimits();
                        this._range = (0, i.D)(this, o, n);
                        this._dataLimitsCached = true;
                    }
                    this.beforeBuildTicks();
                    this.ticks = this.buildTicks() || [];
                    this.afterBuildTicks();
                    const l = r < this.ticks.length;
                    this._convertTicksToLabels(l ? tb(this.ticks, r) : this.ticks);
                    this.configure();
                    this.beforeCalculateLabelRotation();
                    this.calculateLabelRotation();
                    this.afterCalculateLabelRotation();
                    if (a.display && (a.autoSkip || a.source === 'auto')) {
                        this.ticks = tl(this, this.ticks);
                        this._labelSizes = null;
                        this.afterAutoSkip();
                    }
                    if (l) {
                        this._convertTicksToLabels(this.ticks);
                    }
                    this.beforeFit();
                    this.fit();
                    this.afterFit();
                    this.afterUpdate();
                }
                configure() {
                    let t = this.options.reverse;
                    let e, s;
                    if (this.isHorizontal()) {
                        e = this.left;
                        s = this.right;
                    } else {
                        e = this.top;
                        s = this.bottom;
                        t = !t;
                    }
                    this._startPixel = e;
                    this._endPixel = s;
                    this._reversePixels = t;
                    this._length = s - e;
                    this._alignToPixels = this.options.alignToPixels;
                }
                afterUpdate() {
                    (0, i.C)(this.options.afterUpdate, [
                        this
                    ]);
                }
                beforeSetDimensions() {
                    (0, i.C)(this.options.beforeSetDimensions, [
                        this
                    ]);
                }
                setDimensions() {
                    if (this.isHorizontal()) {
                        this.width = this.maxWidth;
                        this.left = 0;
                        this.right = this.width;
                    } else {
                        this.height = this.maxHeight;
                        this.top = 0;
                        this.bottom = this.height;
                    }
                    this.paddingLeft = 0;
                    this.paddingTop = 0;
                    this.paddingRight = 0;
                    this.paddingBottom = 0;
                }
                afterSetDimensions() {
                    (0, i.C)(this.options.afterSetDimensions, [
                        this
                    ]);
                }
                _callHooks(t) {
                    this.chart.notifyPlugins(t, this.getContext());
                    (0, i.C)(this.options[t], [
                        this
                    ]);
                }
                beforeDataLimits() {
                    this._callHooks('beforeDataLimits');
                }
                determineDataLimits() {}
                afterDataLimits() {
                    this._callHooks('afterDataLimits');
                }
                beforeBuildTicks() {
                    this._callHooks('beforeBuildTicks');
                }
                buildTicks() {
                    return [];
                }
                afterBuildTicks() {
                    this._callHooks('afterBuildTicks');
                }
                beforeTickToLabelConversion() {
                    (0, i.C)(this.options.beforeTickToLabelConversion, [
                        this
                    ]);
                }
                generateTickLabels(t) {
                    const e = this.options.ticks;
                    let s, n, o;
                    for(s = 0, n = t.length; s < n; s++){
                        o = t[s];
                        o.label = (0, i.C)(e.callback, [
                            o.value,
                            s,
                            t
                        ], this);
                    }
                }
                afterTickToLabelConversion() {
                    (0, i.C)(this.options.afterTickToLabelConversion, [
                        this
                    ]);
                }
                beforeCalculateLabelRotation() {
                    (0, i.C)(this.options.beforeCalculateLabelRotation, [
                        this
                    ]);
                }
                calculateLabelRotation() {
                    const t = this.options;
                    const e = t.ticks;
                    const s = this.ticks.length;
                    const n = e.minRotation || 0;
                    const o = e.maxRotation;
                    let a = n;
                    let r, l, c;
                    if (!this._isVisible() || !e.display || n >= o || s <= 1 || !this.isHorizontal()) {
                        this.labelRotation = n;
                        return;
                    }
                    const h = this._getLabelSizes();
                    const d = h.widest.width;
                    const f = h.highest.height;
                    const u = (0, i.E)(this.chart.width - d, 0, this.maxWidth);
                    r = t.offset ? this.maxWidth / s : u / (s - 1);
                    if (d + 6 > r) {
                        r = u / (s - (t.offset ? 0.5 : 1));
                        l = this.maxHeight - ty(t.grid) - e.padding - tv(t.title, this.chart.options.font);
                        c = Math.sqrt(d * d + f * f);
                        a = (0, i.F)(Math.min(Math.asin((0, i.E)((h.highest.height + 6) / r, -1, 1)), Math.asin((0, i.E)(l / c, -1, 1)) - Math.asin((0, i.E)(f / c, -1, 1))));
                        a = Math.max(n, Math.min(o, a));
                    }
                    this.labelRotation = a;
                }
                afterCalculateLabelRotation() {
                    (0, i.C)(this.options.afterCalculateLabelRotation, [
                        this
                    ]);
                }
                afterAutoSkip() {}
                beforeFit() {
                    (0, i.C)(this.options.beforeFit, [
                        this
                    ]);
                }
                fit() {
                    const t = {
                        width: 0,
                        height: 0
                    };
                    const { chart: e , options: { ticks: s , title: n , grid: o  }  } = this;
                    const a = this._isVisible();
                    const r = this.isHorizontal();
                    if (a) {
                        const l = tv(n, e.options.font);
                        if (r) {
                            t.width = this.maxWidth;
                            t.height = ty(o) + l;
                        } else {
                            t.height = this.maxHeight;
                            t.width = ty(o) + l;
                        }
                        if (s.display && this.ticks.length) {
                            const { first: c , last: h , widest: d , highest: f  } = this._getLabelSizes();
                            const u = s.padding * 2;
                            const g = (0, i.t)(this.labelRotation);
                            const p = Math.cos(g);
                            const m = Math.sin(g);
                            if (r) {
                                const b = s.mirror ? 0 : m * d.width + p * f.height;
                                t.height = Math.min(this.maxHeight, t.height + b + u);
                            } else {
                                const x = s.mirror ? 0 : p * d.width + m * f.height;
                                t.width = Math.min(this.maxWidth, t.width + x + u);
                            }
                            this._calculatePadding(c, h, m, p);
                        }
                    }
                    this._handleMargins();
                    if (r) {
                        this.width = this._length = e.width - this._margins.left - this._margins.right;
                        this.height = t.height;
                    } else {
                        this.width = t.width;
                        this.height = this._length = e.height - this._margins.top - this._margins.bottom;
                    }
                }
                _calculatePadding(t, e, s, i) {
                    const { ticks: { align: n , padding: o  } , position: a  } = this.options;
                    const r = this.labelRotation !== 0;
                    const l = a !== 'top' && this.axis === 'x';
                    if (this.isHorizontal()) {
                        const c = this.getPixelForTick(0) - this.left;
                        const h = this.right - this.getPixelForTick(this.ticks.length - 1);
                        let d = 0;
                        let f = 0;
                        if (r) {
                            if (l) {
                                d = i * t.width;
                                f = s * e.height;
                            } else {
                                d = s * t.height;
                                f = i * e.width;
                            }
                        } else if (n === 'start') {
                            f = e.width;
                        } else if (n === 'end') {
                            d = t.width;
                        } else if (n !== 'inner') {
                            d = t.width / 2;
                            f = e.width / 2;
                        }
                        this.paddingLeft = Math.max((d - c + o) * this.width / (this.width - c), 0);
                        this.paddingRight = Math.max((f - h + o) * this.width / (this.width - h), 0);
                    } else {
                        let u = e.height / 2;
                        let g = t.height / 2;
                        if (n === 'start') {
                            u = 0;
                            g = t.height;
                        } else if (n === 'end') {
                            u = e.height;
                            g = 0;
                        }
                        this.paddingTop = u + o;
                        this.paddingBottom = g + o;
                    }
                }
                _handleMargins() {
                    if (this._margins) {
                        this._margins.left = Math.max(this.paddingLeft, this._margins.left);
                        this._margins.top = Math.max(this.paddingTop, this._margins.top);
                        this._margins.right = Math.max(this.paddingRight, this._margins.right);
                        this._margins.bottom = Math.max(this.paddingBottom, this._margins.bottom);
                    }
                }
                afterFit() {
                    (0, i.C)(this.options.afterFit, [
                        this
                    ]);
                }
                isHorizontal() {
                    const { axis: t , position: e  } = this.options;
                    return e === 'top' || e === 'bottom' || t === 'x';
                }
                isFullSize() {
                    return this.options.fullSize;
                }
                _convertTicksToLabels(t) {
                    this.beforeTickToLabelConversion();
                    this.generateTickLabels(t);
                    let e, s;
                    for(e = 0, s = t.length; e < s; e++){
                        if ((0, i.k)(t[e].label)) {
                            t.splice(e, 1);
                            s--;
                            e--;
                        }
                    }
                    this.afterTickToLabelConversion();
                }
                _getLabelSizes() {
                    let t = this._labelSizes;
                    if (!t) {
                        const e = this.options.ticks.sampleSize;
                        let s = this.ticks;
                        if (e < s.length) {
                            s = tb(s, e);
                        }
                        this._labelSizes = t = this._computeLabelSizes(s, s.length);
                    }
                    return t;
                }
                _computeLabelSizes(t, e) {
                    const { ctx: s , _longestTextCache: n  } = this;
                    const o = [];
                    const a = [];
                    let r = 0;
                    let l = 0;
                    let c, h, d, f, u, g, p, m, b, x, _;
                    for(c = 0; c < e; ++c){
                        f = t[c].label;
                        u = this._resolveTickFontOptions(c);
                        s.font = g = u.string;
                        p = n[g] = n[g] || {
                            data: {},
                            gc: []
                        };
                        m = u.lineHeight;
                        b = x = 0;
                        if (!(0, i.k)(f) && !(0, i.b)(f)) {
                            b = (0, i.G)(s, p.data, p.gc, b, f);
                            x = m;
                        } else if ((0, i.b)(f)) {
                            for(h = 0, d = f.length; h < d; ++h){
                                _ = f[h];
                                if (!(0, i.k)(_) && !(0, i.b)(_)) {
                                    b = (0, i.G)(s, p.data, p.gc, b, _);
                                    x += m;
                                }
                            }
                        }
                        o.push(b);
                        a.push(x);
                        r = Math.max(b, r);
                        l = Math.max(x, l);
                    }
                    t_(n, e);
                    const y = o.indexOf(r);
                    const v = a.indexOf(l);
                    const M = (t)=>({
                            width: o[t] || 0,
                            height: a[t] || 0
                        });
                    return {
                        first: M(0),
                        last: M(e - 1),
                        widest: M(y),
                        highest: M(v),
                        widths: o,
                        heights: a
                    };
                }
                getLabelForValue(t) {
                    return t;
                }
                getPixelForValue(t, e) {
                    return NaN;
                }
                getValueForPixel(t) {}
                getPixelForTick(t) {
                    const e = this.ticks;
                    if (t < 0 || t > e.length - 1) {
                        return null;
                    }
                    return this.getPixelForValue(e[t].value);
                }
                getPixelForDecimal(t) {
                    if (this._reversePixels) {
                        t = 1 - t;
                    }
                    const e = this._startPixel + t * this._length;
                    return (0, i.I)(this._alignToPixels ? (0, i.J)(this.chart, e, 0) : e);
                }
                getDecimalForPixel(t) {
                    const e = (t - this._startPixel) / this._length;
                    return this._reversePixels ? 1 - e : e;
                }
                getBasePixel() {
                    return this.getPixelForValue(this.getBaseValue());
                }
                getBaseValue() {
                    const { min: t , max: e  } = this;
                    return t < 0 && e < 0 ? e : t > 0 && e > 0 ? t : 0;
                }
                getContext(t) {
                    const e = this.ticks || [];
                    if (t >= 0 && t < e.length) {
                        const s = e[t];
                        return s.$context || (s.$context = tk(this.getContext(), t, s));
                    }
                    return this.$context || (this.$context = tM(this.chart.getContext(), this));
                }
                _tickSize() {
                    const t = this.options.ticks;
                    const e = (0, i.t)(this.labelRotation);
                    const s = Math.abs(Math.cos(e));
                    const n = Math.abs(Math.sin(e));
                    const o = this._getLabelSizes();
                    const a = t.autoSkipPadding || 0;
                    const r = o ? o.widest.width + a : 0;
                    const l = o ? o.highest.height + a : 0;
                    return this.isHorizontal() ? l * s > r * n ? r / s : l / n : l * n < r * s ? l / s : r / n;
                }
                _isVisible() {
                    const t = this.options.display;
                    if (t !== 'auto') {
                        return !!t;
                    }
                    return this.getMatchingVisibleMetas().length > 0;
                }
                _computeGridLineItems(t) {
                    const e = this.axis;
                    const s = this.chart;
                    const n = this.options;
                    const { grid: o , position: a  } = n;
                    const r = o.offset;
                    const l = this.isHorizontal();
                    const c = this.ticks;
                    const h = c.length + (r ? 1 : 0);
                    const d = ty(o);
                    const f = [];
                    const u = o.setContext(this.getContext());
                    const g = u.drawBorder ? u.borderWidth : 0;
                    const p = g / 2;
                    const m = function(t) {
                        return (0, i.J)(s, t, g);
                    };
                    let b, x, _, y;
                    let v, M, k, w, S, P, D, C;
                    if (a === 'top') {
                        b = m(this.bottom);
                        M = this.bottom - d;
                        w = b - p;
                        P = m(t.top) + p;
                        C = t.bottom;
                    } else if (a === 'bottom') {
                        b = m(this.top);
                        P = t.top;
                        C = m(t.bottom) - p;
                        M = b + p;
                        w = this.top + d;
                    } else if (a === 'left') {
                        b = m(this.right);
                        v = this.right - d;
                        k = b - p;
                        S = m(t.left) + p;
                        D = t.right;
                    } else if (a === 'right') {
                        b = m(this.left);
                        S = t.left;
                        D = m(t.right) - p;
                        v = b + p;
                        k = this.left + d;
                    } else if (e === 'x') {
                        if (a === 'center') {
                            b = m((t.top + t.bottom) / 2 + 0.5);
                        } else if ((0, i.i)(a)) {
                            const O = Object.keys(a)[0];
                            const L = a[O];
                            b = m(this.chart.scales[O].getPixelForValue(L));
                        }
                        P = t.top;
                        C = t.bottom;
                        M = b + p;
                        w = M + d;
                    } else if (e === 'y') {
                        if (a === 'center') {
                            b = m((t.left + t.right) / 2);
                        } else if ((0, i.i)(a)) {
                            const E = Object.keys(a)[0];
                            const A = a[E];
                            b = m(this.chart.scales[E].getPixelForValue(A));
                        }
                        v = b - p;
                        k = v - d;
                        S = t.left;
                        D = t.right;
                    }
                    const T = (0, i.v)(n.ticks.maxTicksLimit, h);
                    const z = Math.max(1, Math.ceil(h / T));
                    for(x = 0; x < h; x += z){
                        const R = o.setContext(this.getContext(x));
                        const F = R.lineWidth;
                        const I = R.color;
                        const V = R.borderDash || [];
                        const B = R.borderDashOffset;
                        const N = R.tickWidth;
                        const H = R.tickColor;
                        const W = R.tickBorderDash || [];
                        const j = R.tickBorderDashOffset;
                        _ = tx(this, x, r);
                        if (_ === undefined) {
                            continue;
                        }
                        y = (0, i.J)(s, _, F);
                        if (l) {
                            v = k = S = D = y;
                        } else {
                            M = w = P = C = y;
                        }
                        f.push({
                            tx1: v,
                            ty1: M,
                            tx2: k,
                            ty2: w,
                            x1: S,
                            y1: P,
                            x2: D,
                            y2: C,
                            width: F,
                            color: I,
                            borderDash: V,
                            borderDashOffset: B,
                            tickWidth: N,
                            tickColor: H,
                            tickBorderDash: W,
                            tickBorderDashOffset: j
                        });
                    }
                    this._ticksLength = h;
                    this._borderValue = b;
                    return f;
                }
                _computeLabelItems(t) {
                    const e = this.axis;
                    const s = this.options;
                    const { position: n , ticks: o  } = s;
                    const a = this.isHorizontal();
                    const r = this.ticks;
                    const { align: l , crossAlign: c , padding: h , mirror: d  } = o;
                    const f = ty(s.grid);
                    const u = f + h;
                    const g = d ? -h : u;
                    const p = -(0, i.t)(this.labelRotation);
                    const m = [];
                    let b, x, _, y, v, M, k, w, S, P, D, C;
                    let O = 'middle';
                    if (n === 'top') {
                        M = this.bottom - g;
                        k = this._getXAxisLabelAlignment();
                    } else if (n === 'bottom') {
                        M = this.top + g;
                        k = this._getXAxisLabelAlignment();
                    } else if (n === 'left') {
                        const L = this._getYAxisLabelAlignment(f);
                        k = L.textAlign;
                        v = L.x;
                    } else if (n === 'right') {
                        const E = this._getYAxisLabelAlignment(f);
                        k = E.textAlign;
                        v = E.x;
                    } else if (e === 'x') {
                        if (n === 'center') {
                            M = ((t.top + t.bottom) / 2) + u;
                        } else if ((0, i.i)(n)) {
                            const A = Object.keys(n)[0];
                            const T = n[A];
                            M = this.chart.scales[A].getPixelForValue(T) + u;
                        }
                        k = this._getXAxisLabelAlignment();
                    } else if (e === 'y') {
                        if (n === 'center') {
                            v = ((t.left + t.right) / 2) - u;
                        } else if ((0, i.i)(n)) {
                            const z = Object.keys(n)[0];
                            const R = n[z];
                            v = this.chart.scales[z].getPixelForValue(R);
                        }
                        k = this._getYAxisLabelAlignment(f).textAlign;
                    }
                    if (e === 'y') {
                        if (l === 'start') {
                            O = 'top';
                        } else if (l === 'end') {
                            O = 'bottom';
                        }
                    }
                    const F = this._getLabelSizes();
                    for(b = 0, x = r.length; b < x; ++b){
                        _ = r[b];
                        y = _.label;
                        const I = o.setContext(this.getContext(b));
                        w = this.getPixelForTick(b) + o.labelOffset;
                        S = this._resolveTickFontOptions(b);
                        P = S.lineHeight;
                        D = (0, i.b)(y) ? y.length : 1;
                        const V = D / 2;
                        const B = I.color;
                        const N = I.textStrokeColor;
                        const H = I.textStrokeWidth;
                        let W = k;
                        if (a) {
                            v = w;
                            if (k === 'inner') {
                                if (b === x - 1) {
                                    W = !this.options.reverse ? 'right' : 'left';
                                } else if (b === 0) {
                                    W = !this.options.reverse ? 'left' : 'right';
                                } else {
                                    W = 'center';
                                }
                            }
                            if (n === 'top') {
                                if (c === 'near' || p !== 0) {
                                    C = -D * P + P / 2;
                                } else if (c === 'center') {
                                    C = -F.highest.height / 2 - V * P + P;
                                } else {
                                    C = -F.highest.height + P / 2;
                                }
                            } else {
                                if (c === 'near' || p !== 0) {
                                    C = P / 2;
                                } else if (c === 'center') {
                                    C = F.highest.height / 2 - V * P;
                                } else {
                                    C = F.highest.height - D * P;
                                }
                            }
                            if (d) {
                                C *= -1;
                            }
                        } else {
                            M = w;
                            C = (1 - D) * P / 2;
                        }
                        let j;
                        if (I.showLabelBackdrop) {
                            const $ = (0, i.K)(I.backdropPadding);
                            const U = F.heights[b];
                            const Y = F.widths[b];
                            let K = M + C - $.top;
                            let Q = v - $.left;
                            switch(O){
                                case 'middle':
                                    K -= U / 2;
                                    break;
                                case 'bottom':
                                    K -= U;
                                    break;
                            }
                            switch(k){
                                case 'center':
                                    Q -= Y / 2;
                                    break;
                                case 'right':
                                    Q -= Y;
                                    break;
                            }
                            j = {
                                left: Q,
                                top: K,
                                width: Y + $.width,
                                height: U + $.height,
                                color: I.backdropColor
                            };
                        }
                        m.push({
                            rotation: p,
                            label: y,
                            font: S,
                            color: B,
                            strokeColor: N,
                            strokeWidth: H,
                            textOffset: C,
                            textAlign: W,
                            textBaseline: O,
                            translation: [
                                v,
                                M
                            ],
                            backdrop: j
                        });
                    }
                    return m;
                }
                _getXAxisLabelAlignment() {
                    const { position: t , ticks: e  } = this.options;
                    const s = -(0, i.t)(this.labelRotation);
                    if (s) {
                        return t === 'top' ? 'left' : 'right';
                    }
                    let n = 'center';
                    if (e.align === 'start') {
                        n = 'left';
                    } else if (e.align === 'end') {
                        n = 'right';
                    } else if (e.align === 'inner') {
                        n = 'inner';
                    }
                    return n;
                }
                _getYAxisLabelAlignment(t) {
                    const { position: e , ticks: { crossAlign: s , mirror: i , padding: n  }  } = this.options;
                    const o = this._getLabelSizes();
                    const a = t + n;
                    const r = o.widest.width;
                    let l;
                    let c;
                    if (e === 'left') {
                        if (i) {
                            c = this.right + n;
                            if (s === 'near') {
                                l = 'left';
                            } else if (s === 'center') {
                                l = 'center';
                                c += (r / 2);
                            } else {
                                l = 'right';
                                c += r;
                            }
                        } else {
                            c = this.right - a;
                            if (s === 'near') {
                                l = 'right';
                            } else if (s === 'center') {
                                l = 'center';
                                c -= (r / 2);
                            } else {
                                l = 'left';
                                c = this.left;
                            }
                        }
                    } else if (e === 'right') {
                        if (i) {
                            c = this.left + n;
                            if (s === 'near') {
                                l = 'right';
                            } else if (s === 'center') {
                                l = 'center';
                                c -= (r / 2);
                            } else {
                                l = 'left';
                                c -= r;
                            }
                        } else {
                            c = this.left + a;
                            if (s === 'near') {
                                l = 'left';
                            } else if (s === 'center') {
                                l = 'center';
                                c += r / 2;
                            } else {
                                l = 'right';
                                c = this.right;
                            }
                        }
                    } else {
                        l = 'right';
                    }
                    return {
                        textAlign: l,
                        x: c
                    };
                }
                _computeLabelArea() {
                    if (this.options.ticks.mirror) {
                        return;
                    }
                    const t = this.chart;
                    const e = this.options.position;
                    if (e === 'left' || e === 'right') {
                        return {
                            top: 0,
                            left: this.left,
                            bottom: t.height,
                            right: this.right
                        };
                    }
                    if (e === 'top' || e === 'bottom') {
                        return {
                            top: this.top,
                            left: 0,
                            bottom: this.bottom,
                            right: t.width
                        };
                    }
                }
                drawBackground() {
                    const { ctx: t , options: { backgroundColor: e  } , left: s , top: i , width: n , height: o  } = this;
                    if (e) {
                        t.save();
                        t.fillStyle = e;
                        t.fillRect(s, i, n, o);
                        t.restore();
                    }
                }
                getLineWidthForValue(t) {
                    const e = this.options.grid;
                    if (!this._isVisible() || !e.display) {
                        return 0;
                    }
                    const s = this.ticks;
                    const i = s.findIndex((e)=>e.value === t);
                    if (i >= 0) {
                        const n = e.setContext(this.getContext(i));
                        return n.lineWidth;
                    }
                    return 0;
                }
                drawGrid(t) {
                    const e = this.options.grid;
                    const s = this.ctx;
                    const i = this._gridLineItems || (this._gridLineItems = this._computeGridLineItems(t));
                    let n, o;
                    const a = (t, e, i)=>{
                        if (!i.width || !i.color) {
                            return;
                        }
                        s.save();
                        s.lineWidth = i.width;
                        s.strokeStyle = i.color;
                        s.setLineDash(i.borderDash || []);
                        s.lineDashOffset = i.borderDashOffset;
                        s.beginPath();
                        s.moveTo(t.x, t.y);
                        s.lineTo(e.x, e.y);
                        s.stroke();
                        s.restore();
                    };
                    if (e.display) {
                        for(n = 0, o = i.length; n < o; ++n){
                            const r = i[n];
                            if (e.drawOnChartArea) {
                                a({
                                    x: r.x1,
                                    y: r.y1
                                }, {
                                    x: r.x2,
                                    y: r.y2
                                }, r);
                            }
                            if (e.drawTicks) {
                                a({
                                    x: r.tx1,
                                    y: r.ty1
                                }, {
                                    x: r.tx2,
                                    y: r.ty2
                                }, {
                                    color: r.tickColor,
                                    width: r.tickWidth,
                                    borderDash: r.tickBorderDash,
                                    borderDashOffset: r.tickBorderDashOffset
                                });
                            }
                        }
                    }
                }
                drawBorder() {
                    const { chart: t , ctx: e , options: { grid: s  }  } = this;
                    const n = s.setContext(this.getContext());
                    const o = s.drawBorder ? n.borderWidth : 0;
                    if (!o) {
                        return;
                    }
                    const a = s.setContext(this.getContext(0)).lineWidth;
                    const r = this._borderValue;
                    let l, c, h, d;
                    if (this.isHorizontal()) {
                        l = (0, i.J)(t, this.left, o) - o / 2;
                        c = (0, i.J)(t, this.right, a) + a / 2;
                        h = d = r;
                    } else {
                        h = (0, i.J)(t, this.top, o) - o / 2;
                        d = (0, i.J)(t, this.bottom, a) + a / 2;
                        l = c = r;
                    }
                    e.save();
                    e.lineWidth = n.borderWidth;
                    e.strokeStyle = n.borderColor;
                    e.beginPath();
                    e.moveTo(l, h);
                    e.lineTo(c, d);
                    e.stroke();
                    e.restore();
                }
                drawLabels(t) {
                    const e = this.options.ticks;
                    if (!e.display) {
                        return;
                    }
                    const s = this.ctx;
                    const n = this._computeLabelArea();
                    if (n) {
                        (0, i.L)(s, n);
                    }
                    const o = this._labelItems || (this._labelItems = this._computeLabelItems(t));
                    let a, r;
                    for(a = 0, r = o.length; a < r; ++a){
                        const l = o[a];
                        const c = l.font;
                        const h = l.label;
                        if (l.backdrop) {
                            s.fillStyle = l.backdrop.color;
                            s.fillRect(l.backdrop.left, l.backdrop.top, l.backdrop.width, l.backdrop.height);
                        }
                        let d = l.textOffset;
                        (0, i.M)(s, h, 0, d, c, l);
                    }
                    if (n) {
                        (0, i.N)(s);
                    }
                }
                drawTitle() {
                    const { ctx: t , options: { position: e , title: s , reverse: n  }  } = this;
                    if (!s.display) {
                        return;
                    }
                    const o = (0, i.O)(s.font);
                    const a = (0, i.K)(s.padding);
                    const r = s.align;
                    let l = o.lineHeight / 2;
                    if (e === 'bottom' || e === 'center' || (0, i.i)(e)) {
                        l += a.bottom;
                        if ((0, i.b)(s.text)) {
                            l += o.lineHeight * (s.text.length - 1);
                        }
                    } else {
                        l += a.top;
                    }
                    const { titleX: c , titleY: h , maxWidth: d , rotation: f  } = tS(this, l, e, r);
                    (0, i.M)(t, s.text, 0, 0, o, {
                        color: s.color,
                        maxWidth: d,
                        rotation: f,
                        textAlign: tw(r, e, n),
                        textBaseline: 'middle',
                        translation: [
                            c,
                            h
                        ]
                    });
                }
                draw(t) {
                    if (!this._isVisible()) {
                        return;
                    }
                    this.drawBackground();
                    this.drawGrid(t);
                    this.drawBorder();
                    this.drawTitle();
                    this.drawLabels(t);
                }
                _layers() {
                    const t = this.options;
                    const e = t.ticks && t.ticks.z || 0;
                    const s = (0, i.v)(t.grid && t.grid.z, -1);
                    if (!this._isVisible() || this.draw !== tP.prototype.draw) {
                        return [
                            {
                                z: e,
                                draw: (t)=>{
                                    this.draw(t);
                                }
                            }
                        ];
                    }
                    return [
                        {
                            z: s,
                            draw: (t)=>{
                                this.drawBackground();
                                this.drawGrid(t);
                                this.drawTitle();
                            }
                        },
                        {
                            z: s + 1,
                            draw: ()=>{
                                this.drawBorder();
                            }
                        },
                        {
                            z: e,
                            draw: (t)=>{
                                this.drawLabels(t);
                            }
                        }
                    ];
                }
                getMatchingVisibleMetas(t) {
                    const e = this.chart.getSortedVisibleDatasetMetas();
                    const s = this.axis + 'AxisID';
                    const i = [];
                    let n, o;
                    for(n = 0, o = e.length; n < o; ++n){
                        const a = e[n];
                        if (a[s] === this.id && (!t || a.type === t)) {
                            i.push(a);
                        }
                    }
                    return i;
                }
                _resolveTickFontOptions(t) {
                    const e = this.options.ticks.setContext(this.getContext(t));
                    return (0, i.O)(e.font);
                }
                _maxDigits() {
                    const t = this._resolveTickFontOptions(0).lineHeight;
                    return (this.isHorizontal() ? this.width : this.height) / t;
                }
            }
            class tD {
                constructor(t, e, s){
                    this.type = t;
                    this.scope = e;
                    this.override = s;
                    this.items = Object.create(null);
                }
                isForType(t) {
                    return Object.prototype.isPrototypeOf.call(this.type.prototype, t.prototype);
                }
                register(t) {
                    const e = Object.getPrototypeOf(t);
                    let s;
                    if (tL(e)) {
                        s = this.register(e);
                    }
                    const n = this.items;
                    const o = t.id;
                    const a = this.scope + '.' + o;
                    if (!o) {
                        throw new Error('class does not have id: ' + t);
                    }
                    if (o in n) {
                        return a;
                    }
                    n[o] = t;
                    tC(t, a, s);
                    if (this.override) {
                        i.d.override(t.id, t.overrides);
                    }
                    return a;
                }
                get(t) {
                    return this.items[t];
                }
                unregister(t) {
                    const e = this.items;
                    const s = t.id;
                    const n = this.scope;
                    if (s in e) {
                        delete e[s];
                    }
                    if (n && s in i.d[n]) {
                        delete i.d[n][s];
                        if (this.override) {
                            delete i.U[s];
                        }
                    }
                }
            }
            function tC(t, e, s) {
                const n = (0, i.V)(Object.create(null), [
                    s ? i.d.get(s) : {},
                    i.d.get(e),
                    t.defaults
                ]);
                i.d.set(e, n);
                if (t.defaultRoutes) {
                    tO(e, t.defaultRoutes);
                }
                if (t.descriptors) {
                    i.d.describe(e, t.descriptors);
                }
            }
            function tO(t, e) {
                Object.keys(e).forEach((s)=>{
                    const n = s.split('.');
                    const o = n.pop();
                    const a = [
                        t
                    ].concat(n).join('.');
                    const r = e[s].split('.');
                    const l = r.pop();
                    const c = r.join('.');
                    i.d.route(a, o, c, l);
                });
            }
            function tL(t) {
                return 'id' in t && 'defaults' in t;
            }
            class tE {
                constructor(){
                    this.controllers = new tD(z, 'datasets', true);
                    this.elements = new tD(tn, 'elements');
                    this.plugins = new tD(Object, 'plugins');
                    this.scales = new tD(tP, 'scales');
                    this._typedRegistries = [
                        this.controllers,
                        this.scales,
                        this.elements
                    ];
                }
                add(...t) {
                    this._each('register', t);
                }
                remove(...t) {
                    this._each('unregister', t);
                }
                addControllers(...t) {
                    this._each('register', t, this.controllers);
                }
                addElements(...t) {
                    this._each('register', t, this.elements);
                }
                addPlugins(...t) {
                    this._each('register', t, this.plugins);
                }
                addScales(...t) {
                    this._each('register', t, this.scales);
                }
                getController(t) {
                    return this._get(t, this.controllers, 'controller');
                }
                getElement(t) {
                    return this._get(t, this.elements, 'element');
                }
                getPlugin(t) {
                    return this._get(t, this.plugins, 'plugin');
                }
                getScale(t) {
                    return this._get(t, this.scales, 'scale');
                }
                removeControllers(...t) {
                    this._each('unregister', t, this.controllers);
                }
                removeElements(...t) {
                    this._each('unregister', t, this.elements);
                }
                removePlugins(...t) {
                    this._each('unregister', t, this.plugins);
                }
                removeScales(...t) {
                    this._each('unregister', t, this.scales);
                }
                _each(t, e, s) {
                    [
                        ...e
                    ].forEach((e)=>{
                        const n = s || this._getRegistryForType(e);
                        if (s || n.isForType(e) || (n === this.plugins && e.id)) {
                            this._exec(t, n, e);
                        } else {
                            (0, i.Q)(e, (e)=>{
                                const i = s || this._getRegistryForType(e);
                                this._exec(t, i, e);
                            });
                        }
                    });
                }
                _exec(t, e, s) {
                    const n = (0, i.W)(t);
                    (0, i.C)(s['before' + n], [], s);
                    e[t](s);
                    (0, i.C)(s['after' + n], [], s);
                }
                _getRegistryForType(t) {
                    for(let e = 0; e < this._typedRegistries.length; e++){
                        const s = this._typedRegistries[e];
                        if (s.isForType(t)) {
                            return s;
                        }
                    }
                    return this.plugins;
                }
                _get(t, e, s) {
                    const i = e.get(t);
                    if (i === undefined) {
                        throw new Error('"' + t + '" is not a registered ' + s + '.');
                    }
                    return i;
                }
            }
            var tA = new tE();
            class tT extends z {
                update(t) {
                    const e = this._cachedMeta;
                    const { data: s = []  } = e;
                    const n = this.chart._animationsDisabled;
                    let { start: o , count: a  } = (0, i.q)(e, s, n);
                    this._drawStart = o;
                    this._drawCount = a;
                    if ((0, i.w)(e)) {
                        o = 0;
                        a = s.length;
                    }
                    if (this.options.showLine) {
                        const { dataset: r , _dataset: l  } = e;
                        r._chart = this.chart;
                        r._datasetIndex = this.index;
                        r._decimated = !!l._decimated;
                        r.points = s;
                        const c = this.resolveDatasetElementOptions(t);
                        c.segment = this.options.segment;
                        this.updateElement(r, undefined, {
                            animated: !n,
                            options: c
                        }, t);
                    }
                    this.updateElements(s, o, a, t);
                }
                addElements() {
                    const { showLine: t  } = this.options;
                    if (!this.datasetElementType && t) {
                        this.datasetElementType = tA.getElement('line');
                    }
                    super.addElements();
                }
                updateElements(t, e, s, n) {
                    const o = n === 'reset';
                    const { iScale: a , vScale: r , _stacked: l , _dataset: c  } = this._cachedMeta;
                    const h = this.resolveDataElementOptions(e, n);
                    const d = this.getSharedOptions(h);
                    const f = this.includeOptions(n, d);
                    const u = a.axis;
                    const g = r.axis;
                    const { spanGaps: p , segment: m  } = this.options;
                    const b = (0, i.x)(p) ? p : Number.POSITIVE_INFINITY;
                    const x = this.chart._animationsDisabled || o || n === 'none';
                    let _ = e > 0 && this.getParsed(e - 1);
                    for(let y = e; y < e + s; ++y){
                        const v = t[y];
                        const M = this.getParsed(y);
                        const k = x ? v : {};
                        const w = (0, i.k)(M[g]);
                        const S = k[u] = a.getPixelForValue(M[u], y);
                        const P = k[g] = o || w ? r.getBasePixel() : r.getPixelForValue(l ? this.applyStack(r, M, l) : M[g], y);
                        k.skip = isNaN(S) || isNaN(P) || w;
                        k.stop = y > 0 && (Math.abs(M[u] - _[u])) > b;
                        if (m) {
                            k.parsed = M;
                            k.raw = c.data[y];
                        }
                        if (f) {
                            k.options = d || this.resolveDataElementOptions(y, v.active ? 'active' : n);
                        }
                        if (!x) {
                            this.updateElement(v, y, k, n);
                        }
                        _ = M;
                    }
                    this.updateSharedOptions(d, n, h);
                }
                getMaxOverflow() {
                    const t = this._cachedMeta;
                    const e = t.data || [];
                    if (!this.options.showLine) {
                        let s = 0;
                        for(let i = e.length - 1; i >= 0; --i){
                            s = Math.max(s, e[i].size(this.resolveDataElementOptions(i)) / 2);
                        }
                        return s > 0 && s;
                    }
                    const n = t.dataset;
                    const o = n.options && n.options.borderWidth || 0;
                    if (!e.length) {
                        return o;
                    }
                    const a = e[0].size(this.resolveDataElementOptions(0));
                    const r = e[e.length - 1].size(this.resolveDataElementOptions(e.length - 1));
                    return Math.max(o, a, r) / 2;
                }
            }
            tT.id = 'scatter';
            tT.defaults = {
                datasetElementType: false,
                dataElementType: 'point',
                showLine: false,
                fill: false
            };
            tT.overrides = {
                interaction: {
                    mode: 'point'
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            title () {
                                return '';
                            },
                            label (t) {
                                return '(' + t.label + ', ' + t.formattedValue + ')';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        type: 'linear'
                    },
                    y: {
                        type: 'linear'
                    }
                }
            };
            var tz = Object.freeze({
                __proto__: null,
                BarController: G,
                BubbleController: q,
                DoughnutController: Z,
                LineController: tt,
                PolarAreaController: te,
                PieController: ts,
                RadarController: ti,
                ScatterController: tT
            });
            function tR() {
                throw new Error('This method is not implemented: Check that a complete date adapter is provided.');
            }
            class tF {
                constructor(t){
                    this.options = t || {};
                }
                init(t) {}
                formats() {
                    return tR();
                }
                parse(t, e) {
                    return tR();
                }
                format(t, e) {
                    return tR();
                }
                add(t, e, s) {
                    return tR();
                }
                diff(t, e, s) {
                    return tR();
                }
                startOf(t, e, s) {
                    return tR();
                }
                endOf(t, e) {
                    return tR();
                }
            }
            tF.override = function(t) {
                Object.assign(tF.prototype, t);
            };
            var tI = {
                _date: tF
            };
            function tV(t, e, s, n) {
                const { controller: o , data: a , _sorted: r  } = t;
                const l = o._cachedMeta.iScale;
                if (l && e === l.axis && e !== 'r' && r && a.length) {
                    const c = l._reversePixels ? i.Y : i.Z;
                    if (!n) {
                        return c(a, e, s);
                    } else if (o._sharedOptions) {
                        const h = a[0];
                        const d = typeof h.getRange === 'function' && h.getRange(e);
                        if (d) {
                            const f = c(a, e, s - d);
                            const u = c(a, e, s + d);
                            return {
                                lo: f.lo,
                                hi: u.hi
                            };
                        }
                    }
                }
                return {
                    lo: 0,
                    hi: a.length - 1
                };
            }
            function tB(t, e, s, i, n) {
                const o = t.getSortedVisibleDatasetMetas();
                const a = s[e];
                for(let r = 0, l = o.length; r < l; ++r){
                    const { index: c , data: h  } = o[r];
                    const { lo: d , hi: f  } = tV(o[r], e, a, n);
                    for(let u = d; u <= f; ++u){
                        const g = h[u];
                        if (!g.skip) {
                            i(g, c, u);
                        }
                    }
                }
            }
            function tN(t) {
                const e = t.indexOf('x') !== -1;
                const s = t.indexOf('y') !== -1;
                return function(t, i) {
                    const n = e ? Math.abs(t.x - i.x) : 0;
                    const o = s ? Math.abs(t.y - i.y) : 0;
                    return Math.sqrt(Math.pow(n, 2) + Math.pow(o, 2));
                };
            }
            function tH(t, e, s, n, o) {
                const a = [];
                if (!o && !t.isPointInArea(e)) {
                    return a;
                }
                const r = function(s, r, l) {
                    if (!o && !(0, i.$)(s, t.chartArea, 0)) {
                        return;
                    }
                    if (s.inRange(e.x, e.y, n)) {
                        a.push({
                            element: s,
                            datasetIndex: r,
                            index: l
                        });
                    }
                };
                tB(t, s, e, r, true);
                return a;
            }
            function tW(t, e, s, n) {
                let o = [];
                function a(t, s, a) {
                    const { startAngle: r , endAngle: l  } = t.getProps([
                        'startAngle',
                        'endAngle'
                    ], n);
                    const { angle: c  } = (0, i.a0)(t, {
                        x: e.x,
                        y: e.y
                    });
                    if ((0, i.p)(c, r, l)) {
                        o.push({
                            element: t,
                            datasetIndex: s,
                            index: a
                        });
                    }
                }
                tB(t, s, e, a);
                return o;
            }
            function tj(t, e, s, i, n, o) {
                let a = [];
                const r = tN(s);
                let l = Number.POSITIVE_INFINITY;
                function c(s, c, h) {
                    const d = s.inRange(e.x, e.y, n);
                    if (i && !d) {
                        return;
                    }
                    const f = s.getCenterPoint(n);
                    const u = !!o || t.isPointInArea(f);
                    if (!u && !d) {
                        return;
                    }
                    const g = r(e, f);
                    if (g < l) {
                        a = [
                            {
                                element: s,
                                datasetIndex: c,
                                index: h
                            }
                        ];
                        l = g;
                    } else if (g === l) {
                        a.push({
                            element: s,
                            datasetIndex: c,
                            index: h
                        });
                    }
                }
                tB(t, s, e, c);
                return a;
            }
            function t$(t, e, s, i, n, o) {
                if (!o && !t.isPointInArea(e)) {
                    return [];
                }
                return s === 'r' && !i ? tW(t, e, s, n) : tj(t, e, s, i, n, o);
            }
            function tU(t, e, s, i, n) {
                const o = [];
                const a = s === 'x' ? 'inXRange' : 'inYRange';
                let r = false;
                tB(t, s, e, (t, i, l)=>{
                    if (t[a](e[s], n)) {
                        o.push({
                            element: t,
                            datasetIndex: i,
                            index: l
                        });
                        r = r || t.inRange(e.x, e.y, n);
                    }
                });
                if (i && !r) {
                    return [];
                }
                return o;
            }
            var tY = {
                evaluateInteractionItems: tB,
                modes: {
                    index (t, e, s, n) {
                        const o = (0, i.X)(e, t);
                        const a = s.axis || 'x';
                        const r = s.includeInvisible || false;
                        const l = s.intersect ? tH(t, o, a, n, r) : t$(t, o, a, false, n, r);
                        const c = [];
                        if (!l.length) {
                            return [];
                        }
                        t.getSortedVisibleDatasetMetas().forEach((t)=>{
                            const e = l[0].index;
                            const s = t.data[e];
                            if (s && !s.skip) {
                                c.push({
                                    element: s,
                                    datasetIndex: t.index,
                                    index: e
                                });
                            }
                        });
                        return c;
                    },
                    dataset (t, e, s, n) {
                        const o = (0, i.X)(e, t);
                        const a = s.axis || 'xy';
                        const r = s.includeInvisible || false;
                        let l = s.intersect ? tH(t, o, a, n, r) : t$(t, o, a, false, n, r);
                        if (l.length > 0) {
                            const c = l[0].datasetIndex;
                            const h = t.getDatasetMeta(c).data;
                            l = [];
                            for(let d = 0; d < h.length; ++d){
                                l.push({
                                    element: h[d],
                                    datasetIndex: c,
                                    index: d
                                });
                            }
                        }
                        return l;
                    },
                    point (t, e, s, n) {
                        const o = (0, i.X)(e, t);
                        const a = s.axis || 'xy';
                        const r = s.includeInvisible || false;
                        return tH(t, o, a, n, r);
                    },
                    nearest (t, e, s, n) {
                        const o = (0, i.X)(e, t);
                        const a = s.axis || 'xy';
                        const r = s.includeInvisible || false;
                        return t$(t, o, a, s.intersect, n, r);
                    },
                    x (t, e, s, n) {
                        const o = (0, i.X)(e, t);
                        return tU(t, o, 'x', s.intersect, n);
                    },
                    y (t, e, s, n) {
                        const o = (0, i.X)(e, t);
                        return tU(t, o, 'y', s.intersect, n);
                    }
                }
            };
            const tK = [
                'left',
                'top',
                'right',
                'bottom'
            ];
            function tQ(t, e) {
                return t.filter((t)=>t.pos === e);
            }
            function tX(t, e) {
                return t.filter((t)=>tK.indexOf(t.pos) === -1 && t.box.axis === e);
            }
            function tG(t, e) {
                return t.sort((t, s)=>{
                    const i = e ? s : t;
                    const n = e ? t : s;
                    return i.weight === n.weight ? i.index - n.index : i.weight - n.weight;
                });
            }
            function tq(t) {
                const e = [];
                let s, i, n, o, a, r;
                for(s = 0, i = (t || []).length; s < i; ++s){
                    n = t[s];
                    ({ position: o , options: { stack: a , stackWeight: r = 1  }  } = n);
                    e.push({
                        index: s,
                        box: n,
                        pos: o,
                        horizontal: n.isHorizontal(),
                        weight: n.weight,
                        stack: a && (o + a),
                        stackWeight: r
                    });
                }
                return e;
            }
            function tJ(t) {
                const e = {};
                for (const s of t){
                    const { stack: i , pos: n , stackWeight: o  } = s;
                    if (!i || !tK.includes(n)) {
                        continue;
                    }
                    const a = e[i] || (e[i] = {
                        count: 0,
                        placed: 0,
                        weight: 0,
                        size: 0
                    });
                    a.count++;
                    a.weight += o;
                }
                return e;
            }
            function tZ(t, e) {
                const s = tJ(t);
                const { vBoxMaxWidth: i , hBoxMaxHeight: n  } = e;
                let o, a, r;
                for(o = 0, a = t.length; o < a; ++o){
                    r = t[o];
                    const { fullSize: l  } = r.box;
                    const c = s[r.stack];
                    const h = c && r.stackWeight / c.weight;
                    if (r.horizontal) {
                        r.width = h ? h * i : l && e.availableWidth;
                        r.height = n;
                    } else {
                        r.width = i;
                        r.height = h ? h * n : l && e.availableHeight;
                    }
                }
                return s;
            }
            function t0(t) {
                const e = tq(t);
                const s = tG(e.filter((t)=>t.box.fullSize), true);
                const i = tG(tQ(e, 'left'), true);
                const n = tG(tQ(e, 'right'));
                const o = tG(tQ(e, 'top'), true);
                const a = tG(tQ(e, 'bottom'));
                const r = tX(e, 'x');
                const l = tX(e, 'y');
                return {
                    fullSize: s,
                    leftAndTop: i.concat(o),
                    rightAndBottom: n.concat(l).concat(a).concat(r),
                    chartArea: tQ(e, 'chartArea'),
                    vertical: i.concat(n).concat(l),
                    horizontal: o.concat(a).concat(r)
                };
            }
            function t1(t, e, s, i) {
                return Math.max(t[s], e[s]) + Math.max(t[i], e[i]);
            }
            function t2(t, e) {
                t.top = Math.max(t.top, e.top);
                t.left = Math.max(t.left, e.left);
                t.bottom = Math.max(t.bottom, e.bottom);
                t.right = Math.max(t.right, e.right);
            }
            function t5(t, e, s, n) {
                const { pos: o , box: a  } = s;
                const r = t.maxPadding;
                if (!(0, i.i)(o)) {
                    if (s.size) {
                        t[o] -= s.size;
                    }
                    const l = n[s.stack] || {
                        size: 0,
                        count: 1
                    };
                    l.size = Math.max(l.size, s.horizontal ? a.height : a.width);
                    s.size = l.size / l.count;
                    t[o] += s.size;
                }
                if (a.getPadding) {
                    t2(r, a.getPadding());
                }
                const c = Math.max(0, e.outerWidth - t1(r, t, 'left', 'right'));
                const h = Math.max(0, e.outerHeight - t1(r, t, 'top', 'bottom'));
                const d = c !== t.w;
                const f = h !== t.h;
                t.w = c;
                t.h = h;
                return s.horizontal ? {
                    same: d,
                    other: f
                } : {
                    same: f,
                    other: d
                };
            }
            function t3(t) {
                const e = t.maxPadding;
                function s(s) {
                    const i = Math.max(e[s] - t[s], 0);
                    t[s] += i;
                    return i;
                }
                t.y += s('top');
                t.x += s('left');
                s('right');
                s('bottom');
            }
            function t6(t, e) {
                const s = e.maxPadding;
                function i(t) {
                    const i = {
                        left: 0,
                        top: 0,
                        right: 0,
                        bottom: 0
                    };
                    t.forEach((t)=>{
                        i[t] = Math.max(e[t], s[t]);
                    });
                    return i;
                }
                return t ? i([
                    'left',
                    'right'
                ]) : i([
                    'top',
                    'bottom'
                ]);
            }
            function t4(t, e, s, i) {
                const n = [];
                let o, a, r, l, c, h;
                for(o = 0, a = t.length, c = 0; o < a; ++o){
                    r = t[o];
                    l = r.box;
                    l.update(r.width || e.w, r.height || e.h, t6(r.horizontal, e));
                    const { same: d , other: f  } = t5(e, s, r, i);
                    c |= d && n.length;
                    h = h || f;
                    if (!l.fullSize) {
                        n.push(r);
                    }
                }
                return c && t4(n, e, s, i) || h;
            }
            function t7(t, e, s, i, n) {
                t.top = s;
                t.left = e;
                t.right = e + i;
                t.bottom = s + n;
                t.width = i;
                t.height = n;
            }
            function t8(t, e, s, n) {
                const o = s.padding;
                let { x: a , y: r  } = e;
                for (const l of t){
                    const c = l.box;
                    const h = n[l.stack] || {
                        count: 1,
                        placed: 0,
                        weight: 1
                    };
                    const d = (l.stackWeight / h.weight) || 1;
                    if (l.horizontal) {
                        const f = e.w * d;
                        const u = h.size || c.height;
                        if ((0, i.j)(h.start)) {
                            r = h.start;
                        }
                        if (c.fullSize) {
                            t7(c, o.left, r, s.outerWidth - o.right - o.left, u);
                        } else {
                            t7(c, e.left + h.placed, r, f, u);
                        }
                        h.start = r;
                        h.placed += f;
                        r = c.bottom;
                    } else {
                        const g = e.h * d;
                        const p = h.size || c.width;
                        if ((0, i.j)(h.start)) {
                            a = h.start;
                        }
                        if (c.fullSize) {
                            t7(c, a, o.top, p, s.outerHeight - o.bottom - o.top);
                        } else {
                            t7(c, a, e.top + h.placed, p, g);
                        }
                        h.start = a;
                        h.placed += g;
                        a = c.right;
                    }
                }
                e.x = a;
                e.y = r;
            }
            i.d.set('layout', {
                autoPadding: true,
                padding: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                }
            });
            var t9 = {
                addBox (t, e) {
                    if (!t.boxes) {
                        t.boxes = [];
                    }
                    e.fullSize = e.fullSize || false;
                    e.position = e.position || 'top';
                    e.weight = e.weight || 0;
                    e._layers = e._layers || function() {
                        return [
                            {
                                z: 0,
                                draw (t) {
                                    e.draw(t);
                                }
                            }
                        ];
                    };
                    t.boxes.push(e);
                },
                removeBox (t, e) {
                    const s = t.boxes ? t.boxes.indexOf(e) : -1;
                    if (s !== -1) {
                        t.boxes.splice(s, 1);
                    }
                },
                configure (t, e, s) {
                    e.fullSize = s.fullSize;
                    e.position = s.position;
                    e.weight = s.weight;
                },
                update (t, e, s, n) {
                    if (!t) {
                        return;
                    }
                    const o = (0, i.K)(t.options.layout.padding);
                    const a = Math.max(e - o.width, 0);
                    const r = Math.max(s - o.height, 0);
                    const l = t0(t.boxes);
                    const c = l.vertical;
                    const h = l.horizontal;
                    (0, i.Q)(t.boxes, (t)=>{
                        if (typeof t.beforeLayout === 'function') {
                            t.beforeLayout();
                        }
                    });
                    const d = c.reduce((t, e)=>e.box.options && e.box.options.display === false ? t : t + 1, 0) || 1;
                    const f = Object.freeze({
                        outerWidth: e,
                        outerHeight: s,
                        padding: o,
                        availableWidth: a,
                        availableHeight: r,
                        vBoxMaxWidth: a / 2 / d,
                        hBoxMaxHeight: r / 2
                    });
                    const u = Object.assign({}, o);
                    t2(u, (0, i.K)(n));
                    const g = Object.assign({
                        maxPadding: u,
                        w: a,
                        h: r,
                        x: o.left,
                        y: o.top
                    }, o);
                    const p = tZ(c.concat(h), f);
                    t4(l.fullSize, g, f, p);
                    t4(c, g, f, p);
                    if (t4(h, g, f, p)) {
                        t4(c, g, f, p);
                    }
                    t3(g);
                    t8(l.leftAndTop, g, f, p);
                    g.x += g.w;
                    g.y += g.h;
                    t8(l.rightAndBottom, g, f, p);
                    t.chartArea = {
                        left: g.left,
                        top: g.top,
                        right: g.left + g.w,
                        bottom: g.top + g.h,
                        height: g.h,
                        width: g.w
                    };
                    (0, i.Q)(l.chartArea, (e)=>{
                        const s = e.box;
                        Object.assign(s, t.chartArea);
                        s.update(g.w, g.h, {
                            left: 0,
                            top: 0,
                            right: 0,
                            bottom: 0
                        });
                    });
                }
            };
            class et {
                acquireContext(t, e) {}
                releaseContext(t) {
                    return false;
                }
                addEventListener(t, e, s) {}
                removeEventListener(t, e, s) {}
                getDevicePixelRatio() {
                    return 1;
                }
                getMaximumSize(t, e, s, i) {
                    e = Math.max(0, e || t.width);
                    s = s || t.height;
                    return {
                        width: e,
                        height: Math.max(0, i ? Math.floor(e / i) : s)
                    };
                }
                isAttached(t) {
                    return true;
                }
                updateConfig(t) {}
            }
            class ee extends et {
                acquireContext(t) {
                    return t && t.getContext && t.getContext('2d') || null;
                }
                updateConfig(t) {
                    t.options.animation = false;
                }
            }
            const es = '$chartjs';
            const ei = {
                touchstart: 'mousedown',
                touchmove: 'mousemove',
                touchend: 'mouseup',
                pointerenter: 'mouseenter',
                pointerdown: 'mousedown',
                pointermove: 'mousemove',
                pointerup: 'mouseup',
                pointerleave: 'mouseout',
                pointerout: 'mouseout'
            };
            const en = (t)=>t === null || t === '';
            function eo(t, e) {
                const s = t.style;
                const n = t.getAttribute('height');
                const o = t.getAttribute('width');
                t[es] = {
                    initial: {
                        height: n,
                        width: o,
                        style: {
                            display: s.display,
                            height: s.height,
                            width: s.width
                        }
                    }
                };
                s.display = s.display || 'block';
                s.boxSizing = s.boxSizing || 'border-box';
                if (en(o)) {
                    const a = (0, i.a3)(t, 'width');
                    if (a !== undefined) {
                        t.width = a;
                    }
                }
                if (en(n)) {
                    if (t.style.height === '') {
                        t.height = t.width / (e || 2);
                    } else {
                        const r = (0, i.a3)(t, 'height');
                        if (r !== undefined) {
                            t.height = r;
                        }
                    }
                }
                return t;
            }
            const ea = i.a5 ? {
                passive: true
            } : false;
            function er(t, e, s) {
                t.addEventListener(e, s, ea);
            }
            function el(t, e, s) {
                t.canvas.removeEventListener(e, s, ea);
            }
            function ec(t, e) {
                const s = ei[t.type] || t.type;
                const { x: n , y: o  } = (0, i.X)(t, e);
                return {
                    type: s,
                    chart: e,
                    native: t,
                    x: n !== undefined ? n : null,
                    y: o !== undefined ? o : null
                };
            }
            function eh(t, e) {
                for (const s of t){
                    if (s === e || s.contains(e)) {
                        return true;
                    }
                }
            }
            function ed(t, e, s) {
                const i = t.canvas;
                const n = new MutationObserver((t)=>{
                    let e = false;
                    for (const n of t){
                        e = e || eh(n.addedNodes, i);
                        e = e && !eh(n.removedNodes, i);
                    }
                    if (e) {
                        s();
                    }
                });
                n.observe(document, {
                    childList: true,
                    subtree: true
                });
                return n;
            }
            function ef(t, e, s) {
                const i = t.canvas;
                const n = new MutationObserver((t)=>{
                    let e = false;
                    for (const n of t){
                        e = e || eh(n.removedNodes, i);
                        e = e && !eh(n.addedNodes, i);
                    }
                    if (e) {
                        s();
                    }
                });
                n.observe(document, {
                    childList: true,
                    subtree: true
                });
                return n;
            }
            const eu = new Map();
            let eg = 0;
            function ep() {
                const t = window.devicePixelRatio;
                if (t === eg) {
                    return;
                }
                eg = t;
                eu.forEach((e, s)=>{
                    if (s.currentDevicePixelRatio !== t) {
                        e();
                    }
                });
            }
            function em(t, e) {
                if (!eu.size) {
                    window.addEventListener('resize', ep);
                }
                eu.set(t, e);
            }
            function eb(t) {
                eu.delete(t);
                if (!eu.size) {
                    window.removeEventListener('resize', ep);
                }
            }
            function ex(t, e, s) {
                const n = t.canvas;
                const o = n && (0, i.a2)(n);
                if (!o) {
                    return;
                }
                const a = (0, i.a4)((t, e)=>{
                    const i = o.clientWidth;
                    s(t, e);
                    if (i < o.clientWidth) {
                        s();
                    }
                }, window);
                const r = new ResizeObserver((t)=>{
                    const e = t[0];
                    const s = e.contentRect.width;
                    const i = e.contentRect.height;
                    if (s === 0 && i === 0) {
                        return;
                    }
                    a(s, i);
                });
                r.observe(o);
                em(t, a);
                return r;
            }
            function e_(t, e, s) {
                if (s) {
                    s.disconnect();
                }
                if (e === 'resize') {
                    eb(t);
                }
            }
            function ey(t, e, s) {
                const n = t.canvas;
                const o = (0, i.a4)((e)=>{
                    if (t.ctx !== null) {
                        s(ec(e, t));
                    }
                }, t, (t)=>{
                    const e = t[0];
                    return [
                        e,
                        e.offsetX,
                        e.offsetY
                    ];
                });
                er(n, e, o);
                return o;
            }
            class ev extends et {
                acquireContext(t, e) {
                    const s = t && t.getContext && t.getContext('2d');
                    if (s && s.canvas === t) {
                        eo(t, e);
                        return s;
                    }
                    return null;
                }
                releaseContext(t) {
                    const e = t.canvas;
                    if (!e[es]) {
                        return false;
                    }
                    const s = e[es].initial;
                    [
                        'height',
                        'width'
                    ].forEach((t)=>{
                        const n = s[t];
                        if ((0, i.k)(n)) {
                            e.removeAttribute(t);
                        } else {
                            e.setAttribute(t, n);
                        }
                    });
                    const n = s.style || {};
                    Object.keys(n).forEach((t)=>{
                        e.style[t] = n[t];
                    });
                    e.width = e.width;
                    delete e[es];
                    return true;
                }
                addEventListener(t, e, s) {
                    this.removeEventListener(t, e);
                    const i = t.$proxies || (t.$proxies = {});
                    const n = {
                        attach: ed,
                        detach: ef,
                        resize: ex
                    };
                    const o = n[e] || ey;
                    i[e] = o(t, e, s);
                }
                removeEventListener(t, e) {
                    const s = t.$proxies || (t.$proxies = {});
                    const i = s[e];
                    if (!i) {
                        return;
                    }
                    const n = {
                        attach: e_,
                        detach: e_,
                        resize: e_
                    };
                    const o = n[e] || el;
                    o(t, e, i);
                    s[e] = undefined;
                }
                getDevicePixelRatio() {
                    return window.devicePixelRatio;
                }
                getMaximumSize(t, e, s, n) {
                    return (0, i.a1)(t, e, s, n);
                }
                isAttached(t) {
                    const e = (0, i.a2)(t);
                    return !!(e && e.isConnected);
                }
            }
            function eM(t) {
                if (!(0, i.a6)() || (typeof OffscreenCanvas !== 'undefined' && t instanceof OffscreenCanvas)) {
                    return ee;
                }
                return ev;
            }
            class ek {
                constructor(){
                    this._init = [];
                }
                notify(t, e, s, i) {
                    if (e === 'beforeInit') {
                        this._init = this._createDescriptors(t, true);
                        this._notify(this._init, t, 'install');
                    }
                    const n = i ? this._descriptors(t).filter(i) : this._descriptors(t);
                    const o = this._notify(n, t, e, s);
                    if (e === 'afterDestroy') {
                        this._notify(n, t, 'stop');
                        this._notify(this._init, t, 'uninstall');
                    }
                    return o;
                }
                _notify(t, e, s, n) {
                    n = n || {};
                    for (const o of t){
                        const a = o.plugin;
                        const r = a[s];
                        const l = [
                            e,
                            n,
                            o.options
                        ];
                        if ((0, i.C)(r, l, a) === false && n.cancelable) {
                            return false;
                        }
                    }
                    return true;
                }
                invalidate() {
                    if (!(0, i.k)(this._cache)) {
                        this._oldCache = this._cache;
                        this._cache = undefined;
                    }
                }
                _descriptors(t) {
                    if (this._cache) {
                        return this._cache;
                    }
                    const e = this._cache = this._createDescriptors(t);
                    this._notifyStateChanges(t);
                    return e;
                }
                _createDescriptors(t, e) {
                    const s = t && t.config;
                    const n = (0, i.v)(s.options && s.options.plugins, {});
                    const o = ew(s);
                    return n === false && !e ? [] : eP(t, o, n, e);
                }
                _notifyStateChanges(t) {
                    const e = this._oldCache || [];
                    const s = this._cache;
                    const i = (t, e)=>t.filter((t)=>!e.some((e)=>t.plugin.id === e.plugin.id));
                    this._notify(i(e, s), t, 'stop');
                    this._notify(i(s, e), t, 'start');
                }
            }
            function ew(t) {
                const e = {};
                const s = [];
                const i = Object.keys(tA.plugins.items);
                for(let n = 0; n < i.length; n++){
                    s.push(tA.getPlugin(i[n]));
                }
                const o = t.plugins || [];
                for(let a = 0; a < o.length; a++){
                    const r = o[a];
                    if (s.indexOf(r) === -1) {
                        s.push(r);
                        e[r.id] = true;
                    }
                }
                return {
                    plugins: s,
                    localIds: e
                };
            }
            function eS(t, e) {
                if (!e && t === false) {
                    return null;
                }
                if (t === true) {
                    return {};
                }
                return t;
            }
            function eP(t, { plugins: e , localIds: s  }, i, n) {
                const o = [];
                const a = t.getContext();
                for (const r of e){
                    const l = r.id;
                    const c = eS(i[l], n);
                    if (c === null) {
                        continue;
                    }
                    o.push({
                        plugin: r,
                        options: eD(t.config, {
                            plugin: r,
                            local: s[l]
                        }, c, a)
                    });
                }
                return o;
            }
            function eD(t, { plugin: e , local: s  }, i, n) {
                const o = t.pluginScopeKeys(e);
                const a = t.getOptionScopes(i, o);
                if (s && e.defaults) {
                    a.push(e.defaults);
                }
                return t.createResolver(a, n, [
                    ''
                ], {
                    scriptable: false,
                    indexable: false,
                    allKeys: true
                });
            }
            function eC(t, e) {
                const s = i.d.datasets[t] || {};
                const n = (e.datasets || {})[t] || {};
                return n.indexAxis || e.indexAxis || s.indexAxis || 'x';
            }
            function eO(t, e) {
                let s = t;
                if (t === '_index_') {
                    s = e;
                } else if (t === '_value_') {
                    s = e === 'x' ? 'y' : 'x';
                }
                return s;
            }
            function eL(t, e) {
                return t === e ? '_index_' : '_value_';
            }
            function eE(t) {
                if (t === 'top' || t === 'bottom') {
                    return 'x';
                }
                if (t === 'left' || t === 'right') {
                    return 'y';
                }
            }
            function eA(t, e) {
                if (t === 'x' || t === 'y') {
                    return t;
                }
                return e.axis || eE(e.position) || t.charAt(0).toLowerCase();
            }
            function eT(t, e) {
                const s = i.U[t.type] || {
                    scales: {}
                };
                const n = e.scales || {};
                const o = eC(t.type, e);
                const a = Object.create(null);
                const r = Object.create(null);
                Object.keys(n).forEach((t)=>{
                    const e = n[t];
                    if (!(0, i.i)(e)) {
                        return console.error(`Invalid scale configuration for scale: ${t}`);
                    }
                    if (e._proxy) {
                        return console.warn(`Ignoring resolver passed as options for scale: ${t}`);
                    }
                    const l = eA(t, e);
                    const c = eL(l, o);
                    const h = s.scales || {};
                    a[l] = a[l] || t;
                    r[t] = (0, i.ac)(Object.create(null), [
                        {
                            axis: l
                        },
                        e,
                        h[l],
                        h[c]
                    ]);
                });
                t.data.datasets.forEach((s)=>{
                    const o = s.type || t.type;
                    const l = s.indexAxis || eC(o, e);
                    const c = i.U[o] || {};
                    const h = c.scales || {};
                    Object.keys(h).forEach((t)=>{
                        const e = eO(t, l);
                        const o = s[e + 'AxisID'] || a[e] || e;
                        r[o] = r[o] || Object.create(null);
                        (0, i.ac)(r[o], [
                            {
                                axis: e
                            },
                            n[o],
                            h[t]
                        ]);
                    });
                });
                Object.keys(r).forEach((t)=>{
                    const e = r[t];
                    (0, i.ac)(e, [
                        i.d.scales[e.type],
                        i.d.scale
                    ]);
                });
                return r;
            }
            function ez(t) {
                const e = t.options || (t.options = {});
                e.plugins = (0, i.v)(e.plugins, {});
                e.scales = eT(t, e);
            }
            function eR(t) {
                t = t || {};
                t.datasets = t.datasets || [];
                t.labels = t.labels || [];
                return t;
            }
            function eF(t) {
                t = t || {};
                t.data = eR(t.data);
                ez(t);
                return t;
            }
            const eI = new Map();
            const eV = new Set();
            function eB(t, e) {
                let s = eI.get(t);
                if (!s) {
                    s = e();
                    eI.set(t, s);
                    eV.add(s);
                }
                return s;
            }
            const eN = (t, e, s)=>{
                const n = (0, i.f)(e, s);
                if (n !== undefined) {
                    t.add(n);
                }
            };
            class eH {
                constructor(t){
                    this._config = eF(t);
                    this._scopeCache = new Map();
                    this._resolverCache = new Map();
                }
                get platform() {
                    return this._config.platform;
                }
                get type() {
                    return this._config.type;
                }
                set type(t) {
                    this._config.type = t;
                }
                get data() {
                    return this._config.data;
                }
                set data(t) {
                    this._config.data = eR(t);
                }
                get options() {
                    return this._config.options;
                }
                set options(t) {
                    this._config.options = t;
                }
                get plugins() {
                    return this._config.plugins;
                }
                update() {
                    const t = this._config;
                    this.clearCache();
                    ez(t);
                }
                clearCache() {
                    this._scopeCache.clear();
                    this._resolverCache.clear();
                }
                datasetScopeKeys(t) {
                    return eB(t, ()=>[
                            [
                                `datasets.${t}`,
                                ''
                            ]
                        ]);
                }
                datasetAnimationScopeKeys(t, e) {
                    return eB(`${t}.transition.${e}`, ()=>[
                            [
                                `datasets.${t}.transitions.${e}`,
                                `transitions.${e}`
                            ],
                            [
                                `datasets.${t}`,
                                ''
                            ]
                        ]);
                }
                datasetElementScopeKeys(t, e) {
                    return eB(`${t}-${e}`, ()=>[
                            [
                                `datasets.${t}.elements.${e}`,
                                `datasets.${t}`,
                                `elements.${e}`,
                                ''
                            ]
                        ]);
                }
                pluginScopeKeys(t) {
                    const e = t.id;
                    const s = this.type;
                    return eB(`${s}-plugin-${e}`, ()=>[
                            [
                                `plugins.${e}`,
                                ...t.additionalOptionScopes || []
                            ]
                        ]);
                }
                _cachedScopes(t, e) {
                    const s = this._scopeCache;
                    let i = s.get(t);
                    if (!i || e) {
                        i = new Map();
                        s.set(t, i);
                    }
                    return i;
                }
                getOptionScopes(t, e, s) {
                    const { options: n , type: o  } = this;
                    const a = this._cachedScopes(t, s);
                    const r = a.get(e);
                    if (r) {
                        return r;
                    }
                    const l = new Set();
                    e.forEach((e)=>{
                        if (t) {
                            l.add(t);
                            e.forEach((e)=>eN(l, t, e));
                        }
                        e.forEach((t)=>eN(l, n, t));
                        e.forEach((t)=>eN(l, i.U[o] || {}, t));
                        e.forEach((t)=>eN(l, i.d, t));
                        e.forEach((t)=>eN(l, i.a7, t));
                    });
                    const c = Array.from(l);
                    if (c.length === 0) {
                        c.push(Object.create(null));
                    }
                    if (eV.has(e)) {
                        a.set(e, c);
                    }
                    return c;
                }
                chartOptionScopes() {
                    const { options: t , type: e  } = this;
                    return [
                        t,
                        i.U[e] || {},
                        i.d.datasets[e] || {},
                        {
                            type: e
                        },
                        i.d,
                        i.a7
                    ];
                }
                resolveNamedOptions(t, e, s, n = [
                    ''
                ]) {
                    const o = {
                        $shared: true
                    };
                    const { resolver: a , subPrefixes: r  } = eW(this._resolverCache, t, n);
                    let l = a;
                    if (e$(a, e)) {
                        o.$shared = false;
                        s = (0, i.a8)(s) ? s() : s;
                        const c = this.createResolver(t, s, r);
                        l = (0, i.a9)(a, s, c);
                    }
                    for (const h of e){
                        o[h] = l[h];
                    }
                    return o;
                }
                createResolver(t, e, s = [
                    ''
                ], n) {
                    const { resolver: o  } = eW(this._resolverCache, t, s);
                    return (0, i.i)(e) ? (0, i.a9)(o, e, undefined, n) : o;
                }
            }
            function eW(t, e, s) {
                let n = t.get(e);
                if (!n) {
                    n = new Map();
                    t.set(e, n);
                }
                const o = s.join();
                let a = n.get(o);
                if (!a) {
                    const r = (0, i.aa)(e, s);
                    a = {
                        resolver: r,
                        subPrefixes: s.filter((t)=>!t.toLowerCase().includes('hover'))
                    };
                    n.set(o, a);
                }
                return a;
            }
            const ej = (t)=>(0, i.i)(t) && Object.getOwnPropertyNames(t).reduce((e, s)=>e || (0, i.a8)(t[s]), false);
            function e$(t, e) {
                const { isScriptable: s , isIndexable: n  } = (0, i.ab)(t);
                for (const o of e){
                    const a = s(o);
                    const r = n(o);
                    const l = (r || a) && t[o];
                    if ((a && ((0, i.a8)(l) || ej(l))) || (r && (0, i.b)(l))) {
                        return true;
                    }
                }
                return false;
            }
            var eU = "3.9.1";
            const eY = [
                'top',
                'bottom',
                'left',
                'right',
                'chartArea'
            ];
            function eK(t, e) {
                return t === 'top' || t === 'bottom' || (eY.indexOf(t) === -1 && e === 'x');
            }
            function eQ(t, e) {
                return function(s, i) {
                    return s[t] === i[t] ? s[e] - i[e] : s[t] - i[t];
                };
            }
            function eX(t) {
                const e = t.chart;
                const s = e.options.animation;
                e.notifyPlugins('afterRender');
                (0, i.C)(s && s.onComplete, [
                    t
                ], e);
            }
            function eG(t) {
                const e = t.chart;
                const s = e.options.animation;
                (0, i.C)(s && s.onProgress, [
                    t
                ], e);
            }
            function eq(t) {
                if ((0, i.a6)() && typeof t === 'string') {
                    t = document.getElementById(t);
                } else if (t && t.length) {
                    t = t[0];
                }
                if (t && t.canvas) {
                    t = t.canvas;
                }
                return t;
            }
            const eJ = {};
            const eZ = (t)=>{
                const e = eq(t);
                return Object.values(eJ).filter((t)=>t.canvas === e).pop();
            };
            function e0(t, e, s) {
                const i = Object.keys(t);
                for (const n of i){
                    const o = +n;
                    if (o >= e) {
                        const a = t[n];
                        delete t[n];
                        if (s > 0 || o > e) {
                            t[o + s] = a;
                        }
                    }
                }
            }
            function e1(t, e, s, i) {
                if (!s || t.type === 'mouseout') {
                    return null;
                }
                if (i) {
                    return e;
                }
                return t;
            }
            class e2 {
                constructor(t, e){
                    const s = this.config = new eH(e);
                    const n = eq(t);
                    const a = eZ(n);
                    if (a) {
                        throw new Error('Canvas is already in use. Chart with ID \'' + a.id + '\'' + ' must be destroyed before the canvas with ID \'' + a.canvas.id + '\' can be reused.');
                    }
                    const r = s.createResolver(s.chartOptionScopes(), this.getContext());
                    this.platform = new (s.platform || eM(n))();
                    this.platform.updateConfig(s);
                    const l = this.platform.acquireContext(n, r.aspectRatio);
                    const c = l && l.canvas;
                    const h = c && c.height;
                    const d = c && c.width;
                    this.id = (0, i.ad)();
                    this.ctx = l;
                    this.canvas = c;
                    this.width = d;
                    this.height = h;
                    this._options = r;
                    this._aspectRatio = this.aspectRatio;
                    this._layers = [];
                    this._metasets = [];
                    this._stacks = undefined;
                    this.boxes = [];
                    this.currentDevicePixelRatio = undefined;
                    this.chartArea = undefined;
                    this._active = [];
                    this._lastEvent = undefined;
                    this._listeners = {};
                    this._responsiveListeners = undefined;
                    this._sortedMetasets = [];
                    this.scales = {};
                    this._plugins = new ek();
                    this.$proxies = {};
                    this._hiddenIndices = {};
                    this.attached = false;
                    this._animationsDisabled = undefined;
                    this.$context = undefined;
                    this._doResize = (0, i.ae)((t)=>this.update(t), r.resizeDelay || 0);
                    this._dataChanges = [];
                    eJ[this.id] = this;
                    if (!l || !c) {
                        console.error("Failed to create chart: can't acquire context from the given item");
                        return;
                    }
                    o.listen(this, 'complete', eX);
                    o.listen(this, 'progress', eG);
                    this._initialize();
                    if (this.attached) {
                        this.update();
                    }
                }
                get aspectRatio() {
                    const { options: { aspectRatio: t , maintainAspectRatio: e  } , width: s , height: n , _aspectRatio: o  } = this;
                    if (!(0, i.k)(t)) {
                        return t;
                    }
                    if (e && o) {
                        return o;
                    }
                    return n ? s / n : null;
                }
                get data() {
                    return this.config.data;
                }
                set data(t) {
                    this.config.data = t;
                }
                get options() {
                    return this._options;
                }
                set options(t) {
                    this.config.options = t;
                }
                _initialize() {
                    this.notifyPlugins('beforeInit');
                    if (this.options.responsive) {
                        this.resize();
                    } else {
                        (0, i.af)(this, this.options.devicePixelRatio);
                    }
                    this.bindEvents();
                    this.notifyPlugins('afterInit');
                    return this;
                }
                clear() {
                    (0, i.ag)(this.canvas, this.ctx);
                    return this;
                }
                stop() {
                    o.stop(this);
                    return this;
                }
                resize(t, e) {
                    if (!o.running(this)) {
                        this._resize(t, e);
                    } else {
                        this._resizeBeforeDraw = {
                            width: t,
                            height: e
                        };
                    }
                }
                _resize(t, e) {
                    const s = this.options;
                    const n = this.canvas;
                    const o = s.maintainAspectRatio && this.aspectRatio;
                    const a = this.platform.getMaximumSize(n, t, e, o);
                    const r = s.devicePixelRatio || this.platform.getDevicePixelRatio();
                    const l = this.width ? 'resize' : 'attach';
                    this.width = a.width;
                    this.height = a.height;
                    this._aspectRatio = this.aspectRatio;
                    if (!(0, i.af)(this, r, true)) {
                        return;
                    }
                    this.notifyPlugins('resize', {
                        size: a
                    });
                    (0, i.C)(s.onResize, [
                        this,
                        a
                    ], this);
                    if (this.attached) {
                        if (this._doResize(l)) {
                            this.render();
                        }
                    }
                }
                ensureScalesHaveIDs() {
                    const t = this.options;
                    const e = t.scales || {};
                    (0, i.Q)(e, (t, e)=>{
                        t.id = e;
                    });
                }
                buildOrUpdateScales() {
                    const t = this.options;
                    const e = t.scales;
                    const s = this.scales;
                    const n = Object.keys(s).reduce((t, e)=>{
                        t[e] = false;
                        return t;
                    }, {});
                    let o = [];
                    if (e) {
                        o = o.concat(Object.keys(e).map((t)=>{
                            const s = e[t];
                            const i = eA(t, s);
                            const n = i === 'r';
                            const o = i === 'x';
                            return {
                                options: s,
                                dposition: n ? 'chartArea' : o ? 'bottom' : 'left',
                                dtype: n ? 'radialLinear' : o ? 'category' : 'linear'
                            };
                        }));
                    }
                    (0, i.Q)(o, (e)=>{
                        const o = e.options;
                        const a = o.id;
                        const r = eA(a, o);
                        const l = (0, i.v)(o.type, e.dtype);
                        if (o.position === undefined || eK(o.position, r) !== eK(e.dposition)) {
                            o.position = e.dposition;
                        }
                        n[a] = true;
                        let c = null;
                        if (a in s && s[a].type === l) {
                            c = s[a];
                        } else {
                            const h = tA.getScale(l);
                            c = new h({
                                id: a,
                                type: l,
                                ctx: this.ctx,
                                chart: this
                            });
                            s[c.id] = c;
                        }
                        c.init(o, t);
                    });
                    (0, i.Q)(n, (t, e)=>{
                        if (!t) {
                            delete s[e];
                        }
                    });
                    (0, i.Q)(s, (t)=>{
                        t9.configure(this, t, t.options);
                        t9.addBox(this, t);
                    });
                }
                _updateMetasets() {
                    const t = this._metasets;
                    const e = this.data.datasets.length;
                    const s = t.length;
                    t.sort((t, e)=>t.index - e.index);
                    if (s > e) {
                        for(let i = e; i < s; ++i){
                            this._destroyDatasetMeta(i);
                        }
                        t.splice(e, s - e);
                    }
                    this._sortedMetasets = t.slice(0).sort(eQ('order', 'index'));
                }
                _removeUnreferencedMetasets() {
                    const { _metasets: t , data: { datasets: e  }  } = this;
                    if (t.length > e.length) {
                        delete this._stacks;
                    }
                    t.forEach((t, s)=>{
                        if (e.filter((e)=>e === t._dataset).length === 0) {
                            this._destroyDatasetMeta(s);
                        }
                    });
                }
                buildOrUpdateControllers() {
                    const t = [];
                    const e = this.data.datasets;
                    let s, n;
                    this._removeUnreferencedMetasets();
                    for(s = 0, n = e.length; s < n; s++){
                        const o = e[s];
                        let a = this.getDatasetMeta(s);
                        const r = o.type || this.config.type;
                        if (a.type && a.type !== r) {
                            this._destroyDatasetMeta(s);
                            a = this.getDatasetMeta(s);
                        }
                        a.type = r;
                        a.indexAxis = o.indexAxis || eC(r, this.options);
                        a.order = o.order || 0;
                        a.index = s;
                        a.label = '' + o.label;
                        a.visible = this.isDatasetVisible(s);
                        if (a.controller) {
                            a.controller.updateIndex(s);
                            a.controller.linkScales();
                        } else {
                            const l = tA.getController(r);
                            const { datasetElementType: c , dataElementType: h  } = i.d.datasets[r];
                            Object.assign(l.prototype, {
                                dataElementType: tA.getElement(h),
                                datasetElementType: c && tA.getElement(c)
                            });
                            a.controller = new l(this, s);
                            t.push(a.controller);
                        }
                    }
                    this._updateMetasets();
                    return t;
                }
                _resetElements() {
                    (0, i.Q)(this.data.datasets, (t, e)=>{
                        this.getDatasetMeta(e).controller.reset();
                    }, this);
                }
                reset() {
                    this._resetElements();
                    this.notifyPlugins('reset');
                }
                update(t) {
                    const e = this.config;
                    e.update();
                    const s = this._options = e.createResolver(e.chartOptionScopes(), this.getContext());
                    const n = this._animationsDisabled = !s.animation;
                    this._updateScales();
                    this._checkEventBindings();
                    this._updateHiddenIndices();
                    this._plugins.invalidate();
                    if (this.notifyPlugins('beforeUpdate', {
                        mode: t,
                        cancelable: true
                    }) === false) {
                        return;
                    }
                    const o = this.buildOrUpdateControllers();
                    this.notifyPlugins('beforeElementsUpdate');
                    let a = 0;
                    for(let r = 0, l = this.data.datasets.length; r < l; r++){
                        const { controller: c  } = this.getDatasetMeta(r);
                        const h = !n && o.indexOf(c) === -1;
                        c.buildOrUpdateElements(h);
                        a = Math.max(+c.getMaxOverflow(), a);
                    }
                    a = this._minPadding = s.layout.autoPadding ? a : 0;
                    this._updateLayout(a);
                    if (!n) {
                        (0, i.Q)(o, (t)=>{
                            t.reset();
                        });
                    }
                    this._updateDatasets(t);
                    this.notifyPlugins('afterUpdate', {
                        mode: t
                    });
                    this._layers.sort(eQ('z', '_idx'));
                    const { _active: d , _lastEvent: f  } = this;
                    if (f) {
                        this._eventHandler(f, true);
                    } else if (d.length) {
                        this._updateHoverStyles(d, d, true);
                    }
                    this.render();
                }
                _updateScales() {
                    (0, i.Q)(this.scales, (t)=>{
                        t9.removeBox(this, t);
                    });
                    this.ensureScalesHaveIDs();
                    this.buildOrUpdateScales();
                }
                _checkEventBindings() {
                    const t = this.options;
                    const e = new Set(Object.keys(this._listeners));
                    const s = new Set(t.events);
                    if (!(0, i.ah)(e, s) || !!this._responsiveListeners !== t.responsive) {
                        this.unbindEvents();
                        this.bindEvents();
                    }
                }
                _updateHiddenIndices() {
                    const { _hiddenIndices: t  } = this;
                    const e = this._getUniformDataChanges() || [];
                    for (const { method: s , start: i , count: n  } of e){
                        const o = s === '_removeElements' ? -n : n;
                        e0(t, i, o);
                    }
                }
                _getUniformDataChanges() {
                    const t = this._dataChanges;
                    if (!t || !t.length) {
                        return;
                    }
                    this._dataChanges = [];
                    const e = this.data.datasets.length;
                    const s = (e)=>new Set(t.filter((t)=>t[0] === e).map((t, e)=>e + ',' + t.splice(1).join(',')));
                    const n = s(0);
                    for(let o = 1; o < e; o++){
                        if (!(0, i.ah)(n, s(o))) {
                            return;
                        }
                    }
                    return Array.from(n).map((t)=>t.split(',')).map((t)=>({
                            method: t[1],
                            start: +t[2],
                            count: +t[3]
                        }));
                }
                _updateLayout(t) {
                    if (this.notifyPlugins('beforeLayout', {
                        cancelable: true
                    }) === false) {
                        return;
                    }
                    t9.update(this, this.width, this.height, t);
                    const e = this.chartArea;
                    const s = e.width <= 0 || e.height <= 0;
                    this._layers = [];
                    (0, i.Q)(this.boxes, (t)=>{
                        if (s && t.position === 'chartArea') {
                            return;
                        }
                        if (t.configure) {
                            t.configure();
                        }
                        this._layers.push(...t._layers());
                    }, this);
                    this._layers.forEach((t, e)=>{
                        t._idx = e;
                    });
                    this.notifyPlugins('afterLayout');
                }
                _updateDatasets(t) {
                    if (this.notifyPlugins('beforeDatasetsUpdate', {
                        mode: t,
                        cancelable: true
                    }) === false) {
                        return;
                    }
                    for(let e = 0, s = this.data.datasets.length; e < s; ++e){
                        this.getDatasetMeta(e).controller.configure();
                    }
                    for(let n = 0, o = this.data.datasets.length; n < o; ++n){
                        this._updateDataset(n, (0, i.a8)(t) ? t({
                            datasetIndex: n
                        }) : t);
                    }
                    this.notifyPlugins('afterDatasetsUpdate', {
                        mode: t
                    });
                }
                _updateDataset(t, e) {
                    const s = this.getDatasetMeta(t);
                    const i = {
                        meta: s,
                        index: t,
                        mode: e,
                        cancelable: true
                    };
                    if (this.notifyPlugins('beforeDatasetUpdate', i) === false) {
                        return;
                    }
                    s.controller._update(e);
                    i.cancelable = false;
                    this.notifyPlugins('afterDatasetUpdate', i);
                }
                render() {
                    if (this.notifyPlugins('beforeRender', {
                        cancelable: true
                    }) === false) {
                        return;
                    }
                    if (o.has(this)) {
                        if (this.attached && !o.running(this)) {
                            o.start(this);
                        }
                    } else {
                        this.draw();
                        eX({
                            chart: this
                        });
                    }
                }
                draw() {
                    let t;
                    if (this._resizeBeforeDraw) {
                        const { width: e , height: s  } = this._resizeBeforeDraw;
                        this._resize(e, s);
                        this._resizeBeforeDraw = null;
                    }
                    this.clear();
                    if (this.width <= 0 || this.height <= 0) {
                        return;
                    }
                    if (this.notifyPlugins('beforeDraw', {
                        cancelable: true
                    }) === false) {
                        return;
                    }
                    const i = this._layers;
                    for(t = 0; t < i.length && i[t].z <= 0; ++t){
                        i[t].draw(this.chartArea);
                    }
                    this._drawDatasets();
                    for(; t < i.length; ++t){
                        i[t].draw(this.chartArea);
                    }
                    this.notifyPlugins('afterDraw');
                }
                _getSortedDatasetMetas(t) {
                    const e = this._sortedMetasets;
                    const s = [];
                    let i, n;
                    for(i = 0, n = e.length; i < n; ++i){
                        const o = e[i];
                        if (!t || o.visible) {
                            s.push(o);
                        }
                    }
                    return s;
                }
                getSortedVisibleDatasetMetas() {
                    return this._getSortedDatasetMetas(true);
                }
                _drawDatasets() {
                    if (this.notifyPlugins('beforeDatasetsDraw', {
                        cancelable: true
                    }) === false) {
                        return;
                    }
                    const t = this.getSortedVisibleDatasetMetas();
                    for(let e = t.length - 1; e >= 0; --e){
                        this._drawDataset(t[e]);
                    }
                    this.notifyPlugins('afterDatasetsDraw');
                }
                _drawDataset(t) {
                    const e = this.ctx;
                    const s = t._clip;
                    const n = !s.disabled;
                    const o = this.chartArea;
                    const a = {
                        meta: t,
                        index: t.index,
                        cancelable: true
                    };
                    if (this.notifyPlugins('beforeDatasetDraw', a) === false) {
                        return;
                    }
                    if (n) {
                        (0, i.L)(e, {
                            left: s.left === false ? 0 : o.left - s.left,
                            right: s.right === false ? this.width : o.right + s.right,
                            top: s.top === false ? 0 : o.top - s.top,
                            bottom: s.bottom === false ? this.height : o.bottom + s.bottom
                        });
                    }
                    t.controller.draw();
                    if (n) {
                        (0, i.N)(e);
                    }
                    a.cancelable = false;
                    this.notifyPlugins('afterDatasetDraw', a);
                }
                isPointInArea(t) {
                    return (0, i.$)(t, this.chartArea, this._minPadding);
                }
                getElementsAtEventForMode(t, e, s, i) {
                    const n = tY.modes[e];
                    if (typeof n === 'function') {
                        return n(this, t, s, i);
                    }
                    return [];
                }
                getDatasetMeta(t) {
                    const e = this.data.datasets[t];
                    const s = this._metasets;
                    let i = s.filter((t)=>t && t._dataset === e).pop();
                    if (!i) {
                        i = {
                            type: null,
                            data: [],
                            dataset: null,
                            controller: null,
                            hidden: null,
                            xAxisID: null,
                            yAxisID: null,
                            order: e && e.order || 0,
                            index: t,
                            _dataset: e,
                            _parsed: [],
                            _sorted: false
                        };
                        s.push(i);
                    }
                    return i;
                }
                getContext() {
                    return this.$context || (this.$context = (0, i.h)(null, {
                        chart: this,
                        type: 'chart'
                    }));
                }
                getVisibleDatasetCount() {
                    return this.getSortedVisibleDatasetMetas().length;
                }
                isDatasetVisible(t) {
                    const e = this.data.datasets[t];
                    if (!e) {
                        return false;
                    }
                    const s = this.getDatasetMeta(t);
                    return typeof s.hidden === 'boolean' ? !s.hidden : !e.hidden;
                }
                setDatasetVisibility(t, e) {
                    const s = this.getDatasetMeta(t);
                    s.hidden = !e;
                }
                toggleDataVisibility(t) {
                    this._hiddenIndices[t] = !this._hiddenIndices[t];
                }
                getDataVisibility(t) {
                    return !this._hiddenIndices[t];
                }
                _updateVisibility(t, e, s) {
                    const n = s ? 'show' : 'hide';
                    const o = this.getDatasetMeta(t);
                    const a = o.controller._resolveAnimations(undefined, n);
                    if ((0, i.j)(e)) {
                        o.data[e].hidden = !s;
                        this.update();
                    } else {
                        this.setDatasetVisibility(t, s);
                        a.update(o, {
                            visible: s
                        });
                        this.update((e)=>e.datasetIndex === t ? n : undefined);
                    }
                }
                hide(t, e) {
                    this._updateVisibility(t, e, false);
                }
                show(t, e) {
                    this._updateVisibility(t, e, true);
                }
                _destroyDatasetMeta(t) {
                    const e = this._metasets[t];
                    if (e && e.controller) {
                        e.controller._destroy();
                    }
                    delete this._metasets[t];
                }
                _stop() {
                    let t, e;
                    this.stop();
                    o.remove(this);
                    for(t = 0, e = this.data.datasets.length; t < e; ++t){
                        this._destroyDatasetMeta(t);
                    }
                }
                destroy() {
                    this.notifyPlugins('beforeDestroy');
                    const { canvas: t , ctx: e  } = this;
                    this._stop();
                    this.config.clearCache();
                    if (t) {
                        this.unbindEvents();
                        (0, i.ag)(t, e);
                        this.platform.releaseContext(e);
                        this.canvas = null;
                        this.ctx = null;
                    }
                    this.notifyPlugins('destroy');
                    delete eJ[this.id];
                    this.notifyPlugins('afterDestroy');
                }
                toBase64Image(...t) {
                    return this.canvas.toDataURL(...t);
                }
                bindEvents() {
                    this.bindUserEvents();
                    if (this.options.responsive) {
                        this.bindResponsiveEvents();
                    } else {
                        this.attached = true;
                    }
                }
                bindUserEvents() {
                    const t = this._listeners;
                    const e = this.platform;
                    const s = (s, i)=>{
                        e.addEventListener(this, s, i);
                        t[s] = i;
                    };
                    const n = (t, e, s)=>{
                        t.offsetX = e;
                        t.offsetY = s;
                        this._eventHandler(t);
                    };
                    (0, i.Q)(this.options.events, (t)=>s(t, n));
                }
                bindResponsiveEvents() {
                    if (!this._responsiveListeners) {
                        this._responsiveListeners = {};
                    }
                    const t = this._responsiveListeners;
                    const e = this.platform;
                    const s = (s, i)=>{
                        e.addEventListener(this, s, i);
                        t[s] = i;
                    };
                    const i = (s, i)=>{
                        if (t[s]) {
                            e.removeEventListener(this, s, i);
                            delete t[s];
                        }
                    };
                    const n = (t, e)=>{
                        if (this.canvas) {
                            this.resize(t, e);
                        }
                    };
                    let o;
                    const a = ()=>{
                        i('attach', a);
                        this.attached = true;
                        this.resize();
                        s('resize', n);
                        s('detach', o);
                    };
                    o = ()=>{
                        this.attached = false;
                        i('resize', n);
                        this._stop();
                        this._resize(0, 0);
                        s('attach', a);
                    };
                    if (e.isAttached(this.canvas)) {
                        a();
                    } else {
                        o();
                    }
                }
                unbindEvents() {
                    (0, i.Q)(this._listeners, (t, e)=>{
                        this.platform.removeEventListener(this, e, t);
                    });
                    this._listeners = {};
                    (0, i.Q)(this._responsiveListeners, (t, e)=>{
                        this.platform.removeEventListener(this, e, t);
                    });
                    this._responsiveListeners = undefined;
                }
                updateHoverStyle(t, e, s) {
                    const i = s ? 'set' : 'remove';
                    let n, o, a, r;
                    if (e === 'dataset') {
                        n = this.getDatasetMeta(t[0].datasetIndex);
                        n.controller['_' + i + 'DatasetHoverStyle']();
                    }
                    for(a = 0, r = t.length; a < r; ++a){
                        o = t[a];
                        const l = o && this.getDatasetMeta(o.datasetIndex).controller;
                        if (l) {
                            l[i + 'HoverStyle'](o.element, o.datasetIndex, o.index);
                        }
                    }
                }
                getActiveElements() {
                    return this._active || [];
                }
                setActiveElements(t) {
                    const e = this._active || [];
                    const s = t.map(({ datasetIndex: t , index: e  })=>{
                        const s = this.getDatasetMeta(t);
                        if (!s) {
                            throw new Error('No dataset found at index ' + t);
                        }
                        return {
                            datasetIndex: t,
                            element: s.data[e],
                            index: e
                        };
                    });
                    const n = !(0, i.ai)(s, e);
                    if (n) {
                        this._active = s;
                        this._lastEvent = null;
                        this._updateHoverStyles(s, e);
                    }
                }
                notifyPlugins(t, e, s) {
                    return this._plugins.notify(this, t, e, s);
                }
                _updateHoverStyles(t, e, s) {
                    const i = this.options.hover;
                    const n = (t, e)=>t.filter((t)=>!e.some((e)=>t.datasetIndex === e.datasetIndex && t.index === e.index));
                    const o = n(e, t);
                    const a = s ? t : n(t, e);
                    if (o.length) {
                        this.updateHoverStyle(o, i.mode, false);
                    }
                    if (a.length && i.mode) {
                        this.updateHoverStyle(a, i.mode, true);
                    }
                }
                _eventHandler(t, e) {
                    const s = {
                        event: t,
                        replay: e,
                        cancelable: true,
                        inChartArea: this.isPointInArea(t)
                    };
                    const i = (e)=>(e.options.events || this.options.events).includes(t.native.type);
                    if (this.notifyPlugins('beforeEvent', s, i) === false) {
                        return;
                    }
                    const n = this._handleEvent(t, e, s.inChartArea);
                    s.cancelable = false;
                    this.notifyPlugins('afterEvent', s, i);
                    if (n || s.changed) {
                        this.render();
                    }
                    return this;
                }
                _handleEvent(t, e, s) {
                    const { _active: n = [] , options: o  } = this;
                    const a = e;
                    const r = this._getActiveElements(t, n, s, a);
                    const l = (0, i.aj)(t);
                    const c = e1(t, this._lastEvent, s, l);
                    if (s) {
                        this._lastEvent = null;
                        (0, i.C)(o.onHover, [
                            t,
                            r,
                            this
                        ], this);
                        if (l) {
                            (0, i.C)(o.onClick, [
                                t,
                                r,
                                this
                            ], this);
                        }
                    }
                    const h = !(0, i.ai)(r, n);
                    if (h || e) {
                        this._active = r;
                        this._updateHoverStyles(r, n, e);
                    }
                    this._lastEvent = c;
                    return h;
                }
                _getActiveElements(t, e, s, i) {
                    if (t.type === 'mouseout') {
                        return [];
                    }
                    if (!s) {
                        return e;
                    }
                    const n = this.options.hover;
                    return this.getElementsAtEventForMode(t, n.mode, n, i);
                }
            }
            const e5 = ()=>(0, i.Q)(e2.instances, (t)=>t._plugins.invalidate());
            const e3 = true;
            Object.defineProperties(e2, {
                defaults: {
                    enumerable: e3,
                    value: i.d
                },
                instances: {
                    enumerable: e3,
                    value: eJ
                },
                overrides: {
                    enumerable: e3,
                    value: i.U
                },
                registry: {
                    enumerable: e3,
                    value: tA
                },
                version: {
                    enumerable: e3,
                    value: eU
                },
                getChart: {
                    enumerable: e3,
                    value: eZ
                },
                register: {
                    enumerable: e3,
                    value: (...t)=>{
                        tA.add(...t);
                        e5();
                    }
                },
                unregister: {
                    enumerable: e3,
                    value: (...t)=>{
                        tA.remove(...t);
                        e5();
                    }
                }
            });
            function e6(t, e, s) {
                const { startAngle: n , pixelMargin: o , x: a , y: r , outerRadius: l , innerRadius: c  } = e;
                let h = o / l;
                t.beginPath();
                t.arc(a, r, l, n - h, s + h);
                if (c > o) {
                    h = o / c;
                    t.arc(a, r, c, s + h, n - h, true);
                } else {
                    t.arc(a, r, o, s + i.H, n - i.H);
                }
                t.closePath();
                t.clip();
            }
            function e4(t) {
                return (0, i.al)(t, [
                    'outerStart',
                    'outerEnd',
                    'innerStart',
                    'innerEnd'
                ]);
            }
            function e7(t, e, s, n) {
                const o = e4(t.options.borderRadius);
                const a = (s - e) / 2;
                const r = Math.min(a, n * e / 2);
                const l = (t)=>{
                    const e = (s - Math.min(a, t)) * n / 2;
                    return (0, i.E)(t, 0, Math.min(a, e));
                };
                return {
                    outerStart: l(o.outerStart),
                    outerEnd: l(o.outerEnd),
                    innerStart: (0, i.E)(o.innerStart, 0, r),
                    innerEnd: (0, i.E)(o.innerEnd, 0, r)
                };
            }
            function e8(t, e, s, i) {
                return {
                    x: s + t * Math.cos(e),
                    y: i + t * Math.sin(e)
                };
            }
            function e9(t, e, s, n, o, a) {
                const { x: r , y: l , startAngle: c , pixelMargin: h , innerRadius: d  } = e;
                const f = Math.max(e.outerRadius + n + s - h, 0);
                const u = d > 0 ? d + n + s + h : 0;
                let g = 0;
                const p = o - c;
                if (n) {
                    const m = d > 0 ? d - n : 0;
                    const b = f > 0 ? f - n : 0;
                    const x = (m + b) / 2;
                    const _ = x !== 0 ? (p * x) / (x + n) : p;
                    g = (p - _) / 2;
                }
                const y = Math.max(0.001, p * f - s / i.P) / f;
                const v = (p - y) / 2;
                const M = c + v + g;
                const k = o - v - g;
                const { outerStart: w , outerEnd: S , innerStart: P , innerEnd: D  } = e7(e, u, f, k - M);
                const C = f - w;
                const O = f - S;
                const L = M + w / C;
                const E = k - S / O;
                const A = u + P;
                const T = u + D;
                const z = M + P / A;
                const R = k - D / T;
                t.beginPath();
                if (a) {
                    t.arc(r, l, f, L, E);
                    if (S > 0) {
                        const F = e8(O, E, r, l);
                        t.arc(F.x, F.y, S, E, k + i.H);
                    }
                    const I = e8(T, k, r, l);
                    t.lineTo(I.x, I.y);
                    if (D > 0) {
                        const V = e8(T, R, r, l);
                        t.arc(V.x, V.y, D, k + i.H, R + Math.PI);
                    }
                    t.arc(r, l, u, k - (D / u), M + (P / u), true);
                    if (P > 0) {
                        const B = e8(A, z, r, l);
                        t.arc(B.x, B.y, P, z + Math.PI, M - i.H);
                    }
                    const N = e8(C, M, r, l);
                    t.lineTo(N.x, N.y);
                    if (w > 0) {
                        const H = e8(C, L, r, l);
                        t.arc(H.x, H.y, w, M - i.H, L);
                    }
                } else {
                    t.moveTo(r, l);
                    const W = Math.cos(L) * f + r;
                    const j = Math.sin(L) * f + l;
                    t.lineTo(W, j);
                    const $ = Math.cos(E) * f + r;
                    const U = Math.sin(E) * f + l;
                    t.lineTo($, U);
                }
                t.closePath();
            }
            function st(t, e, s, n, o) {
                const { fullCircles: a , startAngle: r , circumference: l  } = e;
                let c = e.endAngle;
                if (a) {
                    e9(t, e, s, n, r + i.T, o);
                    for(let h = 0; h < a; ++h){
                        t.fill();
                    }
                    if (!isNaN(l)) {
                        c = r + l % i.T;
                        if (l % i.T === 0) {
                            c += i.T;
                        }
                    }
                }
                e9(t, e, s, n, c, o);
                t.fill();
                return c;
            }
            function se(t, e, s) {
                const { x: n , y: o , startAngle: a , pixelMargin: r , fullCircles: l  } = e;
                const c = Math.max(e.outerRadius - r, 0);
                const h = e.innerRadius + r;
                let d;
                if (s) {
                    e6(t, e, a + i.T);
                }
                t.beginPath();
                t.arc(n, o, h, a + i.T, a, true);
                for(d = 0; d < l; ++d){
                    t.stroke();
                }
                t.beginPath();
                t.arc(n, o, c, a, a + i.T);
                for(d = 0; d < l; ++d){
                    t.stroke();
                }
            }
            function ss(t, e, s, i, n, o) {
                const { options: a  } = e;
                const { borderWidth: r , borderJoinStyle: l  } = a;
                const c = a.borderAlign === 'inner';
                if (!r) {
                    return;
                }
                if (c) {
                    t.lineWidth = r * 2;
                    t.lineJoin = l || 'round';
                } else {
                    t.lineWidth = r;
                    t.lineJoin = l || 'bevel';
                }
                if (e.fullCircles) {
                    se(t, e, c);
                }
                if (c) {
                    e6(t, e, n);
                }
                e9(t, e, s, i, n, o);
                t.stroke();
            }
            class si extends tn {
                constructor(t){
                    super();
                    this.options = undefined;
                    this.circumference = undefined;
                    this.startAngle = undefined;
                    this.endAngle = undefined;
                    this.innerRadius = undefined;
                    this.outerRadius = undefined;
                    this.pixelMargin = 0;
                    this.fullCircles = 0;
                    if (t) {
                        Object.assign(this, t);
                    }
                }
                inRange(t, e, s) {
                    const n = this.getProps([
                        'x',
                        'y'
                    ], s);
                    const { angle: o , distance: a  } = (0, i.a0)(n, {
                        x: t,
                        y: e
                    });
                    const { startAngle: r , endAngle: l , innerRadius: c , outerRadius: h , circumference: d  } = this.getProps([
                        'startAngle',
                        'endAngle',
                        'innerRadius',
                        'outerRadius',
                        'circumference'
                    ], s);
                    const f = this.options.spacing / 2;
                    const u = (0, i.v)(d, l - r);
                    const g = u >= i.T || (0, i.p)(o, r, l);
                    const p = (0, i.ak)(a, c + f, h + f);
                    return (g && p);
                }
                getCenterPoint(t) {
                    const { x: e , y: s , startAngle: i , endAngle: n , innerRadius: o , outerRadius: a  } = this.getProps([
                        'x',
                        'y',
                        'startAngle',
                        'endAngle',
                        'innerRadius',
                        'outerRadius',
                        'circumference'
                    ], t);
                    const { offset: r , spacing: l  } = this.options;
                    const c = (i + n) / 2;
                    const h = (o + a + l + r) / 2;
                    return {
                        x: e + Math.cos(c) * h,
                        y: s + Math.sin(c) * h
                    };
                }
                tooltipPosition(t) {
                    return this.getCenterPoint(t);
                }
                draw(t) {
                    const { options: e , circumference: s  } = this;
                    const n = (e.offset || 0) / 2;
                    const o = (e.spacing || 0) / 2;
                    const a = e.circular;
                    this.pixelMargin = (e.borderAlign === 'inner') ? 0.33 : 0;
                    this.fullCircles = s > i.T ? Math.floor(s / i.T) : 0;
                    if (s === 0 || this.innerRadius < 0 || this.outerRadius < 0) {
                        return;
                    }
                    t.save();
                    let r = 0;
                    if (n) {
                        r = n / 2;
                        const l = (this.startAngle + this.endAngle) / 2;
                        t.translate(Math.cos(l) * r, Math.sin(l) * r);
                        if (this.circumference >= i.P) {
                            r = n;
                        }
                    }
                    t.fillStyle = e.backgroundColor;
                    t.strokeStyle = e.borderColor;
                    const c = st(t, this, r, o, a);
                    ss(t, this, r, o, c, a);
                    t.restore();
                }
            }
            si.id = 'arc';
            si.defaults = {
                borderAlign: 'center',
                borderColor: '#fff',
                borderJoinStyle: undefined,
                borderRadius: 0,
                borderWidth: 2,
                offset: 0,
                spacing: 0,
                angle: undefined,
                circular: true
            };
            si.defaultRoutes = {
                backgroundColor: 'backgroundColor'
            };
            function sn(t, e, s = e) {
                t.lineCap = (0, i.v)(s.borderCapStyle, e.borderCapStyle);
                t.setLineDash((0, i.v)(s.borderDash, e.borderDash));
                t.lineDashOffset = (0, i.v)(s.borderDashOffset, e.borderDashOffset);
                t.lineJoin = (0, i.v)(s.borderJoinStyle, e.borderJoinStyle);
                t.lineWidth = (0, i.v)(s.borderWidth, e.borderWidth);
                t.strokeStyle = (0, i.v)(s.borderColor, e.borderColor);
            }
            function so(t, e, s) {
                t.lineTo(s.x, s.y);
            }
            function sa(t) {
                if (t.stepped) {
                    return i.as;
                }
                if (t.tension || t.cubicInterpolationMode === 'monotone') {
                    return i.at;
                }
                return so;
            }
            function sr(t, e, s = {}) {
                const i = t.length;
                const { start: n = 0 , end: o = i - 1  } = s;
                const { start: a , end: r  } = e;
                const l = Math.max(n, a);
                const c = Math.min(o, r);
                const h = n < a && o < a || n > r && o > r;
                return {
                    count: i,
                    start: l,
                    loop: e.loop,
                    ilen: c < l && !h ? i + c - l : c - l
                };
            }
            function sl(t, e, s, i) {
                const { points: n , options: o  } = e;
                const { count: a , start: r , loop: l , ilen: c  } = sr(n, s, i);
                const h = sa(o);
                let { move: d = true , reverse: f  } = i || {};
                let u, g, p;
                for(u = 0; u <= c; ++u){
                    g = n[(r + (f ? c - u : u)) % a];
                    if (g.skip) {
                        continue;
                    } else if (d) {
                        t.moveTo(g.x, g.y);
                        d = false;
                    } else {
                        h(t, p, g, f, o.stepped);
                    }
                    p = g;
                }
                if (l) {
                    g = n[(r + (f ? c : 0)) % a];
                    h(t, p, g, f, o.stepped);
                }
                return !!l;
            }
            function sc(t, e, s, i) {
                const n = e.points;
                const { count: o , start: a , ilen: r  } = sr(n, s, i);
                const { move: l = true , reverse: c  } = i || {};
                let h = 0;
                let d = 0;
                let f, u, g, p, m, b;
                const x = (t)=>(a + (c ? r - t : t)) % o;
                const _ = ()=>{
                    if (p !== m) {
                        t.lineTo(h, m);
                        t.lineTo(h, p);
                        t.lineTo(h, b);
                    }
                };
                if (l) {
                    u = n[x(0)];
                    t.moveTo(u.x, u.y);
                }
                for(f = 0; f <= r; ++f){
                    u = n[x(f)];
                    if (u.skip) {
                        continue;
                    }
                    const y = u.x;
                    const v = u.y;
                    const M = y | 0;
                    if (M === g) {
                        if (v < p) {
                            p = v;
                        } else if (v > m) {
                            m = v;
                        }
                        h = (d * h + y) / ++d;
                    } else {
                        _();
                        t.lineTo(y, v);
                        g = M;
                        d = 0;
                        p = m = v;
                    }
                    b = v;
                }
                _();
            }
            function sh(t) {
                const e = t.options;
                const s = e.borderDash && e.borderDash.length;
                const i = !t._decimated && !t._loop && !e.tension && e.cubicInterpolationMode !== 'monotone' && !e.stepped && !s;
                return i ? sc : sl;
            }
            function sd(t) {
                if (t.stepped) {
                    return i.ap;
                }
                if (t.tension || t.cubicInterpolationMode === 'monotone') {
                    return i.aq;
                }
                return i.ar;
            }
            function sf(t, e, s, i) {
                let n = e._path;
                if (!n) {
                    n = e._path = new Path2D();
                    if (e.path(n, s, i)) {
                        n.closePath();
                    }
                }
                sn(t, e.options);
                t.stroke(n);
            }
            function su(t, e, s, i) {
                const { segments: n , options: o  } = e;
                const a = sh(e);
                for (const r of n){
                    sn(t, o, r.style);
                    t.beginPath();
                    if (a(t, e, r, {
                        start: s,
                        end: s + i - 1
                    })) {
                        t.closePath();
                    }
                    t.stroke();
                }
            }
            const sg = typeof Path2D === 'function';
            function sp(t, e, s, i) {
                if (sg && !e.options.segment) {
                    sf(t, e, s, i);
                } else {
                    su(t, e, s, i);
                }
            }
            class sm extends tn {
                constructor(t){
                    super();
                    this.animated = true;
                    this.options = undefined;
                    this._chart = undefined;
                    this._loop = undefined;
                    this._fullLoop = undefined;
                    this._path = undefined;
                    this._points = undefined;
                    this._segments = undefined;
                    this._decimated = false;
                    this._pointsUpdated = false;
                    this._datasetIndex = undefined;
                    if (t) {
                        Object.assign(this, t);
                    }
                }
                updateControlPoints(t, e) {
                    const s = this.options;
                    if ((s.tension || s.cubicInterpolationMode === 'monotone') && !s.stepped && !this._pointsUpdated) {
                        const n = s.spanGaps ? this._loop : this._fullLoop;
                        (0, i.am)(this._points, s, t, n, e);
                        this._pointsUpdated = true;
                    }
                }
                set points(t) {
                    this._points = t;
                    delete this._segments;
                    delete this._path;
                    this._pointsUpdated = false;
                }
                get points() {
                    return this._points;
                }
                get segments() {
                    return this._segments || (this._segments = (0, i.an)(this, this.options.segment));
                }
                first() {
                    const t = this.segments;
                    const e = this.points;
                    return t.length && e[t[0].start];
                }
                last() {
                    const t = this.segments;
                    const e = this.points;
                    const s = t.length;
                    return s && e[t[s - 1].end];
                }
                interpolate(t, e) {
                    const s = this.options;
                    const n = t[e];
                    const o = this.points;
                    const a = (0, i.ao)(this, {
                        property: e,
                        start: n,
                        end: n
                    });
                    if (!a.length) {
                        return;
                    }
                    const r = [];
                    const l = sd(s);
                    let c, h;
                    for(c = 0, h = a.length; c < h; ++c){
                        const { start: d , end: f  } = a[c];
                        const u = o[d];
                        const g = o[f];
                        if (u === g) {
                            r.push(u);
                            continue;
                        }
                        const p = Math.abs((n - u[e]) / (g[e] - u[e]));
                        const m = l(u, g, p, s.stepped);
                        m[e] = t[e];
                        r.push(m);
                    }
                    return r.length === 1 ? r[0] : r;
                }
                pathSegment(t, e, s) {
                    const i = sh(this);
                    return i(t, this, e, s);
                }
                path(t, e, s) {
                    const i = this.segments;
                    const n = sh(this);
                    let o = this._loop;
                    e = e || 0;
                    s = s || (this.points.length - e);
                    for (const a of i){
                        o &= n(t, this, a, {
                            start: e,
                            end: e + s - 1
                        });
                    }
                    return !!o;
                }
                draw(t, e, s, i) {
                    const n = this.options || {};
                    const o = this.points || [];
                    if (o.length && n.borderWidth) {
                        t.save();
                        sp(t, this, s, i);
                        t.restore();
                    }
                    if (this.animated) {
                        this._pointsUpdated = false;
                        this._path = undefined;
                    }
                }
            }
            sm.id = 'line';
            sm.defaults = {
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0,
                borderJoinStyle: 'miter',
                borderWidth: 3,
                capBezierPoints: true,
                cubicInterpolationMode: 'default',
                fill: false,
                spanGaps: false,
                stepped: false,
                tension: 0
            };
            sm.defaultRoutes = {
                backgroundColor: 'backgroundColor',
                borderColor: 'borderColor'
            };
            sm.descriptors = {
                _scriptable: true,
                _indexable: (t)=>t !== 'borderDash' && t !== 'fill'
            };
            function sb(t, e, s, i) {
                const n = t.options;
                const { [s]: o  } = t.getProps([
                    s
                ], i);
                return (Math.abs(e - o) < n.radius + n.hitRadius);
            }
            class sx extends tn {
                constructor(t){
                    super();
                    this.options = undefined;
                    this.parsed = undefined;
                    this.skip = undefined;
                    this.stop = undefined;
                    if (t) {
                        Object.assign(this, t);
                    }
                }
                inRange(t, e, s) {
                    const i = this.options;
                    const { x: n , y: o  } = this.getProps([
                        'x',
                        'y'
                    ], s);
                    return ((Math.pow(t - n, 2) + Math.pow(e - o, 2)) < Math.pow(i.hitRadius + i.radius, 2));
                }
                inXRange(t, e) {
                    return sb(this, t, 'x', e);
                }
                inYRange(t, e) {
                    return sb(this, t, 'y', e);
                }
                getCenterPoint(t) {
                    const { x: e , y: s  } = this.getProps([
                        'x',
                        'y'
                    ], t);
                    return {
                        x: e,
                        y: s
                    };
                }
                size(t) {
                    t = t || this.options || {};
                    let e = t.radius || 0;
                    e = Math.max(e, e && t.hoverRadius || 0);
                    const s = e && t.borderWidth || 0;
                    return (e + s) * 2;
                }
                draw(t, e) {
                    const s = this.options;
                    if (this.skip || s.radius < 0.1 || !(0, i.$)(this, e, this.size(s) / 2)) {
                        return;
                    }
                    t.strokeStyle = s.borderColor;
                    t.lineWidth = s.borderWidth;
                    t.fillStyle = s.backgroundColor;
                    (0, i.au)(t, s, this.x, this.y);
                }
                getRange() {
                    const t = this.options || {};
                    return t.radius + t.hitRadius;
                }
            }
            sx.id = 'point';
            sx.defaults = {
                borderWidth: 1,
                hitRadius: 1,
                hoverBorderWidth: 1,
                hoverRadius: 4,
                pointStyle: 'circle',
                radius: 3,
                rotation: 0
            };
            sx.defaultRoutes = {
                backgroundColor: 'backgroundColor',
                borderColor: 'borderColor'
            };
            function s_(t, e) {
                const { x: s , y: i , base: n , width: o , height: a  } = t.getProps([
                    'x',
                    'y',
                    'base',
                    'width',
                    'height'
                ], e);
                let r, l, c, h, d;
                if (t.horizontal) {
                    d = a / 2;
                    r = Math.min(s, n);
                    l = Math.max(s, n);
                    c = i - d;
                    h = i + d;
                } else {
                    d = o / 2;
                    r = s - d;
                    l = s + d;
                    c = Math.min(i, n);
                    h = Math.max(i, n);
                }
                return {
                    left: r,
                    top: c,
                    right: l,
                    bottom: h
                };
            }
            function sy(t, e, s, n) {
                return t ? 0 : (0, i.E)(e, s, n);
            }
            function sv(t, e, s) {
                const n = t.options.borderWidth;
                const o = t.borderSkipped;
                const a = (0, i.aw)(n);
                return {
                    t: sy(o.top, a.top, 0, s),
                    r: sy(o.right, a.right, 0, e),
                    b: sy(o.bottom, a.bottom, 0, s),
                    l: sy(o.left, a.left, 0, e)
                };
            }
            function sM(t, e, s) {
                const { enableBorderRadius: n  } = t.getProps([
                    'enableBorderRadius'
                ]);
                const o = t.options.borderRadius;
                const a = (0, i.ax)(o);
                const r = Math.min(e, s);
                const l = t.borderSkipped;
                const c = n || (0, i.i)(o);
                return {
                    topLeft: sy(!c || l.top || l.left, a.topLeft, 0, r),
                    topRight: sy(!c || l.top || l.right, a.topRight, 0, r),
                    bottomLeft: sy(!c || l.bottom || l.left, a.bottomLeft, 0, r),
                    bottomRight: sy(!c || l.bottom || l.right, a.bottomRight, 0, r)
                };
            }
            function sk(t) {
                const e = s_(t);
                const s = e.right - e.left;
                const i = e.bottom - e.top;
                const n = sv(t, s / 2, i / 2);
                const o = sM(t, s / 2, i / 2);
                return {
                    outer: {
                        x: e.left,
                        y: e.top,
                        w: s,
                        h: i,
                        radius: o
                    },
                    inner: {
                        x: e.left + n.l,
                        y: e.top + n.t,
                        w: s - n.l - n.r,
                        h: i - n.t - n.b,
                        radius: {
                            topLeft: Math.max(0, o.topLeft - Math.max(n.t, n.l)),
                            topRight: Math.max(0, o.topRight - Math.max(n.t, n.r)),
                            bottomLeft: Math.max(0, o.bottomLeft - Math.max(n.b, n.l)),
                            bottomRight: Math.max(0, o.bottomRight - Math.max(n.b, n.r))
                        }
                    }
                };
            }
            function sw(t, e, s, n) {
                const o = e === null;
                const a = s === null;
                const r = o && a;
                const l = t && !r && s_(t, n);
                return l && (o || (0, i.ak)(e, l.left, l.right)) && (a || (0, i.ak)(s, l.top, l.bottom));
            }
            function sS(t) {
                return t.topLeft || t.topRight || t.bottomLeft || t.bottomRight;
            }
            function sP(t, e) {
                t.rect(e.x, e.y, e.w, e.h);
            }
            function sD(t, e, s = {}) {
                const i = t.x !== s.x ? -e : 0;
                const n = t.y !== s.y ? -e : 0;
                const o = (t.x + t.w !== s.x + s.w ? e : 0) - i;
                const a = (t.y + t.h !== s.y + s.h ? e : 0) - n;
                return {
                    x: t.x + i,
                    y: t.y + n,
                    w: t.w + o,
                    h: t.h + a,
                    radius: t.radius
                };
            }
            class sC extends tn {
                constructor(t){
                    super();
                    this.options = undefined;
                    this.horizontal = undefined;
                    this.base = undefined;
                    this.width = undefined;
                    this.height = undefined;
                    this.inflateAmount = undefined;
                    if (t) {
                        Object.assign(this, t);
                    }
                }
                draw(t) {
                    const { inflateAmount: e , options: { borderColor: s , backgroundColor: n  }  } = this;
                    const { inner: o , outer: a  } = sk(this);
                    const r = sS(a.radius) ? i.av : sP;
                    t.save();
                    if (a.w !== o.w || a.h !== o.h) {
                        t.beginPath();
                        r(t, sD(a, e, o));
                        t.clip();
                        r(t, sD(o, -e, a));
                        t.fillStyle = s;
                        t.fill('evenodd');
                    }
                    t.beginPath();
                    r(t, sD(o, e));
                    t.fillStyle = n;
                    t.fill();
                    t.restore();
                }
                inRange(t, e, s) {
                    return sw(this, t, e, s);
                }
                inXRange(t, e) {
                    return sw(this, t, null, e);
                }
                inYRange(t, e) {
                    return sw(this, null, t, e);
                }
                getCenterPoint(t) {
                    const { x: e , y: s , base: i , horizontal: n  } = this.getProps([
                        'x',
                        'y',
                        'base',
                        'horizontal'
                    ], t);
                    return {
                        x: n ? (e + i) / 2 : e,
                        y: n ? s : (s + i) / 2
                    };
                }
                getRange(t) {
                    return t === 'x' ? this.width / 2 : this.height / 2;
                }
            }
            sC.id = 'bar';
            sC.defaults = {
                borderSkipped: 'start',
                borderWidth: 0,
                borderRadius: 0,
                inflateAmount: 'auto',
                pointStyle: undefined
            };
            sC.defaultRoutes = {
                backgroundColor: 'backgroundColor',
                borderColor: 'borderColor'
            };
            var sO = Object.freeze({
                __proto__: null,
                ArcElement: si,
                LineElement: sm,
                PointElement: sx,
                BarElement: sC
            });
            function sL(t, e, s, i, n) {
                const o = n.samples || i;
                if (o >= s) {
                    return t.slice(e, e + s);
                }
                const a = [];
                const r = (s - 2) / (o - 2);
                let l = 0;
                const c = e + s - 1;
                let h = e;
                let d, f, u, g, p;
                a[l++] = t[h];
                for(d = 0; d < o - 2; d++){
                    let m = 0;
                    let b = 0;
                    let x;
                    const _ = Math.floor((d + 1) * r) + 1 + e;
                    const y = Math.min(Math.floor((d + 2) * r) + 1, s) + e;
                    const v = y - _;
                    for(x = _; x < y; x++){
                        m += t[x].x;
                        b += t[x].y;
                    }
                    m /= v;
                    b /= v;
                    const M = Math.floor(d * r) + 1 + e;
                    const k = Math.min(Math.floor((d + 1) * r) + 1, s) + e;
                    const { x: w , y: S  } = t[h];
                    u = g = -1;
                    for(x = M; x < k; x++){
                        g = 0.5 * Math.abs((w - m) * (t[x].y - S) - (w - t[x].x) * (b - S));
                        if (g > u) {
                            u = g;
                            f = t[x];
                            p = x;
                        }
                    }
                    a[l++] = f;
                    h = p;
                }
                a[l++] = t[c];
                return a;
            }
            function sE(t, e, s, n) {
                let o = 0;
                let a = 0;
                let r, l, c, h, d, f, u, g, p, m;
                const b = [];
                const x = e + s - 1;
                const _ = t[e].x;
                const y = t[x].x;
                const v = y - _;
                for(r = e; r < e + s; ++r){
                    l = t[r];
                    c = (l.x - _) / v * n;
                    h = l.y;
                    const M = c | 0;
                    if (M === d) {
                        if (h < p) {
                            p = h;
                            f = r;
                        } else if (h > m) {
                            m = h;
                            u = r;
                        }
                        o = (a * o + l.x) / ++a;
                    } else {
                        const k = r - 1;
                        if (!(0, i.k)(f) && !(0, i.k)(u)) {
                            const w = Math.min(f, u);
                            const S = Math.max(f, u);
                            if (w !== g && w !== k) {
                                b.push({
                                    ...t[w],
                                    x: o
                                });
                            }
                            if (S !== g && S !== k) {
                                b.push({
                                    ...t[S],
                                    x: o
                                });
                            }
                        }
                        if (r > 0 && k !== g) {
                            b.push(t[k]);
                        }
                        b.push(l);
                        d = M;
                        a = 0;
                        p = m = h;
                        f = u = g = r;
                    }
                }
                return b;
            }
            function sA(t) {
                if (t._decimated) {
                    const e = t._data;
                    delete t._decimated;
                    delete t._data;
                    Object.defineProperty(t, 'data', {
                        value: e
                    });
                }
            }
            function sT(t) {
                t.data.datasets.forEach((t)=>{
                    sA(t);
                });
            }
            function sz(t, e) {
                const s = e.length;
                let n = 0;
                let o;
                const { iScale: a  } = t;
                const { min: r , max: l , minDefined: c , maxDefined: h  } = a.getUserBounds();
                if (c) {
                    n = (0, i.E)((0, i.Z)(e, a.axis, r).lo, 0, s - 1);
                }
                if (h) {
                    o = (0, i.E)((0, i.Z)(e, a.axis, l).hi + 1, n, s) - n;
                } else {
                    o = s - n;
                }
                return {
                    start: n,
                    count: o
                };
            }
            var sR = {
                id: 'decimation',
                defaults: {
                    algorithm: 'min-max',
                    enabled: false
                },
                beforeElementsUpdate: (t, e, s)=>{
                    if (!s.enabled) {
                        sT(t);
                        return;
                    }
                    const n = t.width;
                    t.data.datasets.forEach((e, o)=>{
                        const { _data: a , indexAxis: r  } = e;
                        const l = t.getDatasetMeta(o);
                        const c = a || e.data;
                        if ((0, i.a)([
                            r,
                            t.options.indexAxis
                        ]) === 'y') {
                            return;
                        }
                        if (!l.controller.supportsDecimation) {
                            return;
                        }
                        const h = t.scales[l.xAxisID];
                        if (h.type !== 'linear' && h.type !== 'time') {
                            return;
                        }
                        if (t.options.parsing) {
                            return;
                        }
                        let { start: d , count: f  } = sz(l, c);
                        const u = s.threshold || 4 * n;
                        if (f <= u) {
                            sA(e);
                            return;
                        }
                        if ((0, i.k)(a)) {
                            e._data = c;
                            delete e.data;
                            Object.defineProperty(e, 'data', {
                                configurable: true,
                                enumerable: true,
                                get: function() {
                                    return this._decimated;
                                },
                                set: function(t) {
                                    this._data = t;
                                }
                            });
                        }
                        let g;
                        switch(s.algorithm){
                            case 'lttb':
                                g = sL(c, d, f, n, s);
                                break;
                            case 'min-max':
                                g = sE(c, d, f, n);
                                break;
                            default:
                                throw new Error(`Unsupported decimation algorithm '${s.algorithm}'`);
                        }
                        e._decimated = g;
                    });
                },
                destroy (t) {
                    sT(t);
                }
            };
            function sF(t, e, s) {
                const n = t.segments;
                const o = t.points;
                const a = e.points;
                const r = [];
                for (const l of n){
                    let { start: c , end: h  } = l;
                    h = sB(c, h, o);
                    const d = sI(s, o[c], o[h], l.loop);
                    if (!e.segments) {
                        r.push({
                            source: l,
                            target: d,
                            start: o[c],
                            end: o[h]
                        });
                        continue;
                    }
                    const f = (0, i.ao)(e, d);
                    for (const u of f){
                        const g = sI(s, a[u.start], a[u.end], u.loop);
                        const p = (0, i.ay)(l, o, g);
                        for (const m of p){
                            r.push({
                                source: m,
                                target: u,
                                start: {
                                    [s]: sN(d, g, 'start', Math.max)
                                },
                                end: {
                                    [s]: sN(d, g, 'end', Math.min)
                                }
                            });
                        }
                    }
                }
                return r;
            }
            function sI(t, e, s, n) {
                if (n) {
                    return;
                }
                let o = e[t];
                let a = s[t];
                if (t === 'angle') {
                    o = (0, i.az)(o);
                    a = (0, i.az)(a);
                }
                return {
                    property: t,
                    start: o,
                    end: a
                };
            }
            function sV(t, e) {
                const { x: s = null , y: i = null  } = t || {};
                const n = e.points;
                const o = [];
                e.segments.forEach(({ start: t , end: e  })=>{
                    e = sB(t, e, n);
                    const a = n[t];
                    const r = n[e];
                    if (i !== null) {
                        o.push({
                            x: a.x,
                            y: i
                        });
                        o.push({
                            x: r.x,
                            y: i
                        });
                    } else if (s !== null) {
                        o.push({
                            x: s,
                            y: a.y
                        });
                        o.push({
                            x: s,
                            y: r.y
                        });
                    }
                });
                return o;
            }
            function sB(t, e, s) {
                for(; e > t; e--){
                    const i = s[e];
                    if (!isNaN(i.x) && !isNaN(i.y)) {
                        break;
                    }
                }
                return e;
            }
            function sN(t, e, s, i) {
                if (t && e) {
                    return i(t[s], e[s]);
                }
                return t ? t[s] : e ? e[s] : 0;
            }
            function sH(t, e) {
                let s = [];
                let n = false;
                if ((0, i.b)(t)) {
                    n = true;
                    s = t;
                } else {
                    s = sV(t, e);
                }
                return s.length ? new sm({
                    points: s,
                    options: {
                        tension: 0
                    },
                    _loop: n,
                    _fullLoop: n
                }) : null;
            }
            function sW(t) {
                return t && t.fill !== false;
            }
            function sj(t, e, s) {
                const n = t[e];
                let o = n.fill;
                const a = [
                    e
                ];
                let r;
                if (!s) {
                    return o;
                }
                while(o !== false && a.indexOf(o) === -1){
                    if (!(0, i.g)(o)) {
                        return o;
                    }
                    r = t[o];
                    if (!r) {
                        return false;
                    }
                    if (r.visible) {
                        return o;
                    }
                    a.push(o);
                    o = r.fill;
                }
                return false;
            }
            function s$(t, e, s) {
                const n = sQ(t);
                if ((0, i.i)(n)) {
                    return isNaN(n.value) ? false : n;
                }
                let o = parseFloat(n);
                if ((0, i.g)(o) && Math.floor(o) === o) {
                    return sU(n[0], e, o, s);
                }
                return [
                    'origin',
                    'start',
                    'end',
                    'stack',
                    'shape'
                ].indexOf(n) >= 0 && n;
            }
            function sU(t, e, s, i) {
                if (t === '-' || t === '+') {
                    s = e + s;
                }
                if (s === e || s < 0 || s >= i) {
                    return false;
                }
                return s;
            }
            function sY(t, e) {
                let s = null;
                if (t === 'start') {
                    s = e.bottom;
                } else if (t === 'end') {
                    s = e.top;
                } else if ((0, i.i)(t)) {
                    s = e.getPixelForValue(t.value);
                } else if (e.getBasePixel) {
                    s = e.getBasePixel();
                }
                return s;
            }
            function sK(t, e, s) {
                let n;
                if (t === 'start') {
                    n = s;
                } else if (t === 'end') {
                    n = e.options.reverse ? e.min : e.max;
                } else if ((0, i.i)(t)) {
                    n = t.value;
                } else {
                    n = e.getBaseValue();
                }
                return n;
            }
            function sQ(t) {
                const e = t.options;
                const s = e.fill;
                let n = (0, i.v)(s && s.target, s);
                if (n === undefined) {
                    n = !!e.backgroundColor;
                }
                if (n === false || n === null) {
                    return false;
                }
                if (n === true) {
                    return 'origin';
                }
                return n;
            }
            function sX(t) {
                const { scale: e , index: s , line: i  } = t;
                const n = [];
                const o = i.segments;
                const a = i.points;
                const r = sG(e, s);
                r.push(sH({
                    x: null,
                    y: e.bottom
                }, i));
                for(let l = 0; l < o.length; l++){
                    const c = o[l];
                    for(let h = c.start; h <= c.end; h++){
                        sq(n, a[h], r);
                    }
                }
                return new sm({
                    points: n,
                    options: {}
                });
            }
            function sG(t, e) {
                const s = [];
                const i = t.getMatchingVisibleMetas('line');
                for(let n = 0; n < i.length; n++){
                    const o = i[n];
                    if (o.index === e) {
                        break;
                    }
                    if (!o.hidden) {
                        s.unshift(o.dataset);
                    }
                }
                return s;
            }
            function sq(t, e, s) {
                const i = [];
                for(let n = 0; n < s.length; n++){
                    const o = s[n];
                    const { first: a , last: r , point: l  } = sJ(o, e, 'x');
                    if (!l || (a && r)) {
                        continue;
                    }
                    if (a) {
                        i.unshift(l);
                    } else {
                        t.push(l);
                        if (!r) {
                            break;
                        }
                    }
                }
                t.push(...i);
            }
            function sJ(t, e, s) {
                const n = t.interpolate(e, s);
                if (!n) {
                    return {};
                }
                const o = n[s];
                const a = t.segments;
                const r = t.points;
                let l = false;
                let c = false;
                for(let h = 0; h < a.length; h++){
                    const d = a[h];
                    const f = r[d.start][s];
                    const u = r[d.end][s];
                    if ((0, i.ak)(o, f, u)) {
                        l = o === f;
                        c = o === u;
                        break;
                    }
                }
                return {
                    first: l,
                    last: c,
                    point: n
                };
            }
            class sZ {
                constructor(t){
                    this.x = t.x;
                    this.y = t.y;
                    this.radius = t.radius;
                }
                pathSegment(t, e, s) {
                    const { x: n , y: o , radius: a  } = this;
                    e = e || {
                        start: 0,
                        end: i.T
                    };
                    t.arc(n, o, a, e.end, e.start, true);
                    return !s.bounds;
                }
                interpolate(t) {
                    const { x: e , y: s , radius: i  } = this;
                    const n = t.angle;
                    return {
                        x: e + Math.cos(n) * i,
                        y: s + Math.sin(n) * i,
                        angle: n
                    };
                }
            }
            function s0(t) {
                const { chart: e , fill: s , line: n  } = t;
                if ((0, i.g)(s)) {
                    return s1(e, s);
                }
                if (s === 'stack') {
                    return sX(t);
                }
                if (s === 'shape') {
                    return true;
                }
                const o = s2(t);
                if (o instanceof sZ) {
                    return o;
                }
                return sH(o, n);
            }
            function s1(t, e) {
                const s = t.getDatasetMeta(e);
                const i = s && t.isDatasetVisible(e);
                return i ? s.dataset : null;
            }
            function s2(t) {
                const e = t.scale || {};
                if (e.getPointPositionForValue) {
                    return s3(t);
                }
                return s5(t);
            }
            function s5(t) {
                const { scale: e = {} , fill: s  } = t;
                const n = sY(s, e);
                if ((0, i.g)(n)) {
                    const o = e.isHorizontal();
                    return {
                        x: o ? n : null,
                        y: o ? null : n
                    };
                }
                return null;
            }
            function s3(t) {
                const { scale: e , fill: s  } = t;
                const i = e.options;
                const n = e.getLabels().length;
                const o = i.reverse ? e.max : e.min;
                const a = sK(s, e, o);
                const r = [];
                if (i.grid.circular) {
                    const l = e.getPointPositionForValue(0, o);
                    return new sZ({
                        x: l.x,
                        y: l.y,
                        radius: e.getDistanceFromCenterForValue(a)
                    });
                }
                for(let c = 0; c < n; ++c){
                    r.push(e.getPointPositionForValue(c, a));
                }
                return r;
            }
            function s6(t, e, s) {
                const n = s0(e);
                const { line: o , scale: a , axis: r  } = e;
                const l = o.options;
                const c = l.fill;
                const h = l.backgroundColor;
                const { above: d = h , below: f = h  } = c || {};
                if (n && o.points.length) {
                    (0, i.L)(t, s);
                    s4(t, {
                        line: o,
                        target: n,
                        above: d,
                        below: f,
                        area: s,
                        scale: a,
                        axis: r
                    });
                    (0, i.N)(t);
                }
            }
            function s4(t, e) {
                const { line: s , target: i , above: n , below: o , area: a , scale: r  } = e;
                const l = s._loop ? 'angle' : e.axis;
                t.save();
                if (l === 'x' && o !== n) {
                    s7(t, i, a.top);
                    s8(t, {
                        line: s,
                        target: i,
                        color: n,
                        scale: r,
                        property: l
                    });
                    t.restore();
                    t.save();
                    s7(t, i, a.bottom);
                }
                s8(t, {
                    line: s,
                    target: i,
                    color: o,
                    scale: r,
                    property: l
                });
                t.restore();
            }
            function s7(t, e, s) {
                const { segments: i , points: n  } = e;
                let o = true;
                let a = false;
                t.beginPath();
                for (const r of i){
                    const { start: l , end: c  } = r;
                    const h = n[l];
                    const d = n[sB(l, c, n)];
                    if (o) {
                        t.moveTo(h.x, h.y);
                        o = false;
                    } else {
                        t.lineTo(h.x, s);
                        t.lineTo(h.x, h.y);
                    }
                    a = !!e.pathSegment(t, r, {
                        move: a
                    });
                    if (a) {
                        t.closePath();
                    } else {
                        t.lineTo(d.x, s);
                    }
                }
                t.lineTo(e.first().x, s);
                t.closePath();
                t.clip();
            }
            function s8(t, e) {
                const { line: s , target: i , property: n , color: o , scale: a  } = e;
                const r = sF(s, i, n);
                for (const { source: l , target: c , start: h , end: d  } of r){
                    const { style: { backgroundColor: f = o  } = {}  } = l;
                    const u = i !== true;
                    t.save();
                    t.fillStyle = f;
                    s9(t, a, u && sI(n, h, d));
                    t.beginPath();
                    const g = !!s.pathSegment(t, l);
                    let p;
                    if (u) {
                        if (g) {
                            t.closePath();
                        } else {
                            it(t, i, d, n);
                        }
                        const m = !!i.pathSegment(t, c, {
                            move: g,
                            reverse: true
                        });
                        p = g && m;
                        if (!p) {
                            it(t, i, h, n);
                        }
                    }
                    t.closePath();
                    t.fill(p ? 'evenodd' : 'nonzero');
                    t.restore();
                }
            }
            function s9(t, e, s) {
                const { top: i , bottom: n  } = e.chart.chartArea;
                const { property: o , start: a , end: r  } = s || {};
                if (o === 'x') {
                    t.beginPath();
                    t.rect(a, i, r - a, n - i);
                    t.clip();
                }
            }
            function it(t, e, s, i) {
                const n = e.interpolate(s, i);
                if (n) {
                    t.lineTo(n.x, n.y);
                }
            }
            var ie = {
                id: 'filler',
                afterDatasetsUpdate (t, e, s) {
                    const i = (t.data.datasets || []).length;
                    const n = [];
                    let o, a, r, l;
                    for(a = 0; a < i; ++a){
                        o = t.getDatasetMeta(a);
                        r = o.dataset;
                        l = null;
                        if (r && r.options && r instanceof sm) {
                            l = {
                                visible: t.isDatasetVisible(a),
                                index: a,
                                fill: s$(r, a, i),
                                chart: t,
                                axis: o.controller.options.indexAxis,
                                scale: o.vScale,
                                line: r
                            };
                        }
                        o.$filler = l;
                        n.push(l);
                    }
                    for(a = 0; a < i; ++a){
                        l = n[a];
                        if (!l || l.fill === false) {
                            continue;
                        }
                        l.fill = sj(n, a, s.propagate);
                    }
                },
                beforeDraw (t, e, s) {
                    const i = s.drawTime === 'beforeDraw';
                    const n = t.getSortedVisibleDatasetMetas();
                    const o = t.chartArea;
                    for(let a = n.length - 1; a >= 0; --a){
                        const r = n[a].$filler;
                        if (!r) {
                            continue;
                        }
                        r.line.updateControlPoints(o, r.axis);
                        if (i && r.fill) {
                            s6(t.ctx, r, o);
                        }
                    }
                },
                beforeDatasetsDraw (t, e, s) {
                    if (s.drawTime !== 'beforeDatasetsDraw') {
                        return;
                    }
                    const i = t.getSortedVisibleDatasetMetas();
                    for(let n = i.length - 1; n >= 0; --n){
                        const o = i[n].$filler;
                        if (sW(o)) {
                            s6(t.ctx, o, t.chartArea);
                        }
                    }
                },
                beforeDatasetDraw (t, e, s) {
                    const i = e.meta.$filler;
                    if (!sW(i) || s.drawTime !== 'beforeDatasetDraw') {
                        return;
                    }
                    s6(t.ctx, i, t.chartArea);
                },
                defaults: {
                    propagate: true,
                    drawTime: 'beforeDatasetDraw'
                }
            };
            const is = (t, e)=>{
                let { boxHeight: s = e , boxWidth: i = e  } = t;
                if (t.usePointStyle) {
                    s = Math.min(s, e);
                    i = t.pointStyleWidth || Math.min(i, e);
                }
                return {
                    boxWidth: i,
                    boxHeight: s,
                    itemHeight: Math.max(e, s)
                };
            };
            const ii = (t, e)=>t !== null && e !== null && t.datasetIndex === e.datasetIndex && t.index === e.index;
            class io extends tn {
                constructor(t){
                    super();
                    this._added = false;
                    this.legendHitBoxes = [];
                    this._hoveredItem = null;
                    this.doughnutMode = false;
                    this.chart = t.chart;
                    this.options = t.options;
                    this.ctx = t.ctx;
                    this.legendItems = undefined;
                    this.columnSizes = undefined;
                    this.lineWidths = undefined;
                    this.maxHeight = undefined;
                    this.maxWidth = undefined;
                    this.top = undefined;
                    this.bottom = undefined;
                    this.left = undefined;
                    this.right = undefined;
                    this.height = undefined;
                    this.width = undefined;
                    this._margins = undefined;
                    this.position = undefined;
                    this.weight = undefined;
                    this.fullSize = undefined;
                }
                update(t, e, s) {
                    this.maxWidth = t;
                    this.maxHeight = e;
                    this._margins = s;
                    this.setDimensions();
                    this.buildLabels();
                    this.fit();
                }
                setDimensions() {
                    if (this.isHorizontal()) {
                        this.width = this.maxWidth;
                        this.left = this._margins.left;
                        this.right = this.width;
                    } else {
                        this.height = this.maxHeight;
                        this.top = this._margins.top;
                        this.bottom = this.height;
                    }
                }
                buildLabels() {
                    const t = this.options.labels || {};
                    let e = (0, i.C)(t.generateLabels, [
                        this.chart
                    ], this) || [];
                    if (t.filter) {
                        e = e.filter((e)=>t.filter(e, this.chart.data));
                    }
                    if (t.sort) {
                        e = e.sort((e, s)=>t.sort(e, s, this.chart.data));
                    }
                    if (this.options.reverse) {
                        e.reverse();
                    }
                    this.legendItems = e;
                }
                fit() {
                    const { options: t , ctx: e  } = this;
                    if (!t.display) {
                        this.width = this.height = 0;
                        return;
                    }
                    const s = t.labels;
                    const n = (0, i.O)(s.font);
                    const o = n.size;
                    const a = this._computeTitleHeight();
                    const { boxWidth: r , itemHeight: l  } = is(s, o);
                    let c, h;
                    e.font = n.string;
                    if (this.isHorizontal()) {
                        c = this.maxWidth;
                        h = this._fitRows(a, o, r, l) + 10;
                    } else {
                        h = this.maxHeight;
                        c = this._fitCols(a, o, r, l) + 10;
                    }
                    this.width = Math.min(c, t.maxWidth || this.maxWidth);
                    this.height = Math.min(h, t.maxHeight || this.maxHeight);
                }
                _fitRows(t, e, s, i) {
                    const { ctx: n , maxWidth: o , options: { labels: { padding: a  }  }  } = this;
                    const r = this.legendHitBoxes = [];
                    const l = this.lineWidths = [
                        0
                    ];
                    const c = i + a;
                    let h = t;
                    n.textAlign = 'left';
                    n.textBaseline = 'middle';
                    let d = -1;
                    let f = -c;
                    this.legendItems.forEach((t, u)=>{
                        const g = s + (e / 2) + n.measureText(t.text).width;
                        if (u === 0 || l[l.length - 1] + g + 2 * a > o) {
                            h += c;
                            l[l.length - (u > 0 ? 0 : 1)] = 0;
                            f += c;
                            d++;
                        }
                        r[u] = {
                            left: 0,
                            top: f,
                            row: d,
                            width: g,
                            height: i
                        };
                        l[l.length - 1] += g + a;
                    });
                    return h;
                }
                _fitCols(t, e, s, i) {
                    const { ctx: n , maxHeight: o , options: { labels: { padding: a  }  }  } = this;
                    const r = this.legendHitBoxes = [];
                    const l = this.columnSizes = [];
                    const c = o - t;
                    let h = a;
                    let d = 0;
                    let f = 0;
                    let u = 0;
                    let g = 0;
                    this.legendItems.forEach((t, o)=>{
                        const p = s + (e / 2) + n.measureText(t.text).width;
                        if (o > 0 && f + i + 2 * a > c) {
                            h += d + a;
                            l.push({
                                width: d,
                                height: f
                            });
                            u += d + a;
                            g++;
                            d = f = 0;
                        }
                        r[o] = {
                            left: u,
                            top: f,
                            col: g,
                            width: p,
                            height: i
                        };
                        d = Math.max(d, p);
                        f += i + a;
                    });
                    h += d;
                    l.push({
                        width: d,
                        height: f
                    });
                    return h;
                }
                adjustHitBoxes() {
                    if (!this.options.display) {
                        return;
                    }
                    const t = this._computeTitleHeight();
                    const { legendHitBoxes: e , options: { align: s , labels: { padding: n  } , rtl: o  }  } = this;
                    const a = (0, i.aA)(o, this.left, this.width);
                    if (this.isHorizontal()) {
                        let r = 0;
                        let l = (0, i.S)(s, this.left + n, this.right - this.lineWidths[r]);
                        for (const c of e){
                            if (r !== c.row) {
                                r = c.row;
                                l = (0, i.S)(s, this.left + n, this.right - this.lineWidths[r]);
                            }
                            c.top += this.top + t + n;
                            c.left = a.leftForLtr(a.x(l), c.width);
                            l += c.width + n;
                        }
                    } else {
                        let h = 0;
                        let d = (0, i.S)(s, this.top + t + n, this.bottom - this.columnSizes[h].height);
                        for (const f of e){
                            if (f.col !== h) {
                                h = f.col;
                                d = (0, i.S)(s, this.top + t + n, this.bottom - this.columnSizes[h].height);
                            }
                            f.top = d;
                            f.left += this.left + n;
                            f.left = a.leftForLtr(a.x(f.left), f.width);
                            d += f.height + n;
                        }
                    }
                }
                isHorizontal() {
                    return this.options.position === 'top' || this.options.position === 'bottom';
                }
                draw() {
                    if (this.options.display) {
                        const t = this.ctx;
                        (0, i.L)(t, this);
                        this._draw();
                        (0, i.N)(t);
                    }
                }
                _draw() {
                    const { options: t , columnSizes: e , lineWidths: s , ctx: n  } = this;
                    const { align: o , labels: a  } = t;
                    const r = i.d.color;
                    const l = (0, i.aA)(t.rtl, this.left, this.width);
                    const c = (0, i.O)(a.font);
                    const { color: h , padding: d  } = a;
                    const f = c.size;
                    const u = f / 2;
                    let g;
                    this.drawTitle();
                    n.textAlign = l.textAlign('left');
                    n.textBaseline = 'middle';
                    n.lineWidth = 0.5;
                    n.font = c.string;
                    const { boxWidth: p , boxHeight: m , itemHeight: b  } = is(a, f);
                    const x = function(t, e, s) {
                        if (isNaN(p) || p <= 0 || isNaN(m) || m < 0) {
                            return;
                        }
                        n.save();
                        const o = (0, i.v)(s.lineWidth, 1);
                        n.fillStyle = (0, i.v)(s.fillStyle, r);
                        n.lineCap = (0, i.v)(s.lineCap, 'butt');
                        n.lineDashOffset = (0, i.v)(s.lineDashOffset, 0);
                        n.lineJoin = (0, i.v)(s.lineJoin, 'miter');
                        n.lineWidth = o;
                        n.strokeStyle = (0, i.v)(s.strokeStyle, r);
                        n.setLineDash((0, i.v)(s.lineDash, []));
                        if (a.usePointStyle) {
                            const c = {
                                radius: m * Math.SQRT2 / 2,
                                pointStyle: s.pointStyle,
                                rotation: s.rotation,
                                borderWidth: o
                            };
                            const h = l.xPlus(t, p / 2);
                            const d = e + u;
                            (0, i.aE)(n, c, h, d, a.pointStyleWidth && p);
                        } else {
                            const g = e + Math.max((f - m) / 2, 0);
                            const b = l.leftForLtr(t, p);
                            const x = (0, i.ax)(s.borderRadius);
                            n.beginPath();
                            if (Object.values(x).some((t)=>t !== 0)) {
                                (0, i.av)(n, {
                                    x: b,
                                    y: g,
                                    w: p,
                                    h: m,
                                    radius: x
                                });
                            } else {
                                n.rect(b, g, p, m);
                            }
                            n.fill();
                            if (o !== 0) {
                                n.stroke();
                            }
                        }
                        n.restore();
                    };
                    const _ = function(t, e, s) {
                        (0, i.M)(n, s.text, t, e + (b / 2), c, {
                            strikethrough: s.hidden,
                            textAlign: l.textAlign(s.textAlign)
                        });
                    };
                    const y = this.isHorizontal();
                    const v = this._computeTitleHeight();
                    if (y) {
                        g = {
                            x: (0, i.S)(o, this.left + d, this.right - s[0]),
                            y: this.top + d + v,
                            line: 0
                        };
                    } else {
                        g = {
                            x: this.left + d,
                            y: (0, i.S)(o, this.top + v + d, this.bottom - e[0].height),
                            line: 0
                        };
                    }
                    (0, i.aB)(this.ctx, t.textDirection);
                    const M = b + d;
                    this.legendItems.forEach((r, c)=>{
                        n.strokeStyle = r.fontColor || h;
                        n.fillStyle = r.fontColor || h;
                        const f = n.measureText(r.text).width;
                        const m = l.textAlign(r.textAlign || (r.textAlign = a.textAlign));
                        const b = p + u + f;
                        let k = g.x;
                        let w = g.y;
                        l.setWidth(this.width);
                        if (y) {
                            if (c > 0 && k + b + d > this.right) {
                                w = g.y += M;
                                g.line++;
                                k = g.x = (0, i.S)(o, this.left + d, this.right - s[g.line]);
                            }
                        } else if (c > 0 && w + M > this.bottom) {
                            k = g.x = k + e[g.line].width + d;
                            g.line++;
                            w = g.y = (0, i.S)(o, this.top + v + d, this.bottom - e[g.line].height);
                        }
                        const S = l.x(k);
                        x(S, w, r);
                        k = (0, i.aC)(m, k + p + u, y ? k + b : this.right, t.rtl);
                        _(l.x(k), w, r);
                        if (y) {
                            g.x += b + d;
                        } else {
                            g.y += M;
                        }
                    });
                    (0, i.aD)(this.ctx, t.textDirection);
                }
                drawTitle() {
                    const t = this.options;
                    const e = t.title;
                    const s = (0, i.O)(e.font);
                    const n = (0, i.K)(e.padding);
                    if (!e.display) {
                        return;
                    }
                    const o = (0, i.aA)(t.rtl, this.left, this.width);
                    const a = this.ctx;
                    const r = e.position;
                    const l = s.size / 2;
                    const c = n.top + l;
                    let h;
                    let d = this.left;
                    let f = this.width;
                    if (this.isHorizontal()) {
                        f = Math.max(...this.lineWidths);
                        h = this.top + c;
                        d = (0, i.S)(t.align, d, this.right - f);
                    } else {
                        const u = this.columnSizes.reduce((t, e)=>Math.max(t, e.height), 0);
                        h = c + (0, i.S)(t.align, this.top, this.bottom - u - t.labels.padding - this._computeTitleHeight());
                    }
                    const g = (0, i.S)(r, d, d + f);
                    a.textAlign = o.textAlign((0, i.R)(r));
                    a.textBaseline = 'middle';
                    a.strokeStyle = e.color;
                    a.fillStyle = e.color;
                    a.font = s.string;
                    (0, i.M)(a, e.text, g, h, s);
                }
                _computeTitleHeight() {
                    const t = this.options.title;
                    const e = (0, i.O)(t.font);
                    const s = (0, i.K)(t.padding);
                    return t.display ? e.lineHeight + s.height : 0;
                }
                _getLegendItemAt(t, e) {
                    let s, n, o;
                    if ((0, i.ak)(t, this.left, this.right) && (0, i.ak)(e, this.top, this.bottom)) {
                        o = this.legendHitBoxes;
                        for(s = 0; s < o.length; ++s){
                            n = o[s];
                            if ((0, i.ak)(t, n.left, n.left + n.width) && (0, i.ak)(e, n.top, n.top + n.height)) {
                                return this.legendItems[s];
                            }
                        }
                    }
                    return null;
                }
                handleEvent(t) {
                    const e = this.options;
                    if (!ia(t.type, e)) {
                        return;
                    }
                    const s = this._getLegendItemAt(t.x, t.y);
                    if (t.type === 'mousemove' || t.type === 'mouseout') {
                        const n = this._hoveredItem;
                        const o = ii(n, s);
                        if (n && !o) {
                            (0, i.C)(e.onLeave, [
                                t,
                                n,
                                this
                            ], this);
                        }
                        this._hoveredItem = s;
                        if (s && !o) {
                            (0, i.C)(e.onHover, [
                                t,
                                s,
                                this
                            ], this);
                        }
                    } else if (s) {
                        (0, i.C)(e.onClick, [
                            t,
                            s,
                            this
                        ], this);
                    }
                }
            }
            function ia(t, e) {
                if ((t === 'mousemove' || t === 'mouseout') && (e.onHover || e.onLeave)) {
                    return true;
                }
                if (e.onClick && (t === 'click' || t === 'mouseup')) {
                    return true;
                }
                return false;
            }
            var ir = {
                id: 'legend',
                _element: io,
                start (t, e, s) {
                    const i = t.legend = new io({
                        ctx: t.ctx,
                        options: s,
                        chart: t
                    });
                    t9.configure(t, i, s);
                    t9.addBox(t, i);
                },
                stop (t) {
                    t9.removeBox(t, t.legend);
                    delete t.legend;
                },
                beforeUpdate (t, e, s) {
                    const i = t.legend;
                    t9.configure(t, i, s);
                    i.options = s;
                },
                afterUpdate (t) {
                    const e = t.legend;
                    e.buildLabels();
                    e.adjustHitBoxes();
                },
                afterEvent (t, e) {
                    if (!e.replay) {
                        t.legend.handleEvent(e.event);
                    }
                },
                defaults: {
                    display: true,
                    position: 'top',
                    align: 'center',
                    fullSize: true,
                    reverse: false,
                    weight: 1000,
                    onClick (t, e, s) {
                        const i = e.datasetIndex;
                        const n = s.chart;
                        if (n.isDatasetVisible(i)) {
                            n.hide(i);
                            e.hidden = true;
                        } else {
                            n.show(i);
                            e.hidden = false;
                        }
                    },
                    onHover: null,
                    onLeave: null,
                    labels: {
                        color: (t)=>t.chart.options.color,
                        boxWidth: 40,
                        padding: 10,
                        generateLabels (t) {
                            const e = t.data.datasets;
                            const { labels: { usePointStyle: s , pointStyle: n , textAlign: o , color: a  }  } = t.legend.options;
                            return t._getSortedDatasetMetas().map((t)=>{
                                const r = t.controller.getStyle(s ? 0 : undefined);
                                const l = (0, i.K)(r.borderWidth);
                                return {
                                    text: e[t.index].label,
                                    fillStyle: r.backgroundColor,
                                    fontColor: a,
                                    hidden: !t.visible,
                                    lineCap: r.borderCapStyle,
                                    lineDash: r.borderDash,
                                    lineDashOffset: r.borderDashOffset,
                                    lineJoin: r.borderJoinStyle,
                                    lineWidth: (l.width + l.height) / 4,
                                    strokeStyle: r.borderColor,
                                    pointStyle: n || r.pointStyle,
                                    rotation: r.rotation,
                                    textAlign: o || r.textAlign,
                                    borderRadius: 0,
                                    datasetIndex: t.index
                                };
                            }, this);
                        }
                    },
                    title: {
                        color: (t)=>t.chart.options.color,
                        display: false,
                        position: 'center',
                        text: ''
                    }
                },
                descriptors: {
                    _scriptable: (t)=>!t.startsWith('on'),
                    labels: {
                        _scriptable: (t)=>![
                                'generateLabels',
                                'filter',
                                'sort'
                            ].includes(t)
                    }
                }
            };
            class il extends tn {
                constructor(t){
                    super();
                    this.chart = t.chart;
                    this.options = t.options;
                    this.ctx = t.ctx;
                    this._padding = undefined;
                    this.top = undefined;
                    this.bottom = undefined;
                    this.left = undefined;
                    this.right = undefined;
                    this.width = undefined;
                    this.height = undefined;
                    this.position = undefined;
                    this.weight = undefined;
                    this.fullSize = undefined;
                }
                update(t, e) {
                    const s = this.options;
                    this.left = 0;
                    this.top = 0;
                    if (!s.display) {
                        this.width = this.height = this.right = this.bottom = 0;
                        return;
                    }
                    this.width = this.right = t;
                    this.height = this.bottom = e;
                    const n = (0, i.b)(s.text) ? s.text.length : 1;
                    this._padding = (0, i.K)(s.padding);
                    const o = n * (0, i.O)(s.font).lineHeight + this._padding.height;
                    if (this.isHorizontal()) {
                        this.height = o;
                    } else {
                        this.width = o;
                    }
                }
                isHorizontal() {
                    const t = this.options.position;
                    return t === 'top' || t === 'bottom';
                }
                _drawArgs(t) {
                    const { top: e , left: s , bottom: n , right: o , options: a  } = this;
                    const r = a.align;
                    let l = 0;
                    let c, h, d;
                    if (this.isHorizontal()) {
                        h = (0, i.S)(r, s, o);
                        d = e + t;
                        c = o - s;
                    } else {
                        if (a.position === 'left') {
                            h = s + t;
                            d = (0, i.S)(r, n, e);
                            l = i.P * -0.5;
                        } else {
                            h = o - t;
                            d = (0, i.S)(r, e, n);
                            l = i.P * 0.5;
                        }
                        c = n - e;
                    }
                    return {
                        titleX: h,
                        titleY: d,
                        maxWidth: c,
                        rotation: l
                    };
                }
                draw() {
                    const t = this.ctx;
                    const e = this.options;
                    if (!e.display) {
                        return;
                    }
                    const s = (0, i.O)(e.font);
                    const n = s.lineHeight;
                    const o = n / 2 + this._padding.top;
                    const { titleX: a , titleY: r , maxWidth: l , rotation: c  } = this._drawArgs(o);
                    (0, i.M)(t, e.text, 0, 0, s, {
                        color: e.color,
                        maxWidth: l,
                        rotation: c,
                        textAlign: (0, i.R)(e.align),
                        textBaseline: 'middle',
                        translation: [
                            a,
                            r
                        ]
                    });
                }
            }
            function ic(t, e) {
                const s = new il({
                    ctx: t.ctx,
                    options: e,
                    chart: t
                });
                t9.configure(t, s, e);
                t9.addBox(t, s);
                t.titleBlock = s;
            }
            var ih = {
                id: 'title',
                _element: il,
                start (t, e, s) {
                    ic(t, s);
                },
                stop (t) {
                    const e = t.titleBlock;
                    t9.removeBox(t, e);
                    delete t.titleBlock;
                },
                beforeUpdate (t, e, s) {
                    const i = t.titleBlock;
                    t9.configure(t, i, s);
                    i.options = s;
                },
                defaults: {
                    align: 'center',
                    display: false,
                    font: {
                        weight: 'bold'
                    },
                    fullSize: true,
                    padding: 10,
                    position: 'top',
                    text: '',
                    weight: 2000
                },
                defaultRoutes: {
                    color: 'color'
                },
                descriptors: {
                    _scriptable: true,
                    _indexable: false
                }
            };
            const id = new WeakMap();
            var iu = {
                id: 'subtitle',
                start (t, e, s) {
                    const i = new il({
                        ctx: t.ctx,
                        options: s,
                        chart: t
                    });
                    t9.configure(t, i, s);
                    t9.addBox(t, i);
                    id.set(t, i);
                },
                stop (t) {
                    t9.removeBox(t, id.get(t));
                    id.delete(t);
                },
                beforeUpdate (t, e, s) {
                    const i = id.get(t);
                    t9.configure(t, i, s);
                    i.options = s;
                },
                defaults: {
                    align: 'center',
                    display: false,
                    font: {
                        weight: 'normal'
                    },
                    fullSize: true,
                    padding: 0,
                    position: 'top',
                    text: '',
                    weight: 1500
                },
                defaultRoutes: {
                    color: 'color'
                },
                descriptors: {
                    _scriptable: true,
                    _indexable: false
                }
            };
            const ig = {
                average (t) {
                    if (!t.length) {
                        return false;
                    }
                    let e, s;
                    let i = 0;
                    let n = 0;
                    let o = 0;
                    for(e = 0, s = t.length; e < s; ++e){
                        const a = t[e].element;
                        if (a && a.hasValue()) {
                            const r = a.tooltipPosition();
                            i += r.x;
                            n += r.y;
                            ++o;
                        }
                    }
                    return {
                        x: i / o,
                        y: n / o
                    };
                },
                nearest (t, e) {
                    if (!t.length) {
                        return false;
                    }
                    let s = e.x;
                    let n = e.y;
                    let o = Number.POSITIVE_INFINITY;
                    let a, r, l;
                    for(a = 0, r = t.length; a < r; ++a){
                        const c = t[a].element;
                        if (c && c.hasValue()) {
                            const h = c.getCenterPoint();
                            const d = (0, i.aG)(e, h);
                            if (d < o) {
                                o = d;
                                l = c;
                            }
                        }
                    }
                    if (l) {
                        const f = l.tooltipPosition();
                        s = f.x;
                        n = f.y;
                    }
                    return {
                        x: s,
                        y: n
                    };
                }
            };
            function ip(t, e) {
                if (e) {
                    if ((0, i.b)(e)) {
                        Array.prototype.push.apply(t, e);
                    } else {
                        t.push(e);
                    }
                }
                return t;
            }
            function im(t) {
                if ((typeof t === 'string' || t instanceof String) && t.indexOf('\n') > -1) {
                    return t.split('\n');
                }
                return t;
            }
            function ib(t, e) {
                const { element: s , datasetIndex: i , index: n  } = e;
                const o = t.getDatasetMeta(i).controller;
                const { label: a , value: r  } = o.getLabelAndValue(n);
                return {
                    chart: t,
                    label: a,
                    parsed: o.getParsed(n),
                    raw: t.data.datasets[i].data[n],
                    formattedValue: r,
                    dataset: o.getDataset(),
                    dataIndex: n,
                    datasetIndex: i,
                    element: s
                };
            }
            function ix(t, e) {
                const s = t.chart.ctx;
                const { body: n , footer: o , title: a  } = t;
                const { boxWidth: r , boxHeight: l  } = e;
                const c = (0, i.O)(e.bodyFont);
                const h = (0, i.O)(e.titleFont);
                const d = (0, i.O)(e.footerFont);
                const f = a.length;
                const u = o.length;
                const g = n.length;
                const p = (0, i.K)(e.padding);
                let m = p.height;
                let b = 0;
                let x = n.reduce((t, e)=>t + e.before.length + e.lines.length + e.after.length, 0);
                x += t.beforeBody.length + t.afterBody.length;
                if (f) {
                    m += f * h.lineHeight + (f - 1) * e.titleSpacing + e.titleMarginBottom;
                }
                if (x) {
                    const _ = e.displayColors ? Math.max(l, c.lineHeight) : c.lineHeight;
                    m += g * _ + (x - g) * c.lineHeight + (x - 1) * e.bodySpacing;
                }
                if (u) {
                    m += e.footerMarginTop + u * d.lineHeight + (u - 1) * e.footerSpacing;
                }
                let y = 0;
                const v = function(t) {
                    b = Math.max(b, s.measureText(t).width + y);
                };
                s.save();
                s.font = h.string;
                (0, i.Q)(t.title, v);
                s.font = c.string;
                (0, i.Q)(t.beforeBody.concat(t.afterBody), v);
                y = e.displayColors ? (r + 2 + e.boxPadding) : 0;
                (0, i.Q)(n, (t)=>{
                    (0, i.Q)(t.before, v);
                    (0, i.Q)(t.lines, v);
                    (0, i.Q)(t.after, v);
                });
                y = 0;
                s.font = d.string;
                (0, i.Q)(t.footer, v);
                s.restore();
                b += p.width;
                return {
                    width: b,
                    height: m
                };
            }
            function i_(t, e) {
                const { y: s , height: i  } = e;
                if (s < i / 2) {
                    return 'top';
                } else if (s > (t.height - i / 2)) {
                    return 'bottom';
                }
                return 'center';
            }
            function iy(t, e, s, i) {
                const { x: n , width: o  } = i;
                const a = s.caretSize + s.caretPadding;
                if (t === 'left' && n + o + a > e.width) {
                    return true;
                }
                if (t === 'right' && n - o - a < 0) {
                    return true;
                }
            }
            function iv(t, e, s, i) {
                const { x: n , width: o  } = s;
                const { width: a , chartArea: { left: r , right: l  }  } = t;
                let c = 'center';
                if (i === 'center') {
                    c = n <= (r + l) / 2 ? 'left' : 'right';
                } else if (n <= o / 2) {
                    c = 'left';
                } else if (n >= a - o / 2) {
                    c = 'right';
                }
                if (iy(c, t, e, s)) {
                    c = 'center';
                }
                return c;
            }
            function iM(t, e, s) {
                const i = s.yAlign || e.yAlign || i_(t, s);
                return {
                    xAlign: s.xAlign || e.xAlign || iv(t, e, s, i),
                    yAlign: i
                };
            }
            function ik(t, e) {
                let { x: s , width: i  } = t;
                if (e === 'right') {
                    s -= i;
                } else if (e === 'center') {
                    s -= (i / 2);
                }
                return s;
            }
            function iw(t, e, s) {
                let { y: i , height: n  } = t;
                if (e === 'top') {
                    i += s;
                } else if (e === 'bottom') {
                    i -= n + s;
                } else {
                    i -= (n / 2);
                }
                return i;
            }
            function iS(t, e, s, n) {
                const { caretSize: o , caretPadding: a , cornerRadius: r  } = t;
                const { xAlign: l , yAlign: c  } = s;
                const h = o + a;
                const { topLeft: d , topRight: f , bottomLeft: u , bottomRight: g  } = (0, i.ax)(r);
                let p = ik(e, l);
                const m = iw(e, c, h);
                if (c === 'center') {
                    if (l === 'left') {
                        p += h;
                    } else if (l === 'right') {
                        p -= h;
                    }
                } else if (l === 'left') {
                    p -= Math.max(d, u) + o;
                } else if (l === 'right') {
                    p += Math.max(f, g) + o;
                }
                return {
                    x: (0, i.E)(p, 0, n.width - e.width),
                    y: (0, i.E)(m, 0, n.height - e.height)
                };
            }
            function iP(t, e, s) {
                const n = (0, i.K)(s.padding);
                return e === 'center' ? t.x + t.width / 2 : e === 'right' ? t.x + t.width - n.right : t.x + n.left;
            }
            function iD(t) {
                return ip([], im(t));
            }
            function iC(t, e, s) {
                return (0, i.h)(t, {
                    tooltip: e,
                    tooltipItems: s,
                    type: 'tooltip'
                });
            }
            function iO(t, e) {
                const s = e && e.dataset && e.dataset.tooltip && e.dataset.tooltip.callbacks;
                return s ? t.override(s) : t;
            }
            class iL extends tn {
                constructor(t){
                    super();
                    this.opacity = 0;
                    this._active = [];
                    this._eventPosition = undefined;
                    this._size = undefined;
                    this._cachedAnimations = undefined;
                    this._tooltipItems = [];
                    this.$animations = undefined;
                    this.$context = undefined;
                    this.chart = t.chart || t._chart;
                    this._chart = this.chart;
                    this.options = t.options;
                    this.dataPoints = undefined;
                    this.title = undefined;
                    this.beforeBody = undefined;
                    this.body = undefined;
                    this.afterBody = undefined;
                    this.footer = undefined;
                    this.xAlign = undefined;
                    this.yAlign = undefined;
                    this.x = undefined;
                    this.y = undefined;
                    this.height = undefined;
                    this.width = undefined;
                    this.caretX = undefined;
                    this.caretY = undefined;
                    this.labelColors = undefined;
                    this.labelPointStyles = undefined;
                    this.labelTextColors = undefined;
                }
                initialize(t) {
                    this.options = t;
                    this._cachedAnimations = undefined;
                    this.$context = undefined;
                }
                _resolveAnimations() {
                    const t = this._cachedAnimations;
                    if (t) {
                        return t;
                    }
                    const e = this.chart;
                    const s = this.options.setContext(this.getContext());
                    const i = s.enabled && e.options.animation && s.animations;
                    const n = new f(this.chart, i);
                    if (i._cacheable) {
                        this._cachedAnimations = Object.freeze(n);
                    }
                    return n;
                }
                getContext() {
                    return this.$context || (this.$context = iC(this.chart.getContext(), this, this._tooltipItems));
                }
                getTitle(t, e) {
                    const { callbacks: s  } = e;
                    const i = s.beforeTitle.apply(this, [
                        t
                    ]);
                    const n = s.title.apply(this, [
                        t
                    ]);
                    const o = s.afterTitle.apply(this, [
                        t
                    ]);
                    let a = [];
                    a = ip(a, im(i));
                    a = ip(a, im(n));
                    a = ip(a, im(o));
                    return a;
                }
                getBeforeBody(t, e) {
                    return iD(e.callbacks.beforeBody.apply(this, [
                        t
                    ]));
                }
                getBody(t, e) {
                    const { callbacks: s  } = e;
                    const n = [];
                    (0, i.Q)(t, (t)=>{
                        const e = {
                            before: [],
                            lines: [],
                            after: []
                        };
                        const i = iO(s, t);
                        ip(e.before, im(i.beforeLabel.call(this, t)));
                        ip(e.lines, i.label.call(this, t));
                        ip(e.after, im(i.afterLabel.call(this, t)));
                        n.push(e);
                    });
                    return n;
                }
                getAfterBody(t, e) {
                    return iD(e.callbacks.afterBody.apply(this, [
                        t
                    ]));
                }
                getFooter(t, e) {
                    const { callbacks: s  } = e;
                    const i = s.beforeFooter.apply(this, [
                        t
                    ]);
                    const n = s.footer.apply(this, [
                        t
                    ]);
                    const o = s.afterFooter.apply(this, [
                        t
                    ]);
                    let a = [];
                    a = ip(a, im(i));
                    a = ip(a, im(n));
                    a = ip(a, im(o));
                    return a;
                }
                _createItems(t) {
                    const e = this._active;
                    const s = this.chart.data;
                    const n = [];
                    const o = [];
                    const a = [];
                    let r = [];
                    let l, c;
                    for(l = 0, c = e.length; l < c; ++l){
                        r.push(ib(this.chart, e[l]));
                    }
                    if (t.filter) {
                        r = r.filter((e, i, n)=>t.filter(e, i, n, s));
                    }
                    if (t.itemSort) {
                        r = r.sort((e, i)=>t.itemSort(e, i, s));
                    }
                    (0, i.Q)(r, (e)=>{
                        const s = iO(t.callbacks, e);
                        n.push(s.labelColor.call(this, e));
                        o.push(s.labelPointStyle.call(this, e));
                        a.push(s.labelTextColor.call(this, e));
                    });
                    this.labelColors = n;
                    this.labelPointStyles = o;
                    this.labelTextColors = a;
                    this.dataPoints = r;
                    return r;
                }
                update(t, e) {
                    const s = this.options.setContext(this.getContext());
                    const i = this._active;
                    let n;
                    let o = [];
                    if (!i.length) {
                        if (this.opacity !== 0) {
                            n = {
                                opacity: 0
                            };
                        }
                    } else {
                        const a = ig[s.position].call(this, i, this._eventPosition);
                        o = this._createItems(s);
                        this.title = this.getTitle(o, s);
                        this.beforeBody = this.getBeforeBody(o, s);
                        this.body = this.getBody(o, s);
                        this.afterBody = this.getAfterBody(o, s);
                        this.footer = this.getFooter(o, s);
                        const r = this._size = ix(this, s);
                        const l = Object.assign({}, a, r);
                        const c = iM(this.chart, s, l);
                        const h = iS(s, l, c, this.chart);
                        this.xAlign = c.xAlign;
                        this.yAlign = c.yAlign;
                        n = {
                            opacity: 1,
                            x: h.x,
                            y: h.y,
                            width: r.width,
                            height: r.height,
                            caretX: a.x,
                            caretY: a.y
                        };
                    }
                    this._tooltipItems = o;
                    this.$context = undefined;
                    if (n) {
                        this._resolveAnimations().update(this, n);
                    }
                    if (t && s.external) {
                        s.external.call(this, {
                            chart: this.chart,
                            tooltip: this,
                            replay: e
                        });
                    }
                }
                drawCaret(t, e, s, i) {
                    const n = this.getCaretPosition(t, s, i);
                    e.lineTo(n.x1, n.y1);
                    e.lineTo(n.x2, n.y2);
                    e.lineTo(n.x3, n.y3);
                }
                getCaretPosition(t, e, s) {
                    const { xAlign: n , yAlign: o  } = this;
                    const { caretSize: a , cornerRadius: r  } = s;
                    const { topLeft: l , topRight: c , bottomLeft: h , bottomRight: d  } = (0, i.ax)(r);
                    const { x: f , y: u  } = t;
                    const { width: g , height: p  } = e;
                    let m, b, x, _, y, v;
                    if (o === 'center') {
                        y = u + (p / 2);
                        if (n === 'left') {
                            m = f;
                            b = m - a;
                            _ = y + a;
                            v = y - a;
                        } else {
                            m = f + g;
                            b = m + a;
                            _ = y - a;
                            v = y + a;
                        }
                        x = m;
                    } else {
                        if (n === 'left') {
                            b = f + Math.max(l, h) + (a);
                        } else if (n === 'right') {
                            b = f + g - Math.max(c, d) - a;
                        } else {
                            b = this.caretX;
                        }
                        if (o === 'top') {
                            _ = u;
                            y = _ - a;
                            m = b - a;
                            x = b + a;
                        } else {
                            _ = u + p;
                            y = _ + a;
                            m = b + a;
                            x = b - a;
                        }
                        v = _;
                    }
                    return {
                        x1: m,
                        x2: b,
                        x3: x,
                        y1: _,
                        y2: y,
                        y3: v
                    };
                }
                drawTitle(t, e, s) {
                    const n = this.title;
                    const o = n.length;
                    let a, r, l;
                    if (o) {
                        const c = (0, i.aA)(s.rtl, this.x, this.width);
                        t.x = iP(this, s.titleAlign, s);
                        e.textAlign = c.textAlign(s.titleAlign);
                        e.textBaseline = 'middle';
                        a = (0, i.O)(s.titleFont);
                        r = s.titleSpacing;
                        e.fillStyle = s.titleColor;
                        e.font = a.string;
                        for(l = 0; l < o; ++l){
                            e.fillText(n[l], c.x(t.x), t.y + a.lineHeight / 2);
                            t.y += a.lineHeight + r;
                            if (l + 1 === o) {
                                t.y += s.titleMarginBottom - r;
                            }
                        }
                    }
                }
                _drawColorBox(t, e, s, n, o) {
                    const a = this.labelColors[s];
                    const r = this.labelPointStyles[s];
                    const { boxHeight: l , boxWidth: c , boxPadding: h  } = o;
                    const d = (0, i.O)(o.bodyFont);
                    const f = iP(this, 'left', o);
                    const u = n.x(f);
                    const g = l < d.lineHeight ? (d.lineHeight - l) / 2 : 0;
                    const p = e.y + g;
                    if (o.usePointStyle) {
                        const m = {
                            radius: Math.min(c, l) / 2,
                            pointStyle: r.pointStyle,
                            rotation: r.rotation,
                            borderWidth: 1
                        };
                        const b = n.leftForLtr(u, c) + c / 2;
                        const x = p + l / 2;
                        t.strokeStyle = o.multiKeyBackground;
                        t.fillStyle = o.multiKeyBackground;
                        (0, i.au)(t, m, b, x);
                        t.strokeStyle = a.borderColor;
                        t.fillStyle = a.backgroundColor;
                        (0, i.au)(t, m, b, x);
                    } else {
                        t.lineWidth = (0, i.i)(a.borderWidth) ? Math.max(...Object.values(a.borderWidth)) : (a.borderWidth || 1);
                        t.strokeStyle = a.borderColor;
                        t.setLineDash(a.borderDash || []);
                        t.lineDashOffset = a.borderDashOffset || 0;
                        const _ = n.leftForLtr(u, c - h);
                        const y = n.leftForLtr(n.xPlus(u, 1), c - h - 2);
                        const v = (0, i.ax)(a.borderRadius);
                        if (Object.values(v).some((t)=>t !== 0)) {
                            t.beginPath();
                            t.fillStyle = o.multiKeyBackground;
                            (0, i.av)(t, {
                                x: _,
                                y: p,
                                w: c,
                                h: l,
                                radius: v
                            });
                            t.fill();
                            t.stroke();
                            t.fillStyle = a.backgroundColor;
                            t.beginPath();
                            (0, i.av)(t, {
                                x: y,
                                y: p + 1,
                                w: c - 2,
                                h: l - 2,
                                radius: v
                            });
                            t.fill();
                        } else {
                            t.fillStyle = o.multiKeyBackground;
                            t.fillRect(_, p, c, l);
                            t.strokeRect(_, p, c, l);
                            t.fillStyle = a.backgroundColor;
                            t.fillRect(y, p + 1, c - 2, l - 2);
                        }
                    }
                    t.fillStyle = this.labelTextColors[s];
                }
                drawBody(t, e, s) {
                    const { body: n  } = this;
                    const { bodySpacing: o , bodyAlign: a , displayColors: r , boxHeight: l , boxWidth: c , boxPadding: h  } = s;
                    const d = (0, i.O)(s.bodyFont);
                    let f = d.lineHeight;
                    let u = 0;
                    const g = (0, i.aA)(s.rtl, this.x, this.width);
                    const p = function(s) {
                        e.fillText(s, g.x(t.x + u), t.y + f / 2);
                        t.y += f + o;
                    };
                    const m = g.textAlign(a);
                    let b, x, _, y, v, M, k;
                    e.textAlign = a;
                    e.textBaseline = 'middle';
                    e.font = d.string;
                    t.x = iP(this, m, s);
                    e.fillStyle = s.bodyColor;
                    (0, i.Q)(this.beforeBody, p);
                    u = r && m !== 'right' ? a === 'center' ? (c / 2 + h) : (c + 2 + h) : 0;
                    for(y = 0, M = n.length; y < M; ++y){
                        b = n[y];
                        x = this.labelTextColors[y];
                        e.fillStyle = x;
                        (0, i.Q)(b.before, p);
                        _ = b.lines;
                        if (r && _.length) {
                            this._drawColorBox(e, t, y, g, s);
                            f = Math.max(d.lineHeight, l);
                        }
                        for(v = 0, k = _.length; v < k; ++v){
                            p(_[v]);
                            f = d.lineHeight;
                        }
                        (0, i.Q)(b.after, p);
                    }
                    u = 0;
                    f = d.lineHeight;
                    (0, i.Q)(this.afterBody, p);
                    t.y -= o;
                }
                drawFooter(t, e, s) {
                    const n = this.footer;
                    const o = n.length;
                    let a, r;
                    if (o) {
                        const l = (0, i.aA)(s.rtl, this.x, this.width);
                        t.x = iP(this, s.footerAlign, s);
                        t.y += s.footerMarginTop;
                        e.textAlign = l.textAlign(s.footerAlign);
                        e.textBaseline = 'middle';
                        a = (0, i.O)(s.footerFont);
                        e.fillStyle = s.footerColor;
                        e.font = a.string;
                        for(r = 0; r < o; ++r){
                            e.fillText(n[r], l.x(t.x), t.y + a.lineHeight / 2);
                            t.y += a.lineHeight + s.footerSpacing;
                        }
                    }
                }
                drawBackground(t, e, s, n) {
                    const { xAlign: o , yAlign: a  } = this;
                    const { x: r , y: l  } = t;
                    const { width: c , height: h  } = s;
                    const { topLeft: d , topRight: f , bottomLeft: u , bottomRight: g  } = (0, i.ax)(n.cornerRadius);
                    e.fillStyle = n.backgroundColor;
                    e.strokeStyle = n.borderColor;
                    e.lineWidth = n.borderWidth;
                    e.beginPath();
                    e.moveTo(r + d, l);
                    if (a === 'top') {
                        this.drawCaret(t, e, s, n);
                    }
                    e.lineTo(r + c - f, l);
                    e.quadraticCurveTo(r + c, l, r + c, l + f);
                    if (a === 'center' && o === 'right') {
                        this.drawCaret(t, e, s, n);
                    }
                    e.lineTo(r + c, l + h - g);
                    e.quadraticCurveTo(r + c, l + h, r + c - g, l + h);
                    if (a === 'bottom') {
                        this.drawCaret(t, e, s, n);
                    }
                    e.lineTo(r + u, l + h);
                    e.quadraticCurveTo(r, l + h, r, l + h - u);
                    if (a === 'center' && o === 'left') {
                        this.drawCaret(t, e, s, n);
                    }
                    e.lineTo(r, l + d);
                    e.quadraticCurveTo(r, l, r + d, l);
                    e.closePath();
                    e.fill();
                    if (n.borderWidth > 0) {
                        e.stroke();
                    }
                }
                _updateAnimationTarget(t) {
                    const e = this.chart;
                    const s = this.$animations;
                    const i = s && s.x;
                    const n = s && s.y;
                    if (i || n) {
                        const o = ig[t.position].call(this, this._active, this._eventPosition);
                        if (!o) {
                            return;
                        }
                        const a = this._size = ix(this, t);
                        const r = Object.assign({}, o, this._size);
                        const l = iM(e, t, r);
                        const c = iS(t, r, l, e);
                        if (i._to !== c.x || n._to !== c.y) {
                            this.xAlign = l.xAlign;
                            this.yAlign = l.yAlign;
                            this.width = a.width;
                            this.height = a.height;
                            this.caretX = o.x;
                            this.caretY = o.y;
                            this._resolveAnimations().update(this, c);
                        }
                    }
                }
                _willRender() {
                    return !!this.opacity;
                }
                draw(t) {
                    const e = this.options.setContext(this.getContext());
                    let s = this.opacity;
                    if (!s) {
                        return;
                    }
                    this._updateAnimationTarget(e);
                    const n = {
                        width: this.width,
                        height: this.height
                    };
                    const o = {
                        x: this.x,
                        y: this.y
                    };
                    s = Math.abs(s) < 1e-3 ? 0 : s;
                    const a = (0, i.K)(e.padding);
                    const r = this.title.length || this.beforeBody.length || this.body.length || this.afterBody.length || this.footer.length;
                    if (e.enabled && r) {
                        t.save();
                        t.globalAlpha = s;
                        this.drawBackground(o, t, n, e);
                        (0, i.aB)(t, e.textDirection);
                        o.y += a.top;
                        this.drawTitle(o, t, e);
                        this.drawBody(o, t, e);
                        this.drawFooter(o, t, e);
                        (0, i.aD)(t, e.textDirection);
                        t.restore();
                    }
                }
                getActiveElements() {
                    return this._active || [];
                }
                setActiveElements(t, e) {
                    const s = this._active;
                    const n = t.map(({ datasetIndex: t , index: e  })=>{
                        const s = this.chart.getDatasetMeta(t);
                        if (!s) {
                            throw new Error('Cannot find a dataset at index ' + t);
                        }
                        return {
                            datasetIndex: t,
                            element: s.data[e],
                            index: e
                        };
                    });
                    const o = !(0, i.ai)(s, n);
                    const a = this._positionChanged(n, e);
                    if (o || a) {
                        this._active = n;
                        this._eventPosition = e;
                        this._ignoreReplayEvents = true;
                        this.update(true);
                    }
                }
                handleEvent(t, e, s = true) {
                    if (e && this._ignoreReplayEvents) {
                        return false;
                    }
                    this._ignoreReplayEvents = false;
                    const n = this.options;
                    const o = this._active || [];
                    const a = this._getActiveElements(t, o, e, s);
                    const r = this._positionChanged(a, t);
                    const l = e || !(0, i.ai)(a, o) || r;
                    if (l) {
                        this._active = a;
                        if (n.enabled || n.external) {
                            this._eventPosition = {
                                x: t.x,
                                y: t.y
                            };
                            this.update(true, e);
                        }
                    }
                    return l;
                }
                _getActiveElements(t, e, s, i) {
                    const n = this.options;
                    if (t.type === 'mouseout') {
                        return [];
                    }
                    if (!i) {
                        return e;
                    }
                    const o = this.chart.getElementsAtEventForMode(t, n.mode, n, s);
                    if (n.reverse) {
                        o.reverse();
                    }
                    return o;
                }
                _positionChanged(t, e) {
                    const { caretX: s , caretY: i , options: n  } = this;
                    const o = ig[n.position].call(this, t, e);
                    return o !== false && (s !== o.x || i !== o.y);
                }
            }
            iL.positioners = ig;
            var iE = {
                id: 'tooltip',
                _element: iL,
                positioners: ig,
                afterInit (t, e, s) {
                    if (s) {
                        t.tooltip = new iL({
                            chart: t,
                            options: s
                        });
                    }
                },
                beforeUpdate (t, e, s) {
                    if (t.tooltip) {
                        t.tooltip.initialize(s);
                    }
                },
                reset (t, e, s) {
                    if (t.tooltip) {
                        t.tooltip.initialize(s);
                    }
                },
                afterDraw (t) {
                    const e = t.tooltip;
                    if (e && e._willRender()) {
                        const s = {
                            tooltip: e
                        };
                        if (t.notifyPlugins('beforeTooltipDraw', s) === false) {
                            return;
                        }
                        e.draw(t.ctx);
                        t.notifyPlugins('afterTooltipDraw', s);
                    }
                },
                afterEvent (t, e) {
                    if (t.tooltip) {
                        const s = e.replay;
                        if (t.tooltip.handleEvent(e.event, s, e.inChartArea)) {
                            e.changed = true;
                        }
                    }
                },
                defaults: {
                    enabled: true,
                    external: null,
                    position: 'average',
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    titleColor: '#fff',
                    titleFont: {
                        weight: 'bold'
                    },
                    titleSpacing: 2,
                    titleMarginBottom: 6,
                    titleAlign: 'left',
                    bodyColor: '#fff',
                    bodySpacing: 2,
                    bodyFont: {},
                    bodyAlign: 'left',
                    footerColor: '#fff',
                    footerSpacing: 2,
                    footerMarginTop: 6,
                    footerFont: {
                        weight: 'bold'
                    },
                    footerAlign: 'left',
                    padding: 6,
                    caretPadding: 2,
                    caretSize: 5,
                    cornerRadius: 6,
                    boxHeight: (t, e)=>e.bodyFont.size,
                    boxWidth: (t, e)=>e.bodyFont.size,
                    multiKeyBackground: '#fff',
                    displayColors: true,
                    boxPadding: 0,
                    borderColor: 'rgba(0,0,0,0)',
                    borderWidth: 0,
                    animation: {
                        duration: 400,
                        easing: 'easeOutQuart'
                    },
                    animations: {
                        numbers: {
                            type: 'number',
                            properties: [
                                'x',
                                'y',
                                'width',
                                'height',
                                'caretX',
                                'caretY'
                            ]
                        },
                        opacity: {
                            easing: 'linear',
                            duration: 200
                        }
                    },
                    callbacks: {
                        beforeTitle: i.aF,
                        title (t) {
                            if (t.length > 0) {
                                const e = t[0];
                                const s = e.chart.data.labels;
                                const i = s ? s.length : 0;
                                if (this && this.options && this.options.mode === 'dataset') {
                                    return e.dataset.label || '';
                                } else if (e.label) {
                                    return e.label;
                                } else if (i > 0 && e.dataIndex < i) {
                                    return s[e.dataIndex];
                                }
                            }
                            return '';
                        },
                        afterTitle: i.aF,
                        beforeBody: i.aF,
                        beforeLabel: i.aF,
                        label (t) {
                            if (this && this.options && this.options.mode === 'dataset') {
                                return t.label + ': ' + t.formattedValue || t.formattedValue;
                            }
                            let e = t.dataset.label || '';
                            if (e) {
                                e += ': ';
                            }
                            const s = t.formattedValue;
                            if (!(0, i.k)(s)) {
                                e += s;
                            }
                            return e;
                        },
                        labelColor (t) {
                            const e = t.chart.getDatasetMeta(t.datasetIndex);
                            const s = e.controller.getStyle(t.dataIndex);
                            return {
                                borderColor: s.borderColor,
                                backgroundColor: s.backgroundColor,
                                borderWidth: s.borderWidth,
                                borderDash: s.borderDash,
                                borderDashOffset: s.borderDashOffset,
                                borderRadius: 0
                            };
                        },
                        labelTextColor () {
                            return this.options.bodyColor;
                        },
                        labelPointStyle (t) {
                            const e = t.chart.getDatasetMeta(t.datasetIndex);
                            const s = e.controller.getStyle(t.dataIndex);
                            return {
                                pointStyle: s.pointStyle,
                                rotation: s.rotation
                            };
                        },
                        afterLabel: i.aF,
                        afterBody: i.aF,
                        beforeFooter: i.aF,
                        footer: i.aF,
                        afterFooter: i.aF
                    }
                },
                defaultRoutes: {
                    bodyFont: 'font',
                    footerFont: 'font',
                    titleFont: 'font'
                },
                descriptors: {
                    _scriptable: (t)=>t !== 'filter' && t !== 'itemSort' && t !== 'external',
                    _indexable: false,
                    callbacks: {
                        _scriptable: false,
                        _indexable: false
                    },
                    animation: {
                        _fallback: false
                    },
                    animations: {
                        _fallback: 'animation'
                    }
                },
                additionalOptionScopes: [
                    'interaction'
                ]
            };
            var iA = Object.freeze({
                __proto__: null,
                Decimation: sR,
                Filler: ie,
                Legend: ir,
                SubTitle: iu,
                Title: ih,
                Tooltip: iE
            });
            const iT = (t, e, s, i)=>{
                if (typeof e === 'string') {
                    s = t.push(e) - 1;
                    i.unshift({
                        index: s,
                        label: e
                    });
                } else if (isNaN(e)) {
                    s = null;
                }
                return s;
            };
            function iz(t, e, s, i) {
                const n = t.indexOf(e);
                if (n === -1) {
                    return iT(t, e, s, i);
                }
                const o = t.lastIndexOf(e);
                return n !== o ? s : n;
            }
            const iR = (t, e)=>t === null ? null : (0, i.E)(Math.round(t), 0, e);
            class iF extends tP {
                constructor(t){
                    super(t);
                    this._startValue = undefined;
                    this._valueRange = 0;
                    this._addedLabels = [];
                }
                init(t) {
                    const e = this._addedLabels;
                    if (e.length) {
                        const s = this.getLabels();
                        for (const { index: i , label: n  } of e){
                            if (s[i] === n) {
                                s.splice(i, 1);
                            }
                        }
                        this._addedLabels = [];
                    }
                    super.init(t);
                }
                parse(t, e) {
                    if ((0, i.k)(t)) {
                        return null;
                    }
                    const s = this.getLabels();
                    e = isFinite(e) && s[e] === t ? e : iz(s, t, (0, i.v)(e, t), this._addedLabels);
                    return iR(e, s.length - 1);
                }
                determineDataLimits() {
                    const { minDefined: t , maxDefined: e  } = this.getUserBounds();
                    let { min: s , max: i  } = this.getMinMax(true);
                    if (this.options.bounds === 'ticks') {
                        if (!t) {
                            s = 0;
                        }
                        if (!e) {
                            i = this.getLabels().length - 1;
                        }
                    }
                    this.min = s;
                    this.max = i;
                }
                buildTicks() {
                    const t = this.min;
                    const e = this.max;
                    const s = this.options.offset;
                    const i = [];
                    let n = this.getLabels();
                    n = (t === 0 && e === n.length - 1) ? n : n.slice(t, e + 1);
                    this._valueRange = Math.max(n.length - (s ? 0 : 1), 1);
                    this._startValue = this.min - (s ? 0.5 : 0);
                    for(let o = t; o <= e; o++){
                        i.push({
                            value: o
                        });
                    }
                    return i;
                }
                getLabelForValue(t) {
                    const e = this.getLabels();
                    if (t >= 0 && t < e.length) {
                        return e[t];
                    }
                    return t;
                }
                configure() {
                    super.configure();
                    if (!this.isHorizontal()) {
                        this._reversePixels = !this._reversePixels;
                    }
                }
                getPixelForValue(t) {
                    if (typeof t !== 'number') {
                        t = this.parse(t);
                    }
                    return t === null ? NaN : this.getPixelForDecimal((t - this._startValue) / this._valueRange);
                }
                getPixelForTick(t) {
                    const e = this.ticks;
                    if (t < 0 || t > e.length - 1) {
                        return null;
                    }
                    return this.getPixelForValue(e[t].value);
                }
                getValueForPixel(t) {
                    return Math.round(this._startValue + this.getDecimalForPixel(t) * this._valueRange);
                }
                getBasePixel() {
                    return this.bottom;
                }
            }
            iF.id = 'category';
            iF.defaults = {
                ticks: {
                    callback: iF.prototype.getLabelForValue
                }
            };
            function iI(t, e) {
                const s = [];
                const n = 1e-14;
                const { bounds: o , step: a , min: r , max: l , precision: c , count: h , maxTicks: d , maxDigits: f , includeBounds: u  } = t;
                const g = a || 1;
                const p = d - 1;
                const { min: m , max: b  } = e;
                const x = !(0, i.k)(r);
                const _ = !(0, i.k)(l);
                const y = !(0, i.k)(h);
                const v = (b - m) / (f + 1);
                let M = (0, i.aI)((b - m) / p / g) * g;
                let k, w, S, P;
                if (M < n && !x && !_) {
                    return [
                        {
                            value: m
                        },
                        {
                            value: b
                        }
                    ];
                }
                P = Math.ceil(b / M) - Math.floor(m / M);
                if (P > p) {
                    M = (0, i.aI)(P * M / p / g) * g;
                }
                if (!(0, i.k)(c)) {
                    k = Math.pow(10, c);
                    M = Math.ceil(M * k) / k;
                }
                if (o === 'ticks') {
                    w = Math.floor(m / M) * M;
                    S = Math.ceil(b / M) * M;
                } else {
                    w = m;
                    S = b;
                }
                if (x && _ && a && (0, i.aJ)((l - r) / a, M / 1000)) {
                    P = Math.round(Math.min((l - r) / M, d));
                    M = (l - r) / P;
                    w = r;
                    S = l;
                } else if (y) {
                    w = x ? r : w;
                    S = _ ? l : S;
                    P = h - 1;
                    M = (S - w) / P;
                } else {
                    P = (S - w) / M;
                    if ((0, i.aK)(P, Math.round(P), M / 1000)) {
                        P = Math.round(P);
                    } else {
                        P = Math.ceil(P);
                    }
                }
                const D = Math.max((0, i.aL)(M), (0, i.aL)(w));
                k = Math.pow(10, (0, i.k)(c) ? D : c);
                w = Math.round(w * k) / k;
                S = Math.round(S * k) / k;
                let C = 0;
                if (x) {
                    if (u && w !== r) {
                        s.push({
                            value: r
                        });
                        if (w < r) {
                            C++;
                        }
                        if ((0, i.aK)(Math.round((w + C * M) * k) / k, r, iV(r, v, t))) {
                            C++;
                        }
                    } else if (w < r) {
                        C++;
                    }
                }
                for(; C < P; ++C){
                    s.push({
                        value: Math.round((w + C * M) * k) / k
                    });
                }
                if (_ && u && S !== l) {
                    if (s.length && (0, i.aK)(s[s.length - 1].value, l, iV(l, v, t))) {
                        s[s.length - 1].value = l;
                    } else {
                        s.push({
                            value: l
                        });
                    }
                } else if (!_ || S === l) {
                    s.push({
                        value: S
                    });
                }
                return s;
            }
            function iV(t, e, { horizontal: s , minRotation: n  }) {
                const o = (0, i.t)(n);
                const a = (s ? Math.sin(o) : Math.cos(o)) || 0.001;
                const r = 0.75 * e * ('' + t).length;
                return Math.min(e / a, r);
            }
            class iB extends tP {
                constructor(t){
                    super(t);
                    this.start = undefined;
                    this.end = undefined;
                    this._startValue = undefined;
                    this._endValue = undefined;
                    this._valueRange = 0;
                }
                parse(t, e) {
                    if ((0, i.k)(t)) {
                        return null;
                    }
                    if ((typeof t === 'number' || t instanceof Number) && !isFinite(+t)) {
                        return null;
                    }
                    return +t;
                }
                handleTickRangeOptions() {
                    const { beginAtZero: t  } = this.options;
                    const { minDefined: e , maxDefined: s  } = this.getUserBounds();
                    let { min: n , max: o  } = this;
                    const a = (t)=>(n = e ? n : t);
                    const r = (t)=>(o = s ? o : t);
                    if (t) {
                        const l = (0, i.s)(n);
                        const c = (0, i.s)(o);
                        if (l < 0 && c < 0) {
                            r(0);
                        } else if (l > 0 && c > 0) {
                            a(0);
                        }
                    }
                    if (n === o) {
                        let h = 1;
                        if (o >= Number.MAX_SAFE_INTEGER || n <= Number.MIN_SAFE_INTEGER) {
                            h = Math.abs(o * 0.05);
                        }
                        r(o + h);
                        if (!t) {
                            a(n - h);
                        }
                    }
                    this.min = n;
                    this.max = o;
                }
                getTickLimit() {
                    const t = this.options.ticks;
                    let { maxTicksLimit: e , stepSize: s  } = t;
                    let i;
                    if (s) {
                        i = Math.ceil(this.max / s) - Math.floor(this.min / s) + 1;
                        if (i > 1000) {
                            console.warn(`scales.${this.id}.ticks.stepSize: ${s} would result generating up to ${i} ticks. Limiting to 1000.`);
                            i = 1000;
                        }
                    } else {
                        i = this.computeTickLimit();
                        e = e || 11;
                    }
                    if (e) {
                        i = Math.min(e, i);
                    }
                    return i;
                }
                computeTickLimit() {
                    return Number.POSITIVE_INFINITY;
                }
                buildTicks() {
                    const t = this.options;
                    const e = t.ticks;
                    let s = this.getTickLimit();
                    s = Math.max(2, s);
                    const n = {
                        maxTicks: s,
                        bounds: t.bounds,
                        min: t.min,
                        max: t.max,
                        precision: e.precision,
                        step: e.stepSize,
                        count: e.count,
                        maxDigits: this._maxDigits(),
                        horizontal: this.isHorizontal(),
                        minRotation: e.minRotation || 0,
                        includeBounds: e.includeBounds !== false
                    };
                    const o = this._range || this;
                    const a = iI(n, o);
                    if (t.bounds === 'ticks') {
                        (0, i.aH)(a, this, 'value');
                    }
                    if (t.reverse) {
                        a.reverse();
                        this.start = this.max;
                        this.end = this.min;
                    } else {
                        this.start = this.min;
                        this.end = this.max;
                    }
                    return a;
                }
                configure() {
                    const t = this.ticks;
                    let e = this.min;
                    let s = this.max;
                    super.configure();
                    if (this.options.offset && t.length) {
                        const i = (s - e) / Math.max(t.length - 1, 1) / 2;
                        e -= i;
                        s += i;
                    }
                    this._startValue = e;
                    this._endValue = s;
                    this._valueRange = s - e;
                }
                getLabelForValue(t) {
                    return (0, i.o)(t, this.chart.options.locale, this.options.ticks.format);
                }
            }
            class iN extends iB {
                determineDataLimits() {
                    const { min: t , max: e  } = this.getMinMax(true);
                    this.min = (0, i.g)(t) ? t : 0;
                    this.max = (0, i.g)(e) ? e : 1;
                    this.handleTickRangeOptions();
                }
                computeTickLimit() {
                    const t = this.isHorizontal();
                    const e = t ? this.width : this.height;
                    const s = (0, i.t)(this.options.ticks.minRotation);
                    const n = (t ? Math.sin(s) : Math.cos(s)) || 0.001;
                    const o = this._resolveTickFontOptions(0);
                    return Math.ceil(e / Math.min(40, o.lineHeight / n));
                }
                getPixelForValue(t) {
                    return t === null ? NaN : this.getPixelForDecimal((t - this._startValue) / this._valueRange);
                }
                getValueForPixel(t) {
                    return this._startValue + this.getDecimalForPixel(t) * this._valueRange;
                }
            }
            iN.id = 'linear';
            iN.defaults = {
                ticks: {
                    callback: tr.formatters.numeric
                }
            };
            function iH(t) {
                const e = t / (Math.pow(10, Math.floor((0, i.z)(t))));
                return e === 1;
            }
            function iW(t, e) {
                const s = Math.floor((0, i.z)(e.max));
                const n = Math.ceil(e.max / Math.pow(10, s));
                const o = [];
                let a = (0, i.B)(t.min, Math.pow(10, Math.floor((0, i.z)(e.min))));
                let r = Math.floor((0, i.z)(a));
                let l = Math.floor(a / Math.pow(10, r));
                let c = r < 0 ? Math.pow(10, Math.abs(r)) : 1;
                do {
                    o.push({
                        value: a,
                        major: iH(a)
                    });
                    ++l;
                    if (l === 10) {
                        l = 1;
                        ++r;
                        c = r >= 0 ? 1 : c;
                    }
                    a = Math.round(l * Math.pow(10, r) * c) / c;
                }while (r < s || (r === s && l < n))
                const h = (0, i.B)(t.max, a);
                o.push({
                    value: h,
                    major: iH(a)
                });
                return o;
            }
            class ij extends tP {
                constructor(t){
                    super(t);
                    this.start = undefined;
                    this.end = undefined;
                    this._startValue = undefined;
                    this._valueRange = 0;
                }
                parse(t, e) {
                    const s = iB.prototype.parse.apply(this, [
                        t,
                        e
                    ]);
                    if (s === 0) {
                        this._zero = true;
                        return undefined;
                    }
                    return (0, i.g)(s) && s > 0 ? s : null;
                }
                determineDataLimits() {
                    const { min: t , max: e  } = this.getMinMax(true);
                    this.min = (0, i.g)(t) ? Math.max(0, t) : null;
                    this.max = (0, i.g)(e) ? Math.max(0, e) : null;
                    if (this.options.beginAtZero) {
                        this._zero = true;
                    }
                    this.handleTickRangeOptions();
                }
                handleTickRangeOptions() {
                    const { minDefined: t , maxDefined: e  } = this.getUserBounds();
                    let s = this.min;
                    let n = this.max;
                    const o = (e)=>(s = t ? s : e);
                    const a = (t)=>(n = e ? n : t);
                    const r = (t, e)=>Math.pow(10, Math.floor((0, i.z)(t)) + e);
                    if (s === n) {
                        if (s <= 0) {
                            o(1);
                            a(10);
                        } else {
                            o(r(s, -1));
                            a(r(n, +1));
                        }
                    }
                    if (s <= 0) {
                        o(r(n, -1));
                    }
                    if (n <= 0) {
                        a(r(s, +1));
                    }
                    if (this._zero && this.min !== this._suggestedMin && s === r(this.min, 0)) {
                        o(r(s, -1));
                    }
                    this.min = s;
                    this.max = n;
                }
                buildTicks() {
                    const t = this.options;
                    const e = {
                        min: this._userMin,
                        max: this._userMax
                    };
                    const s = iW(e, this);
                    if (t.bounds === 'ticks') {
                        (0, i.aH)(s, this, 'value');
                    }
                    if (t.reverse) {
                        s.reverse();
                        this.start = this.max;
                        this.end = this.min;
                    } else {
                        this.start = this.min;
                        this.end = this.max;
                    }
                    return s;
                }
                getLabelForValue(t) {
                    return t === undefined ? '0' : (0, i.o)(t, this.chart.options.locale, this.options.ticks.format);
                }
                configure() {
                    const t = this.min;
                    super.configure();
                    this._startValue = (0, i.z)(t);
                    this._valueRange = (0, i.z)(this.max) - (0, i.z)(t);
                }
                getPixelForValue(t) {
                    if (t === undefined || t === 0) {
                        t = this.min;
                    }
                    if (t === null || isNaN(t)) {
                        return NaN;
                    }
                    return this.getPixelForDecimal(t === this.min ? 0 : ((0, i.z)(t) - this._startValue) / this._valueRange);
                }
                getValueForPixel(t) {
                    const e = this.getDecimalForPixel(t);
                    return Math.pow(10, this._startValue + e * this._valueRange);
                }
            }
            ij.id = 'logarithmic';
            ij.defaults = {
                ticks: {
                    callback: tr.formatters.logarithmic,
                    major: {
                        enabled: true
                    }
                }
            };
            function i$(t) {
                const e = t.ticks;
                if (e.display && t.display) {
                    const s = (0, i.K)(e.backdropPadding);
                    return (0, i.v)(e.font && e.font.size, i.d.font.size) + s.height;
                }
                return 0;
            }
            function iU(t, e, s) {
                s = (0, i.b)(s) ? s : [
                    s
                ];
                return {
                    w: (0, i.aM)(t, e.string, s),
                    h: s.length * e.lineHeight
                };
            }
            function iY(t, e, s, i, n) {
                if (t === i || t === n) {
                    return {
                        start: e - (s / 2),
                        end: e + (s / 2)
                    };
                } else if (t < i || t > n) {
                    return {
                        start: e - s,
                        end: e
                    };
                }
                return {
                    start: e,
                    end: e + s
                };
            }
            function iK(t) {
                const e = {
                    l: t.left + t._padding.left,
                    r: t.right - t._padding.right,
                    t: t.top + t._padding.top,
                    b: t.bottom - t._padding.bottom
                };
                const s = Object.assign({}, e);
                const n = [];
                const o = [];
                const a = t._pointLabels.length;
                const r = t.options.pointLabels;
                const l = r.centerPointLabels ? i.P / a : 0;
                for(let c = 0; c < a; c++){
                    const h = r.setContext(t.getPointLabelContext(c));
                    o[c] = h.padding;
                    const d = t.getPointPosition(c, t.drawingArea + o[c], l);
                    const f = (0, i.O)(h.font);
                    const u = iU(t.ctx, f, t._pointLabels[c]);
                    n[c] = u;
                    const g = (0, i.az)(t.getIndexAngle(c) + l);
                    const p = Math.round((0, i.F)(g));
                    const m = iY(p, d.x, u.w, 0, 180);
                    const b = iY(p, d.y, u.h, 90, 270);
                    iQ(s, e, g, m, b);
                }
                t.setCenterPoint(e.l - s.l, s.r - e.r, e.t - s.t, s.b - e.b);
                t._pointLabelItems = iX(t, n, o);
            }
            function iQ(t, e, s, i, n) {
                const o = Math.abs(Math.sin(s));
                const a = Math.abs(Math.cos(s));
                let r = 0;
                let l = 0;
                if (i.start < e.l) {
                    r = (e.l - i.start) / o;
                    t.l = Math.min(t.l, e.l - r);
                } else if (i.end > e.r) {
                    r = (i.end - e.r) / o;
                    t.r = Math.max(t.r, e.r + r);
                }
                if (n.start < e.t) {
                    l = (e.t - n.start) / a;
                    t.t = Math.min(t.t, e.t - l);
                } else if (n.end > e.b) {
                    l = (n.end - e.b) / a;
                    t.b = Math.max(t.b, e.b + l);
                }
            }
            function iX(t, e, s) {
                const n = [];
                const o = t._pointLabels.length;
                const a = t.options;
                const r = i$(a) / 2;
                const l = t.drawingArea;
                const c = a.pointLabels.centerPointLabels ? i.P / o : 0;
                for(let h = 0; h < o; h++){
                    const d = t.getPointPosition(h, l + r + s[h], c);
                    const f = Math.round((0, i.F)((0, i.az)(d.angle + i.H)));
                    const u = e[h];
                    const g = iJ(d.y, u.h, f);
                    const p = iG(f);
                    const m = iq(d.x, u.w, p);
                    n.push({
                        x: d.x,
                        y: g,
                        textAlign: p,
                        left: m,
                        top: g,
                        right: m + u.w,
                        bottom: g + u.h
                    });
                }
                return n;
            }
            function iG(t) {
                if (t === 0 || t === 180) {
                    return 'center';
                } else if (t < 180) {
                    return 'left';
                }
                return 'right';
            }
            function iq(t, e, s) {
                if (s === 'right') {
                    t -= e;
                } else if (s === 'center') {
                    t -= (e / 2);
                }
                return t;
            }
            function iJ(t, e, s) {
                if (s === 90 || s === 270) {
                    t -= (e / 2);
                } else if (s > 270 || s < 90) {
                    t -= e;
                }
                return t;
            }
            function iZ(t, e) {
                const { ctx: s , options: { pointLabels: n  }  } = t;
                for(let o = e - 1; o >= 0; o--){
                    const a = n.setContext(t.getPointLabelContext(o));
                    const r = (0, i.O)(a.font);
                    const { x: l , y: c , textAlign: h , left: d , top: f , right: u , bottom: g  } = t._pointLabelItems[o];
                    const { backdropColor: p  } = a;
                    if (!(0, i.k)(p)) {
                        const m = (0, i.ax)(a.borderRadius);
                        const b = (0, i.K)(a.backdropPadding);
                        s.fillStyle = p;
                        const x = d - b.left;
                        const _ = f - b.top;
                        const y = u - d + b.width;
                        const v = g - f + b.height;
                        if (Object.values(m).some((t)=>t !== 0)) {
                            s.beginPath();
                            (0, i.av)(s, {
                                x: x,
                                y: _,
                                w: y,
                                h: v,
                                radius: m
                            });
                            s.fill();
                        } else {
                            s.fillRect(x, _, y, v);
                        }
                    }
                    (0, i.M)(s, t._pointLabels[o], l, c + (r.lineHeight / 2), r, {
                        color: a.color,
                        textAlign: h,
                        textBaseline: 'middle'
                    });
                }
            }
            function i0(t, e, s, n) {
                const { ctx: o  } = t;
                if (s) {
                    o.arc(t.xCenter, t.yCenter, e, 0, i.T);
                } else {
                    let a = t.getPointPosition(0, e);
                    o.moveTo(a.x, a.y);
                    for(let r = 1; r < n; r++){
                        a = t.getPointPosition(r, e);
                        o.lineTo(a.x, a.y);
                    }
                }
            }
            function i1(t, e, s, i) {
                const n = t.ctx;
                const o = e.circular;
                const { color: a , lineWidth: r  } = e;
                if ((!o && !i) || !a || !r || s < 0) {
                    return;
                }
                n.save();
                n.strokeStyle = a;
                n.lineWidth = r;
                n.setLineDash(e.borderDash);
                n.lineDashOffset = e.borderDashOffset;
                n.beginPath();
                i0(t, s, o, i);
                n.closePath();
                n.stroke();
                n.restore();
            }
            function i2(t, e, s) {
                return (0, i.h)(t, {
                    label: s,
                    index: e,
                    type: 'pointLabel'
                });
            }
            class i5 extends iB {
                constructor(t){
                    super(t);
                    this.xCenter = undefined;
                    this.yCenter = undefined;
                    this.drawingArea = undefined;
                    this._pointLabels = [];
                    this._pointLabelItems = [];
                }
                setDimensions() {
                    const t = this._padding = (0, i.K)(i$(this.options) / 2);
                    const e = this.width = this.maxWidth - t.width;
                    const s = this.height = this.maxHeight - t.height;
                    this.xCenter = Math.floor(this.left + e / 2 + t.left);
                    this.yCenter = Math.floor(this.top + s / 2 + t.top);
                    this.drawingArea = Math.floor(Math.min(e, s) / 2);
                }
                determineDataLimits() {
                    const { min: t , max: e  } = this.getMinMax(false);
                    this.min = (0, i.g)(t) && !isNaN(t) ? t : 0;
                    this.max = (0, i.g)(e) && !isNaN(e) ? e : 0;
                    this.handleTickRangeOptions();
                }
                computeTickLimit() {
                    return Math.ceil(this.drawingArea / i$(this.options));
                }
                generateTickLabels(t) {
                    iB.prototype.generateTickLabels.call(this, t);
                    this._pointLabels = this.getLabels().map((t, e)=>{
                        const s = (0, i.C)(this.options.pointLabels.callback, [
                            t,
                            e
                        ], this);
                        return s || s === 0 ? s : '';
                    }).filter((t, e)=>this.chart.getDataVisibility(e));
                }
                fit() {
                    const t = this.options;
                    if (t.display && t.pointLabels.display) {
                        iK(this);
                    } else {
                        this.setCenterPoint(0, 0, 0, 0);
                    }
                }
                setCenterPoint(t, e, s, i) {
                    this.xCenter += Math.floor((t - e) / 2);
                    this.yCenter += Math.floor((s - i) / 2);
                    this.drawingArea -= Math.min(this.drawingArea / 2, Math.max(t, e, s, i));
                }
                getIndexAngle(t) {
                    const e = i.T / (this._pointLabels.length || 1);
                    const s = this.options.startAngle || 0;
                    return (0, i.az)(t * e + (0, i.t)(s));
                }
                getDistanceFromCenterForValue(t) {
                    if ((0, i.k)(t)) {
                        return NaN;
                    }
                    const e = this.drawingArea / (this.max - this.min);
                    if (this.options.reverse) {
                        return (this.max - t) * e;
                    }
                    return (t - this.min) * e;
                }
                getValueForDistanceFromCenter(t) {
                    if ((0, i.k)(t)) {
                        return NaN;
                    }
                    const e = t / (this.drawingArea / (this.max - this.min));
                    return this.options.reverse ? this.max - e : this.min + e;
                }
                getPointLabelContext(t) {
                    const e = this._pointLabels || [];
                    if (t >= 0 && t < e.length) {
                        const s = e[t];
                        return i2(this.getContext(), t, s);
                    }
                }
                getPointPosition(t, e, s = 0) {
                    const n = this.getIndexAngle(t) - i.H + s;
                    return {
                        x: Math.cos(n) * e + this.xCenter,
                        y: Math.sin(n) * e + this.yCenter,
                        angle: n
                    };
                }
                getPointPositionForValue(t, e) {
                    return this.getPointPosition(t, this.getDistanceFromCenterForValue(e));
                }
                getBasePosition(t) {
                    return this.getPointPositionForValue(t || 0, this.getBaseValue());
                }
                getPointLabelPosition(t) {
                    const { left: e , top: s , right: i , bottom: n  } = this._pointLabelItems[t];
                    return {
                        left: e,
                        top: s,
                        right: i,
                        bottom: n
                    };
                }
                drawBackground() {
                    const { backgroundColor: t , grid: { circular: e  }  } = this.options;
                    if (t) {
                        const s = this.ctx;
                        s.save();
                        s.beginPath();
                        i0(this, this.getDistanceFromCenterForValue(this._endValue), e, this._pointLabels.length);
                        s.closePath();
                        s.fillStyle = t;
                        s.fill();
                        s.restore();
                    }
                }
                drawGrid() {
                    const t = this.ctx;
                    const e = this.options;
                    const { angleLines: s , grid: i  } = e;
                    const n = this._pointLabels.length;
                    let o, a, r;
                    if (e.pointLabels.display) {
                        iZ(this, n);
                    }
                    if (i.display) {
                        this.ticks.forEach((t, e)=>{
                            if (e !== 0) {
                                a = this.getDistanceFromCenterForValue(t.value);
                                const s = i.setContext(this.getContext(e - 1));
                                i1(this, s, a, n);
                            }
                        });
                    }
                    if (s.display) {
                        t.save();
                        for(o = n - 1; o >= 0; o--){
                            const l = s.setContext(this.getPointLabelContext(o));
                            const { color: c , lineWidth: h  } = l;
                            if (!h || !c) {
                                continue;
                            }
                            t.lineWidth = h;
                            t.strokeStyle = c;
                            t.setLineDash(l.borderDash);
                            t.lineDashOffset = l.borderDashOffset;
                            a = this.getDistanceFromCenterForValue(e.ticks.reverse ? this.min : this.max);
                            r = this.getPointPosition(o, a);
                            t.beginPath();
                            t.moveTo(this.xCenter, this.yCenter);
                            t.lineTo(r.x, r.y);
                            t.stroke();
                        }
                        t.restore();
                    }
                }
                drawBorder() {}
                drawLabels() {
                    const t = this.ctx;
                    const e = this.options;
                    const s = e.ticks;
                    if (!s.display) {
                        return;
                    }
                    const n = this.getIndexAngle(0);
                    let o, a;
                    t.save();
                    t.translate(this.xCenter, this.yCenter);
                    t.rotate(n);
                    t.textAlign = 'center';
                    t.textBaseline = 'middle';
                    this.ticks.forEach((n, r)=>{
                        if (r === 0 && !e.reverse) {
                            return;
                        }
                        const l = s.setContext(this.getContext(r));
                        const c = (0, i.O)(l.font);
                        o = this.getDistanceFromCenterForValue(this.ticks[r].value);
                        if (l.showLabelBackdrop) {
                            t.font = c.string;
                            a = t.measureText(n.label).width;
                            t.fillStyle = l.backdropColor;
                            const h = (0, i.K)(l.backdropPadding);
                            t.fillRect(-a / 2 - h.left, -o - c.size / 2 - h.top, a + h.width, c.size + h.height);
                        }
                        (0, i.M)(t, n.label, 0, -o, c, {
                            color: l.color
                        });
                    });
                    t.restore();
                }
                drawTitle() {}
            }
            i5.id = 'radialLinear';
            i5.defaults = {
                display: true,
                animate: true,
                position: 'chartArea',
                angleLines: {
                    display: true,
                    lineWidth: 1,
                    borderDash: [],
                    borderDashOffset: 0.0
                },
                grid: {
                    circular: false
                },
                startAngle: 0,
                ticks: {
                    showLabelBackdrop: true,
                    callback: tr.formatters.numeric
                },
                pointLabels: {
                    backdropColor: undefined,
                    backdropPadding: 2,
                    display: true,
                    font: {
                        size: 10
                    },
                    callback (t) {
                        return t;
                    },
                    padding: 5,
                    centerPointLabels: false
                }
            };
            i5.defaultRoutes = {
                'angleLines.color': 'borderColor',
                'pointLabels.color': 'color',
                'ticks.color': 'color'
            };
            i5.descriptors = {
                angleLines: {
                    _fallback: 'grid'
                }
            };
            const i3 = {
                millisecond: {
                    common: true,
                    size: 1,
                    steps: 1000
                },
                second: {
                    common: true,
                    size: 1000,
                    steps: 60
                },
                minute: {
                    common: true,
                    size: 60000,
                    steps: 60
                },
                hour: {
                    common: true,
                    size: 3600000,
                    steps: 24
                },
                day: {
                    common: true,
                    size: 86400000,
                    steps: 30
                },
                week: {
                    common: false,
                    size: 604800000,
                    steps: 4
                },
                month: {
                    common: true,
                    size: 2.628e9,
                    steps: 12
                },
                quarter: {
                    common: false,
                    size: 7.884e9,
                    steps: 4
                },
                year: {
                    common: true,
                    size: 3.154e10
                }
            };
            const i6 = (Object.keys(i3));
            function i4(t, e) {
                return t - e;
            }
            function i7(t, e) {
                if ((0, i.k)(e)) {
                    return null;
                }
                const s = t._adapter;
                const { parser: n , round: o , isoWeekday: a  } = t._parseOpts;
                let r = e;
                if (typeof n === 'function') {
                    r = n(r);
                }
                if (!(0, i.g)(r)) {
                    r = typeof n === 'string' ? s.parse(r, n) : s.parse(r);
                }
                if (r === null) {
                    return null;
                }
                if (o) {
                    r = o === 'week' && ((0, i.x)(a) || a === true) ? s.startOf(r, 'isoWeek', a) : s.startOf(r, o);
                }
                return +r;
            }
            function i8(t, e, s, i) {
                const n = i6.length;
                for(let o = i6.indexOf(t); o < n - 1; ++o){
                    const a = i3[i6[o]];
                    const r = a.steps ? a.steps : Number.MAX_SAFE_INTEGER;
                    if (a.common && Math.ceil((s - e) / (r * a.size)) <= i) {
                        return i6[o];
                    }
                }
                return i6[n - 1];
            }
            function i9(t, e, s, i, n) {
                for(let o = i6.length - 1; o >= i6.indexOf(s); o--){
                    const a = i6[o];
                    if (i3[a].common && t._adapter.diff(n, i, a) >= e - 1) {
                        return a;
                    }
                }
                return i6[s ? i6.indexOf(s) : 0];
            }
            function nt(t) {
                for(let e = i6.indexOf(t) + 1, s = i6.length; e < s; ++e){
                    if (i3[i6[e]].common) {
                        return i6[e];
                    }
                }
            }
            function ne(t, e, s) {
                if (!s) {
                    t[e] = true;
                } else if (s.length) {
                    const { lo: n , hi: o  } = (0, i.aO)(s, e);
                    const a = s[n] >= e ? s[n] : s[o];
                    t[a] = true;
                }
            }
            function ns(t, e, s, i) {
                const n = t._adapter;
                const o = +n.startOf(e[0].value, i);
                const a = e[e.length - 1].value;
                let r, l;
                for(r = o; r <= a; r = +n.add(r, 1, i)){
                    l = s[r];
                    if (l >= 0) {
                        e[l].major = true;
                    }
                }
                return e;
            }
            function ni(t, e, s) {
                const i = [];
                const n = {};
                const o = e.length;
                let a, r;
                for(a = 0; a < o; ++a){
                    r = e[a];
                    n[r] = a;
                    i.push({
                        value: r,
                        major: false
                    });
                }
                return (o === 0 || !s) ? i : ns(t, i, n, s);
            }
            class nn extends tP {
                constructor(t){
                    super(t);
                    this._cache = {
                        data: [],
                        labels: [],
                        all: []
                    };
                    this._unit = 'day';
                    this._majorUnit = undefined;
                    this._offsets = {};
                    this._normalized = false;
                    this._parseOpts = undefined;
                }
                init(t, e) {
                    const s = t.time || (t.time = {});
                    const n = this._adapter = new tI._date(t.adapters.date);
                    n.init(e);
                    (0, i.ac)(s.displayFormats, n.formats());
                    this._parseOpts = {
                        parser: s.parser,
                        round: s.round,
                        isoWeekday: s.isoWeekday
                    };
                    super.init(t);
                    this._normalized = e.normalized;
                }
                parse(t, e) {
                    if (t === undefined) {
                        return null;
                    }
                    return i7(this, t);
                }
                beforeLayout() {
                    super.beforeLayout();
                    this._cache = {
                        data: [],
                        labels: [],
                        all: []
                    };
                }
                determineDataLimits() {
                    const t = this.options;
                    const e = this._adapter;
                    const s = t.time.unit || 'day';
                    let { min: n , max: o , minDefined: a , maxDefined: r  } = this.getUserBounds();
                    function l(t) {
                        if (!a && !isNaN(t.min)) {
                            n = Math.min(n, t.min);
                        }
                        if (!r && !isNaN(t.max)) {
                            o = Math.max(o, t.max);
                        }
                    }
                    if (!a || !r) {
                        l(this._getLabelBounds());
                        if (t.bounds !== 'ticks' || t.ticks.source !== 'labels') {
                            l(this.getMinMax(false));
                        }
                    }
                    n = (0, i.g)(n) && !isNaN(n) ? n : +e.startOf(Date.now(), s);
                    o = (0, i.g)(o) && !isNaN(o) ? o : +e.endOf(Date.now(), s) + 1;
                    this.min = Math.min(n, o - 1);
                    this.max = Math.max(n + 1, o);
                }
                _getLabelBounds() {
                    const t = this.getLabelTimestamps();
                    let e = Number.POSITIVE_INFINITY;
                    let s = Number.NEGATIVE_INFINITY;
                    if (t.length) {
                        e = t[0];
                        s = t[t.length - 1];
                    }
                    return {
                        min: e,
                        max: s
                    };
                }
                buildTicks() {
                    const t = this.options;
                    const e = t.time;
                    const s = t.ticks;
                    const n = s.source === 'labels' ? this.getLabelTimestamps() : this._generate();
                    if (t.bounds === 'ticks' && n.length) {
                        this.min = this._userMin || n[0];
                        this.max = this._userMax || n[n.length - 1];
                    }
                    const o = this.min;
                    const a = this.max;
                    const r = (0, i.aN)(n, o, a);
                    this._unit = e.unit || (s.autoSkip ? i8(e.minUnit, this.min, this.max, this._getLabelCapacity(o)) : i9(this, r.length, e.minUnit, this.min, this.max));
                    this._majorUnit = !s.major.enabled || this._unit === 'year' ? undefined : nt(this._unit);
                    this.initOffsets(n);
                    if (t.reverse) {
                        r.reverse();
                    }
                    return ni(this, r, this._majorUnit);
                }
                afterAutoSkip() {
                    if (this.options.offsetAfterAutoskip) {
                        this.initOffsets(this.ticks.map((t)=>+t.value));
                    }
                }
                initOffsets(t) {
                    let e = 0;
                    let s = 0;
                    let n, o;
                    if (this.options.offset && t.length) {
                        n = this.getDecimalForValue(t[0]);
                        if (t.length === 1) {
                            e = 1 - n;
                        } else {
                            e = (this.getDecimalForValue(t[1]) - n) / 2;
                        }
                        o = this.getDecimalForValue(t[t.length - 1]);
                        if (t.length === 1) {
                            s = o;
                        } else {
                            s = (o - this.getDecimalForValue(t[t.length - 2])) / 2;
                        }
                    }
                    const a = t.length < 3 ? 0.5 : 0.25;
                    e = (0, i.E)(e, 0, a);
                    s = (0, i.E)(s, 0, a);
                    this._offsets = {
                        start: e,
                        end: s,
                        factor: 1 / (e + 1 + s)
                    };
                }
                _generate() {
                    const t = this._adapter;
                    const e = this.min;
                    const s = this.max;
                    const n = this.options;
                    const o = n.time;
                    const a = o.unit || i8(o.minUnit, e, s, this._getLabelCapacity(e));
                    const r = (0, i.v)(o.stepSize, 1);
                    const l = a === 'week' ? o.isoWeekday : false;
                    const c = (0, i.x)(l) || l === true;
                    const h = {};
                    let d = e;
                    let f, u;
                    if (c) {
                        d = +t.startOf(d, 'isoWeek', l);
                    }
                    d = +t.startOf(d, c ? 'day' : a);
                    if (t.diff(s, e, a) > 100000 * r) {
                        throw new Error(e + ' and ' + s + ' are too far apart with stepSize of ' + r + ' ' + a);
                    }
                    const g = n.ticks.source === 'data' && this.getDataTimestamps();
                    for(f = d, u = 0; f < s; f = +t.add(f, r, a), u++){
                        ne(h, f, g);
                    }
                    if (f === s || n.bounds === 'ticks' || u === 1) {
                        ne(h, f, g);
                    }
                    return Object.keys(h).sort((t, e)=>t - e).map((t)=>+t);
                }
                getLabelForValue(t) {
                    const e = this._adapter;
                    const s = this.options.time;
                    if (s.tooltipFormat) {
                        return e.format(t, s.tooltipFormat);
                    }
                    return e.format(t, s.displayFormats.datetime);
                }
                _tickFormatFunction(t, e, s, n) {
                    const o = this.options;
                    const a = o.time.displayFormats;
                    const r = this._unit;
                    const l = this._majorUnit;
                    const c = r && a[r];
                    const h = l && a[l];
                    const d = s[e];
                    const f = l && h && d && d.major;
                    const u = this._adapter.format(t, n || (f ? h : c));
                    const g = o.ticks.callback;
                    return g ? (0, i.C)(g, [
                        u,
                        e,
                        s
                    ], this) : u;
                }
                generateTickLabels(t) {
                    let e, s, i;
                    for(e = 0, s = t.length; e < s; ++e){
                        i = t[e];
                        i.label = this._tickFormatFunction(i.value, e, t);
                    }
                }
                getDecimalForValue(t) {
                    return t === null ? NaN : (t - this.min) / (this.max - this.min);
                }
                getPixelForValue(t) {
                    const e = this._offsets;
                    const s = this.getDecimalForValue(t);
                    return this.getPixelForDecimal((e.start + s) * e.factor);
                }
                getValueForPixel(t) {
                    const e = this._offsets;
                    const s = this.getDecimalForPixel(t) / e.factor - e.end;
                    return this.min + s * (this.max - this.min);
                }
                _getLabelSize(t) {
                    const e = this.options.ticks;
                    const s = this.ctx.measureText(t).width;
                    const n = (0, i.t)(this.isHorizontal() ? e.maxRotation : e.minRotation);
                    const o = Math.cos(n);
                    const a = Math.sin(n);
                    const r = this._resolveTickFontOptions(0).size;
                    return {
                        w: (s * o) + (r * a),
                        h: (s * a) + (r * o)
                    };
                }
                _getLabelCapacity(t) {
                    const e = this.options.time;
                    const s = e.displayFormats;
                    const i = s[e.unit] || s.millisecond;
                    const n = this._tickFormatFunction(t, 0, ni(this, [
                        t
                    ], this._majorUnit), i);
                    const o = this._getLabelSize(n);
                    const a = Math.floor(this.isHorizontal() ? this.width / o.w : this.height / o.h) - 1;
                    return a > 0 ? a : 1;
                }
                getDataTimestamps() {
                    let t = this._cache.data || [];
                    let e, s;
                    if (t.length) {
                        return t;
                    }
                    const i = this.getMatchingVisibleMetas();
                    if (this._normalized && i.length) {
                        return (this._cache.data = i[0].controller.getAllParsedValues(this));
                    }
                    for(e = 0, s = i.length; e < s; ++e){
                        t = t.concat(i[e].controller.getAllParsedValues(this));
                    }
                    return (this._cache.data = this.normalize(t));
                }
                getLabelTimestamps() {
                    const t = this._cache.labels || [];
                    let e, s;
                    if (t.length) {
                        return t;
                    }
                    const i = this.getLabels();
                    for(e = 0, s = i.length; e < s; ++e){
                        t.push(i7(this, i[e]));
                    }
                    return (this._cache.labels = this._normalized ? t : this.normalize(t));
                }
                normalize(t) {
                    return (0, i._)(t.sort(i4));
                }
            }
            nn.id = 'time';
            nn.defaults = {
                bounds: 'data',
                adapters: {},
                time: {
                    parser: false,
                    unit: false,
                    round: false,
                    isoWeekday: false,
                    minUnit: 'millisecond',
                    displayFormats: {}
                },
                ticks: {
                    source: 'auto',
                    major: {
                        enabled: false
                    }
                }
            };
            function no(t, e, s) {
                let n = 0;
                let o = t.length - 1;
                let a, r, l, c;
                if (s) {
                    if (e >= t[n].pos && e <= t[o].pos) {
                        ({ lo: n , hi: o  } = (0, i.Z)(t, 'pos', e));
                    }
                    ({ pos: a , time: l  } = t[n]);
                    ({ pos: r , time: c  } = t[o]);
                } else {
                    if (e >= t[n].time && e <= t[o].time) {
                        ({ lo: n , hi: o  } = (0, i.Z)(t, 'time', e));
                    }
                    ({ time: a , pos: l  } = t[n]);
                    ({ time: r , pos: c  } = t[o]);
                }
                const h = r - a;
                return h ? l + (c - l) * (e - a) / h : l;
            }
            class na extends nn {
                constructor(t){
                    super(t);
                    this._table = [];
                    this._minPos = undefined;
                    this._tableRange = undefined;
                }
                initOffsets() {
                    const t = this._getTimestampsForTable();
                    const e = this._table = this.buildLookupTable(t);
                    this._minPos = no(e, this.min);
                    this._tableRange = no(e, this.max) - this._minPos;
                    super.initOffsets(t);
                }
                buildLookupTable(t) {
                    const { min: e , max: s  } = this;
                    const i = [];
                    const n = [];
                    let o, a, r, l, c;
                    for(o = 0, a = t.length; o < a; ++o){
                        l = t[o];
                        if (l >= e && l <= s) {
                            i.push(l);
                        }
                    }
                    if (i.length < 2) {
                        return [
                            {
                                time: e,
                                pos: 0
                            },
                            {
                                time: s,
                                pos: 1
                            }
                        ];
                    }
                    for(o = 0, a = i.length; o < a; ++o){
                        c = i[o + 1];
                        r = i[o - 1];
                        l = i[o];
                        if (Math.round((c + r) / 2) !== l) {
                            n.push({
                                time: l,
                                pos: o / (a - 1)
                            });
                        }
                    }
                    return n;
                }
                _getTimestampsForTable() {
                    let t = this._cache.all || [];
                    if (t.length) {
                        return t;
                    }
                    const e = this.getDataTimestamps();
                    const s = this.getLabelTimestamps();
                    if (e.length && s.length) {
                        t = this.normalize(e.concat(s));
                    } else {
                        t = e.length ? e : s;
                    }
                    t = this._cache.all = t;
                    return t;
                }
                getDecimalForValue(t) {
                    return (no(this._table, t) - this._minPos) / this._tableRange;
                }
                getValueForPixel(t) {
                    const e = this._offsets;
                    const s = this.getDecimalForPixel(t) / e.factor - e.end;
                    return no(this._table, s * this._tableRange + this._minPos, true);
                }
            }
            na.id = 'timeseries';
            na.defaults = nn.defaults;
            var nr = Object.freeze({
                __proto__: null,
                CategoryScale: iF,
                LinearScale: iN,
                LogarithmicScale: ij,
                RadialLinearScale: i5,
                TimeScale: nn,
                TimeSeriesScale: na
            });
            const nl = [
                tz,
                sO,
                iA,
                nr
            ];
        })
    }
]);
