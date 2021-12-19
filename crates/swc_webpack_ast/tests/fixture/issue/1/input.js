import "@next/polyfill-module";
import React from "react";
import ReactDOM from "react-dom";
import { StyleRegistry } from "styled-jsx";
import { HeadManagerContext } from "../shared/lib/head-manager-context";
import mitt from "../shared/lib/mitt";
import { RouterContext } from "../shared/lib/router-context";
import { delBasePath, hasBasePath } from "../shared/lib/router/router";
import { isDynamicRoute } from "../shared/lib/router/utils/is-dynamic";
import { urlQueryToSearchParams, assign } from "../shared/lib/router/utils/querystring";
import { setConfig } from "../shared/lib/runtime-config";
import { getURL, loadGetInitialProps, ST } from "../shared/lib/utils";
import { Portal } from "./portal";
import initHeadManager from "./head-manager";
import PageLoader from "./page-loader";
import measureWebVitals from "./performance-relayer";
import { RouteAnnouncer } from "./route-announcer";
import { createRouter, makePublicRouterInstance, useRouter } from "./router";
import isError from "../lib/is-error";
import { trackWebVitalMetric } from "./vitals";
function _extends() {
    return (_extends = Object.assign || function (target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
    }).apply(this, arguments);
}
const data = JSON.parse(document.getElementById("__NEXT_DATA__").textContent);
window.__NEXT_DATA__ = data;
export const version = process.env.__NEXT_VERSION;
const looseToArray = (input) => [].slice.call(input)
    , { props: hydrateProps, err: hydrateErr, page, query, buildId, assetPrefix, runtimeConfig, dynamicIds, isFallback, locale, locales, domainLocales, isPreview, rsc, } = data;
let { defaultLocale } = data;
const prefix = assetPrefix || "";
__webpack_public_path__ = `${prefix}/_next/`, setConfig({
    serverRuntimeConfig: {
    },
    publicRuntimeConfig: runtimeConfig || {
    }
});
let asPath = getURL();
if (hasBasePath(asPath) && (asPath = delBasePath(asPath)), process.env.__NEXT_I18N_SUPPORT) {
    const { normalizeLocalePath } = require("../shared/lib/i18n/normalize-locale-path"), { detectDomainLocale } = require("../shared/lib/i18n/detect-domain-locale"), { parseRelativeUrl } = require("../shared/lib/router/utils/parse-relative-url"), { formatUrl } = require("../shared/lib/router/utils/format-url");
    if (locales) {
        const parsedAs = parseRelativeUrl(asPath), localePathResult = normalizeLocalePath(parsedAs.pathname, locales);
        localePathResult.detectedLocale ? (parsedAs.pathname = localePathResult.pathname, asPath = formatUrl(parsedAs)) : defaultLocale = locale;
        const detectedDomain = detectDomainLocale(process.env.__NEXT_I18N_DOMAINS, window.location.hostname);
        detectedDomain && (defaultLocale = detectedDomain.defaultLocale);
    }
}
if (data.scriptLoader) {
    const { initScriptLoader } = require("./script");
    initScriptLoader(data.scriptLoader);
}
const pageLoader = new PageLoader(buildId, prefix), register = ([r, f]) => pageLoader.routeLoader.onEntrypoint(r, f)
    ;
window.__NEXT_P && window.__NEXT_P.map((p) => setTimeout(() => register(p)
    , 0)
), window.__NEXT_P = [], window.__NEXT_P.push = register;
const headManager = initHeadManager(), appElement = document.getElementById("__next");
let lastRenderReject, webpackHMR;
export let router;
let CachedApp, onPerfEntry;
headManager.getIsSsr = () => router.isSsr
    ;
