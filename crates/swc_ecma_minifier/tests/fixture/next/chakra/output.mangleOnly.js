(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
    [
        888
    ],
    {
        2260: function(r, e, n) {
            "use strict";
            n.r(e);
            n.d(e, {
                default: function() {
                    return lE;
                }
            });
            function t(r, e, n) {
                if (e in r) {
                    Object.defineProperty(r, e, {
                        value: n,
                        enumerable: true,
                        configurable: true,
                        writable: true
                    });
                } else {
                    r[e] = n;
                }
                return r;
            }
            function o(r) {
                for(var e = 1; e < arguments.length; e++){
                    var n = arguments[e] != null ? arguments[e] : {};
                    var o = Object.keys(n);
                    if (typeof Object.getOwnPropertySymbols === "function") {
                        o = o.concat(Object.getOwnPropertySymbols(n).filter(function(r) {
                            return Object.getOwnPropertyDescriptor(n, r).enumerable;
                        }));
                    }
                    o.forEach(function(e) {
                        t(r, e, n[e]);
                    });
                }
                return r;
            }
            var a = n(5893);
            var i = n(7294);
            var l = n(917);
            var u = function r() {
                return i.createElement(l.xB, {
                    styles: '\n      html {\n        line-height: 1.5;\n        -webkit-text-size-adjust: 100%;\n        font-family: system-ui, sans-serif;\n        -webkit-font-smoothing: antialiased;\n        text-rendering: optimizeLegibility;\n        -moz-osx-font-smoothing: grayscale;\n        touch-action: manipulation;\n      }\n\n      body {\n        position: relative;\n        min-height: 100%;\n        font-feature-settings: \'kern\';\n      }\n\n      *,\n      *::before,\n      *::after {\n        border-width: 0;\n        border-style: solid;\n        box-sizing: border-box;\n      }\n\n      main {\n        display: block;\n      }\n\n      hr {\n        border-top-width: 1px;\n        box-sizing: content-box;\n        height: 0;\n        overflow: visible;\n      }\n\n      pre,\n      code,\n      kbd,\n      samp {\n        font-family: SFMono-Regular,  Menlo, Monaco, Consolas, monospace;\n        font-size: 1em;\n      }\n\n      a {\n        background-color: transparent;\n        color: inherit;\n        text-decoration: inherit;\n      }\n\n      abbr[title] {\n        border-bottom: none;\n        text-decoration: underline;\n        -webkit-text-decoration: underline dotted;\n        text-decoration: underline dotted;\n      }\n\n      b,\n      strong {\n        font-weight: bold;\n      }\n\n      small {\n        font-size: 80%;\n      }\n\n      sub,\n      sup {\n        font-size: 75%;\n        line-height: 0;\n        position: relative;\n        vertical-align: baseline;\n      }\n\n      sub {\n        bottom: -0.25em;\n      }\n\n      sup {\n        top: -0.5em;\n      }\n\n      img {\n        border-style: none;\n      }\n\n      button,\n      input,\n      optgroup,\n      select,\n      textarea {\n        font-family: inherit;\n        font-size: 100%;\n        line-height: 1.15;\n        margin: 0;\n      }\n\n      button,\n      input {\n        overflow: visible;\n      }\n\n      button,\n      select {\n        text-transform: none;\n      }\n\n      button::-moz-focus-inner,\n      [type="button"]::-moz-focus-inner,\n      [type="reset"]::-moz-focus-inner,\n      [type="submit"]::-moz-focus-inner {\n        border-style: none;\n        padding: 0;\n      }\n\n      fieldset {\n        padding: 0.35em 0.75em 0.625em;\n      }\n\n      legend {\n        box-sizing: border-box;\n        color: inherit;\n        display: table;\n        max-width: 100%;\n        padding: 0;\n        white-space: normal;\n      }\n\n      progress {\n        vertical-align: baseline;\n      }\n\n      textarea {\n        overflow: auto;\n      }\n\n      [type="checkbox"],\n      [type="radio"] {\n        box-sizing: border-box;\n        padding: 0;\n      }\n\n      [type="number"]::-webkit-inner-spin-button,\n      [type="number"]::-webkit-outer-spin-button {\n        -webkit-appearance: none !important;\n      }\n\n      input[type="number"] {\n        -moz-appearance: textfield;\n      }\n\n      [type="search"] {\n        -webkit-appearance: textfield;\n        outline-offset: -2px;\n      }\n\n      [type="search"]::-webkit-search-decoration {\n        -webkit-appearance: none !important;\n      }\n\n      ::-webkit-file-upload-button {\n        -webkit-appearance: button;\n        font: inherit;\n      }\n\n      details {\n        display: block;\n      }\n\n      summary {\n        display: list-item;\n      }\n\n      template {\n        display: none;\n      }\n\n      [hidden] {\n        display: none !important;\n      }\n\n      body,\n      blockquote,\n      dl,\n      dd,\n      h1,\n      h2,\n      h3,\n      h4,\n      h5,\n      h6,\n      hr,\n      figure,\n      p,\n      pre {\n        margin: 0;\n      }\n\n      button {\n        background: transparent;\n        padding: 0;\n      }\n\n      fieldset {\n        margin: 0;\n        padding: 0;\n      }\n\n      ol,\n      ul {\n        margin: 0;\n        padding: 0;\n      }\n\n      textarea {\n        resize: vertical;\n      }\n\n      button,\n      [role="button"] {\n        cursor: pointer;\n      }\n\n      button::-moz-focus-inner {\n        border: 0 !important;\n      }\n\n      table {\n        border-collapse: collapse;\n      }\n\n      h1,\n      h2,\n      h3,\n      h4,\n      h5,\n      h6 {\n        font-size: inherit;\n        font-weight: inherit;\n      }\n\n      button,\n      input,\n      optgroup,\n      select,\n      textarea {\n        padding: 0;\n        line-height: inherit;\n        color: inherit;\n      }\n\n      img,\n      svg,\n      video,\n      canvas,\n      audio,\n      iframe,\n      embed,\n      object {\n        display: block;\n      }\n\n      img,\n      video {\n        max-width: 100%;\n        height: auto;\n      }\n\n      [data-js-focus-visible] :focus:not([data-focus-visible-added]):not([data-focus-visible-disabled]) {\n        outline: none;\n        box-shadow: none;\n      }\n\n      select::-ms-expand {\n        display: none;\n      }\n    '
                });
            };
            var s = u;
            var c = n(5031);
            var v = n(6450);
            var d = n(7375);
            var f = n(4697);
            var $ = n(3935);
            var h = (0, v.kr)({
                strict: false,
                name: "PortalManagerContext"
            }), p = h[0], b = h[1];
            function g(r) {
                var e = r.children, n = r.zIndex;
                return i.createElement(p, {
                    value: {
                        zIndex: n
                    }
                }, e);
            }
            if (c.Ts) {
                g.displayName = "PortalManager";
            }
            function m() {
                m = Object.assign ? Object.assign.bind() : function(r) {
                    for(var e = 1; e < arguments.length; e++){
                        var n = arguments[e];
                        for(var t in n){
                            if (Object.prototype.hasOwnProperty.call(n, t)) {
                                r[t] = n[t];
                            }
                        }
                    }
                    return r;
                };
                return m.apply(this, arguments);
            }
            function y(r, e) {
                if (r == null) return {};
                var n = {};
                var t = Object.keys(r);
                var o, a;
                for(a = 0; a < t.length; a++){
                    o = t[a];
                    if (e.indexOf(o) >= 0) continue;
                    n[o] = r[o];
                }
                return n;
            }
            var x = [
                "containerRef"
            ];
            var _ = (0, v.kr)({
                strict: false,
                name: "PortalContext"
            }), S = _[0], w = _[1];
            var k = "chakra-portal";
            var z = ".chakra-portal";
            var C = function r(e) {
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
            var E = function r(e) {
                var n = e.appendToParentPortal, t = e.children;
                var o = i.useRef(null);
                var a = i.useRef(null);
                var l = (0, d.NW)();
                var u = w();
                var s = b();
                (0, f.a)(function() {
                    if (!o.current) return;
                    var r = o.current.ownerDocument;
                    var e = n ? u != null ? u : r.body : r.body;
                    if (!e) return;
                    a.current = r.createElement("div");
                    a.current.className = k;
                    e.appendChild(a.current);
                    l();
                    var t = a.current;
                    return function() {
                        if (e.contains(t)) {
                            e.removeChild(t);
                        }
                    };
                }, []);
                var c = s != null && s.zIndex ? i.createElement(C, {
                    zIndex: s == null ? void 0 : s.zIndex
                }, t) : t;
                return a.current ? (0, $.createPortal)(i.createElement(S, {
                    value: a.current
                }, c), a.current) : i.createElement("span", {
                    ref: o
                });
            };
            var P = function r(e) {
                var n = e.children, t = e.containerRef, o = e.appendToParentPortal;
                var a = t.current;
                var l = a != null ? a : c.jU ? document.body : undefined;
                var u = i.useMemo(function() {
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
                    if (!u || !l) return;
                    l.appendChild(u);
                    return function() {
                        l.removeChild(u);
                    };
                }, [
                    u,
                    l
                ]);
                if (l && u) {
                    return (0, $.createPortal)(i.createElement(S, {
                        value: o ? u : null
                    }, n), u);
                }
                return null;
            };
            function R(r) {
                var e = r.containerRef, n = y(r, x);
                return e ? i.createElement(P, m({
                    containerRef: e
                }, n)) : i.createElement(E, n);
            }
            R.defaultProps = {
                appendToParentPortal: true
            };
            R.className = k;
            R.selector = z;
            if (c.Ts) {
                R.displayName = "Portal";
            }
            var H = n(2846);
            var B = n(949);
            var A = {
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
            var W = A;
            var T = function r() {};
            var I = {
                document: W,
                navigator: {
                    userAgent: ""
                },
                CustomEvent: function r() {
                    return this;
                },
                addEventListener: T,
                removeEventListener: T,
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
                        addListener: T,
                        removeListener: T
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
                clearTimeout: T,
                setInterval: function r() {
                    return 0;
                },
                clearInterval: T
            };
            var N = I;
            var D = {
                window: N,
                document: W
            };
            var O = c.jU ? {
                window: window,
                document: document
            } : D;
            var F = (0, i.createContext)(O);
            if (c.Ts) {
                F.displayName = "EnvironmentContext";
            }
            function V() {
                return useContext(F);
            }
            function M(r) {
                var e = r.children, n = r.environment;
                var t = (0, i.useState)(null), o = t[0], a = t[1];
                var l = (0, i.useMemo)(function() {
                    var r;
                    var e = o == null ? void 0 : o.ownerDocument;
                    var t = o == null ? void 0 : o.ownerDocument.defaultView;
                    var a = e ? {
                        document: e,
                        window: t
                    } : undefined;
                    var i = (r = n != null ? n : a) != null ? r : O;
                    return i;
                }, [
                    o,
                    n
                ]);
                return i.createElement(F.Provider, {
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
            if (c.Ts) {
                M.displayName = "EnvironmentProvider";
            }
            var q = function r(e) {
                var n = e.children, t = e.colorModeManager, o = e.portalZIndex, a = e.resetCSS, l = a === void 0 ? true : a, u = e.theme, c = u === void 0 ? {} : u, v = e.environment, d = e.cssVarsRoot;
                var f = i.createElement(M, {
                    environment: v
                }, n);
                return i.createElement(H.f6, {
                    theme: c,
                    cssVarsRoot: d
                }, i.createElement(B.SG, {
                    colorModeManager: t,
                    options: c.config
                }, l && i.createElement(s, null), i.createElement(H.ZL, null), o ? i.createElement(g, {
                    zIndex: o
                }, f) : f));
            };
            var L = {
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
            function j() {
                j = Object.assign ? Object.assign.bind() : function(r) {
                    for(var e = 1; e < arguments.length; e++){
                        var n = arguments[e];
                        for(var t in n){
                            if (Object.prototype.hasOwnProperty.call(n, t)) {
                                r[t] = n[t];
                            }
                        }
                    }
                    return r;
                };
                return j.apply(this, arguments);
            }
            var G = {
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
            var Z = {
                sm: "640px",
                md: "768px",
                lg: "1024px",
                xl: "1280px"
            };
            var J = j({}, L, G, {
                container: Z
            });
            function K(r, e) {
                if (Y(r)) {
                    r = "100%";
                }
                var n = Q(r);
                r = e === 360 ? r : Math.min(e, Math.max(0, parseFloat(r)));
                if (n) {
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
            function U(r) {
                return Math.min(1, Math.max(0, r));
            }
            function Y(r) {
                return (typeof r === "string" && r.indexOf(".") !== -1 && parseFloat(r) === 1);
            }
            function Q(r) {
                return typeof r === "string" && r.indexOf("%") !== -1;
            }
            function X(r) {
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
            function rn(r, e, n) {
                return {
                    r: K(r, 255) * 255,
                    g: K(e, 255) * 255,
                    b: K(n, 255) * 255
                };
            }
            function rt(r, e, n) {
                r = K(r, 255);
                e = K(e, 255);
                n = K(n, 255);
                var t = Math.max(r, e, n);
                var o = Math.min(r, e, n);
                var a = 0;
                var i = 0;
                var l = (t + o) / 2;
                if (t === o) {
                    i = 0;
                    a = 0;
                } else {
                    var u = t - o;
                    i = l > 0.5 ? u / (2 - t - o) : u / (t + o);
                    switch(t){
                        case r:
                            a = (e - n) / u + (e < n ? 6 : 0);
                            break;
                        case e:
                            a = (n - r) / u + 2;
                            break;
                        case n:
                            a = (r - e) / u + 4;
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
            function ro(r, e, n) {
                if (n < 0) {
                    n += 1;
                }
                if (n > 1) {
                    n -= 1;
                }
                if (n < 1 / 6) {
                    return r + (e - r) * (6 * n);
                }
                if (n < 1 / 2) {
                    return e;
                }
                if (n < 2 / 3) {
                    return r + (e - r) * (2 / 3 - n) * 6;
                }
                return r;
            }
            function ra(r, e, n) {
                var t;
                var o;
                var a;
                r = K(r, 360);
                e = K(e, 100);
                n = K(n, 100);
                if (e === 0) {
                    o = n;
                    a = n;
                    t = n;
                } else {
                    var i = n < 0.5 ? n * (1 + e) : n + e - n * e;
                    var l = 2 * n - i;
                    t = ro(l, i, r + 1 / 3);
                    o = ro(l, i, r);
                    a = ro(l, i, r - 1 / 3);
                }
                return {
                    r: t * 255,
                    g: o * 255,
                    b: a * 255
                };
            }
            function ri(r, e, n) {
                r = K(r, 255);
                e = K(e, 255);
                n = K(n, 255);
                var t = Math.max(r, e, n);
                var o = Math.min(r, e, n);
                var a = 0;
                var i = t;
                var l = t - o;
                var u = t === 0 ? 0 : l / t;
                if (t === o) {
                    a = 0;
                } else {
                    switch(t){
                        case r:
                            a = (e - n) / l + (e < n ? 6 : 0);
                            break;
                        case e:
                            a = (n - r) / l + 2;
                            break;
                        case n:
                            a = (r - e) / l + 4;
                            break;
                        default:
                            break;
                    }
                    a /= 6;
                }
                return {
                    h: a,
                    s: u,
                    v: i
                };
            }
            function rl(r, e, n) {
                r = K(r, 360) * 6;
                e = K(e, 100);
                n = K(n, 100);
                var t = Math.floor(r);
                var o = r - t;
                var a = n * (1 - e);
                var i = n * (1 - o * e);
                var l = n * (1 - (1 - o) * e);
                var u = t % 6;
                var s = [
                    n,
                    i,
                    a,
                    a,
                    l,
                    n
                ][u];
                var c = [
                    l,
                    n,
                    n,
                    i,
                    a,
                    a
                ][u];
                var v = [
                    a,
                    a,
                    l,
                    n,
                    n,
                    i
                ][u];
                return {
                    r: s * 255,
                    g: c * 255,
                    b: v * 255
                };
            }
            function ru(r, e, n, t) {
                var o = [
                    re(Math.round(r).toString(16)),
                    re(Math.round(e).toString(16)),
                    re(Math.round(n).toString(16)), 
                ];
                if (t && o[0].startsWith(o[0].charAt(1)) && o[1].startsWith(o[1].charAt(1)) && o[2].startsWith(o[2].charAt(1))) {
                    return (o[0].charAt(0) + o[1].charAt(0) + o[2].charAt(0));
                }
                return o.join("");
            }
            function rs(r, e, n, t, o) {
                var a = [
                    re(Math.round(r).toString(16)),
                    re(Math.round(e).toString(16)),
                    re(Math.round(n).toString(16)),
                    re(rv(t)), 
                ];
                if (o && a[0].startsWith(a[0].charAt(1)) && a[1].startsWith(a[1].charAt(1)) && a[2].startsWith(a[2].charAt(1)) && a[3].startsWith(a[3].charAt(1))) {
                    return (a[0].charAt(0) + a[1].charAt(0) + a[2].charAt(0) + a[3].charAt(0));
                }
                return a.join("");
            }
            function rc(r, e, n, t) {
                var o = [
                    pad2(rv(t)),
                    pad2(Math.round(r).toString(16)),
                    pad2(Math.round(e).toString(16)),
                    pad2(Math.round(n).toString(16)), 
                ];
                return o.join("");
            }
            function rv(r) {
                return Math.round(parseFloat(r) * 255).toString(16);
            }
            function rd(r) {
                return rf(r) / 255;
            }
            function rf(r) {
                return parseInt(r, 16);
            }
            function r$(r) {
                return {
                    r: r >> 16,
                    g: (r & 0xff00) >> 8,
                    b: r & 0xff
                };
            }
            var rh = {
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
            function rp(r) {
                var e = {
                    r: 0,
                    g: 0,
                    b: 0
                };
                var n = 1;
                var t = null;
                var o = null;
                var a = null;
                var i = false;
                var l = false;
                if (typeof r === "string") {
                    r = rS(r);
                }
                if (typeof r === "object") {
                    if (rw(r.r) && rw(r.g) && rw(r.b)) {
                        e = rn(r.r, r.g, r.b);
                        i = true;
                        l = String(r.r).substr(-1) === "%" ? "prgb" : "rgb";
                    } else if (rw(r.h) && rw(r.s) && rw(r.v)) {
                        t = rr(r.s);
                        o = rr(r.v);
                        e = rl(r.h, t, o);
                        i = true;
                        l = "hsv";
                    } else if (rw(r.h) && rw(r.s) && rw(r.l)) {
                        t = rr(r.s);
                        a = rr(r.l);
                        e = ra(r.h, t, a);
                        i = true;
                        l = "hsl";
                    }
                    if (Object.prototype.hasOwnProperty.call(r, "a")) {
                        n = r.a;
                    }
                }
                n = X(n);
                return {
                    ok: i,
                    format: r.format || l,
                    r: Math.min(255, Math.max(e.r, 0)),
                    g: Math.min(255, Math.max(e.g, 0)),
                    b: Math.min(255, Math.max(e.b, 0)),
                    a: n
                };
            }
            var rb = "[-\\+]?\\d+%?";
            var rg = "[-\\+]?\\d*\\.\\d+%?";
            var rm = "(?:".concat(rg, ")|(?:").concat(rb, ")");
            var ry = "[\\s|\\(]+(".concat(rm, ")[,|\\s]+(").concat(rm, ")[,|\\s]+(").concat(rm, ")\\s*\\)?");
            var rx = "[\\s|\\(]+(".concat(rm, ")[,|\\s]+(").concat(rm, ")[,|\\s]+(").concat(rm, ")[,|\\s]+(").concat(rm, ")\\s*\\)?");
            var r_ = {
                CSS_UNIT: new RegExp(rm),
                rgb: new RegExp("rgb" + ry),
                rgba: new RegExp("rgba" + rx),
                hsl: new RegExp("hsl" + ry),
                hsla: new RegExp("hsla" + rx),
                hsv: new RegExp("hsv" + ry),
                hsva: new RegExp("hsva" + rx),
                hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
                hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
                hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
                hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
            };
            function rS(r) {
                r = r.trim().toLowerCase();
                if (r.length === 0) {
                    return false;
                }
                var e = false;
                if (rh[r]) {
                    r = rh[r];
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
                var n = r_.rgb.exec(r);
                if (n) {
                    return {
                        r: n[1],
                        g: n[2],
                        b: n[3]
                    };
                }
                n = r_.rgba.exec(r);
                if (n) {
                    return {
                        r: n[1],
                        g: n[2],
                        b: n[3],
                        a: n[4]
                    };
                }
                n = r_.hsl.exec(r);
                if (n) {
                    return {
                        h: n[1],
                        s: n[2],
                        l: n[3]
                    };
                }
                n = r_.hsla.exec(r);
                if (n) {
                    return {
                        h: n[1],
                        s: n[2],
                        l: n[3],
                        a: n[4]
                    };
                }
                n = r_.hsv.exec(r);
                if (n) {
                    return {
                        h: n[1],
                        s: n[2],
                        v: n[3]
                    };
                }
                n = r_.hsva.exec(r);
                if (n) {
                    return {
                        h: n[1],
                        s: n[2],
                        v: n[3],
                        a: n[4]
                    };
                }
                n = r_.hex8.exec(r);
                if (n) {
                    return {
                        r: rf(n[1]),
                        g: rf(n[2]),
                        b: rf(n[3]),
                        a: rd(n[4]),
                        format: e ? "name" : "hex8"
                    };
                }
                n = r_.hex6.exec(r);
                if (n) {
                    return {
                        r: rf(n[1]),
                        g: rf(n[2]),
                        b: rf(n[3]),
                        format: e ? "name" : "hex"
                    };
                }
                n = r_.hex4.exec(r);
                if (n) {
                    return {
                        r: rf(n[1] + n[1]),
                        g: rf(n[2] + n[2]),
                        b: rf(n[3] + n[3]),
                        a: rd(n[4] + n[4]),
                        format: e ? "name" : "hex8"
                    };
                }
                n = r_.hex3.exec(r);
                if (n) {
                    return {
                        r: rf(n[1] + n[1]),
                        g: rf(n[2] + n[2]),
                        b: rf(n[3] + n[3]),
                        format: e ? "name" : "hex"
                    };
                }
                return false;
            }
            function rw(r) {
                return Boolean(r_.CSS_UNIT.exec(String(r)));
            }
            var r0 = (function() {
                function r(e, n) {
                    if (e === void 0) {
                        e = "";
                    }
                    if (n === void 0) {
                        n = {};
                    }
                    var t;
                    if (e instanceof r) {
                        return e;
                    }
                    if (typeof e === "number") {
                        e = r$(e);
                    }
                    this.originalInput = e;
                    var o = rp(e);
                    this.originalInput = e;
                    this.r = o.r;
                    this.g = o.g;
                    this.b = o.b;
                    this.a = o.a;
                    this.roundA = Math.round(100 * this.a) / 100;
                    this.format = (t = n.format) !== null && t !== void 0 ? t : o.format;
                    this.gradientType = n.gradientType;
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
                    var n;
                    var t;
                    var o = r.r / 255;
                    var a = r.g / 255;
                    var i = r.b / 255;
                    if (o <= 0.03928) {
                        e = o / 12.92;
                    } else {
                        e = Math.pow((o + 0.055) / 1.055, 2.4);
                    }
                    if (a <= 0.03928) {
                        n = a / 12.92;
                    } else {
                        n = Math.pow((a + 0.055) / 1.055, 2.4);
                    }
                    if (i <= 0.03928) {
                        t = i / 12.92;
                    } else {
                        t = Math.pow((i + 0.055) / 1.055, 2.4);
                    }
                    return 0.2126 * e + 0.7152 * n + 0.0722 * t;
                };
                r.prototype.getAlpha = function() {
                    return this.a;
                };
                r.prototype.setAlpha = function(r) {
                    this.a = X(r);
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
                    var n = Math.round(r.s * 100);
                    var t = Math.round(r.v * 100);
                    return this.a === 1 ? "hsv(".concat(e, ", ").concat(n, "%, ").concat(t, "%)") : "hsva(".concat(e, ", ").concat(n, "%, ").concat(t, "%, ").concat(this.roundA, ")");
                };
                r.prototype.toHsl = function() {
                    var r = rt(this.r, this.g, this.b);
                    return {
                        h: r.h * 360,
                        s: r.s,
                        l: r.l,
                        a: this.a
                    };
                };
                r.prototype.toHslString = function() {
                    var r = rt(this.r, this.g, this.b);
                    var e = Math.round(r.h * 360);
                    var n = Math.round(r.s * 100);
                    var t = Math.round(r.l * 100);
                    return this.a === 1 ? "hsl(".concat(e, ", ").concat(n, "%, ").concat(t, "%)") : "hsla(".concat(e, ", ").concat(n, "%, ").concat(t, "%, ").concat(this.roundA, ")");
                };
                r.prototype.toHex = function(r) {
                    if (r === void 0) {
                        r = false;
                    }
                    return ru(this.r, this.g, this.b, r);
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
                    var n = Math.round(this.b);
                    return this.a === 1 ? "rgb(".concat(r, ", ").concat(e, ", ").concat(n, ")") : "rgba(".concat(r, ", ").concat(e, ", ").concat(n, ", ").concat(this.roundA, ")");
                };
                r.prototype.toPercentageRgb = function() {
                    var r = function(r) {
                        return "".concat(Math.round(K(r, 255) * 100), "%");
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
                        return Math.round(K(r, 255) * 100);
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
                    var r = "#" + ru(this.r, this.g, this.b, false);
                    for(var e = 0, n = Object.entries(rh); e < n.length; e++){
                        var t = n[e], o = t[0], a = t[1];
                        if (r === a) {
                            return o;
                        }
                    }
                    return false;
                };
                r.prototype.toString = function(r) {
                    var e = Boolean(r);
                    r = r !== null && r !== void 0 ? r : this.format;
                    var n = false;
                    var t = this.a < 1 && this.a >= 0;
                    var o = !e && t && (r.startsWith("hex") || r === "name");
                    if (o) {
                        if (r === "name" && this.a === 0) {
                            return this.toName();
                        }
                        return this.toRgbString();
                    }
                    if (r === "rgb") {
                        n = this.toRgbString();
                    }
                    if (r === "prgb") {
                        n = this.toPercentageRgbString();
                    }
                    if (r === "hex" || r === "hex6") {
                        n = this.toHexString();
                    }
                    if (r === "hex3") {
                        n = this.toHexString(true);
                    }
                    if (r === "hex4") {
                        n = this.toHex8String(true);
                    }
                    if (r === "hex8") {
                        n = this.toHex8String();
                    }
                    if (r === "name") {
                        n = this.toName();
                    }
                    if (r === "hsl") {
                        n = this.toHslString();
                    }
                    if (r === "hsv") {
                        n = this.toHsvString();
                    }
                    return n || this.toHexString();
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
                    var n = this.toHsl();
                    n.l += e / 100;
                    n.l = U(n.l);
                    return new r(n);
                };
                r.prototype.brighten = function(e) {
                    if (e === void 0) {
                        e = 10;
                    }
                    var n = this.toRgb();
                    n.r = Math.max(0, Math.min(255, n.r - Math.round(255 * -(e / 100))));
                    n.g = Math.max(0, Math.min(255, n.g - Math.round(255 * -(e / 100))));
                    n.b = Math.max(0, Math.min(255, n.b - Math.round(255 * -(e / 100))));
                    return new r(n);
                };
                r.prototype.darken = function(e) {
                    if (e === void 0) {
                        e = 10;
                    }
                    var n = this.toHsl();
                    n.l -= e / 100;
                    n.l = U(n.l);
                    return new r(n);
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
                    var n = this.toHsl();
                    n.s -= e / 100;
                    n.s = U(n.s);
                    return new r(n);
                };
                r.prototype.saturate = function(e) {
                    if (e === void 0) {
                        e = 10;
                    }
                    var n = this.toHsl();
                    n.s += e / 100;
                    n.s = U(n.s);
                    return new r(n);
                };
                r.prototype.greyscale = function() {
                    return this.desaturate(100);
                };
                r.prototype.spin = function(e) {
                    var n = this.toHsl();
                    var t = (n.h + e) % 360;
                    n.h = t < 0 ? 360 + t : t;
                    return new r(n);
                };
                r.prototype.mix = function(e, n) {
                    if (n === void 0) {
                        n = 50;
                    }
                    var t = this.toRgb();
                    var o = new r(e).toRgb();
                    var a = n / 100;
                    var i = {
                        r: (o.r - t.r) * a + t.r,
                        g: (o.g - t.g) * a + t.g,
                        b: (o.b - t.b) * a + t.b,
                        a: (o.a - t.a) * a + t.a
                    };
                    return new r(i);
                };
                r.prototype.analogous = function(e, n) {
                    if (e === void 0) {
                        e = 6;
                    }
                    if (n === void 0) {
                        n = 30;
                    }
                    var t = this.toHsl();
                    var o = 360 / n;
                    var a = [
                        this
                    ];
                    for(t.h = (t.h - ((o * e) >> 1) + 720) % 360; --e;){
                        t.h = (t.h + o) % 360;
                        a.push(new r(t));
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
                    var n = this.toHsv();
                    var t = n.h;
                    var o = n.s;
                    var a = n.v;
                    var i = [];
                    var l = 1 / e;
                    while(e--){
                        i.push(new r({
                            h: t,
                            s: o,
                            v: a
                        }));
                        a = (a + l) % 1;
                    }
                    return i;
                };
                r.prototype.splitcomplement = function() {
                    var e = this.toHsl();
                    var n = e.h;
                    return [
                        this,
                        new r({
                            h: (n + 72) % 360,
                            s: e.s,
                            l: e.l
                        }),
                        new r({
                            h: (n + 216) % 360,
                            s: e.s,
                            l: e.l
                        }), 
                    ];
                };
                r.prototype.onBackground = function(e) {
                    var n = this.toRgb();
                    var t = new r(e).toRgb();
                    return new r({
                        r: t.r + (n.r - t.r) * n.a,
                        g: t.g + (n.g - t.g) * n.a,
                        b: t.b + (n.b - t.b) * n.a
                    });
                };
                r.prototype.triad = function() {
                    return this.polyad(3);
                };
                r.prototype.tetrad = function() {
                    return this.polyad(4);
                };
                r.prototype.polyad = function(e) {
                    var n = this.toHsl();
                    var t = n.h;
                    var o = [
                        this
                    ];
                    var a = 360 / e;
                    for(var i = 1; i < e; i++){
                        o.push(new r({
                            h: (t + i * a) % 360,
                            s: n.s,
                            l: n.l
                        }));
                    }
                    return o;
                };
                r.prototype.equals = function(e) {
                    return (this.toRgbString() === new r(e).toRgbString());
                };
                return r;
            })();
            function r3(r, e) {
                if (r === void 0) {
                    r = "";
                }
                if (e === void 0) {
                    e = {};
                }
                return new r0(r, e);
            }
            function rk(r) {
                if (r === void 0) {
                    r = {};
                }
                if (r.count !== undefined && r.count !== null) {
                    var e = r.count;
                    var n = [];
                    r.count = undefined;
                    while(e > n.length){
                        r.count = null;
                        if (r.seed) {
                            r.seed += 1;
                        }
                        n.push(rk(r));
                    }
                    r.count = e;
                    return n;
                }
                var t = rz(r.hue, r.seed);
                var o = r1(t, r);
                var a = r4(t, o, r);
                var i = {
                    h: t,
                    s: o,
                    v: a
                };
                if (r.alpha !== undefined) {
                    i.a = r.alpha;
                }
                return new r0(i);
            }
            function rz(r, e) {
                var n = rC(r);
                var t = rE(n, e);
                if (t < 0) {
                    t = 360 + t;
                }
                return t;
            }
            function r1(r, e) {
                if (e.hue === "monochrome") {
                    return 0;
                }
                if (e.luminosity === "random") {
                    return rE([
                        0,
                        100
                    ], e.seed);
                }
                var n = r2(r).saturationRange;
                var t = n[0];
                var o = n[1];
                switch(e.luminosity){
                    case "bright":
                        t = 55;
                        break;
                    case "dark":
                        t = o - 10;
                        break;
                    case "light":
                        o = 55;
                        break;
                    default:
                        break;
                }
                return rE([
                    t,
                    o
                ], e.seed);
            }
            function r4(r, e, n) {
                var t = r8(r, e);
                var o = 100;
                switch(n.luminosity){
                    case "dark":
                        o = t + 20;
                        break;
                    case "light":
                        t = (o + t) / 2;
                        break;
                    case "random":
                        t = 0;
                        o = 100;
                        break;
                    default:
                        break;
                }
                return rE([
                    t,
                    o
                ], n.seed);
            }
            function r8(r, e) {
                var n = r2(r).lowerBounds;
                for(var t = 0; t < n.length - 1; t++){
                    var o = n[t][0];
                    var a = n[t][1];
                    var i = n[t + 1][0];
                    var l = n[t + 1][1];
                    if (e >= o && e <= i) {
                        var u = (l - a) / (i - o);
                        var s = a - u * o;
                        return u * e + s;
                    }
                }
                return 0;
            }
            function rC(r) {
                var e = parseInt(r, 10);
                if (!Number.isNaN(e) && e < 360 && e > 0) {
                    return [
                        e,
                        e
                    ];
                }
                if (typeof r === "string") {
                    var n = rP.find(function(e) {
                        return e.name === r;
                    });
                    if (n) {
                        var t = r6(n);
                        if (t.hueRange) {
                            return t.hueRange;
                        }
                    }
                    var o = new r0(r);
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
            function r2(r) {
                if (r >= 334 && r <= 360) {
                    r -= 360;
                }
                for(var e = 0, n = rP; e < n.length; e++){
                    var t = n[e];
                    var o = r6(t);
                    if (o.hueRange && r >= o.hueRange[0] && r <= o.hueRange[1]) {
                        return o;
                    }
                }
                throw Error("Color not found");
            }
            function rE(r, e) {
                if (e === undefined) {
                    return Math.floor(r[0] + Math.random() * (r[1] + 1 - r[0]));
                }
                var n = r[1] || 1;
                var t = r[0] || 0;
                e = (e * 9301 + 49297) % 233280;
                var o = e / 233280.0;
                return Math.floor(t + o * (n - t));
            }
            function r6(r) {
                var e = r.lowerBounds[0][0];
                var n = r.lowerBounds[r.lowerBounds.length - 1][0];
                var t = r.lowerBounds[r.lowerBounds.length - 1][1];
                var o = r.lowerBounds[0][1];
                return {
                    name: r.name,
                    hueRange: r.hueRange,
                    lowerBounds: r.lowerBounds,
                    saturationRange: [
                        e,
                        n
                    ],
                    brightnessRange: [
                        t,
                        o
                    ]
                };
            }
            var rP = [
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
            var rR = function r(e, n, t) {
                var o = (0, c.Wf)(e, "colors." + n, n);
                var a = new r0(o), i = a.isValid;
                return i ? o : t;
            };
            var r7 = function r(e) {
                return function(r) {
                    var n = rR(r, e);
                    var t = new r0(n).isDark();
                    return t ? "dark" : "light";
                };
            };
            var rH = function r(e) {
                return function(r) {
                    return r7(e)(r) === "dark";
                };
            };
            var rB = function r(e) {
                return function(r) {
                    return r7(e)(r) === "light";
                };
            };
            var rA = function r(e, n) {
                return function(r) {
                    var t = rR(r, e);
                    return new r0(t).setAlpha(n).toRgbString();
                };
            };
            var r5 = function r(e, n) {
                return function(r) {
                    var t = rR(r, e);
                    return new TinyColor(t).mix("#fff", n).toHexString();
                };
            };
            var rW = function r(e, n) {
                return function(r) {
                    var t = rR(r, e);
                    return new TinyColor(t).mix("#000", n).toHexString();
                };
            };
            var rT = function r(e, n) {
                return function(r) {
                    var t = rR(r, e);
                    return new TinyColor(t).darken(n).toHexString();
                };
            };
            var rI = function r(e, n) {
                return function(r) {
                    return new TinyColor(rR(r, e)).lighten(n).toHexString();
                };
            };
            var rN = function r(e, n) {
                return function(r) {
                    return readability(rR(r, n), rR(r, e));
                };
            };
            var rD = function r(e, n, t) {
                return function(r) {
                    return isReadable(rR(r, n), rR(r, e), t);
                };
            };
            var rO = function r(e) {
                return function(r) {
                    return new TinyColor(rR(r, e)).complement().toHexString();
                };
            };
            function rF(r, e) {
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
            function rV(r) {
                var e = rk().toHexString();
                if (!r || (0, c.Qr)(r)) {
                    return e;
                }
                if (r.string && r.colors) {
                    return rq(r.string, r.colors);
                }
                if (r.string && !r.colors) {
                    return rM(r.string);
                }
                if (r.colors && !r.string) {
                    return rL(r.colors);
                }
                return e;
            }
            function rM(r) {
                var e = 0;
                if (r.length === 0) return e.toString();
                for(var n = 0; n < r.length; n += 1){
                    e = r.charCodeAt(n) + ((e << 5) - e);
                    e = e & e;
                }
                var t = "#";
                for(var o = 0; o < 3; o += 1){
                    var a = (e >> (o * 8)) & 255;
                    t += ("00" + a.toString(16)).substr(-2);
                }
                return t;
            }
            function rq(r, e) {
                var n = 0;
                if (r.length === 0) return e[0];
                for(var t = 0; t < r.length; t += 1){
                    n = r.charCodeAt(t) + ((n << 5) - n);
                    n = n & n;
                }
                n = ((n % e.length) + e.length) % e.length;
                return e[n];
            }
            function rL(r) {
                return r[Math.floor(Math.random() * r.length)];
            }
            function rj(r, e) {
                return function(n) {
                    return n.colorMode === "dark" ? e : r;
                };
            }
            function r9(r) {
                var e = r.orientation, n = r.vertical, t = r.horizontal;
                if (!e) return {};
                return e === "vertical" ? n : t;
            }
            function rG() {
                rG = Object.assign ? Object.assign.bind() : function(r) {
                    for(var e = 1; e < arguments.length; e++){
                        var n = arguments[e];
                        for(var t in n){
                            if (Object.prototype.hasOwnProperty.call(n, t)) {
                                r[t] = n[t];
                            }
                        }
                    }
                    return r;
                };
                return rG.apply(this, arguments);
            }
            var rZ = function r(e) {
                (0, c.ZK)({
                    condition: true,
                    message: [
                        "[chakra-ui]: createBreakpoints(...) will be deprecated pretty soon",
                        "simply pass the breakpoints as an object. Remove the createBreakpoint(..) call", 
                    ].join("")
                });
                return rG({
                    base: "0em"
                }, e);
            };
            function rJ(r, e) {
                for(var n = 0; n < e.length; n++){
                    var t = e[n];
                    t.enumerable = t.enumerable || false;
                    t.configurable = true;
                    if ("value" in t) t.writable = true;
                    Object.defineProperty(r, t.key, t);
                }
            }
            function rK(r, e, n) {
                if (e) rJ(r.prototype, e);
                if (n) rJ(r, n);
                Object.defineProperty(r, "prototype", {
                    writable: false
                });
                return r;
            }
            var rU = (function() {
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
                        for(var r = arguments.length, n = new Array(r), t = 0; t < r; t++){
                            n[t] = arguments[t];
                        }
                        for(var o = 0, a = n; o < a.length; o++){
                            var i = a[o];
                            e.map[i] = e.toPart(i);
                        }
                        return e;
                    };
                    this.extend = function() {
                        for(var r = arguments.length, n = new Array(r), t = 0; t < r; t++){
                            n[t] = arguments[t];
                        }
                        for(var o = 0, a = n; o < a.length; o++){
                            var i = a[o];
                            if (i in e.map) continue;
                            e.map[i] = e.toPart(i);
                        }
                        return e;
                    };
                    this.toPart = function(r) {
                        var n = [
                            "container",
                            "root"
                        ].includes(r != null ? r : "") ? [
                            e.name
                        ] : [
                            e.name,
                            r
                        ];
                        var t = n.filter(Boolean).join("__");
                        var o = "chakra-" + t;
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
                rK(r, [
                    {
                        key: "selectors",
                        get: function r() {
                            var e = (0, c.sq)(Object.entries(this.map).map(function(r) {
                                var e = r[0], n = r[1];
                                return [
                                    e,
                                    n.selector
                                ];
                            }));
                            return e;
                        }
                    },
                    {
                        key: "classNames",
                        get: function r() {
                            var e = (0, c.sq)(Object.entries(this.map).map(function(r) {
                                var e = r[0], n = r[1];
                                return [
                                    e,
                                    n.className
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
            function rY(r) {
                return new rU(r);
            }
            function rQ(r) {
                if ((0, c.Kn)(r) && r.reference) {
                    return r.reference;
                }
                return String(r);
            }
            var rX = function r(e) {
                for(var n = arguments.length, t = new Array(n > 1 ? n - 1 : 0), o = 1; o < n; o++){
                    t[o - 1] = arguments[o];
                }
                return t.map(rQ).join(" " + e + " ").replace(/calc/g, "");
            };
            var er = function r() {
                for(var e = arguments.length, n = new Array(e), t = 0; t < e; t++){
                    n[t] = arguments[t];
                }
                return ("calc(" + rX.apply(void 0, [
                    "+"
                ].concat(n)) + ")");
            };
            var ee = function r() {
                for(var e = arguments.length, n = new Array(e), t = 0; t < e; t++){
                    n[t] = arguments[t];
                }
                return ("calc(" + rX.apply(void 0, [
                    "-"
                ].concat(n)) + ")");
            };
            var en = function r() {
                for(var e = arguments.length, n = new Array(e), t = 0; t < e; t++){
                    n[t] = arguments[t];
                }
                return ("calc(" + rX.apply(void 0, [
                    "*"
                ].concat(n)) + ")");
            };
            var et = function r() {
                for(var e = arguments.length, n = new Array(e), t = 0; t < e; t++){
                    n[t] = arguments[t];
                }
                return ("calc(" + rX.apply(void 0, [
                    "/"
                ].concat(n)) + ")");
            };
            var eo = function r(e) {
                var n = rQ(e);
                if (n != null && !Number.isNaN(parseFloat(n))) {
                    return String(n).startsWith("-") ? String(n).slice(1) : "-" + n;
                }
                return en(n, -1);
            };
            var ea = Object.assign(function(r) {
                return {
                    add: function e() {
                        for(var n = arguments.length, t = new Array(n), o = 0; o < n; o++){
                            t[o] = arguments[o];
                        }
                        return ea(er.apply(void 0, [
                            r
                        ].concat(t)));
                    },
                    subtract: function e() {
                        for(var n = arguments.length, t = new Array(n), o = 0; o < n; o++){
                            t[o] = arguments[o];
                        }
                        return ea(ee.apply(void 0, [
                            r
                        ].concat(t)));
                    },
                    multiply: function e() {
                        for(var n = arguments.length, t = new Array(n), o = 0; o < n; o++){
                            t[o] = arguments[o];
                        }
                        return ea(en.apply(void 0, [
                            r
                        ].concat(t)));
                    },
                    divide: function e() {
                        for(var n = arguments.length, t = new Array(n), o = 0; o < n; o++){
                            t[o] = arguments[o];
                        }
                        return ea(et.apply(void 0, [
                            r
                        ].concat(t)));
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
                multiply: en,
                divide: et,
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
            function eu(r) {
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
                    eu(r)
                ].filter(Boolean).join("-");
            }
            function ec(r, e) {
                return ("var(" + eu(r) + (e ? ", " + e : "") + ")");
            }
            function ev(r, e) {
                if (e === void 0) {
                    e = "";
                }
                return "--" + es(r, e);
            }
            function ed(r, e) {
                var n = ev(r, e == null ? void 0 : e.prefix);
                return {
                    variable: n,
                    reference: ec(n, ef(e == null ? void 0 : e.fallback))
                };
            }
            function ef(r) {
                if (typeof r === "string") return r;
                return r == null ? void 0 : r.reference;
            }
            var e$ = rY("accordion").parts("root", "container", "button", "panel").extend("icon");
            var eh = rY("alert").parts("title", "description", "container").extend("icon", "spinner");
            var ep = rY("avatar").parts("label", "badge", "container").extend("excessLabel", "group");
            var eb = rY("breadcrumb").parts("link", "item", "container").extend("separator");
            var eg = rY("button").parts();
            var em = rY("checkbox").parts("control", "icon", "container").extend("label");
            var ey = rY("progress").parts("track", "filledTrack").extend("label");
            var ex = rY("drawer").parts("overlay", "dialogContainer", "dialog").extend("header", "closeButton", "body", "footer");
            var e_ = rY("editable").parts("preview", "input", "textarea");
            var eS = rY("form").parts("container", "requiredIndicator", "helperText");
            var ew = rY("formError").parts("text", "icon");
            var e0 = rY("input").parts("addon", "field", "element");
            var e3 = rY("list").parts("container", "item", "icon");
            var ek = rY("menu").parts("button", "list", "item").extend("groupTitle", "command", "divider");
            var ez = rY("modal").parts("overlay", "dialogContainer", "dialog").extend("header", "closeButton", "body", "footer");
            var e1 = rY("numberinput").parts("root", "field", "stepperGroup", "stepper");
            var e4 = rY("pininput").parts("field");
            var e8 = rY("popover").parts("content", "header", "body", "footer").extend("popper", "arrow", "closeButton");
            var eC = rY("progress").parts("label", "filledTrack", "track");
            var e2 = rY("radio").parts("container", "control", "label");
            var eE = rY("select").parts("field", "icon");
            var e6 = rY("slider").parts("container", "track", "thumb", "filledTrack");
            var eP = rY("stat").parts("container", "label", "helpText", "number", "icon");
            var eR = rY("switch").parts("container", "track", "thumb");
            var e7 = rY("table").parts("table", "thead", "tbody", "tr", "th", "td", "tfoot", "caption");
            var eH = rY("tabs").parts("root", "tab", "tablist", "tabpanel", "tabpanels", "indicator");
            var eB = rY("tag").parts("container", "label", "closeButton");
            var eA = {
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
            var e5 = n(8554);
            var eW = n.n(e5);
            var eT = {
                borderTopWidth: "1px",
                borderColor: "inherit",
                _last: {
                    borderBottomWidth: "1px"
                }
            };
            var eI = {
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
            var eN = {
                pt: 2,
                px: 4,
                pb: 5
            };
            var eD = {
                fontSize: "1.25em"
            };
            var eO = {
                root: {},
                container: eT,
                button: eI,
                panel: eN,
                icon: eD
            };
            var eF = {
                parts: e$.keys,
                baseStyle: eO
            };
            var eV = {
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
            function eM(r) {
                var e = r.theme, n = r.colorScheme;
                var t = rR(e, n + ".100", n);
                var o = rA(n + ".200", 0.16)(e);
                return rj(t, o)(r);
            }
            var eq = function r(e) {
                var n = e.colorScheme;
                return {
                    container: {
                        bg: eM(e)
                    },
                    icon: {
                        color: rj(n + ".500", n + ".200")(e)
                    },
                    spinner: {
                        color: rj(n + ".500", n + ".200")(e)
                    }
                };
            };
            var eL = function r(e) {
                var n = e.colorScheme;
                return {
                    container: {
                        paddingStart: 3,
                        borderStartWidth: "4px",
                        borderStartColor: rj(n + ".500", n + ".200")(e),
                        bg: eM(e)
                    },
                    icon: {
                        color: rj(n + ".500", n + ".200")(e)
                    },
                    spinner: {
                        color: rj(n + ".500", n + ".200")(e)
                    }
                };
            };
            var ej = function r(e) {
                var n = e.colorScheme;
                return {
                    container: {
                        pt: 2,
                        borderTopWidth: "4px",
                        borderTopColor: rj(n + ".500", n + ".200")(e),
                        bg: eM(e)
                    },
                    icon: {
                        color: rj(n + ".500", n + ".200")(e)
                    },
                    spinner: {
                        color: rj(n + ".500", n + ".200")(e)
                    }
                };
            };
            var e9 = function r(e) {
                var n = e.colorScheme;
                return {
                    container: {
                        bg: rj(n + ".500", n + ".200")(e),
                        color: rj("white", "gray.900")(e)
                    }
                };
            };
            var eG = {
                subtle: eq,
                "left-accent": eL,
                "top-accent": ej,
                solid: e9
            };
            var eZ = {
                variant: "subtle",
                colorScheme: "blue"
            };
            var eJ = {
                parts: eh.keys,
                baseStyle: eV,
                variants: eG,
                defaultProps: eZ
            };
            var eK = function r(e) {
                return {
                    transform: "translate(25%, 25%)",
                    borderRadius: "full",
                    border: "0.2em solid",
                    borderColor: rj("white", "gray.800")(e)
                };
            };
            var eU = function r(e) {
                return {
                    bg: rj("gray.200", "whiteAlpha.400")(e)
                };
            };
            var eY = function r(e) {
                var n = e.name, t = e.theme;
                var o = n ? rV({
                    string: n
                }) : "gray.400";
                var a = rH(o)(t);
                var i = "white";
                if (!a) i = "gray.800";
                var l = rj("white", "gray.800")(e);
                return {
                    bg: o,
                    color: i,
                    borderColor: l,
                    verticalAlign: "top"
                };
            };
            var eQ = function r(e) {
                return {
                    badge: eK(e),
                    excessLabel: eU(e),
                    container: eY(e)
                };
            };
            function eX(r) {
                var e = r !== "100%" ? J[r] : undefined;
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
            var nr = {
                "2xs": eX(4),
                xs: eX(6),
                sm: eX(8),
                md: eX(12),
                lg: eX(16),
                xl: eX(24),
                "2xl": eX(32),
                full: eX("100%")
            };
            var ne = {
                size: "md"
            };
            var nn = {
                parts: ep.keys,
                baseStyle: eQ,
                sizes: nr,
                defaultProps: ne
            };
            var nt = {
                px: 1,
                textTransform: "uppercase",
                fontSize: "xs",
                borderRadius: "sm",
                fontWeight: "bold"
            };
            var no = function r(e) {
                var n = e.colorScheme, t = e.theme;
                var o = rA(n + ".500", 0.6)(t);
                return {
                    bg: rj(n + ".500", o)(e),
                    color: rj("white", "whiteAlpha.800")(e)
                };
            };
            var na = function r(e) {
                var n = e.colorScheme, t = e.theme;
                var o = rA(n + ".200", 0.16)(t);
                return {
                    bg: rj(n + ".100", o)(e),
                    color: rj(n + ".800", n + ".200")(e)
                };
            };
            var ni = function r(e) {
                var n = e.colorScheme, t = e.theme;
                var o = rA(n + ".200", 0.8)(t);
                var a = rR(t, n + ".500");
                var i = rj(a, o)(e);
                return {
                    color: i,
                    boxShadow: "inset 0 0 0px 1px " + i
                };
            };
            var nl = {
                solid: no,
                subtle: na,
                outline: ni
            };
            var nu = {
                variant: "subtle",
                colorScheme: "gray"
            };
            var ns = {
                baseStyle: nt,
                variants: nl,
                defaultProps: nu
            };
            var nc = {
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
            var nv = {
                link: nc
            };
            var nd = {
                parts: eb.keys,
                baseStyle: nv
            };
            var nf = {
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
            var n$ = function r(e) {
                var n = e.colorScheme, t = e.theme;
                if (n === "gray") {
                    return {
                        color: rj("inherit", "whiteAlpha.900")(e),
                        _hover: {
                            bg: rj("gray.100", "whiteAlpha.200")(e)
                        },
                        _active: {
                            bg: rj("gray.200", "whiteAlpha.300")(e)
                        }
                    };
                }
                var o = rA(n + ".200", 0.12)(t);
                var a = rA(n + ".200", 0.24)(t);
                return {
                    color: rj(n + ".600", n + ".200")(e),
                    bg: "transparent",
                    _hover: {
                        bg: rj(n + ".50", o)(e)
                    },
                    _active: {
                        bg: rj(n + ".100", a)(e)
                    }
                };
            };
            var nh = function r(e) {
                var n = e.colorScheme;
                var t = rj("gray.200", "whiteAlpha.300")(e);
                return j({
                    border: "1px solid",
                    borderColor: n === "gray" ? t : "currentColor",
                    ".chakra-button__group[data-attached] > &:not(:last-of-type)": {
                        marginEnd: "-1px"
                    }
                }, n$(e));
            };
            var np = {
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
            var nb = function r(e) {
                var n;
                var t = e.colorScheme;
                if (t === "gray") {
                    var o = rj("gray.100", "whiteAlpha.200")(e);
                    return {
                        bg: o,
                        _hover: {
                            bg: rj("gray.200", "whiteAlpha.300")(e),
                            _disabled: {
                                bg: o
                            }
                        },
                        _active: {
                            bg: rj("gray.300", "whiteAlpha.400")(e)
                        }
                    };
                }
                var a = (n = np[t]) != null ? n : {}, i = a.bg, l = i === void 0 ? t + ".500" : i, u = a.color, s = u === void 0 ? "white" : u, c = a.hoverBg, v = c === void 0 ? t + ".600" : c, d = a.activeBg, f = d === void 0 ? t + ".700" : d;
                var $ = rj(l, t + ".200")(e);
                return {
                    bg: $,
                    color: rj(s, "gray.800")(e),
                    _hover: {
                        bg: rj(v, t + ".300")(e),
                        _disabled: {
                            bg: $
                        }
                    },
                    _active: {
                        bg: rj(f, t + ".400")(e)
                    }
                };
            };
            var ng = function r(e) {
                var n = e.colorScheme;
                return {
                    padding: 0,
                    height: "auto",
                    lineHeight: "normal",
                    verticalAlign: "baseline",
                    color: rj(n + ".500", n + ".200")(e),
                    _hover: {
                        textDecoration: "underline",
                        _disabled: {
                            textDecoration: "none"
                        }
                    },
                    _active: {
                        color: rj(n + ".700", n + ".500")(e)
                    }
                };
            };
            var nm = {
                bg: "none",
                color: "inherit",
                display: "inline",
                lineHeight: "inherit",
                m: 0,
                p: 0
            };
            var ny = {
                ghost: n$,
                outline: nh,
                solid: nb,
                link: ng,
                unstyled: nm
            };
            var nx = {
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
            var n_ = {
                variant: "solid",
                size: "md",
                colorScheme: "gray"
            };
            var nS = {
                baseStyle: nf,
                variants: ny,
                sizes: nx,
                defaultProps: n_
            };
            var nw = function r(e) {
                var n = e.colorScheme;
                return {
                    w: "100%",
                    transitionProperty: "box-shadow",
                    transitionDuration: "normal",
                    border: "2px solid",
                    borderRadius: "sm",
                    borderColor: "inherit",
                    color: "white",
                    _checked: {
                        bg: rj(n + ".500", n + ".200")(e),
                        borderColor: rj(n + ".500", n + ".200")(e),
                        color: rj("white", "gray.900")(e),
                        _hover: {
                            bg: rj(n + ".600", n + ".300")(e),
                            borderColor: rj(n + ".600", n + ".300")(e)
                        },
                        _disabled: {
                            borderColor: rj("gray.200", "transparent")(e),
                            bg: rj("gray.200", "whiteAlpha.300")(e),
                            color: rj("gray.500", "whiteAlpha.500")(e)
                        }
                    },
                    _indeterminate: {
                        bg: rj(n + ".500", n + ".200")(e),
                        borderColor: rj(n + ".500", n + ".200")(e),
                        color: rj("white", "gray.900")(e)
                    },
                    _disabled: {
                        bg: rj("gray.100", "whiteAlpha.100")(e),
                        borderColor: rj("gray.100", "transparent")(e)
                    },
                    _focusVisible: {
                        boxShadow: "outline"
                    },
                    _invalid: {
                        borderColor: rj("red.500", "red.300")(e)
                    }
                };
            };
            var n0 = {
                _disabled: {
                    cursor: "not-allowed"
                }
            };
            var n3 = {
                userSelect: "none",
                _disabled: {
                    opacity: 0.4
                }
            };
            var nk = {
                transitionProperty: "transform",
                transitionDuration: "normal"
            };
            var nz = function r(e) {
                return {
                    icon: nk,
                    container: n0,
                    control: nw(e),
                    label: n3
                };
            };
            var n1 = {
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
            var n4 = {
                size: "md",
                colorScheme: "blue"
            };
            var n8 = {
                parts: em.keys,
                baseStyle: nz,
                sizes: n1,
                defaultProps: n4
            };
            var nC, n2, nE;
            var n6 = ed("close-button-size");
            var nP = function r(e) {
                var n = rj("blackAlpha.100", "whiteAlpha.100")(e);
                var t = rj("blackAlpha.200", "whiteAlpha.200")(e);
                return {
                    w: [
                        n6.reference
                    ],
                    h: [
                        n6.reference
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
                        bg: n
                    },
                    _active: {
                        bg: t
                    },
                    _focusVisible: {
                        boxShadow: "outline"
                    }
                };
            };
            var nR = {
                lg: ((nC = {}), (nC[n6.variable] = "40px"), (nC.fontSize = "16px"), nC),
                md: ((n2 = {}), (n2[n6.variable] = "32px"), (n2.fontSize = "12px"), n2),
                sm: ((nE = {}), (nE[n6.variable] = "24px"), (nE.fontSize = "10px"), nE)
            };
            var n7 = {
                size: "md"
            };
            var nH = {
                baseStyle: nP,
                sizes: nR,
                defaultProps: n7
            };
            var nB = ns.variants, nA = ns.defaultProps;
            var n5 = {
                fontFamily: "mono",
                fontSize: "sm",
                px: "0.2em",
                borderRadius: "sm"
            };
            var nW = {
                baseStyle: n5,
                variants: nB,
                defaultProps: nA
            };
            var nT = {
                w: "100%",
                mx: "auto",
                maxW: "60ch",
                px: "1rem"
            };
            var nI = {
                baseStyle: nT
            };
            var nN = {
                opacity: 0.6,
                borderColor: "inherit"
            };
            var nD = {
                borderStyle: "solid"
            };
            var nO = {
                borderStyle: "dashed"
            };
            var nF = {
                solid: nD,
                dashed: nO
            };
            var nV = {
                variant: "solid"
            };
            var nM = {
                baseStyle: nN,
                variants: nF,
                defaultProps: nV
            };
            function nq(r) {
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
            var nL = {
                bg: "blackAlpha.600",
                zIndex: "overlay"
            };
            var nj = {
                display: "flex",
                zIndex: "modal",
                justifyContent: "center"
            };
            var n9 = function r(e) {
                var n = e.isFullHeight;
                return j({}, n && {
                    height: "100vh"
                }, {
                    zIndex: "modal",
                    maxH: "100vh",
                    bg: rj("white", "gray.700")(e),
                    color: "inherit",
                    boxShadow: rj("lg", "dark-lg")(e)
                });
            };
            var nG = {
                px: 6,
                py: 4,
                fontSize: "xl",
                fontWeight: "semibold"
            };
            var nZ = {
                position: "absolute",
                top: 2,
                insetEnd: 3
            };
            var nJ = {
                px: 6,
                py: 2,
                flex: 1,
                overflow: "auto"
            };
            var nK = {
                px: 6,
                py: 4
            };
            var nU = function r(e) {
                return {
                    overlay: nL,
                    dialogContainer: nj,
                    dialog: n9(e),
                    header: nG,
                    closeButton: nZ,
                    body: nJ,
                    footer: nK
                };
            };
            var nY = {
                xs: nq("xs"),
                sm: nq("md"),
                md: nq("lg"),
                lg: nq("2xl"),
                xl: nq("4xl"),
                full: nq("full")
            };
            var nQ = {
                size: "xs"
            };
            var nX = {
                parts: ex.keys,
                baseStyle: nU,
                sizes: nY,
                defaultProps: nQ
            };
            var tr = {
                borderRadius: "md",
                py: "3px",
                transitionProperty: "common",
                transitionDuration: "normal"
            };
            var te = {
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
            var tn = {
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
            var tt = {
                preview: tr,
                input: te,
                textarea: tn
            };
            var to = {
                parts: e_.keys,
                baseStyle: tt
            };
            var ta = function r(e) {
                return {
                    marginStart: 1,
                    color: rj("red.500", "red.300")(e)
                };
            };
            var ti = function r(e) {
                return {
                    mt: 2,
                    color: rj("gray.500", "whiteAlpha.600")(e),
                    lineHeight: "normal",
                    fontSize: "sm"
                };
            };
            var tl = function r(e) {
                return {
                    container: {
                        width: "100%",
                        position: "relative"
                    },
                    requiredIndicator: ta(e),
                    helperText: ti(e)
                };
            };
            var tu = {
                parts: eS.keys,
                baseStyle: tl
            };
            var ts = function r(e) {
                return {
                    color: rj("red.500", "red.300")(e),
                    mt: 2,
                    fontSize: "sm",
                    lineHeight: "normal"
                };
            };
            var tc = function r(e) {
                return {
                    marginEnd: "0.5em",
                    color: rj("red.500", "red.300")(e)
                };
            };
            var tv = function r(e) {
                return {
                    text: ts(e),
                    icon: tc(e)
                };
            };
            var td = {
                parts: ew.keys,
                baseStyle: tv
            };
            var tf = {
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
            var t$ = {
                baseStyle: tf
            };
            var th = {
                fontFamily: "heading",
                fontWeight: "bold"
            };
            var tp = {
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
            var tb = {
                size: "xl"
            };
            var tg = {
                baseStyle: th,
                sizes: tp,
                defaultProps: tb
            };
            var tm = {
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
            var ty = {
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
            var tx = {
                lg: {
                    field: ty.lg,
                    addon: ty.lg
                },
                md: {
                    field: ty.md,
                    addon: ty.md
                },
                sm: {
                    field: ty.sm,
                    addon: ty.sm
                },
                xs: {
                    field: ty.xs,
                    addon: ty.xs
                }
            };
            function t_(r) {
                var e = r.focusBorderColor, n = r.errorBorderColor;
                return {
                    focusBorderColor: e || rj("blue.500", "blue.300")(r),
                    errorBorderColor: n || rj("red.500", "red.300")(r)
                };
            }
            var tS = function r(e) {
                var n = e.theme;
                var t = t_(e), o = t.focusBorderColor, a = t.errorBorderColor;
                return {
                    field: {
                        border: "1px solid",
                        borderColor: "inherit",
                        bg: "inherit",
                        _hover: {
                            borderColor: rj("gray.300", "whiteAlpha.400")(e)
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
                            borderColor: rR(n, a),
                            boxShadow: "0 0 0 1px " + rR(n, a)
                        },
                        _focusVisible: {
                            zIndex: 1,
                            borderColor: rR(n, o),
                            boxShadow: "0 0 0 1px " + rR(n, o)
                        }
                    },
                    addon: {
                        border: "1px solid",
                        borderColor: rj("inherit", "whiteAlpha.50")(e),
                        bg: rj("gray.100", "whiteAlpha.300")(e)
                    }
                };
            };
            var tw = function r(e) {
                var n = e.theme;
                var t = t_(e), o = t.focusBorderColor, a = t.errorBorderColor;
                return {
                    field: {
                        border: "2px solid",
                        borderColor: "transparent",
                        bg: rj("gray.100", "whiteAlpha.50")(e),
                        _hover: {
                            bg: rj("gray.200", "whiteAlpha.100")(e)
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
                            borderColor: rR(n, a)
                        },
                        _focusVisible: {
                            bg: "transparent",
                            borderColor: rR(n, o)
                        }
                    },
                    addon: {
                        border: "2px solid",
                        borderColor: "transparent",
                        bg: rj("gray.100", "whiteAlpha.50")(e)
                    }
                };
            };
            var t0 = function r(e) {
                var n = e.theme;
                var t = t_(e), o = t.focusBorderColor, a = t.errorBorderColor;
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
                            borderColor: rR(n, a),
                            boxShadow: "0px 1px 0px 0px " + rR(n, a)
                        },
                        _focusVisible: {
                            borderColor: rR(n, o),
                            boxShadow: "0px 1px 0px 0px " + rR(n, o)
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
            var t3 = {
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
            var tk = {
                outline: tS,
                filled: tw,
                flushed: t0,
                unstyled: t3
            };
            var tz = {
                size: "md",
                variant: "outline"
            };
            var t1 = {
                parts: e0.keys,
                baseStyle: tm,
                sizes: tx,
                variants: tk,
                defaultProps: tz
            };
            var t4 = function r(e) {
                return {
                    bg: rj("gray.100", "whiteAlpha")(e),
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
            var t8 = {
                baseStyle: t4
            };
            var tC = {
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
            var t2 = {
                baseStyle: tC
            };
            var tE = {
                marginEnd: "0.5rem",
                display: "inline",
                verticalAlign: "text-bottom"
            };
            var t6 = {
                container: {},
                item: {},
                icon: tE
            };
            var tP = {
                parts: e3.keys,
                baseStyle: t6
            };
            var tR = function r(e) {
                return {
                    bg: rj("#fff", "gray.700")(e),
                    boxShadow: rj("sm", "dark-lg")(e),
                    color: "inherit",
                    minW: "3xs",
                    py: "2",
                    zIndex: 1,
                    borderRadius: "md",
                    borderWidth: "1px"
                };
            };
            var t7 = function r(e) {
                return {
                    py: "0.4rem",
                    px: "0.8rem",
                    transitionProperty: "background",
                    transitionDuration: "ultra-fast",
                    transitionTimingFunction: "ease-in",
                    _focus: {
                        bg: rj("gray.100", "whiteAlpha.100")(e)
                    },
                    _active: {
                        bg: rj("gray.200", "whiteAlpha.200")(e)
                    },
                    _expanded: {
                        bg: rj("gray.100", "whiteAlpha.100")(e)
                    },
                    _disabled: {
                        opacity: 0.4,
                        cursor: "not-allowed"
                    }
                };
            };
            var tH = {
                mx: 4,
                my: 2,
                fontWeight: "semibold",
                fontSize: "sm"
            };
            var tB = {
                opacity: 0.6
            };
            var tA = {
                border: 0,
                borderBottom: "1px solid",
                borderColor: "inherit",
                my: "0.5rem",
                opacity: 0.6
            };
            var t5 = {
                transitionProperty: "common",
                transitionDuration: "normal"
            };
            var tW = function r(e) {
                return {
                    button: t5,
                    list: tR(e),
                    item: t7(e),
                    groupTitle: tH,
                    command: tB,
                    divider: tA
                };
            };
            var tT = {
                parts: ek.keys,
                baseStyle: tW
            };
            var tI = {
                bg: "blackAlpha.600",
                zIndex: "modal"
            };
            var tN = function r(e) {
                var n = e.isCentered, t = e.scrollBehavior;
                return {
                    display: "flex",
                    zIndex: "modal",
                    justifyContent: "center",
                    alignItems: n ? "center" : "flex-start",
                    overflow: t === "inside" ? "hidden" : "auto"
                };
            };
            var tD = function r(e) {
                var n = e.scrollBehavior;
                return {
                    borderRadius: "md",
                    bg: rj("white", "gray.700")(e),
                    color: "inherit",
                    my: "3.75rem",
                    zIndex: "modal",
                    maxH: n === "inside" ? "calc(100% - 7.5rem)" : undefined,
                    boxShadow: rj("lg", "dark-lg")(e)
                };
            };
            var tO = {
                px: 6,
                py: 4,
                fontSize: "xl",
                fontWeight: "semibold"
            };
            var tF = {
                position: "absolute",
                top: 2,
                insetEnd: 3
            };
            var tV = function r(e) {
                var n = e.scrollBehavior;
                return {
                    px: 6,
                    py: 2,
                    flex: 1,
                    overflow: n === "inside" ? "auto" : undefined
                };
            };
            var tM = {
                px: 6,
                py: 4
            };
            var tq = function r(e) {
                return {
                    overlay: tI,
                    dialogContainer: tN(e),
                    dialog: tD(e),
                    header: tO,
                    closeButton: tF,
                    body: tV(e),
                    footer: tM
                };
            };
            function tL(r) {
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
            var tj = {
                xs: tL("xs"),
                sm: tL("sm"),
                md: tL("md"),
                lg: tL("lg"),
                xl: tL("xl"),
                "2xl": tL("2xl"),
                "3xl": tL("3xl"),
                "4xl": tL("4xl"),
                "5xl": tL("5xl"),
                "6xl": tL("6xl"),
                full: tL("full")
            };
            var t9 = {
                size: "md"
            };
            var tG = {
                parts: ez.keys,
                baseStyle: tq,
                sizes: tj,
                defaultProps: t9
            };
            var tZ, tJ, tK;
            var tU = t1.variants, tY = t1.defaultProps;
            var tQ = ed("number-input-stepper-width");
            var tX = ed("number-input-input-padding");
            var or = ea(tQ).add("0.5rem").toString();
            var oe = ((tZ = {}), (tZ[tQ.variable] = "24px"), (tZ[tX.variable] = or), tZ);
            var on = (tJ = (tK = t1.baseStyle) == null ? void 0 : tK.field) != null ? tJ : {};
            var ot = {
                width: [
                    tQ.reference
                ]
            };
            var oo = function r(e) {
                return {
                    borderStart: "1px solid",
                    borderStartColor: rj("inherit", "whiteAlpha.300")(e),
                    color: rj("inherit", "whiteAlpha.800")(e),
                    _active: {
                        bg: rj("gray.200", "whiteAlpha.300")(e)
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
                    field: on,
                    stepperGroup: ot,
                    stepper: oo(e)
                };
            };
            function oi(r) {
                var e, n;
                var t = t1.sizes[r];
                var o = {
                    lg: "md",
                    md: "md",
                    sm: "sm",
                    xs: "sm"
                };
                var a = (e = (n = t.field) == null ? void 0 : n.fontSize) != null ? e : "md";
                var i = eA.fontSizes[a];
                return {
                    field: j({}, t.field, {
                        paddingInlineEnd: tX.reference,
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
            var ou = {
                parts: e1.keys,
                baseStyle: oa,
                sizes: ol,
                variants: tU,
                defaultProps: tY
            };
            var os;
            var oc = j({}, t1.baseStyle.field, {
                textAlign: "center"
            });
            var ov = {
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
                    var n;
                    return (n = t1.variants.outline(e).field) != null ? n : {};
                },
                flushed: function r(e) {
                    var n;
                    return (n = t1.variants.flushed(e).field) != null ? n : {};
                },
                filled: function r(e) {
                    var n;
                    return (n = t1.variants.filled(e).field) != null ? n : {};
                },
                unstyled: (os = t1.variants.unstyled.field) != null ? os : {}
            };
            var of = t1.defaultProps;
            var o$ = {
                baseStyle: oc,
                sizes: ov,
                variants: od,
                defaultProps: of
            };
            var oh = ed("popper-bg");
            var op = ed("popper-arrow-bg");
            var ob = ed("popper-arrow-shadow-color");
            var og = {
                zIndex: 10
            };
            var om = function r(e) {
                var n;
                var t = rj("white", "gray.700")(e);
                var o = rj("gray.200", "whiteAlpha.300")(e);
                return ((n = {}), (n[oh.variable] = "colors." + t), (n.bg = oh.reference), (n[op.variable] = oh.reference), (n[ob.variable] = "colors." + o), (n.width = "xs"), (n.border = "1px solid"), (n.borderColor = "inherit"), (n.borderRadius = "md"), (n.boxShadow = "sm"), (n.zIndex = "inherit"), (n._focusVisible = {
                    outline: 0,
                    boxShadow: "outline"
                }), n);
            };
            var oy = {
                px: 3,
                py: 2,
                borderBottomWidth: "1px"
            };
            var ox = {
                px: 3,
                py: 2
            };
            var o_ = {
                px: 3,
                py: 2,
                borderTopWidth: "1px"
            };
            var oS = {
                position: "absolute",
                borderRadius: "md",
                top: 1,
                insetEnd: 2,
                padding: 2
            };
            var ow = function r(e) {
                return {
                    popper: og,
                    content: om(e),
                    header: oy,
                    body: ox,
                    footer: o_,
                    arrow: {},
                    closeButton: oS
                };
            };
            var o0 = {
                parts: e8.keys,
                baseStyle: ow
            };
            function o3(r) {
                var e = r.colorScheme, n = r.theme, t = r.isIndeterminate, o = r.hasStripe;
                var a = rj(rF(), rF("1rem", "rgba(0,0,0,0.1)"))(r);
                var i = rj(e + ".500", e + ".200")(r);
                var l = "linear-gradient(\n    to right,\n    transparent 0%,\n    " + rR(n, i) + " 50%,\n    transparent 100%\n  )";
                var u = !t && o;
                return j({}, u && a, t ? {
                    bgImage: l
                } : {
                    bgColor: i
                });
            }
            var ok = {
                lineHeight: "1",
                fontSize: "0.25em",
                fontWeight: "bold",
                color: "white"
            };
            var oz = function r(e) {
                return {
                    bg: rj("gray.100", "whiteAlpha.300")(e)
                };
            };
            var o1 = function r(e) {
                return j({
                    transitionProperty: "common",
                    transitionDuration: "slow"
                }, o3(e));
            };
            var o4 = function r(e) {
                return {
                    label: ok,
                    filledTrack: o1(e),
                    track: oz(e)
                };
            };
            var o8 = {
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
            var oC = {
                size: "md",
                colorScheme: "blue"
            };
            var o2 = {
                parts: eC.keys,
                sizes: o8,
                baseStyle: o4,
                defaultProps: oC
            };
            var oE = function r(e) {
                var n = n8.baseStyle(e), t = n.control, o = t === void 0 ? {} : t;
                return j({}, o, {
                    borderRadius: "full",
                    _checked: j({}, o["_checked"], {
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
            var o6 = function r(e) {
                return {
                    label: n8.baseStyle(e).label,
                    container: n8.baseStyle(e).container,
                    control: oE(e)
                };
            };
            var oP = {
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
            var oR = {
                size: "md",
                colorScheme: "blue"
            };
            var o7 = {
                parts: e2.keys,
                baseStyle: o6,
                sizes: oP,
                defaultProps: oR
            };
            var oH = function r(e) {
                return j({}, t1.baseStyle.field, {
                    bg: rj("white", "gray.700")(e),
                    appearance: "none",
                    paddingBottom: "1px",
                    lineHeight: "normal",
                    "> option, > optgroup": {
                        bg: rj("white", "gray.700")(e)
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
            var oA = function r(e) {
                return {
                    field: oH(e),
                    icon: oB
                };
            };
            var o5 = {
                paddingInlineEnd: "2rem"
            };
            var oW = eW()({}, t1.sizes, {
                lg: {
                    field: o5
                },
                md: {
                    field: o5
                },
                sm: {
                    field: o5
                },
                xs: {
                    field: o5,
                    icon: {
                        insetEnd: "0.25rem"
                    }
                }
            });
            var oT = {
                parts: eE.keys,
                baseStyle: oA,
                sizes: oW,
                variants: t1.variants,
                defaultProps: t1.defaultProps
            };
            var oI = function r(e, n) {
                return (0, l.F4)({
                    from: {
                        borderColor: e,
                        background: e
                    },
                    to: {
                        borderColor: n,
                        background: n
                    }
                });
            };
            var oN = function r(e) {
                var n = rj("gray.100", "gray.800")(e);
                var t = rj("gray.400", "gray.600")(e);
                var o = e.startColor, a = o === void 0 ? n : o, i = e.endColor, l = i === void 0 ? t : i, u = e.speed, s = e.theme;
                var c = rR(s, a);
                var v = rR(s, l);
                return {
                    opacity: 0.7,
                    borderRadius: "2px",
                    borderColor: c,
                    background: v,
                    animation: u + "s linear infinite alternate " + oI(c, v)
                };
            };
            var oD = {
                baseStyle: oN
            };
            var oO = function r(e) {
                return {
                    borderRadius: "md",
                    fontWeight: "semibold",
                    _focusVisible: {
                        boxShadow: "outline",
                        padding: "1rem",
                        position: "fixed",
                        top: "1.5rem",
                        insetStart: "1.5rem",
                        bg: rj("white", "gray.700")(e)
                    }
                };
            };
            var oF = {
                baseStyle: oO
            };
            function oV(r) {
                return r9({
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
            var oM = function r(e) {
                var n = e.orientation;
                return j({
                    display: "inline-block",
                    position: "relative",
                    cursor: "pointer",
                    _disabled: {
                        opacity: 0.6,
                        cursor: "default",
                        pointerEvents: "none"
                    }
                }, r9({
                    orientation: n,
                    vertical: {
                        h: "100%"
                    },
                    horizontal: {
                        w: "100%"
                    }
                }));
            };
            var oq = function r(e) {
                return {
                    overflow: "hidden",
                    borderRadius: "sm",
                    bg: rj("gray.200", "whiteAlpha.200")(e),
                    _disabled: {
                        bg: rj("gray.300", "whiteAlpha.300")(e)
                    }
                };
            };
            var oL = function r(e) {
                return j({
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
                }, oV(e));
            };
            var oj = function r(e) {
                var n = e.colorScheme;
                return {
                    width: "inherit",
                    height: "inherit",
                    bg: rj(n + ".500", n + ".200")(e)
                };
            };
            var o9 = function r(e) {
                return {
                    container: oM(e),
                    track: oq(e),
                    thumb: oL(e),
                    filledTrack: oj(e)
                };
            };
            var oG = function r(e) {
                return {
                    thumb: {
                        w: "16px",
                        h: "16px"
                    },
                    track: r9({
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
            var oZ = function r(e) {
                return {
                    thumb: {
                        w: "14px",
                        h: "14px"
                    },
                    track: r9({
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
            var oJ = function r(e) {
                return {
                    thumb: {
                        w: "10px",
                        h: "10px"
                    },
                    track: r9({
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
            var oK = {
                lg: oG,
                md: oZ,
                sm: oJ
            };
            var oU = {
                size: "md",
                colorScheme: "blue"
            };
            var oY = {
                parts: e6.keys,
                sizes: oK,
                baseStyle: o9,
                defaultProps: oU
            };
            var oQ, oX, ar, ae, an;
            var at = ed("spinner-size");
            var ao = {
                width: [
                    at.reference
                ],
                height: [
                    at.reference
                ]
            };
            var aa = {
                xs: ((oQ = {}), (oQ[at.variable] = "0.75rem"), oQ),
                sm: ((oX = {}), (oX[at.variable] = "1rem"), oX),
                md: ((ar = {}), (ar[at.variable] = "1.5rem"), ar),
                lg: ((ae = {}), (ae[at.variable] = "2rem"), ae),
                xl: ((an = {}), (an[at.variable] = "3rem"), an)
            };
            var ai = {
                size: "md"
            };
            var al = {
                baseStyle: ao,
                sizes: aa,
                defaultProps: ai
            };
            var au = {
                fontWeight: "medium"
            };
            var as = {
                opacity: 0.8,
                marginBottom: 2
            };
            var ac = {
                verticalAlign: "baseline",
                fontWeight: "semibold"
            };
            var av = {
                marginEnd: 1,
                w: "14px",
                h: "14px",
                verticalAlign: "middle"
            };
            var ad = {
                container: {},
                label: au,
                helpText: as,
                number: ac,
                icon: av
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
            var a$ = {
                size: "md"
            };
            var ah = {
                parts: eP.keys,
                baseStyle: ad,
                sizes: af,
                defaultProps: a$
            };
            var ap, ab, ag;
            var am = ed("switch-track-width");
            var ay = ed("switch-track-height");
            var ax = ed("switch-track-diff");
            var a_ = ea.subtract(am, ay);
            var aS = ed("switch-thumb-x");
            var aw = function r(e) {
                var n = e.colorScheme;
                return {
                    borderRadius: "full",
                    p: "2px",
                    width: [
                        am.reference
                    ],
                    height: [
                        ay.reference
                    ],
                    transitionProperty: "common",
                    transitionDuration: "fast",
                    bg: rj("gray.300", "whiteAlpha.400")(e),
                    _focusVisible: {
                        boxShadow: "outline"
                    },
                    _disabled: {
                        opacity: 0.4,
                        cursor: "not-allowed"
                    },
                    _checked: {
                        bg: rj(n + ".500", n + ".200")(e)
                    }
                };
            };
            var a0 = {
                bg: "white",
                transitionProperty: "transform",
                transitionDuration: "normal",
                borderRadius: "inherit",
                width: [
                    ay.reference
                ],
                height: [
                    ay.reference
                ],
                _checked: {
                    transform: "translateX(" + aS.reference + ")"
                }
            };
            var a3 = function r(e) {
                var n, t;
                return {
                    container: ((t = {}), (t[ax.variable] = a_), (t[aS.variable] = ax.reference), (t._rtl = ((n = {}), (n[aS.variable] = ea(ax).negate().toString()), n)), t),
                    track: aw(e),
                    thumb: a0
                };
            };
            var ak = {
                sm: {
                    container: ((ap = {}), (ap[am.variable] = "1.375rem"), (ap[ay.variable] = "0.75rem"), ap)
                },
                md: {
                    container: ((ab = {}), (ab[am.variable] = "1.875rem"), (ab[ay.variable] = "1rem"), ab)
                },
                lg: {
                    container: ((ag = {}), (ag[am.variable] = "2.875rem"), (ag[ay.variable] = "1.5rem"), ag)
                }
            };
            var az = {
                size: "md",
                colorScheme: "blue"
            };
            var a1 = {
                parts: eR.keys,
                baseStyle: a3,
                sizes: ak,
                defaultProps: az
            };
            var a4 = {
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
            var a8 = {
                "&[data-is-numeric=true]": {
                    textAlign: "end"
                }
            };
            var aC = function r(e) {
                var n = e.colorScheme;
                return {
                    th: j({
                        color: rj("gray.600", "gray.400")(e),
                        borderBottom: "1px",
                        borderColor: rj(n + ".100", n + ".700")(e)
                    }, a8),
                    td: j({
                        borderBottom: "1px",
                        borderColor: rj(n + ".100", n + ".700")(e)
                    }, a8),
                    caption: {
                        color: rj("gray.600", "gray.100")(e)
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
            var a2 = function r(e) {
                var n = e.colorScheme;
                return {
                    th: j({
                        color: rj("gray.600", "gray.400")(e),
                        borderBottom: "1px",
                        borderColor: rj(n + ".100", n + ".700")(e)
                    }, a8),
                    td: j({
                        borderBottom: "1px",
                        borderColor: rj(n + ".100", n + ".700")(e)
                    }, a8),
                    caption: {
                        color: rj("gray.600", "gray.100")(e)
                    },
                    tbody: {
                        tr: {
                            "&:nth-of-type(odd)": {
                                "th, td": {
                                    borderBottomWidth: "1px",
                                    borderColor: rj(n + ".100", n + ".700")(e)
                                },
                                td: {
                                    background: rj(n + ".100", n + ".700")(e)
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
            var aE = {
                simple: aC,
                striped: a2,
                unstyled: {}
            };
            var a6 = {
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
            var aP = {
                variant: "simple",
                size: "md",
                colorScheme: "gray"
            };
            var aR = {
                parts: e7.keys,
                baseStyle: a4,
                variants: aE,
                sizes: a6,
                defaultProps: aP
            };
            var a7 = function r(e) {
                var n = e.orientation;
                return {
                    display: n === "vertical" ? "flex" : "block"
                };
            };
            var aH = function r(e) {
                var n = e.isFitted;
                return {
                    flex: n ? 1 : undefined,
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
                var n = e.align, t = n === void 0 ? "start" : n, o = e.orientation;
                var a = {
                    end: "flex-end",
                    center: "center",
                    start: "flex-start"
                };
                return {
                    justifyContent: a[t],
                    flexDirection: o === "vertical" ? "column" : "row"
                };
            };
            var aA = {
                p: 4
            };
            var a5 = function r(e) {
                return {
                    root: a7(e),
                    tab: aH(e),
                    tablist: aB(e),
                    tabpanel: aA
                };
            };
            var aW = {
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
            var aT = function r(e) {
                var n, t;
                var o = e.colorScheme, a = e.orientation;
                var i = a === "vertical";
                var l = a === "vertical" ? "borderStart" : "borderBottom";
                var u = i ? "marginStart" : "marginBottom";
                return {
                    tablist: ((n = {}), (n[l] = "2px solid"), (n.borderColor = "inherit"), n),
                    tab: ((t = {}), (t[l] = "2px solid"), (t.borderColor = "transparent"), (t[u] = "-2px"), (t._selected = {
                        color: rj(o + ".600", o + ".300")(e),
                        borderColor: "currentColor"
                    }), (t._active = {
                        bg: rj("gray.200", "whiteAlpha.300")(e)
                    }), (t._disabled = {
                        _active: {
                            bg: "none"
                        }
                    }), t)
                };
            };
            var aI = function r(e) {
                var n = e.colorScheme;
                return {
                    tab: {
                        borderTopRadius: "md",
                        border: "1px solid",
                        borderColor: "transparent",
                        mb: "-1px",
                        _selected: {
                            color: rj(n + ".600", n + ".300")(e),
                            borderColor: "inherit",
                            borderBottomColor: rj("white", "gray.800")(e)
                        }
                    },
                    tablist: {
                        mb: "-1px",
                        borderBottom: "1px solid",
                        borderColor: "inherit"
                    }
                };
            };
            var aN = function r(e) {
                var n = e.colorScheme;
                return {
                    tab: {
                        border: "1px solid",
                        borderColor: "inherit",
                        bg: rj("gray.50", "whiteAlpha.50")(e),
                        mb: "-1px",
                        _notLast: {
                            marginEnd: "-1px"
                        },
                        _selected: {
                            bg: rj("#fff", "gray.800")(e),
                            color: rj(n + ".600", n + ".300")(e),
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
            var aD = function r(e) {
                var n = e.colorScheme, t = e.theme;
                return {
                    tab: {
                        borderRadius: "full",
                        fontWeight: "semibold",
                        color: "gray.600",
                        _selected: {
                            color: rR(t, n + ".700"),
                            bg: rR(t, n + ".100")
                        }
                    }
                };
            };
            var aO = function r(e) {
                var n = e.colorScheme;
                return {
                    tab: {
                        borderRadius: "full",
                        fontWeight: "semibold",
                        color: rj("gray.600", "inherit")(e),
                        _selected: {
                            color: rj("#fff", "gray.800")(e),
                            bg: rj(n + ".600", n + ".300")(e)
                        }
                    }
                };
            };
            var aF = {};
            var aV = {
                line: aT,
                enclosed: aI,
                "enclosed-colored": aN,
                "soft-rounded": aD,
                "solid-rounded": aO,
                unstyled: aF
            };
            var aM = {
                size: "md",
                variant: "line",
                colorScheme: "blue"
            };
            var aq = {
                parts: eH.keys,
                baseStyle: a5,
                sizes: aW,
                variants: aV,
                defaultProps: aM
            };
            var aL = {
                fontWeight: "medium",
                lineHeight: 1.2,
                outline: 0,
                borderRadius: "md",
                _focusVisible: {
                    boxShadow: "outline"
                }
            };
            var aj = {
                lineHeight: 1.2,
                overflow: "visible"
            };
            var a9 = {
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
            var aG = {
                container: aL,
                label: aj,
                closeButton: a9
            };
            var aZ = {
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
            var aJ = {
                subtle: function r(e) {
                    return {
                        container: ns.variants.subtle(e)
                    };
                },
                solid: function r(e) {
                    return {
                        container: ns.variants.solid(e)
                    };
                },
                outline: function r(e) {
                    return {
                        container: ns.variants.outline(e)
                    };
                }
            };
            var aK = {
                size: "md",
                variant: "subtle",
                colorScheme: "gray"
            };
            var aU = {
                parts: eB.keys,
                variants: aJ,
                baseStyle: aG,
                sizes: aZ,
                defaultProps: aK
            };
            var aY, aQ, aX, ir, ie;
            var it = j({}, t1.baseStyle.field, {
                paddingY: "8px",
                minHeight: "80px",
                lineHeight: "short",
                verticalAlign: "top"
            });
            var io = {
                outline: function r(e) {
                    var n;
                    return (n = t1.variants.outline(e).field) != null ? n : {};
                },
                flushed: function r(e) {
                    var n;
                    return (n = t1.variants.flushed(e).field) != null ? n : {};
                },
                filled: function r(e) {
                    var n;
                    return (n = t1.variants.filled(e).field) != null ? n : {};
                },
                unstyled: (aY = t1.variants.unstyled.field) != null ? aY : {}
            };
            var ia = {
                xs: (aQ = t1.sizes.xs.field) != null ? aQ : {},
                sm: (aX = t1.sizes.sm.field) != null ? aX : {},
                md: (ir = t1.sizes.md.field) != null ? ir : {},
                lg: (ie = t1.sizes.lg.field) != null ? ie : {}
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
            var iu = ed("tooltip-bg");
            var is = ed("popper-arrow-bg");
            var ic = function r(e) {
                var n;
                var t = rj("gray.700", "gray.300")(e);
                return ((n = {}), (n[iu.variable] = "colors." + t), (n.px = "8px"), (n.py = "2px"), (n.bg = [
                    iu.reference
                ]), (n[is.variable] = [
                    iu.reference
                ]), (n.color = rj("whiteAlpha.900", "gray.900")(e)), (n.borderRadius = "sm"), (n.fontWeight = "medium"), (n.fontSize = "sm"), (n.boxShadow = "md"), (n.maxW = "320px"), (n.zIndex = "tooltip"), n);
            };
            var iv = {
                baseStyle: ic
            };
            var id = {
                Accordion: eF,
                Alert: eJ,
                Avatar: nn,
                Badge: ns,
                Breadcrumb: nd,
                Button: nS,
                Checkbox: n8,
                CloseButton: nH,
                Code: nW,
                Container: nI,
                Divider: nM,
                Drawer: nX,
                Editable: to,
                Form: tu,
                FormError: td,
                FormLabel: t$,
                Heading: tg,
                Input: t1,
                Kbd: t8,
                Link: t2,
                List: tP,
                Menu: tT,
                Modal: tG,
                NumberInput: ou,
                PinInput: o$,
                Popover: o0,
                Progress: o2,
                Radio: o7,
                Select: oT,
                Skeleton: oD,
                SkipLink: oF,
                Slider: oY,
                Spinner: al,
                Stat: ah,
                Switch: a1,
                Table: aR,
                Tabs: aq,
                Tag: aU,
                Textarea: il,
                Tooltip: iv
            };
            var i$ = {
                none: 0,
                "1px": "1px solid",
                "2px": "2px solid",
                "4px": "4px solid",
                "8px": "8px solid"
            };
            var ih = rZ({
                sm: "30em",
                md: "48em",
                lg: "62em",
                xl: "80em",
                "2xl": "96em"
            });
            var ip = {
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
            var ib = {
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
            var ig = {
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
            var im = {
                common: "background-color, border-color, color, fill, stroke, opacity, box-shadow, transform",
                colors: "background-color, border-color, color, fill, stroke",
                dimensions: "width, height",
                position: "left, right, top, bottom",
                background: "background-color, background-image, background-position"
            };
            var iy = {
                "ease-in": "cubic-bezier(0.4, 0, 1, 1)",
                "ease-out": "cubic-bezier(0, 0, 0.2, 1)",
                "ease-in-out": "cubic-bezier(0.4, 0, 0.2, 1)"
            };
            var ix = {
                "ultra-fast": "50ms",
                faster: "100ms",
                fast: "150ms",
                normal: "200ms",
                slow: "300ms",
                slower: "400ms",
                "ultra-slow": "500ms"
            };
            var i_ = {
                property: im,
                easing: iy,
                duration: ix
            };
            var iS = {
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
            var iw = {
                none: 0,
                sm: "4px",
                base: "8px",
                md: "12px",
                lg: "16px",
                xl: "24px",
                "2xl": "40px",
                "3xl": "64px"
            };
            var i0 = j({
                breakpoints: ih,
                zIndices: iS,
                radii: ib,
                blur: iw,
                colors: ip
            }, eA, {
                sizes: J,
                shadows: ig,
                space: L,
                borders: i$,
                transition: i_
            });
            var i3 = {
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
            var ik = {
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
            var iz = ik;
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
            function i4(r) {
                if (!isObject(r)) {
                    return false;
                }
                return i1.every(function(e) {
                    return Object.prototype.hasOwnProperty.call(r, e);
                });
            }
            var i8 = "ltr";
            var iC = {
                useSystemColorMode: false,
                initialColorMode: "light",
                cssVarPrefix: "chakra"
            };
            var i2 = j({
                semanticTokens: i3,
                direction: i8
            }, i0, {
                components: id,
                styles: iz,
                config: iC
            });
            var iE = n(1358);
            function i6() {
                i6 = Object.assign ? Object.assign.bind() : function(r) {
                    for(var e = 1; e < arguments.length; e++){
                        var n = arguments[e];
                        for(var t in n){
                            if (Object.prototype.hasOwnProperty.call(n, t)) {
                                r[t] = n[t];
                            }
                        }
                    }
                    return r;
                };
                return i6.apply(this, arguments);
            }
            function iP(r, e) {
                if (r == null) return {};
                var n = {};
                var t = Object.keys(r);
                var o, a;
                for(a = 0; a < t.length; a++){
                    o = t[a];
                    if (e.indexOf(o) >= 0) continue;
                    n[o] = r[o];
                }
                return n;
            }
            var iR = [
                "label",
                "thickness",
                "speed",
                "emptyColor",
                "className", 
            ];
            var i7 = (0, l.F4)({
                "0%": {
                    transform: "rotate(0deg)"
                },
                "100%": {
                    transform: "rotate(360deg)"
                }
            });
            var iH = (0, H.Gp)(function(r, e) {
                var n = (0, H.mq)("Spinner", r);
                var t = (0, H.Lr)(r), o = t.label, a = o === void 0 ? "Loading..." : o, l = t.thickness, u = l === void 0 ? "2px" : l, s = t.speed, v = s === void 0 ? "0.45s" : s, d = t.emptyColor, f = d === void 0 ? "transparent" : d, $ = t.className, h = iP(t, iR);
                var p = (0, c.cx)("chakra-spinner", $);
                var b = i6({
                    display: "inline-block",
                    borderColor: "currentColor",
                    borderStyle: "solid",
                    borderRadius: "99999px",
                    borderWidth: u,
                    borderBottomColor: f,
                    borderLeftColor: f,
                    animation: i7 + " " + v + " linear infinite"
                }, n);
                return i.createElement(H.m$.div, i6({
                    ref: e,
                    __css: b,
                    className: p
                }, h), a && i.createElement(iE.TX, null, a));
            });
            if (c.Ts) {
                iH.displayName = "Spinner";
            }
            var iB = n(894);
            function iA() {
                iA = Object.assign ? Object.assign.bind() : function(r) {
                    for(var e = 1; e < arguments.length; e++){
                        var n = arguments[e];
                        for(var t in n){
                            if (Object.prototype.hasOwnProperty.call(n, t)) {
                                r[t] = n[t];
                            }
                        }
                    }
                    return r;
                };
                return iA.apply(this, arguments);
            }
            function i5(r, e) {
                if (r == null) return {};
                var n = {};
                var t = Object.keys(r);
                var o, a;
                for(a = 0; a < t.length; a++){
                    o = t[a];
                    if (e.indexOf(o) >= 0) continue;
                    n[o] = r[o];
                }
                return n;
            }
            var iW = function r(e) {
                return i.createElement(iB.JO, iA({
                    viewBox: "0 0 24 24"
                }, e), i.createElement("path", {
                    fill: "currentColor",
                    d: "M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
                }));
            };
            var iT = function r(e) {
                return i.createElement(iB.JO, iA({
                    viewBox: "0 0 24 24"
                }, e), i.createElement("path", {
                    fill: "currentColor",
                    d: "M12,0A12,12,0,1,0,24,12,12.013,12.013,0,0,0,12,0Zm.25,5a1.5,1.5,0,1,1-1.5,1.5A1.5,1.5,0,0,1,12.25,5ZM14.5,18.5h-4a1,1,0,0,1,0-2h.75a.25.25,0,0,0,.25-.25v-4.5a.25.25,0,0,0-.25-.25H10.5a1,1,0,0,1,0-2h1a2,2,0,0,1,2,2v4.75a.25.25,0,0,0,.25.25h.75a1,1,0,1,1,0,2Z"
                }));
            };
            var iI = function r(e) {
                return i.createElement(iB.JO, iA({
                    viewBox: "0 0 24 24"
                }, e), i.createElement("path", {
                    fill: "currentColor",
                    d: "M11.983,0a12.206,12.206,0,0,0-8.51,3.653A11.8,11.8,0,0,0,0,12.207,11.779,11.779,0,0,0,11.8,24h.214A12.111,12.111,0,0,0,24,11.791h0A11.766,11.766,0,0,0,11.983,0ZM10.5,16.542a1.476,1.476,0,0,1,1.449-1.53h.027a1.527,1.527,0,0,1,1.523,1.47,1.475,1.475,0,0,1-1.449,1.53h-.027A1.529,1.529,0,0,1,10.5,16.542ZM11,12.5v-6a1,1,0,0,1,2,0v6a1,1,0,1,1-2,0Z"
                }));
            };
            var iN = [
                "status"
            ];
            var iD = (0, H.eC)("Alert"), iO = iD[0], iF = iD[1];
            var iV = {
                info: {
                    icon: iT,
                    colorScheme: "blue"
                },
                warning: {
                    icon: iI,
                    colorScheme: "orange"
                },
                success: {
                    icon: iW,
                    colorScheme: "green"
                },
                error: {
                    icon: iI,
                    colorScheme: "red"
                },
                loading: {
                    icon: iH,
                    colorScheme: "blue"
                }
            };
            var iM = (0, v.kr)({
                name: "AlertContext",
                errorMessage: "useAlertContext: `context` is undefined. Seems you forgot to wrap alert components in `<Alert />`"
            }), iq = iM[0], iL = iM[1];
            var ij = (0, H.Gp)(function(r, e) {
                var n;
                var t = (0, H.Lr)(r), o = t.status, a = o === void 0 ? "info" : o, l = i5(t, iN);
                var u = (n = r.colorScheme) != null ? n : iV[a].colorScheme;
                var s = (0, H.jC)("Alert", iA({}, r, {
                    colorScheme: u
                }));
                var v = iA({
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    position: "relative",
                    overflow: "hidden"
                }, s.container);
                return i.createElement(iq, {
                    value: {
                        status: a
                    }
                }, i.createElement(iO, {
                    value: s
                }, i.createElement(H.m$.div, iA({
                    role: "alert",
                    ref: e
                }, l, {
                    className: (0, c.cx)("chakra-alert", r.className),
                    __css: v
                }))));
            });
            var i9 = (0, H.Gp)(function(r, e) {
                var n = iF();
                return i.createElement(H.m$.div, iA({
                    ref: e
                }, r, {
                    className: (0, c.cx)("chakra-alert__title", r.className),
                    __css: n.title
                }));
            });
            var iG = (0, H.Gp)(function(r, e) {
                var n = iF();
                var t = iA({
                    display: "inline"
                }, n.description);
                return i.createElement(H.m$.div, iA({
                    ref: e
                }, r, {
                    className: (0, c.cx)("chakra-alert__desc", r.className),
                    __css: t
                }));
            });
            var iZ = function r(e) {
                var n = iL(), t = n.status;
                var o = iV[t].icon;
                var a = iF();
                var l = t === "loading" ? a.spinner : a.icon;
                return i.createElement(H.m$.span, iA({
                    display: "inherit"
                }, e, {
                    className: (0, c.cx)("chakra-alert__icon", e.className),
                    __css: l
                }), e.children || i.createElement(o, {
                    h: "100%",
                    w: "100%"
                }));
            };
            function iJ(r, e) {
                if (r == null) return {};
                var n = {};
                var t = Object.keys(r);
                var o, a;
                for(a = 0; a < t.length; a++){
                    o = t[a];
                    if (e.indexOf(o) >= 0) continue;
                    n[o] = r[o];
                }
                return n;
            }
            function iK() {
                iK = Object.assign ? Object.assign.bind() : function(r) {
                    for(var e = 1; e < arguments.length; e++){
                        var n = arguments[e];
                        for(var t in n){
                            if (Object.prototype.hasOwnProperty.call(n, t)) {
                                r[t] = n[t];
                            }
                        }
                    }
                    return r;
                };
                return iK.apply(this, arguments);
            }
            var iU = [
                "children",
                "isDisabled",
                "__css", 
            ];
            var iY = function r(e) {
                return i.createElement(iB.JO, iK({
                    focusable: "false",
                    "aria-hidden": true
                }, e), i.createElement("path", {
                    fill: "currentColor",
                    d: "M.439,21.44a1.5,1.5,0,0,0,2.122,2.121L11.823,14.3a.25.25,0,0,1,.354,0l9.262,9.263a1.5,1.5,0,1,0,2.122-2.121L14.3,12.177a.25.25,0,0,1,0-.354l9.263-9.262A1.5,1.5,0,0,0,21.439.44L12.177,9.7a.25.25,0,0,1-.354,0L2.561.44A1.5,1.5,0,0,0,.439,2.561L9.7,11.823a.25.25,0,0,1,0,.354Z"
                }));
            };
            var iQ = (0, H.Gp)(function(r, e) {
                var n = (0, H.mq)("CloseButton", r);
                var t = (0, H.Lr)(r), o = t.children, a = t.isDisabled, l = t.__css, u = iJ(t, iU);
                var s = {
                    outline: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                };
                return i.createElement(H.m$.button, iK({
                    type: "button",
                    "aria-label": "Close",
                    ref: e,
                    disabled: a,
                    __css: iK({}, s, n, l)
                }, u), o || i.createElement(iY, {
                    width: "1em",
                    height: "1em"
                }));
            });
            if (c.Ts) {
                iQ.displayName = "CloseButton";
            }
            var iX = n(5947);
            var lr = n(8970);
            var le = n(1190);
            function ln() {
                ln = Object.assign ? Object.assign.bind() : function(r) {
                    for(var e = 1; e < arguments.length; e++){
                        var n = arguments[e];
                        for(var t in n){
                            if (Object.prototype.hasOwnProperty.call(n, t)) {
                                r[t] = n[t];
                            }
                        }
                    }
                    return r;
                };
                return ln.apply(this, arguments);
            }
            function lt(r, e) {
                var n;
                var t = r != null ? r : "bottom";
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
                var a = o[t];
                return (n = a == null ? void 0 : a[e]) != null ? n : t;
            }
            function lo(r, e) {
                var n = la(r, e);
                var t = n ? r[n].findIndex(function(r) {
                    return r.id === e;
                }) : -1;
                return {
                    position: n,
                    index: t
                };
            }
            var la = function r(e, n) {
                var t;
                return (t = Object.values(e).flat().find(function(r) {
                    return r.id === n;
                })) == null ? void 0 : t.position;
            };
            function li(r) {
                var e = r.includes("right");
                var n = r.includes("left");
                var t = "center";
                if (e) t = "flex-end";
                if (n) t = "flex-start";
                return {
                    display: "flex",
                    flexDirection: "column",
                    alignItems: t
                };
            }
            function ll(r) {
                var e = r === "top" || r === "bottom";
                var n = e ? "0 auto" : undefined;
                var t = r.includes("top") ? "env(safe-area-inset-top, 0px)" : undefined;
                var o = r.includes("bottom") ? "env(safe-area-inset-bottom, 0px)" : undefined;
                var a = !r.includes("left") ? "env(safe-area-inset-right, 0px)" : undefined;
                var i = !r.includes("right") ? "env(safe-area-inset-left, 0px)" : undefined;
                return {
                    position: "fixed",
                    zIndex: 5500,
                    pointerEvents: "none",
                    display: "flex",
                    flexDirection: "column",
                    margin: n,
                    top: t,
                    bottom: o,
                    right: a,
                    left: i
                };
            }
            var lu = {
                top: [],
                "top-left": [],
                "top-right": [],
                "bottom-left": [],
                bottom: [],
                "bottom-right": []
            };
            var ls = lc(lu);
            function lc(r) {
                var e = r;
                var n = new Set();
                var t = function r(t) {
                    e = t(e);
                    n.forEach(function(r) {
                        return r();
                    });
                };
                return {
                    getState: function r() {
                        return e;
                    },
                    subscribe: function e(o) {
                        n.add(o);
                        return function() {
                            t(function() {
                                return r;
                            });
                            n["delete"](o);
                        };
                    },
                    removeToast: function r(e, n) {
                        t(function(r) {
                            var t;
                            return ln({}, r, ((t = {}), (t[n] = r[n].filter(function(r) {
                                return r.id != e;
                            })), t));
                        });
                    },
                    notify: function r(e, n) {
                        var o = ld(e, n);
                        var a = o.position, i = o.id;
                        t(function(r) {
                            var e, n, t;
                            var i = a.includes("top");
                            var l = i ? [
                                o
                            ].concat((e = r[a]) != null ? e : []) : [].concat((n = r[a]) != null ? n : [], [
                                o
                            ]);
                            return ln({}, r, ((t = {}), (t[a] = l), t));
                        });
                        return i;
                    },
                    update: function r(e, n) {
                        if (!e) return;
                        t(function(r) {
                            var t = ln({}, r);
                            var o = lo(t, e), a = o.position, i = o.index;
                            if (a && i !== -1) {
                                t[a][i] = ln({}, t[a][i], n, {
                                    message: l$(n)
                                });
                            }
                            return t;
                        });
                    },
                    closeAll: function r(e) {
                        var n = e === void 0 ? {} : e, o = n.positions;
                        t(function(r) {
                            var e = [
                                "bottom",
                                "bottom-right",
                                "bottom-left",
                                "top",
                                "top-left",
                                "top-right", 
                            ];
                            var n = o != null ? o : e;
                            return n.reduce(function(e, n) {
                                e[n] = r[n].map(function(r) {
                                    return ln({}, r, {
                                        requestClose: true
                                    });
                                });
                                return e;
                            }, ln({}, r));
                        });
                    },
                    close: function r(e) {
                        t(function(r) {
                            var n;
                            var t = la(r, e);
                            if (!t) return r;
                            return ln({}, r, ((n = {}), (n[t] = r[t].map(function(r) {
                                if (r.id == e) {
                                    return ln({}, r, {
                                        requestClose: true
                                    });
                                }
                                return r;
                            })), n));
                        });
                    },
                    isActive: function r(e) {
                        return Boolean(lo(ls.getState(), e).position);
                    }
                };
            }
            var lv = 0;
            function ld(r, e) {
                var n, t;
                if (e === void 0) {
                    e = {};
                }
                lv += 1;
                var o = (n = e.id) != null ? n : lv;
                var a = (t = e.position) != null ? t : "bottom";
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
                var n = e.status, t = e.variant, o = t === void 0 ? "solid" : t, a = e.id, l = e.title, u = e.isClosable, s = e.onClose, c = e.description, v = e.icon;
                var d = typeof a !== "undefined" ? "toast-" + a + "-title" : undefined;
                return i.createElement(ij, {
                    status: n,
                    variant: o,
                    id: String(a),
                    alignItems: "start",
                    borderRadius: "md",
                    boxShadow: "lg",
                    paddingEnd: 8,
                    textAlign: "start",
                    width: "auto",
                    "aria-labelledby": d
                }, i.createElement(iZ, null, v), i.createElement(H.m$.div, {
                    flex: "1",
                    maxWidth: "100%"
                }, l && i.createElement(i9, {
                    id: d
                }, l), c && i.createElement(iG, {
                    display: "block"
                }, c)), u && i.createElement(iQ, {
                    size: "sm",
                    onClick: s,
                    position: "absolute",
                    insetEnd: 1,
                    top: 1
                }));
            };
            function l$(r) {
                if (r === void 0) {
                    r = {};
                }
                var e = r, n = e.render, t = e.toastComponent, o = t === void 0 ? lf : t;
                var a = function e(t) {
                    if ((0, c.mf)(n)) {
                        return n(t);
                    }
                    return i.createElement(o, ln({}, t, r));
                };
                return a;
            }
            function lh(r, e) {
                var n = function n(t) {
                    var o;
                    return ln({}, e, t, {
                        position: lt((o = t == null ? void 0 : t.position) != null ? o : e == null ? void 0 : e.position, r)
                    });
                };
                var t = function r(e) {
                    var t = n(e);
                    var o = l$(t);
                    return ls.notify(o, t);
                };
                t.update = function(r, e) {
                    ls.update(r, n(e));
                };
                t.promise = function(r, e) {
                    var n = t(ln({}, e.loading, {
                        status: "loading",
                        duration: null
                    }));
                    r.then(function(r) {
                        return t.update(n, ln({
                            status: "success",
                            duration: 5000
                        }, runIfFn(e.success, r)));
                    })["catch"](function(r) {
                        return t.update(n, ln({
                            status: "error",
                            duration: 5000
                        }, runIfFn(e.error, r)));
                    });
                };
                t.closeAll = ls.closeAll;
                t.close = ls.close;
                t.isActive = ls.isActive;
                return t;
            }
            function lp(r) {
                var e = useChakra(), n = e.theme;
                return React.useMemo(function() {
                    return lh(n.direction, r);
                }, [
                    r,
                    n.direction
                ]);
            }
            var lb = {
                initial: function r(e) {
                    var n;
                    var t = e.position;
                    var o = [
                        "top",
                        "bottom"
                    ].includes(t) ? "y" : "x";
                    var a = [
                        "top-right",
                        "bottom-right"
                    ].includes(t) ? 1 : -1;
                    if (t === "bottom") a = 1;
                    return ((n = {
                        opacity: 0
                    }), (n[o] = a * 24), n);
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
            var lg = i.memo(function(r) {
                var e = r.id, n = r.message, t = r.onCloseComplete, o = r.onRequestRemove, a = r.requestClose, l = a === void 0 ? false : a, u = r.position, s = u === void 0 ? "bottom" : u, v = r.duration, f = v === void 0 ? 5000 : v, $ = r.containerStyle, h = r.motionVariants, p = h === void 0 ? lb : h, b = r.toastSpacing, g = b === void 0 ? "0.5rem" : b;
                var m = i.useState(f), y = m[0], x = m[1];
                var _ = (0, iX.hO)();
                (0, d.rf)(function() {
                    if (!_) {
                        t == null ? void 0 : t();
                    }
                }, [
                    _
                ]);
                (0, d.rf)(function() {
                    x(f);
                }, [
                    f
                ]);
                var S = function r() {
                    return x(null);
                };
                var w = function r() {
                    return x(f);
                };
                var k = function r() {
                    if (_) o();
                };
                i.useEffect(function() {
                    if (_ && l) {
                        o();
                    }
                }, [
                    _,
                    l,
                    o
                ]);
                (0, d.KS)(k, y);
                var z = i.useMemo(function() {
                    return ln({
                        pointerEvents: "auto",
                        maxWidth: 560,
                        minWidth: 300,
                        margin: g
                    }, $);
                }, [
                    $,
                    g
                ]);
                var C = i.useMemo(function() {
                    return li(s);
                }, [
                    s
                ]);
                return i.createElement(lr.E.li, {
                    layout: true,
                    className: "chakra-toast",
                    variants: p,
                    initial: "initial",
                    animate: "animate",
                    exit: "exit",
                    onHoverStart: S,
                    onHoverEnd: w,
                    custom: {
                        position: s
                    },
                    style: C
                }, i.createElement(H.m$.div, {
                    role: "status",
                    "aria-atomic": "true",
                    className: "chakra-toast__inner",
                    __css: z
                }, (0, c.Pu)(n, {
                    id: e,
                    onClose: k
                })));
            });
            if (c.Ts) {
                lg.displayName = "ToastComponent";
            }
            var lm = function r(e) {
                var n = i.useSyncExternalStore(ls.subscribe, ls.getState, ls.getState);
                var t = e.children, o = e.motionVariants, a = e.component, l = a === void 0 ? lg : a, u = e.portalProps;
                var s = (0, c.Yd)(n).map(function(r) {
                    var e = n[r];
                    return i.createElement("ul", {
                        role: "region",
                        "aria-live": "polite",
                        key: r,
                        id: "chakra-toast-manager-" + r,
                        style: ll(r)
                    }, i.createElement(le.M, {
                        initial: false
                    }, e.map(function(r) {
                        return i.createElement(l, ln({
                            key: r.id,
                            motionVariants: o
                        }, r));
                    })));
                });
                return i.createElement(i.Fragment, null, t, i.createElement(R, u, s));
            };
            var ly = {
                duration: 5000,
                variant: "solid"
            };
            var lx = {
                theme: i2,
                colorMode: "light",
                toggleColorMode: c.ZT,
                setColorMode: c.ZT,
                defaultOptions: ly
            };
            function l_(r) {
                var e = r === void 0 ? lx : r, n = e.theme, t = n === void 0 ? lx.theme : n, o = e.colorMode, a = o === void 0 ? lx.colorMode : o, i = e.toggleColorMode, l = i === void 0 ? lx.toggleColorMode : i, u = e.setColorMode, s = u === void 0 ? lx.setColorMode : u, c = e.defaultOptions, v = c === void 0 ? lx.defaultOptions : c, d = e.motionVariants, f = e.toastSpacing, $ = e.component;
                var h = {
                    colorMode: a,
                    setColorMode: s,
                    toggleColorMode: l
                };
                var p = function r() {
                    return React.createElement(ThemeProvider, {
                        theme: t
                    }, React.createElement(ColorModeContext.Provider, {
                        value: h
                    }, React.createElement(lm, {
                        defaultOptions: v,
                        motionVariants: d,
                        toastSpacing: f,
                        component: $
                    })));
                };
                return {
                    ToastContainer: p,
                    toast: lh(t.direction, v)
                };
            }
            function lS(r, e) {
                if (r == null) return {};
                var n = {};
                var t = Object.keys(r);
                var o, a;
                for(a = 0; a < t.length; a++){
                    o = t[a];
                    if (e.indexOf(o) >= 0) continue;
                    n[o] = r[o];
                }
                return n;
            }
            var lw = [
                "children",
                "toastOptions"
            ];
            var l0 = function r(e) {
                var n = e.children, t = e.toastOptions, o = lS(e, lw);
                return i.createElement(q, o, n, i.createElement(lm, t));
            };
            l0.defaultProps = {
                theme: i2
            };
            function l3() {
                for(var r = arguments.length, e = new Array(r), n = 0; n < r; n++){
                    e[n] = arguments[n];
                }
                var t = [].concat(e);
                var o = e[e.length - 1];
                if (isChakraTheme(o) && t.length > 1) {
                    t = t.slice(0, t.length - 1);
                } else {
                    o = theme$1;
                }
                return pipe.apply(void 0, t.map(function(r) {
                    return function(e) {
                        return isFunction(r) ? r(e) : lk(e, r);
                    };
                }))(o);
            }
            function lk() {
                for(var r = arguments.length, e = new Array(r), n = 0; n < r; n++){
                    e[n] = arguments[n];
                }
                return mergeWith.apply(void 0, [
                    {}
                ].concat(e, [
                    lz
                ]));
            }
            function lz(r, e, n, t) {
                if ((isFunction(r) || isFunction(e)) && Object.prototype.hasOwnProperty.call(t, n)) {
                    return function() {
                        var n = isFunction(r) ? r.apply(void 0, arguments) : r;
                        var t = isFunction(e) ? e.apply(void 0, arguments) : e;
                        return mergeWith({}, n, t, lz);
                    };
                }
                return undefined;
            }
            function l1(r) {
                var e = r.colorScheme, n = r.components;
                return function(r) {
                    var t = Object.keys(r.components || {});
                    if (Array.isArray(n)) {
                        t = n;
                    } else if (isObject(n)) {
                        t = Object.keys(n);
                    }
                    return lk(r, {
                        components: fromEntries(t.map(function(r) {
                            var n = {
                                defaultProps: {
                                    colorScheme: e
                                }
                            };
                            return [
                                r,
                                n
                            ];
                        }))
                    });
                };
            }
            function l4(r) {
                var e = r.size, n = r.components;
                return function(r) {
                    var t = Object.keys(r.components || {});
                    if (Array.isArray(n)) {
                        t = n;
                    } else if (isObject(n)) {
                        t = Object.keys(n);
                    }
                    return lk(r, {
                        components: fromEntries(t.map(function(r) {
                            var n = {
                                defaultProps: {
                                    size: e
                                }
                            };
                            return [
                                r,
                                n
                            ];
                        }))
                    });
                };
            }
            function l8(r) {
                var e = r.variant, n = r.components;
                return function(r) {
                    var t = Object.keys(r.components || {});
                    if (Array.isArray(n)) {
                        t = n;
                    } else if (isObject(n)) {
                        t = Object.keys(n);
                    }
                    return lk(r, {
                        components: fromEntries(t.map(function(r) {
                            var n = {
                                defaultProps: {
                                    variant: e
                                }
                            };
                            return [
                                r,
                                n
                            ];
                        }))
                    });
                };
            }
            function lC(r) {
                var e = r.defaultProps, n = e.colorScheme, t = e.variant, o = e.size, a = r.components;
                var i = function r(e) {
                    return e;
                };
                var l = [
                    n ? l1({
                        colorScheme: n,
                        components: a
                    }) : i,
                    o ? l4({
                        size: o,
                        components: a
                    }) : i,
                    t ? l8({
                        variant: t,
                        components: a
                    }) : i, 
                ];
                return function(r) {
                    return lk(pipe.apply(void 0, l)(r));
                };
            }
            function l2(r) {
                var e = r.Component, n = r.pageProps;
                return (0, a.jsx)(l0, {
                    children: (0, a.jsx)(e, o({}, n))
                });
            }
            var lE = l2;
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
        var n = r.O();
        _N_E = n;
    }, 
]);
