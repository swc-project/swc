(function () {
    var root = this,
        previousUnderscore = root._,
        breaker = {},
        ArrayProto = Array.prototype,
        ObjProto = Object.prototype,
        FuncProto = Function.prototype,
        push = ArrayProto.push,
        slice = ArrayProto.slice,
        concat = ArrayProto.concat,
        toString = ObjProto.toString,
        nativeForEach = ArrayProto.forEach,
        nativeMap = ArrayProto.map,
        nativeReduce = ArrayProto.reduce,
        nativeReduceRight = ArrayProto.reduceRight,
        nativeFilter = ArrayProto.filter,
        nativeEvery = ArrayProto.every,
        nativeSome = ArrayProto.some,
        nativeIndexOf = ArrayProto.indexOf,
        nativeLastIndexOf = ArrayProto.lastIndexOf,
        nativeIsArray = Array.isArray,
        nativeKeys = Object.keys,
        nativeBind = FuncProto.bind,
        _ = function (obj) {
            if (obj instanceof _) return obj;
            if (!(this instanceof _)) return new _(obj);
            this._wrapped = obj;
        };
    if ("undefined" !== typeof exports)
        "undefined" !== typeof module &&
      module.exports &&
      (exports = module.exports = _),
        (exports._ = _);
    else root._ = _;
    _.VERSION = "1.5.2";
    var each = (_.each = _.forEach = function (obj, iterator, context) {
        if (null == obj) return;
        if (nativeForEach && obj.forEach === nativeForEach)
            obj.forEach(iterator, context);
        else if (obj.length === +obj.length)
            for (var i = 0, length = obj.length; length > i; i++)
                if (iterator.call(context, obj[i], i, obj) === breaker) return;
                else
                    for (
                        var keys = _.keys(obj), i = 0, length = keys.length;
                        length > i;
                        i++
                    )
                        if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker)
                            return;
    });
    (_.map = _.collect = function (obj, iterator, context) {
        var results = [];
        if (null == obj) return results;
        if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
        return (
            each(obj, function (value, index, list) {
                results.push(iterator.call(context, value, index, list));
            }),
            results
        );
    }),
    (_.reduce = _.foldl = _.inject = function (obj, iterator, memo, context) {
        var initial = arguments.length > 2;
        if (
            (null == obj && (obj = []), nativeReduce && obj.reduce === nativeReduce)
        )
            return (
                context && (iterator = _.bind(iterator, context)),
                initial ? obj.reduce(iterator, memo) : obj.reduce(iterator)
            );
        if (
            (each(obj, function (value, index, list) {
                if (!initial) (memo = value), (initial = !0);
                else memo = iterator.call(context, memo, value, index, list);
            }),
            !initial)
        )
            throw new TypeError("Reduce of empty array with no initial value");
        return memo;
    }),
    (_.reduceRight = _.foldr = function (obj, iterator, memo, context) {
        var initial = arguments.length > 2;
        if (
            (null == obj && (obj = []),
            nativeReduceRight && obj.reduceRight === nativeReduceRight)
        )
            return (
                context && (iterator = _.bind(iterator, context)),
                initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator)
            );
        var length = obj.length;
        if (length !== +length) {
            var keys = _.keys(obj);
            length = keys.length;
        }
        if (
            (each(obj, function (value, index, list) {
                if (((index = keys ? keys[--length] : --length), !initial))
                    (memo = obj[index]), (initial = !0);
                else memo = iterator.call(context, memo, obj[index], index, list);
            }),
            !initial)
        )
            throw new TypeError("Reduce of empty array with no initial value");
        return memo;
    }),
    (_.find = _.detect = function (obj, iterator, context) {
        var result;
        return (
            any(obj, function (value, index, list) {
                if (iterator.call(context, value, index, list))
                    return (result = value), !0;
            }),
            result
        );
    }),
    (_.filter = _.select = function (obj, iterator, context) {
        var results = [];
        if (null == obj) return results;
        if (nativeFilter && obj.filter === nativeFilter)
            return obj.filter(iterator, context);
        return (
            each(obj, function (value, index, list) {
                iterator.call(context, value, index, list) && results.push(value);
            }),
            results
        );
    }),
    (_.reject = function (obj, iterator, context) {
        return _.filter(
            obj,
            function (value, index, list) {
                return !iterator.call(context, value, index, list);
            },
            context,
        );
    }),
    (_.every = _.all = function (obj, iterator, context) {
        iterator || (iterator = _.identity);
        var result = !0;
        if (null == obj) return result;
        if (nativeEvery && obj.every === nativeEvery)
            return obj.every(iterator, context);
        return (
            each(obj, function (value, index, list) {
                if (!(result &&= iterator.call(context, value, index, list)))
                    return breaker;
            }),
            !!result
        );
    });
    var any = (_.some = _.any = function (obj, iterator, context) {
        iterator || (iterator = _.identity);
        var result = !1;
        if (null == obj) return result;
        if (nativeSome && obj.some === nativeSome)
            return obj.some(iterator, context);
        return (
            each(obj, function (value, index, list) {
                if (result || (result = iterator.call(context, value, index, list)))
                    return breaker;
            }),
            !!result
        );
    });
    (_.contains = _.include = function (obj, target) {
        if (null == obj) return !1;
        if (nativeIndexOf && obj.indexOf === nativeIndexOf)
            return obj.indexOf(target) != -1;
        return any(obj, function (value) {
            return target === value;
        });
    }),
    (_.invoke = function (obj, method) {
        return _.map(obj, function (value) {
            return (_.isFunction(method) ? method : value[method]).apply(
                value,
                args,
            );
        });
    }),
    (_.pluck = function (obj, key) {
        return _.map(obj, function (value) {
            return value[key];
        });
    }),
    (_.where = function (obj, attrs, first) {
        if (_.isEmpty(attrs)) return first ? void 0 : [];
        return _[first ? "find" : "filter"](obj, function (value) {
            for (var key in attrs) if (attrs[key] !== value[key]) return !1;
            return !0;
        });
    }),
    (_.findWhere = function (obj, attrs) {
        return _.where(obj, attrs, !0);
    }),
    (_.max = function (obj, iterator, context) {
        if (
            !iterator &&
        _.isArray(obj) &&
        obj[0] === +obj[0] &&
        65535 > obj.length
        )
            return Math.max.apply(Math, obj);
        if (!iterator && _.isEmpty(obj)) return -(1 / 0);
        var result = {
            computed: -(1 / 0),
            value: -(1 / 0),
        };
        return (
            each(obj, function (value, index, list) {
                var computed = iterator
                    ? iterator.call(context, value, index, list)
                    : value;
                computed > result.computed &&
            (result = {
                value: value,
                computed: computed,
            });
            }),
            result.value
        );
    }),
    (_.min = function (obj, iterator, context) {
        if (
            !iterator &&
        _.isArray(obj) &&
        obj[0] === +obj[0] &&
        65535 > obj.length
        )
            return Math.min.apply(Math, obj);
        if (!iterator && _.isEmpty(obj)) return 1 / 0;
        var result = {
            computed: 1 / 0,
            value: 1 / 0,
        };
        return (
            each(obj, function (value, index, list) {
                var computed = iterator
                    ? iterator.call(context, value, index, list)
                    : value;
                computed < result.computed &&
            (result = {
                value: value,
                computed: computed,
            });
            }),
            result.value
        );
    }),
    (_.shuffle = function (obj) {
        var rand,
            index = 0,
            shuffled = [];
        return (
            each(obj, function (value) {
                (rand = _.random(index++)),
                (shuffled[index - 1] = shuffled[rand]),
                (shuffled[rand] = value);
            }),
            shuffled
        );
    }),
    (_.sample = function (obj, n, guard) {
        if (2 > arguments.length || guard) return obj[_.random(obj.length - 1)];
        return _.shuffle(obj).slice(0, Math.max(0, n));
    });
    var lookupIterator = function (value) {
        return _.isFunction(value)
            ? value
            : function (obj) {
                return obj[value];
            };
    };
    _.sortBy = function (obj, value, context) {
        return _.pluck(
            _.map(obj, function (value1, index, list) {
                return {
                    value: value1,
                    index: index,
                    criteria: lookupIterator(value).call(context, value1, index, list),
                };
            }).sort(function (left, right) {
                var a = left.criteria,
                    b = right.criteria;
                if (a !== b) {
                    if (a > b || void 0 === a) return 1;
                    if (b > a || void 0 === b) return -1;
                }
                return left.index - right.index;
            }),
            "value",
        );
    };
    var group = function (behavior) {
        return function (obj, value, context) {
            var result = {};
            return (
                each(obj, function (value1, index) {
                    var key = (null == value ? _.identity : lookupIterator(value)).call(
                        context,
                        value1,
                        index,
                        obj,
                    );
                    behavior(result, key, value1);
                }),
                result
            );
        };
    };
    (_.groupBy = group(function (result, key, value) {
        (_.has(result, key) ? result[key] : (result[key] = [])).push(value);
    })),
    (_.indexBy = group(function (result, key, value) {
        result[key] = value;
    })),
    (_.countBy = group(function (result, key) {
        _.has(result, key) ? result[key]++ : (result[key] = 1);
    })),
    (_.sortedIndex = function (array, obj, iterator, context) {
        iterator = null == iterator ? _.identity : lookupIterator(iterator);
        for (
            var value = iterator.call(context, obj), low = 0, high = array.length;
            high > low;

        ) {
            var mid = (low + high) >>> 1;
            iterator.call(context, array[mid]) < value
                ? (low = mid + 1)
                : (high = mid);
        }
        return low;
    }),
    (_.toArray = function (obj) {
        if (!obj) return [];
        if (_.isArray(obj)) return slice.call(obj);
        if (obj.length === +obj.length) return _.map(obj, _.identity);
        return _.values(obj);
    }),
    (_.size = function (obj) {
        if (null == obj) return 0;
        return obj.length === +obj.length ? obj.length : _.keys(obj).length;
    }),
    (_.first = _.head = _.take = function (array, n, guard) {
        if (null == array) return void 0;
        return null == n || guard ? array[0] : slice.call(array, 0, n);
    }),
    (_.initial = function (array, n, guard) {
        return slice.call(array, 0, array.length - (null == n || guard ? 1 : n));
    }),
    (_.last = function (array, n, guard) {
        if (null == array) return void 0;
        if (null == n || guard) return array[array.length - 1];
        return slice.call(array, Math.max(array.length - n, 0));
    }),
    (_.rest = _.tail = _.drop = function (array, n, guard) {
        return slice.call(array, null == n || guard ? 1 : n);
    }),
    (_.compact = function (array) {
        return _.filter(array, _.identity);
    });
    var flatten = function (input, shallow, output) {
        if (shallow && _.every(input, _.isArray))
            return concat.apply(output, input);
        return (
            each(input, function (value) {
                if (_.isArray(value) || _.isArguments(value))
                    shallow ? push.apply(output, value) : flatten(value, shallow, output);
                else output.push(value);
            }),
            output
        );
    };
    (_.flatten = function (array, shallow) {
        return flatten(array, shallow, []);
    }),
    (_.without = function (array) {
        return _.difference(array, slice.call(arguments, 1));
    }),
    (_.uniq = _.unique = function (array, isSorted, iterator, context) {
        _.isFunction(isSorted) &&
        ((context = iterator), (iterator = isSorted), (isSorted = !1));
        var initial = iterator ? _.map(array, iterator, context) : array,
            results = [],
            seen = [];
        return (
            each(initial, function (value, index) {
                (isSorted
                    ? !index || seen[seen.length - 1] !== value
                    : !_.contains(seen, value)) &&
            (seen.push(value), results.push(array[index]));
            }),
            results
        );
    }),
    (_.union = function () {
        return _.uniq(_.flatten(arguments, !0));
    }),
    (_.intersection = function (array) {
        var rest = slice.call(arguments, 1);
        return _.filter(_.uniq(array), function (item) {
            return _.every(rest, function (other) {
                return _.indexOf(other, item) >= 0;
            });
        });
    }),
    (_.difference = function (array) {
        var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
        return _.filter(array, function (value) {
            return !_.contains(rest, value);
        });
    }),
    (_.zip = function () {
        for (
            var length = _.max(_.pluck(arguments, "length").concat(0)),
                results = new Array(length),
                i = 0;
            length > i;
            i++
        )
            results[i] = _.pluck(arguments, "" + i);
        return results;
    }),
    (_.object = function (list, values) {
        if (null == list) return {};
        for (var result = {}, i = 0, length = list.length; length > i; i++)
            if (values) result[list[i]] = values[i];
            else result[list[i][0]] = list[i][1];
        return result;
    }),
    (_.indexOf = function (array, item, isSorted) {
        if (null == array) return -1;
        var i = 0,
            length = array.length;
        if (isSorted) {
            if ("number" == typeof isSorted)
                i = 0 > isSorted ? Math.max(0, length + isSorted) : isSorted;
            else
                return (i = _.sortedIndex(array, item)), array[i] === item ? i : -1;
        }
        if (nativeIndexOf && array.indexOf === nativeIndexOf)
            return array.indexOf(item, isSorted);
        for (; length > i; i++) if (array[i] === item) return i;
        return -1;
    }),
    (_.lastIndexOf = function (array, item, from) {
        if (null == array) return -1;
        var hasIndex = null != from;
        if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf)
            return hasIndex
                ? array.lastIndexOf(item, from)
                : array.lastIndexOf(item);
        for (var i = hasIndex ? from : array.length; i--; )
            if (array[i] === item) return i;
        return -1;
    }),
    (_.range = function (start, stop, step) {
        1 >= arguments.length && ((stop = start || 0), (start = 0)),
        (step = arguments[2] || 1);
        for (
            var length = Math.max(Math.ceil((stop - start) / step), 0),
                idx = 0,
                range = new Array(length);
            length > idx;

        )
            (range[idx++] = start), (start += step);
        return range;
    });
    var ctor = function () {};
    (_.bind = function (func, context) {
        var args, bound;
        if (nativeBind && func.bind === nativeBind)
            return nativeBind.apply(func, slice.call(arguments, 1));
        if (!_.isFunction(func)) throw new TypeError();
        return (
            (args = slice.call(arguments, 2)),
            (bound = function () {
                if (!(this instanceof bound))
                    return func.apply(context, args.concat(slice.call(arguments)));
                ctor.prototype = func.prototype;
                var self = new ctor();
                ctor.prototype = null;
                var result = func.apply(self, args.concat(slice.call(arguments)));
                if (Object(result) === result) return result;
                return self;
            })
        );
    }),
    (_.partial = function (func) {
        return function () {
            return func.apply(
                this,
                slice.call(arguments, 1).concat(slice.call(arguments)),
            );
        };
    }),
    (_.bindAll = function (obj) {
        var funcs = slice.call(arguments, 1);
        if (0 === funcs.length)
            throw new Error("bindAll must be passed function names");
        return (
            each(funcs, function (f) {
                obj[f] = _.bind(obj[f], obj);
            }),
            obj
        );
    }),
    (_.memoize = function (func, hasher) {
        var memo = {};
        return (
            hasher || (hasher = _.identity),
            function () {
                var key = hasher.apply(this, arguments);
                return _.has(memo, key)
                    ? memo[key]
                    : (memo[key] = func.apply(this, arguments));
            }
        );
    }),
    (_.delay = function (func, wait) {
        var args = slice.call(arguments, 2);
        return setTimeout(function () {
            return func.apply(null, args);
        }, wait);
    }),
    (_.defer = function (func) {
        return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
    }),
    (_.throttle = function (func, wait, options) {
        var context,
            args,
            result,
            timeout = null,
            previous = 0;
        return (
            options || (options = {}),
            function () {
                var now = new Date();
                previous || options.leading !== !1 || (previous = now);
                var remaining = wait - (now - previous);
                if (((context = this), (args = arguments), 0 >= remaining))
                    clearTimeout(timeout),
                    (timeout = null),
                    (previous = now),
                    (result = func.apply(context, args));
                else
                    timeout ||
              options.trailing === !1 ||
              (timeout = setTimeout(function () {
                  (previous = options.leading === !1 ? 0 : new Date()),
                  (timeout = null),
                  (result = func.apply(context, args));
              }, remaining));
                return result;
            }
        );
    }),
    (_.debounce = function (func, wait, immediate) {
        var timeout, args, context, timestamp, result;
        return function () {
            (context = this), (args = arguments), (timestamp = new Date());
            var later = function () {
                    var last = new Date() - timestamp;
                    if (wait > last) timeout = setTimeout(later, wait - last);
                    else
                        (timeout = null),
                        immediate || (result = func.apply(context, args));
                },
                callNow = immediate && !timeout;
            return (
                timeout || (timeout = setTimeout(later, wait)),
                callNow && (result = func.apply(context, args)),
                result
            );
        };
    }),
    (_.once = function (func) {
        var ran = !1,
            memo;
        return function () {
            if (ran) return memo;
            return (
                (ran = !0), (memo = func.apply(this, arguments)), (func = null), memo
            );
        };
    }),
    (_.wrap = function (func, wrapper) {
        return function () {
            var args = [func];
            return push.apply(args, arguments), wrapper.apply(this, args);
        };
    }),
    (_.compose = function () {
        var funcs = arguments;
        return function () {
            for (var args = arguments, i = funcs.length - 1; i >= 0; i--)
                args = [funcs[i].apply(this, args)];
            return args[0];
        };
    }),
    (_.after = function (times, func) {
        return function () {
            if (--times < 1) return func.apply(this, arguments);
        };
    }),
    (_.keys =
      nativeKeys ||
      function (obj) {
          if (obj !== Object(obj)) throw new TypeError("Invalid object");
          var keys = [];
          for (var key in obj) _.has(obj, key) && keys.push(key);
          return keys;
      }),
    (_.values = function (obj) {
        for (
            var keys = _.keys(obj),
                length = keys.length,
                values = new Array(length),
                i = 0;
            length > i;
            i++
        )
            values[i] = obj[keys[i]];
        return values;
    }),
    (_.pairs = function (obj) {
        for (
            var keys = _.keys(obj),
                length = keys.length,
                pairs = new Array(length),
                i = 0;
            length > i;
            i++
        )
            pairs[i] = [keys[i], obj[keys[i]]];
        return pairs;
    }),
    (_.invert = function (obj) {
        for (
            var result = {}, keys = _.keys(obj), i = 0, length = keys.length;
            length > i;
            i++
        )
            result[obj[keys[i]]] = keys[i];
        return result;
    }),
    (_.functions = _.methods = function (obj) {
        var names = [];
        for (var key in obj) _.isFunction(obj[key]) && names.push(key);
        return names.sort();
    }),
    (_.extend = function (obj) {
        return (
            each(slice.call(arguments, 1), function (source) {
                if (source) for (var prop in source) obj[prop] = source[prop];
            }),
            obj
        );
    }),
    (_.pick = function (obj) {
        var copy = {},
            keys = concat.apply(ArrayProto, slice.call(arguments, 1));
        return (
            each(keys, function (key) {
                key in obj && (copy[key] = obj[key]);
            }),
            copy
        );
    }),
    (_.omit = function (obj) {
        var copy = {},
            keys = concat.apply(ArrayProto, slice.call(arguments, 1));
        for (var key in obj) _.contains(keys, key) || (copy[key] = obj[key]);
        return copy;
    }),
    (_.defaults = function (obj) {
        return (
            each(slice.call(arguments, 1), function (source) {
                if (source)
                    for (var prop in source)
                        obj[prop] === void 0 && (obj[prop] = source[prop]);
            }),
            obj
        );
    }),
    (_.clone = function (obj) {
        if (!_.isObject(obj)) return obj;
        return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
    }),
    (_.tap = function (obj, interceptor) {
        return interceptor(obj), obj;
    });
    var eq = function (a, b, aStack, bStack) {
        if (a === b) return 0 !== a || 1 / a == 1 / b;
        if (null == a || null == b) return a === b;
        a instanceof _ && (a = a._wrapped), b instanceof _ && (b = b._wrapped);
        var className = toString.call(a);
        if (className != toString.call(b)) return !1;
        switch (className) {
        case "[object String]":
            return a == String(b);
        case "[object Number]":
            return a != +a ? b != +b : 0 == a ? 1 / a == 1 / b : a == +b;
        case "[object Date]":
        case "[object Boolean]":
            return +a == +b;
        case "[object RegExp]":
            return (
                a.source == b.source &&
          a.global == b.global &&
          a.multiline == b.multiline &&
          a.ignoreCase == b.ignoreCase
            );
        }
        if ("object" != typeof a || "object" != typeof b) return !1;
        for (var length = aStack.length; length--; )
            if (aStack[length] == a) return bStack[length] == b;
        var aCtor = a.constructor,
            bCtor = b.constructor;
        if (
            aCtor !== bCtor &&
      _.isFunction(aCtor) &&
      aCtor instanceof aCtor &&
      _.isFunction(bCtor) &&
      !(bCtor instanceof bCtor)
        )
            return !1;
        aStack.push(a), bStack.push(b);
        var size = 0,
            result = !0;
        if ("[object Array]" == className) {
            if (((size = a.length), (result = size == b.length)))
                for (; size--; )
                    if (!(result = eq(a[size], b[size], aStack, bStack))) break;
        } else {
            for (var key in a)
                if (_.has(a, key)) {
                    if (
                        (size++,
                        !(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack)))
                    )
                        break;
                }
            if (result) {
                for (key in b) if (_.has(b, key) && !size--) break;
                result = !size;
            }
        }
        return aStack.pop(), bStack.pop(), result;
    };
    (_.isEqual = function (a, b) {
        return eq(a, b, [], []);
    }),
    (_.isEmpty = function (obj) {
        if (null == obj) return !0;
        if (_.isArray(obj) || _.isString(obj)) return 0 === obj.length;
        for (var key in obj) if (_.has(obj, key)) return !1;
        return !0;
    }),
    (_.isElement = function (obj) {
        return !(!obj || 1 !== obj.nodeType);
    }),
    (_.isArray =
      nativeIsArray ||
      function (obj) {
          return toString.call(obj) == "[object Array]";
      }),
    (_.isObject = function (obj) {
        return obj === Object(obj);
    }),
    each(
        ["Arguments", "Function", "String", "Number", "Date", "RegExp"],
        function (name) {
            _["is" + name] = function (obj) {
                return toString.call(obj) == "[object " + name + "]";
            };
        },
    ),
    _.isArguments(arguments) ||
      (_.isArguments = function (obj) {
          return !(!obj || !_.has(obj, "callee"));
      }),
    "function" !== typeof /./ &&
      (_.isFunction = function (obj) {
          return "function" == typeof obj;
      }),
    (_.isFinite = function (obj) {
        return isFinite(obj) && !isNaN(parseFloat(obj));
    }),
    (_.isNaN = function (obj) {
        return _.isNumber(obj) && obj != +obj;
    }),
    (_.isBoolean = function (obj) {
        return (
            !0 === obj || !1 === obj || toString.call(obj) == "[object Boolean]"
        );
    }),
    (_.isNull = function (obj) {
        return null === obj;
    }),
    (_.isUndefined = function (obj) {
        return void 0 === obj;
    }),
    (_.has = function (obj, key) {
        return ObjProto.hasOwnProperty.call(obj, key);
    }),
    (_.noConflict = function () {
        return (root._ = previousUnderscore), this;
    }),
    (_.identity = function (value) {
        return value;
    }),
    (_.times = function (n, iterator, context) {
        for (var accum = Array(Math.max(0, n)), i = 0; n > i; i++)
            accum[i] = iterator.call(context, i);
        return accum;
    }),
    (_.random = function (min, max) {
        return (
            null == max && ((max = min), (min = 0)),
            0 + Math.floor(Math.random() * (max - 0 + 1))
        );
    });
    var entityMap = {
        escape: {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#x27;",
        },
    };
    (entityMap.unescape = _.invert(entityMap.escape)),
    _.each(["escape", "unescape"], function (method) {
        _[method] = function (string) {
            if (null == string) return "";
            return ("" + string).replace(
                {
                    escape: new RegExp(
                        "[" + _.keys(entityMap.escape).join("") + "]",
                        "g",
                    ),
                    unescape: new RegExp(
                        "(" + _.keys(entityMap.unescape).join("|") + ")",
                        "g",
                    ),
                }[method],
                function (match) {
                    return entityMap[method][match];
                },
            );
        };
    }),
    (_.result = function (object, property) {
        if (null == object) return void 0;
        var value = object[property];
        return _.isFunction(value) ? value.call(object) : value;
    }),
    (_.mixin = function (obj) {
        each(_.functions(obj), function (name) {
            _.prototype[name] = function () {
                var args = [this._wrapped];
                return (
                    push.apply(args, arguments),
                    result.call(this, (_[name] = obj[name]).apply(_, args))
                );
            };
        });
    });
    var idCounter = 0;
    (_.uniqueId = function (prefix) {
        var id = ++idCounter + "";
        return prefix ? prefix + id : id;
    }),
    (_.templateSettings = {
        evaluate: /<%([\s\S]+?)%>/g,
        interpolate: /<%=([\s\S]+?)%>/g,
        escape: /<%-([\s\S]+?)%>/g,
    });
    var noMatch = /(.)^/,
        escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;
    (_.template = function (text, data, settings) {
        var render;
        settings = _.defaults({}, settings, _.templateSettings);
        var matcher = new RegExp(
                [
                    (settings.escape || noMatch).source,
                    (settings.interpolate || noMatch).source,
                    (settings.evaluate || noMatch).source,
                ].join("|") + "|$",
                "g",
            ),
            index = 0,
            source = "__p+='";
        text.replace(
            matcher,
            function (match, escape, interpolate, evaluate, offset) {
                return (
                    (source += text
                        .slice(index, offset)
                        .replace(escaper, function (match) {
                            return (
                                "\\" +
                {
                    "'": "'",
                    "\\": "\\",
                    "\r": "r",
                    "\n": "n",
                    "\t": "t",
                    "\u2028": "u2028",
                    "\u2029": "u2029",
                }[match]
                            );
                        })),
                    escape &&
            (source +=
              "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'"),
                    interpolate &&
            (source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'"),
                    evaluate && (source += "';\n" + evaluate + "\n__p+='"),
                    (index = offset + match.length),
                    match
                );
            },
        ),
        (source += "';\n"),
        settings.variable || (source = "with(obj||{}){\n" + source + "}\n"),
        (source =
        "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n" +
        source +
        "return __p;\n");
        try {
            render = new Function(settings.variable || "obj", "_", source);
        } catch (e) {
            throw ((e.source = source), e);
        }
        if (data) return render(data, _);
        var template = function (data) {
            return render.call(this, data, _);
        };
        return (
            (template.source =
        "function(" + (settings.variable || "obj") + "){\n" + source + "}"),
            template
        );
    }),
    (_.chain = function (obj) {
        return _(obj).chain();
    });
    var result = function (obj) {
        return this._chain ? _(obj).chain() : obj;
    };
    _.mixin(_),
    each(
        ["pop", "push", "reverse", "shift", "sort", "splice", "unshift"],
        function (name) {
            _.prototype[name] = function () {
                var obj = this._wrapped;
                return (
                    ArrayProto[name].apply(obj, arguments),
                    ("shift" == name || "splice" == name) &&
              0 === obj.length &&
              delete obj[0],
                    result.call(this, obj)
                );
            };
        },
    ),
    each(["concat", "join", "slice"], function (name) {
        _.prototype[name] = function () {
            return result.call(
                this,
                ArrayProto[name].apply(this._wrapped, arguments),
            );
        };
    }),
    _.extend(_.prototype, {
        chain: function () {
            return (this._chain = !0), this;
        },
        value: function () {
            return this._wrapped;
        },
    });
}.call(this));
