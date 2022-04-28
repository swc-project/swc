(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[179],{

/***/ 3413:
/***/ (function(module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = initHeadManager;
exports.isEqualNode = isEqualNode;
exports.DOMAttributeNames = void 0;

function initHeadManager() {
  let updatePromise = null;
  return {
    mountedInstances: new Set(),
    updateHead: head => {
      const promise = updatePromise = Promise.resolve().then(() => {
        if (promise !== updatePromise) return;
        updatePromise = null;
        const tags = {};
        head.forEach(h => {
          if ( // If the font tag is loaded only on client navigation
          // it won't be inlined. In this case revert to the original behavior
          h.type === 'link' && h.props['data-optimized-fonts']) {
            if (document.querySelector("style[data-href=\"".concat(h.props['data-href'], "\"]"))) {
              return;
            } else {
              h.props.href = h.props['data-href'];
              h.props['data-href'] = undefined;
            }
          }

          const components = tags[h.type] || [];
          components.push(h);
          tags[h.type] = components;
        });
        const titleComponent = tags.title ? tags.title[0] : null;
        let title = '';

        if (titleComponent) {
          const {
            children
          } = titleComponent.props;
          title = typeof children === 'string' ? children : Array.isArray(children) ? children.join('') : '';
        }

        if (title !== document.title) document.title = title;
        ['meta', 'base', 'link', 'style', 'script'].forEach(type => {
          updateElements(type, tags[type] || []);
        });
      });
    }
  };
}

const DOMAttributeNames = {
  acceptCharset: 'accept-charset',
  className: 'class',
  htmlFor: 'for',
  httpEquiv: 'http-equiv',
  noModule: 'noModule'
};
exports.DOMAttributeNames = DOMAttributeNames;

function reactElementToDOM({
  type,
  props
}) {
  const el = document.createElement(type);

  for (const p in props) {
    if (!props.hasOwnProperty(p)) continue;
    if (p === 'children' || p === 'dangerouslySetInnerHTML') continue; // we don't render undefined props to the DOM

    if (props[p] === undefined) continue;
    const attr = DOMAttributeNames[p] || p.toLowerCase();

    if (type === 'script' && (attr === 'async' || attr === 'defer' || attr === 'noModule')) {
      el[attr] = !!props[p];
    } else {
      el.setAttribute(attr, props[p]);
    }
  }

  const {
    children,
    dangerouslySetInnerHTML
  } = props;

  if (dangerouslySetInnerHTML) {
    el.innerHTML = dangerouslySetInnerHTML.__html || '';
  } else if (children) {
    el.textContent = typeof children === 'string' ? children : Array.isArray(children) ? children.join('') : '';
  }

  return el;
}

function isEqualNode(oldTag, newTag) {
  if (oldTag instanceof HTMLElement && newTag instanceof HTMLElement) {
    const nonce = newTag.getAttribute('nonce'); // Only strip the nonce if `oldTag` has had it stripped. An element's nonce attribute will not
    // be stripped if there is no content security policy response header that includes a nonce.

    if (nonce && !oldTag.getAttribute('nonce')) {
      const cloneTag = newTag.cloneNode(true);
      cloneTag.setAttribute('nonce', '');
      cloneTag.nonce = nonce;
      return nonce === oldTag.nonce && oldTag.isEqualNode(cloneTag);
    }
  }

  return oldTag.isEqualNode(newTag);
}

function updateElements(type, components) {
  const headEl = document.getElementsByTagName('head')[0];
  const headCountEl = headEl.querySelector('meta[name=next-head-count]');

  if (false) {}

  const headCount = Number(headCountEl.content);
  const oldTags = [];

  for (let i = 0, j = headCountEl.previousElementSibling; i < headCount; i++, j = (j === null || j === void 0 ? void 0 : j.previousElementSibling) || null) {
    var ref;

    if ((j === null || j === void 0 ? void 0 : (ref = j.tagName) === null || ref === void 0 ? void 0 : ref.toLowerCase()) === type) {
      oldTags.push(j);
    }
  }

  const newTags = components.map(reactElementToDOM).filter(newTag => {
    for (let k = 0, len = oldTags.length; k < len; k++) {
      const oldTag = oldTags[k];

      if (isEqualNode(oldTag, newTag)) {
        oldTags.splice(k, 1);
        return false;
      }
    }

    return true;
  });
  oldTags.forEach(t => {
    var ref;
    return (ref = t.parentNode) === null || ref === void 0 ? void 0 : ref.removeChild(t);
  });
  newTags.forEach(t => headEl.insertBefore(t, headCountEl));
  headCountEl.content = (headCount - oldTags.length + newTags.length).toString();
}

if (typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) {
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

/***/ }),

/***/ 1274:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.initialize = initialize;
exports.hydrate = hydrate;
exports.emitter = exports.router = exports.version = void 0;

__webpack_require__(1541);

var _react = _interopRequireWildcard(__webpack_require__(2784));

var _reactDom = _interopRequireDefault(__webpack_require__(8316));

var _headManagerContext = __webpack_require__(5285);

var _mitt = _interopRequireDefault(__webpack_require__(8062));

var _routerContext = __webpack_require__(7258);

var _router = __webpack_require__(7744);

var _isDynamic = __webpack_require__(1020);

var _querystring = __webpack_require__(4877);

var _runtimeConfig = __webpack_require__(8026);

var _utils = __webpack_require__(3177);

var _portal = __webpack_require__(2181);

var _headManager = _interopRequireDefault(__webpack_require__(3413));

var _pageLoader = _interopRequireDefault(__webpack_require__(1865));

var _performanceRelayer = _interopRequireDefault(__webpack_require__(4333));

var _routeAnnouncer = __webpack_require__(7340);

var _router1 = __webpack_require__(5876);

var _isError = __webpack_require__(274);

var _vitals = __webpack_require__(9257);

var _refresh = __webpack_require__(7633);

var _imageConfigContext = __webpack_require__(4053);

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
    var self = this,
        args = arguments;
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
    var newObj = {};

    if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {};

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
    var source = arguments[i] != null ? arguments[i] : {};
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

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

const version = "12.1.6-canary.12";
exports.version = version;
let router;
exports.router = router;
const emitter = (0, _mitt).default();
exports.emitter = emitter;

const looseToArray = input => [].slice.call(input);

let initialData;
let defaultLocale = undefined;
let asPath;
let pageLoader;
let appElement;
let headManager;
let lastRenderReject;
let webpackHMR;
let CachedApp, onPerfEntry;
let CachedComponent;
let isRSCPage;

class Container extends _react.default.Component {
  componentDidCatch(componentErr, info) {
    this.props.fn(componentErr, info);
  }

  componentDidMount() {
    this.scrollToHash(); // We need to replace the router state if:
    // - the page was (auto) exported and has a query string or search (hash)
    // - it was auto exported and is a dynamic route (to provide params)
    // - if it is a client-side skeleton (fallback render)

    if (router.isSsr && // We don't update for 404 requests as this can modify
    // the asPath unexpectedly e.g. adding basePath when
    // it wasn't originally present
    initialData.page !== '/404' && initialData.page !== '/_error' && (initialData.isFallback || initialData.nextExport && ((0, _isDynamic).isDynamicRoute(router.pathname) || location.search || true) || initialData.props && initialData.props.__N_SSG && (location.search || true))) {
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
        shallow: !initialData.isFallback
      });
    }
  }

  componentDidUpdate() {
    this.scrollToHash();
  }

  scrollToHash() {
    let {
      hash
    } = location;
    hash = hash && hash.substring(1);
    if (!hash) return;
    const el = document.getElementById(hash);
    if (!el) return; // If we call scrollIntoView() in here without a setTimeout
    // it won't scroll properly.

    setTimeout(() => el.scrollIntoView(), 0);
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
  _initialize = _asyncToGenerator(function* (opts = {}) {
    // This makes sure this specific lines are removed in production
    if (false) {}

    initialData = JSON.parse(document.getElementById('__NEXT_DATA__').textContent);
    window.__NEXT_DATA__ = initialData;
    defaultLocale = initialData.defaultLocale;
    const prefix = initialData.assetPrefix || ''; // With dynamic assetPrefix it's no longer possible to set assetPrefix at the build time
    // So, this is how we do it in the client side at runtime

    __webpack_require__.p = "".concat(prefix, "/_next/") //eslint-disable-line
    ; // Initialize next/config with the environment configuration

    (0, _runtimeConfig).setConfig({
      serverRuntimeConfig: {},
      publicRuntimeConfig: initialData.runtimeConfig || {}
    });
    asPath = (0, _utils).getURL(); // make sure not to attempt stripping basePath for 404s

    if ((0, _router).hasBasePath(asPath)) {
      asPath = (0, _router).delBasePath(asPath);
    }

    if (true) {
      const {
        normalizeLocalePath
      } = __webpack_require__(716);

      const {
        detectDomainLocale
      } = __webpack_require__(776);

      const {
        parseRelativeUrl
      } = __webpack_require__(3107);

      const {
        formatUrl
      } = __webpack_require__(4696);

      if (initialData.locales) {
        const parsedAs = parseRelativeUrl(asPath);
        const localePathResult = normalizeLocalePath(parsedAs.pathname, initialData.locales);

        if (localePathResult.detectedLocale) {
          parsedAs.pathname = localePathResult.pathname;
          asPath = formatUrl(parsedAs);
        } else {
          // derive the default locale if it wasn't detected in the asPath
          // since we don't prerender static pages with all possible default
          // locales
          defaultLocale = initialData.locale;
        } // attempt detecting default locale based on hostname


        const detectedDomain = detectDomainLocale(undefined, window.location.hostname); // TODO: investigate if defaultLocale needs to be populated after
        // hydration to prevent mismatched renders

        if (detectedDomain) {
          defaultLocale = detectedDomain.defaultLocale;
        }
      }
    }

    if (initialData.scriptLoader) {
      const {
        initScriptLoader
      } = __webpack_require__(3990);

      initScriptLoader(initialData.scriptLoader);
    }

    pageLoader = new _pageLoader.default(initialData.buildId, prefix);

    const register = ([r, f]) => pageLoader.routeLoader.onEntrypoint(r, f);

    if (window.__NEXT_P) {
      // Defer page registration for another tick. This will increase the overall
      // latency in hydrating the page, but reduce the total blocking time.
      window.__NEXT_P.map(p => setTimeout(() => register(p), 0));
    }

    window.__NEXT_P = [];
    window.__NEXT_P.push = register;
    headManager = (0, _headManager).default();

    headManager.getIsSsr = () => {
      return router.isSsr;
    };

    appElement = document.getElementById('__next');
    return {
      assetPrefix: prefix
    };
  });
  return _initialize.apply(this, arguments);
}

function hydrate(opts) {
  return _hydrate.apply(this, arguments);
}

function _hydrate() {
  _hydrate = _asyncToGenerator(function* (opts) {
    let initialErr = initialData.err;

    try {
      const appEntrypoint = yield pageLoader.routeLoader.whenEntrypoint('/_app');

      if ('error' in appEntrypoint) {
        throw appEntrypoint.error;
      }

      const {
        component: app,
        exports: mod
      } = appEntrypoint;
      CachedApp = app;
      const exportedReportWebVitals = mod && mod.reportWebVitals;

      onPerfEntry = ({
        id,
        name,
        startTime,
        value,
        duration,
        entryType,
        entries
      }) => {
        // Combines timestamp with random number for unique ID
        const uniqueID = "".concat(Date.now(), "-").concat(Math.floor(Math.random() * (9000000000000 - 1)) + 1000000000000);
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
       false ? 0 : yield pageLoader.routeLoader.whenEntrypoint(initialData.page);

      if ('error' in pageEntrypoint) {
        throw pageEntrypoint.error;
      }

      CachedComponent = pageEntrypoint.component;
      isRSCPage = !!pageEntrypoint.exports.__next_rsc__;

      if (false) {}
    } catch (error1) {
      // This catches errors like throwing in the top level of a module
      initialErr = (0, _isError).getProperError(error1);
    }

    if (false) {}

    if (window.__NEXT_PRELOADREADY) {
      yield window.__NEXT_PRELOADREADY(initialData.dynamicIds);
    }

    exports.router = router = (0, _router1).createRouter(initialData.page, initialData.query, asPath, {
      initialProps: initialData.props,
      pageLoader,
      App: CachedApp,
      Component: CachedComponent,
      wrapApp,
      err: initialErr,
      isFallback: Boolean(initialData.isFallback),
      subscription: (info, App, scroll) => render(Object.assign({}, info, {
        App,
        scroll
      })),
      locale: initialData.locale,
      locales: initialData.locales,
      defaultLocale,
      domainLocales: initialData.domainLocales,
      isPreview: initialData.isPreview,
      isRsc: initialData.rsc
    });
    const renderCtx = {
      App: CachedApp,
      initial: true,
      Component: CachedComponent,
      props: initialData.props,
      err: initialErr
    };

    if (opts === null || opts === void 0 ? void 0 : opts.beforeRender) {
      yield opts.beforeRender();
    }

    render(renderCtx);
  });
  return _hydrate.apply(this, arguments);
}

function render(renderingProps) {
  return _render.apply(this, arguments);
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
      const renderErr = (0, _isError).getProperError(err); // bubble up cancelation errors

      if (renderErr.cancelled) {
        throw renderErr;
      }

      if (false) {}

      yield renderError(_objectSpread({}, renderingProps, {
        err: renderErr
      }));
    }
  });
  return _render.apply(this, arguments);
} // This method handles all runtime and debug errors.
// 404 and 500 errors are special kind of errors
// and they are still handle via the main render method.


function renderError(renderErrorProps) {
  const {
    App,
    err
  } = renderErrorProps; // In development runtime errors are caught by our overlay
  // In production we catch runtime errors using componentDidCatch which will trigger renderError

  if (false) {} // Make sure we log the error to the console, otherwise users can't track down issues.


  console.error(err);
  console.error("A client-side exception has occurred, see here for more info: https://nextjs.org/docs/messages/client-side-exception-occurred");
  return pageLoader.loadPage('/_error').then(({
    page: ErrorComponent,
    styleSheets
  }) => {
    return (lastAppProps === null || lastAppProps === void 0 ? void 0 : lastAppProps.Component) === ErrorComponent ? __webpack_require__.e(/* import() */ 169).then(__webpack_require__.bind(__webpack_require__, 1169)).then(m => ({
      ErrorComponent: m.default,
      styleSheets: []
    })) : {
      ErrorComponent,
      styleSheets
    };
  }).then(({
    ErrorComponent,
    styleSheets
  }) => {
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
    return Promise.resolve(renderErrorProps.props ? renderErrorProps.props : (0, _utils).loadGetInitialProps(App, appCtx)).then(initProps => doRender(_objectSpread({}, renderErrorProps, {
      err,
      Component: ErrorComponent,
      styleSheets,
      props: initProps
    })));
  });
}

let reactRoot = null; // On initial render a hydrate should always happen

let shouldHydrate = true;

function renderReactElement(domEl, fn) {
  // mark start of hydrate/render
  if (_utils.ST) {
    performance.mark('beforeRender');
  }

  const reactEl = fn(shouldHydrate ? markHydrateComplete : markRenderComplete);

  if (true) {
    if (!reactRoot) {
      // Unlike with createRoot, you don't need a separate root.render() call here
      const ReactDOMClient = __webpack_require__(7029);

      reactRoot = ReactDOMClient.hydrateRoot(domEl, reactEl); // TODO: Remove shouldHydrate variable when React 18 is stable as it can depend on `reactRoot` existing

      shouldHydrate = false;
    } else {
      const startTransition = _react.default.startTransition;
      startTransition(() => {
        reactRoot.render(reactEl);
      });
    }
  } else {}
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
  ['Next.js-route-change-to-render', 'Next.js-render'].forEach(measure => performance.clearMeasures(measure));
}

function clearMarks() {
  ['beforeRender', 'afterHydrate', 'afterRender', 'routeChange'].forEach(mark => performance.clearMarks(mark));
}

function AppContainer({
  children
}) {
  return /*#__PURE__*/_react.default.createElement(Container, {
    fn: error => renderError({
      App: CachedApp,
      err: error
    }).catch(err => console.error('Error rendering page: ', err))
  }, /*#__PURE__*/_react.default.createElement(_routerContext.RouterContext.Provider, {
    value: (0, _router1).makePublicRouterInstance(router)
  }, /*#__PURE__*/_react.default.createElement(_headManagerContext.HeadManagerContext.Provider, {
    value: headManager
  }, /*#__PURE__*/_react.default.createElement(_imageConfigContext.ImageConfigContext.Provider, {
    value: {"deviceSizes":[640,750,828,1080,1200,1920,2048,3840],"imageSizes":[16,32,48,64,96,128,256,384],"path":"/_next/image","loader":"default","experimentalLayoutRaw":false}
  }, children))));
}

function renderApp(App, appProps) {
  if (false) {} else {
    return /*#__PURE__*/_react.default.createElement(App, Object.assign({}, appProps));
  }
}

const wrapApp = App => wrappedAppProps => {
  const appProps = _objectSpread({}, wrappedAppProps, {
    Component: CachedComponent,
    err: initialData.err,
    router
  });

  return /*#__PURE__*/_react.default.createElement(AppContainer, null, renderApp(App, appProps));
};

let RSCComponent;

if (false) {}

let lastAppProps;

