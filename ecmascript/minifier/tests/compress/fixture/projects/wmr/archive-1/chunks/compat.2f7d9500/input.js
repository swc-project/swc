import {
    _,
    l as l$1,
    v as v$1,
    d as d$1,
    A as A$2,
    a as l$2,
    p as p$1,
    y as y$1,
    h as h$1,
    b as s,
    c as _$1,
    e as d$2,
    f as A$3,
    F as F$1,
    T as T$1,
    D as D$1,
    g as p$2,
    B as B$1,
    S as S$1,
    q as q$2,
    s as style,
    m as m$1,
} from "../index.f66dda46.js";
function S(n, t) {
    for (var e in t) n[e] = t[e];
    return n;
}
function C(n, t) {
    for (var e in n) if ("__source" !== e && !(e in t)) return !0;
    for (var r in t) if ("__source" !== r && n[r] !== t[r]) return !0;
    return !1;
}
function E(n) {
    this.props = n;
}
function g$1(n, t) {
    function e(n) {
        var e = this.props.ref,
            r = e == n.ref;
        return (
            !r && e && (e.call ? e(null) : (e.current = null)),
            t ? !t(this.props, n) || !r : C(this.props, n)
        );
    }
    function r(t) {
        return (this.shouldComponentUpdate = e), v$1(n, t);
    }
    return (
        (r.displayName = "Memo(" + (n.displayName || n.name) + ")"),
        (r.prototype.isReactComponent = !0),
        (r.__f = !0),
        r
    );
}
((E.prototype = new _()).isPureReactComponent = !0),
    (E.prototype.shouldComponentUpdate = function (n, t) {
        return C(this.props, n) || C(this.state, t);
    });
var w$1 = l$1.__b;
l$1.__b = function (n) {
    n.type && n.type.__f && n.ref && ((n.props.ref = n.ref), (n.ref = null)),
        w$1 && w$1(n);
};
var R =
    ("undefined" != typeof Symbol &&
        Symbol.for &&
        Symbol.for("react.forward_ref")) ||
    3911;
function x$1(n) {
    function t(t, e) {
        var r = S({}, t);
        return (
            delete r.ref,
            n(
                r,
                (e = t.ref || e) && ("object" != typeof e || "current" in e)
                    ? e
                    : null
            )
        );
    }
    return (
        (t.$$typeof = R),
        (t.render = t),
        (t.prototype.isReactComponent = t.__f = !0),
        (t.displayName = "ForwardRef(" + (n.displayName || n.name) + ")"),
        t
    );
}
var N = function (n, t) {
        return null == n ? null : A$2(A$2(n).map(t));
    },
    k$1 = {
        map: N,
        forEach: N,
        count: function (n) {
            return n ? A$2(n).length : 0;
        },
        only: function (n) {
            var t = A$2(n);
            if (1 !== t.length) throw "Children.only";
            return t[0];
        },
        toArray: A$2,
    },
    A$1 = l$1.__e;
l$1.__e = function (n, t, e) {
    if (n.then)
        for (var r, u = t; (u = u.__); )
            if ((r = u.__c) && r.__c)
                return (
                    null == t.__e && ((t.__e = e.__e), (t.__k = e.__k)),
                    r.__c(n, t)
                );
    A$1(n, t, e);
};
var O = l$1.unmount;
function L() {
    (this.__u = 0), (this.t = null), (this.__b = null);
}
function U(n) {
    var t = n.__.__c;
    return t && t.__e && t.__e(n);
}
function F(n) {
    var t, e, r;
    function u(u) {
        if (
            (t ||
                (t = n()).then(
                    function (n) {
                        e = n.default || n;
                    },
                    function (n) {
                        r = n;
                    }
                ),
            r)
        )
            throw r;
        if (!e) throw t;
        return v$1(e, u);
    }
    return (u.displayName = "Lazy"), (u.__f = !0), u;
}
function M() {
    (this.u = null), (this.o = null);
}
(l$1.unmount = function (n) {
    var t = n.__c;
    t && t.__R && t.__R(), t && !0 === n.__h && (n.type = null), O && O(n);
}),
    ((L.prototype = new _()).__c = function (n, t) {
        var e = t.__c,
            r = this;
        null == r.t && (r.t = []), r.t.push(e);
        var u = U(r.__v),
            o = !1,
            i = function () {
                o || ((o = !0), (e.__R = null), u ? u(l) : l());
            };
        e.__R = i;
        var l = function () {
                if (!--r.__u) {
                    if (r.state.__e) {
                        var n = r.state.__e;
                        r.__v.__k[0] = (function n(t, e, r) {
                            return (
                                t &&
                                    ((t.__v = null),
                                    (t.__k =
                                        t.__k &&
                                        t.__k.map(function (t) {
                                            return n(t, e, r);
                                        })),
                                    t.__c &&
                                        t.__c.__P === e &&
                                        (t.__e && r.insertBefore(t.__e, t.__d),
                                        (t.__c.__e = !0),
                                        (t.__c.__P = r))),
                                t
                            );
                        })(n, n.__c.__P, n.__c.__O);
                    }
                    var t;
                    for (
                        r.setState({
                            __e: (r.__b = null),
                        });
                        (t = r.t.pop());

                    )
                        t.forceUpdate();
                }
            },
            f = !0 === t.__h;
        r.__u++ ||
            f ||
            r.setState({
                __e: (r.__b = r.__v.__k[0]),
            }),
            n.then(i, i);
    }),
    (L.prototype.componentWillUnmount = function () {
        this.t = [];
    }),
    (L.prototype.render = function (n, t) {
        if (this.__b) {
            if (this.__v.__k) {
                var e = document.createElement("div"),
                    r = this.__v.__k[0].__c;
                this.__v.__k[0] = (function n(t, e, r) {
                    return (
                        t &&
                            (t.__c &&
                                t.__c.__H &&
                                (t.__c.__H.__.forEach(function (n) {
                                    "function" == typeof n.__c && n.__c();
                                }),
                                (t.__c.__H = null)),
                            null != (t = S({}, t)).__c &&
                                (t.__c.__P === r && (t.__c.__P = e),
                                (t.__c = null)),
                            (t.__k =
                                t.__k &&
                                t.__k.map(function (t) {
                                    return n(t, e, r);
                                }))),
                        t
                    );
                })(this.__b, e, (r.__O = r.__P));
            }
            this.__b = null;
        }
        var u = t.__e && v$1(d$1, null, n.fallback);
        return (
            u && (u.__h = null), [v$1(d$1, null, t.__e ? null : n.children), u]
        );
    });
var T = function (n, t, e) {
    if (
        (++e[1] === e[0] && n.o.delete(t),
        n.props.revealOrder && ("t" !== n.props.revealOrder[0] || !n.o.size))
    )
        for (e = n.u; e; ) {
            for (; e.length > 3; ) e.pop()();
            if (e[1] < e[0]) break;
            n.u = e = e[2];
        }
};
function D(n) {
    return (
        (this.getChildContext = function () {
            return n.context;
        }),
        n.children
    );
}
function I(n) {
    var t = this,
        e = n.i;
    (t.componentWillUnmount = function () {
        S$1(null, t.l), (t.l = null), (t.i = null);
    }),
        t.i && t.i !== e && t.componentWillUnmount(),
        n.__v
            ? (t.l ||
                  ((t.i = e),
                  (t.l = {
                      nodeType: 1,
                      parentNode: e,
                      childNodes: [],
                      appendChild: function (n) {
                          this.childNodes.push(n), t.i.appendChild(n);
                      },
                      insertBefore: function (n, e) {
                          this.childNodes.push(n), t.i.appendChild(n);
                      },
                      removeChild: function (n) {
                          this.childNodes.splice(
                              this.childNodes.indexOf(n) >>> 1,
                              1
                          ),
                              t.i.removeChild(n);
                      },
                  })),
              S$1(
                  v$1(
                      D,
                      {
                          context: t.context,
                      },
                      n.__v
                  ),
                  t.l
              ))
            : t.l && t.componentWillUnmount();
}
function W(n, t) {
    return v$1(I, {
        __v: n,
        i: t,
    });
}
((M.prototype = new _()).__e = function (n) {
    var t = this,
        e = U(t.__v),
        r = t.o.get(n);
    return (
        r[0]++,
        function (u) {
            var o = function () {
                t.props.revealOrder ? (r.push(u), T(t, n, r)) : u();
            };
            e ? e(o) : o();
        }
    );
}),
    (M.prototype.render = function (n) {
        (this.u = null), (this.o = new Map());
        var t = A$2(n.children);
        n.revealOrder && "b" === n.revealOrder[0] && t.reverse();
        for (var e = t.length; e--; )
            this.o.set(t[e], (this.u = [1, 0, this.u]));
        return n.children;
    }),
    (M.prototype.componentDidUpdate = M.prototype.componentDidMount =
        function () {
            var n = this;
            this.o.forEach(function (t, e) {
                T(n, e, t);
            });
        });
var j =
        ("undefined" != typeof Symbol &&
            Symbol.for &&
            Symbol.for("react.element")) ||
        60103,
    P =
        /^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|fill|flood|font|glyph(?!R)|horiz|marker(?!H|W|U)|overline|paint|stop|strikethrough|stroke|text(?!L)|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/,
    V = function (n) {
        return (
            "undefined" != typeof Symbol && "symbol" == typeof Symbol()
                ? /fil|che|rad/i
                : /fil|che|ra/i
        ).test(n);
    };
function z$1(n, t, e) {
    return (
        null == t.__k && (t.textContent = ""),
        S$1(n, t),
        "function" == typeof e && e(),
        n ? n.__c : null
    );
}
function B(n, t, e) {
    return q$2(n, t), "function" == typeof e && e(), n ? n.__c : null;
}
(_.prototype.isReactComponent = {}),
    [
        "componentWillMount",
        "componentWillReceiveProps",
        "componentWillUpdate",
    ].forEach(function (n) {
        Object.defineProperty(_.prototype, n, {
            configurable: !0,
            get: function () {
                return this["UNSAFE_" + n];
            },
            set: function (t) {
                Object.defineProperty(this, n, {
                    configurable: !0,
                    writable: !0,
                    value: t,
                });
            },
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
l$1.event = function (n) {
    return (
        H && (n = H(n)),
        (n.persist = Z),
        (n.isPropagationStopped = Y),
        (n.isDefaultPrevented = $),
        (n.nativeEvent = n)
    );
};
var q$1,
    G = {
        configurable: !0,
        get: function () {
            return this.class;
        },
    },
    J = l$1.vnode;
l$1.vnode = function (n) {
    var t = n.type,
        e = n.props,
        r = e;
    if ("string" == typeof t) {
        for (var u in ((r = {}), e)) {
            var o = e[u];
            ("value" === u && "defaultValue" in e && null == o) ||
                ("defaultValue" === u && "value" in e && null == e.value
                    ? (u = "value")
                    : "download" === u && !0 === o
                    ? (o = "")
                    : /ondoubleclick/i.test(u)
                    ? (u = "ondblclick")
                    : /^onchange(textarea|input)/i.test(u + t) && !V(e.type)
                    ? (u = "oninput")
                    : /^on(Ani|Tra|Tou|BeforeInp)/.test(u)
                    ? (u = u.toLowerCase())
                    : P.test(u)
                    ? (u = u.replace(/[A-Z0-9]/, "-$&").toLowerCase())
                    : null === o && (o = void 0),
                (r[u] = o));
        }
        "select" == t &&
            r.multiple &&
            Array.isArray(r.value) &&
            (r.value = A$2(e.children).forEach(function (n) {
                n.props.selected = -1 != r.value.indexOf(n.props.value);
            })),
            "select" == t &&
                null != r.defaultValue &&
                (r.value = A$2(e.children).forEach(function (n) {
                    n.props.selected = r.multiple
                        ? -1 != r.defaultValue.indexOf(n.props.value)
                        : r.defaultValue == n.props.value;
                })),
            (n.props = r);
    }
    t &&
        e.class != e.className &&
        ((G.enumerable = "className" in e),
        null != e.className && (r.class = e.className),
        Object.defineProperty(r, "className", G)),
        (n.$$typeof = j),
        J && J(n);
};
var K = l$1.__r;
l$1.__r = function (n) {
    K && K(n), (q$1 = n.__c);
};
var Q = {
    ReactCurrentDispatcher: {
        current: {
            readContext: function (n) {
                return q$1.__n[n.__c].props.value;
            },
        },
    },
};
function nn(n) {
    return v$1.bind(null, n);
}
function tn(n) {
    return !!n && n.$$typeof === j;
}
function en(n) {
    return tn(n) ? B$1.apply(null, arguments) : n;
}
function rn(n) {
    return !!n.__k && (S$1(null, n), !0);
}
function un(n) {
    return (n && (n.base || (1 === n.nodeType && n))) || null;
}
var on = function (n, t) {
        return n(t);
    },
    ln = function (n, t) {
        return n(t);
    };
const React = {
    useState: l$2,
    useReducer: p$1,
    useEffect: y$1,
    useLayoutEffect: h$1,
    useRef: s,
    useImperativeHandle: _$1,
    useMemo: d$2,
    useCallback: A$3,
    useContext: F$1,
    useDebugValue: T$1,
    version: "17.0.2",
    Children: k$1,
    render: z$1,
    hydrate: B,
    unmountComponentAtNode: rn,
    createPortal: W,
    createElement: v$1,
    createContext: D$1,
    createFactory: nn,
    cloneElement: en,
    createRef: p$2,
    Fragment: d$1,
    isValidElement: tn,
    findDOMNode: un,
    Component: _,
    PureComponent: E,
    memo: g$1,
    forwardRef: x$1,
    flushSync: ln,
    unstable_batchedUpdates: on,
    StrictMode: d$1,
    Suspense: L,
    SuspenseList: M,
    lazy: F,
    __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: Q,
};
var module$7 = {
        exports: {},
    },
    exports = module$7.exports;
var b = "function" === typeof Symbol && Symbol.for,
    c = b ? Symbol.for("react.element") : 60103,
    d = b ? Symbol.for("react.portal") : 60106,
    e = b ? Symbol.for("react.fragment") : 60107,
    f = b ? Symbol.for("react.strict_mode") : 60108,
    g = b ? Symbol.for("react.profiler") : 60114,
    h = b ? Symbol.for("react.provider") : 60109,
    k = b ? Symbol.for("react.context") : 60110,
    l = b ? Symbol.for("react.async_mode") : 60111,
    m = b ? Symbol.for("react.concurrent_mode") : 60111,
    n = b ? Symbol.for("react.forward_ref") : 60112,
    p = b ? Symbol.for("react.suspense") : 60113,
    q = b ? Symbol.for("react.suspense_list") : 60120,
    r = b ? Symbol.for("react.memo") : 60115,
    t = b ? Symbol.for("react.lazy") : 60116,
    v = b ? Symbol.for("react.block") : 60121,
    w = b ? Symbol.for("react.fundamental") : 60117,
    x = b ? Symbol.for("react.responder") : 60118,
    y = b ? Symbol.for("react.scope") : 60119;
function z(a) {
    if ("object" === typeof a && null !== a) {
        var u = a.$$typeof;
        switch (u) {
            case c:
                switch (((a = a.type), a)) {
                    case l:
                    case m:
                    case e:
                    case g:
                    case f:
                    case p:
                        return a;
                    default:
                        switch (((a = a && a.$$typeof), a)) {
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
exports.AsyncMode = l;
exports.ConcurrentMode = m;
exports.ContextConsumer = k;
exports.ContextProvider = h;
exports.Element = c;
exports.ForwardRef = n;
exports.Fragment = e;
exports.Lazy = t;
exports.Memo = r;
exports.Portal = d;
exports.Profiler = g;
exports.StrictMode = f;
exports.Suspense = p;
exports.isAsyncMode = function (a) {
    return A(a) || z(a) === l;
};
exports.isConcurrentMode = A;
exports.isContextConsumer = function (a) {
    return z(a) === k;
};
exports.isContextProvider = function (a) {
    return z(a) === h;
};
exports.isElement = function (a) {
    return "object" === typeof a && null !== a && a.$$typeof === c;
};
exports.isForwardRef = function (a) {
    return z(a) === n;
};
exports.isFragment = function (a) {
    return z(a) === e;
};
exports.isLazy = function (a) {
    return z(a) === t;
};
exports.isMemo = function (a) {
    return z(a) === r;
};
exports.isPortal = function (a) {
    return z(a) === d;
};
exports.isProfiler = function (a) {
    return z(a) === g;
};
exports.isStrictMode = function (a) {
    return z(a) === f;
};
exports.isSuspense = function (a) {
    return z(a) === p;
};
exports.isValidElementType = function (a) {
    return (
        "string" === typeof a ||
        "function" === typeof a ||
        a === e ||
        a === m ||
        a === g ||
        a === f ||
        a === p ||
        a === q ||
        ("object" === typeof a &&
            null !== a &&
            (a.$$typeof === t ||
                a.$$typeof === r ||
                a.$$typeof === h ||
                a.$$typeof === k ||
                a.$$typeof === n ||
                a.$$typeof === w ||
                a.$$typeof === x ||
                a.$$typeof === y ||
                a.$$typeof === v))
    );
};
exports.typeOf = z;

const reactIs_production_min = module$7.exports;
const $cjs$_cjs_react_is_production_min_js = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    default: reactIs_production_min,
});
function $$cjs_default$$$3(m, i) {
    for (i in m) if (i != "default") return m;
    return m.default || m;
}
var module$6 = {
    exports: {},
};
{
    module$6.exports = $$cjs_default$$$3($cjs$_cjs_react_is_production_min_js);
}

const index$1 = module$6.exports;
const $cjs$react_is = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    default: index$1,
});
var module$5 = {
    exports: {},
};

var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
    if (val === null || val === undefined) {
        throw new TypeError(
            "Object.assign cannot be called with null or undefined"
        );
    }

    return Object(val);
}

function shouldUseNative() {
    try {
        if (!Object.assign) {
            return false;
        }

        // Detect buggy property enumeration order in older V8 versions.

        // https://bugs.chromium.org/p/v8/issues/detail?id=4118
        var test1 = new String("abc");
        test1[5] = "de";
        if (Object.getOwnPropertyNames(test1)[0] === "5") {
            return false;
        }

        // https://bugs.chromium.org/p/v8/issues/detail?id=3056
        var test2 = {};
        for (var i = 0; i < 10; i++) {
            test2["_" + String.fromCharCode(i)] = i;
        }
        var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
            return test2[n];
        });
        if (order2.join("") !== "0123456789") {
            return false;
        }

        // https://bugs.chromium.org/p/v8/issues/detail?id=3056
        var test3 = {};
        "abcdefghijklmnopqrst".split("").forEach(function (letter) {
            test3[letter] = letter;
        });
        if (
            Object.keys(Object.assign({}, test3)).join("") !==
            "abcdefghijklmnopqrst"
        ) {
            return false;
        }

        return true;
    } catch (err) {
        // We don't expect any of the above to throw, but better to be safe.
        return false;
    }
}

module$5.exports = shouldUseNative()
    ? Object.assign
    : function (target, source) {
          var from;
          var to = toObject(target);
          var symbols;

          for (var s = 1; s < arguments.length; s++) {
              from = Object(arguments[s]);

              for (var key in from) {
                  if (hasOwnProperty.call(from, key)) {
                      to[key] = from[key];
                  }
              }

              if (getOwnPropertySymbols) {
                  symbols = getOwnPropertySymbols(from);
                  for (var i = 0; i < symbols.length; i++) {
                      if (propIsEnumerable.call(from, symbols[i])) {
                          to[symbols[i]] = from[symbols[i]];
                      }
                  }
              }
          }

          return to;
      };

const index = module$5.exports;
const $cjs$object_assign = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    default: index,
});
var module$4 = {
    exports: {},
};

