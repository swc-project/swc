(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[179],{

/***/ 932:
/***/ (function(__unused_webpack_module, exports) {

"use strict";
var __webpack_unused_export__;

__webpack_unused_export__ = ({
    value: true
});
exports.Z = _asyncToGenerator;
function _asyncToGenerator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}


/***/ }),

/***/ 6495:
/***/ (function(__unused_webpack_module, exports) {

"use strict";
var __webpack_unused_export__;

__webpack_unused_export__ = ({
    value: true
});
exports.Z = _extends;
function _extends() {
    return extends_.apply(this, arguments);
}
function extends_() {
    extends_ = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return extends_.apply(this, arguments);
}


/***/ }),

/***/ 2648:
/***/ (function(__unused_webpack_module, exports) {

"use strict";
var __webpack_unused_export__;

__webpack_unused_export__ = ({
    value: true
});
exports.Z = _interopRequireDefault;
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}


/***/ }),

/***/ 1598:
/***/ (function(__unused_webpack_module, exports) {

"use strict";
var __webpack_unused_export__;

__webpack_unused_export__ = ({
    value: true
});
exports.Z = _interopRequireWildcard;
function _interopRequireWildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
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
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function _getRequireWildcardCache(nodeInterop1) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop1);
}


/***/ }),

/***/ 7273:
/***/ (function(__unused_webpack_module, exports) {

"use strict";
var __webpack_unused_export__;

__webpack_unused_export__ = ({
    value: true
});
exports.Z = _objectWithoutPropertiesLoose;
function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for(i = 0; i < sourceKeys.length; i++){
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        target[key] = source[key];
    }
    return target;
}


/***/ }),

/***/ 37:
/***/ (function() {

"trimStart"in String.prototype||(String.prototype.trimStart=String.prototype.trimLeft),"trimEnd"in String.prototype||(String.prototype.trimEnd=String.prototype.trimRight),"description"in Symbol.prototype||Object.defineProperty(Symbol.prototype,"description",{configurable:!0,get:function(){var t=/\((.*)\)/.exec(this.toString());return t?t[1]:void 0}}),Array.prototype.flat||(Array.prototype.flat=function(t,r){return r=this.concat.apply([],this),t>1&&r.some(Array.isArray)?r.flat(t-1):r},Array.prototype.flatMap=function(t,r){return this.map(t,r).flat()}),Promise.prototype.finally||(Promise.prototype.finally=function(t){if("function"!=typeof t)return this.then(t,t);var r=this.constructor||Promise;return this.then(function(o){return r.resolve(t()).then(function(){return o})},function(o){return r.resolve(t()).then(function(){throw o})})}),Object.fromEntries||(Object.fromEntries=function(t){return Array.from(t).reduce(function(t,r){return t[r[0]]=r[1],t},{})});


/***/ }),

/***/ 3468:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.addBasePath = addBasePath;
var _addPathPrefix = __webpack_require__(4135);
var _normalizeTrailingSlash = __webpack_require__(2700);
const basePath =  false || "";
function addBasePath(path, required) {
    if (false) {}
    return (0, _normalizeTrailingSlash).normalizePathTrailingSlash((0, _addPathPrefix).addPathPrefix(path, basePath));
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=add-base-path.js.map


/***/ }),

/***/ 4465:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.addLocale = void 0;
var _normalizeTrailingSlash = __webpack_require__(2700);
const addLocale = function(path) {
    for(var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        args[_key - 1] = arguments[_key];
    }
    if (false) {}
    return path;
};
exports.addLocale = addLocale;
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=add-locale.js.map


/***/ }),

/***/ 4643:
/***/ (function(module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.detectDomainLocale = void 0;
const detectDomainLocale = function() {
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
        args[_key] = arguments[_key];
    }
    if (false) {}
};
exports.detectDomainLocale = detectDomainLocale;
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=detect-domain-locale.js.map


/***/ }),

/***/ 928:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.hasBasePath = hasBasePath;
var _pathHasPrefix = __webpack_require__(3210);
const basePath =  false || "";
function hasBasePath(path) {
    return (0, _pathHasPrefix).pathHasPrefix(path, basePath);
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=has-base-path.js.map


/***/ }),

/***/ 1831:
/***/ (function(module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = initHeadManager;
exports.isEqualNode = isEqualNode;
exports.DOMAttributeNames = void 0;
function initHeadManager() {
    return {
        mountedInstances: new Set(),
        updateHead: (head)=>{
            const tags = {};
            head.forEach((h)=>{
                if (// it won't be inlined. In this case revert to the original behavior
                h.type === "link" && h.props["data-optimized-fonts"]) {
                    if (document.querySelector('style[data-href="'.concat(h.props["data-href"], '"]'))) {
                        return;
                    } else {
                        h.props.href = h.props["data-href"];
                        h.props["data-href"] = undefined;
                    }
                }
                const components = tags[h.type] || [];
                components.push(h);
                tags[h.type] = components;
            });
            const titleComponent = tags.title ? tags.title[0] : null;
            let title = "";
            if (titleComponent) {
                const { children  } = titleComponent.props;
                title = typeof children === "string" ? children : Array.isArray(children) ? children.join("") : "";
            }
            if (title !== document.title) document.title = title;
            [
                "meta",
                "base",
                "link",
                "style",
                "script"
            ].forEach((type)=>{
                updateElements(type, tags[type] || []);
            });
        }
    };
}
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
        if (p === "children" || p === "dangerouslySetInnerHTML") continue;
        // we don't render undefined props to the DOM
        if (props[p] === undefined) continue;
        const attr = DOMAttributeNames[p] || p.toLowerCase();
        if (type === "script" && (attr === "async" || attr === "defer" || attr === "noModule")) {
            el[attr] = !!props[p];
        } else {
            el.setAttribute(attr, props[p]);
        }
    }
    const { children , dangerouslySetInnerHTML  } = props;
    if (dangerouslySetInnerHTML) {
        el.innerHTML = dangerouslySetInnerHTML.__html || "";
    } else if (children) {
        el.textContent = typeof children === "string" ? children : Array.isArray(children) ? children.join("") : "";
    }
    return el;
}
function isEqualNode(oldTag, newTag) {
    if (oldTag instanceof HTMLElement && newTag instanceof HTMLElement) {
        const nonce = newTag.getAttribute("nonce");
        // Only strip the nonce if `oldTag` has had it stripped. An element's nonce attribute will not
        // be stripped if there is no content security policy response header that includes a nonce.
        if (nonce && !oldTag.getAttribute("nonce")) {
            const cloneTag = newTag.cloneNode(true);
            cloneTag.setAttribute("nonce", "");
            cloneTag.nonce = nonce;
            return nonce === oldTag.nonce && oldTag.isEqualNode(cloneTag);
        }
    }
    return oldTag.isEqualNode(newTag);
}
function updateElements(type, components) {
    const headEl = document.getElementsByTagName("head")[0];
    const headCountEl = headEl.querySelector("meta[name=next-head-count]");
    if (false) {}
    const headCount = Number(headCountEl.content);
    const oldTags = [];
    for(let i = 0, j = headCountEl.previousElementSibling; i < headCount; i++, j = (j == null ? void 0 : j.previousElementSibling) || null){
        var ref;
        if ((j == null ? void 0 : (ref = j.tagName) == null ? void 0 : ref.toLowerCase()) === type) {
            oldTags.push(j);
        }
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
        return (ref = t.parentNode) == null ? void 0 : ref.removeChild(t);
    });
    newTags.forEach((t)=>headEl.insertBefore(t, headCountEl));
    headCountEl.content = (headCount - oldTags.length + newTags.length).toString();
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=head-manager.js.map


/***/ }),

/***/ 4534:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
const _interopRequireWildcard = (__webpack_require__(1598)/* ["default"] */ .Z);
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.initialize = initialize;
exports.hydrate = hydrate;
exports.emitter = exports.router = exports.version = void 0;
var _async_to_generator = (__webpack_require__(932)/* ["default"] */ .Z);
var _extends = (__webpack_require__(6495)/* ["default"] */ .Z);
var _interop_require_default = (__webpack_require__(2648)/* ["default"] */ .Z);
var _interop_require_wildcard = (__webpack_require__(1598)/* ["default"] */ .Z);
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
const version = "13.0.3";
exports.version = version;
let router;
exports.router = router;
const emitter = (0, _mitt).default();
exports.emitter = emitter;
const looseToArray = (input)=>[].slice.call(input);
let initialData;
let defaultLocale = undefined;
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
        // We need to replace the router state if:
        // - the page was (auto) exported and has a query string or search (hash)
        // - it was auto exported and is a dynamic route (to provide params)
        // - if it is a client-side skeleton (fallback render)
        // - if middleware matches the current page (may have rewrite params)
        // - if rewrites in next.config.js match (may have rewrite params)
        if (router.isSsr && // We don't update for 404 requests as this can modify
        // the asPath unexpectedly e.g. adding basePath when
        // it wasn't originally present
        initialData.page !== "/404" && initialData.page !== "/_error" && (initialData.isFallback || initialData.nextExport && ((0, _isDynamic).isDynamicRoute(router.pathname) || location.search || false || initialMatchesMiddleware) || initialData.props && initialData.props.__N_SSG && (location.search || false || initialMatchesMiddleware))) {
            // update query on mount for exported pages
            router.replace(router.pathname + "?" + String((0, _querystring).assign((0, _querystring).urlQueryToSearchParams(router.query), new URLSearchParams(location.search))), asPath, {
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
        // If we call scrollIntoView() in here without a setTimeout
        // it won't scroll properly.
        setTimeout(()=>el.scrollIntoView(), 0);
    }
    render() {
        if (true) {
            return this.props.children;
        } else {}
    }
}
function initialize() {
    return _initialize.apply(this, arguments);
}
function _initialize() {
    _initialize = _async_to_generator(function*() {
        let opts = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
        // This makes sure this specific lines are removed in production
        if (false) {}
        initialData = JSON.parse(document.getElementById("__NEXT_DATA__").textContent);
        window.__NEXT_DATA__ = initialData;
        defaultLocale = initialData.defaultLocale;
        const prefix = initialData.assetPrefix || "";
        // With dynamic assetPrefix it's no longer possible to set assetPrefix at the build time
        // So, this is how we do it in the client side at runtime
        __webpack_require__.p = "".concat(prefix, "/_next/") //eslint-disable-line
        ;
        // Initialize next/config with the environment configuration
        (0, _runtimeConfig).setConfig({
            serverRuntimeConfig: {},
            publicRuntimeConfig: initialData.runtimeConfig || {}
        });
        asPath = (0, _utils).getURL();
        // make sure not to attempt stripping basePath for 404s
        if ((0, _hasBasePath).hasBasePath(asPath)) {
            asPath = (0, _removeBasePath).removeBasePath(asPath);
        }
        if (false) {}
        if (initialData.scriptLoader) {
            const { initScriptLoader  } = __webpack_require__(3573);
            initScriptLoader(initialData.scriptLoader);
        }
        pageLoader = new _pageLoader.default(initialData.buildId, prefix);
        const register = (param)=>{
            let [r, f] = param;
            return pageLoader.routeLoader.onEntrypoint(r, f);
        };
        if (window.__NEXT_P) {
            // Defer page registration for another tick. This will increase the overall
            // latency in hydrating the page, but reduce the total blocking time.
            window.__NEXT_P.map((p)=>setTimeout(()=>register(p), 0));
        }
        window.__NEXT_P = [];
        window.__NEXT_P.push = register;
        headManager = (0, _headManager).default();
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
    return /*#__PURE__*/ _react.default.createElement(App, Object.assign({}, appProps));
}
function AppContainer(param) {
    let { children  } = param;
    var _autoExport;
    return /*#__PURE__*/ _react.default.createElement(Container, {
        fn: (error)=>// eslint-disable-next-line @typescript-eslint/no-use-before-define
            renderError({
                App: CachedApp,
                err: error
            }).catch((err)=>console.error("Error rendering page: ", err))
    }, /*#__PURE__*/ _react.default.createElement(_appRouterContext.AppRouterContext.Provider, {
        value: (0, _adapters).adaptForAppRouterInstance(router)
    }, /*#__PURE__*/ _react.default.createElement(_hooksClientContext.SearchParamsContext.Provider, {
        value: (0, _adapters).adaptForSearchParams(router)
    }, /*#__PURE__*/ _react.default.createElement(_adapters.PathnameContextProviderAdapter, {
        router: router,
        isAutoExport: (_autoExport = self.__NEXT_DATA__.autoExport) != null ? _autoExport : false
    }, /*#__PURE__*/ _react.default.createElement(_routerContext.RouterContext.Provider, {
        value: (0, _router).makePublicRouterInstance(router)
    }, /*#__PURE__*/ _react.default.createElement(_headManagerContext.HeadManagerContext.Provider, {
        value: headManager
    }, /*#__PURE__*/ _react.default.createElement(_imageConfigContext.ImageConfigContext.Provider, {
        value: {"deviceSizes":[640,750,828,1080,1200,1920,2048,3840],"imageSizes":[16,32,48,64,96,128,256,384],"path":"/_next/image","loader":"default","dangerouslyAllowSVG":false,"unoptimized":false}
    }, children)))))));
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
    let { App , err  } = renderErrorProps;
    // In development runtime errors are caught by our overlay
    // In production we catch runtime errors using componentDidCatch which will trigger renderError
    if (false) {}
    // Make sure we log the error to the console, otherwise users can't track down issues.
    console.error(err);
    console.error("A client-side exception has occurred, see here for more info: https://nextjs.org/docs/messages/client-side-exception-occurred");
    return pageLoader.loadPage("/_error").then((param)=>{
        let { page: ErrorComponent , styleSheets  } = param;
        return (lastAppProps == null ? void 0 : lastAppProps.Component) === ErrorComponent ? Promise.resolve().then(()=>/*#__PURE__*/ _interopRequireWildcard(__webpack_require__(67))).then((errorModule)=>{
            return Promise.resolve().then(()=>/*#__PURE__*/ _interopRequireWildcard(__webpack_require__(4297))).then((appModule)=>{
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
        // In production we do a normal render with the `ErrorComponent` as component.
        // If we've gotten here upon initial render, we can use the props from the server.
        // Otherwise, we need to call `getInitialProps` on `App` before mounting.
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
        return Promise.resolve(((ref = renderErrorProps.props) == null ? void 0 : ref.err) ? renderErrorProps.props : (0, _utils).loadGetInitialProps(App, appCtx)).then((initProps)=>// eslint-disable-next-line @typescript-eslint/no-use-before-define
            doRender(_extends({}, renderErrorProps, {
                err,
                Component: ErrorComponent,
                styleSheets,
                props: initProps
            })));
    });
}
// Dummy component that we render as a child of Root so that we can
// toggle the correct styles before the page is rendered.
function Head(param) {
    let { callback  } = param;
    // We use `useLayoutEffect` to guarantee the callback is executed
    // as soon as React flushes the update.
    _react.default.useLayoutEffect(()=>callback(), [
        callback
    ]);
    return null;
}
let reactRoot = null;
// On initial render a hydrate should always happen
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
    performance.mark("afterHydrate") // mark end of hydration
    ;
    performance.measure("Next.js-before-hydration", "navigationStart", "beforeRender");
    performance.measure("Next.js-hydration", "beforeRender", "afterHydrate");
    if (onPerfEntry) {
        performance.getEntriesByName("Next.js-hydration").forEach(onPerfEntry);
    }
    clearMarks();
}
function markRenderComplete() {
    if (!_utils.ST) return;
    performance.mark("afterRender") // mark end of render
    ;
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
function renderReactElement(domEl, fn) {
    // mark start of hydrate/render
    if (_utils.ST) {
        performance.mark("beforeRender");
    }
    const reactEl = fn(shouldHydrate ? markHydrateComplete : markRenderComplete);
    if (!reactRoot) {
        // Unlike with createRoot, you don't need a separate root.render() call here
        reactRoot = _client.default.hydrateRoot(domEl, reactEl);
        // TODO: Remove shouldHydrate variable when React 18 is stable as it can depend on `reactRoot` existing
        shouldHydrate = false;
    } else {
        const startTransition = _react.default.startTransition;
        startTransition(()=>{
            reactRoot.render(reactEl);
        });
    }
}
function Root(param) {
    let { callbacks , children  } = param;
    // We use `useLayoutEffect` to guarantee the callbacks are executed
    // as soon as React flushes the update
    _react.default.useLayoutEffect(()=>callbacks.forEach((callback)=>callback()), [
        callbacks
    ]);
    // We should ask to measure the Web Vitals after rendering completes so we
    // don't cause any hydration delay:
    _react.default.useEffect(()=>{
        (0, _performanceRelayer).default(onPerfEntry);
    }, []);
    if (false) {}
    return children;
}
function doRender(input) {
    let { App , Component , props , err  } = input;
    let styleSheets = "initial" in input ? undefined : input.styleSheets;
    Component = Component || lastAppProps.Component;
    props = props || lastAppProps.props;
    const appProps = _extends({}, props, {
        Component,
        err,
        router
    });
    // lastAppProps has to be set before ReactDom.render to account for ReactDom throwing an error.
    lastAppProps = appProps;
    let canceled = false;
    let resolvePromise;
    const renderPromise = new Promise((resolve, reject)=>{
        if (lastRenderReject) {
            lastRenderReject();
        }
        resolvePromise = ()=>{
            lastRenderReject = null;
            resolve();
        };
        lastRenderReject = ()=>{
            canceled = true;
            lastRenderReject = null;
            const error = new Error("Cancel rendering route");
            error.cancelled = true;
            reject(error);
        };
    });
    // This function has a return type to ensure it doesn't start returning a
    // Promise. It should remain synchronous.
    function onStart() {
        if (!styleSheets || // We use `style-loader` in development, so we don't need to do anything
        // unless we're in production:
        "production" !== "production") {
            return false;
        }
        const currentStyleTags = looseToArray(document.querySelectorAll("style[data-n-href]"));
        const currentHrefs = new Set(currentStyleTags.map((tag)=>tag.getAttribute("data-n-href")));
        const noscript = document.querySelector("noscript[data-n-css]");
        const nonce = noscript == null ? void 0 : noscript.getAttribute("data-n-css");
        styleSheets.forEach((param)=>{
            let { href , text  } = param;
            if (!currentHrefs.has(href)) {
                const styleTag = document.createElement("style");
                styleTag.setAttribute("data-n-href", href);
                styleTag.setAttribute("media", "x");
                if (nonce) {
                    styleTag.setAttribute("nonce", nonce);
                }
                document.head.appendChild(styleTag);
                styleTag.appendChild(document.createTextNode(text));
            }
        });
        return true;
    }
    function onHeadCommit() {
        if (// unless we're in production:
         true && // We can skip this during hydration. Running it wont cause any harm, but
        // we may as well save the CPU cycles:
        styleSheets && // Ensure this render was not canceled
        !canceled) {
            const desiredHrefs = new Set(styleSheets.map((s)=>s.href));
            const currentStyleTags = looseToArray(document.querySelectorAll("style[data-n-href]"));
            const currentHrefs = currentStyleTags.map((tag)=>tag.getAttribute("data-n-href"));
            // Toggle `<style>` tags on or off depending on if they're needed:
            for(let idx = 0; idx < currentHrefs.length; ++idx){
                if (desiredHrefs.has(currentHrefs[idx])) {
                    currentStyleTags[idx].removeAttribute("media");
                } else {
                    currentStyleTags[idx].setAttribute("media", "x");
                }
            }
            // Reorder styles into intended order:
            let referenceNode = document.querySelector("noscript[data-n-css]");
            if (referenceNode) {
                styleSheets.forEach((param)=>{
                    let { href  } = param;
                    const targetTag = document.querySelector('style[data-n-href="'.concat(href, '"]'));
                    if (targetTag) {
                        referenceNode.parentNode.insertBefore(targetTag, referenceNode.nextSibling);
                        referenceNode = targetTag;
                    }
                });
            }
            // Finally, clean up server rendered stylesheets:
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
    function onRootCommit() {
        resolvePromise();
    }
    onStart();
    const elem = /*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/ _react.default.createElement(Head, {
        callback: onHeadCommit
    }), /*#__PURE__*/ _react.default.createElement(AppContainer, null, renderApp(App, appProps), /*#__PURE__*/ _react.default.createElement(_portal.Portal, {
        type: "next-route-announcer"
    }, /*#__PURE__*/ _react.default.createElement(_routeAnnouncer.RouteAnnouncer, null))));
    // We catch runtime errors using componentDidCatch which will trigger renderError
    renderReactElement(appElement, (callback)=>/*#__PURE__*/ _react.default.createElement(Root, {
            callbacks: [
                callback,
                onRootCommit
            ]
        },  true ? /*#__PURE__*/ _react.default.createElement(_react.default.StrictMode, null, elem) : 0));
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
            const renderErr = (0, _isError).getProperError(err);
            // bubble up cancelation errors
            if (renderErr.cancelled) {
                throw renderErr;
            }
            if (false) {}
            yield renderError(_extends({}, renderingProps, {
                err: renderErr
            }));
        }
    });
    return _render.apply(this, arguments);
}
function hydrate(opts) {
    return _hydrate.apply(this, arguments);
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
            if (mod && mod.reportWebVitals) {
                onPerfEntry = (param)=>{
                    let { id , name , startTime , value , duration , entryType , entries , attribution  } = param;
                    // Combines timestamp with random number for unique ID
                    const uniqueID = "".concat(Date.now(), "-").concat(Math.floor(Math.random() * (9e12 - 1)) + 1e12);
                    let perfStartEntry;
                    if (entries && entries.length) {
                        perfStartEntry = entries[0].startTime;
                    }
                    const webVitals = {
                        id: id || uniqueID,
                        name,
                        startTime: startTime || perfStartEntry,
                        value: value == null ? duration : value,
                        label: entryType === "mark" || entryType === "measure" ? "custom" : "web-vital"
                    };
                    if (attribution) {
                        webVitals.attribution = attribution;
                    }
                    mod.reportWebVitals(webVitals);
                };
            }
            const pageEntrypoint = // error, so we need to skip waiting for the entrypoint.
             false ? 0 : yield pageLoader.routeLoader.whenEntrypoint(initialData.page);
            if ("error" in pageEntrypoint) {
                throw pageEntrypoint.error;
            }
            CachedComponent = pageEntrypoint.component;
            if (false) {}
        } catch (error1) {
            // This catches errors like throwing in the top level of a module
            initialErr = (0, _isError).getProperError(error1);
        }
        if (false) {}
        if (window.__NEXT_PRELOADREADY) {
            yield window.__NEXT_PRELOADREADY(initialData.dynamicIds);
        }
        exports.router = router = (0, _router).createRouter(initialData.page, initialData.query, asPath, {
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
        if (opts == null ? void 0 : opts.beforeRender) {
            yield opts.beforeRender();
        }
        render(renderCtx);
    });
    return _hydrate.apply(this, arguments);
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=index.js.map


/***/ }),

/***/ 1783:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var _ = __webpack_require__(4534);
window.next = {
    version: _.version,
    // router is initialized later so it has to be live-binded
    get router () {
        return _.router;
    },
    emitter: _.emitter
};
(0, _).initialize({}).then(()=>(0, _).hydrate()).catch(console.error);
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=next.js.map


/***/ }),

/***/ 2700:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.normalizePathTrailingSlash = void 0;
var _removeTrailingSlash = __webpack_require__(12);
var _parsePath = __webpack_require__(6727);
const normalizePathTrailingSlash = (path)=>{
    if (!path.startsWith("/")) {
        return path;
    }
    const { pathname , query , hash  } = (0, _parsePath).parsePath(path);
    if (false) {}
    return "".concat((0, _removeTrailingSlash).removeTrailingSlash(pathname)).concat(query).concat(hash);
};
exports.normalizePathTrailingSlash = normalizePathTrailingSlash;
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=normalize-trailing-slash.js.map


/***/ }),

