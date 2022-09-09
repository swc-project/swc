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
            var s = (r(4507).Z);
            var l = (r(8167).Z);
            var c = (r(4719).Z);
            var u = l(r(959));
            var d = s(r(4357));
            var f = r(1773);
            var v = r(757);
            var m = r(9664);
            var g = r(8827);
            var p = r(8236);
            function h(e) {
                var t = e.src, r = e.sizes, s = e.unoptimized, l = s === void 0 ? false : s, g = e.priority, p = g === void 0 ? false : g, h = e.loading, b = e.lazyRoot, y = b === void 0 ? null : b, x = e.lazyBoundary, z = e.className, S = e.quality, N = e.width, k = e.height, E = e.style, L = e.objectFit, O = e.objectPosition, M = e.onLoadingComplete, D = e.placeholder, W = D === void 0 ? "empty" : D, B = e.blurDataURL, V = c(e, [
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
                var Z = (0, u).useContext(m.ImageConfigContext);
                var U = (0, u).useMemo(function() {
                    var e = _ || Z || f.imageConfigDefault;
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
                var G = V;
                var T = r ? "responsive" : "intrinsic";
                if ("layout" in G) {
                    if (G.layout) T = G.layout;
                    delete G.layout;
                }
                var F = q;
                if ("loader" in G) {
                    if (G.loader) {
                        var Q = G.loader;
                        var J;
                        J = function(e) {
                            var t = e.config, r = c(e, [
                                "config"
                            ]);
                            return Q(r);
                        }, F = J, J;
                    }
                    delete G.loader;
                }
                var X = "";
                if (R(t)) {
                    var K = I(t) ? t.default : t;
                    if (!K.src) {
                        throw new Error("An object should only be passed to the image component src parameter if it comes from a static image import. It must include src. Received ".concat(JSON.stringify(K)));
                    }
                    B = B || K.blurDataURL;
                    X = K.src;
                    if (!T || T !== "fill") {
                        k = k || K.height;
                        N = N || K.width;
                        if (!K.height || !K.width) {
                            throw new Error("An object should only be passed to the image component src parameter if it comes from a static image import. It must include height and width. Received ".concat(JSON.stringify(K)));
                        }
                    }
                }
                t = typeof t === "string" ? t : X;
                var Y = !p && (h === "lazy" || typeof h === "undefined");
                if (t.startsWith("data:") || t.startsWith("blob:")) {
                    l = true;
                    Y = false;
                }
                if (true && j.has(t)) {
                    Y = false;
                }
                if (w) {
                    l = true;
                }
                var $ = n((0, u).useState(false), 2), ee = $[0], et = $[1];
                var er = n((0, v).useIntersection({
                    rootRef: y,
                    rootMargin: x || "200px",
                    disabled: !Y
                }), 3), ei = er[0], en = er[1], ea = er[2];
                var eo = !Y || en;
                var es = {
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
                var el = {
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
                    objectFit: L,
                    objectPosition: O
                };
                var ef = P(N);
                var ev = P(k);
                var em = P(S);
                if (false) {
                    var eg, ep, eh, eb;
                }
                var ey = Object.assign({}, E, ed);
                var ex = W === "blur" && !ee ? {
                    backgroundSize: L || "cover",
                    backgroundPosition: O || "0% 0%",
                    filter: "blur(20px)",
                    backgroundImage: 'url("'.concat(B, '")')
                } : {};
                if (T === "fill") {
                    es.display = "block";
                    es.position = "absolute";
                    es.top = 0;
                    es.left = 0;
                    es.bottom = 0;
                    es.right = 0;
                } else if (typeof ef !== "undefined" && typeof ev !== "undefined") {
                    var ew = ev / ef;
                    var e_ = isNaN(ew) ? "100%" : "".concat(ew * 100, "%");
                    if (T === "responsive") {
                        es.display = "block";
                        es.position = "relative";
                        ec = true;
                        el.paddingTop = e_;
                    } else if (T === "intrinsic") {
                        es.display = "inline-block";
                        es.position = "relative";
                        es.maxWidth = "100%";
                        ec = true;
                        el.maxWidth = "100%";
                        eu = "data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20version=%271.1%27%20width=%27".concat(ef, "%27%20height=%27").concat(ev, "%27/%3e");
                    } else if (T === "fixed") {
                        es.display = "inline-block";
                        es.position = "relative";
                        es.width = ef;
                        es.height = ev;
                    }
                } else {
                    if (false) {}
                }
                var ej = {
                    src: A,
                    srcSet: undefined,
                    sizes: undefined
                };
                if (eo) {
                    ej = C({
                        config: U,
                        src: t,
                        unoptimized: l,
                        layout: T,
                        width: ef,
                        quality: em,
                        sizes: r,
                        loader: F
                    });
                }
                var ez = t;
                if (false) {
                    var eS;
                }
                var eA = "imagesrcset";
                var eN = "imagesizes";
                if (true) {
                    eA = "imageSrcSet";
                    eN = "imageSizes";
                }
                var ek;
                var eE = (ek = {}, i(ek, eA, ej.srcSet), i(ek, eN, ej.sizes), ek);
                var eI = false ? 0 : u.default.useLayoutEffect;
                var eL = (0, u).useRef(M);
                var eR = (0, u).useRef(t);
                (0, u).useEffect(function() {
                    eL.current = M;
                }, [
                    M
                ]);
                eI(function() {
                    if (eR.current !== t) {
                        ea();
                        eR.current = t;
                    }
                }, [
                    ea,
                    t
                ]);
                var eO = o({
                    isLazy: Y,
                    imgAttributes: ej,
                    heightInt: ev,
                    widthInt: ef,
                    qualityInt: em,
                    layout: T,
                    className: z,
                    imgStyle: ey,
                    blurStyle: ex,
                    loading: h,
                    config: U,
                    unoptimized: l,
                    placeholder: W,
                    loader: F,
                    srcString: ez,
                    onLoadingCompleteRef: eL,
                    setBlurComplete: et,
                    setIntersection: ei,
                    isVisible: eo,
                    noscriptSizes: r
                }, G);
                return u.default.createElement(u.default.Fragment, null, u.default.createElement("span", {
                    style: es
                }, ec ? u.default.createElement("span", {
                    style: el
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
                }) : null) : null, u.default.createElement(H, Object.assign({}, eO))), p ? u.default.createElement(d.default, null, u.default.createElement("link", Object.assign({
                    key: "__nimg-" + ej.src + ej.srcSet + ej.sizes,
                    rel: "preload",
                    as: "image",
                    href: ej.srcSet ? undefined : ej.src
                }, eE))) : null);
            }
            var b = {
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
            } || {}, y = b.experimentalRemotePatterns, x = y === void 0 ? [] : y, w = b.experimentalUnoptimized;
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
            var j = new Set();
            var z = new Map();
            var S;
            var A = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
            if (false) {}
            var N = (null && ([
                "lazy",
                "eager",
                undefined
            ]));
            var k = new Map([
                [
                    "default",
                    U
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
            var E = (null && ([
                "fill",
                "fixed",
                "intrinsic",
                "responsive",
                undefined, 
            ]));
            function I(e) {
                return e.default !== undefined;
            }
            function L(e) {
                return e.src !== undefined;
            }
            function R(e) {
                return typeof e === "object" && (I(e) || L(e));
            }
            function O(e, t, r, i) {
                var n = e.deviceSizes, o = e.allSizes;
                if (i && (r === "fill" || r === "responsive")) {
                    var s = /(^|\s)(1?\d?\d)vw/g;
                    var l = [];
                    for(var c; c = s.exec(i); c){
                        l.push(parseInt(c[2]));
                    }
                    if (l.length) {
                        var u;
                        var d = (u = Math).min.apply(u, a(l)) * 0.01;
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
                var t = e.config, r = e.src, i = e.unoptimized, n = e.layout, a = e.width, o = e.quality, s = e.sizes, l = e.loader;
                if (i) {
                    return {
                        src: r,
                        srcSet: undefined,
                        sizes: undefined
                    };
                }
                var c = O(t, a, n, s), u = c.widths, d = c.kind;
                var f = u.length - 1;
                return {
                    sizes: !s && d === "w" ? "100vw" : s,
                    srcSet: u.map(function(e, i) {
                        return "".concat(l({
                            config: t,
                            src: r,
                            quality: o,
                            width: e
                        }), " ").concat(d === "w" ? e : i + 1).concat(d);
                    }).join(", "),
                    src: l({
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
            function M(e, t, r, i, n, a) {
                if (!e || e.src === A || e["data-loaded-src"] === t) {
                    return;
                }
                e["data-loaded-src"] = t;
                var o = "decode" in e ? e.decode() : Promise.resolve();
                o.catch(function() {}).then(function() {
                    if (!e.parentNode) {
                        return;
                    }
                    j.add(t);
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
                        var s, l;
                    }
                });
            }
            var H = function(e) {
                var t = e.imgAttributes, r = e.heightInt, i = e.widthInt, n = e.qualityInt, a = e.layout, s = e.className, l = e.imgStyle, d = e.blurStyle, f = e.isLazy, v = e.placeholder, m = e.loading, g = e.srcString, p = e.config, h = e.unoptimized, b = e.loader, y = e.onLoadingCompleteRef, x = e.setBlurComplete, w = e.setIntersection, _ = e.onLoad, j = e.onError, z = e.isVisible, S = e.noscriptSizes, A = c(e, [
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
                m = f ? "lazy" : m;
                return u.default.createElement(u.default.Fragment, null, u.default.createElement("img", Object.assign({}, A, t, {
                    decoding: "async",
                    "data-nimg": a,
                    className: s,
                    style: o({}, l, d),
                    ref: (0, u).useCallback(function(e) {
                        if (false) {}
                        w(e);
                        if (e == null ? void 0 : e.complete) {
                            M(e, g, a, v, y, x);
                        }
                    }, [
                        w,
                        g,
                        a,
                        v,
                        y,
                        x, 
                    ]),
                    onLoad: function(e) {
                        var t = e.currentTarget;
                        M(t, g, a, v, y, x);
                        if (_) {
                            _(e);
                        }
                    },
                    onError: function(e) {
                        if (v === "blur") {
                            x(true);
                        }
                        if (j) {
                            j(e);
                        }
                    }
                })), (f || v === "blur") && u.default.createElement("noscript", null, u.default.createElement("img", Object.assign({}, A, C({
                    config: p,
                    src: g,
                    unoptimized: h,
                    layout: a,
                    width: i,
                    quality: n,
                    sizes: S,
                    loader: b
                }), {
                    decoding: "async",
                    "data-nimg": a,
                    style: l,
                    className: s,
                    loading: m
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
            function U(e) {
                var t = e.config, r = e.src, i = e.width, n = e.quality;
                if (false) {
                    var a, o, s;
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
            t.useIntersection = s;
            var n = r(959);
            var a = r(6501);
            var o = typeof IntersectionObserver === "function";
            function s(e) {
                var t = e.rootRef, r = e.rootMargin, s = e.disabled;
                var l = s || !o;
                var c = (0, n).useRef();
                var d = i((0, n).useState(false), 2), f = d[0], v = d[1];
                var m = i((0, n).useState(null), 2), g = m[0], p = m[1];
                (0, n).useEffect(function() {
                    if (o) {
                        if (c.current) {
                            c.current();
                            c.current = undefined;
                        }
                        if (l || f) return;
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
                    g,
                    l,
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
            var l = new Map();
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
                        l.delete(n);
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
                    i = l.get(r);
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
                l.set(t, i);
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
                    return m;
                }
            });
            var i = r(1527);
            var n = r(6224);
            var a = r.n(n);
            var o = r(8206);
            var s = r.n(o);
            var l = r(959);
            var c = r(9915);
            var u = r.n(c);
            ;
            var d = 40;
            var f = function() {
                new Image(d, d).src = "/vercel.svg";
            };
            ;
            var v = function() {
                (0, l.useEffect)(function() {
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
                                        children: (0, i.jsx)((s()), {
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
            var m = (v);
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
