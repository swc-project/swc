!// https://d3js.org v6.3.1 Copyright 2020 Mike Bostock
function(global, factory) {
    'object' == typeof exports && 'undefined' != typeof module ? factory(exports) : 'function' == typeof define && define.amd ? define([
        'exports'
    ], factory) : factory((global = 'undefined' != typeof globalThis ? globalThis : global || self).d3 = global.d3 || {});
}(this, function(exports1) {
    'use strict';
    function ascending(a, b) {
        return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
    }
    function bisector(f) {
        let delta = f, compare = f;
        function left(a, x, lo, hi) {
            for(null == lo && (lo = 0), null == hi && (hi = a.length); lo < hi;){
                const mid = lo + hi >>> 1;
                0 > compare(a[mid], x) ? lo = mid + 1 : hi = mid;
            }
            return lo;
        }
        return 1 === f.length && (delta = (d, x)=>f(d) - x, compare = (d, x)=>ascending(f(d), x)), {
            left,
            center: function(a, x, lo, hi) {
                null == lo && (lo = 0), null == hi && (hi = a.length);
                const i = left(a, x, lo, hi - 1);
                return i > lo && delta(a[i - 1], x) > -delta(a[i], x) ? i - 1 : i;
            },
            right: function(a, x, lo, hi) {
                for(null == lo && (lo = 0), null == hi && (hi = a.length); lo < hi;){
                    const mid = lo + hi >>> 1;
                    compare(a[mid], x) > 0 ? hi = mid : lo = mid + 1;
                }
                return lo;
            }
        };
    }
    function number(x) {
        return null === x ? NaN : +x;
    }
    const ascendingBisect = bisector(ascending), bisectRight = ascendingBisect.right, bisectLeft = ascendingBisect.left, bisectCenter = bisector(number).center;
    function count(values, valueof) {
        let count = 0;
        if (void 0 === valueof) for (let value of values)null != value && (value = +value) >= value && ++count;
        else {
            let index = -1;
            for (let value of values)null != (value = valueof(value, ++index, values)) && (value = +value) >= value && ++count;
        }
        return count;
    }
    function length(array) {
        return 0 | array.length;
    }
    function empty(length) {
        return !(length > 0);
    }
    function arrayify(values) {
        return "object" != typeof values || "length" in values ? values : Array.from(values);
    }
    function variance(values, valueof) {
        let delta, count = 0, mean = 0, sum = 0;
        if (void 0 === valueof) for (let value of values)null != value && (value = +value) >= value && (delta = value - mean, mean += delta / ++count, sum += delta * (value - mean));
        else {
            let index = -1;
            for (let value of values)null != (value = valueof(value, ++index, values)) && (value = +value) >= value && (delta = value - mean, mean += delta / ++count, sum += delta * (value - mean));
        }
        if (count > 1) return sum / (count - 1);
    }
    function deviation(values, valueof) {
        const v = variance(values, valueof);
        return v ? Math.sqrt(v) : v;
    }
    function extent(values, valueof) {
        let min, max;
        if (void 0 === valueof) for (const value of values)null != value && (void 0 === min ? value >= value && (min = max = value) : (min > value && (min = value), max < value && (max = value)));
        else {
            let index = -1;
            for (let value of values)null != (value = valueof(value, ++index, values)) && (void 0 === min ? value >= value && (min = max = value) : (min > value && (min = value), max < value && (max = value)));
        }
        return [
            min,
            max
        ];
    }
    // https://github.com/python/cpython/blob/a74eea238f5baba15797e2e8b570d153bc8690a7/Modules/mathmodule.c#L1423
    class Adder {
        constructor(){
            this._partials = new Float64Array(32), this._n = 0;
        }
        add(x) {
            const p = this._partials;
            let i = 0;
            for(let j = 0; j < this._n && j < 32; j++){
                const y = p[j], hi = x + y, lo = Math.abs(x) < Math.abs(y) ? x - (hi - y) : y - (hi - x);
                lo && (p[i++] = lo), x = hi;
            }
            return p[i] = x, this._n = i + 1, this;
        }
        valueOf() {
            const p = this._partials;
            let n = this._n, x, y, lo, hi = 0;
            if (n > 0) {
                for(hi = p[--n]; n > 0 && (hi = (x = hi) + (y = p[--n]), !(lo = y - (hi - x))););
                n > 0 && (lo < 0 && p[n - 1] < 0 || lo > 0 && p[n - 1] > 0) && (x = hi + (y = 2 * lo), y == x - hi && (hi = x));
            }
            return hi;
        }
    }
    function identity(x) {
        return x;
    }
    function unique(values) {
        if (1 !== values.length) throw Error("duplicate key");
        return values[0];
    }
    function nest(values, map, reduce, keys) {
        return function regroup(values, i) {
            if (i >= keys.length) return reduce(values);
            const groups = new Map(), keyof = keys[i++];
            let index = -1;
            for (const value of values){
                const key = keyof(value, ++index, values), group = groups.get(key);
                group ? group.push(value) : groups.set(key, [
                    value
                ]);
            }
            for (const [key, values] of groups)groups.set(key, regroup(values, i));
            return map(groups);
        }(values, 0);
    }
    var slice = Array.prototype.slice;
    function constant(x) {
        return function() {
            return x;
        };
    }
    var e10 = Math.sqrt(50), e5 = Math.sqrt(10), e2 = Math.sqrt(2);
    function ticks(start, stop, count) {
        var reverse, n, ticks, step, i = -1;
        if (count = +count, (start = +start) == (stop = +stop) && count > 0) return [
            start
        ];
        if ((reverse = stop < start) && (n = start, start = stop, stop = n), 0 === (step = tickIncrement(start, stop, count)) || !isFinite(step)) return [];
        if (step > 0) for(start = Math.ceil(start / step), ticks = Array(n = Math.ceil((stop = Math.floor(stop / step)) - start + 1)); ++i < n;)ticks[i] = (start + i) * step;
        else for(start = Math.ceil(start * (step = -step)), ticks = Array(n = Math.ceil((stop = Math.floor(stop * step)) - start + 1)); ++i < n;)ticks[i] = (start + i) / step;
        return reverse && ticks.reverse(), ticks;
    }
    function tickIncrement(start, stop, count) {
        var step = (stop - start) / Math.max(0, count), power = Math.floor(Math.log(step) / Math.LN10), error = step / Math.pow(10, power);
        return power >= 0 ? (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1) * Math.pow(10, power) : -Math.pow(10, -power) / (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1);
    }
    function tickStep(start, stop, count) {
        var step0 = Math.abs(stop - start) / Math.max(0, count), step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10)), error = step0 / step1;
        return error >= e10 ? step1 *= 10 : error >= e5 ? step1 *= 5 : error >= e2 && (step1 *= 2), stop < start ? -step1 : step1;
    }
    function nice(start, stop, count) {
        let prestep;
        for(;;){
            const step = tickIncrement(start, stop, count);
            if (step === prestep || 0 === step || !isFinite(step)) return [
                start,
                stop
            ];
            step > 0 ? (start = Math.floor(start / step) * step, stop = Math.ceil(stop / step) * step) : step < 0 && (start = Math.ceil(start * step) / step, stop = Math.floor(stop * step) / step), prestep = step;
        }
    }
    function thresholdSturges(values) {
        return Math.ceil(Math.log(count(values)) / Math.LN2) + 1;
    }
    function bin() {
        var value = identity, domain = extent, threshold = thresholdSturges;
        function histogram(data) {
            Array.isArray(data) || (data = Array.from(data));
            var i, x, n = data.length, values = Array(n);
            for(i = 0; i < n; ++i)values[i] = value(data[i], i, data);
            var xz = domain(values), x0 = xz[0], x1 = xz[1], tz = threshold(values, x0, x1);
            // Convert number of thresholds into uniform thresholds, and nice the
            // default domain accordingly.
            if (!Array.isArray(tz)) {
                const max = x1, tn = +tz;
                // If the last threshold is coincident with the domain’s upper bound, the
                // last bin will be zero-width. If the default domain is used, and this
                // last threshold is coincident with the maximum input value, we can
                // extend the niced upper bound by one tick to ensure uniform bin widths;
                // otherwise, we simply remove the last threshold. Note that we don’t
                // coerce values or the domain to numbers, and thus must be careful to
                // compare order (>=) rather than strict equality (===)!
                if (domain === extent && ([x0, x1] = nice(x0, x1, tn)), (tz = ticks(x0, x1, tn))[tz.length - 1] >= x1) {
                    if (max >= x1 && domain === extent) {
                        const step = tickIncrement(x0, x1, tn);
                        isFinite(step) && (step > 0 ? x1 = (Math.floor(x1 / step) + 1) * step : step < 0 && (x1 = -((Math.ceil(-(x1 * step)) + 1) / step)));
                    } else tz.pop();
                }
            }
            for(// Remove any thresholds outside the domain.
            var m = tz.length; tz[0] <= x0;)tz.shift(), --m;
            for(; tz[m - 1] > x1;)tz.pop(), --m;
            var bin, bins = Array(m + 1);
            // Initialize bins.
            for(i = 0; i <= m; ++i)(bin = bins[i] = []).x0 = i > 0 ? tz[i - 1] : x0, bin.x1 = i < m ? tz[i] : x1;
            // Assign data to bins by value, ignoring any outside the domain.
            for(i = 0; i < n; ++i)x0 <= (x = values[i]) && x <= x1 && bins[bisectRight(tz, x, 0, m)].push(data[i]);
            return bins;
        }
        return histogram.value = function(_) {
            return arguments.length ? (value = "function" == typeof _ ? _ : constant(_), histogram) : value;
        }, histogram.domain = function(_) {
            return arguments.length ? (domain = "function" == typeof _ ? _ : constant([
                _[0],
                _[1]
            ]), histogram) : domain;
        }, histogram.thresholds = function(_) {
            return arguments.length ? (threshold = "function" == typeof _ ? _ : Array.isArray(_) ? constant(slice.call(_)) : constant(_), histogram) : threshold;
        }, histogram;
    }
    function max(values, valueof) {
        let max;
        if (void 0 === valueof) for (const value of values)null != value && (max < value || void 0 === max && value >= value) && (max = value);
        else {
            let index = -1;
            for (let value of values)null != (value = valueof(value, ++index, values)) && (max < value || void 0 === max && value >= value) && (max = value);
        }
        return max;
    }
    function min(values, valueof) {
        let min;
        if (void 0 === valueof) for (const value of values)null != value && (min > value || void 0 === min && value >= value) && (min = value);
        else {
            let index = -1;
            for (let value of values)null != (value = valueof(value, ++index, values)) && (min > value || void 0 === min && value >= value) && (min = value);
        }
        return min;
    }
    // Based on https://github.com/mourner/quickselect
    // ISC license, Copyright 2018 Vladimir Agafonkin.
    function quickselect(array, k, left = 0, right = array.length - 1, compare = ascending) {
        for(; right > left;){
            if (right - left > 600) {
                const n = right - left + 1, m = k - left + 1, z = Math.log(n), s = 0.5 * Math.exp(2 * z / 3), sd = 0.5 * Math.sqrt(z * s * (n - s) / n) * (m - n / 2 < 0 ? -1 : 1), newLeft = Math.max(left, Math.floor(k - m * s / n + sd)), newRight = Math.min(right, Math.floor(k + (n - m) * s / n + sd));
                quickselect(array, k, newLeft, newRight, compare);
            }
            const t = array[k];
            let i = left, j = right;
            for(swap(array, left, k), compare(array[right], t) > 0 && swap(array, left, right); i < j;){
                for(swap(array, i, j), ++i, --j; 0 > compare(array[i], t);)++i;
                for(; compare(array[j], t) > 0;)--j;
            }
            0 === compare(array[left], t) ? swap(array, left, j) : swap(array, ++j, right), j <= k && (left = j + 1), k <= j && (right = j - 1);
        }
        return array;
    }
    function swap(array, i, j) {
        const t = array[i];
        array[i] = array[j], array[j] = t;
    }
    function quantile(values, p, valueof) {
        if (n = (values = Float64Array.from(function*(values, valueof) {
            if (void 0 === valueof) for (let value of values)null != value && (value = +value) >= value && (yield value);
            else {
                let index = -1;
                for (let value of values)null != (value = valueof(value, ++index, values)) && (value = +value) >= value && (yield value);
            }
        }(values, valueof))).length) {
            if ((p = +p) <= 0 || n < 2) return min(values);
            if (p >= 1) return max(values);
            var n, i = (n - 1) * p, i0 = Math.floor(i), value0 = max(quickselect(values, i0).subarray(0, i0 + 1));
            return value0 + (min(values.subarray(i0 + 1)) - value0) * (i - i0);
        }
    }
    function quantileSorted(values, p, valueof = number) {
        if (n = values.length) {
            if ((p = +p) <= 0 || n < 2) return +valueof(values[0], 0, values);
            if (p >= 1) return +valueof(values[n - 1], n - 1, values);
            var n, i = (n - 1) * p, i0 = Math.floor(i), value0 = +valueof(values[i0], i0, values);
            return value0 + (+valueof(values[i0 + 1], i0 + 1, values) - value0) * (i - i0);
        }
    }
    function maxIndex(values, valueof) {
        let max;
        let maxIndex = -1, index = -1;
        if (void 0 === valueof) for (const value of values)++index, null != value && (max < value || void 0 === max && value >= value) && (max = value, maxIndex = index);
        else for (let value of values)null != (value = valueof(value, ++index, values)) && (max < value || void 0 === max && value >= value) && (max = value, maxIndex = index);
        return maxIndex;
    }
    function merge(arrays) {
        return Array.from(function*(arrays) {
            for (const array of arrays)yield* array;
        }(arrays));
    }
    function minIndex(values, valueof) {
        let min;
        let minIndex = -1, index = -1;
        if (void 0 === valueof) for (const value of values)++index, null != value && (min > value || void 0 === min && value >= value) && (min = value, minIndex = index);
        else for (let value of values)null != (value = valueof(value, ++index, values)) && (min > value || void 0 === min && value >= value) && (min = value, minIndex = index);
        return minIndex;
    }
    function pair(a, b) {
        return [
            a,
            b
        ];
    }
    function permute(source, keys) {
        return Array.from(keys, (key)=>source[key]);
    }
    function sequence(start, stop, step) {
        start = +start, stop = +stop, step = (n = arguments.length) < 2 ? (stop = start, start = 0, 1) : n < 3 ? 1 : +step;
        for(var i = -1, n = 0 | Math.max(0, Math.ceil((stop - start) / step)), range = Array(n); ++i < n;)range[i] = start + i * step;
        return range;
    }
    function leastIndex(values, compare = ascending) {
        let minValue;
        if (1 === compare.length) return minIndex(values, compare);
        let min = -1, index = -1;
        for (const value of values)++index, (min < 0 ? 0 === compare(value, value) : 0 > compare(value, minValue)) && (minValue = value, min = index);
        return min;
    }
    var shuffle = shuffler(Math.random);
    function shuffler(random) {
        return function(array, i0 = 0, i1 = array.length) {
            let m = i1 - (i0 = +i0);
            for(; m;){
                const i = random() * m-- | 0, t = array[m + i0];
                array[m + i0] = array[i + i0], array[i + i0] = t;
            }
            return array;
        };
    }
    function transpose(matrix) {
        if (!(n = matrix.length)) return [];
        for(var i = -1, m = min(matrix, length$1), transpose = Array(m); ++i < m;)for(var n, j = -1, row = transpose[i] = Array(n); ++j < n;)row[j] = matrix[j][i];
        return transpose;
    }
    function length$1(d) {
        return d.length;
    }
    function set(values) {
        return values instanceof Set ? values : new Set(values);
    }
    function superset(values, other) {
        const iterator = values[Symbol.iterator](), set = new Set();
        for (const o of other){
            let value, done;
            if (!set.has(o)) for(; { value, done } = iterator.next();){
                if (done) return !1;
                if (set.add(value), Object.is(o, value)) break;
            }
        }
        return !0;
    }
    var slice$1 = Array.prototype.slice;
    function identity$1(x) {
        return x;
    }
    function translateX(x) {
        return "translate(" + (x + 0.5) + ",0)";
    }
    function translateY(y) {
        return "translate(0," + (y + 0.5) + ")";
    }
    function entering() {
        return !this.__axis;
    }
    function axis(orient, scale) {
        var tickArguments = [], tickValues = null, tickFormat = null, tickSizeInner = 6, tickSizeOuter = 6, tickPadding = 3, k = 1 === orient || 4 === orient ? -1 : 1, x = 4 === orient || 2 === orient ? "x" : "y", transform = 1 === orient || 3 === orient ? translateX : translateY;
        function axis(context) {
            var values = null == tickValues ? scale.ticks ? scale.ticks.apply(scale, tickArguments) : scale.domain() : tickValues, format = null == tickFormat ? scale.tickFormat ? scale.tickFormat.apply(scale, tickArguments) : identity$1 : tickFormat, spacing = Math.max(tickSizeInner, 0) + tickPadding, range = scale.range(), range0 = +range[0] + 0.5, range1 = +range[range.length - 1] + 0.5, position = (scale.bandwidth ? function(scale) {
                var offset = Math.max(0, scale.bandwidth() - 1) / 2; // Adjust for 0.5px offset.
                return scale.round() && (offset = Math.round(offset)), function(d) {
                    return +scale(d) + offset;
                };
            } : function(scale) {
                return (d)=>+scale(d);
            })(scale.copy()), selection = context.selection ? context.selection() : context, path = selection.selectAll(".domain").data([
                null
            ]), tick = selection.selectAll(".tick").data(values, scale).order(), tickExit = tick.exit(), tickEnter = tick.enter().append("g").attr("class", "tick"), line = tick.select("line"), text = tick.select("text");
            path = path.merge(path.enter().insert("path", ".tick").attr("class", "domain").attr("stroke", "currentColor")), tick = tick.merge(tickEnter), line = line.merge(tickEnter.append("line").attr("stroke", "currentColor").attr(x + "2", k * tickSizeInner)), text = text.merge(tickEnter.append("text").attr("fill", "currentColor").attr(x, k * spacing).attr("dy", 1 === orient ? "0em" : 3 === orient ? "0.71em" : "0.32em")), context !== selection && (path = path.transition(context), tick = tick.transition(context), line = line.transition(context), text = text.transition(context), tickExit = tickExit.transition(context).attr("opacity", 1e-6).attr("transform", function(d) {
                return isFinite(d = position(d)) ? transform(d) : this.getAttribute("transform");
            }), tickEnter.attr("opacity", 1e-6).attr("transform", function(d) {
                var p = this.parentNode.__axis;
                return transform(p && isFinite(p = p(d)) ? p : position(d));
            })), tickExit.remove(), path.attr("d", 4 === orient || 2 == orient ? tickSizeOuter ? "M" + k * tickSizeOuter + "," + range0 + "H0.5V" + range1 + "H" + k * tickSizeOuter : "M0.5," + range0 + "V" + range1 : tickSizeOuter ? "M" + range0 + "," + k * tickSizeOuter + "V0.5H" + range1 + "V" + k * tickSizeOuter : "M" + range0 + ",0.5H" + range1), tick.attr("opacity", 1).attr("transform", function(d) {
                return transform(position(d));
            }), line.attr(x + "2", k * tickSizeInner), text.attr(x, k * spacing).text(format), selection.filter(entering).attr("fill", "none").attr("font-size", 10).attr("font-family", "sans-serif").attr("text-anchor", 2 === orient ? "start" : 4 === orient ? "end" : "middle"), selection.each(function() {
                this.__axis = position;
            });
        }
        return axis.scale = function(_) {
            return arguments.length ? (scale = _, axis) : scale;
        }, axis.ticks = function() {
            return tickArguments = slice$1.call(arguments), axis;
        }, axis.tickArguments = function(_) {
            return arguments.length ? (tickArguments = null == _ ? [] : slice$1.call(_), axis) : tickArguments.slice();
        }, axis.tickValues = function(_) {
            return arguments.length ? (tickValues = null == _ ? null : slice$1.call(_), axis) : tickValues && tickValues.slice();
        }, axis.tickFormat = function(_) {
            return arguments.length ? (tickFormat = _, axis) : tickFormat;
        }, axis.tickSize = function(_) {
            return arguments.length ? (tickSizeInner = tickSizeOuter = +_, axis) : tickSizeInner;
        }, axis.tickSizeInner = function(_) {
            return arguments.length ? (tickSizeInner = +_, axis) : tickSizeInner;
        }, axis.tickSizeOuter = function(_) {
            return arguments.length ? (tickSizeOuter = +_, axis) : tickSizeOuter;
        }, axis.tickPadding = function(_) {
            return arguments.length ? (tickPadding = +_, axis) : tickPadding;
        }, axis;
    }
    var noop = {
        value: ()=>{}
    };
    function dispatch() {
        for(var t, i = 0, n = arguments.length, _ = {}; i < n; ++i){
            if (!(t = arguments[i] + "") || t in _ || /[\s.]/.test(t)) throw Error("illegal type: " + t);
            _[t] = [];
        }
        return new Dispatch(_);
    }
    function Dispatch(_) {
        this._ = _;
    }
    function set$1(type, name, callback) {
        for(var i = 0, n = type.length; i < n; ++i)if (type[i].name === name) {
            type[i] = noop, type = type.slice(0, i).concat(type.slice(i + 1));
            break;
        }
        return null != callback && type.push({
            name: name,
            value: callback
        }), type;
    }
    Dispatch.prototype = dispatch.prototype = {
        constructor: Dispatch,
        on: function(typename, callback) {
            var t, _ = this._, T = (typename + "").trim().split(/^|\s+/).map(function(t) {
                var name = "", i = t.indexOf(".");
                if (i >= 0 && (name = t.slice(i + 1), t = t.slice(0, i)), t && !_.hasOwnProperty(t)) throw Error("unknown type: " + t);
                return {
                    type: t,
                    name: name
                };
            }), i = -1, n = T.length;
            // If no callback was specified, return the callback of the given type and name.
            if (arguments.length < 2) {
                for(; ++i < n;)if ((t = (typename = T[i]).type) && (t = function(type, name) {
                    for(var c, i = 0, n = type.length; i < n; ++i)if ((c = type[i]).name === name) return c.value;
                }(_[t], typename.name))) return t;
                return;
            }
            // If a type was specified, set the callback for the given type and name.
            // Otherwise, if a null callback was specified, remove callbacks of the given name.
            if (null != callback && "function" != typeof callback) throw Error("invalid callback: " + callback);
            for(; ++i < n;)if (t = (typename = T[i]).type) _[t] = set$1(_[t], typename.name, callback);
            else if (null == callback) for(t in _)_[t] = set$1(_[t], typename.name, null);
            return this;
        },
        copy: function() {
            var copy = {}, _ = this._;
            for(var t in _)copy[t] = _[t].slice();
            return new Dispatch(copy);
        },
        call: function(type, that) {
            if ((n = arguments.length - 2) > 0) for(var n, t, args = Array(n), i = 0; i < n; ++i)args[i] = arguments[i + 2];
            if (!this._.hasOwnProperty(type)) throw Error("unknown type: " + type);
            for(t = this._[type], i = 0, n = t.length; i < n; ++i)t[i].value.apply(that, args);
        },
        apply: function(type, that, args) {
            if (!this._.hasOwnProperty(type)) throw Error("unknown type: " + type);
            for(var t = this._[type], i = 0, n = t.length; i < n; ++i)t[i].value.apply(that, args);
        }
    };
    var xhtml = "http://www.w3.org/1999/xhtml", namespaces = {
        svg: "http://www.w3.org/2000/svg",
        xhtml: xhtml,
        xlink: "http://www.w3.org/1999/xlink",
        xml: "http://www.w3.org/XML/1998/namespace",
        xmlns: "http://www.w3.org/2000/xmlns/"
    };
    function namespace(name) {
        var prefix = name += "", i = prefix.indexOf(":");
        return i >= 0 && "xmlns" !== (prefix = name.slice(0, i)) && (name = name.slice(i + 1)), namespaces.hasOwnProperty(prefix) ? {
            space: namespaces[prefix],
            local: name
        } : name; // eslint-disable-line no-prototype-builtins
    }
    function creator(name) {
        var fullname = namespace(name);
        return (fullname.local ? function(fullname) {
            return function() {
                return this.ownerDocument.createElementNS(fullname.space, fullname.local);
            };
        } : function(name) {
            return function() {
                var document1 = this.ownerDocument, uri = this.namespaceURI;
                return uri === xhtml && document1.documentElement.namespaceURI === xhtml ? document1.createElement(name) : document1.createElementNS(uri, name);
            };
        })(fullname);
    }
    function none() {}
    function selector(selector) {
        return null == selector ? none : function() {
            return this.querySelector(selector);
        };
    }
    function array$1(x) {
        return "object" == typeof x && "length" in x ? x // Array, TypedArray, NodeList, array-like
         : Array.from(x); // Map, Set, iterable, string, or anything else
    }
    function empty$1() {
        return [];
    }
    function selectorAll(selector) {
        return null == selector ? empty$1 : function() {
            return this.querySelectorAll(selector);
        };
    }
    function matcher(selector) {
        return function() {
            return this.matches(selector);
        };
    }
    function childMatcher(selector) {
        return function(node) {
            return node.matches(selector);
        };
    }
    var find = Array.prototype.find;
    function childFirst() {
        return this.firstElementChild;
    }
    var filter$1 = Array.prototype.filter;
    function children() {
        return this.children;
    }
    function sparse(update) {
        return Array(update.length);
    }
    function EnterNode(parent, datum) {
        this.ownerDocument = parent.ownerDocument, this.namespaceURI = parent.namespaceURI, this._next = null, this._parent = parent, this.__data__ = datum;
    }
    function bindIndex(parent, group, enter, update, exit, data) {
        // Put any non-null nodes that fit into update.
        // Put any null nodes into enter.
        // Put any remaining data into enter.
        for(var node, i = 0, groupLength = group.length, dataLength = data.length; i < dataLength; ++i)(node = group[i]) ? (node.__data__ = data[i], update[i] = node) : enter[i] = new EnterNode(parent, data[i]);
        // Put any non-null nodes that don’t fit into exit.
        for(; i < groupLength; ++i)(node = group[i]) && (exit[i] = node);
    }
    function bindKey(parent, group, enter, update, exit, data, key) {
        var i, node, keyValue, nodeByKeyValue = new Map, groupLength = group.length, dataLength = data.length, keyValues = Array(groupLength);
        // Compute the key for each node.
        // If multiple nodes have the same key, the duplicates are added to exit.
        for(i = 0; i < groupLength; ++i)(node = group[i]) && (keyValues[i] = keyValue = key.call(node, node.__data__, i, group) + "", nodeByKeyValue.has(keyValue) ? exit[i] = node : nodeByKeyValue.set(keyValue, node));
        // Compute the key for each datum.
        // If there a node associated with this key, join and add it to update.
        // If there is not (or the key is a duplicate), add it to enter.
        for(i = 0; i < dataLength; ++i)keyValue = key.call(parent, data[i], i, data) + "", (node = nodeByKeyValue.get(keyValue)) ? (update[i] = node, node.__data__ = data[i], nodeByKeyValue.delete(keyValue)) : enter[i] = new EnterNode(parent, data[i]);
        // Add any remaining nodes that were not bound to data to exit.
        for(i = 0; i < groupLength; ++i)(node = group[i]) && nodeByKeyValue.get(keyValues[i]) === node && (exit[i] = node);
    }
    function datum(node) {
        return node.__data__;
    }
    function ascending$1(a, b) {
        return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
    }
    function defaultView(node) {
        return node.ownerDocument && node.ownerDocument.defaultView // node is a Node
         || node.document && node // node is a Window
         || node.defaultView; // node is a Document
    }
    function styleValue(node, name) {
        return node.style.getPropertyValue(name) || defaultView(node).getComputedStyle(node, null).getPropertyValue(name);
    }
    function classArray(string) {
        return string.trim().split(/^|\s+/);
    }
    function classList(node) {
        return node.classList || new ClassList(node);
    }
    function ClassList(node) {
        this._node = node, this._names = classArray(node.getAttribute("class") || "");
    }
    function classedAdd(node, names) {
        for(var list = classList(node), i = -1, n = names.length; ++i < n;)list.add(names[i]);
    }
    function classedRemove(node, names) {
        for(var list = classList(node), i = -1, n = names.length; ++i < n;)list.remove(names[i]);
    }
    function textRemove() {
        this.textContent = "";
    }
    function htmlRemove() {
        this.innerHTML = "";
    }
    function raise() {
        this.nextSibling && this.parentNode.appendChild(this);
    }
    function lower() {
        this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
    }
    function constantNull() {
        return null;
    }
    function remove() {
        var parent = this.parentNode;
        parent && parent.removeChild(this);
    }
    function selection_cloneShallow() {
        var clone = this.cloneNode(!1), parent = this.parentNode;
        return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
    }
    function selection_cloneDeep() {
        var clone = this.cloneNode(!0), parent = this.parentNode;
        return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
    }
    function onRemove(typename) {
        return function() {
            var on = this.__on;
            if (on) {
                for(var o, j = 0, i = -1, m = on.length; j < m; ++j)(o = on[j], typename.type && o.type !== typename.type || o.name !== typename.name) ? on[++i] = o : this.removeEventListener(o.type, o.listener, o.options);
                ++i ? on.length = i : delete this.__on;
            }
        };
    }
    function onAdd(typename, value, options) {
        return function() {
            var o, on = this.__on, listener = function(event) {
                value.call(this, event, this.__data__);
            };
            if (on) {
                for(var j = 0, m = on.length; j < m; ++j)if ((o = on[j]).type === typename.type && o.name === typename.name) {
                    this.removeEventListener(o.type, o.listener, o.options), this.addEventListener(o.type, o.listener = listener, o.options = options), o.value = value;
                    return;
                }
            }
            this.addEventListener(typename.type, listener, options), o = {
                type: typename.type,
                name: typename.name,
                value: value,
                listener: listener,
                options: options
            }, on ? on.push(o) : this.__on = [
                o
            ];
        };
    }
    function dispatchEvent(node, type, params) {
        var window1 = defaultView(node), event = window1.CustomEvent;
        "function" == typeof event ? event = new event(type, params) : (event = window1.document.createEvent("Event"), params ? (event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail) : event.initEvent(type, !1, !1)), node.dispatchEvent(event);
    }
    EnterNode.prototype = {
        constructor: EnterNode,
        appendChild: function(child) {
            return this._parent.insertBefore(child, this._next);
        },
        insertBefore: function(child, next) {
            return this._parent.insertBefore(child, next);
        },
        querySelector: function(selector) {
            return this._parent.querySelector(selector);
        },
        querySelectorAll: function(selector) {
            return this._parent.querySelectorAll(selector);
        }
    }, ClassList.prototype = {
        add: function(name) {
            0 > this._names.indexOf(name) && (this._names.push(name), this._node.setAttribute("class", this._names.join(" ")));
        },
        remove: function(name) {
            var i = this._names.indexOf(name);
            i >= 0 && (this._names.splice(i, 1), this._node.setAttribute("class", this._names.join(" ")));
        },
        contains: function(name) {
            return this._names.indexOf(name) >= 0;
        }
    };
    var root = [
        null
    ];
    function Selection(groups, parents) {
        this._groups = groups, this._parents = parents;
    }
    function selection() {
        return new Selection([
            [
                document.documentElement
            ]
        ], root);
    }
    function select(selector) {
        return "string" == typeof selector ? new Selection([
            [
                document.querySelector(selector)
            ]
        ], [
            document.documentElement
        ]) : new Selection([
            [
                selector
            ]
        ], root);
    }
    Selection.prototype = selection.prototype = {
        constructor: Selection,
        select: function(select) {
            "function" != typeof select && (select = selector(select));
            for(var groups = this._groups, m = groups.length, subgroups = Array(m), j = 0; j < m; ++j)for(var node, subnode, group = groups[j], n = group.length, subgroup = subgroups[j] = Array(n), i = 0; i < n; ++i)(node = group[i]) && (subnode = select.call(node, node.__data__, i, group)) && ("__data__" in node && (subnode.__data__ = node.__data__), subgroup[i] = subnode);
            return new Selection(subgroups, this._parents);
        },
        selectAll: function(select) {
            if ("function" == typeof select) {
                var select1;
                select1 = select, select = function() {
                    var group = select1.apply(this, arguments);
                    return null == group ? [] : array$1(group);
                };
            } else select = selectorAll(select);
            for(var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j)for(var node, group = groups[j], n = group.length, i = 0; i < n; ++i)(node = group[i]) && (subgroups.push(select.call(node, node.__data__, i, group)), parents.push(node));
            return new Selection(subgroups, parents);
        },
        selectChild: function(match) {
            var match1;
            return this.select(null == match ? childFirst : (match1 = "function" == typeof match ? match : childMatcher(match), function() {
                return find.call(this.children, match1);
            }));
        },
        selectChildren: function(match) {
            var match1;
            return this.selectAll(null == match ? children : (match1 = "function" == typeof match ? match : childMatcher(match), function() {
                return filter$1.call(this.children, match1);
            }));
        },
        filter: function(match) {
            "function" != typeof match && (match = matcher(match));
            for(var groups = this._groups, m = groups.length, subgroups = Array(m), j = 0; j < m; ++j)for(var node, group = groups[j], n = group.length, subgroup = subgroups[j] = [], i = 0; i < n; ++i)(node = group[i]) && match.call(node, node.__data__, i, group) && subgroup.push(node);
            return new Selection(subgroups, this._parents);
        },
        data: function(value, key) {
            if (!arguments.length) return Array.from(this, datum);
            var bind = key ? bindKey : bindIndex, parents = this._parents, groups = this._groups;
            "function" != typeof value && (x = value, value = function() {
                return x;
            });
            for(var m = groups.length, update = Array(m), enter = Array(m), exit = Array(m), j = 0; j < m; ++j){
                var parent = parents[j], group = groups[j], groupLength = group.length, data = array$1(value.call(parent, parent && parent.__data__, j, parents)), dataLength = data.length, enterGroup = enter[j] = Array(dataLength), updateGroup = update[j] = Array(dataLength);
                bind(parent, group, enterGroup, updateGroup, exit[j] = Array(groupLength), data, key);
                // Now connect the enter nodes to their following update node, such that
                // appendChild can insert the materialized enter node before this node,
                // rather than at the end of the parent node.
                for(var x, previous, next, i0 = 0, i1 = 0; i0 < dataLength; ++i0)if (previous = enterGroup[i0]) {
                    for(i0 >= i1 && (i1 = i0 + 1); !(next = updateGroup[i1]) && ++i1 < dataLength;);
                    previous._next = next || null;
                }
            }
            return (update = new Selection(update, parents))._enter = enter, update._exit = exit, update;
        },
        enter: function() {
            return new Selection(this._enter || this._groups.map(sparse), this._parents);
        },
        exit: function() {
            return new Selection(this._exit || this._groups.map(sparse), this._parents);
        },
        join: function(onenter, onupdate, onexit) {
            var enter = this.enter(), update = this, exit = this.exit();
            return enter = "function" == typeof onenter ? onenter(enter) : enter.append(onenter + ""), null != onupdate && (update = onupdate(update)), null == onexit ? exit.remove() : onexit(exit), enter && update ? enter.merge(update).order() : update;
        },
        merge: function(selection) {
            if (!(selection instanceof Selection)) throw Error("invalid merge");
            for(var groups0 = this._groups, groups1 = selection._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = Array(m0), j = 0; j < m; ++j)for(var node, group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = Array(n), i = 0; i < n; ++i)(node = group0[i] || group1[i]) && (merge[i] = node);
            for(; j < m0; ++j)merges[j] = groups0[j];
            return new Selection(merges, this._parents);
        },
        selection: function() {
            return this;
        },
        order: function() {
            for(var groups = this._groups, j = -1, m = groups.length; ++j < m;)for(var node, group = groups[j], i = group.length - 1, next = group[i]; --i >= 0;)(node = group[i]) && (next && 4 ^ node.compareDocumentPosition(next) && next.parentNode.insertBefore(node, next), next = node);
            return this;
        },
        sort: function(compare) {
            function compareNode(a, b) {
                return a && b ? compare(a.__data__, b.__data__) : !a - !b;
            }
            compare || (compare = ascending$1);
            for(var groups = this._groups, m = groups.length, sortgroups = Array(m), j = 0; j < m; ++j){
                for(var node, group = groups[j], n = group.length, sortgroup = sortgroups[j] = Array(n), i = 0; i < n; ++i)(node = group[i]) && (sortgroup[i] = node);
                sortgroup.sort(compareNode);
            }
            return new Selection(sortgroups, this._parents).order();
        },
        call: function() {
            var callback = arguments[0];
            return arguments[0] = this, callback.apply(null, arguments), this;
        },
        nodes: function() {
            return Array.from(this);
        },
        node: function() {
            for(var groups = this._groups, j = 0, m = groups.length; j < m; ++j)for(var group = groups[j], i = 0, n = group.length; i < n; ++i){
                var node = group[i];
                if (node) return node;
            }
            return null;
        },
        size: function() {
            let size = 0;
            for (const node of this)++size; // eslint-disable-line no-unused-vars
            return size;
        },
        empty: function() {
            return !this.node();
        },
        each: function(callback) {
            for(var groups = this._groups, j = 0, m = groups.length; j < m; ++j)for(var node, group = groups[j], i = 0, n = group.length; i < n; ++i)(node = group[i]) && callback.call(node, node.__data__, i, group);
            return this;
        },
        attr: function(name, value) {
            var fullname = namespace(name);
            if (arguments.length < 2) {
                var node = this.node();
                return fullname.local ? node.getAttributeNS(fullname.space, fullname.local) : node.getAttribute(fullname);
            }
            return this.each((null == value ? fullname.local ? function(fullname) {
                return function() {
                    this.removeAttributeNS(fullname.space, fullname.local);
                };
            } : function(name) {
                return function() {
                    this.removeAttribute(name);
                };
            } : "function" == typeof value ? fullname.local ? function(fullname, value) {
                return function() {
                    var v = value.apply(this, arguments);
                    null == v ? this.removeAttributeNS(fullname.space, fullname.local) : this.setAttributeNS(fullname.space, fullname.local, v);
                };
            } : function(name, value) {
                return function() {
                    var v = value.apply(this, arguments);
                    null == v ? this.removeAttribute(name) : this.setAttribute(name, v);
                };
            } : fullname.local ? function(fullname, value) {
                return function() {
                    this.setAttributeNS(fullname.space, fullname.local, value);
                };
            } : function(name, value) {
                return function() {
                    this.setAttribute(name, value);
                };
            })(fullname, value));
        },
        style: function(name, value, priority) {
            return arguments.length > 1 ? this.each((null == value ? function(name) {
                return function() {
                    this.style.removeProperty(name);
                };
            } : "function" == typeof value ? function(name, value, priority) {
                return function() {
                    var v = value.apply(this, arguments);
                    null == v ? this.style.removeProperty(name) : this.style.setProperty(name, v, priority);
                };
            } : function(name, value, priority) {
                return function() {
                    this.style.setProperty(name, value, priority);
                };
            })(name, value, null == priority ? "" : priority)) : styleValue(this.node(), name);
        },
        property: function(name, value) {
            return arguments.length > 1 ? this.each((null == value ? function(name) {
                return function() {
                    delete this[name];
                };
            } : "function" == typeof value ? function(name, value) {
                return function() {
                    var v = value.apply(this, arguments);
                    null == v ? delete this[name] : this[name] = v;
                };
            } : function(name, value) {
                return function() {
                    this[name] = value;
                };
            })(name, value)) : this.node()[name];
        },
        classed: function(name, value) {
            var names = classArray(name + "");
            if (arguments.length < 2) {
                for(var list = classList(this.node()), i = -1, n = names.length; ++i < n;)if (!list.contains(names[i])) return !1;
                return !0;
            }
            return this.each(("function" == typeof value ? function(names, value) {
                return function() {
                    (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
                };
            } : value ? function(names) {
                return function() {
                    classedAdd(this, names);
                };
            } : function(names) {
                return function() {
                    classedRemove(this, names);
                };
            })(names, value));
        },
        text: function(value) {
            return arguments.length ? this.each(null == value ? textRemove : ("function" == typeof value ? function(value) {
                return function() {
                    var v = value.apply(this, arguments);
                    this.textContent = null == v ? "" : v;
                };
            } : function(value) {
                return function() {
                    this.textContent = value;
                };
            })(value)) : this.node().textContent;
        },
        html: function(value) {
            return arguments.length ? this.each(null == value ? htmlRemove : ("function" == typeof value ? function(value) {
                return function() {
                    var v = value.apply(this, arguments);
                    this.innerHTML = null == v ? "" : v;
                };
            } : function(value) {
                return function() {
                    this.innerHTML = value;
                };
            })(value)) : this.node().innerHTML;
        },
        raise: function() {
            return this.each(raise);
        },
        lower: function() {
            return this.each(lower);
        },
        append: function(name) {
            var create = "function" == typeof name ? name : creator(name);
            return this.select(function() {
                return this.appendChild(create.apply(this, arguments));
            });
        },
        insert: function(name, before) {
            var create = "function" == typeof name ? name : creator(name), select = null == before ? constantNull : "function" == typeof before ? before : selector(before);
            return this.select(function() {
                return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
            });
        },
        remove: function() {
            return this.each(remove);
        },
        clone: function(deep) {
            return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
        },
        datum: function(value) {
            return arguments.length ? this.property("__data__", value) : this.node().__data__;
        },
        on: function(typename, value, options) {
            var i, t, typenames = (typename + "").trim().split(/^|\s+/).map(function(t) {
                var name = "", i = t.indexOf(".");
                return i >= 0 && (name = t.slice(i + 1), t = t.slice(0, i)), {
                    type: t,
                    name: name
                };
            }), n = typenames.length;
            if (arguments.length < 2) {
                var on = this.node().__on;
                if (on) {
                    for(var o, j = 0, m = on.length; j < m; ++j)for(i = 0, o = on[j]; i < n; ++i)if ((t = typenames[i]).type === o.type && t.name === o.name) return o.value;
                }
                return;
            }
            for(i = 0, on = value ? onAdd : onRemove; i < n; ++i)this.each(on(typenames[i], value, options));
            return this;
        },
        dispatch: function(type, params) {
            return this.each(("function" == typeof params ? function(type, params) {
                return function() {
                    return dispatchEvent(this, type, params.apply(this, arguments));
                };
            } : function(type, params) {
                return function() {
                    return dispatchEvent(this, type, params);
                };
            })(type, params));
        },
        [Symbol.iterator]: function*() {
            for(var groups = this._groups, j = 0, m = groups.length; j < m; ++j)for(var node, group = groups[j], i = 0, n = group.length; i < n; ++i)(node = group[i]) && (yield node);
        }
    };
    var nextId = 0;
    function local() {
        return new Local;
    }
    function Local() {
        this._ = "@" + (++nextId).toString(36);
    }
    function sourceEvent(event) {
        let sourceEvent;
        for(; sourceEvent = event.sourceEvent;)event = sourceEvent;
        return event;
    }
    function pointer(event, node) {
        if (event = sourceEvent(event), void 0 === node && (node = event.currentTarget), node) {
            var svg = node.ownerSVGElement || node;
            if (svg.createSVGPoint) {
                var point = svg.createSVGPoint();
                return point.x = event.clientX, point.y = event.clientY, [
                    (point = point.matrixTransform(node.getScreenCTM().inverse())).x,
                    point.y
                ];
            }
            if (node.getBoundingClientRect) {
                var rect = node.getBoundingClientRect();
                return [
                    event.clientX - rect.left - node.clientLeft,
                    event.clientY - rect.top - node.clientTop
                ];
            }
        }
        return [
            event.pageX,
            event.pageY
        ];
    }
    function nopropagation(event) {
        event.stopImmediatePropagation();
    }
    function noevent(event) {
        event.preventDefault(), event.stopImmediatePropagation();
    }
    function dragDisable(view) {
        var root = view.document.documentElement, selection = select(view).on("dragstart.drag", noevent, !0);
        "onselectstart" in root ? selection.on("selectstart.drag", noevent, !0) : (root.__noselect = root.style.MozUserSelect, root.style.MozUserSelect = "none");
    }
    function yesdrag(view, noclick) {
        var root = view.document.documentElement, selection = select(view).on("dragstart.drag", null);
        noclick && (selection.on("click.drag", noevent, !0), setTimeout(function() {
            selection.on("click.drag", null);
        }, 0)), "onselectstart" in root ? selection.on("selectstart.drag", null) : (root.style.MozUserSelect = root.__noselect, delete root.__noselect);
    }
    Local.prototype = local.prototype = {
        constructor: Local,
        get: function(node) {
            for(var id = this._; !(id in node);)if (!(node = node.parentNode)) return;
            return node[id];
        },
        set: function(node, value) {
            return node[this._] = value;
        },
        remove: function(node) {
            return this._ in node && delete node[this._];
        },
        toString: function() {
            return this._;
        }
    };
    var constant$2 = (x)=>()=>x;
    function DragEvent(type, { sourceEvent, subject, target, identifier, active, x, y, dx, dy, dispatch }) {
        Object.defineProperties(this, {
            type: {
                value: type,
                enumerable: !0,
                configurable: !0
            },
            sourceEvent: {
                value: sourceEvent,
                enumerable: !0,
                configurable: !0
            },
            subject: {
                value: subject,
                enumerable: !0,
                configurable: !0
            },
            target: {
                value: target,
                enumerable: !0,
                configurable: !0
            },
            identifier: {
                value: identifier,
                enumerable: !0,
                configurable: !0
            },
            active: {
                value: active,
                enumerable: !0,
                configurable: !0
            },
            x: {
                value: x,
                enumerable: !0,
                configurable: !0
            },
            y: {
                value: y,
                enumerable: !0,
                configurable: !0
            },
            dx: {
                value: dx,
                enumerable: !0,
                configurable: !0
            },
            dy: {
                value: dy,
                enumerable: !0,
                configurable: !0
            },
            _: {
                value: dispatch
            }
        });
    }
    // Ignore right-click, since that should open the context menu.
    function defaultFilter(event) {
        return !event.ctrlKey && !event.button;
    }
    function defaultContainer() {
        return this.parentNode;
    }
    function defaultSubject(event, d) {
        return null == d ? {
            x: event.x,
            y: event.y
        } : d;
    }
    function defaultTouchable() {
        return navigator.maxTouchPoints || "ontouchstart" in this;
    }
    function define1(constructor, factory, prototype) {
        constructor.prototype = factory.prototype = prototype, prototype.constructor = constructor;
    }
    function extend(parent, definition) {
        var prototype = Object.create(parent.prototype);
        for(var key in definition)prototype[key] = definition[key];
        return prototype;
    }
    function Color() {}
    DragEvent.prototype.on = function() {
        var value = this._.on.apply(this._, arguments);
        return value === this._ ? this : value;
    };
    var reI = "\\s*([+-]?\\d+)\\s*", reN = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*", reP = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*", reHex = /^#([0-9a-f]{3,8})$/, reRgbInteger = RegExp("^rgb\\(" + [
        reI,
        reI,
        reI
    ] + "\\)$"), reRgbPercent = RegExp("^rgb\\(" + [
        reP,
        reP,
        reP
    ] + "\\)$"), reRgbaInteger = RegExp("^rgba\\(" + [
        reI,
        reI,
        reI,
        reN
    ] + "\\)$"), reRgbaPercent = RegExp("^rgba\\(" + [
        reP,
        reP,
        reP,
        reN
    ] + "\\)$"), reHslPercent = RegExp("^hsl\\(" + [
        reN,
        reP,
        reP
    ] + "\\)$"), reHslaPercent = RegExp("^hsla\\(" + [
        reN,
        reP,
        reP,
        reN
    ] + "\\)$"), named = {
        aliceblue: 0xf0f8ff,
        antiquewhite: 0xfaebd7,
        aqua: 0x00ffff,
        aquamarine: 0x7fffd4,
        azure: 0xf0ffff,
        beige: 0xf5f5dc,
        bisque: 0xffe4c4,
        black: 0x000000,
        blanchedalmond: 0xffebcd,
        blue: 0x0000ff,
        blueviolet: 0x8a2be2,
        brown: 0xa52a2a,
        burlywood: 0xdeb887,
        cadetblue: 0x5f9ea0,
        chartreuse: 0x7fff00,
        chocolate: 0xd2691e,
        coral: 0xff7f50,
        cornflowerblue: 0x6495ed,
        cornsilk: 0xfff8dc,
        crimson: 0xdc143c,
        cyan: 0x00ffff,
        darkblue: 0x00008b,
        darkcyan: 0x008b8b,
        darkgoldenrod: 0xb8860b,
        darkgray: 0xa9a9a9,
        darkgreen: 0x006400,
        darkgrey: 0xa9a9a9,
        darkkhaki: 0xbdb76b,
        darkmagenta: 0x8b008b,
        darkolivegreen: 0x556b2f,
        darkorange: 0xff8c00,
        darkorchid: 0x9932cc,
        darkred: 0x8b0000,
        darksalmon: 0xe9967a,
        darkseagreen: 0x8fbc8f,
        darkslateblue: 0x483d8b,
        darkslategray: 0x2f4f4f,
        darkslategrey: 0x2f4f4f,
        darkturquoise: 0x00ced1,
        darkviolet: 0x9400d3,
        deeppink: 0xff1493,
        deepskyblue: 0x00bfff,
        dimgray: 0x696969,
        dimgrey: 0x696969,
        dodgerblue: 0x1e90ff,
        firebrick: 0xb22222,
        floralwhite: 0xfffaf0,
        forestgreen: 0x228b22,
        fuchsia: 0xff00ff,
        gainsboro: 0xdcdcdc,
        ghostwhite: 0xf8f8ff,
        gold: 0xffd700,
        goldenrod: 0xdaa520,
        gray: 0x808080,
        green: 0x008000,
        greenyellow: 0xadff2f,
        grey: 0x808080,
        honeydew: 0xf0fff0,
        hotpink: 0xff69b4,
        indianred: 0xcd5c5c,
        indigo: 0x4b0082,
        ivory: 0xfffff0,
        khaki: 0xf0e68c,
        lavender: 0xe6e6fa,
        lavenderblush: 0xfff0f5,
        lawngreen: 0x7cfc00,
        lemonchiffon: 0xfffacd,
        lightblue: 0xadd8e6,
        lightcoral: 0xf08080,
        lightcyan: 0xe0ffff,
        lightgoldenrodyellow: 0xfafad2,
        lightgray: 0xd3d3d3,
        lightgreen: 0x90ee90,
        lightgrey: 0xd3d3d3,
        lightpink: 0xffb6c1,
        lightsalmon: 0xffa07a,
        lightseagreen: 0x20b2aa,
        lightskyblue: 0x87cefa,
        lightslategray: 0x778899,
        lightslategrey: 0x778899,
        lightsteelblue: 0xb0c4de,
        lightyellow: 0xffffe0,
        lime: 0x00ff00,
        limegreen: 0x32cd32,
        linen: 0xfaf0e6,
        magenta: 0xff00ff,
        maroon: 0x800000,
        mediumaquamarine: 0x66cdaa,
        mediumblue: 0x0000cd,
        mediumorchid: 0xba55d3,
        mediumpurple: 0x9370db,
        mediumseagreen: 0x3cb371,
        mediumslateblue: 0x7b68ee,
        mediumspringgreen: 0x00fa9a,
        mediumturquoise: 0x48d1cc,
        mediumvioletred: 0xc71585,
        midnightblue: 0x191970,
        mintcream: 0xf5fffa,
        mistyrose: 0xffe4e1,
        moccasin: 0xffe4b5,
        navajowhite: 0xffdead,
        navy: 0x000080,
        oldlace: 0xfdf5e6,
        olive: 0x808000,
        olivedrab: 0x6b8e23,
        orange: 0xffa500,
        orangered: 0xff4500,
        orchid: 0xda70d6,
        palegoldenrod: 0xeee8aa,
        palegreen: 0x98fb98,
        paleturquoise: 0xafeeee,
        palevioletred: 0xdb7093,
        papayawhip: 0xffefd5,
        peachpuff: 0xffdab9,
        peru: 0xcd853f,
        pink: 0xffc0cb,
        plum: 0xdda0dd,
        powderblue: 0xb0e0e6,
        purple: 0x800080,
        rebeccapurple: 0x663399,
        red: 0xff0000,
        rosybrown: 0xbc8f8f,
        royalblue: 0x4169e1,
        saddlebrown: 0x8b4513,
        salmon: 0xfa8072,
        sandybrown: 0xf4a460,
        seagreen: 0x2e8b57,
        seashell: 0xfff5ee,
        sienna: 0xa0522d,
        silver: 0xc0c0c0,
        skyblue: 0x87ceeb,
        slateblue: 0x6a5acd,
        slategray: 0x708090,
        slategrey: 0x708090,
        snow: 0xfffafa,
        springgreen: 0x00ff7f,
        steelblue: 0x4682b4,
        tan: 0xd2b48c,
        teal: 0x008080,
        thistle: 0xd8bfd8,
        tomato: 0xff6347,
        turquoise: 0x40e0d0,
        violet: 0xee82ee,
        wheat: 0xf5deb3,
        white: 0xffffff,
        whitesmoke: 0xf5f5f5,
        yellow: 0xffff00,
        yellowgreen: 0x9acd32
    };
    function color_formatHex() {
        return this.rgb().formatHex();
    }
    function color_formatRgb() {
        return this.rgb().formatRgb();
    }
    function color(format) {
        var m, l;
        return format = (format + "").trim().toLowerCase(), (m = reHex.exec(format)) ? (l = m[1].length, m = parseInt(m[1], 16), 6 === l ? rgbn(m) // #ff0000
         : 3 === l ? new Rgb(m >> 8 & 0xf | m >> 4 & 0xf0, m >> 4 & 0xf | 0xf0 & m, (0xf & m) << 4 | 0xf & m, 1) // #f00
         : 8 === l ? rgba(m >> 24 & 0xff, m >> 16 & 0xff, m >> 8 & 0xff, (0xff & m) / 0xff) // #ff000000
         : 4 === l ? rgba(m >> 12 & 0xf | m >> 8 & 0xf0, m >> 8 & 0xf | m >> 4 & 0xf0, m >> 4 & 0xf | 0xf0 & m, ((0xf & m) << 4 | 0xf & m) / 0xff) // #f000
         : null // invalid hex
        ) : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
         : (m = reRgbPercent.exec(format)) ? new Rgb(255 * m[1] / 100, 255 * m[2] / 100, 255 * m[3] / 100, 1) // rgb(100%, 0%, 0%)
         : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
         : (m = reRgbaPercent.exec(format)) ? rgba(255 * m[1] / 100, 255 * m[2] / 100, 255 * m[3] / 100, m[4]) // rgb(100%, 0%, 0%, 1)
         : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
         : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
         : named.hasOwnProperty(format) ? rgbn(named[format]) // eslint-disable-line no-prototype-builtins
         : "transparent" === format ? new Rgb(NaN, NaN, NaN, 0) : null;
    }
    function rgbn(n) {
        return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, 0xff & n, 1);
    }
    function rgba(r, g, b, a) {
        return a <= 0 && (r = g = b = NaN), new Rgb(r, g, b, a);
    }
    function rgbConvert(o) {
        return (o instanceof Color || (o = color(o)), o) ? new Rgb((o = o.rgb()).r, o.g, o.b, o.opacity) : new Rgb;
    }
    function rgb(r, g, b, opacity) {
        return 1 == arguments.length ? rgbConvert(r) : new Rgb(r, g, b, null == opacity ? 1 : opacity);
    }
    function Rgb(r, g, b, opacity) {
        this.r = +r, this.g = +g, this.b = +b, this.opacity = +opacity;
    }
    function rgb_formatHex() {
        return "#" + hex(this.r) + hex(this.g) + hex(this.b);
    }
    function rgb_formatRgb() {
        var a = this.opacity;
        return (1 === (a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a))) ? "rgb(" : "rgba(") + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", " + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", " + Math.max(0, Math.min(255, Math.round(this.b) || 0)) + (1 === a ? ")" : ", " + a + ")");
    }
    function hex(value) {
        return ((value = Math.max(0, Math.min(255, Math.round(value) || 0))) < 16 ? "0" : "") + value.toString(16);
    }
    function hsla(h, s, l, a) {
        return a <= 0 ? h = s = l = NaN : l <= 0 || l >= 1 ? h = s = NaN : s <= 0 && (h = NaN), new Hsl(h, s, l, a);
    }
    function hslConvert(o) {
        if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
        if (o instanceof Color || (o = color(o)), !o) return new Hsl;
        if (o instanceof Hsl) return o;
        var r = (o = o.rgb()).r / 255, g = o.g / 255, b = o.b / 255, min = Math.min(r, g, b), max = Math.max(r, g, b), h = NaN, s = max - min, l = (max + min) / 2;
        return s ? (h = r === max ? (g - b) / s + (g < b) * 6 : g === max ? (b - r) / s + 2 : (r - g) / s + 4, s /= l < 0.5 ? max + min : 2 - max - min, h *= 60) : s = l > 0 && l < 1 ? 0 : h, new Hsl(h, s, l, o.opacity);
    }
    function hsl(h, s, l, opacity) {
        return 1 == arguments.length ? hslConvert(h) : new Hsl(h, s, l, null == opacity ? 1 : opacity);
    }
    function Hsl(h, s, l, opacity) {
        this.h = +h, this.s = +s, this.l = +l, this.opacity = +opacity;
    }
    /* From FvD 13.37, CSS Color Module Level 3 */ function hsl2rgb(h, m1, m2) {
        return (h < 60 ? m1 + (m2 - m1) * h / 60 : h < 180 ? m2 : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60 : m1) * 255;
    }
    define1(Color, color, {
        copy: function(channels) {
            return Object.assign(new this.constructor, this, channels);
        },
        displayable: function() {
            return this.rgb().displayable();
        },
        hex: color_formatHex,
        formatHex: color_formatHex,
        formatHsl: function() {
            return hslConvert(this).formatHsl();
        },
        formatRgb: color_formatRgb,
        toString: color_formatRgb
    }), define1(Rgb, rgb, extend(Color, {
        brighter: function(k) {
            return k = null == k ? 1.4285714285714286 : Math.pow(1.4285714285714286, k), new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
        },
        darker: function(k) {
            return k = null == k ? 0.7 : Math.pow(0.7, k), new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
        },
        rgb: function() {
            return this;
        },
        displayable: function() {
            return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
        },
        hex: rgb_formatHex,
        formatHex: rgb_formatHex,
        formatRgb: rgb_formatRgb,
        toString: rgb_formatRgb
    })), define1(Hsl, hsl, extend(Color, {
        brighter: function(k) {
            return k = null == k ? 1.4285714285714286 : Math.pow(1.4285714285714286, k), new Hsl(this.h, this.s, this.l * k, this.opacity);
        },
        darker: function(k) {
            return k = null == k ? 0.7 : Math.pow(0.7, k), new Hsl(this.h, this.s, this.l * k, this.opacity);
        },
        rgb: function() {
            var h = this.h % 360 + (this.h < 0) * 360, s = isNaN(h) || isNaN(this.s) ? 0 : this.s, l = this.l, m2 = l + (l < 0.5 ? l : 1 - l) * s, m1 = 2 * l - m2;
            return new Rgb(hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2), hsl2rgb(h, m1, m2), hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2), this.opacity);
        },
        displayable: function() {
            return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
        },
        formatHsl: function() {
            var a = this.opacity;
            return (1 === (a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a))) ? "hsl(" : "hsla(") + (this.h || 0) + ", " + 100 * (this.s || 0) + "%, " + 100 * (this.l || 0) + "%" + (1 === a ? ")" : ", " + a + ")");
        }
    }));
    const radians = Math.PI / 180, degrees = 180 / Math.PI, t0 = 4 / 29, t1 = 6 / 29, t2 = 6 / 29 * 3 * (6 / 29), t3 = 6 / 29 * (6 / 29) * (6 / 29);
    function labConvert(o) {
        if (o instanceof Lab) return new Lab(o.l, o.a, o.b, o.opacity);
        if (o instanceof Hcl) return hcl2lab(o);
        o instanceof Rgb || (o = rgbConvert(o));
        var x, z, r = rgb2lrgb(o.r), g = rgb2lrgb(o.g), b = rgb2lrgb(o.b), y = xyz2lab((0.2225045 * r + 0.7168786 * g + 0.0606169 * b) / 1);
        return r === g && g === b ? x = z = y : (x = xyz2lab((0.4360747 * r + 0.3850649 * g + 0.1430804 * b) / 0.96422), z = xyz2lab((0.0139322 * r + 0.0971045 * g + 0.7141733 * b) / 0.82521)), new Lab(116 * y - 16, 500 * (x - y), 200 * (y - z), o.opacity);
    }
    function lab(l, a, b, opacity) {
        return 1 == arguments.length ? labConvert(l) : new Lab(l, a, b, null == opacity ? 1 : opacity);
    }
    function Lab(l, a, b, opacity) {
        this.l = +l, this.a = +a, this.b = +b, this.opacity = +opacity;
    }
    function xyz2lab(t) {
        return t > t3 ? Math.pow(t, 1 / 3) : t / t2 + t0;
    }
    function lab2xyz(t) {
        return t > t1 ? t * t * t : t2 * (t - t0);
    }
    function lrgb2rgb(x) {
        return 255 * (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
    }
    function rgb2lrgb(x) {
        return (x /= 255) <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
    }
    function hclConvert(o) {
        if (o instanceof Hcl) return new Hcl(o.h, o.c, o.l, o.opacity);
        if (o instanceof Lab || (o = labConvert(o)), 0 === o.a && 0 === o.b) return new Hcl(NaN, 0 < o.l && o.l < 100 ? 0 : NaN, o.l, o.opacity);
        var h = Math.atan2(o.b, o.a) * degrees;
        return new Hcl(h < 0 ? h + 360 : h, Math.sqrt(o.a * o.a + o.b * o.b), o.l, o.opacity);
    }
    function hcl(h, c, l, opacity) {
        return 1 == arguments.length ? hclConvert(h) : new Hcl(h, c, l, null == opacity ? 1 : opacity);
    }
    function Hcl(h, c, l, opacity) {
        this.h = +h, this.c = +c, this.l = +l, this.opacity = +opacity;
    }
    function hcl2lab(o) {
        if (isNaN(o.h)) return new Lab(o.l, 0, 0, o.opacity);
        var h = o.h * radians;
        return new Lab(o.l, Math.cos(h) * o.c, Math.sin(h) * o.c, o.opacity);
    }
    define1(Lab, lab, extend(Color, {
        brighter: function(k) {
            return new Lab(this.l + 18 * (null == k ? 1 : k), this.a, this.b, this.opacity);
        },
        darker: function(k) {
            return new Lab(this.l - 18 * (null == k ? 1 : k), this.a, this.b, this.opacity);
        },
        rgb: function() {
            var y = (this.l + 16) / 116, x = isNaN(this.a) ? y : y + this.a / 500, z = isNaN(this.b) ? y : y - this.b / 200;
            return new Rgb(lrgb2rgb(3.1338561 * (x = 0.96422 * lab2xyz(x)) - 1.6168667 * (y = 1 * lab2xyz(y)) - 0.4906146 * (z = 0.82521 * lab2xyz(z))), lrgb2rgb(-0.9787684 * x + 1.9161415 * y + 0.0334540 * z), lrgb2rgb(0.0719453 * x - 0.2289914 * y + 1.4052427 * z), this.opacity);
        }
    })), define1(Hcl, hcl, extend(Color, {
        brighter: function(k) {
            return new Hcl(this.h, this.c, this.l + 18 * (null == k ? 1 : k), this.opacity);
        },
        darker: function(k) {
            return new Hcl(this.h, this.c, this.l - 18 * (null == k ? 1 : k), this.opacity);
        },
        rgb: function() {
            return hcl2lab(this).rgb();
        }
    }));
    var BC_DA = -1.78277 * 0.29227 - 0.1347134789;
    function cubehelix(h, s, l, opacity) {
        return 1 == arguments.length ? function(o) {
            if (o instanceof Cubehelix) return new Cubehelix(o.h, o.s, o.l, o.opacity);
            o instanceof Rgb || (o = rgbConvert(o));
            var r = o.r / 255, g = o.g / 255, b = o.b / 255, l = (BC_DA * b + -1.7884503806 * r - 3.5172982438 * g) / (BC_DA + -1.7884503806 - 3.5172982438), bl = b - l, k = -((1.97294 * (g - l) - -0.29227 * bl) / 0.90649), s = Math.sqrt(k * k + bl * bl) / (1.97294 * l * (1 - l)), h = s ? Math.atan2(k, bl) * degrees - 120 : NaN;
            return new Cubehelix(h < 0 ? h + 360 : h, s, l, o.opacity);
        }(h) : new Cubehelix(h, s, l, null == opacity ? 1 : opacity);
    }
    function Cubehelix(h, s, l, opacity) {
        this.h = +h, this.s = +s, this.l = +l, this.opacity = +opacity;
    }
    function basis(t1, v0, v1, v2, v3) {
        var t2 = t1 * t1, t3 = t2 * t1;
        return ((1 - 3 * t1 + 3 * t2 - t3) * v0 + (4 - 6 * t2 + 3 * t3) * v1 + (1 + 3 * t1 + 3 * t2 - 3 * t3) * v2 + t3 * v3) / 6;
    }
    function basis$1(values) {
        var n = values.length - 1;
        return function(t) {
            var i = t <= 0 ? t = 0 : t >= 1 ? (t = 1, n - 1) : Math.floor(t * n), v1 = values[i], v2 = values[i + 1], v0 = i > 0 ? values[i - 1] : 2 * v1 - v2, v3 = i < n - 1 ? values[i + 2] : 2 * v2 - v1;
            return basis((t - i / n) * n, v0, v1, v2, v3);
        };
    }
    function basisClosed(values) {
        var n = values.length;
        return function(t) {
            var i = Math.floor(((t %= 1) < 0 ? ++t : t) * n), v0 = values[(i + n - 1) % n], v1 = values[i % n], v2 = values[(i + 1) % n], v3 = values[(i + 2) % n];
            return basis((t - i / n) * n, v0, v1, v2, v3);
        };
    }
    define1(Cubehelix, cubehelix, extend(Color, {
        brighter: function(k) {
            return k = null == k ? 1.4285714285714286 : Math.pow(1.4285714285714286, k), new Cubehelix(this.h, this.s, this.l * k, this.opacity);
        },
        darker: function(k) {
            return k = null == k ? 0.7 : Math.pow(0.7, k), new Cubehelix(this.h, this.s, this.l * k, this.opacity);
        },
        rgb: function() {
            var h = isNaN(this.h) ? 0 : (this.h + 120) * radians, l = +this.l, a = isNaN(this.s) ? 0 : this.s * l * (1 - l), cosh = Math.cos(h), sinh = Math.sin(h);
            return new Rgb(255 * (l + a * (-0.14861 * cosh + 1.78277 * sinh)), 255 * (l + a * (-0.29227 * cosh + -0.90649 * sinh)), 255 * (l + 1.97294 * cosh * a), this.opacity);
        }
    }));
    var constant$3 = (x)=>()=>x;
    function linear(a, d) {
        return function(t) {
            return a + t * d;
        };
    }
    function hue(a, b) {
        var d = b - a;
        return d ? linear(a, d > 180 || d < -180 ? d - 360 * Math.round(d / 360) : d) : constant$3(isNaN(a) ? b : a);
    }
    function nogamma(a, b) {
        var d = b - a;
        return d ? linear(a, d) : constant$3(isNaN(a) ? b : a);
    }
    var interpolateRgb = function rgbGamma(y) {
        var y1, color = 1 == (y1 = +(y1 = y)) ? nogamma : function(a, b) {
            var a1, b1, y;
            return b - a ? (a1 = a, b1 = b, a1 = Math.pow(a1, y = y1), b1 = Math.pow(b1, y) - a1, y = 1 / y, function(t) {
                return Math.pow(a1 + t * b1, y);
            }) : constant$3(isNaN(a) ? b : a);
        };
        function rgb$1(start, end) {
            var r = color((start = rgb(start)).r, (end = rgb(end)).r), g = color(start.g, end.g), b = color(start.b, end.b), opacity = nogamma(start.opacity, end.opacity);
            return function(t) {
                return start.r = r(t), start.g = g(t), start.b = b(t), start.opacity = opacity(t), start + "";
            };
        }
        return rgb$1.gamma = rgbGamma, rgb$1;
    }(1);
    function rgbSpline(spline) {
        return function(colors) {
            var i, color, n = colors.length, r = Array(n), g = Array(n), b = Array(n);
            for(i = 0; i < n; ++i)color = rgb(colors[i]), r[i] = color.r || 0, g[i] = color.g || 0, b[i] = color.b || 0;
            return r = spline(r), g = spline(g), b = spline(b), color.opacity = 1, function(t) {
                return color.r = r(t), color.g = g(t), color.b = b(t), color + "";
            };
        };
    }
    var rgbBasis = rgbSpline(basis$1), rgbBasisClosed = rgbSpline(basisClosed);
    function numberArray(a, b) {
        b || (b = []);
        var i, n = a ? Math.min(b.length, a.length) : 0, c = b.slice();
        return function(t) {
            for(i = 0; i < n; ++i)c[i] = a[i] * (1 - t) + b[i] * t;
            return c;
        };
    }
    function isNumberArray(x) {
        return ArrayBuffer.isView(x) && !(x instanceof DataView);
    }
    function genericArray(a, b) {
        var i, nb = b ? b.length : 0, na = a ? Math.min(nb, a.length) : 0, x = Array(na), c = Array(nb);
        for(i = 0; i < na; ++i)x[i] = interpolate(a[i], b[i]);
        for(; i < nb; ++i)c[i] = b[i];
        return function(t) {
            for(i = 0; i < na; ++i)c[i] = x[i](t);
            return c;
        };
    }
    function date(a, b) {
        var d = new Date;
        return a = +a, b = +b, function(t) {
            return d.setTime(a * (1 - t) + b * t), d;
        };
    }
    function interpolateNumber(a, b) {
        return a = +a, b = +b, function(t) {
            return a * (1 - t) + b * t;
        };
    }
    function object(a, b) {
        var k, i = {}, c = {};
        for(k in (null === a || "object" != typeof a) && (a = {}), (null === b || "object" != typeof b) && (b = {}), b)k in a ? i[k] = interpolate(a[k], b[k]) : c[k] = b[k];
        return function(t) {
            for(k in i)c[k] = i[k](t);
            return c;
        };
    }
    var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, reB = RegExp(reA.source, "g");
    function interpolateString(a, b) {
        var b1, b2, am, bm, bs, bi = reA.lastIndex = reB.lastIndex = 0, i = -1, s = [], q = []; // number interpolators
        // Interpolate pairs of numbers in a & b.
        for(// Coerce inputs to strings.
        a += "", b += ""; (am = reA.exec(a)) && (bm = reB.exec(b));)(bs = bm.index) > bi && (bs = b.slice(bi, bs), s[i] ? s[i] += bs : s[++i] = bs), (am = am[0]) === (bm = bm[0]) ? s[i] ? s[i] += bm : s[++i] = bm : (s[++i] = null, q.push({
            i: i,
            x: interpolateNumber(am, bm)
        })), bi = reB.lastIndex;
        // Special optimization for only a single match.
        // Otherwise, interpolate each of the numbers and rejoin the string.
        return bi < b.length && (bs = b.slice(bi), s[i] ? s[i] += bs : s[++i] = bs), s.length < 2 ? q[0] ? (b1 = q[0].x, function(t) {
            return b1(t) + "";
        }) : (b2 = b, function() {
            return b2;
        }) : (b = q.length, function(t) {
            for(var o, i = 0; i < b; ++i)s[(o = q[i]).i] = o.x(t);
            return s.join("");
        });
    }
    function interpolate(a, b) {
        var c, t = typeof b;
        return null == b || "boolean" === t ? constant$3(b) : ("number" === t ? interpolateNumber : "string" === t ? (c = color(b)) ? (b = c, interpolateRgb) : interpolateString : b instanceof color ? interpolateRgb : b instanceof Date ? date : isNumberArray(b) ? numberArray : Array.isArray(b) ? genericArray : "function" != typeof b.valueOf && "function" != typeof b.toString || isNaN(b) ? object : interpolateNumber)(a, b);
    }
    function interpolateRound(a, b) {
        return a = +a, b = +b, function(t) {
            return Math.round(a * (1 - t) + b * t);
        };
    }
    var degrees$1 = 180 / Math.PI, identity$2 = {
        translateX: 0,
        translateY: 0,
        rotate: 0,
        skewX: 0,
        scaleX: 1,
        scaleY: 1
    };
    function decompose(a, b, c, d, e, f) {
        var scaleX, scaleY, skewX;
        return (scaleX = Math.sqrt(a * a + b * b)) && (a /= scaleX, b /= scaleX), (skewX = a * c + b * d) && (c -= a * skewX, d -= b * skewX), (scaleY = Math.sqrt(c * c + d * d)) && (c /= scaleY, d /= scaleY, skewX /= scaleY), a * d < b * c && (a = -a, b = -b, skewX = -skewX, scaleX = -scaleX), {
            translateX: e,
            translateY: f,
            rotate: Math.atan2(b, a) * degrees$1,
            skewX: Math.atan(skewX) * degrees$1,
            scaleX: scaleX,
            scaleY: scaleY
        };
    }
    function interpolateTransform(parse, pxComma, pxParen, degParen) {
        function pop(s) {
            return s.length ? s.pop() + " " : "";
        }
        return function(a, b) {
            var a1, b1, a2, b2, s = [], q = []; // number interpolators
            return a = parse(a), b = parse(b), !function(xa, ya, xb, yb, s, q) {
                if (xa !== xb || ya !== yb) {
                    var i = s.push("translate(", null, pxComma, null, pxParen);
                    q.push({
                        i: i - 4,
                        x: interpolateNumber(xa, xb)
                    }, {
                        i: i - 2,
                        x: interpolateNumber(ya, yb)
                    });
                } else (xb || yb) && s.push("translate(" + xb + pxComma + yb + pxParen);
            }(a.translateX, a.translateY, b.translateX, b.translateY, s, q), (a1 = a.rotate) !== (b1 = b.rotate) ? (a1 - b1 > 180 ? b1 += 360 : b1 - a1 > 180 && (a1 += 360), q.push({
                i: s.push(pop(s) + "rotate(", null, degParen) - 2,
                x: interpolateNumber(a1, b1)
            })) : b1 && s.push(pop(s) + "rotate(" + b1 + degParen), (a2 = a.skewX) !== (b2 = b.skewX) ? q.push({
                i: s.push(pop(s) + "skewX(", null, degParen) - 2,
                x: interpolateNumber(a2, b2)
            }) : b2 && s.push(pop(s) + "skewX(" + b2 + degParen), !function(xa, ya, xb, yb, s, q) {
                if (xa !== xb || ya !== yb) {
                    var i = s.push(pop(s) + "scale(", null, ",", null, ")");
                    q.push({
                        i: i - 4,
                        x: interpolateNumber(xa, xb)
                    }, {
                        i: i - 2,
                        x: interpolateNumber(ya, yb)
                    });
                } else (1 !== xb || 1 !== yb) && s.push(pop(s) + "scale(" + xb + "," + yb + ")");
            }(a.scaleX, a.scaleY, b.scaleX, b.scaleY, s, q), a = b = null, function(t) {
                for(var o, i = -1, n = q.length; ++i < n;)s[(o = q[i]).i] = o.x(t);
                return s.join("");
            };
        };
    }
    var interpolateTransformCss = interpolateTransform(/* eslint-disable no-undef */ function(value) {
        const m = new ("function" == typeof DOMMatrix ? DOMMatrix : WebKitCSSMatrix)(value + "");
        return m.isIdentity ? identity$2 : decompose(m.a, m.b, m.c, m.d, m.e, m.f);
    }, "px, ", "px)", "deg)"), interpolateTransformSvg = interpolateTransform(function(value) {
        return null == value ? identity$2 : (svgNode || (svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g")), svgNode.setAttribute("transform", value), value = svgNode.transform.baseVal.consolidate()) ? decompose((value = value.matrix).a, value.b, value.c, value.d, value.e, value.f) : identity$2;
    }, ", ", ")", ")");
    function cosh(x) {
        return ((x = Math.exp(x)) + 1 / x) / 2;
    }
    var interpolateZoom = function zoomRho(rho, rho2, rho4) {
        // p0 = [ux0, uy0, w0]
        // p1 = [ux1, uy1, w1]
        function zoom(p0, p1) {
            var i, S, ux0 = p0[0], uy0 = p0[1], w0 = p0[2], ux1 = p1[0], uy1 = p1[1], w1 = p1[2], dx = ux1 - ux0, dy = uy1 - uy0, d2 = dx * dx + dy * dy;
            // Special case for u0 ≅ u1.
            if (d2 < 1e-12) S = Math.log(w1 / w0) / rho, i = function(t) {
                return [
                    ux0 + t * dx,
                    uy0 + t * dy,
                    w0 * Math.exp(rho * t * S)
                ];
            };
            else {
                var d1 = Math.sqrt(d2), b0 = (w1 * w1 - w0 * w0 + rho4 * d2) / (2 * w0 * rho2 * d1), b1 = (w1 * w1 - w0 * w0 - rho4 * d2) / (2 * w1 * rho2 * d1), r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0);
                S = (Math.log(Math.sqrt(b1 * b1 + 1) - b1) - r0) / rho, i = function(t) {
                    var x, x1, s = t * S, coshr0 = cosh(r0), u = w0 / (rho2 * d1) * (coshr0 * (((x = Math.exp(2 * (x = rho * s + r0))) - 1) / (x + 1)) - ((x1 = Math.exp(x1 = r0)) - 1 / x1) / 2);
                    return [
                        ux0 + u * dx,
                        uy0 + u * dy,
                        w0 * coshr0 / cosh(rho * s + r0)
                    ];
                };
            }
            return i.duration = 1000 * S * rho / Math.SQRT2, i;
        }
        return zoom.rho = function(_) {
            var _1 = Math.max(1e-3, +_), _2 = _1 * _1;
            return zoomRho(_1, _2, _2 * _2);
        }, zoom;
    }(Math.SQRT2, 2, 4);
    function hsl$1(hue) {
        return function(start, end) {
            var h = hue((start = hsl(start)).h, (end = hsl(end)).h), s = nogamma(start.s, end.s), l = nogamma(start.l, end.l), opacity = nogamma(start.opacity, end.opacity);
            return function(t) {
                return start.h = h(t), start.s = s(t), start.l = l(t), start.opacity = opacity(t), start + "";
            };
        };
    }
    var hsl$2 = hsl$1(hue), hslLong = hsl$1(nogamma);
    function hcl$1(hue) {
        return function(start, end) {
            var h = hue((start = hcl(start)).h, (end = hcl(end)).h), c = nogamma(start.c, end.c), l = nogamma(start.l, end.l), opacity = nogamma(start.opacity, end.opacity);
            return function(t) {
                return start.h = h(t), start.c = c(t), start.l = l(t), start.opacity = opacity(t), start + "";
            };
        };
    }
    var hcl$2 = hcl$1(hue), hclLong = hcl$1(nogamma);
    function cubehelix$1(hue) {
        return function cubehelixGamma(y) {
            function cubehelix$1(start, end) {
                var h = hue((start = cubehelix(start)).h, (end = cubehelix(end)).h), s = nogamma(start.s, end.s), l = nogamma(start.l, end.l), opacity = nogamma(start.opacity, end.opacity);
                return function(t) {
                    return start.h = h(t), start.s = s(t), start.l = l(Math.pow(t, y)), start.opacity = opacity(t), start + "";
                };
            }
            return y = +y, cubehelix$1.gamma = cubehelixGamma, cubehelix$1;
        }(1);
    }
    var cubehelix$2 = cubehelix$1(hue), cubehelixLong = cubehelix$1(nogamma);
    function piecewise(interpolate$1, values) {
        void 0 === values && (values = interpolate$1, interpolate$1 = interpolate);
        for(var i = 0, n = values.length - 1, v = values[0], I = Array(n < 0 ? 0 : n); i < n;)I[i] = interpolate$1(v, v = values[++i]);
        return function(t) {
            var i = Math.max(0, Math.min(n - 1, Math.floor(t *= n)));
            return I[i](t - i);
        };
    }
    var locale$1, svgNode, taskHead, taskTail, frame = 0, timeout = 0, interval = 0, clockLast = 0, clockNow = 0, clockSkew = 0, clock = "object" == typeof performance && performance.now ? performance : Date, setFrame = "object" == typeof window && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(f) {
        setTimeout(f, 17);
    };
    function now() {
        return clockNow || (setFrame(clearNow), clockNow = clock.now() + clockSkew);
    }
    function clearNow() {
        clockNow = 0;
    }
    function Timer() {
        this._call = this._time = this._next = null;
    }
    function timer(callback, delay, time) {
        var t = new Timer;
        return t.restart(callback, delay, time), t;
    }
    function timerFlush() {
        now(), ++frame;
        for(var e, t = taskHead; t;)(e = clockNow - t._time) >= 0 && t._call.call(null, e), t = t._next;
        --frame;
    }
    function wake() {
        clockNow = (clockLast = clock.now()) + clockSkew, frame = timeout = 0;
        try {
            timerFlush();
        } finally{
            frame = 0, function() {
                for(var t0, t2, t1 = taskHead, time = 1 / 0; t1;)t1._call ? (time > t1._time && (time = t1._time), t0 = t1, t1 = t1._next) : (t2 = t1._next, t1._next = null, t1 = t0 ? t0._next = t2 : taskHead = t2);
                taskTail = t0, sleep(time);
            }(), clockNow = 0;
        }
    }
    function poke() {
        var now = clock.now(), delay = now - clockLast;
        delay > 1000 && (clockSkew -= delay, clockLast = now);
    }
    function sleep(time) {
        !frame && (timeout && (timeout = clearTimeout(timeout)), time - clockNow > 24 ? (time < 1 / 0 && (timeout = setTimeout(wake, time - clock.now() - clockSkew)), interval && (interval = clearInterval(interval))) : (interval || (clockLast = clock.now(), interval = setInterval(poke, 1000)), frame = 1, setFrame(wake))); // Soonest alarm already set, or will be.
    }
    function timeout$1(callback, delay, time) {
        var t = new Timer;
        return delay = null == delay ? 0 : +delay, t.restart((elapsed)=>{
            t.stop(), callback(elapsed + delay);
        }, delay, time), t;
    }
    Timer.prototype = timer.prototype = {
        constructor: Timer,
        restart: function(callback, delay, time) {
            if ("function" != typeof callback) throw TypeError("callback is not a function");
            time = (null == time ? now() : +time) + (null == delay ? 0 : +delay), this._next || taskTail === this || (taskTail ? taskTail._next = this : taskHead = this, taskTail = this), this._call = callback, this._time = time, sleep();
        },
        stop: function() {
            this._call && (this._call = null, this._time = 1 / 0, sleep());
        }
    };
    var emptyOn = dispatch("start", "end", "cancel", "interrupt"), emptyTween = [];
    function schedule(node, name, id, index, group, timing) {
        var schedules = node.__transition;
        if (schedules) {
            if (id in schedules) return;
        } else node.__transition = {};
        !function(node, id, self1) {
            var tween, schedules = node.__transition;
            function start(elapsed) {
                var i, j, n, o;
                // If the state is not SCHEDULED, then we previously errored on start.
                if (1 !== self1.state) return stop();
                for(i in schedules)if ((o = schedules[i]).name === self1.name) {
                    // While this element already has a starting transition during this frame,
                    // defer starting an interrupting transition until that transition has a
                    // chance to tick (and possibly end); see d3/d3-transition#54!
                    if (3 === o.state) return timeout$1(start);
                    // Interrupt the active transition, if any.
                    4 === o.state ? (o.state = 6, o.timer.stop(), o.on.call("interrupt", node, node.__data__, o.index, o.group), delete schedules[i]) : +i < id && (o.state = 6, o.timer.stop(), o.on.call("cancel", node, node.__data__, o.index, o.group), delete schedules[i]);
                }
                if (// Defer the first tick to end of the current frame; see d3/d3#1576.
                // Note the transition may be canceled after start and before the first tick!
                // Note this must be scheduled before the start event; see d3/d3-transition#16!
                // Assuming this is successful, subsequent callbacks go straight to tick.
                timeout$1(function() {
                    3 === self1.state && (self1.state = 4, self1.timer.restart(tick, self1.delay, self1.time), tick(elapsed));
                }), // Dispatch the start event.
                // Note this must be done before the tween are initialized.
                self1.state = 2, self1.on.call("start", node, node.__data__, self1.index, self1.group), 2 === self1.state) {
                    for(i = 0, self1.state = 3, // Initialize the tween, deleting null tween.
                    tween = Array(n = self1.tween.length), j = -1; i < n; ++i)(o = self1.tween[i].value.call(node, node.__data__, self1.index, self1.group)) && (tween[++j] = o);
                    tween.length = j + 1;
                } // interrupted
            }
            function tick(elapsed) {
                for(var t = elapsed < self1.duration ? self1.ease.call(null, elapsed / self1.duration) : (self1.timer.restart(stop), self1.state = 5, 1), i = -1, n = tween.length; ++i < n;)tween[i].call(node, t);
                // Dispatch the end event.
                5 === self1.state && (self1.on.call("end", node, node.__data__, self1.index, self1.group), stop());
            }
            function stop() {
                for(var i in self1.state = 6, self1.timer.stop(), delete schedules[id], schedules)return; // eslint-disable-line no-unused-vars
                delete node.__transition;
            }
            // Initialize the self timer when the transition is created.
            // Note the actual delay is not known until the first callback!
            schedules[id] = self1, self1.timer = timer(function(elapsed) {
                self1.state = 1, self1.timer.restart(start, self1.delay, self1.time), self1.delay <= elapsed && start(elapsed - self1.delay);
            }, 0, self1.time);
        }(node, id, {
            name: name,
            index: index,
            group: group,
            on: emptyOn,
            tween: emptyTween,
            time: timing.time,
            delay: timing.delay,
            duration: timing.duration,
            ease: timing.ease,
            timer: null,
            state: 0
        });
    }
    function init(node, id) {
        var schedule = get$1(node, id);
        if (schedule.state > 0) throw Error("too late; already scheduled");
        return schedule;
    }
    function set$2(node, id) {
        var schedule = get$1(node, id);
        if (schedule.state > 3) throw Error("too late; already running");
        return schedule;
    }
    function get$1(node, id) {
        var schedule = node.__transition;
        if (!schedule || !(schedule = schedule[id])) throw Error("transition not found");
        return schedule;
    }
    function interrupt(node, name) {
        var schedule, active, i, schedules = node.__transition, empty = !0;
        if (schedules) {
            for(i in name = null == name ? null : name + "", schedules){
                if ((schedule = schedules[i]).name !== name) {
                    empty = !1;
                    continue;
                }
                active = schedule.state > 2 && schedule.state < 5, schedule.state = 6, schedule.timer.stop(), schedule.on.call(active ? "interrupt" : "cancel", node, node.__data__, schedule.index, schedule.group), delete schedules[i];
            }
            empty && delete node.__transition;
        }
    }
    function tweenValue(transition, name, value) {
        var id = transition._id;
        return transition.each(function() {
            var schedule = set$2(this, id);
            (schedule.value || (schedule.value = {}))[name] = value.apply(this, arguments);
        }), function(node) {
            return get$1(node, id).value[name];
        };
    }
    function interpolate$1(a, b) {
        var c;
        return ("number" == typeof b ? interpolateNumber : b instanceof color ? interpolateRgb : (c = color(b)) ? (b = c, interpolateRgb) : interpolateString)(a, b);
    }
    var Selection$1 = selection.prototype.constructor;
    function styleRemove$1(name) {
        return function() {
            this.style.removeProperty(name);
        };
    }
    var id = 0;
    function Transition(groups, parents, name, id) {
        this._groups = groups, this._parents = parents, this._name = name, this._id = id;
    }
    function transition(name) {
        return selection().transition(name);
    }
    var selection_prototype = selection.prototype;
    function quadInOut(t) {
        return ((t *= 2) <= 1 ? t * t : --t * (2 - t) + 1) / 2;
    }
    function cubicInOut(t) {
        return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
    }
    Transition.prototype = transition.prototype = {
        constructor: Transition,
        select: function(select) {
            var name = this._name, id = this._id;
            "function" != typeof select && (select = selector(select));
            for(var groups = this._groups, m = groups.length, subgroups = Array(m), j = 0; j < m; ++j)for(var node, subnode, group = groups[j], n = group.length, subgroup = subgroups[j] = Array(n), i = 0; i < n; ++i)(node = group[i]) && (subnode = select.call(node, node.__data__, i, group)) && ("__data__" in node && (subnode.__data__ = node.__data__), subgroup[i] = subnode, schedule(subgroup[i], name, id, i, subgroup, get$1(node, id)));
            return new Transition(subgroups, this._parents, name, id);
        },
        selectAll: function(select) {
            var name = this._name, id = this._id;
            "function" != typeof select && (select = selectorAll(select));
            for(var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j)for(var node, group = groups[j], n = group.length, i = 0; i < n; ++i)if (node = group[i]) {
                for(var child, children = select.call(node, node.__data__, i, group), inherit = get$1(node, id), k = 0, l = children.length; k < l; ++k)(child = children[k]) && schedule(child, name, id, k, children, inherit);
                subgroups.push(children), parents.push(node);
            }
            return new Transition(subgroups, parents, name, id);
        },
        filter: function(match) {
            "function" != typeof match && (match = matcher(match));
            for(var groups = this._groups, m = groups.length, subgroups = Array(m), j = 0; j < m; ++j)for(var node, group = groups[j], n = group.length, subgroup = subgroups[j] = [], i = 0; i < n; ++i)(node = group[i]) && match.call(node, node.__data__, i, group) && subgroup.push(node);
            return new Transition(subgroups, this._parents, this._name, this._id);
        },
        merge: function(transition) {
            if (transition._id !== this._id) throw Error();
            for(var groups0 = this._groups, groups1 = transition._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = Array(m0), j = 0; j < m; ++j)for(var node, group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = Array(n), i = 0; i < n; ++i)(node = group0[i] || group1[i]) && (merge[i] = node);
            for(; j < m0; ++j)merges[j] = groups0[j];
            return new Transition(merges, this._parents, this._name, this._id);
        },
        selection: function() {
            return new Selection$1(this._groups, this._parents);
        },
        transition: function() {
            for(var name = this._name, id0 = this._id, id1 = ++id, groups = this._groups, m = groups.length, j = 0; j < m; ++j)for(var node, group = groups[j], n = group.length, i = 0; i < n; ++i)if (node = group[i]) {
                var inherit = get$1(node, id0);
                schedule(node, name, id1, i, group, {
                    time: inherit.time + inherit.delay + inherit.duration,
                    delay: 0,
                    duration: inherit.duration,
                    ease: inherit.ease
                });
            }
            return new Transition(groups, this._parents, name, id1);
        },
        call: selection_prototype.call,
        nodes: selection_prototype.nodes,
        node: selection_prototype.node,
        size: selection_prototype.size,
        empty: selection_prototype.empty,
        each: selection_prototype.each,
        on: function(name, listener) {
            var on0, on1, sit, id = this._id;
            return arguments.length < 2 ? get$1(this.node(), id).on.on(name) : this.each((sit = (name + "").trim().split(/^|\s+/).every(function(t) {
                var i = t.indexOf(".");
                return i >= 0 && (t = t.slice(0, i)), !t || "start" === t;
            }) ? init : set$2, function() {
                var schedule = sit(this, id), on = schedule.on;
                on !== on0 && (on1 = (on0 = on).copy()).on(name, listener), schedule.on = on1;
            }));
        },
        attr: function(name, value) {
            var fullname = namespace(name), i = "transform" === fullname ? interpolateTransformSvg : interpolate$1;
            return this.attrTween(name, "function" == typeof value ? (fullname.local ? function(fullname, interpolate, value) {
                var string00, string10, interpolate0;
                return function() {
                    var string0, string1, value1 = value(this);
                    return null == value1 ? void this.removeAttributeNS(fullname.space, fullname.local) : (string0 = this.getAttributeNS(fullname.space, fullname.local)) === (string1 = value1 + "") ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
                };
            } : function(name, interpolate, value) {
                var string00, string10, interpolate0;
                return function() {
                    var string0, string1, value1 = value(this);
                    return null == value1 ? void this.removeAttribute(name) : (string0 = this.getAttribute(name)) === (string1 = value1 + "") ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
                };
            })(fullname, i, tweenValue(this, "attr." + name, value)) : null == value ? (fullname.local ? function(fullname) {
                return function() {
                    this.removeAttributeNS(fullname.space, fullname.local);
                };
            } : function(name) {
                return function() {
                    this.removeAttribute(name);
                };
            })(fullname) : (fullname.local ? function(fullname, interpolate, value1) {
                var string00, interpolate0, string1 = value1 + "";
                return function() {
                    var string0 = this.getAttributeNS(fullname.space, fullname.local);
                    return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate(string00 = string0, value1);
                };
            } : function(name, interpolate, value1) {
                var string00, interpolate0, string1 = value1 + "";
                return function() {
                    var string0 = this.getAttribute(name);
                    return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate(string00 = string0, value1);
                };
            })(fullname, i, value));
        },
        attrTween: function(name, value) {
            var key = "attr." + name;
            if (arguments.length < 2) return (key = this.tween(key)) && key._value;
            if (null == value) return this.tween(key, null);
            if ("function" != typeof value) throw Error();
            var fullname = namespace(name);
            return this.tween(key, (fullname.local ? function(fullname, value) {
                var t0, i0;
                function tween() {
                    var i = value.apply(this, arguments);
                    return i !== i0 && (t0 = (i0 = i) && function(t) {
                        this.setAttributeNS(fullname.space, fullname.local, i.call(this, t));
                    }), t0;
                }
                return tween._value = value, tween;
            } : function(name, value) {
                var t0, i0;
                function tween() {
                    var i = value.apply(this, arguments);
                    return i !== i0 && (t0 = (i0 = i) && function(t) {
                        this.setAttribute(name, i.call(this, t));
                    }), t0;
                }
                return tween._value = value, tween;
            })(fullname, value));
        },
        style: function(name, value, priority) {
            var name1, string00, string10, interpolate0, name2, value1, string001, string101, interpolate01, id, name3, on0, on1, listener0, remove, key, event, name4, string002, interpolate02, string1, i = "transform" == (name += "") ? interpolateTransformCss : interpolate$1;
            return null == value ? this.styleTween(name, (name1 = name, function() {
                var string0 = styleValue(this, name1), string1 = (this.style.removeProperty(name1), styleValue(this, name1));
                return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : interpolate0 = i(string00 = string0, string10 = string1);
            })).on("end.style." + name, styleRemove$1(name)) : "function" == typeof value ? this.styleTween(name, (name2 = name, value1 = tweenValue(this, "style." + name, value), function() {
                var string0 = styleValue(this, name2), value11 = value1(this), string1 = value11 + "";
                return null == value11 && (this.style.removeProperty(name2), string1 = value11 = styleValue(this, name2)), string0 === string1 ? null : string0 === string001 && string1 === string101 ? interpolate01 : (string101 = string1, interpolate01 = i(string001 = string0, value11));
            })).each((id = this._id, event = "end." + (key = "style." + (name3 = name)), function() {
                var schedule = set$2(this, id), on = schedule.on, listener = null == schedule.value[key] ? remove || (remove = styleRemove$1(name3)) : void 0;
                (on !== on0 || listener0 !== listener) && (on1 = (on0 = on).copy()).on(event, listener0 = listener), schedule.on = on1;
            })) : this.styleTween(name, (name4 = name, string1 = value + "", function() {
                var string0 = styleValue(this, name4);
                return string0 === string1 ? null : string0 === string002 ? interpolate02 : interpolate02 = i(string002 = string0, value);
            }), priority).on("end.style." + name, null);
        },
        styleTween: function(name, value, priority) {
            var key = "style." + (name += "");
            if (arguments.length < 2) return (key = this.tween(key)) && key._value;
            if (null == value) return this.tween(key, null);
            if ("function" != typeof value) throw Error();
            return this.tween(key, function(name, value, priority) {
                var t, i0;
                function tween() {
                    var i = value.apply(this, arguments);
                    return i !== i0 && (t = (i0 = i) && function(t) {
                        this.style.setProperty(name, i.call(this, t), priority);
                    }), t;
                }
                return tween._value = value, tween;
            }(name, value, null == priority ? "" : priority));
        },
        text: function(value) {
            var value1, value2;
            return this.tween("text", "function" == typeof value ? (value1 = tweenValue(this, "text", value), function() {
                var value11 = value1(this);
                this.textContent = null == value11 ? "" : value11;
            }) : (value2 = null == value ? "" : value + "", function() {
                this.textContent = value2;
            }));
        },
        textTween: function(value) {
            var key = "text";
            if (arguments.length < 1) return (key = this.tween(key)) && key._value;
            if (null == value) return this.tween(key, null);
            if ("function" != typeof value) throw Error();
            return this.tween(key, function(value) {
                var t0, i0;
                function tween() {
                    var i = value.apply(this, arguments);
                    return i !== i0 && (t0 = (i0 = i) && function(t) {
                        this.textContent = i.call(this, t);
                    }), t0;
                }
                return tween._value = value, tween;
            }(value));
        },
        remove: function() {
            var id;
            return this.on("end.remove", (id = this._id, function() {
                var parent = this.parentNode;
                for(var i in this.__transition)if (+i !== id) return;
                parent && parent.removeChild(this);
            }));
        },
        tween: function(name, value) {
            var id = this._id;
            if (name += "", arguments.length < 2) {
                for(var t, tween = get$1(this.node(), id).tween, i = 0, n = tween.length; i < n; ++i)if ((t = tween[i]).name === name) return t.value;
                return null;
            }
            return this.each((null == value ? function(id, name) {
                var tween0, tween1;
                return function() {
                    var schedule = set$2(this, id), tween = schedule.tween;
                    // If this node shared tween with the previous node,
                    // just assign the updated shared tween and we’re done!
                    // Otherwise, copy-on-write.
                    if (tween !== tween0) {
                        tween1 = tween0 = tween;
                        for(var i = 0, n = tween1.length; i < n; ++i)if (tween1[i].name === name) {
                            (tween1 = tween1.slice()).splice(i, 1);
                            break;
                        }
                    }
                    schedule.tween = tween1;
                };
            } : function(id, name, value) {
                var tween0, tween1;
                if ("function" != typeof value) throw Error();
                return function() {
                    var schedule = set$2(this, id), tween = schedule.tween;
                    // If this node shared tween with the previous node,
                    // just assign the updated shared tween and we’re done!
                    // Otherwise, copy-on-write.
                    if (tween !== tween0) {
                        tween1 = (tween0 = tween).slice();
                        for(var t = {
                            name: name,
                            value: value
                        }, i = 0, n = tween1.length; i < n; ++i)if (tween1[i].name === name) {
                            tween1[i] = t;
                            break;
                        }
                        i === n && tween1.push(t);
                    }
                    schedule.tween = tween1;
                };
            })(id, name, value));
        },
        delay: function(value) {
            var id = this._id;
            return arguments.length ? this.each(("function" == typeof value ? function(id, value) {
                return function() {
                    init(this, id).delay = +value.apply(this, arguments);
                };
            } : function(id, value) {
                return value = +value, function() {
                    init(this, id).delay = value;
                };
            })(id, value)) : get$1(this.node(), id).delay;
        },
        duration: function(value) {
            var id = this._id;
            return arguments.length ? this.each(("function" == typeof value ? function(id, value) {
                return function() {
                    set$2(this, id).duration = +value.apply(this, arguments);
                };
            } : function(id, value) {
                return value = +value, function() {
                    set$2(this, id).duration = value;
                };
            })(id, value)) : get$1(this.node(), id).duration;
        },
        ease: function(value) {
            var id = this._id;
            return arguments.length ? this.each(function(id, value) {
                if ("function" != typeof value) throw Error();
                return function() {
                    set$2(this, id).ease = value;
                };
            }(id, value)) : get$1(this.node(), id).ease;
        },
        easeVarying: function(value) {
            var id;
            if ("function" != typeof value) throw Error();
            return this.each((id = this._id, function() {
                var v = value.apply(this, arguments);
                if ("function" != typeof v) throw Error();
                set$2(this, id).ease = v;
            }));
        },
        end: function() {
            var on0, on1, that = this, id = that._id, size = that.size();
            return new Promise(function(resolve, reject) {
                var cancel = {
                    value: reject
                }, end = {
                    value: function() {
                        0 == --size && resolve();
                    }
                };
                that.each(function() {
                    var schedule = set$2(this, id), on = schedule.on;
                    on !== on0 && ((on1 = (on0 = on).copy())._.cancel.push(cancel), on1._.interrupt.push(cancel), on1._.end.push(end)), schedule.on = on1;
                }), 0 === size && resolve();
            });
        },
        [Symbol.iterator]: selection_prototype[Symbol.iterator]
    };
    var polyIn = function custom(e) {
        function polyIn(t) {
            return Math.pow(t, e);
        }
        return e = +e, polyIn.exponent = custom, polyIn;
    }(3), polyOut = function custom(e) {
        function polyOut(t) {
            return 1 - Math.pow(1 - t, e);
        }
        return e = +e, polyOut.exponent = custom, polyOut;
    }(3), polyInOut = function custom(e) {
        function polyInOut(t) {
            return ((t *= 2) <= 1 ? Math.pow(t, e) : 2 - Math.pow(2 - t, e)) / 2;
        }
        return e = +e, polyInOut.exponent = custom, polyInOut;
    }(3), pi = Math.PI, halfPi = pi / 2;
    function sinInOut(t) {
        return (1 - Math.cos(pi * t)) / 2;
    }
    // tpmt is two power minus ten times t scaled to [0,1]
    function tpmt(x) {
        return (Math.pow(2, -10 * x) - 0.0009765625) * 1.0009775171065494;
    }
    function expInOut(t) {
        return ((t *= 2) <= 1 ? tpmt(1 - t) : 2 - tpmt(t - 1)) / 2;
    }
    function circleInOut(t) {
        return ((t *= 2) <= 1 ? 1 - Math.sqrt(1 - t * t) : Math.sqrt(1 - (t -= 2) * t) + 1) / 2;
    }
    var b1 = 4 / 11, b2 = 6 / 11, b3 = 8 / 11, b4 = 3 / 4, b5 = 9 / 11, b6 = 10 / 11, b7 = 15 / 16, b8 = 21 / 22, b9 = 63 / 64, b0 = 1 / (4 / 11) / (4 / 11);
    function bounceOut(t) {
        return (t = +t) < b1 ? b0 * t * t : t < b3 ? b0 * (t -= b2) * t + b4 : t < b6 ? b0 * (t -= b5) * t + b7 : b0 * (t -= b8) * t + b9;
    }
    var backIn = function custom(s) {
        function backIn(t) {
            return (t = +t) * t * (s * (t - 1) + t);
        }
        return s = +s, backIn.overshoot = custom, backIn;
    }(1.70158), backOut = function custom(s) {
        function backOut(t) {
            return --t * t * ((t + 1) * s + t) + 1;
        }
        return s = +s, backOut.overshoot = custom, backOut;
    }(1.70158), backInOut = function custom(s) {
        function backInOut(t) {
            return ((t *= 2) < 1 ? t * t * ((s + 1) * t - s) : (t -= 2) * t * ((s + 1) * t + s) + 2) / 2;
        }
        return s = +s, backInOut.overshoot = custom, backInOut;
    }(1.70158), tau = 2 * Math.PI, elasticIn = function custom(a, p) {
        var s = Math.asin(1 / (a = Math.max(1, a))) * (p /= tau);
        function elasticIn(t) {
            return a * tpmt(- --t) * Math.sin((s - t) / p);
        }
        return elasticIn.amplitude = function(a) {
            return custom(a, p * tau);
        }, elasticIn.period = function(p) {
            return custom(a, p);
        }, elasticIn;
    }(1, 0.3), elasticOut = function custom(a, p) {
        var s = Math.asin(1 / (a = Math.max(1, a))) * (p /= tau);
        function elasticOut(t) {
            return 1 - a * tpmt(t = +t) * Math.sin((t + s) / p);
        }
        return elasticOut.amplitude = function(a) {
            return custom(a, p * tau);
        }, elasticOut.period = function(p) {
            return custom(a, p);
        }, elasticOut;
    }(1, 0.3), elasticInOut = function custom(a, p) {
        var s = Math.asin(1 / (a = Math.max(1, a))) * (p /= tau);
        function elasticInOut(t) {
            return ((t = 2 * t - 1) < 0 ? a * tpmt(-t) * Math.sin((s - t) / p) : 2 - a * tpmt(t) * Math.sin((s + t) / p)) / 2;
        }
        return elasticInOut.amplitude = function(a) {
            return custom(a, p * tau);
        }, elasticInOut.period = function(p) {
            return custom(a, p);
        }, elasticInOut;
    }(1, 0.3), defaultTiming = {
        time: null,
        delay: 0,
        duration: 250,
        ease: cubicInOut
    };
    selection.prototype.interrupt = function(name) {
        return this.each(function() {
            interrupt(this, name);
        });
    }, selection.prototype.transition = function(name) {
        var id1, timing;
        name instanceof Transition ? (id1 = name._id, name = name._name) : (id1 = ++id, (timing = defaultTiming).time = now(), name = null == name ? null : name + "");
        for(var groups = this._groups, m = groups.length, j = 0; j < m; ++j)for(var node, group = groups[j], n = group.length, i = 0; i < n; ++i)(node = group[i]) && schedule(node, name, id1, i, group, timing || function(node, id) {
            for(var timing; !(timing = node.__transition) || !(timing = timing[id]);)if (!(node = node.parentNode)) throw Error(`transition ${id} not found`);
            return timing;
        }(node, id1));
        return new Transition(groups, this._parents, name, id1);
    };
    var root$1 = [
        null
    ], constant$4 = (x)=>()=>x;
    function BrushEvent(type, { sourceEvent, target, selection, mode, dispatch }) {
        Object.defineProperties(this, {
            type: {
                value: type,
                enumerable: !0,
                configurable: !0
            },
            sourceEvent: {
                value: sourceEvent,
                enumerable: !0,
                configurable: !0
            },
            target: {
                value: target,
                enumerable: !0,
                configurable: !0
            },
            selection: {
                value: selection,
                enumerable: !0,
                configurable: !0
            },
            mode: {
                value: mode,
                enumerable: !0,
                configurable: !0
            },
            _: {
                value: dispatch
            }
        });
    }
    function noevent$1(event) {
        event.preventDefault(), event.stopImmediatePropagation();
    }
    var MODE_DRAG = {
        name: "drag"
    }, MODE_SPACE = {
        name: "space"
    }, MODE_HANDLE = {
        name: "handle"
    }, MODE_CENTER = {
        name: "center"
    };
    const { abs, max: max$1, min: min$1 } = Math;
    function number1(e) {
        return [
            +e[0],
            +e[1]
        ];
    }
    function number2(e) {
        return [
            number1(e[0]),
            number1(e[1])
        ];
    }
    var X = {
        name: "x",
        handles: [
            "w",
            "e"
        ].map(type),
        input: function(x, e) {
            return null == x ? null : [
                [
                    +x[0],
                    e[0][1]
                ],
                [
                    +x[1],
                    e[1][1]
                ]
            ];
        },
        output: function(xy) {
            return xy && [
                xy[0][0],
                xy[1][0]
            ];
        }
    }, Y = {
        name: "y",
        handles: [
            "n",
            "s"
        ].map(type),
        input: function(y, e) {
            return null == y ? null : [
                [
                    e[0][0],
                    +y[0]
                ],
                [
                    e[1][0],
                    +y[1]
                ]
            ];
        },
        output: function(xy) {
            return xy && [
                xy[0][1],
                xy[1][1]
            ];
        }
    }, XY = {
        name: "xy",
        handles: [
            "n",
            "w",
            "e",
            "s",
            "nw",
            "ne",
            "sw",
            "se"
        ].map(type),
        input: function(xy) {
            return null == xy ? null : number2(xy);
        },
        output: function(xy) {
            return xy;
        }
    }, cursors = {
        overlay: "crosshair",
        selection: "move",
        n: "ns-resize",
        e: "ew-resize",
        s: "ns-resize",
        w: "ew-resize",
        nw: "nwse-resize",
        ne: "nesw-resize",
        se: "nwse-resize",
        sw: "nesw-resize"
    }, flipX = {
        e: "w",
        w: "e",
        nw: "ne",
        ne: "nw",
        se: "sw",
        sw: "se"
    }, flipY = {
        n: "s",
        s: "n",
        nw: "sw",
        ne: "se",
        se: "ne",
        sw: "nw"
    }, signsX = {
        overlay: 1,
        selection: 1,
        n: null,
        e: 1,
        s: null,
        w: -1,
        nw: -1,
        ne: 1,
        se: 1,
        sw: -1
    }, signsY = {
        overlay: 1,
        selection: 1,
        n: -1,
        e: null,
        s: 1,
        w: null,
        nw: -1,
        ne: -1,
        se: 1,
        sw: 1
    };
    function type(t) {
        return {
            type: t
        };
    }
    // Ignore right-click, since that should open the context menu.
    function defaultFilter$1(event) {
        return !event.ctrlKey && !event.button;
    }
    function defaultExtent() {
        var svg = this.ownerSVGElement || this;
        return svg.hasAttribute("viewBox") ? [
            [
                (svg = svg.viewBox.baseVal).x,
                svg.y
            ],
            [
                svg.x + svg.width,
                svg.y + svg.height
            ]
        ] : [
            [
                0,
                0
            ],
            [
                svg.width.baseVal.value,
                svg.height.baseVal.value
            ]
        ];
    }
    function defaultTouchable$1() {
        return navigator.maxTouchPoints || "ontouchstart" in this;
    }
    // Like d3.local, but with the name “__brush” rather than auto-generated.
    function local$1(node) {
        for(; !node.__brush;)if (!(node = node.parentNode)) return;
        return node.__brush;
    }
    function brush$1(dim) {
        var touchending, extent = defaultExtent, filter = defaultFilter$1, touchable = defaultTouchable$1, keys = !0, listeners = dispatch("start", "brush", "end"), handleSize = 6;
        function brush(group) {
            var overlay = group.property("__brush", initialize).selectAll(".overlay").data([
                type("overlay")
            ]);
            overlay.enter().append("rect").attr("class", "overlay").attr("pointer-events", "all").attr("cursor", cursors.overlay).merge(overlay).each(function() {
                var extent = local$1(this).extent;
                select(this).attr("x", extent[0][0]).attr("y", extent[0][1]).attr("width", extent[1][0] - extent[0][0]).attr("height", extent[1][1] - extent[0][1]);
            }), group.selectAll(".selection").data([
                type("selection")
            ]).enter().append("rect").attr("class", "selection").attr("cursor", cursors.selection).attr("fill", "#777").attr("fill-opacity", 0.3).attr("stroke", "#fff").attr("shape-rendering", "crispEdges");
            var handle = group.selectAll(".handle").data(dim.handles, function(d) {
                return d.type;
            });
            handle.exit().remove(), handle.enter().append("rect").attr("class", function(d) {
                return "handle handle--" + d.type;
            }).attr("cursor", function(d) {
                return cursors[d.type];
            }), group.each(redraw).attr("fill", "none").attr("pointer-events", "all").on("mousedown.brush", started).filter(touchable).on("touchstart.brush", started).on("touchmove.brush", touchmoved).on("touchend.brush touchcancel.brush", touchended).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
        }
        function redraw() {
            var group = select(this), selection = local$1(this).selection;
            selection ? (group.selectAll(".selection").style("display", null).attr("x", selection[0][0]).attr("y", selection[0][1]).attr("width", selection[1][0] - selection[0][0]).attr("height", selection[1][1] - selection[0][1]), group.selectAll(".handle").style("display", null).attr("x", function(d) {
                return "e" === d.type[d.type.length - 1] ? selection[1][0] - handleSize / 2 : selection[0][0] - handleSize / 2;
            }).attr("y", function(d) {
                return "s" === d.type[0] ? selection[1][1] - handleSize / 2 : selection[0][1] - handleSize / 2;
            }).attr("width", function(d) {
                return "n" === d.type || "s" === d.type ? selection[1][0] - selection[0][0] + handleSize : handleSize;
            }).attr("height", function(d) {
                return "e" === d.type || "w" === d.type ? selection[1][1] - selection[0][1] + handleSize : handleSize;
            })) : group.selectAll(".selection,.handle").style("display", "none").attr("x", null).attr("y", null).attr("width", null).attr("height", null);
        }
        function emitter(that, args, clean) {
            var emit = that.__brush.emitter;
            return !emit || clean && emit.clean ? new Emitter(that, args, clean) : emit;
        }
        function Emitter(that, args, clean) {
            this.that = that, this.args = args, this.state = that.__brush, this.active = 0, this.clean = clean;
        }
        function started(event) {
            if ((!touchending || event.touches) && filter.apply(this, arguments)) {
                var w0, w1, n0, n1, e0, e1, s0, s1, moving, lockX, lockY, that = this, type = event.target.__data__.type, mode = (keys && event.metaKey ? type = "overlay" : type) === "selection" ? MODE_DRAG : keys && event.altKey ? MODE_CENTER : MODE_HANDLE, signX = dim === Y ? null : signsX[type], signY = dim === X ? null : signsY[type], state = local$1(that), extent = state.extent, selection = state.selection, W = extent[0][0], N = extent[0][1], E = extent[1][0], S = extent[1][1], dx = 0, dy = 0, shifting = signX && signY && keys && event.shiftKey, points = Array.from(event.touches || [
                    event
                ], (t)=>{
                    const i = t.identifier;
                    return (t = pointer(t, that)).point0 = t.slice(), t.identifier = i, t;
                });
                if ("overlay" === type) {
                    selection && (moving = !0);
                    const pts = [
                        points[0],
                        points[1] || points[0]
                    ];
                    state.selection = selection = [
                        [
                            w0 = dim === Y ? W : min$1(pts[0][0], pts[1][0]),
                            n0 = dim === X ? N : min$1(pts[0][1], pts[1][1])
                        ],
                        [
                            e0 = dim === Y ? E : max$1(pts[0][0], pts[1][0]),
                            s0 = dim === X ? S : max$1(pts[0][1], pts[1][1])
                        ]
                    ], points.length > 1 && move();
                } else w0 = selection[0][0], n0 = selection[0][1], e0 = selection[1][0], s0 = selection[1][1];
                w1 = w0, n1 = n0, e1 = e0, s1 = s0;
                var group = select(that).attr("pointer-events", "none"), overlay = group.selectAll(".overlay").attr("cursor", cursors[type]);
                interrupt(that);
                var emit = emitter(that, arguments, !0).beforestart();
                if (event.touches) emit.moved = moved, emit.ended = ended;
                else {
                    var view = select(event.view).on("mousemove.brush", moved, !0).on("mouseup.brush", ended, !0);
                    keys && view.on("keydown.brush", function(event) {
                        switch(event.keyCode){
                            case 16:
                                shifting = signX && signY;
                                break;
                            case 18:
                                mode === MODE_HANDLE && (signX && (e0 = e1 - dx * signX, w0 = w1 + dx * signX), signY && (s0 = s1 - dy * signY, n0 = n1 + dy * signY), mode = MODE_CENTER, move());
                                break;
                            case 32:
                                (mode === MODE_HANDLE || mode === MODE_CENTER) && (signX < 0 ? e0 = e1 - dx : signX > 0 && (w0 = w1 - dx), signY < 0 ? s0 = s1 - dy : signY > 0 && (n0 = n1 - dy), mode = MODE_SPACE, overlay.attr("cursor", cursors.selection), move());
                                break;
                            default:
                                return;
                        }
                        noevent$1(event);
                    }, !0).on("keyup.brush", function(event) {
                        switch(event.keyCode){
                            case 16:
                                shifting && (lockX = lockY = shifting = !1, move());
                                break;
                            case 18:
                                mode === MODE_CENTER && (signX < 0 ? e0 = e1 : signX > 0 && (w0 = w1), signY < 0 ? s0 = s1 : signY > 0 && (n0 = n1), mode = MODE_HANDLE, move());
                                break;
                            case 32:
                                mode === MODE_SPACE && (event.altKey ? (signX && (e0 = e1 - dx * signX, w0 = w1 + dx * signX), signY && (s0 = s1 - dy * signY, n0 = n1 + dy * signY), mode = MODE_CENTER) : (signX < 0 ? e0 = e1 : signX > 0 && (w0 = w1), signY < 0 ? s0 = s1 : signY > 0 && (n0 = n1), mode = MODE_HANDLE), overlay.attr("cursor", cursors[type]), move());
                                break;
                            default:
                                return;
                        }
                        noevent$1(event);
                    }, !0), dragDisable(event.view);
                }
                redraw.call(that), emit.start(event, mode.name);
            }
            function moved(event) {
                for (const p of event.changedTouches || [
                    event
                ])for (const d of points)d.identifier === p.identifier && (d.cur = pointer(p, that));
                if (shifting && !lockX && !lockY && 1 === points.length) {
                    const point = points[0];
                    abs(point.cur[0] - point[0]) > abs(point.cur[1] - point[1]) ? lockY = !0 : lockX = !0;
                }
                for (const point of points)point.cur && (point[0] = point.cur[0], point[1] = point.cur[1]);
                moving = !0, noevent$1(event), move(event);
            }
            function move(event) {
                var t;
                const point = points[0], point0 = point.point0;
                switch(dx = point[0] - point0[0], dy = point[1] - point0[1], mode){
                    case MODE_SPACE:
                    case MODE_DRAG:
                        signX && (dx = max$1(W - w0, min$1(E - e0, dx)), w1 = w0 + dx, e1 = e0 + dx), signY && (dy = max$1(N - n0, min$1(S - s0, dy)), n1 = n0 + dy, s1 = s0 + dy);
                        break;
                    case MODE_HANDLE:
                        points[1] ? (signX && (w1 = max$1(W, min$1(E, points[0][0])), e1 = max$1(W, min$1(E, points[1][0])), signX = 1), signY && (n1 = max$1(N, min$1(S, points[0][1])), s1 = max$1(N, min$1(S, points[1][1])), signY = 1)) : (signX < 0 ? (dx = max$1(W - w0, min$1(E - w0, dx)), w1 = w0 + dx, e1 = e0) : signX > 0 && (dx = max$1(W - e0, min$1(E - e0, dx)), w1 = w0, e1 = e0 + dx), signY < 0 ? (dy = max$1(N - n0, min$1(S - n0, dy)), n1 = n0 + dy, s1 = s0) : signY > 0 && (dy = max$1(N - s0, min$1(S - s0, dy)), n1 = n0, s1 = s0 + dy));
                        break;
                    case MODE_CENTER:
                        signX && (w1 = max$1(W, min$1(E, w0 - dx * signX)), e1 = max$1(W, min$1(E, e0 + dx * signX))), signY && (n1 = max$1(N, min$1(S, n0 - dy * signY)), s1 = max$1(N, min$1(S, s0 + dy * signY)));
                }
                e1 < w1 && (signX *= -1, t = w0, w0 = e0, e0 = t, t = w1, w1 = e1, e1 = t, type in flipX && overlay.attr("cursor", cursors[type = flipX[type]])), s1 < n1 && (signY *= -1, t = n0, n0 = s0, s0 = t, t = n1, n1 = s1, s1 = t, type in flipY && overlay.attr("cursor", cursors[type = flipY[type]])), state.selection && (selection = state.selection), lockX && (w1 = selection[0][0], e1 = selection[1][0]), lockY && (n1 = selection[0][1], s1 = selection[1][1]), (selection[0][0] !== w1 || selection[0][1] !== n1 || selection[1][0] !== e1 || selection[1][1] !== s1) && (state.selection = [
                    [
                        w1,
                        n1
                    ],
                    [
                        e1,
                        s1
                    ]
                ], redraw.call(that), emit.brush(event, mode.name));
            }
            function ended(event) {
                var extent;
                if (!function(event) {
                    event.stopImmediatePropagation();
                }(event), event.touches) {
                    if (event.touches.length) return;
                    touchending && clearTimeout(touchending), touchending = setTimeout(function() {
                        touchending = null;
                    }, 500);
                } else yesdrag(event.view, moving), view.on("keydown.brush keyup.brush mousemove.brush mouseup.brush", null);
                group.attr("pointer-events", "all"), overlay.attr("cursor", cursors.overlay), state.selection && (selection = state.selection), ((extent = selection)[0][0] === extent[1][0] || extent[0][1] === extent[1][1]) && (state.selection = null, redraw.call(that)), emit.end(event, mode.name);
            }
        }
        function touchmoved(event) {
            emitter(this, arguments).moved(event);
        }
        function touchended(event) {
            emitter(this, arguments).ended(event);
        }
        function initialize() {
            var state = this.__brush || {
                selection: null
            };
            return state.extent = number2(extent.apply(this, arguments)), state.dim = dim, state;
        }
        return brush.move = function(group, selection) {
            group.tween ? group.on("start.brush", function(event) {
                emitter(this, arguments).beforestart().start(event);
            }).on("interrupt.brush end.brush", function(event) {
                emitter(this, arguments).end(event);
            }).tween("brush", function() {
                var that = this, state = that.__brush, emit = emitter(that, arguments), selection0 = state.selection, selection1 = dim.input("function" == typeof selection ? selection.apply(this, arguments) : selection, state.extent), i = interpolate(selection0, selection1);
                function tween(t) {
                    state.selection = 1 === t && null === selection1 ? null : i(t), redraw.call(that), emit.brush();
                }
                return null !== selection0 && null !== selection1 ? tween : tween(1);
            }) : group.each(function() {
                var args = arguments, state = this.__brush, selection1 = dim.input("function" == typeof selection ? selection.apply(this, args) : selection, state.extent), emit = emitter(this, args).beforestart();
                interrupt(this), state.selection = null === selection1 ? null : selection1, redraw.call(this), emit.start().brush().end();
            });
        }, brush.clear = function(group) {
            brush.move(group, null);
        }, Emitter.prototype = {
            beforestart: function() {
                return 1 == ++this.active && (this.state.emitter = this, this.starting = !0), this;
            },
            start: function(event, mode) {
                return this.starting ? (this.starting = !1, this.emit("start", event, mode)) : this.emit("brush", event), this;
            },
            brush: function(event, mode) {
                return this.emit("brush", event, mode), this;
            },
            end: function(event, mode) {
                return 0 == --this.active && (delete this.state.emitter, this.emit("end", event, mode)), this;
            },
            emit: function(type, event, mode) {
                var d = select(this.that).datum();
                listeners.call(type, this.that, new BrushEvent(type, {
                    sourceEvent: event,
                    target: brush,
                    selection: dim.output(this.state.selection),
                    mode,
                    dispatch: listeners
                }), d);
            }
        }, brush.extent = function(_) {
            return arguments.length ? (extent = "function" == typeof _ ? _ : constant$4(number2(_)), brush) : extent;
        }, brush.filter = function(_) {
            return arguments.length ? (filter = "function" == typeof _ ? _ : constant$4(!!_), brush) : filter;
        }, brush.touchable = function(_) {
            return arguments.length ? (touchable = "function" == typeof _ ? _ : constant$4(!!_), brush) : touchable;
        }, brush.handleSize = function(_) {
            return arguments.length ? (handleSize = +_, brush) : handleSize;
        }, brush.keyModifiers = function(_) {
            return arguments.length ? (keys = !!_, brush) : keys;
        }, brush.on = function() {
            var value = listeners.on.apply(listeners, arguments);
            return value === listeners ? brush : value;
        }, brush;
    }
    var abs$1 = Math.abs, cos = Math.cos, sin = Math.sin, pi$1 = Math.PI, halfPi$1 = pi$1 / 2, tau$1 = 2 * pi$1, max$2 = Math.max;
    function range(i, j) {
        return Array.from({
            length: j - i
        }, (_, k)=>i + k);
    }
    function chord$1(directed, transpose) {
        var padAngle = 0, sortGroups = null, sortSubgroups = null, sortChords = null;
        function chord(matrix) {
            var dx, n = matrix.length, groupSums = Array(n), groupIndex = range(0, n), chords = Array(n * n), groups = Array(n), k = 0;
            matrix = Float64Array.from({
                length: n * n
            }, transpose ? (_, i)=>matrix[i % n][i / n | 0] : (_, i)=>matrix[i / n | 0][i % n]);
            // Compute the scaling factor from value to angle in [0, 2pi].
            for(let i = 0; i < n; ++i){
                let x = 0;
                for(let j = 0; j < n; ++j)x += matrix[i * n + j] + directed * matrix[j * n + i];
                k += groupSums[i] = x;
            }
            dx = (k = max$2(0, tau$1 - padAngle * n) / k) ? padAngle : tau$1 / n;
            // Compute the angles for each group and constituent chord.
            {
                let x = 0;
                for (const i of (sortGroups && groupIndex.sort((a, b)=>sortGroups(groupSums[a], groupSums[b])), groupIndex)){
                    const x0 = x;
                    if (directed) {
                        const subgroupIndex = range(~n + 1, n).filter((j)=>j < 0 ? matrix[~j * n + i] : matrix[i * n + j]);
                        for (const j of (sortSubgroups && subgroupIndex.sort((a, b)=>sortSubgroups(a < 0 ? -matrix[~a * n + i] : matrix[i * n + a], b < 0 ? -matrix[~b * n + i] : matrix[i * n + b])), subgroupIndex))j < 0 ? (chords[~j * n + i] || (chords[~j * n + i] = {
                            source: null,
                            target: null
                        })).target = {
                            index: i,
                            startAngle: x,
                            endAngle: x += matrix[~j * n + i] * k,
                            value: matrix[~j * n + i]
                        } : (chords[i * n + j] || (chords[i * n + j] = {
                            source: null,
                            target: null
                        })).source = {
                            index: i,
                            startAngle: x,
                            endAngle: x += matrix[i * n + j] * k,
                            value: matrix[i * n + j]
                        };
                        groups[i] = {
                            index: i,
                            startAngle: x0,
                            endAngle: x,
                            value: groupSums[i]
                        };
                    } else {
                        const subgroupIndex = range(0, n).filter((j)=>matrix[i * n + j] || matrix[j * n + i]);
                        for (const j of (sortSubgroups && subgroupIndex.sort((a, b)=>sortSubgroups(matrix[i * n + a], matrix[i * n + b])), subgroupIndex)){
                            let chord;
                            if (i < j ? (chord = chords[i * n + j] || (chords[i * n + j] = {
                                source: null,
                                target: null
                            })).source = {
                                index: i,
                                startAngle: x,
                                endAngle: x += matrix[i * n + j] * k,
                                value: matrix[i * n + j]
                            } : ((chord = chords[j * n + i] || (chords[j * n + i] = {
                                source: null,
                                target: null
                            })).target = {
                                index: i,
                                startAngle: x,
                                endAngle: x += matrix[i * n + j] * k,
                                value: matrix[i * n + j]
                            }, i === j && (chord.source = chord.target)), chord.source && chord.target && chord.source.value < chord.target.value) {
                                const source = chord.source;
                                chord.source = chord.target, chord.target = source;
                            }
                        }
                        groups[i] = {
                            index: i,
                            startAngle: x0,
                            endAngle: x,
                            value: groupSums[i]
                        };
                    }
                    x += dx;
                }
            }
            return(// Remove empty chords.
            (chords = Object.values(chords)).groups = groups, sortChords ? chords.sort(sortChords) : chords);
        }
        return chord.padAngle = function(_) {
            return arguments.length ? (padAngle = max$2(0, _), chord) : padAngle;
        }, chord.sortGroups = function(_) {
            return arguments.length ? (sortGroups = _, chord) : sortGroups;
        }, chord.sortSubgroups = function(_) {
            return arguments.length ? (sortSubgroups = _, chord) : sortSubgroups;
        }, chord.sortChords = function(_) {
            return arguments.length ? (null == _ ? sortChords = null : (sortChords = function(a, b) {
                return _(a.source.value + a.target.value, b.source.value + b.target.value);
            })._ = _, chord) : sortChords && sortChords._;
        }, chord;
    }
    const pi$2 = Math.PI, tau$2 = 2 * pi$2, tauEpsilon = tau$2 - 1e-6;
    function Path() {
        this._x0 = this._y0 = this._x1 = this._y1 = null, this._ = "";
    }
    function path() {
        return new Path;
    }
    Path.prototype = path.prototype = {
        constructor: Path,
        moveTo: function(x, y) {
            this._ += "M" + (this._x0 = this._x1 = +x) + "," + (this._y0 = this._y1 = +y);
        },
        closePath: function() {
            null !== this._x1 && (this._x1 = this._x0, this._y1 = this._y0, this._ += "Z");
        },
        lineTo: function(x, y) {
            this._ += "L" + (this._x1 = +x) + "," + (this._y1 = +y);
        },
        quadraticCurveTo: function(x1, y1, x, y) {
            this._ += "Q" + +x1 + "," + +y1 + "," + (this._x1 = +x) + "," + (this._y1 = +y);
        },
        bezierCurveTo: function(x1, y1, x2, y2, x, y) {
            this._ += "C" + +x1 + "," + +y1 + "," + +x2 + "," + +y2 + "," + (this._x1 = +x) + "," + (this._y1 = +y);
        },
        arcTo: function(x1, y1, x2, y2, r) {
            x1 = +x1, y1 = +y1, x2 = +x2, y2 = +y2, r = +r;
            var x0 = this._x1, y0 = this._y1, x21 = x2 - x1, y21 = y2 - y1, x01 = x0 - x1, y01 = y0 - y1, l01_2 = x01 * x01 + y01 * y01;
            // Is the radius negative? Error.
            if (r < 0) throw Error("negative radius: " + r);
            // Is this path empty? Move to (x1,y1).
            if (null === this._x1) this._ += "M" + (this._x1 = x1) + "," + (this._y1 = y1);
            else if (l01_2 > 1e-6) {
                if (Math.abs(y01 * x21 - y21 * x01) > 1e-6 && r) {
                    var x20 = x2 - x0, y20 = y2 - y0, l21_2 = x21 * x21 + y21 * y21, l21 = Math.sqrt(l21_2), l01 = Math.sqrt(l01_2), l = r * Math.tan((pi$2 - Math.acos((l21_2 + l01_2 - (x20 * x20 + y20 * y20)) / (2 * l21 * l01))) / 2), t01 = l / l01, t21 = l / l21;
                    Math.abs(t01 - 1) > 1e-6 && (this._ += "L" + (x1 + t01 * x01) + "," + (y1 + t01 * y01)), this._ += "A" + r + "," + r + ",0,0," + +(y01 * x20 > x01 * y20) + "," + (this._x1 = x1 + t21 * x21) + "," + (this._y1 = y1 + t21 * y21);
                } else this._ += "L" + (this._x1 = x1) + "," + (this._y1 = y1);
            }
        },
        arc: function(x, y, r, a0, a1, ccw) {
            x = +x, y = +y, r = +r, ccw = !!ccw;
            var dx = r * Math.cos(a0), dy = r * Math.sin(a0), x0 = x + dx, y0 = y + dy, cw = 1 ^ ccw, da = ccw ? a0 - a1 : a1 - a0;
            // Is the radius negative? Error.
            if (r < 0) throw Error("negative radius: " + r);
            null === this._x1 ? this._ += "M" + x0 + "," + y0 : (Math.abs(this._x1 - x0) > 1e-6 || Math.abs(this._y1 - y0) > 1e-6) && (this._ += "L" + x0 + "," + y0), r && (da < 0 && (da = da % tau$2 + tau$2), da > tauEpsilon ? this._ += "A" + r + "," + r + ",0,1," + cw + "," + (x - dx) + "," + (y - dy) + "A" + r + "," + r + ",0,1," + cw + "," + (this._x1 = x0) + "," + (this._y1 = y0) : da > 1e-6 && (this._ += "A" + r + "," + r + ",0," + +(da >= pi$2) + "," + cw + "," + (this._x1 = x + r * Math.cos(a1)) + "," + (this._y1 = y + r * Math.sin(a1))));
        },
        rect: function(x, y, w, h) {
            this._ += "M" + (this._x0 = this._x1 = +x) + "," + (this._y0 = this._y1 = +y) + "h" + +w + "v" + +h + "h" + -w + "Z";
        },
        toString: function() {
            return this._;
        }
    };
    var slice$2 = Array.prototype.slice;
    function constant$5(x) {
        return function() {
            return x;
        };
    }
    function defaultSource(d) {
        return d.source;
    }
    function defaultTarget(d) {
        return d.target;
    }
    function defaultRadius(d) {
        return d.radius;
    }
    function defaultStartAngle(d) {
        return d.startAngle;
    }
    function defaultEndAngle(d) {
        return d.endAngle;
    }
    function defaultPadAngle() {
        return 0;
    }
    function defaultArrowheadRadius() {
        return 10;
    }
    function ribbon(headRadius) {
        var source = defaultSource, target = defaultTarget, sourceRadius = defaultRadius, targetRadius = defaultRadius, startAngle = defaultStartAngle, endAngle = defaultEndAngle, padAngle = defaultPadAngle, context = null;
        function ribbon() {
            var buffer, s = source.apply(this, arguments), t = target.apply(this, arguments), ap = padAngle.apply(this, arguments) / 2, argv = slice$2.call(arguments), sr = +sourceRadius.apply(this, (argv[0] = s, argv)), sa0 = startAngle.apply(this, argv) - halfPi$1, sa1 = endAngle.apply(this, argv) - halfPi$1, tr = +targetRadius.apply(this, (argv[0] = t, argv)), ta0 = startAngle.apply(this, argv) - halfPi$1, ta1 = endAngle.apply(this, argv) - halfPi$1;
            if (context || (context = buffer = path()), ap > 1e-12 && (abs$1(sa1 - sa0) > 2 * ap + 1e-12 ? sa1 > sa0 ? (sa0 += ap, sa1 -= ap) : (sa0 -= ap, sa1 += ap) : sa0 = sa1 = (sa0 + sa1) / 2, abs$1(ta1 - ta0) > 2 * ap + 1e-12 ? ta1 > ta0 ? (ta0 += ap, ta1 -= ap) : (ta0 -= ap, ta1 += ap) : ta0 = ta1 = (ta0 + ta1) / 2), context.moveTo(sr * cos(sa0), sr * sin(sa0)), context.arc(0, 0, sr, sa0, sa1), sa0 !== ta0 || sa1 !== ta1) {
                if (headRadius) {
                    var hr = +headRadius.apply(this, arguments), tr2 = tr - hr, ta2 = (ta0 + ta1) / 2;
                    context.quadraticCurveTo(0, 0, tr2 * cos(ta0), tr2 * sin(ta0)), context.lineTo(tr * cos(ta2), tr * sin(ta2)), context.lineTo(tr2 * cos(ta1), tr2 * sin(ta1));
                } else context.quadraticCurveTo(0, 0, tr * cos(ta0), tr * sin(ta0)), context.arc(0, 0, tr, ta0, ta1);
            }
            if (context.quadraticCurveTo(0, 0, sr * cos(sa0), sr * sin(sa0)), context.closePath(), buffer) return context = null, buffer + "" || null;
        }
        return headRadius && (ribbon.headRadius = function(_) {
            return arguments.length ? (headRadius = "function" == typeof _ ? _ : constant$5(+_), ribbon) : headRadius;
        }), ribbon.radius = function(_) {
            return arguments.length ? (sourceRadius = targetRadius = "function" == typeof _ ? _ : constant$5(+_), ribbon) : sourceRadius;
        }, ribbon.sourceRadius = function(_) {
            return arguments.length ? (sourceRadius = "function" == typeof _ ? _ : constant$5(+_), ribbon) : sourceRadius;
        }, ribbon.targetRadius = function(_) {
            return arguments.length ? (targetRadius = "function" == typeof _ ? _ : constant$5(+_), ribbon) : targetRadius;
        }, ribbon.startAngle = function(_) {
            return arguments.length ? (startAngle = "function" == typeof _ ? _ : constant$5(+_), ribbon) : startAngle;
        }, ribbon.endAngle = function(_) {
            return arguments.length ? (endAngle = "function" == typeof _ ? _ : constant$5(+_), ribbon) : endAngle;
        }, ribbon.padAngle = function(_) {
            return arguments.length ? (padAngle = "function" == typeof _ ? _ : constant$5(+_), ribbon) : padAngle;
        }, ribbon.source = function(_) {
            return arguments.length ? (source = _, ribbon) : source;
        }, ribbon.target = function(_) {
            return arguments.length ? (target = _, ribbon) : target;
        }, ribbon.context = function(_) {
            return arguments.length ? (context = null == _ ? null : _, ribbon) : context;
        }, ribbon;
    }
    var slice$3 = Array.prototype.slice;
    function ascending$2(a, b) {
        return a - b;
    }
    var constant$6 = (x)=>()=>x;
    function noop$1() {}
    var cases = [
        [],
        [
            [
                [
                    1.0,
                    1.5
                ],
                [
                    0.5,
                    1.0
                ]
            ]
        ],
        [
            [
                [
                    1.5,
                    1.0
                ],
                [
                    1.0,
                    1.5
                ]
            ]
        ],
        [
            [
                [
                    1.5,
                    1.0
                ],
                [
                    0.5,
                    1.0
                ]
            ]
        ],
        [
            [
                [
                    1.0,
                    0.5
                ],
                [
                    1.5,
                    1.0
                ]
            ]
        ],
        [
            [
                [
                    1.0,
                    1.5
                ],
                [
                    0.5,
                    1.0
                ]
            ],
            [
                [
                    1.0,
                    0.5
                ],
                [
                    1.5,
                    1.0
                ]
            ]
        ],
        [
            [
                [
                    1.0,
                    0.5
                ],
                [
                    1.0,
                    1.5
                ]
            ]
        ],
        [
            [
                [
                    1.0,
                    0.5
                ],
                [
                    0.5,
                    1.0
                ]
            ]
        ],
        [
            [
                [
                    0.5,
                    1.0
                ],
                [
                    1.0,
                    0.5
                ]
            ]
        ],
        [
            [
                [
                    1.0,
                    1.5
                ],
                [
                    1.0,
                    0.5
                ]
            ]
        ],
        [
            [
                [
                    0.5,
                    1.0
                ],
                [
                    1.0,
                    0.5
                ]
            ],
            [
                [
                    1.5,
                    1.0
                ],
                [
                    1.0,
                    1.5
                ]
            ]
        ],
        [
            [
                [
                    1.5,
                    1.0
                ],
                [
                    1.0,
                    0.5
                ]
            ]
        ],
        [
            [
                [
                    0.5,
                    1.0
                ],
                [
                    1.5,
                    1.0
                ]
            ]
        ],
        [
            [
                [
                    1.0,
                    1.5
                ],
                [
                    1.5,
                    1.0
                ]
            ]
        ],
        [
            [
                [
                    0.5,
                    1.0
                ],
                [
                    1.0,
                    1.5
                ]
            ]
        ],
        []
    ];
    function contours() {
        var dx = 1, dy = 1, threshold = thresholdSturges, smooth = smoothLinear;
        function contours(values) {
            var tz = threshold(values);
            // Convert number of thresholds into uniform thresholds.
            if (Array.isArray(tz)) tz = tz.slice().sort(ascending$2);
            else {
                var domain = extent(values), start = domain[0], stop = domain[1];
                tz = tickStep(start, stop, tz), tz = sequence(Math.floor(start / tz) * tz, Math.floor(stop / tz) * tz, tz);
            }
            return tz.map(function(value) {
                return contour(values, value);
            });
        }
        // Accumulate, smooth contour rings, assign holes to exterior rings.
        // Based on https://github.com/mbostock/shapefile/blob/v0.6.2/shp/polygon.js
        function contour(values, value) {
            var polygons = [], holes = [];
            return(// Marching squares with isolines stitched into rings.
            // Based on https://github.com/topojson/topojson-client/blob/v3.0.0/src/stitch.js
            function(values, value, callback) {
                var x, y, t0, t1, t2, t3, fragmentByStart = [], fragmentByEnd = [];
                for(// Special case for the first row (y = -1, t2 = t3 = 0).
                x = y = -1, cases[(t1 = values[0] >= value) << 1].forEach(stitch); ++x < dx - 1;)cases[(t0 = t1) | (t1 = values[x + 1] >= value) << 1].forEach(stitch);
                // General case for the intermediate rows.
                for(cases[t1 << 0].forEach(stitch); ++y < dy - 1;){
                    for(x = -1, cases[(t1 = values[y * dx + dx] >= value) << 1 | (t2 = values[y * dx] >= value) << 2].forEach(stitch); ++x < dx - 1;)t0 = t1, t1 = values[y * dx + dx + x + 1] >= value, t3 = t2, cases[t0 | t1 << 1 | (t2 = values[y * dx + x + 1] >= value) << 2 | t3 << 3].forEach(stitch);
                    cases[t1 | t2 << 3].forEach(stitch);
                }
                for(// Special case for the last row (y = dy - 1, t0 = t1 = 0).
                x = -1, cases[(t2 = values[y * dx] >= value) << 2].forEach(stitch); ++x < dx - 1;)t3 = t2, cases[(t2 = values[y * dx + x + 1] >= value) << 2 | t3 << 3].forEach(stitch);
                function stitch(line) {
                    var f, g, start = [
                        line[0][0] + x,
                        line[0][1] + y
                    ], end = [
                        line[1][0] + x,
                        line[1][1] + y
                    ], startIndex = index(start), endIndex = index(end);
                    (f = fragmentByEnd[startIndex]) ? (g = fragmentByStart[endIndex]) ? (delete fragmentByEnd[f.end], delete fragmentByStart[g.start], f === g ? (f.ring.push(end), callback(f.ring)) : fragmentByStart[f.start] = fragmentByEnd[g.end] = {
                        start: f.start,
                        end: g.end,
                        ring: f.ring.concat(g.ring)
                    }) : (delete fragmentByEnd[f.end], f.ring.push(end), fragmentByEnd[f.end = endIndex] = f) : (f = fragmentByStart[endIndex]) ? (g = fragmentByEnd[startIndex]) ? (delete fragmentByStart[f.start], delete fragmentByEnd[g.end], f === g ? (f.ring.push(end), callback(f.ring)) : fragmentByStart[g.start] = fragmentByEnd[f.end] = {
                        start: g.start,
                        end: f.end,
                        ring: g.ring.concat(f.ring)
                    }) : (delete fragmentByStart[f.start], f.ring.unshift(start), fragmentByStart[f.start = startIndex] = f) : fragmentByStart[startIndex] = fragmentByEnd[endIndex] = {
                        start: startIndex,
                        end: endIndex,
                        ring: [
                            start,
                            end
                        ]
                    };
                }
                cases[t2 << 3].forEach(stitch);
            }(values, value, function(ring) {
                smooth(ring, values, value), function(ring) {
                    for(var i = 0, n = ring.length, area = ring[n - 1][1] * ring[0][0] - ring[n - 1][0] * ring[0][1]; ++i < n;)area += ring[i - 1][1] * ring[i][0] - ring[i - 1][0] * ring[i][1];
                    return area;
                }(ring) > 0 ? polygons.push([
                    ring
                ]) : holes.push(ring);
            }), holes.forEach(function(hole) {
                for(var polygon, i = 0, n = polygons.length; i < n; ++i)if (-1 !== function(ring, hole) {
                    for(var c, i = -1, n = hole.length; ++i < n;)if (c = function(ring, point) {
                        for(var x = point[0], y = point[1], contains = -1, i = 0, n = ring.length, j = n - 1; i < n; j = i++){
                            var pi = ring[i], xi = pi[0], yi = pi[1], pj = ring[j], xj = pj[0], yj = pj[1];
                            if (function(a, b, c) {
                                var i, p, q, r;
                                return (b[0] - a[0]) * (c[1] - a[1]) == (c[0] - a[0]) * (b[1] - a[1]) && (p = a[i = +(a[0] === b[0])], q = c[i], r = b[i], p <= q && q <= r || r <= q && q <= p);
                            }(pi, pj, point)) return 0;
                            yi > y != yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi && (contains = -contains);
                        }
                        return contains;
                    }(ring, hole[i])) return c;
                    return 0;
                }((polygon = polygons[i])[0], hole)) {
                    polygon.push(hole);
                    return;
                }
            }), {
                type: "MultiPolygon",
                value: value,
                coordinates: polygons
            });
        }
        function index(point) {
            return 2 * point[0] + point[1] * (dx + 1) * 4;
        }
        function smoothLinear(ring, values, value) {
            ring.forEach(function(point) {
                var v0, x = point[0], y = point[1], xt = 0 | x, yt = 0 | y, v1 = values[yt * dx + xt];
                x > 0 && x < dx && xt === x && (v0 = values[yt * dx + xt - 1], point[0] = x + (value - v0) / (v1 - v0) - 0.5), y > 0 && y < dy && yt === y && (v0 = values[(yt - 1) * dx + xt], point[1] = y + (value - v0) / (v1 - v0) - 0.5);
            });
        }
        return contours.contour = contour, contours.size = function(_) {
            if (!arguments.length) return [
                dx,
                dy
            ];
            var _0 = Math.floor(_[0]), _1 = Math.floor(_[1]);
            if (!(_0 >= 0 && _1 >= 0)) throw Error("invalid size");
            return dx = _0, dy = _1, contours;
        }, contours.thresholds = function(_) {
            return arguments.length ? (threshold = "function" == typeof _ ? _ : Array.isArray(_) ? constant$6(slice$3.call(_)) : constant$6(_), contours) : threshold;
        }, contours.smooth = function(_) {
            return arguments.length ? (smooth = _ ? smoothLinear : noop$1, contours) : smooth === smoothLinear;
        }, contours;
    }
    // TODO Optimize edge cases.
    // TODO Optimize index calculation.
    // TODO Optimize arguments.
    function blurX(source, target, r) {
        for(var n = source.width, m = source.height, w = (r << 1) + 1, j = 0; j < m; ++j)for(var i = 0, sr = 0; i < n + r; ++i)i < n && (sr += source.data[i + j * n]), i >= r && (i >= w && (sr -= source.data[i - w + j * n]), target.data[i - r + j * n] = sr / Math.min(i + 1, n - 1 + w - i, w));
    }
    // TODO Optimize edge cases.
    // TODO Optimize index calculation.
    // TODO Optimize arguments.
    function blurY(source, target, r) {
        for(var n = source.width, m = source.height, w = (r << 1) + 1, i = 0; i < n; ++i)for(var j = 0, sr = 0; j < m + r; ++j)j < m && (sr += source.data[i + j * n]), j >= r && (j >= w && (sr -= source.data[i + (j - w) * n]), target.data[i + (j - r) * n] = sr / Math.min(j + 1, m - 1 + w - j, w));
    }
    function defaultX(d) {
        return d[0];
    }
    function defaultY(d) {
        return d[1];
    }
    function defaultWeight() {
        return 1;
    }
    const EDGE_STACK = new Uint32Array(512);
    class Delaunator {
        static from(points, getX = defaultGetX, getY = defaultGetY) {
            const n = points.length, coords = new Float64Array(2 * n);
            for(let i = 0; i < n; i++){
                const p = points[i];
                coords[2 * i] = getX(p), coords[2 * i + 1] = getY(p);
            }
            return new Delaunator(coords);
        }
        constructor(coords){
            const n = coords.length >> 1;
            if (n > 0 && 'number' != typeof coords[0]) throw Error('Expected coords to contain numbers.');
            this.coords = coords;
            // arrays that will store the triangulation graph
            const maxTriangles = Math.max(2 * n - 5, 0);
            this._triangles = new Uint32Array(3 * maxTriangles), this._halfedges = new Int32Array(3 * maxTriangles), // temporary arrays for tracking the edges of the advancing convex hull
            this._hashSize = Math.ceil(Math.sqrt(n)), this._hullPrev = new Uint32Array(n), this._hullNext = new Uint32Array(n), this._hullTri = new Uint32Array(n), this._hullHash = new Int32Array(this._hashSize).fill(-1), // temporary arrays for sorting points
            this._ids = new Uint32Array(n), this._dists = new Float64Array(n), this.update();
        }
        update() {
            let i0, i1, i2;
            const { coords, _hullPrev: hullPrev, _hullNext: hullNext, _hullTri: hullTri, _hullHash: hullHash } = this, n = coords.length >> 1;
            // populate an array of point indices; calculate input data bbox
            let minX = 1 / 0, minY = 1 / 0, maxX = -1 / 0, maxY = -1 / 0;
            for(let i = 0; i < n; i++){
                const x = coords[2 * i], y = coords[2 * i + 1];
                x < minX && (minX = x), y < minY && (minY = y), x > maxX && (maxX = x), y > maxY && (maxY = y), this._ids[i] = i;
            }
            const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
            let minDist = 1 / 0;
            // pick a seed point close to the center
            for(let i = 0; i < n; i++){
                const d = dist(cx, cy, coords[2 * i], coords[2 * i + 1]);
                d < minDist && (i0 = i, minDist = d);
            }
            const i0x = coords[2 * i0], i0y = coords[2 * i0 + 1];
            minDist = 1 / 0;
            // find the point closest to the seed
            for(let i = 0; i < n; i++){
                if (i === i0) continue;
                const d = dist(i0x, i0y, coords[2 * i], coords[2 * i + 1]);
                d < minDist && d > 0 && (i1 = i, minDist = d);
            }
            let i1x = coords[2 * i1], i1y = coords[2 * i1 + 1], minRadius = 1 / 0;
            // find the third point which forms the smallest circumcircle with the first two
            for(let i = 0; i < n; i++){
                if (i === i0 || i === i1) continue;
                const r = function(ax, ay, bx, by, cx, cy) {
                    const dx = bx - ax, dy = by - ay, ex = cx - ax, ey = cy - ay, bl = dx * dx + dy * dy, cl = ex * ex + ey * ey, d = 0.5 / (dx * ey - dy * ex), x = (ey * bl - dy * cl) * d, y = (dx * cl - ex * bl) * d;
                    return x * x + y * y;
                }(i0x, i0y, i1x, i1y, coords[2 * i], coords[2 * i + 1]);
                r < minRadius && (i2 = i, minRadius = r);
            }
            let i2x = coords[2 * i2], i2y = coords[2 * i2 + 1];
            if (minRadius === 1 / 0) {
                // order collinear points by dx (or dy if all x are identical)
                // and return the list as a hull
                for(let i = 0; i < n; i++)this._dists[i] = coords[2 * i] - coords[0] || coords[2 * i + 1] - coords[1];
                quicksort(this._ids, this._dists, 0, n - 1);
                const hull = new Uint32Array(n);
                let j = 0;
                for(let i = 0, d0 = -1 / 0; i < n; i++){
                    const id = this._ids[i];
                    this._dists[id] > d0 && (hull[j++] = id, d0 = this._dists[id]);
                }
                this.hull = hull.subarray(0, j), this.triangles = new Uint32Array(0), this.halfedges = new Uint32Array(0);
                return;
            }
            // swap the order of the seed points for counter-clockwise orientation
            if (orient(i0x, i0y, i1x, i1y, i2x, i2y)) {
                const i = i1, x = i1x, y = i1y;
                i1 = i2, i1x = i2x, i1y = i2y, i2 = i, i2x = x, i2y = y;
            }
            const center = function(ax, ay, bx, by, cx, cy) {
                const dx = bx - ax, dy = by - ay, ex = cx - ax, ey = cy - ay, bl = dx * dx + dy * dy, cl = ex * ex + ey * ey, d = 0.5 / (dx * ey - dy * ex);
                return {
                    x: ax + (ey * bl - dy * cl) * d,
                    y: ay + (dx * cl - ex * bl) * d
                };
            }(i0x, i0y, i1x, i1y, i2x, i2y);
            this._cx = center.x, this._cy = center.y;
            for(let i = 0; i < n; i++)this._dists[i] = dist(coords[2 * i], coords[2 * i + 1], center.x, center.y);
            // sort the points by distance from the seed triangle circumcenter
            quicksort(this._ids, this._dists, 0, n - 1), // set up the seed triangle as the starting hull
            this._hullStart = i0;
            let hullSize = 3;
            hullNext[i0] = hullPrev[i2] = i1, hullNext[i1] = hullPrev[i0] = i2, hullNext[i2] = hullPrev[i1] = i0, hullTri[i0] = 0, hullTri[i1] = 1, hullTri[i2] = 2, hullHash.fill(-1), hullHash[this._hashKey(i0x, i0y)] = i0, hullHash[this._hashKey(i1x, i1y)] = i1, hullHash[this._hashKey(i2x, i2y)] = i2, this.trianglesLen = 0, this._addTriangle(i0, i1, i2, -1, -1, -1);
            for(let k = 0, xp, yp; k < this._ids.length; k++){
                const i = this._ids[k], x = coords[2 * i], y = coords[2 * i + 1];
                // skip near-duplicate points
                if (k > 0 && 0.0000000000000002220446049250313 >= Math.abs(x - xp) && 0.0000000000000002220446049250313 >= Math.abs(y - yp) || (xp = x, yp = y, i === i0 || i === i1 || i === i2)) continue;
                // find a visible edge on the convex hull using edge hash
                let start = 0;
                for(let j = 0, key = this._hashKey(x, y); j < this._hashSize && (-1 === (start = hullHash[(key + j) % this._hashSize]) || start === hullNext[start]); j++);
                let e = start = hullPrev[start], q;
                for(; q = hullNext[e], !orient(x, y, coords[2 * e], coords[2 * e + 1], coords[2 * q], coords[2 * q + 1]);)if ((e = q) === start) {
                    e = -1;
                    break;
                }
                if (-1 === e) continue; // likely a near-duplicate point; skip it
                // add the first triangle from the point
                let t = this._addTriangle(e, i, hullNext[e], -1, -1, hullTri[e]);
                // recursively flip triangles from the point until they satisfy the Delaunay condition
                hullTri[i] = this._legalize(t + 2), hullTri[e] = t, hullSize++;
                // walk forward through the hull, adding more triangles and flipping recursively
                let n = hullNext[e];
                for(; q = hullNext[n], orient(x, y, coords[2 * n], coords[2 * n + 1], coords[2 * q], coords[2 * q + 1]);)t = this._addTriangle(n, i, q, hullTri[i], -1, hullTri[n]), hullTri[i] = this._legalize(t + 2), hullNext[n] = n, hullSize--, n = q;
                // walk backward from the other side, adding more triangles and flipping
                if (e === start) for(; orient(x, y, coords[2 * (q = hullPrev[e])], coords[2 * q + 1], coords[2 * e], coords[2 * e + 1]);)t = this._addTriangle(q, i, e, -1, hullTri[e], hullTri[q]), this._legalize(t + 2), hullTri[q] = t, hullNext[e] = e, hullSize--, e = q;
                // update the hull indices
                this._hullStart = hullPrev[i] = e, hullNext[e] = hullPrev[n] = i, hullNext[i] = n, // save the two new edges in the hash table
                hullHash[this._hashKey(x, y)] = i, hullHash[this._hashKey(coords[2 * e], coords[2 * e + 1])] = e;
            }
            this.hull = new Uint32Array(hullSize);
            for(let i = 0, e = this._hullStart; i < hullSize; i++)this.hull[i] = e, e = hullNext[e];
            // trim typed triangle mesh arrays
            this.triangles = this._triangles.subarray(0, this.trianglesLen), this.halfedges = this._halfedges.subarray(0, this.trianglesLen);
        }
        _hashKey(x, y) {
            return Math.floor(// monotonically increases with real angle, but doesn't need expensive trigonometry
            function(dx, dy) {
                const p = dx / (Math.abs(dx) + Math.abs(dy));
                return (dy > 0 ? 3 - p : 1 + p) / 4; // [0..1]
            }(x - this._cx, y - this._cy) * this._hashSize) % this._hashSize;
        }
        _legalize(a) {
            const { _triangles: triangles, _halfedges: halfedges, coords } = this;
            let i = 0, ar = 0;
            // recursion eliminated with a fixed-size stack
            for(;;){
                const b = halfedges[a], a0 = a - a % 3;
                if (ar = a0 + (a + 2) % 3, -1 === b) {
                    if (0 === i) break;
                    a = EDGE_STACK[--i];
                    continue;
                }
                const b0 = b - b % 3, al = a0 + (a + 1) % 3, bl = b0 + (b + 2) % 3, p0 = triangles[ar], pr = triangles[a], pl = triangles[al], p1 = triangles[bl];
                if (function(ax, ay, bx, by, cx, cy, px, py) {
                    const dx = ax - px, dy = ay - py, ex = bx - px, ey = by - py, fx = cx - px, fy = cy - py, bp = ex * ex + ey * ey, cp = fx * fx + fy * fy;
                    return dx * (ey * cp - bp * fy) - dy * (ex * cp - bp * fx) + (dx * dx + dy * dy) * (ex * fy - ey * fx) < 0;
                }(coords[2 * p0], coords[2 * p0 + 1], coords[2 * pr], coords[2 * pr + 1], coords[2 * pl], coords[2 * pl + 1], coords[2 * p1], coords[2 * p1 + 1])) {
                    triangles[a] = p1, triangles[b] = p0;
                    const hbl = halfedges[bl];
                    // edge swapped on the other side of the hull (rare); fix the halfedge reference
                    if (-1 === hbl) {
                        let e = this._hullStart;
                        do {
                            if (this._hullTri[e] === bl) {
                                this._hullTri[e] = a;
                                break;
                            }
                            e = this._hullPrev[e];
                        }while (e !== this._hullStart)
                    }
                    this._link(a, hbl), this._link(b, halfedges[ar]), this._link(ar, bl);
                    const br = b0 + (b + 1) % 3;
                    i < EDGE_STACK.length && (EDGE_STACK[i++] = br);
                } else {
                    if (0 === i) break;
                    a = EDGE_STACK[--i];
                }
            }
            return ar;
        }
        _link(a, b) {
            this._halfedges[a] = b, -1 !== b && (this._halfedges[b] = a);
        }
        // add a new triangle given vertex indices and adjacent half-edge ids
        _addTriangle(i0, i1, i2, a, b, c) {
            const t = this.trianglesLen;
            return this._triangles[t] = i0, this._triangles[t + 1] = i1, this._triangles[t + 2] = i2, this._link(t, a), this._link(t + 1, b), this._link(t + 2, c), this.trianglesLen += 3, t;
        }
    }
    function dist(ax, ay, bx, by) {
        const dx = ax - bx, dy = ay - by;
        return dx * dx + dy * dy;
    }
    // return 2d orientation sign if we're confident in it through J. Shewchuk's error bound check
    function orientIfSure(px, py, rx, ry, qx, qy) {
        const l = (ry - py) * (qx - px), r = (rx - px) * (qy - py);
        return Math.abs(l - r) >= 3.3306690738754716e-16 * Math.abs(l + r) ? l - r : 0;
    }
    // a more robust orientation test that's stable in a given triangle (to fix robustness issues)
    function orient(rx, ry, qx, qy, px, py) {
        return 0 > (orientIfSure(px, py, rx, ry, qx, qy) || orientIfSure(rx, ry, qx, qy, px, py) || orientIfSure(qx, qy, px, py, rx, ry));
    }
    function quicksort(ids, dists, left, right) {
        if (right - left <= 20) for(let i = left + 1; i <= right; i++){
            const temp = ids[i], tempDist = dists[temp];
            let j = i - 1;
            for(; j >= left && dists[ids[j]] > tempDist;)ids[j + 1] = ids[j--];
            ids[j + 1] = temp;
        }
        else {
            const median = left + right >> 1;
            let i = left + 1, j = right;
            swap$1(ids, median, i), dists[ids[left]] > dists[ids[right]] && swap$1(ids, left, right), dists[ids[i]] > dists[ids[right]] && swap$1(ids, i, right), dists[ids[left]] > dists[ids[i]] && swap$1(ids, left, i);
            const temp = ids[i], tempDist = dists[temp];
            for(;;){
                do i++;
                while (dists[ids[i]] < tempDist)
                do j--;
                while (dists[ids[j]] > tempDist)
                if (j < i) break;
                swap$1(ids, i, j);
            }
            ids[left + 1] = ids[j], ids[j] = temp, right - i + 1 >= j - left ? (quicksort(ids, dists, i, right), quicksort(ids, dists, left, j - 1)) : (quicksort(ids, dists, left, j - 1), quicksort(ids, dists, i, right));
        }
    }
    function swap$1(arr, i, j) {
        const tmp = arr[i];
        arr[i] = arr[j], arr[j] = tmp;
    }
    function defaultGetX(p) {
        return p[0];
    }
    function defaultGetY(p) {
        return p[1];
    }
    class Path$1 {
        constructor(){
            this._x0 = this._y0 = this._x1 = this._y1 = null, this._ = "";
        }
        moveTo(x, y) {
            this._ += `M${this._x0 = this._x1 = +x},${this._y0 = this._y1 = +y}`;
        }
        closePath() {
            null !== this._x1 && (this._x1 = this._x0, this._y1 = this._y0, this._ += "Z");
        }
        lineTo(x, y) {
            this._ += `L${this._x1 = +x},${this._y1 = +y}`;
        }
        arc(x, y, r) {
            x = +x, y = +y;
            const x0 = x + (r = +r), y0 = y;
            if (r < 0) throw Error("negative radius");
            null === this._x1 ? this._ += `M${x0},${y0}` : (Math.abs(this._x1 - x0) > 1e-6 || Math.abs(this._y1 - y0) > 1e-6) && (this._ += "L" + x0 + "," + y0), r && (this._ += `A${r},${r},0,1,1,${x - r},${y}A${r},${r},0,1,1,${this._x1 = x0},${this._y1 = y0}`);
        }
        rect(x, y, w, h) {
            this._ += `M${this._x0 = this._x1 = +x},${this._y0 = this._y1 = +y}h${+w}v${+h}h${-w}Z`;
        }
        value() {
            return this._ || null;
        }
    }
    class Polygon {
        constructor(){
            this._ = [];
        }
        moveTo(x, y) {
            this._.push([
                x,
                y
            ]);
        }
        closePath() {
            this._.push(this._[0].slice());
        }
        lineTo(x, y) {
            this._.push([
                x,
                y
            ]);
        }
        value() {
            return this._.length ? this._ : null;
        }
    }
    class Voronoi {
        constructor(delaunay, [xmin, ymin, xmax, ymax] = [
            0,
            0,
            960,
            500
        ]){
            if (!((xmax = +xmax) >= (xmin = +xmin)) || !((ymax = +ymax) >= (ymin = +ymin))) throw Error("invalid bounds");
            this.delaunay = delaunay, this._circumcenters = new Float64Array(2 * delaunay.points.length), this.vectors = new Float64Array(2 * delaunay.points.length), this.xmax = xmax, this.xmin = xmin, this.ymax = ymax, this.ymin = ymin, this._init();
        }
        update() {
            return this.delaunay.update(), this._init(), this;
        }
        _init() {
            const { delaunay: { points, hull, triangles }, vectors } = this, circumcenters = this.circumcenters = this._circumcenters.subarray(0, triangles.length / 3 * 2);
            for(let i = 0, j = 0, n = triangles.length, x, y; i < n; i += 3, j += 2){
                const t1 = 2 * triangles[i], t2 = 2 * triangles[i + 1], t3 = 2 * triangles[i + 2], x1 = points[t1], y1 = points[t1 + 1], x2 = points[t2], y2 = points[t2 + 1], x3 = points[t3], y3 = points[t3 + 1], dx = x2 - x1, dy = y2 - y1, ex = x3 - x1, ey = y3 - y1, bl = dx * dx + dy * dy, cl = ex * ex + ey * ey, ab = (dx * ey - dy * ex) * 2;
                if (ab) {
                    if (1e-8 > Math.abs(ab)) // almost equal points (degenerate triangle)
                    x = (x1 + x3) / 2, y = (y1 + y3) / 2;
                    else {
                        const d = 1 / ab;
                        x = x1 + (ey * bl - dy * cl) * d, y = y1 + (dx * cl - ex * bl) * d;
                    }
                } else // degenerate case (collinear diagram)
                x = (x1 + x3) / 2 - 1e8 * ey, y = (y1 + y3) / 2 + 1e8 * ex;
                circumcenters[j] = x, circumcenters[j + 1] = y;
            }
            // Compute exterior cell rays.
            let h = hull[hull.length - 1], p0, p1 = 4 * h, x0, x1 = points[2 * h], y0, y1 = points[2 * h + 1];
            vectors.fill(0);
            for(let i = 0; i < hull.length; ++i)h = hull[i], p0 = p1, x0 = x1, y0 = y1, p1 = 4 * h, x1 = points[2 * h], y1 = points[2 * h + 1], vectors[p0 + 2] = vectors[p1] = y0 - y1, vectors[p0 + 3] = vectors[p1 + 1] = x1 - x0;
        }
        render(context) {
            const buffer = null == context ? context = new Path$1 : void 0, { delaunay: { halfedges, inedges, hull }, circumcenters, vectors } = this;
            if (hull.length <= 1) return null;
            for(let i = 0, n = halfedges.length; i < n; ++i){
                const j = halfedges[i];
                if (j < i) continue;
                const ti = 2 * Math.floor(i / 3), tj = 2 * Math.floor(j / 3), xi = circumcenters[ti], yi = circumcenters[ti + 1], xj = circumcenters[tj], yj = circumcenters[tj + 1];
                this._renderSegment(xi, yi, xj, yj, context);
            }
            let h0, h1 = hull[hull.length - 1];
            for(let i = 0; i < hull.length; ++i){
                h0 = h1;
                const t = 2 * Math.floor(inedges[h1 = hull[i]] / 3), x = circumcenters[t], y = circumcenters[t + 1], v = 4 * h0, p = this._project(x, y, vectors[v + 2], vectors[v + 3]);
                p && this._renderSegment(x, y, p[0], p[1], context);
            }
            return buffer && buffer.value();
        }
        renderBounds(context) {
            const buffer = null == context ? context = new Path$1 : void 0;
            return context.rect(this.xmin, this.ymin, this.xmax - this.xmin, this.ymax - this.ymin), buffer && buffer.value();
        }
        renderCell(i, context) {
            const buffer = null == context ? context = new Path$1 : void 0, points = this._clip(i);
            if (null === points || !points.length) return;
            context.moveTo(points[0], points[1]);
            let n = points.length;
            for(; points[0] === points[n - 2] && points[1] === points[n - 1] && n > 1;)n -= 2;
            for(let i = 2; i < n; i += 2)(points[i] !== points[i - 2] || points[i + 1] !== points[i - 1]) && context.lineTo(points[i], points[i + 1]);
            return context.closePath(), buffer && buffer.value();
        }
        *cellPolygons() {
            const { delaunay: { points } } = this;
            for(let i = 0, n = points.length / 2; i < n; ++i){
                const cell = this.cellPolygon(i);
                cell && (cell.index = i, yield cell);
            }
        }
        cellPolygon(i) {
            const polygon = new Polygon;
            return this.renderCell(i, polygon), polygon.value();
        }
        _renderSegment(x0, y0, x1, y1, context) {
            let S;
            const c0 = this._regioncode(x0, y0), c1 = this._regioncode(x1, y1);
            0 === c0 && 0 === c1 ? (context.moveTo(x0, y0), context.lineTo(x1, y1)) : (S = this._clipSegment(x0, y0, x1, y1, c0, c1)) && (context.moveTo(S[0], S[1]), context.lineTo(S[2], S[3]));
        }
        contains(i, x, y) {
            return (x = +x) == x && (y = +y) == y && this.delaunay._step(i, x, y) === i;
        }
        *neighbors(i) {
            const ci = this._clip(i);
            if (ci) for (const j of this.delaunay.neighbors(i)){
                const cj = this._clip(j);
                // find the common edge
                if (cj) {
                    loop: for(let ai = 0, li = ci.length; ai < li; ai += 2)for(let aj = 0, lj = cj.length; aj < lj; aj += 2)if (ci[ai] == cj[aj] && ci[ai + 1] == cj[aj + 1] && ci[(ai + 2) % li] == cj[(aj + lj - 2) % lj] && ci[(ai + 3) % li] == cj[(aj + lj - 1) % lj]) {
                        yield j;
                        break loop;
                    }
                }
            }
        }
        _cell(i) {
            const { circumcenters, delaunay: { inedges, halfedges, triangles } } = this, e0 = inedges[i];
            if (-1 === e0) return null; // coincident point
            const points = [];
            let e = e0;
            do {
                const t = Math.floor(e / 3);
                if (points.push(circumcenters[2 * t], circumcenters[2 * t + 1]), triangles[e = e % 3 == 2 ? e - 2 : e + 1] !== i) break; // bad triangulation
                e = halfedges[e];
            }while (e !== e0 && -1 !== e)
            return points;
        }
        _clip(i) {
            // degenerate case (1 valid point: return the box)
            if (0 === i && 1 === this.delaunay.hull.length) return [
                this.xmax,
                this.ymin,
                this.xmax,
                this.ymax,
                this.xmin,
                this.ymax,
                this.xmin,
                this.ymin
            ];
            const points = this._cell(i);
            if (null === points) return null;
            const { vectors: V } = this, v = 4 * i;
            return V[v] || V[v + 1] ? this._clipInfinite(i, points, V[v], V[v + 1], V[v + 2], V[v + 3]) : this._clipFinite(i, points);
        }
        _clipFinite(i, points) {
            let e0, e1;
            const n = points.length;
            let P = null, x0, y0, x1 = points[n - 2], y1 = points[n - 1], c0, c1 = this._regioncode(x1, y1);
            for(let j = 0; j < n; j += 2)if (x0 = x1, y0 = y1, x1 = points[j], y1 = points[j + 1], c0 = c1, c1 = this._regioncode(x1, y1), 0 === c0 && 0 === c1) e0 = e1, e1 = 0, P ? P.push(x1, y1) : P = [
                x1,
                y1
            ];
            else {
                let S, sx0, sy0, sx1, sy1;
                if (0 === c0) {
                    if (null === (S = this._clipSegment(x0, y0, x1, y1, c0, c1))) continue;
                    [sx0, sy0, sx1, sy1] = S;
                } else {
                    if (null === (S = this._clipSegment(x1, y1, x0, y0, c1, c0))) continue;
                    [sx1, sy1, sx0, sy0] = S, e0 = e1, e1 = this._edgecode(sx0, sy0), e0 && e1 && this._edge(i, e0, e1, P, P.length), P ? P.push(sx0, sy0) : P = [
                        sx0,
                        sy0
                    ];
                }
                e0 = e1, e1 = this._edgecode(sx1, sy1), e0 && e1 && this._edge(i, e0, e1, P, P.length), P ? P.push(sx1, sy1) : P = [
                    sx1,
                    sy1
                ];
            }
            if (P) e0 = e1, e1 = this._edgecode(P[0], P[1]), e0 && e1 && this._edge(i, e0, e1, P, P.length);
            else if (this.contains(i, (this.xmin + this.xmax) / 2, (this.ymin + this.ymax) / 2)) return [
                this.xmax,
                this.ymin,
                this.xmax,
                this.ymax,
                this.xmin,
                this.ymax,
                this.xmin,
                this.ymin
            ];
            return P;
        }
        _clipSegment(x0, y0, x1, y1, c0, c1) {
            for(;;){
                if (0 === c0 && 0 === c1) return [
                    x0,
                    y0,
                    x1,
                    y1
                ];
                if (c0 & c1) return null;
                let x, y, c = c0 || c1;
                0b1000 & c ? (x = x0 + (x1 - x0) * (this.ymax - y0) / (y1 - y0), y = this.ymax) : 0b0100 & c ? (x = x0 + (x1 - x0) * (this.ymin - y0) / (y1 - y0), y = this.ymin) : 0b0010 & c ? (y = y0 + (y1 - y0) * (this.xmax - x0) / (x1 - x0), x = this.xmax) : (y = y0 + (y1 - y0) * (this.xmin - x0) / (x1 - x0), x = this.xmin), c0 ? (x0 = x, y0 = y, c0 = this._regioncode(x0, y0)) : (x1 = x, y1 = y, c1 = this._regioncode(x1, y1));
            }
        }
        _clipInfinite(i, points, vx0, vy0, vxn, vyn) {
            let P = Array.from(points), p;
            if ((p = this._project(P[0], P[1], vx0, vy0)) && P.unshift(p[0], p[1]), (p = this._project(P[P.length - 2], P[P.length - 1], vxn, vyn)) && P.push(p[0], p[1]), P = this._clipFinite(i, P)) for(let j = 0, n = P.length, c0, c1 = this._edgecode(P[n - 2], P[n - 1]); j < n; j += 2)c0 = c1, c1 = this._edgecode(P[j], P[j + 1]), c0 && c1 && (j = this._edge(i, c0, c1, P, j), n = P.length);
            else this.contains(i, (this.xmin + this.xmax) / 2, (this.ymin + this.ymax) / 2) && (P = [
                this.xmin,
                this.ymin,
                this.xmax,
                this.ymin,
                this.xmax,
                this.ymax,
                this.xmin,
                this.ymax
            ]);
            return P;
        }
        _edge(i, e0, e1, P, j) {
            for(; e0 !== e1;){
                let x, y;
                switch(e0){
                    case 0b0101:
                        e0 = 0b0100;
                        continue; // top-left
                    case 0b0100:
                        e0 = 0b0110, x = this.xmax, y = this.ymin;
                        break; // top
                    case 0b0110:
                        e0 = 0b0010;
                        continue; // top-right
                    case 0b0010:
                        e0 = 0b1010, x = this.xmax, y = this.ymax;
                        break; // right
                    case 0b1010:
                        e0 = 0b1000;
                        continue; // bottom-right
                    case 0b1000:
                        e0 = 0b1001, x = this.xmin, y = this.ymax;
                        break; // bottom
                    case 0b1001:
                        e0 = 0b0001;
                        continue; // bottom-left
                    case 0b0001:
                        e0 = 0b0101, x = this.xmin, y = this.ymin;
                }
                (P[j] !== x || P[j + 1] !== y) && this.contains(i, x, y) && (P.splice(j, 0, x, y), j += 2);
            }
            if (P.length > 4) for(let i = 0; i < P.length; i += 2){
                const j = (i + 2) % P.length, k = (i + 4) % P.length;
                (P[i] === P[j] && P[j] === P[k] || P[i + 1] === P[j + 1] && P[j + 1] === P[k + 1]) && (P.splice(j, 2), i -= 2);
            }
            return j;
        }
        _project(x0, y0, vx, vy) {
            let t = 1 / 0, c, x, y;
            if (vy < 0) {
                if (y0 <= this.ymin) return null;
                (c = (this.ymin - y0) / vy) < t && (y = this.ymin, x = x0 + (t = c) * vx);
            } else if (vy > 0) {
                if (y0 >= this.ymax) return null;
                (c = (this.ymax - y0) / vy) < t && (y = this.ymax, x = x0 + (t = c) * vx);
            }
            if (vx > 0) {
                if (x0 >= this.xmax) return null;
                (c = (this.xmax - x0) / vx) < t && (x = this.xmax, y = y0 + (t = c) * vy);
            } else if (vx < 0) {
                if (x0 <= this.xmin) return null;
                (c = (this.xmin - x0) / vx) < t && (x = this.xmin, y = y0 + (t = c) * vy);
            }
            return [
                x,
                y
            ];
        }
        _edgecode(x, y) {
            return (x === this.xmin ? 0b0001 : x === this.xmax ? 0b0010 : 0b0000) | (y === this.ymin ? 0b0100 : y === this.ymax ? 0b1000 : 0b0000);
        }
        _regioncode(x, y) {
            return (x < this.xmin ? 0b0001 : x > this.xmax ? 0b0010 : 0b0000) | (y < this.ymin ? 0b0100 : y > this.ymax ? 0b1000 : 0b0000);
        }
    }
    const tau$3 = 2 * Math.PI, pow = Math.pow;
    function pointX(p) {
        return p[0];
    }
    function pointY(p) {
        return p[1];
    }
    class Delaunay {
        static from(points, fx = pointX, fy = pointY, that) {
            return new Delaunay("length" in points ? function(points, fx, fy, that) {
                const n = points.length, array = new Float64Array(2 * n);
                for(let i = 0; i < n; ++i){
                    const p = points[i];
                    array[2 * i] = fx.call(that, p, i, points), array[2 * i + 1] = fy.call(that, p, i, points);
                }
                return array;
            }(points, fx, fy, that) : Float64Array.from(function*(points, fx, fy, that) {
                let i = 0;
                for (const p of points)yield fx.call(that, p, i, points), yield fy.call(that, p, i, points), ++i;
            }(points, fx, fy, that)));
        }
        constructor(points){
            this._delaunator = new Delaunator(points), this.inedges = new Int32Array(points.length / 2), this._hullIndex = new Int32Array(points.length / 2), this.points = this._delaunator.coords, this._init();
        }
        update() {
            return this._delaunator.update(), this._init(), this;
        }
        _init() {
            const d = this._delaunator, points = this.points;
            // check for collinear
            if (d.hull && d.hull.length > 2 && // A triangulation is collinear if all its triangles have a non-null area
            function(d) {
                const { triangles, coords } = d;
                for(let i = 0; i < triangles.length; i += 3){
                    const a = 2 * triangles[i], b = 2 * triangles[i + 1], c = 2 * triangles[i + 2];
                    if ((coords[c] - coords[a]) * (coords[b + 1] - coords[a + 1]) - (coords[b] - coords[a]) * (coords[c + 1] - coords[a + 1]) > 1e-10) return !1;
                }
                return !0;
            }(d)) {
                this.collinear = Int32Array.from({
                    length: points.length / 2
                }, (_, i)=>i).sort((i, j)=>points[2 * i] - points[2 * j] || points[2 * i + 1] - points[2 * j + 1]); // for exact neighbors
                const e = this.collinear[0], f = this.collinear[this.collinear.length - 1], bounds = [
                    points[2 * e],
                    points[2 * e + 1],
                    points[2 * f],
                    points[2 * f + 1]
                ], r = 1e-8 * Math.hypot(bounds[3] - bounds[1], bounds[2] - bounds[0]);
                for(let i = 0, n = points.length / 2; i < n; ++i){
                    var x, y;
                    const p = [
                        (x = points[2 * i]) + Math.sin(x + (y = points[2 * i + 1])) * r,
                        y + Math.cos(x - y) * r
                    ];
                    points[2 * i] = p[0], points[2 * i + 1] = p[1];
                }
                this._delaunator = new Delaunator(points);
            } else delete this.collinear;
            const halfedges = this.halfedges = this._delaunator.halfedges, hull = this.hull = this._delaunator.hull, triangles = this.triangles = this._delaunator.triangles, inedges = this.inedges.fill(-1), hullIndex = this._hullIndex.fill(-1);
            // Compute an index from each point to an (arbitrary) incoming halfedge
            // Used to give the first neighbor of each point; for this reason,
            // on the hull we give priority to exterior halfedges
            for(let e = 0, n = halfedges.length; e < n; ++e){
                const p = triangles[e % 3 == 2 ? e - 2 : e + 1];
                (-1 === halfedges[e] || -1 === inedges[p]) && (inedges[p] = e);
            }
            for(let i = 0, n = hull.length; i < n; ++i)hullIndex[hull[i]] = i;
            // degenerate case: 1 or 2 (distinct) points
            hull.length <= 2 && hull.length > 0 && (this.triangles = new Int32Array(3).fill(-1), this.halfedges = new Int32Array(3).fill(-1), this.triangles[0] = hull[0], this.triangles[1] = hull[1], this.triangles[2] = hull[1], inedges[hull[0]] = 1, 2 === hull.length && (inedges[hull[1]] = 0));
        }
        voronoi(bounds) {
            return new Voronoi(this, bounds);
        }
        *neighbors(i) {
            const { inedges, hull, _hullIndex, halfedges, triangles, collinear } = this;
            // degenerate case with several collinear points
            if (collinear) {
                const l = collinear.indexOf(i);
                l > 0 && (yield collinear[l - 1]), l < collinear.length - 1 && (yield collinear[l + 1]);
                return;
            }
            const e0 = inedges[i];
            if (-1 === e0) return; // coincident point
            let e = e0, p0 = -1;
            do {
                if (yield p0 = triangles[e], triangles[e = e % 3 == 2 ? e - 2 : e + 1] !== i) return; // bad triangulation
                if (-1 === (e = halfedges[e])) {
                    const p = hull[(_hullIndex[i] + 1) % hull.length];
                    p !== p0 && (yield p);
                    return;
                }
            }while (e !== e0)
        }
        find(x, y, i = 0) {
            let c;
            if ((x = +x) != x || (y = +y) != y) return -1;
            const i0 = i;
            for(; (c = this._step(i, x, y)) >= 0 && c !== i && c !== i0;)i = c;
            return c;
        }
        _step(i, x, y) {
            const { inedges, hull, _hullIndex, halfedges, triangles, points } = this;
            if (-1 === inedges[i] || !points.length) return (i + 1) % (points.length >> 1);
            let c = i, dc = pow(x - points[2 * i], 2) + pow(y - points[2 * i + 1], 2);
            const e0 = inedges[i];
            let e = e0;
            do {
                let t = triangles[e];
                const dt = pow(x - points[2 * t], 2) + pow(y - points[2 * t + 1], 2);
                if (dt < dc && (dc = dt, c = t), triangles[e = e % 3 == 2 ? e - 2 : e + 1] !== i) break; // bad triangulation
                if (-1 === (e = halfedges[e])) {
                    if ((e = hull[(_hullIndex[i] + 1) % hull.length]) !== t && pow(x - points[2 * e], 2) + pow(y - points[2 * e + 1], 2) < dc) return e;
                    break;
                }
            }while (e !== e0)
            return c;
        }
        render(context) {
            const buffer = null == context ? context = new Path$1 : void 0, { points, halfedges, triangles } = this;
            for(let i = 0, n = halfedges.length; i < n; ++i){
                const j = halfedges[i];
                if (j < i) continue;
                const ti = 2 * triangles[i], tj = 2 * triangles[j];
                context.moveTo(points[ti], points[ti + 1]), context.lineTo(points[tj], points[tj + 1]);
            }
            return this.renderHull(context), buffer && buffer.value();
        }
        renderPoints(context, r = 2) {
            const buffer = null == context ? context = new Path$1 : void 0, { points } = this;
            for(let i = 0, n = points.length; i < n; i += 2){
                const x = points[i], y = points[i + 1];
                context.moveTo(x + r, y), context.arc(x, y, r, 0, tau$3);
            }
            return buffer && buffer.value();
        }
        renderHull(context) {
            const buffer = null == context ? context = new Path$1 : void 0, { hull, points } = this, h = 2 * hull[0], n = hull.length;
            context.moveTo(points[h], points[h + 1]);
            for(let i = 1; i < n; ++i){
                const h = 2 * hull[i];
                context.lineTo(points[h], points[h + 1]);
            }
            return context.closePath(), buffer && buffer.value();
        }
        hullPolygon() {
            const polygon = new Polygon;
            return this.renderHull(polygon), polygon.value();
        }
        renderTriangle(i, context) {
            const buffer = null == context ? context = new Path$1 : void 0, { points, triangles } = this, t0 = 2 * triangles[i *= 3], t1 = 2 * triangles[i + 1], t2 = 2 * triangles[i + 2];
            return context.moveTo(points[t0], points[t0 + 1]), context.lineTo(points[t1], points[t1 + 1]), context.lineTo(points[t2], points[t2 + 1]), context.closePath(), buffer && buffer.value();
        }
        *trianglePolygons() {
            const { triangles } = this;
            for(let i = 0, n = triangles.length / 3; i < n; ++i)yield this.trianglePolygon(i);
        }
        trianglePolygon(i) {
            const polygon = new Polygon;
            return this.renderTriangle(i, polygon), polygon.value();
        }
    }
    var EOL = {}, EOF = {};
    function objectConverter(columns) {
        return Function("d", "return {" + columns.map(function(name, i) {
            return JSON.stringify(name) + ": d[" + i + "] || \"\"";
        }).join(",") + "}");
    }
    // Compute unique columns in order of discovery.
    function inferColumns(rows) {
        var columnSet = Object.create(null), columns = [];
        return rows.forEach(function(row) {
            for(var column in row)column in columnSet || columns.push(columnSet[column] = column);
        }), columns;
    }
    function pad(value, width) {
        var s = value + "", length = s.length;
        return length < width ? Array(width - length + 1).join(0) + s : s;
    }
    function dsvFormat(delimiter) {
        var reFormat = RegExp("[\"" + delimiter + "\n\r]"), DELIMITER = delimiter.charCodeAt(0);
        function parseRows(text, f) {
            var t, rows = [], N = text.length, I = 0, n = 0, eof = N <= 0, eol = !1; // current token followed by EOL?
            function token() {
                if (eof) return EOF;
                if (eol) return eol = !1, EOL;
                // Unescape quotes.
                var i, c, j = I;
                if (34 === text.charCodeAt(j)) {
                    for(; I++ < N && 34 !== text.charCodeAt(I) || 34 === text.charCodeAt(++I););
                    return (i = I) >= N ? eof = !0 : 10 === (c = text.charCodeAt(I++)) ? eol = !0 : 13 === c && (eol = !0, 10 === text.charCodeAt(I) && ++I), text.slice(j + 1, i - 1).replace(/""/g, "\"");
                }
                // Find next delimiter or newline.
                for(; I < N;){
                    if (10 === (c = text.charCodeAt(i = I++))) eol = !0;
                    else if (13 === c) eol = !0, 10 === text.charCodeAt(I) && ++I;
                    else if (c !== DELIMITER) continue;
                    return text.slice(j, i);
                }
                // Return last token before EOF.
                return eof = !0, text.slice(j, N);
            }
            for(10 === text.charCodeAt(N - 1) && --N, 13 === text.charCodeAt(N - 1) && --N; (t = token()) !== EOF;){
                for(var row = []; t !== EOL && t !== EOF;)row.push(t), t = token();
                f && null == (row = f(row, n++)) || rows.push(row);
            }
            return rows;
        }
        function preformatBody(rows, columns) {
            return rows.map(function(row) {
                return columns.map(function(column) {
                    return formatValue(row[column]);
                }).join(delimiter);
            });
        }
        function formatRow(row) {
            return row.map(formatValue).join(delimiter);
        }
        function formatValue(value) {
            var date, hours, minutes, seconds, milliseconds, year;
            return null == value ? "" : value instanceof Date ? (hours = (date = value).getUTCHours(), minutes = date.getUTCMinutes(), seconds = date.getUTCSeconds(), milliseconds = date.getUTCMilliseconds(), isNaN(date) ? "Invalid Date" : ((year = date.getUTCFullYear()) < 0 ? "-" + pad(-year, 6) : year > 9999 ? "+" + pad(year, 6) : pad(year, 4)) + "-" + pad(date.getUTCMonth() + 1, 2) + "-" + pad(date.getUTCDate(), 2) + (milliseconds ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + ":" + pad(seconds, 2) + "." + pad(milliseconds, 3) + "Z" : seconds ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + ":" + pad(seconds, 2) + "Z" : minutes || hours ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + "Z" : "")) : reFormat.test(value += "") ? "\"" + value.replace(/"/g, "\"\"") + "\"" : value;
        }
        return {
            parse: function(text, f) {
                var convert, columns, rows = parseRows(text, function(row, i) {
                    var object;
                    if (convert) return convert(row, i - 1);
                    columns = row, convert = f ? (object = objectConverter(row), function(row1, i) {
                        return f(object(row1), i, row);
                    }) : objectConverter(row);
                });
                return rows.columns = columns || [], rows;
            },
            parseRows: parseRows,
            format: function(rows, columns) {
                return null == columns && (columns = inferColumns(rows)), [
                    columns.map(formatValue).join(delimiter)
                ].concat(preformatBody(rows, columns)).join("\n");
            },
            formatBody: function(rows, columns) {
                return null == columns && (columns = inferColumns(rows)), preformatBody(rows, columns).join("\n");
            },
            formatRows: function(rows) {
                return rows.map(formatRow).join("\n");
            },
            formatRow: formatRow,
            formatValue: formatValue
        };
    }
    var csv = dsvFormat(","), csvParse = csv.parse, csvParseRows = csv.parseRows, csvFormat = csv.format, csvFormatBody = csv.formatBody, csvFormatRows = csv.formatRows, csvFormatRow = csv.formatRow, csvFormatValue = csv.formatValue, tsv = dsvFormat("\t"), tsvParse = tsv.parse, tsvParseRows = tsv.parseRows, tsvFormat = tsv.format, tsvFormatBody = tsv.formatBody, tsvFormatRows = tsv.formatRows, tsvFormatRow = tsv.formatRow, tsvFormatValue = tsv.formatValue;
    // https://github.com/d3/d3-dsv/issues/45
    const fixtz = new Date("2019-01-01T00:00").getHours() || new Date("2019-07-01T00:00").getHours();
    function responseBlob(response) {
        if (!response.ok) throw Error(response.status + " " + response.statusText);
        return response.blob();
    }
    function responseArrayBuffer(response) {
        if (!response.ok) throw Error(response.status + " " + response.statusText);
        return response.arrayBuffer();
    }
    function responseText(response) {
        if (!response.ok) throw Error(response.status + " " + response.statusText);
        return response.text();
    }
    function text(input, init) {
        return fetch(input, init).then(responseText);
    }
    function dsvParse(parse) {
        return function(input, init, row) {
            return 2 == arguments.length && "function" == typeof init && (row = init, init = void 0), text(input, init).then(function(response) {
                return parse(response, row);
            });
        };
    }
    var csv$1 = dsvParse(csvParse), tsv$1 = dsvParse(tsvParse);
    function responseJson(response) {
        if (!response.ok) throw Error(response.status + " " + response.statusText);
        if (204 !== response.status && 205 !== response.status) return response.json();
    }
    function parser(type) {
        return (input, init)=>text(input, init).then((text)=>(new DOMParser).parseFromString(text, type));
    }
    var xml = parser("application/xml"), html = parser("text/html"), svg = parser("image/svg+xml");
    function add(tree, x, y, d) {
        if (isNaN(x) || isNaN(y)) return tree; // ignore invalid points
        var parent, xm, ym, xp, yp, right, bottom, i, j, node = tree._root, leaf = {
            data: d
        }, x0 = tree._x0, y0 = tree._y0, x1 = tree._x1, y1 = tree._y1;
        // If the tree is empty, initialize the root as a leaf.
        if (!node) return tree._root = leaf, tree;
        // Find the existing leaf for the new point, or add it.
        for(; node.length;)if ((right = x >= (xm = (x0 + x1) / 2)) ? x0 = xm : x1 = xm, (bottom = y >= (ym = (y0 + y1) / 2)) ? y0 = ym : y1 = ym, parent = node, !(node = node[i = bottom << 1 | right])) return parent[i] = leaf, tree;
        if (// Is the new point is exactly coincident with the existing point?
        xp = +tree._x.call(null, node.data), yp = +tree._y.call(null, node.data), x === xp && y === yp) return leaf.next = node, parent ? parent[i] = leaf : tree._root = leaf, tree;
        // Otherwise, split the leaf node until the old and new point are separated.
        do parent = parent ? parent[i] = [
            ,
            ,
            ,
            , 
        ] : tree._root = [
            ,
            ,
            ,
            , 
        ], (right = x >= (xm = (x0 + x1) / 2)) ? x0 = xm : x1 = xm, (bottom = y >= (ym = (y0 + y1) / 2)) ? y0 = ym : y1 = ym;
        while ((i = bottom << 1 | right) == (j = (yp >= ym) << 1 | xp >= xm))
        return parent[j] = node, parent[i] = leaf, tree;
    }
    function Quad(node, x0, y0, x1, y1) {
        this.node = node, this.x0 = x0, this.y0 = y0, this.x1 = x1, this.y1 = y1;
    }
    function defaultX$1(d) {
        return d[0];
    }
    function defaultY$1(d) {
        return d[1];
    }
    function quadtree(nodes, x, y) {
        var tree = new Quadtree(null == x ? defaultX$1 : x, null == y ? defaultY$1 : y, NaN, NaN, NaN, NaN);
        return null == nodes ? tree : tree.addAll(nodes);
    }
    function Quadtree(x, y, x0, y0, x1, y1) {
        this._x = x, this._y = y, this._x0 = x0, this._y0 = y0, this._x1 = x1, this._y1 = y1, this._root = void 0;
    }
    function leaf_copy(leaf) {
        for(var copy = {
            data: leaf.data
        }, next = copy; leaf = leaf.next;)next = next.next = {
            data: leaf.data
        };
        return copy;
    }
    var treeProto = quadtree.prototype = Quadtree.prototype;
    function constant$7(x) {
        return function() {
            return x;
        };
    }
    function jiggle(random) {
        return (random() - 0.5) * 1e-6;
    }
    function x(d) {
        return d.x + d.vx;
    }
    function y(d) {
        return d.y + d.vy;
    }
    function index$1(d) {
        return d.index;
    }
    function find$1(nodeById, nodeId) {
        var node = nodeById.get(nodeId);
        if (!node) throw Error("node not found: " + nodeId);
        return node;
    }
    function x$1(d) {
        return d.x;
    }
    function y$1(d) {
        return d.y;
    }
    treeProto.copy = function() {
        var nodes, child, copy = new Quadtree(this._x, this._y, this._x0, this._y0, this._x1, this._y1), node = this._root;
        if (!node) return copy;
        if (!node.length) return copy._root = leaf_copy(node), copy;
        for(nodes = [
            {
                source: node,
                target: copy._root = [
                    ,
                    ,
                    ,
                    , 
                ]
            }
        ]; node = nodes.pop();)for(var i = 0; i < 4; ++i)(child = node.source[i]) && (child.length ? nodes.push({
            source: child,
            target: node.target[i] = [
                ,
                ,
                ,
                , 
            ]
        }) : node.target[i] = leaf_copy(child));
        return copy;
    }, treeProto.add = function(d) {
        const x = +this._x.call(null, d), y = +this._y.call(null, d);
        return add(this.cover(x, y), x, y, d);
    }, treeProto.addAll = function(data) {
        var d, i, x, y, n = data.length, xz = Array(n), yz = Array(n), x0 = 1 / 0, y0 = 1 / 0, x1 = -1 / 0, y1 = -1 / 0;
        // Compute the points and their extent.
        for(i = 0; i < n; ++i)!(isNaN(x = +this._x.call(null, d = data[i])) || isNaN(y = +this._y.call(null, d))) && (xz[i] = x, yz[i] = y, x < x0 && (x0 = x), x > x1 && (x1 = x), y < y0 && (y0 = y), y > y1 && (y1 = y));
        // If there were no (valid) points, abort.
        if (x0 > x1 || y0 > y1) return this;
        // Add the new points.
        for(// Expand the tree to cover the new points.
        this.cover(x0, y0).cover(x1, y1), i = 0; i < n; ++i)add(this, xz[i], yz[i], data[i]);
        return this;
    }, treeProto.cover = function(x, y) {
        if (isNaN(x = +x) || isNaN(y = +y)) return this; // ignore invalid points
        var x0 = this._x0, y0 = this._y0, x1 = this._x1, y1 = this._y1;
        // If the quadtree has no extent, initialize them.
        // Integer extent are necessary so that if we later double the extent,
        // the existing quadrant boundaries don’t change due to floating point error!
        if (isNaN(x0)) x1 = (x0 = Math.floor(x)) + 1, y1 = (y0 = Math.floor(y)) + 1;
        else {
            for(var parent, i, z = x1 - x0 || 1, node = this._root; x0 > x || x >= x1 || y0 > y || y >= y1;)switch(i = (y < y0) << 1 | x < x0, (parent = [
                ,
                ,
                ,
                , 
            ])[i] = node, node = parent, z *= 2, i){
                case 0:
                    x1 = x0 + z, y1 = y0 + z;
                    break;
                case 1:
                    x0 = x1 - z, y1 = y0 + z;
                    break;
                case 2:
                    x1 = x0 + z, y0 = y1 - z;
                    break;
                case 3:
                    x0 = x1 - z, y0 = y1 - z;
            }
            this._root && this._root.length && (this._root = node);
        }
        return this._x0 = x0, this._y0 = y0, this._x1 = x1, this._y1 = y1, this;
    }, treeProto.data = function() {
        var data = [];
        return this.visit(function(node) {
            if (!node.length) do data.push(node.data);
            while (node = node.next)
        }), data;
    }, treeProto.extent = function(_) {
        return arguments.length ? this.cover(+_[0][0], +_[0][1]).cover(+_[1][0], +_[1][1]) : isNaN(this._x0) ? void 0 : [
            [
                this._x0,
                this._y0
            ],
            [
                this._x1,
                this._y1
            ]
        ];
    }, treeProto.find = function(x, y, radius) {
        var data, x1, y1, x2, y2, q, i, x0 = this._x0, y0 = this._y0, x3 = this._x1, y3 = this._y1, quads = [], node = this._root;
        for(node && quads.push(new Quad(node, x0, y0, x3, y3)), null == radius ? radius = 1 / 0 : (x0 = x - radius, y0 = y - radius, x3 = x + radius, y3 = y + radius, radius *= radius); q = quads.pop();)// Stop searching if this quadrant can’t contain a closer node.
        if ((node = q.node) && !((x1 = q.x0) > x3) && !((y1 = q.y0) > y3) && !((x2 = q.x1) < x0) && !((y2 = q.y1) < y0)) {
            // Bisect the current quadrant.
            if (node.length) {
                var xm = (x1 + x2) / 2, ym = (y1 + y2) / 2;
                quads.push(new Quad(node[3], xm, ym, x2, y2), new Quad(node[2], x1, ym, xm, y2), new Quad(node[1], xm, y1, x2, ym), new Quad(node[0], x1, y1, xm, ym)), (i = (y >= ym) << 1 | x >= xm) && (q = quads[quads.length - 1], quads[quads.length - 1] = quads[quads.length - 1 - i], quads[quads.length - 1 - i] = q);
            } else {
                var dx = x - +this._x.call(null, node.data), dy = y - +this._y.call(null, node.data), d2 = dx * dx + dy * dy;
                if (d2 < radius) {
                    var d = Math.sqrt(radius = d2);
                    x0 = x - d, y0 = y - d, x3 = x + d, y3 = y + d, data = node.data;
                }
            }
        }
        return data;
    }, treeProto.remove = function(d) {
        if (isNaN(x = +this._x.call(null, d)) || isNaN(y = +this._y.call(null, d))) return this; // ignore invalid points
        var parent, retainer, previous, next, x, y, xm, ym, right, bottom, i, j, node = this._root, x0 = this._x0, y0 = this._y0, x1 = this._x1, y1 = this._y1;
        // If the tree is empty, initialize the root as a leaf.
        if (!node) return this;
        // Find the leaf node for the point.
        // While descending, also retain the deepest parent with a non-removed sibling.
        if (node.length) for(;;){
            if ((right = x >= (xm = (x0 + x1) / 2)) ? x0 = xm : x1 = xm, (bottom = y >= (ym = (y0 + y1) / 2)) ? y0 = ym : y1 = ym, parent = node, !(node = node[i = bottom << 1 | right])) return this;
            if (!node.length) break;
            (parent[i + 1 & 3] || parent[i + 2 & 3] || parent[i + 3 & 3]) && (retainer = parent, j = i);
        }
        // Find the point to remove.
        for(; node.data !== d;)if (previous = node, !(node = node.next)) return this;
        return ((next = node.next) && delete node.next, previous) ? next ? previous.next = next : delete previous.next : parent ? (// Remove this leaf.
        next ? parent[i] = next : delete parent[i], (node = parent[0] || parent[1] || parent[2] || parent[3]) && node === (parent[3] || parent[2] || parent[1] || parent[0]) && !node.length && (retainer ? retainer[j] = node : this._root = node)) : this._root = next, this;
    }, treeProto.removeAll = function(data) {
        for(var i = 0, n = data.length; i < n; ++i)this.remove(data[i]);
        return this;
    }, treeProto.root = function() {
        return this._root;
    }, treeProto.size = function() {
        var size = 0;
        return this.visit(function(node) {
            if (!node.length) do ++size;
            while (node = node.next)
        }), size;
    }, treeProto.visit = function(callback) {
        var q, child, x0, y0, x1, y1, quads = [], node = this._root;
        for(node && quads.push(new Quad(node, this._x0, this._y0, this._x1, this._y1)); q = quads.pop();)if (!callback(node = q.node, x0 = q.x0, y0 = q.y0, x1 = q.x1, y1 = q.y1) && node.length) {
            var xm = (x0 + x1) / 2, ym = (y0 + y1) / 2;
            (child = node[3]) && quads.push(new Quad(child, xm, ym, x1, y1)), (child = node[2]) && quads.push(new Quad(child, x0, ym, xm, y1)), (child = node[1]) && quads.push(new Quad(child, xm, y0, x1, ym)), (child = node[0]) && quads.push(new Quad(child, x0, y0, xm, ym));
        }
        return this;
    }, treeProto.visitAfter = function(callback) {
        var q, quads = [], next = [];
        for(this._root && quads.push(new Quad(this._root, this._x0, this._y0, this._x1, this._y1)); q = quads.pop();){
            var node = q.node;
            if (node.length) {
                var child, x0 = q.x0, y0 = q.y0, x1 = q.x1, y1 = q.y1, xm = (x0 + x1) / 2, ym = (y0 + y1) / 2;
                (child = node[0]) && quads.push(new Quad(child, x0, y0, xm, ym)), (child = node[1]) && quads.push(new Quad(child, xm, y0, x1, ym)), (child = node[2]) && quads.push(new Quad(child, x0, ym, xm, y1)), (child = node[3]) && quads.push(new Quad(child, xm, ym, x1, y1));
            }
            next.push(q);
        }
        for(; q = next.pop();)callback(q.node, q.x0, q.y0, q.x1, q.y1);
        return this;
    }, treeProto.x = function(_) {
        return arguments.length ? (this._x = _, this) : this._x;
    }, treeProto.y = function(_) {
        return arguments.length ? (this._y = _, this) : this._y;
    };
    var initialAngle = Math.PI * (3 - Math.sqrt(5));
    // Computes the decimal coefficient and exponent of the specified number x with
    // significant digits p, where x is positive and p is in [1, 21] or undefined.
    // For example, formatDecimalParts(1.23) returns ["123", 0].
    function formatDecimalParts(x, p) {
        if ((i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e")) < 0) return null; // NaN, ±Infinity
        var i, coefficient = x.slice(0, i);
        // The string returned by toExponential either has the form \d\.\d+e[-+]\d+
        // (e.g., 1.2e+3) or the form \de[-+]\d+ (e.g., 1e+3).
        return [
            coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient,
            +x.slice(i + 1)
        ];
    }
    function exponent$1(x) {
        return (x = formatDecimalParts(Math.abs(x))) ? x[1] : NaN;
    }
    // [[fill]align][sign][symbol][0][width][,][.precision][~][type]
    var re = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;
    function formatSpecifier(specifier) {
        var match;
        if (!(match = re.exec(specifier))) throw Error("invalid format: " + specifier);
        return new FormatSpecifier({
            fill: match[1],
            align: match[2],
            sign: match[3],
            symbol: match[4],
            zero: match[5],
            width: match[6],
            comma: match[7],
            precision: match[8] && match[8].slice(1),
            trim: match[9],
            type: match[10]
        });
    }
    function FormatSpecifier(specifier) {
        this.fill = void 0 === specifier.fill ? " " : specifier.fill + "", this.align = void 0 === specifier.align ? ">" : specifier.align + "", this.sign = void 0 === specifier.sign ? "-" : specifier.sign + "", this.symbol = void 0 === specifier.symbol ? "" : specifier.symbol + "", this.zero = !!specifier.zero, this.width = void 0 === specifier.width ? void 0 : +specifier.width, this.comma = !!specifier.comma, this.precision = void 0 === specifier.precision ? void 0 : +specifier.precision, this.trim = !!specifier.trim, this.type = void 0 === specifier.type ? "" : specifier.type + "";
    }
    function formatRounded(x, p) {
        var d = formatDecimalParts(x, p);
        if (!d) return x + "";
        var coefficient = d[0], exponent = d[1];
        return exponent < 0 ? "0." + Array(-exponent).join("0") + coefficient : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1) : coefficient + Array(exponent - coefficient.length + 2).join("0");
    }
    formatSpecifier.prototype = FormatSpecifier.prototype, FormatSpecifier.prototype.toString = function() {
        return this.fill + this.align + this.sign + this.symbol + (this.zero ? "0" : "") + (void 0 === this.width ? "" : Math.max(1, 0 | this.width)) + (this.comma ? "," : "") + (void 0 === this.precision ? "" : "." + Math.max(0, 0 | this.precision)) + (this.trim ? "~" : "") + this.type;
    };
    var formatTypes = {
        "%": (x, p)=>(100 * x).toFixed(p),
        b: (x)=>Math.round(x).toString(2),
        c: (x)=>x + "",
        d: function(x) {
            return Math.abs(x = Math.round(x)) >= 1e21 ? x.toLocaleString("en").replace(/,/g, "") : x.toString(10);
        },
        e: (x, p)=>x.toExponential(p),
        f: (x, p)=>x.toFixed(p),
        g: (x, p)=>x.toPrecision(p),
        o: (x)=>Math.round(x).toString(8),
        p: (x, p)=>formatRounded(100 * x, p),
        r: formatRounded,
        s: function(x, p) {
            var d = formatDecimalParts(x, p);
            if (!d) return x + "";
            var coefficient = d[0], exponent = d[1], i = exponent - (prefixExponent = 3 * Math.max(-8, Math.min(8, Math.floor(exponent / 3)))) + 1, n = coefficient.length;
            return i === n ? coefficient : i > n ? coefficient + Array(i - n + 1).join("0") : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i) : "0." + Array(1 - i).join("0") + formatDecimalParts(x, Math.max(0, p + i - 1))[0]; // less than 1y!
        },
        X: (x)=>Math.round(x).toString(16).toUpperCase(),
        x: (x)=>Math.round(x).toString(16)
    };
    function identity$3(x) {
        return x;
    }
    var map$1 = Array.prototype.map, prefixes = [
        "y",
        "z",
        "a",
        "f",
        "p",
        "n",
        "\xB5",
        "m",
        "",
        "k",
        "M",
        "G",
        "T",
        "P",
        "E",
        "Z",
        "Y"
    ];
    function formatLocale(locale) {
        var grouping, thousands, numerals, group = void 0 === locale.grouping || void 0 === locale.thousands ? identity$3 : (grouping = map$1.call(locale.grouping, Number), thousands = locale.thousands + "", function(value, width) {
            for(var i = value.length, t = [], j = 0, g = grouping[0], length = 0; i > 0 && g > 0 && (length + g + 1 > width && (g = Math.max(1, width - length)), t.push(value.substring(i -= g, i + g)), !((length += g + 1) > width));)g = grouping[j = (j + 1) % grouping.length];
            return t.reverse().join(thousands);
        }), currencyPrefix = void 0 === locale.currency ? "" : locale.currency[0] + "", currencySuffix = void 0 === locale.currency ? "" : locale.currency[1] + "", decimal = void 0 === locale.decimal ? "." : locale.decimal + "", numerals1 = void 0 === locale.numerals ? identity$3 : (numerals = map$1.call(locale.numerals, String), function(value) {
            return value.replace(/[0-9]/g, function(i) {
                return numerals[+i];
            });
        }), percent = void 0 === locale.percent ? "%" : locale.percent + "", minus = void 0 === locale.minus ? "\u2212" : locale.minus + "", nan = void 0 === locale.nan ? "NaN" : locale.nan + "";
        function newFormat(specifier) {
            var fill = (specifier = formatSpecifier(specifier)).fill, align = specifier.align, sign = specifier.sign, symbol = specifier.symbol, zero = specifier.zero, width = specifier.width, comma = specifier.comma, precision = specifier.precision, trim = specifier.trim, type = specifier.type;
            "n" === type ? (comma = !0, type = "g") : formatTypes[type] || (void 0 === precision && (precision = 12), trim = !0, type = "g"), (zero || "0" === fill && "=" === align) && (zero = !0, fill = "0", align = "=");
            // Compute the prefix and suffix.
            // For SI-prefix, the suffix is lazily computed.
            var prefix = "$" === symbol ? currencyPrefix : "#" === symbol && /[boxX]/.test(type) ? "0" + type.toLowerCase() : "", suffix = "$" === symbol ? currencySuffix : /[%p]/.test(type) ? percent : "", formatType = formatTypes[type], maybeSuffix = /[defgprs%]/.test(type);
            function format(value) {
                var i, n, c, valuePrefix = prefix, valueSuffix = suffix;
                if ("c" === type) valueSuffix = formatType(value) + valueSuffix, value = "";
                else {
                    // Determine the sign. -0 is not less than 0, but 1 / -0 is!
                    var valueNegative = (value = +value) < 0 || 1 / value < 0;
                    // Break the formatted value into the integer “value” part that can be
                    // grouped, and fractional or exponential “suffix” part that is not.
                    if (// Perform the initial formatting.
                    value = isNaN(value) ? nan : formatType(Math.abs(value), precision), trim && (value = // Trims insignificant zeros, e.g., replaces 1.2000k with 1.2k.
                    function(s) {
                        out: for(var i1, n = s.length, i = 1, i0 = -1; i < n; ++i)switch(s[i]){
                            case ".":
                                i0 = i1 = i;
                                break;
                            case "0":
                                0 === i0 && (i0 = i), i1 = i;
                                break;
                            default:
                                if (!+s[i]) break out;
                                i0 > 0 && (i0 = 0);
                        }
                        return i0 > 0 ? s.slice(0, i0) + s.slice(i1 + 1) : s;
                    }(value)), valueNegative && 0 == +value && "+" !== sign && (valueNegative = !1), // Compute the prefix and suffix.
                    valuePrefix = (valueNegative ? "(" === sign ? sign : minus : "-" === sign || "(" === sign ? "" : sign) + valuePrefix, valueSuffix = ("s" === type ? prefixes[8 + prefixExponent / 3] : "") + valueSuffix + (valueNegative && "(" === sign ? ")" : ""), maybeSuffix) {
                        for(i = -1, n = value.length; ++i < n;)if (48 > (c = value.charCodeAt(i)) || c > 57) {
                            valueSuffix = (46 === c ? decimal + value.slice(i + 1) : value.slice(i)) + valueSuffix, value = value.slice(0, i);
                            break;
                        }
                    }
                }
                comma && !zero && (value = group(value, 1 / 0));
                // Compute the padding.
                var length = valuePrefix.length + value.length + valueSuffix.length, padding = length < width ? Array(width - length + 1).join(fill) : "";
                // Reconstruct the final output based on the desired alignment.
                switch(comma && zero && (value = group(padding + value, padding.length ? width - valueSuffix.length : 1 / 0), padding = ""), align){
                    case "<":
                        value = valuePrefix + value + valueSuffix + padding;
                        break;
                    case "=":
                        value = valuePrefix + padding + value + valueSuffix;
                        break;
                    case "^":
                        value = padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length);
                        break;
                    default:
                        value = padding + valuePrefix + value + valueSuffix;
                }
                return numerals1(value);
            }
            return(// Set the default precision if not specified,
            // or clamp the specified precision to the supported range.
            // For significant precision, it must be in [1, 21].
            // For fixed precision, it must be in [0, 20].
            precision = void 0 === precision ? 6 : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision)) : Math.max(0, Math.min(20, precision)), format.toString = function() {
                return specifier + "";
            }, format);
        }
        return {
            format: newFormat,
            formatPrefix: function(specifier, value) {
                var f = newFormat(((specifier = formatSpecifier(specifier)).type = "f", specifier)), e = 3 * Math.max(-8, Math.min(8, Math.floor(exponent$1(value) / 3))), k = Math.pow(10, -e), prefix = prefixes[8 + e / 3];
                return function(value) {
                    return f(k * value) + prefix;
                };
            }
        };
    }
    function defaultLocale(definition) {
        return locale = formatLocale(definition), exports1.format = locale.format, exports1.formatPrefix = locale.formatPrefix, locale;
    }
    function precisionFixed(step) {
        return Math.max(0, -exponent$1(Math.abs(step)));
    }
    function precisionPrefix(step, value) {
        return Math.max(0, 3 * Math.max(-8, Math.min(8, Math.floor(exponent$1(value) / 3))) - exponent$1(Math.abs(step)));
    }
    function precisionRound(step, max) {
        return Math.max(0, exponent$1(max = Math.abs(max) - (step = Math.abs(step))) - exponent$1(step)) + 1;
    }
    defaultLocale({
        thousands: ",",
        grouping: [
            3
        ],
        currency: [
            "$",
            ""
        ]
    });
    var pi$3 = Math.PI, halfPi$2 = pi$3 / 2, quarterPi = pi$3 / 4, tau$4 = 2 * pi$3, degrees$2 = 180 / pi$3, radians$1 = pi$3 / 180, abs$2 = Math.abs, atan = Math.atan, atan2 = Math.atan2, cos$1 = Math.cos, ceil = Math.ceil, exp = Math.exp, hypot = Math.hypot, log = Math.log, pow$1 = Math.pow, sin$1 = Math.sin, sign = Math.sign || function(x) {
        return x > 0 ? 1 : x < 0 ? -1 : 0;
    }, sqrt = Math.sqrt, tan = Math.tan;
    function acos(x) {
        return x > 1 ? 0 : x < -1 ? pi$3 : Math.acos(x);
    }
    function asin(x) {
        return x > 1 ? halfPi$2 : x < -1 ? -halfPi$2 : Math.asin(x);
    }
    function noop$2() {}
    function streamGeometry(geometry, stream) {
        geometry && streamGeometryType.hasOwnProperty(geometry.type) && streamGeometryType[geometry.type](geometry, stream);
    }
    var streamObjectType = {
        Feature: function(object, stream) {
            streamGeometry(object.geometry, stream);
        },
        FeatureCollection: function(object, stream) {
            for(var features = object.features, i = -1, n = features.length; ++i < n;)streamGeometry(features[i].geometry, stream);
        }
    }, streamGeometryType = {
        Sphere: function(object, stream) {
            stream.sphere();
        },
        Point: function(object, stream) {
            object = object.coordinates, stream.point(object[0], object[1], object[2]);
        },
        MultiPoint: function(object, stream) {
            for(var coordinates = object.coordinates, i = -1, n = coordinates.length; ++i < n;)object = coordinates[i], stream.point(object[0], object[1], object[2]);
        },
        LineString: function(object, stream) {
            streamLine(object.coordinates, stream, 0);
        },
        MultiLineString: function(object, stream) {
            for(var coordinates = object.coordinates, i = -1, n = coordinates.length; ++i < n;)streamLine(coordinates[i], stream, 0);
        },
        Polygon: function(object, stream) {
            streamPolygon(object.coordinates, stream);
        },
        MultiPolygon: function(object, stream) {
            for(var coordinates = object.coordinates, i = -1, n = coordinates.length; ++i < n;)streamPolygon(coordinates[i], stream);
        },
        GeometryCollection: function(object, stream) {
            for(var geometries = object.geometries, i = -1, n = geometries.length; ++i < n;)streamGeometry(geometries[i], stream);
        }
    };
    function streamLine(coordinates, stream, closed) {
        var coordinate, i = -1, n = coordinates.length - closed;
        for(stream.lineStart(); ++i < n;)coordinate = coordinates[i], stream.point(coordinate[0], coordinate[1], coordinate[2]);
        stream.lineEnd();
    }
    function streamPolygon(coordinates, stream) {
        var i = -1, n = coordinates.length;
        for(stream.polygonStart(); ++i < n;)streamLine(coordinates[i], stream, 1);
        stream.polygonEnd();
    }
    function geoStream(object, stream) {
        object && streamObjectType.hasOwnProperty(object.type) ? streamObjectType[object.type](object, stream) : streamGeometry(object, stream);
    }
    var prefixExponent, locale, lambda00, phi00, lambda0, cosPhi0, sinPhi0, areaRingSum = new Adder(), areaSum = new Adder(), areaStream = {
        point: noop$2,
        lineStart: noop$2,
        lineEnd: noop$2,
        polygonStart: function() {
            areaRingSum = new Adder(), areaStream.lineStart = areaRingStart, areaStream.lineEnd = areaRingEnd;
        },
        polygonEnd: function() {
            var areaRing = +areaRingSum;
            areaSum.add(areaRing < 0 ? tau$4 + areaRing : areaRing), this.lineStart = this.lineEnd = this.point = noop$2;
        },
        sphere: function() {
            areaSum.add(tau$4);
        }
    };
    function areaRingStart() {
        areaStream.point = areaPointFirst;
    }
    function areaRingEnd() {
        areaPoint(lambda00, phi00);
    }
    function areaPointFirst(lambda, phi) {
        areaStream.point = areaPoint, lambda00 = lambda, phi00 = phi, lambda *= radians$1, phi *= radians$1, lambda0 = lambda, cosPhi0 = cos$1(phi = phi / 2 + quarterPi), sinPhi0 = sin$1(phi);
    }
    function areaPoint(lambda, phi) {
        lambda *= radians$1, phi *= radians$1;
        // Spherical excess E for a spherical triangle with vertices: south pole,
        // previous point, current point.  Uses a formula derived from Cagnoli’s
        // theorem.  See Todhunter, Spherical Trig. (1871), Sec. 103, Eq. (2).
        var dLambda = lambda - lambda0, sdLambda = dLambda >= 0 ? 1 : -1, adLambda = sdLambda * dLambda, cosPhi = cos$1(phi = phi / 2 + quarterPi), sinPhi = sin$1(phi), k = sinPhi0 * sinPhi, u = cosPhi0 * cosPhi + k * cos$1(adLambda), v = k * sdLambda * sin$1(adLambda);
        areaRingSum.add(atan2(v, u)), // Advance the previous points.
        lambda0 = lambda, cosPhi0 = cosPhi, sinPhi0 = sinPhi;
    }
    function spherical(cartesian) {
        return [
            atan2(cartesian[1], cartesian[0]),
            asin(cartesian[2])
        ];
    }
    function cartesian(spherical) {
        var lambda = spherical[0], phi = spherical[1], cosPhi = cos$1(phi);
        return [
            cosPhi * cos$1(lambda),
            cosPhi * sin$1(lambda),
            sin$1(phi)
        ];
    }
    function cartesianDot(a, b) {
        return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    }
    function cartesianCross(a, b) {
        return [
            a[1] * b[2] - a[2] * b[1],
            a[2] * b[0] - a[0] * b[2],
            a[0] * b[1] - a[1] * b[0]
        ];
    }
    // TODO return a
    function cartesianAddInPlace(a, b) {
        a[0] += b[0], a[1] += b[1], a[2] += b[2];
    }
    function cartesianScale(vector, k) {
        return [
            vector[0] * k,
            vector[1] * k,
            vector[2] * k
        ];
    }
    // TODO return d
    function cartesianNormalizeInPlace(d) {
        var l = sqrt(d[0] * d[0] + d[1] * d[1] + d[2] * d[2]);
        d[0] /= l, d[1] /= l, d[2] /= l;
    }
    var boundsStream = {
        point: boundsPoint,
        lineStart: boundsLineStart,
        lineEnd: boundsLineEnd,
        polygonStart: function() {
            boundsStream.point = boundsRingPoint, boundsStream.lineStart = boundsRingStart, boundsStream.lineEnd = boundsRingEnd, deltaSum = new Adder(), areaStream.polygonStart();
        },
        polygonEnd: function() {
            areaStream.polygonEnd(), boundsStream.point = boundsPoint, boundsStream.lineStart = boundsLineStart, boundsStream.lineEnd = boundsLineEnd, areaRingSum < 0 ? (lambda0$1 = -(lambda1 = 180), phi0 = -(phi1 = 90)) : deltaSum > 1e-6 ? phi1 = 90 : deltaSum < -0.000001 && (phi0 = -90), range$1[0] = lambda0$1, range$1[1] = lambda1;
        },
        sphere: function() {
            lambda0$1 = -(lambda1 = 180), phi0 = -(phi1 = 90);
        }
    };
    function boundsPoint(lambda, phi) {
        ranges.push(range$1 = [
            lambda0$1 = lambda,
            lambda1 = lambda
        ]), phi < phi0 && (phi0 = phi), phi > phi1 && (phi1 = phi);
    }
    function linePoint(lambda, phi) {
        var p = cartesian([
            lambda * radians$1,
            phi * radians$1
        ]);
        if (p0) {
            var normal = cartesianCross(p0, p), inflection = cartesianCross([
                normal[1],
                -normal[0],
                0
            ], normal);
            cartesianNormalizeInPlace(inflection), inflection = spherical(inflection);
            var phii, delta = lambda - lambda2, sign = delta > 0 ? 1 : -1, lambdai = inflection[0] * degrees$2 * sign, antimeridian = abs$2(delta) > 180;
            antimeridian ^ (sign * lambda2 < lambdai && lambdai < sign * lambda) ? (phii = inflection[1] * degrees$2) > phi1 && (phi1 = phii) : antimeridian ^ (sign * lambda2 < (lambdai = (lambdai + 360) % 360 - 180) && lambdai < sign * lambda) ? (phii = -inflection[1] * degrees$2) < phi0 && (phi0 = phii) : (phi < phi0 && (phi0 = phi), phi > phi1 && (phi1 = phi)), antimeridian ? lambda < lambda2 ? angle(lambda0$1, lambda) > angle(lambda0$1, lambda1) && (lambda1 = lambda) : angle(lambda, lambda1) > angle(lambda0$1, lambda1) && (lambda0$1 = lambda) : lambda1 >= lambda0$1 ? (lambda < lambda0$1 && (lambda0$1 = lambda), lambda > lambda1 && (lambda1 = lambda)) : lambda > lambda2 ? angle(lambda0$1, lambda) > angle(lambda0$1, lambda1) && (lambda1 = lambda) : angle(lambda, lambda1) > angle(lambda0$1, lambda1) && (lambda0$1 = lambda);
        } else ranges.push(range$1 = [
            lambda0$1 = lambda,
            lambda1 = lambda
        ]);
        phi < phi0 && (phi0 = phi), phi > phi1 && (phi1 = phi), p0 = p, lambda2 = lambda;
    }
    function boundsLineStart() {
        boundsStream.point = linePoint;
    }
    function boundsLineEnd() {
        range$1[0] = lambda0$1, range$1[1] = lambda1, boundsStream.point = boundsPoint, p0 = null;
    }
    function boundsRingPoint(lambda, phi) {
        if (p0) {
            var delta = lambda - lambda2;
            deltaSum.add(abs$2(delta) > 180 ? delta + (delta > 0 ? 360 : -360) : delta);
        } else lambda00$1 = lambda, phi00$1 = phi;
        areaStream.point(lambda, phi), linePoint(lambda, phi);
    }
    function boundsRingStart() {
        areaStream.lineStart();
    }
    function boundsRingEnd() {
        boundsRingPoint(lambda00$1, phi00$1), areaStream.lineEnd(), abs$2(deltaSum) > 1e-6 && (lambda0$1 = -(lambda1 = 180)), range$1[0] = lambda0$1, range$1[1] = lambda1, p0 = null;
    }
    // Finds the left-right distance between two longitudes.
    // This is almost the same as (lambda1 - lambda0 + 360°) % 360°, except that we want
    // the distance between ±180° to be 360°.
    function angle(lambda0, lambda1) {
        return (lambda1 -= lambda0) < 0 ? lambda1 + 360 : lambda1;
    }
    function rangeCompare(a, b) {
        return a[0] - b[0];
    }
    function rangeContains(range, x) {
        return range[0] <= range[1] ? range[0] <= x && x <= range[1] : x < range[0] || range[1] < x;
    }
    var centroidStream = {
        sphere: noop$2,
        point: centroidPoint,
        lineStart: centroidLineStart,
        lineEnd: centroidLineEnd,
        polygonStart: function() {
            centroidStream.lineStart = centroidRingStart, centroidStream.lineEnd = centroidRingEnd;
        },
        polygonEnd: function() {
            centroidStream.lineStart = centroidLineStart, centroidStream.lineEnd = centroidLineEnd;
        }
    };
    // Arithmetic mean of Cartesian vectors.
    function centroidPoint(lambda, phi) {
        lambda *= radians$1;
        var cosPhi = cos$1(phi *= radians$1);
        centroidPointCartesian(cosPhi * cos$1(lambda), cosPhi * sin$1(lambda), sin$1(phi));
    }
    function centroidPointCartesian(x, y, z) {
        ++W0, X0 += (x - X0) / W0, Y0 += (y - Y0) / W0, Z0 += (z - Z0) / W0;
    }
    function centroidLineStart() {
        centroidStream.point = centroidLinePointFirst;
    }
    function centroidLinePointFirst(lambda, phi) {
        lambda *= radians$1;
        var cosPhi = cos$1(phi *= radians$1);
        x0 = cosPhi * cos$1(lambda), y0 = cosPhi * sin$1(lambda), z0 = sin$1(phi), centroidStream.point = centroidLinePoint, centroidPointCartesian(x0, y0, z0);
    }
    function centroidLinePoint(lambda, phi) {
        lambda *= radians$1;
        var cosPhi = cos$1(phi *= radians$1), x = cosPhi * cos$1(lambda), y = cosPhi * sin$1(lambda), z = sin$1(phi), w = atan2(sqrt((w = y0 * z - z0 * y) * w + (w = z0 * x - x0 * z) * w + (w = x0 * y - y0 * x) * w), x0 * x + y0 * y + z0 * z);
        W1 += w, X1 += w * (x0 + (x0 = x)), Y1 += w * (y0 + (y0 = y)), Z1 += w * (z0 + (z0 = z)), centroidPointCartesian(x0, y0, z0);
    }
    function centroidLineEnd() {
        centroidStream.point = centroidPoint;
    }
    // See J. E. Brock, The Inertia Tensor for a Spherical Triangle,
    // J. Applied Mechanics 42, 239 (1975).
    function centroidRingStart() {
        centroidStream.point = centroidRingPointFirst;
    }
    function centroidRingEnd() {
        centroidRingPoint(lambda00$2, phi00$2), centroidStream.point = centroidPoint;
    }
    function centroidRingPointFirst(lambda, phi) {
        lambda00$2 = lambda, phi00$2 = phi, lambda *= radians$1, phi *= radians$1, centroidStream.point = centroidRingPoint;
        var cosPhi = cos$1(phi);
        x0 = cosPhi * cos$1(lambda), y0 = cosPhi * sin$1(lambda), z0 = sin$1(phi), centroidPointCartesian(x0, y0, z0);
    }
    function centroidRingPoint(lambda, phi) {
        lambda *= radians$1;
        var cosPhi = cos$1(phi *= radians$1), x = cosPhi * cos$1(lambda), y = cosPhi * sin$1(lambda), z = sin$1(phi), cx = y0 * z - z0 * y, cy = z0 * x - x0 * z, cz = x0 * y - y0 * x, m = hypot(cx, cy, cz), w = asin(m), v = m && -w / m; // area weight multiplier
        X2.add(v * cx), Y2.add(v * cy), Z2.add(v * cz), W1 += w, X1 += w * (x0 + (x0 = x)), Y1 += w * (y0 + (y0 = y)), Z1 += w * (z0 + (z0 = z)), centroidPointCartesian(x0, y0, z0);
    }
    function constant$8(x) {
        return function() {
            return x;
        };
    }
    function compose(a, b) {
        function compose(x, y) {
            return b((x = a(x, y))[0], x[1]);
        }
        return a.invert && b.invert && (compose.invert = function(x, y) {
            return (x = b.invert(x, y)) && a.invert(x[0], x[1]);
        }), compose;
    }
    function rotationIdentity(lambda, phi) {
        return [
            abs$2(lambda) > pi$3 ? lambda + Math.round(-lambda / tau$4) * tau$4 : lambda,
            phi
        ];
    }
    function rotateRadians(deltaLambda, deltaPhi, deltaGamma) {
        return (deltaLambda %= tau$4) ? deltaPhi || deltaGamma ? compose(rotationLambda(deltaLambda), rotationPhiGamma(deltaPhi, deltaGamma)) : rotationLambda(deltaLambda) : deltaPhi || deltaGamma ? rotationPhiGamma(deltaPhi, deltaGamma) : rotationIdentity;
    }
    function forwardRotationLambda(deltaLambda) {
        return function(lambda, phi) {
            return [
                (lambda += deltaLambda) > pi$3 ? lambda - tau$4 : lambda < -pi$3 ? lambda + tau$4 : lambda,
                phi
            ];
        };
    }
    function rotationLambda(deltaLambda) {
        var rotation = forwardRotationLambda(deltaLambda);
        return rotation.invert = forwardRotationLambda(-deltaLambda), rotation;
    }
    function rotationPhiGamma(deltaPhi, deltaGamma) {
        var cosDeltaPhi = cos$1(deltaPhi), sinDeltaPhi = sin$1(deltaPhi), cosDeltaGamma = cos$1(deltaGamma), sinDeltaGamma = sin$1(deltaGamma);
        function rotation(lambda, phi) {
            var cosPhi = cos$1(phi), x = cos$1(lambda) * cosPhi, y = sin$1(lambda) * cosPhi, z = sin$1(phi), k = z * cosDeltaPhi + x * sinDeltaPhi;
            return [
                atan2(y * cosDeltaGamma - k * sinDeltaGamma, x * cosDeltaPhi - z * sinDeltaPhi),
                asin(k * cosDeltaGamma + y * sinDeltaGamma)
            ];
        }
        return rotation.invert = function(lambda, phi) {
            var cosPhi = cos$1(phi), x = cos$1(lambda) * cosPhi, y = sin$1(lambda) * cosPhi, z = sin$1(phi), k = z * cosDeltaGamma - y * sinDeltaGamma;
            return [
                atan2(y * cosDeltaGamma + z * sinDeltaGamma, x * cosDeltaPhi + k * sinDeltaPhi),
                asin(k * cosDeltaPhi - x * sinDeltaPhi)
            ];
        }, rotation;
    }
    function rotation(rotate) {
        function forward(coordinates) {
            return coordinates = rotate(coordinates[0] * radians$1, coordinates[1] * radians$1), coordinates[0] *= degrees$2, coordinates[1] *= degrees$2, coordinates;
        }
        return rotate = rotateRadians(rotate[0] * radians$1, rotate[1] * radians$1, rotate.length > 2 ? rotate[2] * radians$1 : 0), forward.invert = function(coordinates) {
            return coordinates = rotate.invert(coordinates[0] * radians$1, coordinates[1] * radians$1), coordinates[0] *= degrees$2, coordinates[1] *= degrees$2, coordinates;
        }, forward;
    }
    // Generates a circle centered at [0°, 0°], with a given radius and precision.
    function circleStream(stream, radius, delta, direction, t0, t1) {
        if (delta) {
            var cosRadius = cos$1(radius), sinRadius = sin$1(radius), step = direction * delta;
            null == t0 ? (t0 = radius + direction * tau$4, t1 = radius - step / 2) : (t0 = circleRadius(cosRadius, t0), t1 = circleRadius(cosRadius, t1), (direction > 0 ? t0 < t1 : t0 > t1) && (t0 += direction * tau$4));
            for(var point, t = t0; direction > 0 ? t > t1 : t < t1; t -= step)point = spherical([
                cosRadius,
                -sinRadius * cos$1(t),
                -sinRadius * sin$1(t)
            ]), stream.point(point[0], point[1]);
        }
    }
    // Returns the signed angle of a cartesian point relative to [cosRadius, 0, 0].
    function circleRadius(cosRadius, point) {
        point = cartesian(point), point[0] -= cosRadius, cartesianNormalizeInPlace(point);
        var radius = acos(-point[1]);
        return ((0 > -point[2] ? -radius : radius) + tau$4 - 1e-6) % tau$4;
    }
    function clipBuffer() {
        var line, lines = [];
        return {
            point: function(x, y, m) {
                line.push([
                    x,
                    y,
                    m
                ]);
            },
            lineStart: function() {
                lines.push(line = []);
            },
            lineEnd: noop$2,
            rejoin: function() {
                lines.length > 1 && lines.push(lines.pop().concat(lines.shift()));
            },
            result: function() {
                var result = lines;
                return lines = [], line = null, result;
            }
        };
    }
    function pointEqual(a, b) {
        return 1e-6 > abs$2(a[0] - b[0]) && 1e-6 > abs$2(a[1] - b[1]);
    }
    function Intersection(point, points, other, entry) {
        this.x = point, this.z = points, this.o = other, this.e = entry, this.v = !1, this.n = this.p = null;
    }
    // A generalized polygon clipping algorithm: given a polygon that has been cut
    // into its visible line segments, and rejoins the segments by interpolating
    // along the clip edge.
    function clipRejoin(segments, compareIntersection, startInside, interpolate, stream) {
        var i, n, subject = [], clip = [];
        if (segments.forEach(function(segment) {
            if (!((n = segment.length - 1) <= 0)) {
                var n, x, p0 = segment[0], p1 = segment[n];
                if (pointEqual(p0, p1)) {
                    if (!p0[2] && !p1[2]) {
                        for(stream.lineStart(), i = 0; i < n; ++i)stream.point((p0 = segment[i])[0], p0[1]);
                        stream.lineEnd();
                        return;
                    }
                    // handle degenerate cases by moving the point
                    p1[0] += 0.000002;
                }
                subject.push(x = new Intersection(p0, segment, null, !0)), clip.push(x.o = new Intersection(p0, null, x, !1)), subject.push(x = new Intersection(p1, segment, null, !1)), clip.push(x.o = new Intersection(p1, null, x, !0));
            }
        }), subject.length) {
            for(clip.sort(compareIntersection), link$1(subject), link$1(clip), i = 0, n = clip.length; i < n; ++i)clip[i].e = startInside = !startInside;
            for(var points, point, start = subject[0];;){
                for(// Find first unvisited intersection.
                var current = start, isSubject = !0; current.v;)if ((current = current.n) === start) return;
                points = current.z, stream.lineStart();
                do {
                    if (current.v = current.o.v = !0, current.e) {
                        if (isSubject) for(i = 0, n = points.length; i < n; ++i)stream.point((point = points[i])[0], point[1]);
                        else interpolate(current.x, current.n.x, 1, stream);
                        current = current.n;
                    } else {
                        if (isSubject) for(i = (points = current.p.z).length - 1; i >= 0; --i)stream.point((point = points[i])[0], point[1]);
                        else interpolate(current.x, current.p.x, -1, stream);
                        current = current.p;
                    }
                    points = (current = current.o).z, isSubject = !isSubject;
                }while (!current.v)
                stream.lineEnd();
            }
        }
    }
    function link$1(array) {
        if (n = array.length) {
            for(var n, b, i = 0, a = array[0]; ++i < n;)a.n = b = array[i], b.p = a, a = b;
            a.n = b = array[0], b.p = a;
        }
    }
    function longitude(point) {
        return abs$2(point[0]) <= pi$3 ? point[0] : sign(point[0]) * ((abs$2(point[0]) + pi$3) % tau$4 - pi$3);
    }
    function polygonContains(polygon, point) {
        var lambda = longitude(point), phi = point[1], sinPhi = sin$1(phi), normal = [
            sin$1(lambda),
            -cos$1(lambda),
            0
        ], angle = 0, winding = 0, sum = new Adder();
        1 === sinPhi ? phi = halfPi$2 + 1e-6 : -1 === sinPhi && (phi = -halfPi$2 - 1e-6);
        for(var i = 0, n = polygon.length; i < n; ++i)if (m = (ring = polygon[i]).length) for(var ring, m, point0 = ring[m - 1], lambda0 = longitude(point0), phi0 = point0[1] / 2 + quarterPi, sinPhi0 = sin$1(phi0), cosPhi0 = cos$1(phi0), j = 0; j < m; ++j, lambda0 = lambda1, sinPhi0 = sinPhi1, cosPhi0 = cosPhi1, point0 = point1){
            var point1 = ring[j], lambda1 = longitude(point1), phi1 = point1[1] / 2 + quarterPi, sinPhi1 = sin$1(phi1), cosPhi1 = cos$1(phi1), delta = lambda1 - lambda0, sign = delta >= 0 ? 1 : -1, absDelta = sign * delta, antimeridian = absDelta > pi$3, k = sinPhi0 * sinPhi1;
            // Are the longitudes either side of the point’s meridian (lambda),
            // and are the latitudes smaller than the parallel (phi)?
            if (sum.add(atan2(k * sign * sin$1(absDelta), cosPhi0 * cosPhi1 + k * cos$1(absDelta))), angle += antimeridian ? delta + sign * tau$4 : delta, antimeridian ^ lambda0 >= lambda ^ lambda1 >= lambda) {
                var arc = cartesianCross(cartesian(point0), cartesian(point1));
                cartesianNormalizeInPlace(arc);
                var intersection = cartesianCross(normal, arc);
                cartesianNormalizeInPlace(intersection);
                var phiArc = (antimeridian ^ delta >= 0 ? -1 : 1) * asin(intersection[2]);
                (phi > phiArc || phi === phiArc && (arc[0] || arc[1])) && (winding += antimeridian ^ delta >= 0 ? 1 : -1);
            }
        }
        // First, determine whether the South pole is inside or outside:
        //
        // It is inside if:
        // * the polygon winds around it in a clockwise direction.
        // * the polygon does not (cumulatively) wind around it, but has a negative
        //   (counter-clockwise) area.
        //
        // Second, count the (signed) number of times a segment crosses a lambda
        // from the point to the South pole.  If it is zero, then the point is the
        // same side as the South pole.
        return (angle < -0.000001 || angle < 1e-6 && sum < -0.000000000001) ^ 1 & winding;
    }
    function clip(pointVisible, clipLine, interpolate, start) {
        return function(sink) {
            var polygon, segments, ring, line = clipLine(sink), ringBuffer = clipBuffer(), ringSink = clipLine(ringBuffer), polygonStarted = !1, clip = {
                point: point,
                lineStart: lineStart,
                lineEnd: lineEnd,
                polygonStart: function() {
                    clip.point = pointRing, clip.lineStart = ringStart, clip.lineEnd = ringEnd, segments = [], polygon = [];
                },
                polygonEnd: function() {
                    clip.point = point, clip.lineStart = lineStart, clip.lineEnd = lineEnd, segments = merge(segments);
                    var startInside = polygonContains(polygon, start);
                    segments.length ? (polygonStarted || (sink.polygonStart(), polygonStarted = !0), clipRejoin(segments, compareIntersection, startInside, interpolate, sink)) : startInside && (polygonStarted || (sink.polygonStart(), polygonStarted = !0), sink.lineStart(), interpolate(null, null, 1, sink), sink.lineEnd()), polygonStarted && (sink.polygonEnd(), polygonStarted = !1), segments = polygon = null;
                },
                sphere: function() {
                    sink.polygonStart(), sink.lineStart(), interpolate(null, null, 1, sink), sink.lineEnd(), sink.polygonEnd();
                }
            };
            function point(lambda, phi) {
                pointVisible(lambda, phi) && sink.point(lambda, phi);
            }
            function pointLine(lambda, phi) {
                line.point(lambda, phi);
            }
            function lineStart() {
                clip.point = pointLine, line.lineStart();
            }
            function lineEnd() {
                clip.point = point, line.lineEnd();
            }
            function pointRing(lambda, phi) {
                ring.push([
                    lambda,
                    phi
                ]), ringSink.point(lambda, phi);
            }
            function ringStart() {
                ringSink.lineStart(), ring = [];
            }
            function ringEnd() {
                pointRing(ring[0][0], ring[0][1]), ringSink.lineEnd();
                var i, m, segment, point, clean = ringSink.clean(), ringSegments = ringBuffer.result(), n = ringSegments.length;
                if (ring.pop(), polygon.push(ring), ring = null, n) {
                    // No intersections.
                    if (1 & clean) {
                        if ((m = (segment = ringSegments[0]).length - 1) > 0) {
                            for(polygonStarted || (sink.polygonStart(), polygonStarted = !0), sink.lineStart(), i = 0; i < m; ++i)sink.point((point = segment[i])[0], point[1]);
                            sink.lineEnd();
                        }
                        return;
                    }
                    n > 1 && 2 & clean && ringSegments.push(ringSegments.pop().concat(ringSegments.shift())), segments.push(ringSegments.filter(validSegment));
                }
            }
            return clip;
        };
    }
    function validSegment(segment) {
        return segment.length > 1;
    }
    // Intersections are sorted along the clip edge. For both antimeridian cutting
    // and circle clipping, the same comparison is used.
    function compareIntersection(a, b) {
        return ((a = a.x)[0] < 0 ? a[1] - halfPi$2 - 1e-6 : halfPi$2 - a[1]) - ((b = b.x)[0] < 0 ? b[1] - halfPi$2 - 1e-6 : halfPi$2 - b[1]);
    }
    rotationIdentity.invert = rotationIdentity;
    var clipAntimeridian = clip(function() {
        return !0;
    }, // Takes a line and cuts into visible segments. Return values: 0 - there were
    // intersections or the line was empty; 1 - no intersections; 2 - there were
    // intersections, and the first and last segments should be rejoined.
    function(stream) {
        var clean, lambda0 = NaN, phi0 = NaN, sign0 = NaN; // no intersections
        return {
            lineStart: function() {
                stream.lineStart(), clean = 1;
            },
            point: function(lambda1, phi1) {
                var lambda01, phi01, lambda11, cosPhi0, cosPhi1, sinLambda0Lambda1, sign1 = lambda1 > 0 ? pi$3 : -pi$3, delta = abs$2(lambda1 - lambda0);
                1e-6 > abs$2(delta - pi$3) ? (stream.point(lambda0, phi0 = (phi0 + phi1) / 2 > 0 ? halfPi$2 : -halfPi$2), stream.point(sign0, phi0), stream.lineEnd(), stream.lineStart(), stream.point(sign1, phi0), stream.point(lambda1, phi0), clean = 0) : sign0 !== sign1 && delta >= pi$3 && (1e-6 > abs$2(lambda0 - sign0) && (lambda0 -= 1e-6 * sign0), 1e-6 > abs$2(lambda1 - sign1) && (lambda1 -= 1e-6 * sign1), lambda01 = lambda0, phi01 = phi0, phi0 = abs$2(sinLambda0Lambda1 = sin$1(lambda01 - (lambda11 = lambda1))) > 1e-6 ? atan((sin$1(phi01) * (cosPhi1 = cos$1(phi1)) * sin$1(lambda11) - sin$1(phi1) * (cosPhi0 = cos$1(phi01)) * sin$1(lambda01)) / (cosPhi0 * cosPhi1 * sinLambda0Lambda1)) : (phi01 + phi1) / 2, stream.point(sign0, phi0), stream.lineEnd(), stream.lineStart(), stream.point(sign1, phi0), clean = 0), stream.point(lambda0 = lambda1, phi0 = phi1), sign0 = sign1;
            },
            lineEnd: function() {
                stream.lineEnd(), lambda0 = phi0 = NaN;
            },
            clean: function() {
                return 2 - clean; // if intersections, rejoin first and last segments
            }
        };
    }, function(from, to, direction, stream) {
        var phi;
        if (null == from) phi = direction * halfPi$2, stream.point(-pi$3, phi), stream.point(0, phi), stream.point(pi$3, phi), stream.point(pi$3, 0), stream.point(pi$3, -phi), stream.point(0, -phi), stream.point(-pi$3, -phi), stream.point(-pi$3, 0), stream.point(-pi$3, phi);
        else if (abs$2(from[0] - to[0]) > 1e-6) {
            var lambda = from[0] < to[0] ? pi$3 : -pi$3;
            phi = direction * lambda / 2, stream.point(-lambda, phi), stream.point(0, phi), stream.point(lambda, phi);
        } else stream.point(to[0], to[1]);
    }, [
        -pi$3,
        -halfPi$2
    ]);
    function clipCircle(radius) {
        var cr = cos$1(radius), delta = 6 * radians$1, smallRadius = cr > 0, notHemisphere = abs$2(cr) > 1e-6; // TODO optimise for this common case
        function visible(lambda, phi) {
            return cos$1(lambda) * cos$1(phi) > cr;
        }
        // Intersects the great circle between a and b with the clip circle.
        function intersect(a, b, two) {
            var pa = cartesian(a), pb = cartesian(b), n1 = [
                1,
                0,
                0
            ], n2 = cartesianCross(pa, pb), n2n2 = cartesianDot(n2, n2), n1n2 = n2[0], determinant = n2n2 - n1n2 * n1n2;
            // Two polar points.
            if (!determinant) return !two && a;
            var n1xn2 = cartesianCross(n1, n2), A = cartesianScale(n1, cr * n2n2 / determinant);
            cartesianAddInPlace(A, cartesianScale(n2, -cr * n1n2 / determinant));
            // Solve |p(t)|^2 = 1.
            var w = cartesianDot(A, n1xn2), uu = cartesianDot(n1xn2, n1xn2), t2 = w * w - uu * (cartesianDot(A, A) - 1);
            if (!(t2 < 0)) {
                var t = sqrt(t2), q = cartesianScale(n1xn2, (-w - t) / uu);
                if (cartesianAddInPlace(q, A), q = spherical(q), !two) return q;
                // Two intersection points.
                var z, lambda0 = a[0], lambda1 = b[0], phi0 = a[1], phi1 = b[1];
                lambda1 < lambda0 && (z = lambda0, lambda0 = lambda1, lambda1 = z);
                var delta = lambda1 - lambda0, polar = 1e-6 > abs$2(delta - pi$3);
                // Check that the first point is between a and b.
                if (!polar && phi1 < phi0 && (z = phi0, phi0 = phi1, phi1 = z), polar || delta < 1e-6 ? polar ? phi0 + phi1 > 0 ^ q[1] < (1e-6 > abs$2(q[0] - lambda0) ? phi0 : phi1) : phi0 <= q[1] && q[1] <= phi1 : delta > pi$3 ^ (lambda0 <= q[0] && q[0] <= lambda1)) {
                    var q1 = cartesianScale(n1xn2, (-w + t) / uu);
                    return cartesianAddInPlace(q1, A), [
                        q,
                        spherical(q1)
                    ];
                }
            }
        }
        // Generates a 4-bit vector representing the location of a point relative to
        // the small circle's bounding box.
        function code(lambda, phi) {
            var r = smallRadius ? radius : pi$3 - radius, code = 0;
            return lambda < -r ? code |= 1 : lambda > r && (code |= 2), phi < -r ? code |= 4 : phi > r && (code |= 8), code;
        }
        return clip(visible, // Takes a line and cuts into visible segments. Return values used for polygon
        // clipping: 0 - there were intersections or the line was empty; 1 - no
        // intersections 2 - there were intersections, and the first and last segments
        // should be rejoined.
        function(stream) {
            var point0, c0, v0, v00, clean; // no intersections
            return {
                lineStart: function() {
                    v00 = v0 = !1, clean = 1;
                },
                point: function(lambda, phi) {
                    var t, point2, point1 = [
                        lambda,
                        phi
                    ], v = visible(lambda, phi), c = smallRadius ? v ? 0 : code(lambda, phi) : v ? code(lambda + (lambda < 0 ? pi$3 : -pi$3), phi) : 0;
                    !point0 && (v00 = v0 = v) && stream.lineStart(), v !== v0 && (!(point2 = intersect(point0, point1)) || pointEqual(point0, point2) || pointEqual(point1, point2)) && (point1[2] = 1), v !== v0 ? (clean = 0, v ? (// outside going in
                    stream.lineStart(), point2 = intersect(point1, point0), stream.point(point2[0], point2[1])) : (// inside going out
                    point2 = intersect(point0, point1), stream.point(point2[0], point2[1], 2), stream.lineEnd()), point0 = point2) : notHemisphere && point0 && smallRadius ^ v && !(c & c0) && (t = intersect(point1, point0, !0)) && (clean = 0, smallRadius ? (stream.lineStart(), stream.point(t[0][0], t[0][1]), stream.point(t[1][0], t[1][1]), stream.lineEnd()) : (stream.point(t[1][0], t[1][1]), stream.lineEnd(), stream.lineStart(), stream.point(t[0][0], t[0][1], 3))), !v || point0 && pointEqual(point0, point1) || stream.point(point1[0], point1[1]), point0 = point1, v0 = v, c0 = c;
                },
                lineEnd: function() {
                    v0 && stream.lineEnd(), point0 = null;
                },
                // Rejoin first and last segments if there were intersections and the first
                // and last points were visible.
                clean: function() {
                    return clean | (v00 && v0) << 1;
                }
            };
        }, function(from, to, direction, stream) {
            circleStream(stream, radius, delta, direction, from, to);
        }, smallRadius ? [
            0,
            -radius
        ] : [
            -pi$3,
            radius - pi$3
        ]);
    }
    // TODO Use d3-polygon’s polygonContains here for the ring check?
    // TODO Eliminate duplicate buffering in clipBuffer and polygon.push?
    function clipRectangle(x0, y0, x1, y1) {
        function visible(x, y) {
            return x0 <= x && x <= x1 && y0 <= y && y <= y1;
        }
        function interpolate(from, to, direction, stream) {
            var a = 0, a1 = 0;
            if (null == from || (a = corner(from, direction)) !== (a1 = corner(to, direction)) || 0 > comparePoint(from, to) ^ direction > 0) do stream.point(0 === a || 3 === a ? x0 : x1, a > 1 ? y1 : y0);
            while ((a = (a + direction + 4) % 4) !== a1)
            else stream.point(to[0], to[1]);
        }
        function corner(p, direction) {
            return 1e-6 > abs$2(p[0] - x0) ? direction > 0 ? 0 : 3 : 1e-6 > abs$2(p[0] - x1) ? direction > 0 ? 2 : 1 : 1e-6 > abs$2(p[1] - y0) ? direction > 0 ? 1 : 0 : direction > 0 ? 3 : 2; // abs(p[1] - y1) < epsilon
        }
        function compareIntersection(a, b) {
            return comparePoint(a.x, b.x);
        }
        function comparePoint(a, b) {
            var ca = corner(a, 1), cb = corner(b, 1);
            return ca !== cb ? ca - cb : 0 === ca ? b[1] - a[1] : 1 === ca ? a[0] - b[0] : 2 === ca ? a[1] - b[1] : b[0] - a[0];
        }
        return function(stream) {
            var segments, polygon, ring, x__, y__, v__, x_, y_, v_, first, clean, activeStream = stream, bufferStream = clipBuffer(), clipStream = {
                point: point,
                lineStart: function() {
                    clipStream.point = linePoint, polygon && polygon.push(ring = []), first = !0, v_ = !1, x_ = y_ = NaN;
                },
                lineEnd: // TODO rather than special-case polygons, simply handle them separately.
                // Ideally, coincident intersection points should be jittered to avoid
                // clipping issues.
                function() {
                    segments && (linePoint(x__, y__), v__ && v_ && bufferStream.rejoin(), segments.push(bufferStream.result())), clipStream.point = point, v_ && activeStream.lineEnd();
                },
                polygonStart: // Buffer geometry within a polygon and then clip it en masse.
                function() {
                    activeStream = bufferStream, segments = [], polygon = [], clean = !0;
                },
                polygonEnd: function() {
                    var startInside = function() {
                        for(var winding = 0, i = 0, n = polygon.length; i < n; ++i)for(var a0, a1, ring = polygon[i], j = 1, m = ring.length, point = ring[0], b0 = point[0], b1 = point[1]; j < m; ++j)a0 = b0, a1 = b1, b0 = (point = ring[j])[0], b1 = point[1], a1 <= y1 ? b1 > y1 && (b0 - a0) * (y1 - a1) > (b1 - a1) * (x0 - a0) && ++winding : b1 <= y1 && (b0 - a0) * (y1 - a1) < (b1 - a1) * (x0 - a0) && --winding;
                        return winding;
                    }(), cleanInside = clean && startInside, visible = (segments = merge(segments)).length;
                    (cleanInside || visible) && (stream.polygonStart(), cleanInside && (stream.lineStart(), interpolate(null, null, 1, stream), stream.lineEnd()), visible && clipRejoin(segments, compareIntersection, startInside, interpolate, stream), stream.polygonEnd()), activeStream = stream, segments = polygon = ring = null;
                }
            };
            function point(x, y) {
                visible(x, y) && activeStream.point(x, y);
            }
            function linePoint(x, y) {
                var v = visible(x, y);
                if (polygon && ring.push([
                    x,
                    y
                ]), first) x__ = x, y__ = y, v__ = v, first = !1, v && (activeStream.lineStart(), activeStream.point(x, y));
                else if (v && v_) activeStream.point(x, y);
                else {
                    var a = [
                        x_ = Math.max(-1000000000, Math.min(1e9, x_)),
                        y_ = Math.max(-1000000000, Math.min(1e9, y_))
                    ], b = [
                        x = Math.max(-1000000000, Math.min(1e9, x)),
                        y = Math.max(-1000000000, Math.min(1e9, y))
                    ];
                    !function(a, b, x0, y0, x1, y1) {
                        var r, ax = a[0], ay = a[1], bx = b[0], by = b[1], t0 = 0, t1 = 1, dx = bx - ax, dy = by - ay;
                        if (r = x0 - ax, dx || !(r > 0)) {
                            if (r /= dx, dx < 0) {
                                if (r < t0) return;
                                r < t1 && (t1 = r);
                            } else if (dx > 0) {
                                if (r > t1) return;
                                r > t0 && (t0 = r);
                            }
                            if (r = x1 - ax, dx || !(r < 0)) {
                                if (r /= dx, dx < 0) {
                                    if (r > t1) return;
                                    r > t0 && (t0 = r);
                                } else if (dx > 0) {
                                    if (r < t0) return;
                                    r < t1 && (t1 = r);
                                }
                                if (r = y0 - ay, dy || !(r > 0)) {
                                    if (r /= dy, dy < 0) {
                                        if (r < t0) return;
                                        r < t1 && (t1 = r);
                                    } else if (dy > 0) {
                                        if (r > t1) return;
                                        r > t0 && (t0 = r);
                                    }
                                    if (r = y1 - ay, dy || !(r < 0)) {
                                        if (r /= dy, dy < 0) {
                                            if (r > t1) return;
                                            r > t0 && (t0 = r);
                                        } else if (dy > 0) {
                                            if (r < t0) return;
                                            r < t1 && (t1 = r);
                                        }
                                        return t0 > 0 && (a[0] = ax + t0 * dx, a[1] = ay + t0 * dy), t1 < 1 && (b[0] = ax + t1 * dx, b[1] = ay + t1 * dy), !0;
                                    }
                                }
                            }
                        }
                    }(a, b, x0, y0, x1, y1) ? v && (activeStream.lineStart(), activeStream.point(x, y), clean = !1) : (v_ || (activeStream.lineStart(), activeStream.point(a[0], a[1])), activeStream.point(b[0], b[1]), v || activeStream.lineEnd(), clean = !1);
                }
                x_ = x, y_ = y, v_ = v;
            }
            return clipStream;
        };
    }
    var lengthStream = {
        sphere: noop$2,
        point: noop$2,
        lineStart: function() {
            lengthStream.point = lengthPointFirst, lengthStream.lineEnd = lengthLineEnd;
        },
        lineEnd: noop$2,
        polygonStart: noop$2,
        polygonEnd: noop$2
    };
    function lengthLineEnd() {
        lengthStream.point = lengthStream.lineEnd = noop$2;
    }
    function lengthPointFirst(lambda, phi) {
        lambda *= radians$1, phi *= radians$1, lambda0$2 = lambda, sinPhi0$1 = sin$1(phi), cosPhi0$1 = cos$1(phi), lengthStream.point = lengthPoint;
    }
    function lengthPoint(lambda, phi) {
        lambda *= radians$1;
        var sinPhi = sin$1(phi *= radians$1), cosPhi = cos$1(phi), delta = abs$2(lambda - lambda0$2), cosDelta = cos$1(delta), x = cosPhi * sin$1(delta), y = cosPhi0$1 * sinPhi - sinPhi0$1 * cosPhi * cosDelta, z = sinPhi0$1 * sinPhi + cosPhi0$1 * cosPhi * cosDelta;
        lengthSum.add(atan2(sqrt(x * x + y * y), z)), lambda0$2 = lambda, sinPhi0$1 = sinPhi, cosPhi0$1 = cosPhi;
    }
    function length$2(object) {
        return lengthSum = new Adder(), geoStream(object, lengthStream), +lengthSum;
    }
    var coordinates = [
        null,
        null
    ], object$1 = {
        type: "LineString",
        coordinates: coordinates
    };
    function distance(a, b) {
        return coordinates[0] = a, coordinates[1] = b, length$2(object$1);
    }
    var containsObjectType = {
        Feature: function(object, point) {
            return containsGeometry(object.geometry, point);
        },
        FeatureCollection: function(object, point) {
            for(var features = object.features, i = -1, n = features.length; ++i < n;)if (containsGeometry(features[i].geometry, point)) return !0;
            return !1;
        }
    }, containsGeometryType = {
        Sphere: function() {
            return !0;
        },
        Point: function(object, point) {
            return 0 === distance(object.coordinates, point);
        },
        MultiPoint: function(object, point) {
            for(var coordinates = object.coordinates, i = -1, n = coordinates.length; ++i < n;)if (0 === distance(coordinates[i], point)) return !0;
            return !1;
        },
        LineString: function(object, point) {
            return containsLine(object.coordinates, point);
        },
        MultiLineString: function(object, point) {
            for(var coordinates = object.coordinates, i = -1, n = coordinates.length; ++i < n;)if (containsLine(coordinates[i], point)) return !0;
            return !1;
        },
        Polygon: function(object, point) {
            return containsPolygon(object.coordinates, point);
        },
        MultiPolygon: function(object, point) {
            for(var coordinates = object.coordinates, i = -1, n = coordinates.length; ++i < n;)if (containsPolygon(coordinates[i], point)) return !0;
            return !1;
        },
        GeometryCollection: function(object, point) {
            for(var geometries = object.geometries, i = -1, n = geometries.length; ++i < n;)if (containsGeometry(geometries[i], point)) return !0;
            return !1;
        }
    };
    function containsGeometry(geometry, point) {
        return !!(geometry && containsGeometryType.hasOwnProperty(geometry.type)) && containsGeometryType[geometry.type](geometry, point);
    }
    function containsLine(coordinates, point) {
        for(var ao, bo, ab, i = 0, n = coordinates.length; i < n; i++){
            if (0 === (bo = distance(coordinates[i], point)) || i > 0 && (ab = distance(coordinates[i], coordinates[i - 1])) > 0 && ao <= ab && bo <= ab && (ao + bo - ab) * (1 - Math.pow((ao - bo) / ab, 2)) < 1e-12 * ab) return !0;
            ao = bo;
        }
        return !1;
    }
    function containsPolygon(coordinates, point) {
        return !!polygonContains(coordinates.map(ringRadians), pointRadians(point));
    }
    function ringRadians(ring) {
        return (ring = ring.map(pointRadians)).pop(), ring;
    }
    function pointRadians(point) {
        return [
            point[0] * radians$1,
            point[1] * radians$1
        ];
    }
    function graticuleX(y0, y1, dy) {
        var y = sequence(y0, y1 - 1e-6, dy).concat(y1);
        return function(x) {
            return y.map(function(y) {
                return [
                    x,
                    y
                ];
            });
        };
    }
    function graticuleY(x0, x1, dx) {
        var x = sequence(x0, x1 - 1e-6, dx).concat(x1);
        return function(y) {
            return x.map(function(x) {
                return [
                    x,
                    y
                ];
            });
        };
    }
    function graticule() {
        var x1, x0, X1, X0, y1, y0, Y1, Y0, x, y, X, Y, dx = 10, dy = 10, DX = 90, DY = 360, precision = 2.5;
        function graticule() {
            return {
                type: "MultiLineString",
                coordinates: lines()
            };
        }
        function lines() {
            return sequence(ceil(X0 / DX) * DX, X1, DX).map(X).concat(sequence(ceil(Y0 / DY) * DY, Y1, DY).map(Y)).concat(sequence(ceil(x0 / dx) * dx, x1, dx).filter(function(x) {
                return abs$2(x % DX) > 1e-6;
            }).map(x)).concat(sequence(ceil(y0 / dy) * dy, y1, dy).filter(function(y) {
                return abs$2(y % DY) > 1e-6;
            }).map(y));
        }
        return graticule.lines = function() {
            return lines().map(function(coordinates) {
                return {
                    type: "LineString",
                    coordinates: coordinates
                };
            });
        }, graticule.outline = function() {
            return {
                type: "Polygon",
                coordinates: [
                    X(X0).concat(Y(Y1).slice(1), X(X1).reverse().slice(1), Y(Y0).reverse().slice(1))
                ]
            };
        }, graticule.extent = function(_) {
            return arguments.length ? graticule.extentMajor(_).extentMinor(_) : graticule.extentMinor();
        }, graticule.extentMajor = function(_) {
            return arguments.length ? (X0 = +_[0][0], X1 = +_[1][0], Y0 = +_[0][1], Y1 = +_[1][1], X0 > X1 && (_ = X0, X0 = X1, X1 = _), Y0 > Y1 && (_ = Y0, Y0 = Y1, Y1 = _), graticule.precision(precision)) : [
                [
                    X0,
                    Y0
                ],
                [
                    X1,
                    Y1
                ]
            ];
        }, graticule.extentMinor = function(_) {
            return arguments.length ? (x0 = +_[0][0], x1 = +_[1][0], y0 = +_[0][1], y1 = +_[1][1], x0 > x1 && (_ = x0, x0 = x1, x1 = _), y0 > y1 && (_ = y0, y0 = y1, y1 = _), graticule.precision(precision)) : [
                [
                    x0,
                    y0
                ],
                [
                    x1,
                    y1
                ]
            ];
        }, graticule.step = function(_) {
            return arguments.length ? graticule.stepMajor(_).stepMinor(_) : graticule.stepMinor();
        }, graticule.stepMajor = function(_) {
            return arguments.length ? (DX = +_[0], DY = +_[1], graticule) : [
                DX,
                DY
            ];
        }, graticule.stepMinor = function(_) {
            return arguments.length ? (dx = +_[0], dy = +_[1], graticule) : [
                dx,
                dy
            ];
        }, graticule.precision = function(_) {
            return arguments.length ? (precision = +_, x = graticuleX(y0, y1, 90), y = graticuleY(x0, x1, precision), X = graticuleX(Y0, Y1, 90), Y = graticuleY(X0, X1, precision), graticule) : precision;
        }, graticule.extentMajor([
            [
                -180,
                -89.999999
            ],
            [
                180,
                89.999999
            ]
        ]).extentMinor([
            [
                -180,
                -80.000001
            ],
            [
                180,
                80.000001
            ]
        ]);
    }
    var lambda0$1, phi0, lambda1, phi1, lambda2, lambda00$1, phi00$1, p0, deltaSum, ranges, range$1, W0, W1, X0, Y0, Z0, X1, Y1, Z1, X2, Y2, Z2, lambda00$2, phi00$2, x0, y0, z0, lengthSum, lambda0$2, sinPhi0$1, cosPhi0$1, x00, y00, x0$1, y0$1, identity$4 = (x)=>x, areaSum$1 = new Adder(), areaRingSum$1 = new Adder(), areaStream$1 = {
        point: noop$2,
        lineStart: noop$2,
        lineEnd: noop$2,
        polygonStart: function() {
            areaStream$1.lineStart = areaRingStart$1, areaStream$1.lineEnd = areaRingEnd$1;
        },
        polygonEnd: function() {
            areaStream$1.lineStart = areaStream$1.lineEnd = areaStream$1.point = noop$2, areaSum$1.add(abs$2(areaRingSum$1)), areaRingSum$1 = new Adder();
        },
        result: function() {
            var area = areaSum$1 / 2;
            return areaSum$1 = new Adder(), area;
        }
    };
    function areaRingStart$1() {
        areaStream$1.point = areaPointFirst$1;
    }
    function areaPointFirst$1(x, y) {
        areaStream$1.point = areaPoint$1, x00 = x0$1 = x, y00 = y0$1 = y;
    }
    function areaPoint$1(x, y) {
        areaRingSum$1.add(y0$1 * x - x0$1 * y), x0$1 = x, y0$1 = y;
    }
    function areaRingEnd$1() {
        areaPoint$1(x00, y00);
    }
    var x00$1, y00$1, x0$3, y0$3, x0$2 = 1 / 0, y0$2 = 1 / 0, x1 = -1 / 0, y1 = x1, boundsStream$1 = {
        point: function(x, y) {
            x < x0$2 && (x0$2 = x), x > x1 && (x1 = x), y < y0$2 && (y0$2 = y), y > y1 && (y1 = y);
        },
        lineStart: noop$2,
        lineEnd: noop$2,
        polygonStart: noop$2,
        polygonEnd: noop$2,
        result: function() {
            var bounds = [
                [
                    x0$2,
                    y0$2
                ],
                [
                    x1,
                    y1
                ]
            ];
            return x1 = y1 = -(y0$2 = x0$2 = 1 / 0), bounds;
        }
    }, X0$1 = 0, Y0$1 = 0, Z0$1 = 0, X1$1 = 0, Y1$1 = 0, Z1$1 = 0, X2$1 = 0, Y2$1 = 0, Z2$1 = 0, centroidStream$1 = {
        point: centroidPoint$1,
        lineStart: centroidLineStart$1,
        lineEnd: centroidLineEnd$1,
        polygonStart: function() {
            centroidStream$1.lineStart = centroidRingStart$1, centroidStream$1.lineEnd = centroidRingEnd$1;
        },
        polygonEnd: function() {
            centroidStream$1.point = centroidPoint$1, centroidStream$1.lineStart = centroidLineStart$1, centroidStream$1.lineEnd = centroidLineEnd$1;
        },
        result: function() {
            var centroid = Z2$1 ? [
                X2$1 / Z2$1,
                Y2$1 / Z2$1
            ] : Z1$1 ? [
                X1$1 / Z1$1,
                Y1$1 / Z1$1
            ] : Z0$1 ? [
                X0$1 / Z0$1,
                Y0$1 / Z0$1
            ] : [
                NaN,
                NaN
            ];
            return X0$1 = Y0$1 = Z0$1 = X1$1 = Y1$1 = Z1$1 = X2$1 = Y2$1 = Z2$1 = 0, centroid;
        }
    };
    function centroidPoint$1(x, y) {
        X0$1 += x, Y0$1 += y, ++Z0$1;
    }
    function centroidLineStart$1() {
        centroidStream$1.point = centroidPointFirstLine;
    }
    function centroidPointFirstLine(x, y) {
        centroidStream$1.point = centroidPointLine, centroidPoint$1(x0$3 = x, y0$3 = y);
    }
    function centroidPointLine(x, y) {
        var dx = x - x0$3, dy = y - y0$3, z = sqrt(dx * dx + dy * dy);
        X1$1 += z * (x0$3 + x) / 2, Y1$1 += z * (y0$3 + y) / 2, Z1$1 += z, centroidPoint$1(x0$3 = x, y0$3 = y);
    }
    function centroidLineEnd$1() {
        centroidStream$1.point = centroidPoint$1;
    }
    function centroidRingStart$1() {
        centroidStream$1.point = centroidPointFirstRing;
    }
    function centroidRingEnd$1() {
        centroidPointRing(x00$1, y00$1);
    }
    function centroidPointFirstRing(x, y) {
        centroidStream$1.point = centroidPointRing, centroidPoint$1(x00$1 = x0$3 = x, y00$1 = y0$3 = y);
    }
    function centroidPointRing(x, y) {
        var dx = x - x0$3, dy = y - y0$3, z = sqrt(dx * dx + dy * dy);
        X1$1 += z * (x0$3 + x) / 2, Y1$1 += z * (y0$3 + y) / 2, Z1$1 += z, X2$1 += (z = y0$3 * x - x0$3 * y) * (x0$3 + x), Y2$1 += z * (y0$3 + y), Z2$1 += 3 * z, centroidPoint$1(x0$3 = x, y0$3 = y);
    }
    function PathContext(context) {
        this._context = context;
    }
    PathContext.prototype = {
        _radius: 4.5,
        pointRadius: function(_) {
            return this._radius = _, this;
        },
        polygonStart: function() {
            this._line = 0;
        },
        polygonEnd: function() {
            this._line = NaN;
        },
        lineStart: function() {
            this._point = 0;
        },
        lineEnd: function() {
            0 === this._line && this._context.closePath(), this._point = NaN;
        },
        point: function(x, y) {
            switch(this._point){
                case 0:
                    this._context.moveTo(x, y), this._point = 1;
                    break;
                case 1:
                    this._context.lineTo(x, y);
                    break;
                default:
                    this._context.moveTo(x + this._radius, y), this._context.arc(x, y, this._radius, 0, tau$4);
            }
        },
        result: noop$2
    };
    var lengthRing, x00$2, y00$2, x0$4, y0$4, lengthSum$1 = new Adder(), lengthStream$1 = {
        point: noop$2,
        lineStart: function() {
            lengthStream$1.point = lengthPointFirst$1;
        },
        lineEnd: function() {
            lengthRing && lengthPoint$1(x00$2, y00$2), lengthStream$1.point = noop$2;
        },
        polygonStart: function() {
            lengthRing = !0;
        },
        polygonEnd: function() {
            lengthRing = null;
        },
        result: function() {
            var length = +lengthSum$1;
            return lengthSum$1 = new Adder(), length;
        }
    };
    function lengthPointFirst$1(x, y) {
        lengthStream$1.point = lengthPoint$1, x00$2 = x0$4 = x, y00$2 = y0$4 = y;
    }
    function lengthPoint$1(x, y) {
        x0$4 -= x, y0$4 -= y, lengthSum$1.add(sqrt(x0$4 * x0$4 + y0$4 * y0$4)), x0$4 = x, y0$4 = y;
    }
    function PathString() {
        this._string = [];
    }
    function circle$1(radius) {
        return "m0," + radius + "a" + radius + "," + radius + " 0 1,1 0," + -2 * radius + "a" + radius + "," + radius + " 0 1,1 0," + 2 * radius + "z";
    }
    function transformer(methods) {
        return function(stream) {
            var s = new TransformStream;
            for(var key in methods)s[key] = methods[key];
            return s.stream = stream, s;
        };
    }
    function TransformStream() {}
    function fit(projection, fitBounds, object) {
        var clip = projection.clipExtent && projection.clipExtent();
        return projection.scale(150).translate([
            0,
            0
        ]), null != clip && projection.clipExtent(null), geoStream(object, projection.stream(boundsStream$1)), fitBounds(boundsStream$1.result()), null != clip && projection.clipExtent(clip), projection;
    }
    function fitExtent(projection, extent, object) {
        return fit(projection, function(b) {
            var w = extent[1][0] - extent[0][0], h = extent[1][1] - extent[0][1], k = Math.min(w / (b[1][0] - b[0][0]), h / (b[1][1] - b[0][1])), x = +extent[0][0] + (w - k * (b[1][0] + b[0][0])) / 2, y = +extent[0][1] + (h - k * (b[1][1] + b[0][1])) / 2;
            projection.scale(150 * k).translate([
                x,
                y
            ]);
        }, object);
    }
    function fitSize(projection, size, object) {
        return fitExtent(projection, [
            [
                0,
                0
            ],
            size
        ], object);
    }
    function fitWidth(projection, width, object) {
        return fit(projection, function(b) {
            var w = +width, k = w / (b[1][0] - b[0][0]), x = (w - k * (b[1][0] + b[0][0])) / 2, y = -k * b[0][1];
            projection.scale(150 * k).translate([
                x,
                y
            ]);
        }, object);
    }
    function fitHeight(projection, height, object) {
        return fit(projection, function(b) {
            var h = +height, k = h / (b[1][1] - b[0][1]), x = -k * b[0][0], y = (h - k * (b[1][1] + b[0][1])) / 2;
            projection.scale(150 * k).translate([
                x,
                y
            ]);
        }, object);
    }
    PathString.prototype = {
        _radius: 4.5,
        _circle: circle$1(4.5),
        pointRadius: function(_) {
            return (_ = +_) !== this._radius && (this._radius = _, this._circle = null), this;
        },
        polygonStart: function() {
            this._line = 0;
        },
        polygonEnd: function() {
            this._line = NaN;
        },
        lineStart: function() {
            this._point = 0;
        },
        lineEnd: function() {
            0 === this._line && this._string.push("Z"), this._point = NaN;
        },
        point: function(x, y) {
            switch(this._point){
                case 0:
                    this._string.push("M", x, ",", y), this._point = 1;
                    break;
                case 1:
                    this._string.push("L", x, ",", y);
                    break;
                default:
                    null == this._circle && (this._circle = circle$1(this._radius)), this._string.push("M", x, ",", y, this._circle);
            }
        },
        result: function() {
            if (!this._string.length) return null;
            var result = this._string.join("");
            return this._string = [], result;
        }
    }, TransformStream.prototype = {
        constructor: TransformStream,
        point: function(x, y) {
            this.stream.point(x, y);
        },
        sphere: function() {
            this.stream.sphere();
        },
        lineStart: function() {
            this.stream.lineStart();
        },
        lineEnd: function() {
            this.stream.lineEnd();
        },
        polygonStart: function() {
            this.stream.polygonStart();
        },
        polygonEnd: function() {
            this.stream.polygonEnd();
        }
    };
    var cosMinDistance = cos$1(30 * radians$1); // cos(minimum angular distance)
    function resample(project, delta2) {
        return +delta2 ? function(project, delta2) {
            function resampleLineTo(x0, y0, lambda0, a0, b0, c0, x1, y1, lambda1, a1, b1, c1, depth, stream) {
                var dx = x1 - x0, dy = y1 - y0, d2 = dx * dx + dy * dy;
                if (d2 > 4 * delta2 && depth--) {
                    var a = a0 + a1, b = b0 + b1, c = c0 + c1, m = sqrt(a * a + b * b + c * c), phi2 = asin(c /= m), lambda2 = 1e-6 > abs$2(abs$2(c) - 1) || 1e-6 > abs$2(lambda0 - lambda1) ? (lambda0 + lambda1) / 2 : atan2(b, a), p = project(lambda2, phi2), x2 = p[0], y2 = p[1], dx2 = x2 - x0, dy2 = y2 - y0, dz = dy * dx2 - dx * dy2;
                    (dz * dz / d2 > delta2 // perpendicular projected distance
                     || abs$2((dx * dx2 + dy * dy2) / d2 - 0.5) > 0.3 // midpoint close to an end
                     || a0 * a1 + b0 * b1 + c0 * c1 < cosMinDistance) && (resampleLineTo(x0, y0, lambda0, a0, b0, c0, x2, y2, lambda2, a /= m, b /= m, c, depth, stream), stream.point(x2, y2), resampleLineTo(x2, y2, lambda2, a, b, c, x1, y1, lambda1, a1, b1, c1, depth, stream));
                }
            }
            return function(stream) {
                var lambda00, x00, y00, a00, b00, c00, lambda0, x0, y0, a0, b0, c0, resampleStream = {
                    point: point,
                    lineStart: lineStart,
                    lineEnd: lineEnd,
                    polygonStart: function() {
                        stream.polygonStart(), resampleStream.lineStart = ringStart;
                    },
                    polygonEnd: function() {
                        stream.polygonEnd(), resampleStream.lineStart = lineStart;
                    }
                };
                function point(x, y) {
                    x = project(x, y), stream.point(x[0], x[1]);
                }
                function lineStart() {
                    x0 = NaN, resampleStream.point = linePoint, stream.lineStart();
                }
                function linePoint(lambda, phi) {
                    var c = cartesian([
                        lambda,
                        phi
                    ]), p = project(lambda, phi);
                    resampleLineTo(x0, y0, lambda0, a0, b0, c0, x0 = p[0], y0 = p[1], lambda0 = lambda, a0 = c[0], b0 = c[1], c0 = c[2], 16, stream), stream.point(x0, y0);
                }
                function lineEnd() {
                    resampleStream.point = point, stream.lineEnd();
                }
                function ringStart() {
                    lineStart(), resampleStream.point = ringPoint, resampleStream.lineEnd = ringEnd;
                }
                function ringPoint(lambda, phi) {
                    linePoint(lambda00 = lambda, phi), x00 = x0, y00 = y0, a00 = a0, b00 = b0, c00 = c0, resampleStream.point = linePoint;
                }
                function ringEnd() {
                    resampleLineTo(x0, y0, lambda0, a0, b0, c0, x00, y00, lambda00, a00, b00, c00, 16, stream), resampleStream.lineEnd = lineEnd, lineEnd();
                }
                return resampleStream;
            };
        }(project, delta2) : transformer({
            point: function(x, y) {
                x = project(x, y), this.stream.point(x[0], x[1]);
            }
        });
    }
    var transformRadians = transformer({
        point: function(x, y) {
            this.stream.point(x * radians$1, y * radians$1);
        }
    });
    function scaleTranslateRotate(k, dx, dy, sx, sy, alpha) {
        if (!alpha) return function(k, dx, dy, sx, sy) {
            function transform(x, y) {
                return [
                    dx + k * (x *= sx),
                    dy - k * (y *= sy)
                ];
            }
            return transform.invert = function(x, y) {
                return [
                    (x - dx) / k * sx,
                    (dy - y) / k * sy
                ];
            }, transform;
        }(k, dx, dy, sx, sy);
        var cosAlpha = cos$1(alpha), sinAlpha = sin$1(alpha), a = cosAlpha * k, b = sinAlpha * k, ai = cosAlpha / k, bi = sinAlpha / k, ci = (sinAlpha * dy - cosAlpha * dx) / k, fi = (sinAlpha * dx + cosAlpha * dy) / k;
        function transform(x, y) {
            return [
                a * (x *= sx) - b * (y *= sy) + dx,
                dy - b * x - a * y
            ];
        }
        return transform.invert = function(x, y) {
            return [
                sx * (ai * x - bi * y + ci),
                sy * (fi - bi * x - ai * y)
            ];
        }, transform;
    }
    function projection(project) {
        return projectionMutator(function() {
            return project;
        })();
    }
    function projectionMutator(projectAt) {
        var project, rotate, y0, x1, y1, projectResample, projectTransform, projectRotateTransform, cache, cacheStream, k = 150, x = 480, y = 250, lambda = 0, phi = 0, deltaLambda = 0, deltaPhi = 0, deltaGamma = 0, alpha = 0, sx = 1, sy = 1, theta = null, preclip = clipAntimeridian, x0 = null, postclip = identity$4, delta2 = 0.5;
        function projection(point) {
            return projectRotateTransform(point[0] * radians$1, point[1] * radians$1);
        }
        function invert(point) {
            return (point = projectRotateTransform.invert(point[0], point[1])) && [
                point[0] * degrees$2,
                point[1] * degrees$2
            ];
        }
        function recenter() {
            var center = scaleTranslateRotate(k, 0, 0, sx, sy, alpha).apply(null, project(lambda, phi)), transform = scaleTranslateRotate(k, x - center[0], y - center[1], sx, sy, alpha);
            return rotate = rotateRadians(deltaLambda, deltaPhi, deltaGamma), projectTransform = compose(project, transform), projectRotateTransform = compose(rotate, projectTransform), projectResample = resample(projectTransform, delta2), reset();
        }
        function reset() {
            return cache = cacheStream = null, projection;
        }
        return projection.stream = function(stream) {
            var rotate1;
            return cache && cacheStream === stream ? cache : cache = transformRadians((rotate1 = rotate, transformer({
                point: function(x, y) {
                    var r = rotate1(x, y);
                    return this.stream.point(r[0], r[1]);
                }
            }))(preclip(projectResample(postclip(cacheStream = stream)))));
        }, projection.preclip = function(_) {
            return arguments.length ? (preclip = _, theta = void 0, reset()) : preclip;
        }, projection.postclip = function(_) {
            return arguments.length ? (postclip = _, x0 = y0 = x1 = y1 = null, reset()) : postclip;
        }, projection.clipAngle = function(_) {
            return arguments.length ? (preclip = +_ ? clipCircle(theta = _ * radians$1) : (theta = null, clipAntimeridian), reset()) : theta * degrees$2;
        }, projection.clipExtent = function(_) {
            return arguments.length ? (postclip = null == _ ? (x0 = y0 = x1 = y1 = null, identity$4) : clipRectangle(x0 = +_[0][0], y0 = +_[0][1], x1 = +_[1][0], y1 = +_[1][1]), reset()) : null == x0 ? null : [
                [
                    x0,
                    y0
                ],
                [
                    x1,
                    y1
                ]
            ];
        }, projection.scale = function(_) {
            return arguments.length ? (k = +_, recenter()) : k;
        }, projection.translate = function(_) {
            return arguments.length ? (x = +_[0], y = +_[1], recenter()) : [
                x,
                y
            ];
        }, projection.center = function(_) {
            return arguments.length ? (lambda = _[0] % 360 * radians$1, phi = _[1] % 360 * radians$1, recenter()) : [
                lambda * degrees$2,
                phi * degrees$2
            ];
        }, projection.rotate = function(_) {
            return arguments.length ? (deltaLambda = _[0] % 360 * radians$1, deltaPhi = _[1] % 360 * radians$1, deltaGamma = _.length > 2 ? _[2] % 360 * radians$1 : 0, recenter()) : [
                deltaLambda * degrees$2,
                deltaPhi * degrees$2,
                deltaGamma * degrees$2
            ];
        }, projection.angle = function(_) {
            return arguments.length ? (alpha = _ % 360 * radians$1, recenter()) : alpha * degrees$2;
        }, projection.reflectX = function(_) {
            return arguments.length ? (sx = _ ? -1 : 1, recenter()) : sx < 0;
        }, projection.reflectY = function(_) {
            return arguments.length ? (sy = _ ? -1 : 1, recenter()) : sy < 0;
        }, projection.precision = function(_) {
            return arguments.length ? (projectResample = resample(projectTransform, delta2 = _ * _), reset()) : sqrt(delta2);
        }, projection.fitExtent = function(extent, object) {
            return fitExtent(projection, extent, object);
        }, projection.fitSize = function(size, object) {
            return fitSize(projection, size, object);
        }, projection.fitWidth = function(width, object) {
            return fitWidth(projection, width, object);
        }, projection.fitHeight = function(height, object) {
            return fitHeight(projection, height, object);
        }, function() {
            return project = projectAt.apply(this, arguments), projection.invert = project.invert && invert, recenter();
        };
    }
    function conicProjection(projectAt) {
        var phi0 = 0, phi1 = pi$3 / 3, m = projectionMutator(projectAt), p = m(phi0, phi1);
        return p.parallels = function(_) {
            return arguments.length ? m(phi0 = _[0] * radians$1, phi1 = _[1] * radians$1) : [
                phi0 * degrees$2,
                phi1 * degrees$2
            ];
        }, p;
    }
    function conicEqualAreaRaw(y0, y1) {
        var sy0 = sin$1(y0), n = (sy0 + sin$1(y1)) / 2;
        // Are the parallels symmetrical around the Equator?
        if (1e-6 > abs$2(n)) return function(phi0) {
            var cosPhi0 = cos$1(phi0);
            function forward(lambda, phi) {
                return [
                    lambda * cosPhi0,
                    sin$1(phi) / cosPhi0
                ];
            }
            return forward.invert = function(x, y) {
                return [
                    x / cosPhi0,
                    asin(y * cosPhi0)
                ];
            }, forward;
        }(y0);
        var c = 1 + sy0 * (2 * n - sy0), r0 = sqrt(c) / n;
        function project(x, y) {
            var r = sqrt(c - 2 * n * sin$1(y)) / n;
            return [
                r * sin$1(x *= n),
                r0 - r * cos$1(x)
            ];
        }
        return project.invert = function(x, y) {
            var r0y = r0 - y, l = atan2(x, abs$2(r0y)) * sign(r0y);
            return r0y * n < 0 && (l -= pi$3 * sign(x) * sign(r0y)), [
                l / n,
                asin((c - (x * x + r0y * r0y) * n * n) / (2 * n))
            ];
        }, project;
    }
    function conicEqualArea() {
        return conicProjection(conicEqualAreaRaw).scale(155.424).center([
            0,
            33.6442
        ]);
    }
    function albers() {
        return conicEqualArea().parallels([
            29.5,
            45.5
        ]).scale(1070).translate([
            480,
            250
        ]).rotate([
            96,
            0
        ]).center([
            -0.6,
            38.7
        ]);
    }
    function azimuthalRaw(scale) {
        return function(x, y) {
            var cx = cos$1(x), cy = cos$1(y), k = scale(cx * cy);
            return k === 1 / 0 ? [
                2,
                0
            ] : [
                k * cy * sin$1(x),
                k * sin$1(y)
            ];
        };
    }
    function azimuthalInvert(angle) {
        return function(x, y) {
            var z = sqrt(x * x + y * y), c = angle(z), sc = sin$1(c);
            return [
                atan2(x * sc, z * cos$1(c)),
                asin(z && y * sc / z)
            ];
        };
    }
    var azimuthalEqualAreaRaw = azimuthalRaw(function(cxcy) {
        return sqrt(2 / (1 + cxcy));
    });
    azimuthalEqualAreaRaw.invert = azimuthalInvert(function(z) {
        return 2 * asin(z / 2);
    });
    var azimuthalEquidistantRaw = azimuthalRaw(function(c) {
        return (c = acos(c)) && c / sin$1(c);
    });
    function mercatorRaw(lambda, phi) {
        return [
            lambda,
            log(tan((halfPi$2 + phi) / 2))
        ];
    }
    function mercatorProjection(project) {
        var y0, x1, y1, m = projection(project), center = m.center, scale = m.scale, translate = m.translate, clipExtent = m.clipExtent, x0 = null; // clip extent
        function reclip() {
            var k = pi$3 * scale(), t = m(rotation(m.rotate()).invert([
                0,
                0
            ]));
            return clipExtent(null == x0 ? [
                [
                    t[0] - k,
                    t[1] - k
                ],
                [
                    t[0] + k,
                    t[1] + k
                ]
            ] : project === mercatorRaw ? [
                [
                    Math.max(t[0] - k, x0),
                    y0
                ],
                [
                    Math.min(t[0] + k, x1),
                    y1
                ]
            ] : [
                [
                    x0,
                    Math.max(t[1] - k, y0)
                ],
                [
                    x1,
                    Math.min(t[1] + k, y1)
                ]
            ]);
        }
        return m.scale = function(_) {
            return arguments.length ? (scale(_), reclip()) : scale();
        }, m.translate = function(_) {
            return arguments.length ? (translate(_), reclip()) : translate();
        }, m.center = function(_) {
            return arguments.length ? (center(_), reclip()) : center();
        }, m.clipExtent = function(_) {
            return arguments.length ? (null == _ ? x0 = y0 = x1 = y1 = null : (x0 = +_[0][0], y0 = +_[0][1], x1 = +_[1][0], y1 = +_[1][1]), reclip()) : null == x0 ? null : [
                [
                    x0,
                    y0
                ],
                [
                    x1,
                    y1
                ]
            ];
        }, reclip();
    }
    function tany(y) {
        return tan((halfPi$2 + y) / 2);
    }
    function conicConformalRaw(y0, y1) {
        var cy0 = cos$1(y0), n = y0 === y1 ? sin$1(y0) : log(cy0 / cos$1(y1)) / log(tany(y1) / tany(y0)), f = cy0 * pow$1(tany(y0), n) / n;
        if (!n) return mercatorRaw;
        function project(x, y) {
            f > 0 ? y < -halfPi$2 + 1e-6 && (y = -halfPi$2 + 1e-6) : y > halfPi$2 - 1e-6 && (y = halfPi$2 - 1e-6);
            var r = f / pow$1(tany(y), n);
            return [
                r * sin$1(n * x),
                f - r * cos$1(n * x)
            ];
        }
        return project.invert = function(x, y) {
            var fy = f - y, r = sign(n) * sqrt(x * x + fy * fy), l = atan2(x, abs$2(fy)) * sign(fy);
            return fy * n < 0 && (l -= pi$3 * sign(x) * sign(fy)), [
                l / n,
                2 * atan(pow$1(f / r, 1 / n)) - halfPi$2
            ];
        }, project;
    }
    function equirectangularRaw(lambda, phi) {
        return [
            lambda,
            phi
        ];
    }
    function conicEquidistantRaw(y0, y1) {
        var cy0 = cos$1(y0), n = y0 === y1 ? sin$1(y0) : (cy0 - cos$1(y1)) / (y1 - y0), g = cy0 / n + y0;
        if (1e-6 > abs$2(n)) return equirectangularRaw;
        function project(x, y) {
            var gy = g - y, nx = n * x;
            return [
                gy * sin$1(nx),
                g - gy * cos$1(nx)
            ];
        }
        return project.invert = function(x, y) {
            var gy = g - y, l = atan2(x, abs$2(gy)) * sign(gy);
            return gy * n < 0 && (l -= pi$3 * sign(x) * sign(gy)), [
                l / n,
                g - sign(n) * sqrt(x * x + gy * gy)
            ];
        }, project;
    }
    azimuthalEquidistantRaw.invert = azimuthalInvert(function(z) {
        return z;
    }), mercatorRaw.invert = function(x, y) {
        return [
            x,
            2 * atan(exp(y)) - halfPi$2
        ];
    }, equirectangularRaw.invert = equirectangularRaw;
    var M = sqrt(3) / 2;
    function equalEarthRaw(lambda, phi) {
        var l = asin(M * sin$1(phi)), l2 = l * l, l6 = l2 * l2 * l2;
        return [
            lambda * cos$1(l) / (M * (1.340264 + -0.24331799999999998 * l2 + l6 * (0.0062510000000000005 + 0.034164 * l2))),
            l * (1.340264 + -0.081106 * l2 + l6 * (0.000893 + 0.003796 * l2))
        ];
    }
    function gnomonicRaw(x, y) {
        var cy = cos$1(y), k = cos$1(x) * cy;
        return [
            cy * sin$1(x) / k,
            sin$1(y) / k
        ];
    }
    function naturalEarth1Raw(lambda, phi) {
        var phi2 = phi * phi, phi4 = phi2 * phi2;
        return [
            lambda * (0.8707 - 0.131979 * phi2 + phi4 * (-0.013791 + phi4 * (0.003971 * phi2 - 0.001529 * phi4))),
            phi * (1.007226 + phi2 * (0.015085 + phi4 * (-0.044475 + 0.028874 * phi2 - 0.005916 * phi4)))
        ];
    }
    function orthographicRaw(x, y) {
        return [
            cos$1(y) * sin$1(x),
            sin$1(y)
        ];
    }
    function stereographicRaw(x, y) {
        var cy = cos$1(y), k = 1 + cos$1(x) * cy;
        return [
            cy * sin$1(x) / k,
            sin$1(y) / k
        ];
    }
    function transverseMercatorRaw(lambda, phi) {
        return [
            log(tan((halfPi$2 + phi) / 2)),
            -lambda
        ];
    }
    function defaultSeparation(a, b) {
        return a.parent === b.parent ? 1 : 2;
    }
    function meanXReduce(x, c) {
        return x + c.x;
    }
    function maxYReduce(y, c) {
        return Math.max(y, c.y);
    }
    function count$1(node) {
        var sum = 0, children = node.children, i = children && children.length;
        if (i) for(; --i >= 0;)sum += children[i].value;
        else sum = 1;
        node.value = sum;
    }
    function hierarchy(data, children) {
        data instanceof Map ? (data = [
            void 0,
            data
        ], void 0 === children && (children = mapChildren)) : void 0 === children && (children = objectChildren);
        for(var node, child, childs, i, n, root = new Node(data), nodes = [
            root
        ]; node = nodes.pop();)if ((childs = children(node.data)) && (n = (childs = Array.from(childs)).length)) for(node.children = childs, i = n - 1; i >= 0; --i)nodes.push(child = childs[i] = new Node(childs[i])), child.parent = node, child.depth = node.depth + 1;
        return root.eachBefore(computeHeight);
    }
    function objectChildren(d) {
        return d.children;
    }
    function mapChildren(d) {
        return Array.isArray(d) ? d[1] : null;
    }
    function copyData(node) {
        void 0 !== node.data.value && (node.value = node.data.value), node.data = node.data.data;
    }
    function computeHeight(node) {
        var height = 0;
        do node.height = height;
        while ((node = node.parent) && node.height < ++height)
    }
    function Node(data) {
        this.data = data, this.depth = this.height = 0, this.parent = null;
    }
    function enclose(circles) {
        for(var p, e, i = 0, n = (circles = function(array) {
            for(var t, i, m = array.length; m;)i = Math.random() * m-- | 0, t = array[m], array[m] = array[i], array[i] = t;
            return array;
        }(Array.from(circles))).length, B = []; i < n;)p = circles[i], e && enclosesWeak(e, p) ? ++i : (e = function(B) {
            switch(B.length){
                case 1:
                    var a;
                    return {
                        x: (a = B[0]).x,
                        y: a.y,
                        r: a.r
                    };
                case 2:
                    return encloseBasis2(B[0], B[1]);
                case 3:
                    return encloseBasis3(B[0], B[1], B[2]);
            }
        }(B = function(B, p) {
            var i, j;
            if (enclosesWeakAll(p, B)) return [
                p
            ];
            // If we get here then B must have at least one element.
            for(i = 0; i < B.length; ++i)if (enclosesNot(p, B[i]) && enclosesWeakAll(encloseBasis2(B[i], p), B)) return [
                B[i],
                p
            ];
            // If we get here then B must have at least two elements.
            for(i = 0; i < B.length - 1; ++i)for(j = i + 1; j < B.length; ++j)if (enclosesNot(encloseBasis2(B[i], B[j]), p) && enclosesNot(encloseBasis2(B[i], p), B[j]) && enclosesNot(encloseBasis2(B[j], p), B[i]) && enclosesWeakAll(encloseBasis3(B[i], B[j], p), B)) return [
                B[i],
                B[j],
                p
            ];
            // If we get here then something is very wrong.
            throw Error();
        }(B, p)), i = 0);
        return e;
    }
    function enclosesNot(a, b) {
        var dr = a.r - b.r, dx = b.x - a.x, dy = b.y - a.y;
        return dr < 0 || dr * dr < dx * dx + dy * dy;
    }
    function enclosesWeak(a, b) {
        var dr = a.r - b.r + 1e-9 * Math.max(a.r, b.r, 1), dx = b.x - a.x, dy = b.y - a.y;
        return dr > 0 && dr * dr > dx * dx + dy * dy;
    }
    function enclosesWeakAll(a, B) {
        for(var i = 0; i < B.length; ++i)if (!enclosesWeak(a, B[i])) return !1;
        return !0;
    }
    function encloseBasis2(a, b) {
        var x1 = a.x, y1 = a.y, r1 = a.r, x2 = b.x, y2 = b.y, r2 = b.r, x21 = x2 - x1, y21 = y2 - y1, r21 = r2 - r1, l = Math.sqrt(x21 * x21 + y21 * y21);
        return {
            x: (x1 + x2 + x21 / l * r21) / 2,
            y: (y1 + y2 + y21 / l * r21) / 2,
            r: (l + r1 + r2) / 2
        };
    }
    function encloseBasis3(a, b, c) {
        var x1 = a.x, y1 = a.y, r1 = a.r, x2 = b.x, y2 = b.y, r2 = b.r, x3 = c.x, y3 = c.y, r3 = c.r, a2 = x1 - x2, a3 = x1 - x3, b2 = y1 - y2, b3 = y1 - y3, c2 = r2 - r1, c3 = r3 - r1, d1 = x1 * x1 + y1 * y1 - r1 * r1, d2 = d1 - x2 * x2 - y2 * y2 + r2 * r2, d3 = d1 - x3 * x3 - y3 * y3 + r3 * r3, ab = a3 * b2 - a2 * b3, xa = (b2 * d3 - b3 * d2) / (2 * ab) - x1, xb = (b3 * c2 - b2 * c3) / ab, ya = (a3 * d2 - a2 * d3) / (2 * ab) - y1, yb = (a2 * c3 - a3 * c2) / ab, A = xb * xb + yb * yb - 1, B = 2 * (r1 + xa * xb + ya * yb), C = xa * xa + ya * ya - r1 * r1, r = -(A ? (B + Math.sqrt(B * B - 4 * A * C)) / (2 * A) : C / B);
        return {
            x: x1 + xa + xb * r,
            y: y1 + ya + yb * r,
            r: r
        };
    }
    function place(b, a, c) {
        var x, a2, y, b2, dx = b.x - a.x, dy = b.y - a.y, d2 = dx * dx + dy * dy;
        d2 ? (a2 = a.r + c.r, a2 *= a2, b2 = b.r + c.r, a2 > (b2 *= b2) ? (x = (d2 + b2 - a2) / (2 * d2), y = Math.sqrt(Math.max(0, b2 / d2 - x * x)), c.x = b.x - x * dx - y * dy, c.y = b.y - x * dy + y * dx) : (x = (d2 + a2 - b2) / (2 * d2), y = Math.sqrt(Math.max(0, a2 / d2 - x * x)), c.x = a.x + x * dx - y * dy, c.y = a.y + x * dy + y * dx)) : (c.x = a.x + c.r, c.y = a.y);
    }
    function intersects(a, b) {
        var dr = a.r + b.r - 1e-6, dx = b.x - a.x, dy = b.y - a.y;
        return dr > 0 && dr * dr > dx * dx + dy * dy;
    }
    function score(node) {
        var a = node._, b = node.next._, ab = a.r + b.r, dx = (a.x * b.r + b.x * a.r) / ab, dy = (a.y * b.r + b.y * a.r) / ab;
        return dx * dx + dy * dy;
    }
    function Node$1(circle) {
        this._ = circle, this.next = null, this.previous = null;
    }
    function packEnclose(circles) {
        var a, b, c, n, aa, ca, i, j, k, sj, sk, x;
        if (!(n = (circles = "object" == typeof (x = circles) && "length" in x ? x // Array, TypedArray, NodeList, array-like
         : Array.from(x)).length)) return 0;
        if (// Place the first circle.
        (a = circles[0]).x = 0, a.y = 0, !(n > 1)) return a.r;
        if (// Place the second circle.
        b = circles[1], a.x = -b.r, b.x = a.r, b.y = 0, !(n > 2)) return a.r + b.r;
        // Place the third circle.
        place(b, a, c = circles[2]), // Initialize the front-chain using the first three circles a, b and c.
        a = new Node$1(a), b = new Node$1(b), c = new Node$1(c), a.next = c.previous = b, b.next = a.previous = c, c.next = b.previous = a;
        // Attempt to place each remaining circle…
        pack: for(i = 3; i < n; ++i){
            place(a._, b._, c = circles[i]), c = new Node$1(c), // Find the closest intersecting circle on the front-chain, if any.
            // “Closeness” is determined by linear distance along the front-chain.
            // “Ahead” or “behind” is likewise determined by linear distance.
            j = b.next, k = a.previous, sj = b._.r, sk = a._.r;
            do if (sj <= sk) {
                if (intersects(j._, c._)) {
                    b = j, a.next = b, b.previous = a, --i;
                    continue pack;
                }
                sj += j._.r, j = j.next;
            } else {
                if (intersects(k._, c._)) {
                    (a = k).next = b, b.previous = a, --i;
                    continue pack;
                }
                sk += k._.r, k = k.previous;
            }
            while (j !== k.next)
            for(// Success! Insert the new circle c between a and b.
            c.previous = a, c.next = b, a.next = b.previous = b = c, // Compute the new closest circle pair to the centroid.
            aa = score(a); (c = c.next) !== b;)(ca = score(c)) < aa && (a = c, aa = ca);
            b = a.next;
        }
        for(// Compute the enclosing circle of the front chain.
        a = [
            b._
        ], c = b; (c = c.next) !== b;)a.push(c._);
        // Translate the circles to put the enclosing circle around the origin.
        for(i = 0, c = enclose(a); i < n; ++i)a = circles[i], a.x -= c.x, a.y -= c.y;
        return c.r;
    }
    function required(f) {
        if ("function" != typeof f) throw Error();
        return f;
    }
    function constantZero() {
        return 0;
    }
    function constant$9(x) {
        return function() {
            return x;
        };
    }
    function defaultRadius$1(d) {
        return Math.sqrt(d.value);
    }
    function radiusLeaf(radius) {
        return function(node) {
            node.children || (node.r = Math.max(0, +radius(node) || 0));
        };
    }
    function packChildren(padding, k) {
        return function(node) {
            if (children = node.children) {
                var children, i, e, n = children.length, r = padding(node) * k || 0;
                if (r) for(i = 0; i < n; ++i)children[i].r += r;
                if (e = packEnclose(children), r) for(i = 0; i < n; ++i)children[i].r -= r;
                node.r = e + r;
            }
        };
    }
    function translateChild(k) {
        return function(node) {
            var parent = node.parent;
            node.r *= k, parent && (node.x = parent.x + k * node.x, node.y = parent.y + k * node.y);
        };
    }
    function roundNode(node) {
        node.x0 = Math.round(node.x0), node.y0 = Math.round(node.y0), node.x1 = Math.round(node.x1), node.y1 = Math.round(node.y1);
    }
    function treemapDice(parent, x0, y0, x1, y1) {
        for(var node, nodes = parent.children, i = -1, n = nodes.length, k = parent.value && (x1 - x0) / parent.value; ++i < n;)(node = nodes[i]).y0 = y0, node.y1 = y1, node.x0 = x0, node.x1 = x0 += node.value * k;
    }
    equalEarthRaw.invert = function(x, y) {
        for(var delta, fy, l = y, l2 = l * l, l6 = l2 * l2 * l2, i = 0; i < 12 && (fy = l * (1.340264 + -0.081106 * l2 + l6 * (0.000893 + 0.003796 * l2)) - y, l -= delta = fy / (1.340264 + -0.24331799999999998 * l2 + l6 * (0.0062510000000000005 + 0.034164 * l2)), l6 = (l2 = l * l) * l2 * l2, !(1e-12 > abs$2(delta))); ++i);
        return [
            M * x * (1.340264 + -0.24331799999999998 * l2 + l6 * (0.0062510000000000005 + 0.034164 * l2)) / cos$1(l),
            asin(sin$1(l) / M)
        ];
    }, gnomonicRaw.invert = azimuthalInvert(atan), naturalEarth1Raw.invert = function(x, y) {
        var delta, phi = y, i = 25;
        do {
            var phi2 = phi * phi, phi4 = phi2 * phi2;
            phi -= delta = (phi * (1.007226 + phi2 * (0.015085 + phi4 * (-0.044475 + 0.028874 * phi2 - 0.005916 * phi4))) - y) / (1.007226 + phi2 * (0.045255 + phi4 * (-0.311325 + 0.259866 * phi2 - 0.005916 * 11 * phi4)));
        }while (abs$2(delta) > 1e-6 && --i > 0)
        return [
            x / (0.8707 + (phi2 = phi * phi) * (-0.131979 + phi2 * (-0.013791 + phi2 * phi2 * phi2 * (0.003971 - 0.001529 * phi2)))),
            phi
        ];
    }, orthographicRaw.invert = azimuthalInvert(asin), stereographicRaw.invert = azimuthalInvert(function(z) {
        return 2 * atan(z);
    }), transverseMercatorRaw.invert = function(x, y) {
        return [
            -y,
            2 * atan(exp(x)) - halfPi$2
        ];
    }, Node.prototype = hierarchy.prototype = {
        constructor: Node,
        count: function() {
            return this.eachAfter(count$1);
        },
        each: function(callback, that) {
            let index = -1;
            for (const node of this)callback.call(that, node, ++index, this);
            return this;
        },
        eachAfter: function(callback, that) {
            for(var children, i, n, node = this, nodes = [
                node
            ], next = [], index = -1; node = nodes.pop();)if (next.push(node), children = node.children) for(i = 0, n = children.length; i < n; ++i)nodes.push(children[i]);
            for(; node = next.pop();)callback.call(that, node, ++index, this);
            return this;
        },
        eachBefore: function(callback, that) {
            for(var children, i, node = this, nodes = [
                node
            ], index = -1; node = nodes.pop();)if (callback.call(that, node, ++index, this), children = node.children) for(i = children.length - 1; i >= 0; --i)nodes.push(children[i]);
            return this;
        },
        find: function(callback, that) {
            let index = -1;
            for (const node of this)if (callback.call(that, node, ++index, this)) return node;
        },
        sum: function(value) {
            return this.eachAfter(function(node) {
                for(var sum = +value(node.data) || 0, children = node.children, i = children && children.length; --i >= 0;)sum += children[i].value;
                node.value = sum;
            });
        },
        sort: function(compare) {
            return this.eachBefore(function(node) {
                node.children && node.children.sort(compare);
            });
        },
        path: function(end) {
            for(var start = this, ancestor = function(a, b) {
                if (a === b) return a;
                var aNodes = a.ancestors(), bNodes = b.ancestors(), c = null;
                for(a = aNodes.pop(), b = bNodes.pop(); a === b;)c = a, a = aNodes.pop(), b = bNodes.pop();
                return c;
            }(start, end), nodes = [
                start
            ]; start !== ancestor;)nodes.push(start = start.parent);
            for(var k = nodes.length; end !== ancestor;)nodes.splice(k, 0, end), end = end.parent;
            return nodes;
        },
        ancestors: function() {
            for(var node = this, nodes = [
                node
            ]; node = node.parent;)nodes.push(node);
            return nodes;
        },
        descendants: function() {
            return Array.from(this);
        },
        leaves: function() {
            var leaves = [];
            return this.eachBefore(function(node) {
                node.children || leaves.push(node);
            }), leaves;
        },
        links: function() {
            var root = this, links = [];
            return root.each(function(node) {
                node !== root && links.push({
                    source: node.parent,
                    target: node
                });
            }), links;
        },
        copy: function() {
            return hierarchy(this).eachBefore(copyData);
        },
        [Symbol.iterator]: function*() {
            var current, children, i, n, node = this, next = [
                node
            ];
            do for(current = next.reverse(), next = []; node = current.pop();)if (yield node, children = node.children) for(i = 0, n = children.length; i < n; ++i)next.push(children[i]);
            while (next.length)
        }
    };
    var preroot = {
        depth: -1
    }, ambiguous = {};
    function defaultId(d) {
        return d.id;
    }
    function defaultParentId(d) {
        return d.parentId;
    }
    function defaultSeparation$1(a, b) {
        return a.parent === b.parent ? 1 : 2;
    }
    // function radialSeparation(a, b) {
    //   return (a.parent === b.parent ? 1 : 2) / a.depth;
    // }
    // This function is used to traverse the left contour of a subtree (or
    // subforest). It returns the successor of v on this contour. This successor is
    // either given by the leftmost child of v or by the thread of v. The function
    // returns null if and only if v is on the highest level of its subtree.
    function nextLeft(v) {
        var children = v.children;
        return children ? children[0] : v.t;
    }
    // This function works analogously to nextLeft.
    function nextRight(v) {
        var children = v.children;
        return children ? children[children.length - 1] : v.t;
    }
    function TreeNode(node, i) {
        this._ = node, this.parent = null, this.children = null, this.A = null, this.a = this, this.z = 0, this.m = 0, this.c = 0, this.s = 0, this.t = null, this.i = i;
    }
    function treemapSlice(parent, x0, y0, x1, y1) {
        for(var node, nodes = parent.children, i = -1, n = nodes.length, k = parent.value && (y1 - y0) / parent.value; ++i < n;)(node = nodes[i]).x0 = x0, node.x1 = x1, node.y0 = y0, node.y1 = y0 += node.value * k;
    }
    TreeNode.prototype = Object.create(Node.prototype);
    var phi = (1 + Math.sqrt(5)) / 2;
    function squarifyRatio(ratio, parent, x0, y0, x1, y1) {
        for(var row, nodeValue, dx, dy, sumValue, minValue, maxValue, newRatio, minRatio, alpha, beta, rows = [], nodes = parent.children, i0 = 0, i1 = 0, n = nodes.length, value = parent.value; i0 < n;){
            dx = x1 - x0, dy = y1 - y0;
            // Find the next non-empty node.
            do sumValue = nodes[i1++].value;
            while (!sumValue && i1 < n)
            // Keep adding nodes while the aspect ratio maintains or improves.
            for(minValue = maxValue = sumValue, minRatio = Math.max(maxValue / (beta = sumValue * sumValue * (alpha = Math.max(dy / dx, dx / dy) / (value * ratio))), beta / minValue); i1 < n; ++i1){
                if (sumValue += nodeValue = nodes[i1].value, nodeValue < minValue && (minValue = nodeValue), nodeValue > maxValue && (maxValue = nodeValue), (newRatio = Math.max(maxValue / (beta = sumValue * sumValue * alpha), beta / minValue)) > minRatio) {
                    sumValue -= nodeValue;
                    break;
                }
                minRatio = newRatio;
            }
            // Position and record the row orientation.
            rows.push(row = {
                value: sumValue,
                dice: dx < dy,
                children: nodes.slice(i0, i1)
            }), row.dice ? treemapDice(row, x0, y0, x1, value ? y0 += dy * sumValue / value : y1) : treemapSlice(row, x0, y0, value ? x0 += dx * sumValue / value : x1, y1), value -= sumValue, i0 = i1;
        }
        return rows;
    }
    var squarify = function custom(ratio) {
        function squarify(parent, x0, y0, x1, y1) {
            squarifyRatio(ratio, parent, x0, y0, x1, y1);
        }
        return squarify.ratio = function(x) {
            return custom((x = +x) > 1 ? x : 1);
        }, squarify;
    }(phi), resquarify = function custom(ratio) {
        function resquarify(parent, x0, y0, x1, y1) {
            if ((rows = parent._squarify) && rows.ratio === ratio) for(var rows, row, nodes, i, n, j = -1, m = rows.length, value = parent.value; ++j < m;){
                for(nodes = (row = rows[j]).children, i = row.value = 0, n = nodes.length; i < n; ++i)row.value += nodes[i].value;
                row.dice ? treemapDice(row, x0, y0, x1, value ? y0 += (y1 - y0) * row.value / value : y1) : treemapSlice(row, x0, y0, value ? x0 += (x1 - x0) * row.value / value : x1, y1), value -= row.value;
            }
            else parent._squarify = rows = squarifyRatio(ratio, parent, x0, y0, x1, y1), rows.ratio = ratio;
        }
        return resquarify.ratio = function(x) {
            return custom((x = +x) > 1 ? x : 1);
        }, resquarify;
    }(phi);
    function lexicographicOrder(a, b) {
        return a[0] - b[0] || a[1] - b[1];
    }
    // Computes the upper convex hull per the monotone chain algorithm.
    // Assumes points.length >= 3, is sorted by x, unique in y.
    // Returns an array of indices into points in left-to-right order.
    function computeUpperHullIndexes(points) {
        const n = points.length, indexes = [
            0,
            1
        ];
        let size = 2, i;
        for(i = 2; i < n; ++i){
            for(var a, b, c; size > 1 && 0 >= (a = points[indexes[size - 2]], b = points[indexes[size - 1]], c = points[i], (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]));)--size;
            indexes[size++] = i;
        }
        return indexes.slice(0, size); // remove popped points
    }
    var defaultSource$1 = Math.random, uniform = function sourceRandomUniform(source) {
        function randomUniform(min, max) {
            return min = null == min ? 0 : +min, max = null == max ? 1 : +max, 1 == arguments.length ? (max = min, min = 0) : max -= min, function() {
                return source() * max + min;
            };
        }
        return randomUniform.source = sourceRandomUniform, randomUniform;
    }(defaultSource$1), int = function sourceRandomInt(source) {
        function randomInt(min, max) {
            return arguments.length < 2 && (max = min, min = 0), max = Math.floor(max) - (min = Math.floor(min)), function() {
                return Math.floor(source() * max + min);
            };
        }
        return randomInt.source = sourceRandomInt, randomInt;
    }(defaultSource$1), normal = function sourceRandomNormal(source) {
        function randomNormal(mu, sigma) {
            var x, r;
            return mu = null == mu ? 0 : +mu, sigma = null == sigma ? 1 : +sigma, function() {
                var y;
                // If available, use the second previously-generated uniform random.
                if (null != x) y = x, x = null;
                else do x = 2 * source() - 1, y = 2 * source() - 1, r = x * x + y * y;
                while (!r || r > 1)
                return mu + sigma * y * Math.sqrt(-2 * Math.log(r) / r);
            };
        }
        return randomNormal.source = sourceRandomNormal, randomNormal;
    }(defaultSource$1), logNormal = function sourceRandomLogNormal(source) {
        var N = normal.source(source);
        function randomLogNormal() {
            var randomNormal = N.apply(this, arguments);
            return function() {
                return Math.exp(randomNormal());
            };
        }
        return randomLogNormal.source = sourceRandomLogNormal, randomLogNormal;
    }(defaultSource$1), irwinHall = function sourceRandomIrwinHall(source) {
        function randomIrwinHall(n) {
            return (n = +n) <= 0 ? ()=>0 : function() {
                for(var sum = 0, i = n; i > 1; --i)sum += source();
                return sum + i * source();
            };
        }
        return randomIrwinHall.source = sourceRandomIrwinHall, randomIrwinHall;
    }(defaultSource$1), bates = function sourceRandomBates(source) {
        var I = irwinHall.source(source);
        function randomBates(n) {
            // use limiting distribution at n === 0
            if (0 == (n = +n)) return source;
            var randomIrwinHall = I(n);
            return function() {
                return randomIrwinHall() / n;
            };
        }
        return randomBates.source = sourceRandomBates, randomBates;
    }(defaultSource$1), exponential$1 = function sourceRandomExponential(source) {
        function randomExponential(lambda) {
            return function() {
                return -Math.log1p(-source()) / lambda;
            };
        }
        return randomExponential.source = sourceRandomExponential, randomExponential;
    }(defaultSource$1), pareto = function sourceRandomPareto(source) {
        function randomPareto(alpha) {
            if ((alpha = +alpha) < 0) throw RangeError("invalid alpha");
            return alpha = -(1 / alpha), function() {
                return Math.pow(1 - source(), alpha);
            };
        }
        return randomPareto.source = sourceRandomPareto, randomPareto;
    }(defaultSource$1), bernoulli = function sourceRandomBernoulli(source) {
        function randomBernoulli(p) {
            if ((p = +p) < 0 || p > 1) throw RangeError("invalid p");
            return function() {
                return Math.floor(source() + p);
            };
        }
        return randomBernoulli.source = sourceRandomBernoulli, randomBernoulli;
    }(defaultSource$1), geometric = function sourceRandomGeometric(source) {
        function randomGeometric(p) {
            if ((p = +p) < 0 || p > 1) throw RangeError("invalid p");
            return 0 === p ? ()=>1 / 0 : 1 === p ? ()=>1 : (p = Math.log1p(-p), function() {
                return 1 + Math.floor(Math.log1p(-source()) / p);
            });
        }
        return randomGeometric.source = sourceRandomGeometric, randomGeometric;
    }(defaultSource$1), gamma$1 = function sourceRandomGamma(source) {
        var randomNormal = normal.source(source)();
        function randomGamma(k, theta) {
            if ((k = +k) < 0) throw RangeError("invalid k");
            // degenerate distribution if k === 0
            if (0 === k) return ()=>0;
            // exponential distribution if k === 1
            if (theta = null == theta ? 1 : +theta, 1 === k) return ()=>-Math.log1p(-source()) * theta;
            var d = (k < 1 ? k + 1 : k) - 1 / 3, c = 1 / (3 * Math.sqrt(d)), multiplier = k < 1 ? ()=>Math.pow(source(), 1 / k) : ()=>1;
            return function() {
                do {
                    do var x = randomNormal(), v = 1 + c * x;
                    while (v <= 0)
                    v *= v * v;
                    var u = 1 - source();
                }while (u >= 1 - 0.0331 * x * x * x * x && Math.log(u) >= 0.5 * x * x + d * (1 - v + Math.log(v)))
                return d * v * multiplier() * theta;
            };
        }
        return randomGamma.source = sourceRandomGamma, randomGamma;
    }(defaultSource$1), beta = function sourceRandomBeta(source) {
        var G = gamma$1.source(source);
        function randomBeta(alpha, beta) {
            var X = G(alpha), Y = G(beta);
            return function() {
                var x = X();
                return 0 === x ? 0 : x / (x + Y());
            };
        }
        return randomBeta.source = sourceRandomBeta, randomBeta;
    }(defaultSource$1), binomial = function sourceRandomBinomial(source) {
        var G = geometric.source(source), B = beta.source(source);
        function randomBinomial(n, p) {
            return (n = +n, (p = +p) >= 1) ? ()=>n : p <= 0 ? ()=>0 : function() {
                for(var acc = 0, nn = n, pp = p; nn * pp > 16 && nn * (1 - pp) > 16;){
                    var i = Math.floor((nn + 1) * pp), y = B(i, nn - i + 1)();
                    y <= pp ? (acc += i, nn -= i, pp = (pp - y) / (1 - y)) : (nn = i - 1, pp /= y);
                }
                for(var sign = pp < 0.5, g = G(sign ? pp : 1 - pp), s = g(), k = 0; s <= nn; ++k)s += g();
                return acc + (sign ? k : nn - k);
            };
        }
        return randomBinomial.source = sourceRandomBinomial, randomBinomial;
    }(defaultSource$1), weibull = function sourceRandomWeibull(source) {
        function randomWeibull(k, a, b) {
            var outerFunc;
            return 0 == (k = +k) ? outerFunc = (x)=>-Math.log(x) : (k = 1 / k, outerFunc = (x)=>Math.pow(x, k)), a = null == a ? 0 : +a, b = null == b ? 1 : +b, function() {
                return a + b * outerFunc(-Math.log1p(-source()));
            };
        }
        return randomWeibull.source = sourceRandomWeibull, randomWeibull;
    }(defaultSource$1), cauchy = function sourceRandomCauchy(source) {
        function randomCauchy(a, b) {
            return a = null == a ? 0 : +a, b = null == b ? 1 : +b, function() {
                return a + b * Math.tan(Math.PI * source());
            };
        }
        return randomCauchy.source = sourceRandomCauchy, randomCauchy;
    }(defaultSource$1), logistic = function sourceRandomLogistic(source) {
        function randomLogistic(a, b) {
            return a = null == a ? 0 : +a, b = null == b ? 1 : +b, function() {
                var u = source();
                return a + b * Math.log(u / (1 - u));
            };
        }
        return randomLogistic.source = sourceRandomLogistic, randomLogistic;
    }(defaultSource$1), poisson = function sourceRandomPoisson(source) {
        var G = gamma$1.source(source), B = binomial.source(source);
        function randomPoisson(lambda) {
            return function() {
                for(var acc = 0, l = lambda; l > 16;){
                    var n = Math.floor(0.875 * l), t = G(n)();
                    if (t > l) return acc + B(n - 1, l / t)();
                    acc += n, l -= t;
                }
                for(var s = -Math.log1p(-source()), k = 0; s <= l; ++k)s -= Math.log1p(-source());
                return acc + k;
            };
        }
        return randomPoisson.source = sourceRandomPoisson, randomPoisson;
    }(defaultSource$1);
    const eps = 1 / 0x100000000;
    function initRange(domain, range) {
        switch(arguments.length){
            case 0:
                break;
            case 1:
                this.range(domain);
                break;
            default:
                this.range(range).domain(domain);
        }
        return this;
    }
    function initInterpolator(domain, interpolator) {
        switch(arguments.length){
            case 0:
                break;
            case 1:
                "function" == typeof domain ? this.interpolator(domain) : this.range(domain);
                break;
            default:
                this.domain(domain), "function" == typeof interpolator ? this.interpolator(interpolator) : this.range(interpolator);
        }
        return this;
    }
    const implicit = Symbol("implicit");
    function ordinal() {
        var index = new Map(), domain = [], range = [], unknown = implicit;
        function scale(d) {
            var key = d + "", i = index.get(key);
            if (!i) {
                if (unknown !== implicit) return unknown;
                index.set(key, i = domain.push(d));
            }
            return range[(i - 1) % range.length];
        }
        return scale.domain = function(_) {
            if (!arguments.length) return domain.slice();
            for (const value of (domain = [], index = new Map(), _)){
                const key = value + "";
                index.has(key) || index.set(key, domain.push(value));
            }
            return scale;
        }, scale.range = function(_) {
            return arguments.length ? (range = Array.from(_), scale) : range.slice();
        }, scale.unknown = function(_) {
            return arguments.length ? (unknown = _, scale) : unknown;
        }, scale.copy = function() {
            return ordinal(domain, range).unknown(unknown);
        }, initRange.apply(scale, arguments), scale;
    }
    function band() {
        var step, bandwidth, scale = ordinal().unknown(void 0), domain = scale.domain, ordinalRange = scale.range, r0 = 0, r1 = 1, round = !1, paddingInner = 0, paddingOuter = 0, align = 0.5;
        function rescale() {
            var n = domain().length, reverse = r1 < r0, start = reverse ? r1 : r0, stop = reverse ? r0 : r1;
            step = (stop - start) / Math.max(1, n - paddingInner + 2 * paddingOuter), round && (step = Math.floor(step)), start += (stop - start - step * (n - paddingInner)) * align, bandwidth = step * (1 - paddingInner), round && (start = Math.round(start), bandwidth = Math.round(bandwidth));
            var values = sequence(n).map(function(i) {
                return start + step * i;
            });
            return ordinalRange(reverse ? values.reverse() : values);
        }
        return delete scale.unknown, scale.domain = function(_) {
            return arguments.length ? (domain(_), rescale()) : domain();
        }, scale.range = function(_) {
            return arguments.length ? ([r0, r1] = _, r0 = +r0, r1 = +r1, rescale()) : [
                r0,
                r1
            ];
        }, scale.rangeRound = function(_) {
            return [r0, r1] = _, r0 = +r0, r1 = +r1, round = !0, rescale();
        }, scale.bandwidth = function() {
            return bandwidth;
        }, scale.step = function() {
            return step;
        }, scale.round = function(_) {
            return arguments.length ? (round = !!_, rescale()) : round;
        }, scale.padding = function(_) {
            return arguments.length ? (paddingInner = Math.min(1, paddingOuter = +_), rescale()) : paddingInner;
        }, scale.paddingInner = function(_) {
            return arguments.length ? (paddingInner = Math.min(1, _), rescale()) : paddingInner;
        }, scale.paddingOuter = function(_) {
            return arguments.length ? (paddingOuter = +_, rescale()) : paddingOuter;
        }, scale.align = function(_) {
            return arguments.length ? (align = Math.max(0, Math.min(1, _)), rescale()) : align;
        }, scale.copy = function() {
            return band(domain(), [
                r0,
                r1
            ]).round(round).paddingInner(paddingInner).paddingOuter(paddingOuter).align(align);
        }, initRange.apply(rescale(), arguments);
    }
    function number$2(x) {
        return +x;
    }
    var unit = [
        0,
        1
    ];
    function identity$6(x) {
        return x;
    }
    function normalize(a, b) {
        var x;
        return (b -= a = +a) ? function(x) {
            return (x - a) / b;
        } : (x = isNaN(b) ? NaN : 0.5, function() {
            return x;
        });
    }
    // normalize(a, b)(x) takes a domain value x in [a,b] and returns the corresponding parameter t in [0,1].
    // interpolate(a, b)(t) takes a parameter t in [0,1] and returns the corresponding range value x in [a,b].
    function bimap(domain, range, interpolate) {
        var d0 = domain[0], d1 = domain[1], r0 = range[0], r1 = range[1];
        return d1 < d0 ? (d0 = normalize(d1, d0), r0 = interpolate(r1, r0)) : (d0 = normalize(d0, d1), r0 = interpolate(r0, r1)), function(x) {
            return r0(d0(x));
        };
    }
    function polymap(domain, range, interpolate) {
        var j = Math.min(domain.length, range.length) - 1, d = Array(j), r = Array(j), i = -1;
        for(domain[j] < domain[0] && (domain = domain.slice().reverse(), range = range.slice().reverse()); ++i < j;)d[i] = normalize(domain[i], domain[i + 1]), r[i] = interpolate(range[i], range[i + 1]);
        return function(x) {
            var i = bisectRight(domain, x, 1, j) - 1;
            return r[i](d[i](x));
        };
    }
    function copy(source, target) {
        return target.domain(source.domain()).range(source.range()).interpolate(source.interpolate()).clamp(source.clamp()).unknown(source.unknown());
    }
    function transformer$1() {
        var transform, untransform, unknown, piecewise, output, input, domain = unit, range = unit, interpolate$1 = interpolate, clamp = identity$6;
        function rescale() {
            var a, b, t, n = Math.min(domain.length, range.length);
            return clamp !== identity$6 && (a = domain[0], b = domain[n - 1], a > b && (t = a, a = b, b = t), clamp = function(x) {
                return Math.max(a, Math.min(b, x));
            }), piecewise = n > 2 ? polymap : bimap, output = input = null, scale;
        }
        function scale(x) {
            return isNaN(x = +x) ? unknown : (output || (output = piecewise(domain.map(transform), range, interpolate$1)))(transform(clamp(x)));
        }
        return scale.invert = function(y) {
            return clamp(untransform((input || (input = piecewise(range, domain.map(transform), interpolateNumber)))(y)));
        }, scale.domain = function(_) {
            return arguments.length ? (domain = Array.from(_, number$2), rescale()) : domain.slice();
        }, scale.range = function(_) {
            return arguments.length ? (range = Array.from(_), rescale()) : range.slice();
        }, scale.rangeRound = function(_) {
            return range = Array.from(_), interpolate$1 = interpolateRound, rescale();
        }, scale.clamp = function(_) {
            return arguments.length ? (clamp = !!_ || identity$6, rescale()) : clamp !== identity$6;
        }, scale.interpolate = function(_) {
            return arguments.length ? (interpolate$1 = _, rescale()) : interpolate$1;
        }, scale.unknown = function(_) {
            return arguments.length ? (unknown = _, scale) : unknown;
        }, function(t, u) {
            return transform = t, untransform = u, rescale();
        };
    }
    function continuous() {
        return transformer$1()(identity$6, identity$6);
    }
    function tickFormat(start, stop, count, specifier) {
        var precision, step = tickStep(start, stop, count);
        switch((specifier = formatSpecifier(null == specifier ? ",f" : specifier)).type){
            case "s":
                var value = Math.max(Math.abs(start), Math.abs(stop));
                return null != specifier.precision || isNaN(precision = precisionPrefix(step, value)) || (specifier.precision = precision), exports1.formatPrefix(specifier, value);
            case "":
            case "e":
            case "g":
            case "p":
            case "r":
                null != specifier.precision || isNaN(precision = precisionRound(step, Math.max(Math.abs(start), Math.abs(stop)))) || (specifier.precision = precision - ("e" === specifier.type));
                break;
            case "f":
            case "%":
                null != specifier.precision || isNaN(precision = precisionFixed(step)) || (specifier.precision = precision - ("%" === specifier.type) * 2);
        }
        return exports1.format(specifier);
    }
    function linearish(scale) {
        var domain = scale.domain;
        return scale.ticks = function(count) {
            var d = domain();
            return ticks(d[0], d[d.length - 1], null == count ? 10 : count);
        }, scale.tickFormat = function(count, specifier) {
            var d = domain();
            return tickFormat(d[0], d[d.length - 1], null == count ? 10 : count, specifier);
        }, scale.nice = function(count) {
            null == count && (count = 10);
            var prestep, step, d = domain(), i0 = 0, i1 = d.length - 1, start = d[i0], stop = d[i1], maxIter = 10;
            for(stop < start && (step = start, start = stop, stop = step, step = i0, i0 = i1, i1 = step); maxIter-- > 0;){
                if ((step = tickIncrement(start, stop, count)) === prestep) return d[i0] = start, d[i1] = stop, domain(d);
                if (step > 0) start = Math.floor(start / step) * step, stop = Math.ceil(stop / step) * step;
                else if (step < 0) start = Math.ceil(start * step) / step, stop = Math.floor(stop * step) / step;
                else break;
                prestep = step;
            }
            return scale;
        }, scale;
    }
    function nice$1(domain, interval) {
        domain = domain.slice();
        var t, i0 = 0, i1 = domain.length - 1, x0 = domain[i0], x1 = domain[i1];
        return x1 < x0 && (t = i0, i0 = i1, i1 = t, t = x0, x0 = x1, x1 = t), domain[i0] = interval.floor(x0), domain[i1] = interval.ceil(x1), domain;
    }
    function transformLog(x) {
        return Math.log(x);
    }
    function transformExp(x) {
        return Math.exp(x);
    }
    function transformLogn(x) {
        return -Math.log(-x);
    }
    function transformExpn(x) {
        return -Math.exp(-x);
    }
    function pow10(x) {
        return isFinite(x) ? +("1e" + x) : x < 0 ? 0 : x;
    }
    function reflect(f) {
        return function(x) {
            return -f(-x);
        };
    }
    function loggish(transform) {
        var logs, pows, scale = transform(transformLog, transformExp), domain = scale.domain, base = 10;
        function rescale() {
            var base1, base2;
            return logs = (base1 = base) === Math.E ? Math.log : 10 === base1 && Math.log10 || 2 === base1 && Math.log2 || (base1 = Math.log(base1), function(x) {
                return Math.log(x) / base1;
            }), pows = 10 === (base2 = base) ? pow10 : base2 === Math.E ? Math.exp : function(x) {
                return Math.pow(base2, x);
            }, domain()[0] < 0 ? (logs = reflect(logs), pows = reflect(pows), transform(transformLogn, transformExpn)) : transform(transformLog, transformExp), scale;
        }
        return scale.base = function(_) {
            return arguments.length ? (base = +_, rescale()) : base;
        }, scale.domain = function(_) {
            return arguments.length ? (domain(_), rescale()) : domain();
        }, scale.ticks = function(count) {
            var r, d = domain(), u = d[0], v = d[d.length - 1];
            (r = v < u) && (i = u, u = v, v = i);
            var p, k, t, i = logs(u), j = logs(v), n = null == count ? 10 : +count, z = [];
            if (!(base % 1) && j - i < n) {
                if (i = Math.floor(i), j = Math.ceil(j), u > 0) {
                    for(; i <= j; ++i)for(k = 1, p = pows(i); k < base; ++k)if (!((t = p * k) < u)) {
                        if (t > v) break;
                        z.push(t);
                    }
                } else for(; i <= j; ++i)for(k = base - 1, p = pows(i); k >= 1; --k)if (!((t = p * k) < u)) {
                    if (t > v) break;
                    z.push(t);
                }
                2 * z.length < n && (z = ticks(u, v, n));
            } else z = ticks(i, j, Math.min(j - i, n)).map(pows);
            return r ? z.reverse() : z;
        }, scale.tickFormat = function(count, specifier) {
            if (null == specifier && (specifier = 10 === base ? ".0e" : ","), "function" != typeof specifier && (specifier = exports1.format(specifier)), count === 1 / 0) return specifier;
            null == count && (count = 10);
            var k = Math.max(1, base * count / scale.ticks().length); // TODO fast estimate?
            return function(d) {
                var i = d / pows(Math.round(logs(d)));
                return i * base < base - 0.5 && (i *= base), i <= k ? specifier(d) : "";
            };
        }, scale.nice = function() {
            return domain(nice$1(domain(), {
                floor: function(x) {
                    return pows(Math.floor(logs(x)));
                },
                ceil: function(x) {
                    return pows(Math.ceil(logs(x)));
                }
            }));
        }, scale;
    }
    function transformSymlog(c) {
        return function(x) {
            return Math.sign(x) * Math.log1p(Math.abs(x / c));
        };
    }
    function transformSymexp(c) {
        return function(x) {
            return Math.sign(x) * Math.expm1(Math.abs(x)) * c;
        };
    }
    function symlogish(transform) {
        var c = 1, scale = transform(transformSymlog(1), transformSymexp(c));
        return scale.constant = function(_) {
            return arguments.length ? transform(transformSymlog(c = +_), transformSymexp(c)) : c;
        }, linearish(scale);
    }
    function transformPow(exponent) {
        return function(x) {
            return x < 0 ? -Math.pow(-x, exponent) : Math.pow(x, exponent);
        };
    }
    function transformSqrt(x) {
        return x < 0 ? -Math.sqrt(-x) : Math.sqrt(x);
    }
    function transformSquare(x) {
        return x < 0 ? -x * x : x * x;
    }
    function powish(transform) {
        var scale = transform(identity$6, identity$6), exponent = 1;
        return scale.exponent = function(_) {
            return arguments.length ? 1 == (exponent = +_) ? transform(identity$6, identity$6) : 0.5 === exponent ? transform(transformSqrt, transformSquare) : transform(transformPow(exponent), transformPow(1 / exponent)) : exponent;
        }, linearish(scale);
    }
    function pow$2() {
        var scale = powish(transformer$1());
        return scale.copy = function() {
            return copy(scale, pow$2()).exponent(scale.exponent());
        }, initRange.apply(scale, arguments), scale;
    }
    function square(x) {
        return Math.sign(x) * x * x;
    }
    var t0$1 = new Date, t1$1 = new Date;
    function newInterval(floori, offseti, count, field) {
        function interval(date) {
            return floori(date = 0 == arguments.length ? new Date : new Date(+date)), date;
        }
        return interval.floor = function(date) {
            return floori(date = new Date(+date)), date;
        }, interval.ceil = function(date) {
            return floori(date = new Date(date - 1)), offseti(date, 1), floori(date), date;
        }, interval.round = function(date) {
            var d0 = interval(date), d1 = interval.ceil(date);
            return date - d0 < d1 - date ? d0 : d1;
        }, interval.offset = function(date, step) {
            return offseti(date = new Date(+date), null == step ? 1 : Math.floor(step)), date;
        }, interval.range = function(start, stop, step) {
            var previous, range = [];
            if (start = interval.ceil(start), step = null == step ? 1 : Math.floor(step), !(start < stop) || !(step > 0)) return range; // also handles Invalid Date
            do range.push(previous = new Date(+start)), offseti(start, step), floori(start);
            while (previous < start && start < stop)
            return range;
        }, interval.filter = function(test) {
            return newInterval(function(date) {
                if (date >= date) for(; floori(date), !test(date);)date.setTime(date - 1);
            }, function(date, step) {
                if (date >= date) {
                    if (step < 0) for(; ++step <= 0;)for(; offseti(date, -1), !test(date););
                     // eslint-disable-line no-empty
                    else for(; --step >= 0;)for(; offseti(date, 1), !test(date););
                     // eslint-disable-line no-empty
                }
            });
        }, count && (interval.count = function(start, end) {
            return t0$1.setTime(+start), t1$1.setTime(+end), floori(t0$1), floori(t1$1), Math.floor(count(t0$1, t1$1));
        }, interval.every = function(step) {
            return isFinite(step = Math.floor(step)) && step > 0 ? step > 1 ? interval.filter(field ? function(d) {
                return field(d) % step == 0;
            } : function(d) {
                return interval.count(0, d) % step == 0;
            }) : interval : null;
        }), interval;
    }
    var millisecond = newInterval(function() {
    // noop
    }, function(date, step) {
        date.setTime(+date + step);
    }, function(start, end) {
        return end - start;
    });
    // An optimized implementation for this simple case.
    millisecond.every = function(k) {
        return isFinite(k = Math.floor(k)) && k > 0 ? k > 1 ? newInterval(function(date) {
            date.setTime(Math.floor(date / k) * k);
        }, function(date, step) {
            date.setTime(+date + step * k);
        }, function(start, end) {
            return (end - start) / k;
        }) : millisecond : null;
    };
    var milliseconds = millisecond.range, second = newInterval(function(date) {
        date.setTime(date - date.getMilliseconds());
    }, function(date, step) {
        date.setTime(+date + 1e3 * step);
    }, function(start, end) {
        return (end - start) / 1e3;
    }, function(date) {
        return date.getUTCSeconds();
    }), seconds = second.range, minute = newInterval(function(date) {
        date.setTime(date - date.getMilliseconds() - 1e3 * date.getSeconds());
    }, function(date, step) {
        date.setTime(+date + 6e4 * step);
    }, function(start, end) {
        return (end - start) / 6e4;
    }, function(date) {
        return date.getMinutes();
    }), minutes = minute.range, hour = newInterval(function(date) {
        date.setTime(date - date.getMilliseconds() - 1e3 * date.getSeconds() - 6e4 * date.getMinutes());
    }, function(date, step) {
        date.setTime(+date + 36e5 * step);
    }, function(start, end) {
        return (end - start) / 36e5;
    }, function(date) {
        return date.getHours();
    }), hours = hour.range, day = newInterval((date)=>date.setHours(0, 0, 0, 0), (date, step)=>date.setDate(date.getDate() + step), (start, end)=>(end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * 6e4) / 864e5, (date)=>date.getDate() - 1), days = day.range;
    function weekday(i) {
        return newInterval(function(date) {
            date.setDate(date.getDate() - (date.getDay() + 7 - i) % 7), date.setHours(0, 0, 0, 0);
        }, function(date, step) {
            date.setDate(date.getDate() + 7 * step);
        }, function(start, end) {
            return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * 6e4) / 6048e5;
        });
    }
    var sunday = weekday(0), monday = weekday(1), tuesday = weekday(2), wednesday = weekday(3), thursday = weekday(4), friday = weekday(5), saturday = weekday(6), sundays = sunday.range, mondays = monday.range, tuesdays = tuesday.range, wednesdays = wednesday.range, thursdays = thursday.range, fridays = friday.range, saturdays = saturday.range, month = newInterval(function(date) {
        date.setDate(1), date.setHours(0, 0, 0, 0);
    }, function(date, step) {
        date.setMonth(date.getMonth() + step);
    }, function(start, end) {
        return end.getMonth() - start.getMonth() + (end.getFullYear() - start.getFullYear()) * 12;
    }, function(date) {
        return date.getMonth();
    }), months = month.range, year = newInterval(function(date) {
        date.setMonth(0, 1), date.setHours(0, 0, 0, 0);
    }, function(date, step) {
        date.setFullYear(date.getFullYear() + step);
    }, function(start, end) {
        return end.getFullYear() - start.getFullYear();
    }, function(date) {
        return date.getFullYear();
    });
    // An optimized implementation for this simple case.
    year.every = function(k) {
        return isFinite(k = Math.floor(k)) && k > 0 ? newInterval(function(date) {
            date.setFullYear(Math.floor(date.getFullYear() / k) * k), date.setMonth(0, 1), date.setHours(0, 0, 0, 0);
        }, function(date, step) {
            date.setFullYear(date.getFullYear() + step * k);
        }) : null;
    };
    var years = year.range, utcMinute = newInterval(function(date) {
        date.setUTCSeconds(0, 0);
    }, function(date, step) {
        date.setTime(+date + 6e4 * step);
    }, function(start, end) {
        return (end - start) / 6e4;
    }, function(date) {
        return date.getUTCMinutes();
    }), utcMinutes = utcMinute.range, utcHour = newInterval(function(date) {
        date.setUTCMinutes(0, 0, 0);
    }, function(date, step) {
        date.setTime(+date + 36e5 * step);
    }, function(start, end) {
        return (end - start) / 36e5;
    }, function(date) {
        return date.getUTCHours();
    }), utcHours = utcHour.range, utcDay = newInterval(function(date) {
        date.setUTCHours(0, 0, 0, 0);
    }, function(date, step) {
        date.setUTCDate(date.getUTCDate() + step);
    }, function(start, end) {
        return (end - start) / 864e5;
    }, function(date) {
        return date.getUTCDate() - 1;
    }), utcDays = utcDay.range;
    function utcWeekday(i) {
        return newInterval(function(date) {
            date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 7 - i) % 7), date.setUTCHours(0, 0, 0, 0);
        }, function(date, step) {
            date.setUTCDate(date.getUTCDate() + 7 * step);
        }, function(start, end) {
            return (end - start) / 6048e5;
        });
    }
    var utcSunday = utcWeekday(0), utcMonday = utcWeekday(1), utcTuesday = utcWeekday(2), utcWednesday = utcWeekday(3), utcThursday = utcWeekday(4), utcFriday = utcWeekday(5), utcSaturday = utcWeekday(6), utcSundays = utcSunday.range, utcMondays = utcMonday.range, utcTuesdays = utcTuesday.range, utcWednesdays = utcWednesday.range, utcThursdays = utcThursday.range, utcFridays = utcFriday.range, utcSaturdays = utcSaturday.range, utcMonth = newInterval(function(date) {
        date.setUTCDate(1), date.setUTCHours(0, 0, 0, 0);
    }, function(date, step) {
        date.setUTCMonth(date.getUTCMonth() + step);
    }, function(start, end) {
        return end.getUTCMonth() - start.getUTCMonth() + (end.getUTCFullYear() - start.getUTCFullYear()) * 12;
    }, function(date) {
        return date.getUTCMonth();
    }), utcMonths = utcMonth.range, utcYear = newInterval(function(date) {
        date.setUTCMonth(0, 1), date.setUTCHours(0, 0, 0, 0);
    }, function(date, step) {
        date.setUTCFullYear(date.getUTCFullYear() + step);
    }, function(start, end) {
        return end.getUTCFullYear() - start.getUTCFullYear();
    }, function(date) {
        return date.getUTCFullYear();
    });
    // An optimized implementation for this simple case.
    utcYear.every = function(k) {
        return isFinite(k = Math.floor(k)) && k > 0 ? newInterval(function(date) {
            date.setUTCFullYear(Math.floor(date.getUTCFullYear() / k) * k), date.setUTCMonth(0, 1), date.setUTCHours(0, 0, 0, 0);
        }, function(date, step) {
            date.setUTCFullYear(date.getUTCFullYear() + step * k);
        }) : null;
    };
    var utcYears = utcYear.range;
    function localDate(d) {
        if (0 <= d.y && d.y < 100) {
            var date = new Date(-1, d.m, d.d, d.H, d.M, d.S, d.L);
            return date.setFullYear(d.y), date;
        }
        return new Date(d.y, d.m, d.d, d.H, d.M, d.S, d.L);
    }
    function utcDate(d) {
        if (0 <= d.y && d.y < 100) {
            var date = new Date(Date.UTC(-1, d.m, d.d, d.H, d.M, d.S, d.L));
            return date.setUTCFullYear(d.y), date;
        }
        return new Date(Date.UTC(d.y, d.m, d.d, d.H, d.M, d.S, d.L));
    }
    function newDate(y, m, d) {
        return {
            y: y,
            m: m,
            d: d,
            H: 0,
            M: 0,
            S: 0,
            L: 0
        };
    }
    function formatLocale$1(locale) {
        var locale_dateTime = locale.dateTime, locale_date = locale.date, locale_time = locale.time, locale_periods = locale.periods, locale_weekdays = locale.days, locale_shortWeekdays = locale.shortDays, locale_months = locale.months, locale_shortMonths = locale.shortMonths, periodRe = formatRe(locale_periods), periodLookup = formatLookup(locale_periods), weekdayRe = formatRe(locale_weekdays), weekdayLookup = formatLookup(locale_weekdays), shortWeekdayRe = formatRe(locale_shortWeekdays), shortWeekdayLookup = formatLookup(locale_shortWeekdays), monthRe = formatRe(locale_months), monthLookup = formatLookup(locale_months), shortMonthRe = formatRe(locale_shortMonths), shortMonthLookup = formatLookup(locale_shortMonths), formats = {
            a: function(d) {
                return locale_shortWeekdays[d.getDay()];
            },
            A: function(d) {
                return locale_weekdays[d.getDay()];
            },
            b: function(d) {
                return locale_shortMonths[d.getMonth()];
            },
            B: function(d) {
                return locale_months[d.getMonth()];
            },
            c: null,
            d: formatDayOfMonth,
            e: formatDayOfMonth,
            f: formatMicroseconds,
            g: formatYearISO,
            G: formatFullYearISO,
            H: formatHour24,
            I: formatHour12,
            j: formatDayOfYear,
            L: formatMilliseconds,
            m: formatMonthNumber,
            M: formatMinutes,
            p: function(d) {
                return locale_periods[+(d.getHours() >= 12)];
            },
            q: function(d) {
                return 1 + ~~(d.getMonth() / 3);
            },
            Q: formatUnixTimestamp,
            s: formatUnixTimestampSeconds,
            S: formatSeconds,
            u: formatWeekdayNumberMonday,
            U: formatWeekNumberSunday,
            V: formatWeekNumberISO,
            w: formatWeekdayNumberSunday,
            W: formatWeekNumberMonday,
            x: null,
            X: null,
            y: formatYear$1,
            Y: formatFullYear,
            Z: formatZone,
            "%": formatLiteralPercent
        }, utcFormats = {
            a: function(d) {
                return locale_shortWeekdays[d.getUTCDay()];
            },
            A: function(d) {
                return locale_weekdays[d.getUTCDay()];
            },
            b: function(d) {
                return locale_shortMonths[d.getUTCMonth()];
            },
            B: function(d) {
                return locale_months[d.getUTCMonth()];
            },
            c: null,
            d: formatUTCDayOfMonth,
            e: formatUTCDayOfMonth,
            f: formatUTCMicroseconds,
            g: formatUTCYearISO,
            G: formatUTCFullYearISO,
            H: formatUTCHour24,
            I: formatUTCHour12,
            j: formatUTCDayOfYear,
            L: formatUTCMilliseconds,
            m: formatUTCMonthNumber,
            M: formatUTCMinutes,
            p: function(d) {
                return locale_periods[+(d.getUTCHours() >= 12)];
            },
            q: function(d) {
                return 1 + ~~(d.getUTCMonth() / 3);
            },
            Q: formatUnixTimestamp,
            s: formatUnixTimestampSeconds,
            S: formatUTCSeconds,
            u: formatUTCWeekdayNumberMonday,
            U: formatUTCWeekNumberSunday,
            V: formatUTCWeekNumberISO,
            w: formatUTCWeekdayNumberSunday,
            W: formatUTCWeekNumberMonday,
            x: null,
            X: null,
            y: formatUTCYear,
            Y: formatUTCFullYear,
            Z: formatUTCZone,
            "%": formatLiteralPercent
        }, parses = {
            a: function(d, string, i) {
                var n = shortWeekdayRe.exec(string.slice(i));
                return n ? (d.w = shortWeekdayLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
            },
            A: function(d, string, i) {
                var n = weekdayRe.exec(string.slice(i));
                return n ? (d.w = weekdayLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
            },
            b: function(d, string, i) {
                var n = shortMonthRe.exec(string.slice(i));
                return n ? (d.m = shortMonthLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
            },
            B: function(d, string, i) {
                var n = monthRe.exec(string.slice(i));
                return n ? (d.m = monthLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
            },
            c: function(d, string, i) {
                return parseSpecifier(d, locale_dateTime, string, i);
            },
            d: parseDayOfMonth,
            e: parseDayOfMonth,
            f: parseMicroseconds,
            g: parseYear,
            G: parseFullYear,
            H: parseHour24,
            I: parseHour24,
            j: parseDayOfYear,
            L: parseMilliseconds,
            m: parseMonthNumber,
            M: parseMinutes,
            p: function(d, string, i) {
                var n = periodRe.exec(string.slice(i));
                return n ? (d.p = periodLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
            },
            q: parseQuarter,
            Q: parseUnixTimestamp,
            s: parseUnixTimestampSeconds,
            S: parseSeconds,
            u: parseWeekdayNumberMonday,
            U: parseWeekNumberSunday,
            V: parseWeekNumberISO,
            w: parseWeekdayNumberSunday,
            W: parseWeekNumberMonday,
            x: function(d, string, i) {
                return parseSpecifier(d, locale_date, string, i);
            },
            X: function(d, string, i) {
                return parseSpecifier(d, locale_time, string, i);
            },
            y: parseYear,
            Y: parseFullYear,
            Z: parseZone,
            "%": parseLiteralPercent
        };
        function newFormat(specifier, formats) {
            return function(date) {
                var c, pad, format, string = [], i = -1, j = 0, n = specifier.length;
                for(date instanceof Date || (date = new Date(+date)); ++i < n;)37 === specifier.charCodeAt(i) && (string.push(specifier.slice(j, i)), null != (pad = pads[c = specifier.charAt(++i)]) ? c = specifier.charAt(++i) : pad = "e" === c ? " " : "0", (format = formats[c]) && (c = format(date, pad)), string.push(c), j = i + 1);
                return string.push(specifier.slice(j, i)), string.join("");
            };
        }
        function newParse(specifier, Z) {
            return function(string) {
                var week, day$1, d = newDate(1900, void 0, 1);
                if (parseSpecifier(d, specifier, string += "", 0) != string.length) return null;
                // If a UNIX timestamp is specified, return it.
                if ("Q" in d) return new Date(d.Q);
                if ("s" in d) return new Date(1000 * d.s + ("L" in d ? d.L : 0));
                // Convert day-of-week and week-of-year to day-of-year.
                if (!Z || "Z" in d || (d.Z = 0), "p" in d && (d.H = d.H % 12 + 12 * d.p), void 0 === d.m && (d.m = "q" in d ? d.q : 0), "V" in d) {
                    if (d.V < 1 || d.V > 53) return null;
                    "w" in d || (d.w = 1), "Z" in d ? (week = (day$1 = (week = utcDate(newDate(d.y, 0, 1))).getUTCDay()) > 4 || 0 === day$1 ? utcMonday.ceil(week) : utcMonday(week), week = utcDay.offset(week, (d.V - 1) * 7), d.y = week.getUTCFullYear(), d.m = week.getUTCMonth(), d.d = week.getUTCDate() + (d.w + 6) % 7) : (week = (day$1 = (week = localDate(newDate(d.y, 0, 1))).getDay()) > 4 || 0 === day$1 ? monday.ceil(week) : monday(week), week = day.offset(week, (d.V - 1) * 7), d.y = week.getFullYear(), d.m = week.getMonth(), d.d = week.getDate() + (d.w + 6) % 7);
                } else ("W" in d || "U" in d) && ("w" in d || (d.w = "u" in d ? d.u % 7 : "W" in d ? 1 : 0), day$1 = "Z" in d ? utcDate(newDate(d.y, 0, 1)).getUTCDay() : localDate(newDate(d.y, 0, 1)).getDay(), d.m = 0, d.d = "W" in d ? (d.w + 6) % 7 + 7 * d.W - (day$1 + 5) % 7 : d.w + 7 * d.U - (day$1 + 6) % 7);
                return(// If a time zone is specified, all fields are interpreted as UTC and then
                // offset according to the specified time zone.
                "Z" in d ? (d.H += d.Z / 100 | 0, d.M += d.Z % 100, utcDate(d)) : localDate(d));
            };
        }
        function parseSpecifier(d, specifier, string, j) {
            for(var c, parse, i = 0, n = specifier.length, m = string.length; i < n;){
                if (j >= m) return -1;
                if (37 === (c = specifier.charCodeAt(i++))) {
                    if (!(parse = parses[(c = specifier.charAt(i++)) in pads ? specifier.charAt(i++) : c]) || (j = parse(d, string, j)) < 0) return -1;
                } else if (c != string.charCodeAt(j++)) return -1;
            }
            return j;
        }
        return(// These recursive directive definitions must be deferred.
        formats.x = newFormat(locale_date, formats), formats.X = newFormat(locale_time, formats), formats.c = newFormat(locale_dateTime, formats), utcFormats.x = newFormat(locale_date, utcFormats), utcFormats.X = newFormat(locale_time, utcFormats), utcFormats.c = newFormat(locale_dateTime, utcFormats), {
            format: function(specifier) {
                var f = newFormat(specifier += "", formats);
                return f.toString = function() {
                    return specifier;
                }, f;
            },
            parse: function(specifier) {
                var p = newParse(specifier += "", !1);
                return p.toString = function() {
                    return specifier;
                }, p;
            },
            utcFormat: function(specifier) {
                var f = newFormat(specifier += "", utcFormats);
                return f.toString = function() {
                    return specifier;
                }, f;
            },
            utcParse: function(specifier) {
                var p = newParse(specifier += "", !0);
                return p.toString = function() {
                    return specifier;
                }, p;
            }
        });
    }
    var pads = {
        "-": "",
        _: " ",
        0: "0"
    }, numberRe = /^\s*\d+/, percentRe = /^%/, requoteRe = /[\\^$*+?|[\]().{}]/g;
    function pad$1(value, fill, width) {
        var sign = value < 0 ? "-" : "", string = (sign ? -value : value) + "", length = string.length;
        return sign + (length < width ? Array(width - length + 1).join(fill) + string : string);
    }
    function requote(s) {
        return s.replace(requoteRe, "\\$&");
    }
    function formatRe(names) {
        return RegExp("^(?:" + names.map(requote).join("|") + ")", "i");
    }
    function formatLookup(names) {
        return new Map(names.map((name, i)=>[
                name.toLowerCase(),
                i
            ]));
    }
    function parseWeekdayNumberSunday(d, string, i) {
        var n = numberRe.exec(string.slice(i, i + 1));
        return n ? (d.w = +n[0], i + n[0].length) : -1;
    }
    function parseWeekdayNumberMonday(d, string, i) {
        var n = numberRe.exec(string.slice(i, i + 1));
        return n ? (d.u = +n[0], i + n[0].length) : -1;
    }
    function parseWeekNumberSunday(d, string, i) {
        var n = numberRe.exec(string.slice(i, i + 2));
        return n ? (d.U = +n[0], i + n[0].length) : -1;
    }
    function parseWeekNumberISO(d, string, i) {
        var n = numberRe.exec(string.slice(i, i + 2));
        return n ? (d.V = +n[0], i + n[0].length) : -1;
    }
    function parseWeekNumberMonday(d, string, i) {
        var n = numberRe.exec(string.slice(i, i + 2));
        return n ? (d.W = +n[0], i + n[0].length) : -1;
    }
    function parseFullYear(d, string, i) {
        var n = numberRe.exec(string.slice(i, i + 4));
        return n ? (d.y = +n[0], i + n[0].length) : -1;
    }
    function parseYear(d, string, i) {
        var n = numberRe.exec(string.slice(i, i + 2));
        return n ? (d.y = +n[0] + (+n[0] > 68 ? 1900 : 2000), i + n[0].length) : -1;
    }
    function parseZone(d, string, i) {
        var n = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(string.slice(i, i + 6));
        return n ? (d.Z = n[1] ? 0 : -(n[2] + (n[3] || "00")), i + n[0].length) : -1;
    }
    function parseQuarter(d, string, i) {
        var n = numberRe.exec(string.slice(i, i + 1));
        return n ? (d.q = 3 * n[0] - 3, i + n[0].length) : -1;
    }
    function parseMonthNumber(d, string, i) {
        var n = numberRe.exec(string.slice(i, i + 2));
        return n ? (d.m = n[0] - 1, i + n[0].length) : -1;
    }
    function parseDayOfMonth(d, string, i) {
        var n = numberRe.exec(string.slice(i, i + 2));
        return n ? (d.d = +n[0], i + n[0].length) : -1;
    }
    function parseDayOfYear(d, string, i) {
        var n = numberRe.exec(string.slice(i, i + 3));
        return n ? (d.m = 0, d.d = +n[0], i + n[0].length) : -1;
    }
    function parseHour24(d, string, i) {
        var n = numberRe.exec(string.slice(i, i + 2));
        return n ? (d.H = +n[0], i + n[0].length) : -1;
    }
    function parseMinutes(d, string, i) {
        var n = numberRe.exec(string.slice(i, i + 2));
        return n ? (d.M = +n[0], i + n[0].length) : -1;
    }
    function parseSeconds(d, string, i) {
        var n = numberRe.exec(string.slice(i, i + 2));
        return n ? (d.S = +n[0], i + n[0].length) : -1;
    }
    function parseMilliseconds(d, string, i) {
        var n = numberRe.exec(string.slice(i, i + 3));
        return n ? (d.L = +n[0], i + n[0].length) : -1;
    }
    function parseMicroseconds(d, string, i) {
        var n = numberRe.exec(string.slice(i, i + 6));
        return n ? (d.L = Math.floor(n[0] / 1000), i + n[0].length) : -1;
    }
    function parseLiteralPercent(d, string, i) {
        var n = percentRe.exec(string.slice(i, i + 1));
        return n ? i + n[0].length : -1;
    }
    function parseUnixTimestamp(d, string, i) {
        var n = numberRe.exec(string.slice(i));
        return n ? (d.Q = +n[0], i + n[0].length) : -1;
    }
    function parseUnixTimestampSeconds(d, string, i) {
        var n = numberRe.exec(string.slice(i));
        return n ? (d.s = +n[0], i + n[0].length) : -1;
    }
    function formatDayOfMonth(d, p) {
        return pad$1(d.getDate(), p, 2);
    }
    function formatHour24(d, p) {
        return pad$1(d.getHours(), p, 2);
    }
    function formatHour12(d, p) {
        return pad$1(d.getHours() % 12 || 12, p, 2);
    }
    function formatDayOfYear(d, p) {
        return pad$1(1 + day.count(year(d), d), p, 3);
    }
    function formatMilliseconds(d, p) {
        return pad$1(d.getMilliseconds(), p, 3);
    }
    function formatMicroseconds(d, p) {
        return formatMilliseconds(d, p) + "000";
    }
    function formatMonthNumber(d, p) {
        return pad$1(d.getMonth() + 1, p, 2);
    }
    function formatMinutes(d, p) {
        return pad$1(d.getMinutes(), p, 2);
    }
    function formatSeconds(d, p) {
        return pad$1(d.getSeconds(), p, 2);
    }
    function formatWeekdayNumberMonday(d) {
        var day = d.getDay();
        return 0 === day ? 7 : day;
    }
    function formatWeekNumberSunday(d, p) {
        return pad$1(sunday.count(year(d) - 1, d), p, 2);
    }
    function dISO(d) {
        var day = d.getDay();
        return day >= 4 || 0 === day ? thursday(d) : thursday.ceil(d);
    }
    function formatWeekNumberISO(d, p) {
        return d = dISO(d), pad$1(thursday.count(year(d), d) + (4 === year(d).getDay()), p, 2);
    }
    function formatWeekdayNumberSunday(d) {
        return d.getDay();
    }
    function formatWeekNumberMonday(d, p) {
        return pad$1(monday.count(year(d) - 1, d), p, 2);
    }
    function formatYear$1(d, p) {
        return pad$1(d.getFullYear() % 100, p, 2);
    }
    function formatYearISO(d, p) {
        return pad$1((d = dISO(d)).getFullYear() % 100, p, 2);
    }
    function formatFullYear(d, p) {
        return pad$1(d.getFullYear() % 10000, p, 4);
    }
    function formatFullYearISO(d, p) {
        var day = d.getDay();
        return pad$1((d = day >= 4 || 0 === day ? thursday(d) : thursday.ceil(d)).getFullYear() % 10000, p, 4);
    }
    function formatZone(d) {
        var z = d.getTimezoneOffset();
        return (z > 0 ? "-" : (z *= -1, "+")) + pad$1(z / 60 | 0, "0", 2) + pad$1(z % 60, "0", 2);
    }
    function formatUTCDayOfMonth(d, p) {
        return pad$1(d.getUTCDate(), p, 2);
    }
    function formatUTCHour24(d, p) {
        return pad$1(d.getUTCHours(), p, 2);
    }
    function formatUTCHour12(d, p) {
        return pad$1(d.getUTCHours() % 12 || 12, p, 2);
    }
    function formatUTCDayOfYear(d, p) {
        return pad$1(1 + utcDay.count(utcYear(d), d), p, 3);
    }
    function formatUTCMilliseconds(d, p) {
        return pad$1(d.getUTCMilliseconds(), p, 3);
    }
    function formatUTCMicroseconds(d, p) {
        return formatUTCMilliseconds(d, p) + "000";
    }
    function formatUTCMonthNumber(d, p) {
        return pad$1(d.getUTCMonth() + 1, p, 2);
    }
    function formatUTCMinutes(d, p) {
        return pad$1(d.getUTCMinutes(), p, 2);
    }
    function formatUTCSeconds(d, p) {
        return pad$1(d.getUTCSeconds(), p, 2);
    }
    function formatUTCWeekdayNumberMonday(d) {
        var dow = d.getUTCDay();
        return 0 === dow ? 7 : dow;
    }
    function formatUTCWeekNumberSunday(d, p) {
        return pad$1(utcSunday.count(utcYear(d) - 1, d), p, 2);
    }
    function UTCdISO(d) {
        var day = d.getUTCDay();
        return day >= 4 || 0 === day ? utcThursday(d) : utcThursday.ceil(d);
    }
    function formatUTCWeekNumberISO(d, p) {
        return d = UTCdISO(d), pad$1(utcThursday.count(utcYear(d), d) + (4 === utcYear(d).getUTCDay()), p, 2);
    }
    function formatUTCWeekdayNumberSunday(d) {
        return d.getUTCDay();
    }
    function formatUTCWeekNumberMonday(d, p) {
        return pad$1(utcMonday.count(utcYear(d) - 1, d), p, 2);
    }
    function formatUTCYear(d, p) {
        return pad$1(d.getUTCFullYear() % 100, p, 2);
    }
    function formatUTCYearISO(d, p) {
        return pad$1((d = UTCdISO(d)).getUTCFullYear() % 100, p, 2);
    }
    function formatUTCFullYear(d, p) {
        return pad$1(d.getUTCFullYear() % 10000, p, 4);
    }
    function formatUTCFullYearISO(d, p) {
        var day = d.getUTCDay();
        return pad$1((d = day >= 4 || 0 === day ? utcThursday(d) : utcThursday.ceil(d)).getUTCFullYear() % 10000, p, 4);
    }
    function formatUTCZone() {
        return "+0000";
    }
    function formatLiteralPercent() {
        return "%";
    }
    function formatUnixTimestamp(d) {
        return +d;
    }
    function formatUnixTimestampSeconds(d) {
        return Math.floor(+d / 1000);
    }
    function defaultLocale$1(definition) {
        return locale$1 = formatLocale$1(definition), exports1.timeFormat = locale$1.format, exports1.timeParse = locale$1.parse, exports1.utcFormat = locale$1.utcFormat, exports1.utcParse = locale$1.utcParse, locale$1;
    }
    defaultLocale$1({
        dateTime: "%x, %X",
        date: "%-m/%-d/%Y",
        time: "%-I:%M:%S %p",
        periods: [
            "AM",
            "PM"
        ],
        days: [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
        ],
        shortDays: [
            "Sun",
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat"
        ],
        months: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ],
        shortMonths: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
        ]
    });
    var isoSpecifier = "%Y-%m-%dT%H:%M:%S.%LZ", formatIso = Date.prototype.toISOString ? function(date) {
        return date.toISOString();
    } : exports1.utcFormat(isoSpecifier), parseIso = +new Date("2000-01-01T00:00:00.000Z") ? function(string) {
        var date = new Date(string);
        return isNaN(date) ? null : date;
    } : exports1.utcParse(isoSpecifier);
    function date$1(t) {
        return new Date(t);
    }
    function number$3(t) {
        return t instanceof Date ? +t : +new Date(+t);
    }
    function calendar(year, month, week, day, hour, minute, second, millisecond, format) {
        var scale = continuous(), invert = scale.invert, domain = scale.domain, formatMillisecond = format(".%L"), formatSecond = format(":%S"), formatMinute = format("%I:%M"), formatHour = format("%I %p"), formatDay = format("%a %d"), formatWeek = format("%b %d"), formatMonth = format("%B"), formatYear = format("%Y"), tickIntervals = [
            [
                second,
                1,
                1000
            ],
            [
                second,
                5,
                5000
            ],
            [
                second,
                15,
                15000
            ],
            [
                second,
                30,
                30000
            ],
            [
                minute,
                1,
                60000
            ],
            [
                minute,
                5,
                300000
            ],
            [
                minute,
                15,
                900000
            ],
            [
                minute,
                30,
                1800000
            ],
            [
                hour,
                1,
                3600000
            ],
            [
                hour,
                3,
                10800000
            ],
            [
                hour,
                6,
                21600000
            ],
            [
                hour,
                12,
                43200000
            ],
            [
                day,
                1,
                86400000
            ],
            [
                day,
                2,
                172800000
            ],
            [
                week,
                1,
                604800000
            ],
            [
                month,
                1,
                2592000000
            ],
            [
                month,
                3,
                7776000000
            ],
            [
                year,
                1,
                31536000000
            ]
        ];
        function tickFormat(date) {
            return (second(date) < date ? formatMillisecond : minute(date) < date ? formatSecond : hour(date) < date ? formatMinute : day(date) < date ? formatHour : month(date) < date ? week(date) < date ? formatDay : formatWeek : year(date) < date ? formatMonth : formatYear)(date);
        }
        function tickInterval(interval, start, stop) {
            // If a desired tick count is specified, pick a reasonable tick interval
            // based on the extent of the domain and a rough estimate of tick size.
            // Otherwise, assume interval is already a time interval and use it.
            if (null == interval && (interval = 10), "number" == typeof interval) {
                var step, target = Math.abs(stop - start) / interval, i = bisector(function(i) {
                    return i[2];
                }).right(tickIntervals, target);
                return i === tickIntervals.length ? (step = tickStep(start / 31536000000, stop / 31536000000, interval), interval = year) : i ? (step = (i = tickIntervals[target / tickIntervals[i - 1][2] < tickIntervals[i][2] / target ? i - 1 : i])[1], interval = i[0]) : (step = Math.max(tickStep(start, stop, interval), 1), interval = millisecond), interval.every(step);
            }
            return interval;
        }
        return scale.invert = function(y) {
            return new Date(invert(y));
        }, scale.domain = function(_) {
            return arguments.length ? domain(Array.from(_, number$3)) : domain().map(date$1);
        }, scale.ticks = function(interval) {
            var t, d = domain(), t0 = d[0], t1 = d[d.length - 1], r = t1 < t0;
            return r && (t = t0, t0 = t1, t1 = t), t = (t = tickInterval(interval, t0, t1)) ? t.range(t0, t1 + 1) : [], r ? t.reverse() : t;
        }, scale.tickFormat = function(count, specifier) {
            return null == specifier ? tickFormat : format(specifier);
        }, scale.nice = function(interval) {
            var d = domain();
            return (interval = tickInterval(interval, d[0], d[d.length - 1])) ? domain(nice$1(d, interval)) : scale;
        }, scale.copy = function() {
            return copy(scale, calendar(year, month, week, day, hour, minute, second, millisecond, format));
        }, scale;
    }
    function transformer$2() {
        var t0, t1, k10, transform, unknown, x0 = 0, x1 = 1, interpolator = identity$6, clamp = !1;
        function scale(x) {
            return isNaN(x = +x) ? unknown : interpolator(0 === k10 ? 0.5 : (x = (transform(x) - t0) * k10, clamp ? Math.max(0, Math.min(1, x)) : x));
        }
        function range(interpolate) {
            return function(_) {
                var r0, r1;
                return arguments.length ? ([r0, r1] = _, interpolator = interpolate(r0, r1), scale) : [
                    interpolator(0),
                    interpolator(1)
                ];
            };
        }
        return scale.domain = function(_) {
            return arguments.length ? ([x0, x1] = _, t0 = transform(x0 = +x0), t1 = transform(x1 = +x1), k10 = t0 === t1 ? 0 : 1 / (t1 - t0), scale) : [
                x0,
                x1
            ];
        }, scale.clamp = function(_) {
            return arguments.length ? (clamp = !!_, scale) : clamp;
        }, scale.interpolator = function(_) {
            return arguments.length ? (interpolator = _, scale) : interpolator;
        }, scale.range = range(interpolate), scale.rangeRound = range(interpolateRound), scale.unknown = function(_) {
            return arguments.length ? (unknown = _, scale) : unknown;
        }, function(t) {
            return transform = t, t0 = t(x0), t1 = t(x1), k10 = t0 === t1 ? 0 : 1 / (t1 - t0), scale;
        };
    }
    function copy$1(source, target) {
        return target.domain(source.domain()).interpolator(source.interpolator()).clamp(source.clamp()).unknown(source.unknown());
    }
    function sequentialPow() {
        var scale = powish(transformer$2());
        return scale.copy = function() {
            return copy$1(scale, sequentialPow()).exponent(scale.exponent());
        }, initInterpolator.apply(scale, arguments);
    }
    function transformer$3() {
        var t0, t1, t2, k10, k21, transform, unknown, x0 = 0, x1 = 0.5, x2 = 1, s = 1, interpolator = identity$6, clamp = !1;
        function scale(x) {
            return isNaN(x = +x) ? unknown : (x = 0.5 + ((x = +transform(x)) - t1) * (s * x < s * t1 ? k10 : k21), interpolator(clamp ? Math.max(0, Math.min(1, x)) : x));
        }
        function range(interpolate) {
            return function(_) {
                var r0, r1, r2;
                return arguments.length ? ([r0, r1, r2] = _, interpolator = piecewise(interpolate, [
                    r0,
                    r1,
                    r2
                ]), scale) : [
                    interpolator(0),
                    interpolator(0.5),
                    interpolator(1)
                ];
            };
        }
        return scale.domain = function(_) {
            return arguments.length ? ([x0, x1, x2] = _, t0 = transform(x0 = +x0), t1 = transform(x1 = +x1), t2 = transform(x2 = +x2), k10 = t0 === t1 ? 0 : 0.5 / (t1 - t0), k21 = t1 === t2 ? 0 : 0.5 / (t2 - t1), s = t1 < t0 ? -1 : 1, scale) : [
                x0,
                x1,
                x2
            ];
        }, scale.clamp = function(_) {
            return arguments.length ? (clamp = !!_, scale) : clamp;
        }, scale.interpolator = function(_) {
            return arguments.length ? (interpolator = _, scale) : interpolator;
        }, scale.range = range(interpolate), scale.rangeRound = range(interpolateRound), scale.unknown = function(_) {
            return arguments.length ? (unknown = _, scale) : unknown;
        }, function(t) {
            return transform = t, t0 = t(x0), t1 = t(x1), t2 = t(x2), k10 = t0 === t1 ? 0 : 0.5 / (t1 - t0), k21 = t1 === t2 ? 0 : 0.5 / (t2 - t1), s = t1 < t0 ? -1 : 1, scale;
        };
    }
    function divergingPow() {
        var scale = powish(transformer$3());
        return scale.copy = function() {
            return copy$1(scale, divergingPow()).exponent(scale.exponent());
        }, initInterpolator.apply(scale, arguments);
    }
    function colors(specifier) {
        for(var n = specifier.length / 6 | 0, colors = Array(n), i = 0; i < n;)colors[i] = "#" + specifier.slice(6 * i, 6 * ++i);
        return colors;
    }
    var category10 = colors("1f77b4ff7f0e2ca02cd627289467bd8c564be377c27f7f7fbcbd2217becf"), Accent = colors("7fc97fbeaed4fdc086ffff99386cb0f0027fbf5b17666666"), Dark2 = colors("1b9e77d95f027570b3e7298a66a61ee6ab02a6761d666666"), Paired = colors("a6cee31f78b4b2df8a33a02cfb9a99e31a1cfdbf6fff7f00cab2d66a3d9affff99b15928"), Pastel1 = colors("fbb4aeb3cde3ccebc5decbe4fed9a6ffffcce5d8bdfddaecf2f2f2"), Pastel2 = colors("b3e2cdfdcdaccbd5e8f4cae4e6f5c9fff2aef1e2cccccccc"), Set1 = colors("e41a1c377eb84daf4a984ea3ff7f00ffff33a65628f781bf999999"), Set2 = colors("66c2a5fc8d628da0cbe78ac3a6d854ffd92fe5c494b3b3b3"), Set3 = colors("8dd3c7ffffb3bebadafb807280b1d3fdb462b3de69fccde5d9d9d9bc80bdccebc5ffed6f"), Tableau10 = colors("4e79a7f28e2ce1575976b7b259a14fedc949af7aa1ff9da79c755fbab0ab"), ramp = (scheme)=>rgbBasis(scheme[scheme.length - 1]), scheme = [
        ,
        ,
        , 
    ].concat("d8b365f5f5f55ab4ac", "a6611adfc27d80cdc1018571", "a6611adfc27df5f5f580cdc1018571", "8c510ad8b365f6e8c3c7eae55ab4ac01665e", "8c510ad8b365f6e8c3f5f5f5c7eae55ab4ac01665e", "8c510abf812ddfc27df6e8c3c7eae580cdc135978f01665e", "8c510abf812ddfc27df6e8c3f5f5f5c7eae580cdc135978f01665e", "5430058c510abf812ddfc27df6e8c3c7eae580cdc135978f01665e003c30", "5430058c510abf812ddfc27df6e8c3f5f5f5c7eae580cdc135978f01665e003c30").map(colors), BrBG = ramp(scheme), scheme$1 = [
        ,
        ,
        , 
    ].concat("af8dc3f7f7f77fbf7b", "7b3294c2a5cfa6dba0008837", "7b3294c2a5cff7f7f7a6dba0008837", "762a83af8dc3e7d4e8d9f0d37fbf7b1b7837", "762a83af8dc3e7d4e8f7f7f7d9f0d37fbf7b1b7837", "762a839970abc2a5cfe7d4e8d9f0d3a6dba05aae611b7837", "762a839970abc2a5cfe7d4e8f7f7f7d9f0d3a6dba05aae611b7837", "40004b762a839970abc2a5cfe7d4e8d9f0d3a6dba05aae611b783700441b", "40004b762a839970abc2a5cfe7d4e8f7f7f7d9f0d3a6dba05aae611b783700441b").map(colors), PRGn = ramp(scheme$1), scheme$2 = [
        ,
        ,
        , 
    ].concat("e9a3c9f7f7f7a1d76a", "d01c8bf1b6dab8e1864dac26", "d01c8bf1b6daf7f7f7b8e1864dac26", "c51b7de9a3c9fde0efe6f5d0a1d76a4d9221", "c51b7de9a3c9fde0eff7f7f7e6f5d0a1d76a4d9221", "c51b7dde77aef1b6dafde0efe6f5d0b8e1867fbc414d9221", "c51b7dde77aef1b6dafde0eff7f7f7e6f5d0b8e1867fbc414d9221", "8e0152c51b7dde77aef1b6dafde0efe6f5d0b8e1867fbc414d9221276419", "8e0152c51b7dde77aef1b6dafde0eff7f7f7e6f5d0b8e1867fbc414d9221276419").map(colors), PiYG = ramp(scheme$2), scheme$3 = [
        ,
        ,
        , 
    ].concat("998ec3f7f7f7f1a340", "5e3c99b2abd2fdb863e66101", "5e3c99b2abd2f7f7f7fdb863e66101", "542788998ec3d8daebfee0b6f1a340b35806", "542788998ec3d8daebf7f7f7fee0b6f1a340b35806", "5427888073acb2abd2d8daebfee0b6fdb863e08214b35806", "5427888073acb2abd2d8daebf7f7f7fee0b6fdb863e08214b35806", "2d004b5427888073acb2abd2d8daebfee0b6fdb863e08214b358067f3b08", "2d004b5427888073acb2abd2d8daebf7f7f7fee0b6fdb863e08214b358067f3b08").map(colors), PuOr = ramp(scheme$3), scheme$4 = [
        ,
        ,
        , 
    ].concat("ef8a62f7f7f767a9cf", "ca0020f4a58292c5de0571b0", "ca0020f4a582f7f7f792c5de0571b0", "b2182bef8a62fddbc7d1e5f067a9cf2166ac", "b2182bef8a62fddbc7f7f7f7d1e5f067a9cf2166ac", "b2182bd6604df4a582fddbc7d1e5f092c5de4393c32166ac", "b2182bd6604df4a582fddbc7f7f7f7d1e5f092c5de4393c32166ac", "67001fb2182bd6604df4a582fddbc7d1e5f092c5de4393c32166ac053061", "67001fb2182bd6604df4a582fddbc7f7f7f7d1e5f092c5de4393c32166ac053061").map(colors), RdBu = ramp(scheme$4), scheme$5 = [
        ,
        ,
        , 
    ].concat("ef8a62ffffff999999", "ca0020f4a582bababa404040", "ca0020f4a582ffffffbababa404040", "b2182bef8a62fddbc7e0e0e09999994d4d4d", "b2182bef8a62fddbc7ffffffe0e0e09999994d4d4d", "b2182bd6604df4a582fddbc7e0e0e0bababa8787874d4d4d", "b2182bd6604df4a582fddbc7ffffffe0e0e0bababa8787874d4d4d", "67001fb2182bd6604df4a582fddbc7e0e0e0bababa8787874d4d4d1a1a1a", "67001fb2182bd6604df4a582fddbc7ffffffe0e0e0bababa8787874d4d4d1a1a1a").map(colors), RdGy = ramp(scheme$5), scheme$6 = [
        ,
        ,
        , 
    ].concat("fc8d59ffffbf91bfdb", "d7191cfdae61abd9e92c7bb6", "d7191cfdae61ffffbfabd9e92c7bb6", "d73027fc8d59fee090e0f3f891bfdb4575b4", "d73027fc8d59fee090ffffbfe0f3f891bfdb4575b4", "d73027f46d43fdae61fee090e0f3f8abd9e974add14575b4", "d73027f46d43fdae61fee090ffffbfe0f3f8abd9e974add14575b4", "a50026d73027f46d43fdae61fee090e0f3f8abd9e974add14575b4313695", "a50026d73027f46d43fdae61fee090ffffbfe0f3f8abd9e974add14575b4313695").map(colors), RdYlBu = ramp(scheme$6), scheme$7 = [
        ,
        ,
        , 
    ].concat("fc8d59ffffbf91cf60", "d7191cfdae61a6d96a1a9641", "d7191cfdae61ffffbfa6d96a1a9641", "d73027fc8d59fee08bd9ef8b91cf601a9850", "d73027fc8d59fee08bffffbfd9ef8b91cf601a9850", "d73027f46d43fdae61fee08bd9ef8ba6d96a66bd631a9850", "d73027f46d43fdae61fee08bffffbfd9ef8ba6d96a66bd631a9850", "a50026d73027f46d43fdae61fee08bd9ef8ba6d96a66bd631a9850006837", "a50026d73027f46d43fdae61fee08bffffbfd9ef8ba6d96a66bd631a9850006837").map(colors), RdYlGn = ramp(scheme$7), scheme$8 = [
        ,
        ,
        , 
    ].concat("fc8d59ffffbf99d594", "d7191cfdae61abdda42b83ba", "d7191cfdae61ffffbfabdda42b83ba", "d53e4ffc8d59fee08be6f59899d5943288bd", "d53e4ffc8d59fee08bffffbfe6f59899d5943288bd", "d53e4ff46d43fdae61fee08be6f598abdda466c2a53288bd", "d53e4ff46d43fdae61fee08bffffbfe6f598abdda466c2a53288bd", "9e0142d53e4ff46d43fdae61fee08be6f598abdda466c2a53288bd5e4fa2", "9e0142d53e4ff46d43fdae61fee08bffffbfe6f598abdda466c2a53288bd5e4fa2").map(colors), Spectral = ramp(scheme$8), scheme$9 = [
        ,
        ,
        , 
    ].concat("e5f5f999d8c92ca25f", "edf8fbb2e2e266c2a4238b45", "edf8fbb2e2e266c2a42ca25f006d2c", "edf8fbccece699d8c966c2a42ca25f006d2c", "edf8fbccece699d8c966c2a441ae76238b45005824", "f7fcfde5f5f9ccece699d8c966c2a441ae76238b45005824", "f7fcfde5f5f9ccece699d8c966c2a441ae76238b45006d2c00441b").map(colors), BuGn = ramp(scheme$9), scheme$a = [
        ,
        ,
        , 
    ].concat("e0ecf49ebcda8856a7", "edf8fbb3cde38c96c688419d", "edf8fbb3cde38c96c68856a7810f7c", "edf8fbbfd3e69ebcda8c96c68856a7810f7c", "edf8fbbfd3e69ebcda8c96c68c6bb188419d6e016b", "f7fcfde0ecf4bfd3e69ebcda8c96c68c6bb188419d6e016b", "f7fcfde0ecf4bfd3e69ebcda8c96c68c6bb188419d810f7c4d004b").map(colors), BuPu = ramp(scheme$a), scheme$b = [
        ,
        ,
        , 
    ].concat("e0f3dba8ddb543a2ca", "f0f9e8bae4bc7bccc42b8cbe", "f0f9e8bae4bc7bccc443a2ca0868ac", "f0f9e8ccebc5a8ddb57bccc443a2ca0868ac", "f0f9e8ccebc5a8ddb57bccc44eb3d32b8cbe08589e", "f7fcf0e0f3dbccebc5a8ddb57bccc44eb3d32b8cbe08589e", "f7fcf0e0f3dbccebc5a8ddb57bccc44eb3d32b8cbe0868ac084081").map(colors), GnBu = ramp(scheme$b), scheme$c = [
        ,
        ,
        , 
    ].concat("fee8c8fdbb84e34a33", "fef0d9fdcc8afc8d59d7301f", "fef0d9fdcc8afc8d59e34a33b30000", "fef0d9fdd49efdbb84fc8d59e34a33b30000", "fef0d9fdd49efdbb84fc8d59ef6548d7301f990000", "fff7ecfee8c8fdd49efdbb84fc8d59ef6548d7301f990000", "fff7ecfee8c8fdd49efdbb84fc8d59ef6548d7301fb300007f0000").map(colors), OrRd = ramp(scheme$c), scheme$d = [
        ,
        ,
        , 
    ].concat("ece2f0a6bddb1c9099", "f6eff7bdc9e167a9cf02818a", "f6eff7bdc9e167a9cf1c9099016c59", "f6eff7d0d1e6a6bddb67a9cf1c9099016c59", "f6eff7d0d1e6a6bddb67a9cf3690c002818a016450", "fff7fbece2f0d0d1e6a6bddb67a9cf3690c002818a016450", "fff7fbece2f0d0d1e6a6bddb67a9cf3690c002818a016c59014636").map(colors), PuBuGn = ramp(scheme$d), scheme$e = [
        ,
        ,
        , 
    ].concat("ece7f2a6bddb2b8cbe", "f1eef6bdc9e174a9cf0570b0", "f1eef6bdc9e174a9cf2b8cbe045a8d", "f1eef6d0d1e6a6bddb74a9cf2b8cbe045a8d", "f1eef6d0d1e6a6bddb74a9cf3690c00570b0034e7b", "fff7fbece7f2d0d1e6a6bddb74a9cf3690c00570b0034e7b", "fff7fbece7f2d0d1e6a6bddb74a9cf3690c00570b0045a8d023858").map(colors), PuBu = ramp(scheme$e), scheme$f = [
        ,
        ,
        , 
    ].concat("e7e1efc994c7dd1c77", "f1eef6d7b5d8df65b0ce1256", "f1eef6d7b5d8df65b0dd1c77980043", "f1eef6d4b9dac994c7df65b0dd1c77980043", "f1eef6d4b9dac994c7df65b0e7298ace125691003f", "f7f4f9e7e1efd4b9dac994c7df65b0e7298ace125691003f", "f7f4f9e7e1efd4b9dac994c7df65b0e7298ace125698004367001f").map(colors), PuRd = ramp(scheme$f), scheme$g = [
        ,
        ,
        , 
    ].concat("fde0ddfa9fb5c51b8a", "feebe2fbb4b9f768a1ae017e", "feebe2fbb4b9f768a1c51b8a7a0177", "feebe2fcc5c0fa9fb5f768a1c51b8a7a0177", "feebe2fcc5c0fa9fb5f768a1dd3497ae017e7a0177", "fff7f3fde0ddfcc5c0fa9fb5f768a1dd3497ae017e7a0177", "fff7f3fde0ddfcc5c0fa9fb5f768a1dd3497ae017e7a017749006a").map(colors), RdPu = ramp(scheme$g), scheme$h = [
        ,
        ,
        , 
    ].concat("edf8b17fcdbb2c7fb8", "ffffcca1dab441b6c4225ea8", "ffffcca1dab441b6c42c7fb8253494", "ffffccc7e9b47fcdbb41b6c42c7fb8253494", "ffffccc7e9b47fcdbb41b6c41d91c0225ea80c2c84", "ffffd9edf8b1c7e9b47fcdbb41b6c41d91c0225ea80c2c84", "ffffd9edf8b1c7e9b47fcdbb41b6c41d91c0225ea8253494081d58").map(colors), YlGnBu = ramp(scheme$h), scheme$i = [
        ,
        ,
        , 
    ].concat("f7fcb9addd8e31a354", "ffffccc2e69978c679238443", "ffffccc2e69978c67931a354006837", "ffffccd9f0a3addd8e78c67931a354006837", "ffffccd9f0a3addd8e78c67941ab5d238443005a32", "ffffe5f7fcb9d9f0a3addd8e78c67941ab5d238443005a32", "ffffe5f7fcb9d9f0a3addd8e78c67941ab5d238443006837004529").map(colors), YlGn = ramp(scheme$i), scheme$j = [
        ,
        ,
        , 
    ].concat("fff7bcfec44fd95f0e", "ffffd4fed98efe9929cc4c02", "ffffd4fed98efe9929d95f0e993404", "ffffd4fee391fec44ffe9929d95f0e993404", "ffffd4fee391fec44ffe9929ec7014cc4c028c2d04", "ffffe5fff7bcfee391fec44ffe9929ec7014cc4c028c2d04", "ffffe5fff7bcfee391fec44ffe9929ec7014cc4c02993404662506").map(colors), YlOrBr = ramp(scheme$j), scheme$k = [
        ,
        ,
        , 
    ].concat("ffeda0feb24cf03b20", "ffffb2fecc5cfd8d3ce31a1c", "ffffb2fecc5cfd8d3cf03b20bd0026", "ffffb2fed976feb24cfd8d3cf03b20bd0026", "ffffb2fed976feb24cfd8d3cfc4e2ae31a1cb10026", "ffffccffeda0fed976feb24cfd8d3cfc4e2ae31a1cb10026", "ffffccffeda0fed976feb24cfd8d3cfc4e2ae31a1cbd0026800026").map(colors), YlOrRd = ramp(scheme$k), scheme$l = [
        ,
        ,
        , 
    ].concat("deebf79ecae13182bd", "eff3ffbdd7e76baed62171b5", "eff3ffbdd7e76baed63182bd08519c", "eff3ffc6dbef9ecae16baed63182bd08519c", "eff3ffc6dbef9ecae16baed64292c62171b5084594", "f7fbffdeebf7c6dbef9ecae16baed64292c62171b5084594", "f7fbffdeebf7c6dbef9ecae16baed64292c62171b508519c08306b").map(colors), Blues = ramp(scheme$l), scheme$m = [
        ,
        ,
        , 
    ].concat("e5f5e0a1d99b31a354", "edf8e9bae4b374c476238b45", "edf8e9bae4b374c47631a354006d2c", "edf8e9c7e9c0a1d99b74c47631a354006d2c", "edf8e9c7e9c0a1d99b74c47641ab5d238b45005a32", "f7fcf5e5f5e0c7e9c0a1d99b74c47641ab5d238b45005a32", "f7fcf5e5f5e0c7e9c0a1d99b74c47641ab5d238b45006d2c00441b").map(colors), Greens = ramp(scheme$m), scheme$n = [
        ,
        ,
        , 
    ].concat("f0f0f0bdbdbd636363", "f7f7f7cccccc969696525252", "f7f7f7cccccc969696636363252525", "f7f7f7d9d9d9bdbdbd969696636363252525", "f7f7f7d9d9d9bdbdbd969696737373525252252525", "fffffff0f0f0d9d9d9bdbdbd969696737373525252252525", "fffffff0f0f0d9d9d9bdbdbd969696737373525252252525000000").map(colors), Greys = ramp(scheme$n), scheme$o = [
        ,
        ,
        , 
    ].concat("efedf5bcbddc756bb1", "f2f0f7cbc9e29e9ac86a51a3", "f2f0f7cbc9e29e9ac8756bb154278f", "f2f0f7dadaebbcbddc9e9ac8756bb154278f", "f2f0f7dadaebbcbddc9e9ac8807dba6a51a34a1486", "fcfbfdefedf5dadaebbcbddc9e9ac8807dba6a51a34a1486", "fcfbfdefedf5dadaebbcbddc9e9ac8807dba6a51a354278f3f007d").map(colors), Purples = ramp(scheme$o), scheme$p = [
        ,
        ,
        , 
    ].concat("fee0d2fc9272de2d26", "fee5d9fcae91fb6a4acb181d", "fee5d9fcae91fb6a4ade2d26a50f15", "fee5d9fcbba1fc9272fb6a4ade2d26a50f15", "fee5d9fcbba1fc9272fb6a4aef3b2ccb181d99000d", "fff5f0fee0d2fcbba1fc9272fb6a4aef3b2ccb181d99000d", "fff5f0fee0d2fcbba1fc9272fb6a4aef3b2ccb181da50f1567000d").map(colors), Reds = ramp(scheme$p), scheme$q = [
        ,
        ,
        , 
    ].concat("fee6cefdae6be6550d", "feeddefdbe85fd8d3cd94701", "feeddefdbe85fd8d3ce6550da63603", "feeddefdd0a2fdae6bfd8d3ce6550da63603", "feeddefdd0a2fdae6bfd8d3cf16913d948018c2d04", "fff5ebfee6cefdd0a2fdae6bfd8d3cf16913d948018c2d04", "fff5ebfee6cefdd0a2fdae6bfd8d3cf16913d94801a636037f2704").map(colors), Oranges = ramp(scheme$q), cubehelix$3 = cubehelixLong(cubehelix(300, 0.5, 0.0), cubehelix(-240, 0.5, 1.0)), warm = cubehelixLong(cubehelix(-100, 0.75, 0.35), cubehelix(80, 1.50, 0.8)), cool = cubehelixLong(cubehelix(260, 0.75, 0.35), cubehelix(80, 1.50, 0.8)), c$1 = cubehelix(), c$2 = rgb(), pi_1_3 = Math.PI / 3, pi_2_3 = 2 * Math.PI / 3;
    function ramp$1(range) {
        var n = range.length;
        return function(t) {
            return range[Math.max(0, Math.min(n - 1, Math.floor(t * n)))];
        };
    }
    var viridis = ramp$1(colors("44015444025645045745055946075a46085c460a5d460b5e470d60470e6147106347116447136548146748166848176948186a481a6c481b6d481c6e481d6f481f70482071482173482374482475482576482677482878482979472a7a472c7a472d7b472e7c472f7d46307e46327e46337f463480453581453781453882443983443a83443b84433d84433e85423f854240864241864142874144874045884046883f47883f48893e49893e4a893e4c8a3d4d8a3d4e8a3c4f8a3c508b3b518b3b528b3a538b3a548c39558c39568c38588c38598c375a8c375b8d365c8d365d8d355e8d355f8d34608d34618d33628d33638d32648e32658e31668e31678e31688e30698e306a8e2f6b8e2f6c8e2e6d8e2e6e8e2e6f8e2d708e2d718e2c718e2c728e2c738e2b748e2b758e2a768e2a778e2a788e29798e297a8e297b8e287c8e287d8e277e8e277f8e27808e26818e26828e26828e25838e25848e25858e24868e24878e23888e23898e238a8d228b8d228c8d228d8d218e8d218f8d21908d21918c20928c20928c20938c1f948c1f958b1f968b1f978b1f988b1f998a1f9a8a1e9b8a1e9c891e9d891f9e891f9f881fa0881fa1881fa1871fa28720a38620a48621a58521a68522a78522a88423a98324aa8325ab8225ac8226ad8127ad8128ae8029af7f2ab07f2cb17e2db27d2eb37c2fb47c31b57b32b67a34b67935b77937b87838b9773aba763bbb753dbc743fbc7340bd7242be7144bf7046c06f48c16e4ac16d4cc26c4ec36b50c46a52c56954c56856c66758c7655ac8645cc8635ec96260ca6063cb5f65cb5e67cc5c69cd5b6ccd5a6ece5870cf5773d05675d05477d1537ad1517cd2507fd34e81d34d84d44b86d54989d5488bd6468ed64590d74393d74195d84098d83e9bd93c9dd93ba0da39a2da37a5db36a8db34aadc32addc30b0dd2fb2dd2db5de2bb8de29bade28bddf26c0df25c2df23c5e021c8e020cae11fcde11dd0e11cd2e21bd5e21ad8e219dae319dde318dfe318e2e418e5e419e7e419eae51aece51befe51cf1e51df4e61ef6e620f8e621fbe723fde725")), magma = ramp$1(colors("00000401000501010601010802010902020b02020d03030f03031204041405041606051806051a07061c08071e0907200a08220b09240c09260d0a290e0b2b100b2d110c2f120d31130d34140e36150e38160f3b180f3d19103f1a10421c10441d11471e114920114b21114e22115024125325125527125829115a2a115c2c115f2d11612f116331116533106734106936106b38106c390f6e3b0f703d0f713f0f72400f74420f75440f764510774710784910784a10794c117a4e117b4f127b51127c52137c54137d56147d57157e59157e5a167e5c167f5d177f5f187f601880621980641a80651a80671b80681c816a1c816b1d816d1d816e1e81701f81721f817320817521817621817822817922827b23827c23827e24828025828125818326818426818627818827818928818b29818c29818e2a81902a81912b81932b80942c80962c80982d80992d809b2e7f9c2e7f9e2f7fa02f7fa1307ea3307ea5317ea6317da8327daa337dab337cad347cae347bb0357bb2357bb3367ab5367ab73779b83779ba3878bc3978bd3977bf3a77c03a76c23b75c43c75c53c74c73d73c83e73ca3e72cc3f71cd4071cf4070d0416fd2426fd3436ed5446dd6456cd8456cd9466bdb476adc4869de4968df4a68e04c67e24d66e34e65e44f64e55064e75263e85362e95462ea5661eb5760ec5860ed5a5fee5b5eef5d5ef05f5ef1605df2625df2645cf3655cf4675cf4695cf56b5cf66c5cf66e5cf7705cf7725cf8745cf8765cf9785df9795df97b5dfa7d5efa7f5efa815ffb835ffb8560fb8761fc8961fc8a62fc8c63fc8e64fc9065fd9266fd9467fd9668fd9869fd9a6afd9b6bfe9d6cfe9f6dfea16efea36ffea571fea772fea973feaa74feac76feae77feb078feb27afeb47bfeb67cfeb77efeb97ffebb81febd82febf84fec185fec287fec488fec68afec88cfeca8dfecc8ffecd90fecf92fed194fed395fed597fed799fed89afdda9cfddc9efddea0fde0a1fde2a3fde3a5fde5a7fde7a9fde9aafdebacfcecaefceeb0fcf0b2fcf2b4fcf4b6fcf6b8fcf7b9fcf9bbfcfbbdfcfdbf")), inferno = ramp$1(colors("00000401000501010601010802010a02020c02020e03021004031204031405041706041907051b08051d09061f0a07220b07240c08260d08290e092b10092d110a30120a32140b34150b37160b39180c3c190c3e1b0c411c0c431e0c451f0c48210c4a230c4c240c4f260c51280b53290b552b0b572d0b592f0a5b310a5c320a5e340a5f3609613809623909633b09643d09653e0966400a67420a68440a68450a69470b6a490b6a4a0c6b4c0c6b4d0d6c4f0d6c510e6c520e6d540f6d550f6d57106e59106e5a116e5c126e5d126e5f136e61136e62146e64156e65156e67166e69166e6a176e6c186e6d186e6f196e71196e721a6e741a6e751b6e771c6d781c6d7a1d6d7c1d6d7d1e6d7f1e6c801f6c82206c84206b85216b87216b88226a8a226a8c23698d23698f24699025689225689326679526679727669827669a28659b29649d29649f2a63a02a63a22b62a32c61a52c60a62d60a82e5fa92e5eab2f5ead305dae305cb0315bb1325ab3325ab43359b63458b73557b93556ba3655bc3754bd3853bf3952c03a51c13a50c33b4fc43c4ec63d4dc73e4cc83f4bca404acb4149cc4248ce4347cf4446d04545d24644d34743d44842d54a41d74b3fd84c3ed94d3dda4e3cdb503bdd513ade5238df5337e05536e15635e25734e35933e45a31e55c30e65d2fe75e2ee8602de9612bea632aeb6429eb6628ec6726ed6925ee6a24ef6c23ef6e21f06f20f1711ff1731df2741cf3761bf37819f47918f57b17f57d15f67e14f68013f78212f78410f8850ff8870ef8890cf98b0bf98c0af98e09fa9008fa9207fa9407fb9606fb9706fb9906fb9b06fb9d07fc9f07fca108fca309fca50afca60cfca80dfcaa0ffcac11fcae12fcb014fcb216fcb418fbb61afbb81dfbba1ffbbc21fbbe23fac026fac228fac42afac62df9c72ff9c932f9cb35f8cd37f8cf3af7d13df7d340f6d543f6d746f5d949f5db4cf4dd4ff4df53f4e156f3e35af3e55df2e661f2e865f2ea69f1ec6df1ed71f1ef75f1f179f2f27df2f482f3f586f3f68af4f88ef5f992f6fa96f8fb9af9fc9dfafda1fcffa4")), plasma = ramp$1(colors("0d088710078813078916078a19068c1b068d1d068e20068f2206902406912605912805922a05932c05942e05952f059631059733059735049837049938049a3a049a3c049b3e049c3f049c41049d43039e44039e46039f48039f4903a04b03a14c02a14e02a25002a25102a35302a35502a45601a45801a45901a55b01a55c01a65e01a66001a66100a76300a76400a76600a76700a86900a86a00a86c00a86e00a86f00a87100a87201a87401a87501a87701a87801a87a02a87b02a87d03a87e03a88004a88104a78305a78405a78606a68707a68808a68a09a58b0aa58d0ba58e0ca48f0da4910ea3920fa39410a29511a19613a19814a099159f9a169f9c179e9d189d9e199da01a9ca11b9ba21d9aa31e9aa51f99a62098a72197a82296aa2395ab2494ac2694ad2793ae2892b02991b12a90b22b8fb32c8eb42e8db52f8cb6308bb7318ab83289ba3388bb3488bc3587bd3786be3885bf3984c03a83c13b82c23c81c33d80c43e7fc5407ec6417dc7427cc8437bc9447aca457acb4679cc4778cc4977cd4a76ce4b75cf4c74d04d73d14e72d24f71d35171d45270d5536fd5546ed6556dd7566cd8576bd9586ada5a6ada5b69db5c68dc5d67dd5e66de5f65de6164df6263e06363e16462e26561e26660e3685fe4695ee56a5de56b5de66c5ce76e5be76f5ae87059e97158e97257ea7457eb7556eb7655ec7754ed7953ed7a52ee7b51ef7c51ef7e50f07f4ff0804ef1814df1834cf2844bf3854bf3874af48849f48948f58b47f58c46f68d45f68f44f79044f79143f79342f89441f89540f9973ff9983ef99a3efa9b3dfa9c3cfa9e3bfb9f3afba139fba238fca338fca537fca636fca835fca934fdab33fdac33fdae32fdaf31fdb130fdb22ffdb42ffdb52efeb72dfeb82cfeba2cfebb2bfebd2afebe2afec029fdc229fdc328fdc527fdc627fdc827fdca26fdcb26fccd25fcce25fcd025fcd225fbd324fbd524fbd724fad824fada24f9dc24f9dd25f8df25f8e125f7e225f7e425f6e626f6e826f5e926f5eb27f4ed27f3ee27f3f027f2f227f1f426f1f525f0f724f0f921"));
    function constant$a(x) {
        return function() {
            return x;
        };
    }
    var abs$3 = Math.abs, atan2$1 = Math.atan2, cos$2 = Math.cos, max$3 = Math.max, min$2 = Math.min, sin$2 = Math.sin, sqrt$2 = Math.sqrt, pi$4 = Math.PI, halfPi$3 = pi$4 / 2, tau$5 = 2 * pi$4;
    function asin$1(x) {
        return x >= 1 ? halfPi$3 : x <= -1 ? -halfPi$3 : Math.asin(x);
    }
    function arcInnerRadius(d) {
        return d.innerRadius;
    }
    function arcOuterRadius(d) {
        return d.outerRadius;
    }
    function arcStartAngle(d) {
        return d.startAngle;
    }
    function arcEndAngle(d) {
        return d.endAngle;
    }
    function arcPadAngle(d) {
        return d && d.padAngle; // Note: optional!
    }
    // Compute perpendicular offset line of length rc.
    // http://mathworld.wolfram.com/Circle-LineIntersection.html
    function cornerTangents(x0, y0, x1, y1, r1, rc, cw) {
        var x01 = x0 - x1, y01 = y0 - y1, lo = (cw ? rc : -rc) / sqrt$2(x01 * x01 + y01 * y01), ox = lo * y01, oy = -lo * x01, x11 = x0 + ox, y11 = y0 + oy, x10 = x1 + ox, y10 = y1 + oy, x00 = (x11 + x10) / 2, y00 = (y11 + y10) / 2, dx = x10 - x11, dy = y10 - y11, d2 = dx * dx + dy * dy, r = r1 - rc, D = x11 * y10 - x10 * y11, d = (dy < 0 ? -1 : 1) * sqrt$2(max$3(0, r * r * d2 - D * D)), cx0 = (D * dy - dx * d) / d2, cy0 = (-D * dx - dy * d) / d2, cx1 = (D * dy + dx * d) / d2, cy1 = (-D * dx + dy * d) / d2, dx0 = cx0 - x00, dy0 = cy0 - y00, dx1 = cx1 - x00, dy1 = cy1 - y00;
        return dx0 * dx0 + dy0 * dy0 > dx1 * dx1 + dy1 * dy1 && (cx0 = cx1, cy0 = cy1), {
            cx: cx0,
            cy: cy0,
            x01: -ox,
            y01: -oy,
            x11: cx0 * (r1 / r - 1),
            y11: cy0 * (r1 / r - 1)
        };
    }
    var slice$4 = Array.prototype.slice;
    function array$5(x) {
        return "object" == typeof x && "length" in x ? x // Array, TypedArray, NodeList, array-like
         : Array.from(x); // Map, Set, iterable, string, or anything else
    }
    function Linear(context) {
        this._context = context;
    }
    function curveLinear(context) {
        return new Linear(context);
    }
    function x$3(p) {
        return p[0];
    }
    function y$3(p) {
        return p[1];
    }
    function line(x, y) {
        var defined = constant$a(!0), context = null, curve = curveLinear, output = null;
        function line(data) {
            var i, d, buffer, n = (data = array$5(data)).length, defined0 = !1;
            for(null == context && (output = curve(buffer = path())), i = 0; i <= n; ++i)!(i < n && defined(d = data[i], i, data)) === defined0 && ((defined0 = !defined0) ? output.lineStart() : output.lineEnd()), defined0 && output.point(+x(d, i, data), +y(d, i, data));
            if (buffer) return output = null, buffer + "" || null;
        }
        return x = "function" == typeof x ? x : void 0 === x ? x$3 : constant$a(x), y = "function" == typeof y ? y : void 0 === y ? y$3 : constant$a(y), line.x = function(_) {
            return arguments.length ? (x = "function" == typeof _ ? _ : constant$a(+_), line) : x;
        }, line.y = function(_) {
            return arguments.length ? (y = "function" == typeof _ ? _ : constant$a(+_), line) : y;
        }, line.defined = function(_) {
            return arguments.length ? (defined = "function" == typeof _ ? _ : constant$a(!!_), line) : defined;
        }, line.curve = function(_) {
            return arguments.length ? (curve = _, null != context && (output = curve(context)), line) : curve;
        }, line.context = function(_) {
            return arguments.length ? (null == _ ? context = output = null : output = curve(context = _), line) : context;
        }, line;
    }
    function area$3(x0, y0, y1) {
        var x1 = null, defined = constant$a(!0), context = null, curve = curveLinear, output = null;
        function area(data) {
            var i, j, k, d, buffer, n = (data = array$5(data)).length, defined0 = !1, x0z = Array(n), y0z = Array(n);
            for(null == context && (output = curve(buffer = path())), i = 0; i <= n; ++i){
                if (!(i < n && defined(d = data[i], i, data)) === defined0) {
                    if (defined0 = !defined0) j = i, output.areaStart(), output.lineStart();
                    else {
                        for(output.lineEnd(), output.lineStart(), k = i - 1; k >= j; --k)output.point(x0z[k], y0z[k]);
                        output.lineEnd(), output.areaEnd();
                    }
                }
                defined0 && (x0z[i] = +x0(d, i, data), y0z[i] = +y0(d, i, data), output.point(x1 ? +x1(d, i, data) : x0z[i], y1 ? +y1(d, i, data) : y0z[i]));
            }
            if (buffer) return output = null, buffer + "" || null;
        }
        function arealine() {
            return line().defined(defined).curve(curve).context(context);
        }
        return x0 = "function" == typeof x0 ? x0 : void 0 === x0 ? x$3 : constant$a(+x0), y0 = "function" == typeof y0 ? y0 : void 0 === y0 ? constant$a(0) : constant$a(+y0), y1 = "function" == typeof y1 ? y1 : void 0 === y1 ? y$3 : constant$a(+y1), area.x = function(_) {
            return arguments.length ? (x0 = "function" == typeof _ ? _ : constant$a(+_), x1 = null, area) : x0;
        }, area.x0 = function(_) {
            return arguments.length ? (x0 = "function" == typeof _ ? _ : constant$a(+_), area) : x0;
        }, area.x1 = function(_) {
            return arguments.length ? (x1 = null == _ ? null : "function" == typeof _ ? _ : constant$a(+_), area) : x1;
        }, area.y = function(_) {
            return arguments.length ? (y0 = "function" == typeof _ ? _ : constant$a(+_), y1 = null, area) : y0;
        }, area.y0 = function(_) {
            return arguments.length ? (y0 = "function" == typeof _ ? _ : constant$a(+_), area) : y0;
        }, area.y1 = function(_) {
            return arguments.length ? (y1 = null == _ ? null : "function" == typeof _ ? _ : constant$a(+_), area) : y1;
        }, area.lineX0 = area.lineY0 = function() {
            return arealine().x(x0).y(y0);
        }, area.lineY1 = function() {
            return arealine().x(x0).y(y1);
        }, area.lineX1 = function() {
            return arealine().x(x1).y(y0);
        }, area.defined = function(_) {
            return arguments.length ? (defined = "function" == typeof _ ? _ : constant$a(!!_), area) : defined;
        }, area.curve = function(_) {
            return arguments.length ? (curve = _, null != context && (output = curve(context)), area) : curve;
        }, area.context = function(_) {
            return arguments.length ? (null == _ ? context = output = null : output = curve(context = _), area) : context;
        }, area;
    }
    function descending$1(a, b) {
        return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
    }
    function identity$8(d) {
        return d;
    }
    Linear.prototype = {
        areaStart: function() {
            this._line = 0;
        },
        areaEnd: function() {
            this._line = NaN;
        },
        lineStart: function() {
            this._point = 0;
        },
        lineEnd: function() {
            (this._line || 0 !== this._line && 1 === this._point) && this._context.closePath(), this._line = 1 - this._line;
        },
        point: function(x, y) {
            switch(x = +x, y = +y, this._point){
                case 0:
                    this._point = 1, this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y);
                    break;
                case 1:
                    this._point = 2; // proceed
                default:
                    this._context.lineTo(x, y);
            }
        }
    };
    var curveRadialLinear = curveRadial(curveLinear);
    function Radial(curve) {
        this._curve = curve;
    }
    function curveRadial(curve) {
        function radial(context) {
            return new Radial(curve(context));
        }
        return radial._curve = curve, radial;
    }
    function lineRadial(l) {
        var c = l.curve;
        return l.angle = l.x, delete l.x, l.radius = l.y, delete l.y, l.curve = function(_) {
            return arguments.length ? c(curveRadial(_)) : c()._curve;
        }, l;
    }
    function lineRadial$1() {
        return lineRadial(line().curve(curveRadialLinear));
    }
    function areaRadial() {
        var a = area$3().curve(curveRadialLinear), c = a.curve, x0 = a.lineX0, x1 = a.lineX1, y0 = a.lineY0, y1 = a.lineY1;
        return a.angle = a.x, delete a.x, a.startAngle = a.x0, delete a.x0, a.endAngle = a.x1, delete a.x1, a.radius = a.y, delete a.y, a.innerRadius = a.y0, delete a.y0, a.outerRadius = a.y1, delete a.y1, a.lineStartAngle = function() {
            return lineRadial(x0());
        }, delete a.lineX0, a.lineEndAngle = function() {
            return lineRadial(x1());
        }, delete a.lineX1, a.lineInnerRadius = function() {
            return lineRadial(y0());
        }, delete a.lineY0, a.lineOuterRadius = function() {
            return lineRadial(y1());
        }, delete a.lineY1, a.curve = function(_) {
            return arguments.length ? c(curveRadial(_)) : c()._curve;
        }, a;
    }
    function pointRadial(x, y) {
        return [
            (y = +y) * Math.cos(x -= Math.PI / 2),
            y * Math.sin(x)
        ];
    }
    function linkSource(d) {
        return d.source;
    }
    function linkTarget(d) {
        return d.target;
    }
    function link$2(curve) {
        var source = linkSource, target = linkTarget, x = x$3, y = y$3, context = null;
        function link() {
            var buffer, argv = slice$4.call(arguments), s = source.apply(this, argv), t = target.apply(this, argv);
            if (context || (context = buffer = path()), curve(context, +x.apply(this, (argv[0] = s, argv)), +y.apply(this, argv), +x.apply(this, (argv[0] = t, argv)), +y.apply(this, argv)), buffer) return context = null, buffer + "" || null;
        }
        return link.source = function(_) {
            return arguments.length ? (source = _, link) : source;
        }, link.target = function(_) {
            return arguments.length ? (target = _, link) : target;
        }, link.x = function(_) {
            return arguments.length ? (x = "function" == typeof _ ? _ : constant$a(+_), link) : x;
        }, link.y = function(_) {
            return arguments.length ? (y = "function" == typeof _ ? _ : constant$a(+_), link) : y;
        }, link.context = function(_) {
            return arguments.length ? (context = null == _ ? null : _, link) : context;
        }, link;
    }
    function curveHorizontal(context, x0, y0, x1, y1) {
        context.moveTo(x0, y0), context.bezierCurveTo(x0 = (x0 + x1) / 2, y0, x0, y1, x1, y1);
    }
    function curveVertical(context, x0, y0, x1, y1) {
        context.moveTo(x0, y0), context.bezierCurveTo(x0, y0 = (y0 + y1) / 2, x1, y0, x1, y1);
    }
    function curveRadial$1(context, x0, y0, x1, y1) {
        var p0 = pointRadial(x0, y0), p1 = pointRadial(x0, y0 = (y0 + y1) / 2), p2 = pointRadial(x1, y0), p3 = pointRadial(x1, y1);
        context.moveTo(p0[0], p0[1]), context.bezierCurveTo(p1[0], p1[1], p2[0], p2[1], p3[0], p3[1]);
    }
    Radial.prototype = {
        areaStart: function() {
            this._curve.areaStart();
        },
        areaEnd: function() {
            this._curve.areaEnd();
        },
        lineStart: function() {
            this._curve.lineStart();
        },
        lineEnd: function() {
            this._curve.lineEnd();
        },
        point: function(a, r) {
            this._curve.point(r * Math.sin(a), -(r * Math.cos(a)));
        }
    };
    var circle$2 = {
        draw: function(context, size) {
            var r = Math.sqrt(size / pi$4);
            context.moveTo(r, 0), context.arc(0, 0, r, 0, tau$5);
        }
    }, cross$2 = {
        draw: function(context, size) {
            var r = Math.sqrt(size / 5) / 2;
            context.moveTo(-3 * r, -r), context.lineTo(-r, -r), context.lineTo(-r, -3 * r), context.lineTo(r, -3 * r), context.lineTo(r, -r), context.lineTo(3 * r, -r), context.lineTo(3 * r, r), context.lineTo(r, r), context.lineTo(r, 3 * r), context.lineTo(-r, 3 * r), context.lineTo(-r, r), context.lineTo(-3 * r, r), context.closePath();
        }
    }, tan30 = Math.sqrt(1 / 3), tan30_2 = 2 * tan30, diamond = {
        draw: function(context, size) {
            var y = Math.sqrt(size / tan30_2), x = y * tan30;
            context.moveTo(0, -y), context.lineTo(x, 0), context.lineTo(0, y), context.lineTo(-x, 0), context.closePath();
        }
    }, kr = Math.sin(pi$4 / 10) / Math.sin(7 * pi$4 / 10), kx = Math.sin(tau$5 / 10) * kr, ky = -Math.cos(tau$5 / 10) * kr, star = {
        draw: function(context, size) {
            var r = Math.sqrt(0.89081309152928522810 * size), x = kx * r, y = ky * r;
            context.moveTo(0, -r), context.lineTo(x, y);
            for(var i = 1; i < 5; ++i){
                var a = tau$5 * i / 5, c = Math.cos(a), s = Math.sin(a);
                context.lineTo(s * r, -c * r), context.lineTo(c * x - s * y, s * x + c * y);
            }
            context.closePath();
        }
    }, square$1 = {
        draw: function(context, size) {
            var w = Math.sqrt(size), x = -w / 2;
            context.rect(x, x, w, w);
        }
    }, sqrt3 = Math.sqrt(3), triangle = {
        draw: function(context, size) {
            var y = -Math.sqrt(size / (3 * sqrt3));
            context.moveTo(0, 2 * y), context.lineTo(-sqrt3 * y, -y), context.lineTo(sqrt3 * y, -y), context.closePath();
        }
    }, s = Math.sqrt(3) / 2, k = 1 / Math.sqrt(12), a$1 = (k / 2 + 1) * 3, wye = {
        draw: function(context, size) {
            var r = Math.sqrt(size / a$1), x0 = r / 2, y0 = r * k, y1 = r * k + r, x2 = -x0;
            context.moveTo(x0, y0), context.lineTo(x0, y1), context.lineTo(x2, y1), context.lineTo(-0.5 * x0 - s * y0, s * x0 + -0.5 * y0), context.lineTo(-0.5 * x0 - s * y1, s * x0 + -0.5 * y1), context.lineTo(-0.5 * x2 - s * y1, s * x2 + -0.5 * y1), context.lineTo(-0.5 * x0 + s * y0, -0.5 * y0 - s * x0), context.lineTo(-0.5 * x0 + s * y1, -0.5 * y1 - s * x0), context.lineTo(-0.5 * x2 + s * y1, -0.5 * y1 - s * x2), context.closePath();
        }
    }, symbols = [
        circle$2,
        cross$2,
        diamond,
        square$1,
        star,
        triangle,
        wye
    ];
    function noop$3() {}
    function point$1(that, x, y) {
        that._context.bezierCurveTo((2 * that._x0 + that._x1) / 3, (2 * that._y0 + that._y1) / 3, (that._x0 + 2 * that._x1) / 3, (that._y0 + 2 * that._y1) / 3, (that._x0 + 4 * that._x1 + x) / 6, (that._y0 + 4 * that._y1 + y) / 6);
    }
    function Basis(context) {
        this._context = context;
    }
    function BasisClosed(context) {
        this._context = context;
    }
    function BasisOpen(context) {
        this._context = context;
    }
    function Bundle(context, beta) {
        this._basis = new Basis(context), this._beta = beta;
    }
    Basis.prototype = {
        areaStart: function() {
            this._line = 0;
        },
        areaEnd: function() {
            this._line = NaN;
        },
        lineStart: function() {
            this._x0 = this._x1 = this._y0 = this._y1 = NaN, this._point = 0;
        },
        lineEnd: function() {
            switch(this._point){
                case 3:
                    point$1(this, this._x1, this._y1); // proceed
                case 2:
                    this._context.lineTo(this._x1, this._y1);
            }
            (this._line || 0 !== this._line && 1 === this._point) && this._context.closePath(), this._line = 1 - this._line;
        },
        point: function(x, y) {
            switch(x = +x, y = +y, this._point){
                case 0:
                    this._point = 1, this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y);
                    break;
                case 1:
                    this._point = 2;
                    break;
                case 2:
                    this._point = 3, this._context.lineTo((5 * this._x0 + this._x1) / 6, (5 * this._y0 + this._y1) / 6);
                default:
                    point$1(this, x, y);
            }
            this._x0 = this._x1, this._x1 = x, this._y0 = this._y1, this._y1 = y;
        }
    }, BasisClosed.prototype = {
        areaStart: noop$3,
        areaEnd: noop$3,
        lineStart: function() {
            this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = NaN, this._point = 0;
        },
        lineEnd: function() {
            switch(this._point){
                case 1:
                    this._context.moveTo(this._x2, this._y2), this._context.closePath();
                    break;
                case 2:
                    this._context.moveTo((this._x2 + 2 * this._x3) / 3, (this._y2 + 2 * this._y3) / 3), this._context.lineTo((this._x3 + 2 * this._x2) / 3, (this._y3 + 2 * this._y2) / 3), this._context.closePath();
                    break;
                case 3:
                    this.point(this._x2, this._y2), this.point(this._x3, this._y3), this.point(this._x4, this._y4);
            }
        },
        point: function(x, y) {
            switch(x = +x, y = +y, this._point){
                case 0:
                    this._point = 1, this._x2 = x, this._y2 = y;
                    break;
                case 1:
                    this._point = 2, this._x3 = x, this._y3 = y;
                    break;
                case 2:
                    this._point = 3, this._x4 = x, this._y4 = y, this._context.moveTo((this._x0 + 4 * this._x1 + x) / 6, (this._y0 + 4 * this._y1 + y) / 6);
                    break;
                default:
                    point$1(this, x, y);
            }
            this._x0 = this._x1, this._x1 = x, this._y0 = this._y1, this._y1 = y;
        }
    }, BasisOpen.prototype = {
        areaStart: function() {
            this._line = 0;
        },
        areaEnd: function() {
            this._line = NaN;
        },
        lineStart: function() {
            this._x0 = this._x1 = this._y0 = this._y1 = NaN, this._point = 0;
        },
        lineEnd: function() {
            (this._line || 0 !== this._line && 3 === this._point) && this._context.closePath(), this._line = 1 - this._line;
        },
        point: function(x, y) {
            switch(x = +x, y = +y, this._point){
                case 0:
                    this._point = 1;
                    break;
                case 1:
                    this._point = 2;
                    break;
                case 2:
                    this._point = 3;
                    var x0 = (this._x0 + 4 * this._x1 + x) / 6, y0 = (this._y0 + 4 * this._y1 + y) / 6;
                    this._line ? this._context.lineTo(x0, y0) : this._context.moveTo(x0, y0);
                    break;
                case 3:
                    this._point = 4; // proceed
                default:
                    point$1(this, x, y);
            }
            this._x0 = this._x1, this._x1 = x, this._y0 = this._y1, this._y1 = y;
        }
    }, Bundle.prototype = {
        lineStart: function() {
            this._x = [], this._y = [], this._basis.lineStart();
        },
        lineEnd: function() {
            var x = this._x, y = this._y, j = x.length - 1;
            if (j > 0) for(var t, x0 = x[0], y0 = y[0], dx = x[j] - x0, dy = y[j] - y0, i = -1; ++i <= j;)t = i / j, this._basis.point(this._beta * x[i] + (1 - this._beta) * (x0 + t * dx), this._beta * y[i] + (1 - this._beta) * (y0 + t * dy));
            this._x = this._y = null, this._basis.lineEnd();
        },
        point: function(x, y) {
            this._x.push(+x), this._y.push(+y);
        }
    };
    var bundle = function custom(beta) {
        function bundle(context) {
            return 1 === beta ? new Basis(context) : new Bundle(context, beta);
        }
        return bundle.beta = function(beta) {
            return custom(+beta);
        }, bundle;
    }(0.85);
    function point$2(that, x, y) {
        that._context.bezierCurveTo(that._x1 + that._k * (that._x2 - that._x0), that._y1 + that._k * (that._y2 - that._y0), that._x2 + that._k * (that._x1 - x), that._y2 + that._k * (that._y1 - y), that._x2, that._y2);
    }
    function Cardinal(context, tension) {
        this._context = context, this._k = (1 - tension) / 6;
    }
    Cardinal.prototype = {
        areaStart: function() {
            this._line = 0;
        },
        areaEnd: function() {
            this._line = NaN;
        },
        lineStart: function() {
            this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN, this._point = 0;
        },
        lineEnd: function() {
            switch(this._point){
                case 2:
                    this._context.lineTo(this._x2, this._y2);
                    break;
                case 3:
                    point$2(this, this._x1, this._y1);
            }
            (this._line || 0 !== this._line && 1 === this._point) && this._context.closePath(), this._line = 1 - this._line;
        },
        point: function(x, y) {
            switch(x = +x, y = +y, this._point){
                case 0:
                    this._point = 1, this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y);
                    break;
                case 1:
                    this._point = 2, this._x1 = x, this._y1 = y;
                    break;
                case 2:
                    this._point = 3; // proceed
                default:
                    point$2(this, x, y);
            }
            this._x0 = this._x1, this._x1 = this._x2, this._x2 = x, this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
        }
    };
    var cardinal = function custom(tension) {
        function cardinal(context) {
            return new Cardinal(context, tension);
        }
        return cardinal.tension = function(tension) {
            return custom(+tension);
        }, cardinal;
    }(0);
    function CardinalClosed(context, tension) {
        this._context = context, this._k = (1 - tension) / 6;
    }
    CardinalClosed.prototype = {
        areaStart: noop$3,
        areaEnd: noop$3,
        lineStart: function() {
            this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._x5 = this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = this._y5 = NaN, this._point = 0;
        },
        lineEnd: function() {
            switch(this._point){
                case 1:
                    this._context.moveTo(this._x3, this._y3), this._context.closePath();
                    break;
                case 2:
                    this._context.lineTo(this._x3, this._y3), this._context.closePath();
                    break;
                case 3:
                    this.point(this._x3, this._y3), this.point(this._x4, this._y4), this.point(this._x5, this._y5);
            }
        },
        point: function(x, y) {
            switch(x = +x, y = +y, this._point){
                case 0:
                    this._point = 1, this._x3 = x, this._y3 = y;
                    break;
                case 1:
                    this._point = 2, this._context.moveTo(this._x4 = x, this._y4 = y);
                    break;
                case 2:
                    this._point = 3, this._x5 = x, this._y5 = y;
                    break;
                default:
                    point$2(this, x, y);
            }
            this._x0 = this._x1, this._x1 = this._x2, this._x2 = x, this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
        }
    };
    var cardinalClosed = function custom(tension) {
        function cardinal(context) {
            return new CardinalClosed(context, tension);
        }
        return cardinal.tension = function(tension) {
            return custom(+tension);
        }, cardinal;
    }(0);
    function CardinalOpen(context, tension) {
        this._context = context, this._k = (1 - tension) / 6;
    }
    CardinalOpen.prototype = {
        areaStart: function() {
            this._line = 0;
        },
        areaEnd: function() {
            this._line = NaN;
        },
        lineStart: function() {
            this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN, this._point = 0;
        },
        lineEnd: function() {
            (this._line || 0 !== this._line && 3 === this._point) && this._context.closePath(), this._line = 1 - this._line;
        },
        point: function(x, y) {
            switch(x = +x, y = +y, this._point){
                case 0:
                    this._point = 1;
                    break;
                case 1:
                    this._point = 2;
                    break;
                case 2:
                    this._point = 3, this._line ? this._context.lineTo(this._x2, this._y2) : this._context.moveTo(this._x2, this._y2);
                    break;
                case 3:
                    this._point = 4; // proceed
                default:
                    point$2(this, x, y);
            }
            this._x0 = this._x1, this._x1 = this._x2, this._x2 = x, this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
        }
    };
    var cardinalOpen = function custom(tension) {
        function cardinal(context) {
            return new CardinalOpen(context, tension);
        }
        return cardinal.tension = function(tension) {
            return custom(+tension);
        }, cardinal;
    }(0);
    function point$3(that, x, y) {
        var x1 = that._x1, y1 = that._y1, x2 = that._x2, y2 = that._y2;
        if (that._l01_a > 1e-12) {
            var a = 2 * that._l01_2a + 3 * that._l01_a * that._l12_a + that._l12_2a, n = 3 * that._l01_a * (that._l01_a + that._l12_a);
            x1 = (x1 * a - that._x0 * that._l12_2a + that._x2 * that._l01_2a) / n, y1 = (y1 * a - that._y0 * that._l12_2a + that._y2 * that._l01_2a) / n;
        }
        if (that._l23_a > 1e-12) {
            var b = 2 * that._l23_2a + 3 * that._l23_a * that._l12_a + that._l12_2a, m = 3 * that._l23_a * (that._l23_a + that._l12_a);
            x2 = (x2 * b + that._x1 * that._l23_2a - x * that._l12_2a) / m, y2 = (y2 * b + that._y1 * that._l23_2a - y * that._l12_2a) / m;
        }
        that._context.bezierCurveTo(x1, y1, x2, y2, that._x2, that._y2);
    }
    function CatmullRom(context, alpha) {
        this._context = context, this._alpha = alpha;
    }
    CatmullRom.prototype = {
        areaStart: function() {
            this._line = 0;
        },
        areaEnd: function() {
            this._line = NaN;
        },
        lineStart: function() {
            this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN, this._l01_a = this._l12_a = this._l23_a = this._l01_2a = this._l12_2a = this._l23_2a = this._point = 0;
        },
        lineEnd: function() {
            switch(this._point){
                case 2:
                    this._context.lineTo(this._x2, this._y2);
                    break;
                case 3:
                    this.point(this._x2, this._y2);
            }
            (this._line || 0 !== this._line && 1 === this._point) && this._context.closePath(), this._line = 1 - this._line;
        },
        point: function(x, y) {
            if (x = +x, y = +y, this._point) {
                var x23 = this._x2 - x, y23 = this._y2 - y;
                this._l23_a = Math.sqrt(this._l23_2a = Math.pow(x23 * x23 + y23 * y23, this._alpha));
            }
            switch(this._point){
                case 0:
                    this._point = 1, this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y);
                    break;
                case 1:
                    this._point = 2;
                    break;
                case 2:
                    this._point = 3; // proceed
                default:
                    point$3(this, x, y);
            }
            this._l01_a = this._l12_a, this._l12_a = this._l23_a, this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a, this._x0 = this._x1, this._x1 = this._x2, this._x2 = x, this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
        }
    };
    var catmullRom = function custom(alpha) {
        function catmullRom(context) {
            return alpha ? new CatmullRom(context, alpha) : new Cardinal(context, 0);
        }
        return catmullRom.alpha = function(alpha) {
            return custom(+alpha);
        }, catmullRom;
    }(0.5);
    function CatmullRomClosed(context, alpha) {
        this._context = context, this._alpha = alpha;
    }
    CatmullRomClosed.prototype = {
        areaStart: noop$3,
        areaEnd: noop$3,
        lineStart: function() {
            this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._x5 = this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = this._y5 = NaN, this._l01_a = this._l12_a = this._l23_a = this._l01_2a = this._l12_2a = this._l23_2a = this._point = 0;
        },
        lineEnd: function() {
            switch(this._point){
                case 1:
                    this._context.moveTo(this._x3, this._y3), this._context.closePath();
                    break;
                case 2:
                    this._context.lineTo(this._x3, this._y3), this._context.closePath();
                    break;
                case 3:
                    this.point(this._x3, this._y3), this.point(this._x4, this._y4), this.point(this._x5, this._y5);
            }
        },
        point: function(x, y) {
            if (x = +x, y = +y, this._point) {
                var x23 = this._x2 - x, y23 = this._y2 - y;
                this._l23_a = Math.sqrt(this._l23_2a = Math.pow(x23 * x23 + y23 * y23, this._alpha));
            }
            switch(this._point){
                case 0:
                    this._point = 1, this._x3 = x, this._y3 = y;
                    break;
                case 1:
                    this._point = 2, this._context.moveTo(this._x4 = x, this._y4 = y);
                    break;
                case 2:
                    this._point = 3, this._x5 = x, this._y5 = y;
                    break;
                default:
                    point$3(this, x, y);
            }
            this._l01_a = this._l12_a, this._l12_a = this._l23_a, this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a, this._x0 = this._x1, this._x1 = this._x2, this._x2 = x, this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
        }
    };
    var catmullRomClosed = function custom(alpha) {
        function catmullRom(context) {
            return alpha ? new CatmullRomClosed(context, alpha) : new CardinalClosed(context, 0);
        }
        return catmullRom.alpha = function(alpha) {
            return custom(+alpha);
        }, catmullRom;
    }(0.5);
    function CatmullRomOpen(context, alpha) {
        this._context = context, this._alpha = alpha;
    }
    CatmullRomOpen.prototype = {
        areaStart: function() {
            this._line = 0;
        },
        areaEnd: function() {
            this._line = NaN;
        },
        lineStart: function() {
            this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN, this._l01_a = this._l12_a = this._l23_a = this._l01_2a = this._l12_2a = this._l23_2a = this._point = 0;
        },
        lineEnd: function() {
            (this._line || 0 !== this._line && 3 === this._point) && this._context.closePath(), this._line = 1 - this._line;
        },
        point: function(x, y) {
            if (x = +x, y = +y, this._point) {
                var x23 = this._x2 - x, y23 = this._y2 - y;
                this._l23_a = Math.sqrt(this._l23_2a = Math.pow(x23 * x23 + y23 * y23, this._alpha));
            }
            switch(this._point){
                case 0:
                    this._point = 1;
                    break;
                case 1:
                    this._point = 2;
                    break;
                case 2:
                    this._point = 3, this._line ? this._context.lineTo(this._x2, this._y2) : this._context.moveTo(this._x2, this._y2);
                    break;
                case 3:
                    this._point = 4; // proceed
                default:
                    point$3(this, x, y);
            }
            this._l01_a = this._l12_a, this._l12_a = this._l23_a, this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a, this._x0 = this._x1, this._x1 = this._x2, this._x2 = x, this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
        }
    };
    var catmullRomOpen = function custom(alpha) {
        function catmullRom(context) {
            return alpha ? new CatmullRomOpen(context, alpha) : new CardinalOpen(context, 0);
        }
        return catmullRom.alpha = function(alpha) {
            return custom(+alpha);
        }, catmullRom;
    }(0.5);
    function LinearClosed(context) {
        this._context = context;
    }
    // Calculate the slopes of the tangents (Hermite-type interpolation) based on
    // the following paper: Steffen, M. 1990. A Simple Method for Monotonic
    // Interpolation in One Dimension. Astronomy and Astrophysics, Vol. 239, NO.
    // NOV(II), P. 443, 1990.
    function slope3(that, x2, y2) {
        var h0 = that._x1 - that._x0, h1 = x2 - that._x1, s0 = (that._y1 - that._y0) / (h0 || h1 < 0 && -0), s1 = (y2 - that._y1) / (h1 || h0 < 0 && -0);
        return ((s0 < 0 ? -1 : 1) + (s1 < 0 ? -1 : 1)) * Math.min(Math.abs(s0), Math.abs(s1), 0.5 * Math.abs((s0 * h1 + s1 * h0) / (h0 + h1))) || 0;
    }
    // Calculate a one-sided slope.
    function slope2(that, t) {
        var h = that._x1 - that._x0;
        return h ? (3 * (that._y1 - that._y0) / h - t) / 2 : t;
    }
    // According to https://en.wikipedia.org/wiki/Cubic_Hermite_spline#Representations
    // "you can express cubic Hermite interpolation in terms of cubic Bézier curves
    // with respect to the four values p0, p0 + m0 / 3, p1 - m1 / 3, p1".
    function point$4(that, t0, t1) {
        var x0 = that._x0, y0 = that._y0, x1 = that._x1, y1 = that._y1, dx = (x1 - x0) / 3;
        that._context.bezierCurveTo(x0 + dx, y0 + dx * t0, x1 - dx, y1 - dx * t1, x1, y1);
    }
    function MonotoneX(context) {
        this._context = context;
    }
    function MonotoneY(context) {
        this._context = new ReflectContext(context);
    }
    function ReflectContext(context) {
        this._context = context;
    }
    function Natural(context) {
        this._context = context;
    }
    // See https://www.particleincell.com/2012/bezier-splines/ for derivation.
    function controlPoints(x) {
        var i, m, n = x.length - 1, a = Array(n), b = Array(n), r = Array(n);
        for(a[0] = 0, b[0] = 2, r[0] = x[0] + 2 * x[1], i = 1; i < n - 1; ++i)a[i] = 1, b[i] = 4, r[i] = 4 * x[i] + 2 * x[i + 1];
        for(a[n - 1] = 2, b[n - 1] = 7, r[n - 1] = 8 * x[n - 1] + x[n], i = 1; i < n; ++i)m = a[i] / b[i - 1], b[i] -= m, r[i] -= m * r[i - 1];
        for(a[n - 1] = r[n - 1] / b[n - 1], i = n - 2; i >= 0; --i)a[i] = (r[i] - a[i + 1]) / b[i];
        for(i = 0, b[n - 1] = (x[n] + a[n - 1]) / 2; i < n - 1; ++i)b[i] = 2 * x[i + 1] - a[i + 1];
        return [
            a,
            b
        ];
    }
    function Step(context, t) {
        this._context = context, this._t = t;
    }
    function none$1(series, order) {
        if ((n = series.length) > 1) for(var j, s0, n, i = 1, s1 = series[order[0]], m = s1.length; i < n; ++i)for(s0 = s1, s1 = series[order[i]], j = 0; j < m; ++j)s1[j][1] += s1[j][0] = isNaN(s0[j][1]) ? s0[j][0] : s0[j][1];
    }
    function none$2(series) {
        for(var n = series.length, o = Array(n); --n >= 0;)o[n] = n;
        return o;
    }
    function stackValue(d, key) {
        return d[key];
    }
    function stackSeries(key) {
        const series = [];
        return series.key = key, series;
    }
    function appearance(series) {
        var peaks = series.map(peak);
        return none$2(series).sort(function(a, b) {
            return peaks[a] - peaks[b];
        });
    }
    function peak(series) {
        for(var vi, i = -1, j = 0, n = series.length, vj = -1 / 0; ++i < n;)(vi = +series[i][1]) > vj && (vj = vi, j = i);
        return j;
    }
    function ascending$3(series) {
        var sums = series.map(sum$1);
        return none$2(series).sort(function(a, b) {
            return sums[a] - sums[b];
        });
    }
    function sum$1(series) {
        for(var v, s = 0, i = -1, n = series.length; ++i < n;)(v = +series[i][1]) && (s += v);
        return s;
    }
    LinearClosed.prototype = {
        areaStart: noop$3,
        areaEnd: noop$3,
        lineStart: function() {
            this._point = 0;
        },
        lineEnd: function() {
            this._point && this._context.closePath();
        },
        point: function(x, y) {
            x = +x, y = +y, this._point ? this._context.lineTo(x, y) : (this._point = 1, this._context.moveTo(x, y));
        }
    }, MonotoneX.prototype = {
        areaStart: function() {
            this._line = 0;
        },
        areaEnd: function() {
            this._line = NaN;
        },
        lineStart: function() {
            this._x0 = this._x1 = this._y0 = this._y1 = this._t0 = NaN, this._point = 0;
        },
        lineEnd: function() {
            switch(this._point){
                case 2:
                    this._context.lineTo(this._x1, this._y1);
                    break;
                case 3:
                    point$4(this, this._t0, slope2(this, this._t0));
            }
            (this._line || 0 !== this._line && 1 === this._point) && this._context.closePath(), this._line = 1 - this._line;
        },
        point: function(x, y) {
            var t1 = NaN;
            if (y = +y, (x = +x) !== this._x1 || y !== this._y1) {
                switch(this._point){
                    case 0:
                        this._point = 1, this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y);
                        break;
                    case 1:
                        this._point = 2;
                        break;
                    case 2:
                        this._point = 3, point$4(this, slope2(this, t1 = slope3(this, x, y)), t1);
                        break;
                    default:
                        point$4(this, this._t0, t1 = slope3(this, x, y));
                }
                this._x0 = this._x1, this._x1 = x, this._y0 = this._y1, this._y1 = y, this._t0 = t1;
            } // Ignore coincident points.
        }
    }, (MonotoneY.prototype = Object.create(MonotoneX.prototype)).point = function(x, y) {
        MonotoneX.prototype.point.call(this, y, x);
    }, ReflectContext.prototype = {
        moveTo: function(x, y) {
            this._context.moveTo(y, x);
        },
        closePath: function() {
            this._context.closePath();
        },
        lineTo: function(x, y) {
            this._context.lineTo(y, x);
        },
        bezierCurveTo: function(x1, y1, x2, y2, x, y) {
            this._context.bezierCurveTo(y1, x1, y2, x2, y, x);
        }
    }, Natural.prototype = {
        areaStart: function() {
            this._line = 0;
        },
        areaEnd: function() {
            this._line = NaN;
        },
        lineStart: function() {
            this._x = [], this._y = [];
        },
        lineEnd: function() {
            var x = this._x, y = this._y, n = x.length;
            if (n) {
                if (this._line ? this._context.lineTo(x[0], y[0]) : this._context.moveTo(x[0], y[0]), 2 === n) this._context.lineTo(x[1], y[1]);
                else for(var px = controlPoints(x), py = controlPoints(y), i0 = 0, i1 = 1; i1 < n; ++i0, ++i1)this._context.bezierCurveTo(px[0][i0], py[0][i0], px[1][i0], py[1][i0], x[i1], y[i1]);
            }
            (this._line || 0 !== this._line && 1 === n) && this._context.closePath(), this._line = 1 - this._line, this._x = this._y = null;
        },
        point: function(x, y) {
            this._x.push(+x), this._y.push(+y);
        }
    }, Step.prototype = {
        areaStart: function() {
            this._line = 0;
        },
        areaEnd: function() {
            this._line = NaN;
        },
        lineStart: function() {
            this._x = this._y = NaN, this._point = 0;
        },
        lineEnd: function() {
            0 < this._t && this._t < 1 && 2 === this._point && this._context.lineTo(this._x, this._y), (this._line || 0 !== this._line && 1 === this._point) && this._context.closePath(), this._line >= 0 && (this._t = 1 - this._t, this._line = 1 - this._line);
        },
        point: function(x, y) {
            switch(x = +x, y = +y, this._point){
                case 0:
                    this._point = 1, this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y);
                    break;
                case 1:
                    this._point = 2; // proceed
                default:
                    if (this._t <= 0) this._context.lineTo(this._x, y), this._context.lineTo(x, y);
                    else {
                        var x1 = this._x * (1 - this._t) + x * this._t;
                        this._context.lineTo(x1, this._y), this._context.lineTo(x1, y);
                    }
            }
            this._x = x, this._y = y;
        }
    };
    var constant$b = (x)=>()=>x;
    function ZoomEvent(type, { sourceEvent, target, transform, dispatch }) {
        Object.defineProperties(this, {
            type: {
                value: type,
                enumerable: !0,
                configurable: !0
            },
            sourceEvent: {
                value: sourceEvent,
                enumerable: !0,
                configurable: !0
            },
            target: {
                value: target,
                enumerable: !0,
                configurable: !0
            },
            transform: {
                value: transform,
                enumerable: !0,
                configurable: !0
            },
            _: {
                value: dispatch
            }
        });
    }
    function Transform(k, x, y) {
        this.k = k, this.x = x, this.y = y;
    }
    Transform.prototype = {
        constructor: Transform,
        scale: function(k) {
            return 1 === k ? this : new Transform(this.k * k, this.x, this.y);
        },
        translate: function(x, y) {
            return 0 === x & 0 === y ? this : new Transform(this.k, this.x + this.k * x, this.y + this.k * y);
        },
        apply: function(point) {
            return [
                point[0] * this.k + this.x,
                point[1] * this.k + this.y
            ];
        },
        applyX: function(x) {
            return x * this.k + this.x;
        },
        applyY: function(y) {
            return y * this.k + this.y;
        },
        invert: function(location) {
            return [
                (location[0] - this.x) / this.k,
                (location[1] - this.y) / this.k
            ];
        },
        invertX: function(x) {
            return (x - this.x) / this.k;
        },
        invertY: function(y) {
            return (y - this.y) / this.k;
        },
        rescaleX: function(x) {
            return x.copy().domain(x.range().map(this.invertX, this).map(x.invert, x));
        },
        rescaleY: function(y) {
            return y.copy().domain(y.range().map(this.invertY, this).map(y.invert, y));
        },
        toString: function() {
            return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
        }
    };
    var identity$9 = new Transform(1, 0, 0);
    function transform$1(node) {
        for(; !node.__zoom;)if (!(node = node.parentNode)) return identity$9;
        return node.__zoom;
    }
    function nopropagation$2(event) {
        event.stopImmediatePropagation();
    }
    function noevent$2(event) {
        event.preventDefault(), event.stopImmediatePropagation();
    }
    // Ignore right-click, since that should open the context menu.
    // except for pinch-to-zoom, which is sent as a wheel+ctrlKey event
    function defaultFilter$2(event) {
        return (!event.ctrlKey || 'wheel' === event.type) && !event.button;
    }
    function defaultExtent$1() {
        var e = this;
        return e instanceof SVGElement ? (e = e.ownerSVGElement || e).hasAttribute("viewBox") ? [
            [
                (e = e.viewBox.baseVal).x,
                e.y
            ],
            [
                e.x + e.width,
                e.y + e.height
            ]
        ] : [
            [
                0,
                0
            ],
            [
                e.width.baseVal.value,
                e.height.baseVal.value
            ]
        ] : [
            [
                0,
                0
            ],
            [
                e.clientWidth,
                e.clientHeight
            ]
        ];
    }
    function defaultTransform() {
        return this.__zoom || identity$9;
    }
    function defaultWheelDelta(event) {
        return -event.deltaY * (1 === event.deltaMode ? 0.05 : event.deltaMode ? 1 : 0.002) * (event.ctrlKey ? 10 : 1);
    }
    function defaultTouchable$2() {
        return navigator.maxTouchPoints || "ontouchstart" in this;
    }
    function defaultConstrain(transform, extent, translateExtent) {
        var dx0 = transform.invertX(extent[0][0]) - translateExtent[0][0], dx1 = transform.invertX(extent[1][0]) - translateExtent[1][0], dy0 = transform.invertY(extent[0][1]) - translateExtent[0][1], dy1 = transform.invertY(extent[1][1]) - translateExtent[1][1];
        return transform.translate(dx1 > dx0 ? (dx0 + dx1) / 2 : Math.min(0, dx0) || Math.max(0, dx1), dy1 > dy0 ? (dy0 + dy1) / 2 : Math.min(0, dy0) || Math.max(0, dy1));
    }
    transform$1.prototype = Transform.prototype, exports1.Adder = Adder, exports1.Delaunay = Delaunay, exports1.FormatSpecifier = FormatSpecifier, exports1.Voronoi = Voronoi, exports1.active = function(node, name) {
        var schedule, i, schedules = node.__transition;
        if (schedules) {
            for(i in name = null == name ? null : name + "", schedules)if ((schedule = schedules[i]).state > 1 && schedule.name === name) return new Transition([
                [
                    node
                ]
            ], root$1, name, +i);
        }
        return null;
    }, exports1.arc = function() {
        var innerRadius = arcInnerRadius, outerRadius = arcOuterRadius, cornerRadius = constant$a(0), padRadius = null, startAngle = arcStartAngle, endAngle = arcEndAngle, padAngle = arcPadAngle, context = null;
        function arc() {
            var buffer, r, r0 = +innerRadius.apply(this, arguments), r1 = +outerRadius.apply(this, arguments), a0 = startAngle.apply(this, arguments) - halfPi$3, a1 = endAngle.apply(this, arguments) - halfPi$3, da = abs$3(a1 - a0), cw = a1 > a0;
            // Is it a point?
            if (context || (context = buffer = path()), r1 < r0 && (r = r1, r1 = r0, r0 = r), r1 > 1e-12) {
                if (da > tau$5 - 1e-12) context.moveTo(r1 * cos$2(a0), r1 * sin$2(a0)), context.arc(0, 0, r1, a0, a1, !cw), r0 > 1e-12 && (context.moveTo(r0 * cos$2(a1), r0 * sin$2(a1)), context.arc(0, 0, r0, a1, a0, cw));
                else {
                    var t0, t1, a01 = a0, a11 = a1, a00 = a0, a10 = a1, da0 = da, da1 = da, ap = padAngle.apply(this, arguments) / 2, rp = ap > 1e-12 && (padRadius ? +padRadius.apply(this, arguments) : sqrt$2(r0 * r0 + r1 * r1)), rc = min$2(abs$3(r1 - r0) / 2, +cornerRadius.apply(this, arguments)), rc0 = rc, rc1 = rc;
                    // Apply padding? Note that since r1 ≥ r0, da1 ≥ da0.
                    if (rp > 1e-12) {
                        var p0 = asin$1(rp / r0 * sin$2(ap)), p1 = asin$1(rp / r1 * sin$2(ap));
                        (da0 -= 2 * p0) > 1e-12 ? (p0 *= cw ? 1 : -1, a00 += p0, a10 -= p0) : (da0 = 0, a00 = a10 = (a0 + a1) / 2), (da1 -= 2 * p1) > 1e-12 ? (p1 *= cw ? 1 : -1, a01 += p1, a11 -= p1) : (da1 = 0, a01 = a11 = (a0 + a1) / 2);
                    }
                    var x01 = r1 * cos$2(a01), y01 = r1 * sin$2(a01), x10 = r0 * cos$2(a10), y10 = r0 * sin$2(a10);
                    // Apply rounded corners?
                    if (rc > 1e-12) {
                        var oc, x11 = r1 * cos$2(a11), y11 = r1 * sin$2(a11), x00 = r0 * cos$2(a00), y00 = r0 * sin$2(a00);
                        // Restrict the corner radius according to the sector angle.
                        if (da < pi$4 && (oc = function(x0, y0, x1, y1, x2, y2, x3, y3) {
                            var x10 = x1 - x0, y10 = y1 - y0, x32 = x3 - x2, y32 = y3 - y2, t = y32 * x10 - x32 * y10;
                            if (!(t * t < 1e-12)) return t = (x32 * (y0 - y2) - y32 * (x0 - x2)) / t, [
                                x0 + t * x10,
                                y0 + t * y10
                            ];
                        }(x01, y01, x00, y00, x11, y11, x10, y10))) {
                            var x, ax = x01 - oc[0], ay = y01 - oc[1], bx = x11 - oc[0], by = y11 - oc[1], kc = 1 / sin$2(((x = (ax * bx + ay * by) / (sqrt$2(ax * ax + ay * ay) * sqrt$2(bx * bx + by * by))) > 1 ? 0 : x < -1 ? pi$4 : Math.acos(x)) / 2), lc = sqrt$2(oc[0] * oc[0] + oc[1] * oc[1]);
                            rc0 = min$2(rc, (r0 - lc) / (kc - 1)), rc1 = min$2(rc, (r1 - lc) / (kc + 1));
                        }
                    }
                    da1 > 1e-12 ? rc1 > 1e-12 ? (t0 = cornerTangents(x00, y00, x01, y01, r1, rc1, cw), t1 = cornerTangents(x11, y11, x10, y10, r1, rc1, cw), context.moveTo(t0.cx + t0.x01, t0.cy + t0.y01), rc1 < rc ? context.arc(t0.cx, t0.cy, rc1, atan2$1(t0.y01, t0.x01), atan2$1(t1.y01, t1.x01), !cw) : (context.arc(t0.cx, t0.cy, rc1, atan2$1(t0.y01, t0.x01), atan2$1(t0.y11, t0.x11), !cw), context.arc(0, 0, r1, atan2$1(t0.cy + t0.y11, t0.cx + t0.x11), atan2$1(t1.cy + t1.y11, t1.cx + t1.x11), !cw), context.arc(t1.cx, t1.cy, rc1, atan2$1(t1.y11, t1.x11), atan2$1(t1.y01, t1.x01), !cw))) : (context.moveTo(x01, y01), context.arc(0, 0, r1, a01, a11, !cw)) : context.moveTo(x01, y01), r0 > 1e-12 && da0 > 1e-12 ? rc0 > 1e-12 ? (t0 = cornerTangents(x10, y10, x11, y11, r0, -rc0, cw), t1 = cornerTangents(x01, y01, x00, y00, r0, -rc0, cw), context.lineTo(t0.cx + t0.x01, t0.cy + t0.y01), rc0 < rc ? context.arc(t0.cx, t0.cy, rc0, atan2$1(t0.y01, t0.x01), atan2$1(t1.y01, t1.x01), !cw) : (context.arc(t0.cx, t0.cy, rc0, atan2$1(t0.y01, t0.x01), atan2$1(t0.y11, t0.x11), !cw), context.arc(0, 0, r0, atan2$1(t0.cy + t0.y11, t0.cx + t0.x11), atan2$1(t1.cy + t1.y11, t1.cx + t1.x11), cw), context.arc(t1.cx, t1.cy, rc0, atan2$1(t1.y11, t1.x11), atan2$1(t1.y01, t1.x01), !cw))) : context.arc(0, 0, r0, a10, a00, cw) : context.lineTo(x10, y10);
                }
            } else context.moveTo(0, 0);
            if (context.closePath(), buffer) return context = null, buffer + "" || null;
        }
        return arc.centroid = function() {
            var r = (+innerRadius.apply(this, arguments) + +outerRadius.apply(this, arguments)) / 2, a = (+startAngle.apply(this, arguments) + +endAngle.apply(this, arguments)) / 2 - pi$4 / 2;
            return [
                cos$2(a) * r,
                sin$2(a) * r
            ];
        }, arc.innerRadius = function(_) {
            return arguments.length ? (innerRadius = "function" == typeof _ ? _ : constant$a(+_), arc) : innerRadius;
        }, arc.outerRadius = function(_) {
            return arguments.length ? (outerRadius = "function" == typeof _ ? _ : constant$a(+_), arc) : outerRadius;
        }, arc.cornerRadius = function(_) {
            return arguments.length ? (cornerRadius = "function" == typeof _ ? _ : constant$a(+_), arc) : cornerRadius;
        }, arc.padRadius = function(_) {
            return arguments.length ? (padRadius = null == _ ? null : "function" == typeof _ ? _ : constant$a(+_), arc) : padRadius;
        }, arc.startAngle = function(_) {
            return arguments.length ? (startAngle = "function" == typeof _ ? _ : constant$a(+_), arc) : startAngle;
        }, arc.endAngle = function(_) {
            return arguments.length ? (endAngle = "function" == typeof _ ? _ : constant$a(+_), arc) : endAngle;
        }, arc.padAngle = function(_) {
            return arguments.length ? (padAngle = "function" == typeof _ ? _ : constant$a(+_), arc) : padAngle;
        }, arc.context = function(_) {
            return arguments.length ? (context = null == _ ? null : _, arc) : context;
        }, arc;
    }, exports1.area = area$3, exports1.areaRadial = areaRadial, exports1.ascending = ascending, exports1.autoType = function(object) {
        for(var key in object){
            var number, m, value = object[key].trim();
            if (value) {
                if ("true" === value) value = !0;
                else if ("false" === value) value = !1;
                else if ("NaN" === value) value = NaN;
                else if (isNaN(number = +value)) {
                    if (!(m = value.match(/^([-+]\d{2})?\d{4}(-\d{2}(-\d{2})?)?(T\d{2}:\d{2}(:\d{2}(\.\d{3})?)?(Z|[-+]\d{2}:\d{2})?)?$/))) continue;
                    fixtz && m[4] && !m[7] && (value = value.replace(/-/g, "/").replace(/T/, " ")), value = new Date(value);
                } else value = number;
            } else value = null;
            object[key] = value;
        }
        return object;
    }, exports1.axisBottom = function(scale) {
        return axis(3, scale);
    }, exports1.axisLeft = function(scale) {
        return axis(4, scale);
    }, exports1.axisRight = function(scale) {
        return axis(2, scale);
    }, exports1.axisTop = function(scale) {
        return axis(1, scale);
    }, exports1.bin = bin, exports1.bisect = bisectRight, exports1.bisectCenter = bisectCenter, exports1.bisectLeft = bisectLeft, exports1.bisectRight = bisectRight, exports1.bisector = bisector, exports1.blob = function(input, init) {
        return fetch(input, init).then(responseBlob);
    }, exports1.brush = function() {
        return brush$1(XY);
    }, exports1.brushSelection = function(node) {
        var state = node.__brush;
        return state ? state.dim.output(state.selection) : null;
    }, exports1.brushX = function() {
        return brush$1(X);
    }, exports1.brushY = function() {
        return brush$1(Y);
    }, exports1.buffer = function(input, init) {
        return fetch(input, init).then(responseArrayBuffer);
    }, exports1.chord = function() {
        return chord$1(!1, !1);
    }, exports1.chordDirected = function() {
        return chord$1(!0, !1);
    }, exports1.chordTranspose = function() {
        return chord$1(!1, !0);
    }, exports1.cluster = function() {
        var separation = defaultSeparation, dx = 1, dy = 1, nodeSize = !1;
        function cluster(root) {
            var previousNode, x = 0;
            // First walk, computing the initial x & y values.
            root.eachAfter(function(node) {
                var children = node.children;
                children ? (node.x = children.reduce(meanXReduce, 0) / children.length, node.y = 1 + children.reduce(maxYReduce, 0)) : (node.x = previousNode ? x += separation(node, previousNode) : 0, node.y = 0, previousNode = node);
            });
            var left = function(node) {
                for(var children; children = node.children;)node = children[0];
                return node;
            }(root), right = function(node) {
                for(var children; children = node.children;)node = children[children.length - 1];
                return node;
            }(root), x0 = left.x - separation(left, right) / 2, x1 = right.x + separation(right, left) / 2;
            // Second walk, normalizing x & y to the desired size.
            return root.eachAfter(nodeSize ? function(node) {
                node.x = (node.x - root.x) * dx, node.y = (root.y - node.y) * dy;
            } : function(node) {
                node.x = (node.x - x0) / (x1 - x0) * dx, node.y = (1 - (root.y ? node.y / root.y : 1)) * dy;
            });
        }
        return cluster.separation = function(x) {
            return arguments.length ? (separation = x, cluster) : separation;
        }, cluster.size = function(x) {
            return arguments.length ? (nodeSize = !1, dx = +x[0], dy = +x[1], cluster) : nodeSize ? null : [
                dx,
                dy
            ];
        }, cluster.nodeSize = function(x) {
            return arguments.length ? (nodeSize = !0, dx = +x[0], dy = +x[1], cluster) : nodeSize ? [
                dx,
                dy
            ] : null;
        }, cluster;
    }, exports1.color = color, exports1.contourDensity = function() {
        var x = defaultX, y = defaultY, weight = defaultWeight, dx = 960, dy = 500, r = 20, k = 2, o = 60, n = 270, m = 155, threshold = constant$6(20);
        function density(data) {
            var values0 = new Float32Array(n * m), values1 = new Float32Array(n * m);
            data.forEach(function(d, i, data) {
                var xi = +x(d, i, data) + o >> k, yi = +y(d, i, data) + o >> k, wi = +weight(d, i, data);
                xi >= 0 && xi < n && yi >= 0 && yi < m && (values0[xi + yi * n] += wi);
            }), // TODO Optimize.
            blurX({
                width: n,
                height: m,
                data: values0
            }, {
                width: n,
                height: m,
                data: values1
            }, r >> k), blurY({
                width: n,
                height: m,
                data: values1
            }, {
                width: n,
                height: m,
                data: values0
            }, r >> k), blurX({
                width: n,
                height: m,
                data: values0
            }, {
                width: n,
                height: m,
                data: values1
            }, r >> k), blurY({
                width: n,
                height: m,
                data: values1
            }, {
                width: n,
                height: m,
                data: values0
            }, r >> k), blurX({
                width: n,
                height: m,
                data: values0
            }, {
                width: n,
                height: m,
                data: values1
            }, r >> k), blurY({
                width: n,
                height: m,
                data: values1
            }, {
                width: n,
                height: m,
                data: values0
            }, r >> k);
            var tz = threshold(values0);
            // Convert number of thresholds into uniform thresholds.
            if (!Array.isArray(tz)) {
                var stop = max(values0);
                tz = tickStep(0, stop, tz), (tz = sequence(0, Math.floor(stop / tz) * tz, tz)).shift();
            }
            return contours().thresholds(tz).size([
                n,
                m
            ])(values0).map(transform);
        }
        function transform(geometry) {
            return geometry.value *= Math.pow(2, -2 * k), geometry.coordinates.forEach(transformPolygon), geometry;
        }
        function transformPolygon(coordinates) {
            coordinates.forEach(transformRing);
        }
        function transformRing(coordinates) {
            coordinates.forEach(transformPoint);
        }
        // TODO Optimize.
        function transformPoint(coordinates) {
            coordinates[0] = coordinates[0] * Math.pow(2, k) - o, coordinates[1] = coordinates[1] * Math.pow(2, k) - o;
        }
        function resize() {
            return n = dx + 2 * (o = 3 * r) >> k, m = dy + 2 * o >> k, density;
        }
        return density.x = function(_) {
            return arguments.length ? (x = "function" == typeof _ ? _ : constant$6(+_), density) : x;
        }, density.y = function(_) {
            return arguments.length ? (y = "function" == typeof _ ? _ : constant$6(+_), density) : y;
        }, density.weight = function(_) {
            return arguments.length ? (weight = "function" == typeof _ ? _ : constant$6(+_), density) : weight;
        }, density.size = function(_) {
            if (!arguments.length) return [
                dx,
                dy
            ];
            var _0 = +_[0], _1 = +_[1];
            if (!(_0 >= 0 && _1 >= 0)) throw Error("invalid size");
            return dx = _0, dy = _1, resize();
        }, density.cellSize = function(_) {
            if (!arguments.length) return 1 << k;
            if (!((_ = +_) >= 1)) throw Error("invalid cell size");
            return k = Math.floor(Math.log(_) / Math.LN2), resize();
        }, density.thresholds = function(_) {
            return arguments.length ? (threshold = "function" == typeof _ ? _ : Array.isArray(_) ? constant$6(slice$3.call(_)) : constant$6(_), density) : threshold;
        }, density.bandwidth = function(_) {
            if (!arguments.length) return Math.sqrt(r * (r + 1));
            if (!((_ = +_) >= 0)) throw Error("invalid bandwidth");
            return r = Math.round((Math.sqrt(4 * _ * _ + 1) - 1) / 2), resize();
        }, density;
    }, exports1.contours = contours, exports1.count = count, exports1.create = function(name) {
        return select(creator(name).call(document.documentElement));
    }, exports1.creator = creator, exports1.cross = function(...values) {
        var reduce;
        const reduce1 = "function" == typeof values[values.length - 1] && (reduce = values.pop(), (values)=>reduce(...values)), lengths = (values = values.map(arrayify)).map(length), j = values.length - 1, index = Array(j + 1).fill(0), product = [];
        if (j < 0 || lengths.some(empty)) return product;
        for(;;){
            product.push(index.map((j, i)=>values[i][j]));
            let i = j;
            for(; ++index[i] === lengths[i];){
                if (0 === i) return reduce1 ? product.map(reduce1) : product;
                index[i--] = 0;
            }
        }
    }, exports1.csv = csv$1, exports1.csvFormat = csvFormat, exports1.csvFormatBody = csvFormatBody, exports1.csvFormatRow = csvFormatRow, exports1.csvFormatRows = csvFormatRows, exports1.csvFormatValue = csvFormatValue, exports1.csvParse = csvParse, exports1.csvParseRows = csvParseRows, exports1.cubehelix = cubehelix, exports1.cumsum = function(values, valueof) {
        var sum = 0, index = 0;
        return Float64Array.from(values, void 0 === valueof ? (v)=>sum += +v || 0 : (v)=>sum += +valueof(v, index++, values) || 0);
    }, exports1.curveBasis = function(context) {
        return new Basis(context);
    }, exports1.curveBasisClosed = function(context) {
        return new BasisClosed(context);
    }, exports1.curveBasisOpen = function(context) {
        return new BasisOpen(context);
    }, exports1.curveBundle = bundle, exports1.curveCardinal = cardinal, exports1.curveCardinalClosed = cardinalClosed, exports1.curveCardinalOpen = cardinalOpen, exports1.curveCatmullRom = catmullRom, exports1.curveCatmullRomClosed = catmullRomClosed, exports1.curveCatmullRomOpen = catmullRomOpen, exports1.curveLinear = curveLinear, exports1.curveLinearClosed = function(context) {
        return new LinearClosed(context);
    }, exports1.curveMonotoneX = function(context) {
        return new MonotoneX(context);
    }, exports1.curveMonotoneY = function(context) {
        return new MonotoneY(context);
    }, exports1.curveNatural = function(context) {
        return new Natural(context);
    }, exports1.curveStep = function(context) {
        return new Step(context, 0.5);
    }, exports1.curveStepAfter = function(context) {
        return new Step(context, 1);
    }, exports1.curveStepBefore = function(context) {
        return new Step(context, 0);
    }, exports1.descending = function(a, b) {
        return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
    }, exports1.deviation = deviation, exports1.difference = function(values, ...others) {
        for (const other of (values = new Set(values), others))for (const value of other)values.delete(value);
        return values;
    }, exports1.disjoint = function(values, other) {
        const iterator = other[Symbol.iterator](), set = new Set();
        for (const v of values){
            let value, done;
            if (set.has(v)) return !1;
            for(; ({ value, done } = iterator.next()) && !done;){
                if (Object.is(v, value)) return !1;
                set.add(value);
            }
        }
        return !0;
    }, exports1.dispatch = dispatch, exports1.drag = function() {
        var mousedownx, mousedowny, mousemoving, touchending, filter = defaultFilter, container = defaultContainer, subject = defaultSubject, touchable = defaultTouchable, gestures = {}, listeners = dispatch("start", "drag", "end"), active = 0, clickDistance2 = 0;
        function drag(selection) {
            selection.on("mousedown.drag", mousedowned).filter(touchable).on("touchstart.drag", touchstarted).on("touchmove.drag", touchmoved).on("touchend.drag touchcancel.drag", touchended).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
        }
        function mousedowned(event, d) {
            if (!touchending && filter.call(this, event, d)) {
                var gesture = beforestart(this, container.call(this, event, d), event, d, "mouse");
                gesture && (select(event.view).on("mousemove.drag", mousemoved, !0).on("mouseup.drag", mouseupped, !0), dragDisable(event.view), nopropagation(event), mousemoving = !1, mousedownx = event.clientX, mousedowny = event.clientY, gesture("start", event));
            }
        }
        function mousemoved(event) {
            if (noevent(event), !mousemoving) {
                var dx = event.clientX - mousedownx, dy = event.clientY - mousedowny;
                mousemoving = dx * dx + dy * dy > clickDistance2;
            }
            gestures.mouse("drag", event);
        }
        function mouseupped(event) {
            select(event.view).on("mousemove.drag mouseup.drag", null), yesdrag(event.view, mousemoving), noevent(event), gestures.mouse("end", event);
        }
        function touchstarted(event, d) {
            if (filter.call(this, event, d)) {
                var i, gesture, touches = event.changedTouches, c = container.call(this, event, d), n = touches.length;
                for(i = 0; i < n; ++i)(gesture = beforestart(this, c, event, d, touches[i].identifier, touches[i])) && (nopropagation(event), gesture("start", event, touches[i]));
            }
        }
        function touchmoved(event) {
            var i, gesture, touches = event.changedTouches, n = touches.length;
            for(i = 0; i < n; ++i)(gesture = gestures[touches[i].identifier]) && (noevent(event), gesture("drag", event, touches[i]));
        }
        function touchended(event) {
            var i, gesture, touches = event.changedTouches, n = touches.length;
            for(touchending && clearTimeout(touchending), touchending = setTimeout(function() {
                touchending = null;
            }, 500), i = 0; i < n; ++i)(gesture = gestures[touches[i].identifier]) && (nopropagation(event), gesture("end", event, touches[i]));
        }
        function beforestart(that, container, event, d, identifier, touch) {
            var dx, dy, s, dispatch = listeners.copy(), p = pointer(touch || event, container);
            if (null != (s = subject.call(that, new DragEvent("beforestart", {
                sourceEvent: event,
                target: drag,
                identifier,
                active,
                x: p[0],
                y: p[1],
                dx: 0,
                dy: 0,
                dispatch
            }), d))) return dx = s.x - p[0] || 0, dy = s.y - p[1] || 0, function gesture(type, event, touch) {
                var n, p0 = p;
                switch(type){
                    case "start":
                        gestures[identifier] = gesture, n = active++;
                        break;
                    case "end":
                        delete gestures[identifier], --active; // nobreak
                    case "drag":
                        p = pointer(touch || event, container), n = active;
                }
                dispatch.call(type, that, new DragEvent(type, {
                    sourceEvent: event,
                    subject: s,
                    target: drag,
                    identifier,
                    active: n,
                    x: p[0] + dx,
                    y: p[1] + dy,
                    dx: p[0] - p0[0],
                    dy: p[1] - p0[1],
                    dispatch
                }), d);
            };
        }
        return drag.filter = function(_) {
            return arguments.length ? (filter = "function" == typeof _ ? _ : constant$2(!!_), drag) : filter;
        }, drag.container = function(_) {
            return arguments.length ? (container = "function" == typeof _ ? _ : constant$2(_), drag) : container;
        }, drag.subject = function(_) {
            return arguments.length ? (subject = "function" == typeof _ ? _ : constant$2(_), drag) : subject;
        }, drag.touchable = function(_) {
            return arguments.length ? (touchable = "function" == typeof _ ? _ : constant$2(!!_), drag) : touchable;
        }, drag.on = function() {
            var value = listeners.on.apply(listeners, arguments);
            return value === listeners ? drag : value;
        }, drag.clickDistance = function(_) {
            return arguments.length ? (clickDistance2 = (_ = +_) * _, drag) : Math.sqrt(clickDistance2);
        }, drag;
    }, exports1.dragDisable = dragDisable, exports1.dragEnable = yesdrag, exports1.dsv = function(delimiter, input, init, row) {
        3 == arguments.length && "function" == typeof init && (row = init, init = void 0);
        var format = dsvFormat(delimiter);
        return text(input, init).then(function(response) {
            return format.parse(response, row);
        });
    }, exports1.dsvFormat = dsvFormat, exports1.easeBack = backInOut, exports1.easeBackIn = backIn, exports1.easeBackInOut = backInOut, exports1.easeBackOut = backOut, exports1.easeBounce = bounceOut, exports1.easeBounceIn = function(t) {
        return 1 - bounceOut(1 - t);
    }, exports1.easeBounceInOut = function(t) {
        return ((t *= 2) <= 1 ? 1 - bounceOut(1 - t) : bounceOut(t - 1) + 1) / 2;
    }, exports1.easeBounceOut = bounceOut, exports1.easeCircle = circleInOut, exports1.easeCircleIn = function(t) {
        return 1 - Math.sqrt(1 - t * t);
    }, exports1.easeCircleInOut = circleInOut, exports1.easeCircleOut = function(t) {
        return Math.sqrt(1 - --t * t);
    }, exports1.easeCubic = cubicInOut, exports1.easeCubicIn = function(t) {
        return t * t * t;
    }, exports1.easeCubicInOut = cubicInOut, exports1.easeCubicOut = function(t) {
        return --t * t * t + 1;
    }, exports1.easeElastic = elasticOut, exports1.easeElasticIn = elasticIn, exports1.easeElasticInOut = elasticInOut, exports1.easeElasticOut = elasticOut, exports1.easeExp = expInOut, exports1.easeExpIn = function(t) {
        return tpmt(1 - +t);
    }, exports1.easeExpInOut = expInOut, exports1.easeExpOut = function(t) {
        return 1 - tpmt(t);
    }, exports1.easeLinear = (t)=>+t, exports1.easePoly = polyInOut, exports1.easePolyIn = polyIn, exports1.easePolyInOut = polyInOut, exports1.easePolyOut = polyOut, exports1.easeQuad = quadInOut, exports1.easeQuadIn = function(t) {
        return t * t;
    }, exports1.easeQuadInOut = quadInOut, exports1.easeQuadOut = function(t) {
        return t * (2 - t);
    }, exports1.easeSin = sinInOut, exports1.easeSinIn = function(t) {
        return 1 == +t ? 1 : 1 - Math.cos(t * halfPi);
    }, exports1.easeSinInOut = sinInOut, exports1.easeSinOut = function(t) {
        return Math.sin(t * halfPi);
    }, exports1.every = function(values, test) {
        if ("function" != typeof test) throw TypeError("test is not a function");
        let index = -1;
        for (const value of values)if (!test(value, ++index, values)) return !1;
        return !0;
    }, exports1.extent = extent, exports1.filter = function(values, test) {
        if ("function" != typeof test) throw TypeError("test is not a function");
        const array = [];
        let index = -1;
        for (const value of values)test(value, ++index, values) && array.push(value);
        return array;
    }, exports1.forceCenter = function(x, y) {
        var nodes, strength = 1;
        function force() {
            var i, node, n = nodes.length, sx = 0, sy = 0;
            for(i = 0; i < n; ++i)sx += (node = nodes[i]).x, sy += node.y;
            for(sx = (sx / n - x) * strength, sy = (sy / n - y) * strength, i = 0; i < n; ++i)node = nodes[i], node.x -= sx, node.y -= sy;
        }
        return null == x && (x = 0), null == y && (y = 0), force.initialize = function(_) {
            nodes = _;
        }, force.x = function(_) {
            return arguments.length ? (x = +_, force) : x;
        }, force.y = function(_) {
            return arguments.length ? (y = +_, force) : y;
        }, force.strength = function(_) {
            return arguments.length ? (strength = +_, force) : strength;
        }, force;
    }, exports1.forceCollide = function(radius) {
        var nodes, radii, random, strength = 1, iterations = 1;
        function force() {
            for(var i, tree, node, xi, yi, ri, ri2, n = nodes.length, k = 0; k < iterations; ++k)for(i = 0, tree = quadtree(nodes, x, y).visitAfter(prepare); i < n; ++i)ri2 = (ri = radii[(node = nodes[i]).index]) * ri, xi = node.x + node.vx, yi = node.y + node.vy, tree.visit(apply);
            function apply(quad, x0, y0, x1, y1) {
                var data = quad.data, rj = quad.r, r = ri + rj;
                if (data) {
                    if (data.index > node.index) {
                        var x = xi - data.x - data.vx, y = yi - data.y - data.vy, l = x * x + y * y;
                        l < r * r && (0 === x && (l += (x = jiggle(random)) * x), 0 === y && (l += (y = jiggle(random)) * y), l = (r - (l = Math.sqrt(l))) / l * strength, node.vx += (x *= l) * (r = (rj *= rj) / (ri2 + rj)), node.vy += (y *= l) * r, data.vx -= x * (r = 1 - r), data.vy -= y * r);
                    }
                    return;
                }
                return x0 > xi + r || x1 < xi - r || y0 > yi + r || y1 < yi - r;
            }
        }
        function prepare(quad) {
            if (quad.data) return quad.r = radii[quad.data.index];
            for(var i = quad.r = 0; i < 4; ++i)quad[i] && quad[i].r > quad.r && (quad.r = quad[i].r);
        }
        function initialize() {
            if (nodes) {
                var i, node, n = nodes.length;
                for(i = 0, radii = Array(n); i < n; ++i)radii[(node = nodes[i]).index] = +radius(node, i, nodes);
            }
        }
        return "function" != typeof radius && (radius = constant$7(null == radius ? 1 : +radius)), force.initialize = function(_nodes, _random) {
            nodes = _nodes, random = _random, initialize();
        }, force.iterations = function(_) {
            return arguments.length ? (iterations = +_, force) : iterations;
        }, force.strength = function(_) {
            return arguments.length ? (strength = +_, force) : strength;
        }, force.radius = function(_) {
            return arguments.length ? (radius = "function" == typeof _ ? _ : constant$7(+_), initialize(), force) : radius;
        }, force;
    }, exports1.forceLink = function(links) {
        var strengths, distances, nodes, count, bias, random, id = index$1, strength = function(link) {
            return 1 / Math.min(count[link.source.index], count[link.target.index]);
        }, distance = constant$7(30), iterations = 1;
        function force(alpha) {
            for(var k = 0, n = links.length; k < iterations; ++k)for(var link, source, target, x, y, l, b, i = 0; i < n; ++i)source = (link = links[i]).source, l = ((l = Math.sqrt((x = (target = link.target).x + target.vx - source.x - source.vx || jiggle(random)) * x + (y = target.y + target.vy - source.y - source.vy || jiggle(random)) * y)) - distances[i]) / l * alpha * strengths[i], x *= l, y *= l, target.vx -= x * (b = bias[i]), target.vy -= y * b, source.vx += x * (b = 1 - b), source.vy += y * b;
        }
        function initialize() {
            if (nodes) {
                var i, link, n = nodes.length, m = links.length, nodeById = new Map(nodes.map((d, i)=>[
                        id(d, i, nodes),
                        d
                    ]));
                for(i = 0, count = Array(n); i < m; ++i)(link = links[i]).index = i, "object" != typeof link.source && (link.source = find$1(nodeById, link.source)), "object" != typeof link.target && (link.target = find$1(nodeById, link.target)), count[link.source.index] = (count[link.source.index] || 0) + 1, count[link.target.index] = (count[link.target.index] || 0) + 1;
                for(i = 0, bias = Array(m); i < m; ++i)link = links[i], bias[i] = count[link.source.index] / (count[link.source.index] + count[link.target.index]);
                strengths = Array(m), initializeStrength(), distances = Array(m), initializeDistance();
            }
        }
        function initializeStrength() {
            if (nodes) for(var i = 0, n = links.length; i < n; ++i)strengths[i] = +strength(links[i], i, links);
        }
        function initializeDistance() {
            if (nodes) for(var i = 0, n = links.length; i < n; ++i)distances[i] = +distance(links[i], i, links);
        }
        return null == links && (links = []), force.initialize = function(_nodes, _random) {
            nodes = _nodes, random = _random, initialize();
        }, force.links = function(_) {
            return arguments.length ? (links = _, initialize(), force) : links;
        }, force.id = function(_) {
            return arguments.length ? (id = _, force) : id;
        }, force.iterations = function(_) {
            return arguments.length ? (iterations = +_, force) : iterations;
        }, force.strength = function(_) {
            return arguments.length ? (strength = "function" == typeof _ ? _ : constant$7(+_), initializeStrength(), force) : strength;
        }, force.distance = function(_) {
            return arguments.length ? (distance = "function" == typeof _ ? _ : constant$7(+_), initializeDistance(), force) : distance;
        }, force;
    }, exports1.forceManyBody = function() {
        var nodes, node, random, alpha, strengths, strength = constant$7(-30), distanceMin2 = 1, distanceMax2 = 1 / 0, theta2 = 0.81;
        function force(_) {
            var i, n = nodes.length, tree = quadtree(nodes, x$1, y$1).visitAfter(accumulate);
            for(alpha = _, i = 0; i < n; ++i)node = nodes[i], tree.visit(apply);
        }
        function initialize() {
            if (nodes) {
                var i, node, n = nodes.length;
                for(i = 0, strengths = Array(n); i < n; ++i)strengths[(node = nodes[i]).index] = +strength(node, i, nodes);
            }
        }
        function accumulate(quad) {
            var q, c, x, y, i, strength = 0, weight = 0;
            // For internal nodes, accumulate forces from child quadrants.
            if (quad.length) {
                for(x = y = i = 0; i < 4; ++i)(q = quad[i]) && (c = Math.abs(q.value)) && (strength += q.value, weight += c, x += c * q.x, y += c * q.y);
                quad.x = x / weight, quad.y = y / weight;
            } else {
                (q = quad).x = q.data.x, q.y = q.data.y;
                do strength += strengths[q.data.index];
                while (q = q.next)
            }
            quad.value = strength;
        }
        function apply(quad, x1, _, x2) {
            if (!quad.value) return !0;
            var x = quad.x - node.x, y = quad.y - node.y, w = x2 - x1, l = x * x + y * y;
            // Apply the Barnes-Hut approximation if possible.
            // Limit forces for very close nodes; randomize direction if coincident.
            if (w * w / theta2 < l) return l < distanceMax2 && (0 === x && (l += (x = jiggle(random)) * x), 0 === y && (l += (y = jiggle(random)) * y), l < distanceMin2 && (l = Math.sqrt(distanceMin2 * l)), node.vx += x * quad.value * alpha / l, node.vy += y * quad.value * alpha / l), !0;
            if (!quad.length && !(l >= distanceMax2)) {
                // Limit forces for very close nodes; randomize direction if coincident.
                (quad.data !== node || quad.next) && (0 === x && (l += (x = jiggle(random)) * x), 0 === y && (l += (y = jiggle(random)) * y), l < distanceMin2 && (l = Math.sqrt(distanceMin2 * l)));
                do quad.data !== node && (w = strengths[quad.data.index] * alpha / l, node.vx += x * w, node.vy += y * w);
                while (quad = quad.next)
            }
        }
        return force.initialize = function(_nodes, _random) {
            nodes = _nodes, random = _random, initialize();
        }, force.strength = function(_) {
            return arguments.length ? (strength = "function" == typeof _ ? _ : constant$7(+_), initialize(), force) : strength;
        }, force.distanceMin = function(_) {
            return arguments.length ? (distanceMin2 = _ * _, force) : Math.sqrt(distanceMin2);
        }, force.distanceMax = function(_) {
            return arguments.length ? (distanceMax2 = _ * _, force) : Math.sqrt(distanceMax2);
        }, force.theta = function(_) {
            return arguments.length ? (theta2 = _ * _, force) : Math.sqrt(theta2);
        }, force;
    }, exports1.forceRadial = function(radius, x, y) {
        var nodes, strengths, radiuses, strength = constant$7(0.1);
        function force(alpha) {
            for(var i = 0, n = nodes.length; i < n; ++i){
                var node = nodes[i], dx = node.x - x || 1e-6, dy = node.y - y || 1e-6, r = Math.sqrt(dx * dx + dy * dy), k = (radiuses[i] - r) * strengths[i] * alpha / r;
                node.vx += dx * k, node.vy += dy * k;
            }
        }
        function initialize() {
            if (nodes) {
                var i, n = nodes.length;
                for(i = 0, strengths = Array(n), radiuses = Array(n); i < n; ++i)radiuses[i] = +radius(nodes[i], i, nodes), strengths[i] = isNaN(radiuses[i]) ? 0 : +strength(nodes[i], i, nodes);
            }
        }
        return "function" != typeof radius && (radius = constant$7(+radius)), null == x && (x = 0), null == y && (y = 0), force.initialize = function(_) {
            nodes = _, initialize();
        }, force.strength = function(_) {
            return arguments.length ? (strength = "function" == typeof _ ? _ : constant$7(+_), initialize(), force) : strength;
        }, force.radius = function(_) {
            return arguments.length ? (radius = "function" == typeof _ ? _ : constant$7(+_), initialize(), force) : radius;
        }, force.x = function(_) {
            return arguments.length ? (x = +_, force) : x;
        }, force.y = function(_) {
            return arguments.length ? (y = +_, force) : y;
        }, force;
    }, exports1.forceSimulation = function(nodes) {
        let s;
        var simulation, alpha = 1, alphaMin = 0.001, alphaDecay = 1 - Math.pow(0.001, 1 / 300), alphaTarget = 0, velocityDecay = 0.6, forces = new Map(), stepper = timer(step), event = dispatch("tick", "end"), random = (s = 1, ()=>(s = (1664525 * s + 1013904223) % 4294967296) / 4294967296);
        function step() {
            tick(), event.call("tick", simulation), alpha < alphaMin && (stepper.stop(), event.call("end", simulation));
        }
        function tick(iterations) {
            var i, node, n = nodes.length;
            void 0 === iterations && (iterations = 1);
            for(var k = 0; k < iterations; ++k)for(alpha += (alphaTarget - alpha) * alphaDecay, forces.forEach(function(force) {
                force(alpha);
            }), i = 0; i < n; ++i)null == (node = nodes[i]).fx ? node.x += node.vx *= velocityDecay : (node.x = node.fx, node.vx = 0), null == node.fy ? node.y += node.vy *= velocityDecay : (node.y = node.fy, node.vy = 0);
            return simulation;
        }
        function initializeNodes() {
            for(var node, i = 0, n = nodes.length; i < n; ++i){
                if ((node = nodes[i]).index = i, null != node.fx && (node.x = node.fx), null != node.fy && (node.y = node.fy), isNaN(node.x) || isNaN(node.y)) {
                    var radius = 10 * Math.sqrt(0.5 + i), angle = i * initialAngle;
                    node.x = radius * Math.cos(angle), node.y = radius * Math.sin(angle);
                }
                (isNaN(node.vx) || isNaN(node.vy)) && (node.vx = node.vy = 0);
            }
        }
        function initializeForce(force) {
            return force.initialize && force.initialize(nodes, random), force;
        }
        return null == nodes && (nodes = []), initializeNodes(), simulation = {
            tick: tick,
            restart: function() {
                return stepper.restart(step), simulation;
            },
            stop: function() {
                return stepper.stop(), simulation;
            },
            nodes: function(_) {
                return arguments.length ? (nodes = _, initializeNodes(), forces.forEach(initializeForce), simulation) : nodes;
            },
            alpha: function(_) {
                return arguments.length ? (alpha = +_, simulation) : alpha;
            },
            alphaMin: function(_) {
                return arguments.length ? (alphaMin = +_, simulation) : alphaMin;
            },
            alphaDecay: function(_) {
                return arguments.length ? (alphaDecay = +_, simulation) : +alphaDecay;
            },
            alphaTarget: function(_) {
                return arguments.length ? (alphaTarget = +_, simulation) : alphaTarget;
            },
            velocityDecay: function(_) {
                return arguments.length ? (velocityDecay = 1 - _, simulation) : 1 - velocityDecay;
            },
            randomSource: function(_) {
                return arguments.length ? (random = _, forces.forEach(initializeForce), simulation) : random;
            },
            force: function(name, _) {
                return arguments.length > 1 ? (null == _ ? forces.delete(name) : forces.set(name, initializeForce(_)), simulation) : forces.get(name);
            },
            find: function(x, y, radius) {
                var dx, dy, d2, node, closest, i = 0, n = nodes.length;
                for(null == radius ? radius = 1 / 0 : radius *= radius, i = 0; i < n; ++i)(d2 = (dx = x - (node = nodes[i]).x) * dx + (dy = y - node.y) * dy) < radius && (closest = node, radius = d2);
                return closest;
            },
            on: function(name, _) {
                return arguments.length > 1 ? (event.on(name, _), simulation) : event.on(name);
            }
        };
    }, exports1.forceX = function(x) {
        var nodes, strengths, xz, strength = constant$7(0.1);
        function force(alpha) {
            for(var node, i = 0, n = nodes.length; i < n; ++i)node = nodes[i], node.vx += (xz[i] - node.x) * strengths[i] * alpha;
        }
        function initialize() {
            if (nodes) {
                var i, n = nodes.length;
                for(i = 0, strengths = Array(n), xz = Array(n); i < n; ++i)strengths[i] = isNaN(xz[i] = +x(nodes[i], i, nodes)) ? 0 : +strength(nodes[i], i, nodes);
            }
        }
        return "function" != typeof x && (x = constant$7(null == x ? 0 : +x)), force.initialize = function(_) {
            nodes = _, initialize();
        }, force.strength = function(_) {
            return arguments.length ? (strength = "function" == typeof _ ? _ : constant$7(+_), initialize(), force) : strength;
        }, force.x = function(_) {
            return arguments.length ? (x = "function" == typeof _ ? _ : constant$7(+_), initialize(), force) : x;
        }, force;
    }, exports1.forceY = function(y) {
        var nodes, strengths, yz, strength = constant$7(0.1);
        function force(alpha) {
            for(var node, i = 0, n = nodes.length; i < n; ++i)node = nodes[i], node.vy += (yz[i] - node.y) * strengths[i] * alpha;
        }
        function initialize() {
            if (nodes) {
                var i, n = nodes.length;
                for(i = 0, strengths = Array(n), yz = Array(n); i < n; ++i)strengths[i] = isNaN(yz[i] = +y(nodes[i], i, nodes)) ? 0 : +strength(nodes[i], i, nodes);
            }
        }
        return "function" != typeof y && (y = constant$7(null == y ? 0 : +y)), force.initialize = function(_) {
            nodes = _, initialize();
        }, force.strength = function(_) {
            return arguments.length ? (strength = "function" == typeof _ ? _ : constant$7(+_), initialize(), force) : strength;
        }, force.y = function(_) {
            return arguments.length ? (y = "function" == typeof _ ? _ : constant$7(+_), initialize(), force) : y;
        }, force;
    }, exports1.formatDefaultLocale = defaultLocale, exports1.formatLocale = formatLocale, exports1.formatSpecifier = formatSpecifier, exports1.fsum = function(values, valueof) {
        const adder = new Adder();
        if (void 0 === valueof) for (let value of values)(value = +value) && adder.add(value);
        else {
            let index = -1;
            for (let value of values)(value = +valueof(value, ++index, values)) && adder.add(value);
        }
        return +adder;
    }, exports1.geoAlbers = albers, exports1.geoAlbersUsa = // A composite projection for the United States, configured by default for
    // 960×500. The projection also works quite well at 960×600 if you change the
    // scale to 1285 and adjust the translate accordingly. The set of standard
    // parallels for each region comes from USGS, which is published here:
    // http://egsc.usgs.gov/isb/pubs/MapProjections/projections.html#albers
    function() {
        var cache, cacheStream, lower48Point, alaskaPoint, hawaiiPoint, point, lower48 = albers(), alaska = conicEqualArea().rotate([
            154,
            0
        ]).center([
            -2,
            58.5
        ]).parallels([
            55,
            65
        ]), hawaii = conicEqualArea().rotate([
            157,
            0
        ]).center([
            -3,
            19.9
        ]).parallels([
            8,
            18
        ]), pointStream = {
            point: function(x, y) {
                point = [
                    x,
                    y
                ];
            }
        };
        function albersUsa(coordinates) {
            var x = coordinates[0], y = coordinates[1];
            return point = null, lower48Point.point(x, y), point || (alaskaPoint.point(x, y), point) || (hawaiiPoint.point(x, y), point);
        }
        function reset() {
            return cache = cacheStream = null, albersUsa;
        }
        return albersUsa.invert = function(coordinates) {
            var k = lower48.scale(), t = lower48.translate(), x = (coordinates[0] - t[0]) / k, y = (coordinates[1] - t[1]) / k;
            return (y >= 0.120 && y < 0.234 && x >= -0.425 && x < -0.214 ? alaska : y >= 0.166 && y < 0.234 && x >= -0.214 && x < -0.115 ? hawaii : lower48).invert(coordinates);
        }, albersUsa.stream = function(stream) {
            var streams, n;
            return cache && cacheStream === stream ? cache : (n = (streams = [
                lower48.stream(cacheStream = stream),
                alaska.stream(stream),
                hawaii.stream(stream)
            ]).length, cache = {
                point: function(x, y) {
                    for(var i = -1; ++i < n;)streams[i].point(x, y);
                },
                sphere: function() {
                    for(var i = -1; ++i < n;)streams[i].sphere();
                },
                lineStart: function() {
                    for(var i = -1; ++i < n;)streams[i].lineStart();
                },
                lineEnd: function() {
                    for(var i = -1; ++i < n;)streams[i].lineEnd();
                },
                polygonStart: function() {
                    for(var i = -1; ++i < n;)streams[i].polygonStart();
                },
                polygonEnd: function() {
                    for(var i = -1; ++i < n;)streams[i].polygonEnd();
                }
            });
        }, albersUsa.precision = function(_) {
            return arguments.length ? (lower48.precision(_), alaska.precision(_), hawaii.precision(_), reset()) : lower48.precision();
        }, albersUsa.scale = function(_) {
            return arguments.length ? (lower48.scale(_), alaska.scale(0.35 * _), hawaii.scale(_), albersUsa.translate(lower48.translate())) : lower48.scale();
        }, albersUsa.translate = function(_) {
            if (!arguments.length) return lower48.translate();
            var k = lower48.scale(), x = +_[0], y = +_[1];
            return lower48Point = lower48.translate(_).clipExtent([
                [
                    x - 0.455 * k,
                    y - 0.238 * k
                ],
                [
                    x + 0.455 * k,
                    y + 0.238 * k
                ]
            ]).stream(pointStream), alaskaPoint = alaska.translate([
                x - 0.307 * k,
                y + 0.201 * k
            ]).clipExtent([
                [
                    x - 0.425 * k + 1e-6,
                    y + 0.120 * k + 1e-6
                ],
                [
                    x - 0.214 * k - 1e-6,
                    y + 0.234 * k - 1e-6
                ]
            ]).stream(pointStream), hawaiiPoint = hawaii.translate([
                x - 0.205 * k,
                y + 0.212 * k
            ]).clipExtent([
                [
                    x - 0.214 * k + 1e-6,
                    y + 0.166 * k + 1e-6
                ],
                [
                    x - 0.115 * k - 1e-6,
                    y + 0.234 * k - 1e-6
                ]
            ]).stream(pointStream), reset();
        }, albersUsa.fitExtent = function(extent, object) {
            return fitExtent(albersUsa, extent, object);
        }, albersUsa.fitSize = function(size, object) {
            return fitSize(albersUsa, size, object);
        }, albersUsa.fitWidth = function(width, object) {
            return fitWidth(albersUsa, width, object);
        }, albersUsa.fitHeight = function(height, object) {
            return fitHeight(albersUsa, height, object);
        }, albersUsa.scale(1070);
    }, exports1.geoArea = function(object) {
        return areaSum = new Adder(), geoStream(object, areaStream), 2 * areaSum;
    }, exports1.geoAzimuthalEqualArea = function() {
        return projection(azimuthalEqualAreaRaw).scale(124.75).clipAngle(179.999);
    }, exports1.geoAzimuthalEqualAreaRaw = azimuthalEqualAreaRaw, exports1.geoAzimuthalEquidistant = function() {
        return projection(azimuthalEquidistantRaw).scale(79.4188).clipAngle(179.999);
    }, exports1.geoAzimuthalEquidistantRaw = azimuthalEquidistantRaw, exports1.geoBounds = function(feature) {
        var i, n, a, b, merged, deltaMax, delta;
        // First, sort ranges by their minimum longitudes.
        if (phi1 = lambda1 = -(lambda0$1 = phi0 = 1 / 0), ranges = [], geoStream(feature, boundsStream), n = ranges.length) {
            // Then, merge any ranges that overlap.
            for(ranges.sort(rangeCompare), i = 1, merged = [
                a = ranges[0]
            ]; i < n; ++i)rangeContains(a, (b = ranges[i])[0]) || rangeContains(a, b[1]) ? (angle(a[0], b[1]) > angle(a[0], a[1]) && (a[1] = b[1]), angle(b[0], a[1]) > angle(a[0], a[1]) && (a[0] = b[0])) : merged.push(a = b);
            // Finally, find the largest gap between the merged ranges.
            // The final bounding box will be the inverse of this gap.
            for(deltaMax = -1 / 0, n = merged.length - 1, i = 0, a = merged[n]; i <= n; a = b, ++i)b = merged[i], (delta = angle(a[1], b[0])) > deltaMax && (deltaMax = delta, lambda0$1 = b[0], lambda1 = a[1]);
        }
        return ranges = range$1 = null, lambda0$1 === 1 / 0 || phi0 === 1 / 0 ? [
            [
                NaN,
                NaN
            ],
            [
                NaN,
                NaN
            ]
        ] : [
            [
                lambda0$1,
                phi0
            ],
            [
                lambda1,
                phi1
            ]
        ];
    }, exports1.geoCentroid = function(object) {
        W0 = W1 = X0 = Y0 = Z0 = X1 = Y1 = Z1 = 0, X2 = new Adder(), Y2 = new Adder(), Z2 = new Adder(), geoStream(object, centroidStream);
        var x = +X2, y = +Y2, z = +Z2, m = hypot(x, y, z);
        return(// If the area-weighted ccentroid is undefined, fall back to length-weighted ccentroid.
        m < 1e-12 && (x = X1, y = Y1, z = Z1, W1 < 1e-6 && (x = X0, y = Y0, z = Z0), (m = hypot(x, y, z)) < 1e-12) ? [
            NaN,
            NaN
        ] : [
            atan2(y, x) * degrees$2,
            asin(z / m) * degrees$2
        ]);
    }, exports1.geoCircle = function() {
        var ring, rotate, center = constant$8([
            0,
            0
        ]), radius = constant$8(90), precision = constant$8(6), stream = {
            point: function(x, y) {
                ring.push(x = rotate(x, y)), x[0] *= degrees$2, x[1] *= degrees$2;
            }
        };
        function circle() {
            var c = center.apply(this, arguments), r = radius.apply(this, arguments) * radians$1, p = precision.apply(this, arguments) * radians$1;
            return ring = [], rotate = rotateRadians(-c[0] * radians$1, -c[1] * radians$1, 0).invert, circleStream(stream, r, p, 1), c = {
                type: "Polygon",
                coordinates: [
                    ring
                ]
            }, ring = rotate = null, c;
        }
        return circle.center = function(_) {
            return arguments.length ? (center = "function" == typeof _ ? _ : constant$8([
                +_[0],
                +_[1]
            ]), circle) : center;
        }, circle.radius = function(_) {
            return arguments.length ? (radius = "function" == typeof _ ? _ : constant$8(+_), circle) : radius;
        }, circle.precision = function(_) {
            return arguments.length ? (precision = "function" == typeof _ ? _ : constant$8(+_), circle) : precision;
        }, circle;
    }, exports1.geoClipAntimeridian = clipAntimeridian, exports1.geoClipCircle = clipCircle, exports1.geoClipExtent = function() {
        var cache, cacheStream, clip, x0 = 0, y0 = 0, x1 = 960, y1 = 500;
        return clip = {
            stream: function(stream) {
                return cache && cacheStream === stream ? cache : cache = clipRectangle(x0, y0, x1, y1)(cacheStream = stream);
            },
            extent: function(_) {
                return arguments.length ? (x0 = +_[0][0], y0 = +_[0][1], x1 = +_[1][0], y1 = +_[1][1], cache = cacheStream = null, clip) : [
                    [
                        x0,
                        y0
                    ],
                    [
                        x1,
                        y1
                    ]
                ];
            }
        };
    }, exports1.geoClipRectangle = clipRectangle, exports1.geoConicConformal = function() {
        return conicProjection(conicConformalRaw).scale(109.5).parallels([
            30,
            30
        ]);
    }, exports1.geoConicConformalRaw = conicConformalRaw, exports1.geoConicEqualArea = conicEqualArea, exports1.geoConicEqualAreaRaw = conicEqualAreaRaw, exports1.geoConicEquidistant = function() {
        return conicProjection(conicEquidistantRaw).scale(131.154).center([
            0,
            13.9389
        ]);
    }, exports1.geoConicEquidistantRaw = conicEquidistantRaw, exports1.geoContains = function(object, point) {
        return (object && containsObjectType.hasOwnProperty(object.type) ? containsObjectType[object.type] : containsGeometry)(object, point);
    }, exports1.geoDistance = distance, exports1.geoEqualEarth = function() {
        return projection(equalEarthRaw).scale(177.158);
    }, exports1.geoEqualEarthRaw = equalEarthRaw, exports1.geoEquirectangular = function() {
        return projection(equirectangularRaw).scale(152.63);
    }, exports1.geoEquirectangularRaw = equirectangularRaw, exports1.geoGnomonic = function() {
        return projection(gnomonicRaw).scale(144.049).clipAngle(60);
    }, exports1.geoGnomonicRaw = gnomonicRaw, exports1.geoGraticule = graticule, exports1.geoGraticule10 = function() {
        return graticule()();
    }, exports1.geoIdentity = function() {
        var ca, sa, y0, x1, y1, cache, cacheStream, k = 1, tx = 0, ty = 0, sx = 1, sy = 1, alpha = 0, x0 = null, kx = 1, ky = 1, transform = transformer({
            point: function(x, y) {
                var p = projection([
                    x,
                    y
                ]);
                this.stream.point(p[0], p[1]);
            }
        }), postclip = identity$4;
        function reset() {
            return kx = k * sx, ky = k * sy, cache = cacheStream = null, projection;
        }
        function projection(p) {
            var x = p[0] * kx, y = p[1] * ky;
            if (alpha) {
                var t = y * ca - x * sa;
                x = x * ca + y * sa, y = t;
            }
            return [
                x + tx,
                y + ty
            ];
        }
        return projection.invert = function(p) {
            var x = p[0] - tx, y = p[1] - ty;
            if (alpha) {
                var t = y * ca + x * sa;
                x = x * ca - y * sa, y = t;
            }
            return [
                x / kx,
                y / ky
            ];
        }, projection.stream = function(stream) {
            return cache && cacheStream === stream ? cache : cache = transform(postclip(cacheStream = stream));
        }, projection.postclip = function(_) {
            return arguments.length ? (postclip = _, x0 = y0 = x1 = y1 = null, reset()) : postclip;
        }, projection.clipExtent = function(_) {
            return arguments.length ? (postclip = null == _ ? (x0 = y0 = x1 = y1 = null, identity$4) : clipRectangle(x0 = +_[0][0], y0 = +_[0][1], x1 = +_[1][0], y1 = +_[1][1]), reset()) : null == x0 ? null : [
                [
                    x0,
                    y0
                ],
                [
                    x1,
                    y1
                ]
            ];
        }, projection.scale = function(_) {
            return arguments.length ? (k = +_, reset()) : k;
        }, projection.translate = function(_) {
            return arguments.length ? (tx = +_[0], ty = +_[1], reset()) : [
                tx,
                ty
            ];
        }, projection.angle = function(_) {
            return arguments.length ? (sa = sin$1(alpha = _ % 360 * radians$1), ca = cos$1(alpha), reset()) : alpha * degrees$2;
        }, projection.reflectX = function(_) {
            return arguments.length ? (sx = _ ? -1 : 1, reset()) : sx < 0;
        }, projection.reflectY = function(_) {
            return arguments.length ? (sy = _ ? -1 : 1, reset()) : sy < 0;
        }, projection.fitExtent = function(extent, object) {
            return fitExtent(projection, extent, object);
        }, projection.fitSize = function(size, object) {
            return fitSize(projection, size, object);
        }, projection.fitWidth = function(width, object) {
            return fitWidth(projection, width, object);
        }, projection.fitHeight = function(height, object) {
            return fitHeight(projection, height, object);
        }, projection;
    }, exports1.geoInterpolate = function(a, b) {
        var x, x1, x0 = a[0] * radians$1, y0 = a[1] * radians$1, x11 = b[0] * radians$1, y1 = b[1] * radians$1, cy0 = cos$1(y0), sy0 = sin$1(y0), cy1 = cos$1(y1), sy1 = sin$1(y1), kx0 = cy0 * cos$1(x0), ky0 = cy0 * sin$1(x0), kx1 = cy1 * cos$1(x11), ky1 = cy1 * sin$1(x11), d = 2 * asin(sqrt((x = sin$1((x = y1 - y0) / 2)) * x + cy0 * cy1 * ((x1 = sin$1((x1 = x11 - x0) / 2)) * x1))), k = sin$1(d), interpolate = d ? function(t) {
            var B = sin$1(t *= d) / k, A = sin$1(d - t) / k, x = A * kx0 + B * kx1, y = A * ky0 + B * ky1;
            return [
                atan2(y, x) * degrees$2,
                atan2(A * sy0 + B * sy1, sqrt(x * x + y * y)) * degrees$2
            ];
        } : function() {
            return [
                x0 * degrees$2,
                y0 * degrees$2
            ];
        };
        return interpolate.distance = d, interpolate;
    }, exports1.geoLength = length$2, exports1.geoMercator = function() {
        return mercatorProjection(mercatorRaw).scale(961 / tau$4);
    }, exports1.geoMercatorRaw = mercatorRaw, exports1.geoNaturalEarth1 = function() {
        return projection(naturalEarth1Raw).scale(175.295);
    }, exports1.geoNaturalEarth1Raw = naturalEarth1Raw, exports1.geoOrthographic = function() {
        return projection(orthographicRaw).scale(249.5).clipAngle(90.000001);
    }, exports1.geoOrthographicRaw = orthographicRaw, exports1.geoPath = function(projection, context) {
        var projectionStream, contextStream, pointRadius = 4.5;
        function path(object) {
            return object && ("function" == typeof pointRadius && contextStream.pointRadius(+pointRadius.apply(this, arguments)), geoStream(object, projectionStream(contextStream))), contextStream.result();
        }
        return path.area = function(object) {
            return geoStream(object, projectionStream(areaStream$1)), areaStream$1.result();
        }, path.measure = function(object) {
            return geoStream(object, projectionStream(lengthStream$1)), lengthStream$1.result();
        }, path.bounds = function(object) {
            return geoStream(object, projectionStream(boundsStream$1)), boundsStream$1.result();
        }, path.centroid = function(object) {
            return geoStream(object, projectionStream(centroidStream$1)), centroidStream$1.result();
        }, path.projection = function(_) {
            return arguments.length ? (projectionStream = null == _ ? (projection = null, identity$4) : (projection = _).stream, path) : projection;
        }, path.context = function(_) {
            return arguments.length ? (contextStream = null == _ ? (context = null, new PathString) : new PathContext(context = _), "function" != typeof pointRadius && contextStream.pointRadius(pointRadius), path) : context;
        }, path.pointRadius = function(_) {
            return arguments.length ? (pointRadius = "function" == typeof _ ? _ : (contextStream.pointRadius(+_), +_), path) : pointRadius;
        }, path.projection(projection).context(context);
    }, exports1.geoProjection = projection, exports1.geoProjectionMutator = projectionMutator, exports1.geoRotation = rotation, exports1.geoStereographic = function() {
        return projection(stereographicRaw).scale(250).clipAngle(142);
    }, exports1.geoStereographicRaw = stereographicRaw, exports1.geoStream = geoStream, exports1.geoTransform = function(methods) {
        return {
            stream: transformer(methods)
        };
    }, exports1.geoTransverseMercator = function() {
        var m = mercatorProjection(transverseMercatorRaw), center = m.center, rotate = m.rotate;
        return m.center = function(_) {
            return arguments.length ? center([
                -_[1],
                _[0]
            ]) : [
                (_ = center())[1],
                -_[0]
            ];
        }, m.rotate = function(_) {
            return arguments.length ? rotate([
                _[0],
                _[1],
                _.length > 2 ? _[2] + 90 : 90
            ]) : [
                (_ = rotate())[0],
                _[1],
                _[2] - 90
            ];
        }, rotate([
            0,
            0,
            90
        ]).scale(159.155);
    }, exports1.geoTransverseMercatorRaw = transverseMercatorRaw, exports1.gray = function(l, opacity) {
        return new Lab(l, 0, 0, null == opacity ? 1 : opacity);
    }, exports1.greatest = function(values, compare = ascending) {
        let max;
        let defined = !1;
        if (1 === compare.length) {
            let maxValue;
            for (const element of values){
                const value = compare(element);
                (defined ? ascending(value, maxValue) > 0 : 0 === ascending(value, value)) && (max = element, maxValue = value, defined = !0);
            }
        } else for (const value of values)(defined ? compare(value, max) > 0 : 0 === compare(value, value)) && (max = value, defined = !0);
        return max;
    }, exports1.greatestIndex = function(values, compare = ascending) {
        let maxValue;
        if (1 === compare.length) return maxIndex(values, compare);
        let max = -1, index = -1;
        for (const value of values)++index, (max < 0 ? 0 === compare(value, value) : compare(value, maxValue) > 0) && (maxValue = value, max = index);
        return max;
    }, exports1.group = function(values, ...keys) {
        return nest(values, identity, identity, keys);
    }, exports1.groups = function(values, ...keys) {
        return nest(values, Array.from, identity, keys);
    }, exports1.hcl = hcl, exports1.hierarchy = hierarchy, exports1.histogram = bin, exports1.hsl = hsl, exports1.html = html, exports1.image = function(input, init) {
        return new Promise(function(resolve, reject) {
            var image = new Image;
            for(var key in init)image[key] = init[key];
            image.onerror = reject, image.onload = function() {
                resolve(image);
            }, image.src = input;
        });
    }, exports1.index = function(values, ...keys) {
        return nest(values, identity, unique, keys);
    }, exports1.indexes = function(values, ...keys) {
        return nest(values, Array.from, unique, keys);
    }, exports1.interpolate = interpolate, exports1.interpolateArray = function(a, b) {
        return (isNumberArray(b) ? numberArray : genericArray)(a, b);
    }, exports1.interpolateBasis = basis$1, exports1.interpolateBasisClosed = basisClosed, exports1.interpolateBlues = Blues, exports1.interpolateBrBG = BrBG, exports1.interpolateBuGn = BuGn, exports1.interpolateBuPu = BuPu, exports1.interpolateCividis = function(t) {
        return "rgb(" + Math.max(0, Math.min(255, Math.round(-4.54 - (t = Math.max(0, Math.min(1, t))) * (35.34 - t * (2381.73 - t * (6402.7 - t * (7024.72 - 2710.57 * t))))))) + ", " + Math.max(0, Math.min(255, Math.round(32.49 + t * (170.73 + t * (52.82 - t * (131.46 - t * (176.58 - 67.37 * t))))))) + ", " + Math.max(0, Math.min(255, Math.round(81.24 + t * (442.36 - t * (2482.43 - t * (6167.24 - t * (6614.94 - 2475.67 * t))))))) + ")";
    }, exports1.interpolateCool = cool, exports1.interpolateCubehelix = cubehelix$2, exports1.interpolateCubehelixDefault = cubehelix$3, exports1.interpolateCubehelixLong = cubehelixLong, exports1.interpolateDate = date, exports1.interpolateDiscrete = function(range) {
        var n = range.length;
        return function(t) {
            return range[Math.max(0, Math.min(n - 1, Math.floor(t * n)))];
        };
    }, exports1.interpolateGnBu = GnBu, exports1.interpolateGreens = Greens, exports1.interpolateGreys = Greys, exports1.interpolateHcl = hcl$2, exports1.interpolateHclLong = hclLong, exports1.interpolateHsl = hsl$2, exports1.interpolateHslLong = hslLong, exports1.interpolateHue = function(a, b) {
        var i = hue(+a, +b);
        return function(t) {
            var x = i(t);
            return x - 360 * Math.floor(x / 360);
        };
    }, exports1.interpolateInferno = inferno, exports1.interpolateLab = function(start, end) {
        var l = nogamma((start = lab(start)).l, (end = lab(end)).l), a = nogamma(start.a, end.a), b = nogamma(start.b, end.b), opacity = nogamma(start.opacity, end.opacity);
        return function(t) {
            return start.l = l(t), start.a = a(t), start.b = b(t), start.opacity = opacity(t), start + "";
        };
    }, exports1.interpolateMagma = magma, exports1.interpolateNumber = interpolateNumber, exports1.interpolateNumberArray = numberArray, exports1.interpolateObject = object, exports1.interpolateOrRd = OrRd, exports1.interpolateOranges = Oranges, exports1.interpolatePRGn = PRGn, exports1.interpolatePiYG = PiYG, exports1.interpolatePlasma = plasma, exports1.interpolatePuBu = PuBu, exports1.interpolatePuBuGn = PuBuGn, exports1.interpolatePuOr = PuOr, exports1.interpolatePuRd = PuRd, exports1.interpolatePurples = Purples, exports1.interpolateRainbow = function(t) {
        (t < 0 || t > 1) && (t -= Math.floor(t));
        var ts = Math.abs(t - 0.5);
        return c$1.h = 360 * t - 100, c$1.s = 1.5 - 1.5 * ts, c$1.l = 0.8 - 0.9 * ts, c$1 + "";
    }, exports1.interpolateRdBu = RdBu, exports1.interpolateRdGy = RdGy, exports1.interpolateRdPu = RdPu, exports1.interpolateRdYlBu = RdYlBu, exports1.interpolateRdYlGn = RdYlGn, exports1.interpolateReds = Reds, exports1.interpolateRgb = interpolateRgb, exports1.interpolateRgbBasis = rgbBasis, exports1.interpolateRgbBasisClosed = rgbBasisClosed, exports1.interpolateRound = interpolateRound, exports1.interpolateSinebow = function(t) {
        var x;
        return t = (0.5 - t) * Math.PI, c$2.r = 255 * (x = Math.sin(t)) * x, c$2.g = 255 * (x = Math.sin(t + pi_1_3)) * x, c$2.b = 255 * (x = Math.sin(t + pi_2_3)) * x, c$2 + "";
    }, exports1.interpolateSpectral = Spectral, exports1.interpolateString = interpolateString, exports1.interpolateTransformCss = interpolateTransformCss, exports1.interpolateTransformSvg = interpolateTransformSvg, exports1.interpolateTurbo = function(t) {
        return "rgb(" + Math.max(0, Math.min(255, Math.round(34.61 + (t = Math.max(0, Math.min(1, t))) * (1172.33 - t * (10793.56 - t * (33300.12 - t * (38394.49 - 14825.05 * t))))))) + ", " + Math.max(0, Math.min(255, Math.round(23.31 + t * (557.33 + t * (1225.33 - t * (3574.96 - t * (1073.77 + 707.56 * t))))))) + ", " + Math.max(0, Math.min(255, Math.round(27.2 + t * (3211.1 - t * (15327.97 - t * (27814 - t * (22569.18 - 6838.66 * t))))))) + ")";
    }, exports1.interpolateViridis = viridis, exports1.interpolateWarm = warm, exports1.interpolateYlGn = YlGn, exports1.interpolateYlGnBu = YlGnBu, exports1.interpolateYlOrBr = YlOrBr, exports1.interpolateYlOrRd = YlOrRd, exports1.interpolateZoom = interpolateZoom, exports1.interrupt = interrupt, exports1.intersection = function(values, ...others) {
        values = new Set(values), others = others.map(set);
        out: for (const value of values)for (const other of others)if (!other.has(value)) {
            values.delete(value);
            continue out;
        }
        return values;
    }, exports1.interval = function(callback, delay, time) {
        var t = new Timer, total = delay;
        return null == delay || (t._restart = t.restart, t.restart = function(callback, delay, time) {
            delay = +delay, time = null == time ? now() : +time, t._restart(function tick(elapsed) {
                elapsed += total, t._restart(tick, total += delay, time), callback(elapsed);
            }, delay, time);
        }), t.restart(callback, delay, time), t;
    }, exports1.isoFormat = formatIso, exports1.isoParse = parseIso, exports1.json = function(input, init) {
        return fetch(input, init).then(responseJson);
    }, exports1.lab = lab, exports1.lch = function(l, c, h, opacity) {
        return 1 == arguments.length ? hclConvert(l) : new Hcl(h, c, l, null == opacity ? 1 : opacity);
    }, exports1.least = function(values, compare = ascending) {
        let min;
        let defined = !1;
        if (1 === compare.length) {
            let minValue;
            for (const element of values){
                const value = compare(element);
                (defined ? 0 > ascending(value, minValue) : 0 === ascending(value, value)) && (min = element, minValue = value, defined = !0);
            }
        } else for (const value of values)(defined ? 0 > compare(value, min) : 0 === compare(value, value)) && (min = value, defined = !0);
        return min;
    }, exports1.leastIndex = leastIndex, exports1.line = line, exports1.lineRadial = lineRadial$1, exports1.linkHorizontal = function() {
        return link$2(curveHorizontal);
    }, exports1.linkRadial = function() {
        var l = link$2(curveRadial$1);
        return l.angle = l.x, delete l.x, l.radius = l.y, delete l.y, l;
    }, exports1.linkVertical = function() {
        return link$2(curveVertical);
    }, exports1.local = local, exports1.map = function(values, mapper) {
        if ("function" != typeof values[Symbol.iterator]) throw TypeError("values is not iterable");
        if ("function" != typeof mapper) throw TypeError("mapper is not a function");
        return Array.from(values, (value, index)=>mapper(value, index, values));
    }, exports1.matcher = matcher, exports1.max = max, exports1.maxIndex = maxIndex, exports1.mean = function(values, valueof) {
        let count = 0, sum = 0;
        if (void 0 === valueof) for (let value of values)null != value && (value = +value) >= value && (++count, sum += value);
        else {
            let index = -1;
            for (let value of values)null != (value = valueof(value, ++index, values)) && (value = +value) >= value && (++count, sum += value);
        }
        if (count) return sum / count;
    }, exports1.median = function(values, valueof) {
        return quantile(values, 0.5, valueof);
    }, exports1.merge = merge, exports1.min = min, exports1.minIndex = minIndex, exports1.namespace = namespace, exports1.namespaces = namespaces, exports1.nice = nice, exports1.now = now, exports1.pack = function() {
        var radius = null, dx = 1, dy = 1, padding = constantZero;
        function pack(root) {
            return root.x = dx / 2, root.y = dy / 2, radius ? root.eachBefore(radiusLeaf(radius)).eachAfter(packChildren(padding, 0.5)).eachBefore(translateChild(1)) : root.eachBefore(radiusLeaf(defaultRadius$1)).eachAfter(packChildren(constantZero, 1)).eachAfter(packChildren(padding, root.r / Math.min(dx, dy))).eachBefore(translateChild(Math.min(dx, dy) / (2 * root.r))), root;
        }
        return pack.radius = function(x) {
            return arguments.length ? (radius = null == x ? null : required(x), pack) : radius;
        }, pack.size = function(x) {
            return arguments.length ? (dx = +x[0], dy = +x[1], pack) : [
                dx,
                dy
            ];
        }, pack.padding = function(x) {
            return arguments.length ? (padding = "function" == typeof x ? x : constant$9(+x), pack) : padding;
        }, pack;
    }, exports1.packEnclose = enclose, exports1.packSiblings = function(circles) {
        return packEnclose(circles), circles;
    }, exports1.pairs = function(values, pairof = pair) {
        let previous;
        const pairs = [];
        let first = !1;
        for (const value of values)first && pairs.push(pairof(previous, value)), previous = value, first = !0;
        return pairs;
    }, exports1.partition = function() {
        var dx = 1, dy = 1, padding = 0, round = !1;
        function partition(root) {
            var dy1, n = root.height + 1;
            return root.x0 = root.y0 = padding, root.x1 = dx, root.y1 = dy / n, root.eachBefore((dy1 = dy, function(node) {
                node.children && treemapDice(node, node.x0, dy1 * (node.depth + 1) / n, node.x1, dy1 * (node.depth + 2) / n);
                var x0 = node.x0, y0 = node.y0, x1 = node.x1 - padding, y1 = node.y1 - padding;
                x1 < x0 && (x0 = x1 = (x0 + x1) / 2), y1 < y0 && (y0 = y1 = (y0 + y1) / 2), node.x0 = x0, node.y0 = y0, node.x1 = x1, node.y1 = y1;
            })), round && root.eachBefore(roundNode), root;
        }
        return partition.round = function(x) {
            return arguments.length ? (round = !!x, partition) : round;
        }, partition.size = function(x) {
            return arguments.length ? (dx = +x[0], dy = +x[1], partition) : [
                dx,
                dy
            ];
        }, partition.padding = function(x) {
            return arguments.length ? (padding = +x, partition) : padding;
        }, partition;
    }, exports1.path = path, exports1.permute = permute, exports1.pie = function() {
        var value = identity$8, sortValues = descending$1, sort = null, startAngle = constant$a(0), endAngle = constant$a(tau$5), padAngle = constant$a(0);
        function pie(data) {
            var i, j, k, a1, v, n = (data = array$5(data)).length, sum = 0, index = Array(n), arcs = Array(n), a0 = +startAngle.apply(this, arguments), da = Math.min(tau$5, Math.max(-tau$5, endAngle.apply(this, arguments) - a0)), p = Math.min(Math.abs(da) / n, padAngle.apply(this, arguments)), pa = p * (da < 0 ? -1 : 1);
            for(i = 0; i < n; ++i)(v = arcs[index[i] = i] = +value(data[i], i, data)) > 0 && (sum += v);
            // Compute the arcs! They are stored in the original data's order.
            for(null != sortValues ? index.sort(function(i, j) {
                return sortValues(arcs[i], arcs[j]);
            }) : null != sort && index.sort(function(i, j) {
                return sort(data[i], data[j]);
            }), i = 0, k = sum ? (da - n * pa) / sum : 0; i < n; ++i, a0 = a1)a1 = a0 + ((v = arcs[j = index[i]]) > 0 ? v * k : 0) + pa, arcs[j] = {
                data: data[j],
                index: i,
                value: v,
                startAngle: a0,
                endAngle: a1,
                padAngle: p
            };
            return arcs;
        }
        return pie.value = function(_) {
            return arguments.length ? (value = "function" == typeof _ ? _ : constant$a(+_), pie) : value;
        }, pie.sortValues = function(_) {
            return arguments.length ? (sortValues = _, sort = null, pie) : sortValues;
        }, pie.sort = function(_) {
            return arguments.length ? (sort = _, sortValues = null, pie) : sort;
        }, pie.startAngle = function(_) {
            return arguments.length ? (startAngle = "function" == typeof _ ? _ : constant$a(+_), pie) : startAngle;
        }, pie.endAngle = function(_) {
            return arguments.length ? (endAngle = "function" == typeof _ ? _ : constant$a(+_), pie) : endAngle;
        }, pie.padAngle = function(_) {
            return arguments.length ? (padAngle = "function" == typeof _ ? _ : constant$a(+_), pie) : padAngle;
        }, pie;
    }, exports1.piecewise = piecewise, exports1.pointRadial = pointRadial, exports1.pointer = pointer, exports1.pointers = function(events, node) {
        return events.target && (events = sourceEvent(events), void 0 === node && (node = events.currentTarget), events = events.touches || [
            events
        ]), Array.from(events, (event)=>pointer(event, node));
    }, exports1.polygonArea = function(polygon) {
        for(var a, i = -1, n = polygon.length, b = polygon[n - 1], area = 0; ++i < n;)a = b, b = polygon[i], area += a[1] * b[0] - a[0] * b[1];
        return area / 2;
    }, exports1.polygonCentroid = function(polygon) {
        for(var a, c, i = -1, n = polygon.length, x = 0, y = 0, b = polygon[n - 1], k = 0; ++i < n;)a = b, b = polygon[i], k += c = a[0] * b[1] - b[0] * a[1], x += (a[0] + b[0]) * c, y += (a[1] + b[1]) * c;
        return [
            x / (k *= 3),
            y / k
        ];
    }, exports1.polygonContains = function(polygon, point) {
        for(var x1, y1, n = polygon.length, p = polygon[n - 1], x = point[0], y = point[1], x0 = p[0], y0 = p[1], inside = !1, i = 0; i < n; ++i)x1 = (p = polygon[i])[0], (y1 = p[1]) > y != y0 > y && x < (x0 - x1) * (y - y1) / (y0 - y1) + x1 && (inside = !inside), x0 = x1, y0 = y1;
        return inside;
    }, exports1.polygonHull = function(points) {
        if ((n = points.length) < 3) return null;
        var i, n, sortedPoints = Array(n), flippedPoints = Array(n);
        for(i = 0; i < n; ++i)sortedPoints[i] = [
            +points[i][0],
            +points[i][1],
            i
        ];
        for(sortedPoints.sort(lexicographicOrder), i = 0; i < n; ++i)flippedPoints[i] = [
            sortedPoints[i][0],
            -sortedPoints[i][1]
        ];
        var upperIndexes = computeUpperHullIndexes(sortedPoints), lowerIndexes = computeUpperHullIndexes(flippedPoints), skipLeft = lowerIndexes[0] === upperIndexes[0], skipRight = lowerIndexes[lowerIndexes.length - 1] === upperIndexes[upperIndexes.length - 1], hull = [];
        // Add upper hull in right-to-l order.
        // Then add lower hull in left-to-right order.
        for(i = upperIndexes.length - 1; i >= 0; --i)hull.push(points[sortedPoints[upperIndexes[i]][2]]);
        for(i = +skipLeft; i < lowerIndexes.length - skipRight; ++i)hull.push(points[sortedPoints[lowerIndexes[i]][2]]);
        return hull;
    }, exports1.polygonLength = function(polygon) {
        for(var xa, ya, i = -1, n = polygon.length, b = polygon[n - 1], xb = b[0], yb = b[1], perimeter = 0; ++i < n;)xa = xb, ya = yb, xb = (b = polygon[i])[0], yb = b[1], xa -= xb, ya -= yb, perimeter += Math.hypot(xa, ya);
        return perimeter;
    }, exports1.precisionFixed = precisionFixed, exports1.precisionPrefix = precisionPrefix, exports1.precisionRound = precisionRound, exports1.quadtree = quadtree, exports1.quantile = quantile, exports1.quantileSorted = quantileSorted, exports1.quantize = function(interpolator, n) {
        for(var samples = Array(n), i = 0; i < n; ++i)samples[i] = interpolator(i / (n - 1));
        return samples;
    }, exports1.quickselect = quickselect, exports1.radialArea = areaRadial, exports1.radialLine = lineRadial$1, exports1.randomBates = bates, exports1.randomBernoulli = bernoulli, exports1.randomBeta = beta, exports1.randomBinomial = binomial, exports1.randomCauchy = cauchy, exports1.randomExponential = exponential$1, exports1.randomGamma = gamma$1, exports1.randomGeometric = geometric, exports1.randomInt = int, exports1.randomIrwinHall = irwinHall, exports1.randomLcg = function(seed = Math.random()) {
        let state = (0 <= seed && seed < 1 ? seed / eps : Math.abs(seed)) | 0;
        return ()=>eps * ((state = 0x19660D * state + 0x3C6EF35F | 0) >>> 0);
    }, exports1.randomLogNormal = logNormal, exports1.randomLogistic = logistic, exports1.randomNormal = normal, exports1.randomPareto = pareto, exports1.randomPoisson = poisson, exports1.randomUniform = uniform, exports1.randomWeibull = weibull, exports1.range = sequence, exports1.reduce = function(values, reducer, value) {
        if ("function" != typeof reducer) throw TypeError("reducer is not a function");
        const iterator = values[Symbol.iterator]();
        let done, next, index = -1;
        if (arguments.length < 3) {
            if ({ done, value } = iterator.next(), done) return;
            ++index;
        }
        for(; { done, value: next } = iterator.next(), !done;)value = reducer(value, next, ++index, values);
        return value;
    }, exports1.reverse = function(values) {
        if ("function" != typeof values[Symbol.iterator]) throw TypeError("values is not iterable");
        return Array.from(values).reverse();
    }, exports1.rgb = rgb, exports1.ribbon = function() {
        return ribbon();
    }, exports1.ribbonArrow = function() {
        return ribbon(defaultArrowheadRadius);
    }, exports1.rollup = function(values, reduce, ...keys) {
        return nest(values, identity, reduce, keys);
    }, exports1.rollups = function(values, reduce, ...keys) {
        return nest(values, Array.from, reduce, keys);
    }, exports1.scaleBand = band, exports1.scaleDiverging = function diverging() {
        var scale = linearish(transformer$3()(identity$6));
        return scale.copy = function() {
            return copy$1(scale, diverging());
        }, initInterpolator.apply(scale, arguments);
    }, exports1.scaleDivergingLog = function divergingLog() {
        var scale = loggish(transformer$3()).domain([
            0.1,
            1,
            10
        ]);
        return scale.copy = function() {
            return copy$1(scale, divergingLog()).base(scale.base());
        }, initInterpolator.apply(scale, arguments);
    }, exports1.scaleDivergingPow = divergingPow, exports1.scaleDivergingSqrt = function() {
        return divergingPow.apply(null, arguments).exponent(0.5);
    }, exports1.scaleDivergingSymlog = function divergingSymlog() {
        var scale = symlogish(transformer$3());
        return scale.copy = function() {
            return copy$1(scale, divergingSymlog()).constant(scale.constant());
        }, initInterpolator.apply(scale, arguments);
    }, exports1.scaleIdentity = function identity$7(domain) {
        var unknown;
        function scale(x) {
            return isNaN(x = +x) ? unknown : x;
        }
        return scale.invert = scale, scale.domain = scale.range = function(_) {
            return arguments.length ? (domain = Array.from(_, number$2), scale) : domain.slice();
        }, scale.unknown = function(_) {
            return arguments.length ? (unknown = _, scale) : unknown;
        }, scale.copy = function() {
            return identity$7(domain).unknown(unknown);
        }, domain = arguments.length ? Array.from(domain, number$2) : [
            0,
            1
        ], linearish(scale);
    }, exports1.scaleImplicit = implicit, exports1.scaleLinear = function linear$2() {
        var scale = continuous();
        return scale.copy = function() {
            return copy(scale, linear$2());
        }, initRange.apply(scale, arguments), linearish(scale);
    }, exports1.scaleLog = function log$1() {
        var scale = loggish(transformer$1()).domain([
            1,
            10
        ]);
        return scale.copy = function() {
            return copy(scale, log$1()).base(scale.base());
        }, initRange.apply(scale, arguments), scale;
    }, exports1.scaleOrdinal = ordinal, exports1.scalePoint = function() {
        return function pointish(scale) {
            var copy = scale.copy;
            return scale.padding = scale.paddingOuter, delete scale.paddingInner, delete scale.paddingOuter, scale.copy = function() {
                return pointish(copy());
            }, scale;
        }(band.apply(null, arguments).paddingInner(1));
    }, exports1.scalePow = pow$2, exports1.scaleQuantile = function quantile$1() {
        var unknown, domain = [], range = [], thresholds = [];
        function rescale() {
            var i = 0, n = Math.max(1, range.length);
            for(thresholds = Array(n - 1); ++i < n;)thresholds[i - 1] = quantileSorted(domain, i / n);
            return scale;
        }
        function scale(x) {
            return isNaN(x = +x) ? unknown : range[bisectRight(thresholds, x)];
        }
        return scale.invertExtent = function(y) {
            var i = range.indexOf(y);
            return i < 0 ? [
                NaN,
                NaN
            ] : [
                i > 0 ? thresholds[i - 1] : domain[0],
                i < thresholds.length ? thresholds[i] : domain[domain.length - 1]
            ];
        }, scale.domain = function(_) {
            if (!arguments.length) return domain.slice();
            for (let d of (domain = [], _))null == d || isNaN(d = +d) || domain.push(d);
            return domain.sort(ascending), rescale();
        }, scale.range = function(_) {
            return arguments.length ? (range = Array.from(_), rescale()) : range.slice();
        }, scale.unknown = function(_) {
            return arguments.length ? (unknown = _, scale) : unknown;
        }, scale.quantiles = function() {
            return thresholds.slice();
        }, scale.copy = function() {
            return quantile$1().domain(domain).range(range).unknown(unknown);
        }, initRange.apply(scale, arguments);
    }, exports1.scaleQuantize = function quantize$1() {
        var unknown, x0 = 0, x1 = 1, n = 1, domain = [
            0.5
        ], range = [
            0,
            1
        ];
        function scale(x) {
            return x <= x ? range[bisectRight(domain, x, 0, n)] : unknown;
        }
        function rescale() {
            var i = -1;
            for(domain = Array(n); ++i < n;)domain[i] = ((i + 1) * x1 - (i - n) * x0) / (n + 1);
            return scale;
        }
        return scale.domain = function(_) {
            return arguments.length ? ([x0, x1] = _, x0 = +x0, x1 = +x1, rescale()) : [
                x0,
                x1
            ];
        }, scale.range = function(_) {
            return arguments.length ? (n = (range = Array.from(_)).length - 1, rescale()) : range.slice();
        }, scale.invertExtent = function(y) {
            var i = range.indexOf(y);
            return i < 0 ? [
                NaN,
                NaN
            ] : i < 1 ? [
                x0,
                domain[0]
            ] : i >= n ? [
                domain[n - 1],
                x1
            ] : [
                domain[i - 1],
                domain[i]
            ];
        }, scale.unknown = function(_) {
            return arguments.length && (unknown = _), scale;
        }, scale.thresholds = function() {
            return domain.slice();
        }, scale.copy = function() {
            return quantize$1().domain([
                x0,
                x1
            ]).range(range).unknown(unknown);
        }, initRange.apply(linearish(scale), arguments);
    }, exports1.scaleRadial = function radial$1() {
        var unknown, squared = continuous(), range = [
            0,
            1
        ], round = !1;
        function scale(x) {
            var x1, y = Math.sign(x1 = squared(x)) * Math.sqrt(Math.abs(x1));
            return isNaN(y) ? unknown : round ? Math.round(y) : y;
        }
        return scale.invert = function(y) {
            return squared.invert(square(y));
        }, scale.domain = function(_) {
            return arguments.length ? (squared.domain(_), scale) : squared.domain();
        }, scale.range = function(_) {
            return arguments.length ? (squared.range((range = Array.from(_, number$2)).map(square)), scale) : range.slice();
        }, scale.rangeRound = function(_) {
            return scale.range(_).round(!0);
        }, scale.round = function(_) {
            return arguments.length ? (round = !!_, scale) : round;
        }, scale.clamp = function(_) {
            return arguments.length ? (squared.clamp(_), scale) : squared.clamp();
        }, scale.unknown = function(_) {
            return arguments.length ? (unknown = _, scale) : unknown;
        }, scale.copy = function() {
            return radial$1(squared.domain(), range).round(round).clamp(squared.clamp()).unknown(unknown);
        }, initRange.apply(scale, arguments), linearish(scale);
    }, exports1.scaleSequential = function sequential() {
        var scale = linearish(transformer$2()(identity$6));
        return scale.copy = function() {
            return copy$1(scale, sequential());
        }, initInterpolator.apply(scale, arguments);
    }, exports1.scaleSequentialLog = function sequentialLog() {
        var scale = loggish(transformer$2()).domain([
            1,
            10
        ]);
        return scale.copy = function() {
            return copy$1(scale, sequentialLog()).base(scale.base());
        }, initInterpolator.apply(scale, arguments);
    }, exports1.scaleSequentialPow = sequentialPow, exports1.scaleSequentialQuantile = function sequentialQuantile() {
        var domain = [], interpolator = identity$6;
        function scale(x) {
            if (!isNaN(x = +x)) return interpolator((bisectRight(domain, x, 1) - 1) / (domain.length - 1));
        }
        return scale.domain = function(_) {
            if (!arguments.length) return domain.slice();
            for (let d of (domain = [], _))null == d || isNaN(d = +d) || domain.push(d);
            return domain.sort(ascending), scale;
        }, scale.interpolator = function(_) {
            return arguments.length ? (interpolator = _, scale) : interpolator;
        }, scale.range = function() {
            return domain.map((d, i)=>interpolator(i / (domain.length - 1)));
        }, scale.quantiles = function(n) {
            return Array.from({
                length: n + 1
            }, (_, i)=>quantile(domain, i / n));
        }, scale.copy = function() {
            return sequentialQuantile(interpolator).domain(domain);
        }, initInterpolator.apply(scale, arguments);
    }, exports1.scaleSequentialSqrt = function() {
        return sequentialPow.apply(null, arguments).exponent(0.5);
    }, exports1.scaleSequentialSymlog = function sequentialSymlog() {
        var scale = symlogish(transformer$2());
        return scale.copy = function() {
            return copy$1(scale, sequentialSymlog()).constant(scale.constant());
        }, initInterpolator.apply(scale, arguments);
    }, exports1.scaleSqrt = function() {
        return pow$2.apply(null, arguments).exponent(0.5);
    }, exports1.scaleSymlog = function symlog() {
        var scale = symlogish(transformer$1());
        return scale.copy = function() {
            return copy(scale, symlog()).constant(scale.constant());
        }, initRange.apply(scale, arguments);
    }, exports1.scaleThreshold = function threshold() {
        var unknown, domain = [
            0.5
        ], range = [
            0,
            1
        ], n = 1;
        function scale(x) {
            return x <= x ? range[bisectRight(domain, x, 0, n)] : unknown;
        }
        return scale.domain = function(_) {
            return arguments.length ? (n = Math.min((domain = Array.from(_)).length, range.length - 1), scale) : domain.slice();
        }, scale.range = function(_) {
            return arguments.length ? (range = Array.from(_), n = Math.min(domain.length, range.length - 1), scale) : range.slice();
        }, scale.invertExtent = function(y) {
            var i = range.indexOf(y);
            return [
                domain[i - 1],
                domain[i]
            ];
        }, scale.unknown = function(_) {
            return arguments.length ? (unknown = _, scale) : unknown;
        }, scale.copy = function() {
            return threshold().domain(domain).range(range).unknown(unknown);
        }, initRange.apply(scale, arguments);
    }, exports1.scaleTime = function() {
        return initRange.apply(calendar(year, month, sunday, day, hour, minute, second, millisecond, exports1.timeFormat).domain([
            new Date(2000, 0, 1),
            new Date(2000, 0, 2)
        ]), arguments);
    }, exports1.scaleUtc = function() {
        return initRange.apply(calendar(utcYear, utcMonth, utcSunday, utcDay, utcHour, utcMinute, second, millisecond, exports1.utcFormat).domain([
            Date.UTC(2000, 0, 1),
            Date.UTC(2000, 0, 2)
        ]), arguments);
    }, exports1.scan = function(values, compare) {
        const index = leastIndex(values, compare);
        return index < 0 ? void 0 : index;
    }, exports1.schemeAccent = Accent, exports1.schemeBlues = scheme$l, exports1.schemeBrBG = scheme, exports1.schemeBuGn = scheme$9, exports1.schemeBuPu = scheme$a, exports1.schemeCategory10 = category10, exports1.schemeDark2 = Dark2, exports1.schemeGnBu = scheme$b, exports1.schemeGreens = scheme$m, exports1.schemeGreys = scheme$n, exports1.schemeOrRd = scheme$c, exports1.schemeOranges = scheme$q, exports1.schemePRGn = scheme$1, exports1.schemePaired = Paired, exports1.schemePastel1 = Pastel1, exports1.schemePastel2 = Pastel2, exports1.schemePiYG = scheme$2, exports1.schemePuBu = scheme$e, exports1.schemePuBuGn = scheme$d, exports1.schemePuOr = scheme$3, exports1.schemePuRd = scheme$f, exports1.schemePurples = scheme$o, exports1.schemeRdBu = scheme$4, exports1.schemeRdGy = scheme$5, exports1.schemeRdPu = scheme$g, exports1.schemeRdYlBu = scheme$6, exports1.schemeRdYlGn = scheme$7, exports1.schemeReds = scheme$p, exports1.schemeSet1 = Set1, exports1.schemeSet2 = Set2, exports1.schemeSet3 = Set3, exports1.schemeSpectral = scheme$8, exports1.schemeTableau10 = Tableau10, exports1.schemeYlGn = scheme$i, exports1.schemeYlGnBu = scheme$h, exports1.schemeYlOrBr = scheme$j, exports1.schemeYlOrRd = scheme$k, exports1.select = select, exports1.selectAll = function(selector) {
        return "string" == typeof selector ? new Selection([
            document.querySelectorAll(selector)
        ], [
            document.documentElement
        ]) : new Selection([
            null == selector ? [] : array$1(selector)
        ], root);
    }, exports1.selection = selection, exports1.selector = selector, exports1.selectorAll = selectorAll, exports1.shuffle = shuffle, exports1.shuffler = shuffler, exports1.some = function(values, test) {
        if ("function" != typeof test) throw TypeError("test is not a function");
        let index = -1;
        for (const value of values)if (test(value, ++index, values)) return !0;
        return !1;
    }, exports1.sort = function(values, f = ascending) {
        if ("function" != typeof values[Symbol.iterator]) throw TypeError("values is not iterable");
        return (values = Array.from(values), 1 === f.length) ? (f = values.map(f), permute(values, values.map((d, i)=>i).sort((i, j)=>ascending(f[i], f[j])))) : values.sort(f);
    }, exports1.stack = function() {
        var keys = constant$a([]), order = none$2, offset = none$1, value = stackValue;
        function stack(data) {
            var i, oz, sz = Array.from(keys.apply(this, arguments), stackSeries), n = sz.length, j = -1;
            for (const d of data)for(i = 0, ++j; i < n; ++i)(sz[i][j] = [
                0,
                +value(d, sz[i].key, j, data)
            ]).data = d;
            for(i = 0, oz = array$5(order(sz)); i < n; ++i)sz[oz[i]].index = i;
            return offset(sz, oz), sz;
        }
        return stack.keys = function(_) {
            return arguments.length ? (keys = "function" == typeof _ ? _ : constant$a(Array.from(_)), stack) : keys;
        }, stack.value = function(_) {
            return arguments.length ? (value = "function" == typeof _ ? _ : constant$a(+_), stack) : value;
        }, stack.order = function(_) {
            return arguments.length ? (order = null == _ ? none$2 : "function" == typeof _ ? _ : constant$a(Array.from(_)), stack) : order;
        }, stack.offset = function(_) {
            return arguments.length ? (offset = null == _ ? none$1 : _, stack) : offset;
        }, stack;
    }, exports1.stackOffsetDiverging = function(series, order) {
        if ((n = series.length) > 0) for(var i, d, dy, yp, yn, n, j = 0, m = series[order[0]].length; j < m; ++j)for(yp = yn = 0, i = 0; i < n; ++i)(dy = (d = series[order[i]][j])[1] - d[0]) > 0 ? (d[0] = yp, d[1] = yp += dy) : dy < 0 ? (d[1] = yn, d[0] = yn += dy) : (d[0] = 0, d[1] = dy);
    }, exports1.stackOffsetExpand = function(series, order) {
        if ((n = series.length) > 0) {
            for(var i, n, y, j = 0, m = series[0].length; j < m; ++j){
                for(y = i = 0; i < n; ++i)y += series[i][j][1] || 0;
                if (y) for(i = 0; i < n; ++i)series[i][j][1] /= y;
            }
            none$1(series, order);
        }
    }, exports1.stackOffsetNone = none$1, exports1.stackOffsetSilhouette = function(series, order) {
        if ((n = series.length) > 0) {
            for(var n, j = 0, s0 = series[order[0]], m = s0.length; j < m; ++j){
                for(var i = 0, y = 0; i < n; ++i)y += series[i][j][1] || 0;
                s0[j][1] += s0[j][0] = -y / 2;
            }
            none$1(series, order);
        }
    }, exports1.stackOffsetWiggle = function(series, order) {
        if ((n = series.length) > 0 && (m = (s0 = series[order[0]]).length) > 0) {
            for(var s0, m, n, y = 0, j = 1; j < m; ++j){
                for(var i = 0, s1 = 0, s2 = 0; i < n; ++i){
                    for(var si = series[order[i]], sij0 = si[j][1] || 0, s3 = (sij0 - (si[j - 1][1] || 0)) / 2, k = 0; k < i; ++k){
                        var sk = series[order[k]];
                        s3 += (sk[j][1] || 0) - (sk[j - 1][1] || 0);
                    }
                    s1 += sij0, s2 += s3 * sij0;
                }
                s0[j - 1][1] += s0[j - 1][0] = y, s1 && (y -= s2 / s1);
            }
            s0[j - 1][1] += s0[j - 1][0] = y, none$1(series, order);
        }
    }, exports1.stackOrderAppearance = appearance, exports1.stackOrderAscending = ascending$3, exports1.stackOrderDescending = function(series) {
        return ascending$3(series).reverse();
    }, exports1.stackOrderInsideOut = function(series) {
        var i, j, n = series.length, sums = series.map(sum$1), order = appearance(series), top = 0, bottom = 0, tops = [], bottoms = [];
        for(i = 0; i < n; ++i)j = order[i], top < bottom ? (top += sums[j], tops.push(j)) : (bottom += sums[j], bottoms.push(j));
        return bottoms.reverse().concat(tops);
    }, exports1.stackOrderNone = none$2, exports1.stackOrderReverse = function(series) {
        return none$2(series).reverse();
    }, exports1.stratify = function() {
        var id = defaultId, parentId = defaultParentId;
        function stratify(data) {
            var d, i, root, parent, node, nodeId, nodeKey, nodes = Array.from(data), n = nodes.length, nodeByKey = new Map;
            for(i = 0; i < n; ++i)d = nodes[i], node = nodes[i] = new Node(d), null != (nodeId = id(d, i, data)) && (nodeId += "") && (nodeKey = node.id = nodeId, nodeByKey.set(nodeKey, nodeByKey.has(nodeKey) ? ambiguous : node)), null != (nodeId = parentId(d, i, data)) && (nodeId += "") && (node.parent = nodeId);
            for(i = 0; i < n; ++i)if (nodeId = (node = nodes[i]).parent) {
                if (!(parent = nodeByKey.get(nodeId))) throw Error("missing: " + nodeId);
                if (parent === ambiguous) throw Error("ambiguous: " + nodeId);
                parent.children ? parent.children.push(node) : parent.children = [
                    node
                ], node.parent = parent;
            } else {
                if (root) throw Error("multiple roots");
                root = node;
            }
            if (!root) throw Error("no root");
            if (root.parent = preroot, root.eachBefore(function(node) {
                node.depth = node.parent.depth + 1, --n;
            }).eachBefore(computeHeight), root.parent = null, n > 0) throw Error("cycle");
            return root;
        }
        return stratify.id = function(x) {
            return arguments.length ? (id = required(x), stratify) : id;
        }, stratify.parentId = function(x) {
            return arguments.length ? (parentId = required(x), stratify) : parentId;
        }, stratify;
    }, exports1.style = styleValue, exports1.subset = function(values, other) {
        return superset(other, values);
    }, exports1.sum = function(values, valueof) {
        let sum = 0;
        if (void 0 === valueof) for (let value of values)(value = +value) && (sum += value);
        else {
            let index = -1;
            for (let value of values)(value = +valueof(value, ++index, values)) && (sum += value);
        }
        return sum;
    }, exports1.superset = superset, exports1.svg = svg, exports1.symbol = function(type, size) {
        var context = null;
        function symbol() {
            var buffer;
            if (context || (context = buffer = path()), type.apply(this, arguments).draw(context, +size.apply(this, arguments)), buffer) return context = null, buffer + "" || null;
        }
        return type = "function" == typeof type ? type : constant$a(type || circle$2), size = "function" == typeof size ? size : constant$a(void 0 === size ? 64 : +size), symbol.type = function(_) {
            return arguments.length ? (type = "function" == typeof _ ? _ : constant$a(_), symbol) : type;
        }, symbol.size = function(_) {
            return arguments.length ? (size = "function" == typeof _ ? _ : constant$a(+_), symbol) : size;
        }, symbol.context = function(_) {
            return arguments.length ? (context = null == _ ? null : _, symbol) : context;
        }, symbol;
    }, exports1.symbolCircle = circle$2, exports1.symbolCross = cross$2, exports1.symbolDiamond = diamond, exports1.symbolSquare = square$1, exports1.symbolStar = star, exports1.symbolTriangle = triangle, exports1.symbolWye = wye, exports1.symbols = symbols, exports1.text = text, exports1.thresholdFreedmanDiaconis = function(values, min, max) {
        return Math.ceil((max - min) / (2 * (quantile(values, 0.75) - quantile(values, 0.25)) * Math.pow(count(values), -1 / 3)));
    }, exports1.thresholdScott = function(values, min, max) {
        return Math.ceil((max - min) / (3.5 * deviation(values) * Math.pow(count(values), -1 / 3)));
    }, exports1.thresholdSturges = thresholdSturges, exports1.tickFormat = tickFormat, exports1.tickIncrement = tickIncrement, exports1.tickStep = tickStep, exports1.ticks = ticks, exports1.timeDay = day, exports1.timeDays = days, exports1.timeFormatDefaultLocale = defaultLocale$1, exports1.timeFormatLocale = formatLocale$1, exports1.timeFriday = friday, exports1.timeFridays = fridays, exports1.timeHour = hour, exports1.timeHours = hours, exports1.timeInterval = newInterval, exports1.timeMillisecond = millisecond, exports1.timeMilliseconds = milliseconds, exports1.timeMinute = minute, exports1.timeMinutes = minutes, exports1.timeMonday = monday, exports1.timeMondays = mondays, exports1.timeMonth = month, exports1.timeMonths = months, exports1.timeSaturday = saturday, exports1.timeSaturdays = saturdays, exports1.timeSecond = second, exports1.timeSeconds = seconds, exports1.timeSunday = sunday, exports1.timeSundays = sundays, exports1.timeThursday = thursday, exports1.timeThursdays = thursdays, exports1.timeTuesday = tuesday, exports1.timeTuesdays = tuesdays, exports1.timeWednesday = wednesday, exports1.timeWednesdays = wednesdays, exports1.timeWeek = sunday, exports1.timeWeeks = sundays, exports1.timeYear = year, exports1.timeYears = years, exports1.timeout = timeout$1, exports1.timer = timer, exports1.timerFlush = timerFlush, exports1.transition = transition, exports1.transpose = transpose, exports1.tree = // Node-link tree diagram using the Reingold-Tilford "tidy" algorithm
    function() {
        var separation = defaultSeparation$1, dx = 1, dy = 1, nodeSize = null;
        function tree(root) {
            var t = function(root) {
                for(var node, child, children, i, n, tree = new TreeNode(root, 0), nodes = [
                    tree
                ]; node = nodes.pop();)if (children = node._.children) for(node.children = Array(n = children.length), i = n - 1; i >= 0; --i)nodes.push(child = node.children[i] = new TreeNode(children[i], i)), child.parent = node;
                return (tree.parent = new TreeNode(null, 0)).children = [
                    tree
                ], tree;
            }(root);
            // If a fixed node size is specified, scale x and y.
            if (// Compute the layout using Buchheim et al.’s algorithm.
            t.eachAfter(firstWalk), t.parent.m = -t.z, t.eachBefore(secondWalk), nodeSize) root.eachBefore(sizeNode);
            else {
                var left = root, right = root, bottom = root;
                root.eachBefore(function(node) {
                    node.x < left.x && (left = node), node.x > right.x && (right = node), node.depth > bottom.depth && (bottom = node);
                });
                var s = left === right ? 1 : separation(left, right) / 2, tx = s - left.x, kx = dx / (right.x + s + tx), ky = dy / (bottom.depth || 1);
                root.eachBefore(function(node) {
                    node.x = (node.x + tx) * kx, node.y = node.depth * ky;
                });
            }
            return root;
        }
        // Computes a preliminary x-coordinate for v. Before that, FIRST WALK is
        // applied recursively to the children of v, as well as the function
        // APPORTION. After spacing out the children by calling EXECUTE SHIFTS, the
        // node v is placed to the midpoint of its outermost children.
        function firstWalk(v) {
            var children = v.children, siblings = v.parent.children, w = v.i ? siblings[v.i - 1] : null;
            if (children) {
                !// All other shifts, applied to the smaller subtrees between w- and w+, are
                // performed by this function. To prepare the shifts, we have to adjust
                // change(w+), shift(w+), and change(w-).
                function(v) {
                    for(var w, shift = 0, change = 0, children = v.children, i = children.length; --i >= 0;)w = children[i], w.z += shift, w.m += shift, shift += w.s + (change += w.c);
                }(v);
                var midpoint = (children[0].z + children[children.length - 1].z) / 2;
                w ? (v.z = w.z + separation(v._, w._), v.m = v.z - midpoint) : v.z = midpoint;
            } else w && (v.z = w.z + separation(v._, w._));
            v.parent.A = // The core of the algorithm. Here, a new subtree is combined with the
            // previous subtrees. Threads are used to traverse the inside and outside
            // contours of the left and right subtree up to the highest common level. The
            // vertices used for the traversals are vi+, vi-, vo-, and vo+, where the
            // superscript o means outside and i means inside, the subscript - means left
            // subtree and + means right subtree. For summing up the modifiers along the
            // contour, we use respective variables si+, si-, so-, and so+. Whenever two
            // nodes of the inside contours conflict, we compute the left one of the
            // greatest uncommon ancestors using the function ANCESTOR and call MOVE
            // SUBTREE to shift the subtree and prepare the shifts of smaller subtrees.
            // Finally, we add a new thread (if necessary).
            function(v, w, ancestor) {
                if (w) {
                    for(var vim, ancestor1, shift, vip = v, vop = v, vim1 = w, vom = vip.parent.children[0], sip = vip.m, sop = vop.m, sim = vim1.m, som = vom.m; vim1 = nextRight(vim1), vip = nextLeft(vip), vim1 && vip;)vom = nextLeft(vom), (vop = nextRight(vop)).a = v, (shift = vim1.z + sim - vip.z - sip + separation(vim1._, vip._)) > 0 && (// Shifts the current subtree rooted at w+. This is done by increasing
                    // prelim(w+) and mod(w+) by shift.
                    function(wm, wp, shift) {
                        var change = shift / (wp.i - wm.i);
                        wp.c -= change, wp.s += shift, wm.c += change, wp.z += shift, wp.m += shift;
                    }((vim = vim1, ancestor1 = ancestor, vim.a.parent === v.parent ? vim.a : ancestor1), v, shift), sip += shift, sop += shift), sim += vim1.m, sip += vip.m, som += vom.m, sop += vop.m;
                    vim1 && !nextRight(vop) && (vop.t = vim1, vop.m += sim - sop), vip && !nextLeft(vom) && (vom.t = vip, vom.m += sip - som, ancestor = v);
                }
                return ancestor;
            }(v, w, v.parent.A || siblings[0]);
        }
        // Computes all real x-coordinates by summing up the modifiers recursively.
        function secondWalk(v) {
            v._.x = v.z + v.parent.m, v.m += v.parent.m;
        }
        function sizeNode(node) {
            node.x *= dx, node.y = node.depth * dy;
        }
        return tree.separation = function(x) {
            return arguments.length ? (separation = x, tree) : separation;
        }, tree.size = function(x) {
            return arguments.length ? (nodeSize = !1, dx = +x[0], dy = +x[1], tree) : nodeSize ? null : [
                dx,
                dy
            ];
        }, tree.nodeSize = function(x) {
            return arguments.length ? (nodeSize = !0, dx = +x[0], dy = +x[1], tree) : nodeSize ? [
                dx,
                dy
            ] : null;
        }, tree;
    }, exports1.treemap = function() {
        var tile = squarify, round = !1, dx = 1, dy = 1, paddingStack = [
            0
        ], paddingInner = constantZero, paddingTop = constantZero, paddingRight = constantZero, paddingBottom = constantZero, paddingLeft = constantZero;
        function treemap(root) {
            return root.x0 = root.y0 = 0, root.x1 = dx, root.y1 = dy, root.eachBefore(positionNode), paddingStack = [
                0
            ], round && root.eachBefore(roundNode), root;
        }
        function positionNode(node) {
            var p = paddingStack[node.depth], x0 = node.x0 + p, y0 = node.y0 + p, x1 = node.x1 - p, y1 = node.y1 - p;
            x1 < x0 && (x0 = x1 = (x0 + x1) / 2), y1 < y0 && (y0 = y1 = (y0 + y1) / 2), node.x0 = x0, node.y0 = y0, node.x1 = x1, node.y1 = y1, node.children && (p = paddingStack[node.depth + 1] = paddingInner(node) / 2, x0 += paddingLeft(node) - p, y0 += paddingTop(node) - p, x1 -= paddingRight(node) - p, y1 -= paddingBottom(node) - p, x1 < x0 && (x0 = x1 = (x0 + x1) / 2), y1 < y0 && (y0 = y1 = (y0 + y1) / 2), tile(node, x0, y0, x1, y1));
        }
        return treemap.round = function(x) {
            return arguments.length ? (round = !!x, treemap) : round;
        }, treemap.size = function(x) {
            return arguments.length ? (dx = +x[0], dy = +x[1], treemap) : [
                dx,
                dy
            ];
        }, treemap.tile = function(x) {
            return arguments.length ? (tile = required(x), treemap) : tile;
        }, treemap.padding = function(x) {
            return arguments.length ? treemap.paddingInner(x).paddingOuter(x) : treemap.paddingInner();
        }, treemap.paddingInner = function(x) {
            return arguments.length ? (paddingInner = "function" == typeof x ? x : constant$9(+x), treemap) : paddingInner;
        }, treemap.paddingOuter = function(x) {
            return arguments.length ? treemap.paddingTop(x).paddingRight(x).paddingBottom(x).paddingLeft(x) : treemap.paddingTop();
        }, treemap.paddingTop = function(x) {
            return arguments.length ? (paddingTop = "function" == typeof x ? x : constant$9(+x), treemap) : paddingTop;
        }, treemap.paddingRight = function(x) {
            return arguments.length ? (paddingRight = "function" == typeof x ? x : constant$9(+x), treemap) : paddingRight;
        }, treemap.paddingBottom = function(x) {
            return arguments.length ? (paddingBottom = "function" == typeof x ? x : constant$9(+x), treemap) : paddingBottom;
        }, treemap.paddingLeft = function(x) {
            return arguments.length ? (paddingLeft = "function" == typeof x ? x : constant$9(+x), treemap) : paddingLeft;
        }, treemap;
    }, exports1.treemapBinary = function(parent, x0, y0, x1, y1) {
        var i, sum, nodes = parent.children, n = nodes.length, sums = Array(n + 1);
        for(sums[0] = sum = i = 0; i < n; ++i)sums[i + 1] = sum += nodes[i].value;
        (function partition(i, j, value, x0, y0, x1, y1) {
            if (i >= j - 1) {
                var node = nodes[i];
                node.x0 = x0, node.y0 = y0, node.x1 = x1, node.y1 = y1;
                return;
            }
            for(var valueOffset = sums[i], valueTarget = value / 2 + valueOffset, k = i + 1, hi = j - 1; k < hi;){
                var mid = k + hi >>> 1;
                sums[mid] < valueTarget ? k = mid + 1 : hi = mid;
            }
            valueTarget - sums[k - 1] < sums[k] - valueTarget && i + 1 < k && --k;
            var valueLeft = sums[k] - valueOffset, valueRight = value - valueLeft;
            if (x1 - x0 > y1 - y0) {
                var xk = value ? (x0 * valueRight + x1 * valueLeft) / value : x1;
                partition(i, k, valueLeft, x0, y0, xk, y1), partition(k, j, valueRight, xk, y0, x1, y1);
            } else {
                var yk = value ? (y0 * valueRight + y1 * valueLeft) / value : y1;
                partition(i, k, valueLeft, x0, y0, x1, yk), partition(k, j, valueRight, x0, yk, x1, y1);
            }
        })(0, n, parent.value, x0, y0, x1, y1);
    }, exports1.treemapDice = treemapDice, exports1.treemapResquarify = resquarify, exports1.treemapSlice = treemapSlice, exports1.treemapSliceDice = function(parent, x0, y0, x1, y1) {
        (1 & parent.depth ? treemapSlice : treemapDice)(parent, x0, y0, x1, y1);
    }, exports1.treemapSquarify = squarify, exports1.tsv = tsv$1, exports1.tsvFormat = tsvFormat, exports1.tsvFormatBody = tsvFormatBody, exports1.tsvFormatRow = tsvFormatRow, exports1.tsvFormatRows = tsvFormatRows, exports1.tsvFormatValue = tsvFormatValue, exports1.tsvParse = tsvParse, exports1.tsvParseRows = tsvParseRows, exports1.union = function(...others) {
        const set = new Set();
        for (const other of others)for (const o of other)set.add(o);
        return set;
    }, exports1.utcDay = utcDay, exports1.utcDays = utcDays, exports1.utcFriday = utcFriday, exports1.utcFridays = utcFridays, exports1.utcHour = utcHour, exports1.utcHours = utcHours, exports1.utcMillisecond = millisecond, exports1.utcMilliseconds = milliseconds, exports1.utcMinute = utcMinute, exports1.utcMinutes = utcMinutes, exports1.utcMonday = utcMonday, exports1.utcMondays = utcMondays, exports1.utcMonth = utcMonth, exports1.utcMonths = utcMonths, exports1.utcSaturday = utcSaturday, exports1.utcSaturdays = utcSaturdays, exports1.utcSecond = second, exports1.utcSeconds = seconds, exports1.utcSunday = utcSunday, exports1.utcSundays = utcSundays, exports1.utcThursday = utcThursday, exports1.utcThursdays = utcThursdays, exports1.utcTuesday = utcTuesday, exports1.utcTuesdays = utcTuesdays, exports1.utcWednesday = utcWednesday, exports1.utcWednesdays = utcWednesdays, exports1.utcWeek = utcSunday, exports1.utcWeeks = utcSundays, exports1.utcYear = utcYear, exports1.utcYears = utcYears, exports1.variance = variance, exports1.version = "6.3.1", exports1.window = defaultView, exports1.xml = xml, exports1.zip = function() {
        return transpose(arguments);
    }, exports1.zoom = function() {
        var touchstarting, touchfirst, touchending, filter = defaultFilter$2, extent = defaultExtent$1, constrain = defaultConstrain, wheelDelta = defaultWheelDelta, touchable = defaultTouchable$2, scaleExtent = [
            0,
            1 / 0
        ], translateExtent = [
            [
                -1 / 0,
                -1 / 0
            ],
            [
                1 / 0,
                1 / 0
            ]
        ], duration = 250, interpolate = interpolateZoom, listeners = dispatch("start", "zoom", "end"), clickDistance2 = 0, tapDistance = 10;
        function zoom(selection) {
            selection.property("__zoom", defaultTransform).on("wheel.zoom", wheeled).on("mousedown.zoom", mousedowned).on("dblclick.zoom", dblclicked).filter(touchable).on("touchstart.zoom", touchstarted).on("touchmove.zoom", touchmoved).on("touchend.zoom touchcancel.zoom", touchended).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
        }
        function scale(transform, k) {
            return (k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], k))) === transform.k ? transform : new Transform(k, transform.x, transform.y);
        }
        function translate(transform, p0, p1) {
            var x = p0[0] - p1[0] * transform.k, y = p0[1] - p1[1] * transform.k;
            return x === transform.x && y === transform.y ? transform : new Transform(transform.k, x, y);
        }
        function centroid(extent) {
            return [
                (+extent[0][0] + +extent[1][0]) / 2,
                (+extent[0][1] + +extent[1][1]) / 2
            ];
        }
        function schedule(transition, transform, point, event) {
            transition.on("start.zoom", function() {
                gesture(this, arguments).event(event).start();
            }).on("interrupt.zoom end.zoom", function() {
                gesture(this, arguments).event(event).end();
            }).tween("zoom", function() {
                var args = arguments, g = gesture(this, args).event(event), e = extent.apply(this, args), p = null == point ? centroid(e) : "function" == typeof point ? point.apply(this, args) : point, w = Math.max(e[1][0] - e[0][0], e[1][1] - e[0][1]), a = this.__zoom, b = "function" == typeof transform ? transform.apply(this, args) : transform, i = interpolate(a.invert(p).concat(w / a.k), b.invert(p).concat(w / b.k));
                return function(t) {
                    if (1 === t) t = b; // Avoid rounding error on end.
                    else {
                        var l = i(t), k = w / l[2];
                        t = new Transform(k, p[0] - l[0] * k, p[1] - l[1] * k);
                    }
                    g.zoom(null, t);
                };
            });
        }
        function gesture(that, args, clean) {
            return !clean && that.__zooming || new Gesture(that, args);
        }
        function Gesture(that, args) {
            this.that = that, this.args = args, this.active = 0, this.sourceEvent = null, this.extent = extent.apply(that, args), this.taps = 0;
        }
        function wheeled(event, ...args) {
            if (filter.apply(this, arguments)) {
                var g = gesture(this, args).event(event), t = this.__zoom, k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], t.k * Math.pow(2, wheelDelta.apply(this, arguments)))), p = pointer(event);
                // If the mouse is in the same location as before, reuse it.
                // If there were recent wheel events, reset the wheel idle timeout.
                if (g.wheel) (g.mouse[0][0] !== p[0] || g.mouse[0][1] !== p[1]) && (g.mouse[1] = t.invert(g.mouse[0] = p)), clearTimeout(g.wheel);
                else {
                    if (t.k === k) return;
                    g.mouse = [
                        p,
                        t.invert(p)
                    ], interrupt(this), g.start();
                }
                noevent$2(event), g.wheel = setTimeout(function() {
                    g.wheel = null, g.end();
                }, 150), g.zoom("mouse", constrain(translate(scale(t, k), g.mouse[0], g.mouse[1]), g.extent, translateExtent));
            }
        }
        function mousedowned(event, ...args) {
            if (!touchending && filter.apply(this, arguments)) {
                var g = gesture(this, args, !0).event(event), v = select(event.view).on("mousemove.zoom", function(event) {
                    if (noevent$2(event), !g.moved) {
                        var dx = event.clientX - x0, dy = event.clientY - y0;
                        g.moved = dx * dx + dy * dy > clickDistance2;
                    }
                    g.event(event).zoom("mouse", constrain(translate(g.that.__zoom, g.mouse[0] = pointer(event, currentTarget), g.mouse[1]), g.extent, translateExtent));
                }, !0).on("mouseup.zoom", function(event) {
                    v.on("mousemove.zoom mouseup.zoom", null), yesdrag(event.view, g.moved), noevent$2(event), g.event(event).end();
                }, !0), p = pointer(event, currentTarget), currentTarget = event.currentTarget, x0 = event.clientX, y0 = event.clientY;
                dragDisable(event.view), nopropagation$2(event), g.mouse = [
                    p,
                    this.__zoom.invert(p)
                ], interrupt(this), g.start();
            }
        }
        function dblclicked(event, ...args) {
            if (filter.apply(this, arguments)) {
                var t0 = this.__zoom, p0 = pointer(event.changedTouches ? event.changedTouches[0] : event, this), p1 = t0.invert(p0), k1 = t0.k * (event.shiftKey ? 0.5 : 2), t1 = constrain(translate(scale(t0, k1), p0, p1), extent.apply(this, args), translateExtent);
                noevent$2(event), duration > 0 ? select(this).transition().duration(duration).call(schedule, t1, p0, event) : select(this).call(zoom.transform, t1, p0, event);
            }
        }
        function touchstarted(event, ...args) {
            if (filter.apply(this, arguments)) {
                var started, i, t, p, touches = event.touches, n = touches.length, g = gesture(this, args, event.changedTouches.length === n).event(event);
                for(nopropagation$2(event), i = 0; i < n; ++i)p = [
                    p = pointer(t = touches[i], this),
                    this.__zoom.invert(p),
                    t.identifier
                ], g.touch0 ? g.touch1 || g.touch0[2] === p[2] || (g.touch1 = p, g.taps = 0) : (g.touch0 = p, started = !0, g.taps = 1 + !!touchstarting);
                touchstarting && (touchstarting = clearTimeout(touchstarting)), started && (g.taps < 2 && (touchfirst = p[0], touchstarting = setTimeout(function() {
                    touchstarting = null;
                }, 500)), interrupt(this), g.start());
            }
        }
        function touchmoved(event, ...args) {
            if (this.__zooming) {
                var i, t, p, l, g = gesture(this, args).event(event), touches = event.changedTouches, n = touches.length;
                for(noevent$2(event), i = 0; i < n; ++i)p = pointer(t = touches[i], this), g.touch0 && g.touch0[2] === t.identifier ? g.touch0[0] = p : g.touch1 && g.touch1[2] === t.identifier && (g.touch1[0] = p);
                if (t = g.that.__zoom, g.touch1) {
                    var p0 = g.touch0[0], l0 = g.touch0[1], p1 = g.touch1[0], l1 = g.touch1[1], dp = (dp = p1[0] - p0[0]) * dp + (dp = p1[1] - p0[1]) * dp, dl = (dl = l1[0] - l0[0]) * dl + (dl = l1[1] - l0[1]) * dl;
                    t = scale(t, Math.sqrt(dp / dl)), p = [
                        (p0[0] + p1[0]) / 2,
                        (p0[1] + p1[1]) / 2
                    ], l = [
                        (l0[0] + l1[0]) / 2,
                        (l0[1] + l1[1]) / 2
                    ];
                } else {
                    if (!g.touch0) return;
                    p = g.touch0[0], l = g.touch0[1];
                }
                g.zoom("touch", constrain(translate(t, p, l), g.extent, translateExtent));
            }
        }
        function touchended(event, ...args) {
            if (this.__zooming) {
                var i, t, g = gesture(this, args).event(event), touches = event.changedTouches, n = touches.length;
                for(nopropagation$2(event), touchending && clearTimeout(touchending), touchending = setTimeout(function() {
                    touchending = null;
                }, 500), i = 0; i < n; ++i)t = touches[i], g.touch0 && g.touch0[2] === t.identifier ? delete g.touch0 : g.touch1 && g.touch1[2] === t.identifier && delete g.touch1;
                if (g.touch1 && !g.touch0 && (g.touch0 = g.touch1, delete g.touch1), g.touch0) g.touch0[1] = this.__zoom.invert(g.touch0[0]);
                else // If this was a dbltap, reroute to the (optional) dblclick.zoom handler.
                if (g.end(), 2 === g.taps && (t = pointer(t, this), Math.hypot(touchfirst[0] - t[0], touchfirst[1] - t[1]) < tapDistance)) {
                    var p = select(this).on("dblclick.zoom");
                    p && p.apply(this, arguments);
                }
            }
        }
        return zoom.transform = function(collection, transform, point, event) {
            var selection = collection.selection ? collection.selection() : collection;
            selection.property("__zoom", defaultTransform), collection !== selection ? schedule(collection, transform, point, event) : selection.interrupt().each(function() {
                gesture(this, arguments).event(event).start().zoom(null, "function" == typeof transform ? transform.apply(this, arguments) : transform).end();
            });
        }, zoom.scaleBy = function(selection, k, p, event) {
            zoom.scaleTo(selection, function() {
                var k0 = this.__zoom.k, k1 = "function" == typeof k ? k.apply(this, arguments) : k;
                return k0 * k1;
            }, p, event);
        }, zoom.scaleTo = function(selection, k, p, event) {
            zoom.transform(selection, function() {
                var e = extent.apply(this, arguments), t0 = this.__zoom, p0 = null == p ? centroid(e) : "function" == typeof p ? p.apply(this, arguments) : p, p1 = t0.invert(p0), k1 = "function" == typeof k ? k.apply(this, arguments) : k;
                return constrain(translate(scale(t0, k1), p0, p1), e, translateExtent);
            }, p, event);
        }, zoom.translateBy = function(selection, x, y, event) {
            zoom.transform(selection, function() {
                return constrain(this.__zoom.translate("function" == typeof x ? x.apply(this, arguments) : x, "function" == typeof y ? y.apply(this, arguments) : y), extent.apply(this, arguments), translateExtent);
            }, null, event);
        }, zoom.translateTo = function(selection, x, y, p, event) {
            zoom.transform(selection, function() {
                var e = extent.apply(this, arguments), t = this.__zoom, p0 = null == p ? centroid(e) : "function" == typeof p ? p.apply(this, arguments) : p;
                return constrain(identity$9.translate(p0[0], p0[1]).scale(t.k).translate("function" == typeof x ? -x.apply(this, arguments) : -x, "function" == typeof y ? -y.apply(this, arguments) : -y), e, translateExtent);
            }, p, event);
        }, Gesture.prototype = {
            event: function(event) {
                return event && (this.sourceEvent = event), this;
            },
            start: function() {
                return 1 == ++this.active && (this.that.__zooming = this, this.emit("start")), this;
            },
            zoom: function(key, transform) {
                return this.mouse && "mouse" !== key && (this.mouse[1] = transform.invert(this.mouse[0])), this.touch0 && "touch" !== key && (this.touch0[1] = transform.invert(this.touch0[0])), this.touch1 && "touch" !== key && (this.touch1[1] = transform.invert(this.touch1[0])), this.that.__zoom = transform, this.emit("zoom"), this;
            },
            end: function() {
                return 0 == --this.active && (delete this.that.__zooming, this.emit("end")), this;
            },
            emit: function(type) {
                var d = select(this.that).datum();
                listeners.call(type, this.that, new ZoomEvent(type, {
                    sourceEvent: this.sourceEvent,
                    target: zoom,
                    type,
                    transform: this.that.__zoom,
                    dispatch: listeners
                }), d);
            }
        }, zoom.wheelDelta = function(_) {
            return arguments.length ? (wheelDelta = "function" == typeof _ ? _ : constant$b(+_), zoom) : wheelDelta;
        }, zoom.filter = function(_) {
            return arguments.length ? (filter = "function" == typeof _ ? _ : constant$b(!!_), zoom) : filter;
        }, zoom.touchable = function(_) {
            return arguments.length ? (touchable = "function" == typeof _ ? _ : constant$b(!!_), zoom) : touchable;
        }, zoom.extent = function(_) {
            return arguments.length ? (extent = "function" == typeof _ ? _ : constant$b([
                [
                    +_[0][0],
                    +_[0][1]
                ],
                [
                    +_[1][0],
                    +_[1][1]
                ]
            ]), zoom) : extent;
        }, zoom.scaleExtent = function(_) {
            return arguments.length ? (scaleExtent[0] = +_[0], scaleExtent[1] = +_[1], zoom) : [
                scaleExtent[0],
                scaleExtent[1]
            ];
        }, zoom.translateExtent = function(_) {
            return arguments.length ? (translateExtent[0][0] = +_[0][0], translateExtent[1][0] = +_[1][0], translateExtent[0][1] = +_[0][1], translateExtent[1][1] = +_[1][1], zoom) : [
                [
                    translateExtent[0][0],
                    translateExtent[0][1]
                ],
                [
                    translateExtent[1][0],
                    translateExtent[1][1]
                ]
            ];
        }, zoom.constrain = function(_) {
            return arguments.length ? (constrain = _, zoom) : constrain;
        }, zoom.duration = function(_) {
            return arguments.length ? (duration = +_, zoom) : duration;
        }, zoom.interpolate = function(_) {
            return arguments.length ? (interpolate = _, zoom) : interpolate;
        }, zoom.on = function() {
            var value = listeners.on.apply(listeners, arguments);
            return value === listeners ? zoom : value;
        }, zoom.clickDistance = function(_) {
            return arguments.length ? (clickDistance2 = (_ = +_) * _, zoom) : Math.sqrt(clickDistance2);
        }, zoom.tapDistance = function(_) {
            return arguments.length ? (tapDistance = +_, zoom) : tapDistance;
        }, zoom;
    }, exports1.zoomIdentity = identity$9, exports1.zoomTransform = transform$1, Object.defineProperty(exports1, '__esModule', {
        value: !0
    });
});
