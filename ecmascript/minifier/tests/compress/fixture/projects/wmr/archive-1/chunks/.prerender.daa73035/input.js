import {
    l as l$1, d as d$1, v as v$1, B,
} from "../index.f66dda46.js";
var r = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|^--/i,
    n = /[&<>"]/;
function o(
    e
) {
    var t = String(
        e
    );
    return n.test(
        t
    )
        ? t
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
        : t;
}
var a = function (
        e, t
    ) {
        return String(
            e
        ).replace(
            /(\n+)/g,
            "$1" + (t || "\t")
        );
    },
    i = function (
        e, t, r
    ) {
        return (
            String(
                e
            ).length > (t || 40) ||
            (!r && -1 !== String(
                e
            ).indexOf(
                "\n"
            )) ||
            -1 !== String(
                e
            ).indexOf(
                "<"
            )
        );
    },
    l = {
    };
function s(
    e
) {
    var t = "";
    for (var n in e) {
        var o = e[n];
        null != o &&
            "" !== o &&
            (t && (t += " "),
            (t +=
                "-" == n[0]
                    ? n
                    : l[n] ||
                      (l[n] = n.replace(
                          /([A-Z])/g,
                          "-$1"
                      ).toLowerCase(
                      ))),
            (t += ": "),
            (t += o),
            "number" == typeof o && !1 === r.test(
                n
            ) && (t += "px"),
            (t += ";"));
    }
    return t || void 0;
}
function f(
    e, t
) {
    for (var r in t) e[r] = t[r];
    return e;
}
function u(
    e, t
) {
    return (
        Array.isArray(
            t
        )
            ? t.reduce(
                u,
                e
            )
            : null != t && !1 !== t && e.push(
                t
            ),
        e
    );
}
var c = {
        shallow: !0,
    },
    p = [],
    _ =
        /^(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)$/,
    v = /[\s\n\\/='"\0<>]/,
    d = function (
    ) {};
m.render = m;
var g = function (
        e, t
    ) {
        return m(
            e,
            t,
            c
        );
    },
    h = [];
function m(
    t, r, n
) {
    (r = r || {
    }), (n = n || {
    });
    var o = l$1.__s;
    l$1.__s = !0;
    var a = x(
        t,
        r,
        n
    );
    return l$1.__c && l$1.__c(
        t,
        h
    ), (h.length = 0), (l$1.__s = o), a;
}
function x(
    r, n, l, c, g, h
) {
    if (null == r || "boolean" == typeof r) return "";
    if ("object" != typeof r) return o(
        r
    );
    var m = l.pretty,
        y = m && "string" == typeof m ? m : "\t";
    if (Array.isArray(
        r
    )) {
        for (var b = "", S = 0; S < r.length; S++)
            m && S > 0 && (b += "\n"), (b += x(
                r[S],
                n,
                l,
                c,
                g,
                h
            ));
        return b;
    }
    var w,
        k = r.type,
        O = r.props,
        C = !1;
    if ("function" == typeof k) {
        if (((C = !0), !l.shallow || (!c && !1 !== l.renderRootComponent))) {
            if (k === d$1) {
                var A = [];
                return (
                    u(
                        A,
                        r.props.children
                    ),
                    x(
                        A,
                        n,
                        l,
                        !1 !== l.shallowHighOrder,
                        g,
                        h
                    )
                );
            }
            var H,
                j = (r.__c = {
                    __v: r,
                    context: n,
                    props: r.props,
                    setState: d,
                    forceUpdate: d,
                    __h: [],
                });
            if (
                (l$1.__b && l$1.__b(
                    r
                ),
                l$1.__r && l$1.__r(
                    r
                ),
                k.prototype && "function" == typeof k.prototype.render)
            ) {
                var F = k.contextType,
                    M = F && n[F.__c],
                    T = null != F ? (M ? M.props.value : F.__) : n;
                ((j = r.__c = new k(
                    O,
                    T
                )).__v = r),
                (j._dirty = j.__d = !0),
                (j.props = O),
                null == j.state && (j.state = {
                }),
                null == j._nextState &&
                        null == j.__s &&
                        (j._nextState = j.__s = j.state),
                (j.context = T),
                k.getDerivedStateFromProps
                    ? (j.state = f(
                        f(
                            {
                            },
                            j.state
                        ),
                        k.getDerivedStateFromProps(
                            j.props,
                            j.state
                        )
                    ))
                    : j.componentWillMount &&
                          (j.componentWillMount(
                          ),
                          (j.state =
                              j._nextState !== j.state
                                  ? j._nextState
                                  : j.__s !== j.state
                                      ? j.__s
                                      : j.state)),
                (H = j.render(
                    j.props,
                    j.state,
                    j.context
                ));
            } else {
                var $ = k.contextType,
                    L = $ && n[$.__c];
                H = k.call(
                    r.__c,
                    O,
                    null != $ ? (L ? L.props.value : $.__) : n
                );
            }
            return (
                j.getChildContext && (n = f(
                    f(
                        {
                        },
                        n
                    ),
                    j.getChildContext(
                    )
                )),
                l$1.diffed && l$1.diffed(
                    r
                ),
                x(
                    H,
                    n,
                    l,
                    !1 !== l.shallowHighOrder,
                    g,
                    h
                )
            );
        }
        k =
            (w = k).displayName ||
            (w !== Function && w.name) ||
            (function (
                e
            ) {
                var t = (Function.prototype.toString
                    .call(
                        e
                    )
                    .match(
                        /^\s*function\s+([^( ]+)/
                    ) || "")[1];
                if (!t) {
                    for (var r = -1, n = p.length; n--; )
                        if (p[n] === e) {
                            r = n;
                            break;
                        }
                    r < 0 && (r = p.push(
                        e
                    ) - 1), (t = "UnnamedComponent" + r);
                }
                return t;
            })(
                w
            );
    }
    var E,
        D,
        N = "<" + k;
    if (O) {
        var P = Object.keys(
            O
        );
        l && !0 === l.sortAttributes && P.sort(
        );
        for (var R = 0; R < P.length; R++) {
            var U = P[R],
                W = O[U];
            if ("children" !== U) {
                if (
                    !v.test(
                        U
                    ) &&
                    ((l && l.allAttributes) ||
                        ("key" !== U &&
                            "ref" !== U &&
                            "__self" !== U &&
                            "__source" !== U &&
                            "defaultValue" !== U))
                ) {
                    if ("className" === U) {
                        if (O.class) continue;
                        U = "class";
                    } else
                        g &&
                            U.match(
                                /^xlink:?./
                            ) &&
                            (U = U.toLowerCase(
                            ).replace(
                                /^xlink:?/,
                                "xlink:"
                            ));
                    if ("htmlFor" === U) {
                        if (O.for) continue;
                        U = "for";
                    }
                    "style" === U && W && "object" == typeof W && (W = s(
                        W
                    )),
                    "a" === U[0] &&
                            "r" === U[1] &&
                            "boolean" == typeof W &&
                            (W = String(
                                W
                            ));
                    var q = l.attributeHook && l.attributeHook(
                        U,
                        W,
                        n,
                        l,
                        C
                    );
                    if (q || "" === q) N += q;
                    else if ("dangerouslySetInnerHTML" === U) D = W && W.__html;
                    else if ("textarea" === k && "value" === U) E = W;
                    else if (
                        (W || 0 === W || "" === W) &&
                        "function" != typeof W
                    ) {
                        if (
                            !((!0 !== W && "" !== W) || ((W = U), l && l.xml))
                        ) {
                            N += " " + U;
                            continue;
                        }
                        if ("value" === U) {
                            if ("select" === k) {
                                h = W;
                                continue;
                            }
                            "option" === k && h == W && (N += " selected");
                        }
                        N += " " + U + '="' + o(
                            W
                        ) + '"';
                    }
                }
            } else E = W;
        }
    }
    if (m) {
        var z = N.replace(
            /\n\s*/,
            " "
        );
        z === N || ~z.indexOf(
            "\n"
        )
            ? m && ~N.indexOf(
                "\n"
            ) && (N += "\n")
            : (N = z);
    }
    if (((N += ">"), v.test(
        k
    )))
        throw new Error(
            k + " is not a valid HTML tag name in " + N
        );
    var I,
        V = _.test(
            k
        ) || (l.voidElements && l.voidElements.test(
            k
        )),
        Z = [];
    if (D) m && i(
        D
    ) && (D = "\n" + y + a(
        D,
        y
    )), (N += D);
    else if (null != E && u(
        (I = []),
        E
    ).length) {
        for (var B = m && ~N.indexOf(
                "\n"
            ), G = !1, J = 0; J < I.length; J++) {
            var K = I[J];
            if (null != K && !1 !== K) {
                var Q = x(
                    K,
                    n,
                    l,
                    !0,
                    "svg" === k || ("foreignObject" !== k && g),
                    h
                );
                if ((m && !B && i(
                    Q
                ) && (B = !0), Q))
                    if (m) {
                        var X = Q.length > 0 && "<" != Q[0];
                        G && X
                            ? (Z[Z.length - 1] += Q)
                            : Z.push(
                                Q
                            ), (G = X);
                    } else Z.push(
                        Q
                    );
            }
        }
        if (m && B) for (var Y = Z.length; Y--; ) Z[Y] = "\n" + y + a(
            Z[Y],
            y
        );
    }
    if (Z.length || D) N += Z.join(
        ""
    );
    else if (l && l.xml) return N.substring(
        0,
        N.length - 1
    ) + " />";
    return (
        !V || I || D
            ? (m && ~N.indexOf(
                "\n"
            ) && (N += "\n"), (N += "</" + k + ">"))
            : (N = N.replace(
                />$/,
                " />"
            )),
        N
    );
}
m.shallowRender = g;
let vnodeHook;

const old = l$1.vnode;
l$1.vnode = (
    vnode
) => {
    if (old) old(
        vnode
    );
    if (vnodeHook) vnodeHook(
        vnode
    );
};

/**
 * @param {ReturnType<h>} vnode The root JSX element to render (eg: `<App />`)
 * @param {object} [options]
 * @param {number} [options.maxDepth = 10] The maximum number of nested asynchronous operations to wait for before flushing
 * @param {object} [options.props] Additional props to merge into the root JSX element
 */
async function prerender(
    vnode, options
) {
    options = options || {
    };

    const maxDepth = options.maxDepth || 10;
    const props = options.props;
    let tries = 0;

    if (typeof vnode === "function") {
        vnode = v$1(
            vnode,
            props
        );
    } else if (props) {
        vnode = B(
            vnode,
            props
        );
    }

    const render = (
    ) => {
        if (++tries > maxDepth) return;
        try {
            return m(
                vnode
            );
        } catch (e) {
            if (e && e.then) return e.then(
                render
            );
            throw e;
        }
    };

    let links = new Set(
    );
    vnodeHook = (
        {
            type, props,
        }
    ) => {
        if (
            type === "a" &&
            props &&
            props.href &&
            (!props.target || props.target === "_self")
        ) {
            links.add(
                props.href
            );
        }
    };

    try {
        const html = await render(
        );
        return {
            html,
            links,
        };
    } finally {
        vnodeHook = null;
    }
}
export default prerender;