var ReactPropTypesSecret$1 = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";

module$4.exports = ReactPropTypesSecret$1;

const ReactPropTypesSecret$2 = module$4.exports;
const $cjs$_lib_ReactPropTypesSecret = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    default: ReactPropTypesSecret$2,
});
var module$3 = {
    exports: {},
};

function checkPropTypes(typeSpecs, values, location, componentName, getStack) {}

checkPropTypes.resetWarningCache = function () {};

module$3.exports = checkPropTypes;

const checkPropTypes$1 = module$3.exports;
const $cjs$_checkPropTypes = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    default: checkPropTypes$1,
});
function $$cjs_default$$$2(m, i) {
    for (i in m) if (i != "default") return m;
    return m.default || m;
}
$$cjs_default$$$2($cjs$react_is);
$$cjs_default$$$2($cjs$object_assign);

$$cjs_default$$$2($cjs$_lib_ReactPropTypesSecret);
$$cjs_default$$$2($cjs$_checkPropTypes);

Function.call.bind(Object.prototype.hasOwnProperty);
function $$cjs_default$$$1(m, i) {
    for (i in m) if (i != "default") return m;
    return m.default || m;
}
var module$2 = {
    exports: {},
};

var ReactPropTypesSecret = $$cjs_default$$$1($cjs$_lib_ReactPropTypesSecret);

function emptyFunction() {}
function emptyFunctionWithReset() {}
emptyFunctionWithReset.resetWarningCache = emptyFunction;

module$2.exports = function () {
    function shim(
        props,
        propName,
        componentName,
        location,
        propFullName,
        secret
    ) {
        if (secret === ReactPropTypesSecret) {
            // It is still safe when called from React.
            return;
        }
        var err = new Error(
            "Calling PropTypes validators directly is not supported by the `prop-types` package. " +
                "Use PropTypes.checkPropTypes() to call them. " +
                "Read more at http://fb.me/use-check-prop-types"
        );
        err.name = "Invariant Violation";
        throw err;
    }
    shim.isRequired = shim;
    function getShim() {
        return shim;
    } // Important!
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
        resetWarningCache: emptyFunction,
    };

    ReactPropTypes.PropTypes = ReactPropTypes;

    return ReactPropTypes;
};

const factoryWithThrowingShims = module$2.exports;
const $cjs$_factoryWithThrowingShims = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    default: factoryWithThrowingShims,
});
function $$cjs_default$$(m, i) {
    for (i in m) if (i != "default") return m;
    return m.default || m;
}
var module$1 = {
    exports: {},
};

{
    // By explicitly using `prop-types` you are opting into new production behavior.
    // http://fb.me/prop-types-in-prod
    module$1.exports = $$cjs_default$$($cjs$_factoryWithThrowingShims)();
}

const PropTypes = module$1.exports;
function mergeClassNames() {
    return Array.prototype.slice
        .call(arguments)
        .reduce(function (classList, arg) {
            return typeof arg === "string" || Array.isArray(arg)
                ? classList.concat(arg)
                : classList;
        }, [])
        .filter(Boolean)
        .join(" ");
}
var module = {
    exports: {},
};

var FUNC_ERROR_TEXT = "Expected a function";

var INFINITY = 1 / 0,
    MAX_INTEGER = 1.7976931348623157e308,
    NAN = 0 / 0;

var symbolTag = "[object Symbol]";

var reTrim = /^\s+|\s+$/g;

var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

var reIsBinary = /^0b[01]+$/i;

var reIsOctal = /^0o[0-7]+$/i;

var freeParseInt = parseInt;

var objectProto = Object.prototype;

var objectToString = objectProto.toString;

function before(n, func) {
    var result;
    if (typeof func != "function") {
        throw new TypeError(FUNC_ERROR_TEXT);
    }
    n = toInteger(n);
    return function () {
        if (--n > 0) {
            result = func.apply(this, arguments);
        }
        if (n <= 1) {
            func = undefined;
        }
        return result;
    };
}

function once(func) {
    return before(2, func);
}

function isObject(value) {
    var type = typeof value;
    return !!value && (type == "object" || type == "function");
}

function isObjectLike(value) {
    return !!value && typeof value == "object";
}

function isSymbol(value) {
    return (
        typeof value == "symbol" ||
        (isObjectLike(value) && objectToString.call(value) == symbolTag)
    );
}

function toFinite(value) {
    if (!value) {
        return value === 0 ? value : 0;
    }
    value = toNumber(value);
    if (value === INFINITY || value === -INFINITY) {
        var sign = value < 0 ? -1 : 1;
        return sign * MAX_INTEGER;
    }
    return value === value ? value : 0;
}

function toInteger(value) {
    var result = toFinite(value),
        remainder = result % 1;

    return result === result ? (remainder ? result - remainder : result) : 0;
}

function toNumber(value) {
    if (typeof value == "number") {
        return value;
    }
    if (isSymbol(value)) {
        return NAN;
    }
    if (isObject(value)) {
        var other =
            typeof value.valueOf == "function" ? value.valueOf() : value;
        value = isObject(other) ? other + "" : other;
    }
    if (typeof value != "string") {
        return value === 0 ? value : +value;
    }
    value = value.replace(reTrim, "");
    var isBinary = reIsBinary.test(value);
    return isBinary || reIsOctal.test(value)
        ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
        : reIsBadHex.test(value)
        ? NAN
        : +value;
}

module.exports = once;

const once$1 = module.exports;
function filterDuplicates(arr) {
    return arr.filter(function (el, index, self) {
        return self.indexOf(el) === index;
    });
}

function fixLowercaseProperties(arr) {
    return arr.map(function (el) {
        if (!el || el.indexOf("-") === -1 || el.toLowerCase() !== el) {
            return el;
        }

        var splitEl = el.split("-");
        return "".concat(splitEl[0], "-").concat(splitEl[1].toUpperCase());
    });
}

function getUserLocalesInternal() {
    var languageList = [];

    if (typeof window !== "undefined") {
        if (window.navigator.languages) {
            languageList = languageList.concat(window.navigator.languages);
        }

        if (window.navigator.language) {
            languageList.push(window.navigator.language);
        }

        if (window.navigator.userLanguage) {
            languageList.push(window.navigator.userLanguage);
        }

        if (window.navigator.browserLanguage) {
            languageList.push(window.navigator.browserLanguage);
        }

        if (window.navigator.systemLanguage) {
            languageList.push(window.navigator.systemLanguage);
        }
    }

    languageList.push("en-US"); // Fallback

    return fixLowercaseProperties(filterDuplicates(languageList));
}

var getUserLocales = once$1(getUserLocalesInternal);

function getUserLocaleInternal() {
    return getUserLocales()[0];
}

var getUserLocale = once$1(getUserLocaleInternal);
/**
 * Utils
 */
function makeGetEdgeOfNeighbor(getPeriod, getEdgeOfPeriod, defaultOffset) {
    return function makeGetEdgeOfNeighborInternal(date) {
        var offset =
            arguments.length > 1 && arguments[1] !== undefined
                ? arguments[1]
                : defaultOffset;
        var previousPeriod = getPeriod(date) + offset;
        return getEdgeOfPeriod(previousPeriod);
    };
}

function makeGetEnd(getBeginOfNextPeriod) {
    return function makeGetEndInternal(date) {
        return new Date(getBeginOfNextPeriod(date).getTime() - 1);
    };
}

function makeGetRange(functions) {
    return function makeGetRangeInternal(date) {
        return functions.map(function (fn) {
            return fn(date);
        });
    };
}
/**
 * Simple getters - getting a property of a given point in time
 */

/**
 * Gets year from date.
 *
 * @param {Date|number|string} date Date to get year from.
 */

function getYear(date) {
    if (date instanceof Date) {
        return date.getFullYear();
    }

    if (typeof date === "number") {
        return date;
    }

    var year = parseInt(date, 10);

    if (typeof date === "string" && !isNaN(year)) {
        return year;
    }

    throw new Error("Failed to get year from date: ".concat(date, "."));
}
/**
 * Gets month from date.
 *
 * @param {Date} date Date to get month from.
 */

function getMonth(date) {
    if (date instanceof Date) {
        return date.getMonth();
    }

    throw new Error("Failed to get month from date: ".concat(date, "."));
}
/**
 * Gets human-readable day of the month from date.
 *
 * @param {Date} date Date to get day of the month from.
 */

function getDate(date) {
    if (date instanceof Date) {
        return date.getDate();
    }

    throw new Error("Failed to get year from date: ".concat(date, "."));
}
/**
 * Century
 */

function getCenturyStart(date) {
    var year = getYear(date);
    var centuryStartYear = year + ((-year + 1) % 100);
    var centuryStartDate = new Date();
    centuryStartDate.setFullYear(centuryStartYear, 0, 1);
    centuryStartDate.setHours(0, 0, 0, 0);
    return centuryStartDate;
}
var getPreviousCenturyStart = makeGetEdgeOfNeighbor(
    getYear,
    getCenturyStart,
    -100
);
var getNextCenturyStart = makeGetEdgeOfNeighbor(getYear, getCenturyStart, 100);
var getCenturyEnd = makeGetEnd(getNextCenturyStart);
var getPreviousCenturyEnd = makeGetEdgeOfNeighbor(getYear, getCenturyEnd, -100);
var getCenturyRange = makeGetRange([getCenturyStart, getCenturyEnd]);
/**
 * Decade
 */

function getDecadeStart(date) {
    var year = getYear(date);
    var decadeStartYear = year + ((-year + 1) % 10);
    var decadeStartDate = new Date();
    decadeStartDate.setFullYear(decadeStartYear, 0, 1);
    decadeStartDate.setHours(0, 0, 0, 0);
    return decadeStartDate;
}
var getPreviousDecadeStart = makeGetEdgeOfNeighbor(
    getYear,
    getDecadeStart,
    -10
);
var getNextDecadeStart = makeGetEdgeOfNeighbor(getYear, getDecadeStart, 10);
var getDecadeEnd = makeGetEnd(getNextDecadeStart);
var getPreviousDecadeEnd = makeGetEdgeOfNeighbor(getYear, getDecadeEnd, -10);
var getDecadeRange = makeGetRange([getDecadeStart, getDecadeEnd]);
/**
 * Year
 */

function getYearStart(date) {
    var year = getYear(date);
    var yearStartDate = new Date();
    yearStartDate.setFullYear(year, 0, 1);
    yearStartDate.setHours(0, 0, 0, 0);
    return yearStartDate;
}
var getPreviousYearStart = makeGetEdgeOfNeighbor(getYear, getYearStart, -1);
var getNextYearStart = makeGetEdgeOfNeighbor(getYear, getYearStart, 1);
var getYearEnd = makeGetEnd(getNextYearStart);
var getPreviousYearEnd = makeGetEdgeOfNeighbor(getYear, getYearEnd, -1);
var getYearRange = makeGetRange([getYearStart, getYearEnd]);
/**
 * Month
 */

function makeGetEdgeOfNeighborMonth(getEdgeOfPeriod, defaultOffset) {
    return function makeGetEdgeOfNeighborMonthInternal(date) {
        var offset =
            arguments.length > 1 && arguments[1] !== undefined
                ? arguments[1]
                : defaultOffset;
        var year = getYear(date);
        var month = getMonth(date) + offset;
        var previousPeriod = new Date();
        previousPeriod.setFullYear(year, month, 1);
        previousPeriod.setHours(0, 0, 0, 0);
        return getEdgeOfPeriod(previousPeriod);
    };
}

function getMonthStart(date) {
    var year = getYear(date);
    var month = getMonth(date);
    var monthStartDate = new Date();
    monthStartDate.setFullYear(year, month, 1);
    monthStartDate.setHours(0, 0, 0, 0);
    return monthStartDate;
}
var getPreviousMonthStart = makeGetEdgeOfNeighborMonth(getMonthStart, -1);
var getNextMonthStart = makeGetEdgeOfNeighborMonth(getMonthStart, 1);
var getMonthEnd = makeGetEnd(getNextMonthStart);
var getPreviousMonthEnd = makeGetEdgeOfNeighborMonth(getMonthEnd, -1);
var getMonthRange = makeGetRange([getMonthStart, getMonthEnd]);
/**
 * Day
 */

function makeGetEdgeOfNeighborDay(getEdgeOfPeriod, defaultOffset) {
    return function makeGetEdgeOfNeighborDayInternal(date) {
        var offset =
            arguments.length > 1 && arguments[1] !== undefined
                ? arguments[1]
                : defaultOffset;
        var year = getYear(date);
        var month = getMonth(date);
        var day = getDate(date) + offset;
        var previousPeriod = new Date();
        previousPeriod.setFullYear(year, month, day);
        previousPeriod.setHours(0, 0, 0, 0);
        return getEdgeOfPeriod(previousPeriod);
    };
}

