"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.initNext = initNext;
exports.render = render;
exports.renderError = renderError;
exports.emitter = exports.router = exports.version = void 0;
require("@next/polyfill-module");
var _react = _interopRequireDefault(require("react"));
var _reactDom = _interopRequireDefault(require("react-dom"));
var _styledJsx = require("styled-jsx");
var _headManagerContext = require("../shared/lib/head-manager-context");
var _mitt = _interopRequireDefault(require("../shared/lib/mitt"));
var _routerContext = require("../shared/lib/router-context");
var _router = require("../shared/lib/router/router");
var _isDynamic = require("../shared/lib/router/utils/is-dynamic");
var _querystring = require("../shared/lib/router/utils/querystring");
var _runtimeConfig = require("../shared/lib/runtime-config");
var _utils = require("../shared/lib/utils");
var _portal = require("./portal");
var _headManager = _interopRequireDefault(require("./head-manager"));
var _pageLoader = _interopRequireDefault(require("./page-loader"));
var _performanceRelayer = _interopRequireDefault(require("./performance-relayer"));
var _routeAnnouncer = require("./route-announcer");
var _router1 = require("./router");
var _isError = _interopRequireDefault(require("../lib/is-error"));
var _vitals = require("./vitals");
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
function _asyncToGenerator(fn) {
    return function () {
        var self = this, args = arguments;
        return new Promise(function (resolve, reject) {
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
function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    } else {
        var newObj = {
        };
        if (obj != null) {
            for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {
                    };
                    if (desc.get || desc.set) {
                        Object.defineProperty(newObj, key, desc);
                    } else {
                        newObj[key] = obj[key];
                    }
                }
            }
        }
        newObj.default = obj;
        return newObj;
    }
}
function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i] != null ? arguments[i] : {
        };
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function (key) {
            _defineProperty(target, key, source[key]);
        });
    }
    return target;
}
const data = JSON.parse(document.getElementById('__NEXT_DATA__').textContent);
window.__NEXT_DATA__ = data;
const version = "12.0.8-canary.2";
exports.version = version;
const looseToArray = (input) => [].slice.call(input)
    ;
const { props: hydrateProps, err: hydrateErr, page, query, buildId, assetPrefix, runtimeConfig, dynamicIds, isFallback, locale, locales, domainLocales, isPreview, rsc, } = data;
let { defaultLocale } = data;
const prefix = assetPrefix || '';
// With dynamic assetPrefix it's no longer possible to set assetPrefix at the build time
// So, this is how we do it in the client side at runtime
__webpack_public_path__ = `${prefix}/_next/` //eslint-disable-line
    ;
// Initialize next/config with the environment configuration
(0, _runtimeConfig).setConfig({
    serverRuntimeConfig: {
    },
    publicRuntimeConfig: runtimeConfig || {
    }
});
let asPath = (0, _utils).getURL();
// make sure not to attempt stripping basePath for 404s
if ((0, _router).hasBasePath(asPath)) {
    asPath = (0, _router).delBasePath(asPath);
}
if (process.env.__NEXT_I18N_SUPPORT) {
    const { normalizeLocalePath } = require('../shared/lib/i18n/normalize-locale-path');
    const { detectDomainLocale } = require('../shared/lib/i18n/detect-domain-locale');
    const { parseRelativeUrl } = require('../shared/lib/router/utils/parse-relative-url');
    const { formatUrl } = require('../shared/lib/router/utils/format-url');
    if (locales) {
        const parsedAs = parseRelativeUrl(asPath);
        const localePathResult = normalizeLocalePath(parsedAs.pathname, locales);
        if (localePathResult.detectedLocale) {
            parsedAs.pathname = localePathResult.pathname;
            asPath = formatUrl(parsedAs);
        } else {
            // derive the default locale if it wasn't detected in the asPath
            // since we don't prerender static pages with all possible default
            // locales
            defaultLocale = locale;
        }
        // attempt detecting default locale based on hostname
        const detectedDomain = detectDomainLocale(process.env.__NEXT_I18N_DOMAINS, window.location.hostname);
        // TODO: investigate if defaultLocale needs to be populated after
        // hydration to prevent mismatched renders
        if (detectedDomain) {
            defaultLocale = detectedDomain.defaultLocale;
        }
    }
}
if (data.scriptLoader) {
    const { initScriptLoader } = require('./script');
    initScriptLoader(data.scriptLoader);
}
const pageLoader = new _pageLoader.default(buildId, prefix);
const register = ([r, f]) => pageLoader.routeLoader.onEntrypoint(r, f)
    ;
