(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
    [
        179
    ],
    {
        /***/ 932: /***/ function(__unused_webpack_module, exports) {
            "use strict";
            function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
                try {
                    var info = gen[key](arg), value = info.value;
                } catch (error) {
                    reject(error);
                    return;
                }
                info.done ? resolve(value) : Promise.resolve(value).then(_next, _throw);
            }
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
        /***/ },
        /***/ 6495: /***/ function(__unused_webpack_module, exports) {
            "use strict";
            function extends_() {
                return (extends_ = Object.assign || function(target) {
                    for(var i = 1; i < arguments.length; i++){
                        var source = arguments[i];
                        for(var key in source)Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
                    }
                    return target;
                }).apply(this, arguments);
            }
            exports.Z = function() {
                return extends_.apply(this, arguments);
            };
        /***/ },
        /***/ 2648: /***/ function(__unused_webpack_module, exports) {
            "use strict";
            exports.Z = function(obj) {
                return obj && obj.__esModule ? obj : {
                    default: obj
                };
            };
        /***/ },
        /***/ 1598: /***/ function(__unused_webpack_module, exports) {
            "use strict";
            function _getRequireWildcardCache(nodeInterop1) {
                if ("function" != typeof WeakMap) return null;
                var cacheBabelInterop = new WeakMap(), cacheNodeInterop = new WeakMap();
                return (_getRequireWildcardCache = function(nodeInterop) {
                    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
                })(nodeInterop1);
            }
            exports.Z = function(obj, nodeInterop) {
                if (!nodeInterop && obj && obj.__esModule) return obj;
                if (null === obj || "object" != typeof obj && "function" != typeof obj) return {
                    default: obj
                };
                var cache = _getRequireWildcardCache(nodeInterop);
                if (cache && cache.has(obj)) return cache.get(obj);
                var newObj = {}, hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
                for(var key in obj)if ("default" !== key && Object.prototype.hasOwnProperty.call(obj, key)) {
                    var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
                    desc && (desc.get || desc.set) ? Object.defineProperty(newObj, key, desc) : newObj[key] = obj[key];
                }
                return newObj.default = obj, cache && cache.set(obj, newObj), newObj;
            };
        /***/ },
        /***/ 7273: /***/ function(__unused_webpack_module, exports) {
            "use strict";
            exports.Z = function(source, excluded) {
                if (null == source) return {};
                var key, i, target = {}, sourceKeys = Object.keys(source);
                for(i = 0; i < sourceKeys.length; i++)key = sourceKeys[i], excluded.indexOf(key) >= 0 || (target[key] = source[key]);
                return target;
            };
        /***/ },
        /***/ 37: /***/ function() {
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
        /***/ },
        /***/ 8684: /***/ function(module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.addBasePath = function(path, required) {
                return _normalizeTrailingSlash.normalizePathTrailingSlash(_addPathPrefix.addPathPrefix(path, ""));
            };
            var _addPathPrefix = __webpack_require__(5391), _normalizeTrailingSlash = __webpack_require__(2392);
            ("function" == typeof exports.default || "object" == typeof exports.default && null !== exports.default) && void 0 === exports.default.__esModule && (Object.defineProperty(exports.default, "__esModule", {
                value: !0
            }), Object.assign(exports.default, exports), module.exports = exports.default);
        /***/ },
        /***/ 2725: /***/ function(module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.addLocale = void 0, __webpack_require__(2392), exports.addLocale = function(path) {
                for(var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++)args[_key - 1] = arguments[_key];
                return path;
            }, ("function" == typeof exports.default || "object" == typeof exports.default && null !== exports.default) && void 0 === exports.default.__esModule && (Object.defineProperty(exports.default, "__esModule", {
                value: !0
            }), Object.assign(exports.default, exports), module.exports = exports.default);
        /***/ },
        /***/ 8748: /***/ function(module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.detectDomainLocale = void 0, exports.detectDomainLocale = function() {
                for(var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
            }, ("function" == typeof exports.default || "object" == typeof exports.default && null !== exports.default) && void 0 === exports.default.__esModule && (Object.defineProperty(exports.default, "__esModule", {
                value: !0
            }), Object.assign(exports.default, exports), module.exports = exports.default);
        /***/ },
        /***/ 4119: /***/ function(module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.hasBasePath = function(path) {
                return _pathHasPrefix.pathHasPrefix(path, "");
            };
            var _pathHasPrefix = __webpack_require__(1259);
            ("function" == typeof exports.default || "object" == typeof exports.default && null !== exports.default) && void 0 === exports.default.__esModule && (Object.defineProperty(exports.default, "__esModule", {
                value: !0
            }), Object.assign(exports.default, exports), module.exports = exports.default);
        /***/ },
        /***/ 6007: /***/ function(module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.default = function() {
                return {
                    mountedInstances: new Set(),
                    updateHead: (head)=>{
                        const tags = {};
                        head.forEach((h)=>{
                            if ("link" === h.type && h.props["data-optimized-fonts"]) {
                                if (document.querySelector('style[data-href="'.concat(h.props["data-href"], '"]'))) return;
                                h.props.href = h.props["data-href"], h.props["data-href"] = void 0;
                            }
                            const components = tags[h.type] || [];
                            components.push(h), tags[h.type] = components;
                        });
                        const titleComponent = tags.title ? tags.title[0] : null;
                        let title = "";
                        if (titleComponent) {
                            const { children } = titleComponent.props;
                            title = "string" == typeof children ? children : Array.isArray(children) ? children.join("") : "";
                        }
                        title !== document.title && (document.title = title), [
                            "meta",
                            "base",
                            "link",
                            "style",
                            "script"
                        ].forEach((type)=>{
                            (function(type, components) {
                                const headEl = document.getElementsByTagName("head")[0], headCountEl = headEl.querySelector("meta[name=next-head-count]"), headCount = Number(headCountEl.content), oldTags = [];
                                for(let i = 0, j = headCountEl.previousElementSibling; i < headCount; i++, j = (null == j ? void 0 : j.previousElementSibling) || null){
                                    var ref;
                                    (null == j ? void 0 : null == (ref = j.tagName) ? void 0 : ref.toLowerCase()) === type && oldTags.push(j);
                                }
                                const newTags = components.map(reactElementToDOM).filter((newTag)=>{
                                    for(let k = 0, len = oldTags.length; k < len; k++)if (isEqualNode(oldTags[k], newTag)) return oldTags.splice(k, 1), !1;
                                    return !0;
                                });
                                oldTags.forEach((t)=>{
                                    var ref;
                                    return null == (ref = t.parentNode) ? void 0 : ref.removeChild(t);
                                }), newTags.forEach((t)=>headEl.insertBefore(t, headCountEl)), headCountEl.content = (headCount - oldTags.length + newTags.length).toString();
                            })(type, tags[type] || []);
                        });
                    }
                };
            }, exports.isEqualNode = isEqualNode, exports.DOMAttributeNames = void 0;
            const DOMAttributeNames = {
                acceptCharset: "accept-charset",
                className: "class",
                htmlFor: "for",
                httpEquiv: "http-equiv",
                noModule: "noModule"
            };
            function reactElementToDOM(param) {
                let { type, props } = param;
                const el = document.createElement(type);
                for(const p in props){
                    if (!props.hasOwnProperty(p) || "children" === p || "dangerouslySetInnerHTML" === p || void 0 === props[p]) continue;
                    const attr = DOMAttributeNames[p] || p.toLowerCase();
                    "script" === type && ("async" === attr || "defer" === attr || "noModule" === attr) ? el[attr] = !!props[p] : el.setAttribute(attr, props[p]);
                }
                const { children, dangerouslySetInnerHTML } = props;
                return dangerouslySetInnerHTML ? el.innerHTML = dangerouslySetInnerHTML.__html || "" : children && (el.textContent = "string" == typeof children ? children : Array.isArray(children) ? children.join("") : ""), el;
            }
            function isEqualNode(oldTag, newTag) {
                if (oldTag instanceof HTMLElement && newTag instanceof HTMLElement) {
                    const nonce = newTag.getAttribute("nonce");
                    // Only strip the nonce if `oldTag` has had it stripped. An element's nonce attribute will not
                    // be stripped if there is no content security policy response header that includes a nonce.
                    if (nonce && !oldTag.getAttribute("nonce")) {
                        const cloneTag = newTag.cloneNode(!0);
                        return cloneTag.setAttribute("nonce", ""), cloneTag.nonce = nonce, nonce === oldTag.nonce && oldTag.isEqualNode(cloneTag);
                    }
                }
                return oldTag.isEqualNode(newTag);
            }
            exports.DOMAttributeNames = DOMAttributeNames, ("function" == typeof exports.default || "object" == typeof exports.default && null !== exports.default) && void 0 === exports.default.__esModule && (Object.defineProperty(exports.default, "__esModule", {
                value: !0
            }), Object.assign(exports.default, exports), module.exports = exports.default);
        /***/ },
        /***/ 7339: /***/ function(module, exports, __webpack_require__) {
            "use strict";
            let router, initialData, asPath, pageLoader, appElement, headManager, lastAppProps, lastRenderReject, CachedApp, onPerfEntry, CachedComponent, defaultLocale;
            Object.defineProperty(exports, "__esModule", {
                value: !0
            });
            const _interopRequireWildcard = __webpack_require__(1598)/* ["default"] */ .Z;
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.initialize = function() {
                return _initialize.apply(this, arguments);
            }, exports.hydrate = function(opts) {
                return _hydrate.apply(this, arguments);
            }, exports.emitter = exports.router = exports.version = void 0;
            var _async_to_generator = __webpack_require__(932)/* ["default"] */ .Z, _extends = __webpack_require__(6495)/* ["default"] */ .Z, _interop_require_default = __webpack_require__(2648)/* ["default"] */ .Z;
            __webpack_require__(1598)/* ["default"] */ .Z, __webpack_require__(37);
            var _react = _interop_require_default(__webpack_require__(7294)), _headManagerContext = __webpack_require__(8404), _mitt = _interop_require_default(__webpack_require__(5660)), _routerContext = __webpack_require__(3462), _isDynamic = __webpack_require__(8689), _querystring = __webpack_require__(466), _runtimeConfig = __webpack_require__(8027), _utils = __webpack_require__(3794), _portal = __webpack_require__(2207), _headManager = _interop_require_default(__webpack_require__(6007)), _pageLoader = _interop_require_default(__webpack_require__(5181)), _performanceRelayer = _interop_require_default(__webpack_require__(9302)), _routeAnnouncer = __webpack_require__(8982), _router = __webpack_require__(387), _isError = __webpack_require__(676), _imageConfigContext = __webpack_require__(9977), _removeBasePath = __webpack_require__(9320), _hasBasePath = __webpack_require__(4119);
            const ReactDOM = __webpack_require__(745);
            exports.version = "12.3.2-canary.13", exports.router = router;
            const emitter = _mitt.default();
            exports.emitter = emitter;
            const looseToArray = (input)=>[].slice.call(input);
            let initialMatchesMiddleware = !1;
            self.__next_require__ = __webpack_require__;
            class Container extends _react.default.Component {
                componentDidCatch(componentErr, info) {
                    this.props.fn(componentErr, info);
                }
                componentDidMount() {
                    this.scrollToHash(), router.isSsr && // We don't update for 404 requests as this can modify
                    // the asPath unexpectedly e.g. adding basePath when
                    // it wasn't originally present
                    "/404" !== initialData.page && "/_error" !== initialData.page && (initialData.isFallback || initialData.nextExport && (_isDynamic.isDynamicRoute(router.pathname) || location.search || initialMatchesMiddleware) || initialData.props && initialData.props.__N_SSG && (location.search || initialMatchesMiddleware)) && // update query on mount for exported pages
                    router.replace(router.pathname + "?" + String(_querystring.assign(_querystring.urlQueryToSearchParams(router.query), new URLSearchParams(location.search))), asPath, {
                        // @ts-ignore
                        // WARNING: `_h` is an internal option for handing Next.js
                        // client-side hydration. Your app should _never_ use this property.
                        // It may change at any time without notice.
                        _h: 1,
                        // Fallback pages must trigger the data fetch, so the transition is
                        // not shallow.
                        // Other pages (strictly updating query) happens shallowly, as data
                        // requirements would already be present.
                        shallow: !initialData.isFallback && !initialMatchesMiddleware
                    }).catch((err)=>{
                        if (!err.cancelled) throw err;
                    });
                }
                componentDidUpdate() {
                    this.scrollToHash();
                }
                scrollToHash() {
                    let { hash } = location;
                    if (!(hash = hash && hash.substring(1))) return;
                    const el = document.getElementById(hash);
                    el && // If we call scrollIntoView() in here without a setTimeout
                    // it won't scroll properly.
                    setTimeout(()=>el.scrollIntoView(), 0);
                }
                render() {
                    return this.props.children;
                }
            }
            function _initialize() {
                return (_initialize = _async_to_generator(function*() {
                    arguments.length > 0 && void 0 !== arguments[0] && arguments[0], initialData = JSON.parse(document.getElementById("__NEXT_DATA__").textContent), window.__NEXT_DATA__ = initialData, defaultLocale = initialData.defaultLocale;
                    const prefix = initialData.assetPrefix || "";
                    if (// With dynamic assetPrefix it's no longer possible to set assetPrefix at the build time
                    // So, this is how we do it in the client side at runtime
                    __webpack_require__.p = "".concat(prefix, "/_next/") //eslint-disable-line
                    , // Initialize next/config with the environment configuration
                    _runtimeConfig.setConfig({
                        serverRuntimeConfig: {},
                        publicRuntimeConfig: initialData.runtimeConfig || {}
                    }), asPath = _utils.getURL(), _hasBasePath.hasBasePath(asPath) && (asPath = _removeBasePath.removeBasePath(asPath)), initialData.scriptLoader) {
                        const { initScriptLoader } = __webpack_require__(699);
                        initScriptLoader(initialData.scriptLoader);
                    }
                    pageLoader = new _pageLoader.default(initialData.buildId, prefix);
                    const register = (param)=>{
                        let [r, f] = param;
                        return pageLoader.routeLoader.onEntrypoint(r, f);
                    };
                    return window.__NEXT_P && // Defer page registration for another tick. This will increase the overall
                    // latency in hydrating the page, but reduce the total blocking time.
                    window.__NEXT_P.map((p)=>setTimeout(()=>register(p), 0)), window.__NEXT_P = [], window.__NEXT_P.push = register, (headManager = _headManager.default()).getIsSsr = ()=>router.isSsr, appElement = document.getElementById("__next"), {
                        assetPrefix: prefix
                    };
                })).apply(this, arguments);
            }
            function renderApp(App, appProps) {
                return /*#__PURE__*/ _react.default.createElement(App, Object.assign({}, appProps));
            }
            function AppContainer(param) {
                let { children } = param;
                return /*#__PURE__*/ _react.default.createElement(Container, {
                    fn: (error)=>renderError({
                            App: CachedApp,
                            err: error
                        }).catch((err)=>console.error("Error rendering page: ", err))
                }, /*#__PURE__*/ _react.default.createElement(_routerContext.RouterContext.Provider, {
                    value: _router.makePublicRouterInstance(router)
                }, /*#__PURE__*/ _react.default.createElement(_headManagerContext.HeadManagerContext.Provider, {
                    value: headManager
                }, /*#__PURE__*/ _react.default.createElement(_imageConfigContext.ImageConfigContext.Provider, {
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
                        dangerouslyAllowSVG: !1,
                        unoptimized: !1
                    }
                }, children))));
            }
            const wrapApp = (App)=>(wrappedAppProps)=>{
                    const appProps = _extends({}, wrappedAppProps, {
                        Component: CachedComponent,
                        err: initialData.err,
                        router
                    });
                    return /*#__PURE__*/ _react.default.createElement(AppContainer, null, renderApp(App, appProps));
                };
            // This method handles all runtime and debug errors.
            // 404 and 500 errors are special kind of errors
            // and they are still handle via the main render method.
            function renderError(renderErrorProps) {
                let { App, err } = renderErrorProps;
                return(// Make sure we log the error to the console, otherwise users can't track down issues.
                console.error(err), console.error("A client-side exception has occurred, see here for more info: https://nextjs.org/docs/messages/client-side-exception-occurred"), pageLoader.loadPage("/_error").then((param)=>{
                    let { page: ErrorComponent, styleSheets } = param;
                    return (null == lastAppProps ? void 0 : lastAppProps.Component) === ErrorComponent ? Promise.resolve().then(()=>/*#__PURE__*/ _interopRequireWildcard(__webpack_require__(9185))).then((errorModule)=>Promise.resolve().then(()=>/*#__PURE__*/ _interopRequireWildcard(__webpack_require__(6029))).then((appModule)=>(App = appModule.default, renderErrorProps.App = App, errorModule))).then((m)=>({
                            ErrorComponent: m.default,
                            styleSheets: []
                        })) : {
                        ErrorComponent,
                        styleSheets
                    };
                }).then((param)=>{
                    var ref;
                    let { ErrorComponent, styleSheets } = param;
                    // In production we do a normal render with the `ErrorComponent` as component.
                    // If we've gotten here upon initial render, we can use the props from the server.
                    // Otherwise, we need to call `getInitialProps` on `App` before mounting.
                    const AppTree = wrapApp(App), appCtx = {
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
                }));
            }
            // Dummy component that we render as a child of Root so that we can
            // toggle the correct styles before the page is rendered.
            function Head(param) {
                let { callback } = param;
                return(// We use `useLayoutEffect` to guarantee the callback is executed
                // as soon as React flushes the update.
                _react.default.useLayoutEffect(()=>callback(), [
                    callback
                ]), null);
            }
            let reactRoot = null, shouldHydrate = !0;
            function clearMarks() {
                [
                    "beforeRender",
                    "afterHydrate",
                    "afterRender",
                    "routeChange"
                ].forEach((mark)=>performance.clearMarks(mark));
            }
            function markHydrateComplete() {
                _utils.ST && (performance.mark("afterHydrate") // mark end of hydration
                , performance.measure("Next.js-before-hydration", "navigationStart", "beforeRender"), performance.measure("Next.js-hydration", "beforeRender", "afterHydrate"), onPerfEntry && performance.getEntriesByName("Next.js-hydration").forEach(onPerfEntry), clearMarks());
            }
            function markRenderComplete() {
                if (!_utils.ST) return;
                performance.mark("afterRender") // mark end of render
                ;
                const navStartEntries = performance.getEntriesByName("routeChange", "mark");
                navStartEntries.length && (performance.measure("Next.js-route-change-to-render", navStartEntries[0].name, "beforeRender"), performance.measure("Next.js-render", "beforeRender", "afterRender"), onPerfEntry && (performance.getEntriesByName("Next.js-render").forEach(onPerfEntry), performance.getEntriesByName("Next.js-route-change-to-render").forEach(onPerfEntry)), clearMarks(), [
                    "Next.js-route-change-to-render",
                    "Next.js-render"
                ].forEach((measure)=>performance.clearMeasures(measure)));
            }
            function Root(param) {
                let { callbacks, children } = param;
                return(// We use `useLayoutEffect` to guarantee the callbacks are executed
                // as soon as React flushes the update
                _react.default.useLayoutEffect(()=>callbacks.forEach((callback)=>callback()), [
                    callbacks
                ]), // We should ask to measure the Web Vitals after rendering completes so we
                // don't cause any hydration delay:
                _react.default.useEffect(()=>{
                    _performanceRelayer.default(onPerfEntry);
                }, []), children);
            }
            function doRender(input) {
                let resolvePromise, { App, Component, props, err } = input, styleSheets = "initial" in input ? void 0 : input.styleSheets;
                Component = Component || lastAppProps.Component;
                const appProps = _extends({}, props = props || lastAppProps.props, {
                    Component,
                    err,
                    router
                });
                // lastAppProps has to be set before ReactDom.render to account for ReactDom throwing an error.
                lastAppProps = appProps;
                let canceled = !1;
                const renderPromise = new Promise((resolve, reject)=>{
                    lastRenderReject && lastRenderReject(), resolvePromise = ()=>{
                        lastRenderReject = null, resolve();
                    }, lastRenderReject = ()=>{
                        canceled = !0, lastRenderReject = null;
                        const error = Error("Cancel rendering route");
                        error.cancelled = !0, reject(error);
                    };
                });
                function onRootCommit() {
                    resolvePromise();
                }
                !// This function has a return type to ensure it doesn't start returning a
                // Promise. It should remain synchronous.
                function() {
                    if (!styleSheets) return;
                    const currentHrefs = new Set(looseToArray(document.querySelectorAll("style[data-n-href]")).map((tag)=>tag.getAttribute("data-n-href"))), noscript = document.querySelector("noscript[data-n-css]"), nonce = null == noscript ? void 0 : noscript.getAttribute("data-n-css");
                    styleSheets.forEach((param)=>{
                        let { href, text } = param;
                        if (!currentHrefs.has(href)) {
                            const styleTag = document.createElement("style");
                            styleTag.setAttribute("data-n-href", href), styleTag.setAttribute("media", "x"), nonce && styleTag.setAttribute("nonce", nonce), document.head.appendChild(styleTag), styleTag.appendChild(document.createTextNode(text));
                        }
                    });
                }();
                const elem = /*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/ _react.default.createElement(Head, {
                    callback: function() {
                        if (// We can skip this during hydration. Running it wont cause any harm, but
                        // we may as well save the CPU cycles:
                        styleSheets && // Ensure this render was not canceled
                        !canceled) {
                            const desiredHrefs = new Set(styleSheets.map((s)=>s.href)), currentStyleTags = looseToArray(document.querySelectorAll("style[data-n-href]")), currentHrefs = currentStyleTags.map((tag)=>tag.getAttribute("data-n-href"));
                            // Toggle `<style>` tags on or off depending on if they're needed:
                            for(let idx = 0; idx < currentHrefs.length; ++idx)desiredHrefs.has(currentHrefs[idx]) ? currentStyleTags[idx].removeAttribute("media") : currentStyleTags[idx].setAttribute("media", "x");
                            // Reorder styles into intended order:
                            let referenceNode = document.querySelector("noscript[data-n-css]");
                            referenceNode && styleSheets.forEach((param)=>{
                                let { href } = param;
                                const targetTag = document.querySelector('style[data-n-href="'.concat(href, '"]'));
                                targetTag && (referenceNode.parentNode.insertBefore(targetTag, referenceNode.nextSibling), referenceNode = targetTag);
                            }), // Finally, clean up server rendered stylesheets:
                            looseToArray(document.querySelectorAll("link[data-n-p]")).forEach((el)=>{
                                el.parentNode.removeChild(el);
                            });
                        }
                        if (input.scroll) {
                            const htmlElement = document.documentElement, existing = htmlElement.style.scrollBehavior;
                            htmlElement.style.scrollBehavior = "auto", window.scrollTo(input.scroll.x, input.scroll.y), htmlElement.style.scrollBehavior = existing;
                        }
                    }
                }), /*#__PURE__*/ _react.default.createElement(AppContainer, null, renderApp(App, appProps), /*#__PURE__*/ _react.default.createElement(_portal.Portal, {
                    type: "next-route-announcer"
                }, /*#__PURE__*/ _react.default.createElement(_routeAnnouncer.RouteAnnouncer, null))));
                return !// We catch runtime errors using componentDidCatch which will trigger renderError
                function(domEl, fn) {
                    // mark start of hydrate/render
                    _utils.ST && performance.mark("beforeRender");
                    const reactEl = fn(shouldHydrate ? markHydrateComplete : markRenderComplete);
                    reactRoot ? (0, _react.default.startTransition)(()=>{
                        reactRoot.render(reactEl);
                    }) : (// Unlike with createRoot, you don't need a separate root.render() call here
                    reactRoot = ReactDOM.hydrateRoot(domEl, reactEl), // TODO: Remove shouldHydrate variable when React 18 is stable as it can depend on `reactRoot` existing
                    shouldHydrate = !1);
                }(appElement, (callback)=>/*#__PURE__*/ _react.default.createElement(Root, {
                        callbacks: [
                            callback,
                            onRootCommit
                        ]
                    }, /*#__PURE__*/ _react.default.createElement(_react.default.StrictMode, null, elem))), renderPromise;
            }
            function render(renderingProps) {
                return _render.apply(this, arguments);
            }
            function _render() {
                return (_render = _async_to_generator(function*(renderingProps) {
                    if (renderingProps.err) {
                        yield renderError(renderingProps);
                        return;
                    }
                    try {
                        yield doRender(renderingProps);
                    } catch (err) {
                        const renderErr = _isError.getProperError(err);
                        // bubble up cancelation errors
                        if (renderErr.cancelled) throw renderErr;
                        yield renderError(_extends({}, renderingProps, {
                            err: renderErr
                        }));
                    }
                })).apply(this, arguments);
            }
            function _hydrate() {
                return (_hydrate = _async_to_generator(function*(opts) {
                    let initialErr = initialData.err;
                    try {
                        const appEntrypoint = yield pageLoader.routeLoader.whenEntrypoint("/_app");
                        if ("error" in appEntrypoint) throw appEntrypoint.error;
                        const { component: app, exports: mod } = appEntrypoint;
                        CachedApp = app, mod && mod.reportWebVitals && (onPerfEntry = (param)=>{
                            let perfStartEntry, { id, name, startTime, value, duration, entryType, entries } = param;
                            // Combines timestamp with random number for unique ID
                            const uniqueID = "".concat(Date.now(), "-").concat(Math.floor(Math.random() * (9e12 - 1)) + 1e12);
                            entries && entries.length && (perfStartEntry = entries[0].startTime);
                            const webVitals = {
                                id: id || uniqueID,
                                name,
                                startTime: startTime || perfStartEntry,
                                value: null == value ? duration : value,
                                label: "mark" === entryType || "measure" === entryType ? "custom" : "web-vital"
                            };
                            mod.reportWebVitals(webVitals);
                        });
                        const pageEntrypoint = yield pageLoader.routeLoader.whenEntrypoint(initialData.page);
                        if ("error" in pageEntrypoint) throw pageEntrypoint.error;
                        CachedComponent = pageEntrypoint.component;
                    } catch (error1) {
                        // This catches errors like throwing in the top level of a module
                        initialErr = _isError.getProperError(error1);
                    }
                    window.__NEXT_PRELOADREADY && (yield window.__NEXT_PRELOADREADY(initialData.dynamicIds)), exports.router = router = _router.createRouter(initialData.page, initialData.query, asPath, {
                        initialProps: initialData.props,
                        pageLoader,
                        App: CachedApp,
                        Component: CachedComponent,
                        wrapApp,
                        err: initialErr,
                        isFallback: !!initialData.isFallback,
                        subscription: (info, App, scroll)=>render(Object.assign({}, info, {
                                App,
                                scroll
                            })),
                        locale: initialData.locale,
                        locales: initialData.locales,
                        defaultLocale,
                        domainLocales: initialData.domainLocales,
                        isPreview: initialData.isPreview
                    }), initialMatchesMiddleware = yield router._initialMatchesMiddlewarePromise;
                    const renderCtx = {
                        App: CachedApp,
                        initial: !0,
                        Component: CachedComponent,
                        props: initialData.props,
                        err: initialErr
                    };
                    (null == opts ? void 0 : opts.beforeRender) && (yield opts.beforeRender()), render(renderCtx);
                })).apply(this, arguments);
            }
            ("function" == typeof exports.default || "object" == typeof exports.default && null !== exports.default) && void 0 === exports.default.__esModule && (Object.defineProperty(exports.default, "__esModule", {
                value: !0
            }), Object.assign(exports.default, exports), module.exports = exports.default);
        /***/ },
        /***/ 2870: /***/ function(module, exports, __webpack_require__) {
            "use strict";
            var _ = __webpack_require__(7339);
            window.next = {
                version: _.version,
                // router is initialized later so it has to be live-binded
                get router () {
                    return _.router;
                },
                emitter: _.emitter
            }, _.initialize({}).then(()=>_.hydrate()).catch(console.error), ("function" == typeof exports.default || "object" == typeof exports.default && null !== exports.default) && void 0 === exports.default.__esModule && (Object.defineProperty(exports.default, "__esModule", {
                value: !0
            }), Object.assign(exports.default, exports), module.exports = exports.default);
        /***/ },
        /***/ 2392: /***/ function(module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.normalizePathTrailingSlash = void 0;
            var _removeTrailingSlash = __webpack_require__(6316), _parsePath = __webpack_require__(4943);
            exports.normalizePathTrailingSlash = (path)=>{
                if (!path.startsWith("/")) return path;
                const { pathname, query, hash } = _parsePath.parsePath(path);
                return "".concat(_removeTrailingSlash.removeTrailingSlash(pathname)).concat(query).concat(hash);
            }, ("function" == typeof exports.default || "object" == typeof exports.default && null !== exports.default) && void 0 === exports.default.__esModule && (Object.defineProperty(exports.default, "__esModule", {
                value: !0
            }), Object.assign(exports.default, exports), module.exports = exports.default);
        /***/ },
        /***/ 5181: /***/ function(module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.default = void 0;
            var _interop_require_default = __webpack_require__(2648)/* ["default"] */ .Z, _addBasePath = __webpack_require__(8684), _router = __webpack_require__(6273), _getAssetPathFromRoute = _interop_require_default(__webpack_require__(3891)), _addLocale = __webpack_require__(2725), _isDynamic = __webpack_require__(8689), _parseRelativeUrl = __webpack_require__(6305), _removeTrailingSlash = __webpack_require__(6316), _routeLoader = __webpack_require__(2669);
            exports.default = class {
                getPageList() {
                    return _routeLoader.getClientBuildManifest().then((manifest)=>manifest.sortedPages);
                }
                getMiddleware() {
                    return window.__MIDDLEWARE_MATCHERS = [], window.__MIDDLEWARE_MATCHERS;
                }
                getDataHref(params) {
                    const { asPath, href, locale } = params, { pathname: hrefPathname, query, search } = _parseRelativeUrl.parseRelativeUrl(href), { pathname: asPathname } = _parseRelativeUrl.parseRelativeUrl(asPath), route = _removeTrailingSlash.removeTrailingSlash(hrefPathname);
                    if ("/" !== route[0]) throw Error('Route name should start with a "/", got "'.concat(route, '"'));
                    return ((path)=>{
                        const dataRoute = _getAssetPathFromRoute.default(_removeTrailingSlash.removeTrailingSlash(_addLocale.addLocale(path, locale)), ".json");
                        return _addBasePath.addBasePath("/_next/data/".concat(this.buildId).concat(dataRoute).concat(search), !0);
                    })(params.skipInterpolation ? asPathname : _isDynamic.isDynamicRoute(route) ? _router.interpolateAs(hrefPathname, asPathname, query).result : route);
                }
                /**
   * @param {string} route - the route (file-system path)
   */ _isSsg(route) {
                    return this.promisedSsgManifest.then((manifest)=>manifest.has(route));
                }
                loadPage(route) {
                    return this.routeLoader.loadRoute(route).then((res)=>{
                        if ("component" in res) return {
                            page: res.component,
                            mod: res.exports,
                            styleSheets: res.styles.map((o)=>({
                                    href: o.href,
                                    text: o.content
                                }))
                        };
                        throw res.error;
                    });
                }
                prefetch(route) {
                    return this.routeLoader.prefetch(route);
                }
                constructor(buildId, assetPrefix){
                    this.routeLoader = _routeLoader.createRouteLoader(assetPrefix), this.buildId = buildId, this.assetPrefix = assetPrefix, this.promisedSsgManifest = new Promise((resolve)=>{
                        window.__SSG_MANIFEST ? resolve(window.__SSG_MANIFEST) : window.__SSG_MANIFEST_CB = ()=>{
                            resolve(window.__SSG_MANIFEST);
                        };
                    });
                }
            }, ("function" == typeof exports.default || "object" == typeof exports.default && null !== exports.default) && void 0 === exports.default.__esModule && (Object.defineProperty(exports.default, "__esModule", {
                value: !0
            }), Object.assign(exports.default, exports), module.exports = exports.default);
        /***/ },
        /***/ 9302: /***/ function(module, exports, __webpack_require__) {
            "use strict";
            let userReportHandler;
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.default = void 0;
            var _webVitals = __webpack_require__(8018);
            location.href;
            let isRegistered = !1;
            function onReport(metric) {
                userReportHandler && userReportHandler(metric);
            }
            exports.default = (onPerfEntry)=>{
                // Only register listeners once:
                // Update function if it changes:
                userReportHandler = onPerfEntry, isRegistered || (isRegistered = !0, _webVitals.onCLS(onReport), _webVitals.onFID(onReport), _webVitals.onFCP(onReport), _webVitals.onLCP(onReport), _webVitals.onTTFB(onReport), _webVitals.onINP(onReport));
            }, ("function" == typeof exports.default || "object" == typeof exports.default && null !== exports.default) && void 0 === exports.default.__esModule && (Object.defineProperty(exports.default, "__esModule", {
                value: !0
            }), Object.assign(exports.default, exports), module.exports = exports.default);
        /***/ },
        /***/ 2207: /***/ function(module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.Portal = void 0;
            var _react = __webpack_require__(7294), _reactDom = __webpack_require__(3935);
            exports.Portal = (param)=>{
                let { children, type } = param;
                const [portalNode, setPortalNode] = _react.useState(null);
                return _react.useEffect(()=>{
                    const element = document.createElement(type);
                    return document.body.appendChild(element), setPortalNode(element), ()=>{
                        document.body.removeChild(element);
                    };
                }, [
                    type
                ]), portalNode ? /*#__PURE__*/ _reactDom.createPortal(children, portalNode) : null;
            }, ("function" == typeof exports.default || "object" == typeof exports.default && null !== exports.default) && void 0 === exports.default.__esModule && (Object.defineProperty(exports.default, "__esModule", {
                value: !0
            }), Object.assign(exports.default, exports), module.exports = exports.default);
        /***/ },
        /***/ 9320: /***/ function(module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.removeBasePath = function(path) {
                return (path = path.slice(0)).startsWith("/") || (path = "/".concat(path)), path;
            }, __webpack_require__(4119), ("function" == typeof exports.default || "object" == typeof exports.default && null !== exports.default) && void 0 === exports.default.__esModule && (Object.defineProperty(exports.default, "__esModule", {
                value: !0
            }), Object.assign(exports.default, exports), module.exports = exports.default);
        /***/ },
        /***/ 5776: /***/ function(module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.removeLocale = function(path, locale) {
                return path;
            }, __webpack_require__(4943), ("function" == typeof exports.default || "object" == typeof exports.default && null !== exports.default) && void 0 === exports.default.__esModule && (Object.defineProperty(exports.default, "__esModule", {
                value: !0
            }), Object.assign(exports.default, exports), module.exports = exports.default);
        /***/ },
        /***/ 9311: /***/ function(module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.cancelIdleCallback = exports.requestIdleCallback = void 0;
            const requestIdleCallback = "undefined" != typeof self && self.requestIdleCallback && self.requestIdleCallback.bind(window) || function(cb) {
                let start = Date.now();
                return setTimeout(function() {
                    cb({
                        didTimeout: !1,
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
            exports.cancelIdleCallback = cancelIdleCallback, ("function" == typeof exports.default || "object" == typeof exports.default && null !== exports.default) && void 0 === exports.default.__esModule && (Object.defineProperty(exports.default, "__esModule", {
                value: !0
            }), Object.assign(exports.default, exports), module.exports = exports.default);
        /***/ },
        /***/ 8982: /***/ function(module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.default = exports.RouteAnnouncer = void 0;
            var _react = (0, __webpack_require__(2648)/* ["default"] */ .Z)(__webpack_require__(7294)), _router = __webpack_require__(387);
            const nextjsRouteAnnouncerStyles = {
                border: 0,
                clip: "rect(0 0 0 0)",
                height: "1px",
                margin: "-1px",
                overflow: "hidden",
                padding: 0,
                position: "absolute",
                width: "1px",
                // https://medium.com/@jessebeach/beware-smushed-off-screen-accessible-text-5952a4c2cbfe
                whiteSpace: "nowrap",
                wordWrap: "normal"
            }, RouteAnnouncer = ()=>{
                const { asPath } = _router.useRouter(), [routeAnnouncement, setRouteAnnouncement] = _react.default.useState(""), previouslyLoadedPath = _react.default.useRef(asPath);
                return(// Every time the path changes, announce the new page’s title following this
                // priority: first the document title (from head), otherwise the first h1, or
                // if none of these exist, then the pathname from the URL. This methodology is
                // inspired by Marcy Sutton’s accessible client routing user testing. More
                // information can be found here:
                // https://www.gatsbyjs.com/blog/2019-07-11-user-testing-accessible-client-routing/
                _react.default.useEffect(()=>{
                    // If the path hasn't change, we do nothing.
                    if (previouslyLoadedPath.current !== asPath) {
                        if (previouslyLoadedPath.current = asPath, document.title) setRouteAnnouncement(document.title);
                        else {
                            var ref;
                            const pageHeader = document.querySelector("h1");
                            setRouteAnnouncement((null != (ref = null == pageHeader ? void 0 : pageHeader.innerText) ? ref : null == pageHeader ? void 0 : pageHeader.textContent) || asPath);
                        }
                    }
                }, [
                    asPath
                ]), /*#__PURE__*/ _react.default.createElement("p", {
                    "aria-live": "assertive" // Make the announcement immediately.
                    ,
                    id: "__next-route-announcer__",
                    role: "alert",
                    style: nextjsRouteAnnouncerStyles
                }, routeAnnouncement));
            };
            exports.RouteAnnouncer = RouteAnnouncer, exports.default = RouteAnnouncer, ("function" == typeof exports.default || "object" == typeof exports.default && null !== exports.default) && void 0 === exports.default.__esModule && (Object.defineProperty(exports.default, "__esModule", {
                value: !0
            }), Object.assign(exports.default, exports), module.exports = exports.default);
        /***/ },
        /***/ 2669: /***/ function(module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.markAssetError = markAssetError, exports.isAssetError = function(err) {
                return err && ASSET_LOAD_ERROR in err;
            }, exports.getClientBuildManifest = getClientBuildManifest, exports.createRouteLoader = function(assetPrefix) {
                const entrypoints = new Map(), loadedScripts = new Map(), styleSheets = new Map(), routes = new Map();
                function maybeExecuteScript(src) {
                    {
                        var script;
                        let prom = loadedScripts.get(src.toString());
                        return prom || (document.querySelector('script[src^="'.concat(src, '"]')) ? Promise.resolve() : (loadedScripts.set(src.toString(), prom = new Promise((resolve, reject)=>{
                            // The order of property assignment here is intentional.
                            // 1. Setup success/failure hooks in case the browser synchronously
                            //    executes when `src` is set.
                            (script = document.createElement("script")).onload = resolve, script.onerror = ()=>reject(markAssetError(Error("Failed to load script: ".concat(src)))), // 2. Configure the cross-origin attribute before setting `src` in case the
                            //    browser begins to fetch.
                            script.crossOrigin = void 0, // 3. Finally, set the source and inject into the DOM in case the child
                            //    must be appended for fetching to start.
                            script.src = src, document.body.appendChild(script);
                        })), prom));
                    }
                }
                function fetchStyleSheet(href) {
                    let prom = styleSheets.get(href);
                    return prom || styleSheets.set(href, prom = fetch(href).then((res)=>{
                        if (!res.ok) throw Error("Failed to load stylesheet: ".concat(href));
                        return res.text().then((text)=>({
                                href: href,
                                content: text
                            }));
                    }).catch((err)=>{
                        throw markAssetError(err);
                    })), prom;
                }
                return {
                    whenEntrypoint: (route)=>withFuture(route, entrypoints),
                    onEntrypoint (route, execute) {
                        (execute ? Promise.resolve().then(()=>execute()).then((exports1)=>({
                                component: exports1 && exports1.default || exports1,
                                exports: exports1
                            }), (err)=>({
                                error: err
                            })) : Promise.resolve(void 0)).then((input)=>{
                            const old = entrypoints.get(route);
                            old && "resolve" in old ? input && (entrypoints.set(route, input), old.resolve(input)) : (input ? entrypoints.set(route, input) : entrypoints.delete(route), // when this entrypoint has been resolved before
                            // the route is outdated and we want to invalidate
                            // this cache entry
                            routes.delete(route));
                        });
                    },
                    loadRoute (route, prefetch) {
                        return withFuture(route, routes, ()=>{
                            let devBuildPromiseResolve;
                            return resolvePromiseWithTimeout(getFilesForRoute(assetPrefix, route).then((param)=>{
                                let { scripts, css } = param;
                                return Promise.all([
                                    entrypoints.has(route) ? [] : Promise.all(scripts.map(maybeExecuteScript)),
                                    Promise.all(css.map(fetchStyleSheet))
                                ]);
                            }).then((res)=>this.whenEntrypoint(route).then((entrypoint)=>({
                                        entrypoint,
                                        styles: res[1]
                                    }))), 3800, markAssetError(Error("Route did not complete loading: ".concat(route)))).then((param)=>{
                                let { entrypoint, styles } = param;
                                const res = Object.assign({
                                    styles: styles
                                }, entrypoint);
                                return "error" in entrypoint ? entrypoint : res;
                            }).catch((err)=>{
                                if (prefetch) // we don't want to cache errors during prefetch
                                throw err;
                                return {
                                    error: err
                                };
                            }).finally(()=>null == devBuildPromiseResolve ? void 0 : devBuildPromiseResolve());
                        });
                    },
                    prefetch (route) {
                        // https://github.com/GoogleChromeLabs/quicklink/blob/453a661fa1fa940e2d2e044452398e38c67a98fb/src/index.mjs#L115-L118
                        // License: Apache 2.0
                        let cn;
                        return (cn = navigator.connection) && (cn.saveData || /2g/.test(cn.effectiveType)) ? Promise.resolve() : getFilesForRoute(assetPrefix, route).then((output)=>Promise.all(canPrefetch ? output.scripts.map((script)=>{
                                var href, as, link;
                                return href = script.toString(), as = "script", new Promise((res, rej)=>{
                                    const selector = '\n      link[rel="prefetch"][href^="'.concat(href, '"],\n      link[rel="preload"][href^="').concat(href, '"],\n      script[src^="').concat(href, '"]');
                                    if (document.querySelector(selector)) return res();
                                    link = document.createElement("link"), as && (link.as = as), link.rel = "prefetch", link.crossOrigin = void 0, link.onload = res, link.onerror = rej, // `href` should always be last:
                                    link.href = href, document.head.appendChild(link);
                                });
                            }) : [])).then(()=>{
                            _requestIdleCallback.requestIdleCallback(()=>this.loadRoute(route, !0).catch(()=>{}));
                        }).catch(()=>{});
                    }
                };
            }, (0, __webpack_require__(2648)/* ["default"] */ .Z)(__webpack_require__(3891));
            var _trustedTypes = __webpack_require__(4991), _requestIdleCallback = __webpack_require__(9311);
            function withFuture(key, map, generator) {
                let resolver, entry = map.get(key);
                if (entry) return "future" in entry ? entry.future : Promise.resolve(entry);
                const prom = new Promise((resolve)=>{
                    resolver = resolve;
                });
                return map.set(key, entry = {
                    resolve: resolver,
                    future: prom
                }), generator ? generator() // eslint-disable-next-line no-sequences
                .then((value)=>(resolver(value), value)).catch((err)=>{
                    throw map.delete(key), err;
                }) : prom;
            }
            const canPrefetch = function(link) {
                try {
                    return link = document.createElement("link"), !!window.MSInputMethodContext && !!document.documentMode || link.relList.supports("prefetch");
                } catch (e) {
                    return !1;
                }
            }(), ASSET_LOAD_ERROR = Symbol("ASSET_LOAD_ERROR");
            function markAssetError(err) {
                return Object.defineProperty(err, ASSET_LOAD_ERROR, {});
            }
            // Resolve a promise that times out after given amount of milliseconds.
            function resolvePromiseWithTimeout(p, ms, err) {
                return new Promise((resolve, reject)=>{
                    let cancelled = !1;
                    p.then((r)=>{
                        // Resolved, cancel the timeout
                        cancelled = !0, resolve(r);
                    }).catch(reject), _requestIdleCallback.requestIdleCallback(()=>setTimeout(()=>{
                            cancelled || reject(err);
                        }, ms));
                });
            }
            function getClientBuildManifest() {
                return self.__BUILD_MANIFEST ? Promise.resolve(self.__BUILD_MANIFEST) : resolvePromiseWithTimeout(new Promise((resolve)=>{
                    // Mandatory because this is not concurrent safe:
                    const cb = self.__BUILD_MANIFEST_CB;
                    self.__BUILD_MANIFEST_CB = ()=>{
                        resolve(self.__BUILD_MANIFEST), cb && cb();
                    };
                }), 3800, markAssetError(Error("Failed to load client build manifest")));
            }
            function getFilesForRoute(assetPrefix, route) {
                return getClientBuildManifest().then((manifest)=>{
                    if (!(route in manifest)) throw markAssetError(Error("Failed to lookup route: ".concat(route)));
                    const allFiles = manifest[route].map((entry)=>assetPrefix + "/_next/" + encodeURI(entry));
                    return {
                        scripts: allFiles.filter((v)=>v.endsWith(".js")).map((v)=>_trustedTypes.__unsafeCreateTrustedScriptURL(v)),
                        css: allFiles.filter((v)=>v.endsWith(".css"))
                    };
                });
            }
            ("function" == typeof exports.default || "object" == typeof exports.default && null !== exports.default) && void 0 === exports.default.__esModule && (Object.defineProperty(exports.default, "__esModule", {
                value: !0
            }), Object.assign(exports.default, exports), module.exports = exports.default);
        /***/ },
        /***/ 387: /***/ function(module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), Object.defineProperty(exports, "Router", {
                enumerable: !0,
                get: function() {
                    return _router.default;
                }
            }), Object.defineProperty(exports, "withRouter", {
                enumerable: !0,
                get: function() {
                    return _withRouter.default;
                }
            }), exports.useRouter = function() {
                return _react.default.useContext(_routerContext.RouterContext);
            }, exports.createRouter = function() {
                for(var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
                return singletonRouter.router = new _router.default(...args), singletonRouter.readyCallbacks.forEach((cb)=>cb()), singletonRouter.readyCallbacks = [], singletonRouter.router;
            }, exports.makePublicRouterInstance = function(router) {
                const instance = {};
                for (const property of urlPropertyFields){
                    if ("object" == typeof router[property]) {
                        instance[property] = Object.assign(Array.isArray(router[property]) ? [] : {}, router[property]) // makes sure query is not stateful
                        ;
                        continue;
                    }
                    instance[property] = router[property];
                }
                return(// Events is a static property on the router, the router doesn't have to be initialized to use it
                instance.events = _router.default.events, coreMethodFields.forEach((field)=>{
                    instance[field] = function() {
                        for(var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
                        return router[field](...args);
                    };
                }), instance);
            }, exports.default = void 0;
            var _interop_require_default = __webpack_require__(2648)/* ["default"] */ .Z, _react = _interop_require_default(__webpack_require__(7294)), _router = _interop_require_default(__webpack_require__(6273)), _routerContext = __webpack_require__(3462), _isError = _interop_require_default(__webpack_require__(676)), _withRouter = _interop_require_default(__webpack_require__(8981));
            const singletonRouter = {
                router: null,
                readyCallbacks: [],
                ready (cb) {
                    if (this.router) return cb();
                    this.readyCallbacks.push(cb);
                }
            }, urlPropertyFields = [
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
            ], coreMethodFields = [
                "push",
                "replace",
                "reload",
                "back",
                "prefetch",
                "beforePopState"
            ];
            function getRouter() {
                if (!singletonRouter.router) throw Error('No router instance found.\nYou should only use "next/router" on the client side of your app.\n');
                return singletonRouter.router;
            }
            // Events is a static property on the router, the router doesn't have to be initialized to use it
            Object.defineProperty(singletonRouter, "events", {
                get: ()=>_router.default.events
            }), urlPropertyFields.forEach((field)=>{
                // Here we need to use Object.defineProperty because we need to return
                // the property assigned to the actual router
                // The value might get changed as we change routes and this is the
                // proper way to access it
                Object.defineProperty(singletonRouter, field, {
                    get: ()=>getRouter()[field]
                });
            }), coreMethodFields.forEach((field)=>{
                singletonRouter[field] = function() {
                    for(var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
                    return getRouter()[field](...args);
                };
            }), [
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
                        if (singletonRouter[eventField]) try {
                            singletonRouter[eventField](...args);
                        } catch (err) {
                            console.error("Error when running the Router event: ".concat(eventField)), console.error(_isError.default(err) ? "".concat(err.message, "\n").concat(err.stack) : err + "");
                        }
                    });
                });
            }), exports.default = singletonRouter, ("function" == typeof exports.default || "object" == typeof exports.default && null !== exports.default) && void 0 === exports.default.__esModule && (Object.defineProperty(exports.default, "__esModule", {
                value: !0
            }), Object.assign(exports.default, exports), module.exports = exports.default);
        /***/ },
        /***/ 699: /***/ function(module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.handleClientScriptLoad = handleClientScriptLoad, exports.initScriptLoader = function(scriptLoaderItems) {
                scriptLoaderItems.forEach(handleClientScriptLoad), [
                    ...document.querySelectorAll('[data-nscript="beforeInteractive"]'),
                    ...document.querySelectorAll('[data-nscript="beforePageRender"]')
                ].forEach((script)=>{
                    const cacheKey = script.id || script.getAttribute("src");
                    LoadCache.add(cacheKey);
                });
            }, exports.default = void 0;
            var _extends = __webpack_require__(6495)/* ["default"] */ .Z, _interop_require_wildcard = __webpack_require__(1598)/* ["default"] */ .Z, _object_without_properties_loose = __webpack_require__(7273)/* ["default"] */ .Z, _react = _interop_require_wildcard(__webpack_require__(7294)), _headManagerContext = __webpack_require__(8404), _headManager = __webpack_require__(6007), _requestIdleCallback = __webpack_require__(9311);
            const ScriptCache = new Map(), LoadCache = new Set(), ignoreProps = [
                "onLoad",
                "onReady",
                "dangerouslySetInnerHTML",
                "children",
                "onError",
                "strategy"
            ], loadScript = (props)=>{
                const { src, id, onLoad = ()=>{}, onReady = null, dangerouslySetInnerHTML, children = "", strategy = "afterInteractive", onError } = props, cacheKey = id || src;
                // Script has already loaded
                if (cacheKey && LoadCache.has(cacheKey)) return;
                // Contents of this script are already loading/loaded
                if (ScriptCache.has(src)) {
                    LoadCache.add(cacheKey), // It is possible that multiple `next/script` components all have same "src", but has different "onLoad"
                    // This is to make sure the same remote script will only load once, but "onLoad" are executed in order
                    ScriptCache.get(src).then(onLoad, onError);
                    return;
                }
                /** Execute after the script first loaded */ const afterLoad = ()=>{
                    onReady && onReady(), // add cacheKey to LoadCache when load successfully
                    LoadCache.add(cacheKey);
                }, el = document.createElement("script"), loadPromise = new Promise((resolve, reject)=>{
                    el.addEventListener("load", function(e) {
                        resolve(), onLoad && onLoad.call(this, e), afterLoad();
                    }), el.addEventListener("error", function(e) {
                        reject(e);
                    });
                }).catch(function(e) {
                    onError && onError(e);
                });
                for (const [k, value] of (dangerouslySetInnerHTML ? (el.innerHTML = dangerouslySetInnerHTML.__html || "", afterLoad()) : children ? (el.textContent = "string" == typeof children ? children : Array.isArray(children) ? children.join("") : "", afterLoad()) : src && (el.src = src, // do not add cacheKey into LoadCache for remote script here
                // cacheKey will be added to LoadCache when it is actually loaded (see loadPromise above)
                ScriptCache.set(src, loadPromise)), Object.entries(props))){
                    if (void 0 === value || ignoreProps.includes(k)) continue;
                    const attr = _headManager.DOMAttributeNames[k] || k.toLowerCase();
                    el.setAttribute(attr, value);
                }
                "worker" === strategy && el.setAttribute("type", "text/partytown"), el.setAttribute("data-nscript", strategy), document.body.appendChild(el);
            };
            function handleClientScriptLoad(props) {
                const { strategy = "afterInteractive" } = props;
                "lazyOnload" === strategy ? window.addEventListener("load", ()=>{
                    _requestIdleCallback.requestIdleCallback(()=>loadScript(props));
                }) : loadScript(props);
            }
            function Script(props) {
                const { id, src = "", onLoad = ()=>{}, onReady = null, strategy = "afterInteractive", onError } = props, restProps = _object_without_properties_loose(props, [
                    "id",
                    "src",
                    "onLoad",
                    "onReady",
                    "strategy",
                    "onError"
                ]), { updateScripts, scripts, getIsSsr } = _react.useContext(_headManagerContext.HeadManagerContext), hasOnReadyEffectCalled = _react.useRef(!1);
                _react.useEffect(()=>{
                    const cacheKey = id || src;
                    hasOnReadyEffectCalled.current || (onReady && cacheKey && LoadCache.has(cacheKey) && onReady(), hasOnReadyEffectCalled.current = !0);
                }, [
                    onReady,
                    id,
                    src
                ]);
                const hasLoadScriptEffectCalled = _react.useRef(!1);
                return _react.useEffect(()=>{
                    hasLoadScriptEffectCalled.current || ("afterInteractive" === strategy ? loadScript(props) : "lazyOnload" === strategy && ("complete" === document.readyState ? _requestIdleCallback.requestIdleCallback(()=>loadScript(props)) : window.addEventListener("load", ()=>{
                        _requestIdleCallback.requestIdleCallback(()=>loadScript(props));
                    })), hasLoadScriptEffectCalled.current = !0);
                }, [
                    props,
                    strategy
                ]), ("beforeInteractive" === strategy || "worker" === strategy) && (updateScripts ? (scripts[strategy] = (scripts[strategy] || []).concat([
                    _extends({
                        id,
                        src,
                        onLoad,
                        onReady,
                        onError
                    }, restProps)
                ]), updateScripts(scripts)) : getIsSsr && getIsSsr() ? // Script has already loaded during SSR
                LoadCache.add(id || src) : getIsSsr && !getIsSsr() && loadScript(props)), null;
            }
            Object.defineProperty(Script, "__nextScript", {
                value: !0
            }), exports.default = Script, ("function" == typeof exports.default || "object" == typeof exports.default && null !== exports.default) && void 0 === exports.default.__esModule && (Object.defineProperty(exports.default, "__esModule", {
                value: !0
            }), Object.assign(exports.default, exports), module.exports = exports.default);
        /***/ },
        /***/ 4991: /***/ function(module, exports) {
            "use strict";
            let policy;
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.__unsafeCreateTrustedScriptURL = function(url) {
                var ref;
                return (null == (ref = /**
 * Getter for the Trusted Types Policy. If it is undefined, it is instantiated
 * here or set to null if Trusted Types is not supported in the browser.
 */ function() {
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
            }, ("function" == typeof exports.default || "object" == typeof exports.default && null !== exports.default) && void 0 === exports.default.__esModule && (Object.defineProperty(exports.default, "__esModule", {
                value: !0
            }), Object.assign(exports.default, exports), module.exports = exports.default);
        /***/ },
        /***/ 8981: /***/ function(module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.default = function(ComposedComponent) {
                function WithRouterWrapper(props) {
                    return /*#__PURE__*/ _react.default.createElement(ComposedComponent, Object.assign({
                        router: _router.useRouter()
                    }, props));
                }
                return WithRouterWrapper.getInitialProps = ComposedComponent.getInitialProps, WithRouterWrapper.origGetInitialProps = ComposedComponent.origGetInitialProps, WithRouterWrapper;
            };
            var _react = (0, __webpack_require__(2648)/* ["default"] */ .Z)(__webpack_require__(7294)), _router = __webpack_require__(387);
            ("function" == typeof exports.default || "object" == typeof exports.default && null !== exports.default) && void 0 === exports.default.__esModule && (Object.defineProperty(exports.default, "__esModule", {
                value: !0
            }), Object.assign(exports.default, exports), module.exports = exports.default);
        /***/ },
        /***/ 6029: /***/ function(__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.default = void 0;
            var _Component, _async_to_generator = __webpack_require__(932)/* ["default"] */ .Z, _react = (0, __webpack_require__(2648)/* ["default"] */ .Z)(__webpack_require__(7294)), _utils = __webpack_require__(3794);
            function appGetInitialProps(_) {
                return _appGetInitialProps.apply(this, arguments);
            }
            function _appGetInitialProps() {
                return (_appGetInitialProps = /**
 * `App` component is used for initialize of pages. It allows for overwriting and full control of the `page` initialization.
 * This allows for keeping state between navigation, custom error handling, injecting additional data.
 */ _async_to_generator(function*(param) {
                    let { Component, ctx } = param;
                    return {
                        pageProps: yield _utils.loadGetInitialProps(Component, ctx)
                    };
                })).apply(this, arguments);
            }
            class App extends (_Component = _react.default.Component) {
                render() {
                    const { Component, pageProps } = this.props;
                    return /*#__PURE__*/ _react.default.createElement(Component, Object.assign({}, pageProps));
                }
            }
            App.origGetInitialProps = appGetInitialProps, App.getInitialProps = appGetInitialProps, exports.default = App;
        /***/ },
        /***/ 9185: /***/ function(__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.default = void 0;
            var _Component, _interop_require_default = __webpack_require__(2648)/* ["default"] */ .Z, _react = _interop_require_default(__webpack_require__(7294)), _head = _interop_require_default(__webpack_require__(5443));
            const statusCodes = {
                400: "Bad Request",
                404: "This page could not be found",
                405: "Method Not Allowed",
                500: "Internal Server Error"
            };
            function _getInitialProps(param) {
                let { res, err } = param;
                return {
                    statusCode: res && res.statusCode ? res.statusCode : err ? err.statusCode : 404
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
            class Error1 extends (_Component = _react.default.Component) {
                render() {
                    const { statusCode, withDarkMode = !0 } = this.props, title = this.props.title || statusCodes[statusCode] || "An unexpected error has occurred";
                    return /*#__PURE__*/ _react.default.createElement("div", {
                        style: styles.error
                    }, /*#__PURE__*/ _react.default.createElement(_head.default, null, /*#__PURE__*/ _react.default.createElement("title", null, statusCode ? "".concat(statusCode, ": ").concat(title) : "Application error: a client-side exception has occurred")), /*#__PURE__*/ _react.default.createElement("div", null, /*#__PURE__*/ _react.default.createElement("style", {
                        dangerouslySetInnerHTML: {
                            __html: "\n                body { margin: 0; color: #000; background: #fff; }\n                .next-error-h1 {\n                  border-right: 1px solid rgba(0, 0, 0, .3);\n                }\n\n                ".concat(withDarkMode ? "@media (prefers-color-scheme: dark) {\n                  body { color: #fff; background: #000; }\n                  .next-error-h1 {\n                    border-right: 1px solid rgba(255, 255, 255, .3);\n                  }\n                }" : "")
                        }
                    }), statusCode ? /*#__PURE__*/ _react.default.createElement("h1", {
                        className: "next-error-h1",
                        style: styles.h1
                    }, statusCode) : null, /*#__PURE__*/ _react.default.createElement("div", {
                        style: styles.desc
                    }, /*#__PURE__*/ _react.default.createElement("h2", {
                        style: styles.h2
                    }, this.props.title || statusCode ? title : /*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, "Application error: a client-side exception has occurred (see the browser console for more information)"), "."))));
                }
            }
            Error1.displayName = "ErrorPage", Error1.getInitialProps = _getInitialProps, Error1.origGetInitialProps = _getInitialProps, exports.default = Error1;
        /***/ },
        /***/ 2227: /***/ function(__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.AmpStateContext = void 0;
            const AmpStateContext = (0, __webpack_require__(2648)/* ["default"] */ .Z)(__webpack_require__(7294)).default.createContext({});
            exports.AmpStateContext = AmpStateContext;
        /***/ },
        /***/ 7363: /***/ function(__unused_webpack_module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.isInAmpMode = function() {
                let { ampFirst = !1, hybrid = !1, hasQuery = !1 } = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                return ampFirst || hybrid && hasQuery;
            } //# sourceMappingURL=amp-mode.js.map
            ;
        /***/ },
        /***/ 489: /***/ function(__unused_webpack_module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.escapeStringRegexp = function(str) {
                return(// see also: https://github.com/lodash/lodash/blob/2da024c3b4f9947a48517639de7560457cd4ec6c/escapeRegExp.js#L23
                reHasRegExp.test(str) ? str.replace(reReplaceRegExp, "\\$&") : str);
            } //# sourceMappingURL=escape-regexp.js.map
            ;
            // regexp is based on https://github.com/sindresorhus/escape-string-regexp
            const reHasRegExp = /[|\\{}()[\]^$+*?.-]/, reReplaceRegExp = /[|\\{}()[\]^$+*?.-]/g;
        /***/ },
        /***/ 8404: /***/ function(__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.HeadManagerContext = void 0;
            const HeadManagerContext = (0, __webpack_require__(2648)/* ["default"] */ .Z)(__webpack_require__(7294)).default.createContext({});
            exports.HeadManagerContext = HeadManagerContext;
        /***/ },
        /***/ 5443: /***/ function(module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.defaultHead = defaultHead, exports.default = void 0;
            var _extends = __webpack_require__(6495)/* ["default"] */ .Z, _interop_require_default = __webpack_require__(2648)/* ["default"] */ .Z, _react = (0, __webpack_require__(1598)/* ["default"] */ .Z)(__webpack_require__(7294)), _sideEffect = _interop_require_default(__webpack_require__(5188)), _ampContext = __webpack_require__(2227), _headManagerContext = __webpack_require__(8404), _ampMode = __webpack_require__(7363);
            function defaultHead() {
                let inAmpMode = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
                const head = [
                    /*#__PURE__*/ _react.default.createElement("meta", {
                        charSet: "utf-8"
                    })
                ];
                return inAmpMode || head.push(/*#__PURE__*/ _react.default.createElement("meta", {
                    name: "viewport",
                    content: "width=device-width"
                })), head;
            }
            function onlyReactElement(list, child) {
                return(// React children can be "string" or "number" in this case we ignore them for backwards compat
                "string" == typeof child || "number" == typeof child ? list : child.type === _react.default.Fragment ? list.concat(_react.default.Children.toArray(child.props.children).reduce((fragmentList, fragmentChild)=>"string" == typeof fragmentChild || "number" == typeof fragmentChild ? fragmentList : fragmentList.concat(fragmentChild), [])) : list.concat(child));
            }
            __webpack_require__(3794);
            const METATYPES = [
                "name",
                "httpEquiv",
                "charSet",
                "itemProp"
            ];
            /**
 *
 * @param headChildrenElements List of children of <Head>
 */ function reduceComponents(headChildrenElements, props) {
                const { inAmpMode } = props;
                return headChildrenElements.reduce(onlyReactElement, []).reverse().concat(defaultHead(inAmpMode).reverse()).filter(/*
 returns a function for filtering head child elements
 which shouldn't be duplicated, like <title/>
 Also adds support for deduplicated `key` properties
*/ function() {
                    const keys = new Set(), tags = new Set(), metaTypes = new Set(), metaCategories = {};
                    return (h)=>{
                        let isUnique = !0, hasKey = !1;
                        if (h.key && "number" != typeof h.key && h.key.indexOf("$") > 0) {
                            hasKey = !0;
                            const key = h.key.slice(h.key.indexOf("$") + 1);
                            keys.has(key) ? isUnique = !1 : keys.add(key);
                        }
                        // eslint-disable-next-line default-case
                        switch(h.type){
                            case "title":
                            case "base":
                                tags.has(h.type) ? isUnique = !1 : tags.add(h.type);
                                break;
                            case "meta":
                                for(let i = 0, len = METATYPES.length; i < len; i++){
                                    const metatype = METATYPES[i];
                                    if (h.props.hasOwnProperty(metatype)) {
                                        if ("charSet" === metatype) metaTypes.has(metatype) ? isUnique = !1 : metaTypes.add(metatype);
                                        else {
                                            const category = h.props[metatype], categories = metaCategories[metatype] || new Set();
                                            ("name" !== metatype || !hasKey) && categories.has(category) ? isUnique = !1 : (categories.add(category), metaCategories[metatype] = categories);
                                        }
                                    }
                                }
                        }
                        return isUnique;
                    };
                }()).reverse().map((c, i)=>{
                    const key = c.key || i;
                    if (!inAmpMode && "link" === c.type && c.props.href && // TODO(prateekbh@): Replace this with const from `constants` when the tree shaking works.
                    [
                        "https://fonts.googleapis.com/css",
                        "https://use.typekit.net/"
                    ].some((url)=>c.props.href.startsWith(url))) {
                        const newProps = _extends({}, c.props || {});
                        return newProps["data-href"] = newProps.href, newProps.href = void 0, // Add this attribute to make it easy to identify optimized tags
                        newProps["data-optimized-fonts"] = !0, /*#__PURE__*/ _react.default.cloneElement(c, newProps);
                    }
                    return /*#__PURE__*/ _react.default.cloneElement(c, {
                        key
                    });
                });
            }
            exports.default = /**
 * This component injects elements to `<head>` of your page.
 * To avoid duplicated `tags` in `<head>` you can use the `key` property, which will make sure every tag is only rendered once.
 */ function(param) {
                let { children } = param;
                const ampState = _react.useContext(_ampContext.AmpStateContext), headManager = _react.useContext(_headManagerContext.HeadManagerContext);
                return /*#__PURE__*/ _react.default.createElement(_sideEffect.default, {
                    reduceComponentsToState: reduceComponents,
                    headManager: headManager,
                    inAmpMode: _ampMode.isInAmpMode(ampState)
                }, children);
            }, ("function" == typeof exports.default || "object" == typeof exports.default && null !== exports.default) && void 0 === exports.default.__esModule && (Object.defineProperty(exports.default, "__esModule", {
                value: !0
            }), Object.assign(exports.default, exports), module.exports = exports.default);
        /***/ },
        /***/ 4317: /***/ function(__unused_webpack_module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.normalizeLocalePath = function(pathname, locales) {
                let detectedLocale;
                // first item will be empty string from splitting at first char
                const pathnameParts = pathname.split("/");
                return (locales || []).some((locale)=>!!pathnameParts[1] && pathnameParts[1].toLowerCase() === locale.toLowerCase() && (detectedLocale = locale, pathnameParts.splice(1, 1), pathname = pathnameParts.join("/") || "/", !0)), {
                    pathname,
                    detectedLocale
                };
            } //# sourceMappingURL=normalize-locale-path.js.map
            ;
        /***/ },
        /***/ 9977: /***/ function(__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.ImageConfigContext = void 0;
            var _react = (0, __webpack_require__(2648)/* ["default"] */ .Z)(__webpack_require__(7294)), _imageConfig = __webpack_require__(9309);
            const ImageConfigContext = _react.default.createContext(_imageConfig.imageConfigDefault);
            exports.ImageConfigContext = ImageConfigContext;
        /***/ },
        /***/ 9309: /***/ function(__unused_webpack_module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.imageConfigDefault = exports.VALID_LOADERS = void 0, exports.VALID_LOADERS = [
                "default",
                "imgix",
                "cloudinary",
                "akamai",
                "custom"
            ], exports.imageConfigDefault = {
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
                domains: [],
                disableStaticImages: !1,
                minimumCacheTTL: 60,
                formats: [
                    "image/webp"
                ],
                dangerouslyAllowSVG: !1,
                contentSecurityPolicy: "script-src 'none'; frame-src 'none'; sandbox;",
                remotePatterns: [],
                unoptimized: !1
            };
        /***/ },
        /***/ 8887: /***/ function(__unused_webpack_module, exports) {
            "use strict";
            function getObjectClassLabel(value) {
                return Object.prototype.toString.call(value);
            }
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.getObjectClassLabel = getObjectClassLabel, exports.isPlainObject = function(value) {
                if ("[object Object]" !== getObjectClassLabel(value)) return !1;
                const prototype = Object.getPrototypeOf(value);
                /**
   * this used to be previously:
   *
   * `return prototype === null || prototype === Object.prototype`
   *
   * but Edge Runtime expose Object from vm, being that kind of type-checking wrongly fail.
   *
   * It was changed to the current implementation since it's resilient to serialization.
   */ return null === prototype || prototype.hasOwnProperty("isPrototypeOf");
            } //# sourceMappingURL=is-plain-object.js.map
            ;
        /***/ },
        /***/ 5660: /***/ function(__unused_webpack_module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.default = function() {
                const all = Object.create(null);
                return {
                    on (type, handler) {
                        (all[type] || (all[type] = [])).push(handler);
                    },
                    off (type, handler) {
                        all[type] && all[type].splice(all[type].indexOf(handler) >>> 0, 1);
                    },
                    emit (type) {
                        for(var _len = arguments.length, evts = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++)evts[_key - 1] = arguments[_key];
                        (all[type] || []).slice().map((handler)=>{
                            handler(...evts);
                        });
                    }
                };
            } //# sourceMappingURL=mitt.js.map
            ;
        /***/ },
        /***/ 8317: /***/ function(__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.denormalizePagePath = function(page) {
                let _page = _normalizePathSep.normalizePathSep(page);
                return _page.startsWith("/index/") && !_utils.isDynamicRoute(_page) ? _page.slice(6) : "/index" !== _page ? _page : "/";
            } //# sourceMappingURL=denormalize-page-path.js.map
            ;
            var _utils = __webpack_require__(418), _normalizePathSep = __webpack_require__(9892);
        /***/ },
        /***/ 9892: /***/ function(__unused_webpack_module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.normalizePathSep = function(path) {
                return path.replace(/\\/g, "/");
            } //# sourceMappingURL=normalize-path-sep.js.map
            ;
        /***/ },
        /***/ 3462: /***/ function(__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.RouterContext = void 0;
            const RouterContext = (0, __webpack_require__(2648)/* ["default"] */ .Z)(__webpack_require__(7294)).default.createContext(null);
            exports.RouterContext = RouterContext;
        /***/ },
        /***/ 6273: /***/ function(__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.matchesMiddleware = matchesMiddleware, exports.isLocalURL = isLocalURL, exports.interpolateAs = interpolateAs, exports.resolveHref = resolveHref, exports.createKey = createKey, exports.default = void 0;
            var _async_to_generator = __webpack_require__(932)/* ["default"] */ .Z, _extends = __webpack_require__(6495)/* ["default"] */ .Z, _interop_require_default = __webpack_require__(2648)/* ["default"] */ .Z, _interop_require_wildcard = __webpack_require__(1598)/* ["default"] */ .Z, _normalizeTrailingSlash = __webpack_require__(2392), _removeTrailingSlash = __webpack_require__(6316), _routeLoader = __webpack_require__(2669), _script = __webpack_require__(699), _isError = _interop_require_wildcard(__webpack_require__(676)), _denormalizePagePath = __webpack_require__(8317), _normalizeLocalePath = __webpack_require__(4317), _mitt = _interop_require_default(__webpack_require__(5660)), _utils = __webpack_require__(3794), _isDynamic = __webpack_require__(8689), _parseRelativeUrl = __webpack_require__(6305), _querystring = __webpack_require__(466);
            _interop_require_default(__webpack_require__(2431));
            var _routeMatcher = __webpack_require__(3888), _routeRegex = __webpack_require__(4095), _formatUrl = __webpack_require__(4611);
            __webpack_require__(8748);
            var _parsePath = __webpack_require__(4943), _addLocale = __webpack_require__(2725), _removeLocale = __webpack_require__(5776), _removeBasePath = __webpack_require__(9320), _addBasePath = __webpack_require__(8684), _hasBasePath = __webpack_require__(4119), _getNextPathnameInfo = __webpack_require__(159), _formatNextPathnameInfo = __webpack_require__(4022), _compareStates = __webpack_require__(610), _isBot = __webpack_require__(9671);
            function buildCancellationError() {
                return Object.assign(Error("Route Cancelled"), {
                    cancelled: !0
                });
            }
            function matchesMiddleware(options) {
                return _matchesMiddleware.apply(this, arguments);
            }
            function _matchesMiddleware() {
                return (_matchesMiddleware = _async_to_generator(function*(options) {
                    const matchers = yield Promise.resolve(options.router.pageLoader.getMiddleware());
                    if (!matchers) return !1;
                    const { pathname: asPathname } = _parsePath.parsePath(options.asPath), cleanedAs = _hasBasePath.hasBasePath(asPathname) ? _removeBasePath.removeBasePath(asPathname) : asPathname, asWithBasePathAndLocale = _addBasePath.addBasePath(_addLocale.addLocale(cleanedAs, options.locale));
                    // Check only path match on client. Matching "has" should be done on server
                    // where we can access more info such as headers, HttpOnly cookie, etc.
                    return matchers.some((m)=>new RegExp(m.regexp).test(asWithBasePathAndLocale));
                })).apply(this, arguments);
            }
            function stripOrigin(url) {
                const origin = _utils.getLocationOrigin();
                return url.startsWith(origin) ? url.substring(origin.length) : url;
            }
            function omit(object, keys) {
                const omitted = {};
                return Object.keys(object).forEach((key)=>{
                    keys.includes(key) || (omitted[key] = object[key]);
                }), omitted;
            }
            function isLocalURL(url) {
                // prevent a hydration mismatch on href for url with anchor refs
                if (!_utils.isAbsoluteUrl(url)) return !0;
                try {
                    // absolute urls can be local if they are on the same origin
                    const locationOrigin = _utils.getLocationOrigin(), resolved = new URL(url, locationOrigin);
                    return resolved.origin === locationOrigin && _hasBasePath.hasBasePath(resolved.pathname);
                } catch (_) {
                    return !1;
                }
            }
            function interpolateAs(route, asPathname, query) {
                let interpolatedRoute = "";
                const dynamicRegex = _routeRegex.getRouteRegex(route), dynamicGroups = dynamicRegex.groups, dynamicMatches = (asPathname !== route ? _routeMatcher.getRouteMatcher(dynamicRegex)(asPathname) : "") || // Fall back to reading the values from the href
                // TODO: should this take priority; also need to change in the router.
                query;
                interpolatedRoute = route;
                const params = Object.keys(dynamicGroups);
                return params.every((param)=>{
                    let value = dynamicMatches[param] || "";
                    const { repeat, optional } = dynamicGroups[param];
                    // support single-level catch-all
                    // TODO: more robust handling for user-error (passing `/`)
                    let replaced = "[".concat(repeat ? "..." : "").concat(param, "]");
                    return optional && (replaced = "".concat(value ? "" : "/", "[").concat(replaced, "]")), repeat && !Array.isArray(value) && (value = [
                        value
                    ]), (optional || param in dynamicMatches) && // Interpolate group into data URL if present
                    (interpolatedRoute = interpolatedRoute.replace(replaced, repeat ? value.map(// into the URL and we expect URL encoded segments
                    // when parsing dynamic route params
                    (segment)=>encodeURIComponent(segment)).join("/") : encodeURIComponent(value)) || "/");
                }) || (interpolatedRoute = "" // did not satisfy all requirements
                ), {
                    params,
                    result: interpolatedRoute
                };
            }
            function resolveHref(router, href, resolveAs) {
                let base;
                let urlAsString = "string" == typeof href ? href : _formatUrl.formatWithValidation(href);
                // repeated slashes and backslashes in the URL are considered
                // invalid and will never match a Next.js page/file
                const urlProtoMatch = urlAsString.match(/^[a-zA-Z]{1,}:\/\//), urlAsStringNoProto = urlProtoMatch ? urlAsString.slice(urlProtoMatch[0].length) : urlAsString;
                if ((urlAsStringNoProto.split("?")[0] || "").match(/(\/\/|\\)/)) {
                    console.error("Invalid href passed to next/router: ".concat(urlAsString, ", repeated forward-slashes (//) or backslashes \\ are not valid in the href"));
                    const normalizedUrl = _utils.normalizeRepeatedSlashes(urlAsStringNoProto);
                    urlAsString = (urlProtoMatch ? urlProtoMatch[0] : "") + normalizedUrl;
                }
                // Return because it cannot be routed by the Next.js router
                if (!isLocalURL(urlAsString)) return resolveAs ? [
                    urlAsString
                ] : urlAsString;
                try {
                    base = new URL(urlAsString.startsWith("#") ? router.asPath : router.pathname, "http://n");
                } catch (_) {
                    // fallback to / for invalid asPath values e.g. //
                    base = new URL("/", "http://n");
                }
                try {
                    const finalUrl = new URL(urlAsString, base);
                    finalUrl.pathname = _normalizeTrailingSlash.normalizePathTrailingSlash(finalUrl.pathname);
                    let interpolatedAs = "";
                    if (_isDynamic.isDynamicRoute(finalUrl.pathname) && finalUrl.searchParams && resolveAs) {
                        const query = _querystring.searchParamsToUrlQuery(finalUrl.searchParams), { result, params } = interpolateAs(finalUrl.pathname, finalUrl.pathname, query);
                        result && (interpolatedAs = _formatUrl.formatWithValidation({
                            pathname: result,
                            hash: finalUrl.hash,
                            query: omit(query, params)
                        }));
                    }
                    // if the origin didn't change, it means we received a relative href
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
                // If url and as provided as an object representation,
                // we'll format them into the string version here.
                let [resolvedHref, resolvedAs] = resolveHref(router, url, !0);
                const origin = _utils.getLocationOrigin(), hrefHadOrigin = resolvedHref.startsWith(origin), asHadOrigin = resolvedAs && resolvedAs.startsWith(origin);
                resolvedHref = stripOrigin(resolvedHref), resolvedAs = resolvedAs ? stripOrigin(resolvedAs) : resolvedAs;
                const preparedUrl = hrefHadOrigin ? resolvedHref : _addBasePath.addBasePath(resolvedHref), preparedAs = as ? stripOrigin(resolveHref(router, as)) : resolvedAs || resolvedHref;
                return {
                    url: preparedUrl,
                    as: asHadOrigin ? preparedAs : _addBasePath.addBasePath(preparedAs)
                };
            }
            function resolveDynamicRoute(pathname, pages) {
                const cleanPathname = _removeTrailingSlash.removeTrailingSlash(_denormalizePagePath.denormalizePagePath(pathname));
                return "/404" === cleanPathname || "/_error" === cleanPathname ? pathname : (pages.includes(cleanPathname) || // eslint-disable-next-line array-callback-return
                pages.some((page)=>{
                    if (_isDynamic.isDynamicRoute(page) && _routeRegex.getRouteRegex(page).re.test(cleanPathname)) return pathname = page, !0;
                }), _removeTrailingSlash.removeTrailingSlash(pathname));
            }
            const SSG_DATA_NOT_FOUND = Symbol("SSG_DATA_NOT_FOUND"), backgroundCache = {};
            function handleSmoothScroll(fn) {
                const htmlElement = document.documentElement, existing = htmlElement.style.scrollBehavior;
                htmlElement.style.scrollBehavior = "auto", fn(), htmlElement.style.scrollBehavior = existing;
            }
            function tryToParseAsJSON(text) {
                try {
                    return JSON.parse(text);
                } catch (error) {
                    return null;
                }
            }
            function fetchNextData(param) {
                var ref1;
                let { dataHref, inflightCache, isPrefetch, hasMiddleware, isServerRender, parseJSON, persistCache, isBackground, unstable_skipClientCache } = param;
                const { href: cacheKey } = new URL(dataHref, window.location.href), getData = (params)=>(function fetchRetry(url, attempts, options) {
                        return fetch(url, {
                            // Cookies are required to be present for Next.js' SSG "Preview Mode".
                            // Cookies may also be required for `getServerSideProps`.
                            //
                            // > `fetch` won’t send cookies, unless you set the credentials init
                            // > option.
                            // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
                            //
                            // > For maximum browser compatibility when it comes to sending &
                            // > receiving cookies, always supply the `credentials: 'same-origin'`
                            // > option instead of relying on the default.
                            // https://github.com/github/fetch#caveats
                            credentials: "same-origin",
                            method: options.method || "GET",
                            headers: Object.assign({}, options.headers, {
                                "x-nextjs-data": "1"
                            })
                        }).then((response)=>!response.ok && attempts > 1 && response.status >= 500 ? fetchRetry(url, attempts - 1, options) : response);
                    })(dataHref, isServerRender ? 3 : 1, {
                        headers: isPrefetch ? {
                            purpose: "prefetch"
                        } : {},
                        method: null != (ref1 = null == params ? void 0 : params.method) ? ref1 : "GET"
                    }).then((response)=>response.ok && (null == params ? void 0 : params.method) === "HEAD" ? {
                            dataHref,
                            response,
                            text: "",
                            json: {},
                            cacheKey
                        } : response.text().then((text)=>{
                            if (!response.ok) {
                                /**
             * When the data response is a redirect because of a middleware
             * we do not consider it an error. The headers must bring the
             * mapped location.
             * TODO: Change the status code in the handler.
             */ if (hasMiddleware && [
                                    301,
                                    302,
                                    307,
                                    308
                                ].includes(response.status)) return {
                                    dataHref,
                                    response,
                                    text,
                                    json: {},
                                    cacheKey
                                };
                                if (!hasMiddleware && 404 === response.status) {
                                    var ref;
                                    if (null == (ref = tryToParseAsJSON(text)) ? void 0 : ref.notFound) return {
                                        dataHref,
                                        json: {
                                            notFound: SSG_DATA_NOT_FOUND
                                        },
                                        response,
                                        text,
                                        cacheKey
                                    };
                                }
                                const error = Error("Failed to load static props");
                                throw isServerRender || _routeLoader.markAssetError(error), error;
                            }
                            return {
                                dataHref,
                                json: parseJSON ? tryToParseAsJSON(text) : null,
                                response,
                                text,
                                cacheKey
                            };
                        })).then((data)=>(persistCache && "no-cache" !== data.response.headers.get("x-middleware-cache") || delete inflightCache[cacheKey], data)).catch((err)=>{
                        throw delete inflightCache[cacheKey], err;
                    });
                return(// when skipping client cache we wait to update
                // inflight cache until successful data response
                // this allows racing click event with fetching newer data
                // without blocking navigation when stale data is available
                unstable_skipClientCache && persistCache ? getData({}).then((data)=>(inflightCache[cacheKey] = Promise.resolve(data), data)) : void 0 !== inflightCache[cacheKey] ? inflightCache[cacheKey] : inflightCache[cacheKey] = getData(isBackground ? {
                    method: "HEAD"
                } : {}));
            }
            function createKey() {
                return Math.random().toString(36).slice(2, 10);
            }
            function handleHardNavigation(param) {
                let { url, router } = param;
                // ensure we don't trigger a hard navigation to the same
                // URL as this can end up with an infinite refresh
                if (url === _addBasePath.addBasePath(_addLocale.addLocale(router.asPath, router.locale))) throw Error("Invariant: attempted to hard navigate to the same URL ".concat(url, " ").concat(location.href));
                window.location.href = url;
            }
            const getCancelledHandler = (param)=>{
                let { route, router } = param, cancelled = !1;
                const cancel = router.clc = ()=>{
                    cancelled = !0;
                };
                return ()=>{
                    if (cancelled) {
                        const error = Error('Abort fetching component for route: "'.concat(route, '"'));
                        throw error.cancelled = !0, error;
                    }
                    cancel === router.clc && (router.clc = null);
                };
            };
            class Router {
                reload() {
                    window.location.reload();
                }
                /**
   * Go back in history
   */ back() {
                    window.history.back();
                }
                /**
   * Performs a `pushState` with arguments
   * @param url of the route
   * @param as masks `url` for the browser
   * @param options object you can define `shallow` and other options
   */ push(url, as) {
                    let options = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
                    return { url, as } = prepareUrlAs(this, url, as), this.change("pushState", url, as, options);
                }
                /**
   * Performs a `replaceState` with arguments
   * @param url of the route
   * @param as masks `url` for the browser
   * @param options object you can define `shallow` and other options
   */ replace(url, as) {
                    let options = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
                    return { url, as } = prepareUrlAs(this, url, as), this.change("replaceState", url, as, options);
                }
                change(method, url, as, options, forcedScroll) {
                    var _this = this;
                    return _async_to_generator(function*() {
                        let pages, rewrites;
                        if (!isLocalURL(url)) return handleHardNavigation({
                            url,
                            router: _this
                        }), !1;
                        // WARNING: `_h` is an internal option for handing Next.js client-side
                        // hydration. Your app should _never_ use this property. It may change at
                        // any time without notice.
                        const isQueryUpdating = options._h, shouldResolveHref = isQueryUpdating || options._shouldResolveHref || _parsePath.parsePath(url).pathname === _parsePath.parsePath(as).pathname, nextState = _extends({}, _this.state), readyStateChange = !0 !== _this.isReady;
                        _this.isReady = !0;
                        const isSsr = _this.isSsr;
                        // if a route transition is already in progress before
                        // the query updating is triggered ignore query updating
                        if (isQueryUpdating || (_this.isSsr = !1), isQueryUpdating && _this.clc) return !1;
                        const prevLocale = nextState.locale;
                        _utils.ST && performance.mark("routeChange");
                        const { shallow = !1, scroll = !0 } = options, routeProps = {
                            shallow
                        };
                        _this._inFlightRoute && _this.clc && (isSsr || Router.events.emit("routeChangeError", buildCancellationError(), _this._inFlightRoute, routeProps), _this.clc(), _this.clc = null), as = _addBasePath.addBasePath(_addLocale.addLocale(_hasBasePath.hasBasePath(as) ? _removeBasePath.removeBasePath(as) : as, options.locale, _this.defaultLocale));
                        const cleanedAs = _removeLocale.removeLocale(_hasBasePath.hasBasePath(as) ? _removeBasePath.removeBasePath(as) : as, nextState.locale);
                        _this._inFlightRoute = as;
                        const localeChange = prevLocale !== nextState.locale;
                        // If the url change is only related to a hash change
                        // We should not proceed. We should only change the state.
                        if (!isQueryUpdating && _this.onlyAHashChange(cleanedAs) && !localeChange) {
                            nextState.asPath = cleanedAs, Router.events.emit("hashChangeStart", as, routeProps), // TODO: do we need the resolved href when only a hash change?
                            _this.changeState(method, url, as, _extends({}, options, {
                                scroll: !1
                            })), scroll && _this.scrollToHash(cleanedAs);
                            try {
                                yield _this.set(nextState, _this.components[nextState.route], null);
                            } catch (err) {
                                throw _isError.default(err) && err.cancelled && Router.events.emit("routeChangeError", err, cleanedAs, routeProps), err;
                            }
                            return Router.events.emit("hashChangeComplete", as, routeProps), !0;
                        }
                        let parsed = _parseRelativeUrl.parseRelativeUrl(url), { pathname, query } = parsed;
                        try {
                            [pages, { __rewrites: rewrites }] = yield Promise.all([
                                _this.pageLoader.getPageList(),
                                _routeLoader.getClientBuildManifest(),
                                _this.pageLoader.getMiddleware()
                            ]);
                        } catch (err1) {
                            return(// If we fail to resolve the page list or client-build manifest, we must
                            // do a server-side transition:
                            handleHardNavigation({
                                url: as,
                                router: _this
                            }), !1);
                        }
                        _this.urlIsNew(cleanedAs) || localeChange || (method = "replaceState");
                        // we need to resolve the as value using rewrites for dynamic SSG
                        // pages to allow building the data URL correctly
                        let resolvedAs = as;
                        // url and as should always be prefixed with basePath by this
                        // point by either next/link or router.push/replace so strip the
                        // basePath from the pathname to match the pages dir 1-to-1
                        pathname = pathname ? _removeTrailingSlash.removeTrailingSlash(_removeBasePath.removeBasePath(pathname)) : pathname;
                        // we don't attempt resolve asPath when we need to execute
                        // middleware as the resolving will occur server-side
                        const isMiddlewareMatch = yield matchesMiddleware({
                            asPath: as,
                            locale: nextState.locale,
                            router: _this
                        });
                        if (options.shallow && isMiddlewareMatch && (pathname = _this.pathname), shouldResolveHref && "/_error" !== pathname && (options._shouldResolveHref = !0, parsed.pathname = resolveDynamicRoute(pathname, pages), parsed.pathname === pathname || (pathname = parsed.pathname, parsed.pathname = _addBasePath.addBasePath(pathname), isMiddlewareMatch || (url = _formatUrl.formatWithValidation(parsed)))), !isLocalURL(as)) return handleHardNavigation({
                            url: as,
                            router: _this
                        }), !1;
                        resolvedAs = _removeLocale.removeLocale(_removeBasePath.removeBasePath(resolvedAs), nextState.locale);
                        let route = _removeTrailingSlash.removeTrailingSlash(pathname), routeMatch = !1;
                        if (_isDynamic.isDynamicRoute(route)) {
                            const parsedAs1 = _parseRelativeUrl.parseRelativeUrl(resolvedAs), asPathname = parsedAs1.pathname, routeRegex = _routeRegex.getRouteRegex(route);
                            routeMatch = _routeMatcher.getRouteMatcher(routeRegex)(asPathname);
                            const shouldInterpolate = route === asPathname, interpolatedAs = shouldInterpolate ? interpolateAs(route, asPathname, query) : {};
                            if (routeMatch && (!shouldInterpolate || interpolatedAs.result)) shouldInterpolate ? as = _formatUrl.formatWithValidation(Object.assign({}, parsedAs1, {
                                pathname: interpolatedAs.result,
                                query: omit(query, interpolatedAs.params)
                            })) : // Merge params into `query`, overwriting any specified in search
                            Object.assign(query, routeMatch);
                            else {
                                const missingParams = Object.keys(routeRegex.groups).filter((param)=>!query[param]);
                                if (missingParams.length > 0 && !isMiddlewareMatch) throw Error((shouldInterpolate ? "The provided `href` (".concat(url, ") value is missing query values (").concat(missingParams.join(", "), ") to be interpolated properly. ") : "The provided `as` value (".concat(asPathname, ") is incompatible with the `href` value (").concat(route, "). ")) + "Read more: https://nextjs.org/docs/messages/".concat(shouldInterpolate ? "href-interpolation-failed" : "incompatible-href-as"));
                            }
                        }
                        isQueryUpdating || Router.events.emit("routeChangeStart", as, routeProps);
                        try {
                            var ref2, ref3, _route, _scroll;
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
                                route = pathname = routeInfo.route || route, routeProps.shallow || (query = Object.assign({}, routeInfo.query || {}, query));
                                const cleanedParsedPathname = _hasBasePath.hasBasePath(parsed.pathname) ? _removeBasePath.removeBasePath(parsed.pathname) : parsed.pathname;
                                if (routeMatch && pathname !== cleanedParsedPathname && Object.keys(routeMatch).forEach((key)=>{
                                    routeMatch && query[key] === routeMatch[key] && delete query[key];
                                }), _isDynamic.isDynamicRoute(pathname)) {
                                    let rewriteAs = !routeProps.shallow && routeInfo.resolvedAs ? routeInfo.resolvedAs : _addBasePath.addBasePath(_addLocale.addLocale(new URL(as, location.href).pathname, nextState.locale), !0);
                                    _hasBasePath.hasBasePath(rewriteAs) && (rewriteAs = _removeBasePath.removeBasePath(rewriteAs));
                                    const routeRegex1 = _routeRegex.getRouteRegex(pathname), curRouteMatch = _routeMatcher.getRouteMatcher(routeRegex1)(rewriteAs);
                                    curRouteMatch && Object.assign(query, curRouteMatch);
                                }
                            }
                            // If the routeInfo brings a redirect we simply apply it.
                            if ("type" in routeInfo) {
                                if ("redirect-internal" === routeInfo.type) return _this.change(method, routeInfo.newUrl, routeInfo.newAs, options);
                                return handleHardNavigation({
                                    url: routeInfo.destination,
                                    router: _this
                                }), new Promise(()=>{});
                            }
                            let { error, props, __N_SSG, __N_SSP } = routeInfo;
                            const component = routeInfo.Component;
                            // handle redirect on client-transition
                            if (component && component.unstable_scriptLoader && [].concat(component.unstable_scriptLoader()).forEach((script)=>{
                                _script.handleClientScriptLoad(script.props);
                            }), (__N_SSG || __N_SSP) && props) {
                                if (props.pageProps && props.pageProps.__N_REDIRECT) {
                                    // Use the destination from redirect without adding locale
                                    options.locale = !1;
                                    const destination = props.pageProps.__N_REDIRECT;
                                    // check if destination is internal (resolves to a page) and attempt
                                    // client-navigation if it is falling back to hard navigation if
                                    // it's not
                                    if (destination.startsWith("/") && !1 !== props.pageProps.__N_REDIRECT_BASE_PATH) {
                                        const parsedHref = _parseRelativeUrl.parseRelativeUrl(destination);
                                        parsedHref.pathname = resolveDynamicRoute(parsedHref.pathname, pages);
                                        const { url: newUrl, as: newAs } = prepareUrlAs(_this, destination, destination);
                                        return _this.change(method, newUrl, newAs, options);
                                    }
                                    return handleHardNavigation({
                                        url: destination,
                                        router: _this
                                    }), new Promise(()=>{});
                                }
                                // handle SSG data 404
                                if (nextState.isPreview = !!props.__N_PREVIEW, props.notFound === SSG_DATA_NOT_FOUND) {
                                    let notFoundRoute;
                                    try {
                                        yield _this.fetchComponent("/404"), notFoundRoute = "/404";
                                    } catch (_) {
                                        notFoundRoute = "/_error";
                                    }
                                    if (routeInfo = yield _this.getRouteInfo({
                                        route: notFoundRoute,
                                        pathname: notFoundRoute,
                                        query,
                                        as,
                                        resolvedAs,
                                        routeProps: {
                                            shallow: !1
                                        },
                                        locale: nextState.locale,
                                        isPreview: nextState.isPreview
                                    }), "type" in routeInfo) throw Error("Unexpected middleware effect on /404");
                                }
                            }
                            Router.events.emit("beforeHistoryChange", as, routeProps), _this.changeState(method, url, as, options), isQueryUpdating && "/_error" === pathname && (null == (ref2 = self.__NEXT_DATA__.props) ? void 0 : null == (ref3 = ref2.pageProps) ? void 0 : ref3.statusCode) === 500 && (null == props ? void 0 : props.pageProps) && // ensure statusCode is still correct for static 500 page
                            // when updating query information
                            (props.pageProps.statusCode = 500);
                            // shallow routing is only allowed for same page URL changes.
                            const isValidShallowRoute = options.shallow && nextState.route === (null != (_route = routeInfo.route) ? _route : route), shouldScroll = null != (_scroll = options.scroll) ? _scroll : !options._h && !isValidShallowRoute, upcomingRouterState = _extends({}, nextState, {
                                route,
                                pathname,
                                query,
                                asPath: cleanedAs,
                                isFallback: !1
                            }), upcomingScrollState = null != forcedScroll ? forcedScroll : shouldScroll ? {
                                x: 0,
                                y: 0
                            } : null;
                            if (!(options._h && !upcomingScrollState && !readyStateChange && !localeChange && _compareStates.compareRouterStates(upcomingRouterState, _this.state))) {
                                if (yield _this.set(upcomingRouterState, routeInfo, upcomingScrollState).catch((e)=>{
                                    if (e.cancelled) error = error || e;
                                    else throw e;
                                }), error) throw isQueryUpdating || Router.events.emit("routeChangeError", error, cleanedAs, routeProps), error;
                                isQueryUpdating || Router.events.emit("routeChangeComplete", as, routeProps), shouldScroll && /#.+$/.test(as) && _this.scrollToHash(as);
                            }
                            return !0;
                        } catch (err11) {
                            if (_isError.default(err11) && err11.cancelled) return !1;
                            throw err11;
                        }
                    })();
                }
                changeState(method, url, as) {
                    let options = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {};
                    ("pushState" !== method || _utils.getURL() !== as) && (this._shallow = options.shallow, window.history[method]({
                        url,
                        as,
                        options,
                        __N: !0,
                        key: this._key = "pushState" !== method ? this._key : createKey()
                    }, // https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState
                    "", as));
                }
                handleRouteInfoError(err, pathname, query, as, routeProps, loadErrorFail) {
                    var _this = this;
                    return _async_to_generator(function*() {
                        if (console.error(err), err.cancelled) // bubble up cancellation errors
                        throw err;
                        if (_routeLoader.isAssetError(err) || loadErrorFail) // Changing the URL doesn't block executing the current code path.
                        // So let's throw a cancellation error stop the routing logic.
                        throw Router.events.emit("routeChangeError", err, as, routeProps), // If we can't load the page it could be one of following reasons
                        //  1. Page doesn't exists
                        //  2. Page does exist in a different zone
                        //  3. Internal error while loading the page
                        // So, doing a hard reload is the proper way to deal with this.
                        handleHardNavigation({
                            url: as,
                            router: _this
                        }), buildCancellationError();
                        try {
                            let props;
                            const { page: Component, styleSheets } = yield _this.fetchComponent("/_error"), routeInfo = {
                                props,
                                Component,
                                styleSheets,
                                err,
                                error: err
                            };
                            if (!routeInfo.props) try {
                                routeInfo.props = yield _this.getInitialProps(Component, {
                                    err,
                                    pathname,
                                    query
                                });
                            } catch (gipErr) {
                                console.error("Error in error page `getInitialProps`: ", gipErr), routeInfo.props = {};
                            }
                            return routeInfo;
                        } catch (routeInfoErr) {
                            return _this.handleRouteInfoError(_isError.default(routeInfoErr) ? routeInfoErr : Error(routeInfoErr + ""), pathname, query, as, routeProps, !0);
                        }
                    })();
                }
                getRouteInfo(param) {
                    let { route: requestedRoute, pathname, query, as, resolvedAs, routeProps, locale, hasMiddleware, isPreview, unstable_skipClientCache, isQueryUpdating } = param;
                    var _this = this;
                    return _async_to_generator(function*() {
                        /**
     * This `route` binding can change if there's a rewrite
     * so we keep a reference to the original requested route
     * so we can store the cache for it and avoid re-requesting every time
     * for shallow routing purposes.
     */ let route = requestedRoute;
                        try {
                            var ref, ref4, ref5, options;
                            const handleCancelled = getCancelledHandler({
                                route,
                                router: _this
                            });
                            let existingInfo = _this.components[route];
                            if (routeProps.shallow && existingInfo && _this.route === route) return existingInfo;
                            hasMiddleware && (existingInfo = void 0);
                            let cachedRouteInfo = !existingInfo || "initial" in existingInfo ? void 0 : existingInfo;
                            const fetchNextDataParams = {
                                dataHref: _this.pageLoader.getDataHref({
                                    href: _formatUrl.formatWithValidation({
                                        pathname,
                                        query
                                    }),
                                    skipInterpolation: !0,
                                    asPath: resolvedAs,
                                    locale
                                }),
                                hasMiddleware: !0,
                                isServerRender: _this.isSsr,
                                parseJSON: !0,
                                inflightCache: _this.sdc,
                                persistCache: !isPreview,
                                isPrefetch: !1,
                                unstable_skipClientCache,
                                isBackground: isQueryUpdating
                            }, data = yield (options = {
                                fetchData: ()=>fetchNextData(fetchNextDataParams),
                                asPath: resolvedAs,
                                locale: locale,
                                router: _this
                            }, matchesMiddleware(options).then((matches)=>matches && options.fetchData ? options.fetchData().then((data)=>(function(source, response, options) {
                                        const nextConfig = {
                                            basePath: options.router.basePath,
                                            i18n: {
                                                locales: options.router.locales
                                            },
                                            trailingSlash: !1
                                        }, rewriteHeader = response.headers.get("x-nextjs-rewrite");
                                        let rewriteTarget = rewriteHeader || response.headers.get("x-nextjs-matched-path");
                                        const matchedPath = response.headers.get("x-matched-path");
                                        if (!matchedPath || rewriteTarget || matchedPath.includes("__next_data_catchall") || matchedPath.includes("/_error") || matchedPath.includes("/404") || // leverage x-matched-path to detect next.config.js rewrites
                                        (rewriteTarget = matchedPath), rewriteTarget) {
                                            if (rewriteTarget.startsWith("/")) {
                                                const parsedRewriteTarget = _parseRelativeUrl.parseRelativeUrl(rewriteTarget), pathnameInfo = _getNextPathnameInfo.getNextPathnameInfo(parsedRewriteTarget.pathname, {
                                                    nextConfig,
                                                    parseData: !0
                                                });
                                                let fsPathname = _removeTrailingSlash.removeTrailingSlash(pathnameInfo.pathname);
                                                return Promise.all([
                                                    options.router.pageLoader.getPageList(),
                                                    _routeLoader.getClientBuildManifest()
                                                ]).then((param)=>{
                                                    let [pages, { __rewrites: rewrites }] = param, as = _addLocale.addLocale(pathnameInfo.pathname, pathnameInfo.locale);
                                                    if (_isDynamic.isDynamicRoute(as) || !rewriteHeader && pages.includes(_normalizeLocalePath.normalizeLocalePath(_removeBasePath.removeBasePath(as), options.router.locales).pathname)) {
                                                        const parsedSource = _getNextPathnameInfo.getNextPathnameInfo(_parseRelativeUrl.parseRelativeUrl(source).pathname, {
                                                            parseData: !0
                                                        });
                                                        as = _addBasePath.addBasePath(parsedSource.pathname), parsedRewriteTarget.pathname = as;
                                                    }
                                                    if (!pages.includes(fsPathname)) {
                                                        const resolvedPathname = resolveDynamicRoute(fsPathname, pages);
                                                        resolvedPathname !== fsPathname && (fsPathname = resolvedPathname);
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
                                            const src = _parsePath.parsePath(source), pathname = _formatNextPathnameInfo.formatNextPathnameInfo(_extends({}, _getNextPathnameInfo.getNextPathnameInfo(src.pathname, {
                                                nextConfig,
                                                parseData: !0
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
                                                const src1 = _parsePath.parsePath(redirectTarget), pathname1 = _formatNextPathnameInfo.formatNextPathnameInfo(_extends({}, _getNextPathnameInfo.getNextPathnameInfo(src1.pathname, {
                                                    nextConfig,
                                                    parseData: !0
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
                                        }))).catch((_err)=>null) : null));
                            if (isQueryUpdating && data && (data.json = self.__NEXT_DATA__.props), handleCancelled(), (null == data ? void 0 : null == (ref = data.effect) ? void 0 : ref.type) === "redirect-internal" || (null == data ? void 0 : null == (ref4 = data.effect) ? void 0 : ref4.type) === "redirect-external") return data.effect;
                            if ((null == data ? void 0 : null == (ref5 = data.effect) ? void 0 : ref5.type) === "rewrite" && (route = _removeTrailingSlash.removeTrailingSlash(data.effect.resolvedHref), pathname = data.effect.resolvedHref, query = _extends({}, query, data.effect.parsedAs.query), resolvedAs = _removeBasePath.removeBasePath(_normalizeLocalePath.normalizeLocalePath(data.effect.parsedAs.pathname, _this.locales).pathname), // Check again the cache with the new destination.
                            existingInfo = _this.components[route], routeProps.shallow && existingInfo && _this.route === route && !hasMiddleware)) // If we have a match with the current route due to rewrite,
                            // we can copy the existing information to the rewritten one.
                            // Then, we return the information along with the matched route.
                            return _extends({}, existingInfo, {
                                route
                            });
                            if ("/api" === route || route.startsWith("/api/")) return handleHardNavigation({
                                url: as,
                                router: _this
                            }), new Promise(()=>{});
                            const routeInfo = cachedRouteInfo || (yield _this.fetchComponent(route).then((res)=>({
                                    Component: res.page,
                                    styleSheets: res.styleSheets,
                                    __N_SSG: res.mod.__N_SSG,
                                    __N_SSP: res.mod.__N_SSP
                                }))), shouldFetchData = routeInfo.__N_SSG || routeInfo.__N_SSP, { props, cacheKey } = yield _this._getData(_async_to_generator(function*() {
                                if (shouldFetchData) {
                                    const { json, cacheKey: _cacheKey } = (null == data ? void 0 : data.json) ? data : yield fetchNextData({
                                        dataHref: _this.pageLoader.getDataHref({
                                            href: _formatUrl.formatWithValidation({
                                                pathname,
                                                query
                                            }),
                                            asPath: resolvedAs,
                                            locale
                                        }),
                                        isServerRender: _this.isSsr,
                                        parseJSON: !0,
                                        inflightCache: _this.sdc,
                                        persistCache: !isPreview,
                                        isPrefetch: !1,
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
                            return routeInfo.__N_SSP && fetchNextDataParams.dataHref && delete _this.sdc[cacheKey], !_this.isPreview && routeInfo.__N_SSG && fetchNextData(Object.assign({}, fetchNextDataParams, {
                                isBackground: !0,
                                persistCache: !1,
                                inflightCache: backgroundCache
                            })).catch(()=>{}), props.pageProps = Object.assign({}, props.pageProps), routeInfo.props = props, routeInfo.route = route, routeInfo.query = query, routeInfo.resolvedAs = resolvedAs, _this.components[route] = routeInfo, routeInfo;
                        } catch (err) {
                            return _this.handleRouteInfoError(_isError.getProperError(err), pathname, query, as, routeProps);
                        }
                    })();
                }
                set(state, data, resetScroll) {
                    return this.state = state, this.sub(data, this.components["/_app"].Component, resetScroll);
                }
                /**
   * Callback to execute before replacing router state
   * @param cb callback to be executed
   */ beforePopState(cb) {
                    this._bps = cb;
                }
                onlyAHashChange(as) {
                    if (!this.asPath) return !1;
                    const [oldUrlNoHash, oldHash] = this.asPath.split("#"), [newUrlNoHash, newHash] = as.split("#");
                    return(// Makes sure we scroll to the provided hash if the url/hash are the same
                    !!newHash && oldUrlNoHash === newUrlNoHash && oldHash === newHash || oldUrlNoHash === newUrlNoHash && oldHash !== newHash);
                }
                scrollToHash(as) {
                    const [, hash = ""] = as.split("#");
                    // Scroll to top if the hash is just `#` with no value or `#top`
                    // To mirror browsers
                    if ("" === hash || "top" === hash) {
                        handleSmoothScroll(()=>window.scrollTo(0, 0));
                        return;
                    }
                    // Decode hash to make non-latin anchor works.
                    const rawHash = decodeURIComponent(hash), idEl = document.getElementById(rawHash);
                    if (idEl) {
                        handleSmoothScroll(()=>idEl.scrollIntoView());
                        return;
                    }
                    // If there's no element with the id, we check the `name` property
                    // To mirror browsers
                    const nameEl = document.getElementsByName(rawHash)[0];
                    nameEl && handleSmoothScroll(()=>nameEl.scrollIntoView());
                }
                urlIsNew(asPath) {
                    return this.asPath !== asPath;
                }
                /**
   * Prefetch page code, you may wait for the data during page rendering.
   * This feature only works in production!
   * @param url the href of prefetched page
   * @param asPath the as path of the prefetched page
   */ prefetch(url) {
                    let asPath = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : url, options = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
                    var _this = this;
                    return _async_to_generator(function*() {
                        if (_isBot.isBot(window.navigator.userAgent)) // No prefetches for bots that render the link since they are typically navigating
                        // links via the equivalent of a hard navigation and hence never utilize these
                        // prefetches.
                        return;
                        let parsed = _parseRelativeUrl.parseRelativeUrl(url), { pathname, query } = parsed;
                        const pages = yield _this.pageLoader.getPageList(), locale = void 0 !== options.locale ? options.locale || void 0 : _this.locale;
                        parsed.pathname = resolveDynamicRoute(parsed.pathname, pages), _isDynamic.isDynamicRoute(parsed.pathname) && (pathname = parsed.pathname, parsed.pathname = pathname, Object.assign(query, _routeMatcher.getRouteMatcher(_routeRegex.getRouteRegex(parsed.pathname))(_parsePath.parsePath(asPath).pathname) || {}), url = _formatUrl.formatWithValidation(parsed));
                        const route = _removeTrailingSlash.removeTrailingSlash(pathname);
                        yield Promise.all([
                            _this.pageLoader._isSsg(route).then((isSsg)=>!!isSsg && fetchNextData({
                                    dataHref: _this.pageLoader.getDataHref({
                                        href: url,
                                        asPath: asPath,
                                        locale: locale
                                    }),
                                    isServerRender: !1,
                                    parseJSON: !0,
                                    inflightCache: _this.sdc,
                                    persistCache: !_this.isPreview,
                                    isPrefetch: !0,
                                    unstable_skipClientCache: options.unstable_skipClientCache || options.priority && !0
                                }).then(()=>!1)),
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
                            return handleCancelled(), componentResult;
                        } catch (err) {
                            throw handleCancelled(), err;
                        }
                    })();
                }
                _getData(fn) {
                    let cancelled = !1;
                    const cancel = ()=>{
                        cancelled = !0;
                    };
                    return this.clc = cancel, fn().then((data)=>{
                        if (cancel === this.clc && (this.clc = null), cancelled) {
                            const err = Error("Loading initial props cancelled");
                            throw err.cancelled = !0, err;
                        }
                        return data;
                    });
                }
                _getFlightData(dataHref) {
                    // Do not cache RSC flight response since it's not a static resource
                    return fetchNextData({
                        dataHref,
                        isServerRender: !0,
                        parseJSON: !1,
                        inflightCache: this.sdc,
                        persistCache: !1,
                        isPrefetch: !1
                    }).then((param)=>{
                        let { text } = param;
                        return {
                            data: text
                        };
                    });
                }
                getInitialProps(Component, ctx) {
                    const { Component: App } = this.components["/_app"], AppTree = this._wrapApp(App);
                    return ctx.AppTree = AppTree, _utils.loadGetInitialProps(App, {
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
                constructor(pathname1, query1, as1, { initialProps, pageLoader, App, wrapApp, Component, err, subscription, isFallback, locale, locales, defaultLocale, domainLocales, isPreview }){
                    // Server Data Cache
                    this.sdc = {}, this.isFirstPopStateEvent = !0, this._key = createKey(), this.onPopState = (e)=>{
                        let forcedScroll;
                        const { isFirstPopStateEvent } = this;
                        this.isFirstPopStateEvent = !1;
                        const state = e.state;
                        if (!state) {
                            // We get state as undefined for two reasons.
                            //  1. With older safari (< 8) and older chrome (< 34)
                            //  2. When the URL changed with #
                            //
                            // In the both cases, we don't need to proceed and change the route.
                            // (as it's already changed)
                            // But we can simply replace the state with the new changes.
                            // Actually, for (1) we don't need to nothing. But it's hard to detect that event.
                            // So, doing the following for (1) does no harm.
                            const { pathname, query } = this;
                            this.changeState("replaceState", _formatUrl.formatWithValidation({
                                pathname: _addBasePath.addBasePath(pathname),
                                query
                            }), _utils.getURL());
                            return;
                        }
                        // __NA is used to identify if the history entry can be handled by the app-router.
                        if (state.__NA) {
                            window.location.reload();
                            return;
                        }
                        if (!state.__N || isFirstPopStateEvent && this.locale === state.options.locale && state.as === this.asPath) return;
                        const { url, as, options, key } = state;
                        this._key = key;
                        const { pathname: pathname1 } = _parseRelativeUrl.parseRelativeUrl(url);
                        // Make sure we don't re-render on initial load,
                        // can be caused by navigating back from an external site
                        (!this.isSsr || as !== _addBasePath.addBasePath(this.asPath) || pathname1 !== _addBasePath.addBasePath(this.pathname)) && (!this._bps || this._bps(state)) && this.change("replaceState", url, as, Object.assign({}, options, {
                            shallow: options.shallow && this._shallow,
                            locale: options.locale || this.defaultLocale,
                            // @ts-ignore internal value not exposed on types
                            _h: 0
                        }), forcedScroll);
                    };
                    // represents the current component key
                    const route = _removeTrailingSlash.removeTrailingSlash(pathname1);
                    // set up the component cache (by route keys)
                    this.components = {}, "/_error" !== pathname1 && (this.components[route] = {
                        Component,
                        initial: !0,
                        props: initialProps,
                        err,
                        __N_SSG: initialProps && initialProps.__N_SSG,
                        __N_SSP: initialProps && initialProps.__N_SSP
                    }), this.components["/_app"] = {
                        Component: App,
                        styleSheets: []
                    }, // Backwards compat for Router.router.events
                    // TODO: Should be remove the following major version as it was never documented
                    this.events = Router.events, this.pageLoader = pageLoader;
                    // if auto prerendered and dynamic route wait to update asPath
                    // until after mount to prevent hydration mismatch
                    const autoExportDynamic = _isDynamic.isDynamicRoute(pathname1) && self.__NEXT_DATA__.autoExport;
                    // make sure "as" doesn't start with double slashes or else it can
                    // throw an error as it's considered invalid
                    if (this.basePath = "", this.sub = subscription, this.clc = null, this._wrapApp = wrapApp, // make sure to ignore extra popState in safari on navigating
                    // back from external site
                    this.isSsr = !0, this.isLocaleDomain = !1, this.isReady = !!(self.__NEXT_DATA__.gssp || self.__NEXT_DATA__.gip || self.__NEXT_DATA__.appGip && !self.__NEXT_DATA__.gsp || !autoExportDynamic && !self.location.search), this.state = {
                        route,
                        pathname: pathname1,
                        query: query1,
                        asPath: autoExportDynamic ? pathname1 : as1,
                        isPreview: !!isPreview,
                        locale: void 0,
                        isFallback
                    }, this._initialMatchesMiddlewarePromise = Promise.resolve(!1), !as1.startsWith("//")) {
                        // in order for `e.state` to work on the `onpopstate` event
                        // we have to register the initial route upon initialization
                        const options = {
                            locale
                        }, asPath = _utils.getURL();
                        this._initialMatchesMiddlewarePromise = matchesMiddleware({
                            router: this,
                            locale,
                            asPath
                        }).then((matches)=>(options._shouldResolveHref = as1 !== pathname1, this.changeState("replaceState", matches ? asPath : _formatUrl.formatWithValidation({
                                pathname: _addBasePath.addBasePath(pathname1),
                                query: query1
                            }), asPath, options), matches));
                    }
                    window.addEventListener("popstate", this.onPopState);
                }
            }
            Router.events = _mitt.default(), exports.default = Router;
        /***/ },
        /***/ 7459: /***/ function(__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.addLocale = function(path, locale, defaultLocale, ignorePrefix) {
                return locale && locale !== defaultLocale && (ignorePrefix || !_pathHasPrefix.pathHasPrefix(path.toLowerCase(), "/".concat(locale.toLowerCase())) && !_pathHasPrefix.pathHasPrefix(path.toLowerCase(), "/api")) ? _addPathPrefix.addPathPrefix(path, "/".concat(locale)) : path;
            } //# sourceMappingURL=add-locale.js.map
            ;
            var _addPathPrefix = __webpack_require__(5391), _pathHasPrefix = __webpack_require__(1259);
        /***/ },
        /***/ 5391: /***/ function(__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.addPathPrefix = function(path, prefix) {
                if (!path.startsWith("/") || !prefix) return path;
                const { pathname, query, hash } = _parsePath.parsePath(path);
                return "".concat(prefix).concat(pathname).concat(query).concat(hash);
            } //# sourceMappingURL=add-path-prefix.js.map
            ;
            var _parsePath = __webpack_require__(4943);
        /***/ },
        /***/ 4156: /***/ function(__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.addPathSuffix = function(path, suffix) {
                if (!path.startsWith("/") || !suffix) return path;
                const { pathname, query, hash } = _parsePath.parsePath(path);
                return "".concat(pathname).concat(suffix).concat(query).concat(hash);
            } //# sourceMappingURL=add-path-suffix.js.map
            ;
            var _parsePath = __webpack_require__(4943);
        /***/ },
        /***/ 610: /***/ function(__unused_webpack_module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.compareRouterStates = function(a, b) {
                const stateKeys = Object.keys(a);
                if (stateKeys.length !== Object.keys(b).length) return !1;
                for(let i = stateKeys.length; i--;){
                    const key = stateKeys[i];
                    if ("query" === key) {
                        const queryKeys = Object.keys(a.query);
                        if (queryKeys.length !== Object.keys(b.query).length) return !1;
                        for(let j = queryKeys.length; j--;){
                            const queryKey = queryKeys[j];
                            if (!b.query.hasOwnProperty(queryKey) || a.query[queryKey] !== b.query[queryKey]) return !1;
                        }
                    } else if (!b.hasOwnProperty(key) || a[key] !== b[key]) return !1;
                }
                return !0;
            } //# sourceMappingURL=compare-states.js.map
            ;
        /***/ },
        /***/ 4022: /***/ function(__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.formatNextPathnameInfo = function(info) {
                let pathname = _addLocale.addLocale(info.pathname, info.locale, info.buildId ? void 0 : info.defaultLocale, info.ignorePrefix);
                return info.buildId && (pathname = _addPathSuffix.addPathSuffix(_addPathPrefix.addPathPrefix(pathname, "/_next/data/".concat(info.buildId)), "/" === info.pathname ? "index.json" : ".json")), pathname = _addPathPrefix.addPathPrefix(pathname, info.basePath), info.trailingSlash ? info.buildId || pathname.endsWith("/") ? pathname : _addPathSuffix.addPathSuffix(pathname, "/") : _removeTrailingSlash.removeTrailingSlash(pathname);
            } //# sourceMappingURL=format-next-pathname-info.js.map
            ;
            var _removeTrailingSlash = __webpack_require__(6316), _addPathPrefix = __webpack_require__(5391), _addPathSuffix = __webpack_require__(4156), _addLocale = __webpack_require__(7459);
        /***/ },
        /***/ 4611: /***/ function(__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.formatUrl = formatUrl, exports.formatWithValidation = function(url) {
                return formatUrl(url);
            } //# sourceMappingURL=format-url.js.map
            , exports.urlObjectKeys = void 0;
            var querystring = (0, __webpack_require__(1598)/* ["default"] */ .Z)(__webpack_require__(466));
            const slashedProtocols = /https?|ftp|gopher|file/;
            function formatUrl(urlObj) {
                let { auth, hostname } = urlObj, protocol = urlObj.protocol || "", pathname = urlObj.pathname || "", hash = urlObj.hash || "", query = urlObj.query || "", host = !1;
                auth = auth ? encodeURIComponent(auth).replace(/%3A/i, ":") + "@" : "", urlObj.host ? host = auth + urlObj.host : hostname && (host = auth + (~hostname.indexOf(":") ? "[".concat(hostname, "]") : hostname), urlObj.port && (host += ":" + urlObj.port)), query && "object" == typeof query && (query = String(querystring.urlQueryToSearchParams(query)));
                let search = urlObj.search || query && "?".concat(query) || "";
                return protocol && !protocol.endsWith(":") && (protocol += ":"), urlObj.slashes || (!protocol || slashedProtocols.test(protocol)) && !1 !== host ? (host = "//" + (host || ""), pathname && "/" !== pathname[0] && (pathname = "/" + pathname)) : host || (host = ""), hash && "#" !== hash[0] && (hash = "#" + hash), search && "?" !== search[0] && (search = "?" + search), pathname = pathname.replace(/[?#]/g, encodeURIComponent), search = search.replace("#", "%23"), "".concat(protocol).concat(host).concat(pathname).concat(search).concat(hash);
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
        /***/ },
        /***/ 3891: /***/ function(__unused_webpack_module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.default = function(route) {
                let ext = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "";
                return ("/" === route ? "/index" : /^\/index(\/|$)/.test(route) ? "/index".concat(route) : "".concat(route)) + ext;
            } //# sourceMappingURL=get-asset-path-from-route.js.map
            ;
        /***/ },
        /***/ 159: /***/ function(__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.getNextPathnameInfo = function(pathname, options) {
                var _nextConfig;
                const { basePath, i18n, trailingSlash } = null != (_nextConfig = options.nextConfig) ? _nextConfig : {}, info = {
                    pathname: pathname,
                    trailingSlash: "/" !== pathname ? pathname.endsWith("/") : trailingSlash
                };
                if (basePath && _pathHasPrefix.pathHasPrefix(info.pathname, basePath) && (info.pathname = _removePathPrefix.removePathPrefix(info.pathname, basePath), info.basePath = basePath), !0 === options.parseData && info.pathname.startsWith("/_next/data/") && info.pathname.endsWith(".json")) {
                    const paths = info.pathname.replace(/^\/_next\/data\//, "").replace(/\.json$/, "").split("/"), buildId = paths[0];
                    info.pathname = "index" !== paths[1] ? "/".concat(paths.slice(1).join("/")) : "/", info.buildId = buildId;
                }
                if (i18n) {
                    const pathLocale = _normalizeLocalePath.normalizeLocalePath(info.pathname, i18n.locales);
                    info.locale = null == pathLocale ? void 0 : pathLocale.detectedLocale, info.pathname = (null == pathLocale ? void 0 : pathLocale.pathname) || info.pathname;
                }
                return info;
            } //# sourceMappingURL=get-next-pathname-info.js.map
            ;
            var _normalizeLocalePath = __webpack_require__(4317), _removePathPrefix = __webpack_require__(9244), _pathHasPrefix = __webpack_require__(1259);
        /***/ },
        /***/ 418: /***/ function(__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), Object.defineProperty(exports, "getSortedRoutes", {
                enumerable: !0,
                get: function() {
                    return _sortedRoutes.getSortedRoutes;
                }
            }), Object.defineProperty(exports, "isDynamicRoute", {
                enumerable: !0,
                get: function() {
                    return _isDynamic.isDynamicRoute;
                }
            });
            var _sortedRoutes = __webpack_require__(3907), _isDynamic = __webpack_require__(8689);
        /***/ },
        /***/ 9671: /***/ function(__unused_webpack_module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.isBot = function(userAgent) {
                return /Googlebot|Mediapartners-Google|AdsBot-Google|googleweblight|Storebot-Google|Google-PageRenderer|Bingbot|BingPreview|Slurp|DuckDuckBot|baiduspider|yandex|sogou|LinkedInBot|bitlybot|tumblr|vkShare|quora link preview|facebookexternalhit|facebookcatalog|Twitterbot|applebot|redditbot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|ia_archiver/i.test(userAgent);
            } //# sourceMappingURL=is-bot.js.map
            ;
        /***/ },
        /***/ 8689: /***/ function(__unused_webpack_module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.isDynamicRoute = function(route) {
                return TEST_ROUTE.test(route);
            } //# sourceMappingURL=is-dynamic.js.map
            ;
            // Identify /[param]/ in route string
            const TEST_ROUTE = /\/\[[^/]+?\](?=\/|$)/;
        /***/ },
        /***/ 4943: /***/ function(__unused_webpack_module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.parsePath = function(path) {
                const hashIndex = path.indexOf("#"), queryIndex = path.indexOf("?"), hasQuery = queryIndex > -1 && (hashIndex < 0 || queryIndex < hashIndex);
                return hasQuery || hashIndex > -1 ? {
                    pathname: path.substring(0, hasQuery ? queryIndex : hashIndex),
                    query: hasQuery ? path.substring(queryIndex, hashIndex > -1 ? hashIndex : void 0) : "",
                    hash: hashIndex > -1 ? path.slice(hashIndex) : ""
                } : {
                    pathname: path,
                    query: "",
                    hash: ""
                };
            } //# sourceMappingURL=parse-path.js.map
            ;
        /***/ },
        /***/ 6305: /***/ function(__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.parseRelativeUrl = function(url, base) {
                const globalBase = new URL(_utils.getLocationOrigin()), resolvedBase = base ? new URL(base, globalBase) : url.startsWith(".") ? new URL(window.location.href) : globalBase, { pathname, searchParams, search, hash, href, origin } = new URL(url, resolvedBase);
                if (origin !== globalBase.origin) throw Error("invariant: invalid relative URL, router received ".concat(url));
                return {
                    pathname,
                    query: _querystring.searchParamsToUrlQuery(searchParams),
                    search,
                    hash,
                    href: href.slice(globalBase.origin.length)
                };
            } //# sourceMappingURL=parse-relative-url.js.map
            ;
            var _utils = __webpack_require__(3794), _querystring = __webpack_require__(466);
        /***/ },
        /***/ 1259: /***/ function(__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.pathHasPrefix = function(path, prefix) {
                if ("string" != typeof path) return !1;
                const { pathname } = _parsePath.parsePath(path);
                return pathname === prefix || pathname.startsWith(prefix + "/");
            } //# sourceMappingURL=path-has-prefix.js.map
            ;
            var _parsePath = __webpack_require__(4943);
        /***/ },
        /***/ 466: /***/ function(__unused_webpack_module, exports) {
            "use strict";
            function stringifyUrlQueryParam(param) {
                return "string" != typeof param && ("number" != typeof param || isNaN(param)) && "boolean" != typeof param ? "" : String(param);
            }
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.searchParamsToUrlQuery = function(searchParams) {
                const query = {};
                return searchParams.forEach((value, key)=>{
                    void 0 === query[key] ? query[key] = value : Array.isArray(query[key]) ? query[key].push(value) : query[key] = [
                        query[key],
                        value
                    ];
                }), query;
            }, exports.urlQueryToSearchParams = function(urlQuery) {
                const result = new URLSearchParams();
                return Object.entries(urlQuery).forEach((param)=>{
                    let [key, value] = param;
                    Array.isArray(value) ? value.forEach((item)=>result.append(key, stringifyUrlQueryParam(item))) : result.set(key, stringifyUrlQueryParam(value));
                }), result;
            }, exports.assign = function(target) {
                for(var _len = arguments.length, searchParamsList = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++)searchParamsList[_key - 1] = arguments[_key];
                return searchParamsList.forEach((searchParams)=>{
                    Array.from(searchParams.keys()).forEach((key)=>target.delete(key)), searchParams.forEach((value, key)=>target.append(key, value));
                }), target;
            } //# sourceMappingURL=querystring.js.map
            ;
        /***/ },
        /***/ 9244: /***/ function(__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.removePathPrefix = function(path, prefix) {
                if (_pathHasPrefix.pathHasPrefix(path, prefix)) {
                    const withoutPrefix = path.slice(prefix.length);
                    return withoutPrefix.startsWith("/") ? withoutPrefix : "/".concat(withoutPrefix);
                }
                return path;
            } //# sourceMappingURL=remove-path-prefix.js.map
            ;
            var _pathHasPrefix = __webpack_require__(1259);
        /***/ },
        /***/ 6316: /***/ function(__unused_webpack_module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.removeTrailingSlash = function(route) {
                return route.replace(/\/$/, "") || "/";
            } //# sourceMappingURL=remove-trailing-slash.js.map
            ;
        /***/ },
        /***/ 3888: /***/ function(__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.getRouteMatcher = function(param) {
                let { re, groups } = param;
                return (pathname)=>{
                    const routeMatch = re.exec(pathname);
                    if (!routeMatch) return !1;
                    const decode = (param)=>{
                        try {
                            return decodeURIComponent(param);
                        } catch (_) {
                            throw new _utils.DecodeError("failed to decode param");
                        }
                    }, params = {};
                    return Object.keys(groups).forEach((slugName)=>{
                        const g = groups[slugName], m = routeMatch[g.pos];
                        void 0 !== m && (params[slugName] = ~m.indexOf("/") ? m.split("/").map((entry)=>decode(entry)) : g.repeat ? [
                            decode(m)
                        ] : decode(m));
                    }), params;
                };
            } //# sourceMappingURL=route-matcher.js.map
            ;
            var _utils = __webpack_require__(3794);
        /***/ },
        /***/ 4095: /***/ function(__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.getRouteRegex = getRouteRegex, exports.getNamedRouteRegex = function(normalizedRoute) {
                const result = getNamedParametrizedRoute(normalizedRoute);
                return _extends({}, getRouteRegex(normalizedRoute), {
                    namedRegex: "^".concat(result.namedParameterizedRoute, "(?:/)?$"),
                    routeKeys: result.routeKeys
                });
            }, exports.getNamedMiddlewareRegex = function(normalizedRoute, options) {
                const { parameterizedRoute } = getParametrizedRoute(normalizedRoute), { catchAll = !0 } = options;
                if ("/" === parameterizedRoute) return {
                    namedRegex: "^/".concat(catchAll ? ".*" : "", "$")
                };
                const { namedParameterizedRoute } = getNamedParametrizedRoute(normalizedRoute);
                return {
                    namedRegex: "^".concat(namedParameterizedRoute).concat(catchAll ? "(?:(/.*)?)" : "", "$")
                };
            } //# sourceMappingURL=route-regex.js.map
            ;
            var _extends = __webpack_require__(6495)/* ["default"] */ .Z, _escapeRegexp = __webpack_require__(489), _removeTrailingSlash = __webpack_require__(6316);
            /**
 * Parses a given parameter from a route to a data structure that can be used
 * to generate the parametrized route. Examples:
 *   - `[...slug]` -> `{ name: 'slug', repeat: true, optional: true }`
 *   - `[foo]` -> `{ name: 'foo', repeat: false, optional: true }`
 *   - `bar` -> `{ name: 'bar', repeat: false, optional: false }`
 */ function parseParameter(param) {
                const optional = param.startsWith("[") && param.endsWith("]");
                optional && (param = param.slice(1, -1));
                const repeat = param.startsWith("...");
                return repeat && (param = param.slice(3)), {
                    key: param,
                    repeat,
                    optional
                };
            }
            function getParametrizedRoute(route) {
                const segments = _removeTrailingSlash.removeTrailingSlash(route).slice(1).split("/"), groups = {};
                let groupIndex = 1;
                return {
                    parameterizedRoute: segments.map((segment)=>{
                        if (!(segment.startsWith("[") && segment.endsWith("]"))) return "/".concat(_escapeRegexp.escapeStringRegexp(segment));
                        {
                            const { key, optional, repeat } = parseParameter(segment.slice(1, -1));
                            return groups[key] = {
                                pos: groupIndex++,
                                repeat,
                                optional
                            }, repeat ? optional ? "(?:/(.+?))?" : "/(.+?)" : "/([^/]+?)";
                        }
                    }).join(""),
                    groups
                };
            }
            function getRouteRegex(normalizedRoute) {
                const { parameterizedRoute, groups } = getParametrizedRoute(normalizedRoute);
                return {
                    re: new RegExp("^".concat(parameterizedRoute, "(?:/)?$")),
                    groups: groups
                };
            }
            function getNamedParametrizedRoute(route) {
                let routeKeyCharCode, routeKeyCharLength;
                const segments = _removeTrailingSlash.removeTrailingSlash(route).slice(1).split("/"), getSafeRouteKey = (routeKeyCharCode = 97, routeKeyCharLength = 1, ()=>{
                    let routeKey = "";
                    for(let i = 0; i < routeKeyCharLength; i++)routeKey += String.fromCharCode(routeKeyCharCode), ++routeKeyCharCode > 122 && (routeKeyCharLength++, routeKeyCharCode = 97);
                    return routeKey;
                }), routeKeys = {};
                return {
                    namedParameterizedRoute: segments.map((segment)=>{
                        if (!(segment.startsWith("[") && segment.endsWith("]"))) return "/".concat(_escapeRegexp.escapeStringRegexp(segment));
                        {
                            const { key, optional, repeat } = parseParameter(segment.slice(1, -1));
                            // replace any non-word characters since they can break
                            // the named regex
                            let cleanedKey = key.replace(/\W/g, ""), invalidKey = !1;
                            return (0 === cleanedKey.length || cleanedKey.length > 30) && (invalidKey = !0), isNaN(parseInt(cleanedKey.slice(0, 1))) || (invalidKey = !0), invalidKey && (cleanedKey = getSafeRouteKey()), routeKeys[cleanedKey] = key, repeat ? optional ? "(?:/(?<".concat(cleanedKey, ">.+?))?") : "/(?<".concat(cleanedKey, ">.+?)") : "/(?<".concat(cleanedKey, ">[^/]+?)");
                        }
                    }).join(""),
                    routeKeys
                };
            }
        /***/ },
        /***/ 3907: /***/ function(__unused_webpack_module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.getSortedRoutes = function(normalizedPages) {
                // First the UrlNode is created, and every UrlNode can have only 1 dynamic segment
                // Eg you can't have pages/[post]/abc.js and pages/[hello]/something-else.js
                // Only 1 dynamic segment per nesting level
                // So in the case that is test/integration/dynamic-routing it'll be this:
                // pages/[post]/comments.js
                // pages/blog/[post]/comment/[id].js
                // Both are fine because `pages/[post]` and `pages/blog` are on the same level
                // So in this case `UrlNode` created here has `this.slugName === 'post'`
                // And since your PR passed through `slugName` as an array basically it'd including it in too many possibilities
                // Instead what has to be passed through is the upwards path's dynamic names
                const root = new UrlNode();
                // Smoosh will then sort those sublevels up to the point where you get the correct route definition priority
                return(// Here the `root` gets injected multiple paths, and insert will break them up into sublevels
                normalizedPages.forEach((pagePath)=>root.insert(pagePath)), root.smoosh());
            } //# sourceMappingURL=sorted-routes.js.map
            ;
            class UrlNode {
                insert(urlPath) {
                    this._insert(urlPath.split("/").filter(Boolean), [], !1);
                }
                smoosh() {
                    return this._smoosh();
                }
                _smoosh() {
                    let prefix = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "/";
                    const childrenPaths = [
                        ...this.children.keys()
                    ].sort();
                    null !== this.slugName && childrenPaths.splice(childrenPaths.indexOf("[]"), 1), null !== this.restSlugName && childrenPaths.splice(childrenPaths.indexOf("[...]"), 1), null !== this.optionalRestSlugName && childrenPaths.splice(childrenPaths.indexOf("[[...]]"), 1);
                    const routes = childrenPaths.map((c)=>this.children.get(c)._smoosh("".concat(prefix).concat(c, "/"))).reduce((prev, curr)=>[
                            ...prev,
                            ...curr
                        ], []);
                    if (null !== this.slugName && routes.push(...this.children.get("[]")._smoosh("".concat(prefix, "[").concat(this.slugName, "]/"))), !this.placeholder) {
                        const r = "/" === prefix ? "/" : prefix.slice(0, -1);
                        if (null != this.optionalRestSlugName) throw Error('You cannot define a route with the same specificity as a optional catch-all route ("'.concat(r, '" and "').concat(r, "[[...").concat(this.optionalRestSlugName, ']]").'));
                        routes.unshift(r);
                    }
                    return null !== this.restSlugName && routes.push(...this.children.get("[...]")._smoosh("".concat(prefix, "[...").concat(this.restSlugName, "]/"))), null !== this.optionalRestSlugName && routes.push(...this.children.get("[[...]]")._smoosh("".concat(prefix, "[[...").concat(this.optionalRestSlugName, "]]/"))), routes;
                }
                _insert(urlPaths, slugNames, isCatchAll) {
                    if (0 === urlPaths.length) {
                        this.placeholder = !1;
                        return;
                    }
                    if (isCatchAll) throw Error("Catch-all must be the last part of the URL.");
                    // The next segment in the urlPaths list
                    let nextSegment = urlPaths[0];
                    // Check if the segment matches `[something]`
                    if (nextSegment.startsWith("[") && nextSegment.endsWith("]")) {
                        // Strip `[` and `]`, leaving only `something`
                        let segmentName = nextSegment.slice(1, -1), isOptional = !1;
                        if (segmentName.startsWith("[") && segmentName.endsWith("]") && (// Strip optional `[` and `]`, leaving only `something`
                        segmentName = segmentName.slice(1, -1), isOptional = !0), segmentName.startsWith("...") && (// Strip `...`, leaving only `something`
                        segmentName = segmentName.substring(3), isCatchAll = !0), segmentName.startsWith("[") || segmentName.endsWith("]")) throw Error("Segment names may not start or end with extra brackets ('".concat(segmentName, "')."));
                        if (segmentName.startsWith(".")) throw Error("Segment names may not start with erroneous periods ('".concat(segmentName, "')."));
                        function handleSlug(previousSlug, nextSlug) {
                            if (null !== previousSlug && previousSlug !== nextSlug) // TODO: This error seems to be confusing for users, needs an error link, the description can be based on above comment.
                            throw Error("You cannot use different slug names for the same dynamic path ('".concat(previousSlug, "' !== '").concat(nextSlug, "')."));
                            slugNames.forEach((slug)=>{
                                if (slug === nextSlug) throw Error('You cannot have the same slug name "'.concat(nextSlug, '" repeat within a single dynamic path'));
                                if (slug.replace(/\W/g, "") === nextSegment.replace(/\W/g, "")) throw Error('You cannot have the slug names "'.concat(slug, '" and "').concat(nextSlug, '" differ only by non-word symbols within a single dynamic path'));
                            }), slugNames.push(nextSlug);
                        }
                        if (isCatchAll) {
                            if (isOptional) {
                                if (null != this.restSlugName) throw Error('You cannot use both an required and optional catch-all route at the same level ("[...'.concat(this.restSlugName, ']" and "').concat(urlPaths[0], '" ).'));
                                handleSlug(this.optionalRestSlugName, segmentName), // slugName is kept as it can only be one particular slugName
                                this.optionalRestSlugName = segmentName, // nextSegment is overwritten to [[...]] so that it can later be sorted specifically
                                nextSegment = "[[...]]";
                            } else {
                                if (null != this.optionalRestSlugName) throw Error('You cannot use both an optional and required catch-all route at the same level ("[[...'.concat(this.optionalRestSlugName, ']]" and "').concat(urlPaths[0], '").'));
                                handleSlug(this.restSlugName, segmentName), // slugName is kept as it can only be one particular slugName
                                this.restSlugName = segmentName, // nextSegment is overwritten to [...] so that it can later be sorted specifically
                                nextSegment = "[...]";
                            }
                        } else {
                            if (isOptional) throw Error('Optional route parameters are not yet supported ("'.concat(urlPaths[0], '").'));
                            handleSlug(this.slugName, segmentName), // slugName is kept as it can only be one particular slugName
                            this.slugName = segmentName, // nextSegment is overwritten to [] so that it can later be sorted specifically
                            nextSegment = "[]";
                        }
                    }
                    this.children.has(nextSegment) || this.children.set(nextSegment, new UrlNode()), this.children.get(nextSegment)._insert(urlPaths.slice(1), slugNames, isCatchAll);
                }
                constructor(){
                    this.placeholder = !0, this.children = new Map(), this.slugName = null, this.restSlugName = null, this.optionalRestSlugName = null;
                }
            }
        /***/ },
        /***/ 8027: /***/ function(module, exports) {
            "use strict";
            let runtimeConfig;
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.setConfig = function(configValue) {
                runtimeConfig = configValue;
            }, exports.default = void 0, exports.default = ()=>runtimeConfig, ("function" == typeof exports.default || "object" == typeof exports.default && null !== exports.default) && void 0 === exports.default.__esModule && (Object.defineProperty(exports.default, "__esModule", {
                value: !0
            }), Object.assign(exports.default, exports), module.exports = exports.default);
        /***/ },
        /***/ 5188: /***/ function(__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.default = function(props) {
                const { headManager, reduceComponentsToState } = props;
                function emitChange() {
                    if (headManager && headManager.mountedInstances) {
                        const headElements = _react.Children.toArray(Array.from(headManager.mountedInstances).filter(Boolean));
                        headManager.updateHead(reduceComponentsToState(headElements, props));
                    }
                }
                if (isServer) {
                    var ref;
                    null == headManager || null == (ref = headManager.mountedInstances) || ref.add(props.children), emitChange();
                }
                return useClientOnlyLayoutEffect(()=>{
                    var ref1;
                    return null == headManager || null == (ref1 = headManager.mountedInstances) || ref1.add(props.children), ()=>{
                        var ref;
                        null == headManager || null == (ref = headManager.mountedInstances) || ref.delete(props.children);
                    };
                }), // We need to call `updateHead` method whenever the `SideEffect` is trigger in all
                // life-cycles: mount, update, unmount. However, if there are multiple `SideEffect`s
                // being rendered, we only trigger the method from the last one.
                // This is ensured by keeping the last unflushed `updateHead` in the `_pendingUpdate`
                // singleton in the layout effect pass, and actually trigger it in the effect pass.
                useClientOnlyLayoutEffect(()=>(headManager && (headManager._pendingUpdate = emitChange), ()=>{
                        headManager && (headManager._pendingUpdate = emitChange);
                    })), useClientOnlyEffect(()=>(headManager && headManager._pendingUpdate && (headManager._pendingUpdate(), headManager._pendingUpdate = null), ()=>{
                        headManager && headManager._pendingUpdate && (headManager._pendingUpdate(), headManager._pendingUpdate = null);
                    })), null;
            };
            var _react = (0, __webpack_require__(1598)/* ["default"] */ .Z)(__webpack_require__(7294));
            const isServer = !1, useClientOnlyLayoutEffect = _react.useLayoutEffect, useClientOnlyEffect = isServer ? ()=>{} : _react.useEffect;
        /***/ },
        /***/ 3794: /***/ function(__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.execOnce = function(fn) {
                let result, used = !1;
                return function() {
                    for(var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
                    return used || (used = !0, result = fn(...args)), result;
                };
            }, exports.getLocationOrigin = getLocationOrigin, exports.getURL = function() {
                const { href } = window.location, origin = getLocationOrigin();
                return href.substring(origin.length);
            }, exports.getDisplayName = getDisplayName, exports.isResSent = isResSent, exports.normalizeRepeatedSlashes = function(url) {
                const urlParts = url.split("?");
                return urlParts[0]// then normalize repeated forward slashes
                .replace(/\\/g, "/").replace(/\/\/+/g, "/") + (urlParts[1] ? "?".concat(urlParts.slice(1).join("?")) : "");
            }, exports.loadGetInitialProps = loadGetInitialProps, exports.ST = exports.SP = exports.warnOnce = exports.isAbsoluteUrl = void 0;
            var _async_to_generator = __webpack_require__(932)/* ["default"] */ .Z;
            // Scheme: https://tools.ietf.org/html/rfc3986#section-3.1
            // Absolute URL: https://tools.ietf.org/html/rfc3986#section-4.3
            const ABSOLUTE_URL_REGEX = /^[a-zA-Z][a-zA-Z\d+\-.]*?:/;
            function getLocationOrigin() {
                const { protocol, hostname, port } = window.location;
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
                return (_loadGetInitialProps = _async_to_generator(function*(App, ctx) {
                    // when called from _app `ctx` is nested in `ctx`
                    const res = ctx.res || ctx.ctx && ctx.ctx.res;
                    if (!App.getInitialProps) return ctx.ctx && ctx.Component ? {
                        pageProps: yield loadGetInitialProps(ctx.Component, ctx.ctx)
                    } : {};
                    const props = yield App.getInitialProps(ctx);
                    if (res && isResSent(res)) return props;
                    if (!props) throw Error('"'.concat(getDisplayName(App), '.getInitialProps()" should resolve to an object. But found "').concat(props, '" instead.'));
                    return props;
                })).apply(this, arguments);
            }
            exports.isAbsoluteUrl = (url)=>ABSOLUTE_URL_REGEX.test(url);
            const SP = "undefined" != typeof performance;
            exports.SP = SP;
            const ST = SP && [
                "mark",
                "measure",
                "getEntriesByName"
            ].every((method)=>"function" == typeof performance[method]);
            exports.ST = ST, exports.DecodeError = class extends Error {
            }, exports.NormalizeError = class extends Error {
            }, exports.PageNotFoundError = class extends Error {
                constructor(page){
                    super(), this.code = "ENOENT", this.message = "Cannot find module for page: ".concat(page);
                }
            }, exports.MissingStaticPage = class extends Error {
                constructor(page, message){
                    super(), this.message = "Failed to load static file for page: ".concat(page, " ").concat(message);
                }
            }, exports.MiddlewareNotFoundError = class extends Error {
                constructor(){
                    super(), this.code = "ENOENT", this.message = "Cannot find the middleware module";
                }
            }, exports.warnOnce = (_)=>{};
        /***/ },
        /***/ 8018: /***/ function(module) {
            var n, y, T, C, w, P, I, k, o, c, u, f, s, d, l, N, v, m, h, g, j, q, E, x, z, L, S, b, A, F, J, K, Q, M, B, D, U, R, V, W, H, O, X, _, Y, G;
            (n = {}).d = function(y, T) {
                for(var C in T)n.o(T, C) && !n.o(y, C) && Object.defineProperty(y, C, {
                    enumerable: !0,
                    get: T[C]
                });
            }, n.o = function(n, y) {
                return Object.prototype.hasOwnProperty.call(n, y);
            }, n.r = function(n) {
                "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(n, Symbol.toStringTag, {
                    value: "Module"
                }), Object.defineProperty(n, "__esModule", {
                    value: !0
                });
            }, void 0 !== n && (n.ab = "//"), y = {}, n.r(y), n.d(y, {
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
            }), k = -1, o = function(n) {
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
                } catch (n) {}
            }, d = function(n, y) {
                var T = function t(T) {
                    "pagehide" !== T.type && "hidden" !== document.visibilityState || (n(T), y && (removeEventListener("visibilitychange", t, !0), removeEventListener("pagehide", t, !0)));
                };
                addEventListener("visibilitychange", T, !0), addEventListener("pagehide", T, !0);
            }, l = function(n, y, T, C) {
                var w, P;
                return function(I) {
                    var n1;
                    y.value >= 0 && (I || C) && ((P = y.value - (w || 0)) || void 0 === w) && (w = y.value, y.delta = P, y.rating = (n1 = y.value) > T[1] ? "poor" : n1 > T[0] ? "needs-improvement" : "good", n(y));
                };
            }, N = -1, v = function() {
                return "hidden" !== document.visibilityState || document.prerendering ? 1 / 0 : 0;
            }, m = function() {
                d(function(n) {
                    N = n.timeStamp;
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
                    T = l(n, P = f("FCP"), C, y.reportAllChanges), requestAnimationFrame(function() {
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
                    P = 0, q = -1, C = l(i, w = f("CLS", 0), T, y.reportAllChanges);
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
                    var t, r, i, y = (n.timeStamp > 1e12 ? new Date : performance.now()) - n.timeStamp;
                    "pointerdown" == n.type ? (t = function() {
                        L(y, n), i();
                    }, r = function() {
                        i();
                    }, i = function() {
                        removeEventListener("pointerup", t, x), removeEventListener("pointercancel", r, x);
                    }, addEventListener("pointerup", t, x), addEventListener("pointercancel", r, x)) : L(y, n);
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
                    w = l(n, N = f("FID"), I, y.reportAllChanges), P = [], C = -1, T = null, A(addEventListener), P.push(v), S();
                });
            }, J = 0, K = 1 / 0, Q = 0, M = function(n) {
                n.forEach(function(n) {
                    n.interactionId && (K = Math.min(K, n.interactionId), J = (Q = Math.max(Q, n.interactionId)) ? (Q - K) / 7 + 1 : 0);
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
                    V = [], U = B(), C = l(n, w = f("INP"), T, y.reportAllChanges);
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
                        T = l(n, P = f("LCP"), C, y.reportAllChanges), requestAnimationFrame(function() {
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
                            (w = l(n, C = f("TTFB", 0), T, y.reportAllChanges))(!0);
                        });
                    }
                });
            }, module.exports = y;
        /***/ },
        /***/ 676: /***/ function(__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.default = isError, exports.getProperError = function(err) {
                return isError(err) ? err : Error(_isPlainObject.isPlainObject(err) ? JSON.stringify(err) : err + "");
            };
            var _isPlainObject = __webpack_require__(8887);
            function isError(err) {
                return "object" == typeof err && null !== err && "name" in err && "message" in err;
            }
        //# sourceMappingURL=is-error.js.map
        /***/ },
        /***/ 2431: /***/ function() {
        /* (ignored) */ /***/ }
    },
    /******/ function(__webpack_require__) {
        /******/ __webpack_require__.O(0, [
            774
        ], function() {
            return __webpack_require__(__webpack_require__.s = 2870);
        }), /******/ _N_E = __webpack_require__.O();
    /******/ }
]);