function getDayStart(date) {
    var year = getYear(date);
    var month = getMonth(date);
    var day = getDate(date);
    var dayStartDate = new Date();
    dayStartDate.setFullYear(year, month, day);
    dayStartDate.setHours(0, 0, 0, 0);
    return dayStartDate;
}
var getNextDayStart = makeGetEdgeOfNeighborDay(getDayStart, 1);
var getDayEnd = makeGetEnd(getNextDayStart);
var getDayRange = makeGetRange([getDayStart, getDayEnd]);
/**
 * Other
 */

/**
 * Returns a number of days in a month of a given date.
 *
 * @param {Date} date Date.
 */

function getDaysInMonth(date) {
    return getDate(getMonthEnd(date));
}
var _CALENDAR_TYPE_LOCALE;

function _toConsumableArray$2(arr) {
    return (
        _arrayWithoutHoles$2(arr) ||
        _iterableToArray$2(arr) ||
        _unsupportedIterableToArray$2(arr) ||
        _nonIterableSpread$2()
    );
}

function _nonIterableSpread$2() {
    throw new TypeError(
        "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
    );
}

function _unsupportedIterableToArray$2(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray$2(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
        return _arrayLikeToArray$2(o, minLen);
}

function _iterableToArray$2(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter))
        return Array.from(iter);
}

function _arrayWithoutHoles$2(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray$2(arr);
}

function _arrayLikeToArray$2(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) {
        arr2[i] = arr[i];
    }
    return arr2;
}

function _defineProperty$c(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true,
        });
    } else {
        obj[key] = value;
    }
    return obj;
}

var CALENDAR_TYPES = {
    ARABIC: "Arabic",
    HEBREW: "Hebrew",
    ISO_8601: "ISO 8601",
    US: "US",
};
var CALENDAR_TYPE_LOCALES =
    ((_CALENDAR_TYPE_LOCALE = {}),
    _defineProperty$c(_CALENDAR_TYPE_LOCALE, CALENDAR_TYPES.US, [
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
        "pt-BR",
    ]),
    _defineProperty$c(_CALENDAR_TYPE_LOCALE, CALENDAR_TYPES.ARABIC, [
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
        "ps-AR",
    ]),
    _defineProperty$c(_CALENDAR_TYPE_LOCALE, CALENDAR_TYPES.HEBREW, [
        "he",
        "he-IL",
    ]),
    _CALENDAR_TYPE_LOCALE);
var WEEKDAYS = _toConsumableArray$2(Array(7)).map(function (el, index) {
    return index;
});
function getFormatter(options) {
    return function (locale, date) {
        return date.toLocaleString(locale || getUserLocale(), options);
    };
}
/**
 * Changes the hour in a Date to ensure right date formatting even if DST is messed up.
 * Workaround for bug in WebKit and Firefox with historical dates.
 * For more details, see:
 * https://bugs.chromium.org/p/chromium/issues/detail?id=750465
 * https://bugzilla.mozilla.org/show_bug.cgi?id=1385643
 *
 * @param {Date} date Date.
 */

function toSafeHour(date) {
    var safeDate = new Date(date);
    return new Date(safeDate.setHours(12));
}

function getSafeFormatter(options) {
    return function (locale, date) {
        return getFormatter(options)(locale, toSafeHour(date));
    };
}
var formatDayOptions = {
    day: "numeric",
};
var formatLongDateOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
};
var formatMonthOptions = {
    month: "long",
};
var formatMonthYearOptions = {
    month: "long",
    year: "numeric",
};
var formatShortWeekdayOptions = {
    weekday: "short",
};
var formatWeekdayOptions = {
    weekday: "long",
};
var formatYearOptions = {
    year: "numeric",
};
var formatDay = getSafeFormatter(formatDayOptions);
var formatLongDate = getSafeFormatter(formatLongDateOptions);
var formatMonth = getSafeFormatter(formatMonthOptions);
var formatMonthYear = getSafeFormatter(formatMonthYearOptions);
var formatShortWeekday = getSafeFormatter(formatShortWeekdayOptions);
var formatWeekday = getSafeFormatter(formatWeekdayOptions);
var formatYear = getSafeFormatter(formatYearOptions);
var SUNDAY = WEEKDAYS[0];
var FRIDAY = WEEKDAYS[5];
var SATURDAY = WEEKDAYS[6];
/* Simple getters - getting a property of a given point in time */

function getDayOfWeek(date) {
    var calendarType =
        arguments.length > 1 && arguments[1] !== undefined
            ? arguments[1]
            : CALENDAR_TYPES.ISO_8601;
    var weekday = date.getDay();

    switch (calendarType) {
        case CALENDAR_TYPES.ISO_8601:
            // Shifts days of the week so that Monday is 0, Sunday is 6
            return (weekday + 6) % 7;

        case CALENDAR_TYPES.ARABIC:
            return (weekday + 1) % 7;

        case CALENDAR_TYPES.HEBREW:
        case CALENDAR_TYPES.US:
            return weekday;

        default:
            throw new Error("Unsupported calendar type.");
    }
}
/**
 * Century
 */

function getBeginOfCenturyYear(date) {
    var beginOfCentury = getCenturyStart(date);
    return getYear(beginOfCentury);
}
/**
 * Decade
 */

function getBeginOfDecadeYear(date) {
    var beginOfDecade = getDecadeStart(date);
    return getYear(beginOfDecade);
}
/**
 * Week
 */

/**
 * Returns the beginning of a given week.
 *
 * @param {Date} date Date.
 * @param {string} calendarType Calendar type. Can be ISO 8601 or US.
 */

function getBeginOfWeek(date) {
    var calendarType =
        arguments.length > 1 && arguments[1] !== undefined
            ? arguments[1]
            : CALENDAR_TYPES.ISO_8601;
    var year = getYear(date);
    var monthIndex = getMonth(date);
    var day = date.getDate() - getDayOfWeek(date, calendarType);
    return new Date(year, monthIndex, day);
}
/**
 * Gets week number according to ISO 8601 or US standard.
 * In ISO 8601, Arabic and Hebrew week 1 is the one with January 4.
 * In US calendar week 1 is the one with January 1.
 *
 * @param {Date} date Date.
 * @param {string} calendarType Calendar type. Can be ISO 8601 or US.
 */

function getWeekNumber(date) {
    var calendarType =
        arguments.length > 1 && arguments[1] !== undefined
            ? arguments[1]
            : CALENDAR_TYPES.ISO_8601;
    var calendarTypeForWeekNumber =
        calendarType === CALENDAR_TYPES.US
            ? CALENDAR_TYPES.US
            : CALENDAR_TYPES.ISO_8601;
    var beginOfWeek = getBeginOfWeek(date, calendarTypeForWeekNumber);
    var year = getYear(date) + 1;
    var dayInWeekOne;
    var beginOfFirstWeek; // Look for the first week one that does not come after a given date

    do {
        dayInWeekOne = new Date(
            year,
            0,
            calendarTypeForWeekNumber === CALENDAR_TYPES.ISO_8601 ? 4 : 1
        );
        beginOfFirstWeek = getBeginOfWeek(
            dayInWeekOne,
            calendarTypeForWeekNumber
        );
        year -= 1;
    } while (date - beginOfFirstWeek < 0);

    return Math.round((beginOfWeek - beginOfFirstWeek) / (8.64e7 * 7)) + 1;
}
/**
 * Others
 */

/**
 * Returns the beginning of a given range.
 *
 * @param {string} rangeType Range type (e.g. 'day')
 * @param {Date} date Date.
 */

function getBegin(rangeType, date) {
    switch (rangeType) {
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
            throw new Error("Invalid rangeType: ".concat(rangeType));
    }
}
function getBeginPrevious(rangeType, date) {
    switch (rangeType) {
        case "century":
            return getPreviousCenturyStart(date);

        case "decade":
            return getPreviousDecadeStart(date);

        case "year":
            return getPreviousYearStart(date);

        case "month":
            return getPreviousMonthStart(date);

        default:
            throw new Error("Invalid rangeType: ".concat(rangeType));
    }
}
function getBeginNext(rangeType, date) {
    switch (rangeType) {
        case "century":
            return getNextCenturyStart(date);

        case "decade":
            return getNextDecadeStart(date);

        case "year":
            return getNextYearStart(date);

        case "month":
            return getNextMonthStart(date);

        default:
            throw new Error("Invalid rangeType: ".concat(rangeType));
    }
}
var getBeginPrevious2 = function getBeginPrevious2(rangeType, date) {
    switch (rangeType) {
        case "decade":
            return getPreviousDecadeStart(date, -100);

        case "year":
            return getPreviousYearStart(date, -10);

        case "month":
            return getPreviousMonthStart(date, -12);

        default:
            throw new Error("Invalid rangeType: ".concat(rangeType));
    }
};
var getBeginNext2 = function getBeginNext2(rangeType, date) {
    switch (rangeType) {
        case "decade":
            return getNextDecadeStart(date, 100);

        case "year":
            return getNextYearStart(date, 10);

        case "month":
            return getNextMonthStart(date, 12);

        default:
            throw new Error("Invalid rangeType: ".concat(rangeType));
    }
};
/**
 * Returns the end of a given range.
 *
 * @param {string} rangeType Range type (e.g. 'day')
 * @param {Date} date Date.
 */

function getEnd(rangeType, date) {
    switch (rangeType) {
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
            throw new Error("Invalid rangeType: ".concat(rangeType));
    }
}
function getEndPrevious(rangeType, date) {
    switch (rangeType) {
        case "century":
            return getPreviousCenturyEnd(date);

        case "decade":
            return getPreviousDecadeEnd(date);

        case "year":
            return getPreviousYearEnd(date);

        case "month":
            return getPreviousMonthEnd(date);

        default:
            throw new Error("Invalid rangeType: ".concat(rangeType));
    }
}
var getEndPrevious2 = function getEndPrevious2(rangeType, date) {
    switch (rangeType) {
        case "decade":
            return getPreviousDecadeEnd(date, -100);

        case "year":
            return getPreviousYearEnd(date, -10);

        case "month":
            return getPreviousMonthEnd(date, -12);

        default:
            throw new Error("Invalid rangeType: ".concat(rangeType));
    }
};
/**
 * Returns an array with the beginning and the end of a given range.
 *
 * @param {string} rangeType Range type (e.g. 'day')
 * @param {Date} date Date.
 */

function getRange(rangeType, date) {
    switch (rangeType) {
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
            throw new Error("Invalid rangeType: ".concat(rangeType));
    }
}
/**
 * Creates a range out of two values, ensuring they are in order and covering entire period ranges.
 *
 * @param {string} rangeType Range type (e.g. 'day')
 * @param {Date} date1 First date.
 * @param {Date} date2 Second date.
 */

function getValueRange(rangeType, date1, date2) {
    var rawNextValue = [date1, date2].sort(function (a, b) {
        return a - b;
    });
    return [
        getBegin(rangeType, rawNextValue[0]),
        getEnd(rangeType, rawNextValue[1]),
    ];
}

function toYearLabel(locale) {
    var formatYear$1 =
        arguments.length > 1 && arguments[1] !== undefined
            ? arguments[1]
            : formatYear;
    var dates = arguments.length > 2 ? arguments[2] : undefined;
    return dates
        .map(function (date) {
            return formatYear$1(locale, date);
        })
        .join(" – ");
}
/**
 * Returns a string labelling a century of a given date.
 * For example, for 2017 it will return 2001-2100.
 *
 * @param {Date|String|Number} date Date or a year as a string or as a number.
 */

function getCenturyLabel(locale, formatYear, date) {
    return toYearLabel(locale, formatYear, getCenturyRange(date));
}
/**
 * Returns a string labelling a century of a given date.
 * For example, for 2017 it will return 2011-2020.
 *
 * @param {Date|String|Number} date Date or a year as a string or as a number.
 */

function getDecadeLabel(locale, formatYear, date) {
    return toYearLabel(locale, formatYear, getDecadeRange(date));
}
/**
 * Returns a boolean determining whether a given date is on Saturday or Sunday.
 *
 * @param {Date} date Date.
 */

function isWeekend(date) {
    var calendarType =
        arguments.length > 1 && arguments[1] !== undefined
            ? arguments[1]
            : CALENDAR_TYPES.ISO_8601;
    var weekday = date.getDay();

    switch (calendarType) {
        case CALENDAR_TYPES.ARABIC:
        case CALENDAR_TYPES.HEBREW:
            return weekday === FRIDAY || weekday === SATURDAY;

        case CALENDAR_TYPES.ISO_8601:
        case CALENDAR_TYPES.US:
            return weekday === SATURDAY || weekday === SUNDAY;

        default:
            throw new Error("Unsupported calendar type.");
    }
}
function _typeof$2(obj) {
    "@babel/helpers - typeof";
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        _typeof$2 = function _typeof(obj) {
            return typeof obj;
        };
    } else {
        _typeof$2 = function _typeof(obj) {
            return obj &&
                typeof Symbol === "function" &&
                obj.constructor === Symbol &&
                obj !== Symbol.prototype
                ? "symbol"
                : typeof obj;
        };
    }
    return _typeof$2(obj);
}
var calendarTypes = Object.values(CALENDAR_TYPES);
var allViews$1 = ["century", "decade", "year", "month"];
var isCalendarType = PropTypes.oneOf(calendarTypes);
var isClassName = PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
]);
var isMinDate = function isMinDate(props, propName, componentName) {
    var minDate = props[propName];

    if (!minDate) {
        return null;
    }

    if (!(minDate instanceof Date)) {
        return new Error(
            "Invalid prop `"
                .concat(propName, "` of type `")
                .concat(_typeof$2(minDate), "` supplied to `")
                .concat(componentName, "`, expected instance of `Date`.")
        );
    }

    var maxDate = props.maxDate;

    if (maxDate && minDate > maxDate) {
        return new Error(
            "Invalid prop `"
                .concat(propName, "` of type `")
                .concat(_typeof$2(minDate), "` supplied to `")
                .concat(
                    componentName,
                    "`, minDate cannot be larger than maxDate."
                )
        );
    }

    return null;
};
var isMaxDate = function isMaxDate(props, propName, componentName) {
    var maxDate = props[propName];

    if (!maxDate) {
        return null;
    }

    if (!(maxDate instanceof Date)) {
        return new Error(
            "Invalid prop `"
                .concat(propName, "` of type `")
                .concat(_typeof$2(maxDate), "` supplied to `")
                .concat(componentName, "`, expected instance of `Date`.")
        );
    }

    var minDate = props.minDate;

    if (minDate && maxDate < minDate) {
        return new Error(
            "Invalid prop `"
                .concat(propName, "` of type `")
                .concat(_typeof$2(maxDate), "` supplied to `")
                .concat(
                    componentName,
                    "`, maxDate cannot be smaller than minDate."
                )
        );
    }

    return null;
};
var isRef = PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
        current: PropTypes.any,
    }),
]);
var isValue = PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.arrayOf(PropTypes.instanceOf(Date)),
]);
var isViews = PropTypes.arrayOf(PropTypes.oneOf(allViews$1));
var isView = function isView(props, propName, componentName) {
    var view = props[propName];
    var views = props.views;
    var allowedViews = views || allViews$1;

    if (view !== undefined && allowedViews.indexOf(view) === -1) {
        return new Error(
            "Invalid prop `"
                .concat(propName, "` of value `")
                .concat(view, "` supplied to `")
                .concat(componentName, "`, expected one of [")
                .concat(
                    allowedViews
                        .map(function (a) {
                            return '"'.concat(a, '"');
                        })
                        .join(", "),
                    "]."
                )
        );
    } // Everything is fine

    return null;
};

isView.isRequired = function (props, propName, componentName) {
    var view = props[propName];

    if (!view) {
        return new Error(
            "The prop `"
                .concat(propName, "` is marked as required in `")
                .concat(componentName, "`, but its value is `")
                .concat(view, "`.")
        );
    }

    return isView(props, propName, componentName);
};

