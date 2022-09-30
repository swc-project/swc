(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[405],{

/***/ 8312:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {


    (window.__NEXT_P = window.__NEXT_P || []).push([
      "/",
      function () {
        return __webpack_require__(5075);
      }
    ]);
    if(false) {}
  

/***/ }),

/***/ 5075:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _swc_helpers_src_async_to_generator_mjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(7568);
/* harmony import */ var _swc_helpers_src_ts_generator_mjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(655);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5893);
/* harmony import */ var _octokit_plugin_retry__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6964);
/* harmony import */ var octokit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3529);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7294);






// replace with your acess token 
var ghAcessToken = "ghp_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
var Home = function() {
    var OctokitWithRetryPlugin = octokit__WEBPACK_IMPORTED_MODULE_2__/* .Octokit.plugin */ .vd.plugin(_octokit_plugin_retry__WEBPACK_IMPORTED_MODULE_3__/* .retry */ .X);
    var ghClient = new OctokitWithRetryPlugin({
        auth: ghAcessToken
    });
    var ref = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(""), user = ref[0], setUser = ref[1];
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function() {
        var getUser = function() {
            var _ref = (0,_swc_helpers_src_async_to_generator_mjs__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Z)(function() {
                var response;
                return (0,_swc_helpers_src_ts_generator_mjs__WEBPACK_IMPORTED_MODULE_5__.__generator)(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            return [
                                4,
                                ghClient.rest.users.getAuthenticated()
                            ];
                        case 1:
                            response = _state.sent();
                            setUser(response.data.login);
                            return [
                                2
                            ];
                    }
                });
            });
            return function getUser() {
                return _ref.apply(this, arguments);
            };
        }();
        getUser();
    });
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        children: [
            "Current User: ",
            user
        ]
    });
};
/* harmony default export */ __webpack_exports__["default"] = (Home);


/***/ }),

/***/ 5696:
/***/ (function() {

/* (ignored) */

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, [357,774,888,179], function() { return __webpack_exec__(8312); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ _N_E = __webpack_exports__;
/******/ }
]);