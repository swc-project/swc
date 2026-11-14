(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
    [
        502
    ],
    {
        /***/ 9145: /***/ function(m, S, h) {
            "use strict";
            let E, k;
            /* harmony export */ h.d(S, {
                /* harmony export */ u: function() {
                    return /* binding */ et;
                }
            });
            /* unused harmony exports TooltipProvider, TooltipWrapper */ /* harmony import */ var R, A = h(7294);
            /* harmony import */ var O = h(5893);
            var L = Object.create;
            var j = Object.defineProperty;
            var B = Object.getOwnPropertyDescriptor;
            var C = Object.getOwnPropertyNames;
            var D = Object.getPrototypeOf, N = Object.prototype.hasOwnProperty;
            var $ = (m, S, h)=>(h = null != m ? L(D(m)) : {}, ((m, S, h)=>{
                    if (S && "object" == typeof S || "function" == typeof S) for (let E of C(S))N.call(m, E) || void 0 === E || j(m, E, {
                        get: ()=>S[E],
                        enumerable: !(h = B(S, E)) || h.enumerable
                    });
                    return m;
                })(!S && m && m.__esModule ? h : j(h, "default", {}), m));
            var I = (E = ()=>{}, ()=>(k || E((k = {
                    exports: {}
                }).exports, k), k.exports));
            var F = $(I());
            var M = ()=>{};
            (0, A.createContext)({});
            $(I());
            var z = "u" > typeof window ? A.useLayoutEffect : A.useEffect;
            var H = function() {};
            var V = function(m) {
                return void 0 === m && (m = 0), {
                    name: "offset",
                    options: m
                };
            };
            var W = function() {};
            function X(m) {}
            function Y(m, S) {}
            var G = {
                getClippingRect: function(m) {
                    let { element: S, boundary: h, rootBoundary: E, strategy: k } = m, A = [
                        ..."clippingAncestors" === h ? function(m, S) {
                            let h = S.get(m);
                            if (h) return h;
                            let E = (void 0).filter((m)=>void 0), k = null, A = "fixed" === (void 0).position, O = A ? void 0 : m;
                            for(; void 0;){
                                let m, S = function(m) {
                                    let S = /firefox/i.test(function() {
                                        if (R) return R;
                                        let m = navigator.userAgentData;
                                        return m && Array.isArray(m.brands) ? R = m.brands.map((m)=>m.brand + "/" + m.version).join(" ") : navigator.userAgent;
                                    }()), h, E = h.backdropFilter || h.WebkitBackdropFilter;
                                    return "none" !== h.transform || "none" !== h.perspective || !!E && "none" !== E || S && "filter" === h.willChange || S && !!h.filter && "none" !== h.filter || [
                                        "transform",
                                        "perspective"
                                    ].some((m)=>h.willChange.includes(m)) || [
                                        "paint",
                                        "layout",
                                        "strict",
                                        "content"
                                    ].some((m)=>{
                                        let S = h.contain;
                                        return null != S && S.includes(m);
                                    });
                                }(O);
                                "fixed" === m.position ? k = null : (A ? S || k : S || "static" !== m.position || !k || ![
                                    "absolute",
                                    "fixed"
                                ].includes(k.position)) ? k = m : E = E.filter((m)=>m !== O), O = void 0;
                            }
                            return S.set(m, E), E;
                        }(S, this._c) : [].concat(h),
                        E
                    ], O = A[0], L = A.reduce(()=>{}, void 0);
                    return {
                        width: L.right - L.left,
                        height: L.bottom - L.top,
                        x: L.left,
                        y: L.top
                    };
                },
                convertOffsetParentRelativeRectToViewportRelativeRect: function() {},
                isElement: X,
                getDimensions: function(m) {
                    return m.getBoundingClientRect();
                },
                getOffsetParent: Y,
                getDocumentElement: function(m) {},
                getScale: function(m) {},
                async getElementRects (m) {
                    var S;
                    let { reference: h, floating: E, strategy: k } = m, R = this.getOffsetParent || Y, A = this.getDimensions;
                    return {
                        reference: void (S = await R(E)),
                        floating: {
                            x: 0,
                            y: 0,
                            ...await A(E)
                        }
                    };
                },
                getClientRects: (m)=>Array.from(m.getClientRects()),
                isRTL: (m)=>"rtl" === (void 0).direction
            };
            var J = (m, S, h)=>{
                let E = new Map, k = {
                    platform: G,
                    ...h
                }, R = {
                    ...k.platform,
                    _c: E
                };
                return (async ()=>{})();
            };
            var Q = {
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
            var Z = ({})=>{
                let m = (0, A.useRef)(null), S = (0, A.useRef)(null), h = (0, A.useRef)(null), E = (0, A.useRef)(null), [k, R] = (0, A.useState)(i), [L, j] = (0, A.useState)({}), [B, C] = (0, A.useState)({}), [D, N] = (0, A.useState)(!1), [$, I] = (0, A.useState)(!1), X = (0, A.useRef)(null), { anchorRefs: Y } = function(m = "DEFAULT_TOOLTIP_ID") {}(t), G = (0, A.useRef)(!1), [Z, ee] = (0, A.useState)([]), et = (0, A.useRef)(!1), er = u || f.includes("click");
                z(()=>(et.current = !0, ()=>{
                        et.current = !1;
                    }), []), (0, A.useEffect)(()=>{
                    if (!D) {
                        let m = setTimeout(()=>{
                            I(!1);
                        }, 150);
                        return ()=>{
                            clearTimeout(m);
                        };
                    }
                    return ()=>null;
                }, [
                    D
                ]);
                let en = (m)=>{
                    et.current && (m && I(!0), setTimeout(()=>{
                        et.current && (null == U || U(m), void 0 === q && N(m));
                    }, 10));
                };
                (0, A.useEffect)(()=>{
                    if (void 0 === q) return ()=>null;
                    q && I(!0);
                    return ()=>{};
                }, [
                    q
                ]), (0, A.useEffect)(()=>{}, [
                    D
                ]);
                let eo = ()=>{}, el = ()=>{}, ei = ({})=>{}, ea = (m)=>{
                    if (!m) return;
                    let S = {
                        x: m.clientX,
                        y: m.clientY
                    };
                    ei(S), X.current = S;
                }, eu = (m)=>{
                    eo(), y && ((m = y)=>{})();
                }, es = (S)=>{
                    var h;
                    [
                        document.querySelector(`[id='${l}']`),
                        ...Z
                    ].some((m)=>null == m ? void 0 : m.contains(S.target)) || null != (h = m.current) && h.contains(S.target) || en(!1);
                }, ec = (m)=>{
                    "Escape" === m.key && en(!1);
                }, ef = M(eo, 50), ed = M(el, 50);
                (0, A.useEffect)(()=>{
                    var S, h;
                    let E = new Set(Y);
                    Z.forEach((m)=>{
                        E.add({
                            current: m
                        });
                    });
                    let k = document.querySelector(`[id='${l}']`);
                    k && E.add({
                        current: k
                    }), x && window.addEventListener("keydown", ec);
                    let R = [];
                    er ? (window.addEventListener("click", es), R.push({
                        event: "click",
                        listener: eu
                    })) : (R.push({
                        event: "mouseenter",
                        listener: ef
                    }, {
                        event: "mouseleave",
                        listener: ed
                    }, {
                        event: "focus",
                        listener: ef
                    }, {
                        event: "blur",
                        listener: ed
                    }), g && R.push({
                        event: "mousemove",
                        listener: ea
                    }));
                    let A = ()=>{
                        G.current = !0;
                    }, O = ()=>{
                        G.current = !1, el();
                    };
                    return T && !er && (null == (S = m.current) || S.addEventListener("mouseenter", A), null == (h = m.current) || h.addEventListener("mouseleave", O)), R.forEach(({ event: m, listener: S })=>{
                        E.forEach((h)=>{
                            var E;
                            null == (E = h.current) || E.addEventListener(m, S);
                        });
                    }), ()=>{
                        var S, h;
                        er && window.removeEventListener("click", es), x && window.removeEventListener("keydown", ec), T && !er && (null == (S = m.current) || S.removeEventListener("mouseenter", A), null == (h = m.current) || h.removeEventListener("mouseleave", O)), R.forEach(({ event: m, listener: S })=>{
                            E.forEach((h)=>{
                                var E;
                                null == (E = h.current) || E.removeEventListener(m, S);
                            });
                        });
                    };
                }, [
                    $,
                    Y,
                    Z,
                    x,
                    f
                ]), (0, A.useEffect)(()=>{
                    let m = null != r ? r : "";
                    !m && t && (m = `[data-tooltip-id='${t}']`);
                    let S = new MutationObserver((S)=>{
                        let h = [];
                        S.forEach((S)=>{
                            if ("attributes" === S.type && "data-tooltip-id" === S.attributeName && S.target.getAttribute("data-tooltip-id") === t && h.push(S.target), "childList" === S.type && (_ && [
                                ...S.removedNodes
                            ].some((m)=>m.contains(_) ? (I(!1), en(!1), b(null), !0) : !1), !!m)) try {
                                let E = [
                                    ...S.addedNodes
                                ].filter((m)=>1 === m.nodeType);
                                h.push(...E.filter((S)=>S.matches(m))), h.push(...E.flatMap((S)=>[
                                        ...S.querySelectorAll(m)
                                    ]));
                            } catch (m) {}
                        }), h.length && ee((m)=>[
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
                ]), (0, A.useEffect)(()=>{
                    if (P) return void ei(P);
                    if (g) {
                        X.current && ei(X.current);
                        return;
                    }
                    (async ({ elementReference: m = null, tooltipReference: S = null, tooltipArrowReference: h = null, place: E = "top", offset: k = 10, strategy: R = "absolute", middlewares: A = [
                        V(Number(k)),
                        H(),
                        W()
                    ] })=>{
                        if (!m) return {
                            tooltipStyles: {},
                            tooltipArrowStyles: {},
                            place: E
                        };
                        if (null === S) return {
                            tooltipStyles: {},
                            tooltipArrowStyles: {},
                            place: E
                        };
                        return h ? (A.push({}), J(m, S, {
                            placement: E,
                            strategy: R,
                            middleware: A
                        }).then(()=>{})) : J(m, S, {
                            placement: "bottom",
                            strategy: R,
                            middleware: A
                        }).then(({ x: m, y: S, placement: h })=>({
                                tooltipStyles: {
                                    left: `${m}px`,
                                    top: `${S}px`
                                },
                                tooltipArrowStyles: {},
                                place: h
                            }));
                    })({
                        place: i,
                        offset: s,
                        elementReference: _,
                        tooltipReference: m.current,
                        tooltipArrowReference: S.current,
                        strategy: a,
                        middlewares: c
                    }).then((m)=>{
                        et.current && (Object.keys(m.tooltipStyles).length && j(m.tooltipStyles), Object.keys(m.tooltipArrowStyles).length && C(m.tooltipArrowStyles), R(m.place));
                    });
                }, [
                    D,
                    _,
                    K,
                    i,
                    s,
                    a,
                    P
                ]), (0, A.useEffect)(()=>{
                    var m;
                    let S = document.querySelector(`[id='${l}']`), h = [
                        ...Z,
                        S
                    ];
                    _ && h.includes(_) || b(null != (m = Z[0]) ? m : S);
                }, [
                    l,
                    Z,
                    _
                ]), (0, A.useEffect)(()=>()=>{
                        h.current && clearTimeout(h.current), E.current && clearTimeout(E.current);
                    }, []), (0, A.useEffect)(()=>{
                    let m = r;
                    if (!m && t && (m = `[data-tooltip-id='${t}']`), !!m) try {
                        let S = Array.from(document.querySelectorAll(m));
                        ee(S);
                    } catch (m) {
                        ee([]);
                    }
                }, [
                    t,
                    r
                ]);
                let ep = K && D && Object.keys(L).length > 0;
                return $ ? (0, O.jsxs)(d, {
                    id: t,
                    role: "tooltip",
                    className: (0, F.default)("react-tooltip", Q.tooltip, Q[o], e, `react-tooltip__place-${k}`, {
                        [Q.show]: ep,
                        [Q.fixed]: "fixed" === a,
                        [Q.clickable]: T
                    }),
                    style: {
                        ...v,
                        ...L
                    },
                    ref: m,
                    children: [
                        K,
                        (0, O.jsx)(d, {
                            className: (0, F.default)("react-tooltip-arrow", Q.arrow, n, {
                                [Q.noArrow]: w
                            }),
                            style: B,
                            ref: S
                        })
                    ]
                }) : null;
            };
            var ee = ({ content: m })=>(0, O.jsx)("span", {
                    dangerouslySetInnerHTML: {
                        __html: m
                    }
                });
            var et = ({ setIsOpen: m })=>{
                let [S, h] = (0, A.useState)(o), [E, k] = (0, A.useState)(l), [R, L] = (0, A.useState)(u), [j, B] = (0, A.useState)(f), [C, D] = (0, A.useState)(a), [N, $] = (0, A.useState)(T), [I, F] = (0, A.useState)(x), [M, z] = (0, A.useState)(v), [H, V] = (0, A.useState)(c), [W, X] = (0, A.useState)(p), [Y, G] = (0, A.useState)(g), [J, Q] = (0, A.useState)(null), {} = function(m = "DEFAULT_TOOLTIP_ID") {}(t);
                (0, A.useEffect)(()=>{}, [
                    o
                ]), (0, A.useEffect)(()=>{}, [
                    l
                ]), (0, A.useEffect)(()=>{}, [
                    u
                ]), (0, A.useEffect)(()=>{}, [
                    yt,
                    At,
                    J,
                    e,
                    n
                ]);
                d;
                return r ? r({}) : S && S, E && (0, O.jsx)(ee, {}), (0, O.jsx)(Z, {});
            };
        }
    }
]);
