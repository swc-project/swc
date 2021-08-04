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
function S(
    n, t
) {
    for (var e in t) n[e] = t[e];
    return n;
}
function C(
    n, t
) {
    for (var e in n) if ("__source" !== e && !(e in t)) return !0;
    for (var r in t) if ("__source" !== r && n[r] !== t[r]) return !0;
    return !1;
}
function E(
    n
) {
    this.props = n;
}
function g$1(
    n, t
) {
    function e(
        n
    ) {
        var e = this.props.ref,
            r = e == n.ref;
        return (
            !r && e && (e.call
                ? e(
                    null
                )
                : (e.current = null)),
            t
                ? !t(
                    this.props,
                    n
                ) || !r
                : C(
                    this.props,
                    n
                )
        );
    }
    function r(
        t
    ) {
        return (this.shouldComponentUpdate = e), v$1(
            n,
            t
        );
    }
    return (
        (r.displayName = "Memo(" + (n.displayName || n.name) + ")"),
        (r.prototype.isReactComponent = !0),
        (r.__f = !0),
        r
    );
}
((E.prototype = new _(
)).isPureReactComponent = !0),
(E.prototype.shouldComponentUpdate = function (
    n, t
) {
    return C(
        this.props,
        n
    ) || C(
        this.state,
        t
    );
});
var w$1 = l$1.__b;
l$1.__b = function (
    n
) {
    n.type && n.type.__f && n.ref && ((n.props.ref = n.ref), (n.ref = null)),
    w$1 && w$1(
        n
    );
};
var R =
    ("undefined" != typeof Symbol &&
        Symbol.for &&
        Symbol.for(
            "react.forward_ref"
        )) ||
    3911;
