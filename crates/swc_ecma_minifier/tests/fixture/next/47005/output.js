(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
    [
        502
    ],
    {
        /***/ 9145: /***/ function(j, k, m) {
            "use strict";
            let R, B;
            /* harmony export */ m.d(k, {
                /* harmony export */ u: function() {
                    return /* binding */ eu;
                }
            });
            /* unused harmony exports TooltipProvider, TooltipWrapper */ /* harmony import */ var C, S = m(7294);
            /* harmony import */ var N = m(5893);
            var $ = Object.create;
            var D = Object.defineProperty;
            var M = Object.getOwnPropertyDescriptor;
            var F = Object.getOwnPropertyNames;
            var I = Object.getPrototypeOf, H = Object.prototype.hasOwnProperty;
            var V = (S, m, h, E)=>{
                if (m && "object" == typeof m || "function" == typeof m) for (let k of F(m))H.call(S, k) || k === h || D(S, k, {
                    get: ()=>m[k],
                    enumerable: !(E = M(m, k)) || E.enumerable
                });
                return S;
            };
            var h = (m, h, S)=>(S = null != m ? $(I(m)) : {}, V(!h && m && m.__esModule ? S : D(S, "default", {}), m));
            var E = (R = ()=>{}, ()=>(B || R((B = {
                    exports: {}
                }).exports, B), B.exports));
            var W = h(E());
            var X = ()=>{};
            (0, S.createContext)({});
            function A(m = "DEFAULT_TOOLTIP_ID") {}
            h(E());
            var Y = "undefined" != typeof window ? S.useLayoutEffect : S.useEffect;
            var z = async ()=>{};
            var G = (m)=>({});
            var J = function() {};
            var Q = function(m) {
                return void 0 === m && (m = 0), {
                    name: "offset",
                    options: m
                };
            };
            var Z = function() {};
            function ee(m) {}
            function O(m) {}
            function et(m) {}
            function L(m, S) {}
            var er = {
                getClippingRect: function(E) {
                    var k, R, A;
                    let { element: L, boundary: S, rootBoundary: j, strategy: B } = E, h = [
                        ..."clippingAncestors" === S ? function(m, S) {
                            var k, A, L;
                            let h = S.get(m);
                            if (h) return h;
                            let E = (void (k = 0)).filter((m)=>{
                                var S;
                                return O(m) && (S = 0, true);
                            }), j = null, R = "fixed" === ee(m).position, B = R ? et(m) : m;
                            for(; O(B) && (L = 0, true);){
                                let m = ee(B), S = function(E) {
                                    let S = /firefox/i.test(function() {
                                        if (C) return C;
                                        let m = navigator.userAgentData;
                                        return m && Array.isArray(m.brands) ? C = m.brands.map((m)=>m.brand + "/" + m.version).join(" ") : navigator.userAgent;
                                    }()), m = ee(E), h = m.backdropFilter || m.WebkitBackdropFilter;
                                    return "none" !== m.transform || "none" !== m.perspective || !!h && "none" !== h || S && "filter" === m.willChange || S && !!m.filter && "none" !== m.filter || [
                                        "transform",
                                        "perspective"
                                    ].some((S)=>m.willChange.includes(S)) || [
                                        "paint",
                                        "layout",
                                        "strict",
                                        "content"
                                    ].some((h)=>{
                                        let S = m.contain;
                                        return null != S && S.includes(h);
                                    });
                                }(B);
                                "fixed" === m.position ? j = null : (R ? S || j : S || "static" !== m.position || !j || ![
                                    "absolute",
                                    "fixed"
                                ].includes(j.position)) ? j = m : E = E.filter((m)=>m !== B), B = et(B);
                            }
                            return S.set(m, E), E;
                        }(L, this._c) : [].concat(S),
                        j
                    ], N = h[0], m = h.reduce(()=>{}, (k = 0, R = 0, void (A = 0)));
                    return {
                        width: m.right - m.left,
                        height: m.bottom - m.top,
                        x: m.left,
                        y: m.top
                    };
                },
                convertOffsetParentRelativeRectToViewportRelativeRect: function() {},
                isElement: O,
                getDimensions: function(m) {
                    var S, h;
                    return (S = 0), m.getBoundingClientRect();
                },
                getOffsetParent: L,
                getDocumentElement: function(m) {},
                getScale: function(m) {},
                async getElementRects (S) {
                    var h, E, k;
                    let { reference: O, floating: m, strategy: j } = S, R = this.getOffsetParent || L, A = this.getDimensions;
                    return {
                        reference: (h = 0, E = await R(m), void (k = 0)),
                        floating: {
                            x: 0,
                            y: 0,
                            ...await A(m)
                        }
                    };
                },
                getClientRects: (m)=>Array.from(m.getClientRects()),
                isRTL: (m)=>"rtl" === ee(m).direction
            };
            var en = (S, h, E)=>{
                let k = new Map, m = {
                    platform: er,
                    ...E
                }, R = {
                    ...m.platform,
                    _c: k
                };
                return z(S, h, {
                    ...m,
                    platform: R
                });
            };
            var eo = async ({ elementReference: m = null, tooltipReference: S = null, tooltipArrowReference: k = null, place: h = "top", offset: A = 10, strategy: R = "absolute", middlewares: E = [
                Q(Number(A)),
                J(),
                Z({
                    padding: 5
                })
            ] })=>{
                if (!m) return {
                    tooltipStyles: {},
                    tooltipArrowStyles: {},
                    place: h
                };
                if (null === S) return {
                    tooltipStyles: {},
                    tooltipArrowStyles: {},
                    place: h
                };
                return k ? (E.push(G({
                    element: k,
                    padding: 5
                })), en(m, S, {
                    placement: h,
                    strategy: R,
                    middleware: E
                }).then(()=>{})) : en(m, S, {
                    placement: "bottom",
                    strategy: R,
                    middleware: E
                }).then(({ x: m, y: S, placement: h })=>({
                        tooltipStyles: {
                            left: `${m}px`,
                            top: `${S}px`
                        },
                        tooltipArrowStyles: {},
                        place: h
                    }));
            };
            var el = {
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
            var ei = ({})=>{
                let R = (0, S.useRef)(null), O = (0, S.useRef)(null), M = (0, S.useRef)(null), F = (0, S.useRef)(null), [L, I] = (0, S.useState)(i), [h, H] = (0, S.useState)({}), [j, V] = (0, S.useState)({}), [m, z] = (0, S.useState)(!1), [E, G] = (0, S.useState)(!1), J = (0, S.useRef)(null), { anchorRefs: B } = A(t), Q = (0, S.useRef)(!1), [k, Z] = (0, S.useState)([]), ee = (0, S.useRef)(!1), et = u || f.includes("click");
                Y(()=>(ee.current = !0, ()=>{
                        ee.current = !1;
                    }), []), (0, S.useEffect)(()=>{
                    if (!m) {
                        let m = setTimeout(()=>{
                            G(!1);
                        }, 150);
                        return ()=>{
                            clearTimeout(m);
                        };
                    }
                    return ()=>null;
                }, [
                    m
                ]);
                let er = (m)=>{
                    ee.current && (m && G(!0), setTimeout(()=>{
                        ee.current && (null == U || U(m), void 0 === q && z(m));
                    }, 10));
                };
                (0, S.useEffect)(()=>{
                    if (void 0 === q) return ()=>null;
                    q && G(!0);
                    return ()=>{};
                }, [
                    q
                ]), (0, S.useEffect)(()=>{}, [
                    m
                ]);
                let en = (m = y)=>{}, C = ()=>{}, $ = ()=>{}, ei = ({})=>{}, ea = (m)=>{
                    if (!m) return;
                    let S = {
                        x: m.clientX,
                        y: m.clientY
                    };
                    ei(S), J.current = S;
                }, eu = (m)=>{
                    C(m), y && en();
                }, es = (S)=>{
                    var m;
                    [
                        document.querySelector(`[id='${l}']`),
                        ...k
                    ].some((m)=>null == m ? void 0 : m.contains(S.target)) || null != (m = R.current) && m.contains(S.target) || er(!1);
                }, ec = (m)=>{
                    "Escape" === m.key && er(!1);
                }, ef = X(C, 50), ep = X($, 50);
                (0, S.useEffect)(()=>{
                    var S, h;
                    let A = new Set(B);
                    k.forEach((m)=>{
                        A.add({
                            current: m
                        });
                    });
                    let E = document.querySelector(`[id='${l}']`);
                    E && A.add({
                        current: E
                    }), x && window.addEventListener("keydown", ec);
                    let m = [];
                    et ? (window.addEventListener("click", es), m.push({
                        event: "click",
                        listener: eu
                    })) : (m.push({
                        event: "mouseenter",
                        listener: ef
                    }, {
                        event: "mouseleave",
                        listener: ep
                    }, {
                        event: "focus",
                        listener: ef
                    }, {
                        event: "blur",
                        listener: ep
                    }), g && m.push({
                        event: "mousemove",
                        listener: ea
                    }));
                    let O = ()=>{
                        Q.current = !0;
                    }, L = ()=>{
                        Q.current = !1, $();
                    };
                    return T && !et && (null == (S = R.current) || S.addEventListener("mouseenter", O), null == (h = R.current) || h.addEventListener("mouseleave", L)), m.forEach(({ event: m, listener: S })=>{
                        A.forEach((E)=>{
                            var h;
                            null == (h = E.current) || h.addEventListener(m, S);
                        });
                    }), ()=>{
                        var S, h;
                        et && window.removeEventListener("click", es), x && window.removeEventListener("keydown", ec), T && !et && (null == (S = R.current) || S.removeEventListener("mouseenter", O), null == (h = R.current) || h.removeEventListener("mouseleave", L)), m.forEach(({ event: m, listener: S })=>{
                            A.forEach((E)=>{
                                var h;
                                null == (h = E.current) || h.removeEventListener(m, S);
                            });
                        });
                    };
                }, [
                    E,
                    B,
                    k,
                    x,
                    f
                ]), (0, S.useEffect)(()=>{
                    let m = null != r ? r : "";
                    !m && t && (m = `[data-tooltip-id='${t}']`);
                    let S = new MutationObserver((S)=>{
                        let h = [];
                        S.forEach((S)=>{
                            if ("attributes" === S.type && "data-tooltip-id" === S.attributeName && S.target.getAttribute("data-tooltip-id") === t && h.push(S.target), "childList" === S.type && (_ && [
                                ...S.removedNodes
                            ].some((m)=>m.contains(_) ? (G(!1), er(!1), b(null), !0) : !1), !!m)) try {
                                let E = [
                                    ...S.addedNodes
                                ].filter((m)=>1 === m.nodeType);
                                h.push(...E.filter((S)=>S.matches(m))), h.push(...E.flatMap((S)=>[
                                        ...S.querySelectorAll(m)
                                    ]));
                            } catch (m) {}
                        }), h.length && Z((m)=>[
                                ...m,
                                ...h
                            ]);
                    });
                    return S.observe(document.body, {
                        childList: !0,
                        subtree: !0,
                        attributes: !0,
                        attributeFilter: [
                            "data-tooltip-id"
                        ]
                    }), ()=>{
                        S.disconnect();
                    };
                }, [
                    t,
                    r,
                    _
                ]), (0, S.useEffect)(()=>{
                    if (P) {
                        ei(P);
                        return;
                    }
                    if (g) {
                        J.current && ei(J.current);
                        return;
                    }
                    eo({
                        place: i,
                        offset: s,
                        elementReference: _,
                        tooltipReference: R.current,
                        tooltipArrowReference: O.current,
                        strategy: a,
                        middlewares: c
                    }).then((m)=>{
                        ee.current && (Object.keys(m.tooltipStyles).length && H(m.tooltipStyles), Object.keys(m.tooltipArrowStyles).length && V(m.tooltipArrowStyles), I(m.place));
                    });
                }, [
                    m,
                    _,
                    K,
                    i,
                    s,
                    a,
                    P
                ]), (0, S.useEffect)(()=>{
                    var m;
                    let S = document.querySelector(`[id='${l}']`), h = [
                        ...k,
                        S
                    ];
                    _ && h.includes(_) || b(null != (m = k[0]) ? m : S);
                }, [
                    l,
                    k,
                    _
                ]), (0, S.useEffect)(()=>()=>{
                        M.current && clearTimeout(M.current), F.current && clearTimeout(F.current);
                    }, []), (0, S.useEffect)(()=>{
                    let m = r;
                    if (!m && t && (m = `[data-tooltip-id='${t}']`), !!m) try {
                        let S = Array.from(document.querySelectorAll(m));
                        Z(S);
                    } catch (m) {
                        Z([]);
                    }
                }, [
                    t,
                    r
                ]);
                let D = K && m && Object.keys(h).length > 0;
                return E ? (0, N.jsxs)(d, {
                    id: t,
                    role: "tooltip",
                    className: (0, W.default)("react-tooltip", el.tooltip, el[o], e, `react-tooltip__place-${L}`, {
                        [el.show]: D,
                        [el.fixed]: "fixed" === a,
                        [el.clickable]: T
                    }),
                    style: {
                        ...v,
                        ...h
                    },
                    ref: R,
                    children: [
                        K,
                        (0, N.jsx)(d, {
                            className: (0, W.default)("react-tooltip-arrow", el.arrow, n, {
                                [el.noArrow]: w
                            }),
                            style: j,
                            ref: O
                        })
                    ]
                }) : null;
            };
            var ea = ({ content: m })=>(0, N.jsx)("span", {
                    dangerouslySetInnerHTML: {
                        __html: m
                    }
                });
            var eu = ({ setIsOpen: E })=>{
                let [k, R] = (0, S.useState)(o), [m, O] = (0, S.useState)(l), [L, j] = (0, S.useState)(u), [B, C] = (0, S.useState)(f), [$, D] = (0, S.useState)(a), [M, F] = (0, S.useState)(T), [I, H] = (0, S.useState)(x), [V, W] = (0, S.useState)(v), [X, Y] = (0, S.useState)(c), [z, G] = (0, S.useState)(p), [J, Q] = (0, S.useState)(g), [h, Z] = (0, S.useState)(null), {} = A(t);
                (0, S.useEffect)(()=>{}, [
                    o
                ]), (0, S.useEffect)(()=>{}, [
                    l
                ]), (0, S.useEffect)(()=>{}, [
                    u
                ]), (0, S.useEffect)(()=>{}, [
                    yt,
                    At,
                    h,
                    e,
                    n
                ]);
                let ee = d;
                return r && r({}), m && (0, N.jsx)(ea, {}), (0, N.jsx)(ei, {});
            };
        }
    }
]);
