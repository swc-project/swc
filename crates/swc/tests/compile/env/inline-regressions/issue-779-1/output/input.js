"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
require("core-js/modules/es.array-buffer.constructor.js");
require("core-js/modules/es.array-buffer.slice.js");
require("core-js/modules/es.array.concat.js");
require("core-js/modules/es.array.copy-within.js");
require("core-js/modules/es.array.fill.js");
require("core-js/modules/es.array.filter.js");
require("core-js/modules/es.array.find-index.js");
require("core-js/modules/es.array.find.js");
require("core-js/modules/es.array.flat-map.js");
require("core-js/modules/es.array.flat.js");
require("core-js/modules/es.array.from.js");
require("core-js/modules/es.array.includes.js");
require("core-js/modules/es.array.iterator.js");
require("core-js/modules/es.array.join.js");
require("core-js/modules/es.array.map.js");
require("core-js/modules/es.array.of.js");
require("core-js/modules/es.array.reduce-right.js");
require("core-js/modules/es.array.reduce.js");
require("core-js/modules/es.array.reverse.js");
require("core-js/modules/es.array.slice.js");
require("core-js/modules/es.array.sort.js");
require("core-js/modules/es.array.species.js");
require("core-js/modules/es.array.splice.js");
require("core-js/modules/es.array.unscopables.flat-map.js");
require("core-js/modules/es.array.unscopables.flat.js");
require("core-js/modules/es.date.to-primitive.js");
require("core-js/modules/es.function.has-instance.js");
require("core-js/modules/es.function.name.js");
require("core-js/modules/es.json.to-string-tag.js");
require("core-js/modules/es.map.js");
require("core-js/modules/es.math.acosh.js");
require("core-js/modules/es.math.asinh.js");
require("core-js/modules/es.math.atanh.js");
require("core-js/modules/es.math.cbrt.js");
require("core-js/modules/es.math.clz32.js");
require("core-js/modules/es.math.cosh.js");
require("core-js/modules/es.math.expm1.js");
require("core-js/modules/es.math.fround.js");
require("core-js/modules/es.math.hypot.js");
require("core-js/modules/es.math.imul.js");
require("core-js/modules/es.math.log10.js");
require("core-js/modules/es.math.log1p.js");
require("core-js/modules/es.math.log2.js");
require("core-js/modules/es.math.sign.js");
require("core-js/modules/es.math.sinh.js");
require("core-js/modules/es.math.tanh.js");
require("core-js/modules/es.math.to-string-tag.js");
require("core-js/modules/es.math.trunc.js");
require("core-js/modules/es.number.constructor.js");
require("core-js/modules/es.number.epsilon.js");
require("core-js/modules/es.number.is-finite.js");
require("core-js/modules/es.number.is-integer.js");
require("core-js/modules/es.number.is-nan.js");
require("core-js/modules/es.number.is-safe-integer.js");
require("core-js/modules/es.number.max-safe-integer.js");
require("core-js/modules/es.number.min-safe-integer.js");
require("core-js/modules/es.number.parse-float.js");
require("core-js/modules/es.number.parse-int.js");
require("core-js/modules/es.number.to-fixed.js");
require("core-js/modules/es.object.assign.js");
require("core-js/modules/es.object.define-getter.js");
require("core-js/modules/es.object.define-setter.js");
require("core-js/modules/es.object.entries.js");
require("core-js/modules/es.object.freeze.js");
require("core-js/modules/es.object.from-entries.js");
require("core-js/modules/es.object.get-own-property-descriptor.js");
require("core-js/modules/es.object.get-own-property-descriptors.js");
require("core-js/modules/es.object.get-own-property-names.js");
require("core-js/modules/es.object.get-prototype-of.js");
require("core-js/modules/es.object.is-extensible.js");
require("core-js/modules/es.object.is-frozen.js");
require("core-js/modules/es.object.is-sealed.js");
require("core-js/modules/es.object.is.js");
require("core-js/modules/es.object.keys.js");
require("core-js/modules/es.object.lookup-getter.js");
require("core-js/modules/es.object.lookup-setter.js");
require("core-js/modules/es.object.prevent-extensions.js");
require("core-js/modules/es.object.seal.js");
require("core-js/modules/es.object.to-string.js");
require("core-js/modules/es.object.values.js");
require("core-js/modules/es.promise.finally.js");
require("core-js/modules/es.promise.js");
require("core-js/modules/es.reflect.apply.js");
require("core-js/modules/es.reflect.construct.js");
require("core-js/modules/es.reflect.define-property.js");
require("core-js/modules/es.reflect.delete-property.js");
require("core-js/modules/es.reflect.get-own-property-descriptor.js");
require("core-js/modules/es.reflect.get-prototype-of.js");
require("core-js/modules/es.reflect.get.js");
require("core-js/modules/es.reflect.has.js");
require("core-js/modules/es.reflect.is-extensible.js");
require("core-js/modules/es.reflect.own-keys.js");
require("core-js/modules/es.reflect.prevent-extensions.js");
require("core-js/modules/es.reflect.set-prototype-of.js");
require("core-js/modules/es.reflect.set.js");
require("core-js/modules/es.regexp.constructor.js");
require("core-js/modules/es.regexp.exec.js");
require("core-js/modules/es.regexp.flags.js");
require("core-js/modules/es.regexp.to-string.js");
require("core-js/modules/es.set.js");
require("core-js/modules/es.string.anchor.js");
require("core-js/modules/es.string.big.js");
require("core-js/modules/es.string.blink.js");
require("core-js/modules/es.string.bold.js");
require("core-js/modules/es.string.code-point-at.js");
require("core-js/modules/es.string.ends-with.js");
require("core-js/modules/es.string.fixed.js");
require("core-js/modules/es.string.fontcolor.js");
require("core-js/modules/es.string.fontsize.js");
require("core-js/modules/es.string.from-code-point.js");
require("core-js/modules/es.string.includes.js");
require("core-js/modules/es.string.italics.js");
require("core-js/modules/es.string.iterator.js");
require("core-js/modules/es.string.link.js");
require("core-js/modules/es.string.match.js");
require("core-js/modules/es.string.pad-end.js");
require("core-js/modules/es.string.pad-start.js");
require("core-js/modules/es.string.raw.js");
require("core-js/modules/es.string.repeat.js");
require("core-js/modules/es.string.replace.js");
require("core-js/modules/es.string.search.js");
require("core-js/modules/es.string.small.js");
require("core-js/modules/es.string.split.js");
require("core-js/modules/es.string.starts-with.js");
require("core-js/modules/es.string.strike.js");
require("core-js/modules/es.string.sub.js");
require("core-js/modules/es.string.sup.js");
require("core-js/modules/es.string.trim-end.js");
require("core-js/modules/es.string.trim-start.js");
require("core-js/modules/es.string.trim.js");
require("core-js/modules/es.symbol.async-iterator.js");
require("core-js/modules/es.symbol.description.js");
require("core-js/modules/es.symbol.has-instance.js");
require("core-js/modules/es.symbol.is-concat-spreadable.js");
require("core-js/modules/es.symbol.iterator.js");
require("core-js/modules/es.symbol.js");
require("core-js/modules/es.symbol.match.js");
require("core-js/modules/es.symbol.replace.js");
require("core-js/modules/es.symbol.search.js");
require("core-js/modules/es.symbol.species.js");
require("core-js/modules/es.symbol.split.js");
require("core-js/modules/es.symbol.to-primitive.js");
require("core-js/modules/es.symbol.to-string-tag.js");
require("core-js/modules/es.symbol.unscopables.js");
require("core-js/modules/es.typed-array.copy-within.js");
require("core-js/modules/es.typed-array.every.js");
require("core-js/modules/es.typed-array.fill.js");
require("core-js/modules/es.typed-array.filter.js");
require("core-js/modules/es.typed-array.find-index.js");
require("core-js/modules/es.typed-array.find.js");
require("core-js/modules/es.typed-array.float32-array.js");
require("core-js/modules/es.typed-array.float64-array.js");
require("core-js/modules/es.typed-array.for-each.js");
require("core-js/modules/es.typed-array.from.js");
require("core-js/modules/es.typed-array.includes.js");
require("core-js/modules/es.typed-array.index-of.js");
require("core-js/modules/es.typed-array.int16-array.js");
require("core-js/modules/es.typed-array.int32-array.js");
require("core-js/modules/es.typed-array.int8-array.js");
require("core-js/modules/es.typed-array.iterator.js");
require("core-js/modules/es.typed-array.join.js");
require("core-js/modules/es.typed-array.last-index-of.js");
require("core-js/modules/es.typed-array.map.js");
require("core-js/modules/es.typed-array.of.js");
require("core-js/modules/es.typed-array.reduce-right.js");
require("core-js/modules/es.typed-array.reduce.js");
require("core-js/modules/es.typed-array.reverse.js");
require("core-js/modules/es.typed-array.set.js");
require("core-js/modules/es.typed-array.slice.js");
require("core-js/modules/es.typed-array.some.js");
require("core-js/modules/es.typed-array.sort.js");
require("core-js/modules/es.typed-array.subarray.js");
require("core-js/modules/es.typed-array.to-locale-string.js");
require("core-js/modules/es.typed-array.to-string.js");
require("core-js/modules/es.typed-array.uint16-array.js");
require("core-js/modules/es.typed-array.uint32-array.js");
require("core-js/modules/es.typed-array.uint8-array.js");
require("core-js/modules/es.typed-array.uint8-clamped-array.js");
require("core-js/modules/es.weak-map.js");
require("core-js/modules/es.weak-set.js");
require("core-js/modules/esnext.aggregate-error.js");
require("core-js/modules/esnext.array.last-index.js");
require("core-js/modules/esnext.array.last-item.js");
require("core-js/modules/esnext.composite-key.js");
require("core-js/modules/esnext.composite-symbol.js");
require("core-js/modules/esnext.global-this.js");
require("core-js/modules/esnext.map.delete-all.js");
require("core-js/modules/esnext.map.every.js");
require("core-js/modules/esnext.map.filter.js");
require("core-js/modules/esnext.map.find-key.js");
require("core-js/modules/esnext.map.find.js");
require("core-js/modules/esnext.map.from.js");
require("core-js/modules/esnext.map.group-by.js");
require("core-js/modules/esnext.map.includes.js");
require("core-js/modules/esnext.map.key-by.js");
require("core-js/modules/esnext.map.key-of.js");
require("core-js/modules/esnext.map.map-keys.js");
require("core-js/modules/esnext.map.map-values.js");
require("core-js/modules/esnext.map.merge.js");
require("core-js/modules/esnext.map.of.js");
require("core-js/modules/esnext.map.reduce.js");
require("core-js/modules/esnext.map.some.js");
require("core-js/modules/esnext.map.update.js");
require("core-js/modules/esnext.math.clamp.js");
require("core-js/modules/esnext.math.deg-per-rad.js");
require("core-js/modules/esnext.math.degrees.js");
require("core-js/modules/esnext.math.fscale.js");
require("core-js/modules/esnext.math.iaddh.js");
require("core-js/modules/esnext.math.imulh.js");
require("core-js/modules/esnext.math.isubh.js");
require("core-js/modules/esnext.math.rad-per-deg.js");
require("core-js/modules/esnext.math.radians.js");
require("core-js/modules/esnext.math.scale.js");
require("core-js/modules/esnext.math.seeded-prng.js");
require("core-js/modules/esnext.math.signbit.js");
require("core-js/modules/esnext.math.umulh.js");
require("core-js/modules/esnext.number.from-string.js");
require("core-js/modules/esnext.observable.js");
require("core-js/modules/esnext.promise.all-settled.js");
require("core-js/modules/esnext.promise.any.js");
require("core-js/modules/esnext.promise.try.js");
require("core-js/modules/esnext.reflect.define-metadata.js");
require("core-js/modules/esnext.reflect.delete-metadata.js");
require("core-js/modules/esnext.reflect.get-metadata-keys.js");
require("core-js/modules/esnext.reflect.get-metadata.js");
require("core-js/modules/esnext.reflect.get-own-metadata-keys.js");
require("core-js/modules/esnext.reflect.get-own-metadata.js");
require("core-js/modules/esnext.reflect.has-metadata.js");
require("core-js/modules/esnext.reflect.has-own-metadata.js");
require("core-js/modules/esnext.reflect.metadata.js");
require("core-js/modules/esnext.set.add-all.js");
require("core-js/modules/esnext.set.delete-all.js");
require("core-js/modules/esnext.set.difference.js");
require("core-js/modules/esnext.set.every.js");
require("core-js/modules/esnext.set.filter.js");
require("core-js/modules/esnext.set.find.js");
require("core-js/modules/esnext.set.from.js");
require("core-js/modules/esnext.set.intersection.js");
require("core-js/modules/esnext.set.is-disjoint-from.js");
require("core-js/modules/esnext.set.is-subset-of.js");
require("core-js/modules/esnext.set.is-superset-of.js");
require("core-js/modules/esnext.set.join.js");
require("core-js/modules/esnext.set.map.js");
require("core-js/modules/esnext.set.of.js");
require("core-js/modules/esnext.set.reduce.js");
require("core-js/modules/esnext.set.some.js");
require("core-js/modules/esnext.set.symmetric-difference.js");
require("core-js/modules/esnext.set.union.js");
require("core-js/modules/esnext.string.at.js");
require("core-js/modules/esnext.string.code-points.js");
require("core-js/modules/esnext.string.match-all.js");
require("core-js/modules/esnext.string.replace-all.js");
require("core-js/modules/esnext.symbol.dispose.js");
require("core-js/modules/esnext.symbol.observable.js");
require("core-js/modules/esnext.symbol.pattern-match.js");
require("core-js/modules/esnext.weak-map.delete-all.js");
require("core-js/modules/esnext.weak-map.from.js");
require("core-js/modules/esnext.weak-map.of.js");
require("core-js/modules/esnext.weak-set.add-all.js");
require("core-js/modules/esnext.weak-set.delete-all.js");
require("core-js/modules/esnext.weak-set.from.js");
require("core-js/modules/esnext.weak-set.of.js");
require("core-js/modules/web.dom-collections.for-each.js");
require("core-js/modules/web.dom-collections.iterator.js");
require("core-js/modules/web.immediate.js");
require("core-js/modules/web.queue-microtask.js");
require("core-js/modules/web.url-search-params.js");
require("core-js/modules/web.url.js");
require("core-js/modules/web.url.to-json.js");
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) resolve(value);
    else Promise.resolve(value).then(_next, _throw);
}
function _async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _ts_generator(thisArg, body) {
    var f, y, t, _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    }, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype), d = Object.defineProperty;
    return d(g, "next", {
        value: verb(0)
    }), d(g, "throw", {
        value: verb(1)
    }), d(g, "return", {
        value: verb(2)
    }), typeof Symbol === "function" && d(g, Symbol.iterator, {
        value: function() {
            return this;
        }
    }), g;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(g && (g = 0, op[0] && (_ = 0)), _)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
}
function a() {
    return _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            return [
                2,
                1
            ];
        });
    })();
}
a().then(console.log);
