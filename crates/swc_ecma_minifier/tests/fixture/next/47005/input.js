(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
    [502], {

        /***/
        9145:
            /***/
            (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {

                "use strict";
                /* harmony export */
                __webpack_require__.d(__webpack_exports__, {
                    /* harmony export */
                    "u": function () {
                        return /* binding */ Ne;
                    }
                    /* harmony export */
                });
                /* unused harmony exports TooltipProvider, TooltipWrapper */
                /* harmony import */
                var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7294);
                /* harmony import */
                var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5893);
                var Ke = Object.create;
                var me = Object.defineProperty;
                var Ie = Object.getOwnPropertyDescriptor;
                var Ve = Object.getOwnPropertyNames;
                var $e = Object.getPrototypeOf,
                    ze = Object.prototype.hasOwnProperty;
                var je = (t, e) => () => (e || t((e = {
                    exports: {}
                }).exports, e), e.exports);
                var Xe = (t, e, n, o) => {
                    if (e && typeof e == "object" || typeof e == "function")
                        for (let l of Ve(e)) !ze.call(t, l) && l !== n && me(t, l, {
                            get: () => e[l],
                            enumerable: !(o = Ie(e, l)) || o.enumerable
                        });
                    return t
                };
                var he = (t, e, n) => (n = t != null ? Ke($e(t)) : {}, Xe(e || !t || !t.__esModule ? me(n, "default", {
                    value: t,
                    enumerable: !0
                }) : n, t));
                var Ut = je((Co, Wt) => {
                    (function () {
                        "use strict";
                        var t = {}.hasOwnProperty;

                        function n() {
                            for (var o = [], l = 0; l < arguments.length; l++) {
                                var r = arguments[l];
                                if (r) {
                                    var i = typeof r;
                                    if (i === "string" || i === "number") o.push(r);
                                    else if (Array.isArray(r)) {
                                        if (r.length) {
                                            var s = n.apply(null, r);
                                            s && o.push(s)
                                        }
                                    } else if (i === "object") {
                                        if (r.toString !== Object.prototype.toString && !r.toString.toString().includes("[native code]")) {
                                            o.push(r.toString());
                                            continue
                                        }
                                        for (var f in r) t.call(r, f) && r[f] && o.push(f)
                                    }
                                }
                            }
                            return o.join(" ")
                        }
                        typeof Wt < "u" && Wt.exports ? (n.default = n, Wt.exports = n) : typeof define == "function" && "object" == "object" && __webpack_require__.amdO ? define("classnames", [], function () {
                            return n
                        }) : window.classNames = n
                    })()
                });
                var ae = he(Ut());
                var Ue = (t, e, n) => {
                    let o = null;
                    return function (...r) {
                        let i = () => {
                            o = null, n || t.apply(this, r)
                        };
                        o && clearTimeout(o), o = setTimeout(i, e)
                    }
                },
                    Yt = Ue;
                var qt = "DEFAULT_TOOLTIP_ID",
                    Ze = {
                        anchorRefs: new Set,
                        activeAnchor: {
                            current: null
                        },
                        attach: () => { },
                        detach: () => { },
                        setActiveAnchor: () => { }
                    },
                    to = {
                        getTooltipData: () => Ze
                    },
                    ge = (0, react__WEBPACK_IMPORTED_MODULE_0__.createContext)(to);

                function at(t = qt) {
                    return (0, react__WEBPACK_IMPORTED_MODULE_0__.useContext)(ge).getTooltipData(t)
                }
                var Te = he(Ut());
                var ao = typeof window != "undefined" ? react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect : react__WEBPACK_IMPORTED_MODULE_0__.useEffect,
                    ve = ao;

                function _t(t) {
                    return t.split("-")[1]
                }

                function Qt(t) {
                    return t === "y" ? "height" : "width"
                }

                function ft(t) {
                    return t.split("-")[0]
                }

                function St(t) {
                    return ["top", "bottom"].includes(ft(t)) ? "x" : "y"
                }

                function be(t, e, n) {
                    let {
                        reference: o,
                        floating: l
                    } = t, r = o.x + o.width / 2 - l.width / 2, i = o.y + o.height / 2 - l.height / 2, s = St(e), f = Qt(s), u = o[f] / 2 - l[f] / 2, a = s === "x", c;
                    switch (ft(e)) {
                        case "top":
                            c = {
                                x: r,
                                y: o.y - l.height
                            };
                            break;
                        case "bottom":
                            c = {
                                x: r,
                                y: o.y + o.height
                            };
                            break;
                        case "right":
                            c = {
                                x: o.x + o.width,
                                y: i
                            };
                            break;
                        case "left":
                            c = {
                                x: o.x - l.width,
                                y: i
                            };
                            break;
                        default:
                            c = {
                                x: o.x,
                                y: o.y
                            }
                    }
                    switch (_t(e)) {
                        case "start":
                            c[s] -= u * (n && a ? -1 : 1);
                            break;
                        case "end":
                            c[s] += u * (n && a ? -1 : 1)
                    }
                    return c
                }
                var Ee = async (t, e, n) => {
                    let {
                        placement: o = "bottom",
                        strategy: l = "absolute",
                        middleware: r = [],
                        platform: i
                    } = n, s = r.filter(Boolean), f = await (i.isRTL == null ? void 0 : i.isRTL(e)), u = await i.getElementRects({
                        reference: t,
                        floating: e,
                        strategy: l
                    }), {
                        x: a,
                        y: c
                    } = be(u, o, f), d = o, p = {}, y = 0;
                    for (let g = 0; g < s.length; g++) {
                        let {
                            name: w,
                            fn: T
                        } = s[g], {
                            x,
                            y: v,
                            data: P,
                            reset: R
                        } = await T({
                            x: a,
                            y: c,
                            initialPlacement: o,
                            placement: d,
                            strategy: l,
                            middlewareData: p,
                            rects: u,
                            platform: i,
                            elements: {
                                reference: t,
                                floating: e
                            }
                        });
                        a = x ?? a, c = v ?? c, p = {
                            ...p,
                            [w]: {
                                ...p[w],
                                ...P
                            }
                        }, R && y <= 50 && (y++, typeof R == "object" && (R.placement && (d = R.placement), R.rects && (u = R.rects === !0 ? await i.getElementRects({
                            reference: t,
                            floating: e,
                            strategy: l
                        }) : R.rects), {
                            x: a,
                            y: c
                        } = be(u, d, f)), g = -1)
                    }
                    return {
                        x: a,
                        y: c,
                        placement: d,
                        strategy: l,
                        middlewareData: p
                    }
                };

                function Ae(t) {
                    return typeof t != "number" ? function (e) {
                        return {
                            top: 0,
                            right: 0,
                            bottom: 0,
                            left: 0,
                            ...e
                        }
                    }(t) : {
                        top: t,
                        right: t,
                        bottom: t,
                        left: t
                    }
                }

                function Rt(t) {
                    return {
                        ...t,
                        top: t.y,
                        left: t.x,
                        right: t.x + t.width,
                        bottom: t.y + t.height
                    }
                }
                async function Zt(t, e) {
                    var n;
                    e === void 0 && (e = {});
                    let {
                        x: o,
                        y: l,
                        platform: r,
                        rects: i,
                        elements: s,
                        strategy: f
                    } = t, {
                        boundary: u = "clippingAncestors",
                        rootBoundary: a = "viewport",
                        elementContext: c = "floating",
                        altBoundary: d = !1,
                        padding: p = 0
                    } = e, y = Ae(p), g = s[d ? c === "floating" ? "reference" : "floating" : c], w = Rt(await r.getClippingRect({
                        element: (n = await (r.isElement == null ? void 0 : r.isElement(g))) == null || n ? g : g.contextElement || await (r.getDocumentElement == null ? void 0 : r.getDocumentElement(s.floating)),
                        boundary: u,
                        rootBoundary: a,
                        strategy: f
                    })), T = c === "floating" ? {
                        ...i.floating,
                        x: o,
                        y: l
                    } : i.reference, x = await (r.getOffsetParent == null ? void 0 : r.getOffsetParent(s.floating)), v = await (r.isElement == null ? void 0 : r.isElement(x)) && await (r.getScale == null ? void 0 : r.getScale(x)) || {
                        x: 1,
                        y: 1
                    }, P = Rt(r.convertOffsetParentRelativeRectToViewportRelativeRect ? await r.convertOffsetParentRelativeRectToViewportRelativeRect({
                        rect: T,
                        offsetParent: x,
                        strategy: f
                    }) : T);
                    return {
                        top: (w.top - P.top + y.top) / v.y,
                        bottom: (P.bottom - w.bottom + y.bottom) / v.y,
                        left: (w.left - P.left + y.left) / v.x,
                        right: (P.right - w.right + y.right) / v.x
                    }
                }
                var fo = Math.min,
                    uo = Math.max;

                function Gt(t, e, n) {
                    return uo(t, fo(e, n))
                }
                var te = t => ({
                    name: "arrow",
                    options: t,
                    async fn(e) {
                        let {
                            element: n,
                            padding: o = 0
                        } = t || {}, {
                            x: l,
                            y: r,
                            placement: i,
                            rects: s,
                            platform: f,
                            elements: u
                        } = e;
                        if (n == null) return {};
                        let a = Ae(o),
                            c = {
                                x: l,
                                y: r
                            },
                            d = St(i),
                            p = Qt(d),
                            y = await f.getDimensions(n),
                            g = d === "y",
                            w = g ? "top" : "left",
                            T = g ? "bottom" : "right",
                            x = g ? "clientHeight" : "clientWidth",
                            v = s.reference[p] + s.reference[d] - c[d] - s.floating[p],
                            P = c[d] - s.reference[d],
                            R = await (f.getOffsetParent == null ? void 0 : f.getOffsetParent(n)),
                            W = R ? R[x] : 0;
                        W && await (f.isElement == null ? void 0 : f.isElement(R)) || (W = u.floating[x] || s.floating[p]);
                        let K = v / 2 - P / 2,
                            q = a[w],
                            U = W - y[p] - a[T],
                            _ = W / 2 - y[p] / 2 + K,
                            b = Gt(q, _, U),
                            E = _t(i) != null && _ != b && s.reference[p] / 2 - (_ < q ? a[w] : a[T]) - y[p] / 2 < 0;
                        return {
                            [d]: c[d] - (E ? _ < q ? q - _ : U - _ : 0),
                            data: {
                                [d]: b,
                                centerOffset: _ - b
                            }
                        }
                    }
                }),
                    mo = {
                        left: "right",
                        right: "left",
                        bottom: "top",
                        top: "bottom"
                    };

                function Nt(t) {
                    return t.replace(/left|right|bottom|top/g, e => mo[e])
                }

                function ho(t, e, n) {
                    n === void 0 && (n = !1);
                    let o = _t(t),
                        l = St(t),
                        r = Qt(l),
                        i = l === "x" ? o === (n ? "end" : "start") ? "right" : "left" : o === "start" ? "bottom" : "top";
                    return e.reference[r] > e.floating[r] && (i = Nt(i)), {
                        main: i,
                        cross: Nt(i)
                    }
                }
                var yo = {
                    start: "end",
                    end: "start"
                };

                function Jt(t) {
                    return t.replace(/start|end/g, e => yo[e])
                }
                var ee = function (t) {
                    return t === void 0 && (t = {}), {
                        name: "flip",
                        options: t,
                        async fn(e) {
                            var n;
                            let {
                                placement: o,
                                middlewareData: l,
                                rects: r,
                                initialPlacement: i,
                                platform: s,
                                elements: f
                            } = e, {
                                mainAxis: u = !0,
                                crossAxis: a = !0,
                                fallbackPlacements: c,
                                fallbackStrategy: d = "bestFit",
                                fallbackAxisSideDirection: p = "none",
                                flipAlignment: y = !0,
                                ...g
                            } = t, w = ft(o), T = ft(i) === i, x = await (s.isRTL == null ? void 0 : s.isRTL(f.floating)), v = c || (T || !y ? [Nt(i)] : function (b) {
                                let E = Nt(b);
                                return [Jt(b), E, Jt(E)]
                            }(i));
                            c || p === "none" || v.push(... function (b, E, M, C) {
                                let S = _t(b),
                                    H = function (J, Q, ut) {
                                        let pt = ["left", "right"],
                                            st = ["right", "left"],
                                            $ = ["top", "bottom"],
                                            dt = ["bottom", "top"];
                                        switch (J) {
                                            case "top":
                                            case "bottom":
                                                return ut ? Q ? st : pt : Q ? pt : st;
                                            case "left":
                                            case "right":
                                                return Q ? $ : dt;
                                            default:
                                                return []
                                        }
                                    }(ft(b), M === "start", C);
                                return S && (H = H.map(J => J + "-" + S), E && (H = H.concat(H.map(Jt)))), H
                            }(i, y, p, x));
                            let P = [i, ...v],
                                R = await Zt(e, g),
                                W = [],
                                K = ((n = l.flip) == null ? void 0 : n.overflows) || [];
                            if (u && W.push(R[w]), a) {
                                let {
                                    main: b,
                                    cross: E
                                } = ho(o, r, x);
                                W.push(R[b], R[E])
                            }
                            if (K = [...K, {
                                placement: o,
                                overflows: W
                            }], !W.every(b => b <= 0)) {
                                var q, U;
                                let b = (((q = l.flip) == null ? void 0 : q.index) || 0) + 1,
                                    E = P[b];
                                if (E) return {
                                    data: {
                                        index: b,
                                        overflows: K
                                    },
                                    reset: {
                                        placement: E
                                    }
                                };
                                let M = (U = K.filter(C => C.overflows[0] <= 0).sort((C, S) => C.overflows[1] - S.overflows[1])[0]) == null ? void 0 : U.placement;
                                if (!M) switch (d) {
                                    case "bestFit": {
                                        var _;
                                        let C = (_ = K.map(S => [S.placement, S.overflows.filter(H => H > 0).reduce((H, J) => H + J, 0)]).sort((S, H) => S[1] - H[1])[0]) == null ? void 0 : _[0];
                                        C && (M = C);
                                        break
                                    }
                                    case "initialPlacement":
                                        M = i
                                }
                                if (o !== M) return {
                                    reset: {
                                        placement: M
                                    }
                                }
                            }
                            return {}
                        }
                    }
                };
                var oe = function (t) {
                    return t === void 0 && (t = 0), {
                        name: "offset",
                        options: t,

                    }
                };

                function go(t) {
                    return t === "x" ? "y" : "x"
                }
                var ne = function (t) {
                    return t === void 0 && (t = {}), {
                        name: "shift",
                        options: t,
                        async fn(e) {
                            let {
                                x: n,
                                y: o,
                                placement: l
                            } = e, {
                                mainAxis: r = !0,
                                crossAxis: i = !1,
                                limiter: s = {
                                    fn: w => {
                                        let {
                                            x: T,
                                            y: x
                                        } = w;
                                        return {
                                            x: T,
                                            y: x
                                        }
                                    }
                                },
                                ...f
                            } = t, u = {
                                x: n,
                                y: o
                            }, a = await Zt(e, f), c = St(ft(l)), d = go(c), p = u[c], y = u[d];
                            if (r) {
                                let w = c === "y" ? "bottom" : "right";
                                p = Gt(p + a[c === "y" ? "top" : "left"], p, p - a[w])
                            }
                            if (i) {
                                let w = d === "y" ? "bottom" : "right";
                                y = Gt(y + a[d === "y" ? "top" : "left"], y, y - a[w])
                            }
                            let g = s.fn({
                                ...e,
                                [c]: p,
                                [d]: y
                            });
                            return {
                                ...g,
                                data: {
                                    x: g.x - n,
                                    y: g.y - o
                                }
                            }
                        }
                    }
                };

                function V(t) {
                    var e;
                    return ((e = t.ownerDocument) == null ? void 0 : e.defaultView) || window
                }

                function G(t) {
                    return V(t).getComputedStyle(t)
                }
                var Le = Math.min,
                    Pt = Math.max,
                    Kt = Math.round;

                function Ce(t) {
                    let e = G(t),
                        n = parseFloat(e.width),
                        o = parseFloat(e.height),
                        l = t.offsetWidth,
                        r = t.offsetHeight,
                        i = Kt(n) !== l || Kt(o) !== r;
                    return i && (n = l, o = r), {
                        width: n,
                        height: o,
                        fallback: i
                    }
                }

                function rt(t) {
                    return De(t) ? (t.nodeName || "").toLowerCase() : ""
                }
                var Ft;

                function ke() {
                    if (Ft) return Ft;
                    let t = navigator.userAgentData;
                    return t && Array.isArray(t.brands) ? (Ft = t.brands.map(e => e.brand + "/" + e.version).join(" "), Ft) : navigator.userAgent
                }

                function Y(t) {
                    return t instanceof V(t).HTMLElement
                }

                function ot(t) {
                    return t instanceof V(t).Element
                }

                function De(t) {
                    return t instanceof V(t).Node
                }

                function Re(t) {
                    return typeof ShadowRoot > "u" ? !1 : t instanceof V(t).ShadowRoot || t instanceof ShadowRoot
                }

                function It(t) {
                    let {
                        overflow: e,
                        overflowX: n,
                        overflowY: o,
                        display: l
                    } = G(t);
                    return /auto|scroll|overlay|hidden|clip/.test(e + o + n) && !["inline", "contents"].includes(l)
                }

                function wo(t) {
                    return ["table", "td", "th"].includes(rt(t))
                }

                function re(t) {
                    let e = /firefox/i.test(ke()),
                        n = G(t),
                        o = n.backdropFilter || n.WebkitBackdropFilter;
                    return n.transform !== "none" || n.perspective !== "none" || !!o && o !== "none" || e && n.willChange === "filter" || e && !!n.filter && n.filter !== "none" || ["transform", "perspective"].some(l => n.willChange.includes(l)) || ["paint", "layout", "strict", "content"].some(l => {
                        let r = n.contain;
                        return r != null && r.includes(l)
                    })
                }

                function ie() {
                    return /^((?!chrome|android).)*safari/i.test(ke())
                }

                function le(t) {
                    return ["html", "body", "#document"].includes(rt(t))
                }

                function Me(t) {
                    return ot(t) ? t : t.contextElement
                }
                var He = {
                };

                function Tt(t) {
                    let e = Me(t);
                    if (!Y(e)) return He;
                    let n = e.getBoundingClientRect(),
                        {
                        } = Ce(e),
                        i = (r ? Kt(n.width) : n.width) / o,
                        s = (r ? Kt(n.height) : n.height) / l;
                    return i && Number.isFinite(i) || (i = 1), s && Number.isFinite(s) || (s = 1), {
                        x: i,
                        y: s
                    }
                }

                function Ct(t, e, n, o) {

                }

                function nt(t) {
                    return ((De(t) ? t.ownerDocument : t.document) || window.document).documentElement
                }

                function Vt(t) {
                    return ot(t) ? {
                        scrollLeft: t.scrollLeft,
                        scrollTop: t.scrollTop
                    } : {
                        scrollLeft: t.pageXOffset,
                        scrollTop: t.pageYOffset
                    }
                }

                function Be(t) {
                    return Ct(nt(t)).left + Vt(t).scrollLeft
                }

                function kt(t) {
                    if (rt(t) === "html") return t;
                    let e = t.assignedSlot || t.parentNode || Re(t) && t.host || nt(t);
                    return Re(e) ? e.host : e
                }

                function Oe(t) {
                    let e = kt(t);
                    return le(e) ? e.ownerDocument.body : Y(e) && It(e) ? e : Oe(e)
                }

                function We(t, e) {
                    var n;
                    e === void 0 && (e = []);
                    let o = Oe(t),
                        l = o === ((n = t.ownerDocument) == null ? void 0 : n.body),
                        r = V(o);
                    return l ? e.concat(r, r.visualViewport || [], It(o) ? o : []) : e.concat(o, We(o))
                }

                function _e(t, e, n) {

                }

                function Se(t, e) {
                }

                function Pe(t, e) {
                }

                function To(t, e, n) {
                    let o = Y(e),
                        l = nt(e),
                        r = Ct(t, !0, n === "fixed", e),
                        i = {
                            scrollLeft: 0,
                            scrollTop: 0
                        },
                        s = {
                            x: 0,
                            y: 0
                        };
                    if (o || !o && n !== "fixed")
                        if ((rt(e) !== "body" || It(l)) && (i = Vt(e)), Y(e)) {
                            let f = Ct(e, !0);
                            s.x = f.x + e.clientLeft, s.y = f.y + e.clientTop
                        } else l && (s.x = Be(l));
                    return {
                        x: r.left + i.scrollLeft - s.x,
                        y: r.top + i.scrollTop - s.y,
                        width: r.width,
                        height: r.height
                    }
                }
                var xo = {
                    getClippingRect: function (t) {
                        let {
                            element: e,
                            boundary: n,
                            rootBoundary: o,
                            strategy: l
                        } = t, r = n === "clippingAncestors" ? function (u, a) {
                            let c = a.get(u);
                            if (c) return c;
                            let d = We(u).filter(w => ot(w) && rt(w) !== "body"),
                                p = null,
                                y = G(u).position === "fixed",
                                g = y ? kt(u) : u;
                            for (; ot(g) && !le(g);) {
                                let w = G(g),
                                    T = re(g);
                                w.position === "fixed" ? p = null : (y ? T || p : T || w.position !== "static" || !p || !["absolute", "fixed"].includes(p.position)) ? p = w : d = d.filter(x => x !== g), g = kt(g)
                            }
                            return a.set(u, d), d
                        }(e, this._c) : [].concat(n), i = [...r, o], s = i[0], f = i.reduce((u, a) => {
                            let c = _e(e, a, l);
                            return u.top = Pt(c.top, u.top), u.right = Le(c.right, u.right), u.bottom = Le(c.bottom, u.bottom), u.left = Pt(c.left, u.left), u
                        }, _e(e, s, l));
                        return {
                            width: f.right - f.left,
                            height: f.bottom - f.top,
                            x: f.left,
                            y: f.top
                        }
                    },
                    convertOffsetParentRelativeRectToViewportRelativeRect: function (t) {
                        let {
                            rect: e,
                            offsetParent: n,
                            strategy: o
                        } = t, l = Y(n), r = nt(n);
                        if (n === r) return e;
                        let i = {
                            scrollLeft: 0,
                            scrollTop: 0
                        },
                            s = {
                                x: 1,
                                y: 1
                            },
                            f = {
                                x: 0,
                                y: 0
                            };
                        if ((l || !l && o !== "fixed") && ((rt(n) !== "body" || It(r)) && (i = Vt(n)), Y(n))) {
                            let u = Ct(n);
                            s = Tt(n), f.x = u.x + n.clientLeft, f.y = u.y + n.clientTop
                        }
                        return {
                            width: e.width * s.x,
                            height: e.height * s.y,
                            x: e.x * s.x - i.scrollLeft * s.x + f.x,
                            y: e.y * s.y - i.scrollTop * s.y + f.y
                        }
                    },
                    isElement: ot,
                    getDimensions: function (t) {
                        return Y(t) ? Ce(t) : t.getBoundingClientRect()
                    },
                    getOffsetParent: Pe,
                    getDocumentElement: nt,
                    getScale: Tt,
                    async getElementRects(t) {
                        let {
                            reference: e,
                            floating: n,
                            strategy: o
                        } = t, l = this.getOffsetParent || Pe, r = this.getDimensions;
                        return {
                            reference: To(e, await l(n), o),
                            floating: {
                                x: 0,
                                y: 0,
                                ...await r(n)
                            }
                        }
                    },
                    getClientRects: t => Array.from(t.getClientRects()),
                    isRTL: t => G(t).direction === "rtl"
                };
                var se = (t, e, n) => {
                    let o = new Map,
                        l = {
                            platform: xo,
                            ...n
                        },
                        r = {
                            ...l.platform,
                            _c: o
                        };
                    return Ee(t, e, {
                        ...l,
                        platform: r
                    })
                };
                var ce = async ({
                    elementReference: t = null,
                    tooltipReference: e = null,
                    tooltipArrowReference: n = null,
                    place: o = "top",
                    offset: l = 10,
                    strategy: r = "absolute",
                    middlewares: i = [oe(Number(l)), ee(), ne({
                        padding: 5
                    })]
                }) => {
                    if (!t) return {
                        tooltipStyles: {},
                        tooltipArrowStyles: {},
                        place: o
                    };
                    if (e === null) return {
                        tooltipStyles: {},
                        tooltipArrowStyles: {},
                        place: o
                    };
                    let s = i;
                    return n ? (s.push(te({
                        element: n,
                        padding: 5
                    })), se(t, e, {
                        placement: o,
                        strategy: r,
                        middleware: s
                    }).then(({
                        x: f,
                        y: u,
                        placement: a,
                        middlewareData: c
                    }) => {
                        var T, x;
                        let d = {
                            left: `${f}px`,
                            top: `${u}px`
                        },
                            {
                                x: p,
                                y
                            } = (T = c.arrow) != null ? T : {
                                x: 0,
                                y: 0
                            },
                            g = (x = {
                                top: "bottom",
                                right: "left",
                                bottom: "top",
                                left: "right"
                            }[a.split("-")[0]]) != null ? x : "bottom",
                            w = {
                                left: p != null ? `${p}px` : "",
                                top: y != null ? `${y}px` : "",
                                right: "",
                                bottom: "",
                                [g]: "-4px"
                            };
                        return {
                            tooltipStyles: d,
                            tooltipArrowStyles: w,
                            place: a
                        }
                    })) : se(t, e, {
                        placement: "bottom",
                        strategy: r,
                        middleware: s
                    }).then(({
                        x: f,
                        y: u,
                        placement: a
                    }) => ({
                        tooltipStyles: {
                            left: `${f}px`,
                            top: `${u}px`
                        },
                        tooltipArrowStyles: {},
                        place: a
                    }))
                };
                var it = {
                    arrow: "react-tooltip__arrow_KtSkBq",
                    clickable: "react-tooltip__clickable_KtSkBq",
                    dark: "react-tooltip__dark_KtSkBq",
                    error: "react-tooltip__error_KtSkBq",
                    fixed: "react-tooltip__fixed_KtSkBq",
                    info: "react-tooltip__info_KtSkBq",
                    light: "react-tooltip__light_KtSkBq",
                    noArrow: "react-tooltip__no-arrow_KtSkBq",
                    show: "react-tooltip__show_KtSkBq",
                    success: "react-tooltip__success_KtSkBq",
                    tooltip: "react-tooltip__tooltip_KtSkBq",
                    warning: "react-tooltip__warning_KtSkBq"
                };
                var vo = ({
                    id: t,
                    className: e,
                    classNameArrow: n,
                    variant: o = "dark",
                    anchorId: l,
                    anchorSelect: r,
                    place: i = "top",
                    offset: s = 10,
                    events: f = ["hover"],
                    openOnClick: u = !1,
                    positionStrategy: a = "absolute",
                    middlewares: c,
                    wrapper: d,
                    delayShow: p = 0,
                    delayHide: y = 0,
                    float: g = !1,
                    noArrow: w = !1,
                    clickable: T = !1,
                    closeOnEsc: x = !1,
                    style: v,
                    position: P,
                    afterShow: R,
                    afterHide: W,
                    content: K,
                    isOpen: q,
                    setIsOpen: U,
                    activeAnchor: _,
                    setActiveAnchor: b
                }) => {
                    let E = (0, react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null),
                        M = (0, react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null),
                        C = (0, react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null),
                        S = (0, react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null),
                        [H, J] = (0, react__WEBPACK_IMPORTED_MODULE_0__.useState)(i),
                        [Q, ut] = (0, react__WEBPACK_IMPORTED_MODULE_0__.useState)({}),
                        [pt, st] = (0, react__WEBPACK_IMPORTED_MODULE_0__.useState)({}),
                        [$, dt] = (0, react__WEBPACK_IMPORTED_MODULE_0__.useState)(!1),
                        [Dt, mt] = (0, react__WEBPACK_IMPORTED_MODULE_0__.useState)(!1),
                        Mt = (0, react__WEBPACK_IMPORTED_MODULE_0__.useRef)(!1),
                        vt = (0, react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null),
                        {
                            anchorRefs: Ht,
                            setActiveAnchor: zt
                        } = at(t),
                        bt = (0, react__WEBPACK_IMPORTED_MODULE_0__.useRef)(!1),
                        [et, Et] = (0, react__WEBPACK_IMPORTED_MODULE_0__.useState)([]),
                        ct = (0, react__WEBPACK_IMPORTED_MODULE_0__.useRef)(!1),
                        ht = u || f.includes("click");
                    ve(() => (ct.current = !0, () => {
                        ct.current = !1
                    }), []), (0, react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
                        if (!$) {
                            let m = setTimeout(() => {
                                mt(!1)
                            }, 150);
                            return () => {
                                clearTimeout(m)
                            }
                        }
                        return () => null
                    }, [$]);
                    let N = m => {
                        ct.current && (m && mt(!0), setTimeout(() => {
                            ct.current && (U == null || U(m), q === void 0 && dt(m))
                        }, 10))
                    };
                    (0, react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
                        if (q === void 0) return () => null;
                        q && mt(!0);
                        let m = setTimeout(() => {
                            dt(q)
                        }, 10);
                        return () => {
                            clearTimeout(m)
                        }
                    }, [q]), (0, react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
                        $ !== Mt.current && (Mt.current = $, $ ? R == null || R() : W == null || W())
                    }, [$]);
                    let jt = () => {
                        C.current && clearTimeout(C.current), C.current = setTimeout(() => {
                            N(!0)
                        }, p)
                    },
                        yt = (m = y) => {
                            S.current && clearTimeout(S.current), S.current = setTimeout(() => {
                                bt.current || N(!1)
                            }, m)
                        },
                        At = m => {
                            var L;
                            if (!m) return;
                            p ? jt() : N(!0);
                            let A = (L = m.currentTarget) != null ? L : m.target;
                            b(A), zt({
                                current: A
                            }), S.current && clearTimeout(S.current)
                        },
                        Lt = () => {
                            T ? yt(y || 100) : y ? yt() : N(!1), C.current && clearTimeout(C.current)
                        },
                        gt = ({
                            x: m,
                            y: A
                        }) => {
                            ce({
                                place: i,
                                offset: s,
                                elementReference: {
                                    getBoundingClientRect() {
                                        return {
                                            x: m,
                                            y: A,
                                            width: 0,
                                            height: 0,
                                            top: A,
                                            left: m,
                                            right: m,
                                            bottom: A
                                        }
                                    }
                                },
                                tooltipReference: E.current,
                                tooltipArrowReference: M.current,
                                strategy: a,
                                middlewares: c
                            }).then(k => {
                                Object.keys(k.tooltipStyles).length && ut(k.tooltipStyles), Object.keys(k.tooltipArrowStyles).length && st(k.tooltipArrowStyles), J(k.place)
                            })
                        },
                        wt = m => {
                            if (!m) return;
                            let A = m,
                                L = {
                                    x: A.clientX,
                                    y: A.clientY
                                };
                            gt(L), vt.current = L
                        },
                        pe = m => {
                            At(m), y && yt()
                        },
                        B = m => {
                            var k;
                            [document.querySelector(`[id='${l}']`), ...et].some(O => O == null ? void 0 : O.contains(m.target)) || (k = E.current) != null && k.contains(m.target) || N(!1)
                        },
                        I = m => {
                            m.key === "Escape" && N(!1)
                        },
                        h = Yt(At, 50),
                        D = Yt(Lt, 50);
                    (0, react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
                        var F, z;
                        let m = new Set(Ht);
                        et.forEach(j => {
                            m.add({
                                current: j
                            })
                        });
                        let A = document.querySelector(`[id='${l}']`);
                        A && m.add({
                            current: A
                        }), x && window.addEventListener("keydown", I);
                        let L = [];
                        ht ? (window.addEventListener("click", B), L.push({
                            event: "click",
                            listener: pe
                        })) : (L.push({
                            event: "mouseenter",
                            listener: h
                        }, {
                            event: "mouseleave",
                            listener: D
                        }, {
                            event: "focus",
                            listener: h
                        }, {
                            event: "blur",
                            listener: D
                        }), g && L.push({
                            event: "mousemove",
                            listener: wt
                        }));
                        let k = () => {
                            bt.current = !0
                        },
                            O = () => {
                                bt.current = !1, Lt()
                            };
                        return T && !ht && ((F = E.current) == null || F.addEventListener("mouseenter", k), (z = E.current) == null || z.addEventListener("mouseleave", O)), L.forEach(({
                            event: j,
                            listener: Bt
                        }) => {
                            m.forEach(Xt => {
                                var Ot;
                                (Ot = Xt.current) == null || Ot.addEventListener(j, Bt)
                            })
                        }), () => {
                            var j, Bt;
                            ht && window.removeEventListener("click", B), x && window.removeEventListener("keydown", I), T && !ht && ((j = E.current) == null || j.removeEventListener("mouseenter", k), (Bt = E.current) == null || Bt.removeEventListener("mouseleave", O)), L.forEach(({
                                event: Xt,
                                listener: Ot
                            }) => {
                                m.forEach(Fe => {
                                    var de;
                                    (de = Fe.current) == null || de.removeEventListener(Xt, Ot)
                                })
                            })
                        }
                    }, [Dt, Ht, et, x, f]), (0, react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
                        let m = r != null ? r : "";
                        !m && t && (m = `[data-tooltip-id='${t}']`);
                        let A = k => {
                            let O = [];
                            k.forEach(F => {
                                if (F.type === "attributes" && F.attributeName === "data-tooltip-id" && F.target.getAttribute("data-tooltip-id") === t && O.push(F.target), F.type === "childList" && (_ && [...F.removedNodes].some(z => z.contains(_) ? (mt(!1), N(!1), b(null), !0) : !1), !!m)) try {
                                    let z = [...F.addedNodes].filter(j => j.nodeType === 1);
                                    O.push(...z.filter(j => j.matches(m))), O.push(...z.flatMap(j => [...j.querySelectorAll(m)]))
                                } catch (z) { }
                            }), O.length && Et(F => [...F, ...O])
                        },
                            L = new MutationObserver(A);
                        return L.observe(document.body, {
                            childList: !0,
                            subtree: !0,
                            attributes: !0,
                            attributeFilter: ["data-tooltip-id"]
                        }), () => {
                            L.disconnect()
                        }
                    }, [t, r, _]), (0, react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
                        if (P) {
                            gt(P);
                            return
                        }
                        if (g) {
                            vt.current && gt(vt.current);
                            return
                        }
                        ce({
                            place: i,
                            offset: s,
                            elementReference: _,
                            tooltipReference: E.current,
                            tooltipArrowReference: M.current,
                            strategy: a,
                            middlewares: c
                        }).then(m => {
                            ct.current && (Object.keys(m.tooltipStyles).length && ut(m.tooltipStyles), Object.keys(m.tooltipArrowStyles).length && st(m.tooltipArrowStyles), J(m.place))
                        })
                    }, [$, _, K, i, s, a, P]), (0, react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
                        var L;
                        let m = document.querySelector(`[id='${l}']`),
                            A = [...et, m];
                        (!_ || !A.includes(_)) && b((L = et[0]) != null ? L : m)
                    }, [l, et, _]), (0, react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => () => {
                        C.current && clearTimeout(C.current), S.current && clearTimeout(S.current)
                    }, []), (0, react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
                        let m = r;
                        if (!m && t && (m = `[data-tooltip-id='${t}']`), !!m) try {
                            let A = Array.from(document.querySelectorAll(m));
                            Et(A)
                        } catch (A) {
                            Et([])
                        }
                    }, [t, r]);
                    let Z = K && $ && Object.keys(Q).length > 0;
                    return Dt ? (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(d, {
                        id: t,
                        role: "tooltip",
                        className: (0, ae.default)("react-tooltip", it.tooltip, it[o], e, `react-tooltip__place-${H}`, {
                            [it.show]: Z,
                            [it.fixed]: a === "fixed",
                            [it.clickable]: T
                        }),
                        style: {
                            ...v,
                            ...Q
                        },
                        ref: E,
                        children: [K, (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(d, {
                            className: (0, ae.default)("react-tooltip-arrow", it.arrow, n, {
                                [it.noArrow]: w
                            }),
                            style: pt,
                            ref: M
                        })]
                    }) : null
                },
                    fe = vo;
                var Ao = ({
                    content: t
                }) => (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
                    dangerouslySetInnerHTML: {
                        __html: t
                    }
                }),
                    ue = Ao;
                var Ro = ({
                    id: t,
                    anchorId: e,
                    anchorSelect: n,
                    content: o,
                    html: l,
                    render: r,
                    className: i,
                    classNameArrow: s,
                    variant: f = "dark",
                    place: u = "top",
                    offset: a = 10,
                    wrapper: c = "div",
                    children: d = null,
                    events: p = ["hover"],
                    openOnClick: y = !1,
                    positionStrategy: g = "absolute",
                    middlewares: w,
                    delayShow: T = 0,
                    delayHide: x = 0,
                    float: v = !1,
                    noArrow: P = !1,
                    clickable: R = !1,
                    closeOnEsc: W = !1,
                    style: K,
                    position: q,
                    isOpen: U,
                    setIsOpen: _,
                    afterShow: b,
                    afterHide: E
                }) => {
                    let [M, C] = (0, react__WEBPACK_IMPORTED_MODULE_0__.useState)(o), [S, H] = (0, react__WEBPACK_IMPORTED_MODULE_0__.useState)(l), [J, Q] = (0, react__WEBPACK_IMPORTED_MODULE_0__.useState)(u), [ut, pt] = (0, react__WEBPACK_IMPORTED_MODULE_0__.useState)(f), [st, $] = (0, react__WEBPACK_IMPORTED_MODULE_0__.useState)(a), [dt, Dt] = (0, react__WEBPACK_IMPORTED_MODULE_0__.useState)(T), [mt, Mt] = (0, react__WEBPACK_IMPORTED_MODULE_0__.useState)(x), [vt, Ht] = (0, react__WEBPACK_IMPORTED_MODULE_0__.useState)(v), [zt, bt] = (0, react__WEBPACK_IMPORTED_MODULE_0__.useState)(c), [et, Et] = (0, react__WEBPACK_IMPORTED_MODULE_0__.useState)(p), [ct, ht] = (0, react__WEBPACK_IMPORTED_MODULE_0__.useState)(g), [N, jt] = (0, react__WEBPACK_IMPORTED_MODULE_0__.useState)(null), {
                        anchorRefs: yt,
                        activeAnchor: At
                    } = at(t), Lt = B => B == null ? void 0 : B.getAttributeNames().reduce((h, D) => {
                        var Z;
                        if (D.startsWith("data-tooltip-")) {
                            let m = D.replace(/^data-tooltip-/, "");
                            h[m] = (Z = B == null ? void 0 : B.getAttribute(D)) != null ? Z : null
                        }
                        return h
                    }, {}), gt = B => {
                        let I = {
                            place: h => {
                                Q(h != null ? h : u)
                            },
                            content: h => {
                                C(h != null ? h : o)
                            },
                            html: h => {
                                H(h != null ? h : l)
                            },
                            variant: h => {
                                pt(h != null ? h : f)
                            },
                            offset: h => {
                                $(h === null ? a : Number(h))
                            },
                            wrapper: h => {
                                bt(h != null ? h : c)
                            },
                            events: h => {
                                let D = h == null ? void 0 : h.split(" ");
                                Et(D != null ? D : p)
                            },
                            "position-strategy": h => {
                                ht(h != null ? h : g)
                            },
                            "delay-show": h => {
                                Dt(h === null ? T : Number(h))
                            },
                            "delay-hide": h => {
                                Mt(h === null ? x : Number(h))
                            },
                            float: h => {
                                Ht(h === null ? v : h === "true")
                            }
                        };
                        Object.values(I).forEach(h => h(null)), Object.entries(B).forEach(([h, D]) => {
                            var Z;
                            (Z = I[h]) == null || Z.call(I, D)
                        })
                    };
                    (0, react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
                        C(o)
                    }, [o]), (0, react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
                        H(l)
                    }, [l]), (0, react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
                        Q(u)
                    }, [u]), (0, react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
                        var L;
                        let B = new Set(yt),
                            I = n;
                        if (!I && t && (I = `[data-tooltip-id='${t}']`), I) try {
                            document.querySelectorAll(I).forEach(O => {
                                B.add({
                                    current: O
                                })
                            })
                        } catch (k) { }
                        let h = document.querySelector(`[id='${e}']`);
                        if (h && B.add({
                            current: h
                        }), !B.size) return () => null;
                        let D = (L = N != null ? N : h) != null ? L : At.current,
                            Z = k => {
                                k.forEach(O => {
                                    var z;
                                    if (!D || O.type !== "attributes" || !((z = O.attributeName) != null && z.startsWith("data-tooltip-"))) return;
                                    let F = Lt(D);
                                    gt(F)
                                })
                            },
                            m = new MutationObserver(Z),
                            A = {
                                attributes: !0,
                                childList: !1,
                                subtree: !1
                            };
                        if (D) {
                            let k = Lt(D);
                            gt(k), m.observe(D, A)
                        }
                        return () => {
                            m.disconnect()
                        }
                    }, [yt, At, N, e, n]);
                    let wt = d;
                    return r ? wt = r({
                        content: M != null ? M : null,
                        activeAnchor: N
                    }) : M && (wt = M), S && (wt = (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(ue, {
                        content: S
                    })), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(fe, {
                        ...{
                            id: t,
                            anchorId: e,
                            anchorSelect: n,
                            className: i,
                            classNameArrow: s,
                            content: wt,
                            place: J,
                            variant: ut,
                            offset: st,
                            wrapper: zt,
                            events: et,
                            openOnClick: y,
                            positionStrategy: ct,
                            middlewares: w,
                            delayShow: dt,
                            delayHide: mt,
                            float: vt,
                            noArrow: P,
                            clickable: R,
                            closeOnEsc: W,
                            style: K,
                            position: q,
                            isOpen: U,
                            setIsOpen: _,
                            afterShow: b,
                            afterHide: E,
                            activeAnchor: N,
                            setActiveAnchor: B => jt(B)
                        }
                    })
                },
                    Ne = Ro;
                /*! Bundled license information:

                classnames/index.js:
                  (*!
                        Copyright (c) 2018 Jed Watson.
                        Licensed under the MIT License (MIT), see
                        http://jedwatson.github.io/classnames
                  *)
                */
                //# sourceMappingURL=react-tooltip.esm.min.js.map


                /***/
            })

    }
]);