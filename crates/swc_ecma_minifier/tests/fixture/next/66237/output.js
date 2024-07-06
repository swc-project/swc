"use strict";
(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
    [
        854
    ],
    {
        /***/ 3712: /***/ function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {
            /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                /* harmony export */ $Q: function() {
                    return /* binding */ C;
                },
                /* harmony export */ Ev: function() {
                    return /* binding */ B;
                },
                /* harmony export */ e_: function() {
                    return /* binding */ I;
                },
                /* harmony export */ jU: function() {
                    return /* binding */ e;
                }
            });
            try {
                "u" > typeof Intl && Intl.v8BreakIterator;
            } catch (e) {}
            const e = ()=>"object" == typeof document && !!document, I = ()=>e() && document.documentElement.getAttribute("dir") || "ltr";
            function B(t, n, o) {
                o ? t.setAttribute(n, o) : t.removeAttribute(n);
            }
            const d = /* @__PURE__ */ new Map();
            function C(t) {
                if (d.has(t.constructor)) return d.get(t.constructor);
                for (const [o, i] of customElements.__definitions)if (i.ctor === t.constructor) return d.set(t.constructor, o), o;
                throw Error("Given element ".concat(t.constructor.name, " has not been registered yet."));
            }
        /***/ }
    }
]);
