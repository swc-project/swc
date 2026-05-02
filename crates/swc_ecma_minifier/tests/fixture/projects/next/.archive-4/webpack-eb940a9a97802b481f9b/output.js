!/******/ function() {
    // webpackBootstrap
    /******/ "use strict";
    /******/ var deferred, inProgress, installedChunks, webpackJsonpCallback, chunkLoadingGlobal, __webpack_modules__ = {}, __webpack_module_cache__ = {};
    /******/ /******/ // The require function
    /******/ function __webpack_require__(moduleId) {
        /******/ // Check if module is in cache
        /******/ var cachedModule = __webpack_module_cache__[moduleId];
        /******/ if (void 0 !== cachedModule) /******/ return cachedModule.exports;
        /******/ // Create a new module (and put it into the cache)
        /******/ var module = __webpack_module_cache__[moduleId] = {
            /******/ // no module.id needed
            /******/ // no module.loaded needed
            /******/ exports: {}
        }, threw = !0;
        /******/ try {
            /******/ __webpack_modules__[moduleId](module, module.exports, __webpack_require__), /******/ threw = !1;
        /******/ } finally{
            /******/ threw && delete __webpack_module_cache__[moduleId];
        /******/ }
        /******/ /******/ // Return the exports of the module
        /******/ return module.exports;
    /******/ }
    /******/ /******/ // expose the modules object (__webpack_modules__)
    /******/ __webpack_require__.m = __webpack_modules__, deferred = [], /******/ __webpack_require__.O = function(result, chunkIds, fn, priority) {
        /******/ if (chunkIds) {
            /******/ priority = priority || 0;
            /******/ for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--)deferred[i] = deferred[i - 1];
            /******/ deferred[i] = [
                chunkIds,
                fn,
                priority
            ];
            /******/ return;
        /******/ }
        /******/ for(var notFulfilled = 1 / 0, i = 0; i < deferred.length; i++){
            /******/ for(var chunkIds = deferred[i][0], fn = deferred[i][1], priority = deferred[i][2], fulfilled = !0, j = 0; j < chunkIds.length; j++)/******/ (!1 & priority || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every(function(key) {
                return __webpack_require__.O[key](chunkIds[j]);
            }) ? /******/ chunkIds.splice(j--, 1) : (/******/ fulfilled = !1, priority < notFulfilled && (notFulfilled = priority));
            /******/ if (fulfilled) {
                /******/ deferred.splice(i--, 1);
                /******/ var r = fn();
                /******/ void 0 !== r && (result = r);
            /******/ }
        /******/ }
        /******/ return result;
    /******/ }, /******/ // getDefaultExport function for compatibility with non-harmony modules
    /******/ __webpack_require__.n = function(module) {
        /******/ var getter = module && module.__esModule ? /******/ function() {
            return module.default;
        } : /******/ function() {
            return module;
        };
        /******/ return /******/ __webpack_require__.d(getter, {
            a: getter
        }), getter;
    /******/ }, /******/ // define getter functions for harmony exports
    /******/ __webpack_require__.d = function(exports, definition) {
        /******/ for(var key in definition)/******/ __webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key) && /******/ Object.defineProperty(exports, key, {
            enumerable: !0,
            get: definition[key]
        });
    /******/ }, /******/ __webpack_require__.f = {}, /******/ // This file contains only the entry chunk.
    /******/ // The chunk loading function for additional chunks
    /******/ __webpack_require__.e = function(chunkId) {
        /******/ return Promise.all(Object.keys(__webpack_require__.f).reduce(function(promises, key) {
            /******/ return /******/ __webpack_require__.f[key](chunkId, promises), promises;
        /******/ }, []));
    /******/ }, /******/ // This function allow to reference async chunks
    /******/ __webpack_require__.u = function(chunkId) {
        return(/******/ // return url for filenames not based on template
        /******/ 774 === chunkId ? "static/chunks/framework-054ead69ea8124b4cb27.js" : 266 === chunkId ? "static/chunks/266-aee26c928109d49d6151.js" : "static/chunks/" + (({
            358: "hello1",
            367: "hello2",
            689: "hello-world"
        })[chunkId] || chunkId) + "." + ({
            358: "4066327636ea41cc1002",
            367: "339fbf9b6616133531f3",
            383: "5942fafdbede773d29c7",
            411: "0fbee7df8bd8b42967ec",
            689: "1af1130392dd1b8d7964",
            808: "7518829f34ebf3ce0082",
            916: "2317bfea2c41354132bd",
            974: "b9fed4786fc6d4a5745d"
        })[chunkId] + ".js");
    /******/ }, /******/ // This function allow to reference all chunks
    /******/ __webpack_require__.miniCssF = function(chunkId) {
    /******/ }, /******/ __webpack_require__.g = function() {
        /******/ if ("object" == typeof globalThis) return globalThis;
        /******/ try {
            /******/ return this || Function("return this")();
        /******/ } catch (e) {
            /******/ if ("object" == typeof window) return window;
        /******/ }
    /******/ }(), /******/ __webpack_require__.o = function(obj, prop) {
        return Object.prototype.hasOwnProperty.call(obj, prop);
    }, inProgress = {}, /******/ // loadScript function to load a script via script tag
    /******/ __webpack_require__.l = function(url, done, key, chunkId) {
        /******/ if (inProgress[url]) return void inProgress[url].push(done);
        /******/ if (void 0 !== key) /******/ for(var script, needAttach, scripts = document.getElementsByTagName("script"), i = 0; i < scripts.length; i++){
            /******/ var s = scripts[i];
            /******/ if (s.getAttribute("src") == url || s.getAttribute("data-webpack") == "_N_E:" + key) {
                script = s;
                break;
            }
        /******/ }
        script || (/******/ needAttach = !0, /******/ /******/ /******/ (script = document.createElement("script")).charset = "utf-8", /******/ script.timeout = 120, __webpack_require__.nc && /******/ script.setAttribute("nonce", __webpack_require__.nc), /******/ script.setAttribute("data-webpack", "_N_E:" + key), /******/ script.src = url), /******/ inProgress[url] = [
            done
        ];
        /******/ var onScriptComplete = function(prev, event) {
            /******/ // avoid mem leaks in IE.
            /******/ script.onerror = script.onload = null, /******/ clearTimeout(timeout);
            /******/ var doneFns = inProgress[url];
            /******/ if (/******/ delete inProgress[url], /******/ script.parentNode && script.parentNode.removeChild(script), /******/ doneFns && doneFns.forEach(function(fn) {
                return fn(event);
            }), prev) return prev(event);
        /******/ }, timeout = setTimeout(onScriptComplete.bind(null, void 0, {
            type: "timeout",
            target: script
        }), 120000);
        /******/ script.onerror = onScriptComplete.bind(null, script.onerror), /******/ script.onload = onScriptComplete.bind(null, script.onload), /******/ needAttach && document.head.appendChild(script);
    /******/ }, /******/ // define __esModule on exports
    /******/ __webpack_require__.r = function(exports) {
        "u" > typeof Symbol && Symbol.toStringTag && /******/ Object.defineProperty(exports, Symbol.toStringTag, {
            value: "Module"
        }), /******/ Object.defineProperty(exports, "__esModule", {
            value: !0
        });
    /******/ }, /******/ __webpack_require__.p = "/_next/", installedChunks = {
        /******/ 272: 0
    }, /******/ /******/ __webpack_require__.f.j = function(chunkId, promises) {
        /******/ // JSONP chunk loading for javascript
        /******/ var installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : void 0;
        /******/ if (0 !== installedChunkData) // 0 means "already installed".
        /******/ /******/ // a Promise means "currently loading".
        /******/ if (installedChunkData) /******/ promises.push(installedChunkData[2]);
        else /******/ if (272 != chunkId) {
            /******/ // setup Promise in chunk cache
            /******/ var promise = new Promise(function(resolve, reject) {
                installedChunkData = installedChunks[chunkId] = [
                    resolve,
                    reject
                ];
            });
            /******/ promises.push(installedChunkData[2] = promise);
            /******/ /******/ // start chunk loading
            /******/ var url = __webpack_require__.p + __webpack_require__.u(chunkId), error = Error();
            /******/ __webpack_require__.l(url, function(event) {
                /******/ if (__webpack_require__.o(installedChunks, chunkId) && (0 !== /******/ (installedChunkData = installedChunks[chunkId]) && (installedChunks[chunkId] = void 0), installedChunkData)) {
                    /******/ var errorType = event && ("load" === event.type ? "missing" : event.type), realSrc = event && event.target && event.target.src;
                    /******/ error.message = "Loading chunk " + chunkId + " failed.\n(" + errorType + ": " + realSrc + ")", /******/ error.name = "ChunkLoadError", /******/ error.type = errorType, /******/ error.request = realSrc, /******/ installedChunkData[1](error);
                /******/ }
            /******/ }, "chunk-" + chunkId, chunkId);
        /******/ } else installedChunks[chunkId] = 0;
    /******/ }, /******/ /******/ // no prefetching
    /******/ /******/ // no preloaded
    /******/ /******/ // no HMR
    /******/ /******/ // no HMR manifest
    /******/ /******/ __webpack_require__.O.j = function(chunkId) {
        return 0 === installedChunks[chunkId];
    }, webpackJsonpCallback = function(parentChunkLoadingFunction, data) {
        /******/ var moduleId, chunkId, chunkIds = data[0], moreModules = data[1], runtime = data[2], i = 0;
        /******/ for(moduleId in moreModules)/******/ __webpack_require__.o(moreModules, moduleId) && /******/ (__webpack_require__.m[moduleId] = moreModules[moduleId]);
        /******/ if (runtime) var result = runtime(__webpack_require__);
        /******/ for(parentChunkLoadingFunction && parentChunkLoadingFunction(data); i < chunkIds.length; i++)/******/ chunkId = chunkIds[i], __webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId] && /******/ installedChunks[chunkId][0](), /******/ installedChunks[chunkIds[i]] = 0;
        /******/ return __webpack_require__.O(result);
    /******/ }, /******/ (chunkLoadingGlobal = self.webpackChunk_N_E = self.webpackChunk_N_E || []).forEach(webpackJsonpCallback.bind(null, 0)), /******/ chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ /************************************************************************/ /******/ /******/ /******/ }();
