(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
    [
        180
    ],
    {
        9008: function(module, __unused_webpack_exports, __webpack_require__) {
            module.exports = __webpack_require__(5443);
        },
        5376: function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.d(__webpack_exports__, {
                kL: function() {
                    return Chart;
                }
            });
            var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7294);
            var chart_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6775);
            const defaultDatasetIdKey = 'label';
            function reforwardRef(ref, value) {
                if ('function' == typeof ref) ref(value);
                else if (ref) ref.current = value;
            }
            function setOptions(chart, nextOptions) {
                Object.assign(chart.options, nextOptions);
            }
            function setLabels(currentData, nextLabels) {
                currentData.labels = nextLabels;
            }
            function setDatasets(currentData, nextDatasets) {
                let datasetIdKey = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : defaultDatasetIdKey;
                const addedDatasets = [];
                currentData.datasets = nextDatasets.map((nextDataset)=>{
                    const currentDataset = currentData.datasets.find((dataset)=>dataset[datasetIdKey] === nextDataset[datasetIdKey]);
                    if (!currentDataset || !nextDataset.data || addedDatasets.includes(currentDataset)) {
                        return {
                            ...nextDataset
                        };
                    }
                    addedDatasets.push(currentDataset);
                    Object.assign(currentDataset, nextDataset);
                    return currentDataset;
                });
            }
            function cloneData(data) {
                let datasetIdKey = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : defaultDatasetIdKey;
                const nextData = {
                    labels: [],
                    datasets: []
                };
                setLabels(nextData, data.labels);
                setDatasets(nextData, data.datasets, datasetIdKey);
                return nextData;
            }
            function getDatasetAtEvent(chart, event) {
                return chart.getElementsAtEventForMode(event.nativeEvent, 'dataset', {
                    intersect: true
                }, false);
            }
            function getElementAtEvent(chart, event) {
                return chart.getElementsAtEventForMode(event.nativeEvent, 'nearest', {
                    intersect: true
                }, false);
            }
            function getElementsAtEvent(chart, event) {
                return chart.getElementsAtEventForMode(event.nativeEvent, 'index', {
                    intersect: true
                }, false);
            }
            function ChartComponent(param, ref) {
                let { height =150 , width =300 , redraw =false , datasetIdKey , type , data , options , plugins =[] , fallbackContent , updateMode , ...props } = param;
                const canvasRef = (0, react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
                const chartRef = (0, react__WEBPACK_IMPORTED_MODULE_0__.useRef)();
                const renderChart = ()=>{
                    if (!canvasRef.current) return;
                    chartRef.current = new chart_js__WEBPACK_IMPORTED_MODULE_1__.kL(canvasRef.current, {
                        type,
                        data: cloneData(data, datasetIdKey),
                        options: options && {
                            ...options
                        },
                        plugins
                    });
                    reforwardRef(ref, chartRef.current);
                };
                const destroyChart = ()=>{
                    reforwardRef(ref, null);
                    if (chartRef.current) {
                        chartRef.current.destroy();
                        chartRef.current = null;
                    }
                };
                (0, react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(()=>{
                    if (!redraw && chartRef.current && options) setOptions(chartRef.current, options);
                }, [
                    redraw,
                    options
                ]);
                (0, react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(()=>{
                    if (!redraw && chartRef.current) setLabels(chartRef.current.config.data, data.labels);
                }, [
                    redraw,
                    data.labels
                ]);
                (0, react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(()=>{
                    if (!redraw && chartRef.current && data.datasets) setDatasets(chartRef.current.config.data, data.datasets, datasetIdKey);
                }, [
                    redraw,
                    data.datasets
                ]);
                (0, react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(()=>{
                    if (!chartRef.current) return;
                    if (redraw) {
                        destroyChart();
                        setTimeout(renderChart);
                    } else {
                        chartRef.current.update(updateMode);
                    }
                }, [
                    redraw,
                    options,
                    data.labels,
                    data.datasets,
                    updateMode
                ]);
                (0, react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(()=>{
                    if (!chartRef.current) return;
                    destroyChart();
                    setTimeout(renderChart);
                }, [
                    type
                ]);
                (0, react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(()=>{
                    renderChart();
                    return ()=>destroyChart();
                }, []);
                return react__WEBPACK_IMPORTED_MODULE_0__.createElement("canvas", Object.assign({
                    ref: canvasRef,
                    role: "img",
                    height: height,
                    width: width
                }, props), fallbackContent);
            }
            const Chart = (0, react__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(ChartComponent);
            function createTypedChart(type, registerables) {
                Chart$1.register(registerables);
                return forwardRef((props, ref)=>React.createElement(Chart, Object.assign({}, props, {
                        ref: ref,
                        type: type
                    })));
            }
            const Line = null;
            const Bar = null;
            const Radar = null;
            const Doughnut = null;
            const PolarArea = null;
            const Bubble = null;
            const Pie = null;
            const Scatter = null;
        },
        9217: function(__unused_webpack___webpack_module__, __unused_webpack___webpack_exports__, __webpack_require__) {
            "use strict";
            var _dist_chart_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6775);
            _dist_chart_mjs__WEBPACK_IMPORTED_MODULE_0__.kL.register(..._dist_chart_mjs__WEBPACK_IMPORTED_MODULE_0__.zX);
            var __WEBPACK_DEFAULT_EXPORT__ = null;
        },
        2454: function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {
            "use strict";
            let names;
            __webpack_require__.d(__webpack_exports__, {
                $: function() {
                    return _isPointInArea;
                },
                A: function() {
                    return _factorize;
                },
                B: function() {
                    return finiteOrDefault;
                },
                C: function() {
                    return callback;
                },
                D: function() {
                    return _addGrace;
                },
                E: function() {
                    return _limitValue;
                },
                F: function() {
                    return toDegrees;
                },
                G: function() {
                    return _measureText;
                },
                H: function() {
                    return HALF_PI;
                },
                I: function() {
                    return _int16Range;
                },
                J: function() {
                    return _alignPixel;
                },
                K: function() {
                    return toPadding;
                },
                L: function() {
                    return clipArea;
                },
                M: function() {
                    return renderText;
                },
                N: function() {
                    return unclipArea;
                },
                O: function() {
                    return toFont;
                },
                P: function() {
                    return PI;
                },
                Q: function() {
                    return each;
                },
                R: function() {
                    return _toLeftRightCenter;
                },
                S: function() {
                    return _alignStartEnd;
                },
                T: function() {
                    return TAU;
                },
                U: function() {
                    return overrides;
                },
                V: function() {
                    return merge;
                },
                W: function() {
                    return _capitalize;
                },
                X: function() {
                    return getRelativePosition;
                },
                Y: function() {
                    return _rlookupByKey;
                },
                Z: function() {
                    return _lookupByKey;
                },
                _: function() {
                    return _arrayUnique;
                },
                a: function() {
                    return resolve;
                },
                a0: function() {
                    return getAngleFromPoint;
                },
                a1: function() {
                    return getMaximumSize;
                },
                a2: function() {
                    return _getParentNode;
                },
                a3: function() {
                    return readUsedSize;
                },
                a4: function() {
                    return throttled;
                },
                a5: function() {
                    return supportsEventListenerOptions;
                },
                a6: function() {
                    return _isDomSupported;
                },
                a7: function() {
                    return descriptors;
                },
                a8: function() {
                    return isFunction;
                },
                a9: function() {
                    return _attachContext;
                },
                aA: function() {
                    return getRtlAdapter;
                },
                aB: function() {
                    return overrideTextDirection;
                },
                aC: function() {
                    return _textX;
                },
                aD: function() {
                    return restoreTextDirection;
                },
                aE: function() {
                    return drawPointLegend;
                },
                aF: function() {
                    return noop;
                },
                aG: function() {
                    return distanceBetweenPoints;
                },
                aH: function() {
                    return _setMinAndMaxByKey;
                },
                aI: function() {
                    return niceNum;
                },
                aJ: function() {
                    return almostWhole;
                },
                aK: function() {
                    return almostEquals;
                },
                aL: function() {
                    return _decimalPlaces;
                },
                aM: function() {
                    return _longestText;
                },
                aN: function() {
                    return _filterBetween;
                },
                aO: function() {
                    return _lookup;
                },
                aa: function() {
                    return _createResolver;
                },
                ab: function() {
                    return _descriptors;
                },
                ac: function() {
                    return mergeIf;
                },
                ad: function() {
                    return uid;
                },
                ae: function() {
                    return debounce;
                },
                af: function() {
                    return retinaScale;
                },
                ag: function() {
                    return clearCanvas;
                },
                ah: function() {
                    return setsEqual;
                },
                ai: function() {
                    return _elementsEqual;
                },
                aj: function() {
                    return _isClickEvent;
                },
                ak: function() {
                    return _isBetween;
                },
                al: function() {
                    return _readValueToProps;
                },
                am: function() {
                    return _updateBezierControlPoints;
                },
                an: function() {
                    return _computeSegments;
                },
                ao: function() {
                    return _boundSegments;
                },
                ap: function() {
                    return _steppedInterpolation;
                },
                aq: function() {
                    return _bezierInterpolation;
                },
                ar: function() {
                    return _pointInLine;
                },
                as: function() {
                    return _steppedLineTo;
                },
                at: function() {
                    return _bezierCurveTo;
                },
                au: function() {
                    return drawPoint;
                },
                av: function() {
                    return addRoundedRectPath;
                },
                aw: function() {
                    return toTRBL;
                },
                ax: function() {
                    return toTRBLCorners;
                },
                ay: function() {
                    return _boundSegment;
                },
                az: function() {
                    return _normalizeAngle;
                },
                b: function() {
                    return isArray;
                },
                c: function() {
                    return color;
                },
                d: function() {
                    return defaults;
                },
                e: function() {
                    return effects;
                },
                f: function() {
                    return resolveObjectKey;
                },
                g: function() {
                    return isNumberFinite;
                },
                h: function() {
                    return createContext;
                },
                i: function() {
                    return isObject;
                },
                j: function() {
                    return defined;
                },
                k: function() {
                    return isNullOrUndef;
                },
                l: function() {
                    return listenArrayEvents;
                },
                m: function() {
                    return toPercentage;
                },
                n: function() {
                    return toDimension;
                },
                o: function() {
                    return formatNumber;
                },
                p: function() {
                    return _angleBetween;
                },
                q: function() {
                    return _getStartAndCountOfVisiblePoints;
                },
                r: function() {
                    return requestAnimFrame;
                },
                s: function() {
                    return sign;
                },
                t: function() {
                    return toRadians;
                },
                u: function() {
                    return unlistenArrayEvents;
                },
                v: function() {
                    return valueOrDefault;
                },
                w: function() {
                    return _scaleRangesChanged;
                },
                x: function() {
                    return isNumber;
                },
                y: function() {
                    return _parseObjectDataRadialScale;
                },
                z: function() {
                    return log10;
                }
            });
            function noop() {}
            const uid = function() {
                let id = 0;
                return function() {
                    return id++;
                };
            }();
            function isNullOrUndef(value) {
                return null == value;
            }
            function isArray(value) {
                if (Array.isArray && Array.isArray(value)) {
                    return true;
                }
                const type = Object.prototype.toString.call(value);
                if ('[object' === type.slice(0, 7) && 'Array]' === type.slice(-6)) {
                    return true;
                }
                return false;
            }
            function isObject(value) {
                return null !== value && '[object Object]' === Object.prototype.toString.call(value);
            }
            const isNumberFinite = (value)=>('number' == typeof value || value instanceof Number) && isFinite(+value);
            function finiteOrDefault(value, defaultValue) {
                return isNumberFinite(value) ? value : defaultValue;
            }
            function valueOrDefault(value, defaultValue) {
                return void 0 === value ? defaultValue : value;
            }
            const toPercentage = (value, dimension)=>'string' == typeof value && value.endsWith('%') ? parseFloat(value) / 100 : value / dimension;
            const toDimension = (value, dimension)=>'string' == typeof value && value.endsWith('%') ? parseFloat(value) / 100 * dimension : +value;
            function callback(fn, args, thisArg) {
                if (fn && 'function' == typeof fn.call) {
                    return fn.apply(thisArg, args);
                }
            }
            function each(loopable, fn, thisArg, reverse) {
                let i, len, keys;
                if (isArray(loopable)) {
                    len = loopable.length;
                    if (reverse) {
                        for(i = len - 1; i >= 0; i--)fn.call(thisArg, loopable[i], i);
                    } else {
                        for(i = 0; i < len; i++)fn.call(thisArg, loopable[i], i);
                    }
                } else if (isObject(loopable)) {
                    keys = Object.keys(loopable);
                    len = keys.length;
                    for(i = 0; i < len; i++)fn.call(thisArg, loopable[keys[i]], keys[i]);
                }
            }
            function _elementsEqual(a0, a1) {
                let i, ilen, v0, v1;
                if (!a0 || !a1 || a0.length !== a1.length) {
                    return false;
                }
                for(i = 0, ilen = a0.length; i < ilen; ++i){
                    v0 = a0[i];
                    v1 = a1[i];
                    if (v0.datasetIndex !== v1.datasetIndex || v0.index !== v1.index) {
                        return false;
                    }
                }
                return true;
            }
            function clone$1(source) {
                if (isArray(source)) {
                    return source.map(clone$1);
                }
                if (isObject(source)) {
                    const target = Object.create(null);
                    const keys = Object.keys(source);
                    const klen = keys.length;
                    let k = 0;
                    for(; k < klen; ++k)target[keys[k]] = clone$1(source[keys[k]]);
                    return target;
                }
                return source;
            }
            function isValidKey(key) {
                return -1 === [
                    '__proto__',
                    'prototype',
                    'constructor'
                ].indexOf(key);
            }
            function _merger(key, target, source, options) {
                if (!isValidKey(key)) {
                    return;
                }
                const tval = target[key];
                const sval = source[key];
                if (isObject(tval) && isObject(sval)) merge(tval, sval, options);
                else target[key] = clone$1(sval);
            }
            function merge(target, source, options) {
                const sources = isArray(source) ? source : [
                    source
                ];
                const ilen = sources.length;
                if (!isObject(target)) {
                    return target;
                }
                options = options || {};
                const merger = options.merger || _merger;
                for(let i = 0; i < ilen; ++i){
                    source = sources[i];
                    if (!isObject(source)) {
                        continue;
                    }
                    const keys = Object.keys(source);
                    for(let k = 0, klen = keys.length; k < klen; ++k)merger(keys[k], target, source, options);
                }
                return target;
            }
            function mergeIf(target, source) {
                return merge(target, source, {
                    merger: _mergerIf
                });
            }
            function _mergerIf(key, target, source) {
                if (!isValidKey(key)) {
                    return;
                }
                const tval = target[key];
                const sval = source[key];
                if (isObject(tval) && isObject(sval)) mergeIf(tval, sval);
                else if (!Object.prototype.hasOwnProperty.call(target, key)) target[key] = clone$1(sval);
            }
            function _deprecated(scope, value, previous, current) {
                if (void 0 !== value) console.warn(scope + ': "' + previous + '" is deprecated. Please use "' + current + '" instead');
            }
            const keyResolvers = {
                '': (v)=>v,
                x: (o)=>o.x,
                y: (o)=>o.y
            };
            function resolveObjectKey(obj, key) {
                const resolver = keyResolvers[key] || (keyResolvers[key] = _getKeyResolver(key));
                return resolver(obj);
            }
            function _getKeyResolver(key) {
                const keys = _splitKey(key);
                return (obj)=>{
                    for (const k of keys){
                        if ('' === k) {
                            break;
                        }
                        obj = obj && obj[k];
                    }
                    return obj;
                };
            }
            function _splitKey(key) {
                const parts = key.split('.');
                const keys = [];
                let tmp = '';
                for (const part of parts){
                    tmp += part;
                    if (tmp.endsWith('\\')) tmp = tmp.slice(0, -1) + '.';
                    else {
                        keys.push(tmp);
                        tmp = '';
                    }
                }
                return keys;
            }
            function _capitalize(str) {
                return str.charAt(0).toUpperCase() + str.slice(1);
            }
            const defined = (value)=>void 0 !== value;
            const isFunction = (value)=>'function' == typeof value;
            const setsEqual = (a, b)=>{
                if (a.size !== b.size) {
                    return false;
                }
                for (const item of a)if (!b.has(item)) {
                    return false;
                }
                return true;
            };
            function _isClickEvent(e) {
                return 'mouseup' === e.type || 'click' === e.type || 'contextmenu' === e.type;
            }
            const PI = Math.PI;
            const TAU = 2 * PI;
            const PITAU = TAU + PI;
            const INFINITY = Number.POSITIVE_INFINITY;
            const RAD_PER_DEG = PI / 180;
            const HALF_PI = PI / 2;
            const QUARTER_PI = PI / 4;
            const TWO_THIRDS_PI = 2 * PI / 3;
            const log10 = Math.log10;
            const sign = Math.sign;
            function niceNum(range) {
                const roundedRange = Math.round(range);
                range = almostEquals(range, roundedRange, range / 1000) ? roundedRange : range;
                const niceRange = Math.pow(10, Math.floor(log10(range)));
                const fraction = range / niceRange;
                return (fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10) * niceRange;
            }
            function _factorize(value) {
                let i;
                const result = [];
                const sqrt = Math.sqrt(value);
                for(i = 1; i < sqrt; i++)if (value % i === 0) {
                    result.push(i);
                    result.push(value / i);
                }
                if (sqrt === (0 | sqrt)) result.push(sqrt);
                result.sort((a, b)=>a - b).pop();
                return result;
            }
            function isNumber(n) {
                return !isNaN(parseFloat(n)) && isFinite(n);
            }
            function almostEquals(x, y, epsilon) {
                return Math.abs(x - y) < epsilon;
            }
            function almostWhole(x, epsilon) {
                const rounded = Math.round(x);
                return rounded - epsilon <= x && rounded + epsilon >= x;
            }
            function _setMinAndMaxByKey(array, target, property) {
                let i, ilen, value;
                for(i = 0, ilen = array.length; i < ilen; i++){
                    value = array[i][property];
                    if (!isNaN(value)) {
                        target.min = Math.min(target.min, value);
                        target.max = Math.max(target.max, value);
                    }
                }
            }
            function toRadians(degrees) {
                return degrees * (PI / 180);
            }
            function toDegrees(radians) {
                return radians * (180 / PI);
            }
            function _decimalPlaces(x) {
                if (!isNumberFinite(x)) {
                    return;
                }
                let e = 1;
                let p = 0;
                while(Math.round(x * e) / e !== x){
                    e *= 10;
                    p++;
                }
                return p;
            }
            function getAngleFromPoint(centrePoint, anglePoint) {
                const distanceFromXCenter = anglePoint.x - centrePoint.x;
                const distanceFromYCenter = anglePoint.y - centrePoint.y;
                let angle = Math.atan2(distanceFromYCenter, distanceFromXCenter);
                if (angle < -0.5 * PI) angle += TAU;
                return {
                    angle,
                    distance: Math.sqrt(distanceFromXCenter * distanceFromXCenter + distanceFromYCenter * distanceFromYCenter)
                };
            }
            function distanceBetweenPoints(pt1, pt2) {
                return Math.sqrt(Math.pow(pt2.x - pt1.x, 2) + Math.pow(pt2.y - pt1.y, 2));
            }
            function _angleDiff(a, b) {
                return (a - b + PITAU) % TAU - PI;
            }
            function _normalizeAngle(a) {
                return (a % TAU + TAU) % TAU;
            }
            function _angleBetween(angle, start, end, sameAngleIsFullCircle) {
                const a = _normalizeAngle(angle);
                const s = _normalizeAngle(start);
                const e = _normalizeAngle(end);
                const angleToStart = _normalizeAngle(s - a);
                const angleToEnd = _normalizeAngle(e - a);
                const startToAngle = _normalizeAngle(a - s);
                const endToAngle = _normalizeAngle(a - e);
                return a === s || a === e || sameAngleIsFullCircle && s === e || angleToStart > angleToEnd && startToAngle < endToAngle;
            }
            function _limitValue(value, min, max) {
                return Math.max(min, Math.min(max, value));
            }
            function _int16Range(value) {
                return _limitValue(value, -32768, 32767);
            }
            function _isBetween(value, start, end, epsilon = 1e-6) {
                return value >= Math.min(start, end) - epsilon && value <= Math.max(start, end) + epsilon;
            }
            function _lookup(table, value, cmp) {
                let mid;
                cmp = cmp || ((index)=>table[index] < value);
                let hi = table.length - 1;
                let lo = 0;
                while(hi - lo > 1){
                    mid = lo + hi >> 1;
                    if (cmp(mid)) lo = mid;
                    else hi = mid;
                }
                return {
                    lo,
                    hi
                };
            }
            const _lookupByKey = (table, key, value, last)=>_lookup(table, value, last ? (index)=>table[index][key] <= value : (index)=>table[index][key] < value);
            const _rlookupByKey = (table, key, value)=>_lookup(table, value, (index)=>table[index][key] >= value);
            function _filterBetween(values, min, max) {
                let start = 0;
                let end = values.length;
                while(start < end && values[start] < min){
                    start++;
                }
                while(end > start && values[end - 1] > max){
                    end--;
                }
                return start > 0 || end < values.length ? values.slice(start, end) : values;
            }
            const arrayEvents = [
                'push',
                'pop',
                'shift',
                'splice',
                'unshift'
            ];
            function listenArrayEvents(array, listener) {
                if (array._chartjs) {
                    array._chartjs.listeners.push(listener);
                    return;
                }
                Object.defineProperty(array, '_chartjs', {
                    configurable: true,
                    enumerable: false,
                    value: {
                        listeners: [
                            listener
                        ]
                    }
                });
                arrayEvents.forEach((key)=>{
                    const method = '_onData' + _capitalize(key);
                    const base = array[key];
                    Object.defineProperty(array, key, {
                        configurable: true,
                        enumerable: false,
                        value (...args) {
                            const res = base.apply(this, args);
                            array._chartjs.listeners.forEach((object)=>{
                                if ('function' == typeof object[method]) object[method](...args);
                            });
                            return res;
                        }
                    });
                });
            }
            function unlistenArrayEvents(array, listener) {
                const stub = array._chartjs;
                if (!stub) {
                    return;
                }
                const listeners = stub.listeners;
                const index = listeners.indexOf(listener);
                if (-1 !== index) listeners.splice(index, 1);
                if (listeners.length > 0) {
                    return;
                }
                arrayEvents.forEach((key)=>{
                    delete array[key];
                });
                delete array._chartjs;
            }
            function _arrayUnique(items) {
                let i, ilen;
                const set = new Set();
                for(i = 0, ilen = items.length; i < ilen; ++i)set.add(items[i]);
                if (set.size === ilen) {
                    return items;
                }
                return Array.from(set);
            }
            function fontString(pixelSize, fontStyle, fontFamily) {
                return fontStyle + ' ' + pixelSize + 'px ' + fontFamily;
            }
            const requestAnimFrame = function() {
                if ('undefined' == typeof window) {
                    return function(callback) {
                        return callback();
                    };
                }
                return window.requestAnimationFrame;
            }();
            function throttled(fn, thisArg, updateFn) {
                const updateArgs = updateFn || ((args)=>Array.prototype.slice.call(args));
                let ticking = false;
                let args = [];
                return function(...rest) {
                    args = updateArgs(rest);
                    if (!ticking) {
                        ticking = true;
                        requestAnimFrame.call(window, ()=>{
                            ticking = false;
                            fn.apply(thisArg, args);
                        });
                    }
                };
            }
            function debounce(fn, delay) {
                let timeout;
                return function(...args) {
                    if (delay) {
                        clearTimeout(timeout);
                        timeout = setTimeout(fn, delay, args);
                    } else {
                        fn.apply(this, args);
                    }
                    return delay;
                };
            }
            const _toLeftRightCenter = (align)=>'start' === align ? 'left' : 'end' === align ? 'right' : 'center';
            const _alignStartEnd = (align, start, end)=>'start' === align ? start : 'end' === align ? end : (start + end) / 2;
            const _textX = (align, left, right, rtl)=>{
                return align === (rtl ? 'left' : 'right') ? right : 'center' === align ? (left + right) / 2 : left;
            };
            function _getStartAndCountOfVisiblePoints(meta, points, animationsDisabled) {
                const pointCount = points.length;
                let start = 0;
                let count = pointCount;
                if (meta._sorted) {
                    const { iScale , _parsed  } = meta;
                    const axis = iScale.axis;
                    const { min , max , minDefined , maxDefined  } = iScale.getUserBounds();
                    if (minDefined) start = _limitValue(Math.min(_lookupByKey(_parsed, iScale.axis, min).lo, animationsDisabled ? pointCount : _lookupByKey(points, axis, iScale.getPixelForValue(min)).lo), 0, pointCount - 1);
                    count = maxDefined ? _limitValue(Math.max(_lookupByKey(_parsed, iScale.axis, max, true).hi + 1, animationsDisabled ? 0 : _lookupByKey(points, axis, iScale.getPixelForValue(max), true).hi + 1), start, pointCount) - start : pointCount - start;
                }
                return {
                    start,
                    count
                };
            }
            function _scaleRangesChanged(meta) {
                const { xScale , yScale , _scaleRanges  } = meta;
                const newRanges = {
                    xmin: xScale.min,
                    xmax: xScale.max,
                    ymin: yScale.min,
                    ymax: yScale.max
                };
                if (!_scaleRanges) {
                    meta._scaleRanges = newRanges;
                    return true;
                }
                const changed = _scaleRanges.xmin !== xScale.min || _scaleRanges.xmax !== xScale.max || _scaleRanges.ymin !== yScale.min || _scaleRanges.ymax !== yScale.max;
                Object.assign(_scaleRanges, newRanges);
                return changed;
            }
            const atEdge = (t)=>0 === t || 1 === t;
            const elasticIn = (t, s, p)=>-(Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * TAU / p));
            const elasticOut = (t, s, p)=>Math.pow(2, -10 * t) * Math.sin((t - s) * TAU / p) + 1;
            const effects = {
                linear: (t)=>t,
                easeInQuad: (t)=>t * t,
                easeOutQuad: (t)=>-t * (t - 2),
                easeInOutQuad: (t)=>(t /= 0.5) < 1 ? 0.5 * t * t : -0.5 * (--t * (t - 2) - 1),
                easeInCubic: (t)=>t * t * t,
                easeOutCubic: (t)=>(t -= 1) * t * t + 1,
                easeInOutCubic: (t)=>(t /= 0.5) < 1 ? 0.5 * t * t * t : 0.5 * ((t -= 2) * t * t + 2),
                easeInQuart: (t)=>t * t * t * t,
                easeOutQuart: (t)=>-((t -= 1) * t * t * t - 1),
                easeInOutQuart: (t)=>(t /= 0.5) < 1 ? 0.5 * t * t * t * t : -0.5 * ((t -= 2) * t * t * t - 2),
                easeInQuint: (t)=>t * t * t * t * t,
                easeOutQuint: (t)=>(t -= 1) * t * t * t * t + 1,
                easeInOutQuint: (t)=>(t /= 0.5) < 1 ? 0.5 * t * t * t * t * t : 0.5 * ((t -= 2) * t * t * t * t + 2),
                easeInSine: (t)=>-Math.cos(t * HALF_PI) + 1,
                easeOutSine: (t)=>Math.sin(t * HALF_PI),
                easeInOutSine: (t)=>-0.5 * (Math.cos(PI * t) - 1),
                easeInExpo: (t)=>0 === t ? 0 : Math.pow(2, 10 * (t - 1)),
                easeOutExpo: (t)=>1 === t ? 1 : -Math.pow(2, -10 * t) + 1,
                easeInOutExpo: (t)=>atEdge(t) ? t : t < 0.5 ? 0.5 * Math.pow(2, 10 * (2 * t - 1)) : 0.5 * (-Math.pow(2, -10 * (2 * t - 1)) + 2),
                easeInCirc: (t)=>t >= 1 ? t : -(Math.sqrt(1 - t * t) - 1),
                easeOutCirc: (t)=>Math.sqrt(1 - (t -= 1) * t),
                easeInOutCirc: (t)=>(t /= 0.5) < 1 ? -0.5 * (Math.sqrt(1 - t * t) - 1) : 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1),
                easeInElastic: (t)=>atEdge(t) ? t : elasticIn(t, 0.075, 0.3),
                easeOutElastic: (t)=>atEdge(t) ? t : elasticOut(t, 0.075, 0.3),
                easeInOutElastic (t) {
                    const s = 0.1125;
                    const p = 0.45;
                    return atEdge(t) ? t : t < 0.5 ? 0.5 * elasticIn(2 * t, s, p) : 0.5 + 0.5 * elasticOut(2 * t - 1, s, p);
                },
                easeInBack (t) {
                    const s = 1.70158;
                    return t * t * ((s + 1) * t - s);
                },
                easeOutBack (t) {
                    const s = 1.70158;
                    return (t -= 1) * t * ((s + 1) * t + s) + 1;
                },
                easeInOutBack (t) {
                    let s = 1.70158;
                    if ((t /= 0.5) < 1) {
                        return 0.5 * (t * t * (((s *= 1.525) + 1) * t - s));
                    }
                    return 0.5 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2);
                },
                easeInBounce: (t)=>1 - effects.easeOutBounce(1 - t),
                easeOutBounce (t) {
                    const m = 7.5625;
                    const d = 2.75;
                    if (t < 1 / d) {
                        return m * t * t;
                    }
                    if (t < 2 / d) {
                        return m * (t -= 1.5 / d) * t + 0.75;
                    }
                    if (t < 2.5 / d) {
                        return m * (t -= 2.25 / d) * t + 0.9375;
                    }
                    return m * (t -= 2.625 / d) * t + 0.984375;
                },
                easeInOutBounce: (t)=>t < 0.5 ? 0.5 * effects.easeInBounce(2 * t) : 0.5 * effects.easeOutBounce(2 * t - 1) + 0.5
            };
            function round(v) {
                return v + 0.5 | 0;
            }
            const lim = (v, l, h)=>Math.max(Math.min(v, h), l);
            function p2b(v) {
                return lim(round(2.55 * v), 0, 255);
            }
            function n2b(v) {
                return lim(round(255 * v), 0, 255);
            }
            function b2n(v) {
                return lim(round(v / 2.55) / 100, 0, 1);
            }
            function n2p(v) {
                return lim(round(100 * v), 0, 100);
            }
            const map$1 = {
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
            const hex = [
                ...'0123456789ABCDEF'
            ];
            const h1 = (b)=>hex[0xF & b];
            const h2 = (b)=>hex[(0xF0 & b) >> 4] + hex[0xF & b];
            const eq = (b)=>(0xF0 & b) >> 4 === (0xF & b);
            const isShort = (v)=>eq(v.r) && eq(v.g) && eq(v.b) && eq(v.a);
            function hexParse(str) {
                var ret, len = str.length;
                if ('#' === str[0]) {
                    if (4 === len || 5 === len) ret = {
                        r: 255 & 17 * map$1[str[1]],
                        g: 255 & 17 * map$1[str[2]],
                        b: 255 & 17 * map$1[str[3]],
                        a: 5 === len ? 17 * map$1[str[4]] : 255
                    };
                    else if (7 === len || 9 === len) ret = {
                        r: map$1[str[1]] << 4 | map$1[str[2]],
                        g: map$1[str[3]] << 4 | map$1[str[4]],
                        b: map$1[str[5]] << 4 | map$1[str[6]],
                        a: 9 === len ? map$1[str[7]] << 4 | map$1[str[8]] : 255
                    };
                }
                return ret;
            }
            const alpha = (a, f)=>a < 255 ? f(a) : '';
            function hexString(v) {
                var f = isShort(v) ? h1 : h2;
                return v ? '#' + f(v.r) + f(v.g) + f(v.b) + alpha(v.a, f) : void 0;
            }
            const HUE_RE = /^(hsla?|hwb|hsv)\(\s*([-+.e\d]+)(?:deg)?[\s,]+([-+.e\d]+)%[\s,]+([-+.e\d]+)%(?:[\s,]+([-+.e\d]+)(%)?)?\s*\)$/;
            function hsl2rgbn(h, s, l) {
                const a = s * Math.min(l, 1 - l);
                const f = (n, k = (n + h / 30) % 12)=>l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
                return [
                    f(0),
                    f(8),
                    f(4)
                ];
            }
            function hsv2rgbn(h, s, v) {
                const f = (n, k = (n + h / 60) % 6)=>v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
                return [
                    f(5),
                    f(3),
                    f(1)
                ];
            }
            function hwb2rgbn(h, w, b) {
                let i;
                const rgb = hsl2rgbn(h, 1, 0.5);
                if (w + b > 1) {
                    i = 1 / (w + b);
                    w *= i;
                    b *= i;
                }
                for(i = 0; i < 3; i++){
                    rgb[i] *= 1 - w - b;
                    rgb[i] += w;
                }
                return rgb;
            }
            function hueValue(r, g, b, d, max) {
                if (r === max) {
                    return (g - b) / d + (g < b ? 6 : 0);
                }
                if (g === max) {
                    return (b - r) / d + 2;
                }
                return (r - g) / d + 4;
            }
            function rgb2hsl(v) {
                let h, s, d;
                const range = 255;
                const r = v.r / range;
                const g = v.g / range;
                const b = v.b / range;
                const max = Math.max(r, g, b);
                const min = Math.min(r, g, b);
                const l = (max + min) / 2;
                if (max !== min) {
                    d = max - min;
                    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                    h = hueValue(r, g, b, d, max);
                    h = 60 * h + 0.5;
                }
                return [
                    0 | h,
                    s || 0,
                    l
                ];
            }
            function calln(f, a, b, c) {
                return (Array.isArray(a) ? f(a[0], a[1], a[2]) : f(a, b, c)).map(n2b);
            }
            function hsl2rgb(h, s, l) {
                return calln(hsl2rgbn, h, s, l);
            }
            function hwb2rgb(h, w, b) {
                return calln(hwb2rgbn, h, w, b);
            }
            function hsv2rgb(h, s, v) {
                return calln(hsv2rgbn, h, s, v);
            }
            function hue(h) {
                return (h % 360 + 360) % 360;
            }
            function hueParse(str) {
                let v;
                const m = HUE_RE.exec(str);
                let a = 255;
                if (!m) {
                    return;
                }
                if (m[5] !== v) a = m[6] ? p2b(+m[5]) : n2b(+m[5]);
                const h = hue(+m[2]);
                const p1 = +m[3] / 100;
                const p2 = +m[4] / 100;
                v = 'hwb' === m[1] ? hwb2rgb(h, p1, p2) : 'hsv' === m[1] ? hsv2rgb(h, p1, p2) : hsl2rgb(h, p1, p2);
                return {
                    r: v[0],
                    g: v[1],
                    b: v[2],
                    a: a
                };
            }
            function rotate(v, deg) {
                var h = rgb2hsl(v);
                h[0] = hue(h[0] + deg);
                h = hsl2rgb(h);
                v.r = h[0];
                v.g = h[1];
                v.b = h[2];
            }
            function hslString(v) {
                if (!v) {
                    return;
                }
                const a = rgb2hsl(v);
                const h = a[0];
                const s = n2p(a[1]);
                const l = n2p(a[2]);
                return v.a < 255 ? `hsla(${h}, ${s}%, ${l}%, ${b2n(v.a)})` : `hsl(${h}, ${s}%, ${l}%)`;
            }
            const map = {
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
            const names$1 = {
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
            function unpack() {
                let i, j, k, ok, nk;
                const unpacked = {};
                const keys = Object.keys(names$1);
                const tkeys = Object.keys(map);
                for(i = 0; i < keys.length; i++){
                    ok = nk = keys[i];
                    for(j = 0; j < tkeys.length; j++){
                        k = tkeys[j];
                        nk = nk.replace(k, map[k]);
                    }
                    k = parseInt(names$1[ok], 16);
                    unpacked[nk] = [
                        k >> 16 & 0xFF,
                        k >> 8 & 0xFF,
                        0xFF & k
                    ];
                }
                return unpacked;
            }
            function nameParse(str) {
                if (!names) {
                    names = unpack();
                    names.transparent = [
                        0,
                        0,
                        0,
                        0
                    ];
                }
                const a = names[str.toLowerCase()];
                return a && {
                    r: a[0],
                    g: a[1],
                    b: a[2],
                    a: 4 === a.length ? a[3] : 255
                };
            }
            const RGB_RE = /^rgba?\(\s*([-+.\d]+)(%)?[\s,]+([-+.e\d]+)(%)?[\s,]+([-+.e\d]+)(%)?(?:[\s,/]+([-+.e\d]+)(%)?)?\s*\)$/;
            function rgbParse(str) {
                let r, g, b;
                const m = RGB_RE.exec(str);
                let a = 255;
                if (!m) {
                    return;
                }
                if (m[7] !== r) {
                    const v = +m[7];
                    a = m[8] ? p2b(v) : lim(255 * v, 0, 255);
                }
                r = +m[1];
                g = +m[3];
                b = +m[5];
                r = 255 & (m[2] ? p2b(r) : lim(r, 0, 255));
                g = 255 & (m[4] ? p2b(g) : lim(g, 0, 255));
                b = 255 & (m[6] ? p2b(b) : lim(b, 0, 255));
                return {
                    r: r,
                    g: g,
                    b: b,
                    a: a
                };
            }
            function rgbString(v) {
                return v && (v.a < 255 ? `rgba(${v.r}, ${v.g}, ${v.b}, ${b2n(v.a)})` : `rgb(${v.r}, ${v.g}, ${v.b})`);
            }
            const to = (v)=>v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1.0 / 2.4) - 0.055;
            const from = (v)=>v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
            function interpolate(rgb1, rgb2, t) {
                const r = from(b2n(rgb1.r));
                const g = from(b2n(rgb1.g));
                const b = from(b2n(rgb1.b));
                return {
                    r: n2b(to(r + t * (from(b2n(rgb2.r)) - r))),
                    g: n2b(to(g + t * (from(b2n(rgb2.g)) - g))),
                    b: n2b(to(b + t * (from(b2n(rgb2.b)) - b))),
                    a: rgb1.a + t * (rgb2.a - rgb1.a)
                };
            }
            function modHSL(v, i, ratio) {
                if (v) {
                    let tmp = rgb2hsl(v);
                    tmp[i] = Math.max(0, Math.min(tmp[i] + tmp[i] * ratio, 0 === i ? 360 : 1));
                    tmp = hsl2rgb(tmp);
                    v.r = tmp[0];
                    v.g = tmp[1];
                    v.b = tmp[2];
                }
            }
            function clone(v, proto) {
                return v ? Object.assign(proto || {}, v) : v;
            }
            function fromObject(input) {
                var v = {
                    r: 0,
                    g: 0,
                    b: 0,
                    a: 255
                };
                if (Array.isArray(input)) {
                    if (input.length >= 3) {
                        v = {
                            r: input[0],
                            g: input[1],
                            b: input[2],
                            a: 255
                        };
                        if (input.length > 3) v.a = n2b(input[3]);
                    }
                } else {
                    v = clone(input, {
                        r: 0,
                        g: 0,
                        b: 0,
                        a: 1
                    });
                    v.a = n2b(v.a);
                }
                return v;
            }
            function functionParse(str) {
                if ('r' === str.charAt(0)) {
                    return rgbParse(str);
                }
                return hueParse(str);
            }
            class Color {
                constructor(input){
                    let v;
                    if (input instanceof Color) {
                        return input;
                    }
                    const type = typeof input;
                    if ('object' === type) v = fromObject(input);
                    else if ('string' === type) v = hexParse(input) || nameParse(input) || functionParse(input);
                    this._rgb = v;
                    this._valid = !!v;
                }
                get valid() {
                    return this._valid;
                }
                get rgb() {
                    var v = clone(this._rgb);
                    if (v) v.a = b2n(v.a);
                    return v;
                }
                set rgb(obj) {
                    this._rgb = fromObject(obj);
                }
                rgbString() {
                    return this._valid ? rgbString(this._rgb) : void 0;
                }
                hexString() {
                    return this._valid ? hexString(this._rgb) : void 0;
                }
                hslString() {
                    return this._valid ? hslString(this._rgb) : void 0;
                }
                mix(color, weight) {
                    if (color) {
                        let w2;
                        const c1 = this.rgb;
                        const c2 = color.rgb;
                        const p = weight === w2 ? 0.5 : weight;
                        const w = 2 * p - 1;
                        const a = c1.a - c2.a;
                        const w1 = ((w * a === -1 ? w : (w + a) / (1 + w * a)) + 1) / 2.0;
                        w2 = 1 - w1;
                        c1.r = 0xFF & w1 * c1.r + w2 * c2.r + 0.5;
                        c1.g = 0xFF & w1 * c1.g + w2 * c2.g + 0.5;
                        c1.b = 0xFF & w1 * c1.b + w2 * c2.b + 0.5;
                        c1.a = p * c1.a + (1 - p) * c2.a;
                        this.rgb = c1;
                    }
                    return this;
                }
                interpolate(color, t) {
                    if (color) this._rgb = interpolate(this._rgb, color._rgb, t);
                    return this;
                }
                clone() {
                    return new Color(this.rgb);
                }
                alpha(a) {
                    this._rgb.a = n2b(a);
                    return this;
                }
                clearer(ratio) {
                    const rgb = this._rgb;
                    rgb.a *= 1 - ratio;
                    return this;
                }
                greyscale() {
                    const rgb = this._rgb;
                    const val = round(0.3 * rgb.r + 0.59 * rgb.g + 0.11 * rgb.b);
                    rgb.r = rgb.g = rgb.b = val;
                    return this;
                }
                opaquer(ratio) {
                    const rgb = this._rgb;
                    rgb.a *= 1 + ratio;
                    return this;
                }
                negate() {
                    const v = this._rgb;
                    v.r = 255 - v.r;
                    v.g = 255 - v.g;
                    v.b = 255 - v.b;
                    return this;
                }
                lighten(ratio) {
                    modHSL(this._rgb, 2, ratio);
                    return this;
                }
                darken(ratio) {
                    modHSL(this._rgb, 2, -ratio);
                    return this;
                }
                saturate(ratio) {
                    modHSL(this._rgb, 1, ratio);
                    return this;
                }
                desaturate(ratio) {
                    modHSL(this._rgb, 1, -ratio);
                    return this;
                }
                rotate(deg) {
                    rotate(this._rgb, deg);
                    return this;
                }
            }
            function index_esm(input) {
                return new Color(input);
            }
            function isPatternOrGradient(value) {
                if (value && 'object' == typeof value) {
                    const type = value.toString();
                    return '[object CanvasPattern]' === type || '[object CanvasGradient]' === type;
                }
                return false;
            }
            function color(value) {
                return isPatternOrGradient(value) ? value : index_esm(value);
            }
            function getHoverColor(value) {
                return isPatternOrGradient(value) ? value : index_esm(value).saturate(0.5).darken(0.1).hexString();
            }
            const overrides = Object.create(null);
            const descriptors = Object.create(null);
            function getScope$1(node, key) {
                if (!key) {
                    return node;
                }
                const keys = key.split('.');
                for(let i = 0, n = keys.length; i < n; ++i){
                    const k = keys[i];
                    node = node[k] || (node[k] = Object.create(null));
                }
                return node;
            }
            function set(root, scope, values) {
                if ('string' == typeof scope) {
                    return merge(getScope$1(root, scope), values);
                }
                return merge(getScope$1(root, ''), scope);
            }
            class Defaults {
                constructor(_descriptors){
                    this.animation = void 0;
                    this.backgroundColor = 'rgba(0,0,0,0.1)';
                    this.borderColor = 'rgba(0,0,0,0.1)';
                    this.color = '#666';
                    this.datasets = {};
                    this.devicePixelRatio = (context)=>context.chart.platform.getDevicePixelRatio();
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
                    this.hoverBackgroundColor = (ctx, options)=>getHoverColor(options.backgroundColor);
                    this.hoverBorderColor = (ctx, options)=>getHoverColor(options.borderColor);
                    this.hoverColor = (ctx, options)=>getHoverColor(options.color);
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
                    this.scale = void 0;
                    this.scales = {};
                    this.showLine = true;
                    this.drawActiveElementsOnTop = true;
                    this.describe(_descriptors);
                }
                set(scope, values) {
                    return set(this, scope, values);
                }
                get(scope) {
                    return getScope$1(this, scope);
                }
                describe(scope, values) {
                    return set(descriptors, scope, values);
                }
                override(scope, values) {
                    return set(overrides, scope, values);
                }
                route(scope, name, targetScope, targetName) {
                    const scopeObject = getScope$1(this, scope);
                    const targetScopeObject = getScope$1(this, targetScope);
                    const privateName = '_' + name;
                    Object.defineProperties(scopeObject, {
                        [privateName]: {
                            value: scopeObject[name],
                            writable: true
                        },
                        [name]: {
                            enumerable: true,
                            get () {
                                const local = this[privateName];
                                const target = targetScopeObject[targetName];
                                if (isObject(local)) {
                                    return Object.assign({}, target, local);
                                }
                                return valueOrDefault(local, target);
                            },
                            set (value) {
                                this[privateName] = value;
                            }
                        }
                    });
                }
            }
            var defaults = new Defaults({
                _scriptable: (name)=>!name.startsWith('on'),
                _indexable: (name)=>'events' !== name,
                hover: {
                    _fallback: 'interaction'
                },
                interaction: {
                    _scriptable: false,
                    _indexable: false
                }
            });
            function toFontString(font) {
                if (!font || isNullOrUndef(font.size) || isNullOrUndef(font.family)) {
                    return null;
                }
                return (font.style ? font.style + ' ' : '') + (font.weight ? font.weight + ' ' : '') + font.size + 'px ' + font.family;
            }
            function _measureText(ctx, data, gc, longest, string) {
                let textWidth = data[string];
                if (!textWidth) {
                    textWidth = data[string] = ctx.measureText(string).width;
                    gc.push(string);
                }
                if (textWidth > longest) longest = textWidth;
                return longest;
            }
            function _longestText(ctx, font, arrayOfThings, cache) {
                let i, j, jlen, thing, nestedThing;
                cache = cache || {};
                let data = cache.data = cache.data || {};
                let gc = cache.garbageCollect = cache.garbageCollect || [];
                if (cache.font !== font) {
                    data = cache.data = {};
                    gc = cache.garbageCollect = [];
                    cache.font = font;
                }
                ctx.save();
                ctx.font = font;
                let longest = 0;
                const ilen = arrayOfThings.length;
                for(i = 0; i < ilen; i++){
                    thing = arrayOfThings[i];
                    if (null != thing && true !== isArray(thing)) longest = _measureText(ctx, data, gc, longest, thing);
                    else if (isArray(thing)) {
                        for(j = 0, jlen = thing.length; j < jlen; j++){
                            nestedThing = thing[j];
                            if (null != nestedThing && !isArray(nestedThing)) longest = _measureText(ctx, data, gc, longest, nestedThing);
                        }
                    }
                }
                ctx.restore();
                const gcLen = gc.length / 2;
                if (gcLen > arrayOfThings.length) {
                    for(i = 0; i < gcLen; i++)delete data[gc[i]];
                    gc.splice(0, gcLen);
                }
                return longest;
            }
            function _alignPixel(chart, pixel, width) {
                const devicePixelRatio = chart.currentDevicePixelRatio;
                const halfWidth = 0 !== width ? Math.max(width / 2, 0.5) : 0;
                return Math.round((pixel - halfWidth) * devicePixelRatio) / devicePixelRatio + halfWidth;
            }
            function clearCanvas(canvas, ctx) {
                ctx = ctx || canvas.getContext('2d');
                ctx.save();
                ctx.resetTransform();
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.restore();
            }
            function drawPoint(ctx, options, x, y) {
                drawPointLegend(ctx, options, x, y, null);
            }
            function drawPointLegend(ctx, options, x, y, w) {
                let type, xOffset, yOffset, size, cornerRadius, width;
                const style = options.pointStyle;
                const rotation = options.rotation;
                const radius = options.radius;
                let rad = (rotation || 0) * RAD_PER_DEG;
                if (style && 'object' == typeof style) {
                    type = style.toString();
                    if ('[object HTMLImageElement]' === type || '[object HTMLCanvasElement]' === type) {
                        ctx.save();
                        ctx.translate(x, y);
                        ctx.rotate(rad);
                        ctx.drawImage(style, -style.width / 2, -style.height / 2, style.width, style.height);
                        ctx.restore();
                        return;
                    }
                }
                if (isNaN(radius) || radius <= 0) {
                    return;
                }
                ctx.beginPath();
                switch(style){
                    default:
                        if (w) ctx.ellipse(x, y, w / 2, radius, 0, 0, TAU);
                        else ctx.arc(x, y, radius, 0, TAU);
                        ctx.closePath();
                        break;
                    case 'triangle':
                        ctx.moveTo(x + Math.sin(rad) * radius, y - Math.cos(rad) * radius);
                        rad += TWO_THIRDS_PI;
                        ctx.lineTo(x + Math.sin(rad) * radius, y - Math.cos(rad) * radius);
                        rad += TWO_THIRDS_PI;
                        ctx.lineTo(x + Math.sin(rad) * radius, y - Math.cos(rad) * radius);
                        ctx.closePath();
                        break;
                    case 'rectRounded':
                        cornerRadius = 0.516 * radius;
                        size = radius - cornerRadius;
                        xOffset = Math.cos(rad + QUARTER_PI) * size;
                        yOffset = Math.sin(rad + QUARTER_PI) * size;
                        ctx.arc(x - xOffset, y - yOffset, cornerRadius, rad - PI, rad - HALF_PI);
                        ctx.arc(x + yOffset, y - xOffset, cornerRadius, rad - HALF_PI, rad);
                        ctx.arc(x + xOffset, y + yOffset, cornerRadius, rad, rad + HALF_PI);
                        ctx.arc(x - yOffset, y + xOffset, cornerRadius, rad + HALF_PI, rad + PI);
                        ctx.closePath();
                        break;
                    case 'rect':
                        if (!rotation) {
                            size = Math.SQRT1_2 * radius;
                            width = w ? w / 2 : size;
                            ctx.rect(x - width, y - size, 2 * width, 2 * size);
                            break;
                        }
                        rad += QUARTER_PI;
                    case 'rectRot':
                        xOffset = Math.cos(rad) * radius;
                        yOffset = Math.sin(rad) * radius;
                        ctx.moveTo(x - xOffset, y - yOffset);
                        ctx.lineTo(x + yOffset, y - xOffset);
                        ctx.lineTo(x + xOffset, y + yOffset);
                        ctx.lineTo(x - yOffset, y + xOffset);
                        ctx.closePath();
                        break;
                    case 'crossRot':
                        rad += QUARTER_PI;
                    case 'cross':
                        xOffset = Math.cos(rad) * radius;
                        yOffset = Math.sin(rad) * radius;
                        ctx.moveTo(x - xOffset, y - yOffset);
                        ctx.lineTo(x + xOffset, y + yOffset);
                        ctx.moveTo(x + yOffset, y - xOffset);
                        ctx.lineTo(x - yOffset, y + xOffset);
                        break;
                    case 'star':
                        xOffset = Math.cos(rad) * radius;
                        yOffset = Math.sin(rad) * radius;
                        ctx.moveTo(x - xOffset, y - yOffset);
                        ctx.lineTo(x + xOffset, y + yOffset);
                        ctx.moveTo(x + yOffset, y - xOffset);
                        ctx.lineTo(x - yOffset, y + xOffset);
                        rad += QUARTER_PI;
                        xOffset = Math.cos(rad) * radius;
                        yOffset = Math.sin(rad) * radius;
                        ctx.moveTo(x - xOffset, y - yOffset);
                        ctx.lineTo(x + xOffset, y + yOffset);
                        ctx.moveTo(x + yOffset, y - xOffset);
                        ctx.lineTo(x - yOffset, y + xOffset);
                        break;
                    case 'line':
                        xOffset = w ? w / 2 : Math.cos(rad) * radius;
                        yOffset = Math.sin(rad) * radius;
                        ctx.moveTo(x - xOffset, y - yOffset);
                        ctx.lineTo(x + xOffset, y + yOffset);
                        break;
                    case 'dash':
                        ctx.moveTo(x, y);
                        ctx.lineTo(x + Math.cos(rad) * radius, y + Math.sin(rad) * radius);
                        break;
                }
                ctx.fill();
                if (options.borderWidth > 0) ctx.stroke();
            }
            function _isPointInArea(point, area, margin) {
                margin = margin || 0.5;
                return !area || point && point.x > area.left - margin && point.x < area.right + margin && point.y > area.top - margin && point.y < area.bottom + margin;
            }
            function clipArea(ctx, area) {
                ctx.save();
                ctx.beginPath();
                ctx.rect(area.left, area.top, area.right - area.left, area.bottom - area.top);
                ctx.clip();
            }
            function unclipArea(ctx) {
                ctx.restore();
            }
            function _steppedLineTo(ctx, previous, target, flip, mode) {
                if (!previous) {
                    return ctx.lineTo(target.x, target.y);
                }
                if ('middle' === mode) {
                    const midpoint = (previous.x + target.x) / 2.0;
                    ctx.lineTo(midpoint, previous.y);
                    ctx.lineTo(midpoint, target.y);
                } else if ('after' === mode !== !!flip) ctx.lineTo(previous.x, target.y);
                else ctx.lineTo(target.x, previous.y);
                ctx.lineTo(target.x, target.y);
            }
            function _bezierCurveTo(ctx, previous, target, flip) {
                if (!previous) {
                    return ctx.lineTo(target.x, target.y);
                }
                ctx.bezierCurveTo(flip ? previous.cp1x : previous.cp2x, flip ? previous.cp1y : previous.cp2y, flip ? target.cp2x : target.cp1x, flip ? target.cp2y : target.cp1y, target.x, target.y);
            }
            function renderText(ctx, text, x, y, font, opts = {}) {
                let i, line;
                const lines = isArray(text) ? text : [
                    text
                ];
                const stroke = opts.strokeWidth > 0 && '' !== opts.strokeColor;
                ctx.save();
                ctx.font = font.string;
                setRenderOpts(ctx, opts);
                for(i = 0; i < lines.length; ++i){
                    line = lines[i];
                    if (stroke) {
                        if (opts.strokeColor) ctx.strokeStyle = opts.strokeColor;
                        if (!isNullOrUndef(opts.strokeWidth)) ctx.lineWidth = opts.strokeWidth;
                        ctx.strokeText(line, x, y, opts.maxWidth);
                    }
                    ctx.fillText(line, x, y, opts.maxWidth);
                    decorateText(ctx, x, y, line, opts);
                    y += font.lineHeight;
                }
                ctx.restore();
            }
            function setRenderOpts(ctx, opts) {
                if (opts.translation) ctx.translate(opts.translation[0], opts.translation[1]);
                if (!isNullOrUndef(opts.rotation)) ctx.rotate(opts.rotation);
                if (opts.color) ctx.fillStyle = opts.color;
                if (opts.textAlign) ctx.textAlign = opts.textAlign;
                if (opts.textBaseline) ctx.textBaseline = opts.textBaseline;
            }
            function decorateText(ctx, x, y, line, opts) {
                if (opts.strikethrough || opts.underline) {
                    const metrics = ctx.measureText(line);
                    const left = x - metrics.actualBoundingBoxLeft;
                    const right = x + metrics.actualBoundingBoxRight;
                    const top = y - metrics.actualBoundingBoxAscent;
                    const bottom = y + metrics.actualBoundingBoxDescent;
                    const yDecoration = opts.strikethrough ? (top + bottom) / 2 : bottom;
                    ctx.strokeStyle = ctx.fillStyle;
                    ctx.beginPath();
                    ctx.lineWidth = opts.decorationWidth || 2;
                    ctx.moveTo(left, yDecoration);
                    ctx.lineTo(right, yDecoration);
                    ctx.stroke();
                }
            }
            function addRoundedRectPath(ctx, rect) {
                const { x , y , w , h , radius  } = rect;
                ctx.arc(x + radius.topLeft, y + radius.topLeft, radius.topLeft, -HALF_PI, PI, true);
                ctx.lineTo(x, y + h - radius.bottomLeft);
                ctx.arc(x + radius.bottomLeft, y + h - radius.bottomLeft, radius.bottomLeft, PI, HALF_PI, true);
                ctx.lineTo(x + w - radius.bottomRight, y + h);
                ctx.arc(x + w - radius.bottomRight, y + h - radius.bottomRight, radius.bottomRight, HALF_PI, 0, true);
                ctx.lineTo(x + w, y + radius.topRight);
                ctx.arc(x + w - radius.topRight, y + radius.topRight, radius.topRight, 0, -HALF_PI, true);
                ctx.lineTo(x + radius.topLeft, y);
            }
            const LINE_HEIGHT = RegExp(/^(normal|(\d+(?:\.\d+)?)(px|em|%)?)$/);
            const FONT_STYLE = RegExp(/^(normal|italic|initial|inherit|unset|(oblique( -?[0-9]?[0-9]deg)?))$/);
            function toLineHeight(value, size) {
                const matches = ('' + value).match(LINE_HEIGHT);
                if (!matches || 'normal' === matches[1]) {
                    return 1.2 * size;
                }
                value = +matches[2];
                switch(matches[3]){
                    case 'px':
                        return value;
                    case '%':
                        value /= 100;
                        break;
                }
                return size * value;
            }
            const numberOrZero = (v)=>+v || 0;
            function _readValueToProps(value, props) {
                const ret = {};
                const objProps = isObject(props);
                const keys = objProps ? Object.keys(props) : props;
                const read = isObject(value) ? objProps ? (prop)=>valueOrDefault(value[prop], value[props[prop]]) : (prop)=>value[prop] : ()=>value;
                for (const prop of keys)ret[prop] = numberOrZero(read(prop));
                return ret;
            }
            function toTRBL(value) {
                return _readValueToProps(value, {
                    top: 'y',
                    right: 'x',
                    bottom: 'y',
                    left: 'x'
                });
            }
            function toTRBLCorners(value) {
                return _readValueToProps(value, [
                    'topLeft',
                    'topRight',
                    'bottomLeft',
                    'bottomRight'
                ]);
            }
            function toPadding(value) {
                const obj = toTRBL(value);
                obj.width = obj.left + obj.right;
                obj.height = obj.top + obj.bottom;
                return obj;
            }
            function toFont(options, fallback) {
                options = options || {};
                fallback = fallback || defaults.font;
                let size = valueOrDefault(options.size, fallback.size);
                if ('string' == typeof size) size = parseInt(size, 10);
                let style = valueOrDefault(options.style, fallback.style);
                if (style && !('' + style).match(FONT_STYLE)) {
                    console.warn('Invalid font style specified: "' + style + '"');
                    style = '';
                }
                const font = {
                    family: valueOrDefault(options.family, fallback.family),
                    lineHeight: toLineHeight(valueOrDefault(options.lineHeight, fallback.lineHeight), size),
                    size,
                    style,
                    weight: valueOrDefault(options.weight, fallback.weight),
                    string: ''
                };
                font.string = toFontString(font);
                return font;
            }
            function resolve(inputs, context, index, info) {
                let i, ilen, value, cacheable = true;
                for(i = 0, ilen = inputs.length; i < ilen; ++i){
                    value = inputs[i];
                    if (void 0 === value) {
                        continue;
                    }
                    if (void 0 !== context && 'function' == typeof value) {
                        value = value(context);
                        cacheable = false;
                    }
                    if (void 0 !== index && isArray(value)) {
                        value = value[index % value.length];
                        cacheable = false;
                    }
                    if (void 0 !== value) {
                        if (info && !cacheable) info.cacheable = false;
                        return value;
                    }
                }
            }
            function _addGrace(minmax, grace, beginAtZero) {
                const { min , max  } = minmax;
                const change = toDimension(grace, (max - min) / 2);
                const keepZero = (value, add)=>beginAtZero && 0 === value ? 0 : value + add;
                return {
                    min: keepZero(min, -Math.abs(change)),
                    max: keepZero(max, change)
                };
            }
            function createContext(parentContext, context) {
                return Object.assign(Object.create(parentContext), context);
            }
            function _createResolver(scopes, prefixes = [
                ''
            ], rootScopes = scopes, fallback, getTarget = ()=>scopes[0]) {
                if (!defined(fallback)) fallback = _resolve('_fallback', scopes);
                const cache = {
                    [Symbol.toStringTag]: 'Object',
                    _cacheable: true,
                    _scopes: scopes,
                    _rootScopes: rootScopes,
                    _fallback: fallback,
                    _getTarget: getTarget,
                    override: (scope)=>_createResolver([
                            scope,
                            ...scopes
                        ], prefixes, rootScopes, fallback)
                };
                return new Proxy(cache, {
                    deleteProperty (target, prop) {
                        delete target[prop];
                        delete target._keys;
                        delete scopes[0][prop];
                        return true;
                    },
                    get (target, prop) {
                        return _cached(target, prop, ()=>_resolveWithPrefixes(prop, prefixes, scopes, target));
                    },
                    getOwnPropertyDescriptor (target, prop) {
                        return Reflect.getOwnPropertyDescriptor(target._scopes[0], prop);
                    },
                    getPrototypeOf () {
                        return Reflect.getPrototypeOf(scopes[0]);
                    },
                    has (target, prop) {
                        return getKeysFromAllScopes(target).includes(prop);
                    },
                    ownKeys (target) {
                        return getKeysFromAllScopes(target);
                    },
                    set (target, prop, value) {
                        const storage = target._storage || (target._storage = getTarget());
                        target[prop] = storage[prop] = value;
                        delete target._keys;
                        return true;
                    }
                });
            }
            function _attachContext(proxy, context, subProxy, descriptorDefaults) {
                const cache = {
                    _cacheable: false,
                    _proxy: proxy,
                    _context: context,
                    _subProxy: subProxy,
                    _stack: new Set(),
                    _descriptors: _descriptors(proxy, descriptorDefaults),
                    setContext: (ctx)=>_attachContext(proxy, ctx, subProxy, descriptorDefaults),
                    override: (scope)=>_attachContext(proxy.override(scope), context, subProxy, descriptorDefaults)
                };
                return new Proxy(cache, {
                    deleteProperty (target, prop) {
                        delete target[prop];
                        delete proxy[prop];
                        return true;
                    },
                    get (target, prop, receiver) {
                        return _cached(target, prop, ()=>_resolveWithContext(target, prop, receiver));
                    },
                    getOwnPropertyDescriptor (target, prop) {
                        return target._descriptors.allKeys ? Reflect.has(proxy, prop) ? {
                            enumerable: true,
                            configurable: true
                        } : void 0 : Reflect.getOwnPropertyDescriptor(proxy, prop);
                    },
                    getPrototypeOf () {
                        return Reflect.getPrototypeOf(proxy);
                    },
                    has (target, prop) {
                        return Reflect.has(proxy, prop);
                    },
                    ownKeys () {
                        return Reflect.ownKeys(proxy);
                    },
                    set (target, prop, value) {
                        proxy[prop] = value;
                        delete target[prop];
                        return true;
                    }
                });
            }
            function _descriptors(proxy, defaults = {
                scriptable: true,
                indexable: true
            }) {
                const { _scriptable =defaults.scriptable , _indexable =defaults.indexable , _allKeys =defaults.allKeys  } = proxy;
                return {
                    allKeys: _allKeys,
                    scriptable: _scriptable,
                    indexable: _indexable,
                    isScriptable: isFunction(_scriptable) ? _scriptable : ()=>_scriptable,
                    isIndexable: isFunction(_indexable) ? _indexable : ()=>_indexable
                };
            }
            const readKey = (prefix, name)=>prefix ? prefix + _capitalize(name) : name;
            const needsSubResolver = (prop, value)=>isObject(value) && 'adapters' !== prop && (null === Object.getPrototypeOf(value) || value.constructor === Object);
            function _cached(target, prop, resolve) {
                if (Object.prototype.hasOwnProperty.call(target, prop)) {
                    return target[prop];
                }
                const value = resolve();
                target[prop] = value;
                return value;
            }
            function _resolveWithContext(target, prop, receiver) {
                const { _proxy , _context , _subProxy , _descriptors: descriptors  } = target;
                let value = _proxy[prop];
                if (isFunction(value) && descriptors.isScriptable(prop)) value = _resolveScriptable(prop, value, target, receiver);
                if (isArray(value) && value.length) value = _resolveArray(prop, value, target, descriptors.isIndexable);
                if (needsSubResolver(prop, value)) value = _attachContext(value, _context, _subProxy && _subProxy[prop], descriptors);
                return value;
            }
            function _resolveScriptable(prop, value, target, receiver) {
                const { _proxy , _context , _subProxy , _stack  } = target;
                if (_stack.has(prop)) {
                    throw Error('Recursion detected: ' + Array.from(_stack).join('->') + '->' + prop);
                }
                _stack.add(prop);
                value = value(_context, _subProxy || receiver);
                _stack.delete(prop);
                if (needsSubResolver(prop, value)) value = createSubResolver(_proxy._scopes, _proxy, prop, value);
                return value;
            }
            function _resolveArray(prop, value, target, isIndexable) {
                const { _proxy , _context , _subProxy , _descriptors: descriptors  } = target;
                if (defined(_context.index) && isIndexable(prop)) value = value[_context.index % value.length];
                else if (isObject(value[0])) {
                    const arr = value;
                    const scopes = _proxy._scopes.filter((s)=>s !== arr);
                    value = [];
                    for (const item of arr){
                        const resolver = createSubResolver(scopes, _proxy, prop, item);
                        value.push(_attachContext(resolver, _context, _subProxy && _subProxy[prop], descriptors));
                    }
                }
                return value;
            }
            function resolveFallback(fallback, prop, value) {
                return isFunction(fallback) ? fallback(prop, value) : fallback;
            }
            const getScope = (key, parent)=>true === key ? parent : 'string' == typeof key ? resolveObjectKey(parent, key) : void 0;
            function addScopes(set, parentScopes, key, parentFallback, value) {
                for (const parent of parentScopes){
                    const scope = getScope(key, parent);
                    if (scope) {
                        set.add(scope);
                        const fallback = resolveFallback(scope._fallback, key, value);
                        if (defined(fallback) && fallback !== key && fallback !== parentFallback) {
                            return fallback;
                        }
                    } else if (false === scope && defined(parentFallback) && key !== parentFallback) {
                        return null;
                    }
                }
                return false;
            }
            function createSubResolver(parentScopes, resolver, prop, value) {
                const rootScopes = resolver._rootScopes;
                const fallback = resolveFallback(resolver._fallback, prop, value);
                const allScopes = [
                    ...parentScopes,
                    ...rootScopes
                ];
                const set = new Set();
                set.add(value);
                let key = addScopesFromKey(set, allScopes, prop, fallback || prop, value);
                if (null === key) {
                    return false;
                }
                if (defined(fallback) && fallback !== prop) {
                    key = addScopesFromKey(set, allScopes, fallback, key, value);
                    if (null === key) {
                        return false;
                    }
                }
                return _createResolver(Array.from(set), [
                    ''
                ], rootScopes, fallback, ()=>subGetTarget(resolver, prop, value));
            }
            function addScopesFromKey(set, allScopes, key, fallback, item) {
                while(key){
                    key = addScopes(set, allScopes, key, fallback, item);
                }
                return key;
            }
            function subGetTarget(resolver, prop, value) {
                const parent = resolver._getTarget();
                if (!(prop in parent)) parent[prop] = {};
                const target = parent[prop];
                if (isArray(target) && isObject(value)) {
                    return value;
                }
                return target;
            }
            function _resolveWithPrefixes(prop, prefixes, scopes, proxy) {
                let value;
                for (const prefix of prefixes){
                    value = _resolve(readKey(prefix, prop), scopes);
                    if (defined(value)) {
                        return needsSubResolver(prop, value) ? createSubResolver(scopes, proxy, prop, value) : value;
                    }
                }
            }
            function _resolve(key, scopes) {
                for (const scope of scopes){
                    if (!scope) {
                        continue;
                    }
                    const value = scope[key];
                    if (defined(value)) {
                        return value;
                    }
                }
            }
            function getKeysFromAllScopes(target) {
                let keys = target._keys;
                if (!keys) keys = target._keys = resolveKeysFromAllScopes(target._scopes);
                return keys;
            }
            function resolveKeysFromAllScopes(scopes) {
                const set = new Set();
                for (const scope of scopes){
                    for (const key of Object.keys(scope).filter((k)=>!k.startsWith('_')))set.add(key);
                }
                return Array.from(set);
            }
            function _parseObjectDataRadialScale(meta, data, start, count) {
                let i, ilen, index, item;
                const { iScale  } = meta;
                const { key ='r'  } = this._parsing;
                const parsed = Array(count);
                for(i = 0, ilen = count; i < ilen; ++i){
                    index = i + start;
                    item = data[index];
                    parsed[i] = {
                        r: iScale.parse(resolveObjectKey(item, key), index)
                    };
                }
                return parsed;
            }
            const EPSILON = Number.EPSILON || 1e-14;
            const getPoint = (points, i)=>i < points.length && !points[i].skip && points[i];
            const getValueAxis = (indexAxis)=>'x' === indexAxis ? 'y' : 'x';
            function splineCurve(firstPoint, middlePoint, afterPoint, t) {
                const previous = firstPoint.skip ? middlePoint : firstPoint;
                const current = middlePoint;
                const next = afterPoint.skip ? middlePoint : afterPoint;
                const d01 = distanceBetweenPoints(current, previous);
                const d12 = distanceBetweenPoints(next, current);
                let s01 = d01 / (d01 + d12);
                let s12 = d12 / (d01 + d12);
                s01 = isNaN(s01) ? 0 : s01;
                s12 = isNaN(s12) ? 0 : s12;
                const fa = t * s01;
                const fb = t * s12;
                return {
                    previous: {
                        x: current.x - fa * (next.x - previous.x),
                        y: current.y - fa * (next.y - previous.y)
                    },
                    next: {
                        x: current.x + fb * (next.x - previous.x),
                        y: current.y + fb * (next.y - previous.y)
                    }
                };
            }
            function monotoneAdjust(points, deltaK, mK) {
                let alphaK, betaK, tauK, squaredMagnitude, pointCurrent;
                const pointsLen = points.length;
                let pointAfter = getPoint(points, 0);
                for(let i = 0; i < pointsLen - 1; ++i){
                    pointCurrent = pointAfter;
                    pointAfter = getPoint(points, i + 1);
                    if (!pointCurrent || !pointAfter) {
                        continue;
                    }
                    if (almostEquals(deltaK[i], 0, EPSILON)) {
                        mK[i] = mK[i + 1] = 0;
                        continue;
                    }
                    alphaK = mK[i] / deltaK[i];
                    betaK = mK[i + 1] / deltaK[i];
                    squaredMagnitude = Math.pow(alphaK, 2) + Math.pow(betaK, 2);
                    if (squaredMagnitude <= 9) {
                        continue;
                    }
                    tauK = 3 / Math.sqrt(squaredMagnitude);
                    mK[i] = alphaK * tauK * deltaK[i];
                    mK[i + 1] = betaK * tauK * deltaK[i];
                }
            }
            function monotoneCompute(points, mK, indexAxis = 'x') {
                let delta, pointBefore, pointCurrent;
                const valueAxis = getValueAxis(indexAxis);
                const pointsLen = points.length;
                let pointAfter = getPoint(points, 0);
                for(let i = 0; i < pointsLen; ++i){
                    pointBefore = pointCurrent;
                    pointCurrent = pointAfter;
                    pointAfter = getPoint(points, i + 1);
                    if (!pointCurrent) {
                        continue;
                    }
                    const iPixel = pointCurrent[indexAxis];
                    const vPixel = pointCurrent[valueAxis];
                    if (pointBefore) {
                        delta = (iPixel - pointBefore[indexAxis]) / 3;
                        pointCurrent[`cp1${indexAxis}`] = iPixel - delta;
                        pointCurrent[`cp1${valueAxis}`] = vPixel - delta * mK[i];
                    }
                    if (pointAfter) {
                        delta = (pointAfter[indexAxis] - iPixel) / 3;
                        pointCurrent[`cp2${indexAxis}`] = iPixel + delta;
                        pointCurrent[`cp2${valueAxis}`] = vPixel + delta * mK[i];
                    }
                }
            }
            function splineCurveMonotone(points, indexAxis = 'x') {
                let i, pointBefore, pointCurrent;
                const valueAxis = getValueAxis(indexAxis);
                const pointsLen = points.length;
                const deltaK = Array(pointsLen).fill(0);
                const mK = Array(pointsLen);
                let pointAfter = getPoint(points, 0);
                for(i = 0; i < pointsLen; ++i){
                    pointBefore = pointCurrent;
                    pointCurrent = pointAfter;
                    pointAfter = getPoint(points, i + 1);
                    if (!pointCurrent) {
                        continue;
                    }
                    if (pointAfter) {
                        const slopeDelta = pointAfter[indexAxis] - pointCurrent[indexAxis];
                        deltaK[i] = 0 !== slopeDelta ? (pointAfter[valueAxis] - pointCurrent[valueAxis]) / slopeDelta : 0;
                    }
                    mK[i] = pointBefore ? pointAfter ? sign(deltaK[i - 1]) !== sign(deltaK[i]) ? 0 : (deltaK[i - 1] + deltaK[i]) / 2 : deltaK[i - 1] : deltaK[i];
                }
                monotoneAdjust(points, deltaK, mK);
                monotoneCompute(points, mK, indexAxis);
            }
            function capControlPoint(pt, min, max) {
                return Math.max(Math.min(pt, max), min);
            }
            function capBezierPoints(points, area) {
                let i, ilen, point, inArea, inAreaPrev;
                let inAreaNext = _isPointInArea(points[0], area);
                for(i = 0, ilen = points.length; i < ilen; ++i){
                    inAreaPrev = inArea;
                    inArea = inAreaNext;
                    inAreaNext = i < ilen - 1 && _isPointInArea(points[i + 1], area);
                    if (!inArea) {
                        continue;
                    }
                    point = points[i];
                    if (inAreaPrev) {
                        point.cp1x = capControlPoint(point.cp1x, area.left, area.right);
                        point.cp1y = capControlPoint(point.cp1y, area.top, area.bottom);
                    }
                    if (inAreaNext) {
                        point.cp2x = capControlPoint(point.cp2x, area.left, area.right);
                        point.cp2y = capControlPoint(point.cp2y, area.top, area.bottom);
                    }
                }
            }
            function _updateBezierControlPoints(points, options, area, loop, indexAxis) {
                let i, ilen, point, controlPoints;
                if (options.spanGaps) points = points.filter((pt)=>!pt.skip);
                if ('monotone' === options.cubicInterpolationMode) splineCurveMonotone(points, indexAxis);
                else {
                    let prev = loop ? points[points.length - 1] : points[0];
                    for(i = 0, ilen = points.length; i < ilen; ++i){
                        point = points[i];
                        controlPoints = splineCurve(prev, point, points[Math.min(i + 1, ilen - (loop ? 0 : 1)) % ilen], options.tension);
                        point.cp1x = controlPoints.previous.x;
                        point.cp1y = controlPoints.previous.y;
                        point.cp2x = controlPoints.next.x;
                        point.cp2y = controlPoints.next.y;
                        prev = point;
                    }
                }
                if (options.capBezierPoints) capBezierPoints(points, area);
            }
            function _isDomSupported() {
                return 'undefined' != typeof window && 'undefined' != typeof document;
            }
            function _getParentNode(domNode) {
                let parent = domNode.parentNode;
                if (parent && '[object ShadowRoot]' === parent.toString()) parent = parent.host;
                return parent;
            }
            function parseMaxStyle(styleValue, node, parentProperty) {
                let valueInPixels;
                if ('string' == typeof styleValue) {
                    valueInPixels = parseInt(styleValue, 10);
                    if (-1 !== styleValue.indexOf('%')) valueInPixels = valueInPixels / 100 * node.parentNode[parentProperty];
                } else {
                    valueInPixels = styleValue;
                }
                return valueInPixels;
            }
            const getComputedStyle = (element)=>window.getComputedStyle(element, null);
            function getStyle(el, property) {
                return getComputedStyle(el).getPropertyValue(property);
            }
            const positions = [
                'top',
                'right',
                'bottom',
                'left'
            ];
            function getPositionedStyle(styles, style, suffix) {
                const result = {};
                suffix = suffix ? '-' + suffix : '';
                for(let i = 0; i < 4; i++){
                    const pos = positions[i];
                    result[pos] = parseFloat(styles[style + '-' + pos + suffix]) || 0;
                }
                result.width = result.left + result.right;
                result.height = result.top + result.bottom;
                return result;
            }
            const useOffsetPos = (x, y, target)=>(x > 0 || y > 0) && (!target || !target.shadowRoot);
            function getCanvasPosition(e, canvas) {
                let x, y;
                const touches = e.touches;
                const source = touches && touches.length ? touches[0] : e;
                const { offsetX , offsetY  } = source;
                let box = false;
                if (useOffsetPos(offsetX, offsetY, e.target)) {
                    x = offsetX;
                    y = offsetY;
                } else {
                    const rect = canvas.getBoundingClientRect();
                    x = source.clientX - rect.left;
                    y = source.clientY - rect.top;
                    box = true;
                }
                return {
                    x,
                    y,
                    box
                };
            }
            function getRelativePosition(evt, chart) {
                if ('native' in evt) {
                    return evt;
                }
                const { canvas , currentDevicePixelRatio  } = chart;
                const style = getComputedStyle(canvas);
                const borderBox = 'border-box' === style.boxSizing;
                const paddings = getPositionedStyle(style, 'padding');
                const borders = getPositionedStyle(style, 'border', 'width');
                const { x , y , box  } = getCanvasPosition(evt, canvas);
                const xOffset = paddings.left + (box && borders.left);
                const yOffset = paddings.top + (box && borders.top);
                let { width , height  } = chart;
                if (borderBox) {
                    width -= paddings.width + borders.width;
                    height -= paddings.height + borders.height;
                }
                return {
                    x: Math.round((x - xOffset) / width * canvas.width / currentDevicePixelRatio),
                    y: Math.round((y - yOffset) / height * canvas.height / currentDevicePixelRatio)
                };
            }
            function getContainerSize(canvas, width, height) {
                let maxWidth, maxHeight;
                if (void 0 === width || void 0 === height) {
                    const container = _getParentNode(canvas);
                    if (container) {
                        const rect = container.getBoundingClientRect();
                        const containerStyle = getComputedStyle(container);
                        const containerBorder = getPositionedStyle(containerStyle, 'border', 'width');
                        const containerPadding = getPositionedStyle(containerStyle, 'padding');
                        width = rect.width - containerPadding.width - containerBorder.width;
                        height = rect.height - containerPadding.height - containerBorder.height;
                        maxWidth = parseMaxStyle(containerStyle.maxWidth, container, 'clientWidth');
                        maxHeight = parseMaxStyle(containerStyle.maxHeight, container, 'clientHeight');
                    } else {
                        width = canvas.clientWidth;
                        height = canvas.clientHeight;
                    }
                }
                return {
                    width,
                    height,
                    maxWidth: maxWidth || INFINITY,
                    maxHeight: maxHeight || INFINITY
                };
            }
            const round1 = (v)=>Math.round(10 * v) / 10;
            function getMaximumSize(canvas, bbWidth, bbHeight, aspectRatio) {
                const style = getComputedStyle(canvas);
                const margins = getPositionedStyle(style, 'margin');
                const maxWidth = parseMaxStyle(style.maxWidth, canvas, 'clientWidth') || INFINITY;
                const maxHeight = parseMaxStyle(style.maxHeight, canvas, 'clientHeight') || INFINITY;
                const containerSize = getContainerSize(canvas, bbWidth, bbHeight);
                let { width , height  } = containerSize;
                if ('content-box' === style.boxSizing) {
                    const borders = getPositionedStyle(style, 'border', 'width');
                    const paddings = getPositionedStyle(style, 'padding');
                    width -= paddings.width + borders.width;
                    height -= paddings.height + borders.height;
                }
                width = Math.max(0, width - margins.width);
                height = Math.max(0, aspectRatio ? Math.floor(width / aspectRatio) : height - margins.height);
                width = round1(Math.min(width, maxWidth, containerSize.maxWidth));
                height = round1(Math.min(height, maxHeight, containerSize.maxHeight));
                if (width && !height) height = round1(width / 2);
                return {
                    width,
                    height
                };
            }
            function retinaScale(chart, forceRatio, forceStyle) {
                const pixelRatio = forceRatio || 1;
                const deviceHeight = Math.floor(chart.height * pixelRatio);
                const deviceWidth = Math.floor(chart.width * pixelRatio);
                chart.height = deviceHeight / pixelRatio;
                chart.width = deviceWidth / pixelRatio;
                const canvas = chart.canvas;
                if (canvas.style && (forceStyle || !canvas.style.height && !canvas.style.width)) {
                    canvas.style.height = `${chart.height}px`;
                    canvas.style.width = `${chart.width}px`;
                }
                if (chart.currentDevicePixelRatio !== pixelRatio || canvas.height !== deviceHeight || canvas.width !== deviceWidth) {
                    chart.currentDevicePixelRatio = pixelRatio;
                    canvas.height = deviceHeight;
                    canvas.width = deviceWidth;
                    chart.ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
                    return true;
                }
                return false;
            }
            const supportsEventListenerOptions = function() {
                let passiveSupported = false;
                try {
                    const options = {
                        get passive () {
                            passiveSupported = true;
                            return false;
                        }
                    };
                    window.addEventListener('test', null, options);
                    window.removeEventListener('test', null, options);
                } catch (e) {}
                return passiveSupported;
            }();
            function readUsedSize(element, property) {
                const value = getStyle(element, property);
                const matches = value && value.match(/^(\d+)(\.\d+)?px$/);
                return matches ? +matches[1] : void 0;
            }
            function _pointInLine(p1, p2, t, mode) {
                return {
                    x: p1.x + t * (p2.x - p1.x),
                    y: p1.y + t * (p2.y - p1.y)
                };
            }
            function _steppedInterpolation(p1, p2, t, mode) {
                return {
                    x: p1.x + t * (p2.x - p1.x),
                    y: 'middle' === mode ? t < 0.5 ? p1.y : p2.y : 'after' === mode ? t < 1 ? p1.y : p2.y : t > 0 ? p2.y : p1.y
                };
            }
            function _bezierInterpolation(p1, p2, t, mode) {
                const cp1 = {
                    x: p1.cp2x,
                    y: p1.cp2y
                };
                const cp2 = {
                    x: p2.cp1x,
                    y: p2.cp1y
                };
                const a = _pointInLine(p1, cp1, t);
                const b = _pointInLine(cp1, cp2, t);
                const c = _pointInLine(cp2, p2, t);
                const d = _pointInLine(a, b, t);
                const e = _pointInLine(b, c, t);
                return _pointInLine(d, e, t);
            }
            const intlCache = new Map();
            function getNumberFormat(locale, options) {
                options = options || {};
                const cacheKey = locale + JSON.stringify(options);
                let formatter = intlCache.get(cacheKey);
                if (!formatter) {
                    formatter = new Intl.NumberFormat(locale, options);
                    intlCache.set(cacheKey, formatter);
                }
                return formatter;
            }
            function formatNumber(num, locale, options) {
                return getNumberFormat(locale, options).format(num);
            }
            function getRtlAdapter(rtl, rectX, width) {
                return rtl ? function(rectX, width) {
                    return {
                        x (x) {
                            return rectX + rectX + width - x;
                        },
                        setWidth (w) {
                            width = w;
                        },
                        textAlign (align) {
                            if ('center' === align) {
                                return align;
                            }
                            return 'right' === align ? 'left' : 'right';
                        },
                        xPlus (x, value) {
                            return x - value;
                        },
                        leftForLtr (x, itemWidth) {
                            return x - itemWidth;
                        }
                    };
                }(rectX, width) : function() {
                    return {
                        x (x) {
                            return x;
                        },
                        setWidth (w) {},
                        textAlign (align) {
                            return align;
                        },
                        xPlus (x, value) {
                            return x + value;
                        },
                        leftForLtr (x, _itemWidth) {
                            return x;
                        }
                    };
                }();
            }
            function overrideTextDirection(ctx, direction) {
                let style, original;
                if ('ltr' === direction || 'rtl' === direction) {
                    style = ctx.canvas.style;
                    original = [
                        style.getPropertyValue('direction'),
                        style.getPropertyPriority('direction')
                    ];
                    style.setProperty('direction', direction, 'important');
                    ctx.prevTextDirection = original;
                }
            }
            function restoreTextDirection(ctx, original) {
                if (void 0 !== original) {
                    delete ctx.prevTextDirection;
                    ctx.canvas.style.setProperty('direction', original[0], original[1]);
                }
            }
            function propertyFn(property) {
                if ('angle' === property) {
                    return {
                        between: _angleBetween,
                        compare: _angleDiff,
                        normalize: _normalizeAngle
                    };
                }
                return {
                    between: _isBetween,
                    compare: (a, b)=>a - b,
                    normalize: (x)=>x
                };
            }
            function normalizeSegment({ start , end , count , loop , style  }) {
                return {
                    start: start % count,
                    end: end % count,
                    loop: loop && (end - start + 1) % count === 0,
                    style
                };
            }
            function getSegment(segment, points, bounds) {
                let i, ilen;
                const { property , start: startBound , end: endBound  } = bounds;
                const { between , normalize  } = propertyFn(property);
                const count = points.length;
                let { start , end , loop  } = segment;
                if (loop) {
                    start += count;
                    end += count;
                    for(i = 0, ilen = count; i < ilen; ++i){
                        if (!between(normalize(points[start % count][property]), startBound, endBound)) {
                            break;
                        }
                        start--;
                        end--;
                    }
                    start %= count;
                    end %= count;
                }
                if (end < start) end += count;
                return {
                    start,
                    end,
                    loop,
                    style: segment.style
                };
            }
            function _boundSegment(segment, points, bounds) {
                let value, point, prevValue;
                if (!bounds) {
                    return [
                        segment
                    ];
                }
                const { property , start: startBound , end: endBound  } = bounds;
                const count = points.length;
                const { compare , between , normalize  } = propertyFn(property);
                const { start , end , loop , style  } = getSegment(segment, points, bounds);
                const result = [];
                let inside = false;
                let subStart = null;
                const startIsBefore = ()=>between(startBound, prevValue, value) && 0 !== compare(startBound, prevValue);
                const endIsBefore = ()=>0 === compare(endBound, value) || between(endBound, prevValue, value);
                const shouldStart = ()=>inside || startIsBefore();
                const shouldStop = ()=>!inside || endIsBefore();
                for(let i = start, prev = start; i <= end; ++i){
                    point = points[i % count];
                    if (point.skip) {
                        continue;
                    }
                    value = normalize(point[property]);
                    if (value === prevValue) {
                        continue;
                    }
                    inside = between(value, startBound, endBound);
                    if (null === subStart && shouldStart()) subStart = 0 === compare(value, startBound) ? i : prev;
                    if (null !== subStart && shouldStop()) {
                        result.push(normalizeSegment({
                            start: subStart,
                            end: i,
                            loop,
                            count,
                            style
                        }));
                        subStart = null;
                    }
                    prev = i;
                    prevValue = value;
                }
                if (null !== subStart) result.push(normalizeSegment({
                    start: subStart,
                    end,
                    loop,
                    count,
                    style
                }));
                return result;
            }
            function _boundSegments(line, bounds) {
                const result = [];
                const segments = line.segments;
                for(let i = 0; i < segments.length; i++){
                    const sub = _boundSegment(segments[i], line.points, bounds);
                    if (sub.length) result.push(...sub);
                }
                return result;
            }
            function findStartAndEnd(points, count, loop, spanGaps) {
                let start = 0;
                let end = count - 1;
                if (loop && !spanGaps) {
                    while(start < count && !points[start].skip){
                        start++;
                    }
                }
                while(start < count && points[start].skip){
                    start++;
                }
                start %= count;
                if (loop) end += start;
                while(end > start && points[end % count].skip){
                    end--;
                }
                end %= count;
                return {
                    start,
                    end
                };
            }
            function solidSegments(points, start, max, loop) {
                let end;
                const count = points.length;
                const result = [];
                let last = start;
                let prev = points[start];
                for(end = start + 1; end <= max; ++end){
                    const cur = points[end % count];
                    if (cur.skip || cur.stop) {
                        if (!prev.skip) {
                            loop = false;
                            result.push({
                                start: start % count,
                                end: (end - 1) % count,
                                loop
                            });
                            start = last = cur.stop ? end : null;
                        }
                    } else {
                        last = end;
                        if (prev.skip) start = end;
                    }
                    prev = cur;
                }
                if (null !== last) result.push({
                    start: start % count,
                    end: last % count,
                    loop
                });
                return result;
            }
            function _computeSegments(line, segmentOptions) {
                const points = line.points;
                const spanGaps = line.options.spanGaps;
                const count = points.length;
                if (!count) {
                    return [];
                }
                const loop = !!line._loop;
                const { start , end  } = findStartAndEnd(points, count, loop, spanGaps);
                if (true === spanGaps) {
                    return splitByStyles(line, [
                        {
                            start,
                            end,
                            loop
                        }
                    ], points, segmentOptions);
                }
                const completeLoop = !!line._fullLoop && 0 === start && end === count - 1;
                return splitByStyles(line, solidSegments(points, start, end < start ? end + count : end, completeLoop), points, segmentOptions);
            }
            function splitByStyles(line, segments, points, segmentOptions) {
                if (!segmentOptions || !segmentOptions.setContext || !points) {
                    return segments;
                }
                return doSplitByStyles(line, segments, points, segmentOptions);
            }
            function doSplitByStyles(line, segments, points, segmentOptions) {
                const chartContext = line._chart.getContext();
                const baseStyle = readStyle(line.options);
                const { _datasetIndex: datasetIndex , options: { spanGaps  }  } = line;
                const count = points.length;
                const result = [];
                let prevStyle = baseStyle;
                let start = segments[0].start;
                let i = start;
                function addStyle(s, e, l, st) {
                    const dir = spanGaps ? -1 : 1;
                    if (s === e) {
                        return;
                    }
                    s += count;
                    while(points[s % count].skip){
                        s -= dir;
                    }
                    while(points[e % count].skip){
                        e += dir;
                    }
                    if (s % count !== e % count) {
                        result.push({
                            start: s % count,
                            end: e % count,
                            loop: l,
                            style: st
                        });
                        prevStyle = st;
                        start = e % count;
                    }
                }
                for (const segment of segments){
                    let style;
                    start = spanGaps ? start : segment.start;
                    let prev = points[start % count];
                    for(i = start + 1; i <= segment.end; i++){
                        const pt = points[i % count];
                        style = readStyle(segmentOptions.setContext(createContext(chartContext, {
                            type: 'segment',
                            p0: prev,
                            p1: pt,
                            p0DataIndex: (i - 1) % count,
                            p1DataIndex: i % count,
                            datasetIndex
                        })));
                        if (styleChanged(style, prevStyle)) addStyle(start, i - 1, segment.loop, prevStyle);
                        prev = pt;
                        prevStyle = style;
                    }
                    if (start < i - 1) addStyle(start, i - 1, segment.loop, prevStyle);
                }
                return result;
            }
            function readStyle(options) {
                return {
                    backgroundColor: options.backgroundColor,
                    borderCapStyle: options.borderCapStyle,
                    borderDash: options.borderDash,
                    borderDashOffset: options.borderDashOffset,
                    borderJoinStyle: options.borderJoinStyle,
                    borderWidth: options.borderWidth,
                    borderColor: options.borderColor
                };
            }
            function styleChanged(style, prevStyle) {
                return prevStyle && JSON.stringify(style) !== JSON.stringify(prevStyle);
            }
        }
    }
]);
