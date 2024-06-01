"use strict";
(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[854], {

/***/ 3712:
/***/ (function (__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   $Q: function () { return /* binding */ C; },
/* harmony export */   Ev: function () { return /* binding */ B; },
/* harmony export */   e_: function () { return /* binding */ I; },
/* harmony export */   jU: function () { return /* binding */ e; }
    /* harmony export */
});
            /* unused harmony exports ACTION_ELEMENTS, SbbScrollHandler, breakpoints, findInput, findReferencedElement, hostContext, isAndroid, isBlink, isBreakpoint, isChromium, isEdge, isFirefox, isIOS, isNextjs, isSafari, isTrident, isWebkit, pageScrollDisabled */
            let a;
            try {
                a = typeof Intl < "u" && Intl.v8BreakIterator;
            } catch (e) {
                a = !1;
            }
            const e = () => typeof document == "object" && !!document, l = () => e() && /(edge)/i.test(navigator.userAgent), c = () => e() && /(msie|trident)/i.test(navigator.userAgent), y = () => e() && !!(window.chrome || a) && typeof CSS < "u" && !l() && !c(), g = () => e() && /AppleWebKit/i.test(navigator.userAgent) && !y() && !l() && !c(), w = () => e() && /iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window), v = () => e() && /(firefox|minefield)/i.test(navigator.userAgent), A = () => e() && /android/i.test(navigator.userAgent) && !c(), E = () => e() && /safari/i.test(navigator.userAgent) && g(), p = () => !!globalThis.next, S = () => {
                var t, n;
                return (n = (t = navigator.userAgentData) == null ? void 0 : t.brands) == null ? void 0 : n.some((o) => o.brand == "Chromium");
            }, x = (/* unused pure expression or super */ null && ([
                "zero",
                "micro",
                "small",
                "medium",
                "wide",
                "large",
                "ultra"
            ]));
            function k(t, n, o) {
                if (!e()) return !1;
                const i = getComputedStyle(document.documentElement), s = t ? i.getPropertyValue("--sbb-breakpoint-".concat(t, "-min")) : "", r = n ? "".concat(parseFloat(i.getPropertyValue("--sbb-breakpoint-".concat(n, "-").concat(o != null && o.includeMaxBreakpoint ? "max" : "min"))) - (o != null && o.includeMaxBreakpoint ? 0 : 0.0625), "rem") : "", b = s && "(min-width: ".concat(s, ")"), m = r && "(max-width: ".concat(r, ")"), f = s && r && " and ";
                return window.matchMedia("".concat(b).concat(f).concat(m)).matches;
            }
            function h(t) {
                if (e()) {
                    if (typeof t == "string") return document.getElementById(t);
                    if (t instanceof window.Element) return t;
                } else return null;
                return null;
            }
            const I = () => e() && document.documentElement.getAttribute("dir") || "ltr";
            function $(t, n) {
                if (!e()) return null;
                var _n_parentElement;
                for (n = (_n_parentElement = n.parentElement) !== null && _n_parentElement !== void 0 ? _n_parentElement : n.getRootNode().host; n && n !== document && n !== window;) {
                    const o = n.closest(t);
                    if (o) return o;
                    n = n.getRootNode().host;
                }
                return null;
            }
            const M = "a,button,sbb-teaser-hero,sbb-teaser";
            function _(t, n) {
                var o;
                if (!n) {
                    const i = (o = t.closest) == null ? void 0 : o.call(t, "sbb-form-field");
                    return i == null ? void 0 : i.querySelector("input");
                }
                return h(n);
            }
            function B(t, n, o) {
                o ? t.setAttribute(n, o) : t.removeAttribute(n);
            }
            function u() {
                return document.body.hasAttribute("data-sbb-scroll-disabled");
            }
            class W {
                disableScroll() {
                    if (u()) return;
                    this._position = document.body.style.position, this._overflow = document.body.style.overflow, this._marginInlineEnd = document.body.style.marginInlineEnd;
                    const n = window.innerWidth - document.documentElement.clientWidth;
                    document.body.style.overflow = "hidden", document.body.style.position = "relative", document.body.style.marginInlineEnd = "".concat(n, "px"), document.body.style.setProperty("--sbb-scrollbar-width", "".concat(n, "px")), document.body.toggleAttribute("data-sbb-scroll-disabled", !0);
                }
                enableScroll() {
                    u() && (document.body.style.position = this._position || "", document.body.style.overflow = this._overflow || "", document.body.style.marginInlineEnd = this._marginInlineEnd || "", document.body.style.setProperty("--sbb-scrollbar-width", "0"), document.body.removeAttribute("data-sbb-scroll-disabled"));
                }
            }
            const d = /* @__PURE__ */ new Map();
            function C(t) {
                if (d.has(t.constructor)) return d.get(t.constructor);
                const n = // eslint-disable-next-line @typescript-eslint/naming-convention
                    customElements.__definitions;
                for (const [o, i] of n) if (i.ctor === t.constructor) return d.set(t.constructor, o), o;
                throw new Error("Given element ".concat(t.constructor.name, " has not been registered yet."));
            }



            /***/
        }),

}]);