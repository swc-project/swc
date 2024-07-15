!/*!
 * jQuery JavaScript Library v3.5.1
 * https://jquery.com/
 *
 * Includes Sizzle.js
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2020-05-04T22:49Z
 */ function(global, factory) {
    "use strict";
    "object" == typeof module && "object" == typeof module.exports ? // For CommonJS and CommonJS-like environments where a proper `window`
    // is present, execute the factory and get jQuery.
    // For environments that do not have a `window` with a `document`
    // (such as Node.js), expose a factory as module.exports.
    // This accentuates the need for the creation of a real `window`.
    // e.g. var jQuery = require("jquery")(window);
    // See ticket #14549 for more info.
    module.exports = global.document ? factory(global, !0) : function(w) {
        if (!w.document) throw Error("jQuery requires a window with a document");
        return factory(w);
    } : factory(global);
// Pass this if window is not defined yet
}("undefined" != typeof window ? window : this, function(window1, noGlobal) {
    // Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1
    // throw exceptions when non-strict code (e.g., ASP.NET 4.5) accesses strict mode
    // arguments.callee.caller (trac-13335). But as of jQuery 3.0 (2016), strict mode should be common
    // enough that all such attempts are guarded in a try block.
    "use strict";
    var body, arr = [], getProto = Object.getPrototypeOf, slice = arr.slice, flat = arr.flat ? function(array) {
        return arr.flat.call(array);
    } : function(array) {
        return arr.concat.apply([], array);
    }, push = arr.push, indexOf = arr.indexOf, class2type = {}, toString = class2type.toString, hasOwn = class2type.hasOwnProperty, fnToString = hasOwn.toString, ObjectFunctionString = fnToString.call(Object), support = {}, isFunction = function(obj) {
        // Support: Chrome <=57, Firefox <=52
        // In some browsers, typeof returns "function" for HTML <object> elements
        // (i.e., `typeof document.createElement( "object" ) === "function"`).
        // We don't want to classify *any* DOM node as a function.
        return "function" == typeof obj && "number" != typeof obj.nodeType;
    }, isWindow = function(obj) {
        return null != obj && obj === obj.window;
    }, document = window1.document, preservedScriptAttributes = {
        type: !0,
        src: !0,
        nonce: !0,
        noModule: !0
    };
    function DOMEval(code, node, doc) {
        var i, val, script = (doc = doc || document).createElement("script");
        if (script.text = code, node) for(i in preservedScriptAttributes)// Support: Firefox 64+, Edge 18+
        // Some browsers don't support the "nonce" property on scripts.
        // On the other hand, just using `getAttribute` is not enough as
        // the `nonce` attribute is reset to an empty string whenever it
        // becomes browsing-context connected.
        // See https://github.com/whatwg/html/issues/2369
        // See https://html.spec.whatwg.org/#nonce-attributes
        // The `node.getAttribute` check was added for the sake of
        // `jQuery.globalEval` so that it can fake a nonce-containing node
        // via an object.
        (val = node[i] || node.getAttribute && node.getAttribute(i)) && script.setAttribute(i, val);
        doc.head.appendChild(script).parentNode.removeChild(script);
    }
    function toType(obj) {
        return null == obj ? obj + "" : "object" == typeof obj || "function" == typeof obj ? class2type[toString.call(obj)] || "object" : typeof obj;
    }
    /* global Symbol */ // Defining this global in .eslintrc.json would create a danger of using the global
    // unguarded in another place, it seems safer to define global only for this module
    var version = "3.5.1", // Define a local copy of jQuery
    jQuery = function(selector, context) {
        // The jQuery object is actually just the init constructor 'enhanced'
        // Need init if jQuery is called (just allow error to be thrown if not included)
        return new jQuery.fn.init(selector, context);
    };
    function isArrayLike(obj) {
        // Support: real iOS 8.2 only (not reproducible in simulator)
        // `in` check used to prevent JIT error (gh-2145)
        // hasOwn isn't used here due to false negatives
        // regarding Nodelist length in IE
        var length = !!obj && "length" in obj && obj.length, type = toType(obj);
        return !(isFunction(obj) || isWindow(obj)) && ("array" === type || 0 === length || "number" == typeof length && length > 0 && length - 1 in obj);
    }
    jQuery.fn = jQuery.prototype = {
        // The current version of jQuery being used
        jquery: version,
        constructor: jQuery,
        // The default length of a jQuery object is 0
        length: 0,
        toArray: function() {
            return slice.call(this);
        },
        // Get the Nth element in the matched element set OR
        // Get the whole matched element set as a clean array
        get: function(num) {
            return(// Return all the elements in a clean array
            null == num ? slice.call(this) : num < 0 ? this[num + this.length] : this[num]);
        },
        // Take an array of elements and push it onto the stack
        // (returning the new matched element set)
        pushStack: function(elems) {
            // Build a new jQuery matched element set
            var ret = jQuery.merge(this.constructor(), elems);
            // Return the newly-formed element set
            return(// Add the old object onto the stack (as a reference)
            ret.prevObject = this, ret);
        },
        // Execute a callback for every element in the matched set.
        each: function(callback) {
            return jQuery.each(this, callback);
        },
        map: function(callback) {
            return this.pushStack(jQuery.map(this, function(elem, i) {
                return callback.call(elem, i, elem);
            }));
        },
        slice: function() {
            return this.pushStack(slice.apply(this, arguments));
        },
        first: function() {
            return this.eq(0);
        },
        last: function() {
            return this.eq(-1);
        },
        even: function() {
            return this.pushStack(jQuery.grep(this, function(_elem, i) {
                return (i + 1) % 2;
            }));
        },
        odd: function() {
            return this.pushStack(jQuery.grep(this, function(_elem, i) {
                return i % 2;
            }));
        },
        eq: function(i) {
            var len = this.length, j = +i + (i < 0 ? len : 0);
            return this.pushStack(j >= 0 && j < len ? [
                this[j]
            ] : []);
        },
        end: function() {
            return this.prevObject || this.constructor();
        },
        // For internal use only.
        // Behaves like an Array's method, not like a jQuery method.
        push: push,
        sort: arr.sort,
        splice: arr.splice
    }, jQuery.extend = jQuery.fn.extend = function() {
        var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {}, i = 1, length = arguments.length, deep = !1;
        for("boolean" == typeof target && (deep = target, // Skip the boolean and the target
        target = arguments[i] || {}, i++), "object" == typeof target || isFunction(target) || (target = {}), i === length && (target = this, i--); i < length; i++)// Only deal with non-null/undefined values
        if (null != (options = arguments[i])) // Extend the base object
        for(name in options)// Prevent Object.prototype pollution
        // Prevent never-ending loop
        copy = options[name], "__proto__" !== name && target !== copy && (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = Array.isArray(copy))) ? (src = target[name], clone = copyIsArray && !Array.isArray(src) ? [] : copyIsArray || jQuery.isPlainObject(src) ? src : {}, copyIsArray = !1, // Never move original objects, clone them
        target[name] = jQuery.extend(deep, clone, copy)) : void 0 !== copy && (target[name] = copy));
        // Return the modified object
        return target;
    }, jQuery.extend({
        // Unique for each copy of jQuery on the page
        expando: "jQuery" + (version + Math.random()).replace(/\D/g, ""),
        // Assume jQuery is ready without the ready module
        isReady: !0,
        error: function(msg) {
            throw Error(msg);
        },
        noop: function() {},
        isPlainObject: function(obj) {
            var proto, Ctor;
            return(// Detect obvious negatives
            // Use toString instead of jQuery.type to catch host objects
            !!obj && "[object Object]" === toString.call(obj) && (!(proto = getProto(obj)) || "function" == typeof // Objects with prototype are plain iff they were constructed by a global Object function
            (Ctor = hasOwn.call(proto, "constructor") && proto.constructor) && fnToString.call(Ctor) === ObjectFunctionString));
        },
        isEmptyObject: function(obj) {
            var name;
            for(name in obj)return !1;
            return !0;
        },
        // Evaluates a script in a provided context; falls back to the global one
        // if not specified.
        globalEval: function(code, options, doc) {
            DOMEval(code, {
                nonce: options && options.nonce
            }, doc);
        },
        each: function(obj, callback) {
            var length, i = 0;
            if (isArrayLike(obj)) for(length = obj.length; i < length && !1 !== callback.call(obj[i], i, obj[i]); i++);
            else for(i in obj)if (!1 === callback.call(obj[i], i, obj[i])) break;
            return obj;
        },
        // results is for internal usage only
        makeArray: function(arr, results) {
            var ret = results || [];
            return null != arr && (isArrayLike(Object(arr)) ? jQuery.merge(ret, "string" == typeof arr ? [
                arr
            ] : arr) : push.call(ret, arr)), ret;
        },
        inArray: function(elem, arr, i) {
            return null == arr ? -1 : indexOf.call(arr, elem, i);
        },
        // Support: Android <=4.0 only, PhantomJS 1 only
        // push.apply(_, arraylike) throws on ancient WebKit
        merge: function(first, second) {
            for(var len = +second.length, j = 0, i = first.length; j < len; j++)first[i++] = second[j];
            return first.length = i, first;
        },
        grep: function(elems, callback, invert) {
            // Go through the array, only saving the items
            // that pass the validator function
            for(var matches = [], i = 0, length = elems.length, callbackExpect = !invert; i < length; i++)!callback(elems[i], i) !== callbackExpect && matches.push(elems[i]);
            return matches;
        },
        // arg is for internal usage only
        map: function(elems, callback, arg) {
            var length, value, i = 0, ret = [];
            // Go through the array, translating each of the items to their new values
            if (isArrayLike(elems)) for(length = elems.length; i < length; i++)null != (value = callback(elems[i], i, arg)) && ret.push(value);
            else for(i in elems)null != (value = callback(elems[i], i, arg)) && ret.push(value);
            // Flatten any nested arrays
            return flat(ret);
        },
        // A global GUID counter for objects
        guid: 1,
        // jQuery.support is not used in Core but other projects attach their
        // properties to it so it needs to exist.
        support: support
    }), "function" == typeof Symbol && (jQuery.fn[Symbol.iterator] = arr[Symbol.iterator]), // Populate the class2type map
    jQuery.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function(_i, name) {
        class2type["[object " + name + "]"] = name.toLowerCase();
    });
    var Sizzle = /*!
 * Sizzle CSS Selector Engine v2.3.5
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://js.foundation/
 *
 * Date: 2020-03-14
 */ function(window1) {
        var i, support, Expr, getText, isXML, tokenize, compile, select, outermostContext, sortInput, hasDuplicate, // Local document vars
        setDocument, document, docElem, documentIsHTML, rbuggyQSA, rbuggyMatches, matches, contains, // Instance-specific data
        expando = "sizzle" + 1 * new Date(), preferredDoc = window1.document, dirruns = 0, done = 0, classCache = createCache(), tokenCache = createCache(), compilerCache = createCache(), nonnativeSelectorCache = createCache(), sortOrder = function(a, b) {
            return a === b && (hasDuplicate = !0), 0;
        }, // Instance methods
        hasOwn = {}.hasOwnProperty, arr = [], pop = arr.pop, pushNative = arr.push, push = arr.push, slice = arr.slice, // Use a stripped-down indexOf as it's faster than native
        // https://jsperf.com/thor-indexof-vs-for/5
        indexOf = function(list, elem) {
            for(var i = 0, len = list.length; i < len; i++)if (list[i] === elem) return i;
            return -1;
        }, booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", // Regular expressions
        // http://www.w3.org/TR/css3-selectors/#whitespace
        whitespace = "[\\x20\\t\\r\\n\\f]", // https://www.w3.org/TR/css-syntax-3/#ident-token-diagram
        identifier = "(?:\\\\[\\da-fA-F]{1,6}" + whitespace + "?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+", // Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
        attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace + // Operator (capture 2)
        "*([*^$|!~]?=)" + whitespace + // "Attribute values must be CSS identifiers [capture 5]
        // or strings [capture 3 or capture 4]"
        "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace + "*\\]", pseudos = ":(" + identifier + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|.*)\\)|)", // Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
        rwhitespace = RegExp(whitespace + "+", "g"), rtrim = RegExp("^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g"), rcomma = RegExp("^" + whitespace + "*," + whitespace + "*"), rcombinators = RegExp("^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*"), rdescend = RegExp(whitespace + "|>"), rpseudo = new RegExp(pseudos), ridentifier = RegExp("^" + identifier + "$"), matchExpr = {
            ID: RegExp("^#(" + identifier + ")"),
            CLASS: RegExp("^\\.(" + identifier + ")"),
            TAG: RegExp("^(" + identifier + "|[*])"),
            ATTR: RegExp("^" + attributes),
            PSEUDO: RegExp("^" + pseudos),
            CHILD: RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace + "*(\\d+)|))" + whitespace + "*\\)|)", "i"),
            bool: RegExp("^(?:" + booleans + ")$", "i"),
            // For use in libraries implementing .is()
            // We use this for POS matching in `select`
            needsContext: RegExp("^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i")
        }, rhtml = /HTML$/i, rinputs = /^(?:input|select|textarea|button)$/i, rheader = /^h\d$/i, rnative = /^[^{]+\{\s*\[native \w/, // Easily-parseable/retrievable ID or TAG or CLASS selectors
        rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, rsibling = /[+~]/, // CSS escapes
        // http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
        runescape = RegExp("\\\\[\\da-fA-F]{1,6}" + whitespace + "?|\\\\([^\\r\\n\\f])", "g"), funescape = function(escape, nonHex) {
            var high = "0x" + escape.slice(1) - 0x10000;
            return nonHex || // Replace a hexadecimal escape sequence with the encoded Unicode code point
            // Support: IE <=11+
            // For values outside the Basic Multilingual Plane (BMP), manually construct a
            // surrogate pair
            (high < 0 ? String.fromCharCode(high + 0x10000) : String.fromCharCode(high >> 10 | 0xD800, 0x3FF & high | 0xDC00));
        }, // CSS string/identifier serialization
        // https://drafts.csswg.org/cssom/#common-serializing-idioms
        rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g, fcssescape = function(ch, asCodePoint) {
            return asCodePoint ? // U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
            "\0" === ch ? "\uFFFD" : ch.slice(0, -1) + "\\" + ch.charCodeAt(ch.length - 1).toString(16) + " " : "\\" + ch;
        }, // Used for iframes
        // See setDocument()
        // Removing the function wrapper causes a "Permission Denied"
        // error in IE
        unloadHandler = function() {
            setDocument();
        }, inDisabledFieldset = addCombinator(function(elem) {
            return !0 === elem.disabled && "fieldset" === elem.nodeName.toLowerCase();
        }, {
            dir: "parentNode",
            next: "legend"
        });
        // Optimize for push.apply( _, NodeList )
        try {
            push.apply(arr = slice.call(preferredDoc.childNodes), preferredDoc.childNodes), // Support: Android<4.0
            // Detect silently failing push.apply
            // eslint-disable-next-line no-unused-expressions
            arr[preferredDoc.childNodes.length].nodeType;
        } catch (e) {
            push = {
                apply: arr.length ? // Leverage slice if possible
                function(target, els) {
                    pushNative.apply(target, slice.call(els));
                } : // Support: IE<9
                // Otherwise append directly
                function(target, els) {
                    // Can't trust NodeList.length
                    for(var j = target.length, i = 0; target[j++] = els[i++];);
                    target.length = j - 1;
                }
            };
        }
        function Sizzle(selector, context, results, seed) {
            var m, i, elem, nid, match, groups, newSelector, newContext = context && context.ownerDocument, // nodeType defaults to 9, since context defaults to document
            nodeType = context ? context.nodeType : 9;
            // Return early from calls with invalid selector or context
            if (results = results || [], "string" != typeof selector || !selector || 1 !== nodeType && 9 !== nodeType && 11 !== nodeType) return results;
            // Try to shortcut find operations (as opposed to filters) in HTML documents
            if (!seed && (setDocument(context), context = context || document, documentIsHTML)) {
                // If the selector is sufficiently simple, try using a "get*By*" DOM method
                // (excepting DocumentFragment context, where the methods don't exist)
                if (11 !== nodeType && (match = rquickExpr.exec(selector))) {
                    // ID selector
                    if (m = match[1]) {
                        // Document context
                        if (9 === nodeType) {
                            if (!(elem = context.getElementById(m))) return results;
                            // Support: IE, Opera, Webkit
                            // TODO: identify versions
                            // getElementById can match elements by name instead of ID
                            if (elem.id === m) return results.push(elem), results;
                        // Element context
                        } else // Support: IE, Opera, Webkit
                        // TODO: identify versions
                        // getElementById can match elements by name instead of ID
                        if (newContext && (elem = newContext.getElementById(m)) && contains(context, elem) && elem.id === m) return results.push(elem), results;
                    } else if (match[2]) return push.apply(results, context.getElementsByTagName(selector)), results;
                    else if ((m = match[3]) && support.getElementsByClassName && context.getElementsByClassName) return push.apply(results, context.getElementsByClassName(m)), results;
                }
                // Take advantage of querySelectorAll
                if (support.qsa && !nonnativeSelectorCache[selector + " "] && (!rbuggyQSA || !rbuggyQSA.test(selector)) && // Support: IE 8 only
                // Exclude object elements
                (1 !== nodeType || "object" !== context.nodeName.toLowerCase())) {
                    // qSA considers elements outside a scoping root when evaluating child or
                    // descendant combinators, which is not what we want.
                    // In such cases, we work around the behavior by prefixing every selector in the
                    // list with an ID selector referencing the scope context.
                    // The technique has to be used as well when a leading combinator is used
                    // as such selectors are not recognized by querySelectorAll.
                    // Thanks to Andrew Dupont for this technique.
                    if (newSelector = selector, newContext = context, 1 === nodeType && (rdescend.test(selector) || rcombinators.test(selector))) {
                        for(// Expand context for sibling selectors
                        (newContext = rsibling.test(selector) && testContext(context.parentNode) || context) === context && support.scope || ((nid = context.getAttribute("id")) ? nid = nid.replace(rcssescape, fcssescape) : context.setAttribute("id", nid = expando)), i = // Prefix every selector in the list
                        (groups = tokenize(selector)).length; i--;)groups[i] = (nid ? "#" + nid : ":scope") + " " + toSelector(groups[i]);
                        newSelector = groups.join(",");
                    }
                    try {
                        return push.apply(results, newContext.querySelectorAll(newSelector)), results;
                    } catch (qsaError) {
                        nonnativeSelectorCache(selector, !0);
                    } finally{
                        nid === expando && context.removeAttribute("id");
                    }
                }
            }
            // All others
            return select(selector.replace(rtrim, "$1"), context, results, seed);
        }
        /**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */ function createCache() {
            var keys = [];
            return function cache(key, value) {
                return keys.push(key + " ") > Expr.cacheLength && // Only keep the most recent entries
                delete cache[keys.shift()], cache[key + " "] = value;
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
 * @param {Function} fn Passed the created element and returns a boolean result
 */ function assert(fn) {
            var el = document.createElement("fieldset");
            try {
                return !!fn(el);
            } catch (e) {
                return !1;
            } finally{
                el.parentNode && el.parentNode.removeChild(el), // release memory in IE
                el = null;
            }
        }
        /**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */ function addHandle(attrs, handler) {
            for(var arr = attrs.split("|"), i = arr.length; i--;)Expr.attrHandle[arr[i]] = handler;
        }
        /**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */ function siblingCheck(a, b) {
            var cur = b && a, diff = cur && 1 === a.nodeType && 1 === b.nodeType && a.sourceIndex - b.sourceIndex;
            // Use IE sourceIndex if available on both nodes
            if (diff) return diff;
            // Check if b follows a
            if (cur) {
                for(; cur = cur.nextSibling;)if (cur === b) return -1;
            }
            return a ? 1 : -1;
        }
        /**
 * Returns a function to use in pseudos for :enabled/:disabled
 * @param {Boolean} disabled true for :disabled; false for :enabled
 */ function createDisabledPseudo(disabled) {
            // Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
            return function(elem) {
                // Only certain elements can match :enabled or :disabled
                // https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
                // https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
                if ("form" in elem) return(// Check for inherited disabledness on relevant non-disabled elements:
                // * listed form-associated elements in a disabled fieldset
                //   https://html.spec.whatwg.org/multipage/forms.html#category-listed
                //   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
                // * option elements in a disabled optgroup
                //   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
                // All such elements have a "form" property.
                elem.parentNode && !1 === elem.disabled ? // Option elements defer to a parent optgroup if present
                "label" in elem ? "label" in elem.parentNode ? elem.parentNode.disabled === disabled : elem.disabled === disabled : elem.isDisabled === disabled || // Where there is no isDisabled, check manually
                /* jshint -W018 */ !disabled !== elem.isDisabled && inDisabledFieldset(elem) === disabled : elem.disabled === disabled);
                return "label" in elem && elem.disabled === disabled;
            };
        }
        /**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */ function createPositionalPseudo(fn) {
            return markFunction(function(argument) {
                return argument = +argument, markFunction(function(seed, matches) {
                    // Match elements found at the specified indexes
                    for(var j, matchIndexes = fn([], seed.length, argument), i = matchIndexes.length; i--;)seed[j = matchIndexes[i]] && (seed[j] = !(matches[j] = seed[j]));
                });
            });
        }
        /**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */ function testContext(context) {
            return context && void 0 !== context.getElementsByTagName && context;
        }
        // Add button/input type pseudos
        for(i in // Expose support vars for convenience
        support = Sizzle.support = {}, /**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */ isXML = Sizzle.isXML = function(elem) {
            var namespace = elem.namespaceURI, docElem = (elem.ownerDocument || elem).documentElement;
            // Support: IE <=8
            // Assume HTML when documentElement doesn't yet exist, such as inside loading iframes
            // https://bugs.jquery.com/ticket/4833
            return !rhtml.test(namespace || docElem && docElem.nodeName || "HTML");
        }, /**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */ setDocument = Sizzle.setDocument = function(node) {
            var hasCompare, subWindow, doc = node ? node.ownerDocument || node : preferredDoc;
            return doc != document && 9 === doc.nodeType && doc.documentElement && (docElem = // Update global variables
            (document = doc).documentElement, documentIsHTML = !isXML(document), preferredDoc != document && (subWindow = document.defaultView) && subWindow.top !== subWindow && (subWindow.addEventListener ? subWindow.addEventListener("unload", unloadHandler, !1) : subWindow.attachEvent && subWindow.attachEvent("onunload", unloadHandler)), // Support: IE 8 - 11+, Edge 12 - 18+, Chrome <=16 - 25 only, Firefox <=3.6 - 31 only,
            // Safari 4 - 5 only, Opera <=11.6 - 12.x only
            // IE/Edge & older browsers don't support the :scope pseudo-class.
            // Support: Safari 6.0 only
            // Safari 6.0 supports :scope but it's an alias of :root there.
            support.scope = assert(function(el) {
                return docElem.appendChild(el).appendChild(document.createElement("div")), void 0 !== el.querySelectorAll && !el.querySelectorAll(":scope fieldset div").length;
            }), /* Attributes
	---------------------------------------------------------------------- */ // Support: IE<8
            // Verify that getAttribute really returns attributes and not properties
            // (excepting IE8 booleans)
            support.attributes = assert(function(el) {
                return el.className = "i", !el.getAttribute("className");
            }), /* getElement(s)By*
	---------------------------------------------------------------------- */ // Check if getElementsByTagName("*") returns only elements
            support.getElementsByTagName = assert(function(el) {
                return el.appendChild(document.createComment("")), !el.getElementsByTagName("*").length;
            }), // Support: IE<9
            support.getElementsByClassName = rnative.test(document.getElementsByClassName), // Support: IE<10
            // Check if getElementById returns elements by name
            // The broken getElementById methods don't pick up programmatically-set names,
            // so use a roundabout getElementsByName test
            support.getById = assert(function(el) {
                return docElem.appendChild(el).id = expando, !document.getElementsByName || !document.getElementsByName(expando).length;
            }), support.getById ? (Expr.filter.ID = function(id) {
                var attrId = id.replace(runescape, funescape);
                return function(elem) {
                    return elem.getAttribute("id") === attrId;
                };
            }, Expr.find.ID = function(id, context) {
                if (void 0 !== context.getElementById && documentIsHTML) {
                    var elem = context.getElementById(id);
                    return elem ? [
                        elem
                    ] : [];
                }
            }) : (Expr.filter.ID = function(id) {
                var attrId = id.replace(runescape, funescape);
                return function(elem) {
                    var node = void 0 !== elem.getAttributeNode && elem.getAttributeNode("id");
                    return node && node.value === attrId;
                };
            }, // Support: IE 6 - 7 only
            // getElementById is not reliable as a find shortcut
            Expr.find.ID = function(id, context) {
                if (void 0 !== context.getElementById && documentIsHTML) {
                    var node, i, elems, elem = context.getElementById(id);
                    if (elem) {
                        if (// Verify the id attribute
                        (node = elem.getAttributeNode("id")) && node.value === id) return [
                            elem
                        ];
                        for(// Fall back on getElementsByName
                        elems = context.getElementsByName(id), i = 0; elem = elems[i++];)if ((node = elem.getAttributeNode("id")) && node.value === id) return [
                            elem
                        ];
                    }
                    return [];
                }
            }), // Tag
            Expr.find.TAG = support.getElementsByTagName ? function(tag, context) {
                return void 0 !== context.getElementsByTagName ? context.getElementsByTagName(tag) : support.qsa ? context.querySelectorAll(tag) : void 0;
            } : function(tag, context) {
                var elem, tmp = [], i = 0, // By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
                results = context.getElementsByTagName(tag);
                // Filter out possible comments
                if ("*" === tag) {
                    for(; elem = results[i++];)1 === elem.nodeType && tmp.push(elem);
                    return tmp;
                }
                return results;
            }, // Class
            Expr.find.CLASS = support.getElementsByClassName && function(className, context) {
                if (void 0 !== context.getElementsByClassName && documentIsHTML) return context.getElementsByClassName(className);
            }, /* QSA/matchesSelector
	---------------------------------------------------------------------- */ // QSA and matchesSelector support
            // matchesSelector(:active) reports false when true (IE9/Opera 11.5)
            rbuggyMatches = [], // qSa(:focus) reports false when true (Chrome 21)
            // We allow this because of a bug in IE8/9 that throws an error
            // whenever `document.activeElement` is accessed on an iframe
            // So, we allow :focus to pass through QSA all the time to avoid the IE error
            // See https://bugs.jquery.com/ticket/13378
            rbuggyQSA = [], (support.qsa = rnative.test(document.querySelectorAll)) && (// Build QSA regex
            // Regex strategy adopted from Diego Perini
            assert(function(el) {
                var input;
                // Select is set to empty string on purpose
                // This is to test IE's treatment of not explicitly
                // setting a boolean content attribute,
                // since its presence should be enough
                // https://bugs.jquery.com/ticket/12359
                docElem.appendChild(el).innerHTML = "<a id='" + expando + "'></a><select id='" + expando + "-\r\\' msallowcapture=''><option selected=''></option></select>", el.querySelectorAll("[msallowcapture^='']").length && rbuggyQSA.push("[*^$]=" + whitespace + "*(?:''|\"\")"), el.querySelectorAll("[selected]").length || rbuggyQSA.push("\\[" + whitespace + "*(?:value|" + booleans + ")"), el.querySelectorAll("[id~=" + expando + "-]").length || rbuggyQSA.push("~="), // Support: IE 11+, Edge 15 - 18+
                // IE 11/Edge don't find elements on a `[name='']` query in some cases.
                // Adding a temporary attribute to the document before the selection works
                // around the issue.
                // Interestingly, IE 10 & older don't seem to have the issue.
                (input = document.createElement("input")).setAttribute("name", ""), el.appendChild(input), el.querySelectorAll("[name='']").length || rbuggyQSA.push("\\[" + whitespace + "*name" + whitespace + "*=" + whitespace + "*(?:''|\"\")"), el.querySelectorAll(":checked").length || rbuggyQSA.push(":checked"), el.querySelectorAll("a#" + expando + "+*").length || rbuggyQSA.push(".#.+[+~]"), // Support: Firefox <=3.6 - 5 only
                // Old Firefox doesn't throw on a badly-escaped identifier.
                el.querySelectorAll("\\\f"), rbuggyQSA.push("[\\r\\n\\f]");
            }), assert(function(el) {
                el.innerHTML = "<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";
                // Support: Windows 8 Native Apps
                // The type and name attributes are restricted during .innerHTML assignment
                var input = document.createElement("input");
                input.setAttribute("type", "hidden"), el.appendChild(input).setAttribute("name", "D"), el.querySelectorAll("[name=d]").length && rbuggyQSA.push("name" + whitespace + "*[*^$|!~]?="), 2 !== el.querySelectorAll(":enabled").length && rbuggyQSA.push(":enabled", ":disabled"), // Support: IE9-11+
                // IE's :disabled selector does not pick up the children of disabled fieldsets
                docElem.appendChild(el).disabled = !0, 2 !== el.querySelectorAll(":disabled").length && rbuggyQSA.push(":enabled", ":disabled"), // Support: Opera 10 - 11 only
                // Opera 10-11 does not throw on post-comma invalid pseudos
                el.querySelectorAll("*,:x"), rbuggyQSA.push(",.*:");
            })), (support.matchesSelector = rnative.test(matches = docElem.matches || docElem.webkitMatchesSelector || docElem.mozMatchesSelector || docElem.oMatchesSelector || docElem.msMatchesSelector)) && assert(function(el) {
                // Check to see if it's possible to do matchesSelector
                // on a disconnected node (IE 9)
                support.disconnectedMatch = matches.call(el, "*"), // This should fail with an exception
                // Gecko does not error, returns false instead
                matches.call(el, "[s!='']:x"), rbuggyMatches.push("!=", pseudos);
            }), rbuggyQSA = rbuggyQSA.length && new RegExp(rbuggyQSA.join("|")), rbuggyMatches = rbuggyMatches.length && new RegExp(rbuggyMatches.join("|")), // Element contains another
            // Purposefully self-exclusive
            // As in, an element does not contain itself
            contains = /* Contains
	---------------------------------------------------------------------- */ (hasCompare = rnative.test(docElem.compareDocumentPosition)) || rnative.test(docElem.contains) ? function(a, b) {
                var adown = 9 === a.nodeType ? a.documentElement : a, bup = b && b.parentNode;
                return a === bup || !!(bup && 1 === bup.nodeType && (adown.contains ? adown.contains(bup) : a.compareDocumentPosition && 16 & a.compareDocumentPosition(bup)));
            } : function(a, b) {
                if (b) {
                    for(; b = b.parentNode;)if (b === a) return !0;
                }
                return !1;
            }, /* Sorting
	---------------------------------------------------------------------- */ // Document order sorting
            sortOrder = hasCompare ? function(a, b) {
                // Flag for duplicate removal
                if (a === b) return hasDuplicate = !0, 0;
                // Sort on method existence if only one input has compareDocumentPosition
                var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
                return compare || (1 & // Calculate position if both inputs belong to the same document
                // Support: IE 11+, Edge 17 - 18+
                // IE/Edge sometimes throw a "Permission denied" error when strict-comparing
                // two documents; shallow comparisons work.
                // eslint-disable-next-line eqeqeq
                (compare = (a.ownerDocument || a) == (b.ownerDocument || b) ? a.compareDocumentPosition(b) : // Otherwise we know they are disconnected
                1) || !support.sortDetached && b.compareDocumentPosition(a) === compare ? // Choose the first element that is related to our preferred document
                // Support: IE 11+, Edge 17 - 18+
                // IE/Edge sometimes throw a "Permission denied" error when strict-comparing
                // two documents; shallow comparisons work.
                // eslint-disable-next-line eqeqeq
                a == document || a.ownerDocument == preferredDoc && contains(preferredDoc, a) ? -1 : b == document || b.ownerDocument == preferredDoc && contains(preferredDoc, b) ? 1 : sortInput ? indexOf(sortInput, a) - indexOf(sortInput, b) : 0 : 4 & compare ? -1 : 1);
            } : function(a, b) {
                // Exit early if the nodes are identical
                if (a === b) return hasDuplicate = !0, 0;
                var cur, i = 0, aup = a.parentNode, bup = b.parentNode, ap = [
                    a
                ], bp = [
                    b
                ];
                // Parentless nodes are either documents or disconnected
                if (!aup || !bup) // Support: IE 11+, Edge 17 - 18+
                // IE/Edge sometimes throw a "Permission denied" error when strict-comparing
                // two documents; shallow comparisons work.
                /* eslint-disable eqeqeq */ return a == document ? -1 : b == document ? 1 : /* eslint-enable eqeqeq */ aup ? -1 : bup ? 1 : sortInput ? indexOf(sortInput, a) - indexOf(sortInput, b) : 0;
                if (aup === bup) return siblingCheck(a, b);
                for(// Otherwise we need full lists of their ancestors for comparison
                cur = a; cur = cur.parentNode;)ap.unshift(cur);
                for(cur = b; cur = cur.parentNode;)bp.unshift(cur);
                // Walk down the tree looking for a discrepancy
                for(; ap[i] === bp[i];)i++;
                return i ? // Do a sibling check if the nodes have a common ancestor
                siblingCheck(ap[i], bp[i]) : // Otherwise nodes in our document sort first
                // Support: IE 11+, Edge 17 - 18+
                // IE/Edge sometimes throw a "Permission denied" error when strict-comparing
                // two documents; shallow comparisons work.
                /* eslint-disable eqeqeq */ ap[i] == preferredDoc ? -1 : bp[i] == preferredDoc ? 1 : /* eslint-enable eqeqeq */ 0;
            }), document;
        }, Sizzle.matches = function(expr, elements) {
            return Sizzle(expr, null, null, elements);
        }, Sizzle.matchesSelector = function(elem, expr) {
            if (setDocument(elem), support.matchesSelector && documentIsHTML && !nonnativeSelectorCache[expr + " "] && (!rbuggyMatches || !rbuggyMatches.test(expr)) && (!rbuggyQSA || !rbuggyQSA.test(expr))) try {
                var ret = matches.call(elem, expr);
                // IE 9's matchesSelector returns false on disconnected nodes
                if (ret || support.disconnectedMatch || // As well, disconnected nodes are said to be in a document
                // fragment in IE 9
                elem.document && 11 !== elem.document.nodeType) return ret;
            } catch (e) {
                nonnativeSelectorCache(expr, !0);
            }
            return Sizzle(expr, document, null, [
                elem
            ]).length > 0;
        }, Sizzle.contains = function(context, elem) {
            return (context.ownerDocument || context) != document && setDocument(context), contains(context, elem);
        }, Sizzle.attr = function(elem, name) {
            // Set document vars if needed
            // Support: IE 11+, Edge 17 - 18+
            // IE/Edge sometimes throw a "Permission denied" error when strict-comparing
            // two documents; shallow comparisons work.
            // eslint-disable-next-line eqeqeq
            (elem.ownerDocument || elem) != document && setDocument(elem);
            var fn = Expr.attrHandle[name.toLowerCase()], // Don't get fooled by Object.prototype properties (jQuery #13807)
            val = fn && hasOwn.call(Expr.attrHandle, name.toLowerCase()) ? fn(elem, name, !documentIsHTML) : void 0;
            return void 0 !== val ? val : support.attributes || !documentIsHTML ? elem.getAttribute(name) : (val = elem.getAttributeNode(name)) && val.specified ? val.value : null;
        }, Sizzle.escape = function(sel) {
            return (sel + "").replace(rcssescape, fcssescape);
        }, Sizzle.error = function(msg) {
            throw Error("Syntax error, unrecognized expression: " + msg);
        }, /**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */ Sizzle.uniqueSort = function(results) {
            var elem, duplicates = [], j = 0, i = 0;
            if (// Unless we *know* we can detect duplicates, assume their presence
            hasDuplicate = !support.detectDuplicates, sortInput = !support.sortStable && results.slice(0), results.sort(sortOrder), hasDuplicate) {
                for(; elem = results[i++];)elem === results[i] && (j = duplicates.push(i));
                for(; j--;)results.splice(duplicates[j], 1);
            }
            return(// Clear input after sorting to release objects
            // See https://github.com/jquery/sizzle/pull/225
            sortInput = null, results);
        }, /**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */ getText = Sizzle.getText = function(elem) {
            var node, ret = "", i = 0, nodeType = elem.nodeType;
            if (nodeType) {
                if (1 === nodeType || 9 === nodeType || 11 === nodeType) {
                    // Use textContent for elements
                    // innerText usage removed for consistency of new lines (jQuery #11153)
                    if ("string" == typeof elem.textContent) return elem.textContent;
                    // Traverse its children
                    for(elem = elem.firstChild; elem; elem = elem.nextSibling)ret += getText(elem);
                } else if (3 === nodeType || 4 === nodeType) return elem.nodeValue;
            } else // If no nodeType, this is expected to be an array
            for(; node = elem[i++];)// Do not traverse comment nodes
            ret += getText(node);
            // Do not include comment or processing instruction nodes
            return ret;
        }, (Expr = Sizzle.selectors = {
            // Can be adjusted by the user
            cacheLength: 50,
            createPseudo: markFunction,
            match: matchExpr,
            attrHandle: {},
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
                    match[3] = (match[3] || match[4] || match[5] || "").replace(runescape, funescape), "~=" === match[2] && (match[3] = " " + match[3] + " "), match.slice(0, 4);
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
                    var excess, unquoted = !match[6] && match[2];
                    return matchExpr.CHILD.test(match[0]) ? null : (match[3] ? match[2] = match[4] || match[5] || "" : unquoted && rpseudo.test(unquoted) && // Get excess from tokenize (recursively)
                    (excess = tokenize(unquoted, !0)) && // advance to the next closing parenthesis
                    (excess = unquoted.indexOf(")", unquoted.length - excess) - unquoted.length) && (// excess is a negative index
                    match[0] = match[0].slice(0, excess), match[2] = unquoted.slice(0, excess)), match.slice(0, 3));
                }
            },
            filter: {
                TAG: function(nodeNameSelector) {
                    var nodeName = nodeNameSelector.replace(runescape, funescape).toLowerCase();
                    return "*" === nodeNameSelector ? function() {
                        return !0;
                    } : function(elem) {
                        return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
                    };
                },
                CLASS: function(className) {
                    var pattern = classCache[className + " "];
                    return pattern || (pattern = RegExp("(^|" + whitespace + ")" + className + "(" + whitespace + "|$)"), classCache(className, function(elem) {
                        return pattern.test("string" == typeof elem.className && elem.className || void 0 !== elem.getAttribute && elem.getAttribute("class") || "");
                    }));
                },
                ATTR: function(name, operator, check) {
                    return function(elem) {
                        var result = Sizzle.attr(elem, name);
                        return null == result ? "!=" === operator : !operator || (result += "", "=" === operator ? result === check : "!=" === operator ? result !== check : "^=" === operator ? check && 0 === result.indexOf(check) : "*=" === operator ? check && result.indexOf(check) > -1 : "$=" === operator ? check && result.slice(-check.length) === check : "~=" === operator ? (" " + result.replace(rwhitespace, " ") + " ").indexOf(check) > -1 : "|=" === operator && (result === check || result.slice(0, check.length + 1) === check + "-"));
                    /* eslint-enable max-len */ };
                },
                CHILD: function(type, what, _argument, first, last) {
                    var simple = "nth" !== type.slice(0, 3), forward = "last" !== type.slice(-4), ofType = "of-type" === what;
                    return 1 === first && 0 === last ? // Shortcut for :nth-*(n)
                    function(elem) {
                        return !!elem.parentNode;
                    } : function(elem, _context, xml) {
                        var cache, uniqueCache, outerCache, node, nodeIndex, start, dir = simple !== forward ? "nextSibling" : "previousSibling", parent = elem.parentNode, name = ofType && elem.nodeName.toLowerCase(), useCache = !xml && !ofType, diff = !1;
                        if (parent) {
                            // :(first|last|only)-(child|of-type)
                            if (simple) {
                                for(; dir;){
                                    for(node = elem; node = node[dir];)if (ofType ? node.nodeName.toLowerCase() === name : 1 === node.nodeType) return !1;
                                    // Reverse direction for :only-* (if we haven't yet done so)
                                    start = dir = "only" === type && !start && "nextSibling";
                                }
                                return !0;
                            }
                            // non-xml :nth-child(...) stores cache data on `parent`
                            if (start = [
                                forward ? parent.firstChild : parent.lastChild
                            ], forward && useCache) {
                                for(diff = (nodeIndex = (cache = // Support: IE <9 only
                                // Defend against cloned attroperties (jQuery gh-1709)
                                (uniqueCache = (outerCache = // Seek `elem` from a previously-cached index
                                // ...in a gzip-friendly way
                                (node = parent)[expando] || (node[expando] = {}))[node.uniqueID] || (outerCache[node.uniqueID] = {}))[type] || [])[0] === dirruns && cache[1]) && cache[2], node = nodeIndex && parent.childNodes[nodeIndex]; node = ++nodeIndex && node && node[dir] || // Fallback to seeking `elem` from the start
                                (diff = nodeIndex = 0) || start.pop();)// When found, cache indexes on `parent` and break
                                if (1 === node.nodeType && ++diff && node === elem) {
                                    uniqueCache[type] = [
                                        dirruns,
                                        nodeIndex,
                                        diff
                                    ];
                                    break;
                                }
                            } else // xml :nth-child(...)
                            // or :nth-last-child(...) or :nth(-last)?-of-type(...)
                            if (useCache && (diff = nodeIndex = (cache = // Support: IE <9 only
                            // Defend against cloned attroperties (jQuery gh-1709)
                            (uniqueCache = (outerCache = // ...in a gzip-friendly way
                            (node = elem)[expando] || (node[expando] = {}))[node.uniqueID] || (outerCache[node.uniqueID] = {}))[type] || [])[0] === dirruns && cache[1]), !1 === diff) // Use the same loop as above to seek `elem` from the start
                            for(; (node = ++nodeIndex && node && node[dir] || (diff = nodeIndex = 0) || start.pop()) && (!((ofType ? node.nodeName.toLowerCase() === name : 1 === node.nodeType) && ++diff) || (useCache && (// Support: IE <9 only
                            // Defend against cloned attroperties (jQuery gh-1709)
                            (uniqueCache = (outerCache = node[expando] || (node[expando] = {}))[node.uniqueID] || (outerCache[node.uniqueID] = {}))[type] = [
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
                        for(var idx, matched = fn(seed, argument), i = matched.length; i--;)idx = indexOf(seed, matched[i]), seed[idx] = !(matches[idx] = matched[i]);
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
                    return matcher[expando] ? markFunction(function(seed, matches, _context, xml) {
                        // Match elements unmatched by `matcher`
                        for(var elem, unmatched = matcher(seed, null, xml, []), i = seed.length; i--;)(elem = unmatched[i]) && (seed[i] = !(matches[i] = elem));
                    }) : function(elem, _context, xml) {
                        return input[0] = elem, matcher(input, null, xml, results), // Don't keep the element (issue #299)
                        input[0] = null, !results.pop();
                    };
                }),
                has: markFunction(function(selector) {
                    return function(elem) {
                        return Sizzle(selector, elem).length > 0;
                    };
                }),
                contains: markFunction(function(text) {
                    return text = text.replace(runescape, funescape), function(elem) {
                        return (elem.textContent || getText(elem)).indexOf(text) > -1;
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
                        do if (elemLang = documentIsHTML ? elem.lang : elem.getAttribute("xml:lang") || elem.getAttribute("lang")) return (elemLang = elemLang.toLowerCase()) === lang || 0 === elemLang.indexOf(lang + "-");
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
                enabled: createDisabledPseudo(!1),
                disabled: createDisabledPseudo(!0),
                checked: function(elem) {
                    // In CSS3, :checked should return both checked and selected elements
                    // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
                    var nodeName = elem.nodeName.toLowerCase();
                    return "input" === nodeName && !!elem.checked || "option" === nodeName && !!elem.selected;
                },
                selected: function(elem) {
                    return elem.parentNode && // eslint-disable-next-line no-unused-expressions
                    elem.parentNode.selectedIndex, !0 === elem.selected;
                },
                // Contents
                empty: function(elem) {
                    // http://www.w3.org/TR/selectors/#empty-pseudo
                    // :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
                    //   but not by others (comment: 8; processing instruction: 7; etc.)
                    // nodeType < 6 works because attributes (2) do not appear as children
                    for(elem = elem.firstChild; elem; elem = elem.nextSibling)if (elem.nodeType < 6) return !1;
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
                    var name = elem.nodeName.toLowerCase();
                    return "input" === name && "button" === elem.type || "button" === name;
                },
                text: function(elem) {
                    var attr;
                    return "input" === elem.nodeName.toLowerCase() && "text" === elem.type && // Support: IE<8
                    // New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
                    (null == (attr = elem.getAttribute("type")) || "text" === attr.toLowerCase());
                },
                // Position-in-collection
                first: createPositionalPseudo(function() {
                    return [
                        0
                    ];
                }),
                last: createPositionalPseudo(function(_matchIndexes, length) {
                    return [
                        length - 1
                    ];
                }),
                eq: createPositionalPseudo(function(_matchIndexes, length, argument) {
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
                    for(var i = argument < 0 ? argument + length : argument > length ? length : argument; --i >= 0;)matchIndexes.push(i);
                    return matchIndexes;
                }),
                gt: createPositionalPseudo(function(matchIndexes, length, argument) {
                    for(var i = argument < 0 ? argument + length : argument; ++i < length;)matchIndexes.push(i);
                    return matchIndexes;
                })
            }
        }).pseudos.nth = Expr.pseudos.eq, {
            radio: !0,
            checkbox: !0,
            file: !0,
            password: !0,
            image: !0
        })Expr.pseudos[i] = /**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */ function(type) {
            return function(elem) {
                return "input" === elem.nodeName.toLowerCase() && elem.type === type;
            };
        }(i);
        for(i in {
            submit: !0,
            reset: !0
        })Expr.pseudos[i] = /**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */ function(type) {
            return function(elem) {
                var name = elem.nodeName.toLowerCase();
                return ("input" === name || "button" === name) && elem.type === type;
            };
        }(i);
        // Easy API for creating new setFilters
        function setFilters() {}
        function toSelector(tokens) {
            for(var i = 0, len = tokens.length, selector = ""; i < len; i++)selector += tokens[i].value;
            return selector;
        }
        function addCombinator(matcher, combinator, base) {
            var dir = combinator.dir, skip = combinator.next, key = skip || dir, checkNonElements = base && "parentNode" === key, doneName = done++;
            return combinator.first ? // Check against closest ancestor/preceding element
            function(elem, context, xml) {
                for(; elem = elem[dir];)if (1 === elem.nodeType || checkNonElements) return matcher(elem, context, xml);
                return !1;
            } : // Check against all ancestor/preceding elements
            function(elem, context, xml) {
                var oldCache, uniqueCache, outerCache, newCache = [
                    dirruns,
                    doneName
                ];
                // We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
                if (xml) {
                    for(; elem = elem[dir];)if ((1 === elem.nodeType || checkNonElements) && matcher(elem, context, xml)) return !0;
                } else for(; elem = elem[dir];)if (1 === elem.nodeType || checkNonElements) {
                    if (// Support: IE <9 only
                    // Defend against cloned attroperties (jQuery gh-1709)
                    uniqueCache = (outerCache = elem[expando] || (elem[expando] = {}))[elem.uniqueID] || (outerCache[elem.uniqueID] = {}), skip && skip === elem.nodeName.toLowerCase()) elem = elem[dir] || elem;
                    else if ((oldCache = uniqueCache[key]) && oldCache[0] === dirruns && oldCache[1] === doneName) // Assign to newCache so results back-propagate to previous elements
                    return newCache[2] = oldCache[2];
                    else // A match means we're done; a fail means we have to keep checking
                    if (// Reuse newcache so results back-propagate to previous elements
                    uniqueCache[key] = newCache, newCache[2] = matcher(elem, context, xml)) return !0;
                }
                return !1;
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
        return setFilters.prototype = Expr.filters = Expr.pseudos, Expr.setFilters = new setFilters(), tokenize = Sizzle.tokenize = function(selector, parseOnly) {
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
            return parseOnly ? soFar.length : soFar ? Sizzle.error(selector) : // Cache the tokens
            tokenCache(selector, groups).slice(0);
        }, compile = Sizzle.compile = function(selector, match /* Internal Use Only */ ) {
            var bySet, byElement, superMatcher, i, setMatchers = [], elementMatchers = [], cached = compilerCache[selector + " "];
            if (!cached) {
                for(match || (match = tokenize(selector)), i = match.length; i--;)(cached = function matcherFromTokens(tokens) {
                    for(var checkContext, matcher, j, len = tokens.length, leadingRelative = Expr.relative[tokens[0].type], implicitRelative = leadingRelative || Expr.relative[" "], i = leadingRelative ? 1 : 0, // The foundational matcher ensures that elements are reachable from top-level context(s)
                    matchContext = addCombinator(function(elem) {
                        return elem === checkContext;
                    }, implicitRelative, !0), matchAnyContext = addCombinator(function(elem) {
                        return indexOf(checkContext, elem) > -1;
                    }, implicitRelative, !0), matchers = [
                        function(elem, context, xml) {
                            var ret = !leadingRelative && (xml || context !== outermostContext) || ((checkContext = context).nodeType ? matchContext(elem, context, xml) : matchAnyContext(elem, context, xml));
                            return(// Avoid hanging onto element (issue #299)
                            checkContext = null, ret);
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
                                    matcherIn = preFilter && (seed || !selector) ? condense(elems, preMap, preFilter, context, xml) : elems, matcherOut = matcher ? // If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
                                    postFinder || (seed ? preFilter : preexisting || postFilter) ? // ...intermediate processing is necessary
                                    [] : // ...otherwise use results directly
                                    results : matcherIn;
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
                                            i = matcherOut.length; i--;)(elem = matcherOut[i]) && (temp = postFinder ? indexOf(seed, elem) : preMap[i]) > -1 && (seed[temp] = !(results[temp] = elem));
                                        }
                                    } else matcherOut = condense(matcherOut === results ? matcherOut.splice(preexisting, matcherOut.length) : matcherOut), postFinder ? postFinder(null, results, matcherOut, xml) : push.apply(results, matcherOut);
                                });
                            }(i > 1 && elementMatcher(matchers), i > 1 && toSelector(// If the preceding token was a descendant combinator, insert an implicit any-element `*`
                            tokens.slice(0, i - 1).concat({
                                value: " " === tokens[i - 2].type ? "*" : ""
                            })).replace(rtrim, "$1"), matcher, i < j && matcherFromTokens(tokens.slice(i, j)), j < len && matcherFromTokens(tokens = tokens.slice(j)), j < len && toSelector(tokens));
                        }
                        matchers.push(matcher);
                    }
                    return elementMatcher(matchers);
                }(match[i]))[expando] ? setMatchers.push(cached) : elementMatchers.push(cached);
                // Save selector and tokenization
                // Cache the compiled function
                (cached = compilerCache(selector, (bySet = setMatchers.length > 0, byElement = elementMatchers.length > 0, superMatcher = function(seed, context, xml, results, outermost) {
                    var elem, j, matcher, matchedCount = 0, i = "0", unmatched = seed && [], setMatched = [], contextBackup = outermostContext, // We must always have either seed elements or outermost context
                    elems = seed || byElement && Expr.find.TAG("*", outermost), // Use integer dirruns iff this is the outermost matcher
                    dirrunsUnique = dirruns += null == contextBackup ? 1 : Math.random() || 0.1, len = elems.length;
                    // Add elements passing elementMatchers directly to results
                    // Support: IE<9, Safari
                    // Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
                    for(outermost && // Support: IE 11+, Edge 17 - 18+
                    // IE/Edge sometimes throw a "Permission denied" error when strict-comparing
                    // two documents; shallow comparisons work.
                    // eslint-disable-next-line eqeqeq
                    (outermostContext = context == document || context || outermost); i !== len && null != (elem = elems[i]); i++){
                        if (byElement && elem) {
                            for(j = 0, context || elem.ownerDocument == document || (setDocument(elem), xml = !documentIsHTML); matcher = elementMatchers[j++];)if (matcher(elem, context || document, xml)) {
                                results.push(elem);
                                break;
                            }
                            outermost && (dirruns = dirrunsUnique);
                        }
                        // Track unmatched elements for set filters
                        bySet && ((elem = !matcher && elem) && matchedCount--, seed && unmatched.push(elem));
                    }
                    // Apply set filters to unmatched elements
                    // NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
                    // equals `i`), unless we didn't visit _any_ elements in the above loop because we have
                    // no element matchers and no seed.
                    // Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
                    // case, which will result in a "00" `matchedCount` that differs from `i` but is also
                    // numerically zero.
                    if (// `i` is now the count of elements visited above, and adding it to `matchedCount`
                    // makes the latter nonnegative.
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
                }, bySet ? markFunction(superMatcher) : superMatcher))).selector = selector;
            }
            return cached;
        }, /**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */ select = Sizzle.select = function(selector, context, results, seed) {
            var i, tokens, token, type, find, compiled = "function" == typeof selector && selector, match = !seed && tokenize(selector = compiled.selector || selector);
            // Try to minimize operations if there is only one selector in the list and no seed
            // (the latter of which guarantees us context)
            if (results = results || [], 1 === match.length) {
                if (// Reduce context if the leading compound selector is an ID
                (tokens = match[0] = match[0].slice(0)).length > 2 && "ID" === (token = tokens[0]).type && 9 === context.nodeType && documentIsHTML && Expr.relative[tokens[1].type]) {
                    if (!(context = (Expr.find.ID(token.matches[0].replace(runescape, funescape), context) || [])[0])) return results;
                    compiled && (context = context.parentNode), selector = selector.slice(tokens.shift().value.length);
                }
                for(// Fetch a seed set for right-to-left matching
                i = matchExpr.needsContext.test(selector) ? 0 : tokens.length; // Abort if we hit a combinator
                i-- && (token = tokens[i], !Expr.relative[type = token.type]);)if ((find = Expr.find[type]) && (seed = find(token.matches[0].replace(runescape, funescape), rsibling.test(tokens[0].type) && testContext(context.parentNode) || context))) {
                    if (// If seed is empty or no tokens remain, we can return early
                    tokens.splice(i, 1), !(selector = seed.length && toSelector(tokens))) return push.apply(results, seed), results;
                    break;
                }
            }
            return(// Compile and execute a filtering function if one is not provided
            // Provide `match` to avoid retokenization if we modified the selector above
            (compiled || compile(selector, match))(seed, context, !documentIsHTML, results, !context || rsibling.test(selector) && testContext(context.parentNode) || context), results);
        }, // One-time assignments
        // Sort stability
        support.sortStable = expando.split("").sort(sortOrder).join("") === expando, // Support: Chrome 14-35+
        // Always assume duplicates if they aren't passed to the comparison function
        support.detectDuplicates = !!hasDuplicate, // Initialize against the default document
        setDocument(), // Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
        // Detached nodes confoundingly follow *each other*
        support.sortDetached = assert(function(el) {
            // Should return 1, but returns 4 (following)
            return 1 & el.compareDocumentPosition(document.createElement("fieldset"));
        }), assert(function(el) {
            return el.innerHTML = "<a href='#'></a>", "#" === el.firstChild.getAttribute("href");
        }) || addHandle("type|href|height|width", function(elem, name, isXML) {
            if (!isXML) return elem.getAttribute(name, "type" === name.toLowerCase() ? 1 : 2);
        }), support.attributes && assert(function(el) {
            return el.innerHTML = "<input/>", el.firstChild.setAttribute("value", ""), "" === el.firstChild.getAttribute("value");
        }) || addHandle("value", function(elem, _name, isXML) {
            if (!isXML && "input" === elem.nodeName.toLowerCase()) return elem.defaultValue;
        }), assert(function(el) {
            return null == el.getAttribute("disabled");
        }) || addHandle(booleans, function(elem, name, isXML) {
            var val;
            if (!isXML) return !0 === elem[name] ? name.toLowerCase() : (val = elem.getAttributeNode(name)) && val.specified ? val.value : null;
        }), Sizzle;
    }(window1);
    jQuery.find = Sizzle, jQuery.expr = Sizzle.selectors, // Deprecated
    jQuery.expr[":"] = jQuery.expr.pseudos, jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort, jQuery.text = Sizzle.getText, jQuery.isXMLDoc = Sizzle.isXML, jQuery.contains = Sizzle.contains, jQuery.escapeSelector = Sizzle.escape;
    var dir = function(elem, dir, until) {
        for(var matched = [], truncate = void 0 !== until; (elem = elem[dir]) && 9 !== elem.nodeType;)if (1 === elem.nodeType) {
            if (truncate && jQuery(elem).is(until)) break;
            matched.push(elem);
        }
        return matched;
    }, siblings = function(n, elem) {
        for(var matched = []; n; n = n.nextSibling)1 === n.nodeType && n !== elem && matched.push(n);
        return matched;
    }, rneedsContext = jQuery.expr.match.needsContext;
    function nodeName(elem, name) {
        return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
    }
    var rsingleTag = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;
    // Implement the identical functionality for filter and not
    function winnow(elements, qualifier, not) {
        return isFunction(qualifier) ? jQuery.grep(elements, function(elem, i) {
            return !!qualifier.call(elem, i, elem) !== not;
        }) : qualifier.nodeType ? jQuery.grep(elements, function(elem) {
            return elem === qualifier !== not;
        }) : "string" != typeof qualifier ? jQuery.grep(elements, function(elem) {
            return indexOf.call(qualifier, elem) > -1 !== not;
        }) : jQuery.filter(qualifier, elements, not);
    }
    jQuery.filter = function(expr, elems, not) {
        var elem = elems[0];
        return (not && (expr = ":not(" + expr + ")"), 1 === elems.length && 1 === elem.nodeType) ? jQuery.find.matchesSelector(elem, expr) ? [
            elem
        ] : [] : jQuery.find.matches(expr, jQuery.grep(elems, function(elem) {
            return 1 === elem.nodeType;
        }));
    }, jQuery.fn.extend({
        find: function(selector) {
            var i, ret, len = this.length, self = this;
            if ("string" != typeof selector) return this.pushStack(jQuery(selector).filter(function() {
                for(i = 0; i < len; i++)if (jQuery.contains(self[i], this)) return !0;
            }));
            for(i = 0, ret = this.pushStack([]); i < len; i++)jQuery.find(selector, self[i], ret);
            return len > 1 ? jQuery.uniqueSort(ret) : ret;
        },
        filter: function(selector) {
            return this.pushStack(winnow(this, selector || [], !1));
        },
        not: function(selector) {
            return this.pushStack(winnow(this, selector || [], !0));
        },
        is: function(selector) {
            return !!winnow(this, // If this is a positional/relative selector, check membership in the returned set
            // so $("p:first").is("p:last") won't return true for a doc with two "p".
            "string" == typeof selector && rneedsContext.test(selector) ? jQuery(selector) : selector || [], !1).length;
        }
    });
    // Initialize a jQuery object
    // A central reference to the root jQuery(document)
    var rootjQuery, // A simple way to check for HTML strings
    // Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
    // Strict HTML recognition (#11290: must start with <)
    // Shortcut simple #id case for speed
    rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;
    // Give the init function the jQuery prototype for later instantiation
    (jQuery.fn.init = function(selector, context, root) {
        var match, elem;
        // HANDLE: $(""), $(null), $(undefined), $(false)
        if (!selector) return this;
        // Handle HTML strings
        if (// Method init() accepts an alternate rootjQuery
        // so migrate can support jQuery.sub (gh-2101)
        root = root || rootjQuery, "string" == typeof selector) {
            // Match html or make sure no context is specified for #id
            if ((// Assume that strings that start and end with <> are HTML and skip the regex check
            match = "<" === selector[0] && ">" === selector[selector.length - 1] && selector.length >= 3 ? [
                null,
                selector,
                null
            ] : rquickExpr.exec(selector)) && (match[1] || !context)) {
                // HANDLE: $(html) -> $(array)
                if (!match[1]) return (elem = document.getElementById(match[2])) && (// Inject the element directly into the jQuery object
                this[0] = elem, this.length = 1), this;
                // HANDLE: $(html, props)
                if (context = context instanceof jQuery ? context[0] : context, // Option to run scripts is true for back-compat
                // Intentionally let the error be thrown if parseHTML is not present
                jQuery.merge(this, jQuery.parseHTML(match[1], context && context.nodeType ? context.ownerDocument || context : document, !0)), rsingleTag.test(match[1]) && jQuery.isPlainObject(context)) for(match in context)// Properties of context are called as methods if possible
                isFunction(this[match]) ? this[match](context[match]) : this.attr(match, context[match]);
                return this;
            // HANDLE: $(expr, $(...))
            }
            return !context || context.jquery ? (context || root).find(selector) : this.constructor(context).find(selector);
        // HANDLE: $(DOMElement)
        }
        return selector.nodeType ? (this[0] = selector, this.length = 1, this) : isFunction(selector) ? void 0 !== root.ready ? root.ready(selector) : // Execute immediately if ready is not present
        selector(jQuery) : jQuery.makeArray(selector, this);
    }).prototype = jQuery.fn, // Initialize central reference
    rootjQuery = jQuery(document);
    var rparentsprev = /^(?:parents|prev(?:Until|All))/, // Methods guaranteed to produce a unique set when starting from a unique set
    guaranteedUnique = {
        children: !0,
        contents: !0,
        next: !0,
        prev: !0
    };
    function sibling(cur, dir) {
        for(; (cur = cur[dir]) && 1 !== cur.nodeType;);
        return cur;
    }
    jQuery.fn.extend({
        has: function(target) {
            var targets = jQuery(target, this), l = targets.length;
            return this.filter(function() {
                for(var i = 0; i < l; i++)if (jQuery.contains(this, targets[i])) return !0;
            });
        },
        closest: function(selectors, context) {
            var cur, i = 0, l = this.length, matched = [], targets = "string" != typeof selectors && jQuery(selectors);
            // Positional selectors never match, since there's no _selection_ context
            if (!rneedsContext.test(selectors)) {
                for(; i < l; i++)for(cur = this[i]; cur && cur !== context; cur = cur.parentNode)// Always skip document fragments
                if (cur.nodeType < 11 && (targets ? targets.index(cur) > -1 : // Don't pass non-elements to Sizzle
                1 === cur.nodeType && jQuery.find.matchesSelector(cur, selectors))) {
                    matched.push(cur);
                    break;
                }
            }
            return this.pushStack(matched.length > 1 ? jQuery.uniqueSort(matched) : matched);
        },
        // Determine the position of an element within the set
        index: function(elem) {
            return(// No argument, return index in parent
            elem ? "string" == typeof elem ? indexOf.call(jQuery(elem), this[0]) : indexOf.call(this, // If it receives a jQuery object, the first element is used
            elem.jquery ? elem[0] : elem) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1);
        },
        add: function(selector, context) {
            return this.pushStack(jQuery.uniqueSort(jQuery.merge(this.get(), jQuery(selector, context))));
        },
        addBack: function(selector) {
            return this.add(null == selector ? this.prevObject : this.prevObject.filter(selector));
        }
    }), jQuery.each({
        parent: function(elem) {
            var parent = elem.parentNode;
            return parent && 11 !== parent.nodeType ? parent : null;
        },
        parents: function(elem) {
            return dir(elem, "parentNode");
        },
        parentsUntil: function(elem, _i, until) {
            return dir(elem, "parentNode", until);
        },
        next: function(elem) {
            return sibling(elem, "nextSibling");
        },
        prev: function(elem) {
            return sibling(elem, "previousSibling");
        },
        nextAll: function(elem) {
            return dir(elem, "nextSibling");
        },
        prevAll: function(elem) {
            return dir(elem, "previousSibling");
        },
        nextUntil: function(elem, _i, until) {
            return dir(elem, "nextSibling", until);
        },
        prevUntil: function(elem, _i, until) {
            return dir(elem, "previousSibling", until);
        },
        siblings: function(elem) {
            return siblings((elem.parentNode || {}).firstChild, elem);
        },
        children: function(elem) {
            return siblings(elem.firstChild);
        },
        contents: function(elem) {
            return null != elem.contentDocument && // Support: IE 11+
            // <object> elements with no `data` attribute has an object
            // `contentDocument` with a `null` prototype.
            getProto(elem.contentDocument) ? elem.contentDocument : (nodeName(elem, "template") && (elem = elem.content || elem), jQuery.merge([], elem.childNodes));
        }
    }, function(name, fn) {
        jQuery.fn[name] = function(until, selector) {
            var matched = jQuery.map(this, fn, until);
            return "Until" !== name.slice(-5) && (selector = until), selector && "string" == typeof selector && (matched = jQuery.filter(selector, matched)), this.length > 1 && (guaranteedUnique[name] || jQuery.uniqueSort(matched), rparentsprev.test(name) && matched.reverse()), this.pushStack(matched);
        };
    });
    var rnothtmlwhite = /[^\x20\t\r\n\f]+/g;
    function Identity(v) {
        return v;
    }
    function Thrower(ex) {
        throw ex;
    }
    function adoptValue(value, resolve, reject, noValue) {
        var method;
        try {
            // Check for promise aspect first to privilege synchronous behavior
            value && isFunction(method = value.promise) ? method.call(value).done(resolve).fail(reject) : value && isFunction(method = value.then) ? method.call(value, resolve, reject) : // Control `resolve` arguments by letting Array#slice cast boolean `noValue` to integer:
            // * false: [ value ].slice( 0 ) => resolve( value )
            // * true: [ value ].slice( 1 ) => resolve()
            resolve.apply(void 0, [
                value
            ].slice(noValue));
        // For Promises/A+, convert exceptions into rejections
        // Since jQuery.when doesn't unwrap thenables, we can skip the extra checks appearing in
        // Deferred#then to conditionally suppress rejection.
        } catch (value) {
            // Support: Android 4.0 only
            // Strict mode functions invoked without .call/.apply get global-object context
            reject.apply(void 0, [
                value
            ]);
        }
    }
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
        options = "string" == typeof options ? (options1 = options, object = {}, jQuery.each(options1.match(rnothtmlwhite) || [], function(_, flag) {
            object[flag] = !0;
        }), object) : jQuery.extend({}, options);
        var options1, object, firing, // Last fire value for non-forgettable lists
        memory, // Flag to know if list was already fired
        fired, // Flag to prevent firing
        locked, // Actual callback list
        list = [], // Queue of execution data for repeatable lists
        queue = [], // Index of currently firing callback (modified by add/remove as needed)
        firingIndex = -1, // Fire callbacks
        fire = function() {
            for(// Enforce single-firing
            locked = locked || options.once, // Execute callbacks for all pending executions,
            // respecting firingIndex overrides and runtime changes
            fired = firing = !0; queue.length; firingIndex = -1)for(memory = queue.shift(); ++firingIndex < list.length;)// Run callback and check for early termination
            !1 === list[firingIndex].apply(memory[0], memory[1]) && options.stopOnFalse && (// Jump to end and forget the data so .add doesn't re-fire
            firingIndex = list.length, memory = !1);
            options.memory || (memory = !1), firing = !1, locked && (list = memory ? [] : "");
        }, // Actual Callbacks object
        self = {
            // Add a callback or a collection of callbacks to the list
            add: function() {
                return list && (memory && !firing && (firingIndex = list.length - 1, queue.push(memory)), function add(args) {
                    jQuery.each(args, function(_, arg) {
                        isFunction(arg) ? options.unique && self.has(arg) || list.push(arg) : arg && arg.length && "string" !== toType(arg) && // Inspect recursively
                        add(arg);
                    });
                }(arguments), memory && !firing && fire()), this;
            },
            // Remove a callback from the list
            remove: function() {
                return jQuery.each(arguments, function(_, arg) {
                    for(var index; (index = jQuery.inArray(arg, list, index)) > -1;)list.splice(index, 1), index <= firingIndex && firingIndex--;
                }), this;
            },
            // Check if a given callback is in the list.
            // If no argument is given, return whether or not list has callbacks attached.
            has: function(fn) {
                return fn ? jQuery.inArray(fn, list) > -1 : list.length > 0;
            },
            // Remove all callbacks from the list
            empty: function() {
                return list && (list = []), this;
            },
            // Disable .fire and .add
            // Abort any current/pending executions
            // Clear all callbacks and values
            disable: function() {
                return locked = queue = [], list = memory = "", this;
            },
            disabled: function() {
                return !list;
            },
            // Disable .fire
            // Also disable .add unless we have memory (since it would have no effect)
            // Abort any pending executions
            lock: function() {
                return locked = queue = [], memory || firing || (list = memory = ""), this;
            },
            locked: function() {
                return !!locked;
            },
            // Call all callbacks with the given context and arguments
            fireWith: function(context, args) {
                return locked || (args = [
                    context,
                    (args = args || []).slice ? args.slice() : args
                ], queue.push(args), firing || fire()), this;
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
                // action, add listener, callbacks,
                // ... .then handlers, argument index, [final state]
                [
                    "notify",
                    "progress",
                    jQuery.Callbacks("memory"),
                    jQuery.Callbacks("memory"),
                    2
                ],
                [
                    "resolve",
                    "done",
                    jQuery.Callbacks("once memory"),
                    jQuery.Callbacks("once memory"),
                    0,
                    "resolved"
                ],
                [
                    "reject",
                    "fail",
                    jQuery.Callbacks("once memory"),
                    jQuery.Callbacks("once memory"),
                    1,
                    "rejected"
                ]
            ], state = "pending", promise = {
                state: function() {
                    return state;
                },
                always: function() {
                    return deferred.done(arguments).fail(arguments), this;
                },
                catch: function(fn) {
                    return promise.then(null, fn);
                },
                // Keep pipe for back-compat
                pipe: function() {
                    var fns = arguments;
                    return jQuery.Deferred(function(newDefer) {
                        jQuery.each(tuples, function(_i, tuple) {
                            // Map tuples (progress, done, fail) to arguments (done, fail, progress)
                            var fn = isFunction(fns[tuple[4]]) && fns[tuple[4]];
                            // deferred.progress(function() { bind to newDefer or newDefer.notify })
                            // deferred.done(function() { bind to newDefer or newDefer.resolve })
                            // deferred.fail(function() { bind to newDefer or newDefer.reject })
                            deferred[tuple[1]](function() {
                                var returned = fn && fn.apply(this, arguments);
                                returned && isFunction(returned.promise) ? returned.promise().progress(newDefer.notify).done(newDefer.resolve).fail(newDefer.reject) : newDefer[tuple[0] + "With"](this, fn ? [
                                    returned
                                ] : arguments);
                            });
                        }), fns = null;
                    }).promise();
                },
                then: function(onFulfilled, onRejected, onProgress) {
                    var maxDepth = 0;
                    function resolve(depth, deferred, handler, special) {
                        return function() {
                            var that = this, args = arguments, mightThrow = function() {
                                var returned, then;
                                // Support: Promises/A+ section 2.3.3.3.3
                                // https://promisesaplus.com/#point-59
                                // Ignore double-resolution attempts
                                if (!(depth < maxDepth)) {
                                    // Support: Promises/A+ section 2.3.1
                                    // https://promisesaplus.com/#point-48
                                    if ((returned = handler.apply(that, args)) === deferred.promise()) throw TypeError("Thenable self-resolution");
                                    // Handle a returned thenable
                                    isFunction(// Support: Promises/A+ sections 2.3.3.1, 3.5
                                    // https://promisesaplus.com/#point-54
                                    // https://promisesaplus.com/#point-75
                                    // Retrieve `then` only once
                                    then = returned && // Support: Promises/A+ section 2.3.4
                                    // https://promisesaplus.com/#point-64
                                    // Only check objects and functions for thenability
                                    ("object" == typeof returned || "function" == typeof returned) && returned.then) ? special ? then.call(returned, resolve(maxDepth, deferred, Identity, special), resolve(maxDepth, deferred, Thrower, special)) : (// ...and disregard older resolution values
                                    maxDepth++, then.call(returned, resolve(maxDepth, deferred, Identity, special), resolve(maxDepth, deferred, Thrower, special), resolve(maxDepth, deferred, Identity, deferred.notifyWith))) : (handler !== Identity && (that = void 0, args = [
                                        returned
                                    ]), // Process the value(s)
                                    // Default process is resolve
                                    (special || deferred.resolveWith)(that, args));
                                }
                            }, // Only normal processors (resolve) catch and reject exceptions
                            process = special ? mightThrow : function() {
                                try {
                                    mightThrow();
                                } catch (e) {
                                    jQuery.Deferred.exceptionHook && jQuery.Deferred.exceptionHook(e, process.stackTrace), depth + 1 >= maxDepth && (handler !== Thrower && (that = void 0, args = [
                                        e
                                    ]), deferred.rejectWith(that, args));
                                }
                            };
                            // Support: Promises/A+ section 2.3.3.3.1
                            // https://promisesaplus.com/#point-57
                            // Re-resolve promises immediately to dodge false rejection from
                            // subsequent errors
                            depth ? process() : (jQuery.Deferred.getStackHook && (process.stackTrace = jQuery.Deferred.getStackHook()), window1.setTimeout(process));
                        };
                    }
                    return jQuery.Deferred(function(newDefer) {
                        // progress_handlers.add( ... )
                        tuples[0][3].add(resolve(0, newDefer, isFunction(onProgress) ? onProgress : Identity, newDefer.notifyWith)), // fulfilled_handlers.add( ... )
                        tuples[1][3].add(resolve(0, newDefer, isFunction(onFulfilled) ? onFulfilled : Identity)), // rejected_handlers.add( ... )
                        tuples[2][3].add(resolve(0, newDefer, isFunction(onRejected) ? onRejected : Thrower));
                    }).promise();
                },
                // Get a promise for this deferred
                // If obj is provided, the promise aspect is added to the object
                promise: function(obj) {
                    return null != obj ? jQuery.extend(obj, promise) : promise;
                }
            }, deferred = {};
            // All done!
            return(// Add list-specific methods
            jQuery.each(tuples, function(i, tuple) {
                var list = tuple[2], stateString = tuple[5];
                // promise.progress = list.add
                // promise.done = list.add
                // promise.fail = list.add
                promise[tuple[1]] = list.add, stateString && list.add(function() {
                    // state = "resolved" (i.e., fulfilled)
                    // state = "rejected"
                    state = stateString;
                }, // rejected_callbacks.disable
                // fulfilled_callbacks.disable
                tuples[3 - i][2].disable, // rejected_handlers.disable
                // fulfilled_handlers.disable
                tuples[3 - i][3].disable, // progress_callbacks.lock
                tuples[0][2].lock, // progress_handlers.lock
                tuples[0][3].lock), // progress_handlers.fire
                // fulfilled_handlers.fire
                // rejected_handlers.fire
                list.add(tuple[3].fire), // deferred.notify = function() { deferred.notifyWith(...) }
                // deferred.resolve = function() { deferred.resolveWith(...) }
                // deferred.reject = function() { deferred.rejectWith(...) }
                deferred[tuple[0]] = function() {
                    return deferred[tuple[0] + "With"](this === deferred ? void 0 : this, arguments), this;
                }, // deferred.notifyWith = list.fireWith
                // deferred.resolveWith = list.fireWith
                // deferred.rejectWith = list.fireWith
                deferred[tuple[0] + "With"] = list.fireWith;
            }), // Make the deferred a promise
            promise.promise(deferred), func && func.call(deferred, deferred), deferred);
        },
        // Deferred helper
        when: function(singleValue) {
            var // count of uncompleted subordinates
            remaining = arguments.length, // count of unprocessed arguments
            i = remaining, // subordinate fulfillment data
            resolveContexts = Array(i), resolveValues = slice.call(arguments), // the master Deferred
            master = jQuery.Deferred(), // subordinate callback factory
            updateFunc = function(i) {
                return function(value) {
                    resolveContexts[i] = this, resolveValues[i] = arguments.length > 1 ? slice.call(arguments) : value, --remaining || master.resolveWith(resolveContexts, resolveValues);
                };
            };
            // Single- and empty arguments are adopted like Promise.resolve
            if (remaining <= 1 && (adoptValue(singleValue, master.done(updateFunc(i)).resolve, master.reject, !remaining), "pending" === master.state() || isFunction(resolveValues[i] && resolveValues[i].then))) return master.then();
            // Multiple arguments are aggregated like Promise.all array elements
            for(; i--;)adoptValue(resolveValues[i], updateFunc(i), master.reject);
            return master.promise();
        }
    });
    // These usually indicate a programmer mistake during development,
    // warn about them ASAP rather than swallowing them by default.
    var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
    jQuery.Deferred.exceptionHook = function(error, stack) {
        // Support: IE 8 - 9 only
        // Console exists when dev tools are open, which can happen at any time
        window1.console && window1.console.warn && error && rerrorNames.test(error.name) && window1.console.warn("jQuery.Deferred exception: " + error.message, error.stack, stack);
    }, jQuery.readyException = function(error) {
        window1.setTimeout(function() {
            throw error;
        });
    };
    // The deferred used on DOM ready
    var readyList = jQuery.Deferred();
    // The ready event handler and self cleanup method
    function completed() {
        document.removeEventListener("DOMContentLoaded", completed), window1.removeEventListener("load", completed), jQuery.ready();
    }
    jQuery.fn.ready = function(fn) {
        return readyList.then(fn)// Wrap jQuery.readyException in a function so that the lookup
        // happens at the time of error handling instead of callback
        // registration.
        .catch(function(error) {
            jQuery.readyException(error);
        }), this;
    }, jQuery.extend({
        // Is the DOM ready to be used? Set to true once it occurs.
        isReady: !1,
        // A counter to track how many items to wait for before
        // the ready event fires. See #6781
        readyWait: 1,
        // Handle when the DOM is ready
        ready: function(wait) {
            // Abort if there are pending holds or we're already ready
            !(!0 === wait ? --jQuery.readyWait : jQuery.isReady) && (// Remember that the DOM is ready
            jQuery.isReady = !0, !0 !== wait && --jQuery.readyWait > 0 || // If there are functions bound, to execute
            readyList.resolveWith(document, [
                jQuery
            ]));
        }
    }), jQuery.ready.then = readyList.then, "complete" !== document.readyState && ("loading" === document.readyState || document.documentElement.doScroll) ? (// Use the handy event callback
    document.addEventListener("DOMContentLoaded", completed), // A fallback to window.onload, that will always work
    window1.addEventListener("load", completed)) : // Handle it asynchronously to allow scripts the opportunity to delay ready
    window1.setTimeout(jQuery.ready);
    // Multifunctional method to get and set values of a collection
    // The value/s can optionally be executed if it's a function
    var access = function(elems, fn, key, value, chainable, emptyGet, raw) {
        var i = 0, len = elems.length, bulk = null == key;
        // Sets many values
        if ("object" === toType(key)) for(i in chainable = !0, key)access(elems, fn, i, key[i], !0, emptyGet, raw);
        else if (void 0 !== value && (chainable = !0, isFunction(value) || (raw = !0), bulk && (raw ? (fn.call(elems, value), fn = null) : (bulk = fn, fn = function(elem, _key, value) {
            return bulk.call(jQuery(elem), value);
        })), fn)) for(; i < len; i++)fn(elems[i], key, raw ? value : value.call(elems[i], i, fn(elems[i], key)));
        return chainable ? elems : bulk ? fn.call(elems) : len ? fn(elems[0], key) : emptyGet;
    }, rmsPrefix = /^-ms-/, rdashAlpha = /-([a-z])/g;
    // Used by camelCase as callback to replace()
    function fcamelCase(_all, letter) {
        return letter.toUpperCase();
    }
    // Convert dashed to camelCase; used by the css and data modules
    // Support: IE <=9 - 11, Edge 12 - 15
    // Microsoft forgot to hump their vendor prefix (#9572)
    function camelCase(string) {
        return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase);
    }
    var acceptData = function(owner) {
        // Accepts only:
        //  - Node
        //    - Node.ELEMENT_NODE
        //    - Node.DOCUMENT_NODE
        //  - Object
        //    - Any
        return 1 === owner.nodeType || 9 === owner.nodeType || !+owner.nodeType;
    };
    function Data() {
        this.expando = jQuery.expando + Data.uid++;
    }
    Data.uid = 1, Data.prototype = {
        cache: function(owner) {
            // Check if the owner object already has a cache
            var value = owner[this.expando];
            return !value && (value = {}, acceptData(owner) && (owner.nodeType ? owner[this.expando] = value : Object.defineProperty(owner, this.expando, {
                value: value,
                configurable: !0
            }))), value;
        },
        set: function(owner, data, value) {
            var prop, cache = this.cache(owner);
            // Handle: [ owner, key, value ] args
            // Always use camelCase key (gh-2257)
            if ("string" == typeof data) cache[camelCase(data)] = value;
            else // Copy the properties one-by-one to the cache object
            for(prop in data)cache[camelCase(prop)] = data[prop];
            return cache;
        },
        get: function(owner, key) {
            return void 0 === key ? this.cache(owner) : // Always use camelCase key (gh-2257)
            owner[this.expando] && owner[this.expando][camelCase(key)];
        },
        access: function(owner, key, value) {
            return(// In cases where either:
            //
            //   1. No key was specified
            //   2. A string key was specified, but no value provided
            //
            // Take the "read" path and allow the get method to determine
            // which value to return, respectively either:
            //
            //   1. The entire cache object
            //   2. The data stored at the key
            //
            void 0 === key || key && "string" == typeof key && void 0 === value ? this.get(owner, key) : (// When the key is not a string, or both a key and value
            // are specified, set or extend (existing objects) with either:
            //
            //   1. An object of properties
            //   2. A key and value
            //
            this.set(owner, key, value), void 0 !== value ? value : key));
        },
        remove: function(owner, key) {
            var i, cache = owner[this.expando];
            if (void 0 !== cache) {
                if (void 0 !== key) for(i = (// If key is an array of keys...
                // We always set camelCase keys, so remove that.
                key = Array.isArray(key) ? key.map(camelCase) : ((key = camelCase(key)) in cache) ? [
                    key
                ] : key.match(rnothtmlwhite) || []).length; i--;)delete cache[key[i]];
                // Remove the expando if there's no more data
                (void 0 === key || jQuery.isEmptyObject(cache)) && (owner.nodeType ? owner[this.expando] = void 0 : delete owner[this.expando]);
            }
        },
        hasData: function(owner) {
            var cache = owner[this.expando];
            return void 0 !== cache && !jQuery.isEmptyObject(cache);
        }
    };
    var dataPriv = new Data(), dataUser = new Data(), rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/, rmultiDash = /[A-Z]/g;
    function dataAttr(elem, key, data) {
        var name, data1;
        // If nothing was found internally, try to fetch any
        // data from the HTML5 data-* attribute
        if (void 0 === data && 1 === elem.nodeType) {
            if (name = "data-" + key.replace(rmultiDash, "-$&").toLowerCase(), "string" == typeof (data = elem.getAttribute(name))) {
                try {
                    data1 = data, data = "true" === data1 || "false" !== data1 && ("null" === data1 ? null : data1 === +data1 + "" ? +data1 : rbrace.test(data1) ? JSON.parse(data1) : data1);
                } catch (e) {}
                // Make sure we set the data so it isn't changed later
                dataUser.set(elem, key, data);
            } else data = void 0;
        }
        return data;
    }
    jQuery.extend({
        hasData: function(elem) {
            return dataUser.hasData(elem) || dataPriv.hasData(elem);
        },
        data: function(elem, name, data) {
            return dataUser.access(elem, name, data);
        },
        removeData: function(elem, name) {
            dataUser.remove(elem, name);
        },
        // TODO: Now that all calls to _data and _removeData have been replaced
        // with direct calls to dataPriv methods, these can be deprecated.
        _data: function(elem, name, data) {
            return dataPriv.access(elem, name, data);
        },
        _removeData: function(elem, name) {
            dataPriv.remove(elem, name);
        }
    }), jQuery.fn.extend({
        data: function(key, value) {
            var i, name, data, elem = this[0], attrs = elem && elem.attributes;
            // Gets all values
            if (void 0 === key) {
                if (this.length && (data = dataUser.get(elem), 1 === elem.nodeType && !dataPriv.get(elem, "hasDataAttrs"))) {
                    for(i = attrs.length; i--;)// Support: IE 11 only
                    // The attrs elements can be null (#14894)
                    attrs[i] && 0 === (name = attrs[i].name).indexOf("data-") && dataAttr(elem, name = camelCase(name.slice(5)), data[name]);
                    dataPriv.set(elem, "hasDataAttrs", !0);
                }
                return data;
            }
            return(// Sets multiple values
            "object" == typeof key ? this.each(function() {
                dataUser.set(this, key);
            }) : access(this, function(value) {
                var data;
                // The calling jQuery object (element matches) is not empty
                // (and therefore has an element appears at this[ 0 ]) and the
                // `value` parameter was not undefined. An empty jQuery object
                // will result in `undefined` for elem = this[ 0 ] which will
                // throw an exception if an attempt to read a data cache is made.
                if (elem && void 0 === value) return void 0 !== // Attempt to get data from the cache
                // The key will always be camelCased in Data
                (data = dataUser.get(elem, key)) || void 0 !== // Attempt to "discover" the data in
                // HTML5 custom data-* attrs
                (data = dataAttr(elem, key)) ? data : // We tried really hard, but the data doesn't exist.
                void 0;
                // Set the data...
                this.each(function() {
                    // We always store the camelCased key
                    dataUser.set(this, key, value);
                });
            }, null, value, arguments.length > 1, null, !0));
        },
        removeData: function(key) {
            return this.each(function() {
                dataUser.remove(this, key);
            });
        }
    }), jQuery.extend({
        queue: function(elem, type, data) {
            var queue;
            if (elem) return type = (type || "fx") + "queue", queue = dataPriv.get(elem, type), data && (!queue || Array.isArray(data) ? queue = dataPriv.access(elem, type, jQuery.makeArray(data)) : queue.push(data)), queue || [];
        },
        dequeue: function(elem, type) {
            type = type || "fx";
            var queue = jQuery.queue(elem, type), startLength = queue.length, fn = queue.shift(), hooks = jQuery._queueHooks(elem, type);
            "inprogress" === fn && (fn = queue.shift(), startLength--), fn && ("fx" === type && queue.unshift("inprogress"), // Clear up the last queue stop function
            delete hooks.stop, fn.call(elem, function() {
                jQuery.dequeue(elem, type);
            }, hooks)), !startLength && hooks && hooks.empty.fire();
        },
        // Not public - generate a queueHooks object, or return the current one
        _queueHooks: function(elem, type) {
            var key = type + "queueHooks";
            return dataPriv.get(elem, key) || dataPriv.access(elem, key, {
                empty: jQuery.Callbacks("once memory").add(function() {
                    dataPriv.remove(elem, [
                        type + "queue",
                        key
                    ]);
                })
            });
        }
    }), jQuery.fn.extend({
        queue: function(type, data) {
            var setter = 2;
            return ("string" != typeof type && (data = type, type = "fx", setter--), arguments.length < setter) ? jQuery.queue(this[0], type) : void 0 === data ? this : this.each(function() {
                var queue = jQuery.queue(this, type, data);
                // Ensure a hooks for this queue
                jQuery._queueHooks(this, type), "fx" === type && "inprogress" !== queue[0] && jQuery.dequeue(this, type);
            });
        },
        dequeue: function(type) {
            return this.each(function() {
                jQuery.dequeue(this, type);
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
            for("string" != typeof type && (obj = type, type = void 0), type = type || "fx"; i--;)(tmp = dataPriv.get(elements[i], type + "queueHooks")) && tmp.empty && (count++, tmp.empty.add(resolve));
            return resolve(), defer.promise(obj);
        }
    });
    var pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source, rcssNum = RegExp("^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i"), cssExpand = [
        "Top",
        "Right",
        "Bottom",
        "Left"
    ], documentElement = document.documentElement, isAttached = function(elem) {
        return jQuery.contains(elem.ownerDocument, elem);
    }, composed = {
        composed: !0
    };
    documentElement.getRootNode && (isAttached = function(elem) {
        return jQuery.contains(elem.ownerDocument, elem) || elem.getRootNode(composed) === elem.ownerDocument;
    });
    var isHiddenWithinTree = function(elem, el) {
        // Inline style trumps all
        return "none" === // isHiddenWithinTree might be called from jQuery#filter function;
        // in that case, element will be second argument
        (elem = el || elem).style.display || "" === elem.style.display && // Otherwise, check computed style
        // Support: Firefox <=43 - 45
        // Disconnected elements can have computed display: none, so first confirm that elem is
        // in the document.
        isAttached(elem) && "none" === jQuery.css(elem, "display");
    };
    function adjustCSS(elem, prop, valueParts, tween) {
        var adjusted, scale, maxIterations = 20, currentValue = tween ? function() {
            return tween.cur();
        } : function() {
            return jQuery.css(elem, prop, "");
        }, initial = currentValue(), unit = valueParts && valueParts[3] || (jQuery.cssNumber[prop] ? "" : "px"), // Starting value computation is required for potential unit mismatches
        initialInUnit = elem.nodeType && (jQuery.cssNumber[prop] || "px" !== unit && +initial) && rcssNum.exec(jQuery.css(elem, prop));
        if (initialInUnit && initialInUnit[3] !== unit) {
            for(// Support: Firefox <=54
            // Halve the iteration target value to prevent interference from CSS upper bounds (gh-2144)
            initial /= 2, // Trust units reported by jQuery.css
            unit = unit || initialInUnit[3], // Iteratively approximate from a nonzero starting point
            initialInUnit = +initial || 1; maxIterations--;)// Evaluate and update our best guess (doubling guesses that zero out).
            // Finish if the scale equals or crosses 1 (making the old*new product non-positive).
            jQuery.style(elem, prop, initialInUnit + unit), (1 - scale) * (1 - (scale = currentValue() / initial || 0.5)) <= 0 && (maxIterations = 0), initialInUnit /= scale;
            initialInUnit *= 2, jQuery.style(elem, prop, initialInUnit + unit), // Make sure we update the tween properties later on
            valueParts = valueParts || [];
        }
        return valueParts && (initialInUnit = +initialInUnit || +initial || 0, // Apply relative offset (+=/-=) if specified
        adjusted = valueParts[1] ? initialInUnit + (valueParts[1] + 1) * valueParts[2] : +valueParts[2], tween && (tween.unit = unit, tween.start = initialInUnit, tween.end = adjusted)), adjusted;
    }
    var defaultDisplayMap = {};
    function showHide(elements, show) {
        // Determine new display value for elements that need to change
        for(var display, elem, values = [], index = 0, length = elements.length; index < length; index++)(elem = elements[index]).style && (display = elem.style.display, show ? ("none" !== display || (values[index] = dataPriv.get(elem, "display") || null, values[index] || (elem.style.display = "")), "" === elem.style.display && isHiddenWithinTree(elem) && (values[index] = function(elem) {
            var temp, doc = elem.ownerDocument, nodeName = elem.nodeName, display = defaultDisplayMap[nodeName];
            return display || (temp = doc.body.appendChild(doc.createElement(nodeName)), display = jQuery.css(temp, "display"), temp.parentNode.removeChild(temp), "none" === display && (display = "block"), defaultDisplayMap[nodeName] = display), display;
        }(elem))) : "none" !== display && (values[index] = "none", // Remember what we're overwriting
        dataPriv.set(elem, "display", display)));
        // Set the display of the elements in a second loop to avoid constant reflow
        for(index = 0; index < length; index++)null != values[index] && (elements[index].style.display = values[index]);
        return elements;
    }
    jQuery.fn.extend({
        show: function() {
            return showHide(this, !0);
        },
        hide: function() {
            return showHide(this);
        },
        toggle: function(state) {
            return "boolean" == typeof state ? state ? this.show() : this.hide() : this.each(function() {
                isHiddenWithinTree(this) ? jQuery(this).show() : jQuery(this).hide();
            });
        }
    });
    var rcheckableType = /^(?:checkbox|radio)$/i, rtagName = /<([a-z][^\/\0>\x20\t\r\n\f]*)/i, rscriptType = /^$|^module$|\/(?:java|ecma)script/i;
    div = document.createDocumentFragment().appendChild(document.createElement("div")), // Support: Android 4.0 - 4.3 only
    // Check state lost if the name is set (#11217)
    // Support: Windows Web Apps (WWA)
    // `name` and `type` must use .setAttribute for WWA (#14901)
    (input = document.createElement("input")).setAttribute("type", "radio"), input.setAttribute("checked", "checked"), input.setAttribute("name", "t"), div.appendChild(input), // Support: Android <=4.1 only
    // Older WebKit doesn't clone checked state correctly in fragments
    support.checkClone = div.cloneNode(!0).cloneNode(!0).lastChild.checked, // Support: IE <=11 only
    // Make sure textarea (and checkbox) defaultValue is properly cloned
    div.innerHTML = "<textarea>x</textarea>", support.noCloneChecked = !!div.cloneNode(!0).lastChild.defaultValue, // Support: IE <=9 only
    // IE <=9 replaces <option> tags with their contents when inserted outside of
    // the select element.
    div.innerHTML = "<option></option>", support.option = !!div.lastChild;
    // We have to close these tags to support XHTML (#13200)
    var wrapMap = {
        // XHTML parsers do not magically insert elements in the
        // same way that tag soup parsers do. So we cannot shorten
        // this by omitting <tbody> or other required elements.
        thead: [
            1,
            "<table>",
            "</table>"
        ],
        col: [
            2,
            "<table><colgroup>",
            "</colgroup></table>"
        ],
        tr: [
            2,
            "<table><tbody>",
            "</tbody></table>"
        ],
        td: [
            3,
            "<table><tbody><tr>",
            "</tr></tbody></table>"
        ],
        _default: [
            0,
            "",
            ""
        ]
    };
    function getAll(context, tag) {
        // Support: IE <=9 - 11 only
        // Use typeof to avoid zero-argument method invocation on host objects (#15151)
        var ret;
        return (ret = void 0 !== context.getElementsByTagName ? context.getElementsByTagName(tag || "*") : void 0 !== context.querySelectorAll ? context.querySelectorAll(tag || "*") : [], void 0 === tag || tag && nodeName(context, tag)) ? jQuery.merge([
            context
        ], ret) : ret;
    }
    // Mark scripts as having already been evaluated
    function setGlobalEval(elems, refElements) {
        for(var i = 0, l = elems.length; i < l; i++)dataPriv.set(elems[i], "globalEval", !refElements || dataPriv.get(refElements[i], "globalEval"));
    }
    wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead, wrapMap.th = wrapMap.td, support.option || (wrapMap.optgroup = wrapMap.option = [
        1,
        "<select multiple='multiple'>",
        "</select>"
    ]);
    var rhtml = /<|&#?\w+;/;
    function buildFragment(elems, context, scripts, selection, ignored) {
        for(var elem, tmp, wrap, attached, j, fragment = context.createDocumentFragment(), nodes = [], i = 0, l = elems.length; i < l; i++)if ((elem = elems[i]) || 0 === elem) {
            // Add nodes directly
            if ("object" === toType(elem)) // Support: Android <=4.0 only, PhantomJS 1 only
            // push.apply(_, arraylike) throws on ancient WebKit
            jQuery.merge(nodes, elem.nodeType ? [
                elem
            ] : elem);
            else if (rhtml.test(elem)) {
                for(tmp = tmp || fragment.appendChild(context.createElement("div")), wrap = wrapMap[(rtagName.exec(elem) || [
                    "",
                    ""
                ])[1].toLowerCase()] || wrapMap._default, tmp.innerHTML = wrap[1] + jQuery.htmlPrefilter(elem) + wrap[2], // Descend through wrappers to the right content
                j = wrap[0]; j--;)tmp = tmp.lastChild;
                // Support: Android <=4.0 only, PhantomJS 1 only
                // push.apply(_, arraylike) throws on ancient WebKit
                jQuery.merge(nodes, tmp.childNodes), // Ensure the created nodes are orphaned (#12392)
                // Remember the top-level container
                (tmp = fragment.firstChild).textContent = "";
            } else nodes.push(context.createTextNode(elem));
        }
        for(// Remove wrapper from fragment
        fragment.textContent = "", i = 0; elem = nodes[i++];){
            // Skip elements already in the context collection (trac-4087)
            if (selection && jQuery.inArray(elem, selection) > -1) {
                ignored && ignored.push(elem);
                continue;
            }
            // Capture executables
            if (attached = isAttached(elem), // Append to fragment
            tmp = getAll(fragment.appendChild(elem), "script"), attached && setGlobalEval(tmp), scripts) for(j = 0; elem = tmp[j++];)rscriptType.test(elem.type || "") && scripts.push(elem);
        }
        return fragment;
    }
    var rkeyEvent = /^key/, rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/, rtypenamespace = /^([^.]*)(?:\.(.+)|)/;
    function returnTrue() {
        return !0;
    }
    function returnFalse() {
        return !1;
    }
    // Support: IE <=9 - 11+
    // focus() and blur() are asynchronous, except when they are no-op.
    // So expect focus to be synchronous when the element is already active,
    // and blur to be synchronous when the element is not already active.
    // (focus and blur are always synchronous in other supported browsers,
    // this just defines when we can count on it).
    function expectSync(elem, type) {
        return elem === // Support: IE <=9 only
        // Accessing document.activeElement can throw unexpectedly
        // https://bugs.jquery.com/ticket/13393
        function() {
            try {
                return document.activeElement;
            } catch (err) {}
        }() == ("focus" === type);
    }
    function on(elem, types, selector, data, fn, one) {
        var origFn, type;
        // Types can be a map of types/handlers
        if ("object" == typeof types) {
            for(type in "string" != typeof selector && (// ( types-Object, data )
            data = data || selector, selector = void 0), types)on(elem, type, selector, data, types[type], one);
            return elem;
        }
        if (null == data && null == fn ? (// ( types, fn )
        fn = selector, data = selector = void 0) : null == fn && ("string" == typeof selector ? (// ( types, selector, fn )
        fn = data, data = void 0) : (// ( types, data, fn )
        fn = data, data = selector, selector = void 0)), !1 === fn) fn = returnFalse;
        else if (!fn) return elem;
        return 1 === one && (origFn = fn, // Use same guid so caller can remove using origFn
        (fn = function(event) {
            return(// Can use an empty set, since event contains the info
            jQuery().off(event), origFn.apply(this, arguments));
        }).guid = origFn.guid || (origFn.guid = jQuery.guid++)), elem.each(function() {
            jQuery.event.add(this, types, fn, data, selector);
        });
    }
    // Ensure the presence of an event listener that handles manually-triggered
    // synthetic events by interrupting progress until reinvoked in response to
    // *native* events that it fires directly, ensuring that state changes have
    // already occurred before other listeners are invoked.
    function leverageNative(el, type, expectSync) {
        // Missing expectSync indicates a trigger call, which must force setup through jQuery.event.add
        if (!expectSync) {
            void 0 === dataPriv.get(el, type) && jQuery.event.add(el, type, returnTrue);
            return;
        }
        // Register the controller as a special universal handler for all event namespaces
        dataPriv.set(el, type, !1), jQuery.event.add(el, type, {
            namespace: !1,
            handler: function(event) {
                var notAsync, result, saved = dataPriv.get(this, type);
                if (1 & event.isTrigger && this[type]) {
                    // Interrupt processing of the outer synthetic .trigger()ed event
                    // Saved data should be false in such cases, but might be a leftover capture object
                    // from an async native handler (gh-4350)
                    if (saved.length) (jQuery.event.special[type] || {}).delegateType && event.stopPropagation();
                    else if (// Store arguments for use when handling the inner native event
                    // There will always be at least one argument (an event object), so this array
                    // will not be confused with a leftover capture object.
                    saved = slice.call(arguments), dataPriv.set(this, type, saved), // Trigger the native event and capture its result
                    // Support: IE <=9 - 11+
                    // focus() and blur() are asynchronous
                    notAsync = expectSync(this, type), this[type](), saved !== (result = dataPriv.get(this, type)) || notAsync ? dataPriv.set(this, type, !1) : result = {}, saved !== result) return(// Cancel the outer synthetic event
                    event.stopImmediatePropagation(), event.preventDefault(), result.value);
                } else saved.length && (// ...and capture the result
                dataPriv.set(this, type, {
                    value: jQuery.event.trigger(// Support: IE <=9 - 11+
                    // Extend with the prototype to reset the above stopImmediatePropagation()
                    jQuery.extend(saved[0], jQuery.Event.prototype), saved.slice(1), this)
                }), // Abort handling of the native event
                event.stopImmediatePropagation());
            }
        });
    }
    /*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */ jQuery.event = {
        global: {},
        add: function(elem, types, handler, data, selector) {
            var handleObjIn, eventHandle, tmp, events, t, handleObj, special, handlers, type, namespaces, origType, elemData = dataPriv.get(elem);
            // Only attach events to objects that accept data
            if (acceptData(elem)) for(handler.handler && (handler = (handleObjIn = handler).handler, selector = handleObjIn.selector), selector && jQuery.find.matchesSelector(documentElement, selector), handler.guid || (handler.guid = jQuery.guid++), (events = elemData.events) || (events = elemData.events = Object.create(null)), (eventHandle = elemData.handle) || (eventHandle = elemData.handle = function(e) {
                // Discard the second event of a jQuery.event.trigger() and
                // when an event is called after a page has unloaded
                return jQuery.event.triggered !== e.type ? jQuery.event.dispatch.apply(elem, arguments) : void 0;
            }), t = // Handle multiple events separated by a space
            (types = (types || "").match(rnothtmlwhite) || [
                ""
            ]).length; t--;)// There *must* be a type, no attaching namespace-only handlers
            type = origType = (tmp = rtypenamespace.exec(types[t]) || [])[1], namespaces = (tmp[2] || "").split(".").sort(), type && (// If event changes its type, use the special event handlers for the changed type
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
            }, handleObjIn), (handlers = events[type]) || ((handlers = events[type] = []).delegateCount = 0, (!special.setup || !1 === special.setup.call(elem, data, namespaces, eventHandle)) && elem.addEventListener && elem.addEventListener(type, eventHandle)), special.add && (special.add.call(elem, handleObj), handleObj.handler.guid || (handleObj.handler.guid = handler.guid)), selector ? handlers.splice(handlers.delegateCount++, 0, handleObj) : handlers.push(handleObj), // Keep track of which events have ever been used, for event optimization
            jQuery.event.global[type] = !0);
        },
        // Detach an event or set of events from an element
        remove: function(elem, types, handler, selector, mappedTypes) {
            var j, origCount, tmp, events, t, handleObj, special, handlers, type, namespaces, origType, elemData = dataPriv.hasData(elem) && dataPriv.get(elem);
            if (elemData && (events = elemData.events)) {
                for(t = // Once for each type.namespace in types; type may be omitted
                (types = (types || "").match(rnothtmlwhite) || [
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
                jQuery.isEmptyObject(events) && dataPriv.remove(elem, "handle events");
            }
        },
        dispatch: function(nativeEvent) {
            var i, j, ret, matched, handleObj, handlerQueue, args = Array(arguments.length), // Make a writable jQuery.Event from the native event object
            event = jQuery.event.fix(nativeEvent), handlers = (dataPriv.get(this, "events") || Object.create(null))[event.type] || [], special = jQuery.event.special[event.type] || {};
            for(i = 1, // Use the fix-ed jQuery.Event rather than the (read-only) native event
            args[0] = event; i < arguments.length; i++)args[i] = arguments[i];
            // Call the preDispatch hook for the mapped type, and let it bail if desired
            if (event.delegateTarget = this, !special.preDispatch || !1 !== special.preDispatch.call(this, event)) {
                for(// Determine handlers
                handlerQueue = jQuery.event.handlers.call(this, event, handlers), // Run delegates first; they may want to stop propagation beneath us
                i = 0; (matched = handlerQueue[i++]) && !event.isPropagationStopped();)for(event.currentTarget = matched.elem, j = 0; (handleObj = matched.handlers[j++]) && !event.isImmediatePropagationStopped();)// If the event is namespaced, then each handler is only invoked if it is
                // specially universal or its namespaces are a superset of the event's.
                (!event.rnamespace || !1 === handleObj.namespace || event.rnamespace.test(handleObj.namespace)) && (event.handleObj = handleObj, event.data = handleObj.data, void 0 !== (ret = ((jQuery.event.special[handleObj.origType] || {}).handle || handleObj.handler).apply(matched.elem, args)) && !1 === (event.result = ret) && (event.preventDefault(), event.stopPropagation()));
                return special.postDispatch && special.postDispatch.call(this, event), event.result;
            }
        },
        handlers: function(event, handlers) {
            var i, handleObj, sel, matchedHandlers, matchedSelectors, handlerQueue = [], delegateCount = handlers.delegateCount, cur = event.target;
            // Find delegate handlers
            if (delegateCount && // Support: IE <=9
            // Black-hole SVG <use> instance trees (trac-13180)
            cur.nodeType && // Support: Firefox <=42
            // Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
            // https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
            // Support: IE 11 only
            // ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
            !("click" === event.type && event.button >= 1)) {
                for(; cur !== this; cur = cur.parentNode || this)// Don't check non-elements (#13208)
                // Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
                if (1 === cur.nodeType && !("click" === event.type && !0 === cur.disabled)) {
                    for(i = 0, matchedHandlers = [], matchedSelectors = {}; i < delegateCount; i++)void 0 === matchedSelectors[// Don't conflict with Object.prototype properties (#13203)
                    sel = (handleObj = handlers[i]).selector + " "] && (matchedSelectors[sel] = handleObj.needsContext ? jQuery(sel, this).index(cur) > -1 : jQuery.find(sel, this, null, [
                        cur
                    ]).length), matchedSelectors[sel] && matchedHandlers.push(handleObj);
                    matchedHandlers.length && handlerQueue.push({
                        elem: cur,
                        handlers: matchedHandlers
                    });
                }
            }
            return(// Add the remaining (directly-bound) handlers
            cur = this, delegateCount < handlers.length && handlerQueue.push({
                elem: cur,
                handlers: handlers.slice(delegateCount)
            }), handlerQueue);
        },
        addProp: function(name, hook) {
            Object.defineProperty(jQuery.Event.prototype, name, {
                enumerable: !0,
                configurable: !0,
                get: isFunction(hook) ? function() {
                    if (this.originalEvent) return hook(this.originalEvent);
                } : function() {
                    if (this.originalEvent) return this.originalEvent[name];
                },
                set: function(value) {
                    Object.defineProperty(this, name, {
                        enumerable: !0,
                        configurable: !0,
                        writable: !0,
                        value: value
                    });
                }
            });
        },
        fix: function(originalEvent) {
            return originalEvent[jQuery.expando] ? originalEvent : new jQuery.Event(originalEvent);
        },
        special: {
            load: {
                // Prevent triggered image.load events from bubbling to window.load
                noBubble: !0
            },
            click: {
                // Utilize native event to ensure correct state for checkable inputs
                setup: function(data) {
                    // For mutual compressibility with _default, replace `this` access with a local var.
                    // `|| data` is dead code meant only to preserve the variable through minification.
                    var el = this || data;
                    // Return false to allow normal processing in the caller
                    return rcheckableType.test(el.type) && el.click && nodeName(el, "input") && // dataPriv.set( el, "click", ... )
                    leverageNative(el, "click", returnTrue), !1;
                },
                trigger: function(data) {
                    // For mutual compressibility with _default, replace `this` access with a local var.
                    // `|| data` is dead code meant only to preserve the variable through minification.
                    var el = this || data;
                    // Return non-false to allow normal event-path propagation
                    return rcheckableType.test(el.type) && el.click && nodeName(el, "input") && leverageNative(el, "click"), !0;
                },
                // For cross-browser consistency, suppress native .click() on links
                // Also prevent it if we're currently inside a leveraged native-event stack
                _default: function(event) {
                    var target = event.target;
                    return rcheckableType.test(target.type) && target.click && nodeName(target, "input") && dataPriv.get(target, "click") || nodeName(target, "a");
                }
            },
            beforeunload: {
                postDispatch: function(event) {
                    // Support: Firefox 20+
                    // Firefox doesn't alert if the returnValue field is not set.
                    void 0 !== event.result && event.originalEvent && (event.originalEvent.returnValue = event.result);
                }
            }
        }
    }, jQuery.removeEvent = function(elem, type, handle) {
        // This "if" is needed for plain objects
        elem.removeEventListener && elem.removeEventListener(type, handle);
    }, jQuery.Event = function(src, props) {
        // Allow instantiation without the 'new' keyword
        if (!(this instanceof jQuery.Event)) return new jQuery.Event(src, props);
        src && src.type ? (this.originalEvent = src, this.type = src.type, // Events bubbling up the document may have been marked as prevented
        // by a handler lower down the tree; reflect the correct value.
        this.isDefaultPrevented = src.defaultPrevented || void 0 === src.defaultPrevented && // Support: Android <=2.3 only
        !1 === src.returnValue ? returnTrue : returnFalse, // Create target properties
        // Support: Safari <=6 - 7 only
        // Target should not be a text node (#504, #13143)
        this.target = src.target && 3 === src.target.nodeType ? src.target.parentNode : src.target, this.currentTarget = src.currentTarget, this.relatedTarget = src.relatedTarget) : this.type = src, props && jQuery.extend(this, props), // Create a timestamp if incoming event doesn't have one
        this.timeStamp = src && src.timeStamp || Date.now(), // Mark it as fixed
        this[jQuery.expando] = !0;
    }, // jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
    // https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
    jQuery.Event.prototype = {
        constructor: jQuery.Event,
        isDefaultPrevented: returnFalse,
        isPropagationStopped: returnFalse,
        isImmediatePropagationStopped: returnFalse,
        isSimulated: !1,
        preventDefault: function() {
            var e = this.originalEvent;
            this.isDefaultPrevented = returnTrue, e && !this.isSimulated && e.preventDefault();
        },
        stopPropagation: function() {
            var e = this.originalEvent;
            this.isPropagationStopped = returnTrue, e && !this.isSimulated && e.stopPropagation();
        },
        stopImmediatePropagation: function() {
            var e = this.originalEvent;
            this.isImmediatePropagationStopped = returnTrue, e && !this.isSimulated && e.stopImmediatePropagation(), this.stopPropagation();
        }
    }, // Includes all common event props including KeyEvent and MouseEvent specific props
    jQuery.each({
        altKey: !0,
        bubbles: !0,
        cancelable: !0,
        changedTouches: !0,
        ctrlKey: !0,
        detail: !0,
        eventPhase: !0,
        metaKey: !0,
        pageX: !0,
        pageY: !0,
        shiftKey: !0,
        view: !0,
        char: !0,
        code: !0,
        charCode: !0,
        key: !0,
        keyCode: !0,
        button: !0,
        buttons: !0,
        clientX: !0,
        clientY: !0,
        offsetX: !0,
        offsetY: !0,
        pointerId: !0,
        pointerType: !0,
        screenX: !0,
        screenY: !0,
        targetTouches: !0,
        toElement: !0,
        touches: !0,
        which: function(event) {
            var button = event.button;
            return(// Add which for key events
            null == event.which && rkeyEvent.test(event.type) ? null != event.charCode ? event.charCode : event.keyCode : !event.which && void 0 !== button && rmouseEvent.test(event.type) ? 1 & button ? 1 : 2 & button ? 3 : 4 & button ? 2 : 0 : event.which);
        }
    }, jQuery.event.addProp), jQuery.each({
        focus: "focusin",
        blur: "focusout"
    }, function(type, delegateType) {
        jQuery.event.special[type] = {
            // Utilize native event if possible so blur/focus sequence is correct
            setup: function() {
                // Return false to allow normal processing in the caller
                return(// Claim the first handler
                // dataPriv.set( this, "focus", ... )
                // dataPriv.set( this, "blur", ... )
                leverageNative(this, type, expectSync), !1);
            },
            trigger: function() {
                // Return non-false to allow normal event-path propagation
                return(// Force setup before trigger
                leverageNative(this, type), !0);
            },
            delegateType: delegateType
        };
    }), // Create mouseenter/leave events using mouseover/out and event-time checks
    // so that event delegation works in jQuery.
    // Do the same for pointerenter/pointerleave and pointerover/pointerout
    //
    // Support: Safari 7 only
    // Safari sends mouseenter too often; see:
    // https://bugs.chromium.org/p/chromium/issues/detail?id=470258
    // for the description of the bug (it existed in older Chrome versions as well).
    jQuery.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        pointerenter: "pointerover",
        pointerleave: "pointerout"
    }, function(orig, fix) {
        jQuery.event.special[orig] = {
            delegateType: fix,
            bindType: fix,
            handle: function(event) {
                var ret, related = event.relatedTarget, handleObj = event.handleObj;
                return related && (related === this || jQuery.contains(this, related)) || (event.type = handleObj.origType, ret = handleObj.handler.apply(this, arguments), event.type = fix), ret;
            }
        };
    }), jQuery.fn.extend({
        on: function(types, selector, data, fn) {
            return on(this, types, selector, data, fn);
        },
        one: function(types, selector, data, fn) {
            return on(this, types, selector, data, fn, 1);
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
            fn = selector, selector = void 0), !1 === fn && (fn = returnFalse), this.each(function() {
                jQuery.event.remove(this, types, fn, selector);
            });
        }
    });
    var // Support: IE <=10 - 11, Edge 12 - 13 only
    // In IE/Edge using regex groups here causes severe slowdowns.
    // See https://connect.microsoft.com/IE/feedback/details/1736512/
    rnoInnerhtml = /<script|<style|<link/i, // checked="checked" or checked
    rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i, rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;
    // Prefer a tbody over its parent table for containing new rows
    function manipulationTarget(elem, content) {
        return nodeName(elem, "table") && nodeName(11 !== content.nodeType ? content : content.firstChild, "tr") && jQuery(elem).children("tbody")[0] || elem;
    }
    // Replace/restore the type attribute of script elements for safe DOM manipulation
    function disableScript(elem) {
        return elem.type = (null !== elem.getAttribute("type")) + "/" + elem.type, elem;
    }
    function restoreScript(elem) {
        return "true/" === (elem.type || "").slice(0, 5) ? elem.type = elem.type.slice(5) : elem.removeAttribute("type"), elem;
    }
    function cloneCopyEvent(src, dest) {
        var i, l, type, udataOld, udataCur, events;
        if (1 === dest.nodeType) {
            // 1. Copy private data: events, handlers, etc.
            if (dataPriv.hasData(src) && (events = dataPriv.get(src).events)) for(type in dataPriv.remove(dest, "handle events"), events)for(i = 0, l = events[type].length; i < l; i++)jQuery.event.add(dest, type, events[type][i]);
            // 2. Copy user data
            dataUser.hasData(src) && (udataOld = dataUser.access(src), udataCur = jQuery.extend({}, udataOld), dataUser.set(dest, udataCur));
        }
    }
    function domManip(collection, args, callback, ignored) {
        // Flatten any nested arrays
        args = flat(args);
        var fragment, first, scripts, hasScripts, node, doc, i = 0, l = collection.length, iNoClone = l - 1, value = args[0], valueIsFunction = isFunction(value);
        // We can't cloneNode fragments that contain checked, in WebKit
        if (valueIsFunction || l > 1 && "string" == typeof value && !support.checkClone && rchecked.test(value)) return collection.each(function(index) {
            var self = collection.eq(index);
            valueIsFunction && (args[0] = value.call(this, index, self.html())), domManip(self, args, callback, ignored);
        });
        if (l && (first = (fragment = buildFragment(args, collection[0].ownerDocument, !1, collection, ignored)).firstChild, 1 === fragment.childNodes.length && (fragment = first), first || ignored)) {
            // Use the original fragment for the last item
            // instead of the first because it can end up
            // being emptied incorrectly in certain situations (#8070).
            for(hasScripts = (scripts = jQuery.map(getAll(fragment, "script"), disableScript)).length; i < l; i++)node = fragment, i !== iNoClone && (node = jQuery.clone(node, !0, !0), hasScripts && // Support: Android <=4.0 only, PhantomJS 1 only
            // push.apply(_, arraylike) throws on ancient WebKit
            jQuery.merge(scripts, getAll(node, "script"))), callback.call(collection[i], node, i);
            if (hasScripts) // Evaluate executable scripts on first document insertion
            for(doc = scripts[scripts.length - 1].ownerDocument, // Reenable scripts
            jQuery.map(scripts, restoreScript), i = 0; i < hasScripts; i++)node = scripts[i], rscriptType.test(node.type || "") && !dataPriv.access(node, "globalEval") && jQuery.contains(doc, node) && (node.src && "module" !== (node.type || "").toLowerCase() ? jQuery._evalUrl && !node.noModule && jQuery._evalUrl(node.src, {
                nonce: node.nonce || node.getAttribute("nonce")
            }, doc) : DOMEval(node.textContent.replace(rcleanScript, ""), node, doc));
        }
        return collection;
    }
    function remove(elem, selector, keepData) {
        for(var node, nodes = selector ? jQuery.filter(selector, elem) : elem, i = 0; null != (node = nodes[i]); i++)keepData || 1 !== node.nodeType || jQuery.cleanData(getAll(node)), node.parentNode && (keepData && isAttached(node) && setGlobalEval(getAll(node, "script")), node.parentNode.removeChild(node));
        return elem;
    }
    jQuery.extend({
        htmlPrefilter: function(html) {
            return html;
        },
        clone: function(elem, dataAndEvents, deepDataAndEvents) {
            var i, l, srcElements, destElements, clone = elem.cloneNode(!0), inPage = isAttached(elem);
            // Fix IE cloning issues
            if (!support.noCloneChecked && (1 === elem.nodeType || 11 === elem.nodeType) && !jQuery.isXMLDoc(elem)) for(i = 0, // We eschew Sizzle here for performance reasons: https://jsperf.com/getall-vs-sizzle/2
            destElements = getAll(clone), l = (srcElements = getAll(elem)).length; i < l; i++)!// Fix IE bugs, see support tests
            function(src, dest) {
                var nodeName = dest.nodeName.toLowerCase();
                // Fails to persist the checked state of a cloned checkbox or radio button.
                "input" === nodeName && rcheckableType.test(src.type) ? dest.checked = src.checked : ("input" === nodeName || "textarea" === nodeName) && (dest.defaultValue = src.defaultValue);
            }(srcElements[i], destElements[i]);
            // Copy the events from the original to the clone
            if (dataAndEvents) {
                if (deepDataAndEvents) for(i = 0, srcElements = srcElements || getAll(elem), destElements = destElements || getAll(clone), l = srcElements.length; i < l; i++)cloneCopyEvent(srcElements[i], destElements[i]);
                else cloneCopyEvent(elem, clone);
            }
            // Return the cloned set
            return(// Preserve script evaluation history
            (destElements = getAll(clone, "script")).length > 0 && setGlobalEval(destElements, !inPage && getAll(elem, "script")), clone);
        },
        cleanData: function(elems) {
            for(var data, elem, type, special = jQuery.event.special, i = 0; void 0 !== (elem = elems[i]); i++)if (acceptData(elem)) {
                if (data = elem[dataPriv.expando]) {
                    if (data.events) for(type in data.events)special[type] ? jQuery.event.remove(elem, type) : jQuery.removeEvent(elem, type, data.handle);
                    // Support: Chrome <=35 - 45+
                    // Assign undefined instead of using delete, see Data#remove
                    elem[dataPriv.expando] = void 0;
                }
                elem[dataUser.expando] && // Support: Chrome <=35 - 45+
                // Assign undefined instead of using delete, see Data#remove
                (elem[dataUser.expando] = void 0);
            }
        }
    }), jQuery.fn.extend({
        detach: function(selector) {
            return remove(this, selector, !0);
        },
        remove: function(selector) {
            return remove(this, selector);
        },
        text: function(value) {
            return access(this, function(value) {
                return void 0 === value ? jQuery.text(this) : this.empty().each(function() {
                    (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) && (this.textContent = value);
                });
            }, null, value, arguments.length);
        },
        append: function() {
            return domManip(this, arguments, function(elem) {
                (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) && manipulationTarget(this, elem).appendChild(elem);
            });
        },
        prepend: function() {
            return domManip(this, arguments, function(elem) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var target = manipulationTarget(this, elem);
                    target.insertBefore(elem, target.firstChild);
                }
            });
        },
        before: function() {
            return domManip(this, arguments, function(elem) {
                this.parentNode && this.parentNode.insertBefore(elem, this);
            });
        },
        after: function() {
            return domManip(this, arguments, function(elem) {
                this.parentNode && this.parentNode.insertBefore(elem, this.nextSibling);
            });
        },
        empty: function() {
            for(var elem, i = 0; null != (elem = this[i]); i++)1 === elem.nodeType && (// Prevent memory leaks
            jQuery.cleanData(getAll(elem, !1)), // Remove any remaining nodes
            elem.textContent = "");
            return this;
        },
        clone: function(dataAndEvents, deepDataAndEvents) {
            return dataAndEvents = null != dataAndEvents && dataAndEvents, deepDataAndEvents = null == deepDataAndEvents ? dataAndEvents : deepDataAndEvents, this.map(function() {
                return jQuery.clone(this, dataAndEvents, deepDataAndEvents);
            });
        },
        html: function(value) {
            return access(this, function(value) {
                var elem = this[0] || {}, i = 0, l = this.length;
                if (void 0 === value && 1 === elem.nodeType) return elem.innerHTML;
                // See if we can take a shortcut and just use innerHTML
                if ("string" == typeof value && !rnoInnerhtml.test(value) && !wrapMap[(rtagName.exec(value) || [
                    "",
                    ""
                ])[1].toLowerCase()]) {
                    value = jQuery.htmlPrefilter(value);
                    try {
                        for(; i < l; i++)elem = this[i] || {}, 1 === elem.nodeType && (jQuery.cleanData(getAll(elem, !1)), elem.innerHTML = value);
                        elem = 0;
                    // If using innerHTML throws an exception, use the fallback method
                    } catch (e) {}
                }
                elem && this.empty().append(value);
            }, null, value, arguments.length);
        },
        replaceWith: function() {
            var ignored = [];
            // Make the changes, replacing each non-ignored context element with the new content
            return domManip(this, arguments, function(elem) {
                var parent = this.parentNode;
                0 > jQuery.inArray(this, ignored) && (jQuery.cleanData(getAll(this)), parent && parent.replaceChild(elem, this));
            // Force callback invocation
            }, ignored);
        }
    }), jQuery.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function(name, original) {
        jQuery.fn[name] = function(selector) {
            for(var elems, ret = [], insert = jQuery(selector), last = insert.length - 1, i = 0; i <= last; i++)elems = i === last ? this : this.clone(!0), jQuery(insert[i])[original](elems), // Support: Android <=4.0 only, PhantomJS 1 only
            // .get() because push.apply(_, arraylike) throws on ancient WebKit
            push.apply(ret, elems.get());
            return this.pushStack(ret);
        };
    });
    var rnumnonpx = RegExp("^(" + pnum + ")(?!px)[a-z%]+$", "i"), getStyles = function(elem) {
        // Support: IE <=11 only, Firefox <=30 (#15098, #14150)
        // IE throws on elements created in popups
        // FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
        var view = elem.ownerDocument.defaultView;
        return view && view.opener || (view = window1), view.getComputedStyle(elem);
    }, swap = function(elem, options, callback) {
        var ret, name, old = {};
        // Remember the old values, and insert the new ones
        for(name in options)old[name] = elem.style[name], elem.style[name] = options[name];
        // Revert the old values
        for(name in ret = callback.call(elem), options)elem.style[name] = old[name];
        return ret;
    }, rboxStyle = RegExp(cssExpand.join("|"), "i");
    function curCSS(elem, name, computed) {
        var width, minWidth, maxWidth, ret, // Support: Firefox 51+
        // Retrieving style before computed somehow
        // fixes an issue with getting wrong values
        // on detached elements
        style = elem.style;
        return (computed = computed || getStyles(elem)) && ("" !== (ret = computed.getPropertyValue(name) || computed[name]) || isAttached(elem) || (ret = jQuery.style(elem, name)), !support.pixelBoxStyles() && rnumnonpx.test(ret) && rboxStyle.test(name) && (// Remember the original values
        width = style.width, minWidth = style.minWidth, maxWidth = style.maxWidth, // Put in the new values to get a computed value out
        style.minWidth = style.maxWidth = style.width = ret, ret = computed.width, // Revert the changed values
        style.width = width, style.minWidth = minWidth, style.maxWidth = maxWidth)), void 0 !== ret ? // Support: IE <=9 - 11 only
        // IE returns zIndex value as an integer.
        ret + "" : ret;
    }
    function addGetHookIf(conditionFn, hookFn) {
        // Define the hook, we'll check on the first run if it's really needed.
        return {
            get: function() {
                if (conditionFn()) {
                    // Hook not needed (or it's not possible to use it due
                    // to missing dependency), remove it.
                    delete this.get;
                    return;
                }
                // Hook needed; redefine it so that the support test is not executed again.
                return (this.get = hookFn).apply(this, arguments);
            }
        };
    }
    !function() {
        // Executing both pixelPosition & boxSizingReliable tests require only one layout
        // so they're executed at the same time to save the second computation.
        function computeStyleTests() {
            // This is a singleton, we need to execute it only once
            if (div) {
                container.style.cssText = "position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0", div.style.cssText = "position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%", documentElement.appendChild(container).appendChild(div);
                var divStyle = window1.getComputedStyle(div);
                pixelPositionVal = "1%" !== divStyle.top, // Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
                reliableMarginLeftVal = 12 === roundPixelMeasures(divStyle.marginLeft), // Support: Android 4.0 - 4.3 only, Safari <=9.1 - 10.1, iOS <=7.0 - 9.3
                // Some styles come back with percentage values, even though they shouldn't
                div.style.right = "60%", pixelBoxStylesVal = 36 === roundPixelMeasures(divStyle.right), // Support: IE 9 - 11 only
                // Detect misreporting of content dimensions for box-sizing:border-box elements
                boxSizingReliableVal = 36 === roundPixelMeasures(divStyle.width), // Support: IE 9 only
                // Detect overflow:scroll screwiness (gh-3699)
                // Support: Chrome <=64
                // Don't get tricked when zoom affects offsetWidth (gh-4029)
                div.style.position = "absolute", scrollboxSizeVal = 12 === roundPixelMeasures(div.offsetWidth / 3), documentElement.removeChild(container), // Nullify the div so it wouldn't be stored in the memory and
                // it will also be a sign that checks already performed
                div = null;
            }
        }
        function roundPixelMeasures(measure) {
            return Math.round(parseFloat(measure));
        }
        var pixelPositionVal, boxSizingReliableVal, scrollboxSizeVal, pixelBoxStylesVal, reliableTrDimensionsVal, reliableMarginLeftVal, container = document.createElement("div"), div = document.createElement("div");
        // Finish early in limited (non-browser) environments
        div.style && (// Support: IE <=9 - 11 only
        // Style of cloned element affects source element cloned (#8908)
        div.style.backgroundClip = "content-box", div.cloneNode(!0).style.backgroundClip = "", support.clearCloneStyle = "content-box" === div.style.backgroundClip, jQuery.extend(support, {
            boxSizingReliable: function() {
                return computeStyleTests(), boxSizingReliableVal;
            },
            pixelBoxStyles: function() {
                return computeStyleTests(), pixelBoxStylesVal;
            },
            pixelPosition: function() {
                return computeStyleTests(), pixelPositionVal;
            },
            reliableMarginLeft: function() {
                return computeStyleTests(), reliableMarginLeftVal;
            },
            scrollboxSize: function() {
                return computeStyleTests(), scrollboxSizeVal;
            },
            // Support: IE 9 - 11+, Edge 15 - 18+
            // IE/Edge misreport `getComputedStyle` of table rows with width/height
            // set in CSS while `offset*` properties report correct values.
            // Behavior in IE 9 is more subtle than in newer versions & it passes
            // some versions of this test; make sure not to make it pass there!
            reliableTrDimensions: function() {
                var table, tr, trChild;
                return null == reliableTrDimensionsVal && (table = document.createElement("table"), tr = document.createElement("tr"), trChild = document.createElement("div"), table.style.cssText = "position:absolute;left:-11111px", tr.style.height = "1px", trChild.style.height = "9px", documentElement.appendChild(table).appendChild(tr).appendChild(trChild), reliableTrDimensionsVal = parseInt(window1.getComputedStyle(tr).height) > 3, documentElement.removeChild(table)), reliableTrDimensionsVal;
            }
        }));
    }();
    var cssPrefixes = [
        "Webkit",
        "Moz",
        "ms"
    ], emptyStyle = document.createElement("div").style, vendorProps = {};
    // Return a potentially-mapped jQuery.cssProps or vendor prefixed property
    function finalPropName(name) {
        return jQuery.cssProps[name] || vendorProps[name] || (name in emptyStyle ? name : vendorProps[name] = // Return a vendor-prefixed property or undefined
        function(name) {
            for(// Check for vendor prefixed names
            var capName = name[0].toUpperCase() + name.slice(1), i = cssPrefixes.length; i--;)if ((name = cssPrefixes[i] + capName) in emptyStyle) return name;
        }(name) || name);
    }
    var // Swappable if display is none or starts with table
    // except "table", "table-cell", or "table-caption"
    // See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
    rdisplayswap = /^(none|table(?!-c[ea]).+)/, rcustomProp = /^--/, cssShow = {
        position: "absolute",
        visibility: "hidden",
        display: "block"
    }, cssNormalTransform = {
        letterSpacing: "0",
        fontWeight: "400"
    };
    function setPositiveNumber(_elem, value, subtract) {
        // Any relative (+/-) values have already been
        // normalized at this point
        var matches = rcssNum.exec(value);
        return matches ? // Guard against undefined "subtract", e.g., when used as in cssHooks
        Math.max(0, matches[2] - (subtract || 0)) + (matches[3] || "px") : value;
    }
    function boxModelAdjustment(elem, dimension, box, isBorderBox, styles, computedVal) {
        var i = "width" === dimension ? 1 : 0, extra = 0, delta = 0;
        // Adjustment may not be necessary
        if (box === (isBorderBox ? "border" : "content")) return 0;
        for(; i < 4; i += 2)"margin" === box && (delta += jQuery.css(elem, box + cssExpand[i], !0, styles)), isBorderBox ? ("content" === box && (delta -= jQuery.css(elem, "padding" + cssExpand[i], !0, styles)), "margin" !== box && (delta -= jQuery.css(elem, "border" + cssExpand[i] + "Width", !0, styles))) : (// Add padding
        delta += jQuery.css(elem, "padding" + cssExpand[i], !0, styles), "padding" !== box ? delta += jQuery.css(elem, "border" + cssExpand[i] + "Width", !0, styles) : extra += jQuery.css(elem, "border" + cssExpand[i] + "Width", !0, styles));
        return !isBorderBox && computedVal >= 0 && // offsetWidth/offsetHeight is a rounded sum of content, padding, scroll gutter, and border
        // Assuming integer scroll gutter, subtract the rest and round down
        (delta += Math.max(0, Math.ceil(elem["offset" + dimension[0].toUpperCase() + dimension.slice(1)] - computedVal - delta - extra - 0.5)) || 0), delta;
    }
    function getWidthOrHeight(elem, dimension, extra) {
        // Start with computed style
        var styles = getStyles(elem), isBorderBox = (!support.boxSizingReliable() || extra) && "border-box" === jQuery.css(elem, "boxSizing", !1, styles), valueIsBorderBox = isBorderBox, val = curCSS(elem, dimension, styles), offsetProp = "offset" + dimension[0].toUpperCase() + dimension.slice(1);
        // Support: Firefox <=54
        // Return a confounding non-pixel value or feign ignorance, as appropriate.
        if (rnumnonpx.test(val)) {
            if (!extra) return val;
            val = "auto";
        }
        // Adjust for the element's box model
        return (!support.boxSizingReliable() && isBorderBox || // Support: IE 10 - 11+, Edge 15 - 18+
        // IE/Edge misreport `getComputedStyle` of table rows with width/height
        // set in CSS while `offset*` properties report correct values.
        // Interestingly, in some cases IE 9 doesn't suffer from this issue.
        !support.reliableTrDimensions() && nodeName(elem, "tr") || // Fall back to offsetWidth/offsetHeight when value is "auto"
        // This happens for inline elements with no explicit setting (gh-3571)
        "auto" === val || // Support: Android <=4.1 - 4.3 only
        // Also use offsetWidth/offsetHeight for misreported inline dimensions (gh-3602)
        !parseFloat(val) && "inline" === jQuery.css(elem, "display", !1, styles)) && // Make sure the element is visible & connected
        elem.getClientRects().length && (isBorderBox = "border-box" === jQuery.css(elem, "boxSizing", !1, styles), // Where available, offsetWidth/offsetHeight approximate border box dimensions.
        // Where not available (e.g., SVG), assume unreliable box-sizing and interpret the
        // retrieved value as a content box dimension.
        (valueIsBorderBox = offsetProp in elem) && (val = elem[offsetProp])), // Normalize "" and auto
        (val = parseFloat(val) || 0) + boxModelAdjustment(elem, dimension, extra || (isBorderBox ? "border" : "content"), valueIsBorderBox, styles, // Provide the current computed size to request scroll gutter calculation (gh-3589)
        val) + "px";
    }
    function Tween(elem, options, prop, end, easing) {
        return new Tween.prototype.init(elem, options, prop, end, easing);
    }
    jQuery.extend({
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
        // Don't automatically add "px" to these possibly-unitless properties
        cssNumber: {
            animationIterationCount: !0,
            columnCount: !0,
            fillOpacity: !0,
            flexGrow: !0,
            flexShrink: !0,
            fontWeight: !0,
            gridArea: !0,
            gridColumn: !0,
            gridColumnEnd: !0,
            gridColumnStart: !0,
            gridRow: !0,
            gridRowEnd: !0,
            gridRowStart: !0,
            lineHeight: !0,
            opacity: !0,
            order: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        // Add in properties whose names you wish to fix before
        // setting or getting the value
        cssProps: {},
        // Get and set the style property on a DOM Node
        style: function(elem, name, value, extra) {
            // Don't set styles on text and comment nodes
            if (elem && 3 !== elem.nodeType && 8 !== elem.nodeType && elem.style) {
                // Make sure that we're working with the right name
                var ret, type, hooks, origName = camelCase(name), isCustomProp = rcustomProp.test(name), style = elem.style;
                // Check if we're setting a value
                if (isCustomProp || (name = finalPropName(origName)), // Gets hook for the prefixed version, then unprefixed version
                hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName], void 0 === value) return(// If a hook was provided get the non-computed value from there
                hooks && "get" in hooks && void 0 !== (ret = hooks.get(elem, !1, extra)) ? ret : style[name]);
                // Make sure that null and NaN values aren't set (#7116)
                "string" == (type = typeof value) && (ret = rcssNum.exec(value)) && ret[1] && (value = adjustCSS(elem, name, ret), // Fixes bug #9237
                type = "number"), null != value && value == value && ("number" !== type || isCustomProp || (value += ret && ret[3] || (jQuery.cssNumber[origName] ? "" : "px")), support.clearCloneStyle || "" !== value || 0 !== name.indexOf("background") || (style[name] = "inherit"), hooks && "set" in hooks && void 0 === (value = hooks.set(elem, value, extra)) || (isCustomProp ? style.setProperty(name, value) : style[name] = value));
            }
        },
        css: function(elem, name, extra, styles) {
            var val, num, hooks, origName = camelCase(name);
            return(// Make numeric if forced or a qualifier was provided and val looks numeric
            (rcustomProp.test(name) || (name = finalPropName(origName)), // Try prefixed name followed by the unprefixed name
            (hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName]) && "get" in hooks && (val = hooks.get(elem, !0, extra)), void 0 === val && (val = curCSS(elem, name, styles)), "normal" === val && name in cssNormalTransform && (val = cssNormalTransform[name]), "" === extra || extra) ? (num = parseFloat(val), !0 === extra || isFinite(num) ? num || 0 : val) : val);
        }
    }), jQuery.each([
        "height",
        "width"
    ], function(_i, dimension) {
        jQuery.cssHooks[dimension] = {
            get: function(elem, computed, extra) {
                if (computed) // Certain elements can have dimension info if we invisibly show them
                // but it must have a current display style that would benefit
                return !rdisplayswap.test(jQuery.css(elem, "display")) || // Support: Safari 8+
                // Table columns in Safari have non-zero offsetWidth & zero
                // getBoundingClientRect().width unless display is changed.
                // Support: IE <=11 only
                // Running getBoundingClientRect on a disconnected node
                // in IE throws an error.
                elem.getClientRects().length && elem.getBoundingClientRect().width ? getWidthOrHeight(elem, dimension, extra) : swap(elem, cssShow, function() {
                    return getWidthOrHeight(elem, dimension, extra);
                });
            },
            set: function(elem, value, extra) {
                var matches, styles = getStyles(elem), // Only read styles.position if the test has a chance to fail
                // to avoid forcing a reflow.
                scrollboxSizeBuggy = !support.scrollboxSize() && "absolute" === styles.position, isBorderBox = (scrollboxSizeBuggy || extra) && "border-box" === jQuery.css(elem, "boxSizing", !1, styles), subtract = extra ? boxModelAdjustment(elem, dimension, extra, isBorderBox, styles) : 0;
                return isBorderBox && scrollboxSizeBuggy && (subtract -= Math.ceil(elem["offset" + dimension[0].toUpperCase() + dimension.slice(1)] - parseFloat(styles[dimension]) - boxModelAdjustment(elem, dimension, "border", !1, styles) - 0.5)), subtract && (matches = rcssNum.exec(value)) && "px" !== (matches[3] || "px") && (elem.style[dimension] = value, value = jQuery.css(elem, dimension)), setPositiveNumber(elem, value, subtract);
            }
        };
    }), jQuery.cssHooks.marginLeft = addGetHookIf(support.reliableMarginLeft, function(elem, computed) {
        if (computed) return (parseFloat(curCSS(elem, "marginLeft")) || elem.getBoundingClientRect().left - swap(elem, {
            marginLeft: 0
        }, function() {
            return elem.getBoundingClientRect().left;
        })) + "px";
    }), // These hooks are used by animate to expand properties
    jQuery.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function(prefix, suffix) {
        jQuery.cssHooks[prefix + suffix] = {
            expand: function(value) {
                for(var i = 0, expanded = {}, // Assumes a single number if not a string
                parts = "string" == typeof value ? value.split(" ") : [
                    value
                ]; i < 4; i++)expanded[prefix + cssExpand[i] + suffix] = parts[i] || parts[i - 2] || parts[0];
                return expanded;
            }
        }, "margin" !== prefix && (jQuery.cssHooks[prefix + suffix].set = setPositiveNumber);
    }), jQuery.fn.extend({
        css: function(name, value) {
            return access(this, function(elem, name, value) {
                var styles, len, map = {}, i = 0;
                if (Array.isArray(name)) {
                    for(styles = getStyles(elem), len = name.length; i < len; i++)map[name[i]] = jQuery.css(elem, name[i], !1, styles);
                    return map;
                }
                return void 0 !== value ? jQuery.style(elem, name, value) : jQuery.css(elem, name);
            }, name, value, arguments.length > 1);
        }
    }), jQuery.Tween = Tween, Tween.prototype = {
        constructor: Tween,
        init: function(elem, options, prop, end, easing, unit) {
            this.elem = elem, this.prop = prop, this.easing = easing || jQuery.easing._default, this.options = options, this.start = this.now = this.cur(), this.end = end, this.unit = unit || (jQuery.cssNumber[prop] ? "" : "px");
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
                return(// Use a property on the element directly when it is not a DOM element,
                // or when there is no matching style property that exists.
                1 !== tween.elem.nodeType || null != tween.elem[tween.prop] && null == tween.elem.style[tween.prop] ? tween.elem[tween.prop] : // Passing an empty string as a 3rd parameter to .css will automatically
                // attempt a parseFloat and fallback to a string if the parse fails.
                // Simple values such as "10px" are parsed to Float;
                // complex values such as "rotate(1rad)" are returned as-is.
                (result = jQuery.css(tween.elem, tween.prop, "")) && "auto" !== result ? result : 0);
            },
            set: function(tween) {
                // Use step hook for back compat.
                // Use cssHook if its there.
                // Use .style if available and use plain properties where available.
                jQuery.fx.step[tween.prop] ? jQuery.fx.step[tween.prop](tween) : 1 === tween.elem.nodeType && (jQuery.cssHooks[tween.prop] || null != tween.elem.style[finalPropName(tween.prop)]) ? jQuery.style(tween.elem, tween.prop, tween.now + tween.unit) : tween.elem[tween.prop] = tween.now;
            }
        }
    }, // Support: IE <=9 only
    // Panic based approach to setting things on disconnected nodes
    Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
        set: function(tween) {
            tween.elem.nodeType && tween.elem.parentNode && (tween.elem[tween.prop] = tween.now);
        }
    }, jQuery.easing = {
        linear: function(p) {
            return p;
        },
        swing: function(p) {
            return 0.5 - Math.cos(p * Math.PI) / 2;
        },
        _default: "swing"
    }, jQuery.fx = Tween.prototype.init, // Back compat <1.8 extension point
    jQuery.fx.step = {};
    var div, input, fxNow, inProgress, rfxtypes = /^(?:toggle|show|hide)$/, rrun = /queueHooks$/;
    // Animations created synchronously will run synchronously
    function createFxNow() {
        return window1.setTimeout(function() {
            fxNow = void 0;
        }), fxNow = Date.now();
    }
    // Generate parameters to create a standard animation
    function genFx(type, includeWidth) {
        var which, i = 0, attrs = {
            height: type
        };
        for(// If we include width, step value is 1 to do all cssExpand values,
        // otherwise step value is 2 to skip over Left and Right
        includeWidth = includeWidth ? 1 : 0; i < 4; i += 2 - includeWidth)attrs["margin" + (which = cssExpand[i])] = attrs["padding" + which] = type;
        return includeWidth && (attrs.opacity = attrs.width = type), attrs;
    }
    function createTween(value, prop, animation) {
        for(var tween, collection = (Animation.tweeners[prop] || []).concat(Animation.tweeners["*"]), index = 0, length = collection.length; index < length; index++)if (tween = collection[index].call(animation, prop, value)) // We're done with this property
        return tween;
    }
    function Animation(elem, properties, options) {
        var result, stopped, index = 0, length = Animation.prefilters.length, deferred = jQuery.Deferred().always(function() {
            // Don't match elem in the :animated selector
            delete tick.elem;
        }), tick = function() {
            if (stopped) return !1;
            for(var currentTime = fxNow || createFxNow(), remaining = Math.max(0, animation.startTime + animation.duration - currentTime), percent = 1 - (remaining / animation.duration || 0), index = 0, length = animation.tweens.length; index < length; index++)animation.tweens[index].run(percent);
            return(// If there's more to do, yield
            (deferred.notifyWith(elem, [
                animation,
                percent,
                remaining
            ]), percent < 1 && length) ? remaining : (length || deferred.notifyWith(elem, [
                animation,
                1,
                0
            ]), // Resolve the animation and report its conclusion
            deferred.resolveWith(elem, [
                animation
            ]), !1));
        }, animation = deferred.promise({
            elem: elem,
            props: jQuery.extend({}, properties),
            opts: jQuery.extend(!0, {
                specialEasing: {},
                easing: jQuery.easing._default
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
                var index = 0, // If we are going to the end, we want to run all the tweens
                // otherwise we skip this part
                length = gotoEnd ? animation.tweens.length : 0;
                if (stopped) return this;
                for(stopped = !0; index < length; index++)animation.tweens[index].run(1);
                return gotoEnd ? (deferred.notifyWith(elem, [
                    animation,
                    1,
                    0
                ]), deferred.resolveWith(elem, [
                    animation,
                    gotoEnd
                ])) : deferred.rejectWith(elem, [
                    animation,
                    gotoEnd
                ]), this;
            }
        }), props = animation.props;
        for(!function(props, specialEasing) {
            var index, name, easing, value, hooks;
            // camelCase, specialEasing and expand cssHook pass
            for(index in props)if (easing = specialEasing[name = camelCase(index)], Array.isArray(value = props[index]) && (easing = value[1], value = props[index] = value[0]), index !== name && (props[name] = value, delete props[index]), (hooks = jQuery.cssHooks[name]) && "expand" in hooks) // Not quite $.extend, this won't overwrite existing keys.
            // Reusing 'index' because we have the correct "name"
            for(index in value = hooks.expand(value), delete props[name], value)index in props || (props[index] = value[index], specialEasing[index] = easing);
            else specialEasing[name] = easing;
        }(props, animation.opts.specialEasing); index < length; index++)if (result = Animation.prefilters[index].call(animation, elem, props, animation.opts)) return isFunction(result.stop) && (jQuery._queueHooks(animation.elem, animation.opts.queue).stop = result.stop.bind(result)), result;
        return jQuery.map(props, createTween, animation), isFunction(animation.opts.start) && animation.opts.start.call(elem, animation), // Attach callbacks from options
        animation.progress(animation.opts.progress).done(animation.opts.done, animation.opts.complete).fail(animation.opts.fail).always(animation.opts.always), jQuery.fx.timer(jQuery.extend(tick, {
            elem: elem,
            anim: animation,
            queue: animation.opts.queue
        })), animation;
    }
    jQuery.Animation = jQuery.extend(Animation, {
        tweeners: {
            "*": [
                function(prop, value) {
                    var tween = this.createTween(prop, value);
                    return adjustCSS(tween.elem, prop, rcssNum.exec(value), tween), tween;
                }
            ]
        },
        tweener: function(props, callback) {
            isFunction(props) ? (callback = props, props = [
                "*"
            ]) : props = props.match(rnothtmlwhite);
            for(var prop, index = 0, length = props.length; index < length; index++)prop = props[index], Animation.tweeners[prop] = Animation.tweeners[prop] || [], Animation.tweeners[prop].unshift(callback);
        },
        prefilters: [
            function(elem, props, opts) {
                var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display, isBox = "width" in props || "height" in props, anim = this, orig = {}, style = elem.style, hidden = elem.nodeType && isHiddenWithinTree(elem), dataShow = dataPriv.get(elem, "fxshow");
                // Detect show/hide animations
                for(prop in opts.queue || (null == (hooks = jQuery._queueHooks(elem, "fx")).unqueued && (hooks.unqueued = 0, oldfire = hooks.empty.fire, hooks.empty.fire = function() {
                    hooks.unqueued || oldfire();
                }), hooks.unqueued++, anim.always(function() {
                    // Ensure the complete handler is called before this completes
                    anim.always(function() {
                        hooks.unqueued--, jQuery.queue(elem, "fx").length || hooks.empty.fire();
                    });
                })), props)if (value = props[prop], rfxtypes.test(value)) {
                    if (delete props[prop], toggle = toggle || "toggle" === value, value === (hidden ? "hide" : "show")) {
                        // Pretend to be hidden if this is a "show" and
                        // there is still data from a stopped show/hide
                        if ("show" !== value || !dataShow || void 0 === dataShow[prop]) continue;
                        hidden = !0;
                    }
                    orig[prop] = dataShow && dataShow[prop] || jQuery.style(elem, prop);
                }
                if (!(!// Bail out if this is a no-op like .hide().hide()
                (propTween = !jQuery.isEmptyObject(props)) && jQuery.isEmptyObject(orig))) for(prop in isBox && 1 === elem.nodeType && (// Support: IE <=9 - 11, Edge 12 - 15
                // Record all 3 overflow attributes because IE does not infer the shorthand
                // from identically-valued overflowX and overflowY and Edge just mirrors
                // the overflowX value there.
                opts.overflow = [
                    style.overflow,
                    style.overflowX,
                    style.overflowY
                ], null == // Identify a display type, preferring old show/hide data over the CSS cascade
                (restoreDisplay = dataShow && dataShow.display) && (restoreDisplay = dataPriv.get(elem, "display")), "none" === (display = jQuery.css(elem, "display")) && (restoreDisplay ? display = restoreDisplay : (// Get nonempty value(s) by temporarily forcing visibility
                showHide([
                    elem
                ], !0), restoreDisplay = elem.style.display || restoreDisplay, display = jQuery.css(elem, "display"), showHide([
                    elem
                ]))), ("inline" === display || "inline-block" === display && null != restoreDisplay) && "none" === jQuery.css(elem, "float") && (propTween || (anim.done(function() {
                    style.display = restoreDisplay;
                }), null != restoreDisplay || (restoreDisplay = "none" === (display = style.display) ? "" : display)), style.display = "inline-block")), opts.overflow && (style.overflow = "hidden", anim.always(function() {
                    style.overflow = opts.overflow[0], style.overflowX = opts.overflow[1], style.overflowY = opts.overflow[2];
                })), // Implement show/hide animations
                propTween = !1, orig)propTween || (dataShow ? "hidden" in dataShow && (hidden = dataShow.hidden) : dataShow = dataPriv.access(elem, "fxshow", {
                    display: restoreDisplay
                }), toggle && (dataShow.hidden = !hidden), hidden && showHide([
                    elem
                ], !0), /* eslint-disable no-loop-func */ anim.done(function() {
                    for(prop in hidden || showHide([
                        elem
                    ]), dataPriv.remove(elem, "fxshow"), orig)jQuery.style(elem, prop, orig[prop]);
                })), // Per-property setup
                propTween = createTween(hidden ? dataShow[prop] : 0, prop, anim), prop in dataShow || (dataShow[prop] = propTween.start, hidden && (propTween.end = propTween.start, propTween.start = 0));
            }
        ],
        prefilter: function(callback, prepend) {
            prepend ? Animation.prefilters.unshift(callback) : Animation.prefilters.push(callback);
        }
    }), jQuery.speed = function(speed, easing, fn) {
        var opt = speed && "object" == typeof speed ? jQuery.extend({}, speed) : {
            complete: fn || !fn && easing || isFunction(speed) && speed,
            duration: speed,
            easing: fn && easing || easing && !isFunction(easing) && easing
        };
        return jQuery.fx.off ? opt.duration = 0 : "number" != typeof opt.duration && (opt.duration in jQuery.fx.speeds ? opt.duration = jQuery.fx.speeds[opt.duration] : opt.duration = jQuery.fx.speeds._default), (null == opt.queue || !0 === opt.queue) && (opt.queue = "fx"), // Queueing
        opt.old = opt.complete, opt.complete = function() {
            isFunction(opt.old) && opt.old.call(this), opt.queue && jQuery.dequeue(this, opt.queue);
        }, opt;
    }, jQuery.fn.extend({
        fadeTo: function(speed, to, easing, callback) {
            // Show any hidden elements after setting opacity to 0
            return this.filter(isHiddenWithinTree).css("opacity", 0).show()// Animate to the value specified
            .end().animate({
                opacity: to
            }, speed, easing, callback);
        },
        animate: function(prop, speed, easing, callback) {
            var empty = jQuery.isEmptyObject(prop), optall = jQuery.speed(speed, easing, callback), doAnimation = function() {
                // Operate on a copy of prop so per-property easing won't be lost
                var anim = Animation(this, jQuery.extend({}, prop), optall);
                // Empty animations, or finishing resolves immediately
                (empty || dataPriv.get(this, "finish")) && anim.stop(!0);
            };
            return doAnimation.finish = doAnimation, empty || !1 === optall.queue ? this.each(doAnimation) : this.queue(optall.queue, doAnimation);
        },
        stop: function(type, clearQueue, gotoEnd) {
            var stopQueue = function(hooks) {
                var stop = hooks.stop;
                delete hooks.stop, stop(gotoEnd);
            };
            return "string" != typeof type && (gotoEnd = clearQueue, clearQueue = type, type = void 0), clearQueue && this.queue(type || "fx", []), this.each(function() {
                var dequeue = !0, index = null != type && type + "queueHooks", timers = jQuery.timers, data = dataPriv.get(this);
                if (index) data[index] && data[index].stop && stopQueue(data[index]);
                else for(index in data)data[index] && data[index].stop && rrun.test(index) && stopQueue(data[index]);
                for(index = timers.length; index--;)timers[index].elem === this && (null == type || timers[index].queue === type) && (timers[index].anim.stop(gotoEnd), dequeue = !1, timers.splice(index, 1));
                // Start the next in the queue if the last step wasn't forced.
                // Timers currently will call their complete callbacks, which
                // will dequeue but only if they were gotoEnd.
                (dequeue || !gotoEnd) && jQuery.dequeue(this, type);
            });
        },
        finish: function(type) {
            return !1 !== type && (type = type || "fx"), this.each(function() {
                var index, data = dataPriv.get(this), queue = data[type + "queue"], hooks = data[type + "queueHooks"], timers = jQuery.timers, length = queue ? queue.length : 0;
                // Look for any active animations, and finish them
                for(// Enable finishing flag on private data
                data.finish = !0, // Empty the queue first
                jQuery.queue(this, type, []), hooks && hooks.stop && hooks.stop.call(this, !0), index = timers.length; index--;)timers[index].elem === this && timers[index].queue === type && (timers[index].anim.stop(!0), timers.splice(index, 1));
                // Look for any animations in the old queue and finish them
                for(index = 0; index < length; index++)queue[index] && queue[index].finish && queue[index].finish.call(this);
                // Turn off finishing flag
                delete data.finish;
            });
        }
    }), jQuery.each([
        "toggle",
        "show",
        "hide"
    ], function(_i, name) {
        var cssFn = jQuery.fn[name];
        jQuery.fn[name] = function(speed, easing, callback) {
            return null == speed || "boolean" == typeof speed ? cssFn.apply(this, arguments) : this.animate(genFx(name, !0), speed, easing, callback);
        };
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
    }, function(name, props) {
        jQuery.fn[name] = function(speed, easing, callback) {
            return this.animate(props, speed, easing, callback);
        };
    }), jQuery.timers = [], jQuery.fx.tick = function() {
        var timer, i = 0, timers = jQuery.timers;
        for(fxNow = Date.now(); i < timers.length; i++)// Run the timer and safely remove it when done (allowing for external removal)
        (timer = timers[i])() || timers[i] !== timer || timers.splice(i--, 1);
        timers.length || jQuery.fx.stop(), fxNow = void 0;
    }, jQuery.fx.timer = function(timer) {
        jQuery.timers.push(timer), jQuery.fx.start();
    }, jQuery.fx.interval = 13, jQuery.fx.start = function() {
        inProgress || (inProgress = !0, function schedule() {
            inProgress && (!1 === document.hidden && window1.requestAnimationFrame ? window1.requestAnimationFrame(schedule) : window1.setTimeout(schedule, jQuery.fx.interval), jQuery.fx.tick());
        }());
    }, jQuery.fx.stop = function() {
        inProgress = null;
    }, jQuery.fx.speeds = {
        slow: 600,
        fast: 200,
        // Default speed
        _default: 400
    }, // Based off of the plugin by Clint Helfers, with permission.
    // https://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
    jQuery.fn.delay = function(time, type) {
        return time = jQuery.fx && jQuery.fx.speeds[time] || time, type = type || "fx", this.queue(type, function(next, hooks) {
            var timeout = window1.setTimeout(next, time);
            hooks.stop = function() {
                window1.clearTimeout(timeout);
            };
        });
    }, input1 = document.createElement("input"), opt = document.createElement("select").appendChild(document.createElement("option")), input1.type = "checkbox", // Support: Android <=4.3 only
    // Default value for a checkbox should be "on"
    support.checkOn = "" !== input1.value, // Support: IE <=11 only
    // Must access selectedIndex to make default options select
    support.optSelected = opt.selected, // Support: IE <=11 only
    // An input loses its value after becoming a radio
    (input1 = document.createElement("input")).value = "t", input1.type = "radio", support.radioValue = "t" === input1.value;
    var input1, opt, boolHook, attrHandle = jQuery.expr.attrHandle;
    jQuery.fn.extend({
        attr: function(name, value) {
            return access(this, jQuery.attr, name, value, arguments.length > 1);
        },
        removeAttr: function(name) {
            return this.each(function() {
                jQuery.removeAttr(this, name);
            });
        }
    }), jQuery.extend({
        attr: function(elem, name, value) {
            var ret, hooks, nType = elem.nodeType;
            // Don't get/set attributes on text, comment and attribute nodes
            if (3 !== nType && 8 !== nType && 2 !== nType) {
                // Fallback to prop when attributes are not supported
                if (void 0 === elem.getAttribute) return jQuery.prop(elem, name, value);
                if (1 === nType && jQuery.isXMLDoc(elem) || (hooks = jQuery.attrHooks[name.toLowerCase()] || (jQuery.expr.match.bool.test(name) ? boolHook : void 0)), void 0 !== value) {
                    if (null === value) {
                        jQuery.removeAttr(elem, name);
                        return;
                    }
                    return hooks && "set" in hooks && void 0 !== (ret = hooks.set(elem, value, name)) ? ret : (elem.setAttribute(name, value + ""), value);
                }
                return hooks && "get" in hooks && null !== (ret = hooks.get(elem, name)) ? ret : null == (ret = jQuery.find.attr(elem, name)) ? void 0 : ret;
            }
        },
        attrHooks: {
            type: {
                set: function(elem, value) {
                    if (!support.radioValue && "radio" === value && nodeName(elem, "input")) {
                        var val = elem.value;
                        return elem.setAttribute("type", value), val && (elem.value = val), value;
                    }
                }
            }
        },
        removeAttr: function(elem, value) {
            var name, i = 0, // Attribute names can contain non-HTML whitespace characters
            // https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
            attrNames = value && value.match(rnothtmlwhite);
            if (attrNames && 1 === elem.nodeType) for(; name = attrNames[i++];)elem.removeAttribute(name);
        }
    }), // Hooks for boolean attributes
    boolHook = {
        set: function(elem, value, name) {
            return !1 === value ? // Remove boolean attributes when set to false
            jQuery.removeAttr(elem, name) : elem.setAttribute(name, name), name;
        }
    }, jQuery.each(jQuery.expr.match.bool.source.match(/\w+/g), function(_i, name) {
        var getter = attrHandle[name] || jQuery.find.attr;
        attrHandle[name] = function(elem, name, isXML) {
            var ret, handle, lowercaseName = name.toLowerCase();
            return isXML || (// Avoid an infinite loop by temporarily removing this function from the getter
            handle = attrHandle[lowercaseName], attrHandle[lowercaseName] = ret, ret = null != getter(elem, name, isXML) ? lowercaseName : null, attrHandle[lowercaseName] = handle), ret;
        };
    });
    var rfocusable = /^(?:input|select|textarea|button)$/i, rclickable = /^(?:a|area)$/i;
    // Strip and collapse whitespace according to HTML spec
    // https://infra.spec.whatwg.org/#strip-and-collapse-ascii-whitespace
    function stripAndCollapse(value) {
        return (value.match(rnothtmlwhite) || []).join(" ");
    }
    function getClass(elem) {
        return elem.getAttribute && elem.getAttribute("class") || "";
    }
    function classesToArray(value) {
        return Array.isArray(value) ? value : "string" == typeof value && value.match(rnothtmlwhite) || [];
    }
    jQuery.fn.extend({
        prop: function(name, value) {
            return access(this, jQuery.prop, name, value, arguments.length > 1);
        },
        removeProp: function(name) {
            return this.each(function() {
                delete this[jQuery.propFix[name] || name];
            });
        }
    }), jQuery.extend({
        prop: function(elem, name, value) {
            var ret, hooks, nType = elem.nodeType;
            // Don't get/set properties on text, comment and attribute nodes
            if (3 !== nType && 8 !== nType && 2 !== nType) return (1 === nType && jQuery.isXMLDoc(elem) || (// Fix name and attach hooks
            name = jQuery.propFix[name] || name, hooks = jQuery.propHooks[name]), void 0 !== value) ? hooks && "set" in hooks && void 0 !== (ret = hooks.set(elem, value, name)) ? ret : elem[name] = value : hooks && "get" in hooks && null !== (ret = hooks.get(elem, name)) ? ret : elem[name];
        },
        propHooks: {
            tabIndex: {
                get: function(elem) {
                    // Support: IE <=9 - 11 only
                    // elem.tabIndex doesn't always return the
                    // correct value when it hasn't been explicitly set
                    // https://web.archive.org/web/20141116233347/http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
                    // Use proper attribute retrieval(#12072)
                    var tabindex = jQuery.find.attr(elem, "tabindex");
                    return tabindex ? parseInt(tabindex, 10) : rfocusable.test(elem.nodeName) || rclickable.test(elem.nodeName) && elem.href ? 0 : -1;
                }
            }
        },
        propFix: {
            for: "htmlFor",
            class: "className"
        }
    }), support.optSelected || (jQuery.propHooks.selected = {
        get: function(elem) {
            /* eslint no-unused-expressions: "off" */ var parent = elem.parentNode;
            return parent && parent.parentNode && parent.parentNode.selectedIndex, null;
        },
        set: function(elem) {
            /* eslint no-unused-expressions: "off" */ var parent = elem.parentNode;
            parent && (parent.selectedIndex, parent.parentNode && parent.parentNode.selectedIndex);
        }
    }), jQuery.each([
        "tabIndex",
        "readOnly",
        "maxLength",
        "cellSpacing",
        "cellPadding",
        "rowSpan",
        "colSpan",
        "useMap",
        "frameBorder",
        "contentEditable"
    ], function() {
        jQuery.propFix[this.toLowerCase()] = this;
    }), jQuery.fn.extend({
        addClass: function(value) {
            var classes, elem, cur, curValue, clazz, j, finalValue, i = 0;
            if (isFunction(value)) return this.each(function(j) {
                jQuery(this).addClass(value.call(this, j, getClass(this)));
            });
            if ((classes = classesToArray(value)).length) {
                for(; elem = this[i++];)if (curValue = getClass(elem), cur = 1 === elem.nodeType && " " + stripAndCollapse(curValue) + " ") {
                    for(j = 0; clazz = classes[j++];)0 > cur.indexOf(" " + clazz + " ") && (cur += clazz + " ");
                    curValue !== // Only assign if different to avoid unneeded rendering.
                    (finalValue = stripAndCollapse(cur)) && elem.setAttribute("class", finalValue);
                }
            }
            return this;
        },
        removeClass: function(value) {
            var classes, elem, cur, curValue, clazz, j, finalValue, i = 0;
            if (isFunction(value)) return this.each(function(j) {
                jQuery(this).removeClass(value.call(this, j, getClass(this)));
            });
            if (!arguments.length) return this.attr("class", "");
            if ((classes = classesToArray(value)).length) {
                for(; elem = this[i++];)if (curValue = getClass(elem), // This expression is here for better compressibility (see addClass)
                cur = 1 === elem.nodeType && " " + stripAndCollapse(curValue) + " ") {
                    for(j = 0; clazz = classes[j++];)// Remove *all* instances
                    for(; cur.indexOf(" " + clazz + " ") > -1;)cur = cur.replace(" " + clazz + " ", " ");
                    curValue !== // Only assign if different to avoid unneeded rendering.
                    (finalValue = stripAndCollapse(cur)) && elem.setAttribute("class", finalValue);
                }
            }
            return this;
        },
        toggleClass: function(value, stateVal) {
            var type = typeof value, isValidValue = "string" === type || Array.isArray(value);
            return "boolean" == typeof stateVal && isValidValue ? stateVal ? this.addClass(value) : this.removeClass(value) : isFunction(value) ? this.each(function(i) {
                jQuery(this).toggleClass(value.call(this, i, getClass(this), stateVal), stateVal);
            }) : this.each(function() {
                var className, i, self, classNames;
                if (isValidValue) for(// Toggle individual class names
                i = 0, self = jQuery(this), classNames = classesToArray(value); className = classNames[i++];)// Check each className given, space separated list
                self.hasClass(className) ? self.removeClass(className) : self.addClass(className);
                else (void 0 === value || "boolean" === type) && ((className = getClass(this)) && // Store className if set
                dataPriv.set(this, "__className__", className), this.setAttribute && this.setAttribute("class", className || !1 === value ? "" : dataPriv.get(this, "__className__") || ""));
            });
        },
        hasClass: function(selector) {
            var className, elem, i = 0;
            for(className = " " + selector + " "; elem = this[i++];)if (1 === elem.nodeType && (" " + stripAndCollapse(getClass(elem)) + " ").indexOf(className) > -1) return !0;
            return !1;
        }
    });
    var rreturn = /\r/g;
    jQuery.fn.extend({
        val: function(value) {
            var hooks, ret, valueIsFunction, elem = this[0];
            return arguments.length ? (valueIsFunction = isFunction(value), this.each(function(i) {
                var val;
                1 === this.nodeType && (null == (val = valueIsFunction ? value.call(this, i, jQuery(this).val()) : value) ? val = "" : "number" == typeof val ? val += "" : Array.isArray(val) && (val = jQuery.map(val, function(value) {
                    return null == value ? "" : value + "";
                })), (hooks = jQuery.valHooks[this.type] || jQuery.valHooks[this.nodeName.toLowerCase()]) && "set" in hooks && void 0 !== hooks.set(this, val, "value") || (this.value = val));
            })) : elem ? (hooks = jQuery.valHooks[elem.type] || jQuery.valHooks[elem.nodeName.toLowerCase()]) && "get" in hooks && void 0 !== (ret = hooks.get(elem, "value")) ? ret : "string" == typeof (ret = elem.value) ? ret.replace(rreturn, "") : null == ret ? "" : ret : void 0;
        }
    }), jQuery.extend({
        valHooks: {
            option: {
                get: function(elem) {
                    var val = jQuery.find.attr(elem, "value");
                    return null != val ? val : // Support: IE <=10 - 11 only
                    // option.text throws exceptions (#14686, #14858)
                    // Strip and collapse whitespace
                    // https://html.spec.whatwg.org/#strip-and-collapse-whitespace
                    stripAndCollapse(jQuery.text(elem));
                }
            },
            select: {
                get: function(elem) {
                    var value, option, i, options = elem.options, index = elem.selectedIndex, one = "select-one" === elem.type, values = one ? null : [], max = one ? index + 1 : options.length;
                    // Loop through all the selected options
                    for(i = index < 0 ? max : one ? index : 0; i < max; i++)// Support: IE <=9 only
                    // IE8-9 doesn't update selected after form reset (#2551)
                    if (((option = options[i]).selected || i === index) && // Don't return options that are disabled or in a disabled optgroup
                    !option.disabled && (!option.parentNode.disabled || !nodeName(option.parentNode, "optgroup"))) {
                        // We don't need an array for one selects
                        if (// Get the specific value for the option
                        value = jQuery(option).val(), one) return value;
                        // Multi-Selects return an array
                        values.push(value);
                    }
                    return values;
                },
                set: function(elem, value) {
                    for(var optionSet, option, options = elem.options, values = jQuery.makeArray(value), i = options.length; i--;)/* eslint-disable no-cond-assign */ ((option = options[i]).selected = jQuery.inArray(jQuery.valHooks.option.get(option), values) > -1) && (optionSet = !0);
                    return optionSet || (elem.selectedIndex = -1), values;
                }
            }
        }
    }), // Radios and checkboxes getter/setter
    jQuery.each([
        "radio",
        "checkbox"
    ], function() {
        jQuery.valHooks[this] = {
            set: function(elem, value) {
                if (Array.isArray(value)) return elem.checked = jQuery.inArray(jQuery(elem).val(), value) > -1;
            }
        }, support.checkOn || (jQuery.valHooks[this].get = function(elem) {
            return null === elem.getAttribute("value") ? "on" : elem.value;
        });
    }), // Return jQuery for attributes-only inclusion
    support.focusin = "onfocusin" in window1;
    var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/, stopPropagationCallback = function(e) {
        e.stopPropagation();
    };
    jQuery.extend(jQuery.event, {
        trigger: function(event, data, elem, onlyHandlers) {
            var i, cur, tmp, bubbleType, ontype, handle, special, lastElement, eventPath = [
                elem || document
            ], type = hasOwn.call(event, "type") ? event.type : event, namespaces = hasOwn.call(event, "namespace") ? event.namespace.split(".") : [];
            // Don't do events on text and comment nodes
            if (cur = lastElement = tmp = elem = elem || document, !(3 === elem.nodeType || 8 === elem.nodeType || rfocusMorph.test(type + jQuery.event.triggered)) && (type.indexOf(".") > -1 && (type = // Namespaced trigger; create a regexp to match event type in handle()
            (namespaces = type.split(".")).shift(), namespaces.sort()), ontype = 0 > type.indexOf(":") && "on" + type, // Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
            // Caller can pass in a jQuery.Event object, Object, or just an event type string
            (event = event[jQuery.expando] ? event : new jQuery.Event(type, "object" == typeof event && event)).isTrigger = onlyHandlers ? 2 : 3, event.namespace = namespaces.join("."), event.rnamespace = event.namespace ? RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, // Clean up the event in case it is being reused
            event.result = void 0, event.target || (event.target = elem), // Clone any incoming data and prepend the event, creating the handler arg list
            data = null == data ? [
                event
            ] : jQuery.makeArray(data, [
                event
            ]), // Allow special events to draw outside the lines
            special = jQuery.event.special[type] || {}, onlyHandlers || !special.trigger || !1 !== special.trigger.apply(elem, data))) {
                // Determine event propagation path in advance, per W3C events spec (#9951)
                // Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
                if (!onlyHandlers && !special.noBubble && !isWindow(elem)) {
                    for(bubbleType = special.delegateType || type, rfocusMorph.test(bubbleType + type) || (cur = cur.parentNode); cur; cur = cur.parentNode)eventPath.push(cur), tmp = cur;
                    tmp === (elem.ownerDocument || document) && eventPath.push(tmp.defaultView || tmp.parentWindow || window1);
                }
                for(// Fire handlers on the event path
                i = 0; (cur = eventPath[i++]) && !event.isPropagationStopped();)lastElement = cur, event.type = i > 1 ? bubbleType : special.bindType || type, // jQuery handler
                (handle = (dataPriv.get(cur, "events") || Object.create(null))[event.type] && dataPriv.get(cur, "handle")) && handle.apply(cur, data), // Native handler
                (handle = ontype && cur[ontype]) && handle.apply && acceptData(cur) && (event.result = handle.apply(cur, data), !1 === event.result && event.preventDefault());
                return event.type = type, !onlyHandlers && !event.isDefaultPrevented() && (!special._default || !1 === special._default.apply(eventPath.pop(), data)) && acceptData(elem) && ontype && isFunction(elem[type]) && !isWindow(elem) && (// Don't re-trigger an onFOO event when we call its FOO() method
                (tmp = elem[ontype]) && (elem[ontype] = null), // Prevent re-triggering of the same event, since we already bubbled it above
                jQuery.event.triggered = type, event.isPropagationStopped() && lastElement.addEventListener(type, stopPropagationCallback), elem[type](), event.isPropagationStopped() && lastElement.removeEventListener(type, stopPropagationCallback), jQuery.event.triggered = void 0, tmp && (elem[ontype] = tmp)), event.result;
            }
        },
        // Piggyback on a donor event to simulate a different one
        // Used only for `focus(in | out)` events
        simulate: function(type, elem, event) {
            var e = jQuery.extend(new jQuery.Event(), event, {
                type: type,
                isSimulated: !0
            });
            jQuery.event.trigger(e, null, elem);
        }
    }), jQuery.fn.extend({
        trigger: function(type, data) {
            return this.each(function() {
                jQuery.event.trigger(type, data, this);
            });
        },
        triggerHandler: function(type, data) {
            var elem = this[0];
            if (elem) return jQuery.event.trigger(type, data, elem, !0);
        }
    }), support.focusin || jQuery.each({
        focus: "focusin",
        blur: "focusout"
    }, function(orig, fix) {
        // Attach a single capturing handler on the document while someone wants focusin/focusout
        var handler = function(event) {
            jQuery.event.simulate(fix, event.target, jQuery.event.fix(event));
        };
        jQuery.event.special[fix] = {
            setup: function() {
                // Handle: regular nodes (via `this.ownerDocument`), window
                // (via `this.document`) & document (via `this`).
                var doc = this.ownerDocument || this.document || this, attaches = dataPriv.access(doc, fix);
                attaches || doc.addEventListener(orig, handler, !0), dataPriv.access(doc, fix, (attaches || 0) + 1);
            },
            teardown: function() {
                var doc = this.ownerDocument || this.document || this, attaches = dataPriv.access(doc, fix) - 1;
                attaches ? dataPriv.access(doc, fix, attaches) : (doc.removeEventListener(orig, handler, !0), dataPriv.remove(doc, fix));
            }
        };
    });
    var location = window1.location, nonce = {
        guid: Date.now()
    }, rquery = /\?/;
    // Cross-browser xml parsing
    jQuery.parseXML = function(data) {
        var xml;
        if (!data || "string" != typeof data) return null;
        // Support: IE 9 - 11 only
        // IE throws on parseFromString with invalid input.
        try {
            xml = new window1.DOMParser().parseFromString(data, "text/xml");
        } catch (e) {
            xml = void 0;
        }
        return (!xml || xml.getElementsByTagName("parsererror").length) && jQuery.error("Invalid XML: " + data), xml;
    };
    var rbracket = /\[\]$/, rCRLF = /\r?\n/g, rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i, rsubmittable = /^(?:input|select|textarea|keygen)/i;
    // Serialize an array of form elements or a set of
    // key/values into a query string
    jQuery.param = function(a, traditional) {
        var prefix, s = [], add = function(key, valueOrFunction) {
            // If value is a function, invoke it and use its return value
            var value = isFunction(valueOrFunction) ? valueOrFunction() : valueOrFunction;
            s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(null == value ? "" : value);
        };
        if (null == a) return "";
        // If an array was passed in, assume that it is an array of form elements.
        if (Array.isArray(a) || a.jquery && !jQuery.isPlainObject(a)) // Serialize the form elements
        jQuery.each(a, function() {
            add(this.name, this.value);
        });
        else // If traditional, encode the "old" way (the way 1.3.2 or older
        // did it), otherwise encode params recursively.
        for(prefix in a)!function buildParams(prefix, obj, traditional, add) {
            var name;
            if (Array.isArray(obj)) // Serialize array item.
            jQuery.each(obj, function(i, v) {
                traditional || rbracket.test(prefix) ? // Treat each array item as a scalar.
                add(prefix, v) : // Item is non-scalar (array or object), encode its numeric index.
                buildParams(prefix + "[" + ("object" == typeof v && null != v ? i : "") + "]", v, traditional, add);
            });
            else if (traditional || "object" !== toType(obj)) // Serialize scalar item.
            add(prefix, obj);
            else // Serialize object item.
            for(name in obj)buildParams(prefix + "[" + name + "]", obj[name], traditional, add);
        }(prefix, a[prefix], traditional, add);
        // Return the resulting serialization
        return s.join("&");
    }, jQuery.fn.extend({
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
                // Use .is( ":disabled" ) so that fieldset[disabled] works
                return this.name && !jQuery(this).is(":disabled") && rsubmittable.test(this.nodeName) && !rsubmitterTypes.test(type) && (this.checked || !rcheckableType.test(type));
            }).map(function(_i, elem) {
                var val = jQuery(this).val();
                return null == val ? null : Array.isArray(val) ? jQuery.map(val, function(val) {
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
    });
    var r20 = /%20/g, rhash = /#.*$/, rantiCache = /([?&])_=[^&]*/, rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg, rnoContent = /^(?:GET|HEAD)$/, rprotocol = /^\/\//, /* Prefilters
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
    allTypes = "*/".concat("*"), // Anchor tag for parsing the document origin
    originAnchor = document.createElement("a");
    // Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
    function addToPrefiltersOrTransports(structure) {
        // dataTypeExpression is optional and defaults to "*"
        return function(dataTypeExpression, func) {
            "string" != typeof dataTypeExpression && (func = dataTypeExpression, dataTypeExpression = "*");
            var dataType, i = 0, dataTypes = dataTypeExpression.toLowerCase().match(rnothtmlwhite) || [];
            if (isFunction(func)) // For each dataType in the dataTypeExpression
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
        var key, deep, flatOptions = jQuery.ajaxSettings.flatOptions || {};
        for(key in src)void 0 !== src[key] && ((flatOptions[key] ? target : deep || (deep = {}))[key] = src[key]);
        return deep && jQuery.extend(!0, target, deep), target;
    }
    originAnchor.href = location.href, jQuery.extend({
        // Counter for holding the number of active queries
        active: 0,
        // Last-Modified header cache for next request
        lastModified: {},
        etag: {},
        ajaxSettings: {
            url: location.href,
            type: "GET",
            isLocal: /^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(location.protocol),
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
                xml: /\bxml\b/,
                html: /\bhtml/,
                json: /\bjson\b/
            },
            responseFields: {
                xml: "responseXML",
                text: "responseText",
                json: "responseJSON"
            },
            // Data converters
            // Keys separate source (or catchall "*") and destination types with a single space
            converters: {
                // Convert anything to text
                "* text": String,
                // Text to html (true = no transformation)
                "text html": !0,
                // Evaluate text as a json expression
                "text json": JSON.parse,
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
            return settings ? // Building a settings object
            ajaxExtend(ajaxExtend(target, jQuery.ajaxSettings), settings) : // Extending ajaxSettings
            ajaxExtend(jQuery.ajaxSettings, target);
        },
        ajaxPrefilter: addToPrefiltersOrTransports(prefilters),
        ajaxTransport: addToPrefiltersOrTransports(transports),
        // Main method
        ajax: function(url, options) {
            "object" == typeof url && (options = url, url = void 0), // Force options to be an object
            options = options || {};
            var transport, // URL without anti-cache param
            cacheURL, // Response headers
            responseHeadersString, responseHeaders, // timeout handle
            timeoutTimer, // Url cleanup var
            urlAnchor, // Request state (becomes false upon send and true upon completion)
            completed, // To know if global events are to be dispatched
            fireGlobals, // Loop variable
            i, // uncached part of the url
            uncached, // Create the final options object
            s = jQuery.ajaxSetup({}, options), // Callbacks context
            callbackContext = s.context || s, // Context for global events is callbackContext if it is a DOM node or jQuery collection
            globalEventContext = s.context && (callbackContext.nodeType || callbackContext.jquery) ? jQuery(callbackContext) : jQuery.event, // Deferreds
            deferred = jQuery.Deferred(), completeDeferred = jQuery.Callbacks("once memory"), // Status-dependent callbacks
            statusCode = s.statusCode || {}, // Headers (they are sent all at once)
            requestHeaders = {}, requestHeadersNames = {}, // Default abort message
            strAbort = "canceled", // Fake xhr
            jqXHR = {
                readyState: 0,
                // Builds headers hashtable if needed
                getResponseHeader: function(key) {
                    var match;
                    if (completed) {
                        if (!responseHeaders) for(responseHeaders = {}; match = rheaders.exec(responseHeadersString);)responseHeaders[match[1].toLowerCase() + " "] = (responseHeaders[match[1].toLowerCase() + " "] || []).concat(match[2]);
                        match = responseHeaders[key.toLowerCase() + " "];
                    }
                    return null == match ? null : match.join(", ");
                },
                // Raw string
                getAllResponseHeaders: function() {
                    return completed ? responseHeadersString : null;
                },
                // Caches the header
                setRequestHeader: function(name, value) {
                    return null == completed && (requestHeaders[name = requestHeadersNames[name.toLowerCase()] = requestHeadersNames[name.toLowerCase()] || name] = value), this;
                },
                // Overrides response content-type header
                overrideMimeType: function(type) {
                    return null == completed && (s.mimeType = type), this;
                },
                // Status-dependent callbacks
                statusCode: function(map) {
                    var code;
                    if (map) {
                        if (completed) // Execute the appropriate callbacks
                        jqXHR.always(map[jqXHR.status]);
                        else // Lazy-add the new callbacks in a way that preserves old ones
                        for(code in map)statusCode[code] = [
                            statusCode[code],
                            map[code]
                        ];
                    }
                    return this;
                },
                // Cancel the request
                abort: function(statusText) {
                    var finalText = statusText || strAbort;
                    return transport && transport.abort(finalText), done(0, finalText), this;
                }
            };
            // A cross-domain request is in order when the origin doesn't match the current origin.
            if (// Attach deferreds
            deferred.promise(jqXHR), // Add protocol if not provided (prefilters might expect it)
            // Handle falsy url in the settings object (#10093: consistency with old signature)
            // We also use the url parameter if available
            s.url = ((url || s.url || location.href) + "").replace(rprotocol, location.protocol + "//"), // Alias method option to type as per ticket #12004
            s.type = options.method || options.type || s.method || s.type, // Extract dataTypes list
            s.dataTypes = (s.dataType || "*").toLowerCase().match(rnothtmlwhite) || [
                ""
            ], null == s.crossDomain) {
                urlAnchor = document.createElement("a");
                // Support: IE <=8 - 11, Edge 12 - 15
                // IE throws exception on accessing the href property if url is malformed,
                // e.g. http://example.com:80x/
                try {
                    urlAnchor.href = s.url, // Support: IE <=8 - 11 only
                    // Anchor's host property isn't correctly set when s.url is relative
                    urlAnchor.href = urlAnchor.href, s.crossDomain = originAnchor.protocol + "//" + originAnchor.host != urlAnchor.protocol + "//" + urlAnchor.host;
                } catch (e) {
                    // If there is an error parsing the URL, assume it is crossDomain,
                    // it can be rejected by the transport if it is invalid
                    s.crossDomain = !0;
                }
            }
            // If request was aborted inside a prefilter, stop there
            if (s.data && s.processData && "string" != typeof s.data && (s.data = jQuery.param(s.data, s.traditional)), // Apply prefilters
            inspectPrefiltersOrTransports(prefilters, s, options, jqXHR), completed) return jqXHR;
            // Check for headers option
            for(i in // We can fire global events as of now if asked to
            // Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
            (fireGlobals = jQuery.event && s.global) && 0 == jQuery.active++ && jQuery.event.trigger("ajaxStart"), // Uppercase the type
            s.type = s.type.toUpperCase(), // Determine if request has content
            s.hasContent = !rnoContent.test(s.type), // Save the URL in case we're toying with the If-Modified-Since
            // and/or If-None-Match header later on
            // Remove hash to simplify url manipulation
            cacheURL = s.url.replace(rhash, ""), s.hasContent ? s.data && s.processData && 0 === (s.contentType || "").indexOf("application/x-www-form-urlencoded") && (s.data = s.data.replace(r20, "+")) : (// Remember the hash so we can put it back
            uncached = s.url.slice(cacheURL.length), s.data && (s.processData || "string" == typeof s.data) && (cacheURL += (rquery.test(cacheURL) ? "&" : "?") + s.data, // #9682: remove data so that it's not used in an eventual retry
            delete s.data), !1 === s.cache && (cacheURL = cacheURL.replace(rantiCache, "$1"), uncached = (rquery.test(cacheURL) ? "&" : "?") + "_=" + nonce.guid++ + uncached), // Put hash and anti-cache on the URL that will be requested (gh-1732)
            s.url = cacheURL + uncached), s.ifModified && (jQuery.lastModified[cacheURL] && jqXHR.setRequestHeader("If-Modified-Since", jQuery.lastModified[cacheURL]), jQuery.etag[cacheURL] && jqXHR.setRequestHeader("If-None-Match", jQuery.etag[cacheURL])), (s.data && s.hasContent && !1 !== s.contentType || options.contentType) && jqXHR.setRequestHeader("Content-Type", s.contentType), // Set the Accepts header for the server, depending on the dataType
            jqXHR.setRequestHeader("Accept", s.dataTypes[0] && s.accepts[s.dataTypes[0]] ? s.accepts[s.dataTypes[0]] + ("*" !== s.dataTypes[0] ? ", " + allTypes + "; q=0.01" : "") : s.accepts["*"]), s.headers)jqXHR.setRequestHeader(i, s.headers[i]);
            // Allow custom headers/mimetypes and early abort
            if (s.beforeSend && (!1 === s.beforeSend.call(callbackContext, jqXHR, s) || completed)) // Abort if not done already and return
            return jqXHR.abort();
            // If no transport, we auto-abort
            if (// Aborting is no longer a cancellation
            strAbort = "abort", // Install callbacks on deferreds
            completeDeferred.add(s.complete), jqXHR.done(s.success), jqXHR.fail(s.error), // Get transport
            transport = inspectPrefiltersOrTransports(transports, s, options, jqXHR)) {
                // If request was aborted inside ajaxSend, stop there
                if (jqXHR.readyState = 1, fireGlobals && globalEventContext.trigger("ajaxSend", [
                    jqXHR,
                    s
                ]), completed) return jqXHR;
                s.async && s.timeout > 0 && (timeoutTimer = window1.setTimeout(function() {
                    jqXHR.abort("timeout");
                }, s.timeout));
                try {
                    completed = !1, transport.send(requestHeaders, done);
                } catch (e) {
                    // Rethrow post-completion exceptions
                    if (completed) throw e;
                    // Propagate others as results
                    done(-1, e);
                }
            } else done(-1, "No Transport");
            // Callback for when everything is done
            function done(status, nativeStatusText, responses, headers) {
                var isSuccess, success, error, response, modified, statusText = nativeStatusText;
                // Ignore repeat invocations
                !completed && (completed = !0, timeoutTimer && window1.clearTimeout(timeoutTimer), // Dereference transport for early garbage collection
                // (no matter how long the jqXHR object will be used)
                transport = void 0, // Cache response headers
                responseHeadersString = headers || "", // Set readyState
                jqXHR.readyState = status > 0 ? 4 : 0, // Determine if successful
                isSuccess = status >= 200 && status < 300 || 304 === status, responses && (response = /* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */ function(s, jqXHR, responses) {
                    // Remove auto dataType and get content-type in the process
                    for(var ct, type, finalDataType, firstDataType, contents = s.contents, dataTypes = s.dataTypes; "*" === dataTypes[0];)dataTypes.shift(), void 0 === ct && (ct = s.mimeType || jqXHR.getResponseHeader("Content-Type"));
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
                }(s, jqXHR, responses)), !isSuccess && jQuery.inArray("script", s.dataTypes) > -1 && (s.converters["text script"] = function() {}), // Convert no matter what (that way responseXXX fields are always set)
                response = /* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */ function(s, response, jqXHR, isSuccess) {
                    var conv2, current, conv, tmp, prev, converters = {}, // Work with a copy of dataTypes in case we need to modify it for conversion
                    dataTypes = s.dataTypes.slice();
                    // Create converters map with lowercased keys
                    if (dataTypes[1]) for(conv in s.converters)converters[conv.toLowerCase()] = s.converters[conv];
                    // Convert to each sequential dataType
                    for(current = dataTypes.shift(); current;)if (s.responseFields[current] && (jqXHR[s.responseFields[current]] = response), !prev && isSuccess && s.dataFilter && (response = s.dataFilter(response, s.dataType)), prev = current, current = dataTypes.shift()) {
                        // There's only work to do if current dataType is non-auto
                        if ("*" === current) current = prev;
                        else if ("*" !== prev && prev !== current) {
                            // If none found, seek a pair
                            if (!// Seek a direct converter
                            (conv = converters[prev + " " + current] || converters["* " + current])) {
                                for(conv2 in converters)if (// If conv2 outputs current
                                (tmp = conv2.split(" "))[1] === current && // If prev can be converted to accepted input
                                (conv = converters[prev + " " + tmp[0]] || converters["* " + tmp[0]])) {
                                    // Condense equivalence converters
                                    !0 === conv ? conv = converters[conv2] : !0 !== converters[conv2] && (current = tmp[0], dataTypes.unshift(tmp[1]));
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
                    }
                    return {
                        state: "success",
                        data: response
                    };
                }(s, response, jqXHR, isSuccess), isSuccess ? (s.ifModified && ((modified = jqXHR.getResponseHeader("Last-Modified")) && (jQuery.lastModified[cacheURL] = modified), (modified = jqXHR.getResponseHeader("etag")) && (jQuery.etag[cacheURL] = modified)), 204 === status || "HEAD" === s.type ? statusText = "nocontent" : 304 === status ? statusText = "notmodified" : (statusText = response.state, success = response.data, isSuccess = !(error = response.error))) : (// Extract error from statusText and normalize for non-aborts
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
                jqXHR.statusCode(statusCode), statusCode = void 0, fireGlobals && globalEventContext.trigger(isSuccess ? "ajaxSuccess" : "ajaxError", [
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
        getJSON: function(url, data, callback) {
            return jQuery.get(url, data, callback, "json");
        },
        getScript: function(url, callback) {
            return jQuery.get(url, void 0, callback, "script");
        }
    }), jQuery.each([
        "get",
        "post"
    ], function(_i, method) {
        jQuery[method] = function(url, data, callback, type) {
            // The url can be an options object (which then must have .url)
            return isFunction(data) && (type = type || callback, callback = data, data = void 0), jQuery.ajax(jQuery.extend({
                url: url,
                type: method,
                dataType: type,
                data: data,
                success: callback
            }, jQuery.isPlainObject(url) && url));
        };
    }), jQuery.ajaxPrefilter(function(s) {
        var i;
        for(i in s.headers)"content-type" === i.toLowerCase() && (s.contentType = s.headers[i] || "");
    }), jQuery._evalUrl = function(url, options, doc) {
        return jQuery.ajax({
            url: url,
            // Make this explicit, since user can override this through ajaxSetup (#11264)
            type: "GET",
            dataType: "script",
            cache: !0,
            async: !1,
            global: !1,
            // Only evaluate the response if it is successful (gh-4126)
            // dataFilter is not invoked for failure responses, so using it instead
            // of the default converter is kludgy but it works.
            converters: {
                "text script": function() {}
            },
            dataFilter: function(response) {
                jQuery.globalEval(response, options, doc);
            }
        });
    }, jQuery.fn.extend({
        wrapAll: function(html) {
            var wrap;
            return this[0] && (isFunction(html) && (html = html.call(this[0])), // The elements to wrap the target around
            wrap = jQuery(html, this[0].ownerDocument).eq(0).clone(!0), this[0].parentNode && wrap.insertBefore(this[0]), wrap.map(function() {
                for(var elem = this; elem.firstElementChild;)elem = elem.firstElementChild;
                return elem;
            }).append(this)), this;
        },
        wrapInner: function(html) {
            return isFunction(html) ? this.each(function(i) {
                jQuery(this).wrapInner(html.call(this, i));
            }) : this.each(function() {
                var self = jQuery(this), contents = self.contents();
                contents.length ? contents.wrapAll(html) : self.append(html);
            });
        },
        wrap: function(html) {
            var htmlIsFunction = isFunction(html);
            return this.each(function(i) {
                jQuery(this).wrapAll(htmlIsFunction ? html.call(this, i) : html);
            });
        },
        unwrap: function(selector) {
            return this.parent(selector).not("body").each(function() {
                jQuery(this).replaceWith(this.childNodes);
            }), this;
        }
    }), jQuery.expr.pseudos.hidden = function(elem) {
        return !jQuery.expr.pseudos.visible(elem);
    }, jQuery.expr.pseudos.visible = function(elem) {
        return !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
    }, jQuery.ajaxSettings.xhr = function() {
        try {
            return new window1.XMLHttpRequest();
        } catch (e) {}
    };
    var xhrSuccessStatus = {
        // File protocol always yields status code 0, assume 200
        0: 200,
        // Support: IE <=9 only
        // #1450: sometimes IE returns 1223 when it should be 204
        1223: 204
    }, xhrSupported = jQuery.ajaxSettings.xhr();
    support.cors = !!xhrSupported && "withCredentials" in xhrSupported, support.ajax = xhrSupported = !!xhrSupported, jQuery.ajaxTransport(function(options) {
        var callback, errorCallback;
        // Cross domain only allowed if supported through XMLHttpRequest
        if (support.cors || xhrSupported && !options.crossDomain) return {
            send: function(headers, complete) {
                var i, xhr = options.xhr();
                // Apply custom fields if provided
                if (xhr.open(options.type, options.url, options.async, options.username, options.password), options.xhrFields) for(i in options.xhrFields)xhr[i] = options.xhrFields[i];
                // Set headers
                for(i in options.mimeType && xhr.overrideMimeType && xhr.overrideMimeType(options.mimeType), options.crossDomain || headers["X-Requested-With"] || (headers["X-Requested-With"] = "XMLHttpRequest"), headers)xhr.setRequestHeader(i, headers[i]);
                // Callback
                callback = function(type) {
                    return function() {
                        callback && (callback = errorCallback = xhr.onload = xhr.onerror = xhr.onabort = xhr.ontimeout = xhr.onreadystatechange = null, "abort" === type ? xhr.abort() : "error" === type ? "number" != typeof xhr.status ? complete(0, "error") : complete(// File: protocol always yields status 0; see #8605, #14207
                        xhr.status, xhr.statusText) : complete(xhrSuccessStatus[xhr.status] || xhr.status, xhr.statusText, "text" !== // Support: IE <=9 only
                        // IE9 has no XHR2 but throws on binary (trac-11426)
                        // For XHR2 non-text, let the caller handle it (gh-2498)
                        (xhr.responseType || "text") || "string" != typeof xhr.responseText ? {
                            binary: xhr.response
                        } : {
                            text: xhr.responseText
                        }, xhr.getAllResponseHeaders()));
                    };
                }, // Listen to events
                xhr.onload = callback(), errorCallback = xhr.onerror = xhr.ontimeout = callback("error"), void 0 !== xhr.onabort ? xhr.onabort = errorCallback : xhr.onreadystatechange = function() {
                    // Check readyState before timeout as it changes
                    4 === xhr.readyState && // Allow onerror to be called first,
                    // but that will not handle a native abort
                    // Also, save errorCallback to a variable
                    // as xhr.onerror cannot be accessed
                    window1.setTimeout(function() {
                        callback && errorCallback();
                    });
                }, // Create the abort callback
                callback = callback("abort");
                try {
                    // Do send the request (this may raise an exception)
                    xhr.send(options.hasContent && options.data || null);
                } catch (e) {
                    // #14683: Only rethrow if this hasn't been notified as an error yet
                    if (callback) throw e;
                }
            },
            abort: function() {
                callback && callback();
            }
        };
    }), // Prevent auto-execution of scripts when no explicit dataType was provided (See gh-2432)
    jQuery.ajaxPrefilter(function(s) {
        s.crossDomain && (s.contents.script = !1);
    }), // Install script dataType
    jQuery.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /\b(?:java|ecma)script\b/
        },
        converters: {
            "text script": function(text) {
                return jQuery.globalEval(text), text;
            }
        }
    }), // Handle cache's special case and crossDomain
    jQuery.ajaxPrefilter("script", function(s) {
        void 0 === s.cache && (s.cache = !1), s.crossDomain && (s.type = "GET");
    }), // Bind script tag hack transport
    jQuery.ajaxTransport("script", function(s) {
        // This transport only deals with cross domain or forced-by-attrs requests
        if (s.crossDomain || s.scriptAttrs) {
            var script, callback;
            return {
                send: function(_, complete) {
                    script = jQuery("<script>").attr(s.scriptAttrs || {}).prop({
                        charset: s.scriptCharset,
                        src: s.url
                    }).on("load error", callback = function(evt) {
                        script.remove(), callback = null, evt && complete("error" === evt.type ? 404 : 200, evt.type);
                    }), // Use native DOM manipulation to avoid our domManip AJAX trickery
                    document.head.appendChild(script[0]);
                },
                abort: function() {
                    callback && callback();
                }
            };
        }
    });
    var oldCallbacks = [], rjsonp = /(=)\?(?=&|$)|\?\?/;
    // Default jsonp settings
    jQuery.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
            var callback = oldCallbacks.pop() || jQuery.expando + "_" + nonce.guid++;
            return this[callback] = !0, callback;
        }
    }), // Detect, normalize options and install callbacks for jsonp requests
    jQuery.ajaxPrefilter("json jsonp", function(s, originalSettings, jqXHR) {
        var callbackName, overwritten, responseContainer, jsonProp = !1 !== s.jsonp && (rjsonp.test(s.url) ? "url" : "string" == typeof s.data && 0 === (s.contentType || "").indexOf("application/x-www-form-urlencoded") && rjsonp.test(s.data) && "data");
        // Handle iff the expected data type is "jsonp" or we have a parameter to set
        if (jsonProp || "jsonp" === s.dataTypes[0]) // Delegate to script
        return(// Get callback name, remembering preexisting value associated with it
        callbackName = s.jsonpCallback = isFunction(s.jsonpCallback) ? s.jsonpCallback() : s.jsonpCallback, jsonProp ? s[jsonProp] = s[jsonProp].replace(rjsonp, "$1" + callbackName) : !1 !== s.jsonp && (s.url += (rquery.test(s.url) ? "&" : "?") + s.jsonp + "=" + callbackName), // Use data converter to retrieve json after script execution
        s.converters["script json"] = function() {
            return responseContainer || jQuery.error(callbackName + " was not called"), responseContainer[0];
        }, // Force json dataType
        s.dataTypes[0] = "json", // Install callback
        overwritten = window1[callbackName], window1[callbackName] = function() {
            responseContainer = arguments;
        }, // Clean-up function (fires after converters)
        jqXHR.always(function() {
            void 0 === overwritten ? jQuery(window1).removeProp(callbackName) : window1[callbackName] = overwritten, s[callbackName] && (// Make sure that re-using the options doesn't screw things around
            s.jsonpCallback = originalSettings.jsonpCallback, // Save the callback name for future use
            oldCallbacks.push(callbackName)), responseContainer && isFunction(overwritten) && overwritten(responseContainer[0]), responseContainer = overwritten = void 0;
        }), "script");
    }), // Support: Safari 8 only
    // In Safari 8 documents created via document.implementation.createHTMLDocument
    // collapse sibling forms: the second one becomes a child of the first one.
    // Because of that, this security measure has to be disabled in Safari 8.
    // https://bugs.webkit.org/show_bug.cgi?id=137337
    support.createHTMLDocument = ((body = document.implementation.createHTMLDocument("").body).innerHTML = "<form></form><form></form>", 2 === body.childNodes.length), // Argument "data" should be string of html
    // context (optional): If specified, the fragment will be created in this context,
    // defaults to document
    // keepScripts (optional): If true, will include scripts passed in the html string
    jQuery.parseHTML = function(data, context, keepScripts) {
        var base, parsed, scripts;
        return "string" != typeof data ? [] : ("boolean" == typeof context && (keepScripts = context, context = !1), context || (support.createHTMLDocument ? (// Set the base href for the created document
        // so any parsed elements with URLs
        // are based on the document's URL (gh-2965)
        (base = (context = document.implementation.createHTMLDocument("")).createElement("base")).href = document.location.href, context.head.appendChild(base)) : context = document), parsed = rsingleTag.exec(data), scripts = !keepScripts && [], parsed) ? [
            context.createElement(parsed[1])
        ] : (parsed = buildFragment([
            data
        ], context, scripts), scripts && scripts.length && jQuery(scripts).remove(), jQuery.merge([], parsed.childNodes));
    }, /**
 * Load a url into a page
 */ jQuery.fn.load = function(url, params, callback) {
        var selector, type, response, self = this, off = url.indexOf(" ");
        return off > -1 && (selector = stripAndCollapse(url.slice(off)), url = url.slice(0, off)), isFunction(params) ? (// We assume that it's the callback
        callback = params, params = void 0) : params && "object" == typeof params && (type = "POST"), self.length > 0 && jQuery.ajax({
            url: url,
            // If "type" variable is undefined, then "GET" method will be used.
            // Make value of this field explicit since
            // user can override it through ajaxSetup method
            type: type || "GET",
            dataType: "html",
            data: params
        }).done(function(responseText) {
            // Save response for use in complete callback
            response = arguments, self.html(selector ? // If a selector was specified, locate the right elements in a dummy div
            // Exclude scripts to avoid IE 'Permission Denied' errors
            jQuery("<div>").append(jQuery.parseHTML(responseText)).find(selector) : // Otherwise use the full result
            responseText);
        // If the request succeeds, this function gets "data", "status", "jqXHR"
        // but they are ignored because response was set above.
        // If it fails, this function gets "jqXHR", "status", "error"
        }).always(callback && function(jqXHR, status) {
            self.each(function() {
                callback.apply(this, response || [
                    jqXHR.responseText,
                    status,
                    jqXHR
                ]);
            });
        }), this;
    }, jQuery.expr.pseudos.animated = function(elem) {
        return jQuery.grep(jQuery.timers, function(fn) {
            return elem === fn.elem;
        }).length;
    }, jQuery.offset = {
        setOffset: function(elem, options, i) {
            var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, position = jQuery.css(elem, "position"), curElem = jQuery(elem), props = {};
            "static" === position && (elem.style.position = "relative"), curOffset = curElem.offset(), curCSSTop = jQuery.css(elem, "top"), curCSSLeft = jQuery.css(elem, "left"), ("absolute" === position || "fixed" === position) && (curCSSTop + curCSSLeft).indexOf("auto") > -1 ? (curTop = (curPosition = curElem.position()).top, curLeft = curPosition.left) : (curTop = parseFloat(curCSSTop) || 0, curLeft = parseFloat(curCSSLeft) || 0), isFunction(options) && // Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
            (options = options.call(elem, i, jQuery.extend({}, curOffset))), null != options.top && (props.top = options.top - curOffset.top + curTop), null != options.left && (props.left = options.left - curOffset.left + curLeft), "using" in options ? options.using.call(elem, props) : ("number" == typeof props.top && (props.top += "px"), "number" == typeof props.left && (props.left += "px"), curElem.css(props));
        }
    }, jQuery.fn.extend({
        // offset() relates an element's border box to the document origin
        offset: function(options) {
            // Preserve chaining for setter
            if (arguments.length) return void 0 === options ? this : this.each(function(i) {
                jQuery.offset.setOffset(this, options, i);
            });
            var rect, win, elem = this[0];
            return elem ? elem.getClientRects().length ? (// Get document-relative position by adding viewport scroll to viewport-relative gBCR
            rect = elem.getBoundingClientRect(), win = elem.ownerDocument.defaultView, {
                top: rect.top + win.pageYOffset,
                left: rect.left + win.pageXOffset
            }) : {
                top: 0,
                left: 0
            } : void 0;
        },
        // position() relates an element's margin box to its offset parent's padding box
        // This corresponds to the behavior of CSS absolute positioning
        position: function() {
            if (this[0]) {
                var offsetParent, offset, doc, elem = this[0], parentOffset = {
                    top: 0,
                    left: 0
                };
                // position:fixed elements are offset from the viewport, which itself always has zero offset
                if ("fixed" === jQuery.css(elem, "position")) // Assume position:fixed implies availability of getBoundingClientRect
                offset = elem.getBoundingClientRect();
                else {
                    for(offset = this.offset(), // Account for the *real* offset parent, which can be the document or its root element
                    // when a statically positioned element is identified
                    doc = elem.ownerDocument, offsetParent = elem.offsetParent || doc.documentElement; offsetParent && (offsetParent === doc.body || offsetParent === doc.documentElement) && "static" === jQuery.css(offsetParent, "position");)offsetParent = offsetParent.parentNode;
                    offsetParent && offsetParent !== elem && 1 === offsetParent.nodeType && (// Incorporate borders into its offset, since they are outside its content origin
                    parentOffset = jQuery(offsetParent).offset(), parentOffset.top += jQuery.css(offsetParent, "borderTopWidth", !0), parentOffset.left += jQuery.css(offsetParent, "borderLeftWidth", !0));
                }
                // Subtract parent offsets and element margins
                return {
                    top: offset.top - parentOffset.top - jQuery.css(elem, "marginTop", !0),
                    left: offset.left - parentOffset.left - jQuery.css(elem, "marginLeft", !0)
                };
            }
        },
        // This method will return documentElement in the following cases:
        // 1) For the element inside the iframe without offsetParent, this method will return
        //    documentElement of the parent window
        // 2) For the hidden or detached element
        // 3) For body or html element, i.e. in case of the html node - it will return itself
        //
        // but those exceptions were never presented as a real life use-cases
        // and might be considered as more preferable results.
        //
        // This logic, however, is not guaranteed and can change at any point in the future
        offsetParent: function() {
            return this.map(function() {
                for(var offsetParent = this.offsetParent; offsetParent && "static" === jQuery.css(offsetParent, "position");)offsetParent = offsetParent.offsetParent;
                return offsetParent || documentElement;
            });
        }
    }), // Create scrollLeft and scrollTop methods
    jQuery.each({
        scrollLeft: "pageXOffset",
        scrollTop: "pageYOffset"
    }, function(method, prop) {
        var top = "pageYOffset" === prop;
        jQuery.fn[method] = function(val) {
            return access(this, function(elem, method, val) {
                // Coalesce documents and windows
                var win;
                if (isWindow(elem) ? win = elem : 9 === elem.nodeType && (win = elem.defaultView), void 0 === val) return win ? win[prop] : elem[method];
                win ? win.scrollTo(top ? win.pageXOffset : val, top ? val : win.pageYOffset) : elem[method] = val;
            }, method, val, arguments.length);
        };
    }), // Support: Safari <=7 - 9.1, Chrome <=37 - 49
    // Add the top/left cssHooks using jQuery.fn.position
    // Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
    // Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
    // getComputedStyle returns percent when specified for top/left/bottom/right;
    // rather than make the css module depend on the offset module, just check for it here
    jQuery.each([
        "top",
        "left"
    ], function(_i, prop) {
        jQuery.cssHooks[prop] = addGetHookIf(support.pixelPosition, function(elem, computed) {
            if (computed) // If curCSS returns percentage, fallback to offset
            return computed = curCSS(elem, prop), rnumnonpx.test(computed) ? jQuery(elem).position()[prop] + "px" : computed;
        });
    }), // Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
    jQuery.each({
        Height: "height",
        Width: "width"
    }, function(name, type) {
        jQuery.each({
            padding: "inner" + name,
            content: type,
            "": "outer" + name
        }, function(defaultExtra, funcName) {
            // Margin is only for outerHeight, outerWidth
            jQuery.fn[funcName] = function(margin, value) {
                var chainable = arguments.length && (defaultExtra || "boolean" != typeof margin), extra = defaultExtra || (!0 === margin || !0 === value ? "margin" : "border");
                return access(this, function(elem, type, value) {
                    var doc;
                    return isWindow(elem) ? 0 === funcName.indexOf("outer") ? elem["inner" + name] : elem.document.documentElement["client" + name] : 9 === elem.nodeType ? (doc = elem.documentElement, Math.max(elem.body["scroll" + name], doc["scroll" + name], elem.body["offset" + name], doc["offset" + name], doc["client" + name])) : void 0 === value ? // Get width or height on the element, requesting but not forcing parseFloat
                    jQuery.css(elem, type, extra) : // Set width or height on the element
                    jQuery.style(elem, type, value, extra);
                }, type, chainable ? margin : void 0, chainable);
            };
        });
    }), jQuery.each([
        "ajaxStart",
        "ajaxStop",
        "ajaxComplete",
        "ajaxError",
        "ajaxSuccess",
        "ajaxSend"
    ], function(_i, type) {
        jQuery.fn[type] = function(fn) {
            return this.on(type, fn);
        };
    }), jQuery.fn.extend({
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
        hover: function(fnOver, fnOut) {
            return this.mouseenter(fnOver).mouseleave(fnOut || fnOver);
        }
    }), jQuery.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "), function(_i, name) {
        // Handle event binding
        jQuery.fn[name] = function(data, fn) {
            return arguments.length > 0 ? this.on(name, null, data, fn) : this.trigger(name);
        };
    });
    // Support: Android <=4.0 only
    // Make sure we trim BOM and NBSP
    var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
    // Bind a function to a context, optionally partially applying any
    // arguments.
    // jQuery.proxy is deprecated to promote standards (specifically Function#bind)
    // However, it is not slated for removal any time soon
    jQuery.proxy = function(fn, context) {
        var tmp, args, proxy;
        // Quick check to determine if target is callable, in the spec
        // this throws a TypeError, but we will just return undefined.
        if ("string" == typeof context && (tmp = fn[context], context = fn, fn = tmp), isFunction(fn)) return(// Simulated bind
        args = slice.call(arguments, 2), // Set the guid of unique handler to the same of original handler, so it can be removed
        (proxy = function() {
            return fn.apply(context || this, args.concat(slice.call(arguments)));
        }).guid = fn.guid = fn.guid || jQuery.guid++, proxy);
    }, jQuery.holdReady = function(hold) {
        hold ? jQuery.readyWait++ : jQuery.ready(!0);
    }, jQuery.isArray = Array.isArray, jQuery.parseJSON = JSON.parse, jQuery.nodeName = nodeName, jQuery.isFunction = isFunction, jQuery.isWindow = isWindow, jQuery.camelCase = camelCase, jQuery.type = toType, jQuery.now = Date.now, jQuery.isNumeric = function(obj) {
        // As of jQuery 3.0, isNumeric is limited to
        // strings and numbers (primitives or objects)
        // that can be coerced to finite numbers (gh-2662)
        var type = jQuery.type(obj);
        return ("number" === type || "string" === type) && // parseFloat NaNs numeric-cast false positives ("")
        // ...but misinterprets leading-number strings, particularly hex literals ("0x...")
        // subtraction forces infinities to NaN
        !isNaN(obj - parseFloat(obj));
    }, jQuery.trim = function(text) {
        return null == text ? "" : (text + "").replace(rtrim, "");
    }, "function" == typeof define && define.amd && define("jquery", [], function() {
        return jQuery;
    });
    var // Map over jQuery in case of overwrite
    _jQuery = window1.jQuery, // Map over the $ in case of overwrite
    _$ = window1.$;
    return jQuery.noConflict = function(deep) {
        return window1.$ === jQuery && (window1.$ = _$), deep && window1.jQuery === jQuery && (window1.jQuery = _jQuery), jQuery;
    }, void 0 === noGlobal && (window1.jQuery = window1.$ = jQuery), jQuery;
});
