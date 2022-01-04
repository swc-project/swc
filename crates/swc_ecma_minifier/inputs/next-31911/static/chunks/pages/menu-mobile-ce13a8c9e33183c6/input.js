(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[6323,8441],{

/***/ 379:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var map = {
	"./ion-action-sheet.entry.js": [
		8451,
		8451
	],
	"./ion-alert.entry.js": [
		8550,
		8550
	],
	"./ion-app_8.entry.js": [
		1006,
		1006
	],
	"./ion-avatar_3.entry.js": [
		9169,
		9169
	],
	"./ion-back-button.entry.js": [
		9112,
		9112
	],
	"./ion-backdrop.entry.js": [
		9389,
		9389
	],
	"./ion-button_2.entry.js": [
		7733,
		7733
	],
	"./ion-card_5.entry.js": [
		2011,
		2011
	],
	"./ion-checkbox.entry.js": [
		3562,
		3562
	],
	"./ion-chip.entry.js": [
		2185,
		2185
	],
	"./ion-col_3.entry.js": [
		7478,
		7478
	],
	"./ion-datetime_3.entry.js": [
		9440,
		9440
	],
	"./ion-fab_3.entry.js": [
		6608,
		6608
	],
	"./ion-img.entry.js": [
		8014,
		8014
	],
	"./ion-infinite-scroll_2.entry.js": [
		6270,
		6270
	],
	"./ion-input.entry.js": [
		2865,
		2865
	],
	"./ion-item-option_3.entry.js": [
		964,
		964
	],
	"./ion-item_8.entry.js": [
		7419,
		7419
	],
	"./ion-loading.entry.js": [
		9740,
		9740
	],
	"./ion-menu_3.entry.js": [
		9936,
		9936
	],
	"./ion-modal.entry.js": [
		3731,
		3731
	],
	"./ion-nav_2.entry.js": [
		4288,
		4288
	],
	"./ion-popover.entry.js": [
		6560,
		6560
	],
	"./ion-progress-bar.entry.js": [
		5051,
		5051
	],
	"./ion-radio_2.entry.js": [
		2932,
		2932
	],
	"./ion-range.entry.js": [
		6074,
		6074
	],
	"./ion-refresher_2.entry.js": [
		8290,
		8290
	],
	"./ion-reorder_2.entry.js": [
		3479,
		3479
	],
	"./ion-ripple-effect.entry.js": [
		4905,
		4905
	],
	"./ion-route_4.entry.js": [
		5095,
		5095
	],
	"./ion-searchbar.entry.js": [
		7421,
		2880
	],
	"./ion-segment_2.entry.js": [
		3806,
		3806
	],
	"./ion-select_3.entry.js": [
		6306,
		7421
	],
	"./ion-slide_2.entry.js": [
		4208,
		4208
	],
	"./ion-spinner.entry.js": [
		3046,
		3046
	],
	"./ion-split-pane.entry.js": [
		4774,
		4774
	],
	"./ion-tab-bar_2.entry.js": [
		3196,
		3196
	],
	"./ion-tab_2.entry.js": [
		3965,
		3965
	],
	"./ion-text.entry.js": [
		2516,
		2516
	],
	"./ion-textarea.entry.js": [
		2117,
		2117
	],
	"./ion-toast.entry.js": [
		4617,
		4617
	],
	"./ion-toggle.entry.js": [
		9125,
		9125
	],
	"./ion-virtual-scroll.entry.js": [
		9480,
		9480
	]
};
function webpackAsyncContext(req) {
	if(!__webpack_require__.o(map, req)) {
		return Promise.resolve().then(function() {
			var e = new Error("Cannot find module '" + req + "'");
			e.code = 'MODULE_NOT_FOUND';
			throw e;
		});
	}

	var ids = map[req], id = ids[0];
	return __webpack_require__.e(ids[1]).then(function() {
		return __webpack_require__(id);
	});
}
webpackAsyncContext.keys = function() { return Object.keys(map); };
webpackAsyncContext.id = 379;
module.exports = webpackAsyncContext;

/***/ }),

/***/ 3823:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {


    (window.__NEXT_P = window.__NEXT_P || []).push([
      "/menu-mobile",
      function () {
        return __webpack_require__(8441);
      }
    ]);
    if(false) {}
  

/***/ }),

/***/ 8441:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5893);
/* harmony import */ var _ionic_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7022);


var MenuMobile = function() {
    return(/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_ionic_react__WEBPACK_IMPORTED_MODULE_1__/* .IonMenu */ .z0, {
        side: "end",
        menuId: "menu-mobile",
        contentId: "wrapper-menu-mobile",
        maxEdgeStart: 80,
        type: "overlay",
        children: [
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h1", {
                children: "Menu mobile"
            }),
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
                children: "Drag doesn't work if swc minify is true"
            })
        ]
    }));
};
/* harmony default export */ __webpack_exports__["default"] = (MenuMobile);


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, [3174,7022,6510,9774,2888,179], function() { return __webpack_exec__(3823); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ _N_E = __webpack_exports__;
/******/ }
]);