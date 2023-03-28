(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
    [739],
    {
        /***/ 3824: /***/ function (
            __unused_webpack_module,
            exports,
            __webpack_require__
        ) {
            "use strict";
            var __webpack_unused_export__;

            var _slicedToArray = __webpack_require__(3408);

            __webpack_unused_export__ = {
                value: true,
            };
            exports.default = void 0;

            var _react = _interopRequireDefault(__webpack_require__(2735));

            var _router = __webpack_require__(1073);

            var _router1 = __webpack_require__(6409);

            var _useIntersection = __webpack_require__(4770);

            function _interopRequireDefault(obj) {
                return obj && obj.__esModule
                    ? obj
                    : {
                          default: obj,
                      };
            }

            var prefetched = {};

            function prefetch(router, href, as, options) {
                if (false || !router) return;
                if (!(0, _router).isLocalURL(href)) return; // Prefetch the JSON page if asked (only in the client)
                // We need to handle a prefetch error here since we may be
                // loading with priority which can reject but we don't
                // want to force navigation since this is only a prefetch

                router.prefetch(href, as, options)["catch"](function (err) {
                    if (false) {
                    }
                });
                var curLocale =
                    options && typeof options.locale !== "undefined"
                        ? options.locale
                        : router && router.locale; // Join on an invalid URI character

                prefetched[
                    href + "%" + as + (curLocale ? "%" + curLocale : "")
                ] = true;
            }

            function isModifiedEvent(event) {
                var target = event.currentTarget.target;
                return (
                    (target && target !== "_self") ||
                    event.metaKey ||
                    event.ctrlKey ||
                    event.shiftKey ||
                    event.altKey ||
                    (event.nativeEvent && event.nativeEvent.which === 2)
                );
            }

            function linkClicked(
                e,
                router,
                href,
                as,
                replace,
                shallow,
                scroll,
                locale
            ) {
                var nodeName = e.currentTarget.nodeName;

                if (
                    nodeName === "A" &&
                    (isModifiedEvent(e) || !(0, _router).isLocalURL(href))
                ) {
                    // ignore click for browser’s default behavior
                    return;
                }

                e.preventDefault(); //  avoid scroll for urls with anchor refs

                if (scroll == null && as.indexOf("#") >= 0) {
                    scroll = false;
                } // replace state instead of push if prop is present

                router[replace ? "replace" : "push"](href, as, {
                    shallow: shallow,
                    locale: locale,
                    scroll: scroll,
                });
            }

            function Link(props) {
                if (false) {
                    var hasWarned,
                        optionalProps,
                        optionalPropsGuard,
                        requiredProps,
                        requiredPropsGuard,
                        createPropError;
                }

                var p = props.prefetch !== false;
                var router = (0, _router1).useRouter();

                var _react$default$useMem = _react["default"].useMemo(
                        function () {
                            var _resolveHref = (0, _router).resolveHref(
                                    router,
                                    props.href,
                                    true
                                ),
                                _resolveHref2 = _slicedToArray(_resolveHref, 2),
                                resolvedHref = _resolveHref2[0],
                                resolvedAs = _resolveHref2[1];

                            return {
                                href: resolvedHref,
                                as: props.as
                                    ? (0, _router).resolveHref(router, props.as)
                                    : resolvedAs || resolvedHref,
                            };
                        },
                        [router, props.href, props.as]
                    ),
                    href = _react$default$useMem.href,
                    as = _react$default$useMem.as;

                var children = props.children,
                    replace = props.replace,
                    shallow = props.shallow,
                    scroll = props.scroll,
                    locale = props.locale; // Deprecated. Warning shown by propType check. If the children provided is a string (<Link>example</Link>) we wrap it in an <a> tag

                if (typeof children === "string") {
                    children = /*#__PURE__*/ _react["default"].createElement(
                        "a",
                        null,
                        children
                    );
                } // This will return the first child, if multiple are provided it will throw an error

                var child;

                if (false) {
                } else {
                    child = _react["default"].Children.only(children);
                }

                var childRef = child && typeof child === "object" && child.ref;

                var _useIntersection2 = (0, _useIntersection).useIntersection({
                        rootMargin: "200px",
                    }),
                    _useIntersection3 = _slicedToArray(_useIntersection2, 2),
                    setIntersectionRef = _useIntersection3[0],
                    isVisible = _useIntersection3[1];

                var setRef = _react["default"].useCallback(
                    function (el) {
                        setIntersectionRef(el);

                        if (childRef) {
                            if (typeof childRef === "function") childRef(el);
                            else if (typeof childRef === "object") {
                                childRef.current = el;
                            }
                        }
                    },
                    [childRef, setIntersectionRef]
                );

                _react["default"].useEffect(
                    function () {
                        var shouldPrefetch =
                            isVisible && p && (0, _router).isLocalURL(href);
                        var curLocale =
                            typeof locale !== "undefined"
                                ? locale
                                : router && router.locale;
                        var isPrefetched =
                            prefetched[
                                href +
                                    "%" +
                                    as +
                                    (curLocale ? "%" + curLocale : "")
                            ];

                        if (shouldPrefetch && !isPrefetched) {
                            prefetch(router, href, as, {
                                locale: curLocale,
                            });
                        }
                    },
                    [as, href, isVisible, locale, p, router]
                );

                var childProps = {
                    ref: setRef,
                    onClick: function onClick(e) {
                        if (
                            child.props &&
                            typeof child.props.onClick === "function"
                        ) {
                            child.props.onClick(e);
                        }

                        if (!e.defaultPrevented) {
                            linkClicked(
                                e,
                                router,
                                href,
                                as,
                                replace,
                                shallow,
                                scroll,
                                locale
                            );
                        }
                    },
                };

                childProps.onMouseEnter = function (e) {
                    if (!(0, _router).isLocalURL(href)) return;

                    if (
                        child.props &&
                        typeof child.props.onMouseEnter === "function"
                    ) {
                        child.props.onMouseEnter(e);
                    }

                    prefetch(router, href, as, {
                        priority: true,
                    });
                }; // If child is an <a> tag and doesn't have a href attribute, or if the 'passHref' property is
                // defined, we specify the current 'href', so that repetition is not needed by the user

                if (
                    props.passHref ||
                    (child.type === "a" && !("href" in child.props))
                ) {
                    var curLocale =
                        typeof locale !== "undefined"
                            ? locale
                            : router && router.locale; // we only render domain locales if we are currently on a domain locale
                    // so that locale links are still visitable in development/preview envs

                    var localeDomain =
                        router &&
                        router.isLocaleDomain &&
                        (0, _router).getDomainLocale(
                            as,
                            curLocale,
                            router && router.locales,
                            router && router.domainLocales
                        );
                    childProps.href =
                        localeDomain ||
                        (0, _router).addBasePath(
                            (0, _router).addLocale(
                                as,
                                curLocale,
                                router && router.defaultLocale
                            )
                        );
                }

                return /*#__PURE__*/ _react["default"].cloneElement(
                    child,
                    childProps
                );
            }

            var _default = Link;
            exports.default = _default;

            /***/
        },

        /***/ 4770: /***/ function (
            __unused_webpack_module,
            exports,
            __webpack_require__
        ) {
            "use strict";

            var _slicedToArray = __webpack_require__(3408);

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.useIntersection = useIntersection;

            var _react = __webpack_require__(2735);

            var _requestIdleCallback = __webpack_require__(6933);

            var hasIntersectionObserver =
                typeof IntersectionObserver !== "undefined";

            function useIntersection(_ref) {
                var rootMargin = _ref.rootMargin,
                    disabled = _ref.disabled;
                var isDisabled = disabled || !hasIntersectionObserver;
                var unobserve = (0, _react).useRef();

                var _useState = (0, _react).useState(false),
                    _useState2 = _slicedToArray(_useState, 2),
                    visible = _useState2[0],
                    setVisible = _useState2[1];

                var setRef = (0, _react).useCallback(
                    function (el) {
                        if (unobserve.current) {
                            unobserve.current();
                            unobserve.current = undefined;
                        }

                        if (isDisabled || visible) return;

                        if (el && el.tagName) {
                            unobserve.current = observe(
                                el,
                                function (isVisible) {
                                    return isVisible && setVisible(isVisible);
                                },
                                {
                                    rootMargin: rootMargin,
                                }
                            );
                        }
                    },
                    [isDisabled, rootMargin, visible]
                );
                (0, _react).useEffect(
                    function () {
                        if (!hasIntersectionObserver) {
                            if (!visible) {
                                var idleCallback = (0,
                                _requestIdleCallback).requestIdleCallback(
                                    function () {
                                        return setVisible(true);
                                    }
                                );
                                return function () {
                                    return (0,
                                    _requestIdleCallback).cancelIdleCallback(
                                        idleCallback
                                    );
                                };
                            }
                        }
                    },
                    [visible]
                );
                return [setRef, visible];
            }

            function observe(element, callback, options) {
                var _createObserver = createObserver(options),
                    id = _createObserver.id,
                    observer = _createObserver.observer,
                    elements = _createObserver.elements;

                elements.set(element, callback);
                observer.observe(element);
                return function unobserve() {
                    elements["delete"](element);
                    observer.unobserve(element); // Destroy observer when there's nothing left to watch:

                    if (elements.size === 0) {
                        observer.disconnect();
                        observers["delete"](id);
                    }
                };
            }

            var observers = new Map();

            function createObserver(options) {
                var id = options.rootMargin || "";
                var instance = observers.get(id);

                if (instance) {
                    return instance;
                }

                var elements = new Map();
                var observer = new IntersectionObserver(function (entries) {
                    entries.forEach(function (entry) {
                        var callback = elements.get(entry.target);
                        var isVisible =
                            entry.isIntersecting || entry.intersectionRatio > 0;

                        if (callback && isVisible) {
                            callback(isVisible);
                        }
                    });
                }, options);
                observers.set(
                    id,
                    (instance = {
                        id: id,
                        observer: observer,
                        elements: elements,
                    })
                );
                return instance;
            }

            /***/
        },

        /***/ 1618: /***/ function (
            __unused_webpack_module,
            __webpack_exports__,
            __webpack_require__
        ) {
            "use strict";
            __webpack_require__.r(__webpack_exports__);
            /* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ =
                __webpack_require__(4512);
            /* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_1__ =
                __webpack_require__(2865);

            /* harmony default export */ __webpack_exports__["default"] =
                function () {
                    return /*#__PURE__*/ (0,
                    react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
                        children: /*#__PURE__*/ (0,
                        react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                            next_link__WEBPACK_IMPORTED_MODULE_1__.default,
                            {
                                href: "/dynamic/no-chunk",
                                children: /*#__PURE__*/ (0,
                                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                    "a",
                                    {
                                        children: "No Chunk",
                                    }
                                ),
                            }
                        ),
                    });
                };

            /***/
        },

        /***/ 9575: /***/ function (
            __unused_webpack_module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            (window.__NEXT_P = window.__NEXT_P || []).push([
                "/dynamic",
                function () {
                    return __webpack_require__(1618);
                },
            ]);

            /***/
        },

        /***/ 2865: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            module.exports = __webpack_require__(3824);

            /***/
        },
    },
    /******/ function (__webpack_require__) {
        // webpackRuntimeModules
        /******/ var __webpack_exec__ = function (moduleId) {
            return __webpack_require__((__webpack_require__.s = moduleId));
        };
        /******/ __webpack_require__.O(0, [774, 888, 179], function () {
            return __webpack_exec__(9575);
        });
        /******/ var __webpack_exports__ = __webpack_require__.O();
        /******/ _N_E = __webpack_exports__;
        /******/
    },
]);
