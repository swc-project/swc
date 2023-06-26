var specific_microfront;
(function () { // webpackBootstrap
    "use strict";
    var __webpack_modules__ = ({

        "webpack/container/entry/specific_page":
            (function (__unused_webpack_module, exports, __webpack_require__) {

                var moduleMap = {
                    ".": function () {
                        return Promise.all([]).then(function () { return function () { return (__webpack_require__("./workers.ts")); }; });
                    }
                };
                var get = function (module, getScope) {
                    __webpack_require__.R = getScope;
                    getScope = (
                        __webpack_require__.o(moduleMap, module)
                            ? moduleMap[module]()
                            : Promise.resolve().then(function () {
                                throw new Error('Module "' + module + '" does not exist in container.');
                            })
                    );
                    __webpack_require__.R = undefined;
                    return getScope;
                };
                var init = function (shareScope, initScope) {
                    if (!__webpack_require__.S) return;
                    var name = "default"
                    var oldScope = __webpack_require__.S[name];
                    if (oldScope && oldScope !== shareScope) throw new Error("Container initialization failed as it has already been initialized with a different share scope");
                    __webpack_require__.S[name] = shareScope;
                    return __webpack_require__.I(name, initScope);
                };

                // This exports getters to disallow modifications
                __webpack_require__.d(exports, {
                    get: function () { return get; },
                    init: function () { return init; }
                });


            }),

        "react":
            (function (module) {

                module.exports = React;


            }),

        "jquery":
            (function (module) {

                module.exports = jQuery;


            })


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