/***/ 976:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = void 0;
var _interop_require_default = (__webpack_require__(2648)/* ["default"] */ .Z);
var _addBasePath = __webpack_require__(3468);
var _router = __webpack_require__(1003);
var _getAssetPathFromRoute = _interop_require_default(__webpack_require__(7929));
var _addLocale = __webpack_require__(4465);
var _isDynamic = __webpack_require__(6238);
var _parseRelativeUrl = __webpack_require__(2864);
var _removeTrailingSlash = __webpack_require__(12);
var _routeLoader = __webpack_require__(2497);
class PageLoader {
    getPageList() {
        if (true) {
            return (0, _routeLoader).getClientBuildManifest().then((manifest)=>manifest.sortedPages);
        } else {}
    }
    getMiddleware() {
        if (true) {
            const middlewareMatchers = [];
            window.__MIDDLEWARE_MATCHERS = middlewareMatchers ? middlewareMatchers : undefined;
            return window.__MIDDLEWARE_MATCHERS;
        } else {}
    }
    getDataHref(params) {
        const { asPath , href , locale  } = params;
        const { pathname: hrefPathname , query , search  } = (0, _parseRelativeUrl).parseRelativeUrl(href);
        const { pathname: asPathname  } = (0, _parseRelativeUrl).parseRelativeUrl(asPath);
        const route = (0, _removeTrailingSlash).removeTrailingSlash(hrefPathname);
        if (route[0] !== "/") {
            throw new Error('Route name should start with a "/", got "'.concat(route, '"'));
        }
        const getHrefForSlug = (path)=>{
            const dataRoute = (0, _getAssetPathFromRoute).default((0, _removeTrailingSlash).removeTrailingSlash((0, _addLocale).addLocale(path, locale)), ".json");
            return (0, _addBasePath).addBasePath("/_next/data/".concat(this.buildId).concat(dataRoute).concat(search), true);
        };
        return getHrefForSlug(params.skipInterpolation ? asPathname : (0, _isDynamic).isDynamicRoute(route) ? (0, _router).interpolateAs(hrefPathname, asPathname, query).result : route);
    }
    /**
   * @param {string} route - the route (file-system path)
   */ _isSsg(route) {
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
        this.routeLoader = (0, _routeLoader).createRouteLoader(assetPrefix);
        this.buildId = buildId;
        this.assetPrefix = assetPrefix;
        this.promisedSsgManifest = new Promise((resolve)=>{
            if (window.__SSG_MANIFEST) {
                resolve(window.__SSG_MANIFEST);
            } else {
                window.__SSG_MANIFEST_CB = ()=>{
                    resolve(window.__SSG_MANIFEST);
                };
            }
        });
    }
}
exports["default"] = PageLoader;
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=page-loader.js.map


/***/ }),

/***/ 659:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = void 0;
// copied to prevent pulling in un-necessary utils
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
    if (userReportHandler) {
        userReportHandler(metric);
    }
    // This code is not shipped, executed, or present in the client-side
    // JavaScript bundle unless explicitly enabled in your application.
    //
    // When this feature is enabled, we'll make it very clear by printing a
    // message during the build (`next build`).
    if (false) { var ref; }
}
var _default = (onPerfEntry)=>{
    // Update function if it changes:
    userReportHandler = onPerfEntry;
    // Only register listeners once:
    if (isRegistered) {
        return;
    }
    isRegistered = true;
    const attributions = undefined;
    for (const webVital of WEB_VITALS){
        try {
            let mod;
            if (false) {}
            if (!mod) {
                mod = __webpack_require__(8018);
            }
            mod["on".concat(webVital)](onReport);
        } catch (err) {
            // Do nothing if the module fails to load
            console.warn("Failed to track ".concat(webVital, " web-vital"), err);
        }
    }
};
exports["default"] = _default;
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=performance-relayer.js.map


/***/ }),

/***/ 7345:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.Portal = void 0;
var _react = __webpack_require__(7294);
var _reactDom = __webpack_require__(3935);
const Portal = (param)=>{
    let { children , type  } = param;
    const [portalNode, setPortalNode] = (0, _react).useState(null);
    (0, _react).useEffect(()=>{
        const element = document.createElement(type);
        document.body.appendChild(element);
        setPortalNode(element);
        return ()=>{
            document.body.removeChild(element);
        };
    }, [
        type
    ]);
    return portalNode ? /*#__PURE__*/ (0, _reactDom).createPortal(children, portalNode) : null;
};
exports.Portal = Portal;
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=index.js.map


/***/ }),

/***/ 2813:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.removeBasePath = removeBasePath;
var _hasBasePath = __webpack_require__(928);
const basePath =  false || "";
function removeBasePath(path) {
    if (false) {}
    path = path.slice(basePath.length);
    if (!path.startsWith("/")) path = "/".concat(path);
    return path;
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=remove-base-path.js.map


/***/ }),

/***/ 6876:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.removeLocale = removeLocale;
var _parsePath = __webpack_require__(6727);
function removeLocale(path, locale) {
    if (false) {}
    return path;
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=remove-locale.js.map


/***/ }),

/***/ 4686:
/***/ (function(module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.cancelIdleCallback = exports.requestIdleCallback = void 0;
const requestIdleCallback = typeof self !== "undefined" && self.requestIdleCallback && self.requestIdleCallback.bind(window) || function(cb) {
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
const cancelIdleCallback = typeof self !== "undefined" && self.cancelIdleCallback && self.cancelIdleCallback.bind(window) || function(id) {
    return clearTimeout(id);
};
exports.cancelIdleCallback = cancelIdleCallback;
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=request-idle-callback.js.map


/***/ }),

/***/ 8483:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = exports.RouteAnnouncer = void 0;
var _interop_require_default = (__webpack_require__(2648)/* ["default"] */ .Z);
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
    // https://medium.com/@jessebeach/beware-smushed-off-screen-accessible-text-5952a4c2cbfe
    whiteSpace: "nowrap",
    wordWrap: "normal"
};
const RouteAnnouncer = ()=>{
    const { asPath  } = (0, _router).useRouter();
    const [routeAnnouncement, setRouteAnnouncement] = _react.default.useState("");
    // Only announce the path change, but not for the first load because screen
    // reader will do that automatically.
    const previouslyLoadedPath = _react.default.useRef(asPath);
    // Every time the path changes, announce the new page’s title following this
    // priority: first the document title (from head), otherwise the first h1, or
    // if none of these exist, then the pathname from the URL. This methodology is
    // inspired by Marcy Sutton’s accessible client routing user testing. More
    // information can be found here:
    // https://www.gatsbyjs.com/blog/2019-07-11-user-testing-accessible-client-routing/
    _react.default.useEffect(()=>{
        // If the path hasn't change, we do nothing.
        if (previouslyLoadedPath.current === asPath) return;
        previouslyLoadedPath.current = asPath;
        if (document.title) {
            setRouteAnnouncement(document.title);
        } else {
            const pageHeader = document.querySelector("h1");
            var ref;
            const content = (ref = pageHeader == null ? void 0 : pageHeader.innerText) != null ? ref : pageHeader == null ? void 0 : pageHeader.textContent;
            setRouteAnnouncement(content || asPath);
        }
    }, [
        asPath
    ]);
    return /*#__PURE__*/ _react.default.createElement("p", {
        "aria-live": "assertive" // Make the announcement immediately.
        ,
        id: "__next-route-announcer__",
        role: "alert",
        style: nextjsRouteAnnouncerStyles
    }, routeAnnouncement);
};
exports.RouteAnnouncer = RouteAnnouncer;
var _default = RouteAnnouncer;
exports["default"] = _default;
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=route-announcer.js.map


/***/ }),

/***/ 2497:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.markAssetError = markAssetError;
exports.isAssetError = isAssetError;
exports.getClientBuildManifest = getClientBuildManifest;
exports.createRouteLoader = createRouteLoader;
var _interop_require_default = (__webpack_require__(2648)/* ["default"] */ .Z);
var _getAssetPathFromRoute = _interop_require_default(__webpack_require__(7929));
var _trustedTypes = __webpack_require__(5407);
var _requestIdleCallback = __webpack_require__(4686);
// 3.8s was arbitrarily chosen as it's what https://web.dev/interactive
// considers as "Good" time-to-interactive. We must assume something went
// wrong beyond this point, and then fall-back to a full page transition to
// show the user something of value.
const MS_MAX_IDLE_DELAY = 3800;
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
    return generator ? generator() // eslint-disable-next-line no-sequences
    .then((value)=>(resolver(value), value)).catch((err)=>{
        map.delete(key);
        throw err;
    }) : prom;
}
const ASSET_LOAD_ERROR = Symbol("ASSET_LOAD_ERROR");
function markAssetError(err) {
    return Object.defineProperty(err, ASSET_LOAD_ERROR, {});
}
function isAssetError(err) {
    return err && ASSET_LOAD_ERROR in err;
}
function hasPrefetch(link) {
    try {
        link = document.createElement("link");
        return(// with relList.support
        !!window.MSInputMethodContext && !!document.documentMode || link.relList.supports("prefetch"));
    } catch (e) {
        return false;
    }
}
const canPrefetch = hasPrefetch();
function prefetchViaDom(href, as, link) {
    return new Promise((resolve, reject)=>{
        const selector = '\n      link[rel="prefetch"][href^="'.concat(href, '"],\n      link[rel="preload"][href^="').concat(href, '"],\n      script[src^="').concat(href, '"]');
        if (document.querySelector(selector)) {
            return resolve();
        }
        link = document.createElement("link");
        // The order of property assignment here is intentional:
        if (as) link.as = as;
        link.rel = "prefetch";
        link.crossOrigin = undefined;
        link.onload = resolve;
        link.onerror = ()=>reject(markAssetError(new Error("Failed to prefetch: ".concat(href))));
        // `href` should always be last:
        link.href = href;
        document.head.appendChild(link);
    });
}
function appendScript(src, script) {
    return new Promise((resolve, reject)=>{
        script = document.createElement("script");
        // The order of property assignment here is intentional.
        // 1. Setup success/failure hooks in case the browser synchronously
        //    executes when `src` is set.
        script.onload = resolve;
        script.onerror = ()=>reject(markAssetError(new Error("Failed to load script: ".concat(src))));
        // 2. Configure the cross-origin attribute before setting `src` in case the
        //    browser begins to fetch.
        script.crossOrigin = undefined;
        // 3. Finally, set the source and inject into the DOM in case the child
        //    must be appended for fetching to start.
        script.src = src;
        document.body.appendChild(script);
    });
}
// We wait for pages to be built in dev before we start the route transition
// timeout to prevent an un-necessary hard navigation in development.
let devBuildPromise;
// Resolve a promise that times out after given amount of milliseconds.
function resolvePromiseWithTimeout(p, ms, err) {
    return new Promise((resolve, reject)=>{
        let cancelled = false;
        p.then((r)=>{
            // Resolved, cancel the timeout
            cancelled = true;
            resolve(r);
        }).catch(reject);
        // We wrap these checks separately for better dead-code elimination in
        // production bundles.
        if (false) {}
        if (true) {
            (0, _requestIdleCallback).requestIdleCallback(()=>setTimeout(()=>{
                    if (!cancelled) {
                        reject(err);
                    }
                }, ms));
        }
    });
}
function getClientBuildManifest() {
    if (self.__BUILD_MANIFEST) {
        return Promise.resolve(self.__BUILD_MANIFEST);
    }
    const onBuildManifest = new Promise((resolve)=>{
        // Mandatory because this is not concurrent safe:
        const cb = self.__BUILD_MANIFEST_CB;
        self.__BUILD_MANIFEST_CB = ()=>{
            resolve(self.__BUILD_MANIFEST);
            cb && cb();
        };
    });
    return resolvePromiseWithTimeout(onBuildManifest, MS_MAX_IDLE_DELAY, markAssetError(new Error("Failed to load client build manifest")));
}
function getFilesForRoute(assetPrefix, route) {
    if (false) {}
    return getClientBuildManifest().then((manifest)=>{
        if (!(route in manifest)) {
            throw markAssetError(new Error("Failed to lookup route: ".concat(route)));
        }
        const allFiles = manifest[route].map((entry)=>assetPrefix + "/_next/" + encodeURI(entry));
        return {
            scripts: allFiles.filter((v)=>v.endsWith(".js")).map((v)=>(0, _trustedTypes).__unsafeCreateTrustedScriptURL(v)),
            css: allFiles.filter((v)=>v.endsWith(".css"))
        };
    });
}
function createRouteLoader(assetPrefix) {
    const entrypoints = new Map();
    const loadedScripts = new Map();
    const styleSheets = new Map();
    const routes = new Map();
    function maybeExecuteScript(src) {
        // With HMR we might need to "reload" scripts when they are
        // disposed and readded. Executing scripts twice has no functional
        // differences
        if (true) {
            let prom = loadedScripts.get(src.toString());
            if (prom) {
                return prom;
            }
            // Skip executing script if it's already in the DOM:
            if (document.querySelector('script[src^="'.concat(src, '"]'))) {
                return Promise.resolve();
            }
            loadedScripts.set(src.toString(), prom = appendScript(src));
            return prom;
        } else {}
    }
    function fetchStyleSheet(href) {
        let prom = styleSheets.get(href);
        if (prom) {
            return prom;
        }
        styleSheets.set(href, prom = fetch(href).then((res)=>{
            if (!res.ok) {
                throw new Error("Failed to load stylesheet: ".concat(href));
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
                })) : Promise.resolve(undefined)).then((input)=>{
                const old = entrypoints.get(route);
                if (old && "resolve" in old) {
                    if (input) {
                        entrypoints.set(route, input);
                        old.resolve(input);
                    }
                } else {
                    if (input) {
                        entrypoints.set(route, input);
                    } else {
                        entrypoints.delete(route);
                    }
                    // when this entrypoint has been resolved before
                    // the route is outdated and we want to invalidate
                    // this cache entry
                    routes.delete(route);
                }
            });
        },
        loadRoute (route, prefetch) {
            return withFuture(route, routes, ()=>{
                let devBuildPromiseResolve;
                if (false) {}
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
                }), MS_MAX_IDLE_DELAY, markAssetError(new Error("Route did not complete loading: ".concat(route)))).then((param)=>{
                    let { entrypoint , styles  } = param;
                    const res = Object.assign({
                        styles: styles
                    }, entrypoint);
                    return "error" in entrypoint ? entrypoint : res;
                }).catch((err)=>{
                    if (prefetch) {
                        // we don't want to cache errors during prefetch
                        throw err;
                    }
                    return {
                        error: err
                    };
                }).finally(()=>{
                    return devBuildPromiseResolve == null ? void 0 : devBuildPromiseResolve();
                });
            });
        },
        prefetch (route) {
            // https://github.com/GoogleChromeLabs/quicklink/blob/453a661fa1fa940e2d2e044452398e38c67a98fb/src/index.mjs#L115-L118
            // License: Apache 2.0
            let cn;
            if (cn = navigator.connection) {
                // Don't prefetch if using 2G or if Save-Data is enabled.
                if (cn.saveData || /2g/.test(cn.effectiveType)) return Promise.resolve();
            }
            return getFilesForRoute(assetPrefix, route).then((output)=>Promise.all(canPrefetch ? output.scripts.map((script)=>prefetchViaDom(script.toString(), "script")) : [])).then(()=>{
                (0, _requestIdleCallback).requestIdleCallback(()=>this.loadRoute(route, true).catch(()=>{}));
            }).catch(()=>{});
        }
    };
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=route-loader.js.map