if (window.__NEXT_P) {
    // Defer page registration for another tick. This will increase the overall
    // latency in hydrating the page, but reduce the total blocking time.
    window.__NEXT_P.map((p) => setTimeout(() => register(p)
        , 0)
    );
}
window.__NEXT_P = [];
window.__NEXT_P.push = register;
const headManager = (0, _headManager).default();
const appElement = document.getElementById('__next');
let lastRenderReject;
let webpackHMR;
let router;
exports.router = router;
let CachedApp, onPerfEntry;
headManager.getIsSsr = () => {
    return router.isSsr;
};
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
        if (router.isSsr && // We don't update for 404 requests as this can modify
            // the asPath unexpectedly e.g. adding basePath when
            // it wasn't originally present
            page !== '/404' && page !== '/_error' && (isFallback || data.nextExport && ((0, _isDynamic).isDynamicRoute(router.pathname) || location.search || process.env.__NEXT_HAS_REWRITES) || hydrateProps && hydrateProps.__N_SSG && (location.search || process.env.__NEXT_HAS_REWRITES))) {
            // update query on mount for exported pages
            router.replace(router.pathname + '?' + String((0, _querystring).assign((0, _querystring).urlQueryToSearchParams(router.query), new URLSearchParams(location.search))), asPath, {
                // @ts-ignore
                // WARNING: `_h` is an internal option for handing Next.js
                // client-side hydration. Your app should _never_ use this property.
                // It may change at any time without notice.
                _h: 1,
                // Fallback pages must trigger the data fetch, so the transition is
                // not shallow.
                // Other pages (strictly updating query) happens shallowly, as data
                // requirements would already be present.
                shallow: !isFallback
            });
        }
    }
    componentDidUpdate() {
        this.scrollToHash();
    }
    scrollToHash() {
        let { hash } = location;
        hash = hash && hash.substring(1);
        if (!hash) return;
        const el = document.getElementById(hash);
        if (!el) return;
        // If we call scrollIntoView() in here without a setTimeout
        // it won't scroll properly.
        setTimeout(() => el.scrollIntoView()
            , 0);
    }
    render() {
        if (process.env.NODE_ENV === 'production') {
            return this.props.children;
        } else {
            const { ReactDevOverlay } = require('@next/react-dev-overlay/lib/client');
            return (/*#__PURE__*/ _react.default.createElement(ReactDevOverlay, null, this.props.children));
        }
    }
}
const emitter = (0, _mitt).default();
exports.emitter = emitter;
let CachedComponent;
function _initNext() {
    _initNext = _asyncToGenerator(function* (opts = {
    }) {
        // This makes sure this specific lines are removed in production
        if (process.env.NODE_ENV === 'development') {
            webpackHMR = opts.webpackHMR;
        }
        let initialErr = hydrateErr;
        try {
            const appEntrypoint = yield pageLoader.routeLoader.whenEntrypoint('/_app');
            if ('error' in appEntrypoint) {
                throw appEntrypoint.error;
            }
            const { component: app, exports: mod } = appEntrypoint;
            CachedApp = app;
            const exportedReportWebVitals = mod && mod.reportWebVitals;
            onPerfEntry = ({ id, name, startTime, value, duration, entryType, entries }) => {
                // Combines timestamp with random number for unique ID
                const uniqueID = `${Date.now()}-${Math.floor(Math.random() * (9000000000000 - 1)) + 1000000000000}`;
                let perfStartEntry;
                if (entries && entries.length) {
                    perfStartEntry = entries[0].startTime;
                }
                const webVitals = {
                    id: id || uniqueID,
                    name,
                    startTime: startTime || perfStartEntry,
                    value: value == null ? duration : value,
                    label: entryType === 'mark' || entryType === 'measure' ? 'custom' : 'web-vital'
                };
                exportedReportWebVitals === null || exportedReportWebVitals === void 0 ? void 0 : exportedReportWebVitals(webVitals);
                (0, _vitals).trackWebVitalMetric(webVitals);
            };
            const pageEntrypoint = // The dev server fails to serve script assets when there's a hydration
                // error, so we need to skip waiting for the entrypoint.
                process.env.NODE_ENV === 'development' && hydrateErr ? {
                    error: hydrateErr
                } : yield pageLoader.routeLoader.whenEntrypoint(page);
            if ('error' in pageEntrypoint) {
                throw pageEntrypoint.error;
            }
            CachedComponent = pageEntrypoint.component;
            if (process.env.NODE_ENV !== 'production') {
                const { isValidElementType } = require('react-is');
                if (!isValidElementType(CachedComponent)) {
                    throw new Error(`The default export is not a React Component in page: "${page}"`);
                }
            }
        } catch (error) {
            // This catches errors like throwing in the top level of a module
            initialErr = (0, _isError).default(error) ? error : new Error(error + '');
        }
        if (process.env.NODE_ENV === 'development') {
            const { getNodeError } = require('@next/react-dev-overlay/lib/client');
            // Server-side runtime errors need to be re-thrown on the client-side so
            // that the overlay is rendered.
            if (initialErr) {
                if (initialErr === hydrateErr) {
                    setTimeout(() => {
                        let error;
                        try {
                            // Generate a new error object. We `throw` it because some browsers
                            // will set the `stack` when thrown, and we want to ensure ours is
                            // not overridden when we re-throw it below.
                            throw new Error(initialErr.message);
                        } catch (e) {
                            error = e;
                        }
                        error.name = initialErr.name;
                        error.stack = initialErr.stack;
                        // Errors from the middleware are reported as client-side errors
                        // since the middleware is compiled using the client compiler
                        if ('middleware' in hydrateErr) {
                            throw error;
                        }
                        const node = getNodeError(error);
                        throw node;
                    });
                } else {
                    setTimeout(() => {
                        throw initialErr;
                    });
                }
            }
        }
        if (window.__NEXT_PRELOADREADY) {
            yield window.__NEXT_PRELOADREADY(dynamicIds);
        }
        exports.router = router = (0, _router1).createRouter(page, query, asPath, {
            initialProps: hydrateProps,
            pageLoader,
            App: CachedApp,
            Component: CachedComponent,
            wrapApp,
            err: initialErr,
            isFallback: Boolean(isFallback),
            subscription: (info, App, scroll) => render(Object.assign({
            }, info, {
                App,
                scroll
            }))
            ,
            locale,
            locales,
            defaultLocale,
            domainLocales,
            isPreview
        });
        const renderCtx = {
            App: CachedApp,
            initial: true,
            Component: CachedComponent,
            props: hydrateProps,
            err: initialErr
        };
        if (process.env.NODE_ENV === 'production') {
            render(renderCtx);
            return emitter;
        } else {
            return {
                emitter,
                renderCtx
            };
        }
    });
    return _initNext.apply(this, arguments);
}
function initNext() {
    return _initNext.apply(this, arguments);
}
function _render() {
    _render = _asyncToGenerator(function* (renderingProps) {
        if (renderingProps.err) {
            yield renderError(renderingProps);
            return;
        }
        try {
            yield doRender(renderingProps);
        } catch (err) {
            const renderErr = err instanceof Error ? err : new Error(err + '');
            // bubble up cancelation errors
            if (renderErr.cancelled) {
                throw renderErr;
            }
            if (process.env.NODE_ENV === 'development') {
                // Ensure this error is displayed in the overlay in development
                setTimeout(() => {
                    throw renderErr;
                });
            }
            yield renderError(_objectSpread({
            }, renderingProps, {
                err: renderErr
            }));
        }
    });
    return _render.apply(this, arguments);
}
function render(renderingProps) {
    return _render.apply(this, arguments);
}
function renderError(renderErrorProps) {
    const { App, err } = renderErrorProps;
    // In development runtime errors are caught by our overlay
    // In production we catch runtime errors using componentDidCatch which will trigger renderError
    if (process.env.NODE_ENV !== 'production') {
        // A Next.js rendering runtime error is always unrecoverable
        // FIXME: let's make this recoverable (error in GIP client-transition)
        webpackHMR.onUnrecoverableError();
        // We need to render an empty <App> so that the `<ReactDevOverlay>` can
        // render itself.
        return doRender({
            App: () => null
            ,
            props: {
            },
            Component: () => null
            ,
            styleSheets: []
        });
    }
    // Make sure we log the error to the console, otherwise users can't track down issues.
    console.error(err);
    console.error(`A client-side exception has occurred, see here for more info: https://nextjs.org/docs/messages/client-side-exception-occurred`);
    return pageLoader.loadPage('/_error').then(({ page: ErrorComponent, styleSheets }) => {
        return (lastAppProps === null || lastAppProps === void 0 ? void 0 : lastAppProps.Component) === ErrorComponent ? import('../pages/_error').then((m) => ({
            ErrorComponent: m.default,
            styleSheets: []
        })
        ) : {
            ErrorComponent,
            styleSheets
        };
    }).then(({ ErrorComponent, styleSheets }) => {
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
                pathname: page,
                query,
                asPath,
                AppTree
            }
        };
        return Promise.resolve(renderErrorProps.props ? renderErrorProps.props : (0, _utils).loadGetInitialProps(App, appCtx)).then((initProps) => doRender(_objectSpread({
        }, renderErrorProps, {
            err,
            Component: ErrorComponent,
            styleSheets,
            props: initProps
        }))
        );
    });
}
let reactRoot = null;
// On initial render a hydrate should always happen
let shouldHydrate = true;
function renderReactElement(domEl, fn) {
    // mark start of hydrate/render
    if (_utils.ST) {
        performance.mark('beforeRender');
    }
    const reactEl = fn(shouldHydrate ? markHydrateComplete : markRenderComplete);
    if (process.env.__NEXT_REACT_ROOT) {
        if (!reactRoot) {
            // Unlike with createRoot, you don't need a separate root.render() call here
            reactRoot = _reactDom.default.hydrateRoot(domEl, reactEl);
            // TODO: Remove shouldHydrate variable when React 18 is stable as it can depend on `reactRoot` existing
            shouldHydrate = false;
        } else {
            reactRoot.render(reactEl);
        }
    } else {
        // The check for `.hydrate` is there to support React alternatives like preact
        if (shouldHydrate) {
            _reactDom.default.hydrate(reactEl, domEl);
            shouldHydrate = false;
        } else {
            _reactDom.default.render(reactEl, domEl);
        }
    }
}
function markHydrateComplete() {
    if (!_utils.ST) return;
    performance.mark('afterHydrate') // mark end of hydration
        ;
    performance.measure('Next.js-before-hydration', 'navigationStart', 'beforeRender');
    performance.measure('Next.js-hydration', 'beforeRender', 'afterHydrate');
    if (onPerfEntry) {
        performance.getEntriesByName('Next.js-hydration').forEach(onPerfEntry);
    }
    clearMarks();
}
function markRenderComplete() {
    if (!_utils.ST) return;
    performance.mark('afterRender') // mark end of render
        ;
    const navStartEntries = performance.getEntriesByName('routeChange', 'mark');
    if (!navStartEntries.length) return;
    performance.measure('Next.js-route-change-to-render', navStartEntries[0].name, 'beforeRender');
    performance.measure('Next.js-render', 'beforeRender', 'afterRender');
    if (onPerfEntry) {
        performance.getEntriesByName('Next.js-render').forEach(onPerfEntry);
        performance.getEntriesByName('Next.js-route-change-to-render').forEach(onPerfEntry);
    }
    clearMarks();
    [
        'Next.js-route-change-to-render',
        'Next.js-render'
    ].forEach((measure) => performance.clearMeasures(measure)
    );
}
function clearMarks() {
    [
        'beforeRender',
        'afterHydrate',
        'afterRender',
        'routeChange'
    ].forEach((mark) => performance.clearMarks(mark)
    );
}
function AppContainer({ children }) {
    return (/*#__PURE__*/ _react.default.createElement(Container, {
        fn: (error) => renderError({
            App: CachedApp,
            err: error
        }).catch((err) => console.error('Error rendering page: ', err)
        )
    }, /*#__PURE__*/ _react.default.createElement(_routerContext.RouterContext.Provider, {
        value: (0, _router1).makePublicRouterInstance(router)
    }, /*#__PURE__*/ _react.default.createElement(_headManagerContext.HeadManagerContext.Provider, {
        value: headManager
    }, /*#__PURE__*/ _react.default.createElement(_styledJsx.StyleRegistry, null, children)))));
}
const wrapApp = (App) => (wrappedAppProps) => {
    const appProps = _objectSpread({
    }, wrappedAppProps, {
        Component: CachedComponent,
        err: hydrateErr,
        router
    });
    return (/*#__PURE__*/ _react.default.createElement(AppContainer, null, /*#__PURE__*/ _react.default.createElement(App, Object.assign({
    }, appProps))));
}
    ;
