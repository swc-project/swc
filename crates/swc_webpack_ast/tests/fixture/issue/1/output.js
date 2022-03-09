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
var source;
var key;
const data = null;
export const version = process.env.__NEXT_VERSION;
const looseToArray = null, { props: hydrateProps , err: hydrateErr , page , query , buildId , assetPrefix , runtimeConfig , dynamicIds , isFallback , locale , locales , domainLocales , isPreview , rsc ,  } = null;
let { defaultLocale  } = null;
const prefix = null;
setConfig(null);
let asPath = getURL();
if (hasBasePath(null), delBasePath(null), process.env.__NEXT_I18N_SUPPORT) {
    const { normalizeLocalePath  } = require("../shared/lib/i18n/normalize-locale-path"), { detectDomainLocale  } = require("../shared/lib/i18n/detect-domain-locale"), { parseRelativeUrl  } = require("../shared/lib/router/utils/parse-relative-url"), { formatUrl  } = require("../shared/lib/router/utils/format-url");
    const parsedAs = null, localePathResult = null;
    const detectedDomain = null;
}
const { initScriptLoader  } = require("./script");
const pageLoader = new PageLoader(null, null), register = null;
const headManager = initHeadManager(), appElement = null;
let lastRenderReject, webpackHMR;
export let router;
let CachedApp, onPerfEntry;
class Container extends React.Component {
    componentDidMount() {
        isDynamicRoute(null), assign(urlQueryToSearchParams(null));
    }
    scrollToHash() {
        let { hash  } = null;
        const el = null;
    }
    render() {
        const { ReactDevOverlay  } = require("@next/react-dev-overlay/lib/client");
        React.createElement(null, null, this);
    }
}
export const emitter = mitt();
let CachedComponent;
export async function initNext() {
    let initialErr;
    const appEntrypoint = null;
    const { component: app , exports: mod  } = null;
    const exportedReportWebVitals = null;
    ()=>{
        const uniqueID = null;
        let perfStartEntry;
        const webVitals = null;
        trackWebVitalMetric(null);
    };
    const pageEntrypoint = null;
    if (process.env.NODE_ENV) {
        const { isValidElementType  } = require("react-is");
    }
    isError(null);
    if ("development" === process.env.NODE_ENV) {
        const { getNodeError  } = require("@next/react-dev-overlay/lib/client");
        ()=>{
            let error;
            const node = null;
        };
    }
    createRouter(null, null, null, null);
    const renderCtx = null;
}
export async function render() {
    const renderErr = null;
}
export function renderError() {
    const { App , err  } = null;
    import("../pages/_error")(null)(()=>{
        const AppTree = null;
        loadGetInitialProps(null, null)(null);
    });
}
let reactRoot, shouldHydrate;
ST;
const reactEl = null;
ReactDOM.hydrateRoot(null, null), ReactDOM.hydrate(null, null), ReactDOM.render(null, null);
ST;
ST;
const navStartEntries = null;
React.createElement(null, null, React.createElement(RouterContext.Provider, makePublicRouterInstance(null), React.createElement(HeadManagerContext.Provider, null, React.createElement(StyleRegistry, null, null))));
const wrapApp = ()=>{
    const appProps = null;
    React.createElement(null, null, React.createElement(null, null));
};
let RSCComponent;
if (process.env.__NEXT_RSC) {
    const rscCache = null, RSCWrapper = ()=>{
        const { createFromFetch ,  } = require("next/dist/compiled/react-server-dom-webpack");
        let response;
        (()=>{
            const t = null;
        })(), (()=>{
            const search = null, flightReqUrl = null;
        })();
        const root = null;
    };
    ()=>{
        const cacheKey = useRouter(), { __flight_serialized__ , __flight_fresh__  } = null;
        React.createElement(React.Suspense, null, React.createElement(null, null));
    };
}
let lastAppProps;
let { App , Component , props , err , __N_RSC  } = null, styleSheets;
const isRSC = !__N_RSC, appProps = null;
let canceled, resolvePromise;
const renderPromise = ()=>{
    ()=>{
        const error = null;
    };
};
const currentStyleTags = null, currentHrefs = null, noscript = null, nonce = null;
()=>{
    const styleTag = null;
};
const elem = React.createElement(React.Fragment, null, React.createElement(null, function() {
    const desiredHrefs = null, currentStyleTags = null, currentHrefs = null;
    let referenceNode;
    ()=>{
        const targetTag = null;
    }, ()=>{};
}), React.createElement(null, null, React.createElement(null, null), React.createElement(Portal, "next-route-announcer", React.createElement(RouteAnnouncer, null))));
React.createElement(React.createElement(React.StrictMode, null, null));
React.useLayoutEffect(null, null), React.useEffect(()=>{}, null), React.useEffect(()=>{
    measureWebVitals(null);
}, null);
React.useLayoutEffect(null, null);