/***/ }),

/***/ 880:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "Router", ({
    enumerable: true,
    get: function() {
        return _router.default;
    }
}));
Object.defineProperty(exports, "withRouter", ({
    enumerable: true,
    get: function() {
        return _withRouter.default;
    }
}));
exports.useRouter = useRouter;
exports.createRouter = createRouter;
exports.makePublicRouterInstance = makePublicRouterInstance;
exports["default"] = void 0;
var _interop_require_default = (__webpack_require__(2648)/* ["default"] */ .Z);
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
        if (true) {
            this.readyCallbacks.push(cb);
        }
    }
};
// Create public properties and methods of the router in the singletonRouter
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
const routerEvents = [
    "routeChangeStart",
    "beforeHistoryChange",
    "routeChangeComplete",
    "routeChangeError",
    "hashChangeStart",
    "hashChangeComplete"
];
const coreMethodFields = [
    "push",
    "replace",
    "reload",
    "back",
    "prefetch",
    "beforePopState"
];
// Events is a static property on the router, the router doesn't have to be initialized to use it
Object.defineProperty(singletonRouter, "events", {
    get () {
        return _router.default.events;
    }
});
function getRouter() {
    if (!singletonRouter.router) {
        const message = "No router instance found.\n" + 'You should only use "next/router" on the client side of your app.\n';
        throw new Error(message);
    }
    return singletonRouter.router;
}
urlPropertyFields.forEach((field)=>{
    // Here we need to use Object.defineProperty because we need to return
    // the property assigned to the actual router
    // The value might get changed as we change routes and this is the
    // proper way to access it
    Object.defineProperty(singletonRouter, field, {
        get () {
            const router = getRouter();
            return router[field];
        }
    });
});
coreMethodFields.forEach((field)=>{
    singletonRouter[field] = function() {
        for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
            args[_key] = arguments[_key];
        }
        const router = getRouter();
        return router[field](...args);
    };
});
routerEvents.forEach((event)=>{
    singletonRouter.ready(()=>{
        _router.default.events.on(event, function() {
            for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
                args[_key] = arguments[_key];
            }
            const eventField = "on".concat(event.charAt(0).toUpperCase()).concat(event.substring(1));
            const _singletonRouter = singletonRouter;
            if (_singletonRouter[eventField]) {
                try {
                    _singletonRouter[eventField](...args);
                } catch (err) {
                    console.error("Error when running the Router event: ".concat(eventField));
                    console.error((0, _isError).default(err) ? "".concat(err.message, "\n").concat(err.stack) : err + "");
                }
            }
        });
    });
});
var _default = singletonRouter;
exports["default"] = _default;
function useRouter() {
    const router = _react.default.useContext(_routerContext.RouterContext);
    if (!router) {
        throw new Error("Error: NextRouter was not mounted. https://nextjs.org/docs/messages/next-router-not-mounted");
    }
    return router;
}
function createRouter() {
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
        args[_key] = arguments[_key];
    }
    singletonRouter.router = new _router.default(...args);
    singletonRouter.readyCallbacks.forEach((cb)=>cb());
    singletonRouter.readyCallbacks = [];
    return singletonRouter.router;
}
function makePublicRouterInstance(router) {
    const scopedRouter = router;
    const instance = {};
    for (const property of urlPropertyFields){
        if (typeof scopedRouter[property] === "object") {
            instance[property] = Object.assign(Array.isArray(scopedRouter[property]) ? [] : {}, scopedRouter[property]) // makes sure query is not stateful
            ;
            continue;
        }
        instance[property] = scopedRouter[property];
    }
    // Events is a static property on the router, the router doesn't have to be initialized to use it
    instance.events = _router.default.events;
    coreMethodFields.forEach((field)=>{
        instance[field] = function() {
            for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
                args[_key] = arguments[_key];
            }
            return scopedRouter[field](...args);
        };
    });
    return instance;
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=router.js.map


/***/ }),

/***/ 3573:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

"use client";
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.handleClientScriptLoad = handleClientScriptLoad;
exports.initScriptLoader = initScriptLoader;
exports["default"] = void 0;
var _extends = (__webpack_require__(6495)/* ["default"] */ .Z);
var _interop_require_default = (__webpack_require__(2648)/* ["default"] */ .Z);
var _interop_require_wildcard = (__webpack_require__(1598)/* ["default"] */ .Z);
var _object_without_properties_loose = (__webpack_require__(7273)/* ["default"] */ .Z);
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
    // Script has already loaded
    if (cacheKey && LoadCache.has(cacheKey)) {
        return;
    }
    // Contents of this script are already loading/loaded
    if (ScriptCache.has(src)) {
        LoadCache.add(cacheKey);
        // It is possible that multiple `next/script` components all have same "src", but has different "onLoad"
        // This is to make sure the same remote script will only load once, but "onLoad" are executed in order
        ScriptCache.get(src).then(onLoad, onError);
        return;
    }
    /** Execute after the script first loaded */ const afterLoad = ()=>{
        // Run onReady for the first time after load event
        if (onReady) {
            onReady();
        }
        // add cacheKey to LoadCache when load successfully
        LoadCache.add(cacheKey);
    };
    const el = document.createElement("script");
    const loadPromise = new Promise((resolve, reject)=>{
        el.addEventListener("load", function(e) {
            resolve();
            if (onLoad) {
                onLoad.call(this, e);
            }
            afterLoad();
        });
        el.addEventListener("error", function(e) {
            reject(e);
        });
    }).catch(function(e) {
        if (onError) {
            onError(e);
        }
    });
    if (dangerouslySetInnerHTML) {
        el.innerHTML = dangerouslySetInnerHTML.__html || "";
        afterLoad();
    } else if (children) {
        el.textContent = typeof children === "string" ? children : Array.isArray(children) ? children.join("") : "";
        afterLoad();
    } else if (src) {
        el.src = src;
        // do not add cacheKey into LoadCache for remote script here
        // cacheKey will be added to LoadCache when it is actually loaded (see loadPromise above)
        ScriptCache.set(src, loadPromise);
    }
    for (const [k, value] of Object.entries(props)){
        if (value === undefined || ignoreProps.includes(k)) {
            continue;
        }
        const attr = _headManager.DOMAttributeNames[k] || k.toLowerCase();
        el.setAttribute(attr, value);
    }
    if (strategy === "worker") {
        el.setAttribute("type", "text/partytown");
    }
    el.setAttribute("data-nscript", strategy);
    document.body.appendChild(el);
};
function handleClientScriptLoad(props) {
    const { strategy ="afterInteractive"  } = props;
    if (strategy === "lazyOnload") {
        window.addEventListener("load", ()=>{
            (0, _requestIdleCallback).requestIdleCallback(()=>loadScript(props));
        });
    } else {
        loadScript(props);
    }
}
function loadLazyScript(props) {
    if (document.readyState === "complete") {
        (0, _requestIdleCallback).requestIdleCallback(()=>loadScript(props));
    } else {
        window.addEventListener("load", ()=>{
            (0, _requestIdleCallback).requestIdleCallback(()=>loadScript(props));
        });
    }
}
function addBeforeInteractiveToCache() {
    const scripts = [
        ...document.querySelectorAll('[data-nscript="beforeInteractive"]'),
        ...document.querySelectorAll('[data-nscript="beforePageRender"]')
    ];
    scripts.forEach((script)=>{
        const cacheKey = script.id || script.getAttribute("src");
        LoadCache.add(cacheKey);
    });
}
function initScriptLoader(scriptLoaderItems) {
    scriptLoaderItems.forEach(handleClientScriptLoad);
    addBeforeInteractiveToCache();
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
    // Context is available only during SSR
    const { updateScripts , scripts , getIsSsr , appDir , nonce  } = (0, _react).useContext(_headManagerContext.HeadManagerContext);
    /**
   * - First mount:
   *   1. The useEffect for onReady executes
   *   2. hasOnReadyEffectCalled.current is false, but the script hasn't loaded yet (not in LoadCache)
   *      onReady is skipped, set hasOnReadyEffectCalled.current to true
   *   3. The useEffect for loadScript executes
   *   4. hasLoadScriptEffectCalled.current is false, loadScript executes
   *      Once the script is loaded, the onLoad and onReady will be called by then
   *   [If strict mode is enabled / is wrapped in <OffScreen /> component]
   *   5. The useEffect for onReady executes again
   *   6. hasOnReadyEffectCalled.current is true, so entire effect is skipped
   *   7. The useEffect for loadScript executes again
   *   8. hasLoadScriptEffectCalled.current is true, so entire effect is skipped
   *
   * - Second mount:
   *   1. The useEffect for onReady executes
   *   2. hasOnReadyEffectCalled.current is false, but the script has already loaded (found in LoadCache)
   *      onReady is called, set hasOnReadyEffectCalled.current to true
   *   3. The useEffect for loadScript executes
   *   4. The script is already loaded, loadScript bails out
   *   [If strict mode is enabled / is wrapped in <OffScreen /> component]
   *   5. The useEffect for onReady executes again
   *   6. hasOnReadyEffectCalled.current is true, so entire effect is skipped
   *   7. The useEffect for loadScript executes again
   *   8. hasLoadScriptEffectCalled.current is true, so entire effect is skipped
   */ const hasOnReadyEffectCalled = (0, _react).useRef(false);
    (0, _react).useEffect(()=>{
        const cacheKey = id || src;
        if (!hasOnReadyEffectCalled.current) {
            // Run onReady if script has loaded before but component is re-mounted
            if (onReady && cacheKey && LoadCache.has(cacheKey)) {
                onReady();
            }
            hasOnReadyEffectCalled.current = true;
        }
    }, [
        onReady,
        id,
        src
    ]);
    const hasLoadScriptEffectCalled = (0, _react).useRef(false);
    (0, _react).useEffect(()=>{
        if (!hasLoadScriptEffectCalled.current) {
            if (strategy === "afterInteractive") {
                loadScript(props);
            } else if (strategy === "lazyOnload") {
                loadLazyScript(props);
            }
            hasLoadScriptEffectCalled.current = true;
        }
    }, [
        props,
        strategy
    ]);
    if (strategy === "beforeInteractive" || strategy === "worker") {
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
        } else if (getIsSsr && getIsSsr()) {
            // Script has already loaded during SSR
            LoadCache.add(id || src);
        } else if (getIsSsr && !getIsSsr()) {
            loadScript(props);
        }
    }
    // For the app directory, we need React Float to preload these scripts.
    if (appDir) {
        // Before interactive scripts need to be loaded by Next.js' runtime instead
        // of native <script> tags, because they no longer have `defer`.
        if (strategy === "beforeInteractive") {
            if (!src) {
                // For inlined scripts, we put the content in `children`.
                if (restProps.dangerouslySetInnerHTML) {
                    restProps.children = restProps.dangerouslySetInnerHTML.__html;
                    delete restProps.dangerouslySetInnerHTML;
                }
                return /*#__PURE__*/ _react.default.createElement("script", {
                    nonce: nonce,
                    dangerouslySetInnerHTML: {
                        __html: "(self.__next_s=self.__next_s||[]).push(".concat(JSON.stringify([
                            0,
                            _extends({}, restProps)
                        ]), ")")
                    }
                });
            }
            // @ts-ignore
            _reactDom.default.preload(src, restProps.integrity ? {
                as: "script",
                integrity: restProps.integrity
            } : {
                as: "script"
            });
            return /*#__PURE__*/ _react.default.createElement("script", {
                nonce: nonce,
                dangerouslySetInnerHTML: {
                    __html: "(self.__next_s=self.__next_s||[]).push(".concat(JSON.stringify([
                        src
                    ]), ")")
                }
            });
        } else if (strategy === "afterInteractive") {
            if (src) {
                // @ts-ignore
                _reactDom.default.preload(src, restProps.integrity ? {
                    as: "script",
                    integrity: restProps.integrity
                } : {
                    as: "script"
                });
            }
        }
    }
    return null;
}
Object.defineProperty(Script, "__nextScript", {
    value: true
});
var _default = Script;
exports["default"] = _default;
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=script.js.map


/***/ }),

/***/ 5407:
/***/ (function(module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.__unsafeCreateTrustedScriptURL = __unsafeCreateTrustedScriptURL;
/**
 * Stores the Trusted Types Policy. Starts as undefined and can be set to null
 * if Trusted Types is not supported in the browser.
 */ let policy;
/**
 * Getter for the Trusted Types Policy. If it is undefined, it is instantiated
 * here or set to null if Trusted Types is not supported in the browser.
 */ function getPolicy() {
    if (typeof policy === "undefined" && "object" !== "undefined") {
        var ref;
        policy = ((ref = window.trustedTypes) == null ? void 0 : ref.createPolicy("nextjs", {
            createHTML: (input)=>input,
            createScript: (input)=>input,
            createScriptURL: (input)=>input
        })) || null;
    }
    return policy;
}
function __unsafeCreateTrustedScriptURL(url) {
    var ref;
    return ((ref = getPolicy()) == null ? void 0 : ref.createScriptURL(url)) || url;
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=trusted-types.js.map


/***/ }),

/***/ 9977:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = withRouter;
var _interop_require_default = (__webpack_require__(2648)/* ["default"] */ .Z);
var _react = _interop_require_default(__webpack_require__(7294));
var _router = __webpack_require__(880);
function withRouter(ComposedComponent) {
    function WithRouterWrapper(props) {
        return /*#__PURE__*/ _react.default.createElement(ComposedComponent, Object.assign({
            router: (0, _router).useRouter()
        }, props));
    }
    WithRouterWrapper.getInitialProps = ComposedComponent.getInitialProps;
    WithRouterWrapper.origGetInitialProps = ComposedComponent.origGetInitialProps;
    if (false) {}
    return WithRouterWrapper;
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=with-router.js.map


/***/ }),

/***/ 4297:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = void 0;
var _async_to_generator = (__webpack_require__(932)/* ["default"] */ .Z);
var _interop_require_default = (__webpack_require__(2648)/* ["default"] */ .Z);
var _react = _interop_require_default(__webpack_require__(7294));
var _utils = __webpack_require__(670);
function appGetInitialProps(_) {
    return _appGetInitialProps.apply(this, arguments);
}
function _appGetInitialProps() {
    _appGetInitialProps = /**
 * `App` component is used for initialize of pages. It allows for overwriting and full control of the `page` initialization.
 * This allows for keeping state between navigation, custom error handling, injecting additional data.
 */ _async_to_generator(function*(param) {
        let { Component , ctx  } = param;
        const pageProps = yield (0, _utils).loadGetInitialProps(Component, ctx);
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
        return /*#__PURE__*/ _react.default.createElement(Component, Object.assign({}, pageProps));
    }
}
App.origGetInitialProps = appGetInitialProps;
App.getInitialProps = appGetInitialProps;
exports["default"] = App; //# sourceMappingURL=_app.js.map


/***/ }),

/***/ 67:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = void 0;
var _interop_require_default = (__webpack_require__(2648)/* ["default"] */ .Z);
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
class Error extends (_Component = _react.default.Component) {
    render() {
        const { statusCode , withDarkMode =true  } = this.props;
        const title = this.props.title || statusCodes[statusCode] || "An unexpected error has occurred";
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
Error.displayName = "ErrorPage";
Error.getInitialProps = _getInitialProps;
Error.origGetInitialProps = _getInitialProps;
exports["default"] = Error; //# sourceMappingURL=_error.js.map


/***/ }),

/***/ 610:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.AmpStateContext = void 0;
var _interop_require_default = (__webpack_require__(2648)/* ["default"] */ .Z);
var _react = _interop_require_default(__webpack_require__(7294));
const AmpStateContext = _react.default.createContext({});
exports.AmpStateContext = AmpStateContext;
if (false) {} //# sourceMappingURL=amp-context.js.map


/***/ }),

/***/ 532:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.isInAmpMode = isInAmpMode;
function isInAmpMode() {
    let { ampFirst =false , hybrid =false , hasQuery =false  } = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    return ampFirst || hybrid && hasQuery;
} //# sourceMappingURL=amp-mode.js.map


/***/ }),

/***/ 8245:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

"use client";
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.TemplateContext = exports.GlobalLayoutRouterContext = exports.LayoutRouterContext = exports.AppRouterContext = exports.CacheStates = void 0;
var _interop_require_default = (__webpack_require__(2648)/* ["default"] */ .Z);
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
if (false) {} //# sourceMappingURL=app-router-context.js.map


/***/ }),

/***/ 8659:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.escapeStringRegexp = escapeStringRegexp;
// regexp is based on https://github.com/sindresorhus/escape-string-regexp
const reHasRegExp = /[|\\{}()[\]^$+*?.-]/;
const reReplaceRegExp = /[|\\{}()[\]^$+*?.-]/g;
function escapeStringRegexp(str) {
    // see also: https://github.com/lodash/lodash/blob/2da024c3b4f9947a48517639de7560457cd4ec6c/escapeRegExp.js#L23
    if (reHasRegExp.test(str)) {
        return str.replace(reReplaceRegExp, "\\$&");
    }
    return str;
} //# sourceMappingURL=escape-regexp.js.map