var tileGroupProps = {
    activeStartDate: PropTypes.instanceOf(Date).isRequired,
    hover: PropTypes.instanceOf(Date),
    locale: PropTypes.string,
    maxDate: isMaxDate,
    minDate: isMinDate,
    onClick: PropTypes.func,
    onMouseOver: PropTypes.func,
    tileClassName: PropTypes.oneOfType([PropTypes.func, isClassName]),
    tileContent: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
    value: isValue,
    valueType: PropTypes.string,
};
var tileProps = {
    activeStartDate: PropTypes.instanceOf(Date).isRequired,
    classes: PropTypes.arrayOf(PropTypes.string).isRequired,
    date: PropTypes.instanceOf(Date).isRequired,
    locale: PropTypes.string,
    maxDate: isMaxDate,
    minDate: isMinDate,
    onClick: PropTypes.func,
    onMouseOver: PropTypes.func,
    style: PropTypes.objectOf(
        PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    ),
    tileClassName: PropTypes.oneOfType([PropTypes.func, isClassName]),
    tileContent: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
    tileDisabled: PropTypes.func,
};
var className$5 = "react-calendar__navigation";
function Navigation(_ref) {
    var activeStartDate = _ref.activeStartDate,
        drillUp = _ref.drillUp,
        _ref$formatMonthYear = _ref.formatMonthYear,
        formatMonthYear$1 =
            _ref$formatMonthYear === void 0
                ? formatMonthYear
                : _ref$formatMonthYear,
        _ref$formatYear = _ref.formatYear,
        formatYear$1 =
            _ref$formatYear === void 0 ? formatYear : _ref$formatYear,
        locale = _ref.locale,
        maxDate = _ref.maxDate,
        minDate = _ref.minDate,
        _ref$navigationAriaLa = _ref.navigationAriaLabel,
        navigationAriaLabel =
            _ref$navigationAriaLa === void 0 ? "" : _ref$navigationAriaLa,
        navigationLabel = _ref.navigationLabel,
        _ref$next2AriaLabel = _ref.next2AriaLabel,
        next2AriaLabel =
            _ref$next2AriaLabel === void 0 ? "" : _ref$next2AriaLabel,
        _ref$next2Label = _ref.next2Label,
        next2Label = _ref$next2Label === void 0 ? "»" : _ref$next2Label,
        _ref$nextAriaLabel = _ref.nextAriaLabel,
        nextAriaLabel = _ref$nextAriaLabel === void 0 ? "" : _ref$nextAriaLabel,
        _ref$nextLabel = _ref.nextLabel,
        nextLabel = _ref$nextLabel === void 0 ? "›" : _ref$nextLabel,
        _ref$prev2AriaLabel = _ref.prev2AriaLabel,
        prev2AriaLabel =
            _ref$prev2AriaLabel === void 0 ? "" : _ref$prev2AriaLabel,
        _ref$prev2Label = _ref.prev2Label,
        prev2Label = _ref$prev2Label === void 0 ? "«" : _ref$prev2Label,
        _ref$prevAriaLabel = _ref.prevAriaLabel,
        prevAriaLabel = _ref$prevAriaLabel === void 0 ? "" : _ref$prevAriaLabel,
        _ref$prevLabel = _ref.prevLabel,
        prevLabel = _ref$prevLabel === void 0 ? "‹" : _ref$prevLabel,
        setActiveStartDate = _ref.setActiveStartDate,
        showDoubleView = _ref.showDoubleView,
        view = _ref.view,
        views = _ref.views;
    var drillUpAvailable = views.indexOf(view) > 0;
    var shouldShowPrevNext2Buttons = view !== "century";
    var previousActiveStartDate = getBeginPrevious(view, activeStartDate);
    var previousActiveStartDate2 =
        shouldShowPrevNext2Buttons && getBeginPrevious2(view, activeStartDate);
    var nextActiveStartDate = getBeginNext(view, activeStartDate);
    var nextActiveStartDate2 =
        shouldShowPrevNext2Buttons && getBeginNext2(view, activeStartDate);

    var prevButtonDisabled = (function () {
        if (previousActiveStartDate.getFullYear() < 0) {
            return true;
        }

        var previousActiveEndDate = getEndPrevious(view, activeStartDate);
        return minDate && minDate >= previousActiveEndDate;
    })();

    var prev2ButtonDisabled =
        shouldShowPrevNext2Buttons &&
        (function () {
            if (previousActiveStartDate2.getFullYear() < 0) {
                return true;
            }

            var previousActiveEndDate = getEndPrevious2(view, activeStartDate);
            return minDate && minDate >= previousActiveEndDate;
        })();

    var nextButtonDisabled = maxDate && maxDate <= nextActiveStartDate;
    var next2ButtonDisabled =
        shouldShowPrevNext2Buttons &&
        maxDate &&
        maxDate <= nextActiveStartDate2;

    function onClickPrevious() {
        setActiveStartDate(previousActiveStartDate);
    }

    function onClickPrevious2() {
        setActiveStartDate(previousActiveStartDate2);
    }

    function onClickNext() {
        setActiveStartDate(nextActiveStartDate);
    }

    function onClickNext2() {
        setActiveStartDate(nextActiveStartDate2);
    }

    function renderLabel(date) {
        var label = (function () {
            switch (view) {
                case "century":
                    return getCenturyLabel(locale, formatYear$1, date);

                case "decade":
                    return getDecadeLabel(locale, formatYear$1, date);

                case "year":
                    return formatYear$1(locale, date);

                case "month":
                    return formatMonthYear$1(locale, date);

                default:
                    throw new Error("Invalid view: ".concat(view, "."));
            }
        })();

        return navigationLabel
            ? navigationLabel({
                  date: date,
                  label: label,
                  locale: locale || getUserLocale(),
                  view: view,
              })
            : label;
    }

    function renderButton() {
        var labelClassName = "".concat(className$5, "__label");
        return /*#__PURE__*/ React.createElement(
            "button",
            {
                "aria-label": navigationAriaLabel,
                className: labelClassName,
                disabled: !drillUpAvailable,
                onClick: drillUp,
                style: {
                    flexGrow: 1,
                },
                type: "button",
            },
            /*#__PURE__*/ React.createElement(
                "span",
                {
                    className: ""
                        .concat(labelClassName, "__labelText ")
                        .concat(labelClassName, "__labelText--from"),
                },
                renderLabel(activeStartDate)
            ),
            showDoubleView &&
                /*#__PURE__*/ React.createElement(
                    React.Fragment,
                    null,
                    /*#__PURE__*/ React.createElement(
                        "span",
                        {
                            className: "".concat(labelClassName, "__divider"),
                        },
                        " ",
                        "\u2013",
                        " "
                    ),
                    /*#__PURE__*/ React.createElement(
                        "span",
                        {
                            className: ""
                                .concat(labelClassName, "__labelText ")
                                .concat(labelClassName, "__labelText--to"),
                        },
                        renderLabel(nextActiveStartDate)
                    )
                )
        );
    }

    return /*#__PURE__*/ React.createElement(
        "div",
        {
            className: className$5,
            style: {
                display: "flex",
            },
        },
        prev2Label !== null &&
            shouldShowPrevNext2Buttons &&
            /*#__PURE__*/ React.createElement(
                "button",
                {
                    "aria-label": prev2AriaLabel,
                    className: ""
                        .concat(className$5, "__arrow ")
                        .concat(className$5, "__prev2-button"),
                    disabled: prev2ButtonDisabled,
                    onClick: onClickPrevious2,
                    type: "button",
                },
                prev2Label
            ),
        prevLabel !== null &&
            /*#__PURE__*/ React.createElement(
                "button",
                {
                    "aria-label": prevAriaLabel,
                    className: ""
                        .concat(className$5, "__arrow ")
                        .concat(className$5, "__prev-button"),
                    disabled: prevButtonDisabled,
                    onClick: onClickPrevious,
                    type: "button",
                },
                prevLabel
            ),
        renderButton(),
        nextLabel !== null &&
            /*#__PURE__*/ React.createElement(
                "button",
                {
                    "aria-label": nextAriaLabel,
                    className: ""
                        .concat(className$5, "__arrow ")
                        .concat(className$5, "__next-button"),
                    disabled: nextButtonDisabled,
                    onClick: onClickNext,
                    type: "button",
                },
                nextLabel
            ),
        next2Label !== null &&
            shouldShowPrevNext2Buttons &&
            /*#__PURE__*/ React.createElement(
                "button",
                {
                    "aria-label": next2AriaLabel,
                    className: ""
                        .concat(className$5, "__arrow ")
                        .concat(className$5, "__next2-button"),
                    disabled: next2ButtonDisabled,
                    onClick: onClickNext2,
                    type: "button",
                },
                next2Label
            )
    );
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
    views: isViews.isRequired,
};
function _extends$c() {
    _extends$c =
        Object.assign ||
        function (target) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                for (var key in source) {
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                        target[key] = source[key];
                    }
                }
            }
            return target;
        };
    return _extends$c.apply(this, arguments);
}

function ownKeys$b(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly)
            symbols = symbols.filter(function (sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        keys.push.apply(keys, symbols);
    }
    return keys;
}

function _objectSpread$b(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i] != null ? arguments[i] : {};
        if (i % 2) {
            ownKeys$b(Object(source), true).forEach(function (key) {
                _defineProperty$b(target, key, source[key]);
            });
        } else if (Object.getOwnPropertyDescriptors) {
            Object.defineProperties(
                target,
                Object.getOwnPropertyDescriptors(source)
            );
        } else {
            ownKeys$b(Object(source)).forEach(function (key) {
                Object.defineProperty(
                    target,
                    key,
                    Object.getOwnPropertyDescriptor(source, key)
                );
            });
        }
    }
    return target;
}

function _defineProperty$b(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true,
        });
    } else {
        obj[key] = value;
    }
    return obj;
}

function _objectWithoutProperties$8(source, excluded) {
    if (source == null) return {};
    var target = _objectWithoutPropertiesLoose$8(source, excluded);
    var key, i;
    if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
        for (i = 0; i < sourceSymbolKeys.length; i++) {
            key = sourceSymbolKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key))
                continue;
            target[key] = source[key];
        }
    }
    return target;
}

function _objectWithoutPropertiesLoose$8(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for (i = 0; i < sourceKeys.length; i++) {
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        target[key] = source[key];
    }
    return target;
}

function toPercent(num) {
    return "".concat(num, "%");
}

function Flex(_ref) {
    var children = _ref.children,
        className = _ref.className,
        direction = _ref.direction,
        count = _ref.count,
        offset = _ref.offset,
        style = _ref.style,
        wrap = _ref.wrap,
        otherProps = _objectWithoutProperties$8(_ref, [
            "children",
            "className",
            "direction",
            "count",
            "offset",
            "style",
            "wrap",
        ]);

    return /*#__PURE__*/ React.createElement(
        "div",
        _extends$c(
            {
                className: className,
                style: _objectSpread$b(
                    {
                        display: "flex",
                        flexDirection: direction,
                        flexWrap: wrap ? "wrap" : "no-wrap",
                    },
                    style
                ),
            },
            otherProps
        ),
        React.Children.map(children, function (child, index) {
            return /*#__PURE__*/ React.cloneElement(
                child,
                _objectSpread$b(
                    _objectSpread$b({}, child.props),
                    {},
                    {
                        style: {
                            flexBasis: toPercent(100 / count),
                            maxWidth: toPercent(100 / count),
                            overflow: "hidden",
                            marginLeft:
                                offset && index === 0
                                    ? toPercent((100 * offset) / count)
                                    : null,
                        },
                    }
                )
            );
        })
    );
}
Flex.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    count: PropTypes.number.isRequired,
    direction: PropTypes.string,
    offset: PropTypes.number,
    style: PropTypes.objectOf(
        PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    ),
    wrap: PropTypes.bool,
};
function _toConsumableArray$1(arr) {
    return (
        _arrayWithoutHoles$1(arr) ||
        _iterableToArray$1(arr) ||
        _unsupportedIterableToArray$1(arr) ||
        _nonIterableSpread$1()
    );
}

function _nonIterableSpread$1() {
    throw new TypeError(
        "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
    );
}

function _unsupportedIterableToArray$1(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray$1(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
        return _arrayLikeToArray$1(o, minLen);
}

function _iterableToArray$1(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter))
        return Array.from(iter);
}

function _arrayWithoutHoles$1(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray$1(arr);
}

function _arrayLikeToArray$1(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) {
        arr2[i] = arr[i];
    }
    return arr2;
}
/**
 * Returns a value no smaller than min and no larger than max.
 *
 * @param {*} value Value to return.
 * @param {*} min Minimum return value.
 * @param {*} max Maximum return value.
 */

function between(value, min, max) {
    if (min && min > value) {
        return min;
    }

    if (max && max < value) {
        return max;
    }

    return value;
}
function isValueWithinRange(value, range) {
    return range[0] <= value && range[1] >= value;
}
function isRangeWithinRange(greaterRange, smallerRange) {
    return (
        greaterRange[0] <= smallerRange[0] && greaterRange[1] >= smallerRange[1]
    );
}
function doRangesOverlap(range1, range2) {
    return (
        isValueWithinRange(range1[0], range2) ||
        isValueWithinRange(range1[1], range2)
    );
}

function getRangeClassNames(valueRange, dateRange, baseClassName) {
    var isRange = doRangesOverlap(dateRange, valueRange);
    var classes = [];

    if (isRange) {
        classes.push(baseClassName);
        var isRangeStart = isValueWithinRange(valueRange[0], dateRange);
        var isRangeEnd = isValueWithinRange(valueRange[1], dateRange);

        if (isRangeStart) {
            classes.push("".concat(baseClassName, "Start"));
        }

        if (isRangeEnd) {
            classes.push("".concat(baseClassName, "End"));
        }

        if (isRangeStart && isRangeEnd) {
            classes.push("".concat(baseClassName, "BothEnds"));
        }
    }

    return classes;
}

function getTileClasses() {
    var _ref =
            arguments.length > 0 && arguments[0] !== undefined
                ? arguments[0]
                : {},
        value = _ref.value,
        valueType = _ref.valueType,
        date = _ref.date,
        dateType = _ref.dateType,
        hover = _ref.hover;

    var className = "react-calendar__tile";
    var classes = [className];

    if (!date) {
        return classes;
    }

    if (!Array.isArray(date) && !dateType) {
        throw new Error(
            "getTileClasses(): Unable to get tile activity classes because one or more required arguments were not passed."
        );
    }

    var now = new Date();
    var dateRange = Array.isArray(date) ? date : getRange(dateType, date);

    if (isValueWithinRange(now, dateRange)) {
        classes.push("".concat(className, "--now"));
    }

    if (!value) {
        return classes;
    }

    if (!Array.isArray(value) && !valueType) {
        throw new Error(
            "getTileClasses(): Unable to get tile activity classes because one or more required arguments were not passed."
        );
    }

    var valueRange = Array.isArray(value) ? value : getRange(valueType, value);

    if (isRangeWithinRange(valueRange, dateRange)) {
        classes.push("".concat(className, "--active"));
    } else if (doRangesOverlap(valueRange, dateRange)) {
        classes.push("".concat(className, "--hasActive"));
    }

    var valueRangeClassNames = getRangeClassNames(
        valueRange,
        dateRange,
        "".concat(className, "--range")
    );
    classes.push.apply(classes, _toConsumableArray$1(valueRangeClassNames));

    if (hover) {
        var hoverRange =
            hover > valueRange[1]
                ? [valueRange[1], hover]
                : [hover, valueRange[0]];
        var hoverRangeClassNames = getRangeClassNames(
            hoverRange,
            dateRange,
            "".concat(className, "--hover")
        );
        classes.push.apply(classes, _toConsumableArray$1(hoverRangeClassNames));
    }

    return classes;
}
function ownKeys$a(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly)
            symbols = symbols.filter(function (sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        keys.push.apply(keys, symbols);
    }
    return keys;
}

function _objectSpread$a(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i] != null ? arguments[i] : {};
        if (i % 2) {
            ownKeys$a(Object(source), true).forEach(function (key) {
                _defineProperty$a(target, key, source[key]);
            });
        } else if (Object.getOwnPropertyDescriptors) {
            Object.defineProperties(
                target,
                Object.getOwnPropertyDescriptors(source)
            );
        } else {
            ownKeys$a(Object(source)).forEach(function (key) {
                Object.defineProperty(
                    target,
                    key,
                    Object.getOwnPropertyDescriptor(source, key)
                );
            });
        }
    }
    return target;
}

