"use strict";
(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[573],{

/***/ 4492:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5893);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7294);
/* harmony import */ var hls_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7631);
/* harmony import */ var hls_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(hls_js__WEBPACK_IMPORTED_MODULE_2__);



const Video = ()=>{
    const [hls] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(()=>new (hls_js__WEBPACK_IMPORTED_MODULE_2___default())({
            maxBufferSize: 10 * 1000 * 1000
        }));
    const [videoEl, setVideoEl] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{
        if (!hls || !videoEl) {
            return;
        }
        hls.on((hls_js__WEBPACK_IMPORTED_MODULE_2___default().Events.ERROR), (event, data)=>{
            console.log(event, data);
        });
        hls.attachMedia(videoEl);
        hls.loadSource("https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8");
    }, [
        hls,
        videoEl
    ]);
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("video", {
        ref: setVideoEl,
        playsInline: true,
        controls: true
    });
};
/* harmony default export */ __webpack_exports__["default"] = (Video);


/***/ })

}]);