/***/ }),

/***/ 4664:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.HeadManagerContext = void 0;
var _interop_require_default = (__webpack_require__(2648)/* ["default"] */ .Z);
var _react = _interop_require_default(__webpack_require__(7294));
const HeadManagerContext = _react.default.createContext({});
exports.HeadManagerContext = HeadManagerContext;
if (false) {} //# sourceMappingURL=head-manager-context.js.map


/***/ }),

/***/ 3121:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

"use client";
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.defaultHead = defaultHead;
exports["default"] = void 0;
var _extends = (__webpack_require__(6495)/* ["default"] */ .Z);
var _interop_require_default = (__webpack_require__(2648)/* ["default"] */ .Z);
var _interop_require_wildcard = (__webpack_require__(1598)/* ["default"] */ .Z);
var _react = _interop_require_wildcard(__webpack_require__(7294));
var _sideEffect = _interop_require_default(__webpack_require__(1436));
var _ampContext = __webpack_require__(610);
var _headManagerContext = __webpack_require__(4664);
var _ampMode = __webpack_require__(532);
var _warnOnce = __webpack_require__(7238);
"use client";
function defaultHead() {
    let inAmpMode = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
    const head = [
        /*#__PURE__*/ _react.default.createElement("meta", {
            charSet: "utf-8"
        })
    ];
    if (!inAmpMode) {
        head.push(/*#__PURE__*/ _react.default.createElement("meta", {
            name: "viewport",
            content: "width=device-width"
        }));
    }
    return head;
}
function onlyReactElement(list, child) {
    // React children can be "string" or "number" in this case we ignore them for backwards compat
    if (typeof child === "string" || typeof child === "number") {
        return list;
    }
    // Adds support for React.Fragment
    if (child.type === _react.default.Fragment) {
        return list.concat(_react.default.Children.toArray(child.props.children).reduce((fragmentList, fragmentChild)=>{
            if (typeof fragmentChild === "string" || typeof fragmentChild === "number") {
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
/*
 returns a function for filtering head child elements
 which shouldn't be duplicated, like <title/>
 Also adds support for deduplicated `key` properties
*/ function unique() {
    const keys = new Set();
    const tags = new Set();
    const metaTypes = new Set();
    const metaCategories = {};
    return (h)=>{
        let isUnique = true;
        let hasKey = false;
        if (h.key && typeof h.key !== "number" && h.key.indexOf("$") > 0) {
            hasKey = true;
            const key = h.key.slice(h.key.indexOf("$") + 1);
            if (keys.has(key)) {
                isUnique = false;
            } else {
                keys.add(key);
            }
        }
        // eslint-disable-next-line default-case
        switch(h.type){
            case "title":
            case "base":
                if (tags.has(h.type)) {
                    isUnique = false;
                } else {
                    tags.add(h.type);
                }
                break;
            case "meta":
                for(let i = 0, len = METATYPES.length; i < len; i++){
                    const metatype = METATYPES[i];
                    if (!h.props.hasOwnProperty(metatype)) continue;
                    if (metatype === "charSet") {
                        if (metaTypes.has(metatype)) {
                            isUnique = false;
                        } else {
                            metaTypes.add(metatype);
                        }
                    } else {
                        const category = h.props[metatype];
                        const categories = metaCategories[metatype] || new Set();
                        if ((metatype !== "name" || !hasKey) && categories.has(category)) {
                            isUnique = false;
                        } else {
                            categories.add(category);
                            metaCategories[metatype] = categories;
                        }
                    }
                }
                break;
        }
        return isUnique;
    };
}
/**
 *
 * @param headChildrenElements List of children of <Head>
 */ function reduceComponents(headChildrenElements, props) {
    const { inAmpMode  } = props;
    return headChildrenElements.reduce(onlyReactElement, []).reverse().concat(defaultHead(inAmpMode).reverse()).filter(unique()).reverse().map((c, i)=>{
        const key = c.key || i;
        if ( true && !inAmpMode) {
            if (c.type === "link" && c.props["href"] && // TODO(prateekbh@): Replace this with const from `constants` when the tree shaking works.
            [
                "https://fonts.googleapis.com/css",
                "https://use.typekit.net/"
            ].some((url)=>c.props["href"].startsWith(url))) {
                const newProps = _extends({}, c.props || {});
                newProps["data-href"] = newProps["href"];
                newProps["href"] = undefined;
                // Add this attribute to make it easy to identify optimized tags
                newProps["data-optimized-fonts"] = true;
                return /*#__PURE__*/ _react.default.cloneElement(c, newProps);
            }
        }
        if (false) {}
        return /*#__PURE__*/ _react.default.cloneElement(c, {
            key
        });
    });
}
/**
 * This component injects elements to `<head>` of your page.
 * To avoid duplicated `tags` in `<head>` you can use the `key` property, which will make sure every tag is only rendered once.
 */ function Head(param) {
    let { children  } = param;
    const ampState = (0, _react).useContext(_ampContext.AmpStateContext);
    const headManager = (0, _react).useContext(_headManagerContext.HeadManagerContext);
    return /*#__PURE__*/ _react.default.createElement(_sideEffect.default, {
        reduceComponentsToState: reduceComponents,
        headManager: headManager,
        inAmpMode: (0, _ampMode).isInAmpMode(ampState)
    }, children);
}
var _default = Head;
exports["default"] = _default;
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=head.js.map


/***/ }),

/***/ 8914:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

"use client";
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.LayoutSegmentsContext = exports.ParamsContext = exports.PathnameContext = exports.SearchParamsContext = void 0;
var _react = __webpack_require__(7294);
"use client";
const SearchParamsContext = (0, _react).createContext(null);
exports.SearchParamsContext = SearchParamsContext;
const PathnameContext = (0, _react).createContext(null);
exports.PathnameContext = PathnameContext;
const ParamsContext = (0, _react).createContext(null);
exports.ParamsContext = ParamsContext;
const LayoutSegmentsContext = (0, _react).createContext(null);
exports.LayoutSegmentsContext = LayoutSegmentsContext;
if (false) {} //# sourceMappingURL=hooks-client-context.js.map


/***/ }),

/***/ 4769:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.normalizeLocalePath = normalizeLocalePath;
function normalizeLocalePath(pathname, locales) {
    let detectedLocale;
    // first item will be empty string from splitting at first char
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
} //# sourceMappingURL=normalize-locale-path.js.map


/***/ }),

/***/ 8730:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.ImageConfigContext = void 0;
var _interop_require_default = (__webpack_require__(2648)/* ["default"] */ .Z);
var _react = _interop_require_default(__webpack_require__(7294));
var _imageConfig = __webpack_require__(139);
const ImageConfigContext = _react.default.createContext(_imageConfig.imageConfigDefault);
exports.ImageConfigContext = ImageConfigContext;
if (false) {} //# sourceMappingURL=image-config-context.js.map


/***/ }),

/***/ 139:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.imageConfigDefault = exports.VALID_LOADERS = void 0;
const VALID_LOADERS = [
    "default",
    "imgix",
    "cloudinary",
    "akamai",
    "custom"
];
exports.VALID_LOADERS = VALID_LOADERS;
const imageConfigDefault = {
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
exports.imageConfigDefault = imageConfigDefault; //# sourceMappingURL=image-config.js.map


/***/ }),

/***/ 2849:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.getObjectClassLabel = getObjectClassLabel;
exports.isPlainObject = isPlainObject;
function getObjectClassLabel(value) {
    return Object.prototype.toString.call(value);
}
function isPlainObject(value) {
    if (getObjectClassLabel(value) !== "[object Object]") {
        return false;
    }
    const prototype = Object.getPrototypeOf(value);
    /**
   * this used to be previously:
   *
   * `return prototype === null || prototype === Object.prototype`
   *
   * but Edge Runtime expose Object from vm, being that kind of type-checking wrongly fail.
   *
   * It was changed to the current implementation since it's resilient to serialization.
   */ return prototype === null || prototype.hasOwnProperty("isPrototypeOf");
} //# sourceMappingURL=is-plain-object.js.map


/***/ }),

/***/ 8550:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = mitt;
function mitt() {
    const all = Object.create(null);
    return {
        on (type, handler) {
            (all[type] || (all[type] = [])).push(handler);
        },
        off (type, handler) {
            if (all[type]) {
                all[type].splice(all[type].indexOf(handler) >>> 0, 1);
            }
        },
        emit (type) {
            for(var _len = arguments.length, evts = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
                evts[_key - 1] = arguments[_key];
            }
            (all[type] || []).slice().map((handler)=>{
                handler(...evts);
            });
        }
    };
} //# sourceMappingURL=mitt.js.map


/***/ }),

/***/ 6301:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.denormalizePagePath = denormalizePagePath;
var _utils = __webpack_require__(8588);
var _normalizePathSep = __webpack_require__(9997);
function denormalizePagePath(page) {
    let _page = (0, _normalizePathSep).normalizePathSep(page);
    return _page.startsWith("/index/") && !(0, _utils).isDynamicRoute(_page) ? _page.slice(6) : _page !== "/index" ? _page : "/";
} //# sourceMappingURL=denormalize-page-path.js.map


/***/ }),

/***/ 9997:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.normalizePathSep = normalizePathSep;
function normalizePathSep(path) {
    return path.replace(/\\/g, "/");
} //# sourceMappingURL=normalize-path-sep.js.map


/***/ }),

/***/ 2692:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.RouterContext = void 0;
var _interop_require_default = (__webpack_require__(2648)/* ["default"] */ .Z);
var _react = _interop_require_default(__webpack_require__(7294));
const RouterContext = _react.default.createContext(null);
exports.RouterContext = RouterContext;
if (false) {} //# sourceMappingURL=router-context.js.map


/***/ }),

/***/ 401:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.adaptForAppRouterInstance = adaptForAppRouterInstance;
exports.adaptForSearchParams = adaptForSearchParams;
exports.PathnameContextProviderAdapter = PathnameContextProviderAdapter;
var _interop_require_wildcard = (__webpack_require__(1598)/* ["default"] */ .Z);
var _object_without_properties_loose = (__webpack_require__(7273)/* ["default"] */ .Z);
var _react = _interop_require_wildcard(__webpack_require__(7294));
var _hooksClientContext = __webpack_require__(8914);
var _utils = __webpack_require__(8588);
function adaptForAppRouterInstance(router) {
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
}
/**
 * transforms the ParsedUrlQuery into a URLSearchParams.
 *
 * @param query the query to transform
 * @returns URLSearchParams
 */ function transformQuery(query) {
    const params = new URLSearchParams();
    for (const [name, value] of Object.entries(query)){
        if (Array.isArray(value)) {
            for (const val of value){
                params.append(name, val);
            }
        } else if (typeof value !== "undefined") {
            params.append(name, value);
        }
    }
    return params;
}
function adaptForSearchParams(router) {
    if (!router.isReady || !router.query) {
        return new URLSearchParams();
    }
    return transformQuery(router.query);
}
function PathnameContextProviderAdapter(_param) {
    var { children , router  } = _param, props = _object_without_properties_loose(_param, [
        "children",
        "router"
    ]);
    const ref = (0, _react).useRef(props.isAutoExport);
    const value = (0, _react).useMemo(()=>{
        // isAutoExport is only ever `true` on the first render from the server,
        // so reset it to `false` after we read it for the first time as `true`. If
        // we don't use the value, then we don't need it.
        const isAutoExport = ref.current;
        if (isAutoExport) {
            ref.current = false;
        }
        // When the route is a dynamic route, we need to do more processing to
        // determine if we need to stop showing the pathname.
        if ((0, _utils).isDynamicRoute(router.pathname)) {
            // When the router is rendering the fallback page, it can't possibly know
            // the path, so return `null` here. Read more about fallback pages over
            // at:
            // https://nextjs.org/docs/api-reference/data-fetching/get-static-paths#fallback-pages
            if (router.isFallback) {
                return null;
            }
            // When `isAutoExport` is true, meaning this is a page page has been
            // automatically statically optimized, and the router is not ready, then
            // we can't know the pathname yet. Read more about automatic static
            // optimization at:
            // https://nextjs.org/docs/advanced-features/automatic-static-optimization
            if (isAutoExport && !router.isReady) {
                return null;
            }
        }
        // The `router.asPath` contains the pathname seen by the browser (including
        // any query strings), so it should have that stripped. Read more about the
        // `asPath` option over at:
        // https://nextjs.org/docs/api-reference/next/router#router-object
        const url = new URL(router.asPath, "http://f");
        return url.pathname;
    }, [
        router.asPath,
        router.isFallback,
        router.isReady,
        router.pathname
    ]);
    return /*#__PURE__*/ _react.default.createElement(_hooksClientContext.PathnameContext.Provider, {
        value: value
    }, children);
} //# sourceMappingURL=adapters.js.map


/***/ }),