function _defineProperty$a(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true,
        });
    } else {
        obj[key] = value;
    }
    return obj;
}

function _extends$b() {
    _extends$b =
        Object.assign ||
        function (target) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                for (var key in source) {
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                        target[key] = source[key];
                    }
                }
            }
            return target;
        };
    return _extends$b.apply(this, arguments);
}

function _objectWithoutProperties$7(source, excluded) {
    if (source == null) return {};
    var target = _objectWithoutPropertiesLoose$7(source, excluded);
    var key, i;
    if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
        for (i = 0; i < sourceSymbolKeys.length; i++) {
            key = sourceSymbolKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key))
                continue;
            target[key] = source[key];
        }
    }
    return target;
}

function _objectWithoutPropertiesLoose$7(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for (i = 0; i < sourceKeys.length; i++) {
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        target[key] = source[key];
    }
    return target;
}
function TileGroup(_ref) {
    var className = _ref.className,
        _ref$count = _ref.count,
        count = _ref$count === void 0 ? 3 : _ref$count,
        dateTransform = _ref.dateTransform,
        dateType = _ref.dateType,
        end = _ref.end,
        hover = _ref.hover,
        offset = _ref.offset,
        start = _ref.start,
        _ref$step = _ref.step,
        step = _ref$step === void 0 ? 1 : _ref$step,
        Tile = _ref.tile,
        value = _ref.value,
        valueType = _ref.valueType,
        tileProps = _objectWithoutProperties$7(_ref, [
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
            "valueType",
        ]);

    var tiles = [];

    for (var point = start; point <= end; point += step) {
        var date = dateTransform(point);
        tiles.push(
            /*#__PURE__*/ React.createElement(
                Tile,
                _extends$b(
                    {
                        key: date.getTime(),
                        classes: getTileClasses({
                            value: value,
                            valueType: valueType,
                            date: date,
                            dateType: dateType,
                            hover: hover,
                        }),
                        date: date,
                        point: point,
                    },
                    tileProps
                )
            )
        );
    }

    return /*#__PURE__*/ React.createElement(
        Flex,
        {
            className: className,
            count: count,
            offset: offset,
            wrap: true,
        },
        tiles
    );
}
TileGroup.propTypes = _objectSpread$a(
    _objectSpread$a({}, tileGroupProps),
    {},
    {
        activeStartDate: PropTypes.instanceOf(Date),
        count: PropTypes.number,
        dateTransform: PropTypes.func.isRequired,
        dateType: PropTypes.string,
        offset: PropTypes.number,
        step: PropTypes.number,
        tile: PropTypes.func.isRequired,
    }
);
function ownKeys$9(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly)
            symbols = symbols.filter(function (sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        keys.push.apply(keys, symbols);
    }
    return keys;
}

function _objectSpread$9(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i] != null ? arguments[i] : {};
        if (i % 2) {
            ownKeys$9(Object(source), true).forEach(function (key) {
                _defineProperty$9(target, key, source[key]);
            });
        } else if (Object.getOwnPropertyDescriptors) {
            Object.defineProperties(
                target,
                Object.getOwnPropertyDescriptors(source)
            );
        } else {
            ownKeys$9(Object(source)).forEach(function (key) {
                Object.defineProperty(
                    target,
                    key,
                    Object.getOwnPropertyDescriptor(source, key)
                );
            });
        }
    }
    return target;
}

function _typeof$1(obj) {
    "@babel/helpers - typeof";
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        _typeof$1 = function _typeof(obj) {
            return typeof obj;
        };
    } else {
        _typeof$1 = function _typeof(obj) {
            return obj &&
                typeof Symbol === "function" &&
                obj.constructor === Symbol &&
                obj !== Symbol.prototype
                ? "symbol"
                : typeof obj;
        };
    }
    return _typeof$1(obj);
}

function _classCallCheck$1(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _defineProperties$1(target, props) {
    for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}

function _createClass$1(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties$1(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties$1(Constructor, staticProps);
    return Constructor;
}

function _inherits$1(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError(
            "Super expression must either be null or a function"
        );
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            writable: true,
            configurable: true,
        },
    });
    if (superClass) _setPrototypeOf$1(subClass, superClass);
}

function _setPrototypeOf$1(o, p) {
    _setPrototypeOf$1 =
        Object.setPrototypeOf ||
        function _setPrototypeOf(o, p) {
            o.__proto__ = p;
            return o;
        };
    return _setPrototypeOf$1(o, p);
}

function _createSuper$1(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct$1();
    return function _createSuperInternal() {
        var Super = _getPrototypeOf$1(Derived),
            result;
        if (hasNativeReflectConstruct) {
            var NewTarget = _getPrototypeOf$1(this).constructor;
            result = Reflect.construct(Super, arguments, NewTarget);
        } else {
            result = Super.apply(this, arguments);
        }
        return _possibleConstructorReturn$1(this, result);
    };
}

function _possibleConstructorReturn$1(self, call) {
    if (call && (_typeof$1(call) === "object" || typeof call === "function")) {
        return call;
    }
    return _assertThisInitialized$1(self);
}

function _assertThisInitialized$1(self) {
    if (self === void 0) {
        throw new ReferenceError(
            "this hasn't been initialised - super() hasn't been called"
        );
    }
    return self;
}

function _isNativeReflectConstruct$1() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
        Date.prototype.toString.call(
            Reflect.construct(Date, [], function () {})
        );
        return true;
    } catch (e) {
        return false;
    }
}

function _getPrototypeOf$1(o) {
    _getPrototypeOf$1 = Object.setPrototypeOf
        ? Object.getPrototypeOf
        : function _getPrototypeOf(o) {
              return o.__proto__ || Object.getPrototypeOf(o);
          };
    return _getPrototypeOf$1(o);
}

function _defineProperty$9(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true,
        });
    } else {
        obj[key] = value;
    }
    return obj;
}

function getValue$1(nextProps, prop) {
    var activeStartDate = nextProps.activeStartDate,
        date = nextProps.date,
        view = nextProps.view;
    return typeof prop === "function"
        ? prop({
              activeStartDate: activeStartDate,
              date: date,
              view: view,
          })
        : prop;
}

var Tile = /*#__PURE__*/ (function (_Component) {
    _inherits$1(Tile, _Component);

    var _super = _createSuper$1(Tile);

    function Tile() {
        var _this;

        _classCallCheck$1(this, Tile);

        for (
            var _len = arguments.length, args = new Array(_len), _key = 0;
            _key < _len;
            _key++
        ) {
            args[_key] = arguments[_key];
        }

        _this = _super.call.apply(_super, [this].concat(args));

        _defineProperty$9(_assertThisInitialized$1(_this), "state", {});

        return _this;
    }

    _createClass$1(
        Tile,
        [
            {
                key: "render",
                value: function render() {
                    var _this$props = this.props,
                        activeStartDate = _this$props.activeStartDate,
                        children = _this$props.children,
                        classes = _this$props.classes,
                        date = _this$props.date,
                        formatAbbr = _this$props.formatAbbr,
                        locale = _this$props.locale,
                        maxDate = _this$props.maxDate,
                        maxDateTransform = _this$props.maxDateTransform,
                        minDate = _this$props.minDate,
                        minDateTransform = _this$props.minDateTransform,
                        onClick = _this$props.onClick,
                        onMouseOver = _this$props.onMouseOver,
                        style = _this$props.style,
                        tileDisabled = _this$props.tileDisabled,
                        view = _this$props.view;
                    var _this$state = this.state,
                        tileClassName = _this$state.tileClassName,
                        tileContent = _this$state.tileContent;
                    return /*#__PURE__*/ React.createElement(
                        "button",
                        {
                            className: mergeClassNames(classes, tileClassName),
                            disabled:
                                (minDate && minDateTransform(minDate) > date) ||
                                (maxDate && maxDateTransform(maxDate) < date) ||
                                (tileDisabled &&
                                    tileDisabled({
                                        activeStartDate: activeStartDate,
                                        date: date,
                                        view: view,
                                    })),
                            onClick:
                                onClick &&
                                function (event) {
                                    return onClick(date, event);
                                },
                            onFocus:
                                onMouseOver &&
                                function () {
                                    return onMouseOver(date);
                                },
                            onMouseOver:
                                onMouseOver &&
                                function () {
                                    return onMouseOver(date);
                                },
                            style: style,
                            type: "button",
                        },
                        formatAbbr
                            ? /*#__PURE__*/ React.createElement(
                                  "abbr",
                                  {
                                      "aria-label": formatAbbr(locale, date),
                                  },
                                  children
                              )
                            : children,
                        tileContent
                    );
                },
            },
        ],
        [
            {
                key: "getDerivedStateFromProps",
                value: function getDerivedStateFromProps(nextProps, prevState) {
                    var tileClassName = nextProps.tileClassName,
                        tileContent = nextProps.tileContent;
                    var nextState = {};

                    if (tileClassName !== prevState.tileClassNameProps) {
                        nextState.tileClassName = getValue$1(
                            nextProps,
                            tileClassName
                        );
                        nextState.tileClassNameProps = tileClassName;
                    }

                    if (tileContent !== prevState.tileContentProps) {
                        nextState.tileContent = getValue$1(
                            nextProps,
                            tileContent
                        );
                        nextState.tileContentProps = tileContent;
                    }

                    return nextState;
                },
            },
        ]
    );

    return Tile;
})(_);
Tile.propTypes = _objectSpread$9(
    _objectSpread$9({}, tileProps),
    {},
    {
        children: PropTypes.node.isRequired,
        formatAbbr: PropTypes.func,
        maxDateTransform: PropTypes.func.isRequired,
        minDateTransform: PropTypes.func.isRequired,
    }
);
function ownKeys$8(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly)
            symbols = symbols.filter(function (sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        keys.push.apply(keys, symbols);
    }
    return keys;
}

function _objectSpread$8(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i] != null ? arguments[i] : {};
        if (i % 2) {
            ownKeys$8(Object(source), true).forEach(function (key) {
                _defineProperty$8(target, key, source[key]);
            });
        } else if (Object.getOwnPropertyDescriptors) {
            Object.defineProperties(
                target,
                Object.getOwnPropertyDescriptors(source)
            );
        } else {
            ownKeys$8(Object(source)).forEach(function (key) {
                Object.defineProperty(
                    target,
                    key,
                    Object.getOwnPropertyDescriptor(source, key)
                );
            });
        }
    }
    return target;
}

function _defineProperty$8(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true,
        });
    } else {
        obj[key] = value;
    }
    return obj;
}

function _extends$a() {
    _extends$a =
        Object.assign ||
        function (target) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                for (var key in source) {
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                        target[key] = source[key];
                    }
                }
            }
            return target;
        };
    return _extends$a.apply(this, arguments);
}

function _objectWithoutProperties$6(source, excluded) {
    if (source == null) return {};
    var target = _objectWithoutPropertiesLoose$6(source, excluded);
    var key, i;
    if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
        for (i = 0; i < sourceSymbolKeys.length; i++) {
            key = sourceSymbolKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key))
                continue;
            target[key] = source[key];
        }
    }
    return target;
}

function _objectWithoutPropertiesLoose$6(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for (i = 0; i < sourceKeys.length; i++) {
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        target[key] = source[key];
    }
    return target;
}
var className$4 = "react-calendar__century-view__decades__decade";
function Decade(_ref) {
    var classes = _ref.classes,
        _ref$formatYear = _ref.formatYear,
        formatYear$1 =
            _ref$formatYear === void 0 ? formatYear : _ref$formatYear,
        otherProps = _objectWithoutProperties$6(_ref, [
            "classes",
            "formatYear",
        ]);

    var date = otherProps.date,
        locale = otherProps.locale;
    return /*#__PURE__*/ React.createElement(
        Tile,
        _extends$a({}, otherProps, {
            classes: [].concat(classes, className$4),
            maxDateTransform: getDecadeEnd,
            minDateTransform: getDecadeStart,
            view: "century",
        }),
        getDecadeLabel(locale, formatYear$1, date)
    );
}
Decade.propTypes = _objectSpread$8(
    _objectSpread$8({}, tileProps),
    {},
    {
        formatYear: PropTypes.func,
    }
);
function ownKeys$7(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly)
            symbols = symbols.filter(function (sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        keys.push.apply(keys, symbols);
    }
    return keys;
}

function _objectSpread$7(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i] != null ? arguments[i] : {};
        if (i % 2) {
            ownKeys$7(Object(source), true).forEach(function (key) {
                _defineProperty$7(target, key, source[key]);
            });
        } else if (Object.getOwnPropertyDescriptors) {
            Object.defineProperties(
                target,
                Object.getOwnPropertyDescriptors(source)
            );
        } else {
            ownKeys$7(Object(source)).forEach(function (key) {
                Object.defineProperty(
                    target,
                    key,
                    Object.getOwnPropertyDescriptor(source, key)
                );
            });
        }
    }
    return target;
}

function _defineProperty$7(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true,
        });
    } else {
        obj[key] = value;
    }
    return obj;
}

function _extends$9() {
    _extends$9 =
        Object.assign ||
        function (target) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                for (var key in source) {
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                        target[key] = source[key];
                    }
                }
            }
            return target;
        };
    return _extends$9.apply(this, arguments);
}
function Decades(props) {
    var activeStartDate = props.activeStartDate;
    var start = getBeginOfCenturyYear(activeStartDate);
    var end = start + 99;
    return /*#__PURE__*/ React.createElement(
        TileGroup,
        _extends$9({}, props, {
            className: "react-calendar__century-view__decades",
            dateTransform: getDecadeStart,
            dateType: "decade",
            end: end,
            start: start,
            step: 10,
            tile: Decade,
        })
    );
}
Decades.propTypes = _objectSpread$7({}, tileGroupProps);
function CenturyView(props) {
    function renderDecades() {
        return /*#__PURE__*/ React.createElement(Decades, props);
    }

    return /*#__PURE__*/ React.createElement(
        "div",
        {
            className: "react-calendar__century-view",
        },
        renderDecades()
    );
}
function ownKeys$6(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly)
            symbols = symbols.filter(function (sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        keys.push.apply(keys, symbols);
    }
    return keys;
}

function _objectSpread$6(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i] != null ? arguments[i] : {};
        if (i % 2) {
            ownKeys$6(Object(source), true).forEach(function (key) {
                _defineProperty$6(target, key, source[key]);
            });
        } else if (Object.getOwnPropertyDescriptors) {
            Object.defineProperties(
                target,
                Object.getOwnPropertyDescriptors(source)
            );
        } else {
            ownKeys$6(Object(source)).forEach(function (key) {
                Object.defineProperty(
                    target,
                    key,
                    Object.getOwnPropertyDescriptor(source, key)
                );
            });
        }
    }
    return target;
}

function _defineProperty$6(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true,
        });
    } else {
        obj[key] = value;
    }
    return obj;
}

function _extends$8() {
    _extends$8 =
        Object.assign ||
        function (target) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                for (var key in source) {
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                        target[key] = source[key];
                    }
                }
            }
            return target;
        };
    return _extends$8.apply(this, arguments);
}

function _objectWithoutProperties$5(source, excluded) {
    if (source == null) return {};
    var target = _objectWithoutPropertiesLoose$5(source, excluded);
    var key, i;
    if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
        for (i = 0; i < sourceSymbolKeys.length; i++) {
            key = sourceSymbolKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key))
                continue;
            target[key] = source[key];
        }
    }
    return target;
}