function doRender(input) {
  let {
    App,
    Component,
    props,
    err,
    __N_RSC
  } = input;
  let styleSheets = 'initial' in input ? undefined : input.styleSheets;
  Component = Component || lastAppProps.Component;
  props = props || lastAppProps.props;
  const isRSC =  false ? 0 : !!__N_RSC;

  const appProps = _objectSpread({}, props, {
    Component: isRSC ? RSCComponent : Component,
    err,
    router
  }); // lastAppProps has to be set before ReactDom.render to account for ReactDom throwing an error.


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
  }); // This function has a return type to ensure it doesn't start returning a
  // Promise. It should remain synchronous.

  function onStart() {
    if (!styleSheets || // We use `style-loader` in development, so we don't need to do anything
    // unless we're in production:
    false) {
      return false;
    }

    const currentStyleTags = looseToArray(document.querySelectorAll('style[data-n-href]'));
    const currentHrefs = new Set(currentStyleTags.map(tag => tag.getAttribute('data-n-href')));
    const noscript = document.querySelector('noscript[data-n-css]');
    const nonce = noscript === null || noscript === void 0 ? void 0 : noscript.getAttribute('data-n-css');
    styleSheets.forEach(({
      href,
      text
    }) => {
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
    if ( // We use `style-loader` in development, so we don't need to do anything
    // unless we're in production:
     true && // We can skip this during hydration. Running it wont cause any harm, but
    // we may as well save the CPU cycles:
    styleSheets && // Ensure this render was not canceled
    !canceled) {
      const desiredHrefs = new Set(styleSheets.map(s => s.href));
      const currentStyleTags = looseToArray(document.querySelectorAll('style[data-n-href]'));
      const currentHrefs = currentStyleTags.map(tag => tag.getAttribute('data-n-href')); // Toggle `<style>` tags on or off depending on if they're needed:

      for (let idx = 0; idx < currentHrefs.length; ++idx) {
        if (desiredHrefs.has(currentHrefs[idx])) {
          currentStyleTags[idx].removeAttribute('media');
        } else {
          currentStyleTags[idx].setAttribute('media', 'x');
        }
      } // Reorder styles into intended order:


      let referenceNode = document.querySelector('noscript[data-n-css]');

      if ( // This should be an invariant:
      referenceNode) {
        styleSheets.forEach(({
          href
        }) => {
          const targetTag = document.querySelector("style[data-n-href=\"".concat(href, "\"]"));

          if ( // This should be an invariant:
          targetTag) {
            referenceNode.parentNode.insertBefore(targetTag, referenceNode.nextSibling);
            referenceNode = targetTag;
          }
        });
      } // Finally, clean up server rendered stylesheets:


      looseToArray(document.querySelectorAll('link[data-n-p]')).forEach(el => {
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

  const elem = /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(Head, {
    callback: onHeadCommit
  }), /*#__PURE__*/_react.default.createElement(AppContainer, null, renderApp(App, appProps), /*#__PURE__*/_react.default.createElement(_portal.Portal, {
    type: "next-route-announcer"
  }, /*#__PURE__*/_react.default.createElement(_routeAnnouncer.RouteAnnouncer, null)))); // We catch runtime errors using componentDidCatch which will trigger renderError


  renderReactElement(appElement, callback => /*#__PURE__*/_react.default.createElement(Root, {
    callbacks: [callback, onRootCommit]
  },  true ? /*#__PURE__*/_react.default.createElement(_react.default.StrictMode, null, elem) : 0));
  return renderPromise;
}

function Root({
  callbacks,
  children
}) {
  // We use `useLayoutEffect` to guarantee the callbacks are executed
  // as soon as React flushes the update
  _react.default.useLayoutEffect(() => callbacks.forEach(callback => callback()), [callbacks]); // We should ask to measure the Web Vitals after rendering completes so we
  // don't cause any hydration delay:


  _react.default.useEffect(() => {
    (0, _performanceRelayer).default(onPerfEntry);
    (0, _vitals).flushBufferedVitalsMetrics();
  }, []);

  if (false) {}

  return children;
} // Dummy component that we render as a child of Root so that we can
// toggle the correct styles before the page is rendered.


function Head({
  callback
}) {
  // We use `useLayoutEffect` to guarantee the callback is executed
  // as soon as React flushes the update.
  _react.default.useLayoutEffect(() => callback(), [callback]);

  return null;
}

if (typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) {
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

/***/ }),

/***/ 1180:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ = __webpack_require__(1274);

window.next = {
  version: _.version,

  // router is initialized later so it has to be live-binded
  get router() {
    return _.router;
  },

  emitter: _.emitter
};
(0, _).initialize({}).then(() => (0, _).hydrate()).catch(console.error);

if (typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) {
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

/***/ }),

/***/ 5737:
/***/ (function(module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.removePathTrailingSlash = removePathTrailingSlash;
exports.normalizePathTrailingSlash = void 0;

function removePathTrailingSlash(path) {
  return path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path;
}

const normalizePathTrailingSlash =  false ? 0 : removePathTrailingSlash;
exports.normalizePathTrailingSlash = normalizePathTrailingSlash;

if (typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) {
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

/***/ }),

/***/ 1865:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _router = __webpack_require__(7744);

var _getAssetPathFromRoute = _interopRequireDefault(__webpack_require__(3466));

var _isDynamic = __webpack_require__(1020);

var _parseRelativeUrl = __webpack_require__(3107);

var _normalizeTrailingSlash = __webpack_require__(5737);

var _routeLoader = __webpack_require__(1722);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

function normalizeRoute(route) {
  if (route[0] !== '/') {
    throw new Error("Route name should start with a \"/\", got \"".concat(route, "\""));
  }

  if (route === '/') return route;
  return route.replace(/\/$/, '');
}

class PageLoader {
  getPageList() {
    if (true) {
      return (0, _routeLoader).getClientBuildManifest().then(manifest => manifest.sortedPages);
    } else {}
  }

  getMiddlewareList() {
    if (true) {
      return (0, _routeLoader).getMiddlewareManifest();
    } else {}
  }
  /**
  * @param {string} href the route href (file-system path)
  * @param {string} asPath the URL as shown in browser (virtual path); used for dynamic routes
  * @returns {string}
  */


  getDataHref({
    href,
    asPath,
    ssg,
    flight,
    locale
  }) {
    const {
      pathname: hrefPathname,
      query,
      search
    } = (0, _parseRelativeUrl).parseRelativeUrl(href);
    const {
      pathname: asPathname
    } = (0, _parseRelativeUrl).parseRelativeUrl(asPath);
    const route = normalizeRoute(hrefPathname);

    const getHrefForSlug = path => {
      if (flight) {
        return path + search + (search ? "&" : '?') + '__flight__=1';
      }

      const dataRoute = (0, _getAssetPathFromRoute).default((0, _normalizeTrailingSlash).removePathTrailingSlash((0, _router).addLocale(path, locale)), '.json');
      return (0, _router).addBasePath("/_next/data/".concat(this.buildId).concat(dataRoute).concat(ssg ? '' : search));
    };

    const isDynamic = (0, _isDynamic).isDynamicRoute(route);
    const interpolatedRoute = isDynamic ? (0, _router).interpolateAs(hrefPathname, asPathname, query).result : '';
    return isDynamic ? interpolatedRoute && getHrefForSlug(interpolatedRoute) : getHrefForSlug(route);
  }
  /**
  * @param {string} route - the route (file-system path)
  */


  _isSsg(route) {
    return this.promisedSsgManifest.then(manifest => manifest.has(route));
  }

  loadPage(route) {
    return this.routeLoader.loadRoute(route).then(res => {
      if ('component' in res) {
        return {
          page: res.component,
          mod: res.exports,
          styleSheets: res.styles.map(o => ({
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

  constructor(buildId, assetPrefix) {
    this.routeLoader = (0, _routeLoader).createRouteLoader(assetPrefix);
    this.buildId = buildId;
    this.assetPrefix = assetPrefix;
    this.promisedSsgManifest = new Promise(resolve => {
      if (window.__SSG_MANIFEST) {
        resolve(window.__SSG_MANIFEST);
      } else {
        window.__SSG_MANIFEST_CB = () => {
          resolve(window.__SSG_MANIFEST);
        };
      }
    });
  }

}

exports["default"] = PageLoader;

if (typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) {
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

/***/ }),

/***/ 4333:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _webVitals = __webpack_require__(9600);

const initialHref = location.href;
let isRegistered = false;
let userReportHandler;

function onReport(metric) {
  if (userReportHandler) {
    userReportHandler(metric);
  } // This code is not shipped, executed, or present in the client-side
  // JavaScript bundle unless explicitly enabled in your application.
  //
  // When this feature is enabled, we'll make it very clear by printing a
  // message during the build (`next build`).


  if (false) {}
}

var _default = onPerfEntry => {
  // Update function if it changes:
  userReportHandler = onPerfEntry; // Only register listeners once:

  if (isRegistered) {
    return;
  }

  isRegistered = true;
  (0, _webVitals).getCLS(onReport);
  (0, _webVitals).getFID(onReport);
  (0, _webVitals).getFCP(onReport);
  (0, _webVitals).getLCP(onReport);
  (0, _webVitals).getTTFB(onReport);
};

exports["default"] = _default;

if (typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) {
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

/***/ }),

/***/ 2181:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Portal = void 0;

var _react = _interopRequireDefault(__webpack_require__(2784));

var _reactDom = __webpack_require__(8316);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

const Portal = ({
  children,
  type
}) => {
  let portalNode = _react.default.useRef(null);

  let [, forceUpdate] = _react.default.useState();

  _react.default.useEffect(() => {
    portalNode.current = document.createElement(type);
    document.body.appendChild(portalNode.current);
    forceUpdate({});
    return () => {
      if (portalNode.current) {
        document.body.removeChild(portalNode.current);
      }
    };
  }, [type]);

  return portalNode.current ? /*#__PURE__*/(0, _reactDom).createPortal(children, portalNode.current) : null;
};

exports.Portal = Portal;

if (typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) {
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

/***/ }),

/***/ 1859:
/***/ (function(module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.cancelIdleCallback = exports.requestIdleCallback = void 0;

const requestIdleCallback = typeof self !== 'undefined' && self.requestIdleCallback && self.requestIdleCallback.bind(window) || function (cb) {
  let start = Date.now();
  return setTimeout(function () {
    cb({
      didTimeout: false,
      timeRemaining: function () {
        return Math.max(0, 50 - (Date.now() - start));
      }
    });
  }, 1);
};

exports.requestIdleCallback = requestIdleCallback;

const cancelIdleCallback = typeof self !== 'undefined' && self.cancelIdleCallback && self.cancelIdleCallback.bind(window) || function (id) {
  return clearTimeout(id);
};

exports.cancelIdleCallback = cancelIdleCallback;

if (typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) {
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

/***/ }),

/***/ 7340:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.RouteAnnouncer = RouteAnnouncer;
exports["default"] = void 0;

var _react = _interopRequireDefault(__webpack_require__(2784));

var _router = __webpack_require__(5876);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

function RouteAnnouncer() {
  const {
    asPath
  } = (0, _router).useRouter();

  const [routeAnnouncement, setRouteAnnouncement] = _react.default.useState(''); // Only announce the path change, but not for the first load because screen
  // reader will do that automatically.


  const previouslyLoadedPath = _react.default.useRef(asPath); // Every time the path changes, announce the new page’s title following this
  // priority: first the document title (from head), otherwise the first h1, or
  // if none of these exist, then the pathname from the URL. This methodology is
  // inspired by Marcy Sutton’s accessible client routing user testing. More
  // information can be found here:
  // https://www.gatsbyjs.com/blog/2019-07-11-user-testing-accessible-client-routing/


  _react.default.useEffect(() => {
    // If the path hasn't change, we do nothing.
    if (previouslyLoadedPath.current === asPath) return;
    previouslyLoadedPath.current = asPath;

    if (document.title) {
      setRouteAnnouncement(document.title);
    } else {
      const pageHeader = document.querySelector('h1');
      var ref;
      const content = (ref = pageHeader === null || pageHeader === void 0 ? void 0 : pageHeader.innerText) !== null && ref !== void 0 ? ref : pageHeader === null || pageHeader === void 0 ? void 0 : pageHeader.textContent;
      setRouteAnnouncement(content || asPath);
    }
  }, // TODO: switch to pathname + query object of dynamic route requirements
  [asPath]);

  return /*#__PURE__*/_react.default.createElement("p", {
    "aria-live": "assertive" // Make the announcement immediately.
    ,
    id: "__next-route-announcer__",
    role: "alert",
    style: {
      border: 0,
      clip: 'rect(0 0 0 0)',
      height: '1px',
      margin: '-1px',
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      width: '1px',
      // https://medium.com/@jessebeach/beware-smushed-off-screen-accessible-text-5952a4c2cbfe
      whiteSpace: 'nowrap',
      wordWrap: 'normal'
    }
  }, routeAnnouncement);
}

var _default = RouteAnnouncer;
exports["default"] = _default;

if (typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) {
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

/***/ }),

/***/ 1722:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.markAssetError = markAssetError;
exports.isAssetError = isAssetError;
exports.getClientBuildManifest = getClientBuildManifest;
exports.getMiddlewareManifest = getMiddlewareManifest;
exports.createRouteLoader = createRouteLoader;

var _getAssetPathFromRoute = _interopRequireDefault(__webpack_require__(3466));

var _requestIdleCallback = __webpack_require__(1859);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
} // 3.8s was arbitrarily chosen as it's what https://web.dev/interactive
// considers as "Good" time-to-interactive. We must assume something went
// wrong beyond this point, and then fall-back to a full page transition to
// show the user something of value.


const MS_MAX_IDLE_DELAY = 3800;

function withFuture(key, map, generator) {
  let entry = map.get(key);

  if (entry) {
    if ('future' in entry) {
      return entry.future;
    }

    return Promise.resolve(entry);
  }

  let resolver;
  const prom = new Promise(resolve => {
    resolver = resolve;
  });
  map.set(key, entry = {
    resolve: resolver,
    future: prom
  });
  return generator ? generator() // eslint-disable-next-line no-sequences
  .then(value => (resolver(value), value)).catch(err => {
    map.delete(key);
    throw err;
  }) : prom;
}

function hasPrefetch(link) {
  try {
    link = document.createElement('link');
    return (// detect IE11 since it supports prefetch but isn't detected
      // with relList.support
      !!window.MSInputMethodContext && !!document.documentMode || link.relList.supports('prefetch')
    );
  } catch (e) {
    return false;
  }
}

const canPrefetch = hasPrefetch();

function prefetchViaDom(href, as, link) {
  return new Promise((res, rej) => {
    const selector = "\n      link[rel=\"prefetch\"][href^=\"".concat(href, "\"],\n      link[rel=\"preload\"][href^=\"").concat(href, "\"],\n      script[src^=\"").concat(href, "\"]");

    if (document.querySelector(selector)) {
      return res();
    }

    link = document.createElement('link'); // The order of property assignment here is intentional:

    if (as) link.as = as;
    link.rel = "prefetch";
    link.crossOrigin = undefined;
    link.onload = res;
    link.onerror = rej; // `href` should always be last:

    link.href = href;
    document.head.appendChild(link);
  });
}

const ASSET_LOAD_ERROR = Symbol('ASSET_LOAD_ERROR');

function markAssetError(err) {
  return Object.defineProperty(err, ASSET_LOAD_ERROR, {});
}

function isAssetError(err) {
  return err && ASSET_LOAD_ERROR in err;
}

function appendScript(src, script) {
  return new Promise((resolve, reject) => {
    script = document.createElement('script'); // The order of property assignment here is intentional.
    // 1. Setup success/failure hooks in case the browser synchronously
    //    executes when `src` is set.

    script.onload = resolve;

    script.onerror = () => reject(markAssetError(new Error("Failed to load script: ".concat(src)))); // 2. Configure the cross-origin attribute before setting `src` in case the
    //    browser begins to fetch.


    script.crossOrigin = undefined; // 3. Finally, set the source and inject into the DOM in case the child
    //    must be appended for fetching to start.

    script.src = src;
    document.body.appendChild(script);
  });
} // We wait for pages to be built in dev before we start the route transition
// timeout to prevent an un-necessary hard navigation in development.


let devBuildPromise; // Resolve a promise that times out after given amount of milliseconds.

function resolvePromiseWithTimeout(p, ms, err) {
  return new Promise((resolve, reject) => {
    let cancelled = false;
    p.then(r => {
      // Resolved, cancel the timeout
      cancelled = true;
      resolve(r);
    }).catch(reject); // We wrap these checks separately for better dead-code elimination in
    // production bundles.

    if (false) {}

    if (true) {
      (0, _requestIdleCallback).requestIdleCallback(() => setTimeout(() => {
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

  const onBuildManifest = new Promise(resolve => {
    // Mandatory because this is not concurrent safe:
    const cb = self.__BUILD_MANIFEST_CB;

    self.__BUILD_MANIFEST_CB = () => {
      resolve(self.__BUILD_MANIFEST);
      cb && cb();
    };
  });
  return resolvePromiseWithTimeout(onBuildManifest, MS_MAX_IDLE_DELAY, markAssetError(new Error('Failed to load client build manifest')));
}

function getMiddlewareManifest() {
  if (self.__MIDDLEWARE_MANIFEST) {
    return Promise.resolve(self.__MIDDLEWARE_MANIFEST);
  }

  const onMiddlewareManifest = new Promise(resolve => {
    const cb = self.__MIDDLEWARE_MANIFEST_CB;

    self.__MIDDLEWARE_MANIFEST_CB = () => {
      resolve(self.__MIDDLEWARE_MANIFEST);
      cb && cb();
    };
  });
  return resolvePromiseWithTimeout(onMiddlewareManifest, MS_MAX_IDLE_DELAY, markAssetError(new Error('Failed to load client middleware manifest')));
}

function getFilesForRoute(assetPrefix, route) {
  if (false) {}

  return getClientBuildManifest().then(manifest => {
    if (!(route in manifest)) {
      throw markAssetError(new Error("Failed to lookup route: ".concat(route)));
    }

    const allFiles = manifest[route].map(entry => assetPrefix + '/_next/' + encodeURI(entry));
    return {
      scripts: allFiles.filter(v => v.endsWith('.js')),
      css: allFiles.filter(v => v.endsWith('.css'))
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
      let prom = loadedScripts.get(src);

      if (prom) {
        return prom;
      } // Skip executing script if it's already in the DOM:


      if (document.querySelector("script[src^=\"".concat(src, "\"]"))) {
        return Promise.resolve();
      }

      loadedScripts.set(src, prom = appendScript(src));
      return prom;
    } else {}
  }

  function fetchStyleSheet(href) {
    let prom = styleSheets.get(href);

    if (prom) {
      return prom;
    }

    styleSheets.set(href, prom = fetch(href).then(res => {
      if (!res.ok) {
        throw new Error("Failed to load stylesheet: ".concat(href));
      }

      return res.text().then(text => ({
        href: href,
        content: text
      }));
    }).catch(err => {
      throw markAssetError(err);
    }));
    return prom;
  }

  return {
    whenEntrypoint(route) {
      return withFuture(route, entrypoints);
    },

    onEntrypoint(route, execute) {
      (execute ? Promise.resolve().then(() => execute()).then(exports => ({
        component: exports && exports.default || exports,
        exports: exports
      }), err => ({
        error: err
      })) : Promise.resolve(undefined)).then(input => {
        const old = entrypoints.get(route);

        if (old && 'resolve' in old) {
          if (input) {
            entrypoints.set(route, input);
            old.resolve(input);
          }
        } else {
          if (input) {
            entrypoints.set(route, input);
          } else {
            entrypoints.delete(route);
          } // when this entrypoint has been resolved before
          // the route is outdated and we want to invalidate
          // this cache entry


          routes.delete(route);
        }
      });
    },

    loadRoute(route, prefetch) {
      return withFuture(route, routes, () => {
        let devBuildPromiseResolve;

        if (false) {}

        return resolvePromiseWithTimeout(getFilesForRoute(assetPrefix, route).then(({
          scripts,
          css
        }) => {
          return Promise.all([entrypoints.has(route) ? [] : Promise.all(scripts.map(maybeExecuteScript)), Promise.all(css.map(fetchStyleSheet))]);
        }).then(res => {
          return this.whenEntrypoint(route).then(entrypoint => ({
            entrypoint,
            styles: res[1]
          }));
        }), MS_MAX_IDLE_DELAY, markAssetError(new Error("Route did not complete loading: ".concat(route)))).then(({
          entrypoint,
          styles
        }) => {
          const res = Object.assign({
            styles: styles
          }, entrypoint);
          return 'error' in entrypoint ? entrypoint : res;
        }).catch(err => {
          if (prefetch) {
            // we don't want to cache errors during prefetch
            throw err;
          }

          return {
            error: err
          };
        }).finally(() => {
          return devBuildPromiseResolve === null || devBuildPromiseResolve === void 0 ? void 0 : devBuildPromiseResolve();
        });
      });
    },

    prefetch(route) {
      // https://github.com/GoogleChromeLabs/quicklink/blob/453a661fa1fa940e2d2e044452398e38c67a98fb/src/index.mjs#L115-L118
      // License: Apache 2.0
      let cn;

      if (cn = navigator.connection) {
        // Don't prefetch if using 2G or if Save-Data is enabled.
        if (cn.saveData || /2g/.test(cn.effectiveType)) return Promise.resolve();
      }

      return getFilesForRoute(assetPrefix, route).then(output => Promise.all(canPrefetch ? output.scripts.map(script => prefetchViaDom(script, 'script')) : [])).then(() => {
        (0, _requestIdleCallback).requestIdleCallback(() => this.loadRoute(route, true).catch(() => {}));
      }).catch( // swallow prefetch errors
      () => {});
    }

  };
}

if (typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) {
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

/***/ }),

/***/ 5876:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
Object.defineProperty(exports, "Router", ({
  enumerable: true,
  get: function () {
    return _router.default;
  }
}));
Object.defineProperty(exports, "withRouter", ({
  enumerable: true,
  get: function () {
    return _withRouter.default;
  }
}));
exports.useRouter = useRouter;
exports.createRouter = createRouter;
exports.makePublicRouterInstance = makePublicRouterInstance;
exports["default"] = void 0;

var _react = _interopRequireDefault(__webpack_require__(2784));

var _router = _interopRequireDefault(__webpack_require__(7744));

var _routerContext = __webpack_require__(7258);

var _isError = _interopRequireDefault(__webpack_require__(274));

var _withRouter = _interopRequireDefault(__webpack_require__(1526));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

const singletonRouter = {
  router: null,
  readyCallbacks: [],

  ready(cb) {
    if (this.router) return cb();

    if (true) {
      this.readyCallbacks.push(cb);
    }
  }

}; // Create public properties and methods of the router in the singletonRouter

const urlPropertyFields = ['pathname', 'route', 'query', 'asPath', 'components', 'isFallback', 'basePath', 'locale', 'locales', 'defaultLocale', 'isReady', 'isPreview', 'isLocaleDomain', 'domainLocales'];
const routerEvents = ['routeChangeStart', 'beforeHistoryChange', 'routeChangeComplete', 'routeChangeError', 'hashChangeStart', 'hashChangeComplete'];
const coreMethodFields = ['push', 'replace', 'reload', 'back', 'prefetch', 'beforePopState']; // Events is a static property on the router, the router doesn't have to be initialized to use it

Object.defineProperty(singletonRouter, 'events', {
  get() {
    return _router.default.events;
  }

});
urlPropertyFields.forEach(field => {
  // Here we need to use Object.defineProperty because we need to return
  // the property assigned to the actual router
  // The value might get changed as we change routes and this is the
  // proper way to access it
  Object.defineProperty(singletonRouter, field, {
    get() {
      const router = getRouter();
      return router[field];
    }

  });
});
coreMethodFields.forEach(field => {
  singletonRouter[field] = (...args) => {
    const router = getRouter();
    return router[field](...args);
  };
});
routerEvents.forEach(event => {
  singletonRouter.ready(() => {
    _router.default.events.on(event, (...args) => {
      const eventField = "on".concat(event.charAt(0).toUpperCase()).concat(event.substring(1));
      const _singletonRouter = singletonRouter;

      if (_singletonRouter[eventField]) {
        try {
          _singletonRouter[eventField](...args);
        } catch (err) {
          console.error("Error when running the Router event: ".concat(eventField));
          console.error((0, _isError).default(err) ? "".concat(err.message, "\n").concat(err.stack) : err + '');
        }
      }
    });
  });
});

function getRouter() {
  if (!singletonRouter.router) {
    const message = 'No router instance found.\n' + 'You should only use "next/router" on the client side of your app.\n';
    throw new Error(message);
  }

  return singletonRouter.router;
}

var _default = singletonRouter;
exports["default"] = _default;

function useRouter() {
  return _react.default.useContext(_routerContext.RouterContext);
}

function createRouter(...args) {
  singletonRouter.router = new _router.default(...args);
  singletonRouter.readyCallbacks.forEach(cb => cb());
  singletonRouter.readyCallbacks = [];
  return singletonRouter.router;
}

function makePublicRouterInstance(router) {
  const scopedRouter = router;
  const instance = {};

  for (const property of urlPropertyFields) {
    if (typeof scopedRouter[property] === 'object') {
      instance[property] = Object.assign(Array.isArray(scopedRouter[property]) ? [] : {}, scopedRouter[property]) // makes sure query is not stateful
      ;
      continue;
    }

    instance[property] = scopedRouter[property];
  } // Events is a static property on the router, the router doesn't have to be initialized to use it


  instance.events = _router.default.events;
  coreMethodFields.forEach(field => {
    instance[field] = (...args) => {
      return scopedRouter[field](...args);
    };
  });
  return instance;
}

if (typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) {
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

/***/ }),

/***/ 3990:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.handleClientScriptLoad = handleClientScriptLoad;
exports.initScriptLoader = initScriptLoader;
exports["default"] = void 0;

var _react = _interopRequireWildcard(__webpack_require__(2784));

var _headManagerContext = __webpack_require__(5285);

var _headManager = __webpack_require__(3413);

var _requestIdleCallback = __webpack_require__(1859);

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

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};

    if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {};

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
    var source = arguments[i] != null ? arguments[i] : {};
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

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

const ScriptCache = new Map();
const LoadCache = new Set();
const ignoreProps = ['onLoad', 'dangerouslySetInnerHTML', 'children', 'onError', 'strategy'];

const loadScript = props => {
  const {
    src,
    id,
    onLoad = () => {},
    dangerouslySetInnerHTML,
    children = '',
    strategy = 'afterInteractive',
    onError
  } = props;
  const cacheKey = id || src; // Script has already loaded

  if (cacheKey && LoadCache.has(cacheKey)) {
    return;
  } // Contents of this script are already loading/loaded


  if (ScriptCache.has(src)) {
    LoadCache.add(cacheKey); // Execute onLoad since the script loading has begun

    ScriptCache.get(src).then(onLoad, onError);
    return;
  }

  const el = document.createElement('script');
  const loadPromise = new Promise((resolve, reject) => {
    el.addEventListener('load', function (e) {
      resolve();

      if (onLoad) {
        onLoad.call(this, e);
      }
    });
    el.addEventListener('error', function (e) {
      reject(e);
    });
  }).catch(function (e) {
    if (onError) {
      onError(e);
    }
  });

  if (src) {
    ScriptCache.set(src, loadPromise);
  }

  LoadCache.add(cacheKey);

  if (dangerouslySetInnerHTML) {
    el.innerHTML = dangerouslySetInnerHTML.__html || '';
  } else if (children) {
    el.textContent = typeof children === 'string' ? children : Array.isArray(children) ? children.join('') : '';
  } else if (src) {
    el.src = src;
  }

  for (const [k, value] of Object.entries(props)) {
    if (value === undefined || ignoreProps.includes(k)) {
      continue;
    }

    const attr = _headManager.DOMAttributeNames[k] || k.toLowerCase();
    el.setAttribute(attr, value);
  }

  if (strategy === 'worker') {
    el.setAttribute('type', 'text/partytown');
  }

  el.setAttribute('data-nscript', strategy);
  document.body.appendChild(el);
};

function handleClientScriptLoad(props) {
  const {
    strategy = 'afterInteractive'
  } = props;

  if (strategy === 'lazyOnload') {
    window.addEventListener('load', () => {
      (0, _requestIdleCallback).requestIdleCallback(() => loadScript(props));
    });
  } else {
    loadScript(props);
  }
}

function loadLazyScript(props) {
  if (document.readyState === 'complete') {
    (0, _requestIdleCallback).requestIdleCallback(() => loadScript(props));
  } else {
    window.addEventListener('load', () => {
      (0, _requestIdleCallback).requestIdleCallback(() => loadScript(props));
    });
  }
}

function addBeforeInteractiveToCache() {
  const scripts = [...document.querySelectorAll('[data-nscript="beforeInteractive"]'), ...document.querySelectorAll('[data-nscript="beforePageRender"]')];
  scripts.forEach(script => {
    const cacheKey = script.id || script.getAttribute('src');
    LoadCache.add(cacheKey);
  });
}

function initScriptLoader(scriptLoaderItems) {
  scriptLoaderItems.forEach(handleClientScriptLoad);
  addBeforeInteractiveToCache();
}

function Script(props) {
  const {
    src = '',
    onLoad = () => {},
    dangerouslySetInnerHTML,
    strategy = 'afterInteractive',
    onError
  } = props,
        restProps = _objectWithoutProperties(props, ["src", "onLoad", "dangerouslySetInnerHTML", "strategy", "onError"]); // Context is available only during SSR


  const {
    updateScripts,
    scripts,
    getIsSsr
  } = (0, _react).useContext(_headManagerContext.HeadManagerContext);
  (0, _react).useEffect(() => {
    if (strategy === 'afterInteractive') {
      loadScript(props);
    } else if (strategy === 'lazyOnload') {
      loadLazyScript(props);
    }
  }, [props, strategy]);

  if (strategy === 'beforeInteractive' || strategy === 'worker') {
    if (updateScripts) {
      scripts[strategy] = (scripts[strategy] || []).concat([_objectSpread({
        src,
        onLoad,
        onError
      }, restProps)]);
      updateScripts(scripts);
    } else if (getIsSsr && getIsSsr()) {
      // Script has already loaded during SSR
      LoadCache.add(restProps.id || src);
    } else if (getIsSsr && !getIsSsr()) {
      loadScript(props);
    }
  }

  return null;
}

var _default = Script;
exports["default"] = _default;

if (typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) {
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

/***/ }),

/***/ 7633:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.useRefreshRoot = useRefreshRoot;
exports.RefreshContext = void 0;

var _react = __webpack_require__(2784);

const RefreshContext = (0, _react).createContext(_props => {});
exports.RefreshContext = RefreshContext;

function useRefreshRoot() {
  return (0, _react).useContext(RefreshContext);
}

if (typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) {
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

/***/ }),

/***/ 9257:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.getBufferedVitalsMetrics = getBufferedVitalsMetrics;
exports.flushBufferedVitalsMetrics = flushBufferedVitalsMetrics;
exports.trackWebVitalMetric = trackWebVitalMetric;
exports.useWebVitalsReport = useWebVitalsReport;
exports.webVitalsCallbacks = void 0;

var _react = __webpack_require__(2784);

const webVitalsCallbacks = new Set();
exports.webVitalsCallbacks = webVitalsCallbacks;
let flushed = false;
const metrics = [];

function getBufferedVitalsMetrics() {
  return metrics;
}

function flushBufferedVitalsMetrics() {
  flushed = true;
  metrics.length = 0;
}

function trackWebVitalMetric(metric) {
  metrics.push(metric);
  webVitalsCallbacks.forEach(callback => callback(metric));
}

function useWebVitalsReport(callback) {
  const metricIndexRef = (0, _react).useRef(0);

  if (false) {}

  (0, _react).useEffect(() => {
    // Flush calculated metrics
    const reportMetric = metric => {
      callback(metric);
      metricIndexRef.current = metrics.length;
    };

    for (let i = metricIndexRef.current; i < metrics.length; i++) {
      reportMetric(metrics[i]);
    }

    webVitalsCallbacks.add(reportMetric);
    return () => {
      webVitalsCallbacks.delete(reportMetric);
    };
  }, [callback]);
}

if (typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) {
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

/***/ }),

/***/ 1526:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = withRouter;

var _react = _interopRequireDefault(__webpack_require__(2784));

var _router = __webpack_require__(5876);

function withRouter(ComposedComponent) {
  function WithRouterWrapper(props) {
    return /*#__PURE__*/_react.default.createElement(ComposedComponent, Object.assign({
      router: (0, _router).useRouter()
    }, props));
  }

  WithRouterWrapper.getInitialProps = ComposedComponent.getInitialProps;
  WithRouterWrapper.origGetInitialProps = ComposedComponent.origGetInitialProps;

  if (false) {}

  return WithRouterWrapper;
}

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

if (typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) {
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

/***/ }),

/***/ 8493:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.escapeStringRegexp = escapeStringRegexp; // regexp is based on https://github.com/sindresorhus/escape-string-regexp

const reHasRegExp = /[|\\{}()[\]^$+*?.-]/;
const reReplaceRegExp = /[|\\{}()[\]^$+*?.-]/g;

function escapeStringRegexp(str) {
  // see also: https://github.com/lodash/lodash/blob/2da024c3b4f9947a48517639de7560457cd4ec6c/escapeRegExp.js#L23
  if (reHasRegExp.test(str)) {
    return str.replace(reReplaceRegExp, '\\$&');
  }

  return str;
}

/***/ }),

/***/ 5285:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.HeadManagerContext = void 0;

var _react = _interopRequireDefault(__webpack_require__(2784));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

const HeadManagerContext = _react.default.createContext({});

exports.HeadManagerContext = HeadManagerContext;

if (false) {}

/***/ }),

/***/ 776:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.detectDomainLocale = detectDomainLocale;

function detectDomainLocale(domainItems, hostname, detectedLocale) {
  let domainItem;

  if (domainItems) {
    if (detectedLocale) {
      detectedLocale = detectedLocale.toLowerCase();
    }

    for (const item of domainItems) {
      var ref, ref1; // remove port if present

      const domainHostname = (ref = item.domain) === null || ref === void 0 ? void 0 : ref.split(':')[0].toLowerCase();

      if (hostname === domainHostname || detectedLocale === item.defaultLocale.toLowerCase() || ((ref1 = item.locales) === null || ref1 === void 0 ? void 0 : ref1.some(locale => locale.toLowerCase() === detectedLocale))) {
        domainItem = item;
        break;
      }
    }
  }

  return domainItem;
}

/***/ }),

/***/ 716:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.normalizeLocalePath = normalizeLocalePath;

function normalizeLocalePath(pathname, locales) {
  let detectedLocale; // first item will be empty string from splitting at first char

  const pathnameParts = pathname.split('/');
  (locales || []).some(locale => {
    if (pathnameParts[1] && pathnameParts[1].toLowerCase() === locale.toLowerCase()) {
      detectedLocale = locale;
      pathnameParts.splice(1, 1);
      pathname = pathnameParts.join('/') || '/';
      return true;
    }

    return false;
  });
  return {
    pathname,
    detectedLocale
  };
}

/***/ }),