/***/ 1003:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.matchesMiddleware = matchesMiddleware;
exports.isLocalURL = isLocalURL;
exports.interpolateAs = interpolateAs;
exports.resolveHref = resolveHref;
exports.createKey = createKey;
exports["default"] = void 0;
var _async_to_generator = (__webpack_require__(932)/* ["default"] */ .Z);
var _extends = (__webpack_require__(6495)/* ["default"] */ .Z);
var _interop_require_default = (__webpack_require__(2648)/* ["default"] */ .Z);
var _interop_require_wildcard = (__webpack_require__(1598)/* ["default"] */ .Z);
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
    return Object.assign(new Error("Route Cancelled"), {
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
        const { pathname: asPathname  } = (0, _parsePath).parsePath(options.asPath);
        // remove basePath first since path prefix has to be in the order of `/${basePath}/${locale}`
        const cleanedAs = (0, _hasBasePath).hasBasePath(asPathname) ? (0, _removeBasePath).removeBasePath(asPathname) : asPathname;
        const asWithBasePathAndLocale = (0, _addBasePath).addBasePath((0, _addLocale).addLocale(cleanedAs, options.locale));
        // Check only path match on client. Matching "has" should be done on server
        // where we can access more info such as headers, HttpOnly cookie, etc.
        return matchers.some((m)=>new RegExp(m.regexp).test(asWithBasePathAndLocale));
    });
    return _matchesMiddleware.apply(this, arguments);
}
function stripOrigin(url) {
    const origin = (0, _utils).getLocationOrigin();
    return url.startsWith(origin) ? url.substring(origin.length) : url;
}
function omit(object, keys) {
    const omitted = {};
    Object.keys(object).forEach((key)=>{
        if (!keys.includes(key)) {
            omitted[key] = object[key];
        }
    });
    return omitted;
}
function isLocalURL(url) {
    // prevent a hydration mismatch on href for url with anchor refs
    if (!(0, _utils).isAbsoluteUrl(url)) return true;
    try {
        // absolute urls can be local if they are on the same origin
        const locationOrigin = (0, _utils).getLocationOrigin();
        const resolved = new URL(url, locationOrigin);
        return resolved.origin === locationOrigin && (0, _hasBasePath).hasBasePath(resolved.pathname);
    } catch (_) {
        return false;
    }
}
function interpolateAs(route, asPathname, query) {
    let interpolatedRoute = "";
    const dynamicRegex = (0, _routeRegex).getRouteRegex(route);
    const dynamicGroups = dynamicRegex.groups;
    const dynamicMatches = (asPathname !== route ? (0, _routeMatcher).getRouteMatcher(dynamicRegex)(asPathname) : "") || // Fall back to reading the values from the href
    // TODO: should this take priority; also need to change in the router.
    query;
    interpolatedRoute = route;
    const params = Object.keys(dynamicGroups);
    if (!params.every((param)=>{
        let value = dynamicMatches[param] || "";
        const { repeat , optional  } = dynamicGroups[param];
        // support single-level catch-all
        // TODO: more robust handling for user-error (passing `/`)
        let replaced = "[".concat(repeat ? "..." : "").concat(param, "]");
        if (optional) {
            replaced = "".concat(!value ? "/" : "", "[").concat(replaced, "]");
        }
        if (repeat && !Array.isArray(value)) value = [
            value
        ];
        return (optional || param in dynamicMatches) && // Interpolate group into data URL if present
        (interpolatedRoute = interpolatedRoute.replace(replaced, repeat ? value.map(// path delimiter escaped since they are being inserted
        // into the URL and we expect URL encoded segments
        // when parsing dynamic route params
        (segment)=>encodeURIComponent(segment)).join("/") : encodeURIComponent(value)) || "/");
    })) {
        interpolatedRoute = "" // did not satisfy all requirements
        ;
    // n.b. We ignore this error because we handle warning for this case in
    // development in the `<Link>` component directly.
    }
    return {
        params,
        result: interpolatedRoute
    };
}
function resolveHref(router, href, resolveAs) {
    // we use a dummy base url for relative urls
    let base;
    let urlAsString = typeof href === "string" ? href : (0, _formatUrl).formatWithValidation(href);
    // repeated slashes and backslashes in the URL are considered
    // invalid and will never match a Next.js page/file
    const urlProtoMatch = urlAsString.match(/^[a-zA-Z]{1,}:\/\//);
    const urlAsStringNoProto = urlProtoMatch ? urlAsString.slice(urlProtoMatch[0].length) : urlAsString;
    const urlParts = urlAsStringNoProto.split("?");
    if ((urlParts[0] || "").match(/(\/\/|\\)/)) {
        console.error("Invalid href passed to next/router: ".concat(urlAsString, ", repeated forward-slashes (//) or backslashes \\ are not valid in the href"));
        const normalizedUrl = (0, _utils).normalizeRepeatedSlashes(urlAsStringNoProto);
        urlAsString = (urlProtoMatch ? urlProtoMatch[0] : "") + normalizedUrl;
    }
    // Return because it cannot be routed by the Next.js router
    if (!isLocalURL(urlAsString)) {
        return resolveAs ? [
            urlAsString
        ] : urlAsString;
    }
    try {
        base = new URL(urlAsString.startsWith("#") ? router.asPath : router.pathname, "http://n");
    } catch (_) {
        // fallback to / for invalid asPath values e.g. //
        base = new URL("/", "http://n");
    }
    try {
        const finalUrl = new URL(urlAsString, base);
        finalUrl.pathname = (0, _normalizeTrailingSlash).normalizePathTrailingSlash(finalUrl.pathname);
        let interpolatedAs = "";
        if ((0, _isDynamic).isDynamicRoute(finalUrl.pathname) && finalUrl.searchParams && resolveAs) {
            const query = (0, _querystring).searchParamsToUrlQuery(finalUrl.searchParams);
            const { result , params  } = interpolateAs(finalUrl.pathname, finalUrl.pathname, query);
            if (result) {
                interpolatedAs = (0, _formatUrl).formatWithValidation({
                    pathname: result,
                    hash: finalUrl.hash,
                    query: omit(query, params)
                });
            }
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
    let [resolvedHref, resolvedAs] = resolveHref(router, url, true);
    const origin = (0, _utils).getLocationOrigin();
    const hrefHadOrigin = resolvedHref.startsWith(origin);
    const asHadOrigin = resolvedAs && resolvedAs.startsWith(origin);
    resolvedHref = stripOrigin(resolvedHref);
    resolvedAs = resolvedAs ? stripOrigin(resolvedAs) : resolvedAs;
    const preparedUrl = hrefHadOrigin ? resolvedHref : (0, _addBasePath).addBasePath(resolvedHref);
    const preparedAs = as ? stripOrigin(resolveHref(router, as)) : resolvedAs || resolvedHref;
    return {
        url: preparedUrl,
        as: asHadOrigin ? preparedAs : (0, _addBasePath).addBasePath(preparedAs)
    };
}
function resolveDynamicRoute(pathname, pages) {
    const cleanPathname = (0, _removeTrailingSlash).removeTrailingSlash((0, _denormalizePagePath).denormalizePagePath(pathname));
    if (cleanPathname === "/404" || cleanPathname === "/_error") {
        return pathname;
    }
    // handle resolving href for dynamic routes
    if (!pages.includes(cleanPathname)) {
        // eslint-disable-next-line array-callback-return
        pages.some((page)=>{
            if ((0, _isDynamic).isDynamicRoute(page) && (0, _routeRegex).getRouteRegex(page).re.test(cleanPathname)) {
                pathname = page;
                return true;
            }
        });
    }
    return (0, _removeTrailingSlash).removeTrailingSlash(pathname);
}
function getMiddlewareData(source, response, options) {
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
    if (matchedPath && !rewriteTarget && !matchedPath.includes("__next_data_catchall") && !matchedPath.includes("/_error") && !matchedPath.includes("/404")) {
        // leverage x-matched-path to detect next.config.js rewrites
        rewriteTarget = matchedPath;
    }
    if (rewriteTarget) {
        if (rewriteTarget.startsWith("/")) {
            const parsedRewriteTarget = (0, _parseRelativeUrl).parseRelativeUrl(rewriteTarget);
            const pathnameInfo = (0, _getNextPathnameInfo).getNextPathnameInfo(parsedRewriteTarget.pathname, {
                nextConfig,
                parseData: true
            });
            let fsPathname = (0, _removeTrailingSlash).removeTrailingSlash(pathnameInfo.pathname);
            return Promise.all([
                options.router.pageLoader.getPageList(),
                (0, _routeLoader).getClientBuildManifest()
            ]).then((param)=>{
                let [pages, { __rewrites: rewrites  }] = param;
                let as = (0, _addLocale).addLocale(pathnameInfo.pathname, pathnameInfo.locale);
                if ((0, _isDynamic).isDynamicRoute(as) || !rewriteHeader && pages.includes((0, _normalizeLocalePath).normalizeLocalePath((0, _removeBasePath).removeBasePath(as), options.router.locales).pathname)) {
                    const parsedSource = (0, _getNextPathnameInfo).getNextPathnameInfo((0, _parseRelativeUrl).parseRelativeUrl(source).pathname, {
                        parseData: true
                    });
                    as = (0, _addBasePath).addBasePath(parsedSource.pathname);
                    parsedRewriteTarget.pathname = as;
                }
                if (false) {} else if (!pages.includes(fsPathname)) {
                    const resolvedPathname = resolveDynamicRoute(fsPathname, pages);
                    if (resolvedPathname !== fsPathname) {
                        fsPathname = resolvedPathname;
                    }
                }
                const resolvedHref = !pages.includes(fsPathname) ? resolveDynamicRoute((0, _normalizeLocalePath).normalizeLocalePath((0, _removeBasePath).removeBasePath(parsedRewriteTarget.pathname), options.router.locales).pathname, pages) : fsPathname;
                if ((0, _isDynamic).isDynamicRoute(resolvedHref)) {
                    const matches = (0, _routeMatcher).getRouteMatcher((0, _routeRegex).getRouteRegex(resolvedHref))(as);
                    Object.assign(parsedRewriteTarget.query, matches || {});
                }
                return {
                    type: "rewrite",
                    parsedAs: parsedRewriteTarget,
                    resolvedHref
                };
            });
        }
        const src = (0, _parsePath).parsePath(source);
        const pathname = (0, _formatNextPathnameInfo).formatNextPathnameInfo(_extends({}, (0, _getNextPathnameInfo).getNextPathnameInfo(src.pathname, {
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
            const src1 = (0, _parsePath).parsePath(redirectTarget);
            const pathname1 = (0, _formatNextPathnameInfo).formatNextPathnameInfo(_extends({}, (0, _getNextPathnameInfo).getNextPathnameInfo(src1.pathname, {
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
}
function withMiddlewareEffects(options) {
    return matchesMiddleware(options).then((matches)=>{
        if (matches && options.fetchData) {
            return options.fetchData().then((data)=>getMiddlewareData(data.dataHref, data.response, options).then((effect)=>({
                        dataHref: data.dataHref,
                        cacheKey: data.cacheKey,
                        json: data.json,
                        response: data.response,
                        text: data.text,
                        effect
                    }))).catch((_err)=>{
                /**
           * TODO: Revisit this in the future.
           * For now we will not consider middleware data errors to be fatal.
           * maybe we should revisit in the future.
           */ return null;
            });
        }
        return null;
    });
}
const manualScrollRestoration = (/* unused pure expression or super */ null && ( false && 0));
const SSG_DATA_NOT_FOUND = Symbol("SSG_DATA_NOT_FOUND");
function fetchRetry(url, attempts, options) {
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
    }).then((response)=>{
        return !response.ok && attempts > 1 && response.status >= 500 ? fetchRetry(url, attempts - 1, options) : response;
    });
}
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
        return fetchRetry(dataHref, isServerRender ? 3 : 1, {
            headers: isPrefetch ? {
                purpose: "prefetch"
            } : {},
            method: (ref1 = params == null ? void 0 : params.method) != null ? ref1 : "GET"
        }).then((response)=>{
            if (response.ok && (params == null ? void 0 : params.method) === "HEAD") {
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
                    ].includes(response.status)) {
                        return {
                            dataHref,
                            response,
                            text,
                            json: {},
                            cacheKey
                        };
                    }
                    if (!hasMiddleware && response.status === 404) {
                        var ref;
                        if ((ref = tryToParseAsJSON(text)) == null ? void 0 : ref.notFound) {
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
                    const error = new Error("Failed to load static props");
                    /**
             * We should only trigger a server-side transition if this was
             * caused on a client-side transition. Otherwise, we'd get into
             * an infinite loop.
             */ if (!isServerRender) {
                        (0, _routeLoader).markAssetError(error);
                    }
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
            if (!persistCache || "production" !== "production" || data.response.headers.get("x-middleware-cache") === "no-cache") {
                delete inflightCache[cacheKey];
            }
            return data;
        }).catch((err)=>{
            delete inflightCache[cacheKey];
            throw err;
        });
    };
    // when skipping client cache we wait to update
    // inflight cache until successful data response
    // this allows racing click event with fetching newer data
    // without blocking navigation when stale data is available
    if (unstable_skipClientCache && persistCache) {
        return getData({}).then((data)=>{
            inflightCache[cacheKey] = Promise.resolve(data);
            return data;
        });
    }
    if (inflightCache[cacheKey] !== undefined) {
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
    // ensure we don't trigger a hard navigation to the same
    // URL as this can end up with an infinite refresh
    if (url === (0, _addBasePath).addBasePath((0, _addLocale).addLocale(router.asPath, router.locale))) {
        throw new Error("Invariant: attempted to hard navigate to the same URL ".concat(url, " ").concat(location.href));
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
            const error = new Error('Abort fetching component for route: "'.concat(route, '"'));
            error.cancelled = true;
            throw error;
        }
        if (cancel === router.clc) {
            router.clc = null;
        }
    };
    return handleCancelled;
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
   * Go forward in history
   */ forward() {
        window.history.forward();
    }
    /**
   * Performs a `pushState` with arguments
   * @param url of the route
   * @param as masks `url` for the browser
   * @param options object you can define `shallow` and other options
   */ push(url, as) {
        let options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
        if (false) {}
        ({ url , as  } = prepareUrlAs(this, url, as));
        return this.change("pushState", url, as, options);
    }
    /**
   * Performs a `replaceState` with arguments
   * @param url of the route
   * @param as masks `url` for the browser
   * @param options object you can define `shallow` and other options
   */ replace(url, as) {
        let options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
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
            // WARNING: `_h` is an internal option for handing Next.js client-side
            // hydration. Your app should _never_ use this property. It may change at
            // any time without notice.
            const isQueryUpdating = options._h;
            let shouldResolveHref = isQueryUpdating || options._shouldResolveHref || (0, _parsePath).parsePath(url).pathname === (0, _parsePath).parsePath(as).pathname;
            const nextState = _extends({}, _this.state);
            // for static pages with query params in the URL we delay
            // marking the router ready until after the query is updated
            // or a navigation has occurred
            const readyStateChange = _this.isReady !== true;
            _this.isReady = true;
            const isSsr = _this.isSsr;
            if (!isQueryUpdating) {
                _this.isSsr = false;
            }
            // if a route transition is already in progress before
            // the query updating is triggered ignore query updating
            if (isQueryUpdating && _this.clc) {
                return false;
            }
            const prevLocale = nextState.locale;
            if (false) { var ref; }
            // marking route changes as a navigation start entry
            if (_utils.ST) {
                performance.mark("routeChange");
            }
            const { shallow =false , scroll =true  } = options;
            const routeProps = {
                shallow
            };
            if (_this._inFlightRoute && _this.clc) {
                if (!isSsr) {
                    Router.events.emit("routeChangeError", buildCancellationError(), _this._inFlightRoute, routeProps);
                }
                _this.clc();
                _this.clc = null;
            }
            as = (0, _addBasePath).addBasePath((0, _addLocale).addLocale((0, _hasBasePath).hasBasePath(as) ? (0, _removeBasePath).removeBasePath(as) : as, options.locale, _this.defaultLocale));
            const cleanedAs = (0, _removeLocale).removeLocale((0, _hasBasePath).hasBasePath(as) ? (0, _removeBasePath).removeBasePath(as) : as, nextState.locale);
            _this._inFlightRoute = as;
            const localeChange = prevLocale !== nextState.locale;
            // If the url change is only related to a hash change
            // We should not proceed. We should only change the state.
            if (!isQueryUpdating && _this.onlyAHashChange(cleanedAs) && !localeChange) {
                nextState.asPath = cleanedAs;
                Router.events.emit("hashChangeStart", as, routeProps);
                // TODO: do we need the resolved href when only a hash change?
                _this.changeState(method, url, as, _extends({}, options, {
                    scroll: false
                }));
                if (scroll) {
                    _this.scrollToHash(cleanedAs);
                }
                try {
                    yield _this.set(nextState, _this.components[nextState.route], null);
                } catch (err) {
                    if ((0, _isError).default(err) && err.cancelled) {
                        Router.events.emit("routeChangeError", err, cleanedAs, routeProps);
                    }
                    throw err;
                }
                Router.events.emit("hashChangeComplete", as, routeProps);
                return true;
            }
            let parsed = (0, _parseRelativeUrl).parseRelativeUrl(url);
            let { pathname , query  } = parsed;
            // The build manifest needs to be loaded before auto-static dynamic pages
            // get their query parameters to allow ensuring they can be parsed properly
            // when rewritten to
            let pages, rewrites;
            try {
                [pages, { __rewrites: rewrites  }] = yield Promise.all([
                    _this.pageLoader.getPageList(),
                    (0, _routeLoader).getClientBuildManifest(),
                    _this.pageLoader.getMiddleware()
                ]);
            } catch (err1) {
                // If we fail to resolve the page list or client-build manifest, we must
                // do a server-side transition:
                handleHardNavigation({
                    url: as,
                    router: _this
                });
                return false;
            }
            // If asked to change the current URL we should reload the current page
            // (not location.reload() but reload getInitialProps and other Next.js stuffs)
            // We also need to set the method = replaceState always
            // as this should not go into the history (That's how browsers work)
            // We should compare the new asPath to the current asPath, not the url
            if (!_this.urlIsNew(cleanedAs) && !localeChange) {
                method = "replaceState";
            }
            // we need to resolve the as value using rewrites for dynamic SSG
            // pages to allow building the data URL correctly
            let resolvedAs = as;
            // url and as should always be prefixed with basePath by this
            // point by either next/link or router.push/replace so strip the
            // basePath from the pathname to match the pages dir 1-to-1
            pathname = pathname ? (0, _removeTrailingSlash).removeTrailingSlash((0, _removeBasePath).removeBasePath(pathname)) : pathname;
            // we don't attempt resolve asPath when we need to execute
            // middleware as the resolving will occur server-side
            const isMiddlewareMatch = yield matchesMiddleware({
                asPath: as,
                locale: nextState.locale,
                router: _this
            });
            if (options.shallow && isMiddlewareMatch) {
                pathname = _this.pathname;
            }
            if (isQueryUpdating && isMiddlewareMatch) {
                shouldResolveHref = false;
            }
            if (shouldResolveHref && pathname !== "/_error") {
                options._shouldResolveHref = true;
                if (false) {} else {
                    parsed.pathname = resolveDynamicRoute(pathname, pages);
                    if (parsed.pathname !== pathname) {
                        pathname = parsed.pathname;
                        parsed.pathname = (0, _addBasePath).addBasePath(pathname);
                        if (!isMiddlewareMatch) {
                            url = (0, _formatUrl).formatWithValidation(parsed);
                        }
                    }
                }
            }
            if (!isLocalURL(as)) {
                if (false) {}
                handleHardNavigation({
                    url: as,
                    router: _this
                });
                return false;
            }
            resolvedAs = (0, _removeLocale).removeLocale((0, _removeBasePath).removeBasePath(resolvedAs), nextState.locale);
            let route = (0, _removeTrailingSlash).removeTrailingSlash(pathname);
            let routeMatch = false;
            if ((0, _isDynamic).isDynamicRoute(route)) {
                const parsedAs1 = (0, _parseRelativeUrl).parseRelativeUrl(resolvedAs);
                const asPathname = parsedAs1.pathname;
                const routeRegex = (0, _routeRegex).getRouteRegex(route);
                routeMatch = (0, _routeMatcher).getRouteMatcher(routeRegex)(asPathname);
                const shouldInterpolate = route === asPathname;
                const interpolatedAs = shouldInterpolate ? interpolateAs(route, asPathname, query) : {};
                if (!routeMatch || shouldInterpolate && !interpolatedAs.result) {
                    const missingParams = Object.keys(routeRegex.groups).filter((param)=>!query[param] && !routeRegex.groups[param].optional);
                    if (missingParams.length > 0 && !isMiddlewareMatch) {
                        if (false) {}
                        throw new Error((shouldInterpolate ? "The provided `href` (".concat(url, ") value is missing query values (").concat(missingParams.join(", "), ") to be interpolated properly. ") : "The provided `as` value (".concat(asPathname, ") is incompatible with the `href` value (").concat(route, "). ")) + "Read more: https://nextjs.org/docs/messages/".concat(shouldInterpolate ? "href-interpolation-failed" : "incompatible-href-as"));
                    }
                } else if (shouldInterpolate) {
                    as = (0, _formatUrl).formatWithValidation(Object.assign({}, parsedAs1, {
                        pathname: interpolatedAs.result,
                        query: omit(query, interpolatedAs.params)
                    }));
                } else {
                    // Merge params into `query`, overwriting any specified in search
                    Object.assign(query, routeMatch);
                }
            }
            if (!isQueryUpdating) {
                Router.events.emit("routeChangeStart", as, routeProps);
            }
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
                    if (!routeProps.shallow) {
                        query = Object.assign({}, routeInfo.query || {}, query);
                    }
                    const cleanedParsedPathname = (0, _hasBasePath).hasBasePath(parsed.pathname) ? (0, _removeBasePath).removeBasePath(parsed.pathname) : parsed.pathname;
                    if (routeMatch && pathname !== cleanedParsedPathname) {
                        Object.keys(routeMatch).forEach((key)=>{
                            if (routeMatch && query[key] === routeMatch[key]) {
                                delete query[key];
                            }
                        });
                    }
                    if ((0, _isDynamic).isDynamicRoute(pathname)) {
                        const prefixedAs = !routeProps.shallow && routeInfo.resolvedAs ? routeInfo.resolvedAs : (0, _addBasePath).addBasePath((0, _addLocale).addLocale(new URL(as, location.href).pathname, nextState.locale), true);
                        let rewriteAs = prefixedAs;
                        if ((0, _hasBasePath).hasBasePath(rewriteAs)) {
                            rewriteAs = (0, _removeBasePath).removeBasePath(rewriteAs);
                        }
                        if (false) {}
                        const routeRegex1 = (0, _routeRegex).getRouteRegex(pathname);
                        const curRouteMatch = (0, _routeMatcher).getRouteMatcher(routeRegex1)(new URL(rewriteAs, location.href).pathname);
                        if (curRouteMatch) {
                            Object.assign(query, curRouteMatch);
                        }
                    }
                }
                // If the routeInfo brings a redirect we simply apply it.
                if ("type" in routeInfo) {
                    if (routeInfo.type === "redirect-internal") {
                        return _this.change(method, routeInfo.newUrl, routeInfo.newAs, options);
                    } else {
                        handleHardNavigation({
                            url: routeInfo.destination,
                            router: _this
                        });
                        return new Promise(()=>{});
                    }
                }
                let { error , props , __N_SSG , __N_SSP  } = routeInfo;
                const component = routeInfo.Component;
                if (component && component.unstable_scriptLoader) {
                    const scripts = [].concat(component.unstable_scriptLoader());
                    scripts.forEach((script)=>{
                        (0, _script).handleClientScriptLoad(script.props);
                    });
                }
                // handle redirect on client-transition
                if ((__N_SSG || __N_SSP) && props) {
                    if (props.pageProps && props.pageProps.__N_REDIRECT) {
                        // Use the destination from redirect without adding locale
                        options.locale = false;
                        const destination = props.pageProps.__N_REDIRECT;
                        // check if destination is internal (resolves to a page) and attempt
                        // client-navigation if it is falling back to hard navigation if
                        // it's not
                        if (destination.startsWith("/") && props.pageProps.__N_REDIRECT_BASE_PATH !== false) {
                            const parsedHref = (0, _parseRelativeUrl).parseRelativeUrl(destination);
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
                    // handle SSG data 404
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
                            throw new Error("Unexpected middleware effect on /404");
                        }
                    }
                }
                Router.events.emit("beforeHistoryChange", as, routeProps);
                _this.changeState(method, url, as, options);
                if (isQueryUpdating && pathname === "/_error" && ((ref2 = self.__NEXT_DATA__.props) == null ? void 0 : (ref3 = ref2.pageProps) == null ? void 0 : ref3.statusCode) === 500 && (props == null ? void 0 : props.pageProps)) {
                    // ensure statusCode is still correct for static 500 page
                    // when updating query information
                    props.pageProps.statusCode = 500;
                }
                var _route;
                // shallow routing is only allowed for same page URL changes.
                const isValidShallowRoute = options.shallow && nextState.route === ((_route = routeInfo.route) != null ? _route : route);
                var _scroll;
                const shouldScroll = (_scroll = options.scroll) != null ? _scroll : !options._h && !isValidShallowRoute;
                const resetScroll = shouldScroll ? {
                    x: 0,
                    y: 0
                } : null;
                // the new state that the router gonna set
                const upcomingRouterState = _extends({}, nextState, {
                    route,
                    pathname,
                    query,
                    asPath: cleanedAs,
                    isFallback: false
                });
                const upcomingScrollState = forcedScroll != null ? forcedScroll : resetScroll;
                // for query updates we can skip it if the state is unchanged and we don't
                // need to scroll
                // https://github.com/vercel/next.js/issues/37139
                const canSkipUpdating = options._h && !upcomingScrollState && !readyStateChange && !localeChange && (0, _compareStates).compareRouterStates(upcomingRouterState, _this.state);
                if (!canSkipUpdating) {
                    yield _this.set(upcomingRouterState, routeInfo, upcomingScrollState).catch((e)=>{
                        if (e.cancelled) error = error || e;
                        else throw e;
                    });
                    if (error) {
                        if (!isQueryUpdating) {
                            Router.events.emit("routeChangeError", error, cleanedAs, routeProps);
                        }
                        throw error;
                    }
                    if (false) {}
                    if (!isQueryUpdating) {
                        Router.events.emit("routeChangeComplete", as, routeProps);
                    }
                    // A hash mark # is the optional last part of a URL
                    const hashRegex = /#.+$/;
                    if (shouldScroll && hashRegex.test(as)) {
                        _this.scrollToHash(as);
                    }
                }
                return true;
            } catch (err11) {
                if ((0, _isError).default(err11) && err11.cancelled) {
                    return false;
                }
                throw err11;
            }
        })();
    }
    changeState(method, url, as) {
        let options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
        if (false) {}
        if (method !== "pushState" || (0, _utils).getURL() !== as) {
            this._shallow = options.shallow;
            window.history[method]({
                url,
                as,
                options,
                __N: true,
                key: this._key = method !== "pushState" ? this._key : createKey()
            }, // Passing the empty string here should be safe against future changes to the method.
            // https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState
            "", as);
        }
    }
    handleRouteInfoError(err, pathname, query, as, routeProps, loadErrorFail) {
        var _this = this;
        return _async_to_generator(function*() {
            console.error(err);
            if (err.cancelled) {
                // bubble up cancellation errors
                throw err;
            }
            if ((0, _routeLoader).isAssetError(err) || loadErrorFail) {
                Router.events.emit("routeChangeError", err, as, routeProps);
                // If we can't load the page it could be one of following reasons
                //  1. Page doesn't exists
                //  2. Page does exist in a different zone
                //  3. Internal error while loading the page
                // So, doing a hard reload is the proper way to deal with this.
                handleHardNavigation({
                    url: as,
                    router: _this
                });
                // Changing the URL doesn't block executing the current code path.
                // So let's throw a cancellation error stop the routing logic.
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
                return _this.handleRouteInfoError((0, _isError).default(routeInfoErr) ? routeInfoErr : new Error(routeInfoErr + ""), pathname, query, as, routeProps, true);
            }
        })();
    }
    getRouteInfo(param) {
        let { route: requestedRoute , pathname , query , as , resolvedAs , routeProps , locale , hasMiddleware , isPreview , unstable_skipClientCache , isQueryUpdating  } = param;
        var _this = this;
        return _async_to_generator(function*() {
            /**
     * This `route` binding can change if there's a rewrite
     * so we keep a reference to the original requested route
     * so we can store the cache for it and avoid re-requesting every time
     * for shallow routing purposes.
     */ let route = requestedRoute;
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
                if (hasMiddleware) {
                    existingInfo = undefined;
                }
                let cachedRouteInfo = existingInfo && !("initial" in existingInfo) && "production" !== "development" ? existingInfo : undefined;
                const fetchNextDataParams = {
                    dataHref: _this.pageLoader.getDataHref({
                        href: (0, _formatUrl).formatWithValidation({
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
                const data = isQueryUpdating ? {} : yield withMiddlewareEffects({
                    fetchData: ()=>fetchNextData(fetchNextDataParams),
                    asPath: resolvedAs,
                    locale: locale,
                    router: _this
                });
                if (isQueryUpdating && data) {
                    data.json = self.__NEXT_DATA__.props;
                }
                handleCancelled();
                if ((data == null ? void 0 : (ref = data.effect) == null ? void 0 : ref.type) === "redirect-internal" || (data == null ? void 0 : (ref4 = data.effect) == null ? void 0 : ref4.type) === "redirect-external") {
                    return data.effect;
                }
                if ((data == null ? void 0 : (ref5 = data.effect) == null ? void 0 : ref5.type) === "rewrite") {
                    route = (0, _removeTrailingSlash).removeTrailingSlash(data.effect.resolvedHref);
                    pathname = data.effect.resolvedHref;
                    query = _extends({}, query, data.effect.parsedAs.query);
                    resolvedAs = (0, _removeBasePath).removeBasePath((0, _normalizeLocalePath).normalizeLocalePath(data.effect.parsedAs.pathname, _this.locales).pathname);
                    // Check again the cache with the new destination.
                    existingInfo = _this.components[route];
                    if (routeProps.shallow && existingInfo && _this.route === route && !hasMiddleware) {
                        // If we have a match with the current route due to rewrite,
                        // we can copy the existing information to the rewritten one.
                        // Then, we return the information along with the matched route.
                        return _extends({}, existingInfo, {
                            route
                        });
                    }
                }
                if (route === "/api" || route.startsWith("/api/")) {
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
                if (false) {}
                const shouldFetchData = routeInfo.__N_SSG || routeInfo.__N_SSP;
                const { props , cacheKey  } = yield _this._getData(_async_to_generator(function*() {
                    if (shouldFetchData) {
                        const { json , cacheKey: _cacheKey  } = (data == null ? void 0 : data.json) ? data : yield fetchNextData({
                            dataHref: _this.pageLoader.getDataHref({
                                href: (0, _formatUrl).formatWithValidation({
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
                // Only bust the data cache for SSP routes although
                // middleware can skip cache per request with
                // x-middleware-cache: no-cache as well
                if (routeInfo.__N_SSP && fetchNextDataParams.dataHref) {
                    delete _this.sdc[cacheKey];
                }
                // we kick off a HEAD request in the background
                // when a non-prefetch request is made to signal revalidation
                if (!_this.isPreview && routeInfo.__N_SSG && "production" !== "development" && !isQueryUpdating) {
                    fetchNextData(Object.assign({}, fetchNextDataParams, {
                        isBackground: true,
                        persistCache: false,
                        inflightCache: backgroundCache
                    })).catch(()=>{});
                }
                props.pageProps = Object.assign({}, props.pageProps);
                routeInfo.props = props;
                routeInfo.route = route;
                routeInfo.query = query;
                routeInfo.resolvedAs = resolvedAs;
                _this.components[route] = routeInfo;
                return routeInfo;
            } catch (err) {
                return _this.handleRouteInfoError((0, _isError).getProperError(err), pathname, query, as, routeProps);
            }
        })();
    }
    set(state, data, resetScroll) {
        this.state = state;
        return this.sub(data, this.components["/_app"].Component, resetScroll);
    }
    /**
   * Callback to execute before replacing router state
   * @param cb callback to be executed
   */ beforePopState(cb) {
        this._bps = cb;
    }
    onlyAHashChange(as) {
        if (!this.asPath) return false;
        const [oldUrlNoHash, oldHash] = this.asPath.split("#");
        const [newUrlNoHash, newHash] = as.split("#");
        // Makes sure we scroll to the provided hash if the url/hash are the same
        if (newHash && oldUrlNoHash === newUrlNoHash && oldHash === newHash) {
            return true;
        }
        // If the urls are change, there's more than a hash change
        if (oldUrlNoHash !== newUrlNoHash) {
            return false;
        }
        // If the hash has changed, then it's a hash only change.
        // This check is necessary to handle both the enter and
        // leave hash === '' cases. The identity case falls through
        // and is treated as a next reload.
        return oldHash !== newHash;
    }
    scrollToHash(as) {
        const [, hash = ""] = as.split("#");
        // Scroll to top if the hash is just `#` with no value or `#top`
        // To mirror browsers
        if (hash === "" || hash === "top") {
            handleSmoothScroll(()=>window.scrollTo(0, 0));
            return;
        }
        // Decode hash to make non-latin anchor works.
        const rawHash = decodeURIComponent(hash);
        // First we check if the element by id is found
        const idEl = document.getElementById(rawHash);
        if (idEl) {
            handleSmoothScroll(()=>idEl.scrollIntoView());
            return;
        }
        // If there's no element with the id, we check the `name` property
        // To mirror browsers
        const nameEl = document.getElementsByName(rawHash)[0];
        if (nameEl) {
            handleSmoothScroll(()=>nameEl.scrollIntoView());
        }
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
        let asPath = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : url, options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
        var _this = this;
        return _async_to_generator(function*() {
            if ( true && (0, _isBot).isBot(window.navigator.userAgent)) {
                // No prefetches for bots that render the link since they are typically navigating
                // links via the equivalent of a hard navigation and hence never utilize these
                // prefetches.
                return;
            }
            let parsed = (0, _parseRelativeUrl).parseRelativeUrl(url);
            let { pathname , query  } = parsed;
            if (false) {}
            const pages = yield _this.pageLoader.getPageList();
            let resolvedAs = asPath;
            const locale = typeof options.locale !== "undefined" ? options.locale || undefined : _this.locale;
            if (false) {}
            parsed.pathname = resolveDynamicRoute(parsed.pathname, pages);
            if ((0, _isDynamic).isDynamicRoute(parsed.pathname)) {
                pathname = parsed.pathname;
                parsed.pathname = pathname;
                Object.assign(query, (0, _routeMatcher).getRouteMatcher((0, _routeRegex).getRouteRegex(parsed.pathname))((0, _parsePath).parsePath(asPath).pathname) || {});
                url = (0, _formatUrl).formatWithValidation(parsed);
            }
            // Prefetch is not supported in development mode because it would trigger on-demand-entries
            if (false) {}
            const route = (0, _removeTrailingSlash).removeTrailingSlash(pathname);
            yield Promise.all([
                _this.pageLoader._isSsg(route).then((isSsg)=>{
                    return isSsg ? fetchNextData({
                        dataHref: _this.pageLoader.getDataHref({
                            href: url,
                            asPath: resolvedAs,
                            locale: locale
                        }),
                        isServerRender: false,
                        parseJSON: true,
                        inflightCache: _this.sdc,
                        persistCache: !_this.isPreview,
                        isPrefetch: true,
                        unstable_skipClientCache: options.unstable_skipClientCache || options.priority && !!true
                    }).then(()=>false) : false;
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
            if (cancel === this.clc) {
                this.clc = null;
            }
            if (cancelled) {
                const err = new Error("Loading initial props cancelled");
                err.cancelled = true;
                throw err;
            }
            return data;
        });
    }
    _getFlightData(dataHref) {
        // Do not cache RSC flight response since it's not a static resource
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
        return (0, _utils).loadGetInitialProps(App, {
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
        // Server Data Cache
        this.sdc = {};
        this.isFirstPopStateEvent = true;
        this._key = createKey();
        this.onPopState = (e)=>{
            const { isFirstPopStateEvent  } = this;
            this.isFirstPopStateEvent = false;
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
                const { pathname , query  } = this;
                this.changeState("replaceState", (0, _formatUrl).formatWithValidation({
                    pathname: (0, _addBasePath).addBasePath(pathname),
                    query
                }), (0, _utils).getURL());
                return;
            }
            // __NA is used to identify if the history entry can be handled by the app-router.
            if (state.__NA) {
                window.location.reload();
                return;
            }
            if (!state.__N) {
                return;
            }
            // Safari fires popstateevent when reopening the browser.
            if (isFirstPopStateEvent && this.locale === state.options.locale && state.as === this.asPath) {
                return;
            }
            let forcedScroll;
            const { url , as , options , key  } = state;
            if (false) {}
            this._key = key;
            const { pathname: pathname1  } = (0, _parseRelativeUrl).parseRelativeUrl(url);
            // Make sure we don't re-render on initial load,
            // can be caused by navigating back from an external site
            if (this.isSsr && as === (0, _addBasePath).addBasePath(this.asPath) && pathname1 === (0, _addBasePath).addBasePath(this.pathname)) {
                return;
            }
            // If the downstream application returns falsy, return.
            // They will then be responsible for handling the event.
            if (this._bps && !this._bps(state)) {
                return;
            }
            this.change("replaceState", url, as, Object.assign({}, options, {
                shallow: options.shallow && this._shallow,
                locale: options.locale || this.defaultLocale,
                // @ts-ignore internal value not exposed on types
                _h: 0
            }), forcedScroll);
        };
        // represents the current component key
        const route = (0, _removeTrailingSlash).removeTrailingSlash(pathname1);
        // set up the component cache (by route keys)
        this.components = {};
        // We should not keep the cache, if there's an error
        // Otherwise, this cause issues when when going back and
        // come again to the errored page.
        if (pathname1 !== "/_error") {
            this.components[route] = {
                Component,
                initial: true,
                props: initialProps,
                err,
                __N_SSG: initialProps && initialProps.__N_SSG,
                __N_SSP: initialProps && initialProps.__N_SSP
            };
        }
        this.components["/_app"] = {
            Component: App,
            styleSheets: []
        };
        // Backwards compat for Router.router.events
        // TODO: Should be remove the following major version as it was never documented
        this.events = Router.events;
        this.pageLoader = pageLoader;
        // if auto prerendered and dynamic route wait to update asPath
        // until after mount to prevent hydration mismatch
        const autoExportDynamic = (0, _isDynamic).isDynamicRoute(pathname1) && self.__NEXT_DATA__.autoExport;
        this.basePath =  false || "";
        this.sub = subscription;
        this.clc = null;
        this._wrapApp = wrapApp;
        // make sure to ignore extra popState in safari on navigating
        // back from external site
        this.isSsr = true;
        this.isLocaleDomain = false;
        this.isReady = !!(self.__NEXT_DATA__.gssp || self.__NEXT_DATA__.gip || self.__NEXT_DATA__.appGip && !self.__NEXT_DATA__.gsp || !autoExportDynamic && !self.location.search && !false);
        if (false) {}
        this.state = {
            route,
            pathname: pathname1,
            query: query1,
            asPath: autoExportDynamic ? pathname1 : as1,
            isPreview: !!isPreview,
            locale:  false ? 0 : undefined,
            isFallback
        };
        this._initialMatchesMiddlewarePromise = Promise.resolve(false);
        if (true) {
            // make sure "as" doesn't start with double slashes or else it can
            // throw an error as it's considered invalid
            if (!as1.startsWith("//")) {
                // in order for `e.state` to work on the `onpopstate` event
                // we have to register the initial route upon initialization
                const options = {
                    locale
                };
                const asPath = (0, _utils).getURL();
                this._initialMatchesMiddlewarePromise = matchesMiddleware({
                    router: this,
                    locale,
                    asPath
                }).then((matches)=>{
                    options._shouldResolveHref = as1 !== pathname1;
                    this.changeState("replaceState", matches ? asPath : (0, _formatUrl).formatWithValidation({
                        pathname: (0, _addBasePath).addBasePath(pathname1),
                        query: query1
                    }), asPath, options);
                    return matches;
                });
            }
            window.addEventListener("popstate", this.onPopState);
            // enable custom scroll restoration handling when available
            // otherwise fallback to browser's default handling
            if (false) {}
        }
    }
}
Router.events = (0, _mitt).default();
exports["default"] = Router; //# sourceMappingURL=router.js.map


/***/ }),

/***/ 4441:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.addLocale = addLocale;
var _addPathPrefix = __webpack_require__(4135);
var _pathHasPrefix = __webpack_require__(3210);
function addLocale(path, locale, defaultLocale, ignorePrefix) {
    if (locale && locale !== defaultLocale && (ignorePrefix || !(0, _pathHasPrefix).pathHasPrefix(path.toLowerCase(), "/".concat(locale.toLowerCase())) && !(0, _pathHasPrefix).pathHasPrefix(path.toLowerCase(), "/api"))) {
        return (0, _addPathPrefix).addPathPrefix(path, "/".concat(locale));
    }
    return path;
} //# sourceMappingURL=add-locale.js.map


/***/ }),

/***/ 4135:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.addPathPrefix = addPathPrefix;
var _parsePath = __webpack_require__(6727);
function addPathPrefix(path, prefix) {
    if (!path.startsWith("/") || !prefix) {
        return path;
    }
    const { pathname , query , hash  } = (0, _parsePath).parsePath(path);
    return "".concat(prefix).concat(pathname).concat(query).concat(hash);
} //# sourceMappingURL=add-path-prefix.js.map


/***/ }),

/***/ 6074:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.addPathSuffix = addPathSuffix;
var _parsePath = __webpack_require__(6727);
function addPathSuffix(path, suffix) {
    if (!path.startsWith("/") || !suffix) {
        return path;
    }
    const { pathname , query , hash  } = (0, _parsePath).parsePath(path);
    return "".concat(pathname).concat(suffix).concat(query).concat(hash);
} //# sourceMappingURL=add-path-suffix.js.map


/***/ }),

/***/ 9002:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.compareRouterStates = compareRouterStates;
function compareRouterStates(a, b) {
    const stateKeys = Object.keys(a);
    if (stateKeys.length !== Object.keys(b).length) return false;
    for(let i = stateKeys.length; i--;){
        const key = stateKeys[i];
        if (key === "query") {
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
} //# sourceMappingURL=compare-states.js.map


/***/ }),

/***/ 7429:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.formatNextPathnameInfo = formatNextPathnameInfo;
var _removeTrailingSlash = __webpack_require__(12);
var _addPathPrefix = __webpack_require__(4135);
var _addPathSuffix = __webpack_require__(6074);
var _addLocale = __webpack_require__(4441);
function formatNextPathnameInfo(info) {
    let pathname = (0, _addLocale).addLocale(info.pathname, info.locale, info.buildId ? undefined : info.defaultLocale, info.ignorePrefix);
    if (info.buildId || !info.trailingSlash) {
        pathname = (0, _removeTrailingSlash).removeTrailingSlash(pathname);
    }
    if (info.buildId) {
        pathname = (0, _addPathSuffix).addPathSuffix((0, _addPathPrefix).addPathPrefix(pathname, "/_next/data/".concat(info.buildId)), info.pathname === "/" ? "index.json" : ".json");
    }
    pathname = (0, _addPathPrefix).addPathPrefix(pathname, info.basePath);
    return !info.buildId && info.trailingSlash ? !pathname.endsWith("/") ? (0, _addPathSuffix).addPathSuffix(pathname, "/") : pathname : (0, _removeTrailingSlash).removeTrailingSlash(pathname);
} //# sourceMappingURL=format-next-pathname-info.js.map


/***/ }),

/***/ 7795:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.formatUrl = formatUrl;
exports.formatWithValidation = formatWithValidation;
exports.urlObjectKeys = void 0;
var _interop_require_wildcard = (__webpack_require__(1598)/* ["default"] */ .Z);
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
    if (urlObj.host) {
        host = auth + urlObj.host;
    } else if (hostname) {
        host = auth + (~hostname.indexOf(":") ? "[".concat(hostname, "]") : hostname);
        if (urlObj.port) {
            host += ":" + urlObj.port;
        }
    }
    if (query && typeof query === "object") {
        query = String(querystring.urlQueryToSearchParams(query));
    }
    let search = urlObj.search || query && "?".concat(query) || "";
    if (protocol && !protocol.endsWith(":")) protocol += ":";
    if (urlObj.slashes || (!protocol || slashedProtocols.test(protocol)) && host !== false) {
        host = "//" + (host || "");
        if (pathname && pathname[0] !== "/") pathname = "/" + pathname;
    } else if (!host) {
        host = "";
    }
    if (hash && hash[0] !== "#") hash = "#" + hash;
    if (search && search[0] !== "?") search = "?" + search;
    pathname = pathname.replace(/[?#]/g, encodeURIComponent);
    search = search.replace("#", "%23");
    return "".concat(protocol).concat(host).concat(pathname).concat(search).concat(hash);
}
const urlObjectKeys = [
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
exports.urlObjectKeys = urlObjectKeys;
function formatWithValidation(url) {
    if (false) {}
    return formatUrl(url);
} //# sourceMappingURL=format-url.js.map


/***/ }),

/***/ 7929:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = getAssetPathFromRoute;
function getAssetPathFromRoute(route) {
    let ext = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
    const path = route === "/" ? "/index" : /^\/index(\/|$)/.test(route) ? "/index".concat(route) : "".concat(route);
    return path + ext;
} //# sourceMappingURL=get-asset-path-from-route.js.map


/***/ }),

/***/ 8756:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.getNextPathnameInfo = getNextPathnameInfo;
var _normalizeLocalePath = __webpack_require__(4769);
var _removePathPrefix = __webpack_require__(2650);
var _pathHasPrefix = __webpack_require__(3210);
function getNextPathnameInfo(pathname, options) {
    var _nextConfig;
    const { basePath , i18n , trailingSlash  } = (_nextConfig = options.nextConfig) != null ? _nextConfig : {};
    const info = {
        pathname: pathname,
        trailingSlash: pathname !== "/" ? pathname.endsWith("/") : trailingSlash
    };
    if (basePath && (0, _pathHasPrefix).pathHasPrefix(info.pathname, basePath)) {
        info.pathname = (0, _removePathPrefix).removePathPrefix(info.pathname, basePath);
        info.basePath = basePath;
    }
    if (options.parseData === true && info.pathname.startsWith("/_next/data/") && info.pathname.endsWith(".json")) {
        const paths = info.pathname.replace(/^\/_next\/data\//, "").replace(/\.json$/, "").split("/");
        const buildId = paths[0];
        info.pathname = paths[1] !== "index" ? "/".concat(paths.slice(1).join("/")) : "/";
        info.buildId = buildId;
    }
    if (i18n) {
        const pathLocale = (0, _normalizeLocalePath).normalizeLocalePath(info.pathname, i18n.locales);
        info.locale = pathLocale == null ? void 0 : pathLocale.detectedLocale;
        info.pathname = (pathLocale == null ? void 0 : pathLocale.pathname) || info.pathname;
    }
    return info;
} //# sourceMappingURL=get-next-pathname-info.js.map


/***/ }),

/***/ 8588:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "getSortedRoutes", ({
    enumerable: true,
    get: function() {
        return _sortedRoutes.getSortedRoutes;
    }
}));
Object.defineProperty(exports, "isDynamicRoute", ({
    enumerable: true,
    get: function() {
        return _isDynamic.isDynamicRoute;
    }
}));
var _sortedRoutes = __webpack_require__(566);
var _isDynamic = __webpack_require__(6238); //# sourceMappingURL=index.js.map


/***/ }),

/***/ 1754:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.isBot = isBot;
function isBot(userAgent) {
    return /Googlebot|Mediapartners-Google|AdsBot-Google|googleweblight|Storebot-Google|Google-PageRenderer|Bingbot|BingPreview|Slurp|DuckDuckBot|baiduspider|yandex|sogou|LinkedInBot|bitlybot|tumblr|vkShare|quora link preview|facebookexternalhit|facebookcatalog|Twitterbot|applebot|redditbot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|ia_archiver/i.test(userAgent);
} //# sourceMappingURL=is-bot.js.map


/***/ }),

/***/ 6238:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.isDynamicRoute = isDynamicRoute;
// Identify /[param]/ in route string
const TEST_ROUTE = /\/\[[^/]+?\](?=\/|$)/;
function isDynamicRoute(route) {
    return TEST_ROUTE.test(route);
} //# sourceMappingURL=is-dynamic.js.map


/***/ }),

/***/ 6727:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.parsePath = parsePath;
function parsePath(path) {
    const hashIndex = path.indexOf("#");
    const queryIndex = path.indexOf("?");
    const hasQuery = queryIndex > -1 && (hashIndex < 0 || queryIndex < hashIndex);
    if (hasQuery || hashIndex > -1) {
        return {
            pathname: path.substring(0, hasQuery ? queryIndex : hashIndex),
            query: hasQuery ? path.substring(queryIndex, hashIndex > -1 ? hashIndex : undefined) : "",
            hash: hashIndex > -1 ? path.slice(hashIndex) : ""
        };
    }
    return {
        pathname: path,
        query: "",
        hash: ""
    };
} //# sourceMappingURL=parse-path.js.map


/***/ }),

/***/ 2864:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.parseRelativeUrl = parseRelativeUrl;
var _utils = __webpack_require__(670);
var _querystring = __webpack_require__(4919);
function parseRelativeUrl(url, base) {
    const globalBase = new URL( false ? 0 : (0, _utils).getLocationOrigin());
    const resolvedBase = base ? new URL(base, globalBase) : url.startsWith(".") ? new URL( false ? 0 : window.location.href) : globalBase;
    const { pathname , searchParams , search , hash , href , origin  } = new URL(url, resolvedBase);
    if (origin !== globalBase.origin) {
        throw new Error("invariant: invalid relative URL, router received ".concat(url));
    }
    return {
        pathname,
        query: (0, _querystring).searchParamsToUrlQuery(searchParams),
        search,
        hash,
        href: href.slice(globalBase.origin.length)
    };
} //# sourceMappingURL=parse-relative-url.js.map


/***/ }),

/***/ 3210:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.pathHasPrefix = pathHasPrefix;
var _parsePath = __webpack_require__(6727);
function pathHasPrefix(path, prefix) {
    if (typeof path !== "string") {
        return false;
    }
    const { pathname  } = (0, _parsePath).parsePath(path);
    return pathname === prefix || pathname.startsWith(prefix + "/");
} //# sourceMappingURL=path-has-prefix.js.map


/***/ }),

