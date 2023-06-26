var specific_microfront;
(function () { // webpackBootstrap
    "use strict";
    var __webpack_modules__ = ({



    });
    /************************************************************************/
    // The module cache
    var __webpack_module_cache__ = {};

    // The require function
    function __webpack_require__(moduleId) {
        // Check if module is in cache
        var cachedModule = __webpack_module_cache__[moduleId];
        if (cachedModule !== undefined) {
            return cachedModule.exports;

        }
        // Create a new module (and put it into the cache)
        var module = __webpack_module_cache__[moduleId] = {
            id: moduleId,
            loaded: false,
            exports: {}

        };

        // Execute the module function
        __webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);

        // Flag the module as loaded
        module.loaded = true;

        // Return the exports of the module
        return module.exports;

    }

    // expose the modules object (__webpack_modules__)
    __webpack_require__.m = __webpack_modules__;

    // expose the module cache
    __webpack_require__.c = __webpack_module_cache__;

    /************************************************************************/
    /* webpack/runtime/compat get default export */
    !function () {
        // getDefaultExport function for compatibility with non-harmony modules
        __webpack_require__.n = function (module) {
            var getter = module && module.__esModule ?
                function () { return module['default']; } :
                function () { return module; };
            __webpack_require__.d(getter, { a: getter });
            return getter;

        };

    }();

    /************************************************************************/

    // module cache are used so entry inlining is disabled
    // startup
    // Load entry module and return exports
    var __webpack_exports__ = __webpack_require__("webpack/container/entry/specific_page");
    specific_microfront = __webpack_exports__;


})()
    ;