/***/ 4053:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ImageConfigContext = void 0;

var _react = _interopRequireDefault(__webpack_require__(2784));

var _imageConfig = __webpack_require__(5922);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

const ImageConfigContext = _react.default.createContext(_imageConfig.imageConfigDefault);

exports.ImageConfigContext = ImageConfigContext;

if (false) {}

/***/ }),

/***/ 5922:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.imageConfigDefault = exports.VALID_LOADERS = void 0;
const VALID_LOADERS = ['default', 'imgix', 'cloudinary', 'akamai', 'custom'];
exports.VALID_LOADERS = VALID_LOADERS;
const imageConfigDefault = {
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  path: '/_next/image',
  loader: 'default',
  domains: [],
  disableStaticImages: false,
  minimumCacheTTL: 60,
  formats: ['image/webp'],
  dangerouslyAllowSVG: false,
  contentSecurityPolicy: "script-src 'none'; frame-src 'none'; sandbox;"
};
exports.imageConfigDefault = imageConfigDefault;

/***/ }),

/***/ 7810:
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
  if (getObjectClassLabel(value) !== '[object Object]') {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === null || prototype === Object.prototype;
}

/***/ }),

/***/ 8062:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = mitt;

function mitt() {
  const all = Object.create(null);
  return {
    on(type, handler) {
      (all[type] || (all[type] = [])).push(handler);
    },

    off(type, handler) {
      if (all[type]) {
        all[type].splice(all[type].indexOf(handler) >>> 0, 1);
      }
    },

    emit(type, ...evts) {
      (all[type] || []).slice().map(handler => {
        handler(...evts);
      });
    }

  };
}

/***/ }),

/***/ 7258:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.RouterContext = void 0;

var _react = _interopRequireDefault(__webpack_require__(2784));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

const RouterContext = _react.default.createContext(null);

exports.RouterContext = RouterContext;

if (false) {}

/***/ }),

/***/ 7744:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var _defineProperty = __webpack_require__(3782);

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.getDomainLocale = getDomainLocale;
exports.addLocale = addLocale;
exports.delLocale = delLocale;
exports.hasBasePath = hasBasePath;
exports.addBasePath = addBasePath;
exports.delBasePath = delBasePath;
exports.isLocalURL = isLocalURL;
exports.interpolateAs = interpolateAs;
exports.resolveHref = resolveHref;
exports["default"] = void 0;

var _normalizeTrailingSlash = __webpack_require__(5737);

var _routeLoader = __webpack_require__(1722);

var _script = __webpack_require__(3990);

var _isError = _interopRequireWildcard(__webpack_require__(274));

var _denormalizePagePath = __webpack_require__(4863);

var _normalizeLocalePath = __webpack_require__(716);

var _mitt = _interopRequireDefault(__webpack_require__(8062));

var _utils = __webpack_require__(3177);

var _isDynamic = __webpack_require__(1020);

var _parseRelativeUrl = __webpack_require__(3107);

var _querystring = __webpack_require__(4877);

var _resolveRewrites = _interopRequireDefault(__webpack_require__(8459));

var _routeMatcher = __webpack_require__(5693);

var _routeRegex = __webpack_require__(6360);

var _getMiddlewareRegex = __webpack_require__(564);

var _formatUrl = __webpack_require__(4696);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};

    if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {};

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

let detectDomainLocale;

if (true) {
  detectDomainLocale = (__webpack_require__(776).detectDomainLocale);
}

const basePath =  false || '';

