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
            }
        }),

}]);