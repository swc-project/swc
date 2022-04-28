(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[820],{

/***/ 4267:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "m": function() { return /* binding */ ErrorPage; }
/* harmony export */ });
/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7729);
/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_head__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2903);




const ErrorPage = props => {
  const {
    error,
    errorId,
    message,
    statusCode
  } = props;
  return (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__/* .jsxs */ .BX)(_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__/* .Fragment */ .HY, {
    children: [(0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__/* .jsx */ .tZ)((next_head__WEBPACK_IMPORTED_MODULE_0___default()), {
      children: (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__/* .jsxs */ .BX)("title", {
        children: ["Error ", statusCode]
      })
    }), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__/* .jsxs */ .BX)("div", {
      className: "container text-2xl md:text-xl bg-white",
      children: [(0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__/* .jsxs */ .BX)("div", {
        className: "flex flex-col items-center justify-center w-screen h-screen",
        children: [(0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__/* .jsx */ .tZ)("h1", {
          className: "m-5 text-5xl text-black md:text-4xl",
          children: "Woops !"
        }), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__/* .jsx */ .tZ)("p", {
          className: "text-2xl text-black md:text-2xl",
          children: "Something went wrong. Please try again later."
        })]
      }), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__/* .jsxs */ .BX)("div", {
        className: "absolute bottom-0 right-0 p-5 border-solid border-2 border-indigo-400 rounded-lg text-left m-5 text-gray-700 text-sm",
        children: [(0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__/* .jsxs */ .BX)("p", {
          "data-testid": "error-status-code",
          children: ["Code: ", statusCode]
        }), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__/* .jsxs */ .BX)("p", {
          children: ["Message: ", message]
        }), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__/* .jsxs */ .BX)("p", {
          children: ["Error id: ", errorId]
        }), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__/* .jsxs */ .BX)("p", {
          children: ["ErrorMessage: ", error === null || error === void 0 ? void 0 : error.message]
        })]
      })]
    })]
  });
};

/***/ }),

/***/ 8562:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _sentry_nextjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(837);
/* harmony import */ var next_error__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(689);
/* harmony import */ var _features_system_pages_ErrorPage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4267);
/* harmony import */ var _emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2903);
/**
 * Typescript class based component for custom-error
 * @link https://nextjs.org/docs/advanced-features/custom-error-page
 */




const sentryIgnoredStatusCodes = [404, 410]; // Adds HttpException to the list of possible error types.

/**
 * The request to sentry might be blocked on the browser due to ad blockers, csrf...
 * Alternatively a good practice is to proxy the sentry in a nextjs api route, istio...
 * @see https://github.com/getsentry/sentry-javascript/issues/2916
 */
const sentryCaptureExceptionFailsafe = err => {
  let browserSentryErrorId;

  try {
    browserSentryErrorId = (0,_sentry_nextjs__WEBPACK_IMPORTED_MODULE_2__/* .captureException */ .Tb)(err);
  } catch (e) {
    const msg = "Couldn't send error to sentry, reason ".concat(e instanceof Error ? e.message : 'unknown');
    console.error(msg);
  }

  return browserSentryErrorId;
};
/**
 * Flushing the request on the browser is not required and might fail with err:BLOCKED_BY_CLIENT
 * Possible causes vary, but the most common is that the request is blocked by ad-blockers or csrf rules.
 */


const sentryFlushServerSide = async flushAfter => {
  if (false) {}
};

const CustomError = props => {
  const {
    statusCode,
    err,
    hasGetInitialPropsRun,
    sentryErrorId,
    message
  } = props;
  let browserSentryErrorId;

  if (!hasGetInitialPropsRun && err) {
    // getInitialProps is not called in case of https://github.com/vercel/next.js/issues/8592.
    // As a workaround, we pass err via _app.js so it can be captured
    browserSentryErrorId = sentryCaptureExceptionFailsafe(err); // Flushing is not required in this case as it only happens on the client
  }

  return (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__/* .jsx */ .tZ)(_features_system_pages_ErrorPage__WEBPACK_IMPORTED_MODULE_1__/* .ErrorPage */ .m, {
    error: err !== null && err !== void 0 ? err : undefined,
    message: message,
    errorId: sentryErrorId !== null && sentryErrorId !== void 0 ? sentryErrorId : browserSentryErrorId,
    statusCode: statusCode
  });
};