function buildCancellationError() {
  return Object.assign(new Error('Route Cancelled'), {
    cancelled: true
  });
}

function addPathPrefix(path, prefix) {
  if (!path.startsWith('/') || !prefix) {
    return path;
  }

  const pathname = pathNoQueryHash(path);
  return (0, _normalizeTrailingSlash).normalizePathTrailingSlash("".concat(prefix).concat(pathname)) + path.slice(pathname.length);
}

function hasPathPrefix(path, prefix) {
  path = pathNoQueryHash(path);
  return path === prefix || path.startsWith(prefix + '/');
}

function getDomainLocale(path, locale, locales, domainLocales) {
  if (true) {
    locale = locale || (0, _normalizeLocalePath).normalizeLocalePath(path, locales).detectedLocale;
    const detectedDomain = detectDomainLocale(domainLocales, undefined, locale);

    if (detectedDomain) {
      return "http".concat(detectedDomain.http ? '' : 's', "://").concat(detectedDomain.domain).concat(basePath || '').concat(locale === detectedDomain.defaultLocale ? '' : "/".concat(locale)).concat(path);
    }

    return false;
  } else {}
}

function addLocale(path, locale, defaultLocale) {
  if (true) {
    if (locale && locale !== defaultLocale) {
      const pathname = pathNoQueryHash(path);
      const pathLower = pathname.toLowerCase();
      const localeLower = locale.toLowerCase();

      if (!hasPathPrefix(pathLower, '/' + localeLower) && !hasPathPrefix(pathLower, '/api')) {
        return addPathPrefix(path, '/' + locale);
      }
    }
  }

  return path;
}

function delLocale(path, locale) {
  if (true) {
    const pathname = pathNoQueryHash(path);
    const pathLower = pathname.toLowerCase();
    const localeLower = locale && locale.toLowerCase();
    return locale && (pathLower.startsWith('/' + localeLower + '/') || pathLower === '/' + localeLower) ? (pathname.length === locale.length + 1 ? '/' : '') + path.slice(locale.length + 1) : path;
  }

  return path;
}

function pathNoQueryHash(path) {
  const queryIndex = path.indexOf('?');
  const hashIndex = path.indexOf('#');

  if (queryIndex > -1 || hashIndex > -1) {
    path = path.substring(0, queryIndex > -1 ? queryIndex : hashIndex);
  }

  return path;
}

function hasBasePath(path) {
  return hasPathPrefix(path, basePath);
}

function addBasePath(path) {
  // we only add the basepath on relative urls
  return addPathPrefix(path, basePath);
}

function delBasePath(path) {
  path = path.slice(basePath.length);
  if (!path.startsWith('/')) path = "/".concat(path);
  return path;
}

function isLocalURL(url) {
  // prevent a hydration mismatch on href for url with anchor refs
  if (url.startsWith('/') || url.startsWith('#') || url.startsWith('?')) return true;

  try {
    // absolute urls can be local if they are on the same origin
    const locationOrigin = (0, _utils).getLocationOrigin();
    const resolved = new URL(url, locationOrigin);
    return resolved.origin === locationOrigin && hasBasePath(resolved.pathname);
  } catch (_) {
    return false;
  }
}

function interpolateAs(route, asPathname, query) {
  let interpolatedRoute = '';
  const dynamicRegex = (0, _routeRegex).getRouteRegex(route);
  const dynamicGroups = dynamicRegex.groups;
  const dynamicMatches = // Try to match the dynamic route against the asPath
  (asPathname !== route ? (0, _routeMatcher).getRouteMatcher(dynamicRegex)(asPathname) : '') || // Fall back to reading the values from the href
  // TODO: should this take priority; also need to change in the router.
  query;
  interpolatedRoute = route;
  const params = Object.keys(dynamicGroups);

  if (!params.every(param => {
    let value = dynamicMatches[param] || '';
    const {
      repeat,
      optional
    } = dynamicGroups[param]; // support single-level catch-all
    // TODO: more robust handling for user-error (passing `/`)

    let replaced = "[".concat(repeat ? '...' : '').concat(param, "]");

    if (optional) {
      replaced = "".concat(!value ? '/' : '', "[").concat(replaced, "]");
    }

    if (repeat && !Array.isArray(value)) value = [value];
    return (optional || param in dynamicMatches) && (interpolatedRoute = interpolatedRoute.replace(replaced, repeat ? value.map( // these values should be fully encoded instead of just
    // path delimiter escaped since they are being inserted
    // into the URL and we expect URL encoded segments
    // when parsing dynamic route params
    segment => encodeURIComponent(segment)).join('/') : encodeURIComponent(value)) || '/');
  })) {
    interpolatedRoute = '' // did not satisfy all requirements
    ; // n.b. We ignore this error because we handle warning for this case in
    // development in the `<Link>` component directly.
  }

  return {
    params,
    result: interpolatedRoute
  };
}

function omitParmsFromQuery(query, params) {
  const filteredQuery = {};
  Object.keys(query).forEach(key => {
    if (!params.includes(key)) {
      filteredQuery[key] = query[key];
    }
  });
  return filteredQuery;
}

function resolveHref(router, href, resolveAs) {
  // we use a dummy base url for relative urls
  let base;
  let urlAsString = typeof href === 'string' ? href : (0, _formatUrl).formatWithValidation(href); // repeated slashes and backslashes in the URL are considered
  // invalid and will never match a Next.js page/file

  const urlProtoMatch = urlAsString.match(/^[a-zA-Z]{1,}:\/\//);
  const urlAsStringNoProto = urlProtoMatch ? urlAsString.slice(urlProtoMatch[0].length) : urlAsString;
  const urlParts = urlAsStringNoProto.split('?');

  if ((urlParts[0] || '').match(/(\/\/|\\)/)) {
    console.error("Invalid href passed to next/router: ".concat(urlAsString, ", repeated forward-slashes (//) or backslashes \\ are not valid in the href"));
    const normalizedUrl = (0, _utils).normalizeRepeatedSlashes(urlAsStringNoProto);
    urlAsString = (urlProtoMatch ? urlProtoMatch[0] : '') + normalizedUrl;
  } // Return because it cannot be routed by the Next.js router


  if (!isLocalURL(urlAsString)) {
    return resolveAs ? [urlAsString] : urlAsString;
  }

  try {
    base = new URL(urlAsString.startsWith('#') ? router.asPath : router.pathname, 'http://n');
  } catch (_) {
    // fallback to / for invalid asPath values e.g. //
    base = new URL('/', 'http://n');
  }

  try {
    const finalUrl = new URL(urlAsString, base);
    finalUrl.pathname = (0, _normalizeTrailingSlash).normalizePathTrailingSlash(finalUrl.pathname);
    let interpolatedAs = '';

    if ((0, _isDynamic).isDynamicRoute(finalUrl.pathname) && finalUrl.searchParams && resolveAs) {
      const query = (0, _querystring).searchParamsToUrlQuery(finalUrl.searchParams);
      const {
        result,
        params
      } = interpolateAs(finalUrl.pathname, finalUrl.pathname, query);

      if (result) {
        interpolatedAs = (0, _formatUrl).formatWithValidation({
          pathname: result,
          hash: finalUrl.hash,
          query: omitParmsFromQuery(query, params)
        });
      }
    } // if the origin didn't change, it means we received a relative href


    const resolvedHref = finalUrl.origin === base.origin ? finalUrl.href.slice(finalUrl.origin.length) : finalUrl.href;
    return resolveAs ? [resolvedHref, interpolatedAs || resolvedHref] : resolvedHref;
  } catch (_1) {
    return resolveAs ? [urlAsString] : urlAsString;
  }
}

function stripOrigin(url) {
  const origin = (0, _utils).getLocationOrigin();
  return url.startsWith(origin) ? url.substring(origin.length) : url;
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
  const preparedUrl = hrefHadOrigin ? resolvedHref : addBasePath(resolvedHref);
  const preparedAs = as ? stripOrigin(resolveHref(router, as)) : resolvedAs || resolvedHref;
  return {
    url: preparedUrl,
    as: asHadOrigin ? preparedAs : addBasePath(preparedAs)
  };
}

function resolveDynamicRoute(pathname, pages) {
  const cleanPathname = (0, _normalizeTrailingSlash).removePathTrailingSlash((0, _denormalizePagePath).denormalizePagePath(pathname));

  if (cleanPathname === '/404' || cleanPathname === '/_error') {
    return pathname;
  } // handle resolving href for dynamic routes


  if (!pages.includes(cleanPathname)) {
    // eslint-disable-next-line array-callback-return
    pages.some(page => {
      if ((0, _isDynamic).isDynamicRoute(page) && (0, _routeRegex).getRouteRegex(page).re.test(cleanPathname)) {
        pathname = page;
        return true;
      }
    });
  }

  return (0, _normalizeTrailingSlash).removePathTrailingSlash(pathname);
}

const manualScrollRestoration = (/* unused pure expression or super */ null && ( false && 0));
const SSG_DATA_NOT_FOUND = Symbol('SSG_DATA_NOT_FOUND');

function fetchRetry(url, attempts, opts) {
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
    credentials: 'same-origin'
  }).then(res => {
    if (!res.ok) {
      if (attempts > 1 && res.status >= 500) {
        return fetchRetry(url, attempts - 1, opts);
      }

      if (res.status === 404) {
        return res.json().then(data => {
          if (data.notFound) {
            return {
              notFound: SSG_DATA_NOT_FOUND
            };
          }

          throw new Error("Failed to load static props");
        });
      }

      throw new Error("Failed to load static props");
    }

    return opts.text ? res.text() : res.json();
  });
}

function fetchNextData(dataHref, isServerRender, text, inflightCache, persistCache) {
  const {
    href: cacheKey
  } = new URL(dataHref, window.location.href);

  if (inflightCache[cacheKey] !== undefined) {
    return inflightCache[cacheKey];
  }

  return inflightCache[cacheKey] = fetchRetry(dataHref, isServerRender ? 3 : 1, {
    text
  }).catch(err => {
    // We should only trigger a server-side transition if this was caused
    // on a client-side transition. Otherwise, we'd get into an infinite
    // loop.
    if (!isServerRender) {
      (0, _routeLoader).markAssetError(err);
    }

    throw err;
  }).then(data => {
    if (!persistCache || false) {
      delete inflightCache[cacheKey];
    }

    return data;
  }).catch(err => {
    delete inflightCache[cacheKey];
    throw err;
  });
}

class Router {
  constructor(pathname1, query1, as1, {
    initialProps,
    pageLoader,
    App,
    wrapApp,
    Component,
    err,
    subscription,
    isFallback,
    locale,
    locales,
    defaultLocale,
    domainLocales,
    isPreview,
    isRsc
  }) {
    // Static Data Cache
    this.sdc = {}; // In-flight Server Data Requests, for deduping

    this.sdr = {}; // In-flight middleware preflight requests

    this.sde = {};
    this._idx = 0;

    this.onPopState = e => {
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
        const {
          pathname,
          query
        } = this;
        this.changeState('replaceState', (0, _formatUrl).formatWithValidation({
          pathname: addBasePath(pathname),
          query
        }), (0, _utils).getURL());
        return;
      }

      if (!state.__N) {
        return;
      }

      let forcedScroll;
      const {
        url,
        as,
        options,
        idx
      } = state;

      if (false) {}

      this._idx = idx;
      const {
        pathname
      } = (0, _parseRelativeUrl).parseRelativeUrl(url); // Make sure we don't re-render on initial load,
      // can be caused by navigating back from an external site

      if (this.isSsr && as === addBasePath(this.asPath) && pathname === addBasePath(this.pathname)) {
        return;
      } // If the downstream application returns falsy, return.
      // They will then be responsible for handling the event.


      if (this._bps && !this._bps(state)) {
        return;
      }

      this.change('replaceState', url, as, Object.assign({}, options, {
        shallow: options.shallow && this._shallow,
        locale: options.locale || this.defaultLocale
      }), forcedScroll);
    }; // represents the current component key


    const route = (0, _normalizeTrailingSlash).removePathTrailingSlash(pathname1); // set up the component cache (by route keys)

    this.components = {}; // We should not keep the cache, if there's an error
    // Otherwise, this cause issues when when going back and
    // come again to the errored page.

    if (pathname1 !== '/_error') {
      this.components[route] = {
        Component,
        initial: true,
        props: initialProps,
        err,
        __N_SSG: initialProps && initialProps.__N_SSG,
        __N_SSP: initialProps && initialProps.__N_SSP,
        __N_RSC: !!isRsc
      };
    }

    this.components['/_app'] = {
      Component: App,
      styleSheets: []
    }; // Backwards compat for Router.router.events
    // TODO: Should be remove the following major version as it was never documented

    this.events = Router.events;
    this.pageLoader = pageLoader; // if auto prerendered and dynamic route wait to update asPath
    // until after mount to prevent hydration mismatch

    const autoExportDynamic = (0, _isDynamic).isDynamicRoute(pathname1) && self.__NEXT_DATA__.autoExport;

    this.basePath = basePath;
    this.sub = subscription;
    this.clc = null;
    this._wrapApp = wrapApp; // make sure to ignore extra popState in safari on navigating
    // back from external site

    this.isSsr = true;
    this.isLocaleDomain = false;
    this.isReady = !!(self.__NEXT_DATA__.gssp || self.__NEXT_DATA__.gip || self.__NEXT_DATA__.appGip && !self.__NEXT_DATA__.gsp || !autoExportDynamic && !self.location.search && !true);

    if (true) {
      this.locales = locales;
      this.defaultLocale = defaultLocale;
      this.domainLocales = domainLocales;
      this.isLocaleDomain = !!detectDomainLocale(domainLocales, self.location.hostname);
    }

    this.state = {
      route,
      pathname: pathname1,
      query: query1,
      asPath: autoExportDynamic ? pathname1 : as1,
      isPreview: !!isPreview,
      locale:  true ? locale : 0,
      isFallback
    };

