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
                    return /* binding */ eo;
                }
            });
            /* unused harmony exports TooltipProvider, TooltipWrapper */ /* harmony import */ var R, A = h(7294);
            /* harmony import */ var O = h(5893);
            var L = Object.create;
            var j = Object.defineProperty;
            var B = Object.getOwnPropertyDescriptor;
            var C = Object.getOwnPropertyNames;
            var N = Object.getPrototypeOf, $ = Object.prototype.hasOwnProperty;
            var D = (m, S, h)=>(h = null != m ? L(N(m)) : {}, ((m, S, h)=>{
                    if (S && "object" == typeof S || "function" == typeof S) for (let E of C(S))$.call(m, E) || void 0 === E || j(m, E, {
                        get: ()=>S[E],
                        enumerable: !(h = B(S, E)) || h.enumerable
                    });
                    return m;
                })(!S && m && m.__esModule ? h : j(h, "default", {}), m));
            var M = (E = ()=>{}, ()=>(k || E((k = {
                    exports: {}
                }).exports, k), k.exports));
            var F = D(M());
            var I = ()=>{};
            (0, A.createContext)({});
            function z(m = "DEFAULT_TOOLTIP_ID") {}
            D(M());
            var H = "u" > typeof window ? A.useLayoutEffect : A.useEffect;
            var V = function() {};
            var W = function(m) {
                return void 0 === m && (m = 0), {
                    name: "offset",
                    options: m
                };
            };
            var X = function() {};
            function Y(m) {}
            function G(m) {}
            function J(m) {}
            function Q(m, S) {}
            var Z = {
                getClippingRect: function(m) {
                    let { element: S, boundary: h, rootBoundary: E, strategy: k } = m, A = [
                        ..."clippingAncestors" === h ? function(m, S) {
                            let h = S.get(m);
                            if (h) return h;
                            let E = (void 0).filter((m)=>G(m) && true), k = null, A = "fixed" === Y(m).position, O = A ? J(m) : m;
                            for(; G(O) && true;){
                                let m = Y(O), S = function(m) {
                                    let S = /firefox/i.test(function() {
                                        if (R) return R;
                                        let m = navigator.userAgentData;
                                        return m && Array.isArray(m.brands) ? R = m.brands.map((m)=>m.brand + "/" + m.version).join(" ") : navigator.userAgent;
                                    }()), h = Y(m), E = h.backdropFilter || h.WebkitBackdropFilter;
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
                                ].includes(k.position)) ? k = m : E = E.filter((m)=>m !== O), O = J(O);
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
                isElement: G,
                getDimensions: function(m) {
                    return m.getBoundingClientRect();
                },
                getOffsetParent: Q,
                getDocumentElement: function(m) {},
                getScale: function(m) {},
                async getElementRects (m) {
                    var S;
                    let { reference: h, floating: E, strategy: k } = m, R = this.getOffsetParent || Q, A = this.getDimensions;
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
                isRTL: (m)=>"rtl" === Y(m).direction
            };
            var ee = (m, S, h)=>{
                let E = new Map, k = {
                    platform: Z,
                    ...h
                }, R = {
                    ...k.platform,
                    _c: E
                };
                return (async ()=>{})();
            };
            var et = {
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
            var er = ({})=>{
                let m = (0, A.useRef)(null), S = (0, A.useRef)(null), h = (0, A.useRef)(null), E = (0, A.useRef)(null), [k, R] = (0, A.useState)(i), [L, j] = (0, A.useState)({}), [B, C] = (0, A.useState)({}), [N, $] = (0, A.useState)(!1), [D, M] = (0, A.useState)(!1), Y = (0, A.useRef)(null), { anchorRefs: G } = z(t), J = (0, A.useRef)(!1), [Q, Z] = (0, A.useState)([]), er = (0, A.useRef)(!1), en = u || f.includes("click");
                H(()=>(er.current = !0, ()=>{
                        er.current = !1;
                    }), []), (0, A.useEffect)(()=>{
                    if (!N) {
                        let m = setTimeout(()=>{
                            M(!1);
                        }, 150);
                        return ()=>{
                            clearTimeout(m);
                        };
                    }
                    return ()=>null;
                }, [
                    N
                ]);
                let eo = (m)=>{
                    er.current && (m && M(!0), setTimeout(()=>{
                        er.current && (null == U || U(m), void 0 === q && $(m));
                    }, 10));
                };
                (0, A.useEffect)(()=>{
                    if (void 0 === q) return ()=>null;
                    q && M(!0);
                    return ()=>{};
                }, [
                    q
                ]), (0, A.useEffect)(()=>{}, [
                    N
                ]);
                let el = ()=>{}, ei = ()=>{}, eu = ({})=>{}, ea = (m)=>{
                    if (!m) return;
                    let S = {
                        x: m.clientX,
                        y: m.clientY
                    };
                    eu(S), Y.current = S;
                }, es = (m)=>{
                    el(), y && ((m = y)=>{})();
                }, ec = (S)=>{
                    var h;
                    [
                        document.querySelector(`[id='${l}']`),
                        ...Q
                    ].some((m)=>null == m ? void 0 : m.contains(S.target)) || null != (h = m.current) && h.contains(S.target) || eo(!1);
                }, ef = (m)=>{
                    "Escape" === m.key && eo(!1);
                }, ep = I(el, 50), ed = I(ei, 50);
                (0, A.useEffect)(()=>{
                    var S, h;
                    let E = new Set(G);
                    Q.forEach((m)=>{
                        E.add({
                            current: m
                        });
                    });
                    let k = document.querySelector(`[id='${l}']`);
                    k && E.add({
                        current: k
                    }), x && window.addEventListener("keydown", ef);
                    let R = [];
                    en ? (window.addEventListener("click", ec), R.push({
                        event: "click",
                        listener: es
                    })) : (R.push({
                        event: "mouseenter",
                        listener: ep
                    }, {
                        event: "mouseleave",
                        listener: ed
                    }, {
                        event: "focus",
                        listener: ep
                    }, {
                        event: "blur",
                        listener: ed
                    }), g && R.push({
                        event: "mousemove",
                        listener: ea
                    }));
                    let A = ()=>{
                        J.current = !0;
                    }, O = ()=>{
                        J.current = !1, ei();
                    };
                    return T && !en && (null == (S = m.current) || S.addEventListener("mouseenter", A), null == (h = m.current) || h.addEventListener("mouseleave", O)), R.forEach(({ event: m, listener: S })=>{
                        E.forEach((h)=>{
                            var E;
                            null == (E = h.current) || E.addEventListener(m, S);
                        });
                    }), ()=>{
                        var S, h;
                        en && window.removeEventListener("click", ec), x && window.removeEventListener("keydown", ef), T && !en && (null == (S = m.current) || S.removeEventListener("mouseenter", A), null == (h = m.current) || h.removeEventListener("mouseleave", O)), R.forEach(({ event: m, listener: S })=>{
                            E.forEach((h)=>{
                                var E;
                                null == (E = h.current) || E.removeEventListener(m, S);
                            });
                        });
                    };
                }, [
                    D,
                    G,
                    Q,
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
                            ].some((m)=>m.contains(_) ? (M(!1), eo(!1), b(null), !0) : !1), !!m)) try {
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
                ]), (0, A.useEffect)(()=>{
                    if (P) return void eu(P);
                    if (g) {
                        Y.current && eu(Y.current);
                        return;
                    }
                    (async ({ elementReference: m = null, tooltipReference: S = null, tooltipArrowReference: h = null, place: E = "top", offset: k = 10, strategy: R = "absolute", middlewares: A = [
                        W(Number(k)),
                        V(),
                        X()
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
                        return h ? (A.push({}), ee(m, S, {
                            placement: E,
                            strategy: R,
                            middleware: A
                        }).then(()=>{})) : ee(m, S, {
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
                        er.current && (Object.keys(m.tooltipStyles).length && j(m.tooltipStyles), Object.keys(m.tooltipArrowStyles).length && C(m.tooltipArrowStyles), R(m.place));
                    });
                }, [
                    N,
                    _,
                    K,
                    i,
                    s,
                    a,
                    P
                ]), (0, A.useEffect)(()=>{
                    var m;
                    let S = document.querySelector(`[id='${l}']`), h = [
                        ...Q,
                        S
                    ];
                    _ && h.includes(_) || b(null != (m = Q[0]) ? m : S);
                }, [
                    l,
                    Q,
                    _
                ]), (0, A.useEffect)(()=>()=>{
                        h.current && clearTimeout(h.current), E.current && clearTimeout(E.current);
                    }, []), (0, A.useEffect)(()=>{
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
                let ev = K && N && Object.keys(L).length > 0;
                return D ? (0, O.jsxs)(d, {
                    id: t,
                    role: "tooltip",
                    className: (0, F.default)("react-tooltip", et.tooltip, et[o], e, `react-tooltip__place-${k}`, {
                        [et.show]: ev,
                        [et.fixed]: "fixed" === a,
                        [et.clickable]: T
                    }),
                    style: {
                        ...v,
                        ...L
                    },
                    ref: m,
                    children: [
                        K,
                        (0, O.jsx)(d, {
                            className: (0, F.default)("react-tooltip-arrow", et.arrow, n, {
                                [et.noArrow]: w
                            }),
                            style: B,
                            ref: S
                        })
                    ]
                }) : null;
            };
            var en = ({ content: m })=>(0, O.jsx)("span", {
                    dangerouslySetInnerHTML: {
                        __html: m
                    }
                });
            var eo = ({ setIsOpen: m })=>{
                let [S, h] = (0, A.useState)(o), [E, k] = (0, A.useState)(l), [R, L] = (0, A.useState)(u), [j, B] = (0, A.useState)(f), [C, N] = (0, A.useState)(a), [$, D] = (0, A.useState)(T), [M, F] = (0, A.useState)(x), [I, H] = (0, A.useState)(v), [V, W] = (0, A.useState)(c), [X, Y] = (0, A.useState)(p), [G, J] = (0, A.useState)(g), [Q, Z] = (0, A.useState)(null), {} = z(t);
                (0, A.useEffect)(()=>{}, [
                    o
                ]), (0, A.useEffect)(()=>{}, [
                    l
                ]), (0, A.useEffect)(()=>{}, [
                    u
                ]), (0, A.useEffect)(()=>{}, [
                    yt,
                    At,
                    Q,
                    e,
                    n
                ]);
                d;
                return r ? r({}) : S && S, E && (0, O.jsx)(en, {}), (0, O.jsx)(er, {});
            };
        }
    }
]);
