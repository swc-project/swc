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
                    return lD;
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
            function a(r) {
                for(var e = 1; e < arguments.length; e++){
                    var t = arguments[e] != null ? arguments[e] : {};
                    var a = Object.keys(t);
                    if (typeof Object.getOwnPropertySymbols === "function") {
                        a = a.concat(Object.getOwnPropertySymbols(t).filter(function(r) {
                            return Object.getOwnPropertyDescriptor(t, r).enumerable;
                        }));
                    }
                    a.forEach(function(e) {
                        n(r, e, t[e]);
                    });
                }
                return r;
            }
            var o = t(5893);
            var i = t(7294);
            var l = t(917);
            var s = function r() {
                return i.createElement(l.xB, {
                    styles: '\n      html {\n        line-height: 1.5;\n        -webkit-text-size-adjust: 100%;\n        font-family: system-ui, sans-serif;\n        -webkit-font-smoothing: antialiased;\n        text-rendering: optimizeLegibility;\n        -moz-osx-font-smoothing: grayscale;\n        touch-action: manipulation;\n      }\n\n      body {\n        position: relative;\n        min-height: 100%;\n        font-feature-settings: \'kern\';\n      }\n\n      *,\n      *::before,\n      *::after {\n        border-width: 0;\n        border-style: solid;\n        box-sizing: border-box;\n      }\n\n      main {\n        display: block;\n      }\n\n      hr {\n        border-top-width: 1px;\n        box-sizing: content-box;\n        height: 0;\n        overflow: visible;\n      }\n\n      pre,\n      code,\n      kbd,\n      samp {\n        font-family: SFMono-Regular,  Menlo, Monaco, Consolas, monospace;\n        font-size: 1em;\n      }\n\n      a {\n        background-color: transparent;\n        color: inherit;\n        text-decoration: inherit;\n      }\n\n      abbr[title] {\n        border-bottom: none;\n        text-decoration: underline;\n        -webkit-text-decoration: underline dotted;\n        text-decoration: underline dotted;\n      }\n\n      b,\n      strong {\n        font-weight: bold;\n      }\n\n      small {\n        font-size: 80%;\n      }\n\n      sub,\n      sup {\n        font-size: 75%;\n        line-height: 0;\n        position: relative;\n        vertical-align: baseline;\n      }\n\n      sub {\n        bottom: -0.25em;\n      }\n\n      sup {\n        top: -0.5em;\n      }\n\n      img {\n        border-style: none;\n      }\n\n      button,\n      input,\n      optgroup,\n      select,\n      textarea {\n        font-family: inherit;\n        font-size: 100%;\n        line-height: 1.15;\n        margin: 0;\n      }\n\n      button,\n      input {\n        overflow: visible;\n      }\n\n      button,\n      select {\n        text-transform: none;\n      }\n\n      button::-moz-focus-inner,\n      [type="button"]::-moz-focus-inner,\n      [type="reset"]::-moz-focus-inner,\n      [type="submit"]::-moz-focus-inner {\n        border-style: none;\n        padding: 0;\n      }\n\n      fieldset {\n        padding: 0.35em 0.75em 0.625em;\n      }\n\n      legend {\n        box-sizing: border-box;\n        color: inherit;\n        display: table;\n        max-width: 100%;\n        padding: 0;\n        white-space: normal;\n      }\n\n      progress {\n        vertical-align: baseline;\n      }\n\n      textarea {\n        overflow: auto;\n      }\n\n      [type="checkbox"],\n      [type="radio"] {\n        box-sizing: border-box;\n        padding: 0;\n      }\n\n      [type="number"]::-webkit-inner-spin-button,\n      [type="number"]::-webkit-outer-spin-button {\n        -webkit-appearance: none !important;\n      }\n\n      input[type="number"] {\n        -moz-appearance: textfield;\n      }\n\n      [type="search"] {\n        -webkit-appearance: textfield;\n        outline-offset: -2px;\n      }\n\n      [type="search"]::-webkit-search-decoration {\n        -webkit-appearance: none !important;\n      }\n\n      ::-webkit-file-upload-button {\n        -webkit-appearance: button;\n        font: inherit;\n      }\n\n      details {\n        display: block;\n      }\n\n      summary {\n        display: list-item;\n      }\n\n      template {\n        display: none;\n      }\n\n      [hidden] {\n        display: none !important;\n      }\n\n      body,\n      blockquote,\n      dl,\n      dd,\n      h1,\n      h2,\n      h3,\n      h4,\n      h5,\n      h6,\n      hr,\n      figure,\n      p,\n      pre {\n        margin: 0;\n      }\n\n      button {\n        background: transparent;\n        padding: 0;\n      }\n\n      fieldset {\n        margin: 0;\n        padding: 0;\n      }\n\n      ol,\n      ul {\n        margin: 0;\n        padding: 0;\n      }\n\n      textarea {\n        resize: vertical;\n      }\n\n      button,\n      [role="button"] {\n        cursor: pointer;\n      }\n\n      button::-moz-focus-inner {\n        border: 0 !important;\n      }\n\n      table {\n        border-collapse: collapse;\n      }\n\n      h1,\n      h2,\n      h3,\n      h4,\n      h5,\n      h6 {\n        font-size: inherit;\n        font-weight: inherit;\n      }\n\n      button,\n      input,\n      optgroup,\n      select,\n      textarea {\n        padding: 0;\n        line-height: inherit;\n        color: inherit;\n      }\n\n      img,\n      svg,\n      video,\n      canvas,\n      audio,\n      iframe,\n      embed,\n      object {\n        display: block;\n      }\n\n      img,\n      video {\n        max-width: 100%;\n        height: auto;\n      }\n\n      [data-js-focus-visible] :focus:not([data-focus-visible-added]):not([data-focus-visible-disabled]) {\n        outline: none;\n        box-shadow: none;\n      }\n\n      select::-ms-expand {\n        display: none;\n      }\n    '
                });
            };
            var u = s;
            var c = t(5031);
            var d = t(6450);
            var f = t(7375);
            var v = t(4697);
            var p = t(3935);
            var h = (0, d.kr)({
                strict: false,
                name: "PortalManagerContext"
            }), m = h[0], b = h[1];
            function g(r) {
                var e = r.children, t = r.zIndex;
                return i.createElement(m, {
                    value: {
                        zIndex: t
                    }
                }, e);
            }
            if (c.Ts) {
                g.displayName = "PortalManager";
            }
            function y() {
                y = Object.assign ? Object.assign.bind() : function(r) {
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
                return y.apply(this, arguments);
            }
            function x(r, e) {
                if (r == null) return {};
                var t = {};
                var n = Object.keys(r);
                var a, o;
                for(o = 0; o < n.length; o++){
                    a = n[o];
                    if (e.indexOf(a) >= 0) continue;
                    t[a] = r[a];
                }
                return t;
            }
            var w = [
                "containerRef"
            ];
            var S = (0, d.kr)({
                strict: false,
                name: "PortalContext"
            }), k = S[0], C = S[1];
            var A = "chakra-portal";
            var E = ".chakra-portal";
            var z = function r(e) {
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
            var F = function r(e) {
                var t = e.appendToParentPortal, n = e.children;
                var a = i.useRef(null);
                var o = i.useRef(null);
                var l = (0, f.NW)();
                var s = C();
                var u = b();
                (0, v.a)(function() {
                    if (!a.current) return;
                    var r = a.current.ownerDocument;
                    var e = t ? s != null ? s : r.body : r.body;
                    if (!e) return;
                    o.current = r.createElement("div");
                    o.current.className = A;
                    e.appendChild(o.current);
                    l();
                    var n = o.current;
                    return function() {
                        if (e.contains(n)) {
                            e.removeChild(n);
                        }
                    };
                }, []);
                var c = u != null && u.zIndex ? i.createElement(z, {
                    zIndex: u == null ? void 0 : u.zIndex
                }, n) : n;
                return o.current ? (0, p.createPortal)(i.createElement(k, {
                    value: o.current
                }, c), o.current) : i.createElement("span", {
                    ref: a
                });
            };
            var _ = function r(e) {
                var t = e.children, n = e.containerRef, a = e.appendToParentPortal;
                var o = n.current;
                var l = o != null ? o : c.jU ? document.body : undefined;
                var s = i.useMemo(function() {
                    var r = o == null ? void 0 : o.ownerDocument.createElement("div");
                    if (r) r.className = A;
                    return r;
                }, [
                    o
                ]);
                var u = (0, f.NW)();
                (0, v.a)(function() {
                    u();
                }, []);
                (0, v.a)(function() {
                    if (!s || !l) return;
                    l.appendChild(s);
                    return function() {
                        l.removeChild(s);
                    };
                }, [
                    s,
                    l
                ]);
                if (l && s) {
                    return (0, p.createPortal)(i.createElement(k, {
                        value: a ? s : null
                    }, t), s);
                }
                return null;
            };
            function B(r) {
                var e = r.containerRef, t = x(r, w);
                return e ? i.createElement(_, y({
                    containerRef: e
                }, t)) : i.createElement(F, t);
            }
            B.defaultProps = {
                appendToParentPortal: true
            };
            B.className = A;
            B.selector = E;
            if (c.Ts) {
                B.displayName = "Portal";
            }
            var M = t(2846);
            var R = t(949);
            var P = {
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
            var D = P;
            var O = function r() {};
            var H = {
                document: D,
                navigator: {
                    userAgent: ""
                },
                CustomEvent: function r() {
                    return this;
                },
                addEventListener: O,
                removeEventListener: O,
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
                        addListener: O,
                        removeListener: O
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
                clearTimeout: O,
                setInterval: function r() {
                    return 0;
                },
                clearInterval: O
            };
            var j = H;
            var W = {
                window: j,
                document: D
            };
            var T = c.jU ? {
                window: window,
                document: document
            } : W;
            var I = (0, i.createContext)(T);
            if (c.Ts) {
                I.displayName = "EnvironmentContext";
            }
            function N() {
                return useContext(I);
            }
            function L(r) {
                var e = r.children, t = r.environment;
                var n = (0, i.useState)(null), a = n[0], o = n[1];
                var l = (0, i.useMemo)(function() {
                    var r;
                    var e = a == null ? void 0 : a.ownerDocument;
                    var n = a == null ? void 0 : a.ownerDocument.defaultView;
                    var o = e ? {
                        document: e,
                        window: n
                    } : undefined;
                    var i = (r = t != null ? t : o) != null ? r : T;
                    return i;
                }, [
                    a,
                    t
                ]);
                return i.createElement(I.Provider, {
                    value: l
                }, e, i.createElement("span", {
                    hidden: true,
                    className: "chakra-env",
                    ref: function r(e) {
                        (0, i.startTransition)(function() {
                            if (e) o(e);
                        });
                    }
                }));
            }
            if (c.Ts) {
                L.displayName = "EnvironmentProvider";
            }
            var V = function r(e) {
                var t = e.children, n = e.colorModeManager, a = e.portalZIndex, o = e.resetCSS, l = o === void 0 ? true : o, s = e.theme, c = s === void 0 ? {} : s, d = e.environment, f = e.cssVarsRoot;
                var v = i.createElement(L, {
                    environment: d
                }, t);
                return i.createElement(M.f6, {
                    theme: c,
                    cssVarsRoot: f
                }, i.createElement(R.SG, {
                    colorModeManager: n,
                    options: c.config
                }, l && i.createElement(u, null), i.createElement(M.ZL, null), a ? i.createElement(g, {
                    zIndex: a
                }, v) : v));
            };
            var q = {
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
            function Z() {
                Z = Object.assign ? Object.assign.bind() : function(r) {
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
                return Z.apply(this, arguments);
            }
            var $ = {
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
            var G = Z({}, q, $, {
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
                var a = Math.min(r, e, t);
                var o = 0;
                var i = 0;
                var l = (n + a) / 2;
                if (n === a) {
                    i = 0;
                    o = 0;
                } else {
                    var s = n - a;
                    i = l > 0.5 ? s / (2 - n - a) : s / (n + a);
                    switch(n){
                        case r:
                            o = (e - t) / s + (e < t ? 6 : 0);
                            break;
                        case e:
                            o = (t - r) / s + 2;
                            break;
                        case t:
                            o = (r - e) / s + 4;
                            break;
                        default:
                            break;
                    }
                    o /= 6;
                }
                return {
                    h: o,
                    s: i,
                    l: l
                };
            }
            function ra(r, e, t) {
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
            function ro(r, e, t) {
                var n;
                var a;
                var o;
                r = J(r, 360);
                e = J(e, 100);
                t = J(t, 100);
                if (e === 0) {
                    a = t;
                    o = t;
                    n = t;
                } else {
                    var i = t < 0.5 ? t * (1 + e) : t + e - t * e;
                    var l = 2 * t - i;
                    n = ra(l, i, r + 1 / 3);
                    a = ra(l, i, r);
                    o = ra(l, i, r - 1 / 3);
                }
                return {
                    r: n * 255,
                    g: a * 255,
                    b: o * 255
                };
            }
            function ri(r, e, t) {
                r = J(r, 255);
                e = J(e, 255);
                t = J(t, 255);
                var n = Math.max(r, e, t);
                var a = Math.min(r, e, t);
                var o = 0;
                var i = n;
                var l = n - a;
                var s = n === 0 ? 0 : l / n;
                if (n === a) {
                    o = 0;
                } else {
                    switch(n){
                        case r:
                            o = (e - t) / l + (e < t ? 6 : 0);
                            break;
                        case e:
                            o = (t - r) / l + 2;
                            break;
                        case t:
                            o = (r - e) / l + 4;
                            break;
                        default:
                            break;
                    }
                    o /= 6;
                }
                return {
                    h: o,
                    s: s,
                    v: i
                };
            }
            function rl(r, e, t) {
                r = J(r, 360) * 6;
                e = J(e, 100);
                t = J(t, 100);
                var n = Math.floor(r);
                var a = r - n;
                var o = t * (1 - e);
                var i = t * (1 - a * e);
                var l = t * (1 - (1 - a) * e);
                var s = n % 6;
                var u = [
                    t,
                    i,
                    o,
                    o,
                    l,
                    t
                ][s];
                var c = [
                    l,
                    t,
                    t,
                    i,
                    o,
                    o
                ][s];
                var d = [
                    o,
                    o,
                    l,
                    t,
                    t,
                    i
                ][s];
                return {
                    r: u * 255,
                    g: c * 255,
                    b: d * 255
                };
            }
            function rs(r, e, t, n) {
                var a = [
                    re(Math.round(r).toString(16)),
                    re(Math.round(e).toString(16)),
                    re(Math.round(t).toString(16)), 
                ];
                if (n && a[0].startsWith(a[0].charAt(1)) && a[1].startsWith(a[1].charAt(1)) && a[2].startsWith(a[2].charAt(1))) {
                    return (a[0].charAt(0) + a[1].charAt(0) + a[2].charAt(0));
                }
                return a.join("");
            }
            function ru(r, e, t, n, a) {
                var o = [
                    re(Math.round(r).toString(16)),
                    re(Math.round(e).toString(16)),
                    re(Math.round(t).toString(16)),
                    re(rd(n)), 
                ];
                if (a && o[0].startsWith(o[0].charAt(1)) && o[1].startsWith(o[1].charAt(1)) && o[2].startsWith(o[2].charAt(1)) && o[3].startsWith(o[3].charAt(1))) {
                    return (o[0].charAt(0) + o[1].charAt(0) + o[2].charAt(0) + o[3].charAt(0));
                }
                return o.join("");
            }
            function rc(r, e, t, n) {
                var a = [
                    pad2(rd(n)),
                    pad2(Math.round(r).toString(16)),
                    pad2(Math.round(e).toString(16)),
                    pad2(Math.round(t).toString(16)), 
                ];
                return a.join("");
            }
            function rd(r) {
                return Math.round(parseFloat(r) * 255).toString(16);
            }
            function rf(r) {
                return rv(r) / 255;
            }
            function rv(r) {
                return parseInt(r, 16);
            }
            function rp(r) {
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
            function rm(r) {
                var e = {
                    r: 0,
                    g: 0,
                    b: 0
                };
                var t = 1;
                var n = null;
                var a = null;
                var o = null;
                var i = false;
                var l = false;
                if (typeof r === "string") {
                    r = rk(r);
                }
                if (typeof r === "object") {
                    if (rC(r.r) && rC(r.g) && rC(r.b)) {
                        e = rt(r.r, r.g, r.b);
                        i = true;
                        l = String(r.r).substr(-1) === "%" ? "prgb" : "rgb";
                    } else if (rC(r.h) && rC(r.s) && rC(r.v)) {
                        n = rr(r.s);
                        a = rr(r.v);
                        e = rl(r.h, n, a);
                        i = true;
                        l = "hsv";
                    } else if (rC(r.h) && rC(r.s) && rC(r.l)) {
                        n = rr(r.s);
                        o = rr(r.l);
                        e = ro(r.h, n, o);
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
            var rb = "[-\\+]?\\d+%?";
            var rg = "[-\\+]?\\d*\\.\\d+%?";
            var ry = "(?:".concat(rg, ")|(?:").concat(rb, ")");
            var rx = "[\\s|\\(]+(".concat(ry, ")[,|\\s]+(").concat(ry, ")[,|\\s]+(").concat(ry, ")\\s*\\)?");
            var rw = "[\\s|\\(]+(".concat(ry, ")[,|\\s]+(").concat(ry, ")[,|\\s]+(").concat(ry, ")[,|\\s]+(").concat(ry, ")\\s*\\)?");
            var rS = {
                CSS_UNIT: new RegExp(ry),
                rgb: new RegExp("rgb" + rx),
                rgba: new RegExp("rgba" + rw),
                hsl: new RegExp("hsl" + rx),
                hsla: new RegExp("hsla" + rw),
                hsv: new RegExp("hsv" + rx),
                hsva: new RegExp("hsva" + rw),
                hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
                hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
                hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
                hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
            };
            function rk(r) {
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
                var t = rS.rgb.exec(r);
                if (t) {
                    return {
                        r: t[1],
                        g: t[2],
                        b: t[3]
                    };
                }
                t = rS.rgba.exec(r);
                if (t) {
                    return {
                        r: t[1],
                        g: t[2],
                        b: t[3],
                        a: t[4]
                    };
                }
                t = rS.hsl.exec(r);
                if (t) {
                    return {
                        h: t[1],
                        s: t[2],
                        l: t[3]
                    };
                }
                t = rS.hsla.exec(r);
                if (t) {
                    return {
                        h: t[1],
                        s: t[2],
                        l: t[3],
                        a: t[4]
                    };
                }
                t = rS.hsv.exec(r);
                if (t) {
                    return {
                        h: t[1],
                        s: t[2],
                        v: t[3]
                    };
                }
                t = rS.hsva.exec(r);
                if (t) {
                    return {
                        h: t[1],
                        s: t[2],
                        v: t[3],
                        a: t[4]
                    };
                }
                t = rS.hex8.exec(r);
                if (t) {
                    return {
                        r: rv(t[1]),
                        g: rv(t[2]),
                        b: rv(t[3]),
                        a: rf(t[4]),
                        format: e ? "name" : "hex8"
                    };
                }
                t = rS.hex6.exec(r);
                if (t) {
                    return {
                        r: rv(t[1]),
                        g: rv(t[2]),
                        b: rv(t[3]),
                        format: e ? "name" : "hex"
                    };
                }
                t = rS.hex4.exec(r);
                if (t) {
                    return {
                        r: rv(t[1] + t[1]),
                        g: rv(t[2] + t[2]),
                        b: rv(t[3] + t[3]),
                        a: rf(t[4] + t[4]),
                        format: e ? "name" : "hex8"
                    };
                }
                t = rS.hex3.exec(r);
                if (t) {
                    return {
                        r: rv(t[1] + t[1]),
                        g: rv(t[2] + t[2]),
                        b: rv(t[3] + t[3]),
                        format: e ? "name" : "hex"
                    };
                }
                return false;
            }
            function rC(r) {
                return Boolean(rS.CSS_UNIT.exec(String(r)));
            }
            var rA = (function() {
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
                        e = rp(e);
                    }
                    this.originalInput = e;
                    var a = rm(e);
                    this.originalInput = e;
                    this.r = a.r;
                    this.g = a.g;
                    this.b = a.b;
                    this.a = a.a;
                    this.roundA = Math.round(100 * this.a) / 100;
                    this.format = (n = t.format) !== null && n !== void 0 ? n : a.format;
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
                    this.isValid = a.ok;
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
                    var a = r.r / 255;
                    var o = r.g / 255;
                    var i = r.b / 255;
                    if (a <= 0.03928) {
                        e = a / 12.92;
                    } else {
                        e = Math.pow((a + 0.055) / 1.055, 2.4);
                    }
                    if (o <= 0.03928) {
                        t = o / 12.92;
                    } else {
                        t = Math.pow((o + 0.055) / 1.055, 2.4);
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
                    return rs(this.r, this.g, this.b, r);
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
                    return ru(this.r, this.g, this.b, this.a, r);
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
                    var r = "#" + rs(this.r, this.g, this.b, false);
                    for(var e = 0, t = Object.entries(rh); e < t.length; e++){
                        var n = t[e], a = n[0], o = n[1];
                        if (r === o) {
                            return a;
                        }
                    }
                    return false;
                };
                r.prototype.toString = function(r) {
                    var e = Boolean(r);
                    r = r !== null && r !== void 0 ? r : this.format;
                    var t = false;
                    var n = this.a < 1 && this.a >= 0;
                    var a = !e && n && (r.startsWith("hex") || r === "name");
                    if (a) {
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
                    var a = new r(e).toRgb();
                    var o = t / 100;
                    var i = {
                        r: (a.r - n.r) * o + n.r,
                        g: (a.g - n.g) * o + n.g,
                        b: (a.b - n.b) * o + n.b,
                        a: (a.a - n.a) * o + n.a
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
                    var a = 360 / t;
                    var o = [
                        this
                    ];
                    for(n.h = (n.h - ((a * e) >> 1) + 720) % 360; --e;){
                        n.h = (n.h + a) % 360;
                        o.push(new r(n));
                    }
                    return o;
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
                    var a = t.s;
                    var o = t.v;
                    var i = [];
                    var l = 1 / e;
                    while(e--){
                        i.push(new r({
                            h: n,
                            s: a,
                            v: o
                        }));
                        o = (o + l) % 1;
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
                    var a = [
                        this
                    ];
                    var o = 360 / e;
                    for(var i = 1; i < e; i++){
                        a.push(new r({
                            h: (n + i * o) % 360,
                            s: t.s,
                            l: t.l
                        }));
                    }
                    return a;
                };
                r.prototype.equals = function(e) {
                    return (this.toRgbString() === new r(e).toRgbString());
                };
                return r;
            })();
            function rE(r, e) {
                if (r === void 0) {
                    r = "";
                }
                if (e === void 0) {
                    e = {};
                }
                return new rA(r, e);
            }
            function rz(r) {
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
                        t.push(rz(r));
                    }
                    r.count = e;
                    return t;
                }
                var n = rF(r.hue, r.seed);
                var a = r_(n, r);
                var o = rB(n, a, r);
                var i = {
                    h: n,
                    s: a,
                    v: o
                };
                if (r.alpha !== undefined) {
                    i.a = r.alpha;
                }
                return new rA(i);
            }
            function rF(r, e) {
                var t = rR(r);
                var n = rD(t, e);
                if (n < 0) {
                    n = 360 + n;
                }
                return n;
            }
            function r_(r, e) {
                if (e.hue === "monochrome") {
                    return 0;
                }
                if (e.luminosity === "random") {
                    return rD([
                        0,
                        100
                    ], e.seed);
                }
                var t = rP(r).saturationRange;
                var n = t[0];
                var a = t[1];
                switch(e.luminosity){
                    case "bright":
                        n = 55;
                        break;
                    case "dark":
                        n = a - 10;
                        break;
                    case "light":
                        a = 55;
                        break;
                    default:
                        break;
                }
                return rD([
                    n,
                    a
                ], e.seed);
            }
            function rB(r, e, t) {
                var n = rM(r, e);
                var a = 100;
                switch(t.luminosity){
                    case "dark":
                        a = n + 20;
                        break;
                    case "light":
                        n = (a + n) / 2;
                        break;
                    case "random":
                        n = 0;
                        a = 100;
                        break;
                    default:
                        break;
                }
                return rD([
                    n,
                    a
                ], t.seed);
            }
            function rM(r, e) {
                var t = rP(r).lowerBounds;
                for(var n = 0; n < t.length - 1; n++){
                    var a = t[n][0];
                    var o = t[n][1];
                    var i = t[n + 1][0];
                    var l = t[n + 1][1];
                    if (e >= a && e <= i) {
                        var s = (l - o) / (i - a);
                        var u = o - s * a;
                        return s * e + u;
                    }
                }
                return 0;
            }
            function rR(r) {
                var e = parseInt(r, 10);
                if (!Number.isNaN(e) && e < 360 && e > 0) {
                    return [
                        e,
                        e
                    ];
                }
                if (typeof r === "string") {
                    var t = rH.find(function(e) {
                        return e.name === r;
                    });
                    if (t) {
                        var n = rO(t);
                        if (n.hueRange) {
                            return n.hueRange;
                        }
                    }
                    var a = new rA(r);
                    if (a.isValid) {
                        var o = a.toHsv().h;
                        return [
                            o,
                            o
                        ];
                    }
                }
                return [
                    0,
                    360
                ];
            }
            function rP(r) {
                if (r >= 334 && r <= 360) {
                    r -= 360;
                }
                for(var e = 0, t = rH; e < t.length; e++){
                    var n = t[e];
                    var a = rO(n);
                    if (a.hueRange && r >= a.hueRange[0] && r <= a.hueRange[1]) {
                        return a;
                    }
                }
                throw Error("Color not found");
            }
            function rD(r, e) {
                if (e === undefined) {
                    return Math.floor(r[0] + Math.random() * (r[1] + 1 - r[0]));
                }
                var t = r[1] || 1;
                var n = r[0] || 0;
                e = (e * 9301 + 49297) % 233280;
                var a = e / 233280.0;
                return Math.floor(n + a * (t - n));
            }
            function rO(r) {
                var e = r.lowerBounds[0][0];
                var t = r.lowerBounds[r.lowerBounds.length - 1][0];
                var n = r.lowerBounds[r.lowerBounds.length - 1][1];
                var a = r.lowerBounds[0][1];
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
                        a
                    ]
                };
            }
            var rH = [
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
            var rj = function r(e, t, n) {
                var a = (0, c.Wf)(e, "colors." + t, t);
                var o = new rA(a), i = o.isValid;
                return i ? a : n;
            };
            var rW = function r(e) {
                return function(r) {
                    var t = rj(r, e);
                    var n = new rA(t).isDark();
                    return n ? "dark" : "light";
                };
            };
            var rT = function r(e) {
                return function(r) {
                    return rW(e)(r) === "dark";
                };
            };
            var rI = function r(e) {
                return function(r) {
                    return rW(e)(r) === "light";
                };
            };
            var rN = function r(e, t) {
                return function(r) {
                    var n = rj(r, e);
                    return new rA(n).setAlpha(t).toRgbString();
                };
            };
            var rL = function r(e, t) {
                return function(r) {
                    var n = rj(r, e);
                    return new TinyColor(n).mix("#fff", t).toHexString();
                };
            };
            var rV = function r(e, t) {
                return function(r) {
                    var n = rj(r, e);
                    return new TinyColor(n).mix("#000", t).toHexString();
                };
            };
            var rq = function r(e, t) {
                return function(r) {
                    var n = rj(r, e);
                    return new TinyColor(n).darken(t).toHexString();
                };
            };
            var rZ = function r(e, t) {
                return function(r) {
                    return new TinyColor(rj(r, e)).lighten(t).toHexString();
                };
            };
            var r$ = function r(e, t) {
                return function(r) {
                    return readability(rj(r, t), rj(r, e));
                };
            };
            var rU = function r(e, t, n) {
                return function(r) {
                    return isReadable(rj(r, t), rj(r, e), n);
                };
            };
            var rG = function r(e) {
                return function(r) {
                    return new TinyColor(rj(r, e)).complement().toHexString();
                };
            };
            function rJ(r, e) {
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
            function rK(r) {
                var e = rz().toHexString();
                if (!r || (0, c.Qr)(r)) {
                    return e;
                }
                if (r.string && r.colors) {
                    return rY(r.string, r.colors);
                }
                if (r.string && !r.colors) {
                    return rX(r.string);
                }
                if (r.colors && !r.string) {
                    return rQ(r.colors);
                }
                return e;
            }
            function rX(r) {
                var e = 0;
                if (r.length === 0) return e.toString();
                for(var t = 0; t < r.length; t += 1){
                    e = r.charCodeAt(t) + ((e << 5) - e);
                    e = e & e;
                }
                var n = "#";
                for(var a = 0; a < 3; a += 1){
                    var o = (e >> (a * 8)) & 255;
                    n += ("00" + o.toString(16)).substr(-2);
                }
                return n;
            }
            function rY(r, e) {
                var t = 0;
                if (r.length === 0) return e[0];
                for(var n = 0; n < r.length; n += 1){
                    t = r.charCodeAt(n) + ((t << 5) - t);
                    t = t & t;
                }
                t = ((t % e.length) + e.length) % e.length;
                return e[t];
            }
            function rQ(r) {
                return r[Math.floor(Math.random() * r.length)];
            }
            function r0(r, e) {
                return function(t) {
                    return t.colorMode === "dark" ? e : r;
                };
            }
            function r1(r) {
                var e = r.orientation, t = r.vertical, n = r.horizontal;
                if (!e) return {};
                return e === "vertical" ? t : n;
            }
            function r2() {
                r2 = Object.assign ? Object.assign.bind() : function(r) {
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
                return r2.apply(this, arguments);
            }
            var r5 = function r(e) {
                (0, c.ZK)({
                    condition: true,
                    message: [
                        "[chakra-ui]: createBreakpoints(...) will be deprecated pretty soon",
                        "simply pass the breakpoints as an object. Remove the createBreakpoint(..) call", 
                    ].join("")
                });
                return r2({
                    base: "0em"
                }, e);
            };
            function r4(r, e) {
                for(var t = 0; t < e.length; t++){
                    var n = e[t];
                    n.enumerable = n.enumerable || false;
                    n.configurable = true;
                    if ("value" in n) n.writable = true;
                    Object.defineProperty(r, n.key, n);
                }
            }
            function r6(r, e, t) {
                if (e) r4(r.prototype, e);
                if (t) r4(r, t);
                Object.defineProperty(r, "prototype", {
                    writable: false
                });
                return r;
            }
            var r3 = (function() {
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
                        for(var a = 0, o = t; a < o.length; a++){
                            var i = o[a];
                            e.map[i] = e.toPart(i);
                        }
                        return e;
                    };
                    this.extend = function() {
                        for(var r = arguments.length, t = new Array(r), n = 0; n < r; n++){
                            t[n] = arguments[n];
                        }
                        for(var a = 0, o = t; a < o.length; a++){
                            var i = o[a];
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
                        var a = "chakra-" + n;
                        var o = {
                            className: a,
                            selector: "." + a,
                            toString: function e() {
                                return r;
                            }
                        };
                        return o;
                    };
                    this.__type = {};
                }
                r6(r, [
                    {
                        key: "selectors",
                        get: function r() {
                            var e = (0, c.sq)(Object.entries(this.map).map(function(r) {
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
                            var e = (0, c.sq)(Object.entries(this.map).map(function(r) {
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
            function r8(r) {
                return new r3(r);
            }
            function r7(r) {
                if ((0, c.Kn)(r) && r.reference) {
                    return r.reference;
                }
                return String(r);
            }
            var r9 = function r(e) {
                for(var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), a = 1; a < t; a++){
                    n[a - 1] = arguments[a];
                }
                return n.map(r7).join(" " + e + " ").replace(/calc/g, "");
            };
            var er = function r() {
                for(var e = arguments.length, t = new Array(e), n = 0; n < e; n++){
                    t[n] = arguments[n];
                }
                return ("calc(" + r9.apply(void 0, [
                    "+"
                ].concat(t)) + ")");
            };
            var ee = function r() {
                for(var e = arguments.length, t = new Array(e), n = 0; n < e; n++){
                    t[n] = arguments[n];
                }
                return ("calc(" + r9.apply(void 0, [
                    "-"
                ].concat(t)) + ")");
            };
            var et = function r() {
                for(var e = arguments.length, t = new Array(e), n = 0; n < e; n++){
                    t[n] = arguments[n];
                }
                return ("calc(" + r9.apply(void 0, [
                    "*"
                ].concat(t)) + ")");
            };
            var en = function r() {
                for(var e = arguments.length, t = new Array(e), n = 0; n < e; n++){
                    t[n] = arguments[n];
                }
                return ("calc(" + r9.apply(void 0, [
                    "/"
                ].concat(t)) + ")");
            };
            var ea = function r(e) {
                var t = r7(e);
                if (t != null && !Number.isNaN(parseFloat(t))) {
                    return String(t).startsWith("-") ? String(t).slice(1) : "-" + t;
                }
                return et(t, -1);
            };
            var eo = Object.assign(function(r) {
                return {
                    add: function e() {
                        for(var t = arguments.length, n = new Array(t), a = 0; a < t; a++){
                            n[a] = arguments[a];
                        }
                        return eo(er.apply(void 0, [
                            r
                        ].concat(n)));
                    },
                    subtract: function e() {
                        for(var t = arguments.length, n = new Array(t), a = 0; a < t; a++){
                            n[a] = arguments[a];
                        }
                        return eo(ee.apply(void 0, [
                            r
                        ].concat(n)));
                    },
                    multiply: function e() {
                        for(var t = arguments.length, n = new Array(t), a = 0; a < t; a++){
                            n[a] = arguments[a];
                        }
                        return eo(et.apply(void 0, [
                            r
                        ].concat(n)));
                    },
                    divide: function e() {
                        for(var t = arguments.length, n = new Array(t), a = 0; a < t; a++){
                            n[a] = arguments[a];
                        }
                        return eo(en.apply(void 0, [
                            r
                        ].concat(n)));
                    },
                    negate: function e() {
                        return eo(ea(r));
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
                negate: ea
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
            function es(r) {
                var e = el(r.toString());
                if (e.includes("\\.")) return r;
                return ei(r) ? e.replace(".", "\\.") : r;
            }
            function eu(r, e) {
                if (e === void 0) {
                    e = "";
                }
                return [
                    e,
                    es(r)
                ].filter(Boolean).join("-");
            }
            function ec(r, e) {
                return ("var(" + es(r) + (e ? ", " + e : "") + ")");
            }
            function ed(r, e) {
                if (e === void 0) {
                    e = "";
                }
                return "--" + eu(r, e);
            }
            function ef(r, e) {
                var t = ed(r, e == null ? void 0 : e.prefix);
                return {
                    variable: t,
                    reference: ec(t, ev(e == null ? void 0 : e.fallback))
                };
            }
            function ev(r) {
                if (typeof r === "string") return r;
                return r == null ? void 0 : r.reference;
            }
            var ep = r8("accordion").parts("root", "container", "button", "panel").extend("icon");
            var eh = r8("alert").parts("title", "description", "container").extend("icon", "spinner");
            var em = r8("avatar").parts("label", "badge", "container").extend("excessLabel", "group");
            var eb = r8("breadcrumb").parts("link", "item", "container").extend("separator");
            var eg = r8("button").parts();
            var ey = r8("checkbox").parts("control", "icon", "container").extend("label");
            var ex = r8("progress").parts("track", "filledTrack").extend("label");
            var ew = r8("drawer").parts("overlay", "dialogContainer", "dialog").extend("header", "closeButton", "body", "footer");
            var eS = r8("editable").parts("preview", "input", "textarea");
            var ek = r8("form").parts("container", "requiredIndicator", "helperText");
            var eC = r8("formError").parts("text", "icon");
            var eA = r8("input").parts("addon", "field", "element");
            var eE = r8("list").parts("container", "item", "icon");
            var ez = r8("menu").parts("button", "list", "item").extend("groupTitle", "command", "divider");
            var eF = r8("modal").parts("overlay", "dialogContainer", "dialog").extend("header", "closeButton", "body", "footer");
            var e_ = r8("numberinput").parts("root", "field", "stepperGroup", "stepper");
            var eB = r8("pininput").parts("field");
            var eM = r8("popover").parts("content", "header", "body", "footer").extend("popper", "arrow", "closeButton");
            var eR = r8("progress").parts("label", "filledTrack", "track");
            var eP = r8("radio").parts("container", "control", "label");
            var eD = r8("select").parts("field", "icon");
            var eO = r8("slider").parts("container", "track", "thumb", "filledTrack");
            var eH = r8("stat").parts("container", "label", "helpText", "number", "icon");
            var ej = r8("switch").parts("container", "track", "thumb");
            var eW = r8("table").parts("table", "thead", "tbody", "tr", "th", "td", "tfoot", "caption");
            var eT = r8("tabs").parts("root", "tab", "tablist", "tabpanel", "tabpanels", "indicator");
            var eI = r8("tag").parts("container", "label", "closeButton");
            var eN = {
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
            var eL = t(8554);
            var eV = t.n(eL);
            var eq = {
                borderTopWidth: "1px",
                borderColor: "inherit",
                _last: {
                    borderBottomWidth: "1px"
                }
            };
            var eZ = {
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
            var e$ = {
                pt: 2,
                px: 4,
                pb: 5
            };
            var eU = {
                fontSize: "1.25em"
            };
            var eG = {
                root: {},
                container: eq,
                button: eZ,
                panel: e$,
                icon: eU
            };
            var eJ = {
                parts: ep.keys,
                baseStyle: eG
            };
            var eK = {
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
            function eX(r) {
                var e = r.theme, t = r.colorScheme;
                var n = rj(e, t + ".100", t);
                var a = rN(t + ".200", 0.16)(e);
                return r0(n, a)(r);
            }
            var eY = function r(e) {
                var t = e.colorScheme;
                return {
                    container: {
                        bg: eX(e)
                    },
                    icon: {
                        color: r0(t + ".500", t + ".200")(e)
                    },
                    spinner: {
                        color: r0(t + ".500", t + ".200")(e)
                    }
                };
            };
            var eQ = function r(e) {
                var t = e.colorScheme;
                return {
                    container: {
                        paddingStart: 3,
                        borderStartWidth: "4px",
                        borderStartColor: r0(t + ".500", t + ".200")(e),
                        bg: eX(e)
                    },
                    icon: {
                        color: r0(t + ".500", t + ".200")(e)
                    },
                    spinner: {
                        color: r0(t + ".500", t + ".200")(e)
                    }
                };
            };
            var e0 = function r(e) {
                var t = e.colorScheme;
                return {
                    container: {
                        pt: 2,
                        borderTopWidth: "4px",
                        borderTopColor: r0(t + ".500", t + ".200")(e),
                        bg: eX(e)
                    },
                    icon: {
                        color: r0(t + ".500", t + ".200")(e)
                    },
                    spinner: {
                        color: r0(t + ".500", t + ".200")(e)
                    }
                };
            };
            var e1 = function r(e) {
                var t = e.colorScheme;
                return {
                    container: {
                        bg: r0(t + ".500", t + ".200")(e),
                        color: r0("white", "gray.900")(e)
                    }
                };
            };
            var e2 = {
                subtle: eY,
                "left-accent": eQ,
                "top-accent": e0,
                solid: e1
            };
            var e5 = {
                variant: "subtle",
                colorScheme: "blue"
            };
            var e4 = {
                parts: eh.keys,
                baseStyle: eK,
                variants: e2,
                defaultProps: e5
            };
            var e6 = function r(e) {
                return {
                    transform: "translate(25%, 25%)",
                    borderRadius: "full",
                    border: "0.2em solid",
                    borderColor: r0("white", "gray.800")(e)
                };
            };
            var e3 = function r(e) {
                return {
                    bg: r0("gray.200", "whiteAlpha.400")(e)
                };
            };
            var e8 = function r(e) {
                var t = e.name, n = e.theme;
                var a = t ? rK({
                    string: t
                }) : "gray.400";
                var o = rT(a)(n);
                var i = "white";
                if (!o) i = "gray.800";
                var l = r0("white", "gray.800")(e);
                return {
                    bg: a,
                    color: i,
                    borderColor: l,
                    verticalAlign: "top"
                };
            };
            var e7 = function r(e) {
                return {
                    badge: e6(e),
                    excessLabel: e3(e),
                    container: e8(e)
                };
            };
            function e9(r) {
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
                "2xs": e9(4),
                xs: e9(6),
                sm: e9(8),
                md: e9(12),
                lg: e9(16),
                xl: e9(24),
                "2xl": e9(32),
                full: e9("100%")
            };
            var te = {
                size: "md"
            };
            var tt = {
                parts: em.keys,
                baseStyle: e7,
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
            var ta = function r(e) {
                var t = e.colorScheme, n = e.theme;
                var a = rN(t + ".500", 0.6)(n);
                return {
                    bg: r0(t + ".500", a)(e),
                    color: r0("white", "whiteAlpha.800")(e)
                };
            };
            var to = function r(e) {
                var t = e.colorScheme, n = e.theme;
                var a = rN(t + ".200", 0.16)(n);
                return {
                    bg: r0(t + ".100", a)(e),
                    color: r0(t + ".800", t + ".200")(e)
                };
            };
            var ti = function r(e) {
                var t = e.colorScheme, n = e.theme;
                var a = rN(t + ".200", 0.8)(n);
                var o = rj(n, t + ".500");
                var i = r0(o, a)(e);
                return {
                    color: i,
                    boxShadow: "inset 0 0 0px 1px " + i
                };
            };
            var tl = {
                solid: ta,
                subtle: to,
                outline: ti
            };
            var ts = {
                variant: "subtle",
                colorScheme: "gray"
            };
            var tu = {
                baseStyle: tn,
                variants: tl,
                defaultProps: ts
            };
            var tc = {
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
            var td = {
                link: tc
            };
            var tf = {
                parts: eb.keys,
                baseStyle: td
            };
            var tv = {
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
            var tp = function r(e) {
                var t = e.colorScheme, n = e.theme;
                if (t === "gray") {
                    return {
                        color: r0("inherit", "whiteAlpha.900")(e),
                        _hover: {
                            bg: r0("gray.100", "whiteAlpha.200")(e)
                        },
                        _active: {
                            bg: r0("gray.200", "whiteAlpha.300")(e)
                        }
                    };
                }
                var a = rN(t + ".200", 0.12)(n);
                var o = rN(t + ".200", 0.24)(n);
                return {
                    color: r0(t + ".600", t + ".200")(e),
                    bg: "transparent",
                    _hover: {
                        bg: r0(t + ".50", a)(e)
                    },
                    _active: {
                        bg: r0(t + ".100", o)(e)
                    }
                };
            };
            var th = function r(e) {
                var t = e.colorScheme;
                var n = r0("gray.200", "whiteAlpha.300")(e);
                return Z({
                    border: "1px solid",
                    borderColor: t === "gray" ? n : "currentColor",
                    ".chakra-button__group[data-attached] > &:not(:last-of-type)": {
                        marginEnd: "-1px"
                    }
                }, tp(e));
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
            var tb = function r(e) {
                var t;
                var n = e.colorScheme;
                if (n === "gray") {
                    var a = r0("gray.100", "whiteAlpha.200")(e);
                    return {
                        bg: a,
                        _hover: {
                            bg: r0("gray.200", "whiteAlpha.300")(e),
                            _disabled: {
                                bg: a
                            }
                        },
                        _active: {
                            bg: r0("gray.300", "whiteAlpha.400")(e)
                        }
                    };
                }
                var o = (t = tm[n]) != null ? t : {}, i = o.bg, l = i === void 0 ? n + ".500" : i, s = o.color, u = s === void 0 ? "white" : s, c = o.hoverBg, d = c === void 0 ? n + ".600" : c, f = o.activeBg, v = f === void 0 ? n + ".700" : f;
                var p = r0(l, n + ".200")(e);
                return {
                    bg: p,
                    color: r0(u, "gray.800")(e),
                    _hover: {
                        bg: r0(d, n + ".300")(e),
                        _disabled: {
                            bg: p
                        }
                    },
                    _active: {
                        bg: r0(v, n + ".400")(e)
                    }
                };
            };
            var tg = function r(e) {
                var t = e.colorScheme;
                return {
                    padding: 0,
                    height: "auto",
                    lineHeight: "normal",
                    verticalAlign: "baseline",
                    color: r0(t + ".500", t + ".200")(e),
                    _hover: {
                        textDecoration: "underline",
                        _disabled: {
                            textDecoration: "none"
                        }
                    },
                    _active: {
                        color: r0(t + ".700", t + ".500")(e)
                    }
                };
            };
            var ty = {
                bg: "none",
                color: "inherit",
                display: "inline",
                lineHeight: "inherit",
                m: 0,
                p: 0
            };
            var tx = {
                ghost: tp,
                outline: th,
                solid: tb,
                link: tg,
                unstyled: ty
            };
            var tw = {
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
            var tS = {
                variant: "solid",
                size: "md",
                colorScheme: "gray"
            };
            var tk = {
                baseStyle: tv,
                variants: tx,
                sizes: tw,
                defaultProps: tS
            };
            var tC = function r(e) {
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
                        bg: r0(t + ".500", t + ".200")(e),
                        borderColor: r0(t + ".500", t + ".200")(e),
                        color: r0("white", "gray.900")(e),
                        _hover: {
                            bg: r0(t + ".600", t + ".300")(e),
                            borderColor: r0(t + ".600", t + ".300")(e)
                        },
                        _disabled: {
                            borderColor: r0("gray.200", "transparent")(e),
                            bg: r0("gray.200", "whiteAlpha.300")(e),
                            color: r0("gray.500", "whiteAlpha.500")(e)
                        }
                    },
                    _indeterminate: {
                        bg: r0(t + ".500", t + ".200")(e),
                        borderColor: r0(t + ".500", t + ".200")(e),
                        color: r0("white", "gray.900")(e)
                    },
                    _disabled: {
                        bg: r0("gray.100", "whiteAlpha.100")(e),
                        borderColor: r0("gray.100", "transparent")(e)
                    },
                    _focusVisible: {
                        boxShadow: "outline"
                    },
                    _invalid: {
                        borderColor: r0("red.500", "red.300")(e)
                    }
                };
            };
            var tA = {
                _disabled: {
                    cursor: "not-allowed"
                }
            };
            var tE = {
                userSelect: "none",
                _disabled: {
                    opacity: 0.4
                }
            };
            var tz = {
                transitionProperty: "transform",
                transitionDuration: "normal"
            };
            var tF = function r(e) {
                return {
                    icon: tz,
                    container: tA,
                    control: tC(e),
                    label: tE
                };
            };
            var t_ = {
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
            var tB = {
                size: "md",
                colorScheme: "blue"
            };
            var tM = {
                parts: ey.keys,
                baseStyle: tF,
                sizes: t_,
                defaultProps: tB
            };
            var tR, tP, tD;
            var tO = ef("close-button-size");
            var tH = function r(e) {
                var t = r0("blackAlpha.100", "whiteAlpha.100")(e);
                var n = r0("blackAlpha.200", "whiteAlpha.200")(e);
                return {
                    w: [
                        tO.reference
                    ],
                    h: [
                        tO.reference
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
            var tj = {
                lg: ((tR = {}), (tR[tO.variable] = "40px"), (tR.fontSize = "16px"), tR),
                md: ((tP = {}), (tP[tO.variable] = "32px"), (tP.fontSize = "12px"), tP),
                sm: ((tD = {}), (tD[tO.variable] = "24px"), (tD.fontSize = "10px"), tD)
            };
            var tW = {
                size: "md"
            };
            var tT = {
                baseStyle: tH,
                sizes: tj,
                defaultProps: tW
            };
            var tI = tu.variants, tN = tu.defaultProps;
            var tL = {
                fontFamily: "mono",
                fontSize: "sm",
                px: "0.2em",
                borderRadius: "sm"
            };
            var tV = {
                baseStyle: tL,
                variants: tI,
                defaultProps: tN
            };
            var tq = {
                w: "100%",
                mx: "auto",
                maxW: "60ch",
                px: "1rem"
            };
            var tZ = {
                baseStyle: tq
            };
            var t$ = {
                opacity: 0.6,
                borderColor: "inherit"
            };
            var tU = {
                borderStyle: "solid"
            };
            var tG = {
                borderStyle: "dashed"
            };
            var tJ = {
                solid: tU,
                dashed: tG
            };
            var tK = {
                variant: "solid"
            };
            var tX = {
                baseStyle: t$,
                variants: tJ,
                defaultProps: tK
            };
            function tY(r) {
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
            var tQ = {
                bg: "blackAlpha.600",
                zIndex: "overlay"
            };
            var t0 = {
                display: "flex",
                zIndex: "modal",
                justifyContent: "center"
            };
            var t1 = function r(e) {
                var t = e.isFullHeight;
                return Z({}, t && {
                    height: "100vh"
                }, {
                    zIndex: "modal",
                    maxH: "100vh",
                    bg: r0("white", "gray.700")(e),
                    color: "inherit",
                    boxShadow: r0("lg", "dark-lg")(e)
                });
            };
            var t2 = {
                px: 6,
                py: 4,
                fontSize: "xl",
                fontWeight: "semibold"
            };
            var t5 = {
                position: "absolute",
                top: 2,
                insetEnd: 3
            };
            var t4 = {
                px: 6,
                py: 2,
                flex: 1,
                overflow: "auto"
            };
            var t6 = {
                px: 6,
                py: 4
            };
            var t3 = function r(e) {
                return {
                    overlay: tQ,
                    dialogContainer: t0,
                    dialog: t1(e),
                    header: t2,
                    closeButton: t5,
                    body: t4,
                    footer: t6
                };
            };
            var t8 = {
                xs: tY("xs"),
                sm: tY("md"),
                md: tY("lg"),
                lg: tY("2xl"),
                xl: tY("4xl"),
                full: tY("full")
            };
            var t7 = {
                size: "xs"
            };
            var t9 = {
                parts: ew.keys,
                baseStyle: t3,
                sizes: t8,
                defaultProps: t7
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
            var na = {
                parts: eS.keys,
                baseStyle: nn
            };
            var no = function r(e) {
                return {
                    marginStart: 1,
                    color: r0("red.500", "red.300")(e)
                };
            };
            var ni = function r(e) {
                return {
                    mt: 2,
                    color: r0("gray.500", "whiteAlpha.600")(e),
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
                    requiredIndicator: no(e),
                    helperText: ni(e)
                };
            };
            var ns = {
                parts: ek.keys,
                baseStyle: nl
            };
            var nu = function r(e) {
                return {
                    color: r0("red.500", "red.300")(e),
                    mt: 2,
                    fontSize: "sm",
                    lineHeight: "normal"
                };
            };
            var nc = function r(e) {
                return {
                    marginEnd: "0.5em",
                    color: r0("red.500", "red.300")(e)
                };
            };
            var nd = function r(e) {
                return {
                    text: nu(e),
                    icon: nc(e)
                };
            };
            var nf = {
                parts: eC.keys,
                baseStyle: nd
            };
            var nv = {
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
            var np = {
                baseStyle: nv
            };
            var nh = {
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
            var nb = {
                size: "xl"
            };
            var ng = {
                baseStyle: nh,
                sizes: nm,
                defaultProps: nb
            };
            var ny = {
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
            var nx = {
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
            var nw = {
                lg: {
                    field: nx.lg,
                    addon: nx.lg
                },
                md: {
                    field: nx.md,
                    addon: nx.md
                },
                sm: {
                    field: nx.sm,
                    addon: nx.sm
                },
                xs: {
                    field: nx.xs,
                    addon: nx.xs
                }
            };
            function nS(r) {
                var e = r.focusBorderColor, t = r.errorBorderColor;
                return {
                    focusBorderColor: e || r0("blue.500", "blue.300")(r),
                    errorBorderColor: t || r0("red.500", "red.300")(r)
                };
            }
            var nk = function r(e) {
                var t = e.theme;
                var n = nS(e), a = n.focusBorderColor, o = n.errorBorderColor;
                return {
                    field: {
                        border: "1px solid",
                        borderColor: "inherit",
                        bg: "inherit",
                        _hover: {
                            borderColor: r0("gray.300", "whiteAlpha.400")(e)
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
                            borderColor: rj(t, o),
                            boxShadow: "0 0 0 1px " + rj(t, o)
                        },
                        _focusVisible: {
                            zIndex: 1,
                            borderColor: rj(t, a),
                            boxShadow: "0 0 0 1px " + rj(t, a)
                        }
                    },
                    addon: {
                        border: "1px solid",
                        borderColor: r0("inherit", "whiteAlpha.50")(e),
                        bg: r0("gray.100", "whiteAlpha.300")(e)
                    }
                };
            };
            var nC = function r(e) {
                var t = e.theme;
                var n = nS(e), a = n.focusBorderColor, o = n.errorBorderColor;
                return {
                    field: {
                        border: "2px solid",
                        borderColor: "transparent",
                        bg: r0("gray.100", "whiteAlpha.50")(e),
                        _hover: {
                            bg: r0("gray.200", "whiteAlpha.100")(e)
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
                            borderColor: rj(t, o)
                        },
                        _focusVisible: {
                            bg: "transparent",
                            borderColor: rj(t, a)
                        }
                    },
                    addon: {
                        border: "2px solid",
                        borderColor: "transparent",
                        bg: r0("gray.100", "whiteAlpha.50")(e)
                    }
                };
            };
            var nA = function r(e) {
                var t = e.theme;
                var n = nS(e), a = n.focusBorderColor, o = n.errorBorderColor;
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
                            borderColor: rj(t, o),
                            boxShadow: "0px 1px 0px 0px " + rj(t, o)
                        },
                        _focusVisible: {
                            borderColor: rj(t, a),
                            boxShadow: "0px 1px 0px 0px " + rj(t, a)
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
            var nE = {
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
            var nz = {
                outline: nk,
                filled: nC,
                flushed: nA,
                unstyled: nE
            };
            var nF = {
                size: "md",
                variant: "outline"
            };
            var n_ = {
                parts: eA.keys,
                baseStyle: ny,
                sizes: nw,
                variants: nz,
                defaultProps: nF
            };
            var nB = function r(e) {
                return {
                    bg: r0("gray.100", "whiteAlpha")(e),
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
            var nM = {
                baseStyle: nB
            };
            var nR = {
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
            var nP = {
                baseStyle: nR
            };
            var nD = {
                marginEnd: "0.5rem",
                display: "inline",
                verticalAlign: "text-bottom"
            };
            var nO = {
                container: {},
                item: {},
                icon: nD
            };
            var nH = {
                parts: eE.keys,
                baseStyle: nO
            };
            var nj = function r(e) {
                return {
                    bg: r0("#fff", "gray.700")(e),
                    boxShadow: r0("sm", "dark-lg")(e),
                    color: "inherit",
                    minW: "3xs",
                    py: "2",
                    zIndex: 1,
                    borderRadius: "md",
                    borderWidth: "1px"
                };
            };
            var nW = function r(e) {
                return {
                    py: "0.4rem",
                    px: "0.8rem",
                    transitionProperty: "background",
                    transitionDuration: "ultra-fast",
                    transitionTimingFunction: "ease-in",
                    _focus: {
                        bg: r0("gray.100", "whiteAlpha.100")(e)
                    },
                    _active: {
                        bg: r0("gray.200", "whiteAlpha.200")(e)
                    },
                    _expanded: {
                        bg: r0("gray.100", "whiteAlpha.100")(e)
                    },
                    _disabled: {
                        opacity: 0.4,
                        cursor: "not-allowed"
                    }
                };
            };
            var nT = {
                mx: 4,
                my: 2,
                fontWeight: "semibold",
                fontSize: "sm"
            };
            var nI = {
                opacity: 0.6
            };
            var nN = {
                border: 0,
                borderBottom: "1px solid",
                borderColor: "inherit",
                my: "0.5rem",
                opacity: 0.6
            };
            var nL = {
                transitionProperty: "common",
                transitionDuration: "normal"
            };
            var nV = function r(e) {
                return {
                    button: nL,
                    list: nj(e),
                    item: nW(e),
                    groupTitle: nT,
                    command: nI,
                    divider: nN
                };
            };
            var nq = {
                parts: ez.keys,
                baseStyle: nV
            };
            var nZ = {
                bg: "blackAlpha.600",
                zIndex: "modal"
            };
            var n$ = function r(e) {
                var t = e.isCentered, n = e.scrollBehavior;
                return {
                    display: "flex",
                    zIndex: "modal",
                    justifyContent: "center",
                    alignItems: t ? "center" : "flex-start",
                    overflow: n === "inside" ? "hidden" : "auto"
                };
            };
            var nU = function r(e) {
                var t = e.scrollBehavior;
                return {
                    borderRadius: "md",
                    bg: r0("white", "gray.700")(e),
                    color: "inherit",
                    my: "3.75rem",
                    zIndex: "modal",
                    maxH: t === "inside" ? "calc(100% - 7.5rem)" : undefined,
                    boxShadow: r0("lg", "dark-lg")(e)
                };
            };
            var nG = {
                px: 6,
                py: 4,
                fontSize: "xl",
                fontWeight: "semibold"
            };
            var nJ = {
                position: "absolute",
                top: 2,
                insetEnd: 3
            };
            var nK = function r(e) {
                var t = e.scrollBehavior;
                return {
                    px: 6,
                    py: 2,
                    flex: 1,
                    overflow: t === "inside" ? "auto" : undefined
                };
            };
            var nX = {
                px: 6,
                py: 4
            };
            var nY = function r(e) {
                return {
                    overlay: nZ,
                    dialogContainer: n$(e),
                    dialog: nU(e),
                    header: nG,
                    closeButton: nJ,
                    body: nK(e),
                    footer: nX
                };
            };
            function nQ(r) {
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
            var n0 = {
                xs: nQ("xs"),
                sm: nQ("sm"),
                md: nQ("md"),
                lg: nQ("lg"),
                xl: nQ("xl"),
                "2xl": nQ("2xl"),
                "3xl": nQ("3xl"),
                "4xl": nQ("4xl"),
                "5xl": nQ("5xl"),
                "6xl": nQ("6xl"),
                full: nQ("full")
            };
            var n1 = {
                size: "md"
            };
            var n2 = {
                parts: eF.keys,
                baseStyle: nY,
                sizes: n0,
                defaultProps: n1
            };
            var n5, n4, n6;
            var n3 = n_.variants, n8 = n_.defaultProps;
            var n7 = ef("number-input-stepper-width");
            var n9 = ef("number-input-input-padding");
            var ar = eo(n7).add("0.5rem").toString();
            var ae = ((n5 = {}), (n5[n7.variable] = "24px"), (n5[n9.variable] = ar), n5);
            var at = (n4 = (n6 = n_.baseStyle) == null ? void 0 : n6.field) != null ? n4 : {};
            var an = {
                width: [
                    n7.reference
                ]
            };
            var aa = function r(e) {
                return {
                    borderStart: "1px solid",
                    borderStartColor: r0("inherit", "whiteAlpha.300")(e),
                    color: r0("inherit", "whiteAlpha.800")(e),
                    _active: {
                        bg: r0("gray.200", "whiteAlpha.300")(e)
                    },
                    _disabled: {
                        opacity: 0.4,
                        cursor: "not-allowed"
                    }
                };
            };
            var ao = function r(e) {
                return {
                    root: ae,
                    field: at,
                    stepperGroup: an,
                    stepper: aa(e)
                };
            };
            function ai(r) {
                var e, t;
                var n = n_.sizes[r];
                var a = {
                    lg: "md",
                    md: "md",
                    sm: "sm",
                    xs: "sm"
                };
                var o = (e = (t = n.field) == null ? void 0 : t.fontSize) != null ? e : "md";
                var i = eN.fontSizes[o];
                return {
                    field: Z({}, n.field, {
                        paddingInlineEnd: n9.reference,
                        verticalAlign: "top"
                    }),
                    stepper: {
                        fontSize: eo(i).multiply(0.75).toString(),
                        _first: {
                            borderTopEndRadius: a[r]
                        },
                        _last: {
                            borderBottomEndRadius: a[r],
                            mt: "-1px",
                            borderTopWidth: 1
                        }
                    }
                };
            }
            var al = {
                xs: ai("xs"),
                sm: ai("sm"),
                md: ai("md"),
                lg: ai("lg")
            };
            var as = {
                parts: e_.keys,
                baseStyle: ao,
                sizes: al,
                variants: n3,
                defaultProps: n8
            };
            var au;
            var ac = Z({}, n_.baseStyle.field, {
                textAlign: "center"
            });
            var ad = {
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
            var af = {
                outline: function r(e) {
                    var t;
                    return (t = n_.variants.outline(e).field) != null ? t : {};
                },
                flushed: function r(e) {
                    var t;
                    return (t = n_.variants.flushed(e).field) != null ? t : {};
                },
                filled: function r(e) {
                    var t;
                    return (t = n_.variants.filled(e).field) != null ? t : {};
                },
                unstyled: (au = n_.variants.unstyled.field) != null ? au : {}
            };
            var av = n_.defaultProps;
            var ap = {
                baseStyle: ac,
                sizes: ad,
                variants: af,
                defaultProps: av
            };
            var ah = ef("popper-bg");
            var am = ef("popper-arrow-bg");
            var ab = ef("popper-arrow-shadow-color");
            var ag = {
                zIndex: 10
            };
            var ay = function r(e) {
                var t;
                var n = r0("white", "gray.700")(e);
                var a = r0("gray.200", "whiteAlpha.300")(e);
                return ((t = {}), (t[ah.variable] = "colors." + n), (t.bg = ah.reference), (t[am.variable] = ah.reference), (t[ab.variable] = "colors." + a), (t.width = "xs"), (t.border = "1px solid"), (t.borderColor = "inherit"), (t.borderRadius = "md"), (t.boxShadow = "sm"), (t.zIndex = "inherit"), (t._focusVisible = {
                    outline: 0,
                    boxShadow: "outline"
                }), t);
            };
            var ax = {
                px: 3,
                py: 2,
                borderBottomWidth: "1px"
            };
            var aw = {
                px: 3,
                py: 2
            };
            var aS = {
                px: 3,
                py: 2,
                borderTopWidth: "1px"
            };
            var ak = {
                position: "absolute",
                borderRadius: "md",
                top: 1,
                insetEnd: 2,
                padding: 2
            };
            var aC = function r(e) {
                return {
                    popper: ag,
                    content: ay(e),
                    header: ax,
                    body: aw,
                    footer: aS,
                    arrow: {},
                    closeButton: ak
                };
            };
            var aA = {
                parts: eM.keys,
                baseStyle: aC
            };
            function aE(r) {
                var e = r.colorScheme, t = r.theme, n = r.isIndeterminate, a = r.hasStripe;
                var o = r0(rJ(), rJ("1rem", "rgba(0,0,0,0.1)"))(r);
                var i = r0(e + ".500", e + ".200")(r);
                var l = "linear-gradient(\n    to right,\n    transparent 0%,\n    " + rj(t, i) + " 50%,\n    transparent 100%\n  )";
                var s = !n && a;
                return Z({}, s && o, n ? {
                    bgImage: l
                } : {
                    bgColor: i
                });
            }
            var az = {
                lineHeight: "1",
                fontSize: "0.25em",
                fontWeight: "bold",
                color: "white"
            };
            var aF = function r(e) {
                return {
                    bg: r0("gray.100", "whiteAlpha.300")(e)
                };
            };
            var a_ = function r(e) {
                return Z({
                    transitionProperty: "common",
                    transitionDuration: "slow"
                }, aE(e));
            };
            var aB = function r(e) {
                return {
                    label: az,
                    filledTrack: a_(e),
                    track: aF(e)
                };
            };
            var aM = {
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
            var aR = {
                size: "md",
                colorScheme: "blue"
            };
            var aP = {
                parts: eR.keys,
                sizes: aM,
                baseStyle: aB,
                defaultProps: aR
            };
            var aD = function r(e) {
                var t = tM.baseStyle(e), n = t.control, a = n === void 0 ? {} : n;
                return Z({}, a, {
                    borderRadius: "full",
                    _checked: Z({}, a["_checked"], {
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
            var aO = function r(e) {
                return {
                    label: tM.baseStyle(e).label,
                    container: tM.baseStyle(e).container,
                    control: aD(e)
                };
            };
            var aH = {
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
            var aj = {
                size: "md",
                colorScheme: "blue"
            };
            var aW = {
                parts: eP.keys,
                baseStyle: aO,
                sizes: aH,
                defaultProps: aj
            };
            var aT = function r(e) {
                return Z({}, n_.baseStyle.field, {
                    bg: r0("white", "gray.700")(e),
                    appearance: "none",
                    paddingBottom: "1px",
                    lineHeight: "normal",
                    "> option, > optgroup": {
                        bg: r0("white", "gray.700")(e)
                    }
                });
            };
            var aI = {
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
            var aN = function r(e) {
                return {
                    field: aT(e),
                    icon: aI
                };
            };
            var aL = {
                paddingInlineEnd: "2rem"
            };
            var aV = eV()({}, n_.sizes, {
                lg: {
                    field: aL
                },
                md: {
                    field: aL
                },
                sm: {
                    field: aL
                },
                xs: {
                    field: aL,
                    icon: {
                        insetEnd: "0.25rem"
                    }
                }
            });
            var aq = {
                parts: eD.keys,
                baseStyle: aN,
                sizes: aV,
                variants: n_.variants,
                defaultProps: n_.defaultProps
            };
            var aZ = function r(e, t) {
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
            var a$ = function r(e) {
                var t = r0("gray.100", "gray.800")(e);
                var n = r0("gray.400", "gray.600")(e);
                var a = e.startColor, o = a === void 0 ? t : a, i = e.endColor, l = i === void 0 ? n : i, s = e.speed, u = e.theme;
                var c = rj(u, o);
                var d = rj(u, l);
                return {
                    opacity: 0.7,
                    borderRadius: "2px",
                    borderColor: c,
                    background: d,
                    animation: s + "s linear infinite alternate " + aZ(c, d)
                };
            };
            var aU = {
                baseStyle: a$
            };
            var aG = function r(e) {
                return {
                    borderRadius: "md",
                    fontWeight: "semibold",
                    _focusVisible: {
                        boxShadow: "outline",
                        padding: "1rem",
                        position: "fixed",
                        top: "1.5rem",
                        insetStart: "1.5rem",
                        bg: r0("white", "gray.700")(e)
                    }
                };
            };
            var aJ = {
                baseStyle: aG
            };
            function aK(r) {
                return r1({
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
            var aX = function r(e) {
                var t = e.orientation;
                return Z({
                    display: "inline-block",
                    position: "relative",
                    cursor: "pointer",
                    _disabled: {
                        opacity: 0.6,
                        cursor: "default",
                        pointerEvents: "none"
                    }
                }, r1({
                    orientation: t,
                    vertical: {
                        h: "100%"
                    },
                    horizontal: {
                        w: "100%"
                    }
                }));
            };
            var aY = function r(e) {
                return {
                    overflow: "hidden",
                    borderRadius: "sm",
                    bg: r0("gray.200", "whiteAlpha.200")(e),
                    _disabled: {
                        bg: r0("gray.300", "whiteAlpha.300")(e)
                    }
                };
            };
            var aQ = function r(e) {
                return Z({
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
                }, aK(e));
            };
            var a0 = function r(e) {
                var t = e.colorScheme;
                return {
                    width: "inherit",
                    height: "inherit",
                    bg: r0(t + ".500", t + ".200")(e)
                };
            };
            var a1 = function r(e) {
                return {
                    container: aX(e),
                    track: aY(e),
                    thumb: aQ(e),
                    filledTrack: a0(e)
                };
            };
            var a2 = function r(e) {
                return {
                    thumb: {
                        w: "16px",
                        h: "16px"
                    },
                    track: r1({
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
            var a5 = function r(e) {
                return {
                    thumb: {
                        w: "14px",
                        h: "14px"
                    },
                    track: r1({
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
            var a4 = function r(e) {
                return {
                    thumb: {
                        w: "10px",
                        h: "10px"
                    },
                    track: r1({
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
            var a6 = {
                lg: a2,
                md: a5,
                sm: a4
            };
            var a3 = {
                size: "md",
                colorScheme: "blue"
            };
            var a8 = {
                parts: eO.keys,
                sizes: a6,
                baseStyle: a1,
                defaultProps: a3
            };
            var a7, a9, or, oe, ot;
            var on = ef("spinner-size");
            var oa = {
                width: [
                    on.reference
                ],
                height: [
                    on.reference
                ]
            };
            var oo = {
                xs: ((a7 = {}), (a7[on.variable] = "0.75rem"), a7),
                sm: ((a9 = {}), (a9[on.variable] = "1rem"), a9),
                md: ((or = {}), (or[on.variable] = "1.5rem"), or),
                lg: ((oe = {}), (oe[on.variable] = "2rem"), oe),
                xl: ((ot = {}), (ot[on.variable] = "3rem"), ot)
            };
            var oi = {
                size: "md"
            };
            var ol = {
                baseStyle: oa,
                sizes: oo,
                defaultProps: oi
            };
            var os = {
                fontWeight: "medium"
            };
            var ou = {
                opacity: 0.8,
                marginBottom: 2
            };
            var oc = {
                verticalAlign: "baseline",
                fontWeight: "semibold"
            };
            var od = {
                marginEnd: 1,
                w: "14px",
                h: "14px",
                verticalAlign: "middle"
            };
            var of = {
                container: {},
                label: os,
                helpText: ou,
                number: oc,
                icon: od
            };
            var ov = {
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
            var op = {
                size: "md"
            };
            var oh = {
                parts: eH.keys,
                baseStyle: of,
                sizes: ov,
                defaultProps: op
            };
            var om, ob, og;
            var oy = ef("switch-track-width");
            var ox = ef("switch-track-height");
            var ow = ef("switch-track-diff");
            var oS = eo.subtract(oy, ox);
            var ok = ef("switch-thumb-x");
            var oC = function r(e) {
                var t = e.colorScheme;
                return {
                    borderRadius: "full",
                    p: "2px",
                    width: [
                        oy.reference
                    ],
                    height: [
                        ox.reference
                    ],
                    transitionProperty: "common",
                    transitionDuration: "fast",
                    bg: r0("gray.300", "whiteAlpha.400")(e),
                    _focusVisible: {
                        boxShadow: "outline"
                    },
                    _disabled: {
                        opacity: 0.4,
                        cursor: "not-allowed"
                    },
                    _checked: {
                        bg: r0(t + ".500", t + ".200")(e)
                    }
                };
            };
            var oA = {
                bg: "white",
                transitionProperty: "transform",
                transitionDuration: "normal",
                borderRadius: "inherit",
                width: [
                    ox.reference
                ],
                height: [
                    ox.reference
                ],
                _checked: {
                    transform: "translateX(" + ok.reference + ")"
                }
            };
            var oE = function r(e) {
                var t, n;
                return {
                    container: ((n = {}), (n[ow.variable] = oS), (n[ok.variable] = ow.reference), (n._rtl = ((t = {}), (t[ok.variable] = eo(ow).negate().toString()), t)), n),
                    track: oC(e),
                    thumb: oA
                };
            };
            var oz = {
                sm: {
                    container: ((om = {}), (om[oy.variable] = "1.375rem"), (om[ox.variable] = "0.75rem"), om)
                },
                md: {
                    container: ((ob = {}), (ob[oy.variable] = "1.875rem"), (ob[ox.variable] = "1rem"), ob)
                },
                lg: {
                    container: ((og = {}), (og[oy.variable] = "2.875rem"), (og[ox.variable] = "1.5rem"), og)
                }
            };
            var oF = {
                size: "md",
                colorScheme: "blue"
            };
            var o_ = {
                parts: ej.keys,
                baseStyle: oE,
                sizes: oz,
                defaultProps: oF
            };
            var oB = {
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
            var oM = {
                "&[data-is-numeric=true]": {
                    textAlign: "end"
                }
            };
            var oR = function r(e) {
                var t = e.colorScheme;
                return {
                    th: Z({
                        color: r0("gray.600", "gray.400")(e),
                        borderBottom: "1px",
                        borderColor: r0(t + ".100", t + ".700")(e)
                    }, oM),
                    td: Z({
                        borderBottom: "1px",
                        borderColor: r0(t + ".100", t + ".700")(e)
                    }, oM),
                    caption: {
                        color: r0("gray.600", "gray.100")(e)
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
            var oP = function r(e) {
                var t = e.colorScheme;
                return {
                    th: Z({
                        color: r0("gray.600", "gray.400")(e),
                        borderBottom: "1px",
                        borderColor: r0(t + ".100", t + ".700")(e)
                    }, oM),
                    td: Z({
                        borderBottom: "1px",
                        borderColor: r0(t + ".100", t + ".700")(e)
                    }, oM),
                    caption: {
                        color: r0("gray.600", "gray.100")(e)
                    },
                    tbody: {
                        tr: {
                            "&:nth-of-type(odd)": {
                                "th, td": {
                                    borderBottomWidth: "1px",
                                    borderColor: r0(t + ".100", t + ".700")(e)
                                },
                                td: {
                                    background: r0(t + ".100", t + ".700")(e)
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
            var oD = {
                simple: oR,
                striped: oP,
                unstyled: {}
            };
            var oO = {
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
            var oH = {
                variant: "simple",
                size: "md",
                colorScheme: "gray"
            };
            var oj = {
                parts: eW.keys,
                baseStyle: oB,
                variants: oD,
                sizes: oO,
                defaultProps: oH
            };
            var oW = function r(e) {
                var t = e.orientation;
                return {
                    display: t === "vertical" ? "flex" : "block"
                };
            };
            var oT = function r(e) {
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
            var oI = function r(e) {
                var t = e.align, n = t === void 0 ? "start" : t, a = e.orientation;
                var o = {
                    end: "flex-end",
                    center: "center",
                    start: "flex-start"
                };
                return {
                    justifyContent: o[n],
                    flexDirection: a === "vertical" ? "column" : "row"
                };
            };
            var oN = {
                p: 4
            };
            var oL = function r(e) {
                return {
                    root: oW(e),
                    tab: oT(e),
                    tablist: oI(e),
                    tabpanel: oN
                };
            };
            var oV = {
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
            var oq = function r(e) {
                var t, n;
                var a = e.colorScheme, o = e.orientation;
                var i = o === "vertical";
                var l = o === "vertical" ? "borderStart" : "borderBottom";
                var s = i ? "marginStart" : "marginBottom";
                return {
                    tablist: ((t = {}), (t[l] = "2px solid"), (t.borderColor = "inherit"), t),
                    tab: ((n = {}), (n[l] = "2px solid"), (n.borderColor = "transparent"), (n[s] = "-2px"), (n._selected = {
                        color: r0(a + ".600", a + ".300")(e),
                        borderColor: "currentColor"
                    }), (n._active = {
                        bg: r0("gray.200", "whiteAlpha.300")(e)
                    }), (n._disabled = {
                        _active: {
                            bg: "none"
                        }
                    }), n)
                };
            };
            var oZ = function r(e) {
                var t = e.colorScheme;
                return {
                    tab: {
                        borderTopRadius: "md",
                        border: "1px solid",
                        borderColor: "transparent",
                        mb: "-1px",
                        _selected: {
                            color: r0(t + ".600", t + ".300")(e),
                            borderColor: "inherit",
                            borderBottomColor: r0("white", "gray.800")(e)
                        }
                    },
                    tablist: {
                        mb: "-1px",
                        borderBottom: "1px solid",
                        borderColor: "inherit"
                    }
                };
            };
            var o$ = function r(e) {
                var t = e.colorScheme;
                return {
                    tab: {
                        border: "1px solid",
                        borderColor: "inherit",
                        bg: r0("gray.50", "whiteAlpha.50")(e),
                        mb: "-1px",
                        _notLast: {
                            marginEnd: "-1px"
                        },
                        _selected: {
                            bg: r0("#fff", "gray.800")(e),
                            color: r0(t + ".600", t + ".300")(e),
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
            var oU = function r(e) {
                var t = e.colorScheme, n = e.theme;
                return {
                    tab: {
                        borderRadius: "full",
                        fontWeight: "semibold",
                        color: "gray.600",
                        _selected: {
                            color: rj(n, t + ".700"),
                            bg: rj(n, t + ".100")
                        }
                    }
                };
            };
            var oG = function r(e) {
                var t = e.colorScheme;
                return {
                    tab: {
                        borderRadius: "full",
                        fontWeight: "semibold",
                        color: r0("gray.600", "inherit")(e),
                        _selected: {
                            color: r0("#fff", "gray.800")(e),
                            bg: r0(t + ".600", t + ".300")(e)
                        }
                    }
                };
            };
            var oJ = {};
            var oK = {
                line: oq,
                enclosed: oZ,
                "enclosed-colored": o$,
                "soft-rounded": oU,
                "solid-rounded": oG,
                unstyled: oJ
            };
            var oX = {
                size: "md",
                variant: "line",
                colorScheme: "blue"
            };
            var oY = {
                parts: eT.keys,
                baseStyle: oL,
                sizes: oV,
                variants: oK,
                defaultProps: oX
            };
            var oQ = {
                fontWeight: "medium",
                lineHeight: 1.2,
                outline: 0,
                borderRadius: "md",
                _focusVisible: {
                    boxShadow: "outline"
                }
            };
            var o0 = {
                lineHeight: 1.2,
                overflow: "visible"
            };
            var o1 = {
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
            var o2 = {
                container: oQ,
                label: o0,
                closeButton: o1
            };
            var o5 = {
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
            var o4 = {
                subtle: function r(e) {
                    return {
                        container: tu.variants.subtle(e)
                    };
                },
                solid: function r(e) {
                    return {
                        container: tu.variants.solid(e)
                    };
                },
                outline: function r(e) {
                    return {
                        container: tu.variants.outline(e)
                    };
                }
            };
            var o6 = {
                size: "md",
                variant: "subtle",
                colorScheme: "gray"
            };
            var o3 = {
                parts: eI.keys,
                variants: o4,
                baseStyle: o2,
                sizes: o5,
                defaultProps: o6
            };
            var o8, o7, o9, ir, ie;
            var it = Z({}, n_.baseStyle.field, {
                paddingY: "8px",
                minHeight: "80px",
                lineHeight: "short",
                verticalAlign: "top"
            });
            var ia = {
                outline: function r(e) {
                    var t;
                    return (t = n_.variants.outline(e).field) != null ? t : {};
                },
                flushed: function r(e) {
                    var t;
                    return (t = n_.variants.flushed(e).field) != null ? t : {};
                },
                filled: function r(e) {
                    var t;
                    return (t = n_.variants.filled(e).field) != null ? t : {};
                },
                unstyled: (o8 = n_.variants.unstyled.field) != null ? o8 : {}
            };
            var io = {
                xs: (o7 = n_.sizes.xs.field) != null ? o7 : {},
                sm: (o9 = n_.sizes.sm.field) != null ? o9 : {},
                md: (ir = n_.sizes.md.field) != null ? ir : {},
                lg: (ie = n_.sizes.lg.field) != null ? ie : {}
            };
            var ii = {
                size: "md",
                variant: "outline"
            };
            var il = {
                baseStyle: it,
                sizes: io,
                variants: ia,
                defaultProps: ii
            };
            var is = ef("tooltip-bg");
            var iu = ef("popper-arrow-bg");
            var ic = function r(e) {
                var t;
                var n = r0("gray.700", "gray.300")(e);
                return ((t = {}), (t[is.variable] = "colors." + n), (t.px = "8px"), (t.py = "2px"), (t.bg = [
                    is.reference
                ]), (t[iu.variable] = [
                    is.reference
                ]), (t.color = r0("whiteAlpha.900", "gray.900")(e)), (t.borderRadius = "sm"), (t.fontWeight = "medium"), (t.fontSize = "sm"), (t.boxShadow = "md"), (t.maxW = "320px"), (t.zIndex = "tooltip"), t);
            };
            var id = {
                baseStyle: ic
            };
            var iv = {
                Accordion: eJ,
                Alert: e4,
                Avatar: tt,
                Badge: tu,
                Breadcrumb: tf,
                Button: tk,
                Checkbox: tM,
                CloseButton: tT,
                Code: tV,
                Container: tZ,
                Divider: tX,
                Drawer: t9,
                Editable: na,
                Form: ns,
                FormError: nf,
                FormLabel: np,
                Heading: ng,
                Input: n_,
                Kbd: nM,
                Link: nP,
                List: nH,
                Menu: nq,
                Modal: n2,
                NumberInput: as,
                PinInput: ap,
                Popover: aA,
                Progress: aP,
                Radio: aW,
                Select: aq,
                Skeleton: aU,
                SkipLink: aJ,
                Slider: a8,
                Spinner: ol,
                Stat: oh,
                Switch: o_,
                Table: oj,
                Tabs: oY,
                Tag: o3,
                Textarea: il,
                Tooltip: id
            };
            var ip = {
                none: 0,
                "1px": "1px solid",
                "2px": "2px solid",
                "4px": "4px solid",
                "8px": "8px solid"
            };
            var ih = r5({
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
            var iy = {
                common: "background-color, border-color, color, fill, stroke, opacity, box-shadow, transform",
                colors: "background-color, border-color, color, fill, stroke",
                dimensions: "width, height",
                position: "left, right, top, bottom",
                background: "background-color, background-image, background-position"
            };
            var ix = {
                "ease-in": "cubic-bezier(0.4, 0, 1, 1)",
                "ease-out": "cubic-bezier(0, 0, 0.2, 1)",
                "ease-in-out": "cubic-bezier(0.4, 0, 0.2, 1)"
            };
            var iw = {
                "ultra-fast": "50ms",
                faster: "100ms",
                fast: "150ms",
                normal: "200ms",
                slow: "300ms",
                slower: "400ms",
                "ultra-slow": "500ms"
            };
            var iS = {
                property: iy,
                easing: ix,
                duration: iw
            };
            var ik = {
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
            var iC = {
                none: 0,
                sm: "4px",
                base: "8px",
                md: "12px",
                lg: "16px",
                xl: "24px",
                "2xl": "40px",
                "3xl": "64px"
            };
            var iA = Z({
                breakpoints: ih,
                zIndices: ik,
                radii: ib,
                blur: iC,
                colors: im
            }, eN, {
                sizes: G,
                shadows: ig,
                space: q,
                borders: ip,
                transition: iS
            });
            var iE = {
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
            var iz = {
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
            var iF = iz;
            var i_ = null && [
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
            function iB(r) {
                if (!isObject(r)) {
                    return false;
                }
                return i_.every(function(e) {
                    return Object.prototype.hasOwnProperty.call(r, e);
                });
            }
            var iM = "ltr";
            var iR = {
                useSystemColorMode: false,
                initialColorMode: "light",
                cssVarPrefix: "chakra"
            };
            var iP = Z({
                semanticTokens: iE,
                direction: iM
            }, iA, {
                components: iv,
                styles: iF,
                config: iR
            });
            var iD = t(1358);
            function iO() {
                iO = Object.assign ? Object.assign.bind() : function(r) {
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
                return iO.apply(this, arguments);
            }
            function iH(r, e) {
                if (r == null) return {};
                var t = {};
                var n = Object.keys(r);
                var a, o;
                for(o = 0; o < n.length; o++){
                    a = n[o];
                    if (e.indexOf(a) >= 0) continue;
                    t[a] = r[a];
                }
                return t;
            }
            var ij = [
                "label",
                "thickness",
                "speed",
                "emptyColor",
                "className", 
            ];
            var iW = (0, l.F4)({
                "0%": {
                    transform: "rotate(0deg)"
                },
                "100%": {
                    transform: "rotate(360deg)"
                }
            });
            var iT = (0, M.Gp)(function(r, e) {
                var t = (0, M.mq)("Spinner", r);
                var n = (0, M.Lr)(r), a = n.label, o = a === void 0 ? "Loading..." : a, l = n.thickness, s = l === void 0 ? "2px" : l, u = n.speed, d = u === void 0 ? "0.45s" : u, f = n.emptyColor, v = f === void 0 ? "transparent" : f, p = n.className, h = iH(n, ij);
                var m = (0, c.cx)("chakra-spinner", p);
                var b = iO({
                    display: "inline-block",
                    borderColor: "currentColor",
                    borderStyle: "solid",
                    borderRadius: "99999px",
                    borderWidth: s,
                    borderBottomColor: v,
                    borderLeftColor: v,
                    animation: iW + " " + d + " linear infinite"
                }, t);
                return i.createElement(M.m$.div, iO({
                    ref: e,
                    __css: b,
                    className: m
                }, h), o && i.createElement(iD.TX, null, o));
            });
            if (c.Ts) {
                iT.displayName = "Spinner";
            }
            var iI = t(894);
            function iN() {
                iN = Object.assign ? Object.assign.bind() : function(r) {
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
                return iN.apply(this, arguments);
            }
            function iL(r, e) {
                if (r == null) return {};
                var t = {};
                var n = Object.keys(r);
                var a, o;
                for(o = 0; o < n.length; o++){
                    a = n[o];
                    if (e.indexOf(a) >= 0) continue;
                    t[a] = r[a];
                }
                return t;
            }
            var iV = function r(e) {
                return i.createElement(iI.JO, iN({
                    viewBox: "0 0 24 24"
                }, e), i.createElement("path", {
                    fill: "currentColor",
                    d: "M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
                }));
            };
            var iq = function r(e) {
                return i.createElement(iI.JO, iN({
                    viewBox: "0 0 24 24"
                }, e), i.createElement("path", {
                    fill: "currentColor",
                    d: "M12,0A12,12,0,1,0,24,12,12.013,12.013,0,0,0,12,0Zm.25,5a1.5,1.5,0,1,1-1.5,1.5A1.5,1.5,0,0,1,12.25,5ZM14.5,18.5h-4a1,1,0,0,1,0-2h.75a.25.25,0,0,0,.25-.25v-4.5a.25.25,0,0,0-.25-.25H10.5a1,1,0,0,1,0-2h1a2,2,0,0,1,2,2v4.75a.25.25,0,0,0,.25.25h.75a1,1,0,1,1,0,2Z"
                }));
            };
            var iZ = function r(e) {
                return i.createElement(iI.JO, iN({
                    viewBox: "0 0 24 24"
                }, e), i.createElement("path", {
                    fill: "currentColor",
                    d: "M11.983,0a12.206,12.206,0,0,0-8.51,3.653A11.8,11.8,0,0,0,0,12.207,11.779,11.779,0,0,0,11.8,24h.214A12.111,12.111,0,0,0,24,11.791h0A11.766,11.766,0,0,0,11.983,0ZM10.5,16.542a1.476,1.476,0,0,1,1.449-1.53h.027a1.527,1.527,0,0,1,1.523,1.47,1.475,1.475,0,0,1-1.449,1.53h-.027A1.529,1.529,0,0,1,10.5,16.542ZM11,12.5v-6a1,1,0,0,1,2,0v6a1,1,0,1,1-2,0Z"
                }));
            };
            var i$ = [
                "status"
            ];
            var iU = (0, M.eC)("Alert"), iG = iU[0], iJ = iU[1];
            var iK = {
                info: {
                    icon: iq,
                    colorScheme: "blue"
                },
                warning: {
                    icon: iZ,
                    colorScheme: "orange"
                },
                success: {
                    icon: iV,
                    colorScheme: "green"
                },
                error: {
                    icon: iZ,
                    colorScheme: "red"
                },
                loading: {
                    icon: iT,
                    colorScheme: "blue"
                }
            };
            var iX = (0, d.kr)({
                name: "AlertContext",
                errorMessage: "useAlertContext: `context` is undefined. Seems you forgot to wrap alert components in `<Alert />`"
            }), iY = iX[0], iQ = iX[1];
            var i0 = (0, M.Gp)(function(r, e) {
                var t;
                var n = (0, M.Lr)(r), a = n.status, o = a === void 0 ? "info" : a, l = iL(n, i$);
                var s = (t = r.colorScheme) != null ? t : iK[o].colorScheme;
                var u = (0, M.jC)("Alert", iN({}, r, {
                    colorScheme: s
                }));
                var d = iN({
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    position: "relative",
                    overflow: "hidden"
                }, u.container);
                return i.createElement(iY, {
                    value: {
                        status: o
                    }
                }, i.createElement(iG, {
                    value: u
                }, i.createElement(M.m$.div, iN({
                    role: "alert",
                    ref: e
                }, l, {
                    className: (0, c.cx)("chakra-alert", r.className),
                    __css: d
                }))));
            });
            var i1 = (0, M.Gp)(function(r, e) {
                var t = iJ();
                return i.createElement(M.m$.div, iN({
                    ref: e
                }, r, {
                    className: (0, c.cx)("chakra-alert__title", r.className),
                    __css: t.title
                }));
            });
            var i2 = (0, M.Gp)(function(r, e) {
                var t = iJ();
                var n = iN({
                    display: "inline"
                }, t.description);
                return i.createElement(M.m$.div, iN({
                    ref: e
                }, r, {
                    className: (0, c.cx)("chakra-alert__desc", r.className),
                    __css: n
                }));
            });
            var i5 = function r(e) {
                var t = iQ(), n = t.status;
                var a = iK[n].icon;
                var o = iJ();
                var l = n === "loading" ? o.spinner : o.icon;
                return i.createElement(M.m$.span, iN({
                    display: "inherit"
                }, e, {
                    className: (0, c.cx)("chakra-alert__icon", e.className),
                    __css: l
                }), e.children || i.createElement(a, {
                    h: "100%",
                    w: "100%"
                }));
            };
            function i4(r, e) {
                if (r == null) return {};
                var t = {};
                var n = Object.keys(r);
                var a, o;
                for(o = 0; o < n.length; o++){
                    a = n[o];
                    if (e.indexOf(a) >= 0) continue;
                    t[a] = r[a];
                }
                return t;
            }
            function i6() {
                i6 = Object.assign ? Object.assign.bind() : function(r) {
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
                return i6.apply(this, arguments);
            }
            var i3 = [
                "children",
                "isDisabled",
                "__css", 
            ];
            var i8 = function r(e) {
                return i.createElement(iI.JO, i6({
                    focusable: "false",
                    "aria-hidden": true
                }, e), i.createElement("path", {
                    fill: "currentColor",
                    d: "M.439,21.44a1.5,1.5,0,0,0,2.122,2.121L11.823,14.3a.25.25,0,0,1,.354,0l9.262,9.263a1.5,1.5,0,1,0,2.122-2.121L14.3,12.177a.25.25,0,0,1,0-.354l9.263-9.262A1.5,1.5,0,0,0,21.439.44L12.177,9.7a.25.25,0,0,1-.354,0L2.561.44A1.5,1.5,0,0,0,.439,2.561L9.7,11.823a.25.25,0,0,1,0,.354Z"
                }));
            };
            var i7 = (0, M.Gp)(function(r, e) {
                var t = (0, M.mq)("CloseButton", r);
                var n = (0, M.Lr)(r), a = n.children, o = n.isDisabled, l = n.__css, s = i4(n, i3);
                var u = {
                    outline: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                };
                return i.createElement(M.m$.button, i6({
                    type: "button",
                    "aria-label": "Close",
                    ref: e,
                    disabled: o,
                    __css: i6({}, u, t, l)
                }, s), a || i.createElement(i8, {
                    width: "1em",
                    height: "1em"
                }));
            });
            if (c.Ts) {
                i7.displayName = "CloseButton";
            }
            var i9 = t(5947);
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
                var a = {
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
                var o = a[n];
                return (t = o == null ? void 0 : o[e]) != null ? t : n;
            }
            function la(r, e) {
                var t = lo(r, e);
                var n = t ? r[t].findIndex(function(r) {
                    return r.id === e;
                }) : -1;
                return {
                    position: t,
                    index: n
                };
            }
            var lo = function r(e, t) {
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
                var a = r.includes("bottom") ? "env(safe-area-inset-bottom, 0px)" : undefined;
                var o = !r.includes("left") ? "env(safe-area-inset-right, 0px)" : undefined;
                var i = !r.includes("right") ? "env(safe-area-inset-left, 0px)" : undefined;
                return {
                    position: "fixed",
                    zIndex: 5500,
                    pointerEvents: "none",
                    display: "flex",
                    flexDirection: "column",
                    margin: t,
                    top: n,
                    bottom: a,
                    right: o,
                    left: i
                };
            }
            var ls = {
                top: [],
                "top-left": [],
                "top-right": [],
                "bottom-left": [],
                bottom: [],
                "bottom-right": []
            };
            var lu = lc(ls);
            function lc(r) {
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
                    subscribe: function e(a) {
                        t.add(a);
                        return function() {
                            n(function() {
                                return r;
                            });
                            t["delete"](a);
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
                        var a = lf(e, t);
                        var o = a.position, i = a.id;
                        n(function(r) {
                            var e, t, n;
                            var i = o.includes("top");
                            var l = i ? [
                                a
                            ].concat((e = r[o]) != null ? e : []) : [].concat((t = r[o]) != null ? t : [], [
                                a
                            ]);
                            return lt({}, r, ((n = {}), (n[o] = l), n));
                        });
                        return i;
                    },
                    update: function r(e, t) {
                        if (!e) return;
                        n(function(r) {
                            var n = lt({}, r);
                            var a = la(n, e), o = a.position, i = a.index;
                            if (o && i !== -1) {
                                n[o][i] = lt({}, n[o][i], t, {
                                    message: lp(t)
                                });
                            }
                            return n;
                        });
                    },
                    closeAll: function r(e) {
                        var t = e === void 0 ? {} : e, a = t.positions;
                        n(function(r) {
                            var e = [
                                "bottom",
                                "bottom-right",
                                "bottom-left",
                                "top",
                                "top-left",
                                "top-right", 
                            ];
                            var t = a != null ? a : e;
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
                            var n = lo(r, e);
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
                        return Boolean(la(lu.getState(), e).position);
                    }
                };
            }
            var ld = 0;
            function lf(r, e) {
                var t, n;
                if (e === void 0) {
                    e = {};
                }
                ld += 1;
                var a = (t = e.id) != null ? t : ld;
                var o = (n = e.position) != null ? n : "bottom";
                return {
                    id: a,
                    message: r,
                    position: o,
                    duration: e.duration,
                    onCloseComplete: e.onCloseComplete,
                    onRequestRemove: function r() {
                        return lu.removeToast(String(a), o);
                    },
                    status: e.status,
                    requestClose: false,
                    containerStyle: e.containerStyle
                };
            }
            var lv = function r(e) {
                var t = e.status, n = e.variant, a = n === void 0 ? "solid" : n, o = e.id, l = e.title, s = e.isClosable, u = e.onClose, c = e.description, d = e.icon;
                var f = typeof o !== "undefined" ? "toast-" + o + "-title" : undefined;
                return i.createElement(i0, {
                    status: t,
                    variant: a,
                    id: String(o),
                    alignItems: "start",
                    borderRadius: "md",
                    boxShadow: "lg",
                    paddingEnd: 8,
                    textAlign: "start",
                    width: "auto",
                    "aria-labelledby": f
                }, i.createElement(i5, null, d), i.createElement(M.m$.div, {
                    flex: "1",
                    maxWidth: "100%"
                }, l && i.createElement(i1, {
                    id: f
                }, l), c && i.createElement(i2, {
                    display: "block"
                }, c)), s && i.createElement(i7, {
                    size: "sm",
                    onClick: u,
                    position: "absolute",
                    insetEnd: 1,
                    top: 1
                }));
            };
            function lp(r) {
                if (r === void 0) {
                    r = {};
                }
                var e = r, t = e.render, n = e.toastComponent, a = n === void 0 ? lv : n;
                var o = function e(n) {
                    if ((0, c.mf)(t)) {
                        return t(n);
                    }
                    return i.createElement(a, lt({}, n, r));
                };
                return o;
            }
            function lh(r, e) {
                var t = function t(n) {
                    var a;
                    return lt({}, e, n, {
                        position: ln((a = n == null ? void 0 : n.position) != null ? a : e == null ? void 0 : e.position, r)
                    });
                };
                var n = function r(e) {
                    var n = t(e);
                    var a = lp(n);
                    return lu.notify(a, n);
                };
                n.update = function(r, e) {
                    lu.update(r, t(e));
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
                n.closeAll = lu.closeAll;
                n.close = lu.close;
                n.isActive = lu.isActive;
                return n;
            }
            function lm(r) {
                var e = useChakra(), t = e.theme;
                return React.useMemo(function() {
                    return lh(t.direction, r);
                }, [
                    r,
                    t.direction
                ]);
            }
            var lb = {
                initial: function r(e) {
                    var t;
                    var n = e.position;
                    var a = [
                        "top",
                        "bottom"
                    ].includes(n) ? "y" : "x";
                    var o = [
                        "top-right",
                        "bottom-right"
                    ].includes(n) ? 1 : -1;
                    if (n === "bottom") o = 1;
                    return ((t = {
                        opacity: 0
                    }), (t[a] = o * 24), t);
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
                var e = r.id, t = r.message, n = r.onCloseComplete, a = r.onRequestRemove, o = r.requestClose, l = o === void 0 ? false : o, s = r.position, u = s === void 0 ? "bottom" : s, d = r.duration, v = d === void 0 ? 5000 : d, p = r.containerStyle, h = r.motionVariants, m = h === void 0 ? lb : h, b = r.toastSpacing, g = b === void 0 ? "0.5rem" : b;
                var y = i.useState(v), x = y[0], w = y[1];
                var S = (0, i9.hO)();
                (0, f.rf)(function() {
                    if (!S) {
                        n == null ? void 0 : n();
                    }
                }, [
                    S
                ]);
                (0, f.rf)(function() {
                    w(v);
                }, [
                    v
                ]);
                var k = function r() {
                    return w(null);
                };
                var C = function r() {
                    return w(v);
                };
                var A = function r() {
                    if (S) a();
                };
                i.useEffect(function() {
                    if (S && l) {
                        a();
                    }
                }, [
                    S,
                    l,
                    a
                ]);
                (0, f.KS)(A, x);
                var E = i.useMemo(function() {
                    return lt({
                        pointerEvents: "auto",
                        maxWidth: 560,
                        minWidth: 300,
                        margin: g
                    }, p);
                }, [
                    p,
                    g
                ]);
                var z = i.useMemo(function() {
                    return li(u);
                }, [
                    u
                ]);
                return i.createElement(lr.E.li, {
                    layout: true,
                    className: "chakra-toast",
                    variants: m,
                    initial: "initial",
                    animate: "animate",
                    exit: "exit",
                    onHoverStart: k,
                    onHoverEnd: C,
                    custom: {
                        position: u
                    },
                    style: z
                }, i.createElement(M.m$.div, {
                    role: "status",
                    "aria-atomic": "true",
                    className: "chakra-toast__inner",
                    __css: E
                }, (0, c.Pu)(t, {
                    id: e,
                    onClose: A
                })));
            });
            if (c.Ts) {
                lg.displayName = "ToastComponent";
            }
            var ly = function r(e) {
                var t = i.useSyncExternalStore(lu.subscribe, lu.getState, lu.getState);
                var n = e.children, a = e.motionVariants, o = e.component, l = o === void 0 ? lg : o, s = e.portalProps;
                var u = (0, c.Yd)(t).map(function(r) {
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
                            motionVariants: a
                        }, r));
                    })));
                });
                return i.createElement(i.Fragment, null, n, i.createElement(B, s, u));
            };
            var lx = {
                duration: 5000,
                variant: "solid"
            };
            var lw = {
                theme: iP,
                colorMode: "light",
                toggleColorMode: c.ZT,
                setColorMode: c.ZT,
                defaultOptions: lx
            };
            function lS(r) {
                var e = r === void 0 ? lw : r, t = e.theme, n = t === void 0 ? lw.theme : t, a = e.colorMode, o = a === void 0 ? lw.colorMode : a, i = e.toggleColorMode, l = i === void 0 ? lw.toggleColorMode : i, s = e.setColorMode, u = s === void 0 ? lw.setColorMode : s, c = e.defaultOptions, d = c === void 0 ? lw.defaultOptions : c, f = e.motionVariants, v = e.toastSpacing, p = e.component;
                var h = {
                    colorMode: o,
                    setColorMode: u,
                    toggleColorMode: l
                };
                var m = function r() {
                    return React.createElement(ThemeProvider, {
                        theme: n
                    }, React.createElement(ColorModeContext.Provider, {
                        value: h
                    }, React.createElement(ly, {
                        defaultOptions: d,
                        motionVariants: f,
                        toastSpacing: v,
                        component: p
                    })));
                };
                return {
                    ToastContainer: m,
                    toast: lh(n.direction, d)
                };
            }
            function lk(r, e) {
                if (r == null) return {};
                var t = {};
                var n = Object.keys(r);
                var a, o;
                for(o = 0; o < n.length; o++){
                    a = n[o];
                    if (e.indexOf(a) >= 0) continue;
                    t[a] = r[a];
                }
                return t;
            }
            var lC = [
                "children",
                "toastOptions"
            ];
            var lA = function r(e) {
                var t = e.children, n = e.toastOptions, a = lk(e, lC);
                return i.createElement(V, a, t, i.createElement(ly, n));
            };
            lA.defaultProps = {
                theme: iP
            };
            function lE() {
                for(var r = arguments.length, e = new Array(r), t = 0; t < r; t++){
                    e[t] = arguments[t];
                }
                var n = [].concat(e);
                var a = e[e.length - 1];
                if (isChakraTheme(a) && n.length > 1) {
                    n = n.slice(0, n.length - 1);
                } else {
                    a = theme$1;
                }
                return pipe.apply(void 0, n.map(function(r) {
                    return function(e) {
                        return isFunction(r) ? r(e) : lz(e, r);
                    };
                }))(a);
            }
            function lz() {
                for(var r = arguments.length, e = new Array(r), t = 0; t < r; t++){
                    e[t] = arguments[t];
                }
                return mergeWith.apply(void 0, [
                    {}
                ].concat(e, [
                    lF
                ]));
            }
            function lF(r, e, t, n) {
                if ((isFunction(r) || isFunction(e)) && Object.prototype.hasOwnProperty.call(n, t)) {
                    return function() {
                        var t = isFunction(r) ? r.apply(void 0, arguments) : r;
                        var n = isFunction(e) ? e.apply(void 0, arguments) : e;
                        return mergeWith({}, t, n, lF);
                    };
                }
                return undefined;
            }
            function l_(r) {
                var e = r.colorScheme, t = r.components;
                return function(r) {
                    var n = Object.keys(r.components || {});
                    if (Array.isArray(t)) {
                        n = t;
                    } else if (isObject(t)) {
                        n = Object.keys(t);
                    }
                    return lz(r, {
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
            function lB(r) {
                var e = r.size, t = r.components;
                return function(r) {
                    var n = Object.keys(r.components || {});
                    if (Array.isArray(t)) {
                        n = t;
                    } else if (isObject(t)) {
                        n = Object.keys(t);
                    }
                    return lz(r, {
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
            function lM(r) {
                var e = r.variant, t = r.components;
                return function(r) {
                    var n = Object.keys(r.components || {});
                    if (Array.isArray(t)) {
                        n = t;
                    } else if (isObject(t)) {
                        n = Object.keys(t);
                    }
                    return lz(r, {
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
            function lR(r) {
                var e = r.defaultProps, t = e.colorScheme, n = e.variant, a = e.size, o = r.components;
                var i = function r(e) {
                    return e;
                };
                var l = [
                    t ? l_({
                        colorScheme: t,
                        components: o
                    }) : i,
                    a ? lB({
                        size: a,
                        components: o
                    }) : i,
                    n ? lM({
                        variant: n,
                        components: o
                    }) : i, 
                ];
                return function(r) {
                    return lz(pipe.apply(void 0, l)(r));
                };
            }
            function lP(r) {
                var e = r.Component, t = r.pageProps;
                return (0, o.jsx)(lA, {
                    children: (0, o.jsx)(e, a({}, t))
                });
            }
            var lD = lP;
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