/***/ 4919:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.searchParamsToUrlQuery = searchParamsToUrlQuery;
exports.urlQueryToSearchParams = urlQueryToSearchParams;
exports.assign = assign;
function searchParamsToUrlQuery(searchParams) {
    const query = {};
    searchParams.forEach((value, key)=>{
        if (typeof query[key] === "undefined") {
            query[key] = value;
        } else if (Array.isArray(query[key])) {
            query[key].push(value);
        } else {
            query[key] = [
                query[key],
                value
            ];
        }
    });
    return query;
}
function stringifyUrlQueryParam(param) {
    if (typeof param === "string" || typeof param === "number" && !isNaN(param) || typeof param === "boolean") {
        return String(param);
    } else {
        return "";
    }
}
function urlQueryToSearchParams(urlQuery) {
    const result = new URLSearchParams();
    Object.entries(urlQuery).forEach((param)=>{
        let [key, value] = param;
        if (Array.isArray(value)) {
            value.forEach((item)=>result.append(key, stringifyUrlQueryParam(item)));
        } else {
            result.set(key, stringifyUrlQueryParam(value));
        }
    });
    return result;
}
function assign(target) {
    for(var _len = arguments.length, searchParamsList = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        searchParamsList[_key - 1] = arguments[_key];
    }
    searchParamsList.forEach((searchParams)=>{
        Array.from(searchParams.keys()).forEach((key)=>target.delete(key));
        searchParams.forEach((value, key)=>target.append(key, value));
    });
    return target;
} //# sourceMappingURL=querystring.js.map


