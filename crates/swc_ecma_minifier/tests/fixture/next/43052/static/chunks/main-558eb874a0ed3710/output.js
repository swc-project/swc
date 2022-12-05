(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
    [
        179
    ],
    {
        932: function(__unused_webpack_module, exports) {
            "use strict";
            var __webpack_unused_export__;
            ({
                value: true
            });
            exports.Z = function(fn) {
                return function() {
                    var self1 = this, args = arguments;
                    return new Promise(function(resolve, reject) {
                        var gen = fn.apply(self1, args);
                        function _next(value) {
                            asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
                        }
                        function _throw(err) {
                            asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
                        }
                        _next(void 0);
                    });
                };
            };
            function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
                try {
                    var info = gen[key](arg);
                    var value = info.value;
                } catch (error) {
                    reject(error);
                    return;
                }
                if (info.done) resolve(value);
                else Promise.resolve(value).then(_next, _throw);
            }
        },
        6495: function(__unused_webpack_module, exports) {
            "use strict";
            var __webpack_unused_export__;
            ({
                value: true
            });
            exports.Z = function() {
                return extends_.apply(this, arguments);
            };
            function extends_() {
                extends_ = Object.assign || function(target) {
                    for(var i = 1; i < arguments.length; i++){
                        var source = arguments[i];
                        for(var key in source)if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
                    }
                    return target;
                };
                return extends_.apply(this, arguments);
            }
        },
        2648: function(__unused_webpack_module, exports) {
            "use strict";
            var __webpack_unused_export__;
            ({
                value: true
            });
            exports.Z = function(obj) {
                return obj && obj.__esModule ? obj : {
                    default: obj
                };
            };
        },
        1598: function(__unused_webpack_module, exports) {
            "use strict";
            var __webpack_unused_export__;
            ({
                value: true
            });
            exports.Z = function(obj, nodeInterop) {
                if (!nodeInterop && obj && obj.__esModule) {
                    return obj;
                }
                if (null === obj || "object" != typeof obj && "function" != typeof obj) {
                    return {
                        default: obj
                    };
                }
                var cache = _getRequireWildcardCache(nodeInterop);
                if (cache && cache.has(obj)) {
                    return cache.get(obj);
                }
                var newObj = {};
                var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
                for(var key in obj)if ("default" !== key && Object.prototype.hasOwnProperty.call(obj, key)) {
                    var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
                    if (desc && (desc.get || desc.set)) Object.defineProperty(newObj, key, desc);
                    else newObj[key] = obj[key];
                }
                newObj.default = obj;
                if (cache) cache.set(obj, newObj);
                return newObj;
            };
            function _getRequireWildcardCache(nodeInterop1) {
                if ("function" != typeof WeakMap) return null;
                var cacheBabelInterop = new WeakMap();
                var cacheNodeInterop = new WeakMap();
                return (_getRequireWildcardCache = function(nodeInterop) {
                    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
                })(nodeInterop1);
            }
        },
        7273: function(__unused_webpack_module, exports) {
            "use strict";
            var __webpack_unused_export__;
            ({
                value: true
            });
            exports.Z = function(source, excluded) {
                if (null == source) return {};
                var target = {};
                var sourceKeys = Object.keys(source);
                var key, i;
                for(i = 0; i < sourceKeys.length; i++){
                    key = sourceKeys[i];
                    if (!(excluded.indexOf(key) >= 0)) target[key] = source[key];
                }
                return target;
            };
        },
        37: function() {
            "trimStart" in String.prototype || (String.prototype.trimStart = String.prototype.trimLeft), "trimEnd" in String.prototype || (String.prototype.trimEnd = String.prototype.trimRight), "description" in Symbol.prototype || Object.defineProperty(Symbol.prototype, "description", {
                configurable: !0,
                get: function() {
                    var t = /\((.*)\)/.exec(this.toString());
                    return t ? t[1] : void 0;
                }
            }), Array.prototype.flat || (Array.prototype.flat = function(t, r) {
                return r = this.concat.apply([], this), t > 1 && r.some(Array.isArray) ? r.flat(t - 1) : r;
            }, Array.prototype.flatMap = function(t, r) {
                return this.map(t, r).flat();
            }), Promise.prototype.finally || (Promise.prototype.finally = function(t) {
                if ("function" != typeof t) return this.then(t, t);
                var r = this.constructor || Promise;
                return this.then(function(o) {
                    return r.resolve(t()).then(function() {
                        return o;
                    });
                }, function(o) {
                    return r.resolve(t()).then(function() {
                        throw o;
                    });
                });
            }), Object.fromEntries || (Object.fromEntries = function(t) {
                return Array.from(t).reduce(function(t, r) {
                    return t[r[0]] = r[1], t;
                }, {});
            });
        },
        3468: function(module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.addBasePath = function(path, required) {
                if (false) ;
                return _normalizeTrailingSlash.normalizePathTrailingSlash(_addPathPrefix.addPathPrefix(path, ""));
            };
            var _addPathPrefix = __webpack_require__(4135);
            var _normalizeTrailingSlash = __webpack_require__(2700);
            if (("function" == typeof exports.default || "object" == typeof exports.default && null !== exports.default) && void 0 === exports.default.__esModule) {
                Object.defineProperty(exports.default, "__esModule", {
                    value: true
                });
                Object.assign(exports.default, exports);
                module.exports = exports.default;
            }
        },
        4465: function(module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.addLocale = void 0;
            var _normalizeTrailingSlash = __webpack_require__(2700);
            exports.addLocale = function(path) {
                for(var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++)args[_key - 1] = arguments[_key];
                if (false) ;
                return path;
            };
            if (("function" == typeof exports.default || "object" == typeof exports.default && null !== exports.default) && void 0 === exports.default.__esModule) {
                Object.defineProperty(exports.default, "__esModule", {
                    value: true
                });
                Object.assign(exports.default, exports);
                module.exports = exports.default;
            }
        },
        4643: function(module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.detectDomainLocale = void 0;
            exports.detectDomainLocale = function() {
                for(var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
                if (false) ;
            };
            if (("function" == typeof exports.default || "object" == typeof exports.default && null !== exports.default) && void 0 === exports.default.__esModule) {
                Object.defineProperty(exports.default, "__esModule", {
                    value: true
                });
                Object.assign(exports.default, exports);
                module.exports = exports.default;
            }
        },
        928: function(module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.hasBasePath = function(path) {
                return _pathHasPrefix.pathHasPrefix(path, "");
            };
            var _pathHasPrefix = __webpack_require__(3210);
            if (("function" == typeof exports.default || "object" == typeof exports.default && null !== exports.default) && void 0 === exports.default.__esModule) {
                Object.defineProperty(exports.default, "__esModule", {
                    value: true
                });
                Object.assign(exports.default, exports);
                module.exports = exports.default;
            }
        },
        1831: function(module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports["default"] = function() {
                return {
                    mountedInstances: new Set(),
                    updateHead: (head)=>{
                        const tags = {};
                        head.forEach((h)=>{
                            if ("link" === h.type && h.props["data-optimized-fonts"]) {
                                if (document.querySelector('style[data-href="'.concat(h.props["data-href"], '"]'))) {
                                    return;
                                }
                                h.props.href = h.props["data-href"];
                                h.props["data-href"] = void 0;
                            }
                            const components = tags[h.type] || [];
                            components.push(h);
                            tags[h.type] = components;
                        });
                        const titleComponent = tags.title ? tags.title[0] : null;
                        let title = "";
                        if (titleComponent) {
                            const { children  } = titleComponent.props;
                            title = "string" == typeof children ? children : Array.isArray(children) ? children.join("") : "";
                        }
                        if (title !== document.title) document.title = title;
                        [
                            "meta",
                            "base",
                            "link",
                            "style",
                            "script"
                        ].forEach((type)=>{
                            (function(type, components) {
                                const headEl = document.getElementsByTagName("head")[0];
                                const headCountEl = headEl.querySelector("meta[name=next-head-count]");
                                if (false) ;
                                const headCount = Number(headCountEl.content);
                                const oldTags = [];
                                for(let i = 0, j = headCountEl.previousElementSibling; i < headCount; i++, j = (null == j ? void 0 : j.previousElementSibling) || null){
                                    var ref;
                                    if ((null == j ? void 0 : null == (ref = j.tagName) ? void 0 : ref.toLowerCase()) === type) oldTags.push(j);
                                }
                                const newTags = components.map(reactElementToDOM).filter((newTag)=>{
                                    for(let k = 0, len = oldTags.length; k < len; k++){
                                        const oldTag = oldTags[k];
                                        if (isEqualNode(oldTag, newTag)) {
                                            oldTags.splice(k, 1);
                                            return false;
                                        }
                                    }
                                    return true;
                                });
                                oldTags.forEach((t)=>{
                                    var ref;
                                    return null == (ref = t.parentNode) ? void 0 : ref.removeChild(t);
                                });
                                newTags.forEach((t)=>headEl.insertBefore(t, headCountEl));
                                headCountEl.content = (headCount - oldTags.length + newTags.length).toString();
                            })(type, tags[type] || []);
                        });
                    }
                };
            };
            exports.isEqualNode = isEqualNode;
            exports.DOMAttributeNames = void 0;
            const DOMAttributeNames = {
                acceptCharset: "accept-charset",
                className: "class",
                htmlFor: "for",
                httpEquiv: "http-equiv",
                noModule: "noModule"
            };
            exports.DOMAttributeNames = DOMAttributeNames;
            function reactElementToDOM(param) {
                let { type , props  } = param;
                const el = document.createElement(type);
                for(const p in props){
                    if (!props.hasOwnProperty(p)) continue;
                    if ("children" === p || "dangerouslySetInnerHTML" === p) continue;
                    if (void 0 === props[p]) continue;
                    const attr = DOMAttributeNames[p] || p.toLowerCase();
                    if ("script" === type && ("async" === attr || "defer" === attr || "noModule" === attr)) el[attr] = !!props[p];
                    else el.setAttribute(attr, props[p]);
                }
                const { children , dangerouslySetInnerHTML  } = props;
                if (dangerouslySetInnerHTML) el.innerHTML = dangerouslySetInnerHTML.__html || "";
                else if (children) el.textContent = "string" == typeof children ? children : Array.isArray(children) ? children.join("") : "";
                return el;
            }
            function isEqualNode(oldTag, newTag) {
                if (oldTag instanceof HTMLElement && newTag instanceof HTMLElement) {
                    const nonce = newTag.getAttribute("nonce");
                    if (nonce && !oldTag.getAttribute("nonce")) {
                        const cloneTag = newTag.cloneNode(true);
                        cloneTag.setAttribute("nonce", "");
                        cloneTag.nonce = nonce;
                        return nonce === oldTag.nonce && oldTag.isEqualNode(cloneTag);
                    }
                }
                return oldTag.isEqualNode(newTag);
            }
            if (("function" == typeof exports.default || "object" == typeof exports.default && null !== exports.default) && void 0 === exports.default.__esModule) {
                Object.defineProperty(exports.default, "__esModule", {
                    value: true
                });
                Object.assign(exports.default, exports);
                module.exports = exports.default;
            }
        },
        4534: function(module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            const _interopRequireWildcard = __webpack_require__(1598).Z;
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.initialize = function() {
                return _initialize.apply(this, arguments);
            };
            exports.hydrate = function(opts) {
                return _hydrate.apply(this, arguments);
            };
            exports.emitter = exports.router = exports.version = void 0;
            var _async_to_generator = __webpack_require__(932).Z;
            var _extends = __webpack_require__(6495).Z;
            var _interop_require_default = __webpack_require__(2648).Z;
            var _interop_require_wildcard = __webpack_require__(1598).Z;
            __webpack_require__(37);
            var _react = _interop_require_default(__webpack_require__(7294));
            var _client = _interop_require_default(__webpack_require__(745));
            var _headManagerContext = __webpack_require__(4664);
            var _mitt = _interop_require_default(__webpack_require__(8550));
            var _routerContext = __webpack_require__(2692);
            var _isDynamic = __webpack_require__(6238);
            var _querystring = __webpack_require__(4919);
            var _runtimeConfig = __webpack_require__(6949);
            var _utils = __webpack_require__(670);
            var _portal = __webpack_require__(7345);
            var _headManager = _interop_require_default(__webpack_require__(1831));
            var _pageLoader = _interop_require_default(__webpack_require__(976));
            var _performanceRelayer = _interop_require_default(__webpack_require__(659));
            var _routeAnnouncer = __webpack_require__(8483);
            var _router = __webpack_require__(880);
            var _isError = __webpack_require__(676);
            var _imageConfigContext = __webpack_require__(8730);
            var _removeBasePath = __webpack_require__(2813);
            var _hasBasePath = __webpack_require__(928);
            var _appRouterContext = __webpack_require__(8245);
            var _adapters = __webpack_require__(401);
            var _hooksClientContext = __webpack_require__(8914);
            exports.version = "13.0.3";
            let router;
            exports.router = router;
            const emitter = _mitt.default();
            exports.emitter = emitter;
            const looseToArray = (input)=>[].slice.call(input);
            let initialData;
            let defaultLocale;
            let asPath;
            let pageLoader;
            let appElement;
            let headManager;
            let initialMatchesMiddleware = false;
            let lastAppProps;
            let lastRenderReject;
            let webpackHMR;
            let CachedApp, onPerfEntry;
            let CachedComponent;
            self.__next_require__ = __webpack_require__;
            class Container extends _react.default.Component {
                componentDidCatch(componentErr, info) {
                    this.props.fn(componentErr, info);
                }
                componentDidMount() {
                    this.scrollToHash();
                    if (router.isSsr && "/404" !== initialData.page && "/_error" !== initialData.page && (initialData.isFallback || initialData.nextExport && (_isDynamic.isDynamicRoute(router.pathname) || location.search || initialMatchesMiddleware) || initialData.props && initialData.props.__N_SSG && (location.search || initialMatchesMiddleware))) router.replace(router.pathname + "?" + String(_querystring.assign(_querystring.urlQueryToSearchParams(router.query), new URLSearchParams(location.search))), asPath, {
                        _h: 1,
                        shallow: !initialData.isFallback && !initialMatchesMiddleware
                    }).catch((err)=>{
                        if (!err.cancelled) throw err;
                    });
                }
                componentDidUpdate() {
                    this.scrollToHash();
                }
                scrollToHash() {
                    let { hash  } = location;
                    hash = hash && hash.substring(1);
                    if (!hash) return;
                    const el = document.getElementById(hash);
                    if (!el) return;
                    setTimeout(()=>el.scrollIntoView(), 0);
                }
                render() {
                    if (true) {
                        return this.props.children;
                    }
                }
            }
            function _initialize() {
                _initialize = _async_to_generator(function*() {
                    let opts = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                    if (false) ;
                    initialData = JSON.parse(document.getElementById("__NEXT_DATA__").textContent);
                    window.__NEXT_DATA__ = initialData;
                    defaultLocale = initialData.defaultLocale;
                    const prefix = initialData.assetPrefix || "";
                    __webpack_require__.p = "".concat(prefix, "/_next/");
                    _runtimeConfig.setConfig({
                        serverRuntimeConfig: {},
                        publicRuntimeConfig: initialData.runtimeConfig || {}
                    });
                    asPath = _utils.getURL();
                    if (_hasBasePath.hasBasePath(asPath)) asPath = _removeBasePath.removeBasePath(asPath);
                    if (false) ;
                    if (initialData.scriptLoader) {
                        const { initScriptLoader  } = __webpack_require__(3573);
                        initScriptLoader(initialData.scriptLoader);
                    }
                    pageLoader = new _pageLoader.default(initialData.buildId, prefix);
                    const register = (param)=>{
                        let [r, f] = param;
                        return pageLoader.routeLoader.onEntrypoint(r, f);
                    };
                    if (window.__NEXT_P) window.__NEXT_P.map((p)=>setTimeout(()=>register(p), 0));
                    window.__NEXT_P = [];
                    window.__NEXT_P.push = register;
                    headManager = _headManager.default();
                    headManager.getIsSsr = ()=>{
                        return router.isSsr;
                    };
                    appElement = document.getElementById("__next");
                    return {
                        assetPrefix: prefix
                    };
                });
                return _initialize.apply(this, arguments);
            }
            function renderApp(App, appProps) {
                return _react.default.createElement(App, Object.assign({}, appProps));
            }
            function AppContainer(param) {
                let { children  } = param;
                var _autoExport;
                return _react.default.createElement(Container, {
                    fn: (error)=>renderError({
                            App: CachedApp,
                            err: error
                        }).catch((err)=>console.error("Error rendering page: ", err))
                }, _react.default.createElement(_appRouterContext.AppRouterContext.Provider, {
                    value: _adapters.adaptForAppRouterInstance(router)
                }, _react.default.createElement(_hooksClientContext.SearchParamsContext.Provider, {
                    value: _adapters.adaptForSearchParams(router)
                }, _react.default.createElement(_adapters.PathnameContextProviderAdapter, {
                    router: router,
                    isAutoExport: null != (_autoExport = self.__NEXT_DATA__.autoExport) && _autoExport
                }, _react.default.createElement(_routerContext.RouterContext.Provider, {
                    value: _router.makePublicRouterInstance(router)
                }, _react.default.createElement(_headManagerContext.HeadManagerContext.Provider, {
                    value: headManager
                }, _react.default.createElement(_imageConfigContext.ImageConfigContext.Provider, {
                    value: {
                        deviceSizes: [
                            640,
                            750,
                            828,
                            1080,
                            1200,
                            1920,
                            2048,
                            3840
                        ],
                        imageSizes: [
                            16,
                            32,
                            48,
                            64,
                            96,
                            128,
                            256,
                            384
                        ],
                        path: "/_next/image",
                        loader: "default",
                        dangerouslyAllowSVG: false,
                        unoptimized: false
                    }
                }, children)))))));
            }
            const wrapApp = (App)=>(wrappedAppProps)=>{
                    const appProps = _extends({}, wrappedAppProps, {
                        Component: CachedComponent,
                        err: initialData.err,
                        router
                    });
                    return _react.default.createElement(AppContainer, null, renderApp(App, appProps));
                };
            function renderError(renderErrorProps) {
                let { App , err  } = renderErrorProps;
                if (false) ;
                console.error(err);
                console.error("A client-side exception has occurred, see here for more info: https://nextjs.org/docs/messages/client-side-exception-occurred");
                return pageLoader.loadPage("/_error").then((param)=>{
                    let { page: ErrorComponent , styleSheets  } = param;
                    return (null == lastAppProps ? void 0 : lastAppProps.Component) === ErrorComponent ? Promise.resolve().then(()=>_interopRequireWildcard(__webpack_require__(67))).then((errorModule)=>{
                        return Promise.resolve().then(()=>_interopRequireWildcard(__webpack_require__(4297))).then((appModule)=>{
                            App = appModule.default;
                            renderErrorProps.App = App;
                            return errorModule;
                        });
                    }).then((m)=>({
                            ErrorComponent: m.default,
                            styleSheets: []
                        })) : {
                        ErrorComponent,
                        styleSheets
                    };
                }).then((param)=>{
                    let { ErrorComponent , styleSheets  } = param;
                    var ref;
                    const AppTree = wrapApp(App);
                    const appCtx = {
                        Component: ErrorComponent,
                        AppTree,
                        router,
                        ctx: {
                            err,
                            pathname: initialData.page,
                            query: initialData.query,
                            asPath,
                            AppTree
                        }
                    };
                    return Promise.resolve((null == (ref = renderErrorProps.props) ? void 0 : ref.err) ? renderErrorProps.props : _utils.loadGetInitialProps(App, appCtx)).then((initProps)=>doRender(_extends({}, renderErrorProps, {
                            err,
                            Component: ErrorComponent,
                            styleSheets,
                            props: initProps
                        })));
                });
            }
            function Head(param) {
                let { callback  } = param;
                _react.default.useLayoutEffect(()=>callback(), [
                    callback
                ]);
                return null;
            }
            let reactRoot = null;
            let shouldHydrate = true;
            function clearMarks() {
                [
                    "beforeRender",
                    "afterHydrate",
                    "afterRender",
                    "routeChange"
                ].forEach((mark)=>performance.clearMarks(mark));
            }
            function markHydrateComplete() {
                if (!_utils.ST) return;
                performance.mark("afterHydrate");
                performance.measure("Next.js-before-hydration", "navigationStart", "beforeRender");
                performance.measure("Next.js-hydration", "beforeRender", "afterHydrate");
                if (onPerfEntry) performance.getEntriesByName("Next.js-hydration").forEach(onPerfEntry);
                clearMarks();
            }
            function markRenderComplete() {
                if (!_utils.ST) return;
                performance.mark("afterRender");
                const navStartEntries = performance.getEntriesByName("routeChange", "mark");
                if (!navStartEntries.length) return;
                performance.measure("Next.js-route-change-to-render", navStartEntries[0].name, "beforeRender");
                performance.measure("Next.js-render", "beforeRender", "afterRender");
                if (onPerfEntry) {
                    performance.getEntriesByName("Next.js-render").forEach(onPerfEntry);
                    performance.getEntriesByName("Next.js-route-change-to-render").forEach(onPerfEntry);
                }
                clearMarks();
                [
                    "Next.js-route-change-to-render",
                    "Next.js-render"
                ].forEach((measure)=>performance.clearMeasures(measure));
            }
            function Root(param) {
                let { callbacks , children  } = param;
                _react.default.useLayoutEffect(()=>callbacks.forEach((callback)=>callback()), [
                    callbacks
                ]);
                _react.default.useEffect(()=>{
                    _performanceRelayer.default(onPerfEntry);
                }, []);
                if (false) ;
                return children;
            }
            function doRender(input) {
                let { App , Component , props , err  } = input;
                let styleSheets = "initial" in input ? void 0 : input.styleSheets;
                Component = Component || lastAppProps.Component;
                props = props || lastAppProps.props;
                const appProps = _extends({}, props, {
                    Component,
                    err,
                    router
                });
                lastAppProps = appProps;
                let canceled = false;
                let resolvePromise;
                const renderPromise = new Promise((resolve, reject)=>{
                    if (lastRenderReject) lastRenderReject();
                    resolvePromise = ()=>{
                        lastRenderReject = null;
                        resolve();
                    };
                    lastRenderReject = ()=>{
                        canceled = true;
                        lastRenderReject = null;
                        const error = Error("Cancel rendering route");
                        error.cancelled = true;
                        reject(error);
                    };
                });
                function onRootCommit() {
                    resolvePromise();
                }
                (function() {
                    if (!styleSheets) {
                        return false;
                    }
                    const currentStyleTags = looseToArray(document.querySelectorAll("style[data-n-href]"));
                    const currentHrefs = new Set(currentStyleTags.map((tag)=>tag.getAttribute("data-n-href")));
                    const noscript = document.querySelector("noscript[data-n-css]");
                    const nonce = null == noscript ? void 0 : noscript.getAttribute("data-n-css");
                    styleSheets.forEach((param)=>{
                        let { href , text  } = param;
                        if (!currentHrefs.has(href)) {
                            const styleTag = document.createElement("style");
                            styleTag.setAttribute("data-n-href", href);
                            styleTag.setAttribute("media", "x");
                            if (nonce) styleTag.setAttribute("nonce", nonce);
                            document.head.appendChild(styleTag);
                            styleTag.appendChild(document.createTextNode(text));
                        }
                    });
                    return true;
                })();
                const elem = _react.default.createElement(_react.default.Fragment, null, _react.default.createElement(Head, {
                    callback: function() {
                        if (styleSheets && !canceled) {
                            const desiredHrefs = new Set(styleSheets.map((s)=>s.href));
                            const currentStyleTags = looseToArray(document.querySelectorAll("style[data-n-href]"));
                            const currentHrefs = currentStyleTags.map((tag)=>tag.getAttribute("data-n-href"));
                            for(let idx = 0; idx < currentHrefs.length; ++idx)if (desiredHrefs.has(currentHrefs[idx])) currentStyleTags[idx].removeAttribute("media");
                            else currentStyleTags[idx].setAttribute("media", "x");
                            let referenceNode = document.querySelector("noscript[data-n-css]");
                            if (referenceNode) styleSheets.forEach((param)=>{
                                let { href  } = param;
                                const targetTag = document.querySelector('style[data-n-href="'.concat(href, '"]'));
                                if (targetTag) {
                                    referenceNode.parentNode.insertBefore(targetTag, referenceNode.nextSibling);
                                    referenceNode = targetTag;
                                }
                            });
                            looseToArray(document.querySelectorAll("link[data-n-p]")).forEach((el)=>{
                                el.parentNode.removeChild(el);
                            });
                        }
                        if (input.scroll) {
                            const htmlElement = document.documentElement;
                            const existing = htmlElement.style.scrollBehavior;
                            htmlElement.style.scrollBehavior = "auto";
                            window.scrollTo(input.scroll.x, input.scroll.y);
                            htmlElement.style.scrollBehavior = existing;
                        }
                    }
                }), _react.default.createElement(AppContainer, null, renderApp(App, appProps), _react.default.createElement(_portal.Portal, {
                    type: "next-route-announcer"
                }, _react.default.createElement(_routeAnnouncer.RouteAnnouncer, null))));
                (function(domEl, fn) {
                    if (_utils.ST) performance.mark("beforeRender");
                    const reactEl = fn(shouldHydrate ? markHydrateComplete : markRenderComplete);
                    if (reactRoot) {
                        const startTransition = _react.default.startTransition;
                        startTransition(()=>{
                            reactRoot.render(reactEl);
                        });
                    } else {
                        reactRoot = _client.default.hydrateRoot(domEl, reactEl);
                        shouldHydrate = false;
                    }
                })(appElement, (callback)=>_react.default.createElement(Root, {
                        callbacks: [
                            callback,
                            onRootCommit
                        ]
                    }, _react.default.createElement(_react.default.StrictMode, null, elem)));
                return renderPromise;
            }
            function render(renderingProps) {
                return _render.apply(this, arguments);
            }
            function _render() {
                _render = _async_to_generator(function*(renderingProps) {
                    if (renderingProps.err) {
                        yield renderError(renderingProps);
                        return;
                    }
                    try {
                        yield doRender(renderingProps);
                    } catch (err) {
                        const renderErr = _isError.getProperError(err);
                        if (renderErr.cancelled) {
                            throw renderErr;
                        }
                        if (false) ;
                        yield renderError(_extends({}, renderingProps, {
                            err: renderErr
                        }));
                    }
                });
                return _render.apply(this, arguments);
            }
            function _hydrate() {
                _hydrate = _async_to_generator(function*(opts) {
                    let initialErr = initialData.err;
                    try {
                        const appEntrypoint = yield pageLoader.routeLoader.whenEntrypoint("/_app");
                        if ("error" in appEntrypoint) {
                            throw appEntrypoint.error;
                        }
                        const { component: app , exports: mod  } = appEntrypoint;
                        CachedApp = app;
                        if (mod && mod.reportWebVitals) onPerfEntry = (param)=>{
                            let { id , name , startTime , value , duration , entryType , entries , attribution  } = param;
                            const uniqueID = "".concat(Date.now(), "-").concat(Math.floor(Math.random() * (9e12 - 1)) + 1e12);
                            let perfStartEntry;
                            if (entries && entries.length) perfStartEntry = entries[0].startTime;
                            const webVitals = {
                                id: id || uniqueID,
                                name,
                                startTime: startTime || perfStartEntry,
                                value: null == value ? duration : value,
                                label: "mark" === entryType || "measure" === entryType ? "custom" : "web-vital"
                            };
                            if (attribution) webVitals.attribution = attribution;
                            mod.reportWebVitals(webVitals);
                        };
                        const pageEntrypoint = yield pageLoader.routeLoader.whenEntrypoint(initialData.page);
                        if ("error" in pageEntrypoint) {
                            throw pageEntrypoint.error;
                        }
                        CachedComponent = pageEntrypoint.component;
                        if (false) ;
                    } catch (error1) {
                        initialErr = _isError.getProperError(error1);
                    }
                    if (false) ;
                    if (window.__NEXT_PRELOADREADY) yield window.__NEXT_PRELOADREADY(initialData.dynamicIds);
                    exports.router = router = _router.createRouter(initialData.page, initialData.query, asPath, {
                        initialProps: initialData.props,
                        pageLoader,
                        App: CachedApp,
                        Component: CachedComponent,
                        wrapApp,
                        err: initialErr,
                        isFallback: Boolean(initialData.isFallback),
                        subscription: (info, App, scroll)=>render(Object.assign({}, info, {
                                App,
                                scroll
                            })),
                        locale: initialData.locale,
                        locales: initialData.locales,
                        defaultLocale,
                        domainLocales: initialData.domainLocales,
                        isPreview: initialData.isPreview
                    });
                    initialMatchesMiddleware = yield router._initialMatchesMiddlewarePromise;
                    const renderCtx = {
                        App: CachedApp,
                        initial: true,
                        Component: CachedComponent,
                        props: initialData.props,
                        err: initialErr
                    };
                    if (null == opts ? void 0 : opts.beforeRender) yield opts.beforeRender();
                    render(renderCtx);
                });
                return _hydrate.apply(this, arguments);
            }
            if (("function" == typeof exports.default || "object" == typeof exports.default && null !== exports.default) && void 0 === exports.default.__esModule) {
                Object.defineProperty(exports.default, "__esModule", {
                    value: true
                });
                Object.assign(exports.default, exports);
                module.exports = exports.default;
            }
        },
        1783: function(module, exports, __webpack_require__) {
            "use strict";
            var _ = __webpack_require__(4534);
            window.next = {
                version: _.version,
                get router () {
                    return _.router;
                },
                emitter: _.emitter
            };
            _.initialize({}).then(()=>_.hydrate()).catch(console.error);
            if (("function" == typeof exports.default || "object" == typeof exports.default && null !== exports.default) && void 0 === exports.default.__esModule) {
                Object.defineProperty(exports.default, "__esModule", {
                    value: true
                });
                Object.assign(exports.default, exports);
                module.exports = exports.default;
            }
        },
        2700: function(module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.normalizePathTrailingSlash = void 0;
            var _removeTrailingSlash = __webpack_require__(12);
            var _parsePath = __webpack_require__(6727);
            const normalizePathTrailingSlash = (path)=>{
                if (!path.startsWith("/")) {
                    return path;
                }
                const { pathname , query , hash  } = _parsePath.parsePath(path);
                if (false) ;
                return "".concat(_removeTrailingSlash.removeTrailingSlash(pathname)).concat(query).concat(hash);
            };
            exports.normalizePathTrailingSlash = normalizePathTrailingSlash;
            if (("function" == typeof exports.default || "object" == typeof exports.default && null !== exports.default) && void 0 === exports.default.__esModule) {
                Object.defineProperty(exports.default, "__esModule", {
                    value: true
                });
                Object.assign(exports.default, exports);
                module.exports = exports.default;
            }
        },
        976: function(module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports["default"] = void 0;
            var _interop_require_default = __webpack_require__(2648).Z;
            var _addBasePath = __webpack_require__(3468);
            var _router = __webpack_require__(1003);
            var _getAssetPathFromRoute = _interop_require_default(__webpack_require__(7929));
            var _addLocale = __webpack_require__(4465);
            var _isDynamic = __webpack_require__(6238);
            var _parseRelativeUrl = __webpack_require__(2864);
            var _removeTrailingSlash = __webpack_require__(12);
            var _routeLoader = __webpack_require__(2497);
            exports["default"] = class PageLoader {
                getPageList() {
                    if (true) {
                        return _routeLoader.getClientBuildManifest().then((manifest)=>manifest.sortedPages);
                    }
                }
                getMiddleware() {
                    if (true) {
                        window.__MIDDLEWARE_MATCHERS = [] || void 0;
                        return window.__MIDDLEWARE_MATCHERS;
                    }
                }
                getDataHref(params) {
                    const { asPath , href , locale  } = params;
                    const { pathname: hrefPathname , query , search  } = _parseRelativeUrl.parseRelativeUrl(href);
                    const { pathname: asPathname  } = _parseRelativeUrl.parseRelativeUrl(asPath);
                    const route = _removeTrailingSlash.removeTrailingSlash(hrefPathname);
                    if ("/" !== route[0]) {
                        throw Error('Route name should start with a "/", got "'.concat(route, '"'));
                    }
                    return ((path)=>{
                        const dataRoute = _getAssetPathFromRoute.default(_removeTrailingSlash.removeTrailingSlash(_addLocale.addLocale(path, locale)), ".json");
                        return _addBasePath.addBasePath("/_next/data/".concat(this.buildId).concat(dataRoute).concat(search), true);
                    })(params.skipInterpolation ? asPathname : _isDynamic.isDynamicRoute(route) ? _router.interpolateAs(hrefPathname, asPathname, query).result : route);
                }
                _isSsg(route) {
                    return this.promisedSsgManifest.then((manifest)=>manifest.has(route));
                }
                loadPage(route) {
                    return this.routeLoader.loadRoute(route).then((res)=>{
                        if ("component" in res) {
                            return {
                                page: res.component,
                                mod: res.exports,
                                styleSheets: res.styles.map((o)=>({
                                        href: o.href,
                                        text: o.content
                                    }))
                            };
                        }
                        throw res.error;
                    });
                }
                prefetch(route) {
                    return this.routeLoader.prefetch(route);
                }
                constructor(buildId, assetPrefix){
                    this.routeLoader = _routeLoader.createRouteLoader(assetPrefix);
                    this.buildId = buildId;
                    this.assetPrefix = assetPrefix;
                    this.promisedSsgManifest = new Promise((resolve)=>{
                        if (window.__SSG_MANIFEST) resolve(window.__SSG_MANIFEST);
                        else window.__SSG_MANIFEST_CB = ()=>{
                            resolve(window.__SSG_MANIFEST);
                        };
                    });
                }
            };
            if (("function" == typeof exports.default || "object" == typeof exports.default && null !== exports.default) && void 0 === exports.default.__esModule) {
                Object.defineProperty(exports.default, "__esModule", {
                    value: true
                });
                Object.assign(exports.default, exports);
                module.exports = exports.default;
            }
        },
        659: function(module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports["default"] = void 0;
            const WEB_VITALS = [
                "CLS",
                "FCP",
                "FID",
                "INP",
                "LCP",
                "TTFB"
            ];
            const initialHref = location.href;
            let isRegistered = false;
            let userReportHandler;
            function onReport(metric) {
                if (userReportHandler) userReportHandler(metric);
                if (false) var ref;
            }
            var _default = (onPerfEntry)=>{
                userReportHandler = onPerfEntry;
                if (isRegistered) {
                    return;
                }
                isRegistered = true;
                const attributions = void 0;
                for (const webVital of WEB_VITALS){
                    try {
                        let mod;
                        if (false) ;
                        if (!mod) mod = __webpack_require__(8018);
                        mod["on".concat(webVital)](onReport);
                    } catch (err) {
                        console.warn("Failed to track ".concat(webVital, " web-vital"), err);
                    }
                }
            };
            exports["default"] = _default;
            if (("function" == typeof exports.default || "object" == typeof exports.default && null !== exports.default) && void 0 === exports.default.__esModule) {
                Object.defineProperty(exports.default, "__esModule", {
                    value: true
                });
                Object.assign(exports.default, exports);
                module.exports = exports.default;
            }
        },
        7345: function(module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.Portal = void 0;
            var _react = __webpack_require__(7294);
            var _reactDom = __webpack_require__(3935);
            const Portal = (param)=>{
                let { children , type  } = param;
                const [portalNode, setPortalNode] = _react.useState(null);
                _react.useEffect(()=>{
                    const element = document.createElement(type);
                    document.body.appendChild(element);
                    setPortalNode(element);
                    return ()=>{
                        document.body.removeChild(element);
                    };
                }, [
                    type
                ]);
                return portalNode ? _reactDom.createPortal(children, portalNode) : null;
            };
            exports.Portal = Portal;
            if (("function" == typeof exports.default || "object" == typeof exports.default && null !== exports.default) && void 0 === exports.default.__esModule) {
                Object.defineProperty(exports.default, "__esModule", {
                    value: true
                });
                Object.assign(exports.default, exports);
                module.exports = exports.default;
            }
        },
        2813: function(module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.removeBasePath = function(path) {
                if (false) ;
                path = path.slice(0);
                if (!path.startsWith("/")) path = "/".concat(path);
                return path;
            };
            var _hasBasePath = __webpack_require__(928);
            if (("function" == typeof exports.default || "object" == typeof exports.default && null !== exports.default) && void 0 === exports.default.__esModule) {
                Object.defineProperty(exports.default, "__esModule", {
                    value: true
                });
                Object.assign(exports.default, exports);
                module.exports = exports.default;
            }
        },
        6876: function(module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.removeLocale = function(path, locale) {
                if (false) ;
                return path;
            };
            var _parsePath = __webpack_require__(6727);
            if (("function" == typeof exports.default || "object" == typeof exports.default && null !== exports.default) && void 0 === exports.default.__esModule) {
                Object.defineProperty(exports.default, "__esModule", {
                    value: true
                });
                Object.assign(exports.default, exports);
                module.exports = exports.default;
            }
        },
        4686: function(module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.cancelIdleCallback = exports.requestIdleCallback = void 0;
            const requestIdleCallback = "undefined" != typeof self && self.requestIdleCallback && self.requestIdleCallback.bind(window) || function(cb) {
                let start = Date.now();
                return setTimeout(function() {
                    cb({
                        didTimeout: false,
                        timeRemaining: function() {
                            return Math.max(0, 50 - (Date.now() - start));
                        }
                    });
                }, 1);
            };
            exports.requestIdleCallback = requestIdleCallback;
            const cancelIdleCallback = "undefined" != typeof self && self.cancelIdleCallback && self.cancelIdleCallback.bind(window) || function(id) {
                return clearTimeout(id);
            };
            exports.cancelIdleCallback = cancelIdleCallback;
            if (("function" == typeof exports.default || "object" == typeof exports.default && null !== exports.default) && void 0 === exports.default.__esModule) {
                Object.defineProperty(exports.default, "__esModule", {
                    value: true
                });
                Object.assign(exports.default, exports);
                module.exports = exports.default;
            }
        },
        8483: function(module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports["default"] = exports.RouteAnnouncer = void 0;
            var _interop_require_default = __webpack_require__(2648).Z;
            var _react = _interop_require_default(__webpack_require__(7294));
            var _router = __webpack_require__(880);
            const nextjsRouteAnnouncerStyles = {
                border: 0,
                clip: "rect(0 0 0 0)",
                height: "1px",
                margin: "-1px",
                overflow: "hidden",
                padding: 0,
                position: "absolute",
                width: "1px",
                whiteSpace: "nowrap",
                wordWrap: "normal"
            };
            const RouteAnnouncer = ()=>{
                const { asPath  } = _router.useRouter();
                const [routeAnnouncement, setRouteAnnouncement] = _react.default.useState("");
                const previouslyLoadedPath = _react.default.useRef(asPath);
                _react.default.useEffect(()=>{
                    if (previouslyLoadedPath.current === asPath) return;
                    previouslyLoadedPath.current = asPath;
                    if (document.title) setRouteAnnouncement(document.title);
                    else {
                        const pageHeader = document.querySelector("h1");
                        var ref;
                        const content = null != (ref = null == pageHeader ? void 0 : pageHeader.innerText) ? ref : null == pageHeader ? void 0 : pageHeader.textContent;
                        setRouteAnnouncement(content || asPath);
                    }
                }, [
                    asPath
                ]);
                return _react.default.createElement("p", {
                    "aria-live": "assertive",
                    id: "__next-route-announcer__",
                    role: "alert",
                    style: nextjsRouteAnnouncerStyles
                }, routeAnnouncement);
            };
            exports.RouteAnnouncer = RouteAnnouncer;
            exports["default"] = RouteAnnouncer;
            if (("function" == typeof exports.default || "object" == typeof exports.default && null !== exports.default) && void 0 === exports.default.__esModule) {
                Object.defineProperty(exports.default, "__esModule", {
                    value: true
                });
                Object.assign(exports.default, exports);
                module.exports = exports.default;
            }
        },
        2497: function(module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.markAssetError = markAssetError;
            exports.isAssetError = function(err) {
                return err && ASSET_LOAD_ERROR in err;
            };
            exports.getClientBuildManifest = getClientBuildManifest;
            exports.createRouteLoader = function(assetPrefix) {
                const entrypoints = new Map();
                const loadedScripts = new Map();
                const styleSheets = new Map();
                const routes = new Map();
                function maybeExecuteScript(src) {
                    if (true) {
                        let prom = loadedScripts.get(src.toString());
                        if (prom) {
                            return prom;
                        }
                        if (document.querySelector('script[src^="'.concat(src, '"]'))) {
                            return Promise.resolve();
                        }
                        loadedScripts.set(src.toString(), prom = function(src, script) {
                            return new Promise((resolve, reject)=>{
                                script = document.createElement("script");
                                script.onload = resolve;
                                script.onerror = ()=>reject(markAssetError(Error("Failed to load script: ".concat(src))));
                                script.crossOrigin = void 0;
                                script.src = src;
                                document.body.appendChild(script);
                            });
                        }(src));
                        return prom;
                    }
                }
                function fetchStyleSheet(href) {
                    let prom = styleSheets.get(href);
                    if (prom) {
                        return prom;
                    }
                    styleSheets.set(href, prom = fetch(href).then((res)=>{
                        if (!res.ok) {
                            throw Error("Failed to load stylesheet: ".concat(href));
                        }
                        return res.text().then((text)=>({
                                href: href,
                                content: text
                            }));
                    }).catch((err)=>{
                        throw markAssetError(err);
                    }));
                    return prom;
                }
                return {
                    whenEntrypoint (route) {
                        return withFuture(route, entrypoints);
                    },
                    onEntrypoint (route, execute) {
                        (execute ? Promise.resolve().then(()=>execute()).then((exports1)=>({
                                component: exports1 && exports1.default || exports1,
                                exports: exports1
                            }), (err)=>({
                                error: err
                            })) : Promise.resolve(void 0)).then((input)=>{
                            const old = entrypoints.get(route);
                            if (old && "resolve" in old) {
                                if (input) {
                                    entrypoints.set(route, input);
                                    old.resolve(input);
                                }
                            } else {
                                if (input) entrypoints.set(route, input);
                                else entrypoints.delete(route);
                                routes.delete(route);
                            }
                        });
                    },
                    loadRoute (route, prefetch) {
                        return withFuture(route, routes, ()=>{
                            let devBuildPromiseResolve;
                            if (false) ;
                            return resolvePromiseWithTimeout(getFilesForRoute(assetPrefix, route).then((param)=>{
                                let { scripts , css  } = param;
                                return Promise.all([
                                    entrypoints.has(route) ? [] : Promise.all(scripts.map(maybeExecuteScript)),
                                    Promise.all(css.map(fetchStyleSheet))
                                ]);
                            }).then((res)=>{
                                return this.whenEntrypoint(route).then((entrypoint)=>({
                                        entrypoint,
                                        styles: res[1]
                                    }));
                            }), 3800, markAssetError(Error("Route did not complete loading: ".concat(route)))).then((param)=>{
                                let { entrypoint , styles  } = param;
                                const res = Object.assign({
                                    styles: styles
                                }, entrypoint);
                                return "error" in entrypoint ? entrypoint : res;
                            }).catch((err)=>{
                                if (prefetch) {
                                    throw err;
                                }
                                return {
                                    error: err
                                };
                            }).finally(()=>{
                                return null == devBuildPromiseResolve ? void 0 : devBuildPromiseResolve();
                            });
                        });
                    },
                    prefetch (route) {
                        let cn;
                        if (cn = navigator.connection) {
                            if (cn.saveData || /2g/.test(cn.effectiveType)) return Promise.resolve();
                        }
                        return getFilesForRoute(assetPrefix, route).then((output)=>Promise.all(canPrefetch ? output.scripts.map((script)=>(function(href, as, link) {
                                    return new Promise((resolve, reject)=>{
                                        const selector = '\n      link[rel="prefetch"][href^="'.concat(href, '"],\n      link[rel="preload"][href^="').concat(href, '"],\n      script[src^="').concat(href, '"]');
                                        if (document.querySelector(selector)) {
                                            return resolve();
                                        }
                                        link = document.createElement("link");
                                        if (as) link.as = as;
                                        link.rel = "prefetch";
                                        link.crossOrigin = void 0;
                                        link.onload = resolve;
                                        link.onerror = ()=>reject(markAssetError(Error("Failed to prefetch: ".concat(href))));
                                        link.href = href;
                                        document.head.appendChild(link);
                                    });
                                })(script.toString(), "script")) : [])).then(()=>{
                            _requestIdleCallback.requestIdleCallback(()=>this.loadRoute(route, true).catch(()=>{}));
                        }).catch(()=>{});
                    }
                };
            };
            var _interop_require_default = __webpack_require__(2648).Z;
            var _getAssetPathFromRoute = _interop_require_default(__webpack_require__(7929));
            var _trustedTypes = __webpack_require__(5407);
            var _requestIdleCallback = __webpack_require__(4686);
            function withFuture(key, map, generator) {
                let entry = map.get(key);
                if (entry) {
                    if ("future" in entry) {
                        return entry.future;
                    }
                    return Promise.resolve(entry);
                }
                let resolver;
                const prom = new Promise((resolve)=>{
                    resolver = resolve;
                });
                map.set(key, entry = {
                    resolve: resolver,
                    future: prom
                });
                return generator ? generator().then((value)=>(resolver(value), value)).catch((err)=>{
                    map.delete(key);
                    throw err;
                }) : prom;
            }
            const ASSET_LOAD_ERROR = Symbol("ASSET_LOAD_ERROR");
            function markAssetError(err) {
                return Object.defineProperty(err, ASSET_LOAD_ERROR, {});
            }
            const canPrefetch = function(link) {
                try {
                    link = document.createElement("link");
                    return !!window.MSInputMethodContext && !!document.documentMode || link.relList.supports("prefetch");
                } catch (e) {
                    return false;
                }
            }();
            let devBuildPromise;
            function resolvePromiseWithTimeout(p, ms, err) {
                return new Promise((resolve, reject)=>{
                    let cancelled = false;
                    p.then((r)=>{
                        cancelled = true;
                        resolve(r);
                    }).catch(reject);
                    if (false) ;
                    if (true) _requestIdleCallback.requestIdleCallback(()=>setTimeout(()=>{
                            if (!cancelled) reject(err);
                        }, ms));
                });
            }
            function getClientBuildManifest() {
                if (self.__BUILD_MANIFEST) {
                    return Promise.resolve(self.__BUILD_MANIFEST);
                }
                const onBuildManifest = new Promise((resolve)=>{
                    const cb = self.__BUILD_MANIFEST_CB;
                    self.__BUILD_MANIFEST_CB = ()=>{
                        resolve(self.__BUILD_MANIFEST);
                        cb && cb();
                    };
                });
                return resolvePromiseWithTimeout(onBuildManifest, 3800, markAssetError(Error("Failed to load client build manifest")));
            }
            function getFilesForRoute(assetPrefix, route) {
                if (false) ;
                return getClientBuildManifest().then((manifest)=>{
                    if (!(route in manifest)) {
                        throw markAssetError(Error("Failed to lookup route: ".concat(route)));
                    }
                    const allFiles = manifest[route].map((entry)=>assetPrefix + "/_next/" + encodeURI(entry));
                    return {
                        scripts: allFiles.filter((v)=>v.endsWith(".js")).map((v)=>_trustedTypes.__unsafeCreateTrustedScriptURL(v)),
                        css: allFiles.filter((v)=>v.endsWith(".css"))
                    };
                });
            }
            if (("function" == typeof exports.default || "object" == typeof exports.default && null !== exports.default) && void 0 === exports.default.__esModule) {
                Object.defineProperty(exports.default, "__esModule", {
                    value: true
                });
                Object.assign(exports.default, exports);
                module.exports = exports.default;
            }
        },
        880: function(module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            Object.defineProperty(exports, "Router", {
                enumerable: true,
                get: function() {
                    return _router.default;
                }
            });
            Object.defineProperty(exports, "withRouter", {
                enumerable: true,
                get: function() {
                    return _withRouter.default;
                }
            });
            exports.useRouter = function() {
                const router = _react.default.useContext(_routerContext.RouterContext);
                if (!router) {
                    throw Error("Error: NextRouter was not mounted. https://nextjs.org/docs/messages/next-router-not-mounted");
                }
                return router;
            };
            exports.createRouter = function() {
                for(var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
                singletonRouter.router = new _router.default(...args);
                singletonRouter.readyCallbacks.forEach((cb)=>cb());
                singletonRouter.readyCallbacks = [];
                return singletonRouter.router;
            };
            exports.makePublicRouterInstance = function(router) {
                const instance = {};
                for (const property of urlPropertyFields){
                    if ("object" == typeof router[property]) {
                        instance[property] = Object.assign(Array.isArray(router[property]) ? [] : {}, router[property]);
                        continue;
                    }
                    instance[property] = router[property];
                }
                instance.events = _router.default.events;
                coreMethodFields.forEach((field)=>{
                    instance[field] = function() {
                        for(var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
                        return router[field](...args);
                    };
                });
                return instance;
            };
            exports["default"] = void 0;
            var _interop_require_default = __webpack_require__(2648).Z;
            var _react = _interop_require_default(__webpack_require__(7294));
            var _router = _interop_require_default(__webpack_require__(1003));
            var _routerContext = __webpack_require__(2692);
            var _isError = _interop_require_default(__webpack_require__(676));
            var _withRouter = _interop_require_default(__webpack_require__(9977));
            const singletonRouter = {
                router: null,
                readyCallbacks: [],
                ready (cb) {
                    if (this.router) return cb();
                    if (true) this.readyCallbacks.push(cb);
                }
            };
            const urlPropertyFields = [
                "pathname",
                "route",
                "query",
                "asPath",
                "components",
                "isFallback",
                "basePath",
                "locale",
                "locales",
                "defaultLocale",
                "isReady",
                "isPreview",
                "isLocaleDomain",
                "domainLocales"
            ];
            const coreMethodFields = [
                "push",
                "replace",
                "reload",
                "back",
                "prefetch",
                "beforePopState"
            ];
            Object.defineProperty(singletonRouter, "events", {
                get () {
                    return _router.default.events;
                }
            });
            function getRouter() {
                if (!singletonRouter.router) {
                    throw Error('No router instance found.\nYou should only use "next/router" on the client side of your app.\n');
                }
                return singletonRouter.router;
            }
            urlPropertyFields.forEach((field)=>{
                Object.defineProperty(singletonRouter, field, {
                    get () {
                        const router = getRouter();
                        return router[field];
                    }
                });
            });
            coreMethodFields.forEach((field)=>{
                singletonRouter[field] = function() {
                    for(var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
                    const router = getRouter();
                    return router[field](...args);
                };
            });
            [
                "routeChangeStart",
                "beforeHistoryChange",
                "routeChangeComplete",
                "routeChangeError",
                "hashChangeStart",
                "hashChangeComplete"
            ].forEach((event)=>{
                singletonRouter.ready(()=>{
                    _router.default.events.on(event, function() {
                        for(var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
                        const eventField = "on".concat(event.charAt(0).toUpperCase()).concat(event.substring(1));
                        if (singletonRouter[eventField]) {
                            try {
                                singletonRouter[eventField](...args);
                            } catch (err) {
                                console.error("Error when running the Router event: ".concat(eventField));
                                console.error(_isError.default(err) ? "".concat(err.message, "\n").concat(err.stack) : err + "");
                            }
                        }
                    });
                });
            });
            exports["default"] = singletonRouter;
            if (("function" == typeof exports.default || "object" == typeof exports.default && null !== exports.default) && void 0 === exports.default.__esModule) {
                Object.defineProperty(exports.default, "__esModule", {
                    value: true
                });
                Object.assign(exports.default, exports);
                module.exports = exports.default;
            }
        },
        3573: function(module, exports, __webpack_require__) {
            "use strict";
            "use client";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.handleClientScriptLoad = handleClientScriptLoad;
            exports.initScriptLoader = function(scriptLoaderItems) {
                scriptLoaderItems.forEach(handleClientScriptLoad);
                (function() {
                    const scripts = [
                        ...document.querySelectorAll('[data-nscript="beforeInteractive"]'),
                        ...document.querySelectorAll('[data-nscript="beforePageRender"]')
                    ];
                    scripts.forEach((script)=>{
                        const cacheKey = script.id || script.getAttribute("src");
                        LoadCache.add(cacheKey);
                    });
                })();
            };
            exports["default"] = void 0;
            var _extends = __webpack_require__(6495).Z;
            var _interop_require_default = __webpack_require__(2648).Z;
            var _interop_require_wildcard = __webpack_require__(1598).Z;
            var _object_without_properties_loose = __webpack_require__(7273).Z;
            var _reactDom = _interop_require_default(__webpack_require__(3935));
            var _react = _interop_require_wildcard(__webpack_require__(7294));
            var _headManagerContext = __webpack_require__(4664);
            var _headManager = __webpack_require__(1831);
            var _requestIdleCallback = __webpack_require__(4686);
            "use client";
            const ScriptCache = new Map();
            const LoadCache = new Set();
            const ignoreProps = [
                "onLoad",
                "onReady",
                "dangerouslySetInnerHTML",
                "children",
                "onError",
                "strategy"
            ];
            const loadScript = (props)=>{
                const { src , id , onLoad =()=>{} , onReady =null , dangerouslySetInnerHTML , children ="" , strategy ="afterInteractive" , onError  } = props;
                const cacheKey = id || src;
                if (cacheKey && LoadCache.has(cacheKey)) {
                    return;
                }
                if (ScriptCache.has(src)) {
                    LoadCache.add(cacheKey);
                    ScriptCache.get(src).then(onLoad, onError);
                    return;
                }
                const afterLoad = ()=>{
                    if (onReady) onReady();
                    LoadCache.add(cacheKey);
                };
                const el = document.createElement("script");
                const loadPromise = new Promise((resolve, reject)=>{
                    el.addEventListener("load", function(e) {
                        resolve();
                        if (onLoad) onLoad.call(this, e);
                        afterLoad();
                    });
                    el.addEventListener("error", function(e) {
                        reject(e);
                    });
                }).catch(function(e) {
                    if (onError) onError(e);
                });
                if (dangerouslySetInnerHTML) {
                    el.innerHTML = dangerouslySetInnerHTML.__html || "";
                    afterLoad();
                } else if (children) {
                    el.textContent = "string" == typeof children ? children : Array.isArray(children) ? children.join("") : "";
                    afterLoad();
                } else if (src) {
                    el.src = src;
                    ScriptCache.set(src, loadPromise);
                }
                for (const [k, value] of Object.entries(props)){
                    if (void 0 === value || ignoreProps.includes(k)) {
                        continue;
                    }
                    const attr = _headManager.DOMAttributeNames[k] || k.toLowerCase();
                    el.setAttribute(attr, value);
                }
                if ("worker" === strategy) el.setAttribute("type", "text/partytown");
                el.setAttribute("data-nscript", strategy);
                document.body.appendChild(el);
            };
            function handleClientScriptLoad(props) {
                const { strategy ="afterInteractive"  } = props;
                if ("lazyOnload" === strategy) window.addEventListener("load", ()=>{
                    _requestIdleCallback.requestIdleCallback(()=>loadScript(props));
                });
                else loadScript(props);
            }
            function Script(props) {
                const { id , src ="" , onLoad =()=>{} , onReady =null , strategy ="afterInteractive" , onError  } = props, restProps = _object_without_properties_loose(props, [
                    "id",
                    "src",
                    "onLoad",
                    "onReady",
                    "strategy",
                    "onError"
                ]);
                const { updateScripts , scripts , getIsSsr , appDir , nonce  } = _react.useContext(_headManagerContext.HeadManagerContext);
                const hasOnReadyEffectCalled = _react.useRef(false);
                _react.useEffect(()=>{
                    const cacheKey = id || src;
                    if (!hasOnReadyEffectCalled.current) {
                        if (onReady && cacheKey && LoadCache.has(cacheKey)) onReady();
                        hasOnReadyEffectCalled.current = true;
                    }
                }, [
                    onReady,
                    id,
                    src
                ]);
                const hasLoadScriptEffectCalled = _react.useRef(false);
                _react.useEffect(()=>{
                    if (!hasLoadScriptEffectCalled.current) {
                        if ("afterInteractive" === strategy) loadScript(props);
                        else if ("lazyOnload" === strategy) (function(props) {
                            if ("complete" === document.readyState) _requestIdleCallback.requestIdleCallback(()=>loadScript(props));
                            else window.addEventListener("load", ()=>{
                                _requestIdleCallback.requestIdleCallback(()=>loadScript(props));
                            });
                        })(props);
                        hasLoadScriptEffectCalled.current = true;
                    }
                }, [
                    props,
                    strategy
                ]);
                if ("beforeInteractive" === strategy || "worker" === strategy) {
                    if (updateScripts) {
                        scripts[strategy] = (scripts[strategy] || []).concat([
                            _extends({
                                id,
                                src,
                                onLoad,
                                onReady,
                                onError
                            }, restProps)
                        ]);
                        updateScripts(scripts);
                    } else if (getIsSsr && getIsSsr()) LoadCache.add(id || src);
                    else if (getIsSsr && !getIsSsr()) loadScript(props);
                }
                if (appDir) {
                    if ("beforeInteractive" === strategy) {
                        if (!src) {
                            if (restProps.dangerouslySetInnerHTML) {
                                restProps.children = restProps.dangerouslySetInnerHTML.__html;
                                delete restProps.dangerouslySetInnerHTML;
                            }
                            return _react.default.createElement("script", {
                                nonce: nonce,
                                dangerouslySetInnerHTML: {
                                    __html: "(self.__next_s=self.__next_s||[]).push(".concat(JSON.stringify([
                                        0,
                                        _extends({}, restProps)
                                    ]), ")")
                                }
                            });
                        }
                        _reactDom.default.preload(src, restProps.integrity ? {
                            as: "script",
                            integrity: restProps.integrity
                        } : {
                            as: "script"
                        });
                        return _react.default.createElement("script", {
                            nonce: nonce,
                            dangerouslySetInnerHTML: {
                                __html: "(self.__next_s=self.__next_s||[]).push(".concat(JSON.stringify([
                                    src
                                ]), ")")
                            }
                        });
                    }
                    if ("afterInteractive" === strategy) {
                        if (src) _reactDom.default.preload(src, restProps.integrity ? {
                            as: "script",
                            integrity: restProps.integrity
                        } : {
                            as: "script"
                        });
                    }
                }
                return null;
            }
            Object.defineProperty(Script, "__nextScript", {
                value: true
            });
            exports["default"] = Script;
            if (("function" == typeof exports.default || "object" == typeof exports.default && null !== exports.default) && void 0 === exports.default.__esModule) {
                Object.defineProperty(exports.default, "__esModule", {
                    value: true
                });
                Object.assign(exports.default, exports);
                module.exports = exports.default;
            }
        },
        5407: function(module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.__unsafeCreateTrustedScriptURL = function(url) {
                var ref;
                return (null == (ref = function() {
                    if (void 0 === policy) {
                        var ref;
                        policy = (null == (ref = window.trustedTypes) ? void 0 : ref.createPolicy("nextjs", {
                            createHTML: (input)=>input,
                            createScript: (input)=>input,
                            createScriptURL: (input)=>input
                        })) || null;
                    }
                    return policy;
                }()) ? void 0 : ref.createScriptURL(url)) || url;
            };
            let policy;
            if (("function" == typeof exports.default || "object" == typeof exports.default && null !== exports.default) && void 0 === exports.default.__esModule) {
                Object.defineProperty(exports.default, "__esModule", {
                    value: true
                });
                Object.assign(exports.default, exports);
                module.exports = exports.default;
            }
        },
        9977: function(module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports["default"] = function(ComposedComponent) {
                function WithRouterWrapper(props) {
                    return _react.default.createElement(ComposedComponent, Object.assign({
                        router: _router.useRouter()
                    }, props));
                }
                WithRouterWrapper.getInitialProps = ComposedComponent.getInitialProps;
                WithRouterWrapper.origGetInitialProps = ComposedComponent.origGetInitialProps;
                if (false) ;
                return WithRouterWrapper;
            };
            var _interop_require_default = __webpack_require__(2648).Z;
            var _react = _interop_require_default(__webpack_require__(7294));
            var _router = __webpack_require__(880);
            if (("function" == typeof exports.default || "object" == typeof exports.default && null !== exports.default) && void 0 === exports.default.__esModule) {
                Object.defineProperty(exports.default, "__esModule", {
                    value: true
                });
                Object.assign(exports.default, exports);
                module.exports = exports.default;
            }
        },
        4297: function(__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports["default"] = void 0;
            var _async_to_generator = __webpack_require__(932).Z;
            var _interop_require_default = __webpack_require__(2648).Z;
            var _react = _interop_require_default(__webpack_require__(7294));
            var _utils = __webpack_require__(670);
            function appGetInitialProps(_) {
                return _appGetInitialProps.apply(this, arguments);
            }
            function _appGetInitialProps() {
                _appGetInitialProps = _async_to_generator(function*(param) {
                    let { Component , ctx  } = param;
                    const pageProps = yield _utils.loadGetInitialProps(Component, ctx);
                    return {
                        pageProps
                    };
                });
                return _appGetInitialProps.apply(this, arguments);
            }
            var _Component;
            class App extends (_Component = _react.default.Component) {
                render() {
                    const { Component , pageProps  } = this.props;
                    return _react.default.createElement(Component, Object.assign({}, pageProps));
                }
            }
            App.origGetInitialProps = appGetInitialProps;
            App.getInitialProps = appGetInitialProps;
            exports["default"] = App;
        },
        67: function(__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports["default"] = void 0;
            var _interop_require_default = __webpack_require__(2648).Z;
            var _react = _interop_require_default(__webpack_require__(7294));
            var _head = _interop_require_default(__webpack_require__(3121));
            const statusCodes = {
                400: "Bad Request",
                404: "This page could not be found",
                405: "Method Not Allowed",
                500: "Internal Server Error"
            };
            function _getInitialProps(param) {
                let { res , err  } = param;
                const statusCode = res && res.statusCode ? res.statusCode : err ? err.statusCode : 404;
                return {
                    statusCode
                };
            }
            const styles = {
                error: {
                    fontFamily: '-apple-system, BlinkMacSystemFont, Roboto, "Segoe UI", "Fira Sans", Avenir, "Helvetica Neue", "Lucida Grande", sans-serif',
                    height: "100vh",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center"
                },
                desc: {
                    display: "inline-block",
                    textAlign: "left",
                    lineHeight: "49px",
                    height: "49px",
                    verticalAlign: "middle"
                },
                h1: {
                    display: "inline-block",
                    margin: 0,
                    marginRight: "20px",
                    padding: "0 23px 0 0",
                    fontSize: "24px",
                    fontWeight: 500,
                    verticalAlign: "top",
                    lineHeight: "49px"
                },
                h2: {
                    fontSize: "14px",
                    fontWeight: "normal",
                    lineHeight: "49px",
                    margin: 0,
                    padding: 0
                }
            };
            var _Component;
            class Error1 extends (_Component = _react.default.Component) {
                render() {
                    const { statusCode , withDarkMode =true  } = this.props;
                    const title = this.props.title || statusCodes[statusCode] || "An unexpected error has occurred";
                    return _react.default.createElement("div", {
                        style: styles.error
                    }, _react.default.createElement(_head.default, null, _react.default.createElement("title", null, statusCode ? "".concat(statusCode, ": ").concat(title) : "Application error: a client-side exception has occurred")), _react.default.createElement("div", null, _react.default.createElement("style", {
                        dangerouslySetInnerHTML: {
                            __html: "\n                body { margin: 0; color: #000; background: #fff; }\n                .next-error-h1 {\n                  border-right: 1px solid rgba(0, 0, 0, .3);\n                }\n\n                ".concat(withDarkMode ? "@media (prefers-color-scheme: dark) {\n                  body { color: #fff; background: #000; }\n                  .next-error-h1 {\n                    border-right: 1px solid rgba(255, 255, 255, .3);\n                  }\n                }" : "")
                        }
                    }), statusCode ? _react.default.createElement("h1", {
                        className: "next-error-h1",
                        style: styles.h1
                    }, statusCode) : null, _react.default.createElement("div", {
                        style: styles.desc
                    }, _react.default.createElement("h2", {
                        style: styles.h2
                    }, this.props.title || statusCode ? title : _react.default.createElement(_react.default.Fragment, null, "Application error: a client-side exception has occurred (see the browser console for more information)"), "."))));
                }
            }
            Error1.displayName = "ErrorPage";
            Error1.getInitialProps = _getInitialProps;
            Error1.origGetInitialProps = _getInitialProps;
            exports["default"] = Error1;
        },
        610: function(__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.AmpStateContext = void 0;
            var _interop_require_default = __webpack_require__(2648).Z;
            var _react = _interop_require_default(__webpack_require__(7294));
            const AmpStateContext = _react.default.createContext({});
            exports.AmpStateContext = AmpStateContext;
            if (false) ;
        },
        532: function(__unused_webpack_module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.isInAmpMode = function() {
                let { ampFirst =false , hybrid =false , hasQuery =false  } = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                return ampFirst || hybrid && hasQuery;
            };
        },
        8245: function(__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            "use client";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.TemplateContext = exports.GlobalLayoutRouterContext = exports.LayoutRouterContext = exports.AppRouterContext = exports.CacheStates = void 0;
            var _interop_require_default = __webpack_require__(2648).Z;
            var _react = _interop_require_default(__webpack_require__(7294));
            "use client";
            var CacheStates;
            exports.CacheStates = CacheStates;
            (function(CacheStates) {
                CacheStates["LAZYINITIALIZED"] = "LAZYINITIALIZED";
                CacheStates["DATAFETCH"] = "DATAFETCH";
                CacheStates["READY"] = "READY";
            })(CacheStates || (exports.CacheStates = CacheStates = {}));
            const AppRouterContext = _react.default.createContext(null);
            exports.AppRouterContext = AppRouterContext;
            const LayoutRouterContext = _react.default.createContext(null);
            exports.LayoutRouterContext = LayoutRouterContext;
            const GlobalLayoutRouterContext = _react.default.createContext(null);
            exports.GlobalLayoutRouterContext = GlobalLayoutRouterContext;
            const TemplateContext = _react.default.createContext(null);
            exports.TemplateContext = TemplateContext;
            if (false) ;
        },
        8659: function(__unused_webpack_module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.escapeStringRegexp = function(str) {
                if (reHasRegExp.test(str)) {
                    return str.replace(reReplaceRegExp, "\\$&");
                }
                return str;
            };
            const reHasRegExp = /[|\\{}()[\]^$+*?.-]/;
            const reReplaceRegExp = /[|\\{}()[\]^$+*?.-]/g;
        },
        4664: function(__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.HeadManagerContext = void 0;
            var _interop_require_default = __webpack_require__(2648).Z;
            var _react = _interop_require_default(__webpack_require__(7294));
            const HeadManagerContext = _react.default.createContext({});
            exports.HeadManagerContext = HeadManagerContext;
            if (false) ;
        },
        3121: function(module, exports, __webpack_require__) {
            "use strict";
            "use client";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.defaultHead = defaultHead;
            exports["default"] = void 0;
            var _extends = __webpack_require__(6495).Z;
            var _interop_require_default = __webpack_require__(2648).Z;
            var _interop_require_wildcard = __webpack_require__(1598).Z;
            var _react = _interop_require_wildcard(__webpack_require__(7294));
            var _sideEffect = _interop_require_default(__webpack_require__(1436));
            var _ampContext = __webpack_require__(610);
            var _headManagerContext = __webpack_require__(4664);
            var _ampMode = __webpack_require__(532);
            var _warnOnce = __webpack_require__(7238);
            "use client";
            function defaultHead() {
                let inAmpMode = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
                const head = [
                    _react.default.createElement("meta", {
                        charSet: "utf-8"
                    })
                ];
                if (!inAmpMode) head.push(_react.default.createElement("meta", {
                    name: "viewport",
                    content: "width=device-width"
                }));
                return head;
            }
            function onlyReactElement(list, child) {
                if ("string" == typeof child || "number" == typeof child) {
                    return list;
                }
                if (child.type === _react.default.Fragment) {
                    return list.concat(_react.default.Children.toArray(child.props.children).reduce((fragmentList, fragmentChild)=>{
                        if ("string" == typeof fragmentChild || "number" == typeof fragmentChild) {
                            return fragmentList;
                        }
                        return fragmentList.concat(fragmentChild);
                    }, []));
                }
                return list.concat(child);
            }
            const METATYPES = [
                "name",
                "httpEquiv",
                "charSet",
                "itemProp"
            ];
            function reduceComponents(headChildrenElements, props) {
                const { inAmpMode  } = props;
                return headChildrenElements.reduce(onlyReactElement, []).reverse().concat(defaultHead(inAmpMode).reverse()).filter(function() {
                    const keys = new Set();
                    const tags = new Set();
                    const metaTypes = new Set();
                    const metaCategories = {};
                    return (h)=>{
                        let isUnique = true;
                        let hasKey = false;
                        if (h.key && "number" != typeof h.key && h.key.indexOf("$") > 0) {
                            hasKey = true;
                            const key = h.key.slice(h.key.indexOf("$") + 1);
                            if (keys.has(key)) isUnique = false;
                            else keys.add(key);
                        }
                        switch(h.type){
                            case "title":
                            case "base":
                                if (tags.has(h.type)) isUnique = false;
                                else tags.add(h.type);
                                break;
                            case "meta":
                                for(let i = 0, len = METATYPES.length; i < len; i++){
                                    const metatype = METATYPES[i];
                                    if (!!h.props.hasOwnProperty(metatype)) if ("charSet" === metatype) if (metaTypes.has(metatype)) isUnique = false;
                                    else metaTypes.add(metatype);
                                    else {
                                        const category = h.props[metatype];
                                        const categories = metaCategories[metatype] || new Set();
                                        if (("name" !== metatype || !hasKey) && categories.has(category)) isUnique = false;
                                        else {
                                            categories.add(category);
                                            metaCategories[metatype] = categories;
                                        }
                                    }
                                }
                                break;
                        }
                        return isUnique;
                    };
                }()).reverse().map((c, i)=>{
                    const key = c.key || i;
                    if (!inAmpMode) {
                        if ("link" === c.type && c.props["href"] && [
                            "https://fonts.googleapis.com/css",
                            "https://use.typekit.net/"
                        ].some((url)=>c.props["href"].startsWith(url))) {
                            const newProps = _extends({}, c.props || {});
                            newProps["data-href"] = newProps["href"];
                            newProps["href"] = void 0;
                            newProps["data-optimized-fonts"] = true;
                            return _react.default.cloneElement(c, newProps);
                        }
                    }
                    if (false) ;
                    return _react.default.cloneElement(c, {
                        key
                    });
                });
            }
            exports["default"] = function(param) {
                let { children  } = param;
                const ampState = _react.useContext(_ampContext.AmpStateContext);
                const headManager = _react.useContext(_headManagerContext.HeadManagerContext);
                return _react.default.createElement(_sideEffect.default, {
                    reduceComponentsToState: reduceComponents,
                    headManager: headManager,
                    inAmpMode: _ampMode.isInAmpMode(ampState)
                }, children);
            };
            if (("function" == typeof exports.default || "object" == typeof exports.default && null !== exports.default) && void 0 === exports.default.__esModule) {
                Object.defineProperty(exports.default, "__esModule", {
                    value: true
                });
                Object.assign(exports.default, exports);
                module.exports = exports.default;
            }
        },
        8914: function(__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            "use client";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.LayoutSegmentsContext = exports.ParamsContext = exports.PathnameContext = exports.SearchParamsContext = void 0;
            var _react = __webpack_require__(7294);
            "use client";
            const SearchParamsContext = _react.createContext(null);
            exports.SearchParamsContext = SearchParamsContext;
            const PathnameContext = _react.createContext(null);
            exports.PathnameContext = PathnameContext;
            const ParamsContext = _react.createContext(null);
            exports.ParamsContext = ParamsContext;
            const LayoutSegmentsContext = _react.createContext(null);
            exports.LayoutSegmentsContext = LayoutSegmentsContext;
            if (false) ;
        },
        4769: function(__unused_webpack_module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.normalizeLocalePath = function(pathname, locales) {
                let detectedLocale;
                const pathnameParts = pathname.split("/");
                (locales || []).some((locale)=>{
                    if (pathnameParts[1] && pathnameParts[1].toLowerCase() === locale.toLowerCase()) {
                        detectedLocale = locale;
                        pathnameParts.splice(1, 1);
                        pathname = pathnameParts.join("/") || "/";
                        return true;
                    }
                    return false;
                });
                return {
                    pathname,
                    detectedLocale
                };
            };
        },
        8730: function(__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.ImageConfigContext = void 0;
            var _interop_require_default = __webpack_require__(2648).Z;
            var _react = _interop_require_default(__webpack_require__(7294));
            var _imageConfig = __webpack_require__(139);
            const ImageConfigContext = _react.default.createContext(_imageConfig.imageConfigDefault);
            exports.ImageConfigContext = ImageConfigContext;
            if (false) ;
        },
        139: function(__unused_webpack_module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.imageConfigDefault = exports.VALID_LOADERS = void 0;
            exports.VALID_LOADERS = [
                "default",
                "imgix",
                "cloudinary",
                "akamai",
                "custom"
            ];
            exports.imageConfigDefault = {
                deviceSizes: [
                    640,
                    750,
                    828,
                    1080,
                    1200,
                    1920,
                    2048,
                    3840
                ],
                imageSizes: [
                    16,
                    32,
                    48,
                    64,
                    96,
                    128,
                    256,
                    384
                ],
                path: "/_next/image",
                loader: "default",
                loaderFile: "",
                domains: [],
                disableStaticImages: false,
                minimumCacheTTL: 60,
                formats: [
                    "image/webp"
                ],
                dangerouslyAllowSVG: false,
                contentSecurityPolicy: "script-src 'none'; frame-src 'none'; sandbox;",
                remotePatterns: [],
                unoptimized: false
            };
        },
        2849: function(__unused_webpack_module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.getObjectClassLabel = getObjectClassLabel;
            exports.isPlainObject = function(value) {
                if ("[object Object]" !== getObjectClassLabel(value)) {
                    return false;
                }
                const prototype = Object.getPrototypeOf(value);
                return null === prototype || prototype.hasOwnProperty("isPrototypeOf");
            };
            function getObjectClassLabel(value) {
                return Object.prototype.toString.call(value);
            }
        },
        8550: function(__unused_webpack_module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports["default"] = function() {
                const all = Object.create(null);
                return {
                    on (type, handler) {
                        (all[type] || (all[type] = [])).push(handler);
                    },
                    off (type, handler) {
                        if (all[type]) all[type].splice(all[type].indexOf(handler) >>> 0, 1);
                    },
                    emit (type) {
                        for(var _len = arguments.length, evts = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++)evts[_key - 1] = arguments[_key];
                        (all[type] || []).slice().map((handler)=>{
                            handler(...evts);
                        });
                    }
                };
            };
        },
        6301: function(__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.denormalizePagePath = function(page) {
                let _page = _normalizePathSep.normalizePathSep(page);
                return _page.startsWith("/index/") && !_utils.isDynamicRoute(_page) ? _page.slice(6) : "/index" !== _page ? _page : "/";
            };
            var _utils = __webpack_require__(8588);
            var _normalizePathSep = __webpack_require__(9997);
        },
        9997: function(__unused_webpack_module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.normalizePathSep = function(path) {
                return path.replace(/\\/g, "/");
            };
        },
        2692: function(__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.RouterContext = void 0;
            var _interop_require_default = __webpack_require__(2648).Z;
            var _react = _interop_require_default(__webpack_require__(7294));
            const RouterContext = _react.default.createContext(null);
            exports.RouterContext = RouterContext;
            if (false) ;
        },
        401: function(__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.adaptForAppRouterInstance = function(router) {
                return {
                    back () {
                        router.back();
                    },
                    forward () {
                        router.forward();
                    },
                    refresh () {
                        router.reload();
                    },
                    push (href) {
                        void router.push(href);
                    },
                    replace (href) {
                        void router.replace(href);
                    },
                    prefetch (href) {
                        void router.prefetch(href);
                    }
                };
            };
            exports.adaptForSearchParams = function(router) {
                if (!router.isReady || !router.query) {
                    return new URLSearchParams();
                }
                return function(query) {
                    const params = new URLSearchParams();
                    for (const [name, value] of Object.entries(query))if (Array.isArray(value)) {
                        for (const val of value)params.append(name, val);
                    } else if (void 0 !== value) params.append(name, value);
                    return params;
                }(router.query);
            };
            exports.PathnameContextProviderAdapter = function(_param) {
                var { children , router  } = _param, props = _object_without_properties_loose(_param, [
                    "children",
                    "router"
                ]);
                const ref = _react.useRef(props.isAutoExport);
                const value = _react.useMemo(()=>{
                    const isAutoExport = ref.current;
                    if (isAutoExport) ref.current = false;
                    if (_utils.isDynamicRoute(router.pathname)) {
                        if (router.isFallback) {
                            return null;
                        }
                        if (isAutoExport && !router.isReady) {
                            return null;
                        }
                    }
                    const url = new URL(router.asPath, "http://f");
                    return url.pathname;
                }, [
                    router.asPath,
                    router.isFallback,
                    router.isReady,
                    router.pathname
                ]);
                return _react.default.createElement(_hooksClientContext.PathnameContext.Provider, {
                    value: value
                }, children);
            };
            var _interop_require_wildcard = __webpack_require__(1598).Z;
            var _object_without_properties_loose = __webpack_require__(7273).Z;
            var _react = _interop_require_wildcard(__webpack_require__(7294));
            var _hooksClientContext = __webpack_require__(8914);
            var _utils = __webpack_require__(8588);
        },
        1003: function(__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.matchesMiddleware = matchesMiddleware;
            exports.isLocalURL = isLocalURL;
            exports.interpolateAs = interpolateAs;
            exports.resolveHref = resolveHref;
            exports.createKey = createKey;
            exports["default"] = void 0;
            var _async_to_generator = __webpack_require__(932).Z;
            var _extends = __webpack_require__(6495).Z;
            var _interop_require_default = __webpack_require__(2648).Z;
            var _interop_require_wildcard = __webpack_require__(1598).Z;
            var _normalizeTrailingSlash = __webpack_require__(2700);
            var _removeTrailingSlash = __webpack_require__(12);
            var _routeLoader = __webpack_require__(2497);
            var _script = __webpack_require__(3573);
            var _isError = _interop_require_wildcard(__webpack_require__(676));
            var _denormalizePagePath = __webpack_require__(6301);
            var _normalizeLocalePath = __webpack_require__(4769);
            var _mitt = _interop_require_default(__webpack_require__(8550));
            var _utils = __webpack_require__(670);
            var _isDynamic = __webpack_require__(6238);
            var _parseRelativeUrl = __webpack_require__(2864);
            var _querystring = __webpack_require__(4919);
            var _resolveRewrites = _interop_require_default(__webpack_require__(2431));
            var _routeMatcher = __webpack_require__(3156);
            var _routeRegex = __webpack_require__(4903);
            var _formatUrl = __webpack_require__(7795);
            var _detectDomainLocale = __webpack_require__(4643);
            var _parsePath = __webpack_require__(6727);
            var _addLocale = __webpack_require__(4465);
            var _removeLocale = __webpack_require__(6876);
            var _removeBasePath = __webpack_require__(2813);
            var _addBasePath = __webpack_require__(3468);
            var _hasBasePath = __webpack_require__(928);
            var _getNextPathnameInfo = __webpack_require__(8756);
            var _formatNextPathnameInfo = __webpack_require__(7429);
            var _compareStates = __webpack_require__(9002);
            var _isBot = __webpack_require__(1754);
            function buildCancellationError() {
                return Object.assign(Error("Route Cancelled"), {
                    cancelled: true
                });
            }
            function matchesMiddleware(options) {
                return _matchesMiddleware.apply(this, arguments);
            }
            function _matchesMiddleware() {
                _matchesMiddleware = _async_to_generator(function*(options) {
                    const matchers = yield Promise.resolve(options.router.pageLoader.getMiddleware());
                    if (!matchers) return false;
                    const { pathname: asPathname  } = _parsePath.parsePath(options.asPath);
                    const cleanedAs = _hasBasePath.hasBasePath(asPathname) ? _removeBasePath.removeBasePath(asPathname) : asPathname;
                    const asWithBasePathAndLocale = _addBasePath.addBasePath(_addLocale.addLocale(cleanedAs, options.locale));
                    return matchers.some((m)=>RegExp(m.regexp).test(asWithBasePathAndLocale));
                });
                return _matchesMiddleware.apply(this, arguments);
            }
            function stripOrigin(url) {
                const origin = _utils.getLocationOrigin();
                return url.startsWith(origin) ? url.substring(origin.length) : url;
            }
            function omit(object, keys) {
                const omitted = {};
                Object.keys(object).forEach((key)=>{
                    if (!keys.includes(key)) omitted[key] = object[key];
                });
                return omitted;
            }
            function isLocalURL(url) {
                if (!_utils.isAbsoluteUrl(url)) return true;
                try {
                    const locationOrigin = _utils.getLocationOrigin();
                    const resolved = new URL(url, locationOrigin);
                    return resolved.origin === locationOrigin && _hasBasePath.hasBasePath(resolved.pathname);
                } catch (_) {
                    return false;
                }
            }
            function interpolateAs(route, asPathname, query) {
                let interpolatedRoute = "";
                const dynamicRegex = _routeRegex.getRouteRegex(route);
                const dynamicGroups = dynamicRegex.groups;
                const dynamicMatches = (asPathname !== route ? _routeMatcher.getRouteMatcher(dynamicRegex)(asPathname) : "") || query;
                interpolatedRoute = route;
                const params = Object.keys(dynamicGroups);
                if (!params.every((param)=>{
                    let value = dynamicMatches[param] || "";
                    const { repeat , optional  } = dynamicGroups[param];
                    let replaced = "[".concat(repeat ? "..." : "").concat(param, "]");
                    if (optional) replaced = "".concat(value ? "" : "/", "[").concat(replaced, "]");
                    if (repeat && !Array.isArray(value)) value = [
                        value
                    ];
                    return (optional || param in dynamicMatches) && (interpolatedRoute = interpolatedRoute.replace(replaced, repeat ? value.map((segment)=>encodeURIComponent(segment)).join("/") : encodeURIComponent(value)) || "/");
                })) interpolatedRoute = "";
                return {
                    params,
                    result: interpolatedRoute
                };
            }
            function resolveHref(router, href, resolveAs) {
                let base;
                let urlAsString = "string" == typeof href ? href : _formatUrl.formatWithValidation(href);
                const urlProtoMatch = urlAsString.match(/^[a-zA-Z]{1,}:\/\//);
                const urlAsStringNoProto = urlProtoMatch ? urlAsString.slice(urlProtoMatch[0].length) : urlAsString;
                const urlParts = urlAsStringNoProto.split("?");
                if ((urlParts[0] || "").match(/(\/\/|\\)/)) {
                    console.error("Invalid href passed to next/router: ".concat(urlAsString, ", repeated forward-slashes (//) or backslashes \\ are not valid in the href"));
                    const normalizedUrl = _utils.normalizeRepeatedSlashes(urlAsStringNoProto);
                    urlAsString = (urlProtoMatch ? urlProtoMatch[0] : "") + normalizedUrl;
                }
                if (!isLocalURL(urlAsString)) {
                    return resolveAs ? [
                        urlAsString
                    ] : urlAsString;
                }
                try {
                    base = new URL(urlAsString.startsWith("#") ? router.asPath : router.pathname, "http://n");
                } catch (_) {
                    base = new URL("/", "http://n");
                }
                try {
                    const finalUrl = new URL(urlAsString, base);
                    finalUrl.pathname = _normalizeTrailingSlash.normalizePathTrailingSlash(finalUrl.pathname);
                    let interpolatedAs = "";
                    if (_isDynamic.isDynamicRoute(finalUrl.pathname) && finalUrl.searchParams && resolveAs) {
                        const query = _querystring.searchParamsToUrlQuery(finalUrl.searchParams);
                        const { result , params  } = interpolateAs(finalUrl.pathname, finalUrl.pathname, query);
                        if (result) interpolatedAs = _formatUrl.formatWithValidation({
                            pathname: result,
                            hash: finalUrl.hash,
                            query: omit(query, params)
                        });
                    }
                    const resolvedHref = finalUrl.origin === base.origin ? finalUrl.href.slice(finalUrl.origin.length) : finalUrl.href;
                    return resolveAs ? [
                        resolvedHref,
                        interpolatedAs || resolvedHref
                    ] : resolvedHref;
                } catch (_1) {
                    return resolveAs ? [
                        urlAsString
                    ] : urlAsString;
                }
            }
            function prepareUrlAs(router, url, as) {
                let [resolvedHref, resolvedAs] = resolveHref(router, url, true);
                const origin = _utils.getLocationOrigin();
                const hrefHadOrigin = resolvedHref.startsWith(origin);
                const asHadOrigin = resolvedAs && resolvedAs.startsWith(origin);
                resolvedHref = stripOrigin(resolvedHref);
                resolvedAs = resolvedAs ? stripOrigin(resolvedAs) : resolvedAs;
                const preparedUrl = hrefHadOrigin ? resolvedHref : _addBasePath.addBasePath(resolvedHref);
                const preparedAs = as ? stripOrigin(resolveHref(router, as)) : resolvedAs || resolvedHref;
                return {
                    url: preparedUrl,
                    as: asHadOrigin ? preparedAs : _addBasePath.addBasePath(preparedAs)
                };
            }
            function resolveDynamicRoute(pathname, pages) {
                const cleanPathname = _removeTrailingSlash.removeTrailingSlash(_denormalizePagePath.denormalizePagePath(pathname));
                if ("/404" === cleanPathname || "/_error" === cleanPathname) {
                    return pathname;
                }
                if (!pages.includes(cleanPathname)) pages.some((page)=>{
                    if (_isDynamic.isDynamicRoute(page) && _routeRegex.getRouteRegex(page).re.test(cleanPathname)) {
                        pathname = page;
                        return true;
                    }
                });
                return _removeTrailingSlash.removeTrailingSlash(pathname);
            }
            const manualScrollRestoration = null;
            const SSG_DATA_NOT_FOUND = Symbol("SSG_DATA_NOT_FOUND");
            const backgroundCache = {};
            function handleSmoothScroll(fn) {
                const htmlElement = document.documentElement;
                const existing = htmlElement.style.scrollBehavior;
                htmlElement.style.scrollBehavior = "auto";
                fn();
                htmlElement.style.scrollBehavior = existing;
            }
            function tryToParseAsJSON(text) {
                try {
                    return JSON.parse(text);
                } catch (error) {
                    return null;
                }
            }
            function fetchNextData(param) {
                let { dataHref , inflightCache , isPrefetch , hasMiddleware , isServerRender , parseJSON , persistCache , isBackground , unstable_skipClientCache  } = param;
                const { href: cacheKey  } = new URL(dataHref, window.location.href);
                var ref1;
                const getData = (params)=>{
                    return (function fetchRetry(url, attempts, options) {
                        return fetch(url, {
                            credentials: "same-origin",
                            method: options.method || "GET",
                            headers: Object.assign({}, options.headers, {
                                "x-nextjs-data": "1"
                            })
                        }).then((response)=>{
                            return !response.ok && attempts > 1 && response.status >= 500 ? fetchRetry(url, attempts - 1, options) : response;
                        });
                    })(dataHref, isServerRender ? 3 : 1, {
                        headers: isPrefetch ? {
                            purpose: "prefetch"
                        } : {},
                        method: null != (ref1 = null == params ? void 0 : params.method) ? ref1 : "GET"
                    }).then((response)=>{
                        if (response.ok && (null == params ? void 0 : params.method) === "HEAD") {
                            return {
                                dataHref,
                                response,
                                text: "",
                                json: {},
                                cacheKey
                            };
                        }
                        return response.text().then((text)=>{
                            if (!response.ok) {
                                if (hasMiddleware && [
                                    301,
                                    302,
                                    307,
                                    308
                                ].includes(response.status)) {
                                    return {
                                        dataHref,
                                        response,
                                        text,
                                        json: {},
                                        cacheKey
                                    };
                                }
                                if (!hasMiddleware && 404 === response.status) {
                                    var ref;
                                    if (null == (ref = tryToParseAsJSON(text)) ? void 0 : ref.notFound) {
                                        return {
                                            dataHref,
                                            json: {
                                                notFound: SSG_DATA_NOT_FOUND
                                            },
                                            response,
                                            text,
                                            cacheKey
                                        };
                                    }
                                }
                                const error = Error("Failed to load static props");
                                if (!isServerRender) _routeLoader.markAssetError(error);
                                throw error;
                            }
                            return {
                                dataHref,
                                json: parseJSON ? tryToParseAsJSON(text) : null,
                                response,
                                text,
                                cacheKey
                            };
                        });
                    }).then((data)=>{
                        if (!persistCache || "no-cache" === data.response.headers.get("x-middleware-cache")) delete inflightCache[cacheKey];
                        return data;
                    }).catch((err)=>{
                        delete inflightCache[cacheKey];
                        throw err;
                    });
                };
                if (unstable_skipClientCache && persistCache) {
                    return getData({}).then((data)=>{
                        inflightCache[cacheKey] = Promise.resolve(data);
                        return data;
                    });
                }
                if (void 0 !== inflightCache[cacheKey]) {
                    return inflightCache[cacheKey];
                }
                return inflightCache[cacheKey] = getData(isBackground ? {
                    method: "HEAD"
                } : {});
            }
            function createKey() {
                return Math.random().toString(36).slice(2, 10);
            }
            function handleHardNavigation(param) {
                let { url , router  } = param;
                if (url === _addBasePath.addBasePath(_addLocale.addLocale(router.asPath, router.locale))) {
                    throw Error("Invariant: attempted to hard navigate to the same URL ".concat(url, " ").concat(location.href));
                }
                window.location.href = url;
            }
            const getCancelledHandler = (param)=>{
                let { route , router  } = param;
                let cancelled = false;
                const cancel = router.clc = ()=>{
                    cancelled = true;
                };
                const handleCancelled = ()=>{
                    if (cancelled) {
                        const error = Error('Abort fetching component for route: "'.concat(route, '"'));
                        error.cancelled = true;
                        throw error;
                    }
                    if (cancel === router.clc) router.clc = null;
                };
                return handleCancelled;
            };
            class Router {
                reload() {
                    window.location.reload();
                }
                back() {
                    window.history.back();
                }
                forward() {
                    window.history.forward();
                }
                push(url, as) {
                    let options = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
                    if (false) ;
                    ({ url , as  } = prepareUrlAs(this, url, as));
                    return this.change("pushState", url, as, options);
                }
                replace(url, as) {
                    let options = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
                    ({ url , as  } = prepareUrlAs(this, url, as));
                    return this.change("replaceState", url, as, options);
                }
                change(method, url, as, options, forcedScroll) {
                    var _this = this;
                    return _async_to_generator(function*() {
                        if (!isLocalURL(url)) {
                            handleHardNavigation({
                                url,
                                router: _this
                            });
                            return false;
                        }
                        const isQueryUpdating = options._h;
                        let shouldResolveHref = isQueryUpdating || options._shouldResolveHref || _parsePath.parsePath(url).pathname === _parsePath.parsePath(as).pathname;
                        const nextState = _extends({}, _this.state);
                        const readyStateChange = true !== _this.isReady;
                        _this.isReady = true;
                        const isSsr = _this.isSsr;
                        if (!isQueryUpdating) _this.isSsr = false;
                        if (isQueryUpdating && _this.clc) {
                            return false;
                        }
                        const prevLocale = nextState.locale;
                        if (false) var ref;
                        if (_utils.ST) performance.mark("routeChange");
                        const { shallow =false , scroll =true  } = options;
                        const routeProps = {
                            shallow
                        };
                        if (_this._inFlightRoute && _this.clc) {
                            if (!isSsr) Router.events.emit("routeChangeError", buildCancellationError(), _this._inFlightRoute, routeProps);
                            _this.clc();
                            _this.clc = null;
                        }
                        as = _addBasePath.addBasePath(_addLocale.addLocale(_hasBasePath.hasBasePath(as) ? _removeBasePath.removeBasePath(as) : as, options.locale, _this.defaultLocale));
                        const cleanedAs = _removeLocale.removeLocale(_hasBasePath.hasBasePath(as) ? _removeBasePath.removeBasePath(as) : as, nextState.locale);
                        _this._inFlightRoute = as;
                        const localeChange = prevLocale !== nextState.locale;
                        if (!isQueryUpdating && _this.onlyAHashChange(cleanedAs) && !localeChange) {
                            nextState.asPath = cleanedAs;
                            Router.events.emit("hashChangeStart", as, routeProps);
                            _this.changeState(method, url, as, _extends({}, options, {
                                scroll: false
                            }));
                            if (scroll) _this.scrollToHash(cleanedAs);
                            try {
                                yield _this.set(nextState, _this.components[nextState.route], null);
                            } catch (err) {
                                if (_isError.default(err) && err.cancelled) Router.events.emit("routeChangeError", err, cleanedAs, routeProps);
                                throw err;
                            }
                            Router.events.emit("hashChangeComplete", as, routeProps);
                            return true;
                        }
                        let parsed = _parseRelativeUrl.parseRelativeUrl(url);
                        let { pathname , query  } = parsed;
                        let pages, rewrites;
                        try {
                            [pages, { __rewrites: rewrites  }] = yield Promise.all([
                                _this.pageLoader.getPageList(),
                                _routeLoader.getClientBuildManifest(),
                                _this.pageLoader.getMiddleware()
                            ]);
                        } catch (err1) {
                            handleHardNavigation({
                                url: as,
                                router: _this
                            });
                            return false;
                        }
                        if (!_this.urlIsNew(cleanedAs) && !localeChange) method = "replaceState";
                        let resolvedAs = as;
                        pathname = pathname ? _removeTrailingSlash.removeTrailingSlash(_removeBasePath.removeBasePath(pathname)) : pathname;
                        const isMiddlewareMatch = yield matchesMiddleware({
                            asPath: as,
                            locale: nextState.locale,
                            router: _this
                        });
                        if (options.shallow && isMiddlewareMatch) pathname = _this.pathname;
                        if (isQueryUpdating && isMiddlewareMatch) shouldResolveHref = false;
                        if (shouldResolveHref && "/_error" !== pathname) {
                            options._shouldResolveHref = true;
                            if (false) ;
                            else {
                                parsed.pathname = resolveDynamicRoute(pathname, pages);
                                if (parsed.pathname !== pathname) {
                                    pathname = parsed.pathname;
                                    parsed.pathname = _addBasePath.addBasePath(pathname);
                                    if (!isMiddlewareMatch) url = _formatUrl.formatWithValidation(parsed);
                                }
                            }
                        }
                        if (!isLocalURL(as)) {
                            if (false) ;
                            handleHardNavigation({
                                url: as,
                                router: _this
                            });
                            return false;
                        }
                        resolvedAs = _removeLocale.removeLocale(_removeBasePath.removeBasePath(resolvedAs), nextState.locale);
                        let route = _removeTrailingSlash.removeTrailingSlash(pathname);
                        let routeMatch = false;
                        if (_isDynamic.isDynamicRoute(route)) {
                            const parsedAs1 = _parseRelativeUrl.parseRelativeUrl(resolvedAs);
                            const asPathname = parsedAs1.pathname;
                            const routeRegex = _routeRegex.getRouteRegex(route);
                            routeMatch = _routeMatcher.getRouteMatcher(routeRegex)(asPathname);
                            const shouldInterpolate = route === asPathname;
                            const interpolatedAs = shouldInterpolate ? interpolateAs(route, asPathname, query) : {};
                            if (routeMatch && (!shouldInterpolate || interpolatedAs.result)) if (shouldInterpolate) as = _formatUrl.formatWithValidation(Object.assign({}, parsedAs1, {
                                pathname: interpolatedAs.result,
                                query: omit(query, interpolatedAs.params)
                            }));
                            else Object.assign(query, routeMatch);
                            else {
                                const missingParams = Object.keys(routeRegex.groups).filter((param)=>!query[param] && !routeRegex.groups[param].optional);
                                if (missingParams.length > 0 && !isMiddlewareMatch) {
                                    if (false) ;
                                    throw Error((shouldInterpolate ? "The provided `href` (".concat(url, ") value is missing query values (").concat(missingParams.join(", "), ") to be interpolated properly. ") : "The provided `as` value (".concat(asPathname, ") is incompatible with the `href` value (").concat(route, "). ")) + "Read more: https://nextjs.org/docs/messages/".concat(shouldInterpolate ? "href-interpolation-failed" : "incompatible-href-as"));
                                }
                            }
                        }
                        if (!isQueryUpdating) Router.events.emit("routeChangeStart", as, routeProps);
                        try {
                            var ref2, ref3;
                            let routeInfo = yield _this.getRouteInfo({
                                route,
                                pathname,
                                query,
                                as,
                                resolvedAs,
                                routeProps,
                                locale: nextState.locale,
                                isPreview: nextState.isPreview,
                                hasMiddleware: isMiddlewareMatch,
                                unstable_skipClientCache: options.unstable_skipClientCache,
                                isQueryUpdating: isQueryUpdating && !_this.isFallback
                            });
                            if ("route" in routeInfo && isMiddlewareMatch) {
                                pathname = routeInfo.route || route;
                                route = pathname;
                                if (!routeProps.shallow) query = Object.assign({}, routeInfo.query || {}, query);
                                const cleanedParsedPathname = _hasBasePath.hasBasePath(parsed.pathname) ? _removeBasePath.removeBasePath(parsed.pathname) : parsed.pathname;
                                if (routeMatch && pathname !== cleanedParsedPathname) Object.keys(routeMatch).forEach((key)=>{
                                    if (routeMatch && query[key] === routeMatch[key]) delete query[key];
                                });
                                if (_isDynamic.isDynamicRoute(pathname)) {
                                    const prefixedAs = !routeProps.shallow && routeInfo.resolvedAs ? routeInfo.resolvedAs : _addBasePath.addBasePath(_addLocale.addLocale(new URL(as, location.href).pathname, nextState.locale), true);
                                    let rewriteAs = prefixedAs;
                                    if (_hasBasePath.hasBasePath(rewriteAs)) rewriteAs = _removeBasePath.removeBasePath(rewriteAs);
                                    if (false) ;
                                    const routeRegex1 = _routeRegex.getRouteRegex(pathname);
                                    const curRouteMatch = _routeMatcher.getRouteMatcher(routeRegex1)(new URL(rewriteAs, location.href).pathname);
                                    if (curRouteMatch) Object.assign(query, curRouteMatch);
                                }
                            }
                            if ("type" in routeInfo) {
                                if ("redirect-internal" === routeInfo.type) {
                                    return _this.change(method, routeInfo.newUrl, routeInfo.newAs, options);
                                }
                                handleHardNavigation({
                                    url: routeInfo.destination,
                                    router: _this
                                });
                                return new Promise(()=>{});
                            }
                            let { error , props , __N_SSG , __N_SSP  } = routeInfo;
                            const component = routeInfo.Component;
                            if (component && component.unstable_scriptLoader) {
                                const scripts = [].concat(component.unstable_scriptLoader());
                                scripts.forEach((script)=>{
                                    _script.handleClientScriptLoad(script.props);
                                });
                            }
                            if ((__N_SSG || __N_SSP) && props) {
                                if (props.pageProps && props.pageProps.__N_REDIRECT) {
                                    options.locale = false;
                                    const destination = props.pageProps.__N_REDIRECT;
                                    if (destination.startsWith("/") && false !== props.pageProps.__N_REDIRECT_BASE_PATH) {
                                        const parsedHref = _parseRelativeUrl.parseRelativeUrl(destination);
                                        parsedHref.pathname = resolveDynamicRoute(parsedHref.pathname, pages);
                                        const { url: newUrl , as: newAs  } = prepareUrlAs(_this, destination, destination);
                                        return _this.change(method, newUrl, newAs, options);
                                    }
                                    handleHardNavigation({
                                        url: destination,
                                        router: _this
                                    });
                                    return new Promise(()=>{});
                                }
                                nextState.isPreview = !!props.__N_PREVIEW;
                                if (props.notFound === SSG_DATA_NOT_FOUND) {
                                    let notFoundRoute;
                                    try {
                                        yield _this.fetchComponent("/404");
                                        notFoundRoute = "/404";
                                    } catch (_) {
                                        notFoundRoute = "/_error";
                                    }
                                    routeInfo = yield _this.getRouteInfo({
                                        route: notFoundRoute,
                                        pathname: notFoundRoute,
                                        query,
                                        as,
                                        resolvedAs,
                                        routeProps: {
                                            shallow: false
                                        },
                                        locale: nextState.locale,
                                        isPreview: nextState.isPreview
                                    });
                                    if ("type" in routeInfo) {
                                        throw Error("Unexpected middleware effect on /404");
                                    }
                                }
                            }
                            Router.events.emit("beforeHistoryChange", as, routeProps);
                            _this.changeState(method, url, as, options);
                            if (isQueryUpdating && "/_error" === pathname && (null == (ref2 = self.__NEXT_DATA__.props) ? void 0 : null == (ref3 = ref2.pageProps) ? void 0 : ref3.statusCode) === 500 && (null == props ? void 0 : props.pageProps)) props.pageProps.statusCode = 500;
                            var _route;
                            const isValidShallowRoute = options.shallow && nextState.route === (null != (_route = routeInfo.route) ? _route : route);
                            var _scroll;
                            const shouldScroll = null != (_scroll = options.scroll) ? _scroll : !options._h && !isValidShallowRoute;
                            const upcomingRouterState = _extends({}, nextState, {
                                route,
                                pathname,
                                query,
                                asPath: cleanedAs,
                                isFallback: false
                            });
                            const upcomingScrollState = null != forcedScroll ? forcedScroll : shouldScroll ? {
                                x: 0,
                                y: 0
                            } : null;
                            const canSkipUpdating = options._h && !upcomingScrollState && !readyStateChange && !localeChange && _compareStates.compareRouterStates(upcomingRouterState, _this.state);
                            if (!canSkipUpdating) {
                                yield _this.set(upcomingRouterState, routeInfo, upcomingScrollState).catch((e)=>{
                                    if (e.cancelled) error = error || e;
                                    else throw e;
                                });
                                if (error) {
                                    if (!isQueryUpdating) Router.events.emit("routeChangeError", error, cleanedAs, routeProps);
                                    throw error;
                                }
                                if (false) ;
                                if (!isQueryUpdating) Router.events.emit("routeChangeComplete", as, routeProps);
                                if (shouldScroll && /#.+$/.test(as)) _this.scrollToHash(as);
                            }
                            return true;
                        } catch (err11) {
                            if (_isError.default(err11) && err11.cancelled) {
                                return false;
                            }
                            throw err11;
                        }
                    })();
                }
                changeState(method, url, as) {
                    let options = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {};
                    if (false) ;
                    if ("pushState" !== method || _utils.getURL() !== as) {
                        this._shallow = options.shallow;
                        window.history[method]({
                            url,
                            as,
                            options,
                            __N: true,
                            key: this._key = "pushState" !== method ? this._key : createKey()
                        }, "", as);
                    }
                }
                handleRouteInfoError(err, pathname, query, as, routeProps, loadErrorFail) {
                    var _this = this;
                    return _async_to_generator(function*() {
                        console.error(err);
                        if (err.cancelled) {
                            throw err;
                        }
                        if (_routeLoader.isAssetError(err) || loadErrorFail) {
                            Router.events.emit("routeChangeError", err, as, routeProps);
                            handleHardNavigation({
                                url: as,
                                router: _this
                            });
                            throw buildCancellationError();
                        }
                        try {
                            let props;
                            const { page: Component , styleSheets  } = yield _this.fetchComponent("/_error");
                            const routeInfo = {
                                props,
                                Component,
                                styleSheets,
                                err,
                                error: err
                            };
                            if (!routeInfo.props) {
                                try {
                                    routeInfo.props = yield _this.getInitialProps(Component, {
                                        err,
                                        pathname,
                                        query
                                    });
                                } catch (gipErr) {
                                    console.error("Error in error page `getInitialProps`: ", gipErr);
                                    routeInfo.props = {};
                                }
                            }
                            return routeInfo;
                        } catch (routeInfoErr) {
                            return _this.handleRouteInfoError(_isError.default(routeInfoErr) ? routeInfoErr : Error(routeInfoErr + ""), pathname, query, as, routeProps, true);
                        }
                    })();
                }
                getRouteInfo(param) {
                    let { route: requestedRoute , pathname , query , as , resolvedAs , routeProps , locale , hasMiddleware , isPreview , unstable_skipClientCache , isQueryUpdating  } = param;
                    var _this = this;
                    return _async_to_generator(function*() {
                        let route = requestedRoute;
                        try {
                            var ref, ref4, ref5;
                            const handleCancelled = getCancelledHandler({
                                route,
                                router: _this
                            });
                            let existingInfo = _this.components[route];
                            if (routeProps.shallow && existingInfo && _this.route === route) {
                                return existingInfo;
                            }
                            if (hasMiddleware) existingInfo = void 0;
                            let cachedRouteInfo = !existingInfo || "initial" in existingInfo ? void 0 : existingInfo;
                            const fetchNextDataParams = {
                                dataHref: _this.pageLoader.getDataHref({
                                    href: _formatUrl.formatWithValidation({
                                        pathname,
                                        query
                                    }),
                                    skipInterpolation: true,
                                    asPath: resolvedAs,
                                    locale
                                }),
                                hasMiddleware: true,
                                isServerRender: _this.isSsr,
                                parseJSON: true,
                                inflightCache: _this.sdc,
                                persistCache: !isPreview,
                                isPrefetch: false,
                                unstable_skipClientCache,
                                isBackground: isQueryUpdating
                            };
                            const data = isQueryUpdating ? {} : yield function(options) {
                                return matchesMiddleware(options).then((matches)=>{
                                    if (matches && options.fetchData) {
                                        return options.fetchData().then((data)=>(function(source, response, options) {
                                                const nextConfig = {
                                                    basePath: options.router.basePath,
                                                    i18n: {
                                                        locales: options.router.locales
                                                    },
                                                    trailingSlash: Boolean(false)
                                                };
                                                const rewriteHeader = response.headers.get("x-nextjs-rewrite");
                                                let rewriteTarget = rewriteHeader || response.headers.get("x-nextjs-matched-path");
                                                const matchedPath = response.headers.get("x-matched-path");
                                                if (matchedPath && !rewriteTarget && !matchedPath.includes("__next_data_catchall") && !matchedPath.includes("/_error") && !matchedPath.includes("/404")) rewriteTarget = matchedPath;
                                                if (rewriteTarget) {
                                                    if (rewriteTarget.startsWith("/")) {
                                                        const parsedRewriteTarget = _parseRelativeUrl.parseRelativeUrl(rewriteTarget);
                                                        const pathnameInfo = _getNextPathnameInfo.getNextPathnameInfo(parsedRewriteTarget.pathname, {
                                                            nextConfig,
                                                            parseData: true
                                                        });
                                                        let fsPathname = _removeTrailingSlash.removeTrailingSlash(pathnameInfo.pathname);
                                                        return Promise.all([
                                                            options.router.pageLoader.getPageList(),
                                                            _routeLoader.getClientBuildManifest()
                                                        ]).then((param)=>{
                                                            let [pages, { __rewrites: rewrites  }] = param;
                                                            let as = _addLocale.addLocale(pathnameInfo.pathname, pathnameInfo.locale);
                                                            if (_isDynamic.isDynamicRoute(as) || !rewriteHeader && pages.includes(_normalizeLocalePath.normalizeLocalePath(_removeBasePath.removeBasePath(as), options.router.locales).pathname)) {
                                                                const parsedSource = _getNextPathnameInfo.getNextPathnameInfo(_parseRelativeUrl.parseRelativeUrl(source).pathname, {
                                                                    parseData: true
                                                                });
                                                                as = _addBasePath.addBasePath(parsedSource.pathname);
                                                                parsedRewriteTarget.pathname = as;
                                                            }
                                                            if (false) ;
                                                            else if (!pages.includes(fsPathname)) {
                                                                const resolvedPathname = resolveDynamicRoute(fsPathname, pages);
                                                                if (resolvedPathname !== fsPathname) fsPathname = resolvedPathname;
                                                            }
                                                            const resolvedHref = pages.includes(fsPathname) ? fsPathname : resolveDynamicRoute(_normalizeLocalePath.normalizeLocalePath(_removeBasePath.removeBasePath(parsedRewriteTarget.pathname), options.router.locales).pathname, pages);
                                                            if (_isDynamic.isDynamicRoute(resolvedHref)) {
                                                                const matches = _routeMatcher.getRouteMatcher(_routeRegex.getRouteRegex(resolvedHref))(as);
                                                                Object.assign(parsedRewriteTarget.query, matches || {});
                                                            }
                                                            return {
                                                                type: "rewrite",
                                                                parsedAs: parsedRewriteTarget,
                                                                resolvedHref
                                                            };
                                                        });
                                                    }
                                                    const src = _parsePath.parsePath(source);
                                                    const pathname = _formatNextPathnameInfo.formatNextPathnameInfo(_extends({}, _getNextPathnameInfo.getNextPathnameInfo(src.pathname, {
                                                        nextConfig,
                                                        parseData: true
                                                    }), {
                                                        defaultLocale: options.router.defaultLocale,
                                                        buildId: ""
                                                    }));
                                                    return Promise.resolve({
                                                        type: "redirect-external",
                                                        destination: "".concat(pathname).concat(src.query).concat(src.hash)
                                                    });
                                                }
                                                const redirectTarget = response.headers.get("x-nextjs-redirect");
                                                if (redirectTarget) {
                                                    if (redirectTarget.startsWith("/")) {
                                                        const src1 = _parsePath.parsePath(redirectTarget);
                                                        const pathname1 = _formatNextPathnameInfo.formatNextPathnameInfo(_extends({}, _getNextPathnameInfo.getNextPathnameInfo(src1.pathname, {
                                                            nextConfig,
                                                            parseData: true
                                                        }), {
                                                            defaultLocale: options.router.defaultLocale,
                                                            buildId: ""
                                                        }));
                                                        return Promise.resolve({
                                                            type: "redirect-internal",
                                                            newAs: "".concat(pathname1).concat(src1.query).concat(src1.hash),
                                                            newUrl: "".concat(pathname1).concat(src1.query).concat(src1.hash)
                                                        });
                                                    }
                                                    return Promise.resolve({
                                                        type: "redirect-external",
                                                        destination: redirectTarget
                                                    });
                                                }
                                                return Promise.resolve({
                                                    type: "next"
                                                });
                                            })(data.dataHref, data.response, options).then((effect)=>({
                                                    dataHref: data.dataHref,
                                                    cacheKey: data.cacheKey,
                                                    json: data.json,
                                                    response: data.response,
                                                    text: data.text,
                                                    effect
                                                }))).catch((_err)=>{
                                            return null;
                                        });
                                    }
                                    return null;
                                });
                            }({
                                fetchData: ()=>fetchNextData(fetchNextDataParams),
                                asPath: resolvedAs,
                                locale: locale,
                                router: _this
                            });
                            if (isQueryUpdating && data) data.json = self.__NEXT_DATA__.props;
                            handleCancelled();
                            if ((null == data ? void 0 : null == (ref = data.effect) ? void 0 : ref.type) === "redirect-internal" || (null == data ? void 0 : null == (ref4 = data.effect) ? void 0 : ref4.type) === "redirect-external") {
                                return data.effect;
                            }
                            if ((null == data ? void 0 : null == (ref5 = data.effect) ? void 0 : ref5.type) === "rewrite") {
                                route = _removeTrailingSlash.removeTrailingSlash(data.effect.resolvedHref);
                                pathname = data.effect.resolvedHref;
                                query = _extends({}, query, data.effect.parsedAs.query);
                                resolvedAs = _removeBasePath.removeBasePath(_normalizeLocalePath.normalizeLocalePath(data.effect.parsedAs.pathname, _this.locales).pathname);
                                existingInfo = _this.components[route];
                                if (routeProps.shallow && existingInfo && _this.route === route && !hasMiddleware) {
                                    return _extends({}, existingInfo, {
                                        route
                                    });
                                }
                            }
                            if ("/api" === route || route.startsWith("/api/")) {
                                handleHardNavigation({
                                    url: as,
                                    router: _this
                                });
                                return new Promise(()=>{});
                            }
                            const routeInfo = cachedRouteInfo || (yield _this.fetchComponent(route).then((res)=>({
                                    Component: res.page,
                                    styleSheets: res.styleSheets,
                                    __N_SSG: res.mod.__N_SSG,
                                    __N_SSP: res.mod.__N_SSP
                                })));
                            if (false) ;
                            const shouldFetchData = routeInfo.__N_SSG || routeInfo.__N_SSP;
                            const { props , cacheKey  } = yield _this._getData(_async_to_generator(function*() {
                                if (shouldFetchData) {
                                    const { json , cacheKey: _cacheKey  } = (null == data ? void 0 : data.json) ? data : yield fetchNextData({
                                        dataHref: _this.pageLoader.getDataHref({
                                            href: _formatUrl.formatWithValidation({
                                                pathname,
                                                query
                                            }),
                                            asPath: resolvedAs,
                                            locale
                                        }),
                                        isServerRender: _this.isSsr,
                                        parseJSON: true,
                                        inflightCache: _this.sdc,
                                        persistCache: !isPreview,
                                        isPrefetch: false,
                                        unstable_skipClientCache
                                    });
                                    return {
                                        cacheKey: _cacheKey,
                                        props: json || {}
                                    };
                                }
                                return {
                                    headers: {},
                                    cacheKey: "",
                                    props: yield _this.getInitialProps(routeInfo.Component, {
                                        pathname,
                                        query,
                                        asPath: as,
                                        locale,
                                        locales: _this.locales,
                                        defaultLocale: _this.defaultLocale
                                    })
                                };
                            }));
                            if (routeInfo.__N_SSP && fetchNextDataParams.dataHref) delete _this.sdc[cacheKey];
                            if (!_this.isPreview && routeInfo.__N_SSG && !isQueryUpdating) fetchNextData(Object.assign({}, fetchNextDataParams, {
                                isBackground: true,
                                persistCache: false,
                                inflightCache: backgroundCache
                            })).catch(()=>{});
                            props.pageProps = Object.assign({}, props.pageProps);
                            routeInfo.props = props;
                            routeInfo.route = route;
                            routeInfo.query = query;
                            routeInfo.resolvedAs = resolvedAs;
                            _this.components[route] = routeInfo;
                            return routeInfo;
                        } catch (err) {
                            return _this.handleRouteInfoError(_isError.getProperError(err), pathname, query, as, routeProps);
                        }
                    })();
                }
                set(state, data, resetScroll) {
                    this.state = state;
                    return this.sub(data, this.components["/_app"].Component, resetScroll);
                }
                beforePopState(cb) {
                    this._bps = cb;
                }
                onlyAHashChange(as) {
                    if (!this.asPath) return false;
                    const [oldUrlNoHash, oldHash] = this.asPath.split("#");
                    const [newUrlNoHash, newHash] = as.split("#");
                    if (newHash && oldUrlNoHash === newUrlNoHash && oldHash === newHash) {
                        return true;
                    }
                    if (oldUrlNoHash !== newUrlNoHash) {
                        return false;
                    }
                    return oldHash !== newHash;
                }
                scrollToHash(as) {
                    const [, hash = ""] = as.split("#");
                    if ("" === hash || "top" === hash) {
                        handleSmoothScroll(()=>window.scrollTo(0, 0));
                        return;
                    }
                    const rawHash = decodeURIComponent(hash);
                    const idEl = document.getElementById(rawHash);
                    if (idEl) {
                        handleSmoothScroll(()=>idEl.scrollIntoView());
                        return;
                    }
                    const nameEl = document.getElementsByName(rawHash)[0];
                    if (nameEl) handleSmoothScroll(()=>nameEl.scrollIntoView());
                }
                urlIsNew(asPath) {
                    return this.asPath !== asPath;
                }
                prefetch(url) {
                    let asPath = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : url, options = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
                    var _this = this;
                    return _async_to_generator(function*() {
                        if (_isBot.isBot(window.navigator.userAgent)) {
                            return;
                        }
                        let parsed = _parseRelativeUrl.parseRelativeUrl(url);
                        let { pathname , query  } = parsed;
                        if (false) ;
                        const pages = yield _this.pageLoader.getPageList();
                        const locale = void 0 !== options.locale ? options.locale || void 0 : _this.locale;
                        if (false) ;
                        parsed.pathname = resolveDynamicRoute(parsed.pathname, pages);
                        if (_isDynamic.isDynamicRoute(parsed.pathname)) {
                            pathname = parsed.pathname;
                            parsed.pathname = pathname;
                            Object.assign(query, _routeMatcher.getRouteMatcher(_routeRegex.getRouteRegex(parsed.pathname))(_parsePath.parsePath(asPath).pathname) || {});
                            url = _formatUrl.formatWithValidation(parsed);
                        }
                        if (false) ;
                        const route = _removeTrailingSlash.removeTrailingSlash(pathname);
                        yield Promise.all([
                            _this.pageLoader._isSsg(route).then((isSsg)=>{
                                return !!isSsg && fetchNextData({
                                    dataHref: _this.pageLoader.getDataHref({
                                        href: url,
                                        asPath: asPath,
                                        locale: locale
                                    }),
                                    isServerRender: false,
                                    parseJSON: true,
                                    inflightCache: _this.sdc,
                                    persistCache: !_this.isPreview,
                                    isPrefetch: true,
                                    unstable_skipClientCache: options.unstable_skipClientCache || options.priority && true
                                }).then(()=>false);
                            }),
                            _this.pageLoader[options.priority ? "loadPage" : "prefetch"](route)
                        ]);
                    })();
                }
                fetchComponent(route) {
                    var _this = this;
                    return _async_to_generator(function*() {
                        const handleCancelled = getCancelledHandler({
                            route,
                            router: _this
                        });
                        try {
                            const componentResult = yield _this.pageLoader.loadPage(route);
                            handleCancelled();
                            return componentResult;
                        } catch (err) {
                            handleCancelled();
                            throw err;
                        }
                    })();
                }
                _getData(fn) {
                    let cancelled = false;
                    const cancel = ()=>{
                        cancelled = true;
                    };
                    this.clc = cancel;
                    return fn().then((data)=>{
                        if (cancel === this.clc) this.clc = null;
                        if (cancelled) {
                            const err = Error("Loading initial props cancelled");
                            err.cancelled = true;
                            throw err;
                        }
                        return data;
                    });
                }
                _getFlightData(dataHref) {
                    return fetchNextData({
                        dataHref,
                        isServerRender: true,
                        parseJSON: false,
                        inflightCache: this.sdc,
                        persistCache: false,
                        isPrefetch: false
                    }).then((param)=>{
                        let { text  } = param;
                        return {
                            data: text
                        };
                    });
                }
                getInitialProps(Component, ctx) {
                    const { Component: App  } = this.components["/_app"];
                    const AppTree = this._wrapApp(App);
                    ctx.AppTree = AppTree;
                    return _utils.loadGetInitialProps(App, {
                        AppTree,
                        Component,
                        router: this,
                        ctx
                    });
                }
                get route() {
                    return this.state.route;
                }
                get pathname() {
                    return this.state.pathname;
                }
                get query() {
                    return this.state.query;
                }
                get asPath() {
                    return this.state.asPath;
                }
                get locale() {
                    return this.state.locale;
                }
                get isFallback() {
                    return this.state.isFallback;
                }
                get isPreview() {
                    return this.state.isPreview;
                }
                constructor(pathname1, query1, as1, { initialProps , pageLoader , App , wrapApp , Component , err , subscription , isFallback , locale , locales , defaultLocale , domainLocales , isPreview  }){
                    this.sdc = {};
                    this.isFirstPopStateEvent = true;
                    this._key = createKey();
                    this.onPopState = (e)=>{
                        const { isFirstPopStateEvent  } = this;
                        this.isFirstPopStateEvent = false;
                        const state = e.state;
                        if (!state) {
                            const { pathname , query  } = this;
                            this.changeState("replaceState", _formatUrl.formatWithValidation({
                                pathname: _addBasePath.addBasePath(pathname),
                                query
                            }), _utils.getURL());
                            return;
                        }
                        if (state.__NA) {
                            window.location.reload();
                            return;
                        }
                        if (!state.__N) {
                            return;
                        }
                        if (isFirstPopStateEvent && this.locale === state.options.locale && state.as === this.asPath) {
                            return;
                        }
                        let forcedScroll;
                        const { url , as , options , key  } = state;
                        if (false) ;
                        this._key = key;
                        const { pathname: pathname1  } = _parseRelativeUrl.parseRelativeUrl(url);
                        if (this.isSsr && as === _addBasePath.addBasePath(this.asPath) && pathname1 === _addBasePath.addBasePath(this.pathname)) {
                            return;
                        }
                        if (this._bps && !this._bps(state)) {
                            return;
                        }
                        this.change("replaceState", url, as, Object.assign({}, options, {
                            shallow: options.shallow && this._shallow,
                            locale: options.locale || this.defaultLocale,
                            _h: 0
                        }), forcedScroll);
                    };
                    const route = _removeTrailingSlash.removeTrailingSlash(pathname1);
                    this.components = {};
                    if ("/_error" !== pathname1) this.components[route] = {
                        Component,
                        initial: true,
                        props: initialProps,
                        err,
                        __N_SSG: initialProps && initialProps.__N_SSG,
                        __N_SSP: initialProps && initialProps.__N_SSP
                    };
                    this.components["/_app"] = {
                        Component: App,
                        styleSheets: []
                    };
                    this.events = Router.events;
                    this.pageLoader = pageLoader;
                    const autoExportDynamic = _isDynamic.isDynamicRoute(pathname1) && self.__NEXT_DATA__.autoExport;
                    this.basePath = "";
                    this.sub = subscription;
                    this.clc = null;
                    this._wrapApp = wrapApp;
                    this.isSsr = true;
                    this.isLocaleDomain = false;
                    this.isReady = !!(self.__NEXT_DATA__.gssp || self.__NEXT_DATA__.gip || self.__NEXT_DATA__.appGip && !self.__NEXT_DATA__.gsp || !autoExportDynamic && !self.location.search);
                    if (false) ;
                    this.state = {
                        route,
                        pathname: pathname1,
                        query: query1,
                        asPath: autoExportDynamic ? pathname1 : as1,
                        isPreview: !!isPreview,
                        locale: void 0,
                        isFallback
                    };
                    this._initialMatchesMiddlewarePromise = Promise.resolve(false);
                    if (true) {
                        if (!as1.startsWith("//")) {
                            const options = {
                                locale
                            };
                            const asPath = _utils.getURL();
                            this._initialMatchesMiddlewarePromise = matchesMiddleware({
                                router: this,
                                locale,
                                asPath
                            }).then((matches)=>{
                                options._shouldResolveHref = as1 !== pathname1;
                                this.changeState("replaceState", matches ? asPath : _formatUrl.formatWithValidation({
                                    pathname: _addBasePath.addBasePath(pathname1),
                                    query: query1
                                }), asPath, options);
                                return matches;
                            });
                        }
                        window.addEventListener("popstate", this.onPopState);
                        if (false) ;
                    }
                }
            }
            Router.events = _mitt.default();
            exports["default"] = Router;
        },
        4441: function(__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.addLocale = function(path, locale, defaultLocale, ignorePrefix) {
                if (locale && locale !== defaultLocale && (ignorePrefix || !_pathHasPrefix.pathHasPrefix(path.toLowerCase(), "/".concat(locale.toLowerCase())) && !_pathHasPrefix.pathHasPrefix(path.toLowerCase(), "/api"))) {
                    return _addPathPrefix.addPathPrefix(path, "/".concat(locale));
                }
                return path;
            };
            var _addPathPrefix = __webpack_require__(4135);
            var _pathHasPrefix = __webpack_require__(3210);
        },
        4135: function(__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.addPathPrefix = function(path, prefix) {
                if (!path.startsWith("/") || !prefix) {
                    return path;
                }
                const { pathname , query , hash  } = _parsePath.parsePath(path);
                return "".concat(prefix).concat(pathname).concat(query).concat(hash);
            };
            var _parsePath = __webpack_require__(6727);
        },
        6074: function(__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.addPathSuffix = function(path, suffix) {
                if (!path.startsWith("/") || !suffix) {
                    return path;
                }
                const { pathname , query , hash  } = _parsePath.parsePath(path);
                return "".concat(pathname).concat(suffix).concat(query).concat(hash);
            };
            var _parsePath = __webpack_require__(6727);
        },
        9002: function(__unused_webpack_module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.compareRouterStates = function(a, b) {
                const stateKeys = Object.keys(a);
                if (stateKeys.length !== Object.keys(b).length) return false;
                for(let i = stateKeys.length; i--;){
                    const key = stateKeys[i];
                    if ("query" === key) {
                        const queryKeys = Object.keys(a.query);
                        if (queryKeys.length !== Object.keys(b.query).length) {
                            return false;
                        }
                        for(let j = queryKeys.length; j--;){
                            const queryKey = queryKeys[j];
                            if (!b.query.hasOwnProperty(queryKey) || a.query[queryKey] !== b.query[queryKey]) {
                                return false;
                            }
                        }
                    } else if (!b.hasOwnProperty(key) || a[key] !== b[key]) {
                        return false;
                    }
                }
                return true;
            };
        },
        7429: function(__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.formatNextPathnameInfo = function(info) {
                let pathname = _addLocale.addLocale(info.pathname, info.locale, info.buildId ? void 0 : info.defaultLocale, info.ignorePrefix);
                if (info.buildId || !info.trailingSlash) pathname = _removeTrailingSlash.removeTrailingSlash(pathname);
                if (info.buildId) pathname = _addPathSuffix.addPathSuffix(_addPathPrefix.addPathPrefix(pathname, "/_next/data/".concat(info.buildId)), "/" === info.pathname ? "index.json" : ".json");
                pathname = _addPathPrefix.addPathPrefix(pathname, info.basePath);
                return !info.buildId && info.trailingSlash ? pathname.endsWith("/") ? pathname : _addPathSuffix.addPathSuffix(pathname, "/") : _removeTrailingSlash.removeTrailingSlash(pathname);
            };
            var _removeTrailingSlash = __webpack_require__(12);
            var _addPathPrefix = __webpack_require__(4135);
            var _addPathSuffix = __webpack_require__(6074);
            var _addLocale = __webpack_require__(4441);
        },
        7795: function(__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.formatUrl = formatUrl;
            exports.formatWithValidation = function(url) {
                if (false) ;
                return formatUrl(url);
            };
            exports.urlObjectKeys = void 0;
            var _interop_require_wildcard = __webpack_require__(1598).Z;
            var querystring = _interop_require_wildcard(__webpack_require__(4919));
            const slashedProtocols = /https?|ftp|gopher|file/;
            function formatUrl(urlObj) {
                let { auth , hostname  } = urlObj;
                let protocol = urlObj.protocol || "";
                let pathname = urlObj.pathname || "";
                let hash = urlObj.hash || "";
                let query = urlObj.query || "";
                let host = false;
                auth = auth ? encodeURIComponent(auth).replace(/%3A/i, ":") + "@" : "";
                if (urlObj.host) host = auth + urlObj.host;
                else if (hostname) {
                    host = auth + (~hostname.indexOf(":") ? "[".concat(hostname, "]") : hostname);
                    if (urlObj.port) host += ":" + urlObj.port;
                }
                if (query && "object" == typeof query) query = String(querystring.urlQueryToSearchParams(query));
                let search = urlObj.search || query && "?".concat(query) || "";
                if (protocol && !protocol.endsWith(":")) protocol += ":";
                if (urlObj.slashes || (!protocol || slashedProtocols.test(protocol)) && false !== host) {
                    host = "//" + (host || "");
                    if (pathname && "/" !== pathname[0]) pathname = "/" + pathname;
                } else if (!host) host = "";
                if (hash && "#" !== hash[0]) hash = "#" + hash;
                if (search && "?" !== search[0]) search = "?" + search;
                pathname = pathname.replace(/[?#]/g, encodeURIComponent);
                search = search.replace("#", "%23");
                return "".concat(protocol).concat(host).concat(pathname).concat(search).concat(hash);
            }
            exports.urlObjectKeys = [
                "auth",
                "hash",
                "host",
                "hostname",
                "href",
                "path",
                "pathname",
                "port",
                "protocol",
                "query",
                "search",
                "slashes"
            ];
        },
        7929: function(__unused_webpack_module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports["default"] = function(route) {
                let ext = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "";
                const path = "/" === route ? "/index" : /^\/index(\/|$)/.test(route) ? "/index".concat(route) : "".concat(route);
                return path + ext;
            };
        },
        8756: function(__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.getNextPathnameInfo = function(pathname, options) {
                var _nextConfig;
                const { basePath , i18n , trailingSlash  } = null != (_nextConfig = options.nextConfig) ? _nextConfig : {};
                const info = {
                    pathname: pathname,
                    trailingSlash: "/" !== pathname ? pathname.endsWith("/") : trailingSlash
                };
                if (basePath && _pathHasPrefix.pathHasPrefix(info.pathname, basePath)) {
                    info.pathname = _removePathPrefix.removePathPrefix(info.pathname, basePath);
                    info.basePath = basePath;
                }
                if (true === options.parseData && info.pathname.startsWith("/_next/data/") && info.pathname.endsWith(".json")) {
                    const paths = info.pathname.replace(/^\/_next\/data\//, "").replace(/\.json$/, "").split("/");
                    const buildId = paths[0];
                    info.pathname = "index" !== paths[1] ? "/".concat(paths.slice(1).join("/")) : "/";
                    info.buildId = buildId;
                }
                if (i18n) {
                    const pathLocale = _normalizeLocalePath.normalizeLocalePath(info.pathname, i18n.locales);
                    info.locale = null == pathLocale ? void 0 : pathLocale.detectedLocale;
                    info.pathname = (null == pathLocale ? void 0 : pathLocale.pathname) || info.pathname;
                }
                return info;
            };
            var _normalizeLocalePath = __webpack_require__(4769);
            var _removePathPrefix = __webpack_require__(2650);
            var _pathHasPrefix = __webpack_require__(3210);
        },
        8588: function(__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            Object.defineProperty(exports, "getSortedRoutes", {
                enumerable: true,
                get: function() {
                    return _sortedRoutes.getSortedRoutes;
                }
            });
            Object.defineProperty(exports, "isDynamicRoute", {
                enumerable: true,
                get: function() {
                    return _isDynamic.isDynamicRoute;
                }
            });
            var _sortedRoutes = __webpack_require__(566);
            var _isDynamic = __webpack_require__(6238);
        },
        1754: function(__unused_webpack_module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.isBot = function(userAgent) {
                return /Googlebot|Mediapartners-Google|AdsBot-Google|googleweblight|Storebot-Google|Google-PageRenderer|Bingbot|BingPreview|Slurp|DuckDuckBot|baiduspider|yandex|sogou|LinkedInBot|bitlybot|tumblr|vkShare|quora link preview|facebookexternalhit|facebookcatalog|Twitterbot|applebot|redditbot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|ia_archiver/i.test(userAgent);
            };
        },
        6238: function(__unused_webpack_module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.isDynamicRoute = function(route) {
                return TEST_ROUTE.test(route);
            };
            const TEST_ROUTE = /\/\[[^/]+?\](?=\/|$)/;
        },
        6727: function(__unused_webpack_module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.parsePath = function(path) {
                const hashIndex = path.indexOf("#");
                const queryIndex = path.indexOf("?");
                const hasQuery = queryIndex > -1 && (hashIndex < 0 || queryIndex < hashIndex);
                if (hasQuery || hashIndex > -1) {
                    return {
                        pathname: path.substring(0, hasQuery ? queryIndex : hashIndex),
                        query: hasQuery ? path.substring(queryIndex, hashIndex > -1 ? hashIndex : void 0) : "",
                        hash: hashIndex > -1 ? path.slice(hashIndex) : ""
                    };
                }
                return {
                    pathname: path,
                    query: "",
                    hash: ""
                };
            };
        },
        2864: function(__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.parseRelativeUrl = function(url, base) {
                const globalBase = new URL(_utils.getLocationOrigin());
                const resolvedBase = base ? new URL(base, globalBase) : url.startsWith(".") ? new URL(window.location.href) : globalBase;
                const { pathname , searchParams , search , hash , href , origin  } = new URL(url, resolvedBase);
                if (origin !== globalBase.origin) {
                    throw Error("invariant: invalid relative URL, router received ".concat(url));
                }
                return {
                    pathname,
                    query: _querystring.searchParamsToUrlQuery(searchParams),
                    search,
                    hash,
                    href: href.slice(globalBase.origin.length)
                };
            };
            var _utils = __webpack_require__(670);
            var _querystring = __webpack_require__(4919);
        },
        3210: function(__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.pathHasPrefix = function(path, prefix) {
                if ("string" != typeof path) {
                    return false;
                }
                const { pathname  } = _parsePath.parsePath(path);
                return pathname === prefix || pathname.startsWith(prefix + "/");
            };
            var _parsePath = __webpack_require__(6727);
        },
        4919: function(__unused_webpack_module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.searchParamsToUrlQuery = function(searchParams) {
                const query = {};
                searchParams.forEach((value, key)=>{
                    if (void 0 === query[key]) query[key] = value;
                    else if (Array.isArray(query[key])) query[key].push(value);
                    else query[key] = [
                        query[key],
                        value
                    ];
                });
                return query;
            };
            exports.urlQueryToSearchParams = function(urlQuery) {
                const result = new URLSearchParams();
                Object.entries(urlQuery).forEach((param)=>{
                    let [key, value] = param;
                    if (Array.isArray(value)) value.forEach((item)=>result.append(key, stringifyUrlQueryParam(item)));
                    else result.set(key, stringifyUrlQueryParam(value));
                });
                return result;
            };
            exports.assign = function(target) {
                for(var _len = arguments.length, searchParamsList = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++)searchParamsList[_key - 1] = arguments[_key];
                searchParamsList.forEach((searchParams)=>{
                    Array.from(searchParams.keys()).forEach((key)=>target.delete(key));
                    searchParams.forEach((value, key)=>target.append(key, value));
                });
                return target;
            };
            function stringifyUrlQueryParam(param) {
                if ("string" != typeof param && ("number" != typeof param || isNaN(param)) && "boolean" != typeof param) {
                    return "";
                }
                return String(param);
            }
        },
        2650: function(__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.removePathPrefix = function(path, prefix) {
                if (_pathHasPrefix.pathHasPrefix(path, prefix)) {
                    const withoutPrefix = path.slice(prefix.length);
                    return withoutPrefix.startsWith("/") ? withoutPrefix : "/".concat(withoutPrefix);
                }
                return path;
            };
            var _pathHasPrefix = __webpack_require__(3210);
        },
        12: function(__unused_webpack_module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.removeTrailingSlash = function(route) {
                return route.replace(/\/$/, "") || "/";
            };
        },
        3156: function(__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.getRouteMatcher = function(param) {
                let { re , groups  } = param;
                return (pathname)=>{
                    const routeMatch = re.exec(pathname);
                    if (!routeMatch) {
                        return false;
                    }
                    const decode = (param)=>{
                        try {
                            return decodeURIComponent(param);
                        } catch (_) {
                            throw new _utils.DecodeError("failed to decode param");
                        }
                    };
                    const params = {};
                    Object.keys(groups).forEach((slugName)=>{
                        const g = groups[slugName];
                        const m = routeMatch[g.pos];
                        if (void 0 !== m) params[slugName] = ~m.indexOf("/") ? m.split("/").map((entry)=>decode(entry)) : g.repeat ? [
                            decode(m)
                        ] : decode(m);
                    });
                    return params;
                };
            };
            var _utils = __webpack_require__(670);
        },
        4903: function(__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.getRouteRegex = getRouteRegex;
            exports.getNamedRouteRegex = function(normalizedRoute) {
                const result = getNamedParametrizedRoute(normalizedRoute);
                return _extends({}, getRouteRegex(normalizedRoute), {
                    namedRegex: "^".concat(result.namedParameterizedRoute, "(?:/)?$"),
                    routeKeys: result.routeKeys
                });
            };
            exports.getNamedMiddlewareRegex = function(normalizedRoute, options) {
                const { parameterizedRoute  } = getParametrizedRoute(normalizedRoute);
                const { catchAll =true  } = options;
                if ("/" === parameterizedRoute) {
                    return {
                        namedRegex: "^/".concat(catchAll ? ".*" : "", "$")
                    };
                }
                const { namedParameterizedRoute  } = getNamedParametrizedRoute(normalizedRoute);
                return {
                    namedRegex: "^".concat(namedParameterizedRoute).concat(catchAll ? "(?:(/.*)?)" : "", "$")
                };
            };
            var _extends = __webpack_require__(6495).Z;
            var _escapeRegexp = __webpack_require__(8659);
            var _removeTrailingSlash = __webpack_require__(12);
            function parseParameter(param) {
                const optional = param.startsWith("[") && param.endsWith("]");
                if (optional) param = param.slice(1, -1);
                const repeat = param.startsWith("...");
                if (repeat) param = param.slice(3);
                return {
                    key: param,
                    repeat,
                    optional
                };
            }
            function getParametrizedRoute(route) {
                const segments = _removeTrailingSlash.removeTrailingSlash(route).slice(1).split("/");
                const groups = {};
                let groupIndex = 1;
                return {
                    parameterizedRoute: segments.map((segment)=>{
                        if (segment.startsWith("[") && segment.endsWith("]")) {
                            const { key , optional , repeat  } = parseParameter(segment.slice(1, -1));
                            groups[key] = {
                                pos: groupIndex++,
                                repeat,
                                optional
                            };
                            return repeat ? optional ? "(?:/(.+?))?" : "/(.+?)" : "/([^/]+?)";
                        }
                        return "/".concat(_escapeRegexp.escapeStringRegexp(segment));
                    }).join(""),
                    groups
                };
            }
            function getRouteRegex(normalizedRoute) {
                const { parameterizedRoute , groups  } = getParametrizedRoute(normalizedRoute);
                return {
                    re: RegExp("^".concat(parameterizedRoute, "(?:/)?$")),
                    groups: groups
                };
            }
            function getNamedParametrizedRoute(route) {
                const segments = _removeTrailingSlash.removeTrailingSlash(route).slice(1).split("/");
                const getSafeRouteKey = function() {
                    let routeKeyCharCode = 97;
                    let routeKeyCharLength = 1;
                    return ()=>{
                        let routeKey = "";
                        for(let i = 0; i < routeKeyCharLength; i++){
                            routeKey += String.fromCharCode(routeKeyCharCode);
                            routeKeyCharCode++;
                            if (routeKeyCharCode > 122) {
                                routeKeyCharLength++;
                                routeKeyCharCode = 97;
                            }
                        }
                        return routeKey;
                    };
                }();
                const routeKeys = {};
                return {
                    namedParameterizedRoute: segments.map((segment)=>{
                        if (segment.startsWith("[") && segment.endsWith("]")) {
                            const { key , optional , repeat  } = parseParameter(segment.slice(1, -1));
                            let cleanedKey = key.replace(/\W/g, "");
                            let invalidKey = false;
                            if (0 === cleanedKey.length || cleanedKey.length > 30) invalidKey = true;
                            if (!isNaN(parseInt(cleanedKey.slice(0, 1)))) invalidKey = true;
                            if (invalidKey) cleanedKey = getSafeRouteKey();
                            routeKeys[cleanedKey] = key;
                            return repeat ? optional ? "(?:/(?<".concat(cleanedKey, ">.+?))?") : "/(?<".concat(cleanedKey, ">.+?)") : "/(?<".concat(cleanedKey, ">[^/]+?)");
                        }
                        return "/".concat(_escapeRegexp.escapeStringRegexp(segment));
                    }).join(""),
                    routeKeys
                };
            }
        },
        566: function(__unused_webpack_module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.getSortedRoutes = function(normalizedPages) {
                const root = new UrlNode();
                normalizedPages.forEach((pagePath)=>root.insert(pagePath));
                return root.smoosh();
            };
            class UrlNode {
                insert(urlPath) {
                    this._insert(urlPath.split("/").filter(Boolean), [], false);
                }
                smoosh() {
                    return this._smoosh();
                }
                _smoosh() {
                    let prefix = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "/";
                    const childrenPaths = [
                        ...this.children.keys()
                    ].sort();
                    if (null !== this.slugName) childrenPaths.splice(childrenPaths.indexOf("[]"), 1);
                    if (null !== this.restSlugName) childrenPaths.splice(childrenPaths.indexOf("[...]"), 1);
                    if (null !== this.optionalRestSlugName) childrenPaths.splice(childrenPaths.indexOf("[[...]]"), 1);
                    const routes = childrenPaths.map((c)=>this.children.get(c)._smoosh("".concat(prefix).concat(c, "/"))).reduce((prev, curr)=>[
                            ...prev,
                            ...curr
                        ], []);
                    if (null !== this.slugName) routes.push(...this.children.get("[]")._smoosh("".concat(prefix, "[").concat(this.slugName, "]/")));
                    if (!this.placeholder) {
                        const r = "/" === prefix ? "/" : prefix.slice(0, -1);
                        if (null != this.optionalRestSlugName) {
                            throw Error('You cannot define a route with the same specificity as a optional catch-all route ("'.concat(r, '" and "').concat(r, "[[...").concat(this.optionalRestSlugName, ']]").'));
                        }
                        routes.unshift(r);
                    }
                    if (null !== this.restSlugName) routes.push(...this.children.get("[...]")._smoosh("".concat(prefix, "[...").concat(this.restSlugName, "]/")));
                    if (null !== this.optionalRestSlugName) routes.push(...this.children.get("[[...]]")._smoosh("".concat(prefix, "[[...").concat(this.optionalRestSlugName, "]]/")));
                    return routes;
                }
                _insert(urlPaths, slugNames, isCatchAll) {
                    if (0 === urlPaths.length) {
                        this.placeholder = false;
                        return;
                    }
                    if (isCatchAll) {
                        throw Error("Catch-all must be the last part of the URL.");
                    }
                    let nextSegment = urlPaths[0];
                    if (nextSegment.startsWith("[") && nextSegment.endsWith("]")) {
                        let segmentName = nextSegment.slice(1, -1);
                        let isOptional = false;
                        if (segmentName.startsWith("[") && segmentName.endsWith("]")) {
                            segmentName = segmentName.slice(1, -1);
                            isOptional = true;
                        }
                        if (segmentName.startsWith("...")) {
                            segmentName = segmentName.substring(3);
                            isCatchAll = true;
                        }
                        if (segmentName.startsWith("[") || segmentName.endsWith("]")) {
                            throw Error("Segment names may not start or end with extra brackets ('".concat(segmentName, "')."));
                        }
                        if (segmentName.startsWith(".")) {
                            throw Error("Segment names may not start with erroneous periods ('".concat(segmentName, "')."));
                        }
                        function handleSlug(previousSlug, nextSlug) {
                            if (null !== previousSlug) {
                                if (previousSlug !== nextSlug) {
                                    throw Error("You cannot use different slug names for the same dynamic path ('".concat(previousSlug, "' !== '").concat(nextSlug, "')."));
                                }
                            }
                            slugNames.forEach((slug)=>{
                                if (slug === nextSlug) {
                                    throw Error('You cannot have the same slug name "'.concat(nextSlug, '" repeat within a single dynamic path'));
                                }
                                if (slug.replace(/\W/g, "") === nextSegment.replace(/\W/g, "")) {
                                    throw Error('You cannot have the slug names "'.concat(slug, '" and "').concat(nextSlug, '" differ only by non-word symbols within a single dynamic path'));
                                }
                            });
                            slugNames.push(nextSlug);
                        }
                        if (isCatchAll) if (isOptional) {
                            if (null != this.restSlugName) {
                                throw Error('You cannot use both an required and optional catch-all route at the same level ("[...'.concat(this.restSlugName, ']" and "').concat(urlPaths[0], '" ).'));
                            }
                            handleSlug(this.optionalRestSlugName, segmentName);
                            this.optionalRestSlugName = segmentName;
                            nextSegment = "[[...]]";
                        } else {
                            if (null != this.optionalRestSlugName) {
                                throw Error('You cannot use both an optional and required catch-all route at the same level ("[[...'.concat(this.optionalRestSlugName, ']]" and "').concat(urlPaths[0], '").'));
                            }
                            handleSlug(this.restSlugName, segmentName);
                            this.restSlugName = segmentName;
                            nextSegment = "[...]";
                        }
                        else {
                            if (isOptional) {
                                throw Error('Optional route parameters are not yet supported ("'.concat(urlPaths[0], '").'));
                            }
                            handleSlug(this.slugName, segmentName);
                            this.slugName = segmentName;
                            nextSegment = "[]";
                        }
                    }
                    if (!this.children.has(nextSegment)) this.children.set(nextSegment, new UrlNode());
                    this.children.get(nextSegment)._insert(urlPaths.slice(1), slugNames, isCatchAll);
                }
                constructor(){
                    this.placeholder = true;
                    this.children = new Map();
                    this.slugName = null;
                    this.restSlugName = null;
                    this.optionalRestSlugName = null;
                }
            }
        },
        6949: function(module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.setConfig = function(configValue) {
                runtimeConfig = configValue;
            };
            exports["default"] = void 0;
            let runtimeConfig;
            var _default = ()=>{
                return runtimeConfig;
            };
            exports["default"] = ()=>{
                return runtimeConfig;
            };
            if (("function" == typeof exports.default || "object" == typeof exports.default && null !== exports.default) && void 0 === exports.default.__esModule) {
                Object.defineProperty(exports.default, "__esModule", {
                    value: true
                });
                Object.assign(exports.default, exports);
                module.exports = exports.default;
            }
        },
        1436: function(__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports["default"] = function(props) {
                const { headManager , reduceComponentsToState  } = props;
                function emitChange() {
                    if (headManager && headManager.mountedInstances) {
                        const headElements = _react.Children.toArray(Array.from(headManager.mountedInstances).filter(Boolean));
                        headManager.updateHead(reduceComponentsToState(headElements, props));
                    }
                }
                if (isServer) {
                    var ref;
                    null == headManager ? void 0 : null == (ref = headManager.mountedInstances) ? void 0 : ref.add(props.children);
                    emitChange();
                }
                useClientOnlyLayoutEffect(()=>{
                    var ref1;
                    null == headManager ? void 0 : null == (ref1 = headManager.mountedInstances) ? void 0 : ref1.add(props.children);
                    return ()=>{
                        var ref;
                        null == headManager ? void 0 : null == (ref = headManager.mountedInstances) ? void 0 : ref.delete(props.children);
                    };
                });
                useClientOnlyLayoutEffect(()=>{
                    if (headManager) headManager._pendingUpdate = emitChange;
                    return ()=>{
                        if (headManager) headManager._pendingUpdate = emitChange;
                    };
                });
                useClientOnlyEffect(()=>{
                    if (headManager && headManager._pendingUpdate) {
                        headManager._pendingUpdate();
                        headManager._pendingUpdate = null;
                    }
                    return ()=>{
                        if (headManager && headManager._pendingUpdate) {
                            headManager._pendingUpdate();
                            headManager._pendingUpdate = null;
                        }
                    };
                });
                return null;
            };
            var _interop_require_wildcard = __webpack_require__(1598).Z;
            var _react = _interop_require_wildcard(__webpack_require__(7294));
            const isServer = false;
            const useClientOnlyLayoutEffect = isServer ? ()=>{} : _react.useLayoutEffect;
            const useClientOnlyEffect = isServer ? ()=>{} : _react.useEffect;
        },
        670: function(__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.execOnce = function(fn) {
                let used = false;
                let result;
                return function() {
                    for(var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
                    if (!used) {
                        used = true;
                        result = fn(...args);
                    }
                    return result;
                };
            };
            exports.getLocationOrigin = getLocationOrigin;
            exports.getURL = function() {
                const { href  } = window.location;
                const origin = getLocationOrigin();
                return href.substring(origin.length);
            };
            exports.getDisplayName = getDisplayName;
            exports.isResSent = isResSent;
            exports.normalizeRepeatedSlashes = function(url) {
                const urlParts = url.split("?");
                const urlNoQuery = urlParts[0];
                return urlNoQuery.replace(/\\/g, "/").replace(/\/\/+/g, "/") + (urlParts[1] ? "?".concat(urlParts.slice(1).join("?")) : "");
            };
            exports.loadGetInitialProps = loadGetInitialProps;
            exports.ST = exports.SP = exports.isAbsoluteUrl = exports.WEB_VITALS = void 0;
            var _async_to_generator = __webpack_require__(932).Z;
            exports.WEB_VITALS = [
                "CLS",
                "FCP",
                "FID",
                "INP",
                "LCP",
                "TTFB"
            ];
            const ABSOLUTE_URL_REGEX = /^[a-zA-Z][a-zA-Z\d+\-.]*?:/;
            const isAbsoluteUrl = (url)=>ABSOLUTE_URL_REGEX.test(url);
            exports.isAbsoluteUrl = isAbsoluteUrl;
            function getLocationOrigin() {
                const { protocol , hostname , port  } = window.location;
                return "".concat(protocol, "//").concat(hostname).concat(port ? ":" + port : "");
            }
            function getDisplayName(Component) {
                return "string" == typeof Component ? Component : Component.displayName || Component.name || "Unknown";
            }
            function isResSent(res) {
                return res.finished || res.headersSent;
            }
            function loadGetInitialProps(App, ctx) {
                return _loadGetInitialProps.apply(this, arguments);
            }
            function _loadGetInitialProps() {
                _loadGetInitialProps = _async_to_generator(function*(App, ctx) {
                    if (false) var ref;
                    const res = ctx.res || ctx.ctx && ctx.ctx.res;
                    if (!App.getInitialProps) {
                        if (ctx.ctx && ctx.Component) {
                            return {
                                pageProps: yield loadGetInitialProps(ctx.Component, ctx.ctx)
                            };
                        }
                        return {};
                    }
                    const props = yield App.getInitialProps(ctx);
                    if (res && isResSent(res)) {
                        return props;
                    }
                    if (!props) {
                        const message1 = '"'.concat(getDisplayName(App), '.getInitialProps()" should resolve to an object. But found "').concat(props, '" instead.');
                        throw Error(message1);
                    }
                    if (false) ;
                    return props;
                });
                return _loadGetInitialProps.apply(this, arguments);
            }
            const SP = "undefined" != typeof performance;
            exports.SP = SP;
            const ST = SP && [
                "mark",
                "measure",
                "getEntriesByName"
            ].every((method)=>"function" == typeof performance[method]);
            exports.ST = ST;
            exports.DecodeError = class DecodeError extends Error {
            };
            exports.NormalizeError = class NormalizeError extends Error {
            };
            exports.PageNotFoundError = class PageNotFoundError extends Error {
                constructor(page){
                    super();
                    this.code = "ENOENT";
                    this.message = "Cannot find module for page: ".concat(page);
                }
            };
            exports.MissingStaticPage = class MissingStaticPage extends Error {
                constructor(page, message){
                    super();
                    this.message = "Failed to load static file for page: ".concat(page, " ").concat(message);
                }
            };
            exports.MiddlewareNotFoundError = class MiddlewareNotFoundError extends Error {
                constructor(){
                    super();
                    this.code = "ENOENT";
                    this.message = "Cannot find the middleware module";
                }
            };
        },
        7238: function(__unused_webpack_module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.warnOnce = void 0;
            let warnOnce = (_)=>{};
            if (false) ;
            exports.warnOnce = warnOnce;
        },
        8018: function(module) {
            (function() {
                "use strict";
                var n = {};
                !function() {
                    n.d = function(y, T) {
                        for(var C in T)if (n.o(T, C) && !n.o(y, C)) Object.defineProperty(y, C, {
                            enumerable: true,
                            get: T[C]
                        });
                    };
                }();
                !function() {
                    n.o = function(n, y) {
                        return Object.prototype.hasOwnProperty.call(n, y);
                    };
                }();
                !function() {
                    n.r = function(n) {
                        if ("undefined" != typeof Symbol && Symbol.toStringTag) Object.defineProperty(n, Symbol.toStringTag, {
                            value: "Module"
                        });
                        Object.defineProperty(n, "__esModule", {
                            value: true
                        });
                    };
                }();
                if (void 0 !== n) n.ab = "//";
                var y = {};
                n.r(y);
                n.d(y, {
                    getCLS: function() {
                        return E;
                    },
                    getFCP: function() {
                        return g;
                    },
                    getFID: function() {
                        return F;
                    },
                    getINP: function() {
                        return O;
                    },
                    getLCP: function() {
                        return _;
                    },
                    getTTFB: function() {
                        return G;
                    },
                    onCLS: function() {
                        return E;
                    },
                    onFCP: function() {
                        return g;
                    },
                    onFID: function() {
                        return F;
                    },
                    onINP: function() {
                        return O;
                    },
                    onLCP: function() {
                        return _;
                    },
                    onTTFB: function() {
                        return G;
                    }
                });
                var T, C, w, P, I, k = -1, o = function(n) {
                    addEventListener("pageshow", function(y) {
                        y.persisted && (k = y.timeStamp, n(y));
                    }, !0);
                }, c = function() {
                    return window.performance && performance.getEntriesByType && performance.getEntriesByType("navigation")[0];
                }, u = function() {
                    var n = c();
                    return n && n.activationStart || 0;
                }, f = function(n, y) {
                    var T = c(), C = "navigate";
                    return k >= 0 ? C = "back-forward-cache" : T && (C = document.prerendering || u() > 0 ? "prerender" : T.type.replace(/_/g, "-")), {
                        name: n,
                        value: void 0 === y ? -1 : y,
                        rating: "good",
                        delta: 0,
                        entries: [],
                        id: "v3-".concat(Date.now(), "-").concat(Math.floor(8999999999999 * Math.random()) + 1e12),
                        navigationType: C
                    };
                }, s = function(n, y, T) {
                    try {
                        if (PerformanceObserver.supportedEntryTypes.includes(n)) {
                            var C = new PerformanceObserver(function(n) {
                                y(n.getEntries());
                            });
                            return C.observe(Object.assign({
                                type: n,
                                buffered: !0
                            }, T || {})), C;
                        }
                    } catch (n1) {}
                }, d = function(n, y) {
                    var T = function t(T) {
                        "pagehide" !== T.type && "hidden" !== document.visibilityState || (n(T), y && (removeEventListener("visibilitychange", t, !0), removeEventListener("pagehide", t, !0)));
                    };
                    addEventListener("visibilitychange", T, !0), addEventListener("pagehide", T, !0);
                }, l = function(n, y, T, C) {
                    var w, P;
                    return function(I) {
                        y.value >= 0 && (I || C) && ((P = y.value - (w || 0)) || void 0 === w) && (w = y.value, y.delta = P, y.rating = function(n, y) {
                            return n > y[1] ? "poor" : n > y[0] ? "needs-improvement" : "good";
                        }(y.value, T), n(y));
                    };
                }, N = -1, v = function() {
                    return "hidden" !== document.visibilityState || document.prerendering ? 1 / 0 : 0;
                }, m = function() {
                    d(function(n) {
                        var y = n.timeStamp;
                        N = y;
                    }, !0);
                }, h = function() {
                    return N < 0 && (N = v(), m(), o(function() {
                        setTimeout(function() {
                            N = v(), m();
                        }, 0);
                    })), {
                        get firstHiddenTime () {
                            return N;
                        }
                    };
                }, g = function(n, y) {
                    y = y || {};
                    var T, C = [
                        1800,
                        3e3
                    ], w = h(), P = f("FCP"), c = function(n) {
                        n.forEach(function(n) {
                            "first-contentful-paint" === n.name && (k && k.disconnect(), n.startTime < w.firstHiddenTime && (P.value = n.startTime - u(), P.entries.push(n), T(!0)));
                        });
                    }, I = window.performance && window.performance.getEntriesByName && window.performance.getEntriesByName("first-contentful-paint")[0], k = I ? null : s("paint", c);
                    (I || k) && (T = l(n, P, C, y.reportAllChanges), I && c([
                        I
                    ]), o(function(w) {
                        P = f("FCP"), T = l(n, P, C, y.reportAllChanges), requestAnimationFrame(function() {
                            requestAnimationFrame(function() {
                                P.value = performance.now() - w.timeStamp, T(!0);
                            });
                        });
                    }));
                }, j = !1, q = -1, E = function(n, y) {
                    y = y || {};
                    var T = [
                        .1,
                        .25
                    ];
                    j || (g(function(n) {
                        q = n.value;
                    }), j = !0);
                    var C, i = function(y) {
                        q > -1 && n(y);
                    }, w = f("CLS", 0), P = 0, I = [], p = function(n) {
                        n.forEach(function(n) {
                            if (!n.hadRecentInput) {
                                var y = I[0], T = I[I.length - 1];
                                P && n.startTime - T.startTime < 1e3 && n.startTime - y.startTime < 5e3 ? (P += n.value, I.push(n)) : (P = n.value, I = [
                                    n
                                ]), P > w.value && (w.value = P, w.entries = I, C());
                            }
                        });
                    }, k = s("layout-shift", p);
                    k && (C = l(i, w, T, y.reportAllChanges), d(function() {
                        p(k.takeRecords()), C(!0);
                    }), o(function() {
                        P = 0, q = -1, w = f("CLS", 0), C = l(i, w, T, y.reportAllChanges);
                    }));
                }, x = {
                    passive: !0,
                    capture: !0
                }, z = new Date, L = function(n, y) {
                    T || (T = y, C = n, w = new Date, A(removeEventListener), S());
                }, S = function() {
                    if (C >= 0 && C < w - z) {
                        var n = {
                            entryType: "first-input",
                            name: T.type,
                            target: T.target,
                            cancelable: T.cancelable,
                            startTime: T.timeStamp,
                            processingStart: T.timeStamp + C
                        };
                        P.forEach(function(y) {
                            y(n);
                        }), P = [];
                    }
                }, b = function(n) {
                    if (n.cancelable) {
                        var y = (n.timeStamp > 1e12 ? new Date : performance.now()) - n.timeStamp;
                        "pointerdown" == n.type ? function(n, y) {
                            var t = function() {
                                L(n, y), i();
                            }, r = function() {
                                i();
                            }, i = function() {
                                removeEventListener("pointerup", t, x), removeEventListener("pointercancel", r, x);
                            };
                            addEventListener("pointerup", t, x), addEventListener("pointercancel", r, x);
                        }(y, n) : L(y, n);
                    }
                }, A = function(n) {
                    [
                        "mousedown",
                        "keydown",
                        "touchstart",
                        "pointerdown"
                    ].forEach(function(y) {
                        return n(y, b, x);
                    });
                }, F = function(n, y) {
                    y = y || {};
                    var w, I = [
                        100,
                        300
                    ], k = h(), N = f("FID"), v = function(n) {
                        n.startTime < k.firstHiddenTime && (N.value = n.processingStart - n.startTime, N.entries.push(n), w(!0));
                    }, m = function(n) {
                        n.forEach(v);
                    }, j = s("first-input", m);
                    w = l(n, N, I, y.reportAllChanges), j && d(function() {
                        m(j.takeRecords()), j.disconnect();
                    }, !0), j && o(function() {
                        var k;
                        N = f("FID"), w = l(n, N, I, y.reportAllChanges), P = [], C = -1, T = null, A(addEventListener), P.push(v), S();
                    });
                }, J = 0, K = 1 / 0, Q = 0, M = function(n) {
                    n.forEach(function(n) {
                        n.interactionId && (K = Math.min(K, n.interactionId), Q = Math.max(Q, n.interactionId), J = Q ? (Q - K) / 7 + 1 : 0);
                    });
                }, B = function() {
                    return I ? J : performance.interactionCount || 0;
                }, D = function() {
                    "interactionCount" in performance || I || (I = s("event", M, {
                        type: "event",
                        buffered: !0,
                        durationThreshold: 0
                    }));
                }, U = 0, R = function() {
                    return B() - U;
                }, V = [], W = {}, H = function(n) {
                    var y = V[V.length - 1], T = W[n.interactionId];
                    if (T || V.length < 10 || n.duration > y.latency) {
                        if (T) T.entries.push(n), T.latency = Math.max(T.latency, n.duration);
                        else {
                            var C = {
                                id: n.interactionId,
                                latency: n.duration,
                                entries: [
                                    n
                                ]
                            };
                            W[C.id] = C, V.push(C);
                        }
                        V.sort(function(n, y) {
                            return y.latency - n.latency;
                        }), V.splice(10).forEach(function(n) {
                            delete W[n.id];
                        });
                    }
                }, O = function(n, y) {
                    y = y || {};
                    var T = [
                        200,
                        500
                    ];
                    D();
                    var C, w = f("INP"), a = function(n) {
                        n.forEach(function(n) {
                            n.interactionId && H(n), "first-input" !== n.entryType || V.some(function(y) {
                                return y.entries.some(function(y) {
                                    return n.duration === y.duration && n.startTime === y.startTime;
                                });
                            }) || H(n);
                        });
                        var y, T = (y = Math.min(V.length - 1, Math.floor(R() / 50)), V[y]);
                        T && T.latency !== w.value && (w.value = T.latency, w.entries = T.entries, C());
                    }, P = s("event", a, {
                        durationThreshold: y.durationThreshold || 40
                    });
                    C = l(n, w, T, y.reportAllChanges), P && (P.observe({
                        type: "first-input",
                        buffered: !0
                    }), d(function() {
                        a(P.takeRecords()), w.value < 0 && R() > 0 && (w.value = 0, w.entries = []), C(!0);
                    }), o(function() {
                        V = [], U = B(), w = f("INP"), C = l(n, w, T, y.reportAllChanges);
                    }));
                }, X = {}, _ = function(n, y) {
                    y = y || {};
                    var T, C = [
                        2500,
                        4e3
                    ], w = h(), P = f("LCP"), c = function(n) {
                        var y = n[n.length - 1];
                        if (y) {
                            var C = y.startTime - u();
                            C < w.firstHiddenTime && (P.value = C, P.entries = [
                                y
                            ], T());
                        }
                    }, I = s("largest-contentful-paint", c);
                    if (I) {
                        T = l(n, P, C, y.reportAllChanges);
                        var v = function() {
                            X[P.id] || (c(I.takeRecords()), I.disconnect(), X[P.id] = !0, T(!0));
                        };
                        [
                            "keydown",
                            "click"
                        ].forEach(function(n) {
                            addEventListener(n, v, {
                                once: !0,
                                capture: !0
                            });
                        }), d(v, !0), o(function(w) {
                            P = f("LCP"), T = l(n, P, C, y.reportAllChanges), requestAnimationFrame(function() {
                                requestAnimationFrame(function() {
                                    P.value = performance.now() - w.timeStamp, X[P.id] = !0, T(!0);
                                });
                            });
                        });
                    }
                }, Y = function e(n) {
                    document.prerendering ? addEventListener("prerenderingchange", function() {
                        return e(n);
                    }, !0) : "complete" !== document.readyState ? addEventListener("load", function() {
                        return e(n);
                    }, !0) : setTimeout(n, 0);
                }, G = function(n, y) {
                    y = y || {};
                    var T = [
                        800,
                        1800
                    ], C = f("TTFB"), w = l(n, C, T, y.reportAllChanges);
                    Y(function() {
                        var P = c();
                        if (P) {
                            if (C.value = Math.max(P.responseStart - u(), 0), C.value < 0 || C.value > performance.now()) return;
                            C.entries = [
                                P
                            ], w(!0), o(function() {
                                C = f("TTFB", 0), (w = l(n, C, T, y.reportAllChanges))(!0);
                            });
                        }
                    });
                };
                module.exports = y;
            })();
        },
        676: function(__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports["default"] = isError;
            exports.getProperError = function(err) {
                if (isError(err)) {
                    return err;
                }
                if (false) ;
                return Error(_isPlainObject.isPlainObject(err) ? JSON.stringify(err) : err + "");
            };
            var _isPlainObject = __webpack_require__(2849);
            function isError(err) {
                return "object" == typeof err && null !== err && "name" in err && "message" in err;
            }
        },
        2431: function() {}
    },
    function(__webpack_require__) {
        __webpack_require__.O(0, [
            774
        ], function() {
            return function(moduleId) {
                return __webpack_require__(__webpack_require__.s = 1783);
            }(1783);
        });
        var __webpack_exports__ = __webpack_require__.O();
        _N_E = __webpack_exports__;
    }
]);
