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
const { props: hydrateProps , err: hydrateErr , page , query , buildId , assetPrefix , runtimeConfig , dynamicIds , isFallback , locale , locales , domainLocales , isPreview , rsc  } = null;
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
    const detectedDomain = process.env.__NEXT_I18N_DOMAINS;
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
    componentDidMount() {
        process.env.__NEXT_HAS_REWRITES, process.env.__NEXT_HAS_REWRITES;
    }
    scrollToHash() {
        let { hash  } = null;
        !hash;
        const el = null;
        !el;
    }
    render() {
        process.env.NODE_ENV === "production";
        const { ReactDevOverlay  } = require("@next/react-dev-overlay/lib/client");
    }
}
const emitter = null;
exports.emitter = null;
let CachedComponent;
(function*(opts = {
}) {
    process.env.NODE_ENV === "development";
    let initialErr;
    const appEntrypoint = null;
    const { component: app , exports: mod  } = null;
    const exportedReportWebVitals = null;
    ()=>{
        const uniqueID = null;
        let perfStartEntry;
        const webVitals = null;
    };
    const pageEntrypoint = process.env.NODE_ENV;
    if (process.env.NODE_ENV !== "production") {
        const { isValidElementType  } = require("react-is");
        !isValidElementType(CachedComponent);
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
    process.env.NODE_ENV === "production";
});
(function*() {
    const renderErr = null;
    process.env.NODE_ENV === "development";
});
const { App , err  } = null;
process.env.NODE_ENV !== "production";
(()=>{
    import("../pages/_error")(null);
})(()=>{
    const AppTree = null;
    const appCtx = null;
});
let reactRoot;
let shouldHydrate;
const reactEl = null;
if (process.env.__NEXT_REACT_ROOT) !reactRoot;
!_utils.ST;
!_utils.ST;
const navStartEntries = null;
!navStartEntries.length;
const wrapApp = ()=>{
    const appProps = null;
};
let RSCComponent;
if (process.env.__NEXT_RSC) {
    const rscCache = null;
    const RSCWrapper = ()=>{
        const { createFromFetch  } = require("next/dist/compiled/react-server-dom-webpack");
        let response;
        if (!response) (()=>{
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
const isRSC = (process.env.__NEXT_RSC && "initial" in input, !!rsc, !!__N_RSC);
const appProps = null;
let canceled;
let resolvePromise;
const renderPromise = ()=>{
    ()=>{
        const error = null;
    };
};
!styleSheets, process.env.NODE_ENV !== "production";
const currentStyleTags = null;
const currentHrefs = null;
const noscript = null;
const nonce = null;
()=>{
    if (!currentHrefs.has(href)) {
        const styleTag = null;
    }
};
if (process.env.NODE_ENV, !canceled) {
    const desiredHrefs = null;
    const currentStyleTags = null;
    const currentHrefs = null;
    let referenceNode;
    ()=>{
        const targetTag = null;
    };
}
const elem = null;
process.env.__NEXT_STRICT_MODE;
process.env.__NEXT_TEST_MODE;