/***/ }),

/***/ 2650:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.removePathPrefix = removePathPrefix;
var _pathHasPrefix = __webpack_require__(3210);
function removePathPrefix(path, prefix) {
    if ((0, _pathHasPrefix).pathHasPrefix(path, prefix)) {
        const withoutPrefix = path.slice(prefix.length);
        return withoutPrefix.startsWith("/") ? withoutPrefix : "/".concat(withoutPrefix);
    }
    return path;
} //# sourceMappingURL=remove-path-prefix.js.map


/***/ }),

/***/ 12:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.removeTrailingSlash = removeTrailingSlash;
function removeTrailingSlash(route) {
    return route.replace(/\/$/, "") || "/";
} //# sourceMappingURL=remove-trailing-slash.js.map


/***/ }),

/***/ 3156:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.getRouteMatcher = getRouteMatcher;
var _utils = __webpack_require__(670);
function getRouteMatcher(param) {
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
            if (m !== undefined) {
                params[slugName] = ~m.indexOf("/") ? m.split("/").map((entry)=>decode(entry)) : g.repeat ? [
                    decode(m)
                ] : decode(m);
            }
        });
        return params;
    };
} //# sourceMappingURL=route-matcher.js.map


/***/ }),

/***/ 4903:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.getRouteRegex = getRouteRegex;
exports.getNamedRouteRegex = getNamedRouteRegex;
exports.getNamedMiddlewareRegex = getNamedMiddlewareRegex;
var _extends = (__webpack_require__(6495)/* ["default"] */ .Z);
var _escapeRegexp = __webpack_require__(8659);
var _removeTrailingSlash = __webpack_require__(12);
/**
 * Parses a given parameter from a route to a data structure that can be used
 * to generate the parametrized route. Examples:
 *   - `[...slug]` -> `{ name: 'slug', repeat: true, optional: true }`
 *   - `[foo]` -> `{ name: 'foo', repeat: false, optional: true }`
 *   - `bar` -> `{ name: 'bar', repeat: false, optional: false }`
 */ function parseParameter(param) {
    const optional = param.startsWith("[") && param.endsWith("]");
    if (optional) {
        param = param.slice(1, -1);
    }
    const repeat = param.startsWith("...");
    if (repeat) {
        param = param.slice(3);
    }
    return {
        key: param,
        repeat,
        optional
    };
}
function getParametrizedRoute(route) {
    const segments = (0, _removeTrailingSlash).removeTrailingSlash(route).slice(1).split("/");
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
            } else {
                return "/".concat((0, _escapeRegexp).escapeStringRegexp(segment));
            }
        }).join(""),
        groups
    };
}
function getRouteRegex(normalizedRoute) {
    const { parameterizedRoute , groups  } = getParametrizedRoute(normalizedRoute);
    return {
        re: new RegExp("^".concat(parameterizedRoute, "(?:/)?$")),
        groups: groups
    };
}
/**
 * Builds a function to generate a minimal routeKey using only a-z and minimal
 * number of characters.
 */ function buildGetSafeRouteKey() {
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
}
function getNamedParametrizedRoute(route) {
    const segments = (0, _removeTrailingSlash).removeTrailingSlash(route).slice(1).split("/");
    const getSafeRouteKey = buildGetSafeRouteKey();
    const routeKeys = {};
    return {
        namedParameterizedRoute: segments.map((segment)=>{
            if (segment.startsWith("[") && segment.endsWith("]")) {
                const { key , optional , repeat  } = parseParameter(segment.slice(1, -1));
                // replace any non-word characters since they can break
                // the named regex
                let cleanedKey = key.replace(/\W/g, "");
                let invalidKey = false;
                // check if the key is still invalid and fallback to using a known
                // safe key
                if (cleanedKey.length === 0 || cleanedKey.length > 30) {
                    invalidKey = true;
                }
                if (!isNaN(parseInt(cleanedKey.slice(0, 1)))) {
                    invalidKey = true;
                }
                if (invalidKey) {
                    cleanedKey = getSafeRouteKey();
                }
                routeKeys[cleanedKey] = key;
                return repeat ? optional ? "(?:/(?<".concat(cleanedKey, ">.+?))?") : "/(?<".concat(cleanedKey, ">.+?)") : "/(?<".concat(cleanedKey, ">[^/]+?)");
            } else {
                return "/".concat((0, _escapeRegexp).escapeStringRegexp(segment));
            }
        }).join(""),
        routeKeys
    };
}
function getNamedRouteRegex(normalizedRoute) {
    const result = getNamedParametrizedRoute(normalizedRoute);
    return _extends({}, getRouteRegex(normalizedRoute), {
        namedRegex: "^".concat(result.namedParameterizedRoute, "(?:/)?$"),
        routeKeys: result.routeKeys
    });
}
function getNamedMiddlewareRegex(normalizedRoute, options) {
    const { parameterizedRoute  } = getParametrizedRoute(normalizedRoute);
    const { catchAll =true  } = options;
    if (parameterizedRoute === "/") {
        let catchAllRegex = catchAll ? ".*" : "";
        return {
            namedRegex: "^/".concat(catchAllRegex, "$")
        };
    }
    const { namedParameterizedRoute  } = getNamedParametrizedRoute(normalizedRoute);
    let catchAllGroupedRegex = catchAll ? "(?:(/.*)?)" : "";
    return {
        namedRegex: "^".concat(namedParameterizedRoute).concat(catchAllGroupedRegex, "$")
    };
} //# sourceMappingURL=route-regex.js.map


/***/ }),

/***/ 566:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.getSortedRoutes = getSortedRoutes;
class UrlNode {
    insert(urlPath) {
        this._insert(urlPath.split("/").filter(Boolean), [], false);
    }
    smoosh() {
        return this._smoosh();
    }
    _smoosh() {
        let prefix = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "/";
        const childrenPaths = [
            ...this.children.keys()
        ].sort();
        if (this.slugName !== null) {
            childrenPaths.splice(childrenPaths.indexOf("[]"), 1);
        }
        if (this.restSlugName !== null) {
            childrenPaths.splice(childrenPaths.indexOf("[...]"), 1);
        }
        if (this.optionalRestSlugName !== null) {
            childrenPaths.splice(childrenPaths.indexOf("[[...]]"), 1);
        }
        const routes = childrenPaths.map((c)=>this.children.get(c)._smoosh("".concat(prefix).concat(c, "/"))).reduce((prev, curr)=>[
                ...prev,
                ...curr
            ], []);
        if (this.slugName !== null) {
            routes.push(...this.children.get("[]")._smoosh("".concat(prefix, "[").concat(this.slugName, "]/")));
        }
        if (!this.placeholder) {
            const r = prefix === "/" ? "/" : prefix.slice(0, -1);
            if (this.optionalRestSlugName != null) {
                throw new Error('You cannot define a route with the same specificity as a optional catch-all route ("'.concat(r, '" and "').concat(r, "[[...").concat(this.optionalRestSlugName, ']]").'));
            }
            routes.unshift(r);
        }
        if (this.restSlugName !== null) {
            routes.push(...this.children.get("[...]")._smoosh("".concat(prefix, "[...").concat(this.restSlugName, "]/")));
        }
        if (this.optionalRestSlugName !== null) {
            routes.push(...this.children.get("[[...]]")._smoosh("".concat(prefix, "[[...").concat(this.optionalRestSlugName, "]]/")));
        }
        return routes;
    }
    _insert(urlPaths, slugNames, isCatchAll) {
        if (urlPaths.length === 0) {
            this.placeholder = false;
            return;
        }
        if (isCatchAll) {
            throw new Error("Catch-all must be the last part of the URL.");
        }
        // The next segment in the urlPaths list
        let nextSegment = urlPaths[0];
        // Check if the segment matches `[something]`
        if (nextSegment.startsWith("[") && nextSegment.endsWith("]")) {
            // Strip `[` and `]`, leaving only `something`
            let segmentName = nextSegment.slice(1, -1);
            let isOptional = false;
            if (segmentName.startsWith("[") && segmentName.endsWith("]")) {
                // Strip optional `[` and `]`, leaving only `something`
                segmentName = segmentName.slice(1, -1);
                isOptional = true;
            }
            if (segmentName.startsWith("...")) {
                // Strip `...`, leaving only `something`
                segmentName = segmentName.substring(3);
                isCatchAll = true;
            }
            if (segmentName.startsWith("[") || segmentName.endsWith("]")) {
                throw new Error("Segment names may not start or end with extra brackets ('".concat(segmentName, "')."));
            }
            if (segmentName.startsWith(".")) {
                throw new Error("Segment names may not start with erroneous periods ('".concat(segmentName, "')."));
            }
            function handleSlug(previousSlug, nextSlug) {
                if (previousSlug !== null) {
                    // If the specific segment already has a slug but the slug is not `something`
                    // This prevents collisions like:
                    // pages/[post]/index.js
                    // pages/[id]/index.js
                    // Because currently multiple dynamic params on the same segment level are not supported
                    if (previousSlug !== nextSlug) {
                        // TODO: This error seems to be confusing for users, needs an error link, the description can be based on above comment.
                        throw new Error("You cannot use different slug names for the same dynamic path ('".concat(previousSlug, "' !== '").concat(nextSlug, "')."));
                    }
                }
                slugNames.forEach((slug)=>{
                    if (slug === nextSlug) {
                        throw new Error('You cannot have the same slug name "'.concat(nextSlug, '" repeat within a single dynamic path'));
                    }
                    if (slug.replace(/\W/g, "") === nextSegment.replace(/\W/g, "")) {
                        throw new Error('You cannot have the slug names "'.concat(slug, '" and "').concat(nextSlug, '" differ only by non-word symbols within a single dynamic path'));
                    }
                });
                slugNames.push(nextSlug);
            }
            if (isCatchAll) {
                if (isOptional) {
                    if (this.restSlugName != null) {
                        throw new Error('You cannot use both an required and optional catch-all route at the same level ("[...'.concat(this.restSlugName, ']" and "').concat(urlPaths[0], '" ).'));
                    }
                    handleSlug(this.optionalRestSlugName, segmentName);
                    // slugName is kept as it can only be one particular slugName
                    this.optionalRestSlugName = segmentName;
                    // nextSegment is overwritten to [[...]] so that it can later be sorted specifically
                    nextSegment = "[[...]]";
                } else {
                    if (this.optionalRestSlugName != null) {
                        throw new Error('You cannot use both an optional and required catch-all route at the same level ("[[...'.concat(this.optionalRestSlugName, ']]" and "').concat(urlPaths[0], '").'));
                    }
                    handleSlug(this.restSlugName, segmentName);
                    // slugName is kept as it can only be one particular slugName
                    this.restSlugName = segmentName;
                    // nextSegment is overwritten to [...] so that it can later be sorted specifically
                    nextSegment = "[...]";
                }
            } else {
                if (isOptional) {
                    throw new Error('Optional route parameters are not yet supported ("'.concat(urlPaths[0], '").'));
                }
                handleSlug(this.slugName, segmentName);
                // slugName is kept as it can only be one particular slugName
                this.slugName = segmentName;
                // nextSegment is overwritten to [] so that it can later be sorted specifically
                nextSegment = "[]";
            }
        }
        // If this UrlNode doesn't have the nextSegment yet we create a new child UrlNode
        if (!this.children.has(nextSegment)) {
            this.children.set(nextSegment, new UrlNode());
        }
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
function getSortedRoutes(normalizedPages) {
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
    // Here the `root` gets injected multiple paths, and insert will break them up into sublevels
    normalizedPages.forEach((pagePath)=>root.insert(pagePath));
    // Smoosh will then sort those sublevels up to the point where you get the correct route definition priority
    return root.smoosh();
} //# sourceMappingURL=sorted-routes.js.map


/***/ }),

