/******/ (() => {
    // webpackBootstrap
    /******/ var __webpack_modules__ = {
        /***/ 746: /***/ (
            __unused_webpack_module,
            __unused_webpack___webpack_exports__,
            __webpack_require__
        ) => {
            // originally from react
            const G = Object.prototype.hasOwnProperty;

            // MY ACTUAL CODE
            const baselinePx = 4;
            const faderWidth = baselinePx * 12;
            const faderHeight = baselinePx * 60;
            const trackWidth = faderWidth / 3;
            const trackHeight = faderHeight - faderWidth;
            const trackMargin = (faderWidth - trackWidth) / 2;
            // END MY ACTUAL CODE

            /***/
        },

        /******/
    };
    /************************************************************************/
    /******/
    /******/ // expose the modules object (__webpack_modules__)
    /******/ __webpack_require__.m = __webpack_modules__;
    /******/
    /************************************************************************/
    /******/ /* webpack/runtime/chunk loaded */
    /******/ (() => {
        /******/ __webpack_require__.O = (result, chunkIds, fn, priority) => {
            /******/ for (var j = 0; j < chunkIds.length; j++) {
                /******/ Object.keys(__webpack_require__.O).every((key) =>
                    __webpack_require__.O[key](chunkIds[j])
                );
                /******/
            }
            /******/
        };
        /******/
    })();
    /******/ var __webpack_exports__ = __webpack_require__.O(
        undefined,
        [532],
        () => __webpack_require__(746)
    );
    /******/ __webpack_exports__ = __webpack_require__.O(__webpack_exports__);
    /******/
})();
