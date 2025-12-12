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
                    return /* binding */ ei;
                }
            });
            /* unused harmony exports TooltipProvider, TooltipWrapper */ /* harmony import */ var R, A = h(7294);
            /* harmony import */ var O = h(5893);
            var L = Object.create;
            var j = Object.defineProperty;
            var B = Object.getOwnPropertyDescriptor;
            var C = Object.getOwnPropertyNames;
            var N = Object.getPrototypeOf, $ = Object.prototype.hasOwnProperty;
            var D = (m, S, h)=>(h = null != m ? L(N(m)) : {}, ((m, S, h, E)=>{
                    if (S && "object" == typeof S || "function" == typeof S) for (let h of C(S))$.call(m, h) || void 0 === h || j(m, h, {
                        get: ()=>S[h],
                        enumerable: !(E = B(S, h)) || E.enumerable
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
            var V = async ()=>{};
            var W = function() {};
            var X = function(m) {
                return void 0 === m && (m = 0), {
                    name: "offset",
                    options: m
                };
            };
            var Y = function() {};
            function G(m) {}
            function J(m) {}
            function Q(m) {}
            function Z(m, S) {}
            var ee = {
                getClippingRect: function(m) {
                    var S, h, E;
                    let { element: k, boundary: A, rootBoundary: O, strategy: L } = m, j = [
                        ..."clippingAncestors" === A ? function(m, S) {
                            var h, E;
                            let k = S.get(m);
                            if (k) return k;
                            let A = (void (h = 0)).filter((m)=>{
                                var S;
                                return J(m) && (S = 0, true);
                            }), O = null, L = "fixed" === G(m).position, j = L ? Q(m) : m;
                            for(; J(j) && (E = 0, true);){
                                let m = G(j), S = function(m) {
                                    let S = /firefox/i.test(function() {
                                        if (R) return R;
                                        let m = navigator.userAgentData;
                                        return m && Array.isArray(m.brands) ? R = m.brands.map((m)=>m.brand + "/" + m.version).join(" ") : navigator.userAgent;
                                    }()), h = G(m), E = h.backdropFilter || h.WebkitBackdropFilter;
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
                                }(j);
                                "fixed" === m.position ? O = null : (L ? S || O : S || "static" !== m.position || !O || ![
                                    "absolute",
                                    "fixed"
                                ].includes(O.position)) ? O = m : A = A.filter((m)=>m !== j), j = Q(j);
                            }
                            return S.set(m, A), A;
                        }(k, this._c) : [].concat(A),
                        O
                    ], B = j[0], C = j.reduce(()=>{}, (S = 0, h = 0, void (E = 0)));
                    return {
                        width: C.right - C.left,
                        height: C.bottom - C.top,
                        x: C.left,
                        y: C.top
                    };
                },
                convertOffsetParentRelativeRectToViewportRelativeRect: function() {},
                isElement: J,
                getDimensions: function(m) {
                    var S, h;
                    return S = 0, m.getBoundingClientRect();
                },
                getOffsetParent: Z,
                getDocumentElement: function(m) {},
                getScale: function(m) {},
                async getElementRects (m) {
                    var S, h, E;
                    let { reference: k, floating: R, strategy: A } = m, O = this.getOffsetParent || Z, L = this.getDimensions;
                    return {
                        reference: (S = 0, h = await O(R), void (E = 0)),
                        floating: {
                            x: 0,
                            y: 0,
                            ...await L(R)
                        }
                    };
                },
                getClientRects: (m)=>Array.from(m.getClientRects()),
                isRTL: (m)=>"rtl" === G(m).direction
            };
            var et = (m, S, h)=>{
                let E = new Map, k = {
                    platform: ee,
                    ...h
                }, R = {
                    ...k.platform,
                    _c: E
                };
                return V(m, S, {
                    ...k,
                    platform: R
                });
            };
            var er = async ({ elementReference: m = null, tooltipReference: S = null, tooltipArrowReference: h = null, place: E = "top", offset: k = 10, strategy: R = "absolute", middlewares: A = [
                X(Number(k)),
                W(),
                Y({
                    padding: 5
                })
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
                return h ? (A.push({}), et(m, S, {
                    placement: E,
                    strategy: R,
                    middleware: A
                }).then(()=>{})) : et(m, S, {
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
            };
            var en = {
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
            var eo = ({})=>{
                let m = (0, A.useRef)(null), S = (0, A.useRef)(null), h = (0, A.useRef)(null), E = (0, A.useRef)(null), [k, R] = (0, A.useState)(i), [L, j] = (0, A.useState)({}), [B, C] = (0, A.useState)({}), [N, $] = (0, A.useState)(!1), [D, M] = (0, A.useState)(!1), V = (0, A.useRef)(null), { anchorRefs: W } = z(t), X = (0, A.useRef)(!1), [Y, G] = (0, A.useState)([]), J = (0, A.useRef)(!1), Q = u || f.includes("click");
                H(()=>(J.current = !0, ()=>{
                        J.current = !1;
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
                let Z = (m)=>{
                    J.current && (m && M(!0), setTimeout(()=>{
                        J.current && (null == U || U(m), void 0 === q && $(m));
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
                let ee = ()=>{}, et = ()=>{}, eo = ({})=>{}, el = (m)=>{
                    if (!m) return;
                    let S = {
                        x: m.clientX,
                        y: m.clientY
                    };
                    eo(S), V.current = S;
                }, ei = (m)=>{
                    ee(m), y;
                }, ea = (S)=>{
                    var h;
                    [
                        document.querySelector(`[id='${l}']`),
                        ...Y
                    ].some((m)=>null == m ? void 0 : m.contains(S.target)) || null != (h = m.current) && h.contains(S.target) || Z(!1);
                }, eu = (m)=>{
                    "Escape" === m.key && Z(!1);
                }, es = I(ee, 50), ec = I(et, 50);
                (0, A.useEffect)(()=>{
                    var S, h;
                    let E = new Set(W);
                    Y.forEach((m)=>{
                        E.add({
                            current: m
                        });
                    });
                    let k = document.querySelector(`[id='${l}']`);
                    k && E.add({
                        current: k
                    }), x && window.addEventListener("keydown", eu);
                    let R = [];
                    Q ? (window.addEventListener("click", ea), R.push({
                        event: "click",
                        listener: ei
                    })) : (R.push({
                        event: "mouseenter",
                        listener: es
                    }, {
                        event: "mouseleave",
                        listener: ec
                    }, {
                        event: "focus",
                        listener: es
                    }, {
                        event: "blur",
                        listener: ec
                    }), g && R.push({
                        event: "mousemove",
                        listener: el
                    }));
                    let A = ()=>{
                        X.current = !0;
                    }, O = ()=>{
                        X.current = !1, et();
                    };
                    return T && !Q && (null == (S = m.current) || S.addEventListener("mouseenter", A), null == (h = m.current) || h.addEventListener("mouseleave", O)), R.forEach(({ event: m, listener: S })=>{
                        E.forEach((h)=>{
                            var E;
                            null == (E = h.current) || E.addEventListener(m, S);
                        });
                    }), ()=>{
                        var S, h;
                        Q && window.removeEventListener("click", ea), x && window.removeEventListener("keydown", eu), T && !Q && (null == (S = m.current) || S.removeEventListener("mouseenter", A), null == (h = m.current) || h.removeEventListener("mouseleave", O)), R.forEach(({ event: m, listener: S })=>{
                            E.forEach((h)=>{
                                var E;
                                null == (E = h.current) || E.removeEventListener(m, S);
                            });
                        });
                    };
                }, [
                    D,
                    W,
                    Y,
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
                            ].some((m)=>m.contains(_) ? (M(!1), Z(!1), b(null), !0) : !1), !!m)) try {
                                let E = [
                                    ...S.addedNodes
                                ].filter((m)=>1 === m.nodeType);
                                h.push(...E.filter((S)=>S.matches(m))), h.push(...E.flatMap((S)=>[
                                        ...S.querySelectorAll(m)
                                    ]));
                            } catch (m) {}
                        }), h.length && G((m)=>[
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
                    if (P) return void eo(P);
                    if (g) {
                        V.current && eo(V.current);
                        return;
                    }
                    er({
                        place: i,
                        offset: s,
                        elementReference: _,
                        tooltipReference: m.current,
                        tooltipArrowReference: S.current,
                        strategy: a,
                        middlewares: c
                    }).then((m)=>{
                        J.current && (Object.keys(m.tooltipStyles).length && j(m.tooltipStyles), Object.keys(m.tooltipArrowStyles).length && C(m.tooltipArrowStyles), R(m.place));
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
                        ...Y,
                        S
                    ];
                    _ && h.includes(_) || b(null != (m = Y[0]) ? m : S);
                }, [
                    l,
                    Y,
                    _
                ]), (0, A.useEffect)(()=>()=>{
                        h.current && clearTimeout(h.current), E.current && clearTimeout(E.current);
                    }, []), (0, A.useEffect)(()=>{
                    let m = r;
                    if (!m && t && (m = `[data-tooltip-id='${t}']`), !!m) try {
                        let S = Array.from(document.querySelectorAll(m));
                        G(S);
                    } catch (m) {
                        G([]);
                    }
                }, [
                    t,
                    r
                ]);
                let ef = K && N && Object.keys(L).length > 0;
                return D ? (0, O.jsxs)(d, {
                    id: t,
                    role: "tooltip",
                    className: (0, F.default)("react-tooltip", en.tooltip, en[o], e, `react-tooltip__place-${k}`, {
                        [en.show]: ef,
                        [en.fixed]: "fixed" === a,
                        [en.clickable]: T
                    }),
                    style: {
                        ...v,
                        ...L
                    },
                    ref: m,
                    children: [
                        K,
                        (0, O.jsx)(d, {
                            className: (0, F.default)("react-tooltip-arrow", en.arrow, n, {
                                [en.noArrow]: w
                            }),
                            style: B,
                            ref: S
                        })
                    ]
                }) : null;
            };
            var el = ({ content: m })=>(0, O.jsx)("span", {
                    dangerouslySetInnerHTML: {
                        __html: m
                    }
                });
            var ei = ({ setIsOpen: m })=>{
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
                return r ? r({}) : S && S, E && (0, O.jsx)(el, {}), (0, O.jsx)(eo, {});
            };
        }
    }
]);