CustomError.getInitialProps = async ({
  res,
  err,
  asPath
}) => {
  const errorInitialProps = await next_error__WEBPACK_IMPORTED_MODULE_0__["default"].getInitialProps({
    res,
    err
  }); // Workaround for https://github.com/vercel/next.js/issues/8592, mark when
  // getInitialProps has run

  errorInitialProps.hasGetInitialPropsRun = true; // Returning early because we don't want to log ignored errors to Sentry.

  if (typeof (res === null || res === void 0 ? void 0 : res.statusCode) === 'number' && sentryIgnoredStatusCodes.includes(res.statusCode)) {
    return errorInitialProps;
  } // Running on the server, the response object (`res`) is available.
  //
  // Next.js will pass an error on the server if a page's data fetching methods
  // threw or returned a Promise that rejected
  //
  // Running on the client (browser), Next.js will provide an error if:
  //
  //  - a page's `getInitialProps` threw or returned a Promise that rejected
  //  - an exception was thrown somewhere in the React lifecycle (render,
  //    componentDidMount, etc) that was caught by Next.js's React Error
  //    Boundary. Read more about what types of exceptions are caught by Error
  //    Boundaries: https://reactjs.org/docs/error-boundaries.html


  if (err) {
    errorInitialProps.sentryErrorId = sentryCaptureExceptionFailsafe(err); // Flushing before returning is necessary if deploying to Vercel, see
    // https://vercel.com/docs/platform/limits#streaming-responses

    await sentryFlushServerSide(1500);
    return errorInitialProps;
  } // If this point is reached, getInitialProps was called without any
  // information about what the error might be. This is unexpected and may
  // indicate a bug introduced in Next.js, so record it in Sentry


  errorInitialProps.sentryErrorId = (0,_sentry_nextjs__WEBPACK_IMPORTED_MODULE_2__/* .captureException */ .Tb)(new Error("_error.js getInitialProps missing data at path: ".concat(asPath)));
  await sentryFlushServerSide(1500);
  return errorInitialProps;
};

/* harmony default export */ __webpack_exports__["default"] = (CustomError);

/***/ }),

/***/ 1169:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _react = _interopRequireDefault(__webpack_require__(2784));

var _head = _interopRequireDefault(__webpack_require__(3233));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

const statusCodes = {
  400: 'Bad Request',
  404: 'This page could not be found',
  405: 'Method Not Allowed',
  500: 'Internal Server Error'
};

function _getInitialProps({
  res,
  err
}) {
  const statusCode = res && res.statusCode ? res.statusCode : err ? err.statusCode : 404;
  return {
    statusCode
  };
}

class Error extends _react.default.Component {
  render() {
    const {
      statusCode
    } = this.props;
    const title = this.props.title || statusCodes[statusCode] || 'An unexpected error has occurred';
    return /*#__PURE__*/_react.default.createElement("div", {
      style: styles.error
    }, /*#__PURE__*/_react.default.createElement(_head.default, null, /*#__PURE__*/_react.default.createElement("title", null, statusCode ? "".concat(statusCode, ": ").concat(title) : 'Application error: a client-side exception has occurred')), /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("style", {
      dangerouslySetInnerHTML: {
        __html: "\n                body { margin: 0; color: #000; background: #fff; }\n                .next-error-h1 {\n                  border-right: 1px solid rgba(0, 0, 0, .3);\n                }\n                @media (prefers-color-scheme: dark) {\n                  body { color: #fff; background: #000; }\n                  .next-error-h1 {\n                    border-right: 1px solid rgba(255, 255, 255, .3);\n                  }\n                }"
      }
    }), statusCode ? /*#__PURE__*/_react.default.createElement("h1", {
      className: "next-error-h1",
      style: styles.h1
    }, statusCode) : null, /*#__PURE__*/_react.default.createElement("div", {
      style: styles.desc
    }, /*#__PURE__*/_react.default.createElement("h2", {
      style: styles.h2
    }, this.props.title || statusCode ? title : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, "Application error: a client-side exception has occurred (see the browser console for more information)"), "."))));
  }

}

exports["default"] = Error;
Error.displayName = 'ErrorPage';
Error.getInitialProps = _getInitialProps;
Error.origGetInitialProps = _getInitialProps;
const styles = {
  error: {
    fontFamily: '-apple-system, BlinkMacSystemFont, Roboto, "Segoe UI", "Fira Sans", Avenir, "Helvetica Neue", "Lucida Grande", sans-serif',
    height: '100vh',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  desc: {
    display: 'inline-block',
    textAlign: 'left',
    lineHeight: '49px',
    height: '49px',
    verticalAlign: 'middle'
  },
  h1: {
    display: 'inline-block',
    margin: 0,
    marginRight: '20px',
    padding: '10px 23px 10px 0',
    fontSize: '24px',
    fontWeight: 500,
    verticalAlign: 'top'
  },
  h2: {
    fontSize: '14px',
    fontWeight: 'normal',
    lineHeight: 'inherit',
    margin: 0,
    padding: 0
  }
};

/***/ }),

/***/ 1458:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {


    (window.__NEXT_P = window.__NEXT_P || []).push([
      "/_error",
      function () {
        return __webpack_require__(8562);
      }
    ]);
    if(false) {}
  

/***/ }),

/***/ 689:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(1169)


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, [774,888,179], function() { return __webpack_exec__(1458); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ _N_E = __webpack_exports__;
/******/ }
]);