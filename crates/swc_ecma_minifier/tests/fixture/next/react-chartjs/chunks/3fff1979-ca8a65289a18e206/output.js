"use strict";
(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
    [
        757
    ],
    {
        6775: function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {
            __webpack_require__.d(__webpack_exports__, {
                kL: function() {
                    return Chart;
                },
                zX: function() {
                    return registerables;
                }
            });
            var _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2454), animator = new class {
                constructor(){
                    this._request = null, this._charts = new Map(), this._running = !1, this._lastDate = void 0;
                }
                _notify(chart, anims, date, type) {
                    const callbacks = anims.listeners[type], numSteps = anims.duration;
                    callbacks.forEach((fn)=>fn({
                            chart,
                            initial: anims.initial,
                            numSteps,
                            currentStep: Math.min(date - anims.start, numSteps)
                        }));
                }
                _refresh() {
                    this._request || (this._running = !0, this._request = _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.r.call(window, ()=>{
                        this._update(), this._request = null, this._running && this._refresh();
                    }));
                }
                _update(date = Date.now()) {
                    let remaining = 0;
                    this._charts.forEach((anims, chart)=>{
                        let item;
                        if (!anims.running || !anims.items.length) return;
                        const items = anims.items;
                        let i = items.length - 1, draw = !1;
                        for(; i >= 0; --i)(item = items[i])._active ? (item._total > anims.duration && (anims.duration = item._total), item.tick(date), draw = !0) : (items[i] = items[items.length - 1], items.pop());
                        draw && (chart.draw(), this._notify(chart, anims, date, 'progress')), items.length || (anims.running = !1, this._notify(chart, anims, date, 'complete'), anims.initial = !1), remaining += items.length;
                    }), this._lastDate = date, 0 === remaining && (this._running = !1);
                }
                _getAnims(chart) {
                    const charts = this._charts;
                    let anims = charts.get(chart);
                    return anims || (anims = {
                        running: !1,
                        initial: !0,
                        items: [],
                        listeners: {
                            complete: [],
                            progress: []
                        }
                    }, charts.set(chart, anims)), anims;
                }
                listen(chart, event, cb) {
                    this._getAnims(chart).listeners[event].push(cb);
                }
                add(chart, items) {
                    items && items.length && this._getAnims(chart).items.push(...items);
                }
                has(chart) {
                    return this._getAnims(chart).items.length > 0;
                }
                start(chart) {
                    const anims = this._charts.get(chart);
                    anims && (anims.running = !0, anims.start = Date.now(), anims.duration = anims.items.reduce((acc, cur)=>Math.max(acc, cur._duration), 0), this._refresh());
                }
                running(chart) {
                    if (!this._running) return !1;
                    const anims = this._charts.get(chart);
                    return !!anims && !!anims.running && !!anims.items.length;
                }
                stop(chart) {
                    const anims = this._charts.get(chart);
                    if (!anims || !anims.items.length) return;
                    const items = anims.items;
                    let i = items.length - 1;
                    for(; i >= 0; --i)items[i].cancel();
                    anims.items = [], this._notify(chart, anims, Date.now(), 'complete');
                }
                remove(chart) {
                    return this._charts.delete(chart);
                }
            }();
            const transparent = 'transparent', interpolators = {
                boolean: (from, to, factor)=>factor > 0.5 ? to : from,
                color (from, to, factor) {
                    const c0 = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.c)(from || transparent), c1 = c0.valid && (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.c)(to || transparent);
                    return c1 && c1.valid ? c1.mix(c0, factor).hexString() : to;
                },
                number: (from, to, factor)=>from + (to - from) * factor
            };
            class Animation {
                constructor(cfg, target, prop, to){
                    const currentValue = target[prop];
                    to = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.a)([
                        cfg.to,
                        to,
                        currentValue,
                        cfg.from
                    ]);
                    const from = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.a)([
                        cfg.from,
                        currentValue,
                        to
                    ]);
                    this._active = !0, this._fn = cfg.fn || interpolators[cfg.type || typeof from], this._easing = _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.e[cfg.easing] || _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.e.linear, this._start = Math.floor(Date.now() + (cfg.delay || 0)), this._duration = this._total = Math.floor(cfg.duration), this._loop = !!cfg.loop, this._target = target, this._prop = prop, this._from = from, this._to = to, this._promises = void 0;
                }
                active() {
                    return this._active;
                }
                update(cfg, to, date) {
                    if (this._active) {
                        this._notify(!1);
                        const currentValue = this._target[this._prop], elapsed = date - this._start, remain = this._duration - elapsed;
                        this._start = date, this._duration = Math.floor(Math.max(remain, cfg.duration)), this._total += elapsed, this._loop = !!cfg.loop, this._to = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.a)([
                            cfg.to,
                            to,
                            currentValue,
                            cfg.from
                        ]), this._from = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.a)([
                            cfg.from,
                            currentValue,
                            to
                        ]);
                    }
                }
                cancel() {
                    this._active && (this.tick(Date.now()), this._active = !1, this._notify(!1));
                }
                tick(date) {
                    let factor;
                    const elapsed = date - this._start, duration = this._duration, prop = this._prop, from = this._from, loop = this._loop, to = this._to;
                    if (this._active = from !== to && (loop || elapsed < duration), !this._active) {
                        this._target[prop] = to, this._notify(!0);
                        return;
                    }
                    if (elapsed < 0) {
                        this._target[prop] = from;
                        return;
                    }
                    factor = elapsed / duration % 2, factor = loop && factor > 1 ? 2 - factor : factor, factor = this._easing(Math.min(1, Math.max(0, factor))), this._target[prop] = this._fn(from, to, factor);
                }
                wait() {
                    const promises = this._promises || (this._promises = []);
                    return new Promise((res, rej)=>{
                        promises.push({
                            res,
                            rej
                        });
                    });
                }
                _notify(resolved) {
                    const method = resolved ? 'res' : 'rej', promises = this._promises || [];
                    for(let i = 0; i < promises.length; i++)promises[i][method]();
                }
            }
            _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.d.set('animation', {
                delay: void 0,
                duration: 1000,
                easing: 'easeOutQuart',
                fn: void 0,
                from: void 0,
                loop: void 0,
                to: void 0,
                type: void 0
            });
            const animationOptions = Object.keys(_chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.d.animation);
            _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.d.describe('animation', {
                _fallback: !1,
                _indexable: !1,
                _scriptable: (name)=>'onProgress' !== name && 'onComplete' !== name && 'fn' !== name
            }), _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.d.set('animations', {
                colors: {
                    type: 'color',
                    properties: [
                        'color',
                        'borderColor',
                        'backgroundColor'
                    ]
                },
                numbers: {
                    type: 'number',
                    properties: [
                        'x',
                        'y',
                        'borderWidth',
                        'radius',
                        'tension'
                    ]
                }
            }), _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.d.describe('animations', {
                _fallback: 'animation'
            }), _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.d.set('transitions', {
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
                            fn: (v)=>0 | v
                        }
                    }
                }
            });
            class Animations {
                constructor(chart, config){
                    this._chart = chart, this._properties = new Map(), this.configure(config);
                }
                configure(config) {
                    if (!(0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.i)(config)) return;
                    const animatedProps = this._properties;
                    Object.getOwnPropertyNames(config).forEach((key)=>{
                        const cfg = config[key];
                        if (!(0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.i)(cfg)) return;
                        const resolved = {};
                        for (const option of animationOptions)resolved[option] = cfg[option];
                        ((0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.b)(cfg.properties) && cfg.properties || [
                            key
                        ]).forEach((prop)=>{
                            prop !== key && animatedProps.has(prop) || animatedProps.set(prop, resolved);
                        });
                    });
                }
                _animateOptions(target, values) {
                    const newOptions = values.options, options = function(target, newOptions) {
                        if (!newOptions) return;
                        let options = target.options;
                        if (!options) {
                            target.options = newOptions;
                            return;
                        }
                        return options.$shared && (target.options = options = Object.assign({}, options, {
                            $shared: !1,
                            $animations: {}
                        })), options;
                    }(target, newOptions);
                    if (!options) return [];
                    const animations = this._createAnimations(options, newOptions);
                    return newOptions.$shared && (function(animations, properties) {
                        const running = [], keys = Object.keys(properties);
                        for(let i = 0; i < keys.length; i++){
                            const anim = animations[keys[i]];
                            anim && anim.active() && running.push(anim.wait());
                        }
                        return Promise.all(running);
                    })(target.options.$animations, newOptions).then(()=>{
                        target.options = newOptions;
                    }, ()=>{}), animations;
                }
                _createAnimations(target, values) {
                    let i;
                    const animatedProps = this._properties, animations = [], running = target.$animations || (target.$animations = {}), props = Object.keys(values), date = Date.now();
                    for(i = props.length - 1; i >= 0; --i){
                        const prop = props[i];
                        if ('$' === prop.charAt(0)) continue;
                        if ('options' === prop) {
                            animations.push(...this._animateOptions(target, values));
                            continue;
                        }
                        const value = values[prop];
                        let animation = running[prop];
                        const cfg = animatedProps.get(prop);
                        if (animation) {
                            if (cfg && animation.active()) {
                                animation.update(cfg, value, date);
                                continue;
                            }
                            animation.cancel();
                        }
                        if (!cfg || !cfg.duration) {
                            target[prop] = value;
                            continue;
                        }
                        running[prop] = animation = new Animation(cfg, target, prop, value), animations.push(animation);
                    }
                    return animations;
                }
                update(target, values) {
                    if (0 === this._properties.size) {
                        Object.assign(target, values);
                        return;
                    }
                    const animations = this._createAnimations(target, values);
                    if (animations.length) return animator.add(this._chart, animations), !0;
                }
            }
            function scaleClip(scale, allowedOverflow) {
                const opts = scale && scale.options || {}, reverse = opts.reverse, min = void 0 === opts.min ? allowedOverflow : 0, max = void 0 === opts.max ? allowedOverflow : 0;
                return {
                    start: reverse ? max : min,
                    end: reverse ? min : max
                };
            }
            function getSortedDatasetIndices(chart, filterVisible) {
                let i, ilen;
                const keys = [], metasets = chart._getSortedDatasetMetas(filterVisible);
                for(i = 0, ilen = metasets.length; i < ilen; ++i)keys.push(metasets[i].index);
                return keys;
            }
            function applyStack(stack, value, dsIndex, options = {}) {
                let i, ilen, datasetIndex, otherValue;
                const keys = stack.keys, singleMode = 'single' === options.mode;
                if (null !== value) {
                    for(i = 0, ilen = keys.length; i < ilen; ++i){
                        if ((datasetIndex = +keys[i]) === dsIndex) {
                            if (options.all) continue;
                            break;
                        }
                        otherValue = stack.values[datasetIndex], (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.g)(otherValue) && (singleMode || 0 === value || (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.s)(value) === (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.s)(otherValue)) && (value += otherValue);
                    }
                    return value;
                }
            }
            function isStacked(scale, meta) {
                const stacked = scale && scale.options.stacked;
                return stacked || void 0 === stacked && void 0 !== meta.stack;
            }
            function getOrCreateStack(stacks, stackKey, indexValue) {
                const subStack = stacks[stackKey] || (stacks[stackKey] = {});
                return subStack[indexValue] || (subStack[indexValue] = {});
            }
            function getLastIndexInStack(stack, vScale, positive, type) {
                for (const meta of vScale.getMatchingVisibleMetas(type).reverse()){
                    const value = stack[meta.index];
                    if (positive && value > 0 || !positive && value < 0) return meta.index;
                }
                return null;
            }
            function updateStacks(controller, parsed) {
                let stack;
                const { chart , _cachedMeta: meta  } = controller, stacks = chart._stacks || (chart._stacks = {}), { iScale , vScale , index: datasetIndex  } = meta, iAxis = iScale.axis, vAxis = vScale.axis, key = `${iScale.id}.${vScale.id}.${meta.stack || meta.type}`, ilen = parsed.length;
                for(let i = 0; i < ilen; ++i){
                    const item = parsed[i], { [iAxis]: index , [vAxis]: value  } = item, itemStacks = item._stacks || (item._stacks = {});
                    (stack = itemStacks[vAxis] = getOrCreateStack(stacks, key, index))[datasetIndex] = value, stack._top = getLastIndexInStack(stack, vScale, !0, meta.type), stack._bottom = getLastIndexInStack(stack, vScale, !1, meta.type);
                }
            }
            function getFirstScaleId(chart, axis) {
                const scales = chart.scales;
                return Object.keys(scales).filter((key)=>scales[key].axis === axis).shift();
            }
            function clearStacks(meta, items) {
                const datasetIndex = meta.controller.index, axis = meta.vScale && meta.vScale.axis;
                if (axis) for (const parsed of items = items || meta._parsed){
                    const stacks = parsed._stacks;
                    if (!stacks || void 0 === stacks[axis] || void 0 === stacks[axis][datasetIndex]) return;
                    delete stacks[axis][datasetIndex];
                }
            }
            const isDirectUpdateMode = (mode)=>'reset' === mode || 'none' === mode, cloneIfNotShared = (cached, shared)=>shared ? cached : Object.assign({}, cached), createStack = (canStack, meta, chart)=>canStack && !meta.hidden && meta._stacked && {
                    keys: getSortedDatasetIndices(chart, !0),
                    values: null
                };
            class DatasetController {
                constructor(chart, datasetIndex){
                    this.chart = chart, this._ctx = chart.ctx, this.index = datasetIndex, this._cachedDataOpts = {}, this._cachedMeta = this.getMeta(), this._type = this._cachedMeta.type, this.options = void 0, this._parsing = !1, this._data = void 0, this._objectData = void 0, this._sharedOptions = void 0, this._drawStart = void 0, this._drawCount = void 0, this.enableOptionSharing = !1, this.supportsDecimation = !1, this.$context = void 0, this._syncList = [], this.initialize();
                }
                initialize() {
                    const meta = this._cachedMeta;
                    this.configure(), this.linkScales(), meta._stacked = isStacked(meta.vScale, meta), this.addElements();
                }
                updateIndex(datasetIndex) {
                    this.index !== datasetIndex && clearStacks(this._cachedMeta), this.index = datasetIndex;
                }
                linkScales() {
                    const chart = this.chart, meta = this._cachedMeta, dataset = this.getDataset(), chooseId = (axis, x, y, r)=>'x' === axis ? x : 'r' === axis ? r : y, xid = meta.xAxisID = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.v)(dataset.xAxisID, getFirstScaleId(chart, 'x')), yid = meta.yAxisID = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.v)(dataset.yAxisID, getFirstScaleId(chart, 'y')), rid = meta.rAxisID = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.v)(dataset.rAxisID, getFirstScaleId(chart, 'r')), indexAxis = meta.indexAxis, iid = meta.iAxisID = chooseId(indexAxis, xid, yid, rid), vid = meta.vAxisID = chooseId(indexAxis, yid, xid, rid);
                    meta.xScale = this.getScaleForId(xid), meta.yScale = this.getScaleForId(yid), meta.rScale = this.getScaleForId(rid), meta.iScale = this.getScaleForId(iid), meta.vScale = this.getScaleForId(vid);
                }
                getDataset() {
                    return this.chart.data.datasets[this.index];
                }
                getMeta() {
                    return this.chart.getDatasetMeta(this.index);
                }
                getScaleForId(scaleID) {
                    return this.chart.scales[scaleID];
                }
                _getOtherScale(scale) {
                    const meta = this._cachedMeta;
                    return scale === meta.iScale ? meta.vScale : meta.iScale;
                }
                reset() {
                    this._update('reset');
                }
                _destroy() {
                    const meta = this._cachedMeta;
                    this._data && (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.u)(this._data, this), meta._stacked && clearStacks(meta);
                }
                _dataCheck() {
                    const dataset = this.getDataset(), data = dataset.data || (dataset.data = []), _data = this._data;
                    if ((0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.i)(data)) this._data = function(data) {
                        let i, ilen, key;
                        const keys = Object.keys(data), adata = Array(keys.length);
                        for(i = 0, ilen = keys.length; i < ilen; ++i)key = keys[i], adata[i] = {
                            x: key,
                            y: data[key]
                        };
                        return adata;
                    }(data);
                    else if (_data !== data) {
                        if (_data) {
                            (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.u)(_data, this);
                            const meta = this._cachedMeta;
                            clearStacks(meta), meta._parsed = [];
                        }
                        data && Object.isExtensible(data) && (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.l)(data, this), this._syncList = [], this._data = data;
                    }
                }
                addElements() {
                    const meta = this._cachedMeta;
                    this._dataCheck(), this.datasetElementType && (meta.dataset = new this.datasetElementType());
                }
                buildOrUpdateElements(resetNewElements) {
                    const meta = this._cachedMeta, dataset = this.getDataset();
                    let stackChanged = !1;
                    this._dataCheck();
                    const oldStacked = meta._stacked;
                    meta._stacked = isStacked(meta.vScale, meta), meta.stack !== dataset.stack && (stackChanged = !0, clearStacks(meta), meta.stack = dataset.stack), this._resyncElements(resetNewElements), (stackChanged || oldStacked !== meta._stacked) && updateStacks(this, meta._parsed);
                }
                configure() {
                    const config = this.chart.config, scopeKeys = config.datasetScopeKeys(this._type), scopes = config.getOptionScopes(this.getDataset(), scopeKeys, !0);
                    this.options = config.createResolver(scopes, this.getContext()), this._parsing = this.options.parsing, this._cachedDataOpts = {};
                }
                parse(start, count) {
                    let i, cur, parsed;
                    const { _cachedMeta: meta , _data: data  } = this, { iScale , _stacked  } = meta, iAxis = iScale.axis;
                    let sorted = 0 === start && count === data.length || meta._sorted, prev = start > 0 && meta._parsed[start - 1];
                    if (!1 === this._parsing) meta._parsed = data, meta._sorted = !0, parsed = data;
                    else {
                        parsed = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.b)(data[start]) ? this.parseArrayData(meta, data, start, count) : (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.i)(data[start]) ? this.parseObjectData(meta, data, start, count) : this.parsePrimitiveData(meta, data, start, count);
                        const isNotInOrderComparedToPrev = ()=>null === cur[iAxis] || prev && cur[iAxis] < prev[iAxis];
                        for(i = 0; i < count; ++i)meta._parsed[i + start] = cur = parsed[i], sorted && (isNotInOrderComparedToPrev() && (sorted = !1), prev = cur);
                        meta._sorted = sorted;
                    }
                    _stacked && updateStacks(this, parsed);
                }
                parsePrimitiveData(meta, data, start, count) {
                    let i, index;
                    const { iScale , vScale  } = meta, iAxis = iScale.axis, vAxis = vScale.axis, labels = iScale.getLabels(), singleScale = iScale === vScale, parsed = Array(count);
                    for(i = 0; i < count; ++i)index = i + start, parsed[i] = {
                        [iAxis]: singleScale || iScale.parse(labels[index], index),
                        [vAxis]: vScale.parse(data[index], index)
                    };
                    return parsed;
                }
                parseArrayData(meta, data, start, count) {
                    let i, index, item;
                    const { xScale , yScale  } = meta, parsed = Array(count);
                    for(i = 0; i < count; ++i)item = data[index = i + start], parsed[i] = {
                        x: xScale.parse(item[0], index),
                        y: yScale.parse(item[1], index)
                    };
                    return parsed;
                }
                parseObjectData(meta, data, start, count) {
                    let i, index, item;
                    const { xScale , yScale  } = meta, { xAxisKey ='x' , yAxisKey ='y'  } = this._parsing, parsed = Array(count);
                    for(i = 0; i < count; ++i)item = data[index = i + start], parsed[i] = {
                        x: xScale.parse((0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.f)(item, xAxisKey), index),
                        y: yScale.parse((0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.f)(item, yAxisKey), index)
                    };
                    return parsed;
                }
                getParsed(index) {
                    return this._cachedMeta._parsed[index];
                }
                getDataElement(index) {
                    return this._cachedMeta.data[index];
                }
                applyStack(scale, parsed, mode) {
                    const chart = this.chart, meta = this._cachedMeta, value = parsed[scale.axis], stack = {
                        keys: getSortedDatasetIndices(chart, !0),
                        values: parsed._stacks[scale.axis]
                    };
                    return applyStack(stack, value, meta.index, {
                        mode
                    });
                }
                updateRangeFromParsed(range, scale, parsed, stack) {
                    const parsedValue = parsed[scale.axis];
                    let value = null === parsedValue ? NaN : parsedValue;
                    const values = stack && parsed._stacks[scale.axis];
                    stack && values && (stack.values = values, value = applyStack(stack, parsedValue, this._cachedMeta.index)), range.min = Math.min(range.min, value), range.max = Math.max(range.max, value);
                }
                getMinMax(scale, canStack) {
                    let i, parsed;
                    const meta = this._cachedMeta, _parsed = meta._parsed, sorted = meta._sorted && scale === meta.iScale, ilen = _parsed.length, otherScale = this._getOtherScale(scale), stack = createStack(canStack, meta, this.chart), range = {
                        min: Number.POSITIVE_INFINITY,
                        max: Number.NEGATIVE_INFINITY
                    }, { min: otherMin , max: otherMax  } = function(scale) {
                        const { min , max , minDefined , maxDefined  } = scale.getUserBounds();
                        return {
                            min: minDefined ? min : Number.NEGATIVE_INFINITY,
                            max: maxDefined ? max : Number.POSITIVE_INFINITY
                        };
                    }(otherScale);
                    function _skip() {
                        parsed = _parsed[i];
                        const otherValue = parsed[otherScale.axis];
                        return !(0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.g)(parsed[scale.axis]) || otherMin > otherValue || otherMax < otherValue;
                    }
                    for(i = 0; i < ilen && (_skip() || (this.updateRangeFromParsed(range, scale, parsed, stack), !sorted)); ++i);
                    if (sorted) {
                        for(i = ilen - 1; i >= 0; --i)if (!_skip()) {
                            this.updateRangeFromParsed(range, scale, parsed, stack);
                            break;
                        }
                    }
                    return range;
                }
                getAllParsedValues(scale) {
                    let i, ilen, value;
                    const parsed = this._cachedMeta._parsed, values = [];
                    for(i = 0, ilen = parsed.length; i < ilen; ++i)value = parsed[i][scale.axis], (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.g)(value) && values.push(value);
                    return values;
                }
                getMaxOverflow() {
                    return !1;
                }
                getLabelAndValue(index) {
                    const meta = this._cachedMeta, iScale = meta.iScale, vScale = meta.vScale, parsed = this.getParsed(index);
                    return {
                        label: iScale ? '' + iScale.getLabelForValue(parsed[iScale.axis]) : '',
                        value: vScale ? '' + vScale.getLabelForValue(parsed[vScale.axis]) : ''
                    };
                }
                _update(mode) {
                    var value;
                    let t, r, b, l;
                    const meta = this._cachedMeta;
                    this.update(mode || 'default'), meta._clip = (value = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.v)(this.options.clip, function(xScale, yScale, allowedOverflow) {
                        if (!1 === allowedOverflow) return !1;
                        const x = scaleClip(xScale, allowedOverflow), y = scaleClip(yScale, allowedOverflow);
                        return {
                            top: y.end,
                            right: x.end,
                            bottom: y.start,
                            left: x.start
                        };
                    }(meta.xScale, meta.yScale, this.getMaxOverflow())), (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.i)(value) ? (t = value.top, r = value.right, b = value.bottom, l = value.left) : t = r = b = l = value, {
                        top: t,
                        right: r,
                        bottom: b,
                        left: l,
                        disabled: !1 === value
                    });
                }
                update(mode) {}
                draw() {
                    let i;
                    const ctx = this._ctx, chart = this.chart, meta = this._cachedMeta, elements = meta.data || [], area = chart.chartArea, active = [], start = this._drawStart || 0, count = this._drawCount || elements.length - start, drawActiveElementsOnTop = this.options.drawActiveElementsOnTop;
                    for(meta.dataset && meta.dataset.draw(ctx, area, start, count), i = start; i < start + count; ++i){
                        const element = elements[i];
                        element.hidden || (element.active && drawActiveElementsOnTop ? active.push(element) : element.draw(ctx, area));
                    }
                    for(i = 0; i < active.length; ++i)active[i].draw(ctx, area);
                }
                getStyle(index, active) {
                    const mode = active ? 'active' : 'default';
                    return void 0 === index && this._cachedMeta.dataset ? this.resolveDatasetElementOptions(mode) : this.resolveDataElementOptions(index || 0, mode);
                }
                getContext(index, active, mode) {
                    var parent, index1, element, parent1, index2;
                    let context;
                    const dataset = this.getDataset();
                    if (index >= 0 && index < this._cachedMeta.data.length) {
                        const element1 = this._cachedMeta.data[index];
                        (context = element1.$context || (element1.$context = (parent = this.getContext(), index1 = index, element = element1, (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.h)(parent, {
                            active: !1,
                            dataIndex: index1,
                            parsed: void 0,
                            raw: void 0,
                            element,
                            index: index1,
                            mode: 'default',
                            type: 'data'
                        })))).parsed = this.getParsed(index), context.raw = dataset.data[index], context.index = context.dataIndex = index;
                    } else (context = this.$context || (this.$context = (parent1 = this.chart.getContext(), index2 = this.index, (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.h)(parent1, {
                        active: !1,
                        dataset: void 0,
                        datasetIndex: index2,
                        index: index2,
                        mode: 'default',
                        type: 'dataset'
                    })))).dataset = dataset, context.index = context.datasetIndex = this.index;
                    return context.active = !!active, context.mode = mode, context;
                }
                resolveDatasetElementOptions(mode) {
                    return this._resolveElementOptions(this.datasetElementType.id, mode);
                }
                resolveDataElementOptions(index, mode) {
                    return this._resolveElementOptions(this.dataElementType.id, mode, index);
                }
                _resolveElementOptions(elementType, mode = 'default', index) {
                    const active = 'active' === mode, cache = this._cachedDataOpts, cacheKey = elementType + '-' + mode, cached = cache[cacheKey], sharing = this.enableOptionSharing && (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.j)(index);
                    if (cached) return cloneIfNotShared(cached, sharing);
                    const config = this.chart.config, scopeKeys = config.datasetElementScopeKeys(this._type, elementType), prefixes = active ? [
                        `${elementType}Hover`,
                        'hover',
                        elementType,
                        ''
                    ] : [
                        elementType,
                        ''
                    ], scopes = config.getOptionScopes(this.getDataset(), scopeKeys), names = Object.keys(_chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.d.elements[elementType]), context = ()=>this.getContext(index, active), values = config.resolveNamedOptions(scopes, names, context, prefixes);
                    return values.$shared && (values.$shared = sharing, cache[cacheKey] = Object.freeze(cloneIfNotShared(values, sharing))), values;
                }
                _resolveAnimations(index, transition, active) {
                    let options;
                    const chart = this.chart, cache = this._cachedDataOpts, cacheKey = `animation-${transition}`, cached = cache[cacheKey];
                    if (cached) return cached;
                    if (!1 !== chart.options.animation) {
                        const config = this.chart.config, scopeKeys = config.datasetAnimationScopeKeys(this._type, transition), scopes = config.getOptionScopes(this.getDataset(), scopeKeys);
                        options = config.createResolver(scopes, this.getContext(index, active, transition));
                    }
                    const animations = new Animations(chart, options && options.animations);
                    return options && options._cacheable && (cache[cacheKey] = Object.freeze(animations)), animations;
                }
                getSharedOptions(options) {
                    if (options.$shared) return this._sharedOptions || (this._sharedOptions = Object.assign({}, options));
                }
                includeOptions(mode, sharedOptions) {
                    return !sharedOptions || isDirectUpdateMode(mode) || this.chart._animationsDisabled;
                }
                _getSharedOptions(start, mode) {
                    const firstOpts = this.resolveDataElementOptions(start, mode), previouslySharedOptions = this._sharedOptions, sharedOptions = this.getSharedOptions(firstOpts), includeOptions = this.includeOptions(mode, sharedOptions) || sharedOptions !== previouslySharedOptions;
                    return this.updateSharedOptions(sharedOptions, mode, firstOpts), {
                        sharedOptions,
                        includeOptions
                    };
                }
                updateElement(element, index, properties, mode) {
                    isDirectUpdateMode(mode) ? Object.assign(element, properties) : this._resolveAnimations(index, mode).update(element, properties);
                }
                updateSharedOptions(sharedOptions, mode, newOptions) {
                    sharedOptions && !isDirectUpdateMode(mode) && this._resolveAnimations(void 0, mode).update(sharedOptions, newOptions);
                }
                _setStyle(element, index, mode, active) {
                    element.active = active;
                    const options = this.getStyle(index, active);
                    this._resolveAnimations(index, mode, active).update(element, {
                        options: !active && this.getSharedOptions(options) || options
                    });
                }
                removeHoverStyle(element, datasetIndex, index) {
                    this._setStyle(element, index, 'active', !1);
                }
                setHoverStyle(element, datasetIndex, index) {
                    this._setStyle(element, index, 'active', !0);
                }
                _removeDatasetHoverStyle() {
                    const element = this._cachedMeta.dataset;
                    element && this._setStyle(element, void 0, 'active', !1);
                }
                _setDatasetHoverStyle() {
                    const element = this._cachedMeta.dataset;
                    element && this._setStyle(element, void 0, 'active', !0);
                }
                _resyncElements(resetNewElements) {
                    const data = this._data, elements = this._cachedMeta.data;
                    for (const [method, arg1, arg2] of this._syncList)this[method](arg1, arg2);
                    this._syncList = [];
                    const numMeta = elements.length, numData = data.length, count = Math.min(numData, numMeta);
                    count && this.parse(0, count), numData > numMeta ? this._insertElements(numMeta, numData - numMeta, resetNewElements) : numData < numMeta && this._removeElements(numData, numMeta - numData);
                }
                _insertElements(start, count, resetNewElements = !0) {
                    let i;
                    const meta = this._cachedMeta, data = meta.data, end = start + count, move = (arr)=>{
                        for(arr.length += count, i = arr.length - 1; i >= end; i--)arr[i] = arr[i - count];
                    };
                    for(move(data), i = start; i < end; ++i)data[i] = new this.dataElementType();
                    this._parsing && move(meta._parsed), this.parse(start, count), resetNewElements && this.updateElements(data, start, count, 'reset');
                }
                updateElements(element, start, count, mode) {}
                _removeElements(start, count) {
                    const meta = this._cachedMeta;
                    if (this._parsing) {
                        const removed = meta._parsed.splice(start, count);
                        meta._stacked && clearStacks(meta, removed);
                    }
                    meta.data.splice(start, count);
                }
                _sync(args) {
                    if (this._parsing) this._syncList.push(args);
                    else {
                        const [method, arg1, arg2] = args;
                        this[method](arg1, arg2);
                    }
                    this.chart._dataChanges.push([
                        this.index,
                        ...args
                    ]);
                }
                _onDataPush() {
                    const count = arguments.length;
                    this._sync([
                        '_insertElements',
                        this.getDataset().data.length - count,
                        count
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
                _onDataSplice(start, count) {
                    count && this._sync([
                        '_removeElements',
                        start,
                        count
                    ]);
                    const newCount = arguments.length - 2;
                    newCount && this._sync([
                        '_insertElements',
                        start,
                        newCount
                    ]);
                }
                _onDataUnshift() {
                    this._sync([
                        '_insertElements',
                        0,
                        arguments.length
                    ]);
                }
            }
            function parseValue(entry, item, vScale, i) {
                return (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.b)(entry) ? function(entry, item, vScale, i) {
                    const startValue = vScale.parse(entry[0], i), endValue = vScale.parse(entry[1], i), min = Math.min(startValue, endValue), max = Math.max(startValue, endValue);
                    let barStart = min, barEnd = max;
                    Math.abs(min) > Math.abs(max) && (barStart = max, barEnd = min), item[vScale.axis] = barEnd, item._custom = {
                        barStart,
                        barEnd,
                        start: startValue,
                        end: endValue,
                        min,
                        max
                    };
                }(entry, item, vScale, i) : item[vScale.axis] = vScale.parse(entry, i), item;
            }
            function parseArrayOrPrimitive(meta, data, start, count) {
                let i, ilen, item, entry;
                const iScale = meta.iScale, vScale = meta.vScale, labels = iScale.getLabels(), singleScale = iScale === vScale, parsed = [];
                for(i = start, ilen = start + count; i < ilen; ++i)entry = data[i], (item = {})[iScale.axis] = singleScale || iScale.parse(labels[i], i), parsed.push(parseValue(entry, item, vScale, i));
                return parsed;
            }
            function isFloatBar(custom) {
                return custom && void 0 !== custom.barStart && void 0 !== custom.barEnd;
            }
            function setBorderSkipped(properties, options, stack, index) {
                let reverse, start, end, top, bottom, edge = options.borderSkipped;
                const res = {};
                if (!edge) {
                    properties.borderSkipped = res;
                    return;
                }
                if (!0 === edge) {
                    properties.borderSkipped = {
                        top: !0,
                        right: !0,
                        bottom: !0,
                        left: !0
                    };
                    return;
                }
                const { start: start1 , end: end1 , reverse: reverse1 , top: top1 , bottom: bottom1  } = (properties.horizontal ? (reverse = properties.base > properties.x, start = 'left', end = 'right') : (reverse = properties.base < properties.y, start = 'bottom', end = 'top'), reverse ? (top = 'end', bottom = 'start') : (top = 'start', bottom = 'end'), {
                    start,
                    end,
                    reverse,
                    top,
                    bottom
                });
                'middle' === edge && stack && (properties.enableBorderRadius = !0, (stack._top || 0) === index ? edge = top1 : (stack._bottom || 0) === index ? edge = bottom1 : (res[parseEdge(bottom1, start1, end1, reverse1)] = !0, edge = top1)), res[parseEdge(edge, start1, end1, reverse1)] = !0, properties.borderSkipped = res;
            }
            function parseEdge(edge, a, b, reverse) {
                var orig;
                return reverse ? (orig = edge, edge = startEnd(edge = orig === a ? b : orig === b ? a : orig, b, a)) : edge = startEnd(edge, a, b), edge;
            }
            function startEnd(v, start, end) {
                return 'start' === v ? start : 'end' === v ? end : v;
            }
            function setInflateAmount(properties, { inflateAmount  }, ratio) {
                properties.inflateAmount = 'auto' === inflateAmount ? 1 === ratio ? 0.33 : 0 : inflateAmount;
            }
            DatasetController.defaults = {}, DatasetController.prototype.datasetElementType = null, DatasetController.prototype.dataElementType = null;
            class BarController extends DatasetController {
                parsePrimitiveData(meta, data, start, count) {
                    return parseArrayOrPrimitive(meta, data, start, count);
                }
                parseArrayData(meta, data, start, count) {
                    return parseArrayOrPrimitive(meta, data, start, count);
                }
                parseObjectData(meta, data, start, count) {
                    let i, ilen, item, obj;
                    const { iScale , vScale  } = meta, { xAxisKey ='x' , yAxisKey ='y'  } = this._parsing, iAxisKey = 'x' === iScale.axis ? xAxisKey : yAxisKey, vAxisKey = 'x' === vScale.axis ? xAxisKey : yAxisKey, parsed = [];
                    for(i = start, ilen = start + count; i < ilen; ++i)obj = data[i], (item = {})[iScale.axis] = iScale.parse((0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.f)(obj, iAxisKey), i), parsed.push(parseValue((0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.f)(obj, vAxisKey), item, vScale, i));
                    return parsed;
                }
                updateRangeFromParsed(range, scale, parsed, stack) {
                    super.updateRangeFromParsed(range, scale, parsed, stack);
                    const custom = parsed._custom;
                    custom && scale === this._cachedMeta.vScale && (range.min = Math.min(range.min, custom.min), range.max = Math.max(range.max, custom.max));
                }
                getMaxOverflow() {
                    return 0;
                }
                getLabelAndValue(index) {
                    const meta = this._cachedMeta, { iScale , vScale  } = meta, parsed = this.getParsed(index), custom = parsed._custom, value = isFloatBar(custom) ? '[' + custom.start + ', ' + custom.end + ']' : '' + vScale.getLabelForValue(parsed[vScale.axis]);
                    return {
                        label: '' + iScale.getLabelForValue(parsed[iScale.axis]),
                        value
                    };
                }
                initialize() {
                    this.enableOptionSharing = !0, super.initialize();
                    const meta = this._cachedMeta;
                    meta.stack = this.getDataset().stack;
                }
                update(mode) {
                    const meta = this._cachedMeta;
                    this.updateElements(meta.data, 0, meta.data.length, mode);
                }
                updateElements(bars, start, count, mode) {
                    const reset = 'reset' === mode, { index , _cachedMeta: { vScale  }  } = this, base = vScale.getBasePixel(), horizontal = vScale.isHorizontal(), ruler = this._getRuler(), { sharedOptions , includeOptions  } = this._getSharedOptions(start, mode);
                    for(let i = start; i < start + count; i++){
                        const parsed = this.getParsed(i), vpixels = reset || (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.k)(parsed[vScale.axis]) ? {
                            base,
                            head: base
                        } : this._calculateBarValuePixels(i), ipixels = this._calculateBarIndexPixels(i, ruler), stack = (parsed._stacks || {})[vScale.axis], properties = {
                            horizontal,
                            base: vpixels.base,
                            enableBorderRadius: !stack || isFloatBar(parsed._custom) || index === stack._top || index === stack._bottom,
                            x: horizontal ? vpixels.head : ipixels.center,
                            y: horizontal ? ipixels.center : vpixels.head,
                            height: horizontal ? ipixels.size : Math.abs(vpixels.size),
                            width: horizontal ? Math.abs(vpixels.size) : ipixels.size
                        };
                        includeOptions && (properties.options = sharedOptions || this.resolveDataElementOptions(i, bars[i].active ? 'active' : mode));
                        const options = properties.options || bars[i].options;
                        setBorderSkipped(properties, options, stack, index), setInflateAmount(properties, options, ruler.ratio), this.updateElement(bars[i], i, properties, mode);
                    }
                }
                _getStacks(last, dataIndex) {
                    const { iScale  } = this._cachedMeta, metasets = iScale.getMatchingVisibleMetas(this._type).filter((meta)=>meta.controller.options.grouped), stacked = iScale.options.stacked, stacks = [], skipNull = (meta)=>{
                        const parsed = meta.controller.getParsed(dataIndex), val = parsed && parsed[meta.vScale.axis];
                        if ((0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.k)(val) || isNaN(val)) return !0;
                    };
                    for (const meta of metasets)if (!(void 0 !== dataIndex && skipNull(meta)) && ((!1 === stacked || -1 === stacks.indexOf(meta.stack) || void 0 === stacked && void 0 === meta.stack) && stacks.push(meta.stack), meta.index === last)) break;
                    return stacks.length || stacks.push(void 0), stacks;
                }
                _getStackCount(index) {
                    return this._getStacks(void 0, index).length;
                }
                _getStackIndex(datasetIndex, name, dataIndex) {
                    const stacks = this._getStacks(datasetIndex, dataIndex), index = void 0 !== name ? stacks.indexOf(name) : -1;
                    return -1 === index ? stacks.length - 1 : index;
                }
                _getRuler() {
                    let i, ilen;
                    const opts = this.options, meta = this._cachedMeta, iScale = meta.iScale, pixels = [];
                    for(i = 0, ilen = meta.data.length; i < ilen; ++i)pixels.push(iScale.getPixelForValue(this.getParsed(i)[iScale.axis], i));
                    const barThickness = opts.barThickness, min = barThickness || function(meta) {
                        let i, ilen, curr, prev;
                        const scale = meta.iScale, values = function(scale, type) {
                            if (!scale._cache.$bar) {
                                const visibleMetas = scale.getMatchingVisibleMetas(type);
                                let values = [];
                                for(let i = 0, ilen = visibleMetas.length; i < ilen; i++)values = values.concat(visibleMetas[i].controller.getAllParsedValues(scale));
                                scale._cache.$bar = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__._)(values.sort((a, b)=>a - b));
                            }
                            return scale._cache.$bar;
                        }(scale, meta.type);
                        let min = scale._length;
                        const updateMinAndPrev = ()=>{
                            32767 !== curr && -32768 !== curr && ((0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.j)(prev) && (min = Math.min(min, Math.abs(curr - prev) || min)), prev = curr);
                        };
                        for(i = 0, ilen = values.length; i < ilen; ++i)curr = scale.getPixelForValue(values[i]), updateMinAndPrev();
                        for(i = 0, prev = void 0, ilen = scale.ticks.length; i < ilen; ++i)curr = scale.getPixelForTick(i), updateMinAndPrev();
                        return min;
                    }(meta);
                    return {
                        min,
                        pixels,
                        start: iScale._startPixel,
                        end: iScale._endPixel,
                        stackCount: this._getStackCount(),
                        scale: iScale,
                        grouped: opts.grouped,
                        ratio: barThickness ? 1 : opts.categoryPercentage * opts.barPercentage
                    };
                }
                _calculateBarValuePixels(index) {
                    let head, size;
                    const { _cachedMeta: { vScale , _stacked  } , options: { base: baseValue , minBarLength  }  } = this, actualBase = baseValue || 0, parsed = this.getParsed(index), custom = parsed._custom, floating = isFloatBar(custom);
                    let value = parsed[vScale.axis], start = 0, length = _stacked ? this.applyStack(vScale, parsed, _stacked) : value;
                    length !== value && (start = length - value, length = value), floating && (value = custom.barStart, length = custom.barEnd - custom.barStart, 0 !== value && (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.s)(value) !== (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.s)(custom.barEnd) && (start = 0), start += value);
                    const startValue = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.k)(baseValue) || floating ? start : baseValue;
                    let base = vScale.getPixelForValue(startValue);
                    if (Math.abs(size = (head = this.chart.getDataVisibility(index) ? vScale.getPixelForValue(start + length) : base) - base) < minBarLength) {
                        var size1;
                        size = (0 !== (size1 = size) ? (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.s)(size1) : (vScale.isHorizontal() ? 1 : -1) * (vScale.min >= actualBase ? 1 : -1)) * minBarLength, value === actualBase && (base -= size / 2);
                        const startPixel = vScale.getPixelForDecimal(0), endPixel = vScale.getPixelForDecimal(1);
                        head = (base = Math.max(Math.min(base, Math.max(startPixel, endPixel)), Math.min(startPixel, endPixel))) + size;
                    }
                    if (base === vScale.getPixelForValue(actualBase)) {
                        const halfGrid = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.s)(size) * vScale.getLineWidthForValue(actualBase) / 2;
                        base += halfGrid, size -= halfGrid;
                    }
                    return {
                        size,
                        base,
                        head,
                        center: head + size / 2
                    };
                }
                _calculateBarIndexPixels(index, ruler) {
                    let center, size;
                    const scale = ruler.scale, options = this.options, skipNull = options.skipNull, maxBarThickness = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.v)(options.maxBarThickness, 1 / 0);
                    if (ruler.grouped) {
                        const stackCount = skipNull ? this._getStackCount(index) : ruler.stackCount, range = 'flex' === options.barThickness ? function(index, ruler, options, stackCount) {
                            const pixels = ruler.pixels, curr = pixels[index];
                            let prev = index > 0 ? pixels[index - 1] : null, next = index < pixels.length - 1 ? pixels[index + 1] : null;
                            const percent = options.categoryPercentage;
                            null === prev && (prev = curr - (null === next ? ruler.end - ruler.start : next - curr)), null === next && (next = curr + curr - prev);
                            const start = curr - (curr - Math.min(prev, next)) / 2 * percent, size = Math.abs(next - prev) / 2 * percent;
                            return {
                                chunk: size / stackCount,
                                ratio: options.barPercentage,
                                start
                            };
                        }(index, ruler, options, stackCount) : function(index, ruler, options, stackCount) {
                            let size, ratio;
                            const thickness = options.barThickness;
                            return (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.k)(thickness) ? (size = ruler.min * options.categoryPercentage, ratio = options.barPercentage) : (size = thickness * stackCount, ratio = 1), {
                                chunk: size / stackCount,
                                ratio,
                                start: ruler.pixels[index] - size / 2
                            };
                        }(index, ruler, options, stackCount), stackIndex = this._getStackIndex(this.index, this._cachedMeta.stack, skipNull ? index : void 0);
                        center = range.start + range.chunk * stackIndex + range.chunk / 2, size = Math.min(maxBarThickness, range.chunk * range.ratio);
                    } else center = scale.getPixelForValue(this.getParsed(index)[scale.axis], index), size = Math.min(maxBarThickness, ruler.min * ruler.ratio);
                    return {
                        base: center - size / 2,
                        head: center + size / 2,
                        center,
                        size
                    };
                }
                draw() {
                    const meta = this._cachedMeta, vScale = meta.vScale, rects = meta.data, ilen = rects.length;
                    let i = 0;
                    for(; i < ilen; ++i)null !== this.getParsed(i)[vScale.axis] && rects[i].draw(this._ctx);
                }
            }
            BarController.id = 'bar', BarController.defaults = {
                datasetElementType: !1,
                dataElementType: 'bar',
                categoryPercentage: 0.8,
                barPercentage: 0.9,
                grouped: !0,
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
            }, BarController.overrides = {
                scales: {
                    _index_: {
                        type: 'category',
                        offset: !0,
                        grid: {
                            offset: !0
                        }
                    },
                    _value_: {
                        type: 'linear',
                        beginAtZero: !0
                    }
                }
            };
            class BubbleController extends DatasetController {
                initialize() {
                    this.enableOptionSharing = !0, super.initialize();
                }
                parsePrimitiveData(meta, data, start, count) {
                    const parsed = super.parsePrimitiveData(meta, data, start, count);
                    for(let i = 0; i < parsed.length; i++)parsed[i]._custom = this.resolveDataElementOptions(i + start).radius;
                    return parsed;
                }
                parseArrayData(meta, data, start, count) {
                    const parsed = super.parseArrayData(meta, data, start, count);
                    for(let i = 0; i < parsed.length; i++){
                        const item = data[start + i];
                        parsed[i]._custom = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.v)(item[2], this.resolveDataElementOptions(i + start).radius);
                    }
                    return parsed;
                }
                parseObjectData(meta, data, start, count) {
                    const parsed = super.parseObjectData(meta, data, start, count);
                    for(let i = 0; i < parsed.length; i++){
                        const item = data[start + i];
                        parsed[i]._custom = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.v)(item && item.r && +item.r, this.resolveDataElementOptions(i + start).radius);
                    }
                    return parsed;
                }
                getMaxOverflow() {
                    const data = this._cachedMeta.data;
                    let max = 0;
                    for(let i = data.length - 1; i >= 0; --i)max = Math.max(max, data[i].size(this.resolveDataElementOptions(i)) / 2);
                    return max > 0 && max;
                }
                getLabelAndValue(index) {
                    const meta = this._cachedMeta, { xScale , yScale  } = meta, parsed = this.getParsed(index), x = xScale.getLabelForValue(parsed.x), y = yScale.getLabelForValue(parsed.y), r = parsed._custom;
                    return {
                        label: meta.label,
                        value: '(' + x + ', ' + y + (r ? ', ' + r : '') + ')'
                    };
                }
                update(mode) {
                    const points = this._cachedMeta.data;
                    this.updateElements(points, 0, points.length, mode);
                }
                updateElements(points, start, count, mode) {
                    const reset = 'reset' === mode, { iScale , vScale  } = this._cachedMeta, { sharedOptions , includeOptions  } = this._getSharedOptions(start, mode), iAxis = iScale.axis, vAxis = vScale.axis;
                    for(let i = start; i < start + count; i++){
                        const point = points[i], parsed = !reset && this.getParsed(i), properties = {}, iPixel = properties[iAxis] = reset ? iScale.getPixelForDecimal(0.5) : iScale.getPixelForValue(parsed[iAxis]), vPixel = properties[vAxis] = reset ? vScale.getBasePixel() : vScale.getPixelForValue(parsed[vAxis]);
                        properties.skip = isNaN(iPixel) || isNaN(vPixel), includeOptions && (properties.options = sharedOptions || this.resolveDataElementOptions(i, point.active ? 'active' : mode), reset && (properties.options.radius = 0)), this.updateElement(point, i, properties, mode);
                    }
                }
                resolveDataElementOptions(index, mode) {
                    const parsed = this.getParsed(index);
                    let values = super.resolveDataElementOptions(index, mode);
                    values.$shared && (values = Object.assign({}, values, {
                        $shared: !1
                    }));
                    const radius = values.radius;
                    return 'active' !== mode && (values.radius = 0), values.radius += (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.v)(parsed && parsed._custom, radius), values;
                }
            }
            BubbleController.id = 'bubble', BubbleController.defaults = {
                datasetElementType: !1,
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
            }, BubbleController.overrides = {
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
                            title: ()=>''
                        }
                    }
                }
            };
            class DoughnutController extends DatasetController {
                constructor(chart, datasetIndex){
                    super(chart, datasetIndex), this.enableOptionSharing = !0, this.innerRadius = void 0, this.outerRadius = void 0, this.offsetX = void 0, this.offsetY = void 0;
                }
                linkScales() {}
                parse(start, count) {
                    const data = this.getDataset().data, meta = this._cachedMeta;
                    if (!1 === this._parsing) meta._parsed = data;
                    else {
                        let i, ilen, getter = (i)=>+data[i];
                        if ((0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.i)(data[start])) {
                            const { key ='value'  } = this._parsing;
                            getter = (i)=>+(0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.f)(data[i], key);
                        }
                        for(i = start, ilen = start + count; i < ilen; ++i)meta._parsed[i] = getter(i);
                    }
                }
                _getRotation() {
                    return (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.t)(this.options.rotation - 90);
                }
                _getCircumference() {
                    return (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.t)(this.options.circumference);
                }
                _getRotationExtents() {
                    let min = _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.T, max = -_chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.T;
                    for(let i = 0; i < this.chart.data.datasets.length; ++i)if (this.chart.isDatasetVisible(i)) {
                        const controller = this.chart.getDatasetMeta(i).controller, rotation = controller._getRotation(), circumference = controller._getCircumference();
                        min = Math.min(min, rotation), max = Math.max(max, rotation + circumference);
                    }
                    return {
                        rotation: min,
                        circumference: max - min
                    };
                }
                update(mode) {
                    const chart = this.chart, { chartArea  } = chart, meta = this._cachedMeta, arcs = meta.data, spacing = this.getMaxBorderWidth() + this.getMaxOffset(arcs) + this.options.spacing, maxSize = Math.max((Math.min(chartArea.width, chartArea.height) - spacing) / 2, 0), cutout = Math.min((0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.m)(this.options.cutout, maxSize), 1), chartWeight = this._getRingWeight(this.index), { circumference , rotation  } = this._getRotationExtents(), { ratioX , ratioY , offsetX , offsetY  } = function(rotation, circumference, cutout) {
                        let ratioX = 1, ratioY = 1, offsetX = 0, offsetY = 0;
                        if (circumference < _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.T) {
                            const endAngle = rotation + circumference, startX = Math.cos(rotation), startY = Math.sin(rotation), endX = Math.cos(endAngle), endY = Math.sin(endAngle), calcMax = (angle, a, b)=>(0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.p)(angle, rotation, endAngle, !0) ? 1 : Math.max(a, a * cutout, b, b * cutout), calcMin = (angle, a, b)=>(0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.p)(angle, rotation, endAngle, !0) ? -1 : Math.min(a, a * cutout, b, b * cutout), maxX = calcMax(0, startX, endX), maxY = calcMax(_chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.H, startY, endY), minX = calcMin(_chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.P, startX, endX), minY = calcMin(_chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.P + _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.H, startY, endY);
                            ratioX = (maxX - minX) / 2, ratioY = (maxY - minY) / 2, offsetX = -(maxX + minX) / 2, offsetY = -(maxY + minY) / 2;
                        }
                        return {
                            ratioX,
                            ratioY,
                            offsetX,
                            offsetY
                        };
                    }(rotation, circumference, cutout), maxWidth = (chartArea.width - spacing) / ratioX, maxHeight = (chartArea.height - spacing) / ratioY, outerRadius = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.n)(this.options.radius, Math.max(Math.min(maxWidth, maxHeight) / 2, 0)), radiusLength = (outerRadius - Math.max(outerRadius * cutout, 0)) / this._getVisibleDatasetWeightTotal();
                    this.offsetX = offsetX * outerRadius, this.offsetY = offsetY * outerRadius, meta.total = this.calculateTotal(), this.outerRadius = outerRadius - radiusLength * this._getRingWeightOffset(this.index), this.innerRadius = Math.max(this.outerRadius - radiusLength * chartWeight, 0), this.updateElements(arcs, 0, arcs.length, mode);
                }
                _circumference(i, reset) {
                    const opts = this.options, meta = this._cachedMeta, circumference = this._getCircumference();
                    return reset && opts.animation.animateRotate || !this.chart.getDataVisibility(i) || null === meta._parsed[i] || meta.data[i].hidden ? 0 : this.calculateCircumference(meta._parsed[i] * circumference / _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.T);
                }
                updateElements(arcs, start, count, mode) {
                    let i;
                    const reset = 'reset' === mode, chart = this.chart, chartArea = chart.chartArea, opts = chart.options, animationOpts = opts.animation, centerX = (chartArea.left + chartArea.right) / 2, centerY = (chartArea.top + chartArea.bottom) / 2, animateScale = reset && animationOpts.animateScale, innerRadius = animateScale ? 0 : this.innerRadius, outerRadius = animateScale ? 0 : this.outerRadius, { sharedOptions , includeOptions  } = this._getSharedOptions(start, mode);
                    let startAngle = this._getRotation();
                    for(i = 0; i < start; ++i)startAngle += this._circumference(i, reset);
                    for(i = start; i < start + count; ++i){
                        const circumference = this._circumference(i, reset), arc = arcs[i], properties = {
                            x: centerX + this.offsetX,
                            y: centerY + this.offsetY,
                            startAngle,
                            endAngle: startAngle + circumference,
                            circumference,
                            outerRadius,
                            innerRadius
                        };
                        includeOptions && (properties.options = sharedOptions || this.resolveDataElementOptions(i, arc.active ? 'active' : mode)), startAngle += circumference, this.updateElement(arc, i, properties, mode);
                    }
                }
                calculateTotal() {
                    let i;
                    const meta = this._cachedMeta, metaData = meta.data;
                    let total = 0;
                    for(i = 0; i < metaData.length; i++){
                        const value = meta._parsed[i];
                        null !== value && !isNaN(value) && this.chart.getDataVisibility(i) && !metaData[i].hidden && (total += Math.abs(value));
                    }
                    return total;
                }
                calculateCircumference(value) {
                    const total = this._cachedMeta.total;
                    return total > 0 && !isNaN(value) ? _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.T * (Math.abs(value) / total) : 0;
                }
                getLabelAndValue(index) {
                    const meta = this._cachedMeta, chart = this.chart, labels = chart.data.labels || [], value = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.o)(meta._parsed[index], chart.options.locale);
                    return {
                        label: labels[index] || '',
                        value
                    };
                }
                getMaxBorderWidth(arcs) {
                    let i, ilen, meta, controller, options, max = 0;
                    const chart = this.chart;
                    if (!arcs) {
                        for(i = 0, ilen = chart.data.datasets.length; i < ilen; ++i)if (chart.isDatasetVisible(i)) {
                            arcs = (meta = chart.getDatasetMeta(i)).data, controller = meta.controller;
                            break;
                        }
                    }
                    if (!arcs) return 0;
                    for(i = 0, ilen = arcs.length; i < ilen; ++i)'inner' !== (options = controller.resolveDataElementOptions(i)).borderAlign && (max = Math.max(max, options.borderWidth || 0, options.hoverBorderWidth || 0));
                    return max;
                }
                getMaxOffset(arcs) {
                    let max = 0;
                    for(let i = 0, ilen = arcs.length; i < ilen; ++i){
                        const options = this.resolveDataElementOptions(i);
                        max = Math.max(max, options.offset || 0, options.hoverOffset || 0);
                    }
                    return max;
                }
                _getRingWeightOffset(datasetIndex) {
                    let ringWeightOffset = 0;
                    for(let i = 0; i < datasetIndex; ++i)this.chart.isDatasetVisible(i) && (ringWeightOffset += this._getRingWeight(i));
                    return ringWeightOffset;
                }
                _getRingWeight(datasetIndex) {
                    return Math.max((0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.v)(this.chart.data.datasets[datasetIndex].weight, 1), 0);
                }
                _getVisibleDatasetWeightTotal() {
                    return this._getRingWeightOffset(this.chart.data.datasets.length) || 1;
                }
            }
            DoughnutController.id = 'doughnut', DoughnutController.defaults = {
                datasetElementType: !1,
                dataElementType: 'arc',
                animation: {
                    animateRotate: !0,
                    animateScale: !1
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
            }, DoughnutController.descriptors = {
                _scriptable: (name)=>'spacing' !== name,
                _indexable: (name)=>'spacing' !== name
            }, DoughnutController.overrides = {
                aspectRatio: 1,
                plugins: {
                    legend: {
                        labels: {
                            generateLabels (chart) {
                                const data = chart.data;
                                if (data.labels.length && data.datasets.length) {
                                    const { labels: { pointStyle  }  } = chart.legend.options;
                                    return data.labels.map((label, i)=>{
                                        const meta = chart.getDatasetMeta(0), style = meta.controller.getStyle(i);
                                        return {
                                            text: label,
                                            fillStyle: style.backgroundColor,
                                            strokeStyle: style.borderColor,
                                            lineWidth: style.borderWidth,
                                            pointStyle: pointStyle,
                                            hidden: !chart.getDataVisibility(i),
                                            index: i
                                        };
                                    });
                                }
                                return [];
                            }
                        },
                        onClick (e, legendItem, legend) {
                            legend.chart.toggleDataVisibility(legendItem.index), legend.chart.update();
                        }
                    },
                    tooltip: {
                        callbacks: {
                            title: ()=>'',
                            label (tooltipItem) {
                                let dataLabel = tooltipItem.label;
                                const value = ': ' + tooltipItem.formattedValue;
                                return (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.b)(dataLabel) ? (dataLabel = dataLabel.slice(), dataLabel[0] += value) : dataLabel += value, dataLabel;
                            }
                        }
                    }
                }
            };
            class LineController extends DatasetController {
                initialize() {
                    this.enableOptionSharing = !0, this.supportsDecimation = !0, super.initialize();
                }
                update(mode) {
                    const meta = this._cachedMeta, { dataset: line , data: points = [] , _dataset  } = meta, animationsDisabled = this.chart._animationsDisabled;
                    let { start , count  } = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.q)(meta, points, animationsDisabled);
                    this._drawStart = start, this._drawCount = count, (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.w)(meta) && (start = 0, count = points.length), line._chart = this.chart, line._datasetIndex = this.index, line._decimated = !!_dataset._decimated, line.points = points;
                    const options = this.resolveDatasetElementOptions(mode);
                    this.options.showLine || (options.borderWidth = 0), options.segment = this.options.segment, this.updateElement(line, void 0, {
                        animated: !animationsDisabled,
                        options
                    }, mode), this.updateElements(points, start, count, mode);
                }
                updateElements(points, start, count, mode) {
                    const reset = 'reset' === mode, { iScale , vScale , _stacked , _dataset  } = this._cachedMeta, { sharedOptions , includeOptions  } = this._getSharedOptions(start, mode), iAxis = iScale.axis, vAxis = vScale.axis, { spanGaps , segment  } = this.options, maxGapLength = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.x)(spanGaps) ? spanGaps : Number.POSITIVE_INFINITY, directUpdate = this.chart._animationsDisabled || reset || 'none' === mode;
                    let prevParsed = start > 0 && this.getParsed(start - 1);
                    for(let i = start; i < start + count; ++i){
                        const point = points[i], parsed = this.getParsed(i), properties = directUpdate ? point : {}, nullData = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.k)(parsed[vAxis]), iPixel = properties[iAxis] = iScale.getPixelForValue(parsed[iAxis], i), vPixel = properties[vAxis] = reset || nullData ? vScale.getBasePixel() : vScale.getPixelForValue(_stacked ? this.applyStack(vScale, parsed, _stacked) : parsed[vAxis], i);
                        properties.skip = isNaN(iPixel) || isNaN(vPixel) || nullData, properties.stop = i > 0 && Math.abs(parsed[iAxis] - prevParsed[iAxis]) > maxGapLength, segment && (properties.parsed = parsed, properties.raw = _dataset.data[i]), includeOptions && (properties.options = sharedOptions || this.resolveDataElementOptions(i, point.active ? 'active' : mode)), directUpdate || this.updateElement(point, i, properties, mode), prevParsed = parsed;
                    }
                }
                getMaxOverflow() {
                    const meta = this._cachedMeta, dataset = meta.dataset, border = dataset.options && dataset.options.borderWidth || 0, data = meta.data || [];
                    if (!data.length) return border;
                    const firstPoint = data[0].size(this.resolveDataElementOptions(0)), lastPoint = data[data.length - 1].size(this.resolveDataElementOptions(data.length - 1));
                    return Math.max(border, firstPoint, lastPoint) / 2;
                }
                draw() {
                    const meta = this._cachedMeta;
                    meta.dataset.updateControlPoints(this.chart.chartArea, meta.iScale.axis), super.draw();
                }
            }
            LineController.id = 'line', LineController.defaults = {
                datasetElementType: 'line',
                dataElementType: 'point',
                showLine: !0,
                spanGaps: !1
            }, LineController.overrides = {
                scales: {
                    _index_: {
                        type: 'category'
                    },
                    _value_: {
                        type: 'linear'
                    }
                }
            };
            class PolarAreaController extends DatasetController {
                constructor(chart, datasetIndex){
                    super(chart, datasetIndex), this.innerRadius = void 0, this.outerRadius = void 0;
                }
                getLabelAndValue(index) {
                    const meta = this._cachedMeta, chart = this.chart, labels = chart.data.labels || [], value = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.o)(meta._parsed[index].r, chart.options.locale);
                    return {
                        label: labels[index] || '',
                        value
                    };
                }
                parseObjectData(meta, data, start, count) {
                    return _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.y.bind(this)(meta, data, start, count);
                }
                update(mode) {
                    const arcs = this._cachedMeta.data;
                    this._updateRadius(), this.updateElements(arcs, 0, arcs.length, mode);
                }
                getMinMax() {
                    const meta = this._cachedMeta, range = {
                        min: Number.POSITIVE_INFINITY,
                        max: Number.NEGATIVE_INFINITY
                    };
                    return meta.data.forEach((element, index)=>{
                        const parsed = this.getParsed(index).r;
                        !isNaN(parsed) && this.chart.getDataVisibility(index) && (parsed < range.min && (range.min = parsed), parsed > range.max && (range.max = parsed));
                    }), range;
                }
                _updateRadius() {
                    const chart = this.chart, chartArea = chart.chartArea, opts = chart.options, minSize = Math.min(chartArea.right - chartArea.left, chartArea.bottom - chartArea.top), outerRadius = Math.max(minSize / 2, 0), innerRadius = Math.max(opts.cutoutPercentage ? outerRadius / 100 * opts.cutoutPercentage : 1, 0), radiusLength = (outerRadius - innerRadius) / chart.getVisibleDatasetCount();
                    this.outerRadius = outerRadius - radiusLength * this.index, this.innerRadius = this.outerRadius - radiusLength;
                }
                updateElements(arcs, start, count, mode) {
                    let i;
                    const reset = 'reset' === mode, chart = this.chart, opts = chart.options, animationOpts = opts.animation, scale = this._cachedMeta.rScale, centerX = scale.xCenter, centerY = scale.yCenter, datasetStartAngle = scale.getIndexAngle(0) - 0.5 * _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.P;
                    let angle = datasetStartAngle;
                    const defaultAngle = 360 / this.countVisibleElements();
                    for(i = 0; i < start; ++i)angle += this._computeAngle(i, mode, defaultAngle);
                    for(i = start; i < start + count; i++){
                        const arc = arcs[i];
                        let startAngle = angle, endAngle = angle + this._computeAngle(i, mode, defaultAngle), outerRadius = chart.getDataVisibility(i) ? scale.getDistanceFromCenterForValue(this.getParsed(i).r) : 0;
                        angle = endAngle, reset && (animationOpts.animateScale && (outerRadius = 0), animationOpts.animateRotate && (startAngle = endAngle = datasetStartAngle));
                        const properties = {
                            x: centerX,
                            y: centerY,
                            innerRadius: 0,
                            outerRadius,
                            startAngle,
                            endAngle,
                            options: this.resolveDataElementOptions(i, arc.active ? 'active' : mode)
                        };
                        this.updateElement(arc, i, properties, mode);
                    }
                }
                countVisibleElements() {
                    const meta = this._cachedMeta;
                    let count = 0;
                    return meta.data.forEach((element, index)=>{
                        !isNaN(this.getParsed(index).r) && this.chart.getDataVisibility(index) && count++;
                    }), count;
                }
                _computeAngle(index, mode, defaultAngle) {
                    return this.chart.getDataVisibility(index) ? (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.t)(this.resolveDataElementOptions(index, mode).angle || defaultAngle) : 0;
                }
            }
            PolarAreaController.id = 'polarArea', PolarAreaController.defaults = {
                dataElementType: 'arc',
                animation: {
                    animateRotate: !0,
                    animateScale: !0
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
            }, PolarAreaController.overrides = {
                aspectRatio: 1,
                plugins: {
                    legend: {
                        labels: {
                            generateLabels (chart) {
                                const data = chart.data;
                                if (data.labels.length && data.datasets.length) {
                                    const { labels: { pointStyle  }  } = chart.legend.options;
                                    return data.labels.map((label, i)=>{
                                        const meta = chart.getDatasetMeta(0), style = meta.controller.getStyle(i);
                                        return {
                                            text: label,
                                            fillStyle: style.backgroundColor,
                                            strokeStyle: style.borderColor,
                                            lineWidth: style.borderWidth,
                                            pointStyle: pointStyle,
                                            hidden: !chart.getDataVisibility(i),
                                            index: i
                                        };
                                    });
                                }
                                return [];
                            }
                        },
                        onClick (e, legendItem, legend) {
                            legend.chart.toggleDataVisibility(legendItem.index), legend.chart.update();
                        }
                    },
                    tooltip: {
                        callbacks: {
                            title: ()=>'',
                            label: (context)=>context.chart.data.labels[context.dataIndex] + ': ' + context.formattedValue
                        }
                    }
                },
                scales: {
                    r: {
                        type: 'radialLinear',
                        angleLines: {
                            display: !1
                        },
                        beginAtZero: !0,
                        grid: {
                            circular: !0
                        },
                        pointLabels: {
                            display: !1
                        },
                        startAngle: 0
                    }
                }
            };
            class PieController extends DoughnutController {
            }
            PieController.id = 'pie', PieController.defaults = {
                cutout: 0,
                rotation: 0,
                circumference: 360,
                radius: '100%'
            };
            class RadarController extends DatasetController {
                getLabelAndValue(index) {
                    const vScale = this._cachedMeta.vScale, parsed = this.getParsed(index);
                    return {
                        label: vScale.getLabels()[index],
                        value: '' + vScale.getLabelForValue(parsed[vScale.axis])
                    };
                }
                parseObjectData(meta, data, start, count) {
                    return _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.y.bind(this)(meta, data, start, count);
                }
                update(mode) {
                    const meta = this._cachedMeta, line = meta.dataset, points = meta.data || [], labels = meta.iScale.getLabels();
                    if (line.points = points, 'resize' !== mode) {
                        const options = this.resolveDatasetElementOptions(mode);
                        this.options.showLine || (options.borderWidth = 0);
                        const properties = {
                            _loop: !0,
                            _fullLoop: labels.length === points.length,
                            options
                        };
                        this.updateElement(line, void 0, properties, mode);
                    }
                    this.updateElements(points, 0, points.length, mode);
                }
                updateElements(points, start, count, mode) {
                    const scale = this._cachedMeta.rScale, reset = 'reset' === mode;
                    for(let i = start; i < start + count; i++){
                        const point = points[i], options = this.resolveDataElementOptions(i, point.active ? 'active' : mode), pointPosition = scale.getPointPositionForValue(i, this.getParsed(i).r), x = reset ? scale.xCenter : pointPosition.x, y = reset ? scale.yCenter : pointPosition.y, properties = {
                            x,
                            y,
                            angle: pointPosition.angle,
                            skip: isNaN(x) || isNaN(y),
                            options
                        };
                        this.updateElement(point, i, properties, mode);
                    }
                }
            }
            RadarController.id = 'radar', RadarController.defaults = {
                datasetElementType: 'line',
                dataElementType: 'point',
                indexAxis: 'r',
                showLine: !0,
                elements: {
                    line: {
                        fill: 'start'
                    }
                }
            }, RadarController.overrides = {
                aspectRatio: 1,
                scales: {
                    r: {
                        type: 'radialLinear'
                    }
                }
            };
            class Element {
                constructor(){
                    this.x = void 0, this.y = void 0, this.active = !1, this.options = void 0, this.$animations = void 0;
                }
                tooltipPosition(useFinalPosition) {
                    const { x , y  } = this.getProps([
                        'x',
                        'y'
                    ], useFinalPosition);
                    return {
                        x,
                        y
                    };
                }
                hasValue() {
                    return (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.x)(this.x) && (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.x)(this.y);
                }
                getProps(props, final) {
                    const anims = this.$animations;
                    if (!final || !anims) return this;
                    const ret = {};
                    return props.forEach((prop)=>{
                        ret[prop] = anims[prop] && anims[prop].active() ? anims[prop]._to : this[prop];
                    }), ret;
                }
            }
            Element.defaults = {}, Element.defaultRoutes = void 0;
            const formatters = {
                values: (value)=>(0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.b)(value) ? value : '' + value,
                numeric (tickValue, index, ticks) {
                    let notation;
                    if (0 === tickValue) return '0';
                    const locale = this.chart.options.locale;
                    let delta = tickValue;
                    if (ticks.length > 1) {
                        let delta1;
                        const maxTick = Math.max(Math.abs(ticks[0].value), Math.abs(ticks[ticks.length - 1].value));
                        (maxTick < 1e-4 || maxTick > 1e+15) && (notation = 'scientific'), Math.abs(delta1 = ticks.length > 3 ? ticks[2].value - ticks[1].value : ticks[1].value - ticks[0].value) >= 1 && tickValue !== Math.floor(tickValue) && (delta1 = tickValue - Math.floor(tickValue)), delta = delta1;
                    }
                    const logDelta = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.z)(Math.abs(delta)), numDecimal = Math.max(Math.min(-1 * Math.floor(logDelta), 20), 0), options = {
                        notation,
                        minimumFractionDigits: numDecimal,
                        maximumFractionDigits: numDecimal
                    };
                    return Object.assign(options, this.options.ticks.format), (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.o)(tickValue, locale, options);
                },
                logarithmic (tickValue, index, ticks) {
                    if (0 === tickValue) return '0';
                    const remain = tickValue / Math.pow(10, Math.floor((0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.z)(tickValue)));
                    return 1 === remain || 2 === remain || 5 === remain ? formatters.numeric.call(this, tickValue, index, ticks) : '';
                }
            };
            var Ticks = {
                formatters
            };
            function skip(ticks, newTicks, spacing, majorStart, majorEnd) {
                let length, i, next;
                const start = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.v)(majorStart, 0), end = Math.min((0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.v)(majorEnd, ticks.length), ticks.length);
                let count = 0;
                for(spacing = Math.ceil(spacing), majorEnd && (spacing = (length = majorEnd - majorStart) / Math.floor(length / spacing)), next = start; next < 0;)next = Math.round(start + ++count * spacing);
                for(i = Math.max(start, 0); i < end; i++)i === next && (newTicks.push(ticks[i]), next = Math.round(start + ++count * spacing));
            }
            _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.d.set('scale', {
                display: !0,
                offset: !1,
                reverse: !1,
                beginAtZero: !1,
                bounds: 'ticks',
                grace: 0,
                grid: {
                    display: !0,
                    lineWidth: 1,
                    drawBorder: !0,
                    drawOnChartArea: !0,
                    drawTicks: !0,
                    tickLength: 8,
                    tickWidth: (_ctx, options)=>options.lineWidth,
                    tickColor: (_ctx, options)=>options.color,
                    offset: !1,
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderWidth: 1
                },
                title: {
                    display: !1,
                    text: '',
                    padding: {
                        top: 4,
                        bottom: 4
                    }
                },
                ticks: {
                    minRotation: 0,
                    maxRotation: 50,
                    mirror: !1,
                    textStrokeWidth: 0,
                    textStrokeColor: '',
                    padding: 3,
                    display: !0,
                    autoSkip: !0,
                    autoSkipPadding: 3,
                    labelOffset: 0,
                    callback: Ticks.formatters.values,
                    minor: {},
                    major: {},
                    align: 'center',
                    crossAlign: 'near',
                    showLabelBackdrop: !1,
                    backdropColor: 'rgba(255, 255, 255, 0.75)',
                    backdropPadding: 2
                }
            }), _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.d.route('scale.ticks', 'color', '', 'color'), _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.d.route('scale.grid', 'color', '', 'borderColor'), _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.d.route('scale.grid', 'borderColor', '', 'borderColor'), _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.d.route('scale.title', 'color', '', 'color'), _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.d.describe('scale', {
                _fallback: !1,
                _scriptable: (name)=>!name.startsWith('before') && !name.startsWith('after') && 'callback' !== name && 'parser' !== name,
                _indexable: (name)=>'borderDash' !== name && 'tickBorderDash' !== name
            }), _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.d.describe('scales', {
                _fallback: 'scale'
            }), _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.d.describe('scale.ticks', {
                _scriptable: (name)=>'backdropPadding' !== name && 'callback' !== name,
                _indexable: (name)=>'backdropPadding' !== name
            });
            const reverseAlign = (align)=>'left' === align ? 'right' : 'right' === align ? 'left' : align, offsetFromEdge = (scale, edge, offset)=>'top' === edge || 'left' === edge ? scale[edge] + offset : scale[edge] - offset;
            function sample(arr, numItems) {
                const result = [], increment = arr.length / numItems, len = arr.length;
                let i = 0;
                for(; i < len; i += increment)result.push(arr[Math.floor(i)]);
                return result;
            }
            function getPixelForGridLine(scale, index, offsetGridLines) {
                let offset;
                const length = scale.ticks.length, validIndex = Math.min(index, length - 1), start = scale._startPixel, end = scale._endPixel;
                let lineValue = scale.getPixelForTick(validIndex);
                if (!offsetGridLines || (offset = 1 === length ? Math.max(lineValue - start, end - lineValue) : 0 === index ? (scale.getPixelForTick(1) - lineValue) / 2 : (lineValue - scale.getPixelForTick(validIndex - 1)) / 2, !((lineValue += validIndex < index ? offset : -offset) < start - 1e-6) && !(lineValue > end + 1e-6))) return lineValue;
            }
            function getTickMarkLength(options) {
                return options.drawTicks ? options.tickLength : 0;
            }
            function getTitleHeight(options, fallback) {
                if (!options.display) return 0;
                const font = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.O)(options.font, fallback), padding = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.K)(options.padding), lines = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.b)(options.text) ? options.text.length : 1;
                return lines * font.lineHeight + padding.height;
            }
            class Scale extends Element {
                constructor(cfg){
                    super(), this.id = cfg.id, this.type = cfg.type, this.options = void 0, this.ctx = cfg.ctx, this.chart = cfg.chart, this.top = void 0, this.bottom = void 0, this.left = void 0, this.right = void 0, this.width = void 0, this.height = void 0, this._margins = {
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0
                    }, this.maxWidth = void 0, this.maxHeight = void 0, this.paddingTop = void 0, this.paddingBottom = void 0, this.paddingLeft = void 0, this.paddingRight = void 0, this.axis = void 0, this.labelRotation = void 0, this.min = void 0, this.max = void 0, this._range = void 0, this.ticks = [], this._gridLineItems = null, this._labelItems = null, this._labelSizes = null, this._length = 0, this._maxLength = 0, this._longestTextCache = {}, this._startPixel = void 0, this._endPixel = void 0, this._reversePixels = !1, this._userMax = void 0, this._userMin = void 0, this._suggestedMax = void 0, this._suggestedMin = void 0, this._ticksLength = 0, this._borderValue = 0, this._cache = {}, this._dataLimitsCached = !1, this.$context = void 0;
                }
                init(options) {
                    this.options = options.setContext(this.getContext()), this.axis = options.axis, this._userMin = this.parse(options.min), this._userMax = this.parse(options.max), this._suggestedMin = this.parse(options.suggestedMin), this._suggestedMax = this.parse(options.suggestedMax);
                }
                parse(raw, index) {
                    return raw;
                }
                getUserBounds() {
                    let { _userMin , _userMax , _suggestedMin , _suggestedMax  } = this;
                    return _userMin = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.B)(_userMin, Number.POSITIVE_INFINITY), _userMax = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.B)(_userMax, Number.NEGATIVE_INFINITY), _suggestedMin = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.B)(_suggestedMin, Number.POSITIVE_INFINITY), _suggestedMax = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.B)(_suggestedMax, Number.NEGATIVE_INFINITY), {
                        min: (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.B)(_userMin, _suggestedMin),
                        max: (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.B)(_userMax, _suggestedMax),
                        minDefined: (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.g)(_userMin),
                        maxDefined: (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.g)(_userMax)
                    };
                }
                getMinMax(canStack) {
                    let range, { min , max , minDefined , maxDefined  } = this.getUserBounds();
                    if (minDefined && maxDefined) return {
                        min,
                        max
                    };
                    const metas = this.getMatchingVisibleMetas();
                    for(let i = 0, ilen = metas.length; i < ilen; ++i)range = metas[i].controller.getMinMax(this, canStack), minDefined || (min = Math.min(min, range.min)), maxDefined || (max = Math.max(max, range.max));
                    return min = maxDefined && min > max ? max : min, max = minDefined && min > max ? min : max, {
                        min: (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.B)(min, (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.B)(max, min)),
                        max: (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.B)(max, (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.B)(min, max))
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
                    const data = this.chart.data;
                    return this.options.labels || (this.isHorizontal() ? data.xLabels : data.yLabels) || data.labels || [];
                }
                beforeLayout() {
                    this._cache = {}, this._dataLimitsCached = !1;
                }
                beforeUpdate() {
                    (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.C)(this.options.beforeUpdate, [
                        this
                    ]);
                }
                update(maxWidth, maxHeight, margins) {
                    const { beginAtZero , grace , ticks: tickOpts  } = this.options, sampleSize = tickOpts.sampleSize;
                    this.beforeUpdate(), this.maxWidth = maxWidth, this.maxHeight = maxHeight, this._margins = margins = Object.assign({
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0
                    }, margins), this.ticks = null, this._labelSizes = null, this._gridLineItems = null, this._labelItems = null, this.beforeSetDimensions(), this.setDimensions(), this.afterSetDimensions(), this._maxLength = this.isHorizontal() ? this.width + margins.left + margins.right : this.height + margins.top + margins.bottom, this._dataLimitsCached || (this.beforeDataLimits(), this.determineDataLimits(), this.afterDataLimits(), this._range = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.D)(this, grace, beginAtZero), this._dataLimitsCached = !0), this.beforeBuildTicks(), this.ticks = this.buildTicks() || [], this.afterBuildTicks();
                    const samplingEnabled = sampleSize < this.ticks.length;
                    this._convertTicksToLabels(samplingEnabled ? sample(this.ticks, sampleSize) : this.ticks), this.configure(), this.beforeCalculateLabelRotation(), this.calculateLabelRotation(), this.afterCalculateLabelRotation(), tickOpts.display && (tickOpts.autoSkip || 'auto' === tickOpts.source) && (this.ticks = function(scale, ticks) {
                        const tickOpts = scale.options.ticks, ticksLimit = tickOpts.maxTicksLimit || function(scale) {
                            const offset = scale.options.offset, tickLength = scale._tickSize(), maxScale = scale._length / tickLength + (offset ? 0 : 1), maxChart = scale._maxLength / tickLength;
                            return Math.floor(Math.min(maxScale, maxChart));
                        }(scale), majorIndices = tickOpts.major.enabled ? function(ticks) {
                            let i, ilen;
                            const result = [];
                            for(i = 0, ilen = ticks.length; i < ilen; i++)ticks[i].major && result.push(i);
                            return result;
                        }(ticks) : [], numMajorIndices = majorIndices.length, first = majorIndices[0], last = majorIndices[numMajorIndices - 1], newTicks = [];
                        if (numMajorIndices > ticksLimit) return function(ticks, newTicks, majorIndices, spacing) {
                            let i, count = 0, next = majorIndices[0];
                            for(i = 0, spacing = Math.ceil(spacing); i < ticks.length; i++)i === next && (newTicks.push(ticks[i]), next = majorIndices[++count * spacing]);
                        }(ticks, newTicks, majorIndices, numMajorIndices / ticksLimit), newTicks;
                        const spacing = function(majorIndices, ticks, ticksLimit) {
                            const evenMajorSpacing = function(arr) {
                                let i, diff;
                                const len = arr.length;
                                if (len < 2) return !1;
                                for(diff = arr[0], i = 1; i < len; ++i)if (arr[i] - arr[i - 1] !== diff) return !1;
                                return diff;
                            }(majorIndices), spacing = ticks.length / ticksLimit;
                            if (!evenMajorSpacing) return Math.max(spacing, 1);
                            const factors = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.A)(evenMajorSpacing);
                            for(let i = 0, ilen = factors.length - 1; i < ilen; i++){
                                const factor = factors[i];
                                if (factor > spacing) return factor;
                            }
                            return Math.max(spacing, 1);
                        }(majorIndices, ticks, ticksLimit);
                        if (numMajorIndices > 0) {
                            let i, ilen;
                            const avgMajorSpacing = numMajorIndices > 1 ? Math.round((last - first) / (numMajorIndices - 1)) : null;
                            for(skip(ticks, newTicks, spacing, (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.k)(avgMajorSpacing) ? 0 : first - avgMajorSpacing, first), i = 0, ilen = numMajorIndices - 1; i < ilen; i++)skip(ticks, newTicks, spacing, majorIndices[i], majorIndices[i + 1]);
                            return skip(ticks, newTicks, spacing, last, (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.k)(avgMajorSpacing) ? ticks.length : last + avgMajorSpacing), newTicks;
                        }
                        return skip(ticks, newTicks, spacing), newTicks;
                    }(this, this.ticks), this._labelSizes = null, this.afterAutoSkip()), samplingEnabled && this._convertTicksToLabels(this.ticks), this.beforeFit(), this.fit(), this.afterFit(), this.afterUpdate();
                }
                configure() {
                    let startPixel, endPixel, reversePixels = this.options.reverse;
                    this.isHorizontal() ? (startPixel = this.left, endPixel = this.right) : (startPixel = this.top, endPixel = this.bottom, reversePixels = !reversePixels), this._startPixel = startPixel, this._endPixel = endPixel, this._reversePixels = reversePixels, this._length = endPixel - startPixel, this._alignToPixels = this.options.alignToPixels;
                }
                afterUpdate() {
                    (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.C)(this.options.afterUpdate, [
                        this
                    ]);
                }
                beforeSetDimensions() {
                    (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.C)(this.options.beforeSetDimensions, [
                        this
                    ]);
                }
                setDimensions() {
                    this.isHorizontal() ? (this.width = this.maxWidth, this.left = 0, this.right = this.width) : (this.height = this.maxHeight, this.top = 0, this.bottom = this.height), this.paddingLeft = 0, this.paddingTop = 0, this.paddingRight = 0, this.paddingBottom = 0;
                }
                afterSetDimensions() {
                    (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.C)(this.options.afterSetDimensions, [
                        this
                    ]);
                }
                _callHooks(name) {
                    this.chart.notifyPlugins(name, this.getContext()), (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.C)(this.options[name], [
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
                    (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.C)(this.options.beforeTickToLabelConversion, [
                        this
                    ]);
                }
                generateTickLabels(ticks) {
                    let i, ilen, tick;
                    const tickOpts = this.options.ticks;
                    for(i = 0, ilen = ticks.length; i < ilen; i++)(tick = ticks[i]).label = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.C)(tickOpts.callback, [
                        tick.value,
                        i,
                        ticks
                    ], this);
                }
                afterTickToLabelConversion() {
                    (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.C)(this.options.afterTickToLabelConversion, [
                        this
                    ]);
                }
                beforeCalculateLabelRotation() {
                    (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.C)(this.options.beforeCalculateLabelRotation, [
                        this
                    ]);
                }
                calculateLabelRotation() {
                    let tickWidth, maxHeight, maxLabelDiagonal;
                    const options = this.options, tickOpts = options.ticks, numTicks = this.ticks.length, minRotation = tickOpts.minRotation || 0, maxRotation = tickOpts.maxRotation;
                    let labelRotation = minRotation;
                    if (!this._isVisible() || !tickOpts.display || minRotation >= maxRotation || numTicks <= 1 || !this.isHorizontal()) {
                        this.labelRotation = minRotation;
                        return;
                    }
                    const labelSizes = this._getLabelSizes(), maxLabelWidth = labelSizes.widest.width, maxLabelHeight = labelSizes.highest.height, maxWidth = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.E)(this.chart.width - maxLabelWidth, 0, this.maxWidth);
                    maxLabelWidth + 6 > (tickWidth = options.offset ? this.maxWidth / numTicks : maxWidth / (numTicks - 1)) && (tickWidth = maxWidth / (numTicks - (options.offset ? 0.5 : 1)), maxHeight = this.maxHeight - getTickMarkLength(options.grid) - tickOpts.padding - getTitleHeight(options.title, this.chart.options.font), maxLabelDiagonal = Math.sqrt(maxLabelWidth * maxLabelWidth + maxLabelHeight * maxLabelHeight), labelRotation = Math.max(minRotation, Math.min(maxRotation, labelRotation = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.F)(Math.min(Math.asin((0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.E)((labelSizes.highest.height + 6) / tickWidth, -1, 1)), Math.asin((0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.E)(maxHeight / maxLabelDiagonal, -1, 1)) - Math.asin((0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.E)(maxLabelHeight / maxLabelDiagonal, -1, 1))))))), this.labelRotation = labelRotation;
                }
                afterCalculateLabelRotation() {
                    (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.C)(this.options.afterCalculateLabelRotation, [
                        this
                    ]);
                }
                afterAutoSkip() {}
                beforeFit() {
                    (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.C)(this.options.beforeFit, [
                        this
                    ]);
                }
                fit() {
                    const minSize = {
                        width: 0,
                        height: 0
                    }, { chart , options: { ticks: tickOpts , title: titleOpts , grid: gridOpts  }  } = this, display = this._isVisible(), isHorizontal = this.isHorizontal();
                    if (display) {
                        const titleHeight = getTitleHeight(titleOpts, chart.options.font);
                        if (isHorizontal ? (minSize.width = this.maxWidth, minSize.height = getTickMarkLength(gridOpts) + titleHeight) : (minSize.height = this.maxHeight, minSize.width = getTickMarkLength(gridOpts) + titleHeight), tickOpts.display && this.ticks.length) {
                            const { first , last , widest , highest  } = this._getLabelSizes(), tickPadding = 2 * tickOpts.padding, angleRadians = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.t)(this.labelRotation), cos = Math.cos(angleRadians), sin = Math.sin(angleRadians);
                            if (isHorizontal) {
                                const labelHeight = tickOpts.mirror ? 0 : sin * widest.width + cos * highest.height;
                                minSize.height = Math.min(this.maxHeight, minSize.height + labelHeight + tickPadding);
                            } else {
                                const labelWidth = tickOpts.mirror ? 0 : cos * widest.width + sin * highest.height;
                                minSize.width = Math.min(this.maxWidth, minSize.width + labelWidth + tickPadding);
                            }
                            this._calculatePadding(first, last, sin, cos);
                        }
                    }
                    this._handleMargins(), isHorizontal ? (this.width = this._length = chart.width - this._margins.left - this._margins.right, this.height = minSize.height) : (this.width = minSize.width, this.height = this._length = chart.height - this._margins.top - this._margins.bottom);
                }
                _calculatePadding(first, last, sin, cos) {
                    const { ticks: { align , padding  } , position  } = this.options, isRotated = 0 !== this.labelRotation, labelsBelowTicks = 'top' !== position && 'x' === this.axis;
                    if (this.isHorizontal()) {
                        const offsetLeft = this.getPixelForTick(0) - this.left, offsetRight = this.right - this.getPixelForTick(this.ticks.length - 1);
                        let paddingLeft = 0, paddingRight = 0;
                        isRotated ? labelsBelowTicks ? (paddingLeft = cos * first.width, paddingRight = sin * last.height) : (paddingLeft = sin * first.height, paddingRight = cos * last.width) : 'start' === align ? paddingRight = last.width : 'end' === align ? paddingLeft = first.width : 'inner' !== align && (paddingLeft = first.width / 2, paddingRight = last.width / 2), this.paddingLeft = Math.max((paddingLeft - offsetLeft + padding) * this.width / (this.width - offsetLeft), 0), this.paddingRight = Math.max((paddingRight - offsetRight + padding) * this.width / (this.width - offsetRight), 0);
                    } else {
                        let paddingTop = last.height / 2, paddingBottom = first.height / 2;
                        'start' === align ? (paddingTop = 0, paddingBottom = first.height) : 'end' === align && (paddingTop = last.height, paddingBottom = 0), this.paddingTop = paddingTop + padding, this.paddingBottom = paddingBottom + padding;
                    }
                }
                _handleMargins() {
                    this._margins && (this._margins.left = Math.max(this.paddingLeft, this._margins.left), this._margins.top = Math.max(this.paddingTop, this._margins.top), this._margins.right = Math.max(this.paddingRight, this._margins.right), this._margins.bottom = Math.max(this.paddingBottom, this._margins.bottom));
                }
                afterFit() {
                    (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.C)(this.options.afterFit, [
                        this
                    ]);
                }
                isHorizontal() {
                    const { axis , position  } = this.options;
                    return 'top' === position || 'bottom' === position || 'x' === axis;
                }
                isFullSize() {
                    return this.options.fullSize;
                }
                _convertTicksToLabels(ticks) {
                    let i, ilen;
                    for(this.beforeTickToLabelConversion(), this.generateTickLabels(ticks), i = 0, ilen = ticks.length; i < ilen; i++)(0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.k)(ticks[i].label) && (ticks.splice(i, 1), ilen--, i--);
                    this.afterTickToLabelConversion();
                }
                _getLabelSizes() {
                    let labelSizes = this._labelSizes;
                    if (!labelSizes) {
                        const sampleSize = this.options.ticks.sampleSize;
                        let ticks = this.ticks;
                        sampleSize < ticks.length && (ticks = sample(ticks, sampleSize)), this._labelSizes = labelSizes = this._computeLabelSizes(ticks, ticks.length);
                    }
                    return labelSizes;
                }
                _computeLabelSizes(ticks, length) {
                    let i, j, jlen, label, tickFont, fontString, cache, lineHeight, width, height, nestedLabel;
                    const { ctx , _longestTextCache: caches  } = this, widths = [], heights = [];
                    let widestLabelSize = 0, highestLabelSize = 0;
                    for(i = 0; i < length; ++i){
                        if (label = ticks[i].label, tickFont = this._resolveTickFontOptions(i), ctx.font = fontString = tickFont.string, cache = caches[fontString] = caches[fontString] || {
                            data: {},
                            gc: []
                        }, lineHeight = tickFont.lineHeight, width = height = 0, (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.k)(label) || (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.b)(label)) {
                            if ((0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.b)(label)) for(j = 0, jlen = label.length; j < jlen; ++j)nestedLabel = label[j], (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.k)(nestedLabel) || (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.b)(nestedLabel) || (width = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.G)(ctx, cache.data, cache.gc, width, nestedLabel), height += lineHeight);
                        } else width = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.G)(ctx, cache.data, cache.gc, width, label), height = lineHeight;
                        widths.push(width), heights.push(height), widestLabelSize = Math.max(width, widestLabelSize), highestLabelSize = Math.max(height, highestLabelSize);
                    }
                    (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.Q)(caches, (cache)=>{
                        let i;
                        const gc = cache.gc, gcLen = gc.length / 2;
                        if (gcLen > length) {
                            for(i = 0; i < gcLen; ++i)delete cache.data[gc[i]];
                            gc.splice(0, gcLen);
                        }
                    });
                    const widest = widths.indexOf(widestLabelSize), highest = heights.indexOf(highestLabelSize), valueAt = (idx)=>({
                            width: widths[idx] || 0,
                            height: heights[idx] || 0
                        });
                    return {
                        first: valueAt(0),
                        last: valueAt(length - 1),
                        widest: valueAt(widest),
                        highest: valueAt(highest),
                        widths,
                        heights
                    };
                }
                getLabelForValue(value) {
                    return value;
                }
                getPixelForValue(value, index) {
                    return NaN;
                }
                getValueForPixel(pixel) {}
                getPixelForTick(index) {
                    const ticks = this.ticks;
                    return index < 0 || index > ticks.length - 1 ? null : this.getPixelForValue(ticks[index].value);
                }
                getPixelForDecimal(decimal) {
                    this._reversePixels && (decimal = 1 - decimal);
                    const pixel = this._startPixel + decimal * this._length;
                    return (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.I)(this._alignToPixels ? (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.J)(this.chart, pixel, 0) : pixel);
                }
                getDecimalForPixel(pixel) {
                    const decimal = (pixel - this._startPixel) / this._length;
                    return this._reversePixels ? 1 - decimal : decimal;
                }
                getBasePixel() {
                    return this.getPixelForValue(this.getBaseValue());
                }
                getBaseValue() {
                    const { min , max  } = this;
                    return min < 0 && max < 0 ? max : min > 0 && max > 0 ? min : 0;
                }
                getContext(index) {
                    var parent, index1, tick, parent1;
                    const ticks = this.ticks || [];
                    if (index >= 0 && index < ticks.length) {
                        const tick1 = ticks[index];
                        return tick1.$context || (tick1.$context = (parent = this.getContext(), index1 = index, tick = tick1, (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.h)(parent, {
                            tick,
                            index: index1,
                            type: 'tick'
                        })));
                    }
                    return this.$context || (this.$context = (parent1 = this.chart.getContext(), (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.h)(parent1, {
                        scale: this,
                        type: 'scale'
                    })));
                }
                _tickSize() {
                    const optionTicks = this.options.ticks, rot = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.t)(this.labelRotation), cos = Math.abs(Math.cos(rot)), sin = Math.abs(Math.sin(rot)), labelSizes = this._getLabelSizes(), padding = optionTicks.autoSkipPadding || 0, w = labelSizes ? labelSizes.widest.width + padding : 0, h = labelSizes ? labelSizes.highest.height + padding : 0;
                    return this.isHorizontal() ? h * cos > w * sin ? w / cos : h / sin : h * sin < w * cos ? h / cos : w / sin;
                }
                _isVisible() {
                    const display = this.options.display;
                    return 'auto' !== display ? !!display : this.getMatchingVisibleMetas().length > 0;
                }
                _computeGridLineItems(chartArea) {
                    let borderValue, i, lineValue, alignedLineValue, tx1, ty1, tx2, ty2, x1, y1, x2, y2;
                    const axis = this.axis, chart = this.chart, options = this.options, { grid , position  } = options, offset = grid.offset, isHorizontal = this.isHorizontal(), ticks = this.ticks, ticksLength = ticks.length + (offset ? 1 : 0), tl = getTickMarkLength(grid), items = [], borderOpts = grid.setContext(this.getContext()), axisWidth = borderOpts.drawBorder ? borderOpts.borderWidth : 0, axisHalfWidth = axisWidth / 2, alignBorderValue = function(pixel) {
                        return (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.J)(chart, pixel, axisWidth);
                    };
                    if ('top' === position) borderValue = alignBorderValue(this.bottom), ty1 = this.bottom - tl, ty2 = borderValue - axisHalfWidth, y1 = alignBorderValue(chartArea.top) + axisHalfWidth, y2 = chartArea.bottom;
                    else if ('bottom' === position) borderValue = alignBorderValue(this.top), y1 = chartArea.top, y2 = alignBorderValue(chartArea.bottom) - axisHalfWidth, ty1 = borderValue + axisHalfWidth, ty2 = this.top + tl;
                    else if ('left' === position) borderValue = alignBorderValue(this.right), tx1 = this.right - tl, tx2 = borderValue - axisHalfWidth, x1 = alignBorderValue(chartArea.left) + axisHalfWidth, x2 = chartArea.right;
                    else if ('right' === position) borderValue = alignBorderValue(this.left), x1 = chartArea.left, x2 = alignBorderValue(chartArea.right) - axisHalfWidth, tx1 = borderValue + axisHalfWidth, tx2 = this.left + tl;
                    else if ('x' === axis) {
                        if ('center' === position) borderValue = alignBorderValue((chartArea.top + chartArea.bottom) / 2 + 0.5);
                        else if ((0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.i)(position)) {
                            const positionAxisID = Object.keys(position)[0], value = position[positionAxisID];
                            borderValue = alignBorderValue(this.chart.scales[positionAxisID].getPixelForValue(value));
                        }
                        y1 = chartArea.top, y2 = chartArea.bottom, ty2 = (ty1 = borderValue + axisHalfWidth) + tl;
                    } else if ('y' === axis) {
                        if ('center' === position) borderValue = alignBorderValue((chartArea.left + chartArea.right) / 2);
                        else if ((0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.i)(position)) {
                            const positionAxisID1 = Object.keys(position)[0], value1 = position[positionAxisID1];
                            borderValue = alignBorderValue(this.chart.scales[positionAxisID1].getPixelForValue(value1));
                        }
                        tx2 = (tx1 = borderValue - axisHalfWidth) - tl, x1 = chartArea.left, x2 = chartArea.right;
                    }
                    const limit = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.v)(options.ticks.maxTicksLimit, ticksLength), step = Math.max(1, Math.ceil(ticksLength / limit));
                    for(i = 0; i < ticksLength; i += step){
                        const optsAtIndex = grid.setContext(this.getContext(i)), lineWidth = optsAtIndex.lineWidth, lineColor = optsAtIndex.color, borderDash = optsAtIndex.borderDash || [], borderDashOffset = optsAtIndex.borderDashOffset, tickWidth = optsAtIndex.tickWidth, tickColor = optsAtIndex.tickColor, tickBorderDash = optsAtIndex.tickBorderDash || [], tickBorderDashOffset = optsAtIndex.tickBorderDashOffset;
                        void 0 !== (lineValue = getPixelForGridLine(this, i, offset)) && (alignedLineValue = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.J)(chart, lineValue, lineWidth), isHorizontal ? tx1 = tx2 = x1 = x2 = alignedLineValue : ty1 = ty2 = y1 = y2 = alignedLineValue, items.push({
                            tx1,
                            ty1,
                            tx2,
                            ty2,
                            x1,
                            y1,
                            x2,
                            y2,
                            width: lineWidth,
                            color: lineColor,
                            borderDash,
                            borderDashOffset,
                            tickWidth,
                            tickColor,
                            tickBorderDash,
                            tickBorderDashOffset
                        }));
                    }
                    return this._ticksLength = ticksLength, this._borderValue = borderValue, items;
                }
                _computeLabelItems(chartArea) {
                    let i, ilen, label, x, y, textAlign, pixel, font, lineHeight, lineCount, textOffset;
                    const axis = this.axis, options = this.options, { position , ticks: optionTicks  } = options, isHorizontal = this.isHorizontal(), ticks = this.ticks, { align , crossAlign , padding , mirror  } = optionTicks, tl = getTickMarkLength(options.grid), tickAndPadding = tl + padding, hTickAndPadding = mirror ? -padding : tickAndPadding, rotation = -(0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.t)(this.labelRotation), items = [];
                    let textBaseline = 'middle';
                    if ('top' === position) y = this.bottom - hTickAndPadding, textAlign = this._getXAxisLabelAlignment();
                    else if ('bottom' === position) y = this.top + hTickAndPadding, textAlign = this._getXAxisLabelAlignment();
                    else if ('left' === position) {
                        const ret = this._getYAxisLabelAlignment(tl);
                        textAlign = ret.textAlign, x = ret.x;
                    } else if ('right' === position) {
                        const ret1 = this._getYAxisLabelAlignment(tl);
                        textAlign = ret1.textAlign, x = ret1.x;
                    } else if ('x' === axis) {
                        if ('center' === position) y = (chartArea.top + chartArea.bottom) / 2 + tickAndPadding;
                        else if ((0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.i)(position)) {
                            const positionAxisID = Object.keys(position)[0], value = position[positionAxisID];
                            y = this.chart.scales[positionAxisID].getPixelForValue(value) + tickAndPadding;
                        }
                        textAlign = this._getXAxisLabelAlignment();
                    } else if ('y' === axis) {
                        if ('center' === position) x = (chartArea.left + chartArea.right) / 2 - tickAndPadding;
                        else if ((0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.i)(position)) {
                            const positionAxisID1 = Object.keys(position)[0], value1 = position[positionAxisID1];
                            x = this.chart.scales[positionAxisID1].getPixelForValue(value1);
                        }
                        textAlign = this._getYAxisLabelAlignment(tl).textAlign;
                    }
                    'y' === axis && ('start' === align ? textBaseline = 'top' : 'end' === align && (textBaseline = 'bottom'));
                    const labelSizes = this._getLabelSizes();
                    for(i = 0, ilen = ticks.length; i < ilen; ++i){
                        let backdrop;
                        label = ticks[i].label;
                        const optsAtIndex = optionTicks.setContext(this.getContext(i));
                        pixel = this.getPixelForTick(i) + optionTicks.labelOffset, lineHeight = (font = this._resolveTickFontOptions(i)).lineHeight, lineCount = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.b)(label) ? label.length : 1;
                        const halfCount = lineCount / 2, color = optsAtIndex.color, strokeColor = optsAtIndex.textStrokeColor, strokeWidth = optsAtIndex.textStrokeWidth;
                        let tickTextAlign = textAlign;
                        if (isHorizontal ? (x = pixel, 'inner' === textAlign && (tickTextAlign = i === ilen - 1 ? this.options.reverse ? 'left' : 'right' : 0 === i ? this.options.reverse ? 'right' : 'left' : 'center'), textOffset = 'top' === position ? 'near' === crossAlign || 0 !== rotation ? -lineCount * lineHeight + lineHeight / 2 : 'center' === crossAlign ? -labelSizes.highest.height / 2 - halfCount * lineHeight + lineHeight : -labelSizes.highest.height + lineHeight / 2 : 'near' === crossAlign || 0 !== rotation ? lineHeight / 2 : 'center' === crossAlign ? labelSizes.highest.height / 2 - halfCount * lineHeight : labelSizes.highest.height - lineCount * lineHeight, mirror && (textOffset *= -1)) : (y = pixel, textOffset = (1 - lineCount) * lineHeight / 2), optsAtIndex.showLabelBackdrop) {
                            const labelPadding = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.K)(optsAtIndex.backdropPadding), height = labelSizes.heights[i], width = labelSizes.widths[i];
                            let top = y + textOffset - labelPadding.top, left = x - labelPadding.left;
                            switch(textBaseline){
                                case 'middle':
                                    top -= height / 2;
                                    break;
                                case 'bottom':
                                    top -= height;
                            }
                            switch(textAlign){
                                case 'center':
                                    left -= width / 2;
                                    break;
                                case 'right':
                                    left -= width;
                            }
                            backdrop = {
                                left,
                                top,
                                width: width + labelPadding.width,
                                height: height + labelPadding.height,
                                color: optsAtIndex.backdropColor
                            };
                        }
                        items.push({
                            rotation,
                            label,
                            font,
                            color,
                            strokeColor,
                            strokeWidth,
                            textOffset,
                            textAlign: tickTextAlign,
                            textBaseline,
                            translation: [
                                x,
                                y
                            ],
                            backdrop
                        });
                    }
                    return items;
                }
                _getXAxisLabelAlignment() {
                    const { position , ticks  } = this.options, rotation = -(0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.t)(this.labelRotation);
                    if (rotation) return 'top' === position ? 'left' : 'right';
                    let align = 'center';
                    return 'start' === ticks.align ? align = 'left' : 'end' === ticks.align ? align = 'right' : 'inner' === ticks.align && (align = 'inner'), align;
                }
                _getYAxisLabelAlignment(tl) {
                    let textAlign, x;
                    const { position , ticks: { crossAlign , mirror , padding  }  } = this.options, labelSizes = this._getLabelSizes(), tickAndPadding = tl + padding, widest = labelSizes.widest.width;
                    return 'left' === position ? mirror ? (x = this.right + padding, 'near' === crossAlign ? textAlign = 'left' : 'center' === crossAlign ? (textAlign = 'center', x += widest / 2) : (textAlign = 'right', x += widest)) : (x = this.right - tickAndPadding, 'near' === crossAlign ? textAlign = 'right' : 'center' === crossAlign ? (textAlign = 'center', x -= widest / 2) : (textAlign = 'left', x = this.left)) : 'right' === position ? mirror ? (x = this.left + padding, 'near' === crossAlign ? textAlign = 'right' : 'center' === crossAlign ? (textAlign = 'center', x -= widest / 2) : (textAlign = 'left', x -= widest)) : (x = this.left + tickAndPadding, 'near' === crossAlign ? textAlign = 'left' : 'center' === crossAlign ? (textAlign = 'center', x += widest / 2) : (textAlign = 'right', x = this.right)) : textAlign = 'right', {
                        textAlign,
                        x
                    };
                }
                _computeLabelArea() {
                    if (this.options.ticks.mirror) return;
                    const chart = this.chart, position = this.options.position;
                    return 'left' === position || 'right' === position ? {
                        top: 0,
                        left: this.left,
                        bottom: chart.height,
                        right: this.right
                    } : 'top' === position || 'bottom' === position ? {
                        top: this.top,
                        left: 0,
                        bottom: this.bottom,
                        right: chart.width
                    } : void 0;
                }
                drawBackground() {
                    const { ctx , options: { backgroundColor  } , left , top , width , height  } = this;
                    backgroundColor && (ctx.save(), ctx.fillStyle = backgroundColor, ctx.fillRect(left, top, width, height), ctx.restore());
                }
                getLineWidthForValue(value) {
                    const grid = this.options.grid;
                    if (!this._isVisible() || !grid.display) return 0;
                    const ticks = this.ticks, index = ticks.findIndex((t)=>t.value === value);
                    if (index >= 0) {
                        const opts = grid.setContext(this.getContext(index));
                        return opts.lineWidth;
                    }
                    return 0;
                }
                drawGrid(chartArea) {
                    let i, ilen;
                    const grid = this.options.grid, ctx = this.ctx, items = this._gridLineItems || (this._gridLineItems = this._computeGridLineItems(chartArea)), drawLine = (p1, p2, style)=>{
                        style.width && style.color && (ctx.save(), ctx.lineWidth = style.width, ctx.strokeStyle = style.color, ctx.setLineDash(style.borderDash || []), ctx.lineDashOffset = style.borderDashOffset, ctx.beginPath(), ctx.moveTo(p1.x, p1.y), ctx.lineTo(p2.x, p2.y), ctx.stroke(), ctx.restore());
                    };
                    if (grid.display) for(i = 0, ilen = items.length; i < ilen; ++i){
                        const item = items[i];
                        grid.drawOnChartArea && drawLine({
                            x: item.x1,
                            y: item.y1
                        }, {
                            x: item.x2,
                            y: item.y2
                        }, item), grid.drawTicks && drawLine({
                            x: item.tx1,
                            y: item.ty1
                        }, {
                            x: item.tx2,
                            y: item.ty2
                        }, {
                            color: item.tickColor,
                            width: item.tickWidth,
                            borderDash: item.tickBorderDash,
                            borderDashOffset: item.tickBorderDashOffset
                        });
                    }
                }
                drawBorder() {
                    let x1, x2, y1, y2;
                    const { chart , ctx , options: { grid  }  } = this, borderOpts = grid.setContext(this.getContext()), axisWidth = grid.drawBorder ? borderOpts.borderWidth : 0;
                    if (!axisWidth) return;
                    const lastLineWidth = grid.setContext(this.getContext(0)).lineWidth, borderValue = this._borderValue;
                    this.isHorizontal() ? (x1 = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.J)(chart, this.left, axisWidth) - axisWidth / 2, x2 = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.J)(chart, this.right, lastLineWidth) + lastLineWidth / 2, y1 = y2 = borderValue) : (y1 = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.J)(chart, this.top, axisWidth) - axisWidth / 2, y2 = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.J)(chart, this.bottom, lastLineWidth) + lastLineWidth / 2, x1 = x2 = borderValue), ctx.save(), ctx.lineWidth = borderOpts.borderWidth, ctx.strokeStyle = borderOpts.borderColor, ctx.beginPath(), ctx.moveTo(x1, y1), ctx.lineTo(x2, y2), ctx.stroke(), ctx.restore();
                }
                drawLabels(chartArea) {
                    let i, ilen;
                    const optionTicks = this.options.ticks;
                    if (!optionTicks.display) return;
                    const ctx = this.ctx, area = this._computeLabelArea();
                    area && (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.L)(ctx, area);
                    const items = this._labelItems || (this._labelItems = this._computeLabelItems(chartArea));
                    for(i = 0, ilen = items.length; i < ilen; ++i){
                        const item = items[i], tickFont = item.font, label = item.label;
                        item.backdrop && (ctx.fillStyle = item.backdrop.color, ctx.fillRect(item.backdrop.left, item.backdrop.top, item.backdrop.width, item.backdrop.height));
                        let y = item.textOffset;
                        (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.M)(ctx, label, 0, y, tickFont, item);
                    }
                    area && (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.N)(ctx);
                }
                drawTitle() {
                    let ret;
                    const { ctx , options: { position , title , reverse  }  } = this;
                    if (!title.display) return;
                    const font = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.O)(title.font), padding = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.K)(title.padding), align = title.align;
                    let offset = font.lineHeight / 2;
                    'bottom' === position || 'center' === position || (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.i)(position) ? (offset += padding.bottom, (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.b)(title.text) && (offset += font.lineHeight * (title.text.length - 1))) : offset += padding.top;
                    const { titleX , titleY , maxWidth , rotation  } = function(scale, offset, position, align) {
                        let maxWidth, titleX, titleY;
                        const { top , left , bottom , right , chart  } = scale, { chartArea , scales  } = chart;
                        let rotation = 0;
                        const height = bottom - top, width = right - left;
                        if (scale.isHorizontal()) {
                            if (titleX = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.S)(align, left, right), (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.i)(position)) {
                                const positionAxisID = Object.keys(position)[0], value = position[positionAxisID];
                                titleY = scales[positionAxisID].getPixelForValue(value) + height - offset;
                            } else titleY = 'center' === position ? (chartArea.bottom + chartArea.top) / 2 + height - offset : offsetFromEdge(scale, position, offset);
                            maxWidth = right - left;
                        } else {
                            if ((0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.i)(position)) {
                                const positionAxisID1 = Object.keys(position)[0], value1 = position[positionAxisID1];
                                titleX = scales[positionAxisID1].getPixelForValue(value1) - width + offset;
                            } else titleX = 'center' === position ? (chartArea.left + chartArea.right) / 2 - width + offset : offsetFromEdge(scale, position, offset);
                            titleY = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.S)(align, bottom, top), rotation = 'left' === position ? -_chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.H : _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.H;
                        }
                        return {
                            titleX,
                            titleY,
                            maxWidth,
                            rotation
                        };
                    }(this, offset, position, align);
                    (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.M)(ctx, title.text, 0, 0, font, {
                        color: title.color,
                        maxWidth,
                        rotation,
                        textAlign: (ret = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.R)(align), (reverse && 'right' !== position || !reverse && 'right' === position) && (ret = reverseAlign(ret)), ret),
                        textBaseline: 'middle',
                        translation: [
                            titleX,
                            titleY
                        ]
                    });
                }
                draw(chartArea) {
                    this._isVisible() && (this.drawBackground(), this.drawGrid(chartArea), this.drawBorder(), this.drawTitle(), this.drawLabels(chartArea));
                }
                _layers() {
                    const opts = this.options, tz = opts.ticks && opts.ticks.z || 0, gz = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.v)(opts.grid && opts.grid.z, -1);
                    return this._isVisible() && this.draw === Scale.prototype.draw ? [
                        {
                            z: gz,
                            draw: (chartArea)=>{
                                this.drawBackground(), this.drawGrid(chartArea), this.drawTitle();
                            }
                        },
                        {
                            z: gz + 1,
                            draw: ()=>{
                                this.drawBorder();
                            }
                        },
                        {
                            z: tz,
                            draw: (chartArea)=>{
                                this.drawLabels(chartArea);
                            }
                        }
                    ] : [
                        {
                            z: tz,
                            draw: (chartArea)=>{
                                this.draw(chartArea);
                            }
                        }
                    ];
                }
                getMatchingVisibleMetas(type) {
                    let i, ilen;
                    const metas = this.chart.getSortedVisibleDatasetMetas(), axisID = this.axis + 'AxisID', result = [];
                    for(i = 0, ilen = metas.length; i < ilen; ++i){
                        const meta = metas[i];
                        meta[axisID] !== this.id || type && meta.type !== type || result.push(meta);
                    }
                    return result;
                }
                _resolveTickFontOptions(index) {
                    const opts = this.options.ticks.setContext(this.getContext(index));
                    return (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.O)(opts.font);
                }
                _maxDigits() {
                    const fontSize = this._resolveTickFontOptions(0).lineHeight;
                    return (this.isHorizontal() ? this.width : this.height) / fontSize;
                }
            }
            class TypedRegistry {
                constructor(type, scope, override){
                    this.type = type, this.scope = scope, this.override = override, this.items = Object.create(null);
                }
                isForType(type) {
                    return Object.prototype.isPrototypeOf.call(this.type.prototype, type.prototype);
                }
                register(item) {
                    let parentScope;
                    const proto = Object.getPrototypeOf(item);
                    'id' in proto && 'defaults' in proto && (parentScope = this.register(proto));
                    const items = this.items, id = item.id, scope = this.scope + '.' + id;
                    if (!id) throw Error('class does not have id: ' + item);
                    return id in items || (items[id] = item, function(item, scope, parentScope) {
                        const itemDefaults = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.V)(Object.create(null), [
                            parentScope ? _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.d.get(parentScope) : {},
                            _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.d.get(scope),
                            item.defaults
                        ]);
                        _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.d.set(scope, itemDefaults), item.defaultRoutes && function(scope, routes) {
                            Object.keys(routes).forEach((property)=>{
                                const propertyParts = property.split('.'), sourceName = propertyParts.pop(), sourceScope = [
                                    scope
                                ].concat(propertyParts).join('.'), parts = routes[property].split('.'), targetName = parts.pop(), targetScope = parts.join('.');
                                _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.d.route(sourceScope, sourceName, targetScope, targetName);
                            });
                        }(scope, item.defaultRoutes), item.descriptors && _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.d.describe(scope, item.descriptors);
                    }(item, scope, parentScope), this.override && _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.d.override(item.id, item.overrides)), scope;
                }
                get(id) {
                    return this.items[id];
                }
                unregister(item) {
                    const items = this.items, id = item.id, scope = this.scope;
                    id in items && delete items[id], scope && id in _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.d[scope] && (delete _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.d[scope][id], this.override && delete _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.U[id]);
                }
            }
            var registry = new class {
                constructor(){
                    this.controllers = new TypedRegistry(DatasetController, 'datasets', !0), this.elements = new TypedRegistry(Element, 'elements'), this.plugins = new TypedRegistry(Object, 'plugins'), this.scales = new TypedRegistry(Scale, 'scales'), this._typedRegistries = [
                        this.controllers,
                        this.scales,
                        this.elements
                    ];
                }
                add(...args) {
                    this._each('register', args);
                }
                remove(...args) {
                    this._each('unregister', args);
                }
                addControllers(...args) {
                    this._each('register', args, this.controllers);
                }
                addElements(...args) {
                    this._each('register', args, this.elements);
                }
                addPlugins(...args) {
                    this._each('register', args, this.plugins);
                }
                addScales(...args) {
                    this._each('register', args, this.scales);
                }
                getController(id) {
                    return this._get(id, this.controllers, 'controller');
                }
                getElement(id) {
                    return this._get(id, this.elements, 'element');
                }
                getPlugin(id) {
                    return this._get(id, this.plugins, 'plugin');
                }
                getScale(id) {
                    return this._get(id, this.scales, 'scale');
                }
                removeControllers(...args) {
                    this._each('unregister', args, this.controllers);
                }
                removeElements(...args) {
                    this._each('unregister', args, this.elements);
                }
                removePlugins(...args) {
                    this._each('unregister', args, this.plugins);
                }
                removeScales(...args) {
                    this._each('unregister', args, this.scales);
                }
                _each(method, args, typedRegistry) {
                    [
                        ...args
                    ].forEach((arg)=>{
                        const reg = typedRegistry || this._getRegistryForType(arg);
                        typedRegistry || reg.isForType(arg) || reg === this.plugins && arg.id ? this._exec(method, reg, arg) : (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.Q)(arg, (item)=>{
                            const itemReg = typedRegistry || this._getRegistryForType(item);
                            this._exec(method, itemReg, item);
                        });
                    });
                }
                _exec(method, registry, component) {
                    const camelMethod = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.W)(method);
                    (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.C)(component['before' + camelMethod], [], component), registry[method](component), (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.C)(component['after' + camelMethod], [], component);
                }
                _getRegistryForType(type) {
                    for(let i = 0; i < this._typedRegistries.length; i++){
                        const reg = this._typedRegistries[i];
                        if (reg.isForType(type)) return reg;
                    }
                    return this.plugins;
                }
                _get(id, typedRegistry, type) {
                    const item = typedRegistry.get(id);
                    if (void 0 === item) throw Error('"' + id + '" is not a registered ' + type + '.');
                    return item;
                }
            }();
            class ScatterController extends DatasetController {
                update(mode) {
                    const meta = this._cachedMeta, { data: points = []  } = meta, animationsDisabled = this.chart._animationsDisabled;
                    let { start , count  } = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.q)(meta, points, animationsDisabled);
                    if (this._drawStart = start, this._drawCount = count, (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.w)(meta) && (start = 0, count = points.length), this.options.showLine) {
                        const { dataset: line , _dataset  } = meta;
                        line._chart = this.chart, line._datasetIndex = this.index, line._decimated = !!_dataset._decimated, line.points = points;
                        const options = this.resolveDatasetElementOptions(mode);
                        options.segment = this.options.segment, this.updateElement(line, void 0, {
                            animated: !animationsDisabled,
                            options
                        }, mode);
                    }
                    this.updateElements(points, start, count, mode);
                }
                addElements() {
                    const { showLine  } = this.options;
                    !this.datasetElementType && showLine && (this.datasetElementType = registry.getElement('line')), super.addElements();
                }
                updateElements(points, start, count, mode) {
                    const reset = 'reset' === mode, { iScale , vScale , _stacked , _dataset  } = this._cachedMeta, firstOpts = this.resolveDataElementOptions(start, mode), sharedOptions = this.getSharedOptions(firstOpts), includeOptions = this.includeOptions(mode, sharedOptions), iAxis = iScale.axis, vAxis = vScale.axis, { spanGaps , segment  } = this.options, maxGapLength = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.x)(spanGaps) ? spanGaps : Number.POSITIVE_INFINITY, directUpdate = this.chart._animationsDisabled || reset || 'none' === mode;
                    let prevParsed = start > 0 && this.getParsed(start - 1);
                    for(let i = start; i < start + count; ++i){
                        const point = points[i], parsed = this.getParsed(i), properties = directUpdate ? point : {}, nullData = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.k)(parsed[vAxis]), iPixel = properties[iAxis] = iScale.getPixelForValue(parsed[iAxis], i), vPixel = properties[vAxis] = reset || nullData ? vScale.getBasePixel() : vScale.getPixelForValue(_stacked ? this.applyStack(vScale, parsed, _stacked) : parsed[vAxis], i);
                        properties.skip = isNaN(iPixel) || isNaN(vPixel) || nullData, properties.stop = i > 0 && Math.abs(parsed[iAxis] - prevParsed[iAxis]) > maxGapLength, segment && (properties.parsed = parsed, properties.raw = _dataset.data[i]), includeOptions && (properties.options = sharedOptions || this.resolveDataElementOptions(i, point.active ? 'active' : mode)), directUpdate || this.updateElement(point, i, properties, mode), prevParsed = parsed;
                    }
                    this.updateSharedOptions(sharedOptions, mode, firstOpts);
                }
                getMaxOverflow() {
                    const meta = this._cachedMeta, data = meta.data || [];
                    if (!this.options.showLine) {
                        let max = 0;
                        for(let i = data.length - 1; i >= 0; --i)max = Math.max(max, data[i].size(this.resolveDataElementOptions(i)) / 2);
                        return max > 0 && max;
                    }
                    const dataset = meta.dataset, border = dataset.options && dataset.options.borderWidth || 0;
                    if (!data.length) return border;
                    const firstPoint = data[0].size(this.resolveDataElementOptions(0)), lastPoint = data[data.length - 1].size(this.resolveDataElementOptions(data.length - 1));
                    return Math.max(border, firstPoint, lastPoint) / 2;
                }
            }
            ScatterController.id = 'scatter', ScatterController.defaults = {
                datasetElementType: !1,
                dataElementType: 'point',
                showLine: !1,
                fill: !1
            }, ScatterController.overrides = {
                interaction: {
                    mode: 'point'
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            title: ()=>'',
                            label: (item)=>'(' + item.label + ', ' + item.formattedValue + ')'
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
            var controllers = Object.freeze({
                __proto__: null,
                BarController: BarController,
                BubbleController: BubbleController,
                DoughnutController: DoughnutController,
                LineController: LineController,
                PolarAreaController: PolarAreaController,
                PieController: PieController,
                RadarController: RadarController,
                ScatterController: ScatterController
            });
            function abstract() {
                throw Error('This method is not implemented: Check that a complete date adapter is provided.');
            }
            class DateAdapter {
                constructor(options){
                    this.options = options || {};
                }
                init(chartOptions) {}
                formats() {
                    return abstract();
                }
                parse(value, format) {
                    return abstract();
                }
                format(timestamp, format) {
                    return abstract();
                }
                add(timestamp, amount, unit) {
                    return abstract();
                }
                diff(a, b, unit) {
                    return abstract();
                }
                startOf(timestamp, unit, weekday) {
                    return abstract();
                }
                endOf(timestamp, unit) {
                    return abstract();
                }
            }
            DateAdapter.override = function(members) {
                Object.assign(DateAdapter.prototype, members);
            };
            var adapters = {
                _date: DateAdapter
            };
            function binarySearch(metaset, axis, value, intersect) {
                const { controller , data , _sorted  } = metaset, iScale = controller._cachedMeta.iScale;
                if (iScale && axis === iScale.axis && 'r' !== axis && _sorted && data.length) {
                    const lookupMethod = iScale._reversePixels ? _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.Y : _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.Z;
                    if (!intersect) return lookupMethod(data, axis, value);
                    if (controller._sharedOptions) {
                        const el = data[0], range = 'function' == typeof el.getRange && el.getRange(axis);
                        if (range) {
                            const start = lookupMethod(data, axis, value - range), end = lookupMethod(data, axis, value + range);
                            return {
                                lo: start.lo,
                                hi: end.hi
                            };
                        }
                    }
                }
                return {
                    lo: 0,
                    hi: data.length - 1
                };
            }
            function evaluateInteractionItems(chart, axis, position, handler, intersect) {
                const metasets = chart.getSortedVisibleDatasetMetas(), value = position[axis];
                for(let i = 0, ilen = metasets.length; i < ilen; ++i){
                    const { index , data  } = metasets[i], { lo , hi  } = binarySearch(metasets[i], axis, value, intersect);
                    for(let j = lo; j <= hi; ++j){
                        const element = data[j];
                        element.skip || handler(element, index, j);
                    }
                }
            }
            function getIntersectItems(chart, position, axis, useFinalPosition, includeInvisible) {
                const items = [];
                if (!includeInvisible && !chart.isPointInArea(position)) return items;
                const evaluationFunc = function(element, datasetIndex, index) {
                    (includeInvisible || (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.$)(element, chart.chartArea, 0)) && element.inRange(position.x, position.y, useFinalPosition) && items.push({
                        element,
                        datasetIndex,
                        index
                    });
                };
                return evaluateInteractionItems(chart, axis, position, evaluationFunc, !0), items;
            }
            function getNearestItems(chart, position, axis, intersect, useFinalPosition, includeInvisible) {
                let items;
                return includeInvisible || chart.isPointInArea(position) ? 'r' !== axis || intersect ? function(chart, position, axis, intersect, useFinalPosition, includeInvisible) {
                    let items = [];
                    const distanceMetric = function(axis) {
                        const useX = -1 !== axis.indexOf('x'), useY = -1 !== axis.indexOf('y');
                        return function(pt1, pt2) {
                            const deltaX = useX ? Math.abs(pt1.x - pt2.x) : 0, deltaY = useY ? Math.abs(pt1.y - pt2.y) : 0;
                            return Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
                        };
                    }(axis);
                    let minDistance = Number.POSITIVE_INFINITY;
                    return evaluateInteractionItems(chart, axis, position, function(element, datasetIndex, index) {
                        const inRange = element.inRange(position.x, position.y, useFinalPosition);
                        if (intersect && !inRange) return;
                        const center = element.getCenterPoint(useFinalPosition), pointInArea = !!includeInvisible || chart.isPointInArea(center);
                        if (!pointInArea && !inRange) return;
                        const distance = distanceMetric(position, center);
                        distance < minDistance ? (items = [
                            {
                                element,
                                datasetIndex,
                                index
                            }
                        ], minDistance = distance) : distance === minDistance && items.push({
                            element,
                            datasetIndex,
                            index
                        });
                    }), items;
                }(chart, position, axis, intersect, useFinalPosition, includeInvisible) : (items = [], evaluateInteractionItems(chart, axis, position, function(element, datasetIndex, index) {
                    const { startAngle , endAngle  } = element.getProps([
                        'startAngle',
                        'endAngle'
                    ], useFinalPosition), { angle  } = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.a0)(element, {
                        x: position.x,
                        y: position.y
                    });
                    (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.p)(angle, startAngle, endAngle) && items.push({
                        element,
                        datasetIndex,
                        index
                    });
                }), items) : [];
            }
            function getAxisItems(chart, position, axis, intersect, useFinalPosition) {
                const items = [], rangeMethod = 'x' === axis ? 'inXRange' : 'inYRange';
                let intersectsItem = !1;
                return (evaluateInteractionItems(chart, axis, position, (element, datasetIndex, index)=>{
                    element[rangeMethod](position[axis], useFinalPosition) && (items.push({
                        element,
                        datasetIndex,
                        index
                    }), intersectsItem = intersectsItem || element.inRange(position.x, position.y, useFinalPosition));
                }), intersect && !intersectsItem) ? [] : items;
            }
            var Interaction = {
                evaluateInteractionItems,
                modes: {
                    index (chart, e, options, useFinalPosition) {
                        const position = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.X)(e, chart), axis = options.axis || 'x', includeInvisible = options.includeInvisible || !1, items = options.intersect ? getIntersectItems(chart, position, axis, useFinalPosition, includeInvisible) : getNearestItems(chart, position, axis, !1, useFinalPosition, includeInvisible), elements = [];
                        return items.length ? (chart.getSortedVisibleDatasetMetas().forEach((meta)=>{
                            const index = items[0].index, element = meta.data[index];
                            element && !element.skip && elements.push({
                                element,
                                datasetIndex: meta.index,
                                index
                            });
                        }), elements) : [];
                    },
                    dataset (chart, e, options, useFinalPosition) {
                        const position = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.X)(e, chart), axis = options.axis || 'xy', includeInvisible = options.includeInvisible || !1;
                        let items = options.intersect ? getIntersectItems(chart, position, axis, useFinalPosition, includeInvisible) : getNearestItems(chart, position, axis, !1, useFinalPosition, includeInvisible);
                        if (items.length > 0) {
                            const datasetIndex = items[0].datasetIndex, data = chart.getDatasetMeta(datasetIndex).data;
                            items = [];
                            for(let i = 0; i < data.length; ++i)items.push({
                                element: data[i],
                                datasetIndex,
                                index: i
                            });
                        }
                        return items;
                    },
                    point (chart, e, options, useFinalPosition) {
                        const position = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.X)(e, chart), axis = options.axis || 'xy', includeInvisible = options.includeInvisible || !1;
                        return getIntersectItems(chart, position, axis, useFinalPosition, includeInvisible);
                    },
                    nearest (chart, e, options, useFinalPosition) {
                        const position = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.X)(e, chart), axis = options.axis || 'xy', includeInvisible = options.includeInvisible || !1;
                        return getNearestItems(chart, position, axis, options.intersect, useFinalPosition, includeInvisible);
                    },
                    x (chart, e, options, useFinalPosition) {
                        const position = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.X)(e, chart);
                        return getAxisItems(chart, position, 'x', options.intersect, useFinalPosition);
                    },
                    y (chart, e, options, useFinalPosition) {
                        const position = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.X)(e, chart);
                        return getAxisItems(chart, position, 'y', options.intersect, useFinalPosition);
                    }
                }
            };
            const STATIC_POSITIONS = [
                'left',
                'top',
                'right',
                'bottom'
            ];
            function filterByPosition(array, position) {
                return array.filter((v)=>v.pos === position);
            }
            function filterDynamicPositionByAxis(array, axis) {
                return array.filter((v)=>-1 === STATIC_POSITIONS.indexOf(v.pos) && v.box.axis === axis);
            }
            function sortByWeight(array, reverse) {
                return array.sort((a, b)=>{
                    const v0 = reverse ? b : a, v1 = reverse ? a : b;
                    return v0.weight === v1.weight ? v0.index - v1.index : v0.weight - v1.weight;
                });
            }
            function getCombinedMax(maxPadding, chartArea, a, b) {
                return Math.max(maxPadding[a], chartArea[a]) + Math.max(maxPadding[b], chartArea[b]);
            }
            function updateMaxPadding(maxPadding, boxPadding) {
                maxPadding.top = Math.max(maxPadding.top, boxPadding.top), maxPadding.left = Math.max(maxPadding.left, boxPadding.left), maxPadding.bottom = Math.max(maxPadding.bottom, boxPadding.bottom), maxPadding.right = Math.max(maxPadding.right, boxPadding.right);
            }
            function updateDims(chartArea, params, layout, stacks) {
                const { pos , box  } = layout, maxPadding = chartArea.maxPadding;
                if (!(0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.i)(pos)) {
                    layout.size && (chartArea[pos] -= layout.size);
                    const stack = stacks[layout.stack] || {
                        size: 0,
                        count: 1
                    };
                    stack.size = Math.max(stack.size, layout.horizontal ? box.height : box.width), layout.size = stack.size / stack.count, chartArea[pos] += layout.size;
                }
                box.getPadding && updateMaxPadding(maxPadding, box.getPadding());
                const newWidth = Math.max(0, params.outerWidth - getCombinedMax(maxPadding, chartArea, 'left', 'right')), newHeight = Math.max(0, params.outerHeight - getCombinedMax(maxPadding, chartArea, 'top', 'bottom')), widthChanged = newWidth !== chartArea.w, heightChanged = newHeight !== chartArea.h;
                return chartArea.w = newWidth, chartArea.h = newHeight, layout.horizontal ? {
                    same: widthChanged,
                    other: heightChanged
                } : {
                    same: heightChanged,
                    other: widthChanged
                };
            }
            function getMargins(horizontal, chartArea) {
                const maxPadding = chartArea.maxPadding;
                return function(positions) {
                    const margin = {
                        left: 0,
                        top: 0,
                        right: 0,
                        bottom: 0
                    };
                    return positions.forEach((pos)=>{
                        margin[pos] = Math.max(chartArea[pos], maxPadding[pos]);
                    }), margin;
                }(horizontal ? [
                    'left',
                    'right'
                ] : [
                    'top',
                    'bottom'
                ]);
            }
            function fitBoxes(boxes, chartArea, params, stacks) {
                let i, ilen, layout, box, refit, changed;
                const refitBoxes = [];
                for(i = 0, ilen = boxes.length, refit = 0; i < ilen; ++i){
                    (box = (layout = boxes[i]).box).update(layout.width || chartArea.w, layout.height || chartArea.h, getMargins(layout.horizontal, chartArea));
                    const { same , other  } = updateDims(chartArea, params, layout, stacks);
                    refit |= same && refitBoxes.length, changed = changed || other, box.fullSize || refitBoxes.push(layout);
                }
                return refit && fitBoxes(refitBoxes, chartArea, params, stacks) || changed;
            }
            function setBoxDims(box, left, top, width, height) {
                box.top = top, box.left = left, box.right = left + width, box.bottom = top + height, box.width = width, box.height = height;
            }
            function placeBoxes(boxes, chartArea, params, stacks) {
                const userPadding = params.padding;
                let { x , y  } = chartArea;
                for (const layout of boxes){
                    const box = layout.box, stack = stacks[layout.stack] || {
                        count: 1,
                        placed: 0,
                        weight: 1
                    }, weight = layout.stackWeight / stack.weight || 1;
                    if (layout.horizontal) {
                        const width = chartArea.w * weight, height = stack.size || box.height;
                        (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.j)(stack.start) && (y = stack.start), box.fullSize ? setBoxDims(box, userPadding.left, y, params.outerWidth - userPadding.right - userPadding.left, height) : setBoxDims(box, chartArea.left + stack.placed, y, width, height), stack.start = y, stack.placed += width, y = box.bottom;
                    } else {
                        const height1 = chartArea.h * weight, width1 = stack.size || box.width;
                        (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.j)(stack.start) && (x = stack.start), box.fullSize ? setBoxDims(box, x, userPadding.top, width1, params.outerHeight - userPadding.bottom - userPadding.top) : setBoxDims(box, x, chartArea.top + stack.placed, width1, height1), stack.start = x, stack.placed += height1, x = box.right;
                    }
                }
                chartArea.x = x, chartArea.y = y;
            }
            _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.d.set('layout', {
                autoPadding: !0,
                padding: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                }
            });
            var layouts = {
                addBox (chart, item) {
                    chart.boxes || (chart.boxes = []), item.fullSize = item.fullSize || !1, item.position = item.position || 'top', item.weight = item.weight || 0, item._layers = item._layers || function() {
                        return [
                            {
                                z: 0,
                                draw (chartArea) {
                                    item.draw(chartArea);
                                }
                            }
                        ];
                    }, chart.boxes.push(item);
                },
                removeBox (chart, layoutItem) {
                    const index = chart.boxes ? chart.boxes.indexOf(layoutItem) : -1;
                    -1 !== index && chart.boxes.splice(index, 1);
                },
                configure (chart, item, options) {
                    item.fullSize = options.fullSize, item.position = options.position, item.weight = options.weight;
                },
                update (chart, width, height, minPadding) {
                    if (!chart) return;
                    const padding = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.K)(chart.options.layout.padding), availableWidth = Math.max(width - padding.width, 0), availableHeight = Math.max(height - padding.height, 0), boxes = function(boxes) {
                        const layoutBoxes = function(boxes) {
                            let i, ilen, box, pos, stack, stackWeight;
                            const layoutBoxes = [];
                            for(i = 0, ilen = (boxes || []).length; i < ilen; ++i)box = boxes[i], ({ position: pos , options: { stack , stackWeight =1  }  } = box), layoutBoxes.push({
                                index: i,
                                box,
                                pos,
                                horizontal: box.isHorizontal(),
                                weight: box.weight,
                                stack: stack && pos + stack,
                                stackWeight
                            });
                            return layoutBoxes;
                        }(boxes), fullSize = sortByWeight(layoutBoxes.filter((wrap)=>wrap.box.fullSize), !0), left = sortByWeight(filterByPosition(layoutBoxes, 'left'), !0), right = sortByWeight(filterByPosition(layoutBoxes, 'right')), top = sortByWeight(filterByPosition(layoutBoxes, 'top'), !0), bottom = sortByWeight(filterByPosition(layoutBoxes, 'bottom')), centerHorizontal = filterDynamicPositionByAxis(layoutBoxes, 'x'), centerVertical = filterDynamicPositionByAxis(layoutBoxes, 'y');
                        return {
                            fullSize,
                            leftAndTop: left.concat(top),
                            rightAndBottom: right.concat(centerVertical).concat(bottom).concat(centerHorizontal),
                            chartArea: filterByPosition(layoutBoxes, 'chartArea'),
                            vertical: left.concat(right).concat(centerVertical),
                            horizontal: top.concat(bottom).concat(centerHorizontal)
                        };
                    }(chart.boxes), verticalBoxes = boxes.vertical, horizontalBoxes = boxes.horizontal;
                    (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.Q)(chart.boxes, (box)=>{
                        'function' == typeof box.beforeLayout && box.beforeLayout();
                    });
                    const visibleVerticalBoxCount = verticalBoxes.reduce((total, wrap)=>wrap.box.options && !1 === wrap.box.options.display ? total : total + 1, 0) || 1, params = Object.freeze({
                        outerWidth: width,
                        outerHeight: height,
                        padding,
                        availableWidth,
                        availableHeight,
                        vBoxMaxWidth: availableWidth / 2 / visibleVerticalBoxCount,
                        hBoxMaxHeight: availableHeight / 2
                    }), maxPadding = Object.assign({}, padding);
                    updateMaxPadding(maxPadding, (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.K)(minPadding));
                    const chartArea = Object.assign({
                        maxPadding,
                        w: availableWidth,
                        h: availableHeight,
                        x: padding.left,
                        y: padding.top
                    }, padding), stacks = function(layouts, params) {
                        let i, ilen, layout;
                        const stacks = function(layouts) {
                            const stacks = {};
                            for (const wrap of layouts){
                                const { stack , pos , stackWeight  } = wrap;
                                if (!stack || !STATIC_POSITIONS.includes(pos)) continue;
                                const _stack = stacks[stack] || (stacks[stack] = {
                                    count: 0,
                                    placed: 0,
                                    weight: 0,
                                    size: 0
                                });
                                _stack.count++, _stack.weight += stackWeight;
                            }
                            return stacks;
                        }(layouts), { vBoxMaxWidth , hBoxMaxHeight  } = params;
                        for(i = 0, ilen = layouts.length; i < ilen; ++i){
                            layout = layouts[i];
                            const { fullSize  } = layout.box, stack = stacks[layout.stack], factor = stack && layout.stackWeight / stack.weight;
                            layout.horizontal ? (layout.width = factor ? factor * vBoxMaxWidth : fullSize && params.availableWidth, layout.height = hBoxMaxHeight) : (layout.width = vBoxMaxWidth, layout.height = factor ? factor * hBoxMaxHeight : fullSize && params.availableHeight);
                        }
                        return stacks;
                    }(verticalBoxes.concat(horizontalBoxes), params);
                    fitBoxes(boxes.fullSize, chartArea, params, stacks), fitBoxes(verticalBoxes, chartArea, params, stacks), fitBoxes(horizontalBoxes, chartArea, params, stacks) && fitBoxes(verticalBoxes, chartArea, params, stacks), function(chartArea) {
                        const maxPadding = chartArea.maxPadding;
                        function updatePos(pos) {
                            const change = Math.max(maxPadding[pos] - chartArea[pos], 0);
                            return chartArea[pos] += change, change;
                        }
                        chartArea.y += updatePos('top'), chartArea.x += updatePos('left'), updatePos('right'), updatePos('bottom');
                    }(chartArea), placeBoxes(boxes.leftAndTop, chartArea, params, stacks), chartArea.x += chartArea.w, chartArea.y += chartArea.h, placeBoxes(boxes.rightAndBottom, chartArea, params, stacks), chart.chartArea = {
                        left: chartArea.left,
                        top: chartArea.top,
                        right: chartArea.left + chartArea.w,
                        bottom: chartArea.top + chartArea.h,
                        height: chartArea.h,
                        width: chartArea.w
                    }, (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.Q)(boxes.chartArea, (layout)=>{
                        const box = layout.box;
                        Object.assign(box, chart.chartArea), box.update(chartArea.w, chartArea.h, {
                            left: 0,
                            top: 0,
                            right: 0,
                            bottom: 0
                        });
                    });
                }
            };
            class BasePlatform {
                acquireContext(canvas, aspectRatio) {}
                releaseContext(context) {
                    return !1;
                }
                addEventListener(chart, type, listener) {}
                removeEventListener(chart, type, listener) {}
                getDevicePixelRatio() {
                    return 1;
                }
                getMaximumSize(element, width, height, aspectRatio) {
                    return width = Math.max(0, width || element.width), height = height || element.height, {
                        width,
                        height: Math.max(0, aspectRatio ? Math.floor(width / aspectRatio) : height)
                    };
                }
                isAttached(canvas) {
                    return !0;
                }
                updateConfig(config) {}
            }
            class BasicPlatform extends BasePlatform {
                acquireContext(item) {
                    return item && item.getContext && item.getContext('2d') || null;
                }
                updateConfig(config) {
                    config.options.animation = !1;
                }
            }
            const EXPANDO_KEY = '$chartjs', EVENT_TYPES = {
                touchstart: 'mousedown',
                touchmove: 'mousemove',
                touchend: 'mouseup',
                pointerenter: 'mouseenter',
                pointerdown: 'mousedown',
                pointermove: 'mousemove',
                pointerup: 'mouseup',
                pointerleave: 'mouseout',
                pointerout: 'mouseout'
            }, isNullOrEmpty = (value)=>null === value || '' === value, eventListenerOptions = !!_chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.a5 && {
                passive: !0
            };
            function removeListener(chart, type, listener) {
                chart.canvas.removeEventListener(type, listener, eventListenerOptions);
            }
            function nodeListContains(nodeList, canvas) {
                for (const node of nodeList)if (node === canvas || node.contains(canvas)) return !0;
            }
            function createAttachObserver(chart, type, listener) {
                const canvas = chart.canvas, observer = new MutationObserver((entries)=>{
                    let trigger = !1;
                    for (const entry of entries)trigger = (trigger = trigger || nodeListContains(entry.addedNodes, canvas)) && !nodeListContains(entry.removedNodes, canvas);
                    trigger && listener();
                });
                return observer.observe(document, {
                    childList: !0,
                    subtree: !0
                }), observer;
            }
            function createDetachObserver(chart, type, listener) {
                const canvas = chart.canvas, observer = new MutationObserver((entries)=>{
                    let trigger = !1;
                    for (const entry of entries)trigger = (trigger = trigger || nodeListContains(entry.removedNodes, canvas)) && !nodeListContains(entry.addedNodes, canvas);
                    trigger && listener();
                });
                return observer.observe(document, {
                    childList: !0,
                    subtree: !0
                }), observer;
            }
            const drpListeningCharts = new Map();
            let oldDevicePixelRatio = 0;
            function onWindowResize() {
                const dpr = window.devicePixelRatio;
                dpr !== oldDevicePixelRatio && (oldDevicePixelRatio = dpr, drpListeningCharts.forEach((resize, chart)=>{
                    chart.currentDevicePixelRatio !== dpr && resize();
                }));
            }
            function createResizeObserver(chart, type, listener) {
                const canvas = chart.canvas, container = canvas && (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.a2)(canvas);
                if (!container) return;
                const resize = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.a4)((width, height)=>{
                    const w = container.clientWidth;
                    listener(width, height), w < container.clientWidth && listener();
                }, window), observer = new ResizeObserver((entries)=>{
                    const entry = entries[0], width = entry.contentRect.width, height = entry.contentRect.height;
                    (0 !== width || 0 !== height) && resize(width, height);
                });
                return observer.observe(container), drpListeningCharts.size || window.addEventListener('resize', onWindowResize), drpListeningCharts.set(chart, resize), observer;
            }
            function releaseObserver(chart, type, observer) {
                observer && observer.disconnect(), 'resize' === type && (drpListeningCharts.delete(chart), drpListeningCharts.size || window.removeEventListener('resize', onWindowResize));
            }
            function createProxyAndListen(chart, type, listener) {
                const canvas = chart.canvas, proxy = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.a4)((event)=>{
                    null !== chart.ctx && listener(function(event, chart) {
                        const type = EVENT_TYPES[event.type] || event.type, { x , y  } = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.X)(event, chart);
                        return {
                            type,
                            chart,
                            native: event,
                            x: void 0 !== x ? x : null,
                            y: void 0 !== y ? y : null
                        };
                    }(event, chart));
                }, chart, (args)=>{
                    const event = args[0];
                    return [
                        event,
                        event.offsetX,
                        event.offsetY
                    ];
                });
                return !function(node, type, listener) {
                    node.addEventListener(type, listener, eventListenerOptions);
                }(canvas, type, proxy), proxy;
            }
            class DomPlatform extends BasePlatform {
                acquireContext(canvas, aspectRatio) {
                    const context = canvas && canvas.getContext && canvas.getContext('2d');
                    return context && context.canvas === canvas ? (!function(canvas, aspectRatio) {
                        const style = canvas.style, renderHeight = canvas.getAttribute('height'), renderWidth = canvas.getAttribute('width');
                        if (canvas[EXPANDO_KEY] = {
                            initial: {
                                height: renderHeight,
                                width: renderWidth,
                                style: {
                                    display: style.display,
                                    height: style.height,
                                    width: style.width
                                }
                            }
                        }, style.display = style.display || 'block', style.boxSizing = style.boxSizing || 'border-box', isNullOrEmpty(renderWidth)) {
                            const displayWidth = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.a3)(canvas, 'width');
                            void 0 !== displayWidth && (canvas.width = displayWidth);
                        }
                        if (isNullOrEmpty(renderHeight)) {
                            if ('' === canvas.style.height) canvas.height = canvas.width / (aspectRatio || 2);
                            else {
                                const displayHeight = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.a3)(canvas, 'height');
                                void 0 !== displayHeight && (canvas.height = displayHeight);
                            }
                        }
                    }(canvas, aspectRatio), context) : null;
                }
                releaseContext(context) {
                    const canvas = context.canvas;
                    if (!canvas[EXPANDO_KEY]) return !1;
                    const initial = canvas[EXPANDO_KEY].initial;
                    [
                        'height',
                        'width'
                    ].forEach((prop)=>{
                        const value = initial[prop];
                        (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.k)(value) ? canvas.removeAttribute(prop) : canvas.setAttribute(prop, value);
                    });
                    const style = initial.style || {};
                    return Object.keys(style).forEach((key)=>{
                        canvas.style[key] = style[key];
                    }), canvas.width = canvas.width, delete canvas[EXPANDO_KEY], !0;
                }
                addEventListener(chart, type, listener) {
                    this.removeEventListener(chart, type);
                    const proxies = chart.$proxies || (chart.$proxies = {});
                    proxies[type] = (({
                        attach: createAttachObserver,
                        detach: createDetachObserver,
                        resize: createResizeObserver
                    })[type] || createProxyAndListen)(chart, type, listener);
                }
                removeEventListener(chart, type) {
                    const proxies = chart.$proxies || (chart.$proxies = {}), proxy = proxies[type];
                    proxy && ((({
                        attach: releaseObserver,
                        detach: releaseObserver,
                        resize: releaseObserver
                    })[type] || removeListener)(chart, type, proxy), proxies[type] = void 0);
                }
                getDevicePixelRatio() {
                    return window.devicePixelRatio;
                }
                getMaximumSize(canvas, width, height, aspectRatio) {
                    return (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.a1)(canvas, width, height, aspectRatio);
                }
                isAttached(canvas) {
                    const container = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.a2)(canvas);
                    return !!(container && container.isConnected);
                }
            }
            class PluginService {
                constructor(){
                    this._init = [];
                }
                notify(chart, hook, args, filter) {
                    'beforeInit' === hook && (this._init = this._createDescriptors(chart, !0), this._notify(this._init, chart, 'install'));
                    const descriptors = filter ? this._descriptors(chart).filter(filter) : this._descriptors(chart), result = this._notify(descriptors, chart, hook, args);
                    return 'afterDestroy' === hook && (this._notify(descriptors, chart, 'stop'), this._notify(this._init, chart, 'uninstall')), result;
                }
                _notify(descriptors, chart, hook, args) {
                    for (const descriptor of (args = args || {}, descriptors)){
                        const plugin = descriptor.plugin, method = plugin[hook], params = [
                            chart,
                            args,
                            descriptor.options
                        ];
                        if (!1 === (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.C)(method, params, plugin) && args.cancelable) return !1;
                    }
                    return !0;
                }
                invalidate() {
                    (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.k)(this._cache) || (this._oldCache = this._cache, this._cache = void 0);
                }
                _descriptors(chart) {
                    if (this._cache) return this._cache;
                    const descriptors = this._cache = this._createDescriptors(chart);
                    return this._notifyStateChanges(chart), descriptors;
                }
                _createDescriptors(chart, all) {
                    const config = chart && chart.config, options = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.v)(config.options && config.options.plugins, {}), plugins = function(config) {
                        const localIds = {}, plugins = [], keys = Object.keys(registry.plugins.items);
                        for(let i = 0; i < keys.length; i++)plugins.push(registry.getPlugin(keys[i]));
                        const local = config.plugins || [];
                        for(let i1 = 0; i1 < local.length; i1++){
                            const plugin = local[i1];
                            -1 === plugins.indexOf(plugin) && (plugins.push(plugin), localIds[plugin.id] = !0);
                        }
                        return {
                            plugins,
                            localIds
                        };
                    }(config);
                    return !1 !== options || all ? function(chart, { plugins , localIds  }, options, all) {
                        const result = [], context = chart.getContext();
                        for (const plugin of plugins){
                            const id = plugin.id, opts = getOpts(options[id], all);
                            null !== opts && result.push({
                                plugin,
                                options: pluginOpts(chart.config, {
                                    plugin,
                                    local: localIds[id]
                                }, opts, context)
                            });
                        }
                        return result;
                    }(chart, plugins, options, all) : [];
                }
                _notifyStateChanges(chart) {
                    const previousDescriptors = this._oldCache || [], descriptors = this._cache, diff = (a, b)=>a.filter((x)=>!b.some((y)=>x.plugin.id === y.plugin.id));
                    this._notify(diff(previousDescriptors, descriptors), chart, 'stop'), this._notify(diff(descriptors, previousDescriptors), chart, 'start');
                }
            }
            function getOpts(options, all) {
                return all || !1 !== options ? !0 === options ? {} : options : null;
            }
            function pluginOpts(config, { plugin , local  }, opts, context) {
                const keys = config.pluginScopeKeys(plugin), scopes = config.getOptionScopes(opts, keys);
                return local && plugin.defaults && scopes.push(plugin.defaults), config.createResolver(scopes, context, [
                    ''
                ], {
                    scriptable: !1,
                    indexable: !1,
                    allKeys: !0
                });
            }
            function getIndexAxis(type, options) {
                const datasetDefaults = _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.d.datasets[type] || {}, datasetOptions = (options.datasets || {})[type] || {};
                return datasetOptions.indexAxis || options.indexAxis || datasetDefaults.indexAxis || 'x';
            }
            function determineAxis(id, scaleOptions) {
                var position;
                return 'x' === id || 'y' === id ? id : scaleOptions.axis || ('top' === (position = scaleOptions.position) || 'bottom' === position ? 'x' : 'left' === position || 'right' === position ? 'y' : void 0) || id.charAt(0).toLowerCase();
            }
            function initOptions(config) {
                const options = config.options || (config.options = {});
                options.plugins = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.v)(options.plugins, {}), options.scales = function(config, options) {
                    const chartDefaults = _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.U[config.type] || {
                        scales: {}
                    }, configScales = options.scales || {}, chartIndexAxis = getIndexAxis(config.type, options), firstIDs = Object.create(null), scales = Object.create(null);
                    return Object.keys(configScales).forEach((id)=>{
                        const scaleConf = configScales[id];
                        if (!(0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.i)(scaleConf)) return console.error(`Invalid scale configuration for scale: ${id}`);
                        if (scaleConf._proxy) return console.warn(`Ignoring resolver passed as options for scale: ${id}`);
                        const axis = determineAxis(id, scaleConf), defaultScaleOptions = chartDefaults.scales || {};
                        firstIDs[axis] = firstIDs[axis] || id, scales[id] = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.ac)(Object.create(null), [
                            {
                                axis
                            },
                            scaleConf,
                            defaultScaleOptions[axis],
                            defaultScaleOptions[axis === chartIndexAxis ? '_index_' : '_value_']
                        ]);
                    }), config.data.datasets.forEach((dataset)=>{
                        const type = dataset.type || config.type, indexAxis = dataset.indexAxis || getIndexAxis(type, options), datasetDefaults = _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.U[type] || {}, defaultScaleOptions = datasetDefaults.scales || {};
                        Object.keys(defaultScaleOptions).forEach((defaultID)=>{
                            let axis;
                            const axis1 = (axis = defaultID, '_index_' === defaultID ? axis = indexAxis : '_value_' === defaultID && (axis = 'x' === indexAxis ? 'y' : 'x'), axis), id = dataset[axis1 + 'AxisID'] || firstIDs[axis1] || axis1;
                            scales[id] = scales[id] || Object.create(null), (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.ac)(scales[id], [
                                {
                                    axis: axis1
                                },
                                configScales[id],
                                defaultScaleOptions[defaultID]
                            ]);
                        });
                    }), Object.keys(scales).forEach((key)=>{
                        const scale = scales[key];
                        (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.ac)(scale, [
                            _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.d.scales[scale.type],
                            _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.d.scale
                        ]);
                    }), scales;
                }(config, options);
            }
            function initData(data) {
                return (data = data || {}).datasets = data.datasets || [], data.labels = data.labels || [], data;
            }
            const keyCache = new Map(), keysCached = new Set();
            function cachedKeys(cacheKey, generate) {
                let keys = keyCache.get(cacheKey);
                return keys || (keys = generate(), keyCache.set(cacheKey, keys), keysCached.add(keys)), keys;
            }
            const addIfFound = (set, obj, key)=>{
                const opts = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.f)(obj, key);
                void 0 !== opts && set.add(opts);
            };
            class Config {
                constructor(config){
                    var config1;
                    this._config = ((config1 = (config1 = config) || {}).data = initData(config1.data), initOptions(config1), config1), this._scopeCache = new Map(), this._resolverCache = new Map();
                }
                get platform() {
                    return this._config.platform;
                }
                get type() {
                    return this._config.type;
                }
                set type(type) {
                    this._config.type = type;
                }
                get data() {
                    return this._config.data;
                }
                set data(data) {
                    this._config.data = initData(data);
                }
                get options() {
                    return this._config.options;
                }
                set options(options) {
                    this._config.options = options;
                }
                get plugins() {
                    return this._config.plugins;
                }
                update() {
                    const config = this._config;
                    this.clearCache(), initOptions(config);
                }
                clearCache() {
                    this._scopeCache.clear(), this._resolverCache.clear();
                }
                datasetScopeKeys(datasetType) {
                    return cachedKeys(datasetType, ()=>[
                            [
                                `datasets.${datasetType}`,
                                ''
                            ]
                        ]);
                }
                datasetAnimationScopeKeys(datasetType, transition) {
                    return cachedKeys(`${datasetType}.transition.${transition}`, ()=>[
                            [
                                `datasets.${datasetType}.transitions.${transition}`,
                                `transitions.${transition}`
                            ],
                            [
                                `datasets.${datasetType}`,
                                ''
                            ]
                        ]);
                }
                datasetElementScopeKeys(datasetType, elementType) {
                    return cachedKeys(`${datasetType}-${elementType}`, ()=>[
                            [
                                `datasets.${datasetType}.elements.${elementType}`,
                                `datasets.${datasetType}`,
                                `elements.${elementType}`,
                                ''
                            ]
                        ]);
                }
                pluginScopeKeys(plugin) {
                    const id = plugin.id, type = this.type;
                    return cachedKeys(`${type}-plugin-${id}`, ()=>[
                            [
                                `plugins.${id}`,
                                ...plugin.additionalOptionScopes || []
                            ]
                        ]);
                }
                _cachedScopes(mainScope, resetCache) {
                    const _scopeCache = this._scopeCache;
                    let cache = _scopeCache.get(mainScope);
                    return (!cache || resetCache) && (cache = new Map(), _scopeCache.set(mainScope, cache)), cache;
                }
                getOptionScopes(mainScope, keyLists, resetCache) {
                    const { options , type  } = this, cache = this._cachedScopes(mainScope, resetCache), cached = cache.get(keyLists);
                    if (cached) return cached;
                    const scopes = new Set();
                    keyLists.forEach((keys)=>{
                        mainScope && (scopes.add(mainScope), keys.forEach((key)=>addIfFound(scopes, mainScope, key))), keys.forEach((key)=>addIfFound(scopes, options, key)), keys.forEach((key)=>addIfFound(scopes, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.U[type] || {}, key)), keys.forEach((key)=>addIfFound(scopes, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.d, key)), keys.forEach((key)=>addIfFound(scopes, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.a7, key));
                    });
                    const array = Array.from(scopes);
                    return 0 === array.length && array.push(Object.create(null)), keysCached.has(keyLists) && cache.set(keyLists, array), array;
                }
                chartOptionScopes() {
                    const { options , type  } = this;
                    return [
                        options,
                        _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.U[type] || {},
                        _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.d.datasets[type] || {},
                        {
                            type
                        },
                        _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.d,
                        _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.a7
                    ];
                }
                resolveNamedOptions(scopes, names, context, prefixes = [
                    ''
                ]) {
                    const result = {
                        $shared: !0
                    }, { resolver , subPrefixes  } = getResolver(this._resolverCache, scopes, prefixes);
                    let options = resolver;
                    if (function(proxy, names) {
                        const { isScriptable , isIndexable  } = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.ab)(proxy);
                        for (const prop of names){
                            const scriptable = isScriptable(prop), indexable = isIndexable(prop), value = (indexable || scriptable) && proxy[prop];
                            if (scriptable && ((0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.a8)(value) || hasFunction(value)) || indexable && (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.b)(value)) return !0;
                        }
                        return !1;
                    }(resolver, names)) {
                        result.$shared = !1, context = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.a8)(context) ? context() : context;
                        const subResolver = this.createResolver(scopes, context, subPrefixes);
                        options = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.a9)(resolver, context, subResolver);
                    }
                    for (const prop of names)result[prop] = options[prop];
                    return result;
                }
                createResolver(scopes, context, prefixes = [
                    ''
                ], descriptorDefaults) {
                    const { resolver  } = getResolver(this._resolverCache, scopes, prefixes);
                    return (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.i)(context) ? (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.a9)(resolver, context, void 0, descriptorDefaults) : resolver;
                }
            }
            function getResolver(resolverCache, scopes, prefixes) {
                let cache = resolverCache.get(scopes);
                cache || (cache = new Map(), resolverCache.set(scopes, cache));
                const cacheKey = prefixes.join();
                let cached = cache.get(cacheKey);
                if (!cached) {
                    const resolver = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.aa)(scopes, prefixes);
                    cached = {
                        resolver,
                        subPrefixes: prefixes.filter((p)=>!p.toLowerCase().includes('hover'))
                    }, cache.set(cacheKey, cached);
                }
                return cached;
            }
            const hasFunction = (value)=>(0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.i)(value) && Object.getOwnPropertyNames(value).reduce((acc, key)=>acc || (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.a8)(value[key]), !1), KNOWN_POSITIONS = [
                'top',
                'bottom',
                'left',
                'right',
                'chartArea'
            ];
            function positionIsHorizontal(position, axis) {
                return 'top' === position || 'bottom' === position || -1 === KNOWN_POSITIONS.indexOf(position) && 'x' === axis;
            }
            function compare2Level(l1, l2) {
                return function(a, b) {
                    return a[l1] === b[l1] ? a[l2] - b[l2] : a[l1] - b[l1];
                };
            }
            function onAnimationsComplete(context) {
                const chart = context.chart, animationOptions = chart.options.animation;
                chart.notifyPlugins('afterRender'), (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.C)(animationOptions && animationOptions.onComplete, [
                    context
                ], chart);
            }
            function onAnimationProgress(context) {
                const chart = context.chart, animationOptions = chart.options.animation;
                (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.C)(animationOptions && animationOptions.onProgress, [
                    context
                ], chart);
            }
            function getCanvas(item) {
                return (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.a6)() && 'string' == typeof item ? item = document.getElementById(item) : item && item.length && (item = item[0]), item && item.canvas && (item = item.canvas), item;
            }
            const instances = {}, getChart = (key)=>{
                const canvas = getCanvas(key);
                return Object.values(instances).filter((c)=>c.canvas === canvas).pop();
            };
            function moveNumericKeys(obj, start, move) {
                const keys = Object.keys(obj);
                for (const key of keys){
                    const intKey = +key;
                    if (intKey >= start) {
                        const value = obj[key];
                        delete obj[key], (move > 0 || intKey > start) && (obj[intKey + move] = value);
                    }
                }
            }
            class Chart {
                constructor(item, userConfig){
                    const config = this.config = new Config(userConfig), initialCanvas = getCanvas(item), existingChart = getChart(initialCanvas);
                    if (existingChart) throw Error('Canvas is already in use. Chart with ID \'' + existingChart.id + "' must be destroyed before the canvas with ID '" + existingChart.canvas.id + '\' can be reused.');
                    const options = config.createResolver(config.chartOptionScopes(), this.getContext());
                    this.platform = new (config.platform || (!(0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.a6)() || 'undefined' != typeof OffscreenCanvas && initialCanvas instanceof OffscreenCanvas ? BasicPlatform : DomPlatform))(), this.platform.updateConfig(config);
                    const context = this.platform.acquireContext(initialCanvas, options.aspectRatio), canvas = context && context.canvas, height = canvas && canvas.height, width = canvas && canvas.width;
                    if (this.id = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.ad)(), this.ctx = context, this.canvas = canvas, this.width = width, this.height = height, this._options = options, this._aspectRatio = this.aspectRatio, this._layers = [], this._metasets = [], this._stacks = void 0, this.boxes = [], this.currentDevicePixelRatio = void 0, this.chartArea = void 0, this._active = [], this._lastEvent = void 0, this._listeners = {}, this._responsiveListeners = void 0, this._sortedMetasets = [], this.scales = {}, this._plugins = new PluginService(), this.$proxies = {}, this._hiddenIndices = {}, this.attached = !1, this._animationsDisabled = void 0, this.$context = void 0, this._doResize = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.ae)((mode)=>this.update(mode), options.resizeDelay || 0), this._dataChanges = [], instances[this.id] = this, !context || !canvas) {
                        console.error("Failed to create chart: can't acquire context from the given item");
                        return;
                    }
                    animator.listen(this, 'complete', onAnimationsComplete), animator.listen(this, 'progress', onAnimationProgress), this._initialize(), this.attached && this.update();
                }
                get aspectRatio() {
                    const { options: { aspectRatio , maintainAspectRatio  } , width , height , _aspectRatio  } = this;
                    return (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.k)(aspectRatio) ? maintainAspectRatio && _aspectRatio ? _aspectRatio : height ? width / height : null : aspectRatio;
                }
                get data() {
                    return this.config.data;
                }
                set data(data) {
                    this.config.data = data;
                }
                get options() {
                    return this._options;
                }
                set options(options) {
                    this.config.options = options;
                }
                _initialize() {
                    return this.notifyPlugins('beforeInit'), this.options.responsive ? this.resize() : (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.af)(this, this.options.devicePixelRatio), this.bindEvents(), this.notifyPlugins('afterInit'), this;
                }
                clear() {
                    return (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.ag)(this.canvas, this.ctx), this;
                }
                stop() {
                    return animator.stop(this), this;
                }
                resize(width, height) {
                    animator.running(this) ? this._resizeBeforeDraw = {
                        width,
                        height
                    } : this._resize(width, height);
                }
                _resize(width, height) {
                    const options = this.options, canvas = this.canvas, aspectRatio = options.maintainAspectRatio && this.aspectRatio, newSize = this.platform.getMaximumSize(canvas, width, height, aspectRatio), newRatio = options.devicePixelRatio || this.platform.getDevicePixelRatio(), mode = this.width ? 'resize' : 'attach';
                    this.width = newSize.width, this.height = newSize.height, this._aspectRatio = this.aspectRatio, (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.af)(this, newRatio, !0) && (this.notifyPlugins('resize', {
                        size: newSize
                    }), (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.C)(options.onResize, [
                        this,
                        newSize
                    ], this), this.attached && this._doResize(mode) && this.render());
                }
                ensureScalesHaveIDs() {
                    const options = this.options, scalesOptions = options.scales || {};
                    (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.Q)(scalesOptions, (axisOptions, axisID)=>{
                        axisOptions.id = axisID;
                    });
                }
                buildOrUpdateScales() {
                    const options = this.options, scaleOpts = options.scales, scales = this.scales, updated = Object.keys(scales).reduce((obj, id)=>(obj[id] = !1, obj), {});
                    let items = [];
                    scaleOpts && (items = items.concat(Object.keys(scaleOpts).map((id)=>{
                        const scaleOptions = scaleOpts[id], axis = determineAxis(id, scaleOptions), isRadial = 'r' === axis, isHorizontal = 'x' === axis;
                        return {
                            options: scaleOptions,
                            dposition: isRadial ? 'chartArea' : isHorizontal ? 'bottom' : 'left',
                            dtype: isRadial ? 'radialLinear' : isHorizontal ? 'category' : 'linear'
                        };
                    }))), (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.Q)(items, (item)=>{
                        const scaleOptions = item.options, id = scaleOptions.id, axis = determineAxis(id, scaleOptions), scaleType = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.v)(scaleOptions.type, item.dtype);
                        (void 0 === scaleOptions.position || positionIsHorizontal(scaleOptions.position, axis) !== positionIsHorizontal(item.dposition)) && (scaleOptions.position = item.dposition), updated[id] = !0;
                        let scale = null;
                        if (id in scales && scales[id].type === scaleType) scale = scales[id];
                        else {
                            const scaleClass = registry.getScale(scaleType);
                            scales[(scale = new scaleClass({
                                id,
                                type: scaleType,
                                ctx: this.ctx,
                                chart: this
                            })).id] = scale;
                        }
                        scale.init(scaleOptions, options);
                    }), (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.Q)(updated, (hasUpdated, id)=>{
                        hasUpdated || delete scales[id];
                    }), (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.Q)(scales, (scale)=>{
                        layouts.configure(this, scale, scale.options), layouts.addBox(this, scale);
                    });
                }
                _updateMetasets() {
                    const metasets = this._metasets, numData = this.data.datasets.length, numMeta = metasets.length;
                    if (metasets.sort((a, b)=>a.index - b.index), numMeta > numData) {
                        for(let i = numData; i < numMeta; ++i)this._destroyDatasetMeta(i);
                        metasets.splice(numData, numMeta - numData);
                    }
                    this._sortedMetasets = metasets.slice(0).sort(compare2Level('order', 'index'));
                }
                _removeUnreferencedMetasets() {
                    const { _metasets: metasets , data: { datasets  }  } = this;
                    metasets.length > datasets.length && delete this._stacks, metasets.forEach((meta, index)=>{
                        0 === datasets.filter((x)=>x === meta._dataset).length && this._destroyDatasetMeta(index);
                    });
                }
                buildOrUpdateControllers() {
                    let i, ilen;
                    const newControllers = [], datasets = this.data.datasets;
                    for(this._removeUnreferencedMetasets(), i = 0, ilen = datasets.length; i < ilen; i++){
                        const dataset = datasets[i];
                        let meta = this.getDatasetMeta(i);
                        const type = dataset.type || this.config.type;
                        if (meta.type && meta.type !== type && (this._destroyDatasetMeta(i), meta = this.getDatasetMeta(i)), meta.type = type, meta.indexAxis = dataset.indexAxis || getIndexAxis(type, this.options), meta.order = dataset.order || 0, meta.index = i, meta.label = '' + dataset.label, meta.visible = this.isDatasetVisible(i), meta.controller) meta.controller.updateIndex(i), meta.controller.linkScales();
                        else {
                            const ControllerClass = registry.getController(type), { datasetElementType , dataElementType  } = _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.d.datasets[type];
                            Object.assign(ControllerClass.prototype, {
                                dataElementType: registry.getElement(dataElementType),
                                datasetElementType: datasetElementType && registry.getElement(datasetElementType)
                            }), meta.controller = new ControllerClass(this, i), newControllers.push(meta.controller);
                        }
                    }
                    return this._updateMetasets(), newControllers;
                }
                _resetElements() {
                    (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.Q)(this.data.datasets, (dataset, datasetIndex)=>{
                        this.getDatasetMeta(datasetIndex).controller.reset();
                    }, this);
                }
                reset() {
                    this._resetElements(), this.notifyPlugins('reset');
                }
                update(mode) {
                    const config = this.config;
                    config.update();
                    const options = this._options = config.createResolver(config.chartOptionScopes(), this.getContext()), animsDisabled = this._animationsDisabled = !options.animation;
                    if (this._updateScales(), this._checkEventBindings(), this._updateHiddenIndices(), this._plugins.invalidate(), !1 === this.notifyPlugins('beforeUpdate', {
                        mode,
                        cancelable: !0
                    })) return;
                    const newControllers = this.buildOrUpdateControllers();
                    this.notifyPlugins('beforeElementsUpdate');
                    let minPadding = 0;
                    for(let i = 0, ilen = this.data.datasets.length; i < ilen; i++){
                        const { controller  } = this.getDatasetMeta(i), reset = !animsDisabled && -1 === newControllers.indexOf(controller);
                        controller.buildOrUpdateElements(reset), minPadding = Math.max(+controller.getMaxOverflow(), minPadding);
                    }
                    minPadding = this._minPadding = options.layout.autoPadding ? minPadding : 0, this._updateLayout(minPadding), animsDisabled || (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.Q)(newControllers, (controller)=>{
                        controller.reset();
                    }), this._updateDatasets(mode), this.notifyPlugins('afterUpdate', {
                        mode
                    }), this._layers.sort(compare2Level('z', '_idx'));
                    const { _active , _lastEvent  } = this;
                    _lastEvent ? this._eventHandler(_lastEvent, !0) : _active.length && this._updateHoverStyles(_active, _active, !0), this.render();
                }
                _updateScales() {
                    (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.Q)(this.scales, (scale)=>{
                        layouts.removeBox(this, scale);
                    }), this.ensureScalesHaveIDs(), this.buildOrUpdateScales();
                }
                _checkEventBindings() {
                    const options = this.options, existingEvents = new Set(Object.keys(this._listeners)), newEvents = new Set(options.events);
                    (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.ah)(existingEvents, newEvents) && !!this._responsiveListeners === options.responsive || (this.unbindEvents(), this.bindEvents());
                }
                _updateHiddenIndices() {
                    const { _hiddenIndices  } = this, changes = this._getUniformDataChanges() || [];
                    for (const { method , start , count  } of changes){
                        const move = '_removeElements' === method ? -count : count;
                        moveNumericKeys(_hiddenIndices, start, move);
                    }
                }
                _getUniformDataChanges() {
                    const _dataChanges = this._dataChanges;
                    if (!_dataChanges || !_dataChanges.length) return;
                    this._dataChanges = [];
                    const datasetCount = this.data.datasets.length, makeSet = (idx)=>new Set(_dataChanges.filter((c)=>c[0] === idx).map((c, i)=>i + ',' + c.splice(1).join(','))), changeSet = makeSet(0);
                    for(let i = 1; i < datasetCount; i++)if (!(0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.ah)(changeSet, makeSet(i))) return;
                    return Array.from(changeSet).map((c)=>c.split(',')).map((a)=>({
                            method: a[1],
                            start: +a[2],
                            count: +a[3]
                        }));
                }
                _updateLayout(minPadding) {
                    if (!1 === this.notifyPlugins('beforeLayout', {
                        cancelable: !0
                    })) return;
                    layouts.update(this, this.width, this.height, minPadding);
                    const area = this.chartArea, noArea = area.width <= 0 || area.height <= 0;
                    this._layers = [], (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.Q)(this.boxes, (box)=>{
                        noArea && 'chartArea' === box.position || (box.configure && box.configure(), this._layers.push(...box._layers()));
                    }, this), this._layers.forEach((item, index)=>{
                        item._idx = index;
                    }), this.notifyPlugins('afterLayout');
                }
                _updateDatasets(mode) {
                    if (!1 !== this.notifyPlugins('beforeDatasetsUpdate', {
                        mode,
                        cancelable: !0
                    })) {
                        for(let i = 0, ilen = this.data.datasets.length; i < ilen; ++i)this.getDatasetMeta(i).controller.configure();
                        for(let i1 = 0, ilen1 = this.data.datasets.length; i1 < ilen1; ++i1)this._updateDataset(i1, (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.a8)(mode) ? mode({
                            datasetIndex: i1
                        }) : mode);
                        this.notifyPlugins('afterDatasetsUpdate', {
                            mode
                        });
                    }
                }
                _updateDataset(index, mode) {
                    const meta = this.getDatasetMeta(index), args = {
                        meta,
                        index,
                        mode,
                        cancelable: !0
                    };
                    !1 !== this.notifyPlugins('beforeDatasetUpdate', args) && (meta.controller._update(mode), args.cancelable = !1, this.notifyPlugins('afterDatasetUpdate', args));
                }
                render() {
                    !1 !== this.notifyPlugins('beforeRender', {
                        cancelable: !0
                    }) && (animator.has(this) ? this.attached && !animator.running(this) && animator.start(this) : (this.draw(), onAnimationsComplete({
                        chart: this
                    })));
                }
                draw() {
                    let i;
                    if (this._resizeBeforeDraw) {
                        const { width , height  } = this._resizeBeforeDraw;
                        this._resize(width, height), this._resizeBeforeDraw = null;
                    }
                    if (this.clear(), this.width <= 0 || this.height <= 0 || !1 === this.notifyPlugins('beforeDraw', {
                        cancelable: !0
                    })) return;
                    const layers = this._layers;
                    for(i = 0; i < layers.length && layers[i].z <= 0; ++i)layers[i].draw(this.chartArea);
                    for(this._drawDatasets(); i < layers.length; ++i)layers[i].draw(this.chartArea);
                    this.notifyPlugins('afterDraw');
                }
                _getSortedDatasetMetas(filterVisible) {
                    let i, ilen;
                    const metasets = this._sortedMetasets, result = [];
                    for(i = 0, ilen = metasets.length; i < ilen; ++i){
                        const meta = metasets[i];
                        (!filterVisible || meta.visible) && result.push(meta);
                    }
                    return result;
                }
                getSortedVisibleDatasetMetas() {
                    return this._getSortedDatasetMetas(!0);
                }
                _drawDatasets() {
                    if (!1 === this.notifyPlugins('beforeDatasetsDraw', {
                        cancelable: !0
                    })) return;
                    const metasets = this.getSortedVisibleDatasetMetas();
                    for(let i = metasets.length - 1; i >= 0; --i)this._drawDataset(metasets[i]);
                    this.notifyPlugins('afterDatasetsDraw');
                }
                _drawDataset(meta) {
                    const ctx = this.ctx, clip = meta._clip, useClip = !clip.disabled, area = this.chartArea, args = {
                        meta,
                        index: meta.index,
                        cancelable: !0
                    };
                    !1 !== this.notifyPlugins('beforeDatasetDraw', args) && (useClip && (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.L)(ctx, {
                        left: !1 === clip.left ? 0 : area.left - clip.left,
                        right: !1 === clip.right ? this.width : area.right + clip.right,
                        top: !1 === clip.top ? 0 : area.top - clip.top,
                        bottom: !1 === clip.bottom ? this.height : area.bottom + clip.bottom
                    }), meta.controller.draw(), useClip && (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.N)(ctx), args.cancelable = !1, this.notifyPlugins('afterDatasetDraw', args));
                }
                isPointInArea(point) {
                    return (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.$)(point, this.chartArea, this._minPadding);
                }
                getElementsAtEventForMode(e, mode, options, useFinalPosition) {
                    const method = Interaction.modes[mode];
                    return 'function' == typeof method ? method(this, e, options, useFinalPosition) : [];
                }
                getDatasetMeta(datasetIndex) {
                    const dataset = this.data.datasets[datasetIndex], metasets = this._metasets;
                    let meta = metasets.filter((x)=>x && x._dataset === dataset).pop();
                    return meta || (meta = {
                        type: null,
                        data: [],
                        dataset: null,
                        controller: null,
                        hidden: null,
                        xAxisID: null,
                        yAxisID: null,
                        order: dataset && dataset.order || 0,
                        index: datasetIndex,
                        _dataset: dataset,
                        _parsed: [],
                        _sorted: !1
                    }, metasets.push(meta)), meta;
                }
                getContext() {
                    return this.$context || (this.$context = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.h)(null, {
                        chart: this,
                        type: 'chart'
                    }));
                }
                getVisibleDatasetCount() {
                    return this.getSortedVisibleDatasetMetas().length;
                }
                isDatasetVisible(datasetIndex) {
                    const dataset = this.data.datasets[datasetIndex];
                    if (!dataset) return !1;
                    const meta = this.getDatasetMeta(datasetIndex);
                    return 'boolean' == typeof meta.hidden ? !meta.hidden : !dataset.hidden;
                }
                setDatasetVisibility(datasetIndex, visible) {
                    const meta = this.getDatasetMeta(datasetIndex);
                    meta.hidden = !visible;
                }
                toggleDataVisibility(index) {
                    this._hiddenIndices[index] = !this._hiddenIndices[index];
                }
                getDataVisibility(index) {
                    return !this._hiddenIndices[index];
                }
                _updateVisibility(datasetIndex, dataIndex, visible) {
                    const mode = visible ? 'show' : 'hide', meta = this.getDatasetMeta(datasetIndex), anims = meta.controller._resolveAnimations(void 0, mode);
                    (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.j)(dataIndex) ? (meta.data[dataIndex].hidden = !visible, this.update()) : (this.setDatasetVisibility(datasetIndex, visible), anims.update(meta, {
                        visible
                    }), this.update((ctx)=>ctx.datasetIndex === datasetIndex ? mode : void 0));
                }
                hide(datasetIndex, dataIndex) {
                    this._updateVisibility(datasetIndex, dataIndex, !1);
                }
                show(datasetIndex, dataIndex) {
                    this._updateVisibility(datasetIndex, dataIndex, !0);
                }
                _destroyDatasetMeta(datasetIndex) {
                    const meta = this._metasets[datasetIndex];
                    meta && meta.controller && meta.controller._destroy(), delete this._metasets[datasetIndex];
                }
                _stop() {
                    let i, ilen;
                    for(this.stop(), animator.remove(this), i = 0, ilen = this.data.datasets.length; i < ilen; ++i)this._destroyDatasetMeta(i);
                }
                destroy() {
                    this.notifyPlugins('beforeDestroy');
                    const { canvas , ctx  } = this;
                    this._stop(), this.config.clearCache(), canvas && (this.unbindEvents(), (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.ag)(canvas, ctx), this.platform.releaseContext(ctx), this.canvas = null, this.ctx = null), this.notifyPlugins('destroy'), delete instances[this.id], this.notifyPlugins('afterDestroy');
                }
                toBase64Image(...args) {
                    return this.canvas.toDataURL(...args);
                }
                bindEvents() {
                    this.bindUserEvents(), this.options.responsive ? this.bindResponsiveEvents() : this.attached = !0;
                }
                bindUserEvents() {
                    const listeners = this._listeners, platform = this.platform, _add = (type, listener)=>{
                        platform.addEventListener(this, type, listener), listeners[type] = listener;
                    }, listener = (e, x, y)=>{
                        e.offsetX = x, e.offsetY = y, this._eventHandler(e);
                    };
                    (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.Q)(this.options.events, (type)=>_add(type, listener));
                }
                bindResponsiveEvents() {
                    let detached;
                    this._responsiveListeners || (this._responsiveListeners = {});
                    const listeners = this._responsiveListeners, platform = this.platform, _add = (type, listener)=>{
                        platform.addEventListener(this, type, listener), listeners[type] = listener;
                    }, _remove = (type, listener)=>{
                        listeners[type] && (platform.removeEventListener(this, type, listener), delete listeners[type]);
                    }, listener = (width, height)=>{
                        this.canvas && this.resize(width, height);
                    }, attached = ()=>{
                        _remove('attach', attached), this.attached = !0, this.resize(), _add('resize', listener), _add('detach', detached);
                    };
                    detached = ()=>{
                        this.attached = !1, _remove('resize', listener), this._stop(), this._resize(0, 0), _add('attach', attached);
                    }, platform.isAttached(this.canvas) ? attached() : detached();
                }
                unbindEvents() {
                    (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.Q)(this._listeners, (listener, type)=>{
                        this.platform.removeEventListener(this, type, listener);
                    }), this._listeners = {}, (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.Q)(this._responsiveListeners, (listener, type)=>{
                        this.platform.removeEventListener(this, type, listener);
                    }), this._responsiveListeners = void 0;
                }
                updateHoverStyle(items, mode, enabled) {
                    let item, i, ilen;
                    const prefix = enabled ? 'set' : 'remove';
                    for('dataset' === mode && this.getDatasetMeta(items[0].datasetIndex).controller['_' + prefix + 'DatasetHoverStyle'](), i = 0, ilen = items.length; i < ilen; ++i){
                        item = items[i];
                        const controller = item && this.getDatasetMeta(item.datasetIndex).controller;
                        controller && controller[prefix + 'HoverStyle'](item.element, item.datasetIndex, item.index);
                    }
                }
                getActiveElements() {
                    return this._active || [];
                }
                setActiveElements(activeElements) {
                    const lastActive = this._active || [], active = activeElements.map(({ datasetIndex , index  })=>{
                        const meta = this.getDatasetMeta(datasetIndex);
                        if (!meta) throw Error('No dataset found at index ' + datasetIndex);
                        return {
                            datasetIndex,
                            element: meta.data[index],
                            index
                        };
                    }), changed = !(0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.ai)(active, lastActive);
                    changed && (this._active = active, this._lastEvent = null, this._updateHoverStyles(active, lastActive));
                }
                notifyPlugins(hook, args, filter) {
                    return this._plugins.notify(this, hook, args, filter);
                }
                _updateHoverStyles(active, lastActive, replay) {
                    const hoverOptions = this.options.hover, diff = (a, b)=>a.filter((x)=>!b.some((y)=>x.datasetIndex === y.datasetIndex && x.index === y.index)), deactivated = diff(lastActive, active), activated = replay ? active : diff(active, lastActive);
                    deactivated.length && this.updateHoverStyle(deactivated, hoverOptions.mode, !1), activated.length && hoverOptions.mode && this.updateHoverStyle(activated, hoverOptions.mode, !0);
                }
                _eventHandler(e, replay) {
                    const args = {
                        event: e,
                        replay,
                        cancelable: !0,
                        inChartArea: this.isPointInArea(e)
                    }, eventFilter = (plugin)=>(plugin.options.events || this.options.events).includes(e.native.type);
                    if (!1 === this.notifyPlugins('beforeEvent', args, eventFilter)) return;
                    const changed = this._handleEvent(e, replay, args.inChartArea);
                    return args.cancelable = !1, this.notifyPlugins('afterEvent', args, eventFilter), (changed || args.changed) && this.render(), this;
                }
                _handleEvent(e, replay, inChartArea) {
                    var lastEvent;
                    const { _active: lastActive = [] , options  } = this, active = this._getActiveElements(e, lastActive, inChartArea, replay), isClick = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.aj)(e), lastEvent1 = (lastEvent = this._lastEvent, inChartArea && 'mouseout' !== e.type ? isClick ? lastEvent : e : null);
                    inChartArea && (this._lastEvent = null, (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.C)(options.onHover, [
                        e,
                        active,
                        this
                    ], this), isClick && (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.C)(options.onClick, [
                        e,
                        active,
                        this
                    ], this));
                    const changed = !(0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.ai)(active, lastActive);
                    return (changed || replay) && (this._active = active, this._updateHoverStyles(active, lastActive, replay)), this._lastEvent = lastEvent1, changed;
                }
                _getActiveElements(e, lastActive, inChartArea, useFinalPosition) {
                    if ('mouseout' === e.type) return [];
                    if (!inChartArea) return lastActive;
                    const hoverOptions = this.options.hover;
                    return this.getElementsAtEventForMode(e, hoverOptions.mode, hoverOptions, useFinalPosition);
                }
            }
            const invalidatePlugins = ()=>(0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.Q)(Chart.instances, (chart)=>chart._plugins.invalidate());
            function clipArc(ctx, element, endAngle) {
                const { startAngle , pixelMargin , x , y , outerRadius , innerRadius  } = element;
                let angleMargin = pixelMargin / outerRadius;
                ctx.beginPath(), ctx.arc(x, y, outerRadius, startAngle - angleMargin, endAngle + angleMargin), innerRadius > pixelMargin ? (angleMargin = pixelMargin / innerRadius, ctx.arc(x, y, innerRadius, endAngle + angleMargin, startAngle - angleMargin, !0)) : ctx.arc(x, y, pixelMargin, endAngle + _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.H, startAngle - _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.H), ctx.closePath(), ctx.clip();
            }
            function rThetaToXY(r, theta, x, y) {
                return {
                    x: x + r * Math.cos(theta),
                    y: y + r * Math.sin(theta)
                };
            }
            function pathArc(ctx, element, offset, spacing, end, circular) {
                const { x , y , startAngle: start , pixelMargin , innerRadius: innerR  } = element, outerRadius = Math.max(element.outerRadius + spacing + offset - pixelMargin, 0), innerRadius = innerR > 0 ? innerR + spacing + offset + pixelMargin : 0;
                let spacingOffset = 0;
                const alpha = end - start;
                if (spacing) {
                    const avNogSpacingRadius = ((innerR > 0 ? innerR - spacing : 0) + (outerRadius > 0 ? outerRadius - spacing : 0)) / 2;
                    spacingOffset = (alpha - (0 !== avNogSpacingRadius ? alpha * avNogSpacingRadius / (avNogSpacingRadius + spacing) : alpha)) / 2;
                }
                const beta = Math.max(0.001, alpha * outerRadius - offset / _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.P) / outerRadius, angleOffset = (alpha - beta) / 2, startAngle = start + angleOffset + spacingOffset, endAngle = end - angleOffset - spacingOffset, { outerStart , outerEnd , innerStart , innerEnd  } = function(arc, innerRadius, outerRadius, angleDelta) {
                    var value;
                    const o = (value = arc.options.borderRadius, (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.al)(value, [
                        'outerStart',
                        'outerEnd',
                        'innerStart',
                        'innerEnd'
                    ])), halfThickness = (outerRadius - innerRadius) / 2, innerLimit = Math.min(halfThickness, angleDelta * innerRadius / 2), computeOuterLimit = (val)=>(0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.E)(val, 0, Math.min(halfThickness, (outerRadius - Math.min(halfThickness, val)) * angleDelta / 2));
                    return {
                        outerStart: computeOuterLimit(o.outerStart),
                        outerEnd: computeOuterLimit(o.outerEnd),
                        innerStart: (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.E)(o.innerStart, 0, innerLimit),
                        innerEnd: (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.E)(o.innerEnd, 0, innerLimit)
                    };
                }(element, innerRadius, outerRadius, endAngle - startAngle), outerStartAdjustedRadius = outerRadius - outerStart, outerEndAdjustedRadius = outerRadius - outerEnd, outerStartAdjustedAngle = startAngle + outerStart / outerStartAdjustedRadius, outerEndAdjustedAngle = endAngle - outerEnd / outerEndAdjustedRadius, innerStartAdjustedRadius = innerRadius + innerStart, innerEndAdjustedRadius = innerRadius + innerEnd, innerStartAdjustedAngle = startAngle + innerStart / innerStartAdjustedRadius, innerEndAdjustedAngle = endAngle - innerEnd / innerEndAdjustedRadius;
                if (ctx.beginPath(), circular) {
                    if (ctx.arc(x, y, outerRadius, outerStartAdjustedAngle, outerEndAdjustedAngle), outerEnd > 0) {
                        const pCenter = rThetaToXY(outerEndAdjustedRadius, outerEndAdjustedAngle, x, y);
                        ctx.arc(pCenter.x, pCenter.y, outerEnd, outerEndAdjustedAngle, endAngle + _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.H);
                    }
                    const p4 = rThetaToXY(innerEndAdjustedRadius, endAngle, x, y);
                    if (ctx.lineTo(p4.x, p4.y), innerEnd > 0) {
                        const pCenter1 = rThetaToXY(innerEndAdjustedRadius, innerEndAdjustedAngle, x, y);
                        ctx.arc(pCenter1.x, pCenter1.y, innerEnd, endAngle + _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.H, innerEndAdjustedAngle + Math.PI);
                    }
                    if (ctx.arc(x, y, innerRadius, endAngle - innerEnd / innerRadius, startAngle + innerStart / innerRadius, !0), innerStart > 0) {
                        const pCenter2 = rThetaToXY(innerStartAdjustedRadius, innerStartAdjustedAngle, x, y);
                        ctx.arc(pCenter2.x, pCenter2.y, innerStart, innerStartAdjustedAngle + Math.PI, startAngle - _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.H);
                    }
                    const p8 = rThetaToXY(outerStartAdjustedRadius, startAngle, x, y);
                    if (ctx.lineTo(p8.x, p8.y), outerStart > 0) {
                        const pCenter3 = rThetaToXY(outerStartAdjustedRadius, outerStartAdjustedAngle, x, y);
                        ctx.arc(pCenter3.x, pCenter3.y, outerStart, startAngle - _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.H, outerStartAdjustedAngle);
                    }
                } else ctx.moveTo(x, y), ctx.lineTo(Math.cos(outerStartAdjustedAngle) * outerRadius + x, Math.sin(outerStartAdjustedAngle) * outerRadius + y), ctx.lineTo(Math.cos(outerEndAdjustedAngle) * outerRadius + x, Math.sin(outerEndAdjustedAngle) * outerRadius + y);
                ctx.closePath();
            }
            Object.defineProperties(Chart, {
                defaults: {
                    enumerable: !0,
                    value: _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.d
                },
                instances: {
                    enumerable: !0,
                    value: instances
                },
                overrides: {
                    enumerable: !0,
                    value: _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.U
                },
                registry: {
                    enumerable: !0,
                    value: registry
                },
                version: {
                    enumerable: !0,
                    value: "3.9.1"
                },
                getChart: {
                    enumerable: !0,
                    value: getChart
                },
                register: {
                    enumerable: !0,
                    value (...items) {
                        registry.add(...items), invalidatePlugins();
                    }
                },
                unregister: {
                    enumerable: !0,
                    value (...items) {
                        registry.remove(...items), invalidatePlugins();
                    }
                }
            });
            class ArcElement extends Element {
                constructor(cfg){
                    super(), this.options = void 0, this.circumference = void 0, this.startAngle = void 0, this.endAngle = void 0, this.innerRadius = void 0, this.outerRadius = void 0, this.pixelMargin = 0, this.fullCircles = 0, cfg && Object.assign(this, cfg);
                }
                inRange(chartX, chartY, useFinalPosition) {
                    const point = this.getProps([
                        'x',
                        'y'
                    ], useFinalPosition), { angle , distance  } = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.a0)(point, {
                        x: chartX,
                        y: chartY
                    }), { startAngle , endAngle , innerRadius , outerRadius , circumference  } = this.getProps([
                        'startAngle',
                        'endAngle',
                        'innerRadius',
                        'outerRadius',
                        'circumference'
                    ], useFinalPosition), rAdjust = this.options.spacing / 2, _circumference = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.v)(circumference, endAngle - startAngle), betweenAngles = _circumference >= _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.T || (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.p)(angle, startAngle, endAngle), withinRadius = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.ak)(distance, innerRadius + rAdjust, outerRadius + rAdjust);
                    return betweenAngles && withinRadius;
                }
                getCenterPoint(useFinalPosition) {
                    const { x , y , startAngle , endAngle , innerRadius , outerRadius  } = this.getProps([
                        'x',
                        'y',
                        'startAngle',
                        'endAngle',
                        'innerRadius',
                        'outerRadius',
                        'circumference'
                    ], useFinalPosition), { offset , spacing  } = this.options, halfAngle = (startAngle + endAngle) / 2, halfRadius = (innerRadius + outerRadius + spacing + offset) / 2;
                    return {
                        x: x + Math.cos(halfAngle) * halfRadius,
                        y: y + Math.sin(halfAngle) * halfRadius
                    };
                }
                tooltipPosition(useFinalPosition) {
                    return this.getCenterPoint(useFinalPosition);
                }
                draw(ctx) {
                    const { options , circumference  } = this, offset = (options.offset || 0) / 2, spacing = (options.spacing || 0) / 2, circular = options.circular;
                    if (this.pixelMargin = 'inner' === options.borderAlign ? 0.33 : 0, this.fullCircles = circumference > _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.T ? Math.floor(circumference / _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.T) : 0, 0 === circumference || this.innerRadius < 0 || this.outerRadius < 0) return;
                    ctx.save();
                    let radiusOffset = 0;
                    if (offset) {
                        radiusOffset = offset / 2;
                        const halfAngle = (this.startAngle + this.endAngle) / 2;
                        ctx.translate(Math.cos(halfAngle) * radiusOffset, Math.sin(halfAngle) * radiusOffset), this.circumference >= _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.P && (radiusOffset = offset);
                    }
                    ctx.fillStyle = options.backgroundColor, ctx.strokeStyle = options.borderColor;
                    const endAngle = function(ctx, element, offset, spacing, circular) {
                        const { fullCircles , startAngle , circumference  } = element;
                        let endAngle = element.endAngle;
                        if (fullCircles) {
                            pathArc(ctx, element, offset, spacing, startAngle + _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.T, circular);
                            for(let i = 0; i < fullCircles; ++i)ctx.fill();
                            isNaN(circumference) || (endAngle = startAngle + circumference % _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.T, circumference % _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.T != 0 || (endAngle += _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.T));
                        }
                        return pathArc(ctx, element, offset, spacing, endAngle, circular), ctx.fill(), endAngle;
                    }(ctx, this, radiusOffset, spacing, circular);
                    !function(ctx, element, offset, spacing, endAngle, circular) {
                        const { options  } = element, { borderWidth , borderJoinStyle  } = options, inner = 'inner' === options.borderAlign;
                        borderWidth && (inner ? (ctx.lineWidth = 2 * borderWidth, ctx.lineJoin = borderJoinStyle || 'round') : (ctx.lineWidth = borderWidth, ctx.lineJoin = borderJoinStyle || 'bevel'), element.fullCircles && function(ctx, element, inner) {
                            let i;
                            const { x , y , startAngle , pixelMargin , fullCircles  } = element, outerRadius = Math.max(element.outerRadius - pixelMargin, 0), innerRadius = element.innerRadius + pixelMargin;
                            for(inner && clipArc(ctx, element, startAngle + _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.T), ctx.beginPath(), ctx.arc(x, y, innerRadius, startAngle + _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.T, startAngle, !0), i = 0; i < fullCircles; ++i)ctx.stroke();
                            for(ctx.beginPath(), ctx.arc(x, y, outerRadius, startAngle, startAngle + _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.T), i = 0; i < fullCircles; ++i)ctx.stroke();
                        }(ctx, element, inner), inner && clipArc(ctx, element, endAngle), pathArc(ctx, element, offset, spacing, endAngle, circular), ctx.stroke());
                    }(ctx, this, radiusOffset, spacing, endAngle, circular), ctx.restore();
                }
            }
            function setStyle(ctx, options, style = options) {
                ctx.lineCap = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.v)(style.borderCapStyle, options.borderCapStyle), ctx.setLineDash((0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.v)(style.borderDash, options.borderDash)), ctx.lineDashOffset = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.v)(style.borderDashOffset, options.borderDashOffset), ctx.lineJoin = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.v)(style.borderJoinStyle, options.borderJoinStyle), ctx.lineWidth = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.v)(style.borderWidth, options.borderWidth), ctx.strokeStyle = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.v)(style.borderColor, options.borderColor);
            }
            function lineTo(ctx, previous, target) {
                ctx.lineTo(target.x, target.y);
            }
            function pathVars(points, segment, params = {}) {
                const count = points.length, { start: paramsStart = 0 , end: paramsEnd = count - 1  } = params, { start: segmentStart , end: segmentEnd  } = segment, start = Math.max(paramsStart, segmentStart), end = Math.min(paramsEnd, segmentEnd);
                return {
                    count,
                    start,
                    loop: segment.loop,
                    ilen: end < start && !(paramsStart < segmentStart && paramsEnd < segmentStart || paramsStart > segmentEnd && paramsEnd > segmentEnd) ? count + end - start : end - start
                };
            }
            function pathSegment(ctx, line, segment, params) {
                let i, point, prev;
                const { points , options  } = line, { count , start , loop , ilen  } = pathVars(points, segment, params), lineMethod = options.stepped ? _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.as : options.tension || 'monotone' === options.cubicInterpolationMode ? _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.at : lineTo;
                let { move =!0 , reverse  } = params || {};
                for(i = 0; i <= ilen; ++i)(point = points[(start + (reverse ? ilen - i : i)) % count]).skip || (move ? (ctx.moveTo(point.x, point.y), move = !1) : lineMethod(ctx, prev, point, reverse, options.stepped), prev = point);
                return loop && (point = points[(start + (reverse ? ilen : 0)) % count], lineMethod(ctx, prev, point, reverse, options.stepped)), !!loop;
            }
            function fastPathSegment(ctx, line, segment, params) {
                let i, point, prevX, minY, maxY, lastY;
                const points = line.points, { count , start , ilen  } = pathVars(points, segment, params), { move =!0 , reverse  } = params || {};
                let avgX = 0, countX = 0;
                const pointIndex = (index)=>(start + (reverse ? ilen - index : index)) % count, drawX = ()=>{
                    minY !== maxY && (ctx.lineTo(avgX, maxY), ctx.lineTo(avgX, minY), ctx.lineTo(avgX, lastY));
                };
                for(move && (point = points[pointIndex(0)], ctx.moveTo(point.x, point.y)), i = 0; i <= ilen; ++i){
                    if ((point = points[pointIndex(i)]).skip) continue;
                    const x = point.x, y = point.y, truncX = 0 | x;
                    truncX === prevX ? (y < minY ? minY = y : y > maxY && (maxY = y), avgX = (countX * avgX + x) / ++countX) : (drawX(), ctx.lineTo(x, y), prevX = truncX, countX = 0, minY = maxY = y), lastY = y;
                }
                drawX();
            }
            function _getSegmentMethod(line) {
                const opts = line.options, borderDash = opts.borderDash && opts.borderDash.length, useFastPath = !line._decimated && !line._loop && !opts.tension && 'monotone' !== opts.cubicInterpolationMode && !opts.stepped && !borderDash;
                return useFastPath ? fastPathSegment : pathSegment;
            }
            ArcElement.id = 'arc', ArcElement.defaults = {
                borderAlign: 'center',
                borderColor: '#fff',
                borderJoinStyle: void 0,
                borderRadius: 0,
                borderWidth: 2,
                offset: 0,
                spacing: 0,
                angle: void 0,
                circular: !0
            }, ArcElement.defaultRoutes = {
                backgroundColor: 'backgroundColor'
            };
            const usePath2D = 'function' == typeof Path2D;
            class LineElement extends Element {
                constructor(cfg){
                    super(), this.animated = !0, this.options = void 0, this._chart = void 0, this._loop = void 0, this._fullLoop = void 0, this._path = void 0, this._points = void 0, this._segments = void 0, this._decimated = !1, this._pointsUpdated = !1, this._datasetIndex = void 0, cfg && Object.assign(this, cfg);
                }
                updateControlPoints(chartArea, indexAxis) {
                    const options = this.options;
                    if ((options.tension || 'monotone' === options.cubicInterpolationMode) && !options.stepped && !this._pointsUpdated) {
                        const loop = options.spanGaps ? this._loop : this._fullLoop;
                        (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.am)(this._points, options, chartArea, loop, indexAxis), this._pointsUpdated = !0;
                    }
                }
                set points(points) {
                    this._points = points, delete this._segments, delete this._path, this._pointsUpdated = !1;
                }
                get points() {
                    return this._points;
                }
                get segments() {
                    return this._segments || (this._segments = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.an)(this, this.options.segment));
                }
                first() {
                    const segments = this.segments, points = this.points;
                    return segments.length && points[segments[0].start];
                }
                last() {
                    const segments = this.segments, points = this.points, count = segments.length;
                    return count && points[segments[count - 1].end];
                }
                interpolate(point, property) {
                    let i, ilen;
                    const options = this.options, value = point[property], points = this.points, segments = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.ao)(this, {
                        property,
                        start: value,
                        end: value
                    });
                    if (!segments.length) return;
                    const result = [], _interpolate = options.stepped ? _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.ap : options.tension || 'monotone' === options.cubicInterpolationMode ? _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.aq : _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.ar;
                    for(i = 0, ilen = segments.length; i < ilen; ++i){
                        const { start , end  } = segments[i], p1 = points[start], p2 = points[end];
                        if (p1 === p2) {
                            result.push(p1);
                            continue;
                        }
                        const t = Math.abs((value - p1[property]) / (p2[property] - p1[property])), interpolated = _interpolate(p1, p2, t, options.stepped);
                        interpolated[property] = point[property], result.push(interpolated);
                    }
                    return 1 === result.length ? result[0] : result;
                }
                pathSegment(ctx, segment, params) {
                    const segmentMethod = _getSegmentMethod(this);
                    return segmentMethod(ctx, this, segment, params);
                }
                path(ctx, start, count) {
                    const segments = this.segments, segmentMethod = _getSegmentMethod(this);
                    let loop = this._loop;
                    for (const segment of (start = start || 0, count = count || this.points.length - start, segments))loop &= segmentMethod(ctx, this, segment, {
                        start,
                        end: start + count - 1
                    });
                    return !!loop;
                }
                draw(ctx, chartArea, start, count) {
                    const options = this.options || {}, points = this.points || [];
                    points.length && options.borderWidth && (ctx.save(), function(ctx, line, start, count) {
                        if (usePath2D && !line.options.segment) {
                            var line1;
                            let path;
                            (path = (line1 = line)._path) || (path = line1._path = new Path2D(), line1.path(path, start, count) && path.closePath()), setStyle(ctx, line1.options), ctx.stroke(path);
                        } else !function(ctx, line, start, count) {
                            const { segments , options  } = line, segmentMethod = _getSegmentMethod(line);
                            for (const segment of segments)setStyle(ctx, options, segment.style), ctx.beginPath(), segmentMethod(ctx, line, segment, {
                                start,
                                end: start + count - 1
                            }) && ctx.closePath(), ctx.stroke();
                        }(ctx, line, start, count);
                    }(ctx, this, start, count), ctx.restore()), this.animated && (this._pointsUpdated = !1, this._path = void 0);
                }
            }
            function inRange$1(el, pos, axis, useFinalPosition) {
                const options = el.options, { [axis]: value  } = el.getProps([
                    axis
                ], useFinalPosition);
                return Math.abs(pos - value) < options.radius + options.hitRadius;
            }
            LineElement.id = 'line', LineElement.defaults = {
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0,
                borderJoinStyle: 'miter',
                borderWidth: 3,
                capBezierPoints: !0,
                cubicInterpolationMode: 'default',
                fill: !1,
                spanGaps: !1,
                stepped: !1,
                tension: 0
            }, LineElement.defaultRoutes = {
                backgroundColor: 'backgroundColor',
                borderColor: 'borderColor'
            }, LineElement.descriptors = {
                _scriptable: !0,
                _indexable: (name)=>'borderDash' !== name && 'fill' !== name
            };
            class PointElement extends Element {
                constructor(cfg){
                    super(), this.options = void 0, this.parsed = void 0, this.skip = void 0, this.stop = void 0, cfg && Object.assign(this, cfg);
                }
                inRange(mouseX, mouseY, useFinalPosition) {
                    const options = this.options, { x , y  } = this.getProps([
                        'x',
                        'y'
                    ], useFinalPosition);
                    return Math.pow(mouseX - x, 2) + Math.pow(mouseY - y, 2) < Math.pow(options.hitRadius + options.radius, 2);
                }
                inXRange(mouseX, useFinalPosition) {
                    return inRange$1(this, mouseX, 'x', useFinalPosition);
                }
                inYRange(mouseY, useFinalPosition) {
                    return inRange$1(this, mouseY, 'y', useFinalPosition);
                }
                getCenterPoint(useFinalPosition) {
                    const { x , y  } = this.getProps([
                        'x',
                        'y'
                    ], useFinalPosition);
                    return {
                        x,
                        y
                    };
                }
                size(options) {
                    options = options || this.options || {};
                    let radius = options.radius || 0;
                    radius = Math.max(radius, radius && options.hoverRadius || 0);
                    const borderWidth = radius && options.borderWidth || 0;
                    return (radius + borderWidth) * 2;
                }
                draw(ctx, area) {
                    const options = this.options;
                    !this.skip && !(options.radius < 0.1) && (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.$)(this, area, this.size(options) / 2) && (ctx.strokeStyle = options.borderColor, ctx.lineWidth = options.borderWidth, ctx.fillStyle = options.backgroundColor, (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.au)(ctx, options, this.x, this.y));
                }
                getRange() {
                    const options = this.options || {};
                    return options.radius + options.hitRadius;
                }
            }
            function getBarBounds(bar, useFinalPosition) {
                let left, right, top, bottom, half;
                const { x , y , base , width , height  } = bar.getProps([
                    'x',
                    'y',
                    'base',
                    'width',
                    'height'
                ], useFinalPosition);
                return bar.horizontal ? (half = height / 2, left = Math.min(x, base), right = Math.max(x, base), top = y - half, bottom = y + half) : (left = x - (half = width / 2), right = x + half, top = Math.min(y, base), bottom = Math.max(y, base)), {
                    left,
                    top,
                    right,
                    bottom
                };
            }
            function skipOrLimit(skip, value, min, max) {
                return skip ? 0 : (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.E)(value, min, max);
            }
            function inRange(bar, x, y, useFinalPosition) {
                const skipX = null === x, skipY = null === y, bounds = bar && !(skipX && skipY) && getBarBounds(bar, useFinalPosition);
                return bounds && (skipX || (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.ak)(x, bounds.left, bounds.right)) && (skipY || (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.ak)(y, bounds.top, bounds.bottom));
            }
            function addNormalRectPath(ctx, rect) {
                ctx.rect(rect.x, rect.y, rect.w, rect.h);
            }
            function inflateRect(rect, amount, refRect = {}) {
                const x = rect.x !== refRect.x ? -amount : 0, y = rect.y !== refRect.y ? -amount : 0, w = (rect.x + rect.w !== refRect.x + refRect.w ? amount : 0) - x, h = (rect.y + rect.h !== refRect.y + refRect.h ? amount : 0) - y;
                return {
                    x: rect.x + x,
                    y: rect.y + y,
                    w: rect.w + w,
                    h: rect.h + h,
                    radius: rect.radius
                };
            }
            PointElement.id = 'point', PointElement.defaults = {
                borderWidth: 1,
                hitRadius: 1,
                hoverBorderWidth: 1,
                hoverRadius: 4,
                pointStyle: 'circle',
                radius: 3,
                rotation: 0
            }, PointElement.defaultRoutes = {
                backgroundColor: 'backgroundColor',
                borderColor: 'borderColor'
            };
            class BarElement extends Element {
                constructor(cfg){
                    super(), this.options = void 0, this.horizontal = void 0, this.base = void 0, this.width = void 0, this.height = void 0, this.inflateAmount = void 0, cfg && Object.assign(this, cfg);
                }
                draw(ctx) {
                    var radius;
                    const { inflateAmount , options: { borderColor , backgroundColor  }  } = this, { inner , outer  } = function(bar) {
                        const bounds = getBarBounds(bar), width = bounds.right - bounds.left, height = bounds.bottom - bounds.top, border = function(bar, maxW, maxH) {
                            const value = bar.options.borderWidth, skip = bar.borderSkipped, o = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.aw)(value);
                            return {
                                t: skipOrLimit(skip.top, o.top, 0, maxH),
                                r: skipOrLimit(skip.right, o.right, 0, maxW),
                                b: skipOrLimit(skip.bottom, o.bottom, 0, maxH),
                                l: skipOrLimit(skip.left, o.left, 0, maxW)
                            };
                        }(bar, width / 2, height / 2), radius = function(bar, maxW, maxH) {
                            const { enableBorderRadius  } = bar.getProps([
                                'enableBorderRadius'
                            ]), value = bar.options.borderRadius, o = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.ax)(value), maxR = Math.min(maxW, maxH), skip = bar.borderSkipped, enableBorder = enableBorderRadius || (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.i)(value);
                            return {
                                topLeft: skipOrLimit(!enableBorder || skip.top || skip.left, o.topLeft, 0, maxR),
                                topRight: skipOrLimit(!enableBorder || skip.top || skip.right, o.topRight, 0, maxR),
                                bottomLeft: skipOrLimit(!enableBorder || skip.bottom || skip.left, o.bottomLeft, 0, maxR),
                                bottomRight: skipOrLimit(!enableBorder || skip.bottom || skip.right, o.bottomRight, 0, maxR)
                            };
                        }(bar, width / 2, height / 2);
                        return {
                            outer: {
                                x: bounds.left,
                                y: bounds.top,
                                w: width,
                                h: height,
                                radius
                            },
                            inner: {
                                x: bounds.left + border.l,
                                y: bounds.top + border.t,
                                w: width - border.l - border.r,
                                h: height - border.t - border.b,
                                radius: {
                                    topLeft: Math.max(0, radius.topLeft - Math.max(border.t, border.l)),
                                    topRight: Math.max(0, radius.topRight - Math.max(border.t, border.r)),
                                    bottomLeft: Math.max(0, radius.bottomLeft - Math.max(border.b, border.l)),
                                    bottomRight: Math.max(0, radius.bottomRight - Math.max(border.b, border.r))
                                }
                            }
                        };
                    }(this), addRectPath = (radius = outer.radius).topLeft || radius.topRight || radius.bottomLeft || radius.bottomRight ? _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.av : addNormalRectPath;
                    ctx.save(), (outer.w !== inner.w || outer.h !== inner.h) && (ctx.beginPath(), addRectPath(ctx, inflateRect(outer, inflateAmount, inner)), ctx.clip(), addRectPath(ctx, inflateRect(inner, -inflateAmount, outer)), ctx.fillStyle = borderColor, ctx.fill('evenodd')), ctx.beginPath(), addRectPath(ctx, inflateRect(inner, inflateAmount)), ctx.fillStyle = backgroundColor, ctx.fill(), ctx.restore();
                }
                inRange(mouseX, mouseY, useFinalPosition) {
                    return inRange(this, mouseX, mouseY, useFinalPosition);
                }
                inXRange(mouseX, useFinalPosition) {
                    return inRange(this, mouseX, null, useFinalPosition);
                }
                inYRange(mouseY, useFinalPosition) {
                    return inRange(this, null, mouseY, useFinalPosition);
                }
                getCenterPoint(useFinalPosition) {
                    const { x , y , base , horizontal  } = this.getProps([
                        'x',
                        'y',
                        'base',
                        'horizontal'
                    ], useFinalPosition);
                    return {
                        x: horizontal ? (x + base) / 2 : x,
                        y: horizontal ? y : (y + base) / 2
                    };
                }
                getRange(axis) {
                    return 'x' === axis ? this.width / 2 : this.height / 2;
                }
            }
            BarElement.id = 'bar', BarElement.defaults = {
                borderSkipped: 'start',
                borderWidth: 0,
                borderRadius: 0,
                inflateAmount: 'auto',
                pointStyle: void 0
            }, BarElement.defaultRoutes = {
                backgroundColor: 'backgroundColor',
                borderColor: 'borderColor'
            };
            var elements = Object.freeze({
                __proto__: null,
                ArcElement: ArcElement,
                LineElement: LineElement,
                PointElement: PointElement,
                BarElement: BarElement
            });
            function cleanDecimatedDataset(dataset) {
                if (dataset._decimated) {
                    const data = dataset._data;
                    delete dataset._decimated, delete dataset._data, Object.defineProperty(dataset, 'data', {
                        value: data
                    });
                }
            }
            function cleanDecimatedData(chart) {
                chart.data.datasets.forEach((dataset)=>{
                    cleanDecimatedDataset(dataset);
                });
            }
            function _getBounds(property, first, last, loop) {
                if (loop) return;
                let start = first[property], end = last[property];
                return 'angle' === property && (start = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.az)(start), end = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.az)(end)), {
                    property,
                    start,
                    end
                };
            }
            function _findSegmentEnd(start, end, points) {
                for(; end > start; end--){
                    const point = points[end];
                    if (!isNaN(point.x) && !isNaN(point.y)) break;
                }
                return end;
            }
            function _getEdge(a, b, prop, fn) {
                return a && b ? fn(a[prop], b[prop]) : a ? a[prop] : b ? b[prop] : 0;
            }
            function _createBoundaryLine(boundary, line) {
                let points = [], _loop = !1;
                return (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.b)(boundary) ? (_loop = !0, points = boundary) : points = function(boundary, line) {
                    const { x =null , y =null  } = boundary || {}, linePoints = line.points, points = [];
                    return line.segments.forEach(({ start , end  })=>{
                        end = _findSegmentEnd(start, end, linePoints);
                        const first = linePoints[start], last = linePoints[end];
                        null !== y ? (points.push({
                            x: first.x,
                            y
                        }), points.push({
                            x: last.x,
                            y
                        })) : null !== x && (points.push({
                            x,
                            y: first.y
                        }), points.push({
                            x,
                            y: last.y
                        }));
                    }), points;
                }(boundary, line), points.length ? new LineElement({
                    points,
                    options: {
                        tension: 0
                    },
                    _loop,
                    _fullLoop: _loop
                }) : null;
            }
            function _shouldApplyFill(source) {
                return source && !1 !== source.fill;
            }
            function _resolveTarget(sources, index, propagate) {
                let target;
                const source = sources[index];
                let fill = source.fill;
                const visited = [
                    index
                ];
                if (!propagate) return fill;
                for(; !1 !== fill && -1 === visited.indexOf(fill);){
                    if (!(0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.g)(fill)) return fill;
                    if (!(target = sources[fill])) break;
                    if (target.visible) return fill;
                    visited.push(fill), fill = target.fill;
                }
                return !1;
            }
            function _decodeFill(line, index, count) {
                var firstCh, target;
                const fill = function(line) {
                    const options = line.options, fillOption = options.fill;
                    let fill = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.v)(fillOption && fillOption.target, fillOption);
                    return void 0 === fill && (fill = !!options.backgroundColor), !1 !== fill && null !== fill && (!0 === fill ? 'origin' : fill);
                }(line);
                if ((0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.i)(fill)) return !isNaN(fill.value) && fill;
                let target1 = parseFloat(fill);
                return (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.g)(target1) && Math.floor(target1) === target1 ? (firstCh = fill[0], target = target1, ('-' === firstCh || '+' === firstCh) && (target = index + target), target !== index && !(target < 0) && !(target >= count) && target) : [
                    'origin',
                    'start',
                    'end',
                    'stack',
                    'shape'
                ].indexOf(fill) >= 0 && fill;
            }
            function addPointsBelow(points, sourcePoint, linesBelow) {
                const postponed = [];
                for(let j = 0; j < linesBelow.length; j++){
                    const line = linesBelow[j], { first , last , point  } = findPoint(line, sourcePoint, 'x');
                    if (point && (!first || !last)) {
                        if (first) postponed.unshift(point);
                        else if (points.push(point), !last) break;
                    }
                }
                points.push(...postponed);
            }
            function findPoint(line, sourcePoint, property) {
                const point = line.interpolate(sourcePoint, property);
                if (!point) return {};
                const pointValue = point[property], segments = line.segments, linePoints = line.points;
                let first = !1, last = !1;
                for(let i = 0; i < segments.length; i++){
                    const segment = segments[i], firstValue = linePoints[segment.start][property], lastValue = linePoints[segment.end][property];
                    if ((0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.ak)(pointValue, firstValue, lastValue)) {
                        first = pointValue === firstValue, last = pointValue === lastValue;
                        break;
                    }
                }
                return {
                    first,
                    last,
                    point
                };
            }
            class simpleArc {
                constructor(opts){
                    this.x = opts.x, this.y = opts.y, this.radius = opts.radius;
                }
                pathSegment(ctx, bounds, opts) {
                    const { x , y , radius  } = this;
                    return bounds = bounds || {
                        start: 0,
                        end: _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.T
                    }, ctx.arc(x, y, radius, bounds.end, bounds.start, !0), !opts.bounds;
                }
                interpolate(point) {
                    const { x , y , radius  } = this, angle = point.angle;
                    return {
                        x: x + Math.cos(angle) * radius,
                        y: y + Math.sin(angle) * radius,
                        angle
                    };
                }
            }
            function _drawfill(ctx, source, area) {
                const target = function(source) {
                    const { chart , fill , line  } = source;
                    if ((0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.g)(fill)) return function(chart, index) {
                        const meta = chart.getDatasetMeta(index), visible = meta && chart.isDatasetVisible(index);
                        return visible ? meta.dataset : null;
                    }(chart, fill);
                    if ('stack' === fill) return function(source) {
                        const { scale , index , line  } = source, points = [], segments = line.segments, sourcePoints = line.points, linesBelow = function(scale, index) {
                            const below = [], metas = scale.getMatchingVisibleMetas('line');
                            for(let i = 0; i < metas.length; i++){
                                const meta = metas[i];
                                if (meta.index === index) break;
                                meta.hidden || below.unshift(meta.dataset);
                            }
                            return below;
                        }(scale, index);
                        linesBelow.push(_createBoundaryLine({
                            x: null,
                            y: scale.bottom
                        }, line));
                        for(let i = 0; i < segments.length; i++){
                            const segment = segments[i];
                            for(let j = segment.start; j <= segment.end; j++)addPointsBelow(points, sourcePoints[j], linesBelow);
                        }
                        return new LineElement({
                            points,
                            options: {}
                        });
                    }(source);
                    if ('shape' === fill) return !0;
                    const boundary = function(source) {
                        const scale = source.scale || {};
                        return scale.getPointPositionForValue ? function(source) {
                            const { scale , fill  } = source, options = scale.options, length = scale.getLabels().length, start = options.reverse ? scale.max : scale.min, value = 'start' === fill ? start : 'end' === fill ? scale.options.reverse ? scale.min : scale.max : (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.i)(fill) ? fill.value : scale.getBaseValue(), target = [];
                            if (options.grid.circular) {
                                const center = scale.getPointPositionForValue(0, start);
                                return new simpleArc({
                                    x: center.x,
                                    y: center.y,
                                    radius: scale.getDistanceFromCenterForValue(value)
                                });
                            }
                            for(let i = 0; i < length; ++i)target.push(scale.getPointPositionForValue(i, value));
                            return target;
                        }(source) : function(source) {
                            let pixel;
                            const { scale ={} , fill  } = source, pixel1 = (pixel = null, 'start' === fill ? pixel = scale.bottom : 'end' === fill ? pixel = scale.top : (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.i)(fill) ? pixel = scale.getPixelForValue(fill.value) : scale.getBasePixel && (pixel = scale.getBasePixel()), pixel);
                            if ((0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.g)(pixel1)) {
                                const horizontal = scale.isHorizontal();
                                return {
                                    x: horizontal ? pixel1 : null,
                                    y: horizontal ? null : pixel1
                                };
                            }
                            return null;
                        }(source);
                    }(source);
                    return boundary instanceof simpleArc ? boundary : _createBoundaryLine(boundary, line);
                }(source), { line , scale , axis  } = source, lineOpts = line.options, fillOption = lineOpts.fill, color = lineOpts.backgroundColor, { above =color , below =color  } = fillOption || {};
                target && line.points.length && ((0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.L)(ctx, area), function(ctx, cfg) {
                    const { line , target , above , below , area , scale  } = cfg, property = line._loop ? 'angle' : cfg.axis;
                    ctx.save(), 'x' === property && below !== above && (clipVertical(ctx, target, area.top), fill(ctx, {
                        line,
                        target,
                        color: above,
                        scale,
                        property
                    }), ctx.restore(), ctx.save(), clipVertical(ctx, target, area.bottom)), fill(ctx, {
                        line,
                        target,
                        color: below,
                        scale,
                        property
                    }), ctx.restore();
                }(ctx, {
                    line,
                    target,
                    above,
                    below,
                    area,
                    scale,
                    axis
                }), (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.N)(ctx));
            }
            function clipVertical(ctx, target, clipY) {
                const { segments , points  } = target;
                let first = !0, lineLoop = !1;
                for (const segment of (ctx.beginPath(), segments)){
                    const { start , end  } = segment, firstPoint = points[start], lastPoint = points[_findSegmentEnd(start, end, points)];
                    first ? (ctx.moveTo(firstPoint.x, firstPoint.y), first = !1) : (ctx.lineTo(firstPoint.x, clipY), ctx.lineTo(firstPoint.x, firstPoint.y)), (lineLoop = !!target.pathSegment(ctx, segment, {
                        move: lineLoop
                    })) ? ctx.closePath() : ctx.lineTo(lastPoint.x, clipY);
                }
                ctx.lineTo(target.first().x, clipY), ctx.closePath(), ctx.clip();
            }
            function fill(ctx, cfg) {
                const { line , target , property , color , scale  } = cfg, segments = function(line, target, property) {
                    const segments = line.segments, points = line.points, tpoints = target.points, parts = [];
                    for (const segment of segments){
                        let { start , end  } = segment;
                        end = _findSegmentEnd(start, end, points);
                        const bounds = _getBounds(property, points[start], points[end], segment.loop);
                        if (!target.segments) {
                            parts.push({
                                source: segment,
                                target: bounds,
                                start: points[start],
                                end: points[end]
                            });
                            continue;
                        }
                        const targetSegments = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.ao)(target, bounds);
                        for (const tgt of targetSegments){
                            const subBounds = _getBounds(property, tpoints[tgt.start], tpoints[tgt.end], tgt.loop), fillSources = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.ay)(segment, points, subBounds);
                            for (const fillSource of fillSources)parts.push({
                                source: fillSource,
                                target: tgt,
                                start: {
                                    [property]: _getEdge(bounds, subBounds, 'start', Math.max)
                                },
                                end: {
                                    [property]: _getEdge(bounds, subBounds, 'end', Math.min)
                                }
                            });
                        }
                    }
                    return parts;
                }(line, target, property);
                for (const { source: src , target: tgt , start , end  } of segments){
                    let loop;
                    const { style: { backgroundColor =color  } = {}  } = src, notShape = !0 !== target;
                    ctx.save(), ctx.fillStyle = backgroundColor, clipBounds(ctx, scale, notShape && _getBounds(property, start, end)), ctx.beginPath();
                    const lineLoop = !!line.pathSegment(ctx, src);
                    if (notShape) {
                        lineLoop ? ctx.closePath() : interpolatedLineTo(ctx, target, end, property);
                        const targetLoop = !!target.pathSegment(ctx, tgt, {
                            move: lineLoop,
                            reverse: !0
                        });
                        (loop = lineLoop && targetLoop) || interpolatedLineTo(ctx, target, start, property);
                    }
                    ctx.closePath(), ctx.fill(loop ? 'evenodd' : 'nonzero'), ctx.restore();
                }
            }
            function clipBounds(ctx, scale, bounds) {
                const { top , bottom  } = scale.chart.chartArea, { property , start , end  } = bounds || {};
                'x' === property && (ctx.beginPath(), ctx.rect(start, top, end - start, bottom - top), ctx.clip());
            }
            function interpolatedLineTo(ctx, target, point, property) {
                const interpolatedPoint = target.interpolate(point, property);
                interpolatedPoint && ctx.lineTo(interpolatedPoint.x, interpolatedPoint.y);
            }
            const getBoxSize = (labelOpts, fontSize)=>{
                let { boxHeight =fontSize , boxWidth =fontSize  } = labelOpts;
                return labelOpts.usePointStyle && (boxHeight = Math.min(boxHeight, fontSize), boxWidth = labelOpts.pointStyleWidth || Math.min(boxWidth, fontSize)), {
                    boxWidth,
                    boxHeight,
                    itemHeight: Math.max(fontSize, boxHeight)
                };
            }, itemsEqual = (a, b)=>null !== a && null !== b && a.datasetIndex === b.datasetIndex && a.index === b.index;
            class Legend extends Element {
                constructor(config){
                    super(), this._added = !1, this.legendHitBoxes = [], this._hoveredItem = null, this.doughnutMode = !1, this.chart = config.chart, this.options = config.options, this.ctx = config.ctx, this.legendItems = void 0, this.columnSizes = void 0, this.lineWidths = void 0, this.maxHeight = void 0, this.maxWidth = void 0, this.top = void 0, this.bottom = void 0, this.left = void 0, this.right = void 0, this.height = void 0, this.width = void 0, this._margins = void 0, this.position = void 0, this.weight = void 0, this.fullSize = void 0;
                }
                update(maxWidth, maxHeight, margins) {
                    this.maxWidth = maxWidth, this.maxHeight = maxHeight, this._margins = margins, this.setDimensions(), this.buildLabels(), this.fit();
                }
                setDimensions() {
                    this.isHorizontal() ? (this.width = this.maxWidth, this.left = this._margins.left, this.right = this.width) : (this.height = this.maxHeight, this.top = this._margins.top, this.bottom = this.height);
                }
                buildLabels() {
                    const labelOpts = this.options.labels || {};
                    let legendItems = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.C)(labelOpts.generateLabels, [
                        this.chart
                    ], this) || [];
                    labelOpts.filter && (legendItems = legendItems.filter((item)=>labelOpts.filter(item, this.chart.data))), labelOpts.sort && (legendItems = legendItems.sort((a, b)=>labelOpts.sort(a, b, this.chart.data))), this.options.reverse && legendItems.reverse(), this.legendItems = legendItems;
                }
                fit() {
                    let width, height;
                    const { options , ctx  } = this;
                    if (!options.display) {
                        this.width = this.height = 0;
                        return;
                    }
                    const labelOpts = options.labels, labelFont = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.O)(labelOpts.font), fontSize = labelFont.size, titleHeight = this._computeTitleHeight(), { boxWidth , itemHeight  } = getBoxSize(labelOpts, fontSize);
                    ctx.font = labelFont.string, this.isHorizontal() ? (width = this.maxWidth, height = this._fitRows(titleHeight, fontSize, boxWidth, itemHeight) + 10) : (height = this.maxHeight, width = this._fitCols(titleHeight, fontSize, boxWidth, itemHeight) + 10), this.width = Math.min(width, options.maxWidth || this.maxWidth), this.height = Math.min(height, options.maxHeight || this.maxHeight);
                }
                _fitRows(titleHeight, fontSize, boxWidth, itemHeight) {
                    const { ctx , maxWidth , options: { labels: { padding  }  }  } = this, hitboxes = this.legendHitBoxes = [], lineWidths = this.lineWidths = [
                        0
                    ], lineHeight = itemHeight + padding;
                    let totalHeight = titleHeight;
                    ctx.textAlign = 'left', ctx.textBaseline = 'middle';
                    let row = -1, top = -lineHeight;
                    return this.legendItems.forEach((legendItem, i)=>{
                        const itemWidth = boxWidth + fontSize / 2 + ctx.measureText(legendItem.text).width;
                        (0 === i || lineWidths[lineWidths.length - 1] + itemWidth + 2 * padding > maxWidth) && (totalHeight += lineHeight, lineWidths[lineWidths.length - (i > 0 ? 0 : 1)] = 0, top += lineHeight, row++), hitboxes[i] = {
                            left: 0,
                            top,
                            row,
                            width: itemWidth,
                            height: itemHeight
                        }, lineWidths[lineWidths.length - 1] += itemWidth + padding;
                    }), totalHeight;
                }
                _fitCols(titleHeight, fontSize, boxWidth, itemHeight) {
                    const { ctx , maxHeight , options: { labels: { padding  }  }  } = this, hitboxes = this.legendHitBoxes = [], columnSizes = this.columnSizes = [], heightLimit = maxHeight - titleHeight;
                    let totalWidth = padding, currentColWidth = 0, currentColHeight = 0, left = 0, col = 0;
                    return this.legendItems.forEach((legendItem, i)=>{
                        const itemWidth = boxWidth + fontSize / 2 + ctx.measureText(legendItem.text).width;
                        i > 0 && currentColHeight + itemHeight + 2 * padding > heightLimit && (totalWidth += currentColWidth + padding, columnSizes.push({
                            width: currentColWidth,
                            height: currentColHeight
                        }), left += currentColWidth + padding, col++, currentColWidth = currentColHeight = 0), hitboxes[i] = {
                            left,
                            top: currentColHeight,
                            col,
                            width: itemWidth,
                            height: itemHeight
                        }, currentColWidth = Math.max(currentColWidth, itemWidth), currentColHeight += itemHeight + padding;
                    }), totalWidth += currentColWidth, columnSizes.push({
                        width: currentColWidth,
                        height: currentColHeight
                    }), totalWidth;
                }
                adjustHitBoxes() {
                    if (!this.options.display) return;
                    const titleHeight = this._computeTitleHeight(), { legendHitBoxes: hitboxes , options: { align , labels: { padding  } , rtl  }  } = this, rtlHelper = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.aA)(rtl, this.left, this.width);
                    if (this.isHorizontal()) {
                        let row = 0, left = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.S)(align, this.left + padding, this.right - this.lineWidths[row]);
                        for (const hitbox of hitboxes)row !== hitbox.row && (row = hitbox.row, left = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.S)(align, this.left + padding, this.right - this.lineWidths[row])), hitbox.top += this.top + titleHeight + padding, hitbox.left = rtlHelper.leftForLtr(rtlHelper.x(left), hitbox.width), left += hitbox.width + padding;
                    } else {
                        let col = 0, top = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.S)(align, this.top + titleHeight + padding, this.bottom - this.columnSizes[col].height);
                        for (const hitbox1 of hitboxes)hitbox1.col !== col && (col = hitbox1.col, top = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.S)(align, this.top + titleHeight + padding, this.bottom - this.columnSizes[col].height)), hitbox1.top = top, hitbox1.left += this.left + padding, hitbox1.left = rtlHelper.leftForLtr(rtlHelper.x(hitbox1.left), hitbox1.width), top += hitbox1.height + padding;
                    }
                }
                isHorizontal() {
                    return 'top' === this.options.position || 'bottom' === this.options.position;
                }
                draw() {
                    if (this.options.display) {
                        const ctx = this.ctx;
                        (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.L)(ctx, this), this._draw(), (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.N)(ctx);
                    }
                }
                _draw() {
                    let cursor;
                    const { options: opts , columnSizes , lineWidths , ctx  } = this, { align , labels: labelOpts  } = opts, defaultColor = _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.d.color, rtlHelper = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.aA)(opts.rtl, this.left, this.width), labelFont = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.O)(labelOpts.font), { color: fontColor , padding  } = labelOpts, fontSize = labelFont.size, halfFontSize = fontSize / 2;
                    this.drawTitle(), ctx.textAlign = rtlHelper.textAlign('left'), ctx.textBaseline = 'middle', ctx.lineWidth = 0.5, ctx.font = labelFont.string;
                    const { boxWidth , boxHeight , itemHeight  } = getBoxSize(labelOpts, fontSize), drawLegendBox = function(x, y, legendItem) {
                        if (isNaN(boxWidth) || boxWidth <= 0 || isNaN(boxHeight) || boxHeight < 0) return;
                        ctx.save();
                        const lineWidth = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.v)(legendItem.lineWidth, 1);
                        if (ctx.fillStyle = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.v)(legendItem.fillStyle, defaultColor), ctx.lineCap = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.v)(legendItem.lineCap, 'butt'), ctx.lineDashOffset = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.v)(legendItem.lineDashOffset, 0), ctx.lineJoin = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.v)(legendItem.lineJoin, 'miter'), ctx.lineWidth = lineWidth, ctx.strokeStyle = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.v)(legendItem.strokeStyle, defaultColor), ctx.setLineDash((0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.v)(legendItem.lineDash, [])), labelOpts.usePointStyle) {
                            const drawOptions = {
                                radius: boxHeight * Math.SQRT2 / 2,
                                pointStyle: legendItem.pointStyle,
                                rotation: legendItem.rotation,
                                borderWidth: lineWidth
                            }, centerX = rtlHelper.xPlus(x, boxWidth / 2);
                            (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.aE)(ctx, drawOptions, centerX, y + halfFontSize, labelOpts.pointStyleWidth && boxWidth);
                        } else {
                            const yBoxTop = y + Math.max((fontSize - boxHeight) / 2, 0), xBoxLeft = rtlHelper.leftForLtr(x, boxWidth), borderRadius = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.ax)(legendItem.borderRadius);
                            ctx.beginPath(), Object.values(borderRadius).some((v)=>0 !== v) ? (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.av)(ctx, {
                                x: xBoxLeft,
                                y: yBoxTop,
                                w: boxWidth,
                                h: boxHeight,
                                radius: borderRadius
                            }) : ctx.rect(xBoxLeft, yBoxTop, boxWidth, boxHeight), ctx.fill(), 0 !== lineWidth && ctx.stroke();
                        }
                        ctx.restore();
                    }, fillText = function(x, y, legendItem) {
                        (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.M)(ctx, legendItem.text, x, y + itemHeight / 2, labelFont, {
                            strikethrough: legendItem.hidden,
                            textAlign: rtlHelper.textAlign(legendItem.textAlign)
                        });
                    }, isHorizontal = this.isHorizontal(), titleHeight = this._computeTitleHeight();
                    cursor = isHorizontal ? {
                        x: (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.S)(align, this.left + padding, this.right - lineWidths[0]),
                        y: this.top + padding + titleHeight,
                        line: 0
                    } : {
                        x: this.left + padding,
                        y: (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.S)(align, this.top + titleHeight + padding, this.bottom - columnSizes[0].height),
                        line: 0
                    }, (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.aB)(this.ctx, opts.textDirection);
                    const lineHeight = itemHeight + padding;
                    this.legendItems.forEach((legendItem, i)=>{
                        ctx.strokeStyle = legendItem.fontColor || fontColor, ctx.fillStyle = legendItem.fontColor || fontColor;
                        const textWidth = ctx.measureText(legendItem.text).width, textAlign = rtlHelper.textAlign(legendItem.textAlign || (legendItem.textAlign = labelOpts.textAlign)), width = boxWidth + halfFontSize + textWidth;
                        let x = cursor.x, y = cursor.y;
                        rtlHelper.setWidth(this.width), isHorizontal ? i > 0 && x + width + padding > this.right && (y = cursor.y += lineHeight, cursor.line++, x = cursor.x = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.S)(align, this.left + padding, this.right - lineWidths[cursor.line])) : i > 0 && y + lineHeight > this.bottom && (x = cursor.x = x + columnSizes[cursor.line].width + padding, cursor.line++, y = cursor.y = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.S)(align, this.top + titleHeight + padding, this.bottom - columnSizes[cursor.line].height));
                        const realX = rtlHelper.x(x);
                        drawLegendBox(realX, y, legendItem), x = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.aC)(textAlign, x + boxWidth + halfFontSize, isHorizontal ? x + width : this.right, opts.rtl), fillText(rtlHelper.x(x), y, legendItem), isHorizontal ? cursor.x += width + padding : cursor.y += lineHeight;
                    }), (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.aD)(this.ctx, opts.textDirection);
                }
                drawTitle() {
                    let y;
                    const opts = this.options, titleOpts = opts.title, titleFont = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.O)(titleOpts.font), titlePadding = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.K)(titleOpts.padding);
                    if (!titleOpts.display) return;
                    const rtlHelper = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.aA)(opts.rtl, this.left, this.width), ctx = this.ctx, position = titleOpts.position, halfFontSize = titleFont.size / 2, topPaddingPlusHalfFontSize = titlePadding.top + halfFontSize;
                    let left = this.left, maxWidth = this.width;
                    if (this.isHorizontal()) maxWidth = Math.max(...this.lineWidths), y = this.top + topPaddingPlusHalfFontSize, left = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.S)(opts.align, left, this.right - maxWidth);
                    else {
                        const maxHeight = this.columnSizes.reduce((acc, size)=>Math.max(acc, size.height), 0);
                        y = topPaddingPlusHalfFontSize + (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.S)(opts.align, this.top, this.bottom - maxHeight - opts.labels.padding - this._computeTitleHeight());
                    }
                    const x = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.S)(position, left, left + maxWidth);
                    ctx.textAlign = rtlHelper.textAlign((0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.R)(position)), ctx.textBaseline = 'middle', ctx.strokeStyle = titleOpts.color, ctx.fillStyle = titleOpts.color, ctx.font = titleFont.string, (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.M)(ctx, titleOpts.text, x, y, titleFont);
                }
                _computeTitleHeight() {
                    const titleOpts = this.options.title, titleFont = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.O)(titleOpts.font), titlePadding = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.K)(titleOpts.padding);
                    return titleOpts.display ? titleFont.lineHeight + titlePadding.height : 0;
                }
                _getLegendItemAt(x, y) {
                    let i, hitBox, lh;
                    if ((0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.ak)(x, this.left, this.right) && (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.ak)(y, this.top, this.bottom)) {
                        for(i = 0, lh = this.legendHitBoxes; i < lh.length; ++i)if (hitBox = lh[i], (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.ak)(x, hitBox.left, hitBox.left + hitBox.width) && (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.ak)(y, hitBox.top, hitBox.top + hitBox.height)) return this.legendItems[i];
                    }
                    return null;
                }
                handleEvent(e) {
                    var type;
                    const opts = this.options;
                    if (('mousemove' !== (type = e.type) && 'mouseout' !== type || !opts.onHover && !opts.onLeave) && (!opts.onClick || 'click' !== type && 'mouseup' !== type)) return;
                    const hoveredItem = this._getLegendItemAt(e.x, e.y);
                    if ('mousemove' === e.type || 'mouseout' === e.type) {
                        const previous = this._hoveredItem, sameItem = itemsEqual(previous, hoveredItem);
                        previous && !sameItem && (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.C)(opts.onLeave, [
                            e,
                            previous,
                            this
                        ], this), this._hoveredItem = hoveredItem, hoveredItem && !sameItem && (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.C)(opts.onHover, [
                            e,
                            hoveredItem,
                            this
                        ], this);
                    } else hoveredItem && (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.C)(opts.onClick, [
                        e,
                        hoveredItem,
                        this
                    ], this);
                }
            }
            class Title extends Element {
                constructor(config){
                    super(), this.chart = config.chart, this.options = config.options, this.ctx = config.ctx, this._padding = void 0, this.top = void 0, this.bottom = void 0, this.left = void 0, this.right = void 0, this.width = void 0, this.height = void 0, this.position = void 0, this.weight = void 0, this.fullSize = void 0;
                }
                update(maxWidth, maxHeight) {
                    const opts = this.options;
                    if (this.left = 0, this.top = 0, !opts.display) {
                        this.width = this.height = this.right = this.bottom = 0;
                        return;
                    }
                    this.width = this.right = maxWidth, this.height = this.bottom = maxHeight;
                    const lineCount = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.b)(opts.text) ? opts.text.length : 1;
                    this._padding = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.K)(opts.padding);
                    const textSize = lineCount * (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.O)(opts.font).lineHeight + this._padding.height;
                    this.isHorizontal() ? this.height = textSize : this.width = textSize;
                }
                isHorizontal() {
                    const pos = this.options.position;
                    return 'top' === pos || 'bottom' === pos;
                }
                _drawArgs(offset) {
                    let maxWidth, titleX, titleY;
                    const { top , left , bottom , right , options  } = this, align = options.align;
                    let rotation = 0;
                    return this.isHorizontal() ? (titleX = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.S)(align, left, right), titleY = top + offset, maxWidth = right - left) : ('left' === options.position ? (titleX = left + offset, titleY = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.S)(align, bottom, top), rotation = -0.5 * _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.P) : (titleX = right - offset, titleY = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.S)(align, top, bottom), rotation = 0.5 * _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.P), maxWidth = bottom - top), {
                        titleX,
                        titleY,
                        maxWidth,
                        rotation
                    };
                }
                draw() {
                    const ctx = this.ctx, opts = this.options;
                    if (!opts.display) return;
                    const fontOpts = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.O)(opts.font), lineHeight = fontOpts.lineHeight, offset = lineHeight / 2 + this._padding.top, { titleX , titleY , maxWidth , rotation  } = this._drawArgs(offset);
                    (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.M)(ctx, opts.text, 0, 0, fontOpts, {
                        color: opts.color,
                        maxWidth,
                        rotation,
                        textAlign: (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.R)(opts.align),
                        textBaseline: 'middle',
                        translation: [
                            titleX,
                            titleY
                        ]
                    });
                }
            }
            const map = new WeakMap(), positioners = {
                average (items) {
                    let i, len;
                    if (!items.length) return !1;
                    let x = 0, y = 0, count = 0;
                    for(i = 0, len = items.length; i < len; ++i){
                        const el = items[i].element;
                        if (el && el.hasValue()) {
                            const pos = el.tooltipPosition();
                            x += pos.x, y += pos.y, ++count;
                        }
                    }
                    return {
                        x: x / count,
                        y: y / count
                    };
                },
                nearest (items, eventPosition) {
                    let i, len, nearestElement;
                    if (!items.length) return !1;
                    let x = eventPosition.x, y = eventPosition.y, minDistance = Number.POSITIVE_INFINITY;
                    for(i = 0, len = items.length; i < len; ++i){
                        const el = items[i].element;
                        if (el && el.hasValue()) {
                            const center = el.getCenterPoint(), d = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.aG)(eventPosition, center);
                            d < minDistance && (minDistance = d, nearestElement = el);
                        }
                    }
                    if (nearestElement) {
                        const tp = nearestElement.tooltipPosition();
                        x = tp.x, y = tp.y;
                    }
                    return {
                        x,
                        y
                    };
                }
            };
            function pushOrConcat(base, toPush) {
                return toPush && ((0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.b)(toPush) ? Array.prototype.push.apply(base, toPush) : base.push(toPush)), base;
            }
            function splitNewlines(str) {
                return ('string' == typeof str || str instanceof String) && str.indexOf('\n') > -1 ? str.split('\n') : str;
            }
            function createTooltipItem(chart, item) {
                const { element , datasetIndex , index  } = item, controller = chart.getDatasetMeta(datasetIndex).controller, { label , value  } = controller.getLabelAndValue(index);
                return {
                    chart,
                    label,
                    parsed: controller.getParsed(index),
                    raw: chart.data.datasets[datasetIndex].data[index],
                    formattedValue: value,
                    dataset: controller.getDataset(),
                    dataIndex: index,
                    datasetIndex,
                    element
                };
            }
            function getTooltipSize(tooltip, options) {
                const ctx = tooltip.chart.ctx, { body , footer , title  } = tooltip, { boxWidth , boxHeight  } = options, bodyFont = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.O)(options.bodyFont), titleFont = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.O)(options.titleFont), footerFont = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.O)(options.footerFont), titleLineCount = title.length, footerLineCount = footer.length, bodyLineItemCount = body.length, padding = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.K)(options.padding);
                let height = padding.height, width = 0, combinedBodyLength = body.reduce((count, bodyItem)=>count + bodyItem.before.length + bodyItem.lines.length + bodyItem.after.length, 0);
                if (combinedBodyLength += tooltip.beforeBody.length + tooltip.afterBody.length, titleLineCount && (height += titleLineCount * titleFont.lineHeight + (titleLineCount - 1) * options.titleSpacing + options.titleMarginBottom), combinedBodyLength) {
                    const bodyLineHeight = options.displayColors ? Math.max(boxHeight, bodyFont.lineHeight) : bodyFont.lineHeight;
                    height += bodyLineItemCount * bodyLineHeight + (combinedBodyLength - bodyLineItemCount) * bodyFont.lineHeight + (combinedBodyLength - 1) * options.bodySpacing;
                }
                footerLineCount && (height += options.footerMarginTop + footerLineCount * footerFont.lineHeight + (footerLineCount - 1) * options.footerSpacing);
                let widthPadding = 0;
                const maxLineWidth = function(line) {
                    width = Math.max(width, ctx.measureText(line).width + widthPadding);
                };
                return ctx.save(), ctx.font = titleFont.string, (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.Q)(tooltip.title, maxLineWidth), ctx.font = bodyFont.string, (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.Q)(tooltip.beforeBody.concat(tooltip.afterBody), maxLineWidth), widthPadding = options.displayColors ? boxWidth + 2 + options.boxPadding : 0, (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.Q)(body, (bodyItem)=>{
                    (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.Q)(bodyItem.before, maxLineWidth), (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.Q)(bodyItem.lines, maxLineWidth), (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.Q)(bodyItem.after, maxLineWidth);
                }), widthPadding = 0, ctx.font = footerFont.string, (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.Q)(tooltip.footer, maxLineWidth), ctx.restore(), width += padding.width, {
                    width,
                    height
                };
            }
            function determineAlignment(chart, options, size) {
                const yAlign = size.yAlign || options.yAlign || function(chart, size) {
                    const { y , height  } = size;
                    return y < height / 2 ? 'top' : y > chart.height - height / 2 ? 'bottom' : 'center';
                }(chart, size);
                return {
                    xAlign: size.xAlign || options.xAlign || function(chart, options, size, yAlign) {
                        const { x , width  } = size, { width: chartWidth , chartArea: { left , right  }  } = chart;
                        let xAlign = 'center';
                        return 'center' === yAlign ? xAlign = x <= (left + right) / 2 ? 'left' : 'right' : x <= width / 2 ? xAlign = 'left' : x >= chartWidth - width / 2 && (xAlign = 'right'), function(xAlign, chart, options, size) {
                            const { x , width  } = size, caret = options.caretSize + options.caretPadding;
                            if ('left' === xAlign && x + width + caret > chart.width || 'right' === xAlign && x - width - caret < 0) return !0;
                        }(xAlign, chart, options, size) && (xAlign = 'center'), xAlign;
                    }(chart, options, size, yAlign),
                    yAlign
                };
            }
            function getBackgroundPoint(options, size, alignment, chart) {
                const { caretSize , caretPadding , cornerRadius  } = options, { xAlign , yAlign  } = alignment, paddingAndSize = caretSize + caretPadding, { topLeft , topRight , bottomLeft , bottomRight  } = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.ax)(cornerRadius);
                let x = function(size, xAlign) {
                    let { x , width  } = size;
                    return 'right' === xAlign ? x -= width : 'center' === xAlign && (x -= width / 2), x;
                }(size, xAlign);
                const y = function(size, yAlign, paddingAndSize) {
                    let { y , height  } = size;
                    return 'top' === yAlign ? y += paddingAndSize : 'bottom' === yAlign ? y -= height + paddingAndSize : y -= height / 2, y;
                }(size, yAlign, paddingAndSize);
                return 'center' === yAlign ? 'left' === xAlign ? x += paddingAndSize : 'right' === xAlign && (x -= paddingAndSize) : 'left' === xAlign ? x -= Math.max(topLeft, bottomLeft) + caretSize : 'right' === xAlign && (x += Math.max(topRight, bottomRight) + caretSize), {
                    x: (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.E)(x, 0, chart.width - size.width),
                    y: (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.E)(y, 0, chart.height - size.height)
                };
            }
            function getAlignedX(tooltip, align, options) {
                const padding = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.K)(options.padding);
                return 'center' === align ? tooltip.x + tooltip.width / 2 : 'right' === align ? tooltip.x + tooltip.width - padding.right : tooltip.x + padding.left;
            }
            function getBeforeAfterBodyLines(callback) {
                return pushOrConcat([], splitNewlines(callback));
            }
            function overrideCallbacks(callbacks, context) {
                const override = context && context.dataset && context.dataset.tooltip && context.dataset.tooltip.callbacks;
                return override ? callbacks.override(override) : callbacks;
            }
            class Tooltip extends Element {
                constructor(config){
                    super(), this.opacity = 0, this._active = [], this._eventPosition = void 0, this._size = void 0, this._cachedAnimations = void 0, this._tooltipItems = [], this.$animations = void 0, this.$context = void 0, this.chart = config.chart || config._chart, this._chart = this.chart, this.options = config.options, this.dataPoints = void 0, this.title = void 0, this.beforeBody = void 0, this.body = void 0, this.afterBody = void 0, this.footer = void 0, this.xAlign = void 0, this.yAlign = void 0, this.x = void 0, this.y = void 0, this.height = void 0, this.width = void 0, this.caretX = void 0, this.caretY = void 0, this.labelColors = void 0, this.labelPointStyles = void 0, this.labelTextColors = void 0;
                }
                initialize(options) {
                    this.options = options, this._cachedAnimations = void 0, this.$context = void 0;
                }
                _resolveAnimations() {
                    const cached = this._cachedAnimations;
                    if (cached) return cached;
                    const chart = this.chart, options = this.options.setContext(this.getContext()), opts = options.enabled && chart.options.animation && options.animations, animations = new Animations(this.chart, opts);
                    return opts._cacheable && (this._cachedAnimations = Object.freeze(animations)), animations;
                }
                getContext() {
                    var parent, tooltipItems;
                    return this.$context || (this.$context = (parent = this.chart.getContext(), tooltipItems = this._tooltipItems, (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.h)(parent, {
                        tooltip: this,
                        tooltipItems,
                        type: 'tooltip'
                    })));
                }
                getTitle(context, options) {
                    const { callbacks  } = options, beforeTitle = callbacks.beforeTitle.apply(this, [
                        context
                    ]), title = callbacks.title.apply(this, [
                        context
                    ]), afterTitle = callbacks.afterTitle.apply(this, [
                        context
                    ]);
                    let lines = [];
                    return lines = pushOrConcat(lines, splitNewlines(beforeTitle)), lines = pushOrConcat(lines, splitNewlines(title)), lines = pushOrConcat(lines, splitNewlines(afterTitle));
                }
                getBeforeBody(tooltipItems, options) {
                    return getBeforeAfterBodyLines(options.callbacks.beforeBody.apply(this, [
                        tooltipItems
                    ]));
                }
                getBody(tooltipItems, options) {
                    const { callbacks  } = options, bodyItems = [];
                    return (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.Q)(tooltipItems, (context)=>{
                        const bodyItem = {
                            before: [],
                            lines: [],
                            after: []
                        }, scoped = overrideCallbacks(callbacks, context);
                        pushOrConcat(bodyItem.before, splitNewlines(scoped.beforeLabel.call(this, context))), pushOrConcat(bodyItem.lines, scoped.label.call(this, context)), pushOrConcat(bodyItem.after, splitNewlines(scoped.afterLabel.call(this, context))), bodyItems.push(bodyItem);
                    }), bodyItems;
                }
                getAfterBody(tooltipItems, options) {
                    return getBeforeAfterBodyLines(options.callbacks.afterBody.apply(this, [
                        tooltipItems
                    ]));
                }
                getFooter(tooltipItems, options) {
                    const { callbacks  } = options, beforeFooter = callbacks.beforeFooter.apply(this, [
                        tooltipItems
                    ]), footer = callbacks.footer.apply(this, [
                        tooltipItems
                    ]), afterFooter = callbacks.afterFooter.apply(this, [
                        tooltipItems
                    ]);
                    let lines = [];
                    return lines = pushOrConcat(lines, splitNewlines(beforeFooter)), lines = pushOrConcat(lines, splitNewlines(footer)), lines = pushOrConcat(lines, splitNewlines(afterFooter));
                }
                _createItems(options) {
                    let i, len;
                    const active = this._active, data = this.chart.data, labelColors = [], labelPointStyles = [], labelTextColors = [];
                    let tooltipItems = [];
                    for(i = 0, len = active.length; i < len; ++i)tooltipItems.push(createTooltipItem(this.chart, active[i]));
                    return options.filter && (tooltipItems = tooltipItems.filter((element, index, array)=>options.filter(element, index, array, data))), options.itemSort && (tooltipItems = tooltipItems.sort((a, b)=>options.itemSort(a, b, data))), (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.Q)(tooltipItems, (context)=>{
                        const scoped = overrideCallbacks(options.callbacks, context);
                        labelColors.push(scoped.labelColor.call(this, context)), labelPointStyles.push(scoped.labelPointStyle.call(this, context)), labelTextColors.push(scoped.labelTextColor.call(this, context));
                    }), this.labelColors = labelColors, this.labelPointStyles = labelPointStyles, this.labelTextColors = labelTextColors, this.dataPoints = tooltipItems, tooltipItems;
                }
                update(changed, replay) {
                    let properties;
                    const options = this.options.setContext(this.getContext()), active = this._active;
                    let tooltipItems = [];
                    if (active.length) {
                        const position = positioners[options.position].call(this, active, this._eventPosition);
                        tooltipItems = this._createItems(options), this.title = this.getTitle(tooltipItems, options), this.beforeBody = this.getBeforeBody(tooltipItems, options), this.body = this.getBody(tooltipItems, options), this.afterBody = this.getAfterBody(tooltipItems, options), this.footer = this.getFooter(tooltipItems, options);
                        const size = this._size = getTooltipSize(this, options), positionAndSize = Object.assign({}, position, size), alignment = determineAlignment(this.chart, options, positionAndSize), backgroundPoint = getBackgroundPoint(options, positionAndSize, alignment, this.chart);
                        this.xAlign = alignment.xAlign, this.yAlign = alignment.yAlign, properties = {
                            opacity: 1,
                            x: backgroundPoint.x,
                            y: backgroundPoint.y,
                            width: size.width,
                            height: size.height,
                            caretX: position.x,
                            caretY: position.y
                        };
                    } else 0 !== this.opacity && (properties = {
                        opacity: 0
                    });
                    this._tooltipItems = tooltipItems, this.$context = void 0, properties && this._resolveAnimations().update(this, properties), changed && options.external && options.external.call(this, {
                        chart: this.chart,
                        tooltip: this,
                        replay
                    });
                }
                drawCaret(tooltipPoint, ctx, size, options) {
                    const caretPosition = this.getCaretPosition(tooltipPoint, size, options);
                    ctx.lineTo(caretPosition.x1, caretPosition.y1), ctx.lineTo(caretPosition.x2, caretPosition.y2), ctx.lineTo(caretPosition.x3, caretPosition.y3);
                }
                getCaretPosition(tooltipPoint, size, options) {
                    let x1, x2, x3, y1, y2, y3;
                    const { xAlign , yAlign  } = this, { caretSize , cornerRadius  } = options, { topLeft , topRight , bottomLeft , bottomRight  } = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.ax)(cornerRadius), { x: ptX , y: ptY  } = tooltipPoint, { width , height  } = size;
                    return 'center' === yAlign ? (y2 = ptY + height / 2, 'left' === xAlign ? (x2 = (x1 = ptX) - caretSize, y1 = y2 + caretSize, y3 = y2 - caretSize) : (x2 = (x1 = ptX + width) + caretSize, y1 = y2 - caretSize, y3 = y2 + caretSize), x3 = x1) : (x2 = 'left' === xAlign ? ptX + Math.max(topLeft, bottomLeft) + caretSize : 'right' === xAlign ? ptX + width - Math.max(topRight, bottomRight) - caretSize : this.caretX, 'top' === yAlign ? (y2 = (y1 = ptY) - caretSize, x1 = x2 - caretSize, x3 = x2 + caretSize) : (y2 = (y1 = ptY + height) + caretSize, x1 = x2 + caretSize, x3 = x2 - caretSize), y3 = y1), {
                        x1,
                        x2,
                        x3,
                        y1,
                        y2,
                        y3
                    };
                }
                drawTitle(pt, ctx, options) {
                    let titleFont, titleSpacing, i;
                    const title = this.title, length = title.length;
                    if (length) {
                        const rtlHelper = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.aA)(options.rtl, this.x, this.width);
                        for(i = 0, pt.x = getAlignedX(this, options.titleAlign, options), ctx.textAlign = rtlHelper.textAlign(options.titleAlign), ctx.textBaseline = 'middle', titleFont = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.O)(options.titleFont), titleSpacing = options.titleSpacing, ctx.fillStyle = options.titleColor, ctx.font = titleFont.string; i < length; ++i)ctx.fillText(title[i], rtlHelper.x(pt.x), pt.y + titleFont.lineHeight / 2), pt.y += titleFont.lineHeight + titleSpacing, i + 1 === length && (pt.y += options.titleMarginBottom - titleSpacing);
                    }
                }
                _drawColorBox(ctx, pt, i, rtlHelper, options) {
                    const labelColors = this.labelColors[i], labelPointStyle = this.labelPointStyles[i], { boxHeight , boxWidth , boxPadding  } = options, bodyFont = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.O)(options.bodyFont), colorX = getAlignedX(this, 'left', options), rtlColorX = rtlHelper.x(colorX), yOffSet = boxHeight < bodyFont.lineHeight ? (bodyFont.lineHeight - boxHeight) / 2 : 0, colorY = pt.y + yOffSet;
                    if (options.usePointStyle) {
                        const drawOptions = {
                            radius: Math.min(boxWidth, boxHeight) / 2,
                            pointStyle: labelPointStyle.pointStyle,
                            rotation: labelPointStyle.rotation,
                            borderWidth: 1
                        }, centerX = rtlHelper.leftForLtr(rtlColorX, boxWidth) + boxWidth / 2, centerY = colorY + boxHeight / 2;
                        ctx.strokeStyle = options.multiKeyBackground, ctx.fillStyle = options.multiKeyBackground, (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.au)(ctx, drawOptions, centerX, centerY), ctx.strokeStyle = labelColors.borderColor, ctx.fillStyle = labelColors.backgroundColor, (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.au)(ctx, drawOptions, centerX, centerY);
                    } else {
                        ctx.lineWidth = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.i)(labelColors.borderWidth) ? Math.max(...Object.values(labelColors.borderWidth)) : labelColors.borderWidth || 1, ctx.strokeStyle = labelColors.borderColor, ctx.setLineDash(labelColors.borderDash || []), ctx.lineDashOffset = labelColors.borderDashOffset || 0;
                        const outerX = rtlHelper.leftForLtr(rtlColorX, boxWidth - boxPadding), innerX = rtlHelper.leftForLtr(rtlHelper.xPlus(rtlColorX, 1), boxWidth - boxPadding - 2), borderRadius = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.ax)(labelColors.borderRadius);
                        Object.values(borderRadius).some((v)=>0 !== v) ? (ctx.beginPath(), ctx.fillStyle = options.multiKeyBackground, (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.av)(ctx, {
                            x: outerX,
                            y: colorY,
                            w: boxWidth,
                            h: boxHeight,
                            radius: borderRadius
                        }), ctx.fill(), ctx.stroke(), ctx.fillStyle = labelColors.backgroundColor, ctx.beginPath(), (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.av)(ctx, {
                            x: innerX,
                            y: colorY + 1,
                            w: boxWidth - 2,
                            h: boxHeight - 2,
                            radius: borderRadius
                        }), ctx.fill()) : (ctx.fillStyle = options.multiKeyBackground, ctx.fillRect(outerX, colorY, boxWidth, boxHeight), ctx.strokeRect(outerX, colorY, boxWidth, boxHeight), ctx.fillStyle = labelColors.backgroundColor, ctx.fillRect(innerX, colorY + 1, boxWidth - 2, boxHeight - 2));
                    }
                    ctx.fillStyle = this.labelTextColors[i];
                }
                drawBody(pt, ctx, options) {
                    let bodyItem, textColor, lines, i, j, ilen, jlen;
                    const { body  } = this, { bodySpacing , bodyAlign , displayColors , boxHeight , boxWidth , boxPadding  } = options, bodyFont = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.O)(options.bodyFont);
                    let bodyLineHeight = bodyFont.lineHeight, xLinePadding = 0;
                    const rtlHelper = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.aA)(options.rtl, this.x, this.width), fillLineOfText = function(line) {
                        ctx.fillText(line, rtlHelper.x(pt.x + xLinePadding), pt.y + bodyLineHeight / 2), pt.y += bodyLineHeight + bodySpacing;
                    }, bodyAlignForCalculation = rtlHelper.textAlign(bodyAlign);
                    for(ctx.textAlign = bodyAlign, ctx.textBaseline = 'middle', ctx.font = bodyFont.string, pt.x = getAlignedX(this, bodyAlignForCalculation, options), ctx.fillStyle = options.bodyColor, (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.Q)(this.beforeBody, fillLineOfText), xLinePadding = displayColors && 'right' !== bodyAlignForCalculation ? 'center' === bodyAlign ? boxWidth / 2 + boxPadding : boxWidth + 2 + boxPadding : 0, i = 0, ilen = body.length; i < ilen; ++i){
                        for(bodyItem = body[i], textColor = this.labelTextColors[i], ctx.fillStyle = textColor, (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.Q)(bodyItem.before, fillLineOfText), lines = bodyItem.lines, displayColors && lines.length && (this._drawColorBox(ctx, pt, i, rtlHelper, options), bodyLineHeight = Math.max(bodyFont.lineHeight, boxHeight)), j = 0, jlen = lines.length; j < jlen; ++j)fillLineOfText(lines[j]), bodyLineHeight = bodyFont.lineHeight;
                        (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.Q)(bodyItem.after, fillLineOfText);
                    }
                    xLinePadding = 0, bodyLineHeight = bodyFont.lineHeight, (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.Q)(this.afterBody, fillLineOfText), pt.y -= bodySpacing;
                }
                drawFooter(pt, ctx, options) {
                    let footerFont, i;
                    const footer = this.footer, length = footer.length;
                    if (length) {
                        const rtlHelper = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.aA)(options.rtl, this.x, this.width);
                        for(pt.x = getAlignedX(this, options.footerAlign, options), pt.y += options.footerMarginTop, ctx.textAlign = rtlHelper.textAlign(options.footerAlign), ctx.textBaseline = 'middle', footerFont = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.O)(options.footerFont), ctx.fillStyle = options.footerColor, ctx.font = footerFont.string, i = 0; i < length; ++i)ctx.fillText(footer[i], rtlHelper.x(pt.x), pt.y + footerFont.lineHeight / 2), pt.y += footerFont.lineHeight + options.footerSpacing;
                    }
                }
                drawBackground(pt, ctx, tooltipSize, options) {
                    const { xAlign , yAlign  } = this, { x , y  } = pt, { width , height  } = tooltipSize, { topLeft , topRight , bottomLeft , bottomRight  } = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.ax)(options.cornerRadius);
                    ctx.fillStyle = options.backgroundColor, ctx.strokeStyle = options.borderColor, ctx.lineWidth = options.borderWidth, ctx.beginPath(), ctx.moveTo(x + topLeft, y), 'top' === yAlign && this.drawCaret(pt, ctx, tooltipSize, options), ctx.lineTo(x + width - topRight, y), ctx.quadraticCurveTo(x + width, y, x + width, y + topRight), 'center' === yAlign && 'right' === xAlign && this.drawCaret(pt, ctx, tooltipSize, options), ctx.lineTo(x + width, y + height - bottomRight), ctx.quadraticCurveTo(x + width, y + height, x + width - bottomRight, y + height), 'bottom' === yAlign && this.drawCaret(pt, ctx, tooltipSize, options), ctx.lineTo(x + bottomLeft, y + height), ctx.quadraticCurveTo(x, y + height, x, y + height - bottomLeft), 'center' === yAlign && 'left' === xAlign && this.drawCaret(pt, ctx, tooltipSize, options), ctx.lineTo(x, y + topLeft), ctx.quadraticCurveTo(x, y, x + topLeft, y), ctx.closePath(), ctx.fill(), options.borderWidth > 0 && ctx.stroke();
                }
                _updateAnimationTarget(options) {
                    const chart = this.chart, anims = this.$animations, animX = anims && anims.x, animY = anims && anims.y;
                    if (animX || animY) {
                        const position = positioners[options.position].call(this, this._active, this._eventPosition);
                        if (!position) return;
                        const size = this._size = getTooltipSize(this, options), positionAndSize = Object.assign({}, position, this._size), alignment = determineAlignment(chart, options, positionAndSize), point = getBackgroundPoint(options, positionAndSize, alignment, chart);
                        (animX._to !== point.x || animY._to !== point.y) && (this.xAlign = alignment.xAlign, this.yAlign = alignment.yAlign, this.width = size.width, this.height = size.height, this.caretX = position.x, this.caretY = position.y, this._resolveAnimations().update(this, point));
                    }
                }
                _willRender() {
                    return !!this.opacity;
                }
                draw(ctx) {
                    const options = this.options.setContext(this.getContext());
                    let opacity = this.opacity;
                    if (!opacity) return;
                    this._updateAnimationTarget(options);
                    const tooltipSize = {
                        width: this.width,
                        height: this.height
                    }, pt = {
                        x: this.x,
                        y: this.y
                    };
                    opacity = 1e-3 > Math.abs(opacity) ? 0 : opacity;
                    const padding = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.K)(options.padding), hasTooltipContent = this.title.length || this.beforeBody.length || this.body.length || this.afterBody.length || this.footer.length;
                    options.enabled && hasTooltipContent && (ctx.save(), ctx.globalAlpha = opacity, this.drawBackground(pt, ctx, tooltipSize, options), (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.aB)(ctx, options.textDirection), pt.y += padding.top, this.drawTitle(pt, ctx, options), this.drawBody(pt, ctx, options), this.drawFooter(pt, ctx, options), (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.aD)(ctx, options.textDirection), ctx.restore());
                }
                getActiveElements() {
                    return this._active || [];
                }
                setActiveElements(activeElements, eventPosition) {
                    const lastActive = this._active, active = activeElements.map(({ datasetIndex , index  })=>{
                        const meta = this.chart.getDatasetMeta(datasetIndex);
                        if (!meta) throw Error('Cannot find a dataset at index ' + datasetIndex);
                        return {
                            datasetIndex,
                            element: meta.data[index],
                            index
                        };
                    }), changed = !(0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.ai)(lastActive, active), positionChanged = this._positionChanged(active, eventPosition);
                    (changed || positionChanged) && (this._active = active, this._eventPosition = eventPosition, this._ignoreReplayEvents = !0, this.update(!0));
                }
                handleEvent(e, replay, inChartArea = !0) {
                    if (replay && this._ignoreReplayEvents) return !1;
                    this._ignoreReplayEvents = !1;
                    const options = this.options, lastActive = this._active || [], active = this._getActiveElements(e, lastActive, replay, inChartArea), positionChanged = this._positionChanged(active, e), changed = replay || !(0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.ai)(active, lastActive) || positionChanged;
                    return changed && (this._active = active, (options.enabled || options.external) && (this._eventPosition = {
                        x: e.x,
                        y: e.y
                    }, this.update(!0, replay))), changed;
                }
                _getActiveElements(e, lastActive, replay, inChartArea) {
                    const options = this.options;
                    if ('mouseout' === e.type) return [];
                    if (!inChartArea) return lastActive;
                    const active = this.chart.getElementsAtEventForMode(e, options.mode, options, replay);
                    return options.reverse && active.reverse(), active;
                }
                _positionChanged(active, e) {
                    const { caretX , caretY , options  } = this, position = positioners[options.position].call(this, active, e);
                    return !1 !== position && (caretX !== position.x || caretY !== position.y);
                }
            }
            Tooltip.positioners = positioners;
            var plugin_tooltip = {
                id: 'tooltip',
                _element: Tooltip,
                positioners,
                afterInit (chart, _args, options) {
                    options && (chart.tooltip = new Tooltip({
                        chart,
                        options
                    }));
                },
                beforeUpdate (chart, _args, options) {
                    chart.tooltip && chart.tooltip.initialize(options);
                },
                reset (chart, _args, options) {
                    chart.tooltip && chart.tooltip.initialize(options);
                },
                afterDraw (chart) {
                    const tooltip = chart.tooltip;
                    if (tooltip && tooltip._willRender()) {
                        const args = {
                            tooltip
                        };
                        if (!1 === chart.notifyPlugins('beforeTooltipDraw', args)) return;
                        tooltip.draw(chart.ctx), chart.notifyPlugins('afterTooltipDraw', args);
                    }
                },
                afterEvent (chart, args) {
                    if (chart.tooltip) {
                        const useFinalPosition = args.replay;
                        chart.tooltip.handleEvent(args.event, useFinalPosition, args.inChartArea) && (args.changed = !0);
                    }
                },
                defaults: {
                    enabled: !0,
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
                    boxHeight: (ctx, opts)=>opts.bodyFont.size,
                    boxWidth: (ctx, opts)=>opts.bodyFont.size,
                    multiKeyBackground: '#fff',
                    displayColors: !0,
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
                        beforeTitle: _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.aF,
                        title (tooltipItems) {
                            if (tooltipItems.length > 0) {
                                const item = tooltipItems[0], labels = item.chart.data.labels, labelCount = labels ? labels.length : 0;
                                if (this && this.options && 'dataset' === this.options.mode) return item.dataset.label || '';
                                if (item.label) return item.label;
                                if (labelCount > 0 && item.dataIndex < labelCount) return labels[item.dataIndex];
                            }
                            return '';
                        },
                        afterTitle: _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.aF,
                        beforeBody: _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.aF,
                        beforeLabel: _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.aF,
                        label (tooltipItem) {
                            if (this && this.options && 'dataset' === this.options.mode) return tooltipItem.label + ': ' + tooltipItem.formattedValue || tooltipItem.formattedValue;
                            let label = tooltipItem.dataset.label || '';
                            label && (label += ': ');
                            const value = tooltipItem.formattedValue;
                            return (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.k)(value) || (label += value), label;
                        },
                        labelColor (tooltipItem) {
                            const meta = tooltipItem.chart.getDatasetMeta(tooltipItem.datasetIndex), options = meta.controller.getStyle(tooltipItem.dataIndex);
                            return {
                                borderColor: options.borderColor,
                                backgroundColor: options.backgroundColor,
                                borderWidth: options.borderWidth,
                                borderDash: options.borderDash,
                                borderDashOffset: options.borderDashOffset,
                                borderRadius: 0
                            };
                        },
                        labelTextColor () {
                            return this.options.bodyColor;
                        },
                        labelPointStyle (tooltipItem) {
                            const meta = tooltipItem.chart.getDatasetMeta(tooltipItem.datasetIndex), options = meta.controller.getStyle(tooltipItem.dataIndex);
                            return {
                                pointStyle: options.pointStyle,
                                rotation: options.rotation
                            };
                        },
                        afterLabel: _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.aF,
                        afterBody: _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.aF,
                        beforeFooter: _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.aF,
                        footer: _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.aF,
                        afterFooter: _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.aF
                    }
                },
                defaultRoutes: {
                    bodyFont: 'font',
                    footerFont: 'font',
                    titleFont: 'font'
                },
                descriptors: {
                    _scriptable: (name)=>'filter' !== name && 'itemSort' !== name && 'external' !== name,
                    _indexable: !1,
                    callbacks: {
                        _scriptable: !1,
                        _indexable: !1
                    },
                    animation: {
                        _fallback: !1
                    },
                    animations: {
                        _fallback: 'animation'
                    }
                },
                additionalOptionScopes: [
                    'interaction'
                ]
            }, plugins = Object.freeze({
                __proto__: null,
                Decimation: {
                    id: 'decimation',
                    defaults: {
                        algorithm: 'min-max',
                        enabled: !1
                    },
                    beforeElementsUpdate (chart, args, options) {
                        if (!options.enabled) {
                            cleanDecimatedData(chart);
                            return;
                        }
                        const availableWidth = chart.width;
                        chart.data.datasets.forEach((dataset, datasetIndex)=>{
                            let decimated;
                            const { _data , indexAxis  } = dataset, meta = chart.getDatasetMeta(datasetIndex), data = _data || dataset.data;
                            if ('y' === (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.a)([
                                indexAxis,
                                chart.options.indexAxis
                            ]) || !meta.controller.supportsDecimation) return;
                            const xAxis = chart.scales[meta.xAxisID];
                            if ('linear' !== xAxis.type && 'time' !== xAxis.type || chart.options.parsing) return;
                            let { start , count  } = function(meta, points) {
                                let count;
                                const pointCount = points.length;
                                let start = 0;
                                const { iScale  } = meta, { min , max , minDefined , maxDefined  } = iScale.getUserBounds();
                                return minDefined && (start = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.E)((0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.Z)(points, iScale.axis, min).lo, 0, pointCount - 1)), count = maxDefined ? (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.E)((0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.Z)(points, iScale.axis, max).hi + 1, start, pointCount) - start : pointCount - start, {
                                    start,
                                    count
                                };
                            }(meta, data);
                            const threshold = options.threshold || 4 * availableWidth;
                            if (count <= threshold) {
                                cleanDecimatedDataset(dataset);
                                return;
                            }
                            switch((0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.k)(_data) && (dataset._data = data, delete dataset.data, Object.defineProperty(dataset, 'data', {
                                configurable: !0,
                                enumerable: !0,
                                get: function() {
                                    return this._decimated;
                                },
                                set: function(d) {
                                    this._data = d;
                                }
                            })), options.algorithm){
                                case 'lttb':
                                    decimated = function(data, start, count, availableWidth, options) {
                                        let i, maxAreaPoint, maxArea, area, nextA;
                                        const samples = options.samples || availableWidth;
                                        if (samples >= count) return data.slice(start, start + count);
                                        const decimated = [], bucketWidth = (count - 2) / (samples - 2);
                                        let sampledIndex = 0, a = start;
                                        for(i = 0, decimated[sampledIndex++] = data[a]; i < samples - 2; i++){
                                            let j, avgX = 0, avgY = 0;
                                            const avgRangeStart = Math.floor((i + 1) * bucketWidth) + 1 + start, avgRangeEnd = Math.min(Math.floor((i + 2) * bucketWidth) + 1, count) + start, avgRangeLength = avgRangeEnd - avgRangeStart;
                                            for(j = avgRangeStart; j < avgRangeEnd; j++)avgX += data[j].x, avgY += data[j].y;
                                            avgX /= avgRangeLength, avgY /= avgRangeLength;
                                            const rangeOffs = Math.floor(i * bucketWidth) + 1 + start, rangeTo = Math.min(Math.floor((i + 1) * bucketWidth) + 1, count) + start, { x: pointAx , y: pointAy  } = data[a];
                                            for(maxArea = area = -1, j = rangeOffs; j < rangeTo; j++)(area = 0.5 * Math.abs((pointAx - avgX) * (data[j].y - pointAy) - (pointAx - data[j].x) * (avgY - pointAy))) > maxArea && (maxArea = area, maxAreaPoint = data[j], nextA = j);
                                            decimated[sampledIndex++] = maxAreaPoint, a = nextA;
                                        }
                                        return decimated[sampledIndex++] = data[start + count - 1], decimated;
                                    }(data, start, count, availableWidth, options);
                                    break;
                                case 'min-max':
                                    decimated = function(data, start, count, availableWidth) {
                                        let i, point, x, y, prevX, minIndex, maxIndex, startIndex, minY, maxY, avgX = 0, countX = 0;
                                        const decimated = [], xMin = data[start].x, xMax = data[start + count - 1].x, dx = xMax - xMin;
                                        for(i = start; i < start + count; ++i){
                                            x = ((point = data[i]).x - xMin) / dx * availableWidth, y = point.y;
                                            const truncX = 0 | x;
                                            if (truncX === prevX) y < minY ? (minY = y, minIndex = i) : y > maxY && (maxY = y, maxIndex = i), avgX = (countX * avgX + point.x) / ++countX;
                                            else {
                                                const lastIndex = i - 1;
                                                if (!(0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.k)(minIndex) && !(0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.k)(maxIndex)) {
                                                    const intermediateIndex1 = Math.min(minIndex, maxIndex), intermediateIndex2 = Math.max(minIndex, maxIndex);
                                                    intermediateIndex1 !== startIndex && intermediateIndex1 !== lastIndex && decimated.push({
                                                        ...data[intermediateIndex1],
                                                        x: avgX
                                                    }), intermediateIndex2 !== startIndex && intermediateIndex2 !== lastIndex && decimated.push({
                                                        ...data[intermediateIndex2],
                                                        x: avgX
                                                    });
                                                }
                                                i > 0 && lastIndex !== startIndex && decimated.push(data[lastIndex]), decimated.push(point), prevX = truncX, countX = 0, minY = maxY = y, minIndex = maxIndex = startIndex = i;
                                            }
                                        }
                                        return decimated;
                                    }(data, start, count, availableWidth);
                                    break;
                                default:
                                    throw Error(`Unsupported decimation algorithm '${options.algorithm}'`);
                            }
                            dataset._decimated = decimated;
                        });
                    },
                    destroy (chart) {
                        cleanDecimatedData(chart);
                    }
                },
                Filler: {
                    id: 'filler',
                    afterDatasetsUpdate (chart, _args, options) {
                        let meta, i, line, source;
                        const count = (chart.data.datasets || []).length, sources = [];
                        for(i = 0; i < count; ++i)line = (meta = chart.getDatasetMeta(i)).dataset, source = null, line && line.options && line instanceof LineElement && (source = {
                            visible: chart.isDatasetVisible(i),
                            index: i,
                            fill: _decodeFill(line, i, count),
                            chart,
                            axis: meta.controller.options.indexAxis,
                            scale: meta.vScale,
                            line
                        }), meta.$filler = source, sources.push(source);
                        for(i = 0; i < count; ++i)(source = sources[i]) && !1 !== source.fill && (source.fill = _resolveTarget(sources, i, options.propagate));
                    },
                    beforeDraw (chart, _args, options) {
                        const draw = 'beforeDraw' === options.drawTime, metasets = chart.getSortedVisibleDatasetMetas(), area = chart.chartArea;
                        for(let i = metasets.length - 1; i >= 0; --i){
                            const source = metasets[i].$filler;
                            source && (source.line.updateControlPoints(area, source.axis), draw && source.fill && _drawfill(chart.ctx, source, area));
                        }
                    },
                    beforeDatasetsDraw (chart, _args, options) {
                        if ('beforeDatasetsDraw' !== options.drawTime) return;
                        const metasets = chart.getSortedVisibleDatasetMetas();
                        for(let i = metasets.length - 1; i >= 0; --i){
                            const source = metasets[i].$filler;
                            _shouldApplyFill(source) && _drawfill(chart.ctx, source, chart.chartArea);
                        }
                    },
                    beforeDatasetDraw (chart, args, options) {
                        const source = args.meta.$filler;
                        _shouldApplyFill(source) && 'beforeDatasetDraw' === options.drawTime && _drawfill(chart.ctx, source, chart.chartArea);
                    },
                    defaults: {
                        propagate: !0,
                        drawTime: 'beforeDatasetDraw'
                    }
                },
                Legend: {
                    id: 'legend',
                    _element: Legend,
                    start (chart, _args, options) {
                        const legend = chart.legend = new Legend({
                            ctx: chart.ctx,
                            options,
                            chart
                        });
                        layouts.configure(chart, legend, options), layouts.addBox(chart, legend);
                    },
                    stop (chart) {
                        layouts.removeBox(chart, chart.legend), delete chart.legend;
                    },
                    beforeUpdate (chart, _args, options) {
                        const legend = chart.legend;
                        layouts.configure(chart, legend, options), legend.options = options;
                    },
                    afterUpdate (chart) {
                        const legend = chart.legend;
                        legend.buildLabels(), legend.adjustHitBoxes();
                    },
                    afterEvent (chart, args) {
                        args.replay || chart.legend.handleEvent(args.event);
                    },
                    defaults: {
                        display: !0,
                        position: 'top',
                        align: 'center',
                        fullSize: !0,
                        reverse: !1,
                        weight: 1000,
                        onClick (e, legendItem, legend) {
                            const index = legendItem.datasetIndex, ci = legend.chart;
                            ci.isDatasetVisible(index) ? (ci.hide(index), legendItem.hidden = !0) : (ci.show(index), legendItem.hidden = !1);
                        },
                        onHover: null,
                        onLeave: null,
                        labels: {
                            color: (ctx)=>ctx.chart.options.color,
                            boxWidth: 40,
                            padding: 10,
                            generateLabels (chart) {
                                const datasets = chart.data.datasets, { labels: { usePointStyle , pointStyle , textAlign , color  }  } = chart.legend.options;
                                return chart._getSortedDatasetMetas().map((meta)=>{
                                    const style = meta.controller.getStyle(usePointStyle ? 0 : void 0), borderWidth = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.K)(style.borderWidth);
                                    return {
                                        text: datasets[meta.index].label,
                                        fillStyle: style.backgroundColor,
                                        fontColor: color,
                                        hidden: !meta.visible,
                                        lineCap: style.borderCapStyle,
                                        lineDash: style.borderDash,
                                        lineDashOffset: style.borderDashOffset,
                                        lineJoin: style.borderJoinStyle,
                                        lineWidth: (borderWidth.width + borderWidth.height) / 4,
                                        strokeStyle: style.borderColor,
                                        pointStyle: pointStyle || style.pointStyle,
                                        rotation: style.rotation,
                                        textAlign: textAlign || style.textAlign,
                                        borderRadius: 0,
                                        datasetIndex: meta.index
                                    };
                                }, this);
                            }
                        },
                        title: {
                            color: (ctx)=>ctx.chart.options.color,
                            display: !1,
                            position: 'center',
                            text: ''
                        }
                    },
                    descriptors: {
                        _scriptable: (name)=>!name.startsWith('on'),
                        labels: {
                            _scriptable: (name)=>![
                                    'generateLabels',
                                    'filter',
                                    'sort'
                                ].includes(name)
                        }
                    }
                },
                SubTitle: {
                    id: 'subtitle',
                    start (chart, _args, options) {
                        const title = new Title({
                            ctx: chart.ctx,
                            options,
                            chart
                        });
                        layouts.configure(chart, title, options), layouts.addBox(chart, title), map.set(chart, title);
                    },
                    stop (chart) {
                        layouts.removeBox(chart, map.get(chart)), map.delete(chart);
                    },
                    beforeUpdate (chart, _args, options) {
                        const title = map.get(chart);
                        layouts.configure(chart, title, options), title.options = options;
                    },
                    defaults: {
                        align: 'center',
                        display: !1,
                        font: {
                            weight: 'normal'
                        },
                        fullSize: !0,
                        padding: 0,
                        position: 'top',
                        text: '',
                        weight: 1500
                    },
                    defaultRoutes: {
                        color: 'color'
                    },
                    descriptors: {
                        _scriptable: !0,
                        _indexable: !1
                    }
                },
                Title: {
                    id: 'title',
                    _element: Title,
                    start (chart, _args, options) {
                        !function(chart, titleOpts) {
                            const title = new Title({
                                ctx: chart.ctx,
                                options: titleOpts,
                                chart
                            });
                            layouts.configure(chart, title, titleOpts), layouts.addBox(chart, title), chart.titleBlock = title;
                        }(chart, options);
                    },
                    stop (chart) {
                        const titleBlock = chart.titleBlock;
                        layouts.removeBox(chart, titleBlock), delete chart.titleBlock;
                    },
                    beforeUpdate (chart, _args, options) {
                        const title = chart.titleBlock;
                        layouts.configure(chart, title, options), title.options = options;
                    },
                    defaults: {
                        align: 'center',
                        display: !1,
                        font: {
                            weight: 'bold'
                        },
                        fullSize: !0,
                        padding: 10,
                        position: 'top',
                        text: '',
                        weight: 2000
                    },
                    defaultRoutes: {
                        color: 'color'
                    },
                    descriptors: {
                        _scriptable: !0,
                        _indexable: !1
                    }
                },
                Tooltip: plugin_tooltip
            });
            const addIfString = (labels, raw, index, addedLabels)=>('string' == typeof raw ? (index = labels.push(raw) - 1, addedLabels.unshift({
                    index,
                    label: raw
                })) : isNaN(raw) && (index = null), index), validIndex = (index, max)=>null === index ? null : (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.E)(Math.round(index), 0, max);
            class CategoryScale extends Scale {
                constructor(cfg){
                    super(cfg), this._startValue = void 0, this._valueRange = 0, this._addedLabels = [];
                }
                init(scaleOptions) {
                    const added = this._addedLabels;
                    if (added.length) {
                        const labels = this.getLabels();
                        for (const { index , label  } of added)labels[index] === label && labels.splice(index, 1);
                        this._addedLabels = [];
                    }
                    super.init(scaleOptions);
                }
                parse(raw, index) {
                    if ((0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.k)(raw)) return null;
                    const labels = this.getLabels();
                    return index = isFinite(index) && labels[index] === raw ? index : function(labels, raw, index, addedLabels) {
                        const first = labels.indexOf(raw);
                        if (-1 === first) return addIfString(labels, raw, index, addedLabels);
                        const last = labels.lastIndexOf(raw);
                        return first !== last ? index : first;
                    }(labels, raw, (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.v)(index, raw), this._addedLabels), validIndex(index, labels.length - 1);
                }
                determineDataLimits() {
                    const { minDefined , maxDefined  } = this.getUserBounds();
                    let { min , max  } = this.getMinMax(!0);
                    'ticks' !== this.options.bounds || (minDefined || (min = 0), maxDefined || (max = this.getLabels().length - 1)), this.min = min, this.max = max;
                }
                buildTicks() {
                    const min = this.min, max = this.max, offset = this.options.offset, ticks = [];
                    let labels = this.getLabels();
                    labels = 0 === min && max === labels.length - 1 ? labels : labels.slice(min, max + 1), this._valueRange = Math.max(labels.length - (offset ? 0 : 1), 1), this._startValue = this.min - (offset ? 0.5 : 0);
                    for(let value = min; value <= max; value++)ticks.push({
                        value
                    });
                    return ticks;
                }
                getLabelForValue(value) {
                    const labels = this.getLabels();
                    return value >= 0 && value < labels.length ? labels[value] : value;
                }
                configure() {
                    super.configure(), this.isHorizontal() || (this._reversePixels = !this._reversePixels);
                }
                getPixelForValue(value) {
                    return 'number' != typeof value && (value = this.parse(value)), null === value ? NaN : this.getPixelForDecimal((value - this._startValue) / this._valueRange);
                }
                getPixelForTick(index) {
                    const ticks = this.ticks;
                    return index < 0 || index > ticks.length - 1 ? null : this.getPixelForValue(ticks[index].value);
                }
                getValueForPixel(pixel) {
                    return Math.round(this._startValue + this.getDecimalForPixel(pixel) * this._valueRange);
                }
                getBasePixel() {
                    return this.bottom;
                }
            }
            function relativeLabelSize(value, minSpacing, { horizontal , minRotation  }) {
                const rad = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.t)(minRotation), length = 0.75 * minSpacing * ('' + value).length;
                return Math.min(minSpacing / ((horizontal ? Math.sin(rad) : Math.cos(rad)) || 0.001), length);
            }
            CategoryScale.id = 'category', CategoryScale.defaults = {
                ticks: {
                    callback: CategoryScale.prototype.getLabelForValue
                }
            };
            class LinearScaleBase extends Scale {
                constructor(cfg){
                    super(cfg), this.start = void 0, this.end = void 0, this._startValue = void 0, this._endValue = void 0, this._valueRange = 0;
                }
                parse(raw, index) {
                    return (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.k)(raw) || ('number' == typeof raw || raw instanceof Number) && !isFinite(+raw) ? null : +raw;
                }
                handleTickRangeOptions() {
                    const { beginAtZero  } = this.options, { minDefined , maxDefined  } = this.getUserBounds();
                    let { min , max  } = this;
                    const setMin = (v)=>min = minDefined ? min : v, setMax = (v)=>max = maxDefined ? max : v;
                    if (beginAtZero) {
                        const minSign = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.s)(min), maxSign = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.s)(max);
                        minSign < 0 && maxSign < 0 ? setMax(0) : minSign > 0 && maxSign > 0 && setMin(0);
                    }
                    if (min === max) {
                        let offset = 1;
                        (max >= Number.MAX_SAFE_INTEGER || min <= Number.MIN_SAFE_INTEGER) && (offset = Math.abs(0.05 * max)), setMax(max + offset), beginAtZero || setMin(min - offset);
                    }
                    this.min = min, this.max = max;
                }
                getTickLimit() {
                    let maxTicks;
                    const tickOpts = this.options.ticks;
                    let { maxTicksLimit , stepSize  } = tickOpts;
                    return stepSize ? (maxTicks = Math.ceil(this.max / stepSize) - Math.floor(this.min / stepSize) + 1) > 1000 && (console.warn(`scales.${this.id}.ticks.stepSize: ${stepSize} would result generating up to ${maxTicks} ticks. Limiting to 1000.`), maxTicks = 1000) : (maxTicks = this.computeTickLimit(), maxTicksLimit = maxTicksLimit || 11), maxTicksLimit && (maxTicks = Math.min(maxTicksLimit, maxTicks)), maxTicks;
                }
                computeTickLimit() {
                    return Number.POSITIVE_INFINITY;
                }
                buildTicks() {
                    const opts = this.options, tickOpts = opts.ticks;
                    let maxTicks = this.getTickLimit();
                    maxTicks = Math.max(2, maxTicks);
                    const numericGeneratorOptions = {
                        maxTicks,
                        bounds: opts.bounds,
                        min: opts.min,
                        max: opts.max,
                        precision: tickOpts.precision,
                        step: tickOpts.stepSize,
                        count: tickOpts.count,
                        maxDigits: this._maxDigits(),
                        horizontal: this.isHorizontal(),
                        minRotation: tickOpts.minRotation || 0,
                        includeBounds: !1 !== tickOpts.includeBounds
                    }, dataRange = this._range || this, ticks = function(generationOptions, dataRange) {
                        let factor, niceMin, niceMax, numSpaces;
                        const ticks = [], { bounds , step , min , max , precision , count , maxTicks , maxDigits , includeBounds  } = generationOptions, unit = step || 1, maxSpaces = maxTicks - 1, { min: rmin , max: rmax  } = dataRange, minDefined = !(0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.k)(min), maxDefined = !(0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.k)(max), countDefined = !(0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.k)(count), minSpacing = (rmax - rmin) / (maxDigits + 1);
                        let spacing = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.aI)((rmax - rmin) / maxSpaces / unit) * unit;
                        if (spacing < 1e-14 && !minDefined && !maxDefined) return [
                            {
                                value: rmin
                            },
                            {
                                value: rmax
                            }
                        ];
                        (numSpaces = Math.ceil(rmax / spacing) - Math.floor(rmin / spacing)) > maxSpaces && (spacing = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.aI)(numSpaces * spacing / maxSpaces / unit) * unit), (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.k)(precision) || (spacing = Math.ceil(spacing * factor) / (factor = Math.pow(10, precision))), 'ticks' === bounds ? (niceMin = Math.floor(rmin / spacing) * spacing, niceMax = Math.ceil(rmax / spacing) * spacing) : (niceMin = rmin, niceMax = rmax), minDefined && maxDefined && step && (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.aJ)((max - min) / step, spacing / 1000) ? (numSpaces = Math.round(Math.min((max - min) / spacing, maxTicks)), spacing = (max - min) / numSpaces, niceMin = min, niceMax = max) : countDefined ? (niceMin = minDefined ? min : niceMin, spacing = ((niceMax = maxDefined ? max : niceMax) - niceMin) / (numSpaces = count - 1)) : (numSpaces = (niceMax - niceMin) / spacing, numSpaces = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.aK)(numSpaces, Math.round(numSpaces), spacing / 1000) ? Math.round(numSpaces) : Math.ceil(numSpaces));
                        const decimalPlaces = Math.max((0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.aL)(spacing), (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.aL)(niceMin));
                        niceMin = Math.round(niceMin * factor) / (factor = Math.pow(10, (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.k)(precision) ? decimalPlaces : precision)), niceMax = Math.round(niceMax * factor) / factor;
                        let j = 0;
                        for(minDefined && (includeBounds && niceMin !== min ? (ticks.push({
                            value: min
                        }), niceMin < min && j++, (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.aK)(Math.round((niceMin + j * spacing) * factor) / factor, min, relativeLabelSize(min, minSpacing, generationOptions)) && j++) : niceMin < min && j++); j < numSpaces; ++j)ticks.push({
                            value: Math.round((niceMin + j * spacing) * factor) / factor
                        });
                        return maxDefined && includeBounds && niceMax !== max ? ticks.length && (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.aK)(ticks[ticks.length - 1].value, max, relativeLabelSize(max, minSpacing, generationOptions)) ? ticks[ticks.length - 1].value = max : ticks.push({
                            value: max
                        }) : maxDefined && niceMax !== max || ticks.push({
                            value: niceMax
                        }), ticks;
                    }(numericGeneratorOptions, dataRange);
                    return 'ticks' === opts.bounds && (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.aH)(ticks, this, 'value'), opts.reverse ? (ticks.reverse(), this.start = this.max, this.end = this.min) : (this.start = this.min, this.end = this.max), ticks;
                }
                configure() {
                    const ticks = this.ticks;
                    let start = this.min, end = this.max;
                    if (super.configure(), this.options.offset && ticks.length) {
                        const offset = (end - start) / Math.max(ticks.length - 1, 1) / 2;
                        start -= offset, end += offset;
                    }
                    this._startValue = start, this._endValue = end, this._valueRange = end - start;
                }
                getLabelForValue(value) {
                    return (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.o)(value, this.chart.options.locale, this.options.ticks.format);
                }
            }
            class LinearScale extends LinearScaleBase {
                determineDataLimits() {
                    const { min , max  } = this.getMinMax(!0);
                    this.min = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.g)(min) ? min : 0, this.max = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.g)(max) ? max : 1, this.handleTickRangeOptions();
                }
                computeTickLimit() {
                    const horizontal = this.isHorizontal(), length = horizontal ? this.width : this.height, minRotation = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.t)(this.options.ticks.minRotation), tickFont = this._resolveTickFontOptions(0);
                    return Math.ceil(length / Math.min(40, tickFont.lineHeight / ((horizontal ? Math.sin(minRotation) : Math.cos(minRotation)) || 0.001)));
                }
                getPixelForValue(value) {
                    return null === value ? NaN : this.getPixelForDecimal((value - this._startValue) / this._valueRange);
                }
                getValueForPixel(pixel) {
                    return this._startValue + this.getDecimalForPixel(pixel) * this._valueRange;
                }
            }
            function isMajor(tickVal) {
                const remain = tickVal / Math.pow(10, Math.floor((0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.z)(tickVal)));
                return 1 === remain;
            }
            LinearScale.id = 'linear', LinearScale.defaults = {
                ticks: {
                    callback: Ticks.formatters.numeric
                }
            };
            class LogarithmicScale extends Scale {
                constructor(cfg){
                    super(cfg), this.start = void 0, this.end = void 0, this._startValue = void 0, this._valueRange = 0;
                }
                parse(raw, index) {
                    const value = LinearScaleBase.prototype.parse.apply(this, [
                        raw,
                        index
                    ]);
                    if (0 === value) {
                        this._zero = !0;
                        return;
                    }
                    return (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.g)(value) && value > 0 ? value : null;
                }
                determineDataLimits() {
                    const { min , max  } = this.getMinMax(!0);
                    this.min = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.g)(min) ? Math.max(0, min) : null, this.max = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.g)(max) ? Math.max(0, max) : null, this.options.beginAtZero && (this._zero = !0), this.handleTickRangeOptions();
                }
                handleTickRangeOptions() {
                    const { minDefined , maxDefined  } = this.getUserBounds();
                    let min = this.min, max = this.max;
                    const setMin = (v)=>min = minDefined ? min : v, setMax = (v)=>max = maxDefined ? max : v, exp = (v, m)=>Math.pow(10, Math.floor((0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.z)(v)) + m);
                    min === max && (min <= 0 ? (setMin(1), setMax(10)) : (setMin(exp(min, -1)), setMax(exp(max, 1)))), min <= 0 && setMin(exp(max, -1)), max <= 0 && setMax(exp(min, 1)), this._zero && this.min !== this._suggestedMin && min === exp(this.min, 0) && setMin(exp(min, -1)), this.min = min, this.max = max;
                }
                buildTicks() {
                    const opts = this.options, generationOptions = {
                        min: this._userMin,
                        max: this._userMax
                    }, ticks = function(generationOptions, dataRange) {
                        const endExp = Math.floor((0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.z)(dataRange.max)), endSignificand = Math.ceil(dataRange.max / Math.pow(10, endExp)), ticks = [];
                        let tickVal = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.B)(generationOptions.min, Math.pow(10, Math.floor((0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.z)(dataRange.min)))), exp = Math.floor((0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.z)(tickVal)), significand = Math.floor(tickVal / Math.pow(10, exp)), precision = exp < 0 ? Math.pow(10, Math.abs(exp)) : 1;
                        do ticks.push({
                            value: tickVal,
                            major: isMajor(tickVal)
                        }), 10 == ++significand && (significand = 1, precision = ++exp >= 0 ? 1 : precision), tickVal = Math.round(significand * Math.pow(10, exp) * precision) / precision;
                        while (exp < endExp || exp === endExp && significand < endSignificand)
                        const lastTick = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.B)(generationOptions.max, tickVal);
                        return ticks.push({
                            value: lastTick,
                            major: isMajor(tickVal)
                        }), ticks;
                    }(generationOptions, this);
                    return 'ticks' === opts.bounds && (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.aH)(ticks, this, 'value'), opts.reverse ? (ticks.reverse(), this.start = this.max, this.end = this.min) : (this.start = this.min, this.end = this.max), ticks;
                }
                getLabelForValue(value) {
                    return void 0 === value ? '0' : (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.o)(value, this.chart.options.locale, this.options.ticks.format);
                }
                configure() {
                    const start = this.min;
                    super.configure(), this._startValue = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.z)(start), this._valueRange = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.z)(this.max) - (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.z)(start);
                }
                getPixelForValue(value) {
                    return ((void 0 === value || 0 === value) && (value = this.min), null === value || isNaN(value)) ? NaN : this.getPixelForDecimal(value === this.min ? 0 : ((0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.z)(value) - this._startValue) / this._valueRange);
                }
                getValueForPixel(pixel) {
                    const decimal = this.getDecimalForPixel(pixel);
                    return Math.pow(10, this._startValue + decimal * this._valueRange);
                }
            }
            function getTickBackdropHeight(opts) {
                const tickOpts = opts.ticks;
                if (tickOpts.display && opts.display) {
                    const padding = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.K)(tickOpts.backdropPadding);
                    return (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.v)(tickOpts.font && tickOpts.font.size, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.d.font.size) + padding.height;
                }
                return 0;
            }
            function measureLabelSize(ctx, font, label) {
                return label = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.b)(label) ? label : [
                    label
                ], {
                    w: (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.aM)(ctx, font.string, label),
                    h: label.length * font.lineHeight
                };
            }
            function determineLimits(angle, pos, size, min, max) {
                return angle === min || angle === max ? {
                    start: pos - size / 2,
                    end: pos + size / 2
                } : angle < min || angle > max ? {
                    start: pos - size,
                    end: pos
                } : {
                    start: pos,
                    end: pos + size
                };
            }
            function updateLimits(limits, orig, angle, hLimits, vLimits) {
                const sin = Math.abs(Math.sin(angle)), cos = Math.abs(Math.cos(angle));
                let x = 0, y = 0;
                hLimits.start < orig.l ? (x = (orig.l - hLimits.start) / sin, limits.l = Math.min(limits.l, orig.l - x)) : hLimits.end > orig.r && (x = (hLimits.end - orig.r) / sin, limits.r = Math.max(limits.r, orig.r + x)), vLimits.start < orig.t ? (y = (orig.t - vLimits.start) / cos, limits.t = Math.min(limits.t, orig.t - y)) : vLimits.end > orig.b && (y = (vLimits.end - orig.b) / cos, limits.b = Math.max(limits.b, orig.b + y));
            }
            function getTextAlignForAngle(angle) {
                return 0 === angle || 180 === angle ? 'center' : angle < 180 ? 'left' : 'right';
            }
            function leftForTextAlign(x, w, align) {
                return 'right' === align ? x -= w : 'center' === align && (x -= w / 2), x;
            }
            function yForAngle(y, h, angle) {
                return 90 === angle || 270 === angle ? y -= h / 2 : (angle > 270 || angle < 90) && (y -= h), y;
            }
            function pathRadiusLine(scale, radius, circular, labelCount) {
                const { ctx  } = scale;
                if (circular) ctx.arc(scale.xCenter, scale.yCenter, radius, 0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.T);
                else {
                    let pointPosition = scale.getPointPosition(0, radius);
                    ctx.moveTo(pointPosition.x, pointPosition.y);
                    for(let i = 1; i < labelCount; i++)pointPosition = scale.getPointPosition(i, radius), ctx.lineTo(pointPosition.x, pointPosition.y);
                }
            }
            LogarithmicScale.id = 'logarithmic', LogarithmicScale.defaults = {
                ticks: {
                    callback: Ticks.formatters.logarithmic,
                    major: {
                        enabled: !0
                    }
                }
            };
            class RadialLinearScale extends LinearScaleBase {
                constructor(cfg){
                    super(cfg), this.xCenter = void 0, this.yCenter = void 0, this.drawingArea = void 0, this._pointLabels = [], this._pointLabelItems = [];
                }
                setDimensions() {
                    const padding = this._padding = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.K)(getTickBackdropHeight(this.options) / 2), w = this.width = this.maxWidth - padding.width, h = this.height = this.maxHeight - padding.height;
                    this.xCenter = Math.floor(this.left + w / 2 + padding.left), this.yCenter = Math.floor(this.top + h / 2 + padding.top), this.drawingArea = Math.floor(Math.min(w, h) / 2);
                }
                determineDataLimits() {
                    const { min , max  } = this.getMinMax(!1);
                    this.min = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.g)(min) && !isNaN(min) ? min : 0, this.max = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.g)(max) && !isNaN(max) ? max : 0, this.handleTickRangeOptions();
                }
                computeTickLimit() {
                    return Math.ceil(this.drawingArea / getTickBackdropHeight(this.options));
                }
                generateTickLabels(ticks) {
                    LinearScaleBase.prototype.generateTickLabels.call(this, ticks), this._pointLabels = this.getLabels().map((value, index)=>{
                        const label = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.C)(this.options.pointLabels.callback, [
                            value,
                            index
                        ], this);
                        return label || 0 === label ? label : '';
                    }).filter((v, i)=>this.chart.getDataVisibility(i));
                }
                fit() {
                    const opts = this.options;
                    opts.display && opts.pointLabels.display ? function(scale) {
                        const orig = {
                            l: scale.left + scale._padding.left,
                            r: scale.right - scale._padding.right,
                            t: scale.top + scale._padding.top,
                            b: scale.bottom - scale._padding.bottom
                        }, limits = Object.assign({}, orig), labelSizes = [], padding = [], valueCount = scale._pointLabels.length, pointLabelOpts = scale.options.pointLabels, additionalAngle = pointLabelOpts.centerPointLabels ? _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.P / valueCount : 0;
                        for(let i = 0; i < valueCount; i++){
                            const opts = pointLabelOpts.setContext(scale.getPointLabelContext(i));
                            padding[i] = opts.padding;
                            const pointPosition = scale.getPointPosition(i, scale.drawingArea + padding[i], additionalAngle), plFont = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.O)(opts.font), textSize = measureLabelSize(scale.ctx, plFont, scale._pointLabels[i]);
                            labelSizes[i] = textSize;
                            const angleRadians = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.az)(scale.getIndexAngle(i) + additionalAngle), angle = Math.round((0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.F)(angleRadians)), hLimits = determineLimits(angle, pointPosition.x, textSize.w, 0, 180), vLimits = determineLimits(angle, pointPosition.y, textSize.h, 90, 270);
                            updateLimits(limits, orig, angleRadians, hLimits, vLimits);
                        }
                        scale.setCenterPoint(orig.l - limits.l, limits.r - orig.r, orig.t - limits.t, limits.b - orig.b), scale._pointLabelItems = function(scale, labelSizes, padding) {
                            const items = [], valueCount = scale._pointLabels.length, opts = scale.options, extra = getTickBackdropHeight(opts) / 2, outerDistance = scale.drawingArea, additionalAngle = opts.pointLabels.centerPointLabels ? _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.P / valueCount : 0;
                            for(let i = 0; i < valueCount; i++){
                                const pointLabelPosition = scale.getPointPosition(i, outerDistance + extra + padding[i], additionalAngle), angle = Math.round((0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.F)((0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.az)(pointLabelPosition.angle + _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.H))), size = labelSizes[i], y = yForAngle(pointLabelPosition.y, size.h, angle), textAlign = getTextAlignForAngle(angle), left = leftForTextAlign(pointLabelPosition.x, size.w, textAlign);
                                items.push({
                                    x: pointLabelPosition.x,
                                    y,
                                    textAlign,
                                    left,
                                    top: y,
                                    right: left + size.w,
                                    bottom: y + size.h
                                });
                            }
                            return items;
                        }(scale, labelSizes, padding);
                    }(this) : this.setCenterPoint(0, 0, 0, 0);
                }
                setCenterPoint(leftMovement, rightMovement, topMovement, bottomMovement) {
                    this.xCenter += Math.floor((leftMovement - rightMovement) / 2), this.yCenter += Math.floor((topMovement - bottomMovement) / 2), this.drawingArea -= Math.min(this.drawingArea / 2, Math.max(leftMovement, rightMovement, topMovement, bottomMovement));
                }
                getIndexAngle(index) {
                    const angleMultiplier = _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.T / (this._pointLabels.length || 1), startAngle = this.options.startAngle || 0;
                    return (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.az)(index * angleMultiplier + (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.t)(startAngle));
                }
                getDistanceFromCenterForValue(value) {
                    if ((0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.k)(value)) return NaN;
                    const scalingFactor = this.drawingArea / (this.max - this.min);
                    return this.options.reverse ? (this.max - value) * scalingFactor : (value - this.min) * scalingFactor;
                }
                getValueForDistanceFromCenter(distance) {
                    if ((0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.k)(distance)) return NaN;
                    const scaledDistance = distance / (this.drawingArea / (this.max - this.min));
                    return this.options.reverse ? this.max - scaledDistance : this.min + scaledDistance;
                }
                getPointLabelContext(index) {
                    const pointLabels = this._pointLabels || [];
                    if (index >= 0 && index < pointLabels.length) {
                        var parent;
                        const pointLabel = pointLabels[index];
                        return parent = this.getContext(), (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.h)(parent, {
                            label: pointLabel,
                            index: index,
                            type: 'pointLabel'
                        });
                    }
                }
                getPointPosition(index, distanceFromCenter, additionalAngle = 0) {
                    const angle = this.getIndexAngle(index) - _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.H + additionalAngle;
                    return {
                        x: Math.cos(angle) * distanceFromCenter + this.xCenter,
                        y: Math.sin(angle) * distanceFromCenter + this.yCenter,
                        angle
                    };
                }
                getPointPositionForValue(index, value) {
                    return this.getPointPosition(index, this.getDistanceFromCenterForValue(value));
                }
                getBasePosition(index) {
                    return this.getPointPositionForValue(index || 0, this.getBaseValue());
                }
                getPointLabelPosition(index) {
                    const { left , top , right , bottom  } = this._pointLabelItems[index];
                    return {
                        left,
                        top,
                        right,
                        bottom
                    };
                }
                drawBackground() {
                    const { backgroundColor , grid: { circular  }  } = this.options;
                    if (backgroundColor) {
                        const ctx = this.ctx;
                        ctx.save(), ctx.beginPath(), pathRadiusLine(this, this.getDistanceFromCenterForValue(this._endValue), circular, this._pointLabels.length), ctx.closePath(), ctx.fillStyle = backgroundColor, ctx.fill(), ctx.restore();
                    }
                }
                drawGrid() {
                    let i, offset, position;
                    const ctx = this.ctx, opts = this.options, { angleLines , grid  } = opts, labelCount = this._pointLabels.length;
                    if (opts.pointLabels.display && function(scale, labelCount) {
                        const { ctx , options: { pointLabels  }  } = scale;
                        for(let i = labelCount - 1; i >= 0; i--){
                            const optsAtIndex = pointLabels.setContext(scale.getPointLabelContext(i)), plFont = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.O)(optsAtIndex.font), { x , y , textAlign , left , top , right , bottom  } = scale._pointLabelItems[i], { backdropColor  } = optsAtIndex;
                            if (!(0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.k)(backdropColor)) {
                                const borderRadius = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.ax)(optsAtIndex.borderRadius), padding = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.K)(optsAtIndex.backdropPadding);
                                ctx.fillStyle = backdropColor;
                                const backdropLeft = left - padding.left, backdropTop = top - padding.top, backdropWidth = right - left + padding.width, backdropHeight = bottom - top + padding.height;
                                Object.values(borderRadius).some((v)=>0 !== v) ? (ctx.beginPath(), (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.av)(ctx, {
                                    x: backdropLeft,
                                    y: backdropTop,
                                    w: backdropWidth,
                                    h: backdropHeight,
                                    radius: borderRadius
                                }), ctx.fill()) : ctx.fillRect(backdropLeft, backdropTop, backdropWidth, backdropHeight);
                            }
                            (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.M)(ctx, scale._pointLabels[i], x, y + plFont.lineHeight / 2, plFont, {
                                color: optsAtIndex.color,
                                textAlign: textAlign,
                                textBaseline: 'middle'
                            });
                        }
                    }(this, labelCount), grid.display && this.ticks.forEach((tick, index)=>{
                        if (0 !== index) {
                            offset = this.getDistanceFromCenterForValue(tick.value);
                            const optsAtIndex = grid.setContext(this.getContext(index - 1));
                            !function(scale, gridLineOpts, radius, labelCount) {
                                const ctx = scale.ctx, circular = gridLineOpts.circular, { color , lineWidth  } = gridLineOpts;
                                (circular || labelCount) && color && lineWidth && !(radius < 0) && (ctx.save(), ctx.strokeStyle = color, ctx.lineWidth = lineWidth, ctx.setLineDash(gridLineOpts.borderDash), ctx.lineDashOffset = gridLineOpts.borderDashOffset, ctx.beginPath(), pathRadiusLine(scale, radius, circular, labelCount), ctx.closePath(), ctx.stroke(), ctx.restore());
                            }(this, optsAtIndex, offset, labelCount);
                        }
                    }), angleLines.display) {
                        for(ctx.save(), i = labelCount - 1; i >= 0; i--){
                            const optsAtIndex = angleLines.setContext(this.getPointLabelContext(i)), { color , lineWidth  } = optsAtIndex;
                            lineWidth && color && (ctx.lineWidth = lineWidth, ctx.strokeStyle = color, ctx.setLineDash(optsAtIndex.borderDash), ctx.lineDashOffset = optsAtIndex.borderDashOffset, offset = this.getDistanceFromCenterForValue(opts.ticks.reverse ? this.min : this.max), position = this.getPointPosition(i, offset), ctx.beginPath(), ctx.moveTo(this.xCenter, this.yCenter), ctx.lineTo(position.x, position.y), ctx.stroke());
                        }
                        ctx.restore();
                    }
                }
                drawBorder() {}
                drawLabels() {
                    let offset, width;
                    const ctx = this.ctx, opts = this.options, tickOpts = opts.ticks;
                    if (!tickOpts.display) return;
                    const startAngle = this.getIndexAngle(0);
                    ctx.save(), ctx.translate(this.xCenter, this.yCenter), ctx.rotate(startAngle), ctx.textAlign = 'center', ctx.textBaseline = 'middle', this.ticks.forEach((tick, index)=>{
                        if (0 === index && !opts.reverse) return;
                        const optsAtIndex = tickOpts.setContext(this.getContext(index)), tickFont = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.O)(optsAtIndex.font);
                        if (offset = this.getDistanceFromCenterForValue(this.ticks[index].value), optsAtIndex.showLabelBackdrop) {
                            ctx.font = tickFont.string, width = ctx.measureText(tick.label).width, ctx.fillStyle = optsAtIndex.backdropColor;
                            const padding = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.K)(optsAtIndex.backdropPadding);
                            ctx.fillRect(-width / 2 - padding.left, -offset - tickFont.size / 2 - padding.top, width + padding.width, tickFont.size + padding.height);
                        }
                        (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.M)(ctx, tick.label, 0, -offset, tickFont, {
                            color: optsAtIndex.color
                        });
                    }), ctx.restore();
                }
                drawTitle() {}
            }
            RadialLinearScale.id = 'radialLinear', RadialLinearScale.defaults = {
                display: !0,
                animate: !0,
                position: 'chartArea',
                angleLines: {
                    display: !0,
                    lineWidth: 1,
                    borderDash: [],
                    borderDashOffset: 0.0
                },
                grid: {
                    circular: !1
                },
                startAngle: 0,
                ticks: {
                    showLabelBackdrop: !0,
                    callback: Ticks.formatters.numeric
                },
                pointLabels: {
                    backdropColor: void 0,
                    backdropPadding: 2,
                    display: !0,
                    font: {
                        size: 10
                    },
                    callback: (label)=>label,
                    padding: 5,
                    centerPointLabels: !1
                }
            }, RadialLinearScale.defaultRoutes = {
                'angleLines.color': 'borderColor',
                'pointLabels.color': 'color',
                'ticks.color': 'color'
            }, RadialLinearScale.descriptors = {
                angleLines: {
                    _fallback: 'grid'
                }
            };
            const INTERVALS = {
                millisecond: {
                    common: !0,
                    size: 1,
                    steps: 1000
                },
                second: {
                    common: !0,
                    size: 1000,
                    steps: 60
                },
                minute: {
                    common: !0,
                    size: 60000,
                    steps: 60
                },
                hour: {
                    common: !0,
                    size: 3600000,
                    steps: 24
                },
                day: {
                    common: !0,
                    size: 86400000,
                    steps: 30
                },
                week: {
                    common: !1,
                    size: 604800000,
                    steps: 4
                },
                month: {
                    common: !0,
                    size: 2.628e9,
                    steps: 12
                },
                quarter: {
                    common: !1,
                    size: 7.884e9,
                    steps: 4
                },
                year: {
                    common: !0,
                    size: 3.154e10
                }
            }, UNITS = Object.keys(INTERVALS);
            function sorter(a, b) {
                return a - b;
            }
            function parse(scale, input) {
                if ((0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.k)(input)) return null;
                const adapter = scale._adapter, { parser , round , isoWeekday  } = scale._parseOpts;
                let value = input;
                return ('function' == typeof parser && (value = parser(value)), (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.g)(value) || (value = 'string' == typeof parser ? adapter.parse(value, parser) : adapter.parse(value)), null === value) ? null : (round && (value = 'week' === round && ((0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.x)(isoWeekday) || !0 === isoWeekday) ? adapter.startOf(value, 'isoWeek', isoWeekday) : adapter.startOf(value, round)), +value);
            }
            function determineUnitForAutoTicks(minUnit, min, max, capacity) {
                const ilen = UNITS.length;
                for(let i = UNITS.indexOf(minUnit); i < ilen - 1; ++i){
                    const interval = INTERVALS[UNITS[i]], factor = interval.steps ? interval.steps : Number.MAX_SAFE_INTEGER;
                    if (interval.common && Math.ceil((max - min) / (factor * interval.size)) <= capacity) return UNITS[i];
                }
                return UNITS[ilen - 1];
            }
            function addTick(ticks, time, timestamps) {
                if (timestamps) {
                    if (timestamps.length) {
                        const { lo , hi  } = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.aO)(timestamps, time), timestamp = timestamps[lo] >= time ? timestamps[lo] : timestamps[hi];
                        ticks[timestamp] = !0;
                    }
                } else ticks[time] = !0;
            }
            function ticksFromTimestamps(scale, values, majorUnit) {
                let i, value;
                const ticks = [], map = {}, ilen = values.length;
                for(i = 0; i < ilen; ++i)map[value = values[i]] = i, ticks.push({
                    value,
                    major: !1
                });
                return 0 !== ilen && majorUnit ? function(scale, ticks, map, majorUnit) {
                    let major, index;
                    const adapter = scale._adapter, first = +adapter.startOf(ticks[0].value, majorUnit), last = ticks[ticks.length - 1].value;
                    for(major = first; major <= last; major = +adapter.add(major, 1, majorUnit))(index = map[major]) >= 0 && (ticks[index].major = !0);
                    return ticks;
                }(scale, ticks, map, majorUnit) : ticks;
            }
            class TimeScale extends Scale {
                constructor(props){
                    super(props), this._cache = {
                        data: [],
                        labels: [],
                        all: []
                    }, this._unit = 'day', this._majorUnit = void 0, this._offsets = {}, this._normalized = !1, this._parseOpts = void 0;
                }
                init(scaleOpts, opts) {
                    const time = scaleOpts.time || (scaleOpts.time = {}), adapter = this._adapter = new adapters._date(scaleOpts.adapters.date);
                    adapter.init(opts), (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.ac)(time.displayFormats, adapter.formats()), this._parseOpts = {
                        parser: time.parser,
                        round: time.round,
                        isoWeekday: time.isoWeekday
                    }, super.init(scaleOpts), this._normalized = opts.normalized;
                }
                parse(raw, index) {
                    return void 0 === raw ? null : parse(this, raw);
                }
                beforeLayout() {
                    super.beforeLayout(), this._cache = {
                        data: [],
                        labels: [],
                        all: []
                    };
                }
                determineDataLimits() {
                    const options = this.options, adapter = this._adapter, unit = options.time.unit || 'day';
                    let { min , max , minDefined , maxDefined  } = this.getUserBounds();
                    function _applyBounds(bounds) {
                        minDefined || isNaN(bounds.min) || (min = Math.min(min, bounds.min)), maxDefined || isNaN(bounds.max) || (max = Math.max(max, bounds.max));
                    }
                    minDefined && maxDefined || (_applyBounds(this._getLabelBounds()), ('ticks' !== options.bounds || 'labels' !== options.ticks.source) && _applyBounds(this.getMinMax(!1))), min = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.g)(min) && !isNaN(min) ? min : +adapter.startOf(Date.now(), unit), max = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.g)(max) && !isNaN(max) ? max : +adapter.endOf(Date.now(), unit) + 1, this.min = Math.min(min, max - 1), this.max = Math.max(min + 1, max);
                }
                _getLabelBounds() {
                    const arr = this.getLabelTimestamps();
                    let min = Number.POSITIVE_INFINITY, max = Number.NEGATIVE_INFINITY;
                    return arr.length && (min = arr[0], max = arr[arr.length - 1]), {
                        min,
                        max
                    };
                }
                buildTicks() {
                    const options = this.options, timeOpts = options.time, tickOpts = options.ticks, timestamps = 'labels' === tickOpts.source ? this.getLabelTimestamps() : this._generate();
                    'ticks' === options.bounds && timestamps.length && (this.min = this._userMin || timestamps[0], this.max = this._userMax || timestamps[timestamps.length - 1]);
                    const min = this.min, max = this.max, ticks = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.aN)(timestamps, min, max);
                    return this._unit = timeOpts.unit || (tickOpts.autoSkip ? determineUnitForAutoTicks(timeOpts.minUnit, this.min, this.max, this._getLabelCapacity(min)) : function(scale, numTicks, minUnit, min, max) {
                        for(let i = UNITS.length - 1; i >= UNITS.indexOf(minUnit); i--){
                            const unit = UNITS[i];
                            if (INTERVALS[unit].common && scale._adapter.diff(max, min, unit) >= numTicks - 1) return unit;
                        }
                        return UNITS[minUnit ? UNITS.indexOf(minUnit) : 0];
                    }(this, ticks.length, timeOpts.minUnit, this.min, this.max)), this._majorUnit = tickOpts.major.enabled && 'year' !== this._unit ? function(unit) {
                        for(let i = UNITS.indexOf(unit) + 1, ilen = UNITS.length; i < ilen; ++i)if (INTERVALS[UNITS[i]].common) return UNITS[i];
                    }(this._unit) : void 0, this.initOffsets(timestamps), options.reverse && ticks.reverse(), ticksFromTimestamps(this, ticks, this._majorUnit);
                }
                afterAutoSkip() {
                    this.options.offsetAfterAutoskip && this.initOffsets(this.ticks.map((tick)=>+tick.value));
                }
                initOffsets(timestamps) {
                    let first, last, start = 0, end = 0;
                    this.options.offset && timestamps.length && (first = this.getDecimalForValue(timestamps[0]), start = 1 === timestamps.length ? 1 - first : (this.getDecimalForValue(timestamps[1]) - first) / 2, last = this.getDecimalForValue(timestamps[timestamps.length - 1]), end = 1 === timestamps.length ? last : (last - this.getDecimalForValue(timestamps[timestamps.length - 2])) / 2);
                    const limit = timestamps.length < 3 ? 0.5 : 0.25;
                    start = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.E)(start, 0, limit), end = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.E)(end, 0, limit), this._offsets = {
                        start,
                        end,
                        factor: 1 / (start + 1 + end)
                    };
                }
                _generate() {
                    let time, count;
                    const adapter = this._adapter, min = this.min, max = this.max, options = this.options, timeOpts = options.time, minor = timeOpts.unit || determineUnitForAutoTicks(timeOpts.minUnit, min, max, this._getLabelCapacity(min)), stepSize = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.v)(timeOpts.stepSize, 1), weekday = 'week' === minor && timeOpts.isoWeekday, hasWeekday = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.x)(weekday) || !0 === weekday, ticks = {};
                    let first = min;
                    if (hasWeekday && (first = +adapter.startOf(first, 'isoWeek', weekday)), first = +adapter.startOf(first, hasWeekday ? 'day' : minor), adapter.diff(max, min, minor) > 100000 * stepSize) throw Error(min + ' and ' + max + ' are too far apart with stepSize of ' + stepSize + ' ' + minor);
                    const timestamps = 'data' === options.ticks.source && this.getDataTimestamps();
                    for(time = first, count = 0; time < max; time = +adapter.add(time, stepSize, minor), count++)addTick(ticks, time, timestamps);
                    return (time === max || 'ticks' === options.bounds || 1 === count) && addTick(ticks, time, timestamps), Object.keys(ticks).sort((a, b)=>a - b).map((x)=>+x);
                }
                getLabelForValue(value) {
                    const adapter = this._adapter, timeOpts = this.options.time;
                    return timeOpts.tooltipFormat ? adapter.format(value, timeOpts.tooltipFormat) : adapter.format(value, timeOpts.displayFormats.datetime);
                }
                _tickFormatFunction(time, index, ticks, format) {
                    const options = this.options, formats = options.time.displayFormats, unit = this._unit, majorUnit = this._majorUnit, minorFormat = unit && formats[unit], majorFormat = majorUnit && formats[majorUnit], tick = ticks[index], major = majorUnit && majorFormat && tick && tick.major, label = this._adapter.format(time, format || (major ? majorFormat : minorFormat)), formatter = options.ticks.callback;
                    return formatter ? (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.C)(formatter, [
                        label,
                        index,
                        ticks
                    ], this) : label;
                }
                generateTickLabels(ticks) {
                    let i, ilen, tick;
                    for(i = 0, ilen = ticks.length; i < ilen; ++i)(tick = ticks[i]).label = this._tickFormatFunction(tick.value, i, ticks);
                }
                getDecimalForValue(value) {
                    return null === value ? NaN : (value - this.min) / (this.max - this.min);
                }
                getPixelForValue(value) {
                    const offsets = this._offsets, pos = this.getDecimalForValue(value);
                    return this.getPixelForDecimal((offsets.start + pos) * offsets.factor);
                }
                getValueForPixel(pixel) {
                    const offsets = this._offsets, pos = this.getDecimalForPixel(pixel) / offsets.factor - offsets.end;
                    return this.min + pos * (this.max - this.min);
                }
                _getLabelSize(label) {
                    const ticksOpts = this.options.ticks, tickLabelWidth = this.ctx.measureText(label).width, angle = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.t)(this.isHorizontal() ? ticksOpts.maxRotation : ticksOpts.minRotation), cosRotation = Math.cos(angle), sinRotation = Math.sin(angle), tickFontSize = this._resolveTickFontOptions(0).size;
                    return {
                        w: tickLabelWidth * cosRotation + tickFontSize * sinRotation,
                        h: tickLabelWidth * sinRotation + tickFontSize * cosRotation
                    };
                }
                _getLabelCapacity(exampleTime) {
                    const timeOpts = this.options.time, displayFormats = timeOpts.displayFormats, format = displayFormats[timeOpts.unit] || displayFormats.millisecond, exampleLabel = this._tickFormatFunction(exampleTime, 0, ticksFromTimestamps(this, [
                        exampleTime
                    ], this._majorUnit), format), size = this._getLabelSize(exampleLabel), capacity = Math.floor(this.isHorizontal() ? this.width / size.w : this.height / size.h) - 1;
                    return capacity > 0 ? capacity : 1;
                }
                getDataTimestamps() {
                    let i, ilen, timestamps = this._cache.data || [];
                    if (timestamps.length) return timestamps;
                    const metas = this.getMatchingVisibleMetas();
                    if (this._normalized && metas.length) return this._cache.data = metas[0].controller.getAllParsedValues(this);
                    for(i = 0, ilen = metas.length; i < ilen; ++i)timestamps = timestamps.concat(metas[i].controller.getAllParsedValues(this));
                    return this._cache.data = this.normalize(timestamps);
                }
                getLabelTimestamps() {
                    let i, ilen;
                    const timestamps = this._cache.labels || [];
                    if (timestamps.length) return timestamps;
                    const labels = this.getLabels();
                    for(i = 0, ilen = labels.length; i < ilen; ++i)timestamps.push(parse(this, labels[i]));
                    return this._cache.labels = this._normalized ? timestamps : this.normalize(timestamps);
                }
                normalize(values) {
                    return (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__._)(values.sort(sorter));
                }
            }
            function interpolate(table, val, reverse) {
                let prevSource, nextSource, prevTarget, nextTarget, lo = 0, hi = table.length - 1;
                reverse ? (val >= table[lo].pos && val <= table[hi].pos && ({ lo , hi  } = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.Z)(table, 'pos', val)), { pos: prevSource , time: prevTarget  } = table[lo], { pos: nextSource , time: nextTarget  } = table[hi]) : (val >= table[lo].time && val <= table[hi].time && ({ lo , hi  } = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.Z)(table, 'time', val)), { time: prevSource , pos: prevTarget  } = table[lo], { time: nextSource , pos: nextTarget  } = table[hi]);
                const span = nextSource - prevSource;
                return span ? prevTarget + (nextTarget - prevTarget) * (val - prevSource) / span : prevTarget;
            }
            TimeScale.id = 'time', TimeScale.defaults = {
                bounds: 'data',
                adapters: {},
                time: {
                    parser: !1,
                    unit: !1,
                    round: !1,
                    isoWeekday: !1,
                    minUnit: 'millisecond',
                    displayFormats: {}
                },
                ticks: {
                    source: 'auto',
                    major: {
                        enabled: !1
                    }
                }
            };
            class TimeSeriesScale extends TimeScale {
                constructor(props){
                    super(props), this._table = [], this._minPos = void 0, this._tableRange = void 0;
                }
                initOffsets() {
                    const timestamps = this._getTimestampsForTable(), table = this._table = this.buildLookupTable(timestamps);
                    this._minPos = interpolate(table, this.min), this._tableRange = interpolate(table, this.max) - this._minPos, super.initOffsets(timestamps);
                }
                buildLookupTable(timestamps) {
                    let i, ilen, curr;
                    const { min , max  } = this, items = [], table = [];
                    for(i = 0, ilen = timestamps.length; i < ilen; ++i)(curr = timestamps[i]) >= min && curr <= max && items.push(curr);
                    if (items.length < 2) return [
                        {
                            time: min,
                            pos: 0
                        },
                        {
                            time: max,
                            pos: 1
                        }
                    ];
                    for(i = 0, ilen = items.length; i < ilen; ++i)Math.round((items[i + 1] + items[i - 1]) / 2) !== (curr = items[i]) && table.push({
                        time: curr,
                        pos: i / (ilen - 1)
                    });
                    return table;
                }
                _getTimestampsForTable() {
                    let timestamps = this._cache.all || [];
                    if (timestamps.length) return timestamps;
                    const data = this.getDataTimestamps(), label = this.getLabelTimestamps();
                    return timestamps = data.length && label.length ? this.normalize(data.concat(label)) : data.length ? data : label, timestamps = this._cache.all = timestamps;
                }
                getDecimalForValue(value) {
                    return (interpolate(this._table, value) - this._minPos) / this._tableRange;
                }
                getValueForPixel(pixel) {
                    const offsets = this._offsets, decimal = this.getDecimalForPixel(pixel) / offsets.factor - offsets.end;
                    return interpolate(this._table, decimal * this._tableRange + this._minPos, !0);
                }
            }
            TimeSeriesScale.id = 'timeseries', TimeSeriesScale.defaults = TimeScale.defaults;
            var scales = Object.freeze({
                __proto__: null,
                CategoryScale: CategoryScale,
                LinearScale: LinearScale,
                LogarithmicScale: LogarithmicScale,
                RadialLinearScale: RadialLinearScale,
                TimeScale: TimeScale,
                TimeSeriesScale: TimeSeriesScale
            });
            const registerables = [
                controllers,
                elements,
                plugins,
                scales
            ];
        }
    }
]);