function _objectWithoutPropertiesLoose$5(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for (i = 0; i < sourceKeys.length; i++) {
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        target[key] = source[key];
    }
    return target;
}
var className$3 = "react-calendar__decade-view__years__year";
function Year(_ref) {
    var classes = _ref.classes,
        _ref$formatYear = _ref.formatYear,
        formatYear$1 =
            _ref$formatYear === void 0 ? formatYear : _ref$formatYear,
        otherProps = _objectWithoutProperties$5(_ref, [
            "classes",
            "formatYear",
        ]);

    var date = otherProps.date,
        locale = otherProps.locale;
    return /*#__PURE__*/ React.createElement(
        Tile,
        _extends$8({}, otherProps, {
            classes: [].concat(classes, className$3),
            maxDateTransform: getYearEnd,
            minDateTransform: getYearStart,
            view: "decade",
        }),
        formatYear$1(locale, date)
    );
}
Year.propTypes = _objectSpread$6(
    _objectSpread$6({}, tileProps),
    {},
    {
        formatYear: PropTypes.func,
    }
);
function ownKeys$5(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly)
            symbols = symbols.filter(function (sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        keys.push.apply(keys, symbols);
    }
    return keys;
}

function _objectSpread$5(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i] != null ? arguments[i] : {};
        if (i % 2) {
            ownKeys$5(Object(source), true).forEach(function (key) {
                _defineProperty$5(target, key, source[key]);
            });
        } else if (Object.getOwnPropertyDescriptors) {
            Object.defineProperties(
                target,
                Object.getOwnPropertyDescriptors(source)
            );
        } else {
            ownKeys$5(Object(source)).forEach(function (key) {
                Object.defineProperty(
                    target,
                    key,
                    Object.getOwnPropertyDescriptor(source, key)
                );
            });
        }
    }
    return target;
}

function _defineProperty$5(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true,
        });
    } else {
        obj[key] = value;
    }
    return obj;
}

function _extends$7() {
    _extends$7 =
        Object.assign ||
        function (target) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                for (var key in source) {
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                        target[key] = source[key];
                    }
                }
            }
            return target;
        };
    return _extends$7.apply(this, arguments);
}
function Years(props) {
    var activeStartDate = props.activeStartDate;
    var start = getBeginOfDecadeYear(activeStartDate);
    var end = start + 9;
    return /*#__PURE__*/ React.createElement(
        TileGroup,
        _extends$7({}, props, {
            className: "react-calendar__decade-view__years",
            dateTransform: function dateTransform(year) {
                var date = new Date();
                date.setFullYear(year, 0, 1);
                date.setHours(0, 0, 0, 0);
                return date;
            },
            dateType: "year",
            end: end,
            start: start,
            tile: Year,
        })
    );
}
Years.propTypes = _objectSpread$5({}, tileGroupProps);
function DecadeView(props) {
    function renderYears() {
        return /*#__PURE__*/ React.createElement(Years, props);
    }

    return /*#__PURE__*/ React.createElement(
        "div",
        {
            className: "react-calendar__decade-view",
        },
        renderYears()
    );
}
function ownKeys$4(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly)
            symbols = symbols.filter(function (sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        keys.push.apply(keys, symbols);
    }
    return keys;
}

function _objectSpread$4(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i] != null ? arguments[i] : {};
        if (i % 2) {
            ownKeys$4(Object(source), true).forEach(function (key) {
                _defineProperty$4(target, key, source[key]);
            });
        } else if (Object.getOwnPropertyDescriptors) {
            Object.defineProperties(
                target,
                Object.getOwnPropertyDescriptors(source)
            );
        } else {
            ownKeys$4(Object(source)).forEach(function (key) {
                Object.defineProperty(
                    target,
                    key,
                    Object.getOwnPropertyDescriptor(source, key)
                );
            });
        }
    }
    return target;
}

function _defineProperty$4(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true,
        });
    } else {
        obj[key] = value;
    }
    return obj;
}

function _extends$6() {
    _extends$6 =
        Object.assign ||
        function (target) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                for (var key in source) {
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                        target[key] = source[key];
                    }
                }
            }
            return target;
        };
    return _extends$6.apply(this, arguments);
}

function _objectWithoutProperties$4(source, excluded) {
    if (source == null) return {};
    var target = _objectWithoutPropertiesLoose$4(source, excluded);
    var key, i;
    if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
        for (i = 0; i < sourceSymbolKeys.length; i++) {
            key = sourceSymbolKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key))
                continue;
            target[key] = source[key];
        }
    }
    return target;
}

function _objectWithoutPropertiesLoose$4(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for (i = 0; i < sourceKeys.length; i++) {
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        target[key] = source[key];
    }
    return target;
}
var className$2 = "react-calendar__year-view__months__month";
function Month(_ref) {
    var classes = _ref.classes,
        _ref$formatMonth = _ref.formatMonth,
        formatMonth$1 =
            _ref$formatMonth === void 0 ? formatMonth : _ref$formatMonth,
        _ref$formatMonthYear = _ref.formatMonthYear,
        formatMonthYear$1 =
            _ref$formatMonthYear === void 0
                ? formatMonthYear
                : _ref$formatMonthYear,
        otherProps = _objectWithoutProperties$4(_ref, [
            "classes",
            "formatMonth",
            "formatMonthYear",
        ]);

    var date = otherProps.date,
        locale = otherProps.locale;
    return /*#__PURE__*/ React.createElement(
        Tile,
        _extends$6({}, otherProps, {
            classes: [].concat(classes, className$2),
            formatAbbr: formatMonthYear$1,
            maxDateTransform: getMonthEnd,
            minDateTransform: getMonthStart,
            view: "year",
        }),
        formatMonth$1(locale, date)
    );
}
Month.propTypes = _objectSpread$4(
    _objectSpread$4({}, tileProps),
    {},
    {
        formatMonth: PropTypes.func,
        formatMonthYear: PropTypes.func,
    }
);
function ownKeys$3(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly)
            symbols = symbols.filter(function (sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        keys.push.apply(keys, symbols);
    }
    return keys;
}

function _objectSpread$3(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i] != null ? arguments[i] : {};
        if (i % 2) {
            ownKeys$3(Object(source), true).forEach(function (key) {
                _defineProperty$3(target, key, source[key]);
            });
        } else if (Object.getOwnPropertyDescriptors) {
            Object.defineProperties(
                target,
                Object.getOwnPropertyDescriptors(source)
            );
        } else {
            ownKeys$3(Object(source)).forEach(function (key) {
                Object.defineProperty(
                    target,
                    key,
                    Object.getOwnPropertyDescriptor(source, key)
                );
            });
        }
    }
    return target;
}

function _defineProperty$3(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true,
        });
    } else {
        obj[key] = value;
    }
    return obj;
}

function _extends$5() {
    _extends$5 =
        Object.assign ||
        function (target) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                for (var key in source) {
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                        target[key] = source[key];
                    }
                }
            }
            return target;
        };
    return _extends$5.apply(this, arguments);
}
function Months(props) {
    var activeStartDate = props.activeStartDate;
    var start = 0;
    var end = 11;
    var year = getYear(activeStartDate);
    return /*#__PURE__*/ React.createElement(
        TileGroup,
        _extends$5({}, props, {
            className: "react-calendar__year-view__months",
            dateTransform: function dateTransform(monthIndex) {
                var date = new Date();
                date.setFullYear(year, monthIndex, 1);
                date.setHours(0, 0, 0, 0);
                return date;
            },
            dateType: "month",
            end: end,
            start: start,
            tile: Month,
        })
    );
}
Months.propTypes = _objectSpread$3(
    _objectSpread$3({}, tileGroupProps),
    {},
    {
        locale: PropTypes.string,
    }
);
function YearView(props) {
    function renderMonths() {
        return /*#__PURE__*/ React.createElement(Months, props);
    }

    return /*#__PURE__*/ React.createElement(
        "div",
        {
            className: "react-calendar__year-view",
        },
        renderMonths()
    );
}
function ownKeys$2(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly)
            symbols = symbols.filter(function (sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        keys.push.apply(keys, symbols);
    }
    return keys;
}

function _objectSpread$2(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i] != null ? arguments[i] : {};
        if (i % 2) {
            ownKeys$2(Object(source), true).forEach(function (key) {
                _defineProperty$2(target, key, source[key]);
            });
        } else if (Object.getOwnPropertyDescriptors) {
            Object.defineProperties(
                target,
                Object.getOwnPropertyDescriptors(source)
            );
        } else {
            ownKeys$2(Object(source)).forEach(function (key) {
                Object.defineProperty(
                    target,
                    key,
                    Object.getOwnPropertyDescriptor(source, key)
                );
            });
        }
    }
    return target;
}

function _defineProperty$2(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true,
        });
    } else {
        obj[key] = value;
    }
    return obj;
}

function _extends$4() {
    _extends$4 =
        Object.assign ||
        function (target) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                for (var key in source) {
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                        target[key] = source[key];
                    }
                }
            }
            return target;
        };
    return _extends$4.apply(this, arguments);
}

function _objectWithoutProperties$3(source, excluded) {
    if (source == null) return {};
    var target = _objectWithoutPropertiesLoose$3(source, excluded);
    var key, i;
    if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
        for (i = 0; i < sourceSymbolKeys.length; i++) {
            key = sourceSymbolKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key))
                continue;
            target[key] = source[key];
        }
    }
    return target;
}

function _objectWithoutPropertiesLoose$3(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for (i = 0; i < sourceKeys.length; i++) {
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        target[key] = source[key];
    }
    return target;
}
var className$1 = "react-calendar__month-view__days__day";
function Day(_ref) {
    var _ref$formatDay = _ref.formatDay,
        formatDay$1 = _ref$formatDay === void 0 ? formatDay : _ref$formatDay,
        _ref$formatLongDate = _ref.formatLongDate,
        formatLongDate$1 =
            _ref$formatLongDate === void 0
                ? formatLongDate
                : _ref$formatLongDate,
        calendarType = _ref.calendarType,
        classes = _ref.classes,
        currentMonthIndex = _ref.currentMonthIndex,
        otherProps = _objectWithoutProperties$3(_ref, [
            "formatDay",
            "formatLongDate",
            "calendarType",
            "classes",
            "currentMonthIndex",
        ]);

    var date = otherProps.date,
        locale = otherProps.locale;
    return /*#__PURE__*/ React.createElement(
        Tile,
        _extends$4({}, otherProps, {
            classes: [].concat(
                classes,
                className$1,
                isWeekend(date, calendarType)
                    ? "".concat(className$1, "--weekend")
                    : null,
                date.getMonth() !== currentMonthIndex
                    ? "".concat(className$1, "--neighboringMonth")
                    : null
            ),
            formatAbbr: formatLongDate$1,
            maxDateTransform: getDayEnd,
            minDateTransform: getDayStart,
            view: "month",
        }),
        formatDay$1(locale, date)
    );
}
Day.propTypes = _objectSpread$2(
    _objectSpread$2({}, tileProps),
    {},
    {
        currentMonthIndex: PropTypes.number.isRequired,
        formatDay: PropTypes.func,
        formatLongDate: PropTypes.func,
    }
);
function ownKeys$1(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly)
            symbols = symbols.filter(function (sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        keys.push.apply(keys, symbols);
    }
    return keys;
}

function _objectSpread$1(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i] != null ? arguments[i] : {};
        if (i % 2) {
            ownKeys$1(Object(source), true).forEach(function (key) {
                _defineProperty$1(target, key, source[key]);
            });
        } else if (Object.getOwnPropertyDescriptors) {
            Object.defineProperties(
                target,
                Object.getOwnPropertyDescriptors(source)
            );
        } else {
            ownKeys$1(Object(source)).forEach(function (key) {
                Object.defineProperty(
                    target,
                    key,
                    Object.getOwnPropertyDescriptor(source, key)
                );
            });
        }
    }
    return target;
}

function _defineProperty$1(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true,
        });
    } else {
        obj[key] = value;
    }
    return obj;
}

function _extends$3() {
    _extends$3 =
        Object.assign ||
        function (target) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                for (var key in source) {
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                        target[key] = source[key];
                    }
                }
            }
            return target;
        };
    return _extends$3.apply(this, arguments);
}

function _objectWithoutProperties$2(source, excluded) {
    if (source == null) return {};
    var target = _objectWithoutPropertiesLoose$2(source, excluded);
    var key, i;
    if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
        for (i = 0; i < sourceSymbolKeys.length; i++) {
            key = sourceSymbolKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key))
                continue;
            target[key] = source[key];
        }
    }
    return target;
}

function _objectWithoutPropertiesLoose$2(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for (i = 0; i < sourceKeys.length; i++) {
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        target[key] = source[key];
    }
    return target;
}
function Days(props) {
    var activeStartDate = props.activeStartDate,
        calendarType = props.calendarType;

    var showFixedNumberOfWeeks = props.showFixedNumberOfWeeks,
        showNeighboringMonth = props.showNeighboringMonth,
        otherProps = _objectWithoutProperties$2(props, [
            "showFixedNumberOfWeeks",
            "showNeighboringMonth",
        ]);

    var year = getYear(activeStartDate);
    var monthIndex = getMonth(activeStartDate);
    var hasFixedNumberOfWeeks = showFixedNumberOfWeeks || showNeighboringMonth;
    var dayOfWeek = getDayOfWeek(activeStartDate, calendarType);
    var offset = hasFixedNumberOfWeeks ? 0 : dayOfWeek;
    /**
     * Defines on which day of the month the grid shall start. If we simply show current
     * month, we obviously start on day one, but if showNeighboringMonth is set to
     * true, we need to find the beginning of the week the first day of the month is in.
     */

    var start = (hasFixedNumberOfWeeks ? -dayOfWeek : 0) + 1;
    /**
     * Defines on which day of the month the grid shall end. If we simply show current
     * month, we need to stop on the last day of the month, but if showNeighboringMonth
     * is set to true, we need to find the end of the week the last day of the month is in.
     */

    var end = (function () {
        if (showFixedNumberOfWeeks) {
            // Always show 6 weeks
            return start + 6 * 7 - 1;
        }

        var daysInMonth = getDaysInMonth(activeStartDate);

        if (showNeighboringMonth) {
            var activeEndDate = new Date();
            activeEndDate.setFullYear(year, monthIndex, daysInMonth);
            activeEndDate.setHours(0, 0, 0, 0);
            var daysUntilEndOfTheWeek =
                7 - getDayOfWeek(activeEndDate, calendarType) - 1;
            return daysInMonth + daysUntilEndOfTheWeek;
        }

        return daysInMonth;
    })();

    return /*#__PURE__*/ React.createElement(
        TileGroup,
        _extends$3({}, otherProps, {
            className: "react-calendar__month-view__days",
            count: 7,
            currentMonthIndex: monthIndex,
            dateTransform: function dateTransform(day) {
                var date = new Date();
                date.setFullYear(year, monthIndex, day);
                date.setHours(0, 0, 0, 0);
                return date;
            },
            dateType: "day",
            end: end,
            offset: offset,
            start: start,
            tile: Day,
        })
    );
}
Days.propTypes = _objectSpread$1(
    {
        calendarType: isCalendarType.isRequired,
        showFixedNumberOfWeeks: PropTypes.bool,
        showNeighboringMonth: PropTypes.bool,
    },
    tileGroupProps
);
var className = "react-calendar__month-view__weekdays";
function Weekdays(props) {
    var calendarType = props.calendarType,
        _props$formatShortWee = props.formatShortWeekday,
        formatShortWeekday$1 =
            _props$formatShortWee === void 0
                ? formatShortWeekday
                : _props$formatShortWee,
        locale = props.locale,
        onMouseLeave = props.onMouseLeave;
    var anyDate = new Date();
    var beginOfMonth = getMonthStart(anyDate);
    var year = getYear(beginOfMonth);
    var monthIndex = getMonth(beginOfMonth);
    var weekdays = [];

    for (var weekday = 1; weekday <= 7; weekday += 1) {
        var weekdayDate = new Date(
            year,
            monthIndex,
            weekday - getDayOfWeek(beginOfMonth, calendarType)
        );
        var abbr = formatWeekday(locale, weekdayDate);
        weekdays.push(
            /*#__PURE__*/ React.createElement(
                "div",
                {
                    key: weekday,
                    className: "".concat(className, "__weekday"),
                },
                /*#__PURE__*/ React.createElement(
                    "abbr",
                    {
                        "aria-label": abbr,
                        title: abbr,
                    },
                    formatShortWeekday$1(locale, weekdayDate).replace(".", "")
                )
            )
        );
    }

    return /*#__PURE__*/ React.createElement(
        Flex,
        {
            className: className,
            count: 7,
            onFocus: onMouseLeave,
            onMouseOver: onMouseLeave,
        },
        weekdays
    );
}
Weekdays.propTypes = {
    calendarType: isCalendarType.isRequired,
    formatShortWeekday: PropTypes.func,
    locale: PropTypes.string,
    onMouseLeave: PropTypes.func,
};
function _extends$2() {
    _extends$2 =
        Object.assign ||
        function (target) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                for (var key in source) {
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                        target[key] = source[key];
                    }
                }
            }
            return target;
        };
    return _extends$2.apply(this, arguments);
}
function WeekNumber(_ref) {
    var date = _ref.date,
        onClickWeekNumber = _ref.onClickWeekNumber,
        weekNumber = _ref.weekNumber;
    var props = {
        className: "react-calendar__tile",
        style: {
            flexGrow: 1,
        },
    };
    var children = /*#__PURE__*/ React.createElement("span", null, weekNumber);
    return onClickWeekNumber
        ? /*#__PURE__*/ React.createElement(
              "button",
              _extends$2({}, props, {
                  onClick: function onClick(event) {
                      return onClickWeekNumber(weekNumber, date, event);
                  },
                  type: "button",
              }),
              children
          )
        : /*#__PURE__*/ React.createElement("div", props, children);
}
WeekNumber.propTypes = {
    date: PropTypes.instanceOf(Date).isRequired,
    onClickWeekNumber: PropTypes.func,
    weekNumber: PropTypes.node.isRequired,
};
function WeekNumbers(props) {
    var activeStartDate = props.activeStartDate,
        calendarType = props.calendarType,
        onClickWeekNumber = props.onClickWeekNumber,
        onMouseLeave = props.onMouseLeave,
        showFixedNumberOfWeeks = props.showFixedNumberOfWeeks;

    var numberOfWeeks = (function () {
        if (showFixedNumberOfWeeks) {
            return 6;
        }

        var numberOfDays = getDaysInMonth(activeStartDate);
        var startWeekday = getDayOfWeek(activeStartDate, calendarType);
        var days = numberOfDays - (7 - startWeekday);
        return 1 + Math.ceil(days / 7);
    })();

    var dates = (function () {
        var year = getYear(activeStartDate);
        var monthIndex = getMonth(activeStartDate);
        var day = getDate(activeStartDate);
        var result = [];

        for (var index = 0; index < numberOfWeeks; index += 1) {
            result.push(
                getBeginOfWeek(
                    new Date(year, monthIndex, day + index * 7),
                    calendarType
                )
            );
        }

        return result;
    })();

    var weekNumbers = dates.map(function (date) {
        return getWeekNumber(date, calendarType);
    });
    return /*#__PURE__*/ React.createElement(
        Flex,
        {
            className: "react-calendar__month-view__weekNumbers",
            count: numberOfWeeks,
            direction: "column",
            onFocus: onMouseLeave,
            onMouseOver: onMouseLeave,
            style: {
                flexBasis: "calc(100% * (1 / 8)",
                flexShrink: 0,
            },
        },
        weekNumbers.map(function (weekNumber, weekIndex) {
            return /*#__PURE__*/ React.createElement(WeekNumber, {
                key: weekNumber,
                date: dates[weekIndex],
                onClickWeekNumber: onClickWeekNumber,
                weekNumber: weekNumber,
            });
        })
    );
}
WeekNumbers.propTypes = {
    activeStartDate: PropTypes.instanceOf(Date).isRequired,
    calendarType: isCalendarType.isRequired,
    onClickWeekNumber: PropTypes.func,
    onMouseLeave: PropTypes.func,
    showFixedNumberOfWeeks: PropTypes.bool,
};
function _extends$1() {
    _extends$1 =
        Object.assign ||
        function (target) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                for (var key in source) {
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                        target[key] = source[key];
                    }
                }
            }
            return target;
        };
    return _extends$1.apply(this, arguments);
}

