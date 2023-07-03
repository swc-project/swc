(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[58],{

/***/ 9896:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {


    (window.__NEXT_P = window.__NEXT_P || []).push([
      "/outstatic/[[...ost]]",
      function () {
        return __webpack_require__(9128);
      }
    ]);
    if(false) {}
  

/***/ }),

/***/ 9128:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __N_SSP: function() { return /* binding */ __N_SSP; }
/* harmony export */ });
/* harmony import */ var outstatic__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9219);
/* harmony import */ var outstatic__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(outstatic__WEBPACK_IMPORTED_MODULE_0__);

var __N_SSP = true;
/* harmony default export */ __webpack_exports__["default"] = (outstatic__WEBPACK_IMPORTED_MODULE_0__.Outstatic);


/***/ }),

/***/ 9219:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
/* provided dependency */ var process = __webpack_require__(8448);
/* provided dependency */ var Buffer = __webpack_require__(7861)["Buffer"];

var O = Object.create;
var p = Object.defineProperty;
var _ = Object.getOwnPropertyDescriptor;
var l = Object.getOwnPropertyNames;
var T = Object.getPrototypeOf, d = Object.prototype.hasOwnProperty;
var y = (e, o)=>{
    for(var t in o)p(e, t, {
        get: o[t],
        enumerable: !0
    });
}, f = (e, o, t, n)=>{
    if (o && typeof o == "object" || typeof o == "function") for (let s of l(o))!d.call(e, s) && s !== t && p(e, s, {
        get: ()=>o[s],
        enumerable: !(n = _(o, s)) || n.enumerable
    });
    return e;
};
var P = (e, o, t)=>(t = e != null ? O(T(e)) : {}, f(o || !e || !e.__esModule ? p(t, "default", {
        value: e,
        enumerable: !0
    }) : t, e)), C = (e)=>f(p({}, "__esModule", {
        value: !0
    }), e);
var $ = {};
y($, {
    OstSSP: ()=>q,
    Outstatic: ()=>h,
    OutstaticApi: ()=>M
});
module.exports = C($);
var R = __webpack_require__(1985), a = __webpack_require__(7458), h = ()=>{
    let e = (0, R.useFormContext)();
    return (0, a.jsx)(a.Fragment, {
        children: (0, a.jsx)("h1", {
            children: "Hello"
        })
    });
}, q = async (param)=>{
    let { req: e } = param;
    return {
        props: {}
    };
};
var i = P(__webpack_require__(6731));
var c = __webpack_require__(6179), w = "ost_token", g = 60 * 60 * 8;
function v(e) {
    var t;
    if (e.cookies) return e.cookies;
    let o = (t = e.headers) == null ? void 0 : t.cookie;
    return (0, c.parse)(o || "");
}
function A(e) {
    return v(e)[w];
}
var _process_env_OST_TOKEN_SECRET;
var G = (_process_env_OST_TOKEN_SECRET = process.env.OST_TOKEN_SECRET) !== null && _process_env_OST_TOKEN_SECRET !== void 0 ? _process_env_OST_TOKEN_SECRET : "";
async function S(e) {
    let o = A(e);
    if (!o) return null;
    try {
        let t = await i.unseal(o, G, i.defaults), n = t.expires + g * 1e3;
        if (Date.now() > n) throw new Error("Session expired");
        return t;
    } catch (e) {
        return null;
    }
}
var k = "images/";
var H = process.env.OST_REPO_SLUG || process.env.VERCEL_GIT_REPO_SLUG, I = process.env.OST_REPO_BRANCH || "main", N = process.env.OST_MONOREPO_PATH;
async function u(e, o) {
    var s, m, x;
    let t = await S(e), n = process.env.OST_REPO_OWNER || ((s = t == null ? void 0 : t.user) == null ? void 0 : s.login);
    if (t != null && t.access_token) {
        let r = await fetch("https://raw.githubusercontent.com/".concat(n, "/").concat(H, "/").concat(I, "/").concat(N ? N + "/" : "", "public/").concat(k).concat((x = (m = e.query) == null ? void 0 : m.ost) == null ? void 0 : x[1]), {
            headers: {
                authorization: "token ".concat(t.access_token)
            }
        });
        if (r.status === 200 && r.body) {
            let E = Buffer.from(await r.arrayBuffer());
            o.setHeader("Cache-Control", "max-age=300"), o.status(200).send(E);
            return;
        }
        o.status(r.status).send(r.statusText);
    } else o.status(401), o.end();
}
var L = {
    images: u
}, M = (e, o)=>{
    let { ost: t } = e.query;
    return L[t[0]](e, o);
};
0 && (0);


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, [774,190,285,888,179], function() { return __webpack_exec__(9896); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ _N_E = __webpack_exports__;
/******/ }
]);