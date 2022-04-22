!function(window1, undefined) {
    var readyList, rootjQuery1, core_strundefined = "undefined", document1 = window1.document, location = window1.location, _jQuery = window1.jQuery, _$ = window1.$, class2type = {}, core_deletedIds = [], core_version = "1.9.1", core_concat = core_deletedIds.concat, core_push = core_deletedIds.push, core_slice = core_deletedIds.slice, core_indexOf = core_deletedIds.indexOf, core_toString = class2type.toString, core_hasOwn = class2type.hasOwnProperty, core_trim = core_version.trim, jQuery = function(selector, context) {
        return new jQuery.fn.init(selector, context, rootjQuery1);
    }, core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source, core_rnotwhite = /\S+/g, rtrim1 = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, rquickExpr1 = /^(?:(<[\w\W]+>)[^>]*|#([\w-]*))$/, rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/, rvalidchars = /^[\],:{}\s]*$/, rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g, rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g, rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g, rmsPrefix = /^-ms-/, rdashAlpha = /-([\da-z])/gi, fcamelCase = function(all, letter) {
        return letter.toUpperCase();
    }, completed = function(event) {
        (document1.addEventListener || "load" === event.type || "complete" === document1.readyState) && (detach(), jQuery.ready());
    }, detach = function() {
        document1.addEventListener ? (document1.removeEventListener("DOMContentLoaded", completed, !1), window1.removeEventListener("load", completed, !1)) : (document1.detachEvent("onreadystatechange", completed), window1.detachEvent("onload", completed));
    };
    function isArraylike(obj) {
        var length = obj.length, type = jQuery.type(obj);
        return !jQuery.isWindow(obj) && (1 === obj.nodeType && !!length || "array" === type || "function" !== type && (0 === length || "number" == typeof length && length > 0 && length - 1 in obj));
    }
    jQuery.fn = jQuery.prototype = {
        jquery: core_version,
        constructor: jQuery,
        init: function(selector, context, rootjQuery) {
            var match, elem;
            if (!selector) return this;
            if ("string" == typeof selector) {
                if ((match = "<" === selector.charAt(0) && ">" === selector.charAt(selector.length - 1) && selector.length >= 3 ? [
                    null,
                    selector,
                    null
                ] : rquickExpr1.exec(selector)) && (match[1] || !context)) {
                    if (match[1]) {
                        if (context = context instanceof jQuery ? context[0] : context, jQuery.merge(this, jQuery.parseHTML(match[1], context && context.nodeType ? context.ownerDocument || context : document1, !0)), rsingleTag.test(match[1]) && jQuery.isPlainObject(context)) for(match in context)jQuery.isFunction(this[match]) ? this[match](context[match]) : this.attr(match, context[match]);
                        return this;
                    }
                    if ((elem = document1.getElementById(match[2])) && elem.parentNode) {
                        if (elem.id !== match[2]) return rootjQuery.find(selector);
                        this.length = 1, this[0] = elem;
                    }
                    return this.context = document1, this.selector = selector, this;
                }
                return !context || context.jquery ? (context || rootjQuery).find(selector) : this.constructor(context).find(selector);
            }
            return selector.nodeType ? (this.context = this[0] = selector, this.length = 1, this) : jQuery.isFunction(selector) ? rootjQuery.ready(selector) : (undefined !== selector.selector && (this.selector = selector.selector, this.context = selector.context), jQuery.makeArray(selector, this));
        },
        selector: "",
        length: 0,
        size: function() {
            return this.length;
        },
        toArray: function() {
            return core_slice.call(this);
        },
        get: function(num) {
            return null == num ? this.toArray() : num < 0 ? this[this.length + num] : this[num];
        },
        pushStack: function(elems) {
            var ret = jQuery.merge(this.constructor(), elems);
            return ret.prevObject = this, ret.context = this.context, ret;
        },
        each: function(callback, args) {
            return jQuery.each(this, callback, args);
        },
        ready: function(fn) {
            return jQuery.ready.promise().done(fn), this;
        },
        slice: function() {
            return this.pushStack(core_slice.apply(this, arguments));
        },
        first: function() {
            return this.eq(0);
        },
        last: function() {
            return this.eq(-1);
        },
        eq: function(i) {
            var len = this.length, j = +i + (i < 0 ? len : 0);
            return this.pushStack(j >= 0 && j < len ? [
                this[j]
            ] : []);
        },
        map: function(callback) {
            return this.pushStack(jQuery.map(this, function(elem, i) {
                return callback.call(elem, i, elem);
            }));
        },
        end: function() {
            return this.prevObject || this.constructor(null);
        },
        push: core_push,
        sort: [].sort,
        splice: [].splice
    }, jQuery.fn.init.prototype = jQuery.fn, jQuery.extend = jQuery.fn.extend = function() {
        var src, copyIsArray, copy, name, options, clone, target = arguments[0] || {}, i = 1, length = arguments.length, deep = !1;
        for("boolean" == typeof target && (deep = target, target = arguments[1] || {}, i = 2), "object" == typeof target || jQuery.isFunction(target) || (target = {}), length === i && (target = this, --i); i < length; i++)if (null != (options = arguments[i])) for(name in options)src = target[name], copy = options[name], target !== copy && (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy))) ? (copyIsArray ? (copyIsArray = !1, clone = src && jQuery.isArray(src) ? src : []) : clone = src && jQuery.isPlainObject(src) ? src : {}, target[name] = jQuery.extend(deep, clone, copy)) : copy !== undefined && (target[name] = copy));
        return target;
    }, jQuery.extend({
        noConflict: function(deep) {
            return window1.$ === jQuery && (window1.$ = _$), deep && window1.jQuery === jQuery && (window1.jQuery = _jQuery), jQuery;
        },
        isReady: !1,
        readyWait: 1,
        holdReady: function(hold) {
            hold ? jQuery.readyWait++ : jQuery.ready(!0);
        },
        ready: function(wait) {
            if (!(!0 === wait ? --jQuery.readyWait : jQuery.isReady)) {
                if (!document1.body) return setTimeout(jQuery.ready);
                jQuery.isReady = !0, !(!0 !== wait && --jQuery.readyWait > 0) && (readyList.resolveWith(document1, [
                    jQuery
                ]), jQuery.fn.trigger && jQuery(document1).trigger("ready").off("ready"));
            }
        },
        isFunction: function(obj) {
            return "function" === jQuery.type(obj);
        },
        isArray: Array.isArray || function(obj) {
            return "array" === jQuery.type(obj);
        },
        isWindow: function(obj) {
            return null != obj && obj == obj.window;
        },
        isNumeric: function(obj) {
            return !isNaN(parseFloat(obj)) && isFinite(obj);
        },
        type: function(obj) {
            return null == obj ? String(obj) : "object" == typeof obj || "function" == typeof obj ? class2type[core_toString.call(obj)] || "object" : typeof obj;
        },
        isPlainObject: function(obj) {
            var key;
            if (!obj || "object" !== jQuery.type(obj) || obj.nodeType || jQuery.isWindow(obj)) return !1;
            try {
                if (obj.constructor && !core_hasOwn.call(obj, "constructor") && !core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) return !1;
            } catch (e) {
                return !1;
            }
            for(key in obj);
            return key === undefined || core_hasOwn.call(obj, key);
        },
        isEmptyObject: function(obj) {
            var name;
            for(name in obj)return !1;
            return !0;
        },
        error: function(msg) {
            throw new Error(msg);
        },
        parseHTML: function(data, context, keepScripts) {
            if (!data || "string" != typeof data) return null;
            "boolean" == typeof context && (keepScripts = context, context = !1), context = context || document1;
            var parsed = rsingleTag.exec(data), scripts = !keepScripts && [];
            return parsed ? [
                context.createElement(parsed[1])
            ] : (parsed = jQuery.buildFragment([
                data
            ], context, scripts), scripts && jQuery(scripts).remove(), jQuery.merge([], parsed.childNodes));
        },
        parseJSON: function(data) {
            return window1.JSON && window1.JSON.parse ? window1.JSON.parse(data) : null === data ? data : "string" == typeof data && (data = jQuery.trim(data)) && rvalidchars.test(data.replace(rvalidescape, "@").replace(rvalidtokens, "]").replace(rvalidbraces, "")) ? new Function("return " + data)() : void jQuery.error("Invalid JSON: " + data);
        },
        parseXML: function(data) {
            var xml;
            if (!data || "string" != typeof data) return null;
            try {
                window1.DOMParser ? xml = new DOMParser().parseFromString(data, "text/xml") : ((xml = new ActiveXObject("Microsoft.XMLDOM")).async = "false", xml.loadXML(data));
            } catch (e) {
                xml = undefined;
            }
            return xml && xml.documentElement && !xml.getElementsByTagName("parsererror").length || jQuery.error("Invalid XML: " + data), xml;
        },
        noop: function() {},
        globalEval: function(data1) {
            data1 && jQuery.trim(data1) && (window1.execScript || function(data) {
                window1.eval.call(window1, data);
            })(data1);
        },
        camelCase: function(string) {
            return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase);
        },
        nodeName: function(elem, name) {
            return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
        },
        each: function(obj, callback, args) {
            var i = 0, length = obj.length, isArray = isArraylike(obj);
            if (args) {
                if (isArray) for(; i < length && !1 !== callback.apply(obj[i], args); i++);
                else for(i in obj)if (!1 === callback.apply(obj[i], args)) break;
            } else if (isArray) for(; i < length && !1 !== callback.call(obj[i], i, obj[i]); i++);
            else for(i in obj)if (!1 === callback.call(obj[i], i, obj[i])) break;
            return obj;
        },
        trim: core_trim && !core_trim.call("\uFEFF\xA0") ? function(text) {
            return null == text ? "" : core_trim.call(text);
        } : function(text) {
            return null == text ? "" : (text + "").replace(rtrim1, "");
        },
        makeArray: function(arr, results) {
            var ret = results || [];
            return null != arr && (isArraylike(Object(arr)) ? jQuery.merge(ret, "string" == typeof arr ? [
                arr
            ] : arr) : core_push.call(ret, arr)), ret;
        },
        inArray: function(elem, arr, i) {
            var len;
            if (arr) {
                if (core_indexOf) return core_indexOf.call(arr, elem, i);
                for(len = arr.length, i = i ? i < 0 ? Math.max(0, len + i) : i : 0; i < len; i++)if (i in arr && arr[i] === elem) return i;
            }
            return -1;
        },
        merge: function(first, second) {
            var l = second.length, i = first.length, j = 0;
            if ("number" == typeof l) for(; j < l; j++)first[i++] = second[j];
            else for(; undefined !== second[j];)first[i++] = second[j++];
            return first.length = i, first;
        },
        grep: function(elems, callback, inv) {
            var ret = [], i = 0, length = elems.length;
            for(inv = !!inv; i < length; i++)!!callback(elems[i], i) !== inv && ret.push(elems[i]);
            return ret;
        },
        map: function(elems, callback, arg) {
            var value, i = 0, length = elems.length, isArray = isArraylike(elems), ret = [];
            if (isArray) for(; i < length; i++)null != (value = callback(elems[i], i, arg)) && (ret[ret.length] = value);
            else for(i in elems)null != (value = callback(elems[i], i, arg)) && (ret[ret.length] = value);
            return core_concat.apply([], ret);
        },
        guid: 1,
        proxy: function(fn, context) {
            var args, proxy, tmp;
            if ("string" == typeof context && (tmp = fn[context], context = fn, fn = tmp), jQuery.isFunction(fn)) return args = core_slice.call(arguments, 2), (proxy = function() {
                return fn.apply(context || this, args.concat(core_slice.call(arguments)));
            }).guid = fn.guid = fn.guid || jQuery.guid++, proxy;
        },
        access: function(elems, fn, key, value1, chainable, emptyGet, raw) {
            var i = 0, length = elems.length, bulk = null == key;
            if ("object" === jQuery.type(key)) for(i in chainable = !0, key)jQuery.access(elems, fn, i, key[i], !0, emptyGet, raw);
            else if (value1 !== undefined && (chainable = !0, jQuery.isFunction(value1) || (raw = !0), bulk && (raw ? (fn.call(elems, value1), fn = null) : (bulk = fn, fn = function(elem, key, value) {
                return bulk.call(jQuery(elem), value);
            })), fn)) for(; i < length; i++)fn(elems[i], key, raw ? value1 : value1.call(elems[i], i, fn(elems[i], key)));
            return chainable ? elems : bulk ? fn.call(elems) : length ? fn(elems[0], key) : emptyGet;
        },
        now: function() {
            return new Date().getTime();
        }
    }), jQuery.ready.promise = function(obj) {
        if (!readyList) {
            if (readyList = jQuery.Deferred(), "complete" === document1.readyState) setTimeout(jQuery.ready);
            else if (document1.addEventListener) document1.addEventListener("DOMContentLoaded", completed, !1), window1.addEventListener("load", completed, !1);
            else {
                document1.attachEvent("onreadystatechange", completed), window1.attachEvent("onload", completed);
                var top = !1;
                try {
                    top = null == window1.frameElement && document1.documentElement;
                } catch (e) {}
                top && top.doScroll && function doScrollCheck() {
                    if (!jQuery.isReady) {
                        try {
                            top.doScroll("left");
                        } catch (e) {
                            return setTimeout(doScrollCheck, 50);
                        }
                        detach(), jQuery.ready();
                    }
                }();
            }
        }
        return readyList.promise(obj);
    }, jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
        class2type["[object " + name + "]"] = name.toLowerCase();
    }), rootjQuery1 = jQuery(document1);
    var optionsCache = {};
    jQuery.Callbacks = function(options) {
        options = "string" == typeof options ? optionsCache[options] || (object = optionsCache[options1 = options] = {}, jQuery.each(options1.match(core_rnotwhite) || [], function(_, flag) {
            object[flag] = !0;
        }), object) : jQuery.extend({}, options);
        var options1, object, firing, memory, fired, firingLength, firingIndex, firingStart, list = [], stack = !options.once && [], fire = function(data) {
            for(memory = options.memory && data, fired = !0, firingIndex = firingStart || 0, firingStart = 0, firingLength = list.length, firing = !0; list && firingIndex < firingLength; firingIndex++)if (!1 === list[firingIndex].apply(data[0], data[1]) && options.stopOnFalse) {
                memory = !1;
                break;
            }
            firing = !1, list && (stack ? stack.length && fire(stack.shift()) : memory ? list = [] : self.disable());
        }, self = {
            add: function() {
                if (list) {
                    var start = list.length;
                    (function add(args) {
                        jQuery.each(args, function(_, arg) {
                            var type = jQuery.type(arg);
                            "function" === type ? options.unique && self.has(arg) || list.push(arg) : arg && arg.length && "string" !== type && add(arg);
                        });
                    })(arguments), firing ? firingLength = list.length : memory && (firingStart = start, fire(memory));
                }
                return this;
            },
            remove: function() {
                return list && jQuery.each(arguments, function(_, arg) {
                    for(var index; (index = jQuery.inArray(arg, list, index)) > -1;)list.splice(index, 1), firing && (index <= firingLength && firingLength--, index <= firingIndex && firingIndex--);
                }), this;
            },
            has: function(fn) {
                return fn ? jQuery.inArray(fn, list) > -1 : !!(list && list.length);
            },
            empty: function() {
                return list = [], this;
            },
            disable: function() {
                return list = stack = memory = undefined, this;
            },
            disabled: function() {
                return !list;
            },
            lock: function() {
                return stack = undefined, memory || self.disable(), this;
            },
            locked: function() {
                return !stack;
            },
            fireWith: function(context, args) {
                return args = [
                    context,
                    (args = args || []).slice ? args.slice() : args
                ], list && (!fired || stack) && (firing ? stack.push(args) : fire(args)), this;
            },
            fire: function() {
                return self.fireWith(this, arguments), this;
            },
            fired: function() {
                return !!fired;
            }
        };
        return self;
    }, jQuery.extend({
        Deferred: function(func) {
            var tuples = [
                [
                    "resolve",
                    "done",
                    jQuery.Callbacks("once memory"),
                    "resolved"
                ],
                [
                    "reject",
                    "fail",
                    jQuery.Callbacks("once memory"),
                    "rejected"
                ],
                [
                    "notify",
                    "progress",
                    jQuery.Callbacks("memory")
                ]
            ], state = "pending", promise = {
                state: function() {
                    return state;
                },
                always: function() {
                    return deferred.done(arguments).fail(arguments), this;
                },
                then: function() {
                    var fns = arguments;
                    return jQuery.Deferred(function(newDefer) {
                        jQuery.each(tuples, function(i, tuple) {
                            var action = tuple[0], fn = jQuery.isFunction(fns[i]) && fns[i];
                            deferred[tuple[1]](function() {
                                var returned = fn && fn.apply(this, arguments);
                                returned && jQuery.isFunction(returned.promise) ? returned.promise().done(newDefer.resolve).fail(newDefer.reject).progress(newDefer.notify) : newDefer[action + "With"](this === promise ? newDefer.promise() : this, fn ? [
                                    returned
                                ] : arguments);
                            });
                        }), fns = null;
                    }).promise();
                },
                promise: function(obj) {
                    return null != obj ? jQuery.extend(obj, promise) : promise;
                }
            }, deferred = {};
            return promise.pipe = promise.then, jQuery.each(tuples, function(i, tuple) {
                var list = tuple[2], stateString = tuple[3];
                promise[tuple[1]] = list.add, stateString && list.add(function() {
                    state = stateString;
                }, tuples[1 ^ i][2].disable, tuples[2][2].lock), deferred[tuple[0]] = function() {
                    return deferred[tuple[0] + "With"](this === deferred ? promise : this, arguments), this;
                }, deferred[tuple[0] + "With"] = list.fireWith;
            }), promise.promise(deferred), func && func.call(deferred, deferred), deferred;
        },
        when: function(subordinate) {
            var progressValues, progressContexts, resolveContexts, i1 = 0, resolveValues = core_slice.call(arguments), length = resolveValues.length, remaining = 1 !== length || subordinate && jQuery.isFunction(subordinate.promise) ? length : 0, deferred = 1 === remaining ? subordinate : jQuery.Deferred(), updateFunc = function(i, contexts, values) {
                return function(value) {
                    contexts[i] = this, values[i] = arguments.length > 1 ? core_slice.call(arguments) : value, values === progressValues ? deferred.notifyWith(contexts, values) : --remaining || deferred.resolveWith(contexts, values);
                };
            };
            if (length > 1) for(progressValues = new Array(length), progressContexts = new Array(length), resolveContexts = new Array(length); i1 < length; i1++)resolveValues[i1] && jQuery.isFunction(resolveValues[i1].promise) ? resolveValues[i1].promise().done(updateFunc(i1, resolveContexts, resolveValues)).fail(deferred.reject).progress(updateFunc(i1, progressContexts, progressValues)) : --remaining;
            return remaining || deferred.resolveWith(resolveContexts, resolveValues), deferred.promise();
        }
    }), jQuery.support = function() {
        var support, all, a, input, select, fragment, opt, eventName, isSupported, i, div = document1.createElement("div");
        if (div.setAttribute("className", "t"), div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", all = div.getElementsByTagName("*"), a = div.getElementsByTagName("a")[0], !all || !a || !all.length) return {};
        opt = (select = document1.createElement("select")).appendChild(document1.createElement("option")), input = div.getElementsByTagName("input")[0], a.style.cssText = "top:1px;float:left;opacity:.5", support = {
            getSetAttribute: "t" !== div.className,
            leadingWhitespace: 3 === div.firstChild.nodeType,
            tbody: !div.getElementsByTagName("tbody").length,
            htmlSerialize: !!div.getElementsByTagName("link").length,
            style: /top/.test(a.getAttribute("style")),
            hrefNormalized: "/a" === a.getAttribute("href"),
            opacity: /^0.5/.test(a.style.opacity),
            cssFloat: !!a.style.cssFloat,
            checkOn: !!input.value,
            optSelected: opt.selected,
            enctype: !!document1.createElement("form").enctype,
            html5Clone: "<:nav></:nav>" !== document1.createElement("nav").cloneNode(!0).outerHTML,
            boxModel: "CSS1Compat" === document1.compatMode,
            deleteExpando: !0,
            noCloneEvent: !0,
            inlineBlockNeedsLayout: !1,
            shrinkWrapBlocks: !1,
            reliableMarginRight: !0,
            boxSizingReliable: !0,
            pixelPosition: !1
        }, input.checked = !0, support.noCloneChecked = input.cloneNode(!0).checked, select.disabled = !0, support.optDisabled = !opt.disabled;
        try {
            delete div.test;
        } catch (e) {
            support.deleteExpando = !1;
        }
        for(i in (input = document1.createElement("input")).setAttribute("value", ""), support.input = "" === input.getAttribute("value"), input.value = "t", input.setAttribute("type", "radio"), support.radioValue = "t" === input.value, input.setAttribute("checked", "t"), input.setAttribute("name", "t"), (fragment = document1.createDocumentFragment()).appendChild(input), support.appendChecked = input.checked, support.checkClone = fragment.cloneNode(!0).cloneNode(!0).lastChild.checked, div.attachEvent && (div.attachEvent("onclick", function() {
            support.noCloneEvent = !1;
        }), div.cloneNode(!0).click()), {
            submit: !0,
            change: !0,
            focusin: !0
        })div.setAttribute(eventName = "on" + i, "t"), support[i + "Bubbles"] = eventName in window1 || !1 === div.attributes[eventName].expando;
        return div.style.backgroundClip = "content-box", div.cloneNode(!0).style.backgroundClip = "", support.clearCloneStyle = "content-box" === div.style.backgroundClip, jQuery(function() {
            var container, marginDiv, tds, divReset = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;", body = document1.getElementsByTagName("body")[0];
            body && ((container = document1.createElement("div")).style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px", body.appendChild(container).appendChild(div), div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", (tds = div.getElementsByTagName("td"))[0].style.cssText = "padding:0;margin:0;border:0;display:none", isSupported = 0 === tds[0].offsetHeight, tds[0].style.display = "", tds[1].style.display = "none", support.reliableHiddenOffsets = isSupported && 0 === tds[0].offsetHeight, div.innerHTML = "", div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;", support.boxSizing = 4 === div.offsetWidth, support.doesNotIncludeMarginInBodyOffset = 1 !== body.offsetTop, window1.getComputedStyle && (support.pixelPosition = "1%" !== (window1.getComputedStyle(div, null) || {}).top, support.boxSizingReliable = "4px" === (window1.getComputedStyle(div, null) || {
                width: "4px"
            }).width, (marginDiv = div.appendChild(document1.createElement("div"))).style.cssText = div.style.cssText = divReset, marginDiv.style.marginRight = marginDiv.style.width = "0", div.style.width = "1px", support.reliableMarginRight = !parseFloat((window1.getComputedStyle(marginDiv, null) || {}).marginRight)), typeof div.style.zoom !== core_strundefined && (div.innerHTML = "", div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1", support.inlineBlockNeedsLayout = 3 === div.offsetWidth, div.style.display = "block", div.innerHTML = "<div></div>", div.firstChild.style.width = "5px", support.shrinkWrapBlocks = 3 !== div.offsetWidth, support.inlineBlockNeedsLayout && (body.style.zoom = 1)), body.removeChild(container), container = div = tds = marginDiv = null);
        }), all = select = fragment = opt = a = input = null, support;
    }();
    var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/, rmultiDash = /([A-Z])/g;
    function internalData(elem, name, data, pvt) {
        if (jQuery.acceptData(elem)) {
            var thisCache, ret, internalKey = jQuery.expando, getByName = "string" == typeof name, isNode = elem.nodeType, cache = isNode ? jQuery.cache : elem, id = isNode ? elem[internalKey] : elem[internalKey] && internalKey;
            if (id && cache[id] && (pvt || cache[id].data) || !getByName || data !== undefined) return id || (isNode ? elem[internalKey] = id = core_deletedIds.pop() || jQuery.guid++ : id = internalKey), cache[id] || (cache[id] = {}, isNode || (cache[id].toJSON = jQuery.noop)), ("object" == typeof name || "function" == typeof name) && (pvt ? cache[id] = jQuery.extend(cache[id], name) : cache[id].data = jQuery.extend(cache[id].data, name)), thisCache = cache[id], pvt || (thisCache.data || (thisCache.data = {}), thisCache = thisCache.data), data !== undefined && (thisCache[jQuery.camelCase(name)] = data), getByName ? null == (ret = thisCache[name]) && (ret = thisCache[jQuery.camelCase(name)]) : ret = thisCache, ret;
        }
    }
    function internalRemoveData(elem, name, pvt) {
        if (jQuery.acceptData(elem)) {
            var i, l, thisCache, isNode = elem.nodeType, cache = isNode ? jQuery.cache : elem, id = isNode ? elem[jQuery.expando] : jQuery.expando;
            if (cache[id]) {
                if (name && (thisCache = pvt ? cache[id] : cache[id].data)) {
                    for(i = 0, l = (name = jQuery.isArray(name) ? name.concat(jQuery.map(name, jQuery.camelCase)) : (name in thisCache) ? [
                        name
                    ] : ((name = jQuery.camelCase(name)) in thisCache) ? [
                        name
                    ] : name.split(" ")).length; i < l; i++)delete thisCache[name[i]];
                    if (!(pvt ? isEmptyDataObject : jQuery.isEmptyObject)(thisCache)) return;
                }
                (pvt || (delete cache[id].data, isEmptyDataObject(cache[id]))) && (isNode ? jQuery.cleanData([
                    elem
                ], !0) : jQuery.support.deleteExpando || cache != cache.window ? delete cache[id] : cache[id] = null);
            }
        }
    }
    function dataAttr(elem, key, data) {
        if (data === undefined && 1 === elem.nodeType) {
            var name = "data-" + key.replace(rmultiDash, "-$1").toLowerCase();
            if ("string" == typeof (data = elem.getAttribute(name))) {
                try {
                    data = "true" === data || "false" !== data && ("null" === data ? null : +data + "" === data ? +data : rbrace.test(data) ? jQuery.parseJSON(data) : data);
                } catch (e) {}
                jQuery.data(elem, key, data);
            } else data = undefined;
        }
        return data;
    }
    function isEmptyDataObject(obj) {
        var name;
        for(name in obj)if (!("data" === name && jQuery.isEmptyObject(obj[name])) && "toJSON" !== name) return !1;
        return !0;
    }
    jQuery.extend({
        cache: {},
        expando: "jQuery" + (core_version + Math.random()).replace(/\D/g, ""),
        noData: {
            embed: !0,
            object: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
            applet: !0
        },
        hasData: function(elem) {
            return !!(elem = elem.nodeType ? jQuery.cache[elem[jQuery.expando]] : elem[jQuery.expando]) && !isEmptyDataObject(elem);
        },
        data: function(elem, name, data) {
            return internalData(elem, name, data);
        },
        removeData: function(elem, name) {
            return internalRemoveData(elem, name);
        },
        _data: function(elem, name, data) {
            return internalData(elem, name, data, !0);
        },
        _removeData: function(elem, name) {
            return internalRemoveData(elem, name, !0);
        },
        acceptData: function(elem) {
            if (elem.nodeType && 1 !== elem.nodeType && 9 !== elem.nodeType) return !1;
            var noData = elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()];
            return !noData || !0 !== noData && elem.getAttribute("classid") === noData;
        }
    }), jQuery.fn.extend({
        data: function(key, value2) {
            var attrs, name, elem = this[0], i = 0, data = null;
            if (key === undefined) {
                if (this.length && (data = jQuery.data(elem), 1 === elem.nodeType && !jQuery._data(elem, "parsedAttrs"))) {
                    for(attrs = elem.attributes; i < attrs.length; i++)(name = attrs[i].name).indexOf("data-") || dataAttr(elem, name = jQuery.camelCase(name.slice(5)), data[name]);
                    jQuery._data(elem, "parsedAttrs", !0);
                }
                return data;
            }
            return "object" == typeof key ? this.each(function() {
                jQuery.data(this, key);
            }) : jQuery.access(this, function(value) {
                if (value === undefined) return elem ? dataAttr(elem, key, jQuery.data(elem, key)) : null;
                this.each(function() {
                    jQuery.data(this, key, value);
                });
            }, null, value2, arguments.length > 1, null, !0);
        },
        removeData: function(key) {
            return this.each(function() {
                jQuery.removeData(this, key);
            });
        }
    }), jQuery.extend({
        queue: function(elem, type, data) {
            var queue;
            if (elem) return type = (type || "fx") + "queue", queue = jQuery._data(elem, type), data && (!queue || jQuery.isArray(data) ? queue = jQuery._data(elem, type, jQuery.makeArray(data)) : queue.push(data)), queue || [];
        },
        dequeue: function(elem, type) {
            type = type || "fx";
            var queue = jQuery.queue(elem, type), startLength = queue.length, fn = queue.shift(), hooks = jQuery._queueHooks(elem, type);
            "inprogress" === fn && (fn = queue.shift(), startLength--), hooks.cur = fn, fn && ("fx" === type && queue.unshift("inprogress"), delete hooks.stop, fn.call(elem, function() {
                jQuery.dequeue(elem, type);
            }, hooks)), !startLength && hooks && hooks.empty.fire();
        },
        _queueHooks: function(elem, type) {
            var key = type + "queueHooks";
            return jQuery._data(elem, key) || jQuery._data(elem, key, {
                empty: jQuery.Callbacks("once memory").add(function() {
                    jQuery._removeData(elem, type + "queue"), jQuery._removeData(elem, key);
                })
            });
        }
    }), jQuery.fn.extend({
        queue: function(type, data) {
            var setter = 2;
            return ("string" != typeof type && (data = type, type = "fx", setter--), arguments.length < setter) ? jQuery.queue(this[0], type) : data === undefined ? this : this.each(function() {
                var queue = jQuery.queue(this, type, data);
                jQuery._queueHooks(this, type), "fx" === type && "inprogress" !== queue[0] && jQuery.dequeue(this, type);
            });
        },
        dequeue: function(type) {
            return this.each(function() {
                jQuery.dequeue(this, type);
            });
        },
        delay: function(time, type) {
            return time = jQuery.fx ? jQuery.fx.speeds[time] || time : time, type = type || "fx", this.queue(type, function(next, hooks) {
                var timeout = setTimeout(next, time);
                hooks.stop = function() {
                    clearTimeout(timeout);
                };
            });
        },
        clearQueue: function(type) {
            return this.queue(type || "fx", []);
        },
        promise: function(type, obj) {
            var tmp, count = 1, defer = jQuery.Deferred(), elements = this, i = this.length, resolve = function() {
                --count || defer.resolveWith(elements, [
                    elements
                ]);
            };
            for("string" != typeof type && (obj = type, type = undefined), type = type || "fx"; i--;)(tmp = jQuery._data(elements[i], type + "queueHooks")) && tmp.empty && (count++, tmp.empty.add(resolve));
            return resolve(), defer.promise(obj);
        }
    });
    var nodeHook, boolHook, rclass = /[\t\r\n]/g, rreturn = /\r/g, rfocusable = /^(?:input|select|textarea|button|object)$/i, rclickable = /^(?:a|area)$/i, rboolean = /^(?:checked|selected|autofocus|autoplay|async|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped)$/i, ruseDefault = /^(?:checked|selected)$/i, getSetAttribute = jQuery.support.getSetAttribute, getSetInput = jQuery.support.input;
    jQuery.fn.extend({
        attr: function(name, value) {
            return jQuery.access(this, jQuery.attr, name, value, arguments.length > 1);
        },
        removeAttr: function(name) {
            return this.each(function() {
                jQuery.removeAttr(this, name);
            });
        },
        prop: function(name, value) {
            return jQuery.access(this, jQuery.prop, name, value, arguments.length > 1);
        },
        removeProp: function(name) {
            return name = jQuery.propFix[name] || name, this.each(function() {
                try {
                    this[name] = undefined, delete this[name];
                } catch (e) {}
            });
        },
        addClass: function(value) {
            var classes, elem, cur, clazz, j1, i = 0, len = this.length;
            if (jQuery.isFunction(value)) return this.each(function(j) {
                jQuery(this).addClass(value.call(this, j, this.className));
            });
            if ("string" == typeof value && value) {
                for(classes = (value || "").match(core_rnotwhite) || []; i < len; i++)if (cur = 1 === (elem = this[i]).nodeType && (elem.className ? (" " + elem.className + " ").replace(rclass, " ") : " ")) {
                    for(j1 = 0; clazz = classes[j1++];)0 > cur.indexOf(" " + clazz + " ") && (cur += clazz + " ");
                    elem.className = jQuery.trim(cur);
                }
            }
            return this;
        },
        removeClass: function(value) {
            var classes, elem, cur, clazz, j2, i = 0, len = this.length, proceed = 0 === arguments.length || "string" == typeof value && value;
            if (jQuery.isFunction(value)) return this.each(function(j) {
                jQuery(this).removeClass(value.call(this, j, this.className));
            });
            if (proceed) {
                for(classes = (value || "").match(core_rnotwhite) || []; i < len; i++)if (cur = 1 === (elem = this[i]).nodeType && (elem.className ? (" " + elem.className + " ").replace(rclass, " ") : "")) {
                    for(j2 = 0; clazz = classes[j2++];)for(; cur.indexOf(" " + clazz + " ") >= 0;)cur = cur.replace(" " + clazz + " ", " ");
                    elem.className = value ? jQuery.trim(cur) : "";
                }
            }
            return this;
        },
        toggleClass: function(value, stateVal) {
            var type = typeof value, isBool = "boolean" == typeof stateVal;
            return jQuery.isFunction(value) ? this.each(function(i) {
                jQuery(this).toggleClass(value.call(this, i, this.className, stateVal), stateVal);
            }) : this.each(function() {
                if ("string" === type) for(var className, i = 0, self = jQuery(this), state = stateVal, classNames = value.match(core_rnotwhite) || []; className = classNames[i++];)state = isBool ? state : !self.hasClass(className), self[state ? "addClass" : "removeClass"](className);
                else (type === core_strundefined || "boolean" === type) && (this.className && jQuery._data(this, "__className__", this.className), this.className = this.className || !1 === value ? "" : jQuery._data(this, "__className__") || "");
            });
        },
        hasClass: function(selector) {
            for(var className = " " + selector + " ", i = 0, l = this.length; i < l; i++)if (1 === this[i].nodeType && (" " + this[i].className + " ").replace(rclass, " ").indexOf(className) >= 0) return !0;
            return !1;
        },
        val: function(value3) {
            var ret, hooks, isFunction, elem = this[0];
            return arguments.length ? (isFunction = jQuery.isFunction(value3), this.each(function(i) {
                var val, self = jQuery(this);
                1 === this.nodeType && (null == (val = isFunction ? value3.call(this, i, self.val()) : value3) ? val = "" : "number" == typeof val ? val += "" : jQuery.isArray(val) && (val = jQuery.map(val, function(value) {
                    return null == value ? "" : value + "";
                })), (hooks = jQuery.valHooks[this.type] || jQuery.valHooks[this.nodeName.toLowerCase()]) && "set" in hooks && undefined !== hooks.set(this, val, "value") || (this.value = val));
            })) : elem ? (hooks = jQuery.valHooks[elem.type] || jQuery.valHooks[elem.nodeName.toLowerCase()]) && "get" in hooks && undefined !== (ret = hooks.get(elem, "value")) ? ret : "string" == typeof (ret = elem.value) ? ret.replace(rreturn, "") : null == ret ? "" : ret : void 0;
        }
    }), jQuery.extend({
        valHooks: {
            option: {
                get: function(elem) {
                    var val = elem.attributes.value;
                    return !val || val.specified ? elem.value : elem.text;
                }
            },
            select: {
                get: function(elem) {
                    for(var value, option, options = elem.options, index = elem.selectedIndex, one = "select-one" === elem.type || index < 0, values = one ? null : [], max = one ? index + 1 : options.length, i = index < 0 ? max : one ? index : 0; i < max; i++)if (((option = options[i]).selected || i === index) && (jQuery.support.optDisabled ? !option.disabled : null === option.getAttribute("disabled")) && (!option.parentNode.disabled || !jQuery.nodeName(option.parentNode, "optgroup"))) {
                        if (value = jQuery(option).val(), one) return value;
                        values.push(value);
                    }
                    return values;
                },
                set: function(elem, value) {
                    var values = jQuery.makeArray(value);
                    return jQuery(elem).find("option").each(function() {
                        this.selected = jQuery.inArray(jQuery(this).val(), values) >= 0;
                    }), values.length || (elem.selectedIndex = -1), values;
                }
            }
        },
        attr: function(elem, name, value) {
            var hooks, notxml, ret, nType = elem.nodeType;
            if (elem && 3 !== nType && 8 !== nType && 2 !== nType) {
                if (typeof elem.getAttribute === core_strundefined) return jQuery.prop(elem, name, value);
                if ((notxml = 1 !== nType || !jQuery.isXMLDoc(elem)) && (name = name.toLowerCase(), hooks = jQuery.attrHooks[name] || (rboolean.test(name) ? boolHook : nodeHook)), value !== undefined) {
                    if (null === value) jQuery.removeAttr(elem, name);
                    else if (hooks && notxml && "set" in hooks && undefined !== (ret = hooks.set(elem, value, name))) return ret;
                    else return elem.setAttribute(name, value + ""), value;
                } else if (hooks && notxml && "get" in hooks && null !== (ret = hooks.get(elem, name))) return ret;
                else return typeof elem.getAttribute !== core_strundefined && (ret = elem.getAttribute(name)), null == ret ? undefined : ret;
            }
        },
        removeAttr: function(elem, value) {
            var name, propName, i = 0, attrNames = value && value.match(core_rnotwhite);
            if (attrNames && 1 === elem.nodeType) for(; name = attrNames[i++];)propName = jQuery.propFix[name] || name, rboolean.test(name) ? !getSetAttribute && ruseDefault.test(name) ? elem[jQuery.camelCase("default-" + name)] = elem[propName] = !1 : elem[propName] = !1 : jQuery.attr(elem, name, ""), elem.removeAttribute(getSetAttribute ? name : propName);
        },
        attrHooks: {
            type: {
                set: function(elem, value) {
                    if (!jQuery.support.radioValue && "radio" === value && jQuery.nodeName(elem, "input")) {
                        var val = elem.value;
                        return elem.setAttribute("type", value), val && (elem.value = val), value;
                    }
                }
            }
        },
        propFix: {
            tabindex: "tabIndex",
            readonly: "readOnly",
            "for": "htmlFor",
            "class": "className",
            maxlength: "maxLength",
            cellspacing: "cellSpacing",
            cellpadding: "cellPadding",
            rowspan: "rowSpan",
            colspan: "colSpan",
            usemap: "useMap",
            frameborder: "frameBorder",
            contenteditable: "contentEditable"
        },
        prop: function(elem, name, value) {
            var ret, hooks, nType = elem.nodeType;
            if (elem && 3 !== nType && 8 !== nType && 2 !== nType) return (1 === nType && jQuery.isXMLDoc(elem) || (name = jQuery.propFix[name] || name, hooks = jQuery.propHooks[name]), value !== undefined) ? hooks && "set" in hooks && undefined !== (ret = hooks.set(elem, value, name)) ? ret : elem[name] = value : hooks && "get" in hooks && null !== (ret = hooks.get(elem, name)) ? ret : elem[name];
        },
        propHooks: {
            tabIndex: {
                get: function(elem) {
                    var attributeNode = elem.getAttributeNode("tabindex");
                    return attributeNode && attributeNode.specified ? parseInt(attributeNode.value, 10) : rfocusable.test(elem.nodeName) || rclickable.test(elem.nodeName) && elem.href ? 0 : undefined;
                }
            }
        }
    }), boolHook = {
        get: function(elem, name) {
            var prop = jQuery.prop(elem, name), attr = "boolean" == typeof prop && elem.getAttribute(name), detail = "boolean" == typeof prop ? getSetInput && getSetAttribute ? null != attr : ruseDefault.test(name) ? elem[jQuery.camelCase("default-" + name)] : !!attr : elem.getAttributeNode(name);
            return detail && !1 !== detail.value ? name.toLowerCase() : undefined;
        },
        set: function(elem, value, name) {
            return !1 === value ? jQuery.removeAttr(elem, name) : getSetInput && getSetAttribute || !ruseDefault.test(name) ? elem.setAttribute(!getSetAttribute && jQuery.propFix[name] || name, name) : elem[jQuery.camelCase("default-" + name)] = elem[name] = !0, name;
        }
    }, getSetInput && getSetAttribute || (jQuery.attrHooks.value = {
        get: function(elem, name) {
            var ret = elem.getAttributeNode(name);
            return jQuery.nodeName(elem, "input") ? elem.defaultValue : ret && ret.specified ? ret.value : undefined;
        },
        set: function(elem, value, name) {
            if (!jQuery.nodeName(elem, "input")) return nodeHook && nodeHook.set(elem, value, name);
            elem.defaultValue = value;
        }
    }), getSetAttribute || (nodeHook = jQuery.valHooks.button = {
        get: function(elem, name) {
            var ret = elem.getAttributeNode(name);
            return ret && ("id" === name || "name" === name || "coords" === name ? "" !== ret.value : ret.specified) ? ret.value : undefined;
        },
        set: function(elem, value, name) {
            var ret = elem.getAttributeNode(name);
            return ret || elem.setAttributeNode(ret = elem.ownerDocument.createAttribute(name)), ret.value = value += "", "value" === name || value === elem.getAttribute(name) ? value : undefined;
        }
    }, jQuery.attrHooks.contenteditable = {
        get: nodeHook.get,
        set: function(elem, value, name) {
            nodeHook.set(elem, "" !== value && value, name);
        }
    }, jQuery.each([
        "width",
        "height"
    ], function(i, name) {
        jQuery.attrHooks[name] = jQuery.extend(jQuery.attrHooks[name], {
            set: function(elem, value) {
                if ("" === value) return elem.setAttribute(name, "auto"), value;
            }
        });
    })), jQuery.support.hrefNormalized || (jQuery.each([
        "href",
        "src",
        "width",
        "height"
    ], function(i, name) {
        jQuery.attrHooks[name] = jQuery.extend(jQuery.attrHooks[name], {
            get: function(elem) {
                var ret = elem.getAttribute(name, 2);
                return null == ret ? undefined : ret;
            }
        });
    }), jQuery.each([
        "href",
        "src"
    ], function(i, name) {
        jQuery.propHooks[name] = {
            get: function(elem) {
                return elem.getAttribute(name, 4);
            }
        };
    })), jQuery.support.style || (jQuery.attrHooks.style = {
        get: function(elem) {
            return elem.style.cssText || undefined;
        },
        set: function(elem, value) {
            return elem.style.cssText = value + "";
        }
    }), jQuery.support.optSelected || (jQuery.propHooks.selected = jQuery.extend(jQuery.propHooks.selected, {
        get: function(elem) {
            var parent = elem.parentNode;
            return parent && (parent.selectedIndex, parent.parentNode && parent.parentNode.selectedIndex), null;
        }
    })), jQuery.support.enctype || (jQuery.propFix.enctype = "encoding"), jQuery.support.checkOn || jQuery.each([
        "radio",
        "checkbox"
    ], function() {
        jQuery.valHooks[this] = {
            get: function(elem) {
                return null === elem.getAttribute("value") ? "on" : elem.value;
            }
        };
    }), jQuery.each([
        "radio",
        "checkbox"
    ], function() {
        jQuery.valHooks[this] = jQuery.extend(jQuery.valHooks[this], {
            set: function(elem, value) {
                if (jQuery.isArray(value)) return elem.checked = jQuery.inArray(jQuery(elem).val(), value) >= 0;
            }
        });
    });
    var rformElems = /^(?:input|select|textarea)$/i, rkeyEvent = /^key/, rmouseEvent = /^(?:mouse|contextmenu)|click/, rfocusMorph = /^(?:focusinfocus|focusoutblur)$/, rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;
    function returnTrue() {
        return !0;
    }
    function returnFalse() {
        return !1;
    }
    jQuery.event = {
        global: {},
        add: function(elem, types, handler, data, selector) {
            var tmp, events, t, handleObjIn, special, eventHandle, handleObj, handlers, type, namespaces, origType, elemData = jQuery._data(elem);
            if (elemData) {
                for(handler.handler && (handler = (handleObjIn = handler).handler, selector = handleObjIn.selector), handler.guid || (handler.guid = jQuery.guid++), (events = elemData.events) || (events = elemData.events = {}), (eventHandle = elemData.handle) || ((eventHandle = elemData.handle = function(e) {
                    return "function" === core_strundefined || e && jQuery.event.triggered === e.type ? undefined : jQuery.event.dispatch.apply(eventHandle.elem, arguments);
                }).elem = elem), t = (types = (types || "").match(core_rnotwhite) || [
                    ""
                ]).length; t--;)type = origType = (tmp = rtypenamespace.exec(types[t]) || [])[1], namespaces = (tmp[2] || "").split(".").sort(), special = jQuery.event.special[type] || {}, type = (selector ? special.delegateType : special.bindType) || type, special = jQuery.event.special[type] || {}, handleObj = jQuery.extend({
                    type: type,
                    origType: origType,
                    data: data,
                    handler: handler,
                    guid: handler.guid,
                    selector: selector,
                    needsContext: selector && jQuery.expr.match.needsContext.test(selector),
                    namespace: namespaces.join(".")
                }, handleObjIn), (handlers = events[type]) || ((handlers = events[type] = []).delegateCount = 0, (!special.setup || !1 === special.setup.call(elem, data, namespaces, eventHandle)) && (elem.addEventListener ? elem.addEventListener(type, eventHandle, !1) : elem.attachEvent && elem.attachEvent("on" + type, eventHandle))), special.add && (special.add.call(elem, handleObj), handleObj.handler.guid || (handleObj.handler.guid = handler.guid)), selector ? handlers.splice(handlers.delegateCount++, 0, handleObj) : handlers.push(handleObj), jQuery.event.global[type] = !0;
                elem = null;
            }
        },
        remove: function(elem, types, handler, selector, mappedTypes) {
            var j, handleObj, tmp, origCount, t, events, special, handlers, type, namespaces, origType, elemData = jQuery.hasData(elem) && jQuery._data(elem);
            if (elemData && (events = elemData.events)) {
                for(t = (types = (types || "").match(core_rnotwhite) || [
                    ""
                ]).length; t--;){
                    if (type = origType = (tmp = rtypenamespace.exec(types[t]) || [])[1], namespaces = (tmp[2] || "").split(".").sort(), !type) {
                        for(type in events)jQuery.event.remove(elem, type + types[t], handler, selector, !0);
                        continue;
                    }
                    for(special = jQuery.event.special[type] || {}, handlers = events[type = (selector ? special.delegateType : special.bindType) || type] || [], tmp = tmp[2] && new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)"), origCount = j = handlers.length; j--;)handleObj = handlers[j], (mappedTypes || origType === handleObj.origType) && (!handler || handler.guid === handleObj.guid) && (!tmp || tmp.test(handleObj.namespace)) && (!selector || selector === handleObj.selector || "**" === selector && handleObj.selector) && (handlers.splice(j, 1), handleObj.selector && handlers.delegateCount--, special.remove && special.remove.call(elem, handleObj));
                    origCount && !handlers.length && (special.teardown && !1 !== special.teardown.call(elem, namespaces, elemData.handle) || jQuery.removeEvent(elem, type, elemData.handle), delete events[type]);
                }
                jQuery.isEmptyObject(events) && (delete elemData.handle, jQuery._removeData(elem, "events"));
            }
        },
        trigger: function(event, data, elem, onlyHandlers) {
            var handle, ontype, cur, bubbleType, special, tmp, i, eventPath = [
                elem || document1
            ], type = core_hasOwn.call(event, "type") ? event.type : event, namespaces = core_hasOwn.call(event, "namespace") ? event.namespace.split(".") : [];
            if (cur = tmp = elem = elem || document1, 3 !== elem.nodeType && 8 !== elem.nodeType && !rfocusMorph.test(type + jQuery.event.triggered) && (type.indexOf(".") >= 0 && (type = (namespaces = type.split(".")).shift(), namespaces.sort()), ontype = 0 > type.indexOf(":") && "on" + type, (event = event[jQuery.expando] ? event : new jQuery.Event(type, "object" == typeof event && event)).isTrigger = !0, event.namespace = namespaces.join("."), event.namespace_re = event.namespace ? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, event.result = undefined, event.target || (event.target = elem), data = null == data ? [
                event
            ] : jQuery.makeArray(data, [
                event
            ]), special = jQuery.event.special[type] || {}, onlyHandlers || !special.trigger || !1 !== special.trigger.apply(elem, data))) {
                if (!onlyHandlers && !special.noBubble && !jQuery.isWindow(elem)) {
                    for(bubbleType = special.delegateType || type, rfocusMorph.test(bubbleType + type) || (cur = cur.parentNode); cur; cur = cur.parentNode)eventPath.push(cur), tmp = cur;
                    tmp === (elem.ownerDocument || document1) && eventPath.push(tmp.defaultView || tmp.parentWindow || window1);
                }
                for(i = 0; (cur = eventPath[i++]) && !event.isPropagationStopped();)event.type = i > 1 ? bubbleType : special.bindType || type, (handle = (jQuery._data(cur, "events") || {})[event.type] && jQuery._data(cur, "handle")) && handle.apply(cur, data), (handle = ontype && cur[ontype]) && jQuery.acceptData(cur) && handle.apply && !1 === handle.apply(cur, data) && event.preventDefault();
                if (event.type = type, !onlyHandlers && !event.isDefaultPrevented() && (!special._default || !1 === special._default.apply(elem.ownerDocument, data)) && !("click" === type && jQuery.nodeName(elem, "a")) && jQuery.acceptData(elem) && ontype && elem[type] && !jQuery.isWindow(elem)) {
                    (tmp = elem[ontype]) && (elem[ontype] = null), jQuery.event.triggered = type;
                    try {
                        elem[type]();
                    } catch (e) {}
                    jQuery.event.triggered = undefined, tmp && (elem[ontype] = tmp);
                }
                return event.result;
            }
        },
        dispatch: function(event) {
            event = jQuery.event.fix(event);
            var i, ret, handleObj, matched, j, handlerQueue = [], args = core_slice.call(arguments), handlers = (jQuery._data(this, "events") || {})[event.type] || [], special = jQuery.event.special[event.type] || {};
            if (args[0] = event, event.delegateTarget = this, !special.preDispatch || !1 !== special.preDispatch.call(this, event)) {
                for(handlerQueue = jQuery.event.handlers.call(this, event, handlers), i = 0; (matched = handlerQueue[i++]) && !event.isPropagationStopped();)for(event.currentTarget = matched.elem, j = 0; (handleObj = matched.handlers[j++]) && !event.isImmediatePropagationStopped();)(!event.namespace_re || event.namespace_re.test(handleObj.namespace)) && (event.handleObj = handleObj, event.data = handleObj.data, undefined !== (ret = ((jQuery.event.special[handleObj.origType] || {}).handle || handleObj.handler).apply(matched.elem, args)) && !1 === (event.result = ret) && (event.preventDefault(), event.stopPropagation()));
                return special.postDispatch && special.postDispatch.call(this, event), event.result;
            }
        },
        handlers: function(event, handlers) {
            var sel, handleObj, matches, i, handlerQueue = [], delegateCount = handlers.delegateCount, cur = event.target;
            if (delegateCount && cur.nodeType && (!event.button || "click" !== event.type)) {
                for(; cur != this; cur = cur.parentNode || this)if (1 === cur.nodeType && (!0 !== cur.disabled || "click" !== event.type)) {
                    for(i = 0, matches = []; i < delegateCount; i++)undefined === matches[sel = (handleObj = handlers[i]).selector + " "] && (matches[sel] = handleObj.needsContext ? jQuery(sel, this).index(cur) >= 0 : jQuery.find(sel, this, null, [
                        cur
                    ]).length), matches[sel] && matches.push(handleObj);
                    matches.length && handlerQueue.push({
                        elem: cur,
                        handlers: matches
                    });
                }
            }
            return delegateCount < handlers.length && handlerQueue.push({
                elem: this,
                handlers: handlers.slice(delegateCount)
            }), handlerQueue;
        },
        fix: function(event) {
            if (event[jQuery.expando]) return event;
            var i, prop, copy, type = event.type, originalEvent = event, fixHook = this.fixHooks[type];
            for(fixHook || (this.fixHooks[type] = fixHook = rmouseEvent.test(type) ? this.mouseHooks : rkeyEvent.test(type) ? this.keyHooks : {}), copy = fixHook.props ? this.props.concat(fixHook.props) : this.props, event = new jQuery.Event(originalEvent), i = copy.length; i--;)event[prop = copy[i]] = originalEvent[prop];
            return event.target || (event.target = originalEvent.srcElement || document1), 3 === event.target.nodeType && (event.target = event.target.parentNode), event.metaKey = !!event.metaKey, fixHook.filter ? fixHook.filter(event, originalEvent) : event;
        },
        props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
        fixHooks: {},
        keyHooks: {
            props: "char charCode key keyCode".split(" "),
            filter: function(event, original) {
                return null == event.which && (event.which = null != original.charCode ? original.charCode : original.keyCode), event;
            }
        },
        mouseHooks: {
            props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
            filter: function(event, original) {
                var body, eventDoc, doc, button = original.button, fromElement = original.fromElement;
                return null == event.pageX && null != original.clientX && (doc = (eventDoc = event.target.ownerDocument || document1).documentElement, body = eventDoc.body, event.pageX = original.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0), event.pageY = original.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0)), !event.relatedTarget && fromElement && (event.relatedTarget = fromElement === event.target ? original.toElement : fromElement), event.which || button === undefined || (event.which = 1 & button ? 1 : 2 & button ? 3 : 4 & button ? 2 : 0), event;
            }
        },
        special: {
            load: {
                noBubble: !0
            },
            click: {
                trigger: function() {
                    if (jQuery.nodeName(this, "input") && "checkbox" === this.type && this.click) return this.click(), !1;
                }
            },
            focus: {
                trigger: function() {
                    if (this !== document1.activeElement && this.focus) try {
                        return this.focus(), !1;
                    } catch (e) {}
                },
                delegateType: "focusin"
            },
            blur: {
                trigger: function() {
                    if (this === document1.activeElement && this.blur) return this.blur(), !1;
                },
                delegateType: "focusout"
            },
            beforeunload: {
                postDispatch: function(event) {
                    undefined !== event.result && (event.originalEvent.returnValue = event.result);
                }
            }
        },
        simulate: function(type, elem, event, bubble) {
            var e = jQuery.extend(new jQuery.Event(), event, {
                type: type,
                isSimulated: !0,
                originalEvent: {}
            });
            bubble ? jQuery.event.trigger(e, null, elem) : jQuery.event.dispatch.call(elem, e), e.isDefaultPrevented() && event.preventDefault();
        }
    }, jQuery.removeEvent = document1.removeEventListener ? function(elem, type, handle) {
        elem.removeEventListener && elem.removeEventListener(type, handle, !1);
    } : function(elem, type, handle) {
        var name = "on" + type;
        elem.detachEvent && (typeof elem[name] === core_strundefined && (elem[name] = null), elem.detachEvent(name, handle));
    }, jQuery.Event = function(src, props) {
        if (!(this instanceof jQuery.Event)) return new jQuery.Event(src, props);
        src && src.type ? (this.originalEvent = src, this.type = src.type, this.isDefaultPrevented = src.defaultPrevented || !1 === src.returnValue || src.getPreventDefault && src.getPreventDefault() ? returnTrue : returnFalse) : this.type = src, props && jQuery.extend(this, props), this.timeStamp = src && src.timeStamp || jQuery.now(), this[jQuery.expando] = !0;
    }, jQuery.Event.prototype = {
        isDefaultPrevented: returnFalse,
        isPropagationStopped: returnFalse,
        isImmediatePropagationStopped: returnFalse,
        preventDefault: function() {
            var e = this.originalEvent;
            this.isDefaultPrevented = returnTrue, e && (e.preventDefault ? e.preventDefault() : e.returnValue = !1);
        },
        stopPropagation: function() {
            var e = this.originalEvent;
            this.isPropagationStopped = returnTrue, e && (e.stopPropagation && e.stopPropagation(), e.cancelBubble = !0);
        },
        stopImmediatePropagation: function() {
            this.isImmediatePropagationStopped = returnTrue, this.stopPropagation();
        }
    }, jQuery.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout"
    }, function(orig, fix) {
        jQuery.event.special[orig] = {
            delegateType: fix,
            bindType: fix,
            handle: function(event) {
                var ret, related = event.relatedTarget, handleObj = event.handleObj;
                return related && (related === this || jQuery.contains(this, related)) || (event.type = handleObj.origType, ret = handleObj.handler.apply(this, arguments), event.type = fix), ret;
            }
        };
    }), jQuery.support.submitBubbles || (jQuery.event.special.submit = {
        setup: function() {
            if (jQuery.nodeName(this, "form")) return !1;
            jQuery.event.add(this, "click._submit keypress._submit", function(e) {
                var elem = e.target, form = jQuery.nodeName(elem, "input") || jQuery.nodeName(elem, "button") ? elem.form : undefined;
                form && !jQuery._data(form, "submitBubbles") && (jQuery.event.add(form, "submit._submit", function(event) {
                    event._submit_bubble = !0;
                }), jQuery._data(form, "submitBubbles", !0));
            });
        },
        postDispatch: function(event) {
            event._submit_bubble && (delete event._submit_bubble, this.parentNode && !event.isTrigger && jQuery.event.simulate("submit", this.parentNode, event, !0));
        },
        teardown: function() {
            if (jQuery.nodeName(this, "form")) return !1;
            jQuery.event.remove(this, "._submit");
        }
    }), jQuery.support.changeBubbles || (jQuery.event.special.change = {
        setup: function() {
            if (rformElems.test(this.nodeName)) return ("checkbox" === this.type || "radio" === this.type) && (jQuery.event.add(this, "propertychange._change", function(event) {
                "checked" === event.originalEvent.propertyName && (this._just_changed = !0);
            }), jQuery.event.add(this, "click._change", function(event) {
                this._just_changed && !event.isTrigger && (this._just_changed = !1), jQuery.event.simulate("change", this, event, !0);
            })), !1;
            jQuery.event.add(this, "beforeactivate._change", function(e) {
                var elem = e.target;
                rformElems.test(elem.nodeName) && !jQuery._data(elem, "changeBubbles") && (jQuery.event.add(elem, "change._change", function(event) {
                    !this.parentNode || event.isSimulated || event.isTrigger || jQuery.event.simulate("change", this.parentNode, event, !0);
                }), jQuery._data(elem, "changeBubbles", !0));
            });
        },
        handle: function(event) {
            var elem = event.target;
            if (this !== elem || event.isSimulated || event.isTrigger || "radio" !== elem.type && "checkbox" !== elem.type) return event.handleObj.handler.apply(this, arguments);
        },
        teardown: function() {
            return jQuery.event.remove(this, "._change"), !rformElems.test(this.nodeName);
        }
    }), jQuery.support.focusinBubbles || jQuery.each({
        focus: "focusin",
        blur: "focusout"
    }, function(orig, fix) {
        var attaches = 0, handler = function(event) {
            jQuery.event.simulate(fix, event.target, jQuery.event.fix(event), !0);
        };
        jQuery.event.special[fix] = {
            setup: function() {
                0 == attaches++ && document1.addEventListener(orig, handler, !0);
            },
            teardown: function() {
                0 == --attaches && document1.removeEventListener(orig, handler, !0);
            }
        };
    }), jQuery.fn.extend({
        on: function(types, selector, data, fn, one) {
            var type, origFn;
            if ("object" == typeof types) {
                for(type in "string" != typeof selector && (data = data || selector, selector = undefined), types)this.on(type, selector, data, types[type], one);
                return this;
            }
            if (null == data && null == fn ? (fn = selector, data = selector = undefined) : null == fn && ("string" == typeof selector ? (fn = data, data = undefined) : (fn = data, data = selector, selector = undefined)), !1 === fn) fn = returnFalse;
            else if (!fn) return this;
            return 1 === one && (origFn = fn, (fn = function(event) {
                return jQuery().off(event), origFn.apply(this, arguments);
            }).guid = origFn.guid || (origFn.guid = jQuery.guid++)), this.each(function() {
                jQuery.event.add(this, types, fn, data, selector);
            });
        },
        one: function(types, selector, data, fn) {
            return this.on(types, selector, data, fn, 1);
        },
        off: function(types, selector, fn) {
            var handleObj, type;
            if (types && types.preventDefault && types.handleObj) return handleObj = types.handleObj, jQuery(types.delegateTarget).off(handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType, handleObj.selector, handleObj.handler), this;
            if ("object" == typeof types) {
                for(type in types)this.off(type, selector, types[type]);
                return this;
            }
            return (!1 === selector || "function" == typeof selector) && (fn = selector, selector = undefined), !1 === fn && (fn = returnFalse), this.each(function() {
                jQuery.event.remove(this, types, fn, selector);
            });
        },
        bind: function(types, data, fn) {
            return this.on(types, null, data, fn);
        },
        unbind: function(types, fn) {
            return this.off(types, null, fn);
        },
        delegate: function(selector, types, data, fn) {
            return this.on(types, selector, data, fn);
        },
        undelegate: function(selector, types, fn) {
            return 1 === arguments.length ? this.off(selector, "**") : this.off(types, selector || "**", fn);
        },
        trigger: function(type, data) {
            return this.each(function() {
                jQuery.event.trigger(type, data, this);
            });
        },
        triggerHandler: function(type, data) {
            var elem = this[0];
            if (elem) return jQuery.event.trigger(type, data, elem, !0);
        }
    }), function(window, undefined) {
        var i2, cachedruns, Expr, getText, isXML, compile, hasDuplicate, outermostContext, setDocument, document, docElem, documentIsXML, rbuggyQSA, rbuggyMatches, matches1, contains, sortOrder, expando = "sizzle" + -new Date(), preferredDoc = window.document, support = {}, dirruns = 0, done = 0, classCache = createCache(), tokenCache = createCache(), compilerCache = createCache(), strundefined = "undefined", arr = [], pop = arr.pop, push = arr.push, slice = arr.slice, indexOf = arr.indexOf || function(elem) {
            for(var i = 0, len = this.length; i < len; i++)if (this[i] === elem) return i;
            return -1;
        }, whitespace = "[\\x20\\t\\r\\n\\f]", characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+", identifier = characterEncoding.replace("w", "w#"), attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace + "*(?:([*^$|!~]?=)" + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]", pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace(3, 8) + ")*)|.*)\\)|)", rtrim = new RegExp("^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g"), rcomma = new RegExp("^" + whitespace + "*," + whitespace + "*"), rcombinators = new RegExp("^" + whitespace + "*([\\x20\\t\\r\\n\\f>+~])" + whitespace + "*"), rpseudo = new RegExp(pseudos), ridentifier = new RegExp("^" + identifier + "$"), matchExpr = {
            ID: new RegExp("^#(" + characterEncoding + ")"),
            CLASS: new RegExp("^\\.(" + characterEncoding + ")"),
            NAME: new RegExp("^\\[name=['\"]?(" + characterEncoding + ")['\"]?\\]"),
            TAG: new RegExp("^(" + characterEncoding.replace("w", "w*") + ")"),
            ATTR: new RegExp("^" + attributes),
            PSEUDO: new RegExp("^" + pseudos),
            CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace + "*(\\d+)|))" + whitespace + "*\\)|)", "i"),
            needsContext: new RegExp("^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i")
        }, rsibling = /[\x20\t\r\n\f]*[+~]/, rnative = /^[^{]+\{\s*\[native code/, rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, rinputs = /^(?:input|select|textarea|button)$/i, rheader = /^h\d$/i, rescape = /'|\\/g, rattributeQuotes = /\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g, runescape = /\\([\da-fA-F]{1,6}[\x20\t\r\n\f]?|.)/g, funescape = function(_, escaped) {
            var high = "0x" + escaped - 0x10000;
            return high != high ? escaped : high < 0 ? String.fromCharCode(high + 0x10000) : String.fromCharCode(high >> 10 | 0xD800, 0x3FF & high | 0xDC00);
        };
        try {
            slice.call(preferredDoc.documentElement.childNodes, 0)[0].nodeType;
        } catch (e) {
            slice = function(i) {
                for(var elem, results = []; elem = this[i++];)results.push(elem);
                return results;
            };
        }
        function isNative(fn) {
            return rnative.test(fn + "");
        }
        function createCache() {
            var cache, keys = [];
            return cache = function(key, value) {
                return keys.push(key += " ") > Expr.cacheLength && delete cache[keys.shift()], cache[key] = value;
            };
        }
        function markFunction(fn) {
            return fn[expando] = !0, fn;
        }
        function assert(fn) {
            var div = document.createElement("div");
            try {
                return fn(div);
            } catch (e) {
                return !1;
            } finally{
                div = null;
            }
        }
        function Sizzle(selector, context, results, seed) {
            var match, elem, m, nodeType, i, groups, old, nid, newContext, newSelector;
            if ((context ? context.ownerDocument || context : preferredDoc) !== document && setDocument(context), context = context || document, results = results || [], !selector || "string" != typeof selector) return results;
            if (1 !== (nodeType = context.nodeType) && 9 !== nodeType) return [];
            if (!documentIsXML && !seed) {
                if (match = rquickExpr.exec(selector)) {
                    if (m = match[1]) {
                        if (9 === nodeType) {
                            if (!(elem = context.getElementById(m)) || !elem.parentNode) return results;
                            if (elem.id === m) return results.push(elem), results;
                        } else if (context.ownerDocument && (elem = context.ownerDocument.getElementById(m)) && contains(context, elem) && elem.id === m) return results.push(elem), results;
                    } else if (match[2]) return push.apply(results, slice.call(context.getElementsByTagName(selector), 0)), results;
                    else if ((m = match[3]) && support.getByClassName && context.getElementsByClassName) return push.apply(results, slice.call(context.getElementsByClassName(m), 0)), results;
                }
                if (support.qsa && !rbuggyQSA.test(selector)) {
                    if (old = !0, nid = expando, newContext = context, newSelector = 9 === nodeType && selector, 1 === nodeType && "object" !== context.nodeName.toLowerCase()) {
                        for(groups = tokenize(selector), (old = context.getAttribute("id")) ? nid = old.replace(rescape, "\\$&") : context.setAttribute("id", nid), nid = "[id='" + nid + "'] ", i = groups.length; i--;)groups[i] = nid + toSelector(groups[i]);
                        newContext = rsibling.test(selector) && context.parentNode || context, newSelector = groups.join(",");
                    }
                    if (newSelector) try {
                        return push.apply(results, slice.call(newContext.querySelectorAll(newSelector), 0)), results;
                    } catch (qsaError) {} finally{
                        old || context.removeAttribute("id");
                    }
                }
            }
            return select(selector.replace(rtrim, "$1"), context, results, seed);
        }
        function siblingCheck(a, b) {
            var cur = b && a, diff = cur && (~b.sourceIndex || -2147483648) - (~a.sourceIndex || -2147483648);
            if (diff) return diff;
            if (cur) {
                for(; cur = cur.nextSibling;)if (cur === b) return -1;
            }
            return a ? 1 : -1;
        }
        function createInputPseudo(type) {
            return function(elem) {
                return "input" === elem.nodeName.toLowerCase() && elem.type === type;
            };
        }
        function createButtonPseudo(type) {
            return function(elem) {
                var name = elem.nodeName.toLowerCase();
                return ("input" === name || "button" === name) && elem.type === type;
            };
        }
        function createPositionalPseudo(fn) {
            return markFunction(function(argument) {
                return argument = +argument, markFunction(function(seed, matches) {
                    for(var j, matchIndexes = fn([], seed.length, argument), i = matchIndexes.length; i--;)seed[j = matchIndexes[i]] && (seed[j] = !(matches[j] = seed[j]));
                });
            });
        }
        for(i2 in isXML = Sizzle.isXML = function(elem) {
            var documentElement = elem && (elem.ownerDocument || elem).documentElement;
            return !!documentElement && "HTML" !== documentElement.nodeName;
        }, setDocument = Sizzle.setDocument = function(node1) {
            var doc = node1 ? node1.ownerDocument || node1 : preferredDoc;
            return doc !== document && 9 === doc.nodeType && doc.documentElement && (document = doc, docElem = doc.documentElement, documentIsXML = isXML(doc), support.tagNameNoComments = assert(function(div) {
                return div.appendChild(doc.createComment("")), !div.getElementsByTagName("*").length;
            }), support.attributes = assert(function(div) {
                div.innerHTML = "<select></select>";
                var type = typeof div.lastChild.getAttribute("multiple");
                return "boolean" !== type && "string" !== type;
            }), support.getByClassName = assert(function(div) {
                return div.innerHTML = "<div class='hidden e'></div><div class='hidden'></div>", !!div.getElementsByClassName && !!div.getElementsByClassName("e").length && (div.lastChild.className = "e", 2 === div.getElementsByClassName("e").length);
            }), support.getByName = assert(function(div) {
                div.id = expando + 0, div.innerHTML = "<a name='" + expando + "'></a><div name='" + expando + "'></div>", docElem.insertBefore(div, docElem.firstChild);
                var pass = doc.getElementsByName && doc.getElementsByName(expando).length === 2 + doc.getElementsByName(expando + 0).length;
                return support.getIdNotName = !doc.getElementById(expando), docElem.removeChild(div), pass;
            }), Expr.attrHandle = assert(function(div) {
                return div.innerHTML = "<a href='#'></a>", div.firstChild && typeof div.firstChild.getAttribute !== strundefined && "#" === div.firstChild.getAttribute("href");
            }) ? {} : {
                href: function(elem) {
                    return elem.getAttribute("href", 2);
                },
                type: function(elem) {
                    return elem.getAttribute("type");
                }
            }, support.getIdNotName ? (Expr.find.ID = function(id, context) {
                if (typeof context.getElementById !== strundefined && !documentIsXML) {
                    var m = context.getElementById(id);
                    return m && m.parentNode ? [
                        m
                    ] : [];
                }
            }, Expr.filter.ID = function(id) {
                var attrId = id.replace(runescape, funescape);
                return function(elem) {
                    return elem.getAttribute("id") === attrId;
                };
            }) : (Expr.find.ID = function(id, context) {
                if (typeof context.getElementById !== strundefined && !documentIsXML) {
                    var m = context.getElementById(id);
                    return m ? m.id === id || typeof m.getAttributeNode !== strundefined && m.getAttributeNode("id").value === id ? [
                        m
                    ] : void 0 : [];
                }
            }, Expr.filter.ID = function(id) {
                var attrId = id.replace(runescape, funescape);
                return function(elem) {
                    var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
                    return node && node.value === attrId;
                };
            }), Expr.find.TAG = support.tagNameNoComments ? function(tag, context) {
                if (typeof context.getElementsByTagName !== strundefined) return context.getElementsByTagName(tag);
            } : function(tag, context) {
                var elem, tmp = [], i = 0, results = context.getElementsByTagName(tag);
                if ("*" === tag) {
                    for(; elem = results[i++];)1 === elem.nodeType && tmp.push(elem);
                    return tmp;
                }
                return results;
            }, Expr.find.NAME = support.getByName && function(tag, context) {
                if (typeof context.getElementsByName !== strundefined) return context.getElementsByName(name);
            }, Expr.find.CLASS = support.getByClassName && function(className, context) {
                if (typeof context.getElementsByClassName !== strundefined && !documentIsXML) return context.getElementsByClassName(className);
            }, rbuggyMatches = [], rbuggyQSA = [
                ":focus"
            ], (support.qsa = isNative(doc.querySelectorAll)) && (assert(function(div) {
                div.innerHTML = "<select><option selected=''></option></select>", div.querySelectorAll("[selected]").length || rbuggyQSA.push("\\[" + whitespace + "*(?:checked|disabled|ismap|multiple|readonly|selected|value)"), div.querySelectorAll(":checked").length || rbuggyQSA.push(":checked");
            }), assert(function(div) {
                div.innerHTML = "<input type='hidden' i=''/>", div.querySelectorAll("[i^='']").length && rbuggyQSA.push("[*^$]=" + whitespace + "*(?:\"\"|'')"), div.querySelectorAll(":enabled").length || rbuggyQSA.push(":enabled", ":disabled"), div.querySelectorAll("*,:x"), rbuggyQSA.push(",.*:");
            })), (support.matchesSelector = isNative(matches1 = docElem.matchesSelector || docElem.mozMatchesSelector || docElem.webkitMatchesSelector || docElem.oMatchesSelector || docElem.msMatchesSelector)) && assert(function(div) {
                support.disconnectedMatch = matches1.call(div, "div"), matches1.call(div, "[s!='']:x"), rbuggyMatches.push("!=", pseudos);
            }), rbuggyQSA = new RegExp(rbuggyQSA.join("|")), rbuggyMatches = new RegExp(rbuggyMatches.join("|")), contains = isNative(docElem.contains) || docElem.compareDocumentPosition ? function(a, b) {
                var adown = 9 === a.nodeType ? a.documentElement : a, bup = b && b.parentNode;
                return a === bup || !!(bup && 1 === bup.nodeType && (adown.contains ? adown.contains(bup) : a.compareDocumentPosition && 16 & a.compareDocumentPosition(bup)));
            } : function(a, b) {
                if (b) {
                    for(; b = b.parentNode;)if (b === a) return !0;
                }
                return !1;
            }, sortOrder = docElem.compareDocumentPosition ? function(a, b) {
                var compare;
                return a === b ? (hasDuplicate = !0, 0) : (compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition(b)) ? 1 & compare || a.parentNode && 11 === a.parentNode.nodeType ? a === doc || contains(preferredDoc, a) ? -1 : b === doc || contains(preferredDoc, b) ? 1 : 0 : 4 & compare ? -1 : 1 : a.compareDocumentPosition ? -1 : 1;
            } : function(a, b) {
                var cur, i = 0, aup = a.parentNode, bup = b.parentNode, ap = [
                    a
                ], bp = [
                    b
                ];
                if (a === b) return hasDuplicate = !0, 0;
                if (!aup || !bup) return a === doc ? -1 : b === doc ? 1 : aup ? -1 : bup ? 1 : 0;
                if (aup === bup) return siblingCheck(a, b);
                for(cur = a; cur = cur.parentNode;)ap.unshift(cur);
                for(cur = b; cur = cur.parentNode;)bp.unshift(cur);
                for(; ap[i] === bp[i];)i++;
                return i ? siblingCheck(ap[i], bp[i]) : ap[i] === preferredDoc ? -1 : bp[i] === preferredDoc ? 1 : 0;
            }, hasDuplicate = !1, [
                0,
                0
            ].sort(sortOrder), support.detectDuplicates = hasDuplicate), document;
        }, Sizzle.matches = function(expr, elements) {
            return Sizzle(expr, null, null, elements);
        }, Sizzle.matchesSelector = function(elem, expr) {
            if ((elem.ownerDocument || elem) !== document && setDocument(elem), expr = expr.replace(rattributeQuotes, "='$1']"), support.matchesSelector && !documentIsXML && (!rbuggyMatches || !rbuggyMatches.test(expr)) && !rbuggyQSA.test(expr)) try {
                var ret = matches1.call(elem, expr);
                if (ret || support.disconnectedMatch || elem.document && 11 !== elem.document.nodeType) return ret;
            } catch (e) {}
            return Sizzle(expr, document, null, [
                elem
            ]).length > 0;
        }, Sizzle.contains = function(context, elem) {
            return (context.ownerDocument || context) !== document && setDocument(context), contains(context, elem);
        }, Sizzle.attr = function(elem, name) {
            var val;
            return ((elem.ownerDocument || elem) !== document && setDocument(elem), documentIsXML || (name = name.toLowerCase()), val = Expr.attrHandle[name]) ? val(elem) : documentIsXML || support.attributes ? elem.getAttribute(name) : ((val = elem.getAttributeNode(name)) || elem.getAttribute(name)) && !0 === elem[name] ? name : val && val.specified ? val.value : null;
        }, Sizzle.error = function(msg) {
            throw new Error("Syntax error, unrecognized expression: " + msg);
        }, Sizzle.uniqueSort = function(results) {
            var elem, duplicates = [], i = 1, j = 0;
            if (hasDuplicate = !support.detectDuplicates, results.sort(sortOrder), hasDuplicate) {
                for(; elem = results[i]; i++)elem === results[i - 1] && (j = duplicates.push(i));
                for(; j--;)results.splice(duplicates[j], 1);
            }
            return results;
        }, getText = Sizzle.getText = function(elem) {
            var node, ret = "", i = 0, nodeType = elem.nodeType;
            if (nodeType) {
                if (1 === nodeType || 9 === nodeType || 11 === nodeType) {
                    if ("string" == typeof elem.textContent) return elem.textContent;
                    for(elem = elem.firstChild; elem; elem = elem.nextSibling)ret += getText(elem);
                } else if (3 === nodeType || 4 === nodeType) return elem.nodeValue;
            } else for(; node = elem[i]; i++)ret += getText(node);
            return ret;
        }, Expr = Sizzle.selectors = {
            cacheLength: 50,
            createPseudo: markFunction,
            match: matchExpr,
            find: {},
            relative: {
                ">": {
                    dir: "parentNode",
                    first: !0
                },
                " ": {
                    dir: "parentNode"
                },
                "+": {
                    dir: "previousSibling",
                    first: !0
                },
                "~": {
                    dir: "previousSibling"
                }
            },
            preFilter: {
                ATTR: function(match) {
                    return match[1] = match[1].replace(runescape, funescape), match[3] = (match[4] || match[5] || "").replace(runescape, funescape), "~=" === match[2] && (match[3] = " " + match[3] + " "), match.slice(0, 4);
                },
                CHILD: function(match) {
                    return match[1] = match[1].toLowerCase(), "nth" === match[1].slice(0, 3) ? (match[3] || Sizzle.error(match[0]), match[4] = +(match[4] ? match[5] + (match[6] || 1) : 2 * ("even" === match[3] || "odd" === match[3])), match[5] = +(match[7] + match[8] || "odd" === match[3])) : match[3] && Sizzle.error(match[0]), match;
                },
                PSEUDO: function(match) {
                    var excess, unquoted = !match[5] && match[2];
                    return matchExpr.CHILD.test(match[0]) ? null : (match[4] ? match[2] = match[4] : unquoted && rpseudo.test(unquoted) && (excess = tokenize(unquoted, !0)) && (excess = unquoted.indexOf(")", unquoted.length - excess) - unquoted.length) && (match[0] = match[0].slice(0, excess), match[2] = unquoted.slice(0, excess)), match.slice(0, 3));
                }
            },
            filter: {
                TAG: function(nodeName) {
                    return "*" === nodeName ? function() {
                        return !0;
                    } : (nodeName = nodeName.replace(runescape, funescape).toLowerCase(), function(elem) {
                        return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
                    });
                },
                CLASS: function(className) {
                    var pattern = classCache[className + " "];
                    return pattern || (pattern = new RegExp("(^|" + whitespace + ")" + className + "(" + whitespace + "|$)"), classCache(className, function(elem) {
                        return pattern.test(elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "");
                    }));
                },
                ATTR: function(name, operator, check) {
                    return function(elem) {
                        var result = Sizzle.attr(elem, name);
                        return null == result ? "!=" === operator : !operator || (result += "", "=" === operator ? result === check : "!=" === operator ? result !== check : "^=" === operator ? check && 0 === result.indexOf(check) : "*=" === operator ? check && result.indexOf(check) > -1 : "$=" === operator ? check && result.slice(-check.length) === check : "~=" === operator ? (" " + result + " ").indexOf(check) > -1 : "|=" === operator && (result === check || result.slice(0, check.length + 1) === check + "-"));
                    };
                },
                CHILD: function(type, what, argument, first, last) {
                    var simple = "nth" !== type.slice(0, 3), forward = "last" !== type.slice(-4), ofType = "of-type" === what;
                    return 1 === first && 0 === last ? function(elem) {
                        return !!elem.parentNode;
                    } : function(elem, context, xml) {
                        var cache, outerCache, node, diff, nodeIndex, start, dir = simple !== forward ? "nextSibling" : "previousSibling", parent = elem.parentNode, name = ofType && elem.nodeName.toLowerCase(), useCache = !xml && !ofType;
                        if (parent) {
                            if (simple) {
                                for(; dir;){
                                    for(node = elem; node = node[dir];)if (ofType ? node.nodeName.toLowerCase() === name : 1 === node.nodeType) return !1;
                                    start = dir = "only" === type && !start && "nextSibling";
                                }
                                return !0;
                            }
                            if (start = [
                                forward ? parent.firstChild : parent.lastChild
                            ], forward && useCache) {
                                for(nodeIndex = (cache = (outerCache = parent[expando] || (parent[expando] = {}))[type] || [])[0] === dirruns && cache[1], diff = cache[0] === dirruns && cache[2], node = nodeIndex && parent.childNodes[nodeIndex]; node = ++nodeIndex && node && node[dir] || (diff = nodeIndex = 0) || start.pop();)if (1 === node.nodeType && ++diff && node === elem) {
                                    outerCache[type] = [
                                        dirruns,
                                        nodeIndex,
                                        diff
                                    ];
                                    break;
                                }
                            } else if (useCache && (cache = (elem[expando] || (elem[expando] = {}))[type]) && cache[0] === dirruns) diff = cache[1];
                            else for(; (node = ++nodeIndex && node && node[dir] || (diff = nodeIndex = 0) || start.pop()) && (!((ofType ? node.nodeName.toLowerCase() === name : 1 === node.nodeType) && ++diff) || (useCache && ((node[expando] || (node[expando] = {}))[type] = [
                                dirruns,
                                diff
                            ]), node !== elem)););
                            return (diff -= last) === first || diff % first == 0 && diff / first >= 0;
                        }
                    };
                },
                PSEUDO: function(pseudo, argument) {
                    var args, fn = Expr.pseudos[pseudo] || Expr.setFilters[pseudo.toLowerCase()] || Sizzle.error("unsupported pseudo: " + pseudo);
                    return fn[expando] ? fn(argument) : fn.length > 1 ? (args = [
                        pseudo,
                        pseudo,
                        "",
                        argument
                    ], Expr.setFilters.hasOwnProperty(pseudo.toLowerCase()) ? markFunction(function(seed, matches) {
                        for(var idx, matched = fn(seed, argument), i = matched.length; i--;)idx = indexOf.call(seed, matched[i]), seed[idx] = !(matches[idx] = matched[i]);
                    }) : function(elem) {
                        return fn(elem, 0, args);
                    }) : fn;
                }
            },
            pseudos: {
                not: markFunction(function(selector) {
                    var input = [], results = [], matcher = compile(selector.replace(rtrim, "$1"));
                    return matcher[expando] ? markFunction(function(seed, matches, context, xml) {
                        for(var elem, unmatched = matcher(seed, null, xml, []), i = seed.length; i--;)(elem = unmatched[i]) && (seed[i] = !(matches[i] = elem));
                    }) : function(elem, context, xml) {
                        return input[0] = elem, matcher(input, null, xml, results), !results.pop();
                    };
                }),
                has: markFunction(function(selector) {
                    return function(elem) {
                        return Sizzle(selector, elem).length > 0;
                    };
                }),
                contains: markFunction(function(text) {
                    return function(elem) {
                        return (elem.textContent || elem.innerText || getText(elem)).indexOf(text) > -1;
                    };
                }),
                lang: markFunction(function(lang) {
                    return ridentifier.test(lang || "") || Sizzle.error("unsupported lang: " + lang), lang = lang.replace(runescape, funescape).toLowerCase(), function(elem) {
                        var elemLang;
                        do if (elemLang = documentIsXML ? elem.getAttribute("xml:lang") || elem.getAttribute("lang") : elem.lang) return (elemLang = elemLang.toLowerCase()) === lang || 0 === elemLang.indexOf(lang + "-");
                        while ((elem = elem.parentNode) && 1 === elem.nodeType)
                        return !1;
                    };
                }),
                target: function(elem) {
                    var hash = window.location && window.location.hash;
                    return hash && hash.slice(1) === elem.id;
                },
                root: function(elem) {
                    return elem === docElem;
                },
                focus: function(elem) {
                    return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
                },
                enabled: function(elem) {
                    return !1 === elem.disabled;
                },
                disabled: function(elem) {
                    return !0 === elem.disabled;
                },
                checked: function(elem) {
                    var nodeName = elem.nodeName.toLowerCase();
                    return "input" === nodeName && !!elem.checked || "option" === nodeName && !!elem.selected;
                },
                selected: function(elem) {
                    return elem.parentNode && elem.parentNode.selectedIndex, !0 === elem.selected;
                },
                empty: function(elem) {
                    for(elem = elem.firstChild; elem; elem = elem.nextSibling)if (elem.nodeName > "@" || 3 === elem.nodeType || 4 === elem.nodeType) return !1;
                    return !0;
                },
                parent: function(elem) {
                    return !Expr.pseudos.empty(elem);
                },
                header: function(elem) {
                    return rheader.test(elem.nodeName);
                },
                input: function(elem) {
                    return rinputs.test(elem.nodeName);
                },
                button: function(elem) {
                    var name = elem.nodeName.toLowerCase();
                    return "input" === name && "button" === elem.type || "button" === name;
                },
                text: function(elem) {
                    var attr;
                    return "input" === elem.nodeName.toLowerCase() && "text" === elem.type && (null == (attr = elem.getAttribute("type")) || attr.toLowerCase() === elem.type);
                },
                first: createPositionalPseudo(function() {
                    return [
                        0
                    ];
                }),
                last: createPositionalPseudo(function(matchIndexes, length) {
                    return [
                        length - 1
                    ];
                }),
                eq: createPositionalPseudo(function(matchIndexes, length, argument) {
                    return [
                        argument < 0 ? argument + length : argument
                    ];
                }),
                even: createPositionalPseudo(function(matchIndexes, length) {
                    for(var i = 0; i < length; i += 2)matchIndexes.push(i);
                    return matchIndexes;
                }),
                odd: createPositionalPseudo(function(matchIndexes, length) {
                    for(var i = 1; i < length; i += 2)matchIndexes.push(i);
                    return matchIndexes;
                }),
                lt: createPositionalPseudo(function(matchIndexes, length, argument) {
                    for(var i = argument < 0 ? argument + length : argument; --i >= 0;)matchIndexes.push(i);
                    return matchIndexes;
                }),
                gt: createPositionalPseudo(function(matchIndexes, length, argument) {
                    for(var i = argument < 0 ? argument + length : argument; ++i < length;)matchIndexes.push(i);
                    return matchIndexes;
                })
            }
        }, {
            radio: !0,
            checkbox: !0,
            file: !0,
            password: !0,
            image: !0
        })Expr.pseudos[i2] = createInputPseudo(i2);
        for(i2 in {
            submit: !0,
            reset: !0
        })Expr.pseudos[i2] = createButtonPseudo(i2);
        function tokenize(selector, parseOnly) {
            var matched, match, tokens, type, soFar, groups, preFilters, cached = tokenCache[selector + " "];
            if (cached) return parseOnly ? 0 : cached.slice(0);
            for(soFar = selector, groups = [], preFilters = Expr.preFilter; soFar;){
                for(type in (!matched || (match = rcomma.exec(soFar))) && (match && (soFar = soFar.slice(match[0].length) || soFar), groups.push(tokens = [])), matched = !1, (match = rcombinators.exec(soFar)) && (matched = match.shift(), tokens.push({
                    value: matched,
                    type: match[0].replace(rtrim, " ")
                }), soFar = soFar.slice(matched.length)), Expr.filter)(match = matchExpr[type].exec(soFar)) && (!preFilters[type] || (match = preFilters[type](match))) && (matched = match.shift(), tokens.push({
                    value: matched,
                    type: type,
                    matches: match
                }), soFar = soFar.slice(matched.length));
                if (!matched) break;
            }
            return parseOnly ? soFar.length : soFar ? Sizzle.error(selector) : tokenCache(selector, groups).slice(0);
        }
        function toSelector(tokens) {
            for(var i = 0, len = tokens.length, selector = ""; i < len; i++)selector += tokens[i].value;
            return selector;
        }
        function addCombinator(matcher, combinator, base) {
            var dir = combinator.dir, checkNonElements = base && "parentNode" === dir, doneName = done++;
            return combinator.first ? function(elem, context, xml) {
                for(; elem = elem[dir];)if (1 === elem.nodeType || checkNonElements) return matcher(elem, context, xml);
            } : function(elem, context, xml) {
                var data, cache, outerCache, dirkey = dirruns + " " + doneName;
                if (xml) {
                    for(; elem = elem[dir];)if ((1 === elem.nodeType || checkNonElements) && matcher(elem, context, xml)) return !0;
                } else for(; elem = elem[dir];)if (1 === elem.nodeType || checkNonElements) {
                    if ((cache = (outerCache = elem[expando] || (elem[expando] = {}))[dir]) && cache[0] === dirkey) {
                        if (!0 === (data = cache[1]) || data === cachedruns) return !0 === data;
                    } else if ((cache = outerCache[dir] = [
                        dirkey
                    ])[1] = matcher(elem, context, xml) || cachedruns, !0 === cache[1]) return !0;
                }
            };
        }
        function elementMatcher(matchers) {
            return matchers.length > 1 ? function(elem, context, xml) {
                for(var i = matchers.length; i--;)if (!matchers[i](elem, context, xml)) return !1;
                return !0;
            } : matchers[0];
        }
        function condense(unmatched, map, filter, context, xml) {
            for(var elem, newUnmatched = [], i = 0, len = unmatched.length, mapped = null != map; i < len; i++)(elem = unmatched[i]) && (!filter || filter(elem, context, xml)) && (newUnmatched.push(elem), mapped && map.push(i));
            return newUnmatched;
        }
        function setMatcher(preFilter, selector, matcher, postFilter, postFinder, postSelector) {
            return postFilter && !postFilter[expando] && (postFilter = setMatcher(postFilter)), postFinder && !postFinder[expando] && (postFinder = setMatcher(postFinder, postSelector)), markFunction(function(seed, results, context, xml) {
                var temp, i, elem, preMap = [], postMap = [], preexisting = results.length, elems = seed || multipleContexts(selector || "*", context.nodeType ? [
                    context
                ] : context, []), matcherIn = preFilter && (seed || !selector) ? condense(elems, preMap, preFilter, context, xml) : elems, matcherOut = matcher ? postFinder || (seed ? preFilter : preexisting || postFilter) ? [] : results : matcherIn;
                if (matcher && matcher(matcherIn, matcherOut, context, xml), postFilter) for(postFilter(temp = condense(matcherOut, postMap), [], context, xml), i = temp.length; i--;)(elem = temp[i]) && (matcherOut[postMap[i]] = !(matcherIn[postMap[i]] = elem));
                if (seed) {
                    if (postFinder || preFilter) {
                        if (postFinder) {
                            for(temp = [], i = matcherOut.length; i--;)(elem = matcherOut[i]) && temp.push(matcherIn[i] = elem);
                            postFinder(null, matcherOut = [], temp, xml);
                        }
                        for(i = matcherOut.length; i--;)(elem = matcherOut[i]) && (temp = postFinder ? indexOf.call(seed, elem) : preMap[i]) > -1 && (seed[temp] = !(results[temp] = elem));
                    }
                } else matcherOut = condense(matcherOut === results ? matcherOut.splice(preexisting, matcherOut.length) : matcherOut), postFinder ? postFinder(null, results, matcherOut, xml) : push.apply(results, matcherOut);
            });
        }
        function matcherFromTokens(tokens) {
            for(var checkContext, matcher, j, len = tokens.length, leadingRelative = Expr.relative[tokens[0].type], implicitRelative = leadingRelative || Expr.relative[" "], i = leadingRelative ? 1 : 0, matchContext = addCombinator(function(elem) {
                return elem === checkContext;
            }, implicitRelative, !0), matchAnyContext = addCombinator(function(elem) {
                return indexOf.call(checkContext, elem) > -1;
            }, implicitRelative, !0), matchers = [
                function(elem, context, xml) {
                    return !leadingRelative && (xml || context !== outermostContext) || ((checkContext = context).nodeType ? matchContext(elem, context, xml) : matchAnyContext(elem, context, xml));
                }
            ]; i < len; i++)if (matcher = Expr.relative[tokens[i].type]) matchers = [
                addCombinator(elementMatcher(matchers), matcher)
            ];
            else {
                if ((matcher = Expr.filter[tokens[i].type].apply(null, tokens[i].matches))[expando]) {
                    for(j = ++i; j < len && !Expr.relative[tokens[j].type]; j++);
                    return setMatcher(i > 1 && elementMatcher(matchers), i > 1 && toSelector(tokens.slice(0, i - 1)).replace(rtrim, "$1"), matcher, i < j && matcherFromTokens(tokens.slice(i, j)), j < len && matcherFromTokens(tokens = tokens.slice(j)), j < len && toSelector(tokens));
                }
                matchers.push(matcher);
            }
            return elementMatcher(matchers);
        }
        function multipleContexts(selector, contexts, results) {
            for(var i = 0, len = contexts.length; i < len; i++)Sizzle(selector, contexts[i], results);
            return results;
        }
        function select(selector, context, results, seed) {
            var i, tokens, token, type, find, match = tokenize(selector);
            if (!seed && 1 === match.length) {
                if ((tokens = match[0] = match[0].slice(0)).length > 2 && "ID" === (token = tokens[0]).type && 9 === context.nodeType && !documentIsXML && Expr.relative[tokens[1].type]) {
                    if (!(context = Expr.find.ID(token.matches[0].replace(runescape, funescape), context)[0])) return results;
                    selector = selector.slice(tokens.shift().value.length);
                }
                for(i = matchExpr.needsContext.test(selector) ? 0 : tokens.length; (i--) && (token = tokens[i], !Expr.relative[type = token.type]);)if ((find = Expr.find[type]) && (seed = find(token.matches[0].replace(runescape, funescape), rsibling.test(tokens[0].type) && context.parentNode || context))) {
                    if (tokens.splice(i, 1), !(selector = seed.length && toSelector(tokens))) return push.apply(results, slice.call(seed, 0)), results;
                    break;
                }
            }
            return compile(selector, match)(seed, context, documentIsXML, results, rsibling.test(selector)), results;
        }
        function setFilters() {}
        compile = Sizzle.compile = function(selector, group) {
            var elementMatchers, setMatchers, matcherCachedRuns, bySet, byElement, superMatcher, i3, setMatchers1 = [], elementMatchers1 = [], cached = compilerCache[selector + " "];
            if (!cached) {
                for(group || (group = tokenize(selector)), i3 = group.length; i3--;)(cached = matcherFromTokens(group[i3]))[expando] ? setMatchers1.push(cached) : elementMatchers1.push(cached);
                cached = compilerCache(selector, (elementMatchers = elementMatchers1, matcherCachedRuns = 0, bySet = (setMatchers = setMatchers1).length > 0, byElement = elementMatchers.length > 0, superMatcher = function(seed, context, xml, results, expandContext) {
                    var elem, j, matcher, setMatched = [], matchedCount = 0, i = "0", unmatched = seed && [], outermost = null != expandContext, contextBackup = outermostContext, elems = seed || byElement && Expr.find.TAG("*", expandContext && context.parentNode || context), dirrunsUnique = dirruns += null == contextBackup ? 1 : Math.random() || 0.1;
                    for(outermost && (outermostContext = context !== document && context, cachedruns = matcherCachedRuns); null != (elem = elems[i]); i++){
                        if (byElement && elem) {
                            for(j = 0; matcher = elementMatchers[j++];)if (matcher(elem, context, xml)) {
                                results.push(elem);
                                break;
                            }
                            outermost && (dirruns = dirrunsUnique, cachedruns = ++matcherCachedRuns);
                        }
                        bySet && ((elem = !matcher && elem) && matchedCount--, seed && unmatched.push(elem));
                    }
                    if (matchedCount += i, bySet && i !== matchedCount) {
                        for(j = 0; matcher = setMatchers[j++];)matcher(unmatched, setMatched, context, xml);
                        if (seed) {
                            if (matchedCount > 0) for(; i--;)unmatched[i] || setMatched[i] || (setMatched[i] = pop.call(results));
                            setMatched = condense(setMatched);
                        }
                        push.apply(results, setMatched), outermost && !seed && setMatched.length > 0 && matchedCount + setMatchers.length > 1 && Sizzle.uniqueSort(results);
                    }
                    return outermost && (dirruns = dirrunsUnique, outermostContext = contextBackup), unmatched;
                }, bySet ? markFunction(superMatcher) : superMatcher));
            }
            return cached;
        }, Expr.pseudos.nth = Expr.pseudos.eq, Expr.filters = setFilters.prototype = Expr.pseudos, Expr.setFilters = new setFilters(), setDocument(), Sizzle.attr = jQuery.attr, jQuery.find = Sizzle, jQuery.expr = Sizzle.selectors, jQuery.expr[":"] = jQuery.expr.pseudos, jQuery.unique = Sizzle.uniqueSort, jQuery.text = Sizzle.getText, jQuery.isXMLDoc = Sizzle.isXML, jQuery.contains = Sizzle.contains;
    }(window1);
    var runtil = /Until$/, rparentsprev = /^(?:parents|prev(?:Until|All))/, isSimple = /^.[^:#\[\.,]*$/, rneedsContext = jQuery.expr.match.needsContext, guaranteedUnique = {
        children: !0,
        contents: !0,
        next: !0,
        prev: !0
    };
    function sibling(cur, dir) {
        do cur = cur[dir];
        while (cur && 1 !== cur.nodeType)
        return cur;
    }
    function winnow(elements, qualifier, keep) {
        if (qualifier = qualifier || 0, jQuery.isFunction(qualifier)) return jQuery.grep(elements, function(elem, i) {
            return !!qualifier.call(elem, i, elem) === keep;
        });
        if (qualifier.nodeType) return jQuery.grep(elements, function(elem) {
            return elem === qualifier === keep;
        });
        if ("string" == typeof qualifier) {
            var filtered = jQuery.grep(elements, function(elem) {
                return 1 === elem.nodeType;
            });
            if (isSimple.test(qualifier)) return jQuery.filter(qualifier, filtered, !keep);
            qualifier = jQuery.filter(qualifier, filtered);
        }
        return jQuery.grep(elements, function(elem) {
            return jQuery.inArray(elem, qualifier) >= 0 === keep;
        });
    }
    function createSafeFragment(document) {
        var list = nodeNames.split("|"), safeFrag = document.createDocumentFragment();
        if (safeFrag.createElement) for(; list.length;)safeFrag.createElement(list.pop());
        return safeFrag;
    }
    jQuery.fn.extend({
        find: function(selector) {
            var i, ret, self, len = this.length;
            if ("string" != typeof selector) return self = this, this.pushStack(jQuery(selector).filter(function() {
                for(i = 0; i < len; i++)if (jQuery.contains(self[i], this)) return !0;
            }));
            for(i = 0, ret = []; i < len; i++)jQuery.find(selector, this[i], ret);
            return (ret = this.pushStack(len > 1 ? jQuery.unique(ret) : ret)).selector = (this.selector ? this.selector + " " : "") + selector, ret;
        },
        has: function(target) {
            var i, targets = jQuery(target, this), len = targets.length;
            return this.filter(function() {
                for(i = 0; i < len; i++)if (jQuery.contains(this, targets[i])) return !0;
            });
        },
        not: function(selector) {
            return this.pushStack(winnow(this, selector, !1));
        },
        filter: function(selector) {
            return this.pushStack(winnow(this, selector, !0));
        },
        is: function(selector) {
            return !!selector && ("string" == typeof selector ? rneedsContext.test(selector) ? jQuery(selector, this.context).index(this[0]) >= 0 : jQuery.filter(selector, this).length > 0 : this.filter(selector).length > 0);
        },
        closest: function(selectors, context) {
            for(var cur, i = 0, l = this.length, ret = [], pos = rneedsContext.test(selectors) || "string" != typeof selectors ? jQuery(selectors, context || this.context) : 0; i < l; i++)for(cur = this[i]; cur && cur.ownerDocument && cur !== context && 11 !== cur.nodeType;){
                if (pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors)) {
                    ret.push(cur);
                    break;
                }
                cur = cur.parentNode;
            }
            return this.pushStack(ret.length > 1 ? jQuery.unique(ret) : ret);
        },
        index: function(elem) {
            return elem ? "string" == typeof elem ? jQuery.inArray(this[0], jQuery(elem)) : jQuery.inArray(elem.jquery ? elem[0] : elem, this) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1;
        },
        add: function(selector, context) {
            var set = "string" == typeof selector ? jQuery(selector, context) : jQuery.makeArray(selector && selector.nodeType ? [
                selector
            ] : selector), all = jQuery.merge(this.get(), set);
            return this.pushStack(jQuery.unique(all));
        },
        addBack: function(selector) {
            return this.add(null == selector ? this.prevObject : this.prevObject.filter(selector));
        }
    }), jQuery.fn.andSelf = jQuery.fn.addBack, jQuery.each({
        parent: function(elem) {
            var parent = elem.parentNode;
            return parent && 11 !== parent.nodeType ? parent : null;
        },
        parents: function(elem) {
            return jQuery.dir(elem, "parentNode");
        },
        parentsUntil: function(elem, i, until) {
            return jQuery.dir(elem, "parentNode", until);
        },
        next: function(elem) {
            return sibling(elem, "nextSibling");
        },
        prev: function(elem) {
            return sibling(elem, "previousSibling");
        },
        nextAll: function(elem) {
            return jQuery.dir(elem, "nextSibling");
        },
        prevAll: function(elem) {
            return jQuery.dir(elem, "previousSibling");
        },
        nextUntil: function(elem, i, until) {
            return jQuery.dir(elem, "nextSibling", until);
        },
        prevUntil: function(elem, i, until) {
            return jQuery.dir(elem, "previousSibling", until);
        },
        siblings: function(elem) {
            return jQuery.sibling((elem.parentNode || {}).firstChild, elem);
        },
        children: function(elem) {
            return jQuery.sibling(elem.firstChild);
        },
        contents: function(elem) {
            return jQuery.nodeName(elem, "iframe") ? elem.contentDocument || elem.contentWindow.document : jQuery.merge([], elem.childNodes);
        }
    }, function(name, fn) {
        jQuery.fn[name] = function(until, selector) {
            var ret = jQuery.map(this, fn, until);
            return runtil.test(name) || (selector = until), selector && "string" == typeof selector && (ret = jQuery.filter(selector, ret)), ret = this.length > 1 && !guaranteedUnique[name] ? jQuery.unique(ret) : ret, this.length > 1 && rparentsprev.test(name) && (ret = ret.reverse()), this.pushStack(ret);
        };
    }), jQuery.extend({
        filter: function(expr, elems, not) {
            return not && (expr = ":not(" + expr + ")"), 1 === elems.length ? jQuery.find.matchesSelector(elems[0], expr) ? [
                elems[0]
            ] : [] : jQuery.find.matches(expr, elems);
        },
        dir: function(elem, dir, until) {
            for(var matched = [], cur = elem[dir]; cur && 9 !== cur.nodeType && (until === undefined || 1 !== cur.nodeType || !jQuery(cur).is(until));)1 === cur.nodeType && matched.push(cur), cur = cur[dir];
            return matched;
        },
        sibling: function(n, elem) {
            for(var r = []; n; n = n.nextSibling)1 === n.nodeType && n !== elem && r.push(n);
            return r;
        }
    });
    var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video", rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g, rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"), rleadingWhitespace = /^\s+/, rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, rtagName = /<([\w:]+)/, rtbody = /<tbody/i, rhtml = /<|&#?\w+;/, rnoInnerhtml = /<(?:script|style|link)/i, manipulation_rcheckableType = /^(?:checkbox|radio)$/i, rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i, rscriptType = /^$|\/(?:java|ecma)script/i, rscriptTypeMasked = /^true\/(.*)/, rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g, wrapMap = {
        option: [
            1,
            "<select multiple='multiple'>",
            "</select>"
        ],
        legend: [
            1,
            "<fieldset>",
            "</fieldset>"
        ],
        area: [
            1,
            "<map>",
            "</map>"
        ],
        param: [
            1,
            "<object>",
            "</object>"
        ],
        thead: [
            1,
            "<table>",
            "</table>"
        ],
        tr: [
            2,
            "<table><tbody>",
            "</tbody></table>"
        ],
        col: [
            2,
            "<table><tbody></tbody><colgroup>",
            "</colgroup></table>"
        ],
        td: [
            3,
            "<table><tbody><tr>",
            "</tr></tbody></table>"
        ],
        _default: jQuery.support.htmlSerialize ? [
            0,
            "",
            ""
        ] : [
            1,
            "X<div>",
            "</div>"
        ]
    }, fragmentDiv = createSafeFragment(document1).appendChild(document1.createElement("div"));
    function findOrAppend(elem, tag) {
        return elem.getElementsByTagName(tag)[0] || elem.appendChild(elem.ownerDocument.createElement(tag));
    }
    function disableScript(elem) {
        var attr = elem.getAttributeNode("type");
        return elem.type = (attr && attr.specified) + "/" + elem.type, elem;
    }
    function restoreScript(elem) {
        var match = rscriptTypeMasked.exec(elem.type);
        return match ? elem.type = match[1] : elem.removeAttribute("type"), elem;
    }
    function setGlobalEval(elems, refElements) {
        for(var elem, i = 0; null != (elem = elems[i]); i++)jQuery._data(elem, "globalEval", !refElements || jQuery._data(refElements[i], "globalEval"));
    }
    function cloneCopyEvent(src, dest) {
        if (1 === dest.nodeType && jQuery.hasData(src)) {
            var type, i, l, oldData = jQuery._data(src), curData = jQuery._data(dest, oldData), events = oldData.events;
            if (events) for(type in delete curData.handle, curData.events = {}, events)for(i = 0, l = events[type].length; i < l; i++)jQuery.event.add(dest, type, events[type][i]);
            curData.data && (curData.data = jQuery.extend({}, curData.data));
        }
    }
    function fixCloneNodeIssues(src, dest) {
        var nodeName, e, data;
        if (1 === dest.nodeType) {
            if (nodeName = dest.nodeName.toLowerCase(), !jQuery.support.noCloneEvent && dest[jQuery.expando]) {
                for(e in (data = jQuery._data(dest)).events)jQuery.removeEvent(dest, e, data.handle);
                dest.removeAttribute(jQuery.expando);
            }
            "script" === nodeName && dest.text !== src.text ? (disableScript(dest).text = src.text, restoreScript(dest)) : "object" === nodeName ? (dest.parentNode && (dest.outerHTML = src.outerHTML), jQuery.support.html5Clone && src.innerHTML && !jQuery.trim(dest.innerHTML) && (dest.innerHTML = src.innerHTML)) : "input" === nodeName && manipulation_rcheckableType.test(src.type) ? (dest.defaultChecked = dest.checked = src.checked, dest.value !== src.value && (dest.value = src.value)) : "option" === nodeName ? dest.defaultSelected = dest.selected = src.defaultSelected : ("input" === nodeName || "textarea" === nodeName) && (dest.defaultValue = src.defaultValue);
        }
    }
    function getAll(context, tag) {
        var elems, elem, i = 0, found = typeof context.getElementsByTagName !== core_strundefined ? context.getElementsByTagName(tag || "*") : typeof context.querySelectorAll !== core_strundefined ? context.querySelectorAll(tag || "*") : undefined;
        if (!found) for(found = [], elems = context.childNodes || context; null != (elem = elems[i]); i++)!tag || jQuery.nodeName(elem, tag) ? found.push(elem) : jQuery.merge(found, getAll(elem, tag));
        return tag === undefined || tag && jQuery.nodeName(context, tag) ? jQuery.merge([
            context
        ], found) : found;
    }
    function fixDefaultChecked(elem) {
        manipulation_rcheckableType.test(elem.type) && (elem.defaultChecked = elem.checked);
    }
    wrapMap.optgroup = wrapMap.option, wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead, wrapMap.th = wrapMap.td, jQuery.fn.extend({
        text: function(value4) {
            return jQuery.access(this, function(value) {
                return value === undefined ? jQuery.text(this) : this.empty().append((this[0] && this[0].ownerDocument || document1).createTextNode(value));
            }, null, value4, arguments.length);
        },
        wrapAll: function(html) {
            if (jQuery.isFunction(html)) return this.each(function(i) {
                jQuery(this).wrapAll(html.call(this, i));
            });
            if (this[0]) {
                var wrap = jQuery(html, this[0].ownerDocument).eq(0).clone(!0);
                this[0].parentNode && wrap.insertBefore(this[0]), wrap.map(function() {
                    for(var elem = this; elem.firstChild && 1 === elem.firstChild.nodeType;)elem = elem.firstChild;
                    return elem;
                }).append(this);
            }
            return this;
        },
        wrapInner: function(html) {
            return jQuery.isFunction(html) ? this.each(function(i) {
                jQuery(this).wrapInner(html.call(this, i));
            }) : this.each(function() {
                var self = jQuery(this), contents = self.contents();
                contents.length ? contents.wrapAll(html) : self.append(html);
            });
        },
        wrap: function(html) {
            var isFunction = jQuery.isFunction(html);
            return this.each(function(i) {
                jQuery(this).wrapAll(isFunction ? html.call(this, i) : html);
            });
        },
        unwrap: function() {
            return this.parent().each(function() {
                jQuery.nodeName(this, "body") || jQuery(this).replaceWith(this.childNodes);
            }).end();
        },
        append: function() {
            return this.domManip(arguments, !0, function(elem) {
                (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) && this.appendChild(elem);
            });
        },
        prepend: function() {
            return this.domManip(arguments, !0, function(elem) {
                (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) && this.insertBefore(elem, this.firstChild);
            });
        },
        before: function() {
            return this.domManip(arguments, !1, function(elem) {
                this.parentNode && this.parentNode.insertBefore(elem, this);
            });
        },
        after: function() {
            return this.domManip(arguments, !1, function(elem) {
                this.parentNode && this.parentNode.insertBefore(elem, this.nextSibling);
            });
        },
        remove: function(selector, keepData) {
            for(var elem, i = 0; null != (elem = this[i]); i++)(!selector || jQuery.filter(selector, [
                elem
            ]).length > 0) && (keepData || 1 !== elem.nodeType || jQuery.cleanData(getAll(elem)), elem.parentNode && (keepData && jQuery.contains(elem.ownerDocument, elem) && setGlobalEval(getAll(elem, "script")), elem.parentNode.removeChild(elem)));
            return this;
        },
        empty: function() {
            for(var elem, i = 0; null != (elem = this[i]); i++){
                for(1 === elem.nodeType && jQuery.cleanData(getAll(elem, !1)); elem.firstChild;)elem.removeChild(elem.firstChild);
                elem.options && jQuery.nodeName(elem, "select") && (elem.options.length = 0);
            }
            return this;
        },
        clone: function(dataAndEvents, deepDataAndEvents) {
            return dataAndEvents = null != dataAndEvents && dataAndEvents, deepDataAndEvents = null == deepDataAndEvents ? dataAndEvents : deepDataAndEvents, this.map(function() {
                return jQuery.clone(this, dataAndEvents, deepDataAndEvents);
            });
        },
        html: function(value5) {
            return jQuery.access(this, function(value) {
                var elem = this[0] || {}, i = 0, l = this.length;
                if (value === undefined) return 1 === elem.nodeType ? elem.innerHTML.replace(rinlinejQuery, "") : undefined;
                if ("string" == typeof value && !rnoInnerhtml.test(value) && (jQuery.support.htmlSerialize || !rnoshimcache.test(value)) && (jQuery.support.leadingWhitespace || !rleadingWhitespace.test(value)) && !wrapMap[(rtagName.exec(value) || [
                    "",
                    ""
                ])[1].toLowerCase()]) {
                    value = value.replace(rxhtmlTag, "<$1></$2>");
                    try {
                        for(; i < l; i++)elem = this[i] || {}, 1 === elem.nodeType && (jQuery.cleanData(getAll(elem, !1)), elem.innerHTML = value);
                        elem = 0;
                    } catch (e) {}
                }
                elem && this.empty().append(value);
            }, null, value5, arguments.length);
        },
        replaceWith: function(value) {
            return jQuery.isFunction(value) || "string" == typeof value || (value = jQuery(value).not(this).detach()), this.domManip([
                value
            ], !0, function(elem) {
                var next = this.nextSibling, parent = this.parentNode;
                parent && (jQuery(this).remove(), parent.insertBefore(elem, next));
            });
        },
        detach: function(selector) {
            return this.remove(selector, !0);
        },
        domManip: function(args, table, callback) {
            args = core_concat.apply([], args);
            var first, node, hasScripts, scripts, doc, fragment, i = 0, l = this.length, set = this, iNoClone = l - 1, value = args[0], isFunction = jQuery.isFunction(value);
            if (isFunction || !(l <= 1 || "string" != typeof value || jQuery.support.checkClone || !rchecked.test(value))) return this.each(function(index) {
                var self = set.eq(index);
                isFunction && (args[0] = value.call(this, index, table ? self.html() : undefined)), self.domManip(args, table, callback);
            });
            if (l && (first = (fragment = jQuery.buildFragment(args, this[0].ownerDocument, !1, this)).firstChild, 1 === fragment.childNodes.length && (fragment = first), first)) {
                for(table = table && jQuery.nodeName(first, "tr"), scripts = jQuery.map(getAll(fragment, "script"), disableScript), hasScripts = scripts.length; i < l; i++)node = fragment, i !== iNoClone && (node = jQuery.clone(node, !0, !0), hasScripts && jQuery.merge(scripts, getAll(node, "script"))), callback.call(table && jQuery.nodeName(this[i], "table") ? findOrAppend(this[i], "tbody") : this[i], node, i);
                if (hasScripts) for(doc = scripts[scripts.length - 1].ownerDocument, jQuery.map(scripts, restoreScript), i = 0; i < hasScripts; i++)node = scripts[i], rscriptType.test(node.type || "") && !jQuery._data(node, "globalEval") && jQuery.contains(doc, node) && (node.src ? jQuery.ajax({
                    url: node.src,
                    type: "GET",
                    dataType: "script",
                    async: !1,
                    global: !1,
                    "throws": !0
                }) : jQuery.globalEval((node.text || node.textContent || node.innerHTML || "").replace(rcleanScript, "")));
                fragment = first = null;
            }
            return this;
        }
    }), jQuery.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function(name, original) {
        jQuery.fn[name] = function(selector) {
            for(var elems, i = 0, ret = [], insert = jQuery(selector), last = insert.length - 1; i <= last; i++)elems = i === last ? this : this.clone(!0), jQuery(insert[i])[original](elems), core_push.apply(ret, elems.get());
            return this.pushStack(ret);
        };
    }), jQuery.extend({
        clone: function(elem, dataAndEvents, deepDataAndEvents) {
            var destElements, node, clone, i, srcElements, inPage = jQuery.contains(elem.ownerDocument, elem);
            if (jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test("<" + elem.nodeName + ">") ? clone = elem.cloneNode(!0) : (fragmentDiv.innerHTML = elem.outerHTML, fragmentDiv.removeChild(clone = fragmentDiv.firstChild)), (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) && (1 === elem.nodeType || 11 === elem.nodeType) && !jQuery.isXMLDoc(elem)) for(i = 0, destElements = getAll(clone), srcElements = getAll(elem); null != (node = srcElements[i]); ++i)destElements[i] && fixCloneNodeIssues(node, destElements[i]);
            if (dataAndEvents) {
                if (deepDataAndEvents) for(i = 0, srcElements = srcElements || getAll(elem), destElements = destElements || getAll(clone); null != (node = srcElements[i]); i++)cloneCopyEvent(node, destElements[i]);
                else cloneCopyEvent(elem, clone);
            }
            return (destElements = getAll(clone, "script")).length > 0 && setGlobalEval(destElements, !inPage && getAll(elem, "script")), destElements = srcElements = node = null, clone;
        },
        buildFragment: function(elems, context, scripts, selection) {
            for(var j, elem, contains, tmp, tag, tbody, wrap, l = elems.length, safe = createSafeFragment(context), nodes = [], i = 0; i < l; i++)if ((elem = elems[i]) || 0 === elem) {
                if ("object" === jQuery.type(elem)) jQuery.merge(nodes, elem.nodeType ? [
                    elem
                ] : elem);
                else if (rhtml.test(elem)) {
                    for(tmp = tmp || safe.appendChild(context.createElement("div")), wrap = wrapMap[tag = (rtagName.exec(elem) || [
                        "",
                        ""
                    ])[1].toLowerCase()] || wrapMap._default, tmp.innerHTML = wrap[1] + elem.replace(rxhtmlTag, "<$1></$2>") + wrap[2], j = wrap[0]; j--;)tmp = tmp.lastChild;
                    if (!jQuery.support.leadingWhitespace && rleadingWhitespace.test(elem) && nodes.push(context.createTextNode(rleadingWhitespace.exec(elem)[0])), !jQuery.support.tbody) for(j = (elem = "table" !== tag || rtbody.test(elem) ? "<table>" !== wrap[1] || rtbody.test(elem) ? 0 : tmp : tmp.firstChild) && elem.childNodes.length; j--;)jQuery.nodeName(tbody = elem.childNodes[j], "tbody") && !tbody.childNodes.length && elem.removeChild(tbody);
                    for(jQuery.merge(nodes, tmp.childNodes), tmp.textContent = ""; tmp.firstChild;)tmp.removeChild(tmp.firstChild);
                    tmp = safe.lastChild;
                } else nodes.push(context.createTextNode(elem));
            }
            for(tmp && safe.removeChild(tmp), jQuery.support.appendChecked || jQuery.grep(getAll(nodes, "input"), fixDefaultChecked), i = 0; elem = nodes[i++];)if ((!selection || -1 === jQuery.inArray(elem, selection)) && (contains = jQuery.contains(elem.ownerDocument, elem), tmp = getAll(safe.appendChild(elem), "script"), contains && setGlobalEval(tmp), scripts)) for(j = 0; elem = tmp[j++];)rscriptType.test(elem.type || "") && scripts.push(elem);
            return tmp = null, safe;
        },
        cleanData: function(elems, acceptData) {
            for(var elem, type, id, data, i = 0, internalKey = jQuery.expando, cache = jQuery.cache, deleteExpando = jQuery.support.deleteExpando, special = jQuery.event.special; null != (elem = elems[i]); i++)if ((acceptData || jQuery.acceptData(elem)) && (data = (id = elem[internalKey]) && cache[id])) {
                if (data.events) for(type in data.events)special[type] ? jQuery.event.remove(elem, type) : jQuery.removeEvent(elem, type, data.handle);
                cache[id] && (delete cache[id], deleteExpando ? delete elem[internalKey] : typeof elem.removeAttribute !== core_strundefined ? elem.removeAttribute(internalKey) : elem[internalKey] = null, core_deletedIds.push(id));
            }
        }
    });
    var iframe, getStyles, curCSS, ralpha = /alpha\([^)]*\)/i, ropacity = /opacity\s*=\s*([^)]*)/, rposition = /^(top|right|bottom|left)$/, rdisplayswap = /^(none|table(?!-c[ea]).+)/, rmargin = /^margin/, rnumsplit = new RegExp("^(" + core_pnum + ")(.*)$", "i"), rnumnonpx = new RegExp("^(" + core_pnum + ")(?!px)[a-z%]+$", "i"), rrelNum = new RegExp("^([+-])=(" + core_pnum + ")", "i"), elemdisplay = {
        BODY: "block"
    }, cssShow = {
        position: "absolute",
        visibility: "hidden",
        display: "block"
    }, cssNormalTransform = {
        letterSpacing: 0,
        fontWeight: 400
    }, cssExpand = [
        "Top",
        "Right",
        "Bottom",
        "Left"
    ], cssPrefixes = [
        "Webkit",
        "O",
        "Moz",
        "ms"
    ];
    function vendorPropName(style, name) {
        if (name in style) return name;
        for(var capName = name.charAt(0).toUpperCase() + name.slice(1), origName = name, i = cssPrefixes.length; i--;)if ((name = cssPrefixes[i] + capName) in style) return name;
        return origName;
    }
    function isHidden(elem, el) {
        return elem = el || elem, "none" === jQuery.css(elem, "display") || !jQuery.contains(elem.ownerDocument, elem);
    }
    function showHide(elements, show) {
        for(var display, elem, hidden, values = [], index = 0, length = elements.length; index < length; index++)(elem = elements[index]).style && (values[index] = jQuery._data(elem, "olddisplay"), display = elem.style.display, show ? (values[index] || "none" !== display || (elem.style.display = ""), "" === elem.style.display && isHidden(elem) && (values[index] = jQuery._data(elem, "olddisplay", css_defaultDisplay(elem.nodeName)))) : values[index] || (hidden = isHidden(elem), (display && "none" !== display || !hidden) && jQuery._data(elem, "olddisplay", hidden ? display : jQuery.css(elem, "display"))));
        for(index = 0; index < length; index++)(elem = elements[index]).style && (show && "none" !== elem.style.display && "" !== elem.style.display || (elem.style.display = show ? values[index] || "" : "none"));
        return elements;
    }
    function setPositiveNumber(elem, value, subtract) {
        var matches = rnumsplit.exec(value);
        return matches ? Math.max(0, matches[1] - (subtract || 0)) + (matches[2] || "px") : value;
    }
    function augmentWidthOrHeight(elem, name, extra, isBorderBox, styles) {
        for(var i = extra === (isBorderBox ? "border" : "content") ? 4 : "width" === name ? 1 : 0, val = 0; i < 4; i += 2)"margin" === extra && (val += jQuery.css(elem, extra + cssExpand[i], !0, styles)), isBorderBox ? ("content" === extra && (val -= jQuery.css(elem, "padding" + cssExpand[i], !0, styles)), "margin" !== extra && (val -= jQuery.css(elem, "border" + cssExpand[i] + "Width", !0, styles))) : (val += jQuery.css(elem, "padding" + cssExpand[i], !0, styles), "padding" !== extra && (val += jQuery.css(elem, "border" + cssExpand[i] + "Width", !0, styles)));
        return val;
    }
    function getWidthOrHeight(elem, name, extra) {
        var valueIsBorderBox = !0, val = "width" === name ? elem.offsetWidth : elem.offsetHeight, styles = getStyles(elem), isBorderBox = jQuery.support.boxSizing && "border-box" === jQuery.css(elem, "boxSizing", !1, styles);
        if (val <= 0 || null == val) {
            if (((val = curCSS(elem, name, styles)) < 0 || null == val) && (val = elem.style[name]), rnumnonpx.test(val)) return val;
            valueIsBorderBox = isBorderBox && (jQuery.support.boxSizingReliable || val === elem.style[name]), val = parseFloat(val) || 0;
        }
        return val + augmentWidthOrHeight(elem, name, extra || (isBorderBox ? "border" : "content"), valueIsBorderBox, styles) + "px";
    }
    function css_defaultDisplay(nodeName) {
        var doc = document1, display = elemdisplay[nodeName];
        return display || ("none" !== (display = actualDisplay(nodeName, doc)) && display || ((doc = ((iframe = (iframe || jQuery("<iframe frameborder='0' width='0' height='0'/>").css("cssText", "display:block !important")).appendTo(doc.documentElement))[0].contentWindow || iframe[0].contentDocument).document).write("<!doctype html><html><body>"), doc.close(), display = actualDisplay(nodeName, doc), iframe.detach()), elemdisplay[nodeName] = display), display;
    }
    function actualDisplay(name, doc) {
        var elem = jQuery(doc.createElement(name)).appendTo(doc.body), display = jQuery.css(elem[0], "display");
        return elem.remove(), display;
    }
    jQuery.fn.extend({
        css: function(name1, value6) {
            return jQuery.access(this, function(elem, name, value) {
                var len, styles, map = {}, i = 0;
                if (jQuery.isArray(name)) {
                    for(styles = getStyles(elem), len = name.length; i < len; i++)map[name[i]] = jQuery.css(elem, name[i], !1, styles);
                    return map;
                }
                return value !== undefined ? jQuery.style(elem, name, value) : jQuery.css(elem, name);
            }, name1, value6, arguments.length > 1);
        },
        show: function() {
            return showHide(this, !0);
        },
        hide: function() {
            return showHide(this);
        },
        toggle: function(state) {
            var bool = "boolean" == typeof state;
            return this.each(function() {
                (bool ? state : isHidden(this)) ? jQuery(this).show() : jQuery(this).hide();
            });
        }
    }), jQuery.extend({
        cssHooks: {
            opacity: {
                get: function(elem, computed) {
                    if (computed) {
                        var ret = curCSS(elem, "opacity");
                        return "" === ret ? "1" : ret;
                    }
                }
            }
        },
        cssNumber: {
            columnCount: !0,
            fillOpacity: !0,
            fontWeight: !0,
            lineHeight: !0,
            opacity: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        cssProps: {
            "float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
        },
        style: function(elem, name, value, extra) {
            if (elem && 3 !== elem.nodeType && 8 !== elem.nodeType && elem.style) {
                var ret, type, hooks, origName = jQuery.camelCase(name), style = elem.style;
                if (name = jQuery.cssProps[origName] || (jQuery.cssProps[origName] = vendorPropName(style, origName)), hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName], value === undefined) return hooks && "get" in hooks && undefined !== (ret = hooks.get(elem, !1, extra)) ? ret : style[name];
                if ("string" == (type = typeof value) && (ret = rrelNum.exec(value)) && (value = (ret[1] + 1) * ret[2] + parseFloat(jQuery.css(elem, name)), type = "number"), !(null == value || "number" === type && isNaN(value)) && ("number" !== type || jQuery.cssNumber[origName] || (value += "px"), jQuery.support.clearCloneStyle || "" !== value || 0 !== name.indexOf("background") || (style[name] = "inherit"), !hooks || !("set" in hooks) || undefined !== (value = hooks.set(elem, value, extra)))) try {
                    style[name] = value;
                } catch (e) {}
            }
        },
        css: function(elem, name, extra, styles) {
            var num, val, hooks, origName = jQuery.camelCase(name);
            return (name = jQuery.cssProps[origName] || (jQuery.cssProps[origName] = vendorPropName(elem.style, origName)), hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName], hooks && "get" in hooks && (val = hooks.get(elem, !0, extra)), val === undefined && (val = curCSS(elem, name, styles)), "normal" === val && name in cssNormalTransform && (val = cssNormalTransform[name]), "" === extra || extra) ? (num = parseFloat(val), !0 === extra || jQuery.isNumeric(num) ? num || 0 : val) : val;
        },
        swap: function(elem, options, callback, args) {
            var ret, name, old = {};
            for(name in options)old[name] = elem.style[name], elem.style[name] = options[name];
            for(name in ret = callback.apply(elem, args || []), options)elem.style[name] = old[name];
            return ret;
        }
    }), window1.getComputedStyle ? (getStyles = function(elem) {
        return window1.getComputedStyle(elem, null);
    }, curCSS = function(elem, name, _computed) {
        var width, minWidth, maxWidth, computed = _computed || getStyles(elem), ret = computed ? computed.getPropertyValue(name) || computed[name] : undefined, style = elem.style;
        return computed && ("" !== ret || jQuery.contains(elem.ownerDocument, elem) || (ret = jQuery.style(elem, name)), rnumnonpx.test(ret) && rmargin.test(name) && (width = style.width, minWidth = style.minWidth, maxWidth = style.maxWidth, style.minWidth = style.maxWidth = style.width = ret, ret = computed.width, style.width = width, style.minWidth = minWidth, style.maxWidth = maxWidth)), ret;
    }) : document1.documentElement.currentStyle && (getStyles = function(elem) {
        return elem.currentStyle;
    }, curCSS = function(elem, name, _computed) {
        var left, rs, rsLeft, computed = _computed || getStyles(elem), ret = computed ? computed[name] : undefined, style = elem.style;
        return null == ret && style && style[name] && (ret = style[name]), rnumnonpx.test(ret) && !rposition.test(name) && (left = style.left, (rsLeft = (rs = elem.runtimeStyle) && rs.left) && (rs.left = elem.currentStyle.left), style.left = "fontSize" === name ? "1em" : ret, ret = style.pixelLeft + "px", style.left = left, rsLeft && (rs.left = rsLeft)), "" === ret ? "auto" : ret;
    }), jQuery.each([
        "height",
        "width"
    ], function(i, name) {
        jQuery.cssHooks[name] = {
            get: function(elem, computed, extra) {
                if (computed) return 0 === elem.offsetWidth && rdisplayswap.test(jQuery.css(elem, "display")) ? jQuery.swap(elem, cssShow, function() {
                    return getWidthOrHeight(elem, name, extra);
                }) : getWidthOrHeight(elem, name, extra);
            },
            set: function(elem, value, extra) {
                var styles = extra && getStyles(elem);
                return setPositiveNumber(elem, value, extra ? augmentWidthOrHeight(elem, name, extra, jQuery.support.boxSizing && "border-box" === jQuery.css(elem, "boxSizing", !1, styles), styles) : 0);
            }
        };
    }), jQuery.support.opacity || (jQuery.cssHooks.opacity = {
        get: function(elem, computed) {
            return ropacity.test((computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "") ? 0.01 * parseFloat(RegExp.$1) + "" : computed ? "1" : "";
        },
        set: function(elem, value) {
            var style = elem.style, currentStyle = elem.currentStyle, opacity = jQuery.isNumeric(value) ? "alpha(opacity=" + 100 * value + ")" : "", filter = currentStyle && currentStyle.filter || style.filter || "";
            style.zoom = 1, (value >= 1 || "" === value) && "" === jQuery.trim(filter.replace(ralpha, "")) && style.removeAttribute && (style.removeAttribute("filter"), "" === value || currentStyle && !currentStyle.filter) || (style.filter = ralpha.test(filter) ? filter.replace(ralpha, opacity) : filter + " " + opacity);
        }
    }), jQuery(function() {
        jQuery.support.reliableMarginRight || (jQuery.cssHooks.marginRight = {
            get: function(elem, computed) {
                if (computed) return jQuery.swap(elem, {
                    display: "inline-block"
                }, curCSS, [
                    elem,
                    "marginRight"
                ]);
            }
        }), !jQuery.support.pixelPosition && jQuery.fn.position && jQuery.each([
            "top",
            "left"
        ], function(i, prop) {
            jQuery.cssHooks[prop] = {
                get: function(elem, computed) {
                    if (computed) return computed = curCSS(elem, prop), rnumnonpx.test(computed) ? jQuery(elem).position()[prop] + "px" : computed;
                }
            };
        });
    }), jQuery.expr && jQuery.expr.filters && (jQuery.expr.filters.hidden = function(elem) {
        return elem.offsetWidth <= 0 && elem.offsetHeight <= 0 || !jQuery.support.reliableHiddenOffsets && "none" === (elem.style && elem.style.display || jQuery.css(elem, "display"));
    }, jQuery.expr.filters.visible = function(elem) {
        return !jQuery.expr.filters.hidden(elem);
    }), jQuery.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function(prefix, suffix) {
        jQuery.cssHooks[prefix + suffix] = {
            expand: function(value) {
                for(var i = 0, expanded = {}, parts = "string" == typeof value ? value.split(" ") : [
                    value
                ]; i < 4; i++)expanded[prefix + cssExpand[i] + suffix] = parts[i] || parts[i - 2] || parts[0];
                return expanded;
            }
        }, rmargin.test(prefix) || (jQuery.cssHooks[prefix + suffix].set = setPositiveNumber);
    });
    var r20 = /%20/g, rbracket = /\[\]$/, rCRLF = /\r?\n/g, rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i, rsubmittable = /^(?:input|select|textarea|keygen)/i;
    function buildParams(prefix, obj, traditional, add) {
        var name;
        if (jQuery.isArray(obj)) jQuery.each(obj, function(i, v) {
            traditional || rbracket.test(prefix) ? add(prefix, v) : buildParams(prefix + "[" + ("object" == typeof v ? i : "") + "]", v, traditional, add);
        });
        else if (traditional || "object" !== jQuery.type(obj)) add(prefix, obj);
        else for(name in obj)buildParams(prefix + "[" + name + "]", obj[name], traditional, add);
    }
    jQuery.fn.extend({
        serialize: function() {
            return jQuery.param(this.serializeArray());
        },
        serializeArray: function() {
            return this.map(function() {
                var elements = jQuery.prop(this, "elements");
                return elements ? jQuery.makeArray(elements) : this;
            }).filter(function() {
                var type = this.type;
                return this.name && !jQuery(this).is(":disabled") && rsubmittable.test(this.nodeName) && !rsubmitterTypes.test(type) && (this.checked || !manipulation_rcheckableType.test(type));
            }).map(function(i, elem) {
                var val1 = jQuery(this).val();
                return null == val1 ? null : jQuery.isArray(val1) ? jQuery.map(val1, function(val) {
                    return {
                        name: elem.name,
                        value: val.replace(rCRLF, "\r\n")
                    };
                }) : {
                    name: elem.name,
                    value: val1.replace(rCRLF, "\r\n")
                };
            }).get();
        }
    }), jQuery.param = function(a, traditional) {
        var prefix, s = [], add = function(key, value) {
            value = jQuery.isFunction(value) ? value() : null == value ? "" : value, s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
        };
        if (traditional === undefined && (traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional), jQuery.isArray(a) || a.jquery && !jQuery.isPlainObject(a)) jQuery.each(a, function() {
            add(this.name, this.value);
        });
        else for(prefix in a)buildParams(prefix, a[prefix], traditional, add);
        return s.join("&").replace(r20, "+");
    }, jQuery.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(i, name) {
        jQuery.fn[name] = function(data, fn) {
            return arguments.length > 0 ? this.on(name, null, data, fn) : this.trigger(name);
        };
    }), jQuery.fn.hover = function(fnOver, fnOut) {
        return this.mouseenter(fnOver).mouseleave(fnOut || fnOver);
    };
    var ajaxLocParts, ajaxLocation, ajax_nonce = jQuery.now(), ajax_rquery = /\?/, rhash = /#.*$/, rts = /([?&])_=[^&]*/, rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, rnoContent = /^(?:GET|HEAD)$/, rprotocol = /^\/\//, rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/, _load = jQuery.fn.load, prefilters = {}, transports = {}, allTypes = "*/".concat("*");
    try {
        ajaxLocation = location.href;
    } catch (e1) {
        (ajaxLocation = document1.createElement("a")).href = "", ajaxLocation = ajaxLocation.href;
    }
    function addToPrefiltersOrTransports(structure) {
        return function(dataTypeExpression, func) {
            "string" != typeof dataTypeExpression && (func = dataTypeExpression, dataTypeExpression = "*");
            var dataType, i = 0, dataTypes = dataTypeExpression.toLowerCase().match(core_rnotwhite) || [];
            if (jQuery.isFunction(func)) for(; dataType = dataTypes[i++];)"+" === dataType[0] ? (structure[dataType = dataType.slice(1) || "*"] = structure[dataType] || []).unshift(func) : (structure[dataType] = structure[dataType] || []).push(func);
        };
    }
    function inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR) {
        var inspected = {}, seekingTransport = structure === transports;
        function inspect(dataType) {
            var selected;
            return inspected[dataType] = !0, jQuery.each(structure[dataType] || [], function(_, prefilterOrFactory) {
                var dataTypeOrTransport = prefilterOrFactory(options, originalOptions, jqXHR);
                return "string" != typeof dataTypeOrTransport || seekingTransport || inspected[dataTypeOrTransport] ? seekingTransport ? !(selected = dataTypeOrTransport) : void 0 : (options.dataTypes.unshift(dataTypeOrTransport), inspect(dataTypeOrTransport), !1);
            }), selected;
        }
        return inspect(options.dataTypes[0]) || !inspected["*"] && inspect("*");
    }
    function ajaxExtend(target, src) {
        var deep, key, flatOptions = jQuery.ajaxSettings.flatOptions || {};
        for(key in src)undefined !== src[key] && ((flatOptions[key] ? target : deep || (deep = {}))[key] = src[key]);
        return deep && jQuery.extend(!0, target, deep), target;
    }
    ajaxLocParts = rurl.exec(ajaxLocation.toLowerCase()) || [], jQuery.fn.load = function(url, params, callback) {
        if ("string" != typeof url && _load) return _load.apply(this, arguments);
        var selector, response, type, self = this, off = url.indexOf(" ");
        return off >= 0 && (selector = url.slice(off, url.length), url = url.slice(0, off)), jQuery.isFunction(params) ? (callback = params, params = undefined) : params && "object" == typeof params && (type = "POST"), self.length > 0 && jQuery.ajax({
            url: url,
            type: type,
            dataType: "html",
            data: params
        }).done(function(responseText) {
            response = arguments, self.html(selector ? jQuery("<div>").append(jQuery.parseHTML(responseText)).find(selector) : responseText);
        }).complete(callback && function(jqXHR, status) {
            self.each(callback, response || [
                jqXHR.responseText,
                status,
                jqXHR
            ]);
        }), this;
    }, jQuery.each([
        "ajaxStart",
        "ajaxStop",
        "ajaxComplete",
        "ajaxError",
        "ajaxSuccess",
        "ajaxSend"
    ], function(i, type) {
        jQuery.fn[type] = function(fn) {
            return this.on(type, fn);
        };
    }), jQuery.each([
        "get",
        "post"
    ], function(i, method) {
        jQuery[method] = function(url, data, callback, type) {
            return jQuery.isFunction(data) && (type = type || callback, callback = data, data = undefined), jQuery.ajax({
                url: url,
                type: method,
                dataType: type,
                data: data,
                success: callback
            });
        };
    }), jQuery.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
            url: ajaxLocation,
            type: "GET",
            isLocal: /^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(ajaxLocParts[1]),
            global: !0,
            processData: !0,
            async: !0,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            accepts: {
                "*": allTypes,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },
            contents: {
                xml: /xml/,
                html: /html/,
                json: /json/
            },
            responseFields: {
                xml: "responseXML",
                text: "responseText"
            },
            converters: {
                "* text": window1.String,
                "text html": !0,
                "text json": jQuery.parseJSON,
                "text xml": jQuery.parseXML
            },
            flatOptions: {
                url: !0,
                context: !0
            }
        },
        ajaxSetup: function(target, settings) {
            return settings ? ajaxExtend(ajaxExtend(target, jQuery.ajaxSettings), settings) : ajaxExtend(jQuery.ajaxSettings, target);
        },
        ajaxPrefilter: addToPrefiltersOrTransports(prefilters),
        ajaxTransport: addToPrefiltersOrTransports(transports),
        ajax: function(url, options) {
            "object" == typeof url && (options = url, url = undefined), options = options || {};
            var parts, i4, cacheURL, responseHeadersString, timeoutTimer, fireGlobals, transport, responseHeaders, s1 = jQuery.ajaxSetup({}, options), callbackContext = s1.context || s1, globalEventContext = s1.context && (callbackContext.nodeType || callbackContext.jquery) ? jQuery(callbackContext) : jQuery.event, deferred = jQuery.Deferred(), completeDeferred = jQuery.Callbacks("once memory"), statusCode = s1.statusCode || {}, requestHeaders = {}, requestHeadersNames = {}, state = 0, strAbort = "canceled", jqXHR1 = {
                readyState: 0,
                getResponseHeader: function(key) {
                    var match;
                    if (2 === state) {
                        if (!responseHeaders) for(responseHeaders = {}; match = rheaders.exec(responseHeadersString);)responseHeaders[match[1].toLowerCase()] = match[2];
                        match = responseHeaders[key.toLowerCase()];
                    }
                    return null == match ? null : match;
                },
                getAllResponseHeaders: function() {
                    return 2 === state ? responseHeadersString : null;
                },
                setRequestHeader: function(name, value) {
                    var lname = name.toLowerCase();
                    return state || (requestHeaders[name = requestHeadersNames[lname] = requestHeadersNames[lname] || name] = value), this;
                },
                overrideMimeType: function(type) {
                    return state || (s1.mimeType = type), this;
                },
                statusCode: function(map) {
                    var code;
                    if (map) {
                        if (state < 2) for(code in map)statusCode[code] = [
                            statusCode[code],
                            map[code]
                        ];
                        else jqXHR1.always(map[jqXHR1.status]);
                    }
                    return this;
                },
                abort: function(statusText) {
                    var finalText = statusText || strAbort;
                    return transport && transport.abort(finalText), done(0, finalText), this;
                }
            };
            if (deferred.promise(jqXHR1).complete = completeDeferred.add, jqXHR1.success = jqXHR1.done, jqXHR1.error = jqXHR1.fail, s1.url = ((url || s1.url || ajaxLocation) + "").replace(rhash, "").replace(rprotocol, ajaxLocParts[1] + "//"), s1.type = options.method || options.type || s1.method || s1.type, s1.dataTypes = jQuery.trim(s1.dataType || "*").toLowerCase().match(core_rnotwhite) || [
                ""
            ], null == s1.crossDomain && (parts = rurl.exec(s1.url.toLowerCase()), s1.crossDomain = !!(parts && (parts[1] !== ajaxLocParts[1] || parts[2] !== ajaxLocParts[2] || (parts[3] || ("http:" === parts[1] ? 80 : 443)) != (ajaxLocParts[3] || ("http:" === ajaxLocParts[1] ? 80 : 443))))), s1.data && s1.processData && "string" != typeof s1.data && (s1.data = jQuery.param(s1.data, s1.traditional)), inspectPrefiltersOrTransports(prefilters, s1, options, jqXHR1), 2 === state) return jqXHR1;
            for(i4 in (fireGlobals = s1.global) && 0 == jQuery.active++ && jQuery.event.trigger("ajaxStart"), s1.type = s1.type.toUpperCase(), s1.hasContent = !rnoContent.test(s1.type), cacheURL = s1.url, s1.hasContent || (s1.data && (cacheURL = s1.url += (ajax_rquery.test(cacheURL) ? "&" : "?") + s1.data, delete s1.data), !1 === s1.cache && (s1.url = rts.test(cacheURL) ? cacheURL.replace(rts, "$1_=" + ajax_nonce++) : cacheURL + (ajax_rquery.test(cacheURL) ? "&" : "?") + "_=" + ajax_nonce++)), s1.ifModified && (jQuery.lastModified[cacheURL] && jqXHR1.setRequestHeader("If-Modified-Since", jQuery.lastModified[cacheURL]), jQuery.etag[cacheURL] && jqXHR1.setRequestHeader("If-None-Match", jQuery.etag[cacheURL])), (s1.data && s1.hasContent && !1 !== s1.contentType || options.contentType) && jqXHR1.setRequestHeader("Content-Type", s1.contentType), jqXHR1.setRequestHeader("Accept", s1.dataTypes[0] && s1.accepts[s1.dataTypes[0]] ? s1.accepts[s1.dataTypes[0]] + ("*" !== s1.dataTypes[0] ? ", " + allTypes + "; q=0.01" : "") : s1.accepts["*"]), s1.headers)jqXHR1.setRequestHeader(i4, s1.headers[i4]);
            if (s1.beforeSend && (!1 === s1.beforeSend.call(callbackContext, jqXHR1, s1) || 2 === state)) return jqXHR1.abort();
            for(i4 in strAbort = "abort", {
                success: 1,
                error: 1,
                complete: 1
            })jqXHR1[i4](s1[i4]);
            if (transport = inspectPrefiltersOrTransports(transports, s1, options, jqXHR1)) {
                jqXHR1.readyState = 1, fireGlobals && globalEventContext.trigger("ajaxSend", [
                    jqXHR1,
                    s1
                ]), s1.async && s1.timeout > 0 && (timeoutTimer = setTimeout(function() {
                    jqXHR1.abort("timeout");
                }, s1.timeout));
                try {
                    state = 1, transport.send(requestHeaders, done);
                } catch (e) {
                    if (state < 2) done(-1, e);
                    else throw e;
                }
            } else done(-1, "No Transport");
            function done(status, nativeStatusText, responses1, headers) {
                var isSuccess, success, error, response1, modified, statusText = nativeStatusText;
                2 !== state && (state = 2, timeoutTimer && clearTimeout(timeoutTimer), transport = undefined, responseHeadersString = headers || "", jqXHR1.readyState = status > 0 ? 4 : 0, responses1 && (response1 = function(s, jqXHR, responses) {
                    var firstDataType, ct, finalDataType, type, contents = s.contents, dataTypes = s.dataTypes, responseFields = s.responseFields;
                    for(type in responseFields)type in responses && (jqXHR[responseFields[type]] = responses[type]);
                    for(; "*" === dataTypes[0];)dataTypes.shift(), ct === undefined && (ct = s.mimeType || jqXHR.getResponseHeader("Content-Type"));
                    if (ct) {
                        for(type in contents)if (contents[type] && contents[type].test(ct)) {
                            dataTypes.unshift(type);
                            break;
                        }
                    }
                    if (dataTypes[0] in responses) finalDataType = dataTypes[0];
                    else {
                        for(type in responses){
                            if (!dataTypes[0] || s.converters[type + " " + dataTypes[0]]) {
                                finalDataType = type;
                                break;
                            }
                            firstDataType || (firstDataType = type);
                        }
                        finalDataType = finalDataType || firstDataType;
                    }
                    if (finalDataType) return finalDataType !== dataTypes[0] && dataTypes.unshift(finalDataType), responses[finalDataType];
                }(s1, jqXHR1, responses1)), status >= 200 && status < 300 || 304 === status ? (s1.ifModified && ((modified = jqXHR1.getResponseHeader("Last-Modified")) && (jQuery.lastModified[cacheURL] = modified), (modified = jqXHR1.getResponseHeader("etag")) && (jQuery.etag[cacheURL] = modified)), 204 === status ? (isSuccess = !0, statusText = "nocontent") : 304 === status ? (isSuccess = !0, statusText = "notmodified") : (statusText = (isSuccess = function(s, response) {
                    var conv2, current, conv, tmp, converters = {}, i = 0, dataTypes = s.dataTypes.slice(), prev = dataTypes[0];
                    if (s.dataFilter && (response = s.dataFilter(response, s.dataType)), dataTypes[1]) for(conv in s.converters)converters[conv.toLowerCase()] = s.converters[conv];
                    for(; current = dataTypes[++i];)if ("*" !== current) {
                        if ("*" !== prev && prev !== current) {
                            if (!(conv = converters[prev + " " + current] || converters["* " + current])) {
                                for(conv2 in converters)if ((tmp = conv2.split(" "))[1] === current && (conv = converters[prev + " " + tmp[0]] || converters["* " + tmp[0]])) {
                                    !0 === conv ? conv = converters[conv2] : !0 !== converters[conv2] && (current = tmp[0], dataTypes.splice(i--, 0, current));
                                    break;
                                }
                            }
                            if (!0 !== conv) {
                                if (conv && s.throws) response = conv(response);
                                else try {
                                    response = conv(response);
                                } catch (e) {
                                    return {
                                        state: "parsererror",
                                        error: conv ? e : "No conversion from " + prev + " to " + current
                                    };
                                }
                            }
                        }
                        prev = current;
                    }
                    return {
                        state: "success",
                        data: response
                    };
                }(s1, response1)).state, success = isSuccess.data, error = isSuccess.error, isSuccess = !error)) : (error = statusText, (status || !statusText) && (statusText = "error", status < 0 && (status = 0))), jqXHR1.status = status, jqXHR1.statusText = (nativeStatusText || statusText) + "", isSuccess ? deferred.resolveWith(callbackContext, [
                    success,
                    statusText,
                    jqXHR1
                ]) : deferred.rejectWith(callbackContext, [
                    jqXHR1,
                    statusText,
                    error
                ]), jqXHR1.statusCode(statusCode), statusCode = undefined, fireGlobals && globalEventContext.trigger(isSuccess ? "ajaxSuccess" : "ajaxError", [
                    jqXHR1,
                    s1,
                    isSuccess ? success : error
                ]), completeDeferred.fireWith(callbackContext, [
                    jqXHR1,
                    statusText
                ]), !fireGlobals || (globalEventContext.trigger("ajaxComplete", [
                    jqXHR1,
                    s1
                ]), --jQuery.active || jQuery.event.trigger("ajaxStop")));
            }
            return jqXHR1;
        },
        getScript: function(url, callback) {
            return jQuery.get(url, undefined, callback, "script");
        },
        getJSON: function(url, data, callback) {
            return jQuery.get(url, data, callback, "json");
        }
    }), jQuery.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /(?:java|ecma)script/
        },
        converters: {
            "text script": function(text) {
                return jQuery.globalEval(text), text;
            }
        }
    }), jQuery.ajaxPrefilter("script", function(s) {
        undefined === s.cache && (s.cache = !1), s.crossDomain && (s.type = "GET", s.global = !1);
    }), jQuery.ajaxTransport("script", function(s) {
        if (s.crossDomain) {
            var script, head = document1.head || jQuery("head")[0] || document1.documentElement;
            return {
                send: function(_, callback) {
                    (script = document1.createElement("script")).async = !0, s.scriptCharset && (script.charset = s.scriptCharset), script.src = s.url, script.onload = script.onreadystatechange = function(_, isAbort) {
                        (isAbort || !script.readyState || /loaded|complete/.test(script.readyState)) && (script.onload = script.onreadystatechange = null, script.parentNode && script.parentNode.removeChild(script), script = null, isAbort || callback(200, "success"));
                    }, head.insertBefore(script, head.firstChild);
                },
                abort: function() {
                    script && script.onload(undefined, !0);
                }
            };
        }
    });
    var oldCallbacks = [], rjsonp = /(=)\?(?=&|$)|\?\?/;
    jQuery.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
            var callback = oldCallbacks.pop() || jQuery.expando + "_" + ajax_nonce++;
            return this[callback] = !0, callback;
        }
    }), jQuery.ajaxPrefilter("json jsonp", function(s, originalSettings, jqXHR) {
        var callbackName, overwritten, responseContainer, jsonProp = !1 !== s.jsonp && (rjsonp.test(s.url) ? "url" : "string" == typeof s.data && !(s.contentType || "").indexOf("application/x-www-form-urlencoded") && rjsonp.test(s.data) && "data");
        if (jsonProp || "jsonp" === s.dataTypes[0]) return callbackName = s.jsonpCallback = jQuery.isFunction(s.jsonpCallback) ? s.jsonpCallback() : s.jsonpCallback, jsonProp ? s[jsonProp] = s[jsonProp].replace(rjsonp, "$1" + callbackName) : !1 !== s.jsonp && (s.url += (ajax_rquery.test(s.url) ? "&" : "?") + s.jsonp + "=" + callbackName), s.converters["script json"] = function() {
            return responseContainer || jQuery.error(callbackName + " was not called"), responseContainer[0];
        }, s.dataTypes[0] = "json", overwritten = window1[callbackName], window1[callbackName] = function() {
            responseContainer = arguments;
        }, jqXHR.always(function() {
            window1[callbackName] = overwritten, s[callbackName] && (s.jsonpCallback = originalSettings.jsonpCallback, oldCallbacks.push(callbackName)), responseContainer && jQuery.isFunction(overwritten) && overwritten(responseContainer[0]), responseContainer = overwritten = undefined;
        }), "script";
    });
    var xhrCallbacks, xhrSupported, xhrId = 0, xhrOnUnloadAbort = window1.ActiveXObject && function() {
        var key;
        for(key in xhrCallbacks)xhrCallbacks[key](undefined, !0);
    };
    function createStandardXHR() {
        try {
            return new window1.XMLHttpRequest();
        } catch (e) {}
    }
    jQuery.ajaxSettings.xhr = window1.ActiveXObject ? function() {
        return !this.isLocal && createStandardXHR() || function() {
            try {
                return new window1.ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {}
        }();
    } : createStandardXHR, xhrSupported = jQuery.ajaxSettings.xhr(), jQuery.support.cors = !!xhrSupported && "withCredentials" in xhrSupported, xhrSupported = jQuery.support.ajax = !!xhrSupported, xhrSupported && jQuery.ajaxTransport(function(s) {
        if (!s.crossDomain || jQuery.support.cors) {
            var callback;
            return {
                send: function(headers, complete) {
                    var handle, i, xhr = s.xhr();
                    if (s.username ? xhr.open(s.type, s.url, s.async, s.username, s.password) : xhr.open(s.type, s.url, s.async), s.xhrFields) for(i in s.xhrFields)xhr[i] = s.xhrFields[i];
                    s.mimeType && xhr.overrideMimeType && xhr.overrideMimeType(s.mimeType), s.crossDomain || headers["X-Requested-With"] || (headers["X-Requested-With"] = "XMLHttpRequest");
                    try {
                        for(i in headers)xhr.setRequestHeader(i, headers[i]);
                    } catch (err) {}
                    xhr.send(s.hasContent && s.data || null), callback = function(_, isAbort) {
                        var status, responseHeaders, statusText, responses;
                        try {
                            if (callback && (isAbort || 4 === xhr.readyState)) {
                                if (callback = undefined, handle && (xhr.onreadystatechange = jQuery.noop, xhrOnUnloadAbort && delete xhrCallbacks[handle]), isAbort) 4 !== xhr.readyState && xhr.abort();
                                else {
                                    responses = {}, status = xhr.status, responseHeaders = xhr.getAllResponseHeaders(), "string" == typeof xhr.responseText && (responses.text = xhr.responseText);
                                    try {
                                        statusText = xhr.statusText;
                                    } catch (e) {
                                        statusText = "";
                                    }
                                    status || !s.isLocal || s.crossDomain ? 1223 === status && (status = 204) : status = responses.text ? 200 : 404;
                                }
                            }
                        } catch (firefoxAccessException) {
                            isAbort || complete(-1, firefoxAccessException);
                        }
                        responses && complete(status, statusText, responses, responseHeaders);
                    }, s.async ? 4 === xhr.readyState ? setTimeout(callback) : (handle = ++xhrId, xhrOnUnloadAbort && (xhrCallbacks || (xhrCallbacks = {}, jQuery(window1).unload(xhrOnUnloadAbort)), xhrCallbacks[handle] = callback), xhr.onreadystatechange = callback) : callback();
                },
                abort: function() {
                    callback && callback(undefined, !0);
                }
            };
        }
    });
    var fxNow, timerId, rfxtypes = /^(?:toggle|show|hide)$/, rfxnum = new RegExp("^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i"), rrun = /queueHooks$/, animationPrefilters = [
        function(elem, props, opts) {
            var prop1, index, length, value, dataShow, toggle, tween, hooks, oldfire, anim = this, style = elem.style, orig = {}, handled = [], hidden = elem.nodeType && isHidden(elem);
            for(index in opts.queue || (null == (hooks = jQuery._queueHooks(elem, "fx")).unqueued && (hooks.unqueued = 0, oldfire = hooks.empty.fire, hooks.empty.fire = function() {
                hooks.unqueued || oldfire();
            }), hooks.unqueued++, anim.always(function() {
                anim.always(function() {
                    hooks.unqueued--, jQuery.queue(elem, "fx").length || hooks.empty.fire();
                });
            })), 1 === elem.nodeType && ("height" in props || "width" in props) && (opts.overflow = [
                style.overflow,
                style.overflowX,
                style.overflowY
            ], "inline" === jQuery.css(elem, "display") && "none" === jQuery.css(elem, "float") && (jQuery.support.inlineBlockNeedsLayout && "inline" !== css_defaultDisplay(elem.nodeName) ? style.zoom = 1 : style.display = "inline-block")), opts.overflow && (style.overflow = "hidden", jQuery.support.shrinkWrapBlocks || anim.always(function() {
                style.overflow = opts.overflow[0], style.overflowX = opts.overflow[1], style.overflowY = opts.overflow[2];
            })), props)if (value = props[index], rfxtypes.exec(value)) {
                if (delete props[index], toggle = toggle || "toggle" === value, value === (hidden ? "hide" : "show")) continue;
                handled.push(index);
            }
            if (length = handled.length) for(("hidden" in (dataShow = jQuery._data(elem, "fxshow") || jQuery._data(elem, "fxshow", {}))) && (hidden = dataShow.hidden), toggle && (dataShow.hidden = !hidden), hidden ? jQuery(elem).show() : anim.done(function() {
                jQuery(elem).hide();
            }), anim.done(function() {
                var prop;
                for(prop in jQuery._removeData(elem, "fxshow"), orig)jQuery.style(elem, prop, orig[prop]);
            }), index = 0; index < length; index++)prop1 = handled[index], tween = anim.createTween(prop1, hidden ? dataShow[prop1] : 0), orig[prop1] = dataShow[prop1] || jQuery.style(elem, prop1), prop1 in dataShow || (dataShow[prop1] = tween.start, hidden && (tween.end = tween.start, tween.start = "width" === prop1 || "height" === prop1 ? 1 : 0));
        }
    ], tweeners = {
        "*": [
            function(prop, value) {
                var end, unit, tween = this.createTween(prop, value), parts = rfxnum.exec(value), target = tween.cur(), start = +target || 0, scale = 1, maxIterations = 20;
                if (parts) {
                    if (end = +parts[2], unit = parts[3] || (jQuery.cssNumber[prop] ? "" : "px"), "px" !== unit && start) {
                        start = jQuery.css(tween.elem, prop, !0) || end || 1;
                        do start /= scale = scale || ".5", jQuery.style(tween.elem, prop, start + unit);
                        while (scale !== (scale = tween.cur() / target) && 1 !== scale && --maxIterations)
                    }
                    tween.unit = unit, tween.start = start, tween.end = parts[1] ? start + (parts[1] + 1) * end : end;
                }
                return tween;
            }
        ]
    };
    function createFxNow() {
        return setTimeout(function() {
            fxNow = undefined;
        }), fxNow = jQuery.now();
    }
    function Animation(elem, properties, options) {
        var animation, props, result, stopped, index1 = 0, length1 = animationPrefilters.length, deferred = jQuery.Deferred().always(function() {
            delete tick.elem;
        }), tick = function() {
            if (stopped) return !1;
            for(var currentTime = fxNow || createFxNow(), remaining = Math.max(0, animation1.startTime + animation1.duration - currentTime), percent = 1 - (remaining / animation1.duration || 0), index = 0, length = animation1.tweens.length; index < length; index++)animation1.tweens[index].run(percent);
            return (deferred.notifyWith(elem, [
                animation1,
                percent,
                remaining
            ]), percent < 1 && length) ? remaining : (deferred.resolveWith(elem, [
                animation1
            ]), !1);
        }, animation1 = deferred.promise({
            elem: elem,
            props: jQuery.extend({}, properties),
            opts: jQuery.extend(!0, {
                specialEasing: {}
            }, options),
            originalProperties: properties,
            originalOptions: options,
            startTime: fxNow || createFxNow(),
            duration: options.duration,
            tweens: [],
            createTween: function(prop, end) {
                var tween = jQuery.Tween(elem, animation1.opts, prop, end, animation1.opts.specialEasing[prop] || animation1.opts.easing);
                return animation1.tweens.push(tween), tween;
            },
            stop: function(gotoEnd) {
                var index = 0, length = gotoEnd ? animation1.tweens.length : 0;
                if (stopped) return this;
                for(stopped = !0; index < length; index++)animation1.tweens[index].run(1);
                return gotoEnd ? deferred.resolveWith(elem, [
                    animation1,
                    gotoEnd
                ]) : deferred.rejectWith(elem, [
                    animation1,
                    gotoEnd
                ]), this;
            }
        }), props1 = animation1.props;
        for(propFilter(props1, animation1.opts.specialEasing); index1 < length1; index1++)if (result = animationPrefilters[index1].call(animation1, elem, props1, animation1.opts)) return result;
        return animation = animation1, props = props1, jQuery.each(props, function(prop, value) {
            for(var collection = (tweeners[prop] || []).concat(tweeners["*"]), index = 0, length = collection.length; index < length; index++)if (collection[index].call(animation, prop, value)) return;
        }), jQuery.isFunction(animation1.opts.start) && animation1.opts.start.call(elem, animation1), jQuery.fx.timer(jQuery.extend(tick, {
            elem: elem,
            anim: animation1,
            queue: animation1.opts.queue
        })), animation1.progress(animation1.opts.progress).done(animation1.opts.done, animation1.opts.complete).fail(animation1.opts.fail).always(animation1.opts.always);
    }
    function propFilter(props, specialEasing) {
        var value, name, index, easing, hooks;
        for(index in props)if (easing = specialEasing[name = jQuery.camelCase(index)], value = props[index], jQuery.isArray(value) && (easing = value[1], value = props[index] = value[0]), index !== name && (props[name] = value, delete props[index]), hooks = jQuery.cssHooks[name], hooks && "expand" in hooks) for(index in value = hooks.expand(value), delete props[name], value)index in props || (props[index] = value[index], specialEasing[index] = easing);
        else specialEasing[name] = easing;
    }
    function Tween(elem, options, prop, end, easing) {
        return new Tween.prototype.init(elem, options, prop, end, easing);
    }
    function genFx(type, includeWidth) {
        var which, attrs = {
            height: type
        }, i = 0;
        for(includeWidth = includeWidth ? 1 : 0; i < 4; i += 2 - includeWidth)attrs["margin" + (which = cssExpand[i])] = attrs["padding" + which] = type;
        return includeWidth && (attrs.opacity = attrs.width = type), attrs;
    }
    function getWindow(elem) {
        return jQuery.isWindow(elem) ? elem : 9 === elem.nodeType && (elem.defaultView || elem.parentWindow);
    }
    jQuery.Animation = jQuery.extend(Animation, {
        tweener: function(props, callback) {
            jQuery.isFunction(props) ? (callback = props, props = [
                "*"
            ]) : props = props.split(" ");
            for(var prop, index = 0, length = props.length; index < length; index++)tweeners[prop = props[index]] = tweeners[prop] || [], tweeners[prop].unshift(callback);
        },
        prefilter: function(callback, prepend) {
            prepend ? animationPrefilters.unshift(callback) : animationPrefilters.push(callback);
        }
    }), jQuery.Tween = Tween, Tween.prototype = {
        constructor: Tween,
        init: function(elem, options, prop, end, easing, unit) {
            this.elem = elem, this.prop = prop, this.easing = easing || "swing", this.options = options, this.start = this.now = this.cur(), this.end = end, this.unit = unit || (jQuery.cssNumber[prop] ? "" : "px");
        },
        cur: function() {
            var hooks = Tween.propHooks[this.prop];
            return hooks && hooks.get ? hooks.get(this) : Tween.propHooks._default.get(this);
        },
        run: function(percent) {
            var eased, hooks = Tween.propHooks[this.prop];
            return this.options.duration ? this.pos = eased = jQuery.easing[this.easing](percent, this.options.duration * percent, 0, 1, this.options.duration) : this.pos = eased = percent, this.now = (this.end - this.start) * eased + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), hooks && hooks.set ? hooks.set(this) : Tween.propHooks._default.set(this), this;
        }
    }, Tween.prototype.init.prototype = Tween.prototype, Tween.propHooks = {
        _default: {
            get: function(tween) {
                var result;
                return null == tween.elem[tween.prop] || tween.elem.style && null != tween.elem.style[tween.prop] ? (result = jQuery.css(tween.elem, tween.prop, "")) && "auto" !== result ? result : 0 : tween.elem[tween.prop];
            },
            set: function(tween) {
                jQuery.fx.step[tween.prop] ? jQuery.fx.step[tween.prop](tween) : tween.elem.style && (null != tween.elem.style[jQuery.cssProps[tween.prop]] || jQuery.cssHooks[tween.prop]) ? jQuery.style(tween.elem, tween.prop, tween.now + tween.unit) : tween.elem[tween.prop] = tween.now;
            }
        }
    }, Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
        set: function(tween) {
            tween.elem.nodeType && tween.elem.parentNode && (tween.elem[tween.prop] = tween.now);
        }
    }, jQuery.each([
        "toggle",
        "show",
        "hide"
    ], function(i, name) {
        var cssFn = jQuery.fn[name];
        jQuery.fn[name] = function(speed, easing, callback) {
            return null == speed || "boolean" == typeof speed ? cssFn.apply(this, arguments) : this.animate(genFx(name, !0), speed, easing, callback);
        };
    }), jQuery.fn.extend({
        fadeTo: function(speed, to, easing, callback) {
            return this.filter(isHidden).css("opacity", 0).show().end().animate({
                opacity: to
            }, speed, easing, callback);
        },
        animate: function(prop, speed, easing, callback) {
            var empty = jQuery.isEmptyObject(prop), optall = jQuery.speed(speed, easing, callback), doAnimation = function() {
                var anim = Animation(this, jQuery.extend({}, prop), optall);
                doAnimation.finish = function() {
                    anim.stop(!0);
                }, (empty || jQuery._data(this, "finish")) && anim.stop(!0);
            };
            return doAnimation.finish = doAnimation, empty || !1 === optall.queue ? this.each(doAnimation) : this.queue(optall.queue, doAnimation);
        },
        stop: function(type, clearQueue, gotoEnd) {
            var stopQueue = function(hooks) {
                var stop = hooks.stop;
                delete hooks.stop, stop(gotoEnd);
            };
            return "string" != typeof type && (gotoEnd = clearQueue, clearQueue = type, type = undefined), clearQueue && !1 !== type && this.queue(type || "fx", []), this.each(function() {
                var dequeue = !0, index = null != type && type + "queueHooks", timers = jQuery.timers, data = jQuery._data(this);
                if (index) data[index] && data[index].stop && stopQueue(data[index]);
                else for(index in data)data[index] && data[index].stop && rrun.test(index) && stopQueue(data[index]);
                for(index = timers.length; index--;)timers[index].elem === this && (null == type || timers[index].queue === type) && (timers[index].anim.stop(gotoEnd), dequeue = !1, timers.splice(index, 1));
                (dequeue || !gotoEnd) && jQuery.dequeue(this, type);
            });
        },
        finish: function(type) {
            return !1 !== type && (type = type || "fx"), this.each(function() {
                var index, data = jQuery._data(this), queue = data[type + "queue"], hooks = data[type + "queueHooks"], timers = jQuery.timers, length = queue ? queue.length : 0;
                for(data.finish = !0, jQuery.queue(this, type, []), hooks && hooks.cur && hooks.cur.finish && hooks.cur.finish.call(this), index = timers.length; index--;)timers[index].elem === this && timers[index].queue === type && (timers[index].anim.stop(!0), timers.splice(index, 1));
                for(index = 0; index < length; index++)queue[index] && queue[index].finish && queue[index].finish.call(this);
                delete data.finish;
            });
        }
    }), jQuery.each({
        slideDown: genFx("show"),
        slideUp: genFx("hide"),
        slideToggle: genFx("toggle"),
        fadeIn: {
            opacity: "show"
        },
        fadeOut: {
            opacity: "hide"
        },
        fadeToggle: {
            opacity: "toggle"
        }
    }, function(name, props) {
        jQuery.fn[name] = function(speed, easing, callback) {
            return this.animate(props, speed, easing, callback);
        };
    }), jQuery.speed = function(speed, easing, fn) {
        var opt = speed && "object" == typeof speed ? jQuery.extend({}, speed) : {
            complete: fn || !fn && easing || jQuery.isFunction(speed) && speed,
            duration: speed,
            easing: fn && easing || easing && !jQuery.isFunction(easing) && easing
        };
        return opt.duration = jQuery.fx.off ? 0 : "number" == typeof opt.duration ? opt.duration : opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[opt.duration] : jQuery.fx.speeds._default, (null == opt.queue || !0 === opt.queue) && (opt.queue = "fx"), opt.old = opt.complete, opt.complete = function() {
            jQuery.isFunction(opt.old) && opt.old.call(this), opt.queue && jQuery.dequeue(this, opt.queue);
        }, opt;
    }, jQuery.easing = {
        linear: function(p) {
            return p;
        },
        swing: function(p) {
            return 0.5 - Math.cos(p * Math.PI) / 2;
        }
    }, jQuery.timers = [], jQuery.fx = Tween.prototype.init, jQuery.fx.tick = function() {
        var timer, timers = jQuery.timers, i = 0;
        for(fxNow = jQuery.now(); i < timers.length; i++)(timer = timers[i])() || timers[i] !== timer || timers.splice(i--, 1);
        timers.length || jQuery.fx.stop(), fxNow = undefined;
    }, jQuery.fx.timer = function(timer) {
        timer() && jQuery.timers.push(timer) && jQuery.fx.start();
    }, jQuery.fx.interval = 13, jQuery.fx.start = function() {
        timerId || (timerId = setInterval(jQuery.fx.tick, jQuery.fx.interval));
    }, jQuery.fx.stop = function() {
        clearInterval(timerId), timerId = null;
    }, jQuery.fx.speeds = {
        slow: 600,
        fast: 200,
        _default: 400
    }, jQuery.fx.step = {}, jQuery.expr && jQuery.expr.filters && (jQuery.expr.filters.animated = function(elem) {
        return jQuery.grep(jQuery.timers, function(fn) {
            return elem === fn.elem;
        }).length;
    }), jQuery.fn.offset = function(options) {
        if (arguments.length) return options === undefined ? this : this.each(function(i) {
            jQuery.offset.setOffset(this, options, i);
        });
        var docElem, win, box = {
            top: 0,
            left: 0
        }, elem = this[0], doc = elem && elem.ownerDocument;
        return doc ? (docElem = doc.documentElement, jQuery.contains(docElem, elem)) ? (typeof elem.getBoundingClientRect !== core_strundefined && (box = elem.getBoundingClientRect()), win = getWindow(doc), {
            top: box.top + (win.pageYOffset || docElem.scrollTop) - (docElem.clientTop || 0),
            left: box.left + (win.pageXOffset || docElem.scrollLeft) - (docElem.clientLeft || 0)
        }) : box : void 0;
    }, jQuery.offset = {
        setOffset: function(elem, options, i) {
            var position = jQuery.css(elem, "position");
            "static" === position && (elem.style.position = "relative");
            var curTop, curLeft, curElem = jQuery(elem), curOffset = curElem.offset(), curCSSTop = jQuery.css(elem, "top"), curCSSLeft = jQuery.css(elem, "left"), calculatePosition = ("absolute" === position || "fixed" === position) && jQuery.inArray("auto", [
                curCSSTop,
                curCSSLeft
            ]) > -1, props = {}, curPosition = {};
            calculatePosition ? (curTop = (curPosition = curElem.position()).top, curLeft = curPosition.left) : (curTop = parseFloat(curCSSTop) || 0, curLeft = parseFloat(curCSSLeft) || 0), jQuery.isFunction(options) && (options = options.call(elem, i, curOffset)), null != options.top && (props.top = options.top - curOffset.top + curTop), null != options.left && (props.left = options.left - curOffset.left + curLeft), "using" in options ? options.using.call(elem, props) : curElem.css(props);
        }
    }, jQuery.fn.extend({
        position: function() {
            if (this[0]) {
                var offsetParent, offset, parentOffset = {
                    top: 0,
                    left: 0
                }, elem = this[0];
                return "fixed" === jQuery.css(elem, "position") ? offset = elem.getBoundingClientRect() : (offsetParent = this.offsetParent(), offset = this.offset(), jQuery.nodeName(offsetParent[0], "html") || (parentOffset = offsetParent.offset()), parentOffset.top += jQuery.css(offsetParent[0], "borderTopWidth", !0), parentOffset.left += jQuery.css(offsetParent[0], "borderLeftWidth", !0)), {
                    top: offset.top - parentOffset.top - jQuery.css(elem, "marginTop", !0),
                    left: offset.left - parentOffset.left - jQuery.css(elem, "marginLeft", !0)
                };
            }
        },
        offsetParent: function() {
            return this.map(function() {
                for(var offsetParent = this.offsetParent || document1.documentElement; offsetParent && !jQuery.nodeName(offsetParent, "html") && "static" === jQuery.css(offsetParent, "position");)offsetParent = offsetParent.offsetParent;
                return offsetParent || document1.documentElement;
            });
        }
    }), jQuery.each({
        scrollLeft: "pageXOffset",
        scrollTop: "pageYOffset"
    }, function(method1, prop) {
        var top = /Y/.test(prop);
        jQuery.fn[method1] = function(val2) {
            return jQuery.access(this, function(elem, method, val) {
                var win = getWindow(elem);
                if (val === undefined) return win ? prop in win ? win[prop] : win.document.documentElement[method] : elem[method];
                win ? win.scrollTo(top ? jQuery(win).scrollLeft() : val, top ? val : jQuery(win).scrollTop()) : elem[method] = val;
            }, method1, val2, arguments.length, null);
        };
    }), jQuery.each({
        Height: "height",
        Width: "width"
    }, function(name, type1) {
        jQuery.each({
            padding: "inner" + name,
            content: type1,
            "": "outer" + name
        }, function(defaultExtra, funcName) {
            jQuery.fn[funcName] = function(margin, value7) {
                var chainable = arguments.length && (defaultExtra || "boolean" != typeof margin), extra = defaultExtra || (!0 === margin || !0 === value7 ? "margin" : "border");
                return jQuery.access(this, function(elem, type, value) {
                    var doc;
                    return jQuery.isWindow(elem) ? elem.document.documentElement["client" + name] : 9 === elem.nodeType ? (doc = elem.documentElement, Math.max(elem.body["scroll" + name], doc["scroll" + name], elem.body["offset" + name], doc["offset" + name], doc["client" + name])) : value === undefined ? jQuery.css(elem, type, extra) : jQuery.style(elem, type, value, extra);
                }, type1, chainable ? margin : undefined, chainable, null);
            };
        });
    }), window1.jQuery = window1.$ = jQuery, "function" == typeof define && define.amd && define.amd.jQuery && define("jquery", [], function() {
        return jQuery;
    });
}(window);