function _objectWithoutProperties$1(source, excluded) {
    if (source == null) return {};
    var target = _objectWithoutPropertiesLoose$1(source, excluded);
    var key, i;
    if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
        for (i = 0; i < sourceSymbolKeys.length; i++) {
            key = sourceSymbolKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key))
                continue;
            target[key] = source[key];
        }
    }
    return target;
}

function _objectWithoutPropertiesLoose$1(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for (i = 0; i < sourceKeys.length; i++) {
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        target[key] = source[key];
    }
    return target;
}

function getCalendarTypeFromLocale(locale) {
    return (
        Object.keys(CALENDAR_TYPE_LOCALES).find(function (calendarType) {
            return CALENDAR_TYPE_LOCALES[calendarType].includes(locale);
        }) || CALENDAR_TYPES.ISO_8601
    );
}

function MonthView(props) {
    var activeStartDate = props.activeStartDate,
        locale = props.locale,
        onMouseLeave = props.onMouseLeave,
        showFixedNumberOfWeeks = props.showFixedNumberOfWeeks;

    var _props$calendarType = props.calendarType,
        calendarType =
            _props$calendarType === void 0
                ? getCalendarTypeFromLocale(locale)
                : _props$calendarType,
        formatShortWeekday = props.formatShortWeekday,
        onClickWeekNumber = props.onClickWeekNumber,
        showWeekNumbers = props.showWeekNumbers,
        childProps = _objectWithoutProperties$1(props, [
            "calendarType",
            "formatShortWeekday",
            "onClickWeekNumber",
            "showWeekNumbers",
        ]);

    function renderWeekdays() {
        return /*#__PURE__*/ React.createElement(Weekdays, {
            calendarType: calendarType,
            formatShortWeekday: formatShortWeekday,
            locale: locale,
            onMouseLeave: onMouseLeave,
        });
    }

    function renderWeekNumbers() {
        if (!showWeekNumbers) {
            return null;
        }

        return /*#__PURE__*/ React.createElement(WeekNumbers, {
            activeStartDate: activeStartDate,
            calendarType: calendarType,
            onClickWeekNumber: onClickWeekNumber,
            onMouseLeave: onMouseLeave,
            showFixedNumberOfWeeks: showFixedNumberOfWeeks,
        });
    }

    function renderDays() {
        return /*#__PURE__*/ React.createElement(
            Days,
            _extends$1(
                {
                    calendarType: calendarType,
                },
                childProps
            )
        );
    }

    var className = "react-calendar__month-view";
    return /*#__PURE__*/ React.createElement(
        "div",
        {
            className: mergeClassNames(
                className,
                showWeekNumbers ? "".concat(className, "--weekNumbers") : ""
            ),
        },
        /*#__PURE__*/ React.createElement(
            "div",
            {
                style: {
                    display: "flex",
                    alignItems: "flex-end",
                },
            },
            renderWeekNumbers(),
            /*#__PURE__*/ React.createElement(
                "div",
                {
                    style: {
                        flexGrow: 1,
                        width: "100%",
                    },
                },
                renderWeekdays(),
                renderDays()
            )
        )
    );
}
MonthView.propTypes = {
    activeStartDate: PropTypes.instanceOf(Date).isRequired,
    calendarType: isCalendarType,
    formatShortWeekday: PropTypes.func,
    locale: PropTypes.string,
    onClickWeekNumber: PropTypes.func,
    onMouseLeave: PropTypes.func,
    showFixedNumberOfWeeks: PropTypes.bool,
    showWeekNumbers: PropTypes.bool,
};
function _extends() {
    _extends =
        Object.assign ||
        function (target) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                for (var key in source) {
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                        target[key] = source[key];
                    }
                }
            }
            return target;
        };
    return _extends.apply(this, arguments);
}

function _typeof(obj) {
    "@babel/helpers - typeof";
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        _typeof = function _typeof(obj) {
            return typeof obj;
        };
    } else {
        _typeof = function _typeof(obj) {
            return obj &&
                typeof Symbol === "function" &&
                obj.constructor === Symbol &&
                obj !== Symbol.prototype
                ? "symbol"
                : typeof obj;
        };
    }
    return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}

function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError(
            "Super expression must either be null or a function"
        );
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            writable: true,
            configurable: true,
        },
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
    _setPrototypeOf =
        Object.setPrototypeOf ||
        function _setPrototypeOf(o, p) {
            o.__proto__ = p;
            return o;
        };
    return _setPrototypeOf(o, p);
}

function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();
    return function _createSuperInternal() {
        var Super = _getPrototypeOf(Derived),
            result;
        if (hasNativeReflectConstruct) {
            var NewTarget = _getPrototypeOf(this).constructor;
            result = Reflect.construct(Super, arguments, NewTarget);
        } else {
            result = Super.apply(this, arguments);
        }
        return _possibleConstructorReturn(this, result);
    };
}

function _possibleConstructorReturn(self, call) {
    if (call && (_typeof(call) === "object" || typeof call === "function")) {
        return call;
    }
    return _assertThisInitialized(self);
}

function _assertThisInitialized(self) {
    if (self === void 0) {
        throw new ReferenceError(
            "this hasn't been initialised - super() hasn't been called"
        );
    }
    return self;
}

function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
        Date.prototype.toString.call(
            Reflect.construct(Date, [], function () {})
        );
        return true;
    } catch (e) {
        return false;
    }
}

function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf
        ? Object.getPrototypeOf
        : function _getPrototypeOf(o) {
              return o.__proto__ || Object.getPrototypeOf(o);
          };
    return _getPrototypeOf(o);
}

function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly)
            symbols = symbols.filter(function (sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        keys.push.apply(keys, symbols);
    }
    return keys;
}

function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i] != null ? arguments[i] : {};
        if (i % 2) {
            ownKeys(Object(source), true).forEach(function (key) {
                _defineProperty(target, key, source[key]);
            });
        } else if (Object.getOwnPropertyDescriptors) {
            Object.defineProperties(
                target,
                Object.getOwnPropertyDescriptors(source)
            );
        } else {
            ownKeys(Object(source)).forEach(function (key) {
                Object.defineProperty(
                    target,
                    key,
                    Object.getOwnPropertyDescriptor(source, key)
                );
            });
        }
    }
    return target;
}

function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true,
        });
    } else {
        obj[key] = value;
    }
    return obj;
}

function _objectWithoutProperties(source, excluded) {
    if (source == null) return {};
    var target = _objectWithoutPropertiesLoose(source, excluded);
    var key, i;
    if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
        for (i = 0; i < sourceSymbolKeys.length; i++) {
            key = sourceSymbolKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key))
                continue;
            target[key] = source[key];
        }
    }
    return target;
}

function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for (i = 0; i < sourceKeys.length; i++) {
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        target[key] = source[key];
    }
    return target;
}

function _toConsumableArray(arr) {
    return (
        _arrayWithoutHoles(arr) ||
        _iterableToArray(arr) ||
        _unsupportedIterableToArray(arr) ||
        _nonIterableSpread()
    );
}

function _nonIterableSpread() {
    throw new TypeError(
        "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
    );
}

function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
        return _arrayLikeToArray(o, minLen);
}

function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter))
        return Array.from(iter);
}

function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) {
        arr2[i] = arr[i];
    }
    return arr2;
}
var defaultMinDate = new Date();
defaultMinDate.setFullYear(1, 0, 1);
defaultMinDate.setHours(0, 0, 0, 0);
var defaultMaxDate = new Date(8.64e15);
var baseClassName = "react-calendar";
var allViews = ["century", "decade", "year", "month"];
var allValueTypes = [].concat(_toConsumableArray(allViews.slice(1)), ["day"]);

function toDate(value) {
    if (value instanceof Date) {
        return value;
    }

    return new Date(value);
}
/**
 * Returns views array with disallowed values cut off.
 */

function getLimitedViews(minDetail, maxDetail) {
    return allViews.slice(
        allViews.indexOf(minDetail),
        allViews.indexOf(maxDetail) + 1
    );
}
/**
 * Determines whether a given view is allowed with currently applied settings.
 */

function isViewAllowed(view, minDetail, maxDetail) {
    var views = getLimitedViews(minDetail, maxDetail);
    return views.indexOf(view) !== -1;
}
/**
 * Gets either provided view if allowed by minDetail and maxDetail, or gets
 * the default view if not allowed.
 */

function getView(view, minDetail, maxDetail) {
    if (isViewAllowed(view, minDetail, maxDetail)) {
        return view;
    }

    return maxDetail;
}
/**
 * Returns value type that can be returned with currently applied settings.
 */

function getValueType(maxDetail) {
    return allValueTypes[allViews.indexOf(maxDetail)];
}

function getValue(value, index) {
    if (!value) {
        return null;
    }

    var rawValue =
        Array.isArray(value) && value.length === 2 ? value[index] : value;

    if (!rawValue) {
        return null;
    }

    var valueDate = toDate(rawValue);

    if (isNaN(valueDate.getTime())) {
        throw new Error("Invalid date: ".concat(value));
    }

    return valueDate;
}

function getDetailValue(_ref, index) {
    var value = _ref.value,
        minDate = _ref.minDate,
        maxDate = _ref.maxDate,
        maxDetail = _ref.maxDetail;
    var valuePiece = getValue(value, index);

    if (!valuePiece) {
        return null;
    }

    var valueType = getValueType(maxDetail);
    var detailValueFrom = [getBegin, getEnd][index](valueType, valuePiece);
    return between(detailValueFrom, minDate, maxDate);
}

var getDetailValueFrom = function getDetailValueFrom(args) {
    return getDetailValue(args, 0);
};

var getDetailValueTo = function getDetailValueTo(args) {
    return getDetailValue(args, 1);
};

var getDetailValueArray = function getDetailValueArray(args) {
    var value = args.value;

    if (Array.isArray(value)) {
        return value;
    }

    return [getDetailValueFrom, getDetailValueTo].map(function (fn) {
        return fn(args);
    });
};

function getActiveStartDate(props) {
    var maxDate = props.maxDate,
        maxDetail = props.maxDetail,
        minDate = props.minDate,
        minDetail = props.minDetail,
        value = props.value,
        view = props.view;
    var rangeType = getView(view, minDetail, maxDetail);
    var valueFrom =
        getDetailValueFrom({
            value: value,
            minDate: minDate,
            maxDate: maxDate,
            maxDetail: maxDetail,
        }) || new Date();
    return getBegin(rangeType, valueFrom);
}

function getInitialActiveStartDate(props) {
    var activeStartDate = props.activeStartDate,
        defaultActiveStartDate = props.defaultActiveStartDate,
        defaultValue = props.defaultValue,
        defaultView = props.defaultView,
        maxDetail = props.maxDetail,
        minDetail = props.minDetail,
        value = props.value,
        view = props.view,
        otherProps = _objectWithoutProperties(props, [
            "activeStartDate",
            "defaultActiveStartDate",
            "defaultValue",
            "defaultView",
            "maxDetail",
            "minDetail",
            "value",
            "view",
        ]);

    var rangeType = getView(view, minDetail, maxDetail);
    var valueFrom = activeStartDate || defaultActiveStartDate;

    if (valueFrom) {
        return getBegin(rangeType, valueFrom);
    }

    return getActiveStartDate(
        _objectSpread(
            {
                maxDetail: maxDetail,
                minDetail: minDetail,
                value: value || defaultValue,
                view: view || defaultView,
            },
            otherProps
        )
    );
}

var getIsSingleValue = function getIsSingleValue(value) {
    return value && [].concat(value).length === 1;
};

var Calendar = /*#__PURE__*/ (function (_Component) {
    _inherits(Calendar, _Component);

    var _super = _createSuper(Calendar);

    function Calendar() {
        var _this;

        _classCallCheck(this, Calendar);

        for (
            var _len = arguments.length, _args = new Array(_len), _key = 0;
            _key < _len;
            _key++
        ) {
            _args[_key] = arguments[_key];
        }

        _this = _super.call.apply(_super, [this].concat(_args));

        _defineProperty(_assertThisInitialized(_this), "state", {
            activeStartDate: _this.props.defaultActiveStartDate,
            value: _this.props.defaultValue,
            view: _this.props.defaultView,
        });

        _defineProperty(
            _assertThisInitialized(_this),
            "setStateAndCallCallbacks",
            function (nextState, event, callback) {
                var _assertThisInitialize = _assertThisInitialized(_this),
                    previousActiveStartDate =
                        _assertThisInitialize.activeStartDate,
                    previousView = _assertThisInitialize.view;

                var _this$props = _this.props,
                    allowPartialRange = _this$props.allowPartialRange,
                    onActiveStartDateChange =
                        _this$props.onActiveStartDateChange,
                    onChange = _this$props.onChange,
                    onViewChange = _this$props.onViewChange,
                    selectRange = _this$props.selectRange;
                var prevArgs = {
                    activeStartDate: previousActiveStartDate,
                    view: previousView,
                };

                _this.setState(nextState, function () {
                    var args = {
                        activeStartDate:
                            nextState.activeStartDate || _this.activeStartDate,
                        value: nextState.value || _this.value,
                        view: nextState.view || _this.view,
                    };

                    function shouldUpdate(key) {
                        return (
                            // Key must exist, and…
                            key in nextState && // …key changed from undefined to defined or the other way around, or…
                            (_typeof(nextState[key]) !==
                                _typeof(prevArgs[key]) || // …value changed.
                                (nextState[key] instanceof Date
                                    ? nextState[key].getTime() !==
                                      prevArgs[key].getTime()
                                    : nextState[key] !== prevArgs[key]))
                        );
                    }

                    if (shouldUpdate("activeStartDate")) {
                        if (onActiveStartDateChange)
                            onActiveStartDateChange(args);
                    }

                    if (shouldUpdate("view")) {
                        if (onViewChange) onViewChange(args);
                    }

                    if (shouldUpdate("value")) {
                        if (onChange) {
                            if (selectRange) {
                                var isSingleValue = getIsSingleValue(
                                    nextState.value
                                );

                                if (!isSingleValue) {
                                    onChange(nextState.value, event);
                                } else if (allowPartialRange) {
                                    onChange([nextState.value], event);
                                }
                            } else {
                                onChange(nextState.value, event);
                            }
                        }
                    }

                    if (callback) callback(args);
                });
            }
        );

        _defineProperty(
            _assertThisInitialized(_this),
            "setActiveStartDate",
            function (activeStartDate) {
                _this.setStateAndCallCallbacks({
                    activeStartDate: activeStartDate,
                });
            }
        );

        _defineProperty(
            _assertThisInitialized(_this),
            "drillDown",
            function (nextActiveStartDate, event) {
                if (!_this.drillDownAvailable) {
                    return;
                }

                _this.onClickTile(nextActiveStartDate, event);

                var _assertThisInitialize2 = _assertThisInitialized(_this),
                    view = _assertThisInitialize2.view,
                    views = _assertThisInitialize2.views;

                var onDrillDown = _this.props.onDrillDown;
                var nextView = views[views.indexOf(view) + 1];

                _this.setStateAndCallCallbacks(
                    {
                        activeStartDate: nextActiveStartDate,
                        view: nextView,
                    },
                    undefined,
                    onDrillDown
                );
            }
        );

        _defineProperty(_assertThisInitialized(_this), "drillUp", function () {
            if (!_this.drillUpAvailable) {
                return;
            }

            var _assertThisInitialize3 = _assertThisInitialized(_this),
                activeStartDate = _assertThisInitialize3.activeStartDate,
                view = _assertThisInitialize3.view,
                views = _assertThisInitialize3.views;

            var onDrillUp = _this.props.onDrillUp;
            var nextView = views[views.indexOf(view) - 1];
            var nextActiveStartDate = getBegin(nextView, activeStartDate);

            _this.setStateAndCallCallbacks(
                {
                    activeStartDate: nextActiveStartDate,
                    view: nextView,
                },
                undefined,
                onDrillUp
            );
        });

        _defineProperty(
            _assertThisInitialized(_this),
            "onChange",
            function (value, event) {
                var selectRange = _this.props.selectRange;

                _this.onClickTile(value, event);

                var nextValue;

                if (selectRange) {
                    // Range selection turned on
                    var _assertThisInitialize4 = _assertThisInitialized(_this),
                        previousValue = _assertThisInitialize4.value,
                        valueType = _assertThisInitialize4.valueType;

                    if (!getIsSingleValue(previousValue)) {
                        // Value has 0 or 2 elements - either way we're starting a new array
                        // First value
                        nextValue = getBegin(valueType, value);
                    } else {
                        // Second value
                        nextValue = getValueRange(
                            valueType,
                            previousValue,
                            value
                        );
                    }
                } else {
                    // Range selection turned off
                    nextValue = _this.getProcessedValue(value);
                }

                var nextActiveStartDate = getActiveStartDate(
                    _objectSpread(
                        _objectSpread({}, _this.props),
                        {},
                        {
                            value: nextValue,
                        }
                    )
                );
                event.persist();

                _this.setStateAndCallCallbacks(
                    {
                        activeStartDate: nextActiveStartDate,
                        value: nextValue,
                    },
                    event
                );
            }
        );

        _defineProperty(
            _assertThisInitialized(_this),
            "onClickTile",
            function (value, event) {
                var _assertThisInitialize5 = _assertThisInitialized(_this),
                    view = _assertThisInitialize5.view;

                var _this$props2 = _this.props,
                    onClickDay = _this$props2.onClickDay,
                    onClickDecade = _this$props2.onClickDecade,
                    onClickMonth = _this$props2.onClickMonth,
                    onClickYear = _this$props2.onClickYear;

                var callback = (function () {
                    switch (view) {
                        case "century":
                            return onClickDecade;

                        case "decade":
                            return onClickYear;

                        case "year":
                            return onClickMonth;

                        case "month":
                            return onClickDay;

                        default:
                            throw new Error("Invalid view: ".concat(view, "."));
                    }
                })();

                if (callback) callback(value, event);
            }
        );

        _defineProperty(
            _assertThisInitialized(_this),
            "onMouseOver",
            function (value) {
                _this.setState(function (prevState) {
                    if (
                        prevState.hover &&
                        prevState.hover.getTime() === value.getTime()
                    ) {
                        return null;
                    }

                    return {
                        hover: value,
                    };
                });
            }
        );

        _defineProperty(
            _assertThisInitialized(_this),
            "onMouseLeave",
            function () {
                _this.setState({
                    hover: null,
                });
            }
        );

        return _this;
    }

    _createClass(Calendar, [
        {
            key: "getProcessedValue",

            /**
             * Gets current value in a desired format.
             */
            value: function getProcessedValue(value) {
                var _this$props3 = this.props,
                    minDate = _this$props3.minDate,
                    maxDate = _this$props3.maxDate,
                    maxDetail = _this$props3.maxDetail,
                    returnValue = _this$props3.returnValue;

                var processFunction = (function () {
                    switch (returnValue) {
                        case "start":
                            return getDetailValueFrom;

                        case "end":
                            return getDetailValueTo;

                        case "range":
                            return getDetailValueArray;

                        default:
                            throw new Error("Invalid returnValue.");
                    }
                })();

                return processFunction({
                    value: value,
                    minDate: minDate,
                    maxDate: maxDate,
                    maxDetail: maxDetail,
                });
            },
        },
        {
            key: "renderContent",
            value: function renderContent(next) {
                var currentActiveStartDate = this.activeStartDate,
                    onMouseOver = this.onMouseOver,
                    valueType = this.valueType,
                    value = this.value,
                    view = this.view;
                var _this$props4 = this.props,
                    calendarType = _this$props4.calendarType,
                    locale = _this$props4.locale,
                    maxDate = _this$props4.maxDate,
                    minDate = _this$props4.minDate,
                    selectRange = _this$props4.selectRange,
                    tileClassName = _this$props4.tileClassName,
                    tileContent = _this$props4.tileContent,
                    tileDisabled = _this$props4.tileDisabled;
                var hover = this.hover;
                var activeStartDate = next
                    ? getBeginNext(view, currentActiveStartDate)
                    : getBegin(view, currentActiveStartDate);
                var onClick = this.drillDownAvailable
                    ? this.drillDown
                    : this.onChange;
                var commonProps = {
                    activeStartDate: activeStartDate,
                    hover: hover,
                    locale: locale,
                    maxDate: maxDate,
                    minDate: minDate,
                    onClick: onClick,
                    onMouseOver: selectRange ? onMouseOver : null,
                    tileClassName: tileClassName,
                    tileContent: tileContent,
                    tileDisabled: tileDisabled,
                    value: value,
                    valueType: valueType,
                };

                switch (view) {
                    case "century": {
                        var formatYear = this.props.formatYear;
                        return /*#__PURE__*/ React.createElement(
                            CenturyView,
                            _extends(
                                {
                                    formatYear: formatYear,
                                },
                                commonProps
                            )
                        );
                    }

                    case "decade": {
                        var _formatYear = this.props.formatYear;
                        return /*#__PURE__*/ React.createElement(
                            DecadeView,
                            _extends(
                                {
                                    formatYear: _formatYear,
                                },
                                commonProps
                            )
                        );
                    }

                    case "year": {
                        var _this$props5 = this.props,
                            formatMonth = _this$props5.formatMonth,
                            formatMonthYear = _this$props5.formatMonthYear;
                        return /*#__PURE__*/ React.createElement(
                            YearView,
                            _extends(
                                {
                                    formatMonth: formatMonth,
                                    formatMonthYear: formatMonthYear,
                                },
                                commonProps
                            )
                        );
                    }

                    case "month": {
                        var _this$props6 = this.props,
                            formatDay = _this$props6.formatDay,
                            formatLongDate = _this$props6.formatLongDate,
                            formatShortWeekday =
                                _this$props6.formatShortWeekday,
                            onClickWeekNumber = _this$props6.onClickWeekNumber,
                            showDoubleView = _this$props6.showDoubleView,
                            showFixedNumberOfWeeks =
                                _this$props6.showFixedNumberOfWeeks,
                            showNeighboringMonth =
                                _this$props6.showNeighboringMonth,
                            showWeekNumbers = _this$props6.showWeekNumbers;
                        var onMouseLeave = this.onMouseLeave;
                        return /*#__PURE__*/ React.createElement(
                            MonthView,
                            _extends(
                                {
                                    calendarType: calendarType,
                                    formatDay: formatDay,
                                    formatLongDate: formatLongDate,
                                    formatShortWeekday: formatShortWeekday,
                                    onClickWeekNumber: onClickWeekNumber,
                                    onMouseLeave: selectRange
                                        ? onMouseLeave
                                        : null,
                                    showFixedNumberOfWeeks:
                                        showFixedNumberOfWeeks ||
                                        showDoubleView,
                                    showNeighboringMonth: showNeighboringMonth,
                                    showWeekNumbers: showWeekNumbers,
                                },
                                commonProps
                            )
                        );
                    }

                    default:
                        throw new Error("Invalid view: ".concat(view, "."));
                }
            },
        },
        {
            key: "renderNavigation",
            value: function renderNavigation() {
                var showNavigation = this.props.showNavigation;

                if (!showNavigation) {
                    return null;
                }

                var activeStartDate = this.activeStartDate,
                    view = this.view,
                    views = this.views;
                var _this$props7 = this.props,
                    formatMonthYear = _this$props7.formatMonthYear,
                    formatYear = _this$props7.formatYear,
                    locale = _this$props7.locale,
                    maxDate = _this$props7.maxDate,
                    minDate = _this$props7.minDate,
                    navigationAriaLabel = _this$props7.navigationAriaLabel,
                    navigationLabel = _this$props7.navigationLabel,
                    next2AriaLabel = _this$props7.next2AriaLabel,
                    next2Label = _this$props7.next2Label,
                    nextAriaLabel = _this$props7.nextAriaLabel,
                    nextLabel = _this$props7.nextLabel,
                    prev2AriaLabel = _this$props7.prev2AriaLabel,
                    prev2Label = _this$props7.prev2Label,
                    prevAriaLabel = _this$props7.prevAriaLabel,
                    prevLabel = _this$props7.prevLabel,
                    showDoubleView = _this$props7.showDoubleView;
                return /*#__PURE__*/ React.createElement(Navigation, {
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
                    views: views,
                });
            },
        },
        {
            key: "render",
            value: function render() {
                var _this$props8 = this.props,
                    className = _this$props8.className,
                    inputRef = _this$props8.inputRef,
                    selectRange = _this$props8.selectRange,
                    showDoubleView = _this$props8.showDoubleView;
                var onMouseLeave = this.onMouseLeave,
                    value = this.value;
                var valueArray = [].concat(value);
                return /*#__PURE__*/ React.createElement(
                    "div",
                    {
                        className: mergeClassNames(
                            baseClassName,
                            selectRange &&
                                valueArray.length === 1 &&
                                "".concat(baseClassName, "--selectRange"),
                            showDoubleView &&
                                "".concat(baseClassName, "--doubleView"),
                            className
                        ),
                        ref: inputRef,
                    },
                    this.renderNavigation(),
                    /*#__PURE__*/ React.createElement(
                        "div",
                        {
                            className: "".concat(
                                baseClassName,
                                "__viewContainer"
                            ),
                            onBlur: selectRange ? onMouseLeave : null,
                            onMouseLeave: selectRange ? onMouseLeave : null,
                        },
                        this.renderContent(),
                        showDoubleView && this.renderContent(true)
                    )
                );
            },
        },
        {
            key: "activeStartDate",
            get: function get() {
                var activeStartDateProps = this.props.activeStartDate;
                var activeStartDateState = this.state.activeStartDate;
                return (
                    activeStartDateProps ||
                    activeStartDateState ||
                    getInitialActiveStartDate(this.props)
                );
            },
        },
        {
            key: "value",
            get: function get() {
                var _this$props9 = this.props,
                    selectRange = _this$props9.selectRange,
                    valueProps = _this$props9.value;
                var valueState = this.state.value; // In the middle of range selection, use value from state

                if (selectRange && getIsSingleValue(valueState)) {
                    return valueState;
                }

                return valueProps !== undefined ? valueProps : valueState;
            },
        },
        {
            key: "valueType",
            get: function get() {
                var maxDetail = this.props.maxDetail;
                return getValueType(maxDetail);
            },
        },
        {
            key: "view",
            get: function get() {
                var _this$props10 = this.props,
                    minDetail = _this$props10.minDetail,
                    maxDetail = _this$props10.maxDetail,
                    viewProps = _this$props10.view;
                var viewState = this.state.view;
                return getView(viewProps || viewState, minDetail, maxDetail);
            },
        },
        {
            key: "views",
            get: function get() {
                var _this$props11 = this.props,
                    minDetail = _this$props11.minDetail,
                    maxDetail = _this$props11.maxDetail;
                return getLimitedViews(minDetail, maxDetail);
            },
        },
        {
            key: "hover",
            get: function get() {
                var selectRange = this.props.selectRange;
                var hover = this.state.hover;
                return selectRange ? hover : null;
            },
        },
        {
            key: "drillDownAvailable",
            get: function get() {
                var view = this.view,
                    views = this.views;
                return views.indexOf(view) < views.length - 1;
            },
        },
        {
            key: "drillUpAvailable",
            get: function get() {
                var view = this.view,
                    views = this.views;
                return views.indexOf(view) > 0;
            },
        },
    ]);

    return Calendar;
})(_);
Calendar.defaultProps = {
    maxDate: defaultMaxDate,
    maxDetail: "month",
    minDate: defaultMinDate,
    minDetail: "century",
    returnValue: "start",
    showNavigation: true,
    showNeighboringMonth: true,
};
var isActiveStartDate = PropTypes.instanceOf(Date);
var isLooseValue = PropTypes.oneOfType([PropTypes.string, isValue]);
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
    returnValue: PropTypes.oneOf(["start", "end", "range"]),
    selectRange: PropTypes.bool,
    showDoubleView: PropTypes.bool,
    showFixedNumberOfWeeks: PropTypes.bool,
    showNavigation: PropTypes.bool,
    showNeighboringMonth: PropTypes.bool,
    showWeekNumbers: PropTypes.bool,
    tileClassName: PropTypes.oneOfType([PropTypes.func, isClassName]),
    tileContent: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
    tileDisabled: PropTypes.func,
    value: isLooseValue,
    view: isView,
};
style("/assets/Calendar.4739c73f.css");
function CompatDemo() {
    const [value, onChange] = l$2(new Date());
    return m$1`<${Calendar} onChange=${onChange} showWeekNumbers value=${value}/>`;
}
export default CompatDemo;