    if (true) {
      // make sure "as" doesn't start with double slashes or else it can
      // throw an error as it's considered invalid
      if (!as1.startsWith('//')) {
        // in order for `e.state` to work on the `onpopstate` event
        // we have to register the initial route upon initialization
        const options = {
          locale
        };
        options._shouldResolveHref = as1 !== pathname1;
        this.changeState('replaceState', (0, _formatUrl).formatWithValidation({
          pathname: addBasePath(pathname1),
          query: query1
        }), (0, _utils).getURL(), options);
      }

      window.addEventListener('popstate', this.onPopState); // enable custom scroll restoration handling when available
      // otherwise fallback to browser's default handling

      if (false) {}
    }
  }

  reload() {
    window.location.reload();
  }
  /**
  * Go back in history
  */


  back() {
    window.history.back();
  }
  /**
  * Performs a `pushState` with arguments
  * @param url of the route
  * @param as masks `url` for the browser
  * @param options object you can define `shallow` and other options
  */


  push(url, as, options = {}) {
    if (false) {}

    ({
      url,
      as
    } = prepareUrlAs(this, url, as));
    return this.change('pushState', url, as, options);
  }
  /**
  * Performs a `replaceState` with arguments
  * @param url of the route
  * @param as masks `url` for the browser
  * @param options object you can define `shallow` and other options
  */


  replace(url, as, options = {}) {
    ({
      url,
      as
    } = prepareUrlAs(this, url, as));
    return this.change('replaceState', url, as, options);
  }

  async change(method, url, as, options, forcedScroll) {
    if (!isLocalURL(url)) {
      window.location.href = url;
      return false;
    }

    const shouldResolveHref = options._h || options._shouldResolveHref || pathNoQueryHash(url) === pathNoQueryHash(as);

    const nextState = _objectSpread({}, this.state); // for static pages with query params in the URL we delay
    // marking the router ready until after the query is updated


    if (options._h) {
      this.isReady = true;
    }

    const prevLocale = nextState.locale;

    if (true) {
      nextState.locale = options.locale === false ? this.defaultLocale : options.locale || nextState.locale;

      if (typeof options.locale === 'undefined') {
        options.locale = nextState.locale;
      }

      const parsedAs = (0, _parseRelativeUrl).parseRelativeUrl(hasBasePath(as) ? delBasePath(as) : as);
      const localePathResult = (0, _normalizeLocalePath).normalizeLocalePath(parsedAs.pathname, this.locales);

      if (localePathResult.detectedLocale) {
        nextState.locale = localePathResult.detectedLocale;
        parsedAs.pathname = addBasePath(parsedAs.pathname);
        as = (0, _formatUrl).formatWithValidation(parsedAs);
        url = addBasePath((0, _normalizeLocalePath).normalizeLocalePath(hasBasePath(url) ? delBasePath(url) : url, this.locales).pathname);
      }

      let didNavigate = false; // we need to wrap this in the env check again since regenerator runtime
      // moves this on its own due to the return

      if (true) {
        var ref; // if the locale isn't configured hard navigate to show 404 page

        if (!((ref = this.locales) === null || ref === void 0 ? void 0 : ref.includes(nextState.locale))) {
          parsedAs.pathname = addLocale(parsedAs.pathname, nextState.locale);
          window.location.href = (0, _formatUrl).formatWithValidation(parsedAs); // this was previously a return but was removed in favor
          // of better dead code elimination with regenerator runtime

          didNavigate = true;
        }
      }

      const detectedDomain = detectDomainLocale(this.domainLocales, undefined, nextState.locale); // we need to wrap this in the env check again since regenerator runtime
      // moves this on its own due to the return

      if (true) {
        // if we are navigating to a domain locale ensure we redirect to the
        // correct domain
        if (!didNavigate && detectedDomain && this.isLocaleDomain && self.location.hostname !== detectedDomain.domain) {
          const asNoBasePath = delBasePath(as);
          window.location.href = "http".concat(detectedDomain.http ? '' : 's', "://").concat(detectedDomain.domain).concat(addBasePath("".concat(nextState.locale === detectedDomain.defaultLocale ? '' : "/".concat(nextState.locale)).concat(asNoBasePath === '/' ? '' : asNoBasePath) || '/')); // this was previously a return but was removed in favor
          // of better dead code elimination with regenerator runtime

          didNavigate = true;
        }
      }

      if (didNavigate) {
        return new Promise(() => {});
      }
    }

    if (!options._h) {
      this.isSsr = false;
    } // marking route changes as a navigation start entry


    if (_utils.ST) {
      performance.mark('routeChange');
    }

    const {
      shallow = false,
      scroll = true
    } = options;
    const routeProps = {
      shallow
    };

    if (this._inFlightRoute) {
      this.abortComponentLoad(this._inFlightRoute, routeProps);
    }

    as = addBasePath(addLocale(hasBasePath(as) ? delBasePath(as) : as, options.locale, this.defaultLocale));
    const cleanedAs = delLocale(hasBasePath(as) ? delBasePath(as) : as, nextState.locale);
    this._inFlightRoute = as;
    let localeChange = prevLocale !== nextState.locale; // If the url change is only related to a hash change
    // We should not proceed. We should only change the state.
    // WARNING: `_h` is an internal option for handing Next.js client-side
    // hydration. Your app should _never_ use this property. It may change at
    // any time without notice.

    if (!options._h && this.onlyAHashChange(cleanedAs) && !localeChange) {
      nextState.asPath = cleanedAs;
      Router.events.emit('hashChangeStart', as, routeProps); // TODO: do we need the resolved href when only a hash change?

      this.changeState(method, url, as, _objectSpread(_objectSpread({}, options), {}, {
        scroll: false
      }));

      if (scroll) {
        this.scrollToHash(cleanedAs);
      }

      this.set(nextState, this.components[nextState.route], null);
      Router.events.emit('hashChangeComplete', as, routeProps);
      return true;
    }

    let parsed = (0, _parseRelativeUrl).parseRelativeUrl(url);
    let {
      pathname,
      query
    } = parsed; // The build manifest needs to be loaded before auto-static dynamic pages
    // get their query parameters to allow ensuring they can be parsed properly
    // when rewritten to

    let pages, rewrites;

    try {
      [pages, {
        __rewrites: rewrites
      }] = await Promise.all([this.pageLoader.getPageList(), (0, _routeLoader).getClientBuildManifest(), this.pageLoader.getMiddlewareList()]);
    } catch (err) {
      // If we fail to resolve the page list or client-build manifest, we must
      // do a server-side transition:
      window.location.href = as;
      return false;
    } // If asked to change the current URL we should reload the current page
    // (not location.reload() but reload getInitialProps and other Next.js stuffs)
    // We also need to set the method = replaceState always
    // as this should not go into the history (That's how browsers work)
    // We should compare the new asPath to the current asPath, not the url


    if (!this.urlIsNew(cleanedAs) && !localeChange) {
      method = 'replaceState';
    } // we need to resolve the as value using rewrites for dynamic SSG
    // pages to allow building the data URL correctly


    let resolvedAs = as; // url and as should always be prefixed with basePath by this
    // point by either next/link or router.push/replace so strip the
    // basePath from the pathname to match the pages dir 1-to-1

    pathname = pathname ? (0, _normalizeTrailingSlash).removePathTrailingSlash(delBasePath(pathname)) : pathname;

    if (shouldResolveHref && pathname !== '/_error') {
      options._shouldResolveHref = true;

      if ( true && as.startsWith('/')) {
        const rewritesResult = (0, _resolveRewrites).default(addBasePath(addLocale(cleanedAs, nextState.locale)), pages, rewrites, query, p => resolveDynamicRoute(p, pages), this.locales);

        if (rewritesResult.externalDest) {
          location.href = as;
          return true;
        }

        resolvedAs = rewritesResult.asPath;

        if (rewritesResult.matchedPage && rewritesResult.resolvedHref) {
          // if this directly matches a page we need to update the href to
          // allow the correct page chunk to be loaded
          pathname = rewritesResult.resolvedHref;
          parsed.pathname = addBasePath(pathname);
          url = (0, _formatUrl).formatWithValidation(parsed);
        }
      } else {
        parsed.pathname = resolveDynamicRoute(pathname, pages);

        if (parsed.pathname !== pathname) {
          pathname = parsed.pathname;
          parsed.pathname = addBasePath(pathname);
          url = (0, _formatUrl).formatWithValidation(parsed);
        }
      }
    }

    if (!isLocalURL(as)) {
      if (false) {}

      window.location.href = as;
      return false;
    }

    resolvedAs = delLocale(delBasePath(resolvedAs), nextState.locale);
    /**
    * If the route update was triggered for client-side hydration and
    * the rendered route is not dynamic do not check the preflight
    * request as it is not necessary.
    */

    if ((!options.shallow || options._h === 1) && (options._h !== 1 || (0, _isDynamic).isDynamicRoute((0, _normalizeTrailingSlash).removePathTrailingSlash(pathname)))) {
      const effect = await this._preflightRequest({
        as,
        cache: true,
        pages,
        pathname,
        query,
        locale: nextState.locale,
        isPreview: nextState.isPreview
      });

      if (effect.type === 'rewrite') {
        query = _objectSpread(_objectSpread({}, query), effect.parsedAs.query);
        resolvedAs = effect.asPath;
        pathname = effect.resolvedHref;
        parsed.pathname = effect.resolvedHref;
        url = (0, _formatUrl).formatWithValidation(parsed);
      } else if (effect.type === 'redirect' && effect.newAs) {
        return this.change(method, effect.newUrl, effect.newAs, options);
      } else if (effect.type === 'redirect' && effect.destination) {
        window.location.href = effect.destination;
        return new Promise(() => {});
      } else if (effect.type === 'refresh' && as !== window.location.pathname) {
        window.location.href = as;
        return new Promise(() => {});
      }
    }

    const route = (0, _normalizeTrailingSlash).removePathTrailingSlash(pathname);

    if ((0, _isDynamic).isDynamicRoute(route)) {
      const parsedAs = (0, _parseRelativeUrl).parseRelativeUrl(resolvedAs);
      const asPathname = parsedAs.pathname;
      const routeRegex = (0, _routeRegex).getRouteRegex(route);
      const routeMatch = (0, _routeMatcher).getRouteMatcher(routeRegex)(asPathname);
      const shouldInterpolate = route === asPathname;
      const interpolatedAs = shouldInterpolate ? interpolateAs(route, asPathname, query) : {};

      if (!routeMatch || shouldInterpolate && !interpolatedAs.result) {
        const missingParams = Object.keys(routeRegex.groups).filter(param => !query[param]);

        if (missingParams.length > 0) {
          if (false) {}

          throw new Error((shouldInterpolate ? "The provided `href` (".concat(url, ") value is missing query values (").concat(missingParams.join(', '), ") to be interpolated properly. ") : "The provided `as` value (".concat(asPathname, ") is incompatible with the `href` value (").concat(route, "). ")) + "Read more: https://nextjs.org/docs/messages/".concat(shouldInterpolate ? 'href-interpolation-failed' : 'incompatible-href-as'));
        }
      } else if (shouldInterpolate) {
        as = (0, _formatUrl).formatWithValidation(Object.assign({}, parsedAs, {
          pathname: interpolatedAs.result,
          query: omitParmsFromQuery(query, interpolatedAs.params)
        }));
      } else {
        // Merge params into `query`, overwriting any specified in search
        Object.assign(query, routeMatch);
      }
    }

    Router.events.emit('routeChangeStart', as, routeProps);

    try {
      var ref1, ref2;
      let routeInfo = await this.getRouteInfo(route, pathname, query, as, resolvedAs, routeProps, nextState.locale, nextState.isPreview);
      let {
        error,
        props,
        __N_SSG,
        __N_SSP
      } = routeInfo;
      const component = routeInfo.Component;

      if (component && component.unstable_scriptLoader) {
        const scripts = [].concat(component.unstable_scriptLoader());
        scripts.forEach(script => {
          (0, _script).handleClientScriptLoad(script.props);
        });
      } // handle redirect on client-transition


      if ((__N_SSG || __N_SSP) && props) {
        if (props.pageProps && props.pageProps.__N_REDIRECT) {
          const destination = props.pageProps.__N_REDIRECT; // check if destination is internal (resolves to a page) and attempt
          // client-navigation if it is falling back to hard navigation if
          // it's not

          if (destination.startsWith('/') && props.pageProps.__N_REDIRECT_BASE_PATH !== false) {
            const parsedHref = (0, _parseRelativeUrl).parseRelativeUrl(destination);
            parsedHref.pathname = resolveDynamicRoute(parsedHref.pathname, pages);
            const {
              url: newUrl,
              as: newAs
            } = prepareUrlAs(this, destination, destination);
            return this.change(method, newUrl, newAs, options);
          }

          window.location.href = destination;
          return new Promise(() => {});
        }

        nextState.isPreview = !!props.__N_PREVIEW; // handle SSG data 404

        if (props.notFound === SSG_DATA_NOT_FOUND) {
          let notFoundRoute;

          try {
            await this.fetchComponent('/404');
            notFoundRoute = '/404';
          } catch (_) {
            notFoundRoute = '/_error';
          }

          routeInfo = await this.getRouteInfo(notFoundRoute, notFoundRoute, query, as, resolvedAs, {
            shallow: false
          }, nextState.locale, nextState.isPreview);
        }
      }

      Router.events.emit('beforeHistoryChange', as, routeProps);
      this.changeState(method, url, as, options);

      if (options._h && pathname === '/_error' && ((ref1 = self.__NEXT_DATA__.props) === null || ref1 === void 0 ? void 0 : (ref2 = ref1.pageProps) === null || ref2 === void 0 ? void 0 : ref2.statusCode) === 500 && (props === null || props === void 0 ? void 0 : props.pageProps)) {
        // ensure statusCode is still correct for static 500 page
        // when updating query information
        props.pageProps.statusCode = 500;
      } // shallow routing is only allowed for same page URL changes.


      const isValidShallowRoute = options.shallow && nextState.route === route;

      var _scroll;

      const shouldScroll = (_scroll = options.scroll) !== null && _scroll !== void 0 ? _scroll : !isValidShallowRoute;
      const resetScroll = shouldScroll ? {
        x: 0,
        y: 0
      } : null;
      await this.set(_objectSpread(_objectSpread({}, nextState), {}, {
        route,
        pathname,
        query,
        asPath: cleanedAs,
        isFallback: false
      }), routeInfo, forcedScroll !== null && forcedScroll !== void 0 ? forcedScroll : resetScroll).catch(e => {
        if (e.cancelled) error = error || e;else throw e;
      });

      if (error) {
        Router.events.emit('routeChangeError', error, cleanedAs, routeProps);
        throw error;
      }

      if (true) {
        if (nextState.locale) {
          document.documentElement.lang = nextState.locale;
        }
      }

      Router.events.emit('routeChangeComplete', as, routeProps);
      return true;
    } catch (err1) {
      if ((0, _isError).default(err1) && err1.cancelled) {
        return false;
      }

      throw err1;
    }
  }

  changeState(method, url, as, options = {}) {
    if (false) {}

    if (method !== 'pushState' || (0, _utils).getURL() !== as) {
      this._shallow = options.shallow;
      window.history[method]({
        url,
        as,
        options,
        __N: true,
        idx: this._idx = method !== 'pushState' ? this._idx : this._idx + 1
      }, // Most browsers currently ignores this parameter, although they may use it in the future.
      // Passing the empty string here should be safe against future changes to the method.
      // https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState
      '', as);
    }
  }

  async handleRouteInfoError(err, pathname, query, as, routeProps, loadErrorFail) {
    if (err.cancelled) {
      // bubble up cancellation errors
      throw err;
    }

    if ((0, _routeLoader).isAssetError(err) || loadErrorFail) {
      Router.events.emit('routeChangeError', err, as, routeProps); // If we can't load the page it could be one of following reasons
      //  1. Page doesn't exists
      //  2. Page does exist in a different zone
      //  3. Internal error while loading the page
      // So, doing a hard reload is the proper way to deal with this.

      window.location.href = as; // Changing the URL doesn't block executing the current code path.
      // So let's throw a cancellation error stop the routing logic.

      throw buildCancellationError();
    }

    try {
      let Component;
      let styleSheets;
      let props;

      if (typeof Component === 'undefined' || typeof styleSheets === 'undefined') {
        ({
          page: Component,
          styleSheets
        } = await this.fetchComponent('/_error'));
      }

      const routeInfo = {
        props,
        Component,
        styleSheets,
        err,
        error: err
      };

      if (!routeInfo.props) {
        try {
          routeInfo.props = await this.getInitialProps(Component, {
            err,
            pathname,
            query
          });
        } catch (gipErr) {
          console.error('Error in error page `getInitialProps`: ', gipErr);
          routeInfo.props = {};
        }
      }

      return routeInfo;
    } catch (routeInfoErr) {
      return this.handleRouteInfoError((0, _isError).default(routeInfoErr) ? routeInfoErr : new Error(routeInfoErr + ''), pathname, query, as, routeProps, true);
    }
  }

  async getRouteInfo(route, pathname, query, as, resolvedAs, routeProps, locale, isPreview) {
    try {
      const existingRouteInfo = this.components[route];

      if (routeProps.shallow && existingRouteInfo && this.route === route) {
        return existingRouteInfo;
      }

      let cachedRouteInfo = undefined; // can only use non-initial route info
      // cannot reuse route info in development since it can change after HMR

      if ( true && existingRouteInfo && !('initial' in existingRouteInfo)) {
        cachedRouteInfo = existingRouteInfo;
      }

      const routeInfo = cachedRouteInfo || (await this.fetchComponent(route).then(res => ({
        Component: res.page,
        styleSheets: res.styleSheets,
        __N_SSG: res.mod.__N_SSG,
        __N_SSP: res.mod.__N_SSP,
        __N_RSC: !!res.mod.__next_rsc__
      })));
      const {
        Component,
        __N_SSG,
        __N_SSP,
        __N_RSC
      } = routeInfo;

      if (false) {}

      let dataHref; // For server components, non-SSR pages will have statically optimized
      // flight data in a production build.
      // So only development and SSR pages will always have the real-time
      // generated and streamed flight data.

      const useStreamedFlightData = ( false || __N_SSP) && __N_RSC;

      if (__N_SSG || __N_SSP || __N_RSC) {
        dataHref = this.pageLoader.getDataHref({
          href: (0, _formatUrl).formatWithValidation({
            pathname,
            query
          }),
          asPath: resolvedAs,
          ssg: __N_SSG,
          flight: useStreamedFlightData,
          locale
        });
      }

      const props = await this._getData(() => (__N_SSG || __N_SSP || __N_RSC) && !useStreamedFlightData ? fetchNextData(dataHref, this.isSsr, false, __N_SSG ? this.sdc : this.sdr, !!__N_SSG && !isPreview) : this.getInitialProps(Component, // we provide AppTree later so this needs to be `any`
      {
        pathname,
        query,
        asPath: as,
        locale,
        locales: this.locales,
        defaultLocale: this.defaultLocale
      }));

      if (__N_RSC) {
        if (useStreamedFlightData) {
          const {
            data
          } = await this._getData(() => this._getFlightData(dataHref));
          props.pageProps = Object.assign(props.pageProps, {
            __flight__: data
          });
        } else {
          const {
            __flight__
          } = props;
          props.pageProps = Object.assign({}, props.pageProps, {
            __flight__
          });
        }
      }

      routeInfo.props = props;
      this.components[route] = routeInfo;
      return routeInfo;
    } catch (err) {
      return this.handleRouteInfoError((0, _isError).getProperError(err), pathname, query, as, routeProps);
    }
  }

  set(state, data, resetScroll) {
    this.state = state;
    return this.sub(data, this.components['/_app'].Component, resetScroll);
  }
  /**
  * Callback to execute before replacing router state
  * @param cb callback to be executed
  */


  beforePopState(cb) {
    this._bps = cb;
  }

  onlyAHashChange(as) {
    if (!this.asPath) return false;
    const [oldUrlNoHash, oldHash] = this.asPath.split('#');
    const [newUrlNoHash, newHash] = as.split('#'); // Makes sure we scroll to the provided hash if the url/hash are the same

    if (newHash && oldUrlNoHash === newUrlNoHash && oldHash === newHash) {
      return true;
    } // If the urls are change, there's more than a hash change


    if (oldUrlNoHash !== newUrlNoHash) {
      return false;
    } // If the hash has changed, then it's a hash only change.
    // This check is necessary to handle both the enter and
    // leave hash === '' cases. The identity case falls through
    // and is treated as a next reload.


    return oldHash !== newHash;
  }

  scrollToHash(as) {
    const [, hash = ''] = as.split('#'); // Scroll to top if the hash is just `#` with no value or `#top`
    // To mirror browsers

    if (hash === '' || hash === 'top') {
      window.scrollTo(0, 0);
      return;
    } // First we check if the element by id is found


    const idEl = document.getElementById(hash);

    if (idEl) {
      idEl.scrollIntoView();
      return;
    } // If there's no element with the id, we check the `name` property
    // To mirror browsers


    const nameEl = document.getElementsByName(hash)[0];

    if (nameEl) {
      nameEl.scrollIntoView();
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
  */


  async prefetch(url, asPath = url, options = {}) {
    let parsed = (0, _parseRelativeUrl).parseRelativeUrl(url);
    let {
      pathname,
      query
    } = parsed;

    if (true) {
      if (options.locale === false) {
        pathname = (0, _normalizeLocalePath).normalizeLocalePath(pathname, this.locales).pathname;
        parsed.pathname = pathname;
        url = (0, _formatUrl).formatWithValidation(parsed);
        let parsedAs = (0, _parseRelativeUrl).parseRelativeUrl(asPath);
        const localePathResult = (0, _normalizeLocalePath).normalizeLocalePath(parsedAs.pathname, this.locales);
        parsedAs.pathname = localePathResult.pathname;
        options.locale = localePathResult.detectedLocale || this.defaultLocale;
        asPath = (0, _formatUrl).formatWithValidation(parsedAs);
      }
    }

    const pages = await this.pageLoader.getPageList();
    let resolvedAs = asPath;

    if ( true && asPath.startsWith('/')) {
      let rewrites;
      ({
        __rewrites: rewrites
      } = await (0, _routeLoader).getClientBuildManifest());
      const rewritesResult = (0, _resolveRewrites).default(addBasePath(addLocale(asPath, this.locale)), pages, rewrites, parsed.query, p => resolveDynamicRoute(p, pages), this.locales);

      if (rewritesResult.externalDest) {
        return;
      }

      resolvedAs = delLocale(delBasePath(rewritesResult.asPath), this.locale);

      if (rewritesResult.matchedPage && rewritesResult.resolvedHref) {
        // if this directly matches a page we need to update the href to
        // allow the correct page chunk to be loaded
        pathname = rewritesResult.resolvedHref;
        parsed.pathname = pathname;
        url = (0, _formatUrl).formatWithValidation(parsed);
      }
    } else {
      parsed.pathname = resolveDynamicRoute(parsed.pathname, pages);

      if (parsed.pathname !== pathname) {
        pathname = parsed.pathname;
        parsed.pathname = pathname;
        url = (0, _formatUrl).formatWithValidation(parsed);
      }
    } // Prefetch is not supported in development mode because it would trigger on-demand-entries


    if (false) {}

    const effects = await this._preflightRequest({
      as: addBasePath(asPath),
      cache: true,
      pages,
      pathname,
      query,
      locale: this.locale,
      isPreview: this.isPreview
    });

    if (effects.type === 'rewrite') {
      parsed.pathname = effects.resolvedHref;
      pathname = effects.resolvedHref;
      query = _objectSpread(_objectSpread({}, query), effects.parsedAs.query);
      resolvedAs = effects.asPath;
      url = (0, _formatUrl).formatWithValidation(parsed);
    }

    const route = (0, _normalizeTrailingSlash).removePathTrailingSlash(pathname);
    await Promise.all([this.pageLoader._isSsg(route).then(isSsg => {
      return isSsg ? fetchNextData(this.pageLoader.getDataHref({
        href: url,
        asPath: resolvedAs,
        ssg: true,
        locale: typeof options.locale !== 'undefined' ? options.locale : this.locale
      }), false, false, this.sdc, true) : false;
    }), this.pageLoader[options.priority ? 'loadPage' : 'prefetch'](route)]);
  }

  async fetchComponent(route) {
    let cancelled = false;

    const cancel = this.clc = () => {
      cancelled = true;
    };

    const handleCancelled = () => {
      if (cancelled) {
        const error = new Error("Abort fetching component for route: \"".concat(route, "\""));
        error.cancelled = true;
        throw error;
      }

      if (cancel === this.clc) {
        this.clc = null;
      }
    };

    try {
      const componentResult = await this.pageLoader.loadPage(route);
      handleCancelled();
      return componentResult;
    } catch (err) {
      handleCancelled();
      throw err;
    }
  }

  _getData(fn) {
    let cancelled = false;

    const cancel = () => {
      cancelled = true;
    };

    this.clc = cancel;
    return fn().then(data => {
      if (cancel === this.clc) {
        this.clc = null;
      }

      if (cancelled) {
        const err = new Error('Loading initial props cancelled');
        err.cancelled = true;
        throw err;
      }

      return data;
    });
  }

  _getFlightData(dataHref) {
    // Do not cache RSC flight response since it's not a static resource
    return fetchNextData(dataHref, true, true, this.sdc, false).then(serialized => {
      return {
        data: serialized
      };
    });
  }

  async _preflightRequest(options) {
    const asPathname = pathNoQueryHash(options.as);
    const cleanedAs = delLocale(hasBasePath(asPathname) ? delBasePath(asPathname) : asPathname, options.locale);
    const fns = await this.pageLoader.getMiddlewareList();
    const requiresPreflight = fns.some(([middleware, isSSR]) => {
      return (0, _routeMatcher).getRouteMatcher((0, _getMiddlewareRegex).getMiddlewareRegex(middleware, !isSSR))(cleanedAs);
    });

    if (!requiresPreflight) {
      return {
        type: 'next'
      };
    }

    const preflightHref = addLocale(options.as, options.locale);
    let preflight;

    try {
      preflight = await this._getPreflightData({
        preflightHref,
        shouldCache: options.cache,
        isPreview: options.isPreview
      });
    } catch (err) {
      // If preflight request fails, we need to do a hard-navigation.
      return {
        type: 'redirect',
        destination: options.as
      };
    }

    if (preflight.rewrite) {
      // for external rewrites we need to do a hard navigation
      // to the resource
      if (!preflight.rewrite.startsWith('/')) {
        return {
          type: 'redirect',
          destination: options.as
        };
      }

      const parsed = (0, _parseRelativeUrl).parseRelativeUrl((0, _normalizeLocalePath).normalizeLocalePath(hasBasePath(preflight.rewrite) ? delBasePath(preflight.rewrite) : preflight.rewrite, this.locales).pathname);
      const fsPathname = (0, _normalizeTrailingSlash).removePathTrailingSlash(parsed.pathname);
      let matchedPage;
      let resolvedHref;

      if (options.pages.includes(fsPathname)) {
        matchedPage = true;
        resolvedHref = fsPathname;
      } else {
        resolvedHref = resolveDynamicRoute(fsPathname, options.pages);

        if (resolvedHref !== parsed.pathname && options.pages.includes(resolvedHref)) {
          matchedPage = true;
        }
      }

      return {
        type: 'rewrite',
        asPath: parsed.pathname,
        parsedAs: parsed,
        matchedPage,
        resolvedHref
      };
    }

    if (preflight.redirect) {
      if (preflight.redirect.startsWith('/')) {
        const cleanRedirect = (0, _normalizeTrailingSlash).removePathTrailingSlash((0, _normalizeLocalePath).normalizeLocalePath(hasBasePath(preflight.redirect) ? delBasePath(preflight.redirect) : preflight.redirect, this.locales).pathname);
        const {
          url: newUrl,
          as: newAs
        } = prepareUrlAs(this, cleanRedirect, cleanRedirect);
        return {
          type: 'redirect',
          newUrl,
          newAs
        };
      }

      return {
        type: 'redirect',
        destination: preflight.redirect
      };
    } // For SSR requests, they will be handled like normal pages.


    if (preflight.refresh && !preflight.ssr) {
      return {
        type: 'refresh'
      };
    }

    return {
      type: 'next'
    };
  }

  _getPreflightData(params) {
    const {
      preflightHref,
      shouldCache = false,
      isPreview
    } = params;
    const {
      href: cacheKey
    } = new URL(preflightHref, window.location.href);

    if ( true && !isPreview && shouldCache && this.sde[cacheKey]) {
      return Promise.resolve(this.sde[cacheKey]);
    }

    return fetch(preflightHref, {
      method: 'HEAD',
      credentials: 'same-origin',
      headers: {
        'x-middleware-preflight': '1'
      }
    }).then(res => {
      if (!res.ok) {
        throw new Error("Failed to preflight request");
      }

      return {
        cache: res.headers.get('x-middleware-cache'),
        redirect: res.headers.get('Location'),
        refresh: res.headers.has('x-middleware-refresh'),
        rewrite: res.headers.get('x-middleware-rewrite'),
        ssr: !!res.headers.get('x-middleware-ssr')
      };
    }).then(data => {
      if (shouldCache && data.cache !== 'no-cache') {
        this.sde[cacheKey] = data;
      }

      return data;
    }).catch(err => {
      delete this.sde[cacheKey];
      throw err;
    });
  }

  getInitialProps(Component, ctx) {
    const {
      Component: App
    } = this.components['/_app'];

    const AppTree = this._wrapApp(App);

    ctx.AppTree = AppTree;
    return (0, _utils).loadGetInitialProps(App, {
      AppTree,
      Component,
      router: this,
      ctx
    });
  }

  abortComponentLoad(as, routeProps) {
    if (this.clc) {
      Router.events.emit('routeChangeError', buildCancellationError(), as, routeProps);
      this.clc();
      this.clc = null;
    }
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

}

exports["default"] = Router;
Router.events = (0, _mitt).default();

/***/ }),