class Container extends React.Component {
    componentDidCatch(componentErr, info1) {
        this.props.fn(componentErr, info1);
    }
    componentDidMount() {
        this.scrollToHash(), router.isSsr && "/404" !== page && "/_error" !== page && (isFallback || data.nextExport && (isDynamicRoute(router.pathname) || location.search || process.env.__NEXT_HAS_REWRITES) || hydrateProps && hydrateProps.__N_SSG && (location.search || process.env.__NEXT_HAS_REWRITES)) && router.replace(router.pathname + "?" + String(assign(urlQueryToSearchParams(router.query), new URLSearchParams(location.search))), asPath, {
            _h: 1,
            shallow: !isFallback
        });
    }
    componentDidUpdate() {
        this.scrollToHash();
    }
    scrollToHash() {
        let { hash } = location;
        if (hash = hash && hash.substring(1)) {
            const el = document.getElementById(hash);
            el && setTimeout(() => el.scrollIntoView()
                , 0);
        }
    }
    render() {
        if ("production" === process.env.NODE_ENV) return this.props.children;
        {
            const { ReactDevOverlay } = require("@next/react-dev-overlay/lib/client");
            return React.createElement(ReactDevOverlay, null, this.props.children);
        }
    }
}
export const emitter = mitt();
let CachedComponent;
export async function initNext(opts = {
}) {
    "development" === process.env.NODE_ENV && (webpackHMR = opts.webpackHMR);
    let initialErr = hydrateErr;
    try {
        const appEntrypoint = await pageLoader.routeLoader.whenEntrypoint("/_app");
        if ("error" in appEntrypoint) throw appEntrypoint.error;
        const { component: app, exports: mod } = appEntrypoint;
        CachedApp = app;
        const exportedReportWebVitals = mod && mod.reportWebVitals;
        onPerfEntry = ({ id, name, startTime, value, duration, entryType, entries }) => {
            const uniqueID = `${Date.now()}-${Math.floor(Math.random() * (9000000000000 - 1)) + 1000000000000}`;
            let perfStartEntry;
            entries && entries.length && (perfStartEntry = entries[0].startTime);
            const webVitals = {
                id: id || uniqueID,
                name,
                startTime: startTime || perfStartEntry,
                value: null == value ? duration : value,
                label: "mark" === entryType || "measure" === entryType ? "custom" : "web-vital"
            };
            exportedReportWebVitals?.(webVitals), trackWebVitalMetric(webVitals);
        };
        const pageEntrypoint = "development" === process.env.NODE_ENV && hydrateErr ? {
            error: hydrateErr
        } : await pageLoader.routeLoader.whenEntrypoint(page);
        if ("error" in pageEntrypoint) throw pageEntrypoint.error;
        if (CachedComponent = pageEntrypoint.component, "production" !== process.env.NODE_ENV) {
            const { isValidElementType } = require("react-is");
            if (!isValidElementType(CachedComponent)) throw new Error(`The default export is not a React Component in page: "${page}"`);
        }
    } catch (error1) {
        initialErr = isError(error1) ? error1 : new Error(error1 + "");
    }
    if ("development" === process.env.NODE_ENV) {
        const { getNodeError } = require("@next/react-dev-overlay/lib/client");
        initialErr && (initialErr === hydrateErr ? setTimeout(() => {
            let error;
            try {
                throw new Error(initialErr.message);
            } catch (e) {
                error = e;
            }
            if (error.name = initialErr.name, error.stack = initialErr.stack, "middleware" in hydrateErr) throw error;
            const node = getNodeError(error);
            throw node;
        }) : setTimeout(() => {
            throw initialErr;
        }));
    }
    window.__NEXT_PRELOADREADY && await window.__NEXT_PRELOADREADY(dynamicIds), router = createRouter(page, query, asPath, {
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
        initial: !0,
        Component: CachedComponent,
        props: hydrateProps,
        err: initialErr
    };
    return "production" === process.env.NODE_ENV ? (render(renderCtx), emitter) : {
        emitter,
        renderCtx
    };
}
export async function render(renderingProps) {
    if (renderingProps.err) {
        await renderError(renderingProps);
        return;
    }
    try {
        await doRender(renderingProps);
    } catch (err) {
        const renderErr = err instanceof Error ? err : new Error(err + "");
        if (renderErr.cancelled) throw renderErr;
        "development" === process.env.NODE_ENV && setTimeout(() => {
            throw renderErr;
        }), await renderError({
            ...renderingProps,
            err: renderErr
        });
    }
}
export function renderError(renderErrorProps) {
    const { App, err } = renderErrorProps;
    return "production" !== process.env.NODE_ENV ? (webpackHMR.onUnrecoverableError(), doRender({
        App: () => null
        ,
        props: {
        },
        Component: () => null
        ,
        styleSheets: []
    })) : (console.error(err), console.error("A client-side exception has occurred, see here for more info: https://nextjs.org/docs/messages/client-side-exception-occurred"), pageLoader.loadPage("/_error").then(({ page: ErrorComponent, styleSheets }) => lastAppProps?.Component === ErrorComponent ? import("../pages/_error").then((m) => ({
        ErrorComponent: m.default,
        styleSheets: []
    })
    ) : {
        ErrorComponent,
        styleSheets
    }
    ).then(({ ErrorComponent, styleSheets }) => {
        const AppTree = wrapApp(App);
        return Promise.resolve(renderErrorProps.props ? renderErrorProps.props : loadGetInitialProps(App, {
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
        })).then((initProps) => doRender({
            ...renderErrorProps,
            err,
            Component: ErrorComponent,
            styleSheets,
            props: initProps
        })
        );
    }));
}
let reactRoot = null, shouldHydrate = !0;
function renderReactElement(domEl, fn) {
    ST && performance.mark("beforeRender");
    const reactEl = fn(shouldHydrate ? markHydrateComplete : markRenderComplete);
    process.env.__NEXT_REACT_ROOT ? reactRoot ? reactRoot.render(reactEl) : (reactRoot = ReactDOM.hydrateRoot(domEl, reactEl), shouldHydrate = !1) : shouldHydrate ? (ReactDOM.hydrate(reactEl, domEl), shouldHydrate = !1) : ReactDOM.render(reactEl, domEl);
}
function markHydrateComplete() {
    ST && (performance.mark("afterHydrate"), performance.measure("Next.js-before-hydration", "navigationStart", "beforeRender"), performance.measure("Next.js-hydration", "beforeRender", "afterHydrate"), onPerfEntry && performance.getEntriesByName("Next.js-hydration").forEach(onPerfEntry), clearMarks());
}
function markRenderComplete() {
    if (ST) {
        performance.mark("afterRender");
        const navStartEntries = performance.getEntriesByName("routeChange", "mark");
        navStartEntries.length && (performance.measure("Next.js-route-change-to-render", navStartEntries[0].name, "beforeRender"), performance.measure("Next.js-render", "beforeRender", "afterRender"), onPerfEntry && (performance.getEntriesByName("Next.js-render").forEach(onPerfEntry), performance.getEntriesByName("Next.js-route-change-to-render").forEach(onPerfEntry)), clearMarks(), [
            "Next.js-route-change-to-render",
            "Next.js-render"
        ].forEach((measure) => performance.clearMeasures(measure)
        ));
    }
}
function clearMarks() {
    [
        "beforeRender",
        "afterHydrate",
        "afterRender",
        "routeChange"
    ].forEach((mark) => performance.clearMarks(mark)
    );
}
function AppContainer({ children }) {
    return React.createElement(Container, {
        fn: (error) => renderError({
            App: CachedApp,
            err: error
        }).catch((err) => console.error("Error rendering page: ", err)
        )
    }, React.createElement(RouterContext.Provider, {
        value: makePublicRouterInstance(router)
    }, React.createElement(HeadManagerContext.Provider, {
        value: headManager
    }, React.createElement(StyleRegistry, null, children))));
}
const wrapApp = (App) => (wrappedAppProps) => {
    const appProps = {
        ...wrappedAppProps,
        Component: CachedComponent,
        err: hydrateErr,
        router
    };
    return React.createElement(AppContainer, null, React.createElement(App, _extends({
    }, appProps)));
}
    ;
let RSCComponent;
if (process.env.__NEXT_RSC) {
    function createResponseCache() {
        return new Map();
    }
    const rscCache = createResponseCache(), RSCWrapper = ({ cacheKey, serialized, _fresh }) => {
        const { createFromFetch, } = require("next/dist/compiled/react-server-dom-webpack");
        let response = rscCache.get(cacheKey);
        response || (response = createFromFetch(serialized ? (() => {
            const t = new TransformStream();
            return t.writable.getWriter().write(new TextEncoder().encode(serialized)), Promise.resolve({
                body: t.readable
            });
        })() : (() => {
            const search = location.search, flightReqUrl = location.pathname + search + (search ? "&__flight__" : "?__flight__");
            return fetch(flightReqUrl);
        })()), rscCache.set(cacheKey, response));
        const root = response.readRoot();
        return root;
    };
    RSCComponent = (props) => {
        const cacheKey = useRouter().asPath, { __flight_serialized__, __flight_fresh__ } = props;
        return React.createElement(React.Suspense, {
            fallback: null
        }, React.createElement(RSCWrapper, {
            cacheKey: cacheKey,
            serialized: __flight_serialized__,
            _fresh: __flight_fresh__
        }));
    };
}
let lastAppProps;
function doRender(input) {
    let { App, Component, props, err, __N_RSC } = input, styleSheets = "initial" in input ? void 0 : input.styleSheets;
    Component = Component || lastAppProps.Component, props = props || lastAppProps.props;
    const isRSC = process.env.__NEXT_RSC && "initial" in input ? !!rsc : !!__N_RSC, appProps = {
        ...props,
        Component: isRSC ? RSCComponent : Component,
        err,
        router
    };
    lastAppProps = appProps;
    let canceled = !1, resolvePromise;
    const renderPromise = new Promise((resolve, reject) => {
        lastRenderReject && lastRenderReject(), resolvePromise = () => {
            lastRenderReject = null, resolve();
        }, lastRenderReject = () => {
            canceled = !0, lastRenderReject = null;
            const error = new Error("Cancel rendering route");
            error.cancelled = !0, reject(error);
        };
    });
    function onRootCommit() {
        resolvePromise();
    }
    !function () {
        if (!styleSheets || "production" !== process.env.NODE_ENV) return !1;
        const currentStyleTags = looseToArray(document.querySelectorAll("style[data-n-href]")), currentHrefs = new Set(currentStyleTags.map((tag) => tag.getAttribute("data-n-href")
        )), noscript = document.querySelector("noscript[data-n-css]"), nonce = noscript?.getAttribute("data-n-css");
        return styleSheets.forEach(({ href, text }) => {
            if (!currentHrefs.has(href)) {
                const styleTag = document.createElement("style");
                styleTag.setAttribute("data-n-href", href), styleTag.setAttribute("media", "x"), nonce && styleTag.setAttribute("nonce", nonce), document.head.appendChild(styleTag), styleTag.appendChild(document.createTextNode(text));
            }
        }), !0;
    }();
    const elem = React.createElement(React.Fragment, null, React.createElement(Head, {
        callback: function () {
            if ("production" === process.env.NODE_ENV && styleSheets && !canceled) {
                const desiredHrefs = new Set(styleSheets.map((s) => s.href
                )), currentStyleTags = looseToArray(document.querySelectorAll("style[data-n-href]")), currentHrefs = currentStyleTags.map((tag) => tag.getAttribute("data-n-href")
                );
                for (let idx = 0; idx < currentHrefs.length; ++idx)desiredHrefs.has(currentHrefs[idx]) ? currentStyleTags[idx].removeAttribute("media") : currentStyleTags[idx].setAttribute("media", "x");
                let referenceNode = document.querySelector("noscript[data-n-css]");
                referenceNode && styleSheets.forEach(({ href }) => {
                    const targetTag = document.querySelector(`style[data-n-href="${href}"]`);
                    targetTag && (referenceNode.parentNode.insertBefore(targetTag, referenceNode.nextSibling), referenceNode = targetTag);
                }), looseToArray(document.querySelectorAll("link[data-n-p]")).forEach((el) => {
                    el.parentNode.removeChild(el);
                });
            }
            input.scroll && window.scrollTo(input.scroll.x, input.scroll.y);
        }
    }), React.createElement(AppContainer, null, React.createElement(App, _extends({
    }, appProps)), React.createElement(Portal, {
        type: "next-route-announcer"
    }, React.createElement(RouteAnnouncer, null))));
    return renderReactElement(appElement, (callback) => React.createElement(Root, {
        callbacks: [
            callback,
            onRootCommit
        ]
    }, process.env.__NEXT_STRICT_MODE ? React.createElement(React.StrictMode, null, elem) : elem)
    ), renderPromise;
}
function Root({ callbacks, children }) {
    return React.useLayoutEffect(() => callbacks.forEach((callback) => callback()
    )
        , [
            callbacks
        ]), process.env.__NEXT_TEST_MODE && React.useEffect(() => {
            window.__NEXT_HYDRATED = !0, window.__NEXT_HYDRATED_CB && window.__NEXT_HYDRATED_CB();
        }, []), React.useEffect(() => {
            measureWebVitals(onPerfEntry);
        }, []), children;
}
function Head({ callback }) {
    return React.useLayoutEffect(() => callback()
        , [
            callback
        ]), null;
}