let RSCComponent;
if (process.env.__NEXT_RSC) {
    function createResponseCache() {
        return new Map();
    }
    const rscCache = createResponseCache();
    const RSCWrapper = ({ cacheKey, serialized, _fresh }) => {
        const { createFromFetch, } = require('next/dist/compiled/react-server-dom-webpack');
        let response = rscCache.get(cacheKey);
        // If there is no cache, or there is serialized data already
        if (!response) {
            response = createFromFetch(serialized ? (() => {
                const t = new TransformStream();
                t.writable.getWriter().write(new TextEncoder().encode(serialized));
                return Promise.resolve({
                    body: t.readable
                });
            })() : (() => {
                const search = location.search;
                const flightReqUrl = location.pathname + search + (search ? '&__flight__' : '?__flight__');
                return fetch(flightReqUrl);
            })());
            rscCache.set(cacheKey, response);
        }
        const root = response.readRoot();
        return root;
    };
    RSCComponent = (props) => {
        const cacheKey = (0, _router1).useRouter().asPath;
        const { __flight_serialized__, __flight_fresh__ } = props;
        return (/*#__PURE__*/ _react.default.createElement(_react.default.Suspense, {
            fallback: null
        }, /*#__PURE__*/ _react.default.createElement(RSCWrapper, {
            cacheKey: cacheKey,
            serialized: __flight_serialized__,
            _fresh: __flight_fresh__
        })));
    };
}
let lastAppProps;
function doRender(input) {
    let { App, Component, props, err, __N_RSC } = input;
    let styleSheets = 'initial' in input ? undefined : input.styleSheets;
    Component = Component || lastAppProps.Component;
    props = props || lastAppProps.props;
    const isRSC = process.env.__NEXT_RSC && 'initial' in input ? !!rsc : !!__N_RSC;
    const appProps = _objectSpread({
    }, props, {
        Component: isRSC ? RSCComponent : Component,
        err,
        router
    });
    // lastAppProps has to be set before ReactDom.render to account for ReactDom throwing an error.
    lastAppProps = appProps;
    let canceled = false;
    let resolvePromise;
    const renderPromise = new Promise((resolve, reject) => {
        if (lastRenderReject) {
            lastRenderReject();
        }
        resolvePromise = () => {
            lastRenderReject = null;
            resolve();
        };
        lastRenderReject = () => {
            canceled = true;
            lastRenderReject = null;
            const error = new Error('Cancel rendering route');
            error.cancelled = true;
            reject(error);
        };
    });
    // This function has a return type to ensure it doesn't start returning a
    // Promise. It should remain synchronous.
    function onStart() {
        if (!styleSheets || // We use `style-loader` in development, so we don't need to do anything
            // unless we're in production:
            process.env.NODE_ENV !== 'production') {
            return false;
        }
        const currentStyleTags = looseToArray(document.querySelectorAll('style[data-n-href]'));
        const currentHrefs = new Set(currentStyleTags.map((tag) => tag.getAttribute('data-n-href')
        ));
        const noscript = document.querySelector('noscript[data-n-css]');
        const nonce = noscript === null || noscript === void 0 ? void 0 : noscript.getAttribute('data-n-css');
        styleSheets.forEach(({ href, text }) => {
            if (!currentHrefs.has(href)) {
                const styleTag = document.createElement('style');
                styleTag.setAttribute('data-n-href', href);
                styleTag.setAttribute('media', 'x');
                if (nonce) {
                    styleTag.setAttribute('nonce', nonce);
                }
                document.head.appendChild(styleTag);
                styleTag.appendChild(document.createTextNode(text));
            }
        });
        return true;
    }
    function onHeadCommit() {
        if (// We use `style-loader` in development, so we don't need to do anything
            // unless we're in production:
            process.env.NODE_ENV === 'production' && // We can skip this during hydration. Running it wont cause any harm, but
            // we may as well save the CPU cycles:
            styleSheets && // Ensure this render was not canceled
            !canceled) {
            const desiredHrefs = new Set(styleSheets.map((s) => s.href
            ));
            const currentStyleTags = looseToArray(document.querySelectorAll('style[data-n-href]'));
            const currentHrefs = currentStyleTags.map((tag) => tag.getAttribute('data-n-href')
            );
            // Toggle `<style>` tags on or off depending on if they're needed:
            for (let idx = 0; idx < currentHrefs.length; ++idx) {
                if (desiredHrefs.has(currentHrefs[idx])) {
                    currentStyleTags[idx].removeAttribute('media');
                } else {
                    currentStyleTags[idx].setAttribute('media', 'x');
                }
            }
            // Reorder styles into intended order:
            let referenceNode = document.querySelector('noscript[data-n-css]');
            if (// This should be an invariant:
                referenceNode) {
                styleSheets.forEach(({ href }) => {
                    const targetTag = document.querySelector(`style[data-n-href="${href}"]`);
                    if (// This should be an invariant:
                        targetTag) {
                        referenceNode.parentNode.insertBefore(targetTag, referenceNode.nextSibling);
                        referenceNode = targetTag;
                    }
                });
            }
            // Finally, clean up server rendered stylesheets:
            looseToArray(document.querySelectorAll('link[data-n-p]')).forEach((el) => {
                el.parentNode.removeChild(el);
            });
        }
        if (input.scroll) {
            window.scrollTo(input.scroll.x, input.scroll.y);
        }
    }
    function onRootCommit() {
        resolvePromise();
    }
    onStart();
    const elem = /*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/ _react.default.createElement(Head, {
        callback: onHeadCommit
    }), /*#__PURE__*/ _react.default.createElement(AppContainer, null, /*#__PURE__*/ _react.default.createElement(App, Object.assign({
    }, appProps)), /*#__PURE__*/ _react.default.createElement(_portal.Portal, {
        type: "next-route-announcer"
    }, /*#__PURE__*/ _react.default.createElement(_routeAnnouncer.RouteAnnouncer, null))));
    // We catch runtime errors using componentDidCatch which will trigger renderError
    renderReactElement(appElement, (callback) =>/*#__PURE__*/ _react.default.createElement(Root, {
        callbacks: [
            callback,
            onRootCommit
        ]
    }, process.env.__NEXT_STRICT_MODE ? /*#__PURE__*/ _react.default.createElement(_react.default.StrictMode, null, elem) : elem)
    );
    return renderPromise;
}
function Root({ callbacks, children }) {
    // We use `useLayoutEffect` to guarantee the callbacks are executed
    // as soon as React flushes the update
    _react.default.useLayoutEffect(() => callbacks.forEach((callback) => callback()
    )
        , [
            callbacks
        ]);
    if (process.env.__NEXT_TEST_MODE) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        _react.default.useEffect(() => {
            window.__NEXT_HYDRATED = true;
            if (window.__NEXT_HYDRATED_CB) {
                window.__NEXT_HYDRATED_CB();
            }
        }, []);
    }
    // We should ask to measure the Web Vitals after rendering completes so we
    // don't cause any hydration delay:
    _react.default.useEffect(() => {
        (0, _performanceRelayer).default(onPerfEntry);
    }, []);
    return children;
}
// Dummy component that we render as a child of Root so that we can
// toggle the correct styles before the page is rendered.
function Head({ callback }) {
    // We use `useLayoutEffect` to guarantee the callback is executed
    // as soon as React flushes the update.
    _react.default.useLayoutEffect(() => callback()
        , [
            callback
        ]);
    return null;
}