/***/ 4696:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.formatUrl = formatUrl;
exports.formatWithValidation = formatWithValidation;
exports.urlObjectKeys = void 0;

var querystring = _interopRequireWildcard(__webpack_require__(4877));

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};

    if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {};

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

const slashedProtocols = /https?|ftp|gopher|file/;

function formatUrl(urlObj) {
  let {
    auth,
    hostname
  } = urlObj;
  let protocol = urlObj.protocol || '';
  let pathname = urlObj.pathname || '';
  let hash = urlObj.hash || '';
  let query = urlObj.query || '';
  let host = false;
  auth = auth ? encodeURIComponent(auth).replace(/%3A/i, ':') + '@' : '';

  if (urlObj.host) {
    host = auth + urlObj.host;
  } else if (hostname) {
    host = auth + (~hostname.indexOf(':') ? "[".concat(hostname, "]") : hostname);

    if (urlObj.port) {
      host += ':' + urlObj.port;
    }
  }

  if (query && typeof query === 'object') {
    query = String(querystring.urlQueryToSearchParams(query));
  }

  let search = urlObj.search || query && "?".concat(query) || '';
  if (protocol && !protocol.endsWith(':')) protocol += ':';

  if (urlObj.slashes || (!protocol || slashedProtocols.test(protocol)) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname[0] !== '/') pathname = '/' + pathname;
  } else if (!host) {
    host = '';
  }

  if (hash && hash[0] !== '#') hash = '#' + hash;
  if (search && search[0] !== '?') search = '?' + search;
  pathname = pathname.replace(/[?#]/g, encodeURIComponent);
  search = search.replace('#', '%23');
  return "".concat(protocol).concat(host).concat(pathname).concat(search).concat(hash);
}

const urlObjectKeys = ['auth', 'hash', 'host', 'hostname', 'href', 'path', 'pathname', 'port', 'protocol', 'query', 'search', 'slashes'];
exports.urlObjectKeys = urlObjectKeys;

function formatWithValidation(url) {
  if (false) {}

  return formatUrl(url);
}

/***/ }),

/***/ 3466:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = getAssetPathFromRoute;

function getAssetPathFromRoute(route, ext = '') {
  const path = route === '/' ? '/index' : /^\/index(\/|$)/.test(route) ? "/index".concat(route) : "".concat(route);
  return path + ext;
}

/***/ }),

/***/ 564:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.getMiddlewareRegex = getMiddlewareRegex;

var _routeRegex = __webpack_require__(6360);

function getMiddlewareRegex(normalizedRoute, catchAll = true) {
  const result = (0, _routeRegex).getParametrizedRoute(normalizedRoute);
  let catchAllRegex = catchAll ? '(?!_next).*' : '';
  let catchAllGroupedRegex = catchAll ? '(?:(/.*)?)' : '';

  if ('routeKeys' in result) {
    if (result.parameterizedRoute === '/') {
      return {
        groups: {},
        namedRegex: "^/".concat(catchAllRegex, "$"),
        re: new RegExp("^/".concat(catchAllRegex, "$")),
        routeKeys: {}
      };
    }

    return {
      groups: result.groups,
      namedRegex: "^".concat(result.namedParameterizedRoute).concat(catchAllGroupedRegex, "$"),
      re: new RegExp("^".concat(result.parameterizedRoute).concat(catchAllGroupedRegex, "$")),
      routeKeys: result.routeKeys
    };
  }

  if (result.parameterizedRoute === '/') {
    return {
      groups: {},
      re: new RegExp("^/".concat(catchAllRegex, "$"))
    };
  }

  return {
    groups: {},
    re: new RegExp("^".concat(result.parameterizedRoute).concat(catchAllGroupedRegex, "$"))
  };
}

/***/ }),

/***/ 248:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
Object.defineProperty(exports, "getMiddlewareRegex", ({
  enumerable: true,
  get: function () {
    return _getMiddlewareRegex.getMiddlewareRegex;
  }
}));
Object.defineProperty(exports, "getRouteMatcher", ({
  enumerable: true,
  get: function () {
    return _routeMatcher.getRouteMatcher;
  }
}));
Object.defineProperty(exports, "getRouteRegex", ({
  enumerable: true,
  get: function () {
    return _routeRegex.getRouteRegex;
  }
}));
Object.defineProperty(exports, "getSortedRoutes", ({
  enumerable: true,
  get: function () {
    return _sortedRoutes.getSortedRoutes;
  }
}));
Object.defineProperty(exports, "isDynamicRoute", ({
  enumerable: true,
  get: function () {
    return _isDynamic.isDynamicRoute;
  }
}));

var _getMiddlewareRegex = __webpack_require__(564);

var _routeMatcher = __webpack_require__(5693);

var _routeRegex = __webpack_require__(6360);

var _sortedRoutes = __webpack_require__(8621);

var _isDynamic = __webpack_require__(1020);

/***/ }),

/***/ 1020:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.isDynamicRoute = isDynamicRoute; // Identify /[param]/ in route string

const TEST_ROUTE = /\/\[[^/]+?\](?=\/|$)/;

function isDynamicRoute(route) {
  return TEST_ROUTE.test(route);
}

/***/ }),

/***/ 3107:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.parseRelativeUrl = parseRelativeUrl;

var _utils = __webpack_require__(3177);

var _querystring = __webpack_require__(4877);

function parseRelativeUrl(url, base) {
  const globalBase = new URL( false ? 0 : (0, _utils).getLocationOrigin());
  const resolvedBase = base ? new URL(base, globalBase) : globalBase;
  const {
    pathname,
    searchParams,
    search,
    hash,
    href,
    origin
  } = new URL(url, resolvedBase);

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
}

/***/ }),

/***/ 1825:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.parseUrl = parseUrl;

var _querystring = __webpack_require__(4877);

var _parseRelativeUrl = __webpack_require__(3107);

function parseUrl(url) {
  if (url.startsWith('/')) {
    return (0, _parseRelativeUrl).parseRelativeUrl(url);
  }

  const parsedURL = new URL(url);
  return {
    hash: parsedURL.hash,
    hostname: parsedURL.hostname,
    href: parsedURL.href,
    pathname: parsedURL.pathname,
    port: parsedURL.port,
    protocol: parsedURL.protocol,
    query: (0, _querystring).searchParamsToUrlQuery(parsedURL.searchParams),
    search: parsedURL.search
  };
}

/***/ }),

/***/ 8652:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var _defineProperty = __webpack_require__(3782);

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.getPathMatch = getPathMatch;

var _pathToRegexp = __webpack_require__(9264);

function getPathMatch(path, options) {
  const keys = [];
  const regexp = (0, _pathToRegexp).pathToRegexp(path, keys, {
    delimiter: '/',
    sensitive: false,
    strict: options === null || options === void 0 ? void 0 : options.strict
  });
  const matcher = (0, _pathToRegexp).regexpToFunction((options === null || options === void 0 ? void 0 : options.regexModifier) ? new RegExp(options.regexModifier(regexp.source), regexp.flags) : regexp, keys);
  /**
  * A matcher function that will check if a given pathname matches the path
  * given in the builder function. When the path does not match it will return
  * `false` but if it does it will return an object with the matched params
  * merged with the params provided in the second argument.
  */

  return (pathname, params) => {
    const res = pathname == null ? false : matcher(pathname);

    if (!res) {
      return false;
    }
    /**
    * If unnamed params are not allowed they must be removed from
    * the matched parameters. path-to-regexp uses "string" for named and
    * "number" for unnamed parameters.
    */


    if (options === null || options === void 0 ? void 0 : options.removeUnnamedParams) {
      for (const key of keys) {
        if (typeof key.name === 'number') {
          delete res.params[key.name];
        }
      }
    }

    return _objectSpread(_objectSpread({}, params), res.params);
  };
}

/***/ }),

/***/ 9548:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var _defineProperty = __webpack_require__(3782);

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.matchHas = matchHas;
exports.compileNonPath = compileNonPath;
exports.prepareDestination = prepareDestination;

var _pathToRegexp = __webpack_require__(9264);

var _escapeRegexp = __webpack_require__(8493);

var _parseUrl = __webpack_require__(1825);

function matchHas(req, has, query) {
  const params = {};
  const allMatch = has.every(hasItem => {
    let value;
    let key = hasItem.key;

    switch (hasItem.type) {
      case 'header':
        {
          key = key.toLowerCase();
          value = req.headers[key];
          break;
        }

      case 'cookie':
        {
          value = req.cookies[hasItem.key];
          break;
        }

      case 'query':
        {
          value = query[key];
          break;
        }

      case 'host':
        {
          const {
            host
          } = (req === null || req === void 0 ? void 0 : req.headers) || {}; // remove port from host if present

          const hostname = host === null || host === void 0 ? void 0 : host.split(':')[0].toLowerCase();
          value = hostname;
          break;
        }

      default:
        {
          break;
        }
    }

    if (!hasItem.value && value) {
      params[getSafeParamName(key)] = value;
      return true;
    } else if (value) {
      const matcher = new RegExp("^".concat(hasItem.value, "$"));
      const matches = Array.isArray(value) ? value.slice(-1)[0].match(matcher) : value.match(matcher);

      if (matches) {
        if (Array.isArray(matches)) {
          if (matches.groups) {
            Object.keys(matches.groups).forEach(groupKey => {
              params[groupKey] = matches.groups[groupKey];
            });
          } else if (hasItem.type === 'host' && matches[0]) {
            params.host = matches[0];
          }
        }

        return true;
      }
    }

    return false;
  });

  if (allMatch) {
    return params;
  }

  return false;
}

function compileNonPath(value, params) {
  if (!value.includes(':')) {
    return value;
  }

  for (const key of Object.keys(params)) {
    if (value.includes(":".concat(key))) {
      value = value.replace(new RegExp(":".concat(key, "\\*"), 'g'), ":".concat(key, "--ESCAPED_PARAM_ASTERISKS")).replace(new RegExp(":".concat(key, "\\?"), 'g'), ":".concat(key, "--ESCAPED_PARAM_QUESTION")).replace(new RegExp(":".concat(key, "\\+"), 'g'), ":".concat(key, "--ESCAPED_PARAM_PLUS")).replace(new RegExp(":".concat(key, "(?!\\w)"), 'g'), "--ESCAPED_PARAM_COLON".concat(key));
    }
  }

  value = value.replace(/(:|\*|\?|\+|\(|\)|\{|\})/g, '\\$1').replace(/--ESCAPED_PARAM_PLUS/g, '+').replace(/--ESCAPED_PARAM_COLON/g, ':').replace(/--ESCAPED_PARAM_QUESTION/g, '?').replace(/--ESCAPED_PARAM_ASTERISKS/g, '*'); // the value needs to start with a forward-slash to be compiled
  // correctly

  return (0, _pathToRegexp).compile("/".concat(value), {
    validate: false
  })(params).slice(1);
}