function x$1(
    n
) {
    function t(
        t, e
    ) {
        var r = S(
            {
            },
            t
        );
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
var N = function (
        n, t
    ) {
        return null == n
            ? null
            : A$2(
                A$2(
                    n
                ).map(
                    t
                )
            );
    },
    k$1 = {
        map: N,
        forEach: N,
        count: function (
            n
        ) {
            return n
                ? A$2(
                    n
                ).length
                : 0;
        },
        only: function (
            n
        ) {
            var t = A$2(
                n
            );
            if (1 !== t.length) throw "Children.only";
            return t[0];
        },
        toArray: A$2,
    },
    A$1 = l$1.__e;
l$1.__e = function (
    n, t, e
) {
    if (n.then)
        for (var r, u = t; (u = u.__); )
            if ((r = u.__c) && r.__c)
                return (
                    null == t.__e && ((t.__e = e.__e), (t.__k = e.__k)),
                    r.__c(
                        n,
                        t
                    )
                );
    A$1(
        n,
        t,
        e
    );
};
var O = l$1.unmount;
function L(
) {
    (this.__u = 0), (this.t = null), (this.__b = null);
}
function U(
    n
) {
    var t = n.__.__c;
    return t && t.__e && t.__e(
        n
    );
}
function F(
    n
) {
    var t, e, r;
    function u(
        u
    ) {
        if (
            (t ||
                (t = n(
                )).then(
                    function (
                        n
                    ) {
                        e = n.default || n;
                    },
                    function (
                        n
                    ) {
                        r = n;
                    }
                ),
            r)
        )
            throw r;
        if (!e) throw t;
        return v$1(
            e,
            u
        );
    }
    return (u.displayName = "Lazy"), (u.__f = !0), u;
}
function M(
) {
    (this.u = null), (this.o = null);
}
(l$1.unmount = function (
    n
) {
    var t = n.__c;
    t && t.__R && t.__R(
    ), t && !0 === n.__h && (n.type = null), O && O(
        n
    );
}),
((L.prototype = new _(
)).__c = function (
    n, t
) {
    var e = t.__c,
        r = this;
    null == r.t && (r.t = []), r.t.push(
        e
    );
    var u = U(
            r.__v
        ),
        o = !1,
        i = function (
        ) {
            o || ((o = !0), (e.__R = null), u
                ? u(
                    l
                )
                : l(
                ));
        };
    e.__R = i;
    var l = function (
        ) {
            if (!--r.__u) {
                if (r.state.__e) {
                    var n = r.state.__e;
                    r.__v.__k[0] = (function n(
                        t, e, r
                    ) {
                        return (
                            t &&
                                    ((t.__v = null),
                                    (t.__k =
                                        t.__k &&
                                        t.__k.map(
                                            function (
                                                t
                                            ) {
                                                return n(
                                                    t,
                                                    e,
                                                    r
                                                );
                                            }
                                        )),
                                    t.__c &&
                                        t.__c.__P === e &&
                                        (t.__e && r.insertBefore(
                                            t.__e,
                                            t.__d
                                        ),
                                        (t.__c.__e = !0),
                                        (t.__c.__P = r))),
                            t
                        );
                    })(
                        n,
                        n.__c.__P,
                        n.__c.__O
                    );
                }
                var t;
                for (r.setState(
                    {
                        __e: (r.__b = null),
                    }
                ); (t = r.t.pop(
                    )); )
                    t.forceUpdate(
                    );
            }
        },
        f = !0 === t.__h;
    r.__u++ || f || r.setState(
        {
            __e: (r.__b = r.__v.__k[0]),
        }
    ),
    n.then(
        i,
        i
    );
}),
(L.prototype.componentWillUnmount = function (
) {
    this.t = [];
}),
(L.prototype.render = function (
    n, t
) {
    if (this.__b) {
        if (this.__v.__k) {
            var e = document.createElement(
                    "div"
                ),
                r = this.__v.__k[0].__c;
            this.__v.__k[0] = (function n(
                t, e, r
            ) {
                return (
                    t &&
                            (t.__c &&
                                t.__c.__H &&
                                (t.__c.__H.__.forEach(
                                    function (
                                        n
                                    ) {
                                        "function" == typeof n.__c && n.__c(
                                        );
                                    }
                                ),
                                (t.__c.__H = null)),
                            null != (t = S(
                                {
                                },
                                t
                            )).__c &&
                                (t.__c.__P === r && (t.__c.__P = e),
                                (t.__c = null)),
                            (t.__k =
                                t.__k &&
                                t.__k.map(
                                    function (
                                        t
                                    ) {
                                        return n(
                                            t,
                                            e,
                                            r
                                        );
                                    }
                                ))),
                    t
                );
            })(
                this.__b,
                e, (
                    r.__O = r.__P)
            );
        }
        this.__b = null;
    }
    var u = t.__e && v$1(
        d$1,
        null,
        n.fallback
    );
    return (
        u && (u.__h = null), [v$1(
            d$1,
            null,
            t.__e ? null : n.children
        ), u,]
    );
});
var T = function (
    n, t, e
) {
    if (
        (++e[1] === e[0] && n.o.delete(
            t
        ),
        n.props.revealOrder && ("t" !== n.props.revealOrder[0] || !n.o.size))
    )
        for (e = n.u; e; ) {
            for (; e.length > 3; ) e.pop(
            )(
            );
            if (e[1] < e[0]) break;
            n.u = e = e[2];
        }
};
function D(
    n
) {
    return (
        (this.getChildContext = function (
        ) {
            return n.context;
        }),
        n.children
    );
}
function I(
    n
) {
    var t = this,
        e = n.i;
    (t.componentWillUnmount = function (
    ) {
        S$1(
            null,
            t.l
        ), (t.l = null), (t.i = null);
    }),
    t.i && t.i !== e && t.componentWillUnmount(
    ),
    n.__v
        ? (t.l ||
                  ((t.i = e),
                  (t.l = {
                      nodeType: 1,
                      parentNode: e,
                      childNodes: [],
                      appendChild: function (
                          n
                      ) {
                          this.childNodes.push(
                              n
                          ), t.i.appendChild(
                              n
                          );
                      },
                      insertBefore: function (
                          n, e
                      ) {
                          this.childNodes.push(
                              n
                          ), t.i.appendChild(
                              n
                          );
                      },
                      removeChild: function (
                          n
                      ) {
                          this.childNodes.splice(
                              this.childNodes.indexOf(
                                  n
                              ) >>> 1,
                              1
                          ),
                          t.i.removeChild(
                              n
                          );
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
        : t.l && t.componentWillUnmount(
        );
}
function W(
    n, t
) {
    return v$1(
        I,
        {
            __v: n,
            i: t,
        }
    );
}
((M.prototype = new _(
)).__e = function (
    n
) {
    var t = this,
        e = U(
            t.__v
        ),
        r = t.o.get(
            n
        );
    return (
        r[0]++,
        function (
            u
        ) {
            var o = function (
            ) {
                t.props.revealOrder
                    ? (r.push(
                        u
                    ), T(
                        t,
                        n,
                        r
                    ))
                    : u(
                    );
            };
            e
                ? e(
                    o
                )
                : o(
                );
        }
    );
}),
(M.prototype.render = function (
    n
) {
    (this.u = null), (this.o = new Map(
    ));
    var t = A$2(
        n.children
    );
    n.revealOrder && "b" === n.revealOrder[0] && t.reverse(
    );
    for (var e = t.length; e--; )
        this.o.set(
            t[e], (
                this.u = [1, 0, this.u,])
        );
    return n.children;
}),
(M.prototype.componentDidUpdate = M.prototype.componentDidMount =
        function (
        ) {
            var n = this;
            this.o.forEach(
                function (
                    t, e
                ) {
                    T(
                        n,
                        e,
                        t
                    );
                }
            );
        });
var j =
        ("undefined" != typeof Symbol &&
            Symbol.for &&
            Symbol.for(
                "react.element"
            )) ||
        60103,
    P =
        /^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|fill|flood|font|glyph(?!R)|horiz|marker(?!H|W|U)|overline|paint|stop|strikethrough|stroke|text(?!L)|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/,
    V = function (
        n
    ) {
        return (
            "undefined" != typeof Symbol && "symbol" == typeof Symbol(
            )
                ? /fil|che|rad/i
                : /fil|che|ra/i
        ).test(
            n
        );
    };
function z$1(
    n, t, e
) {
    return (
        null == t.__k && (t.textContent = ""),
        S$1(
            n,
            t
        ),
        "function" == typeof e && e(
        ),
        n ? n.__c : null
    );
}
function B(
    n, t, e
) {
    return q$2(
        n,
        t
    ), "function" == typeof e && e(
    ), n ? n.__c : null;
}
(_.prototype.isReactComponent = {
}),
[
    "componentWillMount",
    "componentWillReceiveProps",
    "componentWillUpdate",
].forEach(
    function (
        n
    ) {
        Object.defineProperty(
            _.prototype,
            n,
            {
                configurable: !0,
                get: function (
                ) {
                    return this["UNSAFE_" + n];
                },
                set: function (
                    t
                ) {
                    Object.defineProperty(
                        this,
                        n,
                        {
                            configurable: !0,
                            writable: !0,
                            value: t,
                        }
                    );
                },
            }
        );
    }
);
var H = l$1.event;
function Z(
) {}
function Y(
) {
    return this.cancelBubble;
}
function $(
) {
    return this.defaultPrevented;
}
l$1.event = function (
    n
) {
    return (
        H && (n = H(
            n
        )),
        (n.persist = Z),
        (n.isPropagationStopped = Y),
        (n.isDefaultPrevented = $),
        (n.nativeEvent = n)
    );
};
var q$1,
    G = {
        configurable: !0,
        get: function (
        ) {
            return this.class;
        },
    },
    J = l$1.vnode;
l$1.vnode = function (
    n
) {
    var t = n.type,
        e = n.props,
        r = e;
    if ("string" == typeof t) {
        for (var u in ((r = {
        }), e)) {
            var o = e[u];
            ("value" === u && "defaultValue" in e && null == o) ||
                ("defaultValue" === u && "value" in e && null == e.value
                    ? (u = "value")
                    : "download" === u && !0 === o
                        ? (o = "")
                        : /ondoubleclick/i.test(
                            u
                        )
                            ? (u = "ondblclick")
                            : /^onchange(textarea|input)/i.test(
                                u + t
                            ) && !V(
                                e.type
                            )
                                ? (u = "oninput")
                                : /^on(Ani|Tra|Tou|BeforeInp)/.test(
                                    u
                                )
                                    ? (u = u.toLowerCase(
                                    ))
                                    : P.test(
                                        u
                                    )
                                        ? (u = u.replace(
                                            /[A-Z0-9]/,
                                            "-$&"
                                        ).toLowerCase(
                                        ))
                                        : null === o && (o = void 0),
                (r[u] = o));
        }
        "select" == t &&
            r.multiple &&
            Array.isArray(
                r.value
            ) &&
            (r.value = A$2(
                e.children
            ).forEach(
                function (
                    n
                ) {
                    n.props.selected = -1 != r.value.indexOf(
                        n.props.value
                    );
                }
            )),
        "select" == t &&
                null != r.defaultValue &&
                (r.value = A$2(
                    e.children
                ).forEach(
                    function (
                        n
                    ) {
                        n.props.selected = r.multiple
                            ? -1 != r.defaultValue.indexOf(
                                n.props.value
                            )
                            : r.defaultValue == n.props.value;
                    }
                )),
        (n.props = r);
    }
    t &&
        e.class != e.className &&
        ((G.enumerable = "className" in e),
        null != e.className && (r.class = e.className),
        Object.defineProperty(
            r,
            "className",
            G
        )),
    (n.$$typeof = j),
    J && J(
        n
    );
};
var K = l$1.__r;
l$1.__r = function (
    n
) {
    K && K(
        n
    ), (q$1 = n.__c);
};
var Q = {
    ReactCurrentDispatcher: {
        current: {
            readContext: function (
                n
            ) {
                return q$1.__n[n.__c].props.value;
            },
        },
    },
};
function nn(
    n
) {
    return v$1.bind(
        null,
        n
    );
}
function tn(
    n
) {
    return !!n && n.$$typeof === j;
}
function en(
    n
) {
    return tn(
        n
    )
        ? B$1.apply(
            null,
            arguments
        )
        : n;
}
function rn(
    n
) {
    return !!n.__k && (S$1(
        null,
        n
    ), !0);
}
function un(
    n
) {
    return (n && (n.base || (1 === n.nodeType && n))) || null;
}
var on = function (
        n, t
    ) {
        return n(
            t
        );
    },
    ln = function (
        n, t
    ) {
        return n(
            t
        );
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
        exports: {
        },
    },
    exports = module$7.exports,
    b = "function" == typeof Symbol && Symbol.for,
    c = b
        ? Symbol.for(
            "react.element"
        )
        : 60103,
    d = b
        ? Symbol.for(
            "react.portal"
        )
        : 60106,
    e = b
        ? Symbol.for(
            "react.fragment"
        )
        : 60107,
    f = b
        ? Symbol.for(
            "react.strict_mode"
        )
        : 60108,
    g = b
        ? Symbol.for(
            "react.profiler"
        )
        : 60114,
    h = b
        ? Symbol.for(
            "react.provider"
        )
        : 60109,
    k = b
        ? Symbol.for(
            "react.context"
        )
        : 60110,
    l = b
        ? Symbol.for(
            "react.async_mode"
        )
        : 60111,
    m = b
        ? Symbol.for(
            "react.concurrent_mode"
        )
        : 60111,
    n = b
        ? Symbol.for(
            "react.forward_ref"
        )
        : 60112,
    p = b
        ? Symbol.for(
            "react.suspense"
        )
        : 60113,
    q = b
        ? Symbol.for(
            "react.suspense_list"
        )
        : 60120,
    r = b
        ? Symbol.for(
            "react.memo"
        )
        : 60115,
    t = b
        ? Symbol.for(
            "react.lazy"
        )
        : 60116,
    v = b
        ? Symbol.for(
            "react.block"
        )
        : 60121,
    w = b
        ? Symbol.for(
            "react.fundamental"
        )
        : 60117,
    x = b
        ? Symbol.for(
            "react.responder"
        )
        : 60118,
    y = b
        ? Symbol.for(
            "react.scope"
        )
        : 60119;
function z(
    a
) {
    if ("object" == typeof a && null !== a) {
        var u = a.$$typeof;
        switch (u) {
        case c:
            switch ((a = a.type)) {
            case l:
            case m:
            case e:
            case g:
            case f:
            case p:
                return a;
            default:
                switch ((a = a && a.$$typeof)) {
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
function A(
    a
) {
    return z(
        a
    ) === m;
}
(exports.AsyncMode = l),
(exports.ConcurrentMode = m),
(exports.ContextConsumer = k),
(exports.ContextProvider = h),
(exports.Element = c),
(exports.ForwardRef = n),
(exports.Fragment = e),
(exports.Lazy = t),
(exports.Memo = r),
(exports.Portal = d),
(exports.Profiler = g),
(exports.StrictMode = f),
(exports.Suspense = p),
(exports.isAsyncMode = function (
    a
) {
    return A(
        a
    ) || z(
        a
    ) === l;
}),
(exports.isConcurrentMode = A),
(exports.isContextConsumer = function (
    a
) {
    return z(
        a
    ) === k;
}),
(exports.isContextProvider = function (
    a
) {
    return z(
        a
    ) === h;
}),
(exports.isElement = function (
    a
) {
    return "object" == typeof a && null !== a && a.$$typeof === c;
}),
(exports.isForwardRef = function (
    a
) {
    return z(
        a
    ) === n;
}),
(exports.isFragment = function (
    a
) {
    return z(
        a
    ) === e;
}),
(exports.isLazy = function (
    a
) {
    return z(
        a
    ) === t;
}),
(exports.isMemo = function (
    a
) {
    return z(
        a
    ) === r;
}),
(exports.isPortal = function (
    a
) {
    return z(
        a
    ) === d;
}),
(exports.isProfiler = function (
    a
) {
    return z(
        a
    ) === g;
}),
(exports.isStrictMode = function (
    a
) {
    return z(
        a
    ) === f;
}),
(exports.isSuspense = function (
    a
) {
    return z(
        a
    ) === p;
}),
(exports.isValidElementType = function (
    a
) {
    return (
        "string" == typeof a ||
            "function" == typeof a ||
            a === e ||
            a === m ||
            a === g ||
            a === f ||
            a === p ||
            a === q ||
            ("object" == typeof a &&
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
}),
(exports.typeOf = z);
const reactIs_production_min = module$7.exports,
    $cjs$_cjs_react_is_production_min_js = Object.freeze(
        {
            __proto__: null,
            default: reactIs_production_min,
        }
    );
function $$cjs_default$$$3(
    m, i
) {
    for (i in m) if ("default" != i) return m;
    return m.default || m;
}
var module$6 = {
    exports: {
    },
};
module$6.exports = $$cjs_default$$$3(
    $cjs$_cjs_react_is_production_min_js
);
const index$1 = module$6.exports,
    $cjs$react_is = Object.freeze(
        {
            __proto__: null,
            default: index$1,
        }
    );
var module$5 = {
        exports: {
        },
    },
    getOwnPropertySymbols = Object.getOwnPropertySymbols,
    hasOwnProperty = Object.prototype.hasOwnProperty,
    propIsEnumerable = Object.prototype.propertyIsEnumerable;
function toObject(
    val
) {
    if (null == val)
        throw new TypeError(
            "Object.assign cannot be called with null or undefined"
        );
    return Object(
        val
    );
}
function shouldUseNative(
) {
    try {
        if (!Object.assign) return !1;
        var test1 = new String(
            "abc"
        );
        if (((test1[5] = "de"), "5" === Object.getOwnPropertyNames(
            test1
        )[0]))
            return !1;
        for (var test2 = {
            }, i = 0; i < 10; i++)
            test2["_" + String.fromCharCode(
                i
            )] = i;
        if (
            "0123456789" !==
            Object.getOwnPropertyNames(
                test2
            )
                .map(
                    function (
                        n
                    ) {
                        return test2[n];
                    }
                )
                .join(
                    ""
                )
        )
            return !1;
        var test3 = {
        };
        return (
            "abcdefghijklmnopqrst".split(
                ""
            ).forEach(
                function (
                    letter
                ) {
                    test3[letter] = letter;
                }
            ),
            "abcdefghijklmnopqrst" ===
                Object.keys(
                    Object.assign(
                        {
                        },
                        test3
                    )
                ).join(
                    ""
                )
        );
    } catch (err) {
        return !1;
    }
}
module$5.exports = shouldUseNative(
)
    ? Object.assign
    : function (
        target, source
    ) {
        for (
            var from, symbols, to = toObject(
                    target
                ), s = 1;
            s < arguments.length;
            s++
        ) {
            for (var key in (from = Object(
                arguments[s]
            )))
                hasOwnProperty.call(
                    from,
                    key
                ) && (to[key] = from[key]);
            if (getOwnPropertySymbols) {
                symbols = getOwnPropertySymbols(
                    from
                );
                for (var i = 0; i < symbols.length; i++)
                    propIsEnumerable.call(
                        from,
                        symbols[i]
                    ) &&
                          (to[symbols[i]] = from[symbols[i]]);
            }
        }
        return to;
    };
const index = module$5.exports,
    $cjs$object_assign = Object.freeze(
        {
            __proto__: null,
            default: index,
        }
    );
var module$4 = {
        exports: {
        },
    },
    ReactPropTypesSecret$1 = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
module$4.exports = ReactPropTypesSecret$1;
const ReactPropTypesSecret$2 = module$4.exports,
    $cjs$_lib_ReactPropTypesSecret = Object.freeze(
        {
            __proto__: null,
            default: ReactPropTypesSecret$2,
        }
    );
var module$3 = {
    exports: {
    },
};
function checkPropTypes(
    typeSpecs, values, location, componentName, getStack
) {}
(checkPropTypes.resetWarningCache = function (
) {}),
(module$3.exports = checkPropTypes);
const checkPropTypes$1 = module$3.exports,
    $cjs$_checkPropTypes = Object.freeze(
        {
            __proto__: null,
            default: checkPropTypes$1,
        }
    );
function $$cjs_default$$$2(
    m, i
) {
    for (i in m) if ("default" != i) return m;
    return m.default || m;
}
function $$cjs_default$$$1(
    m, i
) {
    for (i in m) if ("default" != i) return m;
    return m.default || m;
}
$$cjs_default$$$2(
    $cjs$react_is
),
$$cjs_default$$$2(
    $cjs$object_assign
),
$$cjs_default$$$2(
    $cjs$_lib_ReactPropTypesSecret
),
$$cjs_default$$$2(
    $cjs$_checkPropTypes
),
Function.call.bind(
    Object.prototype.hasOwnProperty
);
var module$2 = {
        exports: {
        },
    },
    ReactPropTypesSecret = $$cjs_default$$$1(
        $cjs$_lib_ReactPropTypesSecret
    );
function emptyFunction(
) {}
function emptyFunctionWithReset(
) {}
(emptyFunctionWithReset.resetWarningCache = emptyFunction),
(module$2.exports = function (
) {
    function shim(
        props,
        propName,
        componentName,
        location,
        propFullName,
        secret
    ) {
        if (secret !== ReactPropTypesSecret) {
            var err = new Error(
                "Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types"
            );
            throw ((err.name = "Invariant Violation"), err);
        }
    }
    function getShim(
    ) {
        return shim;
    }
    shim.isRequired = shim;
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
    return (ReactPropTypes.PropTypes = ReactPropTypes), ReactPropTypes;
});
const factoryWithThrowingShims = module$2.exports,
    $cjs$_factoryWithThrowingShims = Object.freeze(
        {
            __proto__: null,
            default: factoryWithThrowingShims,
        }
    );
function $$cjs_default$$(
    m, i
) {
    for (i in m) if ("default" != i) return m;
    return m.default || m;
}
var module$1 = {
    exports: {
    },
};
module$1.exports = $$cjs_default$$(
    $cjs$_factoryWithThrowingShims
)(
);
const PropTypes = module$1.exports;
function mergeClassNames(
) {
    return Array.prototype.slice
        .call(
            arguments
        )
        .reduce(
            function (
                classList, arg
            ) {
                return "string" == typeof arg || Array.isArray(
                    arg
                )
                    ? classList.concat(
                        arg
                    )
                    : classList;
            },
            []
        )
        .filter(
            Boolean
        )
        .join(
            " "
        );
}
var module = {
        exports: {
        },
    },
    FUNC_ERROR_TEXT = "Expected a function",
    INFINITY = 1 / 0,
    MAX_INTEGER = 17976931348623157e292,
    NAN = NaN,
    symbolTag = "[object Symbol]",
    reTrim = /^\s+|\s+$/g,
    reIsBadHex = /^[-+]0x[0-9a-f]+$/i,
    reIsBinary = /^0b[01]+$/i,
    reIsOctal = /^0o[0-7]+$/i,
    freeParseInt = parseInt,
    objectProto = Object.prototype,
    objectToString = objectProto.toString;
function before(
    n, func
) {
    var result;
    if ("function" != typeof func) throw new TypeError(
        FUNC_ERROR_TEXT
    );
    return (
        (n = toInteger(
            n
        )),
        function (
        ) {
            return (
                --n > 0 && (result = func.apply(
                    this,
                    arguments
                )),
                n <= 1 && (func = void 0),
                result
            );
        }
    );
}
function once(
    func
) {
    return before(
        2,
        func
    );
}
function isObject(
    value
) {
    var type = typeof value;
    return !!value && ("object" == type || "function" == type);
}
function isObjectLike(
    value
) {
    return !!value && "object" == typeof value;
}
function isSymbol(
    value
) {
    return (
        "symbol" == typeof value ||
        (isObjectLike(
            value
        ) && objectToString.call(
            value
        ) == symbolTag)
    );
}
function toFinite(
    value
) {
    return value
        ? (value = toNumber(
            value
        )) === INFINITY || value === -INFINITY
            ? (value < 0 ? -1 : 1) * MAX_INTEGER
            : value == value
                ? value
                : 0
        : 0 === value
            ? value
            : 0;
}
function toInteger(
    value
) {
    var result = toFinite(
            value
        ),
        remainder = result % 1;
    return result == result ? (remainder ? result - remainder : result) : 0;
}
function toNumber(
    value
) {
    if ("number" == typeof value) return value;
    if (isSymbol(
        value
    )) return NAN;
    if (isObject(
        value
    )) {
        var other =
            "function" == typeof value.valueOf
                ? value.valueOf(
                )
                : value;
        value = isObject(
            other
        )
            ? other + ""
            : other;
    }
    if ("string" != typeof value) return 0 === value ? value : +value;
    value = value.replace(
        reTrim,
        ""
    );
    var isBinary = reIsBinary.test(
        value
    );
    return isBinary || reIsOctal.test(
        value
    )
        ? freeParseInt(
            value.slice(
                2
            ),
            isBinary ? 2 : 8
        )
        : reIsBadHex.test(
            value
        )
            ? NAN
            : +value;
}
module.exports = once;
const once$1 = module.exports;
function filterDuplicates(
    arr
) {
    return arr.filter(
        function (
            el, index, self
        ) {
            return self.indexOf(
                el
            ) === index;
        }
    );
}
function fixLowercaseProperties(
    arr
) {
    return arr.map(
        function (
            el
        ) {
            if (!el || -1 === el.indexOf(
                "-"
            ) || el.toLowerCase(
            ) !== el) return el;
            var splitEl = el.split(
                "-"
            );
            return "".concat(
                splitEl[0],
                "-"
            ).concat(
                splitEl[1].toUpperCase(
                )
            );
        }
    );
}
function getUserLocalesInternal(
) {
    var languageList = [];
    return (
        "undefined" != typeof window &&
            (window.navigator.languages &&
                (languageList = languageList.concat(
                    window.navigator.languages
                )),
            window.navigator.language &&
                languageList.push(
                    window.navigator.language
                ),
            window.navigator.userLanguage &&
                languageList.push(
                    window.navigator.userLanguage
                ),
            window.navigator.browserLanguage &&
                languageList.push(
                    window.navigator.browserLanguage
                ),
            window.navigator.systemLanguage &&
                languageList.push(
                    window.navigator.systemLanguage
                )),
        languageList.push(
            "en-US"
        ),
        fixLowercaseProperties(
            filterDuplicates(
                languageList
            )
        )
    );
}
var getUserLocales = once$1(
    getUserLocalesInternal
);
function getUserLocaleInternal(
) {
    return getUserLocales(
    )[0];
}
var getUserLocale = once$1(
    getUserLocaleInternal
);
function makeGetEdgeOfNeighbor(
    getPeriod, getEdgeOfPeriod, defaultOffset
) {
    return function (
        date
    ) {
        var offset =
                arguments.length > 1 && void 0 !== arguments[1]
                    ? arguments[1]
                    : defaultOffset,
            previousPeriod = getPeriod(
                date
            ) + offset;
        return getEdgeOfPeriod(
            previousPeriod
        );
    };
}
function makeGetEnd(
    getBeginOfNextPeriod
) {
    return function (
        date
    ) {
        return new Date(
            getBeginOfNextPeriod(
                date
            ).getTime(
            ) - 1
        );
    };
}
function makeGetRange(
    functions
) {
    return function (
        date
    ) {
        return functions.map(
            function (
                fn
            ) {
                return fn(
                    date
                );
            }
        );
    };
}
function getYear(
    date
) {
    if (date instanceof Date) return date.getFullYear(
    );
    if ("number" == typeof date) return date;
    var year = parseInt(
        date,
        10
    );
    if ("string" == typeof date && !isNaN(
        year
    )) return year;
    throw new Error(
        "Failed to get year from date: ".concat(
            date,
            "."
        )
    );
}
function getMonth(
    date
) {
    if (date instanceof Date) return date.getMonth(
    );
    throw new Error(
        "Failed to get month from date: ".concat(
            date,
            "."
        )
    );
}
function getDate(
    date
) {
    if (date instanceof Date) return date.getDate(
    );
    throw new Error(
        "Failed to get year from date: ".concat(
            date,
            "."
        )
    );
}
function getCenturyStart(
    date
) {
    var year = getYear(
            date
        ),
        centuryStartYear = year + ((1 - year) % 100),
        centuryStartDate = new Date(
        );
    return (
        centuryStartDate.setFullYear(
            centuryStartYear,
            0,
            1
        ),
        centuryStartDate.setHours(
            0,
            0,
            0,
            0
        ),
        centuryStartDate
    );
}
var getPreviousCenturyStart = makeGetEdgeOfNeighbor(
        getYear,
        getCenturyStart,
        -100
    ),
    getNextCenturyStart = makeGetEdgeOfNeighbor(
        getYear,
        getCenturyStart,
        100
    ),
    getCenturyEnd = makeGetEnd(
        getNextCenturyStart
    ),
    getPreviousCenturyEnd = makeGetEdgeOfNeighbor(
        getYear,
        getCenturyEnd,
        -100
    ),
    getCenturyRange = makeGetRange(
        [getCenturyStart, getCenturyEnd,]
    );
function getDecadeStart(
    date
) {
    var year = getYear(
            date
        ),
        decadeStartYear = year + ((1 - year) % 10),
        decadeStartDate = new Date(
        );
    return (
        decadeStartDate.setFullYear(
            decadeStartYear,
            0,
            1
        ),
        decadeStartDate.setHours(
            0,
            0,
            0,
            0
        ),
        decadeStartDate
    );
}
var getPreviousDecadeStart = makeGetEdgeOfNeighbor(
        getYear,
        getDecadeStart,
        -10
    ),
    getNextDecadeStart = makeGetEdgeOfNeighbor(
        getYear,
        getDecadeStart,
        10
    ),
    getDecadeEnd = makeGetEnd(
        getNextDecadeStart
    ),
    getPreviousDecadeEnd = makeGetEdgeOfNeighbor(
        getYear,
        getDecadeEnd,
        -10
    ),
    getDecadeRange = makeGetRange(
        [getDecadeStart, getDecadeEnd,]
    );
function getYearStart(
    date
) {
    var year = getYear(
            date
        ),
        yearStartDate = new Date(
        );
    return (
        yearStartDate.setFullYear(
            year,
            0,
            1
        ),
        yearStartDate.setHours(
            0,
            0,
            0,
            0
        ),
        yearStartDate
    );
}
var getPreviousYearStart = makeGetEdgeOfNeighbor(
        getYear,
        getYearStart,
        -1
    ),
    getNextYearStart = makeGetEdgeOfNeighbor(
        getYear,
        getYearStart,
        1
    ),
    getYearEnd = makeGetEnd(
        getNextYearStart
    ),
    getPreviousYearEnd = makeGetEdgeOfNeighbor(
        getYear,
        getYearEnd,
        -1
    ),
    getYearRange = makeGetRange(
        [getYearStart, getYearEnd,]
    );
function makeGetEdgeOfNeighborMonth(
    getEdgeOfPeriod, defaultOffset
) {
    return function (
        date
    ) {
        var offset =
                arguments.length > 1 && void 0 !== arguments[1]
                    ? arguments[1]
                    : defaultOffset,
            year = getYear(
                date
            ),
            month = getMonth(
                date
            ) + offset,
            previousPeriod = new Date(
            );
        return (
            previousPeriod.setFullYear(
                year,
                month,
                1
            ),
            previousPeriod.setHours(
                0,
                0,
                0,
                0
            ),
            getEdgeOfPeriod(
                previousPeriod
            )
        );
    };
}
function getMonthStart(
    date
) {
    var year = getYear(
            date
        ),
        month = getMonth(
            date
        ),
        monthStartDate = new Date(
        );
    return (
        monthStartDate.setFullYear(
            year,
            month,
            1
        ),
        monthStartDate.setHours(
            0,
            0,
            0,
            0
        ),
        monthStartDate
    );
}
var getPreviousMonthStart = makeGetEdgeOfNeighborMonth(
        getMonthStart,
        -1
    ),
    getNextMonthStart = makeGetEdgeOfNeighborMonth(
        getMonthStart,
        1
    ),
    getMonthEnd = makeGetEnd(
        getNextMonthStart
    ),
    getPreviousMonthEnd = makeGetEdgeOfNeighborMonth(
        getMonthEnd,
        -1
    ),
    getMonthRange = makeGetRange(
        [getMonthStart, getMonthEnd,]
    );
function makeGetEdgeOfNeighborDay(
    getEdgeOfPeriod, defaultOffset
) {
    return function (
        date
    ) {
        var offset =
                arguments.length > 1 && void 0 !== arguments[1]
                    ? arguments[1]
                    : defaultOffset,
            year = getYear(
                date
            ),
            month = getMonth(
                date
            ),
            day = getDate(
                date
            ) + offset,
            previousPeriod = new Date(
            );
        return (
            previousPeriod.setFullYear(
                year,
                month,
                day
            ),
            previousPeriod.setHours(
                0,
                0,
                0,
                0
            ),
            getEdgeOfPeriod(
                previousPeriod
            )
        );
    };
}
function getDayStart(
    date
) {
    var year = getYear(
            date
        ),
        month = getMonth(
            date
        ),
        day = getDate(
            date
        ),
        dayStartDate = new Date(
        );
    return (
        dayStartDate.setFullYear(
            year,
            month,
            day
        ),
        dayStartDate.setHours(
            0,
            0,
            0,
            0
        ),
        dayStartDate
    );
}
var _CALENDAR_TYPE_LOCALE,
    getNextDayStart = makeGetEdgeOfNeighborDay(
        getDayStart,
        1
    ),
    getDayEnd = makeGetEnd(
        getNextDayStart
    ),
    getDayRange = makeGetRange(
        [getDayStart, getDayEnd,]
    );
function getDaysInMonth(
    date
) {
    return getDate(
        getMonthEnd(
            date
        )
    );
}
function _toConsumableArray$2(
    arr
) {
    return (
        _arrayWithoutHoles$2(
            arr
        ) ||
        _iterableToArray$2(
            arr
        ) ||
        _unsupportedIterableToArray$2(
            arr
        ) ||
        _nonIterableSpread$2(
        )
    );
}
function _nonIterableSpread$2(
) {
    throw new TypeError(
        "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
    );
}
function _unsupportedIterableToArray$2(
    o, minLen
) {
    if (o) {
        if ("string" == typeof o) return _arrayLikeToArray$2(
            o,
            minLen
        );
        var n = Object.prototype.toString.call(
            o
        ).slice(
            8,
            -1
        );
        return (
            "Object" === n && o.constructor && (n = o.constructor.name),
            "Map" === n || "Set" === n
                ? Array.from(
                    o
                )
                : "Arguments" === n ||
                  /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(
                      n
                  )
                    ? _arrayLikeToArray$2(
                        o,
                        minLen
                    )
                    : void 0
        );
    }
}
function _iterableToArray$2(
    iter
) {
    if ("undefined" != typeof Symbol && Symbol.iterator in Object(
        iter
    ))
        return Array.from(
            iter
        );
}
function _arrayWithoutHoles$2(
    arr
) {
    if (Array.isArray(
        arr
    )) return _arrayLikeToArray$2(
        arr
    );
}
function _arrayLikeToArray$2(
    arr, len
) {
    (null == len || len > arr.length) && (len = arr.length);
    for (var i = 0, arr2 = new Array(
        len
    ); i < len; i++) arr2[i] = arr[i];
    return arr2;
}
function _defineProperty$c(
    obj, key, value
) {
    return (
        key in obj
            ? Object.defineProperty(
                obj,
                key,
                {
                    value: value,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                }
            )
            : (obj[key] = value),
        obj
    );
}
var CALENDAR_TYPES = {
        ARABIC: "Arabic",
        HEBREW: "Hebrew",
        ISO_8601: "ISO 8601",
        US: "US",
    },
    CALENDAR_TYPE_LOCALES =
        (_defineProperty$c(
            (_CALENDAR_TYPE_LOCALE = {
            }),
            CALENDAR_TYPES.US,
            [
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
            ]
        ),
        _defineProperty$c(
            _CALENDAR_TYPE_LOCALE,
            CALENDAR_TYPES.ARABIC,
            [
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
            ]
        ),
        _defineProperty$c(
            _CALENDAR_TYPE_LOCALE,
            CALENDAR_TYPES.HEBREW,
            [
                "he",
                "he-IL",
            ]
        ),
        _CALENDAR_TYPE_LOCALE),
    WEEKDAYS = _toConsumableArray$2(
        Array(
            7
        )
    ).map(
        function (
            el, index
        ) {
            return index;
        }
    );
function getFormatter(
    options
) {
    return function (
        locale, date
    ) {
        return date.toLocaleString(
            locale || getUserLocale(
            ),
            options
        );
    };
}
function toSafeHour(
    date
) {
    var safeDate = new Date(
        date
    );
    return new Date(
        safeDate.setHours(
            12
        )
    );
}
function getSafeFormatter(
    options
) {
    return function (
        locale, date
    ) {
        return getFormatter(
            options
        )(
            locale,
            toSafeHour(
                date
            )
        );
    };
}
var formatDayOptions = {
        day: "numeric",
    },
    formatLongDateOptions = {
        day: "numeric",
        month: "long",
        year: "numeric",
    },
    formatMonthOptions = {
        month: "long",
    },
    formatMonthYearOptions = {
        month: "long",
        year: "numeric",
    },
    formatShortWeekdayOptions = {
        weekday: "short",
    },
    formatWeekdayOptions = {
        weekday: "long",
    },
    formatYearOptions = {
        year: "numeric",
    },
    formatDay = getSafeFormatter(
        formatDayOptions
    ),
    formatLongDate = getSafeFormatter(
        formatLongDateOptions
    ),
    formatMonth = getSafeFormatter(
        formatMonthOptions
    ),
    formatMonthYear = getSafeFormatter(
        formatMonthYearOptions
    ),
    formatShortWeekday = getSafeFormatter(
        formatShortWeekdayOptions
    ),
    formatWeekday = getSafeFormatter(
        formatWeekdayOptions
    ),
    formatYear = getSafeFormatter(
        formatYearOptions
    ),
    SUNDAY = WEEKDAYS[0],
    FRIDAY = WEEKDAYS[5],
    SATURDAY = WEEKDAYS[6];
function getDayOfWeek(
    date
) {
    var calendarType =
            arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : CALENDAR_TYPES.ISO_8601,
        weekday = date.getDay(
        );
    switch (calendarType) {
    case CALENDAR_TYPES.ISO_8601:
        return (weekday + 6) % 7;
    case CALENDAR_TYPES.ARABIC:
        return (weekday + 1) % 7;
    case CALENDAR_TYPES.HEBREW:
    case CALENDAR_TYPES.US:
        return weekday;
    default:
        throw new Error(
            "Unsupported calendar type."
        );
    }
}
function getBeginOfCenturyYear(
    date
) {
    return getYear(
        getCenturyStart(
            date
        )
    );
}
function getBeginOfDecadeYear(
    date
) {
    return getYear(
        getDecadeStart(
            date
        )
    );
}
function getBeginOfWeek(
    date
) {
    var calendarType =
            arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : CALENDAR_TYPES.ISO_8601,
        year = getYear(
            date
        ),
        monthIndex = getMonth(
            date
        ),
        day = date.getDate(
        ) - getDayOfWeek(
            date,
            calendarType
        );
    return new Date(
        year,
        monthIndex,
        day
    );
}
function getWeekNumber(
    date
) {
    var beginOfFirstWeek,
        calendarType =
            arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : CALENDAR_TYPES.ISO_8601,
        calendarTypeForWeekNumber =
            calendarType === CALENDAR_TYPES.US
                ? CALENDAR_TYPES.US
                : CALENDAR_TYPES.ISO_8601,
        beginOfWeek = getBeginOfWeek(
            date,
            calendarTypeForWeekNumber
        ),
        year = getYear(
            date
        ) + 1;
    do {
        (beginOfFirstWeek = getBeginOfWeek(
            new Date(
                year,
                0,
                calendarTypeForWeekNumber === CALENDAR_TYPES.ISO_8601 ? 4 : 1
            ),
            calendarTypeForWeekNumber
        )),
        (year -= 1);
    } while (date - beginOfFirstWeek < 0);
    return Math.round(
        (beginOfWeek - beginOfFirstWeek) / 6048e5
    ) + 1;
}
function getBegin(
    rangeType, date
) {
    switch (rangeType) {
    case "century":
        return getCenturyStart(
            date
        );
    case "decade":
        return getDecadeStart(
            date
        );
    case "year":
        return getYearStart(
            date
        );
    case "month":
        return getMonthStart(
            date
        );
    case "day":
        return getDayStart(
            date
        );
    default:
        throw new Error(
            "Invalid rangeType: ".concat(
                rangeType
            )
        );
    }
}
function getBeginPrevious(
    rangeType, date
) {
    switch (rangeType) {
    case "century":
        return getPreviousCenturyStart(
            date
        );
    case "decade":
        return getPreviousDecadeStart(
            date
        );
    case "year":
        return getPreviousYearStart(
            date
        );
    case "month":
        return getPreviousMonthStart(
            date
        );
    default:
        throw new Error(
            "Invalid rangeType: ".concat(
                rangeType
            )
        );
    }
}
function getBeginNext(
    rangeType, date
) {
    switch (rangeType) {
    case "century":
        return getNextCenturyStart(
            date
        );
    case "decade":
        return getNextDecadeStart(
            date
        );
    case "year":
        return getNextYearStart(
            date
        );
    case "month":
        return getNextMonthStart(
            date
        );
    default:
        throw new Error(
            "Invalid rangeType: ".concat(
                rangeType
            )
        );
    }
}
var getBeginPrevious2 = function (
        rangeType, date
    ) {
        switch (rangeType) {
        case "decade":
            return getPreviousDecadeStart(
                date,
                -100
            );
        case "year":
            return getPreviousYearStart(
                date,
                -10
            );
        case "month":
            return getPreviousMonthStart(
                date,
                -12
            );
        default:
            throw new Error(
                "Invalid rangeType: ".concat(
                    rangeType
                )
            );
        }
    },
    getBeginNext2 = function (
        rangeType, date
    ) {
        switch (rangeType) {
        case "decade":
            return getNextDecadeStart(
                date,
                100
            );
        case "year":
            return getNextYearStart(
                date,
                10
            );
        case "month":
            return getNextMonthStart(
                date,
                12
            );
        default:
            throw new Error(
                "Invalid rangeType: ".concat(
                    rangeType
                )
            );
        }
    };
function getEnd(
    rangeType, date
) {
    switch (rangeType) {
    case "century":
        return getCenturyEnd(
            date
        );
    case "decade":
        return getDecadeEnd(
            date
        );
    case "year":
        return getYearEnd(
            date
        );
    case "month":
        return getMonthEnd(
            date
        );
    case "day":
        return getDayEnd(
            date
        );
    default:
        throw new Error(
            "Invalid rangeType: ".concat(
                rangeType
            )
        );
    }
}
function getEndPrevious(
    rangeType, date
) {
    switch (rangeType) {
    case "century":
        return getPreviousCenturyEnd(
            date
        );
    case "decade":
        return getPreviousDecadeEnd(
            date
        );
    case "year":
        return getPreviousYearEnd(
            date
        );
    case "month":
        return getPreviousMonthEnd(
            date
        );
    default:
        throw new Error(
            "Invalid rangeType: ".concat(
                rangeType
            )
        );
    }
}
var getEndPrevious2 = function (
    rangeType, date
) {
    switch (rangeType) {
    case "decade":
        return getPreviousDecadeEnd(
            date,
            -100
        );
    case "year":
        return getPreviousYearEnd(
            date,
            -10
        );
    case "month":
        return getPreviousMonthEnd(
            date,
            -12
        );
    default:
        throw new Error(
            "Invalid rangeType: ".concat(
                rangeType
            )
        );
    }
};
function getRange(
    rangeType, date
) {
    switch (rangeType) {
    case "century":
        return getCenturyRange(
            date
        );
    case "decade":
        return getDecadeRange(
            date
        );
    case "year":
        return getYearRange(
            date
        );
    case "month":
        return getMonthRange(
            date
        );
    case "day":
        return getDayRange(
            date
        );
    default:
        throw new Error(
            "Invalid rangeType: ".concat(
                rangeType
            )
        );
    }
}
function getValueRange(
    rangeType, date1, date2
) {
    var rawNextValue = [date1, date2,].sort(
        function (
            a, b
        ) {
            return a - b;
        }
    );
    return [
        getBegin(
            rangeType,
            rawNextValue[0]
        ),
        getEnd(
            rangeType,
            rawNextValue[1]
        ),
    ];
}
function toYearLabel(
    locale
) {
    var formatYear$1 =
            arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : formatYear,
        dates = arguments.length > 2 ? arguments[2] : void 0;
    return dates
        .map(
            function (
                date
            ) {
                return formatYear$1(
                    locale,
                    date
                );
            }
        )
        .join(
            " – "
        );
}
function getCenturyLabel(
    locale, formatYear, date
) {
    return toYearLabel(
        locale,
        formatYear,
        getCenturyRange(
            date
        )
    );
}
function getDecadeLabel(
    locale, formatYear, date
) {
    return toYearLabel(
        locale,
        formatYear,
        getDecadeRange(
            date
        )
    );
}
function isWeekend(
    date
) {
    var calendarType =
            arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : CALENDAR_TYPES.ISO_8601,
        weekday = date.getDay(
        );
    switch (calendarType) {
    case CALENDAR_TYPES.ARABIC:
    case CALENDAR_TYPES.HEBREW:
        return weekday === FRIDAY || weekday === SATURDAY;
    case CALENDAR_TYPES.ISO_8601:
    case CALENDAR_TYPES.US:
        return weekday === SATURDAY || weekday === SUNDAY;
    default:
        throw new Error(
            "Unsupported calendar type."
        );
    }
}
function _typeof$2(
    obj
) {
    return (_typeof$2 =
        "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
            ? function (
                obj
            ) {
                return typeof obj;
            }
            : function (
                obj
            ) {
                return obj &&
                      "function" == typeof Symbol &&
                      obj.constructor === Symbol &&
                      obj !== Symbol.prototype
                    ? "symbol"
                    : typeof obj;
            })(
        obj
    );
}
var calendarTypes = Object.values(
        CALENDAR_TYPES
    ),
    allViews$1 = ["century", "decade", "year", "month",],
    isCalendarType = PropTypes.oneOf(
        calendarTypes
    ),
    isClassName = PropTypes.oneOfType(
        [
            PropTypes.string,
            PropTypes.arrayOf(
                PropTypes.string
            ),
        ]
    ),
    isMinDate = function (
        props, propName, componentName
    ) {
        var minDate = props[propName];
        if (!minDate) return null;
        if (!(minDate instanceof Date))
            return new Error(
                "Invalid prop `"
                    .concat(
                        propName,
                        "` of type `"
                    )
                    .concat(
                        _typeof$2(
                            minDate
                        ),
                        "` supplied to `"
                    )
                    .concat(
                        componentName,
                        "`, expected instance of `Date`."
                    )
            );
        var maxDate = props.maxDate;
        return maxDate && minDate > maxDate
            ? new Error(
                "Invalid prop `"
                    .concat(
                        propName,
                        "` of type `"
                    )
                    .concat(
                        _typeof$2(
                            minDate
                        ),
                        "` supplied to `"
                    )
                    .concat(
                        componentName,
                        "`, minDate cannot be larger than maxDate."
                    )
            )
            : null;
    },
    isMaxDate = function (
        props, propName, componentName
    ) {
        var maxDate = props[propName];
        if (!maxDate) return null;
        if (!(maxDate instanceof Date))
            return new Error(
                "Invalid prop `"
                    .concat(
                        propName,
                        "` of type `"
                    )
                    .concat(
                        _typeof$2(
                            maxDate
                        ),
                        "` supplied to `"
                    )
                    .concat(
                        componentName,
                        "`, expected instance of `Date`."
                    )
            );
        var minDate = props.minDate;
        return minDate && maxDate < minDate
            ? new Error(
                "Invalid prop `"
                    .concat(
                        propName,
                        "` of type `"
                    )
                    .concat(
                        _typeof$2(
                            maxDate
                        ),
                        "` supplied to `"
                    )
                    .concat(
                        componentName,
                        "`, maxDate cannot be smaller than minDate."
                    )
            )
            : null;
    },
    isRef = PropTypes.oneOfType(
        [
            PropTypes.func,
            PropTypes.shape(
                {
                    current: PropTypes.any,
                }
            ),
        ]
    ),
    isValue = PropTypes.oneOfType(
        [
            PropTypes.instanceOf(
                Date
            ),
            PropTypes.arrayOf(
                PropTypes.instanceOf(
                    Date
                )
            ),
        ]
    ),
    isViews = PropTypes.arrayOf(
        PropTypes.oneOf(
            allViews$1
        )
    ),
    isView = function (
        props, propName, componentName
    ) {
        var view = props[propName],
            allowedViews = props.views || allViews$1;
        return void 0 !== view && -1 === allowedViews.indexOf(
            view
        )
            ? new Error(
                "Invalid prop `"
                    .concat(
                        propName,
                        "` of value `"
                    )
                    .concat(
                        view,
                        "` supplied to `"
                    )
                    .concat(
                        componentName,
                        "`, expected one of ["
                    )
                    .concat(
                        allowedViews
                            .map(
                                function (
                                    a
                                ) {
                                    return '"'.concat(
                                        a,
                                        '"'
                                    );
                                }
                            )
                            .join(
                                ", "
                            ),
                        "]."
                    )
            )
            : null;
    };
isView.isRequired = function (
    props, propName, componentName
) {
    var view = props[propName];
    return view
        ? isView(
            props,
            propName,
            componentName
        )
        : new Error(
            "The prop `"
                .concat(
                    propName,
                    "` is marked as required in `"
                )
                .concat(
                    componentName,
                    "`, but its value is `"
                )
                .concat(
                    view,
                    "`."
                )
        );
};
var tileGroupProps = {
        activeStartDate: PropTypes.instanceOf(
            Date
        ).isRequired,
        hover: PropTypes.instanceOf(
            Date
        ),
        locale: PropTypes.string,
        maxDate: isMaxDate,
        minDate: isMinDate,
        onClick: PropTypes.func,
        onMouseOver: PropTypes.func,
        tileClassName: PropTypes.oneOfType(
            [PropTypes.func, isClassName,]
        ),
        tileContent: PropTypes.oneOfType(
            [PropTypes.func, PropTypes.node,]
        ),
        value: isValue,
        valueType: PropTypes.string,
    },
    tileProps = {
        activeStartDate: PropTypes.instanceOf(
            Date
        ).isRequired,
        classes: PropTypes.arrayOf(
            PropTypes.string
        ).isRequired,
        date: PropTypes.instanceOf(
            Date
        ).isRequired,
        locale: PropTypes.string,
        maxDate: isMaxDate,
        minDate: isMinDate,
        onClick: PropTypes.func,
        onMouseOver: PropTypes.func,
        style: PropTypes.objectOf(
            PropTypes.oneOfType(
                [PropTypes.string, PropTypes.number,]
            )
        ),
        tileClassName: PropTypes.oneOfType(
            [PropTypes.func, isClassName,]
        ),
        tileContent: PropTypes.oneOfType(
            [PropTypes.func, PropTypes.node,]
        ),
        tileDisabled: PropTypes.func,
    },
    className$5 = "react-calendar__navigation";
function Navigation(
    _ref
) {
    var labelClassName,
        activeStartDate = _ref.activeStartDate,
        drillUp = _ref.drillUp,
        _ref$formatMonthYear = _ref.formatMonthYear,
        formatMonthYear$1 =
            void 0 === _ref$formatMonthYear
                ? formatMonthYear
                : _ref$formatMonthYear,
        _ref$formatYear = _ref.formatYear,
        formatYear$1 =
            void 0 === _ref$formatYear ? formatYear : _ref$formatYear,
        locale = _ref.locale,
        maxDate = _ref.maxDate,
        minDate = _ref.minDate,
        _ref$navigationAriaLa = _ref.navigationAriaLabel,
        navigationAriaLabel =
            void 0 === _ref$navigationAriaLa ? "" : _ref$navigationAriaLa,
        navigationLabel = _ref.navigationLabel,
        _ref$next2AriaLabel = _ref.next2AriaLabel,
        next2AriaLabel =
            void 0 === _ref$next2AriaLabel ? "" : _ref$next2AriaLabel,
        _ref$next2Label = _ref.next2Label,
        next2Label = void 0 === _ref$next2Label ? "»" : _ref$next2Label,
        _ref$nextAriaLabel = _ref.nextAriaLabel,
        nextAriaLabel = void 0 === _ref$nextAriaLabel ? "" : _ref$nextAriaLabel,
        _ref$nextLabel = _ref.nextLabel,
        nextLabel = void 0 === _ref$nextLabel ? "›" : _ref$nextLabel,
        _ref$prev2AriaLabel = _ref.prev2AriaLabel,
        prev2AriaLabel =
            void 0 === _ref$prev2AriaLabel ? "" : _ref$prev2AriaLabel,
        _ref$prev2Label = _ref.prev2Label,
        prev2Label = void 0 === _ref$prev2Label ? "«" : _ref$prev2Label,
        _ref$prevAriaLabel = _ref.prevAriaLabel,
        prevAriaLabel = void 0 === _ref$prevAriaLabel ? "" : _ref$prevAriaLabel,
        _ref$prevLabel = _ref.prevLabel,
        prevLabel = void 0 === _ref$prevLabel ? "‹" : _ref$prevLabel,
        setActiveStartDate = _ref.setActiveStartDate,
        showDoubleView = _ref.showDoubleView,
        view = _ref.view,
        drillUpAvailable = _ref.views.indexOf(
            view
        ) > 0,
        shouldShowPrevNext2Buttons = "century" !== view,
        previousActiveStartDate = getBeginPrevious(
            view,
            activeStartDate
        ),
        previousActiveStartDate2 =
            shouldShowPrevNext2Buttons &&
            getBeginPrevious2(
                view,
                activeStartDate
            ),
        nextActiveStartDate = getBeginNext(
            view,
            activeStartDate
        ),
        nextActiveStartDate2 =
            shouldShowPrevNext2Buttons && getBeginNext2(
                view,
                activeStartDate
            ),
        prevButtonDisabled = (function (
        ) {
            if (previousActiveStartDate.getFullYear(
            ) < 0) return !0;
            var previousActiveEndDate = getEndPrevious(
                view,
                activeStartDate
            );
            return minDate && minDate >= previousActiveEndDate;
        })(
        ),
        prev2ButtonDisabled =
            shouldShowPrevNext2Buttons &&
            (function (
            ) {
                if (previousActiveStartDate2.getFullYear(
                ) < 0) return !0;
                var previousActiveEndDate = getEndPrevious2(
                    view,
                    activeStartDate
                );
                return minDate && minDate >= previousActiveEndDate;
            })(
            ),
        nextButtonDisabled = maxDate && maxDate <= nextActiveStartDate,
        next2ButtonDisabled =
            shouldShowPrevNext2Buttons &&
            maxDate &&
            maxDate <= nextActiveStartDate2;
    function renderLabel(
        date
    ) {
        var label = (function (
        ) {
            switch (view) {
            case "century":
                return getCenturyLabel(
                    locale,
                    formatYear$1,
                    date
                );
            case "decade":
                return getDecadeLabel(
                    locale,
                    formatYear$1,
                    date
                );
            case "year":
                return formatYear$1(
                    locale,
                    date
                );
            case "month":
                return formatMonthYear$1(
                    locale,
                    date
                );
            default:
                throw new Error(
                    "Invalid view: ".concat(
                        view,
                        "."
                    )
                );
            }
        })(
        );
        return navigationLabel
            ? navigationLabel(
                {
                    date: date,
                    label: label,
                    locale: locale || getUserLocale(
                    ),
                    view: view,
                }
            )
            : label;
    }
    return React.createElement(
        "div",
        {
            className: className$5,
            style: {
                display: "flex",
            },
        },
        null !== prev2Label &&
            shouldShowPrevNext2Buttons &&
            React.createElement(
                "button",
                {
                    "aria-label": prev2AriaLabel,
                    className: ""
                        .concat(
                            className$5,
                            "__arrow "
                        )
                        .concat(
                            className$5,
                            "__prev2-button"
                        ),
                    disabled: prev2ButtonDisabled,
                    onClick: function (
                    ) {
                        setActiveStartDate(
                            previousActiveStartDate2
                        );
                    },
                    type: "button",
                },
                prev2Label
            ),
        null !== prevLabel &&
            React.createElement(
                "button",
                {
                    "aria-label": prevAriaLabel,
                    className: ""
                        .concat(
                            className$5,
                            "__arrow "
                        )
                        .concat(
                            className$5,
                            "__prev-button"
                        ),
                    disabled: prevButtonDisabled,
                    onClick: function (
                    ) {
                        setActiveStartDate(
                            previousActiveStartDate
                        );
                    },
                    type: "button",
                },
                prevLabel
            ),
        ((labelClassName = "".concat(
            className$5,
            "__label"
        )),
        React.createElement(
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
            React.createElement(
                "span",
                {
                    className: ""
                        .concat(
                            labelClassName,
                            "__labelText "
                        )
                        .concat(
                            labelClassName,
                            "__labelText--from"
                        ),
                },
                renderLabel(
                    activeStartDate
                )
            ),
            showDoubleView &&
                React.createElement(
                    React.Fragment,
                    null,
                    React.createElement(
                        "span",
                        {
                            className: "".concat(
                                labelClassName,
                                "__divider"
                            ),
                        },
                        " ",
                        "–",
                        " "
                    ),
                    React.createElement(
                        "span",
                        {
                            className: ""
                                .concat(
                                    labelClassName,
                                    "__labelText "
                                )
                                .concat(
                                    labelClassName,
                                    "__labelText--to"
                                ),
                        },
                        renderLabel(
                            nextActiveStartDate
                        )
                    )
                )
        )),
        null !== nextLabel &&
            React.createElement(
                "button",
                {
                    "aria-label": nextAriaLabel,
                    className: ""
                        .concat(
                            className$5,
                            "__arrow "
                        )
                        .concat(
                            className$5,
                            "__next-button"
                        ),
                    disabled: nextButtonDisabled,
                    onClick: function (
                    ) {
                        setActiveStartDate(
                            nextActiveStartDate
                        );
                    },
                    type: "button",
                },
                nextLabel
            ),
        null !== next2Label &&
            shouldShowPrevNext2Buttons &&
            React.createElement(
                "button",
                {
                    "aria-label": next2AriaLabel,
                    className: ""
                        .concat(
                            className$5,
                            "__arrow "
                        )
                        .concat(
                            className$5,
                            "__next2-button"
                        ),
                    disabled: next2ButtonDisabled,
                    onClick: function (
                    ) {
                        setActiveStartDate(
                            nextActiveStartDate2
                        );
                    },
                    type: "button",
                },
                next2Label
            )
    );
}
function _extends$c(
) {
    return (_extends$c =
        Object.assign ||
        function (
            target
        ) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                for (var key in source)
                    Object.prototype.hasOwnProperty.call(
                        source,
                        key
                    ) &&
                        (target[key] = source[key]);
            }
            return target;
        }).apply(
        this,
        arguments
    );
}
function ownKeys$b(
    object, enumerableOnly
) {
    var keys = Object.keys(
        object
    );
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(
            object
        );
        enumerableOnly &&
            (symbols = symbols.filter(
                function (
                    sym
                ) {
                    return Object.getOwnPropertyDescriptor(
                        object,
                        sym
                    ).enumerable;
                }
            )),
        keys.push.apply(
            keys,
            symbols
        );
    }
    return keys;
}
function _objectSpread$b(
    target
) {
    for (var i = 1; i < arguments.length; i++) {
        var source = null != arguments[i]
            ? arguments[i]
            : {
            };
        i % 2
            ? ownKeys$b(
                Object(
                    source
                ),
                !0
            ).forEach(
                function (
                    key
                ) {
                    _defineProperty$b(
                        target,
                        key,
                        source[key]
                    );
                }
            )
            : Object.getOwnPropertyDescriptors
                ? Object.defineProperties(
                    target,
                    Object.getOwnPropertyDescriptors(
                        source
                    )
                )
                : ownKeys$b(
                    Object(
                        source
                    )
                ).forEach(
                    function (
                        key
                    ) {
                        Object.defineProperty(
                            target,
                            key,
                            Object.getOwnPropertyDescriptor(
                                source,
                                key
                            )
                        );
                    }
                );
    }
    return target;
}
function _defineProperty$b(
    obj, key, value
) {
    return (
        key in obj
            ? Object.defineProperty(
                obj,
                key,
                {
                    value: value,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                }
            )
            : (obj[key] = value),
        obj
    );
}
function _objectWithoutProperties$8(
    source, excluded
) {
    if (null == source) return {
    };
    var key,
        i,
        target = _objectWithoutPropertiesLoose$8(
            source,
            excluded
        );
    if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(
            source
        );
        for (i = 0; i < sourceSymbolKeys.length; i++)
            (key = sourceSymbolKeys[i]),
            excluded.indexOf(
                key
            ) >= 0 ||
                    (Object.prototype.propertyIsEnumerable.call(
                        source,
                        key
                    ) &&
                        (target[key] = source[key]));
    }
    return target;
}
function _objectWithoutPropertiesLoose$8(
    source, excluded
) {
    if (null == source) return {
    };
    var key,
        i,
        target = {
        },
        sourceKeys = Object.keys(
            source
        );
    for (i = 0; i < sourceKeys.length; i++)
        (key = sourceKeys[i]),
        excluded.indexOf(
            key
        ) >= 0 || (target[key] = source[key]);
    return target;
}
function toPercent(
    num
) {
    return "".concat(
        num,
        "%"
    );
}
function Flex(
    _ref
) {
    var children = _ref.children,
        className = _ref.className,
        direction = _ref.direction,
        count = _ref.count,
        offset = _ref.offset,
        style = _ref.style,
        wrap = _ref.wrap,
        otherProps = _objectWithoutProperties$8(
            _ref,
            [
                "children",
                "className",
                "direction",
                "count",
                "offset",
                "style",
                "wrap",
            ]
        );
    return React.createElement(
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
        React.Children.map(
            children,
            function (
                child, index
            ) {
                return React.cloneElement(
                    child,
                    _objectSpread$b(
                        _objectSpread$b(
                            {
                            },
                            child.props
                        ),
                        {
                        },
                        {
                            style: {
                                flexBasis: toPercent(
                                    100 / count
                                ),
                                maxWidth: toPercent(
                                    100 / count
                                ),
                                overflow: "hidden",
                                marginLeft:
                                offset && 0 === index
                                    ? toPercent(
                                        (100 * offset) / count
                                    )
                                    : null,
                            },
                        }
                    )
                );
            }
        )
    );
}
function _toConsumableArray$1(
    arr
) {
    return (
        _arrayWithoutHoles$1(
            arr
        ) ||
        _iterableToArray$1(
            arr
        ) ||
        _unsupportedIterableToArray$1(
            arr
        ) ||
        _nonIterableSpread$1(
        )
    );
}
function _nonIterableSpread$1(
) {
    throw new TypeError(
        "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
    );
}
function _unsupportedIterableToArray$1(
    o, minLen
) {
    if (o) {
        if ("string" == typeof o) return _arrayLikeToArray$1(
            o,
            minLen
        );
        var n = Object.prototype.toString.call(
            o
        ).slice(
            8,
            -1
        );
        return (
            "Object" === n && o.constructor && (n = o.constructor.name),
            "Map" === n || "Set" === n
                ? Array.from(
                    o
                )
                : "Arguments" === n ||
                  /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(
                      n
                  )
                    ? _arrayLikeToArray$1(
                        o,
                        minLen
                    )
                    : void 0
        );
    }
}
function _iterableToArray$1(
    iter
) {
    if ("undefined" != typeof Symbol && Symbol.iterator in Object(
        iter
    ))
        return Array.from(
            iter
        );
}
function _arrayWithoutHoles$1(
    arr
) {
    if (Array.isArray(
        arr
    )) return _arrayLikeToArray$1(
        arr
    );
}
function _arrayLikeToArray$1(
    arr, len
) {
    (null == len || len > arr.length) && (len = arr.length);
    for (var i = 0, arr2 = new Array(
        len
    ); i < len; i++) arr2[i] = arr[i];
    return arr2;
}
function between(
    value, min, max
) {
    return min && min > value ? min : max && max < value ? max : value;
}
function isValueWithinRange(
    value, range
) {
    return range[0] <= value && range[1] >= value;
}
function isRangeWithinRange(
    greaterRange, smallerRange
) {
    return (
        greaterRange[0] <= smallerRange[0] && greaterRange[1] >= smallerRange[1]
    );
}
function doRangesOverlap(
    range1, range2
) {
    return (
        isValueWithinRange(
            range1[0],
            range2
        ) ||
        isValueWithinRange(
            range1[1],
            range2
        )
    );
}
function getRangeClassNames(
    valueRange, dateRange, baseClassName
) {
    var classes = [];
    if (doRangesOverlap(
        dateRange,
        valueRange
    )) {
        classes.push(
            baseClassName
        );
        var isRangeStart = isValueWithinRange(
                valueRange[0],
                dateRange
            ),
            isRangeEnd = isValueWithinRange(
                valueRange[1],
                dateRange
            );
        isRangeStart && classes.push(
            "".concat(
                baseClassName,
                "Start"
            )
        ),
        isRangeEnd && classes.push(
            "".concat(
                baseClassName,
                "End"
            )
        ),
        isRangeStart &&
                isRangeEnd &&
                classes.push(
                    "".concat(
                        baseClassName,
                        "BothEnds"
                    )
                );
    }
    return classes;
}
function getTileClasses(
) {
    var _ref =
            arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : {
                },
        value = _ref.value,
        valueType = _ref.valueType,
        date = _ref.date,
        dateType = _ref.dateType,
        hover = _ref.hover,
        className = "react-calendar__tile",
        classes = [className,];
    if (!date) return classes;
    if (!Array.isArray(
        date
    ) && !dateType)
        throw new Error(
            "getTileClasses(): Unable to get tile activity classes because one or more required arguments were not passed."
        );
    var now = new Date(
        ),
        dateRange = Array.isArray(
            date
        )
            ? date
            : getRange(
                dateType,
                date
            );
    if (
        (isValueWithinRange(
            now,
            dateRange
        ) &&
            classes.push(
                "".concat(
                    className,
                    "--now"
                )
            ),
        !value)
    )
        return classes;
    if (!Array.isArray(
        value
    ) && !valueType)
        throw new Error(
            "getTileClasses(): Unable to get tile activity classes because one or more required arguments were not passed."
        );
    var valueRange = Array.isArray(
        value
    )
        ? value
        : getRange(
            valueType,
            value
        );
    isRangeWithinRange(
        valueRange,
        dateRange
    )
        ? classes.push(
            "".concat(
                className,
                "--active"
            )
        )
        : doRangesOverlap(
            valueRange,
            dateRange
        ) &&
          classes.push(
              "".concat(
                  className,
                  "--hasActive"
              )
          );
    var valueRangeClassNames = getRangeClassNames(
        valueRange,
        dateRange,
        "".concat(
            className,
            "--range"
        )
    );
    if (
        (classes.push.apply(
            classes,
            _toConsumableArray$1(
                valueRangeClassNames
            )
        ),
        hover)
    ) {
        var hoverRange =
                hover > valueRange[1]
                    ? [valueRange[1], hover,]
                    : [hover, valueRange[0],],
            hoverRangeClassNames = getRangeClassNames(
                hoverRange,
                dateRange,
                "".concat(
                    className,
                    "--hover"
                )
            );
        classes.push.apply(
            classes,
            _toConsumableArray$1(
                hoverRangeClassNames
            )
        );
    }
    return classes;
}
function ownKeys$a(
    object, enumerableOnly
) {
    var keys = Object.keys(
        object
    );
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(
            object
        );
        enumerableOnly &&
            (symbols = symbols.filter(
                function (
                    sym
                ) {
                    return Object.getOwnPropertyDescriptor(
                        object,
                        sym
                    ).enumerable;
                }
            )),
        keys.push.apply(
            keys,
            symbols
        );
    }
    return keys;
}
function _objectSpread$a(
    target
) {
    for (var i = 1; i < arguments.length; i++) {
        var source = null != arguments[i]
            ? arguments[i]
            : {
            };
        i % 2
            ? ownKeys$a(
                Object(
                    source
                ),
                !0
            ).forEach(
                function (
                    key
                ) {
                    _defineProperty$a(
                        target,
                        key,
                        source[key]
                    );
                }
            )
            : Object.getOwnPropertyDescriptors
                ? Object.defineProperties(
                    target,
                    Object.getOwnPropertyDescriptors(
                        source
                    )
                )
                : ownKeys$a(
                    Object(
                        source
                    )
                ).forEach(
                    function (
                        key
                    ) {
                        Object.defineProperty(
                            target,
                            key,
                            Object.getOwnPropertyDescriptor(
                                source,
                                key
                            )
                        );
                    }
                );
    }
    return target;
}
function _defineProperty$a(
    obj, key, value
) {
    return (
        key in obj
            ? Object.defineProperty(
                obj,
                key,
                {
                    value: value,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                }
            )
            : (obj[key] = value),
        obj
    );
}
function _extends$b(
) {
    return (_extends$b =
        Object.assign ||
        function (
            target
        ) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                for (var key in source)
                    Object.prototype.hasOwnProperty.call(
                        source,
                        key
                    ) &&
                        (target[key] = source[key]);
            }
            return target;
        }).apply(
        this,
        arguments
    );
}
function _objectWithoutProperties$7(
    source, excluded
) {
    if (null == source) return {
    };
    var key,
        i,
        target = _objectWithoutPropertiesLoose$7(
            source,
            excluded
        );
    if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(
            source
        );
        for (i = 0; i < sourceSymbolKeys.length; i++)
            (key = sourceSymbolKeys[i]),
            excluded.indexOf(
                key
            ) >= 0 ||
                    (Object.prototype.propertyIsEnumerable.call(
                        source,
                        key
                    ) &&
                        (target[key] = source[key]));
    }
    return target;
}
function _objectWithoutPropertiesLoose$7(
    source, excluded
) {
    if (null == source) return {
    };
    var key,
        i,
        target = {
        },
        sourceKeys = Object.keys(
            source
        );
    for (i = 0; i < sourceKeys.length; i++)
        (key = sourceKeys[i]),
        excluded.indexOf(
            key
        ) >= 0 || (target[key] = source[key]);
    return target;
}
function TileGroup(
    _ref
) {
    for (
        var className = _ref.className,
            _ref$count = _ref.count,
            count = void 0 === _ref$count ? 3 : _ref$count,
            dateTransform = _ref.dateTransform,
            dateType = _ref.dateType,
            end = _ref.end,
            hover = _ref.hover,
            offset = _ref.offset,
            start = _ref.start,
            _ref$step = _ref.step,
            step = void 0 === _ref$step ? 1 : _ref$step,
            Tile = _ref.tile,
            value = _ref.value,
            valueType = _ref.valueType,
            tileProps = _objectWithoutProperties$7(
                _ref,
                [
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
                ]
            ),
            tiles = [],
            point = start;
        point <= end;
        point += step
    ) {
        var date = dateTransform(
            point
        );
        tiles.push(
            React.createElement(
                Tile,
                _extends$b(
                    {
                        key: date.getTime(
                        ),
                        classes: getTileClasses(
                            {
                                value: value,
                                valueType: valueType,
                                date: date,
                                dateType: dateType,
                                hover: hover,
                            }
                        ),
                        date: date,
                        point: point,
                    },
                    tileProps
                )
            )
        );
    }
    return React.createElement(
        Flex,
        {
            className: className,
            count: count,
            offset: offset,
            wrap: !0,
        },
        tiles
    );
}
function ownKeys$9(
    object, enumerableOnly
) {
    var keys = Object.keys(
        object
    );
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(
            object
        );
        enumerableOnly &&
            (symbols = symbols.filter(
                function (
                    sym
                ) {
                    return Object.getOwnPropertyDescriptor(
                        object,
                        sym
                    ).enumerable;
                }
            )),
        keys.push.apply(
            keys,
            symbols
        );
    }
    return keys;
}
function _objectSpread$9(
    target
) {
    for (var i = 1; i < arguments.length; i++) {
        var source = null != arguments[i]
            ? arguments[i]
            : {
            };
        i % 2
            ? ownKeys$9(
                Object(
                    source
                ),
                !0
            ).forEach(
                function (
                    key
                ) {
                    _defineProperty$9(
                        target,
                        key,
                        source[key]
                    );
                }
            )
            : Object.getOwnPropertyDescriptors
                ? Object.defineProperties(
                    target,
                    Object.getOwnPropertyDescriptors(
                        source
                    )
                )
                : ownKeys$9(
                    Object(
                        source
                    )
                ).forEach(
                    function (
                        key
                    ) {
                        Object.defineProperty(
                            target,
                            key,
                            Object.getOwnPropertyDescriptor(
                                source,
                                key
                            )
                        );
                    }
                );
    }
    return target;
}
function _typeof$1(
    obj
) {
    return (_typeof$1 =
        "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
            ? function (
                obj
            ) {
                return typeof obj;
            }
            : function (
                obj
            ) {
                return obj &&
                      "function" == typeof Symbol &&
                      obj.constructor === Symbol &&
                      obj !== Symbol.prototype
                    ? "symbol"
                    : typeof obj;
            })(
        obj
    );
}
function _classCallCheck$1(
    instance, Constructor
) {
    if (!(instance instanceof Constructor))
        throw new TypeError(
            "Cannot call a class as a function"
        );
}
function _defineProperties$1(
    target, props
) {
    for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        (descriptor.enumerable = descriptor.enumerable || !1),
        (descriptor.configurable = !0),
        "value" in descriptor && (descriptor.writable = !0),
        Object.defineProperty(
            target,
            descriptor.key,
            descriptor
        );
    }
}
function _createClass$1(
    Constructor, protoProps, staticProps
) {
    return (
        protoProps && _defineProperties$1(
            Constructor.prototype,
            protoProps
        ),
        staticProps && _defineProperties$1(
            Constructor,
            staticProps
        ),
        Constructor
    );
}
function _inherits$1(
    subClass, superClass
) {
    if ("function" != typeof superClass && null !== superClass)
        throw new TypeError(
            "Super expression must either be null or a function"
        );
    (subClass.prototype = Object.create(
        superClass && superClass.prototype,
        {
            constructor: {
                value: subClass,
                writable: !0,
                configurable: !0,
            },
        }
    )),
    superClass && _setPrototypeOf$1(
        subClass,
        superClass
    );
}
function _setPrototypeOf$1(
    o, p
) {
    return (_setPrototypeOf$1 =
        Object.setPrototypeOf ||
        function (
            o, p
        ) {
            return (o.__proto__ = p), o;
        })(
        o,
        p
    );
}
function _createSuper$1(
    Derived
) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct$1(
    );
    return function (
    ) {
        var result,
            Super = _getPrototypeOf$1(
                Derived
            );
        if (hasNativeReflectConstruct) {
            var NewTarget = _getPrototypeOf$1(
                this
            ).constructor;
            result = Reflect.construct(
                Super,
                arguments,
                NewTarget
            );
        } else result = Super.apply(
            this,
            arguments
        );
        return _possibleConstructorReturn$1(
            this,
            result
        );
    };
}
function _possibleConstructorReturn$1(
    self, call
) {
    return !call || ("object" !== _typeof$1(
        call
    ) && "function" != typeof call)
        ? _assertThisInitialized$1(
            self
        )
        : call;
}
function _assertThisInitialized$1(
    self
) {
    if (void 0 === self)
        throw new ReferenceError(
            "this hasn't been initialised - super() hasn't been called"
        );
    return self;
}
function _isNativeReflectConstruct$1(
) {
    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
    if (Reflect.construct.sham) return !1;
    if ("function" == typeof Proxy) return !0;
    try {
        return (
            Date.prototype.toString.call(
                Reflect.construct(
                    Date,
                    [],
                    function (
                    ) {}
                )
            ),
            !0
        );
    } catch (e) {
        return !1;
    }
}
function _getPrototypeOf$1(
    o
) {
    return (_getPrototypeOf$1 = Object.setPrototypeOf
        ? Object.getPrototypeOf
        : function (
            o
        ) {
            return o.__proto__ || Object.getPrototypeOf(
                o
            );
        })(
        o
    );
}
function _defineProperty$9(
    obj, key, value
) {
    return (
        key in obj
            ? Object.defineProperty(
                obj,
                key,
                {
                    value: value,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                }
            )
            : (obj[key] = value),
        obj
    );
}
function getValue$1(
    nextProps, prop
) {
    var activeStartDate = nextProps.activeStartDate,
        date = nextProps.date,
        view = nextProps.view;
    return "function" == typeof prop
        ? prop(
            {
                activeStartDate: activeStartDate,
                date: date,
                view: view,
            }
        )
        : prop;
}
(Navigation.propTypes = {
    activeStartDate: PropTypes.instanceOf(
        Date
    ).isRequired,
    drillUp: PropTypes.func.isRequired,
    formatMonthYear: PropTypes.func,
    formatYear: PropTypes.func,
    locale: PropTypes.string,
    maxDate: PropTypes.instanceOf(
        Date
    ),
    minDate: PropTypes.instanceOf(
        Date
    ),
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
}),
(Flex.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    count: PropTypes.number.isRequired,
    direction: PropTypes.string,
    offset: PropTypes.number,
    style: PropTypes.objectOf(
        PropTypes.oneOfType(
            [PropTypes.string, PropTypes.number,]
        )
    ),
    wrap: PropTypes.bool,
}),
(TileGroup.propTypes = _objectSpread$a(
    _objectSpread$a(
        {
        },
        tileGroupProps
    ),
    {
    },
    {
        activeStartDate: PropTypes.instanceOf(
            Date
        ),
        count: PropTypes.number,
        dateTransform: PropTypes.func.isRequired,
        dateType: PropTypes.string,
        offset: PropTypes.number,
        step: PropTypes.number,
        tile: PropTypes.func.isRequired,
    }
));
var Tile = (function (
    _Component
) {
    _inherits$1(
        Tile,
        _
    );
    var _super = _createSuper$1(
        Tile
    );
    function Tile(
    ) {
        var _this;
        _classCallCheck$1(
            this,
            Tile
        );
        for (
            var _len = arguments.length, args = new Array(
                    _len
                ), _key = 0;
            _key < _len;
            _key++
        )
            args[_key] = arguments[_key];
        return (
            _defineProperty$9(
                _assertThisInitialized$1(
                    (_this = _super.call.apply(
                        _super,
                        [this,].concat(
                            args
                        )
                    ))
                ),
                "state",
                {
                }
            ),
            _this
        );
    }
    return (
        _createClass$1(
            Tile,
            [
                {
                    key: "render",
                    value: function (
                    ) {
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
                            view = _this$props.view,
                            _this$state = this.state,
                            tileClassName = _this$state.tileClassName,
                            tileContent = _this$state.tileContent;
                        return React.createElement(
                            "button",
                            {
                                className: mergeClassNames(
                                    classes,
                                    tileClassName
                                ),
                                disabled:
                                    (minDate &&
                                        minDateTransform(
                                            minDate
                                        ) > date) ||
                                    (maxDate &&
                                        maxDateTransform(
                                            maxDate
                                        ) < date) ||
                                    (tileDisabled &&
                                        tileDisabled(
                                            {
                                                activeStartDate: activeStartDate,
                                                date: date,
                                                view: view,
                                            }
                                        )),
                                onClick:
                                    onClick &&
                                    function (
                                        event
                                    ) {
                                        return onClick(
                                            date,
                                            event
                                        );
                                    },
                                onFocus:
                                    onMouseOver &&
                                    function (
                                    ) {
                                        return onMouseOver(
                                            date
                                        );
                                    },
                                onMouseOver:
                                    onMouseOver &&
                                    function (
                                    ) {
                                        return onMouseOver(
                                            date
                                        );
                                    },
                                style: style,
                                type: "button",
                            },
                            formatAbbr
                                ? React.createElement(
                                    "abbr",
                                    {
                                        "aria-label": formatAbbr(
                                            locale,
                                            date
                                        ),
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
                    value: function (
                        nextProps, prevState
                    ) {
                        var tileClassName = nextProps.tileClassName,
                            tileContent = nextProps.tileContent,
                            nextState = {
                            };
                        return (
                            tileClassName !== prevState.tileClassNameProps &&
                                ((nextState.tileClassName = getValue$1(
                                    nextProps,
                                    tileClassName
                                )),
                                (nextState.tileClassNameProps = tileClassName)),
                            tileContent !== prevState.tileContentProps &&
                                ((nextState.tileContent = getValue$1(
                                    nextProps,
                                    tileContent
                                )),
                                (nextState.tileContentProps = tileContent)),
                            nextState
                        );
                    },
                },
            ]
        ),
        Tile
    );
})(
);
function ownKeys$8(
    object, enumerableOnly
) {
    var keys = Object.keys(
        object
    );
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(
            object
        );
        enumerableOnly &&
            (symbols = symbols.filter(
                function (
                    sym
                ) {
                    return Object.getOwnPropertyDescriptor(
                        object,
                        sym
                    ).enumerable;
                }
            )),
        keys.push.apply(
            keys,
            symbols
        );
    }
    return keys;
}
function _objectSpread$8(
    target
) {
    for (var i = 1; i < arguments.length; i++) {
        var source = null != arguments[i]
            ? arguments[i]
            : {
            };
        i % 2
            ? ownKeys$8(
                Object(
                    source
                ),
                !0
            ).forEach(
                function (
                    key
                ) {
                    _defineProperty$8(
                        target,
                        key,
                        source[key]
                    );
                }
            )
            : Object.getOwnPropertyDescriptors
                ? Object.defineProperties(
                    target,
                    Object.getOwnPropertyDescriptors(
                        source
                    )
                )
                : ownKeys$8(
                    Object(
                        source
                    )
                ).forEach(
                    function (
                        key
                    ) {
                        Object.defineProperty(
                            target,
                            key,
                            Object.getOwnPropertyDescriptor(
                                source,
                                key
                            )
                        );
                    }
                );
    }
    return target;
}
function _defineProperty$8(
    obj, key, value
) {
    return (
        key in obj
            ? Object.defineProperty(
                obj,
                key,
                {
                    value: value,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                }
            )
            : (obj[key] = value),
        obj
    );
}
function _extends$a(
) {
    return (_extends$a =
        Object.assign ||
        function (
            target
        ) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                for (var key in source)
                    Object.prototype.hasOwnProperty.call(
                        source,
                        key
                    ) &&
                        (target[key] = source[key]);
            }
            return target;
        }).apply(
        this,
        arguments
    );
}
function _objectWithoutProperties$6(
    source, excluded
) {
    if (null == source) return {
    };
    var key,
        i,
        target = _objectWithoutPropertiesLoose$6(
            source,
            excluded
        );
    if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(
            source
        );
        for (i = 0; i < sourceSymbolKeys.length; i++)
            (key = sourceSymbolKeys[i]),
            excluded.indexOf(
                key
            ) >= 0 ||
                    (Object.prototype.propertyIsEnumerable.call(
                        source,
                        key
                    ) &&
                        (target[key] = source[key]));
    }
    return target;
}
function _objectWithoutPropertiesLoose$6(
    source, excluded
) {
    if (null == source) return {
    };
    var key,
        i,
        target = {
        },
        sourceKeys = Object.keys(
            source
        );
    for (i = 0; i < sourceKeys.length; i++)
        (key = sourceKeys[i]),
        excluded.indexOf(
            key
        ) >= 0 || (target[key] = source[key]);
    return target;
}
Tile.propTypes = _objectSpread$9(
    _objectSpread$9(
        {
        },
        tileProps
    ),
    {
    },
    {
        children: PropTypes.node.isRequired,
        formatAbbr: PropTypes.func,
        maxDateTransform: PropTypes.func.isRequired,
        minDateTransform: PropTypes.func.isRequired,
    }
);
var className$4 = "react-calendar__century-view__decades__decade";
function Decade(
    _ref
) {
    var classes = _ref.classes,
        _ref$formatYear = _ref.formatYear,
        formatYear$1 =
            void 0 === _ref$formatYear ? formatYear : _ref$formatYear,
        otherProps = _objectWithoutProperties$6(
            _ref,
            [
                "classes",
                "formatYear",
            ]
        ),
        date = otherProps.date,
        locale = otherProps.locale;
    return React.createElement(
        Tile,
        _extends$a(
            {
            },
            otherProps,
            {
                classes: [].concat(
                    classes,
                    className$4
                ),
                maxDateTransform: getDecadeEnd,
                minDateTransform: getDecadeStart,
                view: "century",
            }
        ),
        getDecadeLabel(
            locale,
            formatYear$1,
            date
        )
    );
}
function ownKeys$7(
    object, enumerableOnly
) {
    var keys = Object.keys(
        object
    );
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(
            object
        );
        enumerableOnly &&
            (symbols = symbols.filter(
                function (
                    sym
                ) {
                    return Object.getOwnPropertyDescriptor(
                        object,
                        sym
                    ).enumerable;
                }
            )),
        keys.push.apply(
            keys,
            symbols
        );
    }
    return keys;
}
function _objectSpread$7(
    target
) {
    for (var i = 1; i < arguments.length; i++) {
        var source = null != arguments[i]
            ? arguments[i]
            : {
            };
        i % 2
            ? ownKeys$7(
                Object(
                    source
                ),
                !0
            ).forEach(
                function (
                    key
                ) {
                    _defineProperty$7(
                        target,
                        key,
                        source[key]
                    );
                }
            )
            : Object.getOwnPropertyDescriptors
                ? Object.defineProperties(
                    target,
                    Object.getOwnPropertyDescriptors(
                        source
                    )
                )
                : ownKeys$7(
                    Object(
                        source
                    )
                ).forEach(
                    function (
                        key
                    ) {
                        Object.defineProperty(
                            target,
                            key,
                            Object.getOwnPropertyDescriptor(
                                source,
                                key
                            )
                        );
                    }
                );
    }
    return target;
}
function _defineProperty$7(
    obj, key, value
) {
    return (
        key in obj
            ? Object.defineProperty(
                obj,
                key,
                {
                    value: value,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                }
            )
            : (obj[key] = value),
        obj
    );
}
function _extends$9(
) {
    return (_extends$9 =
        Object.assign ||
        function (
            target
        ) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                for (var key in source)
                    Object.prototype.hasOwnProperty.call(
                        source,
                        key
                    ) &&
                        (target[key] = source[key]);
            }
            return target;
        }).apply(
        this,
        arguments
    );
}
function Decades(
    props
) {
    var start = getBeginOfCenturyYear(
            props.activeStartDate
        ),
        end = start + 99;
    return React.createElement(
        TileGroup,
        _extends$9(
            {
            },
            props,
            {
                className: "react-calendar__century-view__decades",
                dateTransform: getDecadeStart,
                dateType: "decade",
                end: end,
                start: start,
                step: 10,
                tile: Decade,
            }
        )
    );
}
function CenturyView(
    props
) {
    return React.createElement(
        "div",
        {
            className: "react-calendar__century-view",
        },
        React.createElement(
            Decades,
            props
        )
    );
}
function ownKeys$6(
    object, enumerableOnly
) {
    var keys = Object.keys(
        object
    );
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(
            object
        );
        enumerableOnly &&
            (symbols = symbols.filter(
                function (
                    sym
                ) {
                    return Object.getOwnPropertyDescriptor(
                        object,
                        sym
                    ).enumerable;
                }
            )),
        keys.push.apply(
            keys,
            symbols
        );
    }
    return keys;
}
function _objectSpread$6(
    target
) {
    for (var i = 1; i < arguments.length; i++) {
        var source = null != arguments[i]
            ? arguments[i]
            : {
            };
        i % 2
            ? ownKeys$6(
                Object(
                    source
                ),
                !0
            ).forEach(
                function (
                    key
                ) {
                    _defineProperty$6(
                        target,
                        key,
                        source[key]
                    );
                }
            )
            : Object.getOwnPropertyDescriptors
                ? Object.defineProperties(
                    target,
                    Object.getOwnPropertyDescriptors(
                        source
                    )
                )
                : ownKeys$6(
                    Object(
                        source
                    )
                ).forEach(
                    function (
                        key
                    ) {
                        Object.defineProperty(
                            target,
                            key,
                            Object.getOwnPropertyDescriptor(
                                source,
                                key
                            )
                        );
                    }
                );
    }
    return target;
}
function _defineProperty$6(
    obj, key, value
) {
    return (
        key in obj
            ? Object.defineProperty(
                obj,
                key,
                {
                    value: value,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                }
            )
            : (obj[key] = value),
        obj
    );
}
function _extends$8(
) {
    return (_extends$8 =
        Object.assign ||
        function (
            target
        ) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                for (var key in source)
                    Object.prototype.hasOwnProperty.call(
                        source,
                        key
                    ) &&
                        (target[key] = source[key]);
            }
            return target;
        }).apply(
        this,
        arguments
    );
}
function _objectWithoutProperties$5(
    source, excluded
) {
    if (null == source) return {
    };
    var key,
        i,
        target = _objectWithoutPropertiesLoose$5(
            source,
            excluded
        );
    if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(
            source
        );
        for (i = 0; i < sourceSymbolKeys.length; i++)
            (key = sourceSymbolKeys[i]),
            excluded.indexOf(
                key
            ) >= 0 ||
                    (Object.prototype.propertyIsEnumerable.call(
                        source,
                        key
                    ) &&
                        (target[key] = source[key]));
    }
    return target;
}
function _objectWithoutPropertiesLoose$5(
    source, excluded
) {
    if (null == source) return {
    };
    var key,
        i,
        target = {
        },
        sourceKeys = Object.keys(
            source
        );
    for (i = 0; i < sourceKeys.length; i++)
        (key = sourceKeys[i]),
        excluded.indexOf(
            key
        ) >= 0 || (target[key] = source[key]);
    return target;
}
(Decade.propTypes = _objectSpread$8(
    _objectSpread$8(
        {
        },
        tileProps
    ),
    {
    },
    {
        formatYear: PropTypes.func,
    }
)),
(Decades.propTypes = _objectSpread$7(
    {
    },
    tileGroupProps
));
var className$3 = "react-calendar__decade-view__years__year";
function Year(
    _ref
) {
    var classes = _ref.classes,
        _ref$formatYear = _ref.formatYear,
        formatYear$1 =
            void 0 === _ref$formatYear ? formatYear : _ref$formatYear,
        otherProps = _objectWithoutProperties$5(
            _ref,
            [
                "classes",
                "formatYear",
            ]
        ),
        date = otherProps.date,
        locale = otherProps.locale;
    return React.createElement(
        Tile,
        _extends$8(
            {
            },
            otherProps,
            {
                classes: [].concat(
                    classes,
                    className$3
                ),
                maxDateTransform: getYearEnd,
                minDateTransform: getYearStart,
                view: "decade",
            }
        ),
        formatYear$1(
            locale,
            date
        )
    );
}
function ownKeys$5(
    object, enumerableOnly
) {
    var keys = Object.keys(
        object
    );
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(
            object
        );
        enumerableOnly &&
            (symbols = symbols.filter(
                function (
                    sym
                ) {
                    return Object.getOwnPropertyDescriptor(
                        object,
                        sym
                    ).enumerable;
                }
            )),
        keys.push.apply(
            keys,
            symbols
        );
    }
    return keys;
}
function _objectSpread$5(
    target
) {
    for (var i = 1; i < arguments.length; i++) {
        var source = null != arguments[i]
            ? arguments[i]
            : {
            };
        i % 2
            ? ownKeys$5(
                Object(
                    source
                ),
                !0
            ).forEach(
                function (
                    key
                ) {
                    _defineProperty$5(
                        target,
                        key,
                        source[key]
                    );
                }
            )
            : Object.getOwnPropertyDescriptors
                ? Object.defineProperties(
                    target,
                    Object.getOwnPropertyDescriptors(
                        source
                    )
                )
                : ownKeys$5(
                    Object(
                        source
                    )
                ).forEach(
                    function (
                        key
                    ) {
                        Object.defineProperty(
                            target,
                            key,
                            Object.getOwnPropertyDescriptor(
                                source,
                                key
                            )
                        );
                    }
                );
    }
    return target;
}
function _defineProperty$5(
    obj, key, value
) {
    return (
        key in obj
            ? Object.defineProperty(
                obj,
                key,
                {
                    value: value,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                }
            )
            : (obj[key] = value),
        obj
    );
}
function _extends$7(
) {
    return (_extends$7 =
        Object.assign ||
        function (
            target
        ) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                for (var key in source)
                    Object.prototype.hasOwnProperty.call(
                        source,
                        key
                    ) &&
                        (target[key] = source[key]);
            }
            return target;
        }).apply(
        this,
        arguments
    );
}
function Years(
    props
) {
    var start = getBeginOfDecadeYear(
            props.activeStartDate
        ),
        end = start + 9;
    return React.createElement(
        TileGroup,
        _extends$7(
            {
            },
            props,
            {
                className: "react-calendar__decade-view__years",
                dateTransform: function (
                    year
                ) {
                    var date = new Date(
                    );
                    return (
                        date.setFullYear(
                            year,
                            0,
                            1
                        ),
                        date.setHours(
                            0,
                            0,
                            0,
                            0
                        ),
                        date
                    );
                },
                dateType: "year",
                end: end,
                start: start,
                tile: Year,
            }
        )
    );
}
function DecadeView(
    props
) {
    return React.createElement(
        "div",
        {
            className: "react-calendar__decade-view",
        },
        React.createElement(
            Years,
            props
        )
    );
}
function ownKeys$4(
    object, enumerableOnly
) {
    var keys = Object.keys(
        object
    );
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(
            object
        );
        enumerableOnly &&
            (symbols = symbols.filter(
                function (
                    sym
                ) {
                    return Object.getOwnPropertyDescriptor(
                        object,
                        sym
                    ).enumerable;
                }
            )),
        keys.push.apply(
            keys,
            symbols
        );
    }
    return keys;
}
function _objectSpread$4(
    target
) {
    for (var i = 1; i < arguments.length; i++) {
        var source = null != arguments[i]
            ? arguments[i]
            : {
            };
        i % 2
            ? ownKeys$4(
                Object(
                    source
                ),
                !0
            ).forEach(
                function (
                    key
                ) {
                    _defineProperty$4(
                        target,
                        key,
                        source[key]
                    );
                }
            )
            : Object.getOwnPropertyDescriptors
                ? Object.defineProperties(
                    target,
                    Object.getOwnPropertyDescriptors(
                        source
                    )
                )
                : ownKeys$4(
                    Object(
                        source
                    )
                ).forEach(
                    function (
                        key
                    ) {
                        Object.defineProperty(
                            target,
                            key,
                            Object.getOwnPropertyDescriptor(
                                source,
                                key
                            )
                        );
                    }
                );
    }
    return target;
}
function _defineProperty$4(
    obj, key, value
) {
    return (
        key in obj
            ? Object.defineProperty(
                obj,
                key,
                {
                    value: value,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                }
            )
            : (obj[key] = value),
        obj
    );
}
function _extends$6(
) {
    return (_extends$6 =
        Object.assign ||
        function (
            target
        ) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                for (var key in source)
                    Object.prototype.hasOwnProperty.call(
                        source,
                        key
                    ) &&
                        (target[key] = source[key]);
            }
            return target;
        }).apply(
        this,
        arguments
    );
}
function _objectWithoutProperties$4(
    source, excluded
) {
    if (null == source) return {
    };
    var key,
        i,
        target = _objectWithoutPropertiesLoose$4(
            source,
            excluded
        );
    if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(
            source
        );
        for (i = 0; i < sourceSymbolKeys.length; i++)
            (key = sourceSymbolKeys[i]),
            excluded.indexOf(
                key
            ) >= 0 ||
                    (Object.prototype.propertyIsEnumerable.call(
                        source,
                        key
                    ) &&
                        (target[key] = source[key]));
    }
    return target;
}
function _objectWithoutPropertiesLoose$4(
    source, excluded
) {
    if (null == source) return {
    };
    var key,
        i,
        target = {
        },
        sourceKeys = Object.keys(
            source
        );
    for (i = 0; i < sourceKeys.length; i++)
        (key = sourceKeys[i]),
        excluded.indexOf(
            key
        ) >= 0 || (target[key] = source[key]);
    return target;
}
(Year.propTypes = _objectSpread$6(
    _objectSpread$6(
        {
        },
        tileProps
    ),
    {
    },
    {
        formatYear: PropTypes.func,
    }
)),
(Years.propTypes = _objectSpread$5(
    {
    },
    tileGroupProps
));
var className$2 = "react-calendar__year-view__months__month";
function Month(
    _ref
) {
    var classes = _ref.classes,
        _ref$formatMonth = _ref.formatMonth,
        formatMonth$1 =
            void 0 === _ref$formatMonth ? formatMonth : _ref$formatMonth,
        _ref$formatMonthYear = _ref.formatMonthYear,
        formatMonthYear$1 =
            void 0 === _ref$formatMonthYear
                ? formatMonthYear
                : _ref$formatMonthYear,
        otherProps = _objectWithoutProperties$4(
            _ref,
            [
                "classes",
                "formatMonth",
                "formatMonthYear",
            ]
        ),
        date = otherProps.date,
        locale = otherProps.locale;
    return React.createElement(
        Tile,
        _extends$6(
            {
            },
            otherProps,
            {
                classes: [].concat(
                    classes,
                    className$2
                ),
                formatAbbr: formatMonthYear$1,
                maxDateTransform: getMonthEnd,
                minDateTransform: getMonthStart,
                view: "year",
            }
        ),
        formatMonth$1(
            locale,
            date
        )
    );
}
function ownKeys$3(
    object, enumerableOnly
) {
    var keys = Object.keys(
        object
    );
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(
            object
        );
        enumerableOnly &&
            (symbols = symbols.filter(
                function (
                    sym
                ) {
                    return Object.getOwnPropertyDescriptor(
                        object,
                        sym
                    ).enumerable;
                }
            )),
        keys.push.apply(
            keys,
            symbols
        );
    }
    return keys;
}
function _objectSpread$3(
    target
) {
    for (var i = 1; i < arguments.length; i++) {
        var source = null != arguments[i]
            ? arguments[i]
            : {
            };
        i % 2
            ? ownKeys$3(
                Object(
                    source
                ),
                !0
            ).forEach(
                function (
                    key
                ) {
                    _defineProperty$3(
                        target,
                        key,
                        source[key]
                    );
                }
            )
            : Object.getOwnPropertyDescriptors
                ? Object.defineProperties(
                    target,
                    Object.getOwnPropertyDescriptors(
                        source
                    )
                )
                : ownKeys$3(
                    Object(
                        source
                    )
                ).forEach(
                    function (
                        key
                    ) {
                        Object.defineProperty(
                            target,
                            key,
                            Object.getOwnPropertyDescriptor(
                                source,
                                key
                            )
                        );
                    }
                );
    }
    return target;
}
function _defineProperty$3(
    obj, key, value
) {
    return (
        key in obj
            ? Object.defineProperty(
                obj,
                key,
                {
                    value: value,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                }
            )
            : (obj[key] = value),
        obj
    );
}
function _extends$5(
) {
    return (_extends$5 =
        Object.assign ||
        function (
            target
        ) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                for (var key in source)
                    Object.prototype.hasOwnProperty.call(
                        source,
                        key
                    ) &&
                        (target[key] = source[key]);
            }
            return target;
        }).apply(
        this,
        arguments
    );
}
function Months(
    props
) {
    var year = getYear(
        props.activeStartDate
    );
    return React.createElement(
        TileGroup,
        _extends$5(
            {
            },
            props,
            {
                className: "react-calendar__year-view__months",
                dateTransform: function (
                    monthIndex
                ) {
                    var date = new Date(
                    );
                    return (
                        date.setFullYear(
                            year,
                            monthIndex,
                            1
                        ),
                        date.setHours(
                            0,
                            0,
                            0,
                            0
                        ),
                        date
                    );
                },
                dateType: "month",
                end: 11,
                start: 0,
                tile: Month,
            }
        )
    );
}
function YearView(
    props
) {
    return React.createElement(
        "div",
        {
            className: "react-calendar__year-view",
        },
        React.createElement(
            Months,
            props
        )
    );
}
function ownKeys$2(
    object, enumerableOnly
) {
    var keys = Object.keys(
        object
    );
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(
            object
        );
        enumerableOnly &&
            (symbols = symbols.filter(
                function (
                    sym
                ) {
                    return Object.getOwnPropertyDescriptor(
                        object,
                        sym
                    ).enumerable;
                }
            )),
        keys.push.apply(
            keys,
            symbols
        );
    }
    return keys;
}
function _objectSpread$2(
    target
) {
    for (var i = 1; i < arguments.length; i++) {
        var source = null != arguments[i]
            ? arguments[i]
            : {
            };
        i % 2
            ? ownKeys$2(
                Object(
                    source
                ),
                !0
            ).forEach(
                function (
                    key
                ) {
                    _defineProperty$2(
                        target,
                        key,
                        source[key]
                    );
                }
            )
            : Object.getOwnPropertyDescriptors
                ? Object.defineProperties(
                    target,
                    Object.getOwnPropertyDescriptors(
                        source
                    )
                )
                : ownKeys$2(
                    Object(
                        source
                    )
                ).forEach(
                    function (
                        key
                    ) {
                        Object.defineProperty(
                            target,
                            key,
                            Object.getOwnPropertyDescriptor(
                                source,
                                key
                            )
                        );
                    }
                );
    }
    return target;
}
function _defineProperty$2(
    obj, key, value
) {
    return (
        key in obj
            ? Object.defineProperty(
                obj,
                key,
                {
                    value: value,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                }
            )
            : (obj[key] = value),
        obj
    );
}
function _extends$4(
) {
    return (_extends$4 =
        Object.assign ||
        function (
            target
        ) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                for (var key in source)
                    Object.prototype.hasOwnProperty.call(
                        source,
                        key
                    ) &&
                        (target[key] = source[key]);
            }
            return target;
        }).apply(
        this,
        arguments
    );
}
function _objectWithoutProperties$3(
    source, excluded
) {
    if (null == source) return {
    };
    var key,
        i,
        target = _objectWithoutPropertiesLoose$3(
            source,
            excluded
        );
    if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(
            source
        );
        for (i = 0; i < sourceSymbolKeys.length; i++)
            (key = sourceSymbolKeys[i]),
            excluded.indexOf(
                key
            ) >= 0 ||
                    (Object.prototype.propertyIsEnumerable.call(
                        source,
                        key
                    ) &&
                        (target[key] = source[key]));
    }
    return target;
}
function _objectWithoutPropertiesLoose$3(
    source, excluded
) {
    if (null == source) return {
    };
    var key,
        i,
        target = {
        },
        sourceKeys = Object.keys(
            source
        );
    for (i = 0; i < sourceKeys.length; i++)
        (key = sourceKeys[i]),
        excluded.indexOf(
            key
        ) >= 0 || (target[key] = source[key]);
    return target;
}
(Month.propTypes = _objectSpread$4(
    _objectSpread$4(
        {
        },
        tileProps
    ),
    {
    },
    {
        formatMonth: PropTypes.func,
        formatMonthYear: PropTypes.func,
    }
)),
(Months.propTypes = _objectSpread$3(
    _objectSpread$3(
        {
        },
        tileGroupProps
    ),
    {
    },
    {
        locale: PropTypes.string,
    }
));
var className$1 = "react-calendar__month-view__days__day";
function Day(
    _ref
) {
    var _ref$formatDay = _ref.formatDay,
        formatDay$1 = void 0 === _ref$formatDay ? formatDay : _ref$formatDay,
        _ref$formatLongDate = _ref.formatLongDate,
        formatLongDate$1 =
            void 0 === _ref$formatLongDate
                ? formatLongDate
                : _ref$formatLongDate,
        calendarType = _ref.calendarType,
        classes = _ref.classes,
        currentMonthIndex = _ref.currentMonthIndex,
        otherProps = _objectWithoutProperties$3(
            _ref,
            [
                "formatDay",
                "formatLongDate",
                "calendarType",
                "classes",
                "currentMonthIndex",
            ]
        ),
        date = otherProps.date,
        locale = otherProps.locale;
    return React.createElement(
        Tile,
        _extends$4(
            {
            },
            otherProps,
            {
                classes: [].concat(
                    classes,
                    className$1,
                    isWeekend(
                        date,
                        calendarType
                    )
                        ? "".concat(
                            className$1,
                            "--weekend"
                        )
                        : null,
                    date.getMonth(
                    ) !== currentMonthIndex
                        ? "".concat(
                            className$1,
                            "--neighboringMonth"
                        )
                        : null
                ),
                formatAbbr: formatLongDate$1,
                maxDateTransform: getDayEnd,
                minDateTransform: getDayStart,
                view: "month",
            }
        ),
        formatDay$1(
            locale,
            date
        )
    );
}
function ownKeys$1(
    object, enumerableOnly
) {
    var keys = Object.keys(
        object
    );
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(
            object
        );
        enumerableOnly &&
            (symbols = symbols.filter(
                function (
                    sym
                ) {
                    return Object.getOwnPropertyDescriptor(
                        object,
                        sym
                    ).enumerable;
                }
            )),
        keys.push.apply(
            keys,
            symbols
        );
    }
    return keys;
}
function _objectSpread$1(
    target
) {
    for (var i = 1; i < arguments.length; i++) {
        var source = null != arguments[i]
            ? arguments[i]
            : {
            };
        i % 2
            ? ownKeys$1(
                Object(
                    source
                ),
                !0
            ).forEach(
                function (
                    key
                ) {
                    _defineProperty$1(
                        target,
                        key,
                        source[key]
                    );
                }
            )
            : Object.getOwnPropertyDescriptors
                ? Object.defineProperties(
                    target,
                    Object.getOwnPropertyDescriptors(
                        source
                    )
                )
                : ownKeys$1(
                    Object(
                        source
                    )
                ).forEach(
                    function (
                        key
                    ) {
                        Object.defineProperty(
                            target,
                            key,
                            Object.getOwnPropertyDescriptor(
                                source,
                                key
                            )
                        );
                    }
                );
    }
    return target;
}
function _defineProperty$1(
    obj, key, value
) {
    return (
        key in obj
            ? Object.defineProperty(
                obj,
                key,
                {
                    value: value,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                }
            )
            : (obj[key] = value),
        obj
    );
}
function _extends$3(
) {
    return (_extends$3 =
        Object.assign ||
        function (
            target
        ) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                for (var key in source)
                    Object.prototype.hasOwnProperty.call(
                        source,
                        key
                    ) &&
                        (target[key] = source[key]);
            }
            return target;
        }).apply(
        this,
        arguments
    );
}
function _objectWithoutProperties$2(
    source, excluded
) {
    if (null == source) return {
    };
    var key,
        i,
        target = _objectWithoutPropertiesLoose$2(
            source,
            excluded
        );
    if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(
            source
        );
        for (i = 0; i < sourceSymbolKeys.length; i++)
            (key = sourceSymbolKeys[i]),
            excluded.indexOf(
                key
            ) >= 0 ||
                    (Object.prototype.propertyIsEnumerable.call(
                        source,
                        key
                    ) &&
                        (target[key] = source[key]));
    }
    return target;
}
function _objectWithoutPropertiesLoose$2(
    source, excluded
) {
    if (null == source) return {
    };
    var key,
        i,
        target = {
        },
        sourceKeys = Object.keys(
            source
        );
    for (i = 0; i < sourceKeys.length; i++)
        (key = sourceKeys[i]),
        excluded.indexOf(
            key
        ) >= 0 || (target[key] = source[key]);
    return target;
}
function Days(
    props
) {
    var activeStartDate = props.activeStartDate,
        calendarType = props.calendarType,
        showFixedNumberOfWeeks = props.showFixedNumberOfWeeks,
        showNeighboringMonth = props.showNeighboringMonth,
        otherProps = _objectWithoutProperties$2(
            props,
            [
                "showFixedNumberOfWeeks",
                "showNeighboringMonth",
            ]
        ),
        year = getYear(
            activeStartDate
        ),
        monthIndex = getMonth(
            activeStartDate
        ),
        hasFixedNumberOfWeeks = showFixedNumberOfWeeks || showNeighboringMonth,
        dayOfWeek = getDayOfWeek(
            activeStartDate,
            calendarType
        ),
        offset = hasFixedNumberOfWeeks ? 0 : dayOfWeek,
        start = 1 + (hasFixedNumberOfWeeks ? -dayOfWeek : 0),
        end = (function (
        ) {
            if (showFixedNumberOfWeeks) return start + 42 - 1;
            var daysInMonth = getDaysInMonth(
                activeStartDate
            );
            if (showNeighboringMonth) {
                var activeEndDate = new Date(
                );
                return (
                    activeEndDate.setFullYear(
                        year,
                        monthIndex,
                        daysInMonth
                    ),
                    activeEndDate.setHours(
                        0,
                        0,
                        0,
                        0
                    ),
                    daysInMonth +
                        (7 - getDayOfWeek(
                            activeEndDate,
                            calendarType
                        ) - 1)
                );
            }
            return daysInMonth;
        })(
        );
    return React.createElement(
        TileGroup,
        _extends$3(
            {
            },
            otherProps,
            {
                className: "react-calendar__month-view__days",
                count: 7,
                currentMonthIndex: monthIndex,
                dateTransform: function (
                    day
                ) {
                    var date = new Date(
                    );
                    return (
                        date.setFullYear(
                            year,
                            monthIndex,
                            day
                        ),
                        date.setHours(
                            0,
                            0,
                            0,
                            0
                        ),
                        date
                    );
                },
                dateType: "day",
                end: end,
                offset: offset,
                start: start,
                tile: Day,
            }
        )
    );
}
(Day.propTypes = _objectSpread$2(
    _objectSpread$2(
        {
        },
        tileProps
    ),
    {
    },
    {
        currentMonthIndex: PropTypes.number.isRequired,
        formatDay: PropTypes.func,
        formatLongDate: PropTypes.func,
    }
)),
(Days.propTypes = _objectSpread$1(
    {
        calendarType: isCalendarType.isRequired,
        showFixedNumberOfWeeks: PropTypes.bool,
        showNeighboringMonth: PropTypes.bool,
    },
    tileGroupProps
));
var className = "react-calendar__month-view__weekdays";
function Weekdays(
    props
) {
    for (
        var calendarType = props.calendarType,
            _props$formatShortWee = props.formatShortWeekday,
            formatShortWeekday$1 =
                void 0 === _props$formatShortWee
                    ? formatShortWeekday
                    : _props$formatShortWee,
            locale = props.locale,
            onMouseLeave = props.onMouseLeave,
            beginOfMonth = getMonthStart(
                new Date(
                )
            ),
            year = getYear(
                beginOfMonth
            ),
            monthIndex = getMonth(
                beginOfMonth
            ),
            weekdays = [],
            weekday = 1;
        weekday <= 7;
        weekday += 1
    ) {
        var weekdayDate = new Date(
                year,
                monthIndex,
                weekday - getDayOfWeek(
                    beginOfMonth,
                    calendarType
                )
            ),
            abbr = formatWeekday(
                locale,
                weekdayDate
            );
        weekdays.push(
            React.createElement(
                "div",
                {
                    key: weekday,
                    className: "".concat(
                        className,
                        "__weekday"
                    ),
                },
                React.createElement(
                    "abbr",
                    {
                        "aria-label": abbr,
                        title: abbr,
                    },
                    formatShortWeekday$1(
                        locale,
                        weekdayDate
                    ).replace(
                        ".",
                        ""
                    )
                )
            )
        );
    }
    return React.createElement(
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
function _extends$2(
) {
    return (_extends$2 =
        Object.assign ||
        function (
            target
        ) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                for (var key in source)
                    Object.prototype.hasOwnProperty.call(
                        source,
                        key
                    ) &&
                        (target[key] = source[key]);
            }
            return target;
        }).apply(
        this,
        arguments
    );
}
function WeekNumber(
    _ref
) {
    var date = _ref.date,
        onClickWeekNumber = _ref.onClickWeekNumber,
        weekNumber = _ref.weekNumber,
        props = {
            className: "react-calendar__tile",
            style: {
                flexGrow: 1,
            },
        },
        children = React.createElement(
            "span",
            null,
            weekNumber
        );
    return onClickWeekNumber
        ? React.createElement(
            "button",
            _extends$2(
                {
                },
                props,
                {
                    onClick: function (
                        event
                    ) {
                        return onClickWeekNumber(
                            weekNumber,
                            date,
                            event
                        );
                    },
                    type: "button",
                }
            ),
            children
        )
        : React.createElement(
            "div",
            props,
            children
        );
}
function WeekNumbers(
    props
) {
    var activeStartDate = props.activeStartDate,
        calendarType = props.calendarType,
        onClickWeekNumber = props.onClickWeekNumber,
        onMouseLeave = props.onMouseLeave,
        showFixedNumberOfWeeks = props.showFixedNumberOfWeeks,
        numberOfWeeks = (function (
        ) {
            if (showFixedNumberOfWeeks) return 6;
            var days =
                getDaysInMonth(
                    activeStartDate
                ) -
                (7 - getDayOfWeek(
                    activeStartDate,
                    calendarType
                ));
            return 1 + Math.ceil(
                days / 7
            );
        })(
        ),
        dates = (function (
        ) {
            for (
                var year = getYear(
                        activeStartDate
                    ),
                    monthIndex = getMonth(
                        activeStartDate
                    ),
                    day = getDate(
                        activeStartDate
                    ),
                    result = [],
                    index = 0;
                index < numberOfWeeks;
                index += 1
            )
                result.push(
                    getBeginOfWeek(
                        new Date(
                            year,
                            monthIndex,
                            day + 7 * index
                        ),
                        calendarType
                    )
                );
            return result;
        })(
        ),
        weekNumbers = dates.map(
            function (
                date
            ) {
                return getWeekNumber(
                    date,
                    calendarType
                );
            }
        );
    return React.createElement(
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
        weekNumbers.map(
            function (
                weekNumber, weekIndex
            ) {
                return React.createElement(
                    WeekNumber,
                    {
                        key: weekNumber,
                        date: dates[weekIndex],
                        onClickWeekNumber: onClickWeekNumber,
                        weekNumber: weekNumber,
                    }
                );
            }
        )
    );
}
function _extends$1(
) {
    return (_extends$1 =
        Object.assign ||
        function (
            target
        ) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                for (var key in source)
                    Object.prototype.hasOwnProperty.call(
                        source,
                        key
                    ) &&
                        (target[key] = source[key]);
            }
            return target;
        }).apply(
        this,
        arguments
    );
}
function _objectWithoutProperties$1(
    source, excluded
) {
    if (null == source) return {
    };
    var key,
        i,
        target = _objectWithoutPropertiesLoose$1(
            source,
            excluded
        );
    if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(
            source
        );
        for (i = 0; i < sourceSymbolKeys.length; i++)
            (key = sourceSymbolKeys[i]),
            excluded.indexOf(
                key
            ) >= 0 ||
                    (Object.prototype.propertyIsEnumerable.call(
                        source,
                        key
                    ) &&
                        (target[key] = source[key]));
    }
    return target;
}
function _objectWithoutPropertiesLoose$1(
    source, excluded
) {
    if (null == source) return {
    };
    var key,
        i,
        target = {
        },
        sourceKeys = Object.keys(
            source
        );
    for (i = 0; i < sourceKeys.length; i++)
        (key = sourceKeys[i]),
        excluded.indexOf(
            key
        ) >= 0 || (target[key] = source[key]);
    return target;
}
function getCalendarTypeFromLocale(
    locale
) {
    return (
        Object.keys(
            CALENDAR_TYPE_LOCALES
        ).find(
            function (
                calendarType
            ) {
                return CALENDAR_TYPE_LOCALES[calendarType].includes(
                    locale
                );
            }
        ) || CALENDAR_TYPES.ISO_8601
    );
}
function MonthView(
    props
) {
    var activeStartDate = props.activeStartDate,
        locale = props.locale,
        onMouseLeave = props.onMouseLeave,
        showFixedNumberOfWeeks = props.showFixedNumberOfWeeks,
        _props$calendarType = props.calendarType,
        calendarType =
            void 0 === _props$calendarType
                ? getCalendarTypeFromLocale(
                    locale
                )
                : _props$calendarType,
        formatShortWeekday = props.formatShortWeekday,
        onClickWeekNumber = props.onClickWeekNumber,
        showWeekNumbers = props.showWeekNumbers,
        childProps = _objectWithoutProperties$1(
            props,
            [
                "calendarType",
                "formatShortWeekday",
                "onClickWeekNumber",
                "showWeekNumbers",
            ]
        );
    return React.createElement(
        "div",
        {
            className: mergeClassNames(
                "react-calendar__month-view",
                showWeekNumbers
                    ? "".concat(
                        "react-calendar__month-view",
                        "--weekNumbers"
                    )
                    : ""
            ),
        },
        React.createElement(
            "div",
            {
                style: {
                    display: "flex",
                    alignItems: "flex-end",
                },
            },
            showWeekNumbers
                ? React.createElement(
                    WeekNumbers,
                    {
                        activeStartDate: activeStartDate,
                        calendarType: calendarType,
                        onClickWeekNumber: onClickWeekNumber,
                        onMouseLeave: onMouseLeave,
                        showFixedNumberOfWeeks: showFixedNumberOfWeeks,
                    }
                )
                : null,
            React.createElement(
                "div",
                {
                    style: {
                        flexGrow: 1,
                        width: "100%",
                    },
                },
                React.createElement(
                    Weekdays,
                    {
                        calendarType: calendarType,
                        formatShortWeekday: formatShortWeekday,
                        locale: locale,
                        onMouseLeave: onMouseLeave,
                    }
                ),
                React.createElement(
                    Days,
                    _extends$1(
                        {
                            calendarType: calendarType,
                        },
                        childProps
                    )
                )
            )
        )
    );
}
function _extends(
) {
    return (_extends =
        Object.assign ||
        function (
            target
        ) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                for (var key in source)
                    Object.prototype.hasOwnProperty.call(
                        source,
                        key
                    ) &&
                        (target[key] = source[key]);
            }
            return target;
        }).apply(
        this,
        arguments
    );
}
function _typeof(
    obj
) {
    return (_typeof =
        "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
            ? function (
                obj
            ) {
                return typeof obj;
            }
            : function (
                obj
            ) {
                return obj &&
                      "function" == typeof Symbol &&
                      obj.constructor === Symbol &&
                      obj !== Symbol.prototype
                    ? "symbol"
                    : typeof obj;
            })(
        obj
    );
}
function _classCallCheck(
    instance, Constructor
) {
    if (!(instance instanceof Constructor))
        throw new TypeError(
            "Cannot call a class as a function"
        );
}
function _defineProperties(
    target, props
) {
    for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        (descriptor.enumerable = descriptor.enumerable || !1),
        (descriptor.configurable = !0),
        "value" in descriptor && (descriptor.writable = !0),
        Object.defineProperty(
            target,
            descriptor.key,
            descriptor
        );
    }
}
function _createClass(
    Constructor, protoProps, staticProps
) {
    return (
        protoProps && _defineProperties(
            Constructor.prototype,
            protoProps
        ),
        staticProps && _defineProperties(
            Constructor,
            staticProps
        ),
        Constructor
    );
}
function _inherits(
    subClass, superClass
) {
    if ("function" != typeof superClass && null !== superClass)
        throw new TypeError(
            "Super expression must either be null or a function"
        );
    (subClass.prototype = Object.create(
        superClass && superClass.prototype,
        {
            constructor: {
                value: subClass,
                writable: !0,
                configurable: !0,
            },
        }
    )),
    superClass && _setPrototypeOf(
        subClass,
        superClass
    );
}
function _setPrototypeOf(
    o, p
) {
    return (_setPrototypeOf =
        Object.setPrototypeOf ||
        function (
            o, p
        ) {
            return (o.__proto__ = p), o;
        })(
        o,
        p
    );
}
function _createSuper(
    Derived
) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct(
    );
    return function (
    ) {
        var result,
            Super = _getPrototypeOf(
                Derived
            );
        if (hasNativeReflectConstruct) {
            var NewTarget = _getPrototypeOf(
                this
            ).constructor;
            result = Reflect.construct(
                Super,
                arguments,
                NewTarget
            );
        } else result = Super.apply(
            this,
            arguments
        );
        return _possibleConstructorReturn(
            this,
            result
        );
    };
}
function _possibleConstructorReturn(
    self, call
) {
    return !call || ("object" !== _typeof(
        call
    ) && "function" != typeof call)
        ? _assertThisInitialized(
            self
        )
        : call;
}
function _assertThisInitialized(
    self
) {
    if (void 0 === self)
        throw new ReferenceError(
            "this hasn't been initialised - super() hasn't been called"
        );
    return self;
}
function _isNativeReflectConstruct(
) {
    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
    if (Reflect.construct.sham) return !1;
    if ("function" == typeof Proxy) return !0;
    try {
        return (
            Date.prototype.toString.call(
                Reflect.construct(
                    Date,
                    [],
                    function (
                    ) {}
                )
            ),
            !0
        );
    } catch (e) {
        return !1;
    }
}
function _getPrototypeOf(
    o
) {
    return (_getPrototypeOf = Object.setPrototypeOf
        ? Object.getPrototypeOf
        : function (
            o
        ) {
            return o.__proto__ || Object.getPrototypeOf(
                o
            );
        })(
        o
    );
}
function ownKeys(
    object, enumerableOnly
) {
    var keys = Object.keys(
        object
    );
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(
            object
        );
        enumerableOnly &&
            (symbols = symbols.filter(
                function (
                    sym
                ) {
                    return Object.getOwnPropertyDescriptor(
                        object,
                        sym
                    ).enumerable;
                }
            )),
        keys.push.apply(
            keys,
            symbols
        );
    }
    return keys;
}
function _objectSpread(
    target
) {
    for (var i = 1; i < arguments.length; i++) {
        var source = null != arguments[i]
            ? arguments[i]
            : {
            };
        i % 2
            ? ownKeys(
                Object(
                    source
                ),
                !0
            ).forEach(
                function (
                    key
                ) {
                    _defineProperty(
                        target,
                        key,
                        source[key]
                    );
                }
            )
            : Object.getOwnPropertyDescriptors
                ? Object.defineProperties(
                    target,
                    Object.getOwnPropertyDescriptors(
                        source
                    )
                )
                : ownKeys(
                    Object(
                        source
                    )
                ).forEach(
                    function (
                        key
                    ) {
                        Object.defineProperty(
                            target,
                            key,
                            Object.getOwnPropertyDescriptor(
                                source,
                                key
                            )
                        );
                    }
                );
    }
    return target;
}
function _defineProperty(
    obj, key, value
) {
    return (
        key in obj
            ? Object.defineProperty(
                obj,
                key,
                {
                    value: value,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                }
            )
            : (obj[key] = value),
        obj
    );
}
function _objectWithoutProperties(
    source, excluded
) {
    if (null == source) return {
    };
    var key,
        i,
        target = _objectWithoutPropertiesLoose(
            source,
            excluded
        );
    if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(
            source
        );
        for (i = 0; i < sourceSymbolKeys.length; i++)
            (key = sourceSymbolKeys[i]),
            excluded.indexOf(
                key
            ) >= 0 ||
                    (Object.prototype.propertyIsEnumerable.call(
                        source,
                        key
                    ) &&
                        (target[key] = source[key]));
    }
    return target;
}
function _objectWithoutPropertiesLoose(
    source, excluded
) {
    if (null == source) return {
    };
    var key,
        i,
        target = {
        },
        sourceKeys = Object.keys(
            source
        );
    for (i = 0; i < sourceKeys.length; i++)
        (key = sourceKeys[i]),
        excluded.indexOf(
            key
        ) >= 0 || (target[key] = source[key]);
    return target;
}
function _toConsumableArray(
    arr
) {
    return (
        _arrayWithoutHoles(
            arr
        ) ||
        _iterableToArray(
            arr
        ) ||
        _unsupportedIterableToArray(
            arr
        ) ||
        _nonIterableSpread(
        )
    );
}
function _nonIterableSpread(
) {
    throw new TypeError(
        "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
    );
}
function _unsupportedIterableToArray(
    o, minLen
) {
    if (o) {
        if ("string" == typeof o) return _arrayLikeToArray(
            o,
            minLen
        );
        var n = Object.prototype.toString.call(
            o
        ).slice(
            8,
            -1
        );
        return (
            "Object" === n && o.constructor && (n = o.constructor.name),
            "Map" === n || "Set" === n
                ? Array.from(
                    o
                )
                : "Arguments" === n ||
                  /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(
                      n
                  )
                    ? _arrayLikeToArray(
                        o,
                        minLen
                    )
                    : void 0
        );
    }
}
function _iterableToArray(
    iter
) {
    if ("undefined" != typeof Symbol && Symbol.iterator in Object(
        iter
    ))
        return Array.from(
            iter
        );
}
function _arrayWithoutHoles(
    arr
) {
    if (Array.isArray(
        arr
    )) return _arrayLikeToArray(
        arr
    );
}
function _arrayLikeToArray(
    arr, len
) {
    (null == len || len > arr.length) && (len = arr.length);
    for (var i = 0, arr2 = new Array(
        len
    ); i < len; i++) arr2[i] = arr[i];
    return arr2;
}
(Weekdays.propTypes = {
    calendarType: isCalendarType.isRequired,
    formatShortWeekday: PropTypes.func,
    locale: PropTypes.string,
    onMouseLeave: PropTypes.func,
}),
(WeekNumber.propTypes = {
    date: PropTypes.instanceOf(
        Date
    ).isRequired,
    onClickWeekNumber: PropTypes.func,
    weekNumber: PropTypes.node.isRequired,
}),
(WeekNumbers.propTypes = {
    activeStartDate: PropTypes.instanceOf(
        Date
    ).isRequired,
    calendarType: isCalendarType.isRequired,
    onClickWeekNumber: PropTypes.func,
    onMouseLeave: PropTypes.func,
    showFixedNumberOfWeeks: PropTypes.bool,
}),
(MonthView.propTypes = {
    activeStartDate: PropTypes.instanceOf(
        Date
    ).isRequired,
    calendarType: isCalendarType,
    formatShortWeekday: PropTypes.func,
    locale: PropTypes.string,
    onClickWeekNumber: PropTypes.func,
    onMouseLeave: PropTypes.func,
    showFixedNumberOfWeeks: PropTypes.bool,
    showWeekNumbers: PropTypes.bool,
});
var defaultMinDate = new Date(
);
defaultMinDate.setFullYear(
    1,
    0,
    1
), defaultMinDate.setHours(
    0,
    0,
    0,
    0
);
var defaultMaxDate = new Date(
        864e13
    ),
    baseClassName = "react-calendar",
    allViews = ["century", "decade", "year", "month",],
    allValueTypes = [].concat(
        _toConsumableArray(
            allViews.slice(
                1
            )
        ),
        ["day",]
    );
function toDate(
    value
) {
    return value instanceof Date
        ? value
        : new Date(
            value
        );
}
function getLimitedViews(
    minDetail, maxDetail
) {
    return allViews.slice(
        allViews.indexOf(
            minDetail
        ),
        allViews.indexOf(
            maxDetail
        ) + 1
    );
}
function isViewAllowed(
    view, minDetail, maxDetail
) {
    return -1 !== getLimitedViews(
        minDetail,
        maxDetail
    ).indexOf(
        view
    );
}
function getView(
    view, minDetail, maxDetail
) {
    return isViewAllowed(
        view,
        minDetail,
        maxDetail
    )
        ? view
        : maxDetail;
}
function getValueType(
    maxDetail
) {
    return allValueTypes[allViews.indexOf(
        maxDetail
    )];
}
function getValue(
    value, index
) {
    if (!value) return null;
    var rawValue =
        Array.isArray(
            value
        ) && 2 === value.length
            ? value[index]
            : value;
    if (!rawValue) return null;
    var valueDate = toDate(
        rawValue
    );
    if (isNaN(
        valueDate.getTime(
        )
    ))
        throw new Error(
            "Invalid date: ".concat(
                value
            )
        );
    return valueDate;
}
function getDetailValue(
    _ref, index
) {
    var value = _ref.value,
        minDate = _ref.minDate,
        maxDate = _ref.maxDate,
        maxDetail = _ref.maxDetail,
        valuePiece = getValue(
            value,
            index
        );
    if (!valuePiece) return null;
    var valueType = getValueType(
        maxDetail
    );
    return between(
        [getBegin, getEnd,][index](
            valueType,
            valuePiece
        ),
        minDate,
        maxDate
    );
}
var getDetailValueFrom = function (
        args
    ) {
        return getDetailValue(
            args,
            0
        );
    },
    getDetailValueTo = function (
        args
    ) {
        return getDetailValue(
            args,
            1
        );
    },
    getDetailValueArray = function (
        args
    ) {
        var value = args.value;
        return Array.isArray(
            value
        )
            ? value
            : [getDetailValueFrom, getDetailValueTo,].map(
                function (
                    fn
                ) {
                    return fn(
                        args
                    );
                }
            );
    };
