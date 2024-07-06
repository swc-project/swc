!/*!
 * Vue.js v2.6.12
 * (c) 2014-2020 Evan You
 * Released under the MIT License.
 */ function(global1, factory) {
    'object' == typeof exports && 'undefined' != typeof module ? module.exports = factory() : 'function' == typeof define && define.amd ? define(factory) : (global1 = global1 || self).Vue = factory();
}(this, function() {
    'use strict';
    /*  */ var Vue, cid, configDef, dataDef, propsDef, hookRE, baseCompile, _isServer, _Set, timerFunc, mark, measure, initProxy, target, len, str, chr, index$1, expressionPos, expressionEndPos, warn$1, target$1, svgContainer, emptyStyle, decoder, warn$2, delimiters, transforms, preTransforms, postTransforms, platformIsPreTag, platformMustUseProp, platformGetTagNamespace, maybeComponent, isStaticKey, isPlatformReservedTag, div, emptyObject = Object.freeze({});
    // These helpers produce better VM code in JS engines due to their
    // explicitness and function inlining.
    function isUndef(v) {
        return null == v;
    }
    function isDef(v) {
        return null != v;
    }
    function isTrue(v) {
        return !0 === v;
    }
    /**
   * Check if value is primitive.
   */ function isPrimitive(value) {
        return 'string' == typeof value || 'number' == typeof value || // $flow-disable-line
        'symbol' == typeof value || 'boolean' == typeof value;
    }
    /**
   * Quick object check - this is primarily used to tell
   * Objects from primitive values when we know the value
   * is a JSON-compliant type.
   */ function isObject(obj) {
        return null !== obj && 'object' == typeof obj;
    }
    /**
   * Get the raw type string of a value, e.g., [object Object].
   */ var _toString = Object.prototype.toString;
    function toRawType(value) {
        return _toString.call(value).slice(8, -1);
    }
    /**
   * Strict object type check. Only returns true
   * for plain JavaScript objects.
   */ function isPlainObject(obj) {
        return '[object Object]' === _toString.call(obj);
    }
    function isRegExp(v) {
        return '[object RegExp]' === _toString.call(v);
    }
    /**
   * Check if val is a valid array index.
   */ function isValidArrayIndex(val) {
        var n = parseFloat(String(val));
        return n >= 0 && Math.floor(n) === n && isFinite(val);
    }
    function isPromise(val) {
        return isDef(val) && 'function' == typeof val.then && 'function' == typeof val.catch;
    }
    /**
   * Convert a value to a string that is actually rendered.
   */ function toString(val) {
        return null == val ? '' : Array.isArray(val) || isPlainObject(val) && val.toString === _toString ? JSON.stringify(val, null, 2) : String(val);
    }
    /**
   * Convert an input value to a number for persistence.
   * If the conversion fails, return original string.
   */ function toNumber(val) {
        var n = parseFloat(val);
        return isNaN(n) ? val : n;
    }
    /**
   * Make a map and return a function for checking if a key
   * is in that map.
   */ function makeMap(str, expectsLowerCase) {
        for(var map = Object.create(null), list = str.split(','), i = 0; i < list.length; i++)map[list[i]] = !0;
        return expectsLowerCase ? function(val) {
            return map[val.toLowerCase()];
        } : function(val) {
            return map[val];
        };
    }
    /**
   * Check if a tag is a built-in tag.
   */ var isBuiltInTag = makeMap('slot,component', !0), isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');
    /**
   * Remove an item from an array.
   */ function remove(arr, item) {
        if (arr.length) {
            var index = arr.indexOf(item);
            if (index > -1) return arr.splice(index, 1);
        }
    }
    /**
   * Check whether an object has the property.
   */ var hasOwnProperty = Object.prototype.hasOwnProperty;
    function hasOwn(obj, key) {
        return hasOwnProperty.call(obj, key);
    }
    /**
   * Create a cached version of a pure function.
   */ function cached(fn) {
        var cache = Object.create(null);
        return function(str) {
            return cache[str] || (cache[str] = fn(str));
        };
    }
    /**
   * Camelize a hyphen-delimited string.
   */ var camelizeRE = /-(\w)/g, camelize = cached(function(str) {
        return str.replace(camelizeRE, function(_, c) {
            return c ? c.toUpperCase() : '';
        });
    }), capitalize = cached(function(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }), hyphenateRE = /\B([A-Z])/g, hyphenate = cached(function(str) {
        return str.replace(hyphenateRE, '-$1').toLowerCase();
    }), bind = Function.prototype.bind ? function(fn, ctx) {
        return fn.bind(ctx);
    } : /**
   * Simple bind polyfill for environments that do not support it,
   * e.g., PhantomJS 1.x. Technically, we don't need this anymore
   * since native bind is now performant enough in most browsers.
   * But removing it would mean breaking code that was able to run in
   * PhantomJS 1.x, so this must be kept for backward compatibility.
   */ /* istanbul ignore next */ function(fn, ctx) {
        function boundFn(a) {
            var l = arguments.length;
            return l ? l > 1 ? fn.apply(ctx, arguments) : fn.call(ctx, a) : fn.call(ctx);
        }
        return boundFn._length = fn.length, boundFn;
    };
    /**
   * Convert an Array-like object to a real Array.
   */ function toArray(list, start) {
        start = start || 0;
        for(var i = list.length - start, ret = Array(i); i--;)ret[i] = list[i + start];
        return ret;
    }
    /**
   * Mix properties into target object.
   */ function extend(to, _from) {
        for(var key in _from)to[key] = _from[key];
        return to;
    }
    /**
   * Merge an Array of Objects into a single Object.
   */ function toObject(arr) {
        for(var res = {}, i = 0; i < arr.length; i++)arr[i] && extend(res, arr[i]);
        return res;
    }
    /* eslint-disable no-unused-vars */ /**
   * Perform no operation.
   * Stubbing args to make Flow happy without leaving useless transpiled code
   * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
   */ function noop(a, b, c) {}
    /**
   * Always return false.
   */ var no = function(a, b, c) {
        return !1;
    }, identity = function(_) {
        return _;
    };
    /**
   * Check if two values are loosely equal - that is,
   * if they are plain objects, do they have the same shape?
   */ function looseEqual(a, b) {
        if (a === b) return !0;
        var isObjectA = isObject(a), isObjectB = isObject(b);
        if (isObjectA && isObjectB) try {
            var isArrayA = Array.isArray(a), isArrayB = Array.isArray(b);
            if (isArrayA && isArrayB) return a.length === b.length && a.every(function(e, i) {
                return looseEqual(e, b[i]);
            });
            if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();
            if (isArrayA || isArrayB) /* istanbul ignore next */ return !1;
            var keysA = Object.keys(a), keysB = Object.keys(b);
            return keysA.length === keysB.length && keysA.every(function(key) {
                return looseEqual(a[key], b[key]);
            });
        } catch (e) {
            /* istanbul ignore next */ return !1;
        }
        else if (!isObjectA && !isObjectB) return String(a) === String(b);
        else return !1;
    }
    /**
   * Return the first index at which a loosely equal value can be
   * found in the array (if value is a plain object, the array must
   * contain an object of the same shape), or -1 if it is not present.
   */ function looseIndexOf(arr, val) {
        for(var i = 0; i < arr.length; i++)if (looseEqual(arr[i], val)) return i;
        return -1;
    }
    /**
   * Ensure a function is called only once.
   */ function once(fn) {
        var called = !1;
        return function() {
            called || (called = !0, fn.apply(this, arguments));
        };
    }
    var SSR_ATTR = 'data-server-rendered', ASSET_TYPES = [
        'component',
        'directive',
        'filter'
    ], LIFECYCLE_HOOKS = [
        'beforeCreate',
        'created',
        'beforeMount',
        'mounted',
        'beforeUpdate',
        'updated',
        'beforeDestroy',
        'destroyed',
        'activated',
        'deactivated',
        'errorCaptured',
        'serverPrefetch'
    ], config = {
        /**
     * Option merge strategies (used in core/util/options)
     */ // $flow-disable-line
        optionMergeStrategies: Object.create(null),
        /**
     * Whether to suppress warnings.
     */ silent: !1,
        /**
     * Show production mode tip message on boot?
     */ productionTip: !0,
        /**
     * Whether to enable devtools
     */ devtools: !0,
        /**
     * Whether to record perf
     */ performance: !1,
        /**
     * Error handler for watcher errors
     */ errorHandler: null,
        /**
     * Warn handler for watcher warns
     */ warnHandler: null,
        /**
     * Ignore certain custom elements
     */ ignoredElements: [],
        /**
     * Custom user key aliases for v-on
     */ // $flow-disable-line
        keyCodes: Object.create(null),
        /**
     * Check if a tag is reserved so that it cannot be registered as a
     * component. This is platform-dependent and may be overwritten.
     */ isReservedTag: no,
        /**
     * Check if an attribute is reserved so that it cannot be used as a component
     * prop. This is platform-dependent and may be overwritten.
     */ isReservedAttr: no,
        /**
     * Check if a tag is an unknown element.
     * Platform-dependent.
     */ isUnknownElement: no,
        /**
     * Get the namespace of an element
     */ getTagNamespace: noop,
        /**
     * Parse the real tag name for the specific platform.
     */ parsePlatformTagName: identity,
        /**
     * Check if an attribute must be bound using property, e.g. value
     * Platform-dependent.
     */ mustUseProp: no,
        /**
     * Perform updates asynchronously. Intended to be used by Vue Test Utils
     * This will significantly reduce performance if set to false.
     */ async: !0,
        /**
     * Exposed for legacy reasons
     */ _lifecycleHooks: LIFECYCLE_HOOKS
    }, unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;
    /**
   * Check if a string starts with $ or _
   */ function isReserved(str) {
        var c = (str + '').charCodeAt(0);
        return 0x24 === c || 0x5F === c;
    }
    /**
   * Define a property.
   */ function def(obj, key, val, enumerable) {
        Object.defineProperty(obj, key, {
            value: val,
            enumerable: !!enumerable,
            writable: !0,
            configurable: !0
        });
    }
    /**
   * Parse simple path.
   */ var bailRE = RegExp("[^" + unicodeRegExp.source + ".$_\\d]"), hasProto = '__proto__' in {}, inBrowser = 'undefined' != typeof window, inWeex = 'undefined' != typeof WXEnvironment && !!WXEnvironment.platform, weexPlatform = inWeex && WXEnvironment.platform.toLowerCase(), UA = inBrowser && window.navigator.userAgent.toLowerCase(), isIE = UA && /msie|trident/.test(UA), isIE9 = UA && UA.indexOf('msie 9.0') > 0, isEdge = UA && UA.indexOf('edge/') > 0;
    UA && UA.indexOf('android');
    var isIOS = UA && /iphone|ipad|ipod|ios/.test(UA) || 'ios' === weexPlatform;
    UA && /chrome\/\d+/.test(UA), UA && /phantomjs/.test(UA);
    var isFF = UA && UA.match(/firefox\/(\d+)/), nativeWatch = {}.watch, supportsPassive = !1;
    if (inBrowser) try {
        var opts = {};
        Object.defineProperty(opts, 'passive', {
            get: function() {
                /* istanbul ignore next */ supportsPassive = !0;
            }
        }), window.addEventListener('test-passive', null, opts);
    } catch (e) {}
    var isServerRendering = function() {
        return void 0 === _isServer && (_isServer = !inBrowser && !inWeex && 'undefined' != typeof global && global.process && 'server' === global.process.env.VUE_ENV), _isServer;
    }, devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;
    /* istanbul ignore next */ function isNative(Ctor) {
        return 'function' == typeof Ctor && /native code/.test(Ctor.toString());
    }
    var hasSymbol = 'undefined' != typeof Symbol && isNative(Symbol) && 'undefined' != typeof Reflect && isNative(Reflect.ownKeys);
    // use native Set when available.
    _Set = 'undefined' != typeof Set && isNative(Set) ? Set : /*@__PURE__*/ function() {
        function Set1() {
            this.set = Object.create(null);
        }
        return Set1.prototype.has = function(key) {
            return !0 === this.set[key];
        }, Set1.prototype.add = function(key) {
            this.set[key] = !0;
        }, Set1.prototype.clear = function() {
            this.set = Object.create(null);
        }, Set1;
    }();
    /*  */ var warn = noop, tip = noop, generateComponentTrace = noop, formatComponentName = noop, hasConsole = 'undefined' != typeof console, classifyRE = /(?:^|[-_])(\w)/g;
    warn = function(msg, vm) {
        var trace = vm ? generateComponentTrace(vm) : '';
        config.warnHandler ? config.warnHandler.call(null, msg, vm, trace) : hasConsole && !config.silent && console.error("[Vue warn]: " + msg + trace);
    }, tip = function(msg, vm) {
        hasConsole && !config.silent && console.warn("[Vue tip]: " + msg + (vm ? generateComponentTrace(vm) : ''));
    }, formatComponentName = function(vm, includeFile) {
        if (vm.$root === vm) return '<Root>';
        var options = 'function' == typeof vm && null != vm.cid ? vm.options : vm._isVue ? vm.$options || vm.constructor.options : vm, name = options.name || options._componentTag, file = options.__file;
        if (!name && file) {
            var match = file.match(/([^/\\]+)\.vue$/);
            name = match && match[1];
        }
        return (name ? "<" + name.replace(classifyRE, function(c) {
            return c.toUpperCase();
        }).replace(/[-_]/g, '') + ">" : "<Anonymous>") + (file && !1 !== includeFile ? " at " + file : '');
    };
    var repeat = function(str, n) {
        for(var res = ''; n;)n % 2 == 1 && (res += str), n > 1 && (str += str), n >>= 1;
        return res;
    };
    generateComponentTrace = function(vm) {
        if (!vm._isVue || !vm.$parent) return "\n\n(found in " + formatComponentName(vm) + ")";
        for(var tree = [], currentRecursiveSequence = 0; vm;){
            if (tree.length > 0) {
                var last = tree[tree.length - 1];
                if (last.constructor === vm.constructor) {
                    currentRecursiveSequence++, vm = vm.$parent;
                    continue;
                }
                currentRecursiveSequence > 0 && (tree[tree.length - 1] = [
                    last,
                    currentRecursiveSequence
                ], currentRecursiveSequence = 0);
            }
            tree.push(vm), vm = vm.$parent;
        }
        return '\n\nfound in\n\n' + tree.map(function(vm, i) {
            return "" + (0 === i ? '---> ' : repeat(' ', 5 + 2 * i)) + (Array.isArray(vm) ? formatComponentName(vm[0]) + "... (" + vm[1] + " recursive calls)" : formatComponentName(vm));
        }).join('\n');
    };
    /*  */ var uid = 0, Dep = function() {
        this.id = uid++, this.subs = [];
    };
    Dep.prototype.addSub = function(sub) {
        this.subs.push(sub);
    }, Dep.prototype.removeSub = function(sub) {
        remove(this.subs, sub);
    }, Dep.prototype.depend = function() {
        Dep.target && Dep.target.addDep(this);
    }, Dep.prototype.notify = function() {
        // stabilize the subscriber list first
        var subs = this.subs.slice();
        config.async || // subs aren't sorted in scheduler if not running async
        // we need to sort them now to make sure they fire in correct
        // order
        subs.sort(function(a, b) {
            return a.id - b.id;
        });
        for(var i = 0, l = subs.length; i < l; i++)subs[i].update();
    }, // The current target watcher being evaluated.
    // This is globally unique because only one watcher
    // can be evaluated at a time.
    Dep.target = null;
    var targetStack = [];
    function pushTarget(target) {
        targetStack.push(target), Dep.target = target;
    }
    function popTarget() {
        targetStack.pop(), Dep.target = targetStack[targetStack.length - 1];
    }
    /*  */ var VNode = function(tag, data, children, text, elm, context, componentOptions, asyncFactory) {
        this.tag = tag, this.data = data, this.children = children, this.text = text, this.elm = elm, this.ns = void 0, this.context = context, this.fnContext = void 0, this.fnOptions = void 0, this.fnScopeId = void 0, this.key = data && data.key, this.componentOptions = componentOptions, this.componentInstance = void 0, this.parent = void 0, this.raw = !1, this.isStatic = !1, this.isRootInsert = !0, this.isComment = !1, this.isCloned = !1, this.isOnce = !1, this.asyncFactory = asyncFactory, this.asyncMeta = void 0, this.isAsyncPlaceholder = !1;
    }, prototypeAccessors = {
        child: {
            configurable: !0
        }
    };
    // DEPRECATED: alias for componentInstance for backwards compat.
    /* istanbul ignore next */ prototypeAccessors.child.get = function() {
        return this.componentInstance;
    }, Object.defineProperties(VNode.prototype, prototypeAccessors);
    var createEmptyVNode = function(text) {
        void 0 === text && (text = '');
        var node = new VNode();
        return node.text = text, node.isComment = !0, node;
    };
    function createTextVNode(val) {
        return new VNode(void 0, void 0, void 0, String(val));
    }
    // optimized shallow clone
    // used for static nodes and slot nodes because they may be reused across
    // multiple renders, cloning them avoids errors when DOM manipulations rely
    // on their elm reference.
    function cloneVNode(vnode) {
        var cloned = new VNode(vnode.tag, vnode.data, // #7975
        // clone children array to avoid mutating original in case of cloning
        // a child.
        vnode.children && vnode.children.slice(), vnode.text, vnode.elm, vnode.context, vnode.componentOptions, vnode.asyncFactory);
        return cloned.ns = vnode.ns, cloned.isStatic = vnode.isStatic, cloned.key = vnode.key, cloned.isComment = vnode.isComment, cloned.fnContext = vnode.fnContext, cloned.fnOptions = vnode.fnOptions, cloned.fnScopeId = vnode.fnScopeId, cloned.asyncMeta = vnode.asyncMeta, cloned.isCloned = !0, cloned;
    }
    /*
   * not type checking this file because flow doesn't play well with
   * dynamically accessing methods on Array prototype
   */ var arrayProto = Array.prototype, arrayMethods = Object.create(arrayProto);
    /**
   * Intercept mutating methods and emit events
   */ [
        'push',
        'pop',
        'shift',
        'unshift',
        'splice',
        'sort',
        'reverse'
    ].forEach(function(method) {
        // cache original method
        var original = arrayProto[method];
        def(arrayMethods, method, function() {
            for(var inserted, args = [], len = arguments.length; len--;)args[len] = arguments[len];
            var result = original.apply(this, args), ob = this.__ob__;
            switch(method){
                case 'push':
                case 'unshift':
                    inserted = args;
                    break;
                case 'splice':
                    inserted = args.slice(2);
            }
            return inserted && ob.observeArray(inserted), // notify change
            ob.dep.notify(), result;
        });
    });
    /*  */ var arrayKeys = Object.getOwnPropertyNames(arrayMethods), shouldObserve = !0, Observer = function(value) {
        this.value = value, this.dep = new Dep(), this.vmCount = 0, def(value, '__ob__', this), Array.isArray(value) ? (hasProto ? /* eslint-disable no-proto */ value.__proto__ = arrayMethods : /**
   * Augment a target Object or Array by defining
   * hidden properties.
   */ /* istanbul ignore next */ function(target, src, keys) {
            for(var i = 0, l = keys.length; i < l; i++){
                var key = keys[i];
                def(target, key, src[key]);
            }
        }(value, arrayMethods, arrayKeys), this.observeArray(value)) : this.walk(value);
    };
    /**
   * Attempt to create an observer instance for a value,
   * returns the new observer if successfully observed,
   * or the existing observer if the value already has one.
   */ function observe(value, asRootData) {
        var ob;
        if (isObject(value) && !(value instanceof VNode)) return hasOwn(value, '__ob__') && value.__ob__ instanceof Observer ? ob = value.__ob__ : shouldObserve && !isServerRendering() && (Array.isArray(value) || isPlainObject(value)) && Object.isExtensible(value) && !value._isVue && (ob = new Observer(value)), asRootData && ob && ob.vmCount++, ob;
    }
    /**
   * Define a reactive property on an Object.
   */ function defineReactive$$1(obj, key, val, customSetter, shallow) {
        var dep = new Dep(), property = Object.getOwnPropertyDescriptor(obj, key);
        if (!property || !1 !== property.configurable) {
            // cater for pre-defined getter/setters
            var getter = property && property.get, setter = property && property.set;
            (!getter || setter) && 2 == arguments.length && (val = obj[key]);
            var childOb = !shallow && observe(val);
            Object.defineProperty(obj, key, {
                enumerable: !0,
                configurable: !0,
                get: function() {
                    var value = getter ? getter.call(obj) : val;
                    return Dep.target && (dep.depend(), childOb && (childOb.dep.depend(), Array.isArray(value) && /**
   * Collect dependencies on array elements when the array is touched, since
   * we cannot intercept array element access like property getters.
   */ function dependArray(value) {
                        for(var e = void 0, i = 0, l = value.length; i < l; i++)(e = value[i]) && e.__ob__ && e.__ob__.dep.depend(), Array.isArray(e) && dependArray(e);
                    }(value))), value;
                },
                set: function(newVal) {
                    var value = getter ? getter.call(obj) : val;
                    /* eslint-disable no-self-compare */ newVal !== value && (newVal == newVal || value == value) && (customSetter && customSetter(), (!getter || setter) && (setter ? setter.call(obj, newVal) : val = newVal, childOb = !shallow && observe(newVal), dep.notify()));
                }
            });
        }
    }
    /**
   * Set a property on an object. Adds the new property and
   * triggers change notification if the property doesn't
   * already exist.
   */ function set(target, key, val) {
        if ((isUndef(target) || isPrimitive(target)) && warn("Cannot set reactive property on undefined, null, or primitive value: " + target), Array.isArray(target) && isValidArrayIndex(key)) return target.length = Math.max(target.length, key), target.splice(key, 1, val), val;
        if (key in target && !(key in Object.prototype)) return target[key] = val, val;
        var ob = target.__ob__;
        return target._isVue || ob && ob.vmCount ? warn("Avoid adding reactive properties to a Vue instance or its root $data at runtime - declare it upfront in the data option.") : ob ? (defineReactive$$1(ob.value, key, val), ob.dep.notify()) : target[key] = val, val;
    }
    /**
   * Delete a property and trigger change if necessary.
   */ function del(target, key) {
        if ((isUndef(target) || isPrimitive(target)) && warn("Cannot delete reactive property on undefined, null, or primitive value: " + target), Array.isArray(target) && isValidArrayIndex(key)) {
            target.splice(key, 1);
            return;
        }
        var ob = target.__ob__;
        if (target._isVue || ob && ob.vmCount) {
            warn("Avoid deleting properties on a Vue instance or its root $data - just set it to null.");
            return;
        }
        hasOwn(target, key) && (delete target[key], ob && ob.dep.notify());
    }
    /**
   * Walk through all properties and convert them into
   * getter/setters. This method should only be called when
   * value type is Object.
   */ Observer.prototype.walk = function(obj) {
        for(var keys = Object.keys(obj), i = 0; i < keys.length; i++)defineReactive$$1(obj, keys[i]);
    }, /**
   * Observe a list of Array items.
   */ Observer.prototype.observeArray = function(items) {
        for(var i = 0, l = items.length; i < l; i++)observe(items[i]);
    };
    /*  */ /**
   * Option overwriting strategies are functions that handle
   * how to merge a parent option value and a child option
   * value into the final value.
   */ var strats = config.optionMergeStrategies;
    /**
   * Helper that recursively merges two data objects together.
   */ function mergeData(to, from) {
        if (!from) return to;
        for(var key, toVal, fromVal, keys = hasSymbol ? Reflect.ownKeys(from) : Object.keys(from), i = 0; i < keys.length; i++)// in case the object is already observed...
        '__ob__' !== (key = keys[i]) && (toVal = to[key], fromVal = from[key], hasOwn(to, key) ? toVal !== fromVal && isPlainObject(toVal) && isPlainObject(fromVal) && mergeData(toVal, fromVal) : set(to, key, fromVal));
        return to;
    }
    /**
   * Data
   */ function mergeDataOrFn(parentVal, childVal, vm) {
        return vm ? function() {
            // instance merge
            var instanceData = 'function' == typeof childVal ? childVal.call(vm, vm) : childVal, defaultData = 'function' == typeof parentVal ? parentVal.call(vm, vm) : parentVal;
            return instanceData ? mergeData(instanceData, defaultData) : defaultData;
        } : // in a Vue.extend merge, both should be functions
        childVal ? parentVal ? function() {
            return mergeData('function' == typeof childVal ? childVal.call(this, this) : childVal, 'function' == typeof parentVal ? parentVal.call(this, this) : parentVal);
        } : childVal : parentVal;
    }
    /**
   * Hooks and props are merged as arrays.
   */ function mergeHook(parentVal, childVal) {
        var res = childVal ? parentVal ? parentVal.concat(childVal) : Array.isArray(childVal) ? childVal : [
            childVal
        ] : parentVal;
        return res ? function(hooks) {
            for(var res = [], i = 0; i < hooks.length; i++)-1 === res.indexOf(hooks[i]) && res.push(hooks[i]);
            return res;
        }(res) : res;
    }
    /**
   * Assets
   *
   * When a vm is present (instance creation), we need to do
   * a three-way merge between constructor options, instance
   * options and parent options.
   */ function mergeAssets(parentVal, childVal, vm, key) {
        var res = Object.create(parentVal || null);
        return childVal ? (assertObjectType(key, childVal, vm), extend(res, childVal)) : res;
    }
    strats.el = strats.propsData = function(parent, child, vm, key) {
        return vm || warn("option \"" + key + '" can only be used during instance creation with the `new` keyword.'), defaultStrat(parent, child);
    }, strats.data = function(parentVal, childVal, vm) {
        return vm ? mergeDataOrFn(parentVal, childVal, vm) : childVal && 'function' != typeof childVal ? (warn('The "data" option should be a function that returns a per-instance value in component definitions.', vm), parentVal) : mergeDataOrFn(parentVal, childVal);
    }, LIFECYCLE_HOOKS.forEach(function(hook) {
        strats[hook] = mergeHook;
    }), ASSET_TYPES.forEach(function(type) {
        strats[type + 's'] = mergeAssets;
    }), /**
   * Watchers.
   *
   * Watchers hashes should not overwrite one
   * another, so we merge them as arrays.
   */ strats.watch = function(parentVal, childVal, vm, key) {
        /* istanbul ignore if */ if (parentVal === nativeWatch && (parentVal = void 0), childVal === nativeWatch && (childVal = void 0), !childVal) return Object.create(parentVal || null);
        if (assertObjectType(key, childVal, vm), !parentVal) return childVal;
        var ret = {};
        for(var key$1 in extend(ret, parentVal), childVal){
            var parent = ret[key$1], child = childVal[key$1];
            parent && !Array.isArray(parent) && (parent = [
                parent
            ]), ret[key$1] = parent ? parent.concat(child) : Array.isArray(child) ? child : [
                child
            ];
        }
        return ret;
    }, /**
   * Other object hashes.
   */ strats.props = strats.methods = strats.inject = strats.computed = function(parentVal, childVal, vm, key) {
        if (childVal && assertObjectType(key, childVal, vm), !parentVal) return childVal;
        var ret = Object.create(null);
        return extend(ret, parentVal), childVal && extend(ret, childVal), ret;
    }, strats.provide = mergeDataOrFn;
    /**
   * Default strategy.
   */ var defaultStrat = function(parentVal, childVal) {
        return void 0 === childVal ? parentVal : childVal;
    };
    function validateComponentName(name) {
        RegExp("^[a-zA-Z][\\-\\.0-9_" + unicodeRegExp.source + "]*$").test(name) || warn('Invalid component name: "' + name + '". Component names should conform to valid custom element name in html5 specification.'), (isBuiltInTag(name) || config.isReservedTag(name)) && warn("Do not use built-in or reserved HTML elements as component id: " + name);
    }
    function assertObjectType(name, value, vm) {
        isPlainObject(value) || warn("Invalid value for option \"" + name + '": expected an Object, but got ' + toRawType(value) + ".", vm);
    }
    /**
   * Merge two option objects into a new one.
   * Core utility used in both instantiation and inheritance.
   */ function mergeOptions(parent, child, vm) {
        // Apply extends and mixins on the child options,
        // but only if it is a raw options object that isn't
        // the result of another mergeOptions call.
        // Only merged options has the _base property.
        if (!/**
   * Validate component names
   */ function(options) {
            for(var key in options.components)validateComponentName(key);
        }(child), 'function' == typeof child && (child = child.options), !/**
   * Ensure all props option syntax are normalized into the
   * Object-based format.
   */ function(options, vm) {
            var i, val, props = options.props;
            if (props) {
                var res = {};
                if (Array.isArray(props)) for(i = props.length; i--;)'string' == typeof (val = props[i]) ? res[camelize(val)] = {
                    type: null
                } : warn('props must be strings when using array syntax.');
                else if (isPlainObject(props)) for(var key in props)val = props[key], res[camelize(key)] = isPlainObject(val) ? val : {
                    type: val
                };
                else warn('Invalid value for option "props": expected an Array or an Object, but got ' + toRawType(props) + ".", vm);
                options.props = res;
            }
        }(child, vm), !/**
   * Normalize all injections into Object-based format
   */ function(options, vm) {
            var inject = options.inject;
            if (inject) {
                var normalized = options.inject = {};
                if (Array.isArray(inject)) for(var i = 0; i < inject.length; i++)normalized[inject[i]] = {
                    from: inject[i]
                };
                else if (isPlainObject(inject)) for(var key in inject){
                    var val = inject[key];
                    normalized[key] = isPlainObject(val) ? extend({
                        from: key
                    }, val) : {
                        from: val
                    };
                }
                else warn('Invalid value for option "inject": expected an Array or an Object, but got ' + toRawType(inject) + ".", vm);
            }
        }(child, vm), !/**
   * Normalize raw function directives into object format.
   */ function(options) {
            var dirs = options.directives;
            if (dirs) for(var key in dirs){
                var def$$1 = dirs[key];
                'function' == typeof def$$1 && (dirs[key] = {
                    bind: def$$1,
                    update: def$$1
                });
            }
        }(child), !child._base && (child.extends && (parent = mergeOptions(parent, child.extends, vm)), child.mixins)) for(var key, i = 0, l = child.mixins.length; i < l; i++)parent = mergeOptions(parent, child.mixins[i], vm);
        var options = {};
        for(key in parent)mergeField(key);
        for(key in child)hasOwn(parent, key) || mergeField(key);
        function mergeField(key) {
            var strat = strats[key] || defaultStrat;
            options[key] = strat(parent[key], child[key], vm, key);
        }
        return options;
    }
    /**
   * Resolve an asset.
   * This function is used because child instances need access
   * to assets defined in its ancestor chain.
   */ function resolveAsset(options, type, id, warnMissing) {
        /* istanbul ignore if */ if ('string' == typeof id) {
            var assets = options[type];
            // check local registration variations first
            if (hasOwn(assets, id)) return assets[id];
            var camelizedId = camelize(id);
            if (hasOwn(assets, camelizedId)) return assets[camelizedId];
            var PascalCaseId = capitalize(camelizedId);
            if (hasOwn(assets, PascalCaseId)) return assets[PascalCaseId];
            // fallback to prototype chain
            var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
            return warnMissing && !res && warn('Failed to resolve ' + type.slice(0, -1) + ': ' + id, options), res;
        }
    }
    /*  */ function validateProp(key, propOptions, propsData, vm) {
        var prop = propOptions[key], absent = !hasOwn(propsData, key), value = propsData[key], booleanIndex = getTypeIndex(Boolean, prop.type);
        if (booleanIndex > -1) {
            if (absent && !hasOwn(prop, 'default')) value = !1;
            else if ('' === value || value === hyphenate(key)) {
                // only cast empty string / same name to boolean if
                // boolean has higher priority
                var stringIndex = getTypeIndex(String, prop.type);
                (stringIndex < 0 || booleanIndex < stringIndex) && (value = !0);
            }
        }
        // check default value
        if (void 0 === value) {
            value = /**
   * Get the default value of a prop.
   */ function(vm, prop, key) {
                // no default, return undefined
                if (hasOwn(prop, 'default')) {
                    var def = prop.default;
                    return(// the raw prop value was also undefined from previous render,
                    // return previous default value to avoid unnecessary watcher trigger
                    (isObject(def) && warn('Invalid default value for prop "' + key + '": Props with type Object/Array must use a factory function to return the default value.', vm), vm && vm.$options.propsData && void 0 === vm.$options.propsData[key] && void 0 !== vm._props[key]) ? vm._props[key] : 'function' == typeof def && 'Function' !== getType(prop.type) ? def.call(vm) : def);
                }
            }(vm, prop, key);
            // since the default value is a fresh copy,
            // make sure to observe it.
            var prevShouldObserve = shouldObserve;
            shouldObserve = !0, observe(value), shouldObserve = prevShouldObserve;
        }
        return(/**
   * Assert whether a prop is valid.
   */ function(prop, name, value, vm, absent) {
            if (prop.required && absent) {
                warn('Missing required prop: "' + name + '"', vm);
                return;
            }
            if (null != value || prop.required) {
                var message, expectedType, receivedType, expectedValue, receivedValue, type = prop.type, valid = !type || !0 === type, expectedTypes = [];
                if (type) {
                    Array.isArray(type) || (type = [
                        type
                    ]);
                    for(var i = 0; i < type.length && !valid; i++){
                        var assertedType = function(value, type) {
                            var valid, expectedType = getType(type);
                            if (simpleCheckRE.test(expectedType)) {
                                var t = typeof value;
                                // for primitive wrapper objects
                                (valid = t === expectedType.toLowerCase()) || 'object' !== t || (valid = value instanceof type);
                            } else valid = 'Object' === expectedType ? isPlainObject(value) : 'Array' === expectedType ? Array.isArray(value) : value instanceof type;
                            return {
                                valid: valid,
                                expectedType: expectedType
                            };
                        }(value, type[i]);
                        expectedTypes.push(assertedType.expectedType || ''), valid = assertedType.valid;
                    }
                }
                if (!valid) {
                    warn((message = "Invalid prop: type check failed for prop \"" + name + '". Expected ' + expectedTypes.map(capitalize).join(', '), expectedType = expectedTypes[0], receivedType = toRawType(value), expectedValue = styleValue(value, expectedType), receivedValue = styleValue(value, receivedType), 1 === expectedTypes.length && isExplicable(expectedType) && !function() {
                        for(var args = [], len = arguments.length; len--;)args[len] = arguments[len];
                        return args.some(function(elem) {
                            return 'boolean' === elem.toLowerCase();
                        });
                    }(expectedType, receivedType) && (message += " with value " + expectedValue), message += ", got " + receivedType + " ", isExplicable(receivedType) && (message += "with value " + receivedValue + "."), message), vm);
                    return;
                }
                var validator = prop.validator;
                validator && !validator(value) && warn('Invalid prop: custom validator check failed for prop "' + name + '".', vm);
            }
        }(prop, key, value, vm, absent), value);
    }
    var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;
    /**
   * Use function string name to check built-in types,
   * because a simple equality check will fail when running
   * across different vms / iframes.
   */ function getType(fn) {
        var match = fn && fn.toString().match(/^\s*function (\w+)/);
        return match ? match[1] : '';
    }
    function getTypeIndex(type, expectedTypes) {
        if (!Array.isArray(expectedTypes)) return getType(expectedTypes) === getType(type) ? 0 : -1;
        for(var i = 0, len = expectedTypes.length; i < len; i++)if (getType(expectedTypes[i]) === getType(type)) return i;
        return -1;
    }
    function styleValue(value, type) {
        return 'String' === type ? "\"" + value + "\"" : 'Number' === type ? "" + Number(value) : "" + value;
    }
    function isExplicable(value) {
        return [
            'string',
            'number',
            'boolean'
        ].some(function(elem) {
            return value.toLowerCase() === elem;
        });
    }
    /*  */ function handleError(err, vm, info) {
        // Deactivate deps tracking while processing error handler to avoid possible infinite rendering.
        // See: https://github.com/vuejs/vuex/issues/1505
        pushTarget();
        try {
            if (vm) for(var cur = vm; cur = cur.$parent;){
                var hooks = cur.$options.errorCaptured;
                if (hooks) for(var i = 0; i < hooks.length; i++)try {
                    if (!1 === hooks[i].call(cur, err, vm, info)) return;
                } catch (e) {
                    globalHandleError(e, cur, 'errorCaptured hook');
                }
            }
            globalHandleError(err, vm, info);
        } finally{
            popTarget();
        }
    }
    function invokeWithErrorHandling(handler, context, args, vm, info) {
        var res;
        try {
            (res = args ? handler.apply(context, args) : handler.call(context)) && !res._isVue && isPromise(res) && !res._handled && (res.catch(function(e) {
                return handleError(e, vm, info + " (Promise/async)");
            }), // issue #9511
            // avoid catch triggering multiple times when nested calls
            res._handled = !0);
        } catch (e) {
            handleError(e, vm, info);
        }
        return res;
    }
    function globalHandleError(err, vm, info) {
        if (config.errorHandler) try {
            return config.errorHandler.call(null, err, vm, info);
        } catch (e) {
            // if the user intentionally throws the original error in the handler,
            // do not log it twice
            e !== err && logError(e, null, 'config.errorHandler');
        }
        logError(err, vm, info);
    }
    function logError(err, vm, info) {
        /* istanbul ignore else */ if (warn("Error in " + info + ": \"" + err.toString() + "\"", vm), (inBrowser || inWeex) && 'undefined' != typeof console) console.error(err);
        else throw err;
    }
    /*  */ var isUsingMicroTask = !1, callbacks = [], pending = !1;
    function flushCallbacks() {
        pending = !1;
        var copies = callbacks.slice(0);
        callbacks.length = 0;
        for(var i = 0; i < copies.length; i++)copies[i]();
    }
    // The nextTick behavior leverages the microtask queue, which can be accessed
    // via either native Promise.then or MutationObserver.
    // MutationObserver has wider support, however it is seriously bugged in
    // UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
    // completely stops working after triggering a few times... so, if native
    // Promise is available, we will use it:
    /* istanbul ignore next, $flow-disable-line */ if ('undefined' != typeof Promise && isNative(Promise)) {
        var p = Promise.resolve();
        timerFunc = function() {
            p.then(flushCallbacks), isIOS && setTimeout(noop);
        }, isUsingMicroTask = !0;
    } else if (!isIE && 'undefined' != typeof MutationObserver && (isNative(MutationObserver) || // PhantomJS and iOS 7.x
    '[object MutationObserverConstructor]' === MutationObserver.toString())) {
        // Use MutationObserver where native Promise is not available,
        // e.g. PhantomJS, iOS7, Android 4.4
        // (#6466 MutationObserver is unreliable in IE11)
        var counter = 1, observer = new MutationObserver(flushCallbacks), textNode = document.createTextNode(String(counter));
        observer.observe(textNode, {
            characterData: !0
        }), timerFunc = function() {
            counter = (counter + 1) % 2, textNode.data = String(counter);
        }, isUsingMicroTask = !0;
    } else // Fallback to setImmediate.
    // Technically it leverages the (macro) task queue,
    // but it is still a better choice than setTimeout.
    timerFunc = 'undefined' != typeof setImmediate && isNative(setImmediate) ? function() {
        setImmediate(flushCallbacks);
    } : function() {
        setTimeout(flushCallbacks, 0);
    };
    function nextTick(cb, ctx) {
        var _resolve;
        // $flow-disable-line
        if (callbacks.push(function() {
            if (cb) try {
                cb.call(ctx);
            } catch (e) {
                handleError(e, ctx, 'nextTick');
            }
            else _resolve && _resolve(ctx);
        }), pending || (pending = !0, timerFunc()), !cb && 'undefined' != typeof Promise) return new Promise(function(resolve) {
            _resolve = resolve;
        });
    }
    var perf = inBrowser && window.performance;
    perf && perf.mark && perf.measure && perf.clearMarks && perf.clearMeasures && (mark = function(tag) {
        return perf.mark(tag);
    }, measure = function(name, startTag, endTag) {
        perf.measure(name, startTag, endTag), perf.clearMarks(startTag), perf.clearMarks(endTag);
    // perf.clearMeasures(name)
    });
    var allowedGlobals = makeMap("Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,require" // for Webpack/Browserify
    ), warnNonPresent = function(target, key) {
        warn("Property or method \"" + key + '" is not defined on the instance but referenced during render. Make sure that this property is reactive, either in the data option, or for class-based components, by initializing the property. See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.', target);
    }, warnReservedPrefix = function(target, key) {
        warn("Property \"" + key + "\" must be accessed with \"$data." + key + '" because properties starting with "$" or "_" are not proxied in the Vue instance to prevent conflicts with Vue internals. See: https://vuejs.org/v2/api/#data', target);
    }, hasProxy = 'undefined' != typeof Proxy && isNative(Proxy);
    if (hasProxy) {
        var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
        config.keyCodes = new Proxy(config.keyCodes, {
            set: function(target, key, value) {
                return isBuiltInModifier(key) ? (warn("Avoid overwriting built-in modifier in config.keyCodes: ." + key), !1) : (target[key] = value, !0);
            }
        });
    }
    var hasHandler = {
        has: function(target, key) {
            var has = key in target, isAllowed = allowedGlobals(key) || 'string' == typeof key && '_' === key.charAt(0) && !(key in target.$data);
            return has || isAllowed || (key in target.$data ? warnReservedPrefix(target, key) : warnNonPresent(target, key)), has || !isAllowed;
        }
    }, getHandler = {
        get: function(target, key) {
            return 'string' != typeof key || key in target || (key in target.$data ? warnReservedPrefix(target, key) : warnNonPresent(target, key)), target[key];
        }
    };
    initProxy = function(vm) {
        if (hasProxy) {
            // determine which proxy handler to use
            var options = vm.$options, handlers = options.render && options.render._withStripped ? getHandler : hasHandler;
            vm._renderProxy = new Proxy(vm, handlers);
        } else vm._renderProxy = vm;
    };
    /*  */ var seenObjects = new _Set();
    /**
   * Recursively traverse an object to evoke all converted
   * getters, so that every nested property inside the object
   * is collected as a "deep" dependency.
   */ function traverse(val) {
        (function _traverse(val, seen) {
            var i, keys, isA = Array.isArray(val);
            if (!(!isA && !isObject(val) || Object.isFrozen(val)) && !(val instanceof VNode)) {
                if (val.__ob__) {
                    var depId = val.__ob__.dep.id;
                    if (seen.has(depId)) return;
                    seen.add(depId);
                }
                if (isA) for(i = val.length; i--;)_traverse(val[i], seen);
                else for(i = (keys = Object.keys(val)).length; i--;)_traverse(val[keys[i]], seen);
            }
        })(val, seenObjects), seenObjects.clear();
    }
    /*  */ var normalizeEvent = cached(function(name) {
        var passive = '&' === name.charAt(0), once$$1 = '~' === (name = passive ? name.slice(1) : name).charAt(0), capture = '!' === (name = once$$1 ? name.slice(1) : name).charAt(0);
        return {
            name: name = capture ? name.slice(1) : name,
            once: once$$1,
            capture: capture,
            passive: passive
        };
    });
    function createFnInvoker(fns, vm) {
        function invoker() {
            var arguments$1 = arguments, fns = invoker.fns;
            if (!Array.isArray(fns)) // return handler return value for single handlers
            return invokeWithErrorHandling(fns, null, arguments, vm, "v-on handler");
            for(var cloned = fns.slice(), i = 0; i < cloned.length; i++)invokeWithErrorHandling(cloned[i], null, arguments$1, vm, "v-on handler");
        }
        return invoker.fns = fns, invoker;
    }
    function updateListeners(on, oldOn, add, remove$$1, createOnceHandler, vm) {
        var name, cur, old, event;
        for(name in on)cur = on[name], old = oldOn[name], event = normalizeEvent(name), isUndef(cur) ? warn("Invalid handler for event \"" + event.name + "\": got " + String(cur), vm) : isUndef(old) ? (isUndef(cur.fns) && (cur = on[name] = createFnInvoker(cur, vm)), isTrue(event.once) && (cur = on[name] = createOnceHandler(event.name, cur, event.capture)), add(event.name, cur, event.capture, event.passive, event.params)) : cur !== old && (old.fns = cur, on[name] = old);
        for(name in oldOn)isUndef(on[name]) && remove$$1((event = normalizeEvent(name)).name, oldOn[name], event.capture);
    }
    /*  */ function mergeVNodeHook(def, hookKey, hook) {
        def instanceof VNode && (def = def.data.hook || (def.data.hook = {}));
        var invoker, oldHook = def[hookKey];
        function wrappedHook() {
            hook.apply(this, arguments), // important: remove merged hook to ensure it's called only once
            // and prevent memory leak
            remove(invoker.fns, wrappedHook);
        }
        isUndef(oldHook) ? // no existing hook
        invoker = createFnInvoker([
            wrappedHook
        ]) : isDef(oldHook.fns) && isTrue(oldHook.merged) ? // already a merged invoker
        (invoker = oldHook).fns.push(wrappedHook) : // existing plain hook
        invoker = createFnInvoker([
            oldHook,
            wrappedHook
        ]), invoker.merged = !0, def[hookKey] = invoker;
    }
    function checkProp(res, hash, key, altKey, preserve) {
        if (isDef(hash)) {
            if (hasOwn(hash, key)) return res[key] = hash[key], preserve || delete hash[key], !0;
            if (hasOwn(hash, altKey)) return res[key] = hash[altKey], preserve || delete hash[altKey], !0;
        }
        return !1;
    }
    // 2. When the children contains constructs that always generated nested Arrays,
    // e.g. <template>, <slot>, v-for, or when the children is provided by user
    // with hand-written render functions / JSX. In such cases a full normalization
    // is needed to cater to all possible types of children values.
    function normalizeChildren(children) {
        return isPrimitive(children) ? [
            createTextVNode(children)
        ] : Array.isArray(children) ? function normalizeArrayChildren(children, nestedIndex) {
            var i, c, lastIndex, last, res = [];
            for(i = 0; i < children.length; i++)!isUndef(c = children[i]) && 'boolean' != typeof c && (lastIndex = res.length - 1, last = res[lastIndex], Array.isArray(c) ? c.length > 0 && (isTextNode((c = normalizeArrayChildren(c, (nestedIndex || '') + "_" + i))[0]) && isTextNode(last) && (res[lastIndex] = createTextVNode(last.text + c[0].text), c.shift()), res.push.apply(res, c)) : isPrimitive(c) ? isTextNode(last) ? // merge adjacent text nodes
            // this is necessary for SSR hydration because text nodes are
            // essentially merged when rendered to HTML strings
            res[lastIndex] = createTextVNode(last.text + c) : '' !== c && // convert primitive to vnode
            res.push(createTextVNode(c)) : isTextNode(c) && isTextNode(last) ? // merge adjacent text nodes
            res[lastIndex] = createTextVNode(last.text + c.text) : (isTrue(children._isVList) && isDef(c.tag) && isUndef(c.key) && isDef(nestedIndex) && (c.key = "__vlist" + nestedIndex + "_" + i + "__"), res.push(c)));
            return res;
        }(children) : void 0;
    }
    function isTextNode(node) {
        return isDef(node) && isDef(node.text) && !1 === node.isComment;
    }
    function resolveInject(inject, vm) {
        if (inject) {
            for(var result = Object.create(null), keys = hasSymbol ? Reflect.ownKeys(inject) : Object.keys(inject), i = 0; i < keys.length; i++){
                var key = keys[i];
                // #6574 in case the inject object is observed...
                if ('__ob__' !== key) {
                    for(var provideKey = inject[key].from, source = vm; source;){
                        if (source._provided && hasOwn(source._provided, provideKey)) {
                            result[key] = source._provided[provideKey];
                            break;
                        }
                        source = source.$parent;
                    }
                    if (!source) {
                        if ('default' in inject[key]) {
                            var provideDefault = inject[key].default;
                            result[key] = 'function' == typeof provideDefault ? provideDefault.call(vm) : provideDefault;
                        } else warn("Injection \"" + key + "\" not found", vm);
                    }
                }
            }
            return result;
        }
    }
    /*  */ /**
   * Runtime helper for resolving raw children VNodes into a slot object.
   */ function resolveSlots(children, context) {
        if (!children || !children.length) return {};
        for(var slots = {}, i = 0, l = children.length; i < l; i++){
            var child = children[i], data = child.data;
            // named slots should only be respected if the vnode was rendered in the
            // same context.
            if (data && data.attrs && data.attrs.slot && delete data.attrs.slot, (child.context === context || child.fnContext === context) && data && null != data.slot) {
                var name = data.slot, slot = slots[name] || (slots[name] = []);
                'template' === child.tag ? slot.push.apply(slot, child.children || []) : slot.push(child);
            } else (slots.default || (slots.default = [])).push(child);
        }
        // ignore slots that contains only whitespace
        for(var name$1 in slots)slots[name$1].every(isWhitespace) && delete slots[name$1];
        return slots;
    }
    function isWhitespace(node) {
        return node.isComment && !node.asyncFactory || ' ' === node.text;
    }
    /*  */ function normalizeScopedSlots(slots, normalSlots, prevSlots) {
        var res, hasNormalSlots = Object.keys(normalSlots).length > 0, isStable = slots ? !!slots.$stable : !hasNormalSlots, key = slots && slots.$key;
        if (slots) {
            if (slots._normalized) // fast path 1: child component re-render only, parent did not change
            return slots._normalized;
            if (isStable && prevSlots && prevSlots !== emptyObject && key === prevSlots.$key && !hasNormalSlots && !prevSlots.$hasNormal) // fast path 2: stable scoped slots w/ no normal slots to proxy,
            // only need to normalize once
            return prevSlots;
            for(var key$1 in res = {}, slots)slots[key$1] && '$' !== key$1[0] && (res[key$1] = function(normalSlots, key, fn) {
                var normalized = function() {
                    var res = arguments.length ? fn.apply(null, arguments) : fn({});
                    return (res = res && 'object' == typeof res && !Array.isArray(res) ? [
                        res
                    ] // single vnode
                     : normalizeChildren(res)) && (0 === res.length || 1 === res.length && res[0].isComment // #9658
                    ) ? void 0 : res;
                };
                return fn.proxy && Object.defineProperty(normalSlots, key, {
                    get: normalized,
                    enumerable: !0,
                    configurable: !0
                }), normalized;
            }(normalSlots, key$1, slots[key$1]));
        } else res = {};
        // expose normal slots on scopedSlots
        for(var key$2 in normalSlots)key$2 in res || (res[key$2] = function(slots, key) {
            return function() {
                return slots[key];
            };
        }(normalSlots, key$2));
        return slots && Object.isExtensible(slots) && (slots._normalized = res), def(res, '$stable', isStable), def(res, '$key', key), def(res, '$hasNormal', hasNormalSlots), res;
    }
    /*  */ /**
   * Runtime helper for rendering v-for lists.
   */ function renderList(val, render) {
        var ret, i, l, keys, key;
        if (Array.isArray(val) || 'string' == typeof val) for(i = 0, ret = Array(val.length), l = val.length; i < l; i++)ret[i] = render(val[i], i);
        else if ('number' == typeof val) for(i = 0, ret = Array(val); i < val; i++)ret[i] = render(i + 1, i);
        else if (isObject(val)) {
            if (hasSymbol && val[Symbol.iterator]) {
                ret = [];
                for(var iterator = val[Symbol.iterator](), result = iterator.next(); !result.done;)ret.push(render(result.value, ret.length)), result = iterator.next();
            } else for(i = 0, ret = Array((keys = Object.keys(val)).length), l = keys.length; i < l; i++)key = keys[i], ret[i] = render(val[key], key, i);
        }
        return isDef(ret) || (ret = []), ret._isVList = !0, ret;
    }
    /*  */ /**
   * Runtime helper for rendering <slot>
   */ function renderSlot(name, fallback, props, bindObject) {
        var nodes, scopedSlotFn = this.$scopedSlots[name];
        scopedSlotFn ? (props = props || {}, bindObject && (isObject(bindObject) || warn('slot v-bind without argument expects an Object', this), props = extend(extend({}, bindObject), props)), nodes = scopedSlotFn(props) || fallback) : nodes = this.$slots[name] || fallback;
        var target = props && props.slot;
        return target ? this.$createElement('template', {
            slot: target
        }, nodes) : nodes;
    }
    /*  */ /**
   * Runtime helper for resolving filters
   */ function resolveFilter(id) {
        return resolveAsset(this.$options, 'filters', id, !0) || identity;
    }
    /*  */ function isKeyNotMatch(expect, actual) {
        return Array.isArray(expect) ? -1 === expect.indexOf(actual) : expect !== actual;
    }
    /**
   * Runtime helper for checking keyCodes from config.
   * exposed as Vue.prototype._k
   * passing in eventKeyName as last argument separately for backwards compat
   */ function checkKeyCodes(eventKeyCode, key, builtInKeyCode, eventKeyName, builtInKeyName) {
        var mappedKeyCode = config.keyCodes[key] || builtInKeyCode;
        return builtInKeyName && eventKeyName && !config.keyCodes[key] ? isKeyNotMatch(builtInKeyName, eventKeyName) : mappedKeyCode ? isKeyNotMatch(mappedKeyCode, eventKeyCode) : eventKeyName ? hyphenate(eventKeyName) !== key : void 0;
    }
    /*  */ /**
   * Runtime helper for merging v-bind="object" into a VNode's data.
   */ function bindObjectProps(data, tag, value, asProp, isSync) {
        if (value) {
            if (isObject(value)) {
                Array.isArray(value) && (value = toObject(value));
                var hash, loop = function(key) {
                    if ('class' === key || 'style' === key || isReservedAttribute(key)) hash = data;
                    else {
                        var type = data.attrs && data.attrs.type;
                        hash = asProp || config.mustUseProp(tag, type, key) ? data.domProps || (data.domProps = {}) : data.attrs || (data.attrs = {});
                    }
                    var camelizedKey = camelize(key), hyphenatedKey = hyphenate(key);
                    camelizedKey in hash || hyphenatedKey in hash || (hash[key] = value[key], isSync && ((data.on || (data.on = {}))["update:" + key] = function($event) {
                        value[key] = $event;
                    }));
                };
                for(var key in value)loop(key);
            } else warn('v-bind without argument expects an Object or Array value', this);
        }
        return data;
    }
    /*  */ /**
   * Runtime helper for rendering static trees.
   */ function renderStatic(index, isInFor) {
        var cached = this._staticTrees || (this._staticTrees = []), tree = cached[index];
        return tree && !isInFor || markStatic(// otherwise, render a fresh tree.
        tree = cached[index] = this.$options.staticRenderFns[index].call(this._renderProxy, null, this // for render fns generated for functional component templates
        ), "__static__" + index, !1), tree;
    }
    /**
   * Runtime helper for v-once.
   * Effectively it means marking the node as static with a unique key.
   */ function markOnce(tree, index, key) {
        return markStatic(tree, "__once__" + index + (key ? "_" + key : ""), !0), tree;
    }
    function markStatic(tree, key, isOnce) {
        if (Array.isArray(tree)) for(var i = 0; i < tree.length; i++)tree[i] && 'string' != typeof tree[i] && markStaticNode(tree[i], key + "_" + i, isOnce);
        else markStaticNode(tree, key, isOnce);
    }
    function markStaticNode(node, key, isOnce) {
        node.isStatic = !0, node.key = key, node.isOnce = isOnce;
    }
    /*  */ function bindObjectListeners(data, value) {
        if (value) {
            if (isPlainObject(value)) {
                var on = data.on = data.on ? extend({}, data.on) : {};
                for(var key in value){
                    var existing = on[key], ours = value[key];
                    on[key] = existing ? [].concat(existing, ours) : ours;
                }
            } else warn('v-on without argument expects an Object value', this);
        }
        return data;
    }
    /*  */ function bindDynamicKeys(baseObj, values) {
        for(var i = 0; i < values.length; i += 2){
            var key = values[i];
            'string' == typeof key && key ? baseObj[values[i]] = values[i + 1] : '' !== key && null !== key && // null is a special value for explicitly removing a binding
            warn("Invalid value for dynamic directive argument (expected string or null): " + key, this);
        }
        return baseObj;
    }
    // helper to dynamically append modifier runtime markers to event names.
    // ensure only append when value is already string, otherwise it will be cast
    // to string and cause the type check to miss.
    function prependModifier(value, symbol) {
        return 'string' == typeof value ? symbol + value : value;
    }
    /*  */ function installRenderHelpers(target) {
        target._o = markOnce, target._n = toNumber, target._s = toString, target._l = renderList, target._t = renderSlot, target._q = looseEqual, target._i = looseIndexOf, target._m = renderStatic, target._f = resolveFilter, target._k = checkKeyCodes, target._b = bindObjectProps, target._v = createTextVNode, target._e = createEmptyVNode, target._u = /*  */ function resolveScopedSlots(fns, res, // the following are added in 2.6
        hasDynamicKeys, contentHashKey) {
            res = res || {
                $stable: !hasDynamicKeys
            };
            for(var i = 0; i < fns.length; i++){
                var slot = fns[i];
                Array.isArray(slot) ? resolveScopedSlots(slot, res, hasDynamicKeys) : slot && (slot.proxy && (slot.fn.proxy = !0), res[slot.key] = slot.fn);
            }
            return contentHashKey && (res.$key = contentHashKey), res;
        }, target._g = bindObjectListeners, target._d = bindDynamicKeys, target._p = prependModifier;
    }
    /*  */ function FunctionalRenderContext(data, props, children, parent, Ctor) {
        var contextVm, this$1 = this, options = Ctor.options;
        hasOwn(parent, '_uid') ? // $flow-disable-line
        (contextVm = Object.create(parent))._original = parent : (// the context vm passed in is a functional context as well.
        // in this case we want to make sure we are able to get a hold to the
        // real context instance.
        contextVm = parent, // $flow-disable-line
        parent = parent._original);
        var isCompiled = isTrue(options._compiled), needNormalization = !isCompiled;
        this.data = data, this.props = props, this.children = children, this.parent = parent, this.listeners = data.on || emptyObject, this.injections = resolveInject(options.inject, parent), this.slots = function() {
            return this$1.$slots || normalizeScopedSlots(data.scopedSlots, this$1.$slots = resolveSlots(children, parent)), this$1.$slots;
        }, Object.defineProperty(this, 'scopedSlots', {
            enumerable: !0,
            get: function() {
                return normalizeScopedSlots(data.scopedSlots, this.slots());
            }
        }), isCompiled && (// exposing $options for renderStatic()
        this.$options = options, // pre-resolve slots for renderSlot()
        this.$slots = this.slots(), this.$scopedSlots = normalizeScopedSlots(data.scopedSlots, this.$slots)), options._scopeId ? this._c = function(a, b, c, d) {
            var vnode = createElement(contextVm, a, b, c, d, needNormalization);
            return vnode && !Array.isArray(vnode) && (vnode.fnScopeId = options._scopeId, vnode.fnContext = parent), vnode;
        } : this._c = function(a, b, c, d) {
            return createElement(contextVm, a, b, c, d, needNormalization);
        };
    }
    function cloneAndMarkFunctionalResult(vnode, data, contextVm, options, renderContext) {
        // #7817 clone node before setting fnContext, otherwise if the node is reused
        // (e.g. it was from a cached normal slot) the fnContext causes named slots
        // that should not be matched to match.
        var clone = cloneVNode(vnode);
        return clone.fnContext = contextVm, clone.fnOptions = options, (clone.devtoolsMeta = clone.devtoolsMeta || {}).renderContext = renderContext, data.slot && ((clone.data || (clone.data = {})).slot = data.slot), clone;
    }
    function mergeProps(to, from) {
        for(var key in from)to[camelize(key)] = from[key];
    }
    installRenderHelpers(FunctionalRenderContext.prototype);
    /*  */ /*  */ /*  */ /*  */ // inline hooks to be invoked on component VNodes during patch
    var componentVNodeHooks = {
        init: function(vnode, hydrating) {
            var options, inlineTemplate;
            vnode.componentInstance && !vnode.componentInstance._isDestroyed && vnode.data.keepAlive ? componentVNodeHooks.prepatch(vnode, vnode) : (vnode.componentInstance = (options = {
                _isComponent: !0,
                _parentVnode: vnode,
                parent: activeInstance
            }, isDef(inlineTemplate = vnode.data.inlineTemplate) && (options.render = inlineTemplate.render, options.staticRenderFns = inlineTemplate.staticRenderFns), new vnode.componentOptions.Ctor(options))).$mount(hydrating ? vnode.elm : void 0, hydrating);
        },
        prepatch: function(oldVnode, vnode) {
            var options = vnode.componentOptions;
            !function(vm, propsData, listeners, parentVnode, renderChildren) {
                isUpdatingChildComponent = !0;
                // determine whether component has slot children
                // we need to do this before overwriting $options._renderChildren.
                // check if there are dynamic scopedSlots (hand-written or compiled but with
                // dynamic slot names). Static scoped slots compiled from template has the
                // "$stable" marker.
                var newScopedSlots = parentVnode.data.scopedSlots, oldScopedSlots = vm.$scopedSlots, hasDynamicScopedSlot = !!(newScopedSlots && !newScopedSlots.$stable || oldScopedSlots !== emptyObject && !oldScopedSlots.$stable || newScopedSlots && vm.$scopedSlots.$key !== newScopedSlots.$key), needsForceUpdate = !!(renderChildren || // has new static slots
                vm.$options._renderChildren || // has old static slots
                hasDynamicScopedSlot);
                // update props
                if (vm.$options._parentVnode = parentVnode, vm.$vnode = parentVnode, vm._vnode && (vm._vnode.parent = parentVnode), vm.$options._renderChildren = renderChildren, // update $attrs and $listeners hash
                // these are also reactive so they may trigger child update if the child
                // used them during render
                vm.$attrs = parentVnode.data.attrs || emptyObject, vm.$listeners = listeners || emptyObject, propsData && vm.$options.props) {
                    shouldObserve = !1;
                    for(var props = vm._props, propKeys = vm.$options._propKeys || [], i = 0; i < propKeys.length; i++){
                        var key = propKeys[i], propOptions = vm.$options.props;
                        props[key] = validateProp(key, propOptions, propsData, vm);
                    }
                    shouldObserve = !0, // keep a copy of raw propsData
                    vm.$options.propsData = propsData;
                }
                // update listeners
                listeners = listeners || emptyObject;
                var oldListeners = vm.$options._parentListeners;
                vm.$options._parentListeners = listeners, updateComponentListeners(vm, listeners, oldListeners), needsForceUpdate && (vm.$slots = resolveSlots(renderChildren, parentVnode.context), vm.$forceUpdate()), isUpdatingChildComponent = !1;
            }(vnode.componentInstance = oldVnode.componentInstance, options.propsData, options.listeners, vnode, options.children // new children
            );
        },
        insert: function(vnode) {
            var context = vnode.context, componentInstance = vnode.componentInstance;
            componentInstance._isMounted || (componentInstance._isMounted = !0, callHook(componentInstance, 'mounted')), vnode.data.keepAlive && (context._isMounted ? (// setting _inactive to false here so that a render function can
            // rely on checking whether it's in an inactive tree (e.g. router-view)
            componentInstance._inactive = !1, activatedChildren.push(componentInstance)) : activateChildComponent(componentInstance, !0));
        },
        destroy: function(vnode) {
            var componentInstance = vnode.componentInstance;
            componentInstance._isDestroyed || (vnode.data.keepAlive ? function deactivateChildComponent(vm, direct) {
                if (!(direct && (vm._directInactive = !0, isInInactiveTree(vm))) && !vm._inactive) {
                    vm._inactive = !0;
                    for(var i = 0; i < vm.$children.length; i++)deactivateChildComponent(vm.$children[i]);
                    callHook(vm, 'deactivated');
                }
            }(componentInstance, !0) : componentInstance.$destroy());
        }
    }, hooksToMerge = Object.keys(componentVNodeHooks);
    function createComponent(Ctor, data, context, children, tag) {
        if (!isUndef(Ctor)) {
            var factory, data1, node, options, data2, prop, event, on, existing, callback, asyncFactory, baseCtor = context.$options._base;
            // if at this stage it's not a constructor or an async component factory,
            // reject.
            if (isObject(Ctor) && (Ctor = baseCtor.extend(Ctor)), 'function' != typeof Ctor) {
                warn("Invalid Component definition: " + String(Ctor), context);
                return;
            }
            if (isUndef(Ctor.cid) && void 0 === (Ctor = function(factory, baseCtor) {
                if (isTrue(factory.error) && isDef(factory.errorComp)) return factory.errorComp;
                if (isDef(factory.resolved)) return factory.resolved;
                var owner = currentRenderingInstance;
                if (owner && isDef(factory.owners) && -1 === factory.owners.indexOf(owner) && // already pending
                factory.owners.push(owner), isTrue(factory.loading) && isDef(factory.loadingComp)) return factory.loadingComp;
                if (owner && !isDef(factory.owners)) {
                    var owners = factory.owners = [
                        owner
                    ], sync = !0, timerLoading = null, timerTimeout = null;
                    owner.$on('hook:destroyed', function() {
                        return remove(owners, owner);
                    });
                    var forceRender = function(renderCompleted) {
                        for(var i = 0, l = owners.length; i < l; i++)owners[i].$forceUpdate();
                        renderCompleted && (owners.length = 0, null !== timerLoading && (clearTimeout(timerLoading), timerLoading = null), null !== timerTimeout && (clearTimeout(timerTimeout), timerTimeout = null));
                    }, resolve = once(function(res) {
                        // cache resolved
                        factory.resolved = ensureCtor(res, baseCtor), sync ? owners.length = 0 : forceRender(!0);
                    }), reject = once(function(reason) {
                        warn("Failed to resolve async component: " + String(factory) + (reason ? "\nReason: " + reason : '')), isDef(factory.errorComp) && (factory.error = !0, forceRender(!0));
                    }), res = factory(resolve, reject);
                    // return in case resolved synchronously
                    return isObject(res) && (isPromise(res) ? isUndef(factory.resolved) && res.then(resolve, reject) : isPromise(res.component) && (res.component.then(resolve, reject), isDef(res.error) && (factory.errorComp = ensureCtor(res.error, baseCtor)), isDef(res.loading) && (factory.loadingComp = ensureCtor(res.loading, baseCtor), 0 === res.delay ? factory.loading = !0 : timerLoading = setTimeout(function() {
                        timerLoading = null, isUndef(factory.resolved) && isUndef(factory.error) && (factory.loading = !0, forceRender(!1));
                    }, res.delay || 200)), isDef(res.timeout) && (timerTimeout = setTimeout(function() {
                        timerTimeout = null, isUndef(factory.resolved) && reject("timeout (" + res.timeout + "ms)");
                    }, res.timeout)))), sync = !1, factory.loading ? factory.loadingComp : factory.resolved;
                }
            }(asyncFactory = Ctor, baseCtor))) // return a placeholder node for async component, which is rendered
            // as a comment node but preserves all the raw information for the node.
            // the information will be used for async server-rendering and hydration.
            return factory = asyncFactory, data1 = data, (node = createEmptyVNode()).asyncFactory = factory, node.asyncMeta = {
                data: data1,
                context: context,
                children: children,
                tag: tag
            }, node;
            data = data || {}, // resolve constructor options in case global mixins are applied after
            // component constructor creation
            resolveConstructorOptions(Ctor), isDef(data.model) && (options = Ctor.options, data2 = data, prop = options.model && options.model.prop || 'value', event = options.model && options.model.event || 'input', (data2.attrs || (data2.attrs = {}))[prop] = data2.model.value, existing = (on = data2.on || (data2.on = {}))[event], callback = data2.model.callback, isDef(existing) ? (Array.isArray(existing) ? -1 === existing.indexOf(callback) : existing !== callback) && (on[event] = [
                callback
            ].concat(existing)) : on[event] = callback);
            // extract props
            var propsData = /*  */ function(data, Ctor, tag) {
                // we are only extracting raw values here.
                // validation and default values are handled in the child
                // component itself.
                var propOptions = Ctor.options.props;
                if (!isUndef(propOptions)) {
                    var res = {}, attrs = data.attrs, props = data.props;
                    if (isDef(attrs) || isDef(props)) for(var key in propOptions){
                        var altKey = hyphenate(key), keyInLowerCase = key.toLowerCase();
                        key !== keyInLowerCase && attrs && hasOwn(attrs, keyInLowerCase) && tip("Prop \"" + keyInLowerCase + "\" is passed to component " + formatComponentName(tag || Ctor) + ', but the declared prop name is "' + key + '". Note that HTML attributes are case-insensitive and camelCased props need to use their kebab-case equivalents when using in-DOM templates. You should probably use "' + altKey + "\" instead of \"" + key + "\"."), checkProp(res, props, key, altKey, !0) || checkProp(res, attrs, key, altKey, !1);
                    }
                    return res;
                }
            }(data, Ctor, tag);
            // functional component
            if (isTrue(Ctor.options.functional)) return function(Ctor, propsData, data, contextVm, children) {
                var options = Ctor.options, props = {}, propOptions = options.props;
                if (isDef(propOptions)) for(var key in propOptions)props[key] = validateProp(key, propOptions, propsData || emptyObject);
                else isDef(data.attrs) && mergeProps(props, data.attrs), isDef(data.props) && mergeProps(props, data.props);
                var renderContext = new FunctionalRenderContext(data, props, children, contextVm, Ctor), vnode = options.render.call(null, renderContext._c, renderContext);
                if (vnode instanceof VNode) return cloneAndMarkFunctionalResult(vnode, data, renderContext.parent, options, renderContext);
                if (Array.isArray(vnode)) {
                    for(var vnodes = normalizeChildren(vnode) || [], res = Array(vnodes.length), i = 0; i < vnodes.length; i++)res[i] = cloneAndMarkFunctionalResult(vnodes[i], data, renderContext.parent, options, renderContext);
                    return res;
                }
            }(Ctor, propsData, data, context, children);
            // extract listeners, since these needs to be treated as
            // child component listeners instead of DOM listeners
            var listeners = data.on;
            if (// replace with listeners with .native modifier
            // so it gets processed during parent component patch.
            data.on = data.nativeOn, isTrue(Ctor.options.abstract)) {
                // abstract components do not keep anything
                // other than props & listeners & slot
                // work around flow
                var slot = data.slot;
                data = {}, slot && (data.slot = slot);
            }
            !// install component management hooks onto the placeholder node
            function(data) {
                for(var hooks = data.hook || (data.hook = {}), i = 0; i < hooksToMerge.length; i++){
                    var key = hooksToMerge[i], existing = hooks[key], toMerge = componentVNodeHooks[key];
                    existing === toMerge || existing && existing._merged || (hooks[key] = existing ? function(f1, f2) {
                        var merged = function(a, b) {
                            // flow complains about extra args which is why we use any
                            f1(a, b), f2(a, b);
                        };
                        return merged._merged = !0, merged;
                    }(toMerge, existing) : toMerge);
                }
            }(data);
            // return a placeholder vnode
            var name = Ctor.options.name || tag;
            return new VNode("vue-component-" + Ctor.cid + (name ? "-" + name : ''), data, void 0, void 0, void 0, context, {
                Ctor: Ctor,
                propsData: propsData,
                listeners: listeners,
                tag: tag,
                children: children
            }, asyncFactory);
        }
    }
    // wrapper function for providing a more flexible interface
    // without getting yelled at by flow
    function createElement(context, tag, data, children, normalizationType, alwaysNormalize) {
        var tag1, data1, children1, normalizationType1, vnode, ns, Ctor, data2;
        return (Array.isArray(data) || isPrimitive(data)) && (normalizationType = children, children = data, data = void 0), isTrue(alwaysNormalize) && (normalizationType = 2), tag1 = tag, data1 = data, children1 = children, normalizationType1 = normalizationType, isDef(data1) && isDef(data1.__ob__) ? (warn("Avoid using observed data object as vnode data: " + JSON.stringify(data1) + "\nAlways create fresh vnode data objects in each render!", context), createEmptyVNode()) : (isDef(data1) && isDef(data1.is) && (tag1 = data1.is), tag1) ? (isDef(data1) && isDef(data1.key) && !isPrimitive(data1.key) && warn("Avoid using non-primitive value as key, use string/number value instead.", context), Array.isArray(children1) && 'function' == typeof children1[0] && ((data1 = data1 || {}).scopedSlots = {
            default: children1[0]
        }, children1.length = 0), 2 === normalizationType1 ? children1 = normalizeChildren(children1) : 1 === normalizationType1 && (children1 = /*  */ // The template compiler attempts to minimize the need for normalization by
        // statically analyzing the template at compile time.
        //
        // For plain HTML markup, normalization can be completely skipped because the
        // generated render function is guaranteed to return Array<VNode>. There are
        // two cases where extra normalization is needed:
        // 1. When the children contains components - because a functional component
        // may return an Array instead of a single root. In this case, just a simple
        // normalization is needed - if any child is an Array, we flatten the whole
        // thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
        // because functional components already normalize their own children.
        function(children) {
            for(var i = 0; i < children.length; i++)if (Array.isArray(children[i])) return Array.prototype.concat.apply([], children);
            return children;
        }(children1)), 'string' == typeof tag1 ? (ns = context.$vnode && context.$vnode.ns || config.getTagNamespace(tag1), config.isReservedTag(tag1) ? (isDef(data1) && isDef(data1.nativeOn) && warn("The .native modifier for v-on is only valid on components but it was used on <" + tag1 + ">.", context), vnode = new VNode(config.parsePlatformTagName(tag1), data1, children1, void 0, void 0, context)) : // component
        vnode = (!data1 || !data1.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag1)) ? createComponent(Ctor, data1, context, children1, tag1) : new VNode(tag1, data1, children1, void 0, void 0, context)) : // direct component options / constructor
        vnode = createComponent(tag1, data1, context, children1), Array.isArray(vnode)) ? vnode : isDef(vnode) ? (isDef(ns) && function applyNS(vnode, ns, force) {
            if (vnode.ns = ns, 'foreignObject' === vnode.tag && (// use default namespace inside foreignObject
            ns = void 0, force = !0), isDef(vnode.children)) for(var i = 0, l = vnode.children.length; i < l; i++){
                var child = vnode.children[i];
                isDef(child.tag) && (isUndef(child.ns) || isTrue(force) && 'svg' !== child.tag) && applyNS(child, ns, force);
            }
        }(vnode, ns), isDef(data1) && (isObject((data2 = data1).style) && traverse(data2.style), isObject(data2.class) && traverse(data2.class)), vnode) : createEmptyVNode() : createEmptyVNode();
    }
    var currentRenderingInstance = null;
    /*  */ function ensureCtor(comp, base) {
        return (comp.__esModule || hasSymbol && 'Module' === comp[Symbol.toStringTag]) && (comp = comp.default), isObject(comp) ? base.extend(comp) : comp;
    }
    /*  */ function isAsyncPlaceholder(node) {
        return node.isComment && node.asyncFactory;
    }
    /*  */ function getFirstComponentChild(children) {
        if (Array.isArray(children)) for(var i = 0; i < children.length; i++){
            var c = children[i];
            if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) return c;
        }
    }
    function add(event, fn) {
        target.$on(event, fn);
    }
    function remove$1(event, fn) {
        target.$off(event, fn);
    }
    function createOnceHandler(event, fn) {
        var _target = target;
        return function onceHandler() {
            var res = fn.apply(null, arguments);
            null !== res && _target.$off(event, onceHandler);
        };
    }
    function updateComponentListeners(vm, listeners, oldListeners) {
        target = vm, updateListeners(listeners, oldListeners || {}, add, remove$1, createOnceHandler, vm), target = void 0;
    }
    /*  */ var activeInstance = null, isUpdatingChildComponent = !1;
    function setActiveInstance(vm) {
        var prevActiveInstance = activeInstance;
        return activeInstance = vm, function() {
            activeInstance = prevActiveInstance;
        };
    }
    function isInInactiveTree(vm) {
        for(; vm && (vm = vm.$parent);)if (vm._inactive) return !0;
        return !1;
    }
    function activateChildComponent(vm, direct) {
        if (direct) {
            if (vm._directInactive = !1, isInInactiveTree(vm)) return;
        } else if (vm._directInactive) return;
        if (vm._inactive || null === vm._inactive) {
            vm._inactive = !1;
            for(var i = 0; i < vm.$children.length; i++)activateChildComponent(vm.$children[i]);
            callHook(vm, 'activated');
        }
    }
    function callHook(vm, hook) {
        // #7573 disable dep collection when invoking lifecycle hooks
        pushTarget();
        var handlers = vm.$options[hook], info = hook + " hook";
        if (handlers) for(var i = 0, j = handlers.length; i < j; i++)invokeWithErrorHandling(handlers[i], vm, null, vm, info);
        vm._hasHookEvent && vm.$emit('hook:' + hook), popTarget();
    }
    var queue = [], activatedChildren = [], has = {}, circular = {}, waiting = !1, flushing = !1, index = 0, currentFlushTimestamp = 0, getNow = Date.now;
    // Determine what event timestamp the browser is using. Annoyingly, the
    // timestamp can either be hi-res (relative to page load) or low-res
    // (relative to UNIX epoch), so in order to compare time we have to use the
    // same timestamp type when saving the flush timestamp.
    // All IE versions use low-res event timestamps, and have problematic clock
    // implementations (#9632)
    if (inBrowser && !isIE) {
        var performance = window.performance;
        performance && 'function' == typeof performance.now && getNow() > document.createEvent('Event').timeStamp && // if the event timestamp, although evaluated AFTER the Date.now(), is
        // smaller than it, it means the event is using a hi-res timestamp,
        // and we need to use the hi-res version for event listener timestamps as
        // well.
        (getNow = function() {
            return performance.now();
        });
    }
    /**
   * Flush both queues and run the watchers.
   */ function flushSchedulerQueue() {
        // do not cache length because more watchers might be pushed
        // as we run existing watchers
        for(currentFlushTimestamp = getNow(), flushing = !0, // Sort queue before flush.
        // This ensures that:
        // 1. Components are updated from parent to child. (because parent is always
        //    created before the child)
        // 2. A component's user watchers are run before its render watcher (because
        //    user watchers are created before the render watcher)
        // 3. If a component is destroyed during a parent component's watcher run,
        //    its watchers can be skipped.
        queue.sort(function(a, b) {
            return a.id - b.id;
        }), index = 0; index < queue.length; index++)// in dev build, check and stop circular updates.
        if ((watcher = queue[index]).before && watcher.before(), has[id = watcher.id] = null, watcher.run(), null != has[id] && (circular[id] = (circular[id] || 0) + 1, circular[id] > 100)) {
            warn('You may have an infinite update loop ' + (watcher.user ? "in watcher with expression \"" + watcher.expression + "\"" : "in a component render function."), watcher.vm);
            break;
        }
        // keep copies of post queues before resetting state
        var watcher, id, activatedQueue = activatedChildren.slice(), updatedQueue = queue.slice();
        index = queue.length = activatedChildren.length = 0, has = {}, circular = {}, waiting = flushing = !1, // call component updated and activated hooks
        function(queue) {
            for(var i = 0; i < queue.length; i++)queue[i]._inactive = !0, activateChildComponent(queue[i], !0);
        }(activatedQueue), function(queue) {
            for(var i = queue.length; i--;){
                var watcher = queue[i], vm = watcher.vm;
                vm._watcher === watcher && vm._isMounted && !vm._isDestroyed && callHook(vm, 'updated');
            }
        }(updatedQueue), devtools && config.devtools && devtools.emit('flush');
    }
    /*  */ var uid$2 = 0, Watcher = function(vm, expOrFn, cb, options, isRenderWatcher) {
        this.vm = vm, isRenderWatcher && (vm._watcher = this), vm._watchers.push(this), options ? (this.deep = !!options.deep, this.user = !!options.user, this.lazy = !!options.lazy, this.sync = !!options.sync, this.before = options.before) : this.deep = this.user = this.lazy = this.sync = !1, this.cb = cb, this.id = ++uid$2, this.active = !0, this.dirty = this.lazy, this.deps = [], this.newDeps = [], this.depIds = new _Set(), this.newDepIds = new _Set(), this.expression = expOrFn.toString(), 'function' == typeof expOrFn ? this.getter = expOrFn : (this.getter = function(path) {
            if (!bailRE.test(path)) {
                var segments = path.split('.');
                return function(obj) {
                    for(var i = 0; i < segments.length; i++){
                        if (!obj) return;
                        obj = obj[segments[i]];
                    }
                    return obj;
                };
            }
        }(expOrFn), this.getter || (this.getter = noop, warn("Failed watching path: \"" + expOrFn + '" Watcher only accepts simple dot-delimited paths. For full control, use a function instead.', vm))), this.value = this.lazy ? void 0 : this.get();
    };
    /**
   * Evaluate the getter, and re-collect dependencies.
   */ Watcher.prototype.get = function() {
        pushTarget(this);
        var value, vm = this.vm;
        try {
            value = this.getter.call(vm, vm);
        } catch (e) {
            if (this.user) handleError(e, vm, "getter for watcher \"" + this.expression + "\"");
            else throw e;
        } finally{
            this.deep && traverse(value), popTarget(), this.cleanupDeps();
        }
        return value;
    }, /**
   * Add a dependency to this directive.
   */ Watcher.prototype.addDep = function(dep) {
        var id = dep.id;
        this.newDepIds.has(id) || (this.newDepIds.add(id), this.newDeps.push(dep), this.depIds.has(id) || dep.addSub(this));
    }, /**
   * Clean up for dependency collection.
   */ Watcher.prototype.cleanupDeps = function() {
        for(var i = this.deps.length; i--;){
            var dep = this.deps[i];
            this.newDepIds.has(dep.id) || dep.removeSub(this);
        }
        var tmp = this.depIds;
        this.depIds = this.newDepIds, this.newDepIds = tmp, this.newDepIds.clear(), tmp = this.deps, this.deps = this.newDeps, this.newDeps = tmp, this.newDeps.length = 0;
    }, /**
   * Subscriber interface.
   * Will be called when a dependency changes.
   */ Watcher.prototype.update = function() {
        /* istanbul ignore else */ this.lazy ? this.dirty = !0 : this.sync ? this.run() : /**
   * Push a watcher into the watcher queue.
   * Jobs with duplicate IDs will be skipped unless it's
   * pushed when the queue is being flushed.
   */ function(watcher) {
            var id = watcher.id;
            if (null == has[id]) {
                if (has[id] = !0, flushing) {
                    for(// if already flushing, splice the watcher based on its id
                    // if already past its id, it will be run next immediately.
                    var i = queue.length - 1; i > index && queue[i].id > watcher.id;)i--;
                    queue.splice(i + 1, 0, watcher);
                } else queue.push(watcher);
                // queue the flush
                if (!waiting) {
                    if (waiting = !0, !config.async) {
                        flushSchedulerQueue();
                        return;
                    }
                    nextTick(flushSchedulerQueue);
                }
            }
        }(this);
    }, /**
   * Scheduler job interface.
   * Will be called by the scheduler.
   */ Watcher.prototype.run = function() {
        if (this.active) {
            var value = this.get();
            if (value !== this.value || // Deep watchers and watchers on Object/Arrays should fire even
            // when the value is the same, because the value may
            // have mutated.
            isObject(value) || this.deep) {
                // set new value
                var oldValue = this.value;
                if (this.value = value, this.user) try {
                    this.cb.call(this.vm, value, oldValue);
                } catch (e) {
                    handleError(e, this.vm, "callback for watcher \"" + this.expression + "\"");
                }
                else this.cb.call(this.vm, value, oldValue);
            }
        }
    }, /**
   * Evaluate the value of the watcher.
   * This only gets called for lazy watchers.
   */ Watcher.prototype.evaluate = function() {
        this.value = this.get(), this.dirty = !1;
    }, /**
   * Depend on all deps collected by this watcher.
   */ Watcher.prototype.depend = function() {
        for(var i = this.deps.length; i--;)this.deps[i].depend();
    }, /**
   * Remove self from all dependencies' subscriber list.
   */ Watcher.prototype.teardown = function() {
        if (this.active) {
            // remove self from vm's watcher list
            // this is a somewhat expensive operation so we skip it
            // if the vm is being destroyed.
            this.vm._isBeingDestroyed || remove(this.vm._watchers, this);
            for(var i = this.deps.length; i--;)this.deps[i].removeSub(this);
            this.active = !1;
        }
    };
    /*  */ var sharedPropertyDefinition = {
        enumerable: !0,
        configurable: !0,
        get: noop,
        set: noop
    };
    function proxy(target, sourceKey, key) {
        sharedPropertyDefinition.get = function() {
            return this[sourceKey][key];
        }, sharedPropertyDefinition.set = function(val) {
            this[sourceKey][key] = val;
        }, Object.defineProperty(target, key, sharedPropertyDefinition);
    }
    var computedWatcherOptions = {
        lazy: !0
    };
    function defineComputed(target, key, userDef) {
        var shouldCache = !isServerRendering();
        'function' == typeof userDef ? (sharedPropertyDefinition.get = shouldCache ? createComputedGetter(key) : createGetterInvoker(userDef), sharedPropertyDefinition.set = noop) : (sharedPropertyDefinition.get = userDef.get ? shouldCache && !1 !== userDef.cache ? createComputedGetter(key) : createGetterInvoker(userDef.get) : noop, sharedPropertyDefinition.set = userDef.set || noop), sharedPropertyDefinition.set === noop && (sharedPropertyDefinition.set = function() {
            warn("Computed property \"" + key + "\" was assigned to but it has no setter.", this);
        }), Object.defineProperty(target, key, sharedPropertyDefinition);
    }
    function createComputedGetter(key) {
        return function() {
            var watcher = this._computedWatchers && this._computedWatchers[key];
            if (watcher) return watcher.dirty && watcher.evaluate(), Dep.target && watcher.depend(), watcher.value;
        };
    }
    function createGetterInvoker(fn) {
        return function() {
            return fn.call(this, this);
        };
    }
    function createWatcher(vm, expOrFn, handler, options) {
        return isPlainObject(handler) && (options = handler, handler = handler.handler), 'string' == typeof handler && (handler = vm[handler]), vm.$watch(expOrFn, handler, options);
    }
    /*  */ var uid$3 = 0;
    function resolveConstructorOptions(Ctor) {
        var options = Ctor.options;
        if (Ctor.super) {
            var superOptions = resolveConstructorOptions(Ctor.super);
            if (superOptions !== Ctor.superOptions) {
                // super option changed,
                // need to resolve new options.
                Ctor.superOptions = superOptions;
                // check if there are any late-modified/attached options (#4976)
                var modifiedOptions = function(Ctor) {
                    var modified, latest = Ctor.options, sealed = Ctor.sealedOptions;
                    for(var key in latest)latest[key] !== sealed[key] && (modified || (modified = {}), modified[key] = latest[key]);
                    return modified;
                }(Ctor);
                modifiedOptions && extend(Ctor.extendOptions, modifiedOptions), (options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions)).name && (options.components[options.name] = Ctor);
            }
        }
        return options;
    }
    function Vue1(options) {
        this instanceof Vue1 || warn('Vue is a constructor and should be called with the `new` keyword'), this._init(options);
    }
    /*  */ function getComponentName(opts) {
        return opts && (opts.Ctor.options.name || opts.tag);
    }
    function matches(pattern, name) {
        return Array.isArray(pattern) ? pattern.indexOf(name) > -1 : 'string' == typeof pattern ? pattern.split(',').indexOf(name) > -1 : !!isRegExp(pattern) && pattern.test(name);
    }
    function pruneCache(keepAliveInstance, filter) {
        var cache = keepAliveInstance.cache, keys = keepAliveInstance.keys, _vnode = keepAliveInstance._vnode;
        for(var key in cache){
            var cachedNode = cache[key];
            if (cachedNode) {
                var name = getComponentName(cachedNode.componentOptions);
                name && !filter(name) && pruneCacheEntry(cache, key, keys, _vnode);
            }
        }
    }
    function pruneCacheEntry(cache, key, keys, current) {
        var cached$$1 = cache[key];
        cached$$1 && (!current || cached$$1.tag !== current.tag) && cached$$1.componentInstance.$destroy(), cache[key] = null, remove(keys, key);
    }
    Vue1.prototype._init = function(options) {
        var startTag, endTag, listeners, vm, options1, parentVnode, renderContext, parentData, opts, provide, opts1, parentVnode1, vnodeComponentOptions, vm1, result;
        // a uid
        this._uid = uid$3++, config.performance && mark && (startTag = "vue-perf-start:" + this._uid, endTag = "vue-perf-end:" + this._uid, mark(startTag)), // a flag to avoid this being observed
        this._isVue = !0, options && options._isComponent ? (opts1 = this.$options = Object.create(this.constructor.options), parentVnode1 = options._parentVnode, opts1.parent = options.parent, opts1._parentVnode = parentVnode1, vnodeComponentOptions = parentVnode1.componentOptions, opts1.propsData = vnodeComponentOptions.propsData, opts1._parentListeners = vnodeComponentOptions.listeners, opts1._renderChildren = vnodeComponentOptions.children, opts1._componentTag = vnodeComponentOptions.tag, options.render && (opts1.render = options.render, opts1.staticRenderFns = options.staticRenderFns)) : this.$options = mergeOptions(resolveConstructorOptions(this.constructor), options || {}, this), initProxy(this), // expose real self
        this._self = this, function(vm) {
            var options = vm.$options, parent = options.parent;
            if (parent && !options.abstract) {
                for(; parent.$options.abstract && parent.$parent;)parent = parent.$parent;
                parent.$children.push(vm);
            }
            vm.$parent = parent, vm.$root = parent ? parent.$root : vm, vm.$children = [], vm.$refs = {}, vm._watcher = null, vm._inactive = null, vm._directInactive = !1, vm._isMounted = !1, vm._isDestroyed = !1, vm._isBeingDestroyed = !1;
        }(this), this._events = Object.create(null), this._hasHookEvent = !1, (listeners = this.$options._parentListeners) && updateComponentListeners(this, listeners), vm = this, vm._vnode = null, vm._staticTrees = null, options1 = vm.$options, renderContext = (parentVnode = vm.$vnode = options1._parentVnode) && parentVnode.context, vm.$slots = resolveSlots(options1._renderChildren, renderContext), vm.$scopedSlots = emptyObject, // bind the createElement fn to this instance
        // so that we get proper render context inside it.
        // args order: tag, data, children, normalizationType, alwaysNormalize
        // internal version is used by render functions compiled from templates
        vm._c = function(a, b, c, d) {
            return createElement(vm, a, b, c, d, !1);
        }, // normalization is always applied for the public version, used in
        // user-written render functions.
        vm.$createElement = function(a, b, c, d) {
            return createElement(vm, a, b, c, d, !0);
        }, defineReactive$$1(vm, '$attrs', (parentData = parentVnode && parentVnode.data) && parentData.attrs || emptyObject, function() {
            isUpdatingChildComponent || warn("$attrs is readonly.", vm);
        }, !0), defineReactive$$1(vm, '$listeners', options1._parentListeners || emptyObject, function() {
            isUpdatingChildComponent || warn("$listeners is readonly.", vm);
        }, !0), callHook(this, 'beforeCreate'), vm1 = this, (result = resolveInject(vm1.$options.inject, vm1)) && (shouldObserve = !1, Object.keys(result).forEach(function(key) {
            defineReactive$$1(vm1, key, result[key], function() {
                warn('Avoid mutating an injected value directly since the changes will be overwritten whenever the provided component re-renders. injection being mutated: "' + key + "\"", vm1);
            });
        }), shouldObserve = !0), this._watchers = [], (opts = this.$options).props && function(vm, propsOptions) {
            var propsData = vm.$options.propsData || {}, props = vm._props = {}, keys = vm.$options._propKeys = [], isRoot = !vm.$parent;
            // root instance props should be converted
            isRoot || (shouldObserve = !1);
            var loop = function(key) {
                keys.push(key);
                var value = validateProp(key, propsOptions, propsData, vm), hyphenatedKey = hyphenate(key);
                (isReservedAttribute(hyphenatedKey) || config.isReservedAttr(hyphenatedKey)) && warn("\"" + hyphenatedKey + "\" is a reserved attribute and cannot be used as component prop.", vm), defineReactive$$1(props, key, value, function() {
                    isRoot || isUpdatingChildComponent || warn("Avoid mutating a prop directly since the value will be overwritten whenever the parent component re-renders. Instead, use a data or computed property based on the prop's value. Prop being mutated: \"" + key + "\"", vm);
                }), key in vm || proxy(vm, "_props", key);
            };
            for(var key in propsOptions)loop(key);
            shouldObserve = !0;
        }(this, opts.props), opts.methods && function(vm, methods) {
            var props = vm.$options.props;
            for(var key in methods)'function' != typeof methods[key] && warn("Method \"" + key + "\" has type \"" + typeof methods[key] + '" in the component definition. Did you reference the function correctly?', vm), props && hasOwn(props, key) && warn("Method \"" + key + "\" has already been defined as a prop.", vm), key in vm && isReserved(key) && warn("Method \"" + key + '" conflicts with an existing Vue instance method. Avoid defining component methods that start with _ or $.'), vm[key] = 'function' != typeof methods[key] ? noop : bind(methods[key], vm);
        }(this, opts.methods), opts.data ? function(vm) {
            var data = vm.$options.data;
            isPlainObject(data = vm._data = 'function' == typeof data ? function(data, vm) {
                // #7573 disable dep collection when invoking data getters
                pushTarget();
                try {
                    return data.call(vm, vm);
                } catch (e) {
                    return handleError(e, vm, "data()"), {};
                } finally{
                    popTarget();
                }
            }(data, vm) : data || {}) || (data = {}, warn("data functions should return an object:\nhttps://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function", vm));
            for(// proxy data on instance
            var keys = Object.keys(data), props = vm.$options.props, methods = vm.$options.methods, i = keys.length; i--;){
                var key = keys[i];
                methods && hasOwn(methods, key) && warn("Method \"" + key + "\" has already been defined as a data property.", vm), props && hasOwn(props, key) ? warn("The data property \"" + key + '" is already declared as a prop. Use prop default value instead.', vm) : isReserved(key) || proxy(vm, "_data", key);
            }
            // observe data
            observe(data, !0);
        }(this) : observe(this._data = {}, !0), opts.computed && function(vm, computed) {
            // $flow-disable-line
            var watchers = vm._computedWatchers = Object.create(null), isSSR = isServerRendering();
            for(var key in computed){
                var userDef = computed[key], getter = 'function' == typeof userDef ? userDef : userDef.get;
                null == getter && warn("Getter is missing for computed property \"" + key + "\".", vm), isSSR || // create internal watcher for the computed property.
                (watchers[key] = new Watcher(vm, getter || noop, noop, computedWatcherOptions)), key in vm ? key in vm.$data ? warn("The computed property \"" + key + "\" is already defined in data.", vm) : vm.$options.props && key in vm.$options.props && warn("The computed property \"" + key + "\" is already defined as a prop.", vm) : defineComputed(vm, key, userDef);
            }
        }(this, opts.computed), opts.watch && opts.watch !== nativeWatch && function(vm, watch) {
            for(var key in watch){
                var handler = watch[key];
                if (Array.isArray(handler)) for(var i = 0; i < handler.length; i++)createWatcher(vm, key, handler[i]);
                else createWatcher(vm, key, handler);
            }
        }(this, opts.watch), (provide = this.$options.provide) && (this._provided = 'function' == typeof provide ? provide.call(this) : provide), callHook(this, 'created'), config.performance && mark && (this._name = formatComponentName(this, !1), mark(endTag), measure("vue " + this._name + " init", startTag, endTag)), this.$options.el && this.$mount(this.$options.el);
    }, (dataDef = {}).get = function() {
        return this._data;
    }, (propsDef = {}).get = function() {
        return this._props;
    }, dataDef.set = function() {
        warn("Avoid replacing instance root $data. Use nested data properties instead.", this);
    }, propsDef.set = function() {
        warn("$props is readonly.", this);
    }, Object.defineProperty(Vue1.prototype, '$data', dataDef), Object.defineProperty(Vue1.prototype, '$props', propsDef), Vue1.prototype.$set = set, Vue1.prototype.$delete = del, Vue1.prototype.$watch = function(expOrFn, cb, options) {
        if (isPlainObject(cb)) return createWatcher(this, expOrFn, cb, options);
        (options = options || {}).user = !0;
        var watcher = new Watcher(this, expOrFn, cb, options);
        if (options.immediate) try {
            cb.call(this, watcher.value);
        } catch (error) {
            handleError(error, this, "callback for immediate watcher \"" + watcher.expression + "\"");
        }
        return function() {
            watcher.teardown();
        };
    }, hookRE = /^hook:/, Vue1.prototype.$on = function(event, fn) {
        if (Array.isArray(event)) for(var i = 0, l = event.length; i < l; i++)this.$on(event[i], fn);
        else (this._events[event] || (this._events[event] = [])).push(fn), hookRE.test(event) && (this._hasHookEvent = !0);
        return this;
    }, Vue1.prototype.$once = function(event, fn) {
        var vm = this;
        function on() {
            vm.$off(event, on), fn.apply(vm, arguments);
        }
        return on.fn = fn, vm.$on(event, on), vm;
    }, Vue1.prototype.$off = function(event, fn) {
        // all
        if (!arguments.length) return this._events = Object.create(null), this;
        // array of events
        if (Array.isArray(event)) {
            for(var cb, i$1 = 0, l = event.length; i$1 < l; i$1++)this.$off(event[i$1], fn);
            return this;
        }
        // specific event
        var cbs = this._events[event];
        if (!cbs) return this;
        if (!fn) return this._events[event] = null, this;
        for(var i = cbs.length; i--;)if ((cb = cbs[i]) === fn || cb.fn === fn) {
            cbs.splice(i, 1);
            break;
        }
        return this;
    }, Vue1.prototype.$emit = function(event) {
        var lowerCaseEvent = event.toLowerCase();
        lowerCaseEvent !== event && this._events[lowerCaseEvent] && tip("Event \"" + lowerCaseEvent + "\" is emitted in component " + formatComponentName(this) + " but the handler is registered for \"" + event + '". Note that HTML attributes are case-insensitive and you cannot use v-on to listen to camelCase events when using in-DOM templates. You should probably use "' + hyphenate(event) + "\" instead of \"" + event + "\".");
        var cbs = this._events[event];
        if (cbs) {
            cbs = cbs.length > 1 ? toArray(cbs) : cbs;
            for(var args = toArray(arguments, 1), info = "event handler for \"" + event + "\"", i = 0, l = cbs.length; i < l; i++)invokeWithErrorHandling(cbs[i], this, args, this, info);
        }
        return this;
    }, Vue1.prototype._update = function(vnode, hydrating) {
        var prevEl = this.$el, prevVnode = this._vnode, restoreActiveInstance = setActiveInstance(this);
        this._vnode = vnode, prevVnode ? // updates
        this.$el = this.__patch__(prevVnode, vnode) : // initial render
        this.$el = this.__patch__(this.$el, vnode, hydrating, !1), restoreActiveInstance(), prevEl && (prevEl.__vue__ = null), this.$el && (this.$el.__vue__ = this), this.$vnode && this.$parent && this.$vnode === this.$parent._vnode && (this.$parent.$el = this.$el);
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
    }, Vue1.prototype.$forceUpdate = function() {
        this._watcher && this._watcher.update();
    }, Vue1.prototype.$destroy = function() {
        if (!this._isBeingDestroyed) {
            callHook(this, 'beforeDestroy'), this._isBeingDestroyed = !0;
            // remove self from parent
            var parent = this.$parent;
            !parent || parent._isBeingDestroyed || this.$options.abstract || remove(parent.$children, this), this._watcher && this._watcher.teardown();
            for(var i = this._watchers.length; i--;)this._watchers[i].teardown();
            this._data.__ob__ && this._data.__ob__.vmCount--, // call the last hook...
            this._isDestroyed = !0, // invoke destroy hooks on current rendered tree
            this.__patch__(this._vnode, null), // fire destroyed hook
            callHook(this, 'destroyed'), // turn off all instance listeners.
            this.$off(), this.$el && (this.$el.__vue__ = null), this.$vnode && (this.$vnode.parent = null);
        }
    }, // install runtime convenience helpers
    installRenderHelpers(Vue1.prototype), Vue1.prototype.$nextTick = function(fn) {
        return nextTick(fn, this);
    }, Vue1.prototype._render = function() {
        var vnode, ref = this.$options, render = ref.render, _parentVnode = ref._parentVnode;
        _parentVnode && (this.$scopedSlots = normalizeScopedSlots(_parentVnode.data.scopedSlots, this.$slots, this.$scopedSlots)), // set parent vnode. this allows render functions to have access
        // to the data on the placeholder node.
        this.$vnode = _parentVnode;
        try {
            // There's no need to maintain a stack because all render fns are called
            // separately from one another. Nested component's render fns are called
            // when parent component is patched.
            currentRenderingInstance = this, vnode = render.call(this._renderProxy, this.$createElement);
        } catch (e) {
            // return error render result,
            // or previous vnode to prevent render error causing blank component
            /* istanbul ignore else */ if (handleError(e, this, "render"), this.$options.renderError) try {
                vnode = this.$options.renderError.call(this._renderProxy, this.$createElement, e);
            } catch (e) {
                handleError(e, this, "renderError"), vnode = this._vnode;
            }
            else vnode = this._vnode;
        } finally{
            currentRenderingInstance = null;
        }
        return Array.isArray(vnode) && 1 === vnode.length && (vnode = vnode[0]), vnode instanceof VNode || (Array.isArray(vnode) && warn("Multiple root nodes returned from render function. Render function should return a single root node.", this), vnode = createEmptyVNode()), // set parent
        vnode.parent = _parentVnode, vnode;
    };
    var patternTypes = [
        String,
        RegExp,
        Array
    ], builtInComponents = {
        KeepAlive: {
            name: 'keep-alive',
            abstract: !0,
            props: {
                include: patternTypes,
                exclude: patternTypes,
                max: [
                    String,
                    Number
                ]
            },
            created: function() {
                this.cache = Object.create(null), this.keys = [];
            },
            destroyed: function() {
                for(var key in this.cache)pruneCacheEntry(this.cache, key, this.keys);
            },
            mounted: function() {
                var this$1 = this;
                this.$watch('include', function(val) {
                    pruneCache(this$1, function(name) {
                        return matches(val, name);
                    });
                }), this.$watch('exclude', function(val) {
                    pruneCache(this$1, function(name) {
                        return !matches(val, name);
                    });
                });
            },
            render: function() {
                var slot = this.$slots.default, vnode = getFirstComponentChild(slot), componentOptions = vnode && vnode.componentOptions;
                if (componentOptions) {
                    // check pattern
                    var name = getComponentName(componentOptions), include = this.include, exclude = this.exclude;
                    if (// not included
                    include && (!name || !matches(include, name)) || // excluded
                    exclude && name && matches(exclude, name)) return vnode;
                    var cache = this.cache, keys = this.keys, key = null == vnode.key ? componentOptions.Ctor.cid + (componentOptions.tag ? "::" + componentOptions.tag : '') : vnode.key;
                    cache[key] ? (vnode.componentInstance = cache[key].componentInstance, // make current key freshest
                    remove(keys, key), keys.push(key)) : (cache[key] = vnode, keys.push(key), this.max && keys.length > parseInt(this.max) && pruneCacheEntry(cache, keys[0], keys, this._vnode)), vnode.data.keepAlive = !0;
                }
                return vnode || slot && slot[0];
            }
        }
    };
    Vue = Vue1, (configDef = {}).get = function() {
        return config;
    }, configDef.set = function() {
        warn('Do not replace the Vue.config object, set individual fields instead.');
    }, Object.defineProperty(Vue, 'config', configDef), // exposed util methods.
    // NOTE: these are not considered part of the public API - avoid relying on
    // them unless you are aware of the risk.
    Vue.util = {
        warn: warn,
        extend: extend,
        mergeOptions: mergeOptions,
        defineReactive: defineReactive$$1
    }, Vue.set = set, Vue.delete = del, Vue.nextTick = nextTick, // 2.6 explicit observable API
    Vue.observable = function(obj) {
        return observe(obj), obj;
    }, Vue.options = Object.create(null), ASSET_TYPES.forEach(function(type) {
        Vue.options[type + 's'] = Object.create(null);
    }), // this is used to identify the "base" constructor to extend all plain-object
    // components with in Weex's multi-instance scenarios.
    Vue.options._base = Vue, extend(Vue.options.components, builtInComponents), Vue.use = function(plugin) {
        var installedPlugins = this._installedPlugins || (this._installedPlugins = []);
        if (installedPlugins.indexOf(plugin) > -1) return this;
        // additional parameters
        var args = toArray(arguments, 1);
        return args.unshift(this), 'function' == typeof plugin.install ? plugin.install.apply(plugin, args) : 'function' == typeof plugin && plugin.apply(null, args), installedPlugins.push(plugin), this;
    }, Vue.mixin = function(mixin) {
        return this.options = mergeOptions(this.options, mixin), this;
    }, /**
     * Each instance constructor, including Vue, has a unique
     * cid. This enables us to create wrapped "child
     * constructors" for prototypal inheritance and cache them.
     */ Vue.cid = 0, cid = 1, /**
     * Class inheritance
     */ Vue.extend = function(extendOptions) {
        extendOptions = extendOptions || {};
        var Super = this, SuperId = Super.cid, cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
        if (cachedCtors[SuperId]) return cachedCtors[SuperId];
        var name = extendOptions.name || Super.options.name;
        name && validateComponentName(name);
        var Sub = function(options) {
            this._init(options);
        };
        return Sub.prototype = Object.create(Super.prototype), Sub.prototype.constructor = Sub, Sub.cid = cid++, Sub.options = mergeOptions(Super.options, extendOptions), Sub.super = Super, Sub.options.props && function(Comp) {
            var props = Comp.options.props;
            for(var key in props)proxy(Comp.prototype, "_props", key);
        }(Sub), Sub.options.computed && function(Comp) {
            var computed = Comp.options.computed;
            for(var key in computed)defineComputed(Comp.prototype, key, computed[key]);
        }(Sub), // allow further extension/mixin/plugin usage
        Sub.extend = Super.extend, Sub.mixin = Super.mixin, Sub.use = Super.use, // create asset registers, so extended classes
        // can have their private assets too.
        ASSET_TYPES.forEach(function(type) {
            Sub[type] = Super[type];
        }), name && (Sub.options.components[name] = Sub), // keep a reference to the super options at extension time.
        // later at instantiation we can check if Super's options have
        // been updated.
        Sub.superOptions = Super.options, Sub.extendOptions = extendOptions, Sub.sealedOptions = extend({}, Sub.options), // cache constructor
        cachedCtors[SuperId] = Sub, Sub;
    }, /**
     * Create asset registration methods.
     */ ASSET_TYPES.forEach(function(type) {
        Vue[type] = function(id, definition) {
            return definition ? ('component' === type && validateComponentName(id), 'component' === type && isPlainObject(definition) && (definition.name = definition.name || id, definition = this.options._base.extend(definition)), 'directive' === type && 'function' == typeof definition && (definition = {
                bind: definition,
                update: definition
            }), this.options[type + 's'][id] = definition, definition) : this.options[type + 's'][id];
        };
    }), Object.defineProperty(Vue1.prototype, '$isServer', {
        get: isServerRendering
    }), Object.defineProperty(Vue1.prototype, '$ssrContext', {
        get: function() {
            /* istanbul ignore next */ return this.$vnode && this.$vnode.ssrContext;
        }
    }), // expose FunctionalRenderContext for ssr runtime helper installation
    Object.defineProperty(Vue1, 'FunctionalRenderContext', {
        value: FunctionalRenderContext
    }), Vue1.version = '2.6.12';
    /*  */ // these are reserved for web because they are directly compiled away
    // during template compilation
    var isReservedAttr = makeMap('style,class'), acceptValue = makeMap('input,textarea,option,select,progress'), mustUseProp = function(tag, type, attr) {
        return 'value' === attr && acceptValue(tag) && 'button' !== type || 'selected' === attr && 'option' === tag || 'checked' === attr && 'input' === tag || 'muted' === attr && 'video' === tag;
    }, isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck'), isValidContentEditableValue = makeMap('events,caret,typing,plaintext-only'), isBooleanAttr = makeMap("allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,default,defaultchecked,defaultmuted,defaultselected,defer,disabled,enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,required,reversed,scoped,seamless,selected,sortable,translate,truespeed,typemustmatch,visible"), xlinkNS = 'http://www.w3.org/1999/xlink', isXlink = function(name) {
        return ':' === name.charAt(5) && 'xlink' === name.slice(0, 5);
    }, getXlinkProp = function(name) {
        return isXlink(name) ? name.slice(6, name.length) : '';
    }, isFalsyAttrValue = function(val) {
        return null == val || !1 === val;
    };
    function mergeClassData(child, parent) {
        return {
            staticClass: concat(child.staticClass, parent.staticClass),
            class: isDef(child.class) ? [
                child.class,
                parent.class
            ] : parent.class
        };
    }
    function concat(a, b) {
        return a ? b ? a + ' ' + b : a : b || '';
    }
    function stringifyClass(value) {
        return Array.isArray(value) ? function(value) {
            for(var stringified, res = '', i = 0, l = value.length; i < l; i++)isDef(stringified = stringifyClass(value[i])) && '' !== stringified && (res && (res += ' '), res += stringified);
            return res;
        }(value) : isObject(value) ? function(value) {
            var res = '';
            for(var key in value)value[key] && (res && (res += ' '), res += key);
            return res;
        }(value) : 'string' == typeof value ? value : '';
    }
    /*  */ var namespaceMap = {
        svg: 'http://www.w3.org/2000/svg',
        math: 'http://www.w3.org/1998/Math/MathML'
    }, isHTMLTag = makeMap("html,body,base,head,link,meta,style,title,address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,menuitem,summary,content,element,shadow,template,blockquote,iframe,tfoot"), isSVG = makeMap("svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view", !0), isReservedTag = function(tag) {
        return isHTMLTag(tag) || isSVG(tag);
    };
    function getTagNamespace(tag) {
        return isSVG(tag) ? 'svg' : 'math' === tag ? 'math' : void 0;
    }
    var unknownElementCache = Object.create(null), isTextInputType = makeMap('text,number,password,search,email,tel,url');
    /*  */ /**
   * Query an element selector if it's not an element already.
   */ function query(el) {
        return 'string' != typeof el ? el : document.querySelector(el) || (warn('Cannot find element: ' + el), document.createElement('div'));
    }
    var nodeOps = /*#__PURE__*/ Object.freeze({
        createElement: /*  */ function(tagName, vnode) {
            var elm = document.createElement(tagName);
            return 'select' !== tagName || vnode.data && vnode.data.attrs && void 0 !== vnode.data.attrs.multiple && elm.setAttribute('multiple', 'multiple'), elm;
        },
        createElementNS: function(namespace, tagName) {
            return document.createElementNS(namespaceMap[namespace], tagName);
        },
        createTextNode: function(text) {
            return document.createTextNode(text);
        },
        createComment: function(text) {
            return document.createComment(text);
        },
        insertBefore: function(parentNode, newNode, referenceNode) {
            parentNode.insertBefore(newNode, referenceNode);
        },
        removeChild: function(node, child) {
            node.removeChild(child);
        },
        appendChild: function(node, child) {
            node.appendChild(child);
        },
        parentNode: function(node) {
            return node.parentNode;
        },
        nextSibling: function(node) {
            return node.nextSibling;
        },
        tagName: function(node) {
            return node.tagName;
        },
        setTextContent: function(node, text) {
            node.textContent = text;
        },
        setStyleScope: function(node, scopeId) {
            node.setAttribute(scopeId, '');
        }
    });
    function registerRef(vnode, isRemoval) {
        var key = vnode.data.ref;
        if (isDef(key)) {
            var vm = vnode.context, ref = vnode.componentInstance || vnode.elm, refs = vm.$refs;
            isRemoval ? Array.isArray(refs[key]) ? remove(refs[key], ref) : refs[key] === ref && (refs[key] = void 0) : vnode.data.refInFor ? Array.isArray(refs[key]) ? 0 > refs[key].indexOf(ref) && // $flow-disable-line
            refs[key].push(ref) : refs[key] = [
                ref
            ] : refs[key] = ref;
        }
    }
    /**
   * Virtual DOM patching algorithm based on Snabbdom by
   * Simon Friis Vindum (@paldepind)
   * Licensed under the MIT License
   * https://github.com/paldepind/snabbdom/blob/master/LICENSE
   *
   * modified by Evan You (@yyx990803)
   *
   * Not type-checking this because this file is perf-critical and the cost
   * of making flow understand it is not worth it.
   */ var emptyNode = new VNode('', {}, []), hooks = [
        'create',
        'activate',
        'update',
        'remove',
        'destroy'
    ];
    function sameVnode(a, b) {
        return a.key === b.key && (a.tag === b.tag && a.isComment === b.isComment && isDef(a.data) === isDef(b.data) && function(a, b) {
            if ('input' !== a.tag) return !0;
            var i, typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type, typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type;
            return typeA === typeB || isTextInputType(typeA) && isTextInputType(typeB);
        }(a, b) || isTrue(a.isAsyncPlaceholder) && a.asyncFactory === b.asyncFactory && isUndef(b.asyncFactory.error));
    }
    function updateDirectives(oldVnode, vnode) {
        (oldVnode.data.directives || vnode.data.directives) && function(oldVnode, vnode) {
            var key, oldDir, dir, isCreate = oldVnode === emptyNode, isDestroy = vnode === emptyNode, oldDirs = normalizeDirectives$1(oldVnode.data.directives, oldVnode.context), newDirs = normalizeDirectives$1(vnode.data.directives, vnode.context), dirsWithInsert = [], dirsWithPostpatch = [];
            for(key in newDirs)oldDir = oldDirs[key], dir = newDirs[key], oldDir ? (// existing directive, update
            dir.oldValue = oldDir.value, dir.oldArg = oldDir.arg, callHook$1(dir, 'update', vnode, oldVnode), dir.def && dir.def.componentUpdated && dirsWithPostpatch.push(dir)) : (// new directive, bind
            callHook$1(dir, 'bind', vnode, oldVnode), dir.def && dir.def.inserted && dirsWithInsert.push(dir));
            if (dirsWithInsert.length) {
                var callInsert = function() {
                    for(var i = 0; i < dirsWithInsert.length; i++)callHook$1(dirsWithInsert[i], 'inserted', vnode, oldVnode);
                };
                isCreate ? mergeVNodeHook(vnode, 'insert', callInsert) : callInsert();
            }
            if (dirsWithPostpatch.length && mergeVNodeHook(vnode, 'postpatch', function() {
                for(var i = 0; i < dirsWithPostpatch.length; i++)callHook$1(dirsWithPostpatch[i], 'componentUpdated', vnode, oldVnode);
            }), !isCreate) for(key in oldDirs)newDirs[key] || // no longer present, unbind
            callHook$1(oldDirs[key], 'unbind', oldVnode, oldVnode, isDestroy);
        }(oldVnode, vnode);
    }
    var emptyModifiers = Object.create(null);
    function normalizeDirectives$1(dirs, vm) {
        var i, dir, res = Object.create(null);
        if (!dirs) // $flow-disable-line
        return res;
        for(i = 0; i < dirs.length; i++)(dir = dirs[i]).modifiers || // $flow-disable-line
        (dir.modifiers = emptyModifiers), res[dir.rawName || dir.name + "." + Object.keys(dir.modifiers || {}).join('.')] = dir, dir.def = resolveAsset(vm.$options, 'directives', dir.name, !0);
        // $flow-disable-line
        return res;
    }
    function callHook$1(dir, hook, vnode, oldVnode, isDestroy) {
        var fn = dir.def && dir.def[hook];
        if (fn) try {
            fn(vnode.elm, dir, vnode, oldVnode, isDestroy);
        } catch (e) {
            handleError(e, vnode.context, "directive " + dir.name + " " + hook + " hook");
        }
    }
    var baseModules = [
        {
            create: function(_, vnode) {
                registerRef(vnode);
            },
            update: function(oldVnode, vnode) {
                oldVnode.data.ref !== vnode.data.ref && (registerRef(oldVnode, !0), registerRef(vnode));
            },
            destroy: function(vnode) {
                registerRef(vnode, !0);
            }
        },
        {
            create: updateDirectives,
            update: updateDirectives,
            destroy: function(vnode) {
                updateDirectives(vnode, emptyNode);
            }
        }
    ];
    /*  */ function updateAttrs(oldVnode, vnode) {
        var key, cur, opts = vnode.componentOptions;
        if (!(isDef(opts) && !1 === opts.Ctor.options.inheritAttrs || isUndef(oldVnode.data.attrs) && isUndef(vnode.data.attrs))) {
            var elm = vnode.elm, oldAttrs = oldVnode.data.attrs || {}, attrs = vnode.data.attrs || {};
            for(key in isDef(attrs.__ob__) && (attrs = vnode.data.attrs = extend({}, attrs)), attrs)cur = attrs[key], oldAttrs[key] !== cur && setAttr(elm, key, cur);
            for(key in (isIE || isEdge) && attrs.value !== oldAttrs.value && setAttr(elm, 'value', attrs.value), oldAttrs)isUndef(attrs[key]) && (isXlink(key) ? elm.removeAttributeNS(xlinkNS, getXlinkProp(key)) : isEnumeratedAttr(key) || elm.removeAttribute(key));
        }
    }
    function setAttr(el, key, value) {
        if (el.tagName.indexOf('-') > -1) baseSetAttr(el, key, value);
        else if (isBooleanAttr(key)) // set attribute for blank value
        // e.g. <option disabled>Select one</option>
        isFalsyAttrValue(value) ? el.removeAttribute(key) : (// technically allowfullscreen is a boolean attribute for <iframe>,
        // but Flash expects a value of "true" when used on <embed> tag
        value = 'allowfullscreen' === key && 'EMBED' === el.tagName ? 'true' : key, el.setAttribute(key, value));
        else if (isEnumeratedAttr(key)) {
            var value1;
            el.setAttribute(key, isFalsyAttrValue(value1 = value) || 'false' === value1 ? 'false' : 'contenteditable' === key && isValidContentEditableValue(value1) ? value1 : 'true');
        } else isXlink(key) ? isFalsyAttrValue(value) ? el.removeAttributeNS(xlinkNS, getXlinkProp(key)) : el.setAttributeNS(xlinkNS, key, value) : baseSetAttr(el, key, value);
    }
    function baseSetAttr(el, key, value) {
        if (isFalsyAttrValue(value)) el.removeAttribute(key);
        else {
            // #7138: IE10 & 11 fires input event when setting placeholder on
            // <textarea>... block the first input event and remove the blocker
            // immediately.
            /* istanbul ignore if */ if (isIE && !isIE9 && 'TEXTAREA' === el.tagName && 'placeholder' === key && '' !== value && !el.__ieph) {
                var blocker = function(e) {
                    e.stopImmediatePropagation(), el.removeEventListener('input', blocker);
                };
                el.addEventListener('input', blocker), // $flow-disable-line
                el.__ieph = !0;
            }
            el.setAttribute(key, value);
        }
    }
    /*  */ function updateClass(oldVnode, vnode) {
        var el = vnode.elm, data = vnode.data, oldData = oldVnode.data;
        if (!(isUndef(data.staticClass) && isUndef(data.class) && (isUndef(oldData) || isUndef(oldData.staticClass) && isUndef(oldData.class)))) {
            var cls = /*  */ function(vnode) {
                for(var staticClass, dynamicClass, data = vnode.data, parentNode = vnode, childNode = vnode; isDef(childNode.componentInstance);)(childNode = childNode.componentInstance._vnode) && childNode.data && (data = mergeClassData(childNode.data, data));
                for(; isDef(parentNode = parentNode.parent);)parentNode && parentNode.data && (data = mergeClassData(data, parentNode.data));
                return staticClass = data.staticClass, dynamicClass = data.class, isDef(staticClass) || isDef(dynamicClass) ? concat(staticClass, stringifyClass(dynamicClass)) : '';
            }(vnode), transitionClass = el._transitionClasses;
            isDef(transitionClass) && (cls = concat(cls, stringifyClass(transitionClass))), cls !== el._prevClass && (el.setAttribute('class', cls), el._prevClass = cls);
        }
    }
    /*  */ var validDivisionCharRE = /[\w).+\-_$\]]/;
    function parseFilters(exp) {
        var c, prev, i, expression, filters, inSingle = !1, inDouble = !1, inTemplateString = !1, inRegex = !1, curly = 0, square = 0, paren = 0, lastFilterIndex = 0;
        for(i = 0; i < exp.length; i++)if (prev = c, c = exp.charCodeAt(i), inSingle) 0x27 === c && 0x5C !== prev && (inSingle = !1);
        else if (inDouble) 0x22 === c && 0x5C !== prev && (inDouble = !1);
        else if (inTemplateString) 0x60 === c && 0x5C !== prev && (inTemplateString = !1);
        else if (inRegex) 0x2f === c && 0x5C !== prev && (inRegex = !1);
        else if (0x7C !== c || // pipe
        0x7C === exp.charCodeAt(i + 1) || 0x7C === exp.charCodeAt(i - 1) || curly || square || paren) {
            switch(c){
                case 0x22:
                    inDouble = !0;
                    break; // "
                case 0x27:
                    inSingle = !0;
                    break; // '
                case 0x60:
                    inTemplateString = !0;
                    break; // `
                case 0x28:
                    paren++;
                    break; // (
                case 0x29:
                    paren--;
                    break; // )
                case 0x5B:
                    square++;
                    break; // [
                case 0x5D:
                    square--;
                    break; // ]
                case 0x7B:
                    curly++;
                    break; // {
                case 0x7D:
                    curly--;
            }
            if (0x2f === c) {
                // find first non-whitespace prev char
                for(var j = i - 1, p = void 0; j >= 0 && ' ' === (p = exp.charAt(j)); j--);
                p && validDivisionCharRE.test(p) || (inRegex = !0);
            }
        } else void 0 === expression ? (// first filter, end of expression
        lastFilterIndex = i + 1, expression = exp.slice(0, i).trim()) : pushFilter();
        function pushFilter() {
            (filters || (filters = [])).push(exp.slice(lastFilterIndex, i).trim()), lastFilterIndex = i + 1;
        }
        if (void 0 === expression ? expression = exp.slice(0, i).trim() : 0 !== lastFilterIndex && pushFilter(), filters) for(i = 0; i < filters.length; i++)expression = function(exp, filter) {
            var i = filter.indexOf('(');
            if (i < 0) // _f: resolveFilter
            return "_f(\"" + filter + "\")(" + exp + ")";
            var name = filter.slice(0, i), args = filter.slice(i + 1);
            return "_f(\"" + name + "\")(" + exp + (')' !== args ? ',' + args : args);
        }(expression, filters[i]);
        return expression;
    }
    /*  */ /* eslint-disable no-unused-vars */ function baseWarn(msg, range) {
        console.error("[Vue compiler]: " + msg);
    }
    /* eslint-enable no-unused-vars */ function pluckModuleFunction(modules, key) {
        return modules ? modules.map(function(m) {
            return m[key];
        }).filter(function(_) {
            return _;
        }) : [];
    }
    function addProp(el, name, value, range, dynamic) {
        (el.props || (el.props = [])).push(rangeSetItem({
            name: name,
            value: value,
            dynamic: dynamic
        }, range)), el.plain = !1;
    }
    function addAttr(el, name, value, range, dynamic) {
        (dynamic ? el.dynamicAttrs || (el.dynamicAttrs = []) : el.attrs || (el.attrs = [])).push(rangeSetItem({
            name: name,
            value: value,
            dynamic: dynamic
        }, range)), el.plain = !1;
    }
    // add a raw attr (use this in preTransforms)
    function addRawAttr(el, name, value, range) {
        el.attrsMap[name] = value, el.attrsList.push(rangeSetItem({
            name: name,
            value: value
        }, range));
    }
    function prependModifierMarker(symbol, name, dynamic) {
        return dynamic ? "_p(" + name + ",\"" + symbol + "\")" : symbol + name // mark the event as captured
        ;
    }
    function addHandler(el, name, value, modifiers, important, warn, range, dynamic) {
        modifiers = modifiers || emptyObject, warn && modifiers.prevent && modifiers.passive && warn("passive and prevent can't be used together. Passive handler can't prevent default event.", range), modifiers.right ? dynamic ? name = "(" + name + ")==='click'?'contextmenu':(" + name + ")" : 'click' === name && (name = 'contextmenu', delete modifiers.right) : modifiers.middle && (dynamic ? name = "(" + name + ")==='click'?'mouseup':(" + name + ")" : 'click' === name && (name = 'mouseup')), modifiers.capture && (delete modifiers.capture, name = prependModifierMarker('!', name, dynamic)), modifiers.once && (delete modifiers.once, name = prependModifierMarker('~', name, dynamic)), modifiers.passive && (delete modifiers.passive, name = prependModifierMarker('&', name, dynamic)), modifiers.native ? (delete modifiers.native, events = el.nativeEvents || (el.nativeEvents = {})) : events = el.events || (el.events = {});
        var events, newHandler = rangeSetItem({
            value: value.trim(),
            dynamic: dynamic
        }, range);
        modifiers !== emptyObject && (newHandler.modifiers = modifiers);
        var handlers = events[name];
        Array.isArray(handlers) ? important ? handlers.unshift(newHandler) : handlers.push(newHandler) : handlers ? events[name] = important ? [
            newHandler,
            handlers
        ] : [
            handlers,
            newHandler
        ] : events[name] = newHandler, el.plain = !1;
    }
    function getRawBindingAttr(el, name) {
        return el.rawAttrsMap[':' + name] || el.rawAttrsMap['v-bind:' + name] || el.rawAttrsMap[name];
    }
    function getBindingAttr(el, name, getStatic) {
        var dynamicValue = getAndRemoveAttr(el, ':' + name) || getAndRemoveAttr(el, 'v-bind:' + name);
        if (null != dynamicValue) return parseFilters(dynamicValue);
        if (!1 !== getStatic) {
            var staticValue = getAndRemoveAttr(el, name);
            if (null != staticValue) return JSON.stringify(staticValue);
        }
    }
    // note: this only removes the attr from the Array (attrsList) so that it
    // doesn't get processed by processAttrs.
    // By default it does NOT remove it from the map (attrsMap) because the map is
    // needed during codegen.
    function getAndRemoveAttr(el, name, removeFromMap) {
        var val;
        if (null != (val = el.attrsMap[name])) {
            for(var list = el.attrsList, i = 0, l = list.length; i < l; i++)if (list[i].name === name) {
                list.splice(i, 1);
                break;
            }
        }
        return removeFromMap && delete el.attrsMap[name], val;
    }
    function getAndRemoveAttrByRegex(el, name) {
        for(var list = el.attrsList, i = 0, l = list.length; i < l; i++){
            var attr = list[i];
            if (name.test(attr.name)) return list.splice(i, 1), attr;
        }
    }
    function rangeSetItem(item, range) {
        return range && (null != range.start && (item.start = range.start), null != range.end && (item.end = range.end)), item;
    }
    /*  */ /**
   * Cross-platform code generation for component v-model
   */ function genComponentModel(el, value, modifiers) {
        var ref = modifiers || {}, number = ref.number, trim = ref.trim, valueExpression = '$$v';
        trim && (valueExpression = "(typeof $$v === 'string'? $$v.trim(): $$v)"), number && (valueExpression = "_n(" + valueExpression + ")");
        var assignment = genAssignmentCode(value, valueExpression);
        el.model = {
            value: "(" + value + ")",
            expression: JSON.stringify(value),
            callback: "function ($$v) {" + assignment + "}"
        };
    }
    /**
   * Cross-platform codegen helper for generating v-model value assignment code.
   */ function genAssignmentCode(value, assignment) {
        var res = function(val) {
            if (len = // Fix https://github.com/vuejs/vue/pull/7730
            // allow v-model="obj.val " (trailing whitespace)
            (val = val.trim()).length, 0 > val.indexOf('[') || val.lastIndexOf(']') < len - 1) return (index$1 = val.lastIndexOf('.')) > -1 ? {
                exp: val.slice(0, index$1),
                key: '"' + val.slice(index$1 + 1) + '"'
            } : {
                exp: val,
                key: null
            };
            for(str = val, index$1 = expressionPos = expressionEndPos = 0; !(index$1 >= len);)/* istanbul ignore if */ isStringStart(chr = next()) ? parseString(chr) : 0x5B === chr && function(chr) {
                var inBracket = 1;
                for(expressionPos = index$1; !(index$1 >= len);){
                    if (isStringStart(chr = next())) {
                        parseString(chr);
                        continue;
                    }
                    if (0x5B === chr && inBracket++, 0x5D === chr && inBracket--, 0 === inBracket) {
                        expressionEndPos = index$1;
                        break;
                    }
                }
            }(chr);
            return {
                exp: val.slice(0, expressionPos),
                key: val.slice(expressionPos + 1, expressionEndPos)
            };
        }(value);
        return null === res.key ? value + "=" + assignment : "$set(" + res.exp + ", " + res.key + ", " + assignment + ")";
    }
    function next() {
        return str.charCodeAt(++index$1);
    }
    function isStringStart(chr) {
        return 0x22 === chr || 0x27 === chr;
    }
    function parseString(chr) {
        for(var stringQuote = chr; !(index$1 >= len) && (chr = next()) !== stringQuote;);
    }
    function createOnceHandler$1(event, handler, capture) {
        var _target = target$1; // save current target element in closure
        return function onceHandler() {
            var res = handler.apply(null, arguments);
            null !== res && remove$2(event, onceHandler, capture, _target);
        };
    }
    // #9446: Firefox <= 53 (in particular, ESR 52) has incorrect Event.timeStamp
    // implementation and does not fire microtasks in between event propagation, so
    // safe to exclude.
    var useMicrotaskFix = isUsingMicroTask && !(isFF && 53 >= Number(isFF[1]));
    function add$1(name, handler, capture, passive) {
        // async edge case #6566: inner click event triggers patch, event handler
        // attached to outer element during patch, and triggered again. This
        // happens because browsers fire microtask ticks between event propagation.
        // the solution is simple: we save the timestamp when a handler is attached,
        // and the handler would only fire if the event passed to it was fired
        // AFTER it was attached.
        if (useMicrotaskFix) {
            var attachedTimestamp = currentFlushTimestamp, original = handler;
            handler = original._wrapper = function(e) {
                if (// no bubbling, should always fire.
                // this is just a safety net in case event.timeStamp is unreliable in
                // certain weird environments...
                e.target === e.currentTarget || // event is fired after handler attachment
                e.timeStamp >= attachedTimestamp || // bail for environments that have buggy event.timeStamp implementations
                // #9462 iOS 9 bug: event.timeStamp is 0 after history.pushState
                // #9681 QtWebEngine event.timeStamp is negative value
                e.timeStamp <= 0 || // #9448 bail if event is fired in another document in a multi-page
                // electron/nw.js app, since event.timeStamp will be using a different
                // starting reference
                e.target.ownerDocument !== document) return original.apply(this, arguments);
            };
        }
        target$1.addEventListener(name, handler, supportsPassive ? {
            capture: capture,
            passive: passive
        } : capture);
    }
    function remove$2(name, handler, capture, _target) {
        (_target || target$1).removeEventListener(name, handler._wrapper || handler, capture);
    }
    function updateDOMListeners(oldVnode, vnode) {
        if (!(isUndef(oldVnode.data.on) && isUndef(vnode.data.on))) {
            var on = vnode.data.on || {}, oldOn = oldVnode.data.on || {};
            target$1 = vnode.elm, /*  */ // normalize v-model event tokens that can only be determined at runtime.
            // it's important to place the event as the first in the array because
            // the whole point is ensuring the v-model callback gets called before
            // user-attached handlers.
            function(on) {
                /* istanbul ignore if */ if (isDef(on.__r)) {
                    // IE input[type=range] only supports `change` event
                    var event = isIE ? 'change' : 'input';
                    on[event] = [].concat(on.__r, on[event] || []), delete on.__r;
                }
                // This was originally intended to fix #4521 but no longer necessary
                // after 2.5. Keeping it for backwards compat with generated code from < 2.4
                /* istanbul ignore if */ isDef(on.__c) && (on.change = [].concat(on.__c, on.change || []), delete on.__c);
            }(on), updateListeners(on, oldOn, add$1, remove$2, createOnceHandler$1, vnode.context), target$1 = void 0;
        }
    }
    function updateDOMProps(oldVnode, vnode) {
        if (!(isUndef(oldVnode.data.domProps) && isUndef(vnode.data.domProps))) {
            var key, cur, elm = vnode.elm, oldProps = oldVnode.data.domProps || {}, props = vnode.data.domProps || {};
            for(key in isDef(props.__ob__) && (props = vnode.data.domProps = extend({}, props)), oldProps)key in props || (elm[key] = '');
            for(key in props){
                // ignore children if the node has textContent or innerHTML,
                // as these will throw away existing DOM nodes and cause removal errors
                // on subsequent patches (#3360)
                if (cur = props[key], 'textContent' === key || 'innerHTML' === key) {
                    if (vnode.children && (vnode.children.length = 0), cur === oldProps[key]) continue;
                    1 === elm.childNodes.length && elm.removeChild(elm.childNodes[0]);
                }
                if ('value' === key && 'PROGRESS' !== elm.tagName) {
                    // store value as _value as well since
                    // non-string values will be stringified
                    elm._value = cur;
                    // avoid resetting cursor position when value is the same
                    var strCur = isUndef(cur) ? '' : String(cur);
                    !elm.composing && ('OPTION' === elm.tagName || function(elm, checkVal) {
                        // return true when textbox (.number and .trim) loses focus and its value is
                        // not equal to the updated value
                        var notInFocus = !0;
                        // #6157
                        // work around IE bug when accessing document.activeElement in an iframe
                        try {
                            notInFocus = document.activeElement !== elm;
                        } catch (e) {}
                        return notInFocus && elm.value !== checkVal;
                    }(elm, strCur) || function(elm, newVal) {
                        var value = elm.value, modifiers = elm._vModifiers;
                        if (isDef(modifiers)) {
                            if (modifiers.number) return toNumber(value) !== toNumber(newVal);
                            if (modifiers.trim) return value.trim() !== newVal.trim();
                        }
                        return value !== newVal;
                    }(elm, strCur)) && (elm.value = strCur);
                } else if ('innerHTML' === key && isSVG(elm.tagName) && isUndef(elm.innerHTML)) {
                    // IE doesn't support innerHTML for SVG elements
                    (svgContainer = svgContainer || document.createElement('div')).innerHTML = "<svg>" + cur + "</svg>";
                    for(var svg = svgContainer.firstChild; elm.firstChild;)elm.removeChild(elm.firstChild);
                    for(; svg.firstChild;)elm.appendChild(svg.firstChild);
                } else if (// skip the update if old and new VDOM state is the same.
                // `value` is handled separately because the DOM value may be temporarily
                // out of sync with VDOM state due to focus, composition and modifiers.
                // This  #4521 by skipping the unnecessary `checked` update.
                cur !== oldProps[key]) // some property updates can throw
                // e.g. `value` on <progress> w/ non-finite value
                try {
                    elm[key] = cur;
                } catch (e) {}
            }
        }
    }
    /*  */ var parseStyleText = cached(function(cssText) {
        var res = {}, propertyDelimiter = /:(.+)/;
        return cssText.split(/;(?![^(]*\))/g).forEach(function(item) {
            if (item) {
                var tmp = item.split(propertyDelimiter);
                tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
            }
        }), res;
    });
    // merge static and dynamic style data on the same vnode
    function normalizeStyleData(data) {
        var style = normalizeStyleBinding(data.style);
        // static style is pre-processed into an object during compilation
        // and is always a fresh object, so it's safe to merge into it
        return data.staticStyle ? extend(data.staticStyle, style) : style;
    }
    // normalize possible array / string values into Object
    function normalizeStyleBinding(bindingStyle) {
        return Array.isArray(bindingStyle) ? toObject(bindingStyle) : 'string' == typeof bindingStyle ? parseStyleText(bindingStyle) : bindingStyle;
    }
    /*  */ var cssVarRE = /^--/, importantRE = /\s*!important$/, setProp = function(el, name, val) {
        /* istanbul ignore if */ if (cssVarRE.test(name)) el.style.setProperty(name, val);
        else if (importantRE.test(val)) el.style.setProperty(hyphenate(name), val.replace(importantRE, ''), 'important');
        else {
            var normalizedName = normalize(name);
            if (Array.isArray(val)) // Support values array created by autoprefixer, e.g.
            // {display: ["-webkit-box", "-ms-flexbox", "flex"]}
            // Set them one by one, and the browser will only set those it can recognize
            for(var i = 0, len = val.length; i < len; i++)el.style[normalizedName] = val[i];
            else el.style[normalizedName] = val;
        }
    }, vendorNames = [
        'Webkit',
        'Moz',
        'ms'
    ], normalize = cached(function(prop) {
        if (emptyStyle = emptyStyle || document.createElement('div').style, 'filter' !== (prop = camelize(prop)) && prop in emptyStyle) return prop;
        for(var capName = prop.charAt(0).toUpperCase() + prop.slice(1), i = 0; i < vendorNames.length; i++){
            var name = vendorNames[i] + capName;
            if (name in emptyStyle) return name;
        }
    });
    function updateStyle(oldVnode, vnode) {
        var cur, name, data = vnode.data, oldData = oldVnode.data;
        if (!(isUndef(data.staticStyle) && isUndef(data.style) && isUndef(oldData.staticStyle) && isUndef(oldData.style))) {
            var el = vnode.elm, oldStaticStyle = oldData.staticStyle, oldStyleBinding = oldData.normalizedStyle || oldData.style || {}, oldStyle = oldStaticStyle || oldStyleBinding, style = normalizeStyleBinding(vnode.data.style) || {};
            // store normalized style under a different key for next diff
            // make sure to clone it if it's reactive, since the user likely wants
            // to mutate it.
            vnode.data.normalizedStyle = isDef(style.__ob__) ? extend({}, style) : style;
            var newStyle = /**
   * parent component style should be after child's
   * so that parent component's style could override it
   */ function(vnode, checkChild) {
                var styleData, res = {};
                if (checkChild) for(var childNode = vnode; childNode.componentInstance;)(childNode = childNode.componentInstance._vnode) && childNode.data && (styleData = normalizeStyleData(childNode.data)) && extend(res, styleData);
                (styleData = normalizeStyleData(vnode.data)) && extend(res, styleData);
                for(var parentNode = vnode; parentNode = parentNode.parent;)parentNode.data && (styleData = normalizeStyleData(parentNode.data)) && extend(res, styleData);
                return res;
            }(vnode, !0);
            for(name in oldStyle)isUndef(newStyle[name]) && setProp(el, name, '');
            for(name in newStyle)(cur = newStyle[name]) !== oldStyle[name] && // ie9 setting to null has no effect, must use empty string
            setProp(el, name, null == cur ? '' : cur);
        }
    }
    /*  */ var whitespaceRE = /\s+/;
    /**
   * Add class with compatibility for SVG since classList is not supported on
   * SVG elements in IE
   */ function addClass(el, cls) {
        /* istanbul ignore if */ if (cls && (cls = cls.trim())) {
            /* istanbul ignore else */ if (el.classList) cls.indexOf(' ') > -1 ? cls.split(whitespaceRE).forEach(function(c) {
                return el.classList.add(c);
            }) : el.classList.add(cls);
            else {
                var cur = " " + (el.getAttribute('class') || '') + " ";
                0 > cur.indexOf(' ' + cls + ' ') && el.setAttribute('class', (cur + cls).trim());
            }
        }
    }
    /**
   * Remove class with compatibility for SVG since classList is not supported on
   * SVG elements in IE
   */ function removeClass(el, cls) {
        /* istanbul ignore if */ if (cls && (cls = cls.trim())) {
            /* istanbul ignore else */ if (el.classList) cls.indexOf(' ') > -1 ? cls.split(whitespaceRE).forEach(function(c) {
                return el.classList.remove(c);
            }) : el.classList.remove(cls), el.classList.length || el.removeAttribute('class');
            else {
                for(var cur = " " + (el.getAttribute('class') || '') + " ", tar = ' ' + cls + ' '; cur.indexOf(tar) >= 0;)cur = cur.replace(tar, ' ');
                (cur = cur.trim()) ? el.setAttribute('class', cur) : el.removeAttribute('class');
            }
        }
    }
    /*  */ function resolveTransition(def$$1) {
        if (def$$1) {
            /* istanbul ignore else */ if ('object' == typeof def$$1) {
                var res = {};
                return !1 !== def$$1.css && extend(res, autoCssTransition(def$$1.name || 'v')), extend(res, def$$1), res;
            }
            if ('string' == typeof def$$1) return autoCssTransition(def$$1);
        }
    }
    var autoCssTransition = cached(function(name) {
        return {
            enterClass: name + "-enter",
            enterToClass: name + "-enter-to",
            enterActiveClass: name + "-enter-active",
            leaveClass: name + "-leave",
            leaveToClass: name + "-leave-to",
            leaveActiveClass: name + "-leave-active"
        };
    }), hasTransition = inBrowser && !isIE9, TRANSITION = 'transition', ANIMATION = 'animation', transitionProp = 'transition', transitionEndEvent = 'transitionend', animationProp = 'animation', animationEndEvent = 'animationend';
    hasTransition && (void 0 === window.ontransitionend && void 0 !== window.onwebkittransitionend && (transitionProp = 'WebkitTransition', transitionEndEvent = 'webkitTransitionEnd'), void 0 === window.onanimationend && void 0 !== window.onwebkitanimationend && (animationProp = 'WebkitAnimation', animationEndEvent = 'webkitAnimationEnd'));
    // binding to window is necessary to make hot reload work in IE in strict mode
    var raf = inBrowser ? window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : setTimeout : /* istanbul ignore next */ function(fn) {
        return fn();
    };
    function nextFrame(fn) {
        raf(function() {
            raf(fn);
        });
    }
    function addTransitionClass(el, cls) {
        var transitionClasses = el._transitionClasses || (el._transitionClasses = []);
        0 > transitionClasses.indexOf(cls) && (transitionClasses.push(cls), addClass(el, cls));
    }
    function removeTransitionClass(el, cls) {
        el._transitionClasses && remove(el._transitionClasses, cls), removeClass(el, cls);
    }
    function whenTransitionEnds(el, expectedType, cb) {
        var ref = getTransitionInfo(el, expectedType), type = ref.type, timeout = ref.timeout, propCount = ref.propCount;
        if (!type) return cb();
        var event = type === TRANSITION ? transitionEndEvent : animationEndEvent, ended = 0, end = function() {
            el.removeEventListener(event, onEnd), cb();
        }, onEnd = function(e) {
            e.target === el && ++ended >= propCount && end();
        };
        setTimeout(function() {
            ended < propCount && end();
        }, timeout + 1), el.addEventListener(event, onEnd);
    }
    var transformRE = /\b(transform|all)(,|$)/;
    function getTransitionInfo(el, expectedType) {
        var type, styles = window.getComputedStyle(el), transitionDelays = (styles[transitionProp + 'Delay'] || '').split(', '), transitionDurations = (styles[transitionProp + 'Duration'] || '').split(', '), transitionTimeout = getTimeout(transitionDelays, transitionDurations), animationDelays = (styles[animationProp + 'Delay'] || '').split(', '), animationDurations = (styles[animationProp + 'Duration'] || '').split(', '), animationTimeout = getTimeout(animationDelays, animationDurations), timeout = 0, propCount = 0;
        /* istanbul ignore if */ expectedType === TRANSITION ? transitionTimeout > 0 && (type = TRANSITION, timeout = transitionTimeout, propCount = transitionDurations.length) : expectedType === ANIMATION ? animationTimeout > 0 && (type = ANIMATION, timeout = animationTimeout, propCount = animationDurations.length) : propCount = (type = (timeout = Math.max(transitionTimeout, animationTimeout)) > 0 ? transitionTimeout > animationTimeout ? TRANSITION : ANIMATION : null) ? type === TRANSITION ? transitionDurations.length : animationDurations.length : 0;
        var hasTransform = type === TRANSITION && transformRE.test(styles[transitionProp + 'Property']);
        return {
            type: type,
            timeout: timeout,
            propCount: propCount,
            hasTransform: hasTransform
        };
    }
    function getTimeout(delays, durations) {
        /* istanbul ignore next */ for(; delays.length < durations.length;)delays = delays.concat(delays);
        return Math.max.apply(null, durations.map(function(d, i) {
            return toMs(d) + toMs(delays[i]);
        }));
    }
    // Old versions of Chromium (below 61.0.3163.100) formats floating pointer numbers
    // in a locale-dependent way, using a comma instead of a dot.
    // If comma is not replaced with a dot, the input will be rounded down (i.e. acting
    // as a floor function) causing unexpected behaviors
    function toMs(s) {
        return 1000 * Number(s.slice(0, -1).replace(',', '.'));
    }
    /*  */ function enter(vnode, toggleDisplay) {
        var el = vnode.elm;
        isDef(el._leaveCb) && (el._leaveCb.cancelled = !0, el._leaveCb());
        var data = resolveTransition(vnode.data.transition);
        if (!(isUndef(data) || isDef(el._enterCb)) && 1 === el.nodeType) {
            for(var css = data.css, type = data.type, enterClass = data.enterClass, enterToClass = data.enterToClass, enterActiveClass = data.enterActiveClass, appearClass = data.appearClass, appearToClass = data.appearToClass, appearActiveClass = data.appearActiveClass, beforeEnter = data.beforeEnter, enter = data.enter, afterEnter = data.afterEnter, enterCancelled = data.enterCancelled, beforeAppear = data.beforeAppear, appear = data.appear, afterAppear = data.afterAppear, appearCancelled = data.appearCancelled, duration = data.duration, context = activeInstance, transitionNode = activeInstance.$vnode; transitionNode && transitionNode.parent;)context = transitionNode.context, transitionNode = transitionNode.parent;
            var isAppear = !context._isMounted || !vnode.isRootInsert;
            if (!isAppear || appear || '' === appear) {
                var startClass = isAppear && appearClass ? appearClass : enterClass, activeClass = isAppear && appearActiveClass ? appearActiveClass : enterActiveClass, toClass = isAppear && appearToClass ? appearToClass : enterToClass, beforeEnterHook = isAppear && beforeAppear || beforeEnter, enterHook = isAppear && 'function' == typeof appear ? appear : enter, afterEnterHook = isAppear && afterAppear || afterEnter, enterCancelledHook = isAppear && appearCancelled || enterCancelled, explicitEnterDuration = toNumber(isObject(duration) ? duration.enter : duration);
                null != explicitEnterDuration && checkDuration(explicitEnterDuration, 'enter', vnode);
                var expectsCSS = !1 !== css && !isIE9, userWantsControl = getHookArgumentsLength(enterHook), cb = el._enterCb = once(function() {
                    expectsCSS && (removeTransitionClass(el, toClass), removeTransitionClass(el, activeClass)), cb.cancelled ? (expectsCSS && removeTransitionClass(el, startClass), enterCancelledHook && enterCancelledHook(el)) : afterEnterHook && afterEnterHook(el), el._enterCb = null;
                });
                vnode.data.show || // remove pending leave element on enter by injecting an insert hook
                mergeVNodeHook(vnode, 'insert', function() {
                    var parent = el.parentNode, pendingNode = parent && parent._pending && parent._pending[vnode.key];
                    pendingNode && pendingNode.tag === vnode.tag && pendingNode.elm._leaveCb && pendingNode.elm._leaveCb(), enterHook && enterHook(el, cb);
                }), // start enter transition
                beforeEnterHook && beforeEnterHook(el), expectsCSS && (addTransitionClass(el, startClass), addTransitionClass(el, activeClass), nextFrame(function() {
                    removeTransitionClass(el, startClass), cb.cancelled || (addTransitionClass(el, toClass), userWantsControl || (isValidDuration(explicitEnterDuration) ? setTimeout(cb, explicitEnterDuration) : whenTransitionEnds(el, type, cb)));
                })), vnode.data.show && (toggleDisplay && toggleDisplay(), enterHook && enterHook(el, cb)), expectsCSS || userWantsControl || cb();
            }
        }
    }
    function leave(vnode, rm) {
        var el = vnode.elm;
        isDef(el._enterCb) && (el._enterCb.cancelled = !0, el._enterCb());
        var data = resolveTransition(vnode.data.transition);
        if (isUndef(data) || 1 !== el.nodeType) return rm();
        /* istanbul ignore if */ if (!isDef(el._leaveCb)) {
            var css = data.css, type = data.type, leaveClass = data.leaveClass, leaveToClass = data.leaveToClass, leaveActiveClass = data.leaveActiveClass, beforeLeave = data.beforeLeave, leave = data.leave, afterLeave = data.afterLeave, leaveCancelled = data.leaveCancelled, delayLeave = data.delayLeave, duration = data.duration, expectsCSS = !1 !== css && !isIE9, userWantsControl = getHookArgumentsLength(leave), explicitLeaveDuration = toNumber(isObject(duration) ? duration.leave : duration);
            isDef(explicitLeaveDuration) && checkDuration(explicitLeaveDuration, 'leave', vnode);
            var cb = el._leaveCb = once(function() {
                el.parentNode && el.parentNode._pending && (el.parentNode._pending[vnode.key] = null), expectsCSS && (removeTransitionClass(el, leaveToClass), removeTransitionClass(el, leaveActiveClass)), cb.cancelled ? (expectsCSS && removeTransitionClass(el, leaveClass), leaveCancelled && leaveCancelled(el)) : (rm(), afterLeave && afterLeave(el)), el._leaveCb = null;
            });
            delayLeave ? delayLeave(performLeave) : performLeave();
        }
        function performLeave() {
            // the delayed leave may have already been cancelled
            !cb.cancelled && (!vnode.data.show && el.parentNode && ((el.parentNode._pending || (el.parentNode._pending = {}))[vnode.key] = vnode), beforeLeave && beforeLeave(el), expectsCSS && (addTransitionClass(el, leaveClass), addTransitionClass(el, leaveActiveClass), nextFrame(function() {
                removeTransitionClass(el, leaveClass), cb.cancelled || (addTransitionClass(el, leaveToClass), userWantsControl || (isValidDuration(explicitLeaveDuration) ? setTimeout(cb, explicitLeaveDuration) : whenTransitionEnds(el, type, cb)));
            })), leave && leave(el, cb), expectsCSS || userWantsControl || cb());
        }
    }
    // only used in dev mode
    function checkDuration(val, name, vnode) {
        'number' != typeof val ? warn("<transition> explicit " + name + " duration is not a valid number - got " + JSON.stringify(val) + ".", vnode.context) : isNaN(val) && warn("<transition> explicit " + name + " duration is NaN - the duration expression might be incorrect.", vnode.context);
    }
    function isValidDuration(val) {
        return 'number' == typeof val && !isNaN(val);
    }
    /**
   * Normalize a transition hook's argument length. The hook may be:
   * - a merged hook (invoker) with the original in .fns
   * - a wrapped component method (check ._length)
   * - a plain function (.length)
   */ function getHookArgumentsLength(fn) {
        if (isUndef(fn)) return !1;
        var invokerFns = fn.fns;
        return isDef(invokerFns) ? getHookArgumentsLength(Array.isArray(invokerFns) ? invokerFns[0] : invokerFns) : (fn._length || fn.length) > 1;
    }
    function _enter(_, vnode) {
        !0 !== vnode.data.show && enter(vnode);
    }
    var patch = function(backend) {
        var i, j, cbs = {}, modules = backend.modules, nodeOps = backend.nodeOps;
        for(i = 0; i < hooks.length; ++i)for(j = 0, cbs[hooks[i]] = []; j < modules.length; ++j)isDef(modules[j][hooks[i]]) && cbs[hooks[i]].push(modules[j][hooks[i]]);
        function removeNode(el) {
            var parent = nodeOps.parentNode(el);
            // element may have already been removed due to v-html / v-text
            isDef(parent) && nodeOps.removeChild(parent, el);
        }
        function isUnknownElement$$1(vnode, inVPre) {
            return !inVPre && !vnode.ns && !(config.ignoredElements.length && config.ignoredElements.some(function(ignore) {
                return isRegExp(ignore) ? ignore.test(vnode.tag) : ignore === vnode.tag;
            })) && config.isUnknownElement(vnode.tag);
        }
        var creatingElmInVPre = 0;
        function createElm(vnode, insertedVnodeQueue, parentElm, refElm, nested, ownerArray, index) {
            if (isDef(vnode.elm) && isDef(ownerArray) && // This vnode was used in a previous render!
            // now it's used as a new node, overwriting its elm would cause
            // potential patch errors down the road when it's used as an insertion
            // reference node. Instead, we clone the node on-demand before creating
            // associated DOM element for it.
            (vnode = ownerArray[index] = cloneVNode(vnode)), vnode.isRootInsert = !nested, !function(vnode, insertedVnodeQueue, parentElm, refElm) {
                var i = vnode.data;
                if (isDef(i)) {
                    var isReactivated = isDef(vnode.componentInstance) && i.keepAlive;
                    // after calling the init hook, if the vnode is a child component
                    // it should've created a child instance and mounted it. the child
                    // component also has set the placeholder vnode's elm.
                    // in that case we can just return the element and be done.
                    if (isDef(i = i.hook) && isDef(i = i.init) && i(vnode, !1), isDef(vnode.componentInstance)) return initComponent(vnode, insertedVnodeQueue), insert(parentElm, vnode.elm, refElm), isTrue(isReactivated) && function(vnode, insertedVnodeQueue, parentElm, refElm) {
                        for(// hack for #4339: a reactivated component with inner transition
                        // does not trigger because the inner node's created hooks are not called
                        // again. It's not ideal to involve module-specific logic in here but
                        // there doesn't seem to be a better way to do it.
                        var i, innerNode = vnode; innerNode.componentInstance;)if (isDef(i = (innerNode = innerNode.componentInstance._vnode).data) && isDef(i = i.transition)) {
                            for(i = 0; i < cbs.activate.length; ++i)cbs.activate[i](emptyNode, innerNode);
                            insertedVnodeQueue.push(innerNode);
                            break;
                        }
                        // unlike a newly created component,
                        // a reactivated keep-alive component doesn't insert itself
                        insert(parentElm, vnode.elm, refElm);
                    }(vnode, insertedVnodeQueue, parentElm, refElm), !0;
                }
            }(vnode, insertedVnodeQueue, parentElm, refElm)) {
                var data = vnode.data, children = vnode.children, tag = vnode.tag;
                isDef(tag) ? (data && data.pre && creatingElmInVPre++, isUnknownElement$$1(vnode, creatingElmInVPre) && warn('Unknown custom element: <' + tag + '> - did you register the component correctly? For recursive components, make sure to provide the "name" option.', vnode.context), vnode.elm = vnode.ns ? nodeOps.createElementNS(vnode.ns, tag) : nodeOps.createElement(tag, vnode), setScope(vnode), createChildren(vnode, children, insertedVnodeQueue), isDef(data) && invokeCreateHooks(vnode, insertedVnodeQueue), insert(parentElm, vnode.elm, refElm), data && data.pre && creatingElmInVPre--) : (isTrue(vnode.isComment) ? vnode.elm = nodeOps.createComment(vnode.text) : vnode.elm = nodeOps.createTextNode(vnode.text), insert(parentElm, vnode.elm, refElm));
            }
        }
        function initComponent(vnode, insertedVnodeQueue) {
            isDef(vnode.data.pendingInsert) && (insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert), vnode.data.pendingInsert = null), vnode.elm = vnode.componentInstance.$el, isPatchable(vnode) ? (invokeCreateHooks(vnode, insertedVnodeQueue), setScope(vnode)) : (// empty component root.
            // skip all element-related modules except for ref (#3455)
            registerRef(vnode), // make sure to invoke the insert hook
            insertedVnodeQueue.push(vnode));
        }
        function insert(parent, elm, ref$$1) {
            isDef(parent) && (isDef(ref$$1) ? nodeOps.parentNode(ref$$1) === parent && nodeOps.insertBefore(parent, elm, ref$$1) : nodeOps.appendChild(parent, elm));
        }
        function createChildren(vnode, children, insertedVnodeQueue) {
            if (Array.isArray(children)) {
                checkDuplicateKeys(children);
                for(var i = 0; i < children.length; ++i)createElm(children[i], insertedVnodeQueue, vnode.elm, null, !0, children, i);
            } else isPrimitive(vnode.text) && nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)));
        }
        function isPatchable(vnode) {
            for(; vnode.componentInstance;)vnode = vnode.componentInstance._vnode;
            return isDef(vnode.tag);
        }
        function invokeCreateHooks(vnode, insertedVnodeQueue) {
            for(var i$1 = 0; i$1 < cbs.create.length; ++i$1)cbs.create[i$1](emptyNode, vnode);
            isDef(i = vnode.data.hook) && (isDef(i.create) && i.create(emptyNode, vnode), isDef(i.insert) && insertedVnodeQueue.push(vnode));
        }
        // set scope id attribute for scoped CSS.
        // this is implemented as a special case to avoid the overhead
        // of going through the normal attribute patching process.
        function setScope(vnode) {
            var i;
            if (isDef(i = vnode.fnScopeId)) nodeOps.setStyleScope(vnode.elm, i);
            else for(var ancestor = vnode; ancestor;)isDef(i = ancestor.context) && isDef(i = i.$options._scopeId) && nodeOps.setStyleScope(vnode.elm, i), ancestor = ancestor.parent;
            // for slot content they should also get the scopeId from the host instance.
            isDef(i = activeInstance) && i !== vnode.context && i !== vnode.fnContext && isDef(i = i.$options._scopeId) && nodeOps.setStyleScope(vnode.elm, i);
        }
        function addVnodes(parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
            for(; startIdx <= endIdx; ++startIdx)createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm, !1, vnodes, startIdx);
        }
        function invokeDestroyHook(vnode) {
            var i, j, data = vnode.data;
            if (isDef(data)) for(isDef(i = data.hook) && isDef(i = i.destroy) && i(vnode), i = 0; i < cbs.destroy.length; ++i)cbs.destroy[i](vnode);
            if (isDef(i = vnode.children)) for(j = 0; j < vnode.children.length; ++j)invokeDestroyHook(vnode.children[j]);
        }
        function removeVnodes(vnodes, startIdx, endIdx) {
            for(; startIdx <= endIdx; ++startIdx){
                var ch = vnodes[startIdx];
                isDef(ch) && (isDef(ch.tag) ? (function removeAndInvokeRemoveHook(vnode, rm) {
                    if (isDef(rm) || isDef(vnode.data)) {
                        var i, listeners = cbs.remove.length + 1;
                        for(isDef(rm) ? // we have a recursively passed down rm callback
                        // increase the listeners count
                        rm.listeners += listeners : // directly removing
                        rm = function(childElm, listeners) {
                            function remove$$1() {
                                0 == --remove$$1.listeners && removeNode(childElm);
                            }
                            return remove$$1.listeners = listeners, remove$$1;
                        }(vnode.elm, listeners), isDef(i = vnode.componentInstance) && isDef(i = i._vnode) && isDef(i.data) && removeAndInvokeRemoveHook(i, rm), i = 0; i < cbs.remove.length; ++i)cbs.remove[i](vnode, rm);
                        isDef(i = vnode.data.hook) && isDef(i = i.remove) ? i(vnode, rm) : rm();
                    } else removeNode(vnode.elm);
                }(ch), invokeDestroyHook(ch)) : removeNode(ch.elm));
            }
        }
        function checkDuplicateKeys(children) {
            for(var seenKeys = {}, i = 0; i < children.length; i++){
                var vnode = children[i], key = vnode.key;
                isDef(key) && (seenKeys[key] ? warn("Duplicate keys detected: '" + key + "'. This may cause an update error.", vnode.context) : seenKeys[key] = !0);
            }
        }
        function invokeInsertHook(vnode, queue, initial) {
            // delay insert hooks for component root nodes, invoke them after the
            // element is really inserted
            if (isTrue(initial) && isDef(vnode.parent)) vnode.parent.data.pendingInsert = queue;
            else for(var i = 0; i < queue.length; ++i)queue[i].data.hook.insert(queue[i]);
        }
        var hydrationBailed = !1, isRenderedModule = makeMap('attrs,class,staticClass,staticStyle,key');
        // Note: this is a browser-only function so we can assume elms are DOM nodes.
        function hydrate(elm, vnode, insertedVnodeQueue, inVPre) {
            var inVPre1, i, tag = vnode.tag, data = vnode.data, children = vnode.children;
            if (inVPre = inVPre || data && data.pre, vnode.elm = elm, isTrue(vnode.isComment) && isDef(vnode.asyncFactory)) return vnode.isAsyncPlaceholder = !0, !0;
            if (inVPre1 = inVPre, isDef(vnode.tag) ? 0 !== vnode.tag.indexOf('vue-component') && (!!isUnknownElement$$1(vnode, inVPre1) || vnode.tag.toLowerCase() !== (elm.tagName && elm.tagName.toLowerCase())) : elm.nodeType !== (vnode.isComment ? 8 : 3)) return !1;
            if (isDef(data) && (isDef(i = data.hook) && isDef(i = i.init) && i(vnode, !0), isDef(i = vnode.componentInstance))) return(// child component. it should have hydrated its own tree.
            initComponent(vnode, insertedVnodeQueue), !0);
            if (isDef(tag)) {
                if (isDef(children)) {
                    // empty element, allow client to pick up and populate children
                    if (elm.hasChildNodes()) {
                        // v-html and domProps: innerHTML
                        if (isDef(i = data) && isDef(i = i.domProps) && isDef(i = i.innerHTML)) {
                            if (i !== elm.innerHTML) return 'undefined' == typeof console || hydrationBailed || (hydrationBailed = !0, console.warn('Parent: ', elm), console.warn('server innerHTML: ', i), console.warn('client innerHTML: ', elm.innerHTML)), !1;
                        } else {
                            for(var childrenMatch = !0, childNode = elm.firstChild, i$1 = 0; i$1 < children.length; i$1++){
                                if (!childNode || !hydrate(childNode, children[i$1], insertedVnodeQueue, inVPre)) {
                                    childrenMatch = !1;
                                    break;
                                }
                                childNode = childNode.nextSibling;
                            }
                            // if childNode is not null, it means the actual childNodes list is
                            // longer than the virtual children list.
                            if (!childrenMatch || childNode) return 'undefined' == typeof console || hydrationBailed || (hydrationBailed = !0, console.warn('Parent: ', elm), console.warn('Mismatching childNodes vs. VNodes: ', elm.childNodes, children)), !1;
                        }
                    } else createChildren(vnode, children, insertedVnodeQueue);
                }
                if (isDef(data)) {
                    var fullInvoke = !1;
                    for(var key in data)if (!isRenderedModule(key)) {
                        fullInvoke = !0, invokeCreateHooks(vnode, insertedVnodeQueue);
                        break;
                    }
                    !fullInvoke && data.class && // ensure collecting deps for deep class bindings for future updates
                    traverse(data.class);
                }
            } else elm.data !== vnode.text && (elm.data = vnode.text);
            return !0;
        }
        return function(oldVnode, vnode, hydrating, removeOnly) {
            if (isUndef(vnode)) {
                isDef(oldVnode) && invokeDestroyHook(oldVnode);
                return;
            }
            var isInitialPatch = !1, insertedVnodeQueue = [];
            if (isUndef(oldVnode)) // empty mount (likely as component), create new root element
            isInitialPatch = !0, createElm(vnode, insertedVnodeQueue);
            else {
                var elm, isRealElement = isDef(oldVnode.nodeType);
                if (!isRealElement && sameVnode(oldVnode, vnode)) // patch existing root node
                !function patchVnode(oldVnode, vnode, insertedVnodeQueue, ownerArray, index, removeOnly) {
                    if (oldVnode !== vnode) {
                        isDef(vnode.elm) && isDef(ownerArray) && // clone reused vnode
                        (vnode = ownerArray[index] = cloneVNode(vnode));
                        var i, elm = vnode.elm = oldVnode.elm;
                        if (isTrue(oldVnode.isAsyncPlaceholder)) {
                            isDef(vnode.asyncFactory.resolved) ? hydrate(oldVnode.elm, vnode, insertedVnodeQueue) : vnode.isAsyncPlaceholder = !0;
                            return;
                        }
                        // reuse element for static trees.
                        // note we only do this if the vnode is cloned -
                        // if the new node is not cloned it means the render functions have been
                        // reset by the hot-reload-api and we need to do a proper re-render.
                        if (isTrue(vnode.isStatic) && isTrue(oldVnode.isStatic) && vnode.key === oldVnode.key && (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))) {
                            vnode.componentInstance = oldVnode.componentInstance;
                            return;
                        }
                        var data = vnode.data;
                        isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch) && i(oldVnode, vnode);
                        var oldCh = oldVnode.children, ch = vnode.children;
                        if (isDef(data) && isPatchable(vnode)) {
                            for(i = 0; i < cbs.update.length; ++i)cbs.update[i](oldVnode, vnode);
                            isDef(i = data.hook) && isDef(i = i.update) && i(oldVnode, vnode);
                        }
                        isUndef(vnode.text) ? isDef(oldCh) && isDef(ch) ? oldCh !== ch && function(parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
                            var oldKeyToIdx, idxInOld, vnodeToMove, oldStartIdx = 0, newStartIdx = 0, oldEndIdx = oldCh.length - 1, oldStartVnode = oldCh[0], oldEndVnode = oldCh[oldEndIdx], newEndIdx = newCh.length - 1, newStartVnode = newCh[0], newEndVnode = newCh[newEndIdx], canMove = !removeOnly;
                            for(checkDuplicateKeys(newCh); oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx;)isUndef(oldStartVnode) ? oldStartVnode = oldCh[++oldStartIdx] : isUndef(oldEndVnode) ? oldEndVnode = oldCh[--oldEndIdx] : sameVnode(oldStartVnode, newStartVnode) ? (patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx), oldStartVnode = oldCh[++oldStartIdx], newStartVnode = newCh[++newStartIdx]) : sameVnode(oldEndVnode, newEndVnode) ? (patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx), oldEndVnode = oldCh[--oldEndIdx], newEndVnode = newCh[--newEndIdx]) : sameVnode(oldStartVnode, newEndVnode) ? (patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx), canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm)), oldStartVnode = oldCh[++oldStartIdx], newEndVnode = newCh[--newEndIdx]) : (sameVnode(oldEndVnode, newStartVnode) ? (patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx), canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm), oldEndVnode = oldCh[--oldEndIdx]) : (isUndef(oldKeyToIdx) && (oldKeyToIdx = function(children, beginIdx, endIdx) {
                                var i, key, map = {};
                                for(i = beginIdx; i <= endIdx; ++i)isDef(key = children[i].key) && (map[key] = i);
                                return map;
                            }(oldCh, oldStartIdx, oldEndIdx)), isUndef(idxInOld = isDef(newStartVnode.key) ? oldKeyToIdx[newStartVnode.key] : function(node, oldCh, start, end) {
                                for(var i = start; i < end; i++){
                                    var c = oldCh[i];
                                    if (isDef(c) && sameVnode(node, c)) return i;
                                }
                            }(newStartVnode, oldCh, oldStartIdx, oldEndIdx)) ? createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, !1, newCh, newStartIdx) : sameVnode(vnodeToMove = oldCh[idxInOld], newStartVnode) ? (patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue, newCh, newStartIdx), oldCh[idxInOld] = void 0, canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm)) : // same key but different element. treat as new element
                            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, !1, newCh, newStartIdx)), newStartVnode = newCh[++newStartIdx]);
                            oldStartIdx > oldEndIdx ? addVnodes(parentElm, isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue) : newStartIdx > newEndIdx && removeVnodes(oldCh, oldStartIdx, oldEndIdx);
                        }(elm, oldCh, ch, insertedVnodeQueue, removeOnly) : isDef(ch) ? (checkDuplicateKeys(ch), isDef(oldVnode.text) && nodeOps.setTextContent(elm, ''), addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)) : isDef(oldCh) ? removeVnodes(oldCh, 0, oldCh.length - 1) : isDef(oldVnode.text) && nodeOps.setTextContent(elm, '') : oldVnode.text !== vnode.text && nodeOps.setTextContent(elm, vnode.text), isDef(data) && isDef(i = data.hook) && isDef(i = i.postpatch) && i(oldVnode, vnode);
                    }
                }(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly);
                else {
                    if (isRealElement) {
                        if (1 === oldVnode.nodeType && oldVnode.hasAttribute(SSR_ATTR) && (oldVnode.removeAttribute(SSR_ATTR), hydrating = !0), isTrue(hydrating)) {
                            if (hydrate(oldVnode, vnode, insertedVnodeQueue)) return invokeInsertHook(vnode, insertedVnodeQueue, !0), oldVnode;
                            warn("The client-side rendered virtual DOM tree is not matching server-rendered content. This is likely caused by incorrect HTML markup, for example nesting block-level elements inside <p>, or missing <tbody>. Bailing hydration and performing full client-side render.");
                        }
                        elm = oldVnode, // either not server-rendered, or hydration failed.
                        // create an empty node and replace it
                        oldVnode = new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], void 0, elm);
                    }
                    // replacing existing element
                    var oldElm = oldVnode.elm, parentElm = nodeOps.parentNode(oldElm);
                    // update parent placeholder node element, recursively
                    if (// create new node
                    createElm(vnode, insertedVnodeQueue, // extremely rare edge case: do not insert if old element is in a
                    // leaving transition. Only happens when combining transition +
                    // keep-alive + HOCs. (#4590)
                    oldElm._leaveCb ? null : parentElm, nodeOps.nextSibling(oldElm)), isDef(vnode.parent)) for(var ancestor = vnode.parent, patchable = isPatchable(vnode); ancestor;){
                        for(var i = 0; i < cbs.destroy.length; ++i)cbs.destroy[i](ancestor);
                        if (ancestor.elm = vnode.elm, patchable) {
                            for(var i$1 = 0; i$1 < cbs.create.length; ++i$1)cbs.create[i$1](emptyNode, ancestor);
                            // #6513
                            // invoke insert hooks that may have been merged by create hooks.
                            // e.g. for directives that uses the "inserted" hook.
                            var insert = ancestor.data.hook.insert;
                            if (insert.merged) // start at index 1 to avoid re-invoking component mounted hook
                            for(var i$2 = 1; i$2 < insert.fns.length; i$2++)insert.fns[i$2]();
                        } else registerRef(ancestor);
                        ancestor = ancestor.parent;
                    }
                    isDef(parentElm) ? removeVnodes([
                        oldVnode
                    ], 0, 0) : isDef(oldVnode.tag) && invokeDestroyHook(oldVnode);
                }
            }
            return invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch), vnode.elm;
        };
    }({
        nodeOps: nodeOps,
        modules: [
            {
                create: updateAttrs,
                update: updateAttrs
            },
            {
                create: updateClass,
                update: updateClass
            },
            {
                create: updateDOMListeners,
                update: updateDOMListeners
            },
            {
                create: updateDOMProps,
                update: updateDOMProps
            },
            {
                create: updateStyle,
                update: updateStyle
            },
            inBrowser ? {
                create: _enter,
                activate: _enter,
                remove: function(vnode, rm) {
                    /* istanbul ignore else */ !0 !== vnode.data.show ? leave(vnode, rm) : rm();
                }
            } : {}
        ].concat(baseModules)
    });
    isIE9 && // http://www.matts411.com/post/internet-explorer-9-oninput/
    document.addEventListener('selectionchange', function() {
        var el = document.activeElement;
        el && el.vmodel && trigger(el, 'input');
    });
    var directive = {
        inserted: function(el, binding, vnode, oldVnode) {
            'select' === vnode.tag ? (oldVnode.elm && !oldVnode.elm._vOptions ? mergeVNodeHook(vnode, 'postpatch', function() {
                directive.componentUpdated(el, binding, vnode);
            }) : setSelected(el, binding, vnode.context), el._vOptions = [].map.call(el.options, getValue)) : ('textarea' === vnode.tag || isTextInputType(el.type)) && (el._vModifiers = binding.modifiers, !binding.modifiers.lazy && (el.addEventListener('compositionstart', onCompositionStart), el.addEventListener('compositionend', onCompositionEnd), // Safari < 10.2 & UIWebView doesn't fire compositionend when
            // switching focus before confirming composition choice
            // this also fixes the issue where some browsers e.g. iOS Chrome
            // fires "change" instead of "input" on autocomplete.
            el.addEventListener('change', onCompositionEnd), isIE9 && (el.vmodel = !0)));
        },
        componentUpdated: function(el, binding, vnode) {
            if ('select' === vnode.tag) {
                setSelected(el, binding, vnode.context);
                // in case the options rendered by v-for have changed,
                // it's possible that the value is out-of-sync with the rendered options.
                // detect such cases and filter out values that no longer has a matching
                // option in the DOM.
                var prevOptions = el._vOptions, curOptions = el._vOptions = [].map.call(el.options, getValue);
                curOptions.some(function(o, i) {
                    return !looseEqual(o, prevOptions[i]);
                }) && (el.multiple ? binding.value.some(function(v) {
                    return hasNoMatchingOption(v, curOptions);
                }) : binding.value !== binding.oldValue && hasNoMatchingOption(binding.value, curOptions)) && trigger(el, 'change');
            }
        }
    };
    function setSelected(el, binding, vm) {
        actuallySetSelected(el, binding, vm), (isIE || isEdge) && setTimeout(function() {
            actuallySetSelected(el, binding, vm);
        }, 0);
    }
    function actuallySetSelected(el, binding, vm) {
        var selected, option, value = binding.value, isMultiple = el.multiple;
        if (isMultiple && !Array.isArray(value)) {
            warn("<select multiple v-model=\"" + binding.expression + '"> expects an Array value for its binding, but got ' + Object.prototype.toString.call(value).slice(8, -1), vm);
            return;
        }
        for(var i = 0, l = el.options.length; i < l; i++)if (option = el.options[i], isMultiple) selected = looseIndexOf(value, getValue(option)) > -1, option.selected !== selected && (option.selected = selected);
        else if (looseEqual(getValue(option), value)) {
            el.selectedIndex !== i && (el.selectedIndex = i);
            return;
        }
        isMultiple || (el.selectedIndex = -1);
    }
    function hasNoMatchingOption(value, options) {
        return options.every(function(o) {
            return !looseEqual(o, value);
        });
    }
    function getValue(option) {
        return '_value' in option ? option._value : option.value;
    }
    function onCompositionStart(e) {
        e.target.composing = !0;
    }
    function onCompositionEnd(e) {
        // prevent triggering an input event for no reason
        e.target.composing && (e.target.composing = !1, trigger(e.target, 'input'));
    }
    function trigger(el, type) {
        var e = document.createEvent('HTMLEvents');
        e.initEvent(type, !0, !0), el.dispatchEvent(e);
    }
    /*  */ // recursively search for possible transition defined inside the component root
    function locateNode(vnode) {
        return !vnode.componentInstance || vnode.data && vnode.data.transition ? vnode : locateNode(vnode.componentInstance._vnode);
    }
    /*  */ var transitionProps = {
        name: String,
        appear: Boolean,
        css: Boolean,
        mode: String,
        type: String,
        enterClass: String,
        leaveClass: String,
        enterToClass: String,
        leaveToClass: String,
        enterActiveClass: String,
        leaveActiveClass: String,
        appearClass: String,
        appearActiveClass: String,
        appearToClass: String,
        duration: [
            Number,
            String,
            Object
        ]
    };
    // in case the child is also an abstract component, e.g. <keep-alive>
    // we want to recursively retrieve the real component to be rendered
    function getRealChild(vnode) {
        var compOptions = vnode && vnode.componentOptions;
        return compOptions && compOptions.Ctor.options.abstract ? getRealChild(getFirstComponentChild(compOptions.children)) : vnode;
    }
    function extractTransitionData(comp) {
        var data = {}, options = comp.$options;
        // props
        for(var key in options.propsData)data[key] = comp[key];
        // events.
        // extract listeners and pass them directly to the transition methods
        var listeners = options._parentListeners;
        for(var key$1 in listeners)data[camelize(key$1)] = listeners[key$1];
        return data;
    }
    function placeholder(h, rawChild) {
        if (/\d-keep-alive$/.test(rawChild.tag)) return h('keep-alive', {
            props: rawChild.componentOptions.propsData
        });
    }
    var isNotTextNode = function(c) {
        return c.tag || isAsyncPlaceholder(c);
    }, isVShowDirective = function(d) {
        return 'show' === d.name;
    }, props = extend({
        tag: String,
        moveClass: String
    }, transitionProps);
    function callPendingCbs(c) {
        c.elm._moveCb && c.elm._moveCb(), c.elm._enterCb && c.elm._enterCb();
    }
    function recordPosition(c) {
        c.data.newPos = c.elm.getBoundingClientRect();
    }
    function applyTranslation(c) {
        var oldPos = c.data.pos, newPos = c.data.newPos, dx = oldPos.left - newPos.left, dy = oldPos.top - newPos.top;
        if (dx || dy) {
            c.data.moved = !0;
            var s = c.elm.style;
            s.transform = s.WebkitTransform = "translate(" + dx + "px," + dy + "px)", s.transitionDuration = '0s';
        }
    }
    delete props.mode, /*  */ // install platform specific utils
    Vue1.config.mustUseProp = mustUseProp, Vue1.config.isReservedTag = isReservedTag, Vue1.config.isReservedAttr = isReservedAttr, Vue1.config.getTagNamespace = getTagNamespace, Vue1.config.isUnknownElement = function(tag) {
        /* istanbul ignore if */ if (!inBrowser) return !0;
        if (isReservedTag(tag)) return !1;
        /* istanbul ignore if */ if (null != unknownElementCache[tag = tag.toLowerCase()]) return unknownElementCache[tag];
        var el = document.createElement(tag);
        return tag.indexOf('-') > -1 ? unknownElementCache[tag] = el.constructor === window.HTMLUnknownElement || el.constructor === window.HTMLElement : unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString());
    }, // install platform runtime directives & components
    extend(Vue1.options.directives, {
        model: directive,
        show: {
            bind: function(el, ref, vnode) {
                var value = ref.value, transition$$1 = (vnode = locateNode(vnode)).data && vnode.data.transition, originalDisplay = el.__vOriginalDisplay = 'none' === el.style.display ? '' : el.style.display;
                value && transition$$1 ? (vnode.data.show = !0, enter(vnode, function() {
                    el.style.display = originalDisplay;
                })) : el.style.display = value ? originalDisplay : 'none';
            },
            update: function(el, ref, vnode) {
                var value = ref.value;
                /* istanbul ignore if */ !value != !ref.oldValue && ((vnode = locateNode(vnode)).data && vnode.data.transition ? (vnode.data.show = !0, value ? enter(vnode, function() {
                    el.style.display = el.__vOriginalDisplay;
                }) : leave(vnode, function() {
                    el.style.display = 'none';
                })) : el.style.display = value ? el.__vOriginalDisplay : 'none');
            },
            unbind: function(el, binding, vnode, oldVnode, isDestroy) {
                isDestroy || (el.style.display = el.__vOriginalDisplay);
            }
        }
    }), extend(Vue1.options.components, {
        Transition: {
            name: 'transition',
            props: transitionProps,
            abstract: !0,
            render: function(h) {
                var this$1 = this, children = this.$slots.default;
                if (children && // filter out text nodes (possible whitespaces)
                (children = children.filter(isNotTextNode)).length) {
                    children.length > 1 && warn("<transition> can only be used on a single element. Use <transition-group> for lists.", this.$parent);
                    var mode = this.mode;
                    mode && 'in-out' !== mode && 'out-in' !== mode && warn('invalid <transition> mode: ' + mode, this.$parent);
                    var rawChild = children[0];
                    // if this is a component root node and the component's
                    // parent container node also has transition, skip.
                    if (function(vnode) {
                        for(; vnode = vnode.parent;)if (vnode.data.transition) return !0;
                    }(this.$vnode)) return rawChild;
                    // apply transition data to child
                    // use getRealChild() to ignore abstract components e.g. keep-alive
                    var child = getRealChild(rawChild);
                    /* istanbul ignore if */ if (!child) return rawChild;
                    if (this._leaving) return placeholder(h, rawChild);
                    // ensure a key that is unique to the vnode type and to this transition
                    // component instance. This key will be used to remove pending leaving nodes
                    // during entering.
                    var id = "__transition-" + this._uid + "-";
                    child.key = null == child.key ? child.isComment ? id + 'comment' : id + child.tag : isPrimitive(child.key) ? 0 === String(child.key).indexOf(id) ? child.key : id + child.key : child.key;
                    var data = (child.data || (child.data = {})).transition = extractTransitionData(this), oldRawChild = this._vnode, oldChild = getRealChild(oldRawChild);
                    if (child.data.directives && child.data.directives.some(isVShowDirective) && (child.data.show = !0), oldChild && oldChild.data && (oldChild.key !== child.key || oldChild.tag !== child.tag) && !isAsyncPlaceholder(oldChild) && // #6687 component root is a comment node
                    !(oldChild.componentInstance && oldChild.componentInstance._vnode.isComment)) {
                        // replace old child transition data with fresh one
                        // important for dynamic transitions!
                        var oldData = oldChild.data.transition = extend({}, data);
                        // handle transition mode
                        if ('out-in' === mode) return(// return placeholder node and queue update when leave finishes
                        this._leaving = !0, mergeVNodeHook(oldData, 'afterLeave', function() {
                            this$1._leaving = !1, this$1.$forceUpdate();
                        }), placeholder(h, rawChild));
                        if ('in-out' === mode) {
                            if (isAsyncPlaceholder(child)) return oldRawChild;
                            var delayedLeave, performLeave = function() {
                                delayedLeave();
                            };
                            mergeVNodeHook(data, 'afterEnter', performLeave), mergeVNodeHook(data, 'enterCancelled', performLeave), mergeVNodeHook(oldData, 'delayLeave', function(leave) {
                                delayedLeave = leave;
                            });
                        }
                    }
                    return rawChild;
                }
            }
        },
        TransitionGroup: {
            props: props,
            beforeMount: function() {
                var this$1 = this, update = this._update;
                this._update = function(vnode, hydrating) {
                    var restoreActiveInstance = setActiveInstance(this$1);
                    // force removing pass
                    this$1.__patch__(this$1._vnode, this$1.kept, !1, !0 // removeOnly (!important, avoids unnecessary moves)
                    ), this$1._vnode = this$1.kept, restoreActiveInstance(), update.call(this$1, vnode, hydrating);
                };
            },
            render: function(h) {
                for(var tag = this.tag || this.$vnode.data.tag || 'span', map = Object.create(null), prevChildren = this.prevChildren = this.children, rawChildren = this.$slots.default || [], children = this.children = [], transitionData = extractTransitionData(this), i = 0; i < rawChildren.length; i++){
                    var c = rawChildren[i];
                    if (c.tag) {
                        if (null != c.key && 0 !== String(c.key).indexOf('__vlist')) children.push(c), map[c.key] = c, (c.data || (c.data = {})).transition = transitionData;
                        else {
                            var opts = c.componentOptions, name = opts ? opts.Ctor.options.name || opts.tag || '' : c.tag;
                            warn("<transition-group> children must be keyed: <" + name + ">");
                        }
                    }
                }
                if (prevChildren) {
                    for(var kept = [], removed = [], i$1 = 0; i$1 < prevChildren.length; i$1++){
                        var c$1 = prevChildren[i$1];
                        c$1.data.transition = transitionData, c$1.data.pos = c$1.elm.getBoundingClientRect(), map[c$1.key] ? kept.push(c$1) : removed.push(c$1);
                    }
                    this.kept = h(tag, null, kept), this.removed = removed;
                }
                return h(tag, null, children);
            },
            updated: function() {
                var children = this.prevChildren, moveClass = this.moveClass || (this.name || 'v') + '-move';
                children.length && this.hasMove(children[0].elm, moveClass) && (// we divide the work into three loops to avoid mixing DOM reads and writes
                // in each iteration - which helps prevent layout thrashing.
                children.forEach(callPendingCbs), children.forEach(recordPosition), children.forEach(applyTranslation), // force reflow to put everything in position
                // assign to this to avoid being removed in tree-shaking
                // $flow-disable-line
                this._reflow = document.body.offsetHeight, children.forEach(function(c) {
                    if (c.data.moved) {
                        var el = c.elm, s = el.style;
                        addTransitionClass(el, moveClass), s.transform = s.WebkitTransform = s.transitionDuration = '', el.addEventListener(transitionEndEvent, el._moveCb = function cb(e) {
                            (!e || e.target === el) && (!e || /transform$/.test(e.propertyName)) && (el.removeEventListener(transitionEndEvent, cb), el._moveCb = null, removeTransitionClass(el, moveClass));
                        });
                    }
                }));
            },
            methods: {
                hasMove: function(el, moveClass) {
                    /* istanbul ignore if */ if (!hasTransition) return !1;
                    /* istanbul ignore if */ if (this._hasMove) return this._hasMove;
                    // Detect whether an element with the move class applied has
                    // CSS transitions. Since the element may be inside an entering
                    // transition at this very moment, we make a clone of it and remove
                    // all other transition classes applied to ensure only the move class
                    // is applied.
                    var clone = el.cloneNode();
                    el._transitionClasses && el._transitionClasses.forEach(function(cls) {
                        removeClass(clone, cls);
                    }), addClass(clone, moveClass), clone.style.display = 'none', this.$el.appendChild(clone);
                    var info = getTransitionInfo(clone);
                    return this.$el.removeChild(clone), this._hasMove = info.hasTransform;
                }
            }
        }
    }), // install platform patch function
    Vue1.prototype.__patch__ = inBrowser ? patch : noop, // public mount method
    Vue1.prototype.$mount = function(el, hydrating) {
        var vm, el1, hydrating1, updateComponent;
        return el = el && inBrowser ? query(el) : void 0, vm = this, el1 = el, hydrating1 = hydrating, vm.$el = el1, vm.$options.render || (vm.$options.render = createEmptyVNode, vm.$options.template && '#' !== vm.$options.template.charAt(0) || vm.$options.el || el1 ? warn("You are using the runtime-only build of Vue where the template compiler is not available. Either pre-compile the templates into render functions, or use the compiler-included build.", vm) : warn('Failed to mount component: template or render function not defined.', vm)), callHook(vm, 'beforeMount'), updateComponent = config.performance && mark ? function() {
            var name = vm._name, id = vm._uid, startTag = "vue-perf-start:" + id, endTag = "vue-perf-end:" + id;
            mark(startTag);
            var vnode = vm._render();
            mark(endTag), measure("vue " + name + " render", startTag, endTag), mark(startTag), vm._update(vnode, hydrating1), mark(endTag), measure("vue " + name + " patch", startTag, endTag);
        } : function() {
            vm._update(vm._render(), hydrating1);
        }, // we set this to vm._watcher inside the watcher's constructor
        // since the watcher's initial patch may call $forceUpdate (e.g. inside child
        // component's mounted hook), which relies on vm._watcher being already defined
        new Watcher(vm, updateComponent, noop, {
            before: function() {
                vm._isMounted && !vm._isDestroyed && callHook(vm, 'beforeUpdate');
            }
        }, !0), hydrating1 = !1, null == vm.$vnode && (vm._isMounted = !0, callHook(vm, 'mounted')), vm;
    }, inBrowser && setTimeout(function() {
        config.devtools && (devtools ? devtools.emit('init', Vue1) : console[console.info ? 'info' : 'log']("Download the Vue Devtools extension for a better development experience:\nhttps://github.com/vuejs/vue-devtools")), !1 !== config.productionTip && 'undefined' != typeof console && console[console.info ? 'info' : 'log']("You are running Vue in development mode.\nMake sure to turn on production mode when deploying for production.\nSee more tips at https://vuejs.org/guide/deployment.html");
    }, 0);
    /*  */ var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g, regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g, buildRegex = cached(function(delimiters) {
        return RegExp(delimiters[0].replace(regexEscapeRE, '\\$&') + '((?:.|\\n)+?)' + delimiters[1].replace(regexEscapeRE, '\\$&'), 'g');
    });
    function parseText(text, delimiters) {
        var match, index, tokenValue, tagRE = delimiters ? buildRegex(delimiters) : defaultTagRE;
        if (tagRE.test(text)) {
            for(var tokens = [], rawTokens = [], lastIndex = tagRE.lastIndex = 0; match = tagRE.exec(text);){
                (index = match.index) > lastIndex && (rawTokens.push(tokenValue = text.slice(lastIndex, index)), tokens.push(JSON.stringify(tokenValue)));
                // tag token
                var exp = parseFilters(match[1].trim());
                tokens.push("_s(" + exp + ")"), rawTokens.push({
                    '@binding': exp
                }), lastIndex = index + match[0].length;
            }
            return lastIndex < text.length && (rawTokens.push(tokenValue = text.slice(lastIndex)), tokens.push(JSON.stringify(tokenValue))), {
                expression: tokens.join('+'),
                tokens: rawTokens
            };
        }
    }
    /*  */ var isUnaryTag = makeMap("area,base,br,col,embed,frame,hr,img,input,isindex,keygen,link,meta,param,source,track,wbr"), canBeLeftOpenTag = makeMap('colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source'), isNonPhrasingTag = makeMap("address,article,aside,base,blockquote,body,caption,col,colgroup,dd,details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,title,tr,track"), attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/, dynamicArgAttribute = /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/, ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z" + unicodeRegExp.source + "]*", qnameCapture = "((?:" + ncname + "\\:)?" + ncname + ")", startTagOpen = RegExp("^<" + qnameCapture), startTagClose = /^\s*(\/?)>/, endTag = RegExp("^<\\/" + qnameCapture + "[^>]*>"), doctype = /^<!DOCTYPE [^>]+>/i, comment = /^<!\--/, conditionalComment = /^<!\[/, isPlainTextElement = makeMap('script,style,textarea', !0), reCache = {}, decodingMap = {
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&amp;': '&',
        '&#10;': '\n',
        '&#9;': '\t',
        '&#39;': "'"
    }, encodedAttr = /&(?:lt|gt|quot|amp|#39);/g, encodedAttrWithNewLines = /&(?:lt|gt|quot|amp|#39|#10|#9);/g, isIgnoreNewlineTag = makeMap('pre,textarea', !0), shouldIgnoreFirstNewline = function(tag, html) {
        return tag && isIgnoreNewlineTag(tag) && '\n' === html[0];
    }, onRE = /^@|^v-on:/, dirRE = /^v-|^@|^:|^#/, forAliasRE = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/, forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/, stripParensRE = /^\(|\)$/g, dynamicArgRE = /^\[.*\]$/, argRE = /:(.*)$/, bindRE = /^:|^\.|^v-bind:/, modifierRE = /\.[^.\]]+(?=[^\]]*$)/g, slotRE = /^v-slot(:|$)|^#/, lineBreakRE = /[\r\n]/, whitespaceRE$1 = /\s+/g, invalidAttributeRE = /[\s"'<>\/=]/, decodeHTMLCached = cached(function(html) {
        return (decoder = decoder || document.createElement('div')).innerHTML = html, decoder.textContent;
    }), emptySlotScopeToken = "_empty_";
    function createASTElement(tag, attrs, parent) {
        return {
            type: 1,
            tag: tag,
            attrsList: attrs,
            attrsMap: function(attrs) {
                for(var map = {}, i = 0, l = attrs.length; i < l; i++)!map[attrs[i].name] || isIE || isEdge || warn$2('duplicate attribute: ' + attrs[i].name, attrs[i]), map[attrs[i].name] = attrs[i].value;
                return map;
            }(attrs),
            rawAttrsMap: {},
            parent: parent,
            children: []
        };
    }
    function processElement(element, options) {
        (function(el) {
            var exp = getBindingAttr(el, 'key');
            if (exp) {
                if ('template' === el.tag && warn$2("<template> cannot be keyed. Place the key on real elements instead.", getRawBindingAttr(el, 'key')), el.for) {
                    var iterator = el.iterator2 || el.iterator1, parent = el.parent;
                    iterator && iterator === exp && parent && 'transition-group' === parent.tag && warn$2("Do not use v-for index as key on <transition-group> children, this is the same as not using keys.", getRawBindingAttr(el, 'key'), !0);
                }
                el.key = exp;
            }
        })(element), // determine whether this is a plain element after
        // removing structural attributes
        element.plain = !element.key && !element.scopedSlots && !element.attrsList.length, (ref = getBindingAttr(el = element, 'ref')) && (el.ref = ref, el.refInFor = function(el) {
            for(var parent = el; parent;){
                if (void 0 !== parent.for) return !0;
                parent = parent.parent;
            }
            return !1;
        }(el)), // handle content being passed to a component as slot,
        // e.g. <template slot="xxx">, <div slot-scope="xxx">
        function(el) {
            'template' === el.tag ? ((slotScope = getAndRemoveAttr(el, 'scope')) && warn$2('the "scope" attribute for scoped slots have been deprecated and replaced by "slot-scope" since 2.5. The new "slot-scope" attribute can also be used on plain elements in addition to <template> to denote scoped slots.', el.rawAttrsMap.scope, !0), el.slotScope = slotScope || getAndRemoveAttr(el, 'slot-scope')) : (slotScope = getAndRemoveAttr(el, 'slot-scope')) && (el.attrsMap['v-for'] && warn$2("Ambiguous combined usage of slot-scope and v-for on <" + el.tag + "> (v-for takes higher priority). Use a wrapper <template> for the scoped slot to make it clearer.", el.rawAttrsMap['slot-scope'], !0), el.slotScope = slotScope);
            // slot="xxx"
            var slotScope, slotTarget = getBindingAttr(el, 'slot');
            if (slotTarget && (el.slotTarget = '""' === slotTarget ? '"default"' : slotTarget, el.slotTargetDynamic = !!(el.attrsMap[':slot'] || el.attrsMap['v-bind:slot']), 'template' === el.tag || el.slotScope || addAttr(el, 'slot', slotTarget, getRawBindingAttr(el, 'slot'))), 'template' === el.tag) {
                // v-slot on <template>
                var slotBinding = getAndRemoveAttrByRegex(el, slotRE);
                if (slotBinding) {
                    (el.slotTarget || el.slotScope) && warn$2("Unexpected mixed usage of different slot syntaxes.", el), el.parent && !maybeComponent(el.parent) && warn$2("<template v-slot> can only appear at the root level inside the receiving component", el);
                    var ref = getSlotName(slotBinding), name = ref.name, dynamic = ref.dynamic;
                    el.slotTarget = name, el.slotTargetDynamic = dynamic, el.slotScope = slotBinding.value || emptySlotScopeToken;
                }
            } else {
                // v-slot on component, denotes default slot
                var slotBinding$1 = getAndRemoveAttrByRegex(el, slotRE);
                if (slotBinding$1) {
                    maybeComponent(el) || warn$2("v-slot can only be used on components or <template>.", slotBinding$1), (el.slotScope || el.slotTarget) && warn$2("Unexpected mixed usage of different slot syntaxes.", el), el.scopedSlots && warn$2("To avoid scope ambiguity, the default slot should also use <template> syntax when there are other named slots.", slotBinding$1);
                    // add the component's children to its default slot
                    var slots = el.scopedSlots || (el.scopedSlots = {}), ref$1 = getSlotName(slotBinding$1), name$1 = ref$1.name, dynamic$1 = ref$1.dynamic, slotContainer = slots[name$1] = createASTElement('template', [], el);
                    slotContainer.slotTarget = name$1, slotContainer.slotTargetDynamic = dynamic$1, slotContainer.children = el.children.filter(function(c) {
                        if (!c.slotScope) return c.parent = slotContainer, !0;
                    }), slotContainer.slotScope = slotBinding$1.value || emptySlotScopeToken, // remove children as they are returned from scopedSlots now
                    el.children = [], // mark el non-plain so data gets generated
                    el.plain = !1;
                }
            }
        }(element), 'slot' === (el1 = element).tag && (el1.slotName = getBindingAttr(el1, 'name'), el1.key && warn$2("`key` does not work on <slot> because slots are abstract outlets and can possibly expand into multiple elements. Use the key on a wrapping element instead.", getRawBindingAttr(el1, 'key'))), (binding = getBindingAttr(el2 = element, 'is')) && (el2.component = binding), null != getAndRemoveAttr(el2, 'inline-template') && (el2.inlineTemplate = !0);
        for(var el, ref, el1, el2, binding, i = 0; i < transforms.length; i++)element = transforms[i](element, options) || element;
        return function(el) {
            var i, l, name, rawName, value, modifiers, syncGen, isDynamic, list = el.attrsList;
            for(i = 0, l = list.length; i < l; i++)if (name = rawName = list[i].name, value = list[i].value, dirRE.test(name)) {
                if (// mark element as dynamic
                el.hasBindings = !0, // modifiers
                (modifiers = function(name) {
                    var match = name.match(modifierRE);
                    if (match) {
                        var ret = {};
                        return match.forEach(function(m) {
                            ret[m.slice(1)] = !0;
                        }), ret;
                    }
                }(name.replace(dirRE, ''))) && (name = name.replace(modifierRE, '')), bindRE.test(name)) name = name.replace(bindRE, ''), value = parseFilters(value), (isDynamic = dynamicArgRE.test(name)) && (name = name.slice(1, -1)), 0 === value.trim().length && warn$2("The value for a v-bind expression cannot be empty. Found in \"v-bind:" + name + "\""), modifiers && (modifiers.prop && !isDynamic && 'innerHtml' === (name = camelize(name)) && (name = 'innerHTML'), modifiers.camel && !isDynamic && (name = camelize(name)), modifiers.sync && (syncGen = genAssignmentCode(value, "$event"), isDynamic ? // handler w/ dynamic event name
                addHandler(el, "\"update:\"+(" + name + ")", syncGen, null, !1, warn$2, list[i], !0 // dynamic
                ) : (addHandler(el, "update:" + camelize(name), syncGen, null, !1, warn$2, list[i]), hyphenate(name) !== camelize(name) && addHandler(el, "update:" + hyphenate(name), syncGen, null, !1, warn$2, list[i])))), modifiers && modifiers.prop || !el.component && platformMustUseProp(el.tag, el.attrsMap.type, name) ? addProp(el, name, value, list[i], isDynamic) : addAttr(el, name, value, list[i], isDynamic);
                else if (onRE.test(name)) name = name.replace(onRE, ''), (isDynamic = dynamicArgRE.test(name)) && (name = name.slice(1, -1)), addHandler(el, name, value, modifiers, !1, warn$2, list[i], isDynamic);
                else {
                    // parse arg
                    var name1, value1, arg, isDynamicArg, range, argMatch = (name = name.replace(dirRE, '')).match(argRE), arg1 = argMatch && argMatch[1];
                    isDynamic = !1, arg1 && (name = name.slice(0, -(arg1.length + 1)), dynamicArgRE.test(arg1) && (arg1 = arg1.slice(1, -1), isDynamic = !0)), name1 = name, value1 = value, arg = arg1, isDynamicArg = isDynamic, range = list[i], (el.directives || (el.directives = [])).push(rangeSetItem({
                        name: name1,
                        rawName: rawName,
                        value: value1,
                        arg: arg,
                        isDynamicArg: isDynamicArg,
                        modifiers: modifiers
                    }, range)), el.plain = !1, 'model' === name && function(el, value) {
                        for(var _el = el; _el;)_el.for && _el.alias === value && warn$2("<" + el.tag + " v-model=\"" + value + '">: You are binding v-model directly to a v-for iteration alias. This will not be able to modify the v-for source array because writing to the alias is like modifying a function local variable. Consider using an array of objects and use v-model on an object property instead.', el.rawAttrsMap['v-model']), _el = _el.parent;
                    }(el, value);
                }
            } else parseText(value, delimiters) && warn$2(name + "=\"" + value + '": Interpolation inside attributes has been removed. Use v-bind or the colon shorthand instead. For example, instead of <div id="{{ val }}">, use <div :id="val">.', list[i]), addAttr(el, name, JSON.stringify(value), list[i]), !el.component && 'muted' === name && platformMustUseProp(el.tag, el.attrsMap.type, name) && addProp(el, name, 'true', list[i]);
        }(element), element;
    }
    function processFor(el) {
        var exp;
        if (exp = getAndRemoveAttr(el, 'v-for')) {
            var res = function(exp) {
                var inMatch = exp.match(forAliasRE);
                if (inMatch) {
                    var res = {};
                    res.for = inMatch[2].trim();
                    var alias = inMatch[1].trim().replace(stripParensRE, ''), iteratorMatch = alias.match(forIteratorRE);
                    return iteratorMatch ? (res.alias = alias.replace(forIteratorRE, '').trim(), res.iterator1 = iteratorMatch[1].trim(), iteratorMatch[2] && (res.iterator2 = iteratorMatch[2].trim())) : res.alias = alias, res;
                }
            }(exp);
            res ? extend(el, res) : warn$2("Invalid v-for expression: " + exp, el.rawAttrsMap['v-for']);
        }
    }
    function addIfCondition(el, condition) {
        el.ifConditions || (el.ifConditions = []), el.ifConditions.push(condition);
    }
    function getSlotName(binding) {
        var name = binding.name.replace(slotRE, '');
        return name || ('#' !== binding.name[0] ? name = 'default' : warn$2("v-slot shorthand syntax requires a slot name.", binding)), dynamicArgRE.test(name) ? {
            name: name.slice(1, -1),
            dynamic: !0
        } : {
            name: "\"" + name + "\"",
            dynamic: !1
        };
    }
    var ieNSBug = /^xmlns:NS\d+/, ieNSPrefix = /^NS\d+:/;
    function cloneASTElement(el) {
        return createASTElement(el.tag, el.attrsList.slice(), el.parent);
    }
    var modules$1 = [
        {
            staticKeys: [
                'staticClass'
            ],
            transformNode: /*  */ function(el, options) {
                var warn = options.warn || baseWarn, staticClass = getAndRemoveAttr(el, 'class');
                staticClass && parseText(staticClass, options.delimiters) && warn("class=\"" + staticClass + '": Interpolation inside attributes has been removed. Use v-bind or the colon shorthand instead. For example, instead of <div class="{{ val }}">, use <div :class="val">.', el.rawAttrsMap.class), staticClass && (el.staticClass = JSON.stringify(staticClass));
                var classBinding = getBindingAttr(el, 'class', !1);
                classBinding && (el.classBinding = classBinding);
            },
            genData: function(el) {
                var data = '';
                return el.staticClass && (data += "staticClass:" + el.staticClass + ","), el.classBinding && (data += "class:" + el.classBinding + ","), data;
            }
        },
        {
            staticKeys: [
                'staticStyle'
            ],
            transformNode: /*  */ function(el, options) {
                var warn = options.warn || baseWarn, staticStyle = getAndRemoveAttr(el, 'style');
                staticStyle && (parseText(staticStyle, options.delimiters) && warn("style=\"" + staticStyle + '": Interpolation inside attributes has been removed. Use v-bind or the colon shorthand instead. For example, instead of <div style="{{ val }}">, use <div :style="val">.', el.rawAttrsMap.style), el.staticStyle = JSON.stringify(parseStyleText(staticStyle)));
                var styleBinding = getBindingAttr(el, 'style', !1);
                styleBinding && (el.styleBinding = styleBinding);
            },
            genData: function(el) {
                var data = '';
                return el.staticStyle && (data += "staticStyle:" + el.staticStyle + ","), el.styleBinding && (data += "style:(" + el.styleBinding + "),"), data;
            }
        },
        {
            preTransformNode: /*  */ function(el, options) {
                if ('input' === el.tag) {
                    var typeBinding, map = el.attrsMap;
                    if (map['v-model'] && ((map[':type'] || map['v-bind:type']) && (typeBinding = getBindingAttr(el, 'type')), map.type || typeBinding || !map['v-bind'] || (typeBinding = "(" + map['v-bind'] + ").type"), typeBinding)) {
                        var ifCondition = getAndRemoveAttr(el, 'v-if', !0), ifConditionExtra = ifCondition ? "&&(" + ifCondition + ")" : "", hasElse = null != getAndRemoveAttr(el, 'v-else', !0), elseIfCondition = getAndRemoveAttr(el, 'v-else-if', !0), branch0 = cloneASTElement(el);
                        // process for on the main node
                        processFor(branch0), addRawAttr(branch0, 'type', 'checkbox'), processElement(branch0, options), branch0.processed = !0, branch0.if = "(" + typeBinding + ")==='checkbox'" + ifConditionExtra, addIfCondition(branch0, {
                            exp: branch0.if,
                            block: branch0
                        });
                        // 2. add radio else-if condition
                        var branch1 = cloneASTElement(el);
                        getAndRemoveAttr(branch1, 'v-for', !0), addRawAttr(branch1, 'type', 'radio'), processElement(branch1, options), addIfCondition(branch0, {
                            exp: "(" + typeBinding + ")==='radio'" + ifConditionExtra,
                            block: branch1
                        });
                        // 3. other
                        var branch2 = cloneASTElement(el);
                        return getAndRemoveAttr(branch2, 'v-for', !0), addRawAttr(branch2, ':type', typeBinding), processElement(branch2, options), addIfCondition(branch0, {
                            exp: ifCondition,
                            block: branch2
                        }), hasElse ? branch0.else = !0 : elseIfCondition && (branch0.elseif = elseIfCondition), branch0;
                    }
                }
            }
        }
    ], baseOptions = {
        expectHTML: !0,
        modules: modules$1,
        directives: {
            model: function(el, dir, _warn) {
                warn$1 = _warn;
                var code, number, valueBinding, trueValueBinding, falseValueBinding, number1, valueBinding1, value = dir.value, modifiers = dir.modifiers, tag = el.tag, type = el.attrsMap.type;
                if ('input' === tag && 'file' === type && warn$1("<" + el.tag + " v-model=\"" + value + '" type="file">:\nFile inputs are read only. Use a v-on:change listener instead.', el.rawAttrsMap['v-model']), el.component) // component v-model doesn't need extra runtime
                return genComponentModel(el, value, modifiers), !1;
                if ('select' === tag) addHandler(el, 'change', 'var $$selectedVal = Array.prototype.filter.call($event.target.options,function(o){return o.selected}).map(function(o){var val = "_value" in o ? o._value : o.value;return ' + (modifiers && modifiers.number ? '_n(val)' : 'val') + "}); " + genAssignmentCode(value, '$event.target.multiple ? $$selectedVal : $$selectedVal[0]'), null, !0);
                else if ('input' === tag && 'checkbox' === type) number = modifiers && modifiers.number, valueBinding = getBindingAttr(el, 'value') || 'null', trueValueBinding = getBindingAttr(el, 'true-value') || 'true', falseValueBinding = getBindingAttr(el, 'false-value') || 'false', addProp(el, 'checked', "Array.isArray(" + value + ")?_i(" + value + "," + valueBinding + ")>-1" + ('true' === trueValueBinding ? ":(" + value + ")" : ":_q(" + value + "," + trueValueBinding + ")")), addHandler(el, 'change', "var $$a=" + value + ",$$el=$event.target,$$c=$$el.checked?(" + trueValueBinding + "):(" + falseValueBinding + ");if(Array.isArray($$a)){var $$v=" + (number ? '_n(' + valueBinding + ')' : valueBinding) + ",$$i=_i($$a,$$v);if($$el.checked){$$i<0&&(" + genAssignmentCode(value, '$$a.concat([$$v])') + ")}else{$$i>-1&&(" + genAssignmentCode(value, '$$a.slice(0,$$i).concat($$a.slice($$i+1))') + ")}}else{" + genAssignmentCode(value, '$$c') + "}", null, !0);
                else if ('input' === tag && 'radio' === type) number1 = modifiers && modifiers.number, valueBinding1 = getBindingAttr(el, 'value') || 'null', addProp(el, 'checked', "_q(" + value + "," + (valueBinding1 = number1 ? "_n(" + valueBinding1 + ")" : valueBinding1) + ")"), addHandler(el, 'change', genAssignmentCode(value, valueBinding1), null, !0);
                else if ('input' === tag || 'textarea' === tag) !function(el, value, modifiers) {
                    var type = el.attrsMap.type, value$1 = el.attrsMap['v-bind:value'] || el.attrsMap[':value'], typeBinding = el.attrsMap['v-bind:type'] || el.attrsMap[':type'];
                    if (value$1 && !typeBinding) {
                        var binding = el.attrsMap['v-bind:value'] ? 'v-bind:value' : ':value';
                        warn$1(binding + "=\"" + value$1 + '" conflicts with v-model on the same element because the latter already expands to a value binding internally', el.rawAttrsMap[binding]);
                    }
                    var ref = modifiers || {}, lazy = ref.lazy, number = ref.number, trim = ref.trim, valueExpression = '$event.target.value';
                    trim && (valueExpression = "$event.target.value.trim()"), number && (valueExpression = "_n(" + valueExpression + ")");
                    var code = genAssignmentCode(value, valueExpression);
                    lazy || 'range' === type || (code = "if($event.target.composing)return;" + code), addProp(el, 'value', "(" + value + ")"), addHandler(el, lazy ? 'change' : 'range' === type ? '__r' : 'input', code, null, !0), (trim || number) && addHandler(el, 'blur', '$forceUpdate()');
                }(el, value, modifiers);
                else {
                    if (!config.isReservedTag(tag)) // component v-model doesn't need extra runtime
                    return genComponentModel(el, value, modifiers), !1;
                    warn$1("<" + el.tag + " v-model=\"" + value + "\">: v-model is not supported on this element type. If you are working with contenteditable, it's recommended to wrap a library dedicated for that purpose inside a custom component.", el.rawAttrsMap['v-model']);
                }
                // ensure runtime directive metadata
                return !0;
            },
            text: /*  */ function(el, dir) {
                dir.value && addProp(el, 'textContent', "_s(" + dir.value + ")", dir);
            },
            html: /*  */ function(el, dir) {
                dir.value && addProp(el, 'innerHTML', "_s(" + dir.value + ")", dir);
            }
        },
        isPreTag: function(tag) {
            return 'pre' === tag;
        },
        isUnaryTag: isUnaryTag,
        mustUseProp: mustUseProp,
        canBeLeftOpenTag: canBeLeftOpenTag,
        isReservedTag: isReservedTag,
        getTagNamespace: getTagNamespace,
        staticKeys: modules$1.reduce(function(keys, m) {
            return keys.concat(m.staticKeys || []);
        }, []).join(',')
    }, genStaticKeysCached = cached(function(keys) {
        return makeMap('type,tag,attrsList,attrsMap,plain,parent,children,attrs,start,end,rawAttrsMap' + (keys ? ',' + keys : ''));
    }), fnExpRE = /^([\w$_]+|\([^)]*?\))\s*=>|^function(?:\s+[\w$]+)?\s*\(/, fnInvokeRE = /\([^)]*?\);*$/, simplePathRE = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['[^']*?']|\["[^"]*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*$/, keyCodes = {
        esc: 27,
        tab: 9,
        enter: 13,
        space: 32,
        up: 38,
        left: 37,
        right: 39,
        down: 40,
        delete: [
            8,
            46
        ]
    }, keyNames = {
        // #7880: IE11 and Edge use `Esc` for Escape key name.
        esc: [
            'Esc',
            'Escape'
        ],
        tab: 'Tab',
        enter: 'Enter',
        // #9112: IE11 uses `Spacebar` for Space key name.
        space: [
            ' ',
            'Spacebar'
        ],
        // #7806: IE11 uses key names without `Arrow` prefix for arrow keys.
        up: [
            'Up',
            'ArrowUp'
        ],
        left: [
            'Left',
            'ArrowLeft'
        ],
        right: [
            'Right',
            'ArrowRight'
        ],
        down: [
            'Down',
            'ArrowDown'
        ],
        // #9112: IE11 uses `Del` for Delete key name.
        delete: [
            'Backspace',
            'Delete',
            'Del'
        ]
    }, genGuard = function(condition) {
        return "if(" + condition + ")return null;";
    }, modifierCode = {
        stop: '$event.stopPropagation();',
        prevent: '$event.preventDefault();',
        self: genGuard("$event.target !== $event.currentTarget"),
        ctrl: genGuard("!$event.ctrlKey"),
        shift: genGuard("!$event.shiftKey"),
        alt: genGuard("!$event.altKey"),
        meta: genGuard("!$event.metaKey"),
        left: genGuard("'button' in $event && $event.button !== 0"),
        middle: genGuard("'button' in $event && $event.button !== 1"),
        right: genGuard("'button' in $event && $event.button !== 2")
    };
    function genHandlers(events, isNative) {
        var prefix = isNative ? 'nativeOn:' : 'on:', staticHandlers = "", dynamicHandlers = "";
        for(var name in events){
            var handlerCode = function genHandler(handler) {
                if (!handler) return 'function(){}';
                if (Array.isArray(handler)) return "[" + handler.map(function(handler) {
                    return genHandler(handler);
                }).join(',') + "]";
                var isMethodPath = simplePathRE.test(handler.value), isFunctionExpression = fnExpRE.test(handler.value), isFunctionInvocation = simplePathRE.test(handler.value.replace(fnInvokeRE, ''));
                if (handler.modifiers) {
                    var code = '', genModifierCode = '', keys = [];
                    for(var key in handler.modifiers)if (modifierCode[key]) genModifierCode += modifierCode[key], keyCodes[key] && keys.push(key);
                    else if ('exact' === key) {
                        var modifiers = handler.modifiers;
                        genModifierCode += genGuard([
                            'ctrl',
                            'shift',
                            'alt',
                            'meta'
                        ].filter(function(keyModifier) {
                            return !modifiers[keyModifier];
                        }).map(function(keyModifier) {
                            return "$event." + keyModifier + "Key";
                        }).join('||'));
                    } else keys.push(key);
                    return keys.length && (code += // make sure the key filters only apply to KeyboardEvents
                    // #9441: can't use 'keyCode' in $event because Chrome autofill fires fake
                    // key events that do not have keyCode property...
                    "if(!$event.type.indexOf('key')&&" + keys.map(genFilterCode).join('&&') + ")return null;"), genModifierCode && (code += genModifierCode), "function($event){" + code + (isMethodPath ? "return " + handler.value + "($event)" : isFunctionExpression ? "return (" + handler.value + ")($event)" : isFunctionInvocation ? "return " + handler.value : handler.value) + "}";
                }
                return isMethodPath || isFunctionExpression ? handler.value : "function($event){" + (isFunctionInvocation ? "return " + handler.value : handler.value) + "}" // inline statement
                ;
            }(events[name]);
            events[name] && events[name].dynamic ? dynamicHandlers += name + "," + handlerCode + "," : staticHandlers += "\"" + name + "\":" + handlerCode + ",";
        }
        return (staticHandlers = "{" + staticHandlers.slice(0, -1) + "}", dynamicHandlers) ? prefix + "_d(" + staticHandlers + ",[" + dynamicHandlers.slice(0, -1) + "])" : prefix + staticHandlers;
    }
    function genFilterCode(key) {
        var keyVal = parseInt(key, 10);
        if (keyVal) return "$event.keyCode!==" + keyVal;
        var keyCode = keyCodes[key], keyName = keyNames[key];
        return "_k($event.keyCode," + JSON.stringify(key) + "," + JSON.stringify(keyCode) + ",$event.key," + JSON.stringify(keyName) + ")";
    }
    /*  */ var baseDirectives = {
        on: /*  */ function(el, dir) {
            dir.modifiers && warn("v-on without argument does not support modifiers."), el.wrapListeners = function(code) {
                return "_g(" + code + "," + dir.value + ")";
            };
        },
        bind: /*  */ function(el, dir) {
            el.wrapData = function(code) {
                return "_b(" + code + ",'" + el.tag + "'," + dir.value + "," + (dir.modifiers && dir.modifiers.prop ? 'true' : 'false') + (dir.modifiers && dir.modifiers.sync ? ',true' : '') + ")";
            };
        },
        cloak: noop
    }, CodegenState = function(options) {
        this.options = options, this.warn = options.warn || baseWarn, this.transforms = pluckModuleFunction(options.modules, 'transformCode'), this.dataGenFns = pluckModuleFunction(options.modules, 'genData'), this.directives = extend(extend({}, baseDirectives), options.directives);
        var isReservedTag = options.isReservedTag || no;
        this.maybeComponent = function(el) {
            return !!el.component || !isReservedTag(el.tag);
        }, this.onceId = 0, this.staticRenderFns = [], this.pre = !1;
    };
    function generate(ast, options) {
        var state = new CodegenState(options);
        return {
            render: "with(this){return " + (ast ? genElement(ast, state) : '_c("div")') + "}",
            staticRenderFns: state.staticRenderFns
        };
    }
    function genElement(el, state) {
        if (el.parent && (el.pre = el.pre || el.parent.pre), el.staticRoot && !el.staticProcessed) return genStatic(el, state);
        if (el.once && !el.onceProcessed) return genOnce(el, state);
        if (el.for && !el.forProcessed) return genFor(el, state);
        if (el.if && !el.ifProcessed) return genIf(el, state);
        if ('template' === el.tag && !el.slotTarget && !state.pre) return genChildren(el, state) || 'void 0';
        if ('slot' === el.tag) return res = "_t(" + (el.slotName || '"default"') + ((children = genChildren(el, state)) ? "," + children : ''), attrs = el.attrs || el.dynamicAttrs ? genProps((el.attrs || []).concat(el.dynamicAttrs || []).map(function(attr) {
            return {
                // slot props are camelized
                name: camelize(attr.name),
                value: attr.value,
                dynamic: attr.dynamic
            };
        })) : null, bind$$1 = el.attrsMap['v-bind'], (attrs || bind$$1) && !children && (res += ",null"), attrs && (res += "," + attrs), bind$$1 && (res += (attrs ? '' : ',null') + "," + bind$$1), res + ')';
        if (el.component) componentName = el.component, children1 = el.inlineTemplate ? null : genChildren(el, state, !0), code = "_c(" + componentName + "," + genData$2(el, state) + (children1 ? "," + children1 : '') + ")";
        else {
            (!el.plain || el.pre && state.maybeComponent(el)) && (data = genData$2(el, state));
            var children, res, attrs, bind$$1, code, componentName, children1, data, children2 = el.inlineTemplate ? null : genChildren(el, state, !0);
            code = "_c('" + el.tag + "'" + (data ? "," + data : '') + (children2 ? "," + children2 : '') + ")";
        }
        // module transforms
        for(var i = 0; i < state.transforms.length; i++)code = state.transforms[i](el, code);
        return code;
    }
    // hoist static sub-trees out
    function genStatic(el, state) {
        el.staticProcessed = !0;
        // Some elements (templates) need to behave differently inside of a v-pre
        // node.  All pre nodes are static roots, so we can use this as a location to
        // wrap a state change and reset it upon exiting the pre node.
        var originalPreState = state.pre;
        return el.pre && (state.pre = el.pre), state.staticRenderFns.push("with(this){return " + genElement(el, state) + "}"), state.pre = originalPreState, "_m(" + (state.staticRenderFns.length - 1) + (el.staticInFor ? ',true' : '') + ")";
    }
    // v-once
    function genOnce(el, state) {
        if (el.onceProcessed = !0, el.if && !el.ifProcessed) return genIf(el, state);
        if (!el.staticInFor) return genStatic(el, state);
        for(var key = '', parent = el.parent; parent;){
            if (parent.for) {
                key = parent.key;
                break;
            }
            parent = parent.parent;
        }
        return key ? "_o(" + genElement(el, state) + "," + state.onceId++ + "," + key + ")" : (state.warn("v-once can only be used inside v-for that is keyed. ", el.rawAttrsMap['v-once']), genElement(el, state));
    }
    function genIf(el, state, altGen, altEmpty) {
        return el.ifProcessed = !0, function genIfConditions(conditions, state, altGen, altEmpty) {
            if (!conditions.length) return altEmpty || '_e()';
            var condition = conditions.shift();
            if (condition.exp) return "(" + condition.exp + ")?" + genTernaryExp(condition.block) + ":" + genIfConditions(conditions, state, altGen, altEmpty);
            return "" + genTernaryExp(condition.block);
            // v-if with v-once should generate code like (a)?_m(0):_m(1)
            function genTernaryExp(el) {
                return altGen ? altGen(el, state) : el.once ? genOnce(el, state) : genElement(el, state);
            }
        }(el.ifConditions.slice(), state, altGen, altEmpty);
    }
    function genFor(el, state, altGen, altHelper) {
        var exp = el.for, alias = el.alias, iterator1 = el.iterator1 ? "," + el.iterator1 : '', iterator2 = el.iterator2 ? "," + el.iterator2 : '';
        return state.maybeComponent(el) && 'slot' !== el.tag && 'template' !== el.tag && !el.key && state.warn("<" + el.tag + " v-for=\"" + alias + " in " + exp + '">: component lists rendered with v-for should have explicit keys. See https://vuejs.org/guide/list.html#key for more info.', el.rawAttrsMap['v-for'], !0), el.forProcessed = !0, (altHelper || '_l') + "((" + exp + "),function(" + alias + iterator1 + iterator2 + "){return " + (altGen || genElement)(el, state) + '})';
    }
    function genData$2(el, state) {
        var data = '{', dirs = function(el, state) {
            var i, l, dir, needRuntime, dirs = el.directives;
            if (dirs) {
                var res = 'directives:[', hasRuntime = !1;
                for(i = 0, l = dirs.length; i < l; i++){
                    dir = dirs[i], needRuntime = !0;
                    var gen = state.directives[dir.name];
                    gen && // compile-time directive that manipulates AST.
                    // returns true if it also needs a runtime counterpart.
                    (needRuntime = !!gen(el, dir, state.warn)), needRuntime && (hasRuntime = !0, res += "{name:\"" + dir.name + "\",rawName:\"" + dir.rawName + "\"" + (dir.value ? ",value:(" + dir.value + "),expression:" + JSON.stringify(dir.value) : '') + (dir.arg ? ",arg:" + (dir.isDynamicArg ? dir.arg : "\"" + dir.arg + "\"") : '') + (dir.modifiers ? ",modifiers:" + JSON.stringify(dir.modifiers) : '') + "},");
                }
                if (hasRuntime) return res.slice(0, -1) + ']';
            }
        }(el, state);
        dirs && (data += dirs + ','), el.key && (data += "key:" + el.key + ","), el.ref && (data += "ref:" + el.ref + ","), el.refInFor && (data += "refInFor:true,"), el.pre && (data += "pre:true,"), el.component && (data += "tag:\"" + el.tag + "\",");
        // module data generation functions
        for(var i = 0; i < state.dataGenFns.length; i++)data += state.dataGenFns[i](el);
        // inline-template
        if (el.attrs && (data += "attrs:" + genProps(el.attrs) + ","), el.props && (data += "domProps:" + genProps(el.props) + ","), el.events && (data += genHandlers(el.events, !1) + ","), el.nativeEvents && (data += genHandlers(el.nativeEvents, !0) + ","), el.slotTarget && !el.slotScope && (data += "slot:" + el.slotTarget + ","), el.scopedSlots && (data += function(el, slots, state) {
            // by default scoped slots are considered "stable", this allows child
            // components with only scoped slots to skip forced updates from parent.
            // but in some cases we have to bail-out of this optimization
            // for example if the slot contains dynamic names, has v-if or v-for on them...
            var needsForceUpdate = el.for || Object.keys(slots).some(function(key) {
                var slot = slots[key];
                return slot.slotTargetDynamic || slot.if || slot.for || function containsSlotChild(el) {
                    return 1 === el.type && ('slot' === el.tag || el.children.some(containsSlotChild));
                }(slot) // is passing down slot from parent which may be dynamic
                ;
            }), needsKey = !!el.if;
            // OR when it is inside another scoped slot or v-for (the reactivity may be
            // disconnected due to the intermediate scope variable)
            // #9438, #9506
            // TODO: this can be further optimized by properly analyzing in-scope bindings
            // and skip force updating ones that do not actually use scope variables.
            if (!needsForceUpdate) for(var parent = el.parent; parent;){
                if (parent.slotScope && parent.slotScope !== emptySlotScopeToken || parent.for) {
                    needsForceUpdate = !0;
                    break;
                }
                parent.if && (needsKey = !0), parent = parent.parent;
            }
            var generatedSlots = Object.keys(slots).map(function(key) {
                return function genScopedSlot(el, state) {
                    var isLegacySyntax = el.attrsMap['slot-scope'];
                    if (el.if && !el.ifProcessed && !isLegacySyntax) return genIf(el, state, genScopedSlot, "null");
                    if (el.for && !el.forProcessed) return genFor(el, state, genScopedSlot);
                    var slotScope = el.slotScope === emptySlotScopeToken ? "" : String(el.slotScope), fn = "function(" + slotScope + "){return " + ('template' === el.tag ? el.if && isLegacySyntax ? "(" + el.if + ")?" + (genChildren(el, state) || 'undefined') + ":undefined" : genChildren(el, state) || 'undefined' : genElement(el, state)) + "}";
                    return "{key:" + (el.slotTarget || "\"default\"") + ",fn:" + fn + (slotScope ? "" : ",proxy:true") + "}";
                }(slots[key], state);
            }).join(',');
            return "scopedSlots:_u([" + generatedSlots + "]" + (needsForceUpdate ? ",null,true" : "") + (!needsForceUpdate && needsKey ? ",null,false," + function(str) {
                for(var hash = 5381, i = str.length; i;)hash = 33 * hash ^ str.charCodeAt(--i);
                return hash >>> 0;
            }(generatedSlots) : "") + ")";
        }(el, el.scopedSlots, state) + ","), el.model && (data += "model:{value:" + el.model.value + ",callback:" + el.model.callback + ",expression:" + el.model.expression + "},"), el.inlineTemplate) {
            var inlineTemplate = function(el, state) {
                var ast = el.children[0];
                if ((1 !== el.children.length || 1 !== ast.type) && state.warn('Inline-template components must have exactly one child element.', {
                    start: el.start
                }), ast && 1 === ast.type) {
                    var inlineRenderFns = generate(ast, state.options);
                    return "inlineTemplate:{render:function(){" + inlineRenderFns.render + "},staticRenderFns:[" + inlineRenderFns.staticRenderFns.map(function(code) {
                        return "function(){" + code + "}";
                    }).join(',') + "]}";
                }
            }(el, state);
            inlineTemplate && (data += inlineTemplate + ",");
        }
        return data = data.replace(/,$/, '') + '}', el.dynamicAttrs && (data = "_b(" + data + ",\"" + el.tag + "\"," + genProps(el.dynamicAttrs) + ")"), el.wrapData && (data = el.wrapData(data)), el.wrapListeners && (data = el.wrapListeners(data)), data;
    }
    function genChildren(el, state, checkSkip, altGenElement, altGenNode) {
        var children = el.children;
        if (children.length) {
            var el$1 = children[0];
            // optimize single v-for
            if (1 === children.length && el$1.for && 'template' !== el$1.tag && 'slot' !== el$1.tag) {
                var normalizationType = checkSkip ? state.maybeComponent(el$1) ? ",1" : ",0" : "";
                return "" + (altGenElement || genElement)(el$1, state) + normalizationType;
            }
            var normalizationType$1 = checkSkip ? // determine the normalization needed for the children array.
            // 0: no normalization needed
            // 1: simple normalization needed (possible 1-level deep nested array)
            // 2: full normalization needed
            function(children, maybeComponent) {
                for(var res = 0, i = 0; i < children.length; i++){
                    var el = children[i];
                    if (1 === el.type) {
                        if (needsNormalization(el) || el.ifConditions && el.ifConditions.some(function(c) {
                            return needsNormalization(c.block);
                        })) {
                            res = 2;
                            break;
                        }
                        (maybeComponent(el) || el.ifConditions && el.ifConditions.some(function(c) {
                            return maybeComponent(c.block);
                        })) && (res = 1);
                    }
                }
                return res;
            }(children, state.maybeComponent) : 0, gen = altGenNode || genNode;
            return "[" + children.map(function(c) {
                return gen(c, state);
            }).join(',') + "]" + (normalizationType$1 ? "," + normalizationType$1 : '');
        }
    }
    function needsNormalization(el) {
        return void 0 !== el.for || 'template' === el.tag || 'slot' === el.tag;
    }
    function genNode(node, state) {
        return 1 === node.type ? genElement(node, state) : 3 === node.type && node.isComment ? "_e(" + JSON.stringify(node.text) + ")" : "_v(" + (2 === node.type ? node.expression // no need for () because already wrapped in _s()
         : transformSpecialNewlines(JSON.stringify(node.text))) + ")";
    }
    function genProps(props) {
        for(var staticProps = "", dynamicProps = "", i = 0; i < props.length; i++){
            var prop = props[i], value = transformSpecialNewlines(prop.value);
            prop.dynamic ? dynamicProps += prop.name + "," + value + "," : staticProps += "\"" + prop.name + "\":" + value + ",";
        }
        return (staticProps = "{" + staticProps.slice(0, -1) + "}", dynamicProps) ? "_d(" + staticProps + ",[" + dynamicProps.slice(0, -1) + "])" : staticProps;
    }
    // #3895, #4268
    function transformSpecialNewlines(text) {
        return text.replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
    }
    /*  */ // these keywords should not appear inside expressions, but operators like
    // typeof, instanceof and in are allowed
    var prohibitedKeywordRE = RegExp('\\b' + "do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const,super,throw,while,yield,delete,export,import,return,switch,default,extends,finally,continue,debugger,function,arguments".split(',').join('\\b|\\b') + '\\b'), unaryOperatorsRE = RegExp('\\b' + 'delete,typeof,void'.split(',').join('\\s*\\([^\\)]*\\)|\\b') + '\\s*\\([^\\)]*\\)'), stripStringRE = /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`/g;
    function checkIdentifier(ident, type, text, warn, range) {
        if ('string' == typeof ident) try {
            Function("var " + ident + "=_");
        } catch (e) {
            warn("invalid " + type + " \"" + ident + "\" in expression: " + text.trim(), range);
        }
    }
    function checkExpression(exp, text, warn, range) {
        try {
            Function("return " + exp);
        } catch (e) {
            var keywordMatch = exp.replace(stripStringRE, '').match(prohibitedKeywordRE);
            warn(keywordMatch ? 'avoid using JavaScript keyword as property name: "' + keywordMatch[0] + "\"\n  Raw expression: " + text.trim() : "invalid expression: " + e.message + " in\n\n    " + exp + "\n\n  Raw expression: " + text.trim() + "\n", range);
        }
    }
    function repeat$1(str, n) {
        var result = '';
        if (n > 0) for(; 1 & n && (result += str), !((n >>>= 1) <= 0);)str += str;
        return result;
    }
    /*  */ function createFunction(code, errors) {
        try {
            return Function(code);
        } catch (err) {
            return errors.push({
                err: err,
                code: code
            }), noop;
        }
    }
    /*  */ var ref$1 = (baseCompile = function(template, options) {
        var ast = /**
   * Convert HTML string to AST.
   */ function(template, options) {
            warn$2 = options.warn || baseWarn, platformIsPreTag = options.isPreTag || no, platformMustUseProp = options.mustUseProp || no, platformGetTagNamespace = options.getTagNamespace || no;
            var root, currentParent, isReservedTag = options.isReservedTag || no;
            maybeComponent = function(el) {
                return !!el.component || !isReservedTag(el.tag);
            }, transforms = pluckModuleFunction(options.modules, 'transformNode'), preTransforms = pluckModuleFunction(options.modules, 'preTransformNode'), postTransforms = pluckModuleFunction(options.modules, 'postTransformNode'), delimiters = options.delimiters;
            var stack = [], preserveWhitespace = !1 !== options.preserveWhitespace, whitespaceOption = options.whitespace, inVPre = !1, inPre = !1, warned = !1;
            function warnOnce(msg, range) {
                warned || (warned = !0, warn$2(msg, range));
            }
            function closeElement(element) {
                if (trimEndingWhitespace(element), inVPre || element.processed || (element = processElement(element, options)), stack.length || element === root || (root.if && (element.elseif || element.else) ? (checkRootConstraints(element), addIfCondition(root, {
                    exp: element.elseif,
                    block: element
                })) : warnOnce("Component template should contain exactly one root element. If you are using v-if on multiple elements, use v-else-if to chain them instead.", {
                    start: element.start
                })), currentParent && !element.forbidden) {
                    if (element.elseif || element.else) {
                        var el, prev;
                        el = element, (prev = function(children) {
                            for(var i = children.length; i--;){
                                if (1 === children[i].type) return children[i];
                                ' ' !== children[i].text && warn$2("text \"" + children[i].text.trim() + '" between v-if and v-else(-if) will be ignored.', children[i]), children.pop();
                            }
                        }(currentParent.children)) && prev.if ? addIfCondition(prev, {
                            exp: el.elseif,
                            block: el
                        }) : warn$2("v-" + (el.elseif ? 'else-if="' + el.elseif + '"' : 'else') + " used on element <" + el.tag + "> without corresponding v-if.", el.rawAttrsMap[el.elseif ? 'v-else-if' : 'v-else']);
                    } else {
                        if (element.slotScope) {
                            // scoped slot
                            // keep it in the children list so that v-else(-if) conditions can
                            // find it as the prev node.
                            var name = element.slotTarget || '"default"';
                            (currentParent.scopedSlots || (currentParent.scopedSlots = {}))[name] = element;
                        }
                        currentParent.children.push(element), element.parent = currentParent;
                    }
                }
                // final children cleanup
                // filter out scoped slots
                element.children = element.children.filter(function(c) {
                    return !c.slotScope;
                }), // remove trailing whitespace node again
                trimEndingWhitespace(element), element.pre && (inVPre = !1), platformIsPreTag(element.tag) && (inPre = !1);
                // apply post-transforms
                for(var i = 0; i < postTransforms.length; i++)postTransforms[i](element, options);
            }
            function trimEndingWhitespace(el) {
                // remove trailing whitespace node
                if (!inPre) for(var lastNode; (lastNode = el.children[el.children.length - 1]) && 3 === lastNode.type && ' ' === lastNode.text;)el.children.pop();
            }
            function checkRootConstraints(el) {
                ('slot' === el.tag || 'template' === el.tag) && warnOnce("Cannot use <" + el.tag + "> as component root element because it may contain multiple nodes.", {
                    start: el.start
                }), el.attrsMap.hasOwnProperty('v-for') && warnOnce("Cannot use v-for on stateful component root element because it renders multiple elements.", el.rawAttrsMap['v-for']);
            }
            return function(html, options) {
                for(var last, lastTag, stack = [], expectHTML = options.expectHTML, isUnaryTag$$1 = options.isUnaryTag || no, canBeLeftOpenTag$$1 = options.canBeLeftOpenTag || no, index = 0; html;){
                    // Make sure we're not in a plaintext content element like script/style
                    if (last = html, lastTag && isPlainTextElement(lastTag)) {
                        var endTagLength = 0, stackedTag = lastTag.toLowerCase(), reStackedTag = reCache[stackedTag] || (reCache[stackedTag] = RegExp('([\\s\\S]*?)(</' + stackedTag + '[^>]*>)', 'i')), rest$1 = html.replace(reStackedTag, function(all, text, endTag) {
                            return endTagLength = endTag.length, isPlainTextElement(stackedTag) || 'noscript' === stackedTag || (text = text.replace(/<!\--([\s\S]*?)-->/g, '$1') // #7298
                            .replace(/<!\[CDATA\[([\s\S]*?)]]>/g, '$1')), shouldIgnoreFirstNewline(stackedTag, text) && (text = text.slice(1)), options.chars && options.chars(text), '';
                        });
                        index += html.length - rest$1.length, html = rest$1, parseEndTag(stackedTag, index - endTagLength, index);
                    } else {
                        var textEnd = html.indexOf('<');
                        if (0 === textEnd) {
                            // Comment:
                            if (comment.test(html)) {
                                var commentEnd = html.indexOf('-->');
                                if (commentEnd >= 0) {
                                    options.shouldKeepComment && options.comment(html.substring(4, commentEnd), index, index + commentEnd + 3), advance(commentEnd + 3);
                                    continue;
                                }
                            }
                            // http://en.wikipedia.org/wiki/Conditional_comment#Downlevel-revealed_conditional_comment
                            if (conditionalComment.test(html)) {
                                var conditionalEnd = html.indexOf(']>');
                                if (conditionalEnd >= 0) {
                                    advance(conditionalEnd + 2);
                                    continue;
                                }
                            }
                            // Doctype:
                            var doctypeMatch = html.match(doctype);
                            if (doctypeMatch) {
                                advance(doctypeMatch[0].length);
                                continue;
                            }
                            // End tag:
                            var endTagMatch = html.match(endTag);
                            if (endTagMatch) {
                                var curIndex = index;
                                advance(endTagMatch[0].length), parseEndTag(endTagMatch[1], curIndex, index);
                                continue;
                            }
                            // Start tag:
                            var startTagMatch = function() {
                                var start = html.match(startTagOpen);
                                if (start) {
                                    var end, attr, match = {
                                        tagName: start[1],
                                        attrs: [],
                                        start: index
                                    };
                                    for(advance(start[0].length); !(end = html.match(startTagClose)) && (attr = html.match(dynamicArgAttribute) || html.match(attribute));)attr.start = index, advance(attr[0].length), attr.end = index, match.attrs.push(attr);
                                    if (end) return match.unarySlash = end[1], advance(end[0].length), match.end = index, match;
                                }
                            }();
                            if (startTagMatch) {
                                (function(match) {
                                    var tagName = match.tagName, unarySlash = match.unarySlash;
                                    expectHTML && ('p' === lastTag && isNonPhrasingTag(tagName) && parseEndTag(lastTag), canBeLeftOpenTag$$1(tagName) && lastTag === tagName && parseEndTag(tagName));
                                    for(var unary = isUnaryTag$$1(tagName) || !!unarySlash, l = match.attrs.length, attrs = Array(l), i = 0; i < l; i++){
                                        var args = match.attrs[i], value = args[3] || args[4] || args[5] || '', shouldDecodeNewlines = 'a' === tagName && 'href' === args[1] ? options.shouldDecodeNewlinesForHref : options.shouldDecodeNewlines;
                                        attrs[i] = {
                                            name: args[1],
                                            value: value.replace(shouldDecodeNewlines ? encodedAttrWithNewLines : encodedAttr, function(match) {
                                                return decodingMap[match];
                                            })
                                        }, options.outputSourceRange && (attrs[i].start = args.start + args[0].match(/^\s*/).length, attrs[i].end = args.end);
                                    }
                                    unary || (stack.push({
                                        tag: tagName,
                                        lowerCasedTag: tagName.toLowerCase(),
                                        attrs: attrs,
                                        start: match.start,
                                        end: match.end
                                    }), lastTag = tagName), options.start && options.start(tagName, attrs, unary, match.start, match.end);
                                })(startTagMatch), shouldIgnoreFirstNewline(startTagMatch.tagName, html) && advance(1);
                                continue;
                            }
                        }
                        var text = void 0, rest = void 0, next = void 0;
                        if (textEnd >= 0) {
                            for(rest = html.slice(textEnd); !endTag.test(rest) && !startTagOpen.test(rest) && !comment.test(rest) && !conditionalComment.test(rest) && !(// < in plain text, be forgiving and treat it as text
                            (next = rest.indexOf('<', 1)) < 0);)textEnd += next, rest = html.slice(textEnd);
                            text = html.substring(0, textEnd);
                        }
                        textEnd < 0 && (text = html), text && advance(text.length), options.chars && text && options.chars(text, index - text.length, index);
                    }
                    if (html === last) {
                        options.chars && options.chars(html), !stack.length && options.warn && options.warn("Mal-formatted tag at end of template: \"" + html + "\"", {
                            start: index + html.length
                        });
                        break;
                    }
                }
                function advance(n) {
                    index += n, html = html.substring(n);
                }
                function parseEndTag(tagName, start, end) {
                    var pos, lowerCasedTagName;
                    // Find the closest opened tag of the same type
                    if (null == start && (start = index), null == end && (end = index), tagName) for(lowerCasedTagName = tagName.toLowerCase(), pos = stack.length - 1; pos >= 0 && stack[pos].lowerCasedTag !== lowerCasedTagName; pos--);
                    else // If no tag name is provided, clean shop
                    pos = 0;
                    if (pos >= 0) {
                        // Close all the open elements, up the stack
                        for(var i = stack.length - 1; i >= pos; i--)(i > pos || !tagName && options.warn) && options.warn("tag <" + stack[i].tag + "> has no matching end tag.", {
                            start: stack[i].start,
                            end: stack[i].end
                        }), options.end && options.end(stack[i].tag, start, end);
                        // Remove the open elements from the stack
                        stack.length = pos, lastTag = pos && stack[pos - 1].tag;
                    } else 'br' === lowerCasedTagName ? options.start && options.start(tagName, [], !0, start, end) : 'p' === lowerCasedTagName && (options.start && options.start(tagName, [], !1, start, end), options.end && options.end(tagName, start, end));
                }
                // Clean up any remaining tags
                parseEndTag();
            }(template, {
                warn: warn$2,
                expectHTML: options.expectHTML,
                isUnaryTag: options.isUnaryTag,
                canBeLeftOpenTag: options.canBeLeftOpenTag,
                shouldDecodeNewlines: options.shouldDecodeNewlines,
                shouldDecodeNewlinesForHref: options.shouldDecodeNewlinesForHref,
                shouldKeepComment: options.comments,
                outputSourceRange: options.outputSourceRange,
                start: function(tag, attrs, unary, start$1, end) {
                    // check namespace.
                    // inherit parent ns if there is one
                    var el, el1, el2, ns = currentParent && currentParent.ns || platformGetTagNamespace(tag);
                    isIE && 'svg' === ns && (attrs = /* istanbul ignore next */ function(attrs) {
                        for(var res = [], i = 0; i < attrs.length; i++){
                            var attr = attrs[i];
                            ieNSBug.test(attr.name) || (attr.name = attr.name.replace(ieNSPrefix, ''), res.push(attr));
                        }
                        return res;
                    }(attrs));
                    var element = createASTElement(tag, attrs, currentParent);
                    ns && (element.ns = ns), options.outputSourceRange && (element.start = start$1, element.end = end, element.rawAttrsMap = element.attrsList.reduce(function(cumulated, attr) {
                        return cumulated[attr.name] = attr, cumulated;
                    }, {})), attrs.forEach(function(attr) {
                        invalidAttributeRE.test(attr.name) && warn$2("Invalid dynamic argument expression: attribute names cannot contain spaces, quotes, <, >, / or =.", {
                            start: attr.start + attr.name.indexOf("["),
                            end: attr.start + attr.name.length
                        });
                    }), 'style' !== (el = element).tag && ('script' !== el.tag || el.attrsMap.type && 'text/javascript' !== el.attrsMap.type) || isServerRendering() || (element.forbidden = !0, warn$2("Templates should only be responsible for mapping the state to the UI. Avoid placing tags with side-effects in your templates, such as <" + tag + ">, as they will not be parsed.", {
                        start: element.start
                    }));
                    // apply pre-transforms
                    for(var i = 0; i < preTransforms.length; i++)element = preTransforms[i](element, options) || element;
                    !inVPre && (null != getAndRemoveAttr(el1 = element, 'v-pre') && (el1.pre = !0), element.pre && (inVPre = !0)), platformIsPreTag(element.tag) && (inPre = !0), inVPre ? function(el) {
                        var list = el.attrsList, len = list.length;
                        if (len) for(var attrs = el.attrs = Array(len), i = 0; i < len; i++)attrs[i] = {
                            name: list[i].name,
                            value: JSON.stringify(list[i].value)
                        }, null != list[i].start && (attrs[i].start = list[i].start, attrs[i].end = list[i].end);
                        else el.pre || // non root node in pre blocks with no attributes
                        (el.plain = !0);
                    }(element) : element.processed || (// structural directives
                    processFor(element), function(el) {
                        var exp = getAndRemoveAttr(el, 'v-if');
                        if (exp) el.if = exp, addIfCondition(el, {
                            exp: exp,
                            block: el
                        });
                        else {
                            null != getAndRemoveAttr(el, 'v-else') && (el.else = !0);
                            var elseif = getAndRemoveAttr(el, 'v-else-if');
                            elseif && (el.elseif = elseif);
                        }
                    }(element), null != getAndRemoveAttr(el2 = element, 'v-once') && (el2.once = !0)), root || checkRootConstraints(root = element), unary ? closeElement(element) : (currentParent = element, stack.push(element));
                },
                end: function(tag, start, end$1) {
                    var element = stack[stack.length - 1];
                    // pop stack
                    stack.length -= 1, currentParent = stack[stack.length - 1], options.outputSourceRange && (element.end = end$1), closeElement(element);
                },
                chars: function(text, start, end) {
                    if (!currentParent) {
                        text === template ? warnOnce('Component template requires a root element, rather than just text.', {
                            start: start
                        }) : (text = text.trim()) && warnOnce("text \"" + text + "\" outside root element will be ignored.", {
                            start: start
                        });
                        return;
                    }
                    // IE textarea placeholder bug
                    /* istanbul ignore if */ if (!isIE || 'textarea' !== currentParent.tag || currentParent.attrsMap.placeholder !== text) {
                        var el, res, child, children = currentParent.children;
                        (text = inPre || text.trim() ? 'script' === (el = currentParent).tag || 'style' === el.tag ? text : decodeHTMLCached(text) : children.length ? whitespaceOption ? 'condense' === whitespaceOption && lineBreakRE.test(text) ? '' : ' ' : preserveWhitespace ? ' ' : '' : '') && (inPre || 'condense' !== whitespaceOption || // condense consecutive whitespaces into single space
                        (text = text.replace(whitespaceRE$1, ' ')), !inVPre && ' ' !== text && (res = parseText(text, delimiters)) ? child = {
                            type: 2,
                            expression: res.expression,
                            tokens: res.tokens,
                            text: text
                        } : ' ' === text && children.length && ' ' === children[children.length - 1].text || (child = {
                            type: 3,
                            text: text
                        }), child && (options.outputSourceRange && (child.start = start, child.end = end), children.push(child)));
                    }
                },
                comment: function(text, start, end) {
                    // adding anything as a sibling to the root node is forbidden
                    // comments should still be allowed, but ignored
                    if (currentParent) {
                        var child = {
                            type: 3,
                            text: text,
                            isComment: !0
                        };
                        options.outputSourceRange && (child.start = start, child.end = end), currentParent.children.push(child);
                    }
                }
            }), root;
        }(template.trim(), options);
        !1 !== options.optimize && ast && (isStaticKey = genStaticKeysCached(options.staticKeys || ''), isPlatformReservedTag = options.isReservedTag || no, // first pass: mark all non-static nodes.
        function markStatic$1(node) {
            if (node.static = 2 !== node.type && (3 === node.type || !!(node.pre || !node.hasBindings && // no dynamic bindings
            !node.if && !node.for && // not v-if or v-for or v-else
            !isBuiltInTag(node.tag) && // not a built-in
            isPlatformReservedTag(node.tag) && // not a component
            !function(node) {
                for(; node.parent && 'template' === (node = node.parent).tag;)if (node.for) return !0;
                return !1;
            }(node) && Object.keys(node).every(isStaticKey))), 1 === node.type && (isPlatformReservedTag(node.tag) || 'slot' === node.tag || null != node.attrsMap['inline-template'])) {
                for(var i = 0, l = node.children.length; i < l; i++){
                    var child = node.children[i];
                    markStatic$1(child), child.static || (node.static = !1);
                }
                if (node.ifConditions) for(var i$1 = 1, l$1 = node.ifConditions.length; i$1 < l$1; i$1++){
                    var block = node.ifConditions[i$1].block;
                    markStatic$1(block), block.static || (node.static = !1);
                }
            }
        }(ast), // second pass: mark static roots.
        function markStaticRoots(node, isInFor) {
            if (1 === node.type) {
                // For a node to qualify as a static root, it should have children that
                // are not just static text. Otherwise the cost of hoisting out will
                // outweigh the benefits and it's better off to just always render it fresh.
                if ((node.static || node.once) && (node.staticInFor = isInFor), node.static && node.children.length && !(1 === node.children.length && 3 === node.children[0].type)) {
                    node.staticRoot = !0;
                    return;
                }
                if (node.staticRoot = !1, node.children) for(var i = 0, l = node.children.length; i < l; i++)markStaticRoots(node.children[i], isInFor || !!node.for);
                if (node.ifConditions) for(var i$1 = 1, l$1 = node.ifConditions.length; i$1 < l$1; i$1++)markStaticRoots(node.ifConditions[i$1].block, isInFor);
            }
        }(ast, !1));
        var code = generate(ast, options);
        return {
            ast: ast,
            render: code.render,
            staticRenderFns: code.staticRenderFns
        };
    }, function(baseOptions) {
        var cache;
        function compile(template, options) {
            var ast, warn, finalOptions = Object.create(baseOptions), errors = [], tips = [], warn1 = function(msg, range, tip) {
                (tip ? tips : errors).push(msg);
            };
            if (options) {
                if (options.outputSourceRange) {
                    // $flow-disable-line
                    var leadingSpaceLength = template.match(/^\s*/)[0].length;
                    warn1 = function(msg, range, tip) {
                        var data = {
                            msg: msg
                        };
                        range && (null != range.start && (data.start = range.start + leadingSpaceLength), null != range.end && (data.end = range.end + leadingSpaceLength)), (tip ? tips : errors).push(data);
                    };
                }
                // copy other options
                for(var key in options.modules && (finalOptions.modules = (baseOptions.modules || []).concat(options.modules)), options.directives && (finalOptions.directives = extend(Object.create(baseOptions.directives || null), options.directives)), options)'modules' !== key && 'directives' !== key && (finalOptions[key] = options[key]);
            }
            finalOptions.warn = warn1;
            var compiled = baseCompile(template.trim(), finalOptions);
            return ast = compiled.ast, warn = warn1, ast && function checkNode(node, warn) {
                if (1 === node.type) {
                    for(var name in node.attrsMap)if (dirRE.test(name)) {
                        var value = node.attrsMap[name];
                        if (value) {
                            var text, range = node.rawAttrsMap[name];
                            'v-for' === name ? (text = "v-for=\"" + value + "\"", checkExpression(node.for || '', text, warn, range), checkIdentifier(node.alias, 'v-for alias', text, warn, range), checkIdentifier(node.iterator1, 'v-for iterator', text, warn, range), checkIdentifier(node.iterator2, 'v-for iterator', text, warn, range)) : 'v-slot' === name || '#' === name[0] ? function(exp, text, warn, range) {
                                try {
                                    Function(exp, '');
                                } catch (e) {
                                    warn("invalid function parameter expression: " + e.message + " in\n\n    " + exp + "\n\n  Raw expression: " + text.trim() + "\n", range);
                                }
                            }(value, name + "=\"" + value + "\"", warn, range) : onRE.test(name) ? function(exp, text, warn, range) {
                                var stripped = exp.replace(stripStringRE, ''), keywordMatch = stripped.match(unaryOperatorsRE);
                                keywordMatch && '$' !== stripped.charAt(keywordMatch.index - 1) && warn('avoid using JavaScript unary operator as property name: "' + keywordMatch[0] + "\" in expression " + text.trim(), range), checkExpression(exp, text, warn, range);
                            }(value, name + "=\"" + value + "\"", warn, range) : checkExpression(value, name + "=\"" + value + "\"", warn, range);
                        }
                    }
                    if (node.children) for(var i = 0; i < node.children.length; i++)checkNode(node.children[i], warn);
                } else 2 === node.type && checkExpression(node.expression, node.text, warn, node);
            }(ast, warn), compiled.errors = errors, compiled.tips = tips, compiled;
        }
        return {
            compile: compile,
            compileToFunctions: (cache = Object.create(null), function(template, options, vm) {
                var warn$$1 = (options = extend({}, options)).warn || warn;
                delete options.warn;
                // detect possible CSP restriction
                try {
                    Function('return 1');
                } catch (e) {
                    e.toString().match(/unsafe-eval|CSP/) && warn$$1("It seems you are using the standalone build of Vue.js in an environment with Content Security Policy that prohibits unsafe-eval. The template compiler cannot work in this environment. Consider relaxing the policy to allow unsafe-eval or pre-compiling your templates into render functions.");
                }
                // check cache
                var key = options.delimiters ? String(options.delimiters) + template : template;
                if (cache[key]) return cache[key];
                // compile
                var compiled = compile(template, options);
                compiled.errors && compiled.errors.length && (options.outputSourceRange ? compiled.errors.forEach(function(e) {
                    warn$$1("Error compiling template:\n\n" + e.msg + "\n\n" + function(source, start, end) {
                        void 0 === start && (start = 0), void 0 === end && (end = source.length);
                        for(var lines = source.split(/\r?\n/), count = 0, res = [], i = 0; i < lines.length; i++)if ((count += lines[i].length + 1) >= start) {
                            for(var j = i - 2; j <= i + 2 || end > count; j++)if (!(j < 0) && !(j >= lines.length)) {
                                res.push("" + (j + 1) + repeat$1(" ", 3 - String(j + 1).length) + "|  " + lines[j]);
                                var lineLength = lines[j].length;
                                if (j === i) {
                                    // push underline
                                    var pad = start - (count - lineLength) + 1, length = end > count ? lineLength - pad : end - start;
                                    res.push("   |  " + repeat$1(" ", pad) + repeat$1("^", length));
                                } else if (j > i) {
                                    if (end > count) {
                                        var length$1 = Math.min(end - count, lineLength);
                                        res.push("   |  " + repeat$1("^", length$1));
                                    }
                                    count += lineLength + 1;
                                }
                            }
                            break;
                        }
                        return res.join('\n');
                    }(template, e.start, e.end), vm);
                }) : warn$$1("Error compiling template:\n\n" + template + "\n\n" + compiled.errors.map(function(e) {
                    return "- " + e;
                }).join('\n') + '\n', vm)), compiled.tips && compiled.tips.length && (options.outputSourceRange ? compiled.tips.forEach(function(e) {
                    return tip(e.msg, vm);
                }) : compiled.tips.forEach(function(msg) {
                    return tip(msg, vm);
                }));
                // turn code into functions
                var res = {}, fnGenErrors = [];
                return res.render = createFunction(compiled.render, fnGenErrors), res.staticRenderFns = compiled.staticRenderFns.map(function(code) {
                    return createFunction(code, fnGenErrors);
                }), compiled.errors && compiled.errors.length || !fnGenErrors.length || warn$$1("Failed to generate render function:\n\n" + fnGenErrors.map(function(ref) {
                    var err = ref.err, code = ref.code;
                    return err.toString() + " in\n\n" + code + "\n";
                }).join('\n'), vm), cache[key] = res;
            })
        };
    })(baseOptions);
    ref$1.compile;
    var compileToFunctions = ref$1.compileToFunctions;
    function getShouldDecode(href) {
        return (div = div || document.createElement('div')).innerHTML = href ? "<a href=\"\n\"/>" : "<div a=\"\n\"/>", div.innerHTML.indexOf('&#10;') > 0;
    }
    // #3663: IE encodes newlines inside attribute values while other browsers don't
    var shouldDecodeNewlines = !!inBrowser && getShouldDecode(!1), shouldDecodeNewlinesForHref = !!inBrowser && getShouldDecode(!0), idToTemplate = cached(function(id) {
        var el = query(id);
        return el && el.innerHTML;
    }), mount = Vue1.prototype.$mount;
    return Vue1.prototype.$mount = function(el, hydrating) {
        /* istanbul ignore if */ if ((el = el && query(el)) === document.body || el === document.documentElement) return warn("Do not mount Vue to <html> or <body> - mount to normal elements instead."), this;
        var options = this.$options;
        // resolve template/el and convert to render function
        if (!options.render) {
            var template = options.template;
            if (template) {
                if ('string' == typeof template) '#' !== template.charAt(0) || (template = idToTemplate(template)) || warn("Template element not found or is empty: " + options.template, this);
                else {
                    if (!template.nodeType) return warn('invalid template option:' + template, this), this;
                    template = template.innerHTML;
                }
            } else el && (template = /**
   * Get outerHTML of elements, taking care
   * of SVG elements in IE as well.
   */ function(el) {
                if (el.outerHTML) return el.outerHTML;
                var container = document.createElement('div');
                return container.appendChild(el.cloneNode(!0)), container.innerHTML;
            }(el));
            if (template) {
                config.performance && mark && mark('compile');
                var ref = compileToFunctions(template, {
                    outputSourceRange: !0,
                    shouldDecodeNewlines: shouldDecodeNewlines,
                    shouldDecodeNewlinesForHref: shouldDecodeNewlinesForHref,
                    delimiters: options.delimiters,
                    comments: options.comments
                }, this), render = ref.render, staticRenderFns = ref.staticRenderFns;
                options.render = render, options.staticRenderFns = staticRenderFns, config.performance && mark && (mark('compile end'), measure("vue " + this._name + " compile", 'compile', 'compile end'));
            }
        }
        return mount.call(this, el, hydrating);
    }, Vue1.compile = compileToFunctions, Vue1;
});