function prepareDestination(args) {
  const query = Object.assign({}, args.query);
  delete query.__nextLocale;
  delete query.__nextDefaultLocale;
  let escapedDestination = args.destination;

  for (const param of Object.keys(_objectSpread(_objectSpread({}, args.params), query))) {
    escapedDestination = escapeSegment(escapedDestination, param);
  }

  const parsedDestination = (0, _parseUrl).parseUrl(escapedDestination);
  const destQuery = parsedDestination.query;
  const destPath = unescapeSegments("".concat(parsedDestination.pathname).concat(parsedDestination.hash || ''));
  const destHostname = unescapeSegments(parsedDestination.hostname || '');
  const destPathParamKeys = [];
  const destHostnameParamKeys = [];
  (0, _pathToRegexp).pathToRegexp(destPath, destPathParamKeys);
  (0, _pathToRegexp).pathToRegexp(destHostname, destHostnameParamKeys);
  const destParams = [];
  destPathParamKeys.forEach(key => destParams.push(key.name));
  destHostnameParamKeys.forEach(key => destParams.push(key.name));
  const destPathCompiler = (0, _pathToRegexp).compile(destPath, // we don't validate while compiling the destination since we should
  // have already validated before we got to this point and validating
  // breaks compiling destinations with named pattern params from the source
  // e.g. /something:hello(.*) -> /another/:hello is broken with validation
  // since compile validation is meant for reversing and not for inserting
  // params from a separate path-regex into another
  {
    validate: false
  });
  const destHostnameCompiler = (0, _pathToRegexp).compile(destHostname, {
    validate: false
  }); // update any params in query values

  for (const [key1, strOrArray] of Object.entries(destQuery)) {
    // the value needs to start with a forward-slash to be compiled
    // correctly
    if (Array.isArray(strOrArray)) {
      destQuery[key1] = strOrArray.map(value => compileNonPath(unescapeSegments(value), args.params));
    } else {
      destQuery[key1] = compileNonPath(unescapeSegments(strOrArray), args.params);
    }
  } // add path params to query if it's not a redirect and not
  // already defined in destination query or path


  let paramKeys = Object.keys(args.params).filter(name => name !== 'nextInternalLocale');

  if (args.appendParamsToQuery && !paramKeys.some(key => destParams.includes(key))) {
    for (const key of paramKeys) {
      if (!(key in destQuery)) {
        destQuery[key] = args.params[key];
      }
    }
  }

  let newUrl;

  try {
    newUrl = destPathCompiler(args.params);
    const [pathname, hash] = newUrl.split('#');
    parsedDestination.hostname = destHostnameCompiler(args.params);
    parsedDestination.pathname = pathname;
    parsedDestination.hash = "".concat(hash ? '#' : '').concat(hash || '');
    delete parsedDestination.search;
  } catch (err) {
    if (err.message.match(/Expected .*? to not repeat, but got an array/)) {
      throw new Error("To use a multi-match in the destination you must add `*` at the end of the param name to signify it should repeat. https://nextjs.org/docs/messages/invalid-multi-match");
    }

    throw err;
  } // Query merge order lowest priority to highest
  // 1. initial URL query values
  // 2. path segment values
  // 3. destination specified query values


  parsedDestination.query = _objectSpread(_objectSpread({}, query), parsedDestination.query);
  return {
    newUrl,
    destQuery,
    parsedDestination
  };
}
/**
 * Ensure only a-zA-Z are used for param names for proper interpolating
 * with path-to-regexp
 */


function getSafeParamName(paramName) {
  let newParamName = '';

  for (let i = 0; i < paramName.length; i++) {
    const charCode = paramName.charCodeAt(i);

    if (charCode > 64 && charCode < 91 || charCode > 96 && charCode < 123 // a-z
    ) {
      newParamName += paramName[i];
    }
  }

  return newParamName;
}

function escapeSegment(str, segmentName) {
  return str.replace(new RegExp(":".concat((0, _escapeRegexp).escapeStringRegexp(segmentName)), 'g'), "__ESC_COLON_".concat(segmentName));
}

function unescapeSegments(str) {
  return str.replace(/__ESC_COLON_/gi, ':');
}

/***/ }),

/***/ 4877:
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
  searchParams.forEach((value, key) => {
    if (typeof query[key] === 'undefined') {
      query[key] = value;
    } else if (Array.isArray(query[key])) {
      query[key].push(value);
    } else {
      query[key] = [query[key], value];
    }
  });
  return query;
}

function stringifyUrlQueryParam(param) {
  if (typeof param === 'string' || typeof param === 'number' && !isNaN(param) || typeof param === 'boolean') {
    return String(param);
  } else {
    return '';
  }
}

function urlQueryToSearchParams(urlQuery) {
  const result = new URLSearchParams();
  Object.entries(urlQuery).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(item => result.append(key, stringifyUrlQueryParam(item)));
    } else {
      result.set(key, stringifyUrlQueryParam(value));
    }
  });
  return result;
}

function assign(target, ...searchParamsList) {
  searchParamsList.forEach(searchParams => {
    Array.from(searchParams.keys()).forEach(key => target.delete(key));
    searchParams.forEach((value, key) => target.append(key, value));
  });
  return target;
}

/***/ }),

/***/ 8459:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = resolveRewrites;

var _pathMatch = __webpack_require__(8652);

var _prepareDestination = __webpack_require__(9548);

var _normalizeTrailingSlash = __webpack_require__(5737);

var _normalizeLocalePath = __webpack_require__(716);

var _parseRelativeUrl = __webpack_require__(3107);

var _router = __webpack_require__(7744);

function resolveRewrites(asPath, pages, rewrites, query, resolveHref, locales) {
  let matchedPage = false;
  let externalDest = false;
  let parsedAs = (0, _parseRelativeUrl).parseRelativeUrl(asPath);
  let fsPathname = (0, _normalizeTrailingSlash).removePathTrailingSlash((0, _normalizeLocalePath).normalizeLocalePath((0, _router).delBasePath(parsedAs.pathname), locales).pathname);
  let resolvedHref;

  const handleRewrite = rewrite => {
    const matcher = (0, _pathMatch).getPathMatch(rewrite.source, {
      removeUnnamedParams: true,
      strict: true
    });
    let params = matcher(parsedAs.pathname);

    if (rewrite.has && params) {
      const hasParams = (0, _prepareDestination).matchHas({
        headers: {
          host: document.location.hostname
        },
        cookies: document.cookie.split('; ').reduce((acc, item) => {
          const [key, ...value] = item.split('=');
          acc[key] = value.join('=');
          return acc;
        }, {})
      }, rewrite.has, parsedAs.query);

      if (hasParams) {
        Object.assign(params, hasParams);
      } else {
        params = false;
      }
    }

    if (params) {
      if (!rewrite.destination) {
        // this is a proxied rewrite which isn't handled on the client
        externalDest = true;
        return true;
      }

      const destRes = (0, _prepareDestination).prepareDestination({
        appendParamsToQuery: true,
        destination: rewrite.destination,
        params: params,
        query: query
      });
      parsedAs = destRes.parsedDestination;
      asPath = destRes.newUrl;
      Object.assign(query, destRes.parsedDestination.query);
      fsPathname = (0, _normalizeTrailingSlash).removePathTrailingSlash((0, _normalizeLocalePath).normalizeLocalePath((0, _router).delBasePath(asPath), locales).pathname);

      if (pages.includes(fsPathname)) {
        // check if we now match a page as this means we are done
        // resolving the rewrites
        matchedPage = true;
        resolvedHref = fsPathname;
        return true;
      } // check if we match a dynamic-route, if so we break the rewrites chain


      resolvedHref = resolveHref(fsPathname);

      if (resolvedHref !== asPath && pages.includes(resolvedHref)) {
        matchedPage = true;
        return true;
      }
    }
  };

  let finished = false;

  for (let i = 0; i < rewrites.beforeFiles.length; i++) {
    // we don't end after match in beforeFiles to allow
    // continuing through all beforeFiles rewrites
    handleRewrite(rewrites.beforeFiles[i]);
  }

  matchedPage = pages.includes(fsPathname);

  if (!matchedPage) {
    if (!finished) {
      for (let i = 0; i < rewrites.afterFiles.length; i++) {
        if (handleRewrite(rewrites.afterFiles[i])) {
          finished = true;
          break;
        }
      }
    } // check dynamic route before processing fallback rewrites


    if (!finished) {
      resolvedHref = resolveHref(fsPathname);
      matchedPage = pages.includes(resolvedHref);
      finished = matchedPage;
    }

    if (!finished) {
      for (let i = 0; i < rewrites.fallback.length; i++) {
        if (handleRewrite(rewrites.fallback[i])) {
          finished = true;
          break;
        }
      }
    }
  }

  return {
    asPath,
    parsedAs,
    matchedPage,
    resolvedHref,
    externalDest
  };
}

/***/ }),

/***/ 5693:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.getRouteMatcher = getRouteMatcher;

var _utils = __webpack_require__(3177);

function getRouteMatcher(routeRegex) {
  const {
    re,
    groups
  } = routeRegex;
  return pathname => {
    const routeMatch = re.exec(pathname);

    if (!routeMatch) {
      return false;
    }

    const decode = param => {
      try {
        return decodeURIComponent(param);
      } catch (_) {
        throw new _utils.DecodeError('failed to decode param');
      }
    };

    const params = {};
    Object.keys(groups).forEach(slugName => {
      const g = groups[slugName];
      const m = routeMatch[g.pos];

      if (m !== undefined) {
        params[slugName] = ~m.indexOf('/') ? m.split('/').map(entry => decode(entry)) : g.repeat ? [decode(m)] : decode(m);
      }
    });
    return params;
  };
}

/***/ }),

/***/ 6360:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.getParametrizedRoute = getParametrizedRoute;
exports.getRouteRegex = getRouteRegex;

var _escapeRegexp = __webpack_require__(8493);

function parseParameter(param) {
  const optional = param.startsWith('[') && param.endsWith(']');

  if (optional) {
    param = param.slice(1, -1);
  }

  const repeat = param.startsWith('...');

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
  const segments = (route.replace(/\/$/, '') || '/').slice(1).split('/');
  const groups = {};
  let groupIndex = 1;
  const parameterizedRoute = segments.map(segment => {
    if (segment.startsWith('[') && segment.endsWith(']')) {
      const {
        key,
        optional,
        repeat
      } = parseParameter(segment.slice(1, -1));
      groups[key] = {
        pos: groupIndex++,
        repeat,
        optional
      };
      return repeat ? optional ? '(?:/(.+?))?' : '/(.+?)' : '/([^/]+?)';
    } else {
      return "/".concat((0, _escapeRegexp).escapeStringRegexp(segment));
    }
  }).join(''); // dead code eliminate for browser since it's only needed
  // while generating routes-manifest

  if (false) {}

  return {
    parameterizedRoute,
    groups
  };
}

function getRouteRegex(normalizedRoute) {
  const result = getParametrizedRoute(normalizedRoute);

  if ('routeKeys' in result) {
    return {
      re: new RegExp("^".concat(result.parameterizedRoute, "(?:/)?$")),
      groups: result.groups,
      routeKeys: result.routeKeys,
      namedRegex: "^".concat(result.namedParameterizedRoute, "(?:/)?$")
    };
  }

  return {
    re: new RegExp("^".concat(result.parameterizedRoute, "(?:/)?$")),
    groups: result.groups
  };
}

/***/ }),

/***/ 8621:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.getSortedRoutes = getSortedRoutes;

class UrlNode {
  insert(urlPath) {
    this._insert(urlPath.split('/').filter(Boolean), [], false);
  }

  smoosh() {
    return this._smoosh();
  }

  _smoosh(prefix = '/') {
    const childrenPaths = [...this.children.keys()].sort();

    if (this.slugName !== null) {
      childrenPaths.splice(childrenPaths.indexOf('[]'), 1);
    }

    if (this.restSlugName !== null) {
      childrenPaths.splice(childrenPaths.indexOf('[...]'), 1);
    }

    if (this.optionalRestSlugName !== null) {
      childrenPaths.splice(childrenPaths.indexOf('[[...]]'), 1);
    }

    const routes = childrenPaths.map(c => this.children.get(c)._smoosh("".concat(prefix).concat(c, "/"))).reduce((prev, curr) => [...prev, ...curr], []);

    if (this.slugName !== null) {
      routes.push(...this.children.get('[]')._smoosh("".concat(prefix, "[").concat(this.slugName, "]/")));
    }

    if (!this.placeholder) {
      const r = prefix === '/' ? '/' : prefix.slice(0, -1);

      if (this.optionalRestSlugName != null) {
        throw new Error("You cannot define a route with the same specificity as a optional catch-all route (\"".concat(r, "\" and \"").concat(r, "[[...").concat(this.optionalRestSlugName, "]]\")."));
      }

      routes.unshift(r);
    }

    if (this.restSlugName !== null) {
      routes.push(...this.children.get('[...]')._smoosh("".concat(prefix, "[...").concat(this.restSlugName, "]/")));
    }

    if (this.optionalRestSlugName !== null) {
      routes.push(...this.children.get('[[...]]')._smoosh("".concat(prefix, "[[...").concat(this.optionalRestSlugName, "]]/")));
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
    } // The next segment in the urlPaths list


    let nextSegment = urlPaths[0]; // Check if the segment matches `[something]`

    if (nextSegment.startsWith('[') && nextSegment.endsWith(']')) {
      // Strip `[` and `]`, leaving only `something`
      let segmentName = nextSegment.slice(1, -1);
      let isOptional = false;

      if (segmentName.startsWith('[') && segmentName.endsWith(']')) {
        // Strip optional `[` and `]`, leaving only `something`
        segmentName = segmentName.slice(1, -1);
        isOptional = true;
      }

      if (segmentName.startsWith('...')) {
        // Strip `...`, leaving only `something`
        segmentName = segmentName.substring(3);
        isCatchAll = true;
      }

      if (segmentName.startsWith('[') || segmentName.endsWith(']')) {
        throw new Error("Segment names may not start or end with extra brackets ('".concat(segmentName, "')."));
      }

      if (segmentName.startsWith('.')) {
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

        slugNames.forEach(slug => {
          if (slug === nextSlug) {
            throw new Error("You cannot have the same slug name \"".concat(nextSlug, "\" repeat within a single dynamic path"));
          }

          if (slug.replace(/\W/g, '') === nextSegment.replace(/\W/g, '')) {
            throw new Error("You cannot have the slug names \"".concat(slug, "\" and \"").concat(nextSlug, "\" differ only by non-word symbols within a single dynamic path"));
          }
        });
        slugNames.push(nextSlug);
      }

      if (isCatchAll) {
        if (isOptional) {
          if (this.restSlugName != null) {
            throw new Error("You cannot use both an required and optional catch-all route at the same level (\"[...".concat(this.restSlugName, "]\" and \"").concat(urlPaths[0], "\" )."));
          }

          handleSlug(this.optionalRestSlugName, segmentName); // slugName is kept as it can only be one particular slugName

          this.optionalRestSlugName = segmentName; // nextSegment is overwritten to [[...]] so that it can later be sorted specifically

          nextSegment = '[[...]]';
        } else {
          if (this.optionalRestSlugName != null) {
            throw new Error("You cannot use both an optional and required catch-all route at the same level (\"[[...".concat(this.optionalRestSlugName, "]]\" and \"").concat(urlPaths[0], "\")."));
          }

          handleSlug(this.restSlugName, segmentName); // slugName is kept as it can only be one particular slugName

          this.restSlugName = segmentName; // nextSegment is overwritten to [...] so that it can later be sorted specifically

          nextSegment = '[...]';
        }
      } else {
        if (isOptional) {
          throw new Error("Optional route parameters are not yet supported (\"".concat(urlPaths[0], "\")."));
        }

        handleSlug(this.slugName, segmentName); // slugName is kept as it can only be one particular slugName

        this.slugName = segmentName; // nextSegment is overwritten to [] so that it can later be sorted specifically

        nextSegment = '[]';
      }
    } // If this UrlNode doesn't have the nextSegment yet we create a new child UrlNode


    if (!this.children.has(nextSegment)) {
      this.children.set(nextSegment, new UrlNode());
    }

    this.children.get(nextSegment)._insert(urlPaths.slice(1), slugNames, isCatchAll);
  }

  constructor() {
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
  const root = new UrlNode(); // Here the `root` gets injected multiple paths, and insert will break them up into sublevels

  normalizedPages.forEach(pagePath => root.insert(pagePath)); // Smoosh will then sort those sublevels up to the point where you get the correct route definition priority

  return root.smoosh();
}

/***/ }),

/***/ 8026:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.setConfig = setConfig;
exports["default"] = void 0;
let runtimeConfig;

var _default = () => {
  return runtimeConfig;
};

exports["default"] = _default;

function setConfig(configValue) {
  runtimeConfig = configValue;
}

/***/ }),

/***/ 3177:
/***/ (function(__unused_webpack_module, exports) {

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
exports.ST = exports.SP = exports.warnOnce = void 0;

function execOnce(fn) {
  let used = false;
  let result;
  return (...args) => {
    if (!used) {
      used = true;
      result = fn(...args);
    }

    return result;
  };
}

function getLocationOrigin() {
  const {
    protocol,
    hostname,
    port
  } = window.location;
  return "".concat(protocol, "//").concat(hostname).concat(port ? ':' + port : '');
}

function getURL() {
  const {
    href
  } = window.location;
  const origin = getLocationOrigin();
  return href.substring(origin.length);
}

function getDisplayName(Component) {
  return typeof Component === 'string' ? Component : Component.displayName || Component.name || 'Unknown';
}

function isResSent(res) {
  return res.finished || res.headersSent;
}

function normalizeRepeatedSlashes(url) {
  const urlParts = url.split('?');
  const urlNoQuery = urlParts[0];
  return urlNoQuery // first we replace any non-encoded backslashes with forward
  // then normalize repeated forward slashes
  .replace(/\\/g, '/').replace(/\/\/+/g, '/') + (urlParts[1] ? "?".concat(urlParts.slice(1).join('?')) : '');
}

async function loadGetInitialProps(App, ctx) {
  if (false) { var ref; } // when called from _app `ctx` is nested in `ctx`


  const res = ctx.res || ctx.ctx && ctx.ctx.res;

  if (!App.getInitialProps) {
    if (ctx.ctx && ctx.Component) {
      // @ts-ignore pageProps default
      return {
        pageProps: await loadGetInitialProps(ctx.Component, ctx.ctx)
      };
    }

    return {};
  }

  const props = await App.getInitialProps(ctx);

  if (res && isResSent(res)) {
    return props;
  }

  if (!props) {
    const message = "\"".concat(getDisplayName(App), ".getInitialProps()\" should resolve to an object. But found \"").concat(props, "\" instead.");
    throw new Error(message);
  }

  if (false) {}

  return props;
}

let warnOnce = _ => {};

exports.warnOnce = warnOnce;

if (false) {}

const SP = typeof performance !== 'undefined';
exports.SP = SP;
const ST = SP && typeof performance.mark === 'function' && typeof performance.measure === 'function';
exports.ST = ST;

class DecodeError extends Error {}

exports.DecodeError = DecodeError;

/***/ }),

/***/ 1541:
/***/ (function() {

"trimStart"in String.prototype||(String.prototype.trimStart=String.prototype.trimLeft),"trimEnd"in String.prototype||(String.prototype.trimEnd=String.prototype.trimRight),"description"in Symbol.prototype||Object.defineProperty(Symbol.prototype,"description",{configurable:!0,get:function(){var t=/\((.*)\)/.exec(this.toString());return t?t[1]:void 0}}),Array.prototype.flat||(Array.prototype.flat=function(t,r){return r=this.concat.apply([],this),t>1&&r.some(Array.isArray)?r.flat(t-1):r},Array.prototype.flatMap=function(t,r){return this.map(t,r).flat()}),Promise.prototype.finally||(Promise.prototype.finally=function(t){if("function"!=typeof t)return this.then(t,t);var r=this.constructor||Promise;return this.then(function(o){return r.resolve(t()).then(function(){return o})},function(o){return r.resolve(t()).then(function(){throw o})})});


/***/ }),

