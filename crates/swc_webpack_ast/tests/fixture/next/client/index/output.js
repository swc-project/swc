exports;
exports.initNext = null;
exports.render = null;
exports.renderError = null;
exports.emitter = exports.router = exports.version = null;
require("@next/polyfill-module");
var _react = require("react");
var _reactDom = require("react-dom");
var _styledJsx = require("styled-jsx");
var _headManagerContext = require("../shared/lib/head-manager-context");
var _mitt = require("../shared/lib/mitt");
var _routerContext = require("../shared/lib/router-context");
var _router = require("../shared/lib/router/router");
var _isDynamic = require("../shared/lib/router/utils/is-dynamic");
var _querystring = require("../shared/lib/router/utils/querystring");
var _runtimeConfig = require("../shared/lib/runtime-config");
var _utils = require("../shared/lib/utils");
var _portal = require("./portal");
var _headManager = require("./head-manager");
var _pageLoader = require("./page-loader");
var _performanceRelayer = require("./performance-relayer");
var _routeAnnouncer = require("./route-announcer");
var _router1 = require("./router");
var _isError = require("../lib/is-error");
var _vitals = require("./vitals");
var info;
var value;
(function() {
    var self, args;
    (function() {
        var gen;
    });
});
var newObj;
var key;
var desc;
var source;
var ownKeys;
const data = null;
const version = null;
exports.version = null;
const looseToArray = null;
const { props: hydrateProps , err: hydrateErr , page , query , buildId , assetPrefix , runtimeConfig , dynamicIds , isFallback , locale , locales , domainLocales , isPreview , rsc ,  } = null;
let { defaultLocale  } = null;
const prefix = null;
let asPath;
if (process.env.__NEXT_I18N_SUPPORT) {
    const { normalizeLocalePath  } = require("../shared/lib/i18n/normalize-locale-path");
    const { detectDomainLocale  } = require("../shared/lib/i18n/detect-domain-locale");
    const { parseRelativeUrl  } = require("../shared/lib/router/utils/parse-relative-url");
    const { formatUrl  } = require("../shared/lib/router/utils/format-url");
    const parsedAs = null;
    const localePathResult = null;
    // attempt detecting default locale based on hostname
    const detectedDomain = null;
}
const { initScriptLoader  } = require("./script");
const pageLoader = null;
const register = null;
const headManager = null;
const appElement = null;
let lastRenderReject;
let webpackHMR;
let router;
exports.router = null;
let CachedApp, onPerfEntry;
class Container {
    scrollToHash() {
        let { hash  } = null;
        const el = null;
    }
    render() {
        if (process.env.NODE_ENV === "production") ;
        else {
            const { ReactDevOverlay  } = require("@next/react-dev-overlay/lib/client");
        }
    }
}
const emitter = null;
exports.emitter = null;
let CachedComponent;
(function*() {
    let initialErr;
    const appEntrypoint = null;
    const { component: app , exports: mod  } = null;
    const exportedReportWebVitals = null;
    ()=>{
        // Combines timestamp with random number for unique ID
        const uniqueID = null;
        let perfStartEntry;
        const webVitals = null;
    };
    const pageEntrypoint = // error, so we need to skip waiting for the entrypoint.
    null;
    if (process.env.NODE_ENV !== "production") {
        const { isValidElementType  } = require("react-is");
    }
    if (process.env.NODE_ENV === "development") {
        const { getNodeError  } = require("@next/react-dev-overlay/lib/client");
        ()=>{
            let error;
            const node = null;
        };
    }
    exports.router = null;
    const renderCtx = null;
});
(function*() {
    const renderErr = null;
});
const { App , err  } = null;
(()=>{
    import("../pages/_error")(null);
})(()=>{
    // In production we do a normal render with the `ErrorComponent` as component.
    // If we've gotten here upon initial render, we can use the props from the server.
    // Otherwise, we need to call `getInitialProps` on `App` before mounting.
    const AppTree = null;
    const appCtx = null;
});
let reactRoot;
// On initial render a hydrate should always happen
let shouldHydrate;
const reactEl = null;
const navStartEntries = null;
const wrapApp = ()=>{
    const appProps = null;
};
let RSCComponent;
if (process.env.__NEXT_RSC) {
    const rscCache = null;
    const RSCWrapper = ()=>{
        const { createFromFetch ,  } = require("next/dist/compiled/react-server-dom-webpack");
        let response;
        (()=>{
            const t = null;
        })(), (()=>{
            const search = null;
            const flightReqUrl = null;
        })();
        const root = null;
    };
    ()=>{
        const cacheKey = null;
        const { __flight_serialized__ , __flight_fresh__  } = null;
    };
}
let lastAppProps;
let { App: App1 , Component , props , err: err1 , __N_RSC  } = null;
let styleSheets;
const isRSC = !__N_RSC;
const appProps = null;
let canceled;
let resolvePromise;
const renderPromise = ()=>{
    ()=>{
        const error = null;
    };
};
const currentStyleTags = null;
const currentHrefs = null;
const noscript = null;
const nonce = null;
()=>{
    const styleTag = null;
};
const desiredHrefs = null;
const currentStyleTags1 = null;
const currentHrefs1 = null;
// Reorder styles into intended order:
let referenceNode;
()=>{
    const targetTag = null;
};
const elem = /*#__PURE__*/ null;
