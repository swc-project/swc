/******/ (function () {
    // webpackBootstrap
    /******/ "use strict";
    /******/ var __webpack_modules__ = {};
    /************************************************************************/
    /******/ // The module cache
    /******/ var __webpack_module_cache__ = {};
    /******/
    /******/ // The require function
    /******/ function __webpack_require__(moduleId) {
        /******/ // Check if module is in cache
        /******/ var cachedModule = __webpack_module_cache__[moduleId];
        /******/ if (cachedModule !== undefined) {
            /******/ return cachedModule.exports;
            /******/
        }
        /******/ // Create a new module (and put it into the cache)
        /******/ var module = (__webpack_module_cache__[moduleId] = {
            /******/ // no module.id needed
            /******/ // no module.loaded needed
            /******/ exports: {},
            /******/
        });
        /******/
        /******/ // Execute the module function
        /******/ var threw = true;
        /******/ try {
            /******/ __webpack_modules__[moduleId](
                module,
                module.exports,
                __webpack_require__
            );
            /******/ threw = false;
            /******/
        } finally {
            /******/ if (threw) delete __webpack_module_cache__[moduleId];
            /******/
        }
        /******/
        /******/ // Return the exports of the module
        /******/ return module.exports;
        /******/
    }
    /******/
    /******/ // expose the modules object (__webpack_modules__)
    /******/ __webpack_require__.m = __webpack_modules__;
    /******/
    /************************************************************************/
    /******/ /* webpack/runtime/chunk loaded */
    /******/ !(function () {
        /******/ var deferred = [];
        /******/ __webpack_require__.O = function (
            result,
            chunkIds,
            fn,
            priority
        ) {
            /******/ if (chunkIds) {
                /******/ priority = priority || 0;
                /******/ for (
                    var i = deferred.length;
                    i > 0 && deferred[i - 1][2] > priority;
                    i--
                )
                    deferred[i] = deferred[i - 1];
                /******/ deferred[i] = [chunkIds, fn, priority];
                /******/ return;
                /******/
            }
            /******/ var notFulfilled = Infinity;
            /******/ for (var i = 0; i < deferred.length; i++) {
                /******/ var chunkIds = deferred[i][0];
                /******/ var fn = deferred[i][1];
                /******/ var priority = deferred[i][2];
                /******/ var fulfilled = true;
                /******/ for (var j = 0; j < chunkIds.length; j++) {
                    /******/ if (
                        (priority & (1 === 0) || notFulfilled >= priority) &&
                        Object.keys(__webpack_require__.O).every(function (
                            key
                        ) {
                            return __webpack_require__.O[key](chunkIds[j]);
                        })
                    ) {
                        /******/ chunkIds.splice(j--, 1);
                        /******/
                    } else {
                        /******/ fulfilled = false;
                        /******/ if (priority < notFulfilled)
                            notFulfilled = priority;
                        /******/
                    }
                    /******/
                }
                /******/ if (fulfilled) {
                    /******/ deferred.splice(i--, 1);
                    /******/ var r = fn();
                    /******/ if (r !== undefined) result = r;
                    /******/
                }
                /******/
            }
            /******/ return result;
            /******/
        };
        /******/
    })();
    /******/
    /******/ /* webpack/runtime/compat get default export */
    /******/ !(function () {
        /******/ // getDefaultExport function for compatibility with non-harmony modules
        /******/ __webpack_require__.n = function (module) {
            /******/ var getter =
                module && module.__esModule
                    ? /******/ function () {
                          return module["default"];
                      }
                    : /******/ function () {
                          return module;
                      };
            /******/ __webpack_require__.d(getter, {
                a: getter,
            });
            /******/ return getter;
            /******/
        };
        /******/
    })();
    /******/
    /******/ /* webpack/runtime/define property getters */
    /******/ !(function () {
        /******/ // define getter functions for harmony exports
        /******/ __webpack_require__.d = function (exports, definition) {
            /******/ for (var key in definition) {
                /******/ if (
                    __webpack_require__.o(definition, key) &&
                    !__webpack_require__.o(exports, key)
                ) {
                    /******/ Object.defineProperty(exports, key, {
                        enumerable: true,
                        get: definition[key],
                    });
                    /******/
                }
                /******/
            }
            /******/
        };
        /******/
    })();
    /******/
    /******/ /* webpack/runtime/ensure chunk */
    /******/ !(function () {
        /******/ __webpack_require__.f = {};
        /******/ // This file contains only the entry chunk.
        /******/ // The chunk loading function for additional chunks
        /******/ __webpack_require__.e = function (chunkId) {
            /******/ return Promise.all(
                Object.keys(__webpack_require__.f).reduce(function (
                    promises,
                    key
                ) {
                    /******/ __webpack_require__.f[key](chunkId, promises);
                    /******/ return promises;
                    /******/
                },
                [])
            );
            /******/
        };
        /******/
    })();
    /******/
    /******/ /* webpack/runtime/get javascript chunk filename */
    /******/ !(function () {
        /******/ // This function allow to reference async chunks
        /******/ __webpack_require__.u = function (chunkId) {
            /******/ // return url for filenames not based on template
            /******/ if (chunkId === 774)
                return "static/chunks/framework-054ead69ea8124b4cb27.js";
            /******/ if (chunkId === 266)
                return "static/chunks/266-aee26c928109d49d6151.js";
            /******/ // return url for filenames based on template
            /******/ return (
                "static/chunks/" +
                ({
                    358: "hello1",
                    367: "hello2",
                    689: "hello-world",
                }[chunkId] || chunkId) +
                "." +
                {
                    358: "4066327636ea41cc1002",
                    367: "339fbf9b6616133531f3",
                    383: "5942fafdbede773d29c7",
                    411: "0fbee7df8bd8b42967ec",
                    689: "1af1130392dd1b8d7964",
                    808: "7518829f34ebf3ce0082",
                    916: "2317bfea2c41354132bd",
                    974: "b9fed4786fc6d4a5745d",
                }[chunkId] +
                ".js"
            );
            /******/
        };
        /******/
    })();
    /******/
    /******/ /* webpack/runtime/get mini-css chunk filename */
    /******/ !(function () {
        /******/ // This function allow to reference all chunks
        /******/ __webpack_require__.miniCssF = function (chunkId) {
            /******/ // return url for filenames based on template
            /******/ return undefined;
            /******/
        };
        /******/
    })();
    /******/
    /******/ /* webpack/runtime/global */
    /******/ !(function () {
        /******/ __webpack_require__.g = (function () {
            /******/ if (typeof globalThis === "object") return globalThis;
            /******/ try {
                /******/ return this || new Function("return this")();
                /******/
            } catch (e) {
                /******/ if (typeof window === "object") return window;
                /******/
            }
            /******/
        })();
        /******/
    })();
    /******/
    /******/ /* webpack/runtime/hasOwnProperty shorthand */
    /******/ !(function () {
        /******/ __webpack_require__.o = function (obj, prop) {
            return Object.prototype.hasOwnProperty.call(obj, prop);
        };
        /******/
    })();
    /******/
    /******/ /* webpack/runtime/load script */
    /******/ !(function () {
        /******/ var inProgress = {};
        /******/ var dataWebpackPrefix = "_N_E:";
        /******/ // loadScript function to load a script via script tag
        /******/ __webpack_require__.l = function (url, done, key, chunkId) {
            /******/ if (inProgress[url]) {
                inProgress[url].push(done);
                return;
            }
            /******/ var script, needAttach;
            /******/ if (key !== undefined) {
                /******/ var scripts = document.getElementsByTagName("script");
                /******/ for (var i = 0; i < scripts.length; i++) {
                    /******/ var s = scripts[i];
                    /******/ if (
                        s.getAttribute("src") == url ||
                        s.getAttribute("data-webpack") ==
                            dataWebpackPrefix + key
                    ) {
                        script = s;
                        break;
                    }
                    /******/
                }
                /******/
            }
            /******/ if (!script) {
                /******/ needAttach = true;
                /******/ script = document.createElement("script");
                /******/
                /******/ script.charset = "utf-8";
                /******/ script.timeout = 120;
                /******/ if (__webpack_require__.nc) {
                    /******/ script.setAttribute(
                        "nonce",
                        __webpack_require__.nc
                    );
                    /******/
                }
                /******/ script.setAttribute(
                    "data-webpack",
                    dataWebpackPrefix + key
                );
                /******/ script.src = url;
                /******/
            }
            /******/ inProgress[url] = [done];
            /******/ var onScriptComplete = function (prev, event) {
                /******/ // avoid mem leaks in IE.
                /******/ script.onerror = script.onload = null;
                /******/ clearTimeout(timeout);
                /******/ var doneFns = inProgress[url];
                /******/ delete inProgress[url];
                /******/ script.parentNode &&
                    script.parentNode.removeChild(script);
                /******/ doneFns &&
                    doneFns.forEach(function (fn) {
                        return fn(event);
                    });
                /******/ if (prev) return prev(event);
                /******/
            };
            /******/ /******/ var timeout = setTimeout(
                onScriptComplete.bind(null, undefined, {
                    type: "timeout",
                    target: script,
                }),
                120000
            );
            /******/ script.onerror = onScriptComplete.bind(
                null,
                script.onerror
            );
            /******/ script.onload = onScriptComplete.bind(null, script.onload);
            /******/ needAttach && document.head.appendChild(script);
            /******/
        };
        /******/
    })();
    /******/
    /******/ /* webpack/runtime/make namespace object */
    /******/ !(function () {
        /******/ // define __esModule on exports
        /******/ __webpack_require__.r = function (exports) {
            /******/ if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
                /******/ Object.defineProperty(exports, Symbol.toStringTag, {
                    value: "Module",
                });
                /******/
            }
            /******/ Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            /******/
        };
        /******/
    })();
    /******/
    /******/ /* webpack/runtime/publicPath */
    /******/ !(function () {
        /******/ __webpack_require__.p = "/_next/";
        /******/
    })();
    /******/
    /******/ /* webpack/runtime/jsonp chunk loading */
    /******/ !(function () {
        /******/ // no baseURI
        /******/
        /******/ // object to store loaded and loading chunks
        /******/ // undefined = chunk not loaded, null = chunk preloaded/prefetched
        /******/ // [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
        /******/ var installedChunks = {
            /******/ 272: 0,
            /******/
        };
        /******/
        /******/ __webpack_require__.f.j = function (chunkId, promises) {
            /******/ // JSONP chunk loading for javascript
            /******/ var installedChunkData = __webpack_require__.o(
                installedChunks,
                chunkId
            )
                ? installedChunks[chunkId]
                : undefined;
            /******/ if (installedChunkData !== 0) {
                // 0 means "already installed".
                /******/
                /******/ // a Promise means "currently loading".
                /******/ if (installedChunkData) {
                    /******/ promises.push(installedChunkData[2]);
                    /******/
                } else {
                    /******/ if (272 != chunkId) {
                        /******/ // setup Promise in chunk cache
                        /******/ var promise = new Promise(function (
                            resolve,
                            reject
                        ) {
                            installedChunkData = installedChunks[chunkId] = [
                                resolve,
                                reject,
                            ];
                        });
                        /******/ promises.push(
                            (installedChunkData[2] = promise)
                        );
                        /******/
                        /******/ // start chunk loading
                        /******/ var url =
                            __webpack_require__.p +
                            __webpack_require__.u(chunkId);
                        /******/ // create error before stack unwound to get useful stacktrace later
                        /******/ var error = new Error();
                        /******/ var loadingEnded = function (event) {
                            /******/ if (
                                __webpack_require__.o(installedChunks, chunkId)
                            ) {
                                /******/ installedChunkData =
                                    installedChunks[chunkId];
                                /******/ if (installedChunkData !== 0)
                                    installedChunks[chunkId] = undefined;
                                /******/ if (installedChunkData) {
                                    /******/ var errorType =
                                        event &&
                                        (event.type === "load"
                                            ? "missing"
                                            : event.type);
                                    /******/ var realSrc =
                                        event &&
                                        event.target &&
                                        event.target.src;
                                    /******/ error.message =
                                        "Loading chunk " +
                                        chunkId +
                                        " failed.\n(" +
                                        errorType +
                                        ": " +
                                        realSrc +
                                        ")";
                                    /******/ error.name = "ChunkLoadError";
                                    /******/ error.type = errorType;
                                    /******/ error.request = realSrc;
                                    /******/ installedChunkData[1](error);
                                    /******/
                                }
                                /******/
                            }
                            /******/
                        };
                        /******/ __webpack_require__.l(
                            url,
                            loadingEnded,
                            "chunk-" + chunkId,
                            chunkId
                        );
                        /******/
                    } else installedChunks[chunkId] = 0;
                    /******/
                }
                /******/
            }
            /******/
        };
        /******/
        /******/ // no prefetching
        /******/
        /******/ // no preloaded
        /******/
        /******/ // no HMR
        /******/
        /******/ // no HMR manifest
        /******/
        /******/ __webpack_require__.O.j = function (chunkId) {
            return installedChunks[chunkId] === 0;
        };
        /******/
        /******/ // install a JSONP callback for chunk loading
        /******/ var webpackJsonpCallback = function (
            parentChunkLoadingFunction,
            data
        ) {
            /******/ var chunkIds = data[0];
            /******/ var moreModules = data[1];
            /******/ var runtime = data[2];
            /******/ // add "moreModules" to the modules object,
            /******/ // then flag all "chunkIds" as loaded and fire callback
            /******/ var moduleId,
                chunkId,
                i = 0;
            /******/ for (moduleId in moreModules) {
                /******/ if (__webpack_require__.o(moreModules, moduleId)) {
                    /******/ __webpack_require__.m[moduleId] =
                        moreModules[moduleId];
                    /******/
                }
                /******/
            }
            /******/ if (runtime) var result = runtime(__webpack_require__);
            /******/ if (parentChunkLoadingFunction)
                parentChunkLoadingFunction(data);
            /******/ for (; i < chunkIds.length; i++) {
                /******/ chunkId = chunkIds[i];
                /******/ if (
                    __webpack_require__.o(installedChunks, chunkId) &&
                    installedChunks[chunkId]
                ) {
                    /******/ installedChunks[chunkId][0]();
                    /******/
                }
                /******/ installedChunks[chunkIds[i]] = 0;
                /******/
            }
            /******/ return __webpack_require__.O(result);
            /******/
        };
        /******/
        /******/ var chunkLoadingGlobal = (self["webpackChunk_N_E"] =
            self["webpackChunk_N_E"] || []);
        /******/ chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
        /******/ chunkLoadingGlobal.push = webpackJsonpCallback.bind(
            null,
            chunkLoadingGlobal.push.bind(chunkLoadingGlobal)
        );
        /******/
    })();
    /******/
    /************************************************************************/
    /******/
    /******/
    /******/
})();
