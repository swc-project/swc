import { _, l as l$1, v as v$1, d as d$1, A as A$2, a as l$2, B as B$1, s as style, m as m$1 } from "../index.f66dda46.js";
function C(n, t) {
    for(var e in n)if ("__source" !== e && !(e in t)) return !0;
    for(var r in t)if ("__source" !== r && n[r] !== t[r]) return !0;
    return !1;
}
function E(n) {
    this.props = n;
}
(E.prototype = new _()).isPureReactComponent = !0, E.prototype.shouldComponentUpdate = function(n, t) {
    return C(this.props, n) || C(this.state, t);
};
var arr, arr1, _CALENDAR_TYPE_LOCALE, w$1 = l$1.__b;
l$1.__b = function(n) {
    n.type && n.type.__f && n.ref && (n.props.ref = n.ref, n.ref = null), w$1 && w$1(n);
}, "u" > typeof Symbol && Symbol.for && Symbol.for("react.forward_ref");
var A$1 = l$1.__e;
l$1.__e = function(n, t, e) {
    if (n.then) {
        for(var r, u = t; u = u.__;)if ((r = u.__c) && r.__c) return null == t.__e && (t.__e = e.__e, t.__k = e.__k), r.__c(n, t);
    }
    A$1(n, t, e);
};
var O = l$1.unmount;
function L() {
    this.__u = 0, this.t = null, this.__b = null;
}
function U(n) {
    var t = n.__.__c;
    return t && t.__e && t.__e(n);
}
function M() {
    this.u = null, this.o = null;
}
l$1.unmount = function(n) {
    var t = n.__c;
    t && t.__R && t.__R(), t && !0 === n.__h && (n.type = null), O && O(n);
}, (L.prototype = new _()).__c = function(n, t) {
    var e = t.__c, r = this;
    null == r.t && (r.t = []), r.t.push(e);
    var u = U(r.__v), o = !1, i = function() {
        o || (o = !0, e.__R = null, u ? u(l) : l());
    };
    e.__R = i;
    var l = function() {
        if (!--r.__u) {
            if (r.state.__e) {
                var t, n = r.state.__e;
                r.__v.__k[0] = function n(t, e, r) {
                    return t && (t.__v = null, t.__k = t.__k && t.__k.map(function(t) {
                        return n(t, e, r);
                    }), t.__c && t.__c.__P === e && (t.__e && r.insertBefore(t.__e, t.__d), t.__c.__e = !0, t.__c.__P = r)), t;
                }(n, n.__c.__P, n.__c.__O);
            }
            for(r.setState({
                __e: r.__b = null
            }); t = r.t.pop();)t.forceUpdate();
        }
    }, f = !0 === t.__h;
    r.__u++ || f || r.setState({
        __e: r.__b = r.__v.__k[0]
    }), n.then(i, i);
}, L.prototype.componentWillUnmount = function() {
    this.t = [];
}, L.prototype.render = function(n, t) {
    if (this.__b) {
        if (this.__v.__k) {
            var e = document.createElement("div"), r = this.__v.__k[0].__c;
            this.__v.__k[0] = function n(t, e, r) {
                return t && (t.__c && t.__c.__H && (t.__c.__H.__.forEach(function(n) {
                    "function" == typeof n.__c && n.__c();
                }), t.__c.__H = null), null != (t = function(n, t) {
                    for(var e in t)n[e] = t[e];
                    return n;
                }({}, t)).__c && (t.__c.__P === r && (t.__c.__P = e), t.__c = null), t.__k = t.__k && t.__k.map(function(t) {
                    return n(t, e, r);
                })), t;
            }(this.__b, e, r.__O = r.__P);
        }
        this.__b = null;
    }
    var u = t.__e && v$1(d$1, null, n.fallback);
    return u && (u.__h = null), [
        v$1(d$1, null, t.__e ? null : n.children),
        u
    ];
};
var T = function(n, t, e) {
    if (++e[1] === e[0] && n.o.delete(t), n.props.revealOrder && ("t" !== n.props.revealOrder[0] || !n.o.size)) for(e = n.u; e;){
        for(; e.length > 3;)e.pop()();
        if (e[1] < e[0]) break;
        n.u = e = e[2];
    }
};
(M.prototype = new _()).__e = function(n) {
    var t = this, e = U(t.__v), r = t.o.get(n);
    return r[0]++, function(u) {
        var o = function() {
            t.props.revealOrder ? (r.push(u), T(t, n, r)) : u();
        };
        e ? e(o) : o();
    };
}, M.prototype.render = function(n) {
    this.u = null, this.o = new Map();
    var t = A$2(n.children);
    n.revealOrder && "b" === n.revealOrder[0] && t.reverse();
    for(var e = t.length; e--;)this.o.set(t[e], this.u = [
        1,
        0,
        this.u
    ]);
    return n.children;
}, M.prototype.componentDidUpdate = M.prototype.componentDidMount = function() {
    var n = this;
    this.o.forEach(function(t, e) {
        T(n, e, t);
    });
};
var j = "u" > typeof Symbol && Symbol.for && Symbol.for("react.element") || 60103, P = /^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|fill|flood|font|glyph(?!R)|horiz|marker(?!H|W|U)|overline|paint|stop|strikethrough|stroke|text(?!L)|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/;
_.prototype.isReactComponent = {}, [
    "componentWillMount",
    "componentWillReceiveProps",
    "componentWillUpdate"
].forEach(function(n) {
    Object.defineProperty(_.prototype, n, {
        configurable: !0,
        get: function() {
            return this["UNSAFE_" + n];
        },
        set: function(t) {
            Object.defineProperty(this, n, {
                configurable: !0,
                writable: !0,
                value: t
            });
        }
    });
});
var H = l$1.event;
function Z() {}
function Y() {
    return this.cancelBubble;
}
function $() {
    return this.defaultPrevented;
}
l$1.event = function(n) {
    return H && (n = H(n)), n.persist = Z, n.isPropagationStopped = Y, n.isDefaultPrevented = $, n.nativeEvent = n;
};
var G = {
    configurable: !0,
    get: function() {
        return this.class;
    }
}, J = l$1.vnode;
l$1.vnode = function(n) {
    var t = n.type, e = n.props, r = e;
    if ("string" == typeof t) {
        for(var u in r = {}, e){
            var n1, o = e[u];
            "value" === u && "defaultValue" in e && null == o || ("defaultValue" === u && "value" in e && null == e.value ? u = "value" : "download" === u && !0 === o ? o = "" : /ondoubleclick/i.test(u) ? u = "ondblclick" : /^onchange(textarea|input)/i.test(u + t) && (n1 = e.type, !("u" > typeof Symbol && "symbol" == typeof Symbol() ? /fil|che|rad/i : /fil|che|ra/i).test(n1)) ? u = "oninput" : /^on(Ani|Tra|Tou|BeforeInp)/.test(u) ? u = u.toLowerCase() : P.test(u) ? u = u.replace(/[A-Z0-9]/, "-$&").toLowerCase() : null === o && (o = void 0), r[u] = o);
        }
        "select" == t && r.multiple && Array.isArray(r.value) && (r.value = A$2(e.children).forEach(function(n) {
            n.props.selected = -1 != r.value.indexOf(n.props.value);
        })), "select" == t && null != r.defaultValue && (r.value = A$2(e.children).forEach(function(n) {
            n.props.selected = r.multiple ? -1 != r.defaultValue.indexOf(n.props.value) : r.defaultValue == n.props.value;
        })), n.props = r;
    }
    t && e.class != e.className && (G.enumerable = "className" in e, null != e.className && (r.class = e.className), Object.defineProperty(r, "className", G)), n.$$typeof = j, J && J(n);
};
var K = l$1.__r;
l$1.__r = function(n) {
    K && K(n), n.__c;
};
var module$7_exports = {}, b = "function" == typeof Symbol && Symbol.for, c = b ? Symbol.for("react.element") : 60103, d = b ? Symbol.for("react.portal") : 60106, e = b ? Symbol.for("react.fragment") : 60107, f = b ? Symbol.for("react.strict_mode") : 60108, g = b ? Symbol.for("react.profiler") : 60114, h = b ? Symbol.for("react.provider") : 60109, k = b ? Symbol.for("react.context") : 60110, l = b ? Symbol.for("react.async_mode") : 60111, m = b ? Symbol.for("react.concurrent_mode") : 60111, n = b ? Symbol.for("react.forward_ref") : 60112, p = b ? Symbol.for("react.suspense") : 60113, q = b ? Symbol.for("react.suspense_list") : 60120, r = b ? Symbol.for("react.memo") : 60115, t = b ? Symbol.for("react.lazy") : 60116, v = b ? Symbol.for("react.block") : 60121, w = b ? Symbol.for("react.fundamental") : 60117, x = b ? Symbol.for("react.responder") : 60118, y = b ? Symbol.for("react.scope") : 60119;
function z(a) {
    if ("object" == typeof a && null !== a) {
        var u = a.$$typeof;
        switch(u){
            case c:
                switch(a = a.type){
                    case l:
                    case m:
                    case e:
                    case g:
                    case f:
                    case p:
                        return a;
                    default:
                        switch(a = a && a.$$typeof){
                            case k:
                            case n:
                            case t:
                            case r:
                            case h:
                                return a;
                            default:
                                return u;
                        }
                }
            case d:
                return u;
        }
    }
}
function A(a) {
    return z(a) === m;
}
module$7_exports.AsyncMode = l, module$7_exports.ConcurrentMode = m, module$7_exports.ContextConsumer = k, module$7_exports.ContextProvider = h, module$7_exports.Element = c, module$7_exports.ForwardRef = n, module$7_exports.Fragment = e, module$7_exports.Lazy = t, module$7_exports.Memo = r, module$7_exports.Portal = d, module$7_exports.Profiler = g, module$7_exports.StrictMode = f, module$7_exports.Suspense = p, module$7_exports.isAsyncMode = function(a) {
    return A(a) || z(a) === l;
}, module$7_exports.isConcurrentMode = A, module$7_exports.isContextConsumer = function(a) {
    return z(a) === k;
}, module$7_exports.isContextProvider = function(a) {
    return z(a) === h;
}, module$7_exports.isElement = function(a) {
    return "object" == typeof a && null !== a && a.$$typeof === c;
}, module$7_exports.isForwardRef = function(a) {
    return z(a) === n;
}, module$7_exports.isFragment = function(a) {
    return z(a) === e;
}, module$7_exports.isLazy = function(a) {
    return z(a) === t;
}, module$7_exports.isMemo = function(a) {
    return z(a) === r;
}, module$7_exports.isPortal = function(a) {
    return z(a) === d;
}, module$7_exports.isProfiler = function(a) {
    return z(a) === g;
}, module$7_exports.isStrictMode = function(a) {
    return z(a) === f;
}, module$7_exports.isSuspense = function(a) {
    return z(a) === p;
}, module$7_exports.isValidElementType = function(a) {
    return "string" == typeof a || "function" == typeof a || a === e || a === m || a === g || a === f || a === p || a === q || "object" == typeof a && null !== a && (a.$$typeof === t || a.$$typeof === r || a.$$typeof === h || a.$$typeof === k || a.$$typeof === n || a.$$typeof === w || a.$$typeof === x || a.$$typeof === y || a.$$typeof === v);
}, module$7_exports.typeOf = z;
let $cjs$_cjs_react_is_production_min_js = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    default: module$7_exports
});
var module$6 = {
    exports: {}
};
module$6.exports = function(m, i) {
    for(i in m)if ("default" != i) return m;
    return m.default || m;
}($cjs$_cjs_react_is_production_min_js);
let $cjs$react_is = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    default: module$6.exports
});
var module$5 = {
    exports: {}
}, getOwnPropertySymbols = Object.getOwnPropertySymbols, hasOwnProperty = Object.prototype.hasOwnProperty, propIsEnumerable = Object.prototype.propertyIsEnumerable;
module$5.exports = !function() {
    try {
        if (!Object.assign) return !1;
        // Detect buggy property enumeration order in older V8 versions.
        // https://bugs.chromium.org/p/v8/issues/detail?id=4118
        var test1 = new String("abc");
        if (test1[5] = "de", "5" === Object.getOwnPropertyNames(test1)[0]) return !1;
        for(var test2 = {}, i = 0; i < 10; i++)test2["_" + String.fromCharCode(i)] = i;
        // https://bugs.chromium.org/p/v8/issues/detail?id=3056
        var order2 = Object.getOwnPropertyNames(test2).map(function(n) {
            return test2[n];
        });
        if ("0123456789" !== order2.join("")) return !1;
        // https://bugs.chromium.org/p/v8/issues/detail?id=3056
        var test3 = {};
        if ("abcdefghijklmnopqrst".split("").forEach(function(letter) {
            test3[letter] = letter;
        }), "abcdefghijklmnopqrst" !== Object.keys(Object.assign({}, test3)).join("")) return !1;
        return !0;
    } catch (err) {
        // We don't expect any of the above to throw, but better to be safe.
        return !1;
    }
}() ? function(target, source) {
    for(var from, symbols, to = function(val) {
        if (null == val) throw TypeError("Object.assign cannot be called with null or undefined");
        return Object(val);
    }(target), s = 1; s < arguments.length; s++){
        for(var key in from = Object(arguments[s]))hasOwnProperty.call(from, key) && (to[key] = from[key]);
        if (getOwnPropertySymbols) {
            symbols = getOwnPropertySymbols(from);
            for(var i = 0; i < symbols.length; i++)propIsEnumerable.call(from, symbols[i]) && (to[symbols[i]] = from[symbols[i]]);
        }
    }
    return to;
} : Object.assign;
let $cjs$object_assign = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    default: module$5.exports
});
var module$4 = {
    exports: {}
};
module$4.exports = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
let $cjs$_lib_ReactPropTypesSecret = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    default: module$4.exports
});
var module$3 = {
    exports: {}
};
function checkPropTypes(typeSpecs, values, location, componentName, getStack) {}
checkPropTypes.resetWarningCache = function() {}, module$3.exports = checkPropTypes;
let $cjs$_checkPropTypes = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    default: module$3.exports
});
function $$cjs_default$$$2(m, i) {
    for(i in m)if ("default" != i) return m;
    return m.default || m;
}
$$cjs_default$$$2($cjs$react_is), $$cjs_default$$$2($cjs$object_assign), $$cjs_default$$$2($cjs$_lib_ReactPropTypesSecret), $$cjs_default$$$2($cjs$_checkPropTypes), Function.call.bind(Object.prototype.hasOwnProperty);
var module$2 = {
    exports: {}
}, ReactPropTypesSecret = function(m, i) {
    for(i in m)if ("default" != i) return m;
    return m.default || m;
}($cjs$_lib_ReactPropTypesSecret);
function emptyFunction() {}
function emptyFunctionWithReset() {}
emptyFunctionWithReset.resetWarningCache = emptyFunction, module$2.exports = function() {
    function shim(props, propName, componentName, location, propFullName, secret) {
        if (secret !== ReactPropTypesSecret) {
            var err = Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");
            throw err.name = "Invariant Violation", err;
        }
    }
    function getShim() {
        return shim;
    } // Important!
    shim.isRequired = shim;
    // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
    var ReactPropTypes = {
        array: shim,
        bool: shim,
        func: shim,
        number: shim,
        object: shim,
        string: shim,
        symbol: shim,
        any: shim,
        arrayOf: getShim,
        element: shim,
        elementType: shim,
        instanceOf: getShim,
        node: shim,
        objectOf: getShim,
        oneOf: getShim,
        oneOfType: getShim,
        shape: getShim,
        exact: getShim,
        checkPropTypes: emptyFunctionWithReset,
        resetWarningCache: emptyFunction
    };
    return ReactPropTypes.PropTypes = ReactPropTypes, ReactPropTypes;
};
let $cjs$_factoryWithThrowingShims = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    default: module$2.exports
});
var module$1 = {
    exports: {}
};
// By explicitly using `prop-types` you are opting into new production behavior.
// http://fb.me/prop-types-in-prod
module$1.exports = (function(m, i) {
    for(i in m)if ("default" != i) return m;
    return m.default || m;
})($cjs$_factoryWithThrowingShims)();
let PropTypes = module$1.exports;
function mergeClassNames() {
    return Array.prototype.slice.call(arguments).reduce(function(classList, arg) {
        return "string" == typeof arg || Array.isArray(arg) ? classList.concat(arg) : classList;
    }, []).filter(Boolean).join(" ");
}
var module = {
    exports: {}
}, INFINITY = 1 / 0, NAN = 0 / 0, reTrim = /^\s+|\s+$/g, reIsBadHex = /^[-+]0x[0-9a-f]+$/i, reIsBinary = /^0b[01]+$/i, reIsOctal = /^0o[0-7]+$/i, freeParseInt = parseInt, objectToString = Object.prototype.toString;
function isObject(value) {
    var type = typeof value;
    return !!value && ("object" == type || "function" == type);
}
module.exports = function(func) {
    var value, result, remainder, result1, n = 2, func1 = func;
    if ("function" != typeof func1) throw TypeError("Expected a function");
    return remainder = (result = (value = n) ? (value = function(value) {
        if ("number" == typeof value) return value;
        if ("symbol" == typeof (value1 = value) || value1 && "object" == typeof value1 && "[object Symbol]" == objectToString.call(value1)) return NAN;
        if (isObject(value)) {
            var value1, other = "function" == typeof value.valueOf ? value.valueOf() : value;
            value = isObject(other) ? other + "" : other;
        }
        if ("string" != typeof value) return 0 === value ? value : +value;
        value = value.replace(reTrim, "");
        var isBinary = reIsBinary.test(value);
        return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
    }(value)) === INFINITY || value === -INFINITY ? (value < 0 ? -1 : 1) * 1.7976931348623157e308 : value == value ? value : 0 : 0 === value ? value : 0) % 1, n = result == result ? remainder ? result - remainder : result : 0, function() {
        return --n > 0 && (result1 = func1.apply(this, arguments)), n <= 1 && (func1 = void 0), result1;
    };
};
let once$1 = module.exports;
var getUserLocales = once$1(function() {
    var languageList = [];
    return "u" > typeof window && (window.navigator.languages && (languageList = languageList.concat(window.navigator.languages)), window.navigator.language && languageList.push(window.navigator.language), window.navigator.userLanguage && languageList.push(window.navigator.userLanguage), window.navigator.browserLanguage && languageList.push(window.navigator.browserLanguage), window.navigator.systemLanguage && languageList.push(window.navigator.systemLanguage)), languageList.push("en-US"), languageList.filter(function(el, index, self) {
        return self.indexOf(el) === index;
    }).map(function(el) {
        if (!el || -1 === el.indexOf("-") || el.toLowerCase() !== el) return el;
        var splitEl = el.split("-");
        return "".concat(splitEl[0], "-").concat(splitEl[1].toUpperCase());
    });
}), getUserLocale = once$1(function() {
    return getUserLocales()[0];
});
/**
 * Utils
 */ function makeGetEdgeOfNeighbor(getPeriod, getEdgeOfPeriod, defaultOffset) {
    return function(date) {
        var offset = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : defaultOffset;
        return getEdgeOfPeriod(getPeriod(date) + offset);
    };
}
function makeGetEnd(getBeginOfNextPeriod) {
    return function(date) {
        return new Date(getBeginOfNextPeriod(date).getTime() - 1);
    };
}
function makeGetRange(functions) {
    return function(date) {
        return functions.map(function(fn) {
            return fn(date);
        });
    };
}
/**
 * Simple getters - getting a property of a given point in time
 */ /**
 * Gets year from date.
 *
 * @param {Date|number|string} date Date to get year from.
 */ function getYear(date) {
    if (date instanceof Date) return date.getFullYear();
    if ("number" == typeof date) return date;
    var year = parseInt(date, 10);
    if ("string" == typeof date && !isNaN(year)) return year;
    throw Error("Failed to get year from date: ".concat(date, "."));
}
/**
 * Gets month from date.
 *
 * @param {Date} date Date to get month from.
 */ function getMonth(date) {
    if (date instanceof Date) return date.getMonth();
    throw Error("Failed to get month from date: ".concat(date, "."));
}
/**
 * Gets human-readable day of the month from date.
 *
 * @param {Date} date Date to get day of the month from.
 */ function getDate(date) {
    if (date instanceof Date) return date.getDate();
    throw Error("Failed to get year from date: ".concat(date, "."));
}
/**
 * Century
 */ function getCenturyStart(date) {
    var year = getYear(date), centuryStartDate = new Date();
    return centuryStartDate.setFullYear(year + (-year + 1) % 100, 0, 1), centuryStartDate.setHours(0, 0, 0, 0), centuryStartDate;
}
var getPreviousCenturyStart = makeGetEdgeOfNeighbor(getYear, getCenturyStart, -100), getNextCenturyStart = makeGetEdgeOfNeighbor(getYear, getCenturyStart, 100), getCenturyEnd = makeGetEnd(getNextCenturyStart), getPreviousCenturyEnd = makeGetEdgeOfNeighbor(getYear, getCenturyEnd, -100), getCenturyRange = makeGetRange([
    getCenturyStart,
    getCenturyEnd
]);
/**
 * Decade
 */ function getDecadeStart(date) {
    var year = getYear(date), decadeStartDate = new Date();
    return decadeStartDate.setFullYear(year + (-year + 1) % 10, 0, 1), decadeStartDate.setHours(0, 0, 0, 0), decadeStartDate;
}
var getPreviousDecadeStart = makeGetEdgeOfNeighbor(getYear, getDecadeStart, -10), getNextDecadeStart = makeGetEdgeOfNeighbor(getYear, getDecadeStart, 10), getDecadeEnd = makeGetEnd(getNextDecadeStart), getPreviousDecadeEnd = makeGetEdgeOfNeighbor(getYear, getDecadeEnd, -10), getDecadeRange = makeGetRange([
    getDecadeStart,
    getDecadeEnd
]);
/**
 * Year
 */ function getYearStart(date) {
    var year = getYear(date), yearStartDate = new Date();
    return yearStartDate.setFullYear(year, 0, 1), yearStartDate.setHours(0, 0, 0, 0), yearStartDate;
}
var getPreviousYearStart = makeGetEdgeOfNeighbor(getYear, getYearStart, -1), getNextYearStart = makeGetEdgeOfNeighbor(getYear, getYearStart, 1), getYearEnd = makeGetEnd(getNextYearStart), getPreviousYearEnd = makeGetEdgeOfNeighbor(getYear, getYearEnd, -1), getYearRange = makeGetRange([
    getYearStart,
    getYearEnd
]);
/**
 * Month
 */ function makeGetEdgeOfNeighborMonth(getEdgeOfPeriod, defaultOffset) {
    return function(date) {
        var offset = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : defaultOffset, year = getYear(date), month = getMonth(date) + offset, previousPeriod = new Date();
        return previousPeriod.setFullYear(year, month, 1), previousPeriod.setHours(0, 0, 0, 0), getEdgeOfPeriod(previousPeriod);
    };
}
function getMonthStart(date) {
    var year = getYear(date), month = getMonth(date), monthStartDate = new Date();
    return monthStartDate.setFullYear(year, month, 1), monthStartDate.setHours(0, 0, 0, 0), monthStartDate;
}
var getPreviousMonthStart = makeGetEdgeOfNeighborMonth(getMonthStart, -1), getNextMonthStart = makeGetEdgeOfNeighborMonth(getMonthStart, 1), getMonthEnd = makeGetEnd(getNextMonthStart), getPreviousMonthEnd = makeGetEdgeOfNeighborMonth(getMonthEnd, -1), getMonthRange = makeGetRange([
    getMonthStart,
    getMonthEnd
]);
function getDayStart(date) {
    var year = getYear(date), month = getMonth(date), day = getDate(date), dayStartDate = new Date();
    return dayStartDate.setFullYear(year, month, day), dayStartDate.setHours(0, 0, 0, 0), dayStartDate;
}
var getDayEnd = makeGetEnd(function(date) {
    var offset = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 1, year = getYear(date), month = getMonth(date), day = getDate(date) + offset, previousPeriod = new Date();
    return previousPeriod.setFullYear(year, month, day), previousPeriod.setHours(0, 0, 0, 0), getDayStart(previousPeriod);
}), getDayRange = makeGetRange([
    getDayStart,
    getDayEnd
]);
function _arrayLikeToArray$2(arr, len) {
    (null == len || len > arr.length) && (len = arr.length);
    for(var i = 0, arr2 = Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _defineProperty$c(obj, key, value) {
    return key in obj ? Object.defineProperty(obj, key, {
        value: value,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : obj[key] = value, obj;
}
var CALENDAR_TYPES = {
    ARABIC: "Arabic",
    HEBREW: "Hebrew",
    ISO_8601: "ISO 8601",
    US: "US"
}, CALENDAR_TYPE_LOCALES = (_defineProperty$c(_CALENDAR_TYPE_LOCALE = {}, CALENDAR_TYPES.US, [
    "en-CA",
    "en-US",
    "es-AR",
    "es-BO",
    "es-CL",
    "es-CO",
    "es-CR",
    "es-DO",
    "es-EC",
    "es-GT",
    "es-HN",
    "es-MX",
    "es-NI",
    "es-PA",
    "es-PE",
    "es-PR",
    "es-SV",
    "es-VE",
    "pt-BR"
]), _defineProperty$c(_CALENDAR_TYPE_LOCALE, CALENDAR_TYPES.ARABIC, [
    // ar-LB, ar-MA intentionally missing
    "ar",
    "ar-AE",
    "ar-BH",
    "ar-DZ",
    "ar-EG",
    "ar-IQ",
    "ar-JO",
    "ar-KW",
    "ar-LY",
    "ar-OM",
    "ar-QA",
    "ar-SA",
    "ar-SD",
    "ar-SY",
    "ar-YE",
    "dv",
    "dv-MV",
    "ps",
    "ps-AR"
]), _defineProperty$c(_CALENDAR_TYPE_LOCALE, CALENDAR_TYPES.HEBREW, [
    "he",
    "he-IL"
]), _CALENDAR_TYPE_LOCALE), WEEKDAYS = ((function(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray$2(arr);
})(arr = Array(7)) || function(iter) {
    if ("u" > typeof Symbol && Symbol.iterator in Object(iter)) return Array.from(iter);
}(arr) || function(o) {
    if (o) {
        if ("string" == typeof o) return _arrayLikeToArray$2(o, void 0);
        var n = Object.prototype.toString.call(o).slice(8, -1);
        if ("Object" === n && o.constructor && (n = o.constructor.name), "Map" === n || "Set" === n) return Array.from(o);
        if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$2(o, void 0);
    }
}(arr) || function() {
    throw TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}()).map(function(el, index) {
    return index;
});
function getSafeFormatter(options) {
    return function(locale, date) {
        return new Date(new Date(date).setHours(12)).toLocaleString(locale || getUserLocale(), options);
    };
}
var formatDay = getSafeFormatter({
    day: "numeric"
}), formatLongDate = getSafeFormatter({
    day: "numeric",
    month: "long",
    year: "numeric"
}), formatMonth = getSafeFormatter({
    month: "long"
}), formatMonthYear = getSafeFormatter({
    month: "long",
    year: "numeric"
}), formatShortWeekday = getSafeFormatter({
    weekday: "short"
}), formatWeekday = getSafeFormatter({
    weekday: "long"
}), formatYear = getSafeFormatter({
    year: "numeric"
}), SUNDAY = WEEKDAYS[0], FRIDAY = WEEKDAYS[5], SATURDAY = WEEKDAYS[6];
/* Simple getters - getting a property of a given point in time */ function getDayOfWeek(date) {
    var calendarType = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : CALENDAR_TYPES.ISO_8601, weekday = date.getDay();
    switch(calendarType){
        case CALENDAR_TYPES.ISO_8601:
            // Shifts days of the week so that Monday is 0, Sunday is 6
            return (weekday + 6) % 7;
        case CALENDAR_TYPES.ARABIC:
            return (weekday + 1) % 7;
        case CALENDAR_TYPES.HEBREW:
        case CALENDAR_TYPES.US:
            return weekday;
        default:
            throw Error("Unsupported calendar type.");
    }
}
/**
 * Week
 */ /**
 * Returns the beginning of a given week.
 *
 * @param {Date} date Date.
 * @param {string} calendarType Calendar type. Can be ISO 8601 or US.
 */ function getBeginOfWeek(date) {
    var calendarType = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : CALENDAR_TYPES.ISO_8601;
    return new Date(getYear(date), getMonth(date), date.getDate() - getDayOfWeek(date, calendarType));
}
/**
 * Others
 */ /**
 * Returns the beginning of a given range.
 *
 * @param {string} rangeType Range type (e.g. 'day')
 * @param {Date} date Date.
 */ function getBegin(rangeType, date) {
    switch(rangeType){
        case "century":
            return getCenturyStart(date);
        case "decade":
            return getDecadeStart(date);
        case "year":
            return getYearStart(date);
        case "month":
            return getMonthStart(date);
        case "day":
            return getDayStart(date);
        default:
            throw Error("Invalid rangeType: ".concat(rangeType));
    }
}
function getBeginNext(rangeType, date) {
    switch(rangeType){
        case "century":
            return getNextCenturyStart(date);
        case "decade":
            return getNextDecadeStart(date);
        case "year":
            return getNextYearStart(date);
        case "month":
            return getNextMonthStart(date);
        default:
            throw Error("Invalid rangeType: ".concat(rangeType));
    }
}
var getBeginPrevious2 = function(rangeType, date) {
    switch(rangeType){
        case "decade":
            return getPreviousDecadeStart(date, -100);
        case "year":
            return getPreviousYearStart(date, -10);
        case "month":
            return getPreviousMonthStart(date, -12);
        default:
            throw Error("Invalid rangeType: ".concat(rangeType));
    }
}, getBeginNext2 = function(rangeType, date) {
    switch(rangeType){
        case "decade":
            return getNextDecadeStart(date, 100);
        case "year":
            return getNextYearStart(date, 10);
        case "month":
            return getNextMonthStart(date, 12);
        default:
            throw Error("Invalid rangeType: ".concat(rangeType));
    }
};
/**
 * Returns the end of a given range.
 *
 * @param {string} rangeType Range type (e.g. 'day')
 * @param {Date} date Date.
 */ function getEnd(rangeType, date) {
    switch(rangeType){
        case "century":
            return getCenturyEnd(date);
        case "decade":
            return getDecadeEnd(date);
        case "year":
            return getYearEnd(date);
        case "month":
            return getMonthEnd(date);
        case "day":
            return getDayEnd(date);
        default:
            throw Error("Invalid rangeType: ".concat(rangeType));
    }
}
var getEndPrevious2 = function(rangeType, date) {
    switch(rangeType){
        case "decade":
            return getPreviousDecadeEnd(date, -100);
        case "year":
            return getPreviousYearEnd(date, -10);
        case "month":
            return getPreviousMonthEnd(date, -12);
        default:
            throw Error("Invalid rangeType: ".concat(rangeType));
    }
};
/**
 * Returns an array with the beginning and the end of a given range.
 *
 * @param {string} rangeType Range type (e.g. 'day')
 * @param {Date} date Date.
 */ function getRange(rangeType, date) {
    switch(rangeType){
        case "century":
            return getCenturyRange(date);
        case "decade":
            return getDecadeRange(date);
        case "year":
            return getYearRange(date);
        case "month":
            return getMonthRange(date);
        case "day":
            return getDayRange(date);
        default:
            throw Error("Invalid rangeType: ".concat(rangeType));
    }
}
function toYearLabel(locale) {
    var formatYear$1 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : formatYear, dates = arguments.length > 2 ? arguments[2] : void 0;
    return dates.map(function(date) {
        return formatYear$1(locale, date);
    }).join(" – ");
}
function _typeof$2(obj) {
    return (_typeof$2 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
        return typeof obj;
    } : function(obj) {
        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    })(obj);
}
var calendarTypes = Object.values(CALENDAR_TYPES), allViews$1 = [
    "century",
    "decade",
    "year",
    "month"
], isCalendarType = PropTypes.oneOf(calendarTypes), isClassName = PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
]), isMinDate = function(props, propName, componentName) {
    var minDate = props[propName];
    if (!minDate) return null;
    if (!(minDate instanceof Date)) return Error("Invalid prop `".concat(propName, "` of type `").concat(_typeof$2(minDate), "` supplied to `").concat(componentName, "`, expected instance of `Date`."));
    var maxDate = props.maxDate;
    return maxDate && minDate > maxDate ? Error("Invalid prop `".concat(propName, "` of type `").concat(_typeof$2(minDate), "` supplied to `").concat(componentName, "`, minDate cannot be larger than maxDate.")) : null;
}, isMaxDate = function(props, propName, componentName) {
    var maxDate = props[propName];
    if (!maxDate) return null;
    if (!(maxDate instanceof Date)) return Error("Invalid prop `".concat(propName, "` of type `").concat(_typeof$2(maxDate), "` supplied to `").concat(componentName, "`, expected instance of `Date`."));
    var minDate = props.minDate;
    return minDate && maxDate < minDate ? Error("Invalid prop `".concat(propName, "` of type `").concat(_typeof$2(maxDate), "` supplied to `").concat(componentName, "`, maxDate cannot be smaller than minDate.")) : null;
}, isRef = PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
        current: PropTypes.any
    })
]), isValue = PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.arrayOf(PropTypes.instanceOf(Date))
]), isViews = PropTypes.arrayOf(PropTypes.oneOf(allViews$1)), isView = function(props, propName, componentName) {
    var view = props[propName], allowedViews = props.views || allViews$1;
    return void 0 !== view && -1 === allowedViews.indexOf(view) ? Error("Invalid prop `".concat(propName, "` of value `").concat(view, "` supplied to `").concat(componentName, "`, expected one of [").concat(allowedViews.map(function(a) {
        return '"'.concat(a, '"');
    }).join(", "), "].")) : null // Everything is fine
    ;
};
isView.isRequired = function(props, propName, componentName) {
    var view = props[propName];
    return view ? isView(props, propName, componentName) : Error("The prop `".concat(propName, "` is marked as required in `").concat(componentName, "`, but its value is `").concat(view, "`."));
};
var tileGroupProps = {
    activeStartDate: PropTypes.instanceOf(Date).isRequired,
    hover: PropTypes.instanceOf(Date),
    locale: PropTypes.string,
    maxDate: isMaxDate,
    minDate: isMinDate,
    onClick: PropTypes.func,
    onMouseOver: PropTypes.func,
    tileClassName: PropTypes.oneOfType([
        PropTypes.func,
        isClassName
    ]),
    tileContent: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.node
    ]),
    value: isValue,
    valueType: PropTypes.string
}, tileProps = {
    activeStartDate: PropTypes.instanceOf(Date).isRequired,
    classes: PropTypes.arrayOf(PropTypes.string).isRequired,
    date: PropTypes.instanceOf(Date).isRequired,
    locale: PropTypes.string,
    maxDate: isMaxDate,
    minDate: isMinDate,
    onClick: PropTypes.func,
    onMouseOver: PropTypes.func,
    style: PropTypes.objectOf(PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ])),
    tileClassName: PropTypes.oneOfType([
        PropTypes.func,
        isClassName
    ]),
    tileContent: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.node
    ]),
    tileDisabled: PropTypes.func
}, className$5 = "react-calendar__navigation";
function Navigation(_ref) {
    var labelClassName, activeStartDate = _ref.activeStartDate, drillUp = _ref.drillUp, _ref$formatMonthYear = _ref.formatMonthYear, formatMonthYear$1 = void 0 === _ref$formatMonthYear ? formatMonthYear : _ref$formatMonthYear, _ref$formatYear = _ref.formatYear, formatYear$1 = void 0 === _ref$formatYear ? formatYear : _ref$formatYear, locale = _ref.locale, maxDate = _ref.maxDate, minDate = _ref.minDate, _ref$navigationAriaLa = _ref.navigationAriaLabel, navigationLabel = _ref.navigationLabel, _ref$next2AriaLabel = _ref.next2AriaLabel, _ref$next2Label = _ref.next2Label, next2Label = void 0 === _ref$next2Label ? "»" : _ref$next2Label, _ref$nextAriaLabel = _ref.nextAriaLabel, _ref$nextLabel = _ref.nextLabel, nextLabel = void 0 === _ref$nextLabel ? "›" : _ref$nextLabel, _ref$prev2AriaLabel = _ref.prev2AriaLabel, _ref$prev2Label = _ref.prev2Label, prev2Label = void 0 === _ref$prev2Label ? "«" : _ref$prev2Label, _ref$prevAriaLabel = _ref.prevAriaLabel, _ref$prevLabel = _ref.prevLabel, prevLabel = void 0 === _ref$prevLabel ? "‹" : _ref$prevLabel, setActiveStartDate = _ref.setActiveStartDate, showDoubleView = _ref.showDoubleView, view = _ref.view, drillUpAvailable = _ref.views.indexOf(view) > 0, shouldShowPrevNext2Buttons = "century" !== view, previousActiveStartDate = function(rangeType, date) {
        switch(rangeType){
            case "century":
                return getPreviousCenturyStart(date);
            case "decade":
                return getPreviousDecadeStart(date);
            case "year":
                return getPreviousYearStart(date);
            case "month":
                return getPreviousMonthStart(date);
            default:
                throw Error("Invalid rangeType: ".concat(rangeType));
        }
    }(view, activeStartDate), previousActiveStartDate2 = shouldShowPrevNext2Buttons && getBeginPrevious2(view, activeStartDate), nextActiveStartDate = getBeginNext(view, activeStartDate), nextActiveStartDate2 = shouldShowPrevNext2Buttons && getBeginNext2(view, activeStartDate), prevButtonDisabled = function() {
        if (0 > previousActiveStartDate.getFullYear()) return !0;
        var previousActiveEndDate = function(rangeType, date) {
            switch(rangeType){
                case "century":
                    return getPreviousCenturyEnd(date);
                case "decade":
                    return getPreviousDecadeEnd(date);
                case "year":
                    return getPreviousYearEnd(date);
                case "month":
                    return getPreviousMonthEnd(date);
                default:
                    throw Error("Invalid rangeType: ".concat(rangeType));
            }
        }(view, activeStartDate);
        return minDate && minDate >= previousActiveEndDate;
    }(), prev2ButtonDisabled = shouldShowPrevNext2Buttons && function() {
        if (0 > previousActiveStartDate2.getFullYear()) return !0;
        var previousActiveEndDate = getEndPrevious2(view, activeStartDate);
        return minDate && minDate >= previousActiveEndDate;
    }(), nextButtonDisabled = maxDate && maxDate <= nextActiveStartDate, next2ButtonDisabled = shouldShowPrevNext2Buttons && maxDate && maxDate <= nextActiveStartDate2;
    function renderLabel(date) {
        var label = function() {
            switch(view){
                case "century":
                    return toYearLabel(locale, formatYear$1, getCenturyRange(date));
                case "decade":
                    return toYearLabel(locale, formatYear$1, getDecadeRange(date));
                case "year":
                    return formatYear$1(locale, date);
                case "month":
                    return formatMonthYear$1(locale, date);
                default:
                    throw Error("Invalid view: ".concat(view, "."));
            }
        }();
        return navigationLabel ? navigationLabel({
            date: date,
            label: label,
            locale: locale || getUserLocale(),
            view: view
        }) : label;
    }
    return /*#__PURE__*/ v$1("div", {
        className: className$5,
        style: {
            display: "flex"
        }
    }, null !== prev2Label && shouldShowPrevNext2Buttons && /*#__PURE__*/ v$1("button", {
        "aria-label": void 0 === _ref$prev2AriaLabel ? "" : _ref$prev2AriaLabel,
        className: "".concat(className$5, "__arrow ").concat(className$5, "__prev2-button"),
        disabled: prev2ButtonDisabled,
        onClick: function() {
            setActiveStartDate(previousActiveStartDate2);
        },
        type: "button"
    }, prev2Label), null !== prevLabel && /*#__PURE__*/ v$1("button", {
        "aria-label": void 0 === _ref$prevAriaLabel ? "" : _ref$prevAriaLabel,
        className: "".concat(className$5, "__arrow ").concat(className$5, "__prev-button"),
        disabled: prevButtonDisabled,
        onClick: function() {
            setActiveStartDate(previousActiveStartDate);
        },
        type: "button"
    }, prevLabel), v$1("button", {
        "aria-label": void 0 === _ref$navigationAriaLa ? "" : _ref$navigationAriaLa,
        className: labelClassName = "".concat(className$5, "__label"),
        disabled: !drillUpAvailable,
        onClick: drillUp,
        style: {
            flexGrow: 1
        },
        type: "button"
    }, /*#__PURE__*/ v$1("span", {
        className: "".concat(labelClassName, "__labelText ").concat(labelClassName, "__labelText--from")
    }, renderLabel(activeStartDate)), showDoubleView && /*#__PURE__*/ v$1(d$1, null, /*#__PURE__*/ v$1("span", {
        className: "".concat(labelClassName, "__divider")
    }, " ", "\u2013", " "), /*#__PURE__*/ v$1("span", {
        className: "".concat(labelClassName, "__labelText ").concat(labelClassName, "__labelText--to")
    }, renderLabel(nextActiveStartDate)))), null !== nextLabel && /*#__PURE__*/ v$1("button", {
        "aria-label": void 0 === _ref$nextAriaLabel ? "" : _ref$nextAriaLabel,
        className: "".concat(className$5, "__arrow ").concat(className$5, "__next-button"),
        disabled: nextButtonDisabled,
        onClick: function() {
            setActiveStartDate(nextActiveStartDate);
        },
        type: "button"
    }, nextLabel), null !== next2Label && shouldShowPrevNext2Buttons && /*#__PURE__*/ v$1("button", {
        "aria-label": void 0 === _ref$next2AriaLabel ? "" : _ref$next2AriaLabel,
        className: "".concat(className$5, "__arrow ").concat(className$5, "__next2-button"),
        disabled: next2ButtonDisabled,
        onClick: function() {
            setActiveStartDate(nextActiveStartDate2);
        },
        type: "button"
    }, next2Label));
}
function _extends$c() {
    return (_extends$c = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source)Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
    }).apply(this, arguments);
}
function ownKeys$b(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        enumerableOnly && (symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        })), keys.push.apply(keys, symbols);
    }
    return keys;
}
function _objectSpread$b(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = null != arguments[i] ? arguments[i] : {};
        i % 2 ? ownKeys$b(Object(source), !0).forEach(function(key) {
            var value;
            value = source[key], key in target ? Object.defineProperty(target, key, {
                value: value,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : target[key] = value;
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$b(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
function toPercent(num) {
    return "".concat(num, "%");
}
function Flex(_ref) {
    var t, children = _ref.children, className = _ref.className, direction = _ref.direction, count = _ref.count, offset = _ref.offset, style = _ref.style, wrap = _ref.wrap, otherProps = function(source, excluded) {
        if (null == source) return {};
        var key, i, target = function(source, excluded) {
            if (null == source) return {};
            var key, i, target = {}, sourceKeys = Object.keys(source);
            for(i = 0; i < sourceKeys.length; i++)key = sourceKeys[i], excluded.indexOf(key) >= 0 || (target[key] = source[key]);
            return target;
        }(source, excluded);
        if (Object.getOwnPropertySymbols) {
            var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
            for(i = 0; i < sourceSymbolKeys.length; i++)key = sourceSymbolKeys[i], !(excluded.indexOf(key) >= 0) && Object.prototype.propertyIsEnumerable.call(source, key) && (target[key] = source[key]);
        }
        return target;
    }(_ref, [
        "children",
        "className",
        "direction",
        "count",
        "offset",
        "style",
        "wrap"
    ]);
    return /*#__PURE__*/ v$1("div", _extends$c({
        className: className,
        style: _objectSpread$b({
            display: "flex",
            flexDirection: direction,
            flexWrap: wrap ? "wrap" : "no-wrap"
        }, style)
    }, otherProps), (t = function(child, index) {
        return /*#__PURE__*/ function(n) {
            return n && n.$$typeof === j ? B$1.apply(null, arguments) : n;
        }(child, _objectSpread$b(_objectSpread$b({}, child.props), {}, {
            style: {
                flexBasis: toPercent(100 / count),
                maxWidth: toPercent(100 / count),
                overflow: "hidden",
                marginLeft: offset && 0 === index ? toPercent(100 * offset / count) : null
            }
        }));
    }, null == children ? null : A$2(A$2(children).map(t))));
}
function _toConsumableArray$1(arr) {
    return function(arr) {
        if (Array.isArray(arr)) return _arrayLikeToArray$1(arr);
    }(arr) || function(iter) {
        if ("u" > typeof Symbol && Symbol.iterator in Object(iter)) return Array.from(iter);
    }(arr) || function(o) {
        if (o) {
            if ("string" == typeof o) return _arrayLikeToArray$1(o, void 0);
            var n = Object.prototype.toString.call(o).slice(8, -1);
            if ("Object" === n && o.constructor && (n = o.constructor.name), "Map" === n || "Set" === n) return Array.from(o);
            if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, void 0);
        }
    }(arr) || function() {
        throw TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }();
}
function _arrayLikeToArray$1(arr, len) {
    (null == len || len > arr.length) && (len = arr.length);
    for(var i = 0, arr2 = Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function isValueWithinRange(value, range) {
    return range[0] <= value && range[1] >= value;
}
function doRangesOverlap(range1, range2) {
    return isValueWithinRange(range1[0], range2) || isValueWithinRange(range1[1], range2);
}
function getRangeClassNames(valueRange, dateRange, baseClassName) {
    var isRange = doRangesOverlap(dateRange, valueRange), classes = [];
    if (isRange) {
        classes.push(baseClassName);
        var isRangeStart = isValueWithinRange(valueRange[0], dateRange), isRangeEnd = isValueWithinRange(valueRange[1], dateRange);
        isRangeStart && classes.push("".concat(baseClassName, "Start")), isRangeEnd && classes.push("".concat(baseClassName, "End")), isRangeStart && isRangeEnd && classes.push("".concat(baseClassName, "BothEnds"));
    }
    return classes;
}
function ownKeys$a(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        enumerableOnly && (symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        })), keys.push.apply(keys, symbols);
    }
    return keys;
}
function _objectSpread$a(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = null != arguments[i] ? arguments[i] : {};
        i % 2 ? ownKeys$a(Object(source), !0).forEach(function(key) {
            var value;
            value = source[key], key in target ? Object.defineProperty(target, key, {
                value: value,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : target[key] = value;
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$a(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
function _extends$b() {
    return (_extends$b = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source)Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
    }).apply(this, arguments);
}
function TileGroup(_ref) {
    for(var className = _ref.className, _ref$count = _ref.count, dateTransform = _ref.dateTransform, dateType = _ref.dateType, end = _ref.end, hover = _ref.hover, offset = _ref.offset, start = _ref.start, _ref$step = _ref.step, step = void 0 === _ref$step ? 1 : _ref$step, Tile = _ref.tile, value = _ref.value, valueType = _ref.valueType, tileProps = function(source, excluded) {
        if (null == source) return {};
        var key, i, target = function(source, excluded) {
            if (null == source) return {};
            var key, i, target = {}, sourceKeys = Object.keys(source);
            for(i = 0; i < sourceKeys.length; i++)key = sourceKeys[i], excluded.indexOf(key) >= 0 || (target[key] = source[key]);
            return target;
        }(source, excluded);
        if (Object.getOwnPropertySymbols) {
            var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
            for(i = 0; i < sourceSymbolKeys.length; i++)key = sourceSymbolKeys[i], !(excluded.indexOf(key) >= 0) && Object.prototype.propertyIsEnumerable.call(source, key) && (target[key] = source[key]);
        }
        return target;
    }(_ref, [
        "className",
        "count",
        "dateTransform",
        "dateType",
        "end",
        "hover",
        "offset",
        "start",
        "step",
        "tile",
        "value",
        "valueType"
    ]), tiles = [], point = start; point <= end; point += step){
        var date = dateTransform(point);
        tiles.push(/*#__PURE__*/ v$1(Tile, _extends$b({
            key: date.getTime(),
            classes: function() {
                var _ref = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, value = _ref.value, valueType = _ref.valueType, date = _ref.date, dateType = _ref.dateType, hover = _ref.hover, className = "react-calendar__tile", classes = [
                    className
                ];
                if (!date) return classes;
                if (!Array.isArray(date) && !dateType) throw Error("getTileClasses(): Unable to get tile activity classes because one or more required arguments were not passed.");
                var now = new Date(), dateRange = Array.isArray(date) ? date : getRange(dateType, date);
                if (isValueWithinRange(now, dateRange) && classes.push("".concat(className, "--now")), !value) return classes;
                if (!Array.isArray(value) && !valueType) throw Error("getTileClasses(): Unable to get tile activity classes because one or more required arguments were not passed.");
                var valueRange = Array.isArray(value) ? value : getRange(valueType, value);
                valueRange[0] <= dateRange[0] && valueRange[1] >= dateRange[1] ? classes.push("".concat(className, "--active")) : doRangesOverlap(valueRange, dateRange) && classes.push("".concat(className, "--hasActive"));
                var valueRangeClassNames = getRangeClassNames(valueRange, dateRange, "".concat(className, "--range"));
                if (classes.push.apply(classes, _toConsumableArray$1(valueRangeClassNames)), hover) {
                    var hoverRangeClassNames = getRangeClassNames(hover > valueRange[1] ? [
                        valueRange[1],
                        hover
                    ] : [
                        hover,
                        valueRange[0]
                    ], dateRange, "".concat(className, "--hover"));
                    classes.push.apply(classes, _toConsumableArray$1(hoverRangeClassNames));
                }
                return classes;
            }({
                value: value,
                valueType: valueType,
                date: date,
                dateType: dateType,
                hover: hover
            }),
            date: date,
            point: point
        }, tileProps)));
    }
    return /*#__PURE__*/ v$1(Flex, {
        className: className,
        count: void 0 === _ref$count ? 3 : _ref$count,
        offset: offset,
        wrap: !0
    }, tiles);
}
function ownKeys$9(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        enumerableOnly && (symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        })), keys.push.apply(keys, symbols);
    }
    return keys;
}
function _objectSpread$9(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = null != arguments[i] ? arguments[i] : {};
        i % 2 ? ownKeys$9(Object(source), !0).forEach(function(key) {
            _defineProperty$9(target, key, source[key]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$9(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
function _typeof$1(obj) {
    return (_typeof$1 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
        return typeof obj;
    } : function(obj) {
        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    })(obj);
}
function _defineProperties$1(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _setPrototypeOf$1(o, p) {
    return (_setPrototypeOf$1 = Object.setPrototypeOf || function(o, p) {
        return o.__proto__ = p, o;
    })(o, p);
}
function _assertThisInitialized$1(self) {
    if (void 0 === self) throw ReferenceError("this hasn't been initialised - super() hasn't been called");
    return self;
}
function _getPrototypeOf$1(o) {
    return (_getPrototypeOf$1 = Object.setPrototypeOf ? Object.getPrototypeOf : function(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    })(o);
}
function _defineProperty$9(obj, key, value) {
    return key in obj ? Object.defineProperty(obj, key, {
        value: value,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : obj[key] = value, obj;
}
function getValue$1(nextProps, prop) {
    var activeStartDate = nextProps.activeStartDate, date = nextProps.date, view = nextProps.view;
    return "function" == typeof prop ? prop({
        activeStartDate: activeStartDate,
        date: date,
        view: view
    }) : prop;
}
Navigation.propTypes = {
    activeStartDate: PropTypes.instanceOf(Date).isRequired,
    drillUp: PropTypes.func.isRequired,
    formatMonthYear: PropTypes.func,
    formatYear: PropTypes.func,
    locale: PropTypes.string,
    maxDate: PropTypes.instanceOf(Date),
    minDate: PropTypes.instanceOf(Date),
    navigationAriaLabel: PropTypes.string,
    navigationLabel: PropTypes.func,
    next2AriaLabel: PropTypes.string,
    next2Label: PropTypes.node,
    nextAriaLabel: PropTypes.string,
    nextLabel: PropTypes.node,
    prev2AriaLabel: PropTypes.string,
    prev2Label: PropTypes.node,
    prevAriaLabel: PropTypes.string,
    prevLabel: PropTypes.node,
    setActiveStartDate: PropTypes.func.isRequired,
    showDoubleView: PropTypes.bool,
    view: isView.isRequired,
    views: isViews.isRequired
}, Flex.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    count: PropTypes.number.isRequired,
    direction: PropTypes.string,
    offset: PropTypes.number,
    style: PropTypes.objectOf(PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ])),
    wrap: PropTypes.bool
}, TileGroup.propTypes = _objectSpread$a(_objectSpread$a({}, tileGroupProps), {}, {
    activeStartDate: PropTypes.instanceOf(Date),
    count: PropTypes.number,
    dateTransform: PropTypes.func.isRequired,
    dateType: PropTypes.string,
    offset: PropTypes.number,
    step: PropTypes.number,
    tile: PropTypes.func.isRequired
});
var Tile = /*#__PURE__*/ function(_Component) {
    if ("function" != typeof _Component && null !== _Component) throw TypeError("Super expression must either be null or a function");
    Tile.prototype = Object.create(_Component && _Component.prototype, {
        constructor: {
            value: Tile,
            writable: !0,
            configurable: !0
        }
    }), _Component && _setPrototypeOf$1(Tile, _Component);
    var hasNativeReflectConstruct, protoProps, staticProps, _super = (hasNativeReflectConstruct = function() {
        if ("u" < typeof Reflect || !Reflect.construct || Reflect.construct.sham) return !1;
        if ("function" == typeof Proxy) return !0;
        try {
            return Date.prototype.toString.call(Reflect.construct(Date, [], function() {})), !0;
        } catch (e) {
            return !1;
        }
    }(), function() {
        var result, Super = _getPrototypeOf$1(Tile);
        return result = hasNativeReflectConstruct ? Reflect.construct(Super, arguments, _getPrototypeOf$1(this).constructor) : Super.apply(this, arguments), result && ("object" === _typeof$1(result) || "function" == typeof result) ? result : _assertThisInitialized$1(this);
    });
    function Tile() {
        var _this;
        if (!(this instanceof Tile)) throw TypeError("Cannot call a class as a function");
        for(var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
        return _defineProperty$9(_assertThisInitialized$1(_this = _super.call.apply(_super, [
            this
        ].concat(args))), "state", {}), _this;
    }
    return protoProps = [
        {
            key: "render",
            value: function() {
                var _this$props = this.props, activeStartDate = _this$props.activeStartDate, children = _this$props.children, classes = _this$props.classes, date = _this$props.date, formatAbbr = _this$props.formatAbbr, locale = _this$props.locale, maxDate = _this$props.maxDate, maxDateTransform = _this$props.maxDateTransform, minDate = _this$props.minDate, minDateTransform = _this$props.minDateTransform, onClick = _this$props.onClick, onMouseOver = _this$props.onMouseOver, style = _this$props.style, tileDisabled = _this$props.tileDisabled, view = _this$props.view, _this$state = this.state, tileClassName = _this$state.tileClassName, tileContent = _this$state.tileContent;
                return /*#__PURE__*/ v$1("button", {
                    className: mergeClassNames(classes, tileClassName),
                    disabled: minDate && minDateTransform(minDate) > date || maxDate && maxDateTransform(maxDate) < date || tileDisabled && tileDisabled({
                        activeStartDate: activeStartDate,
                        date: date,
                        view: view
                    }),
                    onClick: onClick && function(event) {
                        return onClick(date, event);
                    },
                    onFocus: onMouseOver && function() {
                        return onMouseOver(date);
                    },
                    onMouseOver: onMouseOver && function() {
                        return onMouseOver(date);
                    },
                    style: style,
                    type: "button"
                }, formatAbbr ? /*#__PURE__*/ v$1("abbr", {
                    "aria-label": formatAbbr(locale, date)
                }, children) : children, tileContent);
            }
        }
    ], staticProps = [
        {
            key: "getDerivedStateFromProps",
            value: function(nextProps, prevState) {
                var tileClassName = nextProps.tileClassName, tileContent = nextProps.tileContent, nextState = {};
                return tileClassName !== prevState.tileClassNameProps && (nextState.tileClassName = getValue$1(nextProps, tileClassName), nextState.tileClassNameProps = tileClassName), tileContent !== prevState.tileContentProps && (nextState.tileContent = getValue$1(nextProps, tileContent), nextState.tileContentProps = tileContent), nextState;
            }
        }
    ], protoProps && _defineProperties$1(Tile.prototype, protoProps), staticProps && _defineProperties$1(Tile, staticProps), Tile;
}(_);
function ownKeys$8(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        enumerableOnly && (symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        })), keys.push.apply(keys, symbols);
    }
    return keys;
}
function _objectSpread$8(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = null != arguments[i] ? arguments[i] : {};
        i % 2 ? ownKeys$8(Object(source), !0).forEach(function(key) {
            var value;
            value = source[key], key in target ? Object.defineProperty(target, key, {
                value: value,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : target[key] = value;
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$8(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
function _extends$a() {
    return (_extends$a = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source)Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
    }).apply(this, arguments);
}
function Decade(_ref) {
    var classes = _ref.classes, _ref$formatYear = _ref.formatYear, otherProps = function(source, excluded) {
        if (null == source) return {};
        var key, i, target = function(source, excluded) {
            if (null == source) return {};
            var key, i, target = {}, sourceKeys = Object.keys(source);
            for(i = 0; i < sourceKeys.length; i++)key = sourceKeys[i], excluded.indexOf(key) >= 0 || (target[key] = source[key]);
            return target;
        }(source, excluded);
        if (Object.getOwnPropertySymbols) {
            var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
            for(i = 0; i < sourceSymbolKeys.length; i++)key = sourceSymbolKeys[i], !(excluded.indexOf(key) >= 0) && Object.prototype.propertyIsEnumerable.call(source, key) && (target[key] = source[key]);
        }
        return target;
    }(_ref, [
        "classes",
        "formatYear"
    ]), date = otherProps.date, locale = otherProps.locale;
    return /*#__PURE__*/ v$1(Tile, _extends$a({}, otherProps, {
        classes: [].concat(classes, "react-calendar__century-view__decades__decade"),
        maxDateTransform: getDecadeEnd,
        minDateTransform: getDecadeStart,
        view: "century"
    }), toYearLabel(locale, void 0 === _ref$formatYear ? formatYear : _ref$formatYear, getDecadeRange(date)));
}
function ownKeys$7(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        enumerableOnly && (symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        })), keys.push.apply(keys, symbols);
    }
    return keys;
}
function _extends$9() {
    return (_extends$9 = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source)Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
    }).apply(this, arguments);
}
function Decades(props) {
    var start = getYear(getCenturyStart(props.activeStartDate));
    return /*#__PURE__*/ v$1(TileGroup, _extends$9({}, props, {
        className: "react-calendar__century-view__decades",
        dateTransform: getDecadeStart,
        dateType: "decade",
        end: start + 99,
        start: start,
        step: 10,
        tile: Decade
    }));
}
function CenturyView(props) {
    return /*#__PURE__*/ v$1("div", {
        className: "react-calendar__century-view"
    }, /*#__PURE__*/ v$1(Decades, props));
}
function ownKeys$6(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        enumerableOnly && (symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        })), keys.push.apply(keys, symbols);
    }
    return keys;
}
function _objectSpread$6(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = null != arguments[i] ? arguments[i] : {};
        i % 2 ? ownKeys$6(Object(source), !0).forEach(function(key) {
            var value;
            value = source[key], key in target ? Object.defineProperty(target, key, {
                value: value,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : target[key] = value;
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$6(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
function _extends$8() {
    return (_extends$8 = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source)Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
    }).apply(this, arguments);
}
function Year(_ref) {
    var classes = _ref.classes, _ref$formatYear = _ref.formatYear, formatYear$1 = void 0 === _ref$formatYear ? formatYear : _ref$formatYear, otherProps = function(source, excluded) {
        if (null == source) return {};
        var key, i, target = function(source, excluded) {
            if (null == source) return {};
            var key, i, target = {}, sourceKeys = Object.keys(source);
            for(i = 0; i < sourceKeys.length; i++)key = sourceKeys[i], excluded.indexOf(key) >= 0 || (target[key] = source[key]);
            return target;
        }(source, excluded);
        if (Object.getOwnPropertySymbols) {
            var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
            for(i = 0; i < sourceSymbolKeys.length; i++)key = sourceSymbolKeys[i], !(excluded.indexOf(key) >= 0) && Object.prototype.propertyIsEnumerable.call(source, key) && (target[key] = source[key]);
        }
        return target;
    }(_ref, [
        "classes",
        "formatYear"
    ]), date = otherProps.date, locale = otherProps.locale;
    return /*#__PURE__*/ v$1(Tile, _extends$8({}, otherProps, {
        classes: [].concat(classes, "react-calendar__decade-view__years__year"),
        maxDateTransform: getYearEnd,
        minDateTransform: getYearStart,
        view: "decade"
    }), formatYear$1(locale, date));
}
function ownKeys$5(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        enumerableOnly && (symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        })), keys.push.apply(keys, symbols);
    }
    return keys;
}
function _extends$7() {
    return (_extends$7 = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source)Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
    }).apply(this, arguments);
}
function Years(props) {
    var start = getYear(getDecadeStart(props.activeStartDate));
    return /*#__PURE__*/ v$1(TileGroup, _extends$7({}, props, {
        className: "react-calendar__decade-view__years",
        dateTransform: function(year) {
            var date = new Date();
            return date.setFullYear(year, 0, 1), date.setHours(0, 0, 0, 0), date;
        },
        dateType: "year",
        end: start + 9,
        start: start,
        tile: Year
    }));
}
function DecadeView(props) {
    return /*#__PURE__*/ v$1("div", {
        className: "react-calendar__decade-view"
    }, /*#__PURE__*/ v$1(Years, props));
}
function ownKeys$4(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        enumerableOnly && (symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        })), keys.push.apply(keys, symbols);
    }
    return keys;
}
function _objectSpread$4(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = null != arguments[i] ? arguments[i] : {};
        i % 2 ? ownKeys$4(Object(source), !0).forEach(function(key) {
            var value;
            value = source[key], key in target ? Object.defineProperty(target, key, {
                value: value,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : target[key] = value;
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$4(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
function _extends$6() {
    return (_extends$6 = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source)Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
    }).apply(this, arguments);
}
function Month(_ref) {
    var classes = _ref.classes, _ref$formatMonth = _ref.formatMonth, _ref$formatMonthYear = _ref.formatMonthYear, otherProps = function(source, excluded) {
        if (null == source) return {};
        var key, i, target = function(source, excluded) {
            if (null == source) return {};
            var key, i, target = {}, sourceKeys = Object.keys(source);
            for(i = 0; i < sourceKeys.length; i++)key = sourceKeys[i], excluded.indexOf(key) >= 0 || (target[key] = source[key]);
            return target;
        }(source, excluded);
        if (Object.getOwnPropertySymbols) {
            var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
            for(i = 0; i < sourceSymbolKeys.length; i++)key = sourceSymbolKeys[i], !(excluded.indexOf(key) >= 0) && Object.prototype.propertyIsEnumerable.call(source, key) && (target[key] = source[key]);
        }
        return target;
    }(_ref, [
        "classes",
        "formatMonth",
        "formatMonthYear"
    ]), date = otherProps.date, locale = otherProps.locale;
    return /*#__PURE__*/ v$1(Tile, _extends$6({}, otherProps, {
        classes: [].concat(classes, "react-calendar__year-view__months__month"),
        formatAbbr: void 0 === _ref$formatMonthYear ? formatMonthYear : _ref$formatMonthYear,
        maxDateTransform: getMonthEnd,
        minDateTransform: getMonthStart,
        view: "year"
    }), (void 0 === _ref$formatMonth ? formatMonth : _ref$formatMonth)(locale, date));
}
function ownKeys$3(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        enumerableOnly && (symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        })), keys.push.apply(keys, symbols);
    }
    return keys;
}
function _objectSpread$3(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = null != arguments[i] ? arguments[i] : {};
        i % 2 ? ownKeys$3(Object(source), !0).forEach(function(key) {
            var value;
            value = source[key], key in target ? Object.defineProperty(target, key, {
                value: value,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : target[key] = value;
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$3(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
function _extends$5() {
    return (_extends$5 = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source)Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
    }).apply(this, arguments);
}
function Months(props) {
    var year = getYear(props.activeStartDate);
    return /*#__PURE__*/ v$1(TileGroup, _extends$5({}, props, {
        className: "react-calendar__year-view__months",
        dateTransform: function(monthIndex) {
            var date = new Date();
            return date.setFullYear(year, monthIndex, 1), date.setHours(0, 0, 0, 0), date;
        },
        dateType: "month",
        end: 11,
        start: 0,
        tile: Month
    }));
}
function YearView(props) {
    return /*#__PURE__*/ v$1("div", {
        className: "react-calendar__year-view"
    }, /*#__PURE__*/ v$1(Months, props));
}
function ownKeys$2(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        enumerableOnly && (symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        })), keys.push.apply(keys, symbols);
    }
    return keys;
}
function _objectSpread$2(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = null != arguments[i] ? arguments[i] : {};
        i % 2 ? ownKeys$2(Object(source), !0).forEach(function(key) {
            var value;
            value = source[key], key in target ? Object.defineProperty(target, key, {
                value: value,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : target[key] = value;
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$2(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
function _extends$4() {
    return (_extends$4 = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source)Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
    }).apply(this, arguments);
}
Tile.propTypes = _objectSpread$9(_objectSpread$9({}, tileProps), {}, {
    children: PropTypes.node.isRequired,
    formatAbbr: PropTypes.func,
    maxDateTransform: PropTypes.func.isRequired,
    minDateTransform: PropTypes.func.isRequired
}), Decade.propTypes = _objectSpread$8(_objectSpread$8({}, tileProps), {}, {
    formatYear: PropTypes.func
}), Decades.propTypes = function(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = null != arguments[i] ? arguments[i] : {};
        i % 2 ? ownKeys$7(Object(source), !0).forEach(function(key) {
            var value;
            value = source[key], key in target ? Object.defineProperty(target, key, {
                value: value,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : target[key] = value;
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$7(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}({}, tileGroupProps), Year.propTypes = _objectSpread$6(_objectSpread$6({}, tileProps), {}, {
    formatYear: PropTypes.func
}), Years.propTypes = function(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = null != arguments[i] ? arguments[i] : {};
        i % 2 ? ownKeys$5(Object(source), !0).forEach(function(key) {
            var value;
            value = source[key], key in target ? Object.defineProperty(target, key, {
                value: value,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : target[key] = value;
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$5(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}({}, tileGroupProps), Month.propTypes = _objectSpread$4(_objectSpread$4({}, tileProps), {}, {
    formatMonth: PropTypes.func,
    formatMonthYear: PropTypes.func
}), Months.propTypes = _objectSpread$3(_objectSpread$3({}, tileGroupProps), {}, {
    locale: PropTypes.string
});
var className$1 = "react-calendar__month-view__days__day";
function Day(_ref) {
    var _ref$formatDay = _ref.formatDay, _ref$formatLongDate = _ref.formatLongDate, calendarType = _ref.calendarType, classes = _ref.classes, currentMonthIndex = _ref.currentMonthIndex, otherProps = function(source, excluded) {
        if (null == source) return {};
        var key, i, target = function(source, excluded) {
            if (null == source) return {};
            var key, i, target = {}, sourceKeys = Object.keys(source);
            for(i = 0; i < sourceKeys.length; i++)key = sourceKeys[i], excluded.indexOf(key) >= 0 || (target[key] = source[key]);
            return target;
        }(source, excluded);
        if (Object.getOwnPropertySymbols) {
            var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
            for(i = 0; i < sourceSymbolKeys.length; i++)key = sourceSymbolKeys[i], !(excluded.indexOf(key) >= 0) && Object.prototype.propertyIsEnumerable.call(source, key) && (target[key] = source[key]);
        }
        return target;
    }(_ref, [
        "formatDay",
        "formatLongDate",
        "calendarType",
        "classes",
        "currentMonthIndex"
    ]), date = otherProps.date, locale = otherProps.locale;
    return /*#__PURE__*/ v$1(Tile, _extends$4({}, otherProps, {
        classes: [].concat(classes, className$1, !/**
 * Returns a boolean determining whether a given date is on Saturday or Sunday.
 *
 * @param {Date} date Date.
 */ function(date) {
            var calendarType = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : CALENDAR_TYPES.ISO_8601, weekday = date.getDay();
            switch(calendarType){
                case CALENDAR_TYPES.ARABIC:
                case CALENDAR_TYPES.HEBREW:
                    return weekday === FRIDAY || weekday === SATURDAY;
                case CALENDAR_TYPES.ISO_8601:
                case CALENDAR_TYPES.US:
                    return weekday === SATURDAY || weekday === SUNDAY;
                default:
                    throw Error("Unsupported calendar type.");
            }
        }(date, calendarType) ? null : "".concat(className$1, "--weekend"), date.getMonth() !== currentMonthIndex ? "".concat(className$1, "--neighboringMonth") : null),
        formatAbbr: void 0 === _ref$formatLongDate ? formatLongDate : _ref$formatLongDate,
        maxDateTransform: getDayEnd,
        minDateTransform: getDayStart,
        view: "month"
    }), (void 0 === _ref$formatDay ? formatDay : _ref$formatDay)(locale, date));
}
function ownKeys$1(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        enumerableOnly && (symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        })), keys.push.apply(keys, symbols);
    }
    return keys;
}
function _extends$3() {
    return (_extends$3 = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source)Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
    }).apply(this, arguments);
}
function Days(props) {
    var activeStartDate = props.activeStartDate, calendarType = props.calendarType, showFixedNumberOfWeeks = props.showFixedNumberOfWeeks, showNeighboringMonth = props.showNeighboringMonth, otherProps = function(source, excluded) {
        if (null == source) return {};
        var key, i, target = function(source, excluded) {
            if (null == source) return {};
            var key, i, target = {}, sourceKeys = Object.keys(source);
            for(i = 0; i < sourceKeys.length; i++)key = sourceKeys[i], excluded.indexOf(key) >= 0 || (target[key] = source[key]);
            return target;
        }(source, excluded);
        if (Object.getOwnPropertySymbols) {
            var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
            for(i = 0; i < sourceSymbolKeys.length; i++)key = sourceSymbolKeys[i], !(excluded.indexOf(key) >= 0) && Object.prototype.propertyIsEnumerable.call(source, key) && (target[key] = source[key]);
        }
        return target;
    }(props, [
        "showFixedNumberOfWeeks",
        "showNeighboringMonth"
    ]), year = getYear(activeStartDate), monthIndex = getMonth(activeStartDate), hasFixedNumberOfWeeks = showFixedNumberOfWeeks || showNeighboringMonth, dayOfWeek = getDayOfWeek(activeStartDate, calendarType), start = (hasFixedNumberOfWeeks ? -dayOfWeek : 0) + 1, end = function() {
        if (showFixedNumberOfWeeks) // Always show 6 weeks
        return start + 42 - 1;
        var daysInMonth = getDate(getMonthEnd(activeStartDate));
        if (showNeighboringMonth) {
            var activeEndDate = new Date();
            return activeEndDate.setFullYear(year, monthIndex, daysInMonth), activeEndDate.setHours(0, 0, 0, 0), daysInMonth + (7 - getDayOfWeek(activeEndDate, calendarType) - 1);
        }
        return daysInMonth;
    }();
    return /*#__PURE__*/ v$1(TileGroup, _extends$3({}, otherProps, {
        className: "react-calendar__month-view__days",
        count: 7,
        currentMonthIndex: monthIndex,
        dateTransform: function(day) {
            var date = new Date();
            return date.setFullYear(year, monthIndex, day), date.setHours(0, 0, 0, 0), date;
        },
        dateType: "day",
        end: end,
        offset: hasFixedNumberOfWeeks ? 0 : dayOfWeek,
        start: start,
        tile: Day
    }));
}
Day.propTypes = _objectSpread$2(_objectSpread$2({}, tileProps), {}, {
    currentMonthIndex: PropTypes.number.isRequired,
    formatDay: PropTypes.func,
    formatLongDate: PropTypes.func
}), Days.propTypes = function(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = null != arguments[i] ? arguments[i] : {};
        i % 2 ? ownKeys$1(Object(source), !0).forEach(function(key) {
            var value;
            value = source[key], key in target ? Object.defineProperty(target, key, {
                value: value,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : target[key] = value;
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$1(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}({
    calendarType: isCalendarType.isRequired,
    showFixedNumberOfWeeks: PropTypes.bool,
    showNeighboringMonth: PropTypes.bool
}, tileGroupProps);
var className = "react-calendar__month-view__weekdays";
function Weekdays(props) {
    for(var calendarType = props.calendarType, _props$formatShortWee = props.formatShortWeekday, formatShortWeekday$1 = void 0 === _props$formatShortWee ? formatShortWeekday : _props$formatShortWee, locale = props.locale, onMouseLeave = props.onMouseLeave, beginOfMonth = getMonthStart(new Date()), year = getYear(beginOfMonth), monthIndex = getMonth(beginOfMonth), weekdays = [], weekday = 1; weekday <= 7; weekday += 1){
        var weekdayDate = new Date(year, monthIndex, weekday - getDayOfWeek(beginOfMonth, calendarType)), abbr = formatWeekday(locale, weekdayDate);
        weekdays.push(/*#__PURE__*/ v$1("div", {
            key: weekday,
            className: "".concat(className, "__weekday")
        }, /*#__PURE__*/ v$1("abbr", {
            "aria-label": abbr,
            title: abbr
        }, formatShortWeekday$1(locale, weekdayDate).replace(".", ""))));
    }
    return /*#__PURE__*/ v$1(Flex, {
        className: className,
        count: 7,
        onFocus: onMouseLeave,
        onMouseOver: onMouseLeave
    }, weekdays);
}
function _extends$2() {
    return (_extends$2 = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source)Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
    }).apply(this, arguments);
}
function WeekNumber(_ref) {
    var date = _ref.date, onClickWeekNumber = _ref.onClickWeekNumber, weekNumber = _ref.weekNumber, props = {
        className: "react-calendar__tile",
        style: {
            flexGrow: 1
        }
    }, children = /*#__PURE__*/ v$1("span", null, weekNumber);
    return onClickWeekNumber ? /*#__PURE__*/ v$1("button", _extends$2({}, props, {
        onClick: function(event) {
            return onClickWeekNumber(weekNumber, date, event);
        },
        type: "button"
    }), children) : /*#__PURE__*/ v$1("div", props, children);
}
function WeekNumbers(props) {
    var activeStartDate = props.activeStartDate, calendarType = props.calendarType, onClickWeekNumber = props.onClickWeekNumber, onMouseLeave = props.onMouseLeave, numberOfWeeks = props.showFixedNumberOfWeeks ? 6 : 1 + Math.ceil((getDate(getMonthEnd(activeStartDate)) - (7 - getDayOfWeek(activeStartDate, calendarType))) / 7), dates = function() {
        for(var year = getYear(activeStartDate), monthIndex = getMonth(activeStartDate), day = getDate(activeStartDate), result = [], index = 0; index < numberOfWeeks; index += 1)result.push(getBeginOfWeek(new Date(year, monthIndex, day + 7 * index), calendarType));
        return result;
    }();
    return /*#__PURE__*/ v$1(Flex, {
        className: "react-calendar__month-view__weekNumbers",
        count: numberOfWeeks,
        direction: "column",
        onFocus: onMouseLeave,
        onMouseOver: onMouseLeave,
        style: {
            flexBasis: "calc(100% * (1 / 8)",
            flexShrink: 0
        }
    }, dates.map(function(date) {
        return(/**
 * Gets week number according to ISO 8601 or US standard.
 * In ISO 8601, Arabic and Hebrew week 1 is the one with January 4.
 * In US calendar week 1 is the one with January 1.
 *
 * @param {Date} date Date.
 * @param {string} calendarType Calendar type. Can be ISO 8601 or US.
 */ function(date) {
            var beginOfFirstWeek, calendarType = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : CALENDAR_TYPES.ISO_8601, calendarTypeForWeekNumber = calendarType === CALENDAR_TYPES.US ? CALENDAR_TYPES.US : CALENDAR_TYPES.ISO_8601, beginOfWeek = getBeginOfWeek(date, calendarTypeForWeekNumber), year = getYear(date) + 1;
            do beginOfFirstWeek = getBeginOfWeek(new Date(year, 0, calendarTypeForWeekNumber === CALENDAR_TYPES.ISO_8601 ? 4 : 1), calendarTypeForWeekNumber), year -= 1;
            while (date - beginOfFirstWeek < 0)
            return Math.round((beginOfWeek - beginOfFirstWeek) / (8.64e7 * 7)) + 1;
        }(date, calendarType));
    }).map(function(weekNumber, weekIndex) {
        return /*#__PURE__*/ v$1(WeekNumber, {
            key: weekNumber,
            date: dates[weekIndex],
            onClickWeekNumber: onClickWeekNumber,
            weekNumber: weekNumber
        });
    }));
}
function _extends$1() {
    return (_extends$1 = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source)Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
    }).apply(this, arguments);
}
function MonthView(props) {
    var activeStartDate = props.activeStartDate, locale = props.locale, onMouseLeave = props.onMouseLeave, showFixedNumberOfWeeks = props.showFixedNumberOfWeeks, _props$calendarType = props.calendarType, calendarType = void 0 === _props$calendarType ? Object.keys(CALENDAR_TYPE_LOCALES).find(function(calendarType) {
        return CALENDAR_TYPE_LOCALES[calendarType].includes(locale);
    }) || CALENDAR_TYPES.ISO_8601 : _props$calendarType, formatShortWeekday = props.formatShortWeekday, onClickWeekNumber = props.onClickWeekNumber, showWeekNumbers = props.showWeekNumbers, childProps = function(source, excluded) {
        if (null == source) return {};
        var key, i, target = function(source, excluded) {
            if (null == source) return {};
            var key, i, target = {}, sourceKeys = Object.keys(source);
            for(i = 0; i < sourceKeys.length; i++)key = sourceKeys[i], excluded.indexOf(key) >= 0 || (target[key] = source[key]);
            return target;
        }(source, excluded);
        if (Object.getOwnPropertySymbols) {
            var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
            for(i = 0; i < sourceSymbolKeys.length; i++)key = sourceSymbolKeys[i], !(excluded.indexOf(key) >= 0) && Object.prototype.propertyIsEnumerable.call(source, key) && (target[key] = source[key]);
        }
        return target;
    }(props, [
        "calendarType",
        "formatShortWeekday",
        "onClickWeekNumber",
        "showWeekNumbers"
    ]), className = "react-calendar__month-view";
    return /*#__PURE__*/ v$1("div", {
        className: mergeClassNames(className, showWeekNumbers ? "".concat(className, "--weekNumbers") : "")
    }, /*#__PURE__*/ v$1("div", {
        style: {
            display: "flex",
            alignItems: "flex-end"
        }
    }, showWeekNumbers ? /*#__PURE__*/ v$1(WeekNumbers, {
        activeStartDate: activeStartDate,
        calendarType: calendarType,
        onClickWeekNumber: onClickWeekNumber,
        onMouseLeave: onMouseLeave,
        showFixedNumberOfWeeks: showFixedNumberOfWeeks
    }) : null, /*#__PURE__*/ v$1("div", {
        style: {
            flexGrow: 1,
            width: "100%"
        }
    }, /*#__PURE__*/ v$1(Weekdays, {
        calendarType: calendarType,
        formatShortWeekday: formatShortWeekday,
        locale: locale,
        onMouseLeave: onMouseLeave
    }), /*#__PURE__*/ v$1(Days, _extends$1({
        calendarType: calendarType
    }, childProps)))));
}
function _extends() {
    return (_extends = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source)Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
    }).apply(this, arguments);
}
function _typeof(obj) {
    return (_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
        return typeof obj;
    } : function(obj) {
        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    })(obj);
}
function _setPrototypeOf(o, p) {
    return (_setPrototypeOf = Object.setPrototypeOf || function(o, p) {
        return o.__proto__ = p, o;
    })(o, p);
}
function _assertThisInitialized(self) {
    if (void 0 === self) throw ReferenceError("this hasn't been initialised - super() hasn't been called");
    return self;
}
function _getPrototypeOf(o) {
    return (_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    })(o);
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        enumerableOnly && (symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        })), keys.push.apply(keys, symbols);
    }
    return keys;
}
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = null != arguments[i] ? arguments[i] : {};
        i % 2 ? ownKeys(Object(source), !0).forEach(function(key) {
            _defineProperty(target, key, source[key]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
function _defineProperty(obj, key, value) {
    return key in obj ? Object.defineProperty(obj, key, {
        value: value,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : obj[key] = value, obj;
}
function _arrayLikeToArray(arr, len) {
    (null == len || len > arr.length) && (len = arr.length);
    for(var i = 0, arr2 = Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
Weekdays.propTypes = {
    calendarType: isCalendarType.isRequired,
    formatShortWeekday: PropTypes.func,
    locale: PropTypes.string,
    onMouseLeave: PropTypes.func
}, WeekNumber.propTypes = {
    date: PropTypes.instanceOf(Date).isRequired,
    onClickWeekNumber: PropTypes.func,
    weekNumber: PropTypes.node.isRequired
}, WeekNumbers.propTypes = {
    activeStartDate: PropTypes.instanceOf(Date).isRequired,
    calendarType: isCalendarType.isRequired,
    onClickWeekNumber: PropTypes.func,
    onMouseLeave: PropTypes.func,
    showFixedNumberOfWeeks: PropTypes.bool
}, MonthView.propTypes = {
    activeStartDate: PropTypes.instanceOf(Date).isRequired,
    calendarType: isCalendarType,
    formatShortWeekday: PropTypes.func,
    locale: PropTypes.string,
    onClickWeekNumber: PropTypes.func,
    onMouseLeave: PropTypes.func,
    showFixedNumberOfWeeks: PropTypes.bool,
    showWeekNumbers: PropTypes.bool
};
var defaultMinDate = new Date();
defaultMinDate.setFullYear(1, 0, 1), defaultMinDate.setHours(0, 0, 0, 0);
var defaultMaxDate = new Date(8.64e15), baseClassName = "react-calendar", allViews = [
    "century",
    "decade",
    "year",
    "month"
], allValueTypes = [].concat(function(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}(arr1 = allViews.slice(1)) || function(iter) {
    if ("u" > typeof Symbol && Symbol.iterator in Object(iter)) return Array.from(iter);
}(arr1) || function(o) {
    if (o) {
        if ("string" == typeof o) return _arrayLikeToArray(o, void 0);
        var n = Object.prototype.toString.call(o).slice(8, -1);
        if ("Object" === n && o.constructor && (n = o.constructor.name), "Map" === n || "Set" === n) return Array.from(o);
        if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, void 0);
    }
}(arr1) || function() {
    throw TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}(), [
    "day"
]);
/**
 * Returns views array with disallowed values cut off.
 */ function getLimitedViews(minDetail, maxDetail) {
    return allViews.slice(allViews.indexOf(minDetail), allViews.indexOf(maxDetail) + 1);
}
/**
 * Gets either provided view if allowed by minDetail and maxDetail, or gets
 * the default view if not allowed.
 */ function getView(view, minDetail, maxDetail) {
    return -1 !== getLimitedViews(minDetail, maxDetail).indexOf(view) ? view : maxDetail;
}
/**
 * Returns value type that can be returned with currently applied settings.
 */ function getValueType(maxDetail) {
    return allValueTypes[allViews.indexOf(maxDetail)];
}
function getDetailValue(_ref, index) {
    var value, value1 = _ref.value, minDate = _ref.minDate, maxDate = _ref.maxDate, maxDetail = _ref.maxDetail, valuePiece = function(value, index) {
        if (!value) return null;
        var rawValue = Array.isArray(value) && 2 === value.length ? value[index] : value;
        if (!rawValue) return null;
        var valueDate = rawValue instanceof Date ? rawValue : new Date(rawValue);
        if (isNaN(valueDate.getTime())) throw Error("Invalid date: ".concat(value));
        return valueDate;
    }(value1, index);
    return valuePiece ? (value = [
        getBegin,
        getEnd
    ][index](getValueType(maxDetail), valuePiece), minDate && minDate > value ? minDate : maxDate && maxDate < value ? maxDate : value) : null;
}
var getDetailValueFrom = function(args) {
    return getDetailValue(args, 0);
}, getDetailValueTo = function(args) {
    return getDetailValue(args, 1);
}, getDetailValueArray = function(args) {
    var value = args.value;
    return Array.isArray(value) ? value : [
        getDetailValueFrom,
        getDetailValueTo
    ].map(function(fn) {
        return fn(args);
    });
};
function getActiveStartDate(props) {
    var maxDate = props.maxDate, maxDetail = props.maxDetail, minDate = props.minDate, minDetail = props.minDetail, value = props.value;
    return getBegin(getView(props.view, minDetail, maxDetail), getDetailValueFrom({
        value: value,
        minDate: minDate,
        maxDate: maxDate,
        maxDetail: maxDetail
    }) || new Date());
}
var getIsSingleValue = function(value) {
    return value && 1 === [].concat(value).length;
}, Calendar = /*#__PURE__*/ function(_Component) {
    if ("function" != typeof _Component && null !== _Component) throw TypeError("Super expression must either be null or a function");
    Calendar.prototype = Object.create(_Component && _Component.prototype, {
        constructor: {
            value: Calendar,
            writable: !0,
            configurable: !0
        }
    }), _Component && _setPrototypeOf(Calendar, _Component);
    var hasNativeReflectConstruct, protoProps, _super = (hasNativeReflectConstruct = function() {
        if ("u" < typeof Reflect || !Reflect.construct || Reflect.construct.sham) return !1;
        if ("function" == typeof Proxy) return !0;
        try {
            return Date.prototype.toString.call(Reflect.construct(Date, [], function() {})), !0;
        } catch (e) {
            return !1;
        }
    }(), function() {
        var result, Super = _getPrototypeOf(Calendar);
        return result = hasNativeReflectConstruct ? Reflect.construct(Super, arguments, _getPrototypeOf(this).constructor) : Super.apply(this, arguments), result && ("object" === _typeof(result) || "function" == typeof result) ? result : _assertThisInitialized(this);
    });
    function Calendar() {
        var _this;
        if (!(this instanceof Calendar)) throw TypeError("Cannot call a class as a function");
        for(var _len = arguments.length, _args = Array(_len), _key = 0; _key < _len; _key++)_args[_key] = arguments[_key];
        return _defineProperty(_assertThisInitialized(_this = _super.call.apply(_super, [
            this
        ].concat(_args))), "state", {
            activeStartDate: _this.props.defaultActiveStartDate,
            value: _this.props.defaultValue,
            view: _this.props.defaultView
        }), _defineProperty(_assertThisInitialized(_this), "setStateAndCallCallbacks", function(nextState, event, callback) {
            var _assertThisInitialize = _assertThisInitialized(_this), previousActiveStartDate = _assertThisInitialize.activeStartDate, previousView = _assertThisInitialize.view, _this$props = _this.props, allowPartialRange = _this$props.allowPartialRange, onActiveStartDateChange = _this$props.onActiveStartDateChange, onChange = _this$props.onChange, onViewChange = _this$props.onViewChange, selectRange = _this$props.selectRange, prevArgs = {
                activeStartDate: previousActiveStartDate,
                view: previousView
            };
            _this.setState(nextState, function() {
                var args = {
                    activeStartDate: nextState.activeStartDate || _this.activeStartDate,
                    value: nextState.value || _this.value,
                    view: nextState.view || _this.view
                };
                function shouldUpdate(key) {
                    return(// Key must exist, and…
                    key in nextState && // …key changed from undefined to defined or the other way around, or…
                    (_typeof(nextState[key]) !== _typeof(prevArgs[key]) || // …value changed.
                    (nextState[key] instanceof Date ? nextState[key].getTime() !== prevArgs[key].getTime() : nextState[key] !== prevArgs[key])));
                }
                shouldUpdate("activeStartDate") && onActiveStartDateChange && onActiveStartDateChange(args), shouldUpdate("view") && onViewChange && onViewChange(args), shouldUpdate("value") && onChange && (selectRange && getIsSingleValue(nextState.value) ? allowPartialRange && onChange([
                    nextState.value
                ], event) : onChange(nextState.value, event)), callback && callback(args);
            });
        }), _defineProperty(_assertThisInitialized(_this), "setActiveStartDate", function(activeStartDate) {
            _this.setStateAndCallCallbacks({
                activeStartDate: activeStartDate
            });
        }), _defineProperty(_assertThisInitialized(_this), "drillDown", function(nextActiveStartDate, event) {
            if (_this.drillDownAvailable) {
                _this.onClickTile(nextActiveStartDate, event);
                var _assertThisInitialize2 = _assertThisInitialized(_this), view = _assertThisInitialize2.view, views = _assertThisInitialize2.views, onDrillDown = _this.props.onDrillDown, nextView = views[views.indexOf(view) + 1];
                _this.setStateAndCallCallbacks({
                    activeStartDate: nextActiveStartDate,
                    view: nextView
                }, void 0, onDrillDown);
            }
        }), _defineProperty(_assertThisInitialized(_this), "drillUp", function() {
            if (_this.drillUpAvailable) {
                var _assertThisInitialize3 = _assertThisInitialized(_this), activeStartDate = _assertThisInitialize3.activeStartDate, view = _assertThisInitialize3.view, views = _assertThisInitialize3.views, onDrillUp = _this.props.onDrillUp, nextView = views[views.indexOf(view) - 1], nextActiveStartDate = getBegin(nextView, activeStartDate);
                _this.setStateAndCallCallbacks({
                    activeStartDate: nextActiveStartDate,
                    view: nextView
                }, void 0, onDrillUp);
            }
        }), _defineProperty(_assertThisInitialized(_this), "onChange", function(value, event) {
            var nextValue, selectRange = _this.props.selectRange;
            if (_this.onClickTile(value, event), selectRange) {
                // Range selection turned on
                var rawNextValue, _assertThisInitialize4 = _assertThisInitialized(_this), previousValue = _assertThisInitialize4.value, valueType = _assertThisInitialize4.valueType;
                // Second value
                nextValue = getIsSingleValue(previousValue) ? [
                    getBegin(valueType, (rawNextValue = [
                        previousValue,
                        value
                    ].sort(function(a, b) {
                        return a - b;
                    }))[0]),
                    getEnd(valueType, rawNextValue[1])
                ] : getBegin(valueType, value);
            } else // Range selection turned off
            nextValue = _this.getProcessedValue(value);
            var nextActiveStartDate = getActiveStartDate(_objectSpread(_objectSpread({}, _this.props), {}, {
                value: nextValue
            }));
            event.persist(), _this.setStateAndCallCallbacks({
                activeStartDate: nextActiveStartDate,
                value: nextValue
            }, event);
        }), _defineProperty(_assertThisInitialized(_this), "onClickTile", function(value, event) {
            var view = _assertThisInitialized(_this).view, _this$props2 = _this.props, onClickDay = _this$props2.onClickDay, onClickDecade = _this$props2.onClickDecade, onClickMonth = _this$props2.onClickMonth, onClickYear = _this$props2.onClickYear, callback = function() {
                switch(view){
                    case "century":
                        return onClickDecade;
                    case "decade":
                        return onClickYear;
                    case "year":
                        return onClickMonth;
                    case "month":
                        return onClickDay;
                    default:
                        throw Error("Invalid view: ".concat(view, "."));
                }
            }();
            callback && callback(value, event);
        }), _defineProperty(_assertThisInitialized(_this), "onMouseOver", function(value) {
            _this.setState(function(prevState) {
                return prevState.hover && prevState.hover.getTime() === value.getTime() ? null : {
                    hover: value
                };
            });
        }), _defineProperty(_assertThisInitialized(_this), "onMouseLeave", function() {
            _this.setState({
                hover: null
            });
        }), _this;
    }
    return protoProps = [
        {
            key: "getProcessedValue",
            /**
             * Gets current value in a desired format.
             */ value: function(value) {
                var _this$props3 = this.props, minDate = _this$props3.minDate, maxDate = _this$props3.maxDate, maxDetail = _this$props3.maxDetail, returnValue = _this$props3.returnValue;
                return (function() {
                    switch(returnValue){
                        case "start":
                            return getDetailValueFrom;
                        case "end":
                            return getDetailValueTo;
                        case "range":
                            return getDetailValueArray;
                        default:
                            throw Error("Invalid returnValue.");
                    }
                })()({
                    value: value,
                    minDate: minDate,
                    maxDate: maxDate,
                    maxDetail: maxDetail
                });
            }
        },
        {
            key: "renderContent",
            value: function(next) {
                var currentActiveStartDate = this.activeStartDate, onMouseOver = this.onMouseOver, valueType = this.valueType, value = this.value, view = this.view, _this$props4 = this.props, calendarType = _this$props4.calendarType, locale = _this$props4.locale, maxDate = _this$props4.maxDate, minDate = _this$props4.minDate, selectRange = _this$props4.selectRange, tileClassName = _this$props4.tileClassName, tileContent = _this$props4.tileContent, tileDisabled = _this$props4.tileDisabled, hover = this.hover, commonProps = {
                    activeStartDate: next ? getBeginNext(view, currentActiveStartDate) : getBegin(view, currentActiveStartDate),
                    hover: hover,
                    locale: locale,
                    maxDate: maxDate,
                    minDate: minDate,
                    onClick: this.drillDownAvailable ? this.drillDown : this.onChange,
                    onMouseOver: selectRange ? onMouseOver : null,
                    tileClassName: tileClassName,
                    tileContent: tileContent,
                    tileDisabled: tileDisabled,
                    value: value,
                    valueType: valueType
                };
                switch(view){
                    case "century":
                        var formatYear = this.props.formatYear;
                        return /*#__PURE__*/ v$1(CenturyView, _extends({
                            formatYear: formatYear
                        }, commonProps));
                    case "decade":
                        var _formatYear = this.props.formatYear;
                        return /*#__PURE__*/ v$1(DecadeView, _extends({
                            formatYear: _formatYear
                        }, commonProps));
                    case "year":
                        var _this$props5 = this.props, formatMonth = _this$props5.formatMonth, formatMonthYear = _this$props5.formatMonthYear;
                        return /*#__PURE__*/ v$1(YearView, _extends({
                            formatMonth: formatMonth,
                            formatMonthYear: formatMonthYear
                        }, commonProps));
                    case "month":
                        var _this$props6 = this.props, formatDay = _this$props6.formatDay, formatLongDate = _this$props6.formatLongDate, formatShortWeekday = _this$props6.formatShortWeekday, onClickWeekNumber = _this$props6.onClickWeekNumber, showDoubleView = _this$props6.showDoubleView, showFixedNumberOfWeeks = _this$props6.showFixedNumberOfWeeks, showNeighboringMonth = _this$props6.showNeighboringMonth, showWeekNumbers = _this$props6.showWeekNumbers, onMouseLeave = this.onMouseLeave;
                        return /*#__PURE__*/ v$1(MonthView, _extends({
                            calendarType: calendarType,
                            formatDay: formatDay,
                            formatLongDate: formatLongDate,
                            formatShortWeekday: formatShortWeekday,
                            onClickWeekNumber: onClickWeekNumber,
                            onMouseLeave: selectRange ? onMouseLeave : null,
                            showFixedNumberOfWeeks: showFixedNumberOfWeeks || showDoubleView,
                            showNeighboringMonth: showNeighboringMonth,
                            showWeekNumbers: showWeekNumbers
                        }, commonProps));
                    default:
                        throw Error("Invalid view: ".concat(view, "."));
                }
            }
        },
        {
            key: "renderNavigation",
            value: function() {
                if (!this.props.showNavigation) return null;
                var activeStartDate = this.activeStartDate, view = this.view, views = this.views, _this$props7 = this.props, formatMonthYear = _this$props7.formatMonthYear, formatYear = _this$props7.formatYear, locale = _this$props7.locale, maxDate = _this$props7.maxDate, minDate = _this$props7.minDate, navigationAriaLabel = _this$props7.navigationAriaLabel, navigationLabel = _this$props7.navigationLabel, next2AriaLabel = _this$props7.next2AriaLabel, next2Label = _this$props7.next2Label, nextAriaLabel = _this$props7.nextAriaLabel, nextLabel = _this$props7.nextLabel, prev2AriaLabel = _this$props7.prev2AriaLabel, prev2Label = _this$props7.prev2Label, prevAriaLabel = _this$props7.prevAriaLabel, prevLabel = _this$props7.prevLabel, showDoubleView = _this$props7.showDoubleView;
                return /*#__PURE__*/ v$1(Navigation, {
                    activeStartDate: activeStartDate,
                    drillUp: this.drillUp,
                    formatMonthYear: formatMonthYear,
                    formatYear: formatYear,
                    locale: locale,
                    maxDate: maxDate,
                    minDate: minDate,
                    navigationAriaLabel: navigationAriaLabel,
                    navigationLabel: navigationLabel,
                    next2AriaLabel: next2AriaLabel,
                    next2Label: next2Label,
                    nextAriaLabel: nextAriaLabel,
                    nextLabel: nextLabel,
                    prev2AriaLabel: prev2AriaLabel,
                    prev2Label: prev2Label,
                    prevAriaLabel: prevAriaLabel,
                    prevLabel: prevLabel,
                    setActiveStartDate: this.setActiveStartDate,
                    showDoubleView: showDoubleView,
                    view: view,
                    views: views
                });
            }
        },
        {
            key: "render",
            value: function() {
                var _this$props8 = this.props, className = _this$props8.className, inputRef = _this$props8.inputRef, selectRange = _this$props8.selectRange, showDoubleView = _this$props8.showDoubleView, onMouseLeave = this.onMouseLeave, valueArray = [].concat(this.value);
                return /*#__PURE__*/ v$1("div", {
                    className: mergeClassNames(baseClassName, selectRange && 1 === valueArray.length && "".concat(baseClassName, "--selectRange"), showDoubleView && "".concat(baseClassName, "--doubleView"), className),
                    ref: inputRef
                }, this.renderNavigation(), /*#__PURE__*/ v$1("div", {
                    className: "".concat(baseClassName, "__viewContainer"),
                    onBlur: selectRange ? onMouseLeave : null,
                    onMouseLeave: selectRange ? onMouseLeave : null
                }, this.renderContent(), showDoubleView && this.renderContent(!0)));
            }
        },
        {
            key: "activeStartDate",
            get: function() {
                var props, activeStartDate, defaultActiveStartDate, defaultValue, defaultView, maxDetail, minDetail, value, view, otherProps, rangeType, valueFrom, activeStartDateProps = this.props.activeStartDate, activeStartDateState = this.state.activeStartDate;
                return activeStartDateProps || activeStartDateState || (activeStartDate = (props = this.props).activeStartDate, defaultActiveStartDate = props.defaultActiveStartDate, defaultValue = props.defaultValue, defaultView = props.defaultView, maxDetail = props.maxDetail, minDetail = props.minDetail, value = props.value, view = props.view, otherProps = function(source, excluded) {
                    if (null == source) return {};
                    var key, i, target = function(source, excluded) {
                        if (null == source) return {};
                        var key, i, target = {}, sourceKeys = Object.keys(source);
                        for(i = 0; i < sourceKeys.length; i++)key = sourceKeys[i], excluded.indexOf(key) >= 0 || (target[key] = source[key]);
                        return target;
                    }(source, excluded);
                    if (Object.getOwnPropertySymbols) {
                        var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
                        for(i = 0; i < sourceSymbolKeys.length; i++)key = sourceSymbolKeys[i], !(excluded.indexOf(key) >= 0) && Object.prototype.propertyIsEnumerable.call(source, key) && (target[key] = source[key]);
                    }
                    return target;
                }(props, [
                    "activeStartDate",
                    "defaultActiveStartDate",
                    "defaultValue",
                    "defaultView",
                    "maxDetail",
                    "minDetail",
                    "value",
                    "view"
                ]), rangeType = getView(view, minDetail, maxDetail), (valueFrom = activeStartDate || defaultActiveStartDate) ? getBegin(rangeType, valueFrom) : getActiveStartDate(_objectSpread({
                    maxDetail: maxDetail,
                    minDetail: minDetail,
                    value: value || defaultValue,
                    view: view || defaultView
                }, otherProps)));
            }
        },
        {
            key: "value",
            get: function() {
                var _this$props9 = this.props, selectRange = _this$props9.selectRange, valueProps = _this$props9.value, valueState = this.state.value;
                return selectRange && getIsSingleValue(valueState) ? valueState : void 0 !== valueProps ? valueProps : valueState;
            }
        },
        {
            key: "valueType",
            get: function() {
                return getValueType(this.props.maxDetail);
            }
        },
        {
            key: "view",
            get: function() {
                var _this$props10 = this.props, minDetail = _this$props10.minDetail, maxDetail = _this$props10.maxDetail, viewProps = _this$props10.view, viewState = this.state.view;
                return getView(viewProps || viewState, minDetail, maxDetail);
            }
        },
        {
            key: "views",
            get: function() {
                var _this$props11 = this.props;
                return getLimitedViews(_this$props11.minDetail, _this$props11.maxDetail);
            }
        },
        {
            key: "hover",
            get: function() {
                var selectRange = this.props.selectRange, hover = this.state.hover;
                return selectRange ? hover : null;
            }
        },
        {
            key: "drillDownAvailable",
            get: function() {
                var view = this.view, views = this.views;
                return views.indexOf(view) < views.length - 1;
            }
        },
        {
            key: "drillUpAvailable",
            get: function() {
                var view = this.view;
                return this.views.indexOf(view) > 0;
            }
        }
    ], function(target, props) {
        for(var i = 0; i < props.length; i++){
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
        }
    }(Calendar.prototype, protoProps), Calendar;
}(_);
Calendar.defaultProps = {
    maxDate: defaultMaxDate,
    maxDetail: "month",
    minDate: defaultMinDate,
    minDetail: "century",
    returnValue: "start",
    showNavigation: !0,
    showNeighboringMonth: !0
};
var isActiveStartDate = PropTypes.instanceOf(Date), isLooseValue = PropTypes.oneOfType([
    PropTypes.string,
    isValue
]);
Calendar.propTypes = {
    activeStartDate: isActiveStartDate,
    allowPartialRange: PropTypes.bool,
    calendarType: isCalendarType,
    className: isClassName,
    defaultActiveStartDate: isActiveStartDate,
    defaultValue: isLooseValue,
    defaultView: isView,
    formatDay: PropTypes.func,
    formatLongDate: PropTypes.func,
    formatMonth: PropTypes.func,
    formatMonthYear: PropTypes.func,
    formatShortWeekday: PropTypes.func,
    formatYear: PropTypes.func,
    inputRef: isRef,
    locale: PropTypes.string,
    maxDate: isMaxDate,
    maxDetail: PropTypes.oneOf(allViews),
    minDate: isMinDate,
    minDetail: PropTypes.oneOf(allViews),
    navigationAriaLabel: PropTypes.string,
    navigationLabel: PropTypes.func,
    next2AriaLabel: PropTypes.string,
    next2Label: PropTypes.node,
    nextAriaLabel: PropTypes.string,
    nextLabel: PropTypes.node,
    onActiveStartDateChange: PropTypes.func,
    onChange: PropTypes.func,
    onClickDay: PropTypes.func,
    onClickDecade: PropTypes.func,
    onClickMonth: PropTypes.func,
    onClickWeekNumber: PropTypes.func,
    onClickYear: PropTypes.func,
    onDrillDown: PropTypes.func,
    onDrillUp: PropTypes.func,
    onViewChange: PropTypes.func,
    prev2AriaLabel: PropTypes.string,
    prev2Label: PropTypes.node,
    prevAriaLabel: PropTypes.string,
    prevLabel: PropTypes.node,
    returnValue: PropTypes.oneOf([
        "start",
        "end",
        "range"
    ]),
    selectRange: PropTypes.bool,
    showDoubleView: PropTypes.bool,
    showFixedNumberOfWeeks: PropTypes.bool,
    showNavigation: PropTypes.bool,
    showNeighboringMonth: PropTypes.bool,
    showWeekNumbers: PropTypes.bool,
    tileClassName: PropTypes.oneOfType([
        PropTypes.func,
        isClassName
    ]),
    tileContent: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.node
    ]),
    tileDisabled: PropTypes.func,
    value: isLooseValue,
    view: isView
}, style("/assets/Calendar.4739c73f.css");
export default function() {
    let [value, onChange] = l$2(new Date());
    return m$1`<${Calendar} onChange=${onChange} showWeekNumbers value=${value}/>`;
};
