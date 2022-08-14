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
            t.Z = n;
            function n(e, t, r) {
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
            var n = (r(1412).Z);
            var a = (r(8693).Z);
            var i = (r(9947).Z);
            Object.defineProperty(t, "__esModule", ({
                value: true
            }));
            t["default"] = p;
            var o = (r(2769).Z);
            var l = (r(4507).Z);
            var s = (r(8167).Z);
            var c = (r(4719).Z);
            var u = s(r(959));
            var f = l(r(4357));
            var d = r(1773);
            var v = r(757);
            var h = r(9664);
            var g = r(8827);
            var $ = r(8236);
            function p(e) {
                var t = e.src, r = e.sizes, l = e.unoptimized, s = l === void 0 ? false : l, g = e.priority, $ = g === void 0 ? false : g, p = e.loading, m = e.lazyRoot, y = m === void 0 ? null : m, w = e.lazyBoundary, z = e.className, S = e.quality, E = e.width, N = e.height, I = e.style, P = e.objectFit, R = e.objectPosition, Z = e.onLoadingComplete, M = e.placeholder, V = M === void 0 ? "empty" : M, D = e.blurDataURL, T = c(e, [
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
                var F = (0, u).useContext(h.ImageConfigContext);
                var H = (0, u).useMemo(function() {
                    var e = _ || F || d.imageConfigDefault;
                    var t = i(e.deviceSizes).concat(i(e.imageSizes)).sort(function(e, t) {
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
                    F
                ]);
                var B = T;
                var G = r ? "responsive" : "intrinsic";
                if ("layout" in B) {
                    if (B.layout) G = B.layout;
                    delete B.layout;
                }
                var O = W;
                if ("loader" in B) {
                    if (B.loader) {
                        var U = B.loader;
                        var X;
                        X = function(e) {
                            var t = e.config, r = c(e, [
                                "config"
                            ]);
                            return U(r);
                        }, O = X, X;
                    }
                    delete B.loader;
                }
                var J = "";
                if (C(t)) {
                    var K = k(t) ? t.default : t;
                    if (!K.src) {
                        throw new Error("An object should only be passed to the image component src parameter if it comes from a static image import. It must include src. Received ".concat(JSON.stringify(K)));
                    }
                    D = D || K.blurDataURL;
                    J = K.src;
                    if (!G || G !== "fill") {
                        N = N || K.height;
                        E = E || K.width;
                        if (!K.height || !K.width) {
                            throw new Error("An object should only be passed to the image component src parameter if it comes from a static image import. It must include height and width. Received ".concat(JSON.stringify(K)));
                        }
                    }
                }
                t = typeof t === "string" ? t : J;
                var Q = !$ && (p === "lazy" || typeof p === "undefined");
                if (t.startsWith("data:") || t.startsWith("blob:")) {
                    s = true;
                    Q = false;
                }
                if (true && b.has(t)) {
                    Q = false;
                }
                if (x) {
                    s = true;
                }
                var Y = a((0, u).useState(false), 2), ee = Y[0], et = Y[1];
                var er = a((0, v).useIntersection({
                    rootRef: y,
                    rootMargin: w || "200px",
                    disabled: !Q
                }), 3), en = er[0], ea = er[1], ei = er[2];
                var eo = !Q || ea;
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
                var ef = {
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
                    objectFit: P,
                    objectPosition: R
                };
                var ed = L(E);
                var ev = L(N);
                var eh = L(S);
                if (false) {
                    var eg, e$, ep, em;
                }
                var ey = Object.assign({}, I, ef);
                var ew = V === "blur" && !ee ? {
                    backgroundSize: P || "cover",
                    backgroundPosition: R || "0% 0%",
                    filter: "blur(20px)",
                    backgroundImage: 'url("'.concat(D, '")')
                } : {};
                if (G === "fill") {
                    el.display = "block";
                    el.position = "absolute";
                    el.top = 0;
                    el.left = 0;
                    el.bottom = 0;
                    el.right = 0;
                } else if (typeof ed !== "undefined" && typeof ev !== "undefined") {
                    var ex = ev / ed;
                    var e_ = isNaN(ex) ? "100%" : "".concat(ex * 100, "%");
                    if (G === "responsive") {
                        el.display = "block";
                        el.position = "relative";
                        ec = true;
                        es.paddingTop = e_;
                    } else if (G === "intrinsic") {
                        el.display = "inline-block";
                        el.position = "relative";
                        el.maxWidth = "100%";
                        ec = true;
                        es.maxWidth = "100%";
                        eu = "data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20version=%271.1%27%20width=%27".concat(ed, "%27%20height=%27").concat(ev, "%27/%3e");
                    } else if (G === "fixed") {
                        el.display = "inline-block";
                        el.position = "relative";
                        el.width = ed;
                        el.height = ev;
                    }
                } else {
                    if (false) {}
                }
                var eb = {
                    src: j,
                    srcSet: undefined,
                    sizes: undefined
                };
                if (eo) {
                    eb = q({
                        config: H,
                        src: t,
                        unoptimized: s,
                        layout: G,
                        width: ed,
                        quality: eh,
                        sizes: r,
                        loader: O
                    });
                }
                var ez = t;
                if (false) {
                    var eS;
                }
                var ej = "imagesrcset";
                var e0 = "imagesizes";
                if (true) {
                    ej = "imageSrcSet";
                    e0 = "imageSizes";
                }
                var e6;
                var e5 = (e6 = {}, n(e6, ej, eb.srcSet), n(e6, e0, eb.sizes), e6);
                var e2 = false ? 0 : u.default.useLayoutEffect;
                var e7 = (0, u).useRef(Z);
                var e4 = (0, u).useRef(t);
                (0, u).useEffect(function() {
                    e7.current = Z;
                }, [
                    Z
                ]);
                e2(function() {
                    if (e4.current !== t) {
                        ei();
                        e4.current = t;
                    }
                }, [
                    ei,
                    t
                ]);
                var eE = o({
                    isLazy: Q,
                    imgAttributes: eb,
                    heightInt: ev,
                    widthInt: ed,
                    qualityInt: eh,
                    layout: G,
                    className: z,
                    imgStyle: ey,
                    blurStyle: ew,
                    loading: p,
                    config: H,
                    unoptimized: s,
                    placeholder: V,
                    loader: O,
                    srcString: ez,
                    onLoadingCompleteRef: e7,
                    setBlurComplete: et,
                    setIntersection: en,
                    isVisible: eo,
                    noscriptSizes: r
                }, B);
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
                }) : null) : null, u.default.createElement(A, Object.assign({}, eE))), $ ? u.default.createElement(f.default, null, u.default.createElement("link", Object.assign({
                    key: "__nimg-" + eb.src + eb.srcSet + eb.sizes,
                    rel: "preload",
                    as: "image",
                    href: eb.srcSet ? undefined : eb.src
                }, e5))) : null);
            }
            var m = {
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
            } || {}, y = m.experimentalRemotePatterns, w = y === void 0 ? [] : y, x = m.experimentalUnoptimized;
            var _ = {
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
            var b = new Set();
            var z = new Map();
            var S;
            var j = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
            if (false) {}
            var E = (null && ([
                "lazy",
                "eager",
                undefined
            ]));
            var N = new Map([
                [
                    "default",
                    H
                ],
                [
                    "imgix",
                    V
                ],
                [
                    "cloudinary",
                    T
                ],
                [
                    "akamai",
                    D
                ],
                [
                    "custom",
                    F
                ], 
            ]);
            var I = (null && ([
                "fill",
                "fixed",
                "intrinsic",
                "responsive",
                undefined, 
            ]));
            function k(e) {
                return e.default !== undefined;
            }
            function P(e) {
                return e.src !== undefined;
            }
            function C(e) {
                return typeof e === "object" && (k(e) || P(e));
            }
            function R(e, t, r, n) {
                var a = e.deviceSizes, o = e.allSizes;
                if (n && (r === "fill" || r === "responsive")) {
                    var l = /(^|\s)(1?\d?\d)vw/g;
                    var s = [];
                    for(var c; c = l.exec(n); c){
                        s.push(parseInt(c[2]));
                    }
                    if (s.length) {
                        var u;
                        var f = (u = Math).min.apply(u, i(s)) * 0.01;
                        return {
                            widths: o.filter(function(e) {
                                return e >= a[0] * f;
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
                        widths: a,
                        kind: "w"
                    };
                }
                var d = i(new Set([
                    t,
                    t * 2
                ].map(function(e) {
                    return o.find(function(t) {
                        return t >= e;
                    }) || o[o.length - 1];
                })));
                return {
                    widths: d,
                    kind: "x"
                };
            }
            function q(e) {
                var t = e.config, r = e.src, n = e.unoptimized, a = e.layout, i = e.width, o = e.quality, l = e.sizes, s = e.loader;
                if (n) {
                    return {
                        src: r,
                        srcSet: undefined,
                        sizes: undefined
                    };
                }
                var c = R(t, i, a, l), u = c.widths, f = c.kind;
                var d = u.length - 1;
                return {
                    sizes: !l && f === "w" ? "100vw" : l,
                    srcSet: u.map(function(e, n) {
                        return "".concat(s({
                            config: t,
                            src: r,
                            quality: o,
                            width: e
                        }), " ").concat(f === "w" ? e : n + 1).concat(f);
                    }).join(", "),
                    src: s({
                        config: t,
                        src: r,
                        quality: o,
                        width: u[d]
                    })
                };
            }
            function L(e) {
                if (typeof e === "number") {
                    return e;
                }
                if (typeof e === "string") {
                    return parseInt(e, 10);
                }
                return undefined;
            }
            function W(e) {
                var t;
                var r = ((t = e.config) == null ? void 0 : t.loader) || "default";
                var n = N.get(r);
                if (n) {
                    return n(e);
                }
                throw new Error('Unknown "loader" found in "next.config.js". Expected: '.concat(d.VALID_LOADERS.join(", "), ". Received: ").concat(r));
            }
            function Z(e, t, r, n, a, i) {
                if (!e || e.src === j || e["data-loaded-src"] === t) {
                    return;
                }
                e["data-loaded-src"] = t;
                var o = "decode" in e ? e.decode() : Promise.resolve();
                o.catch(function() {}).then(function() {
                    if (!e.parentNode) {
                        return;
                    }
                    b.add(t);
                    if (n === "blur") {
                        i(true);
                    }
                    if (a == null ? void 0 : a.current) {
                        var r = e.naturalWidth, o = e.naturalHeight;
                        a.current({
                            naturalWidth: r,
                            naturalHeight: o
                        });
                    }
                    if (false) {
                        var l, s;
                    }
                });
            }
            var A = function(e) {
                var t = e.imgAttributes, r = e.heightInt, n = e.widthInt, a = e.qualityInt, i = e.layout, l = e.className, s = e.imgStyle, f = e.blurStyle, d = e.isLazy, v = e.placeholder, h = e.loading, g = e.srcString, $ = e.config, p = e.unoptimized, m = e.loader, y = e.onLoadingCompleteRef, w = e.setBlurComplete, x = e.setIntersection, _ = e.onLoad, b = e.onError, z = e.isVisible, S = e.noscriptSizes, j = c(e, [
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
                h = d ? "lazy" : h;
                return u.default.createElement(u.default.Fragment, null, u.default.createElement("img", Object.assign({}, j, t, {
                    decoding: "async",
                    "data-nimg": i,
                    className: l,
                    style: o({}, s, f),
                    ref: (0, u).useCallback(function(e) {
                        if (false) {}
                        x(e);
                        if (e == null ? void 0 : e.complete) {
                            Z(e, g, i, v, y, w);
                        }
                    }, [
                        x,
                        g,
                        i,
                        v,
                        y,
                        w, 
                    ]),
                    onLoad: function(e) {
                        var t = e.currentTarget;
                        Z(t, g, i, v, y, w);
                        if (_) {
                            _(e);
                        }
                    },
                    onError: function(e) {
                        if (v === "blur") {
                            w(true);
                        }
                        if (b) {
                            b(e);
                        }
                    }
                })), (d || v === "blur") && u.default.createElement("noscript", null, u.default.createElement("img", Object.assign({}, j, q({
                    config: $,
                    src: g,
                    unoptimized: p,
                    layout: i,
                    width: n,
                    quality: a,
                    sizes: S,
                    loader: m
                }), {
                    decoding: "async",
                    "data-nimg": i,
                    style: s,
                    className: l,
                    loading: h
                }))));
            };
            function M(e) {
                return e[0] === "/" ? e.slice(1) : e;
            }
            function V(e) {
                var t = e.config, r = e.src, n = e.width, a = e.quality;
                var i = new URL("".concat(t.path).concat(M(r)));
                var o = i.searchParams;
                o.set("auto", o.getAll("auto").join(",") || "format");
                o.set("fit", o.get("fit") || "max");
                o.set("w", o.get("w") || n.toString());
                if (a) {
                    o.set("q", a.toString());
                }
                return i.href;
            }
            function D(e) {
                var t = e.config, r = e.src, n = e.width;
                return "".concat(t.path).concat(M(r), "?imwidth=").concat(n);
            }
            function T(e) {
                var t = e.config, r = e.src, n = e.width, a = e.quality;
                var i = [
                    "f_auto",
                    "c_limit",
                    "w_" + n,
                    "q_" + (a || "auto")
                ];
                var o = i.join(",") + "/";
                return "".concat(t.path).concat(o).concat(M(r));
            }
            function F(e) {
                var t = e.src;
                throw new Error('Image with src "'.concat(t, '" is missing "loader" prop.') + "\nRead more: https://nextjs.org/docs/messages/next-image-missing-loader");
            }
            function H(e) {
                var t = e.config, r = e.src, n = e.width, a = e.quality;
                if (false) {
                    var i, o, l;
                }
                if (r.endsWith(".svg") && !t.dangerouslyAllowSVG) {
                    return r;
                }
                return "".concat((0, $).normalizePathTrailingSlash(t.path), "?url=").concat(encodeURIComponent(r), "&w=").concat(n, "&q=").concat(a || 75);
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
            var n = (r(8693).Z);
            Object.defineProperty(t, "__esModule", ({
                value: true
            }));
            t.useIntersection = l;
            var a = r(959);
            var i = r(6501);
            var o = typeof IntersectionObserver === "function";
            function l(e) {
                var t = e.rootRef, r = e.rootMargin, l = e.disabled;
                var s = l || !o;
                var c = (0, a).useRef();
                var f = n((0, a).useState(false), 2), d = f[0], v = f[1];
                var h = n((0, a).useState(null), 2), g = h[0], $ = h[1];
                (0, a).useEffect(function() {
                    if (o) {
                        if (c.current) {
                            c.current();
                            c.current = undefined;
                        }
                        if (s || d) return;
                        if (g && g.tagName) {
                            c.current = u(g, function(e) {
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
                        if (!d) {
                            var e = (0, i).requestIdleCallback(function() {
                                return v(true);
                            });
                            return function() {
                                return (0, i).cancelIdleCallback(e);
                            };
                        }
                    }
                }, [
                    g,
                    s,
                    r,
                    t,
                    d
                ]);
                var p = (0, a).useCallback(function() {
                    v(false);
                }, []);
                return [
                    $,
                    d,
                    p
                ];
            }
            var s = new Map();
            var c = [];
            function u(e, t, r) {
                var n = f(r), a = n.id, i = n.observer, o = n.elements;
                o.set(e, t);
                i.observe(e);
                return function t() {
                    o.delete(e);
                    i.unobserve(e);
                    if (o.size === 0) {
                        i.disconnect();
                        s.delete(a);
                        var r = c.findIndex(function(e) {
                            return e.root === a.root && e.margin === a.margin;
                        });
                        if (r > -1) {
                            c.splice(r, 1);
                        }
                    }
                };
            }
            function f(e) {
                var t = {
                    root: e.root || null,
                    margin: e.rootMargin || ""
                };
                var r = c.find(function(e) {
                    return e.root === t.root && e.margin === t.margin;
                });
                var n;
                if (r) {
                    n = s.get(r);
                    if (n) {
                        return n;
                    }
                }
                var a = new Map();
                var i = new IntersectionObserver(function(e) {
                    e.forEach(function(e) {
                        var t = a.get(e.target);
                        var r = e.isIntersecting || e.intersectionRatio > 0;
                        if (t && r) {
                            t(r);
                        }
                    });
                }, e);
                n = {
                    id: t,
                    observer: i,
                    elements: a
                };
                c.push(t);
                s.set(t, n);
                return n;
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
                    return h;
                }
            });
            var n = r(1527);
            var a = r(6224);
            var i = r.n(a);
            var o = r(8206);
            var l = r.n(o);
            var s = r(959);
            var c = r(9915);
            var u = r.n(c);
            ;
            var f = 40;
            var d = function() {
                new Image(f, f).src = "/vercel.svg";
            };
            ;
            var v = function() {
                (0, s.useEffect)(function() {
                    console.log(f);
                    d();
                }, []);
                return (0, n.jsxs)("div", {
                    className: (u()).container,
                    children: [
                        (0, n.jsxs)((i()), {
                            children: [
                                (0, n.jsx)("title", {
                                    children: "Create Next App"
                                }),
                                (0, n.jsx)("meta", {
                                    name: "description",
                                    content: "Generated by create next app"
                                }),
                                (0, n.jsx)("link", {
                                    rel: "icon",
                                    href: "/favicon.ico"
                                })
                            ]
                        }),
                        (0, n.jsxs)("main", {
                            className: (u()).main,
                            children: [
                                (0, n.jsxs)("h1", {
                                    className: (u()).title,
                                    children: [
                                        "Welcome to ",
                                        (0, n.jsx)("a", {
                                            href: "https://nextjs.org",
                                            children: "Next.js!"
                                        })
                                    ]
                                }),
                                (0, n.jsxs)("p", {
                                    className: (u()).description,
                                    children: [
                                        "Get started by editing",
                                        " ",
                                        (0, n.jsx)("code", {
                                            className: (u()).code,
                                            children: "pages/index.tsx"
                                        })
                                    ]
                                }),
                                (0, n.jsxs)("div", {
                                    className: (u()).grid,
                                    children: [
                                        (0, n.jsxs)("a", {
                                            href: "https://nextjs.org/docs",
                                            className: (u()).card,
                                            children: [
                                                (0, n.jsx)("h2", {
                                                    children: "Documentation →"
                                                }),
                                                (0, n.jsx)("p", {
                                                    children: "Find in-depth information about Next.js features and API."
                                                })
                                            ]
                                        }),
                                        (0, n.jsxs)("a", {
                                            href: "https://nextjs.org/learn",
                                            className: (u()).card,
                                            children: [
                                                (0, n.jsx)("h2", {
                                                    children: "Learn →"
                                                }),
                                                (0, n.jsx)("p", {
                                                    children: "Learn about Next.js in an interactive course with quizzes!"
                                                })
                                            ]
                                        }),
                                        (0, n.jsxs)("a", {
                                            href: "https://github.com/vercel/next.js/tree/canary/examples",
                                            className: (u()).card,
                                            children: [
                                                (0, n.jsx)("h2", {
                                                    children: "Examples →"
                                                }),
                                                (0, n.jsx)("p", {
                                                    children: "Discover and deploy boilerplate example Next.js projects."
                                                })
                                            ]
                                        }),
                                        (0, n.jsxs)("a", {
                                            href: "https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app",
                                            className: (u()).card,
                                            children: [
                                                (0, n.jsx)("h2", {
                                                    children: "Deploy →"
                                                }),
                                                (0, n.jsx)("p", {
                                                    children: "Instantly deploy your Next.js site to a public URL with Vercel."
                                                })
                                            ]
                                        })
                                    ]
                                })
                            ]
                        }),
                        (0, n.jsx)("footer", {
                            className: (u()).footer,
                            children: (0, n.jsxs)("a", {
                                href: "https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app",
                                target: "_blank",
                                rel: "noopener noreferrer",
                                children: [
                                    "Powered by",
                                    " ",
                                    (0, n.jsx)("span", {
                                        className: (u()).logo,
                                        children: (0, n.jsx)((l()), {
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
            var h = (v);
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