/***/ 6949:
/***/ (function(module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.setConfig = setConfig;
exports["default"] = void 0;
let runtimeConfig;
var _default = ()=>{
    return runtimeConfig;
};
exports["default"] = _default;
function setConfig(configValue) {
    runtimeConfig = configValue;
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=runtime-config.js.map


/***/ }),

/***/ 1436:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = SideEffect;
var _interop_require_wildcard = (__webpack_require__(1598)/* ["default"] */ .Z);
var _react = _interop_require_wildcard(__webpack_require__(7294));
function SideEffect(props) {
    const { headManager , reduceComponentsToState  } = props;
    function emitChange() {
        if (headManager && headManager.mountedInstances) {
            const headElements = _react.Children.toArray(Array.from(headManager.mountedInstances).filter(Boolean));
            headManager.updateHead(reduceComponentsToState(headElements, props));
        }
    }
    if (isServer) {
        var ref;
        headManager == null ? void 0 : (ref = headManager.mountedInstances) == null ? void 0 : ref.add(props.children);
        emitChange();
    }
    useClientOnlyLayoutEffect(()=>{
        var ref1;
        headManager == null ? void 0 : (ref1 = headManager.mountedInstances) == null ? void 0 : ref1.add(props.children);
        return ()=>{
            var ref;
            headManager == null ? void 0 : (ref = headManager.mountedInstances) == null ? void 0 : ref.delete(props.children);
        };
    });
    // We need to call `updateHead` method whenever the `SideEffect` is trigger in all
    // life-cycles: mount, update, unmount. However, if there are multiple `SideEffect`s
    // being rendered, we only trigger the method from the last one.
    // This is ensured by keeping the last unflushed `updateHead` in the `_pendingUpdate`
    // singleton in the layout effect pass, and actually trigger it in the effect pass.
    useClientOnlyLayoutEffect(()=>{
        if (headManager) {
            headManager._pendingUpdate = emitChange;
        }
        return ()=>{
            if (headManager) {
                headManager._pendingUpdate = emitChange;
            }
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
}
const isServer = "object" === "undefined";
const useClientOnlyLayoutEffect = isServer ? ()=>{} : _react.useLayoutEffect;
const useClientOnlyEffect = isServer ? ()=>{} : _react.useEffect; //# sourceMappingURL=side-effect.js.map


/***/ }),

/***/ 670:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.execOnce = execOnce;
exports.getLocationOrigin = getLocationOrigin;
exports.getURL = getURL;
exports.getDisplayName = getDisplayName;
exports.isResSent = isResSent;
exports.normalizeRepeatedSlashes = normalizeRepeatedSlashes;
exports.loadGetInitialProps = loadGetInitialProps;
exports.ST = exports.SP = exports.isAbsoluteUrl = exports.WEB_VITALS = void 0;
var _async_to_generator = (__webpack_require__(932)/* ["default"] */ .Z);
const WEB_VITALS = [
    "CLS",
    "FCP",
    "FID",
    "INP",
    "LCP",
    "TTFB"
];
exports.WEB_VITALS = WEB_VITALS;
function execOnce(fn) {
    let used = false;
    let result;
    return function() {
        for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
            args[_key] = arguments[_key];
        }
        if (!used) {
            used = true;
            result = fn(...args);
        }
        return result;
    };
}
// Scheme: https://tools.ietf.org/html/rfc3986#section-3.1
// Absolute URL: https://tools.ietf.org/html/rfc3986#section-4.3
const ABSOLUTE_URL_REGEX = /^[a-zA-Z][a-zA-Z\d+\-.]*?:/;
const isAbsoluteUrl = (url)=>ABSOLUTE_URL_REGEX.test(url);
exports.isAbsoluteUrl = isAbsoluteUrl;
function getLocationOrigin() {
    const { protocol , hostname , port  } = window.location;
    return "".concat(protocol, "//").concat(hostname).concat(port ? ":" + port : "");
}
function getURL() {
    const { href  } = window.location;
    const origin = getLocationOrigin();
    return href.substring(origin.length);
}
function getDisplayName(Component) {
    return typeof Component === "string" ? Component : Component.displayName || Component.name || "Unknown";
}
function isResSent(res) {
    return res.finished || res.headersSent;
}
function normalizeRepeatedSlashes(url) {
    const urlParts = url.split("?");
    const urlNoQuery = urlParts[0];
    return urlNoQuery // first we replace any non-encoded backslashes with forward
    // then normalize repeated forward slashes
    .replace(/\\/g, "/").replace(/\/\/+/g, "/") + (urlParts[1] ? "?".concat(urlParts.slice(1).join("?")) : "");
}
function loadGetInitialProps(App, ctx) {
    return _loadGetInitialProps.apply(this, arguments);
}
function _loadGetInitialProps() {
    _loadGetInitialProps = _async_to_generator(function*(App, ctx) {
        if (false) { var ref; }
        // when called from _app `ctx` is nested in `ctx`
        const res = ctx.res || ctx.ctx && ctx.ctx.res;
        if (!App.getInitialProps) {
            if (ctx.ctx && ctx.Component) {
                // @ts-ignore pageProps default
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
            throw new Error(message1);
        }
        if (false) {}
        return props;
    });
    return _loadGetInitialProps.apply(this, arguments);
}
const SP = typeof performance !== "undefined";
exports.SP = SP;
const ST = SP && [
    "mark",
    "measure",
    "getEntriesByName"
].every((method)=>typeof performance[method] === "function");
exports.ST = ST;
class DecodeError extends Error {
}
exports.DecodeError = DecodeError;
class NormalizeError extends Error {
}
exports.NormalizeError = NormalizeError;
class PageNotFoundError extends Error {
    constructor(page){
        super();
        this.code = "ENOENT";
        this.message = "Cannot find module for page: ".concat(page);
    }
}
exports.PageNotFoundError = PageNotFoundError;
class MissingStaticPage extends Error {
    constructor(page, message){
        super();
        this.message = "Failed to load static file for page: ".concat(page, " ").concat(message);
    }
}
exports.MissingStaticPage = MissingStaticPage;
class MiddlewareNotFoundError extends Error {
    constructor(){
        super();
        this.code = "ENOENT";
        this.message = "Cannot find the middleware module";
    }
}
exports.MiddlewareNotFoundError = MiddlewareNotFoundError; //# sourceMappingURL=utils.js.map


/***/ }),

/***/ 7238:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.warnOnce = void 0;
let warnOnce = (_)=>{};
if (false) {}
exports.warnOnce = warnOnce; //# sourceMappingURL=warn-once.js.map


/***/ }),

/***/ 8018:
/***/ (function(module) {

var __dirname = "/";
(function(){"use strict";var n={};!function(){n.d=function(y,T){for(var C in T){if(n.o(T,C)&&!n.o(y,C)){Object.defineProperty(y,C,{enumerable:true,get:T[C]})}}}}();!function(){n.o=function(n,y){return Object.prototype.hasOwnProperty.call(n,y)}}();!function(){n.r=function(n){if(typeof Symbol!=="undefined"&&Symbol.toStringTag){Object.defineProperty(n,Symbol.toStringTag,{value:"Module"})}Object.defineProperty(n,"__esModule",{value:true})}}();if(typeof n!=="undefined")n.ab=__dirname+"/";var y={};n.r(y);n.d(y,{getCLS:function(){return E},getFCP:function(){return g},getFID:function(){return F},getINP:function(){return O},getLCP:function(){return _},getTTFB:function(){return G},onCLS:function(){return E},onFCP:function(){return g},onFID:function(){return F},onINP:function(){return O},onLCP:function(){return _},onTTFB:function(){return G}});var T,C,w,P,I,k=-1,o=function(n){addEventListener("pageshow",(function(y){y.persisted&&(k=y.timeStamp,n(y))}),!0)},c=function(){return window.performance&&performance.getEntriesByType&&performance.getEntriesByType("navigation")[0]},u=function(){var n=c();return n&&n.activationStart||0},f=function(n,y){var T=c(),C="navigate";return k>=0?C="back-forward-cache":T&&(C=document.prerendering||u()>0?"prerender":T.type.replace(/_/g,"-")),{name:n,value:void 0===y?-1:y,rating:"good",delta:0,entries:[],id:"v3-".concat(Date.now(),"-").concat(Math.floor(8999999999999*Math.random())+1e12),navigationType:C}},s=function(n,y,T){try{if(PerformanceObserver.supportedEntryTypes.includes(n)){var C=new PerformanceObserver((function(n){y(n.getEntries())}));return C.observe(Object.assign({type:n,buffered:!0},T||{})),C}}catch(n){}},d=function(n,y){var T=function t(T){"pagehide"!==T.type&&"hidden"!==document.visibilityState||(n(T),y&&(removeEventListener("visibilitychange",t,!0),removeEventListener("pagehide",t,!0)))};addEventListener("visibilitychange",T,!0),addEventListener("pagehide",T,!0)},l=function(n,y,T,C){var w,P;return function(I){y.value>=0&&(I||C)&&((P=y.value-(w||0))||void 0===w)&&(w=y.value,y.delta=P,y.rating=function(n,y){return n>y[1]?"poor":n>y[0]?"needs-improvement":"good"}(y.value,T),n(y))}},N=-1,v=function(){return"hidden"!==document.visibilityState||document.prerendering?1/0:0},m=function(){d((function(n){var y=n.timeStamp;N=y}),!0)},h=function(){return N<0&&(N=v(),m(),o((function(){setTimeout((function(){N=v(),m()}),0)}))),{get firstHiddenTime(){return N}}},g=function(n,y){y=y||{};var T,C=[1800,3e3],w=h(),P=f("FCP"),c=function(n){n.forEach((function(n){"first-contentful-paint"===n.name&&(k&&k.disconnect(),n.startTime<w.firstHiddenTime&&(P.value=n.startTime-u(),P.entries.push(n),T(!0)))}))},I=window.performance&&window.performance.getEntriesByName&&window.performance.getEntriesByName("first-contentful-paint")[0],k=I?null:s("paint",c);(I||k)&&(T=l(n,P,C,y.reportAllChanges),I&&c([I]),o((function(w){P=f("FCP"),T=l(n,P,C,y.reportAllChanges),requestAnimationFrame((function(){requestAnimationFrame((function(){P.value=performance.now()-w.timeStamp,T(!0)}))}))})))},j=!1,q=-1,E=function(n,y){y=y||{};var T=[.1,.25];j||(g((function(n){q=n.value})),j=!0);var C,i=function(y){q>-1&&n(y)},w=f("CLS",0),P=0,I=[],p=function(n){n.forEach((function(n){if(!n.hadRecentInput){var y=I[0],T=I[I.length-1];P&&n.startTime-T.startTime<1e3&&n.startTime-y.startTime<5e3?(P+=n.value,I.push(n)):(P=n.value,I=[n]),P>w.value&&(w.value=P,w.entries=I,C())}}))},k=s("layout-shift",p);k&&(C=l(i,w,T,y.reportAllChanges),d((function(){p(k.takeRecords()),C(!0)})),o((function(){P=0,q=-1,w=f("CLS",0),C=l(i,w,T,y.reportAllChanges)})))},x={passive:!0,capture:!0},z=new Date,L=function(n,y){T||(T=y,C=n,w=new Date,A(removeEventListener),S())},S=function(){if(C>=0&&C<w-z){var n={entryType:"first-input",name:T.type,target:T.target,cancelable:T.cancelable,startTime:T.timeStamp,processingStart:T.timeStamp+C};P.forEach((function(y){y(n)})),P=[]}},b=function(n){if(n.cancelable){var y=(n.timeStamp>1e12?new Date:performance.now())-n.timeStamp;"pointerdown"==n.type?function(n,y){var t=function(){L(n,y),i()},r=function(){i()},i=function(){removeEventListener("pointerup",t,x),removeEventListener("pointercancel",r,x)};addEventListener("pointerup",t,x),addEventListener("pointercancel",r,x)}(y,n):L(y,n)}},A=function(n){["mousedown","keydown","touchstart","pointerdown"].forEach((function(y){return n(y,b,x)}))},F=function(n,y){y=y||{};var w,I=[100,300],k=h(),N=f("FID"),v=function(n){n.startTime<k.firstHiddenTime&&(N.value=n.processingStart-n.startTime,N.entries.push(n),w(!0))},m=function(n){n.forEach(v)},j=s("first-input",m);w=l(n,N,I,y.reportAllChanges),j&&d((function(){m(j.takeRecords()),j.disconnect()}),!0),j&&o((function(){var k;N=f("FID"),w=l(n,N,I,y.reportAllChanges),P=[],C=-1,T=null,A(addEventListener),k=v,P.push(k),S()}))},J=0,K=1/0,Q=0,M=function(n){n.forEach((function(n){n.interactionId&&(K=Math.min(K,n.interactionId),Q=Math.max(Q,n.interactionId),J=Q?(Q-K)/7+1:0)}))},B=function(){return I?J:performance.interactionCount||0},D=function(){"interactionCount"in performance||I||(I=s("event",M,{type:"event",buffered:!0,durationThreshold:0}))},U=0,R=function(){return B()-U},V=[],W={},H=function(n){var y=V[V.length-1],T=W[n.interactionId];if(T||V.length<10||n.duration>y.latency){if(T)T.entries.push(n),T.latency=Math.max(T.latency,n.duration);else{var C={id:n.interactionId,latency:n.duration,entries:[n]};W[C.id]=C,V.push(C)}V.sort((function(n,y){return y.latency-n.latency})),V.splice(10).forEach((function(n){delete W[n.id]}))}},O=function(n,y){y=y||{};var T=[200,500];D();var C,w=f("INP"),a=function(n){n.forEach((function(n){(n.interactionId&&H(n),"first-input"===n.entryType)&&(!V.some((function(y){return y.entries.some((function(y){return n.duration===y.duration&&n.startTime===y.startTime}))}))&&H(n))}));var y,T=(y=Math.min(V.length-1,Math.floor(R()/50)),V[y]);T&&T.latency!==w.value&&(w.value=T.latency,w.entries=T.entries,C())},P=s("event",a,{durationThreshold:y.durationThreshold||40});C=l(n,w,T,y.reportAllChanges),P&&(P.observe({type:"first-input",buffered:!0}),d((function(){a(P.takeRecords()),w.value<0&&R()>0&&(w.value=0,w.entries=[]),C(!0)})),o((function(){V=[],U=B(),w=f("INP"),C=l(n,w,T,y.reportAllChanges)})))},X={},_=function(n,y){y=y||{};var T,C=[2500,4e3],w=h(),P=f("LCP"),c=function(n){var y=n[n.length-1];if(y){var C=y.startTime-u();C<w.firstHiddenTime&&(P.value=C,P.entries=[y],T())}},I=s("largest-contentful-paint",c);if(I){T=l(n,P,C,y.reportAllChanges);var v=function(){X[P.id]||(c(I.takeRecords()),I.disconnect(),X[P.id]=!0,T(!0))};["keydown","click"].forEach((function(n){addEventListener(n,v,{once:!0,capture:!0})})),d(v,!0),o((function(w){P=f("LCP"),T=l(n,P,C,y.reportAllChanges),requestAnimationFrame((function(){requestAnimationFrame((function(){P.value=performance.now()-w.timeStamp,X[P.id]=!0,T(!0)}))}))}))}},Y=function e(n){document.prerendering?addEventListener("prerenderingchange",(function(){return e(n)}),!0):"complete"!==document.readyState?addEventListener("load",(function(){return e(n)}),!0):setTimeout(n,0)},G=function(n,y){y=y||{};var T=[800,1800],C=f("TTFB"),w=l(n,C,T,y.reportAllChanges);Y((function(){var P=c();if(P){if(C.value=Math.max(P.responseStart-u(),0),C.value<0||C.value>performance.now())return;C.entries=[P],w(!0),o((function(){C=f("TTFB",0),(w=l(n,C,T,y.reportAllChanges))(!0)}))}}))};module.exports=y})();

/***/ }),

/***/ 676:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = isError;
exports.getProperError = getProperError;
var _isPlainObject = __webpack_require__(2849);
function isError(err) {
    return typeof err === "object" && err !== null && "name" in err && "message" in err;
}
function getProperError(err) {
    if (isError(err)) {
        return err;
    }
    if (false) {}
    return new Error((0, _isPlainObject).isPlainObject(err) ? JSON.stringify(err) : err + "");
}

//# sourceMappingURL=is-error.js.map

/***/ }),

/***/ 2431:
/***/ (function() {

/* (ignored) */

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, [774], function() { return __webpack_exec__(1783); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ _N_E = __webpack_exports__;
/******/ }
]);