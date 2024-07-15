!/*!
 * jQuery JavaScript Library v1.9.1
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2012 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-2-4
 */ function(window1, undefined) {
    // Can't do this because several apps including ASP.NET trace
    // the stack via arguments.caller.callee and Firefox dies if
    // you try to trace through "use strict" call chains. (#13335)
    // Support: Firefox 18+
    //"use strict";
    var readyList, // A central reference to the root jQuery(document)
    rootjQuery, // Support: IE<9
    // For `typeof node.method` instead of `node.method !== undefined`
    core_strundefined = "undefined", // Use the correct document accordingly with window argument (sandbox)
    document = window1.document, location = window1.location, // Map over jQuery in case of overwrite
    _jQuery = window1.jQuery, // Map over the $ in case of overwrite
    _$ = window1.$, // [[Class]] -> type pairs
    class2type = {}, // List of deleted data cache ids, so we can reuse them
    core_deletedIds = [], core_version = "1.9.1", // Save a reference to some core methods
    core_concat = core_deletedIds.concat, core_push = core_deletedIds.push, core_slice = core_deletedIds.slice, core_indexOf = core_deletedIds.indexOf, core_toString = class2type.toString, core_hasOwn = class2type.hasOwnProperty, core_trim = core_version.trim, // Define a local copy of jQuery
    jQuery = function(selector, context) {
        // The jQuery object is actually just the init constructor 'enhanced'
        return new jQuery.fn.init(selector, context, rootjQuery);
    }, // Used for matching numbers
    core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source, // Used for splitting on whitespace
    core_rnotwhite = /\S+/g, // Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
    rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, // A simple way to check for HTML strings
    // Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
    // Strict HTML recognition (#11290: must start with <)
    rquickExpr = /^(?:(<[\w\W]+>)[^>]*|#([\w-]*))$/, // Match a standalone tag
    rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/, // JSON RegExp
    rvalidchars = /^[\],:{}\s]*$/, rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g, rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g, rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g, // Matches dashed string for camelizing
    rmsPrefix = /^-ms-/, rdashAlpha = /-([\da-z])/gi, // Used by jQuery.camelCase as callback to replace()
    fcamelCase = function(all, letter) {
        return letter.toUpperCase();
    }, // The ready event handler
    completed = function(event) {
        // readyState === "complete" is good enough for us to call the dom ready in oldIE
        (document.addEventListener || "load" === event.type || "complete" === document.readyState) && (detach(), jQuery.ready());
    }, // Clean-up method for dom ready events
    detach = function() {
        document.addEventListener ? (document.removeEventListener("DOMContentLoaded", completed, !1), window1.removeEventListener("load", completed, !1)) : (document.detachEvent("onreadystatechange", completed), window1.detachEvent("onload", completed));
    };
    function isArraylike(obj) {
        var length = obj.length, type = jQuery.type(obj);
        return !jQuery.isWindow(obj) && (1 === obj.nodeType && !!length || "array" === type || "function" !== type && (0 === length || "number" == typeof length && length > 0 && length - 1 in obj));
    }
    jQuery.fn = jQuery.prototype = {
        // The current version of jQuery being used
        jquery: core_version,
        constructor: jQuery,
        init: function(selector, context, rootjQuery) {
            var match, elem;
            // HANDLE: $(""), $(null), $(undefined), $(false)
            if (!selector) return this;
            // Handle HTML strings
            if ("string" == typeof selector) {
                // Match html or make sure no context is specified for #id
                if ((// Assume that strings that start and end with <> are HTML and skip the regex check
                match = "<" === selector.charAt(0) && ">" === selector.charAt(selector.length - 1) && selector.length >= 3 ? [
                    null,
                    selector,
                    null
                ] : rquickExpr.exec(selector)) && (match[1] || !context)) {
                    // HANDLE: $(html) -> $(array)
                    if (match[1]) {
                        // HANDLE: $(html, props)
                        if (context = context instanceof jQuery ? context[0] : context, // scripts is true for back-compat
                        jQuery.merge(this, jQuery.parseHTML(match[1], context && context.nodeType ? context.ownerDocument || context : document, !0)), rsingleTag.test(match[1]) && jQuery.isPlainObject(context)) for(match in context)// Properties of context are called as methods if possible
                        jQuery.isFunction(this[match]) ? this[match](context[match]) : this.attr(match, context[match]);
                        return this;
                    // HANDLE: $(#id)
                    }
                    // Check parentNode to catch when Blackberry 4.6 returns
                    // nodes that are no longer in the document #6963
                    if ((elem = document.getElementById(match[2])) && elem.parentNode) {
                        // Handle the case where IE and Opera return items
                        // by name instead of ID
                        if (elem.id !== match[2]) return rootjQuery.find(selector);
                        // Otherwise, we inject the element directly into the jQuery object
                        this.length = 1, this[0] = elem;
                    }
                    return this.context = document, this.selector = selector, this;
                // HANDLE: $(expr, $(...))
                }
                return !context || context.jquery ? (context || rootjQuery).find(selector) : this.constructor(context).find(selector);
            // HANDLE: $(DOMElement)
            }
            return selector.nodeType ? (this.context = this[0] = selector, this.length = 1, this) : jQuery.isFunction(selector) ? rootjQuery.ready(selector) : (selector.selector !== undefined && (this.selector = selector.selector, this.context = selector.context), jQuery.makeArray(selector, this));
        },
        // Start with an empty selector
        selector: "",
        // The default length of a jQuery object is 0
        length: 0,
        // The number of elements contained in the matched element set
        size: function() {
            return this.length;
        },
        toArray: function() {
            return core_slice.call(this);
        },
        // Get the Nth element in the matched element set OR
        // Get the whole matched element set as a clean array
        get: function(num) {
            return null == num ? this.toArray() : num < 0 ? this[this.length + num] : this[num];
        },
        // Take an array of elements and push it onto the stack
        // (returning the new matched element set)
        pushStack: function(elems) {
            // Build a new jQuery matched element set
            var ret = jQuery.merge(this.constructor(), elems);
            // Return the newly-formed element set
            return(// Add the old object onto the stack (as a reference)
            ret.prevObject = this, ret.context = this.context, ret);
        },
        // Execute a callback for every element in the matched set.
        // (You can seed the arguments with an array of args, but this is
        // only used internally.)
        each: function(callback, args) {
            return jQuery.each(this, callback, args);
        },
        ready: function(fn) {
            return(// Add the callback
            jQuery.ready.promise().done(fn), this);
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
        // For internal use only.
        // Behaves like an Array's method, not like a jQuery method.
        push: core_push,
        sort: [].sort,
        splice: [].splice
    }, // Give the init function the jQuery prototype for later instantiation
    jQuery.fn.init.prototype = jQuery.fn, jQuery.extend = jQuery.fn.extend = function() {
        var src, copyIsArray, copy, name1, options, clone, target = arguments[0] || {}, i = 1, length = arguments.length, deep = !1;
        for("boolean" == typeof target && (deep = target, target = arguments[1] || {}, // skip the boolean and the target
        i = 2), "object" == typeof target || jQuery.isFunction(target) || (target = {}), length === i && (target = this, --i); i < length; i++)// Only deal with non-null/undefined values
        if (null != (options = arguments[i])) // Extend the base object
        for(name1 in options)// Prevent never-ending loop
        src = target[name1], target !== (copy = options[name1]) && (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy))) ? (copyIsArray ? (copyIsArray = !1, clone = src && jQuery.isArray(src) ? src : []) : clone = src && jQuery.isPlainObject(src) ? src : {}, // Never move original objects, clone them
        target[name1] = jQuery.extend(deep, clone, copy)) : undefined !== copy && (target[name1] = copy));
        // Return the modified object
        return target;
    }, jQuery.extend({
        noConflict: function(deep) {
            return window1.$ === jQuery && (window1.$ = _$), deep && window1.jQuery === jQuery && (window1.jQuery = _jQuery), jQuery;
        },
        // Is the DOM ready to be used? Set to true once it occurs.
        isReady: !1,
        // A counter to track how many items to wait for before
        // the ready event fires. See #6781
        readyWait: 1,
        // Hold (or release) the ready event
        holdReady: function(hold) {
            hold ? jQuery.readyWait++ : jQuery.ready(!0);
        },
        // Handle when the DOM is ready
        ready: function(wait) {
            // Abort if there are pending holds or we're already ready
            if (!(!0 === wait ? --jQuery.readyWait : jQuery.isReady)) {
                // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
                if (!document.body) return setTimeout(jQuery.ready);
                // If a normal DOM Ready event fired, decrement, and wait if need be
                // Remember that the DOM is ready
                jQuery.isReady = !0, !(!0 !== wait && --jQuery.readyWait > 0) && (// If there are functions bound, to execute
                readyList.resolveWith(document, [
                    jQuery
                ]), jQuery.fn.trigger && jQuery(document).trigger("ready").off("ready"));
            }
        },
        // See test/unit/core.js for details concerning isFunction.
        // Since version 1.3, DOM methods and functions like alert
        // aren't supported. They return false on IE (#2968).
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
            // Must be an Object.
            // Because of IE, we also have to check the presence of the constructor property.
            // Make sure that DOM nodes and window objects don't pass through, as well
            if (!obj || "object" !== jQuery.type(obj) || obj.nodeType || jQuery.isWindow(obj)) return !1;
            try {
                // Not own constructor property must be Object
                if (obj.constructor && !core_hasOwn.call(obj, "constructor") && !core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) return !1;
            } catch (e) {
                // IE8,9 Will throw exceptions on certain host objects #9897
                return !1;
            }
            for(key in obj);
            return undefined === key || core_hasOwn.call(obj, key);
        },
        isEmptyObject: function(obj) {
            var name1;
            for(name1 in obj)return !1;
            return !0;
        },
        error: function(msg) {
            throw Error(msg);
        },
        // data: string of html
        // context (optional): If specified, the fragment will be created in this context, defaults to document
        // keepScripts (optional): If true, will include scripts passed in the html string
        parseHTML: function(data, context, keepScripts) {
            if (!data || "string" != typeof data) return null;
            "boolean" == typeof context && (keepScripts = context, context = !1), context = context || document;
            var parsed = rsingleTag.exec(data), scripts = !keepScripts && [];
            return(// Single tag
            parsed ? [
                context.createElement(parsed[1])
            ] : (parsed = jQuery.buildFragment([
                data
            ], context, scripts), scripts && jQuery(scripts).remove(), jQuery.merge([], parsed.childNodes)));
        },
        parseJSON: function(data) {
            return(// Attempt to parse using the native JSON parser first
            window1.JSON && window1.JSON.parse ? window1.JSON.parse(data) : null === data ? data : "string" == typeof data && // Make sure leading/trailing whitespace is removed (IE can't handle it)
            (data = jQuery.trim(data)) && rvalidchars.test(data.replace(rvalidescape, "@").replace(rvalidtokens, "]").replace(rvalidbraces, "")) ? Function("return " + data)() : void jQuery.error("Invalid JSON: " + data));
        },
        // Cross-browser xml parsing
        parseXML: function(data) {
            var xml;
            if (!data || "string" != typeof data) return null;
            try {
                window1.DOMParser ? xml = new DOMParser().parseFromString(data, "text/xml") : (// IE
                (xml = new ActiveXObject("Microsoft.XMLDOM")).async = "false", xml.loadXML(data));
            } catch (e) {
                xml = undefined;
            }
            return xml && xml.documentElement && !xml.getElementsByTagName("parsererror").length || jQuery.error("Invalid XML: " + data), xml;
        },
        noop: function() {},
        // Evaluates a script in a global context
        // Workarounds based on findings by Jim Driscoll
        // http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
        globalEval: function(data) {
            data && jQuery.trim(data) && // We use execScript on Internet Explorer
            // We use an anonymous function so that context is window
            // rather than jQuery in Firefox
            (window1.execScript || function(data) {
                window1.eval.call(window1, data);
            })(data);
        },
        // Convert dashed to camelCase; used by the css and data modules
        // Microsoft forgot to hump their vendor prefix (#9572)
        camelCase: function(string) {
            return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase);
        },
        nodeName: function(elem, name1) {
            return elem.nodeName && elem.nodeName.toLowerCase() === name1.toLowerCase();
        },
        // args is for internal usage only
        each: function(obj, callback, args) {
            var value, i = 0, length = obj.length, isArray = isArraylike(obj);
            if (args) {
                if (isArray) for(; i < length && !1 !== callback.apply(obj[i], args); i++);
                else for(i in obj)if (!1 === callback.apply(obj[i], args)) break;
            } else if (isArray) for(; i < length && !1 !== callback.call(obj[i], i, obj[i]); i++);
            else for(i in obj)if (!1 === callback.call(obj[i], i, obj[i])) break;
            return obj;
        },
        // Use native String.trim function wherever possible
        trim: core_trim && !core_trim.call("\uFEFF\xA0") ? function(text) {
            return null == text ? "" : core_trim.call(text);
        } : function(text) {
            return null == text ? "" : (text + "").replace(rtrim, "");
        },
        // results is for internal usage only
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
                for(len = arr.length, i = i ? i < 0 ? Math.max(0, len + i) : i : 0; i < len; i++)// Skip accessing in sparse arrays
                if (i in arr && arr[i] === elem) return i;
            }
            return -1;
        },
        merge: function(first, second) {
            var l = second.length, i = first.length, j = 0;
            if ("number" == typeof l) for(; j < l; j++)first[i++] = second[j];
            else for(; second[j] !== undefined;)first[i++] = second[j++];
            return first.length = i, first;
        },
        grep: function(elems, callback, inv) {
            var ret = [], i = 0, length = elems.length;
            // Go through the array, only saving the items
            // that pass the validator function
            for(inv = !!inv; i < length; i++)!!callback(elems[i], i) !== inv && ret.push(elems[i]);
            return ret;
        },
        // arg is for internal usage only
        map: function(elems, callback, arg) {
            var value, i = 0, length = elems.length, isArray = isArraylike(elems), ret = [];
            // Go through the array, translating each of the items to their
            if (isArray) for(; i < length; i++)null != (value = callback(elems[i], i, arg)) && (ret[ret.length] = value);
            else for(i in elems)null != (value = callback(elems[i], i, arg)) && (ret[ret.length] = value);
            // Flatten any nested arrays
            return core_concat.apply([], ret);
        },
        // A global GUID counter for objects
        guid: 1,
        // Bind a function to a context, optionally partially applying any
        // arguments.
        proxy: function(fn, context) {
            var args, proxy, tmp;
            return(// Quick check to determine if target is callable, in the spec
            // this throws a TypeError, but we will just return undefined.
            ("string" == typeof context && (tmp = fn[context], context = fn, fn = tmp), jQuery.isFunction(fn)) ? (// Simulated bind
            args = core_slice.call(arguments, 2), // Set the guid of unique handler to the same of original handler, so it can be removed
            (proxy = function() {
                return fn.apply(context || this, args.concat(core_slice.call(arguments)));
            }).guid = fn.guid = fn.guid || jQuery.guid++, proxy) : undefined);
        },
        // Multifunctional method to get and set values of a collection
        // The value/s can optionally be executed if it's a function
        access: function(elems, fn, key, value, chainable, emptyGet, raw) {
            var i = 0, length = elems.length, bulk = null == key;
            // Sets many values
            if ("object" === jQuery.type(key)) for(i in chainable = !0, key)jQuery.access(elems, fn, i, key[i], !0, emptyGet, raw);
            else if (undefined !== value && (chainable = !0, jQuery.isFunction(value) || (raw = !0), bulk && (raw ? (fn.call(elems, value), fn = null) : (bulk = fn, fn = function(elem, key, value) {
                return bulk.call(jQuery(elem), value);
            })), fn)) for(; i < length; i++)fn(elems[i], key, raw ? value : value.call(elems[i], i, fn(elems[i], key)));
            return chainable ? elems : bulk ? fn.call(elems) : length ? fn(elems[0], key) : emptyGet;
        },
        now: function() {
            return new Date().getTime();
        }
    }), jQuery.ready.promise = function(obj) {
        if (!readyList) {
            // Catch cases where $(document).ready() is called after the browser event has already occurred.
            // we once tried to use readyState "interactive" here, but it caused issues like the one
            // discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
            if (readyList = jQuery.Deferred(), "complete" === document.readyState) // Handle it asynchronously to allow scripts the opportunity to delay ready
            setTimeout(jQuery.ready);
            else if (document.addEventListener) // Use the handy event callback
            document.addEventListener("DOMContentLoaded", completed, !1), // A fallback to window.onload, that will always work
            window1.addEventListener("load", completed, !1);
            else {
                // Ensure firing before onload, maybe late but safe also for iframes
                document.attachEvent("onreadystatechange", completed), // A fallback to window.onload, that will always work
                window1.attachEvent("onload", completed);
                // If IE and not a frame
                // continually check to see if the document is ready
                var top = !1;
                try {
                    top = null == window1.frameElement && document.documentElement;
                } catch (e) {}
                top && top.doScroll && function doScrollCheck() {
                    if (!jQuery.isReady) {
                        try {
                            // Use the trick by Diego Perini
                            // http://javascript.nwbox.com/IEContentLoaded/
                            top.doScroll("left");
                        } catch (e) {
                            return setTimeout(doScrollCheck, 50);
                        }
                        // detach all dom ready events
                        detach(), // and execute any waiting functions
                        jQuery.ready();
                    }
                }();
            }
        }
        return readyList.promise(obj);
    }, // Populate the class2type map
    jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name1) {
        class2type["[object " + name1 + "]"] = name1.toLowerCase();
    }), // All jQuery objects should point back to these
    rootjQuery = jQuery(document);
    // String to Object options format cache
    var optionsCache = {};
    /*
   * Create a callback list using the following parameters:
   *
   *	options: an optional list of space-separated options that will change how
   *			the callback list behaves or a more traditional option object
   *
   * By default a callback list will act like an event callback list and can be
   * "fired" multiple times.
   *
   * Possible options:
   *
   *	once:			will ensure the callback list can only be fired once (like a Deferred)
   *
   *	memory:			will keep track of previous values and will call any callback added
   *					after the list has been fired right away with the latest "memorized"
   *					values (like a Deferred)
   *
   *	unique:			will ensure a callback can only be added once (no duplicate in the list)
   *
   *	stopOnFalse:	interrupt callings when a callback returns false
   *
   */ jQuery.Callbacks = function(options) {
        // Convert options from String-formatted to Object-formatted if needed
        // (we check in cache first)
        options = "string" == typeof options ? optionsCache[options] || (object = optionsCache[options1 = options] = {}, jQuery.each(options1.match(core_rnotwhite) || [], function(_, flag) {
            object[flag] = !0;
        }), object) : jQuery.extend({}, options);
        var options1, object, firing, // Last fire value (for non-forgettable lists)
        memory, // Flag to know if list was already fired
        fired, // End of the loop when firing
        firingLength, // Index of currently firing callback (modified by remove if needed)
        firingIndex, // First callback to fire (used internally by add and fireWith)
        firingStart, // Actual callback list
        list = [], // Stack of fire calls for repeatable lists
        stack = !options.once && [], // Fire callbacks
        fire = function(data) {
            for(memory = options.memory && data, fired = !0, firingIndex = firingStart || 0, firingStart = 0, firingLength = list.length, firing = !0; list && firingIndex < firingLength; firingIndex++)if (!1 === list[firingIndex].apply(data[0], data[1]) && options.stopOnFalse) {
                memory = !1; // To prevent further calls using add
                break;
            }
            firing = !1, list && (stack ? stack.length && fire(stack.shift()) : memory ? list = [] : self.disable());
        }, // Actual Callbacks object
        self = {
            // Add a callback or a collection of callbacks to the list
            add: function() {
                if (list) {
                    // First, we save the current length
                    var start = list.length;
                    (function add(args) {
                        jQuery.each(args, function(_, arg) {
                            var type = jQuery.type(arg);
                            "function" === type ? options.unique && self.has(arg) || list.push(arg) : arg && arg.length && "string" !== type && // Inspect recursively
                            add(arg);
                        });
                    })(arguments), firing ? firingLength = list.length : memory && (firingStart = start, fire(memory));
                }
                return this;
            },
            // Remove a callback from the list
            remove: function() {
                return list && jQuery.each(arguments, function(_, arg) {
                    for(var index; (index = jQuery.inArray(arg, list, index)) > -1;)list.splice(index, 1), firing && (index <= firingLength && firingLength--, index <= firingIndex && firingIndex--);
                }), this;
            },
            // Check if a given callback is in the list.
            // If no argument is given, return whether or not list has callbacks attached.
            has: function(fn) {
                return fn ? jQuery.inArray(fn, list) > -1 : !!(list && list.length);
            },
            // Remove all callbacks from the list
            empty: function() {
                return list = [], this;
            },
            // Have the list do nothing anymore
            disable: function() {
                return list = stack = memory = undefined, this;
            },
            // Is it disabled?
            disabled: function() {
                return !list;
            },
            // Lock the list in its current state
            lock: function() {
                return stack = undefined, memory || self.disable(), this;
            },
            // Is it locked?
            locked: function() {
                return !stack;
            },
            // Call all callbacks with the given context and arguments
            fireWith: function(context, args) {
                return args = [
                    context,
                    (args = args || []).slice ? args.slice() : args
                ], list && (!fired || stack) && (firing ? stack.push(args) : fire(args)), this;
            },
            // Call all the callbacks with the given arguments
            fire: function() {
                return self.fireWith(this, arguments), this;
            },
            // To know if the callbacks have already been called at least once
            fired: function() {
                return !!fired;
            }
        };
        return self;
    }, jQuery.extend({
        Deferred: function(func) {
            var tuples = [
                // action, add listener, listener list, final state
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
                            // deferred[ done | fail | progress ] for forwarding actions to newDefer
                            deferred[tuple[1]](function() {
                                var returned = fn && fn.apply(this, arguments);
                                returned && jQuery.isFunction(returned.promise) ? returned.promise().done(newDefer.resolve).fail(newDefer.reject).progress(newDefer.notify) : newDefer[action + "With"](this === promise ? newDefer.promise() : this, fn ? [
                                    returned
                                ] : arguments);
                            });
                        }), fns = null;
                    }).promise();
                },
                // Get a promise for this deferred
                // If obj is provided, the promise aspect is added to the object
                promise: function(obj) {
                    return null != obj ? jQuery.extend(obj, promise) : promise;
                }
            }, deferred = {};
            // All done!
            return(// Keep pipe for back-compat
            promise.pipe = promise.then, // Add list-specific methods
            jQuery.each(tuples, function(i, tuple) {
                var list = tuple[2], stateString = tuple[3];
                // promise[ done | fail | progress ] = list.add
                promise[tuple[1]] = list.add, stateString && list.add(function() {
                    // state = [ resolved | rejected ]
                    state = stateString;
                // [ reject_list | resolve_list ].disable; progress_list.lock
                }, tuples[1 ^ i][2].disable, tuples[2][2].lock), // deferred[ resolve | reject | notify ]
                deferred[tuple[0]] = function() {
                    return deferred[tuple[0] + "With"](this === deferred ? promise : this, arguments), this;
                }, deferred[tuple[0] + "With"] = list.fireWith;
            }), // Make the deferred a promise
            promise.promise(deferred), func && func.call(deferred, deferred), deferred);
        },
        // Deferred helper
        when: function(subordinate /* , ..., subordinateN */ ) {
            var progressValues, progressContexts, resolveContexts, i = 0, resolveValues = core_slice.call(arguments), length = resolveValues.length, // the count of uncompleted subordinates
            remaining = 1 !== length || subordinate && jQuery.isFunction(subordinate.promise) ? length : 0, // the master Deferred. If resolveValues consist of only a single Deferred, just use that.
            deferred = 1 === remaining ? subordinate : jQuery.Deferred(), // Update function for both resolve and progress values
            updateFunc = function(i, contexts, values) {
                return function(value) {
                    contexts[i] = this, values[i] = arguments.length > 1 ? core_slice.call(arguments) : value, values === progressValues ? deferred.notifyWith(contexts, values) : --remaining || deferred.resolveWith(contexts, values);
                };
            };
            // add listeners to Deferred subordinates; treat others as resolved
            if (length > 1) for(progressValues = Array(length), progressContexts = Array(length), resolveContexts = Array(length); i < length; i++)resolveValues[i] && jQuery.isFunction(resolveValues[i].promise) ? resolveValues[i].promise().done(updateFunc(i, resolveContexts, resolveValues)).fail(deferred.reject).progress(updateFunc(i, progressContexts, progressValues)) : --remaining;
            return remaining || deferred.resolveWith(resolveContexts, resolveValues), deferred.promise();
        }
    }), jQuery.support = function() {
        var support, all, a, input, select, fragment, opt, eventName, isSupported, i, div = document.createElement("div");
        if (// Setup
        div.setAttribute("className", "t"), div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", // Support tests won't run in some limited or non-browser environments
        all = div.getElementsByTagName("*"), a = div.getElementsByTagName("a")[0], !all || !a || !all.length) return {};
        opt = // First batch of tests
        (select = document.createElement("select")).appendChild(document.createElement("option")), input = div.getElementsByTagName("input")[0], a.style.cssText = "top:1px;float:left;opacity:.5", support = {
            // Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
            getSetAttribute: "t" !== div.className,
            // IE strips leading whitespace when .innerHTML is used
            leadingWhitespace: 3 === div.firstChild.nodeType,
            // Make sure that tbody elements aren't automatically inserted
            // IE will insert them into empty tables
            tbody: !div.getElementsByTagName("tbody").length,
            // Make sure that link elements get serialized correctly by innerHTML
            // This requires a wrapper element in IE
            htmlSerialize: !!div.getElementsByTagName("link").length,
            // Get the style information from getAttribute
            // (IE uses .cssText instead)
            style: /top/.test(a.getAttribute("style")),
            // Make sure that URLs aren't manipulated
            // (IE normalizes it by default)
            hrefNormalized: "/a" === a.getAttribute("href"),
            // Make sure that element opacity exists
            // (IE uses filter instead)
            // Use a regex to work around a WebKit issue. See #5145
            opacity: /^0.5/.test(a.style.opacity),
            // Verify style float existence
            // (IE uses styleFloat instead of cssFloat)
            cssFloat: !!a.style.cssFloat,
            // Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
            checkOn: !!input.value,
            // Make sure that a selected-by-default option has a working selected property.
            // (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
            optSelected: opt.selected,
            // Tests for enctype support on a form (#6743)
            enctype: !!document.createElement("form").enctype,
            // Makes sure cloning an html5 element does not cause problems
            // Where outerHTML is undefined, this still works
            html5Clone: "<:nav></:nav>" !== document.createElement("nav").cloneNode(!0).outerHTML,
            // jQuery.support.boxModel DEPRECATED in 1.8 since we don't support Quirks Mode
            boxModel: "CSS1Compat" === document.compatMode,
            // Will be defined later
            deleteExpando: !0,
            noCloneEvent: !0,
            inlineBlockNeedsLayout: !1,
            shrinkWrapBlocks: !1,
            reliableMarginRight: !0,
            boxSizingReliable: !0,
            pixelPosition: !1
        }, // Make sure checked status is properly cloned
        input.checked = !0, support.noCloneChecked = input.cloneNode(!0).checked, // Make sure that the options inside disabled selects aren't marked as disabled
        // (WebKit marks them as disabled)
        select.disabled = !0, support.optDisabled = !opt.disabled;
        // Support: IE<9
        try {
            delete div.test;
        } catch (e) {
            support.deleteExpando = !1;
        }
        // Support: IE<9 (lack submit/change bubble), Firefox 17+ (lack focusin event)
        // Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP), test/csp.php
        for(i in // Check if we can trust getAttribute("value")
        (input = document.createElement("input")).setAttribute("value", ""), support.input = "" === input.getAttribute("value"), // Check if an input maintains its value after becoming a radio
        input.value = "t", input.setAttribute("type", "radio"), support.radioValue = "t" === input.value, // #11217 - WebKit loses check when the name is after the checked attribute
        input.setAttribute("checked", "t"), input.setAttribute("name", "t"), (fragment = document.createDocumentFragment()).appendChild(input), // Check if a disconnected checkbox will retain its checked
        // value of true after appended to the DOM (IE6/7)
        support.appendChecked = input.checked, // WebKit doesn't clone checked state correctly in fragments
        support.checkClone = fragment.cloneNode(!0).cloneNode(!0).lastChild.checked, div.attachEvent && (div.attachEvent("onclick", function() {
            support.noCloneEvent = !1;
        }), div.cloneNode(!0).click()), {
            submit: !0,
            change: !0,
            focusin: !0
        })div.setAttribute(eventName = "on" + i, "t"), support[i + "Bubbles"] = eventName in window1 || !1 === div.attributes[eventName].expando;
        return div.style.backgroundClip = "content-box", div.cloneNode(!0).style.backgroundClip = "", support.clearCloneStyle = "content-box" === div.style.backgroundClip, // Run tests that need a body at doc ready
        jQuery(function() {
            var container, marginDiv, tds, divReset = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;", body = document.getElementsByTagName("body")[0];
            body && ((container = document.createElement("div")).style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px", body.appendChild(container).appendChild(div), // Support: IE8
            // Check if table cells still have offsetWidth/Height when they are set
            // to display:none and there are still other visible table cells in a
            // table row; if so, offsetWidth/Height are not reliable for use when
            // determining if an element has been hidden directly using
            // display:none (it is still safe to use offsets if a parent element is
            // hidden; don safety goggles and see bug #4512 for more information).
            div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", (tds = div.getElementsByTagName("td"))[0].style.cssText = "padding:0;margin:0;border:0;display:none", isSupported = 0 === tds[0].offsetHeight, tds[0].style.display = "", tds[1].style.display = "none", // Support: IE8
            // Check if empty table cells still have offsetWidth/Height
            support.reliableHiddenOffsets = isSupported && 0 === tds[0].offsetHeight, // Check box-sizing and margin behavior
            div.innerHTML = "", div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;", support.boxSizing = 4 === div.offsetWidth, support.doesNotIncludeMarginInBodyOffset = 1 !== body.offsetTop, window1.getComputedStyle && (support.pixelPosition = "1%" !== (window1.getComputedStyle(div, null) || {}).top, support.boxSizingReliable = "4px" === (window1.getComputedStyle(div, null) || {
                width: "4px"
            }).width, // Check if div with explicit width and no margin-right incorrectly
            // gets computed margin-right based on width of container. (#3333)
            // Fails in WebKit before Feb 2011 nightlies
            // WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
            (marginDiv = div.appendChild(document.createElement("div"))).style.cssText = div.style.cssText = divReset, marginDiv.style.marginRight = marginDiv.style.width = "0", div.style.width = "1px", support.reliableMarginRight = !parseFloat((window1.getComputedStyle(marginDiv, null) || {}).marginRight)), typeof div.style.zoom !== core_strundefined && (// Support: IE<8
            // Check if natively block-level elements act like inline-block
            // elements when setting their display to 'inline' and giving
            // them layout
            div.innerHTML = "", div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1", support.inlineBlockNeedsLayout = 3 === div.offsetWidth, // Support: IE6
            // Check if elements with layout shrink-wrap their children
            div.style.display = "block", div.innerHTML = "<div></div>", div.firstChild.style.width = "5px", support.shrinkWrapBlocks = 3 !== div.offsetWidth, support.inlineBlockNeedsLayout && // Prevent IE 6 from affecting layout for positioned elements #11048
            // Prevent IE from shrinking the body in IE 7 mode #12869
            // Support: IE<8
            (body.style.zoom = 1)), body.removeChild(container), div = null);
        }), // Null elements to avoid leaks in IE
        all = select = fragment = opt = a = input = null, support;
    }();
    var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/, rmultiDash = /([A-Z])/g;
    function internalData(elem, name1, data, pvt /* Internal Use Only */ ) {
        if (jQuery.acceptData(elem)) {
            var thisCache, ret, internalKey = jQuery.expando, getByName = "string" == typeof name1, // We have to handle DOM nodes and JS objects differently because IE6-7
            // can't GC object references properly across the DOM-JS boundary
            isNode = elem.nodeType, // Only DOM nodes need the global jQuery cache; JS object data is
            // attached directly to the object so GC can occur automatically
            cache = isNode ? jQuery.cache : elem, // Only defining an ID for JS objects if its cache already exists allows
            // the code to shortcut on the same path as a DOM node with no cache
            id = isNode ? elem[internalKey] : elem[internalKey] && internalKey;
            // Avoid doing any more work than we need to when trying to get data on an
            // object that has no data at all
            if (id && cache[id] && (pvt || cache[id].data) || !getByName || undefined !== data) return id || (isNode ? elem[internalKey] = id = core_deletedIds.pop() || jQuery.guid++ : id = internalKey), cache[id] || (cache[id] = {}, isNode || (cache[id].toJSON = jQuery.noop)), ("object" == typeof name1 || "function" == typeof name1) && (pvt ? cache[id] = jQuery.extend(cache[id], name1) : cache[id].data = jQuery.extend(cache[id].data, name1)), thisCache = cache[id], pvt || (thisCache.data || (thisCache.data = {}), thisCache = thisCache.data), undefined !== data && (thisCache[jQuery.camelCase(name1)] = data), getByName ? null == // First Try to find as-is property data
            (ret = thisCache[name1]) && // Try to find the camelCased property
            (ret = thisCache[jQuery.camelCase(name1)]) : ret = thisCache, ret;
        }
    }
    function internalRemoveData(elem, name1, pvt) {
        if (!!jQuery.acceptData(elem)) {
            var i, l, thisCache, isNode = elem.nodeType, // See jQuery.data for more information
            cache = isNode ? jQuery.cache : elem, id = isNode ? elem[jQuery.expando] : jQuery.expando;
            // If there is already no cache entry for this object, there is no
            // purpose in continuing
            if (cache[id]) {
                if (name1 && (thisCache = pvt ? cache[id] : cache[id].data)) {
                    for(i = 0, l = (// If "name" is an array of keys...
                    // When data is initially created, via ("key", "val") signature,
                    // keys will be converted to camelCase.
                    // Since there is no way to tell _how_ a key was added, remove
                    // both plain key and camelCase key. #12786
                    // This will only penalize the array argument path.
                    name1 = jQuery.isArray(name1) ? name1.concat(jQuery.map(name1, jQuery.camelCase)) : (name1 in thisCache) ? [
                        name1
                    ] : (// split the camel cased version by spaces unless a key with the spaces exists
                    (name1 = jQuery.camelCase(name1)) in thisCache) ? [
                        name1
                    ] : name1.split(" ")).length; i < l; i++)delete thisCache[name1[i]];
                    // If there is no data left in the cache, we want to continue
                    // and let the cache object itself get destroyed
                    if (!(pvt ? isEmptyDataObject : jQuery.isEmptyObject)(thisCache)) return;
                }
                // See jQuery.data for more information
                (pvt || (delete cache[id].data, isEmptyDataObject(cache[id]))) && (isNode ? jQuery.cleanData([
                    elem
                ], !0) : jQuery.support.deleteExpando || cache != cache.window ? delete cache[id] : cache[id] = null);
            }
        }
    }
    function dataAttr(elem, key, data) {
        // If nothing was found internally, try to fetch any
        // data from the HTML5 data-* attribute
        if (undefined === data && 1 === elem.nodeType) {
            var name1 = "data-" + key.replace(rmultiDash, "-$1").toLowerCase();
            if ("string" == typeof (data = elem.getAttribute(name1))) {
                try {
                    data = "true" === data || "false" !== data && ("null" === data ? null : +data + "" === data ? +data : rbrace.test(data) ? jQuery.parseJSON(data) : data);
                } catch (e) {}
                // Make sure we set the data so it isn't changed later
                jQuery.data(elem, key, data);
            } else data = undefined;
        }
        return data;
    }
    // checks a cache object for emptiness
    function isEmptyDataObject(obj) {
        var name1;
        for(name1 in obj)// if the public data object is empty, the private is still empty
        if (!("data" === name1 && jQuery.isEmptyObject(obj[name1])) && "toJSON" !== name1) return !1;
        return !0;
    }
    jQuery.extend({
        cache: {},
        // Unique for each copy of jQuery on the page
        // Non-digits removed to match rinlinejQuery
        expando: "jQuery" + (core_version + Math.random()).replace(/\D/g, ""),
        // The following elements throw uncatchable exceptions if you
        // attempt to add expando properties to them.
        noData: {
            embed: !0,
            // Ban all objects except for Flash (which handle expandos)
            object: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
            applet: !0
        },
        hasData: function(elem) {
            return !!(elem = elem.nodeType ? jQuery.cache[elem[jQuery.expando]] : elem[jQuery.expando]) && !isEmptyDataObject(elem);
        },
        data: function(elem, name1, data) {
            return internalData(elem, name1, data);
        },
        removeData: function(elem, name1) {
            return internalRemoveData(elem, name1);
        },
        // For internal use only.
        _data: function(elem, name1, data) {
            return internalData(elem, name1, data, !0);
        },
        _removeData: function(elem, name1) {
            return internalRemoveData(elem, name1, !0);
        },
        // A method for determining if a DOM node can handle the data expando
        acceptData: function(elem) {
            // Do not set data on non-element because it will not be cleared (#8335).
            if (elem.nodeType && 1 !== elem.nodeType && 9 !== elem.nodeType) return !1;
            var noData = elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()];
            // nodes accept data unless otherwise specified; rejection can be conditional
            return !noData || !0 !== noData && elem.getAttribute("classid") === noData;
        }
    }), jQuery.fn.extend({
        data: function(key, value) {
            var attrs, name1, elem = this[0], i = 0, data = null;
            // Gets all values
            if (undefined === key) {
                if (this.length && (data = jQuery.data(elem), 1 === elem.nodeType && !jQuery._data(elem, "parsedAttrs"))) {
                    for(attrs = elem.attributes; i < attrs.length; i++)(name1 = attrs[i].name).indexOf("data-") || dataAttr(elem, name1 = jQuery.camelCase(name1.slice(5)), data[name1]);
                    jQuery._data(elem, "parsedAttrs", !0);
                }
                return data;
            }
            return(// Sets multiple values
            "object" == typeof key ? this.each(function() {
                jQuery.data(this, key);
            }) : jQuery.access(this, function(value) {
                if (undefined === value) // Try to fetch any internally stored data first
                return elem ? dataAttr(elem, key, jQuery.data(elem, key)) : null;
                this.each(function() {
                    jQuery.data(this, key, value);
                });
            }, null, value, arguments.length > 1, null, !0));
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
            "inprogress" === fn && (fn = queue.shift(), startLength--), hooks.cur = fn, fn && ("fx" === type && queue.unshift("inprogress"), // clear up the last queue stop function
            delete hooks.stop, fn.call(elem, function() {
                jQuery.dequeue(elem, type);
            }, hooks)), !startLength && hooks && hooks.empty.fire();
        },
        // not intended for public consumption - generates a queueHooks object, or returns the current one
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
            return ("string" != typeof type && (data = type, type = "fx", setter--), arguments.length < setter) ? jQuery.queue(this[0], type) : undefined === data ? this : this.each(function() {
                var queue = jQuery.queue(this, type, data);
                // ensure a hooks for this queue
                jQuery._queueHooks(this, type), "fx" === type && "inprogress" !== queue[0] && jQuery.dequeue(this, type);
            });
        },
        dequeue: function(type) {
            return this.each(function() {
                jQuery.dequeue(this, type);
            });
        },
        // Based off of the plugin by Clint Helfers, with permission.
        // http://blindsignals.com/index.php/2009/07/jquery-delay/
        delay: function(time, type) {
            return time = jQuery.fx && jQuery.fx.speeds[time] || time, type = type || "fx", this.queue(type, function(next, hooks) {
                var timeout = setTimeout(next, time);
                hooks.stop = function() {
                    clearTimeout(timeout);
                };
            });
        },
        clearQueue: function(type) {
            return this.queue(type || "fx", []);
        },
        // Get a promise resolved when queues of a certain type
        // are emptied (fx is the type by default)
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
        attr: function(name1, value) {
            return jQuery.access(this, jQuery.attr, name1, value, arguments.length > 1);
        },
        removeAttr: function(name1) {
            return this.each(function() {
                jQuery.removeAttr(this, name1);
            });
        },
        prop: function(name1, value) {
            return jQuery.access(this, jQuery.prop, name1, value, arguments.length > 1);
        },
        removeProp: function(name1) {
            return name1 = jQuery.propFix[name1] || name1, this.each(function() {
                // try/catch handles cases where IE balks (such as removing a property on window)
                try {
                    this[name1] = undefined, delete this[name1];
                } catch (e) {}
            });
        },
        addClass: function(value) {
            var classes, elem, cur, clazz, j, i = 0, len = this.length, proceed = "string" == typeof value && value;
            if (jQuery.isFunction(value)) return this.each(function(j) {
                jQuery(this).addClass(value.call(this, j, this.className));
            });
            if (proceed) {
                for(// The disjunction here is for better compressibility (see removeClass)
                classes = (value || "").match(core_rnotwhite) || []; i < len; i++)if (cur = 1 === (elem = this[i]).nodeType && (elem.className ? (" " + elem.className + " ").replace(rclass, " ") : " ")) {
                    for(j = 0; clazz = classes[j++];)0 > cur.indexOf(" " + clazz + " ") && (cur += clazz + " ");
                    elem.className = jQuery.trim(cur);
                }
            }
            return this;
        },
        removeClass: function(value) {
            var classes, elem, cur, clazz, j, i = 0, len = this.length, proceed = 0 == arguments.length || "string" == typeof value && value;
            if (jQuery.isFunction(value)) return this.each(function(j) {
                jQuery(this).removeClass(value.call(this, j, this.className));
            });
            if (proceed) {
                for(classes = (value || "").match(core_rnotwhite) || []; i < len; i++)if (// This expression is here for better compressibility (see addClass)
                cur = 1 === (elem = this[i]).nodeType && (elem.className ? (" " + elem.className + " ").replace(rclass, " ") : "")) {
                    for(j = 0; clazz = classes[j++];)// Remove *all* instances
                    for(; cur.indexOf(" " + clazz + " ") >= 0;)cur = cur.replace(" " + clazz + " ", " ");
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
                if ("string" === type) for(// toggle individual class names
                var className, i = 0, self = jQuery(this), state = stateVal, classNames = value.match(core_rnotwhite) || []; className = classNames[i++];)// check each className given, space separated list
                state = isBool ? state : !self.hasClass(className), self[state ? "addClass" : "removeClass"](className);
                else (type === core_strundefined || "boolean" === type) && (this.className && // store className if set
                jQuery._data(this, "__className__", this.className), // If the element has a class name or if we're passed "false",
                // then remove the whole classname (if there was one, the above saved it).
                // Otherwise bring back whatever was previously saved (if anything),
                // falling back to the empty string if nothing was stored.
                this.className = this.className || !1 === value ? "" : jQuery._data(this, "__className__") || "");
            });
        },
        hasClass: function(selector) {
            for(var className = " " + selector + " ", i = 0, l = this.length; i < l; i++)if (1 === this[i].nodeType && (" " + this[i].className + " ").replace(rclass, " ").indexOf(className) >= 0) return !0;
            return !1;
        },
        val: function(value) {
            var ret, hooks, isFunction, elem = this[0];
            if (!arguments.length) return elem ? (hooks = jQuery.valHooks[elem.type] || jQuery.valHooks[elem.nodeName.toLowerCase()]) && "get" in hooks && (ret = hooks.get(elem, "value")) !== undefined ? ret : "string" == typeof (ret = elem.value) ? ret.replace(rreturn, "") : null == ret ? "" : ret : void 0;
            return isFunction = jQuery.isFunction(value), this.each(function(i) {
                var val, self = jQuery(this);
                1 === this.nodeType && (null == (val = isFunction ? value.call(this, i, self.val()) : value) ? val = "" : "number" == typeof val ? val += "" : jQuery.isArray(val) && (val = jQuery.map(val, function(value) {
                    return null == value ? "" : value + "";
                })), (hooks = jQuery.valHooks[this.type] || jQuery.valHooks[this.nodeName.toLowerCase()]) && "set" in hooks && hooks.set(this, val, "value") !== undefined || (this.value = val));
            });
        }
    }), jQuery.extend({
        valHooks: {
            option: {
                get: function(elem) {
                    // attributes.value is undefined in Blackberry 4.7 but
                    // uses .value. See #6932
                    var val = elem.attributes.value;
                    return !val || val.specified ? elem.value : elem.text;
                }
            },
            select: {
                get: function(elem) {
                    // Loop through all the selected options
                    for(var value, option, options = elem.options, index = elem.selectedIndex, one = "select-one" === elem.type || index < 0, values = one ? null : [], max = one ? index + 1 : options.length, i = index < 0 ? max : one ? index : 0; i < max; i++)// oldIE doesn't update selected after form reset (#2551)
                    if (((option = options[i]).selected || i === index) && // Don't return options that are disabled or in a disabled optgroup
                    (jQuery.support.optDisabled ? !option.disabled : null === option.getAttribute("disabled")) && (!option.parentNode.disabled || !jQuery.nodeName(option.parentNode, "optgroup"))) {
                        // We don't need an array for one selects
                        if (// Get the specific value for the option
                        value = jQuery(option).val(), one) return value;
                        // Multi-Selects return an array
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
        attr: function(elem, name1, value) {
            var hooks, notxml, ret, nType = elem.nodeType;
            // don't get/set attributes on text, comment and attribute nodes
            if (elem && 3 !== nType && 8 !== nType && 2 !== nType) {
                // Fallback to prop when attributes are not supported
                if (typeof elem.getAttribute === core_strundefined) return jQuery.prop(elem, name1, value);
                if ((notxml = 1 !== nType || !jQuery.isXMLDoc(elem)) && (name1 = name1.toLowerCase(), hooks = jQuery.attrHooks[name1] || (rboolean.test(name1) ? boolHook : nodeHook)), undefined !== value) {
                    if (null === value) jQuery.removeAttr(elem, name1);
                    else if (hooks && notxml && "set" in hooks && (ret = hooks.set(elem, value, name1)) !== undefined) return ret;
                    else return elem.setAttribute(name1, value + ""), value;
                } else if (hooks && notxml && "get" in hooks && null !== (ret = hooks.get(elem, name1))) return ret;
                else // Non-existent attributes return null, we normalize to undefined
                return typeof elem.getAttribute !== core_strundefined && (ret = elem.getAttribute(name1)), null == ret ? undefined : ret;
            }
        },
        removeAttr: function(elem, value) {
            var name1, propName, i = 0, attrNames = value && value.match(core_rnotwhite);
            if (attrNames && 1 === elem.nodeType) for(; name1 = attrNames[i++];)propName = jQuery.propFix[name1] || name1, rboolean.test(name1) ? !getSetAttribute && ruseDefault.test(name1) ? elem[jQuery.camelCase("default-" + name1)] = elem[propName] = !1 : elem[propName] = !1 : jQuery.attr(elem, name1, ""), elem.removeAttribute(getSetAttribute ? name1 : propName);
        },
        attrHooks: {
            type: {
                set: function(elem, value) {
                    if (!jQuery.support.radioValue && "radio" === value && jQuery.nodeName(elem, "input")) {
                        // Setting the type on a radio button after the value resets the value in IE6-9
                        // Reset value to default in case type is set after value during creation
                        var val = elem.value;
                        return elem.setAttribute("type", value), val && (elem.value = val), value;
                    }
                }
            }
        },
        propFix: {
            tabindex: "tabIndex",
            readonly: "readOnly",
            for: "htmlFor",
            class: "className",
            maxlength: "maxLength",
            cellspacing: "cellSpacing",
            cellpadding: "cellPadding",
            rowspan: "rowSpan",
            colspan: "colSpan",
            usemap: "useMap",
            frameborder: "frameBorder",
            contenteditable: "contentEditable"
        },
        prop: function(elem, name1, value) {
            var ret, hooks, nType = elem.nodeType;
            // don't get/set properties on text, comment and attribute nodes
            if (elem && 3 !== nType && 8 !== nType && 2 !== nType) return (1 === nType && jQuery.isXMLDoc(elem) || (// Fix name and attach hooks
            name1 = jQuery.propFix[name1] || name1, hooks = jQuery.propHooks[name1]), undefined !== value) ? hooks && "set" in hooks && (ret = hooks.set(elem, value, name1)) !== undefined ? ret : elem[name1] = value : hooks && "get" in hooks && null !== (ret = hooks.get(elem, name1)) ? ret : elem[name1];
        },
        propHooks: {
            tabIndex: {
                get: function(elem) {
                    // elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
                    // http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
                    var attributeNode = elem.getAttributeNode("tabindex");
                    return attributeNode && attributeNode.specified ? parseInt(attributeNode.value, 10) : rfocusable.test(elem.nodeName) || rclickable.test(elem.nodeName) && elem.href ? 0 : undefined;
                }
            }
        }
    }), // Hook for boolean attributes
    boolHook = {
        get: function(elem, name1) {
            var prop = jQuery.prop(elem, name1), // Fetch it accordingly
            attr = "boolean" == typeof prop && elem.getAttribute(name1), detail = "boolean" == typeof prop ? getSetInput && getSetAttribute ? null != attr : // and conflates checked/selected into attroperties
            ruseDefault.test(name1) ? elem[jQuery.camelCase("default-" + name1)] : !!attr : elem.getAttributeNode(name1);
            return detail && !1 !== detail.value ? name1.toLowerCase() : undefined;
        },
        set: function(elem, value, name1) {
            return !1 === value ? // Remove boolean attributes when set to false
            jQuery.removeAttr(elem, name1) : getSetInput && getSetAttribute || !ruseDefault.test(name1) ? // IE<8 needs the *property* name
            elem.setAttribute(!getSetAttribute && jQuery.propFix[name1] || name1, name1) : elem[jQuery.camelCase("default-" + name1)] = elem[name1] = !0, name1;
        }
    }, getSetInput && getSetAttribute || (jQuery.attrHooks.value = {
        get: function(elem, name1) {
            var ret = elem.getAttributeNode(name1);
            return jQuery.nodeName(elem, "input") ? elem.defaultValue : ret && ret.specified ? ret.value : undefined;
        },
        set: function(elem, value, name1) {
            if (!jQuery.nodeName(elem, "input")) // Use nodeHook if defined (#1954); otherwise setAttribute is fine
            return nodeHook && nodeHook.set(elem, value, name1);
            // Does not return so that setAttribute is also used
            elem.defaultValue = value;
        }
    }), getSetAttribute || (// Use this for any attribute in IE6/7
    // This fixes almost every IE6/7 issue
    nodeHook = jQuery.valHooks.button = {
        get: function(elem, name1) {
            var ret = elem.getAttributeNode(name1);
            return ret && ("id" === name1 || "name" === name1 || "coords" === name1 ? "" !== ret.value : ret.specified) ? ret.value : undefined;
        },
        set: function(elem, value, name1) {
            // Set the existing or create a new attribute node
            var ret = elem.getAttributeNode(name1);
            // Break association with cloned elements by also using setAttribute (#9646)
            return ret || elem.setAttributeNode(ret = elem.ownerDocument.createAttribute(name1)), ret.value = value += "", "value" === name1 || value === elem.getAttribute(name1) ? value : undefined;
        }
    }, // Set contenteditable to false on removals(#10429)
    // Setting to empty string throws an error as an invalid value
    jQuery.attrHooks.contenteditable = {
        get: nodeHook.get,
        set: function(elem, value, name1) {
            nodeHook.set(elem, "" !== value && value, name1);
        }
    }, // Set width and height to auto instead of 0 on empty string( Bug #8150 )
    // This is for removals
    jQuery.each([
        "width",
        "height"
    ], function(i, name1) {
        jQuery.attrHooks[name1] = jQuery.extend(jQuery.attrHooks[name1], {
            set: function(elem, value) {
                if ("" === value) return elem.setAttribute(name1, "auto"), value;
            }
        });
    })), jQuery.support.hrefNormalized || (jQuery.each([
        "href",
        "src",
        "width",
        "height"
    ], function(i, name1) {
        jQuery.attrHooks[name1] = jQuery.extend(jQuery.attrHooks[name1], {
            get: function(elem) {
                var ret = elem.getAttribute(name1, 2);
                return null == ret ? undefined : ret;
            }
        });
    }), // href/src property should get the full normalized URL (#10299/#12915)
    jQuery.each([
        "href",
        "src"
    ], function(i, name1) {
        jQuery.propHooks[name1] = {
            get: function(elem) {
                return elem.getAttribute(name1, 4);
            }
        };
    })), jQuery.support.style || (jQuery.attrHooks.style = {
        get: function(elem) {
            // Return undefined in the case of empty string
            // Note: IE uppercases css property names, but if we were to .toLowerCase()
            // .cssText, that would destroy case senstitivity in URL's, like in "background"
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
                // Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
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
    /*
   * Helper functions for managing events -- not part of the public interface.
   * Props to Dean Edwards' addEvent library for many of the ideas.
   */ jQuery.event = {
        global: {},
        add: function(elem, types, handler, data, selector) {
            var tmp, events, t, handleObjIn, special, eventHandle, handleObj, handlers, type, namespaces, origType, elemData = jQuery._data(elem);
            // Don't attach events to noData or text/comment nodes (but allow plain objects)
            if (elemData) {
                for(handler.handler && (handler = (handleObjIn = handler).handler, selector = handleObjIn.selector), handler.guid || (handler.guid = jQuery.guid++), (events = elemData.events) || (events = elemData.events = {}), (eventHandle = elemData.handle) || // Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
                ((eventHandle = elemData.handle = function(e) {
                    // Discard the second event of a jQuery.event.trigger() and
                    // when an event is called after a page has unloaded
                    return e && jQuery.event.triggered === e.type ? undefined : jQuery.event.dispatch.apply(eventHandle.elem, arguments);
                }).elem = elem), t = // Handle multiple events separated by a space
                // jQuery(...).bind("mouseover mouseout", fn);
                (types = (types || "").match(core_rnotwhite) || [
                    ""
                ]).length; t--;)type = origType = (tmp = rtypenamespace.exec(types[t]) || [])[1], namespaces = (tmp[2] || "").split(".").sort(), // If event changes its type, use the special event handlers for the changed type
                special = jQuery.event.special[type] || {}, // If selector defined, determine special event api type, otherwise given type
                type = (selector ? special.delegateType : special.bindType) || type, // Update special based on newly reset type
                special = jQuery.event.special[type] || {}, // handleObj is passed to all event handlers
                handleObj = jQuery.extend({
                    type: type,
                    origType: origType,
                    data: data,
                    handler: handler,
                    guid: handler.guid,
                    selector: selector,
                    needsContext: selector && jQuery.expr.match.needsContext.test(selector),
                    namespace: namespaces.join(".")
                }, handleObjIn), (handlers = events[type]) || ((handlers = events[type] = []).delegateCount = 0, (!special.setup || !1 === special.setup.call(elem, data, namespaces, eventHandle)) && (elem.addEventListener ? elem.addEventListener(type, eventHandle, !1) : elem.attachEvent && elem.attachEvent("on" + type, eventHandle))), special.add && (special.add.call(elem, handleObj), handleObj.handler.guid || (handleObj.handler.guid = handler.guid)), selector ? handlers.splice(handlers.delegateCount++, 0, handleObj) : handlers.push(handleObj), // Keep track of which events have ever been used, for event optimization
                jQuery.event.global[type] = !0;
                // Nullify elem to prevent memory leaks in IE
                elem = null;
            }
        },
        // Detach an event or set of events from an element
        remove: function(elem, types, handler, selector, mappedTypes) {
            var j, handleObj, tmp, origCount, t, events, special, handlers, type, namespaces, origType, elemData = jQuery.hasData(elem) && jQuery._data(elem);
            if (elemData && (events = elemData.events)) {
                for(t = // Once for each type.namespace in types; type may be omitted
                (types = (types || "").match(core_rnotwhite) || [
                    ""
                ]).length; t--;){
                    // Unbind all events (on this namespace, if provided) for the element
                    if (type = origType = (tmp = rtypenamespace.exec(types[t]) || [])[1], namespaces = (tmp[2] || "").split(".").sort(), !type) {
                        for(type in events)jQuery.event.remove(elem, type + types[t], handler, selector, !0);
                        continue;
                    }
                    for(special = jQuery.event.special[type] || {}, handlers = events[type = (selector ? special.delegateType : special.bindType) || type] || [], tmp = tmp[2] && RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)"), // Remove matching events
                    origCount = j = handlers.length; j--;)handleObj = handlers[j], (mappedTypes || origType === handleObj.origType) && (!handler || handler.guid === handleObj.guid) && (!tmp || tmp.test(handleObj.namespace)) && (!selector || selector === handleObj.selector || "**" === selector && handleObj.selector) && (handlers.splice(j, 1), handleObj.selector && handlers.delegateCount--, special.remove && special.remove.call(elem, handleObj));
                    origCount && !handlers.length && (special.teardown && !1 !== special.teardown.call(elem, namespaces, elemData.handle) || jQuery.removeEvent(elem, type, elemData.handle), delete events[type]);
                }
                jQuery.isEmptyObject(events) && (delete elemData.handle, // removeData also checks for emptiness and clears the expando if empty
                // so use it instead of delete
                jQuery._removeData(elem, "events"));
            }
        },
        trigger: function(event, data, elem, onlyHandlers) {
            var handle, ontype, cur, bubbleType, special, tmp, i, eventPath = [
                elem || document
            ], type = core_hasOwn.call(event, "type") ? event.type : event, namespaces = core_hasOwn.call(event, "namespace") ? event.namespace.split(".") : [];
            // Don't do events on text and comment nodes
            if (cur = tmp = elem = elem || document, !(3 === elem.nodeType || 8 === elem.nodeType || rfocusMorph.test(type + jQuery.event.triggered))) {
                if (type.indexOf(".") >= 0 && (type = // Namespaced trigger; create a regexp to match event type in handle()
                (namespaces = type.split(".")).shift(), namespaces.sort()), ontype = 0 > type.indexOf(":") && "on" + type, // Caller can pass in a jQuery.Event object, Object, or just an event type string
                (event = event[jQuery.expando] ? event : new jQuery.Event(type, "object" == typeof event && event)).isTrigger = !0, event.namespace = namespaces.join("."), event.namespace_re = event.namespace ? RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, // Clean up the event in case it is being reused
                event.result = undefined, event.target || (event.target = elem), // Clone any incoming data and prepend the event, creating the handler arg list
                data = null == data ? [
                    event
                ] : jQuery.makeArray(data, [
                    event
                ]), // Allow special events to draw outside the lines
                special = jQuery.event.special[type] || {}, onlyHandlers || !special.trigger || !1 !== special.trigger.apply(elem, data)) {
                    // Determine event propagation path in advance, per W3C events spec (#9951)
                    // Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
                    if (!onlyHandlers && !special.noBubble && !jQuery.isWindow(elem)) {
                        for(bubbleType = special.delegateType || type, rfocusMorph.test(bubbleType + type) || (cur = cur.parentNode); cur; cur = cur.parentNode)eventPath.push(cur), tmp = cur;
                        tmp === (elem.ownerDocument || document) && eventPath.push(tmp.defaultView || tmp.parentWindow || window1);
                    }
                    for(// Fire handlers on the event path
                    i = 0; (cur = eventPath[i++]) && !event.isPropagationStopped();)event.type = i > 1 ? bubbleType : special.bindType || type, // jQuery handler
                    (handle = (jQuery._data(cur, "events") || {})[event.type] && jQuery._data(cur, "handle")) && handle.apply(cur, data), // Native handler
                    (handle = ontype && cur[ontype]) && jQuery.acceptData(cur) && handle.apply && !1 === handle.apply(cur, data) && event.preventDefault();
                    // If nobody prevented the default action, do it now
                    if (event.type = type, !onlyHandlers && !event.isDefaultPrevented() && (!special._default || !1 === special._default.apply(elem.ownerDocument, data)) && !("click" === type && jQuery.nodeName(elem, "a")) && jQuery.acceptData(elem) && ontype && elem[type] && !jQuery.isWindow(elem)) {
                        // Don't re-trigger an onFOO event when we call its FOO() method
                        (tmp = elem[ontype]) && (elem[ontype] = null), // Prevent re-triggering of the same event, since we already bubbled it above
                        jQuery.event.triggered = type;
                        try {
                            elem[type]();
                        } catch (e) {
                        // IE<9 dies on focus/blur to hidden element (#1486,#12518)
                        // only reproducible on winXP IE8 native, not IE9 in IE8 mode
                        }
                        jQuery.event.triggered = undefined, tmp && (elem[ontype] = tmp);
                    }
                    return event.result;
                }
            }
        },
        dispatch: function(event) {
            // Make a writable jQuery.Event from the native event object
            event = jQuery.event.fix(event);
            var i, ret, handleObj, matched, j, handlerQueue = [], args = core_slice.call(arguments), handlers = (jQuery._data(this, "events") || {})[event.type] || [], special = jQuery.event.special[event.type] || {};
            // Call the preDispatch hook for the mapped type, and let it bail if desired
            if (// Use the fix-ed jQuery.Event rather than the (read-only) native event
            args[0] = event, event.delegateTarget = this, !special.preDispatch || !1 !== special.preDispatch.call(this, event)) {
                for(// Determine handlers
                handlerQueue = jQuery.event.handlers.call(this, event, handlers), // Run delegates first; they may want to stop propagation beneath us
                i = 0; (matched = handlerQueue[i++]) && !event.isPropagationStopped();)for(event.currentTarget = matched.elem, j = 0; (handleObj = matched.handlers[j++]) && !event.isImmediatePropagationStopped();)// Triggered event must either 1) have no namespace, or
                // 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
                (!event.namespace_re || event.namespace_re.test(handleObj.namespace)) && (event.handleObj = handleObj, event.data = handleObj.data, undefined !== (ret = ((jQuery.event.special[handleObj.origType] || {}).handle || handleObj.handler).apply(matched.elem, args)) && !1 === (event.result = ret) && (event.preventDefault(), event.stopPropagation()));
                return special.postDispatch && special.postDispatch.call(this, event), event.result;
            }
        },
        handlers: function(event, handlers) {
            var sel, handleObj, matches, i, handlerQueue = [], delegateCount = handlers.delegateCount, cur = event.target;
            // Find delegate handlers
            // Black-hole SVG <use> instance trees (#13180)
            // Avoid non-left-click bubbling in Firefox (#3861)
            if (delegateCount && cur.nodeType && (!event.button || "click" !== event.type)) {
                for(; cur != this; cur = cur.parentNode || this)// Don't check non-elements (#13208)
                // Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
                if (1 === cur.nodeType && (!0 !== cur.disabled || "click" !== event.type)) {
                    for(i = 0, matches = []; i < delegateCount; i++)matches[// Don't conflict with Object.prototype properties (#13203)
                    sel = (handleObj = handlers[i]).selector + " "] === undefined && (matches[sel] = handleObj.needsContext ? jQuery(sel, this).index(cur) >= 0 : jQuery.find(sel, this, null, [
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
            // Create a writable copy of the event object and normalize some properties
            var i, prop, copy, type = event.type, originalEvent = event, fixHook = this.fixHooks[type];
            for(fixHook || (this.fixHooks[type] = fixHook = rmouseEvent.test(type) ? this.mouseHooks : rkeyEvent.test(type) ? this.keyHooks : {}), copy = fixHook.props ? this.props.concat(fixHook.props) : this.props, event = new jQuery.Event(originalEvent), i = copy.length; i--;)event[prop = copy[i]] = originalEvent[prop];
            return event.target || (event.target = originalEvent.srcElement || document), 3 === event.target.nodeType && (event.target = event.target.parentNode), // Support: IE<9
            // For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
            event.metaKey = !!event.metaKey, fixHook.filter ? fixHook.filter(event, originalEvent) : event;
        },
        // Includes some event props shared by KeyEvent and MouseEvent
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
                return null == event.pageX && null != original.clientX && (doc = (eventDoc = event.target.ownerDocument || document).documentElement, body = eventDoc.body, event.pageX = original.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0), event.pageY = original.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0)), !event.relatedTarget && fromElement && (event.relatedTarget = fromElement === event.target ? original.toElement : fromElement), event.which || undefined === button || (event.which = 1 & button ? 1 : 2 & button ? 3 : 4 & button ? 2 : 0), event;
            }
        },
        special: {
            load: {
                // Prevent triggered image.load events from bubbling to window.load
                noBubble: !0
            },
            click: {
                // For checkbox, fire native event so checked state will be right
                trigger: function() {
                    if (jQuery.nodeName(this, "input") && "checkbox" === this.type && this.click) return this.click(), !1;
                }
            },
            focus: {
                // Fire native event if possible so blur/focus sequence is correct
                trigger: function() {
                    if (this !== document.activeElement && this.focus) try {
                        return this.focus(), !1;
                    } catch (e) {
                    // Support: IE<9
                    // If we error on focus to hidden element (#1486, #12518),
                    // let .trigger() run the handlers
                    }
                },
                delegateType: "focusin"
            },
            blur: {
                trigger: function() {
                    if (this === document.activeElement && this.blur) return this.blur(), !1;
                },
                delegateType: "focusout"
            },
            beforeunload: {
                postDispatch: function(event) {
                    // Even when returnValue equals to undefined Firefox will still show alert
                    event.result !== undefined && (event.originalEvent.returnValue = event.result);
                }
            }
        },
        simulate: function(type, elem, event, bubble) {
            // Piggyback on a donor event to simulate a different one.
            // Fake originalEvent to avoid donor's stopPropagation, but if the
            // simulated event prevents default then we do the same on the donor.
            var e = jQuery.extend(new jQuery.Event(), event, {
                type: type,
                isSimulated: !0,
                originalEvent: {}
            });
            bubble ? jQuery.event.trigger(e, null, elem) : jQuery.event.dispatch.call(elem, e), e.isDefaultPrevented() && event.preventDefault();
        }
    }, jQuery.removeEvent = document.removeEventListener ? function(elem, type, handle) {
        elem.removeEventListener && elem.removeEventListener(type, handle, !1);
    } : function(elem, type, handle) {
        var name1 = "on" + type;
        elem.detachEvent && (typeof elem[name1] === core_strundefined && (elem[name1] = null), elem.detachEvent(name1, handle));
    }, jQuery.Event = function(src, props) {
        // Allow instantiation without the 'new' keyword
        if (!(this instanceof jQuery.Event)) return new jQuery.Event(src, props);
        src && src.type ? (this.originalEvent = src, this.type = src.type, // Events bubbling up the document may have been marked as prevented
        // by a handler lower down the tree; reflect the correct value.
        this.isDefaultPrevented = src.defaultPrevented || !1 === src.returnValue || src.getPreventDefault && src.getPreventDefault() ? returnTrue : returnFalse) : this.type = src, props && jQuery.extend(this, props), // Create a timestamp if incoming event doesn't have one
        this.timeStamp = src && src.timeStamp || jQuery.now(), // Mark it as fixed
        this[jQuery.expando] = !0;
    }, // jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
    // http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
    jQuery.Event.prototype = {
        isDefaultPrevented: returnFalse,
        isPropagationStopped: returnFalse,
        isImmediatePropagationStopped: returnFalse,
        preventDefault: function() {
            var e = this.originalEvent;
            this.isDefaultPrevented = returnTrue, e && (e.preventDefault ? e.preventDefault() : e.returnValue = !1);
        },
        stopPropagation: function() {
            var e = this.originalEvent;
            this.isPropagationStopped = returnTrue, e && (e.stopPropagation && e.stopPropagation(), // Support: IE
            // Set the cancelBubble property of the original event to true
            e.cancelBubble = !0);
        },
        stopImmediatePropagation: function() {
            this.isImmediatePropagationStopped = returnTrue, this.stopPropagation();
        }
    }, // Create mouseenter/leave events using mouseover/out and event-time checks
    jQuery.each({
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
            // Only need this for delegated form submit events
            if (jQuery.nodeName(this, "form")) return !1;
            // Lazy-add a submit handler when a descendant form may potentially be submitted
            jQuery.event.add(this, "click._submit keypress._submit", function(e) {
                // Node name check avoids a VML-related crash in IE (#9807)
                var elem = e.target, form = jQuery.nodeName(elem, "input") || jQuery.nodeName(elem, "button") ? elem.form : undefined;
                form && !jQuery._data(form, "submitBubbles") && (jQuery.event.add(form, "submit._submit", function(event) {
                    event._submit_bubble = !0;
                }), jQuery._data(form, "submitBubbles", !0));
            });
        // return undefined since we don't need an event listener
        },
        postDispatch: function(event) {
            // If form was submitted by the user, bubble the event up the tree
            event._submit_bubble && (delete event._submit_bubble, this.parentNode && !event.isTrigger && jQuery.event.simulate("submit", this.parentNode, event, !0));
        },
        teardown: function() {
            // Only need this for delegated form submit events
            if (jQuery.nodeName(this, "form")) return !1;
            // Remove delegated handlers; cleanData eventually reaps submit handlers attached above
            jQuery.event.remove(this, "._submit");
        }
    }), jQuery.support.changeBubbles || (jQuery.event.special.change = {
        setup: function() {
            if (rformElems.test(this.nodeName)) return ("checkbox" === this.type || "radio" === this.type) && (jQuery.event.add(this, "propertychange._change", function(event) {
                "checked" === event.originalEvent.propertyName && (this._just_changed = !0);
            }), jQuery.event.add(this, "click._change", function(event) {
                this._just_changed && !event.isTrigger && (this._just_changed = !1), // Allow triggered, simulated change events (#11500)
                jQuery.event.simulate("change", this, event, !0);
            })), !1;
            // Delegated event; lazy-add a change handler on descendant inputs
            jQuery.event.add(this, "beforeactivate._change", function(e) {
                var elem = e.target;
                rformElems.test(elem.nodeName) && !jQuery._data(elem, "changeBubbles") && (jQuery.event.add(elem, "change._change", function(event) {
                    !this.parentNode || event.isSimulated || event.isTrigger || jQuery.event.simulate("change", this.parentNode, event, !0);
                }), jQuery._data(elem, "changeBubbles", !0));
            });
        },
        handle: function(event) {
            var elem = event.target;
            // Swallow native change events from checkbox/radio, we already triggered them above
            if (this !== elem || event.isSimulated || event.isTrigger || "radio" !== elem.type && "checkbox" !== elem.type) return event.handleObj.handler.apply(this, arguments);
        },
        teardown: function() {
            return jQuery.event.remove(this, "._change"), !rformElems.test(this.nodeName);
        }
    }), jQuery.support.focusinBubbles || jQuery.each({
        focus: "focusin",
        blur: "focusout"
    }, function(orig, fix) {
        // Attach a single capturing handler while someone wants focusin/focusout
        var attaches = 0, handler = function(event) {
            jQuery.event.simulate(fix, event.target, jQuery.event.fix(event), !0);
        };
        jQuery.event.special[fix] = {
            setup: function() {
                0 == attaches++ && document.addEventListener(orig, handler, !0);
            },
            teardown: function() {
                0 == --attaches && document.removeEventListener(orig, handler, !0);
            }
        };
    }), jQuery.fn.extend({
        on: function(types, selector, data, fn, /*INTERNAL*/ one) {
            var type, origFn;
            // Types can be a map of types/handlers
            if ("object" == typeof types) {
                for(type in "string" != typeof selector && (// ( types-Object, data )
                data = data || selector, selector = undefined), types)this.on(type, selector, data, types[type], one);
                return this;
            }
            if (null == data && null == fn ? (// ( types, fn )
            fn = selector, data = selector = undefined) : null == fn && ("string" == typeof selector ? (// ( types, selector, fn )
            fn = data, data = undefined) : (// ( types, data, fn )
            fn = data, data = selector, selector = undefined)), !1 === fn) fn = returnFalse;
            else if (!fn) return this;
            return 1 === one && (origFn = fn, // Use same guid so caller can remove using origFn
            (fn = function(event) {
                return(// Can use an empty set, since event contains the info
                jQuery().off(event), origFn.apply(this, arguments));
            }).guid = origFn.guid || (origFn.guid = jQuery.guid++)), this.each(function() {
                jQuery.event.add(this, types, fn, data, selector);
            });
        },
        one: function(types, selector, data, fn) {
            return this.on(types, selector, data, fn, 1);
        },
        off: function(types, selector, fn) {
            var handleObj, type;
            if (types && types.preventDefault && types.handleObj) return(// ( event )  dispatched jQuery.Event
            handleObj = types.handleObj, jQuery(types.delegateTarget).off(handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType, handleObj.selector, handleObj.handler), this);
            if ("object" == typeof types) {
                // ( types-object [, selector] )
                for(type in types)this.off(type, selector, types[type]);
                return this;
            }
            return (!1 === selector || "function" == typeof selector) && (// ( types [, fn] )
            fn = selector, selector = undefined), !1 === fn && (fn = returnFalse), this.each(function() {
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
            // ( namespace ) or ( selector, types [, fn] )
            return 1 == arguments.length ? this.off(selector, "**") : this.off(types, selector || "**", fn);
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
    }), /*!
   * Sizzle CSS Selector Engine
   * Copyright 2012 jQuery Foundation and other contributors
   * Released under the MIT license
   * http://sizzlejs.com/
   */ function(window1, undefined) {
        var i, cachedruns, Expr, getText, isXML, compile, hasDuplicate, outermostContext, // Local document vars
        setDocument, document, docElem, documentIsXML, rbuggyQSA, rbuggyMatches, matches, contains, sortOrder, // Instance-specific data
        expando = "sizzle" + -new Date(), preferredDoc = window1.document, support = {}, dirruns = 0, done = 0, classCache = createCache(), tokenCache = createCache(), compilerCache = createCache(), // General-purpose constants
        strundefined = "undefined", // Array methods
        arr = [], pop = arr.pop, push = arr.push, slice = arr.slice, // Use a stripped-down indexOf if we can't use a native one
        indexOf = arr.indexOf || function(elem) {
            for(var i = 0, len = this.length; i < len; i++)if (this[i] === elem) return i;
            return -1;
        }, // Regular expressions
        // Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
        whitespace = "[\\x20\\t\\r\\n\\f]", // http://www.w3.org/TR/css3-syntax/#characters
        characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+", // Loosely modeled on CSS identifier characters
        // An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
        // Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
        identifier = characterEncoding.replace("w", "w#"), attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace + "*(?:([*^$|!~]?=)" + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]", // Prefer arguments quoted,
        //   then not containing pseudos/brackets,
        //   then attribute selectors/non-parenthetical expressions,
        //   then anything else
        // These preferences are here to reduce the number of selectors
        //   needing tokenize in the PSEUDO preFilter
        pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace(3, 8) + ")*)|.*)\\)|)", // Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
        rtrim = RegExp("^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g"), rcomma = RegExp("^" + whitespace + "*," + whitespace + "*"), rcombinators = RegExp("^" + whitespace + "*([\\x20\\t\\r\\n\\f>+~])" + whitespace + "*"), rpseudo = new RegExp(pseudos), ridentifier = RegExp("^" + identifier + "$"), matchExpr = {
            ID: RegExp("^#(" + characterEncoding + ")"),
            CLASS: RegExp("^\\.(" + characterEncoding + ")"),
            NAME: RegExp("^\\[name=['\"]?(" + characterEncoding + ")['\"]?\\]"),
            TAG: RegExp("^(" + characterEncoding.replace("w", "w*") + ")"),
            ATTR: RegExp("^" + attributes),
            PSEUDO: RegExp("^" + pseudos),
            CHILD: RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace + "*(\\d+)|))" + whitespace + "*\\)|)", "i"),
            // For use in libraries implementing .is()
            // We use this for POS matching in `select`
            needsContext: RegExp("^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i")
        }, rsibling = /[\x20\t\r\n\f]*[+~]/, rnative = /^[^{]+\{\s*\[native code/, // Easily-parseable/retrievable ID or TAG or CLASS selectors
        rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, rinputs = /^(?:input|select|textarea|button)$/i, rheader = /^h\d$/i, rescape = /'|\\/g, rattributeQuotes = /\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g, // CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
        runescape = /\\([\da-fA-F]{1,6}[\x20\t\r\n\f]?|.)/g, funescape = function(_, escaped) {
            var high = "0x" + escaped - 0x10000;
            // NaN means non-codepoint
            return high != high ? escaped : high < 0 ? String.fromCharCode(high + 0x10000) : String.fromCharCode(high >> 10 | 0xd800, 0x3ff & high | 0xdc00);
        };
        // Use a stripped-down slice if we can't use a native one
        try {
            slice.call(preferredDoc.documentElement.childNodes, 0)[0].nodeType;
        } catch (e) {
            slice = function(i) {
                for(var elem, results = []; elem = this[i++];)results.push(elem);
                return results;
            };
        }
        /**
     * For feature detection
     * @param {Function} fn The function to test for native support
     */ function isNative(fn) {
            return rnative.test(fn + "");
        }
        /**
     * Create key-value caches of limited size
     * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
     *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
     *	deleting the oldest entry
     */ function createCache() {
            var cache, keys = [];
            return cache = function(key, value) {
                return keys.push(key += " ") > Expr.cacheLength && // Only keep the most recent entries
                delete cache[keys.shift()], cache[key] = value;
            };
        }
        /**
     * Mark a function for special use by Sizzle
     * @param {Function} fn The function to mark
     */ function markFunction(fn) {
            return fn[expando] = !0, fn;
        }
        /**
     * Support testing using an element
     * @param {Function} fn Passed the created div and expects a boolean result
     */ function assert(fn) {
            var div = document.createElement("div");
            try {
                return fn(div);
            } catch (e) {
                return !1;
            } finally{
                // release memory in IE
                div = null;
            }
        }
        function Sizzle(selector, context, results, seed) {
            var match, elem, m, nodeType, // QSA vars
            i, groups, old, nid, newContext, newSelector;
            if ((context ? context.ownerDocument || context : preferredDoc) !== document && setDocument(context), context = context || document, results = results || [], !selector || "string" != typeof selector) return results;
            if (1 !== (nodeType = context.nodeType) && 9 !== nodeType) return [];
            if (!documentIsXML && !seed) {
                // Shortcuts
                if (match = rquickExpr.exec(selector)) {
                    // Speed-up: Sizzle("#ID")
                    if (m = match[1]) {
                        if (9 === nodeType) {
                            // Check parentNode to catch when Blackberry 4.6 returns
                            // nodes that are no longer in the document #6963
                            if (!(elem = context.getElementById(m)) || !elem.parentNode) return results;
                            // Handle the case where IE, Opera, and Webkit return items
                            // by name instead of ID
                            if (elem.id === m) return results.push(elem), results;
                        } else // Context is not a document
                        if (context.ownerDocument && (elem = context.ownerDocument.getElementById(m)) && contains(context, elem) && elem.id === m) return results.push(elem), results;
                    } else if (match[2]) return push.apply(results, slice.call(context.getElementsByTagName(selector), 0)), results;
                    else if ((m = match[3]) && support.getByClassName && context.getElementsByClassName) return push.apply(results, slice.call(context.getElementsByClassName(m), 0)), results;
                }
                // QSA path
                if (support.qsa && !rbuggyQSA.test(selector)) {
                    // qSA works strangely on Element-rooted queries
                    // We can work around this by specifying an extra ID on the root
                    // and working up from there (Thanks to Andrew Dupont for the technique)
                    // IE 8 doesn't work on object elements
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
            // All others
            return function(selector, context, results, seed) {
                var i, tokens, token, type, find, match = tokenize(selector);
                if (!seed && 1 === match.length) {
                    if (// Take a shortcut and set the context if the root selector is an ID
                    (tokens = match[0] = match[0].slice(0)).length > 2 && "ID" === (token = tokens[0]).type && 9 === context.nodeType && !documentIsXML && Expr.relative[tokens[1].type]) {
                        if (!(context = Expr.find.ID(token.matches[0].replace(runescape, funescape), context)[0])) return results;
                        selector = selector.slice(tokens.shift().value.length);
                    }
                    for(// Fetch a seed set for right-to-left matching
                    i = matchExpr.needsContext.test(selector) ? 0 : tokens.length; // Abort if we hit a combinator
                    i-- && (token = tokens[i], !Expr.relative[type = token.type]);)if ((find = Expr.find[type]) && (seed = find(token.matches[0].replace(runescape, funescape), rsibling.test(tokens[0].type) && context.parentNode || context))) {
                        if (// If seed is empty or no tokens remain, we can return early
                        tokens.splice(i, 1), !(selector = seed.length && toSelector(tokens))) return push.apply(results, slice.call(seed, 0)), results;
                        break;
                    }
                }
                return(// Compile and execute a filtering function
                // Provide `match` to avoid retokenization if we modified the selector above
                compile(selector, match)(seed, context, documentIsXML, results, rsibling.test(selector)), results);
            }(selector.replace(rtrim, "$1"), context, results, seed);
        }
        function siblingCheck(a, b) {
            var cur = b && a, diff = cur && (~b.sourceIndex || -2147483648) - (~a.sourceIndex || -2147483648);
            // Use IE sourceIndex if available on both nodes
            if (diff) return diff;
            // Check if b follows a
            if (cur) {
                for(; cur = cur.nextSibling;)if (cur === b) return -1;
            }
            return a ? 1 : -1;
        }
        // Returns a function to use in pseudos for positionals
        function createPositionalPseudo(fn) {
            return markFunction(function(argument) {
                return argument = +argument, markFunction(function(seed, matches) {
                    // Match elements found at the specified indexes
                    for(var j, matchIndexes = fn([], seed.length, argument), i = matchIndexes.length; i--;)seed[j = matchIndexes[i]] && (seed[j] = !(matches[j] = seed[j]));
                });
            });
        }
        // Add button/input type pseudos
        for(i in /**
     * Detect xml
     * @param {Element|Object} elem An element or a document
     */ isXML = Sizzle.isXML = function(elem) {
            // documentElement is verified for cases where it doesn't yet exist
            // (such as loading iframes in IE - #4833)
            var documentElement = elem && (elem.ownerDocument || elem).documentElement;
            return !!documentElement && "HTML" !== documentElement.nodeName;
        }, /**
     * Sets document-related variables once based on the current document
     * @param {Element|Object} [doc] An element or document object to use to set the document
     * @returns {Object} Returns the current document
     */ setDocument = Sizzle.setDocument = function(node) {
            var doc = node ? node.ownerDocument || node : preferredDoc;
            return doc !== document && 9 === doc.nodeType && doc.documentElement && (// Set our document
            document = doc, docElem = doc.documentElement, // Support tests
            documentIsXML = isXML(doc), // Check if getElementsByTagName("*") returns only elements
            support.tagNameNoComments = assert(function(div) {
                return div.appendChild(doc.createComment("")), !div.getElementsByTagName("*").length;
            }), // Check if attributes should be retrieved by attribute nodes
            support.attributes = assert(function(div) {
                div.innerHTML = "<select></select>";
                var type = typeof div.lastChild.getAttribute("multiple");
                // IE8 returns a string for some attributes even when not present
                return "boolean" !== type && "string" !== type;
            }), // Check if getElementsByClassName can be trusted
            support.getByClassName = assert(function(div) {
                return(// Opera can't find a second classname (in 9.6)
                div.innerHTML = "<div class='hidden e'></div><div class='hidden'></div>", !!div.getElementsByClassName && !!div.getElementsByClassName("e").length && (// Safari 3.2 caches class attributes and doesn't catch changes
                div.lastChild.className = "e", 2 === div.getElementsByClassName("e").length));
            }), // Check if getElementById returns elements by name
            // Check if getElementsByName privileges form controls or returns elements by ID
            support.getByName = assert(function(div) {
                // Inject content
                div.id = expando + 0, div.innerHTML = "<a name='" + expando + "'></a><div name='" + expando + "'></div>", docElem.insertBefore(div, docElem.firstChild);
                // Test
                var pass = doc.getElementsByName && // buggy browsers will return fewer than the correct 2
                doc.getElementsByName(expando).length === 2 + // buggy browsers will return more than the correct 0
                doc.getElementsByName(expando + 0).length;
                return support.getIdNotName = !doc.getElementById(expando), // Cleanup
                docElem.removeChild(div), pass;
            }), // IE6/7 return modified attributes
            Expr.attrHandle = assert(function(div) {
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
                    // Check parentNode to catch when Blackberry 4.6 returns
                    // nodes that are no longer in the document #6963
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
            }), // Tag
            Expr.find.TAG = support.tagNameNoComments ? function(tag, context) {
                if (typeof context.getElementsByTagName !== strundefined) return context.getElementsByTagName(tag);
            } : function(tag, context) {
                var elem, tmp = [], i = 0, results = context.getElementsByTagName(tag);
                // Filter out possible comments
                if ("*" === tag) {
                    for(; elem = results[i++];)1 === elem.nodeType && tmp.push(elem);
                    return tmp;
                }
                return results;
            }, // Name
            Expr.find.NAME = support.getByName && function(tag, context) {
                if (typeof context.getElementsByName !== strundefined) return context.getElementsByName(name);
            }, // Class
            Expr.find.CLASS = support.getByClassName && function(className, context) {
                if (typeof context.getElementsByClassName !== strundefined && !documentIsXML) return context.getElementsByClassName(className);
            }, // QSA and matchesSelector support
            // matchesSelector(:active) reports false when true (IE9/Opera 11.5)
            rbuggyMatches = [], // qSa(:focus) reports false when true (Chrome 21),
            // no need to also add to buggyMatches since matches checks buggyQSA
            // A support test would require too much code (would include document ready)
            rbuggyQSA = [
                ":focus"
            ], (support.qsa = isNative(doc.querySelectorAll)) && (// Build QSA regex
            // Regex strategy adopted from Diego Perini
            assert(function(div) {
                // Select is set to empty string on purpose
                // This is to test IE's treatment of not explictly
                // setting a boolean content attribute,
                // since its presence should be enough
                // http://bugs.jquery.com/ticket/12359
                div.innerHTML = "<select><option selected=''></option></select>", div.querySelectorAll("[selected]").length || rbuggyQSA.push("\\[" + whitespace + "*(?:checked|disabled|ismap|multiple|readonly|selected|value)"), div.querySelectorAll(":checked").length || rbuggyQSA.push(":checked");
            }), assert(function(div) {
                // Opera 10-12/IE8 - ^= $= *= and empty values
                // Should not select anything
                div.innerHTML = "<input type='hidden' i=''/>", div.querySelectorAll("[i^='']").length && rbuggyQSA.push("[*^$]=" + whitespace + "*(?:\"\"|'')"), div.querySelectorAll(":enabled").length || rbuggyQSA.push(":enabled", ":disabled"), // Opera 10-11 does not throw on post-comma invalid pseudos
                div.querySelectorAll("*,:x"), rbuggyQSA.push(",.*:");
            })), (support.matchesSelector = isNative(matches = docElem.matchesSelector || docElem.mozMatchesSelector || docElem.webkitMatchesSelector || docElem.oMatchesSelector || docElem.msMatchesSelector)) && assert(function(div) {
                // Check to see if it's possible to do matchesSelector
                // on a disconnected node (IE 9)
                support.disconnectedMatch = matches.call(div, "div"), // This should fail with an exception
                // Gecko does not error, returns false instead
                matches.call(div, "[s!='']:x"), rbuggyMatches.push("!=", pseudos);
            }), rbuggyQSA = new RegExp(rbuggyQSA.join("|")), rbuggyMatches = new RegExp(rbuggyMatches.join("|")), // Element contains another
            // Purposefully does not implement inclusive descendent
            // As in, an element does not contain itself
            contains = isNative(docElem.contains) || docElem.compareDocumentPosition ? function(a, b) {
                var adown = 9 === a.nodeType ? a.documentElement : a, bup = b && b.parentNode;
                return a === bup || !!(bup && 1 === bup.nodeType && (adown.contains ? adown.contains(bup) : a.compareDocumentPosition && 16 & a.compareDocumentPosition(bup)));
            } : function(a, b) {
                if (b) {
                    for(; b = b.parentNode;)if (b === a) return !0;
                }
                return !1;
            }, // Document order sorting
            sortOrder = docElem.compareDocumentPosition ? function(a, b) {
                var compare;
                if (a === b) return hasDuplicate = !0, 0;
                if (compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition(b)) return 1 & compare || a.parentNode && 11 === a.parentNode.nodeType ? a === doc || contains(preferredDoc, a) ? -1 : b === doc || contains(preferredDoc, b) ? 1 : 0 : 4 & compare ? -1 : 1;
                return a.compareDocumentPosition ? -1 : 1;
            } : function(a, b) {
                var cur, i = 0, aup = a.parentNode, bup = b.parentNode, ap = [
                    a
                ], bp = [
                    b
                ];
                // Exit early if the nodes are identical
                if (a === b) return hasDuplicate = !0, 0;
                if (!aup || !bup) return a === doc ? -1 : b === doc ? 1 : aup ? -1 : bup ? 1 : 0;
                if (aup === bup) return siblingCheck(a, b);
                for(// Otherwise we need full lists of their ancestors for comparison
                cur = a; cur = cur.parentNode;)ap.unshift(cur);
                for(cur = b; cur = cur.parentNode;)bp.unshift(cur);
                // Walk down the tree looking for a discrepancy
                for(; ap[i] === bp[i];)i++;
                return i ? siblingCheck(ap[i], bp[i]) : ap[i] === preferredDoc ? -1 : bp[i] === preferredDoc ? 1 : 0;
            }, // Always assume the presence of duplicates if sort doesn't
            // pass them to our comparison function (as in Google Chrome).
            hasDuplicate = !1, [
                0,
                0
            ].sort(sortOrder), support.detectDuplicates = hasDuplicate), document;
        }, Sizzle.matches = function(expr, elements) {
            return Sizzle(expr, null, null, elements);
        }, Sizzle.matchesSelector = function(elem, expr) {
            // rbuggyQSA always contains :focus, so no need for an existence check
            if ((elem.ownerDocument || elem) !== document && setDocument(elem), // Make sure that attribute selectors are quoted
            expr = expr.replace(rattributeQuotes, "='$1']"), support.matchesSelector && !documentIsXML && (!rbuggyMatches || !rbuggyMatches.test(expr)) && !rbuggyQSA.test(expr)) try {
                var ret = matches.call(elem, expr);
                // IE 9's matchesSelector returns false on disconnected nodes
                if (ret || support.disconnectedMatch || // As well, disconnected nodes are said to be in a document
                // fragment in IE 9
                elem.document && 11 !== elem.document.nodeType) return ret;
            } catch (e) {}
            return Sizzle(expr, document, null, [
                elem
            ]).length > 0;
        }, Sizzle.contains = function(context, elem) {
            return (context.ownerDocument || context) !== document && setDocument(context), contains(context, elem);
        }, Sizzle.attr = function(elem, name1) {
            var val;
            return ((elem.ownerDocument || elem) !== document && setDocument(elem), documentIsXML || (name1 = name1.toLowerCase()), val = Expr.attrHandle[name1]) ? val(elem) : documentIsXML || support.attributes ? elem.getAttribute(name1) : ((val = elem.getAttributeNode(name1)) || elem.getAttribute(name1)) && !0 === elem[name1] ? name1 : val && val.specified ? val.value : null;
        }, Sizzle.error = function(msg) {
            throw Error("Syntax error, unrecognized expression: " + msg);
        }, // Document sorting and removing duplicates
        Sizzle.uniqueSort = function(results) {
            var elem, duplicates = [], i = 1, j = 0;
            if (// Unless we *know* we can detect duplicates, assume their presence
            hasDuplicate = !support.detectDuplicates, results.sort(sortOrder), hasDuplicate) {
                for(; elem = results[i]; i++)elem === results[i - 1] && (j = duplicates.push(i));
                for(; j--;)results.splice(duplicates[j], 1);
            }
            return results;
        }, /**
     * Utility function for retrieving the text value of an array of DOM nodes
     * @param {Array|Element} elem
     */ getText = Sizzle.getText = function(elem) {
            var node, ret = "", i = 0, nodeType = elem.nodeType;
            if (nodeType) {
                if (1 === nodeType || 9 === nodeType || 11 === nodeType) {
                    // Use textContent for elements
                    // innerText usage removed for consistency of new lines (see #11153)
                    if ("string" == typeof elem.textContent) return elem.textContent;
                    // Traverse its children
                    for(elem = elem.firstChild; elem; elem = elem.nextSibling)ret += getText(elem);
                } else if (3 === nodeType || 4 === nodeType) return elem.nodeValue;
            } else // If no nodeType, this is expected to be an array
            for(; node = elem[i]; i++)// Do not traverse comment nodes
            ret += getText(node);
            // Do not include comment or processing instruction nodes
            return ret;
        }, Expr = Sizzle.selectors = {
            // Can be adjusted by the user
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
                    return match[1] = match[1].replace(runescape, funescape), // Move the given value to match[3] whether quoted or unquoted
                    match[3] = (match[4] || match[5] || "").replace(runescape, funescape), "~=" === match[2] && (match[3] = " " + match[3] + " "), match.slice(0, 4);
                },
                CHILD: function(match) {
                    return(/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/ match[1] = match[1].toLowerCase(), "nth" === match[1].slice(0, 3) ? (match[3] || Sizzle.error(match[0]), // numeric x and y parameters for Expr.filter.CHILD
                    // remember that false/true cast respectively to 0/1
                    match[4] = +(match[4] ? match[5] + (match[6] || 1) : 2 * ("even" === match[3] || "odd" === match[3])), match[5] = +(match[7] + match[8] || "odd" === match[3])) : match[3] && Sizzle.error(match[0]), match);
                },
                PSEUDO: function(match) {
                    var excess, unquoted = !match[5] && match[2];
                    return matchExpr.CHILD.test(match[0]) ? null : (match[4] ? match[2] = match[4] : unquoted && rpseudo.test(unquoted) && // Get excess from tokenize (recursively)
                    (excess = tokenize(unquoted, !0)) && // advance to the next closing parenthesis
                    (excess = unquoted.indexOf(")", unquoted.length - excess) - unquoted.length) && (// excess is a negative index
                    match[0] = match[0].slice(0, excess), match[2] = unquoted.slice(0, excess)), match.slice(0, 3));
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
                    return pattern || (pattern = RegExp("(^|" + whitespace + ")" + className + "(" + whitespace + "|$)"), classCache(className, function(elem) {
                        return pattern.test(elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "");
                    }));
                },
                ATTR: function(name1, operator, check) {
                    return function(elem) {
                        var result = Sizzle.attr(elem, name1);
                        return null == result ? "!=" === operator : !operator || (result += "", "=" === operator ? result === check : "!=" === operator ? result !== check : "^=" === operator ? check && 0 === result.indexOf(check) : "*=" === operator ? check && result.indexOf(check) > -1 : "$=" === operator ? check && result.slice(-check.length) === check : "~=" === operator ? (" " + result + " ").indexOf(check) > -1 : "|=" === operator && (result === check || result.slice(0, check.length + 1) === check + "-"));
                    };
                },
                CHILD: function(type, what, argument, first, last) {
                    var simple = "nth" !== type.slice(0, 3), forward = "last" !== type.slice(-4), ofType = "of-type" === what;
                    return 1 === first && 0 === last ? function(elem) {
                        return !!elem.parentNode;
                    } : function(elem, context, xml) {
                        var cache, outerCache, node, diff, nodeIndex, start, dir = simple !== forward ? "nextSibling" : "previousSibling", parent = elem.parentNode, name1 = ofType && elem.nodeName.toLowerCase(), useCache = !xml && !ofType;
                        if (parent) {
                            // :(first|last|only)-(child|of-type)
                            if (simple) {
                                for(; dir;){
                                    for(node = elem; node = node[dir];)if (ofType ? node.nodeName.toLowerCase() === name1 : 1 === node.nodeType) return !1;
                                    // Reverse direction for :only-* (if we haven't yet done so)
                                    start = dir = "only" === type && !start && "nextSibling";
                                }
                                return !0;
                            }
                            // non-xml :nth-child(...) stores cache data on `parent`
                            if (start = [
                                forward ? parent.firstChild : parent.lastChild
                            ], forward && useCache) {
                                for(nodeIndex = (cache = // Seek `elem` from a previously-cached index
                                (outerCache = parent[expando] || (parent[expando] = {}))[type] || [])[0] === dirruns && cache[1], diff = cache[0] === dirruns && cache[2], node = nodeIndex && parent.childNodes[nodeIndex]; node = ++nodeIndex && node && node[dir] || // Fallback to seeking `elem` from the start
                                (diff = nodeIndex = 0) || start.pop();)// When found, cache indexes on `parent` and break
                                if (1 === node.nodeType && ++diff && node === elem) {
                                    outerCache[type] = [
                                        dirruns,
                                        nodeIndex,
                                        diff
                                    ];
                                    break;
                                }
                            } else if (useCache && (cache = (elem[expando] || (elem[expando] = {}))[type]) && cache[0] === dirruns) diff = cache[1];
                            else // Use the same loop as above to seek `elem` from the start
                            for(; (node = ++nodeIndex && node && node[dir] || (diff = nodeIndex = 0) || start.pop()) && (!((ofType ? node.nodeName.toLowerCase() === name1 : 1 === node.nodeType) && ++diff) || (useCache && ((node[expando] || (node[expando] = {}))[type] = [
                                dirruns,
                                diff
                            ]), node !== elem)););
                            return(// Incorporate the offset, then check against cycle size
                            (diff -= last) === first || diff % first == 0 && diff / first >= 0);
                        }
                    };
                },
                PSEUDO: function(pseudo, argument) {
                    // pseudo-class names are case-insensitive
                    // http://www.w3.org/TR/selectors/#pseudo-classes
                    // Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
                    // Remember that setFilters inherits from pseudos
                    var args, fn = Expr.pseudos[pseudo] || Expr.setFilters[pseudo.toLowerCase()] || Sizzle.error("unsupported pseudo: " + pseudo);
                    return(// The user may use createPseudo to indicate that
                    // arguments are needed to create the filter function
                    // just as Sizzle does
                    fn[expando] ? fn(argument) : fn.length > 1 ? (args = [
                        pseudo,
                        pseudo,
                        "",
                        argument
                    ], Expr.setFilters.hasOwnProperty(pseudo.toLowerCase()) ? markFunction(function(seed, matches) {
                        for(var idx, matched = fn(seed, argument), i = matched.length; i--;)idx = indexOf.call(seed, matched[i]), seed[idx] = !(matches[idx] = matched[i]);
                    }) : function(elem) {
                        return fn(elem, 0, args);
                    }) : fn);
                }
            },
            pseudos: {
                // Potentially complex pseudos
                not: markFunction(function(selector) {
                    // Trim the selector passed to compile
                    // to avoid treating leading and trailing
                    // spaces as combinators
                    var input = [], results = [], matcher = compile(selector.replace(rtrim, "$1"));
                    return matcher[expando] ? markFunction(function(seed, matches, context, xml) {
                        // Match elements unmatched by `matcher`
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
                // "Whether an element is represented by a :lang() selector
                // is based solely on the element's language value
                // being equal to the identifier C,
                // or beginning with the identifier C immediately followed by "-".
                // The matching of C against the element's language value is performed case-insensitively.
                // The identifier C does not have to be a valid language name."
                // http://www.w3.org/TR/selectors/#lang-pseudo
                lang: markFunction(function(lang) {
                    return ridentifier.test(lang || "") || Sizzle.error("unsupported lang: " + lang), lang = lang.replace(runescape, funescape).toLowerCase(), function(elem) {
                        var elemLang;
                        do if (elemLang = documentIsXML ? elem.getAttribute("xml:lang") || elem.getAttribute("lang") : elem.lang) return (elemLang = elemLang.toLowerCase()) === lang || 0 === elemLang.indexOf(lang + "-");
                        while ((elem = elem.parentNode) && 1 === elem.nodeType)
                        return !1;
                    };
                }),
                // Miscellaneous
                target: function(elem) {
                    var hash = window1.location && window1.location.hash;
                    return hash && hash.slice(1) === elem.id;
                },
                root: function(elem) {
                    return elem === docElem;
                },
                focus: function(elem) {
                    return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
                },
                // Boolean properties
                enabled: function(elem) {
                    return !1 === elem.disabled;
                },
                disabled: function(elem) {
                    return !0 === elem.disabled;
                },
                checked: function(elem) {
                    // In CSS3, :checked should return both checked and selected elements
                    // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
                    var nodeName = elem.nodeName.toLowerCase();
                    return "input" === nodeName && !!elem.checked || "option" === nodeName && !!elem.selected;
                },
                selected: function(elem) {
                    return elem.parentNode && elem.parentNode.selectedIndex, !0 === elem.selected;
                },
                // Contents
                empty: function(elem) {
                    // http://www.w3.org/TR/selectors/#empty-pseudo
                    // :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
                    //   not comment, processing instructions, or others
                    // Thanks to Diego Perini for the nodeName shortcut
                    //   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
                    for(elem = elem.firstChild; elem; elem = elem.nextSibling)if (elem.nodeName > "@" || 3 === elem.nodeType || 4 === elem.nodeType) return !1;
                    return !0;
                },
                parent: function(elem) {
                    return !Expr.pseudos.empty(elem);
                },
                // Element/input types
                header: function(elem) {
                    return rheader.test(elem.nodeName);
                },
                input: function(elem) {
                    return rinputs.test(elem.nodeName);
                },
                button: function(elem) {
                    var name1 = elem.nodeName.toLowerCase();
                    return "input" === name1 && "button" === elem.type || "button" === name1;
                },
                text: function(elem) {
                    var attr;
                    // IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
                    // use getAttribute instead to test this case
                    return "input" === elem.nodeName.toLowerCase() && "text" === elem.type && (null == (attr = elem.getAttribute("type")) || attr.toLowerCase() === elem.type);
                },
                // Position-in-collection
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
        })Expr.pseudos[i] = // Returns a function to use in pseudos for input types
        function(type) {
            return function(elem) {
                return "input" === elem.nodeName.toLowerCase() && elem.type === type;
            };
        }(i);
        for(i in {
            submit: !0,
            reset: !0
        })Expr.pseudos[i] = // Returns a function to use in pseudos for buttons
        function(type) {
            return function(elem) {
                var name1 = elem.nodeName.toLowerCase();
                return ("input" === name1 || "button" === name1) && elem.type === type;
            };
        }(i);
        function tokenize(selector, parseOnly) {
            var matched, match, tokens, type, soFar, groups, preFilters, cached = tokenCache[selector + " "];
            if (cached) return parseOnly ? 0 : cached.slice(0);
            for(soFar = selector, groups = [], preFilters = Expr.preFilter; soFar;){
                // Filters
                for(type in (!matched || (match = rcomma.exec(soFar))) && (match && // Don't consume trailing commas as valid
                (soFar = soFar.slice(match[0].length) || soFar), groups.push(tokens = [])), matched = !1, (match = rcombinators.exec(soFar)) && (matched = match.shift(), tokens.push({
                    value: matched,
                    // Cast descendant combinators to space
                    type: match[0].replace(rtrim, " ")
                }), soFar = soFar.slice(matched.length)), Expr.filter)(match = matchExpr[type].exec(soFar)) && (!preFilters[type] || (match = preFilters[type](match))) && (matched = match.shift(), tokens.push({
                    value: matched,
                    type: type,
                    matches: match
                }), soFar = soFar.slice(matched.length));
                if (!matched) break;
            }
            // Return the length of the invalid excess
            // if we're just parsing
            // Otherwise, throw an error or return tokens
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
                // We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
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
        // Easy API for creating new setFilters
        function setFilters() {}
        compile = Sizzle.compile = function(selector, group /* Internal Use Only */ ) {
            var matcherCachedRuns, bySet, byElement, superMatcher, i, setMatchers = [], elementMatchers = [], cached = compilerCache[selector + " "];
            if (!cached) {
                for(group || (group = tokenize(selector)), i = group.length; i--;)(cached = function matcherFromTokens(tokens) {
                    for(var checkContext, matcher, j, len = tokens.length, leadingRelative = Expr.relative[tokens[0].type], implicitRelative = leadingRelative || Expr.relative[" "], i = leadingRelative ? 1 : 0, // The foundational matcher ensures that elements are reachable from top-level context(s)
                    matchContext = addCombinator(function(elem) {
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
                        // Return special upon seeing a positional matcher
                        if ((matcher = Expr.filter[tokens[i].type].apply(null, tokens[i].matches))[expando]) {
                            for(// Find the next relative operator (if any) for proper handling
                            j = ++i; j < len && !Expr.relative[tokens[j].type]; j++);
                            return function setMatcher(preFilter, selector, matcher, postFilter, postFinder, postSelector) {
                                return postFilter && !postFilter[expando] && (postFilter = setMatcher(postFilter)), postFinder && !postFinder[expando] && (postFinder = setMatcher(postFinder, postSelector)), markFunction(function(seed, results, context, xml) {
                                    var temp, i, elem, preMap = [], postMap = [], preexisting = results.length, // Get initial elements from seed or context
                                    elems = seed || function(selector, contexts, results) {
                                        for(var i = 0, len = contexts.length; i < len; i++)Sizzle(selector, contexts[i], results);
                                        return results;
                                    }(selector || "*", context.nodeType ? [
                                        context
                                    ] : context, []), // Prefilter to get matcher input, preserving a map for seed-results synchronization
                                    matcherIn = preFilter && (seed || !selector) ? condense(elems, preMap, preFilter, context, xml) : elems, matcherOut = matcher ? postFinder || (seed ? preFilter : preexisting || postFilter) ? [] : results : matcherIn;
                                    // Apply postFilter
                                    if (matcher && matcher(matcherIn, matcherOut, context, xml), postFilter) for(temp = condense(matcherOut, postMap), postFilter(temp, [], context, xml), // Un-match failing elements by moving them back to matcherIn
                                    i = temp.length; i--;)(elem = temp[i]) && (matcherOut[postMap[i]] = !(matcherIn[postMap[i]] = elem));
                                    if (seed) {
                                        if (postFinder || preFilter) {
                                            if (postFinder) {
                                                for(// Get the final matcherOut by condensing this intermediate into postFinder contexts
                                                temp = [], i = matcherOut.length; i--;)(elem = matcherOut[i]) && // Restore matcherIn since elem is not yet a final match
                                                temp.push(matcherIn[i] = elem);
                                                postFinder(null, matcherOut = [], temp, xml);
                                            }
                                            for(// Move matched elements from seed to results to keep them synchronized
                                            i = matcherOut.length; i--;)(elem = matcherOut[i]) && (temp = postFinder ? indexOf.call(seed, elem) : preMap[i]) > -1 && (seed[temp] = !(results[temp] = elem));
                                        }
                                    } else matcherOut = condense(matcherOut === results ? matcherOut.splice(preexisting, matcherOut.length) : matcherOut), postFinder ? postFinder(null, results, matcherOut, xml) : push.apply(results, matcherOut);
                                });
                            }(i > 1 && elementMatcher(matchers), i > 1 && toSelector(tokens.slice(0, i - 1)).replace(rtrim, "$1"), matcher, i < j && matcherFromTokens(tokens.slice(i, j)), j < len && matcherFromTokens(tokens = tokens.slice(j)), j < len && toSelector(tokens));
                        }
                        matchers.push(matcher);
                    }
                    return elementMatcher(matchers);
                }(group[i]))[expando] ? setMatchers.push(cached) : elementMatchers.push(cached);
                // Cache the compiled function
                cached = compilerCache(selector, (matcherCachedRuns = 0, bySet = setMatchers.length > 0, byElement = elementMatchers.length > 0, superMatcher = function(seed, context, xml, results, expandContext) {
                    var elem, j, matcher, setMatched = [], matchedCount = 0, i = "0", unmatched = seed && [], outermost = null != expandContext, contextBackup = outermostContext, // We must always have either seed elements or context
                    elems = seed || byElement && Expr.find.TAG("*", expandContext && context.parentNode || context), // Use integer dirruns iff this is the outermost matcher
                    dirrunsUnique = dirruns += null == contextBackup ? 1 : Math.random() || 0.1;
                    // Add elements passing elementMatchers directly to results
                    // Keep `i` a string if there are no elements so `matchedCount` will be "00" below
                    for(outermost && (outermostContext = context !== document && context, cachedruns = matcherCachedRuns); null != (elem = elems[i]); i++){
                        if (byElement && elem) {
                            for(j = 0; matcher = elementMatchers[j++];)if (matcher(elem, context, xml)) {
                                results.push(elem);
                                break;
                            }
                            outermost && (dirruns = dirrunsUnique, cachedruns = ++matcherCachedRuns);
                        }
                        // Track unmatched elements for set filters
                        bySet && ((elem = !matcher && elem) && matchedCount--, seed && unmatched.push(elem));
                    }
                    if (// Apply set filters to unmatched elements
                    matchedCount += i, bySet && i !== matchedCount) {
                        for(j = 0; matcher = setMatchers[j++];)matcher(unmatched, setMatched, context, xml);
                        if (seed) {
                            // Reintegrate element matches to eliminate the need for sorting
                            if (matchedCount > 0) for(; i--;)unmatched[i] || setMatched[i] || (setMatched[i] = pop.call(results));
                            // Discard index placeholder values to get only actual matches
                            setMatched = condense(setMatched);
                        }
                        // Add matches to results
                        push.apply(results, setMatched), outermost && !seed && setMatched.length > 0 && matchedCount + setMatchers.length > 1 && Sizzle.uniqueSort(results);
                    }
                    return outermost && (dirruns = dirrunsUnique, outermostContext = contextBackup), unmatched;
                }, bySet ? markFunction(superMatcher) : superMatcher));
            }
            return cached;
        }, // Deprecated
        Expr.pseudos.nth = Expr.pseudos.eq, Expr.filters = setFilters.prototype = Expr.pseudos, Expr.setFilters = new setFilters(), // Initialize with the default document
        setDocument(), // Override sizzle attribute retrieval
        Sizzle.attr = jQuery.attr, jQuery.find = Sizzle, jQuery.expr = Sizzle.selectors, jQuery.expr[":"] = jQuery.expr.pseudos, jQuery.unique = Sizzle.uniqueSort, jQuery.text = Sizzle.getText, jQuery.isXMLDoc = Sizzle.isXML, jQuery.contains = Sizzle.contains;
    }(window1);
    var runtil = /Until$/, rparentsprev = /^(?:parents|prev(?:Until|All))/, isSimple = /^.[^:#\[\.,]*$/, rneedsContext = jQuery.expr.match.needsContext, // methods guaranteed to produce a unique set when starting from a unique set
    guaranteedUnique = {
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
    // Implement the identical functionality for filter and not
    function winnow(elements, qualifier, keep) {
        if (// Can't pass null or undefined to indexOf in Firefox 4
        // Set to 0 to skip string check
        qualifier = qualifier || 0, jQuery.isFunction(qualifier)) return jQuery.grep(elements, function(elem, i) {
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
            return(// Needed because $( selector, context ) becomes $( context ).find( selector )
            (ret = this.pushStack(len > 1 ? jQuery.unique(ret) : ret)).selector = (this.selector ? this.selector + " " : "") + selector, ret);
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
            return !!selector && ("string" == typeof selector ? // so $("p:first").is("p:last") won't return true for a doc with two "p".
            rneedsContext.test(selector) ? jQuery(selector, this.context).index(this[0]) >= 0 : jQuery.filter(selector, this).length > 0 : this.filter(selector).length > 0);
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
        // Determine the position of an element within
        // the matched set of elements
        index: function(elem) {
            return(// No argument, return index in parent
            elem ? "string" == typeof elem ? jQuery.inArray(this[0], jQuery(elem)) : jQuery.inArray(// If it receives a jQuery object, the first element is used
            elem.jquery ? elem[0] : elem, this) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1);
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
    }, function(name1, fn) {
        jQuery.fn[name1] = function(until, selector) {
            var ret = jQuery.map(this, fn, until);
            return runtil.test(name1) || (selector = until), selector && "string" == typeof selector && (ret = jQuery.filter(selector, ret)), ret = this.length > 1 && !guaranteedUnique[name1] ? jQuery.unique(ret) : ret, this.length > 1 && rparentsprev.test(name1) && (ret = ret.reverse()), this.pushStack(ret);
        };
    }), jQuery.extend({
        filter: function(expr, elems, not) {
            return not && (expr = ":not(" + expr + ")"), 1 === elems.length ? jQuery.find.matchesSelector(elems[0], expr) ? [
                elems[0]
            ] : [] : jQuery.find.matches(expr, elems);
        },
        dir: function(elem, dir, until) {
            for(var matched = [], cur = elem[dir]; cur && 9 !== cur.nodeType && (undefined === until || 1 !== cur.nodeType || !jQuery(cur).is(until));)1 === cur.nodeType && matched.push(cur), cur = cur[dir];
            return matched;
        },
        sibling: function(n, elem) {
            for(var r = []; n; n = n.nextSibling)1 === n.nodeType && n !== elem && r.push(n);
            return r;
        }
    });
    var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video", rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g, rnoshimcache = RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"), rleadingWhitespace = /^\s+/, rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, rtagName = /<([\w:]+)/, rtbody = /<tbody/i, rhtml = /<|&#?\w+;/, rnoInnerhtml = /<(?:script|style|link)/i, manipulation_rcheckableType = /^(?:checkbox|radio)$/i, // checked="checked" or checked
    rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i, rscriptType = /^$|\/(?:java|ecma)script/i, rscriptTypeMasked = /^true\/(.*)/, rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g, // We have to close these tags to support XHTML (#13200)
    wrapMap = {
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
        // IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
        // unless wrapped in a div with non-breaking characters in front of it.
        _default: jQuery.support.htmlSerialize ? [
            0,
            "",
            ""
        ] : [
            1,
            "X<div>",
            "</div>"
        ]
    }, fragmentDiv = createSafeFragment(document).appendChild(document.createElement("div"));
    // Replace/restore the type attribute of script elements for safe DOM manipulation
    function disableScript(elem) {
        var attr = elem.getAttributeNode("type");
        return elem.type = (attr && attr.specified) + "/" + elem.type, elem;
    }
    function restoreScript(elem) {
        var match = rscriptTypeMasked.exec(elem.type);
        return match ? elem.type = match[1] : elem.removeAttribute("type"), elem;
    }
    // Mark scripts as having already been evaluated
    function setGlobalEval(elems, refElements) {
        for(var elem, i = 0; null != (elem = elems[i]); i++)jQuery._data(elem, "globalEval", !refElements || jQuery._data(refElements[i], "globalEval"));
    }
    function cloneCopyEvent(src, dest) {
        if (1 === dest.nodeType && jQuery.hasData(src)) {
            var type, i, l, oldData = jQuery._data(src), curData = jQuery._data(dest, oldData), events = oldData.events;
            if (events) for(type in delete curData.handle, curData.events = {}, events)for(i = 0, l = events[type].length; i < l; i++)jQuery.event.add(dest, type, events[type][i]);
            // make the cloned public data object a copy from the original
            curData.data && (curData.data = jQuery.extend({}, curData.data));
        }
    }
    function getAll(context, tag) {
        var elems, elem, i = 0, found = typeof context.getElementsByTagName !== core_strundefined ? context.getElementsByTagName(tag || "*") : typeof context.querySelectorAll !== core_strundefined ? context.querySelectorAll(tag || "*") : undefined;
        if (!found) for(found = [], elems = context.childNodes || context; null != (elem = elems[i]); i++)!tag || jQuery.nodeName(elem, tag) ? found.push(elem) : jQuery.merge(found, getAll(elem, tag));
        return undefined === tag || tag && jQuery.nodeName(context, tag) ? jQuery.merge([
            context
        ], found) : found;
    }
    // Used in buildFragment, fixes the defaultChecked property
    function fixDefaultChecked(elem) {
        manipulation_rcheckableType.test(elem.type) && (elem.defaultChecked = elem.checked);
    }
    wrapMap.optgroup = wrapMap.option, wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead, wrapMap.th = wrapMap.td, jQuery.fn.extend({
        text: function(value) {
            return jQuery.access(this, function(value) {
                return undefined === value ? jQuery.text(this) : this.empty().append((this[0] && this[0].ownerDocument || document).createTextNode(value));
            }, null, value, arguments.length);
        },
        wrapAll: function(html) {
            if (jQuery.isFunction(html)) return this.each(function(i) {
                jQuery(this).wrapAll(html.call(this, i));
            });
            if (this[0]) {
                // The elements to wrap the target around
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
        // keepData is for internal use only--do not document
        remove: function(selector, keepData) {
            for(var elem, i = 0; null != (elem = this[i]); i++)(!selector || jQuery.filter(selector, [
                elem
            ]).length > 0) && (keepData || 1 !== elem.nodeType || jQuery.cleanData(getAll(elem)), elem.parentNode && (keepData && jQuery.contains(elem.ownerDocument, elem) && setGlobalEval(getAll(elem, "script")), elem.parentNode.removeChild(elem)));
            return this;
        },
        empty: function() {
            for(var elem, i = 0; null != (elem = this[i]); i++){
                // Remove any remaining nodes
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
        html: function(value) {
            return jQuery.access(this, function(value) {
                var elem = this[0] || {}, i = 0, l = this.length;
                if (undefined === value) return 1 === elem.nodeType ? elem.innerHTML.replace(rinlinejQuery, "") : undefined;
                // See if we can take a shortcut and just use innerHTML
                if ("string" == typeof value && !rnoInnerhtml.test(value) && (jQuery.support.htmlSerialize || !rnoshimcache.test(value)) && (jQuery.support.leadingWhitespace || !rleadingWhitespace.test(value)) && !wrapMap[(rtagName.exec(value) || [
                    "",
                    ""
                ])[1].toLowerCase()]) {
                    value = value.replace(rxhtmlTag, "<$1></$2>");
                    try {
                        for(; i < l; i++)// Remove element nodes and prevent memory leaks
                        elem = this[i] || {}, 1 === elem.nodeType && (jQuery.cleanData(getAll(elem, !1)), elem.innerHTML = value);
                        elem = 0;
                    // If using innerHTML throws an exception, use the fallback method
                    } catch (e) {}
                }
                elem && this.empty().append(value);
            }, null, value, arguments.length);
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
            // Flatten any nested arrays
            args = core_concat.apply([], args);
            var elem, tag, first, node, hasScripts, scripts, doc, fragment, i = 0, l = this.length, set = this, iNoClone = l - 1, value = args[0], isFunction = jQuery.isFunction(value);
            // We can't cloneNode fragments that contain checked, in WebKit
            if (isFunction || !(l <= 1 || "string" != typeof value || jQuery.support.checkClone || !rchecked.test(value))) return this.each(function(index) {
                var self = set.eq(index);
                isFunction && (args[0] = value.call(this, index, table ? self.html() : undefined)), self.domManip(args, table, callback);
            });
            if (l && (first = (fragment = jQuery.buildFragment(args, this[0].ownerDocument, !1, this)).firstChild, 1 === fragment.childNodes.length && (fragment = first), first)) {
                // Use the original fragment for the last item instead of the first because it can end up
                // being emptied incorrectly in certain situations (#8070).
                for(table = table && jQuery.nodeName(first, "tr"), hasScripts = (scripts = jQuery.map(getAll(fragment, "script"), disableScript)).length; i < l; i++){
                    node = fragment, i !== iNoClone && (node = jQuery.clone(node, !0, !0), hasScripts && jQuery.merge(scripts, getAll(node, "script"))), callback.call(table && jQuery.nodeName(this[i], "table") ? (elem = this[i], tag = "tbody", elem.getElementsByTagName(tag)[0] || elem.appendChild(elem.ownerDocument.createElement(tag))) : this[i], node, i);
                }
                if (hasScripts) // Evaluate executable scripts on first document insertion
                for(doc = scripts[scripts.length - 1].ownerDocument, // Reenable scripts
                jQuery.map(scripts, restoreScript), i = 0; i < hasScripts; i++)node = scripts[i], rscriptType.test(node.type || "") && !jQuery._data(node, "globalEval") && jQuery.contains(doc, node) && (node.src ? // Hope ajax is available...
                jQuery.ajax({
                    url: node.src,
                    type: "GET",
                    dataType: "script",
                    async: !1,
                    global: !1,
                    throws: !0
                }) : jQuery.globalEval((node.text || node.textContent || node.innerHTML || "").replace(rcleanScript, "")));
                // Fix #11809: Avoid leaking memory
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
    }, function(name1, original) {
        jQuery.fn[name1] = function(selector) {
            for(var elems, i = 0, ret = [], insert = jQuery(selector), last = insert.length - 1; i <= last; i++)elems = i === last ? this : this.clone(!0), jQuery(insert[i])[original](elems), // Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
            core_push.apply(ret, elems.get());
            return this.pushStack(ret);
        };
    }), jQuery.extend({
        clone: function(elem, dataAndEvents, deepDataAndEvents) {
            var destElements, node, clone, i, srcElements, inPage = jQuery.contains(elem.ownerDocument, elem);
            if (jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test("<" + elem.nodeName + ">") ? clone = elem.cloneNode(!0) : (fragmentDiv.innerHTML = elem.outerHTML, fragmentDiv.removeChild(clone = fragmentDiv.firstChild)), (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) && (1 === elem.nodeType || 11 === elem.nodeType) && !jQuery.isXMLDoc(elem)) // Fix all IE cloning issues
            for(i = 0, // We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
            destElements = getAll(clone), srcElements = getAll(elem); null != (node = srcElements[i]); ++i)// Ensure that the destination node is not null; Fixes #9587
            destElements[i] && function(src, dest) {
                var nodeName, e, data;
                // We do not need to do anything for non-Elements
                if (1 === dest.nodeType) {
                    // IE6-8 copies events bound via attachEvent when using cloneNode.
                    if (nodeName = dest.nodeName.toLowerCase(), !jQuery.support.noCloneEvent && dest[jQuery.expando]) {
                        for(e in (data = jQuery._data(dest)).events)jQuery.removeEvent(dest, e, data.handle);
                        // Event data gets referenced instead of copied if the expando gets copied too
                        dest.removeAttribute(jQuery.expando);
                    }
                    "script" === nodeName && dest.text !== src.text ? (disableScript(dest).text = src.text, restoreScript(dest)) : "object" === nodeName ? (dest.parentNode && (dest.outerHTML = src.outerHTML), jQuery.support.html5Clone && src.innerHTML && !jQuery.trim(dest.innerHTML) && (dest.innerHTML = src.innerHTML)) : "input" === nodeName && manipulation_rcheckableType.test(src.type) ? (// IE6-8 fails to persist the checked state of a cloned checkbox
                    // or radio button. Worse, IE6-7 fail to give the cloned element
                    // a checked appearance if the defaultChecked value isn't also set
                    dest.defaultChecked = dest.checked = src.checked, dest.value !== src.value && (dest.value = src.value)) : "option" === nodeName ? dest.defaultSelected = dest.selected = src.defaultSelected : ("input" === nodeName || "textarea" === nodeName) && (dest.defaultValue = src.defaultValue);
                }
            }(node, destElements[i]);
            // Copy the events from the original to the clone
            if (dataAndEvents) {
                if (deepDataAndEvents) for(i = 0, srcElements = srcElements || getAll(elem), destElements = destElements || getAll(clone); null != (node = srcElements[i]); i++)cloneCopyEvent(node, destElements[i]);
                else cloneCopyEvent(elem, clone);
            }
            // Return the cloned set
            return(// Preserve script evaluation history
            (destElements = getAll(clone, "script")).length > 0 && setGlobalEval(destElements, !inPage && getAll(elem, "script")), destElements = srcElements = node = null, clone);
        },
        buildFragment: function(elems, context, scripts, selection) {
            for(var j, elem, contains, tmp, tag, tbody, wrap, l = elems.length, // Ensure a safe fragment
            safe = createSafeFragment(context), nodes = [], i = 0; i < l; i++)if ((elem = elems[i]) || 0 === elem) {
                // Add nodes directly
                if ("object" === jQuery.type(elem)) jQuery.merge(nodes, elem.nodeType ? [
                    elem
                ] : elem);
                else if (rhtml.test(elem)) {
                    for(tmp = tmp || safe.appendChild(context.createElement("div")), wrap = wrapMap[// Deserialize a standard representation
                    tag = (rtagName.exec(elem) || [
                        "",
                        ""
                    ])[1].toLowerCase()] || wrapMap._default, tmp.innerHTML = wrap[1] + elem.replace(rxhtmlTag, "<$1></$2>") + wrap[2], // Descend through wrappers to the right content
                    j = wrap[0]; j--;)tmp = tmp.lastChild;
                    // Remove IE's autoinserted <tbody> from table fragments
                    if (!jQuery.support.leadingWhitespace && rleadingWhitespace.test(elem) && nodes.push(context.createTextNode(rleadingWhitespace.exec(elem)[0])), !jQuery.support.tbody) for(j = // String was a <table>, *may* have spurious <tbody>
                    (elem = "table" !== tag || rtbody.test(elem) ? "<table>" !== wrap[1] || rtbody.test(elem) ? 0 : tmp : tmp.firstChild) && elem.childNodes.length; j--;)jQuery.nodeName(tbody = elem.childNodes[j], "tbody") && !tbody.childNodes.length && elem.removeChild(tbody);
                    // Fix #12392 for oldIE
                    for(jQuery.merge(nodes, tmp.childNodes), // Fix #12392 for WebKit and IE > 9
                    tmp.textContent = ""; tmp.firstChild;)tmp.removeChild(tmp.firstChild);
                    // Remember the top-level container for proper cleanup
                    tmp = safe.lastChild;
                } else nodes.push(context.createTextNode(elem));
            }
            for(tmp && safe.removeChild(tmp), jQuery.support.appendChecked || jQuery.grep(getAll(nodes, "input"), fixDefaultChecked), i = 0; elem = nodes[i++];)// #4087 - If origin and destination elements are the same, and this is
            // that element, do not do anything
            if ((!selection || -1 === jQuery.inArray(elem, selection)) && (contains = jQuery.contains(elem.ownerDocument, elem), // Append to fragment
            tmp = getAll(safe.appendChild(elem), "script"), contains && setGlobalEval(tmp), scripts)) for(j = 0; elem = tmp[j++];)rscriptType.test(elem.type || "") && scripts.push(elem);
            return tmp = null, safe;
        },
        cleanData: function(elems, /* internal */ acceptData) {
            for(var elem, type, id, data, i = 0, internalKey = jQuery.expando, cache = jQuery.cache, deleteExpando = jQuery.support.deleteExpando, special = jQuery.event.special; null != (elem = elems[i]); i++)if ((acceptData || jQuery.acceptData(elem)) && (data = (id = elem[internalKey]) && cache[id])) {
                if (data.events) for(type in data.events)special[type] ? jQuery.event.remove(elem, type) : jQuery.removeEvent(elem, type, data.handle);
                // Remove cache only if it was not already removed by jQuery.event.remove
                cache[id] && (delete cache[id], deleteExpando ? delete elem[internalKey] : typeof elem.removeAttribute !== core_strundefined ? elem.removeAttribute(internalKey) : elem[internalKey] = null, core_deletedIds.push(id));
            }
        }
    });
    var iframe, getStyles, curCSS, ralpha = /alpha\([^)]*\)/i, ropacity = /opacity\s*=\s*([^)]*)/, rposition = /^(top|right|bottom|left)$/, // swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
    // see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
    rdisplayswap = /^(none|table(?!-c[ea]).+)/, rmargin = /^margin/, rnumsplit = RegExp("^(" + core_pnum + ")(.*)$", "i"), rnumnonpx = RegExp("^(" + core_pnum + ")(?!px)[a-z%]+$", "i"), rrelNum = RegExp("^([+-])=(" + core_pnum + ")", "i"), elemdisplay = {
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
    // return a css property mapped to a potentially vendor prefixed property
    function vendorPropName(style, name1) {
        // shortcut for names that are not vendor prefixed
        if (name1 in style) return name1;
        for(// check for vendor prefixed names
        var capName = name1.charAt(0).toUpperCase() + name1.slice(1), origName = name1, i = cssPrefixes.length; i--;)if ((name1 = cssPrefixes[i] + capName) in style) return name1;
        return origName;
    }
    function isHidden(elem, el) {
        return(// isHidden might be called from jQuery#filter function;
        // in that case, element will be second argument
        elem = el || elem, "none" === jQuery.css(elem, "display") || !jQuery.contains(elem.ownerDocument, elem));
    }
    function showHide(elements, show) {
        for(var display, elem, hidden, values = [], index = 0, length = elements.length; index < length; index++)(elem = elements[index]).style && (values[index] = jQuery._data(elem, "olddisplay"), display = elem.style.display, show ? (values[index] || "none" !== display || (elem.style.display = ""), "" === elem.style.display && isHidden(elem) && (values[index] = jQuery._data(elem, "olddisplay", css_defaultDisplay(elem.nodeName)))) : values[index] || (hidden = isHidden(elem), (display && "none" !== display || !hidden) && jQuery._data(elem, "olddisplay", hidden ? display : jQuery.css(elem, "display"))));
        // Set the display of most of the elements in a second loop
        // to avoid the constant reflow
        for(index = 0; index < length; index++)(elem = elements[index]).style && (show && "none" !== elem.style.display && "" !== elem.style.display || (elem.style.display = show ? values[index] || "" : "none"));
        return elements;
    }
    function setPositiveNumber(elem, value, subtract) {
        var matches = rnumsplit.exec(value);
        return matches ? Math.max(0, matches[1] - (subtract || 0)) + (matches[2] || "px") : value;
    }
    function augmentWidthOrHeight(elem, name1, extra, isBorderBox, styles) {
        for(var i = extra === (isBorderBox ? "border" : "content") ? 4 : "width" === name1 ? 1 : 0, val = 0; i < 4; i += 2)"margin" === extra && (val += jQuery.css(elem, extra + cssExpand[i], !0, styles)), isBorderBox ? ("content" === extra && (val -= jQuery.css(elem, "padding" + cssExpand[i], !0, styles)), "margin" !== extra && (val -= jQuery.css(elem, "border" + cssExpand[i] + "Width", !0, styles))) : (// at this point, extra isn't content, so add padding
        val += jQuery.css(elem, "padding" + cssExpand[i], !0, styles), "padding" !== extra && (val += jQuery.css(elem, "border" + cssExpand[i] + "Width", !0, styles)));
        return val;
    }
    function getWidthOrHeight(elem, name1, extra) {
        // Start with offset property, which is equivalent to the border-box value
        var valueIsBorderBox = !0, val = "width" === name1 ? elem.offsetWidth : elem.offsetHeight, styles = getStyles(elem), isBorderBox = jQuery.support.boxSizing && "border-box" === jQuery.css(elem, "boxSizing", !1, styles);
        // some non-html elements return undefined for offsetWidth, so check for null/undefined
        // svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
        // MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
        if (val <= 0 || null == val) {
            // Computed unit is not pixels. Stop here and return.
            if ((// Fall back to computed then uncomputed css if necessary
            (val = curCSS(elem, name1, styles)) < 0 || null == val) && (val = elem.style[name1]), rnumnonpx.test(val)) return val;
            // we need the check for style in case a browser which returns unreliable values
            // for getComputedStyle silently falls back to the reliable elem.style
            valueIsBorderBox = isBorderBox && (jQuery.support.boxSizingReliable || val === elem.style[name1]), // Normalize "", auto, and prepare for extra
            val = parseFloat(val) || 0;
        }
        // use the active box-sizing model to add/subtract irrelevant styles
        return val + augmentWidthOrHeight(elem, name1, extra || (isBorderBox ? "border" : "content"), valueIsBorderBox, styles) + "px";
    }
    // Try to determine the default display value of an element
    function css_defaultDisplay(nodeName) {
        var doc = document, display = elemdisplay[nodeName];
        return display || ("none" !== (display = actualDisplay(nodeName, doc)) && display || (// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
        (doc = (// Use the already-created iframe if possible
        (iframe = (iframe || jQuery("<iframe frameborder='0' width='0' height='0'/>").css("cssText", "display:block !important")).appendTo(doc.documentElement))[0].contentWindow || iframe[0].contentDocument).document).write("<!doctype html><html><body>"), doc.close(), display = actualDisplay(nodeName, doc), iframe.detach()), // Store the correct default display
        elemdisplay[nodeName] = display), display;
    }
    // Called ONLY from within css_defaultDisplay
    function actualDisplay(name1, doc) {
        var elem = jQuery(doc.createElement(name1)).appendTo(doc.body), display = jQuery.css(elem[0], "display");
        return elem.remove(), display;
    }
    jQuery.fn.extend({
        css: function(name1, value) {
            return jQuery.access(this, function(elem, name1, value) {
                var len, styles, map = {}, i = 0;
                if (jQuery.isArray(name1)) {
                    for(styles = getStyles(elem), len = name1.length; i < len; i++)map[name1[i]] = jQuery.css(elem, name1[i], !1, styles);
                    return map;
                }
                return undefined !== value ? jQuery.style(elem, name1, value) : jQuery.css(elem, name1);
            }, name1, value, arguments.length > 1);
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
        // Add in style property hooks for overriding the default
        // behavior of getting and setting a style property
        cssHooks: {
            opacity: {
                get: function(elem, computed) {
                    if (computed) {
                        // We should always get a number back from opacity
                        var ret = curCSS(elem, "opacity");
                        return "" === ret ? "1" : ret;
                    }
                }
            }
        },
        // Exclude the following css properties to add px
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
        // Add in properties whose names you wish to fix before
        // setting or getting the value
        cssProps: {
            // normalize float css property
            float: jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
        },
        // Get and set the style property on a DOM Node
        style: function(elem, name1, value, extra) {
            // Don't set styles on text and comment nodes
            if (elem && 3 !== elem.nodeType && 8 !== elem.nodeType && elem.style) {
                // Make sure that we're working with the right name
                var ret, type, hooks, origName = jQuery.camelCase(name1), style = elem.style;
                // Check if we're setting a value
                if (name1 = jQuery.cssProps[origName] || (jQuery.cssProps[origName] = vendorPropName(style, origName)), // gets hook for the prefixed version
                // followed by the unprefixed version
                hooks = jQuery.cssHooks[name1] || jQuery.cssHooks[origName], undefined === value) return(// If a hook was provided get the non-computed value from there
                hooks && "get" in hooks && (ret = hooks.get(elem, !1, extra)) !== undefined ? ret : style[name1]);
                // Make sure that NaN and null values aren't set. See: #7116
                if ("string" == (type = typeof value) && (ret = rrelNum.exec(value)) && (value = (ret[1] + 1) * ret[2] + parseFloat(jQuery.css(elem, name1)), // Fixes bug #9237
                type = "number"), !(null == value || "number" === type && isNaN(value))) // If a hook was provided, use that value, otherwise just set the specified value
                {
                    if ("number" !== type || jQuery.cssNumber[origName] || (value += "px"), jQuery.support.clearCloneStyle || "" !== value || 0 !== name1.indexOf("background") || (style[name1] = "inherit"), !hooks || !("set" in hooks) || (value = hooks.set(elem, value, extra)) !== undefined) // Wrapped to prevent IE from throwing errors when 'invalid' values are provided
                    // Fixes bug #5509
                    try {
                        style[name1] = value;
                    } catch (e) {}
                }
            }
        },
        css: function(elem, name1, extra, styles) {
            var num, val, hooks, origName = jQuery.camelCase(name1);
            return(// Return, converting to number if forced or a qualifier was provided and val looks numeric
            (// Make sure that we're working with the right name
            name1 = jQuery.cssProps[origName] || (jQuery.cssProps[origName] = vendorPropName(elem.style, origName)), // gets hook for the prefixed version
            // followed by the unprefixed version
            (hooks = jQuery.cssHooks[name1] || jQuery.cssHooks[origName]) && "get" in hooks && (val = hooks.get(elem, !0, extra)), undefined === val && (val = curCSS(elem, name1, styles)), "normal" === val && name1 in cssNormalTransform && (val = cssNormalTransform[name1]), "" === extra || extra) ? (num = parseFloat(val), !0 === extra || jQuery.isNumeric(num) ? num || 0 : val) : val);
        },
        // A method for quickly swapping in/out CSS properties to get correct calculations
        swap: function(elem, options, callback, args) {
            var ret, name1, old = {};
            // Remember the old values, and insert the new ones
            for(name1 in options)old[name1] = elem.style[name1], elem.style[name1] = options[name1];
            // Revert the old values
            for(name1 in ret = callback.apply(elem, args || []), options)elem.style[name1] = old[name1];
            return ret;
        }
    }), window1.getComputedStyle ? (getStyles = function(elem) {
        return window1.getComputedStyle(elem, null);
    }, curCSS = function(elem, name1, _computed) {
        var width, minWidth, maxWidth, computed = _computed || getStyles(elem), // getPropertyValue is only needed for .css('filter') in IE9, see #12537
        ret = computed ? computed.getPropertyValue(name1) || computed[name1] : undefined, style = elem.style;
        return computed && ("" !== ret || jQuery.contains(elem.ownerDocument, elem) || (ret = jQuery.style(elem, name1)), rnumnonpx.test(ret) && rmargin.test(name1) && (// Remember the original values
        width = style.width, minWidth = style.minWidth, maxWidth = style.maxWidth, // Put in the new values to get a computed value out
        style.minWidth = style.maxWidth = style.width = ret, ret = computed.width, // Revert the changed values
        style.width = width, style.minWidth = minWidth, style.maxWidth = maxWidth)), ret;
    }) : document.documentElement.currentStyle && (getStyles = function(elem) {
        return elem.currentStyle;
    }, curCSS = function(elem, name1, _computed) {
        var left, rs, rsLeft, computed = _computed || getStyles(elem), ret = computed ? computed[name1] : undefined, style = elem.style;
        return null == ret && style && style[name1] && (ret = style[name1]), rnumnonpx.test(ret) && !rposition.test(name1) && (// Remember the original values
        left = style.left, (rsLeft = (rs = elem.runtimeStyle) && rs.left) && (rs.left = elem.currentStyle.left), style.left = "fontSize" === name1 ? "1em" : ret, ret = style.pixelLeft + "px", // Revert the changed values
        style.left = left, rsLeft && (rs.left = rsLeft)), "" === ret ? "auto" : ret;
    }), jQuery.each([
        "height",
        "width"
    ], function(i, name1) {
        jQuery.cssHooks[name1] = {
            get: function(elem, computed, extra) {
                if (computed) // certain elements can have dimension info if we invisibly show them
                // however, it must have a current display style that would benefit from this
                return 0 === elem.offsetWidth && rdisplayswap.test(jQuery.css(elem, "display")) ? jQuery.swap(elem, cssShow, function() {
                    return getWidthOrHeight(elem, name1, extra);
                }) : getWidthOrHeight(elem, name1, extra);
            },
            set: function(elem, value, extra) {
                var styles = extra && getStyles(elem);
                return setPositiveNumber(elem, value, extra ? augmentWidthOrHeight(elem, name1, extra, jQuery.support.boxSizing && "border-box" === jQuery.css(elem, "boxSizing", !1, styles), styles) : 0);
            }
        };
    }), jQuery.support.opacity || (jQuery.cssHooks.opacity = {
        get: function(elem, computed) {
            // IE uses filters for opacity
            return ropacity.test((computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "") ? 0.01 * parseFloat(RegExp.$1) + "" : computed ? "1" : "";
        },
        set: function(elem, value) {
            var style = elem.style, currentStyle = elem.currentStyle, opacity = jQuery.isNumeric(value) ? "alpha(opacity=" + 100 * value + ")" : "", filter = currentStyle && currentStyle.filter || style.filter || "";
            // if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
            // if value === "", then remove inline opacity #12685
            // IE has trouble with opacity if it does not have layout
            // Force it by setting the zoom level
            style.zoom = 1, (!(value >= 1) && "" !== value || "" !== jQuery.trim(filter.replace(ralpha, "")) || !style.removeAttribute || (// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
            // if "filter:" is present at all, clearType is disabled, we want to avoid this
            // style.removeAttribute is IE Only, but so apparently is this code path...
            style.removeAttribute("filter"), "" !== value && (!currentStyle || currentStyle.filter))) && // otherwise, set new filter values
            (style.filter = ralpha.test(filter) ? filter.replace(ralpha, opacity) : filter + " " + opacity);
        }
    }), // These hooks cannot be added until DOM ready because the support test
    // for it is not run until after DOM ready
    jQuery(function() {
        jQuery.support.reliableMarginRight || (jQuery.cssHooks.marginRight = {
            get: function(elem, computed) {
                if (computed) // WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
                // Work around by temporarily setting element display to inline-block
                return jQuery.swap(elem, {
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
                    if (computed) // if curCSS returns percentage, fallback to offset
                    return computed = curCSS(elem, prop), rnumnonpx.test(computed) ? jQuery(elem).position()[prop] + "px" : computed;
                }
            };
        });
    }), jQuery.expr && jQuery.expr.filters && (jQuery.expr.filters.hidden = function(elem) {
        // Support: Opera <= 12.12
        // Opera reports offsetWidths and offsetHeights less than zero on some elements
        return elem.offsetWidth <= 0 && elem.offsetHeight <= 0 || !jQuery.support.reliableHiddenOffsets && "none" === (elem.style && elem.style.display || jQuery.css(elem, "display"));
    }, jQuery.expr.filters.visible = function(elem) {
        return !jQuery.expr.filters.hidden(elem);
    }), // These hooks are used by animate to expand properties
    jQuery.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function(prefix, suffix) {
        jQuery.cssHooks[prefix + suffix] = {
            expand: function(value) {
                for(var i = 0, expanded = {}, // assumes a single number if not a string
                parts = "string" == typeof value ? value.split(" ") : [
                    value
                ]; i < 4; i++)expanded[prefix + cssExpand[i] + suffix] = parts[i] || parts[i - 2] || parts[0];
                return expanded;
            }
        }, rmargin.test(prefix) || (jQuery.cssHooks[prefix + suffix].set = setPositiveNumber);
    });
    var r20 = /%20/g, rbracket = /\[\]$/, rCRLF = /\r?\n/g, rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i, rsubmittable = /^(?:input|select|textarea|keygen)/i;
    jQuery.fn.extend({
        serialize: function() {
            return jQuery.param(this.serializeArray());
        },
        serializeArray: function() {
            return this.map(function() {
                // Can add propHook for "elements" to filter or add form elements
                var elements = jQuery.prop(this, "elements");
                return elements ? jQuery.makeArray(elements) : this;
            }).filter(function() {
                var type = this.type;
                // Use .is(":disabled") so that fieldset[disabled] works
                return this.name && !jQuery(this).is(":disabled") && rsubmittable.test(this.nodeName) && !rsubmitterTypes.test(type) && (this.checked || !manipulation_rcheckableType.test(type));
            }).map(function(i, elem) {
                var val = jQuery(this).val();
                return null == val ? null : jQuery.isArray(val) ? jQuery.map(val, function(val) {
                    return {
                        name: elem.name,
                        value: val.replace(rCRLF, "\r\n")
                    };
                }) : {
                    name: elem.name,
                    value: val.replace(rCRLF, "\r\n")
                };
            }).get();
        }
    }), //Serialize an array of form elements or a set of
    //key/values into a query string
    jQuery.param = function(a, traditional) {
        var prefix, s = [], add = function(key, value) {
            // If value is a function, invoke it and return its value
            value = jQuery.isFunction(value) ? value() : null == value ? "" : value, s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
        };
        // If an array was passed in, assume that it is an array of form elements.
        if (undefined === traditional && (traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional), jQuery.isArray(a) || a.jquery && !jQuery.isPlainObject(a)) // Serialize the form elements
        jQuery.each(a, function() {
            add(this.name, this.value);
        });
        else // If traditional, encode the "old" way (the way 1.3.2 or older
        // did it), otherwise encode params recursively.
        for(prefix in a)(function buildParams(prefix, obj, traditional, add) {
            var name1;
            if (jQuery.isArray(obj)) // Serialize array item.
            jQuery.each(obj, function(i, v) {
                traditional || rbracket.test(prefix) ? // Treat each array item as a scalar.
                add(prefix, v) : // Item is non-scalar (array or object), encode its numeric index.
                buildParams(prefix + "[" + ("object" == typeof v ? i : "") + "]", v, traditional, add);
            });
            else if (traditional || "object" !== jQuery.type(obj)) // Serialize scalar item.
            add(prefix, obj);
            else // Serialize object item.
            for(name1 in obj)buildParams(prefix + "[" + name1 + "]", obj[name1], traditional, add);
        })(prefix, a[prefix], traditional, add);
        // Return the resulting serialization
        return s.join("&").replace(r20, "+");
    }, jQuery.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(i, name1) {
        // Handle event binding
        jQuery.fn[name1] = function(data, fn) {
            return arguments.length > 0 ? this.on(name1, null, data, fn) : this.trigger(name1);
        };
    }), jQuery.fn.hover = function(fnOver, fnOut) {
        return this.mouseenter(fnOver).mouseleave(fnOut || fnOver);
    };
    var ajaxLocParts, ajaxLocation, ajax_nonce = jQuery.now(), ajax_rquery = /\?/, rhash = /#.*$/, rts = /([?&])_=[^&]*/, rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm, rnoContent = /^(?:GET|HEAD)$/, rprotocol = /^\/\//, rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/, // Keep a copy of the old load method
    _load = jQuery.fn.load, /* Prefilters
     * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
     * 2) These are called:
     *    - BEFORE asking for a transport
     *    - AFTER param serialization (s.data is a string if s.processData is true)
     * 3) key is the dataType
     * 4) the catchall symbol "*" can be used
     * 5) execution will start with transport dataType and THEN continue down to "*" if needed
     */ prefilters = {}, /* Transports bindings
     * 1) key is the dataType
     * 2) the catchall symbol "*" can be used
     * 3) selection will start with transport dataType and THEN go to "*" if needed
     */ transports = {}, // Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
    allTypes = "*/".concat("*");
    // #8138, IE may throw an exception when accessing
    // a field from window.location if document.domain has been set
    try {
        ajaxLocation = location.href;
    } catch (e) {
        // Use the href attribute of an A element
        // since IE will modify it given document.location
        (ajaxLocation = document.createElement("a")).href = "", ajaxLocation = ajaxLocation.href;
    }
    // Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
    function addToPrefiltersOrTransports(structure) {
        // dataTypeExpression is optional and defaults to "*"
        return function(dataTypeExpression, func) {
            "string" != typeof dataTypeExpression && (func = dataTypeExpression, dataTypeExpression = "*");
            var dataType, i = 0, dataTypes = dataTypeExpression.toLowerCase().match(core_rnotwhite) || [];
            if (jQuery.isFunction(func)) // For each dataType in the dataTypeExpression
            for(; dataType = dataTypes[i++];)// Prepend if requested
            "+" === dataType[0] ? (structure[dataType = dataType.slice(1) || "*"] = structure[dataType] || []).unshift(func) : (structure[dataType] = structure[dataType] || []).push(func);
        };
    }
    // Base inspection function for prefilters and transports
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
    // A special extend for ajax options
    // that takes "flat" options (not to be deep extended)
    // Fixes #9887
    function ajaxExtend(target, src) {
        var deep, key, flatOptions = jQuery.ajaxSettings.flatOptions || {};
        for(key in src)src[key] !== undefined && ((flatOptions[key] ? target : deep || (deep = {}))[key] = src[key]);
        return deep && jQuery.extend(!0, target, deep), target;
    }
    // Segment location into parts
    ajaxLocParts = rurl.exec(ajaxLocation.toLowerCase()) || [], jQuery.fn.load = function(url, params, callback) {
        if ("string" != typeof url && _load) return _load.apply(this, arguments);
        var selector, response, type, self = this, off = url.indexOf(" ");
        return off >= 0 && (selector = url.slice(off, url.length), url = url.slice(0, off)), jQuery.isFunction(params) ? (// We assume that it's the callback
        callback = params, params = undefined) : params && "object" == typeof params && (type = "POST"), self.length > 0 && jQuery.ajax({
            url: url,
            // if "type" variable is undefined, then "GET" method will be used
            type: type,
            dataType: "html",
            data: params
        }).done(function(responseText) {
            // Save response for use in complete callback
            response = arguments, self.html(selector ? // Exclude scripts to avoid IE 'Permission Denied' errors
            jQuery("<div>").append(jQuery.parseHTML(responseText)).find(selector) : responseText);
        }).complete(callback && function(jqXHR, status) {
            self.each(callback, response || [
                jqXHR.responseText,
                status,
                jqXHR
            ]);
        }), this;
    }, // Attach a bunch of functions for handling common AJAX events
    jQuery.each([
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
        // Counter for holding the number of active queries
        active: 0,
        // Last-Modified header cache for next request
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
            /*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/ accepts: {
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
            // Data converters
            // Keys separate source (or catchall "*") and destination types with a single space
            converters: {
                // Convert anything to text
                "* text": window1.String,
                // Text to html (true = no transformation)
                "text html": !0,
                // Evaluate text as a json expression
                "text json": jQuery.parseJSON,
                // Parse text as xml
                "text xml": jQuery.parseXML
            },
            // For options that shouldn't be deep extended:
            // you can add your own custom options here if
            // and when you create one that shouldn't be
            // deep extended (see ajaxExtend)
            flatOptions: {
                url: !0,
                context: !0
            }
        },
        // Creates a full fledged settings object into target
        // with both ajaxSettings and settings fields.
        // If target is omitted, writes into ajaxSettings.
        ajaxSetup: function(target, settings) {
            return settings ? ajaxExtend(ajaxExtend(target, jQuery.ajaxSettings), settings) : ajaxExtend(jQuery.ajaxSettings, target);
        },
        ajaxPrefilter: addToPrefiltersOrTransports(prefilters),
        ajaxTransport: addToPrefiltersOrTransports(transports),
        // Main method
        ajax: function(url, options) {
            "object" == typeof url && (options = url, url = undefined), // Force options to be an object
            options = options || {};
            var parts, // Loop variable
            i, // URL without anti-cache param
            cacheURL, // Response headers as string
            responseHeadersString, // timeout handle
            timeoutTimer, // To know if global events are to be dispatched
            fireGlobals, transport, // Response headers
            responseHeaders, // Create the final options object
            s = jQuery.ajaxSetup({}, options), // Callbacks context
            callbackContext = s.context || s, // Context for global events is callbackContext if it is a DOM node or jQuery collection
            globalEventContext = s.context && (callbackContext.nodeType || callbackContext.jquery) ? jQuery(callbackContext) : jQuery.event, // Deferreds
            deferred = jQuery.Deferred(), completeDeferred = jQuery.Callbacks("once memory"), // Status-dependent callbacks
            statusCode = s.statusCode || {}, // Headers (they are sent all at once)
            requestHeaders = {}, requestHeadersNames = {}, // The jqXHR state
            state = 0, // Default abort message
            strAbort = "canceled", // Fake xhr
            jqXHR = {
                readyState: 0,
                // Builds headers hashtable if needed
                getResponseHeader: function(key) {
                    var match;
                    if (2 === state) {
                        if (!responseHeaders) for(responseHeaders = {}; match = rheaders.exec(responseHeadersString);)responseHeaders[match[1].toLowerCase()] = match[2];
                        match = responseHeaders[key.toLowerCase()];
                    }
                    return null == match ? null : match;
                },
                // Raw string
                getAllResponseHeaders: function() {
                    return 2 === state ? responseHeadersString : null;
                },
                // Caches the header
                setRequestHeader: function(name1, value) {
                    var lname = name1.toLowerCase();
                    return state || (requestHeaders[name1 = requestHeadersNames[lname] = requestHeadersNames[lname] || name1] = value), this;
                },
                // Overrides response content-type header
                overrideMimeType: function(type) {
                    return state || (s.mimeType = type), this;
                },
                // Status-dependent callbacks
                statusCode: function(map) {
                    var code;
                    if (map) {
                        if (state < 2) for(code in map)// Lazy-add the new callback in a way that preserves old ones
                        statusCode[code] = [
                            statusCode[code],
                            map[code]
                        ];
                        else // Execute the appropriate callbacks
                        jqXHR.always(map[jqXHR.status]);
                    }
                    return this;
                },
                // Cancel the request
                abort: function(statusText) {
                    var finalText = statusText || strAbort;
                    return transport && transport.abort(finalText), done(0, finalText), this;
                }
            };
            // If request was aborted inside a prefilter, stop there
            if (// Attach deferreds
            deferred.promise(jqXHR).complete = completeDeferred.add, jqXHR.success = jqXHR.done, jqXHR.error = jqXHR.fail, // Remove hash character (#7531: and string promotion)
            // Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
            // Handle falsy url in the settings object (#10093: consistency with old signature)
            // We also use the url parameter if available
            s.url = ((url || s.url || ajaxLocation) + "").replace(rhash, "").replace(rprotocol, ajaxLocParts[1] + "//"), // Alias method option to type as per ticket #12004
            s.type = options.method || options.type || s.method || s.type, // Extract dataTypes list
            s.dataTypes = jQuery.trim(s.dataType || "*").toLowerCase().match(core_rnotwhite) || [
                ""
            ], null == s.crossDomain && (parts = rurl.exec(s.url.toLowerCase()), s.crossDomain = !!(parts && (parts[1] !== ajaxLocParts[1] || parts[2] !== ajaxLocParts[2] || (parts[3] || ("http:" === parts[1] ? 80 : 443)) != (ajaxLocParts[3] || ("http:" === ajaxLocParts[1] ? 80 : 443))))), s.data && s.processData && "string" != typeof s.data && (s.data = jQuery.param(s.data, s.traditional)), // Apply prefilters
            inspectPrefiltersOrTransports(prefilters, s, options, jqXHR), 2 === state) return jqXHR;
            // Check for headers option
            for(i in // We can fire global events as of now if asked to
            (fireGlobals = s.global) && 0 == jQuery.active++ && jQuery.event.trigger("ajaxStart"), // Uppercase the type
            s.type = s.type.toUpperCase(), // Determine if request has content
            s.hasContent = !rnoContent.test(s.type), // Save the URL in case we're toying with the If-Modified-Since
            // and/or If-None-Match header later on
            cacheURL = s.url, s.hasContent || (s.data && (cacheURL = s.url += (ajax_rquery.test(cacheURL) ? "&" : "?") + s.data, // #9682: remove data so that it's not used in an eventual retry
            delete s.data), !1 === s.cache && (s.url = rts.test(cacheURL) ? cacheURL.replace(rts, "$1_=" + ajax_nonce++) : cacheURL + (ajax_rquery.test(cacheURL) ? "&" : "?") + "_=" + ajax_nonce++)), s.ifModified && (jQuery.lastModified[cacheURL] && jqXHR.setRequestHeader("If-Modified-Since", jQuery.lastModified[cacheURL]), jQuery.etag[cacheURL] && jqXHR.setRequestHeader("If-None-Match", jQuery.etag[cacheURL])), (s.data && s.hasContent && !1 !== s.contentType || options.contentType) && jqXHR.setRequestHeader("Content-Type", s.contentType), // Set the Accepts header for the server, depending on the dataType
            jqXHR.setRequestHeader("Accept", s.dataTypes[0] && s.accepts[s.dataTypes[0]] ? s.accepts[s.dataTypes[0]] + ("*" !== s.dataTypes[0] ? ", " + allTypes + "; q=0.01" : "") : s.accepts["*"]), s.headers)jqXHR.setRequestHeader(i, s.headers[i]);
            // Allow custom headers/mimetypes and early abort
            if (s.beforeSend && (!1 === s.beforeSend.call(callbackContext, jqXHR, s) || 2 === state)) // Abort if not done already and return
            return jqXHR.abort();
            // Install callbacks on deferreds
            for(i in // aborting is no longer a cancellation
            strAbort = "abort", {
                success: 1,
                error: 1,
                complete: 1
            })jqXHR[i](s[i]);
            // If no transport, we auto-abort
            if (// Get transport
            transport = inspectPrefiltersOrTransports(transports, s, options, jqXHR)) {
                jqXHR.readyState = 1, fireGlobals && globalEventContext.trigger("ajaxSend", [
                    jqXHR,
                    s
                ]), s.async && s.timeout > 0 && (timeoutTimer = setTimeout(function() {
                    jqXHR.abort("timeout");
                }, s.timeout));
                try {
                    state = 1, transport.send(requestHeaders, done);
                } catch (e) {
                    // Propagate exception as error if not done
                    if (state < 2) done(-1, e);
                    else throw e;
                }
            } else done(-1, "No Transport");
            // Callback for when everything is done
            function done(status, nativeStatusText, responses, headers) {
                var isSuccess, success, error, response, modified, statusText = nativeStatusText;
                // Called once
                2 !== state && (// State is "done" now
                state = 2, timeoutTimer && clearTimeout(timeoutTimer), // Dereference transport for early garbage collection
                // (no matter how long the jqXHR object will be used)
                transport = undefined, // Cache response headers
                responseHeadersString = headers || "", // Set readyState
                jqXHR.readyState = status > 0 ? 4 : 0, responses && (response = /* Handles responses to an ajax request:
   * - sets all responseXXX fields accordingly
   * - finds the right dataType (mediates between content-type and expected dataType)
   * - returns the corresponding response
   */ function(s, jqXHR, responses) {
                    var firstDataType, ct, finalDataType, type, contents = s.contents, dataTypes = s.dataTypes, responseFields = s.responseFields;
                    // Fill responseXXX fields
                    for(type in responseFields)type in responses && (jqXHR[responseFields[type]] = responses[type]);
                    // Remove auto dataType and get content-type in the process
                    for(; "*" === dataTypes[0];)dataTypes.shift(), undefined === ct && (ct = s.mimeType || jqXHR.getResponseHeader("Content-Type"));
                    // Check if we're dealing with a known content-type
                    if (ct) {
                        for(type in contents)if (contents[type] && contents[type].test(ct)) {
                            dataTypes.unshift(type);
                            break;
                        }
                    }
                    // Check to see if we have a response for the expected dataType
                    if (dataTypes[0] in responses) finalDataType = dataTypes[0];
                    else {
                        // Try convertible dataTypes
                        for(type in responses){
                            if (!dataTypes[0] || s.converters[type + " " + dataTypes[0]]) {
                                finalDataType = type;
                                break;
                            }
                            firstDataType || (firstDataType = type);
                        }
                        // Or just use first one
                        finalDataType = finalDataType || firstDataType;
                    }
                    // If we found a dataType
                    // We add the dataType to the list if needed
                    // and return the corresponding response
                    if (finalDataType) return finalDataType !== dataTypes[0] && dataTypes.unshift(finalDataType), responses[finalDataType];
                }(s, jqXHR, responses)), status >= 200 && status < 300 || 304 === status ? (s.ifModified && ((modified = jqXHR.getResponseHeader("Last-Modified")) && (jQuery.lastModified[cacheURL] = modified), (modified = jqXHR.getResponseHeader("etag")) && (jQuery.etag[cacheURL] = modified)), 204 === status ? (isSuccess = !0, statusText = "nocontent") : 304 === status ? (isSuccess = !0, statusText = "notmodified") : (statusText = (isSuccess = // Chain conversions given the request and the original response
                function(s, response) {
                    var conv2, current, conv, tmp, converters = {}, i = 0, // Work with a copy of dataTypes in case we need to modify it for conversion
                    dataTypes = s.dataTypes.slice(), prev = dataTypes[0];
                    // Create converters map with lowercased keys
                    if (s.dataFilter && (response = s.dataFilter(response, s.dataType)), dataTypes[1]) for(conv in s.converters)converters[conv.toLowerCase()] = s.converters[conv];
                    // Convert to each sequential dataType, tolerating list modification
                    for(; current = dataTypes[++i];)// There's only work to do if current dataType is non-auto
                    if ("*" !== current) {
                        // Convert response if prev dataType is non-auto and differs from current
                        if ("*" !== prev && prev !== current) {
                            // If none found, seek a pair
                            if (!// Seek a direct converter
                            (conv = converters[prev + " " + current] || converters["* " + current])) {
                                for(conv2 in converters)if (// If conv2 outputs current
                                (tmp = conv2.split(" "))[1] === current && // If prev can be converted to accepted input
                                (conv = converters[prev + " " + tmp[0]] || converters["* " + tmp[0]])) {
                                    // Condense equivalence converters
                                    !0 === conv ? conv = converters[conv2] : !0 !== converters[conv2] && (current = tmp[0], dataTypes.splice(i--, 0, current));
                                    break;
                                }
                            }
                            // Apply converter (if not an equivalence)
                            if (!0 !== conv) {
                                // Unless errors are allowed to bubble, catch and return them
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
                        // Update prev for next iteration
                        prev = current;
                    }
                    return {
                        state: "success",
                        data: response
                    };
                }(s, response)).state, success = isSuccess.data, isSuccess = !(error = isSuccess.error))) : (// We extract error from statusText
                // then normalize statusText and status for non-aborts
                error = statusText, (status || !statusText) && (statusText = "error", status < 0 && (status = 0))), // Set data for the fake xhr object
                jqXHR.status = status, jqXHR.statusText = (nativeStatusText || statusText) + "", isSuccess ? deferred.resolveWith(callbackContext, [
                    success,
                    statusText,
                    jqXHR
                ]) : deferred.rejectWith(callbackContext, [
                    jqXHR,
                    statusText,
                    error
                ]), // Status-dependent callbacks
                jqXHR.statusCode(statusCode), statusCode = undefined, fireGlobals && globalEventContext.trigger(isSuccess ? "ajaxSuccess" : "ajaxError", [
                    jqXHR,
                    s,
                    isSuccess ? success : error
                ]), // Complete
                completeDeferred.fireWith(callbackContext, [
                    jqXHR,
                    statusText
                ]), !fireGlobals || (globalEventContext.trigger("ajaxComplete", [
                    jqXHR,
                    s
                ]), --jQuery.active || jQuery.event.trigger("ajaxStop")));
            }
            return jqXHR;
        },
        getScript: function(url, callback) {
            return jQuery.get(url, undefined, callback, "script");
        },
        getJSON: function(url, data, callback) {
            return jQuery.get(url, data, callback, "json");
        }
    }), // Install script dataType
    jQuery.ajaxSetup({
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
    }), // Handle cache's special case and global
    jQuery.ajaxPrefilter("script", function(s) {
        s.cache === undefined && (s.cache = !1), s.crossDomain && (s.type = "GET", s.global = !1);
    }), // Bind script tag hack transport
    jQuery.ajaxTransport("script", function(s) {
        // This transport only deals with cross domain requests
        if (s.crossDomain) {
            var script, head = document.head || jQuery("head")[0] || document.documentElement;
            return {
                send: function(_, callback) {
                    (script = document.createElement("script")).async = !0, s.scriptCharset && (script.charset = s.scriptCharset), script.src = s.url, // Attach handlers for all browsers
                    script.onload = script.onreadystatechange = function(_, isAbort) {
                        (isAbort || !script.readyState || /loaded|complete/.test(script.readyState)) && (// Handle memory leak in IE
                        script.onload = script.onreadystatechange = null, script.parentNode && script.parentNode.removeChild(script), // Dereference the script
                        script = null, isAbort || callback(200, "success"));
                    }, // Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
                    // Use native DOM manipulation to avoid our domManip AJAX trickery
                    head.insertBefore(script, head.firstChild);
                },
                abort: function() {
                    script && script.onload(undefined, !0);
                }
            };
        }
    });
    var oldCallbacks = [], rjsonp = /(=)\?(?=&|$)|\?\?/;
    // Default jsonp settings
    jQuery.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
            var callback = oldCallbacks.pop() || jQuery.expando + "_" + ajax_nonce++;
            return this[callback] = !0, callback;
        }
    }), // Detect, normalize options and install callbacks for jsonp requests
    jQuery.ajaxPrefilter("json jsonp", function(s, originalSettings, jqXHR) {
        var callbackName, overwritten, responseContainer, jsonProp = !1 !== s.jsonp && (rjsonp.test(s.url) ? "url" : "string" == typeof s.data && !(s.contentType || "").indexOf("application/x-www-form-urlencoded") && rjsonp.test(s.data) && "data");
        // Handle iff the expected data type is "jsonp" or we have a parameter to set
        if (jsonProp || "jsonp" === s.dataTypes[0]) // Delegate to script
        return(// Get callback name, remembering preexisting value associated with it
        callbackName = s.jsonpCallback = jQuery.isFunction(s.jsonpCallback) ? s.jsonpCallback() : s.jsonpCallback, jsonProp ? s[jsonProp] = s[jsonProp].replace(rjsonp, "$1" + callbackName) : !1 !== s.jsonp && (s.url += (ajax_rquery.test(s.url) ? "&" : "?") + s.jsonp + "=" + callbackName), // Use data converter to retrieve json after script execution
        s.converters["script json"] = function() {
            return responseContainer || jQuery.error(callbackName + " was not called"), responseContainer[0];
        }, // force json dataType
        s.dataTypes[0] = "json", // Install callback
        overwritten = window1[callbackName], window1[callbackName] = function() {
            responseContainer = arguments;
        }, // Clean-up function (fires after converters)
        jqXHR.always(function() {
            // Restore preexisting value
            window1[callbackName] = overwritten, s[callbackName] && (// make sure that re-using the options doesn't screw things around
            s.jsonpCallback = originalSettings.jsonpCallback, // save the callback name for future use
            oldCallbacks.push(callbackName)), responseContainer && jQuery.isFunction(overwritten) && overwritten(responseContainer[0]), responseContainer = overwritten = undefined;
        }), "script");
    });
    var xhrCallbacks, xhrSupported, xhrId = 0, // #5280: Internet Explorer will keep connections alive if we don't abort on unload
    xhrOnUnloadAbort = window1.ActiveXObject && function() {
        // Abort all pending requests
        var key;
        for(key in xhrCallbacks)xhrCallbacks[key](undefined, !0);
    };
    // Functions to create xhrs
    function createStandardXHR() {
        try {
            return new window1.XMLHttpRequest();
        } catch (e) {}
    }
    // Create the request object
    // (This is still attached to ajaxSettings for backward compatibility)
    jQuery.ajaxSettings.xhr = window1.ActiveXObject ? /* Microsoft failed to properly
       * implement the XMLHttpRequest in IE7 (can't request local files),
       * so we use the ActiveXObject when it is available
       * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
       * we need a fallback.
       */ function() {
        return !this.isLocal && createStandardXHR() || function() {
            try {
                return new window1.ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {}
        }();
    } : createStandardXHR, // Determine support properties
    xhrSupported = jQuery.ajaxSettings.xhr(), jQuery.support.cors = !!xhrSupported && "withCredentials" in xhrSupported, (xhrSupported = jQuery.support.ajax = !!xhrSupported) && jQuery.ajaxTransport(function(s) {
        // Cross domain only allowed if supported through XMLHttpRequest
        if (!s.crossDomain || jQuery.support.cors) {
            var callback;
            return {
                send: function(headers, complete) {
                    // Get a new xhr
                    var handle, i, xhr = s.xhr();
                    // Apply custom fields if provided
                    if (s.username ? xhr.open(s.type, s.url, s.async, s.username, s.password) : xhr.open(s.type, s.url, s.async), s.xhrFields) for(i in s.xhrFields)xhr[i] = s.xhrFields[i];
                    s.mimeType && xhr.overrideMimeType && xhr.overrideMimeType(s.mimeType), s.crossDomain || headers["X-Requested-With"] || (headers["X-Requested-With"] = "XMLHttpRequest");
                    // Need an extra try/catch for cross domain requests in Firefox 3
                    try {
                        for(i in headers)xhr.setRequestHeader(i, headers[i]);
                    } catch (err) {}
                    // Do send the request
                    // This may raise an exception which is actually
                    // handled in jQuery.ajax (so no try/catch here)
                    xhr.send(s.hasContent && s.data || null), // Listener
                    callback = function(_, isAbort) {
                        var status, responseHeaders, statusText, responses;
                        // Firefox throws exceptions when accessing properties
                        // of an xhr when a network error occurred
                        // http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
                        try {
                            // Was never called and is aborted or complete
                            if (callback && (isAbort || 4 === xhr.readyState)) {
                                // If it's an abort
                                if (// Only called once
                                callback = undefined, handle && (xhr.onreadystatechange = jQuery.noop, xhrOnUnloadAbort && delete xhrCallbacks[handle]), isAbort) // Abort it manually if needed
                                4 !== xhr.readyState && xhr.abort();
                                else {
                                    responses = {}, status = xhr.status, responseHeaders = xhr.getAllResponseHeaders(), "string" == typeof xhr.responseText && (responses.text = xhr.responseText);
                                    // Firefox throws an exception when accessing
                                    // statusText for faulty cross-domain requests
                                    try {
                                        statusText = xhr.statusText;
                                    } catch (e) {
                                        // We normalize with Webkit giving an empty statusText
                                        statusText = "";
                                    }
                                    status || !s.isLocal || s.crossDomain ? 1223 === status && (status = 204) : status = responses.text ? 200 : 404;
                                }
                            }
                        } catch (firefoxAccessException) {
                            isAbort || complete(-1, firefoxAccessException);
                        }
                        // Call complete if needed
                        responses && complete(status, statusText, responses, responseHeaders);
                    }, s.async ? 4 === xhr.readyState ? // (IE6 & IE7) if it's in cache and has been
                    // retrieved directly we need to fire the callback
                    setTimeout(callback) : (handle = ++xhrId, xhrOnUnloadAbort && (xhrCallbacks || (xhrCallbacks = {}, jQuery(window1).unload(xhrOnUnloadAbort)), // Add to list of active xhrs callbacks
                    xhrCallbacks[handle] = callback), xhr.onreadystatechange = callback) : // if we're in sync mode we fire the callback
                    callback();
                },
                abort: function() {
                    callback && callback(undefined, !0);
                }
            };
        }
    });
    var fxNow, timerId, rfxtypes = /^(?:toggle|show|hide)$/, rfxnum = RegExp("^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i"), rrun = /queueHooks$/, animationPrefilters = [
        function(elem, props, opts) {
            /*jshint validthis:true */ var prop, index, length, value, dataShow, toggle, tween, hooks, oldfire, anim = this, style = elem.style, orig = {}, handled = [], hidden = elem.nodeType && isHidden(elem);
            // show/hide pass
            for(index in opts.queue || (null == (hooks = jQuery._queueHooks(elem, "fx")).unqueued && (hooks.unqueued = 0, oldfire = hooks.empty.fire, hooks.empty.fire = function() {
                hooks.unqueued || oldfire();
            }), hooks.unqueued++, anim.always(function() {
                // doing this makes sure that the complete handler will be called
                // before this completes
                anim.always(function() {
                    hooks.unqueued--, jQuery.queue(elem, "fx").length || hooks.empty.fire();
                });
            })), 1 === elem.nodeType && ("height" in props || "width" in props) && (// Make sure that nothing sneaks out
            // Record all 3 overflow attributes because IE does not
            // change the overflow attribute when overflowX and
            // overflowY are set to the same value
            opts.overflow = [
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
            }), index = 0; index < length; index++)prop = handled[index], tween = anim.createTween(prop, hidden ? dataShow[prop] : 0), orig[prop] = dataShow[prop] || jQuery.style(elem, prop), prop in dataShow || (dataShow[prop] = tween.start, hidden && (tween.end = tween.start, tween.start = "width" === prop || "height" === prop ? 1 : 0));
        }
    ], tweeners = {
        "*": [
            function(prop, value) {
                var end, unit, tween = this.createTween(prop, value), parts = rfxnum.exec(value), target = tween.cur(), start = +target || 0, scale = 1, maxIterations = 20;
                if (parts) {
                    // We need to compute starting value
                    if (end = +parts[2], "px" !== (unit = parts[3] || (jQuery.cssNumber[prop] ? "" : "px")) && start) {
                        // Iteratively approximate from a nonzero starting point
                        // Prefer the current property, because this process will be trivial if it uses the same units
                        // Fallback to end or a simple constant
                        start = jQuery.css(tween.elem, prop, !0) || end || 1;
                        do // Adjust and apply
                        start /= // If previous iteration zeroed out, double until we get *something*
                        // Use a string for doubling factor so we don't accidentally see scale as unchanged below
                        scale = scale || ".5", jQuery.style(tween.elem, prop, start + unit);
                        while (scale !== (scale = tween.cur() / target) && 1 !== scale && --maxIterations)
                    }
                    tween.unit = unit, tween.start = start, // If a +=/-= token was provided, we're doing a relative animation
                    tween.end = parts[1] ? start + (parts[1] + 1) * end : end;
                }
                return tween;
            }
        ]
    };
    // Animations created synchronously will run synchronously
    function createFxNow() {
        return setTimeout(function() {
            fxNow = undefined;
        }), fxNow = jQuery.now();
    }
    function Animation(elem, properties, options) {
        var result, stopped, index = 0, length = animationPrefilters.length, deferred = jQuery.Deferred().always(function() {
            // don't match elem in the :animated selector
            delete tick.elem;
        }), tick = function() {
            if (stopped) return !1;
            for(var currentTime = fxNow || createFxNow(), remaining = Math.max(0, animation.startTime + animation.duration - currentTime), percent = 1 - (remaining / animation.duration || 0), index = 0, length = animation.tweens.length; index < length; index++)animation.tweens[index].run(percent);
            return (deferred.notifyWith(elem, [
                animation,
                percent,
                remaining
            ]), percent < 1 && length) ? remaining : (deferred.resolveWith(elem, [
                animation
            ]), !1);
        }, animation = deferred.promise({
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
                var tween = jQuery.Tween(elem, animation.opts, prop, end, animation.opts.specialEasing[prop] || animation.opts.easing);
                return animation.tweens.push(tween), tween;
            },
            stop: function(gotoEnd) {
                var index = 0, // if we are going to the end, we want to run all the tweens
                // otherwise we skip this part
                length = gotoEnd ? animation.tweens.length : 0;
                if (stopped) return this;
                for(stopped = !0; index < length; index++)animation.tweens[index].run(1);
                return gotoEnd ? deferred.resolveWith(elem, [
                    animation,
                    gotoEnd
                ]) : deferred.rejectWith(elem, [
                    animation,
                    gotoEnd
                ]), this;
            }
        }), props = animation.props;
        for(function(props, specialEasing) {
            var value, name1, index, easing, hooks;
            // camelCase, specialEasing and expand cssHook pass
            for(index in props)if (easing = specialEasing[name1 = jQuery.camelCase(index)], value = props[index], jQuery.isArray(value) && (easing = value[1], value = props[index] = value[0]), index !== name1 && (props[name1] = value, delete props[index]), (hooks = jQuery.cssHooks[name1]) && "expand" in hooks) // not quite $.extend, this wont overwrite keys already present.
            // also - reusing 'index' from above because we have the correct "name"
            for(index in value = hooks.expand(value), delete props[name1], value)index in props || (props[index] = value[index], specialEasing[index] = easing);
            else specialEasing[name1] = easing;
        }(props, animation.opts.specialEasing); index < length; index++)if (result = animationPrefilters[index].call(animation, elem, props, animation.opts)) return result;
        // attach callbacks from options
        return jQuery.each(props, function(prop, value) {
            for(var collection = (tweeners[prop] || []).concat(tweeners["*"]), index = 0, length = collection.length; index < length; index++)if (collection[index].call(animation, prop, value)) // we're done with this property
            return;
        }), jQuery.isFunction(animation.opts.start) && animation.opts.start.call(elem, animation), jQuery.fx.timer(jQuery.extend(tick, {
            elem: elem,
            anim: animation,
            queue: animation.opts.queue
        })), animation.progress(animation.opts.progress).done(animation.opts.done, animation.opts.complete).fail(animation.opts.fail).always(animation.opts.always);
    }
    function Tween(elem, options, prop, end, easing) {
        return new Tween.prototype.init(elem, options, prop, end, easing);
    }
    // Generate parameters to create a standard animation
    function genFx(type, includeWidth) {
        var which, attrs = {
            height: type
        }, i = 0;
        for(// if we include width, step value is 1 to do all cssExpand values,
        // if we don't include width, step value is 2 to skip over Left and Right
        includeWidth = includeWidth ? 1 : 0; i < 4; i += 2 - includeWidth)attrs["margin" + (which = cssExpand[i])] = attrs["padding" + which] = type;
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
                return null == tween.elem[tween.prop] || tween.elem.style && null != tween.elem.style[tween.prop] ? // passing an empty string as a 3rd parameter to .css will automatically
                // attempt a parseFloat and fallback to a string if the parse fails
                // so, simple values such as "10px" are parsed to Float.
                // complex values such as "rotate(1rad)" are returned as is.
                (result = jQuery.css(tween.elem, tween.prop, "")) && "auto" !== result ? result : 0 : tween.elem[tween.prop];
            },
            set: function(tween) {
                // use step hook for back compat - use cssHook if its there - use .style if its
                // available and use plain properties where available
                jQuery.fx.step[tween.prop] ? jQuery.fx.step[tween.prop](tween) : tween.elem.style && (null != tween.elem.style[jQuery.cssProps[tween.prop]] || jQuery.cssHooks[tween.prop]) ? jQuery.style(tween.elem, tween.prop, tween.now + tween.unit) : tween.elem[tween.prop] = tween.now;
            }
        }
    }, // Remove in 2.0 - this supports IE8's panic based approach
    // to setting things on disconnected nodes
    Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
        set: function(tween) {
            tween.elem.nodeType && tween.elem.parentNode && (tween.elem[tween.prop] = tween.now);
        }
    }, jQuery.each([
        "toggle",
        "show",
        "hide"
    ], function(i, name1) {
        var cssFn = jQuery.fn[name1];
        jQuery.fn[name1] = function(speed, easing, callback) {
            return null == speed || "boolean" == typeof speed ? cssFn.apply(this, arguments) : this.animate(genFx(name1, !0), speed, easing, callback);
        };
    }), jQuery.fn.extend({
        fadeTo: function(speed, to, easing, callback) {
            // show any hidden elements after setting opacity to 0
            return this.filter(isHidden).css("opacity", 0).show()// animate to the value specified
            .end().animate({
                opacity: to
            }, speed, easing, callback);
        },
        animate: function(prop, speed, easing, callback) {
            var empty = jQuery.isEmptyObject(prop), optall = jQuery.speed(speed, easing, callback), doAnimation = function() {
                // Operate on a copy of prop so per-property easing won't be lost
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
                // start the next in the queue if the last step wasn't forced
                // timers currently will call their complete callbacks, which will dequeue
                // but only if they were gotoEnd
                (dequeue || !gotoEnd) && jQuery.dequeue(this, type);
            });
        },
        finish: function(type) {
            return !1 !== type && (type = type || "fx"), this.each(function() {
                var index, data = jQuery._data(this), queue = data[type + "queue"], hooks = data[type + "queueHooks"], timers = jQuery.timers, length = queue ? queue.length : 0;
                // look for any active animations, and finish them
                for(// enable finishing flag on private data
                data.finish = !0, // empty the queue first
                jQuery.queue(this, type, []), hooks && hooks.cur && hooks.cur.finish && hooks.cur.finish.call(this), index = timers.length; index--;)timers[index].elem === this && timers[index].queue === type && (timers[index].anim.stop(!0), timers.splice(index, 1));
                // look for any animations in the old queue and finish them
                for(index = 0; index < length; index++)queue[index] && queue[index].finish && queue[index].finish.call(this);
                // turn off finishing flag
                delete data.finish;
            });
        }
    }), // Generate shortcuts for custom animations
    jQuery.each({
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
    }, function(name1, props) {
        jQuery.fn[name1] = function(speed, easing, callback) {
            return this.animate(props, speed, easing, callback);
        };
    }), jQuery.speed = function(speed, easing, fn) {
        var opt = speed && "object" == typeof speed ? jQuery.extend({}, speed) : {
            complete: fn || !fn && easing || jQuery.isFunction(speed) && speed,
            duration: speed,
            easing: fn && easing || easing && !jQuery.isFunction(easing) && easing
        };
        return opt.duration = jQuery.fx.off ? 0 : "number" == typeof opt.duration ? opt.duration : opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[opt.duration] : jQuery.fx.speeds._default, (null == opt.queue || !0 === opt.queue) && (opt.queue = "fx"), // Queueing
        opt.old = opt.complete, opt.complete = function() {
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
        for(fxNow = jQuery.now(); i < timers.length; i++)// Checks the timer has not already been removed
        (timer = timers[i])() || timers[i] !== timer || timers.splice(i--, 1);
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
        // Default speed
        _default: 400
    }, // Back Compat <1.8 extension point
    jQuery.fx.step = {}, jQuery.expr && jQuery.expr.filters && (jQuery.expr.filters.animated = function(elem) {
        return jQuery.grep(jQuery.timers, function(fn) {
            return elem === fn.elem;
        }).length;
    }), jQuery.fn.offset = function(options) {
        if (arguments.length) return undefined === options ? this : this.each(function(i) {
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
                // Subtract parent offsets and element margins
                // note: when an element has margin: auto the offsetLeft and marginLeft
                // are the same in Safari causing offset.left to incorrectly be 0
                return "fixed" === jQuery.css(elem, "position") ? // we assume that getBoundingClientRect is available when computed position is fixed
                offset = elem.getBoundingClientRect() : (// Get *real* offsetParent
                offsetParent = this.offsetParent(), // Get correct offsets
                offset = this.offset(), jQuery.nodeName(offsetParent[0], "html") || (parentOffset = offsetParent.offset()), // Add offsetParent borders
                parentOffset.top += jQuery.css(offsetParent[0], "borderTopWidth", !0), parentOffset.left += jQuery.css(offsetParent[0], "borderLeftWidth", !0)), {
                    top: offset.top - parentOffset.top - jQuery.css(elem, "marginTop", !0),
                    left: offset.left - parentOffset.left - jQuery.css(elem, "marginLeft", !0)
                };
            }
        },
        offsetParent: function() {
            return this.map(function() {
                for(var offsetParent = this.offsetParent || document.documentElement; offsetParent && !jQuery.nodeName(offsetParent, "html") && "static" === jQuery.css(offsetParent, "position");)offsetParent = offsetParent.offsetParent;
                return offsetParent || document.documentElement;
            });
        }
    }), // Create scrollLeft and scrollTop methods
    jQuery.each({
        scrollLeft: "pageXOffset",
        scrollTop: "pageYOffset"
    }, function(method, prop) {
        var top = /Y/.test(prop);
        jQuery.fn[method] = function(val) {
            return jQuery.access(this, function(elem, method, val) {
                var win = getWindow(elem);
                if (undefined === val) return win ? prop in win ? win[prop] : win.document.documentElement[method] : elem[method];
                win ? win.scrollTo(top ? jQuery(win).scrollLeft() : val, top ? val : jQuery(win).scrollTop()) : elem[method] = val;
            }, method, val, arguments.length, null);
        };
    }), // Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
    jQuery.each({
        Height: "height",
        Width: "width"
    }, function(name1, type) {
        jQuery.each({
            padding: "inner" + name1,
            content: type,
            "": "outer" + name1
        }, function(defaultExtra, funcName) {
            // margin is only for outerHeight, outerWidth
            jQuery.fn[funcName] = function(margin, value) {
                var chainable = arguments.length && (defaultExtra || "boolean" != typeof margin), extra = defaultExtra || (!0 === margin || !0 === value ? "margin" : "border");
                return jQuery.access(this, function(elem, type, value) {
                    var doc;
                    return jQuery.isWindow(elem) ? elem.document.documentElement["client" + name1] : 9 === elem.nodeType ? (doc = elem.documentElement, Math.max(elem.body["scroll" + name1], doc["scroll" + name1], elem.body["offset" + name1], doc["offset" + name1], doc["client" + name1])) : undefined === value ? jQuery.css(elem, type, extra) : jQuery.style(elem, type, value, extra);
                }, type, chainable ? margin : undefined, chainable, null);
            };
        });
    }), // Limit scope pollution from any deprecated API
    // (function() {
    // })();
    // Expose jQuery to the global object
    window1.jQuery = window1.$ = jQuery, "function" == typeof define && define.amd && define.amd.jQuery && define("jquery", [], function() {
        return jQuery;
    });
}(window);
