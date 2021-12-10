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
export const version = process.env.__NEXT_VERSION;
setConfig(null);
getURL();
if (hasBasePath(null), delBasePath(null), process.env.__NEXT_I18N_SUPPORT) {
    require("../shared/lib/i18n/normalize-locale-path"), require("../shared/lib/i18n/detect-domain-locale"), require("../shared/lib/router/utils/parse-relative-url"), require("../shared/lib/router/utils/format-url");
    process.env.__NEXT_I18N_DOMAINS;
}
require("./script");
PageLoader;
initHeadManager();
export let router;
class Container extends React.Component {
    componentDidMount() {
        isDynamicRoute(null), process.env.__NEXT_HAS_REWRITES, process.env.__NEXT_HAS_REWRITES, assign(urlQueryToSearchParams(null));
    }
    render() {
        "production" === process.env.NODE_ENV;
        require("@next/react-dev-overlay/lib/client");
        React.createElement(null, null, this);
    }
}
export const emitter = mitt();
export async function initNext(opts = {
}) {
    process.env.NODE_ENV;
    ()=>{
        trackWebVitalMetric(null);
    };
    process.env.NODE_ENV;
    if (process.env.NODE_ENV) require("react-is");
    isError(null);
    if ("development" === process.env.NODE_ENV) require("@next/react-dev-overlay/lib/client");
    createRouter(null, null, null, null);
    process.env.NODE_ENV;
}
export async function render() {
    process.env.NODE_ENV;
}
export function renderError() {
    "production" !== process.env.NODE_ENV, import("../pages/_error")(null)(()=>{
        loadGetInitialProps(null, null)(null);
    });
}
ST;
process.env.__NEXT_REACT_ROOT, ReactDOM.hydrateRoot(null, null), ReactDOM.hydrate(null, null), ReactDOM.render(null, null);
ST;
ST;
React.createElement(null, null, React.createElement(RouterContext.Provider, makePublicRouterInstance(null), React.createElement(HeadManagerContext.Provider, null, React.createElement(StyleRegistry, null, null))));
()=>{
    React.createElement(null, null, React.createElement(null, null));
};
if (process.env.__NEXT_RSC) {
    ()=>{
        require("next/dist/compiled/react-server-dom-webpack");
    };
    ()=>{
        useRouter();
        React.createElement(React.Suspense, null, React.createElement(null, null));
    };
}
process.env.__NEXT_RSC;
process.env.NODE_ENV;
React.createElement(React.Fragment, null, React.createElement(null, function() {
    if (process.env.NODE_ENV) ()=>{
    }, ()=>{
    };
}), React.createElement(null, null, React.createElement(null, null), React.createElement(Portal, "next-route-announcer", React.createElement(RouteAnnouncer, null))));
React.createElement((process.env.__NEXT_STRICT_MODE, React.createElement(React.StrictMode, null, null)));
React.useLayoutEffect(null, null), process.env.__NEXT_TEST_MODE && React.useEffect(()=>{
    window.__NEXT_HYDRATED = !0, window.__NEXT_HYDRATED_CB && window.__NEXT_HYDRATED_CB();
}, []), React.useEffect(()=>{
    measureWebVitals(null);
}, null);
React.useLayoutEffect(null, null);
