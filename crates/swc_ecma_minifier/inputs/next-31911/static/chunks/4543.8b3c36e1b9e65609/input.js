"use strict";
(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[4543],{

/***/ 4543:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createSwipeBackGesture": function() { return /* binding */ createSwipeBackGesture; }
/* harmony export */ });
/* harmony import */ var _helpers_dd7e4b7b_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8840);
/* harmony import */ var _index_34cb2743_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8224);
/* harmony import */ var _gesture_controller_31cb6bb9_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6221);
var createSwipeBackGesture=function(r,e,t,a,n){var o=r.ownerDocument.defaultView;var i=function(r){return r.startX<=50&&e()};var c=function(r){var e=r.deltaX;var t=e/o.innerWidth;a(t)};var v=function(r){var e=r.deltaX;var t=o.innerWidth;var a=e/t;var i=r.velocityX;var c=t/2;var v=i>=0&&(i>.2||r.deltaX>c);var s=v?1-a:a;var u=s*t;var l=0;if(u>5){var d=u/Math.abs(i);l=Math.min(d,540)}n(v,a<=0?.01:(0,_helpers_dd7e4b7b_js__WEBPACK_IMPORTED_MODULE_2__.j)(0,a,.9999),l)};return (0,_index_34cb2743_js__WEBPACK_IMPORTED_MODULE_0__.createGesture)({el:r,gestureName:"goback-swipe",gesturePriority:40,threshold:10,canStart:i,onStart:t,onMove:c,onEnd:v})};

/***/ })

}]);