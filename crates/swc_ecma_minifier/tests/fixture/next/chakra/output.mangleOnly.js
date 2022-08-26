(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
    [
        888
    ],
    {
        2260: function(r, e, t) {
            "use strict";
            t.r(e);
            t.d(e, {
                default: function() {
                    return lC;
                }
            });
            function n(r, e, t) {
                if (e in r) {
                    Object.defineProperty(r, e, {
                        value: t,
                        enumerable: true,
                        configurable: true,
                        writable: true
                    });
                } else {
                    r[e] = t;
                }
                return r;
            }
            function o(r) {
                for(var e = 1; e < arguments.length; e++){
                    var t = arguments[e] != null ? arguments[e] : {};
                    var o = Object.keys(t);
                    if (typeof Object.getOwnPropertySymbols === "function") {
                        o = o.concat(Object.getOwnPropertySymbols(t).filter(function(r) {
                            return Object.getOwnPropertyDescriptor(t, r).enumerable;
                        }));
                    }
                    o.forEach(function(e) {
                        n(r, e, t[e]);
                    });
                }
                return r;
            }
            var a = t(5893);
            var i = t(7294);
            var l = t(917);
            var $ = function r() {
                return i.createElement(l.xB, {
                    styles: '\n      html {\n        line-height: 1.5;\n        -webkit-text-size-adjust: 100%;\n        font-family: system-ui, sans-serif;\n        -webkit-font-smoothing: antialiased;\n        text-rendering: optimizeLegibility;\n        -moz-osx-font-smoothing: grayscale;\n        touch-action: manipulation;\n      }\n\n      body {\n        position: relative;\n        min-height: 100%;\n        font-feature-settings: \'kern\';\n      }\n\n      *,\n      *::before,\n      *::after {\n        border-width: 0;\n        border-style: solid;\n        box-sizing: border-box;\n      }\n\n      main {\n        display: block;\n      }\n\n      hr {\n        border-top-width: 1px;\n        box-sizing: content-box;\n        height: 0;\n        overflow: visible;\n      }\n\n      pre,\n      code,\n      kbd,\n      samp {\n        font-family: SFMono-Regular,  Menlo, Monaco, Consolas, monospace;\n        font-size: 1em;\n      }\n\n      a {\n        background-color: transparent;\n        color: inherit;\n        text-decoration: inherit;\n      }\n\n      abbr[title] {\n        border-bottom: none;\n        text-decoration: underline;\n        -webkit-text-decoration: underline dotted;\n        text-decoration: underline dotted;\n      }\n\n      b,\n      strong {\n        font-weight: bold;\n      }\n\n      small {\n        font-size: 80%;\n      }\n\n      sub,\n      sup {\n        font-size: 75%;\n        line-height: 0;\n        position: relative;\n        vertical-align: baseline;\n      }\n\n      sub {\n        bottom: -0.25em;\n      }\n\n      sup {\n        top: -0.5em;\n      }\n\n      img {\n        border-style: none;\n      }\n\n      button,\n      input,\n      optgroup,\n      select,\n      textarea {\n        font-family: inherit;\n        font-size: 100%;\n        line-height: 1.15;\n        margin: 0;\n      }\n\n      button,\n      input {\n        overflow: visible;\n      }\n\n      button,\n      select {\n        text-transform: none;\n      }\n\n      button::-moz-focus-inner,\n      [type="button"]::-moz-focus-inner,\n      [type="reset"]::-moz-focus-inner,\n      [type="submit"]::-moz-focus-inner {\n        border-style: none;\n        padding: 0;\n      }\n\n      fieldset {\n        padding: 0.35em 0.75em 0.625em;\n      }\n\n      legend {\n        box-sizing: border-box;\n        color: inherit;\n        display: table;\n        max-width: 100%;\n        padding: 0;\n        white-space: normal;\n      }\n\n      progress {\n        vertical-align: baseline;\n      }\n\n      textarea {\n        overflow: auto;\n      }\n\n      [type="checkbox"],\n      [type="radio"] {\n        box-sizing: border-box;\n        padding: 0;\n      }\n\n      [type="number"]::-webkit-inner-spin-button,\n      [type="number"]::-webkit-outer-spin-button {\n        -webkit-appearance: none !important;\n      }\n\n      input[type="number"] {\n        -moz-appearance: textfield;\n      }\n\n      [type="search"] {\n        -webkit-appearance: textfield;\n        outline-offset: -2px;\n      }\n\n      [type="search"]::-webkit-search-decoration {\n        -webkit-appearance: none !important;\n      }\n\n      ::-webkit-file-upload-button {\n        -webkit-appearance: button;\n        font: inherit;\n      }\n\n      details {\n        display: block;\n      }\n\n      summary {\n        display: list-item;\n      }\n\n      template {\n        display: none;\n      }\n\n      [hidden] {\n        display: none !important;\n      }\n\n      body,\n      blockquote,\n      dl,\n      dd,\n      h1,\n      h2,\n      h3,\n      h4,\n      h5,\n      h6,\n      hr,\n      figure,\n      p,\n      pre {\n        margin: 0;\n      }\n\n      button {\n        background: transparent;\n        padding: 0;\n      }\n\n      fieldset {\n        margin: 0;\n        padding: 0;\n      }\n\n      ol,\n      ul {\n        margin: 0;\n        padding: 0;\n      }\n\n      textarea {\n        resize: vertical;\n      }\n\n      button,\n      [role="button"] {\n        cursor: pointer;\n      }\n\n      button::-moz-focus-inner {\n        border: 0 !important;\n      }\n\n      table {\n        border-collapse: collapse;\n      }\n\n      h1,\n      h2,\n      h3,\n      h4,\n      h5,\n      h6 {\n        font-size: inherit;\n        font-weight: inherit;\n      }\n\n      button,\n      input,\n      optgroup,\n      select,\n      textarea {\n        padding: 0;\n        line-height: inherit;\n        color: inherit;\n      }\n\n      img,\n      svg,\n      video,\n      canvas,\n      audio,\n      iframe,\n      embed,\n      object {\n        display: block;\n      }\n\n      img,\n      video {\n        max-width: 100%;\n        height: auto;\n      }\n\n      [data-js-focus-visible] :focus:not([data-focus-visible-added]):not([data-focus-visible-disabled]) {\n        outline: none;\n        box-shadow: none;\n      }\n\n      select::-ms-expand {\n        display: none;\n      }\n    '
                });
            };
            var s = $;
            var u = t(5031);
            var c = t(6450);
            var d = t(7375);
            var f = t(4697);
            var v = t(3935);
            var p = (0, c.kr)({
                strict: false,
                name: "PortalManagerContext"
            }), m = p[0], h = p[1];
            function b(r) {
                var e = r.children, t = r.zIndex;
                return i.createElement(m, {
                    value: {
                        zIndex: t
                    }
                }, e);
            }
            if (u.Ts) {
                b.displayName = "PortalManager";
            }
            function g() {
                g = Object.assign ? Object.assign.bind() : function(r) {
                    for(var e = 1; e < arguments.length; e++){
                        var t = arguments[e];
                        for(var n in t){
                            if (Object.prototype.hasOwnProperty.call(t, n)) {
                                r[n] = t[n];
                            }
                        }
                    }
                    return r;
                };
                return g.apply(this, arguments);
            }
            function _(r, e) {
                if (r == null) return {};
                var t = {};
                var n = Object.keys(r);
                var o, a;
                for(a = 0; a < n.length; a++){
                    o = n[a];
                    if (e.indexOf(o) >= 0) continue;
                    t[o] = r[o];
                }
                return t;
            }
            var x = [
                "containerRef"
            ];
            var y = (0, c.kr)({
                strict: false,
                name: "PortalContext"
            }), w = y[0], S = y[1];
            var k = "chakra-portal";
            var C = ".chakra-portal";
            var A = function r(e) {
                return i.createElement("div", {
                    className: "chakra-portal-zIndex",
                    style: {
                        position: "absolute",
                        zIndex: e.zIndex,
                        top: 0,
                        left: 0,
                        right: 0
                    }
                }, e.children);
            };
            var z = function r(e) {
                var t = e.appendToParentPortal, n = e.children;
                var o = i.useRef(null);
                var a = i.useRef(null);
                var l = (0, d.NW)();
                var $ = S();
                var s = h();
                (0, f.a)(function() {
                    if (!o.current) return;
                    var r = o.current.ownerDocument;
                    var e = t ? $ != null ? $ : r.body : r.body;
                    if (!e) return;
                    a.current = r.createElement("div");
                    a.current.className = k;
                    e.appendChild(a.current);
                    l();
                    var n = a.current;
                    return function() {
                        if (e.contains(n)) {
                            e.removeChild(n);
                        }
                    };
                }, []);
                var u = s != null && s.zIndex ? i.createElement(A, {
                    zIndex: s == null ? void 0 : s.zIndex
                }, n) : n;
                return a.current ? (0, v.createPortal)(i.createElement(w, {
                    value: a.current
                }, u), a.current) : i.createElement("span", {
                    ref: o
                });
            };
            var E = function r(e) {
                var t = e.children, n = e.containerRef, o = e.appendToParentPortal;
                var a = n.current;
                var l = a != null ? a : u.jU ? document.body : undefined;
                var $ = i.useMemo(function() {
                    var r = a == null ? void 0 : a.ownerDocument.createElement("div");
                    if (r) r.className = k;
                    return r;
                }, [
                    a
                ]);
                var s = (0, d.NW)();
                (0, f.a)(function() {
                    s();
                }, []);
                (0, f.a)(function() {
                    if (!$ || !l) return;
                    l.appendChild($);
                    return function() {
                        l.removeChild($);
                    };
                }, [
                    $,
                    l
                ]);
                if (l && $) {
                    return (0, v.createPortal)(i.createElement(w, {
                        value: o ? $ : null
                    }, t), $);
                }
                return null;
            };
            function F(r) {
                var e = r.containerRef, t = _(r, x);
                return e ? i.createElement(E, g({
                    containerRef: e
                }, t)) : i.createElement(z, t);
            }
            F.defaultProps = {
                appendToParentPortal: true
            };
            F.className = k;
            F.selector = C;
            if (u.Ts) {
                F.displayName = "Portal";
            }
            var B = t(2846);
            var P = t(949);
            var D = {
                body: {
                    classList: {
                        add: function r() {},
                        remove: function r() {}
                    }
                },
                addEventListener: function r() {},
                removeEventListener: function r() {},
                activeElement: {
                    blur: function r() {},
                    nodeName: ""
                },
                querySelector: function r() {
                    return null;
                },
                querySelectorAll: function r() {
                    return [];
                },
                getElementById: function r() {
                    return null;
                },
                createEvent: function r() {
                    return {
                        initEvent: function r() {}
                    };
                },
                createElement: function r() {
                    return {
                        children: [],
                        childNodes: [],
                        style: {},
                        setAttribute: function r() {},
                        getElementsByTagName: function r() {
                            return [];
                        }
                    };
                }
            };
            var R = D;
            var H = function r() {};
            var W = {
                document: R,
                navigator: {
                    userAgent: ""
                },
                CustomEvent: function r() {
                    return this;
                },
                addEventListener: H,
                removeEventListener: H,
                getComputedStyle: function r() {
                    return {
                        getPropertyValue: function r() {
                            return "";
                        }
                    };
                },
                matchMedia: function r() {
                    return {
                        matches: false,
                        addListener: H,
                        removeListener: H
                    };
                },
                requestAnimationFrame: function r(e) {
                    if (typeof setTimeout === "undefined") {
                        e();
                        return null;
                    }
                    return setTimeout(e, 0);
                },
                cancelAnimationFrame: function r(e) {
                    if (typeof setTimeout === "undefined") return;
                    clearTimeout(e);
                },
                setTimeout: function r() {
                    return 0;
                },
                clearTimeout: H,
                setInterval: function r() {
                    return 0;
                },
                clearInterval: H
            };
            var I = W;
            var T = {
                window: I,
                document: R
            };
            var N = u.jU ? {
                window: window,
                document: document
            } : T;
            var M = (0, i.createContext)(N);
            if (u.Ts) {
                M.displayName = "EnvironmentContext";
            }
            function O() {
                return useContext(M);
            }
            function L(r) {
                var e = r.children, t = r.environment;
                var n = (0, i.useState)(null), o = n[0], a = n[1];
                var l = (0, i.useMemo)(function() {
                    var r;
                    var e = o == null ? void 0 : o.ownerDocument;
                    var n = o == null ? void 0 : o.ownerDocument.defaultView;
                    var a = e ? {
                        document: e,
                        window: n
                    } : undefined;
                    var i = (r = t != null ? t : a) != null ? r : N;
                    return i;
                }, [
                    o,
                    t
                ]);
                return i.createElement(M.Provider, {
                    value: l
                }, e, i.createElement("span", {
                    hidden: true,
                    className: "chakra-env",
                    ref: function r(e) {
                        (0, i.startTransition)(function() {
                            if (e) a(e);
                        });
                    }
                }));
            }
            if (u.Ts) {
                L.displayName = "EnvironmentProvider";
            }
            var V = function r(e) {
                var t = e.children, n = e.colorModeManager, o = e.portalZIndex, a = e.resetCSS, l = a === void 0 ? true : a, $ = e.theme, u = $ === void 0 ? {} : $, c = e.environment, d = e.cssVarsRoot;
                var f = i.createElement(L, {
                    environment: c
                }, t);
                return i.createElement(B.f6, {
                    theme: u,
                    cssVarsRoot: d
                }, i.createElement(P.SG, {
                    colorModeManager: n,
                    options: u.config
                }, l && i.createElement(s, null), i.createElement(B.ZL, null), o ? i.createElement(b, {
                    zIndex: o
                }, f) : f));
            };
            var j = {
                px: "1px",
                0.5: "0.125rem",
                1: "0.25rem",
                1.5: "0.375rem",
                2: "0.5rem",
                2.5: "0.625rem",
                3: "0.75rem",
                3.5: "0.875rem",
                4: "1rem",
                5: "1.25rem",
                6: "1.5rem",
                7: "1.75rem",
                8: "2rem",
                9: "2.25rem",
                10: "2.5rem",
                12: "3rem",
                14: "3.5rem",
                16: "4rem",
                20: "5rem",
                24: "6rem",
                28: "7rem",
                32: "8rem",
                36: "9rem",
                40: "10rem",
                44: "11rem",
                48: "12rem",
                52: "13rem",
                56: "14rem",
                60: "15rem",
                64: "16rem",
                72: "18rem",
                80: "20rem",
                96: "24rem"
            };
            function q() {
                q = Object.assign ? Object.assign.bind() : function(r) {
                    for(var e = 1; e < arguments.length; e++){
                        var t = arguments[e];
                        for(var n in t){
                            if (Object.prototype.hasOwnProperty.call(t, n)) {
                                r[n] = t[n];
                            }
                        }
                    }
                    return r;
                };
                return q.apply(this, arguments);
            }
            var Z = {
                max: "max-content",
                min: "min-content",
                full: "100%",
                "3xs": "14rem",
                "2xs": "16rem",
                xs: "20rem",
                sm: "24rem",
                md: "28rem",
                lg: "32rem",
                xl: "36rem",
                "2xl": "42rem",
                "3xl": "48rem",
                "4xl": "56rem",
                "5xl": "64rem",
                "6xl": "72rem",
                "7xl": "80rem",
                "8xl": "90rem"
            };
            var U = {
                sm: "640px",
                md: "768px",
                lg: "1024px",
                xl: "1280px"
            };
            var G = q({}, j, Z, {
                container: U
            });
            function J(r, e) {
                if (X(r)) {
                    r = "100%";
                }
                var t = Y(r);
                r = e === 360 ? r : Math.min(e, Math.max(0, parseFloat(r)));
                if (t) {
                    r = parseInt(String(r * e), 10) / 100;
                }
                if (Math.abs(r - e) < 0.000001) {
                    return 1;
                }
                if (e === 360) {
                    r = (r < 0 ? (r % e) + e : r % e) / parseFloat(String(e));
                } else {
                    r = (r % e) / parseFloat(String(e));
                }
                return r;
            }
            function K(r) {
                return Math.min(1, Math.max(0, r));
            }
            function X(r) {
                return (typeof r === "string" && r.indexOf(".") !== -1 && parseFloat(r) === 1);
            }
            function Y(r) {
                return typeof r === "string" && r.indexOf("%") !== -1;
            }
            function Q(r) {
                r = parseFloat(r);
                if (isNaN(r) || r < 0 || r > 1) {
                    r = 1;
                }
                return r;
            }
            function rr(r) {
                if (r <= 1) {
                    return "".concat(Number(r) * 100, "%");
                }
                return r;
            }
            function re(r) {
                return r.length === 1 ? "0" + r : String(r);
            }
            function rt(r, e, t) {
                return {
                    r: J(r, 255) * 255,
                    g: J(e, 255) * 255,
                    b: J(t, 255) * 255
                };
            }
            function rn(r, e, t) {
                r = J(r, 255);
                e = J(e, 255);
                t = J(t, 255);
                var n = Math.max(r, e, t);
                var o = Math.min(r, e, t);
                var a = 0;
                var i = 0;
                var l = (n + o) / 2;
                if (n === o) {
                    i = 0;
                    a = 0;
                } else {
                    var $ = n - o;
                    i = l > 0.5 ? $ / (2 - n - o) : $ / (n + o);
                    switch(n){
                        case r:
                            a = (e - t) / $ + (e < t ? 6 : 0);
                            break;
                        case e:
                            a = (t - r) / $ + 2;
                            break;
                        case t:
                            a = (r - e) / $ + 4;
                            break;
                        default:
                            break;
                    }
                    a /= 6;
                }
                return {
                    h: a,
                    s: i,
                    l: l
                };
            }
            function ro(r, e, t) {
                if (t < 0) {
                    t += 1;
                }
                if (t > 1) {
                    t -= 1;
                }
                if (t < 1 / 6) {
                    return r + (e - r) * (6 * t);
                }
                if (t < 1 / 2) {
                    return e;
                }
                if (t < 2 / 3) {
                    return r + (e - r) * (2 / 3 - t) * 6;
                }
                return r;
            }
            function ra(r, e, t) {
                var n;
                var o;
                var a;
                r = J(r, 360);
                e = J(e, 100);
                t = J(t, 100);
                if (e === 0) {
                    o = t;
                    a = t;
                    n = t;
                } else {
                    var i = t < 0.5 ? t * (1 + e) : t + e - t * e;
                    var l = 2 * t - i;
                    n = ro(l, i, r + 1 / 3);
                    o = ro(l, i, r);
                    a = ro(l, i, r - 1 / 3);
                }
                return {
                    r: n * 255,
                    g: o * 255,
                    b: a * 255
                };
            }
            function ri(r, e, t) {
                r = J(r, 255);
                e = J(e, 255);
                t = J(t, 255);
                var n = Math.max(r, e, t);
                var o = Math.min(r, e, t);
                var a = 0;
                var i = n;
                var l = n - o;
                var $ = n === 0 ? 0 : l / n;
                if (n === o) {
                    a = 0;
                } else {
                    switch(n){
                        case r:
                            a = (e - t) / l + (e < t ? 6 : 0);
                            break;
                        case e:
                            a = (t - r) / l + 2;
                            break;
                        case t:
                            a = (r - e) / l + 4;
                            break;
                        default:
                            break;
                    }
                    a /= 6;
                }
                return {
                    h: a,
                    s: $,
                    v: i
                };
            }
            function rl(r, e, t) {
                r = J(r, 360) * 6;
                e = J(e, 100);
                t = J(t, 100);
                var n = Math.floor(r);
                var o = r - n;
                var a = t * (1 - e);
                var i = t * (1 - o * e);
                var l = t * (1 - (1 - o) * e);
                var $ = n % 6;
                var s = [
                    t,
                    i,
                    a,
                    a,
                    l,
                    t
                ][$];
                var u = [
                    l,
                    t,
                    t,
                    i,
                    a,
                    a
                ][$];
                var c = [
                    a,
                    a,
                    l,
                    t,
                    t,
                    i
                ][$];
                return {
                    r: s * 255,
                    g: u * 255,
                    b: c * 255
                };
            }
            function r$(r, e, t, n) {
                var o = [
                    re(Math.round(r).toString(16)),
                    re(Math.round(e).toString(16)),
                    re(Math.round(t).toString(16)), 
                ];
                if (n && o[0].startsWith(o[0].charAt(1)) && o[1].startsWith(o[1].charAt(1)) && o[2].startsWith(o[2].charAt(1))) {
                    return (o[0].charAt(0) + o[1].charAt(0) + o[2].charAt(0));
                }
                return o.join("");
            }
            function rs(r, e, t, n, o) {
                var a = [
                    re(Math.round(r).toString(16)),
                    re(Math.round(e).toString(16)),
                    re(Math.round(t).toString(16)),
                    re(rc(n)), 
                ];
                if (o && a[0].startsWith(a[0].charAt(1)) && a[1].startsWith(a[1].charAt(1)) && a[2].startsWith(a[2].charAt(1)) && a[3].startsWith(a[3].charAt(1))) {
                    return (a[0].charAt(0) + a[1].charAt(0) + a[2].charAt(0) + a[3].charAt(0));
                }
                return a.join("");
            }
            function ru(r, e, t, n) {
                var o = [
                    pad2(rc(n)),
                    pad2(Math.round(r).toString(16)),
                    pad2(Math.round(e).toString(16)),
                    pad2(Math.round(t).toString(16)), 
                ];
                return o.join("");
            }
            function rc(r) {
                return Math.round(parseFloat(r) * 255).toString(16);
            }
            function rd(r) {
                return rf(r) / 255;
            }
            function rf(r) {
                return parseInt(r, 16);
            }
            function rv(r) {
                return {
                    r: r >> 16,
                    g: (r & 0xff00) >> 8,
                    b: r & 0xff
                };
            }
            var rp = {
                aliceblue: "#f0f8ff",
                antiquewhite: "#faebd7",
                aqua: "#00ffff",
                aquamarine: "#7fffd4",
                azure: "#f0ffff",
                beige: "#f5f5dc",
                bisque: "#ffe4c4",
                black: "#000000",
                blanchedalmond: "#ffebcd",
                blue: "#0000ff",
                blueviolet: "#8a2be2",
                brown: "#a52a2a",
                burlywood: "#deb887",
                cadetblue: "#5f9ea0",
                chartreuse: "#7fff00",
                chocolate: "#d2691e",
                coral: "#ff7f50",
                cornflowerblue: "#6495ed",
                cornsilk: "#fff8dc",
                crimson: "#dc143c",
                cyan: "#00ffff",
                darkblue: "#00008b",
                darkcyan: "#008b8b",
                darkgoldenrod: "#b8860b",
                darkgray: "#a9a9a9",
                darkgreen: "#006400",
                darkgrey: "#a9a9a9",
                darkkhaki: "#bdb76b",
                darkmagenta: "#8b008b",
                darkolivegreen: "#556b2f",
                darkorange: "#ff8c00",
                darkorchid: "#9932cc",
                darkred: "#8b0000",
                darksalmon: "#e9967a",
                darkseagreen: "#8fbc8f",
                darkslateblue: "#483d8b",
                darkslategray: "#2f4f4f",
                darkslategrey: "#2f4f4f",
                darkturquoise: "#00ced1",
                darkviolet: "#9400d3",
                deeppink: "#ff1493",
                deepskyblue: "#00bfff",
                dimgray: "#696969",
                dimgrey: "#696969",
                dodgerblue: "#1e90ff",
                firebrick: "#b22222",
                floralwhite: "#fffaf0",
                forestgreen: "#228b22",
                fuchsia: "#ff00ff",
                gainsboro: "#dcdcdc",
                ghostwhite: "#f8f8ff",
                goldenrod: "#daa520",
                gold: "#ffd700",
                gray: "#808080",
                green: "#008000",
                greenyellow: "#adff2f",
                grey: "#808080",
                honeydew: "#f0fff0",
                hotpink: "#ff69b4",
                indianred: "#cd5c5c",
                indigo: "#4b0082",
                ivory: "#fffff0",
                khaki: "#f0e68c",
                lavenderblush: "#fff0f5",
                lavender: "#e6e6fa",
                lawngreen: "#7cfc00",
                lemonchiffon: "#fffacd",
                lightblue: "#add8e6",
                lightcoral: "#f08080",
                lightcyan: "#e0ffff",
                lightgoldenrodyellow: "#fafad2",
                lightgray: "#d3d3d3",
                lightgreen: "#90ee90",
                lightgrey: "#d3d3d3",
                lightpink: "#ffb6c1",
                lightsalmon: "#ffa07a",
                lightseagreen: "#20b2aa",
                lightskyblue: "#87cefa",
                lightslategray: "#778899",
                lightslategrey: "#778899",
                lightsteelblue: "#b0c4de",
                lightyellow: "#ffffe0",
                lime: "#00ff00",
                limegreen: "#32cd32",
                linen: "#faf0e6",
                magenta: "#ff00ff",
                maroon: "#800000",
                mediumaquamarine: "#66cdaa",
                mediumblue: "#0000cd",
                mediumorchid: "#ba55d3",
                mediumpurple: "#9370db",
                mediumseagreen: "#3cb371",
                mediumslateblue: "#7b68ee",
                mediumspringgreen: "#00fa9a",
                mediumturquoise: "#48d1cc",
                mediumvioletred: "#c71585",
                midnightblue: "#191970",
                mintcream: "#f5fffa",
                mistyrose: "#ffe4e1",
                moccasin: "#ffe4b5",
                navajowhite: "#ffdead",
                navy: "#000080",
                oldlace: "#fdf5e6",
                olive: "#808000",
                olivedrab: "#6b8e23",
                orange: "#ffa500",
                orangered: "#ff4500",
                orchid: "#da70d6",
                palegoldenrod: "#eee8aa",
                palegreen: "#98fb98",
                paleturquoise: "#afeeee",
                palevioletred: "#db7093",
                papayawhip: "#ffefd5",
                peachpuff: "#ffdab9",
                peru: "#cd853f",
                pink: "#ffc0cb",
                plum: "#dda0dd",
                powderblue: "#b0e0e6",
                purple: "#800080",
                rebeccapurple: "#663399",
                red: "#ff0000",
                rosybrown: "#bc8f8f",
                royalblue: "#4169e1",
                saddlebrown: "#8b4513",
                salmon: "#fa8072",
                sandybrown: "#f4a460",
                seagreen: "#2e8b57",
                seashell: "#fff5ee",
                sienna: "#a0522d",
                silver: "#c0c0c0",
                skyblue: "#87ceeb",
                slateblue: "#6a5acd",
                slategray: "#708090",
                slategrey: "#708090",
                snow: "#fffafa",
                springgreen: "#00ff7f",
                steelblue: "#4682b4",
                tan: "#d2b48c",
                teal: "#008080",
                thistle: "#d8bfd8",
                tomato: "#ff6347",
                turquoise: "#40e0d0",
                violet: "#ee82ee",
                wheat: "#f5deb3",
                white: "#ffffff",
                whitesmoke: "#f5f5f5",
                yellow: "#ffff00",
                yellowgreen: "#9acd32"
            };
            function rm(r) {
                var e = {
                    r: 0,
                    g: 0,
                    b: 0
                };
                var t = 1;
                var n = null;
                var o = null;
                var a = null;
                var i = false;
                var l = false;
                if (typeof r === "string") {
                    r = rx(r);
                }
                if (typeof r === "object") {
                    if (ry(r.r) && ry(r.g) && ry(r.b)) {
                        e = rt(r.r, r.g, r.b);
                        i = true;
                        l = String(r.r).substr(-1) === "%" ? "prgb" : "rgb";
                    } else if (ry(r.h) && ry(r.s) && ry(r.v)) {
                        n = rr(r.s);
                        o = rr(r.v);
                        e = rl(r.h, n, o);
                        i = true;
                        l = "hsv";
                    } else if (ry(r.h) && ry(r.s) && ry(r.l)) {
                        n = rr(r.s);
                        a = rr(r.l);
                        e = ra(r.h, n, a);
                        i = true;
                        l = "hsl";
                    }
                    if (Object.prototype.hasOwnProperty.call(r, "a")) {
                        t = r.a;
                    }
                }
                t = Q(t);
                return {
                    ok: i,
                    format: r.format || l,
                    r: Math.min(255, Math.max(e.r, 0)),
                    g: Math.min(255, Math.max(e.g, 0)),
                    b: Math.min(255, Math.max(e.b, 0)),
                    a: t
                };
            }
            var rh = "[-\\+]?\\d+%?";
            var rb = "[-\\+]?\\d*\\.\\d+%?";
            var rg = "(?:".concat(rb, ")|(?:").concat(rh, ")");
            var r_ = "[\\s|\\(]+(".concat(rg, ")[,|\\s]+(").concat(rg, ")[,|\\s]+(").concat(rg, ")\\s*\\)?");
            var r3 = "[\\s|\\(]+(".concat(rg, ")[,|\\s]+(").concat(rg, ")[,|\\s]+(").concat(rg, ")[,|\\s]+(").concat(rg, ")\\s*\\)?");
            var r0 = {
                CSS_UNIT: new RegExp(rg),
                rgb: new RegExp("rgb" + r_),
                rgba: new RegExp("rgba" + r3),
                hsl: new RegExp("hsl" + r_),
                hsla: new RegExp("hsla" + r3),
                hsv: new RegExp("hsv" + r_),
                hsva: new RegExp("hsva" + r3),
                hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
                hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
                hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
                hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
            };
            function rx(r) {
                r = r.trim().toLowerCase();
                if (r.length === 0) {
                    return false;
                }
                var e = false;
                if (rp[r]) {
                    r = rp[r];
                    e = true;
                } else if (r === "transparent") {
                    return {
                        r: 0,
                        g: 0,
                        b: 0,
                        a: 0,
                        format: "name"
                    };
                }
                var t = r0.rgb.exec(r);
                if (t) {
                    return {
                        r: t[1],
                        g: t[2],
                        b: t[3]
                    };
                }
                t = r0.rgba.exec(r);
                if (t) {
                    return {
                        r: t[1],
                        g: t[2],
                        b: t[3],
                        a: t[4]
                    };
                }
                t = r0.hsl.exec(r);
                if (t) {
                    return {
                        h: t[1],
                        s: t[2],
                        l: t[3]
                    };
                }
                t = r0.hsla.exec(r);
                if (t) {
                    return {
                        h: t[1],
                        s: t[2],
                        l: t[3],
                        a: t[4]
                    };
                }
                t = r0.hsv.exec(r);
                if (t) {
                    return {
                        h: t[1],
                        s: t[2],
                        v: t[3]
                    };
                }
                t = r0.hsva.exec(r);
                if (t) {
                    return {
                        h: t[1],
                        s: t[2],
                        v: t[3],
                        a: t[4]
                    };
                }
                t = r0.hex8.exec(r);
                if (t) {
                    return {
                        r: rf(t[1]),
                        g: rf(t[2]),
                        b: rf(t[3]),
                        a: rd(t[4]),
                        format: e ? "name" : "hex8"
                    };
                }
                t = r0.hex6.exec(r);
                if (t) {
                    return {
                        r: rf(t[1]),
                        g: rf(t[2]),
                        b: rf(t[3]),
                        format: e ? "name" : "hex"
                    };
                }
                t = r0.hex4.exec(r);
                if (t) {
                    return {
                        r: rf(t[1] + t[1]),
                        g: rf(t[2] + t[2]),
                        b: rf(t[3] + t[3]),
                        a: rd(t[4] + t[4]),
                        format: e ? "name" : "hex8"
                    };
                }
                t = r0.hex3.exec(r);
                if (t) {
                    return {
                        r: rf(t[1] + t[1]),
                        g: rf(t[2] + t[2]),
                        b: rf(t[3] + t[3]),
                        format: e ? "name" : "hex"
                    };
                }
                return false;
            }
            function ry(r) {
                return Boolean(r0.CSS_UNIT.exec(String(r)));
            }
            var rw = (function() {
                function r(e, t) {
                    if (e === void 0) {
                        e = "";
                    }
                    if (t === void 0) {
                        t = {};
                    }
                    var n;
                    if (e instanceof r) {
                        return e;
                    }
                    if (typeof e === "number") {
                        e = rv(e);
                    }
                    this.originalInput = e;
                    var o = rm(e);
                    this.originalInput = e;
                    this.r = o.r;
                    this.g = o.g;
                    this.b = o.b;
                    this.a = o.a;
                    this.roundA = Math.round(100 * this.a) / 100;
                    this.format = (n = t.format) !== null && n !== void 0 ? n : o.format;
                    this.gradientType = t.gradientType;
                    if (this.r < 1) {
                        this.r = Math.round(this.r);
                    }
                    if (this.g < 1) {
                        this.g = Math.round(this.g);
                    }
                    if (this.b < 1) {
                        this.b = Math.round(this.b);
                    }
                    this.isValid = o.ok;
                }
                r.prototype.isDark = function() {
                    return this.getBrightness() < 128;
                };
                r.prototype.isLight = function() {
                    return !this.isDark();
                };
                r.prototype.getBrightness = function() {
                    var r = this.toRgb();
                    return (r.r * 299 + r.g * 587 + r.b * 114) / 1000;
                };
                r.prototype.getLuminance = function() {
                    var r = this.toRgb();
                    var e;
                    var t;
                    var n;
                    var o = r.r / 255;
                    var a = r.g / 255;
                    var i = r.b / 255;
                    if (o <= 0.03928) {
                        e = o / 12.92;
                    } else {
                        e = Math.pow((o + 0.055) / 1.055, 2.4);
                    }
                    if (a <= 0.03928) {
                        t = a / 12.92;
                    } else {
                        t = Math.pow((a + 0.055) / 1.055, 2.4);
                    }
                    if (i <= 0.03928) {
                        n = i / 12.92;
                    } else {
                        n = Math.pow((i + 0.055) / 1.055, 2.4);
                    }
                    return 0.2126 * e + 0.7152 * t + 0.0722 * n;
                };
                r.prototype.getAlpha = function() {
                    return this.a;
                };
                r.prototype.setAlpha = function(r) {
                    this.a = Q(r);
                    this.roundA = Math.round(100 * this.a) / 100;
                    return this;
                };
                r.prototype.toHsv = function() {
                    var r = ri(this.r, this.g, this.b);
                    return {
                        h: r.h * 360,
                        s: r.s,
                        v: r.v,
                        a: this.a
                    };
                };
                r.prototype.toHsvString = function() {
                    var r = ri(this.r, this.g, this.b);
                    var e = Math.round(r.h * 360);
                    var t = Math.round(r.s * 100);
                    var n = Math.round(r.v * 100);
                    return this.a === 1 ? "hsv(".concat(e, ", ").concat(t, "%, ").concat(n, "%)") : "hsva(".concat(e, ", ").concat(t, "%, ").concat(n, "%, ").concat(this.roundA, ")");
                };
                r.prototype.toHsl = function() {
                    var r = rn(this.r, this.g, this.b);
                    return {
                        h: r.h * 360,
                        s: r.s,
                        l: r.l,
                        a: this.a
                    };
                };
                r.prototype.toHslString = function() {
                    var r = rn(this.r, this.g, this.b);
                    var e = Math.round(r.h * 360);
                    var t = Math.round(r.s * 100);
                    var n = Math.round(r.l * 100);
                    return this.a === 1 ? "hsl(".concat(e, ", ").concat(t, "%, ").concat(n, "%)") : "hsla(".concat(e, ", ").concat(t, "%, ").concat(n, "%, ").concat(this.roundA, ")");
                };
                r.prototype.toHex = function(r) {
                    if (r === void 0) {
                        r = false;
                    }
                    return r$(this.r, this.g, this.b, r);
                };
                r.prototype.toHexString = function(r) {
                    if (r === void 0) {
                        r = false;
                    }
                    return "#" + this.toHex(r);
                };
                r.prototype.toHex8 = function(r) {
                    if (r === void 0) {
                        r = false;
                    }
                    return rs(this.r, this.g, this.b, this.a, r);
                };
                r.prototype.toHex8String = function(r) {
                    if (r === void 0) {
                        r = false;
                    }
                    return "#" + this.toHex8(r);
                };
                r.prototype.toRgb = function() {
                    return {
                        r: Math.round(this.r),
                        g: Math.round(this.g),
                        b: Math.round(this.b),
                        a: this.a
                    };
                };
                r.prototype.toRgbString = function() {
                    var r = Math.round(this.r);
                    var e = Math.round(this.g);
                    var t = Math.round(this.b);
                    return this.a === 1 ? "rgb(".concat(r, ", ").concat(e, ", ").concat(t, ")") : "rgba(".concat(r, ", ").concat(e, ", ").concat(t, ", ").concat(this.roundA, ")");
                };
                r.prototype.toPercentageRgb = function() {
                    var r = function(r) {
                        return "".concat(Math.round(J(r, 255) * 100), "%");
                    };
                    return {
                        r: r(this.r),
                        g: r(this.g),
                        b: r(this.b),
                        a: this.a
                    };
                };
                r.prototype.toPercentageRgbString = function() {
                    var r = function(r) {
                        return Math.round(J(r, 255) * 100);
                    };
                    return this.a === 1 ? "rgb(".concat(r(this.r), "%, ").concat(r(this.g), "%, ").concat(r(this.b), "%)") : "rgba(".concat(r(this.r), "%, ").concat(r(this.g), "%, ").concat(r(this.b), "%, ").concat(this.roundA, ")");
                };
                r.prototype.toName = function() {
                    if (this.a === 0) {
                        return "transparent";
                    }
                    if (this.a < 1) {
                        return false;
                    }
                    var r = "#" + r$(this.r, this.g, this.b, false);
                    for(var e = 0, t = Object.entries(rp); e < t.length; e++){
                        var n = t[e], o = n[0], a = n[1];
                        if (r === a) {
                            return o;
                        }
                    }
                    return false;
                };
                r.prototype.toString = function(r) {
                    var e = Boolean(r);
                    r = r !== null && r !== void 0 ? r : this.format;
                    var t = false;
                    var n = this.a < 1 && this.a >= 0;
                    var o = !e && n && (r.startsWith("hex") || r === "name");
                    if (o) {
                        if (r === "name" && this.a === 0) {
                            return this.toName();
                        }
                        return this.toRgbString();
                    }
                    if (r === "rgb") {
                        t = this.toRgbString();
                    }
                    if (r === "prgb") {
                        t = this.toPercentageRgbString();
                    }
                    if (r === "hex" || r === "hex6") {
                        t = this.toHexString();
                    }
                    if (r === "hex3") {
                        t = this.toHexString(true);
                    }
                    if (r === "hex4") {
                        t = this.toHex8String(true);
                    }
                    if (r === "hex8") {
                        t = this.toHex8String();
                    }
                    if (r === "name") {
                        t = this.toName();
                    }
                    if (r === "hsl") {
                        t = this.toHslString();
                    }
                    if (r === "hsv") {
                        t = this.toHsvString();
                    }
                    return t || this.toHexString();
                };
                r.prototype.toNumber = function() {
                    return ((Math.round(this.r) << 16) + (Math.round(this.g) << 8) + Math.round(this.b));
                };
                r.prototype.clone = function() {
                    return new r(this.toString());
                };
                r.prototype.lighten = function(e) {
                    if (e === void 0) {
                        e = 10;
                    }
                    var t = this.toHsl();
                    t.l += e / 100;
                    t.l = K(t.l);
                    return new r(t);
                };
                r.prototype.brighten = function(e) {
                    if (e === void 0) {
                        e = 10;
                    }
                    var t = this.toRgb();
                    t.r = Math.max(0, Math.min(255, t.r - Math.round(255 * -(e / 100))));
                    t.g = Math.max(0, Math.min(255, t.g - Math.round(255 * -(e / 100))));
                    t.b = Math.max(0, Math.min(255, t.b - Math.round(255 * -(e / 100))));
                    return new r(t);
                };
                r.prototype.darken = function(e) {
                    if (e === void 0) {
                        e = 10;
                    }
                    var t = this.toHsl();
                    t.l -= e / 100;
                    t.l = K(t.l);
                    return new r(t);
                };
                r.prototype.tint = function(r) {
                    if (r === void 0) {
                        r = 10;
                    }
                    return this.mix("white", r);
                };
                r.prototype.shade = function(r) {
                    if (r === void 0) {
                        r = 10;
                    }
                    return this.mix("black", r);
                };
                r.prototype.desaturate = function(e) {
                    if (e === void 0) {
                        e = 10;
                    }
                    var t = this.toHsl();
                    t.s -= e / 100;
                    t.s = K(t.s);
                    return new r(t);
                };
                r.prototype.saturate = function(e) {
                    if (e === void 0) {
                        e = 10;
                    }
                    var t = this.toHsl();
                    t.s += e / 100;
                    t.s = K(t.s);
                    return new r(t);
                };
                r.prototype.greyscale = function() {
                    return this.desaturate(100);
                };
                r.prototype.spin = function(e) {
                    var t = this.toHsl();
                    var n = (t.h + e) % 360;
                    t.h = n < 0 ? 360 + n : n;
                    return new r(t);
                };
                r.prototype.mix = function(e, t) {
                    if (t === void 0) {
                        t = 50;
                    }
                    var n = this.toRgb();
                    var o = new r(e).toRgb();
                    var a = t / 100;
                    var i = {
                        r: (o.r - n.r) * a + n.r,
                        g: (o.g - n.g) * a + n.g,
                        b: (o.b - n.b) * a + n.b,
                        a: (o.a - n.a) * a + n.a
                    };
                    return new r(i);
                };
                r.prototype.analogous = function(e, t) {
                    if (e === void 0) {
                        e = 6;
                    }
                    if (t === void 0) {
                        t = 30;
                    }
                    var n = this.toHsl();
                    var o = 360 / t;
                    var a = [
                        this
                    ];
                    for(n.h = (n.h - ((o * e) >> 1) + 720) % 360; --e;){
                        n.h = (n.h + o) % 360;
                        a.push(new r(n));
                    }
                    return a;
                };
                r.prototype.complement = function() {
                    var e = this.toHsl();
                    e.h = (e.h + 180) % 360;
                    return new r(e);
                };
                r.prototype.monochromatic = function(e) {
                    if (e === void 0) {
                        e = 6;
                    }
                    var t = this.toHsv();
                    var n = t.h;
                    var o = t.s;
                    var a = t.v;
                    var i = [];
                    var l = 1 / e;
                    while(e--){
                        i.push(new r({
                            h: n,
                            s: o,
                            v: a
                        }));
                        a = (a + l) % 1;
                    }
                    return i;
                };
                r.prototype.splitcomplement = function() {
                    var e = this.toHsl();
                    var t = e.h;
                    return [
                        this,
                        new r({
                            h: (t + 72) % 360,
                            s: e.s,
                            l: e.l
                        }),
                        new r({
                            h: (t + 216) % 360,
                            s: e.s,
                            l: e.l
                        }), 
                    ];
                };
                r.prototype.onBackground = function(e) {
                    var t = this.toRgb();
                    var n = new r(e).toRgb();
                    return new r({
                        r: n.r + (t.r - n.r) * t.a,
                        g: n.g + (t.g - n.g) * t.a,
                        b: n.b + (t.b - n.b) * t.a
                    });
                };
                r.prototype.triad = function() {
                    return this.polyad(3);
                };
                r.prototype.tetrad = function() {
                    return this.polyad(4);
                };
                r.prototype.polyad = function(e) {
                    var t = this.toHsl();
                    var n = t.h;
                    var o = [
                        this
                    ];
                    var a = 360 / e;
                    for(var i = 1; i < e; i++){
                        o.push(new r({
                            h: (n + i * a) % 360,
                            s: t.s,
                            l: t.l
                        }));
                    }
                    return o;
                };
                r.prototype.equals = function(e) {
                    return (this.toRgbString() === new r(e).toRgbString());
                };
                return r;
            })();
            function r2(r, e) {
                if (r === void 0) {
                    r = "";
                }
                if (e === void 0) {
                    e = {};
                }
                return new rw(r, e);
            }
            function rS(r) {
                if (r === void 0) {
                    r = {};
                }
                if (r.count !== undefined && r.count !== null) {
                    var e = r.count;
                    var t = [];
                    r.count = undefined;
                    while(e > t.length){
                        r.count = null;
                        if (r.seed) {
                            r.seed += 1;
                        }
                        t.push(rS(r));
                    }
                    r.count = e;
                    return t;
                }
                var n = r4(r.hue, r.seed);
                var o = r1(n, r);
                var a = r6(n, o, r);
                var i = {
                    h: n,
                    s: o,
                    v: a
                };
                if (r.alpha !== undefined) {
                    i.a = r.alpha;
                }
                return new rw(i);
            }
            function r4(r, e) {
                var t = r5(r);
                var n = rC(t, e);
                if (n < 0) {
                    n = 360 + n;
                }
                return n;
            }
            function r1(r, e) {
                if (e.hue === "monochrome") {
                    return 0;
                }
                if (e.luminosity === "random") {
                    return rC([
                        0,
                        100
                    ], e.seed);
                }
                var t = r7(r).saturationRange;
                var n = t[0];
                var o = t[1];
                switch(e.luminosity){
                    case "bright":
                        n = 55;
                        break;
                    case "dark":
                        n = o - 10;
                        break;
                    case "light":
                        o = 55;
                        break;
                    default:
                        break;
                }
                return rC([
                    n,
                    o
                ], e.seed);
            }
            function r6(r, e, t) {
                var n = rk(r, e);
                var o = 100;
                switch(t.luminosity){
                    case "dark":
                        o = n + 20;
                        break;
                    case "light":
                        n = (o + n) / 2;
                        break;
                    case "random":
                        n = 0;
                        o = 100;
                        break;
                    default:
                        break;
                }
                return rC([
                    n,
                    o
                ], t.seed);
            }
            function rk(r, e) {
                var t = r7(r).lowerBounds;
                for(var n = 0; n < t.length - 1; n++){
                    var o = t[n][0];
                    var a = t[n][1];
                    var i = t[n + 1][0];
                    var l = t[n + 1][1];
                    if (e >= o && e <= i) {
                        var $ = (l - a) / (i - o);
                        var s = a - $ * o;
                        return $ * e + s;
                    }
                }
                return 0;
            }
            function r5(r) {
                var e = parseInt(r, 10);
                if (!Number.isNaN(e) && e < 360 && e > 0) {
                    return [
                        e,
                        e
                    ];
                }
                if (typeof r === "string") {
                    var t = rz.find(function(e) {
                        return e.name === r;
                    });
                    if (t) {
                        var n = rA(t);
                        if (n.hueRange) {
                            return n.hueRange;
                        }
                    }
                    var o = new rw(r);
                    if (o.isValid) {
                        var a = o.toHsv().h;
                        return [
                            a,
                            a
                        ];
                    }
                }
                return [
                    0,
                    360
                ];
            }
            function r7(r) {
                if (r >= 334 && r <= 360) {
                    r -= 360;
                }
                for(var e = 0, t = rz; e < t.length; e++){
                    var n = t[e];
                    var o = rA(n);
                    if (o.hueRange && r >= o.hueRange[0] && r <= o.hueRange[1]) {
                        return o;
                    }
                }
                throw Error("Color not found");
            }
            function rC(r, e) {
                if (e === undefined) {
                    return Math.floor(r[0] + Math.random() * (r[1] + 1 - r[0]));
                }
                var t = r[1] || 1;
                var n = r[0] || 0;
                e = (e * 9301 + 49297) % 233280;
                var o = e / 233280.0;
                return Math.floor(n + o * (t - n));
            }
            function rA(r) {
                var e = r.lowerBounds[0][0];
                var t = r.lowerBounds[r.lowerBounds.length - 1][0];
                var n = r.lowerBounds[r.lowerBounds.length - 1][1];
                var o = r.lowerBounds[0][1];
                return {
                    name: r.name,
                    hueRange: r.hueRange,
                    lowerBounds: r.lowerBounds,
                    saturationRange: [
                        e,
                        t
                    ],
                    brightnessRange: [
                        n,
                        o
                    ]
                };
            }
            var rz = [
                {
                    name: "monochrome",
                    hueRange: null,
                    lowerBounds: [
                        [
                            0,
                            0
                        ],
                        [
                            100,
                            0
                        ], 
                    ]
                },
                {
                    name: "red",
                    hueRange: [
                        -26,
                        18
                    ],
                    lowerBounds: [
                        [
                            20,
                            100
                        ],
                        [
                            30,
                            92
                        ],
                        [
                            40,
                            89
                        ],
                        [
                            50,
                            85
                        ],
                        [
                            60,
                            78
                        ],
                        [
                            70,
                            70
                        ],
                        [
                            80,
                            60
                        ],
                        [
                            90,
                            55
                        ],
                        [
                            100,
                            50
                        ], 
                    ]
                },
                {
                    name: "orange",
                    hueRange: [
                        19,
                        46
                    ],
                    lowerBounds: [
                        [
                            20,
                            100
                        ],
                        [
                            30,
                            93
                        ],
                        [
                            40,
                            88
                        ],
                        [
                            50,
                            86
                        ],
                        [
                            60,
                            85
                        ],
                        [
                            70,
                            70
                        ],
                        [
                            100,
                            70
                        ], 
                    ]
                },
                {
                    name: "yellow",
                    hueRange: [
                        47,
                        62
                    ],
                    lowerBounds: [
                        [
                            25,
                            100
                        ],
                        [
                            40,
                            94
                        ],
                        [
                            50,
                            89
                        ],
                        [
                            60,
                            86
                        ],
                        [
                            70,
                            84
                        ],
                        [
                            80,
                            82
                        ],
                        [
                            90,
                            80
                        ],
                        [
                            100,
                            75
                        ], 
                    ]
                },
                {
                    name: "green",
                    hueRange: [
                        63,
                        178
                    ],
                    lowerBounds: [
                        [
                            30,
                            100
                        ],
                        [
                            40,
                            90
                        ],
                        [
                            50,
                            85
                        ],
                        [
                            60,
                            81
                        ],
                        [
                            70,
                            74
                        ],
                        [
                            80,
                            64
                        ],
                        [
                            90,
                            50
                        ],
                        [
                            100,
                            40
                        ], 
                    ]
                },
                {
                    name: "blue",
                    hueRange: [
                        179,
                        257
                    ],
                    lowerBounds: [
                        [
                            20,
                            100
                        ],
                        [
                            30,
                            86
                        ],
                        [
                            40,
                            80
                        ],
                        [
                            50,
                            74
                        ],
                        [
                            60,
                            60
                        ],
                        [
                            70,
                            52
                        ],
                        [
                            80,
                            44
                        ],
                        [
                            90,
                            39
                        ],
                        [
                            100,
                            35
                        ], 
                    ]
                },
                {
                    name: "purple",
                    hueRange: [
                        258,
                        282
                    ],
                    lowerBounds: [
                        [
                            20,
                            100
                        ],
                        [
                            30,
                            87
                        ],
                        [
                            40,
                            79
                        ],
                        [
                            50,
                            70
                        ],
                        [
                            60,
                            65
                        ],
                        [
                            70,
                            59
                        ],
                        [
                            80,
                            52
                        ],
                        [
                            90,
                            45
                        ],
                        [
                            100,
                            42
                        ], 
                    ]
                },
                {
                    name: "pink",
                    hueRange: [
                        283,
                        334
                    ],
                    lowerBounds: [
                        [
                            20,
                            100
                        ],
                        [
                            30,
                            90
                        ],
                        [
                            40,
                            86
                        ],
                        [
                            60,
                            84
                        ],
                        [
                            80,
                            80
                        ],
                        [
                            90,
                            75
                        ],
                        [
                            100,
                            73
                        ], 
                    ]
                }, 
            ];
            var rE = function r(e, t, n) {
                var o = (0, u.Wf)(e, "colors." + t, t);
                var a = new rw(o), i = a.isValid;
                return i ? o : n;
            };
            var r8 = function r(e) {
                return function(r) {
                    var t = rE(r, e);
                    var n = new rw(t).isDark();
                    return n ? "dark" : "light";
                };
            };
            var rF = function r(e) {
                return function(r) {
                    return r8(e)(r) === "dark";
                };
            };
            var rB = function r(e) {
                return function(r) {
                    return r8(e)(r) === "light";
                };
            };
            var rP = function r(e, t) {
                return function(r) {
                    var n = rE(r, e);
                    return new rw(n).setAlpha(t).toRgbString();
                };
            };
            var rD = function r(e, t) {
                return function(r) {
                    var n = rE(r, e);
                    return new TinyColor(n).mix("#fff", t).toHexString();
                };
            };
            var rR = function r(e, t) {
                return function(r) {
                    var n = rE(r, e);
                    return new TinyColor(n).mix("#000", t).toHexString();
                };
            };
            var rH = function r(e, t) {
                return function(r) {
                    var n = rE(r, e);
                    return new TinyColor(n).darken(t).toHexString();
                };
            };
            var rW = function r(e, t) {
                return function(r) {
                    return new TinyColor(rE(r, e)).lighten(t).toHexString();
                };
            };
            var rI = function r(e, t) {
                return function(r) {
                    return readability(rE(r, t), rE(r, e));
                };
            };
            var rT = function r(e, t, n) {
                return function(r) {
                    return isReadable(rE(r, t), rE(r, e), n);
                };
            };
            var rN = function r(e) {
                return function(r) {
                    return new TinyColor(rE(r, e)).complement().toHexString();
                };
            };
            function rM(r, e) {
                if (r === void 0) {
                    r = "1rem";
                }
                if (e === void 0) {
                    e = "rgba(255, 255, 255, 0.15)";
                }
                return {
                    backgroundImage: "linear-gradient(\n    45deg,\n    " + e + " 25%,\n    transparent 25%,\n    transparent 50%,\n    " + e + " 50%,\n    " + e + " 75%,\n    transparent 75%,\n    transparent\n  )",
                    backgroundSize: r + " " + r
                };
            }
            function rO(r) {
                var e = rS().toHexString();
                if (!r || (0, u.Qr)(r)) {
                    return e;
                }
                if (r.string && r.colors) {
                    return rV(r.string, r.colors);
                }
                if (r.string && !r.colors) {
                    return rL(r.string);
                }
                if (r.colors && !r.string) {
                    return rj(r.colors);
                }
                return e;
            }
            function rL(r) {
                var e = 0;
                if (r.length === 0) return e.toString();
                for(var t = 0; t < r.length; t += 1){
                    e = r.charCodeAt(t) + ((e << 5) - e);
                    e = e & e;
                }
                var n = "#";
                for(var o = 0; o < 3; o += 1){
                    var a = (e >> (o * 8)) & 255;
                    n += ("00" + a.toString(16)).substr(-2);
                }
                return n;
            }
            function rV(r, e) {
                var t = 0;
                if (r.length === 0) return e[0];
                for(var n = 0; n < r.length; n += 1){
                    t = r.charCodeAt(n) + ((t << 5) - t);
                    t = t & t;
                }
                t = ((t % e.length) + e.length) % e.length;
                return e[t];
            }
            function rj(r) {
                return r[Math.floor(Math.random() * r.length)];
            }
            function rq(r, e) {
                return function(t) {
                    return t.colorMode === "dark" ? e : r;
                };
            }
            function rZ(r) {
                var e = r.orientation, t = r.vertical, n = r.horizontal;
                if (!e) return {};
                return e === "vertical" ? t : n;
            }
            function r9() {
                r9 = Object.assign ? Object.assign.bind() : function(r) {
                    for(var e = 1; e < arguments.length; e++){
                        var t = arguments[e];
                        for(var n in t){
                            if (Object.prototype.hasOwnProperty.call(t, n)) {
                                r[n] = t[n];
                            }
                        }
                    }
                    return r;
                };
                return r9.apply(this, arguments);
            }
            var rU = function r(e) {
                (0, u.ZK)({
                    condition: true,
                    message: [
                        "[chakra-ui]: createBreakpoints(...) will be deprecated pretty soon",
                        "simply pass the breakpoints as an object. Remove the createBreakpoint(..) call", 
                    ].join("")
                });
                return r9({
                    base: "0em"
                }, e);
            };
            function rG(r, e) {
                for(var t = 0; t < e.length; t++){
                    var n = e[t];
                    n.enumerable = n.enumerable || false;
                    n.configurable = true;
                    if ("value" in n) n.writable = true;
                    Object.defineProperty(r, n.key, n);
                }
            }
            function rJ(r, e, t) {
                if (e) rG(r.prototype, e);
                if (t) rG(r, t);
                Object.defineProperty(r, "prototype", {
                    writable: false
                });
                return r;
            }
            var rK = (function() {
                function r(r) {
                    var e = this;
                    this.map = {};
                    this.called = false;
                    this.assert = function() {
                        if (!e.called) {
                            e.called = true;
                            return;
                        }
                        throw new Error("[anatomy] .part(...) should only be called once. Did you mean to use .extend(...) ?");
                    };
                    this.parts = function() {
                        e.assert();
                        for(var r = arguments.length, t = new Array(r), n = 0; n < r; n++){
                            t[n] = arguments[n];
                        }
                        for(var o = 0, a = t; o < a.length; o++){
                            var i = a[o];
                            e.map[i] = e.toPart(i);
                        }
                        return e;
                    };
                    this.extend = function() {
                        for(var r = arguments.length, t = new Array(r), n = 0; n < r; n++){
                            t[n] = arguments[n];
                        }
                        for(var o = 0, a = t; o < a.length; o++){
                            var i = a[o];
                            if (i in e.map) continue;
                            e.map[i] = e.toPart(i);
                        }
                        return e;
                    };
                    this.toPart = function(r) {
                        var t = [
                            "container",
                            "root"
                        ].includes(r != null ? r : "") ? [
                            e.name
                        ] : [
                            e.name,
                            r
                        ];
                        var n = t.filter(Boolean).join("__");
                        var o = "chakra-" + n;
                        var a = {
                            className: o,
                            selector: "." + o,
                            toString: function e() {
                                return r;
                            }
                        };
                        return a;
                    };
                    this.__type = {};
                }
                rJ(r, [
                    {
                        key: "selectors",
                        get: function r() {
                            var e = (0, u.sq)(Object.entries(this.map).map(function(r) {
                                var e = r[0], t = r[1];
                                return [
                                    e,
                                    t.selector
                                ];
                            }));
                            return e;
                        }
                    },
                    {
                        key: "classNames",
                        get: function r() {
                            var e = (0, u.sq)(Object.entries(this.map).map(function(r) {
                                var e = r[0], t = r[1];
                                return [
                                    e,
                                    t.className
                                ];
                            }));
                            return e;
                        }
                    },
                    {
                        key: "keys",
                        get: function r() {
                            return Object.keys(this.map);
                        }
                    }, 
                ]);
                return r;
            })();
            function rX(r) {
                return new rK(r);
            }
            function rY(r) {
                if ((0, u.Kn)(r) && r.reference) {
                    return r.reference;
                }
                return String(r);
            }
            var rQ = function r(e) {
                for(var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), o = 1; o < t; o++){
                    n[o - 1] = arguments[o];
                }
                return n.map(rY).join(" " + e + " ").replace(/calc/g, "");
            };
            var er = function r() {
                for(var e = arguments.length, t = new Array(e), n = 0; n < e; n++){
                    t[n] = arguments[n];
                }
                return ("calc(" + rQ.apply(void 0, [
                    "+"
                ].concat(t)) + ")");
            };
            var ee = function r() {
                for(var e = arguments.length, t = new Array(e), n = 0; n < e; n++){
                    t[n] = arguments[n];
                }
                return ("calc(" + rQ.apply(void 0, [
                    "-"
                ].concat(t)) + ")");
            };
            var et = function r() {
                for(var e = arguments.length, t = new Array(e), n = 0; n < e; n++){
                    t[n] = arguments[n];
                }
                return ("calc(" + rQ.apply(void 0, [
                    "*"
                ].concat(t)) + ")");
            };
            var en = function r() {
                for(var e = arguments.length, t = new Array(e), n = 0; n < e; n++){
                    t[n] = arguments[n];
                }
                return ("calc(" + rQ.apply(void 0, [
                    "/"
                ].concat(t)) + ")");
            };
            var eo = function r(e) {
                var t = rY(e);
                if (t != null && !Number.isNaN(parseFloat(t))) {
                    return String(t).startsWith("-") ? String(t).slice(1) : "-" + t;
                }
                return et(t, -1);
            };
            var ea = Object.assign(function(r) {
                return {
                    add: function e() {
                        for(var t = arguments.length, n = new Array(t), o = 0; o < t; o++){
                            n[o] = arguments[o];
                        }
                        return ea(er.apply(void 0, [
                            r
                        ].concat(n)));
                    },
                    subtract: function e() {
                        for(var t = arguments.length, n = new Array(t), o = 0; o < t; o++){
                            n[o] = arguments[o];
                        }
                        return ea(ee.apply(void 0, [
                            r
                        ].concat(n)));
                    },
                    multiply: function e() {
                        for(var t = arguments.length, n = new Array(t), o = 0; o < t; o++){
                            n[o] = arguments[o];
                        }
                        return ea(et.apply(void 0, [
                            r
                        ].concat(n)));
                    },
                    divide: function e() {
                        for(var t = arguments.length, n = new Array(t), o = 0; o < t; o++){
                            n[o] = arguments[o];
                        }
                        return ea(en.apply(void 0, [
                            r
                        ].concat(n)));
                    },
                    negate: function e() {
                        return ea(eo(r));
                    },
                    toString: function e() {
                        return r.toString();
                    }
                };
            }, {
                add: er,
                subtract: ee,
                multiply: et,
                divide: en,
                negate: eo
            });
            function ei(r) {
                return !Number.isInteger(parseFloat(r.toString()));
            }
            function el(r, e) {
                if (e === void 0) {
                    e = "-";
                }
                return r.replace(/\s+/g, e);
            }
            function e$(r) {
                var e = el(r.toString());
                if (e.includes("\\.")) return r;
                return ei(r) ? e.replace(".", "\\.") : r;
            }
            function es(r, e) {
                if (e === void 0) {
                    e = "";
                }
                return [
                    e,
                    e$(r)
                ].filter(Boolean).join("-");
            }
            function eu(r, e) {
                return ("var(" + e$(r) + (e ? ", " + e : "") + ")");
            }
            function ec(r, e) {
                if (e === void 0) {
                    e = "";
                }
                return "--" + es(r, e);
            }
            function ed(r, e) {
                var t = ec(r, e == null ? void 0 : e.prefix);
                return {
                    variable: t,
                    reference: eu(t, ef(e == null ? void 0 : e.fallback))
                };
            }
            function ef(r) {
                if (typeof r === "string") return r;
                return r == null ? void 0 : r.reference;
            }
            var ev = rX("accordion").parts("root", "container", "button", "panel").extend("icon");
            var ep = rX("alert").parts("title", "description", "container").extend("icon", "spinner");
            var em = rX("avatar").parts("label", "badge", "container").extend("excessLabel", "group");
            var eh = rX("breadcrumb").parts("link", "item", "container").extend("separator");
            var eb = rX("button").parts();
            var eg = rX("checkbox").parts("control", "icon", "container").extend("label");
            var e_ = rX("progress").parts("track", "filledTrack").extend("label");
            var e3 = rX("drawer").parts("overlay", "dialogContainer", "dialog").extend("header", "closeButton", "body", "footer");
            var e0 = rX("editable").parts("preview", "input", "textarea");
            var ex = rX("form").parts("container", "requiredIndicator", "helperText");
            var ey = rX("formError").parts("text", "icon");
            var ew = rX("input").parts("addon", "field", "element");
            var e2 = rX("list").parts("container", "item", "icon");
            var eS = rX("menu").parts("button", "list", "item").extend("groupTitle", "command", "divider");
            var e4 = rX("modal").parts("overlay", "dialogContainer", "dialog").extend("header", "closeButton", "body", "footer");
            var e1 = rX("numberinput").parts("root", "field", "stepperGroup", "stepper");
            var e6 = rX("pininput").parts("field");
            var ek = rX("popover").parts("content", "header", "body", "footer").extend("popper", "arrow", "closeButton");
            var e5 = rX("progress").parts("label", "filledTrack", "track");
            var e7 = rX("radio").parts("container", "control", "label");
            var eC = rX("select").parts("field", "icon");
            var eA = rX("slider").parts("container", "track", "thumb", "filledTrack");
            var ez = rX("stat").parts("container", "label", "helpText", "number", "icon");
            var eE = rX("switch").parts("container", "track", "thumb");
            var e8 = rX("table").parts("table", "thead", "tbody", "tr", "th", "td", "tfoot", "caption");
            var eF = rX("tabs").parts("root", "tab", "tablist", "tabpanel", "tabpanels", "indicator");
            var eB = rX("tag").parts("container", "label", "closeButton");
            var eP = {
                letterSpacings: {
                    tighter: "-0.05em",
                    tight: "-0.025em",
                    normal: "0",
                    wide: "0.025em",
                    wider: "0.05em",
                    widest: "0.1em"
                },
                lineHeights: {
                    normal: "normal",
                    none: 1,
                    shorter: 1.25,
                    short: 1.375,
                    base: 1.5,
                    tall: 1.625,
                    taller: "2",
                    3: ".75rem",
                    4: "1rem",
                    5: "1.25rem",
                    6: "1.5rem",
                    7: "1.75rem",
                    8: "2rem",
                    9: "2.25rem",
                    10: "2.5rem"
                },
                fontWeights: {
                    hairline: 100,
                    thin: 200,
                    light: 300,
                    normal: 400,
                    medium: 500,
                    semibold: 600,
                    bold: 700,
                    extrabold: 800,
                    black: 900
                },
                fonts: {
                    heading: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
                    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
                    mono: 'SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace'
                },
                fontSizes: {
                    xs: "0.75rem",
                    sm: "0.875rem",
                    md: "1rem",
                    lg: "1.125rem",
                    xl: "1.25rem",
                    "2xl": "1.5rem",
                    "3xl": "1.875rem",
                    "4xl": "2.25rem",
                    "5xl": "3rem",
                    "6xl": "3.75rem",
                    "7xl": "4.5rem",
                    "8xl": "6rem",
                    "9xl": "8rem"
                }
            };
            var eD = t(8554);
            var eR = t.n(eD);
            var eH = {
                borderTopWidth: "1px",
                borderColor: "inherit",
                _last: {
                    borderBottomWidth: "1px"
                }
            };
            var eW = {
                transitionProperty: "common",
                transitionDuration: "normal",
                fontSize: "1rem",
                _focusVisible: {
                    boxShadow: "outline"
                },
                _hover: {
                    bg: "blackAlpha.50"
                },
                _disabled: {
                    opacity: 0.4,
                    cursor: "not-allowed"
                },
                px: 4,
                py: 2
            };
            var eI = {
                pt: 2,
                px: 4,
                pb: 5
            };
            var eT = {
                fontSize: "1.25em"
            };
            var eN = {
                root: {},
                container: eH,
                button: eW,
                panel: eI,
                icon: eT
            };
            var eM = {
                parts: ev.keys,
                baseStyle: eN
            };
            var eO = {
                container: {
                    px: 4,
                    py: 3
                },
                title: {
                    fontWeight: "bold",
                    lineHeight: 6,
                    marginEnd: 2
                },
                description: {
                    lineHeight: 6
                },
                icon: {
                    flexShrink: 0,
                    marginEnd: 3,
                    w: 5,
                    h: 6
                },
                spinner: {
                    flexShrink: 0,
                    marginEnd: 3,
                    w: 5,
                    h: 5
                }
            };
            function eL(r) {
                var e = r.theme, t = r.colorScheme;
                var n = rE(e, t + ".100", t);
                var o = rP(t + ".200", 0.16)(e);
                return rq(n, o)(r);
            }
            var eV = function r(e) {
                var t = e.colorScheme;
                return {
                    container: {
                        bg: eL(e)
                    },
                    icon: {
                        color: rq(t + ".500", t + ".200")(e)
                    },
                    spinner: {
                        color: rq(t + ".500", t + ".200")(e)
                    }
                };
            };
            var ej = function r(e) {
                var t = e.colorScheme;
                return {
                    container: {
                        paddingStart: 3,
                        borderStartWidth: "4px",
                        borderStartColor: rq(t + ".500", t + ".200")(e),
                        bg: eL(e)
                    },
                    icon: {
                        color: rq(t + ".500", t + ".200")(e)
                    },
                    spinner: {
                        color: rq(t + ".500", t + ".200")(e)
                    }
                };
            };
            var eq = function r(e) {
                var t = e.colorScheme;
                return {
                    container: {
                        pt: 2,
                        borderTopWidth: "4px",
                        borderTopColor: rq(t + ".500", t + ".200")(e),
                        bg: eL(e)
                    },
                    icon: {
                        color: rq(t + ".500", t + ".200")(e)
                    },
                    spinner: {
                        color: rq(t + ".500", t + ".200")(e)
                    }
                };
            };
            var eZ = function r(e) {
                var t = e.colorScheme;
                return {
                    container: {
                        bg: rq(t + ".500", t + ".200")(e),
                        color: rq("white", "gray.900")(e)
                    }
                };
            };
            var e9 = {
                subtle: eV,
                "left-accent": ej,
                "top-accent": eq,
                solid: eZ
            };
            var eU = {
                variant: "subtle",
                colorScheme: "blue"
            };
            var eG = {
                parts: ep.keys,
                baseStyle: eO,
                variants: e9,
                defaultProps: eU
            };
            var eJ = function r(e) {
                return {
                    transform: "translate(25%, 25%)",
                    borderRadius: "full",
                    border: "0.2em solid",
                    borderColor: rq("white", "gray.800")(e)
                };
            };
            var eK = function r(e) {
                return {
                    bg: rq("gray.200", "whiteAlpha.400")(e)
                };
            };
            var eX = function r(e) {
                var t = e.name, n = e.theme;
                var o = t ? rO({
                    string: t
                }) : "gray.400";
                var a = rF(o)(n);
                var i = "white";
                if (!a) i = "gray.800";
                var l = rq("white", "gray.800")(e);
                return {
                    bg: o,
                    color: i,
                    borderColor: l,
                    verticalAlign: "top"
                };
            };
            var eY = function r(e) {
                return {
                    badge: eJ(e),
                    excessLabel: eK(e),
                    container: eX(e)
                };
            };
            function eQ(r) {
                var e = r !== "100%" ? G[r] : undefined;
                return {
                    container: {
                        width: r,
                        height: r,
                        fontSize: "calc(" + (e != null ? e : r) + " / 2.5)"
                    },
                    excessLabel: {
                        width: r,
                        height: r
                    },
                    label: {
                        fontSize: "calc(" + (e != null ? e : r) + " / 2.5)",
                        lineHeight: r !== "100%" ? e != null ? e : r : undefined
                    }
                };
            }
            var tr = {
                "2xs": eQ(4),
                xs: eQ(6),
                sm: eQ(8),
                md: eQ(12),
                lg: eQ(16),
                xl: eQ(24),
                "2xl": eQ(32),
                full: eQ("100%")
            };
            var te = {
                size: "md"
            };
            var tt = {
                parts: em.keys,
                baseStyle: eY,
                sizes: tr,
                defaultProps: te
            };
            var tn = {
                px: 1,
                textTransform: "uppercase",
                fontSize: "xs",
                borderRadius: "sm",
                fontWeight: "bold"
            };
            var to = function r(e) {
                var t = e.colorScheme, n = e.theme;
                var o = rP(t + ".500", 0.6)(n);
                return {
                    bg: rq(t + ".500", o)(e),
                    color: rq("white", "whiteAlpha.800")(e)
                };
            };
            var ta = function r(e) {
                var t = e.colorScheme, n = e.theme;
                var o = rP(t + ".200", 0.16)(n);
                return {
                    bg: rq(t + ".100", o)(e),
                    color: rq(t + ".800", t + ".200")(e)
                };
            };
            var ti = function r(e) {
                var t = e.colorScheme, n = e.theme;
                var o = rP(t + ".200", 0.8)(n);
                var a = rE(n, t + ".500");
                var i = rq(a, o)(e);
                return {
                    color: i,
                    boxShadow: "inset 0 0 0px 1px " + i
                };
            };
            var tl = {
                solid: to,
                subtle: ta,
                outline: ti
            };
            var t$ = {
                variant: "subtle",
                colorScheme: "gray"
            };
            var ts = {
                baseStyle: tn,
                variants: tl,
                defaultProps: t$
            };
            var tu = {
                transitionProperty: "common",
                transitionDuration: "fast",
                transitionTimingFunction: "ease-out",
                cursor: "pointer",
                textDecoration: "none",
                outline: "none",
                color: "inherit",
                _hover: {
                    textDecoration: "underline"
                },
                _focusVisible: {
                    boxShadow: "outline"
                }
            };
            var tc = {
                link: tu
            };
            var td = {
                parts: eh.keys,
                baseStyle: tc
            };
            var tf = {
                lineHeight: "1.2",
                borderRadius: "md",
                fontWeight: "semibold",
                transitionProperty: "common",
                transitionDuration: "normal",
                _focusVisible: {
                    boxShadow: "outline"
                },
                _disabled: {
                    opacity: 0.4,
                    cursor: "not-allowed",
                    boxShadow: "none"
                },
                _hover: {
                    _disabled: {
                        bg: "initial"
                    }
                }
            };
            var tv = function r(e) {
                var t = e.colorScheme, n = e.theme;
                if (t === "gray") {
                    return {
                        color: rq("inherit", "whiteAlpha.900")(e),
                        _hover: {
                            bg: rq("gray.100", "whiteAlpha.200")(e)
                        },
                        _active: {
                            bg: rq("gray.200", "whiteAlpha.300")(e)
                        }
                    };
                }
                var o = rP(t + ".200", 0.12)(n);
                var a = rP(t + ".200", 0.24)(n);
                return {
                    color: rq(t + ".600", t + ".200")(e),
                    bg: "transparent",
                    _hover: {
                        bg: rq(t + ".50", o)(e)
                    },
                    _active: {
                        bg: rq(t + ".100", a)(e)
                    }
                };
            };
            var tp = function r(e) {
                var t = e.colorScheme;
                var n = rq("gray.200", "whiteAlpha.300")(e);
                return q({
                    border: "1px solid",
                    borderColor: t === "gray" ? n : "currentColor",
                    ".chakra-button__group[data-attached] > &:not(:last-of-type)": {
                        marginEnd: "-1px"
                    }
                }, tv(e));
            };
            var tm = {
                yellow: {
                    bg: "yellow.400",
                    color: "black",
                    hoverBg: "yellow.500",
                    activeBg: "yellow.600"
                },
                cyan: {
                    bg: "cyan.400",
                    color: "black",
                    hoverBg: "cyan.500",
                    activeBg: "cyan.600"
                }
            };
            var th = function r(e) {
                var t;
                var n = e.colorScheme;
                if (n === "gray") {
                    var o = rq("gray.100", "whiteAlpha.200")(e);
                    return {
                        bg: o,
                        _hover: {
                            bg: rq("gray.200", "whiteAlpha.300")(e),
                            _disabled: {
                                bg: o
                            }
                        },
                        _active: {
                            bg: rq("gray.300", "whiteAlpha.400")(e)
                        }
                    };
                }
                var a = (t = tm[n]) != null ? t : {}, i = a.bg, l = i === void 0 ? n + ".500" : i, $ = a.color, s = $ === void 0 ? "white" : $, u = a.hoverBg, c = u === void 0 ? n + ".600" : u, d = a.activeBg, f = d === void 0 ? n + ".700" : d;
                var v = rq(l, n + ".200")(e);
                return {
                    bg: v,
                    color: rq(s, "gray.800")(e),
                    _hover: {
                        bg: rq(c, n + ".300")(e),
                        _disabled: {
                            bg: v
                        }
                    },
                    _active: {
                        bg: rq(f, n + ".400")(e)
                    }
                };
            };
            var tb = function r(e) {
                var t = e.colorScheme;
                return {
                    padding: 0,
                    height: "auto",
                    lineHeight: "normal",
                    verticalAlign: "baseline",
                    color: rq(t + ".500", t + ".200")(e),
                    _hover: {
                        textDecoration: "underline",
                        _disabled: {
                            textDecoration: "none"
                        }
                    },
                    _active: {
                        color: rq(t + ".700", t + ".500")(e)
                    }
                };
            };
            var tg = {
                bg: "none",
                color: "inherit",
                display: "inline",
                lineHeight: "inherit",
                m: 0,
                p: 0
            };
            var t_ = {
                ghost: tv,
                outline: tp,
                solid: th,
                link: tb,
                unstyled: tg
            };
            var t3 = {
                lg: {
                    h: 12,
                    minW: 12,
                    fontSize: "lg",
                    px: 6
                },
                md: {
                    h: 10,
                    minW: 10,
                    fontSize: "md",
                    px: 4
                },
                sm: {
                    h: 8,
                    minW: 8,
                    fontSize: "sm",
                    px: 3
                },
                xs: {
                    h: 6,
                    minW: 6,
                    fontSize: "xs",
                    px: 2
                }
            };
            var t0 = {
                variant: "solid",
                size: "md",
                colorScheme: "gray"
            };
            var tx = {
                baseStyle: tf,
                variants: t_,
                sizes: t3,
                defaultProps: t0
            };
            var ty = function r(e) {
                var t = e.colorScheme;
                return {
                    w: "100%",
                    transitionProperty: "box-shadow",
                    transitionDuration: "normal",
                    border: "2px solid",
                    borderRadius: "sm",
                    borderColor: "inherit",
                    color: "white",
                    _checked: {
                        bg: rq(t + ".500", t + ".200")(e),
                        borderColor: rq(t + ".500", t + ".200")(e),
                        color: rq("white", "gray.900")(e),
                        _hover: {
                            bg: rq(t + ".600", t + ".300")(e),
                            borderColor: rq(t + ".600", t + ".300")(e)
                        },
                        _disabled: {
                            borderColor: rq("gray.200", "transparent")(e),
                            bg: rq("gray.200", "whiteAlpha.300")(e),
                            color: rq("gray.500", "whiteAlpha.500")(e)
                        }
                    },
                    _indeterminate: {
                        bg: rq(t + ".500", t + ".200")(e),
                        borderColor: rq(t + ".500", t + ".200")(e),
                        color: rq("white", "gray.900")(e)
                    },
                    _disabled: {
                        bg: rq("gray.100", "whiteAlpha.100")(e),
                        borderColor: rq("gray.100", "transparent")(e)
                    },
                    _focusVisible: {
                        boxShadow: "outline"
                    },
                    _invalid: {
                        borderColor: rq("red.500", "red.300")(e)
                    }
                };
            };
            var tw = {
                _disabled: {
                    cursor: "not-allowed"
                }
            };
            var t2 = {
                userSelect: "none",
                _disabled: {
                    opacity: 0.4
                }
            };
            var tS = {
                transitionProperty: "transform",
                transitionDuration: "normal"
            };
            var t4 = function r(e) {
                return {
                    icon: tS,
                    container: tw,
                    control: ty(e),
                    label: t2
                };
            };
            var t1 = {
                sm: {
                    control: {
                        h: 3,
                        w: 3
                    },
                    label: {
                        fontSize: "sm"
                    },
                    icon: {
                        fontSize: "0.45rem"
                    }
                },
                md: {
                    control: {
                        w: 4,
                        h: 4
                    },
                    label: {
                        fontSize: "md"
                    },
                    icon: {
                        fontSize: "0.625rem"
                    }
                },
                lg: {
                    control: {
                        w: 5,
                        h: 5
                    },
                    label: {
                        fontSize: "lg"
                    },
                    icon: {
                        fontSize: "0.625rem"
                    }
                }
            };
            var t6 = {
                size: "md",
                colorScheme: "blue"
            };
            var tk = {
                parts: eg.keys,
                baseStyle: t4,
                sizes: t1,
                defaultProps: t6
            };
            var t5, t7, tC;
            var tA = ed("close-button-size");
            var tz = function r(e) {
                var t = rq("blackAlpha.100", "whiteAlpha.100")(e);
                var n = rq("blackAlpha.200", "whiteAlpha.200")(e);
                return {
                    w: [
                        tA.reference
                    ],
                    h: [
                        tA.reference
                    ],
                    borderRadius: "md",
                    transitionProperty: "common",
                    transitionDuration: "normal",
                    _disabled: {
                        opacity: 0.4,
                        cursor: "not-allowed",
                        boxShadow: "none"
                    },
                    _hover: {
                        bg: t
                    },
                    _active: {
                        bg: n
                    },
                    _focusVisible: {
                        boxShadow: "outline"
                    }
                };
            };
            var tE = {
                lg: ((t5 = {}), (t5[tA.variable] = "40px"), (t5.fontSize = "16px"), t5),
                md: ((t7 = {}), (t7[tA.variable] = "32px"), (t7.fontSize = "12px"), t7),
                sm: ((tC = {}), (tC[tA.variable] = "24px"), (tC.fontSize = "10px"), tC)
            };
            var t8 = {
                size: "md"
            };
            var tF = {
                baseStyle: tz,
                sizes: tE,
                defaultProps: t8
            };
            var tB = ts.variants, tP = ts.defaultProps;
            var tD = {
                fontFamily: "mono",
                fontSize: "sm",
                px: "0.2em",
                borderRadius: "sm"
            };
            var tR = {
                baseStyle: tD,
                variants: tB,
                defaultProps: tP
            };
            var tH = {
                w: "100%",
                mx: "auto",
                maxW: "60ch",
                px: "1rem"
            };
            var tW = {
                baseStyle: tH
            };
            var tI = {
                opacity: 0.6,
                borderColor: "inherit"
            };
            var tT = {
                borderStyle: "solid"
            };
            var tN = {
                borderStyle: "dashed"
            };
            var tM = {
                solid: tT,
                dashed: tN
            };
            var tO = {
                variant: "solid"
            };
            var tL = {
                baseStyle: tI,
                variants: tM,
                defaultProps: tO
            };
            function tV(r) {
                if (r === "full") {
                    return {
                        dialog: {
                            maxW: "100vw",
                            h: "100vh"
                        }
                    };
                }
                return {
                    dialog: {
                        maxW: r
                    }
                };
            }
            var tj = {
                bg: "blackAlpha.600",
                zIndex: "overlay"
            };
            var tq = {
                display: "flex",
                zIndex: "modal",
                justifyContent: "center"
            };
            var tZ = function r(e) {
                var t = e.isFullHeight;
                return q({}, t && {
                    height: "100vh"
                }, {
                    zIndex: "modal",
                    maxH: "100vh",
                    bg: rq("white", "gray.700")(e),
                    color: "inherit",
                    boxShadow: rq("lg", "dark-lg")(e)
                });
            };
            var t9 = {
                px: 6,
                py: 4,
                fontSize: "xl",
                fontWeight: "semibold"
            };
            var tU = {
                position: "absolute",
                top: 2,
                insetEnd: 3
            };
            var tG = {
                px: 6,
                py: 2,
                flex: 1,
                overflow: "auto"
            };
            var tJ = {
                px: 6,
                py: 4
            };
            var tK = function r(e) {
                return {
                    overlay: tj,
                    dialogContainer: tq,
                    dialog: tZ(e),
                    header: t9,
                    closeButton: tU,
                    body: tG,
                    footer: tJ
                };
            };
            var tX = {
                xs: tV("xs"),
                sm: tV("md"),
                md: tV("lg"),
                lg: tV("2xl"),
                xl: tV("4xl"),
                full: tV("full")
            };
            var tY = {
                size: "xs"
            };
            var tQ = {
                parts: e3.keys,
                baseStyle: tK,
                sizes: tX,
                defaultProps: tY
            };
            var nr = {
                borderRadius: "md",
                py: "3px",
                transitionProperty: "common",
                transitionDuration: "normal"
            };
            var ne = {
                borderRadius: "md",
                py: "3px",
                transitionProperty: "common",
                transitionDuration: "normal",
                width: "full",
                _focusVisible: {
                    boxShadow: "outline"
                },
                _placeholder: {
                    opacity: 0.6
                }
            };
            var nt = {
                borderRadius: "md",
                py: "3px",
                transitionProperty: "common",
                transitionDuration: "normal",
                width: "full",
                _focusVisible: {
                    boxShadow: "outline"
                },
                _placeholder: {
                    opacity: 0.6
                }
            };
            var nn = {
                preview: nr,
                input: ne,
                textarea: nt
            };
            var no = {
                parts: e0.keys,
                baseStyle: nn
            };
            var na = function r(e) {
                return {
                    marginStart: 1,
                    color: rq("red.500", "red.300")(e)
                };
            };
            var ni = function r(e) {
                return {
                    mt: 2,
                    color: rq("gray.500", "whiteAlpha.600")(e),
                    lineHeight: "normal",
                    fontSize: "sm"
                };
            };
            var nl = function r(e) {
                return {
                    container: {
                        width: "100%",
                        position: "relative"
                    },
                    requiredIndicator: na(e),
                    helperText: ni(e)
                };
            };
            var n$ = {
                parts: ex.keys,
                baseStyle: nl
            };
            var ns = function r(e) {
                return {
                    color: rq("red.500", "red.300")(e),
                    mt: 2,
                    fontSize: "sm",
                    lineHeight: "normal"
                };
            };
            var nu = function r(e) {
                return {
                    marginEnd: "0.5em",
                    color: rq("red.500", "red.300")(e)
                };
            };
            var nc = function r(e) {
                return {
                    text: ns(e),
                    icon: nu(e)
                };
            };
            var nd = {
                parts: ey.keys,
                baseStyle: nc
            };
            var nf = {
                fontSize: "md",
                marginEnd: 3,
                mb: 2,
                fontWeight: "medium",
                transitionProperty: "common",
                transitionDuration: "normal",
                opacity: 1,
                _disabled: {
                    opacity: 0.4
                }
            };
            var nv = {
                baseStyle: nf
            };
            var np = {
                fontFamily: "heading",
                fontWeight: "bold"
            };
            var nm = {
                "4xl": {
                    fontSize: [
                        "6xl",
                        null,
                        "7xl"
                    ],
                    lineHeight: 1
                },
                "3xl": {
                    fontSize: [
                        "5xl",
                        null,
                        "6xl"
                    ],
                    lineHeight: 1
                },
                "2xl": {
                    fontSize: [
                        "4xl",
                        null,
                        "5xl"
                    ],
                    lineHeight: [
                        1.2,
                        null,
                        1
                    ]
                },
                xl: {
                    fontSize: [
                        "3xl",
                        null,
                        "4xl"
                    ],
                    lineHeight: [
                        1.33,
                        null,
                        1.2
                    ]
                },
                lg: {
                    fontSize: [
                        "2xl",
                        null,
                        "3xl"
                    ],
                    lineHeight: [
                        1.33,
                        null,
                        1.2
                    ]
                },
                md: {
                    fontSize: "xl",
                    lineHeight: 1.2
                },
                sm: {
                    fontSize: "md",
                    lineHeight: 1.2
                },
                xs: {
                    fontSize: "sm",
                    lineHeight: 1.2
                }
            };
            var nh = {
                size: "xl"
            };
            var nb = {
                baseStyle: np,
                sizes: nm,
                defaultProps: nh
            };
            var ng = {
                field: {
                    width: "100%",
                    minWidth: 0,
                    outline: 0,
                    position: "relative",
                    appearance: "none",
                    transitionProperty: "common",
                    transitionDuration: "normal"
                }
            };
            var n_ = {
                lg: {
                    fontSize: "lg",
                    px: 4,
                    h: 12,
                    borderRadius: "md"
                },
                md: {
                    fontSize: "md",
                    px: 4,
                    h: 10,
                    borderRadius: "md"
                },
                sm: {
                    fontSize: "sm",
                    px: 3,
                    h: 8,
                    borderRadius: "sm"
                },
                xs: {
                    fontSize: "xs",
                    px: 2,
                    h: 6,
                    borderRadius: "sm"
                }
            };
            var n3 = {
                lg: {
                    field: n_.lg,
                    addon: n_.lg
                },
                md: {
                    field: n_.md,
                    addon: n_.md
                },
                sm: {
                    field: n_.sm,
                    addon: n_.sm
                },
                xs: {
                    field: n_.xs,
                    addon: n_.xs
                }
            };
            function n0(r) {
                var e = r.focusBorderColor, t = r.errorBorderColor;
                return {
                    focusBorderColor: e || rq("blue.500", "blue.300")(r),
                    errorBorderColor: t || rq("red.500", "red.300")(r)
                };
            }
            var nx = function r(e) {
                var t = e.theme;
                var n = n0(e), o = n.focusBorderColor, a = n.errorBorderColor;
                return {
                    field: {
                        border: "1px solid",
                        borderColor: "inherit",
                        bg: "inherit",
                        _hover: {
                            borderColor: rq("gray.300", "whiteAlpha.400")(e)
                        },
                        _readOnly: {
                            boxShadow: "none !important",
                            userSelect: "all"
                        },
                        _disabled: {
                            opacity: 0.4,
                            cursor: "not-allowed"
                        },
                        _invalid: {
                            borderColor: rE(t, a),
                            boxShadow: "0 0 0 1px " + rE(t, a)
                        },
                        _focusVisible: {
                            zIndex: 1,
                            borderColor: rE(t, o),
                            boxShadow: "0 0 0 1px " + rE(t, o)
                        }
                    },
                    addon: {
                        border: "1px solid",
                        borderColor: rq("inherit", "whiteAlpha.50")(e),
                        bg: rq("gray.100", "whiteAlpha.300")(e)
                    }
                };
            };
            var ny = function r(e) {
                var t = e.theme;
                var n = n0(e), o = n.focusBorderColor, a = n.errorBorderColor;
                return {
                    field: {
                        border: "2px solid",
                        borderColor: "transparent",
                        bg: rq("gray.100", "whiteAlpha.50")(e),
                        _hover: {
                            bg: rq("gray.200", "whiteAlpha.100")(e)
                        },
                        _readOnly: {
                            boxShadow: "none !important",
                            userSelect: "all"
                        },
                        _disabled: {
                            opacity: 0.4,
                            cursor: "not-allowed"
                        },
                        _invalid: {
                            borderColor: rE(t, a)
                        },
                        _focusVisible: {
                            bg: "transparent",
                            borderColor: rE(t, o)
                        }
                    },
                    addon: {
                        border: "2px solid",
                        borderColor: "transparent",
                        bg: rq("gray.100", "whiteAlpha.50")(e)
                    }
                };
            };
            var nw = function r(e) {
                var t = e.theme;
                var n = n0(e), o = n.focusBorderColor, a = n.errorBorderColor;
                return {
                    field: {
                        borderBottom: "1px solid",
                        borderColor: "inherit",
                        borderRadius: 0,
                        px: 0,
                        bg: "transparent",
                        _readOnly: {
                            boxShadow: "none !important",
                            userSelect: "all"
                        },
                        _invalid: {
                            borderColor: rE(t, a),
                            boxShadow: "0px 1px 0px 0px " + rE(t, a)
                        },
                        _focusVisible: {
                            borderColor: rE(t, o),
                            boxShadow: "0px 1px 0px 0px " + rE(t, o)
                        }
                    },
                    addon: {
                        borderBottom: "2px solid",
                        borderColor: "inherit",
                        borderRadius: 0,
                        px: 0,
                        bg: "transparent"
                    }
                };
            };
            var n2 = {
                field: {
                    bg: "transparent",
                    px: 0,
                    height: "auto"
                },
                addon: {
                    bg: "transparent",
                    px: 0,
                    height: "auto"
                }
            };
            var nS = {
                outline: nx,
                filled: ny,
                flushed: nw,
                unstyled: n2
            };
            var n4 = {
                size: "md",
                variant: "outline"
            };
            var n1 = {
                parts: ew.keys,
                baseStyle: ng,
                sizes: n3,
                variants: nS,
                defaultProps: n4
            };
            var n6 = function r(e) {
                return {
                    bg: rq("gray.100", "whiteAlpha")(e),
                    borderRadius: "md",
                    borderWidth: "1px",
                    borderBottomWidth: "3px",
                    fontSize: "0.8em",
                    fontWeight: "bold",
                    lineHeight: "normal",
                    px: "0.4em",
                    whiteSpace: "nowrap"
                };
            };
            var nk = {
                baseStyle: n6
            };
            var n5 = {
                transitionProperty: "common",
                transitionDuration: "fast",
                transitionTimingFunction: "ease-out",
                cursor: "pointer",
                textDecoration: "none",
                outline: "none",
                color: "inherit",
                _hover: {
                    textDecoration: "underline"
                },
                _focusVisible: {
                    boxShadow: "outline"
                }
            };
            var n7 = {
                baseStyle: n5
            };
            var nC = {
                marginEnd: "0.5rem",
                display: "inline",
                verticalAlign: "text-bottom"
            };
            var nA = {
                container: {},
                item: {},
                icon: nC
            };
            var nz = {
                parts: e2.keys,
                baseStyle: nA
            };
            var nE = function r(e) {
                return {
                    bg: rq("#fff", "gray.700")(e),
                    boxShadow: rq("sm", "dark-lg")(e),
                    color: "inherit",
                    minW: "3xs",
                    py: "2",
                    zIndex: 1,
                    borderRadius: "md",
                    borderWidth: "1px"
                };
            };
            var n8 = function r(e) {
                return {
                    py: "0.4rem",
                    px: "0.8rem",
                    transitionProperty: "background",
                    transitionDuration: "ultra-fast",
                    transitionTimingFunction: "ease-in",
                    _focus: {
                        bg: rq("gray.100", "whiteAlpha.100")(e)
                    },
                    _active: {
                        bg: rq("gray.200", "whiteAlpha.200")(e)
                    },
                    _expanded: {
                        bg: rq("gray.100", "whiteAlpha.100")(e)
                    },
                    _disabled: {
                        opacity: 0.4,
                        cursor: "not-allowed"
                    }
                };
            };
            var nF = {
                mx: 4,
                my: 2,
                fontWeight: "semibold",
                fontSize: "sm"
            };
            var nB = {
                opacity: 0.6
            };
            var nP = {
                border: 0,
                borderBottom: "1px solid",
                borderColor: "inherit",
                my: "0.5rem",
                opacity: 0.6
            };
            var nD = {
                transitionProperty: "common",
                transitionDuration: "normal"
            };
            var nR = function r(e) {
                return {
                    button: nD,
                    list: nE(e),
                    item: n8(e),
                    groupTitle: nF,
                    command: nB,
                    divider: nP
                };
            };
            var nH = {
                parts: eS.keys,
                baseStyle: nR
            };
            var nW = {
                bg: "blackAlpha.600",
                zIndex: "modal"
            };
            var nI = function r(e) {
                var t = e.isCentered, n = e.scrollBehavior;
                return {
                    display: "flex",
                    zIndex: "modal",
                    justifyContent: "center",
                    alignItems: t ? "center" : "flex-start",
                    overflow: n === "inside" ? "hidden" : "auto"
                };
            };
            var nT = function r(e) {
                var t = e.scrollBehavior;
                return {
                    borderRadius: "md",
                    bg: rq("white", "gray.700")(e),
                    color: "inherit",
                    my: "3.75rem",
                    zIndex: "modal",
                    maxH: t === "inside" ? "calc(100% - 7.5rem)" : undefined,
                    boxShadow: rq("lg", "dark-lg")(e)
                };
            };
            var nN = {
                px: 6,
                py: 4,
                fontSize: "xl",
                fontWeight: "semibold"
            };
            var nM = {
                position: "absolute",
                top: 2,
                insetEnd: 3
            };
            var nO = function r(e) {
                var t = e.scrollBehavior;
                return {
                    px: 6,
                    py: 2,
                    flex: 1,
                    overflow: t === "inside" ? "auto" : undefined
                };
            };
            var nL = {
                px: 6,
                py: 4
            };
            var nV = function r(e) {
                return {
                    overlay: nW,
                    dialogContainer: nI(e),
                    dialog: nT(e),
                    header: nN,
                    closeButton: nM,
                    body: nO(e),
                    footer: nL
                };
            };
            function nj(r) {
                if (r === "full") {
                    return {
                        dialog: {
                            maxW: "100vw",
                            minH: "100vh",
                            "@supports(min-height: -webkit-fill-available)": {
                                minH: "-webkit-fill-available"
                            },
                            my: 0
                        }
                    };
                }
                return {
                    dialog: {
                        maxW: r
                    }
                };
            }
            var nq = {
                xs: nj("xs"),
                sm: nj("sm"),
                md: nj("md"),
                lg: nj("lg"),
                xl: nj("xl"),
                "2xl": nj("2xl"),
                "3xl": nj("3xl"),
                "4xl": nj("4xl"),
                "5xl": nj("5xl"),
                "6xl": nj("6xl"),
                full: nj("full")
            };
            var nZ = {
                size: "md"
            };
            var n9 = {
                parts: e4.keys,
                baseStyle: nV,
                sizes: nq,
                defaultProps: nZ
            };
            var nU, nG, nJ;
            var nK = n1.variants, nX = n1.defaultProps;
            var nY = ed("number-input-stepper-width");
            var nQ = ed("number-input-input-padding");
            var or = ea(nY).add("0.5rem").toString();
            var oe = ((nU = {}), (nU[nY.variable] = "24px"), (nU[nQ.variable] = or), nU);
            var ot = (nG = (nJ = n1.baseStyle) == null ? void 0 : nJ.field) != null ? nG : {};
            var on = {
                width: [
                    nY.reference
                ]
            };
            var oo = function r(e) {
                return {
                    borderStart: "1px solid",
                    borderStartColor: rq("inherit", "whiteAlpha.300")(e),
                    color: rq("inherit", "whiteAlpha.800")(e),
                    _active: {
                        bg: rq("gray.200", "whiteAlpha.300")(e)
                    },
                    _disabled: {
                        opacity: 0.4,
                        cursor: "not-allowed"
                    }
                };
            };
            var oa = function r(e) {
                return {
                    root: oe,
                    field: ot,
                    stepperGroup: on,
                    stepper: oo(e)
                };
            };
            function oi(r) {
                var e, t;
                var n = n1.sizes[r];
                var o = {
                    lg: "md",
                    md: "md",
                    sm: "sm",
                    xs: "sm"
                };
                var a = (e = (t = n.field) == null ? void 0 : t.fontSize) != null ? e : "md";
                var i = eP.fontSizes[a];
                return {
                    field: q({}, n.field, {
                        paddingInlineEnd: nQ.reference,
                        verticalAlign: "top"
                    }),
                    stepper: {
                        fontSize: ea(i).multiply(0.75).toString(),
                        _first: {
                            borderTopEndRadius: o[r]
                        },
                        _last: {
                            borderBottomEndRadius: o[r],
                            mt: "-1px",
                            borderTopWidth: 1
                        }
                    }
                };
            }
            var ol = {
                xs: oi("xs"),
                sm: oi("sm"),
                md: oi("md"),
                lg: oi("lg")
            };
            var o$ = {
                parts: e1.keys,
                baseStyle: oa,
                sizes: ol,
                variants: nK,
                defaultProps: nX
            };
            var os;
            var ou = q({}, n1.baseStyle.field, {
                textAlign: "center"
            });
            var oc = {
                lg: {
                    fontSize: "lg",
                    w: 12,
                    h: 12,
                    borderRadius: "md"
                },
                md: {
                    fontSize: "md",
                    w: 10,
                    h: 10,
                    borderRadius: "md"
                },
                sm: {
                    fontSize: "sm",
                    w: 8,
                    h: 8,
                    borderRadius: "sm"
                },
                xs: {
                    fontSize: "xs",
                    w: 6,
                    h: 6,
                    borderRadius: "sm"
                }
            };
            var od = {
                outline: function r(e) {
                    var t;
                    return (t = n1.variants.outline(e).field) != null ? t : {};
                },
                flushed: function r(e) {
                    var t;
                    return (t = n1.variants.flushed(e).field) != null ? t : {};
                },
                filled: function r(e) {
                    var t;
                    return (t = n1.variants.filled(e).field) != null ? t : {};
                },
                unstyled: (os = n1.variants.unstyled.field) != null ? os : {}
            };
            var of = n1.defaultProps;
            var ov = {
                baseStyle: ou,
                sizes: oc,
                variants: od,
                defaultProps: of
            };
            var op = ed("popper-bg");
            var om = ed("popper-arrow-bg");
            var oh = ed("popper-arrow-shadow-color");
            var ob = {
                zIndex: 10
            };
            var og = function r(e) {
                var t;
                var n = rq("white", "gray.700")(e);
                var o = rq("gray.200", "whiteAlpha.300")(e);
                return ((t = {}), (t[op.variable] = "colors." + n), (t.bg = op.reference), (t[om.variable] = op.reference), (t[oh.variable] = "colors." + o), (t.width = "xs"), (t.border = "1px solid"), (t.borderColor = "inherit"), (t.borderRadius = "md"), (t.boxShadow = "sm"), (t.zIndex = "inherit"), (t._focusVisible = {
                    outline: 0,
                    boxShadow: "outline"
                }), t);
            };
            var o_ = {
                px: 3,
                py: 2,
                borderBottomWidth: "1px"
            };
            var o3 = {
                px: 3,
                py: 2
            };
            var o0 = {
                px: 3,
                py: 2,
                borderTopWidth: "1px"
            };
            var ox = {
                position: "absolute",
                borderRadius: "md",
                top: 1,
                insetEnd: 2,
                padding: 2
            };
            var oy = function r(e) {
                return {
                    popper: ob,
                    content: og(e),
                    header: o_,
                    body: o3,
                    footer: o0,
                    arrow: {},
                    closeButton: ox
                };
            };
            var ow = {
                parts: ek.keys,
                baseStyle: oy
            };
            function o2(r) {
                var e = r.colorScheme, t = r.theme, n = r.isIndeterminate, o = r.hasStripe;
                var a = rq(rM(), rM("1rem", "rgba(0,0,0,0.1)"))(r);
                var i = rq(e + ".500", e + ".200")(r);
                var l = "linear-gradient(\n    to right,\n    transparent 0%,\n    " + rE(t, i) + " 50%,\n    transparent 100%\n  )";
                var $ = !n && o;
                return q({}, $ && a, n ? {
                    bgImage: l
                } : {
                    bgColor: i
                });
            }
            var oS = {
                lineHeight: "1",
                fontSize: "0.25em",
                fontWeight: "bold",
                color: "white"
            };
            var o4 = function r(e) {
                return {
                    bg: rq("gray.100", "whiteAlpha.300")(e)
                };
            };
            var o1 = function r(e) {
                return q({
                    transitionProperty: "common",
                    transitionDuration: "slow"
                }, o2(e));
            };
            var o6 = function r(e) {
                return {
                    label: oS,
                    filledTrack: o1(e),
                    track: o4(e)
                };
            };
            var ok = {
                xs: {
                    track: {
                        h: "0.25rem"
                    }
                },
                sm: {
                    track: {
                        h: "0.5rem"
                    }
                },
                md: {
                    track: {
                        h: "0.75rem"
                    }
                },
                lg: {
                    track: {
                        h: "1rem"
                    }
                }
            };
            var o5 = {
                size: "md",
                colorScheme: "blue"
            };
            var o7 = {
                parts: e5.keys,
                sizes: ok,
                baseStyle: o6,
                defaultProps: o5
            };
            var oC = function r(e) {
                var t = tk.baseStyle(e), n = t.control, o = n === void 0 ? {} : n;
                return q({}, o, {
                    borderRadius: "full",
                    _checked: q({}, o["_checked"], {
                        _before: {
                            content: '""',
                            display: "inline-block",
                            pos: "relative",
                            w: "50%",
                            h: "50%",
                            borderRadius: "50%",
                            bg: "currentColor"
                        }
                    })
                });
            };
            var oA = function r(e) {
                return {
                    label: tk.baseStyle(e).label,
                    container: tk.baseStyle(e).container,
                    control: oC(e)
                };
            };
            var oz = {
                md: {
                    control: {
                        w: 4,
                        h: 4
                    },
                    label: {
                        fontSize: "md"
                    }
                },
                lg: {
                    control: {
                        w: 5,
                        h: 5
                    },
                    label: {
                        fontSize: "lg"
                    }
                },
                sm: {
                    control: {
                        width: 3,
                        height: 3
                    },
                    label: {
                        fontSize: "sm"
                    }
                }
            };
            var oE = {
                size: "md",
                colorScheme: "blue"
            };
            var o8 = {
                parts: e7.keys,
                baseStyle: oA,
                sizes: oz,
                defaultProps: oE
            };
            var oF = function r(e) {
                return q({}, n1.baseStyle.field, {
                    bg: rq("white", "gray.700")(e),
                    appearance: "none",
                    paddingBottom: "1px",
                    lineHeight: "normal",
                    "> option, > optgroup": {
                        bg: rq("white", "gray.700")(e)
                    }
                });
            };
            var oB = {
                width: "1.5rem",
                height: "100%",
                insetEnd: "0.5rem",
                position: "relative",
                color: "currentColor",
                fontSize: "1.25rem",
                _disabled: {
                    opacity: 0.5
                }
            };
            var oP = function r(e) {
                return {
                    field: oF(e),
                    icon: oB
                };
            };
            var oD = {
                paddingInlineEnd: "2rem"
            };
            var oR = eR()({}, n1.sizes, {
                lg: {
                    field: oD
                },
                md: {
                    field: oD
                },
                sm: {
                    field: oD
                },
                xs: {
                    field: oD,
                    icon: {
                        insetEnd: "0.25rem"
                    }
                }
            });
            var oH = {
                parts: eC.keys,
                baseStyle: oP,
                sizes: oR,
                variants: n1.variants,
                defaultProps: n1.defaultProps
            };
            var oW = function r(e, t) {
                return (0, l.F4)({
                    from: {
                        borderColor: e,
                        background: e
                    },
                    to: {
                        borderColor: t,
                        background: t
                    }
                });
            };
            var oI = function r(e) {
                var t = rq("gray.100", "gray.800")(e);
                var n = rq("gray.400", "gray.600")(e);
                var o = e.startColor, a = o === void 0 ? t : o, i = e.endColor, l = i === void 0 ? n : i, $ = e.speed, s = e.theme;
                var u = rE(s, a);
                var c = rE(s, l);
                return {
                    opacity: 0.7,
                    borderRadius: "2px",
                    borderColor: u,
                    background: c,
                    animation: $ + "s linear infinite alternate " + oW(u, c)
                };
            };
            var oT = {
                baseStyle: oI
            };
            var oN = function r(e) {
                return {
                    borderRadius: "md",
                    fontWeight: "semibold",
                    _focusVisible: {
                        boxShadow: "outline",
                        padding: "1rem",
                        position: "fixed",
                        top: "1.5rem",
                        insetStart: "1.5rem",
                        bg: rq("white", "gray.700")(e)
                    }
                };
            };
            var oM = {
                baseStyle: oN
            };
            function oO(r) {
                return rZ({
                    orientation: r.orientation,
                    vertical: {
                        left: "50%",
                        transform: "translateX(-50%)",
                        _active: {
                            transform: "translateX(-50%) scale(1.15)"
                        }
                    },
                    horizontal: {
                        top: "50%",
                        transform: "translateY(-50%)",
                        _active: {
                            transform: "translateY(-50%) scale(1.15)"
                        }
                    }
                });
            }
            var oL = function r(e) {
                var t = e.orientation;
                return q({
                    display: "inline-block",
                    position: "relative",
                    cursor: "pointer",
                    _disabled: {
                        opacity: 0.6,
                        cursor: "default",
                        pointerEvents: "none"
                    }
                }, rZ({
                    orientation: t,
                    vertical: {
                        h: "100%"
                    },
                    horizontal: {
                        w: "100%"
                    }
                }));
            };
            var oV = function r(e) {
                return {
                    overflow: "hidden",
                    borderRadius: "sm",
                    bg: rq("gray.200", "whiteAlpha.200")(e),
                    _disabled: {
                        bg: rq("gray.300", "whiteAlpha.300")(e)
                    }
                };
            };
            var oj = function r(e) {
                return q({
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "absolute",
                    outline: 0,
                    zIndex: 1,
                    borderRadius: "full",
                    bg: "white",
                    boxShadow: "base",
                    border: "1px solid",
                    borderColor: "transparent",
                    transitionProperty: "transform",
                    transitionDuration: "normal",
                    _focusVisible: {
                        boxShadow: "outline"
                    },
                    _disabled: {
                        bg: "gray.300"
                    }
                }, oO(e));
            };
            var oq = function r(e) {
                var t = e.colorScheme;
                return {
                    width: "inherit",
                    height: "inherit",
                    bg: rq(t + ".500", t + ".200")(e)
                };
            };
            var oZ = function r(e) {
                return {
                    container: oL(e),
                    track: oV(e),
                    thumb: oj(e),
                    filledTrack: oq(e)
                };
            };
            var o9 = function r(e) {
                return {
                    thumb: {
                        w: "16px",
                        h: "16px"
                    },
                    track: rZ({
                        orientation: e.orientation,
                        horizontal: {
                            h: "4px"
                        },
                        vertical: {
                            w: "4px"
                        }
                    })
                };
            };
            var oU = function r(e) {
                return {
                    thumb: {
                        w: "14px",
                        h: "14px"
                    },
                    track: rZ({
                        orientation: e.orientation,
                        horizontal: {
                            h: "4px"
                        },
                        vertical: {
                            w: "4px"
                        }
                    })
                };
            };
            var oG = function r(e) {
                return {
                    thumb: {
                        w: "10px",
                        h: "10px"
                    },
                    track: rZ({
                        orientation: e.orientation,
                        horizontal: {
                            h: "2px"
                        },
                        vertical: {
                            w: "2px"
                        }
                    })
                };
            };
            var oJ = {
                lg: o9,
                md: oU,
                sm: oG
            };
            var oK = {
                size: "md",
                colorScheme: "blue"
            };
            var oX = {
                parts: eA.keys,
                sizes: oJ,
                baseStyle: oZ,
                defaultProps: oK
            };
            var oY, oQ, ar, ae, at;
            var an = ed("spinner-size");
            var ao = {
                width: [
                    an.reference
                ],
                height: [
                    an.reference
                ]
            };
            var aa = {
                xs: ((oY = {}), (oY[an.variable] = "0.75rem"), oY),
                sm: ((oQ = {}), (oQ[an.variable] = "1rem"), oQ),
                md: ((ar = {}), (ar[an.variable] = "1.5rem"), ar),
                lg: ((ae = {}), (ae[an.variable] = "2rem"), ae),
                xl: ((at = {}), (at[an.variable] = "3rem"), at)
            };
            var ai = {
                size: "md"
            };
            var al = {
                baseStyle: ao,
                sizes: aa,
                defaultProps: ai
            };
            var a$ = {
                fontWeight: "medium"
            };
            var as = {
                opacity: 0.8,
                marginBottom: 2
            };
            var au = {
                verticalAlign: "baseline",
                fontWeight: "semibold"
            };
            var ac = {
                marginEnd: 1,
                w: "14px",
                h: "14px",
                verticalAlign: "middle"
            };
            var ad = {
                container: {},
                label: a$,
                helpText: as,
                number: au,
                icon: ac
            };
            var af = {
                md: {
                    label: {
                        fontSize: "sm"
                    },
                    helpText: {
                        fontSize: "sm"
                    },
                    number: {
                        fontSize: "2xl"
                    }
                }
            };
            var av = {
                size: "md"
            };
            var ap = {
                parts: ez.keys,
                baseStyle: ad,
                sizes: af,
                defaultProps: av
            };
            var am, ah, ab;
            var ag = ed("switch-track-width");
            var a_ = ed("switch-track-height");
            var a3 = ed("switch-track-diff");
            var a0 = ea.subtract(ag, a_);
            var ax = ed("switch-thumb-x");
            var ay = function r(e) {
                var t = e.colorScheme;
                return {
                    borderRadius: "full",
                    p: "2px",
                    width: [
                        ag.reference
                    ],
                    height: [
                        a_.reference
                    ],
                    transitionProperty: "common",
                    transitionDuration: "fast",
                    bg: rq("gray.300", "whiteAlpha.400")(e),
                    _focusVisible: {
                        boxShadow: "outline"
                    },
                    _disabled: {
                        opacity: 0.4,
                        cursor: "not-allowed"
                    },
                    _checked: {
                        bg: rq(t + ".500", t + ".200")(e)
                    }
                };
            };
            var aw = {
                bg: "white",
                transitionProperty: "transform",
                transitionDuration: "normal",
                borderRadius: "inherit",
                width: [
                    a_.reference
                ],
                height: [
                    a_.reference
                ],
                _checked: {
                    transform: "translateX(" + ax.reference + ")"
                }
            };
            var a2 = function r(e) {
                var t, n;
                return {
                    container: ((n = {}), (n[a3.variable] = a0), (n[ax.variable] = a3.reference), (n._rtl = ((t = {}), (t[ax.variable] = ea(a3).negate().toString()), t)), n),
                    track: ay(e),
                    thumb: aw
                };
            };
            var aS = {
                sm: {
                    container: ((am = {}), (am[ag.variable] = "1.375rem"), (am[a_.variable] = "0.75rem"), am)
                },
                md: {
                    container: ((ah = {}), (ah[ag.variable] = "1.875rem"), (ah[a_.variable] = "1rem"), ah)
                },
                lg: {
                    container: ((ab = {}), (ab[ag.variable] = "2.875rem"), (ab[a_.variable] = "1.5rem"), ab)
                }
            };
            var a4 = {
                size: "md",
                colorScheme: "blue"
            };
            var a1 = {
                parts: eE.keys,
                baseStyle: a2,
                sizes: aS,
                defaultProps: a4
            };
            var a6 = {
                table: {
                    fontVariantNumeric: "lining-nums tabular-nums",
                    borderCollapse: "collapse",
                    width: "full"
                },
                th: {
                    fontFamily: "heading",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    letterSpacing: "wider",
                    textAlign: "start"
                },
                td: {
                    textAlign: "start"
                },
                caption: {
                    mt: 4,
                    fontFamily: "heading",
                    textAlign: "center",
                    fontWeight: "medium"
                }
            };
            var ak = {
                "&[data-is-numeric=true]": {
                    textAlign: "end"
                }
            };
            var a5 = function r(e) {
                var t = e.colorScheme;
                return {
                    th: q({
                        color: rq("gray.600", "gray.400")(e),
                        borderBottom: "1px",
                        borderColor: rq(t + ".100", t + ".700")(e)
                    }, ak),
                    td: q({
                        borderBottom: "1px",
                        borderColor: rq(t + ".100", t + ".700")(e)
                    }, ak),
                    caption: {
                        color: rq("gray.600", "gray.100")(e)
                    },
                    tfoot: {
                        tr: {
                            "&:last-of-type": {
                                th: {
                                    borderBottomWidth: 0
                                }
                            }
                        }
                    }
                };
            };
            var a7 = function r(e) {
                var t = e.colorScheme;
                return {
                    th: q({
                        color: rq("gray.600", "gray.400")(e),
                        borderBottom: "1px",
                        borderColor: rq(t + ".100", t + ".700")(e)
                    }, ak),
                    td: q({
                        borderBottom: "1px",
                        borderColor: rq(t + ".100", t + ".700")(e)
                    }, ak),
                    caption: {
                        color: rq("gray.600", "gray.100")(e)
                    },
                    tbody: {
                        tr: {
                            "&:nth-of-type(odd)": {
                                "th, td": {
                                    borderBottomWidth: "1px",
                                    borderColor: rq(t + ".100", t + ".700")(e)
                                },
                                td: {
                                    background: rq(t + ".100", t + ".700")(e)
                                }
                            }
                        }
                    },
                    tfoot: {
                        tr: {
                            "&:last-of-type": {
                                th: {
                                    borderBottomWidth: 0
                                }
                            }
                        }
                    }
                };
            };
            var aC = {
                simple: a5,
                striped: a7,
                unstyled: {}
            };
            var aA = {
                sm: {
                    th: {
                        px: "4",
                        py: "1",
                        lineHeight: "4",
                        fontSize: "xs"
                    },
                    td: {
                        px: "4",
                        py: "2",
                        fontSize: "sm",
                        lineHeight: "4"
                    },
                    caption: {
                        px: "4",
                        py: "2",
                        fontSize: "xs"
                    }
                },
                md: {
                    th: {
                        px: "6",
                        py: "3",
                        lineHeight: "4",
                        fontSize: "xs"
                    },
                    td: {
                        px: "6",
                        py: "4",
                        lineHeight: "5"
                    },
                    caption: {
                        px: "6",
                        py: "2",
                        fontSize: "sm"
                    }
                },
                lg: {
                    th: {
                        px: "8",
                        py: "4",
                        lineHeight: "5",
                        fontSize: "sm"
                    },
                    td: {
                        px: "8",
                        py: "5",
                        lineHeight: "6"
                    },
                    caption: {
                        px: "6",
                        py: "2",
                        fontSize: "md"
                    }
                }
            };
            var az = {
                variant: "simple",
                size: "md",
                colorScheme: "gray"
            };
            var aE = {
                parts: e8.keys,
                baseStyle: a6,
                variants: aC,
                sizes: aA,
                defaultProps: az
            };
            var a8 = function r(e) {
                var t = e.orientation;
                return {
                    display: t === "vertical" ? "flex" : "block"
                };
            };
            var aF = function r(e) {
                var t = e.isFitted;
                return {
                    flex: t ? 1 : undefined,
                    transitionProperty: "common",
                    transitionDuration: "normal",
                    _focusVisible: {
                        zIndex: 1,
                        boxShadow: "outline"
                    },
                    _disabled: {
                        cursor: "not-allowed",
                        opacity: 0.4
                    }
                };
            };
            var aB = function r(e) {
                var t = e.align, n = t === void 0 ? "start" : t, o = e.orientation;
                var a = {
                    end: "flex-end",
                    center: "center",
                    start: "flex-start"
                };
                return {
                    justifyContent: a[n],
                    flexDirection: o === "vertical" ? "column" : "row"
                };
            };
            var aP = {
                p: 4
            };
            var aD = function r(e) {
                return {
                    root: a8(e),
                    tab: aF(e),
                    tablist: aB(e),
                    tabpanel: aP
                };
            };
            var aR = {
                sm: {
                    tab: {
                        py: 1,
                        px: 4,
                        fontSize: "sm"
                    }
                },
                md: {
                    tab: {
                        fontSize: "md",
                        py: 2,
                        px: 4
                    }
                },
                lg: {
                    tab: {
                        fontSize: "lg",
                        py: 3,
                        px: 4
                    }
                }
            };
            var aH = function r(e) {
                var t, n;
                var o = e.colorScheme, a = e.orientation;
                var i = a === "vertical";
                var l = a === "vertical" ? "borderStart" : "borderBottom";
                var $ = i ? "marginStart" : "marginBottom";
                return {
                    tablist: ((t = {}), (t[l] = "2px solid"), (t.borderColor = "inherit"), t),
                    tab: ((n = {}), (n[l] = "2px solid"), (n.borderColor = "transparent"), (n[$] = "-2px"), (n._selected = {
                        color: rq(o + ".600", o + ".300")(e),
                        borderColor: "currentColor"
                    }), (n._active = {
                        bg: rq("gray.200", "whiteAlpha.300")(e)
                    }), (n._disabled = {
                        _active: {
                            bg: "none"
                        }
                    }), n)
                };
            };
            var aW = function r(e) {
                var t = e.colorScheme;
                return {
                    tab: {
                        borderTopRadius: "md",
                        border: "1px solid",
                        borderColor: "transparent",
                        mb: "-1px",
                        _selected: {
                            color: rq(t + ".600", t + ".300")(e),
                            borderColor: "inherit",
                            borderBottomColor: rq("white", "gray.800")(e)
                        }
                    },
                    tablist: {
                        mb: "-1px",
                        borderBottom: "1px solid",
                        borderColor: "inherit"
                    }
                };
            };
            var aI = function r(e) {
                var t = e.colorScheme;
                return {
                    tab: {
                        border: "1px solid",
                        borderColor: "inherit",
                        bg: rq("gray.50", "whiteAlpha.50")(e),
                        mb: "-1px",
                        _notLast: {
                            marginEnd: "-1px"
                        },
                        _selected: {
                            bg: rq("#fff", "gray.800")(e),
                            color: rq(t + ".600", t + ".300")(e),
                            borderColor: "inherit",
                            borderTopColor: "currentColor",
                            borderBottomColor: "transparent"
                        }
                    },
                    tablist: {
                        mb: "-1px",
                        borderBottom: "1px solid",
                        borderColor: "inherit"
                    }
                };
            };
            var aT = function r(e) {
                var t = e.colorScheme, n = e.theme;
                return {
                    tab: {
                        borderRadius: "full",
                        fontWeight: "semibold",
                        color: "gray.600",
                        _selected: {
                            color: rE(n, t + ".700"),
                            bg: rE(n, t + ".100")
                        }
                    }
                };
            };
            var aN = function r(e) {
                var t = e.colorScheme;
                return {
                    tab: {
                        borderRadius: "full",
                        fontWeight: "semibold",
                        color: rq("gray.600", "inherit")(e),
                        _selected: {
                            color: rq("#fff", "gray.800")(e),
                            bg: rq(t + ".600", t + ".300")(e)
                        }
                    }
                };
            };
            var aM = {};
            var aO = {
                line: aH,
                enclosed: aW,
                "enclosed-colored": aI,
                "soft-rounded": aT,
                "solid-rounded": aN,
                unstyled: aM
            };
            var aL = {
                size: "md",
                variant: "line",
                colorScheme: "blue"
            };
            var aV = {
                parts: eF.keys,
                baseStyle: aD,
                sizes: aR,
                variants: aO,
                defaultProps: aL
            };
            var aj = {
                fontWeight: "medium",
                lineHeight: 1.2,
                outline: 0,
                borderRadius: "md",
                _focusVisible: {
                    boxShadow: "outline"
                }
            };
            var aq = {
                lineHeight: 1.2,
                overflow: "visible"
            };
            var aZ = {
                fontSize: "18px",
                w: "1.25rem",
                h: "1.25rem",
                transitionProperty: "common",
                transitionDuration: "normal",
                borderRadius: "full",
                marginStart: "0.375rem",
                marginEnd: "-1",
                opacity: 0.5,
                _disabled: {
                    opacity: 0.4
                },
                _focusVisible: {
                    boxShadow: "outline",
                    bg: "rgba(0, 0, 0, 0.14)"
                },
                _hover: {
                    opacity: 0.8
                },
                _active: {
                    opacity: 1
                }
            };
            var a9 = {
                container: aj,
                label: aq,
                closeButton: aZ
            };
            var aU = {
                sm: {
                    container: {
                        minH: "1.25rem",
                        minW: "1.25rem",
                        fontSize: "xs",
                        px: 2
                    },
                    closeButton: {
                        marginEnd: "-2px",
                        marginStart: "0.35rem"
                    }
                },
                md: {
                    container: {
                        minH: "1.5rem",
                        minW: "1.5rem",
                        fontSize: "sm",
                        px: 2
                    }
                },
                lg: {
                    container: {
                        minH: 8,
                        minW: 8,
                        fontSize: "md",
                        px: 3
                    }
                }
            };
            var aG = {
                subtle: function r(e) {
                    return {
                        container: ts.variants.subtle(e)
                    };
                },
                solid: function r(e) {
                    return {
                        container: ts.variants.solid(e)
                    };
                },
                outline: function r(e) {
                    return {
                        container: ts.variants.outline(e)
                    };
                }
            };
            var aJ = {
                size: "md",
                variant: "subtle",
                colorScheme: "gray"
            };
            var aK = {
                parts: eB.keys,
                variants: aG,
                baseStyle: a9,
                sizes: aU,
                defaultProps: aJ
            };
            var aX, aY, aQ, ir, ie;
            var it = q({}, n1.baseStyle.field, {
                paddingY: "8px",
                minHeight: "80px",
                lineHeight: "short",
                verticalAlign: "top"
            });
            var io = {
                outline: function r(e) {
                    var t;
                    return (t = n1.variants.outline(e).field) != null ? t : {};
                },
                flushed: function r(e) {
                    var t;
                    return (t = n1.variants.flushed(e).field) != null ? t : {};
                },
                filled: function r(e) {
                    var t;
                    return (t = n1.variants.filled(e).field) != null ? t : {};
                },
                unstyled: (aX = n1.variants.unstyled.field) != null ? aX : {}
            };
            var ia = {
                xs: (aY = n1.sizes.xs.field) != null ? aY : {},
                sm: (aQ = n1.sizes.sm.field) != null ? aQ : {},
                md: (ir = n1.sizes.md.field) != null ? ir : {},
                lg: (ie = n1.sizes.lg.field) != null ? ie : {}
            };
            var ii = {
                size: "md",
                variant: "outline"
            };
            var il = {
                baseStyle: it,
                sizes: ia,
                variants: io,
                defaultProps: ii
            };
            var i$ = ed("tooltip-bg");
            var is = ed("popper-arrow-bg");
            var iu = function r(e) {
                var t;
                var n = rq("gray.700", "gray.300")(e);
                return ((t = {}), (t[i$.variable] = "colors." + n), (t.px = "8px"), (t.py = "2px"), (t.bg = [
                    i$.reference
                ]), (t[is.variable] = [
                    i$.reference
                ]), (t.color = rq("whiteAlpha.900", "gray.900")(e)), (t.borderRadius = "sm"), (t.fontWeight = "medium"), (t.fontSize = "sm"), (t.boxShadow = "md"), (t.maxW = "320px"), (t.zIndex = "tooltip"), t);
            };
            var ic = {
                baseStyle: iu
            };
            var id = {
                Accordion: eM,
                Alert: eG,
                Avatar: tt,
                Badge: ts,
                Breadcrumb: td,
                Button: tx,
                Checkbox: tk,
                CloseButton: tF,
                Code: tR,
                Container: tW,
                Divider: tL,
                Drawer: tQ,
                Editable: no,
                Form: n$,
                FormError: nd,
                FormLabel: nv,
                Heading: nb,
                Input: n1,
                Kbd: nk,
                Link: n7,
                List: nz,
                Menu: nH,
                Modal: n9,
                NumberInput: o$,
                PinInput: ov,
                Popover: ow,
                Progress: o7,
                Radio: o8,
                Select: oH,
                Skeleton: oT,
                SkipLink: oM,
                Slider: oX,
                Spinner: al,
                Stat: ap,
                Switch: a1,
                Table: aE,
                Tabs: aV,
                Tag: aK,
                Textarea: il,
                Tooltip: ic
            };
            var iv = {
                none: 0,
                "1px": "1px solid",
                "2px": "2px solid",
                "4px": "4px solid",
                "8px": "8px solid"
            };
            var ip = rU({
                sm: "30em",
                md: "48em",
                lg: "62em",
                xl: "80em",
                "2xl": "96em"
            });
            var im = {
                transparent: "transparent",
                current: "currentColor",
                black: "#000000",
                white: "#FFFFFF",
                whiteAlpha: {
                    50: "rgba(255, 255, 255, 0.04)",
                    100: "rgba(255, 255, 255, 0.06)",
                    200: "rgba(255, 255, 255, 0.08)",
                    300: "rgba(255, 255, 255, 0.16)",
                    400: "rgba(255, 255, 255, 0.24)",
                    500: "rgba(255, 255, 255, 0.36)",
                    600: "rgba(255, 255, 255, 0.48)",
                    700: "rgba(255, 255, 255, 0.64)",
                    800: "rgba(255, 255, 255, 0.80)",
                    900: "rgba(255, 255, 255, 0.92)"
                },
                blackAlpha: {
                    50: "rgba(0, 0, 0, 0.04)",
                    100: "rgba(0, 0, 0, 0.06)",
                    200: "rgba(0, 0, 0, 0.08)",
                    300: "rgba(0, 0, 0, 0.16)",
                    400: "rgba(0, 0, 0, 0.24)",
                    500: "rgba(0, 0, 0, 0.36)",
                    600: "rgba(0, 0, 0, 0.48)",
                    700: "rgba(0, 0, 0, 0.64)",
                    800: "rgba(0, 0, 0, 0.80)",
                    900: "rgba(0, 0, 0, 0.92)"
                },
                gray: {
                    50: "#F7FAFC",
                    100: "#EDF2F7",
                    200: "#E2E8F0",
                    300: "#CBD5E0",
                    400: "#A0AEC0",
                    500: "#718096",
                    600: "#4A5568",
                    700: "#2D3748",
                    800: "#1A202C",
                    900: "#171923"
                },
                red: {
                    50: "#FFF5F5",
                    100: "#FED7D7",
                    200: "#FEB2B2",
                    300: "#FC8181",
                    400: "#F56565",
                    500: "#E53E3E",
                    600: "#C53030",
                    700: "#9B2C2C",
                    800: "#822727",
                    900: "#63171B"
                },
                orange: {
                    50: "#FFFAF0",
                    100: "#FEEBC8",
                    200: "#FBD38D",
                    300: "#F6AD55",
                    400: "#ED8936",
                    500: "#DD6B20",
                    600: "#C05621",
                    700: "#9C4221",
                    800: "#7B341E",
                    900: "#652B19"
                },
                yellow: {
                    50: "#FFFFF0",
                    100: "#FEFCBF",
                    200: "#FAF089",
                    300: "#F6E05E",
                    400: "#ECC94B",
                    500: "#D69E2E",
                    600: "#B7791F",
                    700: "#975A16",
                    800: "#744210",
                    900: "#5F370E"
                },
                green: {
                    50: "#F0FFF4",
                    100: "#C6F6D5",
                    200: "#9AE6B4",
                    300: "#68D391",
                    400: "#48BB78",
                    500: "#38A169",
                    600: "#2F855A",
                    700: "#276749",
                    800: "#22543D",
                    900: "#1C4532"
                },
                teal: {
                    50: "#E6FFFA",
                    100: "#B2F5EA",
                    200: "#81E6D9",
                    300: "#4FD1C5",
                    400: "#38B2AC",
                    500: "#319795",
                    600: "#2C7A7B",
                    700: "#285E61",
                    800: "#234E52",
                    900: "#1D4044"
                },
                blue: {
                    50: "#ebf8ff",
                    100: "#bee3f8",
                    200: "#90cdf4",
                    300: "#63b3ed",
                    400: "#4299e1",
                    500: "#3182ce",
                    600: "#2b6cb0",
                    700: "#2c5282",
                    800: "#2a4365",
                    900: "#1A365D"
                },
                cyan: {
                    50: "#EDFDFD",
                    100: "#C4F1F9",
                    200: "#9DECF9",
                    300: "#76E4F7",
                    400: "#0BC5EA",
                    500: "#00B5D8",
                    600: "#00A3C4",
                    700: "#0987A0",
                    800: "#086F83",
                    900: "#065666"
                },
                purple: {
                    50: "#FAF5FF",
                    100: "#E9D8FD",
                    200: "#D6BCFA",
                    300: "#B794F4",
                    400: "#9F7AEA",
                    500: "#805AD5",
                    600: "#6B46C1",
                    700: "#553C9A",
                    800: "#44337A",
                    900: "#322659"
                },
                pink: {
                    50: "#FFF5F7",
                    100: "#FED7E2",
                    200: "#FBB6CE",
                    300: "#F687B3",
                    400: "#ED64A6",
                    500: "#D53F8C",
                    600: "#B83280",
                    700: "#97266D",
                    800: "#702459",
                    900: "#521B41"
                },
                linkedin: {
                    50: "#E8F4F9",
                    100: "#CFEDFB",
                    200: "#9BDAF3",
                    300: "#68C7EC",
                    400: "#34B3E4",
                    500: "#00A0DC",
                    600: "#008CC9",
                    700: "#0077B5",
                    800: "#005E93",
                    900: "#004471"
                },
                facebook: {
                    50: "#E8F4F9",
                    100: "#D9DEE9",
                    200: "#B7C2DA",
                    300: "#6482C0",
                    400: "#4267B2",
                    500: "#385898",
                    600: "#314E89",
                    700: "#29487D",
                    800: "#223B67",
                    900: "#1E355B"
                },
                messenger: {
                    50: "#D0E6FF",
                    100: "#B9DAFF",
                    200: "#A2CDFF",
                    300: "#7AB8FF",
                    400: "#2E90FF",
                    500: "#0078FF",
                    600: "#0063D1",
                    700: "#0052AC",
                    800: "#003C7E",
                    900: "#002C5C"
                },
                whatsapp: {
                    50: "#dffeec",
                    100: "#b9f5d0",
                    200: "#90edb3",
                    300: "#65e495",
                    400: "#3cdd78",
                    500: "#22c35e",
                    600: "#179848",
                    700: "#0c6c33",
                    800: "#01421c",
                    900: "#001803"
                },
                twitter: {
                    50: "#E5F4FD",
                    100: "#C8E9FB",
                    200: "#A8DCFA",
                    300: "#83CDF7",
                    400: "#57BBF5",
                    500: "#1DA1F2",
                    600: "#1A94DA",
                    700: "#1681BF",
                    800: "#136B9E",
                    900: "#0D4D71"
                },
                telegram: {
                    50: "#E3F2F9",
                    100: "#C5E4F3",
                    200: "#A2D4EC",
                    300: "#7AC1E4",
                    400: "#47A9DA",
                    500: "#0088CC",
                    600: "#007AB8",
                    700: "#006BA1",
                    800: "#005885",
                    900: "#003F5E"
                }
            };
            var ih = {
                none: "0",
                sm: "0.125rem",
                base: "0.25rem",
                md: "0.375rem",
                lg: "0.5rem",
                xl: "0.75rem",
                "2xl": "1rem",
                "3xl": "1.5rem",
                full: "9999px"
            };
            var ib = {
                xs: "0 0 0 1px rgba(0, 0, 0, 0.05)",
                sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                base: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                outline: "0 0 0 3px rgba(66, 153, 225, 0.6)",
                inner: "inset 0 2px 4px 0 rgba(0,0,0,0.06)",
                none: "none",
                "dark-lg": "rgba(0, 0, 0, 0.1) 0px 0px 0px 1px, rgba(0, 0, 0, 0.2) 0px 5px 10px, rgba(0, 0, 0, 0.4) 0px 15px 40px"
            };
            var ig = {
                common: "background-color, border-color, color, fill, stroke, opacity, box-shadow, transform",
                colors: "background-color, border-color, color, fill, stroke",
                dimensions: "width, height",
                position: "left, right, top, bottom",
                background: "background-color, background-image, background-position"
            };
            var i_ = {
                "ease-in": "cubic-bezier(0.4, 0, 1, 1)",
                "ease-out": "cubic-bezier(0, 0, 0.2, 1)",
                "ease-in-out": "cubic-bezier(0.4, 0, 0.2, 1)"
            };
            var i3 = {
                "ultra-fast": "50ms",
                faster: "100ms",
                fast: "150ms",
                normal: "200ms",
                slow: "300ms",
                slower: "400ms",
                "ultra-slow": "500ms"
            };
            var i0 = {
                property: ig,
                easing: i_,
                duration: i3
            };
            var ix = {
                hide: -1,
                auto: "auto",
                base: 0,
                docked: 10,
                dropdown: 1000,
                sticky: 1100,
                banner: 1200,
                overlay: 1300,
                modal: 1400,
                popover: 1500,
                skipLink: 1600,
                toast: 1700,
                tooltip: 1800
            };
            var iy = {
                none: 0,
                sm: "4px",
                base: "8px",
                md: "12px",
                lg: "16px",
                xl: "24px",
                "2xl": "40px",
                "3xl": "64px"
            };
            var iw = q({
                breakpoints: ip,
                zIndices: ix,
                radii: ih,
                blur: iy,
                colors: im
            }, eP, {
                sizes: G,
                shadows: ib,
                space: j,
                borders: iv,
                transition: i0
            });
            var i2 = {
                colors: {
                    "chakra-body-text": {
                        _light: "gray.800",
                        _dark: "whiteAlpha.900"
                    },
                    "chakra-body-bg": {
                        _light: "white",
                        _dark: "gray.800"
                    },
                    "chakra-border-color": {
                        _light: "gray.200",
                        _dark: "whiteAlpha.300"
                    },
                    "chakra-placeholder-color": {
                        _light: "gray.500",
                        _dark: "whiteAlpha.400"
                    }
                }
            };
            var iS = {
                global: {
                    body: {
                        fontFamily: "body",
                        color: "chakra-body-text",
                        bg: "chakra-body-bg",
                        transitionProperty: "background-color",
                        transitionDuration: "normal",
                        lineHeight: "base"
                    },
                    "*::placeholder": {
                        color: "chakra-placeholder-color"
                    },
                    "*, *::before, &::after": {
                        borderColor: "chakra-border-color",
                        wordWrap: "break-word"
                    }
                }
            };
            var i4 = iS;
            var i1 = null && [
                "borders",
                "breakpoints",
                "colors",
                "components",
                "config",
                "direction",
                "fonts",
                "fontSizes",
                "fontWeights",
                "letterSpacings",
                "lineHeights",
                "radii",
                "shadows",
                "sizes",
                "space",
                "styles",
                "transition",
                "zIndices", 
            ];
            function i6(r) {
                if (!isObject(r)) {
                    return false;
                }
                return i1.every(function(e) {
                    return Object.prototype.hasOwnProperty.call(r, e);
                });
            }
            var ik = "ltr";
            var i5 = {
                useSystemColorMode: false,
                initialColorMode: "light",
                cssVarPrefix: "chakra"
            };
            var i7 = q({
                semanticTokens: i2,
                direction: ik
            }, iw, {
                components: id,
                styles: i4,
                config: i5
            });
            var iC = t(1358);
            function iA() {
                iA = Object.assign ? Object.assign.bind() : function(r) {
                    for(var e = 1; e < arguments.length; e++){
                        var t = arguments[e];
                        for(var n in t){
                            if (Object.prototype.hasOwnProperty.call(t, n)) {
                                r[n] = t[n];
                            }
                        }
                    }
                    return r;
                };
                return iA.apply(this, arguments);
            }
            function iz(r, e) {
                if (r == null) return {};
                var t = {};
                var n = Object.keys(r);
                var o, a;
                for(a = 0; a < n.length; a++){
                    o = n[a];
                    if (e.indexOf(o) >= 0) continue;
                    t[o] = r[o];
                }
                return t;
            }
            var iE = [
                "label",
                "thickness",
                "speed",
                "emptyColor",
                "className", 
            ];
            var i8 = (0, l.F4)({
                "0%": {
                    transform: "rotate(0deg)"
                },
                "100%": {
                    transform: "rotate(360deg)"
                }
            });
            var iF = (0, B.Gp)(function(r, e) {
                var t = (0, B.mq)("Spinner", r);
                var n = (0, B.Lr)(r), o = n.label, a = o === void 0 ? "Loading..." : o, l = n.thickness, $ = l === void 0 ? "2px" : l, s = n.speed, c = s === void 0 ? "0.45s" : s, d = n.emptyColor, f = d === void 0 ? "transparent" : d, v = n.className, p = iz(n, iE);
                var m = (0, u.cx)("chakra-spinner", v);
                var h = iA({
                    display: "inline-block",
                    borderColor: "currentColor",
                    borderStyle: "solid",
                    borderRadius: "99999px",
                    borderWidth: $,
                    borderBottomColor: f,
                    borderLeftColor: f,
                    animation: i8 + " " + c + " linear infinite"
                }, t);
                return i.createElement(B.m$.div, iA({
                    ref: e,
                    __css: h,
                    className: m
                }, p), a && i.createElement(iC.TX, null, a));
            });
            if (u.Ts) {
                iF.displayName = "Spinner";
            }
            var iB = t(894);
            function iP() {
                iP = Object.assign ? Object.assign.bind() : function(r) {
                    for(var e = 1; e < arguments.length; e++){
                        var t = arguments[e];
                        for(var n in t){
                            if (Object.prototype.hasOwnProperty.call(t, n)) {
                                r[n] = t[n];
                            }
                        }
                    }
                    return r;
                };
                return iP.apply(this, arguments);
            }
            function iD(r, e) {
                if (r == null) return {};
                var t = {};
                var n = Object.keys(r);
                var o, a;
                for(a = 0; a < n.length; a++){
                    o = n[a];
                    if (e.indexOf(o) >= 0) continue;
                    t[o] = r[o];
                }
                return t;
            }
            var iR = function r(e) {
                return i.createElement(iB.JO, iP({
                    viewBox: "0 0 24 24"
                }, e), i.createElement("path", {
                    fill: "currentColor",
                    d: "M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
                }));
            };
            var iH = function r(e) {
                return i.createElement(iB.JO, iP({
                    viewBox: "0 0 24 24"
                }, e), i.createElement("path", {
                    fill: "currentColor",
                    d: "M12,0A12,12,0,1,0,24,12,12.013,12.013,0,0,0,12,0Zm.25,5a1.5,1.5,0,1,1-1.5,1.5A1.5,1.5,0,0,1,12.25,5ZM14.5,18.5h-4a1,1,0,0,1,0-2h.75a.25.25,0,0,0,.25-.25v-4.5a.25.25,0,0,0-.25-.25H10.5a1,1,0,0,1,0-2h1a2,2,0,0,1,2,2v4.75a.25.25,0,0,0,.25.25h.75a1,1,0,1,1,0,2Z"
                }));
            };
            var iW = function r(e) {
                return i.createElement(iB.JO, iP({
                    viewBox: "0 0 24 24"
                }, e), i.createElement("path", {
                    fill: "currentColor",
                    d: "M11.983,0a12.206,12.206,0,0,0-8.51,3.653A11.8,11.8,0,0,0,0,12.207,11.779,11.779,0,0,0,11.8,24h.214A12.111,12.111,0,0,0,24,11.791h0A11.766,11.766,0,0,0,11.983,0ZM10.5,16.542a1.476,1.476,0,0,1,1.449-1.53h.027a1.527,1.527,0,0,1,1.523,1.47,1.475,1.475,0,0,1-1.449,1.53h-.027A1.529,1.529,0,0,1,10.5,16.542ZM11,12.5v-6a1,1,0,0,1,2,0v6a1,1,0,1,1-2,0Z"
                }));
            };
            var iI = [
                "status"
            ];
            var iT = (0, B.eC)("Alert"), iN = iT[0], iM = iT[1];
            var iO = {
                info: {
                    icon: iH,
                    colorScheme: "blue"
                },
                warning: {
                    icon: iW,
                    colorScheme: "orange"
                },
                success: {
                    icon: iR,
                    colorScheme: "green"
                },
                error: {
                    icon: iW,
                    colorScheme: "red"
                },
                loading: {
                    icon: iF,
                    colorScheme: "blue"
                }
            };
            var iL = (0, c.kr)({
                name: "AlertContext",
                errorMessage: "useAlertContext: `context` is undefined. Seems you forgot to wrap alert components in `<Alert />`"
            }), iV = iL[0], ij = iL[1];
            var iq = (0, B.Gp)(function(r, e) {
                var t;
                var n = (0, B.Lr)(r), o = n.status, a = o === void 0 ? "info" : o, l = iD(n, iI);
                var $ = (t = r.colorScheme) != null ? t : iO[a].colorScheme;
                var s = (0, B.jC)("Alert", iP({}, r, {
                    colorScheme: $
                }));
                var c = iP({
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    position: "relative",
                    overflow: "hidden"
                }, s.container);
                return i.createElement(iV, {
                    value: {
                        status: a
                    }
                }, i.createElement(iN, {
                    value: s
                }, i.createElement(B.m$.div, iP({
                    role: "alert",
                    ref: e
                }, l, {
                    className: (0, u.cx)("chakra-alert", r.className),
                    __css: c
                }))));
            });
            var iZ = (0, B.Gp)(function(r, e) {
                var t = iM();
                return i.createElement(B.m$.div, iP({
                    ref: e
                }, r, {
                    className: (0, u.cx)("chakra-alert__title", r.className),
                    __css: t.title
                }));
            });
            var i9 = (0, B.Gp)(function(r, e) {
                var t = iM();
                var n = iP({
                    display: "inline"
                }, t.description);
                return i.createElement(B.m$.div, iP({
                    ref: e
                }, r, {
                    className: (0, u.cx)("chakra-alert__desc", r.className),
                    __css: n
                }));
            });
            var iU = function r(e) {
                var t = ij(), n = t.status;
                var o = iO[n].icon;
                var a = iM();
                var l = n === "loading" ? a.spinner : a.icon;
                return i.createElement(B.m$.span, iP({
                    display: "inherit"
                }, e, {
                    className: (0, u.cx)("chakra-alert__icon", e.className),
                    __css: l
                }), e.children || i.createElement(o, {
                    h: "100%",
                    w: "100%"
                }));
            };
            function iG(r, e) {
                if (r == null) return {};
                var t = {};
                var n = Object.keys(r);
                var o, a;
                for(a = 0; a < n.length; a++){
                    o = n[a];
                    if (e.indexOf(o) >= 0) continue;
                    t[o] = r[o];
                }
                return t;
            }
            function iJ() {
                iJ = Object.assign ? Object.assign.bind() : function(r) {
                    for(var e = 1; e < arguments.length; e++){
                        var t = arguments[e];
                        for(var n in t){
                            if (Object.prototype.hasOwnProperty.call(t, n)) {
                                r[n] = t[n];
                            }
                        }
                    }
                    return r;
                };
                return iJ.apply(this, arguments);
            }
            var iK = [
                "children",
                "isDisabled",
                "__css", 
            ];
            var iX = function r(e) {
                return i.createElement(iB.JO, iJ({
                    focusable: "false",
                    "aria-hidden": true
                }, e), i.createElement("path", {
                    fill: "currentColor",
                    d: "M.439,21.44a1.5,1.5,0,0,0,2.122,2.121L11.823,14.3a.25.25,0,0,1,.354,0l9.262,9.263a1.5,1.5,0,1,0,2.122-2.121L14.3,12.177a.25.25,0,0,1,0-.354l9.263-9.262A1.5,1.5,0,0,0,21.439.44L12.177,9.7a.25.25,0,0,1-.354,0L2.561.44A1.5,1.5,0,0,0,.439,2.561L9.7,11.823a.25.25,0,0,1,0,.354Z"
                }));
            };
            var iY = (0, B.Gp)(function(r, e) {
                var t = (0, B.mq)("CloseButton", r);
                var n = (0, B.Lr)(r), o = n.children, a = n.isDisabled, l = n.__css, $ = iG(n, iK);
                var s = {
                    outline: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                };
                return i.createElement(B.m$.button, iJ({
                    type: "button",
                    "aria-label": "Close",
                    ref: e,
                    disabled: a,
                    __css: iJ({}, s, t, l)
                }, $), o || i.createElement(iX, {
                    width: "1em",
                    height: "1em"
                }));
            });
            if (u.Ts) {
                iY.displayName = "CloseButton";
            }
            var iQ = t(5947);
            var lr = t(8970);
            var le = t(1190);
            function lt() {
                lt = Object.assign ? Object.assign.bind() : function(r) {
                    for(var e = 1; e < arguments.length; e++){
                        var t = arguments[e];
                        for(var n in t){
                            if (Object.prototype.hasOwnProperty.call(t, n)) {
                                r[n] = t[n];
                            }
                        }
                    }
                    return r;
                };
                return lt.apply(this, arguments);
            }
            function ln(r, e) {
                var t;
                var n = r != null ? r : "bottom";
                var o = {
                    "top-start": {
                        ltr: "top-left",
                        rtl: "top-right"
                    },
                    "top-end": {
                        ltr: "top-right",
                        rtl: "top-left"
                    },
                    "bottom-start": {
                        ltr: "bottom-left",
                        rtl: "bottom-right"
                    },
                    "bottom-end": {
                        ltr: "bottom-right",
                        rtl: "bottom-left"
                    }
                };
                var a = o[n];
                return (t = a == null ? void 0 : a[e]) != null ? t : n;
            }
            function lo(r, e) {
                var t = la(r, e);
                var n = t ? r[t].findIndex(function(r) {
                    return r.id === e;
                }) : -1;
                return {
                    position: t,
                    index: n
                };
            }
            var la = function r(e, t) {
                var n;
                return (n = Object.values(e).flat().find(function(r) {
                    return r.id === t;
                })) == null ? void 0 : n.position;
            };
            function li(r) {
                var e = r.includes("right");
                var t = r.includes("left");
                var n = "center";
                if (e) n = "flex-end";
                if (t) n = "flex-start";
                return {
                    display: "flex",
                    flexDirection: "column",
                    alignItems: n
                };
            }
            function ll(r) {
                var e = r === "top" || r === "bottom";
                var t = e ? "0 auto" : undefined;
                var n = r.includes("top") ? "env(safe-area-inset-top, 0px)" : undefined;
                var o = r.includes("bottom") ? "env(safe-area-inset-bottom, 0px)" : undefined;
                var a = !r.includes("left") ? "env(safe-area-inset-right, 0px)" : undefined;
                var i = !r.includes("right") ? "env(safe-area-inset-left, 0px)" : undefined;
                return {
                    position: "fixed",
                    zIndex: 5500,
                    pointerEvents: "none",
                    display: "flex",
                    flexDirection: "column",
                    margin: t,
                    top: n,
                    bottom: o,
                    right: a,
                    left: i
                };
            }
            var l$ = {
                top: [],
                "top-left": [],
                "top-right": [],
                "bottom-left": [],
                bottom: [],
                "bottom-right": []
            };
            var ls = lu(l$);
            function lu(r) {
                var e = r;
                var t = new Set();
                var n = function r(n) {
                    e = n(e);
                    t.forEach(function(r) {
                        return r();
                    });
                };
                return {
                    getState: function r() {
                        return e;
                    },
                    subscribe: function e(o) {
                        t.add(o);
                        return function() {
                            n(function() {
                                return r;
                            });
                            t["delete"](o);
                        };
                    },
                    removeToast: function r(e, t) {
                        n(function(r) {
                            var n;
                            return lt({}, r, ((n = {}), (n[t] = r[t].filter(function(r) {
                                return r.id != e;
                            })), n));
                        });
                    },
                    notify: function r(e, t) {
                        var o = ld(e, t);
                        var a = o.position, i = o.id;
                        n(function(r) {
                            var e, t, n;
                            var i = a.includes("top");
                            var l = i ? [
                                o
                            ].concat((e = r[a]) != null ? e : []) : [].concat((t = r[a]) != null ? t : [], [
                                o
                            ]);
                            return lt({}, r, ((n = {}), (n[a] = l), n));
                        });
                        return i;
                    },
                    update: function r(e, t) {
                        if (!e) return;
                        n(function(r) {
                            var n = lt({}, r);
                            var o = lo(n, e), a = o.position, i = o.index;
                            if (a && i !== -1) {
                                n[a][i] = lt({}, n[a][i], t, {
                                    message: lv(t)
                                });
                            }
                            return n;
                        });
                    },
                    closeAll: function r(e) {
                        var t = e === void 0 ? {} : e, o = t.positions;
                        n(function(r) {
                            var e = [
                                "bottom",
                                "bottom-right",
                                "bottom-left",
                                "top",
                                "top-left",
                                "top-right", 
                            ];
                            var t = o != null ? o : e;
                            return t.reduce(function(e, t) {
                                e[t] = r[t].map(function(r) {
                                    return lt({}, r, {
                                        requestClose: true
                                    });
                                });
                                return e;
                            }, lt({}, r));
                        });
                    },
                    close: function r(e) {
                        n(function(r) {
                            var t;
                            var n = la(r, e);
                            if (!n) return r;
                            return lt({}, r, ((t = {}), (t[n] = r[n].map(function(r) {
                                if (r.id == e) {
                                    return lt({}, r, {
                                        requestClose: true
                                    });
                                }
                                return r;
                            })), t));
                        });
                    },
                    isActive: function r(e) {
                        return Boolean(lo(ls.getState(), e).position);
                    }
                };
            }
            var lc = 0;
            function ld(r, e) {
                var t, n;
                if (e === void 0) {
                    e = {};
                }
                lc += 1;
                var o = (t = e.id) != null ? t : lc;
                var a = (n = e.position) != null ? n : "bottom";
                return {
                    id: o,
                    message: r,
                    position: a,
                    duration: e.duration,
                    onCloseComplete: e.onCloseComplete,
                    onRequestRemove: function r() {
                        return ls.removeToast(String(o), a);
                    },
                    status: e.status,
                    requestClose: false,
                    containerStyle: e.containerStyle
                };
            }
            var lf = function r(e) {
                var t = e.status, n = e.variant, o = n === void 0 ? "solid" : n, a = e.id, l = e.title, $ = e.isClosable, s = e.onClose, u = e.description, c = e.icon;
                var d = typeof a !== "undefined" ? "toast-" + a + "-title" : undefined;
                return i.createElement(iq, {
                    status: t,
                    variant: o,
                    id: String(a),
                    alignItems: "start",
                    borderRadius: "md",
                    boxShadow: "lg",
                    paddingEnd: 8,
                    textAlign: "start",
                    width: "auto",
                    "aria-labelledby": d
                }, i.createElement(iU, null, c), i.createElement(B.m$.div, {
                    flex: "1",
                    maxWidth: "100%"
                }, l && i.createElement(iZ, {
                    id: d
                }, l), u && i.createElement(i9, {
                    display: "block"
                }, u)), $ && i.createElement(iY, {
                    size: "sm",
                    onClick: s,
                    position: "absolute",
                    insetEnd: 1,
                    top: 1
                }));
            };
            function lv(r) {
                if (r === void 0) {
                    r = {};
                }
                var e = r, t = e.render, n = e.toastComponent, o = n === void 0 ? lf : n;
                var a = function e(n) {
                    if ((0, u.mf)(t)) {
                        return t(n);
                    }
                    return i.createElement(o, lt({}, n, r));
                };
                return a;
            }
            function lp(r, e) {
                var t = function t(n) {
                    var o;
                    return lt({}, e, n, {
                        position: ln((o = n == null ? void 0 : n.position) != null ? o : e == null ? void 0 : e.position, r)
                    });
                };
                var n = function r(e) {
                    var n = t(e);
                    var o = lv(n);
                    return ls.notify(o, n);
                };
                n.update = function(r, e) {
                    ls.update(r, t(e));
                };
                n.promise = function(r, e) {
                    var t = n(lt({}, e.loading, {
                        status: "loading",
                        duration: null
                    }));
                    r.then(function(r) {
                        return n.update(t, lt({
                            status: "success",
                            duration: 5000
                        }, runIfFn(e.success, r)));
                    })["catch"](function(r) {
                        return n.update(t, lt({
                            status: "error",
                            duration: 5000
                        }, runIfFn(e.error, r)));
                    });
                };
                n.closeAll = ls.closeAll;
                n.close = ls.close;
                n.isActive = ls.isActive;
                return n;
            }
            function lm(r) {
                var e = useChakra(), t = e.theme;
                return React.useMemo(function() {
                    return lp(t.direction, r);
                }, [
                    r,
                    t.direction
                ]);
            }
            var lh = {
                initial: function r(e) {
                    var t;
                    var n = e.position;
                    var o = [
                        "top",
                        "bottom"
                    ].includes(n) ? "y" : "x";
                    var a = [
                        "top-right",
                        "bottom-right"
                    ].includes(n) ? 1 : -1;
                    if (n === "bottom") a = 1;
                    return ((t = {
                        opacity: 0
                    }), (t[o] = a * 24), t);
                },
                animate: {
                    opacity: 1,
                    y: 0,
                    x: 0,
                    scale: 1,
                    transition: {
                        duration: 0.4,
                        ease: [
                            0.4,
                            0,
                            0.2,
                            1
                        ]
                    }
                },
                exit: {
                    opacity: 0,
                    scale: 0.85,
                    transition: {
                        duration: 0.2,
                        ease: [
                            0.4,
                            0,
                            1,
                            1
                        ]
                    }
                }
            };
            var lb = i.memo(function(r) {
                var e = r.id, t = r.message, n = r.onCloseComplete, o = r.onRequestRemove, a = r.requestClose, l = a === void 0 ? false : a, $ = r.position, s = $ === void 0 ? "bottom" : $, c = r.duration, f = c === void 0 ? 5000 : c, v = r.containerStyle, p = r.motionVariants, m = p === void 0 ? lh : p, h = r.toastSpacing, b = h === void 0 ? "0.5rem" : h;
                var g = i.useState(f), _ = g[0], x = g[1];
                var y = (0, iQ.hO)();
                (0, d.rf)(function() {
                    if (!y) {
                        n == null ? void 0 : n();
                    }
                }, [
                    y
                ]);
                (0, d.rf)(function() {
                    x(f);
                }, [
                    f
                ]);
                var w = function r() {
                    return x(null);
                };
                var S = function r() {
                    return x(f);
                };
                var k = function r() {
                    if (y) o();
                };
                i.useEffect(function() {
                    if (y && l) {
                        o();
                    }
                }, [
                    y,
                    l,
                    o
                ]);
                (0, d.KS)(k, _);
                var C = i.useMemo(function() {
                    return lt({
                        pointerEvents: "auto",
                        maxWidth: 560,
                        minWidth: 300,
                        margin: b
                    }, v);
                }, [
                    v,
                    b
                ]);
                var A = i.useMemo(function() {
                    return li(s);
                }, [
                    s
                ]);
                return i.createElement(lr.E.li, {
                    layout: true,
                    className: "chakra-toast",
                    variants: m,
                    initial: "initial",
                    animate: "animate",
                    exit: "exit",
                    onHoverStart: w,
                    onHoverEnd: S,
                    custom: {
                        position: s
                    },
                    style: A
                }, i.createElement(B.m$.div, {
                    role: "status",
                    "aria-atomic": "true",
                    className: "chakra-toast__inner",
                    __css: C
                }, (0, u.Pu)(t, {
                    id: e,
                    onClose: k
                })));
            });
            if (u.Ts) {
                lb.displayName = "ToastComponent";
            }
            var lg = function r(e) {
                var t = i.useSyncExternalStore(ls.subscribe, ls.getState, ls.getState);
                var n = e.children, o = e.motionVariants, a = e.component, l = a === void 0 ? lb : a, $ = e.portalProps;
                var s = (0, u.Yd)(t).map(function(r) {
                    var e = t[r];
                    return i.createElement("ul", {
                        role: "region",
                        "aria-live": "polite",
                        key: r,
                        id: "chakra-toast-manager-" + r,
                        style: ll(r)
                    }, i.createElement(le.M, {
                        initial: false
                    }, e.map(function(r) {
                        return i.createElement(l, lt({
                            key: r.id,
                            motionVariants: o
                        }, r));
                    })));
                });
                return i.createElement(i.Fragment, null, n, i.createElement(F, $, s));
            };
            var l_ = {
                duration: 5000,
                variant: "solid"
            };
            var l3 = {
                theme: i7,
                colorMode: "light",
                toggleColorMode: u.ZT,
                setColorMode: u.ZT,
                defaultOptions: l_
            };
            function l0(r) {
                var e = r === void 0 ? l3 : r, t = e.theme, n = t === void 0 ? l3.theme : t, o = e.colorMode, a = o === void 0 ? l3.colorMode : o, i = e.toggleColorMode, l = i === void 0 ? l3.toggleColorMode : i, $ = e.setColorMode, s = $ === void 0 ? l3.setColorMode : $, u = e.defaultOptions, c = u === void 0 ? l3.defaultOptions : u, d = e.motionVariants, f = e.toastSpacing, v = e.component;
                var p = {
                    colorMode: a,
                    setColorMode: s,
                    toggleColorMode: l
                };
                var m = function r() {
                    return React.createElement(ThemeProvider, {
                        theme: n
                    }, React.createElement(ColorModeContext.Provider, {
                        value: p
                    }, React.createElement(lg, {
                        defaultOptions: c,
                        motionVariants: d,
                        toastSpacing: f,
                        component: v
                    })));
                };
                return {
                    ToastContainer: m,
                    toast: lp(n.direction, c)
                };
            }
            function lx(r, e) {
                if (r == null) return {};
                var t = {};
                var n = Object.keys(r);
                var o, a;
                for(a = 0; a < n.length; a++){
                    o = n[a];
                    if (e.indexOf(o) >= 0) continue;
                    t[o] = r[o];
                }
                return t;
            }
            var ly = [
                "children",
                "toastOptions"
            ];
            var lw = function r(e) {
                var t = e.children, n = e.toastOptions, o = lx(e, ly);
                return i.createElement(V, o, t, i.createElement(lg, n));
            };
            lw.defaultProps = {
                theme: i7
            };
            function l2() {
                for(var r = arguments.length, e = new Array(r), t = 0; t < r; t++){
                    e[t] = arguments[t];
                }
                var n = [].concat(e);
                var o = e[e.length - 1];
                if (isChakraTheme(o) && n.length > 1) {
                    n = n.slice(0, n.length - 1);
                } else {
                    o = theme$1;
                }
                return pipe.apply(void 0, n.map(function(r) {
                    return function(e) {
                        return isFunction(r) ? r(e) : lS(e, r);
                    };
                }))(o);
            }
            function lS() {
                for(var r = arguments.length, e = new Array(r), t = 0; t < r; t++){
                    e[t] = arguments[t];
                }
                return mergeWith.apply(void 0, [
                    {}
                ].concat(e, [
                    l4
                ]));
            }
            function l4(r, e, t, n) {
                if ((isFunction(r) || isFunction(e)) && Object.prototype.hasOwnProperty.call(n, t)) {
                    return function() {
                        var t = isFunction(r) ? r.apply(void 0, arguments) : r;
                        var n = isFunction(e) ? e.apply(void 0, arguments) : e;
                        return mergeWith({}, t, n, l4);
                    };
                }
                return undefined;
            }
            function l1(r) {
                var e = r.colorScheme, t = r.components;
                return function(r) {
                    var n = Object.keys(r.components || {});
                    if (Array.isArray(t)) {
                        n = t;
                    } else if (isObject(t)) {
                        n = Object.keys(t);
                    }
                    return lS(r, {
                        components: fromEntries(n.map(function(r) {
                            var t = {
                                defaultProps: {
                                    colorScheme: e
                                }
                            };
                            return [
                                r,
                                t
                            ];
                        }))
                    });
                };
            }
            function l6(r) {
                var e = r.size, t = r.components;
                return function(r) {
                    var n = Object.keys(r.components || {});
                    if (Array.isArray(t)) {
                        n = t;
                    } else if (isObject(t)) {
                        n = Object.keys(t);
                    }
                    return lS(r, {
                        components: fromEntries(n.map(function(r) {
                            var t = {
                                defaultProps: {
                                    size: e
                                }
                            };
                            return [
                                r,
                                t
                            ];
                        }))
                    });
                };
            }
            function lk(r) {
                var e = r.variant, t = r.components;
                return function(r) {
                    var n = Object.keys(r.components || {});
                    if (Array.isArray(t)) {
                        n = t;
                    } else if (isObject(t)) {
                        n = Object.keys(t);
                    }
                    return lS(r, {
                        components: fromEntries(n.map(function(r) {
                            var t = {
                                defaultProps: {
                                    variant: e
                                }
                            };
                            return [
                                r,
                                t
                            ];
                        }))
                    });
                };
            }
            function l5(r) {
                var e = r.defaultProps, t = e.colorScheme, n = e.variant, o = e.size, a = r.components;
                var i = function r(e) {
                    return e;
                };
                var l = [
                    t ? l1({
                        colorScheme: t,
                        components: a
                    }) : i,
                    o ? l6({
                        size: o,
                        components: a
                    }) : i,
                    n ? lk({
                        variant: n,
                        components: a
                    }) : i, 
                ];
                return function(r) {
                    return lS(pipe.apply(void 0, l)(r));
                };
            }
            function l7(r) {
                var e = r.Component, t = r.pageProps;
                return (0, a.jsx)(lw, {
                    children: (0, a.jsx)(e, o({}, t))
                });
            }
            var lC = l7;
        }
    },
    function(r) {
        var e = function(e) {
            return r((r.s = e));
        };
        r.O(0, [
            774,
            179
        ], function() {
            return e(3837), e(387);
        });
        var t = r.O();
        _N_E = t;
    }, 
]);