function getActiveStartDate(
    props
) {
    var maxDate = props.maxDate,
        maxDetail = props.maxDetail,
        minDate = props.minDate,
        minDetail = props.minDetail,
        value = props.value;
    return getBegin(
        getView(
            props.view,
            minDetail,
            maxDetail
        ),
        getDetailValueFrom(
            {
                value: value,
                minDate: minDate,
                maxDate: maxDate,
                maxDetail: maxDetail,
            }
        ) || new Date(
        )
    );
}
function getInitialActiveStartDate(
    props
) {
    var activeStartDate = props.activeStartDate,
        defaultActiveStartDate = props.defaultActiveStartDate,
        defaultValue = props.defaultValue,
        defaultView = props.defaultView,
        maxDetail = props.maxDetail,
        minDetail = props.minDetail,
        value = props.value,
        view = props.view,
        otherProps = _objectWithoutProperties(
            props,
            [
                "activeStartDate",
                "defaultActiveStartDate",
                "defaultValue",
                "defaultView",
                "maxDetail",
                "minDetail",
                "value",
                "view",
            ]
        ),
        rangeType = getView(
            view,
            minDetail,
            maxDetail
        ),
        valueFrom = activeStartDate || defaultActiveStartDate;
    return valueFrom
        ? getBegin(
            rangeType,
            valueFrom
        )
        : getActiveStartDate(
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
var getIsSingleValue = function (
        value
    ) {
        return value && 1 === [].concat(
            value
        ).length;
    },
    Calendar = (function (
        _Component
    ) {
        _inherits(
            Calendar,
            _
        );
        var _super = _createSuper(
            Calendar
        );
        function Calendar(
        ) {
            var _this;
            _classCallCheck(
                this,
                Calendar
            );
            for (
                var _len = arguments.length, _args = new Array(
                        _len
                    ), _key = 0;
                _key < _len;
                _key++
            )
                _args[_key] = arguments[_key];
            return (
                _defineProperty(
                    _assertThisInitialized(
                        (_this = _super.call.apply(
                            _super,
                            [this,].concat(
                                _args
                            )
                        ))
                    ),
                    "state",
                    {
                        activeStartDate: _this.props.defaultActiveStartDate,
                        value: _this.props.defaultValue,
                        view: _this.props.defaultView,
                    }
                ),
                _defineProperty(
                    _assertThisInitialized(
                        _this
                    ),
                    "setStateAndCallCallbacks",
                    function (
                        nextState, event, callback
                    ) {
                        var _assertThisInitialize =
                                _assertThisInitialized(
                                    _this
                                ),
                            previousActiveStartDate =
                                _assertThisInitialize.activeStartDate,
                            previousView = _assertThisInitialize.view,
                            _this$props = _this.props,
                            allowPartialRange = _this$props.allowPartialRange,
                            onActiveStartDateChange =
                                _this$props.onActiveStartDateChange,
                            onChange = _this$props.onChange,
                            onViewChange = _this$props.onViewChange,
                            selectRange = _this$props.selectRange,
                            prevArgs = {
                                activeStartDate: previousActiveStartDate,
                                view: previousView,
                            };
                        _this.setState(
                            nextState,
                            function (
                            ) {
                                var args = {
                                    activeStartDate:
                                    nextState.activeStartDate ||
                                    _this.activeStartDate,
                                    value: nextState.value || _this.value,
                                    view: nextState.view || _this.view,
                                };
                                function shouldUpdate(
                                    key
                                ) {
                                    return (
                                        key in nextState &&
                                    (_typeof(
                                        nextState[key]
                                    ) !==
                                        _typeof(
                                            prevArgs[key]
                                        ) ||
                                        (nextState[key] instanceof Date
                                            ? nextState[key].getTime(
                                            ) !==
                                              prevArgs[key].getTime(
                                              )
                                            : nextState[key] !== prevArgs[key]))
                                    );
                                }
                                (shouldUpdate(
                                    "activeStartDate"
                                ) &&
                                onActiveStartDateChange &&
                                onActiveStartDateChange(
                                    args
                                ),
                                shouldUpdate(
                                    "view"
                                ) &&
                                onViewChange &&
                                onViewChange(
                                    args
                                ),
                                shouldUpdate(
                                    "value"
                                )) &&
                                onChange &&
                                (selectRange &&
                                getIsSingleValue(
                                    nextState.value
                                )
                                    ? allowPartialRange &&
                                      onChange(
                                          [nextState.value,],
                                          event
                                      )
                                    : onChange(
                                        nextState.value,
                                        event
                                    ));
                                callback && callback(
                                    args
                                );
                            }
                        );
                    }
                ),
                _defineProperty(
                    _assertThisInitialized(
                        _this
                    ),
                    "setActiveStartDate",
                    function (
                        activeStartDate
                    ) {
                        _this.setStateAndCallCallbacks(
                            {
                                activeStartDate: activeStartDate,
                            }
                        );
                    }
                ),
                _defineProperty(
                    _assertThisInitialized(
                        _this
                    ),
                    "drillDown",
                    function (
                        nextActiveStartDate, event
                    ) {
                        if (_this.drillDownAvailable) {
                            _this.onClickTile(
                                nextActiveStartDate,
                                event
                            );
                            var _assertThisInitialize2 =
                                    _assertThisInitialized(
                                        _this
                                    ),
                                view = _assertThisInitialize2.view,
                                views = _assertThisInitialize2.views,
                                onDrillDown = _this.props.onDrillDown,
                                nextView = views[views.indexOf(
                                    view
                                ) + 1];
                            _this.setStateAndCallCallbacks(
                                {
                                    activeStartDate: nextActiveStartDate,
                                    view: nextView,
                                },
                                void 0,
                                onDrillDown
                            );
                        }
                    }
                ),
                _defineProperty(
                    _assertThisInitialized(
                        _this
                    ),
                    "drillUp",
                    function (
                    ) {
                        if (_this.drillUpAvailable) {
                            var _assertThisInitialize3 =
                                    _assertThisInitialized(
                                        _this
                                    ),
                                activeStartDate =
                                    _assertThisInitialize3.activeStartDate,
                                view = _assertThisInitialize3.view,
                                views = _assertThisInitialize3.views,
                                onDrillUp = _this.props.onDrillUp,
                                nextView = views[views.indexOf(
                                    view
                                ) - 1],
                                nextActiveStartDate = getBegin(
                                    nextView,
                                    activeStartDate
                                );
                            _this.setStateAndCallCallbacks(
                                {
                                    activeStartDate: nextActiveStartDate,
                                    view: nextView,
                                },
                                void 0,
                                onDrillUp
                            );
                        }
                    }
                ),
                _defineProperty(
                    _assertThisInitialized(
                        _this
                    ),
                    "onChange",
                    function (
                        value, event
                    ) {
                        var nextValue,
                            selectRange = _this.props.selectRange;
                        if ((_this.onClickTile(
                            value,
                            event
                        ), selectRange)) {
                            var _assertThisInitialize4 =
                                    _assertThisInitialized(
                                        _this
                                    ),
                                previousValue = _assertThisInitialize4.value,
                                valueType = _assertThisInitialize4.valueType;
                            nextValue = getIsSingleValue(
                                previousValue
                            )
                                ? getValueRange(
                                    valueType,
                                    previousValue,
                                    value
                                )
                                : getBegin(
                                    valueType,
                                    value
                                );
                        } else nextValue = _this.getProcessedValue(
                            value
                        );
                        var nextActiveStartDate = getActiveStartDate(
                            _objectSpread(
                                _objectSpread(
                                    {
                                    },
                                    _this.props
                                ),
                                {
                                },
                                {
                                    value: nextValue,
                                }
                            )
                        );
                        event.persist(
                        ),
                        _this.setStateAndCallCallbacks(
                            {
                                activeStartDate: nextActiveStartDate,
                                value: nextValue,
                            },
                            event
                        );
                    }
                ),
                _defineProperty(
                    _assertThisInitialized(
                        _this
                    ),
                    "onClickTile",
                    function (
                        value, event
                    ) {
                        var view = _assertThisInitialized(
                                _this
                            ).view,
                            _this$props2 = _this.props,
                            onClickDay = _this$props2.onClickDay,
                            onClickDecade = _this$props2.onClickDecade,
                            onClickMonth = _this$props2.onClickMonth,
                            onClickYear = _this$props2.onClickYear,
                            callback = (function (
                            ) {
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
                                    throw new Error(
                                        "Invalid view: ".concat(
                                            view,
                                            "."
                                        )
                                    );
                                }
                            })(
                            );
                        callback && callback(
                            value,
                            event
                        );
                    }
                ),
                _defineProperty(
                    _assertThisInitialized(
                        _this
                    ),
                    "onMouseOver",
                    function (
                        value
                    ) {
                        _this.setState(
                            function (
                                prevState
                            ) {
                                return prevState.hover &&
                                prevState.hover.getTime(
                                ) === value.getTime(
                                )
                                    ? null
                                    : {
                                        hover: value,
                                    };
                            }
                        );
                    }
                ),
                _defineProperty(
                    _assertThisInitialized(
                        _this
                    ),
                    "onMouseLeave",
                    function (
                    ) {
                        _this.setState(
                            {
                                hover: null,
                            }
                        );
                    }
                ),
                _this
            );
        }
        return (
            _createClass(
                Calendar,
                [
                    {
                        key: "getProcessedValue",
                        value: function (
                            value
                        ) {
                            var _this$props3 = this.props,
                                minDate = _this$props3.minDate,
                                maxDate = _this$props3.maxDate,
                                maxDetail = _this$props3.maxDetail,
                                returnValue = _this$props3.returnValue;
                            return (function (
                            ) {
                                switch (returnValue) {
                                case "start":
                                    return getDetailValueFrom;
                                case "end":
                                    return getDetailValueTo;
                                case "range":
                                    return getDetailValueArray;
                                default:
                                    throw new Error(
                                        "Invalid returnValue."
                                    );
                                }
                            })(
                            )(
                                {
                                    value: value,
                                    minDate: minDate,
                                    maxDate: maxDate,
                                    maxDetail: maxDetail,
                                }
                            );
                        },
                    },
                    {
                        key: "renderContent",
                        value: function (
                            next
                        ) {
                            var currentActiveStartDate = this.activeStartDate,
                                onMouseOver = this.onMouseOver,
                                valueType = this.valueType,
                                value = this.value,
                                view = this.view,
                                _this$props4 = this.props,
                                calendarType = _this$props4.calendarType,
                                locale = _this$props4.locale,
                                maxDate = _this$props4.maxDate,
                                minDate = _this$props4.minDate,
                                selectRange = _this$props4.selectRange,
                                tileClassName = _this$props4.tileClassName,
                                tileContent = _this$props4.tileContent,
                                tileDisabled = _this$props4.tileDisabled,
                                hover = this.hover,
                                commonProps = {
                                    activeStartDate: next
                                        ? getBeginNext(
                                            view,
                                            currentActiveStartDate
                                        )
                                        : getBegin(
                                            view,
                                            currentActiveStartDate
                                        ),
                                    hover: hover,
                                    locale: locale,
                                    maxDate: maxDate,
                                    minDate: minDate,
                                    onClick: this.drillDownAvailable
                                        ? this.drillDown
                                        : this.onChange,
                                    onMouseOver: selectRange ? onMouseOver : null,
                                    tileClassName: tileClassName,
                                    tileContent: tileContent,
                                    tileDisabled: tileDisabled,
                                    value: value,
                                    valueType: valueType,
                                };
                            switch (view) {
                            case "century":
                                var formatYear = this.props.formatYear;
                                return React.createElement(
                                    CenturyView,
                                    _extends(
                                        {
                                            formatYear: formatYear,
                                        },
                                        commonProps
                                    )
                                );
                            case "decade":
                                var _formatYear = this.props.formatYear;
                                return React.createElement(
                                    DecadeView,
                                    _extends(
                                        {
                                            formatYear: _formatYear,
                                        },
                                        commonProps
                                    )
                                );
                            case "year":
                                var _this$props5 = this.props,
                                    formatMonth = _this$props5.formatMonth,
                                    formatMonthYear =
                                        _this$props5.formatMonthYear;
                                return React.createElement(
                                    YearView,
                                    _extends(
                                        {
                                            formatMonth: formatMonth,
                                            formatMonthYear: formatMonthYear,
                                        },
                                        commonProps
                                    )
                                );
                            case "month":
                                var _this$props6 = this.props,
                                    formatDay = _this$props6.formatDay,
                                    formatLongDate =
                                        _this$props6.formatLongDate,
                                    formatShortWeekday =
                                        _this$props6.formatShortWeekday,
                                    onClickWeekNumber =
                                        _this$props6.onClickWeekNumber,
                                    showDoubleView =
                                        _this$props6.showDoubleView,
                                    showFixedNumberOfWeeks =
                                        _this$props6.showFixedNumberOfWeeks,
                                    showNeighboringMonth =
                                        _this$props6.showNeighboringMonth,
                                    showWeekNumbers =
                                        _this$props6.showWeekNumbers,
                                    onMouseLeave = this.onMouseLeave;
                                return React.createElement(
                                    MonthView,
                                    _extends(
                                        {
                                            calendarType: calendarType,
                                            formatDay: formatDay,
                                            formatLongDate: formatLongDate,
                                            formatShortWeekday:
                                                formatShortWeekday,
                                            onClickWeekNumber:
                                                onClickWeekNumber,
                                            onMouseLeave: selectRange
                                                ? onMouseLeave
                                                : null,
                                            showFixedNumberOfWeeks:
                                                showFixedNumberOfWeeks ||
                                                showDoubleView,
                                            showNeighboringMonth:
                                                showNeighboringMonth,
                                            showWeekNumbers: showWeekNumbers,
                                        },
                                        commonProps
                                    )
                                );
                            default:
                                throw new Error(
                                    "Invalid view: ".concat(
                                        view,
                                        "."
                                    )
                                );
                            }
                        },
                    },
                    {
                        key: "renderNavigation",
                        value: function (
                        ) {
                            if (!this.props.showNavigation) return null;
                            var activeStartDate = this.activeStartDate,
                                view = this.view,
                                views = this.views,
                                _this$props7 = this.props,
                                formatMonthYear = _this$props7.formatMonthYear,
                                formatYear = _this$props7.formatYear,
                                locale = _this$props7.locale,
                                maxDate = _this$props7.maxDate,
                                minDate = _this$props7.minDate,
                                navigationAriaLabel =
                                _this$props7.navigationAriaLabel,
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
                            return React.createElement(
                                Navigation,
                                {
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
                                }
                            );
                        },
                    },
                    {
                        key: "render",
                        value: function (
                        ) {
                            var _this$props8 = this.props,
                                className = _this$props8.className,
                                inputRef = _this$props8.inputRef,
                                selectRange = _this$props8.selectRange,
                                showDoubleView = _this$props8.showDoubleView,
                                onMouseLeave = this.onMouseLeave,
                                value = this.value,
                                valueArray = [].concat(
                                    value
                                );
                            return React.createElement(
                                "div",
                                {
                                    className: mergeClassNames(
                                        baseClassName,
                                        selectRange &&
                                        1 === valueArray.length &&
                                        "".concat(
                                            baseClassName,
                                            "--selectRange"
                                        ),
                                        showDoubleView &&
                                        "".concat(
                                            baseClassName,
                                            "--doubleView"
                                        ),
                                        className
                                    ),
                                    ref: inputRef,
                                },
                                this.renderNavigation(
                                ),
                                React.createElement(
                                    "div",
                                    {
                                        className: "".concat(
                                            baseClassName,
                                            "__viewContainer"
                                        ),
                                        onBlur: selectRange ? onMouseLeave : null,
                                        onMouseLeave: selectRange
                                            ? onMouseLeave
                                            : null,
                                    },
                                    this.renderContent(
                                    ),
                                    showDoubleView && this.renderContent(
                                        !0
                                    )
                                )
                            );
                        },
                    },
                    {
                        key: "activeStartDate",
                        get: function (
                        ) {
                            var activeStartDateProps = this.props.activeStartDate,
                                activeStartDateState = this.state.activeStartDate;
                            return (
                                activeStartDateProps ||
                            activeStartDateState ||
                            getInitialActiveStartDate(
                                this.props
                            )
                            );
                        },
                    },
                    {
                        key: "value",
                        get: function (
                        ) {
                            var _this$props9 = this.props,
                                selectRange = _this$props9.selectRange,
                                valueProps = _this$props9.value,
                                valueState = this.state.value;
                            return selectRange && getIsSingleValue(
                                valueState
                            )
                                ? valueState
                                : void 0 !== valueProps
                                    ? valueProps
                                    : valueState;
                        },
                    },
                    {
                        key: "valueType",
                        get: function (
                        ) {
                            return getValueType(
                                this.props.maxDetail
                            );
                        },
                    },
                    {
                        key: "view",
                        get: function (
                        ) {
                            var _this$props10 = this.props,
                                minDetail = _this$props10.minDetail,
                                maxDetail = _this$props10.maxDetail,
                                viewProps = _this$props10.view,
                                viewState = this.state.view;
                            return getView(
                                viewProps || viewState,
                                minDetail,
                                maxDetail
                            );
                        },
                    },
                    {
                        key: "views",
                        get: function (
                        ) {
                            var _this$props11 = this.props;
                            return getLimitedViews(
                                _this$props11.minDetail,
                                _this$props11.maxDetail
                            );
                        },
                    },
                    {
                        key: "hover",
                        get: function (
                        ) {
                            var selectRange = this.props.selectRange,
                                hover = this.state.hover;
                            return selectRange ? hover : null;
                        },
                    },
                    {
                        key: "drillDownAvailable",
                        get: function (
                        ) {
                            var view = this.view,
                                views = this.views;
                            return views.indexOf(
                                view
                            ) < views.length - 1;
                        },
                    },
                    {
                        key: "drillUpAvailable",
                        get: function (
                        ) {
                            var view = this.view;
                            return this.views.indexOf(
                                view
                            ) > 0;
                        },
                    },
                ]
            ),
            Calendar
        );
    })(
    );
Calendar.defaultProps = {
    maxDate: defaultMaxDate,
    maxDetail: "month",
    minDate: defaultMinDate,
    minDetail: "century",
    returnValue: "start",
    showNavigation: !0,
    showNeighboringMonth: !0,
};
var isActiveStartDate = PropTypes.instanceOf(
        Date
    ),
    isLooseValue = PropTypes.oneOfType(
        [PropTypes.string, isValue,]
    );
function CompatDemo(
) {
    const [value, onChange,] = l$2(
        new Date(
        )
    );
    return m$1`<${Calendar} onChange=${onChange} showWeekNumbers value=${value}/>`;
}
(Calendar.propTypes = {
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
    maxDetail: PropTypes.oneOf(
        allViews
    ),
    minDate: isMinDate,
    minDetail: PropTypes.oneOf(
        allViews
    ),
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
    returnValue: PropTypes.oneOf(
        ["start", "end", "range",]
    ),
    selectRange: PropTypes.bool,
    showDoubleView: PropTypes.bool,
    showFixedNumberOfWeeks: PropTypes.bool,
    showNavigation: PropTypes.bool,
    showNeighboringMonth: PropTypes.bool,
    showWeekNumbers: PropTypes.bool,
    tileClassName: PropTypes.oneOfType(
        [PropTypes.func, isClassName,]
    ),
    tileContent: PropTypes.oneOfType(
        [PropTypes.func, PropTypes.node,]
    ),
    tileDisabled: PropTypes.func,
    value: isLooseValue,
    view: isView,
}),
style(
    "/assets/Calendar.4739c73f.css"
);
export default CompatDemo;
