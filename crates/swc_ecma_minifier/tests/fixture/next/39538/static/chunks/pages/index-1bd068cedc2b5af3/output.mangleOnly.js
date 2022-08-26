(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
    [
        405
    ],
    {
        1412: (function(e, t) {
            "use strict";
            var r;
            r = ({
                value: true
            });
            t.Z = i;
            function i(e, t, r) {
                if (t in e) {
                    Object.defineProperty(e, t, {
                        value: r,
                        enumerable: true,
                        configurable: true,
                        writable: true
                    });
                } else {
                    e[t] = r;
                }
                return e;
            }
        }),
        5702: (function(e, t, r) {
            (window.__NEXT_P = window.__NEXT_P || []).push([
                "/",
                function() {
                    return r(1107);
                }
            ]);
            if (false) {}
        }),
        9838: (function(e, t, r) {
            "use strict";
            Object.defineProperty(t, "__esModule", ({
                value: true
            }));
            var i = (r(1412).Z);
            var n = (r(8693).Z);
            var a = (r(9947).Z);
            Object.defineProperty(t, "__esModule", ({
                value: true
            }));
            t["default"] = h;
            var o = (r(2769).Z);
            var l = (r(4507).Z);
            var s = (r(8167).Z);
            var c = (r(4719).Z);
            var u = s(r(959));
            var d = l(r(4357));
            var f = r(1773);
            var v = r(757);
            var g = r(9664);
            var m = r(8827);
            var p = r(8236);
            function h(e) {
                var t = e.src, r = e.sizes, l = e.unoptimized, s = l === void 0 ? false : l, m = e.priority, p = m === void 0 ? false : m, h = e.loading, $ = e.lazyRoot, y = $ === void 0 ? null : $, b = e.lazyBoundary, j = e.className, z = e.quality, A = e.width, k = e.height, N = e.style, I = e.objectFit, R = e.objectPosition, H = e.onLoadingComplete, D = e.placeholder, W = D === void 0 ? "empty" : D, B = e.blurDataURL, V = c(e, [
                    "src",
                    "sizes",
                    "unoptimized",
                    "priority",
                    "loading",
                    "lazyRoot",
                    "lazyBoundary",
                    "className",
                    "quality",
                    "width",
                    "height",
                    "style",
                    "objectFit",
                    "objectPosition",
                    "onLoadingComplete",
                    "placeholder",
                    "blurDataURL"
                ]);
                var Z = (0, u).useContext(g.ImageConfigContext);
                var G = (0, u).useMemo(function() {
                    var e = w || Z || f.imageConfigDefault;
                    var t = a(e.deviceSizes).concat(a(e.imageSizes)).sort(function(e, t) {
                        return e - t;
                    });
                    var r = e.deviceSizes.sort(function(e, t) {
                        return e - t;
                    });
                    return o({}, e, {
                        allSizes: t,
                        deviceSizes: r
                    });
                }, [
                    Z
                ]);
                var T = V;
                var F = r ? "responsive" : "intrinsic";
                if ("layout" in T) {
                    if (T.layout) F = T.layout;
                    delete T.layout;
                }
                var O = q;
                if ("loader" in T) {
                    if (T.loader) {
                        var U = T.loader;
                        var Q;
                        Q = function(e) {
                            var t = e.config, r = c(e, [
                                "config"
                            ]);
                            return U(r);
                        }, O = Q, Q;
                    }
                    delete T.loader;
                }
                var X = "";
                if (L(t)) {
                    var K = E(t) ? t.default : t;
                    if (!K.src) {
                        throw new Error("An object should only be passed to the image component src parameter if it comes from a static image import. It must include src. Received ".concat(JSON.stringify(K)));
                    }
                    B = B || K.blurDataURL;
                    X = K.src;
                    if (!F || F !== "fill") {
                        k = k || K.height;
                        A = A || K.width;
                        if (!K.height || !K.width) {
                            throw new Error("An object should only be passed to the image component src parameter if it comes from a static image import. It must include height and width. Received ".concat(JSON.stringify(K)));
                        }
                    }
                }
                t = typeof t === "string" ? t : X;
                var Y = !p && (h === "lazy" || typeof h === "undefined");
                if (t.startsWith("data:") || t.startsWith("blob:")) {
                    s = true;
                    Y = false;
                }
                if (true && _.has(t)) {
                    Y = false;
                }
                if (x) {
                    s = true;
                }
                var J = n((0, u).useState(false), 2), ee = J[0], et = J[1];
                var er = n((0, v).useIntersection({
                    rootRef: y,
                    rootMargin: b || "200px",
                    disabled: !Y
                }), 3), ei = er[0], en = er[1], ea = er[2];
                var eo = !Y || en;
                var el = {
                    boxSizing: "border-box",
                    display: "block",
                    overflow: "hidden",
                    width: "initial",
                    height: "initial",
                    background: "none",
                    opacity: 1,
                    border: 0,
                    margin: 0,
                    padding: 0
                };
                var es = {
                    boxSizing: "border-box",
                    display: "block",
                    width: "initial",
                    height: "initial",
                    background: "none",
                    opacity: 1,
                    border: 0,
                    margin: 0,
                    padding: 0
                };
                var ec = false;
                var eu;
                var ed = {
                    position: "absolute",
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    boxSizing: "border-box",
                    padding: 0,
                    border: "none",
                    margin: "auto",
                    display: "block",
                    width: 0,
                    height: 0,
                    minWidth: "100%",
                    maxWidth: "100%",
                    minHeight: "100%",
                    maxHeight: "100%",
                    objectFit: I,
                    objectPosition: R
                };
                var ef = P(A);
                var ev = P(k);
                var eg = P(z);
                if (false) {
                    var em, ep, eh, e$;
                }
                var ey = Object.assign({}, N, ed);
                var eb = W === "blur" && !ee ? {
                    backgroundSize: I || "cover",
                    backgroundPosition: R || "0% 0%",
                    filter: "blur(20px)",
                    backgroundImage: 'url("'.concat(B, '")')
                } : {};
                if (F === "fill") {
                    el.display = "block";
                    el.position = "absolute";
                    el.top = 0;
                    el.left = 0;
                    el.bottom = 0;
                    el.right = 0;
                } else if (typeof ef !== "undefined" && typeof ev !== "undefined") {
                    var ex = ev / ef;
                    var ew = isNaN(ex) ? "100%" : "".concat(ex * 100, "%");
                    if (F === "responsive") {
                        el.display = "block";
                        el.position = "relative";
                        ec = true;
                        es.paddingTop = ew;
                    } else if (F === "intrinsic") {
                        el.display = "inline-block";
                        el.position = "relative";
                        el.maxWidth = "100%";
                        ec = true;
                        es.maxWidth = "100%";
                        eu = "data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20version=%271.1%27%20width=%27".concat(ef, "%27%20height=%27").concat(ev, "%27/%3e");
                    } else if (F === "fixed") {
                        el.display = "inline-block";
                        el.position = "relative";
                        el.width = ef;
                        el.height = ev;
                    }
                } else {
                    if (false) {}
                }
                var e8 = {
                    src: S,
                    srcSet: undefined,
                    sizes: undefined
                };
                if (eo) {
                    e8 = C({
                        config: G,
                        src: t,
                        unoptimized: s,
                        layout: F,
                        width: ef,
                        quality: eg,
                        sizes: r,
                        loader: O
                    });
                }
                var e_ = t;
                if (false) {
                    var ej;
                }
                var e0 = "imagesrcset";
                var ez = "imagesizes";
                if (true) {
                    e0 = "imageSrcSet";
                    ez = "imageSizes";
                }
                var eS;
                var eA = (eS = {}, i(eS, e0, e8.srcSet), i(eS, ez, e8.sizes), eS);
                var e5 = false ? 0 : u.default.useLayoutEffect;
                var ek = (0, u).useRef(H);
                var e6 = (0, u).useRef(t);
                (0, u).useEffect(function() {
                    ek.current = H;
                }, [
                    H
                ]);
                e5(function() {
                    if (e6.current !== t) {
                        ea();
                        e6.current = t;
                    }
                }, [
                    ea,
                    t
                ]);
                var eN = o({
                    isLazy: Y,
                    imgAttributes: e8,
                    heightInt: ev,
                    widthInt: ef,
                    qualityInt: eg,
                    layout: F,
                    className: j,
                    imgStyle: ey,
                    blurStyle: eb,
                    loading: h,
                    config: G,
                    unoptimized: s,
                    placeholder: W,
                    loader: O,
                    srcString: e_,
                    onLoadingCompleteRef: ek,
                    setBlurComplete: et,
                    setIntersection: ei,
                    isVisible: eo,
                    noscriptSizes: r
                }, T);
                return u.default.createElement(u.default.Fragment, null, u.default.createElement("span", {
                    style: el
                }, ec ? u.default.createElement("span", {
                    style: es
                }, eu ? u.default.createElement("img", {
                    style: {
                        display: "block",
                        maxWidth: "100%",
                        width: "initial",
                        height: "initial",
                        background: "none",
                        opacity: 1,
                        border: 0,
                        margin: 0,
                        padding: 0
                    },
                    alt: "",
                    "aria-hidden": true,
                    src: eu
                }) : null) : null, u.default.createElement(M, Object.assign({}, eN))), p ? u.default.createElement(d.default, null, u.default.createElement("link", Object.assign({
                    key: "__nimg-" + e8.src + e8.srcSet + e8.sizes,
                    rel: "preload",
                    as: "image",
                    href: e8.srcSet ? undefined : e8.src
                }, eA))) : null);
            }
            var $ = {
                "deviceSizes": [
                    640,
                    750,
                    828,
                    1080,
                    1200,
                    1920,
                    2048,
                    3840
                ],
                "imageSizes": [
                    16,
                    32,
                    48,
                    64,
                    96,
                    128,
                    256,
                    384
                ],
                "path": "/_next/image",
                "loader": "default",
                "dangerouslyAllowSVG": false
            } || {}, y = $.experimentalRemotePatterns, b = y === void 0 ? [] : y, x = $.experimentalUnoptimized;
            var w = {
                "deviceSizes": [
                    640,
                    750,
                    828,
                    1080,
                    1200,
                    1920,
                    2048,
                    3840
                ],
                "imageSizes": [
                    16,
                    32,
                    48,
                    64,
                    96,
                    128,
                    256,
                    384
                ],
                "path": "/_next/image",
                "loader": "default",
                "dangerouslyAllowSVG": false
            };
            var _ = new Set();
            var j = new Map();
            var z;
            var S = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
            if (false) {}
            var A = (null && ([
                "lazy",
                "eager",
                undefined
            ]));
            var k = new Map([
                [
                    "default",
                    G
                ],
                [
                    "imgix",
                    W
                ],
                [
                    "cloudinary",
                    V
                ],
                [
                    "akamai",
                    B
                ],
                [
                    "custom",
                    Z
                ], 
            ]);
            var N = (null && ([
                "fill",
                "fixed",
                "intrinsic",
                "responsive",
                undefined, 
            ]));
            function E(e) {
                return e.default !== undefined;
            }
            function I(e) {
                return e.src !== undefined;
            }
            function L(e) {
                return typeof e === "object" && (E(e) || I(e));
            }
            function R(e, t, r, i) {
                var n = e.deviceSizes, o = e.allSizes;
                if (i && (r === "fill" || r === "responsive")) {
                    var l = /(^|\s)(1?\d?\d)vw/g;
                    var s = [];
                    for(var c; c = l.exec(i); c){
                        s.push(parseInt(c[2]));
                    }
                    if (s.length) {
                        var u;
                        var d = (u = Math).min.apply(u, a(s)) * 0.01;
                        return {
                            widths: o.filter(function(e) {
                                return e >= n[0] * d;
                            }),
                            kind: "w"
                        };
                    }
                    return {
                        widths: o,
                        kind: "w"
                    };
                }
                if (typeof t !== "number" || r === "fill" || r === "responsive") {
                    return {
                        widths: n,
                        kind: "w"
                    };
                }
                var f = a(new Set([
                    t,
                    t * 2
                ].map(function(e) {
                    return o.find(function(t) {
                        return t >= e;
                    }) || o[o.length - 1];
                })));
                return {
                    widths: f,
                    kind: "x"
                };
            }
            function C(e) {
                var t = e.config, r = e.src, i = e.unoptimized, n = e.layout, a = e.width, o = e.quality, l = e.sizes, s = e.loader;
                if (i) {
                    return {
                        src: r,
                        srcSet: undefined,
                        sizes: undefined
                    };
                }
                var c = R(t, a, n, l), u = c.widths, d = c.kind;
                var f = u.length - 1;
                return {
                    sizes: !l && d === "w" ? "100vw" : l,
                    srcSet: u.map(function(e, i) {
                        return "".concat(s({
                            config: t,
                            src: r,
                            quality: o,
                            width: e
                        }), " ").concat(d === "w" ? e : i + 1).concat(d);
                    }).join(", "),
                    src: s({
                        config: t,
                        src: r,
                        quality: o,
                        width: u[f]
                    })
                };
            }
            function P(e) {
                if (typeof e === "number") {
                    return e;
                }
                if (typeof e === "string") {
                    return parseInt(e, 10);
                }
                return undefined;
            }
            function q(e) {
                var t;
                var r = ((t = e.config) == null ? void 0 : t.loader) || "default";
                var i = k.get(r);
                if (i) {
                    return i(e);
                }
                throw new Error('Unknown "loader" found in "next.config.js". Expected: '.concat(f.VALID_LOADERS.join(", "), ". Received: ").concat(r));
            }
            function H(e, t, r, i, n, a) {
                if (!e || e.src === S || e["data-loaded-src"] === t) {
                    return;
                }
                e["data-loaded-src"] = t;
                var o = "decode" in e ? e.decode() : Promise.resolve();
                o.catch(function() {}).then(function() {
                    if (!e.parentNode) {
                        return;
                    }
                    _.add(t);
                    if (i === "blur") {
                        a(true);
                    }
                    if (n == null ? void 0 : n.current) {
                        var r = e.naturalWidth, o = e.naturalHeight;
                        n.current({
                            naturalWidth: r,
                            naturalHeight: o
                        });
                    }
                    if (false) {
                        var l, s;
                    }
                });
            }
            var M = function(e) {
                var t = e.imgAttributes, r = e.heightInt, i = e.widthInt, n = e.qualityInt, a = e.layout, l = e.className, s = e.imgStyle, d = e.blurStyle, f = e.isLazy, v = e.placeholder, g = e.loading, m = e.srcString, p = e.config, h = e.unoptimized, $ = e.loader, y = e.onLoadingCompleteRef, b = e.setBlurComplete, x = e.setIntersection, w = e.onLoad, _ = e.onError, j = e.isVisible, z = e.noscriptSizes, S = c(e, [
                    "imgAttributes",
                    "heightInt",
                    "widthInt",
                    "qualityInt",
                    "layout",
                    "className",
                    "imgStyle",
                    "blurStyle",
                    "isLazy",
                    "placeholder",
                    "loading",
                    "srcString",
                    "config",
                    "unoptimized",
                    "loader",
                    "onLoadingCompleteRef",
                    "setBlurComplete",
                    "setIntersection",
                    "onLoad",
                    "onError",
                    "isVisible",
                    "noscriptSizes"
                ]);
                g = f ? "lazy" : g;
                return u.default.createElement(u.default.Fragment, null, u.default.createElement("img", Object.assign({}, S, t, {
                    decoding: "async",
                    "data-nimg": a,
                    className: l,
                    style: o({}, s, d),
                    ref: (0, u).useCallback(function(e) {
                        if (false) {}
                        x(e);
                        if (e == null ? void 0 : e.complete) {
                            H(e, m, a, v, y, b);
                        }
                    }, [
                        x,
                        m,
                        a,
                        v,
                        y,
                        b, 
                    ]),
                    onLoad: function(e) {
                        var t = e.currentTarget;
                        H(t, m, a, v, y, b);
                        if (w) {
                            w(e);
                        }
                    },
                    onError: function(e) {
                        if (v === "blur") {
                            b(true);
                        }
                        if (_) {
                            _(e);
                        }
                    }
                })), (f || v === "blur") && u.default.createElement("noscript", null, u.default.createElement("img", Object.assign({}, S, C({
                    config: p,
                    src: m,
                    unoptimized: h,
                    layout: a,
                    width: i,
                    quality: n,
                    sizes: z,
                    loader: $
                }), {
                    decoding: "async",
                    "data-nimg": a,
                    style: s,
                    className: l,
                    loading: g
                }))));
            };
            function D(e) {
                return e[0] === "/" ? e.slice(1) : e;
            }
            function W(e) {
                var t = e.config, r = e.src, i = e.width, n = e.quality;
                var a = new URL("".concat(t.path).concat(D(r)));
                var o = a.searchParams;
                o.set("auto", o.getAll("auto").join(",") || "format");
                o.set("fit", o.get("fit") || "max");
                o.set("w", o.get("w") || i.toString());
                if (n) {
                    o.set("q", n.toString());
                }
                return a.href;
            }
            function B(e) {
                var t = e.config, r = e.src, i = e.width;
                return "".concat(t.path).concat(D(r), "?imwidth=").concat(i);
            }
            function V(e) {
                var t = e.config, r = e.src, i = e.width, n = e.quality;
                var a = [
                    "f_auto",
                    "c_limit",
                    "w_" + i,
                    "q_" + (n || "auto")
                ];
                var o = a.join(",") + "/";
                return "".concat(t.path).concat(o).concat(D(r));
            }
            function Z(e) {
                var t = e.src;
                throw new Error('Image with src "'.concat(t, '" is missing "loader" prop.') + "\nRead more: https://nextjs.org/docs/messages/next-image-missing-loader");
            }
            function G(e) {
                var t = e.config, r = e.src, i = e.width, n = e.quality;
                if (false) {
                    var a, o, l;
                }
                if (r.endsWith(".svg") && !t.dangerouslyAllowSVG) {
                    return r;
                }
                return "".concat((0, p).normalizePathTrailingSlash(t.path), "?url=").concat(encodeURIComponent(r), "&w=").concat(i, "&q=").concat(n || 75);
            }
            if ((typeof t.default === "function" || typeof t.default === "object" && t.default !== null) && typeof t.default.__esModule === "undefined") {
                Object.defineProperty(t.default, "__esModule", {
                    value: true
                });
                Object.assign(t.default, t);
                e.exports = t.default;
            }
        }),
        757: (function(e, t, r) {
            "use strict";
            Object.defineProperty(t, "__esModule", ({
                value: true
            }));
            var i = (r(8693).Z);
            Object.defineProperty(t, "__esModule", ({
                value: true
            }));
            t.useIntersection = l;
            var n = r(959);
            var a = r(6501);
            var o = typeof IntersectionObserver === "function";
            function l(e) {
                var t = e.rootRef, r = e.rootMargin, l = e.disabled;
                var s = l || !o;
                var c = (0, n).useRef();
                var d = i((0, n).useState(false), 2), f = d[0], v = d[1];
                var g = i((0, n).useState(null), 2), m = g[0], p = g[1];
                (0, n).useEffect(function() {
                    if (o) {
                        if (c.current) {
                            c.current();
                            c.current = undefined;
                        }
                        if (s || f) return;
                        if (m && m.tagName) {
                            c.current = u(m, function(e) {
                                return e && v(e);
                            }, {
                                root: t == null ? void 0 : t.current,
                                rootMargin: r
                            });
                        }
                        return function() {
                            c.current == null ? void 0 : c.current();
                            c.current = undefined;
                        };
                    } else {
                        if (!f) {
                            var e = (0, a).requestIdleCallback(function() {
                                return v(true);
                            });
                            return function() {
                                return (0, a).cancelIdleCallback(e);
                            };
                        }
                    }
                }, [
                    m,
                    s,
                    r,
                    t,
                    f
                ]);
                var h = (0, n).useCallback(function() {
                    v(false);
                }, []);
                return [
                    p,
                    f,
                    h
                ];
            }
            var s = new Map();
            var c = [];
            function u(e, t, r) {
                var i = d(r), n = i.id, a = i.observer, o = i.elements;
                o.set(e, t);
                a.observe(e);
                return function t() {
                    o.delete(e);
                    a.unobserve(e);
                    if (o.size === 0) {
                        a.disconnect();
                        s.delete(n);
                        var r = c.findIndex(function(e) {
                            return e.root === n.root && e.margin === n.margin;
                        });
                        if (r > -1) {
                            c.splice(r, 1);
                        }
                    }
                };
            }
            function d(e) {
                var t = {
                    root: e.root || null,
                    margin: e.rootMargin || ""
                };
                var r = c.find(function(e) {
                    return e.root === t.root && e.margin === t.margin;
                });
                var i;
                if (r) {
                    i = s.get(r);
                    if (i) {
                        return i;
                    }
                }
                var n = new Map();
                var a = new IntersectionObserver(function(e) {
                    e.forEach(function(e) {
                        var t = n.get(e.target);
                        var r = e.isIntersecting || e.intersectionRatio > 0;
                        if (t && r) {
                            t(r);
                        }
                    });
                }, e);
                i = {
                    id: t,
                    observer: a,
                    elements: n
                };
                c.push(t);
                s.set(t, i);
                return i;
            }
            if ((typeof t.default === "function" || typeof t.default === "object" && t.default !== null) && typeof t.default.__esModule === "undefined") {
                Object.defineProperty(t.default, "__esModule", {
                    value: true
                });
                Object.assign(t.default, t);
                e.exports = t.default;
            }
        }),
        1107: (function(e, t, r) {
            "use strict";
            r.r(t);
            r.d(t, {
                "default": function() {
                    return g;
                }
            });
            var i = r(1527);
            var n = r(6224);
            var a = r.n(n);
            var o = r(8206);
            var l = r.n(o);
            var s = r(959);
            var c = r(9915);
            var u = r.n(c);
            ;
            var d = 40;
            var f = function() {
                new Image(d, d).src = "/vercel.svg";
            };
            ;
            var v = function() {
                (0, s.useEffect)(function() {
                    console.log(d);
                    f();
                }, []);
                return (0, i.jsxs)("div", {
                    className: (u()).container,
                    children: [
                        (0, i.jsxs)((a()), {
                            children: [
                                (0, i.jsx)("title", {
                                    children: "Create Next App"
                                }),
                                (0, i.jsx)("meta", {
                                    name: "description",
                                    content: "Generated by create next app"
                                }),
                                (0, i.jsx)("link", {
                                    rel: "icon",
                                    href: "/favicon.ico"
                                })
                            ]
                        }),
                        (0, i.jsxs)("main", {
                            className: (u()).main,
                            children: [
                                (0, i.jsxs)("h1", {
                                    className: (u()).title,
                                    children: [
                                        "Welcome to ",
                                        (0, i.jsx)("a", {
                                            href: "https://nextjs.org",
                                            children: "Next.js!"
                                        })
                                    ]
                                }),
                                (0, i.jsxs)("p", {
                                    className: (u()).description,
                                    children: [
                                        "Get started by editing",
                                        " ",
                                        (0, i.jsx)("code", {
                                            className: (u()).code,
                                            children: "pages/index.tsx"
                                        })
                                    ]
                                }),
                                (0, i.jsxs)("div", {
                                    className: (u()).grid,
                                    children: [
                                        (0, i.jsxs)("a", {
                                            href: "https://nextjs.org/docs",
                                            className: (u()).card,
                                            children: [
                                                (0, i.jsx)("h2", {
                                                    children: "Documentation →"
                                                }),
                                                (0, i.jsx)("p", {
                                                    children: "Find in-depth information about Next.js features and API."
                                                })
                                            ]
                                        }),
                                        (0, i.jsxs)("a", {
                                            href: "https://nextjs.org/learn",
                                            className: (u()).card,
                                            children: [
                                                (0, i.jsx)("h2", {
                                                    children: "Learn →"
                                                }),
                                                (0, i.jsx)("p", {
                                                    children: "Learn about Next.js in an interactive course with quizzes!"
                                                })
                                            ]
                                        }),
                                        (0, i.jsxs)("a", {
                                            href: "https://github.com/vercel/next.js/tree/canary/examples",
                                            className: (u()).card,
                                            children: [
                                                (0, i.jsx)("h2", {
                                                    children: "Examples →"
                                                }),
                                                (0, i.jsx)("p", {
                                                    children: "Discover and deploy boilerplate example Next.js projects."
                                                })
                                            ]
                                        }),
                                        (0, i.jsxs)("a", {
                                            href: "https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app",
                                            className: (u()).card,
                                            children: [
                                                (0, i.jsx)("h2", {
                                                    children: "Deploy →"
                                                }),
                                                (0, i.jsx)("p", {
                                                    children: "Instantly deploy your Next.js site to a public URL with Vercel."
                                                })
                                            ]
                                        })
                                    ]
                                })
                            ]
                        }),
                        (0, i.jsx)("footer", {
                            className: (u()).footer,
                            children: (0, i.jsxs)("a", {
                                href: "https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app",
                                target: "_blank",
                                rel: "noopener noreferrer",
                                children: [
                                    "Powered by",
                                    " ",
                                    (0, i.jsx)("span", {
                                        className: (u()).logo,
                                        children: (0, i.jsx)((l()), {
                                            src: "/vercel.svg",
                                            alt: "Vercel Logo",
                                            width: 72,
                                            height: 16
                                        })
                                    })
                                ]
                            })
                        })
                    ]
                });
            };
            var g = (v);
        }),
        9915: (function(e) {
            e.exports = {
                "container": "Home_container__bCOhY",
                "main": "Home_main__nLjiQ",
                "footer": "Home_footer____T7K",
                "title": "Home_title__T09hD",
                "description": "Home_description__41Owk",
                "code": "Home_code__suPER",
                "grid": "Home_grid__GxQ85",
                "card": "Home_card___LpL1",
                "logo": "Home_logo__27_tb"
            };
        }),
        6224: (function(e, t, r) {
            e.exports = r(4357);
        }),
        8206: (function(e, t, r) {
            e.exports = r(9838);
        })
    },
    function(e) {
        var t = function(t) {
            return e(e.s = t);
        };
        e.O(0, [
            774,
            888,
            179
        ], function() {
            return t(5702);
        });
        var r = e.O();
        _N_E = r;
    }
]);