/***/ 3782:
/***/ (function(module) {

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

module.exports = _defineProperty;
module.exports["default"] = module.exports, module.exports.__esModule = true;

/***/ }),

/***/ 9264:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Tokenize input string.
 */
function lexer(str) {
    var tokens = [];
    var i = 0;
    while (i < str.length) {
        var char = str[i];
        if (char === "*" || char === "+" || char === "?") {
            tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
            continue;
        }
        if (char === "\\") {
            tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
            continue;
        }
        if (char === "{") {
            tokens.push({ type: "OPEN", index: i, value: str[i++] });
            continue;
        }
        if (char === "}") {
            tokens.push({ type: "CLOSE", index: i, value: str[i++] });
            continue;
        }
        if (char === ":") {
            var name = "";
            var j = i + 1;
            while (j < str.length) {
                var code = str.charCodeAt(j);
                if (
                // `0-9`
                (code >= 48 && code <= 57) ||
                    // `A-Z`
                    (code >= 65 && code <= 90) ||
                    // `a-z`
                    (code >= 97 && code <= 122) ||
                    // `_`
                    code === 95) {
                    name += str[j++];
                    continue;
                }
                break;
            }
            if (!name)
                throw new TypeError("Missing parameter name at " + i);
            tokens.push({ type: "NAME", index: i, value: name });
            i = j;
            continue;
        }
        if (char === "(") {
            var count = 1;
            var pattern = "";
            var j = i + 1;
            if (str[j] === "?") {
                throw new TypeError("Pattern cannot start with \"?\" at " + j);
            }
            while (j < str.length) {
                if (str[j] === "\\") {
                    pattern += str[j++] + str[j++];
                    continue;
                }
                if (str[j] === ")") {
                    count--;
                    if (count === 0) {
                        j++;
                        break;
                    }
                }
                else if (str[j] === "(") {
                    count++;
                    if (str[j + 1] !== "?") {
                        throw new TypeError("Capturing groups are not allowed at " + j);
                    }
                }
                pattern += str[j++];
            }
            if (count)
                throw new TypeError("Unbalanced pattern at " + i);
            if (!pattern)
                throw new TypeError("Missing pattern at " + i);
            tokens.push({ type: "PATTERN", index: i, value: pattern });
            i = j;
            continue;
        }
        tokens.push({ type: "CHAR", index: i, value: str[i++] });
    }
    tokens.push({ type: "END", index: i, value: "" });
    return tokens;
}
/**
 * Parse a string for the raw tokens.
 */
function parse(str, options) {
    if (options === void 0) { options = {}; }
    var tokens = lexer(str);
    var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a;
    var defaultPattern = "[^" + escapeString(options.delimiter || "/#?") + "]+?";
    var result = [];
    var key = 0;
    var i = 0;
    var path = "";
    var tryConsume = function (type) {
        if (i < tokens.length && tokens[i].type === type)
            return tokens[i++].value;
    };
    var mustConsume = function (type) {
        var value = tryConsume(type);
        if (value !== undefined)
            return value;
        var _a = tokens[i], nextType = _a.type, index = _a.index;
        throw new TypeError("Unexpected " + nextType + " at " + index + ", expected " + type);
    };
    var consumeText = function () {
        var result = "";
        var value;
        // tslint:disable-next-line
        while ((value = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR"))) {
            result += value;
        }
        return result;
    };
    while (i < tokens.length) {
        var char = tryConsume("CHAR");
        var name = tryConsume("NAME");
        var pattern = tryConsume("PATTERN");
        if (name || pattern) {
            var prefix = char || "";
            if (prefixes.indexOf(prefix) === -1) {
                path += prefix;
                prefix = "";
            }
            if (path) {
                result.push(path);
                path = "";
            }
            result.push({
                name: name || key++,
                prefix: prefix,
                suffix: "",
                pattern: pattern || defaultPattern,
                modifier: tryConsume("MODIFIER") || ""
            });
            continue;
        }
        var value = char || tryConsume("ESCAPED_CHAR");
        if (value) {
            path += value;
            continue;
        }
        if (path) {
            result.push(path);
            path = "";
        }
        var open = tryConsume("OPEN");
        if (open) {
            var prefix = consumeText();
            var name_1 = tryConsume("NAME") || "";
            var pattern_1 = tryConsume("PATTERN") || "";
            var suffix = consumeText();
            mustConsume("CLOSE");
            result.push({
                name: name_1 || (pattern_1 ? key++ : ""),
                pattern: name_1 && !pattern_1 ? defaultPattern : pattern_1,
                prefix: prefix,
                suffix: suffix,
                modifier: tryConsume("MODIFIER") || ""
            });
            continue;
        }
        mustConsume("END");
    }
    return result;
}
exports.parse = parse;
/**
 * Compile a string to a template function for the path.
 */
function compile(str, options) {
    return tokensToFunction(parse(str, options), options);
}
exports.compile = compile;
/**
 * Expose a method for transforming tokens into the path function.
 */
function tokensToFunction(tokens, options) {
    if (options === void 0) { options = {}; }
    var reFlags = flags(options);
    var _a = options.encode, encode = _a === void 0 ? function (x) { return x; } : _a, _b = options.validate, validate = _b === void 0 ? true : _b;
    // Compile all the tokens into regexps.
    var matches = tokens.map(function (token) {
        if (typeof token === "object") {
            return new RegExp("^(?:" + token.pattern + ")$", reFlags);
        }
    });
    return function (data) {
        var path = "";
        for (var i = 0; i < tokens.length; i++) {
            var token = tokens[i];
            if (typeof token === "string") {
                path += token;
                continue;
            }
            var value = data ? data[token.name] : undefined;
            var optional = token.modifier === "?" || token.modifier === "*";
            var repeat = token.modifier === "*" || token.modifier === "+";
            if (Array.isArray(value)) {
                if (!repeat) {
                    throw new TypeError("Expected \"" + token.name + "\" to not repeat, but got an array");
                }
                if (value.length === 0) {
                    if (optional)
                        continue;
                    throw new TypeError("Expected \"" + token.name + "\" to not be empty");
                }
                for (var j = 0; j < value.length; j++) {
                    var segment = encode(value[j], token);
                    if (validate && !matches[i].test(segment)) {
                        throw new TypeError("Expected all \"" + token.name + "\" to match \"" + token.pattern + "\", but got \"" + segment + "\"");
                    }
                    path += token.prefix + segment + token.suffix;
                }
                continue;
            }
            if (typeof value === "string" || typeof value === "number") {
                var segment = encode(String(value), token);
                if (validate && !matches[i].test(segment)) {
                    throw new TypeError("Expected \"" + token.name + "\" to match \"" + token.pattern + "\", but got \"" + segment + "\"");
                }
                path += token.prefix + segment + token.suffix;
                continue;
            }
            if (optional)
                continue;
            var typeOfMessage = repeat ? "an array" : "a string";
            throw new TypeError("Expected \"" + token.name + "\" to be " + typeOfMessage);
        }
        return path;
    };
}
exports.tokensToFunction = tokensToFunction;
/**
 * Create path match function from `path-to-regexp` spec.
 */
function match(str, options) {
    var keys = [];
    var re = pathToRegexp(str, keys, options);
    return regexpToFunction(re, keys, options);
}
exports.match = match;
/**
 * Create a path match function from `path-to-regexp` output.
 */
function regexpToFunction(re, keys, options) {
    if (options === void 0) { options = {}; }
    var _a = options.decode, decode = _a === void 0 ? function (x) { return x; } : _a;
    return function (pathname) {
        var m = re.exec(pathname);
        if (!m)
            return false;
        var path = m[0], index = m.index;
        var params = Object.create(null);
        var _loop_1 = function (i) {
            // tslint:disable-next-line
            if (m[i] === undefined)
                return "continue";
            var key = keys[i - 1];
            if (key.modifier === "*" || key.modifier === "+") {
                params[key.name] = m[i].split(key.prefix + key.suffix).map(function (value) {
                    return decode(value, key);
                });
            }
            else {
                params[key.name] = decode(m[i], key);
            }
        };
        for (var i = 1; i < m.length; i++) {
            _loop_1(i);
        }
        return { path: path, index: index, params: params };
    };
}
exports.regexpToFunction = regexpToFunction;
/**
 * Escape a regular expression string.
 */
function escapeString(str) {
    return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
/**
 * Get the flags for a regexp from the options.
 */
function flags(options) {
    return options && options.sensitive ? "" : "i";
}
/**
 * Pull out keys from a regexp.
 */
function regexpToRegexp(path, keys) {
    if (!keys)
        return path;
    // Use a negative lookahead to match only capturing groups.
    var groups = path.source.match(/\((?!\?)/g);
    if (groups) {
        for (var i = 0; i < groups.length; i++) {
            keys.push({
                name: i,
                prefix: "",
                suffix: "",
                modifier: "",
                pattern: ""
            });
        }
    }
    return path;
}
/**
 * Transform an array into a regexp.
 */
function arrayToRegexp(paths, keys, options) {
    var parts = paths.map(function (path) { return pathToRegexp(path, keys, options).source; });
    return new RegExp("(?:" + parts.join("|") + ")", flags(options));
}
/**
 * Create a path regexp from string input.
 */
function stringToRegexp(path, keys, options) {
    return tokensToRegexp(parse(path, options), keys, options);
}
/**
 * Expose a function for taking tokens and returning a RegExp.
 */
function tokensToRegexp(tokens, keys, options) {
    if (options === void 0) { options = {}; }
    var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function (x) { return x; } : _d;
    var endsWith = "[" + escapeString(options.endsWith || "") + "]|$";
    var delimiter = "[" + escapeString(options.delimiter || "/#?") + "]";
    var route = start ? "^" : "";
    // Iterate over the tokens and create our regexp string.
    for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
        var token = tokens_1[_i];
        if (typeof token === "string") {
            route += escapeString(encode(token));
        }
        else {
            var prefix = escapeString(encode(token.prefix));
            var suffix = escapeString(encode(token.suffix));
            if (token.pattern) {
                if (keys)
                    keys.push(token);
                if (prefix || suffix) {
                    if (token.modifier === "+" || token.modifier === "*") {
                        var mod = token.modifier === "*" ? "?" : "";
                        route += "(?:" + prefix + "((?:" + token.pattern + ")(?:" + suffix + prefix + "(?:" + token.pattern + "))*)" + suffix + ")" + mod;
                    }
                    else {
                        route += "(?:" + prefix + "(" + token.pattern + ")" + suffix + ")" + token.modifier;
                    }
                }
                else {
                    route += "(" + token.pattern + ")" + token.modifier;
                }
            }
            else {
                route += "(?:" + prefix + suffix + ")" + token.modifier;
            }
        }
    }
    if (end) {
        if (!strict)
            route += delimiter + "?";
        route += !options.endsWith ? "$" : "(?=" + endsWith + ")";
    }
    else {
        var endToken = tokens[tokens.length - 1];
        var isEndDelimited = typeof endToken === "string"
            ? delimiter.indexOf(endToken[endToken.length - 1]) > -1
            : // tslint:disable-next-line
                endToken === undefined;
        if (!strict) {
            route += "(?:" + delimiter + "(?=" + endsWith + "))?";
        }
        if (!isEndDelimited) {
            route += "(?=" + delimiter + "|" + endsWith + ")";
        }
    }
    return new RegExp(route, flags(options));
}
exports.tokensToRegexp = tokensToRegexp;
/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 */
function pathToRegexp(path, keys, options) {
    if (path instanceof RegExp)
        return regexpToRegexp(path, keys);
    if (Array.isArray(path))
        return arrayToRegexp(path, keys, options);
    return stringToRegexp(path, keys, options);
}
exports.pathToRegexp = pathToRegexp;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 9600:
/***/ (function(module) {

var __dirname = "/";
(function(){var e={106:function(e,t){!function(e,l){ true?l(t):0}(this,(function(e){"use strict";var t,l,g,h,a=function(e,t){return{name:e,value:void 0===t?-1:t,delta:0,entries:[],id:"v2-".concat(Date.now(),"-").concat(Math.floor(8999999999999*Math.random())+1e12)}},o=function(e,t){try{if(PerformanceObserver.supportedEntryTypes.includes(e)){if("first-input"===e&&!("PerformanceEventTiming"in self))return;var l=new PerformanceObserver((function(e){return e.getEntries().map(t)}));return l.observe({type:e,buffered:!0}),l}}catch(e){}},u=function(e,t){var l=function n(l){"pagehide"!==l.type&&"hidden"!==document.visibilityState||(e(l),t&&(removeEventListener("visibilitychange",n,!0),removeEventListener("pagehide",n,!0)))};addEventListener("visibilitychange",l,!0),addEventListener("pagehide",l,!0)},c=function(e){addEventListener("pageshow",(function(t){t.persisted&&e(t)}),!0)},f=function(e,t,l){var g;return function(h){t.value>=0&&(h||l)&&(t.delta=t.value-(g||0),(t.delta||void 0===g)&&(g=t.value,e(t)))}},y=-1,d=function(){return"hidden"===document.visibilityState?0:1/0},m=function(){u((function(e){var t=e.timeStamp;y=t}),!0)},v=function(){return y<0&&(y=d(),m(),c((function(){setTimeout((function(){y=d(),m()}),0)}))),{get firstHiddenTime(){return y}}},p=function(e,t){var l,g=v(),h=a("FCP"),u=function(e){"first-contentful-paint"===e.name&&(w&&w.disconnect(),e.startTime<g.firstHiddenTime&&(h.value=e.startTime,h.entries.push(e),l(!0)))},y=performance.getEntriesByName&&performance.getEntriesByName("first-contentful-paint")[0],w=y?null:o("paint",u);(y||w)&&(l=f(e,h,t),y&&u(y),c((function(g){h=a("FCP"),l=f(e,h,t),requestAnimationFrame((function(){requestAnimationFrame((function(){h.value=performance.now()-g.timeStamp,l(!0)}))}))})))},w=!1,b=-1,_={passive:!0,capture:!0},F=new Date,T=function(e,h){t||(t=h,l=e,g=new Date,L(removeEventListener),E())},E=function(){if(l>=0&&l<g-F){var e={entryType:"first-input",name:t.type,target:t.target,cancelable:t.cancelable,startTime:t.timeStamp,processingStart:t.timeStamp+l};h.forEach((function(t){t(e)})),h=[]}},S=function(e){if(e.cancelable){var t=(e.timeStamp>1e12?new Date:performance.now())-e.timeStamp;"pointerdown"==e.type?function(e,t){var n=function(){T(e,t),r()},i=function(){r()},r=function(){removeEventListener("pointerup",n,_),removeEventListener("pointercancel",i,_)};addEventListener("pointerup",n,_),addEventListener("pointercancel",i,_)}(t,e):T(t,e)}},L=function(e){["mousedown","keydown","touchstart","pointerdown"].forEach((function(t){return e(t,S,_)}))},P=new Set;e.getCLS=function(e,t){w||(p((function(e){b=e.value})),w=!0);var l,i=function(t){b>-1&&e(t)},g=a("CLS",0),h=0,y=[],m=function(e){if(!e.hadRecentInput){var t=y[0],w=y[y.length-1];h&&e.startTime-w.startTime<1e3&&e.startTime-t.startTime<5e3?(h+=e.value,y.push(e)):(h=e.value,y=[e]),h>g.value&&(g.value=h,g.entries=y,l())}},_=o("layout-shift",m);_&&(l=f(i,g,t),u((function(){_.takeRecords().map(m),l(!0)})),c((function(){h=0,b=-1,g=a("CLS",0),l=f(i,g,t)})))},e.getFCP=p,e.getFID=function(e,g){var y,w=v(),b=a("FID"),p=function(e){e.startTime<w.firstHiddenTime&&(b.value=e.processingStart-e.startTime,b.entries.push(e),y(!0))},_=o("first-input",p);y=f(e,b,g),_&&u((function(){_.takeRecords().map(p),_.disconnect()}),!0),_&&c((function(){var w;b=a("FID"),y=f(e,b,g),h=[],l=-1,t=null,L(addEventListener),w=p,h.push(w),E()}))},e.getLCP=function(e,t){var l,g=v(),h=a("LCP"),s=function(e){var t=e.startTime;t<g.firstHiddenTime&&(h.value=t,h.entries.push(e)),l()},y=o("largest-contentful-paint",s);if(y){l=f(e,h,t);var m=function(){P.has(h.id)||(y.takeRecords().map(s),y.disconnect(),P.add(h.id),l(!0))};["keydown","click"].forEach((function(e){addEventListener(e,m,{once:!0,capture:!0})})),u(m,!0),c((function(g){h=a("LCP"),l=f(e,h,t),requestAnimationFrame((function(){requestAnimationFrame((function(){h.value=performance.now()-g.timeStamp,P.add(h.id),l(!0)}))}))}))}},e.getTTFB=function(e){var t,l=a("TTFB");t=function(){try{var t=performance.getEntriesByType("navigation")[0]||function(){var e=performance.timing,t={entryType:"navigation",startTime:0};for(var l in e)"navigationStart"!==l&&"toJSON"!==l&&(t[l]=Math.max(e[l]-e.navigationStart,0));return t}();if(l.value=l.delta=t.responseStart,l.value<0)return;l.entries=[t],e(l)}catch(e){}},"complete"===document.readyState?setTimeout(t,0):addEventListener("pageshow",t)},Object.defineProperty(e,"__esModule",{value:!0})}))}};if(typeof __nccwpck_require__!=="undefined")__nccwpck_require__.ab=__dirname+"/";var t={};e[106](0,t);module.exports=t})();

/***/ }),

/***/ 274:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = isError;
exports.getProperError = getProperError;
var _isPlainObject = __webpack_require__(7810);
function isError(err) {
    return typeof err === 'object' && err !== null && 'name' in err && 'message' in err;
}
function getProperError(err) {
    if (isError(err)) {
        return err;
    }
    if (false) {}
    return new Error((0, _isPlainObject).isPlainObject(err) ? JSON.stringify(err) : err + '');
}

//# sourceMappingURL=is-error.js.map

/***/ }),

/***/ 4863:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.normalizePathSep = normalizePathSep;
exports.denormalizePagePath = denormalizePagePath;
var _utils = __webpack_require__(248);
function normalizePathSep(path) {
    return path.replace(/\\/g, '/');
}
function denormalizePagePath(page) {
    page = normalizePathSep(page);
    if (page.startsWith('/index/') && !(0, _utils).isDynamicRoute(page)) {
        page = page.slice(6);
    } else if (page === '/index') {
        page = '/';
    }
    return page;
}

//# sourceMappingURL=denormalize-page-path.js.map

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, [774], function() { return __webpack_exec__(1180); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ _N_E = __webpack_exports__;
/******/ }